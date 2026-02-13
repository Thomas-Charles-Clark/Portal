const supplierPaymentsBudgetsViewModel = ({
    ready,
    busy,
    busyMessage,
    filters,
    refreshDashboard
} = {
        ready: ko.observable(false),
        busy: ko.observable(false),
        busyMessage: ko.observable('Please Wait'),
        filters: {},
        refreshDashboard: () => { }
    }) => {

    let self = {
        ready,
        busy: ko.observable(false),
        parentBusy: busy,
        busyMessage,
        filters,
        refreshDashboard
    };

    //#region Properties

    self.gridWidget = ko.observable();

    //#endregion



    //#region Components

    self.gridToolbar = ['create', 'save', 'cancel'];

    self.gridDataSource = new kendo.data.DataSource({
        sortable: true,
        filterable: true,
        grouping: true,
        serverGrouping: true,
        serverFiltering: true,
        serverPaging: true,
        page: 1,
        pageSize: 10,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        batch: true,
        type: "odata-v4",
        transport: {
            read: {
                url: '/odata/PaymentBudgets?$expand=Currency,PaymentPeriod($expand=FinalisedByMember)'
            },
            update: {
                url: function (item) { return `/odata/PaymentBudgets(${item.BudgetID})?$expand=Currency,PaymentPeriod($expand=FinalisedByMember)` }
            },
            batch: {
                url: '/odata/$batch?$expand=Currency,PaymentPeriod($expand=FinalisedByMember)'
            },
            create: {
                url: '/odata/PaymentBudgets?$expand=Currency,PaymentPeriod($expand=FinalisedByMember)'
            },
            destroy: {
                url: function (item) {
                    return `/odata/PaymentRequests(${item.BudgetID})?$expand=Currency,PaymentPeriod($expand=FinalisedByMember)`
                }
            },
            parameterMap: function (options, type) {

                console.log(type, options);

                var result = kendo.data.transports["odata-v4"].parameterMap(options, type);

                return result;
            }
        },
        error: (e) => {
            console.error(`budgetGrid error`, e);
        },
        schema: {
            error: 'error',
            model: {
                id: 'BudgetID',
                fields: {
                    BudgetID: {
                        type: 'number',
                        nullable: false,
                        editable: false
                    },
                    PeriodID: {
                        type: 'number',
                        nullable: false,
                        editable: true,
                        defaultValue: null,
                        validation: {
                            required: {
                                message: 'You must specify a Period'
                            }
                        }
                    },
                    CurrencyID: {
                        type: 'number',
                        nullable: true,
                        editable: true,
                        defaultValue: 1,
                        validation: {
                            required: {
                                message: 'You must specify a Currency'
                            }
                        }
                    },
                    Currency: {
                        type: 'object',
                        fields: {
                            CurrencyID: { type: "number", editable: false },
                            Name: { type: "string", editable: false }
                        }
                    },
                    Budget: {
                        type: 'number',
                        nullable: false,
                        editable: true,
                        defaultValue: null,
                        validation: {
                            required: {
                                message: 'You must specify a Budget'
                            },
                            budgetvalidation: function (input) {
                                if (input.is("[name='Budget']") && (+input.val() < 0 || input.val() == "")) {
                                    input.attr("data-budgetvalidation-msg", "You must specify an amount");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    PaymentPeriod: {
                        type: 'object',
                        fields: [{
                            PeriodID: { type: 'number', editable: false },
                            Label: { type: 'string', editable: false },
                            WeekCommencingDate: { type: 'datetime', editable: false }
                        }]
                    },
                    CreatedDT: {
                        type: 'date',
                        format: 'dd/MM/yyyy HH:mm',
                        defaultValue: new Date(),
                        editable: false,
                    }
                }
            }
        },
        errors: function (e) {
            console.error(`budgetGrid errors`, e);

            // e.xhr contains the full response from the server
            var response = JSON.parse(e.xhr.responseText);

            var message = JSON.stringify(response.error, null, '\t');

            self.busy(false);

            window.showInfo('Errors', PR.prettyPrintOne(message));

            // Revert changes in the grid if necessary
            self.gridWidget().cancelChanges();
        },
        requestStart: (e) => {
            //self.busy(true);
            console.log(`budgetGrid requestStart`, e);

            if (e.type != 'submit') {
                if (e.sender.hasChanges()) {
                    e.preventDefault();
                    self.busy(false);
                    console.log('budgetGrid showing unsavedChanges info');
                    window.showInfo('Unsaved Changes', 'You have unsaved changes. Please cancel or save them before performing any other action.');
                }
            }

            // Avoid extraneous call to fetchDashboard if ready == false; the call is made when building 
            // the server-side viewModel.
            if (self.ready()) {
                self.refreshDashboard();
            }
        },
        sort: {
            field: 'PeriodID',
            dir: 'asc'
        },
        noDataTemplate: 'Nothing to display',
        change: (e) => {
            console.log(`budgetGrid change`, e);
        },
        requestEnd: (e) => {
            console.log(`budgetGrid requestEnd`, e);

            self.busy(false);
        }
    });

    self.gridColumns = [{
        field: 'BudgetID',
        title: 'Budget ID',
        hidden: true
    }, {
        field: 'PeriodID',
        title: 'Period',
        width: 280,
        attributes: {
            "class": "dropdown-container-cell"
        },
        editor: (container, options) => {
            (options.model.PaymentPeriod && options.model.PaymentPeriod.Finalised)
                ? $(`<span>${options.model.PaymentPeriod.Label}</span>`).appendTo(container)
                : $(`<input type="text" required name="${options.field}" data-bind="value: ${options.field}" validationMessage="You must specify a Period" />`)
                    .appendTo(container)
                    .kendoDropDownList({
                        dataTextField: '#: Label #',
                        dataValueField: 'PeriodID',
                        valuePrimitive: false,
                        value: options.model.PeriodID,
                        autoWidth: true,
                        autoBind: true,
                        filter: 'startswith',
                        template: (e) => {
                            if (e.Label) {
                                return e.Label;
                            } else {
                                return ''
                            }
                        },
                        valueTemplate: (e) => {
                            if (e.Label) {
                                return e.Label;
                            } else {
                                return ''
                            }
                        },
                        dataSource: new kendo.data.DataSource({
                            type: 'odata-v4',
                            serverFiltering: true,
                            serverSorting: true,
                            serverPaging: true,
                            sort: [{
                                field: "PeriodID", dir: "asc"
                            }],
                            page: 1,
                            pageSize: 10,
                            transport: {
                                read: '/odata/PaymentPeriods',
                                parameterMap: (data, operation) => {

                                    let filters = [];

                                    let apply = [];

                                    filters.push({
                                        field: 'Finalised',
                                        operator: 'eq',
                                        value: false
                                    });

                                    if (options.model.PeriodID) {
                                        apply.push(`(PeriodID eq ${options.model.PeriodID})`)
                                    }

                                    if (options.model.CurrencyID) {
                                        apply.push(`(PaymentBudgets/all(b: b/CurrencyID ne ${options.model.CurrencyID}))`);
                                    } //DistributionSetDetails/all(d: d/DistributionCode eq 'VISA')

                                    if (data.filter && data.filter.filters.length) {

                                        data.filter.filters.forEach(f => {
                                            filters.push(f);
                                        });
                                    }

                                    //Generate parameters in odata v4 format
                                    let d = kendo.data.transports['odata-v4'].parameterMap(data);

                                    if (apply.length) {
                                        d.$apply = `filter(${apply.join(' or ')})`
                                    }

                                    delete d.$inlinecount; // <-- remove inlinecount
                                    delete d.$format; // <-- remove format
                                    delete d.$callback; // <-- remove callback

                                    d.$count = true;

                                    return d;

                                }
                            }
                        }),
                        dataBound: function (e) {
                            console.log('budget periodId dropDownList dataBound', e);
                        },
                        change: (e) => {
                            let dataItem = e.sender.dataItem();

                            console.log('change', e, dataItem);

                            if (dataItem && dataItem.PeriodID) {
                                options.model.set('PeriodID', dataItem.PeriodID);
                            } else {
                                options.model.set('PeriodID', null);
                            }

                            window.setTimeout(() => {
                                document.querySelector('td[data-container-for="Budget"] .k-numerictextbox input:first-of-type').focus();
                            }, 0);
                        },
                        height: 340
            });
        },
        template: (e) => {
            if (e.PaymentPeriod && e.PaymentPeriod.Label) {
                return e.PaymentPeriod.Label;
            } else {
                return '';
            }
        },
        valueTemplate: (e) => {
            if (e.PaymentPeriod && e.PaymentPeriod.Label) {
                return e.PaymentPeriod.Label;
            } else {
                return '';
            }
        },
    }, {
        field: 'CurrencyID',
        title: 'Currency',
        template: (e) => {
            if (e.Currency && e.Currency.Code) {
                return `${e.Currency.Name} (${e.Currency.Symbol})`;
            } else {
                return '';
            }
        },
        valueTemplate: (e) => {
            if (e.Currency && e.Currency.Code) {
                return `${e.Currency.Name} (${e.Currency.Symbol})`;
            } else {
                return '';
            }
        },
        editor: (container, options) => {
            (options.model.PaymentPeriod && options.model.PaymentPeriod.Finalised)
                ? $(`<span>${options.model.Currency.Name} - (${options.model.Currency.Symbol})</span>`)
                : $(`<input type="text" required name="${options.field}" validationMessage="You must specify a Currency" />`)
                .appendTo(container)
                .kendoDropDownList({
                    dataTextField: '#: Name # (#: Symbol #)',
                    dataValueField: 'CurrencyID',
                    value: options.model.CurrencyID,
                    autoWidth: true,
                    filter: 'startswith',
                    template: (e) => {
                        if (e.CurrencyID) {
                            return `${e.Name} (${e.Symbol})`;
                        } else {
                            return '';
                        }
                    },
                    valueTemplate: (e) => {
                        if (e.CurrencyID) {
                            return `${e.Name} (${e.Symbol})`;
                        } else {
                            return '';
                        }
                    },
                    dataSource: new kendo.data.DataSource({
                        type: 'odata-v4',
                        serverFiltering: true,
                        serverSorting: true,
                        serverPaging: true,
                        sort: [{
                            field: "CurrencyID", dir: "asc"
                        }],
                        page: 1,
                        pageSize: 10,
                        transport: {
                            read: '/odata/Currencies',
                            parameterMap: (data, operation) => {

                                //Generate parameters in odata v4 format
                                let d = kendo.data.transports['odata-v4'].parameterMap(data);

                                delete d.$inlinecount; // <-- remove inlinecount
                                delete d.$format; // <-- remove format
                                delete d.$callback; // <-- remove callback

                                d.$count = true;

                                return d;

                            }
                        }
                    }),
                    dataBound: function (e) {
                        if (this.select() === -1) {
                            this.select(0);
                            this.trigger("change");
                        }
                    },
                    change: (e) => {
                        let dataItem = e.sender.dataItem();
                        console.log('budgetGrid Currency change', e, dataItem);

                        let period = $(e.sender.element.closest('tr').find('input[name="PeriodID"]')).data('kendo-drop-down-list');

                        period.dataSource.query({});

                        //dataItem.set('CurrencyID', dataItem.Currency);
                        //dataItem.set('Currency', dataItem.Currency);
                    },
                    height: 340
                });
        }
    }, {
        field: 'Budget',
        title: 'Budget',
        template: function (item) {
            if (item.Currency) {
                return formatCurrency(item.Budget, 2, item.Currency.FormattingCulture, item.Currency.Code)
            } else {
                return '';
            }
        },
        editor: (container, options) => {
            $('<input data-bind="value:' + options.field + '" name="' + options.field + '"/>')
                .appendTo(container)
                .kendoNumericTextBox({
                    format: "n2",
                    decimals: 2,
                    selectOnFocus: true,
                    change: (e) => {
                        console.log('budgetGrid Budget change', e);
                        window.setTimeout(() => {
                            document.querySelector('.budget-grid .k-grid-save-changes').focus();
                        }, 0);
                    }
                });
        }
    }, {
        field: 'FinalisedDT',
        title: 'Finalised',
        editable: false,
        template: (e) => {
            if (e.PaymentPeriod?.FinalisedDT != null) {
                return `${moment(e.PaymentPeriod?.FinalisedDT).format("dddd DD/MM/YYYY HH:mm")} by <a href="mailto:${e.PaymentPeriod?.FinalisedByMember?.Email}" class="mailto-link">${e.PaymentPeriod?.FinalisedByMember?.FullName}</a>`
            } else {
                return '';
            }
        },
        editor: (e) => {
            if (e.PaymentPeriod?.FinalisedDT != null) {
                return `${moment(e.PaymentPeriod?.FinalisedDT).format("dddd DD/MM/YYYY HH:mm")} by <a href="mailto:${e.PaymentPeriod?.FinalisedByMember?.Email}" class="mailto-link">${e.PaymentPeriod?.FinalisedByMember?.FullName}</a>`
            } else {
                return '';
            }
        }
    }, {
        command: [{
            name: 'edit',
            visible: (e) => {
                return e.PaymentPeriod?.Finalised === false;
            }
        }]
    }];

    self.gridParams = {
        autoBind: true,
        widget: self.gridWidget,
        columns: self.gridColumns,
        data: self.gridDataSource,
        toolbar: self.gridToolbar,
        scrollable: false,
        sortable: true,
        filterable: true,
        reorderable: false,
        paging: true,
        pageSize: 20,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        selectable: false,
        editable: {
            mode: 'inline'
        },
        edit: function (e) {
            console.log(`budgetGrid edit`, e);
        },
        change: (e) => {
            console.log(`budgetGrid change`, e);
        },
        dataBound: (e) => {
            console.log('budget grid dataBound', e);

            const currentPeriodString = moment(new Date()).weekdayWithStartWeekday(0, 1).format('YYYYMMDD');

            let rows = e.sender.tbody.children();

            for (let i = 0; i < rows.length; i++) {

                let row = $(rows[i]);

                let dataItem = e.sender.dataItem(row);

                if (dataItem.PeriodID?.toString() == currentPeriodString) {
                    row.addClass("current-period-row");
                };
            }

            self.refreshDashboard();
        },
        save: (e) => {
            console.log(`budgetGrid save`, e);
        },
        saveChanges: (e) => {
            console.log(`budgetGrid saveChanges`, e);
        }
    }

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds



    //#endregion



    //#region Subscriptions



    //#endregion



    //#region Methods

    self.refresh = () => {
        self.gridWidget().dataSource.query({
            page: self.gridWidget().dataSource.page(),
            pageSize: self.gridWidget().dataSource.pageSize(),
            filter: self.gridWidget().dataSource.filter(),
            sort: self.gridWidget().dataSource.sort()
        });
    }

    //#endregion



    //#region Events



    //#endregion


    return self;
};