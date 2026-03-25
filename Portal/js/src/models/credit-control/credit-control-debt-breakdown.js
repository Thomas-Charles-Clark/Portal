const creditControlDebtBreakdownViewModel = ({
    callee,
    filters
} = {
    callee: {},
    filters: {}
}) => {
    let self = {
        callee,
        filters,
        ready: ko.observable(false),
        busy: ko.observable(false),
        gridWidget: ko.observable(),
        heading: ko.observable(),
        pods: ko.observableArray([]),
        records: ko.observableArray([]),
        selectedPod: ko.observable(),
        previouslySelectedPod: ko.observable()
    };

    //#region Properties

    self.modalElement = document.querySelector('#debt-breakdown-modal');

    self.modal = bootstrap.Modal.getOrCreateInstance(self.modalElement);

    //#endregion



    //#region Methods

    self.podClick = (pod, event) => {
        console.log('debtBreakdown dashboardPod click', pod, event);
        if (self.selectedPod() === pod.PodHandle) {
            self.selectedPod(undefined);
        } else {
            self.selectedPod(pod.PodHandle);
        }

        self.refresh();
    }

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

    //self.fetchDebtBreakdown = () => {
    //    self.busy(true);

    //    let data = {
    //        tradeAccountId: self.callee.TradeAccountID,
    //        selectedPod: self.selectedPod()
    //    };

    //    console.log('fetchDebtBreakdown calling with', data);

    //    fetch("/api/CreditControlAPI/FetchDebtBreakdown", {
    //        method: 'POST',
    //        headers: window.fetchHeaders,
    //        cache: 'no-cache',
    //        credentials: 'same-origin',
    //        body: JSON.stringify(data)
    //    })
    //        .then(window.handleFetchResponse)
    //        .then(data => {
    //            console.log('fetchDebtBreakdown returned', data);

    //            self.heading(data.Heading);

    //            self.pods(data.Pods.map(p => creditControlDebtBreakdownPodViewModel({
    //                rec: p
    //            })));

    //            self.records(data.Records.map(p => creditControlDebtBreakdownRecordViewModel({
    //                rec: p
    //            })));

    //            self.busy(false);
    //        })
    //        .catch(err => {
    //            self.busy(false);
    //            window.catchFetchError(err);
    //        });
    //}

    self.gridDataSourceRead = (options) => {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });

        var mapped = webapi.parameterMap(options.data);

        var additionalParameters = self.callee ? {
            tradeAccountId: self.callee?.TradeAccountID
        } : self.filters.getData();

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

        console.log('debtBreakdown gridDataSourceRead calling with', data);

        self.busy(true);

        fetch('/api/creditcontrolapi/FetchDebtBreakdown?' + params, {
            method: 'GET',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin'
        })
            .then(window.handleFetchResponse)
            .then(data => {

                console.log('debtBreakdown gridDataSourceRead returned', data);

                ko.ignoreDependencies(() => {

                    if (Object.hasOwn(data, 'errorMessage')) {

                        document.querySelector('#info-modal').addEventListener('hide.bs.modal', self.refresh);

                        options.success([]);

                        window.showInfo('Sorry', data.errorMessage);

                    } else {
                        document.querySelector('#info-modal')?.removeEventListener('hide.bs.modal', self.refresh);
                        self.previouslySelectedPod = self.selectedPod()?.PodHandle;

                        self.pods(data.pods.map(dp => creditControlDashboardPodViewModel({
                            rec: dp
                        })));

                        if (self.previouslySelectedPod) {
                            self.selectedPod(self.pods().find(dp => dp.PodHandle == self.previouslySelectedPod));
                        }

                        self.heading(data.heading);

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

    //#endregion



    //#region Components

    self.gridParams = {
        autoBind: false,
        widget: self.gridWidget,
        columns: [{
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
            title: 'Original Value',
            template: (e) => e.OriginalValueInCurrency ? e.OriginalValueInCurrency : '',
            attributes: {
                'class': 'text-end'
            },
            headerAttributes: {
                'class': 'text-end'
            }
        }, {
            field: 'OutstandingAmountInCurrency',
            title: 'Outstanding Amount',
            template: (e) => e.OutstandingAmountInCurrency ? e.OutstandingAmountInCurrency : '',
            attributes: {
                'class': 'text-end'
            },
            headerAttributes: {
                'class': 'text-end'
            }
        }, {
            field: 'CreditsValue',
            title: 'Credits Value',
            template: (e) => e.CreditsValue ? e.CreditsValue : '',
            attributes: {
                'class': 'text-end'
            },
            headerAttributes: {
                'class': 'text-end'
            }
        }, {
            field: 'CreditsInfo',
            title: 'Credits Info',
            template: (e) => e.CreditsInfo ? e.CreditsInfo : '',
            attributes: {
                'class': ''
            },
            headerAttributes: {
                'class': ''
            }
        }, {
            field: 'DepositsValue',
            title: 'Deposits Value',
            template: (e) => e.DepositsValue ? e.DepositsValue : '',
            attributes: {
                'class': 'text-end'
            },
            headerAttributes: {
                'class': 'text-end'
            }
        }, {
            field: 'DepositsInfo',
            title: 'Deposits Info',
            template: (e) => e.DepositsInfo ? e.DepositsInfo : '',
            attributes: {
                'class': ''
            },
            headerAttributes: {
                'class': ''
            }
        }, {
            field: 'OverPaymentsValue',
            title: 'Over Payments Value',
            template: (e) => e.OverPaymentsValue ? e.OverPaymentsValue : '',
            attributes: {
                'class': 'text-end'
            },
            headerAttributes: {
                'class': 'text-end'
            }
        }, {
            field: 'OverPaymentsInfo',
            title: 'Over Payments Info',
            template: (e) => e.OverPaymentsInfo ? e.OverPaymentsInfo : '',
            attributes: {
                'class': ''
            },
            headerAttributes: {
                'class': ''
            }
        }, {
            field: 'RefundsValue',
            title: 'Refunds Value',
            template: (e) => e.RefundsValue ? e.RefundsValue : '',
            attributes: {
                'class': 'text-end'
            },
            headerAttributes: {
                'class': 'text-end'
            }
        }, {
            field: 'RefundsInfo',
            title: 'Refunds Info',
            template: (e) => e.RefundsInfo ? e.RefundsInfo : '',
            attributes: {
                'class': ''
            },
            headerAttributes: {
                'class': ''
            }
        }, {
            field: 'ProformaPaymentsValue',
            title: 'Proforma Value',
            template: (e) => e.ProformaPaymentsValue ? e.ProformaPaymentsValue : '',
            attributes: {
                'class': 'text-end'
            },
            headerAttributes: {
                'class': 'text-end'
            }
        }, {
            field: 'ProformaPaymentsInfo',
            title: 'Proforma Payments Info',
            template: (e) => e.ProformaPaymentsInfo ? e.ProformaPaymentsInfo : '',
            attributes: {
                'class': ''
            },
            headerAttributes: {
                'class': ''
            }
        }],
        data: new kendo.data.DataSource({
            transport: {
                read: self.gridDataSourceRead
            },
            sortable: true,
            filterable: false,
            grouping: false,
            serverGrouping: false,
            serverFiltering: false,
            serverPaging: true,
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
                        OriginalValueInCurrency: { type: 'string' },
                        OutstandingAmountInCurrency: { type: 'string' },
                        CreditsValue: { type: 'string' },
                        CreditsInfo: { type: 'string' },
                        DepositsValue: { type: 'string' },
                        DepositsInfo: { type: 'string' },
                        OverPaymentsValue: { type: 'string' },
                        OverPaymentsInfo: { type: 'string' },
                        RefundsValue: { type: 'string' },
                        RefundsInfo: { type: 'string' },
                        ProformaPaymentsValue: { type: 'string' },
                        ProformaPaymentsInfo: { type: 'string' }
                    }
                },
                parse: (response) => {
                    if (response.length) {
                        response = response.map(r => creditControlDebtBreakdownRecordViewModel({
                            rec: r
                        }));
                    }
                    return response;
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

    self.groupedPods = ko.computed(() => {

        let pods = self.pods();

        let groups = Object.groupBy(pods, (pod) => pod.Group);

        let groupedPods = Object.keys(groups).map(k => {
            return {
                groupName: k,
                pods: groups[k]
            };
        });

        return groupedPods;

    }, self);

    //#endregion



    //#region Subscriptions



    //#endregion



    //#region Events

    

    //#endregion


    return self;
};