const invoiceBookingDashboardViewModel = ({
    parent
} = {

}) => {
    let self = {
        parent: parent
    }

    //#region Properties

    self.busy = ko.observable(false);

    self.pods = ko.observableArray([]);

    self.selectedPod = ko.observable();

    //#endregion


    //#region Lifted Bits



    //#endregion


    //#region Components

    self.sortedPods = ko.computed(() => {
        return self.pods.sorted((a, b) => {
            return a.SortOrder === b.SortOrder ? 0
                : a.SortOrder < b.SortOrder ? -1
                : 1;
        })
    }, self);

    //#endregion


    //#region Computeds



    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Methods

    self.fetch = () => {
        self.busy(true)

        let data = self.parent.getParameters();

        fetch('/api/InvoiceBookingAPI/Dashboard', {
            method: 'POST',
            cache: 'no-cache',
            headers: window.fetchHeaders,
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log('dashboard returned', data);
                self.busy(false);
                self.pods(data);
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
    }

    self.select = (data, event) => {
        console.log('dashboard select', data, event);

        self.selectedPod(data);

        switch (data.Label) {
            case 'New / Unprocessed':
                self.parent.filters.emailStatusId(1);
                self.parent.filters.hasAttachments(undefined);
                break;
            case 'New / Unprocessed with Attachments':
                self.parent.filters.emailStatusId(1);
                self.parent.filters.hasAttachments(true);
                break;
            case 'Processed':
                self.parent.filters.emailStatusId(2);
                break;
            case 'Junk':
                self.parent.filters.emailStatusId(3);
                break;
            default:
                break;
        }

        console.warn('probably warn about potential or actual unsaved changes');
        self.parent.loadedEmail(undefined);
    } 

    //#endregion


    //#region Events

    self.fetch();

    //#endregion

    return self;
}