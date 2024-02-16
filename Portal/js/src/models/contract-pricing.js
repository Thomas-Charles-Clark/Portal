const
    VIEW_MANAGE = 1,
    VIEW_RESTOCK = 2,
    VIEW_RECALL = 3,
    VIEW_ADD = 4

const contractPricingViewModel = ({ } = {}) => {
    let self = {};

    //#region Properties


    // impossible virtual scrolling property madness

    self.rowHeight = 50;

    self.scrollY = ko.observable(0);

    self.maxY = ko.observable(window.innerHeight);

    self.gridHeaderHeight = 56;

    self.gridTotalHeight = ko.observable();

    self.gridScrollBottomPadding = ko.observable(0);

    self.finalRowVisible = ko.observable(false);

    self.gridPositionTop = 206;

    ///

    self.busy = ko.observable(false);

    self.fetchDataBusy = ko.observable(false);

    self.view = ko.observable(VIEW_MANAGE);

    self.ready = ko.observable(true);

    //self.note = ko.observable();

    //self.notes = ko.observableArray([]);

    //self.noteBusy = ko.observable(false);

    //self.addingNoteToRecord = ko.observable();

    //self.noteParams = {
    //    label: 'New Note',
    //    enable: true,
    //    observable: self.note,
    //    rows: 3,
    //    useNativeValidation: false,
    //    decorateInputElement: true,
    //    insertValidationMessages: false,
    //    clearable: true,
    //    revertible: false,
    //    disable: ko.observable(false),
    //    enable: ko.observable(true),
    //    busy: false,
    //    clearFunction: function () {
    //        var self = this;
    //        self.observable(undefined);
    //        $(self.observable.DOMElement).focus();
    //    },
    //    charsRemainingOptions: {
    //        maxLength: 255
    //    }
    //}

    //#region Manage Grid

    // this is used to hold the results of the fetchDeals call
    self.tradeAccountContractJson = ko.observable();
    self.tradeAccountDealDetails = ko.observable();
     
    self.tradeAccountGroupContractJson = ko.observable();
    self.tradeAccountGroupDealDetails = ko.observable();

    self.selectedContractListId = ko.observable();

    self.selectedContractListJson = ko.observable();

    self.impactResults = ko.observableArray([]);

    self.haveImpactResults = ko.observable(false);

    //// this is used to hold the records we need to data fetch for those which the dataSource has deemed to be "in view"
    self.recordsToDataFetch = ko.observableArray([]);

    //// this holds those records which have been fleshed out by the fetchData results
    self.filledRecords = ko.observableArray([]);

    //// this lets us return the grid to where it was before "refresh" was called
    //// calling refresh is necessary following an endless scrolling paging event because we're grouping
    self.gridScrollRestoration = null;

    //#endregion

    //#region lifted functions


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

    // this led to madness don't do it
    //self.genericSelectSoleResult = (e, observable) => {

    //    //console.log(self.name, 'dropdown dataBound hit', e);
    //    var ds = e.sender.dataSource.data();
    //    if (ds.length == 1 && e.sender.value() != ds[0][e.sender.options.dataValueField]) {
    //        e.sender.value(ds[0][e.sender.options.dataValueField]);
    //    }
    //    if (ds.length == 0) {
    //        //console.log(self.valueField, 'is setting itself to null');
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
        }).catch((e) => {
            console.error(e);
        });
    }

    self.unsavedChanges = () => {
        return new Promise((resolve, reject) => {

            let array = [{
                unsavedChanges: () => false
            }];

            //switch (self.view()) {
            //    case VIEW_MANAGE:
            //        array = self.filledRecords.peek();
            //        break;
            //    case VIEW_ADD:
            //        array = self.addFilledRecords.peek();
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

    //#endregion


    //#endregion

    //#region Prefilters

    self.salesMarketId = ko.observable('');
    self.salesMarket = ko.observable();

    self.salesRepresentativeId = ko.observable('');
    self.salesRepresentative = ko.observable();

    self.existingContractsCode = ko.observable('');
    self.existingContracts = ko.observable();

    self.tradeAccountId = ko.observable('');
    self.tradeAccount = ko.observable();

    self.launchId = ko.observable(''); // if you don't initialise to '' you'll find that opening and immediately dismissing the associated dropdown
    self.launch = ko.observable(); // the above caveat appears to only apply to odata bound drop down lists

    self.brandId = ko.observable(''); // if you don't initialise to '' you'll find that opening and immediately dismissing the associated dropdown
    self.brand = ko.observable(); // the above caveat appears to only apply to odata bound drop down lists

    self.productGroupId = ko.observable('');
    self.productGroup = ko.observable();

    self.itemTypeId = ko.observable('');
    self.itemType = ko.observable();

    self.collectionId = ko.observable('');
    self.collection = ko.observable();

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

    //#endregion


    //#region Components

    // this governs the edit modal and all editing - fairly important
    self.contractPricingEditor = contractPricingEditor({
        parent: self
    });

    self.firstParamsRun = true;

    self.prefilterParams = ko.computed(() => {

        //console.trace();

        let props = {
            launchId: self.launchId(),
            brandId: self.brandId(),
            productGroupId: self.productGroupId(),
            itemTypeId: self.itemTypeId(),
            collectionId: self.collectionId(),
        };

        // because if I don't do this 
        if (self.searchTerm())
            props.searchTerm = self.searchTerm();

        // string based properties end up serialising "undefined" or "null" :\
        if (self.existingContractsCode())
            props.existingContractsCode = self.existingContractsCode();

        if (self.firstParamsRun) {
            self.firstParamsRun = false;
            return false;
        } else {

            self.fetchImpact();

            return props;
        }
    }, self).extend({
        rateLimit: {
            timeout: 50,
            method: 'notifyWhenChangesStop'
        }
    });

    self.salesMarketParams = kendoMDCDropDownList({
        label: 'Market',
        odata: true,
        endPoint: '/odata/SalesMarkets',
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
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear,
        //dataBound: function (e) {
        //    self.genericSelectSoleResult(e, self.salesMarketId)
        //},
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            if (self.tradeAccountId()) {
                d.$filter = `TradeAccounts/any(ta: ta/TradeAccountID eq ${self.tradeAccountId()})`
            }

            if (self.salesRepresentativeId()) {
                let f = `SalesRepresentative_SalesMarkets/any(sm: sm/SalesRepresentativeID eq ${self.salesRepresentativeId()})`;

                if (d.$filter) {
                    d.$filter = `${d.$filter} and ${f}`
                } else {
                    //Add filter by matching any reference containing value
                    d.$filter = f;
                }
            }

            return d;
        },
    });

    self.salesRepresentativeParams = kendoMDCDropDownList({
        label: 'Sales Representative',
        odata: true,
        endPoint: '/odata/SalesRepresentatives?$expand=SalesRepresentative_SalesMarkets',
        textField: 'Label',
        valueField: 'SalesRepresentativeID',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/SalesRepresentatives/Default.SalesRepresentativeValueMapper(salesRepresentativeId=${options.value})?$expand=SalesRepresentative_SalesMarkets`,
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
            dir: 'desc',
            field: 'SalesRepresentativeID'
        },
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear,
        //dataBound: function (e) {
        //    self.genericSelectSoleResult(e, self.salesRepresentativeId)
        //}, // this led to madness don't do it
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            if (self.tradeAccountId()) {
                d.$filter = `TradeAccounts/any(ta: ta/TradeAccountID eq ${self.tradeAccountId()})`
            }

            if (self.salesMarketId()) {
                let f = `SalesRepresentative_SalesMarkets/any(sm: sm/SalesMarketID eq ${self.salesMarketId()})`;

                if (d.$filter) {
                    d.$filter = `${d.$filter} and ${f}`;
                } else {
                    //Add filter by matching any reference containing value
                    d.$filter = f;
                }
            }

            return d;
        },
    });

    self.existingContractsParams = kendoMDCDropDownList({
        label: 'Existing Contracts',
        data: [{
            Name: "Yes",
            Value: "Yes"
        }, {
            Name: "No",
            Value: "No"
        }, {
            Name: "Potato",
            Value: "Potato"
        }],
        textField: 'Name',
        valueField: 'Value',
        virtual: false,
        idObservable: self.existingContractsCode,
        objObservable: self.existingContracts,
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

    self.tradeAccountParams = kendoMDCDropDownList({
        label: 'Trade Account',
        odata: true,
        endPoint: '/odata/TradeAccounts?$expand=TradePriceList',
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
        select: self.genericUnsavedChangesSelect,
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

            if (self.salesMarketId()) {
                //Add filter by matching any reference containing value
                d.$filter = `SalesMarketID eq ${self.salesMarketId()}`;
            }

            if (self.salesRepresentativeId()) {
                if (d.$filter) {
                    d.$filter = `${d.$filter} and SalesRepresentativeID eq ${self.salesRepresentativeId()}`;
                } else {
                    d.$filter = `SalesRepresentativeID eq ${self.salesRepresentativeId()}`;
                }
            }

            return d;
        },
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

    self.productGroupParams = kendoMDCDropDownList({
        label: 'Product Group',
        odata: true,
        endPoint: '/odata/ProductGroups/Default.GetProductGroupsForContractPricing',
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
        }
    });

    self.itemTypeParams = kendoMDCDropDownList({
        label: 'Item Type',
        odata: true,
        endPoint: '/odata/ItemTypes/Default.GetItemTypesForContractPricing?$expand=ContractProductRestrictions',
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
        clearFunction: self.genericUnsavedChangesClear
    });

    self.searchTermParams = {
        label: "Search by Quality or Product",
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

    self.tradeAccountId.subscribe(nv => {
        //console.trace();
        if (nv == '') {
            self.reset();
        }
    });

    //#endregion


    //#region Methods

    self.fetchImpact = (selection, event) => {

        // this code block only to be executed if method is called as a result of user interaction
        // e.g. selecting a date range
        if (selection && event) {
            //console.log('fetchImpact', selection, event);

            let returnEarly = false;

            /*
    
            This could become a bit confusing but if we talk it through we'll massively successfulness it.
            We're clicking on buttons which toggle the expansion of collapsible panels.
            We can then click on buttons within those which steals "selected" away from the button previously clicked.
            If we click on an expandy button which is not yet selected, select it. ✔
            If we click on an expandy button which is already selected, deselect it. ✔
            If we click on an expandy button, then click on a button within it, deselect the expandy button and select the clicked thing. ✔
    
            If we click on an expandy button which is not selected but whose contents are revealed...
                the accordion wants to collapse the expandy bit
                the selector wants to select the thing
                and we end up in a confusing state.
                What we should actually do is just deselect and collapse.
    
            Only bloody done it, haven't we!
    
            */


            // because we don't want to allow selection if this is the case, but we don't want to CLEAR selection
            // as is the case when we set returnEarly = true;
            if (selection.hasOwnProperty('contracts') && selection.contracts.length === 0) {
                self.busy(false);
                return;
            }

            if (event.currentTarget.classList.contains('selected')) {
                returnEarly = true;
            } else {
                if (self.selectedContractListId() != null &&
                    (event.currentTarget.classList.contains('accordion-button')) &&
                    (event.currentTarget.classList.contains('collapsed'))) {
                    //(event.currentTarget.parentNode.parentNode.querySelector('.accordion-collapse').classList.contains('show'))) {
                    returnEarly = true;
                }
            }

            if (returnEarly) {
                self.selectedContractListId(undefined);
                self.impactResults([]);
                self.haveImpactResults(false);
                self.busy(false);

                return false;
            }

            let contractListId = null;

            let contractDiscountTradeAccountGroupIds = [];
            let contractPriceTradeAccountGroupIds = [];
            let contractDiscountTradeAccountIds = [];
            let contractPriceTradeAccountIds = [];

            if (selection.hasOwnProperty('contractLevels')) {
                contractListId = `contract-levels-${selection.contractLevels.flatMap(function (cl) { return cl.contracts.flatMap(function (c) { return c.contractListId }) }).reduce(function (a, i) { return a = a + i }, 0)}`;

                contractDiscountTradeAccountGroupIds = selection.contractLevels.flatMap(cl => cl.contracts.flatMap(c => c.hasOwnProperty('contractDiscountTradeAccountGroupId') ? [c.contractDiscountTradeAccountGroupId] : []));

                contractPriceTradeAccountGroupIds = selection.contractLevels.flatMap(cl => cl.contracts.flatMap(c => c.hasOwnProperty('contractPriceTradeAccountGroupId') ? [c.contractPriceTradeAccountGroupId] : []));

                contractDiscountTradeAccountIds = selection.contractLevels.flatMap(cl => cl.contracts.flatMap(c => c.hasOwnProperty('contractDiscountTradeAccountId') ? [c.contractDiscountTradeAccountId] : []));

                contractPriceTradeAccountIds = selection.contractLevels.flatMap(cl => cl.contracts.flatMap(c => c.hasOwnProperty('contractPriceTradeAccountId') ? [c.contractPriceTradeAccountId] : []));

            } else if (selection.hasOwnProperty('contracts')) {
                contractListId = `contracts-${selection.contracts.flatMap(function (c) { return c.contractListId }).reduce(function (a, i) { return a = a + i }, 0)}`;

                contractDiscountTradeAccountGroupIds = selection.contracts.flatMap(c => c.hasOwnProperty('contractDiscountTradeAccountGroupId') ? [c.contractDiscountTradeAccountGroupId] : []);

                contractPriceTradeAccountGroupIds = selection.contracts.flatMap(c => c.hasOwnProperty('contractPriceTradeAccountGroupId') ? [c.contractPriceTradeAccountGroupId] : []);

                contractDiscountTradeAccountIds = selection.contracts.flatMap(c => c.hasOwnProperty('contractDiscountTradeAccountId') ? [c.contractDiscountTradeAccountId] : []);

                contractPriceTradeAccountIds = selection.contracts.flatMap(c => c.hasOwnProperty('contractPriceTradeAccountId') ? [c.contractPriceTradeAccountId] : []);

            } else if (selection.hasOwnProperty('contractListId')) {
                contractListId = selection.contractListId;

                if (selection.hasOwnProperty('contractDiscountTradeAccountGroupId')) {
                    contractDiscountTradeAccountGroupIds.push(selection.contractDiscountTradeAccountGroupId);
                }

                if (selection.hasOwnProperty('contractPriceTradeAccountGroupId')) {
                    contractPriceTradeAccountGroupIds.push(selection.contractPriceTradeAccountGroupId);
                }

                if (selection.hasOwnProperty('contractDiscountTradeAccountId')) {
                    contractDiscountTradeAccountIds.push(selection.contractDiscountTradeAccountId);
                }

                if (selection.hasOwnProperty('contractPriceTradeAccountId')) {
                    contractPriceTradeAccountIds.push(selection.contractPriceTradeAccountId);
                }
            }

            self.selectedContractListId(contractListId);
            self.selectedContractListJson(JSON.stringify({
                contractDiscountTradeAccountGroupId: contractDiscountTradeAccountGroupIds,
                contractPriceTradeAccountGroupId: contractPriceTradeAccountGroupIds,
                contractDiscountTradeAccountId: contractDiscountTradeAccountIds,
                contractPriceTradeAccountId: contractPriceTradeAccountIds
            }));
        } else if (self.selectedContractListJson() == null) {
            return;
        }

        self.busy(true);

        let data = {
            tradeAccountId: self.tradeAccountId(),
            contractListJson: self.selectedContractListJson(),
            launchId: self.launchId(),
            brandId: self.brandId(),
            productGroupId: self.productGroupId(),
            itemTypeId: self.itemTypeId(),
            collectionId: self.collectionId()
        };

        if (self.searchTerm()) {
            data.searchTerm = self.searchTerm();
        }

        self.impactResults([]);

        self.filledRecords([]);

        self.haveImpactResults(false);

        console.log('fetchImpact calling with', data);

        fetch(`/api/contractPricing/FetchImpact`, {
            method: 'POST',
            headers: window.fetchHeaders,
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log('fetchImpact returned', data);

                //if (data.Results.length === 0)
                self.clearBusy();

                if (data.Results.length > 0)
                    self.haveImpactResults(true);

                // the height of the table's thead element
                let startingOffset = self.gridPositionTop + self.gridHeaderHeight;

                // we can only really do this if we're working with *exact* known heights.
                // otherwise all bets are off.
                // therefore let us achieve the knowing of the heights.
                let additionalOffset = startingOffset;

                let cumulativeHeight = 0;

                let results = data.Results.map((impactResult, impactResultIndex) => {

                    impactResult.offsetY = (((impactResultIndex) * self.rowHeight) + additionalOffset);

                    //console.log(impactResult.offsetY);

                    cumulativeHeight += self.rowHeight;

                    impactResult.runningHeight = cumulativeHeight;

                    return impactSearchResult({
                        rec: impactResult
                    });
                });

                self.gridTotalHeight(cumulativeHeight - self.rowHeight - 1);

                self.impactResults(results);

            })
            .catch(err => {
                self.clearBusy();
                window.catchFetchError(err);
            });

        return true;
    }

    self.setBusy = () => {
        //switch (self.view()) {
        //    case VIEW_MANAGE:
        //        self.manageBusy(true);
        //        break;
        //    case VIEW_ADD:
        //        self.addBusy(true);
        //        break;
        //    case VIEW_RESTOCK:
        //        self.restockBusy(true);
        //        break;
        //    case VIEW_RECALL:
        //        self.recallBusy(true);
        //        break;
        //    default:
        //        break;
        //}
        self.busy(true);
    }

    self.clearBusy = () => {
        //switch (self.view()) {
        //    case VIEW_MANAGE:
        //        self.manageBusy(false);
        //        break;
        //    case VIEW_ADD:
        //        self.addBusy(false);
        //        break;
        //    case VIEW_RESTOCK:
        //        self.restockBusy(false);
        //        break;
        //    case VIEW_RECALL:
        //        self.recallBusy(false);
        //        break;
        //    default:
        //        break;
        //}
        self.busy(false);
    }

    self.saveChanges = () => {
        //if (self.currentDeals().find(p => p.unsavedChanges())) {
        //    self.setBusy();

        //    let products = self.currentDeals().filter(p => p.unsavedChanges());

        //    products.forEach(p => {
        //        p.preSave();
        //    });

        //    let params = {
        //        products: products.map(p => p.toJS())
        //    };

        //    /// fetch, do something, etc...

        //    products.forEach(p => {
        //        p.postSave(false);
        //    });

        //    //fetch('/api/rangeManagementApi/UpsertRange', {
        //    //    method: 'POST',
        //    //    headers: window.fetchHeaders,
        //    //    body: JSON.stringify(params)
        //    //})
        //    //    .then(window.handleFetchResponse)
        //    //    .then(data => {
        //    //        //window.showInfo("Success", "Your changes have been saved!");

        //    //        products.forEach(p => {
        //    //            p.postSave(true);
        //    //        });

        //    //        self.clearBusy();
        //    //    })
        //    //    .catch(err => {
        //    //        products.forEach(p => {
        //    //            p.postSave(false);
        //    //        });

        //    //        self.clearBusy();
        //    //        window.catchFetchError(err);
        //    //    });
        //} else {
        //    window.showInfo("Information", "You have no unsaved changes.");
        //}
    }

    self.reloadRecord = (rec) => {
        self.recordsToDataFetch.push(rec);
    }

    self.reset = () => {
        self.tradeAccountDealDetails(undefined);

        self.tradeAccountGroupDealDetails(undefined);

        self.selectedContractListId(undefined);

        self.tradeAccountContrcatJson(undefined);

        self.tradeAccountGroupContrcatJson(undefined);

        self.selectedContractListJson(undefined);

        self.impactResults([]);

        self.haveImpactResults(false);

        self.recordsToDataFetch([]);

        self.filledRecords([]);
    }

    self.editContractPrice = (dateRangeRecord, event) => {
        self.contractPricingEditor.load(dateRangeRecord);
        event.preventDefault();
    }

    //#endregion


    //#region Computeds

    self.impactVisible = ko.computed(() => {
        //console.trace();
        return self.tradeAccount() != null;
    }, self);

    self.allDateRanges = ko.computed(() => {
        //console.trace();
        let account = self.tradeAccountDealDetails();
        let group = self.tradeAccountGroupDealDetails();
        let results = [];
        if (account && account.dateRanges.length)
            results.push(account.dateRanges);
        if (group && group.dateRanges.length)
            results.push(group.dateRanges);
        return results.flatMap(r => r);
    }, self);

    self.allContracts = ko.computed(() => {
        //console.trace();
        return self.allDateRanges().flatMap(d => d.contractLevels.flatMap(cl => cl.contracts.flatMap(c => c)));
    }, self);

    self.fetchDeals = ko.computed(() => {
        //console.trace();

        if (self.filledRecords.peek().length)
            self.filledRecords([]);

        if (self.recordsToDataFetch.peek().length)
            self.recordsToDataFetch([]);

        //self.clearAddGridData();

        if (self.tradeAccountId()) {
            //window.scrollTo({ top: 0, left: 0, behavior: "instant" });

            self.setBusy();

            let data = {
                tradeAccountId: self.tradeAccountId()
            };

            self.tradeAccountDealDetails(undefined);
            self.tradeAccountGroupDealDetails(undefined);

            let qs = new URLSearchParams(data);

            console.log('fetchDeals calling with', data);

            fetch(`/api/contractPricing/FetchDeals?${qs}`, {
                method: 'GET',
                headers: window.fetchHeaders
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    console.log('fetchDeals returned', data);

                    //if (data.Results.length === 0)
                    self.clearBusy();

                    if (data.TradeAccountContractJSON) {
                        // we want to grab a copy of this...
                        self.tradeAccountContractJson(data.TradeAccountContractJSON);
                        let parsedResult = JSON.parse(data.TradeAccountContractJSON);
                        parsedResult.dateRanges = parsedResult.dateRanges.map(dr => dateRangeRecord({
                            rec: dr,
                            allContractsComputed: self.allContracts
                        }));
                        self.tradeAccountDealDetails(Object.assign(parsedResult, {
                            accordionId: 'account-date-ranges'
                        }));
                    }

                    if (data.TradeAccountGroupContractJSON) {
                        self.tradeAccountGroupContractJSON(data.TradeAccountContractJSON);
                        let parsedResult = JSON.parse(data.TradeAccountGroupContractJSON);
                        parsedResult.dateRanges = parsedResult.dateRanges.map(dr => dateRangeRecord({
                            rec: dr,
                            allContractsComputed: self.allContracts
                        }));

                        self.tradeAccountGroupDealDetails(Object.assign(parsedResult, {
                            accordionId: 'group-date-ranges'
                        }));
                    }

                    window.setTimeout(() => {
                        let popoverTriggerList = [].slice.call(document.querySelectorAll('.overrides[data-bs-toggle="popover"]'))
                        let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
                            return new bootstrap.Popover(popoverTriggerEl, {
                                html: true,
                                content: popoverTriggerEl.closest('td').querySelector(".pop-content-overrides").innerHTML,
                                container: popoverTriggerEl
                            })
                        })

                        popoverTriggerList = [].slice.call(document.querySelectorAll('.conflicts[data-bs-toggle="popover"]'))
                        popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
                            return new bootstrap.Popover(popoverTriggerEl, {
                                html: true,
                                content: popoverTriggerEl.closest('td').querySelector(".pop-content-conflicts").innerHTML,
                                container: popoverTriggerEl
                            })
                        });
                    }, 0);

                })
                .catch(err => {
                    self.clearBusy();
                    window.catchFetchError(err);
                });
        }
    }, self);

    self.unfilledRecords = ko.computed(() => {
        //console.trace();
        let results = [...new Set(self.recordsToDataFetch().filter(vr => {
            let r = self.filledRecords().find(fr =>
                fr.ProductOrQuality == vr.ProductOrQuality &&
                fr.ProductID == vr.ProductID &&
                fr.QualityID == vr.QualityID
            );
            return (r == null || r && r.loaded() == false);
        }).map((cr) => {
            return {
                productId: cr.ProductID,
                qualityId: cr.QualityID,
                productOrQuality: cr.ProductOrQuality
            }
        }))];
        return results;
    }, self).extend({
        rateLimit: {
            timeout: 100,
            method: "notifyWhenChangesStop"
        }
    });

    self.fetchSalesData = ko.computed(() => {
        //console.trace();

        let urpids = self.unfilledRecords();

        console.log(`self.unfilledRecords()`, urpids);

        if (urpids.length) {

            window.setTimeout(() => {

                let callStart = new Date();

                let productIds = [...new Set(urpids.flatMap(ur => ur.productId ? [ur.productId] : []))];
                let qualityIds = [...new Set(urpids.flatMap(ur => ur.qualityId ? [ur.qualityId] : []))];

                let data = {
                    tradeAccountId: self.tradeAccountId(),
                    productId: productIds,
                    qualityId: qualityIds
                };

                console.log('fetchSalesData calling with', data);

                fetch(`/api/contractpricing/FetchSalesData`, {
                    method: 'POST',
                    headers: window.fetchHeaders,
                    body: JSON.stringify(data)
                })
                    .then(window.handleFetchResponse)
                    .then(data => {

                        let callReturn = new Date();

                        console.log(`FetchSalesData returned in ${callReturn - callStart}ms`, data);

                        let records = self.impactResults.peek();
                        let affectedRecords = [];
                        let filledRecords = self.filledRecords.peek();
                        let forcedRemovals = [];

                        urpids.forEach(stub => {

                            //console.log(stub);

                            let record = records.find(p => p.ProductID && p.ProductID === stub.productId) ||
                                records.find(q => q.QualityID && q.QualityID == stub.qualityId);
                            // if record is null here, we've fetched data for something which is no longer amongst our search results.
                            // this will readily cause chaos: remove it from the 'to be fetched' collection.

                            if (record != null) {

                                //console.log('record found');

                                let dataResult = data.ProductResults.find(p => p.ProductID && p.ProductID == stub.productId) ||
                                    data.QualityResults.find(q => q.QualityID == stub.qualityId);

                                let filledRecord = filledRecords.find(p => p.ProductID && p.ProductID == stub.productId) ||
                                    filledRecords.find(q => q.QualityID && q.QualityID == stub.qualityId);

                                let add = filledRecord == null;

                                if (dataResult) {

                                    if (filledRecord == null) {
                                        filledRecord = record;
                                        //record = impactSearchResult({
                                        //    rec: record
                                        //});
                                    } else {
                                        add = false;
                                        filledRecord.loaded(true);
                                        record = filledRecord;
                                    }

                                    record.salesQuantity(dataResult.SalesQuantity_180Days);

                                    record.salesValue(dataResult.SalesValue_180Days);

                                    record.busy(false);

                                    record.loaded(true);
                                } else {
                                    record.loaded = ko.observable(true);
                                    record.ErrorMessage = `<h5 class="mb-0">[portal].[ContractManagement_SalesData_Select] did not return a result for Product/Quality ${record.ProductID || record.QualityID}</h5>`;
                                }

                                if (add) {
                                    affectedRecords.push(record);
                                }
                            } else {

                                console.log('RECORD NOT FOUND');

                                forcedRemovals.push(stub);
                            }
                        });

                        ko.ignoreDependencies(() => {
                            affectedRecords.forEach(ar => {
                                self.recordsToDataFetch.remove(rtdf => rtdf.ProductOrQuality == ar.productOrQuality &&
                                    rtdf.ProductID === ar.productId &&
                                    rtdf.QualityID === ar.qualityId);
                            });

                            forcedRemovals.forEach(fr => {
                                self.recordsToDataFetch.remove(rtdf => rtdf.ProductOrQuality == fr.productOrQuality &&
                                    rtdf.ProductID === fr.productId &&
                                    rtdf.QualityID === fr.qualityId);
                            })

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

    self.finalRowObservationComputer = ko.computed(() => {
        //console.trace();

        if (self.haveImpactResults()) {

            window.setTimeout(() => {
                document.querySelectorAll("#impact-table-all .final-row").forEach(tr => {
                    if (tr)
                        self.intersectionObserver.observe(tr);
                })
            }, 0);

        } else {

            self.gridTotalHeight(0);

        }

    }, self);

    self.visibleItems = ko.computed(() => {
        //console.trace();

        let toFetch = [];

        let alreadyFetching = self.recordsToDataFetch.peek();

        let filledRecords = self.filledRecords.peek();

        let results = self.impactResults().filter((i, index) => {

            //if (index < 50 && i.offsetY) {
            //    console.log(`((${i.offsetY} - ${self.gridHeaderHeight} + ${self.rowHeight}) >= (${self.scrollY()})) && ((${i.offsetY} - ${self.gridHeaderHeight} + ${self.rowHeight}) <= (${self.maxY()}))`)
            //    console.log(`((${i.offsetY - self.gridHeaderHeight + self.rowHeight}) >= (${self.scrollY()})) && ((${i.offsetY - self.gridHeaderHeight + self.rowHeight}) <= (${self.maxY()}))`)
            //}

            let actuallyVisible = ((i.offsetY - self.gridHeaderHeight + self.rowHeight) >= (self.scrollY())) &&
                ((i.offsetY - self.gridHeaderHeight + self.rowHeight) <= (self.maxY()));

            //console.log(actuallyVisible);

            let dataFetchVisible = actuallyVisible;// ((i.offsetY - self.gridHeaderHeight + self.rowHeight) >= (self.scrollY() - 5000)) &&
            // ((i.offsetY - self.gridHeaderHeight + self.rowHeight) <= (self.maxY() + 5000));

            if (dataFetchVisible && !filledRecords.find(fr =>
                fr.ProductOrQuality == i.ProductOrQuality &&
                fr.ProductID == i.ProductID &&
                fr.QualityID == i.QualityID
            ) && !alreadyFetching.find(fr =>
                fr.ProductOrQuality == i.ProductOrQuality &&
                fr.ProductID == i.ProductID &&
                fr.QualityID == i.QualityID
            )) {
                toFetch.push(i);
            }

            return actuallyVisible;
        });

        ko.utils.arrayPushAll(self.recordsToDataFetch, toFetch);

        return results;
    });

    self.gridScrollTopPadding = ko.computed(() => {
        //console.trace();

        let scrollY = self.scrollY();
        let scrollYPlusHeaderHeight = scrollY + self.gridHeaderHeight;
        let result = 0;

        self.impactResults().forEach(ir => {
            if (scrollY > ir.runningHeight) {
                result += self.rowHeight;
            }
        });

        return result;
    }, self);

    self.gridScrollBottomPadding = ko.computed(() => {
        //console.trace();
        if (self.finalRowVisible()) {
            return 0;
        } else {
            return self.gridTotalHeight() - self.gridScrollTopPadding() - self.gridHeaderHeight - self.gridPositionTop;
        }
    }, self);

    //#endregion


    //#region Events

    //document.getElementById("range-tab-btn").addEventListener('show.bs.tab', (e) => {

    //    if (self.view() != VIEW_MANAGE) {
    //        e.preventDefault();
    //        self.branchCheck({
    //            dataItem: {
    //                BranchID: self.branchId()
    //            }
    //        }, (e) => {

    //            self.view(VIEW_MANAGE);

    //            bootstrap.Tab.getOrCreateInstance(document.getElementById("range-tab-btn")).show();
    //        });
    //    }
    //});

    //document.getElementById("add-to-range-btn").addEventListener('show.bs.tab', (e) => {

    //    if (self.view() != VIEW_ADD) {
    //        e.preventDefault();
    //        self.branchCheck({
    //            dataItem: {
    //                BranchID: self.branchId()
    //            }
    //        }, (e) => {

    //            self.view(VIEW_ADD);

    //            bootstrap.Tab.getOrCreateInstance(document.getElementById("add-to-range-btn")).show();
    //        });
    //    }
    //});

    //document.getElementById("restock-tab-btn").addEventListener('show.bs.tab', (e) => {
    //    if (self.view() != VIEW_RESTOCK) {
    //        e.preventDefault();
    //        self.branchCheck({
    //            dataItem: {
    //                BranchID: self.branchId()
    //            }
    //        }, (e) => {
    //            self.view(VIEW_RESTOCK);
    //            self.transferOrdersWH2BRGridSettings.widget().dataSource.read();
    //            bootstrap.Tab.getOrCreateInstance(document.getElementById("restock-tab-btn")).show();
    //        });
    //    }
    //});

    //document.getElementById("recall-tab-btn").addEventListener('show.bs.tab', (e) => {
    //    if (self.view() != VIEW_RECALL) {
    //        e.preventDefault();
    //        self.branchCheck({
    //            dataItem: {
    //                BranchID: self.branchId()
    //            }
    //        }, (e) => {
    //            self.view(VIEW_RECALL);
    //            self.transferOrdersBR2WHGridSettings.widget().dataSource.read();
    //            bootstrap.Tab.getOrCreateInstance(document.getElementById("recall-tab-btn")).show();
    //        });
    //    }
    //});

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
        //if (self.finalRowVisible()) {
        //    self.finalRowVisible(false);
        //}
        if (window.scrollY < self.scrollY()) {
            self.maxY(self.scrollY() + window.innerHeight);
        }
        //} else {
        //    self.maxY(self.scrollY() + window.innerHeight);
        //}
    }, 50));

    window.addEventListener("onbeforeunload", (event) => {
        self.checkUnsavedChangesThenSelect = async (event) => {
            await self.unsavedChanges().then((d) => {

            }).catch((e) => { });
        }
    });

    //#endregion

    return self;
};

const dateRangeRecord = ({
    rec,
    allContractsComputed
} = {
        rec: null,
        allContractsComputed: () => []
    }) => {
    let self = Object.assign({}, rec);

    //#region Properties

    self.contractLevels = self.contractLevels.map(cl => contractLevelRecord({
        rec: cl,
        allContractsComputed: allContractsComputed
    }));

    //#endregion

    //#region Computeds



    //#endregion

    //#region Methods



    //#endregion

    return self;
}

const contractLevelRecord = ({
    rec,
    allContractsComputed
} = {
        rec: null,
        allContractsComputed: () => []
    }) => {
    let self = Object.assign({}, rec);

    //#region Properties

    self.allContractsComputed = allContractsComputed;

    self.contracts = self.contracts.map(c => contractRecord({
        rec: c,
        allContractsComputed: allContractsComputed
    }));

    //#endregion

    //#region Computeds



    //#endregion

    //#region Methods



    //#endregion

    return self;
}

const contractRecord = ({
    rec,
    allContractsComputed
} = {
        rec: null,
        allContractsComputed: () => []
    }) => {
    let self = Object.assign({}, rec);

    //#region Properties

    self._conflicts = self.conflicts || [];

    self._overrides = self.overrides || [];

    self.element = ko.observable();

    //#endregion

    //#region Computeds

    self.allContractsComputed = allContractsComputed;

    self.conflicts = ko.computed(() => {
        //console.trace();
        let allContracts = self.allContractsComputed();
        return (self._conflicts ?? []).map(cf => {
            return allContracts.find(c => c.contractListId == cf.ConflictContractListID);
        })
    }, self);

    self.overrides = ko.computed(() => {
        //console.trace();
        let allContracts = self.allContractsComputed();
        return (self._overrides ?? []).map(ov => {
            return allContracts.find(c => c.contractListId == ov.OverrideContractListID);
        })
    }, self);

    //#endregion

    //#region Methods



    //#endregion

    return self;
}

const impactSearchResult = ({
    rec
} = {
        rec: null
    }) => {
    let self = Object.assign({}, rec);

    //#region Properties

    self.busy = ko.observable(false);

    self.loaded = ko.observable(false);

    self.salesQuantity = ko.observable();

    self.salesValue = ko.observable();

    //#endregion

    //#region Computeds



    //#endregion

    //#region Methods



    //#endregion

    return self;
}

const dateRangeEditor = ({ parent } = { parent: null }) => {
    let self = {};

    //#region Properties

    self.busy = ko.observable(false);

    self.startDate = ko.observable(startDate);

    self.endDate = ko.observable(endDate);

    /*
    
        <td>
            <div data-bind="component: { name: 'tempus-dominus-date-picker-component', params: startDateParams }"></div>
        </td>
        <td>
            <div data-bind="component: { name: 'tempus-dominus-date-picker-component', params: endDateParams }"></div>
        </td>
    
    */

    //#endregion

    //#region Components

    self.startDateParams = {
        observable: self.startDate,
        originalValue: self.startDate(),
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
                //cellSize: '4rem'
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
            self.startDate(undefined);
        },
        revertible: ko.observable(true),
        revertFunction: () => {
            self.startDateParams.observable(self.startDateParams.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true
    };

    self.endDateParams = {
        observable: self.endDate,
        originalValue: self.endDate(),
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
                //cellSize: '4rem'
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
            self.endDate(undefined);
        },
        revertible: ko.observable(true),
        revertFunction: () => {
            self.endDateParams.observable(self.endDateParams.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true
    };

    //#endregion

    //#region Computeds



    //#endregion

    //#region Subscriptions

    self.startDate.subscribe(nv => {
        //console.trace();
        if (nv) {
            if (self.endDate() && +self.endDate() < nv) {
                self.endDate(undefined);
            }

            console.error("you had to add one to minDate");
            self.endDate.tempusDominus.updateOptions({
                restrictions: {
                    minDate: nv
                }
            });
        }
    });

    self.endDate.subscribe(nv => {
        //console.trace();
        if (nv) {
            if (self.startDate() && +self.startDate() > nv) {
                self.startDate(undefined);
            }

            console.error("you had to subtract one from maxDate");
            self.startDate.tempusDominus.updateOptions({
                restrictions: {
                    maxDate: nv
                }
            });
        }
    });

    //#endregion

    //#region Methods

    if (self.startDate()) {
        self.endDateParams.dateTimePickerOptions.restrictions.minDate = self.startDate();
    }

    if (self.endDate()) {
        self.startDateParams.dateTimePickerOptions.restrictions.maxDate = self.endDate();
    }

    //#endregion

    return self;
}

const contractPricingEditor = ({
    parent
} = {
    parent: null
}) => {
    let self = {};

    console.warn("The contractPricingEditor needs to reset between invocations");
    console.warn("The contractPricingEditor needs to be able to load details of the selected date range deals");
    console.warn("Need the ability to CRUD date ranges (separately from the pricing editor modal)");

    //#region Properties

    self.parent = parent;

    self.busy = ko.observable(false);

    self.editingRecord = ko.observable();

    self.loadedJson = ko.observable();

    //#endregion

    //#region Components

    self.modalElement = document.getElementById("contract-pricing-modal");

    self.modal = bootstrap.Modal.getOrCreateInstance(self.modalElement);

    self.productGroupItemTypeEditor = productGroupItemTypeEditor({});

    self.qualityEditor = qualityEditor({
        tradeAccountId: self.parent.tradeAccountId,
        virtualScrollerContainer: document.getElementById("quality-results-scroller-container")
    });

    self.productEditor = qualityEditor({
        tradeAccountId: self.parent.tradeAccountId,
        virtualScrollerContainer: document.getElementById("product-results-scroller-container")
    });

    //#region Product specific changes to qualityEditor

    self.productEditor.setAllModalElement = document.querySelector("#product-discounter-set-all-modal");

    self.productEditor.setAllModal = bootstrap.Modal.getOrCreateInstance(self.productEditor.setAllModalElement);

    self.productEditor.virtualScroller.primaryFetchEndpoint = "/api/contractPricing/ProductSearch";

    self.productEditor.virtualScroller.primaryFetchResultFn = (rec) => {
        rec = Object.assign({
            checked: (self.productEditor.selectedQualityIds().find(qid => qid == rec.QualityID)),
            validateNow: self.productEditor.validateNow
        }, rec);
        return qualityRecord(rec);
    };

    self.productEditor.virtualScroller.secondaryFetchQueueRecordId = "ProductID";

    self.productEditor.virtualScroller.secondaryFetchResultSetName = "ProductResults",

    self.productEditor.virtualScroller.secondaryFetchParams = function(unfilledRecords) {

        let productIds = [...new Set(unfilledRecords.flatMap(ur => ur.ProductID ? [ur.ProductID] : []))];

        let data = {
            tradeAccountId: self.productEditor.tradeAccountId(),
            productId: productIds,
            qualityId: []
        };

        return data;
    };

    self.productEditor.toggleSelection = (qualityRecord) => {
        let extant = self.productEditor.selectedQualityIds().find(qid => qid === qualityRecord.ProductID);

        if (extant) {
            self.productEditor.selectedQualityIds.remove(qualityRecord.ProductID);
            self.productEditor.selectedQualities.remove(q => q.ProductID == qualityRecord.ProductID);
        } else {
            self.productEditor.selectedQualityIds.push(qualityRecord.ProductID);
            self.productEditor.selectedQualities.push(qualityRecord);
        }
    }

    //#endregion

    self.errorables = ko.observableArray();

    self.errors = ko.validation.group(self.errorables, {
        live: true
    });

    //#endregion

    //#region Computeds

    self.errorableComputer = ko.computed(() => {
        //console.trace();
        let pgitee = self.productGroupItemTypeEditor.errorables();
        let qee = self.qualityEditor.errorables();
        let pee = self.productEditor.errorables();

        self.errorables(pgitee.concat(qee).concat(pee));
    }, self);

    self.modalTitle = ko.computed(() => {
        //console.trace();
        return `<span class="me-5">${self.parent.tradeAccount() && self.parent.tradeAccount().ShortLabel}</span><span>${self.editingRecord() && self.editingRecord().label}</span>`;
    }, self);

    self.unsavedChanges = ko.computed(() => {
        //console.trace();
        return self.loadedJson() && self.loadedJson() != self.toJson();
    }, self);

    //#endregion

    //#region Methods

    self.showModal = (record) => {
        self.modal.show();
    }

    self.hideModal = () => {
        self.modal.hide();
    }

    self.load = (dateRangeRecord) => {
        //console.trace(dateRangeRecord);

        if (dateRangeRecord == null) {
            throw "cannot load a null dateRangeRecord";
        } else {
            self.busy(true);

            self.editingRecord(dateRangeRecord);

            self.showModal();

            window.setTimeout(() => {
                self.busy(false);
            }, 1000);
        }
    }

    self.save = () => {
        self.productGroupItemTypeEditor.validateNow(true);
        self.qualityEditor.validateNow(true);
        self.productEditor.validateNow(true);

        window.setTimeout(() => {
            if (self.errors().length) {
                self.errors.showAllMessages(true);
                self.errors.filter(x => {
                    x.isValid.notifySubscribers(x.isValid())
                });
            } else {
                window.showInfo("Save", "Validation passed, go ahead and save...");
            }
        }, 0);
    }

    self.reset = () => {

        self.loadedJson(undefined);

        self.editingRecord(undefined);

        self.busy(false);
    }

    self.toJson = () => {

    }

    //#endregion

    return self;
}

const productGroupItemTypeEditor = ({

} = {
    
    }) => {

    let self = {};

    //#region Properties

    self.validateNow = ko.observable(false);

    self.brands = getBrands();

    self.contractProductRestrictions = getContractProductRestrictions();

    self.productGroupAllFabric = productGroupItemType({
        label: "Fabric",
        productGroupId: 8,
        productGroupCode: 'FA',
        itemTypeId: null,
        itemTypeCode: null,
        finalPrice: null,
        discountPercentage: null,
        status: null,
        permitMonetary: false,
        validateNow: self.validateNow
    });

    self.productGroupAllWallpaper = productGroupItemType({
        label: "Wallpaper",
        productGroupId: 16,
        productGroupCode: 'PA',
        itemTypeId: null,
        itemTypeCode: null,
        finalPrice: null,
        discountPercentage: null,
        status: null,
        permitMonetary: false,
        validateNow: self.validateNow
    });

    self.productGroupAllPatternBooks = productGroupItemType({
        label: "Pattern Books",
        productGroupId: 17,
        productGroupCode: 'PB',
        itemTypeId: null,
        itemTypeCode: null,
        finalPrice: null,
        discountPercentage: null,
        status: null,
        permitMonetary: false,
        validateNow: self.validateNow
    });

    self.productGroupAllRugs = productGroupItemType({
        label: "Rugs",
        productGroupId: 27,
        productGroupCode: 'RG',
        itemTypeId: null,
        itemTypeCode: null,
        finalPrice: null,
        discountPercentage: null,
        status: null,
        permitMonetary: false,
        validateNow: self.validateNow
    });

    self.itemTypes = self.contractProductRestrictions.filter(cpr => cpr.ProductGroupID != null && cpr.ItemTypeID != null).map(cpr =>
        productGroupItemType({
            label: `${cpr.ItemType?.Name}`,
            productGroupId: cpr.ProductGroupID,
            productGroup: cpr.ProductGroup,
            itemTypeId: cpr.ItemTypeID,
            itemType: cpr.ItemType,
            finalPrice: null,
            discountPercentage: null,
            status: null,
            permitMonetary: true,
            validateNow: self.validateNow
        })
    );

    let itbpg = Object.groupBy(self.itemTypes, (it) => it.productGroup.Name);

    self.itemTypesByProductGroup = ko.observableArray([...Object.keys(itbpg).map(k => {
        return {
            key: k,
            itemTypes: itbpg[k]
        }
    })]);

    self.errorables = ko.observableArray([]);

    self.errors = ko.validation.group(self.errorables, {
        live: true
    });

    //#endregion

    //#region Components

    //#endregion

    //#region Computeds

    self.activeComputer = ko.computed(() => {
        //console.trace();
        // what do we want
        // not to be validating all of the observables in the world ever unnecessarily

        let hardcodedErrorables = [];

        hardcodedErrorables.push(self.productGroupAllFabric.brandSelectionValid);
        hardcodedErrorables.push(self.productGroupAllWallpaper.brandSelectionValid);
        hardcodedErrorables.push(self.productGroupAllPatternBooks.brandSelectionValid);
        hardcodedErrorables.push(self.productGroupAllRugs.brandSelectionValid);

        if (self.productGroupAllFabric.brands.find(b => b.checked())) {
            hardcodedErrorables.push(self.productGroupAllFabric.discounter.percentage.observable);
        }
        if (self.productGroupAllWallpaper.brands.find(b => b.checked())) {
            hardcodedErrorables.push(self.productGroupAllWallpaper.discounter.percentage.observable);
        }
        if (self.productGroupAllPatternBooks.brands.find(b => b.checked())) {
            hardcodedErrorables.push(self.productGroupAllPatternBooks.discounter.percentage.observable);
        }
        if (self.productGroupAllRugs.brands.find(b => b.checked())) {
            hardcodedErrorables.push(self.productGroupAllRugs.discounter.percentage.observable);
        }

        let dynamicErrorables = self.itemTypesByProductGroup().flatMap(pg => {
            let discounterObservables = pg.itemTypes.filter(it => it.brands.find(b => b.checked())).flatMap(it => [
                it.discounter.percentage.observable,
                it.discounter.monetary.observable
            ]);
            let brandObservables = pg.itemTypes.flatMap(it => [
                it.brandSelectionValid
            ]);

            return discounterObservables.concat(brandObservables);
        });

        self.errorables(hardcodedErrorables.concat(dynamicErrorables));

    }, self);

    self.errorSummaryMessage = ko.computed(() => {
        //console.trace();
        let count = self.errorables().filter(e => !e.isValid()).length;
        if (count)
            return `${count} error${(count > 1 ? "s" : "")} remain${(count > 1 ? "" : "s")} in the Product Group / Item Types section.`
    }, self);

    //#endregion

    //#region Methods



    //#endregion


    return self;
}

const quantityBreakRecord = (rec = { }) => {
    let self = Object.assign({}, rec);

    self.quantityBreak = ko.observable(self.QuantityBreak).extend({
        required: {
            params: true,
            onlyIf: () => {
                return self.validateNow();
            },
            message: 'You must provide a Quantity Break'
        },
        numberFormatted: {
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
                numericMin: 1,
                numericMax: 999999
            }
        },
        mustNotExistIn: {
            set: self.parent.quantityBreaks,
            propertyName: "quantityBreak"
        }
    });

    self.quantityBreakParams = {
        label: null,
        observable: self.quantityBreak,
        busy: ko.observable(false),
        permitRevert: true,
        originalValue: self.QuantityBreak,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(false),
        revertible: ko.observable(true),
        revertFunction: function () {
            let self = this;
            self.observable(ko.unwrap(self.originalValue));
        },
        useNativeValidation: false, // this feeds through to mdc objects and affects them
        decorateInputElement: true,
        insertValidationMessages: false,
        inputType: 'number',
        small: false,
        buttons: false,
        minValue: 1, // don't have productFilter record in time to set this truthfully, sorry
        maxValue: 999999,
        step: 1,
        //cssClasses: null,
        //incrementAmount: incrementAmount,
        //increment: function () {
        //    let self = this;

        //    let v = +self.observable() || 0;

        //    let factor = Math.pow(10, scale);

        //    if ((v + self.incrementAmount) < max)
        //        self.observable(Math.round((v + self.incrementAmount) * factor) / factor);
        //},
        //decrement: function () {
        //    let self = this;

        //    let v = +self.observable() || 0;

        //    let factor = Math.pow(10, scale);

        //    let diff = Math.round((v - self.incrementAmount) * factor) / factor;

        //    if ((v - self.incrementAmount) > min || diff === 0)
        //        self.observable(diff);
        //}
    };

    self.discounter = discounterFactory({
        validateNow: self.validateNow,
        finalPrice: self.FinalPrice,
        discountPercentage: self.DiscountPercentage,
        currency: {
            Symbol: '£',
            FormattingCulture: 'en-GB',
            Code: 'GBP',
            ISO_4217: 'GBP'
        },
        permitMonetary: true,
        permitPercentage: true,
        initialState: self.FinalPrice == null ? DISCOUNT_STATE_PERCENTAGE : DISCOUNT_STATE_MONETARY
    });

    return self;
}

const qualityRecord = (rec = { }) => {
    let self = Object.assign({}, rec);

    //#region Properties

    self.loaded = ko.observable(false);

    self.busy = ko.observable(true);

    self.checked = ko.observable(self.checked);

    self.salesQuantity = ko.observable();

    self.salesValue = ko.observable();

    self.currentPrice = ko.observable();

    self.validateNow = rec.validateNow;

    self.quantityBreaks = ko.observableArray([]);

    let initialBreak = quantityBreakRecord({
        parent: self,
        QuantityBreak: 0,
        validateNow: self.validateNow
    });

    self.quantityBreaks([initialBreak]);

    //#endregion

    //#region Components



    //#endregion

    //#region Methods

    self.addQuantityBreak = () => {
        let qb = self.quantityBreaks().reduce((a, i) => a = a >= i.quantityBreak() ? a : i.quantityBreak(), 0) + 1;
        self.quantityBreaks.push(quantityBreakRecord({
            parent: self,
            QuantityBreak: qb,
            validateNow: self.validateNow
        }));
    }

    self.removeQuantityBreak = (qb) => {
        self.quantityBreaks.remove(qb);
    }

    //#endregion

    return self;
}

const productRecord = (rec = {}) => {
    let self = Object.assign({}, rec);

    //#region Properties

    self.loaded = ko.observable(false);

    self.busy = ko.observable(false);

    self.checked = ko.observable(false);

    //#endregion

    //#region Computeds



    //#endregion

    //#region Methods



    //#endregion

    return self;
}

const qualityEditor = ({
    tradeAccountId,
    virtualScrollerContainer
} = {
        tradeAccountId: null,
        virtualScrollerContainer: null
    }) => {
    let self = {
        tradeAccountId: tradeAccountId,
        virtualScrollerContainer: virtualScrollerContainer
    };

    //#region Properties

    self.busy = ko.observable(false);

    self.validateNow = ko.observable(false);

    self.setAllBusy = ko.observable(false);

    self.setAllProgress = ko.observable(0);
    
    self.validateSetAllNow = ko.observable(false);

    self.setAllModalElement = document.querySelector("#quality-discounter-set-all-modal");

    self.setAllModal = bootstrap.Modal.getOrCreateInstance(self.setAllModalElement);

    self.setAllRecord = qualityRecord({
        validateNow: self.validateSetAllNow
    });

    //#region Prefilters

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

    self.searchTerm = ko.observable();

    //#endregion

    self.selectedQualityIds = ko.observableArray([]);

    self.selectedQualities = ko.observableArray([]);

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

            //switch (self.view()) {
            //    case VIEW_MANAGE:
            //        array = self.filledRecords.peek();
            //        break;
            //    case VIEW_ADD:
            //        array = self.addFilledRecords.peek();
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

    //#endregion

    //#region Components

    self.primaryFetchParams = ko.computed(() => {
        //console.trace();
        let params = {
            tradeAccountId: self.tradeAccountId(),
            launchId: self.launchId(),
            brandId: self.brandId(),
            collectionId: self.collectionId(),
            productGroupId: self.productGroupId(),
            itemTypeId: self.itemTypeId(),
        };

        if (self.searchTerm()) {
            params.searchTerm = self.searchTerm();
        }

        if (self.tradeAccountId() &&
            (
                self.launchId() ||
                self.brandId() ||
                self.collectionId() ||
                self.productGroupId() ||
                self.itemTypeId() ||
                self.searchTerm()
            )
        ) {
            return params;
        }

        return;
    }, self);

    // this is called via .apply(,) -- must not be declared with arrow syntax, as they do not get passed
    // any this value and always use the global scope as their this
    self.secondaryFetchParams = function (unfilledRecords) {

        let qualityIds = [...new Set(unfilledRecords.flatMap(ur => ur.QualityID ? [ur.QualityID] : []))];

        let data = {
            tradeAccountId: self.tradeAccountId(),
            productId: [],
            qualityId: qualityIds
        };

        return data;
    };

    self.virtualScroller = virtualScrollingDeferredDataFactory({
        busy: self.busy,
        tableSelector: "#quality-search-results-table",
        rowHeight: 50,
        primaryFetchParams: self.primaryFetchParams,
        primaryFetchEndpoint: "/api/contractPricing/QualitySearch",
        primaryFetchResultSetName: "Results",
        primaryFetchResultFn: (rec) => {
            rec = Object.assign({
                checked: (self.selectedQualityIds().find(qid => qid == rec.QualityID)),
                validateNow: self.validateNow
            }, rec);
            return qualityRecord(rec);
        },
        secondaryFetchQueueRecordId: "QualityID",
        secondaryFetchParams: self.secondaryFetchParams,
        secondaryFetchEndpoint: "/api/contractPricing/FetchSalesData",
        secondaryFetchResultSetName: "QualityResults",
        secondaryFetchResultProcessingFn: function (data) {
            this.salesQuantity(data.SalesQuantity_180Days);
            this.salesValue(data.SalesValue_180Days);
            this.currentPrice("TBC");
            this.loaded(true);
            this.busy(false);
        },
        container: self.virtualScrollerContainer,
        gridHeaderHeight: 57,
        gridPositionTop: 0,
        unfilledRecordFn: (rec) => {
            let self = Object.assign({}, rec);
            return self;
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
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: '#contract-pricing-modal .modal-body'
        }
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
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: '#contract-pricing-modal .modal-body'
        }
    });

    self.productGroupParams = kendoMDCDropDownList({
        label: 'Product Group',
        odata: true,
        endPoint: '/odata/ProductGroups/Default.GetProductGroupsForContractPricing',
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
        }
    });

    self.itemTypeParams = kendoMDCDropDownList({
        label: 'Item Type',
        odata: true,
        endPoint: '/odata/ItemTypes/Default.GetItemTypesForContractPricing?$expand=ContractProductRestrictions',
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
            e.sender.enable(e.sender.dataSource.data().length != 0);
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
            appendTo: '#contract-pricing-modal .modal-body'
        }
    });

    self.searchTermParams = {
        label: "Search by Quality or Product",
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

    self.errorables = ko.observableArray([]);

    self.errors = ko.validation.group(self.errorables, {
        live: true
    });

    self.setAllErrors = ko.validation.group([
        self.setAllRecord
    ], {
        deep: true,
        live: true
    });

    //#endregion

    //#region Computeds

    // validation hurrah
    self.selectedQuantityBreaks = ko.computed(() => {
        //console.trace();
        return [...self.selectedQualities().flatMap(sq => sq.quantityBreaks())];
    }, self);


    self.errorSummaryMessage = ko.computed(() => {
        //console.trace();
        let count = self.errorables().filter(e => !e.isValid()).length;
        if (count)
            return `${count} error${(count > 1 ? "s" : "")} remain${(count > 1 ? "" : "s")} in the Design section.`
    }, self);

    //#endregion

    //#region Subscriptions

    self.selectedQuantityBreaks.subscribe(nv => {
        //console.trace();
        self.errorables(nv.flatMap(qb => {
            return [
                qb.quantityBreak,
                qb.discounter.monetary.observable,
                qb.discounter.percentage.observable
            ];
        }));
    });

    self.setAllProgress.subscribe(nv => {
        //console.trace();
        if (nv >= 100)
            self.hideSetAllModal();
    });

    //#endregion

    //#region Methods

    self.toggleSelection = (qualityRecord) => {
        let extant = self.selectedQualityIds().find(qid => qid === qualityRecord.QualityID);

        if (extant) {
            self.selectedQualityIds.remove(qualityRecord.QualityID);
            self.selectedQualities.remove(q => q.QualityID == qualityRecord.QualityID);
        } else {
            self.selectedQualityIds.push(qualityRecord.QualityID);
            self.selectedQualities.push(qualityRecord);
        }
    }

    self.afterSelectedQualitiesRender = (i) => {
        if (i === self.selectedQualities().length - 1) {
            document.querySelectorAll("#selected-qualities-table .btn-add-quality").forEach(e => {
                new bootstrap.Ripple(e);
            });
        }
    }

    self.showSetAllModal = () => {
        self.resetSetAll();
        self.setAllModal.show();
    }

    self.hideSetAllModal = () => {
        self.setAllModal.hide();
    }

    self.setAll = () => {

        self.validateSetAllNow(true);

        window.setTimeout(() => {

            if (self.setAllErrors().length == 0) {

                self.setAllBusy(true);

                window.setTimeout(() => {
                    let qbs = self.setAllRecord.quantityBreaks().map(qb => {
                        return {
                            quantityBreak: qb.quantityBreak(),
                            discountPercentage: qb.discounter.percentage.observable(),
                            finalPrice: qb.discounter.monetary.observable()
                        }
                    });

                    let increment = 100 / self.selectedQualities().length;

                    self.selectedQualities().forEach((sq, i) => {
                        window.setTimeout(() => {
                            sq.quantityBreaks(qbs.map(qb => quantityBreakRecord({
                                parent: sq,
                                QuantityBreak: qb.quantityBreak,
                                DiscountPercentage: qb.discountPercentage,
                                FinalPrice: qb.finalPrice,
                                validateNow: self.validateNow
                            })));

                            if (i === qbs.length - 1) {
                                self.setAllProgress(100);
                            } else {
                                self.setAllProgress(self.setAllProgress() + increment)
                            }
                        }, 0);
                    });
                }, 0);

            } else {
                self.setAllErrors.showAllMessages(true);

                self.setAllErrors.filter(x => {
                    x.isValid.notifySubscribers(x.isValid());
                })
            }
        }, 0);
    }
    
    self.resetSetAll = () => {
        let initialBreaks = [
            quantityBreakRecord({
                parent: self.setAllRecord,
                QuantityBreak: 0,
                validateNow: self.validateSetAllNow
            })
        ];
        self.setAllRecord.quantityBreaks(initialBreaks);
        self.setAllProgress(0);
        self.setAllBusy(false);

        self.validateSetAllNow(false);
        self.setAllErrors.showAllMessages(false);
    }

    //#endregion

    return self;
}

const productGroupItemType = ({
    label,
    productGroupId,
    productGroup,
    itemTypeId,
    itemType,
    finalPrice,
    discountPercentage,
    status,
    permitMonetary,
    validateNow
} = {
    label: null,
    productGroupId: null,
    productGroup: null,
    itemTypeId: null,
    itemType: null,
    finalPrice: null,
    discountPercentage: null,
    status: null,
    permitMonetary: false,
    validateNow: ko.observable(false)
}) => {

    let self = {
        label: label,
        productGroupId: productGroupId,
        productGroup: productGroup,
        itemTypeId: itemTypeId,
        itemType: itemType,
        status: status,
        parentValidateNow: validateNow
    };

    //#region Properties

    self.allBrands = ko.observable(false);

    self.brands = getBrands().map(b => brand({
        rec: b
    }));

    //#endregion

    //#region Computeds

    self.validateNow = ko.computed(() => {
        //console.trace();
        return self.brands.find(b => b.checked()) && self.parentValidateNow()
    }, self);
    
    //#endregion

    //#region Components

    self.allBrandsParams = {
        observable: self.allBrands,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false)
    }

    self.discounter = discounterFactory({
        validateNow: self.validateNow,
        finalPrice: finalPrice,
        discountPercentage: discountPercentage,
        currency: {
            Symbol: '£',
            FormattingCulture: 'en-GB',
            Code: 'GBP',
            ISO_4217: 'GBP'
        },
        permitMonetary: permitMonetary,
        permitPercentage: true,
        initialState: DISCOUNT_STATE_PERCENTAGE,
    });

    self.brandSelectionValid = ko.computed(() => {
        //console.trace();

        if (self.discounter.monetary.observable() || self.discounter.percentage.observable()) {
            let result = self.brands.find(b => b.checked()) != null;

            if (self.parentValidateNow())
                return result;
        }

        return true;
    }, self).extend({
        mustEqual: true
    });

    //#endregion

    //#region Subscriptions

    self.allBrands.subscribe(nv => {
        //console.trace();
        self.brands.forEach(b => b.checked(nv));
    });

    //#endregion


    //#region Methods



    //#endregion

    return self;
}

const brand = ({
    rec,
    data
} = {
    rec: null,
    data: null
}) => {
    let self = Object.assign({}, rec);

    //#region Properties

    self.checked = ko.observable(false);

    //#endregion

    //#region Components

    self.checkedParams = {
        observable: self.checked,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false)
    }

    //#endregion

    //#region Computeds



    //#endregion

    //#region Methods



    //#endregion

    return self;
}

const DISCOUNT_STATE_PERCENTAGE = 1,
    DISCOUNT_STATE_MONETARY = 2;

const discounterFactory = ({
    validateNow,
    finalPrice,
    discountPercentage,
    currency,
    permitMonetary,
    permitPercentage,
    initialState,
} = {
    validateNow: ko.observable(false),
    finalPrice: null,
    discountPercentage: null,
    currency: {
        Symbol: '£',
        FormattingCulture: 'en-GB',
        Code: 'GBP',
        ISO_4217: 'GBP'
    },
    permitMonetary: true,
    permitPercentage: true,
    initialState: DISCOUNT_STATE_PERCENTAGE
}) => {

    let self = {
        debug: false,
        validateNow: validateNow,
        discountEntryVisible: true,
        discountReasonRequired: false,
        increasedValueWarning: false,
        focAvailable: ko.observable(false),
        finalPrice,
        discountPercentage,
        currency,
        permitMonetary,
        permitPercentage,
        selector: {
            observable: ko.observable(initialState),
            options: [{
                symbol: currency.Symbol,
                discountState: DISCOUNT_STATE_MONETARY
            }, {
                symbol: '%',
                discountState: DISCOUNT_STATE_PERCENTAGE
            }],
            tabindex: -1,
            optionsText: 'symbol',
            optionsValue: 'discountState',
            optionsCaption: undefined,
            useNativeValidation: false,
            insertValidationMessages: false,
            decorateInputElement: false,
            enable: ko.observable(permitMonetary && permitPercentage),
            disable: ko.observable(false),
            clearable: ko.observable(false),
            revertible: ko.observable(false)
        },
        percentage: {
            label: 'Discount',
            name: 'Percentage',
            inputType: 'text',
            minValue: 0,
            maxValue: 100,
            step: 1,
            buttons: false,
            observable: ko.observable(discountPercentage).extend({
                numberFormatted: {
                    digits: 0,
                    currency: {
                        FormattingCulture: 'en-GB'
                    },
                    minValue: 0,
                    maxValue: 100
                }
            }),
            focusObservable: ko.observable(false),
            useNativeValidation: false,
            decorateInputElement: true,
            insertValidationMessages: false,
            showClear: false,
            busy: ko.observable(false),
            readOnly: ko.observable(false),
            enable: ko.observable(true),
            disable: ko.observable(false),
            clearable: ko.observable(false),
            revertible: ko.observable(false)
        },
        monetary: {
            label: 'Final Price',
            name: 'Monetary',
            inputType: 'text',
            minValue: 1,
            maxValue: 1000000000,
            step: 1,
            buttons: false,
            observable: ko.observable(finalPrice).extend({
                numberFormatted: {
                    digits: 2,
                    currency: {
                        FormattingCulture: currency.FormattingCulture
                    },
                    minValue: 0,
                    maxValue: Number.MAX_VALUE * 0.01
                }
            }),
            focusObservable: ko.observable(false),
            useNativeValidation: false,
            decorateInputElement: true,
            insertValidationMessages: false,
            showClear: false,
            busy: ko.observable(false),
            readOnly: ko.observable(false),
            enable: ko.observable(true),
            disable: ko.observable(false),
            clearable: ko.observable(false),
            revertible: ko.observable(false)
        },
        subscriptions: [],
        bypassValidation: ko.observable(false)
    };

    self.percentage.observable.extend({
        required: {
            params: true,
            onlyIf: () => {
                if (self.bypassValidation())
                    return false;

                return self.validateNow() && self.selector.observable() == DISCOUNT_STATE_PERCENTAGE
            },
            message: 'You must provide a Discount Percentage'
        }
    });

    self.monetary.observable.extend({
        required: {
            params: true,
            onlyIf: function () {
                if (self.bypassValidation())
                    return false;

                return self.validateNow() && self.selector.observable() == DISCOUNT_STATE_MONETARY
            },
            message: 'You must provide a Final Price'
        }
    });
    
    //self.selector.disabled = ko.pureComputed(function () {
    //    return (self.monetary.readOnly() || self.percentage.readOnly());
    //}, self);

    self.subscriptions.push(self.selector.observable.subscribe(function (newValue) {
        //console.trace();
        switch (newValue) {
            case DISCOUNT_STATE_MONETARY:
                self.currentState(self.monetary);
                self.monetary.observable(undefined);
                break;
            case DISCOUNT_STATE_PERCENTAGE:
                self.currentState(self.percentage);
                self.percentage.observable(undefined);
                break;
        }
    }));

    self.currentState = ko.observable(self.percentage);

    self.currentState.readOnly = ko.observable(false);

    if (discountPercentage != null) {
        if (discountPercentage > 0) {
            self.selector.observable(DISCOUNT_STATE_PERCENTAGE);
            self.currentState(self.percentage);
        }
    }

    if (finalPrice != null) {
        self.selector.observable(DISCOUNT_STATE_MONETARY);
        self.currentState(self.monetary);
    }

    self.errors = ko.validation.group([

    ]);

    self.errorables = [
        self.monetary.observable,
        self.percentage.observable
    ];

    self.toJson = () => {
        return {
            finalPrice: self.monetary.observable(),
            discountPercentage: self.percentage.observable()
        };
    }

    self.reset = function () {
        self.selector.observable(DISCOUNT_STATE_PERCENTAGE);
        self.percentage.observable(undefined);
        self.monetary.observable(undefined);
    }

    return self;
}