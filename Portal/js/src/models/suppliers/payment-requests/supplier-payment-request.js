const supplierPaymentRequestViewModel = ({
    rec
} = {
    rec: {}
}) => {
    let self = Object.assign({

    }, rec);

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.readOnly = ko.observable(true);

    self.purchaseOrderIds = ko.observableArray(self.PurchaseOrderHeadIDs == null ? [] : self.PurchaseOrderHeadIDs)

    self.bootstrapPopoverDetails = {
        title: "Purchase Order IDs",
        html: true,
        sanitize: false,
        busy: ko.observable(false),
        data: ko.observable(),
        element: ko.observable(),
        container: 'td.purchase-orders',
        placement: 'bottom',
        fallbackPlacements: ['top'],
        customClass: 'purchase-orders-popover',
        content: (element) => {
            let e = ko.dataFor(element);
            console.log('purchaseOrderPopover content called', e);
            return `Potato`;
        },
        trigger: 'click',
        solo: true,
        show: null,
        shown: null,
        hide: null,
        hidden: null,
        inserted: async function (event) {
                                
        },
        popperConfig: function (defaultBsPopperConfig) {
            return defaultBsPopperConfig;
        }
    }

    self.supplierCurrency = ko.observable(self.Supplier.Currency);

    self.exchangeRate = ko.observable(self.ExchangeRate);

    self.amountCurrency = ko.observable(self.AmountInCurrency);

    self.amountSterling = ko.observable(self.AmountInSterling);

    self.forexParams = {
        buttons: false,
        label: ko.computed(() => {
            if (self.supplierCurrency())
                return `FX Rate ${(self.supplierCurrency() && self.supplierCurrency().Code)} to GBP`;
            else
                return '';
        }, self),
        observable: ko.computed(() => {
            if (self.supplierCurrency() && self.exchangeRate()) {
                return formatNumber(self.exchangeRate(), 4, 'en-GB', 'GBP');
            }
        }, self),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        enable: ko.observable(true),
        disable: ko.observable(true),
        locked: ko.observable(true),
        clearable: ko.observable(false),
        revertible: ko.observable(false),
        busy: ko.observable(false),
        inputType: 'text',
        minValue: 0.01,
        maxValue: null,
        step: 1
    }

    //#endregion



    //#region Components

    self.amountInCurrencyParams = {
        label: 'Amount in Currency',
        buttons: false,
        observable: self.amountCurrency,
        originalValue: self.amountCurrency(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        enable: ko.computed(() => {
            return !self.readOnly()
        }, self),
        disable: ko.computed(() => {
            return self.readOnly() ? true : self.disabled()
        }, self),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        busy: ko.observable(false),
        inputType: 'text',
        minValue: 0,
        maxValue: null,
        step: null,
        clearFunction: () => {
            self.amountCurrency(undefined);
        },
        revertFunction: () => {
            self.amountCurrency(self.vatableAmountInCurrencyParams.originalValue);
        }
    }

    self.amountInSterlingParams = {
        label: 'Amount in Sterling',
        buttons: false,
        observable: self.amountSterling,
        originalValue: self.amountSterling(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        enable: ko.computed(() => {
            return !self.readOnly()
        }, self),
        disable: ko.computed(() => {
            return self.readOnly() ? true : self.disabled()
        }, self),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        busy: ko.observable(false),
        inputType: 'text',
        minValue: 0,
        maxValue: null,
        step: null,
        clearFunction: () => {
            self.amountSterling(undefined);
        },
        revertFunction: () => {
            self.amountSterling(self.amountSterlingParams.originalValue);
        }
    }

    self.amountInSterlingFormatted = ko.computed(() => {
        return formatCurrency(self.AmountInSterling(), 2, 'en-GB', 'GBP');
    }, self);

    self.amountParmas = {
        highlightOnNull: ko.observable(true),
        inputParams: self.amountInCurrencyParams,
        forexParams: self.forexParams,
        convertedParams: {
            label: 'Amount in Currency',
            buttons: false,
            observable: self.amountInSterlingFormatted,
            useNativeValidation: false,
            decorateInputElement: false,
            insertValidationMessages: false,
            enable: ko.observable(false),
            disable: ko.observable(true),
            locked: ko.observable(true),
            clearable: ko.observable(false),
            revertible: ko.observable(false),
            busy: ko.observable(false),
            inputType: 'text',
            minValue: 0.01,
            maxValue: null,
            step: 1
        }
    }

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds

    self.purchaseOrdersLabel = ko.computed(() => {
        let purchaseOrders = self.purchaseOrderIds();

        if (purchaseOrders.length == 0) {
            return '';
        }

        if (purchaseOrders.length == 1) {
            return purchaseOrders[0];
        }

        if (purchaseOrders.length > 1) {
            return 'Various'
        }
    });

    //#endregion



    //#region Subscriptions



    //#endregion



    //#region Methods



    //#endregion



    //#region Events



    //#endregion


    return self;
};