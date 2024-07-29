const DISPLAY_MODE_VALUE_SUM = 1,
    DISPLAY_MODE_QUANTITY_SUM = 2,
    DISPLAY_MODE_LINE_COUNT = 3,
    DISPLAY_MODE_ORDER_COUNT = 4,
    DISPLAY_MODE_PERCENTAGE_FULL = 5,
    DISPLAY_MODE_PERCENTAGE_FILTER = 6

const DISPLAY_MODES = [{
    label: 'Order Value £',
    value: DISPLAY_MODE_VALUE_SUM,
    children: [{
        label: '% of Full Order Book',
        value: DISPLAY_MODE_PERCENTAGE_FULL
    }, {
        label: '% of Filtered Order Book',
        value: DISPLAY_MODE_PERCENTAGE_FILTER
    }]
}, {
    label: 'Order Quantity',
    value: DISPLAY_MODE_QUANTITY_SUM,
    children: []
}, {
    label: 'No. of Lines',
    value: DISPLAY_MODE_LINE_COUNT,
    children: []
}, {
    label: 'No. of Orders',
    value: DISPLAY_MODE_ORDER_COUNT,
    children: []
}]

const orderBookViewModel = (() => {

    //#region Properties

    let self = {};

    self.busy = ko.observable(false);

    let emptyParams = {
        dateBasis: 'O'
    };

    self.userDefinedFilters = orderBookUserDefinedFiltersViewModel({ parent: self, params: emptyParams });

    window.udf = self.userDefinedFilters;

    let loadedConfig = window.localStorage.getItem("orderBookDisplayConfig");

    if (loadedConfig == null) {
        self.displayConfig = {
            totals: [DISPLAY_MODE_VALUE_SUM],
            dates: [DISPLAY_MODE_VALUE_SUM, DISPLAY_MODE_ORDER_COUNT],
            datesCollapse: false,
            pods: [DISPLAY_MODE_VALUE_SUM, DISPLAY_MODE_ORDER_COUNT],
            podsCollapse: false,
            podTabIndex: 0,
            sales: [DISPLAY_MODE_VALUE_SUM, DISPLAY_MODE_ORDER_COUNT],
            salesCollapse: false,
            gridCollapse: false,
            orderGroups: [],
            columnHeadings: []
        }

        window.localStorage.setItem("orderBookDisplayConfig", JSON.stringify(self.displayConfig));
    } else {
        self.displayConfig = JSON.parse(loadedConfig);
    }


    self.displayModes = ko.observableArray(self.displayConfig.totals); // this now belongs to just the main summary grid Totals segment at the top


    self.datesDisplayModes = ko.observableArray(self.displayConfig.dates); // this now belongs to just the main summary grid Totals segment at the top
    self.datesCollapse = ko.observable(self.displayConfig.datesCollapse);
    self.dateFilters = orderBookDateFiltersViewModel(self);


    self.podsDisplayModes = ko.observableArray(self.displayConfig.pods); // this now belongs to just the main summary grid Totals segment at the top
    self.podsCollapse = ko.observable(self.displayConfig.podsCollapse);
    self.preDefinedFilters = orderBookPreDefinedFiltersViewModel(self);
    self.podTabIndex = ko.observable(self.displayConfig.podTabIndex);


    self.salesDisplayModes = ko.observableArray(self.displayConfig.sales); // this now belongs to just the main summary grid Totals segment at the top
    self.salesCollapse = ko.observable(self.displayConfig.salesCollapse);
    self.salesFilters = orderBookPreDefinedFiltersViewModel(self);


    self.gridCollapse = ko.observable(self.displayConfig.gridCollapse);


    window.pdf = self.preDefinedFilters;

    self.columnHeadings = ko.observableArray([]);

    self.displayColumnHeadings = ko.observableArray([].slice.call(self.displayConfig.columnHeadings));

    self.rowHeadings = ko.observableArray([]);

    self.results = ko.observableArray([]);

    self.accurateAsOfDateTime = ko.observable();

    self.accuracyCheckInterval = null;

    self.accuracyMessage = ko.observable();

    self.inaccuracyMilliseconds = null;

    self.defaultView = ko.observable();

    self.defaultProcedure = ko.observable();

    self.detailModalElement = document.querySelector("#order-book-detail-modal");

    self.detailModalTitleElement = document.querySelector("#order-book-detail-modal-title");

    self.detailModaliFrameTargetElement = document.querySelector("#order-book-detail-iframe-target");

    self.detailModaliFrame = null;

    self.detailModal = bootstrap.Modal.getOrCreateInstance(self.detailModalElement);

    self.detailModalBusy = ko.observable(false);

    self.displayColumnHeadingsSelection = ko.observableArray([].slice.call(self.displayConfig.columnHeadings));

    self.availableDisplayModes = ko.observableArray(DISPLAY_MODES),

    //#endregion


    //#region Components

    self.displayColumnHeadingsParams = {
        widget: ko.observable(),
        btnMarkup: `<i class="bi bi-collection ms-auto"></i>`,
        displayClass: null,
        elementId: "column-groups-btn",
        controls: {
            selectAll: () => {
                //console.log('selectAll');
                self.displayColumnHeadingsSelection(self.columnHeadings().map(d => d.orderStatusGroupId));
            },
            deselectAll: () => {
                //console.log('deselectAll');
                self.displayColumnHeadingsSelection([]);
            },
            applySelection: (hide) => {
                //console.log('apply');
                if (hide != false) {
                    bootstrap.Dropdown.getOrCreateInstance(self.displayColumnHeadingsSelection.DOMElement).hide();
                }

                let a = JSON.stringify(self.displayColumnHeadings());
                let b = JSON.stringify(self.displayColumnHeadingsSelection());

                if (a != b) {
                    self.displayColumnHeadings(JSON.parse(b));
                    self.fetch(self.userDefinedFilters.json());
                }
            }
        },
        observableArray: self.displayColumnHeadingsSelection,
        options: self.columnHeadings
    }

    //#endregion


    //#region Computeds

    self.orderStatuses = ko.computed(() => {
        return self.columnHeadings().flatMap(ch => ch.orderStatuses);
    }, self);

    self.visibleColumns = ko.computed(() => {
        let result = self.columnHeadings().filter(ch => self.displayColumnHeadings().indexOf(ch.orderStatusGroupId) > -1);
        return result;
    }, self);

    self.visibleOrderStatuses = ko.computed(() => {
        return self.visibleColumns().flatMap(ch => ch.orderStatuses);
    }, self);

    self.visibleColumnsJson = ko.computed(() => {
        return JSON.stringify(self.visibleColumns());
    });

    self.displayComputer = ko.computed(() => {

        let orderGroups = self.rowHeadings();

        let totals = self.displayModes();
        let dates = self.datesDisplayModes();
        let datesCollapse = self.datesCollapse();
        let pods = self.podsDisplayModes();
        let podsCollapse = self.podsCollapse();
        let podTabIndex = self.podTabIndex();
        let sales = self.salesDisplayModes();
        let salesCollapse = self.salesCollapse();

        let gridCollapse = self.gridCollapse();

        let columnHeadings = self.displayColumnHeadings();

        if (orderGroups.length) {

            let result = {
                totals: totals,
                dates: dates,
                datesCollapse: datesCollapse,
                pods: pods,
                podsCollapse: podsCollapse,
                podTabIndex: podTabIndex,
                sales: sales,
                salesCollapse: salesCollapse,
                gridCollapse: gridCollapse,
                orderGroups: orderGroups.map(h => {
                    return {
                        orderGroupId: h.orderGroupId,
                        displayModes: h.displayModes(),
                        collapsed: h.collapsed()
                    }
                }),
                columnHeadings: columnHeadings
            }

            self.displayConfig = result;

            window.localStorage.setItem("orderBookDisplayConfig", JSON.stringify(self.displayConfig));
        }

    }, self);

    //#endregion


    //#region Subscriptions

    self.displayModes.subscribe(changes => {
        if (changes.find(c => c.status == 'deleted' && c.value == DISPLAY_MODE_VALUE_SUM)) {
            self.displayModes.remove(dm => {
                return dm == DISPLAY_MODE_PERCENTAGE_FULL || dm == DISPLAY_MODE_PERCENTAGE_FILTER;
            });
        }
    }, self, 'arrayChange');

    self.userDefinedFilters.json.subscribe((nv) => {
        self.fetch(nv);
    });

    self.columnHeadings.subscribe(nv => {
        if (self.displayColumnHeadings().length == 0) {
            let orderStatusGroupIds = nv.map((c, i) => c.orderStatusGroupId);
            self.displayColumnHeadings(orderStatusGroupIds);
        }
    });

    //self.displayColumnHeadingsJson.subscribe(nv => {
    //    self.fetch(self.userDefinedFilters.json());
    //});

    //#endregion


    //#region Validation Groups



    //#endregion


    //#region Functions

    //self.getVisibleGrandTotal = () => {
    //    let orderStatusGroupIds = self.visibleColumns().map(vc => vc.orderStatusGroupId);

    //    let records = self.results().filter(r => {
    //        return (
    //            orderStatusGroupIds.indexOf(r.OrderStatusGroupID) > -1 &&
    //            r.OrderStatusID == null &&
    //            r.StockLocationGroupID == null &&
    //            r.OrderGroupID == null
    //        );
    //    });

    //    let result = records.reduce((a, i) => {
    //        a.OrderValue += +(i.OrderValue.replace(/[^\d.]*/g, ''));
    //        a.LineCount += +(i.LineCount.replace(/[^\d.]*/g, ''));
    //        a.OrderCount += +(i.OrderCount.replace(/[^\d.]*/g, ''));
    //        a.OrderQuantity += +(i.OrderQuantity.replace(/[^\d.]*/g, ''));
    //        a.PercentageOfFilteredOrderBook += +(i.PercentageOfFilteredOrderBook.replace(/[^\d.]*/g, ''));
    //        a.PercentageOfFullOrderBook += +(i.PercentageOfFullOrderBook.replace(/[^\d.]*/g, ''));
    //        return a;
    //    }, {
    //        OrderValue: 0,
    //        LineCount: 0,
    //        OrderCount: 0,
    //        OrderQuantity: 0,
    //        PercentageOfFilteredOrderBook: 0,
    //        PercentageOfFullOrderBook: 0
    //    });

    //    result.OrderValue = formatCurrency(result.OrderValue, 0, 'en-GB', 'GBP');
    //    result.LineCount = formatNumber(result.LineCount, 0, 'en-GB');
    //    result.OrderCount = formatNumber(result.OrderCount, 0, 'en-GB');
    //    result.OrderQuantity = formatNumber(result.OrderQuantity, 0, 'en-GB');
    //    result.PercentageOfFilteredOrderBook = formatPercentage(result.PercentageOfFilteredOrderBook / 100, 1, 'en-GB');
    //    result.PercentageOfFullOrderBook = formatPercentage(result.PercentageOfFullOrderBook / 100, 1, 'en-GB');

    //    //console.log(result);

    //    return orderBookMainCell({
    //        parent: self,
    //        data: result,
    //        grouping: false
    //    });
    //}

    //self.getVisibleSubTotal = (orderGroupId, stockLocationGroupId) => {
    //    let orderStatusGroupIds = self.visibleColumns().map(vc => vc.orderStatusGroupId);

    //    let records = self.results().filter(r => {
    //        return (
    //            orderStatusGroupIds.indexOf(r.OrderStatusGroupID) > -1 &&
    //            r.OrderStatusID == null &&
    //            r.StockLocationGroupID == stockLocationGroupId &&
    //            r.OrderGroupID == orderGroupId
    //        );
    //    });

    //    let result = records.reduce((a, i) => {
    //        a.OrderValue += +(i.OrderValue.replace(/[^\d.?\d?]*/g, ''));
    //        a.LineCount += +(i.LineCount.replace(/[^\d.?\d?]*/g, ''));
    //        a.OrderCount += +(i.OrderCount.replace(/[^\d.?\d?]*/g, ''));
    //        a.OrderQuantity += +(i.OrderQuantity.replace(/[^\d.?\d?]*/g, ''));
    //        a.PercentageOfFilteredOrderBook += +(i.PercentageOfFilteredOrderBook.replace(/[^\d.?\d?]*/g, ''));
    //        a.PercentageOfFullOrderBook += +(i.PercentageOfFullOrderBook.replace(/[^\d.?\d?]*/g, ''));
    //        return a;
    //    }, {
    //        OrderValue: 0,
    //        LineCount: 0,
    //        OrderCount: 0,
    //        OrderQuantity: 0,
    //        PercentageOfFilteredOrderBook: 0,
    //        PercentageOfFullOrderBook: 0
    //    });

    //    result.OrderValue = formatCurrency(result.OrderValue, 0, 'en-GB', 'GBP');
    //    result.LineCount = formatNumber(result.LineCount, 0, 'en-GB');
    //    result.OrderCount = formatNumber(result.OrderCount, 0, 'en-GB');
    //    result.OrderQuantity = formatNumber(result.OrderQuantity, 0, 'en-GB');
    //    result.PercentageOfFilteredOrderBook = formatPercentage(result.PercentageOfFilteredOrderBook / 100, 1, 'en-GB');
    //    result.PercentageOfFullOrderBook = formatPercentage(result.PercentageOfFullOrderBook / 100, 1, 'en-GB');

    //    //console.log(result);

    //    return orderBookMainCell({
    //        parent: self,
    //        data: result,
    //        grouping: false
    //    });
    //}

    self.toggleDates = (data, event) => {
        event.currentTarget.classList.toggle('collapsed');

        bootstrap.Collapse.getOrCreateInstance('#header-accordion-one').toggle();

        self.datesCollapse(event.currentTarget.classList.contains('collapsed'));
    }

    self.togglePrompts = (data, event) => {
        event.currentTarget.classList.toggle('collapsed');

        bootstrap.Collapse.getOrCreateInstance('#header-accordion-two').toggle();

        self.podsCollapse(event.currentTarget.classList.contains('collapsed'));
    }

    self.toggleSales = (data, event) => {
        event.currentTarget.classList.toggle('collapsed');

        bootstrap.Collapse.getOrCreateInstance('#header-accordion-three').toggle();

        self.salesCollapse(event.currentTarget.classList.contains('collapsed'));
    }

    self.toggleGrid = (data, event) => {
        event.currentTarget.classList.toggle('collapsed');

        bootstrap.Collapse.getOrCreateInstance('#main-grid-container-wrapper').toggle();

        self.gridCollapse(event.currentTarget.classList.contains('collapsed'));
    }

    self.hideValueDropdowns = (data, event) => {

        let showing = event.currentTarget.parentNode.querySelector('.display-mode-list');

        document.querySelectorAll('.display-mode-list').forEach(el => {
            if (el != showing) {
                el.classList.remove('show');
            }
        });

        return true;
    }

    self.toggleOrderGroupCollapse = (data, event) => {
        let totalToggleEl = document.querySelector('.first-column.grand-total-row');

        event.currentTarget.classList.toggle('collapsed');

        bootstrap.Collapse.getOrCreateInstance(`.order-group-${data.orderGroupId}`).toggle();

        totalToggleEl.classList.toggle('collapsed');

        //if (document.querySelector(`.order-group-${data.orderGroupId}`).classList.contains('collapsing')) {
        //    totalToggleEl.classList.remove('collapsed');
        //    data.collapsed(true);
        //} else {
        //    totalToggleEl.classList.add('collapsed');
        //    data.collapsed(false);
        //}
    }

    self.toggleAllOrderGroups = () => {

        let toggleEl = document.querySelector('.first-column.grand-total-row')

        let collapseElementList = [].slice.call(document.querySelectorAll('.order-group-collapsible'));

        let collapseList = collapseElementList.map(e => bootstrap.Collapse.getOrCreateInstance(e));

        toggleEl.classList.toggle('collapsed');

        if (toggleEl.classList.contains('collapsed')) {

            collapseList.forEach(cl => {
                cl.hide();
            });

            document.querySelectorAll('.order-group-heading.order-group-row').forEach(el => el.classList.add('collapsed'));

        } else {

            collapseList.forEach(cl => {
                cl.show();
            });

            document.querySelectorAll('.order-group-heading.order-group-row').forEach(el => el.classList.remove('collapsed'));

        }
    }

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

        self.inaccuracyMilliseconds = 0;

        self.accurateAsOfDateTime(result.AccurateAsOfDT);

        self.defaultView(result.Defaults.View);
        self.defaultProcedure(result.Defaults.Procedure);

        let rowHeadings = result.RowHeadings.reduce((array, current) => {
            let extant = array.find(gh => gh.orderGroupId == current.OrderGroupID);
            if (extant) {
                extant.stockLocationGroups.push({
                    stockLocationGroupId: current.StockLocationGroupID,
                    stockLocationGroupName: current.StockLocationGroupName,
                    stockLocationGroupSortOrder: current.StockLocationGroupSortOrder,
                    orderGroupId: current.OrderGroupID
                })
            } else {
                let displayConfig = self.displayConfig.orderGroups.find(og => og.orderGroupId == current.OrderGroupID);

                let rowHeading = {
                    orderGroupId: current.OrderGroupID,
                    orderGroupName: current.OrderGroupName,
                    orderGroupSortOrder: current.OrderGroupSortOrder,
                    stockLocationGroupId: current.StockLocationGroupID,
                    displayModes: ko.observableArray(displayConfig?.displayModes ?? [DISPLAY_MODE_VALUE_SUM]),
                    collapsed: ko.observable(displayConfig?.collapsed ?? false),
                    stockLocationGroups: [{
                        stockLocationGroupId: current.StockLocationGroupID,
                        stockLocationGroupName: current.StockLocationGroupName,
                        stockLocationGroupSortOrder: current.StockLocationGroupSortOrder,
                        orderGroupId: current.OrderGroupID
                    }]
                }

                rowHeading.displayModes.subscribe(changes => {
                    if (changes.find(c => c.status == 'deleted' && c.value == DISPLAY_MODE_VALUE_SUM)) {
                        rowHeading.displayModes.remove(dm => {
                            return dm == DISPLAY_MODE_PERCENTAGE_FULL || dm == DISPLAY_MODE_PERCENTAGE_FILTER;
                        });
                    }
                }, self, 'arrayChange');

                array.push(rowHeading);
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
                    view: current.View,
                    procedure: current.Procedure
                })
            } else {
                array.push({
                    orderStatusGroupId: current.OrderStatusGroupID,
                    orderStatusGroupName: current.OrderStatusGroupName,
                    orderStatusGroupSortOrder: current.OrderStatusGroupSortOrder,
                    view: current.View,
                    procedure: current.Procedure,
                    disabled: ko.computed(() => {
                        return self.displayColumnHeadingsSelection().length == 1 && self.displayColumnHeadingsSelection()[0] === current.OrderStatusGroupID;
                    }, self),
                    orderStatuses: [{
                        orderStatusId: current.OrderStatusID,
                        orderStatusName: current.OrderStatusName,
                        orderStatusSortOrder: current.OrderStatusSortOrder,
                        orderStatusGroupId: current.OrderStatusGroupID,
                        view: current.View,
                        procedure: current.Procedure
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
                    orderStatusGroupId: ch.orderStatusGroupId,
                    view: "view-one",
                    procedure: "ViewOne"
                })
            }

            ch.orderStatuses.sort((a, b) => {
                return a.orderStatusSortOrder < b.orderStatusSortOrder ? -1 : 1;
            });
        });

        self.results(result.Data.map(d => orderBookMainCell({
            parent: self.rowHeadings().find(rh => rh.orderGroupId == d.OrderGroupID) ?? self, // I want parent from here to be the rowHeading the cell resides in
            data: d
        })));

        // this will only be true on the first run through
        if (self.columnHeadings().length == 0) {
            self.columnHeadings(columnHeadings);
        }
    }

    self.fetch = (params) => {

        self.busy(true);

        let body = JSON.parse(params);

        body.orderLineDetailedStatusGroupIds = self.displayColumnHeadings();

        console.log("FetchMain calling with", body);

        fetch("/api/orderbook/Refresh", {
            method: "POST",
            headers: window.fetchHeaders,
            cache: 'no-store',
            credentials: 'same-origin',
            body: JSON.stringify(body)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log("FetchMain returned", data);
                self.dateFilters.parse(data.dateFilters);
                self.preDefinedFilters.parse(data.preDefinedFilters);

                bootstrap.Collapse.getOrCreateInstance(document.querySelector("#accuracy-collapse")).hide();

                self.parse(data.mainResult);

                window.setTimeout(() => {
                    self.busy(false);
                }, 0);
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

    self.refresh = () => {
        self.fetch(self.userDefinedFilters.json());
    }

    self.showDetail = (cell) => {
        console.log("showDetail called", cell);

        let iFrame = document.createElement("iframe");

        let params = JSON.parse(self.userDefinedFilters.json());

        let view = cell.view ?? self.defaultView();
        let procedure = cell.procedure ?? self.defaultProcedure();
        let filterable = cell.filterable ?? true;

        let preDefinedFilterCriteria = {
            displayModes: self.displayModes(),
            orderLineDetailedStatusGroupIds: self.visibleColumns().map(v => v.orderStatusGroupId),
            accurateAsOfDateTime: self.accurateAsOfDateTime(),
            procedure: procedure,
            view: view,
            filterable: filterable
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

        self.detailModaliFrame = iFrame;

        self.detailModal.show();
    }

    self.exportDetail = () => {
        
        self.detailModaliFrame.contentWindow.postMessage({
            action: 'exportDetail'
        });
    }

    self.copyLink = () => {

        self.detailModaliFrame.contentWindow.postMessage({
            action: 'copyLink'
        });

    }

    self.toggleFilters = () => {

        self.detailModaliFrame.contentWindow.postMessage({
            action: 'toggleFilters'
        });

    }

    //#endregion


    //#region Events

    self.fetch(self.userDefinedFilters.json());

    document.addEventListener('setDetailModalTitle', (e) => {
        self.detailModalTitleElement.innerHTML = e.detail.join("");
    }, false);

    document.addEventListener('copyLinkToClipboard', async (e) => {
        await self.writeClipboardText(e.detail.text);
    }, false);

    document.addEventListener('click', async (e) => {
        let ele = document.getElementById("copy-to-clipboard-btn");
        if (ele) {
            let bstt = bootstrap.Tooltip.getOrCreateInstance(ele);
            if (bstt) {
                bstt.hide();
            }
        }
    }, false);

    self.writeClipboardText = async (text) => {
        try {
            await navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}${text}`)
                .then(ev => {
                    console.log("copied link to clipboard", text);
                    let ele = document.getElementById("copy-to-clipboard-btn");
                    let bstt = bootstrap.Tooltip.getOrCreateInstance(ele);
                    bstt.show();
                });
        } catch (error) {
            window.showError(error.message);
        }
    }

    self.accuracyCheck = () => {
        fetch("/api/orderbook/AccuracyCheck", {
            method: "POST",
            headers: window.fetchHeaders,
            cache: 'no-store',
            credentials: 'same-origin'
        })
            .then(window.handleFetchResponse)
            .then(data => {

                console.log("accuracyCheckInterval returned", data);

                let currentTimeMs = Date.parse(self.accurateAsOfDateTime());

                let newTimeMs = Date.parse(data);

                console.log("accuracyCheckInterval current", currentTimeMs, " new ", newTimeMs);

                // if the data has remained stale for e.g. an hour, then there's a problem
                // so we should, regardless of what the user's preference for nag screens is, nag them
                // to tell them that the data is now e.g. an hour stale and should've been updated 45 minutes ago.

                let nagBlocked = document.cookie.split(';').find(c => c.indexOf('orderBookNag') === 0)?.split('=')[1] === "false";

                if (!nagBlocked) {
                    if (newTimeMs > currentTimeMs) {
                        // newer data is available, prompt the user - unless they've specifically asked you not to
                        self.accuracyMessage(`<p>Newer data is available. Would you like to refresh your view now?</p>
                        <p><span class="bold">Current view was accurate: </span>${moment(new Date(currentTimeMs)).format("DD/MM/YYYY HH:mm:ss")}</p>                        
                        <p><span class="bold">Refresh to update to: </span>${moment(new Date(newTimeMs)).format("DD/MM/YYYY HH:mm:ss")}</p>                        
                    `);
                        bootstrap.Collapse.getOrCreateInstance(document.querySelector("#accuracy-collapse")).show();
                    }
                } else {
                    console.log("data accuracy reminder is disabled");
                }

                if (newTimeMs > currentTimeMs) {
                    self.inaccuracyMilliseconds = 0;
                }
            })
            .catch(window.catchFetchError);
    }

    self.accuracyPleaseStopRemindingMe = () => {
        window.showConfirm('Are you sure?', 'This will disable the Order Book data accuracy reminder for 24 hours.', () => {
            bootstrap.Collapse.getOrCreateInstance(document.querySelector("#accuracy-collapse")).hide();
            document.cookie = "orderBookNag=false; max-age=86400";
        }, () => {

        });
    }

    self.accuracyRefresh = () => {
        bootstrap.Collapse.getOrCreateInstance(document.querySelector("#accuracy-collapse")).hide();
        self.refresh();
    }

    self.inaccuracyTimer = window.setInterval(() => {
        self.inaccuracyMilliseconds += 1000;

        if (self.inaccuracyMilliseconds > 3600000) {
            bootstrap.Collapse.getOrCreateInstance(document.querySelector("#accuracy-error-collapse")).show();
            //window.showError("More accurate data should be available by now but doesn't appear to be. Please contact <a href='mailto:itsupport@designersguild.com'>itsupport@designersguild.com</a>.");
            self.inaccuracyMilliseconds = 0;
        }
    }, 1000);

    self.accuracyCheckInterval = window.setInterval(
        self.accuracyCheck
        , 900000); // this is 15m in ms
        //, 10000); // this is 10s in ms

    //#endregion

    return self;
});