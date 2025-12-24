const creditControlFiltersViewModel = ({
    params,
    parent
} = {
    params: {},
    parent: {}
}) => {
    let self = {
        refreshParent: parent.refresh
    };

    //#region Properties

    self.busy = parent.busy;

    self.validateNow = ko.observable(false);

    self.date = ko.observable().extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'Please specify a date'
        }
    }); // this is for Statement Sending only, and must be removed from the main filtering thingies

    self.sidebarElement = document.getElementById('filters-sidebar');

    self.sidebarCollapseElement = document.getElementById('sidebar-collapse');
    self.sidebarCollapse = bootstrap.Collapse.getOrCreateInstance(self.sidebarCollapseElement);

    self.includeClosedTradeAccounts = ko.observable(true);
    self.includeDeletedTradeAccounts = ko.observable(false);

    self.tradeAccountCode = ko.observable(params.tradeAccountCode ?? '');
    self.tradeAccount = ko.observable();

    self.statementsTradeAccountCode = ko.observable(params.statementsTradeAccountCode ?? '');
    self.statementsTradeAccount = ko.observable();

    self.salesHistoryAnalysisPeriodId = ko.observable(params.salesHistoryAnalysisPeriodId ?? '');
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
            filtersPrefix: 'credit-control-',
            creditController: window.getCreditControllerCode()
        }, params),
        parent: parent
    }), self);

    self.countDisplay = ko.observable(undefined);

    self.displayModes = ko.observableArray([DISPLAY_MODE_QUANTITY])

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
        checkboxId: 'include-closed-trade-accounts',
        label: 'Include Closed?',
        observable: self.includeClosedTradeAccounts,
        useNativeValidation: false,
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false)
    }

    self.includeDeletedTradeAccountsParams = {
        checkboxId: 'include-deleted-trade-accounts',
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
                        url: `/odata/TradeAccounts_Live/Default.TradeAccountLiveValueMapper(tradeAccountCode=${options.value})`,
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
                        url: `/odata/TradeAccounts_Live/Default.TradeAccountLiveValueMapper(tradeAccountCode=${options.value})`,
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
            appendTo: document.querySelector("#send-statements-modal .modal-body")
        }
    });

    self.dateParams = {
        label: "Date",
        observable: self.date,
        originalValue: self.date(),
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
                viewMode: 'months',
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
        clearable: ko.observable(true),
        clearFunction: () => {
            self.date(undefined);
            self.dateParams.observable.tempusDominus.clear();
            self.dateParams.observable.tempusDominus.updateOptions({
                display: {
                    viewMode: 'months'
                }
            })
        },
        revertible: ko.observable(true),
        revertFunction: () => {
            self.date.observable(self.dateParams.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true,
    };

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


    // why TF can't I get grouping to work vs odata controller endpoints
    self.salesHistoryAnalysisPeriodsParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Sales History Analysis Period',
        odata: true,
        endPoint: '/odata/SalesHistoryAnalysisPeriods',
        textField: 'Name',
        valueField: 'Code',
        groupTemplate: '<strong>#:data#</strong>',
        template: self.salesHistoryAnalysisPeriodTemplate,
        valueTemplate: self.salesHistoryAnalysisPeriodValueTemplate,
        idObservable: self.salesHistoryAnalysisPeriodId,
        objObservable: self.salesHistoryAnalysisPeriod,
        //grouping: [{
        //    field: 'GroupName',
        //    dir: 'asc'
        //}],
        schema: {
            model: {
                id: 'Code',
                fields: [{
                    GroupName: { type: 'string' },
                    Name: { type: 'string' },
                    Code: { type: 'string' },
                    SortOrder: { type: 'number' }
                }]
            }
        },
        locked: ko.observable(self.salesHistoryAnalysisPeriodId() != ''),
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
            console.log('salesHistoryAnalysisPeriod select', e);
        },
        clearFunction: self.genericUnsavedChangesClear,
        //parameterMap: (data) => {

        //    //Generate parameters in odata v4 format
        //    let d = kendo.data.transports['odata-v4'].parameterMap(data);

        //    delete d.$inlinecount; // <-- remove inlinecount
        //    delete d.$format; // <-- remove format
        //    delete d.$callback; // <-- remove callback

        //    d.$count = true;

        //    d.$apply = 'groupby((Code,Name,GroupName,SortOrder))/filter((Code ne null))';

        //    return d;
        //},
        popupSettings: {
            appendTo: document.getElementById(`${self.filtersPrefix}sales-history-analysis-period-prefilter`)
        }
    });

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
            appendTo: document.getElementById(`${self.filtersPrefix}debt-funder-prefilter`)
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
            appendTo: document.getElementById(`${self.filtersPrefix}currency-prefilter`)
        }
    });

    self.saleHistoryAnalysisPeriodTemplate = (e) => {
        if (e.SaleHistoryAnalysisPeriod && e.SaleHistoryAnalysisPeriod.Code && e.SaleHistoryAnalysisPeriod.Name) {
            return `<span title="${e.SaleHistoryAnalysisPeriod.Name}">${e.SaleHistoryAnalysisPeriod.Name}</span>`;
        } else {
            return '';
        }
    }

    self.saleHistoryAnalysisPeriodValueTemplate = (e) => {
        if (e.SaleHistoryAnalysisPeriod && e.SaleHistoryAnalysisPeriod.Code && e.SaleHistoryAnalysisPeriod.Name) {
            return `<span title="${e.SaleHistoryAnalysisPeriod.Name}">${e.SaleHistoryAnalysisPeriod.Name}</span>`;
        } else {
            return '';
        }
    }

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

    //#endregion


    //#region Subscriptions

    //self.tradeAccountCode.subscribe(nv => {
    //    self.refreshParent();
    //})

    //self.date.subscribe(nv => {
    //    self.refreshParent();
    //});

    //self.debtFunderCode.subscribe(nv => {
    //    self.refreshParent();
    //});

    //self.currencyId.subscribe(nv => {
    //    self.refreshParent();
    //});

    //#endregion


    //#region Computeds

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
            currencyId: self.currencyId(),
        };

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

        console.log('creditControlFilters', result);

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

    self.getSelectedFilters = ko.computed(() => {
        return Object.keys(self)
            .filter(k => {
                return (k.length)
                    && (k != 'initialParams')
                    && (k != 'dateParams')
                    && (k != 'statementsTradeAccountParams')
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
                            if (p.observable())
                                selected = true;
                        }
                    }
                } else {
                    console.log(p);
                }

                return selected;
            });
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

        return filtersCount;
    }, self);

    //#endregion



    //#region Late Subscriptions



    //#endregion

    //#region Methods

    self.togglePinning = (data, event) => {
        self.sidebarElement.classList.toggle('pinned');
        event && event.target.closest('button') && event.target.closest('button').blur();
    }

    self.reset = () => {
        console.log('creditControlFilters reset called');

        let selection = self.getSelectedFilters();

        selection.forEach(f => {
            if (Object.hasOwn(f, 'clearFunction')) {
                console.log('calling clearFunction on', f);
                f.clearFunction();
            }
        });

        window.setTimeout(() => {
            self.tradeAccountStatusId(true);
            self.tradeAccountStatusParams.dropDownListSettings.widget().trigger('change');
        }, 0);
    }

    //#endregion

    return self;
}