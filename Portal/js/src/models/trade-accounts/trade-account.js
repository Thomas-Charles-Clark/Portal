const tradeAccountViewModel = ({
    rec
} = {
    rec: {

    }
}) => {
    let self = Object.assign({}, rec);

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    //#endregion



    //#region Methods



    //#endregion



    //#region Components

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds

    self.title = ko.computed(() => {
        return `Trade Account ID: ${self.TradeAccountID}`;
    }, self);

    self.label = ko.computed(() => {
        return `${self.Code ?? self.TradeAccountCode} - ${self.Name ?? self.TradeAccountName}`;
    }, self);

    //#endregion





    //#region Subscriptions



    //#endregion



    //#region Events



    //#endregion


    return self;
};