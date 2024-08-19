'use strict';

const yesNoOptions = [{
    Name: 'Yes',
    Value: 'true'
}, {
    Name: 'No',
    Value: 'false'
}];

const parcelPricingViewModel = (() => {
    let self = {};

    //#region Properties

    self.busy = ko.observable(false);

    //#endregion


    //#region Components

    self.genericUnsavedChangesClear = (e) => {
        self.checkUnsavedChangesThenClear(e);
    }

    self.checkUnsavedChangesThenClear = async (options) => {
        await self.unsavedChanges().then(() => {
            var self = options; // self is now the params of the control the user just interacted with

            if (ko.isObservableArray(self.observable)) {
                self.observable([]);
            } else {
                self.observable('');
            }
            if (self.dropDownListSettings.widget()) {
                if (ko.isObservableArray(self.observable)) {
                    self.dropDownListSettings.widget().value([]);
                } else {
                    self.dropDownListSettings.widget().value('');
                }
                self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                if (self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.label_ != null)
                    self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.label_.float(false);
            }
            if (typeof self.afterClear === 'function') {
                self.afterClear();
            }
        }).catch((e) => {
            console.error(e);
        });
    }

    self.unsavedChanges = () => {
        return new Promise((resolve, reject) => {

            let array = [{
                unsavedChanges: () => false
            }];

            //switch (self.view()) {
            //    case VIEW_MANAGE:
            //        array = self.filledRecords.peek();
            //        break;
            //    case VIEW_ADD:
            //        array = self.addFilledRecords.peek();
            //        break;
            //    default: break;
            //}

            let unsaved = false;// array.find(p => p.unsavedChanges());

            if (unsaved) {
                window.showConfirm('Unsaved changes', 'You have unsaved changes. If you proceed your changes will be lost. Proceed?', () => {
                    resolve();
                }, () => {
                    reject();
                });
            } else {
                resolve();
            }
        });
    }

    self.pricingGridWidget = ko.observable();

    self.pricingGridColumns = [{
        field: 'DestinationID',
        title: 'Destination',
        width: 160
    }, {
        field: 'ParcelTypeID',
        title: 'Parcel Type',
        width: 92,
        filterable: false,
        template: function (item) {
            return '<span class="display-block">' + item.ParcelType.Name + '</span>'
        }
    }, {
        field: 'Currency',
        title: 'Currency',
        width: 92,
        filterable: false
    }, {
        field: 'Price',
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

    self.pricingGridDataSourceRead = function (options) {

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
            url: '/api/invoicesapi/FetchFurnitureLinespricing',
            type: "GET",
            dataType: 'json',
            data: data,
            success: function (data) {
                self.pricingCount(data.Total);
                options.success(data);
            },
            error: function (xhr, s, a) {
                $.ajaxSettings.error(xhr, s, a);
                options.error();
            }
        });
    }

    self.pricingGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.pricingGridDataSourceRead,
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

                        self.pricingGridWidget().one("dataBound", function (e) {
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

    self.pricingGridSettings = {
        autoBind: true,
        widget: self.pricingGridWidget,
        columns: self.pricingGridColumns,
        data: self.pricingGridDataSource,
        //useKOTemplates: true,
        //rowTemplate: 'pricing-row-template',
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
                if (self.pricingStatusFilterActive()) {
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
                        self['pricing' + e.field + 'FilterActive'](true);
                    }
                    popup.close();
                });

                e.container.find("[type='reset']").click(function (e) {
                    self['pricing' + e.field + 'FilterActive'](false);
                });
            }
        }
    }

    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Computeds



    //#endregion


    //#region Methods

    self.ready = () => {
        self.busy(false);
    }

    //#endregion

    return self;
});