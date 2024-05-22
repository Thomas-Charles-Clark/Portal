const orderBookPreDefinedFiltersViewModel = ((parent) => {

    //#region Properties

    let self = {
        parent: parent
    };

    self.busy = self.parent.busy;

    self.summaries = ko.observableArray([]);

    self.detailModalElement = document.querySelector("#order-book-detail-modal");

    self.detailModalTitleElement = document.querySelector("#order-book-detail-modal-title");

    self.detailModalBodyElement = document.querySelector("#order-book-detail-modal-body");

    self.detailModal = bootstrap.Modal.getOrCreateInstance(self.detailModalElement);

    //#endregion


    //#region Events



    //#endregion


    //#region Components



    //#endregion


    //#region Computeds



    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Validation Groups



    //#endregion

    //#region Functions

    self.parse = (preDefinedFilter) => {
        self.summaries(preDefinedFilter.map(ds => orderBookSummaryFilter({
            parent: self,
            data: ds
        })));
    }

    self.showDetail = (preDefinedFilter) => {
        let iFrame = document.createElement("iframe");

        let params = JSON.parse(self.parent.userDefinedFilters.json());

        let preDefinedFilterCriteria = {};

        preDefinedFilter.Criteria.forEach(c => {
            preDefinedFilterCriteria[c[0]] = c[1];
        });

        Object.assign(params, preDefinedFilterCriteria);

        self.detailModalTitleElement.innerHTML = preDefinedFilter.Label;

        let qs = new URLSearchParams(params).toString();

        let src = `/order-book/detail/back-orders?partial=true&${qs}`;

        console.log(src);

        iFrame.src = src;
        
        self.detailModalBodyElement.replaceChildren(iFrame);

        self.detailModal.show();
    }

    //#endregion

    self.parse(getPreDefinedSummaries());

    return self;
});