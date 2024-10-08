// many observables start as and reset to the empty string
// this is for very good reason, don't go trying to change it
// related to the filter components behaving in the same way as native <select> components
// in that the value presented when an empty option is selected (selects always have a selected option), even if they don't appear to
// is the empty string.
const EMPTY_STRING = '',
    yesNoOptions = [{
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
        salesMarketIds: [],
        salesRepresentativeId: '',
        salesAgentId: '',
        tradeAccountTypeId: '',
        tradeAccountGroupId: '',
        paymentTermsId: '',
        paymentTermsTypeId: '',
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
        productId: '',
        dataSource: '',
        transactionTypeId: '',
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
    self.salesMarketIds = ko.observableArray(params.marketIds == '' ? [] : params.marketIds?.split(',').map(m => +m));
    self.salesMarkets = ko.observableArray([]);
    self.salesMarketSelection = ko.observableArray([]); // this is just what's selected in the control, not what we pass to the fetch call
    self.salesMarketsAwaitingBinding = ko.observable(params.marketIds != null && params.marketIds.length > 0);
    self.salesMarketAwaitingBinding = ko.observable(params.marketId != null && params.marketId != '');

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

    self.allocatedId = ko.observable(((params.allocated == "1") || (params.allocated == "true")) ? true : ((params.allocated == "0") || (params.allocated == "false")) ? false : '');
    self.allocated = ko.observable();

    self.dataSourceId = ko.observable(params.dataSource ?? '');
    self.dataSource = ko.observable();

    self.transactionTypeId = ko.observable(params.transactionTypeId ?? '');
    self.transactionType = ko.observable();

    //#endregion


    //#region Computeds

    self.countDisplay = ko.computed(() => {
        let count = 0;

        if (self.salesMarketIds().length)
            count++;

        if (self.countryId())
            count++;

        if (self.tradeAccountTypeId())
            count++;

        if (self.salesRepresentativeId())
            count++;

        if (self.salesAgentId())
            count++;

        if (self.salesAreaId())
            count++;

        if (self.tradeAccountGroupId())
            count++;

        if (self.paymentTermsId())
            count++;

        if (self.paymentTermsTypeId())
            count++;

        if (self.tradeAccountId())
            count++;

        if (self.orderId())
            count++;

        if (self.fromDate())
            count++;

        if (self.toDate())
            count++;

        if (self.haulierId())
            count++;

        if (self.deliveryTypeId())
            count++;

        if (self.orderTakerId())
            count++;

        if (self.productGroupId())
            count++;

        if (self.itemTypeId())
            count++;

        if (self.brandId())
            count++;

        if (self.collectionId())
            count++;

        if (self.launchId())
            count++;

        if (self.qualityId())
            count++;

        if (self.designId())
            count++;

        if (self.supplierId())
            count++;

        if (self.productId())
            count++;

        if (self.allocatedId())
            count++;

        if (self.dataSourceId())
            count++;

        if (self.transactionTypeId())
            count++;

        if (self.buyerId())
            count++;

        if (self.productStatusId())
            count++;

        let plural = 's';

        if (count == 1)
            plural = '';

        if (count > 0) {
            return `${count}&nbsp;&nbsp;Filter${plural}&nbsp;&nbsp;Selected`;
        }
    }, self);

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
            self.collectionAwaitingBinding() == false &&
            self.launchAwaitingBinding() == false &&
            self.qualityAwaitingBinding() == false &&
            self.productAwaitingBinding() == false &&
            self.buyerAwaitingBinding() == false &&
            self.productStatusAwaitingBinding() == false)
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

            self.dropDownListSettings.widget().dataSource.query({});

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

    self.salesRepresentativeParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Representative',
        odata: true,
        endPoint: '/odata/MertexTradeAccountClassificationSuperSet',
        textField: 'SalesRepresentative.Name',
        valueField: 'SalesRepresentative.SalesRepresentativeID',
        //virtual: true,
        //pageSize: 40,
        //virtualOptions: {
        //    itemHeight: 34,
        //    mapValueTo: 'dataItem',
        //    valueMapper: function (options) {
        //        if (options.value) {
        //            $.ajax({
        //                url: `/odata/SalesRepresentatives/Default.SalesRepresentativeValueMapper(salesRepresentativeId=${options.value})`,
        //                type: 'GET',
        //                success: function (data) {
        //                    options.success(data.value);
        //                }
        //            });
        //        } else {
        //            options.success();
        //        }
        //    }
        //},
        template: self.salesRepresentativeTemplate,
        valueTemplate: self.salesRepresentativeTemplate,
        idObservable: self.salesRepresentativeId,
        objObservable: self.salesRepresentative,
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

    self.salesAgentParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Agent',
        odata: true,
        endPoint: '/odata/MertexTradeAccountClassificationSuperSet',
        textField: 'SalesAgent.Name',
        valueField: 'SalesAgent.SalesAgentID',
        //virtual: true,
        //pageSize: 40,
        //virtualOptions: {
        //    itemHeight: 34,
        //    mapValueTo: 'dataItem',
        //    valueMapper: function (options) {
        //        if (options.value) {
        //            $.ajax({
        //                url: `/odata/SalesAgents/Default.SalesAgentsValueMapper(salesAgentId=${options.value})`,
        //                type: 'GET',
        //                success: function (data) {
        //                    options.success(data.value);
        //                }
        //            });
        //        } else {
        //            options.success();
        //        }
        //    }
        //},
        template: self.salesAgentTemplate,
        valueTemplate: self.salesAgentTemplate,
        idObservable: self.salesAgentId,
        objObservable: self.salesAgent,
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

    self.salesAreaParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Area',
        odata: true,
        endPoint: '/odata/MertexTradeAccountClassificationSuperSet',
        textField: 'SalesArea.Name',
        valueField: 'SalesArea.SalesAreaID',
        virtual: false,
        template: self.salesAreaTemplate,
        valueTemplate: self.salesAreaTemplate,
        idObservable: self.salesAreaId,
        objObservable: self.salesArea,
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

    self.countryParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Country',
        odata: true,
        endPoint: '/odata/MertexTradeAccountClassificationSuperSet',
        textField: 'Country.Name',
        valueField: 'Country.CountryID',
        virtual: false,
        template: self.countryTemplate,
        valueTemplate: self.countryTemplate,
        idObservable: self.countryId,
        objObservable: self.country,
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

    self.tradeAccountTypeParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Trade Account Type',
        odata: true,
        endPoint: '/odata/MertexTradeAccountClassificationSuperSet',
        textField: 'TradeAccountType.Name',
        valueField: 'TradeAccountType.TradeAccountTypeID',
        //virtual: true,
        //pageSize: 40,
        //virtualOptions: {
        //    itemHeight: 34,
        //    mapValueTo: 'dataItem',
        //    valueMapper: function (options) {
        //        if (options.value) {
        //            $.ajax({
        //                url: `/odata/TradeAccountTypes/Default.TradeAccountTypeValueMapper(tradeAccountTypeId=${options.value})`,
        //                type: 'GET',
        //                success: function (data) {
        //                    options.success(data.value);
        //                }
        //            });
        //        } else {
        //            options.success();
        //        }
        //    }
        //},
        template: self.tradeAccountTypeTemplate,
        valueTemplate: self.tradeAccountTypeTemplate,
        idObservable: self.tradeAccountTypeId,
        objObservable: self.tradeAccountType,
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

    self.tradeAccountGroupParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Trade Account Group',
        odata: true,
        endPoint: '/odata/MertexTradeAccountClassificationSuperSet',
        textField: 'TradeAccountGroup.Name',
        valueField: 'TradeAccountGroup.TradeAccountGroupID',
        //virtual: true,
        //pageSize: 40,
        //virtualOptions: {
        //    itemHeight: 34,
        //    mapValueTo: 'dataItem',
        //    valueMapper: function (options) {
        //        if (options.value) {
        //            $.ajax({
        //                url: `/odata/TradeAccountGroups/Default.TradeAccountGroupValueMapper(tradeAccountGroupId=${options.value})`,
        //                type: 'GET',
        //                success: function (data) {
        //                    options.success(data.value);
        //                }
        //            });
        //        } else {
        //            options.success();
        //        }
        //    }
        //},
        template: self.tradeAccountGroupTemplate,
        valueTemplate: self.tradeAccountGroupTemplate,
        idObservable: self.tradeAccountGroupId,
        objObservable: self.tradeAccountGroup,
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

    self.paymentTermsParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Payment Terms',
        odata: true,
        endPoint: '/odata/MertexTradeAccountClassificationSuperSet',
        textField: 'PaymentTerms.Name',
        valueField: 'PaymentTerms.PaymentTermsID',
        //virtual: true,
        //pageSize: 40,
        //virtualOptions: {
        //    itemHeight: 34,
        //    mapValueTo: 'dataItem',
        //    valueMapper: function (options) {
        //        if (options.value) {
        //            $.ajax({
        //                url: `/odata/PaymentTerms/Default.PaymentTermsValueMapper(paymentTermsId=${options.value})`,
        //                type: 'GET',
        //                success: function (data) {
        //                    options.success(data.value);
        //                }
        //            });
        //        } else {
        //            options.success();
        //        }
        //    }
        //},
        template: self.paymentTermsTemplate,
        valueTemplate: self.paymentTermsTemplate,
        idObservable: self.paymentTermsId,
        objObservable: self.paymentTerms,
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

    self.paymentTermsTypeParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Payment Terms Type',
        odata: true,
        endPoint: '/odata/MertexTradeAccountClassificationSuperSet',
        textField: 'PaymentTermsType.Name',
        valueField: 'PaymentTermsType.PaymentTermsTypeID',
        //virtual: true,
        //pageSize: 40,
        //virtualOptions: {
        //    itemHeight: 34,
        //    mapValueTo: 'dataItem',
        //    valueMapper: function (options) {
        //        if (options.value) {
        //            $.ajax({
        //                url: `/odata/PaymentTermsType/Default.PaymentTermsTypesValueMapper(paymentTermsTypeId=${options.value})`,
        //                type: 'GET',
        //                success: function (data) {
        //                    options.success(data.value);
        //                }
        //            });
        //        } else {
        //            options.success();
        //        }
        //    }
        //},
        template: self.paymentTermsTypeTemplate,
        valueTemplate: self.paymentTermsTypeTemplate,
        idObservable: self.paymentTermsTypeId,
        objObservable: self.paymentTermsType,
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
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        idObservable: self.tradeAccountId,
        objObservable: self.tradeAccount,
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
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        idObservable: self.orderId,
        objObservable: self.order,
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
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
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
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
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
            return `<span title="${e.Name}">${e.Name}</span>`
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
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
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
            let buyerId = null;
            let productStatusId = null;

            if (defaultOp.indexOf("BrandID") == -1) {
                brandId = self.brandId();
            } else {
                brandId = self.brandId.peek();
            }

            if (defaultOp.indexOf("SupplierCode") == -1) {
                supplierId = self.supplierId();
            } else {
                supplierId = self.supplierId.peek();
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
                    filters.push(`DefaultSupplier/Code eq '${supplierId}'`);
                } else {
                    filters.push(`SupplierCode eq '${supplierId}'`);
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
                    filters.push(`(startwith(Design/Name, '${f.value}'))`);

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
        //pageSize: 40,
        //virtualOptions: {
        //    itemHeight: 34,
        //    mapValueTo: 'dataItem',
        //    valueMapper: function (options) {
        //        if (options.value) {
        //            self.collectionAwaitingBinding(true);
        //            $.ajax({
        //                url: `/odata/MertexProductClassificationSuperSet?$apply=groupby((Collection/CollectionID,Collection/Name,Collection/Code))/filter((Collection/CollectionID eq ${options.value}))`,
        //                type: 'GET',
        //                success: function (data) {
        //                    options.success(data[0]);
        //                    window.setTimeout(() => {
        //                        self.collectionAwaitingBinding(false);
        //                    }, 0);
        //                }
        //            });
        //        } else {
        //            options.success()
        //        }
        //    }
        //},
        template: self.collectionTemplate,
        valueTemplate: self.collectionTemplate,
        idObservable: self.collectionId,
        objObservable: self.collection,
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
    });

    self.launchesGroupBy = `groupby((Launch/LaunchID,Launch/Name))/filter((Launch/LaunchID ne null))`;

    self.launchParams = kendoMDCDropDownList({
        label: 'Launch',
        odata: true,
        endPoint: '/odata/MertexProductClassificationSuperSet',
        textField: 'Launch.Name',
        valueField: 'Launch.LaunchID',
        virtual: false,
        //pageSize: 40,
        //virtualOptions: {
        //    itemHeight: 34,
        //    mapValueTo: 'dataItem',
        //    valueMapper: function (options) {
        //        if (options.value) {
        //            self.launchAwaitingBinding(true);
        //            $.ajax({
        //                url: `/odata/MertexProductClassificationSuperSet?$apply=groupby((Launch/LaunchID,Launch/Name))/filter((Launch/LaunchID eq ${options.value}))`,
        //                type: 'GET',
        //                success: function (data) {
        //                    options.success(data[0]);
        //                    window.setTimeout(() => {
        //                        self.launchAwaitingBinding(false);
        //                    }, 0)
        //                }
        //            });
        //        } else {
        //            options.success()
        //        }
        //    }
        //},
        idObservable: self.launchId,
        objObservable: self.launch,
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
    });

    self.qualityGroupBy = `groupby((Quality/QualityID,Quality/Code,Quality/Name))/filter((Quality/QualityID ne null))`;

    self.qualityTemplate = (e) => {
        if (e.Quality && e.Quality.QualityID && e.Quality.Name) {
            return `<span title="${e.Quality.Code} - ${e.Quality.Name}">${e.Quality.Code} - ${e.Quality.Name}</span>`;
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
        valueTemplate: self.qualityTemplate,
        idObservable: self.qualityId,
        objObservable: self.quality,
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
        valueTemplate: self.designTemplate,
        idObservable: self.designId,
        objObservable: self.design,
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


    self.supplierGroupBy = `groupby((Supplier/Code,Supplier/Name))/filter((Supplier/Code ne null))`;

    self.supplierTemplate = (e) => {
        if (e.Supplier && e.Supplier.Code && e.Supplier.Name) {
            return `<span title="${e.Supplier.Code} - ${e.Supplier.Name}">${e.Supplier.Code} - ${e.Supplier.Name}</span>`;
        } else {
            return '';
        }
    }

    self.supplierParams = kendoMDCDropDownList({
        label: 'Supplier',
        odata: true,
        endPoint: '/odata/MertexProductClassificationSuperSet',
        textField: 'Supplier.Name',
        valueField: 'Supplier.Code',
        template: self.supplierTemplate,
        valueTemplate: self.supplierTemplate,
        idObservable: self.supplierId,
        objObservable: self.supplier,
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



    self.buyerGroupBy = `groupby((Buyer/Code,Buyer/Name))/filter((Buyer/Code ne null))`;

    self.buyerTemplate = (e) => {
        if (e.Buyer && e.Buyer.Code && e.Buyer.Name) {
            return `<span title="${e.Buyer.Code} - ${e.Buyer.Name}">${e.Buyer.Code} - ${e.Buyer.Name}</span>`;
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
        valueTemplate: self.buyerTemplate,
        idObservable: self.buyerId,
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

    self.productStatusParams = kendoMDCDropDownList({
        label: 'Product Status',
        odata: true,
        endPoint: '/odata/MertexProductClassificationSuperSet',
        textField: 'ProductStatus.Name',
        valueField: 'ProductStatus.Code',
        template: self.productStatusTemplate,
        valueTemplate: self.productStatusTemplate,
        idObservable: self.productStatusId,
        objObservable: self.productStatus,
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
        endPoint: '/odata/Products/GetProductsForOrderBookSummary',
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
                        url: `/odata/Products/Default.ProductValueMapper(productId=${options.value})`,
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
            return `<span title="${e.ShortLabel}">${e.ShortLabel}</span>`
        },
        idObservable: self.productId,
        objObservable: self.product,
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
        },],
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.dataSourceId,
        objObservable: self.dataSource,
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
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        popupSettings: {
            appendTo: document.getElementById('data-source-prefilter')
        }
    });

    //#endregion


    //#region Subscriptions

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
            marketIds: self.salesMarketIds(),
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
            supplierCode: self.supplierId() || null,
            buyerCode: self.buyerId() || null,
            productStatus: self.productStatusId() || null,
            productId: self.productId() || null,
            allocated: self.allocatedId() || null,
            dataSource: self.dataSourceId() || null,
            transactionTypeId: self.transactionTypeId() || null
        };

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

    //#endregion


    //#region Events



    //#endregion

    return self;
};