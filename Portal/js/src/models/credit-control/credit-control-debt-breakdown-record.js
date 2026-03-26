const creditControlDebtBreakdownRecordViewModel = ({
    rec
} = {
        rec: {}
    }) => {
    let self = Object.assign({

    }, rec);

    self.validateNow = ko.observable(false);

    self.potato = ko.observable(false).extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'Please provide a potato'
        },
        notEqual: {
            params: false,
            onlyIf: self.validateNow,
            message: 'Please provide a true potato'
        }
    });

    self.potatoCheckboxParams = {
        label: 'Potato?',
        checkboxId: `potato-checkbox`,
        observable: self.potato,
        originalValue: false,
        useNativeValidation: false,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false)
    }

    self.popoverDetails = {
        title: "Potato",
        html: true,
        sanitize: false,
        busy: ko.observable(false),
        data: ko.observable(),
        element: ko.observable(),
        placement: 'left',
        //container: '.modal-body',   // this is specified as being .modal-body (#debt-breakdown-modal) 
        // despite the fact that this control is most often 
        // found in the main grid's Errata: Stopped column
        // because it will null-coalesce to 'body': see defn of 
        // 'actualBootstrapPopover' in knockout - extensions.js
        customClass: 'debt-breakdown-proforma-value-popover',
        content: (element) => {
            let e = ko.dataFor(element);
            return `<div id="proforma-value-breakdown-table-wrapper">
                <table class="table table-bordered proforma-value-breakdown-table">
                    <colgroup>
                        <col />
                        <col />
                        <col />
                        <col />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>
                                One
                            </th>
                            <th>
                                Two
                            </th>
                            <th>
                                Three
                            </th>
                            <th>
                                Potato
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                A
                            </td>
                            <td class="credit-history-indicator">
                                B
                            </td>
                            <td>
                                C
                            </td>
                            <td>
                                Dotato
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>
            <h5 class="my-4 bold">
                Potato Breakdown
            </h5>
            <div class="mb-3" data-bind="component: { name: 'mdc-checkbox-component', params: potatoCheckboxParams }"></div>
            <div class="d-flex justify-content-end align-items-center">
                <button class="btn btn-secondary" data-bind="click: saveThePotato">
                    Confirm the Potato
                </button>
            </div>`;
        },
        trigger: 'click',
        solo: true,
        show: null,
        shown: (e) => {
           
        },
        hide: null,
        hidden: null,
        inserted: async function(event) {

            let popEl = self.popoverDetails.popover.tip;

            if (popEl) {

                ko.cleanNode(popEl);

                let vm = self;

                ko.applyBindings(vm, popEl);

                let dat = ko.dataFor(popEl);

                //window.setTimeout(() => {
                //    vm.stopChangeReason.mdcTextField.focus();
                //}, 0);

                //dat.busy(false);

                window.setTimeout(() => {
                    document.addEventListener("click", (e) => {
                        if (e.target.closest('.debt-breakdown-proforma-value-popover') == null) {
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
                    });
                }, 0);
            }
        },
        popperConfig: (defaultPopperConfig) => defaultPopperConfig
    };

    //#endregion



    //#region Methods

    self.saveThePotato = () => {
        self.validateNow(true);

        window.setTimeout(() => {
            if (self.errors().length) {
                self.errors.filter(x => {
                    x.isValid.notifySubscribers(x.isValid());
                })
            } else {
                window.showInfo('Hurrah!', 'All praise the great Potatoverlord!')
            }
        }, 0);
    }

    //#endregion



    //#region Components

    self.errors = new ko.validation.group([
        self.potato
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