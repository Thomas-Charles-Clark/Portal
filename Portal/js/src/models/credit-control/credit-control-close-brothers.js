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

    self.previousFromDate = ko.observable(self.filters.closeBrothersFromDate()?.toUTCString());

    self.previousToDate = ko.observable(self.filters.closeBrothersToDate()?.toUTCString());

    self.gbpFormattingCulture = 'en-GB';

    self.gbpCurrencyCode = 'GBP';

    self.eurFormattingCulture = 'fr-FR';

    self.eurCurrencyCode = 'EUR';

    //#endregion



    //#region Methods

    //self.exportToExcel = () => {
    //    self.gridWidget() && self.gridWidget().saveAsExcel();
    //}

    self.refresh = () => {
        self.dataSource.read();
    }

    self.gridDataSourceRead = (options) => {

        self.busy(true);

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

                        self.records(data.gridData.Data);

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

    self.dataSource = new kendo.data.DataSource({
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
    })

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds

    self.grossLedger = ko.pureComputed(() => {
        let records = self.records();

        let combinedGbp = records.reduce((a, i) => a += i.OutstandingAmountGBP, 0),
            onlyGbp = records.reduce((a, i) => a += i.OutstandingAmountOnlyGBP, 0),
            onlyEur = records.reduce((a, i) => a += i.OutstandingAmountOnlyEUR, 0);

        return {
            combinedGbp,
            combinedGbpFormatted: formatCurrency(combinedGbp, 0, self.gbpFormattingCulture, self.gbpCurrencyCode),
            onlyGbp,
            onlyGbpFormatted: formatCurrency(onlyGbp, 0, self.gbpFormattingCulture, self.gbpCurrencyCode),
            onlyEur,
            onlyEurFormatted: formatCurrency(onlyEur, 0, self.eurFormattingCulture, self.eurCurrencyCode)
        }
    }, self);

    self.dgExclusions = ko.pureComputed(() => {
        let fnfexgroups = Object.groupBy(self.records().filter(r => r.FirstNotFundedExplanationGroup == "DG Exclusion"), (i) => i.FirstNotFundedExplanationGroup);

        let results = [];

        Object.keys(fnfexgroups).forEach(i => {
            let fnfexgroup = fnfexgroups[i];

            let fnfex = Object.groupBy(fnfexgroup, (j) => j.FirstNotFundedExplanation);

            let items = [];

            Object.keys(fnfex).forEach(k => {

                let records = fnfex[k];

                let combinedGbp = records.reduce((a, i) => a += i.OutstandingAmountGBP, 0),
                    onlyGbp = records.reduce((a, i) => a += i.OutstandingAmountOnlyGBP, 0),
                    onlyEur = records.reduce((a, i) => a += i.OutstandingAmountOnlyEUR, 0);

                items.push({
                    label: k == "null" ? "Other" : k,
                    combinedGbp,
                    combinedGbpFormatted: formatCurrency(combinedGbp, 0, self.gbpFormattingCulture, self.gbpCurrencyCode),
                    onlyGbp,
                    onlyGbpFormatted: formatCurrency(onlyGbp, 0, self.gbpFormattingCulture, self.gbpCurrencyCode),
                    onlyEur,
                    onlyEurFormatted: formatCurrency(onlyEur, 0, self.eurFormattingCulture, self.eurCurrencyCode)
                });
            });

            let combinedGbp = items.reduce((a, i) => a += i.combinedGbp, 0),
                onlyGbp = items.reduce((a, i) => a += i.onlyGbp, 0),
                onlyEur = items.reduce((a, i) => a += i.onlyEur, 0);

            results.push({
                label: i == "null" ? "Other" : i,
                combinedGbp,
                combinedGbpFormatted: formatCurrency(combinedGbp, 0, self.gbpFormattingCulture, self.gbpCurrencyCode),
                onlyGbp,
                onlyGbpFormatted: formatCurrency(onlyGbp, 0, self.gbpFormattingCulture, self.gbpCurrencyCode),
                onlyEur,
                onlyEurFormatted: formatCurrency(onlyEur, 0, self.eurFormattingCulture, self.eurCurrencyCode),
                items: items,
            });
        });

        return results.sort((a, b) => {
            return a.label > b.label ? -11 : 1
        });
    }, self);

    self.cbExclusions = ko.pureComputed(() => {
        let fnfexgroups = Object.groupBy(self.records().filter(r => r.FirstNotFundedExplanationGroup == "CB Exclusion"), (i) => i.FirstNotFundedExplanationGroup);

        let results = [];

        Object.keys(fnfexgroups).forEach(i => {

            let fnfexgroup = fnfexgroups[i];

            let fnfex = Object.groupBy(fnfexgroup, (j) => j.FirstNotFundedExplanation);

            let items = [];

            Object.keys(fnfex).forEach(k => {

                let records = fnfex[k];

                let combinedGbp = records.reduce((a, i) => a += i.OutstandingAmountGBP, 0),
                    onlyGbp = records.reduce((a, i) => a += i.OutstandingAmountOnlyGBP, 0),
                    onlyEur = records.reduce((a, i) => a += i.OutstandingAmountOnlyEUR, 0);

                items.push({
                    label: k == "null" ? "Other" : k,
                    combinedGbp,
                    combinedGbpFormatted: formatCurrency(combinedGbp, 0, self.gbpFormattingCulture, self.gbpCurrencyCode),
                    onlyGbp,
                    onlyGbpFormatted: formatCurrency(onlyGbp, 0, self.gbpFormattingCulture, self.gbpCurrencyCode),
                    onlyEur,
                    onlyEurFormatted: formatCurrency(onlyEur, 0, self.eurFormattingCulture, self.eurCurrencyCode)
                });
            });

            let combinedGbp = items.reduce((a, i) => a += i.combinedGbp, 0),
                onlyGbp = items.reduce((a, i) => a += i.onlyGbp, 0),
                onlyEur = items.reduce((a, i) => a += i.onlyEur, 0);

            results.push({
                label: i == "null" ? "Other" : i,
                combinedGbp,
                combinedGbpFormatted: formatCurrency(combinedGbp, 0, self.gbpFormattingCulture, self.gbpCurrencyCode),
                onlyGbp,
                onlyGbpFormatted: formatCurrency(onlyGbp, 0, self.gbpFormattingCulture, self.gbpCurrencyCode),
                onlyEur,
                onlyEurFormatted: formatCurrency(onlyEur, 0, self.eurFormattingCulture, self.eurCurrencyCode),
                items: items,
            });
        });

        return results.sort((a, b) => {
            return a.label > b.label ? 1 : -1
        });
    }, self);

    self.reserves = ko.pureComputed(() => {
        let reservedGroups = Object.groupBy(self.records().filter(x => x.Reserved == "Reserved"), (i) => i.Reserved);

        let results = [];

        Object.keys(reservedGroups).forEach(i => {

            let reservedGroup = reservedGroups[i];

            let funderGroups = Object.groupBy(reservedGroup, (j) => j.Funder);

            let items = [];

            Object.keys(funderGroups).forEach(k => {

                let funderGroup = funderGroups[k];

                let explanations = Object.groupBy(funderGroup, (l) => l.FirstReservedExplanation);

                let combinedGbp = funderGroup.reduce((a, i) => a += i.OutstandingAmountGBP, 0),
                    onlyGbp = funderGroup.reduce((a, i) => a += i.OutstandingAmountOnlyGBP, 0),
                    onlyEur = funderGroup.reduce((a, i) => a += i.OutstandingAmountOnlyEUR, 0);

                let moreItems = [];

                Object.keys(explanations).forEach(m => {
                    
                    let explanation = explanations[m];

                    let combinedGbp = explanation.reduce((a, i) => a += i.OutstandingAmountGBP, 0),
                        onlyGbp = explanation.reduce((a, i) => a += i.OutstandingAmountOnlyGBP, 0),
                        onlyEur = explanation.reduce((a, i) => a += i.OutstandingAmountOnlyEUR, 0);

                    moreItems.push({
                        label: m == "null" ? "Other" : m,
                        combinedGbp,
                        combinedGbpFormatted: formatCurrency(combinedGbp, 0, self.gbpFormattingCulture, self.gbpCurrencyCode),
                        onlyGbp,
                        onlyGbpFormatted: formatCurrency(onlyGbp, 0, self.gbpFormattingCulture, self.gbpCurrencyCode),
                        onlyEur,
                        onlyEurFormatted: formatCurrency(onlyEur, 0, self.eurFormattingCulture, self.eurCurrencyCode)
                    });
                });

                items.push({
                    label: k == "null" ? "Other" : k,
                    combinedGbp,
                    combinedGbpFormatted: formatCurrency(combinedGbp, 0, self.gbpFormattingCulture, self.gbpCurrencyCode),
                    onlyGbp,
                    onlyGbpFormatted: formatCurrency(onlyGbp, 0, self.gbpFormattingCulture, self.gbpCurrencyCode),
                    onlyEur,
                    onlyEurFormatted: formatCurrency(onlyEur, 0, self.eurFormattingCulture, self.eurCurrencyCode),
                    explanations: moreItems
                })
            });

            let combinedGbp = items.reduce((a, i) => a += i.combinedGbp, 0),
                onlyGbp = items.reduce((a, i) => a += i.onlyGbp, 0),
                onlyEur = items.reduce((a, i) => a += i.onlyEur, 0);

            results.push({
                label: i == "null" ? "Other" : i,
                combinedGbp,
                combinedGbpFormatted: formatCurrency(combinedGbp, 0, self.gbpFormattingCulture, self.gbpCurrencyCode),
                onlyGbp,
                onlyGbpFormatted: formatCurrency(onlyGbp, 0, self.gbpFormattingCulture, self.gbpCurrencyCode),
                onlyEur,
                onlyEurFormatted: formatCurrency(onlyEur, 0, self.eurFormattingCulture, self.eurCurrencyCode),
                funders: items,
            });
        });

        return results.sort((a, b) => {
            return a.label > b.label ? 1 : -1
        });
    }, self);

    self.netLedgers = ko.pureComputed(() => {
        let reservedGroups = Object.groupBy(self.records().filter(x => x.Reserved == "Fundable"), (i) => i.Reserved);

        let results = [];

        Object.keys(reservedGroups).forEach(i => {

            let reservedGroup = reservedGroups[i];

            let funderGroups = Object.groupBy(reservedGroup, (j) => j.Funder);

            let items = [];

            Object.keys(funderGroups).forEach(k => {

                let funderGroup = funderGroups[k];

                let tradeAccountTypes = Object.groupBy(funderGroup, (l) => l.TradeAccountType);

                let combinedGbp = funderGroup.reduce((a, i) => a += i.OutstandingAmountGBP, 0),
                    onlyGbp = funderGroup.reduce((a, i) => a += i.OutstandingAmountOnlyGBP, 0),
                    onlyEur = funderGroup.reduce((a, i) => a += i.OutstandingAmountOnlyEUR, 0);

                let moreItems = [];

                Object.keys(tradeAccountTypes).forEach(m => {

                    let tradeAccountType = tradeAccountTypes[m];

                    let combinedGbp = tradeAccountType.reduce((a, i) => a += i.OutstandingAmountGBP, 0),
                        onlyGbp = tradeAccountType.reduce((a, i) => a += i.OutstandingAmountOnlyGBP, 0),
                        onlyEur = tradeAccountType.reduce((a, i) => a += i.OutstandingAmountOnlyEUR, 0);

                    moreItems.push({
                        label: m == "null" ? "Other" : m,
                        combinedGbp,
                        combinedGbpFormatted: formatCurrency(combinedGbp, 0, self.gbpFormattingCulture, self.gbpCurrencyCode),
                        onlyGbp,
                        onlyGbpFormatted: formatCurrency(onlyGbp, 0, self.gbpFormattingCulture, self.gbpCurrencyCode),
                        onlyEur,
                        onlyEurFormatted: formatCurrency(onlyEur, 0, self.eurFormattingCulture, self.eurCurrencyCode)
                    });
                });

                items.push({
                    label: k == "null" ? "Other" : k,
                    combinedGbp,
                    combinedGbpFormatted: formatCurrency(combinedGbp, 0, self.gbpFormattingCulture, self.gbpCurrencyCode),
                    onlyGbp,
                    onlyGbpFormatted: formatCurrency(onlyGbp, 0, self.gbpFormattingCulture, self.gbpCurrencyCode),
                    onlyEur,
                    onlyEurFormatted: formatCurrency(onlyEur, 0, self.eurFormattingCulture, self.eurCurrencyCode),
                    tradeAccountTypes: moreItems
                })
            });

            let combinedGbp = items.reduce((a, i) => a += i.combinedGbp, 0),
                onlyGbp = items.reduce((a, i) => a += i.onlyGbp, 0),
                onlyEur = items.reduce((a, i) => a += i.onlyEur, 0);

            results.push({
                label: i == "null" ? "Other" : i,
                combinedGbp,
                combinedGbpFormatted: formatCurrency(combinedGbp, 0, self.gbpFormattingCulture, self.gbpCurrencyCode),
                onlyGbp,
                onlyGbpFormatted: formatCurrency(onlyGbp, 0, self.gbpFormattingCulture, self.gbpCurrencyCode),
                onlyEur,
                onlyEurFormatted: formatCurrency(onlyEur, 0, self.eurFormattingCulture, self.eurCurrencyCode),
                funders: items,
            });
        });

        return results.sort((a, b) => {
            return a.label > b.label ? 1 : -1
        });
    }, self);

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