const supplierPaymentApprovalsViewModel = ({ } = {}) => {
    let self = {};

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable('Please Wait');

    self.weekCommencingOverride = ko.observable();

    self.dashboard = ko.observable(window.getDashboard());

    self.filters = supplierPaymentApprovalsFiltersViewModel({
        params: {},
        parent: self
    });

    self.basket = supplierPaymentApprovalsBasketViewModel({
        rec: {}
    });

    self.paymentPlanGridWidget = ko.observable();

    self.otherPaymentRequestStatusesGridWidget = ko.observable();

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
            read: {
                url: '/api/SupplierPaymentApprovals/DashboardSelect'
            },
            parameterMap: function (options, type) {

                console.log(type, options);

                var result = kendo.data.transports["webapi"].parameterMap(options, type);

                return result;
            }
        },
        error: (e) => {
            console.error(`error`, e);
        },
        schema: {
            error: 'error',
            model: {
                id: 'SupplierCode',
                fields: {
                    SupplierCode: {
                        type: 'string',
                        format: 'dd/MM/yyyy'
                    },
                    SupplierName: {
                        type: 'string'
                    },
                    SupplierCurrencyCode: {
                        type: 'string',
                    },
                    PaymentRequestPaymentPlanTotal: {
                        type: 'number',
                        nullable: true
                    },
                    PaymentRequestOtherTotal: {
                        type: 'number',
                        nullable: true
                    },
                    TotalValueGBP: {
                        type: 'number',
                        nullable: false
                    },
                    TotalValue: {
                        type: 'number',
                        nullable: false
                    },
                    NotDueTotalValue: {
                        type: 'number',
                        nullable: false
                    },
                    OverdueTotalValue: {
                        type: 'number',
                        nullable: false
                    },
                    Debt30DayTotal: {
                        type: 'number',
                        nullable: false
                    },
                    Debt60DayTotal: {
                        type: 'number',
                        nullable: false
                    },
                    Debt90DayTotal: {
                        type: 'number',
                        nullable: false
                    },
                    Debt120DayTotal: {
                        type: 'number',
                        nullable: false
                    },
                    Details: {
                        hidden: true,
                        type: 'object',
                        fields: [{
                            SupplierCode: { type: 'string' },
                            FundingID: { type: 'number' },
                            WeekCommencing: { type: 'date' },
                            AvailableForApprovalInSterling: { type: 'number' },
                            TargetSpendInSterling: { type: 'number' },
                            SpentInSterling: { type: 'number' },
                            RemainingInSterling: { type: 'number' }
                        }]
                    }
                }
            }
        },
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
            //self.busy(true);

            console.log(`requestStart`, e);

            if (self.ready()) {
                self.refreshDashboard();
            }
        },
        sort: {
            field: 'CreatedDT',
            dir: 'desc'
        },
        noDataTemplate: 'Nothing to display',
        requestEnd: (e) => {

            console.log(`requestEnd`, e);

            //self.busy(false);
        }
    });


    self.gridColumns = [{
        field: 'SupplierCode',
        title: 'Supplier'
    }, {
        field: 'SupplierName',
        title: 'Supplier Name'
    }, {
        field: 'SupplierCurrencyCode',
        title: 'Supplier Code'
    }];

    self.gridParams = {
        autoBind: true,
        widget: ko.observable(),
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

            let selectedRows = e.sender.select();

            let dataItems = [];

            for (let i = 0; i < selectedRows.length; i++) {
                let r = selectedRows[i];
                dataItems.push(e.sender.dataItem(r));
            }

            self.basket.items(self.basket.items().concat(dataItems.map(r => supplierPaymentApprovalViewModel({
                rec: r
            }))));
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

    self.refreshDashboard = () => {
        self.busy(true);
        fetch('/api/SupplierPaymentRequests/DashboardSelect', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify({
                weekCommencingOverride: self.weekCommencingOverride()
            })
        }).then(window.handleFetchResponse)
            .then(data => {
                self.dashboard(data);
                self.busy(false);
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
    }

    //#endregion



    //#region Events



    //#endregion


    return self;
};