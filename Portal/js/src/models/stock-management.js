const
    TAB_PRELAUNCH = 0,
    TAB_CURRENT = 1,
    TAB_LIMITED = 2,
    TAB_CLEARANCE = 3,
    TAB_DISCONTINUED = 4

const
    SORT_QUANTITY_ASC = 0,
    SORT_QUANTITY_DESC = 1,
    SORT_ORDERFORMGROUP_ASC = 2,
    SORT_ORDERFORMGROUP_DESC = 3

const
    SG_PRELAUNCH = -1,
    SG_CURRENT = 1,
    SG_LIMITED = 2,
    SG_CLEARANCE = 3,
    SG_DISCONTINUED = 4 

const stockManagementViewModel = ({ } = {}) => {
    let self = {};

    //#region Properties

    self.busy = ko.observable(false);

    self.statusGroupId = ko.observable(SG_CURRENT);

    self.prelaunchBusy = ko.observable(false);

    self.currentBusy = ko.observable(false);

    self.limitedBusy = ko.observable(false);

    self.clearanceBusy = ko.observable(false);

    self.discontinuedBusy = ko.observable(false);

    self.modalBusy = ko.observable(false);

    self.modalElement = document.getElementById('-modal');

    self.modal = bootstrap.Modal.getOrCreateInstance(self.modalElement);

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

    //self.branchId = ko.observable(3);
    //window.branchId = self.branchId; // lifted to global to save buggering about with $parentContext nesting

    //self.branch = ko.observable();
    //window.branch = self.branch; // lifted to global to save buggering about with $parentContext nesting

    self.launchId = ko.observable(''); // '' because dropdowns were borne of selects which demand a '' for empty selection and Kendo carries this torch

    self.launch = ko.observable();

    self.brandId = ko.observable(''); // if you don't initialise to '' you'll find that opening and immediately dismissing the associated dropdown

    self.brand = ko.observable();
    
    self.productColourId = ko.observable(''); // causes the underlying value to be switched to '', which fires the subscription which fires the search

    self.productColour = ko.observable();

    self.stockStatusId = ko.observable(''); // which probably isn't what you wanted to happen.

    self.stockStatus = ko.observable();

    self.collectionCode = ko.observable('');

    self.collection = ko.observable();

    self.attributeGroupId = ko.observable('');

    self.attributeGroup = ko.observable();

    self.attributeId = ko.observable('');

    self.attribute = ko.observable();

    self.attributeIds = ko.observableArray([]);

    self.emptyArray = [];

    self.attributes = ko.observableArray(self.emptyArray);

    self.productFilterGroup = ko.observable();

    self.productFilterGroupId = ko.observable('');

    self.productFilters = ko.observableArray([]);

    self.productFilter = ko.observable();

    self.productFilterId = ko.observable('');

    self.buyer = ko.observable();

    self.buyerCode = ko.observable('');

    self.supplier = ko.observable();

    self.supplierCode = ko.observable('');

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

    self.displayWarehouseStockParams = {
        label: "Display Warehouse Stock?",
        checkboxId: "display-warehouse-stock",
        observable: self.displayWarehouseStock,
        originalValue: false,
        useNativeValidation: false,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false)
    }

    self.displayRingFencedStockParams = {
        label: "Display Ring Fenced Stock?",
        checkboxId: "display-ring-fenced-stock",
        observable: self.displayRingFencedStock,
        originalValue: false,
        useNativeValidation: false,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false)
    }

    self.displaySalesParams = {
        label: "Display Sales?",
        checkboxId: "display-sales",
        observable: self.displaySales,
        originalValue: false,
        useNativeValidation: false,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false)
    }

    self.buyerParams = kendoMDCDropDownList({
        label: 'Buyer',
        odata: true,
        endPoint: '/odata/Buyers',
        textField: 'Name',
        valueField: 'BuyerCode',
        idObservable: self.buyerCode,
        objObservable: self.buyer,
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
            field: 'buyerCode'
        },
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear
    });

    self.supplierParams = kendoMDCDropDownList({
        autoBind: true,
        label: 'Supplier',
        odata: true,
        endPoint: '/odata/Suppliers',
        textField: 'Name',
        valueField: 'SupplierCode',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/Suppliers/Default.SupplierValueMapper(supplierCode="${options.value}")`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                            if (data.value.length == 1) {
                                self.supplier(data.value[0]);
                            }
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        idObservable: self.supplierCode,
        objObservable: self.supplier,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertable: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        height: 340,
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear,
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            /// thanks, https://stackoverflow.com/questions/28995757/a-binary-operator-with-incompatible-types-was-detected-found-operand-types-edm/48919770
            delete d.$inlinecount; // <-- remove inlinecount
            //delete d.$format; // <-- remove format
            //delete d.$callback; // <-- remove callback

            d.$count = true;

            if (data.filter &&
                data.filter.filters.length &&
                data.filter.filters[0].value != '') {

                let filterValue = data.filter.filters[0].value;

                d.$filter = `StartsWith(ToLower(Name), '${filterValue}') OR StartsWith(ToLower(SupplierCode), '${filterValue}')`;
            }

            return d;
        }
    });

    self.productTypeParams = kendoMDCDropDownList({
        label: 'Product Type',
        odata: true,
        endPoint: '/odata/Mertex_ProductTypes?$expand=ProductType,ItemType,ProductGroup',
        textField: 'Label',
        valueField: 'PseudoKey',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    let splitKey = options.value.split(';');
                    let pgid = splitKey[0];
                    let itid = splitKey[1];
                    $.ajax({
                        url: `/odata/Mertex_ProductTypes/Default.Mertex_ProductTypeValueMapper(productGroupId=${pgid || "null"}, itemTypeId=${itid || "null"})?$expand=ProductType,ItemType,ProductGroup`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                            if (data.value.length == 1) {
                                self.productType(data.value[0]);
                            }
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        idObservable: self.productTypeKey,
        objObservable: self.productType,
        filter: 'contains',
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertable: ko.observable(false),
        select: 'single',
        readOnly: false,
        autoBind: true,
        height: 340,
        sort: [{
            dir: 'asc',
            field: 'productGroupCode'
        }, {
            dir: 'asc',
            field: 'itemTypeCode'
        }],
        parameterMap: (data) => {
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback
            delete d.$top;

            d.$count = true;

            if (data.filter &&
                data.filter.filters.length &&
                data.filter.filters[0].value != '') {

                let filterValue = data.filter.filters[0].value;

                d.$filter = `StartsWith(ToLower(ProductType/Name), '${filterValue}') OR StartsWith(ToLower(ProductGroup/Name), '${filterValue}') OR ToLower(ProductGroup/Code) EQ '${filterValue}' OR StartsWith(ToLower(ItemType/Name), '${filterValue}') OR ToLower(ItemType/Code) EQ '${filterValue}'`;
            }

            return d;
        },
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear
    });

    self.gridSettings = {
        autoBind: true,
        widget: ko.observable(),
        //useKOTemplates: true,
        //rowTemplate: "detail-row-template",
        columns: [{
            field: "ProductID",
            title: "Product ID"
        }],
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
                        statusGroupId: self.statusGroupId(),
                        launchId: self.launchId(),
                        brandId: self.brandId(),
                        productColourId: self.productColourId(),
                        stockLevelId: self.stockStatusId(),
                        productFilterGroupId: self.productFilterGroupId(),
                        productFilterId: self.productFilterId()
                    });

                    if (self.buyerCode()) {
                        data.buyerCode = self.buyerCode();
                    }

                    if (self.supplierCode()) {
                        data.supplierCode = self.supplierCode();
                    }

                    if (self.collectionCode()) {
                        data.collectionCode = self.collectionCode();
                    }

                    if (self.attributeIds().length) {
                        data.attributeIds = self.attributeIds();
                    }

                    let qs = new URLSearchParams(data);

                    console.log(qs);

                    fetch(`/api/stockManagement/fetchProducts?${qs.toString()}`, {
                        method: 'GET',
                        headers: window.fetchHeaders
                    })
                        .then(window.handleFetchResponse)
                        .then(data => {
                            self.previousParameters = params;
                            console.log(data);
                            //self.productSearchResults(data.Results.map(r => resultRecord(
                            //    r,
                            //    data.BranchGroupTotals,
                            //    self.branchId() ? data.RangeRecords : [],
                            //    data.ContrastRecords
                            ////)));
                            //self.productSearchResults(data.Results.map(r => resultRecord(
                            //    r
                            //)));

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
            pageSize: 200,
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            schema: $.extend({}, kendo.data.schemas.webapi, {
                data: "Data",
                total: "Total",
                ////errors: "Errors",
                ////aggregates: "Aggregates",
                model: {
                    id: 'ProductID'
                }
            })
        }),
        sortable: true,
        filterable: {
            extra: false
        },
        reorderable: true,
        pageable: {
            pageSize: 200,
            pageSizes: [10, 20, 50, 100, 200]
        },
        excelExport: self.exportToExcel
    };
    //self.branchGroupParams = kendoMDCDropDownList({
    //    label: 'Branch Group',
    //    odata: true,
    //    endPoint: '/odata/BranchGroups?$filter=PrimaryGroup eq true',
    //    textField: 'Name',
    //    valueField: 'BranchGroupID',
    //    virtual: true,
    //    pageSize: 40,
    //    virtualOptions: {
    //        itemHeight: 34,
    //        mapValueTo: 'dataItem',
    //        valueMapper: function (options) {
    //          if (options.value) {
    //            $.ajax({
    //                url: `/odata/BranchGroups/Default.BranchGroupValueMapper(branchGroupId=${options.value})`,
    //                type: 'GET',
    //                success: function (data) {
    //                    options.success(data.value);
    //                    if (data.value.length == 1) {
    //                        self.branchGroup(data.value[0]);
    //                    }
    //                }
    //            });
    //          } else {
        //    options.success();
        //}
    //        }
    //    },
    //    idObservable: self.branchGroupId,
    //    objObservable: self.branchGroup,
    //    enable: ko.observable(true),
    //    disable: ko.observable(false),
    //    clearable: ko.observable(true),
    //    revertable: ko.observable(false),
    //    readOnly: false,
    //    filter: 'contains',
    //    autoBind: true,
    //    height: 340,
    //    sort: {
    //        dir: 'asc',
    //        field: 'branchGroupId'
    //    },
    //    select: self.genericUnsavedChangesSelect,
    //    clearFunction: self.genericUnsavedChangesClear
    //});

    //self.branchParams = kendoMDCDropDownList({
    //    label: 'Branch',
    //    odata: true,
    //    endPoint: '/odata/Branches',
    //    textField: 'Name',
    //    valueField: 'BranchID',
    //    virtual: true,
    //    pageSize: 40,
    //    virtualOptions: {
    //        itemHeight: 34,
    //        mapValueTo: 'dataItem',
    //        valueMapper: function (options) {
    //          if (options.value) {
    //            $.ajax({
    //                url: `/odata/Branches/Default.BranchValueMapper(branchId=${options.value})`,
    //                type: 'GET',
    //                success: function (data) {
    //                    options.success(data.value);
    //                    if (data.value.length == 1) {
    //                        self.branch(data.value[0]);
    //                    }
    //                }
    //            });
    //          } else {
//    options.success();
//}
    //        }
    //    },
    //    idObservable: self.branchId,
    //    objObservable: self.branch,
    //    enable: ko.observable(true),
    //    disable: ko.observable(false),
    //    clearable: ko.observable(true),
    //    revertable: ko.observable(false),
    //    readOnly: false,
    //    filter: 'contains',
    //    autoBind: true,
    //    height: 340,
    //    sort: {
    //        dir: 'asc',
    //        field: 'branchId'
    //    },
    //    parameterMap: (data) => {
    //        //Generate parameters in odata v4 format
    //        let d = kendo.data.transports['odata-v4'].parameterMap(data);

    //        /// thanks, https://stackoverflow.com/questions/28995757/a-binary-operator-with-incompatible-types-was-detected-found-operand-types-edm/48919770
    //        delete d.$inlinecount; // <-- remove inlinecount
    //        delete d.$format; // <-- remove format
    //        delete d.$callback; // <-- remove callback
    //        delete d.$top;

    //        d.$count = true;

    //        if (self.branchGroupId()) {
    //            //Add filter by matching any reference containing value
    //            d.$filter = `BranchGroups/any(BranchGroup: BranchGroup/BranchGroupID eq ${self.branchGroupId()})`;
    //        }

    //        return d;
    //    },
    //    select: self.genericUnsavedChangesSelect,
    //    clearFunction: self.genericUnsavedChangesClear
    //});

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

    self.productColourParams = kendoMDCDropDownList({
        label: 'Colour',
        odata: true,
        endPoint: '/odata/ProductColours',
        textField: 'Name',
        valueField: 'ProductColourID',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/ProductColours/Default.ProductColourValueMapper(name="${options.value}")`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                            if (data.value.length == 1) {
                                self.productColour(data.value[0]);
                            }
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        idObservable: self.productColourId,
        objObservable: self.productColour,
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

    self.stockLevelParams = kendoMDCDropDownList({
        label: 'Stock Status',
        odata: true,
        endPoint: '/odata/StockStatuses',
        textField: 'Name',
        valueField: 'StockStatusID',
        virtual: false,
        idObservable: self.stockStatusId,
        objObservable: self.stockStatus,
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
            field: 'StockStatusID'
        },
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear
    });

    self.collectionParams = kendoMDCDropDownList({
        label: 'Collection',
        odata: true,
        endPoint: '/odata/Collections',
        textField: 'Name',
        valueField: 'Code',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/Collections/Default.CollectionValueMapper(code="${options.value}")`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                            if (data.value.length == 1) {
                                self.collection(data.value[0]);
                            }
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        idObservable: self.collectionCode,
        objObservable: self.collection,
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

    self.attributeGroupParams = kendoMDCDropDownList({
        label: 'Attribute Group',
        odata: true,
        endPoint: '/odata/AttributeGroups',
        textField: 'Name',
        valueField: 'AttributeGroupID',
        virtual: false,
        idObservable: self.attributeGroupId,
        objObservable: self.attributeGroup,
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

    self.attributeParams = kendoMDCDropDownList({
        label: 'Attribute',
        odata: true,
        endPoint: '/odata/Attributes',
        textField: 'Name',
        valueField: 'AttributeID',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/Attributes/Default.AttributeValueMapper(attributeId=${options.value })`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                            if (data.value.length == 1) {
                                self.attribute(data.value[0]);
                            }
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        idObservable: self.attributeId,
        objObservable: self.attribute,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertable: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback
            delete d.$top;

            d.$count = true;

            if (self.attributeGroupId()) {
                //Add filter by matching any reference containing value
                d.$filter = `AttributeGroupID eq ${self.attributeGroupId()}`;
            }

            return d;
        },
        sort: {
            dir: 'asc',
            field: 'SortOrder'
        },
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear
    });

    self.attributesParams = {
        observable: self.attributes,
        validate: self.attributeIds,
        emptyArray: self.emptyArray,
        width: 'auto',
        label: 'Attributes',
        valuePrimitive: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        controlClass: 'form-control',
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertable: ko.observable(false),
        multiSelectSettings: {
            value: self.attributeIds,
            dataItems: self.attributes,
            dataValueField: 'AttributeID',
            dataTextField: 'Name',
            height: 300,
            widget: ko.observable(),
            open: function (e) {
                var self = this;
                $(e.sender._widgetOptions.dataItems.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            close: function (e) {
                $(e.sender._widgetOptions.dataItems.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            data: self.attributeParams.dropDownListSettings.data,
            valuePrimitive: true,
            autoWidth: false,
            autoBind: true,
            autoClose: false,
            optionLabel: ' ',
            filter: 'startswith',
            select: self.genericUnsavedChangesMultiSelect,
            deselect: self.genericUnsavedChangesMultiDeselect
        },
        clearFunction: async function () {
            await self.unsavedChanges().then(() => {
                var self = this;

                let previousValue = self.multiSelectSettings.value();

                if (previousValue.length > 0) {
                    self.multiSelectSettings.value(self.emptyArray);
                    self.multiSelectSettings.widget().value(self.emptyArray);
                    self.multiSelectSettings.widget().trigger('change');
                }
            }).catch((e) => { });

        }
    };

    self.productFilterGroupParams = kendoMDCDropDownList({
        label: 'Filter Group',
        odata: true,
        endPoint: '/odata/ProductFilterGroups',
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
        clearFunction: self.genericUnsavedChangesClear,
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback
            delete d.$top;

            d.$count = true;

            //if (self.productTypeId()) {
            //    if (d.$filter) {
            //        d.$filter = `${d.$filter} and ProductTypeIDs contains ${self.productTypeId()}`;
            //    } else {
            //        d.$filter = `ProductTypeIDs contains ${self.productTypeId()}`;
            //    }
            //}

            return d;
        },
    });

    self.productFilterParams = kendoMDCDropDownList({
        label: 'Filter',
        odata: true,
        endPoint: '/odata/ProductFilters',
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
        clearFunction: self.genericUnsavedChangesClear,
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback
            delete d.$top;

            d.$count = true;

            if (self.productFilterGroupId()) {
                //Add filter by matching any reference containing value
                d.$filter = `ProductFilterGroupID eq ${self.productFilterGroupId()}`;
            }

            //if (self.productTypeId()) {
            //    if (d.$filter) {
            //        d.$filter = `${d.$filter} and ProductTypeID eq ${self.productTypeId()}`;
            //    } else {
            //        d.$filter = `ProductTypeID eq ${self.productTypeId()}`;
            //    }
            //}

            return d;
        },
    });

    //#endregion


    //#region Subscriptions

    //self.branchGroupId.subscribe(nv => {
    //    self.branchParams.clearFunction();
    //});

    self.attributeGroupId.subscribe(nv => {
        self.attributeParams.clearFunction();
        self.attributesParams.clearFunction();
    });

    //#endregion


    //#region Methods

    self.setBusy = () => {
        switch (self.statusGroupId()) {
            case TAB_PRELAUNCH:
                self.prelaunchBusy(true);
                break;
            case TAB_CURRENT:
                self.currentBusy(true);
                break;
            case TAB_LIMITED:
                self.limitedBusy(true);
                break;
            case TAB_CLEARANCE:
                self.clearanceBusy(true);
                break;
            case TAB_DISCONTINUED:
                self.discontinuedBusy(true);
                break;
            default:
                break;
        }
    }

    self.clearBusy = () => {
        switch (self.statusGroupId()) {
            case TAB_PRELAUNCH:
                self.prelaunchBusy(false);
                break;
            case TAB_CURRENT:
                self.currentBusy(false);
                break;
            case TAB_LIMITED:
                self.limitedBusy(false);
                break;
            case TAB_CLEARANCE:
                self.clearanceBusy(false);
                break;
            case TAB_DISCONTINUED:
                self.discontinuedBusy(false);
                break;
            default:
                break;
        }
    }

    self.closeModal = () => {
        self.modal.hide();
    }

    self.confirmModal = () => {
        window.showConfirm("Are you sure?", "Put the lime in the coconut?", () => {
            self.closeModal();
        }, () => {

        });
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

    //#endregion


    //#region Computeds

    //self.branchLoaded = ko.computed(() => {
    //    return self.branch() && self.productSearchResults().length && self.productSearchResults()[0].Range
    //}, self);
    //window.branchLoaded = self.branchLoaded; // lifted to global to save buggering about with $parentContext nesting

    //self.productTypeId = ko.computed(() => { return self.productType()?.ProductTypeID }, self);

    //self.productGroupCode = ko.computed(() => { return self.productType()?.ProductGroupCode }, self);

    //self.itemTypeCode = ko.computed(() => { return self.productType()?.ItemTypeCode }, self);

    self.secondaryFiltersVisible = ko.computed(() => {
        return true;
        //return self.productFilterGroupId() != null;
    }, self);

    //self.previousParameters = null;

    //self.parametersComputer = ko.computed(() => {
    //    let params = {
    //        statusGroupId: self.statusGroupId(),
    //        buyerCode: self.buyerCode(),
    //        supplierCode: self.supplierCode(),
    //        launchId: self.launchId(),
    //        brandId: self.brandId(),
    //        productColourId: self.productColourId(),
    //        stockLevelId: self.stockStatusId(),
    //        collectionCode: self.collectionCode(),
    //        productFilterGroupId: self.productFilterGroupId(),
    //        productFilterId: self.productFilterId(),
    //        attributeIds: self.attributeIds(),
    //    }

    //    Object.keys(params).forEach(k => {
    //        if (params[k] === '') {
    //            params[k] = undefined;
    //        }
    //    });

    //    let fire = Object.keys(params).find(k => params[k] != null && params[k] != '');

    //    if (fire) {
    //        console.log("parametersComputer fire was true");
    //        return JSON.stringify(params);
    //    } else {
    //        return null;
    //    }
    //}, self).extend({
    //    rateLimit: {
    //        timeout: 50,
    //        method: 'notifyWhenChangesStop'
    //    }
    //});

    //self.productFetch = ko.computed(() => {

    //    let params = self.parametersComputer();

    //    if (params) {
    //        console.log('productFetch', JSON.parse(params));

    //        ko.ignoreDependencies(() => {
    //            self.setBusy();
    //        });

    //        fetch('/api/stockManagement/fetchProducts', {
    //            method: 'POST',
    //            headers: window.fetchHeaders,
    //            body: params
    //        })
    //            .then(window.handleFetchResponse)
    //            .then(data => {
    //                self.previousParameters = params;
    //                console.log(data);
    //                //self.productSearchResults(data.Results.map(r => resultRecord(
    //                //    r,
    //                //    data.BranchGroupTotals,
    //                //    self.branchId() ? data.RangeRecords : [],
    //                //    data.ContrastRecords
    //                //)));
    //                self.productSearchResults(data.Results.map(r => resultRecord(
    //                    r
    //                )));

    //                ko.ignoreDependencies(() => {
    //                    self.clearBusy();
    //                });
    //            })
    //            .catch(err => {
    //                self.clearBusy();
    //                window.catchFetchError(err);
    //            });
    //    } else {
    //        self.productSearchResults([]);
    //    }
    //});

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
                console.log(nv);
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

    document.getElementById("current-tab-anchor").addEventListener('show.bs.tab', () => {
        self.statusGroupId(TAB_CURRENT);
    });

    document.getElementById("limited-tab-anchor").addEventListener('show.bs.tab', () => {
        self.statusGroupId(TAB_LIMITED);
    });

    document.getElementById("clearance-tab-anchor").addEventListener('show.bs.tab', () => {
        self.statusGroupId(TAB_CLEARANCE);
    });

    document.getElementById("discontinued-tab-anchor").addEventListener('show.bs.tab', () => {
        self.statusGroupId(TAB_DISCONTINUED);
    });

    window.addEventListener("onbeforeunload", (event) => {
        self.checkUnsavedChangesThenSelect = async (event) => {
            await self.unsavedChanges().then((d) => {

            }).catch((e) => { });
        }
    });

    //#endregion

    return self;
};

//const resultRecord = ((rec, branchGroupRecords, rangeRecords, contrastRecords) => {
const resultRecord = ((rec) => {
    let self = Object.assign({}, rec);

    //self.branchActual = ko.observable(0);

    //self.contrastTarget_A = ko.observable(0);
    //self.contrastActual_A = ko.observable(0);

    //self.contrastTarget_B = ko.observable(0);
    //self.contrastActual_B = ko.observable(0);

    //self.currentFreeStock = ko.observable(0);
    //self.transferStockLeaving = ko.observable(0);
    //self.transferStockArriving = ko.observable(0);
    //self.onPurchaseOrder = ko.observable(0);
    //self.firstDueDate = ko.observable(0);
    //self.firstDueQuantity = ko.observable(0);
    //self.projectedStock = ko.observable(0);

    //self.fenwickRingFence = ko.observable(0);
    //self.kingsRoadRingFence = ko.observable(0);
    //self.maryleboneRingFence = ko.observable(0);
    //self.tradeRingFence = ko.observable(0);
    //self.eCommerceRingFence = ko.observable(0);
    //self.totalRingFence = ko.observable(0);

    //self.fenwickSales = ko.observable(0);
    //self.kingsRoadSales = ko.observable(0);
    //self.maryleboneSales = ko.observable(0);
    //self.eCommerceSales = ko.observable(0);
    //self.tradeSales = ko.observable(0);

    self.branchActual = 0;

    self.contrastTarget_A =  0;
    self.contrastActual_A =  0;

    self.contrastTarget_B =  0;
    self.contrastActual_B =  0;

    self.currentFreeStock =  0;
    self.transferStockLeaving =  0;
    self.transferStockArriving =  0;
    self.onPurchaseOrder =  0;
    self.firstDueDate =  0;
    self.firstDueQuantity =  0;
    self.projectedStock =  0;

    self.fenwickRingFence =  0;
    self.kingsRoadRingFence =  0;
    self.maryleboneRingFence =  0;
    self.tradeRingFence =  0;
    self.eCommerceRingFence =  0;
    self.totalRingFence =  0;

    self.fenwickSales =  0;
    self.kingsRoadSales =  0;
    self.maryleboneSales =  0;
    self.eCommerceSales =  0;
    self.tradeSales =  0;

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
});