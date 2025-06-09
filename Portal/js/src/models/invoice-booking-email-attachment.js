const invoiceBookingEmailAttachmentViewModel = ({
    rec,
    parent
} = {

    }) => {
    let self = Object.assign(rec, {
        propagateSupplier: parent.propagateSupplier
    });

    let toLoad = rec.SelectResult?.MostRecent ?? rec.SelectResult?.Original;

    if (toLoad) {
        self.toLoad = toLoad;
    } else {
        self.toLoad = {};
    }

    //#region Properties

    self.busy = ko.observable(false);

    self.validateNow = ko.observable(false);

    self.attachmentTypeId = ko.observable(`${self.AttachmentTypeID}`).extend({
        notEqual: {
            params: '0',
            onlyIf: self.validateNow,
            message: 'Please specify an Attachment Type'
        }
    });

    self.attachmentType = ko.observable(self.AttachmentType);

    self.properties = ko.observable();
    self.propertiesTemplateName = ko.observable();

    self.isEmailBody = Object.hasOwn(self, 'Body');

    self.supplierCode = ko.observable(self.SupplierCode ?? '').extend({
        notEqual: {
            params: '',
            onlyIf: self.validateNow,
            message: 'Please specify a Supplier'
        }
    });

    self.supplier = ko.observable(self.Supplier);

    //#region Lifted Bits

    self.supplierCurrency = ko.computed(() => {
        if (self.supplier()) {
            return self.supplier().Currency;
        }
    }, self);

    //#endregion

    self.dispute = ko.observable(rec.Dispute ?? false);

    //#endregion

    //#region Components

    self.attachmentTypeParams = kendoMDCDropDownList({
        autoBind: true,
        label: 'Attachment Type',
        odata: true,
        endPoint: '/odata/AttachmentTypes',
        textField: 'Name',
        valueField: 'AttachmentTypeID',
        virtual: false,
        textField: 'Name',
        valueField: 'AttachmentTypeID',
        virtual: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        idObservable: self.attachmentTypeId,
        objObservable: self.attachmentType,
        originalValue: self.attachmentTypeId(),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: false,
        autoBind: true,
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            return d;
        }
    })

    self.supplierParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Supplier',
        odata: true,
        endPoint: '/odata/MertexLiveSuppliers?$expand=Currency,ExchangeRate',
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
                        url: `/odata/MertexLiveSuppliers/Default.MertexLiveSupplierValueMapper(supplierCode='${options.value}')`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        locked: ko.observable(self.supplierCode() != ''),
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
            field: 'Name'
        },
        select: function (e) {
            console.log('supplierParams select', e);
            self.propagateSupplier(e.dataItem);
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

    self.disputeParams = {
        checkboxId: 'dispute',
        label: 'Dispute',
        observable: self.dispute,
        useNativeValidation: false,
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false),
        originalValue: self.dispute(),
    }

    //#endregion


    //#region Computeds

    self.src = ko.computed(() => {
        let result = `/incomingemail/attachments/${self.IsInline ? 'inline' : 'regular'}/null/${self.EmailAttachmentID}`;
        switch (self.FileExtension.toLowerCase()) {
            case 'docx':
            case 'doc':
            case 'xlsx':
            case 'xls':
            case 'csv':
            case 'ppt':
            case 'txt':
                result = `https://view.officeapps.live.com/op/embed.aspx?src=https://portal.designersguild.com${result}`;
                break;
            default:
                break;
        }
        console.log(result);
        return result;
    }, self);

    self.errors = ko.validation.group([
        self.attachmentTypeId,
        self.properties,
        self.supplierCode
    ], {
        deep: true,
        live: true
    });

    //#endregion


    //#region Subscriptions

    self.attachmentTypeId.subscribe(nv => {
        self.devisePropertiesTemplate()
    });

    self.supplier.subscribe(nv => {

        if (!self.isPropagatingSupplier) {

            let data = {
                emailId: self.EmailID,
                supplierCode: nv.Code
            };

            console.log('saveSupplierDetail calling with', data);

            fetch('/api/InvoiceBookingAPI/SaveSupplierDetail', {
                method: 'POST',
                headers: window.fetchHeaders,
                body: JSON.stringify(data)
            })
                .then(window.handleFetchResponse)
                .then(data => console.log('saveSupplierDetail returned', data))
                .catch(window.catchFetchError);

        } else {
            self.isPropagatingSupplier = false;
        }

    })

    //self.supplierCode.subscribe(nv => {
    //    if (nv != '') {
    //        self.supplierParams.locked(true);
    //    }
    //})

    //#endregion


    //#region Methods

    self.devisePropertiesTemplate = () => {

        let properties = null;
        let propertiesViewModelFn = null;
        let propertiesTemplateName = null;

        switch (+self.attachmentTypeId()) {
            /* 
    
            AttachmentTypeID	Name	        ParsingRequired
                        1	    Unknown	        0
                        2	    Invoice	        1
                        3	    Credit Note	    1
                        4	    Statement	    0
                        5	    Packing List	0
                        6	    Delivery Note	0
                        999	    Junk	        0
    
            */

            case 1:
                break;
            case 2:
                propertiesViewModelFn = invoiceBookingEmailAttachmentInvoiceViewModel;
                propertiesTemplateName = 'invoice-booking-invoice-template';
                break;
            case 3:
                propertiesViewModelFn = invoiceBookingEmailCreditNoteViewModel;
                propertiesTemplateName = 'invoice-booking-credit-note-template';
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
            case 999:
                break;
            default:
                break;
        }

        if (typeof propertiesViewModelFn == 'function') {
            properties = propertiesViewModelFn({
                rec: self.toLoad,
                parent: self
            });
        }

        self.properties(properties);

        self.propertiesTemplateName(propertiesTemplateName);

        if (properties != null) {
            self.errors = ko.validation.group([
                self.attachmentTypeId,
                self.supplierCode,
                ...ko.unwrap(self.properties).errorables
            ], {
                deep: true,
                live: true
            });
        }
    }

    self.unsavedChanges = () => {
        return new Promise((resolve, reject) => {

            //let array = self.determineUnsavedChanges();

            //Object.keys(self).forEach(k => {
            //    let prop = self[k];
            //    if (Object.hasOwn('originalValue', prop)) {
            //        let originalValue = ko.unwrap(self[k].originalValue);
            //        let currentValue = ko.unwrap(self[j].value);
            //        if (originalValue !== currentValue) {
            //            array.push(k);
            //        }
            //    }
            //});

            let unsaved = false;// array.length;

            if (unsaved) {
                window.showConfirm('Unsaved changes', 'You have unsaved changes. If you proceed your changes will be lost. Proceed?', () => {
                    resolve();
                }, () => {
                    reject();
                });
            } else {
                resolve();
            }
        });
    }

    self.save = () => {

        self.errors.showAllMessages(false);

        self.validateNow(false);

        window.setTimeout(() => {

            self.validateNow(true);

            window.setTimeout(() => {

                if (self.errors().length) {
                    self.errors.showAllMessages(true);

                    self.errors.filter(x => {
                        x.isValid.notifySubscribers(x.isValid());
                    });
                } else {

                    self.busy(true);

                    let props = ko.unwrap(self.properties);

                    let data = {
                        attachmentId: self.AttachmentID,
                        attachmentTypeId: self.attachmentTypeId(),
                        formDataJson: JSON.stringify({
                            InvoiceDate: props.invoiceDate(),
                            SupplierCode: self.supplierCode(),
                            SupplierInvoiceCode: props.supplierInvoiceReference(),
                            PaymentTermsCode: props.paymentTermsCode(),
                            InvoiceTotalInCurrencyIncVAT: props.invoiceTotalIncVATCurrency(),
                            ExchangeRate: self.supplier().ExchangeRate?.SterlingExchangeRate,
                            GeneralLedgerCodes: props.generalLedgerEntries().map(gl => gl.generalLedgerCode()),
                            GeneralLedgerAmountsExVAT: props.generalLedgerEntries().map(gl => gl.amountExVAT()),
                            VATCodes: props.vatEntries().map(v => v.vatCode()),
                            VATValues: props.vatEntries().map(v => v.vat()),
                            Dispute: props.dispute()
                        })
                    }

                    fetch('/api/InvoiceBookingAPI/SaveAttachmentDetail', {
                        method: 'POST',
                        headers: window.fetchHeaders,
                        body: JSON.stringify(data)
                    })
                        .then(window.handleFetchResponse)
                        .then(data => {
                            console.log('SaveAttachment returned', data);
                            self.busy(false);
                            window.showInfo('Success', 'Attachment detail saved successfully');
                        })
                        .catch(err => {
                            self.busy(false);
                            window.catchFetchError(err);
                        })
                }
            }, 0);
        }, 0);
    }

    //#endregion


    //#region Events

    self.attributePropertiesResizeStart = (event, ui) => {
        document.querySelector('#attachment-iframe-wrapper').classList.add('blocked');
    }

    self.attributePropertiesResizeStop = (event, ui) => {
        document.querySelector('#attachment-iframe-wrapper').classList.remove('blocked');
    }

    self.devisePropertiesTemplate();
        
    //#endregion

    return self;
}