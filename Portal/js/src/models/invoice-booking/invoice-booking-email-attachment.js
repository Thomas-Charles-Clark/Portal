const invoiceBookingEmailAttachmentViewModel = ({
    rec,
    parent
} = {

    }) => {
    let self = Object.assign({
        parentEmailSupplier: parent.supplier,
        parentLoadEmail: async () => parent.parent.loadEmail,
        documentGridSelectedKeys: parent.documentGridSelectedKeys,
        emailId: parent.EmailID,
        emailMessageId: parent.EmailMessageID,
        modal: parent.parent.modal,
        modalBusy: parent.modalBusy,
        modalBusyMessage: parent.modalBusyMessage,
        reset: parent.reset,
        reloadAttachment: parent.reallySelectAttachment
    }, rec);

    //let toLoad = rec.SelectResult?.MostRecent ?? rec.SelectResult?.Original;
    let toLoad = rec.SelectResult?.Original;

    self.original = rec.SelectResult?.Original;

    self.mertexData = rec.SelectResult?.MostRecent;

    if (toLoad) {
        self.readOnly = ko.observable(true);
        self.toLoad = Object.assign(toLoad, {
            readOnly: self.readOnly
        });
    } else {
        self.readOnly = ko.observable(false);
        self.toLoad = {
            supplierCode: self.SupplierCode,
            readOnly: self.readOnly
        };
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

    self.selectedForDownload = ko.observable(true);

    self.selectedFromGrid = ko.observable(false);

    self.validateForwardToBudgetHolderNow = ko.observable(false);

    self.forwardToBudgetHolderCode = ko.observable('').extend({
        notEqual: {
            params: '',
            onlyIf: self.validateForwardToBudgetHolderNow,
            message: 'You must select a Budget Holder to forward to'
        },
        required: {
            params: true,
            onlyIf: self.validateForwardToBudgetHolderNow,
            message: 'You must select a Budget Holder to forward to'
        }
    })

    self.forwardToBudgetHolder = ko.observable();

    self.forwardAttachmentModalElement = document.querySelector('#forward-attachment-modal');

    self.forwardAttachmentModal = bootstrap.Modal.getOrCreateInstance(self.forwardAttachmentModalElement);

    self.forwardAttachmentModalBusy = ko.observable(false);

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
        enable: ko.computed(() => {
            return !self.toLoad.readOnly()
        }, self),
        disable: self.readOnly,
        disable: self.toLoad.readOnly,
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        locked: self.toLoad.readOnly,
        readOnly: self.toLoad.readOnly, //????
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
        },
        height: 'auto'
    })

    self.disputeParams = {
        checkboxId: 'dispute',
        label: 'Dispute',
        observable: self.dispute,
        useNativeValidation: false,
        enable: ko.computed(() => {
            return !self.toLoad.readOnly()
        }, self),
        disable: self.toLoad.readOnly,
        busy: ko.observable(false),
        originalValue: self.dispute()
    }

    self.budgetHolderGroupBy = `groupby((BudgetHolder/Code,BudgetHolder/Name))/filter((BudgetHolder/Code ne null))`;

    self.budgetHolderTemplate = (e) => {
        if (e.BudgetHolder && e.BudgetHolder.Code && e.BudgetHolder.Name) {
            return `<span title="${e.BudgetHolder.Name} (${e.BudgetHolder.Code})">${e.BudgetHolder.Name}</span>`;
        } else {
            return '';
        }
    }

    self.budgetHolderValueTemplate = (e) => {
        if (e.BudgetHolder && e.BudgetHolder.Code && e.BudgetHolder.Name) {
            return `<span title="${e.BudgetHolder.Name} (${e.BudgetHolder.Code})">${e.BudgetHolder.Name}</span>`;
        } else {
            return '';
        }
    }

    self.forwardToBudgetHolderParams = kendoMDCDropDownList({
        skipCascade: false,
        label: 'Budget Holder',
        odata: true,
        endPoint: '/odata/BudgetHolderSuperSet',
        textField: 'BudgetHolder.Name',
        valueField: 'BudgetHolder.Code',
        virtual: false,
        template: self.budgetHolderTemplate,
        valueTemplate: self.budgetHolderValueTemplate,
        idObservable: self.forwardToBudgetHolderCode,
        objObservable: self.forwardToBudgetHolder,
        locked: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        autoWidth: true,
        sort: {
            dir: 'asc',
            field: 'BudgetHolder.Name'
        },
        select: function (e) {

        },
        open: (e) => {

        },
        clearFunction: () => {
            self.forwardToBudgetHolderCode('');
            self.forwardToBudgetHolder(undefined);
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            d.$apply = self.budgetHolderGroupBy;

            return d;
        },
        popupSettings: {
            appendTo: document.querySelector('#forward-attachment-modal .modal-content')
        }
    });

    self.forwardToBudgetHolderErrorables = ko.validation.group([
        self.forwardToBudgetHolderCode
    ])

    //#endregion


    //#region Computeds

    self.actualSrc = ko.observable();

    self.canPreviewAttachment = ko.observable(false);

    self.src = ko.computed(() => {
        let result = `/incomingemail/attachments/${self.IsInline ? 'inline' : 'regular'}/null/${self.EmailAttachmentID}`;
        switch (self.FileExtension.toLowerCase()) {
            case 'pdf':
            case 'html':
                ko.ignoreDependencies(() => {
                    self.canPreviewAttachment(true);
                    self.actualSrc(result);
                });
                break;
            case 'docx':
            case 'doc':
            case 'xlsx':
            case 'xls':
            case 'ppt':
                result = `https://view.officeapps.live.com/op/embed.aspx?src=https://portal.designersguild.com${result}`;
                ko.ignoreDependencies(() => {
                    self.canPreviewAttachment(true);
                    self.actualSrc(result);
                });
                break;
            case 'txt':
            case 'csv':
                fetch(`${result}`, {
                    method: 'GET',
                    headers: window.fetchHeaders,
                    cache: 'no-cache'
                }).then(response => response.text())
                    .then(csvText => {
                        self.canPreviewAttachment(true);
                        self.prettyPrintedResponse(PR.prettyPrintOne(csvText, self.FileExtension.toLowerCase(), true));
                    })
                    .catch(window.catchFetchError)
                break;
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'bmp':
            case 'webp':
                ko.ignoreDependencies(() => {
                    self.canPreviewAttachment(true);
                    self.actualSrc(result);
                });
                break;
            case 'tif':
            case 'tiff':
                ko.ignoreDependencies(() => {
                    self.canPreviewAttachment(true);
                });
                fetch(`${result}`, {
                    method: 'GET',
                    headers: window.fetchHeaders,
                    cache: 'no-cache'
                }).then(response => response.arrayBuffer())
                    .then(buffer => {
                        let t = new Tiff({ buffer });
                        let canvas = t.toCanvas();
                        canvas.classList.add('tif-canvas');
                        document.querySelector('#tif-canvas-container').innerHTML = '';
                        document.querySelector('#tif-canvas-container').appendChild(canvas);
                    })
                    .catch(window.catchFetchError)
                break;
            default:
                self.canPreviewAttachment(false);
                break;
        }
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

    self.selectedFromGrid.subscribe(nv => {
        if (nv) {
            if (!self.documentGridSelectedKeys().find(f => f == self.AttachmentID)) {
                self.documentGridSelectedKeys.push(self.AttachmentID);
            }
        } else {
            self.documentGridSelectedKeys.remove(self.AttachmentID);
        }
    });

    //#endregion


    //#region Methods

    self.determinePropertiesTemplate = (force) => {

        if (self.canPreviewAttachment() == false) {
            window.showConfirm(`${self.FileName}.${self.FileExtension}`,
                `This file type can't be previewed in your browser. Would you like to download it to your computer to attempt to open it there?`, () => {

                    let result = `/incomingemail/attachments/${self.IsInline ? 'inline' : 'regular'}/null/${self.EmailAttachmentID}`

                    ko.ignoreDependencies(() => {
                        self.actualSrc(result);
                    });

                }, () => {

                });
        }

        console.log(`determinePropertiesTemplate called, force was: ${force}`);

        self.validateNow(false);

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

                //case 1:
                //    break;
                case 2:
                    propertiesViewModelFn = invoiceBookingEmailAttachmentInvoiceViewModel;
                    propertiesTemplateName = 'invoice-booking-invoice-template';
                    break;
                case 3:
                    propertiesViewModelFn = invoiceBookingEmailAttachmentProformaViewModel;
                    propertiesTemplateName = 'invoice-booking-proforma-template';
                    break;
                case 4:
                    propertiesViewModelFn = invoiceBookingEmailAttachmentCreditNoteViewModel;
                    propertiesTemplateName = 'invoice-booking-credit-note-template';
                    break;
                //case 5:
                //    break;
                //case 6:
                //    break;
                //case 999:
                //    break;
                default:
                    propertiesViewModelFn = invoiceBookingEmailAttachmentSupplierOnlyViewModel;
                    propertiesTemplateName = 'supplier-only-template';
                    break;
            }

            if (self.parentEmailSupplier()) {
                self.toLoad.supplierCode = self.parentEmailSupplier().Code;
                self.toLoad.supplier = self.parentEmailSupplier();
                self.toLoad.supplierCurrency = self.parentEmailSupplier().Currency;
                self.toLoad.paymentTermsCode = self.parentEmailSupplier().PaymentTermsCode;
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

            // this seems strange but it IS sufficient: you cannot enter an attachment of unknown type, then change the type, then successfully save without validation
            // therefore you cannot save without specifying a type
            // therefore we only need test the one variable to determine if there are ANY unsaved changes whatever
            let unsaved = self.AttachmentTypeID.toString() != self.attachmentTypeId();

            if (unsaved) {
                window.showConfirm('Unsaved changes', 'You have unsaved changes. If you proceed your changes will be lost. Proceed?', () => {
                    self.attachmentTypeId(1);
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

    self.formatDateString = (date) => {
        if (date)
            return `${date.getFullYear().toString().padStart(4, 0)}-${(date.getMonth() + 1).toString().padStart(2, 0)}-${date.getDate().toString().padStart(2, 0)}`;
        else
            return null;
    }

    self.formatDateStringForHumans = (date) => {
        if (date)
            return `${date.getDate().toString().padStart(2, 0)}/${(date.getMonth() + 1).toString().padStart(2, 0)}/${date.getFullYear().toString().padStart(4, 0)}`;
        else
            return null;
    }

    self.actuallySave = (afterSave) => {

        self.modalBusy(true);

        self.modalBusyMessage('<span>Saving...</span>');

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
                        supplierBankName: props.supplierBankName() ?? null,
                        supplierBankAccountNumber: props.supplierBankAccountNumber() ?? null,
                        supplierBankSortCode: props.supplierBankSortCode() ?? null,
                        supplierIBAN: props.supplierIBAN() ?? null,
                        supplierBIC: props.supplierBIC() ?? null,
                        invoiceDate: self.formatDateString(props.invoiceDate()),
                        invoiceDueDT: self.formatDateString(props.dueDate()),
                        settlementDT: self.formatDateString(props.settlementDate()),
                        paymentTermsCode: props.paymentTermsCode() ?? null,
                        invoiceCurrencyCode: props.documentCurrencyCode() ?? null,
                        invoiceTotalIncVATInCurrency: props.invoiceTotalIncVATCurrency() ?? null,
                        invoiceTotalIncVATInSterling: Math.round((props.invoiceTotalIncVATInSterling() ?? 0) * 10000) / 10000,
                        invoiceTotalExVATInSterling: Math.round((props.invoiceTotalExVatInSterling() ?? 0) * 10000) / 10000,
                        vatTotalCurrency: props.vatTotalCurrency() ?? null,
                        vatTotalInSterling: Math.round((props.vatTotalInSterling() ?? 0) * 10000) / 10000,
                        netTotalCurrency: props.netTotalCurrency() ?? null,
                        netTotalInSterling: Math.round((props.netTotalInSterling() ?? 0) * 10000) / 10000,
                        dispute: props.dispute() ? 'D' : null,
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
                        invoiceDate: self.formatDateString(props.invoiceDate()),
                        invoiceDueDT: self.formatDateString(props.dueDate()),
                        settlementDT: self.formatDateString(props.settlementDate()),
                        paymentTermsCode: props.paymentTermsCode() ?? null,
                        invoiceCurrencyCode: props.documentCurrencyCode() ?? null,
                        invoiceTotalIncVATInCurrency: props.invoiceTotalIncVATCurrency() ?? null,
                        invoiceTotalIncVATInSterling: Math.round((props.invoiceTotalIncVATInSterling() ?? 0) * 10000) / 10000,
                        invoiceTotalExVATInSterling: Math.round((props.invoiceTotalExVatInSterling() ?? 0) * 10000) / 10000,
                        vatTotalCurrency: props.vatTotalCurrency() ?? null,
                        vatTotalInSterling: Math.round((props.vatTotalInSterling() ?? 0) * 10000) / 10000,
                        netTotalCurrency: props.netTotalCurrency() ?? null,
                        netTotalInSterling: Math.round((props.netTotalInSterling() ?? 0) * 10000) / 10000,
                        dispute: props.dispute() ? 'D' : null,
                        duplicateResults: props.duplicateResults(),
                        isFlaggedAsDuplicate: props.isFlaggedAsDuplicate()
                    });
                    break;
                case 4:
                    data.formDataJson = JSON.stringify({
                        code: null,
                        creditProcessedDate: null,
                        creditReceivedDate: null,
                        passedTo: null,
                        passedToDT: null,
                        supplierCode: props.supplierCode() ?? null,
                        supplier: props.supplier() ?? null,
                        supplierCurrency: props.supplierCurrency() ?? null,
                        exchangeRate: props.exchangeRate() ?? null,
                        supplierCreditNoteCode: props.supplierInvoiceReference() ?? null,
                        creditDate: self.formatDateString(props.invoiceDate()),
                        creditDueDT: null,
                        settlementDT: null,
                        paymentTermsCode: props.paymentTermsCode() ?? null,
                        invoiceCurrencyCode: props.documentCurrencyCode() ?? null,
                        creditTotalIncVATInCurrency: props.invoiceTotalIncVATCurrency() ?? null,
                        creditTotalIncVATInSterling: Math.round((props.invoiceTotalIncVATInSterling() ?? 0) * 10000) / 10000,
                        creditTotalExVATInSterling: Math.round((props.invoiceTotalExVatInSterling() ?? 0) * 10000) / 10000,
                        vatTotalCurrency: props.vatTotalCurrency() ?? null,
                        vatTotalInSterling: Math.round((props.vatTotalInSterling() ?? 0) * 10000) / 10000,
                        netTotalCurrency: props.netTotalCurrency() ?? null,
                        netTotalInSterling: Math.round((props.netTotalInSterling() ?? 0) * 10000) / 10000,
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
                default:
                    data.formDataJson = JSON.stringify({
                        supplierCode: props.supplierCode() ?? null,
                        supplier: props.supplier() ?? null,
                        supplierCurrency: props.supplierCurrency() ?? null,
                    });
                    break;
            }
        }

        if (window.getFreeTextSearchDefault() == 'Potato') {
            console.log('saveAttachmentDetail NOT calling with', data);
            self.modalBusy(false);
            return;
        } else {
            console.log('saveAttachmentDetail calling with', data);
        }


        fetch('/api/InvoiceBookingAPI/SaveAttachmentDetail', {
            method: 'POST',
            headers: window.fetchHeaders,
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(result => {
                console.log('SaveAttachment returned', result);

                if (result.PassedValidation === true) {
                    if (result.Saved === true) {

                        self.modal._element.querySelector('.blocker').classList.add('success');

                        self.modalBusyMessage('<span>Success</span><span class="ms-3">✔</span>')

                        self.AttachmentTypeID = self.attachmentTypeId();

                        self.readOnly(true);

                        if (typeof afterSave === 'function') {
                            afterSave();
                        }

                    } else {
                        window.showError(`Sorry<br/><br/>There was an error while saving this attachment\'s form data. Please click here <a href="mailto:itsupport@designersguild.com?subject=IncomingEmail.Attachment_Save%20Error:%20Attachment%20ID%20=%20${data.attachmentId}&body=${encodeURIComponent(JSON.stringify(result))}">itsupport@designersguild.com</a> to begin a templated email providing IT with useful information about this event.`)
                    }
                } else {
                    window.showError(`Validation Failure: Error Number ${result.ValidationErrorNumber}<br/><br/>${result.ValidationErrorMessage}<br/><br/>
                    Please click here <a href="mailto:itsupport@designersguild.com?subject=IncomingEmail.Attachment_Save%20Error:%20Attachment%20ID%20=%20${data.attachmentId}&body=${encodeURIComponent(JSON.stringify(result, null, '\t'))}">itsupport@designersguild.com</a> to begin a templated email providing IT with useful information about this event.`)
                }

                window.setTimeout(() => {
                    self.modalBusy(false);
                    self.modal._element.querySelector('.blocker').classList.remove('success');
                    self.modalBusyMessage('Please Wait');
                }, 500);

            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
    }

    self.toggleSelectedForDownload = () => {
        self.selectedForDownload(!self.selectedForDownload());
    }

    self.copySharingLinkToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(self.AttachmentSharingLink);
        } catch (error) {
            console.error(error.message);
        }
    }

    self.showAttachmentForwarder = () => {
        self.forwardAttachmentModal.show();
    }

    self.forwardAttachment = () => {

        self.validateForwardToBudgetHolderNow(true); 

        window.setTimeout(() => {

            if (self.forwardToBudgetHolderErrorables().length) {

                self.forwardToBudgetHolderErrorables.showAllMessages(true);

                self.forwardToBudgetHolderErrorables.filter(x => {
                    x.isValid.notifySubscribers(x.isValid());
                });
            } else {
                self.forwardAttachmentModalBusy(true);

                var data = {
                    attachmentId: self.AttachmentID,
                    forwardedToBudgetHolderCode: self.forwardToBudgetHolderCode()
                }

                fetch('/api/InvoiceBookingAPI/ForwardAttachment', {
                    method: 'POST',
                    headers: window.fetchHeaders,
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    body: JSON.stringify(data)
                })
                    .then(window.handleFetchResponse)
                    .then(data => {
                        self.forwardAttachmentModalBusy(false);
                        window.showInfo('Success', `Attachment ID ${self.AttachmentID} has been successfully forwarded to ${data.Name}.`, () => {
                            self.forwardAttachmentModal.hide();
                            self.reloadAttachment({
                                AttachmentID: self.AttachmentID
                            }, null)
                        })
                    })
                    .catch(err => {
                        self.forwardAttachmentModalBusy(false);
                        window.showError("Sorry, an error occurred attempting to forward this attachment. Please contact <a href='mailto:itsupport@designersguild.com'>itsupport@designersguild.com</a>");
                    });
            }

        }, 0);
    }

    //#endregion


    //#region Events

    //self.determinePropertiesTemplate();
        
    //#endregion

    return self;
}