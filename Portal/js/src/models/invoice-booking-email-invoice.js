const invoiceBookingEmailInvoiceViewModel = ({
    rec
} = {

    }) => {
    let self = Object.assign(rec, {

    });

    //#region Properties

    self.busy = ko.observable(false);

    self.supplierCode = ko.observable(rec.SupplierReference);
    self.supplier = ko.observable();

    self.invoiceDate = ko.observable();

    self.paymentTermsId = ko.observable(rec.PaymentTermsID);
    self.paymentTerms = ko.observable();

    self.totalIncVATCurrency = ko.observable(rec.TotalIncVATCurrency);

    self.vat = ko.observable(rec.VAT);

    self.dispute = ko.observable(rec.Dispute);

    //#endregion


    //#region Lifted Bits



    //#endregion


    //#region Components

    self.supplierParams = kendoMDCDropDownList({
        autoBind: true,
        label: 'Supplier',
        odata: true,
        endPoint: '/odata/Suppliers',
        textField: 'Name',
        valueField: 'SupplierCode',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value && options.value != '') {
                    $.ajax({
                        url: `/odata/Suppliers/Default.SupplierValueMapper(supplierCode="${options.value}")`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                            if (data.value.length == 1) {
                                self.supplier(data.value[0]);
                            }
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        idObservable: self.supplierCode,
        objObservable: self.supplier,
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

                d.$filter = `StartsWith(ToLower(Name), '${filterValue}') OR StartsWith(ToLower(SupplierCode), '${filterValue}')`;
            }

            return d;
        }
    });

    self.invoiceDateParams = {
        label: "Invoice Date",
        observable: self.invoiceDate,
        originalValue: self.invoiceDate(),
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
            debug: false,
            eventHandlers: {
                onChange: (e) => {

                }
            },
            viewDate: self.invoiceDate() ? new Date(self.invoiceDate()) : new Date()
        },
        clearable: ko.observable(false),
        clearFunction: () => {
            self.invoiceDate(undefined);
        },
        revertible: ko.observable(true),
        revertFunction: () => {
            self.invoiceDateParams.observable(self.invoiceDateParams.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true
    };

    self.paymentTermsParams = kendoMDCDropDownList({
        autoBind: true,
        label: 'Payment Terms',
        odata: true,
        endPoint: '/odata/PaymentTerms',
        textField: 'Name',
        valueField: 'PaymentTermsID',
        virtual: false,
        idObservable: self.paymentTermsId,
        objObservable: self.paymentTerms,
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

                d.$filter = `StartsWith(ToLower(Name), '${filterValue}') OR StartsWith(ToLower(Code), '${filterValue}')`;
            }

            return d;
        }
    });

    self.totalIncVATCurrencyParams = {
        label: 'Total Inc. VAT (Currency)',
        buttons: false,
        observable: self.totalIncVATCurrency,
        originalValue: self.totalIncVATCurrency(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(true),
        busy: ko.observable(false),
        inputType: 'text',
        minValue: null,
        maxValue: null,
        step: null,
        clearFunction: () => {
            self.totalIncVATCurrency(undefined);
        },
        revertFunction: () => {
            self.totalIncVATCurrency(self.totalIncVATCurrencyParams.originalValue);
        }
    }

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
        minValue: null,
        maxValue: null,
        step: null,
        clearFunction: () => {
            self.totalIncVATCurrency(undefined);
        },
        revertFunction: () => {
            self.totalIncVATCurrency(self.vatParams.originalValue);
        }
    }

    self.disputeParams = {
        checkboxId: 'dispute',
        label: 'Dispute',
        observable: self.dispute,
        useNativeValidation: false,
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false)
    }

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