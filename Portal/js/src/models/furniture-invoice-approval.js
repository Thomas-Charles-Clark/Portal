var furnitureApprovalViewModel = function () {
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

    self.pendingGridColumns = [{
        field: 'TradeAccountNumber',
        title: 'Account',
        template: '#:TradeAccountNumber#<br/>#:TradeAccountName#',
        width: 160
    }, {
        field: 'FurnitureOrderHeadID',
        title: 'Order Number',
        width: 92,
        filterable: false,
        template: function (item) {
            return '<span class="display-block">' + item.FurnitureOrderHeadID + '</span>' +
                '<span class="display-block">' + item.FurnitureOrderDate + '</span>'
        }
    }, {
        field: 'FurnitureOrderLineNumber',
        title: 'Related Order Status(es)',
        headerTemplate: 'Related<br/>Order<br/>Status(es)',
        width: 120,
        filterable: false,
        template: function (e) {
            var invoiced = Enumerable.From(e.fabricsAndTreatments).Where('$.orderStatusId == 5').Count() == e.fabricsAndTreatments.length;
            return '<a class="furniture-details ' + (invoiced ? 'invoiced' : '') + '" href="javascript:;" data-bind="bootstrapPopover: furnitureDetailsBootstrapPopover">' +
                Enumerable.From(e.fabricsAndTreatments).Where('$.orderStatusId == 5').Count() + ' of ' +
                e.fabricsAndTreatments.length + ' Invoiced'
                + '</a>'
        },
        attributes: {
            class: 'text-left'
        }
    }, {
        field: 'FurnitureOrderLineNumber',
        title: 'Furniture Surcharges',
        headerTemplate: 'Furniture<br/>Surcharge<br/>Status(es)',
        width: 120,
        filterable: false,
        template: function (e) {
            var invoiced = Enumerable.From(e.furnitureSurcharges).Where('$.orderStatusId == 5').Count() == e.furnitureSurcharges.length;
            return '<a class="furniture-details ' + (invoiced ? 'invoiced' : '') + '" href="javascript:;" data-bind="bootstrapPopover: furnitureSurchargesBootstrapPopover">' +
                Enumerable.From(e.furnitureSurcharges).Where('$.orderStatusId == 5').Count() + ' of ' +
                e.furnitureSurcharges.length + ' Invoiced'
                + '</a>'
        },
        attributes: {
            class: 'text-left'
        }
    }, {
        field: 'Code',
        title: 'Product',
        width: 170,
        template: function (e) {
            return e.Code + '<br/>' + e.Name
        }
    }, {
        field: 'Quantity',
        title: 'Qty',
        width: 70,
        filterable: false,
        attributes: {
            class: 'text-right'
        }
    }, {
        field: 'FurnitureOrderStatus',
        title: 'Line Status',
        width: 100,
        template: function (e) {
            if (e.FurnitureOrderStatus == 'Invoiced') {
                return '<span class="invoiced display-block">' + e.FurnitureOrderStatus + '</span>'
            } else {
                return '<span class="display-block">' + e.FurnitureOrderStatus + '</span>'
            }
        },
        filterable: {
            multi: true,
            dataSource: getOrderStatusOptions(),
            operators: {
                contains: "Equals"
            }
        }
    }, {
        field: 'CostPrice',
        title: 'Cost Price',
        width: 90,
        filterable: false,
        template: function (e) {
            return '<span class="display-block">' + formatCurrency(e.CostPrice, 2, "en-GB", "GBP") + '</span>'
        },
        attributes: {
            class: 'text-right'
        },
        aggregates: ["sum"],
        footerTemplate: function (e) {
            var costPriceSum = Enumerable.From(e).Where('$.Member == "CostPrice"').Select('$.Value').SingleOrDefault();
            if (costPriceSum == null)
                costPriceSum = 0;
            return '<span class="display-block text-right">Total:<br/>' + formatCurrency(costPriceSum, 2, 'en-GB', 'GBP') + '</span>';
        }
    }, {
        field: 'FurnitureSupplierName',
        title: 'Supplier',
        width: 140,
        filterable: {
            multi: true,
            dataSource: getFurnitureSupplierOptions(),
            operators: {
                contains: "Equals"
            }
        },
    }, {
        title: 'Enter Supplier Invoice Details',
        headerTemplate: '<span class="display-block bold">Enter Supplier Invoice Details</span>',
        columns: [{
            field: 'SupplierInvoiceNumber',
            title: 'Invoice Number',
            headerTemplate: '<span class="display-block bold">Invoice<br/>Number</span>',
            filterable: false,
            sortable: true,
            width: 110,
            attributes: {
                class: 'text-right input-required'
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
                class: 'input-required'
            }
        }, {
            field: 'SupplierInvoiceCharge',
            title: 'Invoice Charge',
            headerTemplate: '<span class="display-block bold">Invoice<br/>Charge</span>',
            filterable: false,
            sortable: true,
            width: 120,
            template: '#: SupplierInvoiceCharge ? formatCurrency(SupplierInvoiceCharge, 2, "en-GB", "GBP") : "" #',
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
            sortable: true,
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
            sortable: true,
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
            supplierInvoiceId: self.supplierInvoice.peek(),
            dateRangeId: self.dateRangeId.peek()
        };

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        $.ajax({
            url: '/api/invoicesapi/FetchFurnitureLinesPending',
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
                    url: '/api/invoicesapi/UpdateFurnitureSupplierInvoiceInfo',
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
        grouping: false,
        serverFiltering: true,
        serverGrouping: false,
        serverPaging: true,
        serverAggregates: true,
        serverSorting: true,
        pageSize: 10,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "AggregateResults",
            model: {
                id: 'FurnitureOrderLineID',
                fields: {
                    TradeAccountNumber: { type: 'string', editable: false },
                    FurnitureOrderHeadID: { type: 'number', editable: false },
                    FurnitureOrderDate: { type: 'string', edtiable: false },
                    FurnitureOrderLineID: { type: 'number', editable: false },
                    Code: { type: 'string', editable: false },
                    Quantity: { type: 'number', editable: false },
                    CostPrice: { type: 'number', editable: false },
                    FurnitureSupplierName: { type: 'string', editable: false },
                    FurnitureOrderLineNumber: { type: 'string', editable: false },
                    FurnitureOrderStatus: { type: 'string', editable: false },
                    fabricsAndTreatments: { type: 'object', editable: false },
                    furnitureSurcharges: { type: 'object', editable: false },
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
            field: 'CostPrice', aggregate: 'sum'
        }, {
            field: 'SupplierInvoiceCharge', aggregate: 'sum'
        }],
        sort: {
            field: 'FurnitureOrderHeadID',
            dir: 'desc'
        },
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
        noDataTemplate: 'There are no Furniture Orders awaiting invoicing information.'
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
            var pristine = e.sender.dataSource.data().toJSON();
            ko.utils.arrayForEach(e.sender.dataSource.data(), function (item, index) {

                ko.cleanNode($('tr[data-uid="' + item.uid + '"]')[0]);

                pristine[index].furnitureGridSettings = {
                    autoBind: true,
                    widget: ko.observable(),
                    useKOTemplates: true,
                    rowTemplate: 'furniture-detail-grid-row-template',
                    columns: [{
                        field: 'type',
                        title: 'Type',
                        width: 80
                    }, {
                        field: 'code',
                        title: 'Product',
                        width: 120
                    }, {
                        field: 'orderHeadId',
                        title: 'Order Number',
                        width: 102
                    }, {
                        field: 'orderStatus',
                        title: 'Order Status',
                        width: 100
                    }, {
                        field: 'transferOrderHeadId',
                        title: 'Transfer Order Number',
                        width: 100
                    }, {
                        field: 'transferOrderStatus',
                        title: 'Transfer Status',
                        width: 100
                    }, {
                        field: 'supplierInvoiceNumber',
                        title: 'Supplier Invoice Number',
                        width: 140
                    }],
                    data: pristine[index].fabricsAndTreatments,
                    sortable: true,
                    groupable: false,
                    filterable: false,
                    reorderable: false,
                    editable: false,
                    selectable: false,
                    navigatable: false,
                    paging: false
                };

                pristine[index].furnitureDetailsBootstrapPopover = {
                    container: 'body',
                    title: 'Furniture Details',
                    onInserted: function (e) {
                        $('a.furniture-details').not(event.currentTarget).each(function (i, p) {
                            $(p).popover('hide');
                        });
                    },
                    content: function () {
                        var result = $('<div data-bind="kendoGrid: $parent.furnitureGridSettings"></div>');
                        return result;
                    },
                    placement: 'right',
                    trigger: 'click',
                    template: `<div class="popover details-popover" role="tooltip">
                            <div class="arrow"></div>
                            <div class="modal-header grey-blue">
                                <button class="close pull-right" data-bind="click: function () { $(popObject).popover('hide'); }">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 class="modal-title popover-title"></h4>
                            </div>
                            <div class="popover-content"></div>
                        </div>`
                }

                pristine[index].furnitureSurchargeGridSettings = {
                    autoBind: true,
                    widget: ko.observable(),
                    useKOTemplates: true,
                    rowTemplate: 'furniture-surcharge-grid-row-template',
                    columns: [{
                        field: 'orderHeadId',
                        title: 'Order Number',
                        width: 140
                    }, {
                        field: 'code',
                        title: 'Product',
                        width: 140
                    }, {
                        field: 'quantity',
                        title: 'Quantity',
                        width: 140
                    }, {
                        field: 'orderStatus',
                        title: 'Order Status',
                        width: 140
                    }],
                    data: pristine[index].furnitureSurcharges,
                    sortable: true,
                    groupable: false,
                    filterable: false,
                    reorderable: false,
                    editable: false,
                    selectable: false,
                    navigatable: false,
                    paging: false
                };

                pristine[index].furnitureSurchargesBootstrapPopover = {
                    container: 'body',
                    title: 'Furniture Surcharges',
                    onInserted: function (e) {
                        $('a.furniture-details').not(event.currentTarget).each(function (i, p) {
                            $(p).popover('hide');
                        });
                    },
                    content: function () {
                        var result = $('<div data-bind="kendoGrid: $parent.furnitureSurchargeGridSettings"></div>');
                        return result;
                    },
                    placement: 'right',
                    trigger: 'click',
                    template: `<div class="popover details-popover furniture-surcharges-popover" role="tooltip">
                            <div class="arrow"></div>
                            <div class="modal-header grey-blue">
                                <button class="close pull-right" data-bind="click: function () { $(popObject).popover('hide'); }">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 class="modal-title popover-title"></h4>
                            </div>
                            <div class="popover-content"></div>
                        </div>`
                }

                ko.applyBindings(pristine[index], $('tr[data-uid="' + item.uid + '"]')[0]);
            });
            $(function () {
                if (self.pendingStatusFilterActive()) {
                    $('th[data-field="Status"]').find('a.k-grid-filter').addClass('k-state-active');
                } else {
                    $('th[data-field="Status"]').find('a.k-grid-filter').removeClass('k-state-active');
                }
            });
        },
        page: function (e) {
            $('tr[role="row"]').each(function (x) {
                ko.cleanNode(x);
            });
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
        field: 'TradeAccountNumber',
        title: 'Account',
        template: '#:TradeAccountNumber#<br/>#:TradeAccountName#',
        width: 160
    }, {
        field: 'FurnitureOrderHeadID',
        title: 'Order Number',
        width: 92,
        filterable: false,
        template: function (item) {
            return '<span class="display-block">' + item.FurnitureOrderHeadID + '</span>' +
                '<span class="display-block">' + item.FurnitureOrderDate + '</span>'
        }
    }, {
        field: 'FurnitureOrderLineNumber',
        title: 'Related Order Status(es)',
        width: 120,
        template: function (e) {
            var invoiced = Enumerable.From(e.fabricsAndTreatments).Where('$.orderStatusId == 5').Count() == e.fabricsAndTreatments.length;
            return '<a class="furniture-details ' + (invoiced ? 'invoiced' : '') + '" href="javascript:;" data-bind="bootstrapPopover: furnitureDetailsBootstrapPopover">' +
                Enumerable.From(e.fabricsAndTreatments).Where('$.orderStatusId == 5').Count() + ' of ' +
                e.fabricsAndTreatments.length + ' Invoiced'
                + '</a>'
        },
        attributes: {
            class: 'text-left'
        }
    }, {
        field: 'FurnitureOrderLineNumber',
        title: 'Furniture Surcharges',
        headerTemplate: 'Furniture<br/>Surcharges',
        width: 120,
        template: function (e) {
            var invoiced = Enumerable.From(e.furnitureSurcharges).Where('$.orderStatusId == 5').Count() == e.furnitureSurcharges.length;
            return '<a class="furniture-details ' + (invoiced ? 'invoiced' : '') + '" href="javascript:;" data-bind="bootstrapPopover: furnitureSurchargesBootstrapPopover">' +
                Enumerable.From(e.furnitureSurcharges).Where('$.orderStatusId == 5').Count() + ' of ' +
                e.furnitureSurcharges.length + ' Invoiced'
                + '</a>'
        },
        attributes: {
            class: 'text-left'
        }
    }, {
        field: 'Code',
        title: 'Product',
        width: 170,
        template: function (e) {
            return e.Code + '<br/>' + e.Name
        }
    }, {
        field: 'Quantity',
        title: 'Qty',
        width: 70,
        filterable: false,
        attributes: {
            class: 'text-right'
        }
    }, {
        field: 'FurnitureOrderStatus',
        title: 'Line Status',
        width: 100,
        template: function (e) {
            if (e.FurnitureOrderStatus == 'Invoiced') {
                return '<span class="invoiced display-block">' + e.FurnitureOrderStatus + '</span>'
            } else {
                return '<span class="display-block">' + e.FurnitureOrderStatus + '</span>'
            }
        },
        filterable: {
            multi: true,
            dataSource: getOrderStatusOptions(),
            operators: {
                contains: "Equals"
            }
        }
    }, {
        field: 'CostPrice',
        title: 'Cost Price',
        width: 90,
        filterable: false,
        template: function (e) {
            return '<span class="display-block">' + formatCurrency(e.CostPrice, 2, "en-GB", "GBP") + '</span>'
        },
        attributes: {
            class: 'text-right'
        },
        aggregates: ["sum"],
        footerTemplate: function (e) {
            var costPriceSum = Enumerable.From(e).Where('$.Member == "CostPrice"').Select('$.Value').SingleOrDefault();
            if (costPriceSum == null)
                costPriceSum = 0;
            return '<span class="display-block text-right">Total:<br/>' + formatCurrency(costPriceSum, 2, 'en-GB', 'GBP') + '</span>';
        }
    }, {
        field: 'FurnitureSupplierName',
        title: 'Supplier',
        width: 140,
        filterable: {
            multi: true,
            dataSource: getFurnitureSupplierOptions(),
            operators: {
                contains: "Equals"
            }
        },
    }, {
        title: 'Supplier Invoice Details',
        headerTemplate: '<span class="display-block bold">Supplier Invoice Details</span>',
        columns: [{
            field: 'SupplierInvoiceNumber',
            title: 'Invoice Number',
            headerTemplate: '<span class="display-block bold">Invoice<br/>Number</span>',
            filterable: false,
            sortable: true,
            width: 110,
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
            filterable: false,
            sortable: true,
            width: 120,
            template: '#: SupplierInvoiceCharge ? formatCurrency(SupplierInvoiceCharge, 2, "en-GB", "GBP") : "" #',
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
            url: '/api/invoicesapi/FetchFurnitureLinesApproved',
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
                    url: '/api/invoicesapi/UpdateFurnitureSupplierInvoiceInfo',
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
        grouping: false,
        serverFiltering: true,
        serverGrouping: false,
        serverPaging: true,
        serverAggregates: true,
        serverSorting: true,
        pageSize: 10,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "AggregateResults",
            model: {
                id: 'FurnitureOrderLineID',
                fields: {
                    TradeAccountNumber: { type: 'string', editable: false },
                    FurnitureOrderHeadID: { type: 'number', editable: false },
                    FurnitureOrderLineID: { type: 'number', editable: false },
                    Code: { type: 'string', editable: false },
                    Quantity: { type: 'number', editable: false },
                    FurnitureSupplierName: { type: 'string', editable: false },
                    FurnitureOrderLineNumber: { type: 'string', editable: false },
                    FurnitureOrderStatus: { type: 'string', editable: false },
                    fabricsAndTreatments: { type: 'object', editable: false },
                    furnitureSurcharges: { type: 'object', editable: false },
                    SupplierInvoiceNumber: {
                        type: 'string',
                        editable: true
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
            field: 'CostPrice', aggregate: 'sum'
        }, {
            field: 'SupplierInvoiceCharge', aggregate: 'sum'
        }],
        sort: {
            field: 'FurnitureOrderHeadID',
            dir: 'desc'
        },
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
        noDataTemplate: 'There are no Furniture Orders with approved invoicing information.'
    });

    self.approvedGridSettings = {
        autoBind: true,
        widget: self.approvedGridWidget,
        columns: self.approvedGridColumns,
        data: self.approvedGridDataSource,
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
            var pristine = e.sender.dataSource.data().toJSON();
            ko.utils.arrayForEach(e.sender.dataSource.data(), function (item, index) {

                ko.cleanNode($('tr[data-uid="' + item.uid + '"]')[0]);

                pristine[index].furnitureGridSettings = {
                    autoBind: true,
                    widget: ko.observable(),
                    useKOTemplates: true,
                    rowTemplate: 'furniture-detail-grid-row-template',
                    columns: [{
                        field: 'type',
                        title: 'Type',
                        width: 80
                    }, {
                        field: 'code',
                        title: 'Product',
                        width: 120
                    }, {
                        field: 'orderHeadId',
                        title: 'Order Number',
                        width: 102
                    }, {
                        field: 'orderStatus',
                        title: 'Order Status',
                        width: 100
                    }, {
                        field: 'transferOrderHeadId',
                        title: 'Transfer Order Number',
                        width: 100
                    }, {
                        field: 'transferOrderStatus',
                        title: 'Transfer Status',
                        width: 100
                    }, {
                        field: 'supplierInvoiceNumber',
                        title: 'Supplier Invoice Number',
                        width: 140
                    }],
                    data: pristine[index].fabricsAndTreatments,
                    sortable: true,
                    groupable: false,
                    filterable: false,
                    reorderable: false,
                    editable: false,
                    selectable: false,
                    navigatable: false,
                    paging: false
                };

                pristine[index].furnitureDetailsBootstrapPopover = {
                    container: 'body',
                    title: 'Furniture Details',
                    onInserted: function (e) {
                        $('a.furniture-details').not(event.currentTarget).each(function (i, p) {
                            $(p).popover('hide');
                        });
                    },
                    content: function () {
                        var result = $('<div data-bind="kendoGrid: $parent.furnitureGridSettings"></div>');
                        return result;
                    },
                    placement: 'right',
                    trigger: 'click',
                    template: `<div class="popover details-popover" role="tooltip">
                            <div class="arrow"></div>
                            <div class="modal-header grey-blue">
                                <button class="close pull-right" data-bind="click: function () { $(popObject).popover('hide'); }">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 class="modal-title popover-title"></h4>
                            </div>
                            <div class="popover-content"></div>
                        </div>`
                }

                pristine[index].furnitureSurchargeGridSettings = {
                    autoBind: true,
                    widget: ko.observable(),
                    useKOTemplates: true,
                    rowTemplate: 'furniture-surcharge-grid-row-template',
                    columns: [{
                        field: 'orderHeadId',
                        title: 'Order Number',
                        width: 140
                    }, {
                        field: 'code',
                        title: 'Product',
                        width: 140
                    }, {
                        field: 'quantity',
                        title: 'Quantity',
                        width: 140
                    }, {
                        field: 'orderStatus',
                        title: 'Order Status',
                        width: 140
                    }],
                    data: pristine[index].furnitureSurcharges,
                    sortable: true,
                    groupable: false,
                    filterable: false,
                    reorderable: false,
                    editable: false,
                    selectable: false,
                    navigatable: false,
                    paging: false
                };

                pristine[index].furnitureSurchargesBootstrapPopover = {
                    container: 'body',
                    title: 'Furniture Surcharges',
                    onInserted: function (e) {
                        $('a.furniture-details').not(event.currentTarget).each(function (i, p) {
                            $(p).popover('hide');
                        });
                    },
                    content: function () {
                        var result = $('<div data-bind="kendoGrid: $parent.furnitureSurchargeGridSettings"></div>');
                        return result;
                    },
                    placement: 'right',
                    trigger: 'click',
                    template: `<div class="popover details-popover" role="tooltip">
                            <div class="arrow"></div>
                            <div class="modal-header grey-blue">
                                <button class="close pull-right" data-bind="click: function () { $(popObject).popover('hide'); }">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 class="modal-title popover-title"></h4>
                            </div>
                            <div class="popover-content"></div>
                        </div>`
                }

                ko.applyBindings(pristine[index], $('tr[data-uid="' + item.uid + '"]')[0]);
            });
            $(function () {
                if (self.pendingStatusFilterActive()) {
                    $('th[data-field="Status"]').find('a.k-grid-filter').addClass('k-state-active');
                } else {
                    $('th[data-field="Status"]').find('a.k-grid-filter').removeClass('k-state-active');
                }
            });
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