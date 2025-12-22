const gridColumnWidths = {
    seventy: 70,
    eighty: 80,
    ninety: 90,
    oneHundred: 100,
    oneTwenty: 120,
    oneForty: 140,
    oneFortyFive: 145,
    oneSixty: 160,
    twoHundred: 200,
    twoSixty: 260,
    threeTwenty: 320,
    fiveHundred: 500
},
    SINGLE_BR = '<br/>',
    DOUBLE_BR = '<br/><br/>'

const creditControlViewModel = (() => {
    let self = {};

    //#region Properties

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable('Please wait...');

    self.validateNow = ko.observable(false);

    self.refresh = () => {
        console.log('creditControlViewModel refresh called');
        self.tradeAccountSearch(self.filters.getData());
    }

    self.filters = creditControlFiltersViewModel({
        params: {},
        parent: self
    });

    self.sendResponse = ko.observable();

    self.dashboardPods = ko.observableArray([]);

    self.tradeAccounts = ko.observableArray([]);

    self.selectedTradeAccount = ko.observable();

    self.tradeAccountContacts = tradeAccountContactsViewModel({});

    //#endregion

    //#region Lifted Methods

    self.genericUnsavedChangesClear = (e) => {
        self.checkUnsavedChangesThenClear(e);
    }

    self.checkUnsavedChangesThenClear = async (options) => {
        await self.unsavedChanges().then(() => {
            var self = options; // self is now the params of the control the user just interacted with

            if (ko.isObservableArray(self.observable)) {
                self.observable([]);
            } else {
                self.observable(EMPTY_STRING);
            }

            if (self.dropDownListSettings.widget()) {

                if (ko.isObservableArray(self.observable)) {
                    self.dropDownListSettings.widget().value([]);
                } else {
                    self.dropDownListSettings.widget().value(EMPTY_STRING);
                }

                self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.getDefaultFoundation().adapter_.closeOutline();

                if (self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.label_ != null)
                    self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.label_.float(false);
            }

            if (typeof self.afterClear === 'function') {
                self.afterClear();
            }

        }).catch((e) => { });
    }

    self.unsavedChanges = () => {
        return new Promise((resolve, reject) => {

            let array = [];

            let unsaved = false; // array.find(p => p.unsavedChanges());

            if (unsaved) {
                window.showConfirm('Unsaved changes', 'You have unsaved changes. If you proceed your changes will be lost. Proceed?', () => {
                    resolve();
                }, () => {
                    reject();
                });
            } else {
                resolve();
            }
        });
    }

    //#endregion


    //#region Components

    self.formatCurrency = (e, fieldName) => {
        if (e[fieldName] != null) {
            return window.formatCurrency(e[fieldName], 2, e.FormattingCulture, e.CurrencyCode);
        } else {
            return ``;
        }
    }

    self.formatNumber = (e, fieldName) => {
        if (e[fieldName] != null) {
            return window.formatNumber(e[fieldName], 2, e.FormattingCulture);
        } else {
            return ``;
        }
    }

    self.gridColumns = () => [{
        field: 'TradeAccountID',
        title: 'Trade Account ID',
        hidden: true,
        width: gridColumnWidths.oneHundred
    }, {
        field: 'CurrencyCode',
        title: 'Currency',
        filterable: false,
        locked: true,
        hidden: false, //self.tradeAccounts().length == 0,
        width: gridColumnWidths.oneTwenty
    }, {
        field: 'FormattingCulture',
        title: 'Formatting Culture',
        filterable: {
            extra: false
        },
        hidden: true,
        width: gridColumnWidths.oneTwenty
    }, {
        field: 'MarketName',
        title: 'Market',
        filterable: false,
        locked: true,
        hidden: false, // self.tradeAccounts().length == 0,
        width: gridColumnWidths.oneTwenty
    }, {
        field: 'TradeAccountCode',
        title: 'Code',
        filterable: false,
        locked: true,
        hidden: false, //self.tradeAccounts().length == 0,
        width: gridColumnWidths.oneForty
    }, {
        field: 'TradeAccountName',
        title: 'Name',
        filterable: false,
        locked: true,
        hidden: false, //self.tradeAccounts().length == 0,
        width: gridColumnWidths.twoSixty
    }, {
        field: 'Contacts',
        title: 'Contacts',
        attributes: {
            "class": "text-center grid-btn-cell"
        },
        locked: true,
        hidden: false, //self.tradeAccounts().length == 0,
        width: gridColumnWidths.oneHundred,
        template: (e) => {
            return `<a href="#" class="btn grid-btn contacts-btn" data-bind="click: openContactsModal">
					<i class="bi bi-people-fill"></i>
                    <span class="badge rounded-pill text-bg-primary">${e.MemberCount}</span>
				</a>`;
        }
    }, {
        field: 'Status',
        title: 'Status',
        filterable: {
            extra: false
        },
        locked: true,
        hidden: false, //self.tradeAccounts().length == 0,
        width: gridColumnWidths.twoHundred,
        attributes: {
            "class": "html-cell"
        },
        template: (e) => {
            if (e.Status) {
                return e.Status;
            } else {
                return EMPTY_STRING;
            }
        }
    }, {
        field: 'CreditStop',
        title: 'On Stop',
        filterable: {
            extra: false,
            messages: {
                isTrue: 'On Stop',
                isFalse: 'Not on Stop'
            }
        },
        locked: true,
        hidden: false, //self.tradeAccounts().length == 0,
        width: gridColumnWidths.seventy,
        attributes: {
            "class": (e) => e.CreditStop ? `text-danger bold` : ``
        },
        template: (e) => {
            if (e.CreditStop) {
                return '<i class="text-danger bi bi-sign-stop-fill fs-1 credit-stopped" title="Credit Stopped"></i>';
            } else {
                return '';
            }
        },
        attributes: {
            "class": 'text-center'
        }
    }, {
        field: 'Advisory',
        title: 'Advisory',
        width: 140,
        filterable: {
            extra: false,
            defaultOperation: 'contains'
        },
        locked: true,
        hidden: false, //self.tradeAccounts().length == 0,
        width: gridColumnWidths.twoHundred,
        attributes: {
            "class": "html-cell"
        },
        template: (e) => {
            if (e.Advisory) {
                return e.Advisory;
            } else {
                return EMPTY_STRING;
            }
        }
    }, {
        title: 'Credit Limit',
        headerAttributes: {
            "class": "credit-limit-heading"
        },
        columns: [{
            field: 'InsuredCreditLimit',
            title: 'Insured',
            headerAttributes: {
                "class": "credit-limit-subheading"
            },
            attributes: {
                "class": 'text-end'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => self.formatCurrency(e, 'InsuredCreditLimit')
        }, {
            field: 'CreditLimit',
            title: 'DG',
            headerAttributes: {
                "class": "credit-limit-subheading"
            },
            attributes: {
                "class": 'text-danger text-end'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => self.formatCurrency(e, 'CreditLimit')
        }]
    }, {
        title: 'Totals',
        headerAttributes: {
            "class": "totals-heading"
        },
        columns: [{
            field: 'DebtTotal',
            title: 'Debt',
            headerAttributes: {
                "class": "totals-subheading"
            },
            attributes: {
                "class": 'text-end'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => self.formatCurrency(e, 'DebtTotal')
        }, {
            field: 'DebtPlusOrdersTotal',
            title: 'Debt + Orders',
            headerAttributes: {
                "class": "totals-subheading"
            },
            attributes: {
                "class": 'text-danger text-end'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => self.formatCurrency(e, 'DebtPlusOrdersTotal')
        }]
    }, {
        title: 'Orders',
        headerAttributes: {
            "class": "orders-heading"
        },
        columns: [{
            field: 'OrdersTotalValue',
            title: 'Total',
            headerAttributes: {
                "class": "orders-subheading"
            },
            attributes: {
                "class": 'text-end'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => self.formatCurrency(e, 'OrdersTotalValue')
                + SINGLE_BR
                + self.formatNumber(e, 'OrdersTotalQuantity')
        }, {
            field: 'OrdersInProgressValue',
            title: 'In Progress',
            headerAttributes: {
                "class": "orders-subheading"
            },
            attributes: {
                "class": 'text-end'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => self.formatCurrency(e, 'OrdersInProgressValue')
                + SINGLE_BR
                + self.formatNumber(e, 'OrdersInProgressQuantity')
        }, {
            field: 'OrdersHeldPortalValue',
            title: 'Held Portal',
            headerAttributes: {
                "class": "orders-subheading"
            },
            attributes: {
                "class": 'text-end'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => self.formatCurrency(e, 'OrdersHeldPortalValue')
                + SINGLE_BR
                + self.formatNumber(e, 'OrdersHeldPortalQuantity')
        }, {
            field: 'OrdersHeldMertexValue',
            title: 'Held Mertex',
            headerAttributes: {
                "class": "orders-subheading"
            },
            attributes: {
                "class": 'text-end'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => self.formatCurrency(e, 'OrdersHeldMertexValue')
                + SINGLE_BR
                + self.formatNumber(e, 'OrdersHeldMertexQuantity')
        }]
    }, {
        title: 'Debt Breakdown',
        headerAttributes: {
            "class": "debt-breakdown-heading"
        },
        columns: [{
            field: 'NotDueTotalValue',
            title: 'Due',
            headerAttributes: {
                "class": "debt-breakdown-subheading"
            },
            attributes: {
                "class": 'text-end'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => self.formatCurrency(e, 'NotDueTotalValue')
                + SINGLE_BR
                + self.formatNumber(e, 'NotDueTotalQuantity')
        }, {
            field: 'OverdueTotalValue',
            title: 'Overdue',
            headerAttributes: {
                "class": "debt-breakdown-subheading"
            },
            attributes: {
                "class": 'text-danger text-end'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => self.formatCurrency(e, 'OverdueTotalValue')
                + SINGLE_BR
                + self.formatNumber(e, 'OverdueTotalQuantity')
        }, {
            field: 'Debt30DayValue',
            title: '30 Day',
            headerAttributes: {
                "class": "debt-breakdown-subheading"
            },
            attributes: {
                "class": 'text-danger text-end'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => self.formatCurrency(e, 'Debt30DayValue')
                + SINGLE_BR
                + self.formatNumber(e, 'Debt30DayQuantity')
        }, {
            field: 'Debt60DayValue',
            title: '60 Day',
            headerAttributes: {
                "class": "debt-breakdown-subheading"
            },
            attributes: {
                "class": 'text-danger text-end'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => self.formatCurrency(e, 'Debt60DayValue')
                + SINGLE_BR
                + self.formatNumber(e, 'Debt60DayQuantity')
        }, {
            field: 'Debt90DayValue',
            title: '90 Day',
            headerAttributes: {
                "class": "debt-breakdown-subheading"
            },
            attributes: {
                "class": 'text-danger text-end'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => self.formatCurrency(e, 'Debt90DayValue')
                + SINGLE_BR
                + self.formatNumber(e, 'Debt90DayQuantity')
        }, {
            field: 'Debt120DayValue',
            title: '120 Day',
            headerAttributes: {
                "class": "debt-breakdown-subheading"
            },
            attributes: {
                "class": 'text-danger text-end'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => self.formatCurrency(e, 'Debt120DayValue')
                + SINGLE_BR
                + self.formatNumber(e, 'Debt120DayQuantity')
        }, {
            field: 'DisputedValue',
            title: 'Disputed',
            headerAttributes: {
                "class": "debt-breakdown-subheading"
            },
            attributes: {
                "class": 'text-danger text-end'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => self.formatCurrency(e, 'DisputedValue')
                + SINGLE_BR
                + self.formatNumber(e, 'DisputedQuantity')
        }, {
            field: 'WrittenOffValue',
            title: 'Written Off',
            headerAttributes: {
                "class": "debt-breakdown-subheading"
            },
            attributes: {
                "class": 'text-danger text-end'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => self.formatCurrency(e, 'WrittenOffValue')
                + SINGLE_BR
                + self.formatNumber(e, 'WrittenOffQuantity')
        }, {
            field: 'StatementURI',
            title: 'Statement',
            headerAttributes: {
                "class": "debt-breakdown-subheading"
            },
            attributes: {
                "class": "text-center grid-btn-cell"
            },
            width: gridColumnWidths.oneTwenty,
            template: (e) => {
                if (e.StatementURI) {
                    return `<a href="#" class="btn grid-btn statement-btn" data-bind="attr: { href: StatementURI, target: '_blank' }">
					        <i class="bi bi-filetype-pdf"></i>
				        </a>`;
                } else {
                    return ``;
                }
            }
        }, {
            field: 'StatementTotalValue',
            title: 'Total',
            headerAttributes: {
                "class": "debt-breakdown-subheading"
            },
            attributes: {
                "class": "text-danger text-end"
            },
            width: gridColumnWidths.oneForty,
            template: (e) => self.formatCurrency(e, 'StatementTotalValue')
        }]
    }, {
        title: 'Other',
        headerAttributes: {
            "class": "other-heading"
        },
        columns: [{
            field: 'CreditsValue',
            title: 'Credits',
            headerAttributes: {
                "class": "other-subheading"
            },
            attributes: {
                "class": 'text-end'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => self.formatCurrency(e, 'CreditsValue')
                + SINGLE_BR
                + self.formatNumber(e, 'CreditsQuantity')
        }, {
            field: 'DepositsValue',
            title: 'Deposits',
            headerAttributes: {
                "class": "other-subheading"
            },
            attributes: {
                "class": 'text-end'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => self.formatCurrency(e, 'DepositsValue')
                + SINGLE_BR
                + self.formatNumber(e, 'DepositsQuantity')
        }, {
            field: 'OverpaymentsValue',
            title: 'Overpayments',
            headerAttributes: {
                "class": "other-subheading"
            },
            attributes: {
                "class": 'text-end'
            },
            width: gridColumnWidths.oneFortyFive,
            template: (e) => self.formatCurrency(e, 'OverpaymentsValue')
                + SINGLE_BR
                + self.formatNumber(e, 'OverpaymentsQuantity')
        }, {
            field: 'RefundsValue',
            title: 'Refunds',
            headerAttributes: {
                "class": "other-subheading"
            },
            attributes: {
                "class": 'text-end'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => self.formatCurrency(e, 'RefundsValue')
                + SINGLE_BR
                + self.formatNumber(e, 'RefundsQuantity')
        }]
    }, {
        title: 'Sales',
        headerAttributes: {
            "class": "sales-heading"
        },
        columns: [{
            field: 'SalesRank',
            title: 'Sales',
            headerAttributes: {
                "class": "sales-subheading"
            },
            attributes: {
                "class": 'text-end'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => self.formatNumber(e, 'SalesRank')
        }, {
            field: 'SalesValue',
            title: 'Sales',
            headerAttributes: {
                "class": "sales-subheading"
            },
            attributes: {
                "class": 'text-end'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => self.formatCurrency(e, 'SalesValue')
        }]
    }];

    self.gridParams = {
        autoBind: true,
        widget: ko.observable(),
        columns: self.gridColumns(),
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
                        CurrencyCode: { type: 'string' },
                        FormattingCulture: { type: 'string' },
                        MarketName: { type: 'string' },
                        TradeAccountCode: { type: 'string' },
                        TradeAccountName: { type: 'string' },
                        Status: { type: 'string' },
                        CreditStop: { type: 'boolean' },
                        Advisory: { type: 'string' },
                        InsuredCreditLimit: { type: 'number' },
                        CreditLimit: { type: 'number' },
                        DebtTotal: { type: 'number' },
                        DebtPlusOrdersTotal: { type: 'number' },
                        OrdersTotalValue: { type: 'number' },
                        OrdersInProgressValue: { type: 'number' },
                        OrdersHeldPortalValue: { type: 'number' },
                        OrdersHeldMertexValue: { type: 'number' },
                        OrdersTotalQuantity: { type: 'number' },
                        OrdersInProgressQuantity: { type: 'number' },
                        OrdersHeldPortalQuantity: { type: 'number' },
                        OrdersHeldMertexQuantity: { type: 'number' },
                        NotDueTotalValue: { type: 'number' },
                        OverdueTotalValue: { type: 'number' },
                        Debt30DayValue: { type: 'number' },
                        Debt60DayValue: { type: 'number' },
                        Debt90DayValue: { type: 'number' },
                        Debt120DayValue: { type: 'number' },
                        DisputedValue: { type: 'number' },
                        WrittenOffValue: { type: 'number' },
                        NotDueTotalQuantity: { type: 'number' },
                        OverdueTotalQuantity: { type: 'number' },
                        Debt30DayQuantity: { type: 'number' },
                        Debt60DayQuantity: { type: 'number' },
                        Debt90DayQuantity: { type: 'number' },
                        Debt120DayQuantity: { type: 'number' },
                        DisputedQuantity: { type: 'number' },
                        WrittenOffQuantity: { type: 'number' },
                        StatementURI: { type: 'number' },
                        StatementTotalValue: { type: 'number' },
                        CreditsValue: { type: 'number' },
                        DepositsValue: { type: 'number' },
                        OverpaymentsValue: { type: 'number' },
                        RefundsValue: { type: 'number' },
                        SalesRank: { type: 'number' },
                        SalesValue: { type: 'number' },
                        MemberCount: { type: 'number' },
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
        scrollable: true,
        sortable: true,
        filterable: true,
        reorderable: false,
        paging: true,
        pageSize: 10,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        //height: 'calc(100vh - 230px)',
        selectable: false,
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
        },
        dataBound: (e) => {

            var pristine = e.sender.dataSource.data().toJSON();

            ko.utils.arrayForEach(e.sender.dataSource.data(), function (item, index) {

                let rows = document.querySelectorAll('tr[data-uid="' + item.uid + '"]');

                rows.forEach(row => {
                    ko.cleanNode(row);

                    pristine[index] = creditControlTradeAccountSearchResultViewModel({
                        parent: self,
                        rec: item
                    });

                    ko.applyBindings(pristine[index], row);
                });
            });
        }
    };

    //#endregion


    //#region Subscriptions

    self.emptyFiltersJSON = JSON.stringify(self.filters.getData());

    self.filters.getData.subscribe(nv => {
        if (JSON.stringify(nv) == self.emptyFiltersJSON) {
            self.gridParams.widget().dataSource.data([]);
        } else {
            self.gridParams.widget().dataSource.page(1);
            self.tradeAccountSearch(nv);
        }
    });

    //#endregion


    //#region Computeds



    //#endregion


    //#region Methods

    self.init = () => {

    }

    self.tradeAccountSearch = (data) => {

        self.busy(true);

        console.log('tradeAccountSearch calling with', data);

        fetch('/api/creditcontrolapi/TradeAccountSearch', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {

                console.log('tradeAccountSearch returned', data);
                
                self.dashboardPods(data.DashboardPods.map(dp => creditControlDashboardPodViewModel({
                    rec: dp
                })));

                self.tradeAccounts(data.Results); // the mapping to ViewModel occurs in the grid's dataBound event handler

                //self.gridParams.widget().setOptions({
                //    columns: self.gridColumns()
                //});

                self.busy(false);

            })
            .catch(err => {

                self.busy(false);

                window.catchFetchError(err);

            })
    }

    self.sendStatements = (data, event) => {

        self.filters.validateNow(true);

        if (self.filters.errors().length) {
            self.filters.errors.showAllMessages(true);
            self.filters.errors.forEach(x => {
                x.isValid.notifySubscribers(x.isValid());
            })
        } else {
            window.showConfirm('Are you sure?', 'This might send Statement PDF(s)', () => {
                self.busy(true);

                let data = self.getParameters();

                console.log('calling sendStatements with', data);

                fetch('/api/StatementsAPI/SendStatements', {
                    method: 'POST',
                    headers: window.fetchHeaders,
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    body: JSON.stringify(data)
                })
                    .then(window.handleFetchResponse)
                    .then(data => {
                        self.busy(false);
                        self.sendResponse(data.Response);
                    })
                    .catch(err => {
                        self.busy(false);
                        window.catchFetchError(err);
                    });
            }, () => {

            });
        }
    }

    //#endregion

    //#region Events



    //#endregion

    return self;
});