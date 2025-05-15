const EMPTY_STRING = '';

const giftVouchersViewModel = (() => {
    let self = {};

    //#region Properties

    self.busy = ko.observable(true);

    self.busyMessage = ko.observable("Loading");

    //#endregion


    //#region Lifted Bits

    //#endregion


    //#region Components

    //#endregion


    //#region Computeds

    //#endregion


    //#region Subscriptions

    //#endregion


    //#region Methods

    self.init = () => {
        self.busy(false);
    }

    //#endregion


    //#region Events

    //#endregion


    return self;
});