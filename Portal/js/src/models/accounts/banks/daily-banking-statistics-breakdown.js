const dailyBankingStatisticsBreakdownViewModel = ({
    gridColumns
} = {
    gridColumns: ko.observableArray([])
}) => {
    let self = {
        gridColumns
    };

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable('Please Wait');

    self.validateNow = ko.observable(false);

    self.modalElement = document.querySelector('#breakdown-modal');

    self.modal = bootstrap.Modal.getOrCreateInstance(self.modalElement);

    self.breakingDown = ko.observable();

    self.breakdownEntries = ko.observableArray([]);

    //#endregion



    //#region Components

    self.errors = ko.validation.group(self.breakdownEntries, {
        live: true,
        deep: true
    });

    //#endregion



    //#region Computeds

    self.remainingToAllocate = ko.computed(() => {

        let item = self.breakingDown();

        if (item) {
            let total = item.value();

            let sum = self.breakdownEntries().reduce((a, i) => a += isNaN(ko.unwrap(i.value)) ? 0 : ko.unwrap(i.value), 0);

            return (Math.round((total - sum) * 100) / 100);
        } else {
            return 0;
        }

    }, self);

    self.remainingToAllocateDisplay = ko.computed(() => {
        let remainder = self.remainingToAllocate();

        let item = self.breakingDown();

        if (remainder) {
            return `Remaining to Allocate: ${formatCurrency(remainder, 2, item.row.FormattingCulture, item.row.CurrencyCode)}`;
        } else {
            return ``;
        }
    }, self);

    self.availableLabels = ko.computed(() => {
        let columns = self.gridColumns();
        let labels = columns.filter(x => x.index >= 2).flatMap(m => {
            return m.columns.flatMap(c => {
                return {
                    group: m.title,
                    name: `${m.title} - ${c.title}`,
                    value: c.title
                }
            });
        });
        return labels;
    });

    //#endregion



    //#region Subscriptions



    //#endregion



    //#region Methods

    self.loadAndShow = (cell) => {
        self.breakingDown(cell);
        self.breakdownEntries(JSON.parse(cell.Breakdown ?? '[]').map(p => dailyBankingStatisticsBreakdownItemViewModel({
            rec: Object.assign(cell.row, p),
            validateNow: self.validateNow,
            labels: self.availableLabels
        })));
        if (self.breakdownEntries().length == 0) {
            self.addBreakdownEntry();
        }
        self.modal.show();
    }

    self.addBreakdownEntry = () => {
        let row = self.breakingDown().row;

        //row.label = row.Label;
        //delete row.Label;

        self.breakdownEntries.push(dailyBankingStatisticsBreakdownItemViewModel({
            rec: row,
            validateNow: self.validateNow,
            labels: self.availableLabels
        }));
    }

    self.removeBreakdownEntry = (item) => {
        self.breakdownEntries.remove(item);
    }

    self.saveBreakdown = () => {
        let cell = ko.unwrap(self.breakingDown);

        self.errors.showAllMessages(false);

        self.validateNow(true); 

        window.setTimeout(() => {
            if (self.errors().length) {
                self.errors.forEach(x => {
                    x.isValid.notifySubscribers(x.isValid());
                })
            } else {

                self.busy(true);

                let data = {
                    date: viewModel.date().toUTCString(),
                    records: [{
                            rowId: cell.RowID,
                            columnId: 1,
                            value: cell.value(),
                            breakdownJson: null
                        }, {
                            rowId: cell.RowID,
                            columnId: cell.ColumnID,
                            value: null,
                            breakdownJson: JSON.stringify(self.breakdownEntries().map(b => {
                                return {
                                    UniVerseAccount: b.uniVerseAccountId(),
                                    Label: b.labelId(),
                                    Value: b.value(),
                                    TradeAccountCode: b.tradeAccountCode() ? b.tradeAccountCode() : null,
                                    OrderID: b.orderId() ? b.orderId() : null,
                                    InvoiceID: b.invoiceId() ? b.invoiceId() : null
                                }
                            }))
                    }]
                }

                console.log('saveChanges calling with', data);

                fetch('/api/DailyBankingStatisticsAPI/SaveChanges', {
                    method: 'POST',
                    headers: window.fetchHeaders,
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    body: JSON.stringify(data)
                })
                    .then(window.handleFetchResponse)
                    .then(data => {
                        self.modal.hide();
                        self.breakingDown().originalValue(self.breakingDown().value());
                        window.setTimeout(() => {
                            viewModel.reload();
                            self.busy(false);
                        }, 0);
                    })
                    .catch(err => {
                        self.busy(false)
                        window.catchFetchError(err);
                    })
            }
        }, 0);
    }

    //#endregion



    //#region Events

    self.modalElement.addEventListener('shown.bs.modal', () => {
        //// doesn't work, not sure we'd want it to if it did
        window.setTimeout(() => {
            self.breakdownEntries()[0].value.mdcTextField.input_.focus();
        }, 0);
    })

    //#endregion


    return self;
};