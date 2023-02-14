var invoiceApprovalViewModel = function () {
    var self = this;

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable(undefined);

    self.validateNow = ko.observable(false);

    self.dateRanges = [{
        dateRangeId: 1,
        name: 'This Month'
    }, {
        dateRangeId: 6,
        name: 'Last 6 Months'
    }, {
        dateRangeId: 12,
        name: 'Last 12 Months'
    }, {
        dateRangeId: -1,
        name: 'All Time'
    }];

    self.dateRange = ko.observable();

    self.dateRangeId = ko.observable(6);

    self.dateRangeId.subscribe(function (newValue) {
        self.search();
    });

    self.dateRangeParams = kendoMDCDropDownList({
        name: 'DateRange',
        label: 'Order Date Range',
        objObservable: self.dateRange,
        idObservable: self.dateRangeId,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        data: self.dateRanges,
        textField: 'name',
        valueField: 'dateRangeId',
        optionsCaption: 'All Time',
        width: 'auto',
        showClear: false,
        filter: false,
        readOnly: false,
        onSelect: function () {

        }
    });

    self.orderHeadId = ko.observable().extend({
        numberFormatted: {
            digits: 0,
            currency: {
                FormattingCulture: 'en-GB'
            }
        }
    });

    self.orderHeadParams = {
        label: 'Order Number',
        observable: self.orderHeadId,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            self.orderHeadId(undefined);
            self.search();
        },
        enterKey: function () {
            self.search();
        }
    };

    self.supplierInvoice = ko.observable();

    self.supplierInvoiceParams = {
        label: 'Supplier Invoice Number',
        observable: self.supplierInvoice,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            self.supplierInvoice(undefined);
            self.search();
        },
        enterKey: function () {
            self.search();
        }
    };

    self.approvedDateRange = ko.observable();

    self.approvedDateRangeId = ko.observable(6);

    self.approvedDateRangeId.subscribe(function (newValue) {
        self.search();
    });

    self.approvedDateRangeParams = kendoMDCDropDownList({
        name: 'DateRange',
        label: 'Order Date Range',
        objObservable: self.approvedDateRange,
        idObservable: self.approvedDateRangeId,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        data: self.dateRanges,
        textField: 'name',
        valueField: 'dateRangeId',
        optionsCaption: 'All Time',
        width: 'auto',
        showClear: false,
        filter: false,
        readOnly: false,
        onSelect: function () {

        }
    });

    self.approvedOrderHeadId = ko.observable().extend({
        numberFormatted: {
            digits: 0,
            currency: {
                FormattingCulture: 'en-GB'
            }
        }
    });

    self.approvedOrderHeadParams = {
        label: 'Order Number',
        observable: self.approvedOrderHeadId,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            self.approvedOrderHeadId(undefined);
            self.approvedSearch();
        },
        enterKey: function () {
            self.approvedSearch();
        }
    };

    self.approvedSupplierInvoice = ko.observable();

    self.approvedSupplierInvoiceParams = {
        label: 'Supplier Invoice Number',
        observable: self.approvedSupplierInvoice,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            self.approvedSupplierInvoice(undefined);
            self.approvedSearch();
        },
        enterKey: function () {
            self.approvedSearch();
        }
    };

    self.pendingStatusFilterActive = ko.observable(false);

    self.pendingTreatmentProviderFilterActive = ko.observable(false);

    self.pendingCount = ko.observable();

    self.pendingGridWidget = ko.observable();

    self.pendingGridColumns = [
    //{
    //    field: 'TradeAccountNumber',
    //    title: 'Account',
    //    template: '#:TradeAccountNumber#<br/>#:TradeAccountName#',
    //    width: 200,
    //    visible: false
    //},
    {
        field: 'CustomerOrderHeadID',
        title: 'Fabric Order',
        width: 100,
        attributes: {
            class: 'text-right'
        },
        hidden: true
    }, {
        field: 'TransferOrderHeadID',
        title: 'Transfer Order',
        width: 100,
        attributes: {
            class: 'text-right'
        },
        hidden: true
    },
    {
        field: 'GroupingKey',
        title: 'Trade Account',
        hidden: true,
        groupHeaderTemplate: function (item) {
            return item.value;
        }
    }, {
        field: 'FabricCode',
        title: 'Part Number',
        width: 100
    },
    {
        field: 'FabricQuantity',
        title: 'Fabric Quantity',
        width: 105,
        attributes: {
            class: 'text-right'
        }
    }, {
        field: 'TreatmentProviderName',
        title: 'Provider',
        width: 120,
        filterable: {
            multi: true,
            dataSource: getTreatmentProviderFilterOptions(),
            operators: {
                contains: "Contains"
            }
        }
    }, {
        field: 'TreatmentCode',
        title: 'Treatment Code',
        width: 115
    }, {
        field: 'TreatmentQuantity',
        title: 'Treatment Quantity',
        width: 115,
        attributes: {
            class: 'text-right'
        }
    }, {
        field: 'TreatmentCostPrice',
        title: 'Treatment Cost Price',
        width: 115,
        template: function (e) {
            return '<span class="display-block">' + formatCurrency(e.TreatmentCostPrice, 2, "en-GB", "GBP") + '</span>'
        },
        attributes: {
            class: 'text-right'
        },
        aggregates: ["sum"],
        footerTemplate: function (e) {
            var costPriceSum = Enumerable.From(e).Where('$.Member == "TreatmentCostPrice"').Select('$.Value').SingleOrDefault();
            if (costPriceSum == null)
                costPriceSum = 0;
            return '<span class="display-block text-right">Total:<br/>' + formatCurrency(costPriceSum, 2, 'en-GB', 'GBP') + '</span>';
        }
    }, {
        field: 'TreatmentName',
        title: 'Treatment',
        width: 200,
        filterable: {
            operators: {
                equals: "equals"
            },
            ui: function (element) {
                element.kendoDropDownList({
                    autoBind: true,
                    autoWidth: false,
                    dataTextField: "Name",
                    dataValueField: "Name",
                    dataSource: {
                        serverFiltering: true,
                        serverSorting: true,
                        serverGrouping: true,
                        serverPaging: true,
                        type: 'odata-v4',
                        transport: {
                            read: {
                                url: '/odata/Treatments'
                            }
                        },
                        sort: {
                            field: 'SortOrder',
                            dir: 'asc'
                        }
                    },
                    dataBound: function (e) {
                        var listContainer = e.sender.list.closest(".k-list-container");
                        listContainer.width(listContainer.width() + kendo.support.scrollbar());
                    }
                });
            },
            extra: false
        }
    }, {
        field: 'FabricOrderLineStatus',
        title: 'Fabric Line Status',
        headerTemplate: 'Fabric<br/>Line Status',
        width: 115,
        filterable: {
            multi: true,
            dataSource: getOrderStatusOptions(),
            operators: {
                contains: "Equals"
            }
        }
    }, {
        field: 'TreatmentOrderLineStatus',
        title: 'Treatment Line Status',
        width: 115,
        filterable: {
            multi: true,
            dataSource: getOrderStatusOptions(),
            operators: {
                contains: "Equals"
            }
        }
    }, {
        title: 'Enter Supplier Invoice Details',
        headerTemplate: '<span class="display-block bold">Enter Supplier Invoice Details</span>',
        columns: [{
            field: 'SupplierInvoiceNumber',
            title: 'Supplier Invoice',
            headerTemplate: '<span class="display-block bold">Supplier<br/>Invoice</span>',
            filterable: false,
            width: 110,
            attributes: {
                class: 'text-right input-required'
            }
        }, {
            field: 'SupplierInvoiceDate',
            title: 'Invoice Date',
            headerTemplate: '<span class="display-block bold">Invoice<br/>Date</span>',
            filterable: false,
            width: 135,
            template: '#: SupplierInvoiceDate ? kendo.toString(SupplierInvoiceDate, "dd/MM/yyyy") : "" #',
            attributes: {
                class: 'input-required'
            }
        }, {
            field: 'SupplierInvoiceCharge',
            title: 'Invoice Charge',
            headerTemplate: '<span class="display-block bold">Invoice<br/>Charge</span>',
            template: function (e) {
                if (e.SupplierInvoiceCharge != null) {
                    return '<span class="display-block">' + formatCurrency(e.SupplierInvoiceCharge, 2, "en-GB", "GBP") + '</span>'
                } else {
                    return '';
                }
            },
            filterable: false,
            width: 120,
            attributes: {
                class: 'text-right input-required'
            },
            aggregates: ["sum"],
            footerTemplate: function (e) {
                var supplierInvoiceChargeSum = Enumerable.From(e).Where('$.Member == "SupplierInvoiceCharge"').Select('$.Value').SingleOrDefault();
                if (supplierInvoiceChargeSum == null)
                    supplierInvoiceChargeSum = 0;
                return '<span class="display-block text-right">Total:<br/>' + formatCurrency(supplierInvoiceChargeSum, 2, 'en-GB', 'GBP') + '</span>';
            }
        }, {
            field: 'SupplierInvoiceComments',
            title: 'Invoice Comments',
            headerTemplate: '<span class="display-block bold">Invoice<br/>Comments</span>',
            filterable: false,
            editor: function (container, options) {
                $('<textarea rows="3" class="form-control" name="SupplierInvoiceComments" data-bind="value: SupplierInvoiceComments" maxlength="500"></textarea>').appendTo(container);
            },
            attributes: {
                class: 'input-required'
            }
        }, {
            field: 'SupplierInvoiceApproved',
            title: 'Invoice Approved',
            headerTemplate: '<span class="display-block bold">Invoice<br/>Approval</span>',
            filterable: false,
            width: 90,
            template: function (e) {
                return e.SupplierInvoiceApproved ? '<span class="approved">&#x2714;</span>' : '';
            },
            attributes: {
                class: 'text-center input-required'
            }
        }]
    }];

    self.pendingGridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {
            orderHeadId: self.orderHeadId.peek(),
            dateRangeId: self.dateRangeId.peek(),
            supplierInvoiceId: self.supplierInvoice.peek()
        };

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        $.ajax({
            url: '/api/invoicesapi/FetchTreatmentLinesPending',
            type: "GET",
            dataType: 'json',
            data: data,
            success: function (data) {
                self.pendingCount(data.Total);
                options.success(data);
            },
            error: function (xhr, s, a) {
                $.ajaxSettings.error(xhr, s, a);
                options.error();
            }
        });
    }

    self.pendingGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.pendingGridDataSourceRead,
            update: function (e) {
                ko.utils.arrayForEach(e.data.models, function (m) {
                    m.SupplierInvoiceDate = m.SupplierInvoiceDate ? m.SupplierInvoiceDate.toISOString() : null;
                });
                $.ajax({
                    url: '/api/invoicesapi/UpdateTreatmentSupplierInvoiceInfo',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        models: e.data.models
                    },
                    success: function (data) {

                        self.pendingGridWidget().one("dataBound", function (e) {
                            e.sender.dataSource.read();
                        });

                        e.success(data);

                        self.clearApprovedGridFilters();
                        self.approvedGridWidget().dataSource.read();
                    },
                    error: function (xhr, s, a) {
                        e.error(xhr, s, a);
                    }
                });
            }
        },
        batch: true,
        sortable: true,
        filterable: true,
        grouping: true,
        serverFiltering: true,
        serverGrouping: true,
        groupPaging: true,
        serverPaging: true,
        serverAggregates: true,
        serverSorting: true,
        pageSize: 10,
        group: [{
            field: 'GroupingKey'
        }],
        //group: [{
        //    field: 'TradeAccountNumber'
        //}, {
        //    field: 'CustomerOrderHeadID'
        //}, {
        //    field: 'TransferOrderHeadID'
        //}, {
        //    field: 'TreatmentProviderName'
        //}, {
        //    field: 'OrderContext'
        //}],
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "AggregateResults",
            model: {
                id: 'FabricOrderLineID',
                fields: {
                    FabricOrderLineID: { type: 'number', editable: false },
                    FabricOrderLineNumber: { type: 'number', editable: false },
                    FabricOrderLineStatus: { type: 'string', editable: false },
                    CustomerOrderHeadID: { type: 'number', editable: false },
                    TradeAccountNumber: { type: 'string', editable: false },
                    FabricCode: { type: 'string', editable: false },
                    FabricQuantity: { type: 'number', editable: false },
                    TreatmentProviderName: { type: 'string', editable: false },
                    TreatmentName: { type: 'string', editable: false },
                    TreatmentOrderLineID: { type: 'number', editable: false },
                    TreatmentOrderLineNumber: { type: 'number', editable: false },
                    TreatmentOrderLineStatus: { type: 'string', editable: false },
                    TreatmentCode: { type: 'string', editable: false },
                    TreatmentQuantity: { type: 'number', editable: false },
                    TreatmentCostPrice: { type: 'number', editable: false },
                    TransferOrderHeadID: { type: 'number', editable: false },
                    TransferCode: { type: 'string', editable: false },
                    TransferQuantity: { type: 'number', editable: false },
                    OrderContext: { type: 'string', editable: false },
                    SupplierInvoiceNumber: {
                        type: 'string',
                        editable: true,
                    },
                    SupplierInvoiceDate: {
                        type: 'date',
                        editable: true,
                        validation: {
                            date: {
                                message: 'Supplier Invoice Date<br/>Invalid'
                            }
                        }
                    },
                    SupplierInvoiceCharge: {
                        type: 'number',
                        editable: true,
                        validation: {
                            min: 0
                        }
                    },
                    SupplierInvoiceComments: {
                        type: 'string',
                        editable: true
                    },
                    SupplierInvoiceApproved: {
                        type: 'boolean',
                        editable: true
                    }
                }
            }
        }),
        aggregate: [{
            field: 'TreatmentCostPrice', aggregate: 'sum'
        }, {
            field: 'SupplierInvoiceCharge', aggregate: 'sum'
        }],
        //sort: {
        //    field: 'CustomerOrderHeadID',
        //    dir: 'desc'
        //},
        //sort: { field: "BasketID", dir: "desc" },
        requestStart: function (e) {
            $("#grid-loading").show();
        },
        requestEnd: function (e) {
            if (e.type == "update") {
                if (e.response) {
                    if (!e.response.Errors) {
                        e.sender.read();
                    } else {
                        $("#grid-loading").hide();
                    }
                } else {
                    $("#grid-loading").hide();
                }
            } else {
                $("#grid-loading").hide();
            }
        },
        noDataTemplate: 'There are no Held Orders for your consideration.'
    });

    self.pendingGridSettings = {
        autoBind: true,
        widget: self.pendingGridWidget,
        columns: self.pendingGridColumns,
        data: self.pendingGridDataSource,
        //useKOTemplates: true,
        //rowTemplate: 'pending-row-template',
        sortable: true,
        groupable: true,
        filterable: true,
        reorderable: false,
        editable: true,
        selectable: false,
        change: function () {
            this.editRow(this.select());
        },
        toolbar: ["save", "cancel"],
        navigatable: true,
        paging: true,
        pageSize: 10,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        dataBound: function (e) {
            $(function () {
                if (self.pendingStatusFilterActive()) {
                    $('th[data-field="Status"]').find('a.k-grid-filter').addClass('k-state-active');
                } else {
                    $('th[data-field="Status"]').find('a.k-grid-filter').removeClass('k-state-active');
                }
            })
        },
        filterMenuInit: function (e) {
            if (e.field === 'Status' || e.field == 'TreatmentProvider') {
                var popup = e.container.data("kendoPopup");
                var dataSource = this.dataSource;
                var field = e.field;
                var element = e.container.children(":first");

                var originalMultiCheck = e.container.children(":first");

                var element = $("<div class='custom-filter-checkbox-container'></div>").insertAfter(originalMultiCheck).kendoListView({
                    dataSource: window['get' + e.field + 'FilterOptions'](),
                    template: "<label><input type='checkbox' value='#:" + field + "#'/>#:" + field + "#</label>"
                });

                originalMultiCheck.remove();

                e.container.children('.k-filter-selected-items').remove();

                e.container.find("[type='submit']").click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var filter = dataSource.filter() || { logic: "and", filters: [] };
                    var fieldFilters = $.map(element.find('input[type="checkbox"]:checked'), function (input) {
                        return {
                            field: field,
                            operator: "contains",
                            value: input.value
                        };
                    });
                    if (fieldFilters.length) {
                        self.removeFiltersForField(filter, field);
                        filter.filters.push({
                            logic: "or",
                            filters: fieldFilters
                        });
                        dataSource.filter(filter);
                        self['pending' + e.field + 'FilterActive'](true);
                    }
                    popup.close();
                });

                e.container.find("[type='reset']").click(function (e) {
                    self['pending' + e.field + 'FilterActive'](false);
                });
            }
        }
    }

    self.clearPendingGridFilters = function () {
        self.pendingStatusFilterActive(false);
        self.pendingTreatmentProviderFilterActive(false);
        self.pendingGridWidget().dataSource.filter({});
    }











    self.approvedStatusFilterActive = ko.observable(false);

    self.approvedTreatmentProviderFilterActive = ko.observable(false);

    self.approvedCount = ko.observable();

    self.approvedGridWidget = ko.observable();

    self.approvedGridColumns = [{
        field: 'GroupingKey',
        title: 'Trade Account',
        hidden: true,
        groupHeaderTemplate: function (item) {
            return item.value;
        }
    },
        {
        field: 'TradeAccountNumber',
        title: 'Account',
        template: '#:TradeAccountNumber#<br/>#:TradeAccountName#',
        width: 200,
        hidden: true
    }, {
        field: 'CustomerOrderHeadID',
        title: 'Fabric Order',
        width: 100,
        attributes: {
            class: 'text-right'
        },
        hidden: true
    }, {
        field: 'TransferOrderHeadID',
        title: 'Transfer Order',
        width: 100,
        attributes: {
            class: 'text-right'
        },
        hidden: true
    }, {
        field: 'FabricCode',
        title: 'Part Number',
        width: 100
    },
    {
        field: 'FabricQuantity',
        title: 'Fabric Quantity',
        width: 105,
        attributes: {
            class: 'text-right'
        }
    }, {
        field: 'TreatmentProviderName',
        title: 'Provider',
        width: 120,
        filterable: {
            multi: true,
            dataSource: getTreatmentProviderFilterOptions(),
            operators: {
                contains: "Contains"
            }
        }
    },{
        field: 'TreatmentCode',
        title: 'Treatment Code',
        width: 115
    }, {
        field: 'TreatmentQuantity',
        title: 'Treatment Quantity',
        width: 115,
        attributes: {
            class: 'text-right'
        }
    }, {
        field: 'TreatmentCostPrice',
        title: 'Treatment Cost Price',
        template: function (e) {
            return '<span class="display-block">' + formatCurrency(e.TreatmentCostPrice, 2, "en-GB", "GBP") + '</span>'
        },
        width: 115,
        attributes: {
            class: 'text-right'
        },
        aggregates: ["sum"],
        footerTemplate: function (e) {
            var costPriceSum = Enumerable.From(e).Where('$.Member == "TreatmentCostPrice"').Select('$.Value').SingleOrDefault();
            if (costPriceSum == null)
                costPriceSum = 0;
            return '<span class="display-block text-right">Total:<br/>' + formatCurrency(costPriceSum, 2, 'en-GB', 'GBP') + '</span>';
        }
    }, {
        field: 'TreatmentName',
        title: 'Treatment',
        width: 200,
        filterable: {
            operators: {
                equals: "equals"
            },
            ui: function (element) {
                element.kendoDropDownList({
                    autoBind: true,
                    autoWidth: false,
                    dataTextField: "Name",
                    dataValueField: "Name",
                    dataSource: {
                        serverFiltering: true,
                        serverSorting: true,
                        serverGrouping: true,
                        serverPaging: true,
                        type: 'odata-v4',
                        transport: {
                            read: {
                                url: '/odata/Treatments'
                            }
                        },
                        sort: {
                            field: 'SortOrder',
                            dir: 'asc'
                        }
                    },
                    dataBound: function (e) {
                        var listContainer = e.sender.list.closest(".k-list-container");
                        listContainer.width(listContainer.width() + kendo.support.scrollbar());
                    }
                });
            },
            extra: false
        }
    }, {
        field: 'FabricOrderLineStatus',
        title: 'Fabric Line Status',
        headerTemplate: 'Fabric<br/>Line Status',
        width: 115,
        filterable: {
            multi: true,
            dataSource: getOrderStatusOptions(),
            operators: {
                contains: "Equals"
            }
        }
    }, {
        field: 'TreatmentOrderLineStatus',
        title: 'Treatment Line Status',
        width: 115,
        filterable: {
            multi: true,
            dataSource: getOrderStatusOptions(),
            operators: {
                contains: "Equals"
            }
        }
    }, {
        title: 'Supplier Invoice Details',
        headerTemplate: '<span class="display-block bold">Supplier Invoice Details</span>',
        columns: [{
            field: 'SupplierInvoiceNumber',
            title: 'Supplier Invoice',
            headerTemplate: '<span class="display-block bold">Supplier<br/>Invoice</span>',
            filterable: false,
            sortable: true,
            width: 120,
            attributes: {
                class: 'text-right input-received approved'
            }
        }, {
            field: 'SupplierInvoiceDate',
            title: 'Invoice Date',
            headerTemplate: '<span class="display-block bold">Invoice<br/>Date</span>',
            filterable: false,
            sortable: true,
            width: 135,
            template: '#: SupplierInvoiceDate ? kendo.toString(SupplierInvoiceDate, "dd/MM/yyyy") : "" #',
            attributes: {
                class: 'input-received approved'
            }
        }, {
            field: 'SupplierInvoiceCharge',
            title: 'Invoice Charge',
            headerTemplate: '<span class="display-block bold">Invoice<br/>Charge</span>',
            template: function (e) {
                if (e.SupplierInvoiceCharge != null) {
                    return '<span class="display-block">' + formatCurrency(e.SupplierInvoiceCharge, 2, "en-GB", "GBP") + '</span>'
                } else {
                    return '';
                }
            },
            filterable: false,
            sortable: true,
            width: 120,
            attributes: {
                class: 'text-right input-received approved'
            },
            aggregates: ["sum"],
            footerTemplate: function (e) {
                var supplierInvoiceChargeSum = Enumerable.From(e).Where('$.Member == "SupplierInvoiceCharge"').Select('$.Value').SingleOrDefault();
                if (supplierInvoiceChargeSum == null)
                    supplierInvoiceChargeSum = 0;
                return '<span class="display-block text-right">Total:<br/>' + formatCurrency(supplierInvoiceChargeSum, 2, 'en-GB', 'GBP') + '</span>';
            }
        }, {
            field: 'SupplierInvoiceComments',
            title: 'Invoice Comments',
            headerTemplate: '<span class="display-block bold">Invoice<br/>Comments</span>',
            filterable: false,
            sortable: true,
            editor: function (container, options) {
                $('<textarea rows="3" class="form-control" name="SupplierInvoiceComments" data-bind="value: SupplierInvoiceComments" maxlength="500"></textarea>').appendTo(container);
            },
            attributes: {
                class: 'input-received approved'
            }
        }, {
            field: 'SupplierInvoiceApproved',
            title: 'Invoice Approved',
            headerTemplate: '<span class="display-block bold">Invoice<br/>Approval</span>',
            filterable: false,
            sortable: true,
            width: 90,
            template: function (e) {
                return e.SupplierInvoiceApproved ? '<span class="approved">&#x2714;</span>' : '';
            },
            attributes: {
                class: 'text-center input-received'
            }
        }]
    }];

    self.approvedGridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {
            orderHeadId: self.approvedOrderHeadId.peek(),
            supplierInvoiceId: self.approvedSupplierInvoice.peek(),
            dateRangeId: self.approvedDateRangeId.peek()
        };

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        $.ajax({
            url: '/api/invoicesapi/FetchTreatmentLinesApproved',
            type: "GET",
            dataType: 'json',
            data: data,
            success: function (data) {
                self.approvedCount(data.Total);
                options.success(data);
            },
            error: function (xhr, s, a) {
                $.ajaxSettings.error(xhr, s, a);
                options.error();
            }
        });
    }

    self.approvedGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.approvedGridDataSourceRead,
            update: function (e) {
                ko.utils.arrayForEach(e.data.models, function (m) {
                    m.SupplierInvoiceDate = m.SupplierInvoiceDate ? m.SupplierInvoiceDate.toISOString() : null;
                });
                $.ajax({
                    url: '/api/invoicesapi/UpdateTreatmentSupplierInvoiceInfo',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        models: e.data.models
                    },
                    success: function (data) {
                        e.success();

                        self.approvedGridWidget().one("dataBound", function (e) {
                            e.sender.dataSource.read();
                        });

                        e.success(data);

                        self.clearPendingGridFilters();
                        self.pendingGridWidget().dataSource.read();
                    },
                    error: function (xhr, s, a) {
                        e.error(xhr, s, a);
                    }
                });
            }
        },
        batch: true,
        sortable: true,
        filterable: true,
        grouping: true,
        serverFiltering: true,
        serverGrouping: true,
        groupPaging: true,
        serverPaging: true,
        serverAggregates: true,
        serverSorting: true,
        pageSize: 10,
        group: [{
            field: 'GroupingKey'
        }],
        pageSize: 10,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "AggregateResults",
            model: {
                id: 'FabricOrderLineID',
                fields: {
                    FabricOrderLineID: { type: 'number', editable: false },
                    FabricOrderLineNumber: { type: 'number', editable: false },
                    FabricOrderLineStatus: { type: 'string', editable: false },
                    CustomerOrderHeadID: { type: 'number', editable: false },
                    TradeAccountNumber: { type: 'string', editable: false },
                    FabricCode: { type: 'string', editable: false },
                    FabricQuantity: { type: 'number', editable: false },
                    TreatmentProviderName: { type: 'string', editable: false },
                    TreatmentName: { type: 'string', editable: false },
                    TreatmentOrderLineID: { type: 'number', editable: false },
                    TreatmentOrderLineNumber: { type: 'number', editable: false },
                    TreatmentOrderLineStatus: { type: 'string', editable: false },
                    TreatmentCode: { type: 'string', editable: false },
                    TreatmentQuantity: { type: 'number', editable: false },
                    TreatmentCostPrice: { type: 'number', editable: false },
                    TransferOrderHeadID: { type: 'number', editable: false },
                    TransferCode: { type: 'string', editable: false },
                    TransferQuantity: { type: 'number', editable: false },
                    SupplierInvoiceNumber: {
                        type: 'string',
                        editable: true,
                    },
                    SupplierInvoiceDate: {
                        type: 'date',
                        editable: true,
                        validation: {
                            date: {
                                message: 'Supplier Invoice Date<br/>Invalid'
                            }
                        }
                    },
                    SupplierInvoiceCharge: {
                        type: 'number',
                        editable: true,
                        validation: {
                            min: 0
                        }
                    },
                    SupplierInvoiceComments: {
                        type: 'string',
                        editable: true
                    },
                    SupplierInvoiceApproved: {
                        type: 'boolean',
                        editable: true
                    }
                }
            }
        }),
        aggregate: [{
            field: 'TreatmentCostPrice', aggregate: 'sum'
        }, {
            field: 'SupplierInvoiceCharge', aggregate: 'sum'
        }],
        //sort: {
        //    field: 'CustomerOrderHeadID',
        //    dir: 'desc'
        //},
        //sort: { field: "BasketID", dir: "desc" },
        requestStart: function (e) {
            $("#grid-loading").show();
        },
        requestEnd: function (e) {
            if (e.type == "update") {
                if (e.response) {
                    if (!e.response.Errors) {
                        e.sender.read();
                    } else {
                        $("#grid-loading").hide();
                    }
                } else {
                    $("#grid-loading").hide();
                }
            } else {
                $("#grid-loading").hide();
            }
        },
        noDataTemplate: 'There are no Held Orders for your consideration.'
    });

    self.approvedGridSettings = {
        autoBind: true,
        widget: self.approvedGridWidget,
        columns: self.approvedGridColumns,
        data: self.approvedGridDataSource,
        //useKOTemplates: true,
        //rowTemplate: 'approved-row-template',
        sortable: true,
        filterable: true,
        reorderable: false,
        editable: true,
        toolbar: ["save", "cancel"],
        navigatable: true,
        paging: true,
        pageSize: 10,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        selectable: false,
        dataBound: function (e) {
            $(function () {
                if (self.approvedStatusFilterActive()) {
                    $('th[data-field="Status"]').find('a.k-grid-filter').addClass('k-state-active');
                } else {
                    $('th[data-field="Status"]').find('a.k-grid-filter').removeClass('k-state-active');
                }
            })
        },
        filterMenuInit: function (e) {
            if (e.field === 'Status' || e.field == 'TreatmentProvider') {
                var popup = e.container.data("kendoPopup");
                var dataSource = this.dataSource;
                var field = e.field;
                var element = e.container.children(":first");

                var originalMultiCheck = e.container.children(":first");

                var element = $("<div class='custom-filter-checkbox-container'></div>").insertAfter(originalMultiCheck).kendoListView({
                    dataSource: window['get' + e.field + 'FilterOptions'](),
                    template: "<label><input type='checkbox' value='#:" + field + "#'/>#:" + field + "#</label>"
                });

                originalMultiCheck.remove();

                e.container.children('.k-filter-selected-items').remove();

                e.container.find("[type='submit']").click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var filter = dataSource.filter() || { logic: "and", filters: [] };
                    var fieldFilters = $.map(element.find('input[type="checkbox"]:checked'), function (input) {
                        return {
                            field: field,
                            operator: "contains",
                            value: input.value
                        };
                    });
                    if (fieldFilters.length) {
                        self.removeFiltersForField(filter, field);
                        filter.filters.push({
                            logic: "or",
                            filters: fieldFilters
                        });
                        dataSource.filter(filter);
                        self['approved' + e.field + 'FilterActive'](true);
                    }
                    popup.close();
                });

                e.container.find("[type='reset']").click(function (e) {
                    self['approved' + e.field + 'FilterActive'](false);
                });
            }
        }
    }

    self.clearApprovedGridFilters = function () {
        self.approvedStatusFilterActive(false);
        self.approvedTreatmentProviderFilterActive(false);
        self.approvedGridWidget().dataSource.filter({});
    }

    self.errors = ko.validation.group([

    ]);

    self.uniqueForField = function (data, field) {
        var map = {};
        var result = [];
        var item;
        for (var i = 0; i < data.length; i++) {
            item = data[i];
            if (!map[item[field]]) {
                result.push(item.toJSON());
                map[item[field]] = true;
            }
        }
        return result;
    }

    self.removeFiltersForField = function (expression, field) {
        if (expression.filters) {
            expression.filters = $.grep(expression.filters, function (filter) {
                self.removeFiltersForField(filter, field);
                if (filter.filters) {
                    return filter.filters.length;
                } else {
                    return filter.field != field;
                }
            });
        }
    }

    self.search = function () {
        if (self.pendingGridWidget().dataSource.hasChanges()) {
            $.confirm('Unsaved Changes', 'You have unsaved changes in the grid. Searching will clear those changes. Would you like to proceed?', function () {
                self.pendingGridWidget().dataSource.query({
                    group: self.pendingGridWidget().dataSource.group(),
                    aggregate: Array.isArray(self.pendingGridWidget().dataSource.aggregates()) ? self.pendingGridWidget().dataSource.aggregates().map(function (x) {
                        return {
                            field: x.Member,
                            aggregate: x.AggregateMethodName.toLowerCase()
                        }
                    }) : Object.keys(self.pendingGridWidget().dataSource.aggregates()).map(function (x) {
                        return { field: x, aggregate: 'sum' }
                    }),
                    page: 1,
                    pageSize: self.pendingGridWidget().dataSource.options.pageSize
                });
            }, null)
        } else {
            self.pendingGridWidget().dataSource.query({
                group: self.pendingGridWidget().dataSource.group(),
                aggregate: Array.isArray(self.pendingGridWidget().dataSource.aggregates()) ? self.pendingGridWidget().dataSource.aggregates().map(function (x) {
                    return {
                        field: x.Member,
                        aggregate: x.AggregateMethodName.toLowerCase()
                    }
                }) : Object.keys(self.pendingGridWidget().dataSource.aggregates()).map(function (x) {
                    return { field: x, aggregate: 'sum' }
                }),
                page: 1,
                pageSize: self.pendingGridWidget().dataSource.options.pageSize
            });
        }
    }

    self.approvedSearch = function () {
        if (self.pendingGridWidget().dataSource.hasChanges()) {
            $.confirm('Unsaved Changes', 'You have unsaved changes in the grid. Searching will clear those changes. Would you like to proceed?', function () {
                self.approvedGridWidget().dataSource.query({
                    group: self.approvedGridWidget().dataSource.group(),
                    aggregate: Array.isArray(self.approvedGridWidget().dataSource.aggregates()) ? self.approvedGridWidget().dataSource.aggregates().map(function (x) {
                        return {
                            field: x.Member,
                            aggregate: x.AggregateMethodName.toLowerCase()
                        }
                    }) : Object.keys(self.approvedGridWidget().dataSource.aggregates()).map(function (x) {
                        return { field: x, aggregate: 'sum' }
                    }),
                    page: 1,
                    pageSize: self.approvedGridWidget().dataSource.options.pageSize
                });
            }, null)
        } else {
            self.approvedGridWidget().dataSource.query({
                group: self.approvedGridWidget().dataSource.group(),
                aggregate: Array.isArray(self.approvedGridWidget().dataSource.aggregates()) ? self.approvedGridWidget().dataSource.aggregates().map(function (x) {
                    return {
                        field: x.Member,
                        aggregate: x.AggregateMethodName.toLowerCase()
                    }
                }) : Object.keys(self.approvedGridWidget().dataSource.aggregates()).map(function (x) {
                    return { field: x, aggregate: 'sum' }
                }),
                page: 1,
                pageSize: self.approvedGridWidget().dataSource.options.pageSize
            });
        }
    }
}