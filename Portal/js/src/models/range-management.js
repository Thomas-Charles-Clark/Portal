const
    VIEW_MANAGE = 1,
    VIEW_RESTOCK = 2,
    VIEW_RECALL = 3,
    VIEW_ADD = 4

const rangeManagementViewModel = ({ } = {}) => {
    let self = {};

    //#region Properties

    // impossible virtual scrolling property madness

    self.rowHeight = 80;

    self.scrollY = ko.observable(0);

    self.productFilterGroupRowHeight = 30;

    self.productPageGroupRowHeight = 26;

    self.orderFormGroupRowHeight = 22;

    self.maxY = ko.observable(window.innerHeight);

    self.addGridHeaderHeight = 56;

    self.addGridTotalHeight = ko.observable();

    self.gridHeaderHeight = 56;

    self.gridTotalHeight = ko.observable();

    self.gridScrollBottomPadding = ko.observable(0);

    self.finalRowVisible = ko.observable(false);

    self.gridPositionTop = 158;

    self.addGridPositionTop = 158;

    ///

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
        revertible: false,
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

    // this is used to hold the records we need to data fetch for those which the dataSource has deemed to be "in view"
    self.recordsToDataFetch = ko.observableArray([]);

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
    self.addSearchResults = ko.observableArray([]);

    self.addRecordsToDataFetch = ko.observableArray([]);

    self.addFilledRecords = ko.observableArray([]);

    self.addGridScrollRestoration = null;

    //#endregion


    //#region Prefilters

    self.branchId = ko.observable('');
    self.branch = ko.observable();

    self.launchId = ko.observable(''); // if you don't initialise to '' you'll find that opening and immediately dismissing the associated dropdown
    self.launch = ko.observable(); // the above caveat appears to only apply to odata bound drop down lists

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

    self.saleStatus = ko.observable();
    self.saleStatusCode = ko.observable('');

    self.stockStatus = ko.observable();
    self.stockStatusCode = ko.observable('');

    self.addStockStatus = ko.observable();
    self.addStockStatusCode = ko.observable('');

    self.searchTerm = ko.observable().extend({
        rateLimit: {
            timeout: 500,
            method: 'notifyWhenChangesStop'
        }
    });

    //#endregion

    self.intersectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            self.finalRowVisible(entry.isIntersecting);
        });
    }, {
        rootMargin: "0px"
    });


    //self.addIntersectionObserver = new IntersectionObserver((entries, observer) => {
    //    entries.forEach((entry) => {
    //        console.log('observation');
    //        if (entry.isIntersecting) {
    //            let data = ko.dataFor(entry.target);
    //            if (data == null || !data.hasOwnProperty("loaded")) {
    //                if (!self.addVisibleRecords().find(vid => vid.ProductID === data.ProductID))
    //                    self.addVisibleRecords.push(data);
    //            }
    //            //entry.target.style.display = "table-row";
    //        } else {
    //            let data = ko.dataFor(entry.target);
    //            if (data && data.hasOwnProperty('loaded') && data.loaded()) {
    //                self.addIntersectionObserver.unobserve(entry.target);
    //            }
    //            //entry.target.style.display = "none";   
    //        }
    //    });
    //}, {
    //    rootMargin: "140px",
    //    threshold: 0.1
    //});

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
            launchId: self.launchId(),
            saleStatusCode: self.saleStatusCode(),
            statusGroupId: self.statusGroupId()
        };

        let view = self.view();

        // because if I don't do this 
        if (self.searchTerm())
            props.searchTerm = self.searchTerm();

        // they'll end up serialising "undefined" or "null" :\
        if (self.stockStatusCode())
            props.stockStatusCode = self.stockStatusCode();

        // they'll end up serialising "undefined" or "null" :\
        if (self.addStockStatusCode())
            props.addStockStatusCode = self.addStockStatusCode();

        if (self.gridParamsFirstRun)
            self.gridParamsFirstRun = false;
        else {
            if (self.branchId() ||
                self.productFilterGroupId() ||
                self.productFilterId() ||
                self.brandId() ||
                self.launchId() ||
                self.saleStatusCode() ||
                self.statusGroupId() ||
                self.stockStatusCode() ||
                self.addStockStatusCode() ||
                self.searchTerm()) {
                window.setTimeout(() => {
                    let obj = null;

                    switch (self.view()) {
                        case VIEW_MANAGE:
                            //obj = self.gridSettings;
                            self.recordsToDataFetch([]);
                            break;
                        case VIEW_ADD:
                            //obj = self.addGridSettings;
                            self.addRecordsToDataFetch([]);
                            break;
                        default:
                            break;
                    }

                    //if (obj && obj.widget()) {
                    //    obj.widget().dataSource.data([]);

                    //    let grouping = obj.widget().dataSource.group();

                    //    let pageSize = obj.widget().dataSource.pageSize();

                    //    obj.widget().dataSource.query({
                    //        page: 1,
                    //        pageSize: pageSize,
                    //        group: grouping
                    //    });
                    //}
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
        group: [{
            field: "TradeAccountLabel",
            dir: "desc"
        }, {
            field: "SecondaryGroupingLabel",
            dir: "asc"
        }]
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
        group: [{
            field: "TradeAccountLabel",
            dir: "desc"
        }, {
            field: "SecondaryGroupingLabel",
            dir: "asc"
        }]
    });

    self.transferOrdersColumns = [{
        title: "Trade Account",
        field: "TradeAccountLabel",
        width: 375,
        groupHeaderTemplate: (e) => {
            return `Trade Account: ${e.value}`;
        },
        hidden: true,
        filterable: false
    }, {
        title: " ",
        field: "SecondaryGroupingLabel",
        groupHeaderTemplate: (e) => {
            return `${e.value}`;
        },
        hidden: true,
        filterable: false
    }, {
        title: "Order ID",
        field: "OrderID",
        width: 100,
        headerAttributes: {
            class: "text-end"
        },
        groupHeaderTemplate: (e) => {
            return `Order ID: ${e.value} - Order Date: ${renderDate(e.items[0].OrderDT)}`;
        },
        hidden: true,
        filterable: false
    }, {
        title: "Order Date",
        field: "OrderDT",
        width: 100,
        hidden: true,
        filterable: false
    }, {
        title: "Basket Date",
        field: "BasketDT",
        width: 100,
        template: (e) => {
            return renderDate(e.value)
        },
        hidden: true,
        filterable: false
    }, {
        title: " ",
        field: "ImageID",
        width: 80,
        filterable: false
    }, {
        title: "Product",
        field: "Product",
        filterable: false
    }, {
        title: "Quantity",
        field: "QuantityOrdered",
        width: 80,
        headerAttributes: {
            class: "text-end"
        },
        filterable: false
    }, {
        title: "Status",
        field: "DetailedLineStatus",
        filterable: {
            multi: true
        } 
    }, {
        title: "Basket Item ID",
        field: "BasketItemID",
        width: 120,
        headerAttributes: {
            class: "text-end"
        },
        filterable: false
    }, {
        title: "Order Line ID",
        field: "OrderLineID",
        width: 140,
        headerAttributes: {
            class: "text-end"
        },
        filterable: false
    }, {
        title: "Type",
        field: "Type",
        width: 60,
        filterable: false,
        hidden: true
    }, {
        title: "SecondarySorting",
        field: "SecondarySorting",
        hidden: true
    }]

    self.transferOrdersWH2BRGridSettings = {
        autoBind: true,
        widget: ko.observable(),
        useKOTemplates: true,
        rowTemplate: "transfer-orders-row-template",
        data: self.transferOrdersWH2BRDataSource,
        columns: self.transferOrdersColumns,
        sortable: false,
        groupable: false,
        reorderable: false,
        filterable: true,
        selectable: false,
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
        revertible: ko.observable(false),
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
        revertible: ko.observable(false),
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
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: [{
            dir: 'asc',
            field: 'Name'
        }],
        select: self.genericUnsavedChangesSelect,
        afterClear: () => {
            self.productFilterGroupParams.clearFunction();
        },
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
        revertible: ko.observable(false),
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
        revertible: ko.observable(false),
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
        revertible: ko.observable(false),
        readOnly: false,
        filter: false,
        autoBind: true,
        height: 340,
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear
    });

    self.saleStatusParams = kendoMDCDropDownList({
        label: 'Sale Status',
        data: [{
            Name: "On Sale",
            Value: "OnSale"
        }, {
            Name: "Not on Sale",
            Value: "NotOnSale"
        }],
        textField: 'Name',
        valueField: 'Value',
        virtual: false,
        idObservable: self.saleStatusCode,
        objObservable: self.saleStatus,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
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
        revertible: ko.observable(false),
        readOnly: false,
        filter: false,
        autoBind: true,
        height: 340,
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear
    });

    self.addStockStatusParams = kendoMDCDropDownList({
        label: 'Stock Status',
        data: [{
            Value: "InStock",
            Name: "In Stock"
        }, {
            Name: "OutOfStock",
            Value: "Out of Stock"
        }],
        textField: 'Name',
        valueField: 'Value',
        virtual: false,
        idObservable: self.addStockStatusCode,
        objObservable: self.addStockStatus,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
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
        revertible: ko.observable(false),
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        useNativeValidation: false, // this feeds through to mdc objects and affects them
        decorateInputElement: true,
        insertValidationMessages: false,
        enterKey: () => {
            //self.gridSettings.widget().dataSource.read();
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

            // 
            self.productFilterParams.clearFunction();
        }
    });

    self.branch.subscribe(branch => {
        //console.log('branch', branch);
        if (branch) {
            self.refreshProductFilters(branch);
            switch (self.view()) {
                case VIEW_RESTOCK:
                    self.transferOrdersWH2BRGridSettings.widget().dataSource.read();
                    break;
                case VIEW_RECALL:
                    self.transferOrdersBR2WHGridSettings.widget().dataSource.read();
                    break;
                default: break;
            }
        } else {
            self.clearProductFilters();
        }
    });

    //#endregion


    //#region Methods

    self.refreshTransferOrders = () => {
        self.setBusy();
        let direction = null;
        switch (self.view()) {
            case VIEW_RESTOCK:
                direction = 'WH2BR';
                break;
            case VIEW_RECALL:
                direction = 'BR2WH';
                break;
            default: break;
        }

        data = {
            branchId: self.branchId(),
            transferDirection: "WH2BR"
        };

        let qs = new URLSearchParams(data);

        fetch(`/api/RangeManagementAPI/RefreshTransferOrders?${qs}`, {
            method: 'GET',
            headers: window.fetchHeaders,
        })
            .then(window.handleFetchResponse)
            .then(data => {
                switch (self.view()) {
                    case VIEW_MANAGE:
                        self.filledRecords().forEach(fr => {
                            fr.loaded(false);
                            fr.busy(true);
                        });
                        self.recordsToDataFetch(self.filledRecords().map((fr) => { return { ProductID: fr.ProductID } }));
                        break;
                    case VIEW_ADD:
                        self.addFilledRecords().forEach(fr => {
                            fr.loaded(false);
                            fr.busy(true);
                        });
                        self.addRecordsToDataFetch(self.addFilledRecords().map((fr) => { return { ProductID: fr.ProductID } }));
                        self.addFilledRecords([]);
                        self.addRecordsToDataFetch.valueHasMutated(); // this extra shenanigans necessary because look at the 
                        // computed for the add to grid unfilledrecordproductids 
                        break;
                    case VIEW_RESTOCK:
                        self.transferOrdersWH2BRGridSettings.widget().dataSource.read();
                        break;
                    case VIEW_RECALL:
                        self.transferOrdersBR2WHGridSettings.widget().dataSource.read();
                        break;
                    default:
                        break;
                }

                self.clearBusy();
            })
            .catch(err => {
                window.handleFetchError(err);
            })
    }

    self.clearGridData = () => {
        self.recordsToDataFetch([]);
        self.filledRecords([]);
    }

    self.clearAddGridData = () => {
        self.addRecordsToDataFetch([]);
        self.addFilledRecords([]);
    }

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
        self.reloadRecord(self.addingNoteToRecord());
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
                        self.branchCheck({
                            dataItem: {
                                BranchID: self.branchId()
                            }
                        });
                    });
                })
                .catch(window.catchFetchError);
        }, null);
    }

    self.searchResultsPostProcessing = () => {
        //let productFilterRows = Array.from(document.querySelectorAll(".product-filter-name-row")).reduce((a, i) => a += i.clientHeight, 0);
        //let productPageNameRows = Array.from(document.querySelectorAll(".product-page-name-row")).reduce((a, i) => a += i.clientHeight, 0);
        //let orderFormGroupNameRows = Array.from(document.querySelectorAll(".order-form-group-row")).reduce((a, i) => a += i.clientHeight, 0);
        //let rows = self.searchResults().length * self.rowHeight;

        //self.gridTotalHeight(productFilterRows + productPageNameRows + orderFormGroupNameRows + rows);

        //window.setTimeout(() => {
        //    if (self.intersectionObserver) {
        //        document.querySelectorAll("#results-grid tbody tr[role=row]:not(.k-grouping-row)").forEach(row => {
        //            console.log('observing');
        //            self.intersectionObserver.observe(row);
        //        });
        //    }
        //}, 0);
    }

    self.addSearchResultsPostProcessing = () => {
        //window.setTimeout(() => {
        //    if (self.addIntersectionObserver) {
        //        document.querySelectorAll("#add-results-grid tbody tr[role=row]:not(.k-grouping-row)").forEach(row => {
        //            console.log('observing');
        //            self.addIntersectionObserver.observe(row);
        //        });
        //    }
        //}, 0);
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

    self.reloadRecord = (rec) => {
        self.recordsToDataFetch.push(rec);
    }

    self.reloadAddRecord = (rec) => {
        self.addRecordsToDataFetch.push(rec);
    }

    //#endregion


    //#region Computeds

    self.branchTotalPlannedValue = ko.computed(() => {
        let totalValue = self.productFilterTotals().reduce((a, i) => a += i.PlannedValue, 0);
        return `${formatCurrency(totalValue, 0, 'en-GB', 'GBP')}`;
    }, self);

    self.branchTotalPlannedCount = ko.computed(() => {
        let totalCount = self.productFilterTotals().reduce((a, i) => a += i.PlannedCount, 0);
        return `(Q. ${formatNumber(totalCount, 0, 'en-GB')})`;
    }, self);

    self.branchTotalActualValue = ko.computed(() => {
        let totalValue = self.productFilterTotals().reduce((a, i) => a += i.ActualValue, 0);
        return `${formatCurrency(totalValue, 0, 'en-GB', 'GBP')}`;
    }, self);

    self.branchTotalActualCount = ko.computed(() => {
        let totalCount = self.productFilterTotals().reduce((a, i) => a += i.ActualCount, 0);
        return `(Q. ${formatNumber(totalCount, 0, 'en-GB')})`;
    }, self);

    self.branchTotalInProgressValue = ko.computed(() => {
        let totalValue = self.productFilterTotals().reduce((a, i) => a += i.InProgressValue, 0);
        return `${formatCurrency(totalValue, 0, 'en-GB', 'GBP')}`;
    }, self);

    self.branchTotalInProgressCount = ko.computed(() => {
        let totalCount = self.productFilterTotals().reduce((a, i) => a += i.InProgressCount, 0);
        return `(Q. ${formatNumber(totalCount, 0, 'en-GB')})`;
    }, self);

    self.fetchProducts = ko.computed(() => {

        if (self.view() == VIEW_MANAGE) {

            self.filledRecords([]);

            self.clearAddGridData();

            window.scrollTo({ top: 0, left: 0, behavior: "instant" });

            self.setBusy();

            let data = self.gridParams();

            let qs = new URLSearchParams(data);

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

                    self.productFilterTotals(data.Totals.map(t => {
                        t.ProductFilterName = t.ProductFilterName.replace('<br/>', ' ');
                        return t;
                    }));

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

            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "instant"
            });

            self.addFilledRecords([]);

            self.clearGridData();

            self.setBusy();

            let data = self.gridParams();

            let qs = new URLSearchParams(data);

            //console.log('fetchProductsAddToRange calling with', data);

            //let callStart = new Date();

            fetch(`/api/rangeManagementApi/FetchProductsAddToRange?${qs}`, {
                method: 'GET',
                headers: window.fetchHeaders
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    //console.log('fetchProductsAddToRange returned', data);

                    //let callReturn = new Date();

                    //console.log(`fetchProductsAddToRange returned in ${callReturn - callStart}ms`, data);

                    //if (data.Data.length === 0)
                        self.clearBusy();

                    self.addSearchResults(data.Data.map((d, i) => {
                        d.offsetY = self.rowHeight * (i + 1);
                        return d;
                    }));

                    window.setTimeout(() => {
                        //self.addSearchResultsPostProcessing();

                        //let renderDone = new Date();

                        //console.log(`fetchProductsAddToRange rendered in ${renderDone - callStart}ms`, data);

                    }, 0);

                })
                .catch(err => {
                    self.clearBusy();
                    window.catchFetchError(err);
                });
        }
    }, self);

    self.unfilledRecordProductIds = ko.computed(() => {
        let results = Array.from(new Set(self.recordsToDataFetch().filter(vr => {
            let r = self.filledRecords().find(fr => fr.ProductID == vr.ProductID);
            return (r == null || r && r.loaded() == false);
        }).map(cr => cr.ProductID)));
        return results;
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
                //console.log('fetchData calling with', urpids);

                //let callStart = new Date();

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

                        //let callReturn = new Date();

                        //console.log(`fetchData returned in ${callReturn - callStart}ms`, data);

                        let records = self.searchResults.peek();
                        let affectedRecords = [];
                        let filledRecords = self.filledRecords.peek();
                        let forcedRemovals = [];

                        urpids.forEach(pid => {

                            let record = records.find(p => p.ProductID === pid);
                            // if record is null here, we've fetched data for something which is no longer amongst our search results.
                            // this will readily cause chaos: remove it from the 'to be fetched' collection.

                            if (record != null) {

                                let dataResult = data.Results.find(p => p.ProductID == pid);
                                let filledRecord = filledRecords.find(p => p.ProductID == pid);

                                let add = true;

                                if (dataResult) {

                                    if (filledRecord == null) {
                                        record = resultRecord({
                                            branchId: self.branchId(),
                                            rec: record,
                                            fetchBranchBasketsNonce: self.fetchBranchBasketsNonce,
                                            reload: self.reloadRecord
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
                                    record.actionTransferToBranchExtantTransferQuantity(dataResult.WH2BR_Quantity);

                                    if (dataResult.WH2BR_BasketItemID) {
                                        record.actionTransferToBranchQuantityParams.disable(true);
                                    }

                                    record.actionTransferToWarehouseHighlight = dataResult.Action_TransferToWarehouseHighlight;

                                    record.actionTransferToWarehouseQuantityOriginal(dataResult.Action_TransferToWarehouseQuantity);
                                    record.actionTransferToWarehouseQuantity(dataResult.Action_TransferToWarehouseQuantity);
                                    record.actionTransferToWarehouseBasketItemId(dataResult.BR2WH_BasketItemID);
                                    record.actionTransferToWarehouseExtantTransferQuantity(dataResult.BR2WH_Quantity);

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

                                    record.sales180DayBranch = dataResult.Sales_180Day_Branch;
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

                                    record.priceSummary = dataResult.Price_Summary;

                                    record.busy(false);

                                    record.loaded(true);
                                } else {
                                    record.loaded = ko.observable(true);
                                    record.ErrorMessage = `<h5 class="mb-0">portal.RangeManagement_Range_Select did not return a result for ProductID ${record.ProductID}</h5>`;
                                }

                                if (add) {
                                    affectedRecords.push(record);
                                }
                            } else {
                                forcedRemovals.push(pid);
                            }
                        });

                        ko.ignoreDependencies(() => {
                            affectedRecords.forEach(ar => {
                                self.recordsToDataFetch.remove(rtdf => rtdf.ProductID === ar.ProductID);
                            });

                            forcedRemovals.forEach(fr => {
                                self.recordsToDataFetch.remove(rtdf => rtdf.ProductID == fr);
                            })

                            ko.utils.arrayPushAll(self.filledRecords, affectedRecords);
                        });

                        //let callBound = new Date();

                        //window.setTimeout(() => {
                        //    console.log(`fetchData bound in ${callBound - callReturn}ms`);
                        //}, 0);
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
        return Array.from(new Set(self.addRecordsToDataFetch().filter(vr => {
            return self.addFilledRecords.peek().find(fr => fr.ProductID == vr.ProductID) == null;
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
                        let forcedRemovals = [];

                        uarpids.forEach(pid => {

                            let record = records.find(p => p.ProductID === pid);
                            // if record is null here, we've fetched data for something which is no longer amongst our search results.
                            // this will readily cause chaos: remove it from the 'to be fetched' collection.

                            if (record != null) {

                                let dataResult = data.Results.find(p => p.ProductID == pid);
                                let filledRecord = filledRecords.find(p => p.ProductID == pid);

                                let add = true;

                                if (filledRecord == null) {
                                    record = addResultRecord({
                                        branchId: self.branchId(),
                                        rec: record,
                                        reload: self.reloadRecord
                                        //productFilter: ko.computed(() => {
                                        //    return self.completeProductFilters().find(p => p.ProductFilterID == record.ProductFilterID)
                                        //}, self)
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

                                record.sales180DayBranch = dataResult.Sales_180Day_Branch;
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

                                record.priceSummary = dataResult.Price_Summary;

                                if (add) {
                                    affectedRecords.push(record);
                                }

                                affectedRecords.push(record);
                            }
                            else {
                                forcedRemovals.push(pid);
                            }
                        });

                        ko.ignoreDependencies(() => {
                            affectedRecords.forEach(ar => {
                                self.addRecordsToDataFetch.remove(rtdf => rtdf.ProductID === ar.ProductID);
                            });

                            forcedRemovals.forEach(fr => {
                                self.addRecordsToDataFetch.remove(rtdf => rtdf.ProductID == fr);
                            })

                            ko.utils.arrayPushAll(self.addFilledRecords, affectedRecords);
                        });

                        //self.fetchAddDataBusy(false);

                        //self.addGridSettings.widget().refresh();

                        //document.querySelector("#add-results-grid .k-grid-content.k-auto-scrollable").scrollTo(0, self.addGridScrollRestoration);

                        //if (uarpids.length > 1) {
                        //    self.clearBusy();
                        //}
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

            // counts the number of *end* product rows we have rendered
            let runningCount = 0;

            // grouping initially by ProductFilterName. All search results must have a Product Filter Name, no exceptions.
            let productFilterGrouping = Object.groupBy(self.searchResults(), (sr) => sr.ProductFilterName);

            // the height of the table's thead element
            let startingOffset = self.gridHeaderHeight;

            // we can only really do this if we're working with *exact* known heights.
            // otherwise all bets are off.
            // therefore let us achieve the knowing of the heights.
            let additionalOffset = startingOffset;

            let runningProductFilterGroupHeight = 0;

            let runningProductPageGroupHeight = 0;

            let runningOrderFormGroupHeight = 0;

            let filledRecords = self.filledRecords.peek();

            // Object.groupBy returns an object having properties for each group key whose values are the group's items.
            Object.keys(productFilterGrouping).forEach((k, ki) => {

                // Therefore we iterate over the keys of that object and create an entry into an array...
                let r = {
                    name: k,
                    items: ko.observableArray(productFilterGrouping[k]),
                    height: 0,
                    offsetY: 0,
                    runningHeight: runningProductFilterGroupHeight, // setting initial properties to zero, hooray for declaration
                    plannedCount: ko.computed(() => {
                        return self.productFilterTotals().find(pft => pft.ProductFilterName === k)?.PlannedCount;
                    }, self),
                    plannedValue: ko.computed(() => {
                        return self.productFilterTotals().find(pft => pft.ProductFilterName === k)?.PlannedValue;
                    }, self),
                    actualCount: ko.computed(() => {
                        return self.productFilterTotals().find(pft => pft.ProductFilterName === k)?.ActualCount;
                    }, self),
                    actualValue: ko.computed(() => {
                        return self.productFilterTotals().find(pft => pft.ProductFilterName === k)?.ActualValue;
                    }, self),
                    inProgressCount: ko.computed(() => {
                        return self.productFilterTotals().find(pft => pft.ProductFilterName === k)?.InProgressCount;
                    }, self),
                    inProgressValue: ko.computed(() => {
                        return self.productFilterTotals().find(pft => pft.ProductFilterName === k)?.InProgressValue;
                    }, self)
                };

                // add the array entry
                results.push(r);
            });

            // then we can iterate over the array as usual - always useful to have the index around in case you need it
            results.forEach((productFilterGroup, productFilterGroupIndex) => {

                // every record has at least a bit of offset: this accumulates across the data set.
                // every product filter contributes a fixed height of offset (30px), which must be considered in addition to the main header rows on the grid (73px).
                additionalOffset += self.productFilterGroupRowHeight;

                let productPages = [];

                // continue the grouping dance at the product page level - grouping by null is not okay, so if you have to group by an empty string:
                let productPageGrouping = Object.groupBy(productFilterGroup.items(), (i) => i.ProductPageName || "");

                Object.keys(productPageGrouping).forEach(k => {
                    let r = {
                        name: k,
                        items: ko.observableArray(productPageGrouping[k]),
                        height: 0,
                        offsetY: 0,
                        runningHeight: runningProductPageGroupHeight
                    };

                    productPages.push(r);
                });

                productPages.forEach((productPageGroup, productPageGroupIndex) => {

                    // if this productPageGroup has a name, it will have rendered a heading (22px) and we need to account for the height of that heading.
                    if (productPageGroup.name != "") {
                        additionalOffset += self.productPageGroupRowHeight;
                    }

                    let orderFormGroups = [];

                    // continue grouping to the order form group level:
                    let orderFormGrouping = Object.groupBy(productPageGroup.items(), (i) => i.OrderFormGroup || "");

                    Object.keys(orderFormGrouping).forEach(k => {

                        let r = {
                            name: k,
                            items: ko.observableArray(orderFormGrouping[k]),
                            height: 0,
                            offsetY: 0,
                            runningHeight: runningOrderFormGroupHeight
                        }

                        orderFormGroups.push(r);
                    });

                    orderFormGroups.forEach((orderFormGroup, orderFormGroupIndex) => {

                        // if this orderFormGroup has a name, it will have rendered a heading (20px) and we need to account for the height of that heading.
                        if (orderFormGroup.name != "") {
                            additionalOffset += self.orderFormGroupRowHeight;
                        }

                        let products = ko.unwrap(orderFormGroup.items);

                        //iterate over the products belonging to this order form group
                        products.forEach((product, productIndex) => {

                            // each product record has one fundamental height: 80px.
                            product.height = self.rowHeight;

                            // each product is offset from the top by some Y 
                            product.offsetY = (((runningCount + (productIndex)) * self.rowHeight) + additionalOffset);
                        })

                        runningCount += products.length;

                        orderFormGroup.visibleItems = ko.computed(() => {

                            let toFetch = [];
                                
                            let results = ko.unwrap(orderFormGroup.items).filter(i => {
                                let actuallyVisible = ((i.offsetY - self.gridHeaderHeight + self.rowHeight) >= (self.scrollY())) &&
                                    ((i.offsetY - self.gridHeaderHeight + self.rowHeight) <= (self.maxY()));

                                let dataFetchVisible = actuallyVisible;// ((i.offsetY - self.gridHeaderHeight + self.rowHeight) >= (self.scrollY() - 5000)) &&
                                    // ((i.offsetY - self.gridHeaderHeight + self.rowHeight) <= (self.maxY() + 5000));

                                if (dataFetchVisible && !filledRecords.find(fr => fr.ProductID === i.ProductID))
                                    toFetch.push(i);

                                return actuallyVisible;
                            });

                            ko.utils.arrayPushAll(self.recordsToDataFetch, toFetch);

                            return results;
                        });
                    });

                    productPageGroup.items = orderFormGroups;
                });

                productFilterGroup.items = productPages;
            });

            let cumulativeHeight = startingOffset;

            let itemCount = 0;

            results.forEach((productFilterGroup, pfgi) => {
                // productFilterGroup.name is never null, always add the productFilterGroupRowHeight

                productFilterGroup.items.forEach((productPageGroup, ppgi) => {

                    // productPageGroup.name can be null, test before adding productPageGroupRowHeight

                    productPageGroup.items.forEach((orderFormGroup, ofgi) => {

                        // orderFormGroup.name can be null, test before adding orderFormGroupRowHeight

                        let items = ko.unwrap(orderFormGroup.items);

                        // this orderFormGroup's height is equal to the number of items it contains by the height of each item, possibly plus its own grouping row height.
                        orderFormGroup.height = ((items.length * self.rowHeight) + (orderFormGroup.name == "" ? 0 : self.orderFormGroupRowHeight));

                        runningOrderFormGroupHeight += orderFormGroup.height;

                        orderFormGroup.runningHeight = runningOrderFormGroupHeight;

                        cumulativeHeight += orderFormGroup.height;

                        orderFormGroup.offsetY = (cumulativeHeight - orderFormGroup.height) + ((pfgi + 1) * self.productFilterGroupRowHeight) + ((ppgi + 1) * self.productPageGroupRowHeight);

                        orderFormGroup.headerVisible = ko.computed(() => {
                            if (orderFormGroup.name && orderFormGroup.offsetY + self.orderFormGroupRowHeight >= self.scrollY() + self.gridHeaderHeight) {
                                return true;
                            }

                            return false;
                        }, self);
                    });

                    // this productPageGroup's height is equal to the sum of its orderFormGroup heights, possibly plus its own grouping row height.
                    productPageGroup.height = (ko.unwrap(productPageGroup.items).reduce((a, i) => a += i.height, 0) + (productPageGroup.name == "" ? 0 : self.productPageGroupRowHeight));

                    runningProductPageGroupHeight += productPageGroup.height;

                    productPageGroup.runningHeight = runningProductPageGroupHeight;

                    productPageGroup.offsetY = (cumulativeHeight - productPageGroup.height) + ((pfgi + 1) * self.productFilterGroupRowHeight) + ((ppgi + 1) * self.productPageGroupRowHeight);

                    productPageGroup.headerVisible = ko.computed(() => {
                        if (productPageGroup.name && productPageGroup.offsetY + self.productPageGroupRowHeight >= self.scrollY() + self.gridHeaderHeight) {
                            return true;
                        }
                        return false;
                    }, self);
                });

                // because the height of productPageGroup headings is not catered for in the above...
                cumulativeHeight += productFilterGroup.items.reduce((a, i) => a += i.name === "" ? 0 : self.productPageGroupRowHeight, 0);

                // this productFilterGroup's height is equal to the sum of its productPageGroup heights, plus its own grouping row height.
                productFilterGroup.height = (ko.unwrap(productFilterGroup.items).reduce((a, i) => a += i.height, 0) + self.productFilterGroupRowHeight);

                runningProductFilterGroupHeight += productFilterGroup.height;

                productFilterGroup.runningHeight = runningProductFilterGroupHeight;

                productFilterGroup.offsetY = productFilterGroup.runningHeight - productFilterGroup.height + self.gridHeaderHeight;

                productFilterGroup.headerVisible = ko.computed(() => {
                    if (productFilterGroup.offsetY + self.productFilterGroupRowHeight >= self.scrollY() + self.gridHeaderHeight) {
                        return true;
                    }
                    return false;
                }, self);
            });

            self.gridTotalHeight(cumulativeHeight - self.rowHeight - 1);
            //self.gridTotalHeight((runningCount * self.rowHeight) - 170);

            window.setTimeout(() => {
                document.querySelectorAll(".final-row").forEach(tr => {
                    if (tr)
                        self.intersectionObserver.observe(tr);
                })
            }, 0);

            //console.log(results);

            return results;
        } else {
            self.gridTotalHeight(0);

            return [];
        }

    }, self);

    self.gridScrollTopPadding = ko.computed(() => {
        let scrollY = self.scrollY();
        let scrollYPlusHeaderHeight = scrollY + self.gridHeaderHeight;
        let my = self.maxY();

        let result = 0;

        ko.ignoreDependencies(() => {

            let searchResults = self.groupedSearchResults();

            if (searchResults.length) {

                // you are fully scrolled out of view as soon as scrollY is greater than your height.
                // gasr.height includes self.productFilterGroupRowHeight
                let filterGroupsEntirelyAbove = searchResults.filter(productFilterGroup => {
                    return scrollY > productFilterGroup.runningHeight
                });

                // we consider you partially above when your product filter group row goes out of pane
                // can more than one productFilterGroup be partially above? no; the next becomes partially above, this becomes fully above.

                let filterGroupPartiallyAbove = searchResults.find(productFilterGroup => {
                    return ((productFilterGroup.offsetY) <= scrollYPlusHeaderHeight &&
                        (scrollY <= productFilterGroup.runningHeight))
                });

                // you must not be able to be both partially and entirely above: one or the other.

                if (filterGroupsEntirelyAbove.length) {

                    let productPageGroupsHeight = filterGroupsEntirelyAbove.flatMap(fgea => fgea.items).reduce((a, i) => a += i.height, 0);

                    //console.log("productPageGroupsHeight", productPageGroupsHeight);

                    result += productPageGroupsHeight;

                    let productPageGroupsHeaderRowsHeight = filterGroupsEntirelyAbove.length * self.productFilterGroupRowHeight

                    //console.log("productPageGroupsHeaderRowsHeight", productPageGroupsHeaderRowsHeight);

                    result += productPageGroupsHeaderRowsHeight; // every filterGroup provides a row

                    // not every productPageGroup provides a row and they're all accounted for elsewhere in the algorithm so remove their height here
                    //result -= filterGroupsEntirelyAbove.flatMap(fgea => fgea.items).reduce((a, i) => a += i.name == "" ? 0 : self.productPageGroupRowHeight, 0);
                }

                //console.log("filterGroupsEntirelyAbove", filterGroupsEntirelyAbove);

                if (filterGroupPartiallyAbove) {

                    let additionFromPartiallyAboveGroup = 0;

                    filterGroupPartiallyAbove.items.forEach(ppg => {
                        if (ppg.name && !ppg.headerVisible()) {
                            additionFromPartiallyAboveGroup += self.productPageGroupRowHeight;
                        }

                        ppg.items.forEach(ofg => {
                            if (ofg.name && !ofg.headerVisible()) {
                                additionFromPartiallyAboveGroup += self.orderFormGroupRowHeight;
                            }

                            ko.unwrap(ofg.items).forEach(p => {
                                if (scrollYPlusHeaderHeight > p.offsetY + self.rowHeight) {
                                    additionFromPartiallyAboveGroup += p.height;
                                }
                            })
                        })
                    })

                    if ((scrollYPlusHeaderHeight - filterGroupPartiallyAbove.offsetY) > self.productFilterGroupRowHeight)
                        additionFromPartiallyAboveGroup += self.productFilterGroupRowHeight;

                    //console.log("additionFromPartiallyAboveGroup", additionFromPartiallyAboveGroup);

                    result += additionFromPartiallyAboveGroup;
                }

                //console.log("filterGroupPartiallyAbove", filterGroupPartiallyAbove);
            }
        }); 

        //console.log("virtualSpacing top", result);

        //console.log(" ");

        //self.addGridScrollBottomPadding(self.addGridTotalHeight() - result - self.rowHeight);

    
        //self.gridScrollBottomPadding(self.gridTotalHeight() - result);

        return result;
    }, self);

    self.gridScrollBottomPadding = ko.computed(() => {
        if (self.finalRowVisible()) {
            return 0;
        } else {
            return self.gridTotalHeight() - self.gridScrollTopPadding() - self.gridHeaderHeight - self.gridPositionTop;
        }
    }, self);

    self.addGroupedSearchResults = ko.computed(() => {

        let key = "ProductFilterName";

        if (self.addSearchResults().length) {
            let results = [];

            // counts the number of *end* product rows we have rendered
            let runningCount = 0;

            // grouping initially by ProductFilterName. All search results must have a Product Filter Name, no exceptions.
            let productFilterGrouping = Object.groupBy(self.addSearchResults(), (sr) => sr.ProductFilterName);

            // the height of the table's thead element
            let startingOffset = self.addGridHeaderHeight; 

            // we can only really do this if we're working with *exact* known heights.
            // otherwise all bets are off.
            // therefore let us achieve the knowing of the heights.
            let additionalOffset = startingOffset;

            let runningProductFilterGroupHeight = 0;

            let runningProductPageGroupHeight = 0;

            let runningOrderFormGroupHeight = 0;

            let addFilledRecords = self.addFilledRecords.peek();

            // Object.groupBy returns an object having properties for each group key whose values are the group's items.
            Object.keys(productFilterGrouping).forEach((k, ki) => {

                // Therefore we iterate over the keys of that object and create an entry into an array...
                let r = {
                    name: k,
                    items: ko.observableArray(productFilterGrouping[k]),
                    height: 0,
                    offsetY: 0,
                    runningHeight: runningProductFilterGroupHeight // setting initial properties to zero, hooray for declaration
                };

                // add the array entry
                results.push(r);
            });

            // then we can iterate over the array as usual - always useful to have the index around in case you need it
            results.forEach((productFilterGroup, productFilterGroupIndex) => {

                // every record has at least a bit of offset: this accumulates across the data set.
                // every product filter contributes a fixed height of offset (30px), which must be considered in addition to the main header rows on the grid (73px).
                additionalOffset += self.productFilterGroupRowHeight;

                let productPages = [];

                // continue the grouping dance at the product page level - grouping by null is not okay, so if you have to group by an empty string:
                let productPageGrouping = Object.groupBy(productFilterGroup.items(), (i) => i.ProductPageName || "");

                Object.keys(productPageGrouping).forEach(k => {
                    let r = {
                        name: k,
                        items: ko.observableArray(productPageGrouping[k]),
                        height: 0,
                        offsetY: 0,
                        runningHeight: runningProductPageGroupHeight
                    };

                    productPages.push(r);
                });

                productPages.forEach((productPageGroup, productPageGroupIndex) => {

                    // if this productPageGroup has a name, it will have rendered a heading (22px) and we need to account for the height of that heading.
                    if (productPageGroup.name != "") {
                        additionalOffset += self.productPageGroupRowHeight;
                    }

                    let orderFormGroups = [];

                    // continue grouping to the order form group level:
                    let orderFormGrouping = Object.groupBy(productPageGroup.items(), (i) => i.OrderFormGroup || "");

                    Object.keys(orderFormGrouping).forEach(k => {

                        let r = {
                            name: k,
                            items: ko.observableArray(orderFormGrouping[k]),
                            height: 0,
                            offsetY: 0,
                            runningHeight: runningOrderFormGroupHeight
                        }

                        orderFormGroups.push(r);
                    });

                    orderFormGroups.forEach((orderFormGroup, orderFormGroupIndex) => {

                        // if this orderFormGroup has a name, it will have rendered a heading (20px) and we need to account for the height of that heading.
                        if (orderFormGroup.name != "") {
                            additionalOffset += self.orderFormGroupRowHeight;
                        }

                        let products = ko.unwrap(orderFormGroup.items);

                        //iterate over the products belonging to this order form group
                        products.forEach((product, productIndex) => {

                            // each product record has one fundamental height: 80px.
                            product.height = self.rowHeight;

                            // each product is offset from the top by some Y 
                            product.offsetY = (((runningCount + (productIndex)) * self.rowHeight) + additionalOffset);
                        })

                        runningCount += products.length;

                        let toFetch = [];

                        orderFormGroup.visibleItems = ko.computed(() => {

                            let toFetch = [];

                            let results = ko.unwrap(orderFormGroup.items).filter(i => {
                                let actuallyVisible = ((i.offsetY - self.addGridHeaderHeight + self.rowHeight) >= (self.scrollY())) &&
                                    ((i.offsetY - self.addGridHeaderHeight + self.rowHeight) <= (self.maxY()));

                                let dataFetchVisible = actuallyVisible;// ((i.offsetY - self.gridHeaderHeight + self.rowHeight) >= (self.scrollY() - 5000)) &&
                                // ((i.offsetY - self.gridHeaderHeight + self.rowHeight) <= (self.maxY() + 5000));

                                if (dataFetchVisible && !addFilledRecords.find(fr => fr.ProductID === i.ProductID))
                                    toFetch.push(i);

                                return actuallyVisible;
                            });

                            ko.utils.arrayPushAll(self.addRecordsToDataFetch, toFetch);

                            return results;
                        });
                    });

                    productPageGroup.items = orderFormGroups;
                });

                productFilterGroup.items = productPages;
            });

            let cumulativeHeight = startingOffset;

            let itemCount = 0;

            results.forEach((productFilterGroup, pfgi) => {
                // productFilterGroup.name is never null, always add the productFilterGroupRowHeight

                productFilterGroup.items.forEach((productPageGroup, ppgi) => {

                    // productPageGroup.name can be null, test before adding productPageGroupRowHeight

                    productPageGroup.items.forEach((orderFormGroup, ofgi) => {

                        // orderFormGroup.name can be null, test before adding orderFormGroupRowHeight

                        let items = ko.unwrap(orderFormGroup.items);

                        // this orderFormGroup's height is equal to the number of items it contains by the height of each item, possibly plus its own grouping row height.
                        orderFormGroup.height = ((items.length * self.rowHeight) + (orderFormGroup.name == "" ? 0 : self.orderFormGroupRowHeight));

                        runningOrderFormGroupHeight += orderFormGroup.height;

                        orderFormGroup.runningHeight = runningOrderFormGroupHeight;

                        cumulativeHeight += orderFormGroup.height;

                        orderFormGroup.offsetY = (cumulativeHeight - orderFormGroup.height) + ((pfgi + 1) * self.productFilterGroupRowHeight) + ((ppgi + 1) * self.productPageGroupRowHeight);

                        orderFormGroup.headerVisible = ko.computed(() => {
                            if (orderFormGroup.name && orderFormGroup.offsetY + self.orderFormGroupRowHeight >= self.scrollY() + self.addGridHeaderHeight) {
                                return true;
                            }

                            return false;
                        }, self);
                    });

                    // this productPageGroup's height is equal to the sum of its orderFormGroup heights, possibly plus its own grouping row height.
                    productPageGroup.height = (ko.unwrap(productPageGroup.items).reduce((a, i) => a += i.height, 0) + (productPageGroup.name == "" ? 0 : self.productPageGroupRowHeight));

                    runningProductPageGroupHeight += productPageGroup.height;

                    productPageGroup.runningHeight = runningProductPageGroupHeight;

                    productPageGroup.offsetY = (cumulativeHeight - productPageGroup.height) + ((pfgi + 1) * self.productFilterGroupRowHeight) + ((ppgi + 1) * self.productPageGroupRowHeight);

                    productPageGroup.headerVisible = ko.computed(() => {
                        if (productPageGroup.name && productPageGroup.offsetY + self.productPageGroupRowHeight >= self.scrollY() + self.addGridHeaderHeight) {
                            return true;
                        }
                        return false;
                    }, self);
                });

                // because the height of productPageGroup headings is not catered for in the above...
                cumulativeHeight += productFilterGroup.items.reduce((a, i) => a += i.name === "" ? 0 : self.productPageGroupRowHeight, 0);

                // this productFilterGroup's height is equal to the sum of its productPageGroup heights, plus its own grouping row height.
                productFilterGroup.height = (ko.unwrap(productFilterGroup.items).reduce((a, i) => a += i.height, 0) + self.productFilterGroupRowHeight);

                runningProductFilterGroupHeight += productFilterGroup.height;

                productFilterGroup.runningHeight = runningProductFilterGroupHeight;

                productFilterGroup.offsetY = productFilterGroup.runningHeight - productFilterGroup.height + self.addGridHeaderHeight;

                productFilterGroup.headerVisible = ko.computed(() => {
                    if (productFilterGroup.offsetY + self.productFilterGroupRowHeight >= self.scrollY() + self.addGridHeaderHeight) {
                        return true;
                    }
                    return false;
                }, self);
            });

            self.addGridTotalHeight(cumulativeHeight - self.rowHeight - 1);

            window.setTimeout(() => {
                document.querySelectorAll(".final-row").forEach(tr => {
                    if (tr)
                        self.intersectionObserver.observe(tr);
                })
            }, 0);

            //console.log(results);

            return results;
        } else {

            self.addGridTotalHeight(0);

            return [];
        }
    }, self);

    self.addGridScrollTopPadding = ko.computed(() => {
        let scrollY = self.scrollY();
        let scrollYPlusHeaderHeight = scrollY + self.addGridHeaderHeight;
        let my = self.maxY();

        let result = 0;

        ko.ignoreDependencies(() => {

            let searchResults = self.addGroupedSearchResults();

            if (searchResults.length) {

                // you are fully scrolled out of view as soon as scrollY is greater than your height.
                // gasr.height includes self.productFilterGroupRowHeight
                let filterGroupsEntirelyAbove = searchResults.filter(productFilterGroup => {
                    return scrollY > productFilterGroup.runningHeight
                });

                // we consider you partially above when your product filter group row goes out of pane
                // can more than one productFilterGroup be partially above? no; the next becomes partially above, this becomes fully above.

                let filterGroupPartiallyAbove = searchResults.find(productFilterGroup => {
                    return ((productFilterGroup.offsetY) <= scrollYPlusHeaderHeight &&
                        (scrollY <= productFilterGroup.runningHeight))
                });

                // you must not be able to be both partially and entirely above: one or the other.

                if (filterGroupsEntirelyAbove.length) {

                    let productPageGroupsHeight = filterGroupsEntirelyAbove.flatMap(fgea => fgea.items).reduce((a, i) => a += i.height, 0);

                    //console.log("productPageGroupsHeight", productPageGroupsHeight);

                    result += productPageGroupsHeight;

                    let productPageGroupsHeaderRowsHeight = filterGroupsEntirelyAbove.length * self.productFilterGroupRowHeight

                    //console.log("productPageGroupsHeaderRowsHeight", productPageGroupsHeaderRowsHeight);

                    result += productPageGroupsHeaderRowsHeight; // every filterGroup provides a row

                    // not every productPageGroup provides a row and they're all accounted for elsewhere in the algorithm so remove their height here
                    //result -= filterGroupsEntirelyAbove.flatMap(fgea => fgea.items).reduce((a, i) => a += i.name == "" ? 0 : self.productPageGroupRowHeight, 0);
                }

                //console.log("filterGroupsEntirelyAbove", filterGroupsEntirelyAbove);

                if (filterGroupPartiallyAbove) {

                    let additionFromPartiallyAboveGroup = 0;

                    filterGroupPartiallyAbove.items.forEach(ppg => {
                        if (ppg.name && !ppg.headerVisible()) {
                            additionFromPartiallyAboveGroup += self.productPageGroupRowHeight;
                        }

                        ppg.items.forEach(ofg => {
                            if (ofg.name && !ofg.headerVisible()) {
                                additionFromPartiallyAboveGroup += self.orderFormGroupRowHeight;
                            }

                            ko.unwrap(ofg.items).forEach(p => {
                                if (scrollYPlusHeaderHeight > p.offsetY + self.rowHeight) {
                                    additionFromPartiallyAboveGroup += p.height;
                                }
                            })
                        })
                    })

                    if ((scrollYPlusHeaderHeight - filterGroupPartiallyAbove.offsetY) > self.productFilterGroupRowHeight)
                        additionFromPartiallyAboveGroup += self.productFilterGroupRowHeight;

                    //console.log("additionFromPartiallyAboveGroup", additionFromPartiallyAboveGroup);

                    result += additionFromPartiallyAboveGroup;
                }

                //console.log("filterGroupPartiallyAbove", filterGroupPartiallyAbove);
            }
        });

        //console.log("virtualSpacing top", result);

        //console.log(" ");

        //self.addGridScrollBottomPadding(self.addGridTotalHeight() - result - self.rowHeight);

        return result;
    }, self);

    self.addGridScrollBottomPadding = ko.computed(() => {
        if (self.finalRowVisible()) {
            return 0;
        } else {
            return self.addGridTotalHeight() - self.addGridScrollTopPadding() - self.addGridHeaderHeight - self.addGridPositionTop;
        }
    });

    self.refreshProductFilterTotal = (productFilterId) => {
        if (productFilterId) {
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

    window.addEventListener("scroll", (event) => {
        if (self.finalRowVisible()) {
            if (window.scrollY < self.scrollY()) {
                self.scrollY(window.scrollY);
                self.maxY(self.scrollY() + window.innerHeight);
            }
        } else {
            self.scrollY(window.scrollY);
            self.maxY(self.scrollY() + window.innerHeight);
        }
    });

    window.addEventListener("resize", debounce((event) => {
        if (self.finalRowVisible()) {
            if (window.scrollY < self.scrollY()) {
                self.maxY(self.scrollY() + window.innerHeight);
            }
        } else {
            self.maxY(self.scrollY() + window.innerHeight);
        }
    }, 50));

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
    fetchBranchBasketsNonce,
    reload
    //productFilter,
    //productFilterRefreshFn
} = {
        branchId: null,
        rec: null,
        fetchBranchBasketsNonce: null,
        reload: () => { }
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

    self.reload = reload;

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
    self.actionTransferToBranchExtantTransferQuantity = ko.observable();
    self.actionTransferToWarehouseHighlight = null;
    self.actionTransferToWarehouseQuantityOriginal = ko.observable();
    self.actionTransferToWarehouseQuantity = ko.observable().extend(self.defaultNumericalExtension);
    self.actionTransferToWarehouseBasketItemId = ko.observable();
    self.actionTransferToWarehouseExtantTransferQuantity = ko.observable();

    self.rangeStatus = null;
    self.rangeActual = null;
    //self.rangeStartDate = null;
    //self.rangeEndDate = null;
    self.rangePlannedOriginal = ko.observable();
    self.rangePlanned = ko.observable().extend(self.defaultNumericalExtension);
    self.rangeRequired = null;
    self.rangeInProgress = null;

    self.sales180DayBranch = null;
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

    self.priceSummary = null;

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
            revertible: ko.observable(true),
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

                            self.reload(self);
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

    self.rangePlannedParams.revertible(false);

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
        if (self.actionTransferToBranchQuantity() != 0 && self.actionTransferToBranchBasketItemId() == null) {
            self.submitTransferWH2BR();
        }

        if (self.actionTransferToWarehouseQuantity() != 0 && self.actionTransferToWarehouseBasketItemId() == null) {
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
                viewModel.refreshProductFilterTotal(self.ProductFilterID);
                self.busy(true); // set whole row busy display...
                self.loaded(false); // force reload of this record
                self.reload(self);
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
                viewModel.refreshProductFilterTotal(self.ProductFilterID);
                self.busy(true); // set whole row busy display...
                self.loaded(false); // force reload of this record

                self.reload(self);
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
                viewModel.refreshProductFilterTotal(self.ProductFilterID);
                self.busy(true); // set whole row busy display...
                self.loaded(false); // force reload of this record

                self.reload(self);
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
                viewModel.refreshProductFilterTotal(self.ProductFilterID);
                self.busy(true); // set whole row busy display...
                self.loaded(false); // force reload of this record

                self.reload(self);
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

    // the submit button should only be visible when there's at least ONE action which CAN be performed
    // when submitting, we only want to submit that direction who is NON ZERO and who does NOT have an extant transfer (basketItemId)
    // if we have an extant transfer, show BasketItemQuantity for that direction 
    // Cancel Transfer of 2

    self.submitVisible = ko.computed(() => {
        return ((self.actionTransferToBranchQuantity() != 0 && self.actionTransferToBranchBasketItemId() == null) ||
            (self.actionTransferToWarehouseQuantity() != 0 && self.actionTransferToWarehouseBasketItemId() == null))
    }, self);

    return self;
}


const addResultRecord = function ({
    branchId,
    rec,
    reload
    //productFilter
} = {
        branchId: null,
        rec: null,
        reload: () => { }
        //productFilter: ko.computed(() => { })
    }) {
    //console.log(productFilter);

    let self = Object.assign({}, rec);

    self.element = ko.observable();

    self.branchId = branchId;

    self.reload = reload;

    self.busy = ko.observable(false);

    self.loaded = ko.observable(false);

    self.allowed = ko.observable(false);

    self.sales180DayBranch = null;
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

    self.priceSummary = null;

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

    self.actionRecommendations = ko.observable();

    self.actionAddToRangeHighlight = ko.observable();
    self.actionAddToRangeQuantity = ko.observable(0).extend(self.defaultNumericalExtension);
    self.actionAddToRangeQuantityOriginal = ko.observable(0);

    self.actionTransferToRangeBasketItemId = ko.observable();

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

    //    self.actionAddToRangeQuantity.extend(productFilterNumericalExtension);
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
            revertible: ko.observable(true),
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

                if ((v - self.incrementAmount) > min || diff === 0)
                    self.observable(diff);
            }
        }
    };

    self.actionAddToRangeQuantityParams = self.buildNumericParams(
        self.actionAddToRangeQuantity,
        self.actionAddToRangeQuantityOriginal,
        self.incrementAmount,
        self.scale,
        0,
        9999);

    self.actionAddToRangeQuantityParams.revertible(false);

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

                // the hell was this for?
                self.actionAddToRangeQuantityParams.busy(false); // ... ?
                window.setTimeout(() => {
                    self.actionAddToRangeQuantityParams.disable(true); // ... ?
                }, 0);

                self.reload(self);
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