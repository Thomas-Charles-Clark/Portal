const supplierPaymentsHistorySummaryViewModel = ({
    ready,
    busy,
    busyMessage,
    filters,
    refreshDashboard
} = {
        ready: ko.observable(false),
        busy: ko.observable(false),
        busyMessage: ko.observable('Please Wait'),
        filters: {},
        refreshDashboard: () => { }
    }) => {

    let self = {
        ready,
        busy: ko.observable(false),
        parentBusy: busy,
        busyMessage,
        filters,
        refreshDashboard
    };

    //#region Properties

    self.gridWidget = ko.observable();

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



    //#endregion



    //#region Events



    //#endregion


    return self;
};