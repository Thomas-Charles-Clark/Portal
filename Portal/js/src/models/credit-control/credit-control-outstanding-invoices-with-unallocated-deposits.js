const creditControlOutstandingInvoicesWithUnallocatedDepositsViewModel = ({ } = {}) => {
    let self = {};

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable('Please Wait');

    self.gridWidget = ko.observable();

    self.dashboardPods = ko.observableArray([]);

    //#endregion



    //#region Components

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds



    //#endregion



    //#region Subscriptions



    //#endregion



    //#region Methods

    self.refresh = () => {

    }

    //#endregion



    //#region Events



    //#endregion


    return self;
};