const orderBookSalesFiltersViewModel = ((parent) => {

    //#region Properties

    let self = {
        parent: parent
    };

    // this is so that the values-dropdown-container template can render a distinct id for the displaymodes
    self.orderGroupId = "sales-filters";

    self.busy = ko.observable(false);

    self.displayModes = self.parent.salesDisplayModes;

    self.groups = ko.observableArray([]);

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

    self.parse = (salesFilters) => {

        console.log('orderBookSalesFiltersViewModel parse', salesFilters);

        salesFilters.sort((a, b) => {
            return a.SortOrder > b.SortOrder ? 1 : -1;
        });

        self.groups(salesFilters);
    }

    self.fetch = (params) => {

        self.busy(true);

        params.orderLineDetailedStatusGroupIds = self.parent.displayColumnHeadings();

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

                self.parse(data.salesResult);

                window.setTimeout(() => {
                    self.busy(false);
                }, 0);
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