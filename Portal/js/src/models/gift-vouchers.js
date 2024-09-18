const EMPTY_STRING = '';

const giftVouchersViewModel = (() => {
    var self = {};

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable("Please wait");

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
        width: 80
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
        },
        template: function (item) {
            return item.GiftVoucherType.Name;
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
        field: 'ValueInc',
        title: 'Value (Inc.)',
        width: 90,
        filterable: false,
        attributes: {
            class: 'text-right'
        }
    }, {
        field: 'ValueEx',
        title: 'Value (Ex.)',
        width: 90,
        filterable: false,
        attributes: {
            class: 'text-right'
        }
    }, {
        field: 'CreatedDT',
        title: 'Created',
        width: 90,
        filterable: false,
        template: function (e) {
            return e.CreatedDT ? moment(e.CreatedDT).format('DD/MM/YYYY HH:MM:ss') : '';
        }
    }, {
        field: 'AuthorisedDT',
        title: 'Authorised',
        width: 90,
        filterable: false,
        template: function (e) {
            return e.AuthorisedDT ? moment(e.AuthorisedDT).format('DD/MM/YYYY HH:MM:ss') : '';
        }
    }, {
        field: 'ExpiryDT',
        title: 'Expiry',
        width: 90,
        filterable: false,
        template: function (e) {
            return e.ExpiryDT ? moment(e.ExpiryDT).format('DD/MM/YYYY HH:MM:ss') : '';
        }
    }, {
        field: 'UsedDT',
        title: 'Used',
        width: 90,
        filterable: false,
        template: function (e) {
            return e.UsedDT ? moment(e.UsedDT).format('DD/MM/YYYY HH:MM:ss') : '';
        }
    }, {
        field: 'CancelledDT',
        title: 'Cancelled',
        width: 90,
        filterable: false,
        template: function (e) {
            return e.CancelledDT ? moment(e.CancelledDT).format('DD/MM/YYYY HH:MM:ss') : '';
        }
    }, {
        field: 'RedeemTransactionID',
        title: 'Redeemed with<br/>Transaction',
        width: 90,
        filterable: false,
        attributes: {
            class: 'text-right'
        }
    }, {
        field: 'SaleTransactionID',
        title: 'Sold with<br/>Transaction',
        width: 90,
        filterable: false,
        attributes: {
            class: 'text-right'
        }
    }, {
        field: 'CreatedByMember',
        title: 'Created By',
        width: 90,
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
        batch: true,
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
        toolbar: ["save", "cancel"],
        navigatable: true,
        paging: true,
        pageSize: 20,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        dataBound: function (e) {

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

    //#endregion


    //#region Events



    //#endregion

    return self;
});