const dailyBankingStatisticsRowViewModel = ({
    row,
    columns,
    valueLookupFn
} = {
        row: {},
        columns: [],
        valueLookupFn: () => { }
    }) => {
    let self = Object.assign(row, {
        columns,
        valueLookupFn
    });

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(true);

    self.busyMessage = ko.observable('Please Wait');

    self.firstTwoIndices = [0, 1];

    self.statementValue = ko.observable(self.valueLookupFn(self.RowID, 1).Value).extend({
        currencyFormatted: {
            digits: self.FormattingDigits ?? 2,
            currency: {
                FormattingCulture: self.FormattingCulture ?? 'en-GB',
                Code: self.CurrencyCode ?? 'GBP',
            }
        }
    })

    self.originalStatementValue = ko.observable(self.statementValue());

    self.cells = ko.observableArray(self.columns.map((column, index) => {
        return dailyBankingStatisticsCellViewModel({
            rec: self.valueLookupFn(self.RowID, column.ColumnID),
            row,
            column,
            statementValue: self.firstTwoIndices.indexOf(index) > -1 ? self.statementValue : null,
            originalStatementValue: self.firstTwoIndices.indexOf(index) > -1 ? self.originalStatementValue : null
        })
    }));

    //self.cells().forEach(c => {
    //    c.value.subscribe(nv => {

    //    });
    //});

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

    self.template = (heading, sortOrder) => {
        let result = self.cells()?.find(c => c.column.Label == heading && c.column.SortOrder == sortOrder)?.template();
        return result;
    }

    //#endregion



    //#region Events



    //#endregion


    return self;
};