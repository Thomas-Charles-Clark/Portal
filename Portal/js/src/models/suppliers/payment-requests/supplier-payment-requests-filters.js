const supplierPaymentRequestsFiltersViewModel = ({
    params,
    parent
} = {
        params: {},
        parent: {}
    }) => {
    let self = {
        refreshParent: parent.refresh
    };

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.countDisplay = ko.observable(undefined);

    //#endregion



    //#region Components

    self.errorables = [

    ];

    //#endregion



    //#region Computeds



    //#endregion



    //#region Subscriptions



    //#endregion



    //#region Methods



    //#endregion



    //#region Events



    //#endregion


    return self;
};