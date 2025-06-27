const invoiceBookingEmailInvoiceVATViewModel = ({
    rec,
    parent
} = {

    }) => {
    let self = Object.assign(rec, {
        validateNow: parent.validateNow,
        readOnly: parent.readOnly,
        supplier: parent.supplier,
        forexParams: parent.forexParams,
        disabled: ko.computed(() => { return parent.preambleSatisfied() == false; })
    });

    //#region Properties

    self.vatableAmountCurrency = ko.observable(rec.vatableAmountCurrency).extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'You must provide a VATable amount'
        },
        numberFormatted: {
            digits: 2,
            currency: {
                FormattingCulture: 'en-GB',
                Code: 'GBP'
            },
            minValue: 0
        }
    });

    self.vatCode = ko.observable(rec.vatCode ?? '').extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'You must provide a VAT Code'
        },
        notEqual: {
            params: '',
            onlyIf: self.validateNow,
            message: 'You must provide a VAT Code'
        }
    });

    self.vatableAmountSterling = ko.observable(rec.vatableAmountSterling);

    self.vatAmountSterling = ko.observable(rec.vatAmountSterling);

    self.exchangeRate = ko.observable(rec.exchangeRate);

    self.vatRate = ko.observable(rec.vatRate);

    self.vatObj = ko.observable(rec.vatObj);

    self.supplierCurrency = rec.supplierCurrency ? ko.observable(ko.unwrap(rec.supplierCurrency)) : parent.supplierCurrency;

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
                if (self.supplierCurrency() && self.exchangeRate()) {
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

    //#region Computeds
    
    self.vatInCurrency = ko.computed(() => {

        if (self.vatAmountCurrency) {
            return self.vatAmountCurrency;
        }

        let vatableAmountCurrency = self.vatableAmountCurrency();
        let vatRate = self.vatRate() ?? (self.vatObj() ? self.vatObj().VATRate : null);

        if (vatableAmountCurrency && vatRate) {
            return vatableAmountCurrency - (Math.round((vatableAmountCurrency * Math.round((2 - vatRate) * 100) / 100) * 100) / 100);
        }
    }, self).extend({
        numberFormatted: {
            currency: {
                FormattingCulture: 'en-GB',
                Code: 'GBP'
            },
            digits: 2,
            minValue: 0
        }
    });

    self.vatInCurrencyFormatted = ko.computed(() => {
        let vatInCurrency = self.vatInCurrency();

        if (self.supplierCurrency()) {
            if (vatInCurrency != null) {
                return formatCurrency(vatInCurrency, 2, self.supplierCurrency().FormattingCulture, self.supplierCurrency().Code)
            } else {
                return formatCurrency(0, 2, self.supplierCurrency().FormattingCulture, self.supplierCurrency().Code)
            }
        } 
    }, self);

    //#endregion

    self.vatableAmountInCurrencyParams = {
        label: 'VATable Amount in Currency',
        buttons: false,
        observable: self.vatableAmountCurrency,
        originalValue: self.vatableAmountCurrency(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        enable: ko.observable(true),
        disable: self.readOnly ? ko.observable(true) : self.disabled,
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        busy: ko.observable(false),
        inputType: 'text',
        minValue: 0,
        maxValue: null,
        step: null,
        clearFunction: () => {
            self.vatableAmountCurrency(undefined);
        },
        revertFunction: () => {
            self.vatableAmountCurrency(self.vatableAmountInCurrencyParams.originalValue);
        }
    }

    self.vatableAmountToSterlingComputer = ko.computed(() => {

        // this is only available if we're loading from a save
        if (self.vatableAmountSterling() != null) {
            return self.vatableAmountSterling();
        }
        
        let vatableAmount = +self.vatableAmountCurrency();

        let exchangeRate = self.exchangeRate() ?? (self.supplier() ? self.supplier().ExchangeRate.SterlingExchangeRate : null);

        if (vatableAmount && self.supplier()) {

            let result = Math.round((vatableAmount / exchangeRate) * 10000) / 10000;

            return result;
        } else {
            return 0;
        }
        
    }, self).extend({
        numberFormatted: {
            digits: 4,
            currency: self.supplierCurrency,
            minValue: 0
        }
    });

    self.vatableAmountToSterlingComputerFormatted = ko.computed(() => {
        return formatCurrency(self.vatableAmountToSterlingComputer(), 2, 'en-GB', 'GBP');
    }, self);

    self.vatableAmountConverter = {
        highlightOnNull: ko.observable('potato'),
        inputParams: self.vatableAmountInCurrencyParams,
        forexParams: self.forexParams(),
        convertedParams: {
            label: 'VATable Amount in Sterling',
            buttons: false,
            observable: self.vatableAmountToSterlingComputerFormatted,
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

    self.vatParams = {
        label: 'VAT in Currency',
        buttons: false,
        observable: self.vatInCurrency,
        originalValue: self.vatInCurrency(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        enable: ko.observable(true),
        disable: ko.observable(true),
        clearable: ko.observable(false),
        revertible: ko.observable(false),
        busy: ko.observable(false),
        inputType: 'text',
        minValue: 0,
        maxValue: null,
        step: null
    }

    self.vatCodeParams = kendoMDCDropDownList({
        autoBind: true,
        label: 'VAT Code',
        odata: true,
        endPoint: '/odata/VATCodes',
        textField: 'Name',
        valueField: 'Code',
        virtual: false,
        template: (e) => {
            if (e.Code != null && e.Code != '' && e.Name != null && e.Name != '')
                return `${e.Code} - ${e.Name} (${(Math.round((e.VATRate - 1) * 100) / 100) * 100}%)`;
            else
                return '';
        },
        valueTemplate: (e) => {
            if (e.Code != null && e.Code != '' && e.Name != null && e.Name != '') {
                return `${e.Code} - ${e.Name} (${(Math.round((e.VATRate - 1) * 100) / 100) * 100}%)`;
            } else {
                return '';
            }
        },
        idObservable: self.vatCode,
        objObservable: self.vatObj,
        enable: ko.observable(true),
        disable: self.readOnly ? ko.observable(true) : self.disabled,
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        height: 340,
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            /// thanks, https://stackoverflow.com/questions/28995757/a-binary-operator-with-incompatible-types-was-detected-found-operand-types-edm/48919770
            delete d.$inlinecount; // <-- remove inlinecount
            //delete d.$format; // <-- remove format
            //delete d.$callback; // <-- remove callback

            d.$count = true;

            if (data.filter &&
                data.filter.filters.length &&
                data.filter.filters[0].value != '') {

                let filterValue = data.filter.filters[0].value;

                d.$filter = `StartsWith(ToLower(Code), '${filterValue}') OR Contains(ToLower(Name), '${filterValue}')`;
            }

            return d;
        },
        sort: [{
            field: 'SortOrder',
            dir: 'asc'
        }],
        popupSettings: {
            appendTo: '#vat-entries'
        }
    });

    self.vatToSterlingComputer = ko.computed(() => {

        if (self.vatAmountSterling()) { 
            return self.vatAmountSterling(); 
        }

        let vatInCurrency = +self.vatInCurrency();

        let exchangeRate = self.exchangeRate() ?? (self.supplier() ? self.supplier().ExchangeRate.SterlingExchangeRate : null);

        if (vatInCurrency && exchangeRate) {

            let result = Math.round((vatInCurrency * exchangeRate) * 10000) / 10000;

            return result;
        } else {
            return 0;
        }

    }, self).extend({
        numberFormatted: {
            digits: 4,
            currency: {
                FormattingCulture: 'en-GB', Code: 'GBP'
            },
            minValue: 0
        }
    });

    self.vatToSterlingComputerFormatted = ko.computed(() => {
        return formatCurrency(self.vatToSterlingComputer(), 2, 'en-GB', 'GBP');
    });

    self.vatConverter = {
        highlightOnNull: ko.observable('potato'),
        inputParams: self.vatParams,
        forexParams: self.forexParams(),
        convertedParams: {
            label: 'VAT in Sterling',
            buttons: false,
            observable: self.vatToSterlingComputerFormatted,
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

    //#endregion


    //#region Lifted Bits



    //#endregion


    //#region Components



    //#endregion



    //#region Subscriptions

    self.vatObj.subscribe(nv => {
        if (nv && self.vatRate() == null) {
            self.vatRate(nv.VATRate);
        }
    });

    self.supplier.subscribe(nv => {
        if (nv && self.exchangeRate() == null) {
            self.exchangeRate(nv.ExchangeRate.SterlingExchangeRate);
        }
    })

    //#endregion


    //#region Methods


    //#endregion


    //#region Events



    //#endregion

    return self;
}