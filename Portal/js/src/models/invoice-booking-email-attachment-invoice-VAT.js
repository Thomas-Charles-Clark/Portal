const invoiceBookingEmailInvoiceVATViewModel = ({
    rec,
    parent
} = {

    }) => {
    let self = Object.assign(rec, {
        validateNow: parent.validateNow
    });

    //#region Properties

    self.vat = ko.observable(rec.VAT).extend({
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

    self.vatCode = ko.observable(rec.VATCode).extend({
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

    self.vatObj = ko.observable();

    //self.totalIncVATCurrencyParams = {
    //    label: 'Total Inc. VAT (Currency)',
    //    buttons: false,
    //    observable: self.totalIncVATCurrency,
    //    originalValue: self.totalIncVATCurrency(),
    //    useNativeValidation: false,
    //    decorateInputElement: false,
    //    insertValidationMessages: false,
    //    enable: ko.observable(true),
    //    disable: ko.observable(false),
    //    clearable: ko.observable(true),
    //    revertible: ko.observable(true),
    //    busy: ko.observable(false),
    //    inputType: 'text',
    //    minValue: null,
    //    maxValue: null,
    //    step: null,
    //    clearFunction: () => {
    //        self.totalIncVATCurrency(undefined);
    //    },
    //    revertFunction: () => {
    //        self.totalIncVATCurrency(self.totalIncVATCurrencyParams.originalValue);
    //    }
    //}

    self.vatParams = {
        label: 'VAT',
        buttons: false,
        observable: self.vat,
        originalValue: self.vat(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(true),
        busy: ko.observable(false),
        inputType: 'text',
        minValue: 0,
        maxValue: null,
        step: null,
        clearFunction: () => {
            self.vat(undefined);
        },
        revertFunction: () => {
            self.vat(self.vatParams.originalValue);
        }
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
            return `${e.Code} - ${e.Name}`;
        },
        valueTemplate: (e) => {
            return `${e.Code} - ${e.Name}`;
        },
        idObservable: self.vatCode,
        objObservable: self.vatObj,
        enable: ko.observable(true),
        disable: ko.observable(false),
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
        popupSettings: {
            appendTo: '#vat-entries'
        }
    });

    //#endregion


    //#region Lifted Bits



    //#endregion


    //#region Components



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