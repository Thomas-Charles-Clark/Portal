// many observables start as and reset to the empty string
// this is for very good reason, don't go trying to change it
// related to the filter components behaving in the same way as native <select> components
// in that the value presented when an empty option is selected (selects always have a selected option), even if they don't appear to
// is the empty string.
const EMPTY_STRING = '',
    yesNoOptions = [{
        Name: 'Yes',
        Value: true
    }, {
        Name: 'No',
        Value: false
    }]

const orderBookUserDefinedFiltersViewModel = ({
    parent,
    params
} = {
    parent: { },
    params: {
        salesMarketId: '',
        tradeAccountTypeId: '',
        tradeAccountGroupId: '',
        tradeAccountId: '',
        orderId: '',
        fromDate: undefined,
        toDate: undefined,
        haulierId: '',
        productGroupId: '',
        itemTypeId: '',
        brandId: '',
        collectionId: '',
        launchId: '',
        qualityId: '',
        productId: '',
        dateBasisId: 'O'
    }
}) => {

    //#region Properties

    let self = {
        parent: parent
    };

    self.busy = self.parent.busy;

    self.cascadeEnabled = true; // this is defunct, remove it entirely 20/05/2024

    self.permitJsonComputation = ko.observable(true);

    self.sidebarElement = document.getElementById('filters-sidebar');

    self.sidebarCollapseElement = document.getElementById('sidebar-collapse');
    self.sidebarCollapse = bootstrap.Collapse.getOrCreateInstance(self.sidebarCollapseElement);

    self.salesMarketId = ko.observable(params.marketId ?? '');
    self.salesMarket = ko.observable();
    self.salesMarketAwaitingBinding = ko.observable(params.marketId != null && params.marketId != '');

    self.tradeAccountTypeId = ko.observable(params.tradeAccountTypeId ?? '');
    self.tradeAccountType = ko.observable();
    self.tradeAccountTypeAwaitingBinding = ko.observable(params.tradeAccountTypeId != null && params.tradeAccountTypeId != '');

    self.tradeAccountGroupId = ko.observable(params.tradeAccountGroupId ?? '');
    self.tradeAccountGroup = ko.observable();
    self.tradeAccountGroupAwaitingBinding = ko.observable(params.tradeAccountGroupId != null && params.tradeAccountGroupId != '');

    self.tradeAccountId = ko.observable(params.tradeAccountId ?? '');
    self.tradeAccount = ko.observable();
    self.tradeAccountAwaitingBinding = ko.observable(params.tradeAccountId != null && params.tradeAccountId != '');

    self.orderId = ko.observable(params.orderId ?? '');
    self.order = ko.observable();
    self.orderAwaitingBinding = ko.observable(params.orderId != null && params.orderId != '');

    self.fromDate = ko.observable(params.startDate ?? undefined);

    self.toDate = ko.observable(params.endDate ?? undefined);

    self.haulierId = ko.observable(params.haulierId ?? '');
    self.haulier = ko.observable();
    self.haulierAwaitingBinding = ko.observable(params.haulierId != null && params.haulierId != '');

    self.productGroupId = ko.observable(params.productGroupId ?? '');
    self.productGroup = ko.observable();
    self.productGroupAwaitingBinding = ko.observable(params.productGroupId != null && params.productGroupId != '');

    self.itemTypeId = ko.observable(params.itemTypeId ?? '');
    self.itemType = ko.observable();
    self.itemTypeAwaitingBinding = ko.observable(params.itemTypeId != null && params.itemTypeId != '');

    self.brandId = ko.observable(params.brandId ?? '');
    self.brand = ko.observable();
    self.brandAwaitingBinding = ko.observable(params.brandId != null && params.brandId != '');

    self.collectionId = ko.observable(params.collectionId ?? '');
    self.collection = ko.observable();
    self.collectionAwaitingBinding = ko.observable(params.collectionId != null && params.collectionId != '');

    self.launchId = ko.observable(params.launchId ?? '');
    self.launch = ko.observable();
    self.launchAwaitingBinding = ko.observable(params.launchId != null && params.launchId != '');

    self.qualityId = ko.observable(params.qualityId ?? '');
    self.quality = ko.observable();
    self.qualityAwaitingBinding = ko.observable(params.qualityId != null && params.qualityId != '');

    self.productId = ko.observable(params.productId ?? '');
    self.product = ko.observable();
    self.productAwaitingBinding = ko.observable(params.productId != null && params.productId != '');

    self.availableDateBases = [{
        Name: 'Order Date',
        Value: 'O'
    }, {
        Name: 'Release Date',
        Value: 'R'
    }];

    // defunct 28/05/2024
    self.dateBasisId = ko.observable(params.dateBasis ?? ''); // 'O' == OrderDate; 'R' = ReleaseDate
    self.dateBasis = ko.observable();

    self.allocatedId = ko.observable(params.allocated == "1" ? true : params.allocated == "0" ? false : '');
    self.allocated = ko.observable();

    //#endregion


    //#region Computeds

    self.allBound = ko.computed(() => {
        return (self.salesMarketAwaitingBinding() == false &&
            self.tradeAccountTypeAwaitingBinding() == false &&
            self.tradeAccountGroupAwaitingBinding() == false &&
            self.tradeAccountAwaitingBinding() == false &&
            self.orderAwaitingBinding() == false &&
            self.haulierAwaitingBinding() == false &&
            self.productGroupAwaitingBinding() == false &&
            self.itemTypeAwaitingBinding() == false &&
            self.brandAwaitingBinding() == false &&
            self.collectionAwaitingBinding() == false &&
            self.launchAwaitingBinding() == false &&
            self.qualityAwaitingBinding() == false &&
            self.productAwaitingBinding() == false)
    }, self);

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
                self.observable(EMPTY_STRING);
            }

            if (self.dropDownListSettings.widget()) {

                if (ko.isObservableArray(self.observable)) {
                    self.dropDownListSettings.widget().value([]);
                } else {
                    self.dropDownListSettings.widget().value(EMPTY_STRING);
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
    //        observable(EMPTY_STRING);
    //    }
    //    if (ds.length > 1) {
    //        for (var i = 0; i < e.sender.dataSource.view().length; i++) {
    //            if (e.sender.dataSource.view()[i][e.sender.options.dataValueField] == observable()) {
    //                return; // we've got our selectedId in the view. No need to clear.
    //            }
    //        }
    //        // we haven't got our selectedId in view. Clear.
    //        observable(EMPTY_STRING);
    //    }
    //};

    //#endregion

    //#region Components

    self.salesMarketParams = kendoMDCDropDownList({
        label: 'Market',
        odata: true,
        endPoint: () => {
            let tradeAccountId = self.tradeAccountId() == EMPTY_STRING ? 'null' : self.tradeAccountId(),
                tradeAccountTypeId = self.tradeAccountTypeId() == EMPTY_STRING ? 'null' : self.tradeAccountTypeId(),
                tradeAccountGroupId = self.tradeAccountGroupId() == EMPTY_STRING ? 'null' : self.tradeAccountGroupId();

            let computation = self.tradeAccountComputer();

            return `/odata/SalesMarkets/Default.SalesMarketOrderBookFilter(tradeAccountId=${tradeAccountId},tradeAccountTypeId=${tradeAccountTypeId},tradeAccountGroupId=${tradeAccountGroupId})`;
        },
        textField: 'Name',
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
        dataBound: (e) => self.salesMarketAwaitingBinding(false),
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "Label")) {
                let f = data.filter.filters.find(f => f.field === "Label");
                data.filter.filters = data.filter.filters.filter(f => f.field != "Label");
                data.filter.logic = "or";
                data.filter.filters = [{
                    field: "Name",
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
            let salesMarketId = self.salesMarketId() == EMPTY_STRING ? 'null' : self.salesMarketId(),
                tradeAccountTypeId = self.tradeAccountTypeId() == EMPTY_STRING ? 'null' : self.tradeAccountTypeId(),
                tradeAccountGroupId = self.tradeAccountGroupId() == EMPTY_STRING ? 'null' : self.tradeAccountGroupId();

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
        dataBound: (e) => self.tradeAccountAwaitingBinding(false),
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
            let salesMarketId = self.salesMarketId() == EMPTY_STRING ? 'null' : self.salesMarketId(),
                tradeAccountGroupId = self.tradeAccountGroupId() == EMPTY_STRING ? 'null' : self.tradeAccountGroupId(),
                tradeAccountId = self.tradeAccountId() == EMPTY_STRING ? 'null' : self.tradeAccountId();

            let computation = self.tradeAccountComputer();

            return `/odata/TradeAccountTypes/Default.TradeAccountTypeOrderBookFilter(salesMarketId=${salesMarketId},tradeAccountGroupId=${tradeAccountGroupId},tradeAccountId=${tradeAccountId})`;
        },
        textField: 'Name',
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
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
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
        dataBound: (e) => self.tradeAccountTypeAwaitingBinding(false),
        parameterMap: (data) => {

            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            //if (d.$filter && d.$filter.indexOf('contains(tolower(ShortLabel)' === 0)) {
            //    d.$filter = `${d.$filter.replace("ShortLabel", "Name")} or ${d.$filter.replace("contains", "startswith").replace("ShortLabel", "Code")}`;
            //}

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
            let salesMarketId = self.salesMarketId() == EMPTY_STRING ? 'null' : self.salesMarketId(),
                tradeAccountTypeId = self.tradeAccountTypeId() == EMPTY_STRING ? 'null' : self.tradeAccountTypeId(),
                tradeAccountId = self.tradeAccountId() == EMPTY_STRING ? 'null' : self.tradeAccountId();

            let computation = self.tradeAccountComputer();

            return `/odata/TradeAccountGroups/Default.TradeAccountGroupOrderBookFilter(salesMarketId=${salesMarketId},tradeAccountTypeId=${tradeAccountTypeId},tradeAccountId=${tradeAccountId})`;
        },
        textField: 'Name',
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
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
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
        dataBound: (e) => self.tradeAccountGroupAwaitingBinding(false),
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            //if (d.$filter && d.$filter.indexOf('contains(tolower(ShortLabel)' === 0)) {
            //    d.$filter = `${d.$filter.replace("ShortLabel", "Name")} or ${d.$filter.replace("contains", "startswith").replace("ShortLabel", "Code")}`;
            //}

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
            self.fromDateParams.observable.tempusDominus.clear();
            self.fromDateParams.observable.tempusDominus.updateOptions({
                display: {
                    viewMode: 'months'
                }
            })
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
            self.toDateParams.observable.tempusDominus.clear();
            self.toDateParams.observable.tempusDominus.updateOptions({
                display: {
                    viewMode: 'months'
                }
            })
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true
    };

    self.orderParams = kendoMDCDropDownList({
        label: 'Order ID / Order Reference',
        odata: true,
        endPoint: `/odata/Orders/Default.GetOrdersForOrderBookSummary`,
        textField: 'ShortLabel',
        valueField: 'OrderID',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/Orders/Default.OrderValueMapper(orderId='${options.value}')`,
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
        idObservable: self.orderId,
        objObservable: self.order,
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
            field: 'OrderHeadID'
        },
        dataBound: (e) => self.orderAwaitingBinding(false),
        clearFunction: self.genericUnsavedChangesClear,
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            if (d.$filter && d.$filter.indexOf('contains(tolower(ShortLabel)' === 0)) {
                d.$filter = `${d.$filter.replace("ShortLabel", "CustomerOrderReference")} or ${d.$filter.replace("contains", "startswith").replace("ShortLabel", "OrderID")}`;
            }

            return d;
        },
        popupSettings: {
            appendTo: document.getElementById('order-prefilter')
        }
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
        dataBound: (e) => self.launchAwaitingBinding(false),
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
        dataBound: (e) => self.brandAwaitingBinding(false),
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
        dataBound: (e) => self.haulierAwaitingBinding(false),
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
        dataBound: (e) => self.productGroupAwaitingBinding(false),
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
            self.itemTypeAwaitingBinding(false);
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
        textField: 'Name',
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
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
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
        dataBound: (e) => self.collectionAwaitingBinding(false),
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
                    operator: "equals",
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
        dataBound: (e) => self.qualityAwaitingBinding(false),
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
        label: 'Product',
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
        sort: [{
            dir: 'desc',
            field: 'ProductFilter.ProductFilterGroup.SortOrder'
        }, {
            dir: 'desc',
            field: 'ProductFilter.SortOrder'
        }],
        select: self.genericUnsavedChangesSelect,
        dataBound: (e) => self.productAwaitingBinding(false),
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

    self.dateBasisParams = kendoMDCDropDownList({
        label: 'Date Basis',
        data: self.availableDateBases,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.dateBasisId,
        objObservable: self.dateBasis,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(false),
        revertible: ko.observable(false),
        readOnly: false,
        autoBind: true,
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('date-basis-prefilter')
        }
    });

    self.allocatedParams = kendoMDCDropDownList({
        label: 'Allocated',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.allocatedId,
        objObservable: self.allocated,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        popupSettings: {
            appendTo: document.getElementById('allocated-prefilter')
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
        //        self.salesMarketParams.dropDownListSettings.widget().value(EMPTY_STRING);
        //    }

        //    if (nv.TradeAccountTypeID) {
        //        self.tradeAccountTypeParams.dropDownListSettings.widget().value(nv.TradeAccountTypeID);
        //    } else {
        //        self.tradeAccountTypeParams.dropDownListSettings.widget().value(EMPTY_STRING);
        //    }

        //    if (nv.TradeAccountGroupID) {
        //        self.tradeAccountGroupParams.dropDownListSettings.widget().value(nv.TradeAccountGroupID);
        //    } else {
        //        self.tradeAccountGroupParams.dropDownListSettings.widget().value(EMPTY_STRING);
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

    // these id observables start as and reset to the empty string value intentionally
    // should probably set that as a constant
    self.reset = () => {
        self.salesMarketId(EMPTY_STRING);
        self.salesMarket(undefined);

        self.tradeAccountTypeId(EMPTY_STRING);
        self.tradeAccountType(undefined);

        self.tradeAccountGroupId(EMPTY_STRING);
        self.tradeAccountGroup(undefined);

        self.tradeAccountId(EMPTY_STRING);
        self.tradeAccount(undefined);

        self.orderId(EMPTY_STRING);
        self.order(undefined);

        self.fromDate(undefined);

        self.toDate(undefined);

        self.haulierId(EMPTY_STRING);
        self.haulier(undefined);

        self.productGroupId(EMPTY_STRING);
        self.productGroup(undefined);

        self.itemTypeId(EMPTY_STRING);
        self.itemType(undefined);

        self.brandId(EMPTY_STRING);
        self.brand(undefined);

        self.collectionId(EMPTY_STRING);
        self.collection(undefined);

        self.launchId(EMPTY_STRING);
        self.launch(undefined);

        self.qualityId(EMPTY_STRING);
        self.quality(undefined);

        self.productId(EMPTY_STRING);
        self.product(undefined);

        self.dateBasisId('O')
        self.dateBasis(undefined);

        self.allocatedId(EMPTY_STRING);
        self.allocated(undefined);
    }

    self.togglePinning = (data, event) => {
        self.sidebarElement.classList.toggle('pinned');
        event.target.closest('button').blur();
    }

    self.json = ko.computed(() => {
        if (self.allBound()) {
            let result = {
                marketId: self.salesMarketId() || null,
                tradeAccountTypeId: self.tradeAccountTypeId() || null,
                tradeAccountGroupId: self.tradeAccountGroupId() || null,
                tradeAccountId: self.tradeAccountId() || null,
                orderId: self.orderId() || null,
                startDate: self.fromDate() ? moment(self.fromDate()).format('YYYY/MM/DD') : null,
                endDate: self.toDate() ? moment(self.toDate()).format('YYYY/MM/DD') : null,
                haulierCode: self.haulierId() || null,
                productGroupId: self.productGroupId() || null,
                itemTypeId: self.itemTypeId() || null,
                brandId: self.brandId() || null,
                collectionId: self.collectionId() || null,
                launchId: self.launchId() || null,
                qualityId: self.qualityId() || null,
                productId: self.productId() || null,
                dateBasis: self.dateBasisId(),
                allocated: self.allocatedId() || null
            };

            return JSON.stringify(result);
        } else {
            return undefined;
        }
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
};