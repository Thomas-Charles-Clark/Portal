const creditControlAllocateHoldingAccountCashRecordViewModel = ({
    rec
} = {
    rec: {}
}) => {
    let self = Object.assign({}, rec);

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable('Please Wait');
    
    //#endregion



    //#region Components

    self.unallocatedCashAssignedToThisOrderTotalInCurrencyPopoverDetails = {
        title: "Breakdown",
        html: true,
        sanitize: false,
        busy: ko.observable(false),
        data: ko.observable(),
        element: ko.observable(),
        placement: 'right',
        container: '.modal-body',   // this is specified as being .modal-body (#sales-ledger-modal) 
        // despite the fact that this control is most often 
        // found in the main grid's Errata: Stopped column
        // because it will null-coalesce to 'body': see defn of 
        // 'actualBootstrapPopover' in knockout - extensions.js
        customClass: 'unallocated-deposits-popover',
        content: (element) => {
            let e = ko.dataFor(element);
            return `<div class="mb-0">${e.UnallocatedCashAssignedToThisOrderBreakdown}</div>`;
        },
        trigger: 'click',
        solo: true,
        show: null,
        hide: null,
        hidden: null,
        inserted: async function (event) {

            let popEl = self.unallocatedCashAssignedToThisOrderTotalInCurrencyPopoverDetails.popover.tip;

            if (popEl) {

                ko.cleanNode(popEl);

                let vm = self;

                ko.applyBindings(vm, popEl);

                let dat = ko.dataFor(popEl);

                //window.setTimeout(() => {
                //    vm.stopChangeReason.mdcTextField.focus();
                //}, 0);

                dat.busy(false);

                event.target.closest('.k-grid-content')?.addEventListener('scroll', (event) => {
                    document.querySelectorAll('[data-bind*="actualBootstrapPopover"]').forEach(e => {
                        let p = bootstrap.Popover.getInstance(e);
                        if (p) {
                            p.hide();
                        }
                    });
                });

                window.setTimeout(() => {
                    document.addEventListener("click", (e) => {
                        if (e.target.closest('.unallocated-deposits-popover') == null) {
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

    self.unallocatedCashAssignedToThisAccountTotalInCurrencyPopoverDetails = {
        title: "Breakdown",
        html: true,
        sanitize: false,
        busy: ko.observable(false),
        data: ko.observable(),
        element: ko.observable(),
        placement: 'right',
        container: '.modal-body',   // this is specified as being .modal-body (#sales-ledger-modal) 
        // despite the fact that this control is most often 
        // found in the main grid's Errata: Stopped column
        // because it will null-coalesce to 'body': see defn of 
        // 'actualBootstrapPopover' in knockout - extensions.js
        customClass: 'unallocated-deposits-popover',
        content: (element) => {
            let e = ko.dataFor(element);
            return `<p class="mb-0">${e.UnallocatedCashAssignedToThisAccountBreakdown}</p>`;
        },
        trigger: 'click',
        solo: true,
        show: null,
        hide: null,
        hidden: null,
        inserted: async function (event) {

            let popEl = self.unallocatedCashAssignedToThisAccountTotalInCurrencyPopoverDetails.popover.tip;

            if (popEl) {

                ko.cleanNode(popEl);

                let vm = self;

                ko.applyBindings(vm, popEl);

                let dat = ko.dataFor(popEl);

                //window.setTimeout(() => {
                //    vm.stopChangeReason.mdcTextField.focus();
                //}, 0);

                dat.busy(false);

                event.target.closest('.k-grid-content')?.addEventListener('scroll', (event) => {
                    document.querySelectorAll('[data-bind*="actualBootstrapPopover"]').forEach(e => {
                        let p = bootstrap.Popover.getInstance(e);
                        if (p) {
                            p.hide();
                        }
                    });
                });

                window.setTimeout(() => {
                    document.addEventListener("click", (e) => {
                        if (e.target.closest('.unallocated-deposits-popover') == null) {
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