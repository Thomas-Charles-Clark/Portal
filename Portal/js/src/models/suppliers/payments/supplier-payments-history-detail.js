const supplierPaymentsHistoryDetailViewModel = ({
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
        batch: true,
        transport: {
            read: (options) => {

                let webapi = new kendo.data.transports.webapi({ prefix: "" });

                let mapped = webapi.parameterMap(options.data);

                let data = {}; // self.filters.toJS(); // Matt removed all parameters to this procedure 02/02/2026

                for (var propertyName in mapped) {
                    data[propertyName] = mapped[propertyName];
                }

                let qs = new URLSearchParams(data);

                fetch(`/api/SupplierPayments/HistoryDetailGridRead?${qs}`, {
                    method: 'GET',
                    headers: window.fetchHeaders,
                    cache: 'no-cache',
                    credentials: 'same-origin'
                })
                    .then(window.handleFetchResponse)
                    .then(data => {
                        options.success(data.kendoGridResult);
                    })
                    .catch(window.catchFetchError);
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
                id: 'PaymentDecisionID',
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
        field: 'Period',
        title: 'Period',
        attributes: {
            title: (e) => `PaymentDecisionID: ${e.PaymentDecisionID}`
        }
    }, {
        field: 'SupplierCode',
        title: 'Supplier',
        template: (e) => {
            return `${e.SupplierName} (${e.SupplierCode})`
        }
    }, {
        field: 'CurrencyCode',
        title: 'Currency',
        template: (e) => {
            return e.CurrencyCode;
        }
    }, {
        field: 'AmountInCurrency',
        title: 'Amount in Currency',
        width: 180,
        template: (e) => {
            return formatCurrency(e.AmountInCurrency, 2, e.FormattingCulture, e.CurrencyCode);
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
        field: 'RequestedBy',
        title: 'Requested By'
    }, {
        field: 'ApprovedBy',
        title: 'Approved By'
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