const invoiceBookingEmailViewModel = ({
    parent,
    rec,
    attachments
} = {

}) => {

    let self = Object.assign(rec, {
        busy: parent.busy,
        parent: {
            refresh: parent.refresh,
            loadEmail: parent.loadEmail,
            modal: parent.modal,
            modalBusy: parent.modalBusy,
            previous: parent.previous,
            next: parent.next
        },
        itemCount: parent.itemCount,
        selectedIndexOnPage: parent.selectedEmailIndex,
        selectedEmailIndex: ko.computed(() => {
            let page = parent.mailboxGridParams.widget().dataSource.page();
            let pageSize = parent.mailboxGridParams.widget().dataSource.pageSize();

            let inPageIndex = parent.selectedEmailIndex() + 1;

            return ((page - 1) * pageSize) + inPageIndex;
        }),
        modalElement: parent.modalElement
    });

    self.propagateSupplier = function (supplier) {
        self.attachments().forEach(a => {
            if (a != this) {
                if (a.supplierCode() == '') {
                    a.isPropagatingSupplier = true;
                    a.supplierCode(supplier.Code);
                    a.supplier(supplier);
                }
            }
        })
    }

    //#region Properties

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

    //#endregion


    //#region Components



    //#endregion


    //#region Computeds

    self.navPreviousDisabled = ko.computed(() => {
        return self.selectedEmailIndex() == 1;
    }, self);

    self.navNextDisabled = ko.computed(() => {
        return self.selectedEmailIndex() - 1 == self.itemCount();
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
        return self.attachments().length && self.attachments()[0].supplier() == null;
    });

    //#endregion


    //#region Subscriptions

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

            self.parent.modalBusy(true);

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
                    });
                })
                .catch(err => {
                    self.parent.modalBusy(false);

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
    })

    //#endregion


    //#region Methods

    self.selectAttachment = (data, event) => {
        // if this is not "disabled", then we can select
        if (!self.attachmentsDisabled()) {
            self.selectedAttachment(data);
        }
    }

    self.imageExtensions = [
        '.jpg', '.jpeg', '.png', '.tif', '.tiff', '.gif'
    ]

    self.iconClass = (data) => {

        let extension = `.${data.FileExtension.toLowerCase()}`;

        if (self.imageExtensions.indexOf(extension) > -1)
            return 'k-i-image';

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

    //#endregion


    //#region Events



    //#endregion

    return self;
}