const documentsSentReportDashboardViewModel = ({
    parent
} = {

    }) => {
    let self = {
        parent: parent
    }

    //#region Properties

    self.busy = ko.observable(false);

    self.logging = ko.observable(false);

    self.pods = ko.observableArray(getDashboardPods())

    self.notices = ko.observableArray(getDashboardNotices());

    self.selectedPod = ko.observable();

    let documentIdToLoad = window.getDto()?.documentId;

    self.selectedPod = ko.observable(documentIdToLoad ?
        self.pods().find(p => p.DocumentID == documentIdToLoad)
        :
        undefined
        //self.pods().sort((a, b) => {
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

    //#endregion


    //#region Computeds



    //#endregion


    //#region Subscriptions

    self.pods.subscribe(nv => {
        console.log('dashboard pods subscribe hit', nv);
        window.setTimeout(() => {
            if (self.previouslySelectedDocumentId) {
                self.selectedPod(self.pods().find(p => p.DocumentID == self.previouslySelectedDocumentId))
            }
        }, 0);
    }, self);

    //#endregion


    //#region Methods

    self.select = (data, event) => {
        if (self.logging())
            console.log('dashboard select', data, event);

        if (self.selectedPod() === data) {

            self.selectedPod(undefined);

            self.parent.filters.documentId('');

        } else {

            self.selectedPod(data);

            self.parent.filters.documentId(data.DocumentID);

        }


        //switch (data.EmailStatusID) {
        //    case 1:
        //    case 5:
        //        self.parent.mailboxGridParams.widget().dataSource.query({
        //            page: 1,
        //            pageSize: self.parent.mailboxGridParams.widget().dataSource.pageSize(),
        //            group: self.parent.mailboxGridParams.widget().dataSource.group(),
        //            sort: [{
        //                field: 'FromEmail',
        //                dir: 'asc'
        //            }, {
        //                field: 'ReceivedDT',
        //                dir: 'desc'
        //            }]
        //        });
        //        break;
        //    case 2:
        //        if (data.BudgetHolderCode)
        //            self.parent.filters.budgetHolderCode(data.BudgetHolderCode);
        //        else
        //            self.parent.filters.budgetHolderCode('');

        //        self.parent.mailboxGridParams.widget().dataSource.query({
        //            page: 1,
        //            pageSize: self.parent.mailboxGridParams.widget().dataSource.pageSize(),
        //            group: self.parent.mailboxGridParams.widget().dataSource.group(),
        //            sort: [{
        //                field: 'SupplierCode',
        //                dir: 'asc'
        //            }, {
        //                field: 'ReceivedDT',
        //                dir: 'desc'
        //            }]
        //        });
        //        break;
        //    case 3:
        //    case 4:
        //        self.parent.mailboxGridParams.widget().dataSource.query({
        //            page: 1,
        //            pageSize: self.parent.mailboxGridParams.widget().dataSource.pageSize(),
        //            group: self.parent.mailboxGridParams.widget().dataSource.group(),
        //            sort: [{
        //                field: 'ReceivedDT',
        //                dir: 'desc'
        //            }]
        //        });
        //        break;
        //    case null:
        //        self.parent.filters.budgetHolderCode(data.BudgetHolderCode);
        //        self.parent.mailboxGridParams.widget().dataSource.query({
        //            page: 1,
        //            pageSize: self.parent.mailboxGridParams.widget().dataSource.pageSize(),
        //            group: self.parent.mailboxGridParams.widget().dataSource.group(),
        //            sort: [{
        //                field: 'ReceivedDT',
        //                dir: 'desc'
        //            }]
        //        });
        //    default:
        //        break;
        //}

        //self.parent.selectedEmail(undefined);

    }

    //#endregion


    //#region Events



    //#endregion

    return self;
}