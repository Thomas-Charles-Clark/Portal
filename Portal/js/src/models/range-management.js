const
    TAB_RANGE = 0,
    TAB_RESTOCK = 1,
    TAB_RECALL = 2

const
    SORT_QUANTITY_ASC = 0,
    SORT_QUANTITY_DESC = 1,
    SORT_ORDERFORMGROUP_ASC = 2,
    SORT_ORDERFORMGROUP_DESC = 3

const
    VIEW_MANAGE = 1,
    VIEW_RESTOCK = 2,
    VIEW_RECALL = 3

const rangeManagementViewModel = ({ } = {}) => {
    let self = {};

    //#region Properties

    self.busy = ko.observable(false);

    self.view = ko.observable(VIEW_MANAGE);

    self.manageBusy = ko.observable(false);

    self.restockBusy = ko.observable(false);

    self.recallBusy = ko.observable(false);

    self.addToRangeModalBusy = ko.observable(false);

    self.addToRangeModalElement = document.getElementById('add-to-range-modal');

    self.addToRangeModal = bootstrap.Modal.getOrCreateInstance(self.addToRangeModalElement);


    self.modalBusy = ko.observable(false);

    //self.detailModalElement = document.getElementById('detail-modal');

    //self.detailModal = bootstrap.Modal.getOrCreateInstance(self.detailModalElement);

    self.ready = ko.observable(true);

    //self.displayWarehouseStock = ko.observable(false);
    //window.displayWarehouseStock = self.displayWarehouseStock;

    //self.displayRingFencedStock = ko.observable(false);
    //window.displayRingFencedStock = self.displayRingFencedStock;

    //self.displaySales = ko.observable(false);
    //window.displaySales = self.displaySales;

    //#region Prefilters

    self.productTypeKey = ko.observable();
    self.productType = ko.observable();

    self.branchId = ko.observable(3);
    self.branch = ko.observable();

    self.launchId = ko.observable(''); // '' because dropdowns were borne of selects which demand a '' for empty selection and Kendo carries this torch
    self.launch = ko.observable();

    self.brandId = ko.observable(''); // if you don't initialise to '' you'll find that opening and immediately dismissing the associated dropdown
    self.brand = ko.observable(); // the above caveat appears to only apply to odata bound drop down lists

    self.statusGroupId = ko.observable('');
    self.statusGroup = ko.observable();

    self.productColourId = ko.observable(''); // causes the underlying value to be switched to '', which fires the subscription which fires the search
    self.productColour = ko.observable();

    self.stockStatusId = ko.observable(''); // which probably isn't what you wanted to happen.
    self.stockStatus = ko.observable();

    self.collectionId = ko.observable('');
    self.collection = ko.observable();

    self.attributeGroupId = ko.observable('');
    self.attributeGroup = ko.observable();

    self.attributeId = ko.observable('');
    self.attribute = ko.observable();

    self.attributeIds = ko.observableArray([]);

    self.emptyArray = [];

    self.attributes = ko.observableArray(self.emptyArray);

    self.productFilterGroups = ko.observableArray([]);
    self.productFilterGroup = ko.observable();
    self.productFilterGroupId = ko.observable(null);

    self.completeProductFilters = ko.observableArray([]);
    self.currentProductFilters = ko.observableArray([]);
    self.productFilter = ko.observable();
    self.productFilterId = ko.observable(null);

    self.buyer = ko.observable();
    self.buyerCode = ko.observable('');

    self.supplier = ko.observable();
    self.supplierCode = ko.observable('');

    self.productDetail = ko.observable();

    self.productImages = ko.observableArray([]);

    self.largeImageProduct = ko.observable();

    self.largeImageId = ko.observable();

    self.searchTerm = ko.observable('');

    //#endregion

    //#region sorting

    self.productSearchResultsSort = ko.observable(SORT_QUANTITY_DESC);

    //#endregion

    self.productSearchResults = ko.observableArray([]);

    self.rangeRecords = ko.observableArray([]);

    self.intersectionObserverOptions = {
        rootMargin: "140px",
        //threshold: 1.0
    }

    self.intersectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(e => {
            //console.log(e);
            let obj = ko.dataFor(e.target);
            if (obj) {
                if (e.isIntersecting) {
                    window.setTimeout(() => {
                        obj.templateName("product-page-group-template");
                    }, 300);
                }
                //else {
                //    obj.templateName("product-page-group-placeholder-template");
                //}
            }
        });
    }, self.intersectionObserverOptions);

    self.completeProductFilterSet = ko.observable([]);

    self.orderReference = {
        observable: ko.observable()
    };

    self.allFulfilmentOptions = ko.observableArray([]);

    self.searchWidgetValue = ko.observable();

    self.tradeAccount = ko.observable({
        TradeAccountID: null // intentional see portal.Stock_Select
    });

    self.productStatusCode = ko.observable();

    self.productStatus = ko.observable();

    self.productClearanceDiscountPercentageOriginal = ko.observable();

    self.productClearanceDiscountPercentage = ko.observable().extend({
        numberUnformatted: {
            minValue: 5,
            maxValue: 95,
            digits: 0,
            currency: {
                FormattingCulture: 'en-GB'
            }
        },
        numeric: {
            params: {
                required: false,
                numericMin: 0,
                numericMax: 100
            }
        }
    });

    self.salesHistoryTabBusyCount = ko.observable(0);

    //#endregion


    //#region Components

    self.searchTermParams = {
        label: "Search by Product Code or Name",
        observable: self.searchTerm,
        focusObservable: ko.observable(),
        busy: ko.observable(),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertable: ko.observable(false),
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        useNativeValidation: false, // this feeds through to mdc objects and affects them
        decorateInputElement: true,
        insertValidationMessages: false,
        enterKey: () => {
            self.gridSettings.widget().dataSource.read();
        }
    }

    self.orderProductsDrilldown = new orderProductsDrilldownViewModel(self, "");

    self.orderProductsDrilldown.tradeAccount = self.tradeAccount();

    self.genericUnsavedChangesSelect = (e) => {
        e.preventDefault(); // this prevents the Kendo control from actively selecting the thing the user selected
        self.checkUnsavedChangesThenSelect(e); // this does our check; async promise, confirm dialog, la la la...
    }

    self.genericUnsavedChangesMultiSelect = (e) => {
        e.preventDefault(); // this prevents the Kendo control from actively selecting the thing the user selected
        self.checkUnsavedChangesThenMultiSelect(e); // this does our check; async promise, confirm dialog, la la la...
    }

    self.genericUnsavedChangesMultiDeselect = (e) => {
        e.preventDefault(); // this prevents the Kendo control from actively selecting the thing the user selected
        self.checkUnsavedChangesThenMultiDeselect(e); // this does our check; async promise, confirm dialog, la la la...
    }

    self.genericUnsavedChangesClear = (e) => {
        self.checkUnsavedChangesThenClear(e);
    }

    self.gridSettings = {
        autoBind: true,
        widget: ko.observable(),
        useKOTemplates: true,
        rowTemplate: "row-template",
        data: new kendo.data.DataSource({
            transport: {
                read: (options) => {

                    self.setBusy();

                    var webapi = new kendo.data.transports.webapi({ prefix: "" });
                    var params = webapi.parameterMap(options.data);

                    var data = {};

                    for (var propertyName in params) {
                        data[propertyName] = params[propertyName];
                    }

                    data = Object.assign(params, {
                        branchId: self.branchId(),
                        productFilterGroupId: self.productFilterGroupId(),
                        productFilterId: self.productFilterId(),
                        brandId: self.brandId(),
                        statusGroupId: self.statusGroupId()
                    });

                    if (self.searchTerm.peek()) {
                        data.searchTerm = self.searchTerm.peek();
                    }

                    let qs = new URLSearchParams(data);

                    //console.log(qs);

                    fetch(`/api/rangeManagementApi/fetchProducts?${qs}`, {
                        method: 'GET',
                        headers: window.fetchHeaders
                    })
                        .then(window.handleFetchResponse)
                        .then(data => {
                            console.log('fetchProducts returned', data);

                            self.previousParameters = params;

                            data.Data = data.Data.map(r => resultRecord({
                                rec: r
                            }));

                            ko.ignoreDependencies(() => {
                                self.clearBusy();
                            });

                            options.success(data);
                        })
                        .catch(err => {
                            self.clearBusy();
                            window.catchFetchError(err);
                        });
                }
            },
            page: 1,
            pageSize: 20,
            serverPaging: false,
            serverSorting: false,
            serverFiltering: false,
            schema: $.extend({}, kendo.data.schemas.webapi, {
                data: "Data",
                total: "Total",
                model: {
                    id: 'ProductID'
                }
            }),
            group: [{
                field: 'ProductFilterName'
            }, {
                field: 'ProductPageName'
            }, {
                field: 'OrderFormGroup'
            }]
        }),
        columns: [{
            field: "ImageID",
            title: " ",
            width: 106
        }, {
            field: "ProductFilterName",
            title: "Product Filter Name",
            width: 200
        }, {
            field: "ProductPageName",
            title: "Product Page Name",
            width: 200,
        }, {
            field: "OrderFormGroup",
            title: "Order Form Group",
            width: 200,
        }, {
            field: "ProductName",
            title: "Product Name",
            width: 200,
        }, {
            field: "ProductCode",
            title: "Product Code",
            width: 140,
        }, {
            field: "Launch",
            title: "Launch",
            width: 140
        }, {
            field: "ProductStatus",
            title: "Product Status",
            width: 140
        }, {
            field: "ProductToRangeSpacer", //////// 
            title: " ",                    ////////     RANGE 
            width: 50                      ////////
        }, {
            field: "RangeStatus",
            title: "Status",
            width: 140
        }, {
            field: "RangeStartDate",
            title: "Start Date",
            width: 140
        }, {
            field: "RangeEndDate",
            title: "End Date",
            width: 140
        }, {
            field: "RangePlanned",
            title: "Planned",
            width: 140,
        }, {
            field: "RangeActual",
            title: "Actual",
            width: 140
        }, {
            field: "RangeInProgress",
            title: "In Progress",
            width: 140
        }, {
            field: "RangeRequired",
            title: "Required",
            width: 140
        }, {
            field: "RangeToActionsSpacer", ////////
            title: " ",                    ////////    ACTIONS
            width: 50                      ////////
        }, {
            field: "ActionRecommendations",
            title: "Recommendations",
            width: 220
        }, {
            field: "ActionQuantityToBranch",
            title: "Quantity to Branch",
            width: 160
        }, {
            field: "ActionQuantityToWH",
            titel: "Quantity to WH",
            width: 160
        }, {
            field: "ActionSubmit",
            title: " ",
            width: 100
        }, {
            field: "ActionNotes",
            title: "Notes",
            width: 200
        }, {
            field: "ActionStockSpacer", ////////
            title: " ",                 ////////    STOCK
            width: 50                   ////////
        }, {
            field: "StockSummary",
            title: "Summary",
            width: 140
        }, {
            field: "StockWarehouse",
            title: "Warehouse",
            width: 140
        }, {
            field: "StockCover",
            title: "Cover",
            width: 140
        }, {
            field: "StockPurchaseOrders",
            title: "Purchase Orders",
            width: 200
        }, {
            field: "StockKingsRoad",
            title: "King's Road",
            width: 140
        }, {
            field: "StockMarylebone",
            title: "Marylebone",
            width: 140
        }, {
            field: "StockFenwickAll",
            title: "Fenwick (All)",
            width: 140
        }, {
            field: "StockRingFenced",
            title: "Ring Fenced",
            width: 140
        }, {
            field: "StockSalesSpacer", ////////
            title: " ",                ////////     SALES
            width: 50                  ////////
        }, {
            field: "SalesSummary",
            title: "Summary",
            width: 140
        }, {
            field: "SalesTotal",
            title: "Total",
            width: 140,
        }, {
            field: "SalesKingsRoad",
            title: "King's Road",
            width: 140
        }, {
            field: "SalesMarylebone",
            title: "Marylebone",
            width: 140
        }, {
            field: "SalesFenwickAll",
            title: "Fenwick (All)",
            width: 140
        }, {
            field: "SalesUKECom",
            title: "UK eCommerce",
            width: 140
        }, {
            field: "SalesUKTrade",
            title: "UK Trade",
            width: 140
        }, {
            field: "SalesROWTrade",
            title: "ROW Trade",
            width: 140
        }],
        sortable: true,
        filterable: {
            extra: false
        },
        selectable: 'single',
        scrollable: {
            endless: true
        },
        height: 900,
        width: 'auto',
        reorderable: true,
        //pageable: {
        //    pageSize: 20,
        //    pageSizes: [10, 20, 50, 100, 200]
        //},
        excelExport: self.exportToExcel,
        change: (e) => {
            //self.modalBusy(true);

            self.openModal(e);
        }
    };

    self.branchParams = kendoMDCDropDownList({
        label: 'Branch',
        odata: true,
        endPoint: '/odata/Branches',
        textField: 'Name',
        valueField: 'BranchID',
        idObservable: self.branchId,
        objObservable: self.branch,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertable: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'branchId'
        },
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear
    });

    self.launchParams = kendoMDCDropDownList({
        label: 'Launch',
        odata: true,
        endPoint: '/odata/Launches',
        textField: 'Name',
        valueField: 'LaunchID',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/Launches/Default.LaunchValueMapper(launchId=${options.value})`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                            if (data.value.length == 1) {
                                self.launch(data.value[0]);
                            }
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        idObservable: self.launchId,
        objObservable: self.launch,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertable: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'desc',
            field: 'launchId'
        },
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear
    });

    self.brandParams = kendoMDCDropDownList({
        label: 'Brand',
        odata: true,
        endPoint: '/odata/Brands',
        textField: 'Name',
        valueField: 'BrandID',
        virtual: false,
        idObservable: self.brandId,
        objObservable: self.brand,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertable: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear
    });

    self.productFilterGroupParams = kendoMDCDropDownList({
        label: 'Product Filter Group',
        data: self.productFilterGroups,
        textField: 'Name',
        valueField: 'ProductFilterGroupID',
        virtual: false,
        idObservable: self.productFilterGroupId,
        objObservable: self.productFilterGroup,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertable: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'Name'
        },
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear
    });

    self.productFilterParams = kendoMDCDropDownList({
        label: 'Product Filter',
        data: self.currentProductFilters,
        //odata: true,
        //endPoint: '/odata/ProductFilters',
        textField: 'Name.replace(/\<br\\/\>/g, " ")',
        valueField: 'ProductFilterID',
        virtual: false,
        idObservable: self.productFilterId,
        objObservable: self.productFilter,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertable: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'Name'
        },
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear
    });

    self.statusGroupParams = kendoMDCDropDownList({
        label: 'Status Group',
        odata: true,
        endPoint: '/odata/StatusGroups',
        textField: 'Name',
        valueField: 'StatusGroupID',
        virtual: false,
        idObservable: self.statusGroupId,
        objObservable: self.statusGroup,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertable: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear
    });

    self.salesDataPageSize = 20;

    self.salesDataSource = new kendo.data.DataSource({
        transport: {
            read: (options) => {

                self.salesHistoryTabBusyCount(self.salesHistoryTabBusyCount() + 1);

                var webapi = new kendo.data.transports.webapi({ prefix: "" });
                var params = webapi.parameterMap(options.data);

                var data = {};

                if (self.productId.peek())
                    data.productId = self.productId.peek();

                for (var propertyName in params) {
                    data[propertyName] = params[propertyName];
                }

                let qs = new URLSearchParams(data);

                //console.log(qs);

                fetch(`/api/stockManagement/FetchSalesHistorySummaryGrid?${qs.toString()}`, {
                    method: 'GET',
                    headers: window.fetchHeaders
                })
                    .then(window.handleFetchResponse)
                    .then(data => {

                        //console.log("FetchSalesHistorySummaryGrid", data);


                        ko.ignoreDependencies(() => {
                            self.salesHistoryTabBusyCount(self.salesHistoryTabBusyCount() - 1);
                        });

                        let gridOptions = self.salesGridSettings.widget().getOptions();

                        if (data.Schema != JSON.stringify(self.salesDataSourceSchema) ||
                            data.Columns != JSON.stringify(self.salesGridColumns) ||
                            self.salesDataPageSize != gridOptions.dataSource.pageSize) {

                            self.salesDataSourceSchema = JSON.parse(data.Schema);

                            self.salesGridColumns = JSON.parse(data.Columns);

                            gridOptions.columns = self.salesGridColumns;

                            gridOptions.dataSource.schema.model = self.salesDataSourceSchema;

                            self.salesGridSettings.widget().setOptions(gridOptions);

                            let chart = self.salesChartSettings.widget();

                            chart.columns = self.salesGridColumns;

                            chart.dataSource.pageSize(gridOptions.dataSource.pageSize);

                            chart.dataSource.options.schema.model = self.salesDataSourceSchema;

                            self.salesChartSettings.widget().setOptions({
                                dataSource: chart.dataSource
                            });

                            self.salesDataPageSize = gridOptions.dataSource.pageSize;

                        }

                        let series = [];
                        let categories = self.salesGridColumns.flatMap(c => {
                            if (c.field.indexOf("_") === 0)
                                return c.title;
                            else
                                return [];
                        });

                        //console.log(categories);

                        data.Data.forEach(d => {
                            if (d.SeriesHidden === false) {
                                let records = [];
                                let seriesColour = null;
                                Object.keys(d).forEach(k => {
                                    if (k.indexOf("_") === 0) {
                                        records.push(d[k]);
                                    }
                                    if (k === "SeriesColour") {
                                        seriesColour = d[k];
                                    }
                                });
                                series.push({
                                    type: "line",
                                    color: seriesColour,
                                    data: records,
                                    name: d.RowDescriptor,
                                    tooltip: {
                                        visible: true
                                    }
                                });
                            }
                        });

                        self.salesChartSettings.widget().setOptions({
                            series: series,
                            categoryAxis: {
                                min: 0,
                                max: 19,
                                categories: categories
                            },
                        });

                        options.success(data);

                        //self.salesChartSettings.widget().resize();
                    })
                    .catch(window.catchFetchError);
            }
        },
        page: 1,
        pageSize: self.salesDataPageSize,
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            model: self.salesDataSourceSchema
        })
    });

    self.salesGridSettings = {
        autoBind: true, // leave this true: the call causes the grid to bind, which is necessary to pull schema and columns
        // even better if we do it without a productId initially!
        widget: ko.observable(),
        columns: self.salesGridColumns,
        data: self.salesDataSource,
        sortable: true,
        filterable: {
            extra: false
        },
        selectable: 'single',
        reorderable: true,
        pageable: {
            pageSize: self.salesDataPageSize,
            pageSizes: [10, 20, 50, 100, 200]
        }
    };

    self.salesChartSettings = {
        autoBind: false,
        widget: ko.observable(),
        dataSource: self.salesDataSource,
        categoryAxis: {
            min: 0,
            max: 19
        },
        pannable: true,
        legend: {
            labels: {
                background: "white",
                color: "black"
            }
        }
        //chartArea: {
        //    width: 1080
        //}
    }

    self.salesHistoryGridPageSize = 20;

    self.salesHistoryDetailGridColumns = [];

    self.salesHistoryDetailGridSchema = {}

    self.salesHistoryDetailGridSettings = {
        autoBind: true,
        widget: ko.observable(),
        columns: [],
        data: new kendo.data.DataSource({
            transport: {
                read: (options) => {

                    self.salesHistoryTabBusyCount(self.salesHistoryTabBusyCount() + 1);

                    var webapi = new kendo.data.transports.webapi({ prefix: "" });
                    var params = webapi.parameterMap(options.data);

                    var data = {};

                    if (self.productId.peek())
                        data.productId = self.productId();

                    for (var propertyName in params) {
                        data[propertyName] = params[propertyName];
                    }

                    let qs = new URLSearchParams(data);

                    //console.log(qs);

                    fetch(`/api/stockManagement/FetchSalesHistoryDetailGrid?${qs.toString()}`, {
                        method: 'GET',
                        headers: window.fetchHeaders
                    })
                        .then(window.handleFetchResponse)
                        .then(data => {

                            //console.log("FetchSalesHistoryDetailGrid", data);

                            ko.ignoreDependencies(() => {
                                self.salesHistoryTabBusyCount(self.salesHistoryTabBusyCount() - 1);
                            });

                            let gridOptions = self.salesHistoryDetailGridSettings.widget().getOptions();

                            if (data.Schema != JSON.stringify(self.salesHistoryDetailGridSchema) ||
                                data.Columns != JSON.stringify(self.salesHistoryDetailGridColumns) ||
                                self.salesHistoryGridPageSize != gridOptions.dataSource.pageSize) {

                                self.salesHistoryDetailGridSchema = JSON.parse(data.Schema);

                                self.salesHistoryDetailGridColumns = JSON.parse(data.Columns);

                                gridOptions.columns = self.salesHistoryDetailGridColumns;

                                self.salesHistoryGridPageSize = gridOptions.dataSource.pageSize;

                                gridOptions.dataSource.schema.model = self.salesHistoryDetailGridSchema;

                                self.salesHistoryDetailGridSettings.widget().setOptions(gridOptions);
                            }

                            options.success(data);
                        })
                        .catch(window.catchFetchError);
                }
            },
            page: 1,
            pageSize: self.salesHistoryGridPageSize,
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            schema: $.extend({}, kendo.data.schemas.webapi, {
                data: "Data",
                total: "Total",
                model: self.salesHistoryDetailGridSchema
            })
        }),
        sortable: true,
        filterable: {
            extra: false
        },
        selectable: 'single',
        reorderable: true,
        pageable: {
            pageSize: self.salesHistoryGridPageSize,
            pageSizes: [10, 20, 50, 100, 200]
        }
    };

    self.orderBookDataPageSize = 20;

    self.orderBookDataSource = new kendo.data.DataSource({
        transport: {
            read: (options) => {

                self.orderBookBusy(true);


                var webapi = new kendo.data.transports.webapi({ prefix: "" });
                var params = webapi.parameterMap(options.data);

                var data = {};

                if (self.productId.peek()) {
                    data.productId = self.productId.peek()
                }

                for (var propertyName in params) {
                    data[propertyName] = params[propertyName];
                }

                let qs = new URLSearchParams(data);

                //console.log(qs);

                fetch(`/api/stockManagement/FetchOrderBook?${qs.toString()}`, {
                    method: 'GET',
                    headers: window.fetchHeaders
                })
                    .then(window.handleFetchResponse)
                    .then(data => {

                        //console.log("FetchOrderBook", data);

                        ko.ignoreDependencies(() => {
                            self.orderBookBusy(false);
                        });

                        let gridOptions = self.orderBookGridSettings.widget().getOptions();

                        if (data.Schema != JSON.stringify(self.orderBookDataSourceSchema) ||
                            data.Columns != JSON.stringify(self.orderBookGridColumns) ||
                            self.orderBookDataPageSize != gridOptions.dataSource.pageSize) {


                            self.orderBookDataSourceSchema = JSON.parse(data.Schema);

                            self.orderBookGridColumns = JSON.parse(data.Columns);

                            gridOptions.columns = self.orderBookGridColumns;

                            gridOptions.dataSource.schema.model = self.orderBookDataSourceSchema;

                            self.orderBookGridSettings.widget().setOptions(gridOptions);

                            self.orderBookDataPageSize = gridOptions.dataSource.pageSize;
                        }

                        options.success(data);
                    })
                    .catch(window.catchFetchError);
            }
        },
        page: 1,
        pageSize: self.orderBookDataPageSize,
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            model: self.orderBookDataSourceSchema
        })
    });

    self.orderBookGridSettings = {
        autoBind: true,
        widget: ko.observable(),
        columns: self.orderBookGridColumns,
        data: self.orderBookDataSource,
        sortable: true,
        filterable: {
            extra: false
        },
        selectable: 'single',
        reorderable: true,
        pageable: {
            pageSize: self.orderBookDataPageSize,
            pageSizes: [10, 20, 50, 100, 200]
        }
    };

    self.productStatusCodeParams = kendoMDCDropDownList({
        autoBind: true,
        label: 'Status',
        data: [{
            Name: "Current (c)",
            Status: "C"
        }, {
            Name: "Pre-Limited (Y)",
            Status: "Y"
        }, {
            Name: "Limited (L)",
            Status: "L"
        }, {
            Name: "Discontinued (D)",
            Status: "D"
        }],
        textField: 'Name',
        valueField: 'Status',
        idObservable: self.productStatusCode,
        objObservable: self.productStatus,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(false),
        revertable: ko.observable(false),
        readOnly: false,
        height: 340,
        sort: {
            dir: 'desc',
            field: 'buyerCode'
        },
        popupSettings: {
            appendTo: document.getElementById('product-status-wrapper')
        },
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear
    });

    self.productClearanceDiscountPercentageParams = {
        label: null,
        observable: self.productClearanceDiscountPercentage,
        focusObservable: ko.observable(false),
        busy: ko.observable(),
        permitRevert: true,
        originalValue: self.productClearanceDiscountPercentageOriginal,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertable: ko.observable(false),
        revertFunction: () => {
            self.productClearanceDiscountPercentage(self.productClearanceDiscountPercentageOriginal());
        },
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        useNativeValidation: false, // this feeds through to mdc objects and affects them
        decorateInputElement: true,
        insertValidationMessages: false,
        inputType: 'number',
        buttons: true,
        minValue: 0,
        maxValue: 10,
        step: 10,
        increment: () => {
            let v = +self.productClearanceDiscountPercentage() || 0;

            let factor = Math.pow(10, 0);

            self.productClearanceDiscountPercentage(Math.round((v + 10) * factor) / factor);
        },
        decrement: () => {
            let v = +self.productClearanceDiscountPercentage() || 0;

            let factor = Math.pow(10, 0);

            self.productClearanceDiscountPercentage(Math.round((v - 10) * factor) / factor);
        }
    };

    //#endregion


    //#region Subscriptions

    self.productFilter.subscribe(pf => {
        if (pf) {
            if (self.productFilterGroupId() != pf.ProductFilterGroupID) {
                self.productFilterGroupId(pf.ProductFilterGroupID);
            }
        }
    });

    self.productFilterGroup.subscribe(pfg => {
        if (pfg) {
            self.currentProductFilters(self.completeProductFilters().filter(pf => pf.ProductFilterGroupID == pfg.ProductFilterGroupID));
            if (self.productFilterId()) {
                if (self.currentProductFilters().find(pf => pf.ProductFilterID == self.productFilterId()) == null) {
                    self.productFilterId(null);
                }
            }
        } else {
            self.currentProductFilters(self.completeProductFilters());
        }
    });

    self.branch.subscribe(branch => {
        console.log('branch', branch);
        if (branch) {
            self.refreshProductFilters(branch);
        } else {
            self.clearProductFilters();
        }
    });

    self.salesHistoryTabBusyCount.subscribe(nv => {
        if (nv > 0) {
            self.salesBusy(true);
        } else {
            self.salesBusy(false);
        }
    });

    //self.branchGroupId.subscribe(nv => {
    //    self.branchParams.clearFunction();
    //});

    self.attributeGroupId.subscribe(nv => {
        self.attributeParams.clearFunction();
        self.attributesParams.clearFunction();
    });

    //#endregion


    //#region Methods

    self.refreshProductFilters = (b) => {
        self.setBusy();
        self.productFilterGroupId(null);
        self.productFilterId(null);
        fetch('/api/rangemanagementapi/FetchProductFilters?' + new URLSearchParams({
                    tradeAccountId: b.TradeAccountID,
                    clearance: 'all', // this is really badly named, it's actually @Lifecycle
                    applicationId: 105
                }),
            {
                method: 'GET',
                headers: window.fetchHeaders
            })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log('fetchProductFilters returned', data);
                self.productFilterGroups(data.ProductFilterGroups);
                self.completeProductFilters(data.ProductFilters);
                self.currentProductFilters(data.ProductFilters);
                self.clearBusy();
            })
            .catch(err => {
                self.clearBusy();
                window.catchFetchError(err);
            });
    }

    self.clearProductFilters = () => {
        self.currentProductFilters([]);
        self.productFilterGroups([]);
    }

    self.openAddToRangeModal = () => {
        self.addToRangeModal.show();
    }

    self.closeAddToRangeModal = () => {
        self.addToRangeModal.hide();
    }

    self.confirmAddToRangeModal = () => {
        window.showConfirm("Are you sure?", `This will add stuff to the other thing`, () => {
            window.showInfo('Sorry', 'Not yet implemented');
        }, () => {

        });
    }

    self.loadLargeImage = function (result) {

        self.largeImageProduct(self.productDetail());

        // this needs to change when you swipe...
        self.largeImageId(result.ImageID);

        $('#large-image-container').html('');

        var imagesHtml = '';

        var startIndex = 0;

        ko.utils.arrayForEach(self.productImages(), function (item, index) {
            if (item.ImageID == result.ImageID) {
                startIndex = index;
            }
            imagesHtml += '<img data-image-id="' + item.ImageID + '" src="https://www.designersguild.com/image/1024/' + item.ImageID + '" />';
        });


        $('#large-image-container').html('<div id="large-image-carousel">' + imagesHtml + '</div>');

        $('#large-image-title').text(self.largeImageProduct().ProductCode + ' - ' + (self.largeImageProduct().ProductName));

        $('.largeimage-nav').empty();

        $('#large-image-wrapper').hide();

        if ($('#large-image-carousel').data('owl.carousel')) {
            $('#large-image-carousel').data('owl.carousel').destroy();
            $('#large-image-carousel .owl-stage').empty();
        }

        window.setTimeout(function () {

            tns({
                container: '#large-image-carousel',
                navContainer: '.largeimage-nav',
                controlsText: ['<i class="material-icons">keyboard_arrow_left</i>', '<i class="material-icons">keyboard_arrow_right</i>'],
                gutter: 10,
                loop: false,
                nav: false,
                mouseDrag: true,
                startIndex: startIndex
            });

            $('#large-image-carousel').closest('.tns-outer').addClass('controls-padded');

            $("#image-modal").modal('show');

            $('#large-image-wrapper').show();

        }, 0);

        $('#large-image-container').show();

    }

    self.setBusy = () => {
        switch (self.view()) {
            case VIEW_MANAGE:
                self.manageBusy(true);
                break;
            case VIEW_RESTOCK:
                self.restockBusy(true);
                break;
            case VIEW_RECALL:
                self.recallBusy(true);
                break;
            default:
                break;
        }
    }

    self.clearBusy = () => {
        switch (self.view()) {
            case VIEW_MANAGE:
                self.manageBusy(false);
                break;
            case VIEW_RESTOCK:
                self.restockBusy(false);
                break;
            case VIEW_RECALL:
                self.recallBusy(false);
                break;
            default:
                break;
        }
    }

    self.checkUnsavedChangesThenSelect = async (event) => {
        await self.unsavedChanges().then((d) => {
            //console.log('go', event.sender.options.dataValueField, event.dataItem[event.sender.options.dataValueField]);
            event.sender._widgetOptions.value(event.dataItem[event.sender.options.dataValueField]);

        }).catch((e) => { });
    }

    self.checkUnsavedChangesThenMultiSelect = async (event) => {
        await self.unsavedChanges().then((d) => {
            //console.log('go', event.sender.options.dataValueField, event.dataItem[event.sender.options.dataValueField]);
            let v = event.sender._widgetOptions.value();

            v.push(event.dataItem[event.sender.options.dataValueField]);

            event.sender.value(v);

            event.sender.trigger('change');

        }).catch((e) => { });
    }

    self.checkUnsavedChangesThenMultiDeselect = async (event) => {
        await self.unsavedChanges().then((d) => {
            //console.log('go', event.sender.options.dataValueField, event.dataItem[event.sender.options.dataValueField]);
            let v = event.sender._widgetOptions.value();

            v = v.filter(i => i != event.dataItem[event.sender.options.dataValueField]);

            event.sender.value(v);

            event.sender.trigger('change');

        }).catch((e) => { });
    }

    self.checkUnsavedChangesThenClear = async (options) => {
        await self.unsavedChanges().then(() => {
            var self = options; // self is now the params of the control the user just interacted with

            if (ko.isObservableArray(self.observable)) {
                self.observable([]);
            } else {
                self.observable(undefined);
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
        }).catch((e) => { });
    }

    self.unsavedChanges = () => {
        return new Promise((resolve, reject) => {
            let unsaved = self.productSearchResults.peek().find(p => p.unsavedChanges());

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

    self.saveChanges = () => {
        if (self.productSearchResults().find(p => p.unsavedChanges())) {
            self.setBusy();

            let products = self.productSearchResults().filter(p => p.unsavedChanges());

            products.forEach(p => {
                p.preSave();
            });

            let params = {
                products: products.map(p => p.toJS())
            };

            fetch('/api/stockManagement/saveStockManagementChanges', {
                method: 'POST',
                headers: window.fetchHeaders,
                body: JSON.stringify(params)
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    window.showInfo("Success", "Your changes have been saved!");

                    products.forEach(p => {
                        p.postSave(true);
                    });

                    self.clearBusy();
                })
                .catch(err => {
                    products.forEach(p => {
                        p.postSave(false);
                    });

                    self.clearBusy();
                    window.catchFetchError(err);
                });
        } else {
            window.showInfo("Information", "You have no unsaved changes.");
        }
    }

    self.requestStatusChange = () => {
        self.changeStatusBusy(true);
        fetch('/api/stockManagement/RequestStatusChange', {
            method: 'POST',
            headers: window.fetchHeaders,
            body: JSON.stringify({
                productId: self.productId(),
                status: self.productStatusCode(),
                clearanceDiscountPercentage: self.productClearanceDiscountPercentage()
            })
        })
            .then(window.handleFetchResponse)
            .then(data => {
                self.closeChangeStatusModal();

                if (data.ErrorNumber === 0) {
                    window.showInfo("Success", "Your changes have been saved");
                    self.productClearanceDiscountPercentageOriginal(self.productClearanceDiscountPercentage());
                } else {
                    window.showInfo("Sorry", data.ErrorMessage);
                }

                self.changeStatusBusy(false);
            })
            .catch(err => {
                self.changeStatusBusy(false);
                window.catchFetchError(err);
            });
    }

    //#endregion


    //#region Computeds

    self.groupBy = (items, key, dataSetName) => {
        const groupedMap = new Map();

        for (const e of items) {
            if (!groupedMap.has(e[key])) {
                groupedMap.set(e[key], []);
            }
            groupedMap.get(e[key]).push(e);
        }

        const result = [];

        groupedMap.forEach((v, k) => {
            let obj = {
                key: k,
                idKey: k.toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9\-]/g, ''),
                element: ko.observable(false),
                templateName: ko.observable("product-page-group-placeholder-template"),
            }
            obj.ready = () => {
                self.intersectionObserver.observe(obj.element.DOMElement);
            }
            obj[dataSetName] = v;
            obj.templateName.subscribe(nv => {
                //console.log(nv);
            });

            obj.targetTotal = ko.computed(() => {
                return 0;// obj[dataSetName].reduce((a0, p0) => a0 += p0.branchTargetParams.originalValue, 0);
            }, self);

            obj.branchGroupTargetTotal = ko.computed(() => {
                return 0;// obj[dataSetName].reduce((a0, p0) => a0 += p0.branchGroupTarget(), 0);
            }, self);

            result.push(obj);
        });

        return result;
    }

    self.groupedSortedSearchResults = ko.computed(() => {

        let key = "ProductPageHeading";

        let results = self.groupBy(self.productSearchResults(), key, 'orderFormGroups');

        //console.log(key, results);

        key = "OrderFormGroupName";

        results.forEach(r => {
            r.orderFormGroups = self.groupBy(r.orderFormGroups, key, 'products');
        });

        //console.log(key, results);

        return results;

        // self.productSearchResults().sort((a, b) => a.BranchGroup?.Quantity > b.BranchGroup?.Quantity ? -1 : 1);
    }, self);

    //#endregion


    //#region Events

    //document.getElementById("prelaunch-tab-anchor").addEventListener('show.bs.tab', () => {
    //    self.stockStatusGroupId(TAB_PRELAUNCH);
    //});

    console.log('grid horiz scroll fix? look here');
    //$("#Grid-ID").data("kendoGrid").wrapper.find(".k-grid-header-wrap").off("scroll.kendoGrid");

    document.getElementById("range-tab-anchor").addEventListener('show.bs.tab', () => {
        self.view(TAB_RANGE);
    });

    document.getElementById("restock-tab-anchor").addEventListener('show.bs.tab', () => {
        self.view(TAB_RESTOCK);
    });

    document.getElementById("recall-tab-anchor").addEventListener('show.bs.tab', () => {
        self.view(TAB_RECALL);
    });

    //self.detailModalElement.addEventListener("shown.bs.modal", () => {
    //    window.setTimeout(() => {
    //        //console.log('detail-modal shown, resizing chart...');
    //        //self.salesChartSettings.widget().resize();
    //        //self.salesChartSettings.widget().redraw();
    //    }, 0);
    //})

    window.addEventListener("onbeforeunload", (event) => {
        self.checkUnsavedChangesThenSelect = async (event) => {
            await self.unsavedChanges().then((d) => {

            }).catch((e) => { });
        }
    });

    self.windowResizeTimeout = 100; //ms

    self.windowResizedCallback = () => {
        // Haven't resized in self.resizeTimeout ms!
        //self.salesChartSettings.widget().resize();
    }

    self.onWindowResize = function () {
        window.clearTimeout(self.resizeCounter);
        self.resizeCounter = window.setTimeout(self.windowResizedCallback, self.windowResizeTimeout);
    };

    window.addEventListener("resize", self.onWindowResize);

    //#endregion

    return self;
};

//const resultRecord = ((rec, branchGroupRecords, rangeRecords, contrastRecords) => {
const resultRecord = function ({
    rec
} = {
        rec: null
    }) {
    let self = Object.assign({}, rec);

    self.indentCells = [];

    if (self.ProductFilterName)
        self.indentCells.push(0);
    if (self.ProductPageName ? 1 : 0)
        self.indentCells.push(0);
    if (self.OrderFormGroup ? 1 : 0)
        self.indentCells.push(0);

    self.toJS = () => {
        return {
            ProductID: self.ProductID,
            Quantity: self.branchTarget()
        }
    }

    self.preSave = () => {
        self.branchTargetBusy(true);
    }

    self.postSave = (success) => {
        if (success) {
            self.branchTargetParams.originalValue = self.branchTarget();
            self.branchTargetParams.unsavedChanges(false);
            self.branchTargetBusy(false);
        } else {
            self.branchTargetBusy(false);
        }
    }

    self.unsavedChanges = ko.computed(() => {
        //console.warn("not yet implemented");
        return false;
    }, self);

    return self;
}