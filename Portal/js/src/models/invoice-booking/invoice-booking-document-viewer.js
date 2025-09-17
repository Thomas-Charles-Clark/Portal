const invoiceBookingDocumentViewerViewModel = ({
    parent
} = {

    }) => {
    let self = {
        parent: parent,
        selectedIndex: parent.selectedDocumentIndex
    }

    //#region Properties

    self.modalBusy = ko.observable(false);

    self.modalBusyMessage = ko.observable('Please Wait...');

    self.modalElement = document.querySelector('#document-viewer-modal');

    self.modal = bootstrap.Modal.getOrCreateInstance(self.modalElement);

    self.selectedEmail = ko.observable();

    self.documentCount = self.parent.documentCount;

    //#endregion


    //#region Lifted Bits



    //#endregion


    //#region Components



    //#endregion


    //#region Computeds

    self.navPreviousDisabled = ko.computed(() => {
        return self.documentCount() == 1 || self.selectedIndex() == 1;
    }, self);

    self.navNextDisabled = ko.computed(() => {
        return self.documentCount() == 1 || (self.selectedIndex() - 1 == self.documentCount());
    }, self);

    self.fromDisplay = ko.computed(() => {
        return `${self.FromName}`;
    }, self);


    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Methods

    self.load = (data) => {
        self.selectedEmail(undefined);
        self.fetchEmailStub(data);
        self.modal.show();
    }

    self.fetchEmailStub = (attachment) => {
        self.modalBusy(true);

        let data = {
            emailId: attachment.EmailID
        }

        var params = new URLSearchParams();

        for (var propertyName in data) {
            if (Array.isArray(data[propertyName])) {
                data[propertyName].forEach(v => {
                    params.append(propertyName, v);
                })
            } else {
                params.append(propertyName, data[propertyName]);
            }
        }

        console.log('documentViewer calling fetchSingularEmailStub with', data);

        fetch(`/api/InvoiceBookingAPI/FetchSingularEmailStub?${params}`, {
            method: 'GET',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin'
        })
            .then(window.handleFetchResponse)
            .then(data => {

                console.log('documentViewer calling fetchSingularEmailStub returned', data);

                self.parent.loadEmail(data, (data) => {

                    let model = invoiceBookingEmailViewModel({
                        parent: Object.assign({
                            modalElement: document.getElementById('document-viewer-modal'),
                            modal: bootstrap.Modal.getOrCreateInstance(document.getElementById('document-viewer-modal'))
                        }, self.parent),
                        emailStatus: data.emailStatus,
                        additionalInfo: data.additionalInfo,
                        rec: data.message,
                        attachments: [],
                        gridWidget: self.parent.documentGridParamsWidget
                    });

                    model.AttachmentID = attachment.AttachmentID;

                    model.selectedIndex = self.selectedIndex;

                    model.selectAttachment({
                        attachmentId: attachment.AttachmentID
                    }, () => {
                        self.modalBusy(false);
                    })

                    self.selectedEmail(model);
                });
            })
            .catch(err => {
                self.modalBusy(false);
                window.catchFetchError(err);
            })
    }

    self.next = () => {

        self.selectedEmail()
            .selectedAttachment()
            .unsavedChanges()
            .then(() => {
                if (self.selectedIndex() == self.parent.documentGridParamsWidget().dataSource.pageSize() - 1) {
                    // we must page forwards, wait for the paging to be successful, then select the zeroth row on the resultant page

                    self.modalBusy(true);

                    self.parent.documentGridParamsWidget().dataSource.one('requestEnd', (event) => {
                        self.parent.documentGridParamsWidget().select(`tr:eq(0)`);
                        //self.parent.documentGridParamsWidget().trigger('change');
                    });

                    let currentPage = self.parent.documentGridParamsWidget().dataSource.page();

                    self.parent.documentGridParamsWidget().dataSource.page(currentPage + 1);

                } else {
                    self.parent.documentGridParamsWidget().select(`tr:eq(${self.selectedIndex() + 1})`);
                    //self.parent.documentGridParamsWidget().trigger('change');
                }
            })
            .catch(err => {

            })
    }

    self.previous = () => {

        self.selectedEmail()
            .selectedAttachment()
            .unsavedChanges()
            .then(() => {
                if (self.selectedIndex() == 0) {
                    // we must page backwards, wait for the paging to be successful, then select the zeroth row on the resultant page

                    self.parent.documentGridParamsWidget().dataSource.one('requestEnd', (event) => {
                        self.parent.documentGridParamsWidget().select(`tr:eq(${self.parent.documentGridParamsWidget().dataSource.pageSize() - 1})`);
                        //self.parent.documentGridParamsWidget().trigger('change');
                    });

                    let currentPage = self.parent.documentGridParamsWidget().dataSource.page();

                    self.parent.documentGridParamsWidget().dataSource.page(currentPage - 1);
                } else {
                    self.modalBusy(true);
                    self.parent.documentGridParamsWidget().select(`tr:eq(${self.selectedIndex() - 1})`);
                    //self.parent.documentGridParamsWidget().trigger('change');
                }
            })
            .catch(err => {

            })
    }

    //#endregion


    //#region Events

    self.modalElement.addEventListener('bs.hidden.modal', (e) => {
        self.selectedEmail(undefined);
    });

    //#endregion

    return self;
}