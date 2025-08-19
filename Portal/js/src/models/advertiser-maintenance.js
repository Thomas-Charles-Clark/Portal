const EMPTY_STRING = '';

const advertiserMaintenanceViewModel = (() => {
    var self = {};

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable("Please wait");
    
    // exists just to satisfy demand from generic-form-fields.js:28
    self.parent = {
        ready: ko.observable(true)
    }

    self.validateNow = ko.observable(false);

    self.salesMarketId = ko.observable(getPreselectedSalesMarketId());

    self.salesMarket = ko.observable();

    self.advertiserClassId = ko.observable('');

    self.advertiserClass = ko.observable();

    self.emailer = emailer({ parent: self, sendLabel: 'Send <span class="bi bi-send ms-2"></span>' });

    self.emailer.to(getUserEmail());
    self.emailer.subject(`Advertiser Group Maintenance Info`);
    self.emailer.originalSubject(self.emailer.subject());

    self.emailer.send = () => {

        self.emailer.validateSendNow(true);

        var errors = self.emailer.emailErrors().concat(self.errors());

        if (errors.length) {
            self.emailer.emailErrors.showAllMessages(true);
            self.emailer.emailErrors.filter(function (x) {
                x.isValid.notifySubscribers(x.isValid());
            });
            //self.errors.showAllMessages(true);
            //self.errors.filter(function (x) {
            //    x.isValid.notifySubscribers(x.isValid());
            //});
        } else {
            self.busy(true);
            fetch('/api/advertisermaintenanceapi/SendAdvertiserMaintenanceNotice', {
                method: 'POST',
                dataType: 'json',
                headers: window.fetchHeaders,
                body: JSON.stringify({
                    to: self.emailer.to(),
                    subject: self.emailer.subject(),
                    replyTo: self.emailer.replyTo(),
                    body: self.emailer.body(),
                    giftVoucherCode: self.giftVoucher().Code
                })
            }).then(window.handleFetchResponse)
                .then(data => {
                    self.busy(false);
                    self.emailer.sentTo(self.emailer.to());
                    self.emailer.showLastSentTo(true);
                    window.setTimeout(function () {
                        self.emailer.showLastSentTo(false);
                    }, 5000);
                    window.showInfo("Sent", "That Gift Voucher was emailed successfully.");
                })
                .catch(err => {
                    self.busy(false);
                    window.showError("Sorry, there was an error sending that email.");
                });
        }
    }

    self.filteredContent = ko.observableArray([]);

    self.attributes = ko.observableArray([]);

    self.visibleTradeAccounts = ko.observableArray([]);

    //#endregion

    //#region Lifted Methods

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

            let unsaved = false; // array.find(p => p.unsavedChanges());

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

    //#region Components (Knockout-specific)

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
        disable: ko.observable(getPreselectedSalesMarketId() != ''),
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
        dataBound: function (e) {
            //self.genericSelectSoleResult(e, self.salesMarketId)k
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

            //if (self.tradeAccountId()) {
            //    d.$filter = `TradeAccounts/any(ta: ta/TradeAccountID eq ${self.tradeAccountId()})`
            //}

            //if (self.salesRepresentativeId()) {
            //    let f = `SalesRepresentative_SalesMarkets/any(sm: sm/SalesRepresentativeID eq ${self.salesRepresentativeId()})`;

            //    if (d.$filter) {
            //        d.$filter = `${d.$filter} and ${f}`
            //    } else {
            //        //Add filter by matching any reference containing value
            //        d.$filter = f;
            //    }
            //}

            return d;
        },
    });

    self.advertiserClassParams = kendoMDCDropDownList({
        label: 'Advertiser Class',
        odata: true,
        endPoint: '/odata/AdvertiserClasses',
        textField: 'Name',
        valueField: 'AdvertisingClassID',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/AdvertiserClasses/Default.AdvertiserClassValueMapper(advertiserClassId=${options.value})`,
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
        idObservable: self.advertiserClassId,
        objObservable: self.advertiserClass,
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
            field: 'AdvertiserClassID'
        },
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: function (e) {
            //self.genericSelectSoleResult(e, self.salesMarketId)k
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            //if (self.salesMarketId()) {
            //    d.$filter = `SalesMarkets/any(sa: sa/SalesMarketID eq ${self.salesMarketId()})`
            //}

            return d;
        },
    });

    self.pager = pagerViewModel(self);

    //#endregion


    //#region Subscriptions

    self.advertiserClass.subscribe(nv => {
        console.log('advertiserClass', nv);
    });

    //#endregion


    //#region Computeds

    self.tradeAccounts = ko.computed(() => {
        if (self.advertiserClass()) {
            return self.advertiserClass().TradeAccounts;
        }
    }, self);

    self.tradeAccountRenderer = ko.pureComputed({
        read: () => {

            let page = self.pager.page();

            let pageSize = self.pager.pageSize();

            let sort = self.pager.sort();

            let attributes = self.selectedAttributes();

            let results = attributes.some(() => true)
                ? self.tradeAccounts().flatMap(pp => self.articleIdsForCurrentAttributes().includes(pp.ArticleID) ? [pp] : [])
                : self.tradeAccounts();

            self.filteredContent(results);

            let aposReg = /'/g;
            let empty = '';

            switch (sort) {
                case "alphaAZ":
                    results.sort((a, b) => {
                        if (a.ShortLabel?.replace(aposReg, empty) < b.ShortLabel?.replace(aposReg, empty))
                            return -1;
                        if (a.ShortLabel?.replace(aposReg, empty) > b.ShortLabel?.replace(aposReg, empty))
                            return 1;
                        return 0;
                    });
                    //results = Enumerable.From(results)
                    //    .OrderBy(p => p.AZSortOrder)
                    //    .ThenBy(p => p.MerchandisedSortOrder)
                    //    .ToArray();
                    break;
                case "alphaZA":
                    results.sort((a, b) => {
                        if (a.ShortLabel?.replace(aposReg, empty) > b.ShortLabel?.replace(aposReg, empty))
                            return -1;
                        if (a.ShortLabel?.replace(aposReg, empty) < b.ShortLabel?.replace(aposReg, empty))
                            return 1;
                        return 0;
                    });
                    //results = Enumerable.From(results)
                    //    .OrderByDescending(p => p.AZSortOrder)
                    //    .ThenBy(p => p.MerchandisedSortOrder)
                    //    .ToArray();
                    break;
                case "new":
                    results.sort((a, b) => {
                        if (a.CreatedDT < b.CreatedDT)
                            return -1;
                        if (a.CreatedDT > b.CreatedDT)
                            return 1;
                        if (a.ShortLabel?.replace(aposReg, empty) < b.ShortLabel?.replace(aposReg, empty))
                            return -1;
                        if (a.ShortLabel?.replace(aposReg, empty) > b.ShortLabel?.replace(aposReg, empty))
                            return 1;
                        return 0;
                    });
                    //results = Enumerable.From(results)
                    //    .OrderBy(p => p.NewSort)
                    //    .ToArray();
                    break;
                default:
                    //results = Enumerable.From(results)
                    //    .OrderBy(p => p.MerchandisedSortOrder)
                    //    .ToArray();
                    results.sort((a, b) => {
                        if (a.Code < b.Code)
                            return -1;
                        if (a.Code > b.Code)
                            return 1;
                    });
                    break;
            }

            //results = Enumerable.From(results)
            //    .Skip((page - 1) * pageSize)
            //    .Take(pageSize)
            //    .ToArray();

            results = results.slice((page - 1) * pageSize, ((page - 1) * pageSize) + pageSize);
            //.Skip((page - 1) * pageSize)
            //.Take(pageSize)
            //.ToArray();

            //console.log('articleRenderer', results);

            self.visibleTradeAccounts(results);

            //if (self.domElement.skipScroll == true) {
            //    if (self.allArticlesReady())
            //        self.domElement.skipScroll = false;
            //} else {
            //    if (self.domElement.hasOwnProperty('DOMElement')) {
            //        if (window.scrollY > self.domElement.DOMElement.offsetTop) {
            //            window.scrollTo({
            //                top: self.domElement.DOMElement.offsetTop,
            //                left: 0,
            //                behavior: 'smooth'
            //            });
            //        }
            //    }
            //}

            return results;
        }
    }, self)
        .extend({
            rateLimit: {
                method: 'notifyWhenChangesStop',
                timeout: 10
            }
        });

    //#endregion


    //#region Validation Groups

    self.errors = ko.validation.group([

    ]);

    //#endregion


    //#region Methods#

    self.reset = () => {
        self.errors.showAllMessages(false);
    }

    self.setTest = () => {

    }

    //#endregion


    //#region Events



    //#endregion

    return self;
});

const advertiserGroupViewModel = (advertiserGroup = {}) => {
    var self = Object.assign({

    }, advertiserGroup);

    //#region Properties
     
    self.validateNow = ko.observable(false);

    //#endregion

    //#region Lifted Methods

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

            let unsaved = false; // array.find(p => p.unsavedChanges());

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

    //#region Components (Knockout-specific)



    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Computeds



    //#endregion


    //#region Validation Groups

    self.errors = ko.validation.group([

    ]);

    //#endregion


    //#region Methods

    self.save = () => {

    }

    //#endregion


    //#region Events



    //#endregion

    return self;
};