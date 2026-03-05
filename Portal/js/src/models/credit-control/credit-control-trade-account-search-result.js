const creditControlTradeAccountSearchResultViewModel = ({
    rec,
    parent
} = {
        rec: {},
        parent: {}
    }) => {
    let self = Object.assign({
        selectionObservable: parent.tradeAccountContacts.selectedTradeAccount,
        fetchContacts: parent.tradeAccountContacts.fetchContacts,
        confirmedToggleStop: parent.toggleCreditStop
    }, rec);

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.validateNow = ko.observable(false);

    self.stopChangeReason = ko.observable().extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'Please provide a reason'
        },
        notEqual: {
            params: '',
            onlyIf: self.validateNow,
            message: 'Please provide a reason'
        }
    });

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
    });

    self.onStop = ko.observable(rec.CreditStop);

    self.popoverDetails = {
        title: "Please Confirm",
        html: true,
        sanitize: false,
        busy: ko.observable(false),
        data: ko.observable(),
        element: ko.observable(),
        container: 'div.popover-container',
        placement: 'right',
        modifiers: {
            //offset: {
            //    offset: "-100px,100px"
            //}
        },
        fallbackPlacements: ['right', 'bottom'],
        customClass: 'confirm-credit-toggle-popover',
        content: (element) => {
            let e = ko.dataFor(element);
            return `<div class="mb-3" data-bind="component: { name: 'mdc-text-area-component', params: stopChangeReasonParams }"></div>
            <div class="d-flex justify-content-end align-items-center">
                <button class="btn btn-secondary" data-bind="click: toggleCreditStop">
                    Confirm
                </button>
            </div>`;
        },
        trigger: 'click focus',
        template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
        //container: 'td',
        solo: true,
        show: null,
        shown: null,
        hide: null,
        hidden: null,
        inserted: async function (event) {

            let popEl = self.popoverDetails.popover.tip;

            if (popEl) {

                ko.cleanNode(popEl);

                let vm = self;

                ko.applyBindings(vm, popEl);

                let dat = ko.dataFor(popEl);

                //window.setTimeout(() => {
                //    vm.stopChangeReason.mdcTextField.focus();
                //}, 0);

                dat.busy(false);
            }

        },
        popperConfig: function (defaultBsPopperConfig) {
            return defaultBsPopperConfig;
        }
    };

    //#endregion



    //#region Methods

    self.openContactsModal = () => {
        self.selectionObservable(tradeAccountViewModel({
            rec: self
        }));
        self.fetchContacts(self.TradeAccountID);
    }

    self.toggleCreditStop = (data, event) => {

        self.validateNow(true);

        window.setTimeout(() => {

            if (self.errors().length) {
                self.errors.forEach(e => {
                    e.isValid.notifySubscribers(e.isValid());
                })
            } else {
                self.confirmedToggleStop(self); // self.confirmedToggleStop is actually the parent's implementation of toggleCreditStop.
            }

        }, 0);

        //let message = `This will put ${self.TradeAccountCode} on stop.`;

        //if (self.onStop()) {
        //    message = `This will take ${self.TradeAccountCode} off stop.`;
        //}

        //window.showConfirm('Are you sure?', message, () => {
        //    self.confirmedToggleStop(self); // self.confirmedToggleStop is actually the parent's implementation of toggleCreditStop.
        //}, null);
    }

    //#endregion



    //#region Components

    self.stopChangeReasonParams = {
        label: 'Reason',
        originalValue: ko.observable(),
        observable: self.stopChangeReason,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        rows: 4,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: false,
        charsRemainingOptions: {
            maxLength: 500
        },
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        visible: ko.observable(true)
    };

    self.errors = new ko.validation.group([
        self.stopChangeReason
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