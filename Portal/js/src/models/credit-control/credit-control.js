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
    DISPLAY_MODE_VALUE = 2,
    DISPLAY_MODE_ADVERTISING = 3,
    DISPLAY_MODE_PRODUCT = 4;


const creditControlViewModel = (() => {
    let self = {};

    //#region Properties

    self.busy = ko.observable(true);

    self.busy.subscribe(nv => {
        console.log('viewModel.busy', nv);
    });

    self.busyMessage = ko.observable('Please wait...');

    self.heldOrdersGridBusy = ko.observable(true);

    self.validateNow = ko.observable(false);

    self.refresh = () => {
        console.log('creditControlViewModel refresh called');

        self.gridWidget().dataSource.query({
            page: self.gridWidget().dataSource.page(),
            pageSize: self.gridWidget().dataSource.pageSize(),
            filter: self.gridWidget().dataSource.filter(),
            sort: self.gridWidget().dataSource.sort(),
            group: self.gridWidget().dataSource.group()
        }); 
    }

    self.selectedPod = ko.observable();

    self.clearSelectedPod = () => {
        self.selectedPod(undefined);
        self.refresh();
    }

    self.filters = creditControlFiltersViewModel({
        params: window.getPredefinedFilterParams(),
        parent: self
    });

    self.allSortingOperations = ko.observableArray([]);

    self.activeSortingOperation = ko.observable();

    self.sendResponse = ko.observable();

    self.performance = creditControlPerformanceViewModel();

    self.paymentsHistory = creditControlPaymentsHistoryViewModel({
        filters: self.filters
    });

    self.gridWidget = ko.observable();

    self.dashboardPods = ko.observableArray([]);

    self.tradeAccounts = ko.observableArray([]);

    self.tradeAccountContacts = tradeAccountContactsViewModel({});

    self.selectedTradeAccount = ko.observable();

    self.dashboardTab = document.querySelector('#dashboard-tab');

    self.dashboardCollapse = bootstrap.Collapse.getOrCreateInstance(self.dashboardTab);

    self.orderReleaseTab = document.querySelector('#order-release-tab');

    self.orderReleaseCollapse = bootstrap.Collapse.getOrCreateInstance(self.orderReleaseTab);

    self.statementsTab = document.querySelector('#statements-tab');

    self.statementsCollapse = bootstrap.Collapse.getOrCreateInstance(self.statementsTab);

    self.payOffInvoicesTab = document.querySelector('#paying-off-with-proforma-tab');

    self.payOffInvoicesCollapse = bootstrap.Collapse.getOrCreateInstance(self.payOffInvoicesTab);

    self.onlinePaymentHistoryTab = document.querySelector('#online-payment-history-tab');

    self.onlinePaymentHistoryCollapse = bootstrap.Collapse.getOrCreateInstance(self.onlinePaymentHistoryTab);

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

    self.gridTradeAccountIds = ko.observableArray([]);

    //#endregion

    //#region Lifted Methods

    self.toggleCreditStop = (tradeAccountSearchResult) => {
        self.busy(true);

        let data = {
            uniVerseAccount: tradeAccountSearchResult.UniVerseAccount,
            tradeAccountCode: tradeAccountSearchResult.TradeAccountCode,
            creditStopped: !tradeAccountSearchResult.CreditStop,
            memberId: 0, // this is overridden on the server
            reason: ko.unwrap(tradeAccountSearchResult.stopChangeReason)
        }

        console.log('calling toggleCreditStop with', data);

        document.querySelectorAll('[data-bind*="actualBootstrapPopover"]').forEach(e => {
            let p = bootstrap.Popover.getInstance(e);
            if (p) {
                p.hide();
            }
        });

        fetch('/api/CreditControlAPI/ToggleCreditStop', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                self.busy(false);
                tradeAccountSearchResult.onStop(!tradeAccountSearchResult.onStop());
                self.refresh();
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            });
    }

    self.generateAscendingSortingOperation = (parameterName) => {
        return {
            direction: "asc",
            propertyName: parameterName,
            sortingFunction: `${parameterName}_Asc`
        }
    }

    self.generateDescendingSortingOperation = (parameterName) => {
        return {
            direction: "desc",
            propertyName: parameterName,
            sortingFunction: `${parameterName}_Desc`
        }
    }

    self.generateSorting = (parameterName) => {
        return [
            self.generateAscendingSortingOperation(parameterName),
            self.generateDescendingSortingOperation(parameterName)
        ]
    }

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
                        document.querySelector('#info-modal')?.removeEventListener('hide.bs.modal', self.refresh);
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

                        self.gridTradeAccountIds(data.totalsRecord.TradeAccountIDsList);

                        //self.gridParams.widget().setOptions({
                        //    columns: self.gridColumns
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

    self.primaryFetchParams = ko.computed(() => {

        let mapped = {
            Page: 1,
            PageSize: 20
        };

        if (self.activeSortingOperation()) {
            mapped.SortOrder = self.activeSortingOperation();
        }

        let additionalParameters = self.filters.getData();

        let params = new URLSearchParams();

        if (self.selectedPod()) {
            additionalParameters.selectedPod = self.selectedPod().PodHandle;
        }

        let data = Object.assign(mapped, additionalParameters);

        for (var propertyName in data) {
            if (Array.isArray(data[propertyName])) {
                data[propertyName].forEach(v => {
                    params.append(propertyName, v);
                });
            } else {
                params.append(propertyName, data[propertyName]);
            }
        }

        // need to add the currently-sorted-by-column to an array here named Sorts thus:

        /*
            Sorts=Property_Direction&Property=Member_Direction[...]
        */

        return params.toString();
    }, self).extend({
        rateLimit: {
            timeout: 100,
            method: 'notifyWhenChangesStop'
        }
    });

    //#endregion


    //#region Components

    //self.virtualScrollerContainer = document.getElementById("credit-control-scroller-container");

    //self.virtualScoller =  virtualScrollingDeferredDataFactory({
    //    busy: self.busy,
    //    tableSelector: "#credit-control-main-table",
    //    rowHeight: 50,
    //    primaryFetchMethod: 'GET',
    //    primaryFetchParams: self.primaryFetchParams,
    //    primaryFetchEndpoint: "/api/creditcontrolapi/TradeAccountSearchEndless",
    //    primaryFetchResultSetName: "gridData",
    //    primaryFetchResultFn: (rec) => {
    //        return creditControlMainGridRow(rec);
    //    },
    //    container: self.virtualScrollerContainer,
    //    gridHeaderHeight: 57,
    //    gridPositionTop: 0,
    //    unfilledRecordFn: (rec) => {
    //        let self = Object.assign({}, rec);
    //        return self;
    //    },
    //    displayModes: self.filters.displayModes
    //});

    self.paymentHistory = creditControlPaymentsHistoryViewModel({
        busy: self.busy,
        filters: self.filters
    });

    self.outstandingInvoices = creditControlOutstandingInvoicesWithUnallocatedDepositsViewModel({
        busy: self.busy,
        filters: self.filters
    });

    self.memberBasketFetcher = memberBasketFetcher(self);

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

    self.gridColumns = [{
        field: 'CurrencyCode',
        title: 'Curr.',
        filterable: false,
        locked: true,
        width: gridColumnWidths.fifty
    }, {
        field: 'MarketName',
        title: 'Market',
        filterable: false,
        locked: true,
        width: gridColumnWidths.oneHundred,
        template: (dataItem) => {
            return `<span>${dataItem.MarketName}</span>`;
        }
    }, {
        field: 'TradeAccountCode',
        title: 'Code',
        filterable: false,
        locked: true,
        width: gridColumnWidths.ninety
    }, {
        field: 'TradeAccountName',
        title: 'Name',
        filterable: false,
        locked: true,
        width: gridColumnWidths.oneForty
    }, {
        field: 'Status',
        title: 'Status',
        filterable: false,
        locked: true,
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
        field: 'Advisory',
        title: 'Advisory',
        width: gridColumnWidths.twoHundred,
        filterable: {
            extra: false,
            defaultOperation: 'contains'
        },
        locked: true,
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
                return `<a href="#" class="grid-btn contacts-btn" data-bind="click: openContactsModal">
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
                    return `<a href="#" class="grid-btn statement-btn" data-bind="attr: { href: StatementURI, target: '_blank' }">
				<i class="bi bi-filetype-pdf"></i>
			</a>`;
                } else {
                    return ``;
                }
            }
        }, {
            field: 'CreditStop',
            title: 'Stopped',
            headerAttributes: {
                "class": "errata-subheading"
            },
            attributes: {
                "class": "text-center grid-btn-cell relative"
            },
            sortable: true,
            filterable: false,
            width: gridColumnWidths.ninetyTwo,
            template: (e) => {
                /* 
                
                data-bind="actualBootstrapPopover: { context: $data, details: bootstrapPopoverDetails }, click: () => { return true; }, clickBubble: false"
                
                */


                return `<a href="javascript:;" class="grid-btn stop-btn" data-bind="actualBootstrapPopover: { context: $data, details: popoverDetails }, click: () => { return true; }, clickBubble: false">
                    <i class="bi bi-octagon" data-bind="css: { 'bi-octagon': onStop() == false, 'bi-sign-stop-fill text-red-500': onStop() == true }"></i>
                    <i class="bi bi-octagon bi-octagon-red d-none" data-bind="flexFadeVisible: onStop() == true"></i>
                </a>`;
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
        title: 'Debt Breakdown',
        headerAttributes: {
            "class": "debt-breakdown-heading debt-breakdown"
        },
        columns: [{
            field: 'TotalValue',
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

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_ADVERTISING) > -1)
                    result.push(self.formatCurrency(e, 'TotalValue_Advertising'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_PRODUCT) > -1)
                    result.push(self.formatCurrency(e, 'TotalValue_Product'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_VALUE) > -1)
                    result.push(self.formatCurrency(e, 'TotalValue'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_QUANTITY) > -1)
                    result.push(self.formatNumber(e, 'TotalQuantity'));

                return result.join(SINGLE_BR);
            }
        }, {
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

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_ADVERTISING) > -1)
                    result.push(self.formatCurrency(e, 'TotalValue_Advertising'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_PRODUCT) > -1)
                    result.push(self.formatCurrency(e, 'TotalValue_Product'));

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
                "class": '#: (OverdueTotalValue > 0) ? "text-danger": "" # text-end debt-breakdown'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_ADVERTISING) > -1)
                    result.push(self.formatCurrency(e, 'OverdueTotalValue_Advertising'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_PRODUCT) > -1)
                    result.push(self.formatCurrency(e, 'OverdueTotalValue_Product'));

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
                "class": '#: (Debt30DayValue > 0 || Debt60DayValue > 0 || Debt90DayValue > 0 || Debt120DayValue > 0) ? "text-danger": "" # text-end debt-breakdown'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_ADVERTISING) > -1)
                    result.push(self.formatCurrency(e, 'Debt30DayValue_Advertising'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_PRODUCT) > -1)
                    result.push(self.formatCurrency(e, 'Debt30DayValue_Product'));

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
                "class": '#: (Debt60DayValue > 0 || Debt90DayValue > 0 || Debt120DayValue > 0) ? "text-danger": "" # text-end debt-breakdown'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_ADVERTISING) > -1)
                    result.push(self.formatCurrency(e, 'Debt60DayValue_Advertising'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_PRODUCT) > -1)
                    result.push(self.formatCurrency(e, 'Debt60DayValue_Product'));

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
                "class": '#: (Debt90DayValue > 0 || Debt120DayValue > 0) ? "text-danger": "" # text-end debt-breakdown'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_ADVERTISING) > -1)
                    result.push(self.formatCurrency(e, 'Debt90DayValue_Advertising'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_PRODUCT) > -1)
                    result.push(self.formatCurrency(e, 'Debt90DayValue_Product'));

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
                "class": '#: (Debt120DayValue > 0) ? "text-danger": "" # text-end debt-breakdown'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_ADVERTISING) > -1)
                    result.push(self.formatCurrency(e, 'Debt120DayValue_Advertising'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_PRODUCT) > -1)
                    result.push(self.formatCurrency(e, 'Debt120DayValue_Product'));

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
                "class": '#: DisputedValue > 0 ? "text-danger": "" # text-end debt-breakdown'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_ADVERTISING) > -1)
                    result.push(self.formatCurrency(e, 'DisputedValue_Advertising'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_PRODUCT) > -1)
                    result.push(self.formatCurrency(e, 'DisputedValue_Product'));

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
                "class": '#: WrittenOffValue > 0 ? "text-danger": "" # text-end debt-breakdown'
            },
            width: gridColumnWidths.oneForty,
            template: (e) => {

                let result = [];

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_ADVERTISING) > -1)
                    result.push(self.formatCurrency(e, 'WrittenOffValue_Advertising'));

                if (self.filters.displayModes().indexOf(DISPLAY_MODE_ADVERTISING) > -1)
                    result.push(self.formatCurrency(e, 'WrittenOffValue_Product'));

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

    if (Object.hasOwn(self, 'virtualScoller')) {
        self.gridColumns = self.gridColumns.map(gc => {
            if (Object.hasOwn(gc, 'columns')) {
                gc.columns = gc.columns.map(cc => creditControlMainGridColumn({ rec: cc }));
            }

            return creditControlMainGridColumn({ rec: gc });
        });

        let sortFunctions = [];

        self.gridColumns.forEach(cn => {
            cn.direction = ko.observable(undefined);
            sortFunctions.push(self.generateSorting(cn));
        });

        self.allSortingOperations(sortFunctions.flat());
    }

    self.memberBasketFetcher.heldOrdersGridParametersComputed.subscribe(nv => {
        self.memberBasketFetcher.refresh();
    });

    self.gridParams = {
        autoBind: true,
        widget: self.gridWidget,
        columns: self.gridColumns,
        data: new kendo.data.DataSource({
            transport: {
                read: self.gridDataSourceRead
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
                        UniVerseAccount: { type: 'string' },
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
                        TotalValue: { type: 'number' },
                        NotDueTotalValue: { type: 'number' },
                        OverdueTotalValue: { type: 'number' },
                        Debt30DayValue: { type: 'number' },
                        Debt60DayValue: { type: 'number' },
                        Debt90DayValue: { type: 'number' },
                        Debt120DayValue: { type: 'number' },
                        DisputedValue: { type: 'number' },
                        WrittenOffValue: { type: 'number' },
                        TotalQuantity: { type: 'number' },
                        NotDueTotalQuantity: { type: 'number' },
                        NotDueTotalQuantity: { type: 'number' },
                        OverdueTotalQuantity: { type: 'number' },
                        Debt30DayQuantity: { type: 'number' },
                        Debt60DayQuantity: { type: 'number' },
                        Debt90DayQuantity: { type: 'number' },
                        Debt120DayQuantity: { type: 'number' },
                        DisputedQuantity: { type: 'number' },
                        WrittenOffQuantity: { type: 'number' },
                        TotalValue_Advertising: { type: 'number' },
                        NotDueTotalValue_Advertising: { type: 'number' },
                        OverdueTotalValue_Advertising: { type: 'number' },
                        Debt30DayValue_Advertising: { type: 'number' },
                        Debt60DayValue_Advertising: { type: 'number' },
                        Debt90DayValue_Advertising: { type: 'number' },
                        Debt120DayValue_Advertising: { type: 'number' },
                        DisputedValue_Advertising: { type: 'number' },
                        WrittenOffValue_Advertising: { type: 'number' },
                        TotalValue_Product: { type: 'number' },
                        NotDueTotalValue_Product: { type: 'number' },
                        OverdueTotalValue_Product: { type: 'number' },
                        Debt30DayValue_Product: { type: 'number' },
                        Debt60DayValue_Product: { type: 'number' },
                        Debt90DayValue_Product: { type: 'number' },
                        Debt120DayValue_Product: { type: 'number' },
                        DisputedValue_Product: { type: 'number' },
                        WrittenOffValue_Product: { type: 'number' },
                        StatementURI: { type: 'string' },
                        StatementTotalValue: { type: 'number' },
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
        height: '800px',
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
            columns: self.gridColumns
        });
    }, self, 'arrayChange');

    self.filters.salesHistoryAnalysisPeriodId.subscribe(nv => {
        self.gridParams.widget().setOptions({
            columns: self.gridColumns
        });
    });

    self.filters.getData.subscribe(nv => {
        self.gridParams.widget().dataSource.query({
            page: 1,
            pageSize: (self.gridParams.widget() && self.gridParams.widget().dataSource.pageSize())
        });
    });

    self.filters.getCreditControlOrderReleaseParameters()

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

    self.sortByColumn = (detailColumn) => {
        self.gridColumns.forEach(c => {
            if (Object.hasOwn(c, 'columns')) {
                c.columns.forEach(d => {
                    d.direction(undefined);
                })
            } else {
                c.direction(undefined);
            }
        });

        let direction = detailColumn.direction();

        let newDirection = null;

        switch (direction) {
            case 'asc':
                newDirection = 'desc';
                break;
            case 'desc':
                newDirection = undefined;
                break;
            default:
                newDirection = 'asc';
                break;
        }

        detailColumn.direction(newDirection);

        let operation = self.allSortingOperations().find(s => s.propertyName == detailColumn.columnName && s.direction == newDirection);

        if (operation)
            self.activeSortingOperation(operation.sortingFunction);
        else
            self.activeSortingOperation(undefined);
    }

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
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            });
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

    self.dashboardTab.addEventListener('click', (event) => {
        self.refresh();
    });

    self.payOffInvoicesTab.addEventListener('click', (event) => {
        self.outstandingInvoices.refresh();
    });

    self.onlinePaymentHistoryTab.addEventListener('click', (event) => {
        self.paymentHistory.refresh();
    });

    self.performance.init();

    //#endregion

    return self;
});