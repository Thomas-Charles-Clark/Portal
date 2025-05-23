const invoiceBookingEmailViewModel = ({
    parent,
    rec,
    attachments
} = {

}) => {

    let self = Object.assign(rec, {
        busy: parent.busy,
        //dashboard: parent.dashboard
    });

    //#region Properties

    self.attachments = ko.observableArray((attachments || []).map(a => invoiceBookingEmailAttachmentViewModel({
        rec: a
    })));

    self.selectedAttachment = ko.observable(self.attachments().filter(a => a.IsInline == false).length ? self.attachments().filter(a => a.IsInline == false)[0] : undefined);

    self.noAttachments = !self.HasNonInlineAttachments;

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
                    self.busy(false);
                    //self.dashboard.fetch();
                    //self.mailboxGridParams.widget().dataSource.read();
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

    self.flagJunk = () => {
        self.flag('Junk');
    }

    //#endregion


    //#region Events



    //#endregion

    return self;
}