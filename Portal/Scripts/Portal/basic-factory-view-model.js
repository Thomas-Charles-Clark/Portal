var basicFactoryViewModel = ({ parent } = {}) => function () {
    var self = {};

    //#region Properties

    self.parent = parent;

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable(undefined);

    //#endregion

    //#region Computeds (Knockout-specific)



    //#endregion

    //#region Components (Knockout-specific)



    //#endregion

    //#region Subscriptions (Knockout-specific)



    //#endregion

    //#region Validation Groups (Knockout-specific)

    self.errors = ko.validation.group([

    ]);

    //#endregion

    //#region Functions

    self.reset = function () {
        console.log('basicFactory reset called', self);
        self.errors.showAllMessages(false);
    }

    //#endregion

    //#region Events



    //#endregion

    return self;
}();