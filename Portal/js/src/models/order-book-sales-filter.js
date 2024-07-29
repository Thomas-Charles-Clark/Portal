const orderBookSalesFiltersViewModel = ((parent) => {

    //#region Properties

    let self = {
        parent: parent
    };

    // this is so that the values-dropdown-container template can render a distinct id for the displaymodes
    self.orderGroupId = "sales-filters";

    self.busy = self.parent.busy;

    self.displayModes = self.parent.salesDisplayModes;

    self.groups = ko.observableArray([]);

    self.detailModalElement = document.querySelector("#order-book-detail-modal");

    self.detailModalTitleElement = document.querySelector("#order-book-detail-modal-title");

    self.detailModaliFrameTargetElement = document.querySelector("#order-book-detail-iframe-target");

    self.detailModal = bootstrap.Modal.getOrCreateInstance(self.detailModalElement);

    self.detailModalBusy = ko.observable(false);

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

        let groups = preDefinedFilter.map(g => {
            return {
                name: g.Name,
                summaries: ko.observableArray(g.ProblemPods.map(ds => orderBookSummaryFilter({
                    parent: self,
                    data: ds
                })))
            }
        });
        
        self.groups(groups);
    }

    self.showDetail = (preDefinedFilter) => {
        let iFrame = document.createElement("iframe");

        let params = JSON.parse(self.parent.userDefinedFilters.json());

        let preDefinedFilterCriteria = {
            displayModes: self.parent.displayModes(),
            accurateAsOfDateTime: self.parent.accurateAsOfDateTime(),
            title: preDefinedFilter.Label,
            procedure: preDefinedFilter.Procedure,
            view: preDefinedFilter.View,
            filterable: preDefinedFilter.Filterable
        };

        preDefinedFilter.Criteria.forEach(c => {
            preDefinedFilterCriteria[c[0]] = c[1];
        });

        Object.assign(params, preDefinedFilterCriteria);

        self.detailModalTitleElement.innerHTML = preDefinedFilter.Label;

        let qs = new URLSearchParams(params).toString();

        let src = `/order-book/detail/${preDefinedFilter.View}?partial=true&${qs}`;

        console.log(src);

        iFrame.src = src;

        self.detailModalBusy(true);

        iFrame.onload = () => {
            self.detailModalBusy(false);
        }

        self.detailModaliFrameTargetElement.replaceChildren(iFrame);

        self.parent.detailModaliFrame = iFrame;

        self.detailModal.show();
    }

    //#endregion

    //self.parse(getPreDefinedSummaries());

    return self;
});