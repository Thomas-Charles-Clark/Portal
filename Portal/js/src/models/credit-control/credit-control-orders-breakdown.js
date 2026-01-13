const creditControlOrdersBreakdownViewModel = ({
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

    self.pods = ko.observableArray(rec.Pods.map(p => creditControlOrdersBreakdownPodViewModel({
        rec: p
    })));

    self.records = ko.observableArray(rec.Records.map(p => creditControlOrdersBreakdownRecordViewModel({
        rec: p
    })));

    self.selectedPod = ko.observable();

    //#endregion



    //#region Methods

    self.podClick = (pod, event) => {
        console.log('ordersBreakdown dashboardPod click', pod, event);
        if (self.selectedPod() === pod.PodHandle) {
            self.selectedPod(undefined);
        } else {
            self.selectedPod(pod.PodHandle);
        }

        self.fetchOrdersBreakdown();
    }

    self.fetchOrdersBreakdown = () => {
        self.busy(true);

        let data = {
            tradeAccountId: self.callee.TradeAccountID,
            selectedPod: self.selectedPod()
        };

        console.log('fetchOrdersBreakdown calling with', data);

        fetch("/api/CreditControlAPI/FetchOrdersBreakdown", {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log('fetchOrdersBreakdown returned', data);

                self.heading(data.Heading);

                self.pods(data.Pods.map(p => creditControlOrdersBreakdownPodViewModel({
                    rec: p
                })));

                self.records(data.Records.map(p => creditControlOrdersBreakdownRecordViewModel({
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
            field: 'OrderLineID',
            title: 'Order Line ID'
        }, {
            field: 'OrderID',
            title: 'Order ID'
        }, {
            field: 'OrderDate',
            title: 'Order Date',
            template: (e) => e.InvoiceDT ? moment(e.InvoiceDT).format('DD/MM/YYYY') : ''
        }, {
            field: 'DataSource',
            title: 'Data Source'
        }, {
            field: 'ProductID',
            title: 'Product ID'
        }, {
            field: 'ProductCode',
            title: 'Product Code'
        }, {
            field: 'ProductName',
            title: 'Product Name'
        }, {
            field: 'QuantityOrdered',
            title: 'Quantity Ordered',
            template: (e) => e.QuantityOrdered != null ? formatNumber(e.QuantityOrdered, 2, self.formattingCulture) : '',
            attributes: {
                'class': 'text-end'
            },
            headerAttributes: {
                'class': 'text-end'
            }
        }, {
            field: 'LineValueSterling',
            title: 'Line Value (in Sterling)',
            template: (e) => e.LineValueSterling != null ? formatCurrency(e.LineValueSterling, 2, 'en-GB', 'GBP') : '',
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
                    id: 'OrderLineID',
                    fields: {
                        OrderLineID: { type: 'string' },
                        OrderID: { type: 'string' },
                        OrderDate: { type: 'date' },
                        DataSource: { type: 'string' },
                        ProductID: { type: 'number' },
                        ProductCode: { type: 'string' },
                        ProductName: { type: 'string' },
                        QuantityOrdered: { type: 'number' },
                        LineValueSterling: { type: 'number' }
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