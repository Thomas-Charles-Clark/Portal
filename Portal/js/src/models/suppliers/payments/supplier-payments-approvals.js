const supplierPaymentsApprovalsViewModel = ({
    ready,
    busy,
    busyMessage,
    filters,
    refreshDashboard
} = {
    ready: ko.observable(false),
    busy: ko.observable(false),
    busyMessage: ko.observable('Please Wait'),
    filters: {},
        refreshDashboard: () => { }
}) => {

    let self = {
        ready,
        busy: busy,
        busyMessage,
        filters,
        refreshDashboard
    };

    //#region Lifted Methods
    
    self.refresh = () => {
        self.gridWidget().dataSource.query({
            page: self.gridWidget().dataSource.page(),
            pageSize: self.gridWidget().dataSource.pageSize(),
            filter: self.gridWidget().dataSource.filter(),
            sort: self.gridWidget().dataSource.sort()
        });
    }

    //#endregion

    //#region Properties

    self.basket = supplierPaymentsApprovalsBasketViewModel({
        ready: self.ready,
        busy: self.busy,
        busyMessage: self.busyMessage,
        filters: self.filters,
        refreshApprovals: self.refresh,
        refreshDashboard: self.refreshDashboard
    });

    self.gridWidget = ko.observable();

    self.expandedSupplierGroupRows = [];

    //#endregion



    //#region Components

    self.gridDataSource = new kendo.data.DataSource({
        sortable: true,
        filterable: true,
        grouping: true,
        serverGrouping: true,
        serverFiltering: true,
        serverPaging: true,
        serverSorting: true,
        pageSize: 20,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        batch: true,
        transport: {
            read: (options) => {

                let webapi = new kendo.data.transports.webapi({ prefix: "" });

                let mapped = webapi.parameterMap(options.data);

                let data = self.filters.toJS();

                data.requestedByMemberId = data.memberId;

                delete data.memberId;

                for (var propertyName in mapped) {
                    data[propertyName] = mapped[propertyName];
                }

                if (data.pageSize == null) {
                    delete data.pageSize;
                }

                let qs = new URLSearchParams(data);

                fetch(`/api/SupplierPayments/ApprovalsGridRead?${qs}`, {
                    method: 'GET',
                    headers: window.fetchHeaders,
                    cache: 'no-cache',
                    credentials: 'same-origin'
                })
                    .then(window.handleFetchResponse)
                    .then(data => {

                        self.gridWidget().setOptions({
                            columns: self.gridColumns({
                                productHeadingOne: data.newCollectionProductHeadings.NewCollectionHeading_1,
                                productHeadingTwo: data.newCollectionProductHeadings.NewCollectionHeading_2,
                                productHeadingThree: data.newCollectionProductHeadings.NewCollectionHeading_3
                            })
                        })

                        for (var i = 0; i < data.kendoGridResult.Data.length; i++) {

                            data.kendoGridResult.Data[i].Details = data.detailResult.filter(d => d.SupplierCode == data.kendoGridResult.Data[i].SupplierCode);

                            for (var j = 0; j < data.kendoGridResult.Data[i].Details.length; j++) {
                                data.kendoGridResult.Data[i].Details[j].FormattingCulture = data.kendoGridResult.Data[i].SupplierCurrencyFormattingCulture;
                                data.kendoGridResult.Data[i].Details[j].CurrencyCode = data.kendoGridResult.Data[i].SupplierCurrencyCode;
                            }

                            if (data.kendoGridResult.Data[i].Details.length) {
                                console.log('details', data.kendoGridResult.Data[i].Details);
                            }
                        }
                        
                        options.success(data.kendoGridResult);
                    })
                    .catch(window.catchFetchError);
            }
        },
        error: (e) => {
            console.error(`error`, e);
        },
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            filters: "Filters",
            aggregates: "Aggregates",
            errors: "Errors",
            model: {
                id: 'SupplierCode',
                fields: {
                    SupplierCode: {
                        type: 'string',
                    },
                    SupplierName: {
                        type: 'string'
                    },
                    SupplierType: {
                        type: 'string'
                    },
                    BudgetHolder: {
                        type: 'string'
                    },
                    SupplierCurrencyCode: {
                        type: 'string',
                    },
                    SupplierCurrencyFormattingCulture: {
                        type: 'string'
                    },
                    BackOrderQuantity: {
                        type: 'number'
                    },
                    BackOrderValueGBP: {
                        type: 'number'
                    },
                    NewCollectionProductCount_1: {
                        type: 'number'
                    },
                    NewCollectionProductCount_2: {
                        type: 'number'
                    },
                    NewCollectionProductCount_3: {
                        type: 'number'
                    },
                    TotalValueGBP: {
                        type: 'number',
                        nullable: false
                    },
                    TotalValue: {
                        type: 'number',
                        nullable: false
                    },
                    NotDueTotalValue: {
                        type: 'number',
                        nullable: false
                    },
                    OverdueTotalValue: {
                        type: 'number',
                        nullable: false
                    },
                    Debt30DayTotal: {
                        type: 'number',
                        nullable: false
                    },
                    Debt60DayTotal: {
                        type: 'number',
                        nullable: false
                    },
                    Debt90DayTotal: {
                        type: 'number',
                        nullable: false
                    },
                    Debt120DayTotal: {
                        type: 'number',
                        nullable: false
                    },
                    ProductionStopped: {
                        type: 'boolean'
                    },
                    ShippingStopped: {
                        type: 'boolean'
                    },
                    PaymentRequestPaymentPlanTotal: {
                        type: 'number'
                    },
                    PaymentRequestOtherTotal: {
                        type: 'number'
                    },
                    Details: {
                        type: 'object',
                        fields: [{
                            SupplierCode: { type: 'string' },
                            FundingID: { type: 'number' },
                            WeekCommencing: { type: 'date' },
                            AvailableForApprovalInSterling: { type: 'number' },
                            TargetSpendInSterling: { type: 'number' },
                            SpentInSterling: { type: 'number' },
                            RemainingInSterling: { type: 'number' }
                        }]
                    }
                }
            },
            parse: function (response) {

                for (let i = 0; i < response.Data.length; i++) {
                    let items = [];

                    for (let j = 0; j < response.Data[i].Details.length; j++) {

                        response.Data[i].Details[j].CurrencyCode = response.Data[i].SupplierCurrencyCode;

                        response.Data[i].Details[j].Currency = {
                            Code: response.Data[i].SupplierCurrencyCode,
                            FormattingCulture: response.Data[i].SupplierCurrencyFormattingCulture
                        }

                        response.Data[i].Details[j].Supplier = {
                            Code: response.Data[i].SupplierCode,
                            Name: response.Data[i].SupplierName
                        }

                        response.Data[i].Details[j].RequestedByMember = {
                            MemberID: response.Data[i].Details[j].RequestedByMemberID,
                            FullName: response.Data[i].Details[j].RequestedbyMemberName,
                        }

                        items.push(supplierPaymentsApprovalViewModel({
                            rec: response.Data[i].Details[j]
                        }));
                    }

                    response.Data[i].Details = items;
                }

                console.log('supplierPaymentApprovals schema.parse returning', response);

                return response;
            }
        }),
        errors: function (e) {
            console.error(`errors`, e);

            // e.xhr contains the full response from the server
            var response = JSON.parse(e.xhr.responseText);

            var message = JSON.stringify(response.error, null, '\t');

            self.busy(false);

            window.showInfo('Errors', PR.prettyPrintOne(message));

            // Revert changes in the grid if necessary
            self.gridWidget().cancelChanges();
        },
        requestStart: (e) => {
            self.busy(true);

            console.log(`requestStart`, e);

            if (self.ready()) {
                self.refreshDashboard();
            }
        },
        noDataTemplate: 'Nothing to display',
        requestEnd: (e) => {

            console.log(`requestEnd`, e);

            self.busy(false);
        }
    });

    self.gridColumns = ({
        productHeadingOne,
        productHeadingTwo,
        productHeadingThree
    }) => [{
        title: 'Supplier',
        columns: [{
            field: 'SupplierCode',
            title: 'Code',
            filterable: {
                extra: false
            }
        }, {
            field: 'SupplierName',
            title: 'Name',
            filterable: {
                extra: false
            }
        }, {
            field: 'SupplierType',
            title: 'Type',
            filterable: {
                extra: false
            }
        }, {
            field: 'BudgetHolder',
            title: 'Budget Holder',
            filterable: {
                extra: false
            }
        }]
    }, {
        title: 'Back Orders',
        columns: [{
            field: 'BackOrderQuantity',
            title: 'Quantity',
            filterable: {
                extra: false
            },
            template: (e) => {
                if (e.BackOrderQuantity != null) {
                    return formatNumber(e.BackOrderQuantity, 2, 'en-GB');
                } else {
                    return '';
                }
            }
        }, {
            field: 'BackOrderValueGBP',
            title: 'Value',
            filterable: {
                extra: false
            },
            template: (e) => {
                if (e.TotalValue != null) {
                    return formatCurrency(e.BackOrderValueGBP, 2, 'en-GB', 'GBP');
                } else {
                    return '';
                }
            }
        }]
    }, {
        title: 'New Collection Products',
        columns: [{
            field: 'NewCollectionProductCount_1',
            title: productHeadingOne,
            filterable: {
                extra: false
            }
        }, {
            field: 'NewCollectionProductCount_2',
            title: productHeadingTwo,
            filterable: {
                extra: false
            }
        }, {
            field: 'NewCollectionProductCount_3',
            title: productHeadingThree,
            filterable: {
                extra: false
            }
        }]
    }, {
        title: 'Supplier Invoices',
        columns: [{
            field: 'TotalValue',
            title: 'Total',
            width: 120,
            template: (e) => {
                if (e.TotalValue != null) {
                    return formatCurrency(e.TotalValue, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
                } else {
                    return '';
                }
            }
        }, {
            field: 'NotDueTotalValue',
            title: 'Not Due',
            width: 120,
            template: (e) => {
                if (e.TotalValue != null) {
                    return formatCurrency(e.NotDueTotalValue, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
                } else {
                    return '';
                }
            }
        }, {
            field: 'OverdueTotalValue',
            title: 'Overdue',
            width: 120,
            template: (e) => {
                if (e.OverdueTotalValue != null) {
                    return formatCurrency(e.OverdueTotalValue, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
                } else {
                    return '';
                }
            }
        }, {
            field: 'Debt30DayValue',
            title: '30 day',
            width: 120,
            template: (e) => {
                if (e.Debt30DayValue != null) {
                    return formatCurrency(e.Debt30DayValue, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
                } else {
                    return '';
                }
            }
        }, {
            field: 'Debt60DayValue',
            title: '60 day',
            width: 120,
            template: (e) => {
                if (e.Debt60DayValue != null) {
                    return formatCurrency(e.Debt60DayValue, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
                } else {
                    return '';
                }
            }
        }, {
            field: 'Debt90DayValue',
            title: '90 day',
            width: 120,
            template: (e) => {
                if (e.Debt90DayValue != null) {
                    return formatCurrency(e.Debt90DayValue, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
                } else {
                    return '';
                }
            }
        }, {
            field: 'Debt120DayValue',
            title: '120 day',
            width: 120,
            template: (e) => {
                if (e.Debt120DayValue != null) {
                    return formatCurrency(e.Debt120DayValue, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
                } else {
                    return '';
                }
            }
        }]
    }, {
        title: 'Problems',
        columns: [{
            field: 'ProductionStopped',
            title: 'Production',
            attributes: (dataItem) => {
                if (dataItem.ProductionStopped) {
                    return {
                        "class": "text-center bg-white"
                    };
                } else {
                    return {
                        "class": ""
                    }
                }
            },
            width: 126,
            template: (dataItem) => {
                if (dataItem.ProductionStopped) {
                    return `<i class="bi bi-sign-stop-fill fs-2 text-red-600"></i>`;
                } else {
                    return ``;
                }
            }
        }, {
            field: 'ShippingStopped',
            title: 'Shipping',
            attributes: (dataItem) => {
                if (dataItem.ShippingStopped) {
                    return {
                        "class": "text-center bg-white"
                    };
                } else {
                    return {
                        "class": ""
                    }
                }
            },
            width: 126,
            template: (dataItem) => {
                if (dataItem.ShippingStopped) {
                    return `<i class="bi bi-sign-stop-fill fs-2 text-red-600"></i>`;
                } else {
                    return ``;
                }
            }
        }]
    }, {
        title: 'Payment Requests',
        columns: [{
            field: 'PaymentRequestPaymentPlanTotal',
            title: 'Payment Plan',
            width: 120,
            template: (e) => {
                if (e.PaymentRequestPaymentPlanTotal != null) {
                    return formatCurrency(e.PaymentRequestPaymentPlanTotal, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
                } else {
                    return '';
                }
            }
        }, {
            field: 'PaymentRequestOtherTotal',
            title: 'Other',
            width: 120,
            template: (e) => {
                if (e.PaymentRequestOtherTotal != null) {
                    return formatCurrency(e.PaymentRequestOtherTotal, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
                } else {
                    return '';
                }
            }
        }]
    }];

    self.alreadyInBasket = (dataItem) => {
        let bi = self.basket.items().find(bi => bi.PaymentRequestID == dataItem.PaymentRequestID && bi.CurrencyCode == dataItem.CurrencyCode);

        return bi != null;
    }

    self.gridParams = {
        autoBind: false,
        widget: self.gridWidget,
        columns: self.gridColumns({
            productHeadingOne: 'P1',
            productHeadingTwo: 'P2',
            productHeadingThree: 'P3'
        }),
        data: self.gridDataSource,
        detailTemplate: (item) => {
            return `<div class="supplier-detail-grid"></div>`
        },
        detailInit: (e) => {
            var detailRow = e.detailRow;

            detailRow.find(".supplier-detail-grid").kendoGrid({
                dataSource: new kendo.data.DataSource({
                    data: e.data.Details,
                    editable: true,
                    schema: {
                        model: {
                            key: 'PaymentRequestID',
                            fields: {
                                PaymentRequestID: { type: 'number', nullable: false },
                                ApprovedAmountInCurrency: { type: 'number', editable: false },
                                CreatedDT: { type: 'date', editable: false },
                                RequestedBy: { type: 'string', editable: false },
                                Currency: {
                                    type: 'object',
                                    fields: [{
                                        Code: { type: 'string', editable: false },
                                        FormattingCulture: { type: 'string', editable: false }
                                    }]
                                },
                                CurrencyCode: { type: 'string', editable: false },
                                DeciderComments: { type: 'string', editable: false },
                                ExchangeRate: { type: 'number', editable: false },
                                FormattingCulture: { type: 'string', editable: false },
                                OriginalAmountInCurrency: { type: 'number', editable: false },
                                OutstandingAmountInCurrency: {
                                    type: 'number',
                                    editable: true,
                                    nullable: false,
                                    validation: {
                                        required: {
                                            message: 'You must provide an Amount'
                                        }
                                    }
                                },
                                PaymentRequestStatusName: { type: 'string', editable: false },
                                PendingApprovalAmountInCurrency: { type: 'number', editable: false },
                                RequestedByMember: {
                                    type: 'object',
                                    fields: [{
                                        MemberID: { type: 'number', editable: false },
                                        FullName: { type: 'string', editable: false }
                                    }]
                                },
                                RequestedByMemberID: { type: 'number', editable: false },
                                RequestedByMemberName: { type: 'string', editable: false },
                                RequesterComments: { type: 'string', editable: false },
                                Supplier: {
                                    type: 'object',
                                    fields: [{
                                        Code: { type: 'string', editable: false },
                                        Name: { type: 'string', editable: false }
                                    }]
                                },
                                SupplierCode: { type: 'string', editable: false },
                                PayOnDate: {
                                    type: 'date',
                                    format: 'dd/MM/yyyy',
                                    defaultValue: new Date(),
                                    editable: true,
                                    validation: {
                                        required: {
                                            message: 'You must specify a Pay On Date'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }),
                scrollable: false,
                sortable: true,
                pageable: false,
                editable: true,
                dataBound: (e) => {

                    window.setTimeout(() => {
                        const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
                        const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl, {
                            container: popoverTriggerEl
                        }));
                    }, 0);
                },
                edit: function (e) {
                    console.log(`detailEdit`, e);
                },
                columns: [{
                    field: "SupplierCode",
                    title: "Supplier",
                    hidden: true,
                    editable: false
                }, {
                    field: "PaymentRequestID",
                    title: "Payment Request ID",
                    hidden: true,
                    editable: false
                }, {
                    field: 'RequesterComments',
                    title: 'Requester Comments',
                    hidden: true,
                    editable: false
                }, {
                    field: 'DeciderComments',
                    title: 'Decider Comments',
                    hidden: true,
                    editable: false
                }, {
                    field: 'RequestedByMemberName',
                    title: 'Requested By',
                    editable: false
                }, {
                    field: 'PaymentRequestID',
                    title: 'PaymentRequestID',
                    hidden: true,
                    editable: false
                }, {
                    field: 'RequestedByMemberID',
                    title: 'RequestedByMemberID',
                    hidden: true,
                    editable: false
                }, {
                    field: 'RequesterComments',
                    title: 'Request Comments',
                    editable: false
                }, {
                    field: "PaymentRequestStatusName",
                    title: "Type",
                    editable: false
                }, {
                    field: "OriginalAmountInCurrency",
                    title: "Original Amount",
                    template: (e) => {
                        if (e.OriginalAmountInCurrency != null) {
                            return formatCurrency(e.OriginalAmountInCurrency, 2, e.FormattingCulture, e.CurrencyCode);
                        } else {
                            return '';
                        }
                    },
                    editable: false
                }, {
                    field: "ApprovedAmountInCurrency",
                    title: "Previously Approved",
                    template: (e) => {
                        if (e.ApprovedAmountInCurrency != null) {
                            return formatCurrency(e.ApprovedAmountInCurrency, 2, e.FormattingCulture, e.CurrencyCode);
                        } else {
                            return '';
                        }
                    },
                    editable: false
                },
                {
                    field: "OutstandingAmountInCurrency",
                    title: "To Pay",
                    width: 190,
                    attributes: (dataItem) => {
                        if (self.alreadyInBasket(dataItem)) {
                            return {
                                "class": "approval-already-in-basket",
                                "required": true,
                                validationMessage: "You must specify an Amount"
                            }
                        } else {
                            return {
                                "class": "approval-editable",
                                "required": true,
                                validationMessage: "You must specify an Amount"
                            }
                        }
                    },
                    template: (e) => {
                        if (e.OutstandingAmountInCurrency != null) {
                            return formatCurrency(e.OutstandingAmountInCurrency, 2, e.FormattingCulture, e.CurrencyCode);
                        } else {
                            return '';
                        }
                    },
                    editor: (container, options) => {
                        if (self.alreadyInBasket(options.model)) {
                            $(`<span>${formatCurrency(options.model.OutstandingAmountInCurrency, 2, options.model.FormattingCulture, options.model.CurrencyCode)}</span>`)
                        } else {
                            $('<input data-bind="value:' + options.field + '" name="' + options.field + '"/>')
                                .appendTo(container)
                                .kendoNumericTextBox({
                                    format: "n2",
                                    decimals: 2,
                                    selectOnFocus: true
                                });
                        }
                    }
                }, {
                    field: 'PayOnDate',
                    title: 'Pay On Date',
                    width: 190,
                    format: 'dd/MM/yyyy',
                    parseFormats: ["dd/MM/yyyy", "dd/MM/yy"],
                    autoCorrectParts: true,
                    attributes: (dataItem) => {
                        if (self.alreadyInBasket(dataItem)) {
                            return {
                                "class": "approval-already-in-basket",
                                "required": true,
                                validationMessage: "You must specify a Pay On Date"
                            }
                        } else {
                            return {
                                "class": "approval-editable",
                                "required": true,
                                validationMessage: "You must specify a Pay On Date"
                            }
                        }
                    },
                    editable: (dataItem) => {
                        return self.alreadyInBasket(dataItem) == false;
                    },
                    template: (e) => {
                        if (e.PayOnDate) {
                            return moment(e.PayOnDate).format('DD/MM/YYYY');
                        } else {
                            return moment(new Date()).weekdayWithStartWeekday(0, 1).format('DD/MM/YYYY');
                        }
                    },
                    valueTemplate: (e) => {
                        if (e.PayOnDate) {
                            return moment(e.PayOnDate).format('DD/MM/YYYY');
                        } else {
                            return moment(new Date()).weekdayWithStartWeekday(0, 1).format('DD/MM/YYYY');
                        }
                    },
                    editor: function (container, options) {
                        if (self.alreadyInBasket(options.model)) {
                            $(`<span>${moment(options.model.PayOnDate).format('DD/MM/YYYY') }</span>`).appendTo(container);
                        } else {
                            let input = $('<input name="' + options.field + '"/>');
                            input.appendTo(container);

                            let initialValue = options.model.PayOnDate || moment(new Date()).weekdayWithStartWeekday(0, 1).toDate();

                            // 2. SILENTLY update the model if it was null
                            // This prevents the grid from re-rendering the cell and closing the editor
                            if (!options.model[options.field]) {
                                options.model[options.field] = initialValue;
                                options.model.dirty = true; // Manually mark as dirty if desired
                            }

                            input.kendoDatePicker({
                                format: "dd/MM/yyyy",
                                parseFormats: ["dd/MM/yyyy", "dd/MM/yy"],
                                value: initialValue,
                                change: function () {
                                    options.model.set(options.field, this.value());
                                }
                            });

                            input.on("focus", function () {
                                var inputElement = $(this);
                                setTimeout(function () {
                                    // Selects the entire text in the input box
                                    inputElement.select();
                                }, 10);
                            });
                        }
                    }
                }, {
                    command: [{
                        name: 'Approve',
                        visible: (dataItem) => self.alreadyInBasket(dataItem) == false,
                        className: self.filters.paymentPeriod()?.Finalised ? 'k-disabled' : 'k-grid-Approve',
                        template: `<button class="btn btn-secondary k-grid-Approve">
                            Approve
                        </button>`,
                        // data-bs-html="true" data-bs-trigger="focus" data-bs-toggle="popover" data-bs-title="Approve" data-bs-content="Loading..."
                        click: function (e) {
                            console.log('approve', e);
                            e.preventDefault();

                            if (!self.filters.paymentPeriod()?.Finalised) {
                                let tr = $(e.target).closest("tr");
                                let data = this.dataItem(tr);
                                if (data.OutstandingAmountInCurrency == 0) {
                                    window.showInfo('Paid', 'This Payment Request has already been paid in full.');
                                    return;
                                } else if (data.PayOnDate == null) {
                                    let td = tr.find('td:eq(13)').click();
                                    var validator = $(tr).kendoValidator().data("kendoValidator");
                                    validator.validate();
                                } else {
                                    self.basket.addBasketItem(data);
                                }
                            }
                        }
                    }, {
                        name: 'In Basket',
                        visible: (dataItem) => self.alreadyInBasket(dataItem) == true,
                        className: 'approval-editable',
                        template: `<span class="fs-5 text-success">Already in Basket</span>`
                    }]
                }]
            });
        },
        scrollable: false,
        sortable: true,
        filterable: true,
        reorderable: false,
        paging: true,
        pageSize: 20,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        selectable: false,
        editable: false,
        edit: function (e) {
            console.log(`approvals edit`, e);
        },
        change: (e) => {
            console.log(`approvals change`, e);

            //let selectedRows = e.sender.select();

            //let dataItems = [];

            //for (let i = 0; i < selectedRows.length; i++) {
            //    let r = selectedRows[i];
            //    dataItems.push(e.sender.dataItem(r));
            //}

            //self.basket.items(self.basket.items().concat(dataItems.map(r => supplierPaymentsApprovalViewModel({
            //    rec: r
            //}))));
        },
        detailExpand: (e) => {
            let supplierCode = e.sender.dataItem(e.masterRow).id;
            if (self.expandedSupplierGroupRows.indexOf(supplierCode) === -1) {
                self.expandedSupplierGroupRows.push(supplierCode);
            }
        },
        detailCollapse: (e) => {
            let supplierCode = e.sender.dataItem(e.masterRow).id;
            let index = self.expandedSupplierGroupRows.indexOf(supplierCode);
            if (index !== -1) {
                self.expandedSupplierGroupRows.splice(index, 1);
            }
        },
        dataBound: (e) => {
            console.log(`dataBound`, e);

            var grid = e.sender;

            var rows = grid.items();

            $(rows).each(function () {
                var dataItem = grid.dataItem(this);

                // Check if this row's uid is in our tracked list
                if (self.expandedSupplierGroupRows.indexOf(dataItem.id) !== -1) {
                    grid.expandRow(this);
                }
            });

            window.setTimeout(() => {

                // Find all master rows
                grid.tbody.find("tr.k-master-row").click(function (e) {
                    var target = $(e.target);
                    // If the icon is clicked, let Kendo handle it
                    if ((target.hasClass("k-i-expand")) || (target.hasClass("k-i-collapse"))) {
                        return;
                    }

                    var row = target.closest("tr.k-master-row");
                    var icon = row.find(".k-hierarchy-cell > a.k-svg-i-caret-alt-right");

                    // Expand if closed, collapse if expanded
                    if (icon.length) {
                        grid.expandRow(row);
                    } else {
                        grid.collapseRow(row);
                    }
                });
            }, 0);

            self.refreshDashboard();
        },
        save: (data) => {
            console.log(`saveChanges`, e);
        },
        saveChanges: (e) => {
            console.log(`saveChanges`, e);
        },
        excelExport: (e) => {
            let now = new Date();

            e.workbook.fileName = `Payment_Approvals_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.xlsx`;

            self.busy(false);
        }
    }

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds



    //#endregion



    //#region Subscriptions

    self.filters.approvalFilters.subscribe(nv => {
        self.refresh();
    });

    //#endregion



    //#region Methods

    self.approveAdditionToBasket = (data, event) => {
        console.log('approveAdditionToBasket called', data, event);
        self.basket.addBasketItem(data);
    }

    self.rejectApprovalRequest = (item) => {
        self.busy(true);

        let data = {
            paymentRequestId: item.PaymentRequestID,
        }

        console.log('rejectBasketItem', data);

        fetch('/api/SupplierPayments/RejectApprovalRequest', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                self.busy(false);

                console.warn('must re-query with current parameters as properties of options obj: page, pageSize, filter, sort');

                self.refresh();
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
    }

    self.exportToExcel = () => {
        self.busy(true);

        self.gridWidget().saveAsExcel();
    }

    //#endregion



    //#region Events



    //#endregion


    return self;
};