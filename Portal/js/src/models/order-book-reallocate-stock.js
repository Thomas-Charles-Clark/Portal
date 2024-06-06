const DISPLAY_MODE_VALUE_SUM = 1,
    DISPLAY_MODE_QUANTITY_SUM = 2,
    DISPLAY_MODE_LINE_COUNT = 3,
    DISPLAY_MODE_ORDER_COUNT = 4,
    DISPLAY_MODE_PERCENTAGE_FULL = 5,
    DISPLAY_MODE_PERCENTAGE_FILTER = 6

const groupedDetailColumn = ({
    parent,
    group,
    dataSet,
    displayModes,
    gridHeaderHeightObservable,
    originalGridHeaderHeight,
    rowHeightObservable,
    originalRowHeight,
    rowPaddingY,
    lineHeight,
    borderWidth
} = {
        group: {},
        dataSet: [],
        displayModes: [],
        gridHeaderHeightObservable: ko.observable(),
        originalGridHeaderHeight: 57,
        rowHeightObservable: ko.observable(),
        originalRowHeight: 36,
        rowPaddingY: 14,
        lineHeight: 21,
        borderWidth: 1
    }) => {

    let self = {
        parent: parent
    };

    self.columnName = group.columnName;

    self.columnNameDisplay = self.columnName.replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, '$1$4 $2$3$5');

    self.detailColumns = ko.observableArray(group.columns.map(cn => {
        return detailColumn({
            propertyName: cn,
            dataSet: dataSet
        })
    }));

    self.total = ko.computed(() => {
        return self.detailColumns().reduce((a, i) => a += (i.isNaN ? null : i.total), 0);
    }, self);

    self.buildTotalReducer = (paramName) => {
        var reducer = (a, i) => a += (i.columnName == `${self.columnName}_${paramName}`) ? (i.isNaN ? 0 : +i.total) : 0;
        
        return reducer;
    };

    self.displayModes = displayModes;

    self.originalGridHeaderHeight = originalGridHeaderHeight;

    self.gridHeaderHeightObservable = gridHeaderHeightObservable;

    self.originalRowHeight = originalRowHeight;

    self.rowHeightObservable = rowHeightObservable;

    self.rowPaddingY = rowPaddingY;

    self.lineHeight = lineHeight;

    self.borderWidth = borderWidth;

    self.displayModes.subscribe(nv => {
        self.rowHeightObservable(self.rowPaddingY + (self.lineHeight * nv.length) + self.borderWidth);
        self.gridHeaderHeightObservable(self.originalGridHeaderHeight + self.rowHeightObservable());



        let cumulativeHeight = 0;

        let gridHeaderHeight = self.gridHeaderHeightObservable();

        let rowHeight = self.rowHeightObservable();

        let startingOffset = gridHeaderHeight;

        let additionalOffset = startingOffset;

        self.parent.virtualScroller.searchResults().forEach((result, index) => {

            result.offsetY = (((index) * rowHeight) + additionalOffset) - gridHeaderHeight + rowHeight;

            result.originalOffsetY = result.offsetY;

            cumulativeHeight += rowHeight;

            result.runningHeight = cumulativeHeight;
        });
    });

    self.displayTotal = ko.computed(() => {
        let displayModes = self.parent.displayModes();

        let result = [];

        if (self.total()) {

            if (displayModes.indexOf(DISPLAY_MODE_VALUE_SUM) > -1) {
                let reducer = self.buildTotalReducer("OrderValue");
                let value = self.detailColumns().reduce(reducer, 0);
                result.push(`<span>${formatCurrency(value, 0, 'en-GB', 'GBP')}</span>`);
            }

            if (displayModes.indexOf(DISPLAY_MODE_QUANTITY_SUM) > -1) {
                let reducer = self.buildTotalReducer("OrderQuantity");
                let value = self.detailColumns().reduce(reducer, 0);
                result.push(`<span>${formatNumber(value, 2) }</span>`);
            }

            if (displayModes.indexOf(DISPLAY_MODE_LINE_COUNT) > -1) {
                let reducer = self.buildTotalReducer("LineCount");
                let value = self.detailColumns().reduce(reducer, 0);
                result.push(`<span>${formatNumber(value, 0) }</span>`);
            }

            if (displayModes.indexOf(DISPLAY_MODE_ORDER_COUNT) > -1) {
                let reducer = self.buildTotalReducer("OrderCount");
                let value = self.detailColumns().reduce(reducer, 0);
                result.push(`<span>${formatNumber(value, 0) }</span>`);
            }
        }

        return result.join('<br/>');
    }, self);

    //self.display = ko.computed(() => {

    //}, self);


    //let sortFunctions = [];

    //columnNames.forEach(cn => {
    //    sortFunctions.push(self.generateSorting(cn));
    //});

    //self.allSortingOperations(sortFunctions.flat());


    return self;
};

const detailColumn = ({
    propertyName,
    dataSet
} = {
    propertyName: "MarketCode",
    dataSet: []
}) => {
    let self = {};

    self.columnName = propertyName;

    self.columnNameDisplay = propertyName.replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, '$1$4 $2$3$5');

    self.direction = ko.observable(); // undefined / "asc" / "desc"

    self.dataSet = dataSet;

    self.isNaN = self.columnName.indexOf("Number") > -1 ||
        self.columnName.indexOf("ID") > -1 ||
        dataSet.find(ds => isNaN(ds[self.columnName]));

    if (self.isNaN) {
        self.total = null;
    } else {

        self.total = dataSet.reduce((a, i) => {

            let b = +i[self.columnName];

            a = a + b;

            return a;

        }, 0);
    }

    return self;
};

const orderBookDetailViewModel = (() => {

    let self = {};

    self.params = window.getDetailParameters();

    let params = window.getDetailParameters();

    //#region Lifted Methods

    self.generateAscendingSortingOperation = (parameterName) => {
        return {
            direction: "asc",
            propertyName: parameterName,
            sortingFunction: (a, b) => {
                if (isNaN(+a[parameterName])) {
                    return a[parameterName] === b[parameterName] ? 0 : a[parameterName] > b[parameterName] ? 1 : -1;
                } else {
                    return +a[parameterName] === +b[parameterName] ? 0 : +a[parameterName] > +b[parameterName] ? 1 : -1;
                }
            }
        } 
    }

    self.generateDescendingSortingOperation = (parameterName) => {
        return {
            direction: "desc",
            propertyName: parameterName,
            sortingFunction: (a, b) => {
                if (isNaN(+a[parameterName])) {
                    return a[parameterName] === b[parameterName] ? 0 : a[parameterName] < b[parameterName] ? 1 : -1;
                } else {
                    return +a[parameterName] === +b[parameterName] ? 0 : +a[parameterName] < +b[parameterName] ? 1 : -1;
                }
            }
        }
    }

    self.generateSorting = (parameterName) => {
        return [
            self.generateAscendingSortingOperation(parameterName),
            self.generateDescendingSortingOperation(parameterName)
        ]
    }

    //#endregion

    //#region Properties

    self.procedure = self.params.procedure;

    self.busy = ko.observable(false);

    //self.displayModes = ko.observableArray(self.params.displayModes && self.params.displayModes.length > 0
    //    ? self.params.displayModes.split(',').map(dm => +dm)
    //    : [DISPLAY_MODE_VALUE_SUM]
    //);

    self.displayModes = ko.observableArray([DISPLAY_MODE_QUANTITY_SUM]);

    self.userDefinedFilters = orderBookUserDefinedFiltersViewModel({ parent: self, params: self.params });

    self.advancedFilters = orderBookAdvancedFiltersViewModel({ parent: self, params: self.params });

    self.results = ko.observableArray([]);

    self.accurateAsOfDateTime = ko.observable(self.params.accurateAsOfDateTime ?? undefined);

    self.columns = ko.observableArray([]);

    self.allSortingOperations = ko.observableArray([]);

    self.noResults = ko.observable(false);

    self.originalRowHeight = 36;

    self.rowHeight = ko.observable(self.originalRowHeight);

    self.originalGridHeaderHeight = 57;

    self.gridHeaderHeight = ko.observable(93); // 57 header + 36 total row

    self.rowPaddingY = 14;

    self.lineHeight = 21;

    self.borderWidth = 1;

    // if multiple column sort chaining is desired, this must be done by nesting within the one sort function.
    // suggest allowing sorting by two columns at most.
    // this would look something like:
    //
    /*

    activeSortingOperation = (a, b) => {
    
        if (a.prop > b.prop)
            return 1;
        if (a.prop < b.prop)
            return -1;
    
        if (a.prop2 < b.prop2)
            return -1;
        if (a.prop2 > b.prop2)
            return 1;
         
        return 0;

    }
    
    */
    self.activeSortingOperation = ko.observable();

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

    self.primaryFetchParams = ko.computed(() => {

        let udf = null;

        if (self.userDefinedFilters.json()) {
            udf = JSON.parse(self.userDefinedFilters.json());
        }

        let adv = null;

        if (self.advancedFilters.json()) {
            adv = JSON.parse(self.advancedFilters.json());
        }

        if (udf && adv) {
            console.log('primaryFetchParams computed');

            return JSON.stringify(Object.assign(window.getDetailParameters() , udf, adv, { procedure: self.procedure }));
        }
    }, self).extend({
        rateLimit: {
            timeout: 100,
            method: 'notifyWhenChangesStop'
        }
    });

    //#endregion


    //#region Components

    self.virtualScrollerContainer = document.getElementById("order-book-detail-scroller-container")

    self.columnNameGroupingRegex = /^(\w*_)?/gm;

    self.virtualScroller = virtualScrollingDeferredDataFactory({
        busy: self.busy,
        tableSelector: "#order-book-detail-table",
        rowHeight: self.rowHeight,
        primaryFetchParams: self.primaryFetchParams,
        primaryFetchEndpoint: "/api/orderbook/DetailRefresh",
        primaryFetchResultSetName: "Data",
        primaryFetchSortFn: self.activeSortingOperation,
        primaryFetchBeforeFn: () => {
            self.columns([]);
        },
        primaryFetchAfterFn: (results) => {
            let rec = results.Data[0];

            self.accurateAsOfDateTime(results.AccurateAsOfDT);

            let groupedColumns = [];

            if (rec) {

                let columnNames = Object.keys(rec).filter(k => {
                    return ["offsetY", "originalOffsetY", "runningHeight"].indexOf(k) == -1;
                });

                let groups = Object.groupBy(columnNames, cn => {
                    let match = cn.match(self.columnNameGroupingRegex);
                    if (match != '') {
                        return match[0].replace('_', '');
                    } else {
                        return cn;
                    }
                });

                groupedColumns = Object.keys(groups).map(g => {
                    return {
                        columnName: g, columns: groups[g]
                    }
                });

                console.log(groupedColumns);

                groupedColumns = groupedColumns.map(gc => {
                    return groupedDetailColumn({
                        parent: self,
                        group: gc,
                        dataSet: results.Data,
                        displayModes: self.displayModes,
                        gridHeaderHeightObservable: self.gridHeaderHeight,
                        originalGridHeaderHeight: self.originalGridHeaderHeight,
                        rowHeightObservable: self.rowHeight,
                        originalRowHeight: self.originalRowHeight,
                        rowPaddingY: self.rowPaddingY,
                        lineHeight: self.lineHeight,
                        borderWidth: self.borderWidth
                    })
                });

            }
            else {
                self.noResults(true);
            }

            console.log("setting columns", groupedColumns);

            self.columns(groupedColumns);

            //window.setTimeout(() => {

            //    popoverTriggerList = [].slice.call(document.querySelectorAll('.popover-cell[data-bs-toggle="popover"]'))
            //    popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
            //        let dat = ko.contextFor(popoverTriggerEl).$parent;
            //        let popTrigger = new bootstrap.Popover(popoverTriggerEl, {
            //            html: true,
            //            content: `<div class="blocker" style="display: flex; opacity: 1">
            //            <div class="loading-spinner"></div>
            //            <h4 class="mt-3">
            //                Please wait...
            //            </h4>
            //        </div>`,
            //            trigger: 'hover focus click',
            //            container: popoverTriggerEl.closest('td')
            //        });

            //        popoverTriggerEl.addEventListener("shown.bs.popover", async (event) => {
            //            await self.fetchOrderLinePopoverContents(dat.BackOrder_OrderLineIDs)
            //                .then(data => {
            //                    console.log("promise resolved", data);
            //                });
            //        });

            //        return popTrigger;
            //    });
            //}, 0);
        },
        primaryFetchResultFn: (rec) => orderBookMainCell({ parent: self, data: rec, grouping: true }),
        container: self.virtualScrollerContainer,
        gridHeaderHeight: self.gridHeaderHeight,
        gridPositionTop: 0,
        maxYMultiplier: 1
    });

    //#endregion


    //#region Subscriptions

    self.userDefinedFilters.json.subscribe((nv) => {
        self.virtualScroller.reset();
        //self.fetch(nv);
    });

    //#endregion


    //#region Validation Groups



    //#endregion


    //#region Functions


    //self.fetch = (params) => {

    //    self.busy(true);

    //    console.log("FetchDetail calling with", JSON.parse(params));

    //    fetch("/api/orderbook/DetailRefresh", {
    //        method: "POST",
    //        headers: window.fetchHeaders,
    //        cache: 'no-store',
    //        credentials: 'same-origin',
    //        body: params
    //    })
    //        .then(window.handleFetchResponse)
    //        .then(data => {
    //            console.log("FetchMain returned", data);
    //            self.dateFilters.parse(data.dateFilters);
    //            self.preDefinedFilters.parse(data.preDefinedFilters);
    //            self.parse(data.mainResult);
    //            self.busy(false);
    //        })
    //        .catch((err) => {
    //            self.busy(false);
    //            window.catchFetchError(err);
    //        });
    //}

    self.reset = () => {
        window.showConfirm("Are you sure?", "This will clear all current filters and reset the Order Book display to defaults.", () => {
            self.userDefinedFilters.reset();
            self.advancedFilters.reset();
        }, null);
    };

    self.exportDetail = () => {
        self.busy(true);

        fetch("/api/orderbook/ExportToExcel", {
            method: "POST",
            headers: window.fetchHeaders,
            cache: 'no-store',
            credentials: 'same-origin',
            body: self.primaryFetchParams()
        })
            .then(response => response.blob())
            .then(blob => {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'DG-Order-Book.xlsx';
                link.click();
                self.busy(false);
                link.remove();
            })
            .catch((err) => {
                self.busy(false);
                window.catchFetchError(err);
            });
    }

    self.sortByColumn = (detailColumn) => {
        self.columns().forEach(c => {
            if (c != detailColumn) {
                c.direction(undefined);
            }
        });

        let direction = detailColumn.direction();

        let newDirection = null;

        switch (direction) {
            case 'asc':
                newDirection = 'desc';
                break;
            case 'desc':
                newDirection = undefined;
                break;
            default:
                newDirection = 'asc';
                break;
        }

        detailColumn.direction(newDirection);

        let operation = self.allSortingOperations().find(s => s.propertyName == detailColumn.columnName && s.direction == newDirection);
        
        if (operation)
            self.activeSortingOperation(operation.sortingFunction);
        else
            self.activeSortingOperation(undefined);
    }

    self.fetchOrderLinePopoverContents = (data) => {
        return new Promise((resolve, reject) => {
            self.busy(true);
            console.log("FetchOrderLinePopoverContents calling with", data);

            fetch('/api/orderbook/FetchOrderLinePopoverContents', {
                method: "POST",
                headers: window.fetchHeaders,
                cache: 'no-store',
                credentials: 'same-origin',
                body: JSON.stringify(data)
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    self.busy(false);
                    console.log("FetchOrderLinePopoverContents returned", data);
                    resolve(data);
                })
                .catch(err => {
                    self.busy(false);
                    window.catchFetchError(err);
                    reject();
                })
        });

    }

    self.fetchRingFencePopoverContents = (data) => {
        self.busy(true);

        fetch('/api/orderbook/FetchRingFencePopoverContents', {
            method: "POST",
            headers: window.fetchHeaders,
            cache: 'no-store',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                self.busy(false);
                console.log("FetchRingFencePopoverContents returned", data);
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
    }

    //#endregion


    //#region Events

    window.addEventListener('message', (e) => {
        e && e.data && e.data.action && e.data.action == 'exportDetail' && self.exportDetail();
    }, false);

    //#endregion

    return self;
});