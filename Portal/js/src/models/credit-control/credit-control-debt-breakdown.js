const creditControlDebtBreakdownViewModel = ({
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

    self.pods = ko.observableArray(rec.Pods.map(p => creditControlDebtBreakdownPodViewModel({
        rec: p
    })));

    self.records = ko.observableArray(rec.Records.map(p => creditControlDebtBreakdownRecordViewModel({
        rec: p
    })));

    self.selectedPod = ko.observable();

    //#endregion



    //#region Methods

    self.podClick = (pod, event) => {
        console.log('debtBreakdown dashboardPod click', pod, event);
        if (self.selectedPod() === pod.PodHandle) {
            self.selectedPod(undefined);
        } else {
            self.selectedPod(pod.PodHandle);
        }

        self.fetchDebtBreakdown();
    }

    self.fetchDebtBreakdown = () => {
        self.busy(true);

        let data = {
            tradeAccountId: self.callee.TradeAccountID,
            selectedPod: self.selectedPod()
        };

        console.log('fetchDebtBreakdown calling with', data);

        fetch("/api/CreditControlAPI/FetchDebtBreakdown", {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log('fetchDebtBreakdown returned', data);

                self.heading(data.Heading);

                self.pods(data.Pods.map(p => creditControlDebtBreakdownPodViewModel({
                    rec: p
                })));

                self.records(data.Records.map(p => creditControlDebtBreakdownRecordViewModel({
                    rec: p
                })));

                self.busy(false);
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            });
    }

    //#endregion



    //#region Components

    self.gridParams = {
        autoBind: true,
        widget: ko.observable(),
        columns: [{
            field: 'InvoiceID',
            title: 'Invoice ID',
            hidden: true
        }, {
            field: 'DebtAgeBracketName',
            title: 'Name'
        }, {
            field: 'InvoiceURI',
            title: 'Invoice',
            template: (e) => `<a target="_self" href="/documents/view/statement?filePath=${encodeURIComponent(e.InvoiceURI)}">${e.InvoiceID}</a>`
        }, {
            field: 'InvoiceDT',
            title: 'Invoice Date',
            template: (e) => moment(e.InvoiceDT).format('DD/MM/YYYY')
        }, {
            field: 'DueDT',
            title: 'Due Date',
            template: (e) => moment(e.DueDT).format('DD/MM/YYYY')
        }, {
            field: 'OriginalValueInCurrency',
            title: 'Original Value (in Currency)',
            template: (e) => e.OriginalValueInCurrency != null ? formatCurrency(e.OriginalValueInCurrency, 2, self.formattingCulture, self.currencyCode) : '',
            attributes: {
                'class': 'text-end'
            },
            headerAttributes: {
                'class': 'text-end'
            }
        }, {
            field: 'OutstandingAmountInCurrency',
            title: 'Outstanding Amount (in Currency)',
            template: (e) => e.OutstandingAmountInCurrency != null ? formatCurrency(e.OutstandingAmountInCurrency, 2, self.formattingCulture, self.currencyCode) : '',
            attributes: {
                'class': 'text-end'
            },
            headerAttributes: {
                'class': 'text-end'
            }
        }, {
            field: 'Disputed',
            title: 'Disputed',
            width: 140,
            template: (e) => e.Disputed ? `<i class="bi bi-check-fill"></i>` : ``
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
                    id: 'InvoiceID',
                    fields: {
                        UniVerseAccount: { type: 'string' },
                        DebtAgeBracketName: { type: 'string' },
                        InvoiceID: { type: 'string' },
                        InvoiceURI: { type: 'string' },
                        InvoiceDate: { type: 'date' },
                        DueDate: { type: 'date' },
                        OriginalValueInCurrency: { type: 'number' },
                        OutstandingAmountInCurrency: { type: 'number' },
                        Disputed: { type: 'boolean' }
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