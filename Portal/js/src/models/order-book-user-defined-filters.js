const orderBookUserDefinedFiltersViewModel = ((parent) => {

    //#region Properties

    let self = {
        parent: parent
    };

    self.busy = self.parent.busy;

    self.cascadeEnabled = true;

    self.sidebarElement = document.getElementById('filters-sidebar');

    self.sidebarCollapseElement = document.getElementById('sidebar-collapse');
    self.sidebarCollapse = bootstrap.Collapse.getOrCreateInstance(self.sidebarCollapseElement);

    self.salesMarketId = ko.observable('');
    self.salesMarket = ko.observable();

    self.tradeAccountTypeId = ko.observable('');
    self.tradeAccountType = ko.observable();

    self.tradeAccountGroupId = ko.observable('');
    self.tradeAccountGroup = ko.observable();

    self.tradeAccountId = ko.observable('');
    self.tradeAccount = ko.observable();




    self.orderSearchTerm = ko.observable().extend({
        rateLimit: {
            timeout: 500,
            method: 'notifyWhenChangesStop'
        }
    });

    self.fromDate = ko.observable();

    self.toDate = ko.observable();

    self.haulierId = ko.observable('');
    self.haulier = ko.observable();




    self.productGroupId = ko.observable('');
    self.productGroup = ko.observable();

    self.itemTypeId = ko.observable('');
    self.itemType = ko.observable();

    self.brandId = ko.observable('');
    self.brand = ko.observable();

    self.collectionId = ko.observable('');
    self.collection = ko.observable();

    self.launchId = ko.observable('');
    self.launch = ko.observable();

    self.qualityId = ko.observable('');
    self.quality = ko.observable();

    self.productId = ko.observable('');
    self.product = ko.observable();

    //#endregion


    //#region Computeds

    self.tradeAccountComputer = ko.observable(true).extend({
        rateLimit: {
            timeout: 0,
            method: 'notifyWhenChangesStop'
        }
    });

    //#endregion


    //#region Lifted Methods

    self.genericUnsavedChangesSelect = (e) => {
        e.preventDefault(); // this prevents the Kendo control from actively selecting the thing the user selected
        self.checkUnsavedChangesThenSelect(e); // this does our check; async promise, confirm dialog, la la la...
    }

    self.checkUnsavedChangesThenSelect = async (event) => {
        await self.unsavedChanges().then((d) => {
            //console.log('go', event.sender.options.dataValueField, event.dataItem[event.sender.options.dataValueField]);
            event.sender._widgetOptions.value(event.dataItem[event.sender.options.dataValueField]);

        }).catch((e) => { });
    }

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
        }).catch((e) => { });
    }

    self.unsavedChanges = () => {
        return new Promise((resolve, reject) => {

            let array = [];

            //switch (self.view()) {
            //    case VIEW_MANAGE:
            //        array = self.filledRecords();
            //        break;
            //    case VIEW_ADD:
            //        array = self.addFilledRecords();
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


    // This remains bullshit
    //self.genericSelectSoleResult = (e, observable) => {

    //    //console.log(self.name, 'dropdown dataBound hit', e);
    //    var ds = e.sender.dataSource.data();
    //    if (ds.length == 1 && e.sender.value() != ds[0][e.sender.options.dataValueField]) {
    //        observable(ds[0][e.sender.options.dataValueField]);
    //    }
    //    if (ds.length == 0) {
    //        //console.log(observable, 'is setting itself to null');
    //        observable('');
    //    }
    //    if (ds.length > 1) {
    //        for (var i = 0; i < e.sender.dataSource.view().length; i++) {
    //            if (e.sender.dataSource.view()[i][e.sender.options.dataValueField] == observable()) {
    //                return; // we've got our selectedId in the view. No need to clear.
    //            }
    //        }
    //        // we haven't got our selectedId in view. Clear.
    //        observable('');
    //    }
    //};

    //#endregion

    //#region Components

    self.salesMarketParams = kendoMDCDropDownList({
        label: 'Market',
        odata: true,
        endPoint: () => {
            let tradeAccountId = self.tradeAccountId() == '' ? 'null' : self.tradeAccountId(),
                tradeAccountTypeId = self.tradeAccountTypeId() == '' ? 'null' : self.tradeAccountTypeId(),
                tradeAccountGroupId = self.tradeAccountGroupId() == '' ? 'null' : self.tradeAccountGroupId();

            let computation = self.tradeAccountComputer();

            return `/odata/SalesMarkets/Default.SalesMarketOrderBookFilter(tradeAccountId=${tradeAccountId},tradeAccountTypeId=${tradeAccountTypeId},tradeAccountGroupId=${tradeAccountGroupId})`;
        },
        textField: 'Label',
        valueField: 'SalesMarketID',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/SalesMarkets/Default.SalesMarketValueMapper(salesMarketId=${options.value})`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        idObservable: self.salesMarketId,
        objObservable: self.salesMarket,
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
            field: 'SalesMarketID'
        },
        select: function (e) {
            console.log('salesMarketParams select', e);
            self.tradeAccountComputer.valueHasMutated();
        },
        requestStart: function (e) {
            if (!self.cascadeEnabled)
                e.preventDefault();
        },
        clearFunction: self.genericUnsavedChangesClear,
        //dataBound: function (e) {
        //    self.genericSelectSoleResult(e, self.salesMarketId);
        //},
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "Label")) {
                let f = data.filter.filters.find(f => f.field === "Label");
                data.filter.filters = data.filter.filters.filter(f => f.field != "Label");
                data.filter.logic = "or";
                data.filter.filters = [{
                    field: "Name",
                    ignoreCase: true,
                    operator: "contains",
                    value: f.value
                }, {
                    field: "Code",
                    ignoreCase: true,
                    operator: "startswith",
                    value: f.value
                }];
            }
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            return d;
        },
        popupSettings: {
            appendTo: document.getElementById('sales-market-prefilter')
        }
    });

    self.tradeAccountParams = kendoMDCDropDownList({
        label: 'Trade Account',
        odata: true,
        endPoint: () => {
            let salesMarketId = self.salesMarketId() == '' ? 'null' : self.salesMarketId(),
                tradeAccountTypeId = self.tradeAccountTypeId() == '' ? 'null' : self.tradeAccountTypeId(),
                tradeAccountGroupId = self.tradeAccountGroupId() == '' ? 'null' : self.tradeAccountGroupId();

            let computation = self.tradeAccountComputer();

            return `/odata/TradeAccounts/Default.TradeAccountOrderBookFilter(salesMarketId=${salesMarketId},tradeAccountTypeId=${tradeAccountTypeId},tradeAccountGroupId=${tradeAccountGroupId})?$expand=TradePriceList`;
        },
        textField: 'ShortLabel',
        valueField: 'TradeAccountID',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/TradeAccounts/Default.TradeAccountValueMapper(tradeAccountId=${options.value})?$expand=TradePriceList`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        template: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        idObservable: self.tradeAccountId,
        objObservable: self.tradeAccount,
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
            field: 'TradeAccountID'
        },
        select: function (e) {
            console.log('tradeAccountParams select', e);
            self.tradeAccountComputer.valueHasMutated();
        },
        requestStart: function (e) {
            if (!self.cascadeEnabled)
                e.preventDefault();
        },
        clearFunction: self.genericUnsavedChangesClear,
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            if (d.$filter && d.$filter.indexOf('contains(tolower(ShortLabel)' === 0)) {
                d.$filter = `${d.$filter.replace("ShortLabel", "Name")} or ${d.$filter.replace("contains", "startswith").replace("ShortLabel", "Code")}`;
            }

            return d;
        },
        popupSettings: {
            appendTo: document.getElementById('trade-account-prefilter')
        }
    });

    self.tradeAccountTypeParams = kendoMDCDropDownList({
        label: 'Trade Account Type',
        odata: true,
        endPoint: () => {
            let salesMarketId = self.salesMarketId() == '' ? 'null' : self.salesMarketId(),
                tradeAccountGroupId = self.tradeAccountGroupId() == '' ? 'null' : self.tradeAccountGroupId(),
                tradeAccountId = self.tradeAccountId() == '' ? 'null' : self.tradeAccountId();

            let computation = self.tradeAccountComputer();

            return `/odata/TradeAccountTypes/Default.TradeAccountTypeOrderBookFilter(salesMarketId=${salesMarketId},tradeAccountGroupId=${tradeAccountGroupId},tradeAccountId=${tradeAccountId})`;
        },
        textField: 'ShortLabel',
        valueField: 'TradeAccountTypeID',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/TradeAccountTypes/Default.TradeAccountTypeValueMapper(tradeAccountTypeId=${options.value})`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        template: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        idObservable: self.tradeAccountTypeId,
        objObservable: self.tradeAccountType,
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
            field: 'Name'
        },
        select: function (e) {
            console.log('tradeAccountTypeParams select', e);
            self.tradeAccountComputer.valueHasMutated();
        },
        requestStart: function (e) {
            if (!self.cascadeEnabled)
                e.preventDefault();
        },
        clearFunction: self.genericUnsavedChangesClear,
        //dataBound: function (e) {
        //    self.genericSelectSoleResult(e, self.tradeAccountTypeId);
        //},
        parameterMap: (data) => {

            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            if (d.$filter && d.$filter.indexOf('contains(tolower(ShortLabel)' === 0)) {
                d.$filter = `${d.$filter.replace("ShortLabel", "Name")} or ${d.$filter.replace("contains", "startswith").replace("ShortLabel", "Code")}`;
            }

            return d;
        },
        popupSettings: {
            appendTo: document.getElementById('trade-account-type-prefilter')
        }
    });

    self.tradeAccountGroupParams = kendoMDCDropDownList({
        label: 'Trade Account Group',
        odata: true,
        endPoint: () => {
            let salesMarketId = self.salesMarketId() == '' ? 'null' : self.salesMarketId(),
                tradeAccountTypeId = self.tradeAccountTypeId() == '' ? 'null' : self.tradeAccountTypeId(),
                tradeAccountId = self.tradeAccountId() == '' ? 'null' : self.tradeAccountId();

            let computation = self.tradeAccountComputer();

            return `/odata/TradeAccountGroups/Default.TradeAccountGroupOrderBookFilter(salesMarketId=${salesMarketId},tradeAccountTypeId=${tradeAccountTypeId},tradeAccountId=${tradeAccountId})`;
        },
        textField: 'ShortLabel',
        valueField: 'TradeAccountGroupID',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/TradeAccountGroups/Default.TradeAccountGroupValueMapper(tradeAccountGroupId=${options.value})`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        template: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        idObservable: self.tradeAccountGroupId,
        objObservable: self.tradeAccountGroup,
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
            field: 'TradeAccountGroupID'
        },
        select: function (e) {
            console.log('tradeAccountGroup select', e);
            self.tradeAccountComputer.valueHasMutated();
        },
        requestStart: function (e) {
            if (!self.cascadeEnabled)
                e.preventDefault();
        },
        clearFunction: self.genericUnsavedChangesClear,
        //dataBound: function (e) {
        //    self.genericSelectSoleResult(e, self.tradeAccountGroupId);
        //},
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            if (d.$filter && d.$filter.indexOf('contains(tolower(ShortLabel)' === 0)) {
                d.$filter = `${d.$filter.replace("ShortLabel", "Name")} or ${d.$filter.replace("contains", "startswith").replace("ShortLabel", "Code")}`;
            }

            return d;
        },
        popupSettings: {
            appendTo: document.getElementById('trade-account-group-prefilter')
        }
    });

    self.fromDateParams = {
        label: "From Date",
        observable: self.fromDate,
        originalValue: self.fromDate(),
        displayObservable: ko.observable(),
        dateTimePickerOptions: {
            localization: {
                locale: 'en-GB',
                format: 'dd/MM/yyyy'
            },
            display: {
                sideBySide: false,
                components: {
                    clock: false,
                    calendar: true,
                    date: true,
                    month: true,
                    year: true,
                    decades: false,
                    clock: false,
                    hours: false,
                    minutes: false,
                    seconds: false
                },
                viewMode: 'months',
                cellSize: '5rem'
            },
            restrictions: {
                disabledDates: []
            },
            allowInputToggle: true,
            useCurrent: false,
            keepInvalid: true,
            debug: false,
            eventHandlers: {
                onChange: (e) => {

                }
            }
        },
        clearable: ko.observable(true),
        clearFunction: () => {
            self.fromDate(undefined);
        },
        revertible: ko.observable(false),
        revertFunction: () => {
            self.fromDateParams.observable(self.fromDateParams.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true
    };

    self.toDateParams = {
        label: "To Date",
        observable: self.toDate,
        originalValue: self.toDate(),
        displayObservable: ko.observable(),
        dateTimePickerOptions: {
            localization: {
                locale: 'en-GB',
                format: 'dd/MM/yyyy'
            },
            display: {
                sideBySide: false,
                components: {
                    clock: false,
                    calendar: true,
                    date: true,
                    month: true,
                    year: true,
                    decades: false,
                    clock: false,
                    hours: false,
                    minutes: false,
                    seconds: false
                },
                viewMode: 'months',
                cellSize: '2rem'
            },
            restrictions: {
                disabledDates: []
            },
            allowInputToggle: true,
            useCurrent: false,
            keepInvalid: true,
            debug: false,
            eventHandlers: {
                onChange: (e) => {

                }
            }
        },
        clearable: ko.observable(true),
        clearFunction: () => {
            self.toDate(undefined);
        },
        revertible: ko.observable(false),
        revertFunction: () => {
            self.toDateParams.observable(self.toDateParams.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true
    };

    self.orderSearchTermParams = {
        label: "Order ID / Customer Reference",
        observable: self.orderSearchTerm,
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
            field: 'LaunchID'
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

    self.haulierParams = kendoMDCDropDownList({
        label: 'Haulier',
        odata: true,
        endPoint: '/odata/Hauliers',
        textField: 'ShortLabel',
        valueField: 'Code',
        virtual: false,
        idObservable: self.haulierId,
        objObservable: self.haulier,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            if (d.$filter && d.$filter.indexOf('contains(tolower(ShortLabel)' === 0)) {
                d.$filter = `${d.$filter.replace("ShortLabel", "Name")} or ${d.$filter.replace("contains", "startswith").replace("ShortLabel", "Code")}`;
            }

            return d;
        },
    });

    self.productGroupParams = kendoMDCDropDownList({
        label: 'Product Group',
        odata: true,
        endPoint: '/odata/ProductGroups', // /Default.GetProductGroupsForContractPricing
        textField: 'Name',
        valueField: 'ProductGroupID',
        virtual: false,
        idObservable: self.productGroupId,
        objObservable: self.productGroup,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: false,
        autoBind: true,
        height: 340,
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear,
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            if (self.itemTypeId()) {
                d.$filter = `ContractProductRestrictions/any(pg: pg/ItemTypeID eq ${self.itemTypeId()})`
            }

            return d;
        },
        popupSettings: {
            appendTo: document.getElementById('product-group-prefilter')
        }
    });

    self.itemTypeParams = kendoMDCDropDownList({
        label: 'Item Type',
        odata: true,
        endPoint: '/odata/ItemTypes', // /Default.GetItemTypesForContractPricing?
        textField: 'Name',
        valueField: 'ItemTypeID',
        virtual: false,
        idObservable: self.itemTypeId,
        objObservable: self.itemType,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: false,
        autoBind: true,
        height: 340,
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => {
            console.log('dataBound', e);
            //e.sender.enable(e.sender.dataSource.data().length != 0);
            self.itemTypeParams.enable(e.sender.dataSource.data().length != 0);
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            if (self.productGroupId()) {
                d.$filter = `ContractProductRestrictions/any(pg: pg/ProductGroupID eq ${self.productGroupId()})`
            }

            return d;
        },
        popupSettings: {
            appendTo: document.getElementById('product-group-prefilter')
        }
    });

    self.collectionParams = kendoMDCDropDownList({
        label: 'Collection',
        odata: true,
        endPoint: '/odata/Collections',
        textField: 'ShortLabel',
        valueField: 'CollectionID',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/Collections/Default.CollectionValueMapper(collectionId=${options.value})`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        template: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        idObservable: self.collectionId,
        objObservable: self.collection,
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
            field: 'CollectionID'
        },
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('collection-prefilter')
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "ShortLabel")) {
                let f = data.filter.filters.find(f => f.field === "ShortLabel");
                data.filter.filters = data.filter.filters.filter(f => f.field != "ShortLabel");
                data.filter.logic = "or";
                data.filter.filters = [{
                    field: "Name",
                    ignoreCase: true,
                    operator: "contains",
                    value: f.value
                }, {
                    field: "Code",
                    ignoreCase: true,
                    operator: "startswith",
                    value: f.value
                }];
            }
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            return d;
        }
    });


    self.qualityParams = kendoMDCDropDownList({
        label: 'Design',
        odata: true,
        endPoint: '/odata/Qualities',
        textField: 'ShortLabel',
        valueField: 'QualityID',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/Qualities/Default.QualityValueMapper(qualityId=${options.value})`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        template: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        idObservable: self.qualityId,
        objObservable: self.quality,
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
            field: 'QualityID'
        },
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('quality-prefilter')
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "ShortLabel")) {
                let f = data.filter.filters.find(f => f.field === "ShortLabel");
                data.filter.filters = data.filter.filters.filter(f => f.field != "ShortLabel");
                data.filter.logic = "or";
                data.filter.filters = [{
                    field: "Name",
                    ignoreCase: true,
                    operator: "contains",
                    value: f.value
                }, {
                    field: "Code",
                    ignoreCase: true,
                    operator: "startswith",
                    value: f.value
                }];
            }
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            return d;
        }
    });

    self.productParams = kendoMDCDropDownList({
        label: 'Product (Excludes /C, /R)',
        odata: true,
        endPoint: '/odata/Products/GetProductsForOrderBookSummary',
        textField: 'ShortLabel',
        valueField: 'ProductID',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/Products/Default.ProductValueMapper(productId=${options.value})`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        template: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        idObservable: self.productId,
        objObservable: self.product,
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
            field: 'ProductID'
        },
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('product-prefilter')
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "ShortLabel")) {
                let f = data.filter.filters.find(f => f.field === "ShortLabel");
                data.filter.filters = data.filter.filters.filter(f => f.field != "ShortLabel");
                data.filter.logic = "or";
                data.filter.filters = [{
                    field: "Name",
                    ignoreCase: true,
                    operator: "contains",
                    value: f.value
                }, {
                    field: "Code",
                    ignoreCase: true,
                    operator: "startswith",
                    value: f.value
                }];
            }
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            return d;
        }
    });

    //#endregion


    //#region Subscriptions

    self.tradeAccount.subscribe(nv => {

        console.log("userDefinedFilters.tradeAccount subscribe hit", nv);

        //if (nv && self.cascadeEnabled) {
        //    if (nv.SalesMarketID) {
        //        self.salesMarketParams.dropDownListSettings.widget().value(nv.SalesMarketID);
        //    } else {
        //        self.salesMarketParams.dropDownListSettings.widget().value('');
        //    }

        //    if (nv.TradeAccountTypeID) {
        //        self.tradeAccountTypeParams.dropDownListSettings.widget().value(nv.TradeAccountTypeID);
        //    } else {
        //        self.tradeAccountTypeParams.dropDownListSettings.widget().value('');
        //    }

        //    if (nv.TradeAccountGroupID) {
        //        self.tradeAccountGroupParams.dropDownListSettings.widget().value(nv.TradeAccountGroupID);
        //    } else {
        //        self.tradeAccountGroupParams.dropDownListSettings.widget().value('');
        //    }

        //    self.cascadeEnabled = false;
        //}

        //if (nv == null) {
        //    self.cascadeEnabled = true;
        //}

    });

    self.fromDate.subscribe(nv => {
        //console.trace();
        if (nv) {
            if (self.toDate() && +self.toDate() < nv) {
                self.toDate(undefined);
            }

            let oneDayMilliseconds = 1000 * 60 * 60 * 24;

            self.toDate.tempusDominus.updateOptions({
                restrictions: {
                    minDate: new Date(nv.getTime() + oneDayMilliseconds)
                }
            });
        } else {

            self.toDate.tempusDominus.updateOptions({
                restrictions: {
                    minDate: undefined
                }
            });
        }
    });

    self.toDate.subscribe(nv => {
        //console.trace();
        if (nv) {
            if (self.fromDate() && +self.fromDate() > nv) {
                self.fromDate(undefined);
            }

            let oneDayMilliseconds = 1000 * 60 * 60 * 24;

            self.fromDate.tempusDominus.updateOptions({
                restrictions: {
                    maxDate: new Date(nv.getTime() - oneDayMilliseconds)
                }
            });
        } else {
            self.fromDate.tempusDominus.updateOptions({
                restrictions: {
                    maxDate: undefined
                }
            });
        }
    });


    //#endregion


    //#region Validation Groups

    self.errors = new ko.validation.group([
        self.fromDate,
        self.toDate
    ]);

    self.errorables = ko.observableArray([
        self.fromDate,
        self.toDate
    ]);

    //#endregion


    //#region Functions

    self.reset = () => {
        self.salesMarketId('');
        self.salesMarket(undefined);

        self.tradeAccountTypeId('');
        self.tradeAccountType(undefined);

        self.tradeAccountGroupId('');
        self.tradeAccountGroup(undefined);

        self.tradeAccountId('');
        self.tradeAccount(undefined);

        self.orderSearchTerm(undefined);

        self.fromDate(undefined);

        self.toDate(undefined);

        self.haulierId('');
        self.haulier(undefined);

        self.productGroupId('');
        self.productGroup(undefined);

        self.itemTypeId('');
        self.itemType(undefined);

        self.brandId('');
        self.brand(undefined);

        self.collectionId('');
        self.collection(undefined);

        self.launchId('');
        self.launch(undefined);

        self.qualityId('');
        self.quality(undefined);

        self.productId('');
        self.product(undefined);
    }

    self.togglePinning = (data, event) => {
        self.sidebarElement.classList.toggle('pinned');
        event.target.closest('button').blur();
    }

    self.json = ko.computed(() => {
        let result = {
            marketId: self.salesMarketId() || null,
            tradeAccountTypeId: self.tradeAccountTypeId() || null,
            tradeAccountGroupId: self.tradeAccountGroupId() || null,
            tradeAccountId: self.tradeAccountId() || null,
            orderSearchTerm: self.orderSearchTerm() || null,
            fromDate: self.fromDate() || null,
            toDate: self.toDate() || null,
            haulierCode: self.haulierId() || null,
            productGroupId: self.productGroupId() || null,
            itemTypeId: self.itemTypeId() || null,
            brandId: self.brandId() || null,
            collectionId: self.collectionId() || null,
            launchId: self.launchId() || null,
            qualityId: self.qualityId() || null,
            productId: self.productId() || null
        };

        return JSON.stringify(result);
    }).extend({
        rateLimit: {
            timeout: 100,
            method: 'notifyWhenChangesStop'
        }
    })

    //#endregion


    //#region Events



    //#endregion

    return self;
});