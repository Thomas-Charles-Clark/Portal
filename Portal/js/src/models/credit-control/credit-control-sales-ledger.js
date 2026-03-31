const creditControlSalesLedgerViewModel = ({
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
        busyMessage: ko.observable('Please Wait...'),
        gridWidget: ko.observable(),
        heading: ko.observable(),
        pods: ko.observableArray([]),
        records: ko.observableArray([]),
        selectedPod: ko.observable(),
        previouslySelectedPod: null
    };

    //#region Properties

    self.modalElement = document.querySelector('#sales-ledger-modal');

    self.modal = bootstrap.Modal.getOrCreateInstance(self.modalElement);

    //#endregion



    //#region Methods

    self.exportToExcel = () => {
        self.gridWidget() && self.gridWidget().saveAsExcel();
    }

    self.podClick = (pod, event) => {
        console.log(`salesLedger dashboardPod click`, pod, event);
        if (self.selectedPod() && self.selectedPod().PodHandle === pod.PodHandle) {
            self.selectedPod(undefined);
        } else {
            self.selectedPod(pod);
        }


        self.refresh();
    }

    self.refresh = () => {
        if (self.gridWidget()) {
            console.log(`salesLedger filters refresh called`);
            self.gridWidget().dataSource.query({
                page: self.gridWidget().dataSource.page(),
                pageSize: self.gridWidget().dataSource.pageSize(),
                group: self.gridWidget().dataSource.group(),
                filter: self.gridWidget().dataSource.filter(),
                aggregates: self.gridWidget().dataSource.aggregates()
            })
        }
    }

    self.clearSelectedPod = (withRefresh) => {
        self.selectedPod(undefined);
        if (typeof withRefresh === 'undefined' || withRefresh === true) {
            self.refresh();
        }
    }

    if (self.filters) { // this viewModel is used in two distinct contexts: from the Dashboard cell drill-down,
                        // where there is no call for a filter set,
                        // and in the Sales Ledger tab itself, which does have a set of filters. 
        self.filters.clearSelectedPod = self.clearSelectedPod;
    }

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

        console.log('salesLedger gridDataSourceRead calling with', data);

        self.busy(true);

        fetch('/api/creditcontrolapi/SalesLedger_Select?' + params, {
            method: 'GET',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin'
        })
            .then(window.handleFetchResponse)
            .then(data => {

                console.log(`salesLedger gridDataSourceRead returned`, data);

                ko.ignoreDependencies(() => {

                    if (Object.hasOwn(data, 'errorMessage')) {

                        document.querySelector('#info-modal').addEventListener('hide.bs.modal', self.refresh);

                        options.success([]);

                        window.showInfo('Sorry', data.errorMessage);

                        console.error(data.exception);

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
        autoBind: self.filters ? false : true,
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
            template: (dataItem) => {
                if (dataItem.CreditsInfo)
                    return `<a href="javascript:;" data-bind="actualBootstrapPopover: { details: creditsPopoverInfo }, click: () => { return true; }, clickBubble: false">${dataItem.CreditsValue}</a>`
                else
                    return `<span>${dataItem.CreditsValue}</span>`;
            },
            attributes: {
                'class': 'text-end'
            },
            headerAttributes: {
                'class': 'text-end'
            }
        }, {
            field: 'DepositsValue',
            title: 'Deposits Value',
            template: (dataItem) => {
                if (dataItem.DepositsInfo)
                    return `<a href="javascript:;" data-bind="actualBootstrapPopover: { details: depositsPopoverInfo }, click: () => { return true; }, clickBubble: false">${dataItem.DepositsValue}</a>`
                else
                    return `<span>${dataItem.DepositsValue}</span>`;
            },
            attributes: {
                'class': 'text-end'
            },
            headerAttributes: {
                'class': 'text-end'
            }
        }, {
            field: 'OverpaymentsValue',
            title: 'Overpayments Value',
            template: (dataItem) => {
                if (dataItem.OverpaymentsInfo)
                    return `<a href="javascript:;" data-bind="actualBootstrapPopover: { details: overpaymentsPopoverInfo }, click: () => { return true; }, clickBubble: false">${dataItem.OverpaymentsValue}</a>`
                else
                    return `<span>${dataItem.OverpaymentsValue}</span>`;
            },
            attributes: {
                'class': 'text-end'
            },
            headerAttributes: {
                'class': 'text-end'
            }
        }, {
            field: 'RefundsValue',
            title: 'Refunds Value',
            template: (dataItem) => {
                if (dataItem.RefundsInfo)
                    return `<a href="javascript:;" data-bind="actualBootstrapPopover: { details: refundsPopoverInfo }, click: () => { return true; }, clickBubble: false">${dataItem.RefundsValue}</a>`
                else
                    return `<span>${dataItem.RefundsValue}</span>`;
            },
            attributes: {
                'class': 'text-end'
            },
            headerAttributes: {
                'class': 'text-end'
            }
        }, {
            field: 'ProformaPaymentsValue',
            title: 'Proforma Value',
            template: (dataItem) => {
                if (dataItem.ProformaPaymentsInfo)
                    return `<a href="javascript:;" data-bind="actualBootstrapPopover: { details: proformaPaymentsPopoverInfo }, click: () => { return true; }, clickBubble: false">${dataItem.ProformaPaymentsValue}</a>`
                else
                    return `<span>${dataItem.ProformaPaymentsValue}</span>`;
            },
            attributes: {
                'class': 'text-end'
            },
            headerAttributes: {
                'class': 'text-end'
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
                        OverpaymentsValue: { type: 'string' },
                        OverpaymentsInfo: { type: 'string' },
                        RefundsValue: { type: 'string' },
                        RefundsInfo: { type: 'string' },
                        ProformaPaymentsValue: { type: 'string' },
                        ProformaPaymentsInfo: { type: 'string' }
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
        pageSize: 20,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        selectable: false,
        dataBound: (e) => {
            e.sender.resize();

            document.querySelectorAll('[data-bind*="actualBootstrapPopover"]').forEach(e => {
                let p = bootstrap.Popover.getInstance(e);
                if (p) {
                    p.hide();
                }
            });

            ko.ignoreDependencies(() => {

                var pristine = e.sender.dataSource.data().toJSON();

                ko.utils.arrayForEach(e.sender.dataSource.data(), function (item, index) {

                    let rows = document.querySelectorAll('tr[data-uid="' + item.uid + '"]');

                    rows.forEach(row => {
                        ko.cleanNode(row);

                        pristine[index] = creditControlSalesLedgerRecordViewModel({
                            rec: item
                        })

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

    if (self.filters) {

        self.filters.displayModes.subscribe(nv => {
            self.gridParams.widget().refresh();
        }, self, 'arrayChange');

        self.filters.getData.subscribe(nv => {
            console.log(`salesLedger filters getData subscribe hit`);
            self.gridParams.widget().dataSource.query({
                page: 1,
                pageSize: (self.gridParams.widget() && self.gridParams.widget().dataSource.pageSize())
            });
        });

    }

    //#endregion



    //#region Events

    

    //#endregion


    return self;
};