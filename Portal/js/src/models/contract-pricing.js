const
    VIEW_MANAGE = 1,
    VIEW_RESTOCK = 2,
    VIEW_RECALL = 3,
    VIEW_ADD = 4

const contractPricingViewModel = ({ } = {}) => {
    let self = {};

    //#region Properties


    // impossible virtual scrolling property madness

    self.rowHeight = 80;

    self.scrollY = ko.observable(0);

    self.productFilterGroupRowHeight = 30;

    self.productPageGroupRowHeight = 26;

    self.orderFormGroupRowHeight = 22;

    self.maxY = ko.observable(window.innerHeight);

    self.gridHeaderHeight = 56;

    self.gridTotalHeight = ko.observable();

    self.gridScrollBottomPadding = ko.observable(0);

    self.finalRowVisible = ko.observable(false);

    self.gridPositionTop = 158;

    ///


    self.busy = ko.observable(true);

    self.fetchDataBusy = ko.observable(false);

    self.view = ko.observable(VIEW_MANAGE);

    self.modalBusy = ko.observable(false);

    self.ready = ko.observable(true);

    self.modalElement = document.getElementById("add-note-modal");

    self.modal = bootstrap.Modal.getOrCreateInstance(self.modalElement);

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
    //    revertable: false,
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
    self.tradeAccountDealDetails = ko.observable();

    self.tradeAccountGroupDealDetails = ko.observable();

    self.selectedContractListId = ko.observable();

    self.impactResults = ko.observableArray([]);

    self.haveImpactResults = ko.observable(false);

    //// this is used to hold the records we need to data fetch for those which the dataSource has deemed to be "in view"
    self.recordsToDataFetch = ko.observableArray([]);

    //// this holds those records which have been fleshed out by the fetchData results
    self.filledRecords = ko.observableArray([]);

    //// this lets us return the grid to where it was before "refresh" was called
    //// calling refresh is necessary following an endless scrolling paging event because we're grouping
    self.gridScrollRestoration = null;

    //self.productFilterTotals = ko.observableArray([]);

    //self.branchBaskets = ko.observableArray([]);

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

    self.firstParamsRun = true;

    self.prefilterParams = ko.computed(() => {
        console.log('prefilterParams computed');

        let props = {
            salesMarketId: self.salesMarketId(),
            salesRepresentativeId: self.salesRepresentativeId(),
            tradeAccountId: self.tradeAccountId(),
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
        revertable: ko.observable(false),
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
        revertable: ko.observable(false),
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
        revertable: ko.observable(false),
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
        revertable: ko.observable(false),
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
        revertable: ko.observable(false),
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
        revertable: ko.observable(false),
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
        endPoint: '/odata/ProductGroups',
        textField: 'Name',
        valueField: 'productGroupID',
        virtual: false,
        idObservable: self.productGroupId,
        objObservable: self.productGroup,
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

    self.itemTypeParams = kendoMDCDropDownList({
        label: 'Item Type',
        odata: true,
        endPoint: '/odata/ItemTypes',
        textField: 'Name',
        valueField: 'ItemTypeID',
        virtual: false,
        idObservable: self.itemTypeId,
        objObservable: self.itemType,
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
        revertable: ko.observable(false),
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
            //self.gridSettings.widget().dataSource.read();
        }
    }

    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Methods

    self.fetchImpact = (selection, event) => {
        self.busy(true);

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

        let data = {
            tradeAccountId: self.tradeAccountId(),
            contractListJson: JSON.stringify({
                contractDiscountTradeAccountGroupId: contractDiscountTradeAccountGroupIds,
                contractPriceTradeAccountGroupId: contractPriceTradeAccountGroupIds,
                contractDiscountTradeAccountId: contractDiscountTradeAccountIds,
                contractPriceTradeAccountId: contractPriceTradeAccountIds
            })
        };

        self.impactResults([]);

        self.haveImpactResults(false);

        let qs = new URLSearchParams(data);

        console.log('fetchImpact calling with', data);

        fetch(`/api/contractPricing/FetchImpact?${qs}`, {
            method: 'GET',
            headers: window.fetchHeaders
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log('fetchImpact returned', data);

                //if (data.Results.length === 0)
                self.clearBusy();

                if (data.Results.length > 1)
                    self.haveImpactResults(true);

                self.impactResults(data.Results);

            })
            .catch(err => {
                self.clearBusy();
                window.catchFetchError(err);
            });

        return true;
    }

    self.showModal = (record) => {
        /*self.addingNoteToRecord(record);*/
        self.modal.show();
        //self.fetchNotes();
    }

    self.hideModal = () => {
        //self.note(undefined);
        self.modal.hide();
        //self.addingNoteToRecord().busy(true);
        //self.addingNoteToRecord().loaded(false);
        //self.reloadRecord(self.addingNoteToRecord());
        //self.addingNoteToRecord(undefined);
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

    //#endregion


    //#region Computeds

    self.impactVisible = ko.computed(() => {
        return self.tradeAccount() != null;
    }, self);

    self.allDateRanges = ko.computed(() => {
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
        return self.allDateRanges().flatMap(d => d.contractLevels.flatMap(cl => cl.contracts.flatMap(c => c)));
    }, self);

    self.fetchDeals = ko.computed(() => {

            //self.filledRecords([]);

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
                        let parsedResult = JSON.parse(data.TradeAccountContractJSON);
                        parsedResult.dateRanges = parsedResult.dateRanges.map(dr => dateRangeRecord({
                            rec: dr,
                            allContractsComputed: self.allContracts
                        }));
                        self.tradeAccountDealDetails(parsedResult);
                    }

                    if (data.TradeAccountGroupContractJSON) {
                        let parsedResult = JSON.parse(data.TradeAccountGroupContractJSON);
                        parsedResult.dateRanges = parsedResult.dateRanges.map(dr => dateRangeRecord({
                            rec: dr,
                            allContractsComputed: self.allContracts
                        }));
                        self.tradeAccountGroupDealDetails(parsedResult);
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
                        })
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

    self.fetchSalesData = ko.computed(() => {
        let urpids = self.unfilledRecordProductIds();

        if (urpids.length) {

            window.setTimeout(() => {
                console.log('fetchSalesData calling with', urpids);

                let callStart = new Date();

                let productIds = [];
                let qualityIds = [];

                let data = {
                    tradeaccountId: self.tradeAccountId(),
                    productIds: productIds,
                    qualityIds: qualityIds
                };

                let qs = new URLSearchParams(data);

                fetch(`/api/contractpricing/FetchSalesData?${qs}`, {
                    method: 'GET',
                    headers: window.fetchHeaders,
                })
                    .then(window.handleFetchResponse)
                    .then(data => {

                        let callReturn = new Date();

                        console.log(`FetchSalesData returned in ${callReturn - callStart}ms`, data);

                        //let records = self.impactResults.peek();
                        //let affectedRecords = [];
                        //let filledRecords = self.filledRecords.peek();
                        //let forcedRemovals = [];

                        //urpids.forEach(pid => {

                        //    let record = records.find(p => p.ProductID === pid);
                        //    // if record is null here, we've fetched data for something which is no longer amongst our search results.
                        //    // this will readily cause chaos: remove it from the 'to be fetched' collection.

                        //    if (record != null) {

                        //        let dataResult = data.Results.find(p => p.ProductID == pid);
                        //        let filledRecord = filledRecords.find(p => p.ProductID == pid);

                        //        let add = true;

                        //        if (dataResult) {

                        //            if (filledRecord == null) {
                        //                record = resultRecord({
                        //                    branchId: self.branchId(),
                        //                    rec: record,
                        //                    fetchBranchBasketsNonce: self.fetchBranchBasketsNonce,
                        //                    reload: self.reloadRecord
                        //                });
                        //            } else {
                        //                add = false;
                        //                filledRecord.loaded(true);
                        //                record = filledRecord;
                        //            }

                        //            record.actionRecommendations = dataResult.Action_Recommendation;

                        //            record.actionTransferToBranchHighlight = dataResult.Action_TransferToBranchHighlight;

                        //            record.actionTransferToBranchQuantityOriginal(dataResult.Action_TransferToBranchQuantity);
                        //            record.actionTransferToBranchQuantity(dataResult.Action_TransferToBranchQuantity);
                        //            record.actionTransferToBranchBasketItemId(dataResult.WH2BR_BasketItemID);
                        //            record.actionTransferToBranchExtantTransferQuantity(dataResult.WH2BR_Quantity);

                        //            if (dataResult.WH2BR_BasketItemID) {
                        //                record.actionTransferToBranchQuantityParams.disable(true);
                        //            }

                        //            record.actionTransferToWarehouseHighlight = dataResult.Action_TransferToWarehouseHighlight;

                        //            record.actionTransferToWarehouseQuantityOriginal(dataResult.Action_TransferToWarehouseQuantity);
                        //            record.actionTransferToWarehouseQuantity(dataResult.Action_TransferToWarehouseQuantity);
                        //            record.actionTransferToWarehouseBasketItemId(dataResult.BR2WH_BasketItemID);
                        //            record.actionTransferToWarehouseExtantTransferQuantity(dataResult.BR2WH_Quantity);

                        //            if (dataResult.BR2WH_BasketItemID) {
                        //                record.actionTransferToWarehouseQuantityParams.disable(true);
                        //            }

                        //            record.notes = dataResult.Action_NoteCount;

                        //            record.rangeStatus = dataResult.Range_Status;
                        //            record.rangeActual = dataResult.Range_Actual;

                        //            record.rangePlanned(dataResult.Range_Planned);
                        //            record.rangePlannedOriginal(dataResult.Range_Planned);

                        //            record.rangeInProgress = dataResult.Range_InProgress;
                        //            record.rangeRequired = dataResult.Range_Required;

                        //            record.sales180DayBranch = dataResult.Sales_180Day_Branch;
                        //            record.sales180DayFW = dataResult.Sales_180Day_FW;
                        //            record.sales180DayKR = dataResult.Sales_180Day_KR;
                        //            record.sales180DayMHS = dataResult.Sales_180Day_MHS;
                        //            record.sales180DayUKEcommerce = dataResult.Sales_180Day_UKEcommerce;
                        //            record.sales180DayUKTrade = dataResult.Sales_180Day_UKTrade;
                        //            record.sales180DayROWTrade = dataResult.Sales_180Day_ROWTrade;
                        //            record.sales180DayTotal = dataResult.Sales_180Day_Total;
                        //            record.salesSummary = dataResult.Sales_Summary;
                        //            record.salesCover = dataResult.Sales_Cover;

                        //            record.stockCover = dataResult.Stock_Cover;
                        //            record.stockFWFreeStock = dataResult.Stock_FW_FreeStock;
                        //            record.stockKRFreeStock = dataResult.Stock_KR_FreeStock;
                        //            record.stockMHSFreeStock = dataResult.Stock_MHS_FreeStock;
                        //            record.stockWHFreeStock = dataResult.Stock_WH_FreeStock;
                        //            record.stockWHNextPODueDate = dataResult.Stock_WH_NextPODueDate;
                        //            record.stockWHNextPOFreeStock = dataResult.Stock_WH_NextPOFreeStock;
                        //            record.stockSummary = dataResult.Stock_Summary;

                        //            record.unitCostPriceGBP = dataResult.UnitCostPriceGBP;

                        //            record.priceSummary = dataResult.Price_Summary;

                        //            record.busy(false);

                        //            record.loaded(true);
                        //        } else {
                        //            record.loaded = ko.observable(true);
                        //            record.ErrorMessage = `<h5 class="mb-0">portal.RangeManagement_Range_Select did not return a result for ProductID ${record.ProductID}</h5>`;
                        //        }

                        //        if (add) {
                        //            affectedRecords.push(record);
                        //        }
                        //    } else {
                        //        forcedRemovals.push(pid);
                        //    }
                        //});

                        //ko.ignoreDependencies(() => {
                        //    affectedRecords.forEach(ar => {
                        //        self.recordsToDataFetch.remove(rtdf => rtdf.ProductID === ar.ProductID);
                        //    });

                        //    forcedRemovals.forEach(fr => {
                        //        self.recordsToDataFetch.remove(rtdf => rtdf.ProductID == fr);
                        //    })

                        //    ko.utils.arrayPushAll(self.filledRecords, affectedRecords);
                        //});

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

    self.impactResultsDisplay = ko.computed(() => {

        let key = "ProductFilterName";

        if (self.haveImpactResults()) {
            let results = [];

            // counts the number of *end* product rows we have rendered
            let runningCount = 0;

            // the height of the table's thead element
            let startingOffset = self.gridHeaderHeight;

            // we can only really do this if we're working with *exact* known heights.
            // otherwise all bets are off.
            // therefore let us achieve the knowing of the heights.
            let additionalOffset = startingOffset;

            let filledRecords = self.filledRecords.peek();

            let cumulativeHeight = 0;

            self.impactResults().forEach((impactResult, impactResultIndex) => {

                //// if this orderFormGroup has a name, it will have rendered a heading (20px) and we need to account for the height of that heading.
                //if (impactResult.name != "") {
                //    additionalOffset += self.orderFormGroupRowHeight;
                //}

                //let products = ko.unwrap(impactResult.items);

                ////iterate over the products belonging to this order form group
                //products.forEach((product, productIndex) => {

                //    // each product record has one fundamental height: 80px.
                //    product.height = self.rowHeight;

                //    // each product is offset from the top by some Y
                //    product.offsetY = (((runningCount + (productIndex)) * self.rowHeight) + additionalOffset);
                //})

                impactResult.offsetY = (((runningCount + (impactResultIndex)) * self.rowHeight) + additionalOffset);

                cumulativeHeight += impactResult.offsetY;

                runningCount += 1;
            });

            self.impactResults.valueHasMutated();

            //let cumulativeHeight = startingOffset;

            //let itemCount = 0;

            //results.forEach((productFilterGroup, pfgi) => {
            //    // productFilterGroup.name is never null, always add the productFilterGroupRowHeight

            //    productFilterGroup.items.forEach((productPageGroup, ppgi) => {

            //        // productPageGroup.name can be null, test before adding productPageGroupRowHeight

            //        productPageGroup.items.forEach((orderFormGroup, ofgi) => {

            //            // orderFormGroup.name can be null, test before adding orderFormGroupRowHeight

            //            let items = ko.unwrap(orderFormGroup.items);

            //            // this orderFormGroup's height is equal to the number of items it contains by the height of each item, possibly plus its own grouping row height.
            //            orderFormGroup.height = ((items.length * self.rowHeight) + (orderFormGroup.name == "" ? 0 : self.orderFormGroupRowHeight));

            //            runningOrderFormGroupHeight += orderFormGroup.height;

            //            orderFormGroup.runningHeight = runningOrderFormGroupHeight;

            //            cumulativeHeight += orderFormGroup.height;

            //            orderFormGroup.offsetY = (cumulativeHeight - orderFormGroup.height) + ((pfgi + 1) * self.productFilterGroupRowHeight) + ((ppgi + 1) * self.productPageGroupRowHeight);

            //            orderFormGroup.headerVisible = ko.computed(() => {
            //                if (orderFormGroup.name && orderFormGroup.offsetY + self.orderFormGroupRowHeight >= self.scrollY() + self.gridHeaderHeight) {
            //                    return true;
            //                }

            //                return false;
            //            }, self);
            //        });

            //        // this productPageGroup's height is equal to the sum of its orderFormGroup heights, possibly plus its own grouping row height.
            //        productPageGroup.height = (ko.unwrap(productPageGroup.items).reduce((a, i) => a += i.height, 0) + (productPageGroup.name == "" ? 0 : self.productPageGroupRowHeight));

            //        runningProductPageGroupHeight += productPageGroup.height;

            //        productPageGroup.runningHeight = runningProductPageGroupHeight;

            //        productPageGroup.offsetY = (cumulativeHeight - productPageGroup.height) + ((pfgi + 1) * self.productFilterGroupRowHeight) + ((ppgi + 1) * self.productPageGroupRowHeight);

            //        productPageGroup.headerVisible = ko.computed(() => {
            //            if (productPageGroup.name && productPageGroup.offsetY + self.productPageGroupRowHeight >= self.scrollY() + self.gridHeaderHeight) {
            //                return true;
            //            }
            //            return false;
            //        }, self);
            //    });

            //    // because the height of productPageGroup headings is not catered for in the above...
            //    cumulativeHeight += productFilterGroup.items.reduce((a, i) => a += i.name === "" ? 0 : self.productPageGroupRowHeight, 0);

            //    // this productFilterGroup's height is equal to the sum of its productPageGroup heights, plus its own grouping row height.
            //    productFilterGroup.height = (ko.unwrap(productFilterGroup.items).reduce((a, i) => a += i.height, 0) + self.productFilterGroupRowHeight);

            //    runningProductFilterGroupHeight += productFilterGroup.height;

            //    productFilterGroup.runningHeight = runningProductFilterGroupHeight;

            //    productFilterGroup.offsetY = productFilterGroup.runningHeight - productFilterGroup.height + self.gridHeaderHeight;

            //    productFilterGroup.headerVisible = ko.computed(() => {
            //        if (productFilterGroup.offsetY + self.productFilterGroupRowHeight >= self.scrollY() + self.gridHeaderHeight) {
            //            return true;
            //        }
            //        return false;
            //    }, self);
            //});

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

    self.visibleItems = ko.computed(() => {

        let toFetch = [];

        let filledRecords = self.filledRecords.peek();

        let results = self.impactResults().filter(i => {
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

    self.gridScrollTopPadding = ko.computed(() => {
        let scrollY = self.scrollY();
        let scrollYPlusHeaderHeight = scrollY + self.gridHeaderHeight;
        let my = self.maxY();

        let result = 0;

        ko.ignoreDependencies(() => {

            let searchResults = self.impactResults();

            if (searchResults.length) {

                // you are fully scrolled out of view as soon as scrollY is greater than your height.
                // gasr.height includes self.productFilterGroupRowHeight
                let filterGroupsEntirelyAbove = searchResults.filter(sr => {
                    return scrollY > sr.runningHeight
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

        return result;
    }, self);

    self.gridScrollBottomPadding = ko.computed(() => {
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
        let allContracts = self.allContractsComputed();
        return (self._conflicts ?? []).map(cf => {
            return allContracts.find(c => c.contractListId == cf.ConflictContractListID);
        })
    }, self);

    self.overrides = ko.computed(() => {
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

    //#endregion

    //#region Computeds



    //#endregion

    //#region Methods



    //#endregion

    return self;
}

