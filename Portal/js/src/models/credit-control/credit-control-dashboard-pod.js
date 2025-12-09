const creditControlDashboardPodViewModel = ({
    rec
} = {
        rec: {}
    }) => {
    let self = Object.assign({

    }, rec);

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    //#endregion



    //#region Methods



    //#endregion



    //#region Components

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds



    //#endregion





    //#region Subscriptions



    //#endregion



    //#region Events



    //#endregion


    return self;
};