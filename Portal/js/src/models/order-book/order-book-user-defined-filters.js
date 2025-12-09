// many observables start as and reset to the empty string
// this is for very good reason, don't go trying to change it
// related to the filter components behaving in the same way as native <select> components
// in that the value presented when an empty option is selected (selects always have a selected option), even if they don't appear to
// is the empty string.
const yesNoOptions = [{
        Name: 'Yes',
        Value: 'true'
    }, {
        Name: 'No',
        Value: 'false'
    }]

const orderBookUserDefinedFiltersViewModel = ({
    parent,
    params
} = {
    parent: { },
    params: {
        salesMarketId: '',
        salesMarketIds: '',
        salesRepresentativeId: '',
        salesAgentId: '',
        tradeAccountTypeId: '',
        tradeAccountGroupId: '',
        paymentTermsId: '',
        paymentTermsTypeId: '',
        creditStoppedId: '',
        tradeAccountId: '',
        orderId: '',
        fromDate: undefined,
        toDate: undefined,
        haulierId: '',
        orderTakerCode: '',
        deliveryTypeId: '',
        productGroupId: '',
        itemTypeId: '',
        brandId: '',
        collectionId: '',
        launchId: '',
        qualityId: '',
        supplierId: '',
        supplierTypeId: '',
        productId: '',
        dataSource: '',
        transactionTypeId: '',
        stockLocationCodes: '',
        buyerId: '',
        productStatusId: ''
    }
}) => {

    //#region Properties

    let self = {
        parent: parent
    };

    // this is so that the values-dropdown-container template can render a distinct id for the displaymodes

    self.initialParams = params;

    self.busy = self.parent.busy;

    self.cascadeEnabled = true; // this is defunct, remove it entirely 20/05/2024

    self.permitJsonComputation = ko.observable(true);

    self.sidebarElement = document.getElementById('filters-sidebar');

    self.sidebarCollapseElement = document.getElementById('sidebar-collapse');
    self.sidebarCollapse = bootstrap.Collapse.getOrCreateInstance(self.sidebarCollapseElement);

    //self.salesMarketId = ko.observable(params.marketId ?? '');
    //self.salesMarket = ko.observable();
    
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

    self.tradeAccountGroupId = ko.observable(params.tradeAccountGroupId ?? '');
    self.tradeAccountGroup = ko.observable();
    self.tradeAccountGroupAwaitingBinding = ko.observable(params.tradeAccountGroupId != null && params.tradeAccountGroupId != '');

    self.paymentTermsId = ko.observable(params.paymentTermsId ?? '');
    self.paymentTerms = ko.observable();
    self.paymentTermsAwaitingBinding = ko.observable(params.paymentTermsId != null && params.paymentTermsId != '');

    self.paymentTermsTypeId = ko.observable(params.paymentTermsTypeId ?? '');
    self.paymentTermsType = ko.observable();
    self.paymentTermsTypeAwaitingBinding = ko.observable(params.paymentTermsTypeId != null && params.paymentTermsTypeId != '');

    self.creditStoppedId = ko.observable(params.creditStoppedId ?? '');
    self.creditStopped = ko.observable();
    self.creditStoppedAwaitingBinding = ko.observable(params.creditStoppedId != null && params.creditStoppedId != '');

    self.tradeAccountId = ko.observable(params.tradeAccountId ?? '');
    self.tradeAccount = ko.observable();
    self.tradeAccountAwaitingBinding = ko.observable(params.tradeAccountId != null && params.tradeAccountId != '');

    self.orderId = ko.observable(params.orderId ?? '');
    self.order = ko.observable();
    self.orderAwaitingBinding = ko.observable(params.orderId != null && params.orderId != '');

    self.orderTakerId = ko.observable(params.orderTakerCode ?? '');
    self.orderTaker = ko.observable();
    self.orderTakerAwaitingBinding = ko.observable(params.orderTakerCode != null && params.orderTakerCode != '');

    self.fromDate = ko.observable(params.startDate ?? undefined);

    self.toDate = ko.observable(params.endDate ?? undefined);

    self.haulierId = ko.observable(params.haulierCode ?? '');
    self.haulier = ko.observable();
    self.haulierAwaitingBinding = ko.observable(params.haulierCode != null && params.haulierCode != '');

    self.deliveryTypeId = ko.observable(params.deliveryType ?? '');
    self.deliveryType = ko.observable();
    self.deliveryTypeAwaitingBinding = ko.observable(params.deliveryType != null && params.deliveryType != '');

    self.productGroupId = ko.observable(params.productGroupId ?? '');
    self.productGroup = ko.observable();
    self.productGroupAwaitingBinding = ko.observable(params.productGroupId != null && params.productGroupId != '');

    self.itemTypeId = ko.observable(params.itemTypeId ?? '');
    self.itemType = ko.observable();
    self.itemTypeAwaitingBinding = ko.observable(params.itemTypeId != null && params.itemTypeId != '');

    self.brandId = ko.observable(params.brandId ?? '');
    self.brand = ko.observable();
    self.brandAwaitingBinding = ko.observable(params.brandId != null && params.brandId != '');

    self.supplierId = ko.observable(params.supplierId ?? '');
    self.supplier = ko.observable();
    self.supplierAwaitingBinding = ko.observable(params.supplierId != null && params.supplierId != '');

    self.supplierTypeId = ko.observable(params.supplierTypeId ?? '');
    self.supplierType = ko.observable();
    self.supplierTypeAwaitingBinding = ko.observable(params.supplierTypeId != null && params.supplierTypeId != '');

    self.buyerId = ko.observable(params.buyerId ?? '');
    self.buyer = ko.observable();
    self.buyerAwaitingBinding = ko.observable(params.buyerId != null && params.buyerId != '');

    self.productStatusId = ko.observable(params.productStatusId ?? '');
    self.productStatus = ko.observable();
    self.productStatusAwaitingBinding = ko.observable(params.productStatusId != null && params.productStatusId != '');

    self.collectionId = ko.observable(params.collectionId ?? '');
    self.collection = ko.observable();
    self.collectionAwaitingBinding = ko.observable(params.collectionId != null && params.collectionId != '');

    self.launchId = ko.observable(params.launchId ?? '');
    self.launch = ko.observable();
    self.launchAwaitingBinding = ko.observable(params.launchId != null && params.launchId != '');

    self.qualityId = ko.observable(params.qualityId ?? '');
    self.quality = ko.observable();
    self.qualityAwaitingBinding = ko.observable(params.qualityId != null && params.qualityId != '');

    self.designId = ko.observable(params.designId ?? '');
    self.design = ko.observable();
    self.designAwaitingBinding = ko.observable(params.designId != null && params.designId != '');

    self.productId = ko.observable(params.productId ?? '');
    self.product = ko.observable();
    self.productAwaitingBinding = ko.observable(params.productId != null && params.productId != '');

    self.availableDateBases = [{
        Name: 'Order Date',
        Value: 'O'
    }, {
        Name: 'Release Date',
        Value: 'R'
    }];

    self.allocatedId = ko.observable(((params.allocated == "1") || (params.allocated == "true")) ? 'true' : ((params.allocated == "0") || (params.allocated == "false")) ? 'false' : '');
    self.allocated = ko.observable();

    self.dataSourceId = ko.observable(params.dataSource ?? '');
    self.dataSource = ko.observable();

    self.transactionTypeId = ko.observable(params.transactionTypeId ?? '');
    self.transactionType = ko.observable();


    self.availableStockLocations = ko.observableArray([]);
    self.stockLocationCodes = ko.observableArray(params.stockLocationCodes == '' ? [] : params.stockLocationCodes?.split(','));
    self.stockLocations = ko.observableArray([]);
    self.stockLocationSelection = ko.observableArray(self.stockLocationCodes()); // this is just what's selected in the control, not what we pass to the fetch call
    self.stockLocationsAwaitingBinding = ko.observable(params.stockLocationCodes != null && params.stockLocationCodes.length > 0);

    self.selectedStockLocationCodes = ko.observableArray(self.stockLocationCodes());

    // because we want this multiselect to be grouped
    self.stockLocationOrderBookGroups = ko.observableArray([]);


    self.productLifeCycleId = ko.observable(params.productLifeCycleId ?? '');
    self.productLifeCycle = ko.observable();
    self.productLifeCycleAwaitingBinding = ko.observable(params.productLifeCycleId != null && params.productLifeCycleId != '');



    //#endregion


    //#region Computeds

    self.allBound = ko.computed(() => {
        return (self.salesMarketAwaitingBinding() == false &&
            self.tradeAccountTypeAwaitingBinding() == false &&
            self.tradeAccountGroupAwaitingBinding() == false &&
            self.tradeAccountAwaitingBinding() == false &&
            self.orderAwaitingBinding() == false &&
            self.haulierAwaitingBinding() == false &&
            self.orderTakerAwaitingBinding() == false &&
            self.productGroupAwaitingBinding() == false &&
            self.itemTypeAwaitingBinding() == false &&
            self.brandAwaitingBinding() == false &&
            self.supplierAwaitingBinding() == false &&
            self.supplierTypeAwaitingBinding() == false &&
            self.collectionAwaitingBinding() == false &&
            self.launchAwaitingBinding() == false &&
            self.qualityAwaitingBinding() == false &&
            self.productAwaitingBinding() == false &&
            self.buyerAwaitingBinding() == false &&
            self.productStatusAwaitingBinding() == false &&
            self.productLifeCycleAwaitingBinding() == false)
    }, self).extend({
        rateLimit: {
            method: 'notifyWhenChangesStop',
            timeout: 100
        }
    });

    self.tradeAccountComputer = ko.observable(true).extend({
        rateLimit: {
            timeout: 0,
            method: 'notifyWhenChangesStop'
        }
    });

    //#endregion


    //#region Lifted Methods

    self.genericUnsavedChangesSelect = (e) => {
        e.preventDefault(); // this prevents the Kendo control from actively selecting the thing the user selected
        self.checkUnsavedChangesThenSelect(e); // this does our check; async promise, confirm dialog, la la la...
    }

    self.checkUnsavedChangesThenSelect = async (event) => {
        await self.unsavedChanges().then((d) => {
            //console.log('go', event.sender.options.dataValueField, event.dataItem[event.sender.options.dataValueField]);
            if (event.sender.options.dataValueField.indexOf('.') === -1) {
                event.sender._widgetOptions.value(event.dataItem[event.sender.options.dataValueField]);
            } else {
                let split = event.sender.options.dataValueField.split('.');
                let obj = event.dataItem[split.shift()];

                split.forEach(s => {
                    obj = obj[s];
                });

                event.sender._widgetOptions.value(obj);
            }

        }).catch((e) => { });
    }

    self.genericUnsavedChangesClear = (options) => {
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

            self.dropDownListSettings.widget().dataSource.read();

        }

        if (typeof self.afterClear === 'function') {
            self.afterClear();
        }

        //self.checkUnsavedChangesThenClear(e);
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

            //switch (self.view()) {
            //    case VIEW_MANAGE:
            //        array = self.filledRecords();
            //        break;
            //    case VIEW_ADD:
            //        array = self.addFilledRecords();
            //        break;
            //    default: break;
            //}

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

            if (defaultOp.indexOf("TradeAccountTypeID") == -1) {
                tradeAccountTypeId = self.tradeAccountTypeId();
            } else {
                tradeAccountTypeId = self.tradeAccountTypeId.peek();
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

            if (defaultOp.indexOf('PaymentTermsTypeID') == -1 && paymentTermsTypeId != '') {
                if (defaultOp != 'TRADEACCOUNT') {
                    filters.push(`PaymentTermsTypeID eq ${paymentTermsTypeId}`);
                } else {
                    filters.push(`PaymentTerms/PaymentTermsTypeID eq ${paymentTermsTypeId}`);
                }
            }

            if (defaultOp.indexOf('CreditStopped') == -1 && creditStoppedId != '') {
                //if (defaultOp != 'TRADEACCOUNT') {
                    filters.push(`CreditStopped eq ${creditStoppedId}`);
                //} else {
                //    filters.push(`CreditStopped eq ${creditStoppedId}`);
                //}
            }

            if (defaultOp.indexOf('TradeAccountTypeID') == -1 && tradeAccountTypeId != '') {
                filters.push(`TradeAccountTypeID eq ${tradeAccountTypeId}`);
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
                    self.availableSalesMarkets(data.response.value.map(d => {
                        return {
                            disabled: false,
                            value: d.SalesMarket.SalesMarketID,
                            label: d.SalesMarket.Name
                        }
                    }));
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
            self.tradeAccountComputer.valueHasMutated();
        },
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => self.salesRepresentativeAwaitingBinding(false),
        parameterMap: self.generateTradeAccountSuperSetParameterMap(self.salesRepresentativeGroupBy),
        popupSettings: {
            appendTo: document.getElementById('sales-representative-prefilter')
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
            self.tradeAccountComputer.valueHasMutated();
        },
        requestStart: function (e) {
            if (!self.cascadeEnabled)
                e.preventDefault();
        },
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => self.salesAgentAwaitingBinding(false),
        parameterMap: self.generateTradeAccountSuperSetParameterMap(self.salesAgentGroupBy),
        popupSettings: {
            appendTo: document.getElementById('sales-agent-prefilter')
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
            self.tradeAccountComputer.valueHasMutated();
        },
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => self.salesAreaAwaitingBinding(false),
        parameterMap: self.generateTradeAccountSuperSetParameterMap(self.salesAreaGroupBy),
        popupSettings: {
            appendTo: document.getElementById('sales-area-prefilter')
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
            self.tradeAccountComputer.valueHasMutated();
        },
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => self.countryAwaitingBinding(false),
        parameterMap: self.generateTradeAccountSuperSetParameterMap(self.countryGroupBy),
        popupSettings: {
            appendTo: document.getElementById('country-prefilter')
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
            self.tradeAccountComputer.valueHasMutated();
        },
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => self.tradeAccountTypeAwaitingBinding(false),
        parameterMap: self.generateTradeAccountSuperSetParameterMap(self.tradeAccountTypeGroupBy),
        popupSettings: {
            appendTo: document.getElementById('trade-account-type-prefilter')
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
            self.tradeAccountComputer.valueHasMutated();
        },
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => self.tradeAccountGroupAwaitingBinding(false),
        parameterMap: self.generateTradeAccountSuperSetParameterMap(self.tradeAccountGroupGroupBy),
        popupSettings: {
            appendTo: document.getElementById('trade-account-group-prefilter')
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
            self.tradeAccountComputer.valueHasMutated();
        },
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => self.paymentTermsAwaitingBinding(false),
        parameterMap: self.generateTradeAccountSuperSetParameterMap(self.paymentTermsGroupBy),
        popupSettings: {
            appendTo: document.getElementById('payment-terms-prefilter')
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
            self.tradeAccountComputer.valueHasMutated();
        },
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => self.paymentTermsTypeAwaitingBinding(false),
        parameterMap: self.generateTradeAccountSuperSetParameterMap(self.paymentTermsTypeGroupBy),
        popupSettings: {
            appendTo: document.getElementById('payment-terms-type-prefilter')
        }
    });

    self.stockLocationCodesParams = {
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: false,
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        busy: ko.observable(false),
        disable: ko.observable(self.stockLocationCodes().length > 0),
        locked: ko.observable(self.stockLocationCodes().length > 0),
        enable: ko.observable(true),
        multiSelectSettings: {
            widget: ko.observable(),
            label: "Stock Location(s)",
            class: "btn-sm",
            elementId: "stock-locations-prefilter",
            autoClose: "outside",
            //groupTemplate: "Stock Location Group: #: data #",
            controls: {
                selectAll: () => {
                    console.log('selectAll');
                    self.stockLocationSelection(self.stockLocationCodesParams.multiSelectSettings.widget().dataSource.data().map(d => d.StockLocation.Code));
                },
                deselectAll: () => {
                    console.log('deselectAll');
                    self.stockLocationSelection([]);
                },
                applySelection: (hide) => {
                    console.log('apply');
                    if (hide != false) {
                        bootstrap.Dropdown.getOrCreateInstance(self.stockLocationSelection.DOMElement).hide();
                    }
                    self.stockLocationCodes(self.stockLocationSelection());
                }
            },
            label: ko.computed(() => {

                let plural = 's';

                let d = {
                    values: self.stockLocationCodes()
                }

                let count = d.values.length;

                if (count === 1) {
                    plural = '';
                }

                if (count == 1) {
                    let rec = self.availableStockLocations().find(dat => dat.value == d.values[0]);
                    if (rec)
                        return `Stock Location: ${rec.label}`;
                }
            
                if (count === 0) {
                    return 'Stock Location(s)';
                } else {
                    let stockLocationCodesDisplay = [];

                    for (let i = 0; i < 6; i++) {
                        if (d.values.length > i)
                            stockLocationCodesDisplay.push(d.values[i]);
                    }

                    if (d.values.length > 6) {
                        stockLocationCodesDisplay.push('[...]');
                    }

                    return `${count} Stock Location${plural} Selected: ${(stockLocationCodesDisplay.join(', '))}`;
                }
            }, self),
            selectedState: ko.computed(() => {
                return self.stockLocationCodes().length > 0;
            }, self),
            observableArray: self.stockLocationSelection,
            data: new kendo.data.DataSource({
                serverFiltering: true,
                serverSorting: true,
                serverGrouping: false,
                serverPaging: true,
                type: 'odata-v4',
                transport: {
                    read: {
                        url: '/odata/StockLocations/Default.AllStockLocations()?$expand=StockLocationOrderBookGroup'
                    },
                    data: {}
                },
                sort: {
                    dir: 'asc',
                    field: 'Name'
                },
                requestEnd: (data) => {
                    console.log("Default.AllStockLocations returned", data);

                    self.availableStockLocations(data.response.value);

                    let groups = [];

                    Object.keys(Object.groupBy(self.availableStockLocations(), (item) => item.StockLocationOrderBookGroupID)).forEach(k => {

                        let entries = self.availableStockLocations().filter(sl => sl.StockLocationOrderBookGroupID == k);

                        let codes = entries.map(e => e.Code);

                        let state = ko.observable(false);

                        let group = {
                            stockLocationOrderBookGroupId: k,
                            name: entries[0].StockLocationOrderBookGroup?.Name,
                            entries: entries,
                            stockLocationCodes: codes,
                            state: state,
                            groupSortOrder: entries[0].StockLocationOrderBookGroup?.SortOrder,
                            locationSortOrder: entries[0].SortOrder,
                            toggleStockLocationCodes: () => {

                                if (state()) {
                                    self.stockLocationSelection(self.stockLocationSelection().filter(sl => codes.indexOf(sl) == -1));
                                } else {
                                    self.stockLocationSelection([...new Set(self.stockLocationSelection().concat(codes))]);
                                }

                                self.stockLocationCodes(self.stockLocationSelection());

                                state(!state());
                            }
                        }

                        groups.push(group);
                    });

                    console.log("stockLocationOrderBookGroups", groups);

                    groups = groups.sort((a, b) => {
                        if (a.groupSortOrder > b.groupSortOrder)
                            return 1;
                        if (a.groupSortOrder < b.groupSortOrder)
                            return -1;
                        return 0;
                    });

                    groups.forEach(g => {
                        g.entries = g.entries.sort((a, b) => {
                            if (a.SortOrder > b.SortOrder)
                                return 1;
                            if (a.SortOrder < b.SortOrder)
                                return -1;

                            if (a.Name > b.Name)
                                return 1;
                            if (a.Name < b.Name)
                                return -1;
                        })
                    });

                    self.stockLocationOrderBookGroups(groups);

                    //.map(d => {
                    //    return {
                    //        disabled: false,
                    //        value: d.Code,
                    //        label: d.Name
                    //    }
                    //}));
                }
            }),
            group: self.stockLocationOrderBookGroups,
            options: self.availableStockLocations
        },
        revertFunction: () => {

        },
        clearFunction: () => {
            self.stockLocationCodesParams.multiSelectSettings.controls.deselectAll();
            self.stockLocationCodesParams.multiSelectSettings.controls.applySelection(false);
        }
    }


    self.creditStoppedTemplate = (e) => {
        return `<span title="${e.name}">${e.name}</span>`;
    }

    self.creditStoppedValueTemplate = (e) => {
        if (e.name) {
            return `<span title="${e.name}">Credit Stopped: ${e.name}</span>`;
        } else {
            return '';
        }
    }

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
            self.tradeAccountComputer.valueHasMutated();
        },
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => self.creditStoppedAwaitingBinding(false),
        popupSettings: {
            appendTo: document.getElementById('credit-stopped-prefilter')
        }
    });

    self.tradeAccountParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Trade Account',
        odata: true,
        endPoint: '/odata/TradeAccounts/GetTradeAccountsForOrderBookSummary',
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
            self.tradeAccountComputer.valueHasMutated();
        },
        requestStart: function (e) {
            if (!self.cascadeEnabled)
                e.preventDefault();
        },
        dataBound: (e) => self.tradeAccountAwaitingBinding(false),
        clearFunction: self.genericUnsavedChangesClear,
        parameterMap: self.generateTradeAccountSuperSetParameterMap('TRADEACCOUNT'),
        popupSettings: {
            appendTo: document.getElementById('trade-account-prefilter')
        }
    });

    self.orderParams = kendoMDCDropDownList({
        label: 'Order ID / Reference',
        odata: true,
        endPoint: `/odata/OrderBooksGrouped/Default.GetOrdersForOrderBookSummary`,
        textField: 'ShortLabel',
        valueField: 'OrderID',
        virtual: true,
        autoBind: false,
        minLength: 1,
        enforceMinLength: true,
        pageSize: 0,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/OrderBooksGrouped/Default.OrderValueMapper(orderId='${options.value}')`,
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
            if ((e.ShortLabel != '') && (e.OrderID != null))
                return `<span title="${e.ShortLabel}">Order: ${e.ShortLabel}</span>`
            else
                return '';
        },
        idObservable: self.orderId,
        objObservable: self.order,
        locked: ko.observable(self.orderId() != ''),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'desc',
            field: 'OrderID'
        },
        dataBound: (e) => self.orderAwaitingBinding(false),
        clearFunction: self.genericUnsavedChangesClear,
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            if (data && data.filter && data.filter.filters && data.filter.filters.length) {
                data.pageSize = 40;
            } else {
                data.pageSize = 0;
            }

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            if (d.$filter && d.$filter.indexOf('contains(tolower(ShortLabel)' === 0)) {
                d.$filter = `${d.$filter.replace("ShortLabel", "CustomerOrderReference")} or ${d.$filter.replace("contains", "startswith").replace("ShortLabel", "OrderID")}`;
            }

            return d;
        },
        popupSettings: {
            appendTo: document.getElementById('order-prefilter')
        }
    });

    self.orderTakerParams = kendoMDCDropDownList({
        label: 'Order Taker',
        odata: true,
        endPoint: '/odata/OrderTakers',
        textField: 'ShortLabel',
        valueField: 'Code',
        virtual: false,
        idObservable: self.orderTakerId,
        objObservable: self.orderTaker,
        locked: ko.observable(self.orderTakerId() != ''),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        select: self.genericUnsavedChangesSelect,
        dataBound: (e) => self.orderTakerAwaitingBinding(false),
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        valueTemplate: (e) => {
            if ((e.ShortLabel != '') && (e.Code != null))
                return `<span title="${e.ShortLabel}">Order Taker: ${e.ShortLabel}</span>`
            else
                return '';
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            if (d.$filter && d.$filter.indexOf('contains(tolower(ShortLabel)' === 0)) {
                d.$filter = `${d.$filter.replace("ShortLabel", "Code")} or ${d.$filter.replace("contains", "startswith").replace("ShortLabel", "Name")}`;
            }

            return d;
        },
        sort: {
            dir: 'asc',
            field: 'Name'
        }
    });

    self.fromDateParams = {
        label: "From Date",
        observable: self.fromDate,
        originalValue: self.fromDate(),
        displayObservable: ko.observable(),
        locked: ko.observable(self.fromDate() != null),
        dateTimePickerOptions: {
            localization: {
                locale: 'en-GB',
                format: '[From Date:] dd/MM/yyyy'
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
                cellSize: '5rem'
            },
            restrictions: {
                disabledDates: []
            },
            allowInputToggle: true,
            useCurrent: false,
            keepInvalid: true,
            debug: false,
            eventHandlers: {
                onChange: (e) => {

                }
            }
        },
        clearable: ko.observable(true),
        clearFunction: () => {
            self.fromDate(undefined);
            self.fromDateParams.observable.tempusDominus.clear();
            self.fromDateParams.observable.tempusDominus.updateOptions({
                display: {
                    viewMode: 'months'
                }
            })
        },
        revertible: ko.observable(false),
        revertFunction: () => {
            self.fromDateParams.observable(self.fromDateParams.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true
    };

    self.toDateParams = {
        label: "To Date",
        observable: self.toDate,
        originalValue: self.toDate(),
        displayObservable: ko.observable(),
        locked: ko.observable(self.toDate() != null),
        dateTimePickerOptions: {
            localization: {
                locale: 'en-GB',
                format: '[To Date:] dd/MM/yyyy'
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
                cellSize: '2rem'
            },
            restrictions: {
                disabledDates: []
            },
            allowInputToggle: true,
            useCurrent: false,
            keepInvalid: true,
            debug: false,
            eventHandlers: {
                onChange: (e) => {

                }
            }
        },
        clearable: ko.observable(true),
        clearFunction: () => {
            self.toDate(undefined);
        },
        revertible: ko.observable(false),
        revertFunction: () => {
            self.toDateParams.observable(self.toDateParams.originalValue);
            self.toDateParams.observable.tempusDominus.clear();
            self.toDateParams.observable.tempusDominus.updateOptions({
                display: {
                    viewMode: 'months'
                }
            })
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true
    };

    self.haulierParams = kendoMDCDropDownList({
        label: 'Haulier',
        odata: true,
        endPoint: '/odata/Hauliers',
        textField: 'ShortLabel',
        valueField: 'Code',
        virtual: false,
        idObservable: self.haulierId,
        objObservable: self.haulier,
        locked: ko.observable(self.haulierId() != ''),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        select: self.genericUnsavedChangesSelect,
        dataBound: (e) => self.haulierAwaitingBinding(false),
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        valueTemplate: (e) => {
            if ((e.ShortLabel != '') && (e.Code != null))
                return `<span title="${e.ShortLabel}">Haulier: ${e.ShortLabel}</span>`
            else
                return '';
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            if (d.$filter && d.$filter.indexOf('contains(tolower(ShortLabel)' === 0)) {
                d.$filter = `${d.$filter.replace("ShortLabel", "Name")} or ${d.$filter.replace("contains", "startswith").replace("ShortLabel", "Code")}`;
            }

            return d;
        },
        sort: {
            dir: 'asc',
            field: 'Name'
        }
    });

    self.allocatedParams = kendoMDCDropDownList({
        label: 'Allocated',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.allocatedId,
        objObservable: self.allocated,
        locked: ko.observable(self.allocatedId() != ''),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            if (e.Name && e.Value)
                return `<span title="${e.Name}">Allocated: ${e.Name}</span>`
            else
                return '';
        },
        popupSettings: {
            appendTo: document.getElementById('allocated-prefilter')
        }
    });

    self.transactionTypeParams = kendoMDCDropDownList({
        label: 'Transaction Type',
        odata: true,
        endPoint: '/odata/transactionTypes',
        textField: 'Name',
        valueField: 'TransactionTypeID',
        idObservable: self.transactionTypeId,
        objObservable: self.transactionType,
        valueTemplate: (e) => {
            if (e.Name && e.TransactionTypeID)
                return `<span title="${e.Name}">Transaction Type: ${e.Name}</span>`;
            else
                return '';
        },
        locked: ko.observable(self.transactionTypeId() != ''),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'desc',
            field: 'TransactionTypeID'
        },
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear
    });

    self.deliveryTypeParams = kendoMDCDropDownList({
        label: 'Delivery Type',
        odata: true,
        endPoint: '/odata/DeliveryTypes',
        textField: 'ShortLabel',
        valueField: 'Code',
        virtual: false,
        idObservable: self.deliveryTypeId,
        objObservable: self.deliveryType,
        locked: ko.observable(self.deliveryTypeId() != ''),
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
            field: 'SortOrder'
        },
        select: self.genericUnsavedChangesSelect,
        dataBound: (e) => self.haulierAwaitingBinding(false),
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        valueTemplate: (e) => {
            if ((e.ShortLabel != '') && (e.Code != null))
                return `<span title="${e.ShortLabel}">Delivery Type: ${e.ShortLabel}</span>`
            else
                return '';
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            if (d.$filter && d.$filter.indexOf('contains(tolower(ShortLabel)' === 0)) {
                d.$filter = `${d.$filter.replace("ShortLabel", "Name")} or ${d.$filter.replace("contains", "startswith").replace("ShortLabel", "Code")}`;
            }

            return d;
        },
    });

    self.generateProductSuperSetParameterMap = (defaultODataOperation) => {
        return (data) => {
            let defaultOp = defaultODataOperation;

            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            d.$count = true;

            let filters = [];

            let brandId = null;
            let productGroupId = null;
            let itemTypeId = null;
            let collectionId = null;
            let launchId = null;
            let qualityId = null;
            let designId = null;
            let supplierId = null;
            let supplierTypeId = null;
            let buyerId = null;
            let productStatusId = null;

            if (defaultOp.indexOf("BrandID") == -1) {
                brandId = self.brandId();
            } else {
                brandId = self.brandId.peek();
            }

            if (defaultOp.indexOf("SupplierID") == -1) {
                supplierId = self.supplierId();
            } else {
                supplierId = self.supplierId.peek();
            }

            if (defaultOp.indexOf("SupplierTypeID") == -1) {
                supplierTypeId = self.supplierTypeId();
            } else {
                supplierTypeId = self.supplierTypeId.peek();
            }

            if (defaultOp.indexOf("BuyerCode") == -1) {
                buyerId = self.buyerId();
            } else {
                buyerId = self.buyerId.peek();
            }

            if (defaultOp.indexOf("ProductStatus") == -1) {
                productStatusId = self.productStatusId();
            } else {
                productStatusId = self.productStatusId.peek();
            }

            if (defaultOp.indexOf("ProductGroupID") == -1) {
                productGroupId = self.productGroupId();
            } else {
                productGroupId = self.productGroupId.peek();
            }

            if (defaultOp.indexOf("ItemTypeID") == -1) {
                itemTypeId = self.itemTypeId();
            } else {
                itemTypeId = self.itemTypeId.peek();
            }

            if (defaultOp.indexOf("CollectionID") == -1) {
                collectionId = self.collectionId();
            } else {
                collectionId = self.collectionId.peek();
            }

            if (defaultOp.indexOf("LaunchID") == -1) {
                launchId = self.launchId();
            } else {
                launchId = self.launchId.peek();
            }

            if (defaultOp.indexOf("QualityID") == -1) {
                qualityId = self.qualityId();
            } else {
                qualityId = self.qualityId.peek();
            }

            if (defaultOp.indexOf("DesignID") == -1) {
                designId = self.designId();
            } else {
                designId = self.designId.peek();
            }

            // product table map LatestCollectionID...

            if (defaultOp === 'PRODUCT') {
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

            if (defaultOp.indexOf('BrandID') == -1 && brandId != '') {
                filters.push(`BrandID eq ${brandId}`);
            }

            if (supplierId != '') {
                if (defaultOp === 'PRODUCT') {
                    filters.push(`DefaultSupplierID eq ${supplierId}`);
                } else {
                    filters.push(`SupplierID eq ${supplierId}`);
                }
            } else {
                if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "Supplier.Name")) {
                    let f = data.filter.filters.find(f => f.field === "Supplier.Name");
                    filters.push(`(contains(Supplier/Name, '${f.value}') or startswith(Supplier/Code,'${f.value}'))`);

                    if (d.$filter) {
                        delete d.$filter;
                    }
                }
            }


            if (supplierTypeId != '') {
                if (defaultOp === 'PRODUCT') {
                    // in this scenario we're querying the GetProductsForOrderBookSummary endpoint...
                    filters.push(`DefaultSupplier/SupplierTypeID eq ${supplierTypeId}`);
                } else {
                    // in this scenario we're querying the MertexProductClassificationSuperSet endpoint 
                    filters.push(`SupplierTypeID eq ${supplierTypeId}`);
                }
            }

            if (defaultOp.indexOf('SupplierTypeID') > -1 && supplierTypeId != '') {
                filters.push(`DefaultSupplier/SupplierTypeID eq ${supplierTypeId}`);
            }

            if (buyerId != '') {
                 filters.push(`BuyerCode eq '${buyerId}'`);
            } else {
                if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "Buyer.Name")) {
                    let f = data.filter.filters.find(f => f.field === "Buyer.Name");
                    filters.push(`(contains(BuyerName, '${f.value}') or startswith(BuyerCode,'${f.value}'))`);

                    if (d.$filter) {
                        delete d.$filter;
                    }
                }
            }

            if (productStatusId != '') {
                filters.push(`Status eq '${productStatusId}'`);
            }

            if (defaultOp.indexOf('ProductGroupID') == -1 && productGroupId != '') {
                filters.push(`ProductGroupID eq ${productGroupId}`);
            }

            if (defaultOp.indexOf('ItemTypeID') == -1 && itemTypeId != '') {
                filters.push(`ItemTypeID eq ${itemTypeId}`);
            }

            if (collectionId != '') {
                if (defaultOp != 'PRODUCT') {
                    filters.push(`CollectionID eq ${collectionId}`);
                }
            } else {
                if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "Collection.Name")) {
                    let f = data.filter.filters.find(f => f.field === "Collection.Name");
                    filters.push(`(contains(Collection/Name, '${f.value}') or startswith(Collection/Code,'${f.value}'))`);

                    if (d.$filter) {
                        delete d.$filter;
                    }
                }
            }

            if (defaultOp.indexOf('LaunchID') == -1 && launchId != '') {
                filters.push(`LaunchID eq ${launchId}`);
            }

            if (qualityId != '') {
                filters.push(`QualityID eq ${qualityId}`);
            } else {
                if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "Quality.Name")) {
                    let f = data.filter.filters.find(f => f.field === "Quality.Name");
                    filters.push(`(contains(Quality/Name, '${f.value}') or startswith(Quality/Code,'${f.value}'))`);

                    if (d.$filter) {
                        delete d.$filter;
                    }
                }
            }

            if (designId != '') {
                filters.push(`DesignID eq ${designId}`);
            } else {
                if (data.filter && data.filter.filters.length && data.filter.filters.find(f => f.field === "Design.Name")) {
                    let f = data.filter.filters.find(f => f.field === "Design.Name");
                    filters.push(`(startswith(Design/Name, '${f.value}'))`);

                    if (d.$filter) {
                        delete d.$filter;
                    }
                }
            }

            if (defaultOp == 'PRODUCT') {
                defaultOp = '';
                if (collectionId != '') {
                    filters.push(`Collections/any(c: c/CollectionID eq ${collectionId})`)
                }
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
                console.log(d.$apply);
            }

            return d;
        }
    }

    self.productGroupGroupBy = `groupby((ProductGroup/ProductGroupID,ProductGroup/Name))/filter((ProductGroup/ProductGroupID ne null))`;

    self.productGroupParams = kendoMDCDropDownList({
        label: 'Product Group',
        odata: true,
        endPoint: '/odata/MertexProductClassificationSuperSet',
        textField: 'ProductGroup.Name',
        valueField: 'ProductGroup.ProductGroupID',
        virtual: false,
        idObservable: self.productGroupId,
        objObservable: self.productGroup,
        locked: ko.observable(self.productGroupId() != ''),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: false,
        autoBind: true,
        height: 340,
        select: self.genericUnsavedChangesSelect,
        dataBound: (e) => self.productGroupAwaitingBinding(false),
        clearFunction: self.genericUnsavedChangesClear,
        parameterMap: self.generateProductSuperSetParameterMap(self.productGroupGroupBy),
        popupSettings: {
            appendTo: document.getElementById('product-group-prefilter')
        },
        sort: {
            dir: 'asc',
            field: 'ProductGroup.Name'
        },
        valueTemplate: (e) => {
            if (e.ProductGroup && e.ProductGroup.Name && e.ProductGroup.ProductGroupID)
                return `<span title="${e.ProductGroup.Name}">Product Group: ${e.ProductGroup.Name}</span>`;
            else
                return '';
        }
    });

    self.itemTypeGroupBy = `groupby((ItemType/ItemTypeID,ItemType/Name))/filter((ItemType/ItemTypeID ne null))`;

    self.itemTypeParams = kendoMDCDropDownList({
        label: 'Item Type',
        odata: true,
        endPoint: '/odata/MertexProductClassificationSuperSet', // /Default.GetItemTypesForContractPricing?
        textField: 'ItemType.Name',
        valueField: 'ItemType.ItemTypeID',
        virtual: false,
        idObservable: self.itemTypeId,
        objObservable: self.itemType,
        locked: ko.observable(self.itemTypeId() != ''),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        select: self.genericUnsavedChangesSelect,
        clearFunction: self.genericUnsavedChangesClear,
        dataBound: (e) => {
            self.itemTypeAwaitingBinding(false);
            self.itemTypeParams.enable(e.sender.dataSource.data().length != 0);
        },
        parameterMap: self.generateProductSuperSetParameterMap(self.itemTypeGroupBy),
        popupSettings: {
            appendTo: document.getElementById('product-group-prefilter')
        },
        sort: {
            field: 'ItemType.Name',
            dir: 'asc'
        },
        valueTemplate: (e) => {
            if (e.ItemType && e.ItemType.Name && e.ItemType.ItemTypeID)
                return `<span title="${e.ItemType.Name}">Item Type: ${e.ItemType.Name}</span>`;
            else
                return '';
        }
    });

    self.brandsGroupBy = `groupby((Brand/BrandID,Brand/Name))/filter((Brand/BrandID ne null))`;

    self.brandParams = kendoMDCDropDownList({
        label: 'Brand',
        odata: true,
        endPoint: '/odata/MertexProductClassificationSuperSet',
        textField: 'Brand.Name',
        valueField: 'Brand.BrandID',
        virtual: false,
        idObservable: self.brandId,
        objObservable: self.brand,
        locked: ko.observable(self.brandId() != ''),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        select: self.genericUnsavedChangesSelect,
        dataBound: (e) => self.brandAwaitingBinding(false),
        clearFunction: self.genericUnsavedChangesClear,
        parameterMap: self.generateProductSuperSetParameterMap(self.brandsGroupBy),
        sort: {
            field: 'Brand.Name',
            dir: 'asc'
        },
        valueTemplate: (e) => {
            if (e.Brand && e.Brand.Name && e.Brand.BrandID)
                return `<span title="${e.Brand.Name}">Brand: ${e.Brand.Name}</span>`;
            else
                return '';
        }
    });

    self.collectionGroupBy = `groupby((Collection/CollectionID,Collection/Name,Collection/Code))/filter((Collection/CollectionID ne null))`;

    self.collectionTemplate = (e) => {
        if (e.Collection && e.Collection.CollectionID && e.Collection.Name) {
            return `<span title="${e.Collection.Code} - ${e.Collection.Name}">${e.Collection.Code} - ${e.Collection.Name}</span>`;
        } else {
            return '';
        }
    }

    self.collectionParams = kendoMDCDropDownList({
        label: 'Collection',
        odata: true,
        endPoint: '/odata/MertexProductClassificationSuperSet',
        textField: 'Collection.Name',
        valueField: 'Collection.CollectionID',
        virtual: false,
        template: self.collectionTemplate,
        valueTemplate: self.collectionTemplate,
        idObservable: self.collectionId,
        objObservable: self.collection,
        locked: ko.observable(self.collectionId() != ''),
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
            field: 'Collection.Name'
        },
        select: self.genericUnsavedChangesSelect,
        requestStart: (e) => self.collectionAwaitingBinding(true),
        dataBound: (e) => window.setTimeout(() => {
            self.collectionAwaitingBinding(false);
        }, 0),
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('collection-prefilter')
        },
        parameterMap: self.generateProductSuperSetParameterMap(self.collectionGroupBy),
        valueTemplate: (e) => {
            if (e.Collection && e.Collection.Name && e.Collection.CollectionID)
                return `<span title="${e.Collection.Code} - ${e.Collection.Name}">Collection: ${e.Collection.Code} - ${e.Collection.Name}</span>`;
            else
                return '';
        }
    });

    self.launchesGroupBy = `groupby((Launch/LaunchID,Launch/Name))/filter((Launch/LaunchID ne null))`;

    self.launchParams = kendoMDCDropDownList({
        label: 'Launch',
        odata: true,
        endPoint: '/odata/MertexProductClassificationSuperSet',
        textField: 'Launch.Name',
        valueField: 'Launch.LaunchID',
        virtual: false,
        idObservable: self.launchId,
        objObservable: self.launch,
        locked: ko.observable(self.launchId() != ''),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'desc',
            field: 'Launch.LaunchID'
        },
        select: self.genericUnsavedChangesSelect,
        requestStart: (e) => self.launchAwaitingBinding(true),
        dataBound: (e) => window.setTimeout(() => {
            self.launchAwaitingBinding(false);
        }, 0),
        clearFunction: self.genericUnsavedChangesClear,
        parameterMap: self.generateProductSuperSetParameterMap(self.launchesGroupBy),
        valueTemplate: (e) => {
            if (e.Launch && e.Launch.Name && e.Launch.LaunchID)
                return `<span title="${e.Launch.Name}">Launch: ${e.Launch.Name}</span>`;
            else
                return '';
        }
    });

    self.qualityGroupBy = `groupby((Quality/QualityID,Quality/Code,Quality/Name))/filter((Quality/QualityID ne null))`;

    self.qualityTemplate = (e) => {
        if (e.Quality && e.Quality.QualityID && e.Quality.Name) {
            return `<span title="${e.Quality.Code} - ${e.Quality.Name}">${e.Quality.Code} - ${e.Quality.Name}</span>`;
        } else {
            return '';
        }
    }

    self.qualityValueTemplate = (e) => {
        if (e.Quality && e.Quality.QualityID && e.Quality.Name) {
            return `<span title="${e.Quality.Code} - ${e.Quality.Name}">Quality: ${e.Quality.Code} - ${e.Quality.Name}</span>`;
        } else {
            return '';
        }
    }

    self.qualityParams = kendoMDCDropDownList({
        label: 'Quality',
        odata: true,
        endPoint: '/odata/MertexProductClassificationSuperSet',
        textField: 'Quality.Name',
        valueField: 'Quality.QualityID',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    self.qualityAwaitingBinding(true);
                    $.ajax({
                        url: `groupby((Quality/QualityID,Quality/Code,Quality/Name))/filter((Quality/QualityID eq ${options.value}))`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data[0]);
                            window.setTimeout(() => {
                                self.qualityAwaitingBinding(false);
                            }, 0)
                        }
                    });
                } else {
                    options.success()
                }
            }
        },
        template: self.qualityTemplate,
        valueTemplate: self.qualityValueTemplate,
        idObservable: self.qualityId,
        objObservable: self.quality,
        locked: ko.observable(self.qualityId() != ''),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'desc',
            field: 'Quality.QualityID'
        },
        select: self.genericUnsavedChangesSelect,
        requestStart: (e) => self.qualityAwaitingBinding(true),
        dataBound: (e) => window.setTimeout(() => {
            self.qualityAwaitingBinding(false);
        }, 0),
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('quality-prefilter')
        },
        parameterMap: self.generateProductSuperSetParameterMap(self.qualityGroupBy),
    });



    self.designGroupBy = `groupby((Design/DesignID,Design/Name))/filter((Design/DesignID ne null))`;

    self.designTemplate = (e) => {
        if (e.Design && e.Design.DesignID && e.Design.Name) {
            return `<span title="${e.Design.Name}">${e.Design.Name}</span>`;
        } else {
            return '';
        }
    }

    self.designValueTemplate = (e) => {
        if (e.Design && e.Design.DesignID && e.Design.Name) {
            return `<span title="${e.Design.Name}">Design: ${e.Design.Name}</span>`;
        } else {
            return '';
        }
    }

    self.designParams = kendoMDCDropDownList({
        label: 'Design',
        odata: true,
        endPoint: '/odata/MertexProductClassificationSuperSet',
        textField: 'Design.Name',
        valueField: 'Design.DesignID',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    self.designAwaitingBinding(true)
                    $.ajax({
                        url: `/odata/MertexProductClassificationSuperSet?$apply=groupby((Design/DesignID,Design/Name))/filter((Design/DesignID eq ${options.value}))`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data);
                            window.setTimeout(() => {
                                self.designAwaitingBinding(false);
                            }, 0);
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        template: self.designTemplate,
        valueTemplate: self.designValueTemplate,
        idObservable: self.designId,
        objObservable: self.design,
        locked: ko.observable(self.designId() != ''),
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
            field: 'Design.Name'
        },
        select: self.genericUnsavedChangesSelect,
        requestStart: (e) => self.designAwaitingBinding(true),
        dataBound: (e) => window.setTimeout(() => {
            self.designAwaitingBinding(false);
        }, 0),
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('design-prefilter')
        },
        parameterMap: self.generateProductSuperSetParameterMap(self.designGroupBy),
    });


    self.supplierGroupBy = `groupby((Supplier/Code,Supplier/Name,Supplier/SupplierID))/filter((Supplier/SupplierID ne null))`;

    self.supplierTemplate = (e) => {
        if (e.Supplier && e.Supplier.Code && e.Supplier.Name) {
            return `<span title="${e.Supplier.Code} - ${e.Supplier.Name}">${e.Supplier.Code} - ${e.Supplier.Name}</span>`;
        } else {
            return '';
        }
    }

    self.supplierValueTemplate = (e) => {
        if (e.Supplier && e.Supplier.Code && e.Supplier.Name) {
            return `<span title="${e.Supplier.Code} - ${e.Supplier.Name}">Supplier: ${e.Supplier.Code} - ${e.Supplier.Name}</span>`;
        } else {
            return '';
        }
    }

    self.supplierParams = kendoMDCDropDownList({
        label: 'Supplier',
        odata: true,
        endPoint: '/odata/MertexProductClassificationSuperSet',
        textField: 'Supplier.Name',
        valueField: 'Supplier.SupplierID',
        template: self.supplierTemplate,
        valueTemplate: self.supplierValueTemplate,
        idObservable: self.supplierId,
        objObservable: self.supplier,
        locked: ko.observable(self.supplierId() != ''),
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
            field: 'Supplier.Name'
        },
        ignoreCase: false,
        select: self.genericUnsavedChangesSelect,
        requestStart: (e) => self.supplierAwaitingBinding(true),
        dataBound: (e) => window.setTimeout(() => {
            self.supplierAwaitingBinding(false);
        }, 0),
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('supplier-prefilter')
        },
        parameterMap: self.generateProductSuperSetParameterMap(self.supplierGroupBy),
    });


    self.supplierTypeTemplate = (e) => {
        if (e.SupplierType && e.SupplierType.SupplierTypeID != null && e.SupplierType.Name) {
            return `<span title="${e.SupplierType.SupplierTypeID} - ${e.SupplierType.Name}">${e.SupplierType.Name}</span>`;
        } else {
            return '';
        }
    }

    self.supplierTypeValueTemplate = (e) => {
        if (e.SupplierType && e.SupplierType.SupplierTypeID != null && e.SupplierType.Name) {
            return `<span title="${e.SupplierType.SupplierTypeID} - ${e.SupplierType.Name}">Supplier Type: ${e.SupplierType.Name}</span>`;
        } else {
            return '';
        }
    }

    self.supplierTypeGroupBy = `groupby((SupplierType/SupplierTypeID,SupplierType/Name))/filter((SupplierType/SupplierTypeID ne null))`;

    self.supplierTypeParams = kendoMDCDropDownList({
        label: 'Supplier Type',
        odata: true,
        endPoint: '/odata/MertexProductClassificationSuperSet',
        textField: 'SupplierType.Name',
        valueField: 'SupplierType.SupplierTypeID',
        template: self.supplierTypeTemplate,
        valueTemplate: self.supplierTypeValueTemplate,
        idObservable: self.supplierTypeId,
        objObservable: self.supplierType,
        locked: ko.observable(self.supplierTypeId() != ''),
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
            field: 'SupplierType.Name'
        },
        ignoreCase: false,
        select: self.genericUnsavedChangesSelect,
        requestStart: (e) => self.supplierTypeAwaitingBinding(true),
        dataBound: (e) => window.setTimeout(() => {
            self.supplierTypeAwaitingBinding(false);
        }, 0),
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('supplier-type-prefilter')
        },
        parameterMap: self.generateProductSuperSetParameterMap(self.supplierTypeGroupBy),
    });


    self.buyerGroupBy = `groupby((Buyer/Code,Buyer/Name))/filter((Buyer/Code ne null))`;

    self.buyerTemplate = (e) => {
        if (e.Buyer && e.Buyer.Code && e.Buyer.Name) {
            return `<span title="${e.Buyer.Code} - ${e.Buyer.Name}">${e.Buyer.Code} - ${e.Buyer.Name}</span>`;
        } else {
            return '';
        }
    }

    self.buyerValueTemplate = (e) => {
        if (e.Buyer && e.Buyer.Code && e.Buyer.Name) {
            return `<span title="${e.Buyer.Code} - ${e.Buyer.Name}">Buyer: ${e.Buyer.Code} - ${e.Buyer.Name}</span>`;
        } else {
            return '';
        }
    }

    self.buyerParams = kendoMDCDropDownList({
        label: 'Buyer',
        odata: true,
        endPoint: '/odata/MertexProductClassificationSuperSet',
        textField: 'Buyer.Name',
        valueField: 'Buyer.Code',
        template: self.buyerTemplate,
        valueTemplate: self.buyerValueTemplate,
        idObservable: self.buyerId,
        locked: ko.observable(self.buyerId() != ''),
        objObservable: self.buyer,
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
            field: 'Buyer.Name'
        },
        ignoreCase: false,
        select: self.genericUnsavedChangesSelect,
        requestStart: (e) => self.buyerAwaitingBinding(true),
        dataBound: (e) => window.setTimeout(() => {
            self.buyerAwaitingBinding(false);
        }, 0),
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('buyer-prefilter')
        },
        parameterMap: self.generateProductSuperSetParameterMap(self.buyerGroupBy),
    });

    self.productStatusGroupBy = `groupby((ProductStatus/Code,ProductStatus/Name))/filter((ProductStatus/Code ne null))`;

    self.productStatusTemplate = (e) => {
        if (e.ProductStatus && e.ProductStatus.Code && e.ProductStatus.Name) {
            return `<span title="${e.ProductStatus.Code} - ${e.ProductStatus.Name}">${e.ProductStatus.Code} - ${e.ProductStatus.Name}</span>`;
        } else {
            return '';
        }
    }

    self.productStatusValueTemplate = (e) => {
        if (e.ProductStatus && e.ProductStatus.Code && e.ProductStatus.Name) {
            return `<span title="${e.ProductStatus.Code} - ${e.ProductStatus.Name}">Product Status: ${e.ProductStatus.Code} - ${e.ProductStatus.Name}</span>`;
        } else {
            return '';
        }
    }

    self.productStatusParams = kendoMDCDropDownList({
        label: 'Product Status',
        odata: true,
        endPoint: '/odata/MertexProductClassificationSuperSet',
        textField: 'ProductStatus.Name',
        valueField: 'ProductStatus.Code',
        template: self.productStatusTemplate,
        valueTemplate: self.productStatusValueTemplate,
        idObservable: self.productStatusId,
        objObservable: self.productStatus,
        locked: ko.observable(self.productStatusId() != ''),
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
            field: 'ProductStatus.Name'
        },
        ignoreCase: false,
        select: self.genericUnsavedChangesSelect,
        requestStart: (e) => self.productStatusAwaitingBinding(true),
        dataBound: (e) => window.setTimeout(() => {
            self.productStatusAwaitingBinding(false);
        }, 0),
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('product-status-prefilter')
        },
        parameterMap: self.generateProductSuperSetParameterMap(self.productStatusGroupBy),
    });


    self.productDefault = 'PRODUCT';

    self.productParams = kendoMDCDropDownList({
        label: 'Product',
        odata: true,
        endPoint: '/odata/Products/GetProductsForOrderBookSummary?$expand=DefaultSupplier',
        textField: 'ShortLabel',
        valueField: 'ProductID',
        virtual: true,
        pageSize: 40,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/Products/Default.OrderBookProductValueMapper(productId=${options.value})`,
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
            if ((e.ShortLabel != '') && (e.ProductID != null))
                return `<span title="${e.ShortLabel}">Product: ${e.ShortLabel}</span>`;
            else
                return '';
        },
        idObservable: self.productId,
        objObservable: self.product,
        locked: ko.observable(self.productId() != ''),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: [{
            dir: 'desc',
            field: 'ProductFilter.ProductFilterGroup.SortOrder'
        }, {
            dir: 'desc',
            field: 'ProductFilter.SortOrder'
        }],
        select: self.genericUnsavedChangesSelect,
        requestStart: (e) => self.productAwaitingBinding(true),
        dataBound: (e) => window.setTimeout(() => {
            self.productAwaitingBinding(false);
        }, 0),
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('product-prefilter')
        },
        parameterMap: self.generateProductSuperSetParameterMap(self.productDefault)
    });

    self.productLifeCycleGroupBy = `groupby((ProductLifeCycle/ProductLifeCycleID,ProductLifeCycle/Name))/filter((ProductLifeCycle/ProductLifeCycleID ne null))`;

    self.productLifeCycleTemplate = (e) => {
        if (e.ProductLifeCycle && e.ProductLifeCycle.ProductLifeCycleID && e.ProductLifeCycle.Name) {
            return `<span title="${e.ProductLifeCycle.ProductLifeCycleID} - ${e.ProductLifeCycle.Name}">${e.ProductLifeCycle.Name}</span>`;
        } else {
            return '';
        }
    }

    self.productLifeCycleValueTemplate = (e) => {
        if (e.ProductLifeCycle && e.ProductLifeCycle.ProductLifeCycleID && e.ProductLifeCycle.Name) {
            return `<span title="${e.ProductLifeCycle.ProductLifeCycleID} - ${e.ProductLifeCycle.Name}">Product LifeCycle: ${e.ProductLifeCycle.Name}</span>`;
        } else {
            return '';
        }
    }
    self.productLifeCycleParams = kendoMDCDropDownList({
        label: 'Product LifeCycle',
        odata: true,
        endPoint: '/odata/MertexProductClassificationSuperSet',
        textField: 'ProductLifeCycle.Name',
        valueField: 'ProductLifeCycle.ProductLifeCycleID',
        template: self.productLifeCycleTemplate,
        valueTemplate: self.productLifeCycleValueTemplate,
        idObservable: self.productLifeCycleId,
        objObservable: self.productLifeCycle,
        locked: ko.observable(self.productLifeCycleId() != ''),
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
            field: 'ProductLifeCycle.ProductLifeCycleID'
        },
        ignoreCase: false,
        select: self.genericUnsavedChangesSelect,
        requestStart: (e) => self.productLifeCycleAwaitingBinding(true),
        dataBound: (e) => window.setTimeout(() => {
            self.productLifeCycleAwaitingBinding(false);
        }, 0),
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('product-lifecycle-prefilter')
        },
        parameterMap: self.generateProductSuperSetParameterMap(self.productLifeCycleGroupBy),
    });

    self.dataSourceParams = kendoMDCDropDownList({
        label: 'Data Source',
        data: [{
            Name: 'Mertex',
            Value: 'M'
        }, {
            Name: 'Portal',
            Value: 'P'
        }, {
            Name: 'Basket',
            Value: 'B'
        }, {
            Name: 'Transaction',
            Value: 'T'
        }, {
            Name: 'Import Queue',
            Value: 'I'
        }],
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.dataSourceId,
        objObservable: self.dataSource,
        locked: ko.observable(self.dataSourceId() != ''),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            if (e.Value && e.Name)
                return `<span title="${e.Name}">Data Source: ${e.Name}</span>`;
            else
                return '';
        },
        popupSettings: {
            appendTo: document.getElementById('data-source-prefilter')
        }
    });

    //#endregion


    //#region Subscriptions

    //self.creditStoppedId.subscribe(nv => {
    //    if (nv == -1) {
    //        window.setTimeout(() => {
    //            self.creditStoppedParams.clearFunction();
    //        }, 0);
    //    }
    //})

    self.tradeAccountComputer.subscribe(nv => {
        self.tradeAccountParams.dropDownListSettings.widget().dataSource.query();
    });

    self.salesMarketsParams.multiSelectSettings.widget.subscribe(nv => {
        if (self.salesMarketIds().length) {
            window.setTimeout(() => {
                self.salesMarketsParams.multiSelectSettings.widget().value(self.salesMarketIds());
                window.setTimeout(() => {
                    self.salesMarketsParams.multiSelectSettings.widget().trigger('change');
                }, 10);
            }, 0);
        }
    });

    self.stockLocationCodesParams.multiSelectSettings.widget.subscribe(nv => {
        if (self.stockLocationCodes().length) {
            window.setTimeout(() => {
                self.stockLocationCodesParams.multiSelectSettings.widget().value(self.stockLocationCodes());
                window.setTimeout(() => {
                    self.stockLocationCodesParams.multiSelectSettings.widget().trigger('change');
                }, 10);
            }, 0);
        }
    });

    self.productGroupId.subscribe(nv => {
        console.log('productGroupId subscribe hit', nv);
    });

    self.itemTypeId.subscribe(nv => {
        console.log('itemTypeId subscribe hit', nv);
    });

    self.brandId.subscribe(nv => {
        console.log('brandId subscribe hit', nv);
    });

    self.collectionId.subscribe(nv => {
        console.log('collectionId subscribe hit', nv);
    });

    self.launchId.subscribe(nv => {
        console.log('launchId subscribe hit', nv);
    });

    self.qualityId.subscribe(nv => {
        console.log('qualityId subscribe hit', nv);
    });
    
    self.designId.subscribe(nv => {
        console.log('designId subscribe hit', nv);
    });

    self.supplierId.subscribe(nv => {
        console.log('supplierId subscribe hit', nv);
    });

    self.supplierTypeId.subscribe(nv => {
        console.log('supplierTypeId subscribe hit', nv);
    });

    self.buyerId.subscribe(nv => {
        console.log('buyerId subscribe hit', nv);
    });

    self.productStatusId.subscribe(nv => {
        console.log('productStatusId subscribe hit', nv);
    });

    self.tradeAccount.subscribe(nv => {

        console.log("userDefinedFilters.tradeAccount subscribe hit", nv);

    });

    self.fromDate.subscribe(nv => {
        //console.trace();
        if (nv) {
            if (self.toDate() && +self.toDate() < nv) {
                self.toDate(undefined);
            }

            let oneDayMilliseconds = 1000 * 60 * 60 * 24;

            self.toDate.tempusDominus.updateOptions({
                restrictions: {
                    minDate: new Date(nv.getTime())// + oneDayMilliseconds)
                }
            });
        } else {

            self.toDate.tempusDominus.updateOptions({
                restrictions: {
                    minDate: undefined
                }
            });
        }
    });

    self.toDate.subscribe(nv => {
        //console.trace();
        if (nv) {
            if (self.fromDate() && +self.fromDate() > nv) {
                self.fromDate(undefined);
            }

            let oneDayMilliseconds = 1000 * 60 * 60 * 24;

            self.fromDate.tempusDominus.updateOptions({
                restrictions: {
                    maxDate: new Date(nv.getTime())// - oneDayMilliseconds)
                }
            });
        } else {
            self.fromDate.tempusDominus.updateOptions({
                restrictions: {
                    maxDate: undefined
                }
            });
        }
    });


    //#endregion


    //#region Validation Groups

    self.errors = new ko.validation.group([
        self.fromDate,
        self.toDate
    ]);

    self.errorables = ko.observableArray([
        self.fromDate,
        self.toDate
    ]);

    //#endregion


    //#region Functions

    // these id observables start as and reset to the empty string value intentionally
    // should probably set that as a constant
    self.reset = () => {

        self.salesMarketIds([]);
        self.salesMarkets([]);
        self.selectedSalesMarketIds([]);
        self.salesMarketSelection([]);
        self.salesMarketsParams.multiSelectSettings.widget().value([]);
        self.salesMarketsParams.multiSelectSettings.widget().trigger('change');

        self.countryId(EMPTY_STRING);
        self.country(undefined);

        self.tradeAccountTypeId(EMPTY_STRING);
        self.tradeAccountType(undefined);

        self.salesRepresentativeId(EMPTY_STRING);
        self.salesRepresentative(undefined);

        self.salesAgentId(EMPTY_STRING);
        self.salesAgent(undefined);

        self.salesAreaId(EMPTY_STRING);
        self.salesArea(undefined);

        self.tradeAccountGroupId(EMPTY_STRING);
        self.tradeAccountGroup(undefined);

        self.paymentTermsId(EMPTY_STRING);
        self.paymentTerms(undefined);

        self.paymentTermsTypeId(EMPTY_STRING);
        self.paymentTermsType(undefined);

        self.creditStoppedId(EMPTY_STRING);
        self.creditStopped(undefined);

        //self.tradeAccountId(EMPTY_STRING);
        //self.tradeAccount(undefined);
        self.tradeAccountParams.clearFunction();

        self.orderId(EMPTY_STRING);
        self.order(undefined);

        self.fromDate(undefined);

        self.toDate(undefined);

        self.haulierId(EMPTY_STRING);
        self.haulier(undefined);

        self.deliveryTypeId(EMPTY_STRING);
        self.deliveryType(undefined);

        self.orderTakerId(EMPTY_STRING);
        self.orderTaker(undefined);

        self.productGroupId(EMPTY_STRING);
        self.productGroup(undefined);

        self.itemTypeId(EMPTY_STRING);
        self.itemType(undefined);

        self.brandId(EMPTY_STRING);
        self.brand(undefined);

        self.collectionId(EMPTY_STRING);
        self.collection(undefined);

        self.launchId(EMPTY_STRING);
        self.launch(undefined);

        self.qualityId(EMPTY_STRING);
        self.quality(undefined);

        self.designId(EMPTY_STRING);
        self.design(undefined);

        self.supplierId(EMPTY_STRING);
        self.supplier(undefined);

        self.buyerId(EMPTY_STRING);
        self.buyer(undefined);

        self.productStatusId(EMPTY_STRING);
        self.productStatus(undefined);

        self.productId(EMPTY_STRING);
        self.product(undefined);

        self.allocatedId(EMPTY_STRING);
        self.allocated(undefined);

        self.dataSourceId(EMPTY_STRING);
        self.dataSource(undefined);

        self.transactionTypeId(EMPTY_STRING);
        self.transactionType(undefined);
    }

    self.togglePinning = (data, event) => {
        self.sidebarElement.classList.toggle('pinned');
        event && event.target.closest('button') && event.target.closest('button').blur();
    }

    self.json = ko.computed(() => {

        let result = {
            salesMarketIds: self.salesMarketIds(),
            tradeAccountTypeId: self.tradeAccountTypeId() || null,
            salesRepresentativeId: self.salesRepresentativeId() || null,
            salesAgentId: self.salesAgentId() || null,
            salesAreaId: self.salesAreaId() || null,
            countryId: self.countryId() || null,
            tradeAccountGroupId: self.tradeAccountGroupId() || null,
            paymentTermsId: self.paymentTermsId() || null,
            paymentTermsTypeId: self.paymentTermsTypeId() || null,
            tradeAccountId: self.tradeAccountId() || null,
            orderId: self.orderId() || null,
            startDate: self.fromDate() ? moment(self.fromDate()).format('YYYY/MM/DD') : null,
            endDate: self.toDate() ? moment(self.toDate()).format('YYYY/MM/DD') : null,
            haulierCode: self.haulierId() || null,
            deliveryType: self.deliveryTypeId() || null,
            orderTakerCode: self.orderTakerId() || null,
            productGroupId: self.productGroupId() || null,
            itemTypeId: self.itemTypeId() || null,
            brandId: self.brandId() || null,
            collectionId: self.collectionId() || null,
            launchId: self.launchId() || null,
            qualityId: self.qualityId() || null,
            designId: self.designId() || null,
            supplierId: self.supplierId() || null,
            supplierTypeId: self.supplierTypeId() || null,
            buyerCode: self.buyerId() || null,
            productStatus: self.productStatusId() || null,
            productId: self.productId() || null,
            allocated: self.allocatedId() || null,
            dataSource: self.dataSourceId() || null,
            transactionTypeId: self.transactionTypeId() || null,
            productLifeCycleId: self.productLifeCycleId() || null,
            stockLocationCodes: self.stockLocationCodes().length == 0 ? null : self.stockLocationCodes().join(',')
        };

        if (self.supplier()) {
            result.supplierCode = self.supplier().Supplier.Code;
        }

        console.log("userDefinedFilters.json returning", result);

        return JSON.stringify(result);

        //if (self.allBound()) {
        //} else {
        //    console.log("userDefinedFilters.json returning", undefined);
        //    return undefined;
        //}
    }).extend({
        rateLimit: {
            timeout: 100,
            method: 'notifyWhenChangesStop'
        }
    })

    self.buildCountComputer = () => {

        self.countDisplay = ko.computed(() => {

            let count = Object.keys(self)
                .filter(k => {
                    return (k.length)
                        && (k != 'initialParams')
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
                        //console.log(p);
                    }

                    return selected;
                }).length;

            let plural = 's';

            if (count == 1)
                plural = '';

            if (count > 0) {
                return `${count}&nbsp;&nbsp;Filter${plural}&nbsp;&nbsp;Selected`;
            }
        }, self);
    }

    //#endregion


    //#region Events

    self.buildCountComputer();

    //#endregion

    return self;
};