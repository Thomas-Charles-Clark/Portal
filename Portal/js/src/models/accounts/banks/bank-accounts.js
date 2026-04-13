const bankAccountsViewModel = ({ } = {}) => {
    let self = {};

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable('Please Wait');

    self.gridWidget = ko.observable();

    //#endregion



    //#region Components

    self.gridDataSource = new kendo.data.DataSource({
        type: 'odata-v4',
        batch: true,
        transport: {
            read: {
                url: function () {
                    return '/odata/DGPaymentDetails'
                }
            },
            update: {
                url: function (data) {

                    Object.keys(data).forEach(k => {
                        if (data[k] === "")
                            data[k] = null;
                    })

                    return "/odata/DGPaymentDetails('" + data.Code + "')"
                },
                type: "PATCH"
            },
            batch: {
                url: function () {
                    return "/odata/$batch";
                }
            },
            parameterMap: function (data, type) {

                let result = kendo.data.transports["odata-v4"].parameterMap(data, type);

                return result;

            }
        },
        pageSize: 50,
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        autoSync: false,
        schema: {
            errors: 'error',
            model: {
                id: 'Code',
                fields: {
                    Code: {
                        type: 'string',
                        editable: false
                    },
                    PaymentDetails: {
                        type: 'string',
                        validation: {
                            required: true
                        },
                        editable: false
                    },
                    Bank: {
                        type: 'string',
                        nullable: true,
                        defaultValue: null,
                        editable: true
                    },
                    AccountName: {
                        type: 'string',
                        nullable: true,
                        defaultValue: null,
                        editable: true
                    },
                    SortCode: {
                        type: 'string',
                        nullable: true,
                        defaultValue: null,
                        editable: true
                    },
                    AccountNumber: {
                        type: 'string',
                        nullable: true,
                        defaultValue: null,
                        editable: true
                    },
                    IBAN: {
                        type: 'string',
                        nullable: true,
                        defaultValue: null,
                        editable: true
                    },
                    Swift: {
                        type: 'string',
                        nullable: true,
                        defaultValue: null,
                        editable: true
                    },
                    BIC: {
                        type: 'string',
                        nullable: true,
                        defaultValue: null,
                        editable: true
                    }
                }
            }
        },
        requestStart: function (e) {
            console.log('requestStart', e);
        },
        requestEnd: function (e) {
            if (e.type == "create") {
                this.read();
            }
        },
    })

    self.gridParams = {
        autoBind: true,
        widget: self.gridWidget,
        columns: [{
            field: 'Code',
            title: 'Code',
            width: 60,
            attributes: {
                'class': 'code-cell text-bold'
            },
            editable: () => false
        }, {
            field: 'PaymentDetails',
            title: 'Payment Details',
            width: 420,
            template: (dataItem) => {
                if (dataItem.PaymentDetails) {
                    return dataItem.PaymentDetails.replace('\n', '<br/>');
                } else {
                    '';
                }
            },
            editable: () => false
        }, {
            field: 'Bank',
            title: 'Bank',
            editable: () => true
        }, {
            field: 'AccountName',
            title: 'Account Name',
            editable: () => true
        }, {
            field: 'SortCode',
            title: 'SortCode',
            editable: () => true
        }, {
            field: 'AccountNumber',
            title: 'AccountNumber',
            editable: () => true
        }, {
            field: 'IBAN',
            title: 'IBAN',
            editable: () => true
        }, {
            field: 'Swift',
            title: 'Swift',
            editable: () => true
        }, {
            field: 'BIC',
            title: 'BIC',
            editable: () => true
        }, {
            field: 'CaptureDailyStats',
            title: 'Capture Daily Stats',
            editable: () => false,
            hidden: true,
        }, {
            field: 'BankAccountOwner',
            title: 'Owner',
            editable: () => false,
            hidden: true
        }],
        editable: true,
        batch: true,
        toolbar: ["save", "cancel"],
        // Don't know if we'll ever want to allow addition from here; at present I'm
        // only intent on updating portal.DGPaymentDetails (as opposed to updating MERTEX.BANK directly).
        // I can only imagine the use of this grid is as a data-tidy.
        edit: function (e) {
            if (e.model.isNew()) {
                if (e.sender.options.editable != 'inline') {
                    e.sender.setOptions({ editable: 'inline' });
                    e.sender.one('dataBound', function (x) {
                        window.setTimeout(function () {
                            e.sender.addRow();
                            e.sender.one('dataBound', function (y) {
                                window.setTimeout(function () {
                                    e.sender.setOptions({ editable: 'incell' });
                                }, 0);
                            });
                        }, 0);
                    });
                }
            }
        },
        cancel: function (e) {
            if (e.sender.options.editable == 'inline') {
                e.sender.setOptions({ editable: 'incell' });
            }
        },
        data: self.gridDataSource,
        sortable: true,
        filterable: false,
        reorderable: true,
        pageable: {
            pageSize: 50,
            pageSizes: [10, 20, 50, 100, 200]
        },
        scrollable: true,
        height: 'calc(100vh - 150px)'
    };

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds



    //#endregion



    //#region Subscriptions



    //#endregion



    //#region Methods

    self.init = () => {
        console.log('bankAccountsViewModel init called');

        window.addEventListener('beforeunload', (e) => {
            if (self.gridWidget().dataSource.hasChanges()) {
                var message = "You have unsaved changes. Are you sure you want to leave?";
                e.returnValue = message;
                return message;
            }
        });
    };

    //#endregion



    //#region Events



    //#endregion


    return self;
};