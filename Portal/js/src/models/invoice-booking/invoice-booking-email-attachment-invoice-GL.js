const invoiceBookingEmailInvoiceGLViewModel = ({
    rec,
    parent
} = {

    }) => {
    let self = Object.assign(rec, {
        validateNow: parent.validateNow,
        readOnly: parent.readOnly,
        supplier: parent.supplier,
        supplierCurrency: parent.supplierCurrency,
        forexParams: parent.forexParams,
        exchangeRate: parent.exchangeRate,
        disabled: ko.computed(() => { return parent.preambleSatisfied() == false; })
    });

    //#region Properties

    self.generalLedgerCode = ko.observable(rec.generalLedgerCode ?? '').extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'You must provide a GL Code'
        },
        notEqual: {
            params: '',
            onlyIf: self.validateNow,
            message: 'You must provide a GL Code'
        }
    });

    self.generalLedger = ko.observable();

    self.amountExVATInCurrency = ko.observable(rec.amountExVATInCurrency).extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'You must provide an amount'
        },
        numberFormatted: {
            digits: 2,
            currency: {
                FormattingCulture: 'en-GB'
            },
            minValue: 0
        }
    });

    //#endregion


    //#region Lifted Bits



    //#endregion


    //#region Components

    self.generalLedgerCodeParams = kendoMDCDropDownList({
        autoBind: true,
        label: 'General Ledger Code',
        endPoint: '/api/InvoiceBookingAPI/GetGeneralLedgerCodes',
        textField: 'DisplayLabel',
        valueField: 'Code',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value && options.value != '') {

                    let qs = new URLSearchParams();

                    qs.append("code", options.value);

                    $.ajax({
                        url: `/api/InvoiceBookingAPI/GetGeneralLedgerCodeValueMapper?${qs}`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.Data[0]);
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        schema: $.extend({}, kendo.data.schemas.webapi),
        template: (e) => {
            if (e.DisplayLabel)
                return e.DisplayLabel;
            else
                return 'Loading...';
        },
        valueTemplate: (e) => {
            if (e.Code != null && e.Code != '' && e.AnalysisCodeDescription != null && e.AnalysisCodeDescription != '') {
                return e.DisplayLabel;
            } else {
                return '';
            }
        },
        fixedGroupTemplate: (e) => {
            console.log('fixedGroupTemplate', e);
            return `Analysis Group: ${e}`
        },
        grouping: {
            field: 'GroupD.Name',
            dir: 'asc'
        },
        groupHeaderTemplate: (e) => {
            return `${e.Type.Name}`
        },
        idObservable: self.generalLedgerCode,
        objObservable: self.generalLedger,
        enable: ko.computed(() => {
            return !self.readOnly()
        }, self),
        disable: self.readOnly,
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: self.readOnly,
        filter: 'contains',
        filtering: function (e) {
            if (e.filter.value == '' || e.filter.value?.trimEnd() == '') {
                e.preventDefault();
                e.sender.dataSource.filter({});
            }
        },
        height: 340,
        popupSettings: {
            appendTo: '.attachment-property'
        }
    });

    self.amountExVATInCurrencyParams = {
        label: 'Amount ex. VAT in Currency',
        buttons: false,
        observable: self.amountExVATInCurrency,
        originalValue: self.amountExVATInCurrency(),
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
            self.amountExVATInCurrency(undefined);
        },
        revertFunction: () => {
            self.amountExVATInCurrency(self.amountExVATInCurrencyParams.originalValue);
        }
    }

    self.forexParams = () => {
        return {
            buttons: false,
            label: ko.computed(() => {
                if (self.supplierCurrency())
                    return `FX Rate ${(self.supplierCurrency() && self.supplierCurrency().Code)} to GBP`;
                else
                    return '';
            }, self),
            observable: ko.computed(() => {
                if (self.exchangeRate()) {
                    return formatNumber(self.exchangeRate(), 4, 'en-GB', 'GBP');
                } else {
                    return self.supplier() && formatNumber(self.supplier().ExchangeRate.SterlingExchangeRate, 4, 'en-GB', 'GBP');
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
        };
    };

    self.amountExVATInSterling = rec.amountExVATInSterling ? ko.observable(rec.amountExVATInSterling) : ko.computed(() => {

        let amountExVAT = +self.amountExVATInCurrency();

        if (amountExVAT && self.supplier()) {

            let result = Math.round(amountExVAT / (self.supplier().ExchangeRate.SterlingExchangeRate) * 10000) / 10000;

            return result;
        }

    }, self).extend({
        numberFormatted: {
            digits: 2,
            currency: {
                FormattingCulture: 'en-GB'
            },
            minValue: 0
        }
    });

    self.amountExVATInSterlingFormatted = ko.computed(() => {
        let result = self.amountExVATInSterling();

        if (result != null) {
            return formatCurrency(result, 2, 'en-GB', 'GBP');
        } else {
            return formatCurrency(0, 2, 'en-GB', 'GBP');
        }
    });

    self.amountExParams = {
        highlightOnNull: ko.observable('potato'),
        inputParams: self.amountExVATInCurrencyParams,
        forexParams: self.forexParams(),
        convertedParams: {
            label: 'Amount ex. VAT in Sterling',
            buttons: false,
            observable: self.amountExVATInSterlingFormatted,
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
        self.generalLedgerCode,
        self.amountExVATInCurrency
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
}