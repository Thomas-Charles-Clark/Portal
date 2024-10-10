const EMPTY_STRING = '',
    PATTERNBOOK_DISPLAY_ALL = 0,
    PATTERNBOOK_DISPLAY_CURRENT = 1,
    PATTERNBOOK_DISPLAY_LIMITED_DISCO = 2;

const patternBooksViewModel = (() => {
    var self = {};

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable("Please wait");

    self.tradeAccountId = ko.observable('');

    self.tradeAccount = ko.observable();

    self.setPatternBookProductId = ko.observable();

    self.patternBookProductId = ko.observable('');

    self.patternBookProduct = ko.observable();

    self.patternBookContents = ko.observableArray([]);

    self.patternBookView = ko.observable(PATTERNBOOK_DISPLAY_ALL);

    self.validatePatternBookNow = ko.observable(false);

    self.patternBookEmailInputVisible = ko.observable(false);

    self.patternBookEmail = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validatePatternBookNow()
            },
            message: 'Please provide a valid email address'
        },
        maxLength: 256,
        email: {
            params: true,
            onlyIf: function () {
                return self.validatePatternBookNow()
            },
            message: 'Invalid email format'
        },
        charsRemaining: {
            maxLength: 256,
            elementId: '#pattern-book-email-input'
        }
    });

    self.lastSentTo = ko.observable();

    self.showLastSentTo = ko.observable(false);

    //#endregion


    //#region Components (Knockout-specific)

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

    self.patternBookTemplate = (e) => {
        if (e.ProductID && e.Code && e.Name) {
            let name = e.Name.replace(e.Code, '').replace(/\s\s/g, ' ');
            return `<span title="${e.Code} - ${name}">${e.Code} - ${name}</span>`;
        } else {
            return '';
        }
    }

    self.tradeAccountParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Trade Account',
        odata: true,
        endPoint: '/odata/TradeAccounts/GetTradeAccountsForOrderBookSummary',
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
                        url: `/odata/TradeAccounts/Default.TradeAccountValueMapper(tradeAccountId=${options.value})`,
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
        dataBound: (e) => {
            if (self.setPatternBookProductId()) {
                self.patternBookProductId(self.setPatternBookProductId());
                self.setPatternBookProductId(undefined);
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
        sort: [{
            dir: 'asc',
            field: 'Code'
        }, {
            dir: 'asc',
            field: 'Name'
        }],
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
            appendTo: document.body
        }
    });

    self.patternBookParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Pattern Book',
        odata: true,
        endPoint: '/odata/products/Default.GetPatternBooks',
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
        template: self.patternBookTemplate,
        valueTemplate: self.patternBookTemplate,
        idObservable: self.patternBookProductId,
        objObservable: self.patternBookProduct,
        enable: self.tradeAccountId,
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: [{
            dir: 'asc',
            field: 'Code'
        }, {
            dir: 'asc',
            field: 'OrderFormName'
        }],
        select: function (e) {
            //console.log('patternBookParams select', e);
            self.fetchContents();
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
                d.$filter = `${d.$filter.replace("ShortLabel", "OrderFormName")} or ${d.$filter.replace("contains", "startswith").replace("ShortLabel", "Code")}`;
            }

            return d;
        },
        popupSettings: {
            appendTo: document.body
        }
    });

    //#endregion


    //#region Subscriptions

    self.tradeAccountId.subscribe(nv => {
        if (nv == null || nv == '') {
            self.patternBookParams.clearFunction();
        }
    });

    self.patternBookView.subscribe((nv) => {
        self.patternBookEmailInputVisible(false);
    });

    //#endregion


    //#region Computeds

    self.computer = ko.computed(() => {
        let tradeAccountId = self.tradeAccountId();
        let patternBookProductId = self.patternBookProductId();

        if (tradeAccountId != '' && patternBookProductId != '') {
            return true;
        } else {
            return false;
        }
    }, self);

    self.currentProducts = ko.computed(() => {
        return self.patternBookContents().filter(p => p.Status == 'C' || p.Status == 'Y');
    }, self);

    self.limitedProducts = ko.computed(() => {
        return self.patternBookContents().filter(p => p.Status == 'L');
    }, self);

    self.discontinuedProducts = ko.computed(() => {
        return self.patternBookContents().filter(p => p.Status == 'D');
    }, self);

    self.limitedDiscoProducts = ko.computed(() => {
        return self.patternBookContents().filter(p => p.Status == 'L' || p.Status == 'D');
    }, self);

    //#endregion


    //#region Validation Groups

    self.patternBookErrors = ko.validation.group([
        self.patternBookEmail
    ]);

    //#endregion


    //#region Functions

    self.reset = () => {
        self.patternBookErrors.showAllMessages(false);
        self.tradeAccountParams.clearFunction();
        self.patternBookParams.clearFunction();
        self.patternBookEmail(undefined);
        self.patternBookEmailInputVisible(false);
        self.showLastSentTo(false);
        self.lastSentTo(undefined);
    }

    self.fetchContents = ko.computed(() => {

        if (self.computer()) {
            self.busy(true);

            let params = {
                tradeAccountId: self.tradeAccountId(),
                productId: self.patternBookProductId()
            }

            console.log('fetchContents called with', params);

            fetch("/api/componentapi/FetchPatternBookContents", {
                method: "POST",
                cache: "no-cache",
                credentials: "same-origin",
                headers: window.fetchHeaders,
                body: JSON.stringify(params)
            })
                .then(window.handleFetchResponse)
                .then(data => {

                    self.busy(false);

                    console.log('fetchContents returned', data);

                    ko.ignoreDependencies(() => {
                        self.patternBookContents(data);
                    });

                })
                .catch(err => {
                    self.busy(false);
                    window.catchFetchError(err);
                });
        }

    }, self);

    self.emailPatternBookDiscoInfo = function () {
        self.validatePatternBookNow(true);
        if (self.patternBookErrors().length) {
            self.patternBookErrors.showAllMessages(true);
            self.patternBookErrors.filter(x => {
                x.isValid.notifySubscribers(x.isValid());
            })
            return;
        } else {
            self.busy(true);

            var discoItems = self.limitedDiscoProducts().map(x => {
                var result = $.extend({}, x);
                delete result.StockData;
                delete result.Currency;
                return result;
            });

            var data = {
                recipient: self.patternBookEmail(),
                patternBookCode: self.patternBookProduct().Code,
                patternBookName: self.patternBookProduct().BasketName,
                limitedDiscoItems: discoItems
            };

            console.log('emailPatternBookDiscoInfo calling with', data);

            $.ajax({
                url: '/api/componentapi/sendPatternBookDiscoEmail',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('emailPatternBookInfo returned', data);
                    self.validatePatternBookNow(false);
                    window.setTimeout(function () {
                        self.lastSentTo(self.patternBookEmail());
                        self.showLastSentTo(true);
                        self.busy(false);
                        window.setTimeout(function () {
                            self.patternBookErrors.showAllMessages(false);
                        }, 0);
                        window.setTimeout(function () {
                            self.showLastSentTo(false);
                        }, 5000);
                    }, 400);
                },
                error: function (xhr, s, a) {
                    self.validatePatternBookNow(false);
                    self.busy(false);
                    $.ajaxSettings.error(xhr, s, a);
                }
            });
        }
    }

    self.emailCurrentPatternBookInfo = function (statusArray) {
        self.validatePatternBookNow(true);
        if (self.patternBookErrors().length) {
            self.patternBookErrors.showAllMessages(true);
            return;
        } else {
            self.busy(true);

            var currentItems = self.patternBookContents().filter(x => {
                return x.Status == 'C' || x.Status == 'Y'
            }).map(x => {
                var result = $.extend({}, x);
                delete result.StockData;
                delete result.Currency;
                return result;
            });

            var data = {
                recipient: self.patternBookEmail(),
                patternBookCode: self.patternBookProduct().Code,
                patternBookName: self.patternBookProduct().BasketName,
                currentItems: currentItems
            };

            console.log('emailPatternBookCurrentInfo calling with', data);

            $.ajax({
                url: '/api/componentapi/sendPatternBookCurrentEmail',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('emailPatternBookCurrentInfo returned', data);
                    self.validatePatternBookNow(false);
                    window.setTimeout(function () {
                        self.lastSentTo(self.patternBookEmail());
                        self.showLastSentTo(true);
                        self.busy(false);
                        window.setTimeout(function () {
                            self.patternBookErrors.showAllMessages(false);
                        }, 0);
                        window.setTimeout(function () {
                            self.showLastSentTo(false);
                        }, 5000);
                    }, 400);
                },
                error: function (xhr, s, a) {
                    self.validatePatternBookNow(false);
                    self.busy(false);
                    $.ajaxSettings.error(xhr, s, a);
                }
            });
        }
    }

    self.emailAllInfo = () => {
        self.validatePatternBookNow(true);
        if (self.patternBookErrors().length) {
            self.patternBookErrors.showAllMessages(true);
            return;
        } else {
            self.busy(true);

            var items = self.patternBookContents().map(x => {
                var result = $.extend({}, x);
                delete result.StockData;
                delete result.Currency;
                return result;
            });

            var data = {
                recipient: self.patternBookEmail(),
                patternBookCode: self.patternBookProduct().Code,
                patternBookName: self.patternBookProduct().BasketName,
                items: items
            };

            console.log('emailAllInfo calling with', data);

            $.ajax({
                url: '/api/componentapi/sendPatternBookAllEmail',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('emailAllInfo returned', data);
                    self.validatePatternBookNow(false);
                    window.setTimeout(function () {
                        self.lastSentTo(self.patternBookEmail());
                        self.showLastSentTo(true);
                        self.busy(false);
                        window.setTimeout(function () {
                            self.patternBookErrors.showAllMessages(false);
                        }, 0);
                        window.setTimeout(function () {
                            self.showLastSentTo(false);
                        }, 5000);
                    }, 400);
                },
                error: function (xhr, s, a) {
                    self.validatePatternBookNow(false);
                    self.busy(false);
                    $.ajaxSettings.error(xhr, s, a);
                }
            });
        }
    }

    self.setTest = () => {
        self.tradeAccountId(36691);
        self.setPatternBookProductId(196548);
    }

    self.sendEmail = () => {
        switch (self.patternBookView()) {
            case PATTERNBOOK_DISPLAY_CURRENT:
                self.emailCurrentPatternBookInfo();
                break;
            case PATTERNBOOK_DISPLAY_LIMITED_DISCO:
                self.emailPatternBookDiscoInfo();
                break;
            case PATTERNBOOK_DISPLAY_ALL:
                self.emailAllInfo();
                break;
            default: break;
        }
    }

    self.downloadXlsx = () => {
        let code = self.patternBookProduct().Code;

        switch (self.patternBookView()) {
            case PATTERNBOOK_DISPLAY_CURRENT:
                self.fetchXlsx(self.currentProducts().map(p => p.ProductID), code, 'Current');
                break;
            case PATTERNBOOK_DISPLAY_LIMITED_DISCO:
                self.fetchXlsx(self.limitedDiscoProducts().map(p => p.ProductID), code, 'Limited-Discontinued');
                break;
            case PATTERNBOOK_DISPLAY_ALL:
                self.fetchXlsx(self.patternBookContents().map(p => p.ProductID), code, 'All');
                break;
            default: break;
        }
    }

    self.fetchXlsx = (productIds, code, type) => {
        self.busy(true);
        fetch('/api/patternbooksapi/FetchXlsx', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify({
                productId: self.patternBookProductId(),
                tradeAccountId: self.tradeAccountId(),
                productIds: productIds,
                code: code,
                type: type
            })
        })
            .then(response => response.blob())
            .then(blob => {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `${code}-${type}-Products.xlsx`;
                link.click();
                self.busy(false);
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            });
    }

    self.downloadPdf = () => {
        let code = self.patternBookProduct().Code;
        let name = self.patternBookProduct().BasketName;

        switch (self.patternBookView()) {
            case PATTERNBOOK_DISPLAY_CURRENT:
                self.fetchPdf(self.currentProducts().map(p => p.ProductID), code, name, 'Current');
                break;
            case PATTERNBOOK_DISPLAY_LIMITED_DISCO:
                self.fetchPdf(self.limitedDiscoProducts().map(p => p.ProductID), code, name, 'Limited-Discontinued');
                break;
            case PATTERNBOOK_DISPLAY_ALL:
                self.fetchPdf(self.patternBookContents().map(p => p.ProductID), code, name, 'All');
                break;
            default: break;
        }
    }

    self.fetchPdf = (productIds, code, name, type) => {
        self.busy(true);
        fetch('/api/patternbooksapi/FetchPDF', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify({
                productId: self.patternBookProductId(),
                tradeAccountId: self.tradeAccountId(),
                productIds: productIds,
                code: code,
                name: name,
                type: type
            })
        })
            .then(response => response.blob())
            .then(blob => {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `${code}-${type}-Products.pdf`;
                link.click();
                self.busy(false);
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            });
    }

    //#endregion


    //#region Events



    //#endregion

    return self;
});