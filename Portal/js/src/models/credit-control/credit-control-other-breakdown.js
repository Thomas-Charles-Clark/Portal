const creditControlOtherBreakdownViewModel = ({
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

    self.pods = ko.observableArray(rec.Pods.map(p => creditControlOtherBreakdownPodViewModel({
        rec: p
    })));

    self.records = ko.observableArray(rec.Records.map(p => creditControlOtherBreakdownRecordViewModel({
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

        console.log('fetchOtherBreakdown calling with', data);

        fetch("/api/CreditControlAPI/FetchOtherBreakdown", {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log('fetchOtherBreakdown returned', data);

                self.heading(data.Heading);

                self.pods(data.Pods.map(p => creditControlOtherBreakdownPodViewModel({
                    rec: p
                })));

                self.records(data.Records.map(p => creditControlOtherBreakdownRecordViewModel({
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
            field: 'SalesLedgerKey',
            title: 'Sales Ledger Key'
        }, {
            field: 'UniVerseAccount',
            title: 'Designers Guild Company'
        }, {
            field: 'HoldingTradeAccountCode',
            title: 'Trade Account Code'
        }, {
            field: 'TransactionType',
            title: 'Transaction Type'
        }, {
            field: 'OriginalValueInCurrency',
            title: 'Original Value (in Currency)',
            attributes: {
                "class": "text-end"
            },
            headerAttributes: {
                "class": "text-end"
            },
            template: (e) => e.OriginalValueInCurrency != null ? formatCurrency(e.OriginalValueInCurrency, 2, 'en-GB', 'GBP') : ''
        }, {
            field: 'OutstandingAmountInCurrency',
            title: 'Outstanding Amount (in Currency)',
            attributes: {
                "class": "text-end"
            },
            headerAttributes: {
                "class": "text-end"
            },
            template: (e) => e.OriginalValueInCurrency != null ? formatCurrency(e.OriginalValueInCurrency, 2, 'en-GB', 'GBP') : ''
        }, {
            field: 'ItemReference',
            title: 'Item Reference'
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
                    id: 'SalesLedgerKey',
                    fields: {
                        UniVerseAccount: { type: 'string' },
                        HoldingTradeAccountCode: { type: 'string' },
                        TransactionType: { type: 'string' },
                        SalesLedgerKey: { type: 'string' },
                        OriginalValueInCurrency: { type: 'number' },
                        OutstandingAmountInCurrency: { type: 'number' },
                        ItemReference: { type: 'string' }
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