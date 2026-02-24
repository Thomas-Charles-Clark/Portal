const gridColumnWidths = {
    fifty: 50,
    sixty: 60,
    seventy: 70,
    eighty: 80,
    ninety: 90,
    ninetyTwo: 92,
    oneHundred: 100,
    oneTwenty: 120,
    oneForty: 140,
    oneFortyFive: 145,
    oneSixty: 160,
    twoHundred: 200,
    twoTwenty: 220,
    twoForty: 240,
    twoSixty: 260,
    threeTwenty: 320,
    fiveHundred: 500
},
    SINGLE_BR = '<br/>',
    DOUBLE_BR = '<br/><br/>',
    DISPLAY_MODE_QUANTITY = 1,
    DISPLAY_MODE_VALUE = 2


const creditControlViewModel = (() => {
    let self = {};

    //#region Properties

    self.busy = ko.observable(true);

    self.busyMessage = ko.observable('Please wait...');

    self.heldOrdersGridBusy = ko.observable(true);

    self.validateNow = ko.observable(false);

    self.refresh = () => {
        console.log('creditControlViewModel refresh called');

        self.gridParams.widget().dataSource.query({
            page: self.gridParams.widget().dataSource.page() ?? 1,
            pageSize: self.gridParams.widget().dataSource.pageSize() ?? 0
        });
    }

    self.selectedPod = ko.observable();

    self.clearSelectedPod = () => {
        self.selectedPod(undefined);
        self.refresh();
    }

    self.filters = creditControlFiltersViewModel({
        params: {},
        parent: self
    });

    self.sendResponse = ko.observable();

    self.performance = creditControlPerformanceViewModel();

    self.gridWidget = ko.observable();

    self.dashboardPods = ko.observableArray([]);

    self.tradeAccounts = ko.observableArray([]);

    self.tradeAccountContacts = tradeAccountContactsViewModel({});

    self.selectedTradeAccount = ko.observable();

    self.debtBreakdown = ko.observable();

    self.debtBreakdownModalElement = document.querySelector('#debt-breakdown-modal');

    self.debtBreakdownModal = bootstrap.Modal.getOrCreateInstance(self.debtBreakdownModalElement);

    self.ordersBreakdown = ko.observable();

    self.ordersBreakdownModalElement = document.querySelector('#orders-breakdown-modal');

    self.ordersBreakdownModal = bootstrap.Modal.getOrCreateInstance(self.ordersBreakdownModalElement);

    self.claimsBreakdown = ko.observable();

    self.claimsBreakdownModalElement = document.querySelector('#claims-breakdown-modal');

    self.claimsBreakdownModal = bootstrap.Modal.getOrCreateInstance(self.claimsBreakdownModalElement);

    self.otherBreakdown = ko.observable();

    self.otherBreakdownModalElement = document.querySelector('#other-breakdown-modal');

    self.otherBreakdownModal = bootstrap.Modal.getOrCreateInstance(self.otherBreakdownModalElement);

    self.salesBreakdown = ko.observable();

    self.salesBreakdownModalElement = document.querySelector('#sales-breakdown-modal');

    self.salesBreakdownModal = bootstrap.Modal.getOrCreateInstance(self.salesBreakdownModalElement);

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

    self.gridDataSourceRead = (options) => {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });

        var mapped = webapi.parameterMap(options.data);

        var additionalParameters = self.filters.getData();

        var params = new URLSearchParams();

        if (self.selectedPod()) {
            additionalParameters.selectedPod = self.selectedPod().PodHandle;
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

        console.log('creditControl gridDataSourceRead calling with', data);

        self.busy(true);

        fetch('/api/creditcontrolapi/TradeAccountSearch?' + params, {
            method: 'GET',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin'
        })
            .then(window.handleFetchResponse)
            .then(data => {

                console.log('creditControl gridDataSourceRead returned', data);

                ko.ignoreDependencies(() => {

                    if (Object.hasOwn(data, 'errorMessage')) {

                        document.querySelector('#info-modal').addEventListener('hide.bs.modal', self.refresh);
                        options.success([]);
                        window.showInfo('Sorry', data.errorMessage);

                    } else {
                        document.querySelector('#info-modal').removeEventListener('hide.bs.modal', self.refresh);
                        self.previouslySelectedDashboardPod = self.selectedPod()?.PodHandle;

                        self.dashboardPods(data.dashboardPods.map(dp => creditControlDashboardPodViewModel({
                            rec: dp
                        })));

                        if (self.previouslySelectedDashboardPod) {
                            self.selectedPod(self.dashboardPods().find(dp => dp.PodHandle == self.previouslySelectedDashboardPod));
                        }

                        options.success(data.gridData);

                        self.tradeAccounts(data.gridData); // the mapping to ViewModel occurs in the grid's dataBound event handler

                        self.performance.tradeAccountCodeList(data.totalsRecord.TradeAccountCodeList);

                        //self.gridParams.widget().setOptions({
                        //    columns: self.gridColumns()
                        //});
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

    self.memberBasketFetcher = memberBasketFetcher(self);

    self.memberBasketFetcher.holdO

    self.formatCurrency = (e, fieldName) => {

        // Display e.g. £0.00 if ever we see a NULL
        if (e[fieldName] == null) {
            e[fieldName] = 0;
        }

        return window.formatCurrency(e[fieldName], 2, e.FormattingCulture, e.CurrencyCode);
    }

    self.formatNumber = (e, fieldName, decimals = 0) => {
        if (e[fieldName] != null) {
            return window.formatNumber(e[fieldName], decimals, e.FormattingCulture);
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
        title: 'Curr.',
        filterable: false,
        locked: true,
        hidden: false, //self.tradeAccounts().length == 0,
        width: gridColumnWidths.fifty
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
        width: gridColumnWidths.oneHundred,
        template: (dataItem) => {
            return `<span>${dataItem.MarketName}</span>`;
        }
    }, {
        field: 'TradeAccountCode',
        title: 'Code',
        filterable: false,
        locked: true,
        hidden: false, //self.tradeAccounts().length == 0,
        width: gridColumnWidths.ninety
    }, {
        field: 'TradeAccountName',
        title: 'Name',
        filterable: false,
        locked: true,
        hidden: false, //self.tradeAccounts().length == 0,
        width: gridColumnWidths.oneForty
    }, {
        field: 'Status',
        title: 'Status',
        filterable: false,
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
    },
    //{
    //    field: 'CreditStop',
    //    title: 'On Stop',
    //    filterable: {
    //        extra: false,
    //        messages: {
    //            isTrue: 'On Stop',
    //            isFalse: 'Not on Stop'
    //        }
    //    },
    //    locked: true,
    //    hidden: true,
    //    width: gridColumnWidths.seventy,
    //    attributes: {
    //        "class": (e) => e.CreditStop ? `text-danger bold` : ``
    //    },
    //    template: (e) => {
    //        if (e.CreditStop) {
    //            return '<i class="text-danger bi bi-sign-stop-fill fs-1 credit-stopped" title="Credit Stopped"></i>';
    //        } else {
    //            return '';
    //        }
    //    },
    //    attributes: {
    //        "class": 'text-center'
    //    }
    //},
    {
        field: 'Advisory',
        title: 'Advisory',
        width: gridColumnWidths.twoHundred,
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
        title: 'Errata',
        headerAttributes: {
            "class": "errata-heading"
        },
        columns: [{
            field: 'MemberCount',
            title: 'Contacts',
            attributes: {
                "class": "text-center grid-btn-cell contacts-cell"
            },
            headerAttributes: {
                "class": "errata-subheading"
            },
            filterable: false,
            hidden: false, //self.tradeAccounts().length == 0,
            width: gridColumnWidths.eighty,
            template: (e) => {
                return `<a href="#" class="btn grid-btn contacts-btn" data-bind="click: openContactsModal">
			<i class="bi bi-people-fill"></i>
            <span class="badge rounded-pill text-bg-primary">${e.MemberCount}</span>
		</a>`;
            }
        }, {
            field: 'StatementURI',
            title: 'Statement',
            headerAttributes: {
                "class": "errata-subheading"
            },
            attributes: {
                "class": "text-center grid-btn-cell"
            },
            sortable: false,
            filterable: false,
            width: gridColumnWidths.ninetyTwo,
            template: (e) => {
                if (e.StatementURI) {
                    return `<a href="#" class="btn grid-btn statement-btn" data-bind="attr: { href: StatementURI, target: '_blank' }">
				<i class="bi bi-filetype-pdf"></i>
			</a>`;
                } else {
                    return ``;
                }
            }
        }]
    }, {
        field: '',
        title: '',
        attributes: {
            "class": "spacer-column left-border"
        },
        headerAttributes: {
            "class": "spacer-column left-border"
        },
        template: '&nbsp;',
        width: 20
    }, {
        title: 'Credit Limit',
        headerAttributes: {
            "class": "credit-limit-heading"
        },
        columns: [{
            field: 'InsuredCreditLimit',
            title: 'Coface Insured',
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
                "class": 'text-end'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => self.formatCurrency(e, 'CreditLimit')
        }]
    }, {
        field: '',
        title: '',
        attributes: {
            'class': 'spacer-column left-border'
        },
        headerAttributes: {
            'class': 'spacer-column left-border'
        },
        template: '&nbsp;',
        width: 20
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
                "class": 'text-end'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => self.formatCurrency(e, 'DebtPlusOrdersTotal')
        }]
    }, {
        field: '',
        title: '',
        attributes: {
            'class': 'spacer-column left-border'
        },
        headerAttributes: {
            'class': 'spacer-column left-border'
        },
        template: '&nbsp;',
        width: 20
    }, {
        title: 'Orders',
        headerAttributes: {
            "class": "orders-heading orders-breakdown"
        },
        columns: [{
            field: 'OrdersTotalValue',
            title: 'Total',
            headerAttributes: {
                "class": "orders-subheading orders-breakdown"
            },
            attributes: {
                "class": 'text-end orders-breakdown'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_VALUE) > -1)
                    result.push(self.formatCurrency(e, 'OrdersTotalValue'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_QUANTITY) > -1)
                    result.push(self.formatNumber(e, 'OrdersTotalQuantity'));

                return result.join(SINGLE_BR)
            }
        }, {
            field: 'OrdersInProgressValue',
            title: 'In Progress',
            headerAttributes: {
                "class": "orders-subheading orders-breakdown"
            },
            attributes: {
                "class": 'text-end orders-breakdown'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_VALUE) > -1)
                    result.push(self.formatCurrency(e, 'OrdersInProgressValue'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_QUANTITY) > -1)
                    result.push(self.formatNumber(e, 'OrdersInProgressQuantity'));

                return result.join(SINGLE_BR)
            }
        }, {
            field: 'OrdersHeldPortalValue',
            title: 'Held Portal',
            headerAttributes: {
                "class": "orders-subheading orders-breakdown"
            },
            attributes: {
                "class": 'text-end orders-breakdown relative'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_VALUE) > -1)
                    result.push(self.formatCurrency(e, 'OrdersHeldPortalValue'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_QUANTITY) > -1)
                    result.push(self.formatNumber(e, 'OrdersHeldPortalQuantity'));

                return `<a href="javascript:;" class="stretched-link" data-bind="click: (data, event) => { viewModel.selectedTradeAccount(data); viewModel.gridWidget().select(event.currentTarget.closest('tr')); }">${result.join(SINGLE_BR)}</a>`;
            }
        }, {
            field: 'OrdersHeldMertexValue',
            title: 'Held Mertex',
            headerAttributes: {
                "class": "orders-subheading orders-breakdown"
            },
            attributes: {
                "class": 'text-end orders-breakdown'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_VALUE) > -1)
                    result.push(self.formatCurrency(e, 'OrdersHeldMertexValue'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_QUANTITY) > -1)
                    result.push(self.formatNumber(e, 'OrdersHeldMertexQuantity'));

                return result.join(SINGLE_BR)
            }
        }, {
            field: 'BackOrderValue',
            title: 'Back Order',
            headerAttributes: {
                "class": "orders-subheading orders-breakdown"
            },
            attributes: {
                "class": 'text-end orders-breakdown'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_VALUE) > -1)
                    result.push(self.formatCurrency(e, 'BackOrderValue'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_QUANTITY) > -1)
                    result.push(self.formatNumber(e, 'BackOrderQuantity'));

                return result.join(SINGLE_BR)
            }
        }]
    }, {
        field: '',
        title: '',
        attributes: {
            'class': 'spacer-column left-border'
        },
        headerAttributes: {
            'class': 'spacer-column left-border'
        },
        template: '&nbsp;',
        width: 20
    }, {
        title: 'Debt Breakdown',
        headerAttributes: {
            "class": "debt-breakdown-heading debt-breakdown"
        },
        columns: [{
            field: 'StatementTotalValue',
            title: 'Total',
            headerAttributes: {
                "class": "debt-breakdown-subheading debt-breakdown"
            },
            attributes: {
                "class": "text-end debt-breakdown"
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_VALUE) > -1)
                    result.push(self.formatCurrency(e, 'StatementTotalValue'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_QUANTITY) > -1)
                    result.push(self.formatNumber(e, 'TotalQuantity'));

                return result.join(SINGLE_BR);
            }
        },{
            field: 'NotDueTotalValue',
            title: 'Not Due',
            headerAttributes: {
                "class": "debt-breakdown-subheading debt-breakdown"
            },
            attributes: {
                "class": 'text-end debt-breakdown'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_VALUE) > -1)
                    result.push(self.formatCurrency(e, 'NotDueTotalValue'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_QUANTITY) > -1)
                    result.push(self.formatNumber(e, 'NotDueTotalQuantity'));

                return result.join(SINGLE_BR)
            }
        }, {
            field: 'OverdueTotalValue',
            title: 'Overdue',
            headerAttributes: {
                "class": "debt-breakdown-subheading debt-breakdown"
            },
            attributes: {
                "class": 'text-danger text-end debt-breakdown'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_VALUE) > -1)
                    result.push(self.formatCurrency(e, 'OverdueTotalValue'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_QUANTITY) > -1)
                    result.push(self.formatNumber(e, 'OverdueTotalQuantity'));

                return result.join(SINGLE_BR)
            }
        }, {
            field: 'Debt30DayValue',
            title: '30 Day',
            headerAttributes: {
                "class": "debt-breakdown-subheading debt-breakdown"
            },
            attributes: {
                "class": 'text-danger text-end debt-breakdown'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_VALUE) > -1)
                    result.push(self.formatCurrency(e, 'Debt30DayValue'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_QUANTITY) > -1)
                    result.push(self.formatNumber(e, 'Debt30DayQuantity'));

                return result.join(SINGLE_BR)
            }
        }, {
            field: 'Debt60DayValue',
            title: '60 Day',
            headerAttributes: {
                "class": "debt-breakdown-subheading debt-breakdown"
            },
            attributes: {
                "class": 'text-danger text-end debt-breakdown'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_VALUE) > -1)
                    result.push(self.formatCurrency(e, 'Debt60DayValue'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_QUANTITY) > -1)
                    result.push(self.formatNumber(e, 'Debt60DayQuantity'));

                return result.join(SINGLE_BR)
            }
        }, {
            field: 'Debt90DayValue',
            title: '90 Day',
            headerAttributes: {
                "class": "debt-breakdown-subheading debt-breakdown"
            },
            attributes: {
                "class": 'text-danger text-end debt-breakdown'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_VALUE) > -1)
                    result.push(self.formatCurrency(e, 'Debt90DayValue'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_QUANTITY) > -1)
                    result.push(self.formatNumber(e, 'Debt90DayQuantity'));

                return result.join(SINGLE_BR)
            }
        }, {
            field: 'Debt120DayValue',
            title: '120 Day',
            headerAttributes: {
                "class": "debt-breakdown-subheading debt-breakdown"
            },
            attributes: {
                "class": 'text-danger text-end debt-breakdown'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_VALUE) > -1)
                    result.push(self.formatCurrency(e, 'Debt120DayValue'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_QUANTITY) > -1)
                    result.push(self.formatNumber(e, 'Debt120DayQuantity'));

                return result.join(SINGLE_BR)
            }
        }, {
            field: 'DisputedValue',
            title: 'Disputed',
            headerAttributes: {
                "class": "debt-breakdown-subheading debt-breakdown"
            },
            attributes: {
                "class": 'text-danger text-end debt-breakdown'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_VALUE) > -1)
                    result.push(self.formatCurrency(e, 'DisputedValue'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_QUANTITY) > -1)
                    result.push(self.formatNumber(e, 'DisputedQuantity'));

                return result.join(SINGLE_BR)
            }
        }, {
            field: 'WrittenOffValue',
            title: 'Written Off',
            headerAttributes: {
                "class": "debt-breakdown-subheading debt-breakdown"
            },
            attributes: {
                "class": 'text-danger text-end debt-breakdown'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_VALUE) > -1)
                    result.push(self.formatCurrency(e, 'WrittenOffValue'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_QUANTITY) > -1)
                    result.push(self.formatNumber(e, 'WrittenOffQuantity'));

                return result.join(SINGLE_BR)
            }
        }]
    }, {
        field: '',
        title: '',
        attributes: {
            'class': 'spacer-column left-border'
        },
        headerAttributes: {
            'class': 'spacer-column left-border'
        },
        template: '&nbsp;',
        width: 20
    }, {
        title: 'Other',
        headerAttributes: {
            "class": "other-heading other-breakdown"
        },
        columns: [{
            field: 'CreditsValue',
            title: 'Unused Credit Notes',
            headerAttributes: {
                "class": "other-subheading other-breakdown"
            },
            attributes: {
                "class": 'text-end other-breakdown'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_VALUE) > -1)
                    result.push(self.formatCurrency(e, 'CreditsValue'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_QUANTITY) > -1)
                    result.push(self.formatNumber(e, 'CreditsQuantity'));

                return result.join(SINGLE_BR)
            }
        }, {
            field: 'DepositsValue',
            title: 'Deposits',
            headerAttributes: {
                "class": "other-subheading other-breakdown"
            },
            attributes: {
                "class": 'text-end other-breakdown'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_VALUE) > -1)
                    result.push(self.formatCurrency(e, 'DepositsValue'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_QUANTITY) > -1)
                    result.push(self.formatNumber(e, 'DepositsQuantity'));

                return result.join(SINGLE_BR)
            }
        }, {
            field: 'OverpaymentsValue',
            title: 'Overpayments',
            headerAttributes: {
                "class": "other-subheading other-breakdown"
            },
            attributes: {
                "class": 'text-end other-breakdown'
            },
            width: gridColumnWidths.oneFortyFive,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_VALUE) > -1)
                    result.push(self.formatCurrency(e, 'OverpaymentsValue'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_QUANTITY) > -1)
                    result.push(self.formatNumber(e, 'OverpaymentsQuantity'));

                return result.join(SINGLE_BR)
            }
        }, {
            field: 'RefundsValue',
            title: 'Refund Requests',
            headerAttributes: {
                "class": "other-subheading other-breakdown"
            },
            attributes: {
                "class": 'text-end other-breakdown'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_VALUE) > -1)
                    result.push(self.formatCurrency(e, 'RefundsValue'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_QUANTITY) > -1)
                    result.push(self.formatNumber(e, 'RefundsQuantity'));

                return result.join(SINGLE_BR)
            }
        }]
    }, {
        field: '',
        title: '',
        attributes: {
            'class': 'spacer-column left-border'
        },
        headerAttributes: {
            'class': 'spacer-column left-border'
        },
        template: '&nbsp;',
        width: 20
    }, {
            title: self.filters.salesHistoryAnalysisPeriod() ? `Sales (${self.filters.salesHistoryAnalysisPeriod().Name})` : `Sales`,
            headerAttributes: {
                "class": "sales-heading sales-breakdown"
            },
        columns: [
            //{
            //    field: 'SalesRank',
            //    title: 'Rank',
            //    headerAttributes: {
            //        "class": "sales-subheading sales-breakdown"
            //    },
            //    attributes: {
            //        "class": 'text-end sales-breakdown'
            //    },
            //    width: gridColumnWidths.oneForty,
            //    template: (e) => {
            //        if (e.SalesRank) {
            //            return e.SalesRank;
            //        } else {
            //            return '';
            //        }
            //    }
            //},
            {
                field: 'SalesValue',
                title: 'Value',
                headerAttributes: {
                    "class": "sales-subheading sales-breakdown"
                },
                attributes: {
                    "class": 'text-end sales-breakdown'
                },
                width: gridColumnWidths.oneForty,
                template: (e) => self.formatCurrency(e, 'SalesValue')
            }]
    }, {
        field: '',
        title: '',
        attributes: {
            'class': 'spacer-column left-border'
        },
        headerAttributes: {
            'class': 'spacer-column left-border'
        },
        template: '&nbsp;',
        width: 20
    }, {
        title: 'CCR Claims',
        headerAttributes: {
            "class": "claim-heading claims-breakdown"
        },
        columns: [{
            field: 'ClaimCount',
            title: ' ',
            headerAttributes: {
                "class": "claim-subheading claims-breakdown"
            },
            attributes: {
                "class": 'text-end claims-breakdown'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_VALUE) > -1)
                    result.push(self.formatCurrency(e, 'ClaimValue'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_QUANTITY) > -1)
                    result.push(self.formatNumber(e, 'ClaimCount'));

                return result.join(SINGLE_BR)
            }
        }]
    }];

    self.gridParams = {
        autoBind: true,
        widget: self.gridWidget,
        columns: self.gridColumns(),
        data: new kendo.data.DataSource({
            transport: {
                read: self.gridDataSourceRead,
            },
            batch: false,
            sortable: true,
            filterable: true,
            grouping: false,
            serverFiltering: false,
            serverGrouping: false,
            serverPaging: true,
            serverAggregates: false,
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
                sorts: "Sorts",
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
                        BackOrderValue: { type: 'number' },
                        OrdersInProgressValue: { type: 'number' },
                        OrdersHeldPortalValue: { type: 'number' },
                        OrdersHeldMertexValue: { type: 'number' },
                        OrdersTotalQuantity: { type: 'number' },
                        BackOrderQuantity: { type: 'number' },
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
                        NotDueTotalQuantity: { type: 'number' },
                        OverdueTotalQuantity: { type: 'number' },
                        Debt30DayQuantity: { type: 'number' },
                        Debt60DayQuantity: { type: 'number' },
                        Debt90DayQuantity: { type: 'number' },
                        Debt120DayQuantity: { type: 'number' },
                        DisputedQuantity: { type: 'number' },
                        WrittenOffQuantity: { type: 'number' },
                        StatementURI: { type: 'string' },
                        StatementTotalValue: { type: 'number' },
                        StatementTotalQuantity: { type: 'number' },
                        CreditsValue: { type: 'number' },
                        DepositsValue: { type: 'number' },
                        OverpaymentsValue: { type: 'number' },
                        RefundsValue: { type: 'number' },
                        SalesRank: { type: 'string' },
                        SalesValue: { type: 'number' },
                        MemberCount: { type: 'number' },
                        ClaimCount: { type: 'number' },
                        ClaimValue: { type: 'number' },
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
        scrollable: {
            endless: true
        },
        sortable: true,
        filterable: {
            extra: false,
            defaultOperation: 'contains'
        },
        reorderable: false,
        paging: true,
        pageSize: 20,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        excel: {
            allPages: true
        },
        height: 'calc(100vh - 230px)',
        selectable: 'cell',
        change: function (event) {
            console.log('change', event, event.sender.select());

            if (event.sender.select()) {

                let classList = event.sender.select()[0].classList;

                let dataItem = event.sender.dataItem(event.sender.select().closest('tr'));

                if (classList.contains('debt-breakdown')) {
                    self.fetchDebtBreakdown(dataItem);
                }
                else if (classList.contains('orders-breakdown')) {
                    self.fetchOrdersBreakdown(dataItem);
                }
                else if (classList.contains('claims-breakdown')) {
                    self.fetchClaimsBreakdown(dataItem);
                }
                else if (classList.contains('other-breakdown')) {
                    self.fetchOtherBreakdown(dataItem);
                }
                else if (classList.contains('sales-breakdown')) {
                    self.fetchSalesBreakdown(dataItem);
                }
                else if (classList.contains('contacts-cell')) {
                    self.tradeAccountContacts.selectedTradeAccount(tradeAccountViewModel({
                        rec: dataItem
                    }));
                }
            }
        },
        filterMenuInit: (e) => {
            if (e.field === "CreditStop") {
                // Find and replace specific elements in the filter menu
                e.container[0].setAttribute('title', 'Filter for Credit Stop Status')
                e.container.find(".k-filter-help-text").text("Credit Stopped?");
            }
        },
        dataBound: (e) => {
            console.log('creditControlViewModel dataBound', e);

            ko.ignoreDependencies(() => {

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
            });
        }
    };

    //#endregion


    //#region Subscriptions

    self.filters.displayModes.subscribe(nv => {
        self.gridParams.widget().setOptions({
            columns: self.gridColumns()
        });
    }, self, 'arrayChange');

    self.filters.salesHistoryAnalysisPeriodId.subscribe(nv => {
        self.gridParams.widget().setOptions({
            columns: self.gridColumns()
        });
    });

    self.filters.getData.subscribe(nv => {
        self.gridParams.widget().dataSource.query({
            page: 1,
            pageSize: (self.gridParams.widget() && self.gridParams.widget().dataSource.pageSize())
        });
    });

    self.selectedTradeAccount.subscribe(nv => {
        self.busy(true);
        self.memberBasketFetcher.heldOrdersGridWidget().one('dataBound', () => {
            window.setTimeout(() => {
                document.querySelector('#order-release-tab').click();
                self.busy(false);
            }, 0);
        });
        self.memberBasketFetcher.heldOrdersSearchTerm(nv.TradeAccountCode);
    })

    //self.emptyFiltersJSON = JSON.stringify(self.filters.getData());

    //self.filters.getData.subscribe(nv => {
    //    //if (JSON.stringify(nv) == self.emptyFiltersJSON) {
    //    //    self.gridParams.widget().dataSource.data([]);
    //    //} else {

    //    self.selectedPod(undefined);

    //    self.tradeAccountSearch(nv, () => {
    //        self.gridParams.widget().dataSource.page(1);
    //        self.busy(false);
    //    });
    //    //}
    //});

    //#endregion


    //#region Computeds



    //#endregion


    //#region Methods

    self.filters.tradeAccountStatusParams.dropDownListSettings.widget.subscribe(nv => {
        window.setTimeout(() => {
            nv.trigger('change');
        }, 0);
    });

    self.dashboardClick = (data, event) => {
        console.log('dashboardClick', data);

        if (self.selectedPod() == null || (self.selectedPod().PodHandle != data.PodHandle)) {
            self.selectedPod(data);
        } else {
            self.selectedPod(undefined);
        }

        self.gridParams.widget().dataSource.query({
            page: self.gridParams.widget().dataSource.page() ?? 1,
            pageSize: self.gridParams.widget().dataSource.pageSize() ?? 0
        })
    };

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

                let data = self.filters.getStatementParameters();

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

    self.fetchDebtBreakdown = (data, event) => {
        self.busy(true);

        console.log('fetchDebtBreakdown calling with', data);

        fetch("/api/CreditControlAPI/FetchDebtBreakdown", {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(result => {
                console.log('fetchDebtBreakdown returned', result);
                self.debtBreakdown(creditControlDebtBreakdownViewModel({
                    callee: data,
                    rec: result
                }));

                self.busy(false);

                self.debtBreakdownModal.show();
            })
    }

    self.fetchOrdersBreakdown = (data, event) => {
        self.busy(true);

        console.log('fetchOrdersBreakdown calling with', data);

        fetch("/api/CreditControlAPI/FetchOrdersBreakdown", {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(result => {
                console.log('fetchOrdersBreakdown returned', result);
                self.ordersBreakdown(creditControlOrdersBreakdownViewModel({
                    callee: data,
                    rec: result
                }));

                self.busy(false);

                self.ordersBreakdownModal.show();
            })
    }

    self.fetchClaimsBreakdown = (data, event) => {
        self.busy(true);

        console.log('fetchClaimsBreakdown calling with', data);

        fetch("/api/CreditControlAPI/FetchClaimsBreakdown", {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(result => {
                console.log('fetchClaimsBreakdown returned', result);
                self.claimsBreakdown(creditControlClaimsBreakdownViewModel({
                    callee: data,
                    rec: result
                }));

                self.busy(false);

                self.claimsBreakdownModal.show();
            })
    }

    self.fetchOtherBreakdown = (data, event) => {
        self.busy(true);

        console.log('fetchOtherBreakdown calling with', data);

        fetch("/api/CreditControlAPI/FetchOtherBreakdown", {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(result => {
                console.log('fetchOtherBreakdown returned', result);
                self.otherBreakdown(creditControlOtherBreakdownViewModel({
                    callee: data,
                    rec: result
                }));

                self.busy(false);

                self.otherBreakdownModal.show();
            })
    }

    self.fetchSalesBreakdown = (data, event) => {
        self.busy(true);

        console.log('fetchSalesBreakdown calling with', data);

        fetch("/api/CreditControlAPI/FetchSalesBreakdown", {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(result => {
                console.log('fetchSalesBreakdown returned', result);
                self.salesBreakdown(creditControlSalesBreakdownViewModel({
                    callee: data,
                    rec: result
                }));

                self.busy(false);

                self.salesBreakdownModal.show();
            })
    }

    self.exportToExcel = () => {
        self.gridWidget() && self.gridWidget().saveAsExcel();
    }

    //#endregion

    //#region Events

    self.debtBreakdownModalElement.addEventListener('bs.modal.hidden', () => {
        self.debtBreakdown(undefined);
    });

    self.ordersBreakdownModalElement.addEventListener('bs.modal.hidden', () => {
        self.ordersBreakdown(undefined);
    });

    //#endregion

    return self;
});