const invoiceBookingDashboardViewModel = ({
    parent
} = {

    }) => {
    let self = {
        parent: parent
    }

    //#region Properties

    self.busy = ko.observable(false);

    self.logging = ko.observable(false);

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
    self.documentBudgetHolderPods = ko.observableArray(window.getDocumentsDashboard().BudgetHolders);
    
    self.documentNotices = ko.observableArray(window.getDocumentsDashboard().Notices);

    let documentStatusIdtoLoad = window.getAttachmentStatusIdToLoad();

    self.selectedDocumentActionPod = ko.observable();
    self.selectedDocumentStatusPod = ko.observable();
    self.selectedDocumentTypePod = ko.observable();
    self.selectedDocumentBudgetHolderPod = ko.observable();

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

    self.sortedDocumentBudgetHolderPods = ko.computed(() => {
        return self.documentBudgetHolderPods.sorted((a, b) => {
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
        if (self.logging())
            console.log('dashboard calling with', data);

        fetch('/api/InvoiceBookingAPI/Dashboard', {
            method: 'POST',
            cache: 'no-cache',
            headers: window.fetchHeaders,
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                if (self.logging())
                    console.log('dashboard returned', data);

                let previouslySelectedEmailStatusId = null;

                if (self.selectedPod()) {
                    previouslySelectedEmailStatusId = self.selectedPod().EmailStatusID;
                }

                self.busy(false);
                self.pods(data.DashboardPods);
                self.notices(data.Notices);

                if (previouslySelectedEmailStatusId) {
                    self.selectedPod(self.pods().find(p => p.EmailStatusID == previouslySelectedEmailStatusId));
                } else {
                    self.selectedPod(undefined);
                }

                if (typeof afterFn == 'function')
                    afterFn();
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
    }

    self.select = (data, event) => {
        if (self.logging())
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
                if (data.BudgetHolderCode)
                    self.parent.filters.budgetHolderCode(data.BudgetHolderCode);
                else
                    self.parent.filters.budgetHolderCode('');

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
            case null:
                self.parent.filters.budgetHolderCode(data.BudgetHolderCode);
                self.parent.mailboxGridParams.widget().dataSource.query({
                    page: 1,
                    pageSize: self.parent.mailboxGridParams.widget().dataSource.pageSize(),
                    group: self.parent.mailboxGridParams.widget().dataSource.group(),
                    sort: [{
                        field: 'ReceivedDT',
                        dir: 'desc'
                    }]
                });
            default:
                break;
        }

        self.parent.selectedEmail(undefined);

    }

    self.documentsFetch = (afterFn) => {
        self.documentsBusy(true)

        let data = self.parent.getDocumentsParameters();

        if (window.getDepartmentRestrictions().length && self.parent.filters.departmentIds().length == 0) {
            data.activeDirectoryGroupIds = window.getDepartmentRestrictions();
        }

        if (self.logging())
            console.log('documents dashboard calling with', data);

        fetch('/api/InvoiceBookingAPI/DocumentsDashboard', {
            method: 'POST',
            cache: 'no-cache',
            headers: window.fetchHeaders,
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                if (self.logging())
                    console.log('documents dashboard returned', data);

                self.documentsBusy(false);
                self.documentActionPods(data.Actions);
                self.documentStatusPods(data.DocumentStatuses);
                self.documentTypeSummaryPods(data.DocumentTypesSummary);
                self.documentBudgetHolderPods(data.BudgetHolders);
                self.documentNotices(data.Notices);

                if (self.selectedDocumentActionPod()) {
                    self.selectedDocumentActionPod(self.documentActionPods().find(p => p.SearchKeywords == self.selectedDocumentActionPod().SearchKeywords));
                }

                if (self.selectedDocumentStatusPod()) {
                    self.selectedDocumentStatusPod(self.documentStatusPods().find(p => p.AttachmentStatusID == self.selectedDocumentStatusPod().AttachmentStatusID));
                }

                if (self.selectedDocumentTypePod()) {
                    self.selectedDocumentTypePod(self.documentTypeSummaryPods().find(p => p.AttachmentTypeID == self.selectedDocumentTypePod().AttachmentTypeID));
                }

                if (self.selectedDocumentBudgetHolderPod()) {
                    self.selectedDocumentBudgetHolderPod(self.documentBudgetHolderPods().find(p => p.BudgetHolderCode == self.selectedDocumentBudgetHolderPod().BudgetHolderCode));
                }

                if (typeof afterFn == 'function')
                    afterFn();
            })
            .catch(err => {
                self.documentsBusy(false);
                window.catchFetchError(err);
            })
    }

    self.documentSelect = (data, event) => {
        if (self.logging())
            console.log('documents dashboard select', data, event);

        if (data.SearchKeywords) {
            if (self.selectedDocumentActionPod() === data) {
                self.selectedDocumentActionPod(undefined);
                self.parent.documentFilters.freeTextSearch(undefined);
            } else {
                self.selectedDocumentActionPod(data);
                self.parent.documentFilters.freeTextSearch(data.SearchKeywords);
            }
        }

        if (data.AttachmentStatusID) {
            if (self.selectedDocumentStatusPod() === data) {
                self.selectedDocumentStatusPod(undefined);
                self.parent.documentFilters.documentStatusId('');
            } else {
                self.selectedDocumentStatusPod(data);
                self.parent.documentFilters.documentStatusId(data.AttachmentStatusID);
            }
        }

        if (data.AttachmentTypeID) {
            if (self.selectedDocumentTypePod() === data) {
                self.selectedDocumentTypePod(undefined);
                self.parent.documentFilters.documentTypeId('');
            } else {
                self.selectedDocumentTypePod(data);
                self.parent.documentFilters.documentTypeId(data.AttachmentTypeID);
            }
        }

        if (data.BudgetHolderCode) {
            if (self.selectedDocumentBudgetHolderPod() === data) {
                self.selectedDocumentBudgetHolderPod(undefined);
                self.parent.documentFilters.budgetHolderCode('');
            } else {
                self.selectedDocumentBudgetHolderPod(data);
                self.parent.documentFilters.budgetHolderCode(data.BudgetHolderCode);
            }
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