const creditControlSalesBreakdownViewModel = ({
    callee,
    rec
} = {
    callee: {},
    rec: {}
}) => {
    let self = {
        currencyCode: rec.Heading.CurrencyCode,
        formattingCulture: rec.Heading.FormattingCulture
    };

    //#region Properties

    self.callee = callee;

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.heading = ko.observable(rec.Heading);

    self.pods = ko.observableArray(rec.Pods.map(p => creditControlSalesBreakdownPodViewModel({
        rec: p
    })));

    self.records = ko.observableArray(rec.Records.map(p => creditControlSalesBreakdownRecordViewModel({
        rec: p
    })));

    self.selectedPod = ko.observable();

    //#endregion



    //#region Methods

    self.podClick = (pod, event) => {
        console.log('salesBreakdown dashboardPod click', pod, event);
        if (self.selectedPod() === pod.PodHandle) {
            self.selectedPod(undefined);
        } else {
            self.selectedPod(pod.PodHandle);
        }

        self.fetchSales();
    }

    self.fetchSales = () => {
        self.busy(true);

        let data = {
            tradeAccountId: self.callee.TradeAccountID,
            selectedPod: self.selectedPod()
        };

        console.log('fetchSalesBreakdown calling with', data);

        fetch("/api/CreditControlAPI/FetchSalesBreakdown", {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log('fetchSalesBreakdown returned', data);

                self.heading(data.Heading);

                self.pods(data.Pods.map(p => creditControlSalesBreakdownPodViewModel({
                    rec: p
                })));

                self.records(data.Records.map(p => creditControlSalesBreakdownRecordViewModel({
                    rec: p
                })));

                self.busy(false);
            })
    }

    //#endregion



    //#region Components

    self.gridParams = {
        autoBind: true,
        widget: ko.observable(),
        columns: [{
            field: 'OrderID',
            title: 'Order ID'
        }, {
            field: 'OrderDate',
            title: 'Order Date',
            template: (e) => e.OrderDate ? moment(e.OrderDate).format('DD/MM/YYYY') : ''
        }, {
            field: 'InvoiceID',
            title: 'Invoice ID'
        }, {
            field: 'InvoiceDate',
            title: 'Invoice Date',
            template: (e) => e.InvoiceDate ? moment(e.InvoiceDate).format('DD/MM/YYYY') : ''
        }, {
            field: 'ProductCode',
            title: 'ProductCode'
        }, {
            field: 'QuantityOrdered',
            title: 'Quantity Ordered',
            attributes: {
                'class': 'text-end'
            },
            headerAttributes: {
                'class': 'text-end'
            }
        }, {
            field: 'SalesValueCurrency',
            title: 'Sales Value Currency',
            template: (e) => e.SalesValueCurrency != null ? formatCurrency(e.SalesValueCurrency, 2, self.formattingCulture, self.currencyCode) : '',
            attributes: {
                'class': 'text-end'
            },
            headerAttributes: {
                'class': 'text-end'
            }
        }, {
            field: 'SalesValueSterling',
            title: 'Sales Value Sterling',
            template: (e) => e.SalesValueSterling != null ? formatCurrency(e.SalesValueSterling, 2, self.formattingCulture, self.currencyCode) : '',
            attributes: {
                'class': 'text-end'
            },
            headerAttributes: {
                'class': 'text-end'
            }
        }],
        data: self.records,
        dataSource: new kendo.data.DataSource({
            sortable: true,
            filterable: false,
            grouping: false,
            serverGrouping: false,
            serverFiltering: false,
            serverPaging: false,
            pageSize: 10,
            pageable: {
                pageSize: 10,
                pageSizes: [10, 20, 50, 100, 250, 500, 'all']
            },
            schema: $.extend({}, kendo.data.schemas.webapi, {
                data: "Data",
                total: "Total",
                errors: "Errors",
                aggregates: "Aggregates",
                model: {
                    id: 'OrderID',
                    fields: {
                        OrderID: { type: 'string' },
                        OrderDate: { type: 'date' },
                        InvoiceID: { type: 'string' },
                        InvoiceDate: { type: 'date' },
                        ProductCode: { type: 'string' },
                        QuantityOrdered: { type: 'number' },
                        SalesValueCurrency: { type: 'number' },
                        SalesValueSterling: { type: 'number' }
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
        scrollable: false,
        sortable: true,
        filterable: false,
        reorderable: false,
        paging: true,
        pageSize: 10,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        selectable: false,
    };

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds



    //#endregion



    //#region Subscriptions



    //#endregion



    //#region Events

    

    //#endregion


    return self;
};