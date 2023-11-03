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

    self.fetchAddDataBusy = ko.observable(false);

    self.view = ko.observable(VIEW_MANAGE);

    self.manageBusy = ko.observable(false);

    self.addBusy = ko.observable(false);

    self.restockBusy = ko.observable(false);

    self.recallBusy = ko.observable(false);

    self.modalBusy = ko.observable(false);

    self.ready = ko.observable(true);

    self.addNoteModalElement = document.getElementById("add-note-modal");

    self.addNoteModal = bootstrap.Modal.getOrCreateInstance(self.addNoteModalElement);

    self.note = ko.observable();

    self.notes = ko.observableArray([]);

    self.noteBusy = ko.observable(false);

    self.addingNoteToRecord = ko.observable();

    self.noteParams = {
        label: 'New Note',
        enable: true,
        observable: self.note,
        rows: 3,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        clearable: true,
        revertable: false,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: false,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 255
        }
    }

    //#region Manage Grid

    // this is used to hold the results of productSearch: "stubs", unfilled records pending fetchData treatment
    self.searchResults = ko.observableArray([]);

    // this is used to hold the currently visible records: those which the dataSource has deemed to be "in view"
    self.visibleRecords = ko.observableArray([]);

    // this holds those records which have been fleshed out by the fetchData results
    self.filledRecords = ko.observableArray([]);

    // this lets us return the grid to where it was before "refresh" was called
    // calling refresh is necessary following an endless scrolling paging event because we're grouping
    self.gridScrollRestoration = null;

    self.productFilterTotals = ko.observableArray([]);

    self.branchBaskets = ko.observableArray([]);

    //#endregion


    //#region Add to Range Grid

    // these variants, the same as above but for our "add to range" grid.
    self.addSearchResults = ko.observableArray([]).extend({
        infinitescroll: {
            itemsWidth: 600,
            itemsHeight: 90,
            itemWidth: 600,
            itemHeight: 90
        }
    });

    self.addVisibleRecords = ko.observableArray([]);

    self.addFilledRecords = ko.observableArray([]);

    self.addGridScrollRestoration = null;

    //#endregion


    //#region Prefilters

    self.branchId = ko.observable('');
    self.branch = ko.observable();

    self.brandId = ko.observable(''); // if you don't initialise to '' you'll find that opening and immediately dismissing the associated dropdown
    self.brand = ko.observable(); // the above caveat appears to only apply to odata bound drop down lists

    self.statusGroupId = ko.observable('');
    self.statusGroup = ko.observable();

    self.productFilterGroups = ko.observableArray([]);// but why don't these dropdowns cause the above problem!?
    self.productFilterGroup = ko.observable();// don't set them to anything other than null here because you're setting them to null elsewhere and
    self.productFilterGroupId = ko.observable(null);// this is tenuous

    self.sel = ko.observableArray([]);
    self.currentProductFilters = ko.observableArray([]);
    self.completeProductFilters = ko.observableArray([]);

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

    self.intersectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                console.log('intersecting');
                let data = ko.dataFor(entry.target);
                if (data == null || !data.hasOwnProperty("loaded")) {
                    if (!self.visibleRecords().find(vid => vid.ProductID === data.ProductID)) {
                        self.visibleRecords.push(data);
                        self.intersectionObserver.unobserve(entry.target);
                    }
                }
            }
        });
    }, {
        rootMargin: "140px",
        threshold: 0.1
    });


    self.addIntersectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            console.log('observation');
            if (entry.isIntersecting) {
                let data = ko.dataFor(entry.target);
                if (data == null || !data.hasOwnProperty("loaded")) {
                    if (!self.addVisibleRecords().find(vid => vid.ProductID === data.ProductID))
                        self.addVisibleRecords.push(data);
                }
                //entry.target.style.display = "table-row";
            } else {
                let data = ko.dataFor(entry.target);
                if (data && data.hasOwnProperty('loaded') && data.loaded()) {
                    self.addIntersectionObserver.unobserve(entry.target);
                }
                //entry.target.style.display = "none";   
            }
        });
    }, {
        rootMargin: "140px",
        threshold: 0.1
    });

    //#endregion


    //#region Components

    self.getFilledRecord = (productId) => {
        return self.filledRecords().find(p => p.ProductID === productId);
    }

    self.gridParamsFirstRun = true;

    self.gridParams = ko.computed(() => {
        //console.log('gridParams computed');

        let props = {
            branchId: self.branchId(),
            productFilterGroupId: self.productFilterGroupId(),
            productFilterId: self.productFilterId(),
            brandId: self.brandId(),
            statusGroupId: self.statusGroupId()
        };

        let view = self.view();

        // because if I don't do this 
        if (self.searchTerm())
            props.searchTerm = self.searchTerm();

        // they'll end up serialising "undefined" or "null" :\
        if (self.stockStatusCode())
            props.stockStatusCode = self.stockStatusCode();

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
                    let obj = null;

                    switch (self.view()) {
                        case VIEW_MANAGE:
                            obj = self.gridSettings;
                            break;
                        case VIEW_ADD:
                            obj = self.addGridSettings;
                            break;
                        default:
                            break;
                    }

                    if (obj && obj.widget()) {
                        obj.widget().dataSource.data([]);

                        let grouping = obj.widget().dataSource.group();

                        let pageSize = obj.widget().dataSource.pageSize();

                        obj.widget().dataSource.query({
                            page: 1,
                            pageSize: pageSize,
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

    self.getAddFilledRecord = (productId) => {
        return self.addFilledRecords().find(p => p.ProductID === productId);
    }

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

                console.log('fetchProductsAddToRange calling with', data);

                fetch(`/api/rangeManagementApi/FetchProductsAddToRange?${qs}`, {
                    method: 'GET',
                    headers: window.fetchHeaders
                })
                    .then(window.handleFetchResponse)
                    .then(data => {
                        console.log('fetchProductsAddToRange returned', data);

                        self.clearBusy();

                        self.addSearchResults(data.Data);

                        options.success(data);
                    })
                    .catch(err => {
                        self.clearBusy();
                        window.catchFetchError(err);
                    });
            }
        },
        page: 1,
        pageSize: 200,
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
        $('#add-results-grid p.k-reset:contains("null")').each((n, e) => {
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
                let productArray = self.addSearchResults().filter(sr => sr.ProductFilterName == r.value);
                let productPageSet = new Set(productArray.flatMap(sr => sr.ProductPageName));

                let resultString = ``;

                if (productPageSet.size == 1 && productPageSet[0] == null) {
                    resultString = `<span class="group-heading product-filter-name bold">${r.value} (${productArray.length} Product${productArray.length == 1 ? '' : 's'})</span>`;
                } else {
                    resultString = `<span class="group-heading product-filter-name bold">${r.value} (${productPageSet.size} Product Page${productPageSet.size == 1 ? '' : 's'}, ${productArray.length} Product${productArray.length == 1 ? '' : 's'})</span>`;
                }

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
            width: 310,
            headerTemplate: `<span class="group-heading header-blue"></span>`
        }, {
            title: "Recommendations",
            field: "Recommendations",
            width: 300
        }, {
            field: "ActionQuantityToRange",
            title: "Quantity",
            width: 200,
            headerAttributes: {
                class: "text-end"
            }
        }, {
            title: " ",
            field: "Submit",
            width: 140
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
                title: "PO Quantity",
                width: 100,
                headerAttributes: {
                    class: "text-end"
                }
            }, {
                field: "StockPurchaseOrdersDueDate",
                title: "PO Due Date",
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
            title: "Sales - Last 180 Days",
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
                title: "UK eComm",
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
        sortable: false,
        groupable: false,
        reorderable: false,
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
        height: 1060,
        width: 'auto',
        noRecords: {
            //template: `<div class="empty-cover"><h4>No Results</h4></div>`,
            template: ` `,
        },
        dataBound: (e) => {
            self.removeEmptyGroupingRows();

            let data = e.sender.dataSource.view();

            let array = [];

            self.parseView(data, array);

            self.addVisibleRecords(array);

            document.querySelectorAll(".product-filter-name").forEach(ppn => {
                ppn.closest("tr").classList.add("product-filter-name-row");
            });

            document.querySelectorAll(".product-page-name").forEach(ppn => {
                ppn.closest("tr").classList.add("product-page-name-row");
            });

            document.querySelectorAll(".order-form-group").forEach(ofg => {
                ofg.closest("tr").classList.add("order-form-group-row");
            });

            //console.log("addRange grid dataBound");
        }
    }

    self.transferOrdersWH2BRDataSource = new kendo.data.DataSource({
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
                    transferDirection: "WH2BR"
                });

                let qs = new URLSearchParams(data);

                console.log('fetchTransferOrders calling with', data);

                fetch(`/api/rangeManagementApi/FetchTransferOrders?${qs}`, {
                    method: 'GET',
                    headers: window.fetchHeaders
                })
                    .then(window.handleFetchResponse)
                    .then(data => {
                        console.log('fetchTransferOrders returned', data);

                        self.clearBusy();

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
                id: 'OrderID'
            }
        }),
        sort: {
            field: "SortOrder"
        }
    });

    self.transferOrdersBR2WHDataSource = new kendo.data.DataSource({
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
                    transferDirection: "BR2WH"
                });

                let qs = new URLSearchParams(data);

                console.log('fetchTransferOrders calling with', data);

                fetch(`/api/rangeManagementApi/FetchTransferOrders?${qs}`, {
                    method: 'GET',
                    headers: window.fetchHeaders
                })
                    .then(window.handleFetchResponse)
                    .then(data => {
                        console.log('fetchTransferOrders returned', data);

                        self.clearBusy();

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
                id: 'OrderID'
            }
        }),
        sort: {
            field: "SortOrder"
        }
    });

    self.transferOrdersColumns = [{
        title: " ",
        field: "ImageID",
        width: 80
    }, {
        title: "Type",
        field: "Type",
        width: 60
    }, {
        title: "Product",
        field: "Product"
    }, {
        title: "Quantity",
        field: "QuantityOrdered",
        width: 80,
        headerAttributes: {
            class: "text-end"
        }
    }, {
        title: "Order ID",
        field: "OrderID",
        width: 100,
        headerAttributes: {
            class: "text-end"
        }
    }, {
        title: "Order Date",
        field: "OrderDT",
        width: 100
    }, {
        title: "Order Line ID",
        field: "OrderLineID",
        width: 120,
        headerAttributes: {
            class: "text-end"
        }
    }, {
        title: "Basket ID",
        field: "BasketID",
        width: 100,
        headerAttributes: {
            class: "text-end"
        }
    }, {
        title: "Basket Date",
        field: "BasketDT",
        width: 100,
        template: (e) => {
            return renderDate(e.value)
        }
    }, {
        title: "Basket Item ID",
        field: "BasketItemID",
        width: 120,
        headerAttributes: {
            class: "text-end"
        }
    }, {
        title: "Trade Account",
        field: "TradeAccount"
    }, {
        title: "Status",
        width: 140,
        field: "DetailedLineStatus"
    }]

    self.transferOrdersWH2BRGridSettings = {
        autoBind: false,
        widget: ko.observable(),
        useKOTemplates: true,
        rowTemplate: "transfer-orders-row-template",
        data: self.transferOrdersWH2BRDataSource,
        columns: self.transferOrdersColumns,
        sortable: false,
        groupable: false,
        reorderable: false,
        filterable: false,
        selectable: false,
        scrollable: {
            endless: true
        },
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 30, 50, 100, 200]
        },
        height: 1080,
        width: 'auto',
        noRecords: {
            template: `<div class="empty-cover"><h4>No Results</h4></div>`,
        }
    }

    self.transferOrdersBR2WHGridSettings = {
        autoBind: false,
        widget: ko.observable(),
        useKOTemplates: true,
        rowTemplate: "transfer-orders-row-template",
        data: self.transferOrdersBR2WHDataSource,
        columns: self.transferOrdersColumns,
        sortable: false,
        groupable: false,
        reorderable: false,
        filterable: false,
        selectable: false,
        scrollable: {
            endless: true
        },
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 30, 50, 100, 200]
        },
        height: 1080,
        width: 'auto',
        noRecords: {
            template: `<div class="empty-cover"><h4>No Results</h4></div>`,
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
        sort: [{
            dir: 'asc',
            field: 'Name'
        }],
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
        sort: [{
            dir: 'asc',
            field: 'Name'
        }],
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
        label: 'Product Status',
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
        filter: false,
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
        filter: false,
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
        //console.log('branch', branch);
        if (branch) {
            self.refreshProductFilters(branch);
        } else {
            self.clearProductFilters();
        }
    });

    //#endregion


    //#region Methods

    self.showAddNoteModal = (record) => {
        self.addingNoteToRecord(record);
        self.addNoteModal.show();
        self.fetchNotes();
    }

    self.hideAddNoteModal = () => {
        self.addNoteModal.hide();
        self.note(undefined);
        self.addingNoteToRecord().busy(true);
        self.addingNoteToRecord().loaded(false);
        self.addingNoteToRecord(undefined);
    }

    self.fetchNotes = () => {
        self.noteBusy(true);
        fetch('/api/rangeManagementApi/FetchNotes', {
            method: 'POST',
            headers: window.fetchHeaders,
            body: JSON.stringify({
                branchId: self.branchId(),
                productId: self.addingNoteToRecord().ProductID
            })
        })
            .then(window.handleFetchResponse)
            .then(data => {
                self.notes(data);
                self.noteBusy(false);
            })
            .catch(err => {
                self.noteBusy(false);
                window.catchFetchError(err);
            });
    }

    self.saveNote = () => {
        self.noteBusy(true);
        fetch('/api/rangeManagementApi/SaveNote', {
            method: 'POST',
            headers: window.fetchHeaders,
            body: JSON.stringify({
                branchId: self.branchId(),
                productId: self.addingNoteToRecord().ProductID,
                note: self.note()
            })
        })
            .then(window.handleFetchResponse)
            .then(data => {
                self.fetchNotes();
                self.noteBusy(false);
                window.setTimeout(() => {
                    self.note(undefined);
                }, 0);
            })
            .catch(err => {
                self.noteBusy(false);
                window.catchFetchError(err);
            });
    }

    self.fetchBranchBasketsNonce = ko.observable();

    self.fetchBranchBaskets = ko.computed(() => {
        let data = {
            branchId: self.branchId()
        }

        let nonce = self.fetchBranchBasketsNonce();

        if (data.branchId) {

            self.branchBaskets([]);

            let results = self.searchResults();

            let qs = new URLSearchParams(data);

            fetch(`/api/rangeManagementApi/FetchBranchBaskets?${qs}`, {
                method: 'GET',
                headers: window.fetchHeaders
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    ko.ignoreDependencies(() => {
                        self.branchBaskets(data);
                    });
                })
                .catch(window.catchFetchErrors);
        }
    }, self);

    self.releaseBranchBaskets = () => {
        window.showConfirm("Are you sure?", "This action will submit the transfer orders for this branch.", () => {
            fetch('/api/rangeManagementApi/ReleaseBranchBaskets', {
                method: 'POST',
                headers: window.fetchHeaders,
                body: JSON.stringify({
                    branchId: self.branchId()
                })
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    window.showInfo("Success", "Transfer orders submitted successfully.", () => {
                        console.log("Clear or reset or run the branch check again or something...");
                        self.branchCheck();
                    });
                })
                .catch(window.catchFetchError);
        }, null);
    }

    self.searchResultsPostProcessing = () => {
        window.setTimeout(() => {
            if (self.intersectionObserver) {
                document.querySelectorAll("#results-grid tbody tr[role=row]:not(.k-grouping-row)").forEach(row => {
                    console.log('observing');
                    self.intersectionObserver.observe(row);
                });
            }
        }, 0);
    }

    self.addSearchResultsPostProcessing = () => {
        window.setTimeout(() => {
            if (self.addIntersectionObserver) {
                document.querySelectorAll("#add-results-grid tbody tr[role=row]:not(.k-grouping-row)").forEach(row => {
                    console.log('observing');
                    self.addIntersectionObserver.observe(row);
                });
            }
        }, 0);
    }

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
        //self.productFilterGroupId(null); // why 
        //self.productFilterId(null); // why
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
                //console.log('FetchProductFilters returned', data);
                self.productFilterGroups(data.ProductFilterGroups);
                self.completeProductFilters(data.ProductFilters);
                self.currentProductFilters(data.ProductFilters);
            })
            .catch(err => {
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
        self.stockStatusParams.clearFunction();
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

            let array = [];

            switch (self.view()) {
                case VIEW_MANAGE:
                    array = self.filledRecords.peek();
                    break;
                case VIEW_ADD:
                    array = self.addFilledRecords.peek();
                    break;
                default: break;
            }

            let unsaved = array.find(p => p.unsavedChanges());

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

    self.fetchProducts = ko.computed(() => {

        if (self.view() == VIEW_MANAGE) {
            self.setBusy();

            let data = self.gridParams();

            let qs = new URLSearchParams(data);

            self.visibleRecords([]);
            self.filledRecords([]);
            self.searchResults([]);

            console.log('fetchProducts calling with', data);

            fetch(`/api/rangeManagementApi/FetchProducts?${qs}`, {
                method: 'GET',
                headers: window.fetchHeaders
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    console.log('fetchProducts returned', data);

                    //if (data.Results.length === 0)
                    self.clearBusy();

                    self.searchResults(data.Results);

                    self.productFilterTotals(data.Totals);

                    window.setTimeout(() => {
                        self.searchResultsPostProcessing();
                    }, 0);
                })
                .catch(err => {
                    self.clearBusy();
                    window.catchFetchError(err);
                });
        }

    }, self);

    self.fetchAddProducts = ko.computed(() => {

        if (self.view() == VIEW_ADD) {
            self.setBusy();

            let data = self.gridParams();

            let qs = new URLSearchParams(data);

            console.log('fetchProductsAddToRange calling with', data);

            fetch(`/api/rangeManagementApi/FetchProductsAddToRange?${qs}`, {
                method: 'GET',
                headers: window.fetchHeaders
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    console.log('fetchProductsAddToRange returned', data);

                    if (data.Data.length === 0)
                        self.clearBusy();

                    self.addSearchResults(data.Data);

                    window.setTimeout(() => {
                        self.addSearchResultsPostProcessing();
                    }, 0);
                })
                .catch(err => {
                    self.clearBusy();
                    window.catchFetchError(err);
                });
        }
    }, self);

    self.unfilledRecordProductIds = ko.computed(() => {
        return Array.from(new Set(self.visibleRecords().filter(vr => {
            let r = self.filledRecords().find(fr => fr.ProductID == vr.ProductID);
            return (r == null || r && r.loaded() == false);
        }).map(cr => cr.ProductID)));
    }, self).extend({
        rateLimit: {
            timeout: 100,
            method: "notifyWhenChangesStop"
        }
    });

    self.fetchData = ko.computed(() => {
        let urpids = self.unfilledRecordProductIds();

        if (urpids.length) {

            window.setTimeout(() => {
                console.log('fetchData calling with', urpids);

                let callStart = new Date();

                fetch('/api/rangemanagementapi/FetchData', {
                    method: 'POST',
                    headers: window.fetchHeaders,
                    body: JSON.stringify({
                        branchId: self.branchId(),
                        productIds: urpids
                    })
                })
                    .then(window.handleFetchResponse)
                    .then(data => {

                        let callReturn = new Date();

                        console.log(`fetchData returned in ${callReturn - callStart}ms`, data);

                        let records = self.searchResults.peek();
                        let affectedRecords = [];
                        let filledRecords = self.filledRecords.peek();

                        urpids.forEach(pid => {

                            let record = records.find(p => p.ProductID === pid);
                            let dataResult = data.Results.find(p => p.ProductID == pid);
                            let filledRecord = filledRecords.find(p => p.ProductID == pid);

                            let add = true;

                            if (dataResult) {

                                if (filledRecord == null) {
                                    record = resultRecord({
                                        branchId: self.branchId(),
                                        rec: record,
                                        fetchBranchBasketsNonce: self.fetchBranchBasketsNonce
                                    });
                                } else {
                                    add = false;
                                    filledRecord.loaded(true);
                                    record = filledRecord;
                                }

                                record.actionRecommendations = dataResult.Action_Recommendation;

                                record.actionTransferToBranchHighlight = dataResult.Action_TransferToBranchHighlight;

                                record.actionTransferToBranchQuantityOriginal(dataResult.Action_TransferToBranchQuantity);
                                record.actionTransferToBranchQuantity(dataResult.Action_TransferToBranchQuantity);
                                record.actionTransferToBranchBasketItemId(dataResult.WH2BR_BasketItemID);

                                if (dataResult.WH2BR_BasketItemID) {
                                    record.actionTransferToBranchQuantityParams.disable(true);
                                }

                                record.actionTransferToWarehouseHighlight = dataResult.Action_TransferToWarehouseHighlight;

                                record.actionTransferToWarehouseQuantityOriginal(dataResult.Action_TransferToWarehouseQuantity);
                                record.actionTransferToWarehouseQuantity(dataResult.Action_TransferToWarehouseQuantity);
                                record.actionTransferToWarehouseBasketItemId(dataResult.BR2WH_BasketItemID);

                                if (dataResult.BR2WH_BasketItemID) {
                                    record.actionTransferToWarehouseQuantityParams.disable(true);
                                }

                                record.notes = dataResult.Action_NoteCount;

                                record.rangeStatus = dataResult.Range_Status;
                                record.rangeActual = dataResult.Range_Actual;

                                record.rangePlanned(dataResult.Range_Planned);
                                record.rangePlannedOriginal(dataResult.Range_Planned);

                                record.rangeInProgress = dataResult.Range_InProgress;
                                record.rangeRequired = dataResult.Range_Required;

                                record.sales180DayFW = dataResult.Sales_180Day_FW;
                                record.sales180DayKR = dataResult.Sales_180Day_KR;
                                record.sales180DayMHS = dataResult.Sales_180Day_MHS;
                                record.sales180DayUKEcommerce = dataResult.Sales_180Day_UKEcommerce;
                                record.sales180DayUKTrade = dataResult.Sales_180Day_UKTrade;
                                record.sales180DayROWTrade = dataResult.Sales_180Day_ROWTrade;
                                record.sales180DayTotal = dataResult.Sales_180Day_Total;
                                record.salesSummary = dataResult.Sales_Summary;
                                record.salesCover = dataResult.Sales_Cover;

                                record.stockCover = dataResult.Stock_Cover;
                                record.stockFWFreeStock = dataResult.Stock_FW_FreeStock;
                                record.stockKRFreeStock = dataResult.Stock_KR_FreeStock;
                                record.stockMHSFreeStock = dataResult.Stock_MHS_FreeStock;
                                record.stockWHFreeStock = dataResult.Stock_WH_FreeStock;
                                record.stockWHNextPODueDate = dataResult.Stock_WH_NextPODueDate;
                                record.stockWHNextPOFreeStock = dataResult.Stock_WH_NextPOFreeStock;
                                record.stockSummary = dataResult.Stock_Summary;

                                record.unitCostPriceGBP = dataResult.UnitCostPriceGBP;

                                record.busy(false);

                                record.loaded(true);
                            } else {
                                record.loaded = ko.observable(true);
                                record.ErrorMessage = `<h5 class="mb-0">portal.RangeManagement_Range_Select did not return a result for ProductID ${record.ProductID}</h5>`;
                            }

                            if (add) {
                                affectedRecords.push(record);
                            }
                        });

                        ko.ignoreDependencies(() => {
                            ko.utils.arrayPushAll(self.filledRecords, affectedRecords);
                        });

                        let callBound = new Date();

                        window.setTimeout(() => {
                            console.log(`fetchData bound in ${callBound - callReturn}ms`);
                        }, 0);
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

    self.unfilledAddRecordProductIds = ko.computed(() => {
        return Array.from(new Set(self.addVisibleRecords().filter(vr => {
            return self.addFilledRecords().find(fr => fr.ProductID == vr.ProductID) == null;
        }).map(vr => vr.ProductID)));
    }, self).extend({
        rateLimit: {
            timeout: 100,
            method: 'notifyWhenChangesStop'
        }
    });

    self.fetchAddData = ko.computed(() => {
        let uarpids = self.unfilledAddRecordProductIds();

        if (uarpids.length) {

            if (uarpids.length > 1) {
                self.setBusy();
            }

            window.setTimeout(() => {

                fetch('/api/rangemanagementapi/FetchData', {
                    method: 'POST',
                    headers: window.fetchHeaders,
                    body: JSON.stringify({
                        branchId: self.branchId(),
                        productIds: uarpids
                    })
                })
                    .then(window.handleFetchResponse)
                    .then(data => {

                        let records = self.addSearchResults.peek();
                        let affectedRecords = [];
                        let filledRecords = self.filledRecords.peek();

                        uarpids.forEach(pid => {

                            let record = records.find(p => p.ProductID === pid);
                            let dataResult = data.Results.find(p => p.ProductID == pid);
                            let filledRecord = filledRecords.find(p => p.ProductID == pid);

                            let add = true;

                            if (filledRecord == null) {
                                record = addResultRecord({
                                    branchId: self.branchId(),
                                    rec: record,
                                    productFilter: ko.computed(() => {
                                        return self.completeProductFilters().find(p => p.ProductFilterID == record.ProductFilterID)
                                    }, self)
                                });

                                record.element.subscribe(nv => {
                                    self.addIntersectionObserver.observe(nv);
                                });

                                record.busy(false);

                                record.loaded(true);
                            } else {
                                add = false;
                                filledRecord.loaded(true);
                                record = filledRecord;
                            }

                            record.actionAddToRangeHighlight(dataResult.Action_AddToRangeHighlight);
                            record.actionRecommendations(dataResult.Action_Recommendation);
                            record.allowed(dataResult.Control_Allow_AddToRange);

                            record.sales180DayFW = dataResult.Sales_180Day_FW;
                            record.sales180DayKR = dataResult.Sales_180Day_KR;
                            record.sales180DayMHS = dataResult.Sales_180Day_MHS;
                            record.sales180DayUKEcommerce = dataResult.Sales_180Day_UKEcommerce;
                            record.sales180DayUKTrade = dataResult.Sales_180Day_UKTrade;
                            record.sales180DayROWTrade = dataResult.Sales_180Day_ROWTrade;
                            record.sales180DayTotal = dataResult.Sales_180Day_Total;
                            record.salesSummary = dataResult.Sales_Summary;
                            record.salesCover = dataResult.Sales_Cover;

                            record.stockCover = dataResult.Stock_Cover;
                            record.stockFWFreeStock = dataResult.Stock_FW_FreeStock;
                            record.stockKRFreeStock = dataResult.Stock_KR_FreeStock;
                            record.stockMHSFreeStock = dataResult.Stock_MHS_FreeStock;
                            record.stockWHFreeStock = dataResult.Stock_WH_FreeStock;
                            record.stockWHNextPODueDate = dataResult.Stock_WH_NextPODueDate;
                            record.stockWHNextPOFreeStock = dataResult.Stock_WH_NextPOFreeStock;
                            record.stockSummary = dataResult.Stock_Summary;

                            if (add) {
                                affectedRecords.push(record);
                            }

                            affectedRecords.push(record);
                        });

                        ko.utils.arrayPushAll(self.addFilledRecords, affectedRecords);

                        //self.fetchAddDataBusy(false);

                        //self.addGridSettings.widget().refresh();

                        //document.querySelector("#add-results-grid .k-grid-content.k-auto-scrollable").scrollTo(0, self.addGridScrollRestoration);

                        if (uarpids.length > 1) {
                            self.clearBusy();
                        }
                    })
                    .catch(err => {
                        //ko.ignoreDependencies(() => {
                        //    self.clearBusy();
                        //});
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

    self.groupedSearchResults = ko.computed(() => {

        let key = "ProductFilterName";

        if (self.searchResults().length) {
            let results = [];

            let productFilterGrouping = Object.groupBy(self.searchResults(), (sr) => sr.ProductFilterID);

            Object.keys(productFilterGrouping).forEach(k => {
                let productFilterGroup = {};

                k = +k;

                productFilterGroup.name = ko.computed(() => {
                    let cpfs = self.completeProductFilters();
                    let pf = cpfs.find(pfid => {
                        return pfid.ProductFilterID === k;
                    });
                    if (pf)
                        return pf.Name.replace(/<br\/>/g, ' ');
                }, self);

                productFilterGroup.items = ko.observableArray(productFilterGrouping[k]);

                productFilterGroup.plannedCount = ko.computed(() => {
                    return self.productFilterTotals().find(pft => pft.ProductFilterID === k)?.PlannedCount;
                }, self);

                productFilterGroup.plannedValue = ko.computed(() => {
                    return self.productFilterTotals().find(pft => pft.ProductFilterID === k)?.PlannedValue;
                }, self);

                productFilterGroup.actualCount = ko.computed(() => {
                    return self.productFilterTotals().find(pft => pft.ProductFilterID === k)?.ActualCount;
                }, self);

                productFilterGroup.actualValue = ko.computed(() => {
                    return self.productFilterTotals().find(pft => pft.ProductFilterID === k)?.ActualValue;
                }, self);

                productFilterGroup.inProgressCount = ko.computed(() => {
                    return self.productFilterTotals().find(pft => pft.ProductFilterID === k)?.InProgressCount;
                }, self);

                productFilterGroup.inProgressValue = ko.computed(() => {
                    return self.productFilterTotals().find(pft => pft.ProductFilterID === k)?.InProgressValue;
                }, self);
                
                results.push(productFilterGroup);
            });

            results.forEach(pf => {
                let productPages = [];

                let productPageGrouping = Object.groupBy(pf.items(), (i) => i.ProductPageName || "");

                Object.keys(productPageGrouping).forEach(k => {
                    productPages.push({
                        name: k,
                        items: ko.observableArray(productPageGrouping[k])
                    });
                });

                productPages.forEach(ppg => {
                    let orderFormGroups = [];

                    let orderFormGrouping = Object.groupBy(ppg.items(), (i) => i.OrderFormGroup || "");

                    Object.keys(orderFormGrouping).forEach(k => {
                        orderFormGroups.push({
                            name: k,
                            items: ko.observableArray(orderFormGrouping[k])
                        });
                    });

                    ppg.items = orderFormGroups;
                });

                pf.items = productPages;
            });

            console.log(results);

            return results;
        }
    }, self);


    self.groupedAddSearchResults = ko.computed(() => {

        let key = "ProductFilterName";

        if (self.searchResults().length) {
            let results = [];

            let productFilterGrouping = Object.groupBy(self.addSearchResults(), (sr) => sr.ProductFilterName);

            Object.keys(productFilterGrouping).forEach(k => {
                results.push({
                    name: k,
                    items: ko.observableArray(productFilterGrouping[k])
                });
            });

            results.forEach(pf => {
                let productPages = [];

                let productPageGrouping = Object.groupBy(pf.items(), (i) => i.ProductPageName || "");

                Object.keys(productPageGrouping).forEach(k => {
                    productPages.push({
                        name: k,
                        items: ko.observableArray(productPageGrouping[k])
                    });
                });

                productPages.forEach(ppg => {
                    let orderFormGroups = [];

                    let orderFormGrouping = Object.groupBy(ppg.items(), (i) => i.OrderFormGroup || "");

                    Object.keys(orderFormGrouping).forEach(k => {
                        orderFormGroups.push({
                            name: k,
                            items: ko.observableArray(orderFormGrouping[k])
                        });
                    });

                    ppg.items = orderFormGroups;
                });

                pf.items = productPages;
            });

            console.log(results);

            return results;
        }
    }, self);

    self.refreshProductFilterTotal = (productFilterId) => {
        fetch('/api/rangemanagementapi/RefreshProductFilterTotal', {
            method: 'POST',
            headers: window.fetchHeaders,
            body: JSON.stringify({
                branchId: self.branchId(),
                productFilterId: productFilterId
            })
        })
        .then(window.handleFetchResponse)
        .then(data => {
            self.productFilterTotals.remove(pft => pft.ProductFilterID == productFilterId);
            self.productFilterTotals.push(data);
        })
        .catch(window.catchFetchError);
    }

    //#endregion


    //#region Events

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
                self.transferOrdersWH2BRGridSettings.widget().dataSource.read();
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
                self.transferOrdersBR2WHGridSettings.widget().dataSource.read();
                bootstrap.Tab.getOrCreateInstance(document.getElementById("recall-tab-btn")).show();
            });
        }
    });

    window.addEventListener("onbeforeunload", (event) => {
        self.checkUnsavedChangesThenSelect = async (event) => {
            await self.unsavedChanges().then((d) => {

            }).catch((e) => { });
        }
    });

    return self;
};

const resultRecord = function ({
    branchId,
    rec,
    fetchBranchBasketsNonce
    //productFilter,
    //productFilterRefreshFn
} = {
        branchId: null,
        rec: null,
        //productFilter: ko.computed(() => { }),
        //productFilterRefreshFn: () => { }
    }) {
    //console.log(productFilter);

    let self = Object.assign({}, rec);

    //self.element = ko.observable();

    self.branchId = branchId;

    self.busy = ko.observable(false);

    self.loaded = ko.observable(false);

    self.fetchBranchBasketsNonce = fetchBranchBasketsNonce;

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

    self.incrementAmount = self.ProductFilterGroupID === 1 ? 0.5 : 1;
    self.scale = self.ProductFilterGroupID === 1 ? 1 : 0;

    // don't forget to set your originals to currents on save

    self.actionRecommendations = null;
    self.actionTransferToBranchHighlight = null;
    self.actionTransferToBranchQuantityOriginal = ko.observable();
    self.actionTransferToBranchQuantity = ko.observable().extend(self.defaultNumericalExtension);
    self.actionTransferToBranchBasketItemId = ko.observable();
    self.actionTransferToWarehouseHighlight = null;
    self.actionTransferToWarehouseQuantityOriginal = ko.observable();
    self.actionTransferToWarehouseQuantity = ko.observable().extend(self.defaultNumericalExtension);
    self.actionTransferToWarehouseBasketItemId = ko.observable();

    self.rangeStatus = null;
    self.rangeActual = null;
    //self.rangeStartDate = null;
    //self.rangeEndDate = null;
    self.rangePlannedOriginal = ko.observable();
    self.rangePlanned = ko.observable().extend(self.defaultNumericalExtension);
    self.rangeRequired = null;
    self.rangeInProgress = null;

    self.sales180DayFW = null;
    self.sales180DayKR = null;
    self.sales180DayMHS = null;
    self.sales180DayUKEcommerce = null;
    self.sales180DayUKTrade = null;
    self.sales180DayROWTrade = null;
    self.sales180DayTotal = null;
    self.salesSummary = null;
    self.salesCover = null;

    self.stockCover = null;
    self.stockFWFreeStock = null;
    self.stockKRFreeStock = null;
    self.stockMHSFreeStock = null;
    self.stockWHFreeStock = null;
    self.stockWHNextPODueDate = null;
    self.stockWHNextPOFreeStock = null;
    self.stockRingFence = null;
    self.stockSummary = null;

    self.unitCostPriceGBP = null;

    self.notes = null;

    //productFilter.subscribe(pf => {

    //    self.incrementAmount(pf.QuantityIncrement || 1);

    //    self.scale(pf.QuantityPrecision);

    //    let productFilterNumericalExtension = {
    //        numberUnformatted: {
    //            minValue: pf.QuantityMinimum,
    //            maxValue: 999999,
    //            digits: self.scale(),
    //            currency: {
    //                FormattingCulture: 'en-GB'
    //            }
    //        },
    //        numeric: {
    //            params: {
    //                required: false,
    //                numericMin: pf.QuantityMinimum,
    //                numericMax: 999999
    //            }
    //        }
    //    };

    //    self.rangePlanned.extend(productFilterNumericalExtension);
    //    self.actionTransferToWarehouseQuantity.extend(productFilterNumericalExtension);
    //    self.actionTransferToBranchQuantity.extend(productFilterNumericalExtension);
    //});

    self.buildNumericParams = (observable, original, incrementAmount, scale, min, max) => {
        return {
            label: null,
            observable: observable,
            //focusObservable: ko.observable(false),// ffffffffffffffffffff WHAT?! this being provided here was causing the input element to bounce focus out to body -- TWICE
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
                self.observable(0);
                self.observable.DOMElement.focus();
            },
            useNativeValidation: false, // this feeds through to mdc objects and affects them
            decorateInputElement: true,
            insertValidationMessages: false,
            inputType: 'number',
            small: true,
            buttons: true,
            minValue: min, // don't have productFilter record in time to set this truthfully, sorry
            maxValue: max,
            step: 1,
            cssClasses: null,
            incrementAmount: incrementAmount,
            increment: function () {
                let self = this;

                let v = +self.observable() || 0;

                let factor = Math.pow(10, scale);

                if ((v + self.incrementAmount) < max)
                    self.observable(Math.round((v + self.incrementAmount) * factor) / factor);
            },
            decrement: function () {
                let self = this;

                let v = +self.observable() || 0;

                let factor = Math.pow(10, scale);

                let diff = Math.round((v - self.incrementAmount) * factor) / factor;

                if ((v - self.incrementAmount) > min)
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
                            viewModel.refreshProductFilterTotal(self.ProductFilterID);

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
        self.scale,
        0,
        9999);

    self.rangePlannedParams.revertable(false);

    self.actionTransferToWarehouseQuantityParams = self.buildNumericParams(
        self.actionTransferToWarehouseQuantity,
        self.actionTransferToWarehouseQuantityOriginal,
        self.incrementAmount,
        self.scale,
        0,
        9999);

    self.actionTransferToBranchQuantityParams = self.buildNumericParams(
        self.actionTransferToBranchQuantity,
        self.actionTransferToBranchQuantityOriginal,
        self.incrementAmount,
        self.scale,
        0,
        9999);

    //self.actionTransferToWarehouseQuantityParams.focusObservable.subscribe((nv, e) => {
    //    console.log('focus', nv, e);
    //});

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
                self.fetchBranchBasketsNonce.valueHasMutated();
                //self.actionTransferToBranchQuantityParams.busy(false);
                self.actionTransferToBranchBasketItemId(data.BasketItemID);
                if (data.Notification) {
                    window.showInfo("Notice", data.Notification);
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
                self.fetchBranchBasketsNonce.valueHasMutated();
                //self.actionTransferToWarehouseQuantityParams.busy(false);
                self.actionTransferToWarehouseBasketItemId(data.BasketItemID);
                if (data.Notification) {
                    window.showInfo("Notice", data.Notification);
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
                self.fetchBranchBasketsNonce.valueHasMutated();
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
                self.fetchBranchBasketsNonce.valueHasMutated();
                //self.actionTransferToWarehouseQuantityParams.busy(false);
                self.actionTransferToWarehouseBasketItemId(null);
                if (data.Notification) {
                    window.showInfo("Notice", data.Notification);
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

    self.submitHidden = ko.computed(() => {
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
    //console.log(productFilter);

    let self = Object.assign({}, rec);

    self.element = ko.observable();

    self.branchId = branchId;

    self.busy = ko.observable(false);

    self.loaded = ko.observable(false);

    self.allowed = ko.observable(false);

    self.sales180DayFW = null;
    self.sales180DayKR = null;
    self.sales180DayMHS = null;
    self.sales180DayUKEcommerce = null;
    self.sales180DayUKTrade = null;
    self.sales180DayROWTrade = null;
    self.sales180DayTotal = null;
    self.salesSummary = null;
    self.salesCover = null;

    self.stockCover = null;
    self.stockFWFreeStock = null;
    self.stockKRFreeStock = null;
    self.stockMHSFreeStock = null;
    self.stockWHFreeStock = null;
    self.stockWHNextPODueDate = null;
    self.stockWHNextPOFreeStock = null;
    self.stockRingFence = null;
    self.stockSummary = null;

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
    self.actionAddToRangeQuantity = ko.observable(0).extend(self.defaultNumericalExtension);
    self.actionAddToRangeQuantityOriginal = ko.observable(0);

    self.actionTransferToRangeBasketItemId = ko.observable();

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

    self.buildNumericParams = (observable, original, incrementAmount, scale, min, max) => {
        return {
            label: null,
            observable: observable,
            //focusObservable: ko.observable(false),// ffffffffffffffffffff WHAT?! this being provided here was causing the input element to bounce focus out to body -- TWICE
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
                self.observable(0);
                self.observable.DOMElement.focus();
            },
            useNativeValidation: false, // this feeds through to mdc objects and affects them
            decorateInputElement: true,
            insertValidationMessages: false,
            inputType: 'number',
            small: true,
            buttons: true,
            minValue: min, // don't have productFilter record in time to set this truthfully, sorry
            maxValue: max,
            step: 1,
            cssClasses: null,
            incrementAmount: incrementAmount,
            increment: function () {
                let self = this;

                let v = +self.observable() || 0;

                let factor = Math.pow(10, scale());

                if ((v + self.incrementAmount()) < max)
                    self.observable(Math.round((v + self.incrementAmount()) * factor) / factor);
            },
            decrement: function () {
                let self = this;

                let v = +self.observable() || 0;

                let factor = Math.pow(10, scale());

                let diff = Math.round((v - self.incrementAmount()) * factor) / factor;

                if ((v - self.incrementAmount()) > min || diff === 0)
                    self.observable(diff);
            }
        }
    };

    self.actionAddToRangeQuantityParams = self.buildNumericParams(
        self.actionAddToRangeQuantity,
        self.actionAddToRangeQuantityOriginal,
        self.incrementAmount,
        self.scale,
        1,
        9999);

    self.actionAddToRangeQuantityParams.revertable(false);

    self.actionAddToRangeQuantityParams.enable = self.allowed;

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
        return ((self.actionAddToRangeQuantity() != 0) && (self.actionAddToRangeQuantityParams.disable() == false))
    }, self);

    self.busy.subscribe(nv => {
        self.actionAddToRangeQuantityParams.busy(nv);
        self.actionAddToRangeQuantityParams.disable(nv);
    });

    self.submitDisabled = ko.computed(() => {
        return (self.actionAddToRangeQuantityParams.busy() || self.actionAddToRangeQuantityParams.disable());
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

                self.actionRecommendations("<div class='alert alert-success mb-0'><p>This product has been added to the range.<br/>Consider reloading this grid.</p></div>")

                self.actionAddToRangeQuantityParams.busy(false); // ... ?
                window.setTimeout(() => {
                    self.actionAddToRangeQuantityParams.disable(true); // ... ?
                }, 0);
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