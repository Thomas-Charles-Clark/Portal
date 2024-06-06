const DISPLAY_MODE_VALUE_SUM = 1,
    DISPLAY_MODE_QUANTITY_SUM = 2,
    DISPLAY_MODE_LINE_COUNT = 3,
    DISPLAY_MODE_ORDER_COUNT = 4,
    DISPLAY_MODE_PERCENTAGE_FULL = 5,
    DISPLAY_MODE_PERCENTAGE_FILTER = 6

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

    self.isNaN = self.columnName.indexOf("Number") > -1 ||
        self.columnName.indexOf("ID") > -1 ||
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

                columns = columnNames.map(cn => {
                    return detailColumn({
                        propertyName: cn,
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
        gridHeaderHeight: 83,
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

    //#endregion


    //#region Events

    window.addEventListener('message', (e) => {
        e && e.data && e.data.action && e.data.action == 'exportDetail' && self.exportDetail();
    }, false);

    //#endregion

    return self;
});