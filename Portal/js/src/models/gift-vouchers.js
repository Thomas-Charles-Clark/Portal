const EMPTY_STRING = '';

const giftVouchersViewModel = (() => {
    var self = {};

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable("Please wait");

    self.giftVoucherCreator = giftVoucherCreatorViewModel({ parent: self });

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
        noDataTemplate: 'There are no Furniture Orders awaiting invoicing information.'
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
        window.open(`/customers/gift-vouchers/pdf?id=${voucher.GiftVoucherID}`, '_blank');

        //fetch('/api/giftvouchersapi/FetchPDF', {
        //    method: 'GET',
        //    headers: window.fetchHeaders,
        //    cache: 'no-cache',
        //    credentials: 'same-origin',
        //    body: JSON.stringify({
        //        giftVoucherId: voucher.GiftVoucherID
        //    })
        //})
        //    .then(response => response.blob())
        //    .then(blob => {
        //        var link = document.createElement('a');
        //        link.target = "_blank";
        //        link.href = window.URL.createObjectURL(blob);
        //        //link.download = `${voucher.Code}.pdf`;
        //        link.click();
        //        self.busy(false);
        //        link.remove();
        //    })
        //    .catch((err) => {
        //        self.busy(false);
        //        window.catchFetchError(err);
        //    });
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

    //#endregion


    //#region Events



    //#endregion

    return self;
});