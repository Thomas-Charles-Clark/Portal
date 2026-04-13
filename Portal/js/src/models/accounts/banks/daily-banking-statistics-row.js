const dailyBankingStatisticsRowViewModel = ({
    row,
    columns,
    valueLookupFn,
    validateNow
} = {
    row: {},
    columns: [],
    valueLookupFn: () => { },
    validateNow: ko.observable(false)
}) => {
    let self = Object.assign(row, {
        columns,
        valueLookupFn
    });

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(true);

    self.busyMessage = ko.observable('Please Wait');

    self.cells = ko.observableArray(self.columns.map((column, index) => dailyBankingStatisticsCellViewModel({
        rec: self.valueLookupFn(self.RowID, column.ColumnID),
        row,
        column,
        validateNow
    })));

    self.cells().forEach(c => {
        c.value.subscribe(nv => {

        });
    });

    //#endregion



    //#region Components



    //#endregion



    //#region Computeds



    //#endregion



    //#region Subscriptions



    //#endregion



    //#region Methods

    self.init = () => {

    }

    self.template = (c) => {
        return self.cells().find(p => p.ColumnID == c.ColumnID).template();
    }

    //#endregion



    //#region Events



    //#endregion


    return self;
};