const invoiceBookingEmailViewModel = ({
    rec,
    attachments
} = {

}) => {

    let self = Object.assign(rec, {

    });

    //#region Properties

    self.attachments = ko.observableArray((attachments || []).map(a => invoiceBookingEmailAttachmentViewModel({
        rec: a
    })));

    self.selectedAttachment = ko.observable(self.attachments().filter(a => a.IsInline == false).length ? self.attachments().filter(a => a.IsInline == false)[0] : undefined);

    //#endregion


    //#region Components



    //#endregion


    //#region Computeds

    self.fromDisplay = ko.computed(() => {
        return `${self.FromName}`;
    }, self);

    self.attachmentDisplay = ko.computed(() => {
        return `${(self.RegularAttachmentCount ?? 0)}`
    });

    self.regularAttachments = ko.computed(() => {
        return self.attachments().filter(a => a.IsInline == false);
    }, self);

    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Methods

    self.imageExtensions = [
        '.jpg', '.jpeg', '.png', '.tif', '.tiff', '.gif'
    ]

    self.kendoIconClass = (data) => {

        let extension = `.${data.FileExtension.toLowerCase()}`;

        if (self.imageExtensions.indexOf(extension) > -1)
            return 'k-i-image';

        switch (extension) {
            case '.txt':
                return 'k-i-txt';
            case '.csv':
                return 'k-i-csv';
            case '.xlsx':
            case '.xls':
            case '.xlsm':
                return 'k-i-excel';
            case '.docx':
            case '.doc':
            case '.docm':
                return 'k-i-word';
            case '.ppt':
                return 'k-i-ppt';
            case '.pdf':
                return 'k-i-pdf';
            case '.psd':
                return 'k-i-psd';
            default:
                return 'k-i-file';
        }
    }

    //#endregion


    //#region Events



    //#endregion

    return self;
}