const invoiceBookingEmailAttachmentInvoiceViewModel = ({
    rec,
    parent
} = {

    }) => {
    let self = Object.assign({
        validateNow: parent.validateNow
    }, rec);

    //#region Properties

    self.busy = ko.observable(false);

    self.supplierCode = ko.observable(self.SupplierCode ?? '').extend({
        notEqual: {
            params: '',
            onlyIf: self.validateNow,
            message: 'Please specify a Supplier'
        }
    });

    self.supplier = ko.observable(self.Supplier);

    self.supplierCurrency = ko.computed(() => {
        return self.supplier() && self.supplier().Currency;
    }, self);

    self.supplierInvoiceReference = ko.observable(rec.SupplierInvoiceCode).extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'You must provide an Invoice Reference'
        },
        charsRemainingOptions: {
            maxLength: 100
        }
    });

    self.invoiceDate = ko.observable(rec.InvoiceDate).extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'You must provide an Invoice Date'
        }
    });

    self.paymentTermsCode = ko.observable(rec.PaymentTermsCode).extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'You must specify Payment Terms'
        }
    });

    self.paymentTerms = ko.observable();

    self.dispute = ko.observable(rec.Dispute);

    self.generalLedgerEntries = ko.observableArray(rec?.GeneralLedgerCodes?.map((gl, i) => invoiceBookingEmailInvoiceGLViewModel({
        rec: {
            Code: gl,
            AmountExVAT: rec?.GeneralLedgerAmountsExVAT[i]
        },
        parent: self
    })) ?? [invoiceBookingEmailInvoiceGLViewModel({
        rec: {},
        parent: self
    })]);

    self.vatEntries = ko.observableArray(rec?.VATCodes?.map((v, i) => invoiceBookingEmailInvoiceVATViewModel({
        rec: {
            VATCode: v,
            VAT: rec?.VATValues[i]
        },
        parent: self
    })) ?? [invoiceBookingEmailInvoiceVATViewModel({
        rec: {},
        parent: self
    })]);

    self.invoiceTotalIncVATCurrency = ko.observable(rec.InvoiceTotalInCurrencyIncVAT).extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'You must provide a total'
        },
        numberFormatted: {
            digits: 2,
            currency: self.supplierCurrency,
            minValue: 0
        },
        minValue: {
            params: 0,
            onlyIf: self.validateNow,
            message: 'Invoice Total must be zero or +ve'
        }
    });

    self.vatTotalCurrency = ko.observable(rec?.VATValues?.reduce((a, i) => a += i, 0)).extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'You must provide a VAT total'
        },
        numberFormatted: {
            digits: 2,
            currency: self.supplierCurrency,
            minValue: 0
        },
        minValue: {
            params: 0,
            onlyIf: self.validateNow,
            message: 'VAT Total must be zero or +ve'
        }
    });

    // This begins true because on load of untouched record the factors at play are both NaN / 0 / undefined.
    // This holds when you load a previously saved record: you can't save without these flags being true, so... yeah.
    self.generalLedgerSumEqualsTotalMinusVAT = ko.observable(true).extend({
        equal: {
            params: true,
            onlyIf: self.validateNow,
            message: 'Sum of General Ledger Breakdown must equal Invoice Total minus VAT Total'
        }
    });

    self.vatSumEqualsTotalVAT = ko.observable(true).extend({
        equal: {
            params: true,
            onlyIf: self.validateNow,
            message: 'Sum of VAT Breakdown must equal VAT Total'
        }
    });

    //#endregion


    //#region Lifted Bits



    //#endregion


    //#region Components

    self.supplierParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Supplier',
        odata: true,
        endPoint: '/odata/MertexLiveSuppliers?$expand=Currency,ExchangeRate,PaymentTerms',
        textField: 'Name',
        valueField: 'Code',
        template: (e) => {
            return `${e.Code} - ${e.Name}`;
        },
        idObservable: self.supplierCode,
        objObservable: self.supplier,
        originalValue: self.supplierCode(),
        virtual: true,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/MertexLiveSuppliers/Default.MertexLiveSupplierValueMapper(supplierCode='${options.value}')?$expand=Currency,ExchangeRate,PaymentTerms`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                            self.supplier(data.value[0]);
                            if (self.paymentTermsCode() == null) {
                                self.paymentTermsCode(data.value[0].PaymentTerms?.Code);
                            }
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        locked: ko.observable(self.readOnly == false && self.supplierCode() != ''),
        enable: ko.observable(true),
        disable: ko.observable(self.readOnly),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'Name'
        },
        select: function (e) {
            console.log('supplierParams select', e);
        },
        clearFunction: () => {
            self.supplierParams.dropDownListSettings.widget().value('');
            self.supplierParams.dropDownListSettings.widget().trigger('change');
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            return d;
        },
        popupSettings: {
            appendTo: document.querySelector('#email-modal .modal-body')
        }
    });

    self.invoiceTotalIncVATCurrencyParams = {
        label: 'Invoice Total (Inc. VAT) in Currency',
        buttons: false,
        observable: self.invoiceTotalIncVATCurrency,
        originalValue: self.invoiceTotalIncVATCurrency(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        enable: ko.observable(true),
        disable: ko.observable(self.readOnly),
        locked: ko.observable(self.readOnly),
        clearable: ko.observable(true),
        revertible: ko.observable(true),
        busy: ko.observable(false),
        inputType: 'text',
        minValue: 0,
        maxValue: null,
        step: null,
        clearFunction: () => {
            self.invoiceTotalIncVATCurrency(undefined);
        },
        revertFunction: () => {
            self.invoiceTotalIncVATCurrency(self.invoiceTotalIncVATCurrencyParams.originalValue);
        }
    }

    self.vatTotalCurrencyParams = {
        label: 'VAT Total in Currency',
        buttons: false,
        observable: self.vatTotalCurrency,
        originalValue: self.vatTotalCurrency(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        enable: ko.observable(true),
        disable: ko.observable(self.readOnly),
        locked: ko.observable(self.readOnly),
        clearable: ko.observable(true),
        revertible: ko.observable(true),
        busy: ko.observable(false),
        inputType: 'text',
        minValue: 0,
        maxValue: null,
        step: null,
        clearFunction: () => {
            self.vatTotalCurrency(undefined);
        },
        revertFunction: () => {
            self.vatTotalCurrency(self.vatTotalCurrencyParams.originalValue);
        }
    }

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
        disabled: ko.observable(self.readOnly),
        locked: ko.observable(self.readOnly),
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
        valueField: 'Code',
        virtual: false,
        idObservable: self.paymentTermsCode,
        objObservable: self.paymentTerms,
        enable: ko.observable(true),
        disable: ko.observable(self.readOnly),
        locked: ko.observable(self.readOnly),
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
        },
        popupSettings: {
            appendTo: '#invoice-terms'
        }
    });

    self.invoiceReferenceParams = {
        label: 'Supplier Invoice Reference',
        observable: self.supplierInvoiceReference,
        charsRemainingOptions: {
            maxLength: 100
        },
        busy: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        clearFunction: () => {
            self.supplierInvoiceReference(undefined);
        },
        revertible: ko.observable(false),
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true,
        disable: ko.observable(self.readOnly),
        locked: ko.observable(self.readOnly)
    };

    self.disputeParams = {
        checkboxId: 'dispute',
        label: 'Dispute',
        observable: self.dispute,
        useNativeValidation: false,
        enable: ko.observable(true),
        disable: ko.observable(self.readOnly),
        busy: ko.observable(false)
    }

    self.errorables = [
        self.supplierInvoiceReference,
        self.invoiceDate,
        self.paymentTermsId,
        self.generalLedgerEntries,
        self.vatEntries,
        self.invoiceTotalIncVATCurrency,
        self.vatTotalCurrency,
        self.generalLedgerSumEqualsTotalMinusVAT,
        self.vatSumEqualsTotalVAT
    ];

    //#endregion


    //#region Computeds

    self.generalLedgerBreakdownSum = ko.computed(() => {
        return self.generalLedgerEntries().reduce((a, i) => a += +(ko.unwrap(i.amountExVAT) ?? 0), 0);
    });

    self.generalLedgerSumComputer = ko.computed(() => {
        let breakdown = +self.generalLedgerBreakdownSum();
        let total = +self.invoiceTotalIncVATCurrency();
        let vat = +self.vatTotalCurrency();

        ko.ignoreDependencies(() => {
            if (breakdown == (total - vat)) {
                self.generalLedgerSumEqualsTotalMinusVAT(true);
            } else {
                self.generalLedgerSumEqualsTotalMinusVAT(false);
            }
        });
    });

    self.vatBreakdownSum = ko.computed(() => {
        return self.vatEntries().reduce((a, i) => a += +(ko.unwrap(i.vat) ?? 0), 0);
    });

    self.vatSumComputer = ko.computed(() => {
        let breakdown = +self.vatBreakdownSum();
        let total = +self.vatTotalCurrency();

        ko.ignoreDependencies(() => {
            if (breakdown == total) {
                self.vatSumEqualsTotalVAT(true);
            } else {
                self.vatSumEqualsTotalVAT(false);
            }
        });
    });

    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Methods

    self.addGeneralLedgerEntry = () => {
        self.generalLedgerEntries.push(invoiceBookingEmailInvoiceGLViewModel({
            rec: {},
            parent: self
        }));
    }

    self.addVATEntry = () => {
        self.vatEntries.push(invoiceBookingEmailInvoiceVATViewModel({
            rec: {},
            parent: self
        }));
    }

    self.removeGeneralLedgerEntry = (data) => {
        self.generalLedgerEntries.remove(data);
    }

    self.removeVATEntry = (data) => {
        self.vatEntries.remove(data);
    }

    //#endregion


    //#region Events



    //#endregion

    return self;
}