const stockManagementViewModel = ({ } = {}) => {
    let self = {};

    //#region Properties

    self.busy = ko.observable(false);

    self.overviewTabBusy = ko.observable(false);

    self.rangeTabBusy = ko.observable(false);

    self.transferTabBusy = ko.observable(false);

    self.modalBusy = ko.observable(false);

    self.modalElement = document.getElementById('-modal');

    self.modal = bootstrap.Modal.getOrCreateInstance(self.modalElement);


    self.ready = ko.observable(true);


    //#region Prefilters

    self.productTypeId = ko.observable();

    self.productType = ko.observable();

    self.branchGroupId = ko.observable(51);

    self.branchGroup = ko.observable();

    self.branchId = ko.observable();

    self.branch = ko.observable();

    self.launchId = ko.observable();

    self.launch = ko.observable();

    self.brandId = ko.observable();

    self.brand = ko.observable();

    self.colourId = ko.observable();

    self.colour = ko.observable();

    self.attributeGroupId = ko.observable();

    self.attributeGroup = ko.observable();

    self.attributeId = ko.observable();

    self.attribute = ko.observable();

    //#endregion

    //#endregion


    //#region Components

    self.productTypeParams = kendoMDCDropDownList({
        label: 'Product Type',
        odata: true,
        endPoint: '/odata/Mertex_ProductTypes?$expand=ProductType,ItemType,ProductGroup',
        textField: 'Label',
        valueField: 'ProductTypeID',
        virtual: true,
        pageSize: 20,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: `/odata/Mertex_ProductTypes/Default.Mertex_ProductTypeValueMapper(productTypeId=${options.value || "null"})?$expand=ProductType,ItemType,ProductGroup`,
                    type: 'GET',
                    success: function (data) {
                        options.success(data.value);
                        if (data.value.length == 1) {
                            self.productType(data.value[0]);
                        }
                    }
                });
            }
        },
        idObservable: self.productTypeId,
        objObservable: self.productType,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertable: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        showClear: false,
        sort: {
            dir: 'asc',
            field: 'productTypeId'
        }
    });

    self.branchGroupParams = kendoMDCDropDownList({
        label: 'Branch Group',
        odata: true,
        endPoint: '/odata/BranchGroups?$filter=PrimaryGroup eq true',
        textField: 'Name',
        valueField: 'BranchGroupID',
        virtual: true,
        pageSize: 20,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: `/odata/BranchGroups/Default.BranchGroupValueMapper(branchGroupId=${options.value || "null"})`,
                    type: 'GET',
                    success: function (data) {
                        options.success(data.value);
                        if (data.value.length == 1) {
                            self.branchGroup(data.value[0]);
                        }
                    }
                });
            }
        },
        idObservable: self.branchGroupId,
        objObservable: self.branchGroup,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertable: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        showClear: false,
        sort: {
            dir: 'asc',
            field: 'branchGroupId'
        }
    });

    self.branchParams = kendoMDCDropDownList({
        label: 'Branch',
        odata: true,
        endPoint: '/odata/Branches',
        textField: 'Name',
        valueField: 'BranchID',
        virtual: true,
        pageSize: 20,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: `/odata/Branches/Default.BranchValueMapper(branchId=${options.value || "null"})`,
                    type: 'GET',
                    success: function (data) {
                        options.success(data.value);
                        if (data.value.length == 1) {
                            self.branch(data.value[0]);
                        }
                    }
                });
            }
        },
        idObservable: self.branchId,
        objObservable: self.branch,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertable: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        showClear: false,
        sort: {
            dir: 'asc',
            field: 'branchId'
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            /// thanks, https://stackoverflow.com/questions/28995757/a-binary-operator-with-incompatible-types-was-detected-found-operand-types-edm/48919770
            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback
            delete d.$top;

            d.$count = true;

            if (self.branchGroupId()) {
                //Add filter by matching any reference containing value
                d.$filter = `BranchGroups/any(BranchGroup: BranchGroup/BranchGroupID eq ${self.branchGroupId()})`;
            }

            return d;
        }
    });

    self.launchParams = kendoMDCDropDownList({
        label: 'Launch',
        odata: true,
        endPoint: '/odata/Launches',
        textField: 'Name',
        valueField: 'LaunchID',
        virtual: true,
        pageSize: 20,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: `/odata/Launches/Default.LaunchValueMapper(launchId=${options.value || "null"})`,
                    type: 'GET',
                    success: function (data) {
                        options.success(data.value);
                        if (data.value.length == 1) {
                            self.launch(data.value[0]);
                        }
                    }
                });
            }
        },
        idObservable: self.launchId,
        objObservable: self.launch,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertable: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        showClear: false,
        sort: {
            dir: 'desc',
            field: 'launchId'
        }
    });

    self.brandParams = kendoMDCDropDownList({
        label: 'Brand',
        odata: true,
        endPoint: '/odata/Brands',
        textField: 'Name',
        valueField: 'BrandID',
        virtual: true,
        pageSize: 20,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: `/odata/Brands/Default.BrandValueMapper(brandId=${options.value || "null"})`,
                    type: 'GET',
                    success: function (data) {
                        options.success(data.value);
                        if (data.value.length == 1) {
                            self.brand(data.value[0]);
                        }
                    }
                });
            }
        },
        idObservable: self.brandId,
        objObservable: self.brand,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertable: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        showClear: false
    });

    self.colourParams = kendoMDCDropDownList({
        label: 'Colour',
        odata: true,
        endPoint: '/odata/Colours',
        textField: 'Name',
        valueField: 'ColourID',
        virtual: true,
        pageSize: 20,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: `/odata/Colours/Default.ColourValueMapper(colourId=${options.value || "null"})`,
                    type: 'GET',
                    success: function (data) {
                        options.success(data.value);
                        if (data.value.length == 1) {
                            self.colour(data.value[0]);
                        }
                    }
                });
            }
        },
        idObservable: self.colourId,
        objObservable: self.colour,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertable: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        showClear: false
    });

    self.attributeGroupParams = kendoMDCDropDownList({
        label: 'Attribute Group',
        odata: true,
        endPoint: '/odata/AttributeGroups',
        textField: 'Name',
        valueField: 'AttributeGroupID',
        virtual: true,
        pageSize: 20,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: `/odata/AttributeGroups/Default.AttributeGroupValueMapper(attributeGroupId=${options.value || "null"})`,
                    type: 'GET',
                    success: function (data) {
                        options.success(data.value);
                        if (data.value.length == 1) {
                            self.attributeGroup(data.value[0]);
                        }
                    }
                });
            }
        },
        idObservable: self.attributeGroupId,
        objObservable: self.attributeGroup,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertable: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        showClear: false
    });

    self.attributeParams = kendoMDCDropDownList({
        label: 'Attribute',
        odata: true,
        endPoint: '/odata/Attributes',
        textField: 'Name',
        valueField: 'AttributeID',
        virtual: true,
        pageSize: 20,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: `/odata/Attributes/Default.AttributeValueMapper(attributeId=${options.value || "null"})`,
                    type: 'GET',
                    success: function (data) {
                        options.success(data.value);
                        if (data.value.length == 1) {
                            self.attribute(data.value[0]);
                        }
                    }
                });
            }
        },
        idObservable: self.attributeId,
        objObservable: self.attribute,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertable: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        showClear: false,
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback
            delete d.$top;

            d.$count = true;

            if (self.attributeGroupId()) {
                //Add filter by matching any reference containing value
                d.$filter = `AttributeGroupID eq ${self.attributeGroupId()}`;
            }

            return d;
        }
    });

    //self.primaryGridDataSource = new kendo.data.DataSource({
    //    serverFiltering: true,
    //    serverSorting: true,
    //    serverGrouping: true,
    //    serverPaging: true,
    //    serverAggregates: true,
    //    pageSize: 10,
    //    type: 'odata-v4',
    //    transport: {
    //        read: {
    //            url: function () {
    //                return `/odata/RingFencePreAllocations/Default.FilterRingFencePreAllocations(tradeAccountGroupId=${(self.prefilterTradeAccountGroupId.peek() || "null")},tradeAccountId=${(self.prefilterTradeAccountId.peek() || "null")},productId=${(self.prefilterProductId.peek() || "null")})?$expand=StockLocation,Product,TradeAccount`
    //            },
    //            dataType: 'json'
    //        },
    //        parameterMap: function (options, type) {
    //            var pmap = kendo.data.transports['odata-v4'].parameterMap(options);

    //            // remove invalid parameters that web api doesn't support
    //            // thanks, https://stackoverflow.com/questions/28995757/a-binary-operator-with-incompatible-types-was-detected-found-operand-types-edm/48919770
    //            delete pmap.$inlinecount; // <-- remove inlinecount
    //            delete pmap.$format; // <-- remove format
    //            delete pmap.$callback; // <-- remove callback

    //            pmap.$count = true;

    //            if (pmap.$filter) {
    //                pmap.$filter = pmap.$filter.replace(/\'/g, '')
    //            }

    //            console.log(pmap);

    //            return pmap;
    //        }
    //    },
    //    schema: {
    //        model: {
    //            id: 'RingFencePreAllocationID',
    //            fields: {
    //                RingFencePreAllocationID: {
    //                    type: 'number',
    //                    editable: false
    //                },
    //                StockLocation: {
    //                    type: 'object',
    //                },
    //                InitialQuantity: {
    //                    type: 'number'
    //                },
    //                CurrentQuantity: {
    //                    type: 'number'
    //                },
    //                TradeAccount: {
    //                    type: 'object',
    //                    validation: {
    //                        required: true
    //                    },
    //                    defaultValue: null
    //                },
    //                Product: {
    //                    type: 'object',
    //                    validation: {
    //                        required: true
    //                    },
    //                    defaultValue: null
    //                }
    //            }
    //        },
    //        //aggregates: function (e) {
    //        //    $.get(`/odata/RingFencePreAllocations/Default.FilterRingFencePreAllocations(tradeAccountGroupId=${(self.prefilterTradeAccountGroupId.peek() || "null")},tradeAccountId=${(self.prefilterTradeAccountId.peek() || "null")},productId=${(self.prefilterProductId.peek() || "null")})?$apply=aggregate(CurrentQuantity with sum as CurrentQuantitySum, InitialQuantity with sum as InitialQuantitySum)`).then(function (d) {
    //        //        console.log(d);
    //        //        if (d != null && d.hasOwnProperty('value')) {
    //        //            if (Array.isArray(d.value) && d.value.length == 1) {
    //        //                self.currentQuantitySum(d.value[0].CurrentQuantitySum);
    //        //                self.initialQuantitySum(d.value[0].InitialQuantitySum);
    //        //            }
    //        //        }
    //        //    });
    //        //    //console.log(JSON.parse(result.responseText));
    //        //} //"AggregateResults",
    //    },
    //    //aggregate: [{
    //    //    field: 'InitialQuantity', aggregate: 'sum'
    //    //}, {
    //    //    field: 'CurrentQuantity', aggregate: 'sum'
    //    //}],
    //    requestStart: function (e) {
    //        self.busy(true);
    //    },
    //    requestEnd: function (e) {
    //        self.busy(false);
    //    }
    //});

    //self.primaryGrid = {
    //    autoBind: false,
    //    widget: ko.observable(),
    //    useKOTemplates: true,
    //    rowTemplate: 'primary-grid-row-template',
    //    data: self.primaryGridDataSource,
    //    selectable: false,
    //    columns: [{
    //        field: 'StockLocationID',
    //        title: 'Stock Location',
    //        width: 140,
    //        filterable: {
    //            multi: true,
    //            search: true,
    //            dataSource: getStockLocationIDFilterOptions(),
    //            itemTemplate: function (e) {
    //                return '<li><label class="pointer display-block"><input type="checkbox" name="' + e.field + '" value="#: data.StockLocationID #"/><span class="margin-left-5">#: data.Name || "Select All" #</span></label></li>'
    //            }
    //        }
    //    }, {
    //        field: 'InitialQuantity',
    //        title: 'Initial Quantity',
    //        width: 105,
    //        headerAttributes: {
    //            class: 'text-right'
    //        },
    //        filterable: {
    //            extra: false,
    //            operators: {
    //                number: {
    //                    gte: 'Greater than or equal to',
    //                    gt: 'Greater than',
    //                    eq: 'Equal to',
    //                    neq: 'Not equal to',
    //                    lt: 'Less than',
    //                    lte: 'Less than or equal to'
    //                }
    //            }
    //        },
    //        //aggregates: ["sum"],
    //        //footerTemplate: function (e) {
    //        //    return '<span class="display-block text-right">Total:<br/><span data-bind="text: formatNumber(initialQuantitySum(), 2, \'en-GB\')"></span></span>';
    //        //}
    //    }, {
    //        field: 'CurrentQuantity',
    //        title: 'Current Quantity',
    //        width: 105,
    //        headerAttributes: {
    //            class: 'text-right'
    //        },
    //        filterable: {
    //            extra: false,
    //            operators: {
    //                number: {
    //                    gte: 'Greater than or equal to',
    //                    gt: 'Greater than',
    //                    eq: 'Equal to',
    //                    neq: 'Not equal to',
    //                    lt: 'Less than',
    //                    lte: 'Less than or equal to'
    //                }
    //            }
    //        },
    //        //aggregates: ["sum"],
    //        //footerTemplate: function (e) {
    //        //    return '<span class="display-block text-right">Total:<br/><span data-bind="text: formatNumber(currentQuantitySum(), 2, \'en-GB\')"></span></span>';
    //        //}
    //    }, {
    //        field: 'Code',
    //        title: 'Product',
    //        width: 200,
    //        filterable: {
    //            extra: false,
    //            operators: {
    //                string: {
    //                    startswith: "Starts with",
    //                    eq: "Is equal to",
    //                    neq: "Is not equal to"
    //                }
    //            }
    //        }
    //    }, {
    //        field: 'Batch',
    //        title: 'Batch',
    //        width: 120,
    //        filterable: {
    //            extra: false,
    //            operators: {
    //                string: {
    //                    startswith: "Starts with",
    //                    eq: "Is equal to",
    //                    neq: "Is not equal to"
    //                }
    //            }
    //        }
    //    }, {
    //        field: 'Piece',
    //        title: 'Piece',
    //        width: 120,
    //        filterable: {
    //            extra: false,
    //            operators: {
    //                string: {
    //                    startswith: "Starts with",
    //                    eq: "Is equal to",
    //                    neq: "Is not equal to"
    //                }
    //            }
    //        }
    //    }, {
    //        field: 'TradeAccount',
    //        title: 'Trade Account',
    //        filterable: false
    //    }, {
    //        field: 'NoField',
    //        title: 'Controls',
    //        width: 154,
    //        filterable: false,
    //        attributes: {
    //            class: 'text-center'
    //        },
    //    }],
    //    filterMenuInit: function (e) {
    //        console.log(e);
    //        if (e.field.indexOf('Quantity') > -1) {
    //            $(e.container).css("width", "240px")
    //        }
    //    },
    //    filterable: {
    //        mode: 'menu'
    //    },
    //    filterable: true,
    //    sortable: true,
    //    pageable: true,
    //    pageSize: 10,
    //    pageable: {
    //        pageSize: 10,
    //        pageSizes: [10, 20, 50, 100, 250, 500, 'all']
    //    },
    //    dataBound: function (e) {
    //        ko.cleanNode(document.getElementsByClassName('k-grid-footer')[0]);
    //        ko.applyBindings(viewModel, document.getElementsByClassName('k-grid-footer')[0]);
    //    }
    //}

    //#endregion


    //#region Subscriptions

    self.branchGroupId.subscribe(nv => {
        self.branchParams.clearFunction();
    });

    self.attributeGroupId.subscribe(nv => {
        self.attributeParams.clearFunction();
    });

    //#endregion


    //#region Computeds

    self.secondaryFiltersVisible = ko.computed(() => {
        return self.productTypeId() && (self.branchGroupId() || self.branchId());
    }, self);

    self.productsComputer = ko.computed(() => {
        let params = {
            productTypeId: self.productTypeId(),
            launchId: self.launchId(),
            brandId: self.brandId(),
            colourId: self.colourId(),
            attributeGroupId: self.attributeGroupId(),
            attributeId: self.attributeId()
        }

        if (Object.keys(params).find(k => {
            params[k] != null && params[k] != ''
        })) {
            console.log(params);

            self.busy(true);

            fetch('/api/stockManagement/fetchProducts', {
                method: 'GET',
                headers: window.fetchHeaders,
                body: JSON.stringify(params)
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    console.log(data);

                    self.busy(false);
                })
                .catch(err => {
                    self.busy(false);
                    window.catchFetchError(err);
                });
        }
    }).extend({
        //rateLimit: {
        //    timeout: 0,
        //    method: 'notifyWhenChangesStop'
        //}
    });

    //#endregion


    //#region Methods

    self.closeModal = () => {
        self.modal.hide();
    }

    self.confirmModal = () => {
        window.showConfirm('Are you sure?', 'Put the lime in the coconut?', () => {
            self.closeModal();
        }, null);
    }

    //#endregion


    //#region Events



    //#endregion

    return self;
};