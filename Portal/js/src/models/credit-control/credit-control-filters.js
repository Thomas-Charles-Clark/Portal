const paymentHistoryPaymentStatuses = [{
    name: 'Completed',
    value: 'Completed'
}, {
    name: 'Pending',
    value: 'Pending'
}]

const creditControlFiltersViewModel = ({
    params,
    parent,
    prefix
} = {
    params: {},
    parent: {},
    prefix: ''
}) => {
    let self = {
        refreshParent: parent.refresh,
        selectedPod: parent.selectedPod,
        clearSelectedPod: parent.clearSelectedPod,
        prefix: prefix
    };

    //#region Properties

    let now = new Date();

    let tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    self.busy = parent.busy;

    self.validateNow = ko.observable(false);

    self.date = ko.observable().extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'Please specify a date'
        }
    }); // this is for Statement Sending only, and must be removed from the main filtering thingies

    self.includeClosedTradeAccounts = ko.observable(true);
    self.includeDeletedTradeAccounts = ko.observable(false);

    self.tradeAccountCode = ko.observable(params.tradeAccountCode ?? '');
    self.tradeAccount = ko.observable();

    self.statementsTradeAccountCode = ko.observable(params.statementsTradeAccountCode ?? '');
    self.statementsTradeAccount = ko.observable();

    self.salesHistoryAnalysisPeriodId = ko.observable(params.salesHistoryAnalysisPeriodId ?? 'L12M');
    self.salesHistoryAnalysisPeriod = ko.observable();
    self.salesHistoryAnalysisPeriodAwaitingBinding = ko.observable(params.salesHistoryAnalysisPeriodId != null && params.salesHistoryAnalysisPeriodId != '');

    self.currencyId = ko.observable(params.currencyId ?? '');
    self.currency = ko.observable();

    self.debtFunderCode = ko.observable(params.debtFunderCode ?? '');
    self.debtFunder = ko.observable();

    self.languageId = ko.observable(params.languageId ?? '');
    self.language = ko.observable();

    self.salesHistoryAnalysisPeriodCode = ko.observable(params.salesHistoryAnalysisPeriodCode ?? '');
    self.salesHistoryAnalysisPeriod = ko.observable();

    self.errors = ko.validation.group([
        self.date
    ]);

    self = Object.assign(tradeAccountContactsFiltersViewModel({
        params: Object.assign({
            prefix: self.prefix,
            tradeAccountStatusId: true,
            tradeAccountStatus: tradeAccountStatuses[0],
            creditController: window.getCreditControllerCode()
        }, params),
        parent: parent
    }), self);

    self.countDisplay = ko.observable(undefined);

    let displayModes = localStorage.getItem('displayModes', '[1,2]');

    displayModes = displayModes == null ? [DISPLAY_MODE_QUANTITY] : JSON.parse(displayModes);

    self.displayModes = ko.observableArray(displayModes);

    self.paymentHistoryDateRangeId = ko.observable('0');

    self.paymentHistoryDateRange = ko.observable(paymentHistoryDateRanges.find(d => d.dateRangeId == '30'));

    self.paymentHistoryDateRanges = paymentHistoryDateRanges;

    self.paymentHistoryTradeAccountCode = ko.observable('');

    self.paymentHistoryTradeAccount = ko.observable();

    self.paymentHistorySearchTerm = ko.observable();

    self.paymentHistoryFromDate = ko.observable();

    self.paymentHistoryToDate = ko.observable(now);

    self.validatePaymentHistorySearchNow = ko.observable(true);

    self.paymentHistoryFromDate.extend({
        date: {
            params: true,
            message: 'From must be a date'
        },
        required: {
            params: true,
            onlyIf: function () {
                return self.validatePaymentHistorySearchNow() && self.paymentHistoryDateRangeId() == -1 && self.paymentHistoryToDate() != null
            },
            message: 'Please provide a From Date'
        }
    });

    self.paymentHistoryFromDate.extend({
        date: {
            params: true,
            message: 'To must be a date'
        }
    });

    self.paymentHistoryToDate.extend({
        date: {
            params: true,
            message: 'To must be a date'
        }
    });

    self.paymentHistoryBankingAccountId = ko.observable(params?.paymentHistoryBankingAccountId ?? '');

    self.paymentHistoryBankingAccount = ko.observable(params?.paymentHistoryBankingAccount ?? undefined);

    self.paymentHistoryBankingCurrencyCode = ko.observable(params.paymentHistoryBankingCurrencyCode ?? '');

    self.paymentHistoryBankingCurrency = ko.observable(params?.paymentHistoryBankingCurrency ?? undefined);

    self.paymentHistoryPaymentStatusId = ko.observable(params?.paymentHistoryPaymentStatusId ?? '');

    self.paymentHistoryPaymentStatus = ko.observable(params?.paymentHistoryPaymentStatus ?? undefined);

    self.paymentHistoryPaymentStatuses = paymentHistoryPaymentStatuses;

    self.paymentHistoryCreditControllerId = ko.observable(params.creditController ?? '');

    self.paymentHistoryCreditController = ko.observable();

    self.paymentHistoryCreditControllerAwaitingBinding = ko.observable(params.creditController != null && params.creditController != '');

    self.allocateHoldingAccountCashSearchTerm = ko.observable();

    self.closeBrothersDateRangeId = ko.observable('0');

    self.closeBrothersDateRange = ko.observable(paymentHistoryDateRanges.find(d => d.dateRangeId == '30'));

    self.closeBrothersDateRanges = paymentHistoryDateRanges;

    self.closeBrothersFromDate = ko.observable(now);

    self.closeBrothersToDate = ko.observable(tomorrow);

    self.validateCloseBrothersSearchNow = ko.observable(true);

    self.closeBrothersFromDate.extend({
        date: {
            params: true,
            message: 'From must be a date'
        },
        required: {
            params: true,
            onlyIf: function () {
                return self.validateCloseBrothersSearchNow() && self.closeBrothersDateRangeId() == -1 && self.closeBrothersToDate() != null
            },
            message: 'Please provide a From Date'
        }
    });

    self.closeBrothersFromDate.extend({
        date: {
            params: true,
            message: 'To must be a date'
        }
    });

    self.closeBrothersToDate.extend({
        date: {
            params: true,
            message: 'To must be a date'
        }
    });

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

    self.includeClosedTradeAccountsParams = {
        checkboxId: `${self.prefix}include-closed-trade-accounts`,
        label: 'Include Closed?',
        observable: self.includeClosedTradeAccounts,
        useNativeValidation: false,
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false)
    }

    self.includeDeletedTradeAccountsParams = {
        checkboxId: `${self.prefix}include-deleted-trade-accounts`,
        label: 'Include Deleted?',
        observable: self.includeDeletedTradeAccounts,
        useNativeValidation: false,
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false)
    }

    self.tradeAccountParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Trade Account',
        odata: true,
        endPoint: () => `/odata/TradeAccounts_Live/Default.GetTradeAccountsForCreditControl(includeClosedAccounts=${ko.unwrap(self.includeClosedTradeAccounts)}, includeDeletedAccounts=${ko.unwrap(self.includeDeletedTradeAccounts)})`,
        textField: 'ShortLabel',
        valueField: 'Code',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/TradeAccounts_Live/Default.TradeAccountLiveValueMapper(tradeAccountCode='${options.value}')`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        template: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        valueTemplate: (e) => {
            if ((e.ShortLabel != '') && (e.Code != null))
                return `<span title="${e.ShortLabel}">Trade Account: ${e.ShortLabel}</span>`
            else
                return '';
        },
        idObservable: self.tradeAccountCode,
        objObservable: self.tradeAccount,
        locked: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: [{
            dir: 'asc',
            field: 'Code'
        }, {
            dir: 'asc',
            field: 'Name'
        }],
        select: function (e) {
            console.log('tradeAccountParams select', e);
        },
        requestStart: function (e) {

        },
        clearFunction: () => {
            self.tradeAccountCode('');
            self.tradeAccount(undefined);
            self.tradeAccountParams.dropDownListSettings.widget().value('');
            self.tradeAccountParams.dropDownListSettings.widget().trigger('change');
        },
        parameterMap: (data) => {
        
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            let filters = [];

            if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "ShortLabel")) {
                let f = data.filter.filters.find(f => f.field === "ShortLabel");
                filters.push(`(contains(Name,'${f.value}') or startswith(Code,'${f.value}'))`);
            }

            let salesMarketIds = self.salesMarketIds();
            let salesRepresentativeId = self.salesRepresentativeId();
            let salesAgentId = self.salesAgentId();
            let salesAreaId = self.salesAreaId();
            let countryId = self.countryId();
            let tradeAccountGroupId = self.tradeAccountGroupId();
            let paymentTermsId = self.paymentTermsId();
            let paymentTermsTypeId = self.paymentTermsTypeId();
            let creditStoppedId = self.creditStoppedId();
            let tradeAccountTypeId = self.tradeAccountTypeId();
            let tradeAccountTypeGroupId = self.tradeAccountTypeGroupId();
            let creditControllerId = self.creditControllerId();
            let debtFunderCode = self.debtFunderCode();
            let currencyId = self.currencyId();
            let tradeAccountCompanyId = self.tradeAccountCompanyId();

            if (salesMarketIds.length > 0) {
                let salesMarketFilters = [];

                salesMarketIds.forEach(sm => {
                    salesMarketFilters.push(`TradeAccount/SalesMarketID eq ${sm}`);
                });

                let salesMarketFilter = salesMarketFilters.join(' or ');

                filters.push(`(${salesMarketFilter})`);
            }

            if (tradeAccountCompanyId != '') {
                filters.push(`PartnerCompany eq '${tradeAccountCompanyId}'`);
            }

            if (salesRepresentativeId != '') {
                filters.push(`TradeAccount/SalesRepresentativeID eq ${salesRepresentativeId}`);
            }

            if (salesAgentId != '') {
                filters.push(`TradeAccount/SalesAgentID eq ${salesAgentId}`);
            }

            if (salesAreaId != '') {
                filters.push(`TradeAccount/SalesAreaID eq ${salesAreaId}`);
            }

            if (countryId != '') {
                filters.push(`TradeAccount/CountryID eq ${countryId}`);
            }

            if (tradeAccountGroupId != '') {
                filters.push(`TradeAccount/TradeAccountGroupID eq ${tradeAccountGroupId}`);
            }

            if (paymentTermsId != '') {
                filters.push(`TradeAccount/PaymentTermsID eq ${paymentTermsId}`);
            }

            if (debtFunderCode) {
                filters.push(`DebtFunder eq '${debtFunderCode}'`);
            }
            
            if (currencyId != '') {
                filters.push(`TradeAccount/CurrencyID eq ${currencyId}`);
            }

            if (paymentTermsTypeId != '') {
                filters.push(`TradeAccount/PaymentTerms/PaymentTermsTypeID eq ${paymentTermsTypeId}`);
            }

            if (creditStoppedId != '') {
                filters.push(`CreditStopped eq ${creditStoppedId}`);
            }

            if (creditControllerId != '') {
                filters.push(`CreditController eq '${creditControllerId}'`);
            }

            if (tradeAccountTypeId != '') {
                filters.push(`TradeAccount/TradeAccountTypeID eq ${tradeAccountTypeId}`);
            }

            if (tradeAccountTypeGroupId != '') {
                filters.push(`TradeAccount/TradeAccountType/TradeAccountTypeGroupID eq ${tradeAccountTypeGroupId}`);
            }

            if (filters.length) {
                let filterString = filters.join(' and ');
                d.$apply = `filter(${filterString})`;
            }

            delete d.$filter;

            if (!d.$apply) {
                delete d.$apply;
            } else {
                //console.log(d.$apply);
            }

            return d;

        },
        popupSettings: {
            appendTo: `#${self.prefix}trade-account-prefilter`
        }
    });

    self.statementsTradeAccountParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Trade Account',
        odata: true,
        endPoint: () => `/odata/TradeAccounts_Live/Default.GetTradeAccountsForCreditControl(includeClosedAccounts=${ko.unwrap(self.includeClosedTradeAccounts)}, includeDeletedAccounts=${ko.unwrap(self.includeDeletedTradeAccounts)})`,
        textField: 'ShortLabel',
        valueField: 'Code',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/TradeAccounts_Live/Default.TradeAccountLiveValueMapper(tradeAccountCode='${options.value}')`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        template: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        valueTemplate: (e) => {
            if ((e.ShortLabel != '') && (e.Code != null))
                return `<span title="${e.ShortLabel}">Trade Account: ${e.ShortLabel}</span>`
            else
                return '';
        },
        idObservable: self.statementsTradeAccountCode,
        objObservable: self.statementsTradeAccount,
        locked: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: [{
            dir: 'asc',
            field: 'Code'
        }, {
            dir: 'asc',
            field: 'Name'
        }],
        select: function (e) {
            console.log('statementsTradeAccountParams select', e);
        },
        requestStart: function (e) {

        },
        clearFunction: () => {
            self.statementsTradeAccountCode('');
            self.statementsTradeAccount(undefined);
            self.statementsTradeAccountParams.dropDownListSettings.widget().value('');
            self.statementsTradeAccountParams.dropDownListSettings.widget().trigger('change');
        },
        parameterMap: (data) => {

            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            let filters = [];

            if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "ShortLabel")) {
                let f = data.filter.filters.find(f => f.field === "ShortLabel");
                filters.push(`(contains(Name,'${f.value}') or startswith(Code,'${f.value}'))`);
            }

            if (d.$filter) {
                delete d.$filter;
            }

            // regardless whether or not a filter has a selection it must be refreshed if ANOTHER filter changes.
            // the implementation beneath is *not quite* sufficient  

            if (filters.length) {
                let filterString = filters.join(' and ');
                d.$apply = `filter(${filterString})`;
            }

            if (!d.$apply) {
                delete d.$apply;
            }

            return d;
        },
        popupSettings: {
            appendTo: `#${self.prefix}send-statements`
        }
    });

    //self.salesHistoryAnalysisPeriodGroupBy = `groupby((GroupName))`;

    self.salesHistoryAnalysisPeriodTemplate = (e) => {
        if (e.Code && e.Name) {
            return `<span title="${e.Name}">${e.Name}</span>`;
        } else {
            return '';
        }
    }

    self.salesHistoryAnalysisPeriodValueTemplate = (e) => {
        if (e.Code && e.Name) {
            return `<span title="${e.Name}">${e.Name}</span>`;
        } else {
            return '';
        }
    }

    self.salesHistoryAnalysisPeriodsParams = {
        enable: true,
        enable: ko.observable(true),
        disable: ko.observable(false),
        observable: self.salesHistoryAnalysisPeriodId,
        clearable: false,
        revertible: false,
        width: 'auto',
        label: 'Sales History Analysis Period',
        valuePrimitive: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        controlClass: 'form-control',
        complexObjectName: undefined, // don't remove this; see _Common.cshtml:276
        dropDownListSettings: {
            value: self.salesHistoryAnalysisPeriodId, // for a multi-select list, this is NOT a one-way street.
            dataItem: self.salesHistoryAnalysisPeriod,
            dataValueField: 'Code',
            dataTextField: 'Name',
            height: 300,
            widget: ko.observable(),
            groupClick: function (e, sender) {
                var self = this;
                console.log('groupClick', e);
            },
            open: function (e) {
                //var self = this;
                //$(e.sender._widgetOptions.dataItem.mdcSelect.root_).toggleClass('mdc-select--focused');
                //console.log(self);
            },
            close: function (e) {
                /*$(e.sender._widgetOptions.dataItem.mdcSelect.root_).toggleClass('mdc-select--focused');*/
            },
            data: new kendo.data.DataSource({
                serverFiltering: true,
                serverSorting: true,
                serverGrouping: true,
                schema: $.extend({}, kendo.data.schemas.webapi, {
                    data: "Data",
                    total: "Total",
                    filters: "Filters",
                    aggregates: "Aggregates",
                    errors: "Errors"
                }),
                transport: {
                    read: function (options) {
                        var webapi = new kendo.data.transports.webapi({ prefix: "" });

                        var mapped = webapi.parameterMap(options.data);

                        var data = {};

                        for (var propertyName in mapped) {
                            data[propertyName] = mapped[propertyName];
                        }

                        var params = new URLSearchParams();

                        for (var propertyName in data) {
                            params.append(propertyName, data[propertyName]);
                        }

                        fetch(`/api/CreditControlAPI/FetchSalesAnalysisGroups?${params}`, {
                            method: "GET",
                            headers: window.fetchHeaders,
                            cache: 'no-cache',
                            credentials: 'same-origin',
                            data: JSON.stringify(data),
                        })
                            .then(window.handleFetchResponse)
                            .then(data => {
                                options.success(data);
                            })
                            .catch(window.catchFetchError)
                    }
                },
                group: { field: 'GroupName' }
            }),
            valuePrimitive: true,
            autoWidth: false,
            autoBind: true, // this should be left true for multiselects so they don't go a bit skewiff -
            // if you don't permit autoBinding, and provide preselected values 
            // and rely on knockout-kendo to perform the updating... it *almost* works
            // however it does not clear the widget()._initialValues array,
            // which - when you then go to clear the widget - reloads selection
            // upon open. Which is pants.
            autoClose: false,
            optionLabel: ' ',
            filter: 'startswith'
        },
        popupSettings: {
            appendTo: `#${prefix}-sales-history-analysis-period-prefilter`
        }
    }

    self.languageParams = kendoMDCDropDownList({
        label: 'Language',
        odata: true,
        endPoint: '/odata/Languages',
        textField: 'Name',
        valueField: 'LanguageID',
        virtual: false,
        idObservable: self.languageId,
        objObservable: self.language,
        optionLabel: {
            LanguageID: '',
            Name: ''
        },
        optionLabelTemplate: '',
        filter: false,
        autoBind: true
    });


    self.debtFunderGroupBy = `groupby((DebtFunder/Code,DebtFunder/Name))/filter((DebtFunder/Code ne null))`;

    self.debtFunderTemplate = (e) => {
        if (e.DebtFunder && e.DebtFunder.Code && e.DebtFunder.Name) {
            return `<span title="${e.DebtFunder.Name}">${e.DebtFunder.Name}</span>`;
        } else {
            return '';
        }
    }

    self.DebtFunderValueTemplate = (e) => {
        if (e.DebtFunder && e.DebtFunder.Code && e.DebtFunder.Name) {
            return `<span title="${e.DebtFunder.Name}">${e.DebtFunder.Name}</span>`;
        } else {
            return '';
        }
    }

    self.debtFunderParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Debt Funder',
        odata: true,
        endPoint: '/odata/MertexTradeAccountClassificationSuperSet',
        textField: 'DebtFunder.Name',
        valueField: 'DebtFunder.Code',
        template: self.debtFunderTemplate,
        valueTemplate: self.debtFunderTemplate,
        idObservable: self.debtFunderCode,
        objObservable: self.debtFunder,
        complexObjectName: 'DebtFunder',
        complexObjectTextField: 'Name',
        locked: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'DebtFunder.Name'
        },
        select: function (e) {
            console.log('debtFunder select', e);
        },
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => self.paymentTermsAwaitingBinding(false),
        parameterMap: self.generateTradeAccountSuperSetParameterMap(self.debtFunderGroupBy),
        popupSettings: {
            appendTo: `#${self.prefix}debt-funder-prefilter`
        }
    });


    self.currencyGroupBy = `groupby((Currency/CurrencyID,Currency/Name))/filter((Currency/CurrencyID ne null))`;

    self.currencyTemplate = (e) => {
        if (e.Currency && e.Currency.CurrencyID && e.Currency.Name) {
            return `<span title="${e.Currency.Name}">${e.Currency.Name}</span>`;
        } else {
            return '';
        }
    }

    self.CurrencyValueTemplate = (e) => {
        if (e.Currency && e.Currency.CurrencyID && e.Currency.Name) {
            return `<span title="${e.Currency.Name}">${e.Currency.Name}</span>`;
        } else {
            return '';
        }
    }

    self.currencyParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Currency',
        odata: true,
        endPoint: '/odata/MertexTradeAccountClassificationSuperSet',
        textField: 'Currency.Name',
        valueField: 'Currency.CurrencyID',
        template: self.currencyTemplate,
        valueTemplate: self.currencyValueTemplate,
        idObservable: self.currencyId,
        objObservable: self.currency,
        complexObjectName: 'Currency',
        complexObjectTextField: 'Name',
        locked: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'Currency.Name'
        },
        select: function (e) {
            console.log('currency select', e);
        },
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => self.paymentTermsAwaitingBinding(false),
        parameterMap: self.generateTradeAccountSuperSetParameterMap(self.currencyGroupBy),
        popupSettings: {
            appendTo: `#${self.prefix}currency-prefilter`
        }
    });

    //self.saleHistoryAnalysisPeriodTemplate = (e) => {
    //    if (e.SaleHistoryAnalysisPeriod && e.SaleHistoryAnalysisPeriod.Code && e.SaleHistoryAnalysisPeriod.Name) {
    //        return `<span title="${e.SaleHistoryAnalysisPeriod.Name}">${e.SaleHistoryAnalysisPeriod.Name}</span>`;
    //    } else {
    //        return '';
    //    }
    //}

    //self.saleHistoryAnalysisPeriodValueTemplate = (e) => {
    //    if (e.SaleHistoryAnalysisPeriod && e.SaleHistoryAnalysisPeriod.Code && e.SaleHistoryAnalysisPeriod.Name) {
    //        return `<span title="${e.SaleHistoryAnalysisPeriod.Name}">${e.SaleHistoryAnalysisPeriod.Name}</span>`;
    //    } else {
    //        return '';
    //    }
    //}

    //self.salesHistoryAnalysisPeriodParams = kendoMDCDropDownList({
    //    skipCascade: true,
    //    label: 'Sales History Analysis Period',
    //    odata: true,
    //    endPoint: '/odata/SalesHistoryAnalysisPeriods',
    //    textField: 'Name',
    //    valueField: 'Code',
    //    //template: self.saleHistoryAnalysisPeriodTemplate,
    //    //valueTemplate: self.saleHistoryAnalysisPeriodValueTemplate,
    //    idObservable: self.salesHistoryAnalysisPeriodCode,
    //    objObservable: self.salesHistoryAnalysisPeriod,
    //    locked: ko.observable(false),
    //    enable: ko.observable(true),
    //    disable: ko.observable(false),
    //    clearable: ko.observable(true),
    //    revertible: ko.observable(false),
    //    readOnly: false,
    //    filter: 'contains',
    //    autoBind: true,
    //    height: 340,
    //    sort: {
    //        dir: 'asc',
    //        field: 'SortOrder'
    //    },
    //    select: function (e) {
    //        console.log('saleHistoryAnalysisPeriod select', e);
    //    },
    //    clearFunction: self.genericUnsavedChangesClear,
    //    popupSettings: {
    //        appendTo: document.getElementById(`${self.filtersPrefix}sales-history-analysis-period-prefilter`)
    //    }
    //});

    self.paymentHistoryTradeAccountParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Trade Account',
        odata: true,
        endPoint: () => `/odata/TradeAccounts_Live/Default.GetTradeAccountsForCreditControl(includeClosedAccounts=${ko.unwrap(self.includeClosedTradeAccounts)}, includeDeletedAccounts=${ko.unwrap(self.includeDeletedTradeAccounts)})`,
        textField: 'ShortLabel',
        valueField: 'Code',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/TradeAccounts_Live/Default.TradeAccountLiveValueMapper(tradeAccountCode='${options.value}')`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        template: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        valueTemplate: (e) => {
            if ((e.ShortLabel != '') && (e.Code != null))
                return `<span title="${e.ShortLabel}">Trade Account: ${e.ShortLabel}</span>`
            else
                return '';
        },
        idObservable: self.tradeAccountCode,
        objObservable: self.tradeAccount,
        locked: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: [{
            dir: 'asc',
            field: 'Code'
        }, {
            dir: 'asc',
            field: 'Name'
        }],
        select: function (e) {
            console.log('statementsTradeAccountParams select', e);
        },
        requestStart: function (e) {

        },
        open: function (e) {
            e.sender.list.addClass("trade-account-droplist");
        },
        clearFunction: () => {
            self.paymentHistoryTradeAccountCode('');
            self.paymentHistoryTradeAccount(undefined);
            self.paymentHistoryTradeAccountParams.dropDownListSettings.widget().value('');
            self.paymentHistoryTradeAccountParams.dropDownListSettings.widget().trigger('change');
        },
        parameterMap: (data) => {

            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            let filters = [];

            if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "ShortLabel")) {
                let f = data.filter.filters.find(f => f.field === "ShortLabel");
                filters.push(`(contains(Name,'${f.value}') or startswith(Code,'${f.value}'))`);
            }

            if (d.$filter) {
                delete d.$filter;
            }

            // regardless whether or not a filter has a selection it must be refreshed if ANOTHER filter changes.
            // the implementation beneath is *not quite* sufficient  

            if (filters.length) {
                let filterString = filters.join(' and ');
                d.$apply = `filter(${filterString})`;
            }

            if (!d.$apply) {
                delete d.$apply;
            }

            return d;
        }
    });

    self.paymentHistorySearchTermParams = {
        label: "Search Term",
        observable: self.paymentHistorySearchTerm,
        focusObservable: ko.observable(),
        busy: ko.observable(),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        useNativeValidation: false, // this feeds through to mdc objects and affects them
        decorateInputElement: true,
        insertValidationMessages: false,
        enterKey: () => {
            //self.gridSettings.widget().dataSource.read();
        }
    }

    self.paymentHistoryDateRangeParams = kendoMDCDropDownList({
        skipCascade: false,
        label: 'Date Range',
        data: self.paymentHistoryDateRanges,
        textField: 'name',
        valueField: 'dateRangeId',
        idObservable: self.paymentHistoryDateRangeId,
        objObservable: self.paymentHistoryDateRange,
        template: (e) => `<span class="date-range ${e.class}">${e.name}</span>`,
        valueTemplate: (e) => `<span class="date-range ${e.class}">${e.name}</span>`,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(false),
        revertible: ko.observable(false),
        readOnly: false,
        autoBind: true,
        autoWidth: true,
        clearFunction: () => {
            self.paymentHistoryDateRangeId('');
        },
        afterClear: () => {

        },
        popupSettings: {
            appendTo: `#${self.prefix}payment-history-date-type-prefilter`
        },
    });

    self.paymentHistoryFromDateParams = {
        label: "From",
        observable: self.paymentHistoryFromDate,
        originalValue: self.paymentHistoryFromDate(),
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
                disabledDates: [],
                maxDate: new Date(),
            },
            allowInputToggle: true,
            useCurrent: false,
            keepInvalid: true,
            debug: false
        },
        clearable: ko.observable(true),
        clearFunction: () => {
            self.paymentHistoryFromDate(undefined);
            self.paymentHistoryFromDateParams.observable.tempusDominus.clear();
            self.paymentHistoryFromDateParams.observable.tempusDominus.updateOptions({
                display: {
                    viewMode: 'calendar'
                }
            });
        },
        revertible: ko.observable(true),
        revertFunction: () => {
            self.paymentHistoryFromDateParams.observable(self.paymentHistoryFromDateParams.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true,
        popupSettings: {
            appendTo: `#${self.prefix}payment-history-from-date`
        }
    };

    self.paymentHistoryToDateParams = {
        label: "To",
        observable: self.paymentHistoryToDate,
        originalValue: self.paymentHistoryToDate(),
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
        //clearFunction: () => {
        //    self.paymentHistoryToDate(undefined);
        //    self.paymentHistoryToDateParams.observable.tempusDominus.clear();
        //    self.paymentHistoryToDateParams.observable.tempusDominus.updateOptions({
        //        display: {
        //            viewMode: 'calendar'
        //        }
        //    });
        //},
        revertible: ko.observable(true),
        revertFunction: () => {
            self.paymentHistoryToDateParams.observable(self.paymentHistoryToDateParams.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true,
        popupSettings: {
            appendTo: `#${self.prefix}payment-history-to-date`
        }
    };

    self.paymentHistoryBankAccountParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Bank Account',
        odata: true,
        endPoint: '/odata/BankingAccounts',
        textField: 'Label',
        valueField: 'AccountID',
        idObservable: self.paymentHistoryBankingAccountId,
        objObservable: self.paymentHistoryBankingAccount,
        locked: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        autoBind: true,
        autoWidth: true,
        height: 192,
        sort: {
            dir: 'asc',
            field: 'Description'
        },
        select: function (e) {
            console.log('bankingAccountParams select', e);
        },
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: `#${self.prefix}banking-account-prefilter`
        }
    });

    self.paymentHistoryCurrencyParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Currency',
        odata: true,
        endPoint: '/odata/BankingCurrencies',
        textField: 'Label',
        valueField: 'AccountID',
        idObservable: self.paymentHistoryBankingCurrencyCode,
        objObservable: self.paymentHistoryBankingCurrency,
        locked: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        autoBind: true,
        autoWidth: true,
        height: 320,
        sort: {
            dir: 'asc',
            field: 'Code'
        },
        select: function (e) {
            console.log('bankingCurrencyParams select', e);
        },
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: `#${self.prefix}banking-currency-prefilter`
        }
    });

    self.paymentHistoryPaymentStatusParams = kendoMDCDropDownList({
        skipCascade: false,
        label: 'Payment Status',
        data: self.paymentHistoryPaymentStatuses,
        textField: 'name',
        valueField: 'value',
        idObservable: self.paymentHistoryPaymentStatusId,
        objObservable: self.paymentHistoryPaymentStatus,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        autoBind: true,
        autoWidth: true,
        clearFunction: () => {
            self.paymentHistoryPaymentStatusId('');
            self.paymentHistoryPaymentStatus(undefined);
        },
        afterClear: () => {

        },
        popupSettings: {
            appendTo: `#${self.prefix}payment-history-payment-status-prefilter`
        },
    });

    self.paymentHistoryCreditControllerParams = kendoMDCDropDownList({
        skipCascade: true,
        odata: true,
        endPoint: '/odata/CreditControllers',
        label: 'Credit Controller',
        textField: 'Name',
        valueField: 'Code',
        template: `#: Name # #: Name && Code ? '(' + Code + ')' : '' #`,
        valueTemplate: `#: Name # #: Name && Code ? '(' + Code + ')' : '' #`,
        idObservable: self.paymentHistoryCreditControllerId,
        objObservable: self.paymentHistoryCreditController,
        locked: ko.observable(typeof window.lockCreditController == 'function' ? window.lockCreditController() : self.paymentHistoryCreditControllerId() != ''),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'Name'
        },
        select: function (e) {
            console.log('paymentHistoryCreditController select', e);
        },
        clearFunction: () => {
            self.paymentHistoryCreditControllerParams.dropDownListSettings.widget().value('');
            self.paymentHistoryCreditControllerParams.dropDownListSettings.widget().trigger('change');
        },
        popupSettings: {
            appendTo: `#${self.prefix}payment-history-credit-controller-prefilter`
        }
    });

    self.allocateHoldingAccountCashSearchTermParams = {
        label: "Search Term",
        observable: self.allocateHoldingAccountCashSearchTerm,
        focusObservable: ko.observable(),
        busy: ko.observable(),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        useNativeValidation: false, // this feeds through to mdc objects and affects them
        decorateInputElement: true,
        insertValidationMessages: false,
        enterKey: () => {
            //self.gridSettings.widget().dataSource.read();
        }
    }
   
    self.closeBrothersDateRangeParams = kendoMDCDropDownList({
        skipCascade: false,
        label: 'Date Range',
        data: self.closeBrothersDateRanges,
        textField: 'name',
        valueField: 'dateRangeId',
        idObservable: self.closeBrothersDateRangeId,
        objObservable: self.closeBrothersDateRange,
        template: (e) => `<span class="date-range ${e.class}">${e.name}</span>`,
        valueTemplate: (e) => `<span class="date-range ${e.class}">${e.name}</span>`,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(false),
        revertible: ko.observable(false),
        readOnly: false,
        autoBind: true,
        autoWidth: true,
        clearFunction: () => {
            self.closeBrothersDateRangeId('');
        },
        afterClear: () => {

        },
        popupSettings: {
            appendTo: `#${self.prefix}close-brothers-date-type-prefilter`
        },
    });

    self.closeBrothersFromDateParams = {
        label: "From",
        observable: self.closeBrothersFromDate,
        originalValue: self.closeBrothersFromDate(),
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
                disabledDates: [],
                maxDate: new Date(),
            },
            allowInputToggle: true,
            useCurrent: false,
            keepInvalid: true,
            debug: false
        },
        clearable: ko.observable(true),
        clearFunction: () => {
            self.closeBrothersFromDate(undefined);
            self.closeBrothersFromDateParams.observable.tempusDominus.clear();
            self.closeBrothersFromDateParams.observable.tempusDominus.updateOptions({
                display: {
                    viewMode: 'calendar'
                }
            });
        },
        revertible: ko.observable(true),
        revertFunction: () => {
            self.closeBrothersFromDateParams.observable(self.closeBrothersFromDateParams.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true,
        popupSettings: {
            appendTo: `#${self.prefix}close-brothers-from-date`
        }
    };

    self.closeBrothersToDateParams = {
        label: "To",
        observable: self.closeBrothersToDate,
        originalValue: self.closeBrothersToDate(),
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
        //clearFunction: () => {
        //    self.closeBrothersToDate(undefined);
        //    self.closeBrothersToDateParams.observable.tempusDominus.clear();
        //    self.closeBrothersToDateParams.observable.tempusDominus.updateOptions({
        //        display: {
        //            viewMode: 'calendar'
        //        }
        //    });
        //},
        revertible: ko.observable(true),
        revertFunction: () => {
            self.closeBrothersToDateParams.observable(self.closeBrothersToDateParams.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true,
        popupSettings: {
            appendTo: `#${self.prefix}close-brothers-to-date`
        }
    };

    //#endregion


    //#region Subscriptions

    self.displayModes.subscribe(nv => {
        if (nv.length) {
            localStorage.setItem('displayModes', `[${nv}]`)
        } else {
            localStorage.removeItem('displayModes');
        }
    });

    //#endregion


    //#region Computeds

    self.paymentHistoryFromPrecedesTo = ko.pureComputed(() => {
        if (self.paymentHistoryFromDate() && self.paymentHistoryToDate()) {
            return self.paymentHistoryFromDate().getTime() <= self.paymentHistoryToDate().getTime();
        }
    }, self).extend({
        equal: {
            params: true,
            onlyIf: function () {
                return self.paymentHistoryFromDate() && self.paymentHistoryToDate()
            },
            message: 'From Date must precede To Date'
        }
    }, self);

    self.closeBrothersFromPrecedesTo = ko.pureComputed(() => {
        if (self.closeBrothersFromDate() && self.closeBrothersToDate()) {
            return self.closeBrothersFromDate().getTime() <= self.closeBrothersToDate().getTime();
        }
    }, self).extend({
        equal: {
            params: true,
            onlyIf: function () {
                return self.closeBrothersFromDate() && self.closeBrothersToDate()
            },
            message: 'From Date must precede To Date'
        }
    }, self);

    self.getData = ko.computed(() => {

        let salesMarketIds = [];

        ko.ignoreDependencies(() => {
            salesMarketIds = self.salesMarketIds();
        });

        let salesMarketIdsCount = self.salesMarketIdsCount();

        let result = {
            salesRepresentativeId: self.salesRepresentativeId(),
            salesAgentId: self.salesAgentId(),
            salesAreaId: self.salesAreaId(),
            countryId: self.countryId(),
            tradeAccountGroupId: self.tradeAccountGroupId(),
            tradeAccountTypeId: self.tradeAccountTypeId(),
            paymentTermsId: self.paymentTermsId(),
            paymentTermsTypeId: self.paymentTermsTypeId(),
            creditStopped: self.creditStoppedId(),
            tradeAccountTypeGroupId: self.tradeAccountTypeGroupId(),
            open: self.tradeAccountStatusId(),
            languageId: self.languageId(),
            currencyId: self.currencyId()
        };

        if (self.tradeAccountCompanyId()) {
            result.tradeAccountCompanyCode = self.tradeAccountCompanyId();
        }

        if (self.invoiceCompanyId()) {
            result.invoiceCompanyCode = self.invoiceCompanyId();
        }

        if (salesMarketIds.length) {
            result.salesMarketIds = salesMarketIds;
        }

        if (self.creditControllerId()) {
            result.creditControllerCode = self.creditControllerId();
        }

        //if (typeof self.date() == 'object') {
        //    result.date = self.date().toUTCString()
        //} else {
        //    result.date = self.date();
        //}

        if (self.tradeAccountCode() != '') {
            result.tradeAccountCode = self.tradeAccountCode();
        }

        if (self.debtFunderCode() != '') {
            result.debtFunderCode = self.debtFunderCode();
        }

        if (self.salesHistoryAnalysisPeriodId() != '') {
            result.salesHistoryAnalysisPeriod = self.salesHistoryAnalysisPeriodId();
        }

        console.log(`${self.prefix}creditControlFilters`, result);

        return result;
    }, self).extend({
        rateLimit: {
            timeout: 100,
            method: 'notifyWhenChangesStop'
        }
    });

    self.getStatementParameters = () => {
        return {
            tradeAccountCode: self.statementsTradeAccountCode(),
            date: typeof self.date() == 'object' ? self.date().toUTCString() : self.date()
        };
    }

    self.getCreditControlOrderReleaseParameters = ko.computed(() => {
        return {
            creditControllerId: self.creditControllerId() ? self.creditControllerId() : null
        }
    }, self)

    self.getSelectedFilters = ko.computed(() => {
        let results = Object.keys(self)
            .filter(k => {
                return (k.length)
                    && (k != 'initialParams')
                    && (k != 'dateParams')
                    && (k != 'statementsTradeAccountParams')
                    && (k != 'includeClosedTradeAccountsParams')
                    && (k != 'salesHistoryAnalysisPeriodsParams')
                    && (k.indexOf('paymentHistory') == -1)
                    && (k.indexOf('outstanding') == -1)
                    && (k.indexOf('closeBrothers') == -1)
                    && (k.indexOf('Params') > -1)
                    && (k.indexOf('Params') == k.length - 6);
            }).map(k => self[k])
            .filter(p => {
                let selected = false;

                if (p.hasOwnProperty('locked')) {
                    if (p.locked() == false) {
                        if (p.hasOwnProperty('multiSelectSettings')) {
                            if (p.multiSelectSettings.observableArray().length)
                                selected = true;
                        } else if (p.hasOwnProperty('observable')) {
                            if (p.observable() != null && p.observable() != '')
                                selected = true;
                        }
                    }
                } else {
                    if (p.hasOwnProperty('multiSelectSettings')) {
                        if (p.multiSelectSettings.observableArray().length)
                            selected = true;
                    } else if (p.hasOwnProperty('observable')) {
                        if (p.observable() != null && p.observable() != '')
                            selected = true;
                    }
                }

                return selected;
            });

        results.forEach(r => {

            r.bsTooltipTitle = () => {

                let result = ''

                if (Object.hasOwn(r, 'detailedLabel'))
                    result = ko.unwrap(r.detailedLabel);
                else if (Object.hasOwn(r, 'label'))
                    result = ko.unwrap(r.label);
                else if (Object.hasOwn(r, 'multiSelectSettings') && Object.hasOwn(r.multiSelectSettings, 'detailedLabel'))
                    result = ko.unwrap(r.multiSelectSettings.detailedLabel);
                else if (Object.hasOwn(r, 'dropDownListSettings')) {
                    if (Object.hasOwn(r.dropDownListSettings, 'dataItem')) {
                        if (Object.hasOwn(r.dropDownListSettings.dataItem, 'complexObjectName')) {
                            result += ` = ${ko.unwrap(r.dropDownListSettings.dataItem)[r.complexObjectName][r.complexObjectTextField]}`;
                        } else {
                            result += ` = ${(r.dropDownListSettings.dataValueField == 'Code'
                                ? ko.unwrap(r.dropDownListSettings.dataItem)[r.dropDownListSettings.dataValueField]
                                : '')}`
                        }
                    } else {
                        result += `${(ko.unwrap(r.dropDownListSettings.dataItem)[r.dropDownListSettings.dataTextField])}`;
                    }
                }
                    
                return result;
            };

            //r.bsTooltipTitle = r.determineTooltipTitle;

            //if (Object.hasOwn(r, 'multiSelectSettings')) {
            //    r.multiSelectSettings.observableArray.subscribe(nv => {
            //        r.bsTooltipTitle(r.determineTooltipTitle());
            //    }, 'arrayChange', self);
            //}
        });

        return results;
    }, self);

    self.selectedFilterCount = ko.computed(() => {
        let filtersCount = self.getSelectedFilters().length;

        console.log('filtersCount', filtersCount);

        if (filtersCount == 0) {
            self.countDisplay(undefined);
        } else if (filtersCount == 1) {
            self.countDisplay('1&nbsp;&nbsp;Filter&nbsp;&nbsp;Selected')
        } else if (filtersCount > 1) {
            self.countDisplay(`${filtersCount}&nbsp;&nbsp;Filters&nbsp;&nbsp;Selected`)
        }

        window.setTimeout(() => {
            self.clearAllTooltips();
        }, 0);

        return filtersCount;
    }, self);

    self.onlinePaymentHistoryFilters = ko.computed(() => {

        let data = {
            dateRangeId: self.paymentHistoryDateRangeId(),
            from: self.paymentHistoryFromDate()?.toUTCString() ?? null,
            to: self.paymentHistoryToDate()?.toUTCString() ?? null,
            accountId: self.paymentHistoryBankingAccountId(),
            currencyCode: self.paymentHistoryBankingCurrencyCode(),
            paymentStatus: self.paymentHistoryPaymentStatusId()
        } 

        if (self.paymentHistorySearchTerm()) {
            data.searchTerm = self.paymentHistorySearchTerm();
        }

        if (self.tradeAccountCode()) {
            data.tradeAccountCode = self.tradeAccountCode()
        }

        if (self.paymentHistoryCreditControllerId()) {
            data.creditControllerCode = self.paymentHistoryCreditControllerId()
        }

        return data;
    }, self).extend({
        rateLimit: {
            timeout: 300,
            method: 'notifyWhenChangesStop'
        }
    });

    self.closeBrothersFilters = ko.computed(() => {
        let data = {
            dateRangeId: self.closeBrothersDateRangeId(),
            from: self.closeBrothersFromDate()?.toUTCString() ?? null,
            to: self.closeBrothersToDate()?.toUTCString() ?? null,
        }
        return data;
    }, self);

    //#endregion



    //#region Late Subscriptions

    self.getSelectedFilters.subscribe(nv => {
        window.setTimeout(() => {
            self.initTooltips();
        }, 0);
    });

    //#endregion

    //#region Methods

    self.togglePinning = (data, event) => {
        document.querySelector(`#${self.prefix}sidebar`).classList.toggle('pinned');
        event && event.target.closest('button') && event.target.closest('button').blur();
    }

    self.reset = () => {
        console.log(`${self.prefix}filters reset called`);

        let selection = self.getSelectedFilters();

        selection.forEach(f => {
            if (Object.hasOwn(f, 'clearFunction')) {
                console.log('calling clearFunction on', f);
                f.clearFunction();
            }
        });

        self.clearSelectedPod(false);

        window.setTimeout(() => {
            self.tradeAccountStatusId(true);
            self.tradeAccountStatusParams.dropDownListSettings.widget().trigger('change');
        }, 0);
    }

    self.initTooltips = () => {
        const tooltipTriggerList = document.querySelectorAll('.filter-pill[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl, {
            title: function() {
                let result = ko.dataFor(tooltipTriggerEl).bsTooltipTitle();
                return result;
            }
        }));
    }

    self.clearAllTooltips = () => {
        document.querySelectorAll('.filter-pill[data-bs-toggle="tooltip"]').forEach(e => {
            let toolTip = bootstrap.Tooltip.getOrCreateInstance(e);
            toolTip.hide();
        })
        document.querySelectorAll('[role="tooltip"]').forEach(r => r.remove());
    }

    //#endregion

    return self;
}