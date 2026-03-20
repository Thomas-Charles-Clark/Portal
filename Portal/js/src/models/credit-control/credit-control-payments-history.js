const creditControlPaymentsHistoryViewModel = ({
    busy,
    filters
} = {
    busy: ko.observable(false),
    filters: {}
}) => {
    let self = {
        busy,
        filters
    };

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = busy;

    self.busyMessage = ko.observable('Please Wait');

    self.gridWidget = ko.observable();

    self.selectedPod = ko.observable();

    self.dashboardPods = ko.observableArray([]);

    //#endregion



    //#region Components

    self.gridColumns = [{
        field: "TradeAccountLabel",
        title: "Trade Account",
        attributes: {
            "class": "",
            "title": `Payment Request ID: #: PaymentRequestID #`
        },
        headerAttributes: {
            "class": ""
        },
        filterable: {
            extra: false
        },
        width: 180,
        template: (dataItem) => {
            return dataItem.TradeAccountLabel
        }
    }, {
        field: "CreditController",
        title: "Credit Controller",
        attributes: {
            "class": "",
        },
        headerAttributes: {
            "class": ""
        },
        filterable: {
            extra: false
        },
        width: 140,
        template: (dataItem) => {
            return dataItem.CreditController
        }
    }, {
        field: "OrderIDs",
        title: "Order IDs",
        width: 100,
        attributes: {
            "class": "",
        },
        headerAttributes: {
            "class": ""
        },
        filterable: {
            extra: false
        },
        template: (dataItem) => {
            if (dataItem.OrderIDs?.length)
                return dataItem.OrderIDs?.split(',').join('<br/>')
            else
                return '';
        }
    }, {
        field: "OrderStatus",
        title: "Order Status",
        width: 400,
        attributes: {
            "class": ""
        },
        headerAttributes: {
            "class": ""
        },
        filterable: {
            extra: false
        },
        template: (dataItem) => {
            if (dataItem.OrderStatus) {
                return dataItem.OrderStatus;
            } else {
                return '';
            }
        }
    }, {
        field: "PaymentRequestType",
        title: "Request Type",
        width: 180,
        attributes: {
            "class": ""
        },
        headerAttributes: {
            "class": ""
        },
        filterable: {
            extra: false
        }
    }, {
        field: "Amount",
        title: "Amount",
        width: 100,
        attributes: {
            "class": ""
        },
        headerAttributes: {
            "class": ""
        },
        filterable: {
            extra: false
        },
        template: `#: Amount ? formatCurrency(Amount, 2, FormattingCulture, CurrencyCode) : '' #`
    }, {
        field: "DocumentURI",
        title: "Share",
        width: 64,
        attributes: {
            "class": "relative",
            title: "Share Document"
        },
        headerAttributes: {
            "class": ""
        },
        filterable: false,
        template: (dataItem) => {
            if (dataItem.DocumentURI) {
                return `<a target="_blank" href="${dataItem.DocumentURI.replace('api/documentsapi/GetDocument', 'documents/view')}" class="stretched-link"><span class="material-icons">ios_share</i></a>`;
            } else {
                return '';
            }
        }
    }, {
        field: "DocumentURI",
        title: "Doc",
        width: 64,
        attributes: {
            "class": "relative",
            title: "View Document"
        },
        headerAttributes: {
            "class": ""
        },
        filterable: false,
        template: (dataItem) => {
            if (dataItem.DocumentURI) {
                return `<a target="_blank" href="${dataItem.DocumentURI}" class="stretched-link"><i class="bi bi-file-earmark-pdf"></i></a>`
            } else {
                return '';
            }
        }
    }, {
        field: "PaymentURI",
        title: "Pay",
        width: 64,
        attributes: {
            "class": "relative",
            "title": 'View Payment Page'
        },
        headerAttributes: {
            "class": ""
        },
        filterable: false,
        template: `<a target="_blank" href="#: PaymentURI #" class="stretched-link"><i class="bi bi-credit-card-2-front-fill"></i></a>`
    },  {
        field: "BraintreeTransactionURI",
        title: "Brain",
        width: 64,
        attributes: {
            "class": "relative",
            title: "View in Braintree"
        },
        headerAttributes: {
            "class": ""
        },
        filterable: false,
        template: (dataItem) => {
            if (dataItem.BraintreeTransactionURI) {
                return `<a target="_blank" href="${dataItem.BraintreeTransactionURI}" class="stretched-link">
                    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org">
                        <rect width="42" height="42" rx="4"></rect>
                        <path d="M10.1 34h12.4c6.3 0 10-2.6 10-7.4 0-3-2.2-5.2-5.3-6 2.1-0.9 3.9-2.6 3.9-5.6 0-6.1-3.4-8-8.9-8H10.1v3.8h2.8v18.4h-2.8V34zm6.9-15.1V11.8h4.7c3.4 0 5.1 1.2 5.1 3.5 0 2.3-1.8 3.5-5.1 3.5H17zm0 11.3v-7.6h4.8c4.1 0 6.2 1.3 6.2 3.8 0 2.5-2 3.8-5.9 3.8h-5.1z" fill="#fff"></path>
                    </svg>
                </a>`
            } else {
                return '';
            }
        }
    }, {
        field: "PaymentStatus",
        title: "Payment Status",
        width: 400,
        attributes: {
            "class": ""
        },
        headerAttributes: {
            "class": ""
        },
        filterable: {
            extra: false
        },
        template: (dataItem) => {
            if (dataItem.PaymentStatus) {
                return dataItem.PaymentStatus;
            } else {
                return '';
            }
        }
    }, {
        field: "ReceiptDetails",
        title: "Receipts",
        width: 320,
        attributes: {
            "class": ""
        },
        headerAttributes: {
            "class": ""
        },
        filterable: {
            extra: false
        },
        template: (dataItem) => {
            return dataItem.ReceiptDetails ?? '';
        }
    }, {
        field: "DepositAccountDetails",
        title: "Deposit Account Details",
        width: 240,
        attributes: {
            "class": ""
        },
        headerAttributes: {
            "class": ""
        },
        filterable: {
            extra: false
        },
        template: (dataItem) => {
            return dataItem.DepositAccountDetails ?? '';
        }
    }, {
        field: "ModifiedDT",
        title: "Last Modified",
        width: 140,
        attributes: {
            "class": ""
        },
        headerAttributes: {
            "class": ""
        },
        filterable: {
            extra: false
        },
        template: `#: ModifiedDT ? moment(ModifiedDT).format('DD/MM/YYYY HH:mm') : ''#`
    },];

    self.gridDataSourceRead = (options) => {
        var webapi = new kendo.data.transports.webapi({ prefix: "" });

        var mapped = webapi.parameterMap(options.data);

        var additionalParameters = self.filters.onlinePaymentHistoryFilters();

        var params = new URLSearchParams();

        if (self.selectedPod()) {
            additionalParameters.selectedPod = self.selectedPod().PodHandle;
            additionalParameters.parameterJson = self.selectedPod().ParameterJSON
        }

        var data = Object.assign(mapped, additionalParameters);

        for (var propertyName in data) {
            if (Array.isArray(data[propertyName])) {
                data[propertyName].forEach(v => {
                    params.append(propertyName, v);
                });
            } else {
                params.append(propertyName, data[propertyName]);
            }
        }

        console.log('onlinePaymentsHistory gridDataSourceRead calling with', data);

        self.busy(true);

        fetch('/api/creditcontrolapi/OnlinePaymentHistory?' + params, {
            method: 'GET',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin'
        })
            .then(window.handleFetchResponse)
            .then(data => {

                console.log('onlinePaymentsHistory gridDataSourceRead returned', data);

                ko.ignoreDependencies(() => {

                    if (Object.hasOwn(data, 'errorMessage')) {

                        document.querySelector('#info-modal').addEventListener('hide.bs.modal', self.refresh);
                        options.success([]);
                        window.showInfo('Sorry', data.errorMessage);

                    } else {
                        document.querySelector('#info-modal')?.removeEventListener('hide.bs.modal', self.refresh);

                        //self.previouslySelectedDashboardPod = self.selectedPod()?.PodHandle;

                        //self.dashboardPods(data.dashboardPods.map(dp => creditControlDashboardPodViewModel({
                        //    rec: dp
                        //})));

                        //if (self.previouslySelectedDashboardPod) {
                        //    self.selectedPod(self.dashboardPods().find(dp => dp.PodHandle == self.previouslySelectedDashboardPod));
                        //}

                        options.success(data.gridData);
                    }

                    if (typeof callback == 'function') {
                        callback();
                    } else {
                        self.busy(false);
                    }
                });

            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
    }

    self.gridParams = {
        autoBind: false,
        widget: self.gridWidget,
        columns: self.gridColumns,
        data: new kendo.data.DataSource({
            transport: {
                read: self.gridDataSourceRead
            },
            batch: false,
            sortable: true,
            filterable: true,
            grouping: false,
            serverFiltering: false,
            serverGrouping: false,
            serverPaging: true,
            serverAggregates: false,
            serverSorting: true,
            pageSize: 20,
            pageable: {
                pageSize: 20,
                pageSizes: [10, 20, 50, 100, 250, 500, 'all']
            },
            schema: $.extend({}, kendo.data.schemas.webapi, {
                data: "Data",
                total: "Total",
                errors: "Errors",
                sorts: "Sorts",
                aggregates: "Aggregates",
                model: {
                    id: 'PaymentRequestID',
                    fields: {
                        PaymentRequestGUID: { type: 'string' },
                        PaymentURI: { type: 'string' },
                        PaymentRequestType: { type: 'string' },
                        PaymentStatus: { type: 'string' },
                        OrderStatus: { type: 'string' },
                        CurrencyCode: { type: 'string' },
                        FormattingCulture: { type: 'string' },
                        Amount: { type: 'string' },
                        DocumentURI: { type: 'string' },
                        ModifiedDT: { type: 'date' },
                        OrderIDs: { type: 'string' },
                        TradeAccountLabel: { type: 'string' },
                        CreditController: { type: 'string' }
                    }
                }
            }),
            requestStart: (e) => {
                self.busy(true);
            },
            requestEnd: (e) => {
                self.busy(false);
            }
        }),
        //useKOTemplates: false,
        //rowTemplate: 'credit-control-trade-account-row-template',
        noRecords: {
            template: () => `No Results. Please search using the filters to the left.`//: ${$("#grid").data("kendoGrid").dataSource.page()}`
        },
        sortable: true,
        filterable: {
            extra: false,
            defaultOperation: 'contains'
        },
        reorderable: false,
        paging: true,
        pageSize: 20,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        excel: {
            allPages: true
        },
        selectable: false,
        change: function (event) {
            console.log('change', event, event.sender.select());

            if (event.sender.select()) {

                let classList = event.sender.select()[0].classList;

                let dataItem = event.sender.dataItem(event.sender.select().closest('tr'));

                if (classList.contains('debt-breakdown')) {
                    self.fetchDebtBreakdown(dataItem);
                }
                else if (classList.contains('orders-breakdown')) {
                    self.fetchOrdersBreakdown(dataItem);
                }
                else if (classList.contains('claims-breakdown')) {
                    self.fetchClaimsBreakdown(dataItem);
                }
                else if (classList.contains('other-breakdown')) {
                    self.fetchOtherBreakdown(dataItem);
                }
                else if (classList.contains('sales-breakdown')) {
                    self.fetchSalesBreakdown(dataItem);
                }
                else if (classList.contains('contacts-cell')) {
                    self.tradeAccountContacts.selectedTradeAccount(tradeAccountViewModel({
                        rec: dataItem
                    }));
                }
            }
        },
        filterMenuInit: (e) => {
            if (e.field === "CreditStop") {
                // Find and replace specific elements in the filter menu
                e.container[0].setAttribute('title', 'Filter for Credit Stop Status')
                e.container.find(".k-filter-help-text").text("Credit Stopped?");
            }
        },
        dataBound: (e) => {
            console.log('creditControlViewModel dataBound', e);

            ko.ignoreDependencies(() => {

                var pristine = e.sender.dataSource.data().toJSON();

                ko.utils.arrayForEach(e.sender.dataSource.data(), function (item, index) {

                    let rows = document.querySelectorAll('tr[data-uid="' + item.uid + '"]');

                    rows.forEach(row => {
                        ko.cleanNode(row);

                        pristine[index] = creditControlPaymentsHistoryRecordViewModel({
                            rec: item
                        });

                        ko.applyBindings(pristine[index], row);
                    });

                });
            });
        }
    };

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds



    //#endregion



    //#region Subscriptions

    self.filters.onlinePaymentHistoryFilters.subscribe(nv => {
        self.refresh();
    });

    //#endregion



    //#region Methods

    self.refresh = () => {
        if (self.gridWidget()) {
            self.gridWidget().dataSource.query({
                page: self.gridWidget().dataSource.page(),
                pageSize: self.gridWidget().dataSource.pageSize(),
                group: self.gridWidget().dataSource.group(),
                filter: self.gridWidget().dataSource.filter(),
                aggregates: self.gridWidget().dataSource.aggregates()
            })
        }
    }

    //#endregion



    //#region Events



    //#endregion


    return self;
};