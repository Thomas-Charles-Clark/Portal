const tradeAccountContactsFiltersViewModel = ({
    params
} = {
    params: {}
}) => {
    let self = {};

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable('Please Wait');

    self.filtersPrefix = params?.filtersPrefix ?? '';

    self.availableSalesMarkets = ko.observableArray([]);
    self.salesMarketIds = ko.observableArray(params.salesMarketIds == '' ? [] : params.salesMarketIds?.split(',').map(m => +m));
    self.salesMarkets = ko.observableArray([]);
    self.salesMarketSelection = ko.observableArray([]); // this is just what's selected in the control, not what we pass to the fetch call
    self.salesMarketsAwaitingBinding = ko.observable(params.salesMarketIds != null && params.salesMarketIds.length > 0);
    self.salesMarketAwaitingBinding = ko.observable(params.salesMarketId != null && params.salesMarketId != '');

    self.selectedSalesMarketIds = ko.observableArray([]);

    self.salesRepresentativeId = ko.observable(params.salesRepresentativeId ?? '');
    self.salesRepresentative = ko.observable();
    self.salesRepresentativeAwaitingBinding = ko.observable(params.salesRepresentativeId != null && params.salesRepresentativeId != '');

    self.salesAgentId = ko.observable(params.salesAgentId ?? '');
    self.salesAgent = ko.observable();
    self.salesAgentAwaitingBinding = ko.observable(params.salesAgentId != null && params.salesAgentId != '');

    self.salesAreaId = ko.observable(params.salesAreaId ?? '');
    self.salesArea = ko.observable();
    self.salesAreaAwaitingBinding = ko.observable(params.salesAreaId != null && params.salesAreaId != '');

    self.countryId = ko.observable(params.countryId ?? '');
    self.country = ko.observable();
    self.countryAwaitingBinding = ko.observable(params.countryId != null && params.countryId != '');

    self.tradeAccountTypeId = ko.observable(params.tradeAccountTypeId ?? '');
    self.tradeAccountType = ko.observable();
    self.tradeAccountTypeAwaitingBinding = ko.observable(params.tradeAccountTypeId != null && params.tradeAccountTypeId != '');

    self.tradeAccountTypeGroupId = ko.observable(params.tradeAccountTypeGroupId ?? '');
    self.tradeAccountTypeGroup = ko.observable();
    self.tradeAccountTypeGroupAwaitingBinding = ko.observable(params.tradeAccountTypeGroupId != null && params.tradeAccountTypeGroupId != '');

    self.tradeAccountGroupId = ko.observable(params.tradeAccountGroupId ?? '');
    self.tradeAccountGroup = ko.observable();
    self.tradeAccountGroupAwaitingBinding = ko.observable(params.tradeAccountGroupId != null && params.tradeAccountGroupId != '');

    self.paymentTermsId = ko.observable(params.paymentTermsId ?? '');
    self.paymentTerms = ko.observable();
    self.paymentTermsAwaitingBinding = ko.observable(params.paymentTermsId != null && params.paymentTermsId != '');

    self.paymentTermsTypeId = ko.observable(params.paymentTermsTypeId ?? '');
    self.paymentTermsType = ko.observable();
    self.paymentTermsTypeAwaitingBinding = ko.observable(params.paymentTermsTypeId != null && params.paymentTermsTypeId != '');

    self.creditControllerId = ko.observable(params.creditController ?? '');
    self.creditController = ko.observable();
    self.creditControllerAwaitingBinding = ko.observable(params.creditControllerId != null && params.creditControllerId != '');

    self.creditStoppedId = ko.observable(params.creditStopped ?? '');
    self.creditStopped = ko.observable();
    self.creditStoppedAwaitingBinding = ko.observable(params.creditStoppedId != null && params.creditStoppedId != '');


    //#endregion



    //#region Methods

    self.genericUnsavedChangesClear = (e) => {
        self.checkUnsavedChangesThenClear(e);
    }

    self.checkUnsavedChangesThenClear = async (options) => {
        await self.unsavedChanges().then(() => {
            var self = options; // self is now the params of the control the user just interacted with

            if (ko.isObservableArray(self.observable)) {
                self.observable([]);
            } else {
                self.observable('');
            }
            if (self.dropDownListSettings.widget()) {
                if (ko.isObservableArray(self.observable)) {
                    self.dropDownListSettings.widget().value([]);
                } else {
                    self.dropDownListSettings.widget().value('');
                }
                self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                if (self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.label_ != null)
                    self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.label_.float(false);
            }
            if (typeof self.afterClear === 'function') {
                self.afterClear();
            }
        }).catch((e) => {
            console.error(e);
        });
    }

    self.unsavedChanges = () => {
        return new Promise((resolve, reject) => {

            //let array = [{
            //    unsavedChanges: () => false
            //}];

            let unsaved = false;// array.find(p => p.unsavedChanges());

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


    self.generateTradeAccountSuperSetParameterMap = (defaultODataOperation) => {
        return (data) => {

            let defaultOp = defaultODataOperation;

            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            let filters = [];

            let salesMarketIds = null;
            let salesRepresentativeId = null;
            let salesAgentId = null;
            let salesAreaId = null;
            let countryId = null;
            let tradeAccountGroupId = null;
            let paymentTermsId = null;
            let paymentTermsTypeId = null;
            let creditStoppedId = null;
            let tradeAccountTypeId = null;
            let tradeAccountTypeGroupId = null;
            let creditControllerId = null;
            let salesAnalysisHistoryPeriodId = null;

            if (defaultOp.indexOf("SalesMarketID") == -1) {
                salesMarketIds = self.salesMarketIds();
            } else {
                salesMarketIds = self.salesMarketIds.peek();
            }

            if (defaultOp.indexOf("SalesRepresentativeID") == -1) {
                salesRepresentativeId = self.salesRepresentativeId();
            } else {
                salesRepresentativeId = self.salesRepresentativeId.peek();
            }

            if (defaultOp.indexOf("SalesAgentID") == -1) {
                salesAgentId = self.salesAgentId();
            } else {
                salesAgentId = self.salesAgentId.peek();
            }

            if (defaultOp.indexOf("SalesAreaID") == -1) {
                salesAreaId = self.salesAreaId();
            } else {
                salesAreaId = self.salesAreaId.peek();
            }

            if (defaultOp.indexOf("CountryID") == -1) {
                countryId = self.countryId();
            } else {
                countryId = self.countryId.peek();
            }

            if (defaultOp.indexOf("TradeAccountGroupID") == -1) {
                tradeAccountGroupId = self.tradeAccountGroupId();
            } else {
                tradeAccountGroupId = self.tradeAccountGroupId.peek();
            }

            if (defaultOp.indexOf("PaymentTermsID") == -1) {
                paymentTermsId = self.paymentTermsId();
            } else {
                paymentTermsId = self.paymentTermsId.peek();
            }

            if (Object.hasOwn(self, 'salesAnalysisHistoryPeriodId')) {
                if (defaultOp.indexOf("SalesAnalysisHistoryPeriodID") == -1) {
                    salesAnalysisHistoryPeriodId = self.salesAnalysisHistoryPeriodId();
                } else {
                    salesAnalysisHistoryPeriodId = self.salesAnalysisHistoryPeriodId.peek();
                }
            }

            if (defaultOp.indexOf("PaymentTermsTypeID") == -1) {
                paymentTermsTypeId = self.paymentTermsTypeId();
            } else {
                paymentTermsTypeId = self.paymentTermsTypeId.peek();
            }

            if (defaultOp.indexOf("CreditStopped") == -1) {
                creditStoppedId = self.creditStoppedId();
            } else {
                creditStoppedId = self.creditStoppedId.peek();
            }

            if (defaultOp.indexOf("CreditController") == -1) {
                creditControllerId = self.creditControllerId();
            } else {
                creditControllerId = self.creditControllerId.peek();
            }

            if (defaultOp.indexOf("TradeAccountTypeID") == -1) {
                tradeAccountTypeId = self.tradeAccountTypeId();
            } else {
                tradeAccountTypeId = self.tradeAccountTypeId.peek();
            }

            if (defaultOp.indexOf("TradeAccountTypeGroupID") == -1) {
                tradeAccountTypeGroupId = self.tradeAccountTypeGroupId();
            } else {
                tradeAccountTypeGroupId = self.tradeAccountTypeGroupId.peek();
            }

            // product table map LatestCollectionID...

            if (defaultOp === 'TRADEACCOUNT') {
                if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "ShortLabel")) {
                    let f = data.filter.filters.find(f => f.field === "ShortLabel");
                    filters.push(`(contains(Name,'${f.value}') or startswith(Code,'${f.value}'))`);
                    //filters.push(`Code eq '${f.value}'`);
                }

                if (d.$filter) {
                    delete d.$filter;
                }
            }

            // regardless whether or not a filter has a selection it must be refreshed if ANOTHER filter changes.
            // the implementation beneath is *not quite* sufficient  

            if (defaultOp.indexOf('SalesMarketID') == -1 && salesMarketIds.length > 0) {
                let salesMarketFilters = [];

                salesMarketIds.forEach(sm => {
                    salesMarketFilters.push(`SalesMarketID eq ${sm}`);
                });

                let salesMarketFilter = salesMarketFilters.join(' or ');

                filters.push(`(${salesMarketFilter})`);
            }

            if (defaultOp.indexOf('SalesRepresentativeID') == -1 && salesRepresentativeId != '') {
                filters.push(`SalesRepresentativeID eq ${salesRepresentativeId}`);
            }

            if (defaultOp.indexOf('SalesAgentID') == -1 && salesAgentId != '') {
                filters.push(`SalesAgentID eq ${salesAgentId}`);
            }

            if (defaultOp.indexOf('SalesAreaID') == -1 && salesAreaId != '') {
                filters.push(`SalesAreaID eq ${salesAreaId}`);
            }

            if (defaultOp.indexOf('CountryID') == -1 && countryId != '') {
                filters.push(`CountryID eq ${countryId}`);
            }

            if (defaultOp.indexOf('TradeAccountGroupID') == -1 && tradeAccountGroupId != '') {
                filters.push(`TradeAccountGroupID eq ${tradeAccountGroupId}`);
            }

            if (defaultOp.indexOf('PaymentTermsID') == -1 && paymentTermsId != '') {
                filters.push(`PaymentTermsID eq ${paymentTermsId}`);
            }

            if (Object.hasOwn(self, 'salesAnalysisHistoryPeriodId')) {
                if (defaultOp.indexOf('SalesAnalysisHistoryPeriodID') == -1 && salesAnalysisHistoryPeriodId != '') {
                    filters.push(`SalesAnalysisHistoryPeriodID eq ${salesAnalysisHistoryPeriodId}`);
                }
            }

            if (defaultOp.indexOf('PaymentTermsTypeID') == -1 && paymentTermsTypeId != '') {
                if (defaultOp != 'TRADEACCOUNT') {
                    filters.push(`PaymentTermsTypeID eq ${paymentTermsTypeId}`);
                } else {
                    filters.push(`PaymentTerms/PaymentTermsTypeID eq ${paymentTermsTypeId}`);
                }
            }

            if (defaultOp.indexOf('CreditStopped') == -1 && creditStoppedId != '') {
                filters.push(`CreditStopped eq ${creditStoppedId}`);
            }

            if (defaultOp.indexOf('CreditController') == -1 && creditControllerId != '') {
                filters.push(`CreditController eq ${creditControllerId}`);
            }

            if (defaultOp.indexOf('TradeAccountTypeID') == -1 && tradeAccountTypeId != '') {
                filters.push(`TradeAccountTypeID eq ${tradeAccountTypeId}`);
            }

            if (defaultOp.indexOf('TradeAccountTypeGroupID') == -1 && tradeAccountTypeGroupId != '') {
                filters.push(`TradeAccountTypeGroupID eq ${tradeAccountTypeGroupId}`);
            }

            if (defaultOp == 'TRADEACCOUNT') {
                defaultOp = '';
            }

            d.$apply = defaultOp;

            if (filters.length) {
                let filterString = filters.join(' and ');
                d.$apply = `filter(${filterString})`;

                if (defaultOp) {
                    d.$apply = `${d.$apply}/${defaultOp}`;
                }
            }

            if (!d.$apply) {
                delete d.$apply;
            } else {
                //console.log(d.$apply);
            }

            return d;
        }
    }

    //#endregion



    //#region Components

    self.salesMarketGroupBy = `groupby((SalesMarket/SalesMarketID,SalesMarket/Code,SalesMarket/Name))/filter((SalesMarket/SalesMarketID ne null))`;

    self.salesMarketsParams = {
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: false,
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        busy: ko.observable(false),
        disable: ko.observable(false),
        locked: ko.observable(self.salesMarketIds().length > 0),
        enable: ko.observable(true),
        multiSelectSettings: {
            widget: ko.observable(),
            label: "Market(s)",
            class: "btn-sm",
            elementId: "sales-markets-prefilter",
            autoClose: "outside",
            controls: {
                selectAll: () => {
                    console.log('selectAll');
                    self.salesMarketSelection(self.salesMarketsParams.multiSelectSettings.widget().dataSource.data().map(d => d.SalesMarket.SalesMarketID));
                },
                deselectAll: () => {
                    console.log('deselectAll');
                    self.salesMarketSelection([]);
                },
                applySelection: (hide) => {
                    console.log('apply');
                    if (hide != false) {
                        bootstrap.Dropdown.getOrCreateInstance(self.salesMarketSelection.DOMElement).hide();
                    }
                    self.salesMarketIds(self.salesMarketSelection());
                }
            },
            label: ko.computed(() => {

                let plural = 's';

                let d = {
                    values: self.salesMarketIds()
                }

                let count = d.values.length;

                if (count === 1) {
                    plural = '';
                }

                if (count == 1) {
                    let rec = self.availableSalesMarkets().find(dat => dat.value == d.values[0]);
                    if (rec)
                        return rec.label;
                }

                if (count === 0) {
                    return 'Market(s)';
                } else {
                    return `${count} Market${plural} Selected`;
                }
            }, self),
            selectedState: ko.computed(() => {
                return self.salesMarketIds().length > 0;
            }, self),
            observableArray: self.salesMarketSelection,
            data: new kendo.data.DataSource({
                serverFiltering: true,
                serverSorting: true,
                serverGrouping: true,
                serverPaging: true,
                pageSize: Math.floor((300 / 34) * 4),
                type: 'odata-v4',
                transport: {
                    read: {
                        url: '/odata/MertexTradeAccountClassificationSuperSet'
                    },
                    parameterMap: self.generateTradeAccountSuperSetParameterMap(self.salesMarketGroupBy),
                    data: {}
                },
                sort: {
                    dir: 'asc',
                    field: 'SalesMarket.Name'
                },
                requestEnd: (data) => {
                    //console.log("salesMarketsParams.multiSelectSettings.dataSource.requestEnd", data);
                    if (Object.hasOwn(data, 'response') && Object.hasOwn(data.response, 'value')) {
                        self.availableSalesMarkets(data.response.value.map(d => {
                            return {
                                disabled: false,
                                value: d.SalesMarket.SalesMarketID,
                                label: d.SalesMarket.Name
                            }
                        }));
                    }
                }
            }),
            options: self.availableSalesMarkets
        },
        revertFunction: () => {

        },
        clearFunction: () => {
            self.salesMarketsParams.multiSelectSettings.controls.deselectAll();
            self.salesMarketsParams.multiSelectSettings.controls.applySelection(false);
        }
    }

    self.salesRepresentativeGroupBy = `groupby((SalesRepresentative/SalesRepresentativeID,SalesRepresentative/Code,SalesRepresentative/Name))/filter((SalesRepresentative/SalesRepresentativeID ne null))`;

    self.salesRepresentativeTemplate = (e) => {
        if (e.SalesRepresentative && e.SalesRepresentative.SalesRepresentativeID && e.SalesRepresentative.Name) {
            return `<span title="${e.SalesRepresentative.Name} (${e.SalesRepresentative.Code})">${e.SalesRepresentative.Name} (${e.SalesRepresentative.Code})</span>`;
        } else {
            return '';
        }
    }

    self.salesRepresentativeValueTemplate = (e) => {
        if (e.SalesRepresentative && e.SalesRepresentative.SalesRepresentativeID && e.SalesRepresentative.Name) {
            return `<span title="${e.SalesRepresentative.Name} (${e.SalesRepresentative.Code})">Representative: ${e.SalesRepresentative.Name} (${e.SalesRepresentative.Code})</span>`;
        } else {
            return '';
        }
    }

    self.salesRepresentativeParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Representative',
        odata: true,
        endPoint: '/odata/MertexTradeAccountClassificationSuperSet',
        textField: 'SalesRepresentative.Name',
        valueField: 'SalesRepresentative.SalesRepresentativeID',
        template: self.salesRepresentativeTemplate,
        valueTemplate: self.salesRepresentativeValueTemplate,
        idObservable: self.salesRepresentativeId,
        objObservable: self.salesRepresentative,
        locked: ko.observable(self.salesRepresentativeId() != ''),
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
            field: 'SalesRepresentative.Name'
        },
        select: function (e) {
            console.log('salesRepresentativeParams select', e);
        },
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => self.salesRepresentativeAwaitingBinding(false),
        parameterMap: self.generateTradeAccountSuperSetParameterMap(self.salesRepresentativeGroupBy),
        popupSettings: {
            appendTo: document.getElementById(`${self.filtersPrefix}sales-representative-prefilter`)
        }
    });

    self.salesAgentGroupBy = `groupby((SalesAgent/SalesAgentID,SalesAgent/Code,SalesAgent/Name))/filter((SalesAgent/SalesAgentID ne null))`;

    self.salesAgentTemplate = (e) => {
        if (e.SalesAgent && e.SalesAgent.SalesAgentID && e.SalesAgent.Name) {
            return `<span title="${e.SalesAgent.Name} (${e.SalesAgent.Code})">${e.SalesAgent.Name} (${e.SalesAgent.Code})</span>`;
        } else {
            return '';
        }
    }

    self.salesAgentValueTemplate = (e) => {
        if (e.SalesAgent && e.SalesAgent.SalesAgentID && e.SalesAgent.Name) {
            return `<span title="${e.SalesAgent.Name} (${e.SalesAgent.Code})">Agent: ${e.SalesAgent.Name} (${e.SalesAgent.Code})</span>`;
        } else {
            return '';
        }
    }

    self.salesAgentParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Agent',
        odata: true,
        endPoint: '/odata/MertexTradeAccountClassificationSuperSet',
        textField: 'SalesAgent.Name',
        valueField: 'SalesAgent.SalesAgentID',
        template: self.salesAgentTemplate,
        valueTemplate: self.salesAgentValueTemplate,
        idObservable: self.salesAgentId,
        objObservable: self.salesAgent,
        locked: ko.observable(self.salesAgentId() != ''),
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
            field: 'SalesAgent.Name'
        },
        select: function (e) {
            console.log('salesAgentParams select', e);
        },
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => self.salesAgentAwaitingBinding(false),
        parameterMap: self.generateTradeAccountSuperSetParameterMap(self.salesAgentGroupBy),
        popupSettings: {
            appendTo: document.getElementById(`${self.filtersPrefix}sales-agent-prefilter`)
        }
    });

    self.salesAreaGroupBy = `groupby((SalesArea/SalesAreaID,SalesArea/Code,SalesArea/Name))/filter((SalesArea/SalesAreaID ne null))`;

    self.salesAreaTemplate = (e) => {
        if (e.SalesArea && e.SalesArea.SalesAreaID && e.SalesArea.Name) {
            return `<span title="${e.SalesArea.Name} (${e.SalesArea.Code})">${e.SalesArea.Name} (${e.SalesArea.Code})</span>`;
        } else {
            return '';
        }
    }

    self.salesAreaValueTemplate = (e) => {
        if (e.SalesArea && e.SalesArea.SalesAreaID && e.SalesArea.Name) {
            return `<span title="${e.SalesArea.Name} (${e.SalesArea.Code})">Area: ${e.SalesArea.Name} (${e.SalesArea.Code})</span>`;
        } else {
            return '';
        }
    }

    self.salesAreaParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Area',
        odata: true,
        endPoint: '/odata/MertexTradeAccountClassificationSuperSet',
        textField: 'SalesArea.Name',
        valueField: 'SalesArea.SalesAreaID',
        virtual: false,
        template: self.salesAreaTemplate,
        valueTemplate: self.salesAreaValueTemplate,
        idObservable: self.salesAreaId,
        objObservable: self.salesArea,
        locked: ko.observable(self.salesAreaId() != ''),
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
            field: 'SalesArea.Name'
        },
        select: function (e) {
            console.log('salesAreaParams select', e);
        },
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => self.salesAreaAwaitingBinding(false),
        parameterMap: self.generateTradeAccountSuperSetParameterMap(self.salesAreaGroupBy),
        popupSettings: {
            appendTo: document.getElementById(`${self.filtersPrefix}sales-area-prefilter`)
        }
    });

    self.countryGroupBy = `groupby((Country/CountryID,Country/Name))/filter((Country/CountryID ne null))`;

    self.countryTemplate = (e) => {
        if (e.Country && e.Country.CountryID && e.Country.Name) {
            return `<span title="${e.Country.Name}">${e.Country.Name}</span>`;
        } else {
            return '';
        }
    }

    self.countryValueTemplate = (e) => {
        if (e.Country && e.Country.CountryID && e.Country.Name) {
            return `<span title="${e.Country.Name}">Country: ${e.Country.Name}</span>`;
        } else {
            return '';
        }
    }

    self.countryParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Country',
        odata: true,
        endPoint: '/odata/MertexTradeAccountClassificationSuperSet',
        textField: 'Country.Name',
        valueField: 'Country.CountryID',
        virtual: false,
        template: self.countryTemplate,
        valueTemplate: self.countryValueTemplate,
        idObservable: self.countryId,
        objObservable: self.country,
        locked: ko.observable(self.countryId() != ''),
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
            field: 'Country.Name'
        },
        select: function (e) {
            console.log('countryParams select', e);
        },
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => self.countryAwaitingBinding(false),
        parameterMap: self.generateTradeAccountSuperSetParameterMap(self.countryGroupBy),
        popupSettings: {
            appendTo: document.getElementById(`${self.filtersPrefix}country-prefilter`)
        }
    });

    self.tradeAccountTypeGroupBy = `groupby((TradeAccountType/TradeAccountTypeID,TradeAccountType/Name))/filter((TradeAccountType/TradeAccountTypeID ne null))`;

    self.tradeAccountTypeTemplate = (e) => {
        if (e.TradeAccountType && e.TradeAccountType.TradeAccountTypeID && e.TradeAccountType.Name) {
            return `<span title="${e.TradeAccountType.Name}">${e.TradeAccountType.Name}</span>`;
        } else {
            return '';
        }
    }

    self.tradeAccountTypeValueTemplate = (e) => {
        if (e.TradeAccountType && e.TradeAccountType.TradeAccountTypeID && e.TradeAccountType.Name) {
            return `<span title="${e.TradeAccountType.Name}">Trade Account Type: ${e.TradeAccountType.Name}</span>`;
        } else {
            return '';
        }
    }

    self.tradeAccountTypeParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Trade Account Type',
        odata: true,
        endPoint: '/odata/MertexTradeAccountClassificationSuperSet',
        textField: 'TradeAccountType.Name',
        valueField: 'TradeAccountType.TradeAccountTypeID',
        template: self.tradeAccountTypeTemplate,
        valueTemplate: self.tradeAccountTypeValueTemplate,
        idObservable: self.tradeAccountTypeId,
        objObservable: self.tradeAccountType,
        locked: ko.observable(self.tradeAccountTypeId() != ''),
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
            field: 'TradeAccountType.Name'
        },
        select: function (e) {
            console.log('tradeAccountType select', e);
        },
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => self.tradeAccountTypeAwaitingBinding(false),
        parameterMap: self.generateTradeAccountSuperSetParameterMap(self.tradeAccountTypeGroupBy),
        popupSettings: {
            appendTo: document.getElementById(`${self.filtersPrefix}trade-account-type-prefilter`)
        }
    });

    self.tradeAccountTypeGroupGroupBy = `groupby((TradeAccountTypeGroup/TradeAccountTypeGroupID,TradeAccountTypeGroup/Name))/filter((TradeAccountTypeGroup/TradeAccountTypeGroupID ne null))`;

    self.tradeAccountTypeGroupTemplate = (e) => {
        if (e.TradeAccountTypeGroup && e.TradeAccountTypeGroup.TradeAccountTypeGroupID && e.TradeAccountTypeGroup.Name) {
            return `<span title="${e.TradeAccountTypeGroup.Name}">${e.TradeAccountTypeGroup.Name}</span>`;
        } else {
            return '';
        }
    }

    self.tradeAccountTypeGroupValueTemplate = (e) => {
        if (e.TradeAccountTypeGroup && e.TradeAccountTypeGroup.TradeAccountTypeGroupID && e.TradeAccountTypeGroup.Name) {
            return `<span title="${e.TradeAccountTypeGroup.Name}">Trade Account Type Group: ${e.TradeAccountTypeGroup.Name}</span>`;
        } else {
            return '';
        }
    }

    self.tradeAccountTypeGroupParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Trade Account Type Group',
        odata: true,
        endPoint: '/odata/MertexTradeAccountClassificationSuperSet',
        textField: 'TradeAccountTypeGroup.Name',
        valueField: 'TradeAccountTypeGroup.TradeAccountTypeGroupID',
        template: self.tradeAccountTypeGroupTemplate,
        valueTemplate: self.tradeAccountTypeValueGroupTemplate,
        idObservable: self.tradeAccountTypeGroupId,
        objObservable: self.tradeAccountTypeGroup,
        locked: ko.observable(self.tradeAccountTypeGroupId() != ''),
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
            field: 'TradeAccountTypeGroup.Name'
        },
        select: function (e) {
            console.log('tradeAccountTypeGroup select', e);
        },
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => self.tradeAccountTypeGroupAwaitingBinding(false),
        parameterMap: self.generateTradeAccountSuperSetParameterMap(self.tradeAccountTypeGroupGroupBy),
        popupSettings: {
            appendTo: document.getElementById(`${self.filtersPrefix}trade-account-type-group-prefilter`)
        }
    });

    self.tradeAccountGroupGroupBy = `groupby((TradeAccountGroup/TradeAccountGroupID,TradeAccountGroup/Name))/filter((TradeAccountGroup/TradeAccountGroupID ne null))`;

    self.tradeAccountGroupTemplate = (e) => {
        if (e.TradeAccountGroup && e.TradeAccountGroup.TradeAccountGroupID && e.TradeAccountGroup.Name) {
            return `<span title="${e.TradeAccountGroup.Name}">${e.TradeAccountGroup.Name}</span>`;
        } else {
            return '';
        }
    }

    self.tradeAccountGroupValueTemplate = (e) => {
        if (e.TradeAccountGroup && e.TradeAccountGroup.TradeAccountGroupID && e.TradeAccountGroup.Name) {
            return `<span title="${e.TradeAccountGroup.Name}">Trade Account Group: ${e.TradeAccountGroup.Name}</span>`;
        } else {
            return '';
        }
    }

    self.tradeAccountGroupParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Trade Account Group',
        odata: true,
        endPoint: '/odata/MertexTradeAccountClassificationSuperSet',
        textField: 'TradeAccountGroup.Name',
        valueField: 'TradeAccountGroup.TradeAccountGroupID',
        template: self.tradeAccountGroupTemplate,
        valueTemplate: self.tradeAccountGroupValueTemplate,
        idObservable: self.tradeAccountGroupId,
        objObservable: self.tradeAccountGroup,
        locked: ko.observable(self.tradeAccountGroupId() != ''),
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
            field: 'TradeAccountGroup.Name'
        },
        select: function (e) {
            console.log('tradeAccountGroup select', e);
        },
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => self.tradeAccountGroupAwaitingBinding(false),
        parameterMap: self.generateTradeAccountSuperSetParameterMap(self.tradeAccountGroupGroupBy),
        popupSettings: {
            appendTo: document.getElementById(`${self.filtersPrefix}trade-account-group-prefilter`)
        }
    });

    self.paymentTermsGroupBy = `groupby((PaymentTerms/PaymentTermsID,PaymentTerms/Name))/filter((PaymentTerms/PaymentTermsID ne null))`;

    self.paymentTermsTemplate = (e) => {
        if (e.PaymentTerms && e.PaymentTerms.PaymentTermsID && e.PaymentTerms.Name) {
            return `<span title="${e.PaymentTerms.Name}">${e.PaymentTerms.Name}</span>`;
        } else {
            return '';
        }
    }

    self.paymentTermsValueTemplate = (e) => {
        if (e.PaymentTerms && e.PaymentTerms.PaymentTermsID && e.PaymentTerms.Name) {
            return `<span title="${e.PaymentTerms.Name}">Payment Terms: ${e.PaymentTerms.Name}</span>`;
        } else {
            return '';
        }
    }

    self.paymentTermsParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Payment Terms',
        odata: true,
        endPoint: '/odata/MertexTradeAccountClassificationSuperSet',
        textField: 'PaymentTerms.Name',
        valueField: 'PaymentTerms.PaymentTermsID',
        template: self.paymentTermsTemplate,
        valueTemplate: self.paymentTermsValueTemplate,
        idObservable: self.paymentTermsId,
        objObservable: self.paymentTerms,
        locked: ko.observable(self.paymentTermsId() != ''),
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
            field: 'PaymentTerms.Name'
        },
        select: function (e) {
            console.log('paymentTerms select', e);
        },
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => self.paymentTermsAwaitingBinding(false),
        parameterMap: self.generateTradeAccountSuperSetParameterMap(self.paymentTermsGroupBy),
        popupSettings: {
            appendTo: document.getElementById(`${self.filtersPrefix}payment-terms-prefilter`)
        }
    });

    self.paymentTermsTypeGroupBy = `groupby((PaymentTermsType/PaymentTermsTypeID,PaymentTermsType/Name))/filter((PaymentTermsType/PaymentTermsTypeID ne null))`;

    self.paymentTermsTypeTemplate = (e) => {
        if (e.PaymentTermsType && e.PaymentTermsType.PaymentTermsTypeID && e.PaymentTermsType.Name) {
            return `<span title="${e.PaymentTermsType.Name}">${e.PaymentTermsType.Name}</span>`;
        } else {
            return '';
        }
    }

    self.paymentTermsTypeValueTemplate = (e) => {
        if (e.PaymentTermsType && e.PaymentTermsType.PaymentTermsTypeID && e.PaymentTermsType.Name) {
            return `<span title="${e.PaymentTermsType.Name}">Payment Terms Type: ${e.PaymentTermsType.Name}</span>`;
        } else {
            return '';
        }
    }

    self.paymentTermsTypeParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Payment Terms Type',
        odata: true,
        endPoint: '/odata/MertexTradeAccountClassificationSuperSet',
        textField: 'PaymentTermsType.Name',
        valueField: 'PaymentTermsType.PaymentTermsTypeID',
        template: self.paymentTermsTypeTemplate,
        valueTemplate: self.paymentTermsTypeValueTemplate,
        idObservable: self.paymentTermsTypeId,
        objObservable: self.paymentTermsType,
        locked: ko.observable(self.paymentTermsTypeId() != ''),
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
            field: 'PaymentTermsType.Name'
        },
        select: function (e) {
            console.log('paymentTermsType select', e);
        },
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => self.paymentTermsTypeAwaitingBinding(false),
        parameterMap: self.generateTradeAccountSuperSetParameterMap(self.paymentTermsTypeGroupBy),
        popupSettings: {
            appendTo: document.getElementById(`${self.filtersPrefix}payment-terms-type-prefilter`)
        }
    });

    self.creditControllerGroupBy = `groupby((CreditController/Code,CreditController/Name))/filter((CreditController/Code ne null))`;

    self.creditControllerTemplate = (e) => {
        if (e.CreditController && e.CreditController.Code && e.CreditController.Name) {
            return `<span title="${e.CreditController.Name}">${e.CreditController.Name}</span>`;
        } else {
            return '';
        }
    }

    self.creditControllerValueTemplate = (e) => {
        if (e.CreditController && e.CreditController.Code && e.CreditController.Name) {
            return `<span title="${e.CreditController.Name}">Credit Controller: ${e.CreditController.Name}</span>`;
        } else {
            return '';
        }
    }

    self.creditControllerParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Credit Controller',
        odata: true,
        endPoint: '/odata/MertexTradeAccountClassificationSuperSet',
        textField: 'CreditController.Name',
        valueField: 'CreditController.Code',
        template: self.creditControllerTemplate,
        valueTemplate: self.creditControllerValueTemplate,
        idObservable: self.creditControllerId,
        objObservable: self.creditController,
        locked: ko.observable(self.creditControllerId() != ''),
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
            field: 'CreditController.Name'
        },
        select: function (e) {
            console.log('creditController select', e);
        },
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => self.creditControllerAwaitingBinding(false),
        parameterMap: self.generateTradeAccountSuperSetParameterMap(self.creditControllerGroupBy),
        popupSettings: {
            appendTo: document.getElementById(`${self.filtersPrefix}credit-controller-prefilter`)
        }
    });

    self.creditStoppedParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Credit Stopped',
        data: [{
            name: 'Not on Stop',
            value: false
        }, {
            name: 'On Stop',
            value: true
        }],
        textField: 'name',
        valueField: 'value',
        template: self.creditStoppedTemplate,
        valueTemplate: self.creditStoppedValueTemplate,
        idObservable: self.creditStoppedId,
        objObservable: self.creditStopped,
        locked: ko.observable(self.creditStoppedId() != ''),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        select: function (e) {
            console.log('creditStopped select', e);
        },
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => self.creditStoppedAwaitingBinding(false),
        popupSettings: {
            appendTo: document.getElementById(`${self.filtersPrefix}credit-stopped-prefilter`)
        }
    });

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds

    self.salesMarketIdsCount = ko.computed(() => self.salesMarketIds().length, self);

    self.getData = ko.computed(() => {

        let salesMarketIds = [];

        ko.ignoreDependencies(() => {
            salesMarketIds = self.salesMarketIds();
        });

        let salesMarketIdsCount = self.salesMarketIdsCount();

        let result = {
            salesMarketIds: salesMarketIds,
            salesRepresentativeId: self.salesRepresentativeId(),
            salesAgentId: self.salesAgentId(),
            salesAreaId: self.salesAreaId(),
            countryId: self.countryId(),
            tradeAccountGroupId: self.tradeAccountGroupId(),
            tradeAccountTypeId: self.tradeAccountTypeId(),
            paymentTermsId: self.paymentTermsId(),
            paymentTermsTypeId: self.paymentTermsTypeId(),
            creditStopped: self.creditStoppedId(),
            creditControllerCode: self.creditControllerId() == "" ? null : self.creditControllerId(), // contol holds empty string if nothing selected; can't pass CreditControllerCode = N'' to the procedure; demands an empty test here
            tradeAccountTypeGroupId: self.tradeAccountTypeGroupId(),
            open: true,
            searchTerm: null
        };

        return result;
    }, self).extend({
        rateLimit: {
            timeout: 100,
            method: 'notifyWhenChangesStop'
        }
    });

    //#endregion





    //#region Subscriptions



    //#endregion



    //#region Events



    //#endregion


    return self;
};