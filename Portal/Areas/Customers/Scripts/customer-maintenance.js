const customerMaintenanceViewModel = ({} = {}) => (
function () {

    var self = {};

    //#region Properties

    self.busy = ko.observable(false);
    self.busyMessage = ko.observable('We wish you a Merry Christmas');

    self.matrixLoader = {
        visible: self.busy,
        busyMessage: self.busyMessage,
        matrixLoaderParams: {
            visible: ko.computed(function () {
                return self.busy()
            }),
            obj: {}
        }
    }

    //#endregion

    //#region Computeds


    //#endregion

    //#region Components

    self.tradeAccountSelector = new tradeAccountSelector(getPreselectedTradeAccount(), undefined, self);

    self.tradeAccount = self.tradeAccountSelector.selected;

    //#endregion

    //#region Subscriptions


    //#endregion

    //#region Validation Groups

    self.errors = ko.validation.group([

    ]);

    //#endregion

    //#region Functions

    self.reset = function () {
        console.log('customerMaintenanceViewModel reset called', self);
        self.errors.showAllMessages(false);
    }

    //#endregion

    //#region Events


    //#endregion

    return self;

})();

const tradeAccount = ({
    
} = {

}) => (
function () {

    var self = {};

    //#region Properties

    //#endregion

    //#region Computeds


    //#endregion

    //#region Components

    //#endregion

    //#region Subscriptions


    //#endregion

    //#region Validation Groups

    self.errors = ko.validation.group([

    ]);

    //#endregion

    //#region Functions


    //#endregion

    //#region Events


    //#endregion

    return self;
}
)();