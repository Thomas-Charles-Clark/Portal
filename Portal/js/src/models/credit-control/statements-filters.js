const statementsFiltersViewModel = ({
    parent
} = {
    parent
}) => {
    let self = {
        parent: parent
    };

    //#region Properties

    self.busy = parent.busy;

    self.date = ko.observable();

    self.includeClosedTradeAccounts = ko.observable(false);
    self.includeDeletedTradeAccounts = ko.observable(false);

    self.tradeAccountId = ko.observable(self.toLoadDto?.tradeAccountId ?? '');
    self.tradeAccount = ko.observable();

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
        endPoint: () => `/odata/TradeAccounts/Default.GetTradeAccountsForStatements(includeClosedAccounts=${ko.unwrap(self.includeClosedTradeAccounts)}, includeDeletedAccounts=${ko.unwrap(self.includeDeletedTradeAccounts)})`,
        textField: 'ShortLabel',
        valueField: 'TradeAccountID',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/TradeAccounts/Default.TradeAccountValueMapper(tradeAccountId=${options.value})`,
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
            if ((e.ShortLabel != '') && (e.TradeAccountID != null))
                return `<span title="${e.ShortLabel}">Trade Account: ${e.ShortLabel}</span>`
            else
                return '';
        },
        idObservable: self.tradeAccountId,
        objObservable: self.tradeAccount,
        locked: ko.observable(self.tradeAccountId() != ''),
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
            self.tradeAccountId('');
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

    //#endregion


    //#region Subscriptions

    self.tradeAccountId.subscribe(nv => {
        self.refreshParent();
    })

    self.date.subscribe(nv => {
        self.refreshParent();
    });

    //#endregion


    //#region Computeds



    //#endregion


    //#region Methods

    self.refreshParent = () => {
        self.parent.refresh();
    }

    //#endregion

    return self;
}