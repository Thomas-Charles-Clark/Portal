const orderBookOrdersFiltersViewModel = ((parent) => {

    //#region Properties

    let self = {
        parent: parent
    };

    // this is so that the values-dropdown-container template can render a distinct id for the displaymodes
    self.orderGroupId = "orders-filters";

    self.busy = ko.observable(true);

    self.displayModes = self.parent.ordersDisplayModes;

    self.groups = ko.observableArray([]);

    self.displayBlocker = ko.observable(false);

    self.blockerMessage = ko.observable();

    self.fetchAbortController = new AbortController();

    //#endregion


    //#region Events



    //#endregion


    //#region Components



    //#endregion


    //#region Computeds



    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Validation Groups



    //#endregion

    //#region Functions

    self.showSummaryModal = (data) => {
        self.summaryStartDt = data.startDt;
        self.summaryEndDt = data.endDt;
        self.fetchSummary();
        self.summaryModal.show();
    }

    self.parse = (data) => {

        console.log('orderBookOrdersFiltersViewModel parse', data);

        data.OrdersResult.sort((a, b) => {
            return a.SortOrder > b.SortOrder ? 1 : -1;
        });

        self.groups(data.OrdersResult);

        self.displayBlocker(data.BlockerResult.DisableBudgetPanel ? true : false);

        self.blockerMessage(data.BlockerResult.DisableBudgetPanelMessage);
    }

    self.parseSummary = (data) => {

        console.log('orderBookOrdersFiltersViewModel parseSummary', data);

        self.summary(data.Results);

    }

    self.fetch = (params) => {

        self.busy(true);

        params.orderLineDetailedStatusGroupIds = [];

        //if (self.fetchAbortController.fetch == null) {
        //    console.log("FetchSales calling with", params);
        //} else {
        //    self.fetchAbortController.abort();
        //}

        console.log("FetchOrders calling with", params);

        self.fetchAbortController.fetch = fetch("/api/orderbook/RefreshOrders", {
            method: "POST",
            headers: window.fetchHeaders,
            cache: 'no-store',
            credentials: 'same-origin',
            body: JSON.stringify(params)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log("FetchOrders returned", data);

                let startMs = +new Date();

                self.parse(data);

                let endMs = +new Date();

                console.log(`FetchOrders parsing took ${endMs - startMs}ms`);

                self.busy(false);

                //delete self.fetchAbortController.fetch;
                //self.fetchAbortController.fetch = undefined;
            })
            .catch((err) => {
                self.busy(false);
                //window.catchFetchError(err);
                //delete self.fetchAbortController.fetch;
                //self.fetchAbortController.fetch = undefined;
            });
    }

    self.fetchLabel = ($index, $rowName) => {
        return self.groups()[self.fetchLabelIndex($index)][$rowName].replace(/\s/g, '_');
    }

    self.fetchLabelIndex = ($index) => {
        let index = 0;

        if ($index >= self.groups().slice(1).findIndex(g => g.Label == '')) // slice to skip the first column which is a label...
        {
            index = self.groups().slice(1).findIndex(g => g.Label == '') + 1; // + 1 to account for the column skipped by the slice above
        }

        return index;
    }

    self.exportOrders = (data) => {

        window.showConfirm("Are you sure?", "This will generate and download an .xlsx for you", () => {

            self.busy(true);

            let params = JSON.parse(self.parent.userDefinedFilters.json());

            params.orderLineDetailedStatusGroupIds = [];

            params.StartDate = data.startDt;
            params.EndDate = data.endDt;
            params.EnquiryType = data.enquiryType;

            let label = data.label;

            fetch("/api/orderbook/ExportOrdersToExcel", {
                method: "POST",
                headers: window.fetchHeaders,
                cache: 'no-store',
                credentials: 'same-origin',
                body: JSON.stringify(params)
            })
                .then(response => response.blob())
                .then(blob => {
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = `${label}.xlsx`;
                    link.click();
                    self.busy(false);
                    link.remove();
                })
                .catch((err) => {
                    self.busy(false);
                    window.catchFetchError(err);
                });
        });
    }

    //#endregion

    //self.parse(getPreDefinedSummaries());

    return self;
});