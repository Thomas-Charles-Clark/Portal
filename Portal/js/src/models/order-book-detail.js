const DISPLAY_MODE_VALUE_SUM = 1,
    DISPLAY_MODE_QUANTITY_SUM = 2,
    DISPLAY_MODE_LINE_COUNT = 3,
    DISPLAY_MODE_ORDER_COUNT = 4,
    DISPLAY_MODE_PERCENTAGE_FULL = 5,
    DISPLAY_MODE_PERCENTAGE_FILTER = 6

const detailColumn = ({
    propertyName,
    width,
    dataSet
} = {
    propertyName: "MarketCode",
    width: 240,
    dataSet: []
}) => {
    let self = {};

    self.width = width;

    self.columnName = propertyName;

    self.columnNameDisplay = propertyName.replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, '$1$4 $2$3$5');

    self.direction = ko.observable(); // undefined / "asc" / "desc"

    self.isNaN = self.columnName.indexOf("Number") > -1 ||
        self.columnName.indexOf("ID") > -1 ||
        self.columnName.indexOf("Date") > -1 ||
        self.columnName.indexOf("LineStatus") > -1 ||
        dataSet.find(ds => isNaN(ds[self.columnName]));

    if (self.isNaN) {
        self.total = null;
    } else {

        self.total = formatNumber(dataSet.reduce((a, i) => {

            let b = +i[self.columnName];

            a = a + b;

            return a;

        }, 0) || null);
    }

    return self;
};

const orderBookDetailViewModel = (() => {

    let self = {};

    self.params = window.getDetailParameters();

    

    let parseExclusions = ['marketIds', 'startDate', 'endDate', 'orderLineDetailedStatusGroupIds'];

    Object.keys(self.params).forEach(k => {
        if (parseExclusions.indexOf(k) === -1) {
            let parsed = Number.parseInt(self.params[k]);
            if (!isNaN(parsed)) {
                self.params[k] = parsed;
            }
        }
    });

    

    //#region Lifted Methods

    self.generateAscendingSortingOperation = (parameterName) => {
        return {
            direction: "asc",
            propertyName: parameterName,
            sortingFunction: (a, b) => {
                if (isNaN(+a[parameterName])) {
                    if (isNaN(Date.parse(`${a[parameterName].split('/').reverse().join('-')}T00:00:00.000Z`))) {

                        return a[parameterName] === b[parameterName] ? 0 : a[parameterName] > b[parameterName] ? 1 : -1;

                    } else {

                        let aDate = Date.parse(`${a[parameterName].split('/').reverse().join('-')}T00:00:00.000Z`);

                        if (isNaN(Date.parse(`${b[parameterName]?.split('/').reverse().join('-')}T00:00:00.000Z`))) {

                            return 1;

                        } else {

                            let bDate = Date.parse(`${b[parameterName].split('/').reverse().join('-')}T00:00:00.000Z`);

                            //console.log('performing date sort ascending');

                            return aDate === bDate ? 0 : aDate > bDate ? 1 : -1;

                        }

                    }
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
                    if (isNaN(Date.parse(`${a[parameterName].split('/').reverse().join('-')}T00:00:00.000Z`))) {

                        return a[parameterName] === b[parameterName] ? 0 : a[parameterName] < b[parameterName] ? 1 : -1;

                    } else {

                        let aDate = Date.parse(`${a[parameterName].split('/').reverse().join('-')}T00:00:00.000Z`);

                        if (isNaN(Date.parse(`${b[parameterName]?.split('/').reverse().join('-')}T00:00:00.000Z`))) {

                            return -1;

                        } else {

                            let bDate = Date.parse(`${b[parameterName].split('/').reverse().join('-')}T00:00:00.000Z`);

                            //console.log('performing date sort descending');

                            return aDate === bDate ? 0 : aDate < bDate ? 1 : -1;
                        }

                    }
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

    self.displayModes = ko.observableArray(self.params.displayModes && self.params.displayModes.length > 0
        ? self.params.displayModes.split(',').map(dm => +dm)
        : [DISPLAY_MODE_VALUE_SUM]
    );

    self.userDefinedFilters = orderBookUserDefinedFiltersViewModel({ parent: self, params: self.params });

    self.advancedFilters = orderBookAdvancedFiltersViewModel({ parent: self, params: self.params });

    self.results = ko.observableArray([]);

    self.accurateAsOfDateTime = ko.observable(self.params.accurateAsOfDateTime ?? undefined);

    self.columns = ko.observableArray([]);

    self.allSortingOperations = ko.observableArray([]);

    self.noResults = ko.observable(false);

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

            let resultObject = Object.assign(window.getDetailParameters(), udf, adv, { procedure: self.procedure });

            resultObject.orderLineDetailedStatusGroupIds = resultObject.orderLineDetailedStatusGroupIds == '' ? [] : resultObject.orderLineDetailedStatusGroupIds?.split(',').map(oldsgid => +oldsgid)

            let result = JSON.stringify(resultObject);

            console.log('primaryFetchParams computed', resultObject);

            return result;
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

    self.virtualScroller = virtualScrollingDeferredDataFactory({
        busy: self.busy,
        tableSelector: "#order-book-detail-table",
        rowHeight: 36,
        primaryFetchParams: self.primaryFetchParams,
        primaryFetchEndpoint: "/api/orderbook/DetailRefresh",
        primaryFetchResultSetName: "Data",
        primaryFetchSortFn: self.activeSortingOperation,
        primaryFetchBeforeFn: () => {
            self.columns([]);
        },
        primaryFetchAfterFn: (results) => {
            let rec = results.Data[0];
            let cols = results.Columns;
            self.accurateAsOfDateTime(results.AccurateAsOfDT);
            let columns = [];

            if (rec) {

                let columnNames = Object.keys(rec).filter(k => {
                    return ["offsetY", "originalOffsetY", "runningHeight"].indexOf(k) == -1;
                });

                let sortFunctions = [];

                columnNames.forEach(cn => {
                    sortFunctions.push(self.generateSorting(cn));
                });

                self.allSortingOperations(sortFunctions.flat());

                columns = columnNames.map((cn, i) => {
                    let specifiedColumn = cols.find(c => c.Name == cn);
                    if (specifiedColumn == null) {
                        specifiedColumn = cols.find(c => c.Name == "Default");
                    }
                    return detailColumn({
                        propertyName: cn,
                        width: specifiedColumn.Width,
                        dataSet: results.Data
                    })
                });

            }
            else {
                self.noResults(true);
            }

            console.log("setting columns", columns);

            self.columns(columns);
        },
        primaryFetchResultFn: (rec) => orderBookMainCell({ parent: self, data: rec }),
        container: self.virtualScrollerContainer,
        gridHeaderHeight: 135,
        gridPositionTop: 0
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
            orderLineDetailedStatusGroupIds: self.params.orderLineDetailedStatusGroupIds,
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