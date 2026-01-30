const supplierPaymentsApprovalsViewModel = ({
    ready,
    busy,
    busyMessage,
    filters
} = {
    ready: ko.observable(false),
    busy: ko.observable(false),
    busyMessage: ko.observable('Please Wait'),
    filters: {}
}) => {

    let self = {
        ready,
        busy,
        busyMessage,
        filters
    };

    //#region Properties

    self.basket = supplierPaymentsApprovalsBasketViewModel({
        rec: {}
    });

    self.gridWidget = ko.observable();

    //#endregion



    //#region Components

    self.gridDataSource = new kendo.data.DataSource({
        sortable: true,
        filterable: true,
        grouping: true,
        serverGrouping: true,
        serverFiltering: true,
        serverPaging: true,
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

                for (var propertyName in mapped) {
                    data[propertyName] = mapped[propertyName];
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
                    SupplierCurrencyCode: {
                        type: 'string',
                    },
                    PaymentRequestPaymentPlanTotal: {
                        type: 'number',
                        nullable: true
                    },
                    PaymentRequestOtherTotal: {
                        type: 'number',
                        nullable: true
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

    self.gridColumns = [{
        field: 'SupplierCode',
        title: 'Supplier',
        width: 420,
        attributes: {
            "class": "text-end"
        },
        filterable: {
            extra: false
        },
        template: (e) => {
            return `${e.SupplierName} (${e.SupplierCode})`
        }
    }, {
        field: 'PaymentRequestPaymentPlanTotal',
        title: 'Payment Plan Requests',
        width: 180,
        template: (e) => {
            if (e.PaymentRequestPaymentPlanTotal != null) {
                return formatCurrency(e.PaymentRequestPaymentPlanTotal, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
            } else {
                return '';
            }
        }
    }, {
        field: 'PaymentRequestOtherTotal',
        title: 'Other Requests',
        width: 180,
        template: (e) => {
            if (e.PaymentRequestOtherTotal != null) {
                return formatCurrency(e.PaymentRequestOtherTotal, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
            } else {
                return '';
            }
        }
    }, {
        field: 'TotalValue',
        title: 'Total Due',
        width: 180,
        template: (e) => {
            if (e.TotalValue != null) {
                return formatCurrency(e.TotalValue, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
            } else {
                return '';
            }
        }
    }, {
        field: 'TotalValue',
        title: 'Not Due',
        width: 180,
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
        width: 180,
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
        width: 180,
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
        width: 180,
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
        width: 180,
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
        width: 180,
        template: (e) => {
            if (e.Debt120DayValue != null) {
                return formatCurrency(e.Debt120DayValue, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
            } else {
                return '';
            }
        }
    }];

    self.gridParams = {
        autoBind: true,
        widget: self.gridWidget,
        columns: self.gridColumns,
        data: self.gridDataSource,
        detailTemplate: (item) => {
            return `<div class="supplier-detail-grid"></div>`
        },
        detailInit: (e) => {
            var detailRow = e.detailRow;

            detailRow.find(".supplier-detail-grid").kendoGrid({
                dataSource: e.data.Details,
                scrollable: false,
                sortable: true,
                pageable: false,
                columns: [{
                    field: "SupplierCode",
                    title: "Supplier",
                    hidden: true
                }, {
                    field: "PaymentRequestID",
                    title: "Payment Request ID",
                    hidden: true
                }, {
                    field: "PaymentRequestStatusName",
                    title: "Status"
                }, {
                    field: "OriginalAmountInCurrency",
                    title: "Original Amount in Currency",
                    template: (e) => {
                        if (e.OriginalAmountInCurrency != null) {
                            return formatCurrency(e.OriginalAmountInCurrency, 2, e.FormattingCulture, e.CurrencyCode);
                        } else {
                            return '';
                        }
                    }
                }, {
                    field: "PendingApprovalAmountInCurrency",
                    title: "Pending in Currency",
                    template: (e) => {
                        if (e.PendingApprovalAmountInCurrency != null) {
                            return formatCurrency(e.PendingApprovalAmountInCurrency, 2, e.FormattingCulture, e.CurrencyCode);
                        } else {
                            return '';
                        }
                    }
                }, {
                    field: "ApprovedAmountInCurrency",
                    title: "Approved in Currency",
                    template: (e) => {
                        if (e.ApprovedAmountInCurrency != null) {
                            return formatCurrency(e.ApprovedAmountInCurrency, 2, e.FormattingCulture, e.CurrencyCode);
                        } else {
                            return '';
                        }
                    }
                }, {
                    field: "OutstandingAmountInCurrency",
                    title: "Outstanding in Currency",
                    template: (e) => {
                        if (e.OutstandingAmountInCurrency != null) {
                            return formatCurrency(e.OutstandingAmountInCurrency, 2, e.FormattingCulture, e.CurrencyCode);
                        } else {
                            return '';
                        }
                    }
                }, {
                    command: [{
                        name: 'Approve',
                        click: (e) => {
                            console.log('approve', e);
                            e.preventDefault();
                            let tr = $(e.target).closest("tr");
                            let data = this.dataItem(data);
                            self.basket.addBasketItem(data);
                        }
                    }, {
                        name: 'Reject',
                        click: function (e) {
                            console.log('reject', e);
                            e.preventDefault();
                            let tr = $(e.target).closest("tr");
                            let data = this.dataItem(tr);
                            self.rejectApprovalRequest(data);
                        }
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
            console.log(`edit`, e);
        },
        change: (e) => {
            console.log(`change`, e);

            let selectedRows = e.sender.select();

            let dataItems = [];

            for (let i = 0; i < selectedRows.length; i++) {
                let r = selectedRows[i];
                dataItems.push(e.sender.dataItem(r));
            }

            self.basket.items(self.basket.items().concat(dataItems.map(r => supplierPaymentsApprovalViewModel({
                rec: r
            }))));
        },
        dataBound: (e) => {
            console.log(`dataBound`, e);

            var grid = e.sender;

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
        },
        save: (data) => {
            console.log(`saveChanges`, e);
        },
        saveChanges: (e) => {
            console.log(`saveChanges`, e);
        }
    }

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds



    //#endregion



    //#region Subscriptions



    //#endregion



    //#region Methods

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

                self.gridWidget().dataSource.query({
                    page: self.gridWidget().dataSource.page(),
                    pageSize: self.gridWidget().dataSource.pageSize(),
                    filter: self.gridWidget().dataSource.filter(),
                    sort: self.gridWidget().dataSource.sort()
                }); 
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
    }

    //#endregion



    //#region Events



    //#endregion


    return self;
};