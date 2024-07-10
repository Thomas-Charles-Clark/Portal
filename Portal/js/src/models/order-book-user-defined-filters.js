// many observables start as and reset to the empty string
// this is for very good reason, don't go trying to change it
// related to the filter components behaving in the same way as native <select> components
// in that the value presented when an empty option is selected (selects always have a selected option), even if they don't appear to
// is the empty string.
const EMPTY_STRING = '',
    yesNoOptions = [{
        Name: 'Yes',
        Value: 'true'
    }, {
        Name: 'No',
        Value: 'false'
    }]

const orderBookUserDefinedFiltersViewModel = ({
    parent,
    params
} = {
    parent: { },
    params: {
        salesMarketId: '',
        salesMarketIds: [],
        salesRepresentativeId: '',
        salesAgentId: '',
        tradeAccountTypeId: '',
        tradeAccountGroupId: '',
        tradeAccountId: '',
        orderId: '',
        fromDate: undefined,
        toDate: undefined,
        haulierId: '',
        orderTakerId: '',
        deliveryTypeId: '',
        productGroupId: '',
        itemTypeId: '',
        brandId: '',
        collectionId: '',
        launchId: '',
        qualityId: '',
        supplierId: '',
        productId: '',
        dataSource: '',
        transactionTypeId: ''
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

    self.salesMarketIds = ko.observableArray(params.marketIds ?? []);
    self.salesMarkets = ko.observableArray();
    self.salesMarketsAwaitingBinding = ko.observable(params.marketIds != null && params.marketIds.length > 0);

    self.salesRepresentativeId = ko.observable(params.salesRepresentativeId ?? '');
    self.salesRepresentative = ko.observable();
    self.salesRepresentativeAwaitingBinding = ko.observable(params.salesRepresentativeId != null && params.salesRepresentativeId != '');

    self.salesAgentId = ko.observable(params.salesAgentId ?? '');
    self.salesAgent = ko.observable();
    self.salesAgentAwaitingBinding = ko.observable(params.salesAgentId != null && params.salesAgentId != '');

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

    self.orderTakerId = ko.observable(params.orderTakerId ?? '');
    self.orderTaker = ko.observable();
    self.orderTakerAwaitingBinding = ko.observable(params.orderTakerId != null && params.orderTakerId != '');

    self.fromDate = ko.observable(params.startDate ?? undefined);

    self.toDate = ko.observable(params.endDate ?? undefined);

    self.haulierId = ko.observable(params.haulierId ?? '');
    self.haulier = ko.observable();
    self.haulierAwaitingBinding = ko.observable(params.haulierId != null && params.haulierId != '');

    self.deliveryTypeId = ko.observable(params.deliveryTypeId ?? '');
    self.deliveryType = ko.observable();
    self.deliveryTypeAwaitingBinding = ko.observable(params.deliveryTypeId != null && params.deliveryTypeId != '');

    self.productGroupId = ko.observable(params.productGroupId ?? '');
    self.productGroup = ko.observable();
    self.productGroupAwaitingBinding = ko.observable(params.productGroupId != null && params.productGroupId != '');

    self.itemTypeId = ko.observable(params.itemTypeId ?? '');
    self.itemType = ko.observable();
    self.itemTypeAwaitingBinding = ko.observable(params.itemTypeId != null && params.itemTypeId != '');

    self.brandId = ko.observable(params.brandId ?? '');
    self.brand = ko.observable();
    self.brandAwaitingBinding = ko.observable(params.brandId != null && params.brandId != '');

    self.supplierId = ko.observable(params.supplierId ?? '');
    self.supplier = ko.observable();
    self.supplierAwaitingBinding = ko.observable(params.vId != null && params.supplierId != '');

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

    self.allocatedId = ko.observable(params.allocated == "1" ? true : params.allocated == "0" ? false : '');
    self.allocated = ko.observable();

    self.dataSourceId = ko.observable(params.dataSource ?? '');
    self.dataSource = ko.observable();

    self.transactionTypeId = ko.observable(params.transactionTypeId ?? '');
    self.transactionType = ko.observable();

    //#endregion


    //#region Computeds

    self.allBound = ko.computed(() => {
        return (self.salesMarketAwaitingBinding() == false &&
            self.tradeAccountTypeAwaitingBinding() == false &&
            self.tradeAccountGroupAwaitingBinding() == false &&
            self.tradeAccountAwaitingBinding() == false &&
            self.orderAwaitingBinding() == false &&
            self.haulierAwaitingBinding() == false &&
            self.orderTakerAwaitingBinding() == false &&
            self.productGroupAwaitingBinding() == false &&
            self.itemTypeAwaitingBinding() == false &&
            self.brandAwaitingBinding() == false &&
            self.supplierAwaitingBinding() == false &&
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
            if (event.sender.options.dataValueField.indexOf('.') === -1) {
                event.sender._widgetOptions.value(event.dataItem[event.sender.options.dataValueField]);
            } else {
                let split = event.sender.options.dataValueField.split('.');
                let obj = event.dataItem[split.shift()];

                split.forEach(s => {
                    obj = obj[s];
                });

                event.sender._widgetOptions.value(obj);
            }

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
        skipCascade: true,
        label: 'Market',
        odata: true,
        endPoint: () => {
            let tradeAccountId = self.tradeAccountId() == EMPTY_STRING ? 'null' : self.tradeAccountId(),
                tradeAccountTypeId = self.tradeAccountTypeId() == EMPTY_STRING ? 'null' : self.tradeAccountTypeId(),
                tradeAccountGroupId = self.tradeAccountGroupId() == EMPTY_STRING ? 'null' : self.tradeAccountGroupId(),
                salesRepresentativeId = self.salesRepresentativeId() == EMPTY_STRING ? 'null' : self.salesRepresentativeId(),
                salesAgentId = self.salesAgentId() == EMPTY_STRING ? 'null' : self.salesAgentId();

            //let computation = self.tradeAccountComputer();

            return `/odata/SalesMarkets/Default.SalesMarketOrderBookFilter(tradeAccountId=${tradeAccountId},tradeAccountTypeId=${tradeAccountTypeId},tradeAccountGroupId=${tradeAccountGroupId},salesRepresentativeId=${salesRepresentativeId},salesAgentId=${salesAgentId})`;
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

    self.salesMarketsParams = {
        observable: self.salesMarkets,
        validate: self.salesMarketIds,
        showClear: true,
        width: 'auto',
        label: 'Sales Markets',
        valuePrimitive: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        controlClass: 'form-control',
        disable: ko.observable(false),
        enable: ko.observable(true),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        multiSelectSettings: {
            value: self.salesMarketIds,
            dataItems: self.salesMarkets,
            dataValueField: 'SalesMarketID',
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
            data: new kendo.data.DataSource({
                serverFiltering: true,
                serverSorting: true,
                serverGrouping: true,
                serverPaging: true,
                pageSize: Math.floor((300 / 34) * 4),
                type: 'odata-v4',
                transport: {
                    read: {
                        url: () => {
                            let tradeAccountId = self.tradeAccountId() == EMPTY_STRING ? 'null' : self.tradeAccountId(),
                                tradeAccountTypeId = self.tradeAccountTypeId() == EMPTY_STRING ? 'null' : self.tradeAccountTypeId(),
                                tradeAccountGroupId = self.tradeAccountGroupId() == EMPTY_STRING ? 'null' : self.tradeAccountGroupId(),
                                salesRepresentativeId = self.salesRepresentativeId() == EMPTY_STRING ? 'null' : self.salesRepresentativeId(),
                                salesAgentId = self.salesAgentId() == EMPTY_STRING ? 'null' : self.salesAgentId();

                            //let computation = self.tradeAccountComputer();

                            return `/odata/SalesMarkets/Default.SalesMarketOrderBookFilter(tradeAccountId=${tradeAccountId},tradeAccountTypeId=${tradeAccountTypeId},tradeAccountGroupId=${tradeAccountGroupId},salesRepresentativeId=${salesRepresentativeId},salesAgentId=${salesAgentId})`;
                        }
                    },
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
                    data: {}
                },
                sort: {
                    dir: 'asc',
                    field: 'SalesMarketID'
                }
            }),
            popup: {
                appendTo: document.getElementById('sales-markets-prefilter')
            },
            valuePrimitive: true,
            autoWidth: false,
            autoBind: true,
            autoClose: false,
            optionLabel: ' ',
            filter: 'startswith'
        },
        clearFunction: function () {
            var self = this
            self.multiSelectSettings.value([]);
            self.multiSelectSettings.widget().value([]);
            self.multiSelectSettings.widget().trigger('change');
        }
    };

    self.tradeAccountParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Trade Account',
        odata: true,
        endPoint: () => {
            let salesMarketIds = self.salesMarketIds(),
                tradeAccountTypeId = self.tradeAccountTypeId() == EMPTY_STRING ? 'null' : self.tradeAccountTypeId(),
                tradeAccountGroupId = self.tradeAccountGroupId() == EMPTY_STRING ? 'null' : self.tradeAccountGroupId(),
                salesRepresentativeId = self.salesRepresentativeId() == EMPTY_STRING ? 'null' : self.salesRepresentativeId(),
                salesAgentId = self.salesAgentId() == EMPTY_STRING ? 'null' : self.salesAgentId();

            //let computation = self.tradeAccountComputer();

            return `/odata/TradeAccounts/Default.TradeAccountOrderBookFilter(salesMarketIds=[${salesMarketIds}],tradeAccountTypeId=${tradeAccountTypeId},tradeAccountGroupId=${tradeAccountGroupId},salesRepresentativeId=${salesRepresentativeId},salesAgentId=${salesAgentId})?$expand=TradePriceList`;
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
        skipCascade: true,
        label: 'Trade Account Type',
        odata: true,
        endPoint: () => {
            let salesMarketIds = self.salesMarketIds(),
                tradeAccountGroupId = self.tradeAccountGroupId() == EMPTY_STRING ? 'null' : self.tradeAccountGroupId(),
                tradeAccountId = self.tradeAccountId() == EMPTY_STRING ? 'null' : self.tradeAccountId(),
                salesRepresentativeId = self.salesRepresentativeId() == EMPTY_STRING ? 'null' : self.salesRepresentativeId(),
                salesAgentId = self.salesAgentId() == EMPTY_STRING ? 'null' : self.salesAgentId();

            //let computation = self.tradeAccountComputer();

            return `/odata/TradeAccountTypes/Default.TradeAccountTypeOrderBookFilter(salesMarketIds=[${salesMarketIds}],tradeAccountGroupId=${tradeAccountGroupId},tradeAccountId=${tradeAccountId},salesRepresentativeId=${salesRepresentativeId},salesAgentId=${salesAgentId})`;
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

    self.salesRepresentativeParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Sales Representative',
        odata: true,
        endPoint: () => {
            let salesMarketIds = self.salesMarketIds(),
                tradeAccountTypeId = self.tradeAccountTypeId() == EMPTY_STRING ? 'null' : self.tradeAccountTypeId(),
                tradeAccountGroupId = self.tradeAccountGroupId() == EMPTY_STRING ? 'null' : self.tradeAccountGroupId(),
                tradeAccountId = self.tradeAccountId() == EMPTY_STRING ? 'null' : self.tradeAccountId(),
                salesAgentId = self.salesAgentId() == EMPTY_STRING ? 'null' : self.salesAgentId();

            //let computation = self.tradeAccountComputer();

            return `/odata/SalesRepresentatives/Default.SalesRepresentativesOrderBookFilter(salesMarketIds=[${salesMarketIds}],tradeAccountTypeId=${tradeAccountTypeId},tradeAccountGroupId=${tradeAccountGroupId},tradeAccountId=${tradeAccountId},salesAgentId=${salesAgentId})`;
        },
        textField: 'Name',
        valueField: 'SalesRepresentativeID',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/SalesRepresentatives/Default.SalesRepresentativeValueMapper(salesRepresentativeId=${options.value})`,
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
        idObservable: self.salesRepresentativeId,
        objObservable: self.salesRepresentative,
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
        dataBound: (e) => self.salesRepresentativeAwaitingBinding(false),
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
            appendTo: document.getElementById('sales-representative-prefilter')
        }
    });

    self.salesAgentParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Sales Agent',
        odata: true,
        endPoint: () => {
            let salesMarketIds = self.salesMarketIds(),
                tradeAccountTypeId = self.tradeAccountTypeId() == EMPTY_STRING ? 'null' : self.tradeAccountTypeId(),
                tradeAccountGroupId = self.tradeAccountGroupId() == EMPTY_STRING ? 'null' : self.tradeAccountGroupId(),
                tradeAccountId = self.tradeAccountId() == EMPTY_STRING ? 'null' : self.tradeAccountId(),
                salesRepresentativeId = self.salesRepresentativeId() == EMPTY_STRING ? 'null' : self.salesRepresentativeId();

            //let computation = self.tradeAccountComputer();

            return `/odata/SalesAgents/Default.SalesAgentsOrderBookFilter(salesMarketIds=[${salesMarketIds}],tradeAccountTypeId=${tradeAccountTypeId},tradeAccountGroupId=${tradeAccountGroupId},tradeAccountId=${tradeAccountId},salesRepresentativeId=${salesRepresentativeId})`;
        },
        textField: 'Name',
        valueField: 'SalesAgentID',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/SalesAgents/Default.SalesAgentsValueMapper(salesAgentId=${options.value})`,
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
        idObservable: self.salesAgentId,
        objObservable: self.salesAgent,
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
            console.log('salesAgentParams select', e);
            self.tradeAccountComputer.valueHasMutated();
        },
        requestStart: function (e) {
            if (!self.cascadeEnabled)
                e.preventDefault();
        },
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => self.salesAgentAwaitingBinding(false),
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
            appendTo: document.getElementById('sales-agent-prefilter')
        }
    });

    self.tradeAccountGroupParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Trade Account Group',
        odata: true,
        endPoint: () => {
            let salesMarketIds = self.salesMarketIds(),
                tradeAccountTypeId = self.tradeAccountTypeId() == EMPTY_STRING ? 'null' : self.tradeAccountTypeId(),
                tradeAccountId = self.tradeAccountId() == EMPTY_STRING ? 'null' : self.tradeAccountId(),
                salesRepresentativeId = self.salesRepresentativeId() == EMPTY_STRING ? 'null' : self.salesRepresentativeId(),
                salesAgentId = self.salesAgentId() == EMPTY_STRING ? 'null' : self.salesAgentId();

            //let computation = self.tradeAccountComputer();

            return `/odata/TradeAccountGroups/Default.TradeAccountGroupOrderBookFilter(salesMarketIds=[${salesMarketIds}],tradeAccountTypeId=${tradeAccountTypeId},tradeAccountId=${tradeAccountId},salesRepresentativeId=${salesRepresentativeId},salesAgentId=${salesAgentId})`;
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
        label: 'Order ID / Reference',
        odata: true,
        endPoint: `/odata/OrderBooksGrouped/Default.GetOrdersForOrderBookSummary`,
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
                        url: `/odata/OrderBooksGrouped/Default.OrderValueMapper(orderId='${options.value}')`,
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
            field: 'OrderID'
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

    self.deliveryTypeParams = kendoMDCDropDownList({
        label: 'Delivery Type',
        odata: true,
        endPoint: '/odata/DeliveryTypes',
        textField: 'ShortLabel',
        valueField: 'Code',
        virtual: false,
        idObservable: self.deliveryTypeId,
        objObservable: self.deliveryType,
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
            field: 'SortOrder'
        },
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

    self.orderTakerParams = kendoMDCDropDownList({
        label: 'Order Taker',
        odata: true,
        endPoint: '/odata/OrderTakers',
        textField: 'ShortLabel',
        valueField: 'Code',
        virtual: false,
        idObservable: self.orderTakerId,
        objObservable: self.orderTaker,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        select: self.genericUnsavedChangesSelect,
        dataBound: (e) => self.orderTakerAwaitingBinding(false),
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
                d.$filter = `${d.$filter.replace("ShortLabel", "Code")} or ${d.$filter.replace("contains", "startswith").replace("ShortLabel", "Name")}`;
            }

            return d;
        },
    });

    self.generateAfterClear = (defaultGroupBy) => {
        return () => {
            let filters = [];

            if (defaultGroupBy.indexOf('BrandID') == -1) {
                filters.push(self.brandParams.dropDownListSettings.widget());
            }

            if (defaultGroupBy.indexOf('SupplierCode') == -1) {
                filters.push(self.supplierParams.dropDownListSettings.widget());
            }

            if (defaultGroupBy.indexOf('ProductGroupID') == -1) {
                filters.push(self.productGroupParams.dropDownListSettings.widget());
            }

            if (defaultGroupBy.indexOf('ItemTypeID') == -1) {
                filters.push(self.itemTypeParams.dropDownListSettings.widget());
            }

            if (defaultGroupBy.indexOf('CollectionID') == -1) {
                filters.push(self.collectionParams.dropDownListSettings.widget());
            }

            if (defaultGroupBy.indexOf('LaunchID') == -1) {
                filters.push(self.launchParams.dropDownListSettings.widget());
            }

            if (defaultGroupBy.indexOf('QualityID') == -1) {
                filters.push(self.qualityParams.dropDownListSettings.widget());
            }

            filters.forEach(f => {
                //f.dataSource.read();
            })
        }
    }

    self.generateSuperSetParameterMap = (defaultODataOperation) => {
        return (data) => {
            let defaultOp = defaultODataOperation;

            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            let filters = [];

            let brandId = null;
            let productGroupId = null;
            let itemTypeId = null;
            let collectionId = null;
            let launchId = null;
            let qualityId = null;
            let supplierId = null;

            if (defaultOp.indexOf("BrandID") == -1) {
                brandId = self.brandId();
            } else {
                brandId = self.brandId.peek();
            }

            if (defaultOp.indexOf("SupplierCode") == -1) {
                supplierId = self.supplierId();
            } else {
                supplierId = self.supplierId.peek();
            }

            if (defaultOp.indexOf("ProductGroupID") == -1) {
                productGroupId = self.productGroupId();
            } else {
                productGroupId = self.productGroupId.peek();
            }

            if (defaultOp.indexOf("ItemTypeID") == -1) {
                itemTypeId = self.itemTypeId();
            } else {
                itemTypeId = self.itemTypeId.peek();
            }

            if (defaultOp.indexOf("CollectionID") == -1) {
                collectionId = self.collectionId();
            } else {
                collectionId = self.collectionId.peek();
            }

            if (defaultOp.indexOf("LaunchID") == -1) {
                launchId = self.launchId();
            } else {
                launchId = self.launchId.peek();
            }

            if (defaultOp.indexOf("QualityID") == -1) {
                qualityId = self.qualityId();
            } else {
                qualityId = self.qualityId.peek();
            }

            // product table map LatestCollectionID...

            if (defaultOp === 'PRODUCT') {
                if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "ShortLabel")) {
                    let f = data.filter.filters.find(f => f.field === "ShortLabel");
                    filters.push(`(contains(Name,'${f.value}') or startswith(Code,'${f.value}'))`);
                    //filters.push(`Code eq '${f.value}'`);
                }

                if (d.$filter) {
                    delete d.$filter;
                }
            }

            // regardless whether or not a filter has a selection it must be refreshed if ANOTHER filter changes.
            // the implementation beneath is *not quite* sufficient

            if (defaultOp.indexOf('BrandID') == -1 && brandId != '') {
                filters.push(`BrandID eq ${brandId}`);
            }

            if (supplierId != '') {
                if (defaultOp === 'PRODUCT') {
                    filters.push(`DefaultSupplier/Code eq '${supplierId}'`);
                } else {
                    filters.push(`SupplierCode eq '${supplierId}'`);
                }
            } else {
                if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "Supplier.Name")) {
                    let f = data.filter.filters.find(f => f.field === "Supplier.Name");
                    filters.push(`(contains(Supplier/Name, '${f.value}') or startswith(Supplier/Code,'${f.value}'))`);

                    if (d.$filter) {
                        delete d.$filter;
                    }
                }
            }

            if (defaultOp.indexOf('ProductGroupID') == -1 && productGroupId != '') {
                filters.push(`ProductGroupID eq ${productGroupId}`);
            }

            if (defaultOp.indexOf('ItemTypeID') == -1 && itemTypeId != '') {
                filters.push(`ItemTypeID eq ${itemTypeId}`);
            }

            //if (defaultOp.indexOf('CollectionID') == -1 && collectionId != '') {
            //    if (defaultOp != 'PRODUCT') {
            //        filters.push(`CollectionID eq ${collectionId}`);
            //    }
            //}

            if (collectionId != '') {
                if (defaultOp != 'PRODUCT') {
                    filters.push(`CollectionID eq ${CollectionID}`);
                } else {
                    filters.push(`CollectionID eq ${CollectionID}`);
                }
            } else {
                if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "Collection.Name")) {
                    let f = data.filter.filters.find(f => f.field === "Collection.Name");
                    filters.push(`(contains(Collection/Name, '${f.value}') or startswith(Collection/Code,'${f.value}'))`);

                    if (d.$filter) {
                        delete d.$filter;
                    }
                }
            }

            if (defaultOp.indexOf('LaunchID') == -1 && launchId != '') {
                filters.push(`LaunchID eq ${launchId}`);
            }

            if (qualityId != '') {
                filters.push(`QualityID eq ${qualityId}`);
            } else {
                if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "Quality.Name")) {
                    let f = data.filter.filters.find(f => f.field === "Quality.Name");
                    filters.push(`(contains(Quality/Name, '${f.value}') or startswith(Quality/Code,'${f.value}'))`);

                    if (d.$filter) {
                        delete d.$filter;
                    }
                }
            }

            if (defaultOp == 'PRODUCT') {
                defaultOp = '';
                if (collectionId != '') {
                    filters.push(`Collections/any(c: c/CollectionID eq ${collectionId})`)
                }
            }

            d.$apply = defaultOp;

            if (filters.length) {
                let filterString = filters.join(' and ');
                d.$apply = `filter(${filterString})`;

                if (defaultOp) {
                    d.$apply = `${d.$apply}/${defaultOp}`;
                }
            }

            if (!d.$apply) {
                delete d.$apply;
            } else {
                console.log(d.$apply);
            }

            return d;
        }
    }

    self.productGroupGroupBy = `groupby((ProductGroup/ProductGroupID,ProductGroup/Name))/filter((ProductGroup/ProductGroupID ne null))`;

    self.productGroupParams = kendoMDCDropDownList({
        label: 'Product Group',
        odata: true,
        endPoint: '/odata/MertexProductClassificationSuperSet',
        textField: 'ProductGroup.Name',
        valueField: 'ProductGroup.ProductGroupID',
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
        parameterMap: self.generateSuperSetParameterMap(self.productGroupGroupBy),
        afterClear: self.generateAfterClear(self.productGroupGroupBy),
        popupSettings: {
            appendTo: document.getElementById('product-group-prefilter')
        }
    });

    self.itemTypeGroupBy = `groupby((ItemType/ItemTypeID,ItemType/Name))/filter((ItemType/ItemTypeID ne null))`;

    self.itemTypeParams = kendoMDCDropDownList({
        label: 'Item Type',
        odata: true,
        endPoint: '/odata/MertexProductClassificationSuperSet', // /Default.GetItemTypesForContractPricing?
        textField: 'ItemType.Name',
        valueField: 'ItemType.ItemTypeID',
        virtual: false,
        idObservable: self.itemTypeId,
        objObservable: self.itemType,
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
        dataBound: (e) => {
            self.itemTypeAwaitingBinding(false);
            self.itemTypeParams.enable(e.sender.dataSource.data().length != 0);
        },
        parameterMap: self.generateSuperSetParameterMap(self.itemTypeGroupBy),
        afterClear: self.generateAfterClear(self.itemTypeGroupBy),
        popupSettings: {
            appendTo: document.getElementById('product-group-prefilter')
        }
    });

    self.brandsGroupBy = `groupby((Brand/BrandID,Brand/Name))/filter((Brand/BrandID ne null))`;

    self.brandParams = kendoMDCDropDownList({
        label: 'Brand',
        odata: true,
        endPoint: '/odata/MertexProductClassificationSuperSet',
        textField: 'Brand.Name',
        valueField: 'Brand.BrandID',
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
        clearFunction: self.genericUnsavedChangesClear,
        parameterMap: self.generateSuperSetParameterMap(self.brandsGroupBy),
        afterClear: self.generateAfterClear(self.brandsGroupBy)
    });

    self.collectionGroupBy = `groupby((Collection/CollectionID,Collection/Name,Collection/Code))/filter((Collection/CollectionID ne null))`;

    self.collectionTemplate = (e) => {
        if (e.Collection && e.Collection.CollectionID && e.Collection.Name) {
            return `<span title="${e.Collection.Code} - ${e.Collection.Name}">${e.Collection.Code} - ${e.Collection.Name}</span>`;
        } else {
            return '';
        }
    }

    self.collectionParams = kendoMDCDropDownList({
        label: 'Collection',
        odata: true,
        endPoint: '/odata/MertexProductClassificationSuperSet',
        textField: 'Collection.Name',
        valueField: 'Collection.CollectionID',
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
                            options.success([{
                                Collection: data.value[0]
                            }]);
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        template: self.collectionTemplate,
        valueTemplate: self.collectionTemplate,
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
            field: 'Collection.CollectionID'
        },
        select: self.genericUnsavedChangesSelect,
        dataBound: (e) => self.collectionAwaitingBinding(false),
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('collection-prefilter')
        },
        parameterMap: self.generateSuperSetParameterMap(self.collectionGroupBy),
        afterClear: self.generateAfterClear(self.collectionGroupBy)
    });

    self.launchesGroupBy = `groupby((Launch/LaunchID,Launch/Name))/filter((Launch/LaunchID ne null))`;

    self.launchParams = kendoMDCDropDownList({
        label: 'Launch',
        odata: true,
        endPoint: '/odata/MertexProductClassificationSuperSet',
        textField: 'Launch.Name',
        valueField: 'Launch.LaunchID',
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
                            options.success([{
                                Launch: data.value[0]
                            }]);
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
            field: 'Launch.LaunchID'
        },
        select: self.genericUnsavedChangesSelect,
        dataBound: (e) => self.launchAwaitingBinding(false),
        clearFunction: self.genericUnsavedChangesClear,
        parameterMap: self.generateSuperSetParameterMap(self.launchesGroupBy),
        afterClear: self.generateAfterClear(self.launchesGroupBy)
    });

    self.qualityGroupBy = `groupby((Quality/QualityID,Quality/Code,Quality/Name))/filter((Quality/QualityID ne null))`;

    self.qualityTemplate = (e) => {
        if (e.Quality && e.Quality.QualityID && e.Quality.Name) {
            return `<span title="${e.Quality.Code} - ${e.Quality.Name}">${e.Quality.Code} - ${e.Quality.Name}</span>`;
        } else {
            return '';
        }
    }

    self.qualityParams = kendoMDCDropDownList({
        label: 'Design',
        odata: true,
        endPoint: '/odata/MertexProductClassificationSuperSet',
        textField: 'Quality.Name',
        valueField: 'Quality.QualityID',
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
                            options.success([{
                                Quality: data.value[0]
                            }]);
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        template: self.qualityTemplate,
        valueTemplate: self.qualityTemplate,
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
            field: 'Quality.QualityID'
        },
        select: self.genericUnsavedChangesSelect,
        dataBound: (e) => self.qualityAwaitingBinding(false),
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('quality-prefilter')
        },
        parameterMap: self.generateSuperSetParameterMap(self.qualityGroupBy),
        afterClear: self.generateAfterClear(self.qualityGroupBy)
    });


    self.supplierGroupBy = `groupby((Supplier/Code,Supplier/Name))/filter((Supplier/Code ne null))`;

    self.supplierTemplate = (e) => {
        if (e.Supplier && e.Supplier.Code && e.Supplier.Name) {
            return `<span title="${e.Supplier.Code} - ${e.Supplier.Name}">${e.Supplier.Code} - ${e.Supplier.Name}</span>`;
        } else {
            return '';
        }
    }

    self.supplierParams = kendoMDCDropDownList({
        label: 'Supplier',
        odata: true,
        endPoint: '/odata/MertexProductClassificationSuperSet',
        textField: 'Supplier.Name',
        valueField: 'Supplier.Code',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/MertexProductClassificationSuperSet?$apply=groupby((Supplier/Code,Supplier/Name))/filter((Supplier/Code eq '${options.value}'))`,
                        type: 'GET',
                        success: function (data) {
                            options.success([{
                                Supplier: data.value[0]
                            }]);
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        template: self.supplierTemplate,
        valueTemplate: self.supplierTemplate,
        idObservable: self.supplierId,
        objObservable: self.supplier,
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
            field: 'Supplier.Code'
        },
        ignoreCase: false,
        select: self.genericUnsavedChangesSelect,
        dataBound: (e) => self.supplierAwaitingBinding(false),
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('supplier-prefilter')
        },
        parameterMap: self.generateSuperSetParameterMap(self.supplierGroupBy),
        afterClear: self.generateAfterClear(self.supplierGroupBy)
    });

    self.productDefault = 'PRODUCT';

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
        parameterMap: self.generateSuperSetParameterMap(self.productDefault)
        //    (data) => {
        //    //Generate parameters in odata v4 format
        //    if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "ShortLabel")) {
        //        let f = data.filter.filters.find(f => f.field === "ShortLabel");
        //        data.filter.filters = data.filter.filters.filter(f => f.field != "ShortLabel");
        //        data.filter.logic = "or";
        //        data.filter.filters = [{
        //            field: "Name",
        //            ignoreCase: true,
        //            operator: "contains",
        //            value: f.value
        //        }, {
        //            field: "Code",
        //            ignoreCase: true,
        //            operator: "startswith",
        //            value: f.value
        //        }];
        //    }
        //    let d = kendo.data.transports['odata-v4'].parameterMap(data);

        //    delete d.$inlinecount; // <-- remove inlinecount
        //    delete d.$format; // <-- remove format
        //    delete d.$callback; // <-- remove callback

        //    d.$count = true;

        //    return d;
        //}
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

    self.dataSourceParams = kendoMDCDropDownList({
        label: 'Data Source',
        data: [{
            Name: 'Mertex',
            Value: 'M'
        }, {
            Name: 'Portal',
            Value: 'P'
        }, {
            Name: 'Basket',
            Value: 'B'
        }, {
            Name: 'Transaction',
            Value: 'T'
        }, {
            Name: 'Import Queue',
            Value: 'I'
        },],
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.dataSourceId,
        objObservable: self.dataSource,
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
            appendTo: document.getElementById('data-source-prefilter')
        }
    });

    self.transactionTypeParams = kendoMDCDropDownList({
        label: 'Transaction Type',
        odata: true,
        endPoint: '/odata/transactionTypes',
        textField: 'Name',
        valueField: 'TransactionTypeID',
        idObservable: self.transactionTypeId,
        objObservable: self.transactionType,
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
            field: 'TransactionTypeID'
        },
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear
    });

    //#endregion


    //#region Subscriptions

    self.productGroupId.subscribe(nv => {
        console.log('productGroupId subscribe hit', nv);
    });

    self.itemTypeId.subscribe(nv => {
        console.log('itemTypeId subscribe hit', nv);
    });

    self.brandId.subscribe(nv => {
        console.log('brandId subscribe hit', nv);
    });

    self.collectionId.subscribe(nv => {
        console.log('collectionId subscribe hit', nv);
    });

    self.launchId.subscribe(nv => {
        console.log('launchId subscribe hit', nv);
    });

    self.qualityId.subscribe(nv => {
        console.log('qualityId subscribe hit', nv);
    });

    self.supplierId.subscribe(nv => {
        console.log('supplierId subscribe hit', nv);
    });

    self.tradeAccount.subscribe(nv => {

        console.log("userDefinedFilters.tradeAccount subscribe hit", nv);

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

        self.salesMarketIds([]);
        self.salesMarkets([]);

        self.tradeAccountTypeId(EMPTY_STRING);
        self.tradeAccountType(undefined);

        self.salesRepresentativeId(EMPTY_STRING);
        self.salesRepresentative(undefined);

        self.salesAgentId(EMPTY_STRING);
        self.salesAgent(undefined);

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

        self.deliveryTypeId(EMPTY_STRING);
        self.deliveryType(undefined);

        self.orderTakerId(EMPTY_STRING);
        self.orderTaker(undefined);

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

        self.supplierId(EMPTY_STRING);
        self.supplier(undefined);

        self.productId(EMPTY_STRING);
        self.product(undefined);

        self.allocatedId(EMPTY_STRING);
        self.allocated(undefined);

        self.dataSourceId(EMPTY_STRING);
        self.dataSource(undefined);

        self.transactionTypeId(EMPTY_STRING);
        self.transactionType(undefined);
    }

    self.togglePinning = (data, event) => {
        self.sidebarElement.classList.toggle('pinned');
        event.target.closest('button') && event.target.closest('button').blur();
    }

    self.json = ko.computed(() => {
        if (self.allBound()) {
            let result = {
                marketId: self.salesMarketId() || null,
                marketIds: self.salesMarketIds(),
                tradeAccountTypeId: self.tradeAccountTypeId() || null,
                salesRepresentativeId: self.salesRepresentativeId() || null,
                salesAgentId: self.salesAgentId() || null,
                tradeAccountGroupId: self.tradeAccountGroupId() || null,
                tradeAccountId: self.tradeAccountId() || null,
                orderId: self.orderId() || null,
                startDate: self.fromDate() ? moment(self.fromDate()).format('YYYY/MM/DD') : null,
                endDate: self.toDate() ? moment(self.toDate()).format('YYYY/MM/DD') : null,
                haulierCode: self.haulierId() || null,
                deliveryType: self.deliveryTypeId() || null,
                orderTakerCode: self.orderTakerId() || null,
                productGroupId: self.productGroupId() || null,
                itemTypeId: self.itemTypeId() || null,
                brandId: self.brandId() || null,
                collectionId: self.collectionId() || null,
                launchId: self.launchId() || null,
                qualityId: self.qualityId() || null,
                supplierCode: self.supplierId() || null,
                productId: self.productId() || null,
                allocated: self.allocatedId() || null,
                dataSource: self.dataSourceId() || null,
                transactionTypeId: self.transactionTypeId() || null
            };

            //console.log("userDefinedFilters.json returning", result);

            return JSON.stringify(result);
        } else {
            console.log("userDefinedFilters.json returning", undefined);
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