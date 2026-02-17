const supplierPaymentsSuppliersViewModel = ({
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
        busy,
        parentBusy: busy,
        busyMessage,
        filters,
        refreshDashboard
    };

    //#region Properties

    self.gridWidget = ko.observable();

    //#endregion



    //#region Components

    self.gridDataSource = new kendo.data.DataSource({
        sortable: true,
        filterable: true,
        grouping: true,
        serverGrouping: true,
        serverFiltering: true,
        serverPaging: true,
        pageSize: 20,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        sort: {
            field: 'SortOrder',
            dir: 'desc'
        },
        batch: true,
        transport: {
            read: (options) => {

                self.busy(true);

                let webapi = new kendo.data.transports.webapi({ prefix: "" });

                let mapped = webapi.parameterMap(options.data);

                let data = self.filters.supplierFilters();

                for (var propertyName in mapped) {
                    data[propertyName] = mapped[propertyName];
                }

                let qs = new URLSearchParams(data);

                fetch(`/api/SupplierPayments/SuppliersGridRead?${qs}`, {
                    method: 'GET',
                    headers: window.fetchHeaders,
                    cache: 'no-cache',
                    credentials: 'same-origin'
                })
                    .then(window.handleFetchResponse)
                    .then(data => {
                        options.success(data.kendoGridResult);
                        self.busy(false);
                    })
                    .catch(err => {
                        self.busy(false);
                        window.catchFetchError(err);
                    });
            }
        },
        error: (e) => {
            console.error(`error`, e);
        },
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            filters: "Filters",
            aggregates: "Aggregates",
            errors: "Errors",
            model: {
                id: 'SupplierCode',
                fields: {
                    PaymentDecisionID: {
                        type: 'number'
                    },
                    PeriodID: {
                        type: 'number'
                    },
                    Label: {
                        type: 'string',
                    },
                    SupplierCode: {
                        type: 'string'
                    },
                    SupplierName: {
                        type: 'string'
                    },
                    CurrencyCode: {
                        type: 'string'
                    },
                    FormattingCulture: {
                        type: 'string'
                    },
                    AmountInCurrency: {
                        type: 'number',
                        nullable: false
                    },
                    FinalisedDT: {
                        type: 'date',
                        nullable: true
                    },
                    RequestedBy: {
                        type: 'string',
                        nullable: true
                    },
                    ApprovedBy: {
                        type: 'string',
                        nullable: true
                    }, 
                    PayOnDate: {
                        type: 'date',
                        editable: false
                    }
                }
            }
        }),
        errors: function (e) {
            console.error(`errors`, e);

            // e.xhr contains the full response from the server
            var response = JSON.parse(e.xhr.responseText);

            var message = JSON.stringify(response.error, null, '\t');

            self.busy(false);

            window.showInfo('Errors', PR.prettyPrintOne(message));

            // Revert changes in the grid if necessary
            self.gridWidget().cancelChanges();
        },
        requestStart: (e) => {
            self.busy(true);

            console.log(`requestStart`, e);

            if (self.ready()) {
                self.refreshDashboard();
            }
        },
        noDataTemplate: 'Nothing to display',
        requestEnd: (e) => {

            console.log(`requestEnd`, e);

            self.busy(false);
        }
    });

    self.gridColumns = [{
        field: 'SupplierCode',
        title: 'Supplier Code'
    }, {
        field: 'SupplierName',
        title: 'Supplier Name'
    }, {
        field: 'SupplierType',
        title: 'Supplier Type',
    }, {
        field: 'BudgetHolder',
        title: 'Budget Holder',
    }, {
        field: 'ProductionStopped',
        title: 'Production',
        attributes: (dataItem) => {
            if (dataItem.ProductionStopped) {
                return {
                    "class": "text-center bg-white"
                };
            } else {
                return {
                    "class": ""
                }
            }
        },
        width: 126,
        template: (dataItem) => {
            if (dataItem.ProductionStopped) {
                return `<i class="bi bi-sign-stop-fill fs-2 text-red-600"></i>`;
            } else {
                return ``;
            }
        }
    }, {
        field: 'ShippingStopped',
        title: 'Shipping',
        attributes: (dataItem) => {
            if (dataItem.ShippingStopped) {
                return {
                    "class": "text-center bg-white"
                };
            } else {
                return {
                    "class": ""
                }
            }
        },
        width: 126,
        template: (dataItem) => {
            if (dataItem.ShippingStopped) {
                return `<i class="bi bi-sign-stop-fill fs-2 text-red-600"></i>`;
            } else {
                return ``;
            }
        }
    }, {
        field: 'FinalisedDT',
        title: 'Finalised',
        width: 180,
        template: (e) => {
            if (e.FinalisedDT) {
                return moment(e.FinalisedDT).format('dddd DD/MM/YYYY');
            } else {
                return '';
            }
        }
    }, {
        field: 'SupplierCurrencyCode',
        title: 'Currency'
    }, {
        field: 'TotalValue',
        title: 'Total',
        width: 120,
        template: (e) => {
            if (e.TotalValue != null) {
                return formatCurrency(e.TotalValue, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
            } else {
                return '';
            }
        }
    }, {
        field: 'NotDueTotalValue',
        title: 'Not Due',
        width: 120,
        template: (e) => {
            if (e.TotalValue != null) {
                return formatCurrency(e.NotDueTotalValue, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
            } else {
                return '';
            }
        }
    }, {
        field: 'OverdueTotalValue',
        title: 'Overdue',
        width: 120,
        template: (e) => {
            if (e.OverdueTotalValue != null) {
                return formatCurrency(e.OverdueTotalValue, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
            } else {
                return '';
            }
        }
    }, {
        field: 'Debt30DayValue',
        title: '30 day',
        width: 120,
        template: (e) => {
            if (e.Debt30DayValue != null) {
                return formatCurrency(e.Debt30DayValue, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
            } else {
                return '';
            }
        }
    }, {
        field: 'Debt60DayValue',
        title: '60 day',
        width: 120,
        template: (e) => {
            if (e.Debt60DayValue != null) {
                return formatCurrency(e.Debt60DayValue, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
            } else {
                return '';
            }
        }
    }, {
        field: 'Debt90DayValue',
        title: '90 day',
        width: 120,
        template: (e) => {
            if (e.Debt90DayValue != null) {
                return formatCurrency(e.Debt90DayValue, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
            } else {
                return '';
            }
        }
    }, {
        field: 'Debt120DayValue',
        title: '120 day',
        width: 120,
        template: (e) => {
            if (e.Debt120DayValue != null) {
                return formatCurrency(e.Debt120DayValue, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
            } else {
                return '';
            }
        }
    }];

    self.gridParams = {
        autoBind: true,
        widget: self.gridWidget,
        columns: self.gridColumns,
        data: self.gridDataSource,
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
        editable: false,
        edit: function (e) {
            console.log(`edit`, e);
        },
        change: (e) => {
            console.log(`change`, e);
        },
        dataBound: (e) => {
            console.log(`dataBound`, e);
        },
        save: (data) => {
            console.log(`saveChanges`, e);
        },
        saveChanges: (e) => {
            console.log(`saveChanges`, e);
        },
        excelExport: (e) => {
            let now = new Date();

            e.workbook.fileName = `Payment-Supplier-Details_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.xlsx`;

            self.busy(false);
        }
    }

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds



    //#endregion



    //#region Subscriptions

    self.filters.supplierFilters.subscribe(nv => {
        self.refresh();
    })

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

    self.exportToExcel = () => {
        self.busy(true);
        self.gridWidget().saveAsExcel();
    }

    //#endregion



    //#region Events



    //#endregion


    return self;
};