const orderBookPreDefinedFiltersViewModel = ((parent) => {

    //#region Properties

    let self = {
        parent: parent
    };

    // this is so that the values-dropdown-container template can render a distinct id for the displaymodes
    self.orderGroupId = "pod-filters";

    self.busy = self.parent.busy;

    self.displayModes = self.parent.podsDisplayModes;

    self.groups = ko.observableArray([]);

    self.detailModalElement = document.querySelector("#order-book-detail-modal");

    self.detailModalTitleElement = document.querySelector("#order-book-detail-modal-title");

    self.detailModaliFrameTargetElement = document.querySelector("#order-book-detail-iframe-target");

    self.detailModal = bootstrap.Modal.getOrCreateInstance(self.detailModalElement);

    self.detailModalBusy = ko.observable(false);

    self.availableManagementPromptTabs = ko.observableArray([]); 

    self.displayTabs = ko.observableArray([]);

    //#endregion


    //#region Events



    //#endregion


    //#region Components



    //#endregion


    //#region Computeds

    self.visibleManagementPromptTabs = ko.computed(() => {
        return self.groups().filter((g) => {
            return self.displayTabs().find(a => a == g.groupId) != null;
        });
    }, self);

    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Validation Groups



    //#endregion

    //#region Functions

    self.parse = (preDefinedFilters) => {

        let groups = preDefinedFilters.map(g => {
            return {
                name: g.Name,
                groupId: g.GroupID,
                summaries: ko.observableArray(g.ProblemPods.map(ds => {
                    // opportunity to exclude those problemPods which are empty
                    if (ds.Label && ds.View && ds.Procedure) {
                        return orderBookSummaryFilter({
                            parent: self,
                            data: ds
                        });
                    } else {

                    }
                }).filter(ds => ds != null))
            }
        });

        // 2025/01/31 - I worked rather hard to ensure this application
        // only displayed those options which were reflected in the result set
        // managerial decisions have chucked that notion out of the window.

        //self.availableManagementPromptTabs(groups.map((g, i) => {
        //        return {
        //            label: g.name,
        //            value: i,
        //            children: []
        //        }
        //    })
        //);

        // So now I need to elbow something like this in...

        self.availableManagementPromptTabs(window.getPreDefinedFilterGroups().map((g, i) => {
                return {
                    label: g.GroupName,
                    groupId: g.GroupID,
                    children: []
                }
            })
        );
        
        if (self.parent.displayConfig.managementPromptTabs.length) {
            self.displayTabs(self.parent.displayConfig.managementPromptTabs);
        } else {
            self.displayTabs(self.availableManagementPromptTabs().map(a => a.groupId));
        }

        self.parent.defaultConfig.managementPromptTabs = self.availableManagementPromptTabs().map(a => a.groupId);

        self.groups(groups);
    }

    self.showDetail = (preDefinedFilter, displayModes) => {
        let iFrame = document.createElement("iframe");

        let params = JSON.parse(self.parent.userDefinedFilters.json());

        let preDefinedFilterCriteria = {
            displayModes: typeof displayModes == 'function' ? displayModes() : self.parent.displayModes(),
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

        self.detailModalTitleElement.innerHTML = `${preDefinedFilter.Label} <span class="detail-view-name ms-5" data-bind="attr: { title: '${preDefinedFilter.View}'' }">${preDefinedFilter.View}</span>`;

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