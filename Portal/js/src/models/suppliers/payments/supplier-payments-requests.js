const supplierPaymentsRequestsViewModel = ({
    ready,
    busy,
    busyMessage,
    filters,
    refreshDashboard,
    refreshApprovals
} = {
    ready: ko.observable(false),
    busy: ko.observable(false),
    busyMessage: ko.observable('Please Wait'),
    filters: {},
    refreshDashboard: () => { },
    refreshApprovals: () => { }
}) => {

    let self = {
        ready,
        busy: ko.observable(false),
        parentBusy: busy,
        busyMessage,
        filters,
        refreshDashboard,
        refreshApprovals
    };

    //#region Properties

    self.gridWidget = ko.observable();

    self.addNewModalElement = document.querySelector('#new-request-modal');

    self.addNewModal = bootstrap.Modal.getOrCreateInstance(self.addNewModalElement);

    self.newRequest = ko.observable();

    //#endregion



    //#region Components
    
    self.gridDataSource = new kendo.data.DataSource({
        sortable: true,
        filterable: true,
        grouping: true,
        group: [{
            field: 'PaymentRequestType',
            dir: 'desc'
        }, {
            field: 'RequesterName',
            dir: 'asc'
        }],
        serverGrouping: false,
        serverFiltering: true,
        serverPaging: false,
        page: 1,
        pageSize: 10,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        batch: true,
        type: "odata-v4",
        transport: {
            read: {
                url: () => {
                    let filters = self.filters.requestFilters();

                    return `/supplier-payments-odata/SupplierPaymentRequest_SelectRecords/SupplierPayments.SupplierPaymentsGridRead(dto=@d)?@d={"MemberID":${filters.requestedByMemberId == '' ? null : filters.requestedByMemberId},"PaymentRequestStatus":${((filters.paymentRequestStatus == '' || filters.paymentRequestStatus == null) ? 'null' : `"${filters.paymentRequestStatus}"`)}}`;
                }
            },
            update: {
                url: function (item) {
                    if (item.PurchaseOrders != null && item.PurchaseOrders.length) {
                        item.PurchaseOrders = item.PurchaseOrders.map(p => p.PurchaseOrderHeadID).join(',');
                    }
                    return `/supplier-payments-odata/SupplierPaymentRequest_SelectRecords(${item.PaymentRequestID})`
                }
            },
            create: {
                url: '/supplier-payments-odata/SupplierPaymentRequest_SelectRecords'
            },
            batch: {
                url: '/supplier-payments-odata/$batch'
            },
            destroy: {
                url: function (item) {
                    return `/supplier-payments-odata/SupplierPaymentRequest_SelectRecords(${item.PaymentRequestID})`
                }
            },
            parameterMap: function (data, operation) {

                console.log(operation, data);

                var result = kendo.data.transports["odata-v4"].parameterMap(data, operation);

                return result;
            }
        },
        schema: {
            errors: function (response) {
                if (response && response.responses) {
                    var errors = [];
                    response.responses.forEach(function (r) {
                        if (r.status < 200 || r.status >= 300) {
                            // Extract the message from the body
                            errors.push(r.body && r.body.error ? r.body.error.message : "Unknown Error");
                        }
                    });
                    if (errors.length > 0) return errors.join(", ");
                }
                return null;
            },
            // 2. Ensure data returns an array even if segments failed
            data: function (response) {
                // If the parser failed to populate 'collections', 
                // you may need to return an empty array to prevent a crash
                return response.value || (response.responses ? [] : response);
            },
            parse: function (data) {
                if (Object.hasOwn(data, 'value')) {
                    for (let i = 0; i < data.value.length; i++) {

                        delete data.value[i]['@odata.type'];

                        if (data.value[i].PurchaseOrders != null) {
                            data.value[i].PurchaseOrders = JSON.parse(data.value[i].PurchaseOrders);
                        }
                    }
                } else if (Array.isArray(data)) {
                    data.forEach(d => {
                        delete d['@odata.context'];
                    })
                }

                console.log(`supplierPaymentRequests schema.parse returning`, data);

                return data;
            },
            model: {
                id: 'PaymentRequestID',
                fields: {
                    PaymentRequestID: {
                        type: 'number'
                    },
                    PaymentRequestStatusID: {
                        type: 'number',
                        nullable: true,
                        defaultValue: null,
                        validation: {
                            required: {
                                message: 'You must specify a Status'
                            }
                        }
                    },
                    PeriodID: {
                        type: 'number',
                        required: true
                    },
                    RequestedByMemberID: {
                        type: 'number',
                        nullable: false,
                        editable: true,
                        defaultValue: window.getUserId(),
                    },
                    PaymentRequestType: {
                        type: 'string',
                        nullable: true
                    },
                    PaymentRequestStatusID: {
                        type: 'number',
                        nullable: true
                    },
                    PaymentRequestStatus: {
                        type: 'string',
                        defaultValue: {
                            Name: "Request Status"
                        }
                    },
                    PaymentDueDate: {
                        type: 'date',
                        format: 'dd/MM/yyyy',
                        parseFormats: ["dd/MM/yyyy", "dd/MM/yy"],
                        autoCorrectParts: true,
                        nullable: true,
                        validation: {
                            required: {
                                message: 'You must specify a Pay Date'
                            }
                        }
                    },
                    RequesterName: {
                        type: 'string',
                        nullable: true,
                        editable: false,
                        defaultValue: window.getUserName()
                    },
                    RequesterEmail: {
                        type: 'string',
                        nullable: true,
                        editable: false,
                        defaultValue: window.getUserEmail()
                    },
                    RequestType: {
                        type: 'string',
                        nullable: false,
                        validation: {
                            required: {
                                message: 'You must specify a Request Type'
                            }
                        }
                    },
                    Status: {
                        type: 'string',
                        nullable: false,
                        editable: true // just a note: this is freaking annoying but if you'll generally want 
                                        // fields which are SOMETIMES editable (e.g. only on new) to be editable: true
                    },
                    SupplierCode: {
                        type: 'string',
                        nullable: true,
                        editable: true,
                        validation: {
                            required: {
                                message: 'You must specify a Supplier'
                            }
                        }
                    },
                    SupplierName: {
                        type: 'string',
                        nullable: true,
                        editable: true,
                        validation: {
                            required: {
                                message: 'You must specify a Supplier'
                            }
                        }
                    },
                    CurrencyCode: {
                        type: 'string',
                        nullable: false,
                        editable: true,
                        validation: {
                            required: {
                                message: 'Currency cannot be NULL'
                            }
                        }
                    },
                    FormattingCulture: {
                        type: 'string',
                        nullable: false,
                        editable: true,
                        validation: {
                            required: {
                                message: 'Formatting Culture cannot be NULL'
                            }
                        }
                    },
                    RequestAmount: {
                        type: 'number',
                        nullable: true,
                        required: {
                            message: 'You must specify an Amount'
                        }
                    },
                    OutstandingAmount: {
                        type: 'number',
                        nullable: true
                    },
                    ApprovalDetails: {
                        type: 'string'
                    },
                    ProformaNumber: {
                        type: 'string'
                    },
                    RequesterComments: {
                        type: 'string'
                    },
                    Status: {
                        type: 'string',
                        editable: false
                    },
                    PurchaseOrders: {
                        type: 'array',
                        defaultValue: []
                    },
                    PaymentRequestCreated: {
                        type: 'date',
                        editable: false,
                        nullable: true,
                        defaultValue: new Date(),
                        format: 'dd/MM/yyyy HH:mm'
                    },
                    PaymentRequestModified: {
                        type: 'date',
                        format: 'dd/MM/yyyy HH:mm'
                    },
                    ReadOnly: {
                        type: 'boolean',
                        editable: false
                    }
                }
            }
        },
        error: function (e) {
            //console.error(`paymentRequests dataSource errors`, e);

            //// e.xhr contains the full response from the server
            //var response = JSON.parse(e.xhr.responseText);

            //var message = JSON.stringify(response.error, null, '\t');

            //self.busy(false);

            //window.showInfo('Errors', PR.prettyPrintOne(message));

            // This will now fire because schema.errors returned a string
            window.showError("Batch Update Failed: " + e.errors);

            // Prevent the grid from thinking the sync was successful
            //$("#grid").data("kendoGrid").cancelChanges();

            // Revert changes in the grid if necessary - we don't really want to do this!

            //self.paymentPlanGridWidget().cancelChanges();
            //self.otherPaymentRequestStatusesGridWidget().cancelChanges();
        },
        requestStart: (e) => {
            //self.busy(true);
            console.log(`paymentRequests dataSource requestStart`, e);

            if (e.type != 'submit') {
                if (e.sender.hasChanges()) {
                    e.preventDefault();
                    self.busy(false);
                    console.log('paymentRequests grid unsavedChanges info');
                    window.showInfo('Unsaved Changes', 'You have unsaved changes. Please cancel or save them before performing any other action.');
                }
            }

            // Avoid extraneous call to fetchDashboard if ready == false; the call is made when building 
            // the server-side viewModel.
            if (self.ready()) {
                self.refreshDashboard();
            }
        },
        requestEnd: (e) => {
            console.log(`paymentRequests dataSource requestEnd`);
            if (e.type === 'create') {
                e.response.forEach(r => {
                    delete r["@odata.context"];
                });
            }
            self.refreshApprovals();
            self.busy(false);
            if (e.type === 'update') {
                window.setTimeout(() => {
                    self.refresh();
                }, 0);
            }
        },
        sort: {
            field: 'PaymentRequestCreated',
            dir: 'desc'
        },
        noDataTemplate: 'Nothing to display',
        change: (e) => {
            console.log(`paymentRequests dataSource change`, e);

            if (e.action === "itemchange") {
                let model = e.items[0];
                switch (e.field) {
                    case "PaymentDueDate":
                        let periodId = moment(model.PaymentDueDate).weekdayWithStartWeekday(0, 1).format('YYYYMMDD');
                        model.set('PeriodID', +periodId);
                        break;
                    default: break;
                }

                $(`.payment-requests .k-button.k-grid-save-changes`).show();
                $(`.payment-requests .k-button.k-grid-cancel-changes`).show();
            }
        }
    });

    self.gridToolbar = [{
            name: "custom-create",
            text: "Add New",
            className: "k-grid-custom-create"
        },
        'save',
        'cancel'];

    self.gridColumns = [{
        field: 'PeriodID',
        title: 'Period',
        hidden: true,
        attributes: () => {
            return {
                "class": "readonly"
            }
        },
        template: (e) => {
            if (e.PeriodID) {
                let arraySplit = e.PeriodID.toString().match(/(\d\d\d?\d?)(\d\d)(\d\d)/);
                let dateString = `${arraySplit[1]}/${arraySplit[2]}/${arraySplit[3]}`;
                return moment(Date.parse(dateString)).weekdayWithStartWeekday(0, 1).format('DD/MM/YYYY');
            } else {
                let momentFormatted = '';

                if (e.PaymentDueDate) {
                    momentFormatted = moment(e.PaymentDueDate).weekdayWithStartWeekday(0, 1).format('DD/MM/YYYY');
                }

                return momentFormatted;
            }
        },
        valueTemplate: (e) => {
            if (e.PeriodID) {
                let arraySplit = e.PeriodID.toString().match(/(\d\d\d?\d?)(\d\d)(\d\d)/);
                let dateString = `${arraySplit[1]}/${arraySplit[2]}/${arraySplit[3]}`;
                return moment(Date.parse(dateString)).weekdayWithStartWeekday(0, 1).format('DD/MM/YYYY');
            } else {
                return '';
            }
        },
        editor: (container, options) => {
            let momentFormatted = '';
            if (options.model.PeriodID) {
                let arraySplit = options.model.PeriodID.toString().match(/(\d\d\d?\d?)(\d\d)(\d\d)/);
                let dateString = `${arraySplit[1]}/${arraySplit[2]}/${arraySplit[3]}`;
                momentFormatted = moment(Date.parse(dateString)).weekdayWithStartWeekday(0, 1).format('DD/MM/YYYY');
                $(`<span>${momentFormatted}</span>`).appendTo(container);
            } else if (options.model.PaymentDueDate) {
                momentFormatted = moment(options.model.PaymentDueDate).weekdayWithStartWeekday(0, 1).format('DD/MM/YYYY');
                $(`<span>${momentFormatted}</span>`).appendTo(container);
            } else {
                return momentFormatted;
            }
        }
    }, {
        field: 'RequestType',
        title: 'Request Type',
        hidden: false,
        editable: false,
        groupHeaderTemplate: (dataItem) => dataItem.value ? `${dataItem.value}` : ``,
        attributes: (dataItem) => {
            return {
                "class": "readonly" + (dataItem.Finalised ? " finalised" : "")
            }
        },
        headerAttributes: {
            "class": "super-header"
        },
        template: (e) => {
            if (e.RequestType) {
                return e.RequestType;
            } else {
                return '';
            }
        },
        valueTemplate: (e) => {
            if (e.RequestType) {
                return e.RequestType;
            } else {
                return '';
            }
        },
        editor: (container, options) => {
            if (options.model.ReadOnly || (!options.model.isNew())) {
                $(`<span>${options.model.RequestType}</span>`)
                    .appendTo(container);
            } else {
                $(`<input type="text" required name="${options.field}" validationMessage="You must specify a Request Type" />`)
                    .appendTo(container)
                    .kendoDropDownList({
                        dataTextField: 'Name',
                        dataValueField: 'PaymentRequestStatusID',
                        value: options.model.PaymentRequestStatusID,
                        autoWidth: true,
                        filter: false,
                        template: (e) => {
                            return e.Name;
                        },
                        valueTemplate: (e) => {
                            return e.Name;
                        },
                        dataSource: new kendo.data.DataSource({
                            type: 'odata-v4',
                            serverFiltering: true,
                            serverSorting: true,
                            serverPaging: true,
                            sort: [{
                                field: "SortOrder", dir: "asc"
                            }],
                            page: 1,
                            pageSize: 10,
                            transport: {
                                read: '/odata/PaymentRequestStatuses',
                                parameterMap: (data, operation) => {

                                    //Generate parameters in odata v4 format
                                    let d = kendo.data.transports['odata-v4'].parameterMap(data);

                                    delete d.$inlinecount; // <-- remove inlinecount
                                    delete d.$format; // <-- remove format
                                    delete d.$callback; // <-- remove callback

                                    d.$count = true;

                                    return d;
                                }
                            }
                        }),
                        change: (e) => {
                            let dataItem = e.sender.dataItem();
                            options.model.set('PaymentRequestType', dataItem.Name); // ... ?
                            options.model.set('PaymentRequestStatusID', dataItem.PaymentRequestStatusID);
                            self.gridWidget().refresh(); // ... ?
                        },
                        height: 'auto'
                    });
            }
        }
    }, {
        field: 'PaymentRequestType',
        title: ' ',
        groupHeaderTemplate: (dataItem) => `${dataItem.value}`,
        hidden: true
    }, {
        field: 'RequesterName',
        title: 'Requested By',
        hidden: true,
        editable: false,
        filterable: false,
        groupHeaderTemplate: (dataItem) => `${dataItem.value}`,
        attributes: {
            "class": "readonly"
        },
        headerAttributes: {
            "class": "sub-header"
        },
        template: (e) => {
            if (e.RequesterName) {
                return e.RequesterName;
            } else {
                return '';
            }
        },
        valueTemplate: (e) => {
            if (e.RequesterName) {
                return e.RequesterName;
            } else {
                return '';
            }
        },
    }, {
        field: 'PaymentRequestCreated',
        title: 'Created',
        hidden: true,
        width: 130,
        attributes: {
            "class": "readonly"
        },
        template: (e) => {
            if (e.PaymentRequestCreated) {
                return moment(e.PaymentRequestCreated).format('DD/MM/YYYY')
            } else {
                return '';
            }
        },
        valueTemplate: (e) => {
            if (e.PaymentRequestCreated) {
                return moment(e.PaymentRequestCreated).format('DD/MM/YYYY')
            } else {
                return '';
            }
        },
    }, {
        field: 'PaymentDueDate',
        title: 'Pay Date',
        width: 190,
        format: 'dd/MM/yyyy',
        parseFormats: ["dd/MM/yyyy", "dd/MM/yy"],
        autoCorrectParts: true,
        attributes: {
            "class": "relative",
            "required": true,
            validationMessage: "You must specify a Pay Date"
        },
        editable: (dataItem) => {
            return false;
        },
        template: (e) => {
            if (e.PaymentDueDate) {
                return moment(e.PaymentDueDate).format('DD/MM/YYYY');
            } else {
                return '';
            }
        },
        valueTemplate: (e) => {
            if (e.PaymentDueDate) {
                return moment(e.PaymentDueDate).format('DD/MM/YYYY');
            } else {
                return '';
            }
        }
    }, {
        field: 'SupplierCode',
        title: 'Supplier',
        width: 280,
        attributes: {
            "class": "dropdown-container-cell"
        },
        editable: (dataItem) => {
            return false;
        },
        editor: (container, options) => {
            if (options.model.ReadOnly) {
                $(`<span>${options.model.SupplierCode} - ${options.model.SupplierName}</span>`)
                    .appendTo(container);
            } else {
                $(`<input type="text" required name="${options.field}" validationMessage="You must specify a Supplier" />`)
                    .appendTo(container)
                    .kendoDropDownList({
                        dataTextField: 'Name',
                        dataValueField: 'Code',
                        value: options.model.SupplierCode,
                        autoWidth: true,
                        filter: 'startswith',
                        template: (e) => {
                            if (e.Code && e.Name) {
                                return `${e.Code} - ${e.Name}`
                            } else {
                                return `${e.Code} - [UNNAMED]`
                            }
                        },
                        valueTemplate: (e) => {
                            if (e.Code && e.Name) {
                                return `${e.Code} - ${e.Name}`
                            } else {
                                return `${e.Code} - [UNNAMED]`
                            }
                        },
                        dataSource: new kendo.data.DataSource({
                            type: 'odata-v4',
                            serverFiltering: true,
                            serverSorting: true,
                            serverPaging: true,
                            sort: [{
                                field: "Code", dir: "asc"
                            }, {
                                field: "Name", dir: "asc"
                            }],
                            page: 1,
                            pageSize: 10,
                            transport: {
                                read: '/odata/MertexLiveSuppliers?$expand=Currency',
                                parameterMap: (data, operation) => {

                                    //Generate parameters in odata v4 format
                                    let d = kendo.data.transports['odata-v4'].parameterMap(data);

                                    delete d.$inlinecount; // <-- remove inlinecount
                                    delete d.$format; // <-- remove format
                                    delete d.$callback; // <-- remove callback

                                    d.$count = true;

                                    let filters = [];

                                    if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "Name")) {
                                        let f = data.filter.filters.find(f => f.field === "Name");
                                        filters.push(`(contains(Name,'${f.value}') or startswith(tolower(Code),'${f.value}'))`);
                                    }

                                    if (filters.length) {
                                        let filterString = filters.join(' and ');
                                        d.$apply = `filter(${filterString})`;
                                    }

                                    // evidently .$filter is taking precedence over .$apply, and I prefer apply, so...
                                    if (d.$filter) {
                                        delete d.$filter;
                                    }

                                    if (!d.$apply) {
                                        delete d.$apply;
                                    } else {
                                        //console.log(d.$apply);
                                    }

                                    return d;
                                }
                            }
                        }),
                        change: (e) => {
                            let dataItem = e.sender.dataItem();

                            options.model.set('SupplierCode', dataItem.Code);
                            options.model.set('SupplierName', dataItem.Name);

                            options.model.set("CurrencyID", dataItem.Currency.CurrencyID);
                            options.model.set("FormattingCulture", dataItem.Currency.FormattingCulture);
                            options.model.set("CurrencyName", dataItem.Currency.Name);
                            options.model.set("CurrencyCode", dataItem.Currency.Code);
                            options.model.set("CurrencySymbol", dataItem.Currency.Symbol);

                            self.gridWidget().refresh();
                        },
                        height: 340,
                        virtual: {
                            itemHeight: 34,
                            mapValueTo: 'dataItem',
                            valueMapper: function (options) {
                                if (options.value) {
                                    $.ajax({
                                        url: `/odata/MertexLiveSuppliers/Default.MertexLiveSupplierValueMapper(supplierCode='${options.value || "null"}')?$expand=Currency`,
                                        type: 'GET',
                                        success: function (data) {
                                            options.success(data.value);
                                        }
                                    });
                                } else {
                                    options.success();
                                }
                            }
                        }
                    });
            }
        },
        template: (e) => {
            if (e.SupplierCode) {
                return `${e.SupplierCode} - ${(e.SupplierName ?? '[UNNAMED]')}`;
            } else {
                return '';
            }
        },
        valueTemplate: (e) => {
            if (e.SupplierCode) {
                return `${e.SupplierCode} - ${(e.SupplierName ?? '[UNNAMED]')}`;
            } else {
                return '';
            }
        }
    }, {
        field: 'CurrencyCode',
        title: 'Currency',
        editable: (dataItem) => {
            return false;
        },
        width: 100,
        attributes: {
            "class": "readonly"
        },
        template: (e) => {
            if (e.CurrencyName) {
                return `${e.CurrencyName} (${e.CurrencySymbol})`;
            } else {
                if (e.CurrencyCode) {
                    return e.CurrencyCode;
                }
                else {
                    return '';
                }
            }
        },
        valueTemplate: (e) => {
            if (e.CurrencyName) {
                return `${e.CurrencyName} (${e.CurrencySymbol})`;
            } else {
                if (e.CurrencyCode) {
                    return e.CurrencyCode;
                }
                else {
                    return '';
                }
            }
        },
        editor: (container, options) => {
            $(`${(options.model.dirty ? '<span class="k-dirty"></span>' : '')}<span>${(options.model.CurrencyName
                ? `${options.model.CurrencyName} (${options.model.CurrencySymbol})`
                : `${(options.model.CurrencyCode ? options.model.CurrencyCode : '')}`)}</span>`)
                .appendTo(container);
        }
    }, {
        field: 'RequestAmount',
        title: 'Amount',
        width: 220,
        attributes: {
            /*"class": "text-end"*/ // This is not the way. So sayeth Sarah, 16/01/2026.
        },
        editable: (dataItem) => {
            return dataItem.ReadOnly === false;
        },
        template: (e) => {
            if (e.RequestAmount) {
                if (e.CurrencyCode) {
                    return formatCurrency(e.RequestAmount, 2, e.FormattingCulture, e.CurrencyCode);
                } else {
                    return e.RequestAmount;
                }
            } else {
                return '';
            }
        },
        editor: (container, options) => {
            $('<input required data-bind="value:' + options.field + '" name="' + options.field + '" validationMessage="You must specify an Amount"/>')
                .appendTo(container)
                .kendoNumericTextBox({
                    format: "n2",
                    decimals: 2,
                    selectOnFocus: true,
                    min: options.model.ReduceRequestAmountInCurrencyMinimum,
                    change: (e) => {
                        console.log('RequestAmount change', e);
                        // We no longer do exchange rates / conversions at this stage of play: so sayeth Matthew 09.02.2026
                        //if (options.model.ExchangeRate) {
                        //    options.model.set('AmountInSterling', e.sender.value() / options.model.ExchangeRate);
                        //}
                    }
                });
        }
    }, {
        field: 'OutstandingAmount',
        title: 'Outstanding Amount',
        width: 220,
        attributes: {
            /*"class": "text-end"*/ // This is not the way. So sayeth Sarah, 16/01/2026.
        },
        editable: (dataItem) => {
            return false;
        },
        template: (e) => {
            if (e.OutstandingAmount != null) {
                if (e.CurrencyCode) {
                    return formatCurrency(e.OutstandingAmount, 2, e.FormattingCulture, e.CurrencyCode);
                } else {
                    return e.OutstandingAmount;
                }
            } else {
                return '';
            }
        }
    }, {
        field: 'Status',
        title: 'Status',
        width: 220,
        attributes: {
            "class": "dropdown-container-cell"
        },
        editable: (dataItem) => {
            return false;
        },
        template: (e) => {
            if (e.Status) {
                return `${e.Status}`;
            } else {
                return '';
            }
        }
    }, {
        field: 'PurchaseOrders',
        title: 'Purchase Order(s)',
        width: 200,
        attributes: {
            "class": "relative"
        },
        editable: (dataItem) => {
            return dataItem.ReadOnly === false;
        },
        template: (e) => {
            if (e.PurchaseOrders) {
                if (typeof e.PurchaseOrders.map === 'function') {
                    return e.PurchaseOrders.map(p => p.PurchaseOrderHeadID).join(", ");
                } else {
                    return e.PurchaseOrders.split(',').map(p => p.trim()).join(", ");
                }
            } else {
                return '';
            }
        },
        editor: (container, options) => {
            $(`<textarea type="text" name='${options.field}'></textarea>`)
                .appendTo(container)
                .kendoMultiSelect({
                    autoBind: true,
                    autoWidth: true,
                    valuePrimitive: false,
                    value: options.model.PurchaseOrders != null
                        ? [...options.model.PurchaseOrders].map(p => p.PurchaseOrderHeadID) //.map(p => p.PurchaseOrderHeadID),
                        : [],
                    dataTextField: 'PurchaseOrderHeadID',
                    dataValueField: 'PurchaseOrderHeadID',
                    filter: 'startswith',
                    height: 340,
                    virtual: {
                        itemHeight: 34,
                        mapValueTo: 'dataItem',
                        valueMapper: (options) => {
                            if (options.value && options.value.length && options.value[0] != '') {
                                $.ajax({
                                    url: `/odata/PurchaseOrderHeads/Default.PurchaseOrderHeadValueMapper(purchaseOrderHeadIds='${options.value.join(',') || "null"}')`,
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
                    dataSource: new kendo.data.DataSource({
                        type: 'odata-v4',
                        serverFiltering: true,
                        serverSorting: true,
                        serverPaging: true,
                        page: 1,
                        pageSize: 40,
                        sort: {
                            field: 'CreatedDT',
                            dir: 'desc'
                        },
                        dataTextField: 'PurchaseOrderHeadID',
                        dataValueField: 'PurchaseOrderHeadID',
                        schema: {
                            parse: (response) => {
                                let items = [];
                                for (var i = 0; i < response.value.length; i++) {
                                    var item = {
                                        PaymentRequestID: options.model.PaymentRequestID,
                                        PurchaseOrderHeadID: response.value[i].PurchaseOrderHeadID
                                    };
                                    items.push(item);
                                }
                                response.value = items;
                                return response;
                            }
                        },
                        transport: {
                            read: {
                                url: '/odata/PurchaseOrderHeads',
                            },
                            parameterMap: (data, operation) => {

                                //Generate parameters in odata v4 format
                                let d = kendo.data.transports['odata-v4'].parameterMap(data);

                                delete d.$inlinecount; // <-- remove inlinecount
                                delete d.$format; // <-- remove format
                                delete d.$callback; // <-- remove callback

                                d.$count = true;

                                let filters = [];

                                return d;

                            }
                        },
                    }),
                    change: function (e) {
                        console.log('change', e);
                    },
                    template: (e) => {
                        if (e.PurchaseOrderHeadID) {
                            return e.PurchaseOrderHeadID;
                        } else {
                            return '';
                        }
                    },
                    valueTemplate: (e) => {
                        if (e.PurchaseOrderHeadID) {
                            return e.PurchaseOrderHeadID;
                        } else {
                            return '';
                        }
                    },
                    popup: {
                        appendTo: $('.k-edit-cell'),
                        position: 'top left'
                    }
                });
        }
    }, {
        field: 'ProformaNumber',
        title: 'Proforma Number',
        editable: (dataItem) => {
            return dataItem.ReadOnly === false;
        },
    }, {
        field: 'RequesterComments',
        title: 'Requester Comments',
        editable: (dataItem) => {
            return dataItem.ReadOnly === false;
        },
        editor: (container, options) => {
            let textarea = document.createElement('textarea');

            textarea.value = options.model[options.field];

            textarea.classList.add('form-control');
            textarea.setAttribute('rows', '3');
            textarea.setAttribute('id', 'textarea-editor');

            container[0].appendChild(textarea);

            $("#textarea-editor").on('blur', (event) => {
                if (textarea.value) {
                    options.model.set('RequesterComments', textarea.value);
                } else {
                    options.model.set('RequesterComments', null);
                }
            })
        },
        template: (e) => {
            if (e.RequesterComments) {
                return e.RequesterComments?.replace(/\n/gm, '<br/>');
            } else {
                return '';
            }
        }
    }, {
        field: 'ReadOnly',
        title: ' ',
        filterable: false,
        editable: false,
        width: 64,
        attributes: {
            "class": "text-center"
        },
        template: (dataItem) => {
            return `<a tabindex="0"
                        class="bi bi-info-circle fs-4"
                        data-bs-html="true"
                        data-bs-trigger="focus"
                        data-bs-toggle="popover"
                        data-bs-title="Details"
                        data-bs-content="Created: ${moment(dataItem.PaymentRequestCreated).format('dddd DD/MM/YYYY HH:mm')}<br/>Modified: ${moment(dataItem.PaymentRequestModified).format('dddd DD/MM/YYYY HH:mm')}"></a>`;
        },
        valueTemplate: (dataItem) => {
            return `<a tabindex="0"
                        class="bi bi-info-circle fs-4"
                        data-bs-html="true"
                        data-bs-trigger="focus"
                        data-bs-toggle="popover"
                        data-bs-title="Details"
                        data-bs-content="Created: ${moment(dataItem.PaymentRequestCreated).format('dddd DD/MM/YYYY HH:mm')}<br/>Modified: ${moment(dataItem.PaymentRequestModified).format('dddd DD/MM/YYYY HH:mm')}"></a>`;
        }
    }, {
        command: [{
            name: 'destroy',
            visible: (e) => {
                return e.Deletable === true;
            }
        }]
    }];

    self.skipEditEvent = true;

    self.gridParams = {
        autoBind: true,
        widget: self.gridWidget,
        columns: self.gridColumns,
        data: self.gridDataSource,
        toolbar: self.gridToolbar,
        scrollable: false,
        sortable: true,
        filterable: true,
        reorderable: false,
        groupable: false,
        paging: true,
        pageSize: 10,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        beforeEdit: function (e) {

        },
        selectable: false,
        editable: true,
        edit: function (e) {

            console.log('paymentRequests edit', e);

            if (e.model.isNew() && self.skipEditEvent) {

                e.preventDefault();

                self.skipEditEvent = false;

                e.sender.editCell($(e.sender.element.find('tr.k-grid-edit-row td:eq(3)')));

                return;
            } else {

                window.setTimeout(() => {

                    let dropdown = e.container.find("[data-role=dropdownlist]").data("kendoDropDownList");

                    if (dropdown) {
                        dropdown.open();
                        return;
                    }

                    let datePicker = e.container.find("[data-role=datepicker]").data("kendoDatePicker");

                    if (datePicker) {
                        datePicker.setOptions({
                            close: (event) => {
                                console.log('close fired', event);
                                e.sender.editCell($(e.container).closest('tr').find("td:eq(4)"));
                            }
                        });

                        datePicker.open();
                    }

                    self.skipEditEvent = false;

                }, 0);
            }
        },
        dataBound: (e) => {
            console.log('paymentRequests dataBound', e);

            self.refreshDashboard();

            window.setTimeout(() => {
                const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
                const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl, {
                    container: popoverTriggerEl
                }));
            }, 0);
        },
        saveChanges: (e) => {
            console.log('paymentRequests saveChanges', e);

            let data = e.sender.dataSource.data();

            for (let i = 0; i < data.length; i++) {

                let item = data[i];

                if (item.isNew() || item.dirty) {

                    if (item.PaymentDueDate) {
                        item.PeriodID = moment(item.PaymentDueDate).weekdayWithStartWeekday(0, 1).format('YYYYMMDD');
                    }

                    delete item.CurrencyID;

                    if (item.ProformaNumber == '')
                        item.ProformaNumber = null;

                    if (item.RequesterComments == '')
                        item.RequesterComments = null;

                    if (item.DeciderComments == '')
                        item.DeciderComments = null;

                    delete item.PaymentRequestStatus;
                    delete item.RequestedByMember;
                    delete item.Currency;
                    delete item.Supplier;

                    if (item.PurchaseOrders != null) {
                        item.PurchaseOrders.forEach(po => {
                            po = {
                                PurchaseOrderHeadID: po.PurchaseOrderHeadID,
                                PaymentRequestID: po.PaymentRequestID ?? null
                            }
                        });
                    }
                }
            }

            self.refreshApprovals();

            self.skipEditEvent = true;
        },
        save: (data) => {
            console.log('paymentRequests save', data);

            if (Object.hasOwn(data.values, 'PaymentDueDate')) {
                window.setTimeout(() => {
                    data.sender.editCell($(data.sender.table).find('td:eq(4)'));
                }, 0);
            } else if (Object.hasOwn(data.values, 'SupplierCode')) {
                window.setTimeout(() => {
                    data.sender.editCell($(data.sender.table).find('td:eq(6)'));
                })
            } else if (Object.hasOwn(data.values, 'AmountInCurrency')) {
                window.setTimeout(() => {
                    if (data.sender.options.identifier == 'paymentPlanGrid') {
                        data.sender.editCell($(data.sender.table).find('td:eq(10)'));
                    } else {
                        data.sender.editCell($(data.sender.table).find('td:eq(9)'));
                    }
                })
            }
        },
        error: function (e) {
            console.error(`paymentRequests errors`, e);

            // e.xhr contains the full response from the server
            var response = JSON.parse(e.xhr.responseText);

            var message = JSON.stringify(response.error, null, '\t');

            self.busy(false);

            window.showInfo('Errors', PR.prettyPrintOne(message));

            // Revert changes in the grid, possibly? maybe not
            self.gridWidget().cancelChanges();
        }
    };

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds



    //#endregion



    //#region Subscriptions

    self.filters.requestFilters.subscribe(nv => {
        self.refresh();
    });

    //#endregion



    //#region Methods

    self.openNewRequestModal = () => {
        self.newRequest(supplierPaymentsRequestViewModel({
            rec: {
                created: new Date()
            }
        }));

        self.addNewModal.show();
    }

    self.closeNewRequestModal = () => {

        self.addNewModal.hide();

        self.newRequest(supplierPaymentsRequestViewModel({
            rec: {
                created: new Date()
            }
        }));
    }

    self.saveNewRequestModal = () => {
        self.newRequest().validateNow(true);

        window.setTimeout(() => {
            if (self.newRequest().errors().length) {
                self.newRequest().errors.filter(e => {
                    e.isValid.notifySubscribers(e.isValid());
                });
            } else {
                self.reallySaveNewRequestModal();
            }
        }, 0);
    }

    self.reallySaveNewRequestModal = () => {
        self.busy(true); 

        let data = self.newRequest().toJS();

        console.log('supplierPaymentRequests createPaymentRequest calling with', data);

        fetch('/api/SupplierPayments/CreatePaymentRequest', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                self.busy(false);
                self.closeNewRequestModal();
                self.refresh();
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
    }

    self.refresh = () => {
        console.log('supplierPaymentRequests refresh called');
        self.gridWidget() && self.gridWidget().dataSource.query({
            page: self.gridWidget().dataSource.page(),
            pageSize: self.gridWidget().dataSource.pageSize(),
            filter: self.gridWidget().dataSource.filter(),
            sort: self.gridWidget().dataSource.sort(),
            group: self.gridWidget().dataSource.group()
        });
    }

    self.ready.subscribe(nv => {
        $(".k-grid-custom-create").click(function (e) {
            e.preventDefault();

            self.openNewRequestModal();

            //self.gridParams.widget().setOptions({
            //    editable: {
            //        mode: 'popup',
            //        template: self.popupEditorTemplate
            //    }
            //});

            //let ds = self.gridParams.widget().dataSource;

            //let created = new Date();

            //// 1. Manually insert an empty object at index 0
            //let newItem = ds.insert(0, {
            //    PaymentRequestType: 'Add New',
            //    PaymentRequestStatusID: 1,
            //    RequesterName: getUserName(),
            //    PaymentRequestCreated: created,
            //    PaymentDueDate: null,
            //    SupplierCode: null,
            //    SupplierName: null,
            //    ReadOnly: false
            //});

            //// 2. Find the newly created row in the DOM and put it in edit mode
            //let newRow = self.gridParams.widget().items().filter("[data-uid='" + newItem.uid + "']");

            //self.gridParams.widget().editRow(newRow);
        });
    });

    //#endregion



    //#region Events



    //#endregion


    return self;
};