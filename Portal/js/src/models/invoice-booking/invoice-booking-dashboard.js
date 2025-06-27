const invoiceBookingDashboardViewModel = ({
    parent
} = {

}) => {
    let self = {
        parent: parent
    }

    //#region Properties

    self.busy = ko.observable(false);

    self.pods = ko.observableArray(window.getDashboard().DashboardPods);

    self.mertexWarning = ko.observable(window.getDashboard().MertexWarning);

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

        if (window.getDepartmentRestrictions().length && self.parent.filters.departmentIds().length == 0) {
            data.activeDirectoryGroupIds = window.getDepartmentRestrictions();
        }

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

                let previouslySelectedEmailStatusId = self.selectedPod().EmailStatusID;

                self.busy(false);
                self.pods(data.DashboardPods);
                self.mertexWarning(data.MertexWarning);
                self.selectedPod(self.pods().find(p => p.EmailStatusID == previouslySelectedEmailStatusId));
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
                self.parent.mailboxGridParams.widget().dataSource.query({
                    page: 1,
                    pageSize: self.parent.mailboxGridParams.widget().dataSource.pageSize(),
                    group: self.parent.mailboxGridParams.widget().dataSource.group(),
                    sort: [{
                        field: 'FromEmail',
                        dir: 'asc'
                    }, {
                        field: 'ReceivedDT',
                        dir: 'desc'
                    }]
                });
                break;
            case 'Unprocessed':
                self.parent.mailboxGridParams.widget().dataSource.query({
                    page: 1,
                    pageSize: self.parent.mailboxGridParams.widget().dataSource.pageSize(),
                    group: self.parent.mailboxGridParams.widget().dataSource.group(),
                    sort: [{
                        field: 'SupplierCode',
                        dir: 'asc'
                    }, {
                        field: 'ReceivedDT',
                        dir: 'desc'
                    }]
                });
                break;
            case 'Processed':
            case 'Junk':
                self.parent.mailboxGridParams.widget().dataSource.query({
                    page: 1,
                    pageSize: self.parent.mailboxGridParams.widget().dataSource.pageSize(),
                    group: self.parent.mailboxGridParams.widget().dataSource.group(), 
                    sort: [{
                        field: 'ReceivedDT',
                        dir: 'desc'
                    }]
                });
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