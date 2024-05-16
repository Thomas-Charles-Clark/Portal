const orderBookPreDefinedFiltersViewModel = ((parent) => {

    //#region Properties

    let self = {
        parent: parent
    };

    self.busy = self.parent.busy;

    self.summaries = ko.observableArray(getPreDefinedSummaries().map(ds => orderBookSummaryFilter({
        parent: self,
        data: ds
    })));

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



    //#endregion


    //#region Events



    //#endregion

    return self;
});