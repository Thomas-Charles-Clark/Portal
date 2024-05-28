const DISPLAY_MODE_VALUE_SUM = 1,
    DISPLAY_MODE_QUANTITY_SUM = 2,
    DISPLAY_MODE_LINE_COUNT = 3,
    DISPLAY_MODE_ORDER_COUNT = 4

const orderBookDetailViewModel = (() => {

    //#region Properties

    let params = window.getDetailParameters();

    let self = {};

    self.procedure = params.procedure;

    self.busy = ko.observable(false);

    self.displayModes = ko.observableArray(params.displayModes && params.displayModes.length > 0
        ? params.displayModes.split(',').map(dm => +dm)
        : [DISPLAY_MODE_VALUE_SUM]
    );

    self.userDefinedFilters = orderBookUserDefinedFiltersViewModel({ parent: self, params: params });

    self.advancedFilters = orderBookAdvancedFiltersViewModel({ parent: self, params: params });

    self.results = ko.observableArray([]);

    self.accurateAsOfDateTime = ko.observable(params.accurateAsOfDateTime ?? undefined);

    self.columns = ko.observableArray([]);

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
            self.columns([]);
            return JSON.stringify(Object.assign(udf, adv, { procedure: self.procedure }, window.getDetailParameters()));
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
        primaryFetchResultFn: (rec) => {

            if (self.columns().length == 0) {
                self.columns(Object.keys(rec).filter(k => ["offsetY", "runningHeight"].indexOf(k) == -1));
            }

            return orderBookMainCell({ parent: self, data: rec })
        },
        container: self.virtualScrollerContainer,
        gridHeaderHeight: 57,
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

    //#endregion


    //#region Events



    //#endregion

    return self;
});