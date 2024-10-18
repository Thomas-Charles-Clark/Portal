const EMPTY_STRING = '';

const giftVouchersViewModel = (() => {
    var self = {};

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable("Please wait");

    self.giftVoucherId = ko.observable('');

    self.giftVoucher = ko.observable();

    self.giftVoucherCreator = giftVoucherCreatorViewModel({ parent: self });

    self.giftVoucherRedeemer = giftVoucherRedeemerViewModel({ parent: self });

    self.giftVoucherExtender = giftVoucherExtenderViewModel({ parent: self });

    self.loadedCode = window.getGiftVoucherCode();

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
        busy: self.emailBusy,
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
            //self.busy(true);
        },
        requestEnd: (e) => {
            console.log(e);

            let arr = e.response.value.map(gv => giftVoucherViewModel({ rec: gv, parent: self }));

            e.response.value = arr;

            if (arr.length == 1 && self.loadedCode) {
                self.giftVoucherParams.dropDownListSettings.widget().select(0);
                self.giftVoucherParams.dropDownListSettings.widget().trigger('change');
            }
            //self.busy(false);
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
        width: 240,
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
        reorderable: false,
        editable: true,
        selectable: false,
        change: function () {
            this.editRow(this.select());
        },
        toolbar: [{
            name: "Create New",
            template: kendo.template(document.querySelector("#grid-toolbar-create-new").innerHTML),
            iconClass: "k-icon k-i-add"
        }],
        navigatable: true,
        paging: true,
        pageSize: 20,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        dataBound: function (e) {
            window.setTimeout(() => {
                ko.cleanNode(document.querySelector("#create-new-btn"));
                ko.applyBindings(self, document.querySelector("#create-new-btn"));
            }, 0);
        },
        page: function (e) {

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
        console.warning("proceedNewVoucher");
        self.giftVoucherCreator.hide();
    }

    self.viewVoucher = (voucher) => {
        window.open(`/customers/gift-vouchers/pdf?code=${voucher.Code}`, '_blank');
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

    self.newVoucherModalElement = document.querySelector("#new-voucher-modal");

    self.newVoucherModal = bootstrap.Modal.getOrCreateInstance(self.newVoucherModalElement);

    self.productId = ko.observable().extend({
        required: {
            params: true,
            message: "You must specify a Gift Voucher" 
        }
    });

    self.product = ko.observable();

    //#endregion


    //#region Components

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

            window.confirm("Are you sure?", "Potato potato jibbering gibbon", () => {

            }, () => {

            });
        }
    }

    self.saveChanges = () => {

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

    self.giftVoucher = self.parent.giftVoucher;

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

    self.show = () => {
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
                        self.giftVoucher().redeemOrderId(self.orderId());
                        self.giftVoucher().usedDt(data.usedDt);
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

    self.giftVoucher = self.parent.giftVoucher;

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
        revertible: ko.observable(true),
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

    self.show = () => {
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
                    expiryDt: self.expiryDate().toUTCString(),
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
                        self.giftVoucher().expiryDate(self.expiryDate());
                        self.giftVoucher().notes(self.notes());

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



const giftVoucherViewModel = (({ rec, parent } = { rec: null, parent: null }) => {
    var self = Object.assign({

    }, rec);

    //#region Properties

    self.busy = parent.busy

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
        return self.usedDt() == null;
        //return false;
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