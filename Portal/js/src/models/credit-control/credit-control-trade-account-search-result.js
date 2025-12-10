const creditControlTradeAccountSearchResultViewModel = ({
    rec,
    parent
} = {
        rec: {},
        parent: {}
    }) => {
    let self = Object.assign({
        selectionObservable: parent.tradeAccountContacts.selectedTradeAccount,
        fetchContacts: parent.tradeAccountContacts.fetchContacts
    }, rec);

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    Object.keys(rec).forEach(k => {
        if (k.endsWith('Value')) {
            self[`${k[0].toLowerCase()}${k.substring(1)}`] = ko.observable(self[k]).extend({
                currencyFormatted: {
                    digits: 2,
                    currency: {
                        Code: self.CurrencyCode,
                        FormattingCulture: self.FormattingCulture
                    }
                }
            });
        } else if (k.endsWith('Quantity')) {
            self[`${k[0].toLowerCase()}${k.substring(1)}`] = ko.observable(self[k]).extend({
                numberFormatted: {
                    digits: 0,
                    currency: {
                        FormattingCulture: self.FormattingCulture
                    }
                }
            });
        } else {
            self[`${k[0].toLowerCase()}${k.substring(1)}`] = ko.observable(self[k]);
        }
    })

    //#endregion



    //#region Methods

    self.openContactsModal = () => {
        self.selectionObservable(tradeAccountViewModel({
            rec: self
        }));
        self.fetchContacts(self.TradeAccountID);
    }

    //#endregion



    //#region Components

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds



    //#endregion





    //#region Subscriptions



    //#endregion



    //#region Events



    //#endregion


    return self;
};