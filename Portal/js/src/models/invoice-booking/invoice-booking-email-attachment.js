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

    self.mostRecent = rec.SelectResult?.MostRecent;

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
            }
        } else {

            console.log(`determinePropertiesTemplate was skipped`);
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

        //self.errors.showAllMessages(false);

        //self.validateNow(false);

        //window.setTimeout(() => {

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
                            supplierCode: props.supplierCode(),
                            supplier: props.supplier(),
                            supplierCurrency: props.supplierCurrency(),
                            exchangeRate: props.exchangeRate(),
                            supplierInvoiceReference: props.supplierInvoiceReference(),
                            invoiceDate: props.invoiceDate(),
                            invoiceDueDT: props.dueDate(),
                            settlementDT: props.settlementDate(),
                            paymentTermsCode: props.paymentTermsCode(),
                            invoiceTotalIncVATInCurrency: props.invoiceTotalIncVATCurrency(),
                            invoiceTotalIncVATInSterling: props.invoiceTotalIncVATInSterling(),
                            invoiceTotalExVATInSterling: props.invoiceTotalExVatInSterling(),
                            vatTotalCurrency: props.vatTotalCurrency(),
                            vatTotalInSterling: props.vatTotalInSterling(),
                            netTotalCurrency: props.netTotalCurrency(),
                            netTotalInSterling: props.netTotalInSterling(),
                            dispute: props.dispute() ? true : false,
                            generalLedgerEntries: props.generalLedgerEntries().map(gl => {
                                return {
                                    generalLedgerCode: gl.generalLedgerCode(),
                                    amountExVATInCurrency: gl.amountExVATInCurrency(),
                                    amountExVATInSterling: gl.amountExVATInSterling()
                                }
                            }),
                            vatEntries: props.vatEntries().map(v => {
                                return {
                                    vatableAmountCurrency: v.vatableAmountCurrency(),
                                    vatableAmountSterling: v.vatableAmountSterling(),
                                    vatCode: v.vatCode(),
                                    vatRate: v.vatRate(),
                                    vatAmountCurrency: v.vatInCurrency(),
                                    vatAmountSterling: v.vatAmountSterling(),
                                    supplierCurrency: v.supplierCurrency(),
                                    exchangeRate: v.exchangeRate()
                                }
                            }),
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

                            //////
                            self.parentLoadEmail({
                                EmailMessageID: self.emailMessageId,
                                EmailID: self.emailId
                            }).then(() => {
                                viewModel.selectedEmail().selectAttachment({
                                    AttachmentID: self.AttachmentID
                                })
                            })
                        })
                        .catch(err => {
                            self.busy(false);
                            window.catchFetchError(err);
                        })
                }
            }, 0);
        //}, 0);
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