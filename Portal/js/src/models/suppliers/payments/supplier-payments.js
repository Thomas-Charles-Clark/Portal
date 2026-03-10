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
        self.suppliers.refresh();
        self.approvals.refresh();
        self.budgets.refresh();
        self.historySummary.refresh();
        self.historyDetails.refresh();
    }

    //#endregion


    //#region Components

    self.filters = supplierPaymentsFiltersViewModel({
        ready: self.ready,
        busy: ko.observable(false),
        busyMessage: self.busyMessage,
        refreshParent: self.refresh,
        quietLogging: self.quietLogging
    });

    self.dashboard = supplierPaymentsDashboardViewModel({
        ready: self.ready,
        busy: ko.observable(false),
        busyMessage: self.busyMessage,
        filters: self.filters,
        quietLogging: self.quietLogging
    });

    self.approvals = supplierPaymentsApprovalsViewModel({
        ready: self.ready,
        busy: ko.observable(false),
        busyMessage: self.busyMessage,
        filters: self.filters,
        refreshDashboard: self.dashboard.refresh,
        quietLogging: self.quietLogging
    });

    self.requests = supplierPaymentsRequestsViewModel({
        ready: self.ready,
        busy: ko.observable(false),
        busyMessage: self.busyMessage,
        filters: self.filters,
        refreshDashboard: self.dashboard.refresh,
        quietLogging: self.quietLogging,
        refreshApprovals: self.approvals.refresh
    });

    self.budgets = supplierPaymentsBudgetsViewModel({
        ready: self.ready,
        busy: ko.observable(false),
        busyMessage: self.busyMessage,
        filters: self.filters,
        refreshDashboard: self.dashboard.refresh,
        quietLogging: self.quietLogging
    });

    self.historySummary = supplierPaymentsHistorySummaryViewModel({
        ready: self.ready,
        busy: ko.observable(false),
        busyMessage: self.busyMessage,
        filters: self.filters,
        refreshDashboard: self.dashboard.refresh,
        quietLogging: self.quietLogging
    });

    self.historyDetails = supplierPaymentsHistoryDetailViewModel({
        ready: self.ready,
        busy: ko.observable(false),
        busyMessage: self.busyMessage,
        filters: self.filters,
        refreshDashboard: self.dashboard.refresh,
        quietLogging: self.quietLogging
    });

    self.suppliers = supplierPaymentsSuppliersViewModel({
        ready: self.ready,
        busy: ko.observable(false),
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

    document.querySelectorAll('#tabs-container .nav .nav-link').forEach(element => {
        switch (element.dataset['bsTarget']) {
            case '#payment-requests-tab-pane':

                element.addEventListener('show.bs.tab', (event) => {

                    if ((self.suppliers.gridWidget() && self.suppliers.gridWidget().dataSource.hasChanges()) ||
                        (self.budgets.gridWidget() && self.budgets.gridWidget().dataSource.hasChanges()) ||
                        (self.approvals.gridWidget() && self.approvals.gridWidget().dataSource.hasChanges()) || 
                        (self.approvals.basket.gridWidget() && self.approvals.basket.gridWidget().dataSource.hasChanges())) {
                        event.preventDefault();
                        window.showInfo('Unsaved Changes', 'You have unsaved changes. Please cancel or save them before performing any other action.');
                    } else {
                        if (self.requests.gridWidget())
                            self.requests.refresh();
                    }
                });

                break;
            case '#suppliers-tab-pane':
                element.addEventListener('show.bs.tab', (event) => {

                    if ((self.requests.gridWidget() && self.requests.gridWidget().dataSource.hasChanges()) ||
                        (self.budgets.gridWidget() && self.budgets.gridWidget().dataSource.hasChanges()) ||
                        (self.approvals.gridWidget() && self.approvals.gridWidget().dataSource.hasChanges()) ||
                        (self.approvals.basket.gridWidget() && self.approvals.basket.gridWidget().dataSource.hasChanges())) {
                        event.preventDefault();
                        window.showInfo('Unsaved Changes', 'You have unsaved changes. Please cancel or save them before performing any other action.');
                    } else {
                        if (self.suppliers.gridWidget())
                            self.suppliers.refresh();
                    }
                });
                break;
            case '#budget-tab-pane':
                element.addEventListener('show.bs.tab', (event) => {

                    if ((self.requests.gridWidget() && self.requests.gridWidget().dataSource.hasChanges()) ||
                        (self.suppliers.gridWidget() && self.suppliers.gridWidget().dataSource.hasChanges()) ||
                        (self.approvals.gridWidget() && self.approvals.gridWidget().dataSource.hasChanges()) ||
                        (self.approvals.basket.gridWidget() && self.approvals.basket.gridWidget().dataSource.hasChanges())) {
                        event.preventDefault();
                        window.showInfo('Unsaved Changes', 'You have unsaved changes. Please cancel or save them before performing any other action.');
                    } else {
                        if (self.budgets.gridWidget())
                            self.budgets.refresh();
                    }

                });
                break;
            case '#approvals-tab-pane':
                element.addEventListener('show.bs.tab', (event) => {

                    if ((self.requests.gridWidget() && self.requests.gridWidget().dataSource.hasChanges()) ||
                        (self.suppliers.gridWidget() && self.suppliers.gridWidget().dataSource.hasChanges()) ||
                        (self.budgets.gridWidget() && self.budgets.gridWidget().dataSource.hasChanges()) ||
                        (self.approvals.basket.gridWidget() && self.approvals.basket.gridWidget().dataSource.hasChanges())) {
                        event.preventDefault();
                        window.showInfo('Unsaved Changes', 'You have unsaved changes. Please cancel or save them before performing any other action.');
                    } else {
                        if (self.approvals.gridWidget())
                            self.approvals.refresh();
                    }

                });
                break;
            case '#history-summary-tab-pane':
                element.addEventListener('show.bs.tab', (event) => {

                    if ((self.requests.gridWidget() && self.requests.gridWidget().dataSource.hasChanges()) ||
                        (self.suppliers.gridWidget() && self.suppliers.gridWidget().dataSource.hasChanges()) ||
                        (self.budgets.gridWidget() && self.budgets.gridWidget().dataSource.hasChanges()) ||
                        (self.approvals.gridWidget() && self.approvals.gridWidget().dataSource.hasChanges()) ||
                        (self.approvals.basket.gridWidget() && self.approvals.basket.gridWidget().dataSource.hasChanges())) {
                        event.preventDefault();
                        window.showInfo('Unsaved Changes', 'You have unsaved changes. Please cancel or save them before performing any other action.');
                    } else {
                        if (self.historySummary.gridWidget())
                            self.historySummary.refresh();
                    }

                });
                break;
            case '#history-detail-tab-pane':
                element.addEventListener('show.bs.tab', (event) => {

                    if ((self.requests.gridWidget() && self.requests.gridWidget().dataSource.hasChanges()) ||
                        (self.suppliers.gridWidget() && self.suppliers.gridWidget().dataSource.hasChanges()) ||
                        (self.budgets.gridWidget() && self.budgets.gridWidget().dataSource.hasChanges()) ||
                        (self.approvals.gridWidget() && self.approvals.gridWidget().dataSource.hasChanges()) ||
                        (self.approvals.basket.gridWidget() && self.approvals.basket.gridWidget().dataSource.hasChanges())) {
                        event.preventDefault();
                        window.showInfo('Unsaved Changes', 'You have unsaved changes. Please cancel or save them before performing any other action.');
                    } else {
                        if (self.historyDetails.gridWidget())
                            self.historyDetails.refresh();
                    }

                });
                break;
            default:
                break;
        }
    });

    //#endregion

    return self;
}