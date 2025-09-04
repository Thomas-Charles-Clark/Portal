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

    self.notices = ko.observableArray(window.getDashboard().Notices);

    let emailStatusIdtoLoad = window.getEmailStatusIdToLoad();

    self.selectedPod = ko.observable(emailStatusIdtoLoad ?
        self.pods().find(p => p.EmailStatusID == emailStatusIdtoLoad)
        : self.pods().sort((a, b) => {
            return a.SortOrder === b.SortOrder ? 0
                : a.SortOrder < b.SortOrder ? -1
                    : 1;
        })[0]);

    self.documentsBusy = ko.observable(false);

    self.documentActionPods = ko.observableArray(window.getDocumentsDashboard().Actions);
    self.documentStatusPods = ko.observableArray(window.getDocumentsDashboard().DocumentStatuses);
    self.documentTypeSummaryPods = ko.observableArray(window.getDocumentsDashboard().DocumentTypesSummary);
    
    self.documentNotices = ko.observableArray(window.getDocumentsDashboard().Notices);

    let documentStatusIdtoLoad = window.getAttachmentStatusIdToLoad();

    self.selectedDocumentsPod = ko.observable(
        //documentStatusIdtoLoad ?
        //self.documentsPods().find(p => p.AttachmentStatusID == documentStatusIdtoLoad)
        //: self.documentsPods().sort((a, b) => {
        //    return a.SortOrder === b.SortOrder ? 0
        //        : a.SortOrder < b.SortOrder ? -1
        //            : 1;
        //})[0]
    );

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

    self.sortedDocumentActionPods = ko.computed(() => {
        return self.documentActionPods.sorted((a, b) => {
            return a.SortOrder === b.SortOrder ? 0
                : a.SortOrder < b.SortOrder ? -1
                    : 1;
        })
    }, self);

    self.sortedDocumentTypeSummaryPods = ko.computed(() => {
        return self.documentTypeSummaryPods.sorted((a, b) => {
            return a.SortOrder === b.SortOrder ? 0
                : a.SortOrder < b.SortOrder ? -1
                    : 1;
        })
    }, self);

    self.sortedDocumentStatusPods = ko.computed(() => {
        return self.documentStatusPods.sorted((a, b) => {
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

    self.fetch = (afterFn) => {
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
                self.notices(data.Notices);
                self.selectedPod(self.pods().find(p => p.EmailStatusID == previouslySelectedEmailStatusId));

                if (typeof afterFn == 'function')
                    afterFn();
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

        switch (data.EmailStatusID) {
            case 1:
            case 5:
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
            case 2:
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
            case 3:
            case 4:
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

    self.documentsFetch = (afterFn) => {
        self.documentsBusy(true)

        let data = self.parent.getParameters();

        if (window.getDepartmentRestrictions().length && self.parent.filters.departmentIds().length == 0) {
            data.activeDirectoryGroupIds = window.getDepartmentRestrictions();
        }

        fetch('/api/InvoiceBookingAPI/DocumentsDashboard', {
            method: 'POST',
            cache: 'no-cache',
            headers: window.fetchHeaders,
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log('documents dashboard returned', data);

                let previouslySelectedDocumentStatusId = self.selectedDocumentsPod()?.DocumentStatusID;

                self.documentsBusy(false);
                self.documentActionPods(data.Actions);
                self.documentStatusPods(data.DocumentStatuses);
                self.documentTypeSummaryPods(data.DocumentTypesSummary);
                self.documentNotices(data.Notices);
                //self.selectedDocumentsPod(self.documentsPods().find(p => p.AttachmentStatusID == previouslySelectedDocumentStatusId));

                if (typeof afterFn == 'function')
                    afterFn();
            })
            .catch(err => {
                self.documentsBusy(false);
                window.catchFetchError(err);
            })
    }

    self.documentSelect = (data, event) => {
        console.log('documents dashboard select', data, event);

        self.selectedDocumentsPod(data);

        if (data.AttachmentStatusID) {
            self.parent.filters.documentStatusId(data.AttachmentStatusID);
        }

        if (data.AttachmentTypeID) {
            self.parent.filters.documentTypeId(data.AttachmentStatusID);
        }

        if (data.SearchKeywords) {
            self.parent.filters.freeTextSearch(data.SearchKeywords);
        }

        self.parent.documentGridParams.widget().dataSource.query({
            page: 1,
            pageSize: self.parent.documentGridParams.widget().dataSource.pageSize(),
            group: self.parent.documentGridParams.widget().dataSource.group(),
            sort: self.parent.documentGridParams.widget().dataSource.sort()
        });

        self.parent.selectedEmail(undefined);
        
    } 

    //#endregion


    //#region Events



    //#endregion

    return self;
}