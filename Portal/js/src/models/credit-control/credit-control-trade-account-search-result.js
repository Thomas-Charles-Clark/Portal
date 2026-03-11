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

    self.onStopHistoryRecords = ko.observableArray(JSON.parse(rec.CreditStopHistory));

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
        placement: 'right',
        modifiers: {
            //offset: {
            //    offset: "-10,10"
            //}
        },
        fallbackPlacements: ['right', 'bottom'],
        customClass: 'confirm-credit-toggle-popover',
        content: (element) => {
            let e = ko.dataFor(element);
            return `<div id="credit-control-history-table-wrapper">
                <table class="table table-bordered credit-control-history-table">
                    <colgroup>
                        <col />
                        <col />
                        <col />
                        <col />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>
                                Changed
                            </th>
                            <th>
                                To
                            </th>
                            <th>
                                By
                            </th>
                            <th>
                                Why
                            </th>
                        </tr>
                    </thead>
                    <tbody data-bind="foreach: onStopHistoryRecords">
                        <tr>
                            <td>
                                <span data-bind="text: moment(ChangedDT).format('DD/MM/YYYY HH:mm')"></span>
                            </td>
                            <td class="credit-history-indicator">
                                <!-- ko if: ChangedTo -->
                                <i class="bi bi-exclamation-octagon-fill"></i>
                                <!-- /ko -->
                                <!-- ko ifnot: ChangedTo -->
                                <i class="bi bi-hand-thumbs-up-fill"></i>
                                <!-- /ko -->
                            </td>
                            <td>
                                <span data-bind="text: ChangedBy"></span>
                            </td>
                            <td>
                                <div data-bind="html: Reason"></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>
            <h5 class="my-4 bold" data-bind="css: { 'text-danger': !CreditStop }">
                You&apos;re about to <span data-bind="text: CreditStop ? 'remove the Credit Stop flag from this account' : 'set the Credit Stop flag on this account'"></span>
            </h4>
            <div class="mb-3" data-bind="component: { name: 'mdc-text-area-component', params: stopChangeReasonParams }"></div>
            <div class="d-flex justify-content-end align-items-center">
                <button class="btn btn-secondary" data-bind="click: toggleCreditStop">
                    Confirm
                </button>
            </div>`;
        },
        trigger: 'click',
        solo: true,
        show: null,
        shown: (e) => {
            window.setTimeout(() => {
                self.stopChangeReason.mdcTextField.layout();
                window.setTimeout(() => {
                    self.stopChangeReason.mdcTextField.focus();
                }, 100);
            }, 0);
        }, 
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

                event.target.closest('.k-grid-content').addEventListener('scroll', (event) => {
                    document.querySelectorAll('[data-bind*="actualBootstrapPopover"]').forEach(e => {
                        let p = bootstrap.Popover.getInstance(e);
                        if (p) {
                            p.hide();
                        }
                    });
                });

                window.setTimeout(() => {
                    document.addEventListener("click", (e) => {
                        if (e.target.closest('.confirm-credit-toggle-popover') == null) {
                            document.querySelectorAll('[data-bind*="actualBootstrapPopover"]').forEach(e => {
                                let p = bootstrap.Popover.getInstance(e);
                                if (p) {
                                    p.hide();
                                }
                            });
                        }
                    });
                    document.addEventListener('scroll', () => {
                        document.querySelectorAll('[data-bind*="actualBootstrapPopover"]').forEach(e => {
                            let p = bootstrap.Popover.getInstance(e);
                            if (p) {
                                p.hide();
                            }
                        });
                    })
                }, 0);
            }

        },
        popperConfig: (defaultPopperConfig) => defaultPopperConfig
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