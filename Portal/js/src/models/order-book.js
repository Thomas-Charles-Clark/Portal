const DISPLAY_MODE_VALUE_SUM = 1,
    DISPLAY_MODE_QUANTITY_SUM = 2,
    DISPLAY_MODE_LINE_COUNT = 3,
    DISPLAY_MODE_ORDER_COUNT = 4

const orderBookViewModel = (() => {

    //#region Properties

    let self = {};

    self.busy = ko.observable(false);

    self.displayModes = ko.observableArray([DISPLAY_MODE_VALUE_SUM]);

    let emptyParams = {
        dateBasis: 'O'
    };

    self.userDefinedFilters = orderBookUserDefinedFiltersViewModel({ parent: self, params: emptyParams });

    self.dateFilters = orderBookDateFiltersViewModel(self);

    self.preDefinedFilters = orderBookPreDefinedFiltersViewModel(self);

    self.columnHeadings = ko.observableArray([]);

    self.rowHeadings = ko.observableArray([]);

    self.results = ko.observableArray([]);

    self.accurateAsOfDateTime = ko.observable();

    self.detailModalElement = document.querySelector("#order-book-detail-modal");

    self.detailModalTitleElement = document.querySelector("#order-book-detail-modal-title");

    self.detailModaliFrameTargetElement = document.querySelector("#order-book-detail-iframe-target");

    self.detailModal = bootstrap.Modal.getOrCreateInstance(self.detailModalElement);

    self.detailModalBusy = ko.observable(false);

    //#endregion


    //#region Components



    //#endregion


    //#region Computeds

    self.displayModeDisplay = ko.computed(() => {
        let result = self.displayModes().length;
        let plural = 'ies';
        if (result == 1) {
            plural = 'y';
        }
        return `(${result} Propert${plural} Selected)`;
    }, self);

    self.orderStatuses = ko.computed(() => {
        return self.columnHeadings().flatMap(ch => ch.orderStatuses);
    }, self);

    //#endregion


    //#region Subscriptions

    self.userDefinedFilters.json.subscribe((nv) => {
        self.fetch(nv);
    });

    //#endregion


    //#region Validation Groups



    //#endregion


    //#region Functions

    self.getCell = (orderStatus, stockLocation) => {
        let record = null;

        record = self.results().find(r =>
            r.OrderStatusID == orderStatus.orderStatusId &&
            r.OrderStatusGroupID == orderStatus.orderStatusGroupId &&
            r.StockLocationGroupID == stockLocation?.stockLocationGroupId &&
            r.OrderGroupID == stockLocation?.orderGroupId);
        
        return record;
    } 

    self.parse = (result) => {

        self.accurateAsOfDateTime(result.AccurateAsOfDT);

        self.results(result.Data.map(d => orderBookMainCell({
            parent: self,
            data: d
        })));

        let rowHeadings = result.RowHeadings.reduce((array, current) => {
            let extant = array.find(gh => gh.orderGroupId == current.OrderGroupID);
            if (extant) {
                extant.stockLocationGroups.push({
                    stockLocationGroupId: current.StockLocationGroupID,
                    stockLocationGroupName: current.StockLocationGroupName,
                    stockLocationGroupSortOrder: current.StockLocationGroupSortOrder,
                    orderGroupId: current.OrderGroupID,
                    potato: 'a'
                })
            } else {
                array.push({
                    orderGroupId: current.OrderGroupID,
                    orderGroupName: current.OrderGroupName,
                    orderGroupSortOrder: current.OrderGroupSortOrder,
                    stockLocationGroupId: current.StockLocationGroupID,
                    potato: 'b',
                    stockLocationGroups: [{
                        stockLocationGroupId: current.StockLocationGroupID,
                        stockLocationGroupName: current.StockLocationGroupName,
                        stockLocationGroupSortOrder: current.StockLocationGroupSortOrder,
                        orderGroupId: current.OrderGroupID,
                        potato: 'c'
                    }]
                })
            }
            return array;
        }, []).sort((a, b) => {
            return a.orderGroupSortOrder < b.orderGroupSortOrder ? -1 : 1;
        });

        rowHeadings.forEach(rh => {
            rh.stockLocationGroups.sort((a, b) => {
                return a.stockLocationGroupSortOrder < b.stockLocationGroupSortOrder ? -1 : 1;
            });
        });

        self.rowHeadings(rowHeadings);

        let columnHeadings = result.ColumnHeadings.reduce((array, current) => {
            let extant = array.find(gh => gh.orderStatusGroupId == current.OrderStatusGroupID);
            if (extant) {
                extant.orderStatuses.push({
                    orderStatusId: current.OrderStatusID,
                    orderStatusName: current.OrderStatusName,
                    orderStatusSortOrder: current.OrderStatusSortOrder,
                    orderStatusGroupId: current.OrderStatusGroupID,
                    banana: 'a'
                })
            } else {
                array.push({
                    orderStatusGroupId: current.OrderStatusGroupID,
                    orderStatusGroupName: current.OrderStatusGroupName,
                    orderStatusGroupSortOrder: current.OrderStatusGroupSortOrder,
                    banana: 'b',
                    orderStatuses: [{
                        orderStatusId: current.OrderStatusID,
                        orderStatusName: current.OrderStatusName,
                        orderStatusSortOrder: current.OrderStatusSortOrder,
                        orderStatusGroupId: current.OrderStatusGroupID,
                        banana: 'c'
                    }]
                })
            }
            return array;
        }, []).sort((a, b) => {
            return a.orderStatusGroupSortOrder < b.orderStatusGroupSortOrder ? -1 : 1;
        });

        columnHeadings.forEach(ch => {
            if (ch.orderStatuses.length > 1) {
                ch.orderStatuses.push({
                    orderStatusId: null,
                    orderStatusName: "Total",
                    orderStatusSortOrder: ch.orderStatuses.length,
                    orderStatusGroupId: ch.orderStatusGroupId
                })
            }

            ch.orderStatuses.sort((a, b) => {
                return a.orderStatusSortOrder < b.orderStatusSortOrder ? -1 : 1;
            });
        });

        self.columnHeadings(columnHeadings);
    }

    self.fetch = (params) => {

        self.busy(true);

        console.log("FetchMain calling with", JSON.parse(params));

        fetch("/api/orderbook/Refresh", {
            method: "POST",
            headers: window.fetchHeaders,
            cache: 'no-store',
            credentials: 'same-origin',
            body: params
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log("FetchMain returned", data);
                self.dateFilters.parse(data.dateFilters);
                self.preDefinedFilters.parse(data.preDefinedFilters);
                self.parse(data.mainResult);
                self.busy(false);
            })
            .catch((err) => {
                self.busy(false);
                window.catchFetchError(err);
            });
    }

    self.reset = () => {
        window.showConfirm("Are you sure?", "This will clear all current filters and reset the Order Book display to defaults.", () => {
            self.userDefinedFilters.reset();
        }, null);
    };

    self.showDetail = (cell) => {
        let iFrame = document.createElement("iframe");

        let params = JSON.parse(self.userDefinedFilters.json());

        let view = 'back-orders';
        let procedure = 'BackOrders';

        let preDefinedFilterCriteria = {
            displayModes: self.displayModes(),
            accurateAsOfDateTime: self.accurateAsOfDateTime(),
            procedure: procedure
        };

        if (cell.hasOwnProperty('orderGroupId'))
            preDefinedFilterCriteria.orderGroupId = cell.orderGroupId;

        if (cell.hasOwnProperty('orderStatusGroupId'))
            preDefinedFilterCriteria.orderStatusGroupId = cell.orderStatusGroupId;

        if (cell.hasOwnProperty('orderStatusId'))
            preDefinedFilterCriteria.orderStatusId = cell.orderStatusId;

        if (cell.hasOwnProperty('stockLocationGroupId'))
            preDefinedFilterCriteria.stockLocationGroupId = cell.stockLocationGroupId;

        Object.assign(params, preDefinedFilterCriteria);

        let title = [];

        if (cell.orderStatusGroupName)
            title.push(`<span data-bind="attr: { title: 'OrderStatusGroupID: ${cell.orderStatusGroupId} - ${cell.orderStatusGroupName}' }">Order Status Group: ${cell.orderStatusGroupName}</span>`);

        if (cell.orderStatusName)
            title.push(`<span data-bind="attr: { title: 'OrderStatusID: ${cell.orderStatus} - ${cell.orderStatusName}' }">Order Status: ${cell.orderStatusName}</span>`);

        if (cell.orderGroupName)
            title.push(`<span data-bind="attr: { title: 'OrderGroupID: ${cell.orderGroupId} - ${cell.orderGroupName}' }">Order Group: ${cell.orderGroupName}</span>`);

        if (cell.stockLocationGroupName)
            title.push(`<span data-bind="attr: { title: 'StockLocationGroupID: ${cell.stockLocationGroupId} - ${cell.stockLocationGroupName}' }">Stock Location Group: ${cell.stockLocationGroupName}</span>`);

        self.detailModalTitleElement.innerHTML = title.join("");

        let qs = new URLSearchParams(params).toString();

        let src = `/order-book/detail/${view}?partial=true&${qs}`;

        console.log(src);

        iFrame.src = src;

        self.detailModalBusy(true);

        iFrame.onload = () => {
            self.detailModalBusy(false);
        }

        self.detailModaliFrameTargetElement.replaceChildren(iFrame);

        self.detailModal.show();
    }

    //#endregion


    //#region Events

    self.parse(window.getMainResult());

    document.addEventListener('setDetailModalTitle', (e) => {
        self.detailModalTitleElement.innerHTML = e.detail.join("");
    }, false);

    //#endregion

    return self;
});