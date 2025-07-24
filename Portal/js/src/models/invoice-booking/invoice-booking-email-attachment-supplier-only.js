const invoiceBookingEmailAttachmentSupplierOnlyViewModel = ({
    rec,
    parent
} = {

    }) => {
    let self = Object.assign({
        validateNow: parent.validateNow,
        modalBusy: parent.modalBusy,
        modalBusyMessage: parent.modalBusyMessage,
        attachmentTypeId: parent.attachmentTypeId,
        attachmentId: parent.AttachmentID,
        save: parent.save,
        skipValidation: parent.skipValidation,
        reset: parent.reset,
        modal: parent.modal,
        formatDateString: parent.formatDateStringForHumans
    }, rec);

    console.log('invoiceBookingEmailAttachmentSupplierOnlyViewModel instantiated with', rec);

    //#region Properties

    self.today = new Date();

    self.busy = ko.observable(false);

    self.supplierCode = ko.observable(rec.supplierCode ?? '').extend({
        notEqual: {
            params: '',
            onlyIf: self.validateNow,
            message: 'Please specify a Supplier'
        }
    });

    self.supplier = ko.observable(rec.supplier);

    self.supplierCurrency = rec.supplierCurrency ? ko.observable(rec.supplierCurrency) : ko.computed(() => {
        if (self.loadedCurrency)
            return self.loadedCurrency;
        else
            return self.supplier() && self.supplier().Currency;
    }, self);

    // Necessary, leave it.
    self.duplicateResults = ko.observableArray([]);

    //#endregion


    //#region Lifted Bits



    //#endregion



    //#region Computeds


    //#endregion

    //#region Components

    self.supplierParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Supplier',
        odata: true,
        endPoint: '/odata/MertexLiveSuppliers?$expand=Currency,ExchangeRate,PaymentTerms,VATCode',
        textField: 'Name',
        valueField: 'Code',
        template: (e) => {
            return `${e.Code} - ${e.Name}`;
        },
        valueTemplate: (e) => {
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
                        url: `/odata/MertexLiveSuppliers/Default.MertexLiveSupplierValueMapper(supplierCode='${options.value}')?$expand=Currency,ExchangeRate,PaymentTerms,VATCode`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                            self.supplier(data.value[0]);
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        locked: ko.observable(self.supplierCode() != '' || self.readOnly()),
        enable: ko.computed(() => {
            return !self.readOnly()
        }, self),
        disable: ko.observable(self.supplierCode() != '' || self.readOnly()),
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
        changeBtnVisible: ko.computed(() => {
            return self.readOnly() == false && self.supplierCode() != '';
        }, self),
        select: function (e) {
            console.log('supplierParams select', e);
            self.supplierParams.locked(true);
        },
        clearFunction: () => {
            self.supplierParams.dropDownListSettings.widget().select(-1);
            self.supplierParams.dropDownListSettings.widget().trigger('change');
            self.supplierParams.locked(false);
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            let filters = [];

            if (data.filter && data.filter.filters.length) {
                let f = data.filter.filters.find(f => f.field === "Name");
                filters.push(`(contains(Name, '${f.value}') or contains(SortName, '${f.value}') or startswith(tolower(Code), '${f.value}') or startswith(tolower(Postcode), '${f.value}'))`);

                if (d.$filter) {
                    delete d.$filter;
                }
            }

            if (filters.length) {
                let filterString = filters.join(' and ');
                d.$apply = `filter(${filterString})`;
            }

            d.$count = true;

            return d;
        },
        popupSettings: {
            appendTo: document.querySelector('#email-modal .modal-body')
        }
    });

    self.supplierCode.subscribe(nv => {
        if (nv != '') {
            self.supplierParams.locked(true);
        } else {
            self.supplierParams.locked(false);
        }
    });


    self.errorables = [

    ];

    //#endregion


    //#region Subscriptions

    self.supplier.subscribe(nv => {
        if (nv) {
            self.supplierCurrency(nv.Currency);
        } else {
            self.supplierCurrency(undefined);
        }
    })

    //#endregion


    //#region Methods


    //#endregion


    //#region Events



    //#endregion

    return self;
}