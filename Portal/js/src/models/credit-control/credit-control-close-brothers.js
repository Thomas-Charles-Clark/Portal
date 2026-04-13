const creditControlCloseBrothersViewModel = ({
    filters
} = {
        filters: {}
    }) => {
    let self = {
        filters
    };

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable('Please Wait<br/>This query can take up to 2 minutes to complete...');

    self.gridWidget = ko.observable()

    self.records = ko.observableArray([]);

    self.selectedPod = ko.observable();

    self.gridColumns = [{
        title: 'Top-Level Decisions',
        columns: [{
            field: "Fundable",
            title: "Fundable",
            width: 160,
            attributes: {
                "class": "fundable-cell",
            },
            headerAttributes: {
                "class": "fundable-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "Funder",
            title: "Funder",
            width: 160,
            attributes: {
                "class": "funder-cell",
            },
            headerAttributes: {
                "class": "funder-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "Reserved",
            title: "Reserved",
            width: 160,
            attributes: {
                "class": "reserved-cell",
            },
            headerAttributes: {
                "class": "reserved-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "DebtAgeBracket",
            title: "Debt Age Bracket",
            width: 160,
            attributes: {
                "class": "debt-age-bracket-cell",
            },
            headerAttributes: {
                "class": "debt-age-bracket-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "DebtAgeExclusion",
            title: "Debt Age Exclusion",
            width: 160,
            attributes: {
                "class": "debt-age-exclusion-cell",
            },
            headerAttributes: {
                "class": "debt-age-exclusion-header"
            },
            filterable: {
                extra: false
            },
        },]
    }, {
        title: 'Transaction Details',
        columns: [{
            field: "TransactionType",
            title: "Transaction Type",
            width: 160,
            attributes: {
                "class": "transaction-type-cell",
            },
            headerAttributes: {
                "class": "transaction-type-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "TransactionID",
            title: "Transaction ID",
            width: 160,
            attributes: {
                "class": "transaction-id-cell",
            },
            headerAttributes: {
                "class": "transaction-id-header"
            },
            filterable: {
                extra: false
            },
        }]
    }, {
        title: 'Document Details',
        columns: [{
            field: "DocumentIssueDate",
            title: "Document Issue Date",
            width: 160,
            attributes: {
                "class": "document-issue-date-cell",
            },
            headerAttributes: {
                "class": "document-issue-date-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "DocumentDueDate",
            title: "Document Due Date",
            width: 160,
            attributes: {
                "class": "document-due-date-cell",
            },
            headerAttributes: {
                "class": "document-due-date-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "TransactionCurrency",
            title: "Transaction Currency",
            width: 160,
            attributes: {
                "class": "transaction-currency-cell",
            },
            headerAttributes: {
                "class": "transaction-currency-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "OriginalValueCUR",
            title: "Original Value in Currency",
            width: 160,
            attributes: {
                "class": "original-value-currency",
            },
            headerAttributes: {
                "class": "original-value-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "OriginalValueGBP",
            title: "Original Value GBP",
            width: 160,
            attributes: {
                "class": "original-value-gbp-cell",
            },
            headerAttributes: {
                "class": "original-value-gbp-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "OutstandingAmountCUR",
            title: "Outstanding Amount in Currency",
            width: 160,
            attributes: {
                "class": "outstanding-amount-currency-cell",
            },
            headerAttributes: {
                "class": "outstanding-amount-currency-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "OutstandingAmountGBP",
            title: "Outstanding Amount in GBP",
            width: 160,
            attributes: {
                "class": "outstanding-amount-gbp-cell",
            },
            headerAttributes: {
                "class": "outstanding-amount-gbp-header"
            },
            filterable: {
                extra: false
            },
        }]
    }, {
        title: "Trade Account",
        columns: [{
            field: "TradeAccountDebtGroup",
            title: "Debt Group",
            width: 160,
            attributes: {
                "class": "trade-account-debt-group-cell",
            },
            headerAttributes: {
                "class": "trade-account-debt-group-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "HoldingAccountCode",
            title: "Holding Account Code",
            width: 160,
            attributes: {
                "class": "holding-account-code-cell",
            },
            headerAttributes: {
                "class": "holding-account-code-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "TradeAccountType",
            title: "Type",
            width: 160,
            attributes: {
                "class": "trade-account-type-cell",
            },
            headerAttributes: {
                "class": "trade-account-type-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "TradeAccountCode",
            title: "Code",
            width: 160,
            attributes: {
                "class": "trade-account-code-cell",
            },
            headerAttributes: {
                "class": "trade-account-code-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "TradeAccountName",
            title: "Name",
            width: 160,
            attributes: {
                "class": "trade-account-name-cell",
            },
            headerAttributes: {
                "class": "trade-account-name-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "AggregatedTradeAccountInsuredCreditLimitGBP",
            title: "Aggregated Insured Credit Limit GBP",
            width: 160,
            attributes: {
                "class": "aggregated-insured-credit-limit-cell",
            },
            headerAttributes: {
                "class": "aggregated-insured-credit-limit-header"
            },
            filterable: {
                extra: false
            },
        }]
    }, {
        title: "Decision Explanations",
        columns: [{
            field: "NotFundedExplanation",
            title: "Not Funded Explanation",
            width: 160,
            attributes: {
                "class": "not-funded-explanation-cell",
            },
            headerAttributes: {
                "class": "not-funded-explanation-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "FirstNotFundedExplanation",
            title: "First Not Funded Explanation",
            width: 160,
            attributes: {
                "class": "first-not-funded-explanation-cell",
            },
            headerAttributes: {
                "class": "first-not-funded-explanation-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "NotFundedExplanationGroup",
            title: "Not Funded Explanation Group",
            width: 160,
            attributes: {
                "class": "not-funded-explanation-group-cell",
            },
            headerAttributes: {
                "class": "not-funded-explanation-group-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "FirstNotFundedExplanationGroup",
            title: "First Not Funded Explanation Group",
            width: 160,
            attributes: {
                "class": "first-not-funded-explanation-group-cell",
            },
            headerAttributes: {
                "class": "first-not-funded-explanation-group-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "ReservedExplanation",
            title: "Reserved Explanation",
            width: 160,
            attributes: {
                "class": "reserved-explanation-cell",
            },
            headerAttributes: {
                "class": "reserved-explanation-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "FirstReservedExplanation",
            title: "First Reserved Explanation",
            width: 160,
            attributes: {
                "class": "first-reserved-explanation-cell",
            },
            headerAttributes: {
                "class": "first-reserved-explanation-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "ReservedExplanationGroup",
            title: "Reserved Explanation Group",
            width: 160,
            attributes: {
                "class": "reserved-explanation-group-cell",
            },
            headerAttributes: {
                "class": "reserved-explanation-group-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "FirstReservedExplanationGroup",
            title: "First Reserved Explanation Group",
            width: 160,
            attributes: {
                "class": "first-reserved-explanation-group-cell",
            },
            headerAttributes: {
                "class": "first-reserved-explanation-group-header"
            },
            filterable: {
                extra: false
            },
        }]
    }, {
        title: "Totals / Running Totals",
        columns: [{
            field: "LedgerTotal",
            title: "Ledger",
            width: 160,
            attributes: {
                "class": "ledger-total-cell",
            },
            headerAttributes: {
                "class": "ledger-total-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "ExportTotal",
            title: "Export Total",
            width: 160,
            attributes: {
                "class": "export-total-cell",
            },
            headerAttributes: {
                "class": "export-total-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "TradeAccountTotal",
            title: "Trade Account Total",
            width: 160,
            attributes: {
                "class": "trade-account-total-cell",
            },
            headerAttributes: {
                "class": "trade-account-total-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "TradeAccountDebtAgeExcludedTotal",
            title: "Trade Account Debt Age Excluded Total",
            width: 160,
            attributes: {
                "class": "trade-account-debt-age-excluded-total-cell",
            },
            headerAttributes: {
                "class": "trade-account-debt-age-excluded-total-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "TradeAccountRunningTotal",
            title: "Trade Account Running Total",
            width: 160,
            attributes: {
                "class": "trade-account-running-total-cell",
            },
            headerAttributes: {
                "class": "trade-account-running-total-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "ExportRunningTotal",
            title: "Export Running Total",
            width: 160,
            attributes: {
                "class": "export-running-total-cell",
            },
            headerAttributes: {
                "class": "export-running-total-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "CountryRunningTotal",
            title: "Country Running Total",
            width: 160,
            attributes: {
                "class": "country-running-total-cell",
            },
            headerAttributes: {
                "class": "country-running-total-header"
            },
            filterable: {
                extra: false
            },
        }]
    }, {
        title: 'Funding Decision Parameters',
        columns: [{
            field: "FD_TradeAccountCode",
            title: "Trade Account Code",
            width: 160,
            attributes: {
                "class": "fd-trade-account-code-cell",
            },
            headerAttributes: {
                "class": "fd-trade-account-code-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "FD_TradeAccountGroupCode",
            title: "Trade Account Group Code",
            width: 160,
            attributes: {
                "class": "fd-trade-account-group-code-cell",
            },
            headerAttributes: {
                "class": "fd-trade-account-group-code-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "FD_TradeAccountTypeCode",
            title: "Trade Account Type Code",
            width: 160,
            attributes: {
                "class": "fd-trade-account-type-code-cell",
            },
            headerAttributes: {
                "class": "fd-trade-account-type-code-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "FD_TradeAccountCurrency",
            title: "Trade Account Currency",
            width: 160,
            attributes: {
                "class": "fd-trade-account-currency-cell",
            },
            headerAttributes: {
                "class": "fd-trade-account-currency-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "FD_TradeAccountPaymentTermsCode",
            title: "Trade Account Payment Terms Code",
            width: 160,
            attributes: {
                "class": "fd-trade-account-payment-terms-code-cell",
            },
            headerAttributes: {
                "class": "fd-trade-account-payment-terms-code-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "FD_TradeAccountMarketCode",
            title: "Trade Account Market Code",
            width: 160,
            attributes: {
                "class": "fd-trade-account-market-code-cell",
            },
            headerAttributes: {
                "class": "fd-trade-account-market-code-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "FD_InvoiceAddressCountryCode",
            title: "Invoice Address Country Code",
            width: 160,
            attributes: {
                "class": "fd-invoice-address-country-code-cell",
            },
            headerAttributes: {
                "class": "fd-invoice-address-country-code-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "FD_EUMember",
            title: "EU Member",
            width: 160,
            attributes: {
                "class": "fd-eu-member-cell",
            },
            headerAttributes: {
                "class": "fd-eu-member-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "FD_OECDMember",
            title: "OECD Member",
            width: 160,
            attributes: {
                "class": "fd-oecd-member-cell",
            },
            headerAttributes: {
                "class": "fd-oecd-member-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "FD_OriginalValueGBP",
            title: "Original Value GBP",
            width: 160,
            attributes: {
                "class": "fd-original-value-gbp-cell",
            },
            headerAttributes: {
                "class": "fd-original-value-gbp-header"
            },
            filterable: {
                extra: false
            },
        }]
    }, {
        title: 'Reserve Decision Parameters',
        columns: [{
            field: "RD_DebtFunderCode",
            title: "Debt Funder Code",
            width: 160,
            attributes: {
                "class": "rd-debt-funder-code-cell",
            },
            headerAttributes: {
                "class": "rd-debt-funder-code-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "RD_TradeAccountCurrency",
            title: "Trade Account Currency",
            width: 160,
            attributes: {
                "class": "rd-trade-account-currency-cell",
            },
            headerAttributes: {
                "class": "rd-trade-account-currency-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "RD_AggregatedTradeAccountInsuredCreditLimitGBP",
            title: "Aggregated Trade Account Insured Credit Limit GBP",
            width: 160,
            attributes: {
                "class": "rd-aggregated-trade-account-insured-credit-limit-gbp-cell",
            },
            headerAttributes: {
                "class": "rd-aggregated-trade-account-insured-credit-limit-gbp-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "RD_TradeAccountPaymentTermsCode",
            title: "Trade Account Payment Terms Code",
            width: 160,
            attributes: {
                "class": "rd-trade-account-payment-terms-code-cell",
            },
            headerAttributes: {
                "class": "rd-trade-account-payment-terms-code-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "RD_InvoiceAddressCountryCode",
            title: "Invoice Address Country Code",
            width: 160,
            attributes: {
                "class": "rd-invoice-address-country-code-cell",
            },
            headerAttributes: {
                "class": "rd-invoice-address-country-code-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "RD_DocumentPaymentTermsCode",
            title: "Document Payment Terms Code",
            width: 160,
            attributes: {
                "class": "rd-document-payment-terms-code-cell",
            },
            headerAttributes: {
                "class": "rd-document-payment-terms-code-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "RD_EndOfMonthAgedDebtInDays",
            title: "End of Month Aged Debt in Days",
            width: 160,
            attributes: {
                "class": "rd-end-of-month-aged-debt-in-days-cell",
            },
            headerAttributes: {
                "class": "rd-end-of-month-aged-debt-in-days-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "RD_OriginalValueGBP",
            title: "Original Value GBP",
            width: 160,
            attributes: {
                "class": "rd-original-value-gbp-cell",
            },
            headerAttributes: {
                "class": "rd-original-value-gbp-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "RD_OutstandingAmountGBP",
            title: "Outstanding Amount GBP",
            width: 160,
            attributes: {
                "class": "rd-outstanding-amount-gbp-cell",
            },
            headerAttributes: {
                "class": "rd-outstanding-amount-gbp-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "RD_IsAdvertising",
            title: "Is Advertising",
            width: 160,
            attributes: {
                "class": "rd-is-advertising-cell",
            },
            headerAttributes: {
                "class": "rd-is-advertising-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "RD_IsExport",
            title: "Is Export",
            width: 160,
            attributes: {
                "class": "rd-is-export-cell",
            },
            headerAttributes: {
                "class": "rd-is-export-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "RD_TradeRegion",
            title: "Trade Region",
            width: 160,
            attributes: {
                "class": "rd-trade-region-cell",
            },
            headerAttributes: {
                "class": "rd-trade-region-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "RD_TradeAccountRunningTotalGBP",
            title: "Trade Account Running Total GBP",
            width: 160,
            attributes: {
                "class": "rd-trade-account-running-total-gbp-cell",
            },
            headerAttributes: {
                "class": "rd-trade-account-running-total-gbp-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "RD_ExportRunningTotalGBP",
            title: "Export Running Total GBP",
            width: 160,
            attributes: {
                "class": "rd-export-running-total-gbp-cell",
            },
            headerAttributes: {
                "class": "rd-export-running-total-gbp-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "RD_CountryRunningTotalGBP",
            title: "Country Running Total GBP",
            width: 160,
            attributes: {
                "class": "rd-country-running-total-gbp-cell",
            },
            headerAttributes: {
                "class": "rd-country-running-total-gbp-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "RD_LedgerTotalGBP",
            title: "Ledger Total GBP",
            width: 160,
            attributes: {
                "class": "rd-ledger-total-gbp-cell",
            },
            headerAttributes: {
                "class": "rd-ledger-total-gbp-header"
            },
            filterable: {
                extra: false
            },
        }]
    }, {
        title: 'Presentation Fields',
        columns: [{
            field: "OutstandingAmountOnlyGBP",
            title: "Outstanding Amount Only GBP",
            width: 160,
            attributes: {
                "class": "outstanding-amount-only-gbp-cell",
            },
            headerAttributes: {
                "class": "outstanding-amount-only-gbp-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "OutstandingAmountOnlyEUR",
            title: "Outstanding Amount Only EUR",
            width: 160,
            attributes: {
                "class": "outstanding-amount-only-eur-cell",
            },
            headerAttributes: {
                "class": "outstanding-amount-only-eur-header"
            },
            filterable: {
                extra: false
            },
        }]
    }, {
        title: 'Other',
        columns: [{
            field: "LedgerDataSource",
            title: "Ledger Data Source",
            width: 160,
            attributes: {
                "class": "ledger-data-source-cell",
            },
            headerAttributes: {
                "class": "ledger-data-source-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "FundableBoolean",
            title: "Fundable Boolean",
            width: 160,
            attributes: {
                "class": "fundable-boolean-cell",
            },
            headerAttributes: {
                "class": "fundable-boolean-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "ReservedBoolean",
            title: "Reserved Boolean",
            width: 160,
            attributes: {
                "class": "reserved-boolean-cell",
            },
            headerAttributes: {
                "class": "reserved-boolean-header"
            },
            filterable: {
                extra: false
            },
        }, {
            field: "TransactionTypeCode",
            title: "Transaction Type Code",
            width: 160,
            attributes: {
                "class": "transaction-type-code-cell",
            },
            headerAttributes: {
                "class": "transaction-type-code-header"
            },
            filterable: {
                extra: false
            },
        }]
    }, {
        title: 'Close Brothers Additional Fields',
        columns: [{
            field: "VATCodesAndRates",
            title: "VAT Codes and Rates",
            width: 160,
            attributes: {
                "class": "vat-codes-and-rates-cell",
            },
            headerAttributes: {
                "class": "vat-codes-and-rates-header"
            },
            filterable: {
                extra: false
            },
        }]
    }];

    self.previousFromDate = ko.observable(self.filters.closeBrothersFromDate()?.toUTCString());

    self.previousToDate = ko.observable(self.filters.closeBrothersToDate()?.toUTCString());

    //#endregion



    //#region Methods

    self.exportToExcel = () => {
        self.gridWidget() && self.gridWidget().saveAsExcel();
    }

    self.refresh = () => {
        if (self.gridWidget()) {
            self.gridWidget().dataSource.read();
            // must force a read here because all
            // the server-side paging, grouping, filtering &
            // sorting is disabled, so without a change to any of those properties the
            // grid doesn't believe that it needs to query!

            //    {
            //    page: self.gridWidget().dataSource.page(),
            //    pageSize: self.gridWidget().dataSource.pageSize(),
            //    group: self.gridWidget().dataSource.group(),
            //    filter: self.gridWidget().dataSource.filter(),
            //    aggregates: self.gridWidget().dataSource.aggregates()
            //})
        }
    }

    self.gridDataSourceRead = (options) => {
        var webapi = new kendo.data.transports.webapi({ prefix: "" });

        var mapped = webapi.parameterMap(options.data);

        var additionalParameters = self.filters.closeBrothersFilters();

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

        console.log('closeBrothers gridDataSourceRead calling with', data);

        self.busy(true);

        fetch('/api/creditcontrolapi/CloseBrothers_Fundability_Select?' + params, {
            method: 'GET',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin'
        })
            .then(window.handleFetchResponse)
            .then(data => {

                console.log('closeBrothers gridDataSourceRead returned', data);

                ko.ignoreDependencies(() => {

                    if (Object.hasOwn(data, 'errorMessage')) {

                        document.querySelector('#info-modal').addEventListener('hide.bs.modal', self.refresh);
                        options.success([]);
                        window.showInfo('Sorry', data.errorMessage);

                    } else {
                        document.querySelector('#info-modal')?.removeEventListener('hide.bs.modal', self.refresh);

                        //self.previouslySelectedDashboardPod = self.selectedPod()?.PodHandle;

                        //self.dashboardPods(data.dashboardPods.map(dp => creditControlDashboardPodViewModel({
                        //    rec: dp
                        //})));

                        //if (self.previouslySelectedDashboardPod) {
                        //    self.selectedPod(self.dashboardPods().find(dp => dp.PodHandle == self.previouslySelectedDashboardPod));
                        //}

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
            serverPaging: false,
            serverAggregates: false,
            serverSorting: false,
            pageSize: 50,
            pageable: {
                pageSize: 50,
                pageSizes: [10, 20, 50, 100, 250, 500, 'all']
            },
            schema: $.extend({}, kendo.data.schemas.webapi, {
                data: "Data",
                total: "Total",
                errors: "Errors",
                sorts: "Sorts",
                aggregates: "Aggregates",
                model: {
                    id: 'TransactionID',
                    fields: {
                        Fundable: { type: 'string' },
                        Funder: { type: 'string' },
                        Reserved: { type: 'string' },
                        DebtAgeBracket: { type: 'string' },
                        DebtAgeExclusion: { type: 'string' },
                        TransactionType: { type: 'string' },
                        TransactionID: { type: 'string' },
                        DocumentIssueDate: { type: 'number' },
                        DocumentDueDate: { type: 'number' },
                        TransactionCurrency: { type: 'number' },
                        OriginalValueCUR: { type: 'number' },
                        OriginalValueGBP: { type: 'number' },
                        OutstandingAmountCUR: { type: 'number' },
                        OutstandingAmountGBP: { type: 'string' },
                        TradeAccountDebtGroup: { type: 'date' },
                        HoldingAccountCode: { type: 'string' },
                        TradeAccountType: { type: 'number' },
                        TradeAccountCode: { type: 'number' },
                        TradeAccountName: { type: 'number' },
                        AggregatedTradeAccountInsuredCreditLimitGBP: { type: 'number' },
                        NotFundedExplanation: { type: 'string' },
                        FirstNotFundedExplanation: { type: 'string' },
                        NotFundedExplanationGroup: { type: 'string' },
                        FirstNotFundedExplanationGroup: { type: 'string' },
                        ReservedExplanation: { type: 'string' },
                        FirstReservedExplanation: { type: 'string' },
                        ReservedExplanationGroup: { type: 'string' },
                        FirstReservedExplanationGroup: { type: 'string' },
                        LedgerTotal: { type: 'number' },
                        ExportTotal: { type: 'number' },
                        TradeAccountTotal: { type: 'number' },
                        TradeAccountDebtAgeExcludedTotal: { type: 'number' },
                        TradeAccountRunningTotal: { type: 'number' },
                        ExportRunningTotal: { type: 'number' },
                        CountryRunningTotal: { type: 'number' },
                        FD_TradeAccountCode: { type: 'string' },
                        FD_TradeAccountGroupCode: { type: 'string' },
                        FD_TradeAccountTypeCode: { type: 'string' },
                        FD_TradeAccountCurrency: { type: 'string' },
                        FD_TradeAccountPaymentTermsCode: { type: 'string' },
                        FD_TradeAccountMarketCode: { type: 'string' },
                        FD_InvoiceAddressCountryCode: { type: 'string' },
                        FD_EUMember: { type: 'boolean' },
                        FD_OECDMember: { type: 'boolean' },
                        FD_OriginalValueGBP: { type: 'number' },
                        RD_DebtFunderCode: { type: 'number' },
                        RD_TradeAccountCurrency: { type: 'string' },
                        RD_AggregatedTradeAccountInsuredCreditLimitGBP: { type: 'number' },
                        RD_TradeAccountPaymentTermsCode: { type: 'string' },
                        RD_InvoiceAddressCountryCode: { type: 'string' },
                        RD_DocumentPaymentTermsCode: { type: 'string' },
                        RD_EndOfMonthAgedDebtInDays: { type: 'string' },
                        RD_OriginalValueGBP: { type: 'string' },
                        RD_OutstandingAmountGBP: { type: 'string' },
                        RD_IsAdvertising: { type: 'boolean' },
                        RD_IsExport: { type: 'boolean' },
                        RD_TradeRegion: { type: 'string' },
                        RD_TradeAccountRunningTotalGBP: { type: 'number' },
                        RD_ExportRunningTotalGBP: { type: 'number' },
                        RD_CountryRunningTotalGBP: { type: 'number' },
                        RD_LedgerTotalGBP: { type: 'number' },
                        OutstandingAmountOnlyGBP: { type: 'number' },
                        OutstandingAmountOnlyEUR: { type: 'number' },
                        LedgerDataSource: { type: 'string' },
                        FundableBoolean: { type: 'boolean' },
                        ReservedBoolean: { type: 'boolean' },
                        TransactionTypeCode: { type: 'string' },
                        VATCodesAndRates: { type: 'string' }
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
        height: 'calc(100vh - 200px)',
        noRecords: {
            template: () => `No Results.`
        },
        sortable: true,
        filterable: {
            extra: false,
            defaultOperation: 'contains'
        },
        reorderable: false,
        paging: true,
        pageSize: 50,
        pageable: {
            pageSize: 50,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        excel: {
            allPages: true
        },
        selectable: false,
        change: function (event) {
            console.log('closeBrothers gridParams change', event, event.sender.select());
        },
        filterMenuInit: (e) => {

        },
        dataBound: (e) => {
            console.log('closeBrothers gridParams dataBound', e);

            // we must always take note of what the date filters told  us for this read
            // because we need to know if they've changed in order to avoid an unnecessary
            // call to self.refresh when someone changes the dateRange to "Custom"
            self.previousFromDate(self.filters.closeBrothersFromDate()?.toUTCString());
            self.previousToDate(self.filters.closeBrothersToDate()?.toUTCString());

            //// <Thanks, Google AI>
            //let grid = e.sender;

            //// Use a timeout to ensure the grid has finished initial layout
            //window.setTimeout(function () {
            //    let wrapper = grid.wrapper;
            //    let lockedContent = wrapper.children(".k-grid-content-locked");
            //    let content = wrapper.children(".k-grid-content");

            //    // Reset heights to let them auto-expand to content
            //    wrapper.height("");
            //    lockedContent.height("");
            //    content.height("");

            //    // Synchronize the locked and unlocked content heights
            //    let maxContentHeight = Math.max(content.height(), lockedContent.height());
            //    content.height(maxContentHeight);
            //    lockedContent.height(maxContentHeight);

            //    // Set the final wrapper height based on the new content size
            //    wrapper.height(wrapper.height());

            //    // Notify the grid to recalculate its internal layout
            //    grid.resize();
            //}, 0);
            //// </Thanks>

            //ko.ignoreDependencies(() => {

            //    var pristine = e.sender.dataSource.data().toJSON();

            //    ko.utils.arrayForEach(e.sender.dataSource.data(), function (item, index) {

            //        let rows = document.querySelectorAll('tr[data-uid="' + item.uid + '"]');

            //        rows.forEach(row => {
            //            ko.cleanNode(row);

            //            pristine[index] = creditControlCloseBrothersRecordViewModel({
            //                rec: item
            //            });

            //            ko.applyBindings(pristine[index], row);
            //        });
            //    });
            //});
        }
    };

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds



    //#endregion



    //#region Subscriptions

    self.filters.closeBrothersFilters.subscribe(nv => {

        // if the date controls are valid
        if (self.filters.closeBrothersFromDate.isValid() &&
            self.filters.closeBrothersToDate.isValid() &&
            self.filters.closeBrothersFromPrecedesTo.isValid()) {

            // and their values don't match what they did previously
            if (nv.from != self.previousFromDate() || nv.to != self.previousToDate()) {

                // then refresh
                self.refresh();
            }
        }
    });

    //#endregion



    //#region Events

    

    //#endregion


    return self;
};