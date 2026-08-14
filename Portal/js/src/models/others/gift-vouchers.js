const giftVouchersViewModel = (() => {
    var self = {};

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable("Please wait");

    self.giftVoucherId = ko.observable('');

    self.giftVoucher = ko.observable();

    self.giftVoucherCreator = giftVoucherCreatorViewModel({ parent: self });

    self.giftVoucherNotesEditor = giftVoucherNotesEditorViewModel({ parent: self });

    self.giftVoucherRedeemer = giftVoucherRedeemerViewModel({ parent: self });

    self.giftVoucherExtender = giftVoucherExtenderViewModel({ parent: self });

    self.giftVoucherCanceller = giftVoucherCancellerViewModel({ parent: self });

    self.loadedCode = window.getGiftVoucherCode();

    // exists just to satisfy demand from generic-form-fields.js:28
    self.parent = {
        ready: ko.observable(true)
    }
    self.validateNow = ko.observable(false);
    // hmph

    self.emailer = emailer({ parent: self, sendLabel: 'Send <span class="bi bi-send ms-2"></span>' });

    self.emailer.to(getUserEmail());
    self.emailer.subject(`Designers Guild Gift Voucher`);
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
            fetch('/api/giftvouchersapi/SendGiftVoucher', {
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

    self.giftVoucherAutocomplete = fieldFactory.createField({
        value: self.giftVoucher,
        fieldId: "gift-voucher-autocomplete",
        fieldName: "GiftVoucherAutocomplete",
        label: "Gift Voucher",
        layoutClass: "mb-3",
        labelField: 'Code',
        tooltip: null,
        note: null,
        required: true,
        postable: true,
        disabled: false,
        fieldTypeId: 6,
        autocompleteMinLength: 2,
        autocompleteEndpoint: '/api/GiftVouchersAPI/Autocomplete',
        select: (obj, event) => {
            console.log('select', obj, event);

            self.busy(true);

            fetch('/api/giftVouchersApi/GiftVoucherSelect', {
                method: 'POST',
                headers: window.fetchHeaders,
                cache: "no-cache",
                credentials: "same-origin",
                body: JSON.stringify({
                    code: obj.Code
                })
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    console.log('GiftVoucher_Select returned', data);
                    self.busy(false);
                    self.giftVoucher(data);
                })
                .catch(err => {
                    self.busy(false);
                    window.catchFetchError(err);
                })
        },
        responseMap: (data) => {

            let results = data.map(d => giftVoucherViewModel({
                rec: d, parent: self
            }));

            return results;
        },
        afterResponse: (data) => {
            if (data.length) {
                if (data.length == 1) {
                    self.giftVoucher(data[0]);
                    self.giftVoucherAutocompleteParams.autocompleteSettings.observable(data[0].Code);
                    $(self.giftVoucherAutocomplete.value.DOMElement).autocomplete('close')
                }
            }
            else {
                window.setTimeout(() => {
                    document.querySelector('#gift-voucher-autocomplete input').focus();
                }, 0);
            }
        },
        clearFunction: () => {
            self.giftVoucher(undefined);
            self.giftVoucherAutocompleteParams.autocompleteSettings.value(undefined);
        }
    }, self);

    self.giftVoucherAutocompleteParams = self.giftVoucherAutocomplete.params;

    self.giftVoucherTemplate = (item) => {
        if (item.GiftVoucherID != null && item.Code != '') {
            return `<span class="gift-voucher-label" title="GiftVoucherID: ${item.GiftVoucherID}">${item.Code}</span>`;
        } else {
            return ``;
        }
    }

    self.giftVoucherParams = kendoMDCDropDownList({
        label: 'Gift Voucher Code (e.g. ABCD-1234-EFGH-5678)',
        autoBind: true,
        odata: true,
        endPoint: '/odata/GiftVouchers?$expand=GiftVoucherType,OrderLines($expand=OrderHead),PriceList($expand=Currency)',
        textField: 'Code',
        valueField: 'GiftVoucherID',
        virtual: true,
        pageSize: 1,
        busy: ko.observable(),
        minLength: 16,
        enforceMinLength: true,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/GiftVouchers/Default.GiftVoucherValueMapper(code=${options.value})?$expand=GiftVoucherType,OrderLines($expand=OrderHead),PriceList($expand=Currency)`,
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
        template: self.giftVoucherTemplate,
        valueTemplate: self.giftVoucherTemplate,
        noDataTemplate: `Please provide a valid Gift Voucher code`,
        idObservable: self.giftVoucherId,
        objObservable: self.giftVoucher,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'equals',
        height: 34,
        sort: [{
            dir: 'desc',
            field: 'CreatedDT'
        }],
        requestStart: (e) => {
            self.giftVoucherParams.busy(true);
        },
        requestEnd: (e) => {
            console.log(e);

            if (e.response.value.length) {
                let arr = e.response.value.map(gv => giftVoucherViewModel({ rec: gv, parent: self }));

                e.response.value = arr;

                if (arr.length == 1 && self.loadedCode) {
                    self.giftVoucherParams.dropDownListSettings.widget().select(0);
                    self.giftVoucherParams.dropDownListSettings.widget().trigger('change');
                }
            }

            self.giftVoucherParams.busy(false);
        },
        clearFunction: self.genericUnsavedChangesClear,
        afterClear: () => {
            self.giftVoucher(undefined);
        },
        parameterMap: (data) => {

            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            let filters = [];

            if (d.$filter == null) {
                d.$filter = "Code eq ''";
            }

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            return d;
        }
    });

    self.gridWidget = ko.observable();

    self.gridColumns = [{
        field: 'GiftVoucherID',
        title: 'ID',
        width: 100
    }, {
        field: 'GiftVoucherTypeID',
        title: 'Type',
        width: 120,
        filterable: {
            multi: true,
            dataSource: getGiftVoucherTypes(),
            operators: {
                contains: "Equals"
            }
        }
    }, {
        field: 'PriceListID',
        title: 'Price List',
        width: 120,
        filterable: {
            multi: true,
            dataSource: getPriceLists(),
            itemTemplate: (e) => `${e.Name}`,
            operators: {
                contains: "Equals"
            }
        },
        template: function (item) {
            return item.PriceList.Name;
        }
    }, {
        field: 'Code',
        title: 'Code',
        width: 240
    }, {
        field: 'ValueInc',
        title: 'Value (Inc.)',
        width: 100
    }, {
        field: 'ValueEx',
        title: 'Value (Ex.)',
        width: 100
    }, {
        field: 'CreatedDT',
        title: 'Created',
        width: 120
    }, {
        field: 'AuthorisedDT',
        title: 'Authorised',
        width: 120
    }, {
        field: 'ExpiryDT',
        title: 'Expiry',
        width: 120
    }, {
        field: 'UsedDT',
        title: 'Used',
        width: 120
    }, {
        field: 'CancelledDT',
        title: 'Cancelled',
        width: 120
    }, {
        field: 'RedeemTransactionID',
        title: 'Redeemed with<br/>Transaction',
        width: 140
    }, {
        field: 'SaleTransactionID',
        title: 'Sold with<br/>Transaction',
        width: 140
    }, {
        field: 'CreatedByMember',
        title: 'Created By',
        width: 140,
        template: (e) => {
            return e.CreatedByMember?.FullName ?? "eCommerce";
        },
        filterable: false,
        attributes: {
            class: 'text-right'
        }
    }, {
        field: 'CustomCommands',
        title: ' ',
        width: 360,
        template: (e) => {

        }
    }];

    self.gridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {

        };

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        $.ajax({
            url: '/api/giftvouchersapi/FetchGiftVouchers',
            type: "GET",
            dataType: 'json',
            data: data,
            success: function (data) {
                options.success(data);
            },
            error: function (xhr, s, a) {
                $.ajaxSettings.error(xhr, s, a);
                options.error();
            }
        });
    }

    self.gridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.gridDataSourceRead,
            update: function (e) {
                $.ajax({
                    url: '/api/giftvouchersapi/UpdateGiftVouchers',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        models: e.data.models
                    },
                    success: function (data) {

                        self.gridWidget().one("dataBound", function (e) {
                            e.sender.dataSource.read();
                        });

                        e.success(data);
                    },
                    error: function (xhr, s, a) {
                        e.error(xhr, s, a);
                    }
                });
            }
        },
        batch: false,
        sortable: true,
        filterable: true,
        grouping: false,
        serverFiltering: true,
        serverGrouping: false,
        serverPaging: true,
        serverAggregates: true,
        serverSorting: true,
        pageSize: 20,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "AggregateResults",
            model: {
                id: 'GiftVoucherID',
                fields: {
                    GiftVoucherID: { type: 'number', editable: false },
                    GiftVoucherTypeID: { type: 'number', editable: true },
                    GiftVoucherType: { type: 'object', editable: false },
                    Code: { type: 'string', editable: false },
                    PriceListID: { type: 'number', editable: true },
                    PriceList: { type: 'object', editable: false },
                    ValueInc: { type: 'number', editable: true },
                    ValueEx: { type: 'number', editable: true },
                    CreatedDT: { type: 'date', editable: false },
                    AuthorisedDT: { type: 'date', editable: false },
                    ExpiryDT: { type: 'date', editable: false },
                    UsedDT: { type: 'date', editable: false },
                    CancelledDT: { type: 'date', editable: false },
                    RedeemTransactionID: { type: 'number', editable: true },
                    SaleTransactionID: { type: 'number', editable: true },
                    CreatorUserID: { type: 'string', editable: false },
                    CreatorMemberID: { type: 'string', editable: false },
                    CreditTransactionID: { type: 'number', editable: true },
                    Reason: { type: 'string', editable: true }
                }
            }
        }),
        aggregate: [],
        sort: {
            field: 'GiftVoucherID',
            dir: 'desc'
        },
        //sort: { field: "BasketID", dir: "desc" },
        requestStart: function (e) {
            self.busy(true);
        },
        requestEnd: function (e) {
            if (e.type == "update") {
                if (e.response) {
                    if (!e.response.Errors) {
                        e.sender.read();
                    } else {
                        self.busy(false);
                    }
                } else {
                    self.busy(false);
                }
            } else {
                self.busy(false);
            }
        },
        noDataTemplate: 'Nothing to display'
    });

    self.giftVouchersGridSettings = {
        autoBind: true,
        widget: self.gridWidget,
        columns: self.gridColumns,
        data: self.gridDataSource,
        useKOTemplates: true,
        rowTemplate: 'gift-voucher-row-template',
        sortable: true,
        groupable: false,
        filterable: true,
        reorderable: true,
        editable: false,
        selectable: false,
        navigatable: true,
        paging: true,
        pageSize: 20,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        }
    }

    //#endregion


    //#region Subscriptions

    self.giftVoucher.subscribe(nv => {
        if (nv) {
            self.emailer.body(`Dear Customer,

Please find attached your Designers Guild Gift Voucher.

Code: ${nv.Code}
Value: ${nv.PriceList.Currency.Symbol}${nv.ValueInc}


Thank you for shopping with Designers Guild`);
            self.emailer.originalBody(self.emailer.body());
        }
    });

    //#endregion


    //#region Computeds



    //#endregion


    //#region Validation Groups

    self.errors = ko.validation.group([

    ]);

    //#endregion


    //#region Methods

    self.reset = () => {
        self.errors.showAllMessages(false);
    }

    self.setTest = () => {

    }

    self.beginNewVoucher = () => {
        self.giftVoucherCreator.show();
    }

    self.cancelNewVoucher = () => {
        self.giftVoucherCreator.hide();
    }

    self.proceedNewVoucher = () => {
        console.warning("proceedNewVoucher incomplete");
        self.giftVoucherCreator.hide();
    }

    self.viewVoucher = (voucher) => {
        window.open(`/customers/gift-vouchers/pdf?code=${voucher.Code}`, '_blank');
    }

    self.emailVoucher = (voucher) => {
        self.giftVoucherId(voucher.GiftVoucherID);
        bootstrap.Tab.getOrCreateInstance(document.querySelector('#find-tab-btn')).show();
        window.setTimeout(() => {
            document.querySelectorAll('.emailer-collapse').forEach(e => {
                bootstrap.Collapse.getOrCreateInstance(e).show();
            });
        }, 150);
    }

    //#endregion


    //#region Events



    //#endregion

    return self;
});


const giftVoucherCreatorViewModel = (({ parent } = { parent: null }) => {
    var self = {
        parent: parent
    };

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable("Please wait");

    self.validateNow = ko.observable(false);

    self.productId = ko.observable().extend({
        notEqual: {
            params: '',
            onlyIf: self.validateNow,
            message: "You must specify a Gift Voucher"
        },
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: "You must specify a Gift Voucher" 
        }
    });

    self.product = ko.observable();

    self.code = ko.observable(crypto.randomUUID().toUpperCase().substring(4, 23)).extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: "Code is required"
        }
    });

    let expiry = new Date();

    expiry.setFullYear(expiry.getFullYear() + 1);

    self.expiryDate = ko.observable(expiry);

    self.isVoucherCredit = ko.observable(false);

    self.creditOrderId = ko.observable().extend({
        notEqual: {
            params: '',
            onlyIf: self.validateNow,
            message: "You have indicated that this voucher credits an order. Please specify the order which this voucher credits."
        },
        required: {
            params: true,
            onlyIf: () => {
                return self.validateNow() && self.isVoucherCredit()
            },
            message: "You have indicated that this voucher credits an order. Please specify the order which this voucher credits."
        }
    });

    self.creditOrder = ko.observable();

    self.giftVoucherTypeId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: () => {
                return self.validateNow();
            },
            message: "You must specify a Gift Voucher Type"
        }
    });

    self.giftVoucherType = ko.observable();

    self.priceListId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: () => {
                return self.validateNow();
            },
            message: "You must specify a Price List"
        }
    });

    self.priceList = ko.observable();

    self.valueEx = ko.observable();

    self.valueInc = ko.observable();

    self.notes = ko.observable();

    self.message = ko.observable().extend({
        rateLimit: {
            timeout: 300,
            method: 'notifyWhenChangesStop'
        }
    });

    self.base64 = ko.observable();

    //#endregion


    //#region Components

    self.codeParams = {
        label: 'Code',
        originalValue: ko.observable(),
        observable: self.code,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: false,
        rows: 10,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: false,
        enable: ko.observable(true),
        disable: ko.observable(true),
        readonly: ko.observable(true),
        busy: ko.observable(false),
        clearable: ko.observable(false),
        revertible: ko.observable(false),
        visible: ko.observable(true)
    };

    self.productParams = kendoMDCDropDownList({
        label: 'Product',
        odata: true,
        endPoint: '/odata/Products/GetProductsForGiftVouchers',
        textField: 'ShortLabel',
        valueField: 'ProductID',
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        virtual: false,
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
            dir: 'asc',
            field: 'Code'
        },
        parameterMap: (data) => {
        //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            if (self.priceListId()) {
                if (d.$filter)
                    d.$filter = `${d.$filter} and (Prices/any(price: price/PriceListID eq ${self.priceListId()}))`;
                else {
                    d.$filter = `(Prices/any(price: price/PriceListID eq ${self.priceListId()}))`;
                }
            }

            if (d.$filter && d.$filter.indexOf('contains(tolower(ShortLabel)' === 0)) {
                d.$filter = `${d.$filter.replace("ShortLabel", "Name")} or ${d.$filter.replace("contains", "startswith").replace("ShortLabel", "Code")}`;
            }

            return d;
        }
    });

    self.expiryDateParams = {
        label: "Expiry",
        observable: self.expiryDate,
        originalValue: self.expiryDate(),
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
                cellSize: '3rem'
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
            },
            viewDate: new Date(self.expiryDate())
        },
        clearable: ko.observable(false),
        clearFunction: () => {
            self.expiryDate(undefined);
        },
        revertible: ko.observable(true),
        revertFunction: () => {
            self.expiryDate.observable(self.expiryDateParams.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true
    };

    self.isVoucherCreditParams = {
        checkboxId: "voucher-credit",
        label: "Is this voucher crediting an order?",
        observable: self.isVoucherCredit,
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: self.busy,
    }

    self.creditOrderParams = kendoMDCDropDownList({
        label: 'Credit Order ID',
        odata: true,
        endPoint: `/odata/Orders`,
        textField: 'ShortLabel',
        valueField: 'OrderID',
        virtual: true,
        autoBind: false,
        minLength: 3,
        enforceMinLength: true,
        pageSize: 10,
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
        idObservable: self.creditOrderId,
        objObservable: self.creditOrder,
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
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            if (data && data.filter && data.filter.filters && data.filter.filters.length) {
                data.pageSize = 40;
            } else {
                data.pageSize = 0;
            }

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            if (d.$filter && d.$filter.indexOf('contains(tolower(ShortLabel)' === 0)) {
                d.$filter = `${d.$filter.replace("ShortLabel", "CustomerOrderReference")} or ${d.$filter.replace("contains", "startswith").replace("ShortLabel", "OrderID")}`;
            }

            return d;
        }
    });

    self.giftVoucherTypeParams = kendoMDCDropDownList({
        label: 'Gift Voucher Type',
        data: getGiftVoucherTypes(),
        textField: 'Name',
        valueField: 'GiftVoucherTypeID',
        virtual: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        idObservable: self.giftVoucherTypeId,
        objObservable: self.giftVoucherType,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: false,
        autoBind: true
    });

    self.priceListParams = kendoMDCDropDownList({
        label: 'Price List',
        odata: true,
        endPoint: '/odata/PriceLists?$expand=Currency',
        textField: 'Name',
        valueField: 'PriceListID',
        virtual: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        idObservable: self.priceListId,
        objObservable: self.priceList,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            return d;
        }
    });

    self.messageParams = {
        label: 'Message',
        originalValue: ko.observable(),
        observable: self.message,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        rows: 5,
        maxNewLines: 5,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: false,
        charsRemainingOptions: {
            maxLength: 255
        },
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        visible: ko.observable(true),
        focusObservable: ko.observable(false)
    };

    self.notesParams = {
        label: 'Internal Notes',
        originalValue: ko.observable(),
        observable: self.notes,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        rows: 10,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: false,
        charsRemainingOptions: {
            maxLength: 2000
        },
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        visible: ko.observable(true)
    };

    //#endregion


    //#region Subscriptions

    self.isVoucherCredit.subscribe(nv => {
        if (nv) {
            self.giftVoucherTypeId(2);
            self.giftVoucherTypeParams.disable(true);
        } else {
            self.giftVoucherTypeParams.clearFunction();
            self.giftVoucherTypeParams.disable(false);
        }
    });

    self.giftVoucherTypeId.subscribe(nv => {
        if (nv == 2) {
            self.isVoucherCredit(true);
        } else {
            self.isVoucherCredit(false);
            self.creditOrderParams.clearFunction();
        }
    });

    self.messageParams.focusObservable.subscribe(nv => {
        if (!nv) {
            self.code.valueHasMutated();
        }
    })

    //#endregion


    //#region Computeds

    self.previewSrc = ko.computed(() => {
        let productId = self.productId();
        let code = self.code();
        let priceListId = self.priceListId();

        let message = self.message.peek();

        if (productId &&
            code &&
            priceListId) {

            var params = {
                productId: productId,
                priceListId: priceListId,
                code: code,
                expiryDt: self.expiryDate(),
                currencySymbol: self.priceList().Currency.Symbol,
                message: message
            }

            fetch("/api/giftvouchersapi/fetchGiftVoucherPreview", {
                method: "POST",
                headers: window.fetchHeaders,
                cache: "no-cache",
                credentials: "same-origin",
                body: JSON.stringify(params)
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    self.base64(data.base64string);
                })
            }
    }, self).extend({
        rateLimit: {
            timeout: 300,
            method: 'notifyWhenChangesStop'
        }
    });

    //#endregion


    //#region Validation Groups

    self.errors = ko.validation.group([
        self.code,
        self.priceListId,
        self.productId,
        self.giftVoucherTypeId,
        self.creditOrderId,
        self.message,
        self.notes
    ]);

    //#endregion


    //#region Methods

    self.reset = () => {
        self.validateNow(false);

        self.base64(undefined);

        self.code(crypto.randomUUID().toUpperCase().substring(4, 23));

        self.priceListParams.clearFunction();

        let expiry = new Date();

        expiry.setFullYear(expiry.getFullYear() + 1);

        self.expiryDate(expiry);

        self.isVoucherCredit(false);

        self.creditOrderParams.clearFunction();

        self.productParams.clearFunction();

        self.giftVoucherTypeParams.clearFunction();

        self.messageParams.clearFunction();

        self.notesParams.clearFunction();
    }

    self.proceed = () => {
        self.validateNow(true);
        self.errors.showAllMessages(false);

        if (self.errors().length) {
            self.errors.showAllMessages(true);
            self.errors().filter(x => {
                x.isValid.notifySubscribers(x.isValid());
            });
        } else {

            window.showConfirm("Are you sure?", "This action will create the gift voucher.", () => {

                self.busy(true);

                let params = {
                    productId: self.productId(),
                    guid: self.code(),
                    creditOrderId: self.creditOrderId(),
                    giftVoucherTypeId: self.giftVoucherTypeId(),
                    priceListId: self.priceListId(),
                    valueEx: 0,
                    valueInc: 0,
                    notes: self.notes(),
                    message: self.message()
                };

                fetch("/api/giftvouchersapi/create", {
                    method: "POST",
                    headers: window.fetchHeaders,
                    cache: "no-cache",
                    credentials: "same-origin",
                    body: JSON.stringify(params)
                })
                    .then(window.handleFetchResponse)
                    .then(data => {
                        self.reset();
                        self.busy(false);
                        window.showInfo("Thank you", "That gift voucher was created successfully.");
                    })
                    .catch(err => {
                        self.busy(false);
                        window.catchFetchError(err);
                    })

            }, () => {

            });
        }
    }

    //#endregion


    //#region Events

    document.querySelector("#create-tab-btn").addEventListener("show.bs.tab", (e) => {
        self.code(crypto.randomUUID().toUpperCase().substring(4, 23));
    });

    //#endregion

    return self;
});



const giftVoucherNotesEditorViewModel = (({ parent } = { parent: null }) => {
    var self = {
        parent: parent
    };

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable("Please wait");

    self.validateNow = ko.observable(false);

    self.modalElement = document.querySelector("#notes-editor-modal");

    self.modal = bootstrap.Modal.getOrCreateInstance(self.modalElement);

    self.modal._element.addEventListener('shown.bs.modal', () => {
        self.modal._focustrap.deactivate();
    });

    self.orderId = ko.observable().extend({
        numberFormatted: {
            digits: 0,
            currency: ko.observable({ FormattingCulture: "en-GB" })
        }
    });

    self.order = ko.observable();

    self.notes = ko.observable().extend({
        required: {
            params: true,
            onlyIf: () => {
                return self.validateNow();
            },
            message: "Please provide some detail to accompany this action."
        }
    });

    self.giftVoucher = ko.observable();

    //#endregion


    //#region Components

    self.redeemOrderParams = kendoMDCDropDownList({
        label: 'Order ID / Reference',
        odata: true,
        endPoint: `/odata/Orders`,
        textField: 'ShortLabel',
        valueField: 'OrderID',
        virtual: true,
        autoBind: false,
        minLength: 3,
        enforceMinLength: true,
        pageSize: 10,
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
            field: 'OrderID'
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            if (data && data.filter && data.filter.filters && data.filter.filters.length) {
                data.pageSize = 40;
            } else {
                data.pageSize = 0;
            }

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            if (d.$filter && d.$filter.indexOf('contains(tolower(ShortLabel)' === 0)) {
                d.$filter = `${d.$filter.replace("ShortLabel", "CustomerOrderReference")} or ${d.$filter.replace("contains", "startswith").replace("ShortLabel", "OrderID")}`;
            }

            return d;
        }
    });

    self.notesParams = {
        label: 'Notes',
        originalValue: ko.observable(),
        observable: self.notes,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        rows: 10,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: true,
        revertFunction: function () {
            self.notes(self.originalNotes());
            $(self.notes.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 2000
        },
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(true),
        visible: ko.observable(true)
    };

    //#endregion


    //#region Subscriptions

    self.notes.subscribe(nv => {
        //console.log("redeemer notes", nv);
    });

    self.giftVoucher.subscribe(nv => {
        if (nv) {
            self.orderId(nv.RedeemOrderID);
            self.notes(nv.Reason);
        } else {
            self.reset();
        }
    });

    //#endregion


    //#region Computeds



    //#endregion


    //#region Validation Groups

    self.errors = ko.validation.group([
        self.notes
    ]);

    //#endregion


    //#region Methods

    self.reset = () => {
        self.validateNow(false);
        self.redeemOrderParams.clearFunction();
        self.notesParams.clearFunction();
    }

    self.show = (gv) => {

        if (gv) {
            self.giftVoucher(gv);
        }

        self.modal.show();
    }

    self.hide = () => {
        self.modal.hide();
    }

    self.proceed = () => {
        self.validateNow(true);
        self.errors.showAllMessages(false);

        if (self.errors().length) {
            self.errors.showAllMessages(true);
            self.errors.filter(x => {
                x.isValid.notifySubscribers(x.isValid());
            });
        } else {

            self.busy(true);

            var params = {
                giftVoucherId: self.giftVoucher().GiftVoucherID,
                orderId: self.orderId(),
                notes: self.notes()
            }

            fetch('/api/giftvouchersapi/saveNotes', {
                method: 'POST',
                headers: window.fetchHeaders,
                cache: 'no-cache',
                credentials: 'same-origin',
                body: JSON.stringify(params)
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    self.hide();
                    self.busy(false);
                    window.showInfo("Thank you", "Saved successfully.");

                    self.giftVoucher().notes(self.notes());

                    if (self.giftVoucher().hasOwnProperty('redeemOrderId')) {
                        self.giftVoucher().redeemOrderId(self.orderId());
                    } 

                    self.parent.gridDataSource.read();
                })
                .catch(err => {
                    self.busy(false);
                    window.catchFetchError(err);
                })
        }
    }

    //#endregion


    //#region Events



    //#endregion

    return self;
});


const giftVoucherRedeemerViewModel = (({ parent } = { parent: null }) => {
    var self = {
        parent: parent
    };

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable("Please wait");

    self.validateNow = ko.observable(false);

    self.modalElement = document.querySelector("#redeem-voucher-modal");

    self.modal = bootstrap.Modal.getOrCreateInstance(self.modalElement);

    self.modal._element.addEventListener('shown.bs.modal', () => {
        self.modal._focustrap.deactivate();
    });

    self.orderId = ko.observable().extend({
        numberFormatted: {
            digits: 0,
            currency: ko.observable({ FormattingCulture: "en-GB" })
        }
    });

    self.order = ko.observable();

    self.notes = ko.observable().extend({
        required: {
            params: true,
            onlyIf: () => {
                return self.validateNow();
            },
            message: "Please provide some detail to accompany this action."
        }
    });

    self.giftVoucher = ko.observable();

    //#endregion


    //#region Components

    self.redeemOrderParams = kendoMDCDropDownList({
        label: 'Order ID / Reference',
        odata: true,
        endPoint: `/odata/Orders`,
        textField: 'ShortLabel',
        valueField: 'OrderID',
        virtual: true,
        autoBind: false,
        minLength: 3,
        enforceMinLength: true,
        pageSize: 10,
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
            field: 'OrderID'
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            if (data && data.filter && data.filter.filters && data.filter.filters.length) {
                data.pageSize = 40;
            } else {
                data.pageSize = 0;
            }

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            if (d.$filter && d.$filter.indexOf('contains(tolower(ShortLabel)' === 0)) {
                d.$filter = `${d.$filter.replace("ShortLabel", "CustomerOrderReference")} or ${d.$filter.replace("contains", "startswith").replace("ShortLabel", "OrderID")}`;
            }

            return d;
        }
    });

    self.notesParams = {
        label: 'Notes',
        originalValue: ko.observable(),
        observable: self.notes,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        rows: 10,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: true,
        revertFunction: function () {
            self.notes(self.originalNotes());
            $(self.notes.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 2000
        },
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(true),
        visible: ko.observable(true)
    };

    //#endregion


    //#region Subscriptions

    self.notes.subscribe(nv => {
        //console.log("redeemer notes", nv);
    });

    self.giftVoucher.subscribe(nv => {
        if (nv) {
            self.orderId(nv.RedeemOrderID);
            self.notes(nv.Reason);
        } else {
            self.reset();
        }
    }); 

    //#endregion


    //#region Computeds



    //#endregion


    //#region Validation Groups

    self.errors = ko.validation.group([
        self.notes
    ]);

    //#endregion


    //#region Methods

    self.reset = () => {
        self.validateNow(false);
        self.redeemOrderParams.clearFunction();
        self.notesParams.clearFunction();
    }

    self.show = (gv) => {

        if (gv) {
            self.giftVoucher(gv);
        }

        self.modal.show();
    }

    self.hide = () => {
        self.modal.hide();
    }

    self.proceed = () => {
        self.validateNow(true);
        self.errors.showAllMessages(false);

        if (self.errors().length) {
            self.errors.showAllMessages(true);
            self.errors.filter(x => {
                x.isValid.notifySubscribers(x.isValid());
            });
        } else {

            window.showConfirm("Are you sure?", "This action will mark the gift voucher as having been used and cannot be undone.", () => {

                self.busy(true);

                var params = {
                    giftVoucherId: self.giftVoucher().GiftVoucherID,
                    orderId: self.orderId(),
                    notes: self.notes()
                }

                fetch('/api/giftvouchersapi/redeem', {
                    method: 'POST',
                    headers: window.fetchHeaders,
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    body: JSON.stringify(params)
                })
                    .then(window.handleFetchResponse)
                    .then(data => {
                        self.hide();
                        self.busy(false);

                        window.showInfo("Thank you", "This gift voucher has been redeemed.");

                        if (self.giftVoucher().hasOwnProperty('redeemOrderId')) {
                            self.giftVoucher().redeemOrderId(self.orderId());
                        }

                        self.giftVoucher().notes(self.notes());
                        self.giftVoucher().usedDt(data.usedDt);

                        self.parent.gridDataSource.read();
                    })
                    .catch(err => {
                        self.busy(false);
                        window.catchFetchError(err);
                    })
            }, () => {

            });
        }
    }

    //#endregion


    //#region Events



    //#endregion

    return self;
});






const giftVoucherExtenderViewModel = (({ parent } = { parent: null }) => {
    var self = {
        parent: parent
    };

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable("Please wait");

    self.validateNow = ko.observable(false);

    self.modalElement = document.querySelector("#extend-voucher-modal");

    self.modal = bootstrap.Modal.getOrCreateInstance(self.modalElement);

    self.expiryDate = ko.observable(self.ExpiryDT);

    self.notes = ko.observable().extend({
        required: {
            params: true,
            onlyIf: () => {
                return self.validateNow();
            },
            message: "Please provide some detail to accompany this action."
        }
    });

    self.giftVoucher = ko.observable();

    //#endregion


    //#region Components

    self.expiryDateParams = {
        label: "Expiry",
        observable: self.expiryDate,
        originalValue: self.expiryDate(),
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
                cellSize: '3rem'
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
        clearable: ko.observable(false),
        clearFunction: () => {
            self.expiryDate(undefined);
        },
        revertible: ko.observable(false),
        revertFunction: () => {
            self.expiryDate.observable(self.expiryDateParams.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true
    };

    self.notesParams = {
        label: 'Notes',
        originalValue: ko.observable(),
        observable: self.notes,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        rows: 10,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: true,
        revertFunction: function () {
            self.notes(self.originalNotes());
            $(self.notes.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 2000
        },
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(true),
        visible: ko.observable(true)
    };

    //#endregion


    //#region Subscriptions

    self.giftVoucher.subscribe(nv => {
        console.log('giftVoucher', nv);
        if (nv) {
            self.expiryDate(nv.ExpiryDT);
            self.notes(nv.Reason);

            let oneDayMilliseconds = 1000 * 60 * 60 * 24;

            self.expiryDate.tempusDominus.updateOptions({
                restrictions: {
                    minDate: new Date(new Date(nv.ExpiryDT).getTime() + oneDayMilliseconds)
                },
                viewDate: new Date(self.expiryDate())
            });

        } else {
            self.reset();
        }
    }); 

    self.expiryDate.subscribe(nv => {
        console.log('expiryDate', nv);
    });

    //#endregion


    //#region Computeds



    //#endregion


    //#region Validation Groups

    self.errors = ko.validation.group([
        self.notes
    ]);

    //#endregion


    //#region Methods

    self.reset = () => {
        self.validateNow(false);
        self.expiryDateParams.clearFunction();
        self.notesParams.clearFunction();
    }

    self.show = (gv) => {

        if (gv) {
            self.giftVoucher(gv);
        }

        self.modal.show();
    }

    self.hide = () => {
        self.modal.hide();
    }

    self.proceed = () => {
        self.validateNow(true);
        self.errors.showAllMessages(false);

        if (self.errors().length) {
            self.errors.showAllMessages(true);
            self.errors.filter(x => {
                x.isValid.notifySubscribers(x.isValid());
            });
        } else {
            window.showConfirm("Are you sure?", "This action will extend the gift voucher's expiry date.", () => {

                self.busy(true);

                var params = {
                    giftVoucherId: self.giftVoucher().GiftVoucherID,
                    expiryDt: typeof self.expiryDate() == 'object' ? self.expiryDate().toUTCString() : self.expiryDate(),
                    notes: self.notes()
                }

                fetch('/api/giftvouchersapi/extend', {
                    method: 'POST',
                    headers: window.fetchHeaders,
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    body: JSON.stringify(params)
                })
                    .then(window.handleFetchResponse)
                    .then(data => {
                        self.hide();
                        window.showInfo("Thank you", "This gift voucher has been extended.");
                        if (self.giftVoucher().hasOwnProperty('expiryDate')) {
                            self.giftVoucher().expiryDate(self.expiryDate());
                            self.giftVoucher().notes(self.notes());
                        } else {
                            self.parent.gridDataSource.read();
                        }

                        self.busy(false);

                        let oneDayMilliseconds = 1000 * 60 * 60 * 24;

                        self.expiryDate.tempusDominus.updateOptions({
                            restrictions: {
                                minDate: new Date(new Date(self.expiryDate()).getTime() + oneDayMilliseconds)
                            },
                            viewDate: new Date(self.expiryDate())
                        });
                    })
                    .catch(err => {
                        self.busy(false);
                        window.catchFetchError(err);
                    })
            }, () => {

            });
        }
    }

    //#endregion


    //#region Events



    //#endregion

    return self;
});




const giftVoucherCancellerViewModel = (({ parent } = { parent: null }) => {
    var self = {
        parent: parent
    };

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable("Please wait");

    self.validateNow = ko.observable(false);

    self.modalElement = document.querySelector("#cancel-voucher-modal");

    self.modal = bootstrap.Modal.getOrCreateInstance(self.modalElement);

    self.notes = ko.observable().extend({
        required: {
            params: true,
            onlyIf: () => {
                return self.validateNow();
            },
            message: "Please provide some detail to accompany this action."
        }
    });

    self.giftVoucher = ko.observable();

    //#endregion


    //#region Components

    self.notesParams = {
        label: 'Notes',
        originalValue: ko.observable(),
        observable: self.notes,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        rows: 10,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: true,
        revertFunction: function () {
            self.notes(self.originalNotes());
            $(self.notes.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 2000
        },
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(true),
        visible: ko.observable(true)
    };

    //#endregion


    //#region Subscriptions

    self.giftVoucher.subscribe(nv => {
        console.log('giftVoucher', nv);
        if (nv) {
            self.notes(nv.Reason);
        } else {
            self.reset();
        }
    });

    //#endregion


    //#region Computeds



    //#endregion


    //#region Validation Groups

    self.errors = ko.validation.group([
        self.notes
    ]);

    //#endregion


    //#region Methods

    self.reset = () => {
        self.validateNow(false);
        self.notesParams.clearFunction();
    }

    self.show = (gv) => {

        if (gv) {
            self.giftVoucher(gv);
        }

        self.modal.show();
    }

    self.hide = () => {
        self.modal.hide();
    }

    self.proceed = () => {
        self.validateNow(true);
        self.errors.showAllMessages(false);

        if (self.errors().length) {
            self.errors.showAllMessages(true);
            self.errors.filter(x => {
                x.isValid.notifySubscribers(x.isValid());
            });
        } else {
            window.showConfirm("Are you sure?", "This action will cancel the gift voucher, rendering it unusable.", () => {

                self.busy(true);

                var params = {
                    giftVoucherId: self.giftVoucher().GiftVoucherID,
                    notes: self.notes()
                }

                fetch('/api/giftvouchersapi/cancel', {
                    method: 'POST',
                    headers: window.fetchHeaders,
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    body: JSON.stringify(params)
                })
                    .then(window.handleFetchResponse)
                    .then(data => {
                        self.hide()

                        window.showInfo("Thank you", "This gift voucher has been cancelled.");

                        if (self.giftVoucher().hasOwnProperty('notes')) {
                            self.giftVoucher().notes(self.notes());
                        } else {
                            self.parent.gridDataSource.read();
                        }

                        self.busy(false);
                    })
                    .catch(err => {
                        self.busy(false);
                        window.catchFetchError(err);
                    })
            }, () => {

            });
        }
    }

    //#endregion


    //#region Events



    //#endregion

    return self;
});



const giftVoucherViewModel = (({ rec, parent } = { rec: null, parent: null }) => {
    var self = Object.assign({

    }, rec);

    //#region Properties

    self.busy = parent.busy;

    self.label = self.Code;

    self.productId = ko.observable(rec.ProductID).extend({
        required: {
            params: true,
            message: "You must specify a Gift Voucher"
        }
    });

    self.product = ko.observable();

    self.notes = ko.observable(self.Reason);

    self.originalNotes = ko.observable(self.Reason);

    self.expiryDate = ko.observable(self.ExpiryDT);

    self.redeemOrderId = ko.observable(self.RedeemOrderID ?? self.RedeemTransactionID);

    self.usedDt = ko.observable(self.UsedDT);

    self.cancelledDt = ko.observable(self.CancelledDT);

    //#endregion


    //#region Components

    self.notesParams = {
        label: 'Notes',
        originalValue: self.originalNotes,
        observable: self.notes,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        rows: 10,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: true,
        revertFunction: function () {
            self.notes(self.originalNotes());
            $(self.notes.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 2000
        },
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(true),
        visible: ko.observable(true)
    };

    self.productParams = kendoMDCDropDownList({
        label: 'Product',
        odata: true,
        endPoint: '/odata/Products/GetProductsForGiftVouchers',
        textField: 'ShortLabel',
        valueField: 'ProductID',
        virtual: false,
        template: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        idObservable: self.productId,
        objObservable: self.product,
        enable: ko.observable(false),
        disable: ko.observable(true),
        clearable: ko.observable(false),
        revertible: ko.observable(false),
        readOnly: true,
        filter: 'contains',
        autoBind: true,
        height: 340,
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('creation-product')
        },
        dataBound: (e) => {
            document.querySelectorAll('.grid-btn').forEach(b => new bootstrap.Ripple(b));
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
        }
    });

    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Computeds

    self.orderLine = self.OrderLines.length ? self.OrderLines[0] : null;

    self.soldWithOrderId = ko.computed(() => {
        var result = null;

        result = self.SaleOrderID ?? self.SaleTransactionID;

        if (self.OrderLines.length) {
            result = self.OrderLines[0].OrderHeadID;
        }

        return result;
    }, self);

    self.saveNotesButtonVisible = ko.computed(() => {
        return self.originalNotes() != self.notes();
    }, self);

    self.voucherEditDisabled = ko.computed(() => {
        // can't disable because users might want to flag as used before they have an OrderID
        return self.usedDt() != null;
    }, self);

    //#endregion


    //#region Validation Groups

    self.errors = ko.validation.group([
        self.productId
    ]);

    //#endregion


    //#region Methods

    self.reset = () => {
        self.giftVoucherProductParams.clearFunction();
    }

    self.show = () => {
        self.newVoucherModal.show();
    }

    self.hide = () => {
        self.newVoucherModal.hide();
        self.reset();
    }

    self.proceed = () => {
        self.validateNow(true);
        self.errors.showAllMessages(false);

        if (self.errors().length) {
            self.errors.showAllMessages(true);
            self.errors().filter(x => {
                x.isValid.notifySubscribers(x.isValid());
            });
        } else {

        }
    }

    //#endregion


    //#region Events



    //#endregion

    return self;
});