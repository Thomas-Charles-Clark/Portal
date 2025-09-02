const invoiceBookingDocumentViewerViewModel = ({
    parent
} = {

    }) => {
    let self = {
        parent: parent
    }

    //#region Properties

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable('Please Wait...');

    self.modalElement = document.querySelector('#document-viewer-modal');

    self.modal = bootstrap.Modal.getOrCreateInstance(self.modalElement);

    self.selectedDocument = ko.observable();

    //#endregion


    //#region Lifted Bits



    //#endregion


    //#region Components



    //#endregion


    //#region Computeds



    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Methods

    self.load = (data) => {
        self.selectedDocument(data);
        self.modal.show();
    }

    self.viewEmail = (data) => {
        console.log('documentViewer.viewEmail', data);
        let attachmentId = self.selectedDocument().AttachmentID;

        self.parent.loadEmail(data, () => {
            self.parent.selectedEmail().selectedAttachment(self.parent.selectedEmail().attachments().find(a => a.AttachmentID == attachmentId));
        });
        self.modal.hide();
    }

    //#endregion


    //#region Events

    self.modalElement.addEventListener('bs.hidden.modal', (e) => {
        self.selectedDocument(null);
    });

    //#endregion

    return self;
}