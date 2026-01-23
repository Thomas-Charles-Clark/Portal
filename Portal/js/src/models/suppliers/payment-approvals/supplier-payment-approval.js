const supplierPaymentApprovalViewModel = ({
    rec
} = {
    rec: {}
}) => {
    let self = {

    };

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.readOnly = ko.observable(true);

    self.createdDate = ko.observable(rec.CreatedDT ? new Date(rec.CreatedDT) : new Date());

    self.supplierCode = ko.observable(rec.SupplierCode);
    self.supplier = ko.observable(rec.Supplier);

    self.currencyId = ko.observable(rec.CurrencyID);
    self.currency = ko.observable(rec.Currency);

    self.paymentRequestStatusId = ko.observable(rec.PaymentRequestStatusID);
    self.paymentRequestStatus = ko.observable(rec.PaymentRequestStatus);

    self.requestedByMemberId = ko.observable(rec.RequestedByMemberID);
    self.requestedByMember = ko.observable(rec.RequestedByMember);

    self.purchaseOrderIds = ko.observableArray(rec.PurchaseOrderHeadIDs == null ? [] : rec.PurchaseOrderHeadIDs)

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

    self.exchangeRate = ko.observable(rec.ExchangeRate);

    self.amountInCurrency = ko.observable(rec.AmountInCurrency);

    self.amountInSterling = ko.observable(rec.AmountInSterling);

    self.forexParams = {
        buttons: false,
        label: ko.computed(() => {
            if (self.currency())
                return `FX Rate ${(self.currency() && self.currency().Code)} to GBP`;
            else
                return '';
        }, self),
        observable: ko.computed(() => {
            if (self.currency() && self.exchangeRate()) {
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

    self.createdDateParams = {
        label: "Date",
        observable: self.createdDate,
        originalValue: self.createdDate(),
        displayObservable: ko.observable(),
        dateTimePickerOptions: {
            localization: {
                locale: 'en-GB',
                format: 'dd/MM/yyyy'
            },
            display: {
                sideBySide: false,
                components: {
                    clock: false,
                    calendar: true,
                    date: true,
                    month: true,
                    year: true,
                    decades: false,
                    clock: false,
                    hours: false,
                    minutes: false,
                    seconds: false
                },
                viewMode: 'months',
                cellSize: '3rem'
            },
            restrictions: {
                disabledDates: []
            },
            allowInputToggle: true,
            useCurrent: false,
            keepInvalid: true,
            debug: false
        },
        clearable: ko.observable(true),
        clearFunction: () => {
            self.createdDate(undefined);
            self.createdDateParams.observable.tempusDominus.clear();
            self.createdDateParams.observable.tempusDominus.updateOptions({
                display: {
                    viewMode: 'months'
                }
            })
        },
        revertible: ko.observable(true),
        revertFunction: () => {
            self.createdDate.observable(self.createdDateParams.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true,
    };

    self.supplierTemplate = (e) => {
        if (e.Code && e.Name) {
            return `<span title="${e.Code} - ${e.Name}">${e.Code} - ${e.Name}</span>`;
        } else {
            return '';
        }
    }

    self.supplierParams = kendoMDCDropDownList({
        label: 'Supplier',
        odata: true,
        endPoint: '/odata/MertexLiveSuppliers',
        textField: 'Name',
        valueField: 'Code',
        template: self.supplierTemplate,
        valueTemplate: self.supplierTemplate,
        idObservable: self.supplierCode,
        objObservable: self.supplier,
        locked: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'Supplier.Name'
        },
        ignoreCase: false,
        select: (e) => {
            console.log('supplierParams.select', e);
            self.currencyId(e.Currency?.CurrencyID);
            self.currencyParams.widget().trigger('change');
        },
        clearFunction: (e) => {
            self.supplierCode('');
            self.supplierParams.widget().trigger('change');
        }
    });

    self.currencyTemplate = (e) => {
        if (e.Currency && e.Currency.CurrencyID && e.Currency.Name) {
            return `<span title="${e.Currency.Name}">${e.Currency.Name}</span>`;
        } else {
            return '';
        }
    }

    self.currencyParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Currency',
        odata: true,
        endPoint: '/odata/Currencies',
        textField: 'Name',
        valueField: 'CurrencyID',
        template: self.currencyTemplate,
        valueTemplate: self.currencyTemplate,
        idObservable: self.currencyId,
        objObservable: self.currency,
        complexObjectName: 'Currency',
        complexObjectTextField: 'Name',
        locked: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'Currency.Name'
        },
        select: function (e) {
            console.log('currency select', e);
        },
        clearFunction: () => {
            self.currencyId('');
            self.currencyParams.widget().trigger('change');
        }
    });

    self.paymentRequestStatusTemplate = (e) => {
        if (e.PaymentRequestStatusID && e.Name) {
            return `<span title="${e.Name}">${e.Name}</span>`;
        } else {
            return '';
        }
    }

    self.paymentRequestStatusParams = kendoMDCDropDownList({
        label: 'Payment Request Status',
        odata: true,
        endPoint: '/odata/PaymentRequestStatuses',
        textField: 'Name',
        valueField: 'PaymentRequestStatusID',
        template: self.paymentRequestStatusTemplate,
        valueTemplate: self.paymentRequestStatusTemplate,
        idObservable: self.paymentRequestStatusId,
        objObservable: self.paymentRequestStatus,
        locked: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'SortOrder'
        },
        ignoreCase: false,
        select: (e) => {
            console.log('paymentRequestStatus.select', e);
        },
        clearFunction: (e) => {
            self.paymentRequestStatusId('');
            self.paymentRequestStatusParams.widget().trigger('change');
        }
    });

    self.amountInCurrencyParams = {
        label: 'Amount in Currency',
        buttons: false,
        observable: self.amountInCurrency,
        originalValue: self.amountInCurrency(),
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
        observable: self.amountInSterling,
        originalValue: self.amountInSterling(),
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
            self.amountInSterling(undefined);
        },
        revertFunction: () => {
            self.amountInSterling(self.amountInSterlingParams.originalValue);
        }
    }

    self.amountInSterlingFormatted = ko.computed(() => {
        if (self.amountInSterling() != null) {
            return formatCurrency(self.amountInSterling(), 2, 'en-GB', 'GBP');
        } else {
            return '';
        }
    }, self);

    self.amountParams = {
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