const
    TAB_OVERVIEW = 0,
    TAB_RANGE = 1,
    TAB_TRANSFER = 2

const
    SORT_QUANTITY_ASC = 0,
    SORT_QUANTITY_DESC = 1,
    SORT_ORDERFORMGROUP_ASC = 2,
    SORT_ORDERFORMGROUP_DESC = 3

const stockManagementViewModel = ({ } = {}) => {
    let self = {};

    //#region Properties

    self.busy = ko.observable(false);

    self.viewingTab = ko.observable(0);

    self.overviewBusy = ko.observable(false);

    self.rangeBusy = ko.observable(false);

    self.transferBusy = ko.observable(false);

    self.modalBusy = ko.observable(false);

    self.modalElement = document.getElementById('-modal');

    self.modal = bootstrap.Modal.getOrCreateInstance(self.modalElement);

    self.ready = ko.observable(true);

    self.displayWarehouseStock = ko.observable(false);
    window.displayWarehouseStock = self.displayWarehouseStock;

    self.displayRingFencedStock = ko.observable(false);
    window.displayRingFencedStock = self.displayRingFencedStock;

    self.displaySales = ko.observable(false);
    window.displaySales = self.displaySales;

    //#region Prefilters

    self.productTypeKey = ko.observable();

    self.productType = ko.observable();

    self.branchGroupId = ko.observable(51);

    self.branchGroup = ko.observable();

    self.branchId = ko.observable(3);
    window.branchId = self.branchId;

    self.branch = ko.observable();

    self.launchId = ko.observable();

    self.launch = ko.observable();

    self.brandId = ko.observable();

    self.brand = ko.observable();

    self.productColourId = ko.observable();

    self.productColour = ko.observable();

    self.stockLevelId = ko.observable();

    self.stockLevel = ko.observable();

    self.collectionCode = ko.observable();

    self.collection = ko.observable();

    self.attributeGroupId = ko.observable();

    self.attributeGroup = ko.observable();

    self.attributeId = ko.observable();

    self.attribute = ko.observable();

    self.attributeIds = ko.observableArray([]);

    self.attributes = ko.observableArray([]);

    //#endregion

    //#region sorting

    self.productSearchResultsSort = ko.observable(SORT_QUANTITY_DESC);

    //#endregion

    self.productSearchResults = ko.observableArray([]);

    self.branchGroupTotals = ko.observableArray([]);

    self.rangeRecords = ko.observableArray([]);

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

    self.productTypeParams = kendoMDCDropDownList({
        label: 'Product Type',
        odata: true,
        endPoint: '/odata/Mertex_ProductTypes?$expand=ProductType,ItemType,ProductGroup',
        textField: 'Label',
        valueField: 'PseudoKey',
        virtual: true,
        pageSize: 20,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
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

    self.branchGroupParams = kendoMDCDropDownList({
        label: 'Branch Group',
        odata: true,
        endPoint: '/odata/BranchGroups?$filter=PrimaryGroup eq true',
        textField: 'Name',
        valueField: 'BranchGroupID',
        virtual: true,
        pageSize: 20,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: `/odata/BranchGroups/Default.BranchGroupValueMapper(branchGroupId=${options.value || "null"})`,
                    type: 'GET',
                    success: function (data) {
                        options.success(data.value);
                        if (data.value.length == 1) {
                            self.branchGroup(data.value[0]);
                        }
                    }
                });
            }
        },
        idObservable: self.branchGroupId,
        objObservable: self.branchGroup,
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
            field: 'branchGroupId'
        },
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear
    });

    self.branchParams = kendoMDCDropDownList({
        label: 'Branch',
        odata: true,
        endPoint: '/odata/Branches',
        textField: 'Name',
        valueField: 'BranchID',
        virtual: true,
        pageSize: 20,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: `/odata/Branches/Default.BranchValueMapper(branchId=${options.value || "null"})`,
                    type: 'GET',
                    success: function (data) {
                        options.success(data.value);
                        if (data.value.length == 1) {
                            self.branch(data.value[0]);
                        }
                    }
                });
            }
        },
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
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            /// thanks, https://stackoverflow.com/questions/28995757/a-binary-operator-with-incompatible-types-was-detected-found-operand-types-edm/48919770
            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback
            delete d.$top;

            d.$count = true;

            if (self.branchGroupId()) {
                //Add filter by matching any reference containing value
                d.$filter = `BranchGroups/any(BranchGroup: BranchGroup/BranchGroupID eq ${self.branchGroupId()})`;
            }

            return d;
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
        pageSize: 20,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: `/odata/Launches/Default.LaunchValueMapper(launchId=${options.value || "null"})`,
                    type: 'GET',
                    success: function (data) {
                        options.success(data.value);
                        if (data.value.length == 1) {
                            self.launch(data.value[0]);
                        }
                    }
                });
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
        virtual: true,
        pageSize: 20,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: `/odata/Brands/Default.BrandValueMapper(brandId=${options.value || "null"})`,
                    type: 'GET',
                    success: function (data) {
                        options.success(data.value);
                        if (data.value.length == 1) {
                            self.brand(data.value[0]);
                        }
                    }
                });
            }
        },
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
        pageSize: 20,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: `/odata/ProductColours/Default.ProductColourValueMapper(name=${options.value || "null"})`,
                    type: 'GET',
                    success: function (data) {
                        options.success(data.value);
                        if (data.value.length == 1) {
                            self.productColour(data.value[0]);
                        }
                    }
                });
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
        label: 'Stock Level',
        textField: 'Name',
        valueField: 'StockLevelID',
        data: [{
            StockLevelID: 0,
            Name: 'In Stock'
        }, {
            StockLevelID: 1,
            Name: 'Low Stock'
        }, {
            StockLevelID: 2,
            Name: 'Out of Stock'
        }],
        idObservable: self.stockLevelId,
        objObservable: self.stockLevel,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertable: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 102,
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
        pageSize: 20,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: `/odata/Collections/Default.CollectionValueMapper(code=${options.value || "null"})`,
                    type: 'GET',
                    success: function (data) {
                        options.success(data.value);
                        if (data.value.length == 1) {
                            self.collection(data.value[0]);
                        }
                    }
                });
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
        virtual: true,
        pageSize: 20,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: `/odata/AttributeGroups/Default.AttributeGroupValueMapper(attributeGroupId=${options.value || "null"})`,
                    type: 'GET',
                    success: function (data) {
                        options.success(data.value);
                        if (data.value.length == 1) {
                            self.attributeGroup(data.value[0]);
                        }
                    }
                });
            }
        },
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
        pageSize: 20,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: `/odata/Attributes/Default.AttributeValueMapper(attributeId=${options.value || "null"})`,
                    type: 'GET',
                    success: function (data) {
                        options.success(data.value);
                        if (data.value.length == 1) {
                            self.attribute(data.value[0]);
                        }
                    }
                });
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
                self.multiSelectSettings.value([]);
                self.multiSelectSettings.widget().value([]);
                self.multiSelectSettings.widget().trigger('change');
            }).catch((e) => { });

        }
    };

    //#endregion
        

    //#region Subscriptions

    self.branchGroupId.subscribe(nv => {
        self.branchParams.clearFunction();
    });

    self.attributeGroupId.subscribe(nv => {
        self.attributeParams.clearFunction();
        self.attributesParams.clearFunction();
    });

    //#endregion


    //#region Methods

    self.setBusy = () => {
        switch (self.viewingTab()) {
            case TAB_OVERVIEW:
                self.overviewBusy(true);
                break;
            case TAB_RANGE:
                self.rangeBusy(true);
                break;
            case TAB_TRANSFER:
                self.transferBusy(true);
                break;
        }
    }

    self.clearBusy = () => {
        switch (self.viewingTab()) {
            case TAB_OVERVIEW:
                self.overviewBusy(false);
                break;
            case TAB_RANGE:
                self.rangeBusy(false);
                break;
            case TAB_TRANSFER:
                self.transferBusy(false);
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
            let unsaved = self.productSearchResults.peek().find(p => p.branchTargetParams.unsavedChanges());

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
        if (self.productSearchResults().find(p => p.branchTargetParams.unsavedChanges())) {
            self.setBusy();

            let products = self.productSearchResults().filter(p => p.branchTargetParams.unsavedChanges());

            products.forEach(p => {
                p.preSave();
            });

            let params = {
                branchId: self.branchId(),
                products: products.map(p => p.toJS())
            };

            fetch('/api/stockManagement/saveBranchRangeChanges', {
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

    self.productTypeId = ko.computed(() => { return self.productType()?.ProductTypeID }, self);

    self.productGroupCode = ko.computed(() => { return self.productType()?.ProductGroupCode }, self);

    self.itemTypeCode = ko.computed(() => { return self.productType()?.ItemTypeCode }, self);

    self.secondaryFiltersVisible = ko.computed(() => {
        return self.productTypeId() && (self.branchGroupId() || self.branchId());
    }, self);

    self.previousParameters = null;

    self.parametersComputer = ko.computed(() => {
        let params = {
            branchGroupId: self.branchGroupId(),
            branchId: self.branchId(),
            productTypeId: self.productTypeId(),
            productGroupCode: self.productGroupCode(),
            itemTypeCode: self.itemTypeCode(),
            launchId: self.launchId(),
            brandId: self.brandId(),
            productColourId: self.productColourId(),
            stockLevelId: self.stockLevelId(),
            collectionCode: self.collectionCode(),
            attributeGroupId: self.attributeGroupId(),
            attributeIds: self.attributeIds()
        }

        Object.keys(params).forEach(k => {
            if (params[k] === '') {
                params[k] = undefined;
            }
        });

        let fire = Object.keys(params).find(k => params[k] != null && params[k] != '');

        if (fire) {
            console.log("parametersComputer fire was true");
            return JSON.stringify(params);
        } else {
            return null;
        }
    }, self).extend({
        rateLimit: {
            timeout: 50,
            method: 'notifyWhenChangesStop'
        }
    });

    self.productFetch = ko.computed(() => {

        let params = self.parametersComputer();

        if (params) {
            console.log('productFetch', JSON.parse(params));

            ko.ignoreDependencies(() => {
                self.setBusy();
            });

            fetch('/api/stockManagement/fetchProducts', {
                method: 'POST',
                headers: window.fetchHeaders,
                body: params
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    self.previousParameters = params;
                    console.log(data);
                    self.productSearchResults(data.Results.map(r => resultRecord(
                        r,
                        data.BranchGroupTotals,
                        self.branchId() ? data.RangeRecords : [],
                        data.ContrastRecords
                    )));

                    ko.ignoreDependencies(() => {
                        self.clearBusy();
                    });
                })
                .catch(err => {
                    self.clearBusy();
                    window.catchFetchError(err);
                });
        } else {
            self.productSearchResults([]);
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
                collapsed: ko.observable(false)
            }
            obj[dataSetName] = v;
            result.push(obj)
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

    document.getElementById("overview-tab-anchor").addEventListener('show.bs.tab', () => {
        self.viewingTab(TAB_OVERVIEW);
    });

    document.getElementById("range-tab-anchor").addEventListener('show.bs.tab', () => {
        self.viewingTab(TAB_RANGE);
    });

    document.getElementById("transfer-tab-anchor").addEventListener('show.bs.tab', () => {
        self.viewingTab(TAB_TRANSFER);
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

const resultRecord = ((rec, branchGroupRecords, rangeRecords, contrastRecords) => {
    let self = Object.assign({}, rec);

    self.BranchGroup = branchGroupRecords.find(bg => bg.ProductID === self.ProductID) ?? {
        Quantity: 0
    };

    self.Range = rangeRecords.find(b => b.ProductID === self.ProductID) ?? {
        Quantity: 0
    }

    self.Contrast = contrastRecords.find(c => c.ProductID === self.ProductID) ?? {
        ContrastBranchA_Quantity: 0,
        ContrastBranchB_Quantity: 0
    };

    self.branchGroupTarget = ko.observable(self.BranchGroup.Quantity);
    self.branchGroupActual = ko.observable(0);

    self.branchTarget = ko.observable(self.Range.Quantity).extend({
        numberUnformatted: {
            minValue: 0,
            maxValue: 999,
            digits: 0,
            currency: {
                FormattingCulture: 'en-GB'
            }
        },
        numeric: {
            params: {
                required: 1,
                numericMin: 0,
                numericMax: 999
            }
        }
    });

    self.branchTargetBusy = ko.observable(false);

    self.saveBranchTarget = (event) => {
        self.branchTargetBusy(true);
        setTimeout(() => {
            self.branchTargetBusy(false);
        }, 2000);
    }

    self.branchTargetParams = {
        observable: self.branchTarget,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        showClear: true,
        busy: self.branchTargetBusy,
        buttons: false,
        inputType: 'number',
        minValue: 0,
        maxValue: 999,
        step: 1,
        enable: ko.observable(true),
        disable: self.branchTargetBusy,
        clearable: ko.observable(false),
        revertable: ko.observable(true),
        originalValue: self.branchTarget(),
        increment: () => { },
        decrement: () => { },
        revertFunction: () => {
            self.branchTarget(self.branchTargetParams.originalValue);
            self.branchTargetParams.unsavedChanges(false);
        },
        events: {
            change: (e) => {
                self.branchTargetParams.unsavedChanges(true);
            }
        },
        unsavedChanges: ko.observable(false)
    }

    self.branchTarget.subscribe(nv => {
        if (nv === self.branchTargetParams.originalValue) {
            self.branchTargetParams.unsavedChanges(false);
        }
    });

    self.branchActual = ko.observable(0);

    self.contrastTarget_A = ko.observable(self.Contrast.ContrastBranchA_Quantity);
    self.contrastActual_A = ko.observable(0);

    self.contrastTarget_B = ko.observable(self.Contrast.ContrastBranchB_Quantity);
    self.contrastActual_B = ko.observable(0);

    self.currentFreeStock = ko.observable(0);
    self.transferStockLeaving = ko.observable(0);
    self.transferStockArriving = ko.observable(0);
    self.onPurchaseOrder = ko.observable(0);
    self.firstDueDate = ko.observable(0);
    self.firstDueQuantity = ko.observable(0);
    self.projectedStock = ko.observable(0);

    self.fenwickRingFence = ko.observable(0);
    self.kingsRoadRingFence = ko.observable(0);
    self.maryleboneRingFence = ko.observable(0);
    self.tradeRingFence = ko.observable(0);
    self.eCommerceRingFence = ko.observable(0);
    self.totalRingFence = ko.observable(0);

    self.fenwickSales = ko.observable(0);
    self.kingsRoadSales = ko.observable(0);
    self.maryleboneSales = ko.observable(0);
    self.eCommerceSales = ko.observable(0);
    self.tradeSales = ko.observable(0);

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

    return self;
});