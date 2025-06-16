const invoiceBookingEmailInvoiceGLViewModel = ({
    rec,
    parent
} = {

    }) => {
    let self = Object.assign(rec, {
        validateNow: parent.validateNow,
        readOnly: parent.readOnly
    });

    //#region Properties

    self.generalLedgerCode = ko.observable(rec.Code ?? '').extend({
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

    self.amountExVAT = ko.observable(rec.AmountExVAT).extend({
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
        odata: true,
        endPoint: '/odata/GeneralLedgerCodes?$expand=Type',
        textField: 'AnalysisCodeDescription',
        valueField: 'Code',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value && options.value != '') {
                    $.ajax({
                        url: `/odata/GeneralLedgerCodes/Default.GeneralLedgerCodeValueMapper(code='${options.value}')?$expand=Type`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                            if (data.value.length == 1) {
                                self.generalLedger(data.value[0]);
                            }
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        //schema: $.extend({}, kendo.data.schemas['odata-v4']),
        //groupTemplate: (data) => `Group: ${encode(data)}`,
        template: (e) => {
            return `${e.Code} - ${e.AnalysisCodeDescription}`
        },
        valueTemplate: (e) => {
            if (e.Code != null && e.Code != '' && e.AnalysisCodeDescription != null && e.AnalysisCodeDescription != '') {
                return `${e.Code} - ${e.AnalysisCodeDescription}`;
            } else {
                return '';
            }
        },
        //grouping: [{
        //    field: 'Type.Code',
        //    dir: 'asc'
        //}],
        //sort: [{
        //    field: 'Type.SortOrder',
        //    dir: 'desc'
        //}],
        idObservable: self.generalLedgerCode,
        objObservable: self.generalLedger,
        enable: ko.observable(true),
        disable: ko.observable(self.readOnly),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        height: 340,
        parameterMap: (data) => {
            //Generate parame.Code && e.Nameeters in odata v4 format
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

                d.$filter = `Contains(ToLower(AnalysisCodeDescription), '${filterValue}') OR StartsWith(ToLower(Code), '${filterValue}')`;
            }

            return d;
        },
        popupSettings: {
            appendTo: '#email-modal .modal-body'
        }
    });

    self.amountExVATParams = {
        label: 'Amount ex. VAT in Sterling',
        buttons: false,
        observable: self.amountExVAT,
        originalValue: self.amountExVAT(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        enable: ko.observable(true),
        disable: ko.observable(self.readOnly),
        clearable: ko.observable(true),
        revertible: ko.observable(true),
        busy: ko.observable(false),
        inputType: 'text',
        minValue: 0,
        maxValue: null,
        step: null,
        clearFunction: () => {
            self.amountExVAT(undefined);
        },
        revertFunction: () => {
            self.amountExVAT(self.amountExVATParams.originalValue);
        }
    }

    self.errors = new ko.validation.group([
        self.generalLedgerCode,
        self.amountExVAT
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