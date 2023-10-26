const
    VIEW_MANAGE = 1,
    VIEW_RESTOCK = 2,
    VIEW_RECALL = 3,
    VIEW_ADD = 4

const rangeManagementViewModel = ({ } = {}) => {
    let self = {};

    //#region Properties

    self.busy = ko.observable(true);

    self.fetchDataBusy = ko.observable(false);

    self.view = ko.observable(VIEW_MANAGE);

    self.manageBusy = ko.observable(false);

    self.addBusy = ko.observable(false);

    self.restockBusy = ko.observable(false);

    self.recallBusy = ko.observable(false);

    self.modalBusy = ko.observable(false);

    self.ready = ko.observable(true);

    self.searchResults = ko.observableArray([]);

    self.visibleRecords = ko.observableArray([]);

    self.visibleAddToRangeRecords = ko.observableArray([]);

    self.productSearchResults = ko.observableArray([]);

    self.gridScrollRestoration = null;

    self.addGridScrollRestoration = null;

    //#region Prefilters

    self.branchId = ko.observable();
    self.branch = ko.observable();

    self.brandId = ko.observable(''); // if you don't initialise to '' you'll find that opening and immediately dismissing the associated dropdown
    self.brand = ko.observable(); // the above caveat appears to only apply to odata bound drop down lists

    self.statusGroupId = ko.observable('');
    self.statusGroup = ko.observable();

    self.productFilterGroups = ko.observableArray([]);// but why don't these dropdowns cause the above problem!?
    self.productFilterGroup = ko.observable();// don't set them to anything other than null here because you're setting them to null elsewhere and
    self.productFilterGroupId = ko.observable(null);// this is tenuous
               
    self.completeProductFilters = ko.observableArray([]);
    self.currentProductFilters = ko.observableArray([]);

    self.productFilter = ko.observable();
    self.productFilterId = ko.observable(null);

    self.stockStatus = ko.observable();
    self.stockStatusCode = ko.observable('');

    self.searchTerm = ko.observable().extend({
        rateLimit: {
            timeout: 500,
            method: 'notifyWhenChangesStop'
        }
    });

    //#endregion

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

                self.setBusy();

                var webapi = new kendo.data.transports.webapi({ prefix: "" });
                var params = webapi.parameterMap(options.data);

                var data = {};

                for (var propertyName in params) {
                    data[propertyName] = params[propertyName];
                }

                data = Object.assign(params, self.gridParams());

                let qs = new URLSearchParams(data);

                console.log('fetchProducts calling with', data);

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

                        ko.ignoreDependencies(() => {
                            self.clearBusy();
                        });

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

    self.addGridDataSource = new kendo.data.DataSource({
        transport: {
            read: (options) => {

                self.setBusy();

                var webapi = new kendo.data.transports.webapi({ prefix: "" });
                var params = webapi.parameterMap(options.data);

                var data = {};

                for (var propertyName in params) {
                    data[propertyName] = params[propertyName];
                }

                data = Object.assign(params, self.gridParams());

                let qs = new URLSearchParams(data);

                console.log('fetchProducts calling with', data);

                fetch(`/api/rangeManagementApi/FetchProductsAddToRange?${qs}`, {
                    method: 'GET',
                    headers: window.fetchHeaders
                })
                    .then(window.handleFetchResponse)
                    .then(data => {
                        console.log('fetchProducts returned', data);

                        self.previousParameters = params;

                        //data.Data = data.Data.map(r => {
                        //    return addResultRecord({
                        //        branchId: self.branchId(),
                        //        rec: r,
                        //        productFilter: ko.computed(() => {
                        //            return self.completeProductFilters().find(p => p.ProductFilterID == r.ProductFilterID)
                        //        }, self)
                        //    });
                        //});

                        ko.ignoreDependencies(() => {
                            self.clearBusy();
                        });

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
                    resultString = `<span class="group-heading product-filter-name bold">${r.value} (${productArray.length} Product${productArray.length == 1 ? '' : 's'})</span>`;
                } else {
                    resultString = `<span class="group-heading product-filter-name bold">${r.value} (${productPageSet.size} Product Page${productPageSet.size == 1 ? '' : 's'}, ${productArray.length} Product${productArray.length == 1 ? '' : 's'})</span>`;
                }

                // add rangePlanned
                resultString += `<span class="range-total range-planned bold">${formatCurrency(rangePlannedValue, 0, "en-GB", "GBP")} (${formatNumber(rangePlannedCount, 0, "en-GB")})</span>`;

                // add rangeActual
                resultString += `<span class="range-total range-actual bold">${formatCurrency(rangeActualValue, 0, "en-GB", "GBP")} (${formatNumber(rangeActualCount, 0, "en-GB")})</span>`;

                // add rangeInProgress
                resultString += `<span class="range-total range-in-progress bold">${formatCurrency(rangeInProgressValue, 0, "en-GB", "GBP")} (${formatNumber(rangeInProgressCount, 0, "en-GB")})</span>`;

                return resultString;
            },
        }, {
            title: "Product Page Name",
            field: "ProductPageName",
            groupHeaderTemplate: (r) => {
                return `<span class="group-heading product-page-name">${r.value}</span>`;
            },
        }, {
            title: "Order Form Group",
            field: "OrderFormGroup",
            groupHeaderTemplate: (r) => {
                return `<span class="group-heading order-form-group">${r.value}</span>`;
            },
        }, {
            title: " ",
            width: 310,
            headerTemplate: `<span class="group-heading header-blue"></span>`,
        }, {
            title: "Range",
            field: "RangeGroup",
            groupHeaderTemplate: `<span class="bold">Potato!</span>`,
            columns: [{
                field: "RangePlanned",
                title: "Planned",
                width: 145,
                headerAttributes: {
                    class: "text-end"
                },
                aggregates: ["sum"]
            }, {
                field: "RangeActual",
                title: "Actual",
                width: 80,
                headerAttributes: {
                    class: "text-end"
                },
                aggregates: ["sum"]
            }, {
                field: "RangeInProgress",
                title: "In Progress",
                width: 80,
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
            }]
        }, {
            title: "Actions",
            columns: [{
                field: "ActionRecommendations",
                title: "Recommendations",
                width: 200
            }, {
                field: "ActionQuantityToBranch",
                title: "Qty to Branch",
                width: 160,
                headerAttributes: {
                    class: "text-end"
                }
            }, {
                field: "ActionQuantityToWH",
                title: "Qty to WH",
                width: 160,
                headerAttributes: {
                    class: "text-end"
                }
            }, {
                field: "ActionQuantityToRange",
                title: "Quantity",
                width: 160,
                headerAttributes: {
                    class: "text-end"
                },
                hidden: true
            }, {
                field: "ActionSubmit",
                title: " ",
                width: 100,
                filterable: false
            }, {
                field: "ActionNotes",
                title: "Notes",
                width: 100
            }]
        }, {
            title: "Stock",
            columns: [{
                field: "StockWarehouse",
                title: "Warehouse",
                width: 100,
                headerAttributes: {
                    class: "text-end"
                }
            }, {
                field: "StockCover",
                title: "Cover",
                width: 100,
                headerAttributes: {
                    class: "text-end"
                }
            }, {
                field: "StockPurchaseOrdersFreeStock",
                title: "Purchase Order",
                width: 100,
                headerAttributes: {
                    class: "text-end"
                }
            }, {
                field: "StockPurchaseOrdersDueDate",
                title: "Due Date",
                width: 100
            }, {
                field: "StockKingsRoad",
                title: "King's Road",
                width: 100,
                headerAttributes: {
                    class: "text-end"
                }
            }, {
                field: "StockMarylebone",
                title: "Marylebone",
                width: 100,
                headerAttributes: {
                    class: "text-end"
                }
            }, {
                field: "StockFenwickAll",
                title: "Fenwick (All)",
                width: 100,
                headerAttributes: {
                    class: "text-end"
                }
            }, {
                field: "StockRingFenced",
                title: "Ring Fenced",
                width: 100,
                headerAttributes: {
                    class: "text-end"
                }
            }]
        }, {
            title: "Sales",
            columns: [{
                field: "SalesSummary",
                title: "Summary",
                width: 200
            }, {
                field: "SalesTotal",
                title: "Total",
                width: 100,
                headerAttributes: {
                    class: "text-end"
                }
            }, {
                field: "SalesKingsRoad",
                title: "King's Road",
                width: 100,
                headerAttributes: {
                    class: "text-end"
                }
            }, {
                field: "SalesMarylebone",
                title: "Marylebone",
                width: 100,
                headerAttributes: {
                    class: "text-end"
                }
            }, {
                field: "SalesFenwickAll",
                title: "Fenwick (All)",
                width: 100,
                headerAttributes: {
                    class: "text-end"
                }
            }, {
                field: "SalesUKECom",
                title: "UK eCommerce",
                width: 100,
                headerAttributes: {
                    class: "text-end"
                }
            }, {
                field: "SalesUKTrade",
                title: "UK Trade",
                width: 100,
                headerAttributes: {
                    class: "text-end"
                }
            }, {
                field: "SalesROWTrade",
                title: "ROW Trade",
                width: 100,
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
                display: "Showing items {0} to {1} of {2}"
            }
        },
        height: 1080,
        width: 'auto',
        reorderable: true,
        noRecords: {
            template: `<div class="empty-cover"><h4>No Results</h4></div>`,
        },
        dataBound: (e) => {
            self.removeEmptyGroupingRows();

            let data = e.sender.dataSource.view();

            let array = [];

            self.parseView(data, array);

            self.visibleRecords(array);

            document.querySelectorAll(".product-filter-name").forEach(ppn => {
                ppn.closest("tr").classList.add("product-filter-name-row");
            });

            document.querySelectorAll(".product-page-name").forEach(ppn => {
                ppn.closest("tr").classList.add("product-page-name-row");
            });

            document.querySelectorAll(".order-form-group").forEach(ofg => {
                ofg.closest("tr").classList.add("order-form-group-row");
            });

            // This is necessary if you're paging because
            // if you're paging and endless scrolling and grouping something very stupid happens with the 
            // groups not being completely filled so... you tell the grid to refresh and then it scroll itself argh
            if (self.gridScrollRestoration) {
                document.querySelector("#results-grid .k-grid-content.k-auto-scrollable").scrollTo(0, self.gridScrollRestoration);
                self.gridScrollRestoration = null;
            }
        }
    };

    self.addGridSettings = {
        autoBind: false,
        widget: ko.observable(),
        useKOTemplates: true,
        rowTemplate: "add-row-template",
        data: self.addGridDataSource,
        columns: [{
            title: "Product Filter Name",
            field: "ProductFilterName",
            groupHeaderTemplate: (r) => {
                //console.log(r);
                let productArray = self.searchResults().filter(sr => sr.ProductFilterName == r.value);
                let productPageSet = new Set(productArray.flatMap(sr => sr.ProductPageName));

                let resultString = ``;

                if (productPageSet.size == 1 && productPageSet[0] == null) {
                    resultString = `<span class="group-heading product-filter-name bold">${r.value} (${productArray.length} Product${productArray.length == 1 ? '' : 's'})</span>`;
                } else {
                    resultString = `<span class="group-heading product-filter-name bold">${r.value} (${productPageSet.size} Product Page${productPageSet.size == 1 ? '' : 's'}, ${productArray.length} Product${productArray.length == 1 ? '' : 's'})</span>`;
                }

                return resultString;
            },
        }, {
            title: "Product Page Name",
            field: "ProductPageName",
            groupHeaderTemplate: (r) => {
                return `<span class="group-heading product-page-name">${r.value}</span>`;
            },
        }, {
            title: "Order Form Group",
            field: "OrderFormGroup",
            groupHeaderTemplate: (r) => {
                return `<span class="group-heading order-form-group">${r.value}</span>`;
            },
        }, {
            title: " ",
            width: 310,
            headerTemplate: `<span class="group-heading header-blue"></span>`,
        }, {
            title: "Recommendations",
            field: "Recommendations",
            width: 220
        }, {
            title: " ",
            field: " ",
            width: 180
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
                display: "Showing items {0} to {1} of {2}"
            }
        },
        height: 1080,
        width: 'auto',
        reorderable: true,
        noRecords: {
            template: `<div class="empty-cover"><h4>No Results</h4></div>`,
        },
        dataBound: (e) => {
            self.removeEmptyGroupingRows();

            let data = e.sender.dataSource.view();

            let array = [];

            self.parseView(data, array);

            self.visibleAddToRangeRecords(array);

            document.querySelectorAll(".product-filter-name").forEach(ppn => {
                ppn.closest("tr").classList.add("product-filter-name-row");
            });

            document.querySelectorAll(".product-page-name").forEach(ppn => {
                ppn.closest("tr").classList.add("product-page-name-row");
            });

            document.querySelectorAll(".order-form-group").forEach(ofg => {
                ofg.closest("tr").classList.add("order-form-group-row");
            });

            // This is necessary if you're paging because
            // if you're paging and endless scrolling and grouping something very stupid happens with the 
            // groups not being completely filled so... you tell the grid to refresh and then it scroll itself argh
            if (self.addGridScrollRestoration) {
                document.querySelector("#results-grid .k-grid-content.k-auto-scrollable").scrollTo(0, self.addGridScrollRestoration);
                self.addGridScrollRestoration = null;
            }
        }
    }

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
        select: (e) => {
            e.preventDefault();
            self.branchCheck(e, (e) => {
                e.sender.value(e.dataItem.BranchID);
            });
        },
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

    self.stockStatusParams = kendoMDCDropDownList({
        label: 'Stock Status',
        data: [{
            Value: "Overstocked",
            Name: "Overstocked"
        }, {
            Name: "Understocked",
            Value: "Understocked"
        }],
        textField: 'Name',
        valueField: 'Value',
        virtual: false,
        idObservable: self.stockStatusCode,
        objObservable: self.stockStatus,
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

    //#endregion


    //#region Methods

    self.branchCheck = (e, onComplete) => {
        self.busy(true);
        fetch('/api/rangemanagementapi/checkBranch', {
            method: 'POST',
            headers: window.fetchHeaders,
            body: JSON.stringify({
                branchId: e.dataItem.BranchID
            })
        })
            .then(window.handleFetchResponse)
            .then(data => {
                self.busy(false);
                if (data.Notification != null) {
                    window.showInfo("Information",
                        `${data.Notification}If this situation persists for more than an hour, please email
                            <a href="mailto:itsupport@designersguild.com?subject=${(encodeURIComponent(`Range Management - ${e.dataItem.Name} Transfer Order(s) not being Processed by Mertex`))}&body=${encodeURIComponent(data.Notification)}">itsupport@designersguild.com</a>`);
                    self.branchParams.clearFunction();
                } else {
                    if (typeof onComplete === 'function') {
                        onComplete(e);
                    }
                }
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
    }

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

    self.clearAllFilters = () => {
        self.productFilterGroupParams.clearFunction();
        self.productFilterParams.clearFunction();
        self.brandParams.clearFunction();
        self.statusGroupParams.clearFunction();
        self.searchTerm(undefined);
    }

    self.setBusy = () => {
        switch (self.view()) {
            case VIEW_MANAGE:
                self.manageBusy(true);
                break;
            case VIEW_ADD:
                self.addBusy(true);
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
            case VIEW_ADD:
                self.addBusy(false);
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

    //#region unsaved changes handling

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

    //#endregion

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
            statusGroupId: self.statusGroupId(),
            stockStatusCode: self.stockStatusCode()
        };

        if (self.searchTerm())
            props.searchTerm = self.searchTerm();

        if (self.gridParamsFirstRun)
            self.gridParamsFirstRun = false;
        else {
            if (self.branchId() ||
                self.productFilterGroupId() ||
                self.productFilterId() ||
                self.brandId() ||
                self.statusGroupId() ||
                self.stockStatusCode() ||
                self.searchTerm()) {
                window.setTimeout(() => {
                    if (self.gridSettings.widget()) {
                        self.gridSettings.widget().dataSource.data([]);

                        let grouping = self.gridSettings.widget().dataSource.group();

                        self.gridSettings.widget().dataSource.query({
                            page: 1,
                            pageSize: 10,
                            group: grouping
                        });

                    }
                }, 0);
            }
        }

        return props;
    }, self).extend({
        rateLimit: {
            timeout: 50,
            method: 'notifyWhenChangesStop'
        }
    });

    self.unfilledRecordProductIds = ko.computed(() => {
        return Array.from(new Set(self.visibleRecords().filter(vr => !vr.loaded()).map(vr => vr.ProductID)));
    }, self);

    self.fetchData = ko.computed(() => {
        if (self.unfilledRecordProductIds().length) {

            if (self.unfilledRecordProductIds().length > 1)
                self.fetchDataBusy(true);

            window.setTimeout(() => {
                console.log('fetchData calling with', self.unfilledRecordProductIds());

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

                        switch (self.view()) {
                            case VIEW_MANAGE:
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

                                    rec.actionAddToRangeHighlight(r.Action_AddToRangeHighlight);
                                    rec.actionAddToRangeQuantity(0);

                                    rec.rangeStatus(r.Range_Status);
                                    rec.rangeActual(r.Range_Actual);
                                    rec.rangePlanned(r.Range_Planned);
                                    rec.rangePlannedOriginal(r.Range_Planned);
                                    rec.rangeInProgress(r.Range_InProgress);
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

                                    rec.busy(false);

                                    rec.loaded(true);
                                });

                                self.fetchDataBusy(false);

                                // This is necessary if you're paging because
                                // if you're paging and endless scrolling and grouping something very stupid happens with the
                                // groups not being completely filled so... you tell the grid to refresh and then it scroll itself argh
                                self.gridScrollRestoration = document.querySelector("#results-grid .k-grid-content.k-auto-scrollable").scrollTop;
                                self.gridSettings.widget().refresh();
                        ///

                                break;
                            case VIEW_ADD:

                                break;
                            default:
                                break;
                        }

                        console.log('FetchData returned', data);
                    })
                    .catch(err => {
                        self.clearBusy();
                        window.catchFetchError(err)
                    });
            }, 300);

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

    document.getElementById("range-tab-btn").addEventListener('show.bs.tab', (e) => {

        if (self.view() != VIEW_MANAGE) {
            e.preventDefault();
            self.branchCheck({
                dataItem: {
                    BranchID: self.branchId()
                }
            }, (e) => {

                self.view(VIEW_MANAGE);

                bootstrap.Tab.getOrCreateInstance(document.getElementById("range-tab-btn")).show();
            });
        }
    });

    document.getElementById("add-to-range-btn").addEventListener('show.bs.tab', (e) => {

        if (self.view() != VIEW_ADD) {
            e.preventDefault();
            self.branchCheck({
                dataItem: {
                    BranchID: self.branchId()
                }
            }, (e) => {

                self.view(VIEW_ADD);

                self.addGridSettings.widget().dataSource.read();

                bootstrap.Tab.getOrCreateInstance(document.getElementById("add-to-range-btn")).show();
            });
        }
    });

    document.getElementById("restock-tab-btn").addEventListener('show.bs.tab', (e) => {
        if (self.view() != VIEW_RESTOCK) {
            e.preventDefault();
            self.branchCheck({
                dataItem: {
                    BranchID: self.branchId()
                }
            }, (e) => {
                self.view(VIEW_RESTOCK);
                bootstrap.Tab.getOrCreateInstance(document.getElementById("restock-tab-btn")).show();
            });
        }
    });

    document.getElementById("recall-tab-btn").addEventListener('show.bs.tab', (e) => {
        if (self.view() != VIEW_RECALL) {
            e.preventDefault();
            self.branchCheck({
                dataItem: {
                    BranchID: self.branchId()
                }
            }, (e) => {
                self.view(VIEW_RECALL);
                bootstrap.Tab.getOrCreateInstance(document.getElementById("recall-tab-btn")).show();
            });
        }
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

        document.querySelector("#results-grid .k-grid-content.k-auto-scrollable").addEventListener("scroll", (e, v) => {

            let norecords = document.querySelector("#results-grid .k-grid-content.k-auto-scrollable .k-grid-norecords")
            if (norecords) {
                norecords.style.transform = `translateX(${e.target.scrollLeft}px)`;
            }
            let diff = 0;
            document.querySelectorAll('#results-grid .product-card-tooltip').forEach(c => {
                c.style.transform = `translateX(${e.target.scrollLeft + diff}px)`;
            });
            document.querySelectorAll('#results-grid .group-heading').forEach(c => {
                c.style.transform = `translateX(${e.target.scrollLeft}px)`;
            });
        });
    });

    //#endregion

    return self;
};

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

    self.actionAddToRangeHighlight = ko.observable();
    self.actionAddToRangeQuantity = ko.observable().extend(self.defaultNumericalExtension);
    
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
        self.actionAddToRangeQuantity.extend(productFilterNumericalExtension);
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
            small: true,
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

    self.rangeSubscription = null;

    self.loaded.subscribe(_ => {
        if (self.rangeSubscription === null) {
            self.rangeSubscription = self.rangePlanned.subscribe(nv => {
                if (nv != self.rangePlannedOriginal()) {
                    self.busy(true);

                    //self.rangePlannedParams.busy(true);
                    //self.rangePlannedParams.disable(true);

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
                            self.loaded(false);
                            //self.rangePlannedParams.busy(false);
                            //self.rangePlannedParams.disable(false);
                        })
                        .catch(err => {
                            //self.rangePlannedParams.busy(false);
                            //self.rangePlannedParams.disable(false);
                            self.busy(false);
                            window.catchFetchError(err);
                        });
                }
            });
        }
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

    self.actionAddToRangeQuantityParams = self.buildNumericParams(
        self.actionAddToRangeQuantity,
        ko.observable(0),
        self.incrementAmount,
        self.scale);

    self.actionAddToRangeQuantityParams.revertable(false);

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
        if (self.actionTransferToBranchQuantity() != 0) {
            self.submitTransferWH2BR();
        }

        if (self.actionTransferToWarehouseQuantity() != 0) {
            self.submitTransferBR2WH();
        }
    }

    self.submitTransferWH2BR = () => {
        self.busy(true);

        //self.actionTransferToBranchQuantityParams.busy(true);
        //self.actionTransferToBranchQuantityParams.disable(true);

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
                //self.actionTransferToBranchQuantityParams.busy(false);
                self.actionTransferToBranchBasketItemId(data.BasketItemID);
                if (data.Notifications) {
                    window.showInfo("Notice", data.Notifications);
                }
                self.busy(true); // set whole row busy display...
                self.loaded(false); // force reload of this record
            })
            .catch(err => {
                self.busy(false);
                //self.actionTransferToBranchQuantityParams.busy(false);
                //self.actionTransferToBranchQuantityParams.disable(false);
                window.catchFetchError(err);
            })
    }

    self.submitTransferBR2WH = () => {
        self.busy(true);
        //self.actionTransferToWarehouseQuantityParams.busy(true);
        //self.actionTransferToWarehouseQuantityParams.disable(true);

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
                //self.actionTransferToWarehouseQuantityParams.busy(false);
                self.actionTransferToWarehouseBasketItemId(data.BasketItemID);
                if (data.Notifications) {
                    window.showInfo("Notice", data.Notifications);
                }
                self.busy(true); // set whole row busy display...
                self.loaded(false); // force reload of this record
            })
            .catch(err => {
                self.busy(false);
                //self.actionTransferToWarehouseQuantityParams.busy(false);
                //self.actionTransferToWarehouseQuantityParams.disable(false);
                window.catchFetchError(err);
            })
    }

    self.removeWH2BRFromOrder = () => {
        self.busy(true);
        //self.actionTransferToBranchQuantityParams.busy(true);
        //self.actionTransferToBranchQuantityParams.disable(true);

        fetch('/api/rangemanagementapi/RemoveTransferBasketItem', {
            method: 'POST',
            headers: window.fetchHeaders,
            body: JSON.stringify({
                basketItemId: self.actionTransferToBranchBasketItemId(),
                memberId: null
            })
        })
            .then(window.handleFetchResponse)
            .then(data => {
                //self.actionTransferToBranchQuantityParams.busy(false);
                self.actionTransferToBranchBasketItemId(undefined);
                if (data.Notifications) {
                    window.showInfo("Notice", data.Notifications);
                }
                self.busy(true); // set whole row busy display...
                self.loaded(false); // force reload of this record
            })
            .catch(err => {
                self.busy(false);
                //self.actionTransferToBranchQuantityParams.busy(false);
                //self.actionTransferToBranchQuantityParams.disable(false);
                window.catchFetchError(err);
            })
    }

    self.removeBR2WHFromOrder = () => {
        self.busy(true);
        //self.actionTransferToWarehouseQuantityParams.busy(true);
        //self.actionTransferToWarehouseQuantityParams.disable(true);

        fetch('/api/RangeManagementAPI/RemoveTransferBasketItem', {
            method: 'POST',
            headers: window.fetchHeaders,
            body: JSON.stringify({
                basketItemId: self.actionTransferToWarehouseBasketItemId(),
                memberId: null
            })
        })
            .then(window.handleFetchResponse)
            .then(data => {
                //self.actionTransferToWarehouseQuantityParams.busy(false);
                self.actionTransferToWarehouseBasketItemId(null);
                if (data.Notifications) {
                    window.showInfo("Notice", data.Notifications);
                }
                self.busy(true); // set whole row busy display...
                self.loaded(false); // force reload of this record
            })
            .catch(err => {
                self.busy(false);
                //self.actionTransferToWarehouseQuantityParams.busy(false);
                //self.actionTransferToWarehouseQuantityParams.disable(false);
                window.catchFetchError(err);
            })
    }

    self.busy.subscribe(nv => {
        self.rangePlannedParams.busy(nv);
        self.rangePlannedParams.disable(nv);
        self.actionTransferToBranchQuantityParams.busy(nv);
        self.actionTransferToBranchQuantityParams.disable(nv);
        self.actionTransferToWarehouseQuantityParams.busy(nv);
        self.actionTransferToWarehouseQuantityParams.disable(nv);
    });

    self.submitDisabled = ko.computed(() => {
        return (self.actionTransferToBranchQuantity() == 0 &&
            self.actionTransferToWarehouseQuantity() == 0)
    }, self);

    return self;
}


const addResultRecord = function ({
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

    self.actionAddToRangeHighlight = ko.observable();
    self.actionAddToRangeQuantity = ko.observable().extend(self.defaultNumericalExtension);

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

        self.actionAddToRangeQuantity.extend(productFilterNumericalExtension);
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
            small: true,
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

    self.actionAddToRangeQuantityParams = self.buildNumericParams(
        self.actionAddToRangeQuantity,
        ko.observable(0),
        self.incrementAmount,
        self.scale);

    self.actionAddToRangeQuantityParams.revertable(false);

    self.preSave = () => {
        self.busy(true);
    }

    self.postSave = (success) => {
        if (success) {
            self.actionAddToRangeQuantity(0);
            self.busy(false);
        } else {
            self.busy(false);
        }
    }

    self.unsavedChanges = ko.computed(() => {
        return (self.actionAddToRangeQuantity() != 0)
    }, self);

    self.busy.subscribe(nv => {
        self.actionAddToRangeQuantityParams.busy(nv);
        self.actionAddToRangeQuantityParams.disable(nv);
    });

    self.submitDisabled = ko.computed(() => {
        return (self.actionAddToRangeQuantityParams.busy());
    }, self);

    self.submitTransfers = () => {
        if (self.actionAddToRangeQuantity() != 0) {
            self.submitToRange();
        }
    }

    self.submitToRange = () => {
        self.busy(true);

        //self.actionTransferToBranchQuantityParams.busy(true);
        //self.actionTransferToBranchQuantityParams.disable(true);

        fetch('/api/rangemanagementapi/UpsertRange', {
            method: 'POST',
            headers: window.fetchHeaders,
            body: JSON.stringify({
                branchId: self.branchId,
                range: [{
                    productId: self.ProductID,
                    quantity: self.actionAddToRangeQuantity(),
                    startDate: null,
                    endDate: null
                }]
            })
        })
            .then(window.handleFetchResponse)
            .then(data => {
                //self.actionTransferToBranchQuantityParams.busy(false);
                self.actionTransferToRangeBasketItemId(data.BasketItemID);
                if (data.Notifications) {
                    window.showInfo("Notice", data.Notifications);
                }
                //self.busy(true); // set whole row busy display...
                //self.loaded(false); // force reload of this record

                self.busy(false);

                self.actionTransferToBranchQuantityParams.disable(true); // ... ?
            })
            .catch(err => {
                self.busy(false);
                //self.actionTransferToBranchQuantityParams.busy(false);
                //self.actionTransferToBranchQuantityParams.disable(false);
                window.catchFetchError(err);
            })
    }

    return self;
}