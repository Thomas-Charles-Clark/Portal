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
        filters: self.filters,
        refreshDashboard: self.dashboard.refresh
    });

    self.approvals = supplierPaymentsApprovalsViewModel({
        ready: self.ready,
        busy: self.busy,
        busyMessage: self.busyMessage,
        filters: self.filters,
        refreshDashboard: self.dashboard.refresh
    });

    self.budgets = supplierPaymentsBudgetsViewModel({
        ready: self.ready,
        busy: self.busy,
        busyMessage: self.busyMessage,
        filters: self.filters,
        refreshDashboard: self.dashboard.refresh
    });

    self.historySummary = supplierPaymentsHistorySummaryViewModel({
        ready: self.ready,
        busy: self.busy,
        busyMessage: self.busyMessage,
        filters: self.filters,
        refreshDashboard: self.dashboard.refresh
    });

    self.historyDetails = supplierPaymentsHistoryDetailViewModel({
        ready: self.ready,
        busy: self.busy,
        busyMessage: self.busyMessage,
        filters: self.filters,
        refreshDashboard: self.dashboard.refresh
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