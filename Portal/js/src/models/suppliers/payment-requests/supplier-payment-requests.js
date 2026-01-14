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

    self.isGridEditing = ko.observable(false);

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

    self.gridDataSourceUpdate = (options) => {
        self.busy(true);

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {

        };

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        console.log('gridDataSourceUpdate calling with', data);

        fetch('/api/SupplierPaymentRequestsAPI/GridUpdate', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(params)
        })
            .then(window.handleFetchResponse)
            .then(data => {

                console.log('gridDataSourceUpdate returned', data);

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

    self.gridDataSourceCreate = (options) => {
        self.busy(true);

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {

        };

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        console.log('gridDataSourceCreate calling with', data);

        fetch('/api/SupplierPaymentRequestsAPI/GridCreate', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(params)
        })
            .then(window.handleFetchResponse)
            .then(data => {

                console.log('gridDataSourceCreate returned', data);

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
        batch: true,
        type: "odata-v4",
        content: 'json',
        transport: {
            read: {
                url: '/odata/PaymentRequests'
            },//self.gridDataSourceRead,
            update: {
                url: function (item) {
                    return `/odata/PaymentRequests(${item.PaymentRequestID})`
                }
            },//self.gridDataSourceUpdate,
            batch: {
                url: function () {
                    return '/odata/$batch'
                }
            },
            create: {
                url: function (item) {
                    delete item.PaymentRequestID;
                    return `/odata/PaymentRequests`
                }
            },
            destroy: {
                url: function (item) {
                    return `/odata/PaymentRequests(${item.PaymentRequestID})`
                }
            }
            //self.gridDataSourceCreate,
            //parameterMap: function (data, type) {

            //    console.log("gridDataSource parameterMap called with", data, type);

            //    var result = kendo.data.transports["webapi"].parameterMap(data, type);

            //    if (type === "update") {
            //        if (data.Value == "")
            //            data.Value = null;
            //        console.log('updating', data);
            //        self.gridSettings.widget().one("dataBound", function (e) {
            //            self.gridSettings.widget().dataSource.read();
            //        });
            //    }

            //    //if (result.$filter) {
            //    //    result.$filter = result.$filter.replace('datetime', 'datetimeoffset');
            //    //}

            //    return result;
            //}
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
                    PaymentRequestStatusID: {
                        type: 'number',
                        nullable: true,
                        validation: {
                            required: {
                                message: 'You must specify a Status'
                            }
                        }
                    },
                    PaymentRequestStatus: {
                        type: 'object',
                        fields: [{
                            PaymentRequestStatusID: { type: 'number' },
                            Name: { type: 'string' }
                        }]
                    },
                    RequestedByMemberID: {
                        type: 'number',
                        nullable: true,
                        editable: false
                    },
                    RequestedByMember: {
                        RequestedByMemberID: { type: 'number' },
                        FullName: { type: 'string' },
                        Email: { type: 'string' }
                    },
                    CurrencyID: {
                        type: 'number',
                        nullable: true,
                        validation: {
                            required: {
                                message: 'You must specify a Currency'
                            }
                        }
                    },
                    Currency: {
                        type: 'object',
                        fields: [{
                            CurrencyID: { type: 'number' },
                            Code: { type: 'string' },
                            Name: { type: 'string' },
                            Symbol: { type: 'string' }
                        }]
                    },
                    SupplierCode: {
                        type: 'string',
                        nullable: false,
                        validation: {
                            required: {
                                message: 'You must specify a Supplier'
                            }
                        }
                    },
                    Supplier: {
                        type: 'object',
                        fields: {
                            Code: { type: 'string', editable: false },
                            Name: { type: 'string', editable: false }
                        }
                    },
                    PurchaseOrderHeadIDs: { type: 'string' },
                    ProformaNumber: { type: 'string' },
                    AmountInCurrency: {
                        type: 'number',
                        nullable: true,
                        required: {
                            message: 'You must specify an Amount'
                        }
                    },
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

    self.gridToolbar = ['create', 'save', 'cancel'];

    self.gridColumns = [{
        field: 'PaymentRequestID',
        title: 'Payment Request ID',
        hidden: true
    }, {
        field: 'CreatedDT',
        title: 'Date Requested',
        template: (e) => {
            if (e.CreatedDT) {
                return moment(e.CreatedDT).format('DD/MM/YYYY')
            }
        }
    }, {
        field: 'CurrencyID',
        title: 'Currency',
        width: 220,
        attributes: {
            "class": "dropdown-container-cell"
        },
        template: (e) => {
            if (e.CurrencyID) {
                return `${e.Currency.Name} (${e.Currency.Symbol})`;
            } else {
                return '';
            }
        },
        editor: (container, options) => {
            $(`<input type="text" required name='${options.field}' validationMessage="You must specify a Currency" />`)
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: true,
                    autoWidth: true,
                    value: options.model.CurrencyID,
                    dataTextField: 'Name',
                    dataValueField: 'CurrencyID',
                    dataSource: new kendo.data.DataSource({
                        type: 'odata-v4',
                        sort: {
                            field: "Name", dir: "asc"
                        },
                        transport: {
                            read: '/odata/Currencies'
                        }
                    }),
                    change: (e) => {
                        let dataItem = e.sender.dataItem();
                        options.model.set('CurrencyID', dataItem.CurrencyID);
                        options.model.set('Currency', dataItem);
                    },
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
                    }
                });
        }
    }, {
        field: 'SupplierCode',
        title: 'Supplier',
        width: 280,
        attributes: { 
            "class": "dropdown-container-cell"
        },
        editor: (container, options) => {
            $(`<input type="text" required name="${options.field}" validationMessage="You must specify a Supplier" />`)
                .appendTo(container)
                .kendoDropDownList({
                    dataTextField: 'Name',
                    dataValueField: 'Code',
                    value: options.model.SupplierCode,
                    autoWidth: true,
                    filter: 'startswith',
                    template: (e) => {
                        if (e.Code && e.Name) {
                            return `${e.Code} - ${e.Name}`
                        } else {
                            return `${e.Code} - [UNNAMED]`
                        }
                    },
                    valueTemplate: (e) => {
                        if (e.Code && e.Name) {
                            return `${e.Code} - ${e.Name}`
                        } else {
                            return `${e.Code} - [UNNAMED]`
                        }
                    },
                    dataSource: new kendo.data.DataSource({
                        type: 'odata-v4',
                        serverFiltering: true,
                        serverSorting: true,
                        serverGrouping: false,
                        sort: {
                            field: "Name", dir: "asc"
                        },
                        transport: {
                            read: '/odata/MertexLiveSuppliers',
                            parameterMap: (data, operation) => {

                                //Generate parameters in odata v4 format
                                let d = kendo.data.transports['odata-v4'].parameterMap(data);

                                delete d.$inlinecount; // <-- remove inlinecount
                                delete d.$format; // <-- remove format
                                delete d.$callback; // <-- remove callback

                                d.$count = true;

                                let filters = [];

                                if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "Name")) {
                                    let f = data.filter.filters.find(f => f.field === "Name");
                                    filters.push(`(contains(Name,'${f.value}') or startswith(tolower(Code),'${f.value}'))`);
                                }

                                if (filters.length) {
                                    let filterString = filters.join(' and ');
                                    d.$apply = `filter(${filterString})`;
                                }

                                // evidently .$filter is taking precedence over .$apply, and I prefer apply, so...
                                if (d.$filter) {
                                    delete d.$filter;
                                }

                                if (!d.$apply) {
                                    delete d.$apply;
                                } else {
                                    //console.log(d.$apply);
                                }

                                return d;

                            }
                        }
                    }),
                    height: 340,
                    virtual: true,
                    virtualOptions: {
                        itemHeight: 34,
                        mapValueTo: 'dataItem',
                        valueMapper: function (options) {
                            $.ajax({
                                url: `/odata/MertexLiveSuppliers/Default.MertexLiveSupplierValueMapper(supplierCode="${options.value || "null"}")`,
                                type: 'GET',
                                success: function (data) {
                                    options.success(data.value);
                                }
                            });
                        }
                    },
                    change: (e) => {
                        let dataItem = e.sender.dataItem();
                        options.model.set('SupplierCode', dataItem.Code);
                        options.model.set('Supplier', dataItem);
                    }
            });
        },
        template: (e) => {
            if (e.SupplierCode) {
                return `${e.Supplier.Code} - ${e.Supplier.Name}`;
            } else {
                return '';
            }
        },
        valueTemplate: (e) => {
            if (e.SupplierCode) {
                return `${e.Supplier.Code} - ${e.Supplier.Name}`;
            } else {
                return '';
            }
        },
    }, {
        field: 'PaymentRequestStatusID',
        title: 'Status',
        width: 220,
        attributes: {
            "class": "dropdown-container-cell"
        },
        template: (e) => {
            if (e.PaymentRequestStatusID) {
                return `${e.PaymentRequestStatus.Name}`;
            } else {
                return '';
            }
        },
        editor: (container, options) => {
            $(`<input type="text" required name='${options.field}' validationMessage="You must specify a Status" />`)
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: true,
                    autoWidth: true,
                    value: options.model.PaymentRequestStatusID,
                    dataTextField: 'Name',
                    dataValueField: 'PaymentRequestStatusID',
                    dataSource: new kendo.data.DataSource({
                        type: 'odata-v4',
                        sort: {
                            field: "Name", dir: "asc"
                        },
                        transport: {
                            read: '/odata/PaymentRequestStatuses'
                        }
                    }),
                    change: (e) => {
                        let dataItem = e.sender.dataItem();
                        options.model.set('PaymentRequestStatusID', dataItem.PaymentRequestStatusID);
                        options.model.set('PaymentRequestStatus', dataItem);
                    },
                    template: (e) => {
                        if (e.PaymentRequestStatusID) {
                            return e.Name;
                        } else {
                            return '';
                        }
                    },
                    valueTemplate: (e) => {
                        if (e.PaymentRequestStatusID) {
                            return e.Name;
                        } else {
                            return '';
                        }
                    }
                });
        }
    }, {
        field: 'RequestedByMemberID',
        title: 'Requested By'
    }, {
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
    }];

    self.gridParams = {
        autoBind: true,
        widget: ko.observable(),
        columns: self.gridColumns,
        data: self.gridDataSource,
        toolbar: self.gridToolbar,
        //useKOTemplates: true,
        //rowTemplate: 'grid-row-template',
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
        editable: true,
        edit: function (e) {
            let dropdown = e.container.find("[data-role=dropdownlist]").data("kendoDropDownList");

            if (dropdown) {
                dropdown.open();
            }
        }
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