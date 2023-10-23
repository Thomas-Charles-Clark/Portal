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

    self.fetchDataBusy = ko.observable(false);

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

    self.branchId = ko.observable(4);
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
    self.productFilterGroupId = ko.observable('');

    self.searchResults = ko.observableArray([]);

    self.completeProductFilters = ko.observableArray([]);
    self.currentProductFilters = ko.observableArray([]);
    self.productFilter = ko.observable();
    self.productFilterId = ko.observable('');

    self.buyer = ko.observable();
    self.buyerCode = ko.observable('');

    self.supplier = ko.observable();
    self.supplierCode = ko.observable('');

    self.productDetail = ko.observable();

    self.productImages = ko.observableArray([]);

    self.largeImageProduct = ko.observable();

    self.largeImageId = ko.observable();

    self.searchTerm = ko.observable().extend({
        rateLimit: {
            timeout: 500,
            method: 'notifyWhenChangesStop'
        }
    });

    self.visibleRecords = ko.observableArray([]);

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

    self.gridDataSource = new kendo.data.DataSource({
        transport: {
            read: (options) => {

                //self.setBusy();

                var webapi = new kendo.data.transports.webapi({ prefix: "" });
                var params = webapi.parameterMap(options.data);

                var data = {};

                for (var propertyName in params) {
                    data[propertyName] = params[propertyName];
                }

                data = Object.assign(params, self.gridParams());

                let qs = new URLSearchParams(data);

                //console.log(qs);

                fetch(`/api/rangeManagementApi/FetchProducts?${qs}`, {
                    method: 'GET',
                    headers: window.fetchHeaders
                })
                    .then(window.handleFetchResponse)
                    .then(data => {
                        console.log('fetchProducts returned', data);

                        self.previousParameters = params;

                        data.Data = data.Data.map(r => {
                            return resultRecord({
                                branchId: self.branchId(),
                                rec: r,
                                productFilter: ko.computed(() => {
                                    return self.completeProductFilters().find(p => p.ProductFilterID == r.ProductFilterID)
                                }, self)
                            });
                        });

                        //ko.ignoreDependencies(() => {
                        //    //self.clearBusy();
                        //});

                        self.searchResults(data.Data);

                        options.success(data);
                    })
                    .catch(err => {
                        self.clearBusy();
                        window.catchFetchError(err);
                    });
            }
        },
        pagepage: 1,
        //pageSize: 10000000,
        pageSize: 10,
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
            field: "ProductFilterName",
            aggregates: [{
                field: "ProductFilterName",
                aggregate: "count"
            }, {
                field: "RangePlanned",
                aggregate: "sum"
            }]
        }, {
            field: "ProductPageName"
        }, {
            field: "OrderFormGroup"
        }]
    });

    self.removeEmptyGroupingRows = () => {
        $('p.k-reset:contains("null")').each((n, e) => {
            $(e).parent().parent().remove();
        });
    }

    self.parseView = (items, array) => {
        items.forEach(item => {
            if (item.hasOwnProperty("ProductID")) {
                array.push(item);
            } else {
                self.parseView(item.items, array);
            }
        });
    }

    self.gridSettings = {
        autoBind: false,
        widget: ko.observable(),
        useKOTemplates: true,
        rowTemplate: "row-template",
        data: self.gridDataSource,
        columns: [{
            title: "Product Filter Name",
            field: "ProductFilterName",
            groupHeaderTemplate: (r) => {
                //console.log(r);
                let productArray = self.searchResults().filter(sr => sr.ProductFilterName == r.value);
                let productPageSet = new Set(productArray.flatMap(sr => sr.ProductPageName));

                if (r.value === 'Candles') {
                    let f = 0;
                }

                let rangePlannedCount = productArray.reduce((acc, val) => acc + (val.rangePlanned() ?? 0), 0);

                let rangePlannedValue = productArray.reduce((acc, val) => acc + ((val.rangePlanned() ?? 0) * (val.unitCostPriceGBP() ?? 0)), 0);

                let rangeActualCount = productArray.reduce((acc, val) => acc + (val.rangeActual() ?? 0), 0);

                let rangeActualValue = productArray.reduce((acc, val) => acc + ((val.rangeActual() ?? 0) * (val.unitCostPriceGBP() ?? 0)), 0);

                let rangeInProgressCount = productArray.reduce((acc, val) => acc + (val.rangeInProgress() ?? 0), 0);

                let rangeInProgressValue = productArray.reduce((acc, val) => acc + ((val.rangeInProgress() ?? 0) * (val.unitCostPriceGBP() ?? 0)), 0);

                let resultString = ``;

                if (productPageSet.size == 1 && productPageSet[0] == null) {
                    resultString = `<span class="group-heading product-filter-name">${r.value} (${productArray.length} Product${productArray.length == 1 ? '' : 's'})</span>`;
                } else {
                    resultString = `<span class="group-heading product-filter-name">${r.value} (${productPageSet.size} Product Page${productPageSet.size == 1 ? '' : 's'}, ${productArray.length} Product${productArray.length == 1 ? '' : 's'})</span>`;
                }

                // add rangePlanned
                resultString += `<span class="range-total range-planned bold">${formatCurrency(rangePlannedValue, 0, "en-GB", "GBP")} (${formatNumber(rangePlannedCount, 0, "en-GB")})</span>`;

                // add rangeActual
                resultString += `<span class="range-total range-actual bold">${formatCurrency(rangeActualValue, 0, "en-GB", "GBP")} (${formatNumber(rangeActualCount, 0, "en-GB")})</span>`;

                // add rangeInProgress
                resultString += `<span class="range-total range-in-progress bold">${formatCurrency(rangeInProgressValue, 0, "en-GB", "GBP")} (${formatNumber(rangeInProgressCount, 0, "en-GB")})</span>`;

                return resultString;
            },
            hidden: true
        }, {
            title: "Product Page Name",
            field: "ProductPageName",
            groupHeaderTemplate: (r) => {
                return `<span class="group-heading product-page-name">${r.value}</span>`;
            },
            hidden: true
        }, {
            title: "Order Form Group",
            field: "OrderFormGroup",
            groupHeaderTemplate: (r) => {
                return `<span class="group-heading order-form-group">${r.value}</span>`;
            },
            hidden: true
        }, {
            title: " ",
            width: 400,
            headerTemplate: `<span class="group-heading header-blue"></span>`,
            
        }, {
            title: "Range",
            columns: [{
                field: "RangeStatus",
                title: "Status",
                width: 140
            }, {
                    field: "RangePlanned",
                    title: "Planned",
                    width: 182,
                    headerAttributes: {
                        class: "text-end"
                    },
                    aggregates: ["sum"]
                }, {
                    field: "RangeActual",
                    title: "Actual",
                    width: 100,
                    headerAttributes: {
                        class: "text-end"
                    },
                    aggregates: ["sum"]
                }, {
                    field: "RangeInProgress",
                    title: "In Progress",
                    width: 100,
                    headerAttributes: {
                        class: "text-end"
                    }
                }, {
                    field: "RangeRequired",
                    title: "Required",
                    width: 80,
                    headerAttributes: {
                        class: "text-end"
                    }
                }
            ]
        }, {
            title: "Actions",
            columns: [{
                field: "ActionRecommendations",
                title: "Recommendations",
                width: 220
            }, {
                    field: "ActionQuantityToBranch",
                    title: "Quantity to Branch",
                    width: 190,
                    headerAttributes: {
                        class: "text-end"
                    }
                }, {
                    field: "ActionQuantityToWH",
                    title: "Quantity to WH",
                    width: 190,
                    headerAttributes: {
                        class: "text-end"
                    }
                }, {
                    field: "ActionSubmit",
                    title: " ",
                    width: 100,
                    filterable: false
                }, {
                    field: "ActionNotes",
                    title: "Notes",
                    width: 200
                }]
        }, {
            title: "Stock",
            columns: [{
                field: "StockSummary",
                title: "Summary",
                width: 140
            }, {
                    field: "StockWarehouse",
                    title: "Warehouse",
                    width: 140,
                    headerAttributes: {
                        class: "text-end"
                    }
                }, {
                    field: "StockCover",
                    title: "Cover",
                    width: 140,
                    headerAttributes: {
                        class: "text-end"
                    }
                }, {
                    field: "StockPurchaseOrdersFreeStock",
                    title: "Purchase Order",
                    width: 200,
                    headerAttributes: {
                        class: "text-end"
                    }
                }, {
                    field: "StockPurchaseOrdersDueDate",
                    title: "Due Date",
                    width: 200
                }, {
                    field: "StockKingsRoad",
                    title: "King's Road",
                    width: 140,
                    headerAttributes: {
                        class: "text-end"
                    }
                }, {
                    field: "StockMarylebone",
                    title: "Marylebone",
                    width: 140,
                    headerAttributes: {
                        class: "text-end"
                    }
                }, {
                    field: "StockFenwickAll",
                    title: "Fenwick (All)",
                    width: 140,
                    headerAttributes: {
                        class: "text-end"
                    }
                }, {
                    field: "StockRingFenced",
                    title: "Ring Fenced",
                    width: 140,
                    headerAttributes: {
                        class: "text-end"
                    }
                }]
        }, {
            title: "Sales",
            columns: [{
                field: "SalesSummary",
                title: "Summary",
                width: 140
            }, {
                    field: "SalesTotal",
                    title: "Total",
                    width: 140,
                    headerAttributes: {
                        class: "text-end"
                    }
                }, {
                    field: "SalesKingsRoad",
                    title: "King's Road",
                    width: 140,
                    headerAttributes: {
                        class: "text-end"
                    }
                }, {
                    field: "SalesMarylebone",
                    title: "Marylebone",
                    width: 140,
                    headerAttributes: {
                        class: "text-end"
                    }
                }, {
                    field: "SalesFenwickAll",
                    title: "Fenwick (All)",
                    width: 140,
                    headerAttributes: {
                        class: "text-end"
                    }
                }, {
                    field: "SalesUKECom",
                    title: "UK eCommerce",
                    width: 140,
                    headerAttributes: {
                        class: "text-end"
                    }
                }, {
                    field: "SalesUKTrade",
                    title: "UK Trade",
                    width: 140,
                    headerAttributes: {
                        class: "text-end"
                    }
                }, {
                    field: "SalesROWTrade",
                    title: "ROW Trade",
                    width: 140,
                    headerAttributes: {
                        class: "text-end"
                    },
                    hidden: true
                }]
        }],
        sortable: true,
        groupable: false,
        filterable: false,
        selectable: false,
        scrollable: {
            endless: true
        },
        pageable: {
            numeric: false,
            previousNext: false,
            messages: {
                display: "{2} items"
            }
        },
        height: 1000,
        width: 'auto',
        reorderable: true,
        //pageable: {
        //      20,
        //    pageSizes: [10, 20, 50, 100, 200]
        //},
        excelExport: self.exportToExcel,
        noRecords: {
            template: `<div class="empty-cover"><h4>No Results</h4></div>`,
        },
        change: (e) => {
            //self.modalBusy(true);

            //self.openModal(e);
        },
        dataBound: (e) => {
            self.removeEmptyGroupingRows();

            let data = e.sender.dataSource.view();

            let array = [];

            self.parseView(data, array);

            self.visibleRecords(array);

            // This is necessary if you're paging because
            // if you're paging and endless scrolling and grouping something very stupid happens with the 
            // groups not being completely filled so... you tell the grid to refresh and then it scroll itself argh
            if (self.gridScrollRestoration) {
                document.querySelector("#results-grid .k-grid-content.k-auto-scrollable").scrollTo(0, self.gridScrollRestoration);
                self.gridScrollRestoration = null;
            }
        },
        columnResize: (e) => {
            self.removeEmptyGroupingRows();
        }
    };

    self.branchParams = kendoMDCDropDownList({
        label: 'Please select a Branch',
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
        //self.setBusy();
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
                console.log('FetchProductFilters returned', data);
                self.productFilterGroups(data.ProductFilterGroups);
                self.completeProductFilters(data.ProductFilters);
                self.currentProductFilters(data.ProductFilters);
                //self.clearBusy();
            })
            .catch(err => {
                //self.clearBusy();
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
            let unsaved = self.searchResults.peek().find(p => p.unsavedChanges());

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
        if (self.searchResults().find(p => p.unsavedChanges())) {
            self.setBusy();

            let products = self.searchResults().filter(p => p.unsavedChanges());

            products.forEach(p => {
                p.preSave();
            });

            let params = {
                products: products.map(p => p.toJS())
            };

            fetch('/api/rangeManagementApi/UpsertRange', {
                method: 'POST',
                headers: window.fetchHeaders,
                body: JSON.stringify(params)
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    //window.showInfo("Success", "Your changes have been saved!");

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

    self.gridParamsFirstRun = true;

    self.gridParams = ko.computed(() => {
        console.log('gridParams computed');

        let props = {
            branchId: self.branchId(),
            productFilterGroupId: self.productFilterGroupId(),
            productFilterId: self.productFilterId(),
            brandId: self.brandId(),
            statusGroupId: self.statusGroupId()
        };

        if (self.searchTerm())
            props.searchTerm = self.searchTerm();

        if (self.gridParamsFirstRun)
            self.gridParamsFirstRun = false;
        else {
            window.setTimeout(() => {
                if (self.gridSettings.widget())
                    self.gridSettings.widget().dataSource.read();
            }, 0);
        }

        return props;
    }, self).extend({
        rateLimit: {
            timeout: 50,
            method: 'notifyWhenChangesStop'
        }
    });

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

    self.visibleProductIds = ko.computed(() => {
        return self.visibleRecords().map(vp => vp.ProductID)
    }, self).extend({
            rateLimit: {
                timeout: 50,
                method: 'notifyWhenChangesStop'
            }
    });

    self.unfilledRecordProductIds = ko.computed(() => {
        return self.visibleRecords().filter(vr => !vr.loaded()).map(vr => vr.ProductID);
    }, self);

    self.fetchData = ko.computed(() => {
        if (self.unfilledRecordProductIds().length) {

            self.fetchDataBusy(true);

            fetch('/api/rangemanagementapi/FetchData', {
                method: 'POST',
                headers: window.fetchHeaders,
                body: JSON.stringify({
                    branchId: self.branchId(),
                    productIds: self.unfilledRecordProductIds()
                })
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    data.Results.forEach(r => {
                        let rec = self.visibleRecords().find(vr => vr.ProductID == r.ProductID);

                        rec.actionRecommendations(r.Action_Recommendation);

                        rec.actionTransferToBranchHighlight(r.Action_TransferToBranchHighlight);
                        rec.actionTransferToBranchQuantityOriginal(r.Action_TransferToBranchQuantity);
                        rec.actionTransferToBranchQuantity(r.Action_TransferToBranchQuantity);
                        rec.actionTransferToBranchBasketItemId(r.WH2BR_BasketItemID);

                        if (r.WH2BR_BasketItemID) {
                            rec.actionTransferToBranchQuantityParams.disable(true);
                        }

                        rec.actionTransferToWarehouseHighlight(r.Action_TransferToWarehouseHighlight);
                        rec.actionTransferToWarehouseQuantityOriginal(r.Action_TransferToWarehouseQuantity);
                        rec.actionTransferToWarehouseQuantity(r.Action_TransferToWarehouseQuantity);
                        rec.actionTransferToWarehouseBasketItemId(r.BR2WH_BasketItemID);

                        if (r.BR2WH_BasketItemID) {
                            rec.actionTransferToWarehouseQuantityParams.disable(true);
                        }

                        rec.rangeStatus(r.Range_Status)
                        rec.rangeActual(r.Range_Actual);
                        rec.rangePlanned(r.Range_Planned);
                        rec.rangePlannedOriginal(r.Range_Planned);
                        rec.rangeRequired(r.Range_Required);

                        rec.sales180DayFW(r.Sales_180Day_FW);
                        rec.sales180DayKR(r.Sales_180Day_KR);
                        rec.sales180DayMHS(r.Sales_180Day_MHS);
                        rec.sales180DayUKEcommerce(r.Sales_180Day_UKEcommerce);
                        rec.sales180DayUKTrade(r.Sales_180Day_UKTrade);
                        rec.sales180DayROWTrade(r.Sales_180Day_ROWTrade);
                        rec.sales180DayTotal(r.Sales_180Day_Total);
                        rec.salesSummary(r.Sales_Summary);
                        rec.salesCover(r.Sales_Cover);

                        rec.stockCover(r.Stock_Cover);
                        rec.stockFWFreeStock(r.Stock_FW_FreeStock);
                        rec.stockKRFreeStock(r.Stock_KR_FreeStock);
                        rec.stockMHSFreeStock(r.Stock_MHS_FreeStock);
                        rec.stockWHFreeStock(r.Stock_WH_FreeStock);
                        rec.stockWHNextPODueDate(r.Stock_WH_NextPODueDate);
                        rec.stockWHNextPOFreeStock(r.Stock_WH_NextPOFreeStock);
                        rec.stockSummary(r.Stock_Summary);

                        rec.unitCostPriceGBP(r.UnitCostPriceGBP);

                        rec.loaded(true);
                    });

                    self.fetchDataBusy(false);

                // This is necessary if you're paging because
                // if you're paging and endless scrolling and grouping something very stupid happens with the
                // groups not being completely filled so... you tell the grid to refresh and then it scroll itself argh
                    self.gridScrollRestoration = document.querySelector("#results-grid .k-grid-content.k-auto-scrollable").scrollTop;
                    self.gridSettings.widget().refresh();
                ///

                    console.log('FetchData returned', data);
                })
                .catch(err => {
                    self.clearBusy();
                    window.catchFetchError(err)
                });
        }
    }, self).extend({
        rateLimit: {
            timeout: 100,
            method: 'notifyWhenChangesStop'
        }
    });

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

    self.gridSettings.widget.subscribe(nv => {

        document.querySelector(".k-grid-content.k-auto-scrollable").addEventListener("scroll", (e, v) => {
            let norecords = document.querySelector(".k-grid-content.k-auto-scrollable .k-grid-norecords")
            if (norecords) {
                norecords.style.transform = `translateX(${e.target.scrollLeft}px)`;
            }
            let diff = 0;
            document.querySelectorAll('.product-card-tooltip').forEach(c => {
                c.style.transform = `translateX(${e.target.scrollLeft + diff}px)`;
            });
            document.querySelectorAll('.group-heading').forEach(c => {
                c.style.transform = `translateX(${e.target.scrollLeft}px)`;
            });
        });
    });

    //#endregion

    return self;
};

//const resultRecord = ((rec, branchGroupRecords, rangeRecords, contrastRecords) => {
const resultRecord = function ({
    branchId,
    rec,
    productFilter
} = {
        branchId: null,
        rec: null,
        productFilter: ko.computed(() => { })
    }) {
    console.log(productFilter);

    let self = Object.assign({}, rec);

    self.branchId = branchId;

    self.busy = ko.observable(false);

    self.loaded = ko.observable(false);

    self.defaultNumericalExtension = {
        numberUnformatted: {
            minValue: 0,
            maxValue: 999999,
            digits: 0,
            currency: {
                FormattingCulture: 'en-GB'
            }
        },
        numeric: {
            params: {
                required: false,
                numericMin: 0,
                numericMax: 999999
            }
        }
    };

    self.incrementAmount = ko.observable(1);
    self.scale = ko.observable(0);

    // don't forget to set your originals to currents on save

    self.actionRecommendations = ko.observable();
    self.actionTransferToBranchHighlight = ko.observable();
    self.actionTransferToBranchQuantityOriginal = ko.observable();
    self.actionTransferToBranchQuantity = ko.observable().extend(self.defaultNumericalExtension);
    self.actionTransferToBranchBasketItemId = ko.observable();
    self.actionTransferToWarehouseHighlight = ko.observable();
    self.actionTransferToWarehouseQuantityOriginal = ko.observable();
    self.actionTransferToWarehouseQuantity = ko.observable().extend(self.defaultNumericalExtension);
    self.actionTransferToWarehouseBasketItemId = ko.observable();

    self.rangeStatus = ko.observable();
    self.rangeActual = ko.observable();
    //self.rangeStartDate = ko.observable();
    //self.rangeEndDate = ko.observable();
    self.rangePlannedOriginal = ko.observable();
    self.rangePlanned = ko.observable().extend(self.defaultNumericalExtension);
    self.rangeRequired = ko.observable();
    self.rangeInProgress = ko.observable();

    self.sales180DayFW = ko.observable();
    self.sales180DayKR = ko.observable();
    self.sales180DayMHS = ko.observable();
    self.sales180DayUKEcommerce = ko.observable();
    self.sales180DayUKTrade = ko.observable();
    self.sales180DayROWTrade = ko.observable();
    self.sales180DayTotal = ko.observable();
    self.salesSummary = ko.observable();
    self.salesCover = ko.observable();

    self.stockCover = ko.observable();
    self.stockFWFreeStock = ko.observable();
    self.stockKRFreeStock = ko.observable();
    self.stockMHSFreeStock = ko.observable();
    self.stockWHFreeStock = ko.observable();
    self.stockWHNextPODueDate = ko.observable();
    self.stockWHNextPOFreeStock = ko.observable();
    self.stockRingFence = ko.observable();
    self.stockSummary = ko.observable();

    self.unitCostPriceGBP = ko.observable();

    self.notes = ko.observable();






    productFilter.subscribe(pf => {

        self.incrementAmount(pf.QuantityIncrement || 1);

        self.scale(pf.QuantityPrecision);

        let productFilterNumericalExtension = {
            numberUnformatted: {
                minValue: pf.QuantityMinimum,
                maxValue: 999999,
                digits: self.scale(),
                currency: {
                    FormattingCulture: 'en-GB'
                }
            },
            numeric: {
                params: {
                    required: false,
                    numericMin: pf.QuantityMinimum,
                    numericMax: 999999
                }
            }
        };

        self.rangePlanned.extend(productFilterNumericalExtension);
        self.actionTransferToWarehouseQuantity.extend(productFilterNumericalExtension);
        self.actionTransferToBranchQuantity.extend(productFilterNumericalExtension);
    });

    self.buildNumericParams = (observable, original, incrementAmount, scale) => {
        return {
            label: null,
            observable: observable,
            focusObservable: ko.observable(false),
            busy: ko.observable(),
            permitRevert: true,
            originalValue: original,
            enable: ko.observable(true),
            disable: ko.observable(false),
            clearable: ko.observable(true),
            revertable: ko.observable(true),
            revertFunction: function () {
                let self = this;
                self.observable(self.originalValue());
            },
            clearFunction: function () {
                var self = this;
                self.observable(undefined);
                self.observable.DOMElement.focus();
            },
            useNativeValidation: false, // this feeds through to mdc objects and affects them
            decorateInputElement: true,
            insertValidationMessages: false,
            inputType: 'number',
            buttons: true,
            minValue: 1, // don't have productFilter record in time to set this truthfully, sorry
            maxValue: 999999,
            step: 1,
            cssClasses: null,
            incrementAmount: incrementAmount,
            increment: function () {
                let self = this;

                let v = +self.observable() || 0;

                let factor = Math.pow(10, scale());

                if ((v + self.incrementAmount()) < 1000000)
                    self.observable(Math.round((v + self.incrementAmount()) * factor) / factor);
            },
            decrement: function () {
                let self = this;

                let v = +self.observable() || 0;

                let factor = Math.pow(10, scale());

                let diff = Math.round((v - self.incrementAmount()) * factor) / factor;

                if ((v - self.incrementAmount()) > 0)
                    self.observable(diff);
            }
        }
    };

    self.loaded.subscribe(_ => {
        self.rangePlanned.subscribe(nv => {
            if (nv != self.rangePlannedOriginal()) {
                self.rangePlannedParams.busy(true);
                self.rangePlannedParams.disable(true);

                fetch('/api/rangeManagementApi/UpsertRange', {
                    method: 'POST',
                    headers: window.fetchHeaders,
                    body: JSON.stringify({
                        branchId: self.branchId,
                        range: [{
                            productId: self.ProductID,
                            quantity: nv
                        }]
                    })
                })
                    .then(window.handleFetchResponse)
                    .then(data => {
                        self.rangePlannedOriginal(nv);
                        self.rangePlannedParams.busy(false);
                        self.rangePlannedParams.disable(false);
                    })
                    .catch(err => {
                        self.rangePlannedParams.busy(false);
                        self.rangePlannedParams.disable(false);
                        window.catchFetchError(err);
                    });
            }
        });
    });

    self.rangePlannedParams = self.buildNumericParams(
        self.rangePlanned,
        self.rangePlannedOriginal,
        self.incrementAmount,
        self.scale);

    self.rangePlannedParams.revertable(false);

    self.actionTransferToWarehouseQuantityParams = self.buildNumericParams(
        self.actionTransferToWarehouseQuantity,
        self.actionTransferToWarehouseQuantityOriginal,
        self.incrementAmount,
        self.scale);

    self.actionTransferToBranchQuantityParams = self.buildNumericParams(
        self.actionTransferToBranchQuantity,
        self.actionTransferToBranchQuantityOriginal,
        self.incrementAmount,
        self.scale);

    self.toJS = () => {
        return {
            ProductID: self.ProductID,
            Quantity: self.branchTarget()
        }
    }

    self.preSave = () => {
        self.busy(true);
    }

    self.postSave = (success) => {
        if (success) {
            self.rangePlannedOriginal(self.rangePlanned());
            self.actionTransferToBranchQuantityOriginal(self.actionTransferToBranchQuantity());
            self.actionTransferToWarehouseQuantityOriginal(self.actionTransferToWarehouseQuantity());
            self.busy(false);
        } else {
            self.busy(false);
        }
    }

    self.unsavedChanges = ko.computed(() => {
        return (self.rangePlanned() != self.rangePlannedOriginal()) ||
            (self.actionTransferToBranchQuantity() != self.actionTransferToBranchQuantityOriginal()) ||
            (self.actionTransferToWarehouseQuantity() != self.actionTransferToWarehouseQuantityOriginal())
    }, self);

    self.submitTransfers = () => {
        if (self.actionTransferToBranchQuantity() != self.actionTransferToBranchQuantityOriginal()) {
            self.submitTransferWH2BR();
        }

        if (self.actionTransferToWarehouseQuantity() != self.actionTransferToWarehouseQuantityOriginal()) {
            self.submitTransferBR2WH();
        }
    }

    self.submitTransferWH2BR = () => {
        self.actionTransferToBranchQuantityParams.busy(true);
        self.actionTransferToBranchQuantityParams.disable(true);

        fetch('/api/rangemanagementapi/SubmitTransfer', {
            method: 'POST',
            headers: window.fetchHeaders,
            body: JSON.stringify({
                branchId: self.branchId,
                productId: self.ProductID,
                transferQuantity: self.actionTransferToBranchQuantity(),
                transferDirection: 'WH2BR' // BR2WH
            })
        })
            .then(window.handleFetchResponse)
            .then(data => {
                self.actionTransferToBranchQuantityParams.busy(false);
                self.actionTransferToBranchBasketItemId(data.BasketItemID);
                if (data.Notifications) {
                    window.showInfo("Notice", data.Notifications);
                }
            })
            .catch(err => {
                self.actionTransferToBranchQuantityParams.busy(false);
                self.actionTransferToBranchQuantityParams.disable(false);
                window.catchFetchError(err);
            })
    }

    self.submitTransferBR2WH = () => {
        self.actionTransferToWarehouseQuantityParams.busy(true);
        self.actionTransferToWarehouseQuantityParams.disable(true);

        fetch('/api/rangemanagementapi/SubmitTransfer', {
            method: 'POST',
            headers: window.fetchHeaders,
            body: JSON.stringify({
                branchId: self.branchId,
                productId: self.ProductID,
                transferQuantity: self.actionTransferToWarehouseQuantity(),
                transferDirection: 'BR2WH' // BR2WH
            })
        })
            .then(window.handleFetchResponse)
            .then(data => {
                self.actionTransferToWarehouseQuantityParams.busy(false);
                self.actionTransferToWarehouseBasketItemId(data.BasketItemID);
                if (data.Notifications) {
                    window.showInfo("Notice", data.Notifications);
                }
            })
            .catch(err => {
                self.actionTransferToWarehouseQuantityParams.busy(false);
                self.actionTransferToWarehouseQuantityParams.disable(false);
                window.catchFetchError(err);
            })
    }

    self.removeWH2BRFromOrder = () => {
        window.showInfo("Not yet implemented")
    }

    self.removeBR2WHFromOrder = () => {
        window.showInfo("Not yet implemented")
    }

    return self;
}