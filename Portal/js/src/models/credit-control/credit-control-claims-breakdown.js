const creditControlClaimsBreakdownViewModel = ({
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

    self.pods = ko.observableArray(rec.Pods.map(p => creditControlClaimsBreakdownPodViewModel({
        rec: p
    })));

    self.records = ko.observableArray(rec.Records.map(p => creditControlClaimsBreakdownRecordViewModel({
        rec: p
    })));

    self.selectedPod = ko.observable();

    //#endregion



    //#region Methods

    self.podClick = (pod, event) => {
        console.log('claimsBreakdown dashboardPod click', pod, event);
        if (self.selectedPod() === pod.PodHandle) {
            self.selectedPod(undefined);
        } else {
            self.selectedPod(pod.PodHandle);
        }

        self.fetchClaims();
    }

    self.fetchClaims = () => {
        self.busy(true);

        let data = {
            tradeAccountId: self.callee.TradeAccountID,
            selectedPod: self.selectedPod()
        };

        console.log('fetchClaimsBreakdown calling with', data);

        fetch("/api/CreditControlAPI/FetchClaimsBreakdown", {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log('fetchClaimsBreakdown returned', data);

                self.heading(data.Heading);

                self.pods(data.Pods.map(p => creditControlClaimsBreakdownPodViewModel({
                    rec: p
                })));

                self.records(data.Records.map(p => creditControlClaimsBreakdownRecordViewModel({
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
            field: 'ClaimID',
            title: 'Claim ID'
        }, {
            field: 'ClaimDT',
            title: 'Claim Date',
            template: (e) => e.ClaimDT ? moment(e.ClaimDT).format('DD/MM/YYYY') : ''
        }, {
            field: 'OrderID',
            title: 'Order ID'
        }, {
            field: 'OrderDT',
            title: 'Order Date',
            template: (e) => e.OrderDT ? moment(e.OrderDT).format('DD/MM/YYYY') : ''
        }, {
            field: 'InvoiceNumber',
            title: 'Invoice Number'
        }, {
            field: 'ClaimTaker',
            title: 'Claim Taker'
        }, {
            field: 'ClaimLineID',
            title: 'Claim Line ID'
        }, {
            field: 'OrderLineID',
            title: 'Order Line ID',
            //attributes: {
            //    'class': 'text-end'
            //},
            //headerAttributes: {
            //    'class': 'text-end'
            //}
        }, {
            field: 'ProductCode',
            title: 'Product Code'
        }, {
            field: 'OrderQuantity',
            title: 'Order Quantity',
            attributes: {
                'class': 'text-end'
            },
            headerAttributes: {
                'class': 'text-end'
            },
            template: (e) => e.OrderQuantity != null ? formatNumber(e.OrderQuantity, 2, 'en-GB') : ''
        }, {
            field: 'ClaimQuantity',
            title: 'Claim Quantity',
            attributes: {
                'class': 'text-end'
            },
            headerAttributes: {
                'class': 'text-end'
            },
            template: (e) => e.ClaimQuantity != null ? formatNumber(e.ClaimQuantity, 2, 'en-GB') : ''
        }, {
            field: 'AcceptedQuantity',
            title: 'Accepted Quantity',
            attributes: {
                'class': 'text-end'
            },
            headerAttributes: {
                'class': 'text-end'
            },
            template: (e) => e.AcceptedQuantity != null ? formatNumber(e.AcceptedQuantity, 2, 'en-GB') : ''
        }, {
            field: 'ReturnedQuantity',
            title: 'Returned Quantity',
            attributes: {
                'class': 'text-end'
            },
            headerAttributes: {
                'class': 'text-end'
            },
            template: (e) => e.ReturnedQuantity != null ? formatNumber(e.ReturnedQuantity, 2, 'en-GB') : ''
        }, {
            field: 'FaultCode',
            title: 'Fault Code'
        }, {
            field: 'Result',
            title: 'Result'
        }, {
            field: 'Notes',
            title: 'Notes'
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
                    id: 'ClaimID',
                    fields: {
                        ClaimID: { type: 'string' },
                        ClaimDT: { type: 'date' },
                        OrderID: { type: 'string' },
                        OrderDT: { type: 'date' },
                        InvoiceNumber: { type: 'string' },
                        ClaimTaker: { type: 'string' },
                        OrderLineID: { type: 'string' },
                        ProductCode: { type: 'string' },
                        OrderQuantity: { type: 'decimal' },
                        ClaimQuantity: { type: 'decimal' },
                        FaultCode: { type: 'string' },
                        Result: { type: 'string' },
                        Notes: { type: 'string' }
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