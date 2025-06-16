const invoiceBookingDashboardViewModel = ({
    parent
} = {

}) => {
    let self = {
        parent: parent
    }

    //#region Properties

    self.busy = ko.observable(false);

    self.pods = ko.observableArray(window.getDashboardPods());

    let emailStatusIdtoLoad = window.getEmailStatusIdToLoad();

    self.selectedPod = ko.observable(emailStatusIdtoLoad ?
        self.pods().find(p => p.EmailStatusID == emailStatusIdtoLoad) 
        : self.pods().sort((a, b) => {
            return a.SortOrder === b.SortOrder ? 0
                : a.SortOrder < b.SortOrder ? -1
                    : 1;
    })[0]);

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
                self.selectedPod(self.pods()[0]);
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
    }

    self.select = (data, event) => {
        console.log('dashboard select', data, event);

        self.selectedPod(data);

        self.parent.filters.emailStatusId(data.EmailStatusID);

        console.warn('probably warn about potential or actual unsaved changes');

        switch (data.Label) {
            case 'Unidentified Supplier':
                self.parent.mailboxGridParams.widget().dataSource.sort([{
                    field: 'FromEmail',
                    dir: 'asc'
                }, {
                    field: 'ReceivedDT',
                    dir: 'desc'
                }]);
                break;
            case 'Unprocessed':
                self.parent.mailboxGridParams.widget().dataSource.sort([{
                    field: 'SupplierCode',
                    dir: 'asc'
                }, {
                    field: 'ReceivedDT',
                    dir: 'desc'
                }]);
                break;
            case 'Processed':
            case 'Junk':
                self.parent.mailboxGridParams.widget().dataSource.sort([{
                    field: 'ReceivedDT',
                    dir: 'desc'
                }]);
                break;
            default:
                break;
        }

        self.parent.selectedEmail(undefined);
    } 

    //#endregion


    //#region Events



    //#endregion

    return self;
}