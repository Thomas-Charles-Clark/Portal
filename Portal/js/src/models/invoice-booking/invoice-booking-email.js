const invoiceBookingEmailViewModel = ({
    parent,
    rec,
    emailStatus,
    additionalInfo,
    attachments
} = {

}) => {

    let self = Object.assign(rec, {
        busy: parent.busy,
        emailStatus,
        additionalInfo,
        parent: {
            refresh: parent.refresh,
            loadEmail: (stub, afterLoad) => {
                parent.loadEmail(stub)
                    .then(() => {
                        if (typeof afterLoad == 'function') {
                            afterLoad.apply(self);
                        }
                    })
            },
            modal: parent.modal,
            previous: parent.previous,
            next: parent.next
        },
        modalBusy: parent.modalBusy,
        modalBusyMessage: parent.modalBusyMessage,
        itemCount: parent.itemCount,
        selectedIndexOnPage: parent.selectedEmailIndex,
        selectedEmailIndex: ko.computed(() => {
            let page = parent.mailboxGridParams.widget().dataSource.page();
            let pageSize = parent.mailboxGridParams.widget().dataSource.pageSize();

            let inPageIndex = parent.selectedEmailIndex() + 1;

            return ((page - 1) * pageSize) + inPageIndex;
        }),
        modalElement: parent.modalElement,
        reset: parent.reset
    });

    //self.propagateSupplier = function (supplier) {
    //    self.attachments().forEach(a => {
    //        if (a != this) {
    //            let props = ko.unwrap(a.properties);
    //            if (props) {
    //                if (props.supplierCode() == '') {
    //                    self.isPropagatingSupplier = true;
    //                    props.supplierCode(supplier.Code);
    //                    props.supplier(supplier);
    //                }
    //            }
    //        }
    //    })
    //}

    //#region Properties

    self.additionalInfo = ko.observable(self.additionalInfo);

    self.supplierCode = ko.observable(self.SupplierCode ?? '').extend({
        notEqual: {
            params: '',
            onlyIf: self.validateNow,
            message: 'Please specify a Supplier'
        }
    });

    self.supplier = ko.observable(self.Supplier);

    self.attachments = ko.observableArray((attachments || []).map(a => invoiceBookingEmailAttachmentViewModel({
        rec: a,
        parent: self
    })));

    self.selectedAttachment = ko.observable(self.attachments().filter(a => a.IsInline == false).length ? self.attachments().filter(a => a.IsInline == false)[0] : undefined);

    self.addingAttachments = ko.observable('');

    self.addingAttachmentsBusy = ko.observable(false);
    
    self.addAttachmentParams = {
        accept: "application/pdf, text/csv, image/*, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/html, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        observable: self.addingAttachments,
        busy: self.addingAttachmentsBusy,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        enable: ko.observable(true),
        disable: self.addingAttachmentsBusy,
        clearable: ko.observable(false),
        revertible: ko.observable(false)
    }

    self.displayMostRecent = ko.observable(true);

    self.downloadAttachmentsModalElement = document.querySelector('#download-attachments-modal');

    self.downloadAttachmentsModal = bootstrap.Modal.getOrCreateInstance(self.downloadAttachmentsModalElement);

    self.downloadAttachmentsModalBusy = ko.observable(false);

    self.downloadAttachmentsDownloadsBusy = ko.observable(false);

    self.downloadAttachmentsModalBusyMessage = ko.observable('Please Wait');

    self.downloadAttachmentsProgressPercentage = ko.observable(0);

    self.downloadAttachmentsIndividualPortionPercentage = ko.observable(Math.round((100 / self.attachments().filter(a => a.isEmailBody == false && a.IsInline == false).length) * 100) / 100);

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
            return `${e.Code} - ${(e.Name ?? "[UNNAMED]")}`;
        },
        valueTemplate: (e) => {
            if (e.Code) {
                if (e.AccountClosed) {
                    return `${e.Code} - ${(e.Name ?? "[UNNAMED]")} - ACCOUNT CLOSED`;
                } else {
                    return `${e.Code} - ${(e.Name ?? "[UNNAMED]")}`;
                }
            } else {
                return '';
            }
        },
        optionLabel: {
            Code: '',
            Name: ''
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
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        changeBtnVisible: ko.observable(self.supplierCode() != ''),
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
            self.supplierParams.locked(true);
            //self.propagateSupplier(e.dataItem);
        },
        clearFunction: () => {
            self.supplierParams.dropDownListSettings.widget().select(-1);
            self.supplierParams.dropDownListSettings.widget().trigger('change');
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

    self.downloadAttachmentsProgressBarParams = {
        widget: ko.observable(),
        type: 'percent',
        value: self.downloadAttachmentsProgressPercentage,
        showStatus: true,
        animation: {
            duration: 100
        },
        change: function (e) {

        }
    }

    //#endregion


    //#region Computeds

    self.navPreviousDisabled = ko.computed(() => {
        return self.itemCount() == 1 || self.selectedEmailIndex() == 1;
    }, self);

    self.navNextDisabled = ko.computed(() => {
        return self.itemCount() == 1 || (self.selectedEmailIndex() - 1 == self.itemCount());
    }, self);

    self.fromDisplay = ko.computed(() => {
        return `${self.FromName}`;
    }, self);

    self.attachmentDisplay = ko.computed(() => {
        if (self.RegularAttachmentCount) {
            return `<i class="bi bi-paperclip" title="${self.RegularAttachmentCount} attachment${(self.RegularAttachmentCount > 1 ? 's' : '')}"></i>`
        } else {
            return '';
        }
    });

    self.regularAttachments = ko.computed(() => {
        return self.attachments().filter(a => a.IsInline == false);
    }, self);

    self.junkPermitted = ko.computed(() => {
        return !!self.attachments().find(a => a.Submitted == true);
    }, self);

    self.attachmentsDisabled = ko.computed(() => {
        return self.Processed;
    });

    self.mayFlagAsJunk = ko.computed(() => {
        let junkableAttachmentTypeIds = [1, 1000];

        let selectedAttachmentTypeId = null;

        let selectedAttachment = self.selectedAttachment();

        if (selectedAttachment && selectedAttachment.isEmailBody == false) {
            selectedAttachmentTypeId = +selectedAttachment.attachmentTypeId();
        }

        let nonJunkableAttachments = self.regularAttachments().filter(ra => {
            if (ra.isEmailBody == true)
                return;
            else
                if (junkableAttachmentTypeIds.indexOf(+ra.attachmentTypeId()) == -1) {
                    return ra;
                }
        });

        if (selectedAttachmentTypeId && junkableAttachmentTypeIds.indexOf(selectedAttachmentTypeId) == -1)
            nonJunkableAttachments.push(selectedAttachmentTypeId);

        return self.Junk == false && self.Processed == false && nonJunkableAttachments.length == 0;
    }, self);

    self.attachmentsSelectedForDownload = ko.computed(() => {
        return self.regularAttachments().filter(f => !f.isEmailBody && f.selectedForDownload());
    }, self);

    //#endregion


    //#region Subscriptions

    self.displayMostRecent.subscribe(nv => {
        console.log('displayMostRecent', nv);
        self.attachments().forEach(a => {
            a.switchDataSet(nv);
        });
    });

    self.supplierCode.subscribe(nv => {

        if (!self.isPropagatingSupplier) {

            let data = {
                emailId: self.EmailID,
                supplierCode: nv == '' ? null : nv
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
    });

    self.addingAttachments.subscribe((nv) => {

        if (nv) {

            let formData = new FormData(document.getElementById('add-attachments-form'));

            let params = {
                obj: JSON.stringify({
                    EmailID: self.EmailID
                })
            }

            for (const key in params) {
                formData.append(key, params[key]);
            }

            self.modalBusy(true);

            let headers = Object.assign({

            }, window.fetchHeaders);

            delete headers["content-type"];

            fetch('/api/InvoiceBookingAPI/AttachmentUpsert', {
                method: 'POST',
                headers: headers,
                body: formData
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    console.log('AttachmentUpsert returned', data);

                    document.getElementById('file-input').value = '';

                    self.addingAttachments('');

                    self.parent.refresh();

                    self.parent.loadEmail({
                        EmailID: self.EmailID,
                        EmailMessageID: self.EmailMessageID,
                    }, null);
                })
                .catch(err => {
                    self.modalBusy(false);

                    self.addingAttachments('');

                    document.getElementById('file-input').value = '';

                    window.catchFetchError(err);
                });
        }

    }, self);

    self.selectedAttachment.subscribe(nv => {
        if (nv) {
            self.modalElement.querySelectorAll('.btn').forEach((e) => {
                new bootstrap.Ripple(e);
            });
        }
    });

    self.attachmentsSelectedForDownload.subscribe(nv => {
        self.downloadAttachmentsProgressPercentage(0);
        self.downloadAttachmentsIndividualPortionPercentage(Math.round((100 / nv.length) * 100) / 100)
    });

    //#endregion


    //#region Methods

    self.selectAttachment = (data, callback) => {

        // if this is not "disabled", then we can select
        //if (!self.attachmentsDisabled()) {

            self.selectedAttachment()
                .unsavedChanges()
                .then(() => {

                    self.modalBusy(true);

                    let params = {
                        attachmentId: data.AttachmentID
                    }

                    if (params.attachmentId == -1) {
                        self.selectedAttachment(self.regularAttachments()[0]);
                        self.modalBusy(false);
                    } else {
                        fetch('/api/InvoiceBookingAPI/LoadAttachment', {
                            method: 'POST',
                            headers: window.fetchHeaders,
                            cache: 'no-cache',
                            credentials: 'same-origin',
                            body: JSON.stringify(params)
                        })
                            .then(window.handleFetchResponse)
                            .then(data => {
                                console.log('LoadAttachment returned', data);

                                self.selectedAttachment(invoiceBookingEmailAttachmentViewModel({
                                    rec: data,
                                    parent: self
                                }));

                                let original = self.attachments().find(a => a.AttachmentID == data.AttachmentID);

                                self.attachments.replace(original, self.selectedAttachment());

                                if (typeof callback == 'function') {
                                    callback();
                                } else {
                                    self.modalBusy(false);
                                }
                            })
                            .catch(err => {
                                self.modalBusy(false);
                                window.catchFetchError(err);
                            })
                    }
                })
                .catch(err => {

                })
        //}
    }

    self.imageExtensions = [
        '.jpg', '.jpeg', '.png', '.tif', '.tiff', '.gif', '.bmp', '.webp'
    ]

    self.iconClass = (data) => {

        let extension = `.${data.FileExtension.toLowerCase()}`;

        if (self.imageExtensions.indexOf(extension) > -1)
            return 'k-icon k-i-image';

        switch (extension) {
            case '.html':
                return 'bi bi-envelope-at';
            case '.txt':
                return 'k-icon k-i-txt';
            case '.csv':
                return 'k-icon k-i-csv';
            case '.xlsx':
            case '.xls':
            case '.xlsm':
                return 'k-icon k-i-excel';
            case '.docx':
            case '.doc':
            case '.docm':
                return 'k-icon k-i-word';
            case '.ppt':
                return 'k-icon k-i-ppt';
            case '.pdf':
                return 'k-icon k-i-pdf';
            case '.psd':
                return 'k-icon k-i-psd';
            default:
                return 'k-icon k-i-file';
        }
    }

    self.flag = (state) => {
        window.showConfirm('Are you sure?', `This will mark this email as being ${state}.`, () => {
            self.busy(true);

            let data = {
                emailId: self.EmailID,
                state: state
            }

            fetch('/api/InvoiceBookingAPI/Flag', {
                method: 'POST',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: window.fetchHeaders,
                body: JSON.stringify(data)
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    console.log('flagProcessed returned', data);

                    self.parent.refresh();

                    self.parent.loadEmail({
                        EmailID: self.EmailID,
                        EmailMessageID: self.EmailMessageID,
                    });
                })
                .catch(err => {
                    self.busy(false);
                    window.catchFetchError(err);
                })

        }, null);
    }

    self.flagProcessed = () => {
        self.flag('Processed');
    }

    self.flagUnprocessed = () => {
        self.flag('Unprocessed');
    }

    self.flagJunk = () => {
        self.flag('Junk');
    }

    self.flagUnjunk = () => {
        self.flag('not junk');
    }

    self.loadAttachmentById = (attachmentId) => {
        self.selectAttachment({
            AttachmentID: attachmentId
        });
    }

    self.showDownloadAttachmentsModal = () => {
        self.downloadAttachmentsProgressPercentage(0);
        self.downloadAttachmentsModal.show();
    }

    self.selectAllAttachmentsForDownload = () => {
        for (var i = 1; i < self.regularAttachments().length; i++) {
            self.regularAttachments()[i].selectedForDownload(true);
        }
    }

    self.deselectAllAttachmentsForDownload = () => {
        for (var i = 1; i < self.regularAttachments().length; i++) {
            self.regularAttachments()[i].selectedForDownload(false);
        }
    }

    self.downloadSelectedAttachments = (data) => {
        self.downloadAttachmentsDownloadsBusy(true);
        self.downloadAttachmentsProgressPercentage(0);

        let promises = [];

        self.attachmentsSelectedForDownload().forEach(a => {
            promises.push(self.downloadAttachment(a.src(), `${a.FileName}.${a.FileExtension}`));
        });

        Promise.allSettled(promises)
            .then(results => {
                console.log(results);
                self.downloadAttachmentsProgressPercentage(`Complete`);
                self.downloadAttachmentsDownloadsBusy(false);
            })
    }

    self.downloadAttachment = (src, fileName) => {
        return new Promise((resolve, reject) => {
            fetch(src, {
                method: 'GET',
                headers: window.fetchHeaders
            })
                .then(b => b.blob())
                .then(b => {
                    var a = document.createElement("a");
                    a.href = URL.createObjectURL(b);
                    a.setAttribute("download", fileName);
                    a.click();
                    self.downloadAttachmentsProgressPercentage(`${Math.round((self.downloadAttachmentsProgressPercentage() + self.downloadAttachmentsIndividualPortionPercentage()) * 100) / 100}%`);
                    resolve();
                })
                .catch(err => {
                    console.error(err);
                    reject();
                })
        });
    }

    self.downloadEmailAsPDF = () => {

        if (self.Body.length > 20000) {

            window.showConfirm('Polite Notice', `This process is not guaranteed to succeed when presented 
            with long email threads such as the one you are viewing.
            <br/><br/>
            Would you like to proceed?`, () => {
                self.actuallyDownloadEmailAsPDF();
            }, () => {

            });
        } else {
            self.actuallyDownloadEmailAsPDF();
        }

    }

    self.actuallyDownloadEmailAsPDF = () => {

        self.modalBusyMessage('Converting HTML Email to PDF Document...');
        self.modalBusy(true);

        let fileName = self.supplierCode() ? `${ko.unwrap(self.supplierCode)}-${self.Subject}.pdf` : `${self.Subject}.pdf`;

        let data = {
            emailId: self.EmailID,
            body: self.Body,
            fileName: fileName
        }

        fetch('/api/InvoiceBookingAPI/ConvertEmailToPDF', {
            method: 'POST',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: window.fetchHeaders,
            body: JSON.stringify(data)
        }).then(response => response.blob())
            .then(blob => {

                console.log(blob);

                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
                self.busy(false);
                link.remove();

                self.modalBusy(false);

                window.setTimeout(() => {
                    self.modalBusyMessage('Please Wait');
                }, 150);
            })
            .catch(err => {
                self.modalBusy(false);
                window.setTimeout(() => {
                    self.modalBusyMessage('Please Wait');
                }, 150);
                window.catchFetchError(err);
            });
    }

    //#endregion


    //#region Events



    //#endregion

    return self;
}