const supplierPaymentsViewModel = ({

} = {

}) => {

    let self = {

    };

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable('Please Wait');

    self.quietLogging = ko.observable(true);

    //#endregion


    //#region Lifted Methods

    self.refresh = () => {
        self.dashboard.refresh();
        self.requests.refresh();
        self.approvals.refresh();
        self.budgets.refresh();
        self.historySummary.refresh();
        self.historyDetails.refresh();
    }

    //#endregion


    //#region Components

    self.filters = supplierPaymentsFiltersViewModel({
        ready: self.ready,
        busy: self.busy,
        busyMessage: self.busyMessage,
        refreshParent: self.refresh,
        quietLogging: self.quietLogging
    });

    self.dashboard = supplierPaymentsDashboardViewModel({
        ready: self.ready,
        busy: self.busy,
        busyMessage: self.busyMessage,
        filters: self.filters,
        quietLogging: self.quietLogging
    });

    self.approvals = supplierPaymentsApprovalsViewModel({
        ready: self.ready,
        busy: self.busy,
        busyMessage: self.busyMessage,
        filters: self.filters,
        refreshDashboard: self.dashboard.refresh,
        quietLogging: self.quietLogging
    });

    self.requests = supplierPaymentsRequestsViewModel({
        ready: self.ready,
        busy: self.busy,
        busyMessage: self.busyMessage,
        filters: self.filters,
        refreshDashboard: self.dashboard.refresh,
        quietLogging: self.quietLogging,
        refreshApprovals: self.approvals.refresh
    });

    self.budgets = supplierPaymentsBudgetsViewModel({
        ready: self.ready,
        busy: self.busy,
        busyMessage: self.busyMessage,
        filters: self.filters,
        refreshDashboard: self.dashboard.refresh,
        quietLogging: self.quietLogging
    });

    self.historySummary = supplierPaymentsHistorySummaryViewModel({
        ready: self.ready,
        busy: self.busy,
        busyMessage: self.busyMessage,
        filters: self.filters,
        refreshDashboard: self.dashboard.refresh,
        quietLogging: self.quietLogging
    });

    self.historyDetails = supplierPaymentsHistoryDetailViewModel({
        ready: self.ready,
        busy: self.busy,
        busyMessage: self.busyMessage,
        filters: self.filters,
        refreshDashboard: self.dashboard.refresh,
        quietLogging: self.quietLogging
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