const supplierPaymentsViewModel = ({

} = {

}) => {

    let self = {

    };

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable('Please Wait');

    //#endregion



    //#region Components

    self.filters = supplierPaymentsFiltersViewModel({
        ready: self.ready,
        busy: self.busy,
        busyMessage: self.busyMessage
    });

    self.dashboard = supplierPaymentsDashboardViewModel({
        ready: self.ready,
        busy: self.busy,
        busyMessage: self.busyMessage,
        filters: self.filters
    });

    self.requests = supplierPaymentsRequestsViewModel({
        ready: self.ready,
        busy: self.busy,
        busyMessage: self.busyMessage,
        filters: self.filters
    });

    self.approvals = supplierPaymentsApprovalsViewModel({
        ready: self.ready,
        busy: self.busy,
        busyMessage: self.busyMessage,
        filters: self.filters
    });

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
}