const creditControlMainGridColumn = ({ rec } = {
    rec: {}
}) => {
    let self = Object.assign(rec, {

    });

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable('Please Wait');

    self.direction = ko.observable();

    //#endregion



    //#region Components

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds

    self.columnNameDisplay = ko.computed(() => {
        return self.Title;
    }, self);

    //#endregion



    //#region Subscriptions



    //#endregion



    //#region Methods



    //#endregion



    //#region Events



    //#endregion


    return self;
};