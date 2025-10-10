const documentDateRanges = [{
    dateRangeId: '-2',
    name: 'All Time',
    class: null
}, {
    dateRangeId: '30',
    name: 'Last 30 Days',
    class: null
}, {
    dateRangeId: '1',
    name: 'This Month',
    class: null
}, {
    dateRangeId: '3',
    name: 'Last 3 Months',
    class: null
}, {
    dateRangeId: '6',
    name: 'Last 6 Months',
    class: null
}, {
    dateRangeId: '12',
    name: 'Last 12 Months',
    class: null
}, {
    dateRangeId: '-1',
    name: 'Custom',
    class: null
}];

const documentsSentReportFiltersViewModel = ({
    parent
} = {
    parent
}) => {
    let self = {
        parent: parent
    };

    //#region Properties

    self.toLoadDto = window.getDto();

    self.busy = parent.busy;

    self.documentFromDate = ko.observable(self.toLoadDto?.fromDate ? new Date(self.toLoadDto.fromDate) :  undefined);
    self.documentToDate = ko.observable(self.toLoadDto?.toDate ? new Date(self.toLoadDto.toDate) : undefined);

    self.documentId = ko.observable(self.toLoadDto?.documentId ?? '');
    self.document = ko.observable();

    self.tradeAccountId = ko.observable(self.toLoadDto?.tradeAccountId ?? '');
    self.tradeAccount = ko.observable();

    self.includeClosedTradeAccounts = ko.observable(false);
    self.includeDeletedTradeAccounts = ko.observable(false);

    self.freeTextSearch = ko.observable(self.toLoadDto?.searchString);
    self.freeTextSearchActual = ko.observable().extend({
        rateLimit: {
            timeout: 300,
            method: 'notifyWhenChangesStop'
        }
    });

    self.pauseFreeTextSearchUpdate = false;

    self.documentDateRanges = documentDateRanges;

    self.documentDateRangeId = ko.observable(self.toLoadDto?.dateRangeId?.toString() ?? '30');

    self.documentDateRange = ko.observable(documentDateRanges.find(d => d.dateRangeId == self.documentDateRangeId()));

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

    self.documentTemplate = (item) => {
        if (item.DocumentID != null && item.Name != '') {
            return `<span class="document-label" title="Document ID: ${item.DocumentID}">${item.Name}</span>`;
        } else {
            return ``;
        }
    }

    self.documentParams = kendoMDCDropDownList({
        label: 'Document',
        autoBind: true,
        odata: true,
        endPoint: '/odata/Documents',
        textField: 'Name',
        valueField: 'DocumentID',
        virtual: false,
        busy: ko.observable(),
        template: self.documentTemplate,
        valueTemplate: self.documentTemplate,
        noDataTemplate: `No Documents Found`,
        idObservable: self.documentId,
        objObservable: self.document,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'equals',
        height: 340,
        sort: [{
            dir: 'asc',
            field: 'DocumentID'
        }],
        requestStart: (e) => {
            self.documentParams.busy(true);
        },
        requestEnd: (e) => {
            console.log(e);
            self.documentParams.busy(false);
        },
        clearFunction: () => {
            self.documentId('');
            self.document(undefined);
            self.documentParams.dropDownListSettings.widget().value('');
            self.documentParams.dropDownListSettings.widget().trigger('change');
        },
        afterClear: () => {
            self.document(undefined);
        },
        parameterMap: (data) => {

            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            let filters = [];

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            return d;
        }
    });

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
        endPoint: () => `/odata/TradeAccounts/Default.GetTradeAccountsForDocumentsSentReport(includeClosedAccounts=${ko.unwrap(self.includeClosedTradeAccounts)}, includeDeletedAccounts=${ko.unwrap(self.includeDeletedTradeAccounts)})`,
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

    self.documentDateRangeIdDependant = ko.observable(true);

    self.documentDateRangeId.subscribe(nv => {
        if (nv == '-2') {
            self.documentDateRangeIdDependant(undefined);
        } else {
            self.documentDateRangeIdDependant(true);
        }
    })

    self.documentDateRangeParams = kendoMDCDropDownList({
        skipCascade: false,
        label: 'Date Range',
        data: self.documentDateRanges,
        textField: 'name',
        valueField: 'dateRangeId',
        idObservable: self.documentDateRangeId,
        objObservable: self.documentDateRange,
        dependentObservable: self.documentDateRangeIdDependant,
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
            self.documentDateRangeId('');
        },
        afterClear: () => {

        }
    });

    self.documentFromDateParams = {
        label: "From Date",
        observable: self.documentFromDate,
        originalValue: self.documentFromDate(),
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
            self.documentFromDate(undefined);
            self.documentFromDateParams.observable.tempusDominus.clear();
            self.documentFromDateParams.observable.tempusDominus.updateOptions({
                display: {
                    viewMode: 'months'
                }
            })
        },
        revertible: ko.observable(true),
        revertFunction: () => {
            self.fromDate.observable(self.documentFromDateParams.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true,
    };

    self.documentToDateParams = {
        label: "To Date",
        observable: self.documentToDate,
        originalValue: self.documentToDate(),
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
            self.documentToDate(undefined);
            self.documentToDateParams.observable.tempusDominus.clear();
            self.documentToDateParams.observable.tempusDominus.updateOptions({
                display: {
                    viewMode: 'months'
                }
            })
        },
        revertible: ko.observable(true),
        revertFunction: () => {
            self.documentToDate.observable(self.documentToDateParams.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true
    };

    self.freeTextSearchParams = {
        label: 'Search',
        originalValue: self.freeTextSearch,
        observable: self.freeTextSearch,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            self.freeTextSearch(undefined)
            $(self.freeTextSearch.DOMElement).focus();
            self.pauseFreeTextSearchUpdate = true;
            self.parent.dashboard.selectedPod(undefined);
            self.refreshParent();
        },
        refreshParent: self.refreshParent,
        permitRevert: false,
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        enterKey: () => {
            self.pauseFreeTextSearchUpdate = true;
            self.refreshParent();
        }
    }

    //#endregion


    //#region Subscriptions

    self.tradeAccountId.subscribe(nv => {
        self.refreshParent();
    })

    self.documentDateRangeId.subscribe(nv => {
        if (nv != -1) {
            self.refreshParent();
        }
    });

    self.documentFromDate.subscribe(nv => {
        //console.trace();
        if (nv) {
            if (self.documentToDate() && +self.documentToDate() < nv) {
                self.documentToDate(undefined);
            }

            let oneDayMilliseconds = 1000 * 60 * 60 * 24;

            self.documentToDate.tempusDominus.updateOptions({
                restrictions: {
                    minDate: new Date(nv.getTime())// + oneDayMilliseconds)
                }
            });
        } else {

            self.documentToDate.tempusDominus.updateOptions({
                restrictions: {
                    minDate: undefined
                }
            });
        }
        self.refreshParent();
    });

    self.documentToDate.subscribe(nv => {
        //console.trace();
        if (nv) {
            if (self.documentFromDate() && +self.documentFromDate() > nv) {
                self.documentFromDate(undefined);
            }

            let oneDayMilliseconds = 1000 * 60 * 60 * 24;

            self.documentFromDate.tempusDominus.updateOptions({
                restrictions: {
                    maxDate: new Date(nv.getTime())// - oneDayMilliseconds)
                }
            });
        } else {
            self.documentFromDate.tempusDominus.updateOptions({
                restrictions: {
                    maxDate: undefined
                }
            });
        }
        self.refreshParent();
    });


    self.freeTextSearch.subscribe(nv => {
        self.freeTextSearchActual(nv);
    })

    self.freeTextSearchActual.subscribe(nv => {
        if (self.pauseFreeTextSearchUpdate == true) {
            self.pauseFreeTextSearchUpdate = false;
        } else {
            self.refreshParent();
        }
    });

    self.documentId.subscribe(nv => {
        self.refreshParent();
    });


    //#endregion


    //#region Computeds

    self.fromPreceedsTo = ko.pureComputed(() => {
        if (self.documentFromDate() && self.documentToDate()) {
            return self.documentFromDate().getTime() <= self.documentToDate().getTime();
        }
    }, self).extend({
        equal: {
            params: true,
            onlyIf: function () {
                return self.documentFromDate() && self.documentToDate()
            },
            message: 'From Date must preceed To Date'
        }
    }, self);

    //#endregion


    //#region Methods

    self.refreshParent = () => {
        self.parent.refresh();
    }

    //#endregion

    return self;
}