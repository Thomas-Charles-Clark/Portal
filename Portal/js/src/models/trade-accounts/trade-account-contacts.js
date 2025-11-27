const tradeAccountContactsViewModel = ({ } = {}) => {
    let self = {};

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable('Please Wait')

    self.selectedTradeAccount = ko.observable();

    self.selectedTradeAccountContacts = ko.observableArray([]);

    self.filters = tradeAccountContactsFiltersViewModel(typeof getContactFilterParams === 'function' ? getContactFilterParams() : undefined);

    self.dashboardPods = ko.observableArray([]);

    self.tradeAccounts = ko.observableArray([]);

    self.tradeAccountContactsModalElement = document.querySelector('#trade-account-contacts-modal');

    self.tradeAccountContactsModal = bootstrap.Modal.getOrCreateInstance(self.tradeAccountContactsModalElement);

    self.unsavedChanges = ko.observableArray([]);

    //#endregion


    //#region Components

    self.errors = new ko.validation.group([

    ]);

    self.gridParams = {
        autoBind: true,
        widget: ko.observable(),
        columns: [{
            field: 'TradeAccountID',
            title: 'TradeAccountID',
            filterable: {
                extra: false
            },
            hidden: true
        }, {
            field: 'Code',
            title: 'Code',
            filterable: {
                extra: false
            }
        }, {
            field: 'Name',
            title: 'Name',
            filterable: {
                extra: false
            }
        }, {
            field: 'Email',
            title: 'Email',
            filterable: {
                extra: false
            }
        }, {
            field: 'Status',
            title: 'Status',
            width: 140,
            filterable: {
                extra: false
            }
        }, {
            field: 'CreditStop',
            title: 'Credit Stopped',
            width: 140,
            filterable: {
                extra: false,
                messages: {
                    isTrue: '✔',
                    isFalse: '✖'
                }
            }
        }, {
            field: 'Advisory',
            title: 'Advisory',
            width: 140,
            filterable: {
                extra: false
            }
        }],
        data: self.tradeAccounts,
        dataSource: new kendo.data.DataSource({
            sortable: true,
            filterable: true,
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
                    id: 'TradeAccountID',
                    fields: {
                        TradeAccountID: { type: 'number' },
                        Code: { type: 'string' },
                        Name: { type: 'string' },
                        Status: { type: 'string' },
                        CreditStop: { type: 'boolean' },
                        Email: { type: 'string' },
                        Address: { type: 'string' },
                        Advisory: { type: 'string' }
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
        useKOTemplates: true,
        rowTemplate: 'trade-account-contact-row-template',
        scrollable: false,
        sortable: true,
        filterable: true,
        reorderable: false,
        paging: true,
        pageSize: 10,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        selectable: 'single',
        change: function (e) {
            let dataItem = e.sender.dataItem(e.sender.select());

            console.log('change', dataItem);

            self.selectedTradeAccount(dataItem);
        },
        filterMenuInit: (e) => {
            if (e.field === "CreditStop") {
                // Find and replace specific elements in the filter menu
                e.container[0].setAttribute('title', 'Filter for Credit Stop Status')
                e.container.find(".k-filter-help-text").text("Credit Stopped?");
            }
        }
    };

    //#endregion



    //#region Methods

    self.tradeAccountSearch = (data) => {
        self.busy(true);
        
        console.log('tradeAccountSearch calling with', data);

        fetch('/api/TradeAccountContactsAPI/TradeAccountSearch', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log('tradeAccountSearch calling with', data);
                self.busy(false);
                self.dashboardPods(data.DashboardPods.map(p => tradeAccountContactsDashboardPodViewModel({
                    rec: p
                })));
                self.tradeAccounts(data.Results.map(d => tradeAccountViewModel({
                    rec: d,
                })));
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            });
    }

    self.fetchContacts = (tradeAccountId) => {
        self.tradeAccountContactsModal.show();
        self.busy(true);
        let data = {
            tradeAccountId
        };
        console.log('fetchContacts calling with', data);
        fetch('/api/tradeaccountcontactsapi/FetchContacts', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log('fetchContacts returned', data);
                self.busy(false);
                self.selectedTradeAccountContacts(data.Records.map(d => tradeAccountContactViewModel({
                    rec: d,
                })));
                self.unsavedChanges([]);
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            });
    }

    self.saveTradeAccountContacts = () => {
        self.busy(true);

        let data = {
            tradeAccountId: self.selectedTradeAccount().TradeAccountID,
            contacts: self.selectedTradeAccountContacts().map(c => c.toJS())
        };

        fetch('/api/tradeaccountcontactsapi/SaveChanges', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                self.busy(false);
                self.tradeAccountContactsModal.hide();
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
    }

    self.cancelTradeAccountContactsModal = () => {
        if (self.unsavedChanges().length) {
            window.showConfirm('Are you sure?', 'You have unsaved changes. If you click yes, those changes will be lost.', () => {
                self.tradeAccountContactsModal.hide();
            }, null);
        } else {
            self.tradeAccountContactsModal.hide();
        }
    }

    self.addNewTradeAccountContact = () => {
        self.selectedTradeAccountContacts.push(tradeAccountContactViewModel({
            rec: {}
        }))
    }

    self.removeTradeAccountContact = (rec) => {
        let mustConfirm = rec.MemberID || rec.unsavedChanges();

        if (mustConfirm) {
            let confirmMessage = rec.unsavedChanges() ? 'You have unsaved changes. If you click yes, those changes will be lost.' : 'If you\'re absolutely sure that you want to remove this Trade Account Contact, click the Yes button below.';
            window.showConfirm('Are you sure?', confirmMessage, () => {
                self.selectedTradeAccountContacts.remove(rec);
            }, null);
        } else {
            self.selectedTradeAccountContacts.remove(rec);
        }
    }

    //#endregion



    //#region Computeds

    self.unsavedChangesComputer = ko.computed(() => {
        self.selectedTradeAccountContacts().forEach(tac => {
            tac.unsavedChanges.subscribe(nv => {
                if (nv) {
                    self.unsavedChanges.push(tac)
                } else {
                    self.unsavedChanges(self.unsavedChanges().filter(cc => cc != tac));
                }
            });
        });
    });

    //#endregion





    //#region Subscriptions

    self.selectedTradeAccount.subscribe(nv => {
        if (nv) {
            self.fetchContacts(nv.TradeAccountID);
        }
    });

    self.filters.getData.subscribe(nv => {
        self.tradeAccountSearch(nv);
    });

    self.unsavedChanges.subscribe(nv => {
        console.log('unsavedChanges', nv);
    }, 'arrayChange', self);

    //#endregion



    //#region Events

    self.tradeAccountContactsModalElement.addEventListener('hidden.bs.modal', () => {
        self.selectedTradeAccount(undefined);
        self.selectedTradeAccountContacts([]);
    })

    //#endregion


    return self;
};