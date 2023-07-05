const tradeAccountCreationEmailMaintenanceViewModel = () => {
    let self = {};

    self.busy = ko.observable(false);

    self.resultGridWidget = ko.observable();

    self.resultGridColumns = [{
        field: 'TradeAccountCreationEmailID',
        title: 'ID',
        width: 80,
        readonly: true,
        hidden: true,
        attributes: {
            'class': ''
        },
        template: function (r) {
            return r.TradeAccountCreationEmailID;
        }
    }, {
        field: 'SalesMarket.Name',
        title: 'Sales Market',
        width: 175,
        attributes: {
            'class': 'heading-cell'
        },
        //template: function (r) {
        //    var result = '';

        //    if (r.Heading)
        //        result = '<span class="heading">' + r.Heading + '</span>';

        //    if (r.SubHeading)
        //        result += '<span>' + r.SubHeading + '</span>';

        //    return result;
        //}
    }, {
        title: 'Display Contact Details For:',
        columns: [{
            field: 'DisplayContactDetails_AccountManager',
            title: 'Account Manager',
            attributes: {
                'class': 'text-center'
            },
            headerAttributes: {
                'class': 'text-center'
            },
            template: function (r) {
                return r.DisplayContactDetails_AccountManager ? '✔' : '✖';
            }
        }, {
            field: 'DisplayContactDetails_CustomerService',
            title: 'Customer Services',
            attributes: {
                'class': 'text-center'
            },
            headerAttributes: {
                'class': 'text-center'
            },
            template: function (r) {
                return r.DisplayContactDetails_CustomerService ? '✔' : '✖';
            }
        }, {
            field: 'DisplayContactDetails_CreditControl',
            title: 'Credit Control',
            attributes: {
                'class': 'text-center'
            },
            headerAttributes: {
                'class': 'text-center'
            },
            template: function (r) {
                return r.DisplayContactDetails_CreditControl ? '✔' : '✖';
            }
        },
        {
            command: "edit",
            width: '100px'
        }]
    }];

    self.resultGridDataSource =
        self.resultGridDataSource = new kendo.data.DataSource({
            transport: {
                read: function (options) {

                    var webapi = new kendo.data.transports.webapi({ prefix: "" });
                    var params = webapi.parameterMap(options.data);

                    //var tradeAccountId = null;

                    //if (self.tradeAccount.peek())
                    //    tradeAccountId = self.tradeAccount.peek().TradeAccountID
                    
                    let data = {
                        salesMarketId: self.salesMarketId()
                    };

                    for (let propertyName in params) {
                        data[propertyName] = params[propertyName];
                    }

                    console.log('calling creationEmails with', data);

                    $.ajax({
                        url: '/api/customermaintenance/CreationEmailsGridView',
                        type: 'GET',
                        data: data,
                        success: function (data) {
                            console.log('CreationEmailsGridView returned', data);
                            options.success(data);
                        },
                        error: function (xhr, s, a) {
                            self.busy(false);
                            $.showError(xhr, s, a);
                        }
                    });
                }
            },
            pageSize: 30,
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            schema: $.extend({}, kendo.data.schemas.webapi, {
                data: "Data",
                total: "Total",
                errors: "Errors",
                aggregates: "Aggregates",
                model: {
                    id: 'TradeAccountCreationEmailID',
                    fields: {
                        TradeAccountCreationEmailID: {
                            editable: false
                        },
                        SalesMarket: {
                            type: 'object',
                            editable: false
                        }
                    }
                }
            }),
            requestStart: function (e) {
                self.busy(true);
            },
            requestEnd: function (e) {
                self.busy(false);
            }
        });

    self.resultGridSettings = {
        autoBind: true,
        widget: self.resultGridWidget,
        columns: self.resultGridColumns,
        data: self.resultGridDataSource,
        //useKOTemplates: true,
        //rowTemplate: 'basket-row-template',
        scrollable: false,
        sortable: true,
        filterable: false,
        reorderable: false,
        paging: true,
        pageSize: 30,
        pageable: {
            pageSize: 30,
            pageSizes: [30, 50, 100, 250, 500, 'all']
        },
        editable: {
            mode: 'popup',
        },
        selectable: "single",
        change: function (e) {
            if (!e.sender.editable) {
                if (self.resultGridWidget().select()) {
                    self.resultGridWidget().editRow(self.resultGridWidget().select());
                }
            }
            //this.editRow(this.select());
            ////if (self.resultGridWidget().select()) {
            ////    self.busy(true);
            ////    var selectedItem = self.resultGridWidget().dataItem(self.resultGridWidget().select());
            ////    if (selectedItem != null) {
            ////        self.parent.orderFactory.loadBasket(selectedItem, function () {
            ////            self.busy(false);
            ////        });
            ////    } else {
            ////        self.busy(false);
            ////    }
            ////}
        },
        dataBound: function (e) {
            //if (self.customResultStatusFilterActive()) {
            //    window.setTimeout(function () {
            //        $('th[data-field="Status"]', e.sender.element).find('a.k-grid-filter').addClass('k-state-active');
            //    }, 0);
            //} else {
            //    $('th[data-field="Status"]', e.sender.element).find('a.k-grid-filter').removeClass('k-state-active');
            //}
        },
        filterMenuInit: function (e) {

            //var ds = [];
            //var filterToggle = null;
            //var operator = null;

            //switch (e.field) {
            //    case 'Status':
            //        ds = getMyHeldOrderImportStatuses();
            //        operator = "contains";
            //        filterToggle = self.customResultStatusFilterActive;
            //        break;
            //    default: break;
            //}

            //if (filterToggle != null) {
            //    var popup = e.container.data("kendoPopup");
            //    var dataSource = this.dataSource;
            //    var field = e.field;
            //    var element = e.container.children(":first");

            //    var originalMultiCheck = e.container.children(":first");
            //    // helpTextElement.nextUntil(":has(.k-button)").remove();
            //    var element = $("<div class='custom-filter-checkbox-container'></div>").insertAfter(originalMultiCheck).kendoListView({
            //        dataSource: ds,
            //        template: "<label><input type='checkbox' value='#:" + field + "#'/>#:Name#</label>"
            //    });
            //    originalMultiCheck.remove();
            //    e.container.children('.k-filter-selected-items').remove();

            //    e.container.find("[type='submit']").click(function (e) {
            //        e.preventDefault();
            //        e.stopPropagation();
            //        var filter = dataSource.filter() || { logic: "and", filters: [] };
            //        var fieldFilters = $.map(element.find('input[type="checkbox"]:checked'), function (input) {
            //            return {
            //                field: field,
            //                operator: operator,
            //                value: input.value
            //            };
            //        });
            //        if (fieldFilters.length) {
            //            self.removeFiltersForField(filter, field);
            //            filter.filters.push({
            //                logic: "or",
            //                filters: fieldFilters
            //            });
            //            dataSource.filter(filter);
            //            filterToggle(true);
            //        }
            //        popup.close();
            //    });

            //    e.container.find("[type='reset']").click(function (e) {
            //        filterToggle(false);
            //    });
            //}
        }
    };

    self.salesMarkets = getAvailableSalesMarkets();

    self.salesMarketId = ko.observable();

    self.salesMarketId.subscribe(nv => {
        console.log(nv);
    });

    self.salesMarket = ko.observable();

    self.salesMarketParams = {
        label: 'Sales Market',
        observable: self.salesMarketId,
        busy: self.busy,
        revertable: false,
        clearable: true,
        useNativeValidation: false, // this feeds through to mdc objects and affects them
        decorateInputElement: true,
        insertValidationMessages: false,
        controlClass: 'form-control',
        disable: ko.observable(false),
        enable: ko.observable(true),
        dropDownListSettings: {
            value: self.salesMarketId,
            dataItem: self.salesMarket,
            dataValueField: 'SalesMarketID',
            dataTextField: 'Name',
            height: 420,
            widget: ko.observable(),
            enabled: true,
            open: (e) => {
                $(self.salesMarketId.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            close: (e) => {
                $(self.salesMarketId.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            dataSource: new kendo.data.DataSource({
                data: self.salesMarkets,
                schema: $.extend({}, kendo.data.schemas.webapi, {
                    model: {
                        id: 'SalesMarketID',
                        fields: {
                            SalesMarket: {
                                editable: false,
                                nullable: false
                            },
                            Name: {
                                type: 'string',
                                validation: {
                                    required: true,
                                    nullable: false
                                }
                            }
                        }
                    }
                }),
            }),
            data: self.productTypes, //
            valuePrimitive: false,
            autoWidth: false,
            autoBind: true,
            optionLabel: ' ',
            filter: 'startswith'
        },
        clearFunction: function () {
            self.salesMarketParams.dropDownListSettings.widget().value(null);
            self.salesMarketId.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
            self.salesMarketId.mdcSelect.label_.float(false);
            self.salesMarketId(null);
        }
    };

    return self;
}