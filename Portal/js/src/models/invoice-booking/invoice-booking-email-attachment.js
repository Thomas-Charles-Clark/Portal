const invoiceBookingEmailAttachmentViewModel = ({
    rec,
    parent
} = {

    }) => {
    let self = Object.assign({
        parentEmailSupplier: parent.supplier,
        parentLoadEmail: async () => parent.parent.loadEmail,
        emailId: parent.EmailID,
        emailMessageId: parent.EmailMessageID,
        modal: parent.parent.modal,
        modalBusy: parent.modalBusy,
        modalBusyMessage: parent.modalBusyMessage,
        reset: parent.reset
    }, rec);

    //let toLoad = rec.SelectResult?.MostRecent ?? rec.SelectResult?.Original;
    let toLoad = rec.SelectResult?.Original;

    self.original = rec.SelectResult?.Original;

    self.mertexData = rec.SelectResult?.MostRecent;

    if (toLoad) {
        self.toLoad = Object.assign(toLoad, {
            readOnly: true
        });
        self.readOnly = true;
    } else {
        self.toLoad = {
            SupplierCode: self.SupplierCode,
            readOnly: false
        };
        self.readOnly = false;
    }

    //#region Properties

    self.busy = ko.observable(false);

    self.validateNow = ko.observable(false);

    self.skipValidation = ko.observable(false);

    self.attachmentTypeId = ko.observable(`${self.AttachmentTypeID}`).extend({
        notEqual: {
            params: '0',
            onlyIf: self.validateNow,
            message: 'Please specify an Attachment Type'
        }
    });

    self.attachmentType = ko.observable(rec.AttachmentType);

    self.properties = ko.observable();
    self.propertiesTemplateName = ko.observable();

    self.isEmailBody = Object.hasOwn(self, 'Body');

    self.dispute = ko.observable(rec.Dispute ?? false);

    self.prettyPrintedResponse = ko.observable();

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
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        idObservable: self.attachmentTypeId,
        objObservable: self.attachmentType,
        originalValue: self.attachmentTypeId(),
        enable: ko.observable(true),
        disable: ko.observable(self.toLoad.readOnly),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        locked: ko.observable(self.toLoad.readOnly),
        readOnly: false,
        filter: false,
        autoBind: true,
        sort: {
            field: 'SortOrder',
            dir: 'asc'
        },
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

    self.disputeParams = {
        checkboxId: 'dispute',
        label: 'Dispute',
        observable: self.dispute,
        useNativeValidation: false,
        enable: ko.observable(true),
        disable: ko.observable(self.toLoad.readOnly),
        busy: ko.observable(false),
        originalValue: self.dispute()
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
            case 'ppt':
                result = `https://view.officeapps.live.com/op/embed.aspx?src=https://portal.designersguild.com${result}`;
                break;
            case 'txt':
            case 'csv':
                fetch(`${result}`, {
                    method: 'GET',
                    headers: window.fetchHeaders,
                    cache: 'no-cache'
                }).then(response => response.text())
                    .then(csvText => {
                        self.prettyPrintedResponse(PR.prettyPrintOne(csvText, self.FileExtension.toLowerCase(), true));
                    })
                    .catch(window.catchFetchError)
                break;
            default:
                break;
        }
        console.log(result);
        return result;
    }, self);

    self.errors = ko.validation.group([
        self.attachmentTypeId,
        self.properties
    ], {
        deep: true,
        live: true
    });

    //#endregion


    //#region Subscriptions

    self.attachmentTypeId.subscribe(nv => {
        self.determinePropertiesTemplate(true);
    });

    //#endregion


    //#region Methods

    self.determinePropertiesTemplate = (force) => {

        console.log(`determinePropertiesTemplate called, force was: ${force}`);

        if (self.properties() == null || force) {
            let properties = null;
            let propertiesViewModelFn = null;
            let propertiesTemplateName = null;

            switch (+self.attachmentTypeId()) {
                /* 
        
                AttachmentTypeID	Name	        ProcessingRequired
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
                    propertiesViewModelFn = invoiceBookingEmailAttachmentProformaViewModel;
                    propertiesTemplateName = 'invoice-booking-proforma-template';
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
                    ...ko.unwrap(self.properties).errorables
                ], {
                    deep: true,
                    live: true
                });

                window.setTimeout(() => {
                    if (properties.supplierCode && properties.supplierCode() == '' && self.parentEmailSupplier()) {
                        properties.supplierCode(self.parentEmailSupplier().Code);
                        if (!properties.supplierParams.dropDownListSettings.widget()) {
                            let s = properties.supplierParams.dropDownListSettings.widget.subscribe(nv => {
                                nv.trigger('change');
                                s.dispose();
                            })
                        } else {
                            properties.supplierParams.dropDownListSettings.widget().trigger('change');
                        }
                    }
                }, 0);
            } else {
                self.errors = ko.validation.group([]);
            }
        } else {

            console.log(`determinePropertiesTemplate was skipped`);
        }
    }

    self.unsavedChanges = () => {
        return new Promise((resolve, reject) => {

            if (self.isEmailBody) {
                resolve();
            }

            let unsaved = self.AttachmentTypeID.toString() != self.attachmentTypeId();

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

    self.save = (afterSave) => {

        let skipValidation = self.skipValidation();

        if (skipValidation == false) {

            self.validateNow(true);

            window.setTimeout(() => {

                if (self.errors().length) {

                    self.errors.showAllMessages(true);

                    self.errors.filter(x => {
                        x.isValid.notifySubscribers(x.isValid());
                    });

                } else {
                    self.actuallySave(afterSave);
                }
            }, 0);
        } else {
            self.actuallySave(afterSave);
        }
    }

    self.actuallySave = (afterSave) => {

        self.busy(true);

        let props = ko.unwrap(self.properties);

        let data = {
            attachmentId: self.AttachmentID,
            attachmentTypeId: self.attachmentTypeId()
        }

        if (props) {

            switch (self.attachmentTypeId()) {
                case 2:

                    data.formDataJson = JSON.stringify({
                        code: null,
                        invoiceProcessedDate: null,
                        invoiceReceivedDate: null,
                        passedTo: null,
                        passedToDT: null,
                        supplierCode: props.supplierCode() ?? null,
                        supplier: props.supplier() ?? null,
                        supplierCurrency: props.supplierCurrency() ?? null,
                        exchangeRate: props.exchangeRate() ?? null,
                        supplierInvoiceReference: props.supplierInvoiceReference() ?? null,
                        invoiceDate: props.invoiceDate() ?? null,
                        invoiceDueDT: props.dueDate() ?? null,
                        settlementDT: props.settlementDate() ?? null,
                        paymentTermsCode: props.paymentTermsCode() ?? null,
                        invoiceTotalIncVATInCurrency: props.invoiceTotalIncVATCurrency() ?? null,
                        invoiceTotalIncVATInSterling: Math.round((props.invoiceTotalIncVATInSterling() ?? 0) * 10000) / 10000,
                        invoiceTotalExVATInSterling: Math.round((props.invoiceTotalExVatInSterling() ?? 0) * 10000) / 10000,
                        vatTotalCurrency: props.vatTotalCurrency() ?? null,
                        vatTotalInSterling: Math.round((props.vatTotalInSterling() ?? 0) * 10000) / 10000,
                        netTotalCurrency: props.netTotalCurrency() ?? null,
                        netTotalInSterling: Math.round((props.netTotalInSterling() ?? 0) * 10000) / 10000,
                        dispute: props.dispute() ? true : false,
                        generalLedgerEntries: props.generalLedgerEntries().map(gl => {
                            return {
                                generalLedgerCode: gl.generalLedgerCode(),
                                amountExVATInCurrency: Math.round((gl.amountExVATInCurrency() ?? 0) * 10000) / 10000,
                                amountExVATInSterling: Math.round((gl.amountExVATInSterling() ?? 0) * 10000) / 10000
                            }
                        }),
                        vatEntries: props.vatEntries().map(v => {
                            return {
                                vatableAmountCurrency: Math.round((v.vatableAmountCurrency() ?? 0) * 10000) / 10000,
                                vatableAmountSterling: Math.round((v.vatableAmountToSterlingComputer() ?? 0) * 10000) / 10000,
                                vatCode: v.vatCode(),
                                vatRate: Math.round((v.vatRate() ?? 0) * 10000) / 10000,
                                vatAmountCurrency: Math.round((v.vatInCurrency() ?? 0) * 10000) / 10000,
                                vatAmountSterling: Math.round((v.vatToSterlingComputer() ?? 0) * 10000) / 10000,
                                supplierCurrency: v.supplierCurrency(),
                                exchangeRate: Math.round((v.exchangeRate() ?? 0) * 10000) / 10000
                            }
                        }),
                        duplicateResults: props.duplicateResults(),
                        isFlaggedAsDuplicate: props.isFlaggedAsDuplicate()
                    });
                    break;
                case 3:
                    data.formDataJson = JSON.stringify({
                        code: null,
                        invoiceProcessedDate: null,
                        invoiceReceivedDate: null,
                        passedTo: null,
                        passedToDT: null,
                        supplierCode: props.supplierCode() ?? null,
                        supplier: props.supplier() ?? null,
                        supplierCurrency: props.supplierCurrency() ?? null,
                        exchangeRate: props.exchangeRate() ?? null,
                        supplierInvoiceReference: props.supplierInvoiceReference() ?? null,
                        invoiceDate: props.invoiceDate() ?? null,
                        invoiceDueDT: props.dueDate() ?? null,
                        settlementDT: props.settlementDate() ?? null,
                        paymentTermsCode: props.paymentTermsCode() ?? null,
                        invoiceTotalIncVATInCurrency: props.invoiceTotalIncVATCurrency() ?? null,
                        invoiceTotalIncVATInSterling: Math.round((props.invoiceTotalIncVATInSterling() ?? 0) * 10000) / 10000,
                        invoiceTotalExVATInSterling: Math.round((props.invoiceTotalExVatInSterling() ?? 0) * 10000) / 10000,
                        vatTotalCurrency: props.vatTotalCurrency() ?? null,
                        vatTotalInSterling: Math.round((props.vatTotalInSterling() ?? 0) * 10000) / 10000,
                        netTotalCurrency: props.netTotalCurrency() ?? null,
                        netTotalInSterling: Math.round((props.netTotalInSterling() ?? 0) * 10000) / 10000,
                        dispute: props.dispute() ? true : false,
                        duplicateResults: props.duplicateResults(),
                        isFlaggedAsDuplicate: props.isFlaggedAsDuplicate()
                    });
                    break;
                default: break;
            }
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

                // this dirty little trick to get around the call to unsavedChanges on the upcoming call to selectAttachment...
                self.AttachmentTypeID = self.attachmentTypeId();

                //////
                self.parentLoadEmail({
                    EmailMessageID: self.emailMessageId,
                    EmailID: self.emailId
                }).then(() => {
                    viewModel.selectedEmail().selectAttachment({
                        AttachmentID: self.AttachmentID
                    })
                })

                if (typeof afterSave === 'function') {
                    afterSave();
                }
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
    }

    //self.switchDataSet = (mostRecent) => {
    //    if (mostRecent) {
    //        self.toLoad = Object.assign({
    //            readOnly: true
    //        }, self.mostRecent);
    //    } else {
    //        self.toLoad = Object.assign({
    //            readOnly: true
    //        }, self.original);
    //    }
    //    self.determinePropertiesTemplate();
    //}

    //#endregion


    //#region Events

    //self.determinePropertiesTemplate();
        
    //#endregion

    return self;
}