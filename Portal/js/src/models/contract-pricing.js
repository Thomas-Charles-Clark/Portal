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

    // this is used to hold the results of productSearch: "stubs", unfilled records pending fetchData treatment
    self.currentDeals = ko.observableArray([]);

    //// this is used to hold the records we need to data fetch for those which the dataSource has deemed to be "in view"
    //self.recordsToDataFetch = ko.observableArray([]);

    //// this holds those records which have been fleshed out by the fetchData results
    //self.filledRecords = ko.observableArray([]);

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

    self.firstCurrentDealsParamsRun = true;

    self.currentDealsParams = ko.computed(() => {
        console.log('currentDealsParams computed');

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

        if (self.firstCurrentDealsParamsRun) {
            self.firstCurrentDealsParamsRun = false;
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
                            if (data.value.length == 1) {
                                self.salesMarketId(opt);
                            }
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
        endPoint: '/odata/SalesRepresentatives',
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
                        url: `/odata/SalesRepresentatives/Default.SalesRepresentativeValueMapper(salesRepresentativeId=${options.value})`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                            if (data.value.length == 1) {
                                self.salesRepresentative(data.value[0]);
                            }
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
        endPoint: '/odata/TradeAccounts',
        textField: 'Name',
        valueField: 'TradeAccountID',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/TradeAccounts/Default.TradeAccountValueMapper(tradeAccountId=${options.value})`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                            if (data.value.length == 1) {
                                self.tradeAccount(data.value[0]);
                            }
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

    self.tradeAccount.subscribe(nv => {
        if (nv) {
            self.salesMarketId(nv.SalesMarketID);
            self.salesRepresentativeId(nv.SalesRepresentativeID);
        }
    });

    //#endregion


    //#region Methods

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
        if (self.currentDeals().find(p => p.unsavedChanges())) {
            self.setBusy();

            let products = self.currentDeals().filter(p => p.unsavedChanges());

            products.forEach(p => {
                p.preSave();
            });

            let params = {
                products: products.map(p => p.toJS())
            };

            /// fetch, do something, etc...

            products.forEach(p => {
                p.postSave(false);
            });

            //fetch('/api/rangeManagementApi/UpsertRange', {
            //    method: 'POST',
            //    headers: window.fetchHeaders,
            //    body: JSON.stringify(params)
            //})
            //    .then(window.handleFetchResponse)
            //    .then(data => {
            //        //window.showInfo("Success", "Your changes have been saved!");

            //        products.forEach(p => {
            //            p.postSave(true);
            //        });

            //        self.clearBusy();
            //    })
            //    .catch(err => {
            //        products.forEach(p => {
            //            p.postSave(false);
            //        });

            //        self.clearBusy();
            //        window.catchFetchError(err);
            //    });
        } else {
            window.showInfo("Information", "You have no unsaved changes.");
        }
    }

    //#endregion


    //#region Computeds

    self.impactVisible = ko.computed(() => {
        return self.tradeAccount() != null;
    }, self);

    //self.branchTotalPlannedValue = ko.computed(() => {
    //    let totalValue = self.productFilterTotals().reduce((a, i) => a += i.PlannedValue, 0);
    //    return `${formatCurrency(totalValue, 0, 'en-GB', 'GBP')}`;
    //}, self);

    //self.branchTotalPlannedCount = ko.computed(() => {
    //    let totalCount = self.productFilterTotals().reduce((a, i) => a += i.PlannedCount, 0);
    //    return `(Q. ${formatNumber(totalCount, 0, 'en-GB')})`;
    //}, self);

    //self.branchTotalActualValue = ko.computed(() => {
    //    let totalValue = self.productFilterTotals().reduce((a, i) => a += i.ActualValue, 0);
    //    return `${formatCurrency(totalValue, 0, 'en-GB', 'GBP')}`;
    //}, self);

    //self.branchTotalActualCount = ko.computed(() => {
    //    let totalCount = self.productFilterTotals().reduce((a, i) => a += i.ActualCount, 0);
    //    return `(Q. ${formatNumber(totalCount, 0, 'en-GB')})`;
    //}, self);

    //self.branchTotalInProgressValue = ko.computed(() => {
    //    let totalValue = self.productFilterTotals().reduce((a, i) => a += i.InProgressValue, 0);
    //    return `${formatCurrency(totalValue, 0, 'en-GB', 'GBP')}`;
    //}, self);

    //self.branchTotalInProgressCount = ko.computed(() => {
    //    let totalCount = self.productFilterTotals().reduce((a, i) => a += i.InProgressCount, 0);
    //    return `(Q. ${formatNumber(totalCount, 0, 'en-GB')})`;
    //}, self);

    self.fetchDeals = ko.computed(() => {

            //self.filledRecords([]);

        //self.clearAddGridData();

        window.scrollTo({ top: 0, left: 0, behavior: "instant" });

        self.setBusy();

        let data = self.currentDealsParams();

        if (data) {

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

                    self.currentDeals(data.Results);
                })
                .catch(err => {
                    self.clearBusy();
                    window.catchFetchError(err);
                });
        }

    }, self);

    self.groupedSearchResults = ko.computed(() => {

        let key = "ProductFilterName";

        if (self.currentDeals() && self.currentDeals().length) {
            let results = [];

            // counts the number of *end* product rows we have rendered
            let runningCount = 0;

            // grouping initially by ProductFilterName. All search results must have a Product Filter Name, no exceptions.
            let productFilterGrouping = Object.groupBy(self.currentDeals(), (sr) => sr.ProductFilterName);

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