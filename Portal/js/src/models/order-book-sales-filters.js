const orderBookSalesFiltersViewModel = ((parent) => {

    //#region Properties

    let self = {
        parent: parent
    };

    // this is so that the values-dropdown-container template can render a distinct id for the displaymodes
    self.orderGroupId = "sales-filters";

    self.busy = ko.observable(true);

    self.displayModes = self.parent.salesDisplayModes;

    self.groups = ko.observableArray([]);

    self.displayBlocker = ko.observable(false);

    self.blockerMessage = ko.observable();

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

    self.parse = (data) => {

        console.log('orderBookSalesFiltersViewModel parse', data);

        data.SalesResult.sort((a, b) => {
            return a.SortOrder > b.SortOrder ? 1 : -1;
        });

        self.groups(data.SalesResult);

        self.displayBlocker(data.BlockerResult.DisableBudgetPanel ? true : false);

        self.blockerMessage(data.BlockerResult.DisableBudgetPanelMessage);
    }

    self.fetch = (params) => {

        self.busy(true);

        params.orderLineDetailedStatusGroupIds = self.parent.displayColumnHeadings();

        if (self.parent.displayColumnHeadings().length == self.parent.columnHeadings().length) {
            params.orderLineDetailedStatusGroupIds = [];
        }

        console.log("FetchSales calling with", params);

        fetch("/api/orderbook/RefreshSales", {
            method: "POST",
            headers: window.fetchHeaders,
            cache: 'no-store',
            credentials: 'same-origin',
            body: JSON.stringify(params)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log("FetchSales returned", data);

                self.parse(data);

                window.setTimeout(() => {
                    self.busy(false);
                }, 0);
            })
            .catch((err) => {
                self.busy(false);
                window.catchFetchError(err);
            });
    }

    self.exportSales = (params) => {

        self.busy(true);

        params.orderLineDetailedStatusGroupIds = self.parent.displayColumnHeadings();

        if (self.parent.displayColumnHeadings().length == self.parent.columnHeadings().length) {
            params.orderLineDetailedStatusGroupIds = [];
        }

        fetch("/api/orderbook/ExportSalesToExcel", {
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
                link.download = 'DG-Order-Book-Sales.xlsx';
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

    //self.parse(getPreDefinedSummaries());

    return self;
});