const supplierPaymentRequestsViewModel = ({ } = {}) => {
    let self = {};

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable('Please Wait');

    self.filters = supplierPaymentRequestsFiltersViewModel({
        params: {},
        parent: self
    });

    //#endregion



    //#region Components

    self.gridDataSourceRead = (options) => {
        self.busy(true);

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {

        };

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        //data = Object.assign({
        //    status: self.orderStatusId() ?? null,
        //    fromDate: typeof self.fromDate() == 'object' ? self.fromDate().toUTCString() : self.fromDate(),
        //    toDate: typeof self.toDate() == 'object' ? self.toDate().toUTCString() : self.toDate(),
        //    dateRangeId: self.dateRangeId() ?? null
        //}, data);

        //if (self.searchTerm() && self.searchTerm().length) {
        //    data.searchTerm = self.searchTerm()
        //}

        console.log('gridDataSourceRead calling with', data);

        fetch('/api/SupplierPaymentRequestsAPI/GridRead?' + new URLSearchParams(data), {
            method: 'GET',
            headers: window.fetchHeaders
        })
            .then(window.handleFetchResponse)
            .then(data => {

                console.log('gridDataSourceRead returned', data);

                data.kendoResult.Data = data.kendoResult.Data.map(d => supplierPaymentRequestViewModel({
                    rec: d
                }))

                options.success(data.kendoResult);

                self.busy(false);

            })
            .catch(err => {
                options.error();
                window.catchFetchError(err);
            })
    }

    self.gridDataSource = new kendo.data.DataSource({
        sortable: true,
        filterable: true,
        grouping: true,
        serverGrouping: true,
        serverFiltering: true,
        serverPaging: true,
        pageSize: 10,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        transport: {
            read: self.gridDataSourceRead
        },
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "Aggregates",
            model: {
                id: 'PaymentRequestID',
                fields: {
                    PaymentRequestID: { type: 'number' },
                    PaymentRequestStatusID: { type: 'number' },
                    PaymentRequestStatus: {
                        type: 'object',
                        editable: false,
                        fields: [{
                            PaymentRequestStatusID: { type: 'number' },
                            Name: { type: 'string' }
                        }]
                    },
                    RequestedByMemberID: { type: 'number' },
                    RequestedByMember: {
                        RequestedByMemberID: { type: 'number' },
                        FullName: { type: 'string' },
                        Email: { type: 'string' }
                    },
                    CurrencyID: { type: 'number' },
                    Currency: {
                        type: 'object',
                        fields: [{
                            CurrencyID: { type: 'number' },
                            Code: { type: 'string' },
                            Name: { type: 'string' },
                            Symbol: { type: 'string' }
                        }]
                    },
                    SupplierCode: { type: 'string' },
                    Supplier: {
                        type: 'object',
                        editable: false,
                        fields: {
                            Code: { type: 'string', editable: false },
                            Name: { type: 'string', editable: false }
                        }
                    },
                    PurchaseOrderHeadIDs: { type: 'string' },
                    ProformaNumber: { type: 'string' },
                    AmountInCurrency: { type: 'number' },
                    AmountInSterling: { type: 'number' },
                    ExchangeRate: { type: 'number' },
                    Comments: { type: 'string' },
                    CreatedDT: { type: 'date' },
                    ModifiedDT: { type: 'date' },
                    DeletedDT: { type: 'date' },
                    Deleted: { type: 'boolran' },
                }
            }
        }),
        requestStart: (e) => {
            self.busy(true);
        },
        sort: {
            field: 'CreatedDT',
            dir: 'desc'
        },
        noDataTemplate: 'Nothing to display',
        requestEnd: (e) => {

            window.setTimeout(() => {
                document.addEventListener("click", (e) => {
                    if (e.target.closest('.purchase-orders-popover') == null) {
                        document.querySelectorAll('[data-bind*="actualBootstrapPopover"]').forEach(e => {
                            let p = bootstrap.Popover.getInstance(e);
                            if (p) {
                                p.hide();
                            }
                        });
                    }
                });
            }, 0);

            self.busy(false);
        },
    });

    self.gridParams = {
        autoBind: true,
        widget: ko.observable(),
        columns: [{
            field: 'PaymentRequestID',
            title: 'Payment Request ID',
            hidden: true
        }, {
            field: 'CreatedDT',
            title: 'Date Requested'
        }, {
            field: 'CurrencyID',
            title: 'Currency'
        }, {
            field: 'SupplierCode',
            title: 'Supplier'
        }, {
            field: 'PaymentRequestStatusID',
            title: 'Status'
        }, {
            field: 'RequestedByMemberID',
            title: 'Requested By'
        },  {
            field: 'PurchaseOrderHeadIDs',
            title: 'Purchase Order(s)'
        }, {
            field: 'ProformaNumber',
            title: 'Proforma Number'
        }, {
            field: 'AmountInCurrency',
            title: 'Amount (in Currency)',
        }, {
            field: 'Comments',
            title: 'Comments',
        }],
        data: self.gridDataSource,
        scrollable: false,
        sortable: true,
        filterable: true,
        reorderable: false,
        paging: true,
        pageSize: 10,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        selectable: false,
    };


    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds



    //#endregion



    //#region Subscriptions



    //#endregion



    //#region Methods



    //#endregion



    //#region Events



    //#endregion


    return self;
};