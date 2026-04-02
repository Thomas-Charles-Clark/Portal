const creditControlStatementsViewModel = ({
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
        previouslySelectedPod: null,
        allSelected: ko.observable(false),
        allTradeAccountIds: ko.observableArray([]),
        allTradeAccountCodes: ko.observableArray([]),
        selectedTradeAccountCodes: ko.observableArray([]),
        statementDate: ko.observable(new Date()),
        statementSendModalElement: document.querySelector('#statement-send-modal')
    };

    //#region Properties

    self.statementSendModal = bootstrap.Modal.getOrCreateInstance(self.statementSendModalElement);

    self.statementDateParams = {
        label: "Date",
        observable: self.statementDate,
        originalValue: self.statementDate(),
        displayObservable: ko.observable(),
        dateTimePickerOptions: {
            localization: {
                locale: 'en-GB',
                format: 'dd/MM/yyyy'
            },
            display: {
                sideBySide: false,
                components: {
                    clock: false,
                    calendar: true,
                    date: true,
                    month: true,
                    year: true,
                    decades: false,
                    clock: false,
                    hours: false,
                    minutes: false,
                    seconds: false
                },
                viewMode: 'calendar',
                cellSize: '3rem'
            },
            restrictions: {
                disabledDates: []
            },
            allowInputToggle: true,
            useCurrent: false,
            keepInvalid: true,
            debug: false
        },
        clearable: ko.observable(false),
        clearFunction: () => {
            self.statementDate(undefined);
            self.statementDateParams.observable.tempusDominus.clear();
            self.statementDateParams.observable.tempusDominus.updateOptions({
                display: {
                    viewMode: 'calendar'
                }
            })
        },
        revertible: ko.observable(true),
        revertFunction: () => {
            self.statementDateParams.observable(self.statementDateParams.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true,
    };

    //#endregion



    //#region Methods

    self.showSendStatementsModal = () => {
        if (self.selectedTradeAccountCodes().length == 0) {
            window.showInfo("No Trade Accounts Selected", "Please select Trade Accounts using the checkbox column on the right.");
        } else {
            self.statementSendModal.show();
        }
    }

    self.sendStatements = () => {
        self.busy(true);

        let parameters = {
            tradeAccountCodes: self.selectedTradeAccountCodes(),
            date: self.statementDate()
        }

        fetch('/api/creditcontrolapi/SendStatements', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(parameters)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                if (data.Success) {
                    self.busy(false);
                    window.showInfo("Information", data.Message);
                    self.statementSendModal.hide();
                } else {
                    window.showError(data.Message);
                    self.busy(false);
                }
            })
    }

    self.exportToExcel = () => {
        self.gridWidget() && self.gridWidget().saveAsExcel();
    }

    self.podClick = (pod, event) => {
        console.log(`statements dashboardPod click`, pod, event);
        if (self.selectedPod() && self.selectedPod().PodHandle === pod.PodHandle) {
            self.selectedPod(undefined);
        } else {
            self.selectedPod(pod);
        }

        self.refresh();
    }

    self.refresh = () => {
        if (self.gridWidget()) {
            console.log(`statements filters refresh called`);
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

        console.log('statements gridDataSourceRead calling with', data);

        self.busy(true);

        fetch('/api/creditcontrolapi/StatementsSelect?' + params, {
            method: 'GET',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin'
        })
            .then(window.handleFetchResponse)
            .then(data => {

                console.log(`statements gridDataSourceRead returned`, data);

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

                        self.allTradeAccountCodes(data.totalsRecord.TradeAccountCodes);

                        self.allTradeAccountIds(data.totalsRecord.TradeAccountIDs);

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

    self.selectAllParams = {
        checkboxId: `select-all-checkbox`,
        observable: self.allSelected,
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: self.busy
    }

    self.gridParams = {
        autoBind: self.filters ? false : true,
        widget: self.gridWidget,
        columns: [{
            field: 'TradeAccountCode',
            title: 'Trade Account',
            template: (dataItem) => {
                return `${dataItem.TradeAccountCode} - ${dataItem.TradeAccountName}`
            }
        }, {
            field: 'Advisory',
            title: 'Advisory',
            template: (dataItem) => {
                return dataItem?.Advisory ?? ``;
            }
        }, {
            field: 'Overdue',
            title: 'Overdue',
            template: (dataItem) => {
                return dataItem.Overdue;
            }
        }, {
            field: 'StatementContacts',
            title: 'Contacts',
            template: (dataItem) => {
                return dataItem.StatementContacts ?? ``;
            }
        }, {
            field: 'SendHistory',
            title: 'Send History',
            template: (dataItem) => {
                return dataItem?.Advisory ?? ``;
            }
        }, {
            field: 'Unbound',
            title: ' ',
            width: 52,
            sortable: false,
            filterable: false,
            template: (dataItem) => {
                return `<div data-bind="component: { name: 'mdc-checkbox-component', params: selectedCheckboxParams }"></div>`
            },
            headerTemplate: (e) => {
                return `<div id="select-all-checkbox" data-bind="component: { name: 'mdc-checkbox-component', params: selectAllParams }"></div>`
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
                    id: 'TradeAccountCode',
                    fields: {
                        TradeAccountCode: { type: 'string' },
                        TradeAccountName: { type: 'string' },
                        Advisory: { type: 'string' },
                        Overdue: { type: 'string' },
                        StatementContacts: { type: 'string' },
                        SendHistory: { type: 'string' }
                    }
                },
                parse: (response) => {
                    console.log('statements dataSource.parse', response);

                    let data = [];

                    response.Data.forEach(d => {
                        data.push(creditControlStatementsRecordViewModel({
                            rec: d,
                            preselected: self.selectedTradeAccountCodes().find(ta => ta == d.TradeAccountCode) != null,
                            observableArray: self.selectedTradeAccountCodes
                        }))
                    });

                    response.Data = data;

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
        pageSize: 20,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        persistSelection: true,
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

                    // this is necessary because if you have locked columns you will have multiple <tr> sharing the one uid
                    let rows = document.querySelectorAll('tr[data-uid="' + item.uid + '"]');

                    rows.forEach(row => {
                        ko.cleanNode(row);
                        ko.applyBindings(item, row);
                    });
                });
            });

            var selectAllElement = document.querySelector('#select-all-checkbox');

            ko.cleanNode(selectAllElement);

            ko.applyBindings(self, selectAllElement);
        }
    };

    self.errors = new ko.validation.group([

    ]);

    self.toggleSelectAll = () => {
        self.allSelected(!self.allSelected());
    }

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

    self.modalMessage = ko.computed(() => {
        let result = '';

        if (self.selectedTradeAccountCodes().length == 1) {
            result = `Send Statement (${moment(self.statementDate()).format('DD/MM/YYYY')}) to 1 Trade Account: ${self.selectedTradeAccountCodes()[0]}`
        } else {
            result = `Send Statements (${moment(self.statementDate()).format('DD/MM/YYYY')}) to: ${window.formatNumber(self.selectedTradeAccountCodes().length, 0, 'en-GB')} Trade Accounts`
        }

        return result;
    }, self)

    //#endregion



    //#region Subscriptions

    if (self.filters) {
        self.filters.displayModes.subscribe(nv => {
            self.gridParams.widget().refresh();
        }, self, 'arrayChange');

        self.filters.getData.subscribe(nv => {
            console.log(`statements filters getData subscribe hit`);
            self.gridParams.widget().dataSource.query({
                page: 1,
                pageSize: (self.gridParams.widget() && self.gridParams.widget().dataSource.pageSize())
            });
        });
    }

    self.allSelected.subscribe(nv => {
        if (nv) {
            self.selectedTradeAccountCodes(self.allTradeAccountCodes());
        } else {
            self.selectedTradeAccountCodes([]);
        }

        ko.utils.arrayForEach(self.gridWidget().dataSource.data(), function (item, index) {
            item.selected(nv);
        });
    });

    //#endregion



    //#region Events

    

    //#endregion


    return self;
};