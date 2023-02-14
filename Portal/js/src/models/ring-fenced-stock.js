var ringFencedStockViewModel = ({ } = {}) => function () {
    var self = {};

    //#region Properties

    self.busy = ko.observable(false);

    self.newBusy = ko.observable(true);

    self.validateNow = ko.observable(false);
    self.validateNewRingFenceNow = ko.observable(false);

    self.ready = ko.observable(true);

    self.prefilterTradeAccountId = ko.observable(null);
    self.prefilterTradeAccount = ko.observable();

    self.prefilterTradeAccountGroupId = ko.observable(null);
    self.prefilterTradeAccountGroup = ko.observable();

    self.prefilterProductId = ko.observable(null);
    self.prefilterProduct = ko.observable();

    self.stockInfo = ko.observableArray([]);

    self.currentQuantitySum = ko.observable(0);
    self.initialQuantitySum = ko.observable(0);

    self.stockLocationId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNewRingFenceNow()
            },
            message: 'Stock Location is required'
        }
    });
    self.stockLocation = ko.observable();

    self.supplierAvailabilityMessage = ko.observable();

    self.ringFenceCurrentResults = ko.observableArray([]);

    self.prefilterExpiryDate = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow();
            },
            message: 'ExpiryDT is Required'
        }
    })

    self.expiryDateParams = {
        label: 'Expiry Date',
        observable: self.prefilterExpiryDate,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        readOnly: true,
        clearFunction: function () {
            this.observable(undefined);
        },
        dateTimePickerOptions: {
            locale: 'en-gb',
            format: 'DD/MM/YYYY',
            ignoreReadonly: true,
            showClear: true,
            allowInputToggle: true,
            sideBySide: true,
            useCurrent: true,
            minDate: new moment().add(2, 'week').toDate(),
            showClose: true,
            keepInvalid: false
        }
    };

    self.prefilterTradeAccountGroupId.extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow() && self.prefilterTradeAccount() == null
            },
            message: 'Either Trade Account Group or Trade Account are mandatory'
        },
        notEqual: {
            params: '',
            onlyIf: function () {
                return self.validateNow() && self.prefilterTradeAccount() == null
            },
            message: 'Either Trade Account Group or Trade Account are mandatory NEQ 1'
        }
    });

    self.prefilterTradeAccountId.extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow() && self.prefilterTradeAccountGroup() == null
            },
            message: 'Either Trade Account Group or Trade Account are mandatory'
        },
        notEqual: {
            params: '',
            onlyIf: function () {
                return self.validateNow() && self.prefilterTradeAccountGroup() == null
            },
            message: 'Either Trade Account Group or Trade Account are mandatory NEQ 2'
        }
    });

    self.prefilterProductId.extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'Please select a product'
        },
        notEqual: {
            params: '',
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'Please select a product'
        }
    });

    //#endregion

    //#region Computeds

    self.stockStatus = ko.pureComputed(function () {

        //if (self.parent.searchWidgetValue() == 'Paint' || self.parent.searchWidgetValue() == 'PaintSamplePot') {
        //    if (self.record.FreeStock == 999) {
        //        return 'Mixed to Order';
        //    }
        //}

        if (!self.prefilterProduct())
            return "";

        var prefix = "";

        if (self.prefilterProduct().ProductTypeID == 55 || self.prefilterProduct().ProductTypeID == 56) {

            var type = "Cuttings";

            if (self.prefilterProduct().ProductTypeID == 56) {
                type = "Returnables";
            }

            //if (self.record.ParentStockStatus) {
            //    if (self.record.ParentStockStatus.indexOf('Due') > -1) {
            //        if (self.record.ParentFreeStock == 0) {
            //            prefix = type + ' Out of Stock (' + self.record.ParentPOFreeStock + self.record.Units + ' ' + self.record.ParentStockStatus + ')' + ', ';
            //        } else {
            //            prefix = self.record.ParentFreeStock + self.record.Units + ' (' + self.record.ParentPOFreeStock + self.record.Units + ' ' + self.record.ParentStockStatus + ')' + ', ';
            //        }
            //    } else {
            //        prefix = self.record.ParentFreeStock + ' ' + type + ' ' + self.record.ParentStockStatus + '<br/>Main Product: ';
            //    }
            //}
        }

        if (self.prefilterProduct().StockStatus) {
            if (self.prefilterProduct().StockStatus.indexOf('Due') > -1) {
                if (self.prefilterProduct().FreeStock == 0) {
                    return prefix + 'Out of Stock (' + self.prefilterProduct().POFreeStock + self.prefilterProduct().Units + ' ' + self.prefilterProduct().StockStatus + ')';
                } else {
                    return prefix + self.prefilterProduct().FreeStock + self.prefilterProduct().Units + ' (' + self.prefilterProduct().POFreeStock + self.prefilterProduct().Units + ' ' + self.prefilterProduct().StockStatus + ')';
                }
            } else {
                return prefix + self.prefilterProduct().FreeStock + self.prefilterProduct().Units + '  ' + self.prefilterProduct().StockStatus;
            }
        }
    });

    self.totalNewRingFenceLength = ko.pureComputed(function () {
        if (self.stockInfo()) {
            return Enumerable.From(self.stockInfo()).Select(function (p) {
                return Enumerable.From(p.pieces).Select(function (x) {
                    return +x.ringFenceQuantity.observable() || 0;
                }).Sum()
            }).Sum()
        } else {
            return 0;
        }
    }, self);

    self.anyRingFencePieces = ko.pureComputed(function () {
        return self.totalNewRingFenceLength() > 0
    }, self);

    //#endregion

    //#region Components

    self.tradeAccountParams = kendoMDCDropDownList({
        label: 'Trade Account',
        odata: true,
        endPoint: function () {
            return `/odata/TradeAccounts/Default.TradeAccountGroupFilter(tradeAccountGroupId=${self.prefilterTradeAccountGroupId() || "null"})`;
        },
        valueField: 'TradeAccountID',
        virtual: true,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: `/odata/TradeAccounts/Default.TradeAccountValueMapper(tradeAccountId=${options.value || "null"})`,
                    type: 'GET',
                    success: function (data) {
                        options.success(data.value);
                        if (data.value.length == 1)
                            self.prefilterTradeAccount(data.value[0]);
                    }
                });
            }
        },
        idObservable: self.prefilterTradeAccountId,
        objObservable: self.prefilterTradeAccount,
        height: 340,
        template: '#: Code # - #: Name #',
        valueTemplate: '#: Code # - #: Name #',
        optionLabel: null,
        optionLabelTemplate: null,
        autoBind: true,
        height: 340,
        filtering: function (ev) {
            var filterValue = ev.filter != undefined ? ev.filter.value : "";
            ev.preventDefault();

            this.dataSource.filter({
                logic: "or",
                filters: [
                    {
                        field: "Code",
                        operator: "startswith",
                        value: filterValue
                    },
                    {
                        field: "Name",
                        operator: "contains",
                        value: filterValue
                    }
                ]
            });
        },
        popupSettings: {
            appendTo: $('#trade-account-prefilter')
        }
    });

    self.tradeAccountGroupParams = kendoMDCDropDownList({
        label: 'Trade Account Group',
        odata: true,
        endPoint: '/odata/TradeAccountGroups',
        textField: 'Name',
        valueField: 'TradeAccountGroupID',
        virtual: true,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: `/odata/TradeAccountGroups/Default.TradeAccountGroupValueMapper(tradeAccountGroupId=${options.value || "null"})`,
                    type: 'GET',
                    success: function (data) {
                        options.success(data.value);
                        if (data.value.length == 1)
                            self.prefilterTradeAccountGroup(data.value[0]);
                    }
                });
            }
        },
        idObservable: self.prefilterTradeAccountGroupId,
        objObservable: self.prefilterTradeAccountGroup,
        optionLabel: null,
        optionLabelTemplate: null,
        filter: 'contains',
        autoBind: true,
        height: 340,
        popupSettings: {
            appendTo: $('#trade-account-group-prefilter')
        }
    });

    self.productParams = kendoMDCDropDownList({
        label: 'Product',
        odata: true,
        endPoint: function () {
            return '/odata/Products/GetRingFenceableProducts()'
        },
        textField: 'OrderFormName',
        valueField: 'ProductID',
        virtual: true,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: `/odata/Products/Default.ProductValueMapper(productId=${options.value || "null"})`,
                    type: 'GET',
                    success: function (data) {
                        options.success(data.value);
                        if (data.value.length == 1)
                            self.prefilterProduct(data.value[0]);
                    }
                });
            }
        },
        idObservable: self.prefilterProductId,
        objObservable: self.prefilterProduct,
        template: function (item) {
            var imageId = Enumerable.From(item.Product_Images).Where(function (x) {
                return x.PerspectiveID == 1;
            }).Select('$.ImageID').FirstOrDefault();
            if (imageId) {
                return `<img class="thumb" src="https://www.designersguild.com/image/90/${imageId}"/> ${item.Code} - ${item.OrderFormName}`;
            } else {
                return `${item.Code} - ${item.OrderFormName}`;
            }
        },
        valueTemplate: '#: Code # - #: OrderFormName #',
        optionLabel: null,
        optionLabelTemplate: null,
        filtering: function (ev) {
            var filterValue = ev.filter != undefined ? ev.filter.value : "";
            ev.preventDefault();
            this.dataSource.filter({
                logic: 'or',
                filters: [
                    {
                        field: 'OrderFormName',
                        operator: 'contains',
                        value: filterValue
                    },
                    {
                        field: 'BasketName',
                        operator: 'contains',
                        value: filterValue
                    },
                    {
                        field: 'Code',
                        operator: 'startswith',
                        value: filterValue
                    }
                ]
            })
        },
        autoBind: true,
        height: 340,
        //dataBound: function(e) {
        //    var listContainer = e.sender.list.closest(".k-list-container");
        //    listContainer.width(listContainer.width() + kendo.support.scrollbar());
        //},
        //popupSettings: {
        //    width: 'auto',
        //    appendTo: $('#product-prefilter'),
        //    position: 'top right',
        //    origin: 'bottom right'
        //},
        virtual: {
            itemHeight: 34,
            mapValueTo: 'dataItem'
        },
        popupSettings: {
            appendTo: $('#product-prefilter')
        }
    });

    self.stockLocationParams = kendoMDCDropDownList({
        label: 'Stock Location',
        odata: true,
        endPoint: '/odata/StockLocations',
        textField: 'Name',
        valueField: 'StockLocationID',
        virtual: true,
        pageSize: 20,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: `/odata/StockLocations/Default.StockLocationValueMapper(stockLocationId=${options.value || "null"})`,
                    type: 'GET',
                    success: function (data) {
                        options.success(data.value);
                        if (data.value.length == 1) {
                            self.stockLocation(data.value[0]);
                        }
                    }
                });
            }
        },
        idObservable: self.stockLocationId,
        objObservable: self.stockLocation,
        //optionLabel: {
        //    TradeAccountGroupID: '',
        //    Name: ''
        //},
        //optionLabelTemplate: '',
        filter: 'contains',
        autoBind: true,
        height: 340,
        showClear: false
        //popupSettings: {
        //    width: '300px'
        //}
    });

    self.ringFenceDataSource = new kendo.data.DataSource({
        serverFiltering: true,
        serverSorting: true,
        serverGrouping: true,
        serverPaging: true,
        serverAggregates: true,
        pageSize: 10,
        type: 'odata-v4',
        transport: {
            read: {
                url: function () {
                    return `/odata/RingFencePreAllocations/Default.FilterRingFencePreAllocations(tradeAccountGroupId=${(self.prefilterTradeAccountGroupId.peek() || "null")},tradeAccountId=${(self.prefilterTradeAccountId.peek() || "null")},productId=${(self.prefilterProductId.peek() || "null")})?$expand=StockLocation,Product,TradeAccount`
                },
                dataType: 'json'
            },
            parameterMap: function (options, type) {
                var pmap = kendo.data.transports['odata-v4'].parameterMap(options);

                // remove invalid parameters that web api doesn't support
                // thanks, https://stackoverflow.com/questions/28995757/a-binary-operator-with-incompatible-types-was-detected-found-operand-types-edm/48919770
                delete pmap.$inlinecount; // <-- remove inlinecount
                delete pmap.$format; // <-- remove format
                delete pmap.$callback; // <-- remove callback

                pmap.$count = true;

                if (pmap.$filter) {
                    pmap.$filter = pmap.$filter.replace(/\'/g, '')
                }

                console.log(pmap);

                return pmap;
            }
        },
        schema: {
            model: {
                id: 'RingFencePreAllocationID',
                fields: {
                    RingFencePreAllocationID: {
                        type: 'number',
                        editable: false
                    },
                    StockLocation: {
                        type: 'object',
                    },
                    InitialQuantity: {
                        type: 'number'
                    },
                    CurrentQuantity: {
                        type: 'number'
                    },
                    TradeAccount: {
                        type: 'object',
                        validation: {
                            required: true
                        },
                        defaultValue: null
                    },
                    Product: {
                        type: 'object',
                        validation: {
                            required: true
                        },
                        defaultValue: null
                    }
                }
            },
            aggregates: function (e) {
                $.get(`/odata/RingFencePreAllocations/Default.FilterRingFencePreAllocations(tradeAccountGroupId=${(self.prefilterTradeAccountGroupId.peek() || "null")},tradeAccountId=${(self.prefilterTradeAccountId.peek() || "null")},productId=${(self.prefilterProductId.peek() || "null")})?$apply=aggregate(CurrentQuantity with sum as CurrentQuantitySum, InitialQuantity with sum as InitialQuantitySum)`).then(function (d) {
                    console.log(d);
                    if (d != null && d.hasOwnProperty('value')) {
                        if (Array.isArray(d.value) && d.value.length == 1) {
                            self.currentQuantitySum(d.value[0].CurrentQuantitySum);
                            self.initialQuantitySum(d.value[0].InitialQuantitySum);
                        }
                    }
                });
                //console.log(JSON.parse(result.responseText));
            } //"AggregateResults",
        },
        aggregate: [{
            field: 'InitialQuantity', aggregate: 'sum'
        }, {
            field: 'CurrentQuantity', aggregate: 'sum'
        }],
        requestStart: function (e) {
            self.busy(true);
        },
        requestEnd: function (e) {
            self.busy(false);
        }
    });

    self.ringFenceGrid = {
        autoBind: true,
        widget: ko.observable(),
        useKOTemplates: true,
        rowTemplate: 'ring-fence-row-template',
        data: self.ringFenceDataSource,
        selectable: false,
        columns: [{
            field: 'StockLocationID',
            title: 'Stock Location',
            width: 140,
            filterable: {
                multi: true,
                search: true,
                dataSource: getStockLocationIDFilterOptions(),
                itemTemplate: function (e) {
                    return '<li><label class="pointer display-block"><input type="checkbox" name="' + e.field + '" value="#: data.StockLocationID #"/><span class="margin-left-5">#: data.Name || "Select All" #</span></label></li>'
                }
            }
        }, {
            field: 'InitialQuantity',
            title: 'Initial Quantity',
            width: 105,
            headerAttributes: {
                class: 'text-right'
            },
            filterable: {
                extra: false,
                operators: {
                    number: {
                        gte: 'Greater than or equal to',
                        gt: 'Greater than',
                        eq: 'Equal to',
                        neq: 'Not equal to',
                        lt: 'Less than',
                        lte: 'Less than or equal to'
                    }
                }
            },
            aggregates: ["sum"],
            footerTemplate: function (e) {
                return '<span class="display-block text-right">Total:<br/><span data-bind="text: formatNumber(initialQuantitySum(), 2, \'en-GB\')"></span></span>';
            }
        }, {
            field: 'CurrentQuantity',
            title: 'Current Quantity',
            width: 105,
            headerAttributes: {
                class: 'text-right'
            },
            filterable: {
                extra: false,
                operators: {
                    number: {
                        gte: 'Greater than or equal to',
                        gt: 'Greater than',
                        eq: 'Equal to',
                        neq: 'Not equal to',
                        lt: 'Less than',
                        lte: 'Less than or equal to'
                    }
                }
            },
            aggregates: ["sum"],
            footerTemplate: function (e) {
                return '<span class="display-block text-right">Total:<br/><span data-bind="text: formatNumber(currentQuantitySum(), 2, \'en-GB\')"></span></span>';
            }
        }, {
            field: 'Code',
            title: 'Product',
            width: 200,
            filterable: {
                extra: false,
                operators: {
                    string: {
                        startswith: "Starts with",
                        eq: "Is equal to",
                        neq: "Is not equal to"
                    }
                }
            }
        }, {
            field: 'Batch',
            title: 'Batch',
            width: 120,
            filterable: {
                extra: false,
                operators: {
                    string: {
                        startswith: "Starts with",
                        eq: "Is equal to",
                        neq: "Is not equal to"
                    }
                }
            }
        }, {
            field: 'Piece',
            title: 'Piece',
            width: 120,
            filterable: {
                extra: false,
                operators: {
                    string: {
                        startswith: "Starts with",
                        eq: "Is equal to",
                        neq: "Is not equal to"
                    }
                }
            }
        }, {
            field: 'TradeAccount',
            title: 'Trade Account',
            filterable: false
        }, {
            field: 'NoField',
            title: 'Controls',
            width: 154,
            filterable: false,
            attributes: {
                class: 'text-center'
            },
        }],
        filterMenuInit: function (e) {
            console.log(e);
            if (e.field.indexOf('Quantity') > -1) {
                $(e.container).css("width", "240px")
            }
        },
        filterable: {
            mode: 'menu'
        },
        filterable: true,
        sortable: true,
        pageable: true,
        pageSize: 10,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        dataBound: function (e) {
            ko.cleanNode(document.getElementsByClassName('k-grid-footer')[0]);
            ko.applyBindings(viewModel, document.getElementsByClassName('k-grid-footer')[0]);
        }
    }

    self.removeFiltersForField = function (expression, field) {
        if (expression.filters) {
            expression.filters = $.grep(expression.filters, function (filter) {
                self.removeFiltersForField(filter, field);
                if (filter.filters) {
                    return filter.filters.length;
                } else {
                    return filter.field != field;
                }
            });
        }
    }

    //#endregion

    //#region Subscriptions

    self.prefilterTradeAccountId.subscribe(function (newValue) {

        self.expiryDateParams.clearFunction();

        window.setTimeout(function () {
            self.ringFenceGrid.widget().dataSource.query({
                page: 1,
                pageSize: self.ringFenceGrid.widget().dataSource.options.pageSize,
                filter: ''
            });
        }, 0);
    });

    self.prefilterTradeAccountGroupId.subscribe(function (newValue) {

        self.expiryDateParams.clearFunction();

        self.tradeAccountParams.clearFunction();

        window.setTimeout(function () {
            self.tradeAccountParams.dropDownListSettings.widget().dataSource.read();

            self.ringFenceGrid.widget().dataSource.query({
                page: 1,
                pageSize: self.ringFenceGrid.widget().dataSource.options.pageSize,
                filter: ''
            });
        }, 0);
    });

    self.prefilterProductId.subscribe(function (newValue) {
        self.ringFenceGrid.widget().dataSource.query({
            page: 1,
            pageSize: self.ringFenceGrid.widget().dataSource.options.pageSize,
            filter: ''
        });
    });

    self.stockLocation.subscribe(function (newValue) {
        if (newValue) {
            if (newValue.StockLocationID != '') {
                self.fetchStockInformation(newValue.Code);
            }
        }
    });

    //#endregion

    //#region Validation Groups

    self.errors = ko.validation.group([
        self.prefilterTradeAccountGroupId,
        self.prefilterTradeAccountId,
        self.prefilterProductId,
        self.prefilterExpiryDate
    ]);

    self.newRingFenceErrors = ko.validation.group([
        self.stockInfo,
        self.stockLocationId
    ], {
        deep: true,
        live: true
    });

    //#endregion

    //#region Functions

    self.ringFenceGridAddNew = function () {
        window.setTimeout(function () {
            self.validateNow(true);
            self.validateNow.notifySubscribers(self.validateNow());
            if (self.errors().length) {
                self.errors.filter(function (x) {
                    x.isValid.notifySubscribers(x.isValid());
                });
            } else {
                self.stockLocationId(107);
                self.stockLocation.valueHasMutated(true);
                self.showNewRingFenceModal();
            }
        }, 0);
    }

    self.showNewRingFenceModal = function () {
        $('#new-ring-fence-modal').modal('show');
    }

    self.closeNewRingFenceModal = function () {
        self.stockInfo([]);
        self.validateNow(false);
        self.validateNewRingFenceNow(false);
        $('#new-ring-fence-modal').modal('hide');
    }

    self.fetchStockInformation = function (stockLocation) {
        if (stockLocation) {
            self.newBusy(true);
            var data = {
                productCode: self.prefilterProduct().Code,
                stockLocation: stockLocation,
                enquiryType: 'S'
            }
            console.log('fetchStockInformation calling with', data);
            $.ajax({
                url: '/api/ringfenceapi/StockCheck',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('fetchStockInformation returned', data);

                    self.stockInfo(Enumerable.From(data).GroupBy(
                        function (r) { // key
                            return r.Batch
                        },
                        function (r) { // element
                            return r
                        },
                        function (key, batch) { // result
                            return {
                                batch: key,
                                pieces: Enumerable.From(batch.source).Select(function (s) {
                                    var piece = $.extend(s, {
                                        ringFenceQuantity: {
                                            label: 'Length (m)',
                                            observable: ko.observable().extend({
                                                required: {
                                                    params: true,
                                                    onlyIf: function () {
                                                        return self.validateNewRingFenceNow() && !self.anyRingFencePieces()
                                                    },
                                                    message: 'At least one Piece Length is required'
                                                },
                                                numberFormatted: {
                                                    digits: 1,
                                                    currency: {
                                                        FormattingCulture: 'en-GB'
                                                    },
                                                    minValue: 0.5,
                                                    maxValue: s.Quantity
                                                }
                                            }),
                                            useNativeValidation: false,
                                            decorateInputElement: false,
                                            insertValidationMessages: false,
                                            showClear: false
                                        }
                                    });
                                    piece.ringFenceQuantity.observable.subscribe(function (newValue) {
                                        self.validateNewRingFenceNow(false);
                                    });
                                    return piece;
                                }).ToArray()
                            }
                        },
                        function (b) { // compare
                            return b.batch
                        }
                    ).ToArray());

                    self.newBusy(false);
                },
                error: function (xhr, s, a) {
                    self.newBusy(false);
                    $.ajaxSettings.error(xhr, s, a);
                }
            });
        }
    }

    self.addAllBatchPieces = function (batch) {
        ko.utils.arrayForEach(batch.pieces, function (p) {
            p.ringFenceQuantity.observable(p.Quantity);
        });
    }

    self.clearPiecesFromBatch = function (batch) {
        ko.utils.arrayForEach(batch.pieces, function (p) {
            p.ringFenceQuantity.observable(undefined);
        });
    }

    self.confirmRingFence = function () {
        self.validateNewRingFenceNow(true);
        window.setTimeout(function () {
            if (self.newRingFenceErrors().length) {
                self.newRingFenceErrors.filter(function (x) {
                    x.isValid.notifySubscribers(x.isValid())
                });
            } else {
                $.confirm('Are you sure?',
                    `<dl class="dl-horizontal">
                        <dt>
                            This will ring fence a total of
                        </dt>
                        <dd>
                            ${formatNumber(self.totalNewRingFenceLength(), 1, 'en-GB')}${self.prefilterProduct().StockUnit.Units}
                        </dd>
                        <dt>
                            of
                        </dt>
                        <dd>
                            ${self.prefilterProduct().Code}
                        </dd>
                        <dt>
                            for
                        </dt>
                        <dd>
                            ${self.prefilterTradeAccount().Code} - ${self.prefilterTradeAccount().Name}
                        </dd>
                        <dt>
                            expiring on
                        </dt>
                        <dd>
                            ${moment(self.prefilterExpiryDate()).format('DD/MM/YYYY')}
                        </dd>
                    </dl>`,
                    function () {
                        self.createRingFence();
                    }, function () {

                    });
            }
        }, 0);
    }

    self.createRingFence = function () {
        self.newBusy(true);
        var data = {
            tradeAccountId: self.prefilterTradeAccountId(),
            tradeAccountGroupId: self.prefilterTradeAccountGroupId(),
            productId: self.prefilterProductId(),
            stockLocationId: self.stockLocationId(),
            expiryDt: self.prefilterExpiryDate().toISOString(),
            pieces: Enumerable.From(self.stockInfo()).SelectMany(function (x) {
                return Enumerable.From(x.pieces).Where(function (y) {
                    return y.ringFenceQuantity.observable() != null
                }).Select(function (y) {
                    return {
                        quantity: y.ringFenceQuantity.observable(),
                        piece: y.Piece,
                        batch: y.Batch
                    }
                }).ToArray()
            }).ToArray()
        };
        console.log('calling createRingFence with', data);
        $.ajax({
            url: '/api/ringfenceapi/CreateRingFence',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('createRingFence returned', data);
                self.newBusy(false);
                $.info('Success', 'Ring Fence created successfully.', function () {
                    self.closeNewRingFenceModal();
                    self.fetchStockInformation(self.stockLocation().Code);
                    self.ringFenceGrid.widget().dataSource.query({
                        page: 1,
                        pageSize: self.ringFenceGrid.widget().dataSource.options.pageSize,
                        filter: ''
                    });
                }, function () {

                });
            },
            error: function (xhr, s, a) {
                self.newBusy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    self.confirmDeleteRingFence = function (obj) {
        $.confirm('Are you sure?', 'This will delete Ring Fence Allocation ID: ' + obj.RingFencePreAllocationID + '. Are you sure?',
            function () {
                self.deleteRingFence(obj.RingFencePreAllocationID);
            }, function () {

            });
    }

    self.deleteRingFence = function (id) {
        self.busy(true);
        var data = {
            ringFencePreAllocationId: id
        };
        console.log('calling createRingFence with', data);
        $.ajax({
            url: '/api/ringfenceapi/DeleteRingFence',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('deleteRingFence returned', data);
                self.busy(false);
                $.info('Success', 'Ring Fence deleted successfully.', function () {
                    self.ringFenceGrid.widget().dataSource.query({
                        page: 1,
                        pageSize: self.ringFenceGrid.widget().dataSource.options.pageSize,
                        filter: ''
                    });
                }, function () {

                });
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    self.reset = function () {
        console.log('ringFencedStockViewModel reset called', self);
        self.errors.showAllMessages(false);
        self.busy(false);
        self.ready(true);
        self.ringFenceCurrentResults([]);
    }

    //#endregion

    //#region Events

    $(document).ready(function () {
        //self.fetchRingFenceAllocations({});
    });

    //#endregion

    return self;
}();

var ringFencedStockModel = ({
    newRecord = false,
    parent,
    incomingRecord = {}
} = {}) => (function () {

    // IncomingRecord might be null. If you're adding a new one of these, it will be null
    // Now... it will default to an empty object, so at least we can safely attempt to access properties on it.
    var self = $.extend(incomingRecord, {});

    //#region Properties

    self.incrementRenderCount = function () {
        self.renderCount(self.renderCount() + 1);
        return true;
    }

    self.renderCount = ko.observable(0);

    //#endregion

    //#region Computeds



    //#endregion

    //#region Components

    self.tradeAccountGroupId = ko.observable(newRecord ? parent.prefilterTradeAccountGroupId() : incomingRecord.TradeAccountGroupID);
    self.tradeAccountGroup = ko.observable();

    self.tradeAccountGroupList = kendoMDCDropDownList({
        label: 'Trade Account Group',
        odata: true,
        endPoint: '/odata/TradeAccountGroups',
        textField: 'Name',
        valueField: 'TradeAccountGroupID',
        permitRevert: true,
        idObservable: self.tradeAccountGroupId,//incomingRecord.TradeAccountGroupID ? incomingRecord.TradeAccountGroupID.toString() : ''),
        objObservable: ko.observable(),
        optionLabel: {
            TradeAccountGroupID: '',
            Name: ''
        },
        //optionLabelTemplate: '',
        filter: 'contains',
        autoBind: true,
        height: 340,
        popupSettings: {
            width: '300px'
        }
    });

    self.tradeAccountId = ko.observable(newRecord ? parent.prefilterTradeAccountId() : incomingRecord.TradeAccountID);
    self.tradeAccount = ko.observable();

    self.tradeAccountGroupList.observable.subscribe(function (newValue) {
        console.log('tradeAccountGroupList observable subscribe hit', newValue);
    });

    self.tradeAccountList = kendoMDCDropDownList({
        label: 'Trade Account',
        odata: true,
        endPoint: '/odata/tradeaccounts',
        textField: 'Code',
        valueField: 'TradeAccountID',
        virtual: true,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: `/odata/TradeAccounts/Default.TradeAccountValueMapper(tradeAccountId=${options.value || "null"})`,
                    type: 'GET',
                    success: function (data) {
                        options.success(data.value);
                    }
                });
            }
        },
        sort: [{
            field: 'Code',
            dir: 'asc'
        }],
        idObservable: self.tradeAccountId,
        objObservable: self.tradeAccount,
        height: 340,
        template: '#: Code # - #: Name #',
        valueTemplate: '#: Code # - #: Name #',
        optionLabel: {
            Code: '',
            Name: ''
        },
        optionLabelTemplate: '',
        filtering: function (ev) {
            var filterValue = ev.filter != undefined ? ev.filter.value : "";
            ev.preventDefault();
            this.dataSource.filter({
                logic: "or",
                filters: [
                    {
                        field: "Name",
                        operator: "contains",
                        value: filterValue
                    },
                    {
                        field: "Code",
                        operator: "contains",
                        value: filterValue
                    }
                ]
            });
        },
        autoBind: true,
        height: 340
    });

    self.tradeAccountList.observable.subscribe(function (newValue) {
        console.log('tradeAccountList observable subscribe hit', newValue);
    });

    //#endregion

    //#region Subscriptions

    //#endregion

    //#region Validation Groups

    self.errors = ko.validation.group([

    ]);

    //#endregion

    //#region Functions

    self.reset = function () {
        console.log('basicFactory reset called', self);
        self.errors.showAllMessages(false);
    }

    //#endregion

    //#region Events

    //#endregion

    return self;
})();