const DISPLAY_MODE_VALUE_SUM = 1,
    DISPLAY_MODE_QUANTITY_SUM = 2,
    DISPLAY_MODE_LINE_COUNT = 3,
    DISPLAY_MODE_ORDER_COUNT = 4,
    DISPLAY_MODE_PERCENTAGE_FULL = 5,
    DISPLAY_MODE_PERCENTAGE_FILTER = 6

const filterButton = ({
    rec,
    parent,
    active
} = {
    rec: {},
    parent: null,
    active: false
}) => {
    let self = Object.assign({
        active: active,
        parent: parent,
        typeName: "filterButton"
    }, rec);

    self.criteria = JSON.parse(self.Criteria);

    self.load = () => {
        self.parent.busy(true);
        if (self.ProductLifeCycleID) {
            self.parent.userDefinedFilters.productLifeCycleId(`${self.ProductLifeCycleID}`);
        } else {
            self.parent.userDefinedFilters.productLifeCycleId(``);
        }
    }

    self.display = ko.computed(() => {

        let displayModes = self.parent.displayModes();

        let result = [];

        if (displayModes.indexOf(DISPLAY_MODE_VALUE_SUM) > -1) {
            if (self.OrderValue)
                result.push(`<span class="order-value" title="Order Value: ${self.OrderValue}">${self.OrderValue}</span>`);
        }

        if (displayModes.indexOf(DISPLAY_MODE_QUANTITY_SUM) > -1) {
            if (self.OrderQuantity)
                result.push(`<span class="order-quantity" title="Order Quantity: ${self.OrderQuantity}">Q ${self.OrderQuantity}</span>`);
        }

        if (displayModes.indexOf(DISPLAY_MODE_LINE_COUNT) > -1) {
            if (self.LineCount)
                result.push(`<span class="line-count" title="Line Count: ${self.LineCount}">L ${self.LineCount}</span>`);
        }

        if (displayModes.indexOf(DISPLAY_MODE_ORDER_COUNT) > -1) {
            if (self.OrderCount)
                result.push(`<span class="order-count" title="Order Count: ${self.OrderCount}">O ${self.OrderCount}</span>`);
        }

        if (displayModes.indexOf(DISPLAY_MODE_PERCENTAGE_FULL) > -1) {
            if (self.PercentageOfFullOrderBook)
                result.push(`<span class="percentage-of-full" title="Percentage of Full Order Book: ${self.PercentageOfFullOrderBook}">% Full ${self.PercentageOfFullOrderBook}</span>`);
        }

        if (displayModes.indexOf(DISPLAY_MODE_PERCENTAGE_FILTER) > -1) {
            if (self.PercentageOfFilteredOrderBook)
                result.push(`<span class="percentage-of-filtered" title="Percentage of Filtered Order Book: ${self.PercentageOfFilteredOrderBook}">% Filtered ${self.PercentageOfFilteredOrderBook}</span>`);
        }

        return result.join('\n');
    }, self);


    return self;
}

const groupedDetailColumn = ({
    parent,
    group,
    grouped,
    dataSet,
    displayModes,
    gridHeaderHeightObservable,
    originalGridHeaderHeight,
    rowHeightObservable,
    originalRowHeight,
    rowPaddingY,
    lineHeight,
    borderWidth,
    width,
    accumulatedColumnWidths
} = {
        group: {},
        grouped: false,
        array: false,
        dataSet: [],
        displayModes: [],
        gridHeaderHeightObservable: ko.observable(),
        originalGridHeaderHeight: 93,
        rowHeightObservable: ko.observable(),
        originalRowHeight: 36,
        rowPaddingY: 14,
        lineHeight: 21,
        borderWidth: 1,
        width: undefined,
        accumulatedColumnWidths: undefined
    }) => {

    let self = {
        parent: parent,
        grouped: grouped,
        array: false,
        typeName: "groupedDetailColumn"
    };

    self.columnName = group.columnName;

    self.columnNameDisplay = self.columnName.replace('Grouped', '').replace(/_/g, '').replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, '$1$4 $2$3$5');

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

    self.width = width;

    self.accumulatedColumnWidths = accumulatedColumnWidths;

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

    self.orderValue = ko.computed(() => {
        if (self.total()) {
            let reducer = self.buildTotalReducer("OrderValue");
            let value = self.detailColumns().reduce(reducer, 0);
            return formatCurrency(value, 0, 'en-GB', 'GBP');
        }
    }, self);

    self.orderQuantity = ko.computed(() => {
        if (self.total()) {
            let reducer = self.buildTotalReducer("OrderQuantity");
            let value = self.detailColumns().reduce(reducer, 0);
            return formatNumber(value, 2);
        }
    }, self);

    self.lineCount = ko.computed(() => {
        if (self.total()) {
            let reducer = self.buildTotalReducer("LineCount");
            let value = self.detailColumns().reduce(reducer, 0);
            return formatNumber(value, 0);
        }
    }, self);

    self.orderCount = ko.computed(() => {
        if (self.total()) {
            let reducer = self.buildTotalReducer("OrderCount");
            let value = self.detailColumns().reduce(reducer, 0);
            return formatNumber(value, 0);
        }
    }, self);

    //self.displayTotal = ko.computed(() => {
    //    let displayModes = self.parent.displayModes();

    //    let result = [];

    //    if (self.total()) {

    //        if (displayModes.indexOf(DISPLAY_MODE_VALUE_SUM) > -1) {
    //            result.push(`<span class="sortable-column" data-bind="click: $root.sortByColumn">${}</span>`);
    //        }

    //        if (displayModes.indexOf(DISPLAY_MODE_QUANTITY_SUM) > -1) {
    //            result.push(`<span class="sortable-column" data-bind="click: $root.sortByColumn">${ }</span>`);
    //        }

    //        if (displayModes.indexOf(DISPLAY_MODE_LINE_COUNT) > -1) {
    //            let reducer = self.buildTotalReducer("LineCount");
    //            let value = self.detailColumns().reduce(reducer, 0);
    //            result.push(`<span class="sortable-column" data-bind="click: $root.sortByColumn">${formatNumber(value, 0) }</span>`);
    //        }

    //        if (displayModes.indexOf(DISPLAY_MODE_ORDER_COUNT) > -1) {
    //            let reducer = self.buildTotalReducer("OrderCount");
    //            let value = self.detailColumns().reduce(reducer, 0);
    //            result.push(`<span class="sortable-column" data-bind="click: $root.sortByColumn">${formatNumber(value, 0) }</span>`);
    //        }
    //    }

    //    return result.join('<br/>');
    //}, self);

    //self.display = ko.computed(() => {

    //}, self);

    let sortFunctions = [];

    self.detailColumns().forEach(dc => {
        sortFunctions.push(self.parent.generateSorting(dc.columnName));
    });

    let extant = self.parent.allSortingOperations();

    sortFunctions.push(extant);

    self.parent.allSortingOperations(sortFunctions.flat());

    return self;
};

const arrayDetailColumn = ({
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
    borderWidth,
    width,
    accumulatedColumnWidths
} = {
        array: true,
        group: {},
        dataSet: [],
        displayModes: [],
        gridHeaderHeightObservable: ko.observable(),
        originalGridHeaderHeight: 93,
        rowHeightObservable: ko.observable(),
        originalRowHeight: 36,
        rowPaddingY: 14,
        lineHeight: 21,
        borderWidth: 1,
        width: undefined,
        accumulatedColumnWidths: undefined
    }) => {

    let self = {
        array: true,
        grouped: false,
        parent: parent,
        typeName: "arrayDetailColumn"
    };

    self.columnName = group.columnName;

    self.columnNameDisplay = self.columnName.replace('Array', '').replace(/_/g, '').replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, '$1$4 $2$3$5');

    self.detailColumns = ko.observableArray(group.columns.map(cn => {
        return detailColumn({
            propertyName: cn,
            dataSet: dataSet
        })
    }));

    self.displayModes = displayModes;

    self.originalGridHeaderHeight = originalGridHeaderHeight;

    self.gridHeaderHeightObservable = gridHeaderHeightObservable;

    self.originalRowHeight = originalRowHeight;

    self.rowHeightObservable = rowHeightObservable;

    self.rowPaddingY = rowPaddingY;

    self.lineHeight = lineHeight;

    self.borderWidth = borderWidth;

    self.width = width;

    self.accumulatedColumnWidths = accumulatedColumnWidths;

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

    let sortFunctions = [];

    self.detailColumns().forEach(dc => {
        sortFunctions.push(self.parent.generateSorting(dc.columnName));
    });

    let extant = self.parent.allSortingOperations();

    sortFunctions.push(extant);

    self.parent.allSortingOperations(sortFunctions.flat());

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

    self.typeName = "detailColumn";

    self.columnName = propertyName;

    self.columnNameDisplay = propertyName.replace('Grouped', '').replace(/_/g, '').replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, '$1$4 $2$3$5');

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

    let self = {
        typeName: "orderBookDetailViewModel"
    };

    self.params = window.getDetailParameters();

    let parseExclusions = ['salesMarketIds', 'startDate', 'endDate', 'orderLineDetailedStatusGroupIds', 'displayModes'];

    Object.keys(self.params).forEach(k => {
        if (parseExclusions.indexOf(k) === -1) {
            let parsed = Number.parseInt(self.params[k]);
            if (!isNaN(parsed)) {
                self.params[k] = parsed;
            }
        }
    });
    
    self.productDetail = ko.observable(); // loading of this is deferred until UI interaction

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

    self.busy = ko.observable(false);

    //self.displayModes = ko.observableArray(self.params.displayModes && self.params.displayModes.length > 0
    //    ? self.params.displayModes.split(',').map(dm => +dm)
    //    : [DISPLAY_MODE_VALUE_SUM]
    //);

    self.displayModes = ko.observableArray(self.params.displayModes ? self.params.displayModes?.toString().split(',').map(a => +a) : [DISPLAY_MODE_QUANTITY_SUM]);

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

    self.defaultColumnWidth = ko.observable(140);

    self.filterButtons = ko.observableArray([]);

    self.filtersCountDisplay = ko.observable(undefined);

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



    // fooling the stock thingie

    self.searchResult = ko.observable();

    self.productDetail.subscribe(nv => {
        self.searchResult({
            record: nv,
            productFilterOptions: ko.observable({
                QuantityPrecision: 0
            })
        });
    });

    self.stockCheckRequester = stockCheckRequestViewModel({
        parent: self
    });

    self.showStockCheckRequester = ko.observable(false);

    self.beginStockCheckRequest = function (data, event) {
        self.stockCheckRequester.showModal();
    }

    self.orderProductsDrilldown = {
        stockCheckRequester: self.stockCheckRequester
    }

    // end of fooling the stock thingie



    //#endregion


    //#region Computeds

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

            return JSON.stringify(Object.assign(window.getDetailParameters(), udf, adv, {
                procedure: self.params.procedure
            }));
        }
    }, self).extend({
        rateLimit: {
            timeout: 100,
            method: 'notifyWhenChangesStop'
        }
    });

    self.selectedFilterCount = ko.computed(() => {
        let udfCount = Object.keys(self.userDefinedFilters)
            .filter(k => {
                return (k.length)
                    && (k != 'initialParams')
                    && (k.indexOf('Params') > -1)
                    && (k.indexOf('Params') == k.length - 6);
            }).map(k => self.userDefinedFilters[k])
            .filter(p => {
                let selected = false;

                if (p.hasOwnProperty('locked')) {
                    if (p.locked() == false) {
                        if (p.hasOwnProperty('multiSelectSettings')) {
                            if (p.multiSelectSettings.observableArray().length)
                                selected = true;
                        } else if (p.hasOwnProperty('observable')) {
                            if (p.observable())
                                selected = true;
                        }
                    }
                } else {
                    console.log(p);
                }

                return selected;
            }).length;

        console.log('udfCount', udfCount);

        let advCount = Object.keys(self.advancedFilters)
            .filter(k => {
                return (k.length)
                    && (k != 'initialParams')
                    && (k.indexOf('Params') > -1)
                    && (k.indexOf('Params') == k.length - 6);
            }).map(k => self.advancedFilters[k])
            .filter(p => {
                let selected = false; 
                if (p.hasOwnProperty('locked')) {
                    if (p.locked() == false) {
                        if (p.hasOwnProperty('multiSelectSettings')) {
                            if (p.multiSelectSettings.observableArray().length)
                                selected = true;
                        } else if (p.hasOwnProperty('observable')) {
                            if (p.observable())
                                selected = true;
                        }
                    }
                } else {
                    console.log(p);
                }

                return selected;
            }).length;

        return udfCount + advCount;
    }, self);

    //#endregion


    //#region Components

    self.virtualScrollerContainer = document.getElementById("order-book-detail-scroller-container")

    self.columnNameGroupingRegex = /^(Grouped_|Array_)[^_]+_?/gm;

    self.virtualScroller = virtualScrollingDeferredDataFactory({
        busy: self.busy,
        tableSelector: "#order-book-detail-table",
        rowHeight: self.rowHeight,
        displayModes: self.displayModes,
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

            let defaultColumnWidth = results.Columns.find(c => c.Name == "Default").Width;

            self.defaultColumnWidth(defaultColumnWidth);

            if (rec) {

                self.noResults(false);

                let columnNames = Object.keys(rec).filter(k => {
                    return [
                        "offsetY",
                        "originalOffsetY",
                        "runningHeight",
                        "_OrderValue",
                        "_OrderQuantity",
                        "_OrderLineIDs"
                    ].indexOf(k) == -1;
                });

                let groups = Object.groupBy(columnNames, cn => {
                    let match = cn.match(self.columnNameGroupingRegex);
                    if (match != null) {
                        return match[0];
                    } else {
                        return cn;
                    }
                });

                groupedColumns = Object.keys(groups).map(g => {
                    return {
                        grouped: g.indexOf('Grouped') == 0,
                        array: g.indexOf('Array') == 0,
                        columnName: g,
                        columns: groups[g]
                    }
                });

                console.log('groupedColumns', groupedColumns);

                let accumulatedColumnWidths = 0;

                let defaultColumnWidth = results.Columns.find(c => c.Name == "Default").Width;

                self.defaultColumnWidth(defaultColumnWidth);

                // this is to acommodate the zeroth column, "ProductID", being display: none
                let skipper = 0;

                groupedColumns = groupedColumns.map((gc, i) => {

                    // we want to fix just the following columns: 3, 5, 6, 7, 8

                    // so nth must stop at the accumulated width belonging to n-1 in that list?

                    let widthAdjuster = accumulatedColumnWidths;

                    if (i == 4) {
                        widthAdjuster = results.Columns.find(c => c.Name == "ProductName").Width ?? defaultColumnWidth;
                        widthAdjuster += results.Columns.find(c => c.Name == "ProductCode").Width ?? defaultColumnWidth;
                    } else if (i == 5) {
                        widthAdjuster = results.Columns.find(c => c.Name == "ProductName").Width ?? defaultColumnWidth;
                        widthAdjuster += results.Columns.find(c => c.Name == "ProductCode").Width ?? defaultColumnWidth;
                        widthAdjuster += results.Columns.find(c => c.Name == "ProductStatus").Width ?? defaultColumnWidth;
                    }

                    var width = results.Columns.find(c => c.Name == gc.columnName)?.Width ?? defaultColumnWidth;

                    let resultantColumn = groupedDetailColumn({
                        parent: self,
                        group: gc,
                        grouped: gc.grouped,
                        dataSet: results.Data,
                        displayModes: self.displayModes,
                        gridHeaderHeightObservable: self.gridHeaderHeight,
                        originalGridHeaderHeight: self.originalGridHeaderHeight,
                        rowHeightObservable: self.rowHeight,
                        originalRowHeight: self.originalRowHeight,
                        rowPaddingY: self.rowPaddingY,
                        lineHeight: self.lineHeight,
                        borderWidth: self.borderWidth,
                        width: width,
                        accumulatedColumnWidths: widthAdjuster
                    });

                    if (gc.array) {
                        resultantColumn = arrayDetailColumn({
                            parent: self,
                            group: gc,
                            grouped: false,
                            dataSet: results.Data,
                            displayModes: self.displayModes,
                            gridHeaderHeightObservable: self.gridHeaderHeight,
                            originalGridHeaderHeight: self.originalGridHeaderHeight,
                            rowHeightObservable: self.rowHeight,
                            originalRowHeight: self.originalRowHeight,
                            rowPaddingY: self.rowPaddingY,
                            lineHeight: self.lineHeight,
                            borderWidth: self.borderWidth,
                            width: width,
                            accumulatedColumnWidths: widthAdjuster
                        });
                    }

                    if (skipper > 0) {
                        accumulatedColumnWidths += width;
                    } else {
                        skipper = 1;
                    }

                    return resultantColumn;
                });

                console.log("setting columns", groupedColumns);

                self.columns(groupedColumns);
            }
            else {
                self.noResults(true);

                console.log("setting columns", []);

                self.columns([]);
            }

            let filterButtons = results.FilterButtons.map(fb => filterButton({
                rec: fb,
                parent: self,
                active: fb.ProductLifeCycleID == fb.ActiveButtonID
            }));

            console.log("setting filter buttons", filterButtons);

            self.filterButtons(filterButtons.sort((a, b) => {
                if (a.SortOrder > b.SortOrder)
                    return 1;
                else
                    return -1;
            }));

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

    self.displayModes.subscribe(nv => {
        window.setTimeout(() => {
            self.virtualScroller.maxY.valueHasMutated();
        }, 0);
    });

    self.selectedFilterCount.subscribe(nv => {
        if (nv == 0) {
            self.filtersCountDisplay(undefined);
        } else if (nv == 1) {
            self.filtersCountDisplay('1 Filter Selected')
        } else if (nv > 1) {
            self.filtersCountDisplay(`${nv} Filters Selected`)
        }
    });

    self.filtersCountDisplay.subscribe(nv => {
        if (window.parent && window.parent.document.querySelector('#filter-top-btn-display')) {
            if (nv) {
                window.parent.document.querySelector('#filter-top-btn-display').innerHTML = nv;
            } else {
                window.parent.document.querySelector('#filter-top-btn-display').innerHTML = 'Filters';
            }
        }
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

    self.copyLink = () => {

        let params = JSON.parse(self.primaryFetchParams());

        let preDefinedFilterCriteria = {
            displayModes: self.displayModes(),
            accurateAsOfDateTime: self.accurateAsOfDateTime(),
            procedure: self.params.procedure,
            view: self.params.view,
            filterable: self.params.filterable
        };

        Object.assign(params, preDefinedFilterCriteria);

        let qs = new URLSearchParams(params).toString();

        let src = `/order-book/detail/${self.params.view}?${qs}`;

        let event = new CustomEvent('copyLinkToClipboard', {
            detail: {
                text: src
            }
        });

        window.parent.document.dispatchEvent(event);
    }

    self.sortByColumn = (detailColumn) => {
        self.columns().forEach(c => {
            c.detailColumns().forEach(dc => {
                if (dc != detailColumn) {
                    dc.direction(undefined);
                }
            });
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
                    console.log("FetchOrderLinePopoverContents returned", data);
                    resolve(data);
                })
                .catch(err => {
                    window.catchFetchError(err);
                    reject(err);
                })
        });

    }

    self.fetchRingFencePopoverContents = (data) => {
        return new Promise((resolve, reject) => {
            console.log("FetchRingFencePopoverContents calling with", data);

            fetch('/api/orderbook/FetchRingFencePopoverContents', {
                method: "POST",
                headers: window.fetchHeaders,
                cache: 'no-store',
                credentials: 'same-origin',
                body: JSON.stringify(data)
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    console.log("FetchRingFencePopoverContents returned", data);
                    resolve(data);
                })
                .catch(err => {
                    window.catchFetchError(err);
                    reject(err);
                });
        });
    }

    self.fetchTotalPopoverContents = (data) => {
        return new Promise((resolve, reject) => {
            console.log("FetchTotalPopoverContents calling with", data);

            fetch('/api/orderbook/FetchTotalPopoverContents', {
                method: "POST",
                headers: window.fetchHeaders,
                cache: 'no-store',
                credentials: 'same-origin',
                body: JSON.stringify(data)
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    console.log("FetchTotalPopoverContents returned", data);
                    resolve(data);
                })
                .catch(err => {
                    window.catchFetchError(err);
                    reject(err);
                });
        });
    }


    self.fetchProductCodeModalContents = (data) => {
        return new Promise((resolve, reject) => {
            console.log("fetchProductCodeModalContents calling with", data);

            fetch('/api/orderbook/FetchProductCodeModalContents', {
                method: "POST",
                headers: window.fetchHeaders,
                cache: 'no-store',
                credentials: 'same-origin',
                body: JSON.stringify(data)
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    console.log("fetchProductCodeModalContents returned", data);
                    resolve(data);
                })
                .catch(err => {
                    window.catchFetchError(err);
                    reject(err);
                });
        });
    }

    self.toggleFilters = () => {
        self.userDefinedFilters.togglePinning();
    }

    //#endregion


    //#region Events

    window.addEventListener('message', (e) => {
        if (e && e.data && e.data.action) {
            switch (e.data.action) {
                case "exportDetail":
                    self.exportDetail()
                    break;
                case "copyLink":
                    self.copyLink();
                    break;
                case "toggleFilters":
                    self.toggleFilters();
                    break;
                default: break;

            }
        }
    }, false);

    //#endregion

    return self;
});