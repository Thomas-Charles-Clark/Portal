const marketingBudgetViewModel = (() => {
    let self = {

    };

    //#region Properties

    self.validateSearchNow = ko.observable(false);

    self.busy = ko.observable(false);

    self.data = ko.observableArray([]);

    //// ta: https://stackoverflow.com/questions/2706125/javascript-function-to-add-x-months-to-a-date#answer-2706169
    //self.addMonths = (date, months) => {
    //    var d = date.getDate();
    //    date.setMonth(date.getMonth() + +months);
    //    if (date.getDate() != d) {
    //        date.setDate(0);
    //    }
    //    return date;
    //}

    //let period = new Date();

    //self.addMonths(period, 2)

    self.period = ko.observable().extend({

    });

    self.priceListBusy = ko.observable(false);

    self.priceListId = ko.observable().extend({
        rateLimit: {
            method: 'notifyWhenChangesStop',
            timeout: 300
        }
    });

    self.originalPriceListId = ko.observable(self.priceListId());

    self.priceList = ko.observable().extend({
        rateLimit: {
            method: 'notifyWhenChangesStop',
            timeout: 300
        }
    });



    self.marketingChannelBusy = ko.observable(false);

    self.marketingChannelId = ko.observable().extend({
        rateLimit: {
            method: 'notifyWhenChangesStop',
            timeout: 300
        }
    });

    self.originalMarketingChannelId = ko.observable(self.marketingChannelId());

    self.marketingChannel = ko.observable().extend({
        rateLimit: {
            method: 'notifyWhenChangesStop',
            timeout: 300
        }
    });

    //#endregion


    //#region Components

    self.priceListDataSourceParams = {
        serverFiltering: true,
        serverSorting: true,
        serverGrouping: true,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            model: {
                id: 'PriceListID',
            },
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

                var params = new URLSearchParams();

                for (var propertyName in mapped) {
                    params.append(propertyName, mapped[propertyName]);
                }

                fetch('/api/MarketingBudgetAPI/FetchPriceLists?' + params, {
                    method: 'GET',
                    headers: window.fetchHeaders
                })
                    .then(resp => resp.json())
                    .then(data => {
                        options.success(data);
                        console.log('FetchPriceLists returned', data);
                    })
                    .catch(err => window.catchFetchError(err));
            }
        }
    };

    self.priceListParams = {
        label: 'Price List',
        observable: self.priceListId,
        busy: self.priceListBusy,
        enable: ko.observable(true),
        disable: ko.observable(false),
        permitRevert: true,
        originalValue: self.originalPriceListId,
        revertable: true,
        revertFunction: () => {
            self.priceListId(self.originalPriceListId())
        },
        clearable: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        useNativeValidation: false, // this feeds through to mdc objects and affects them
        decorateInputElement: true,
        insertValidationMessages: false,
        controlClass: 'form-control',
        dropDownListSettings: {
            data: new kendo.data.DataSource(self.priceListDataSourceParams),
            value: self.priceListId,
            dataItem: self.priceList,
            dataValueField: 'PriceListID',
            dataTextField: 'Name',
            height: 420,
            widget: ko.observable(),
            enabled: ko.observable(true),
            open: (e) => {
                $(self.priceListId.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            close: (e) => {
                $(self.priceListId.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            valuePrimitive: false,
            autoWidth: false,
            autoBind: true,
            optionLabel: ' ',
            filter: 'startswith'
        },
        clearFunction: function () {
            self.priceListParams.dropDownListSettings.widget().value(null);
            self.priceListId.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
            self.priceListId.mdcSelect.label_.float(false);
            self.priceListId(null);
        }
    };

    self.marketingChannelDataSourceParams = {
        serverFiltering: true,
        serverSorting: true,
        serverGrouping: true,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            model: {
                id: 'MarketingChannelID',
            },
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

                var params = new URLSearchParams();

                for (var propertyName in mapped) {
                    params.append(propertyName, mapped[propertyName]);
                }

                fetch('/api/MarketingBudgetAPI/FetchMarketingChannels?' + params, {
                    method: 'GET',
                    headers: window.fetchHeaders
                })
                    .then(resp => resp.json())
                    .then(data => {
                        options.success(data);
                        console.log('MarketingChannels returned', data);
                    })
                    .catch(err => window.catchFetchError(err));
            }
        }
    };

    self.marketingChannelParams = {
        label: 'Marketing Channel',
        observable: self.marketingChannelId,
        busy: self.marketingChannelBusy,
        enable: ko.observable(true),
        disable: ko.observable(false),
        permitRevert: true,
        originalValue: self.originalMarketingChannelId,
        revertable: true,
        revertFunction: () => {
            self.marketingChannelId(self.originalMarketingChannelId())
        },
        clearable: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        useNativeValidation: false, // this feeds through to mdc objects and affects them
        decorateInputElement: true,
        insertValidationMessages: false,
        controlClass: 'form-control',
        dropDownListSettings: {
            data: new kendo.data.DataSource(self.marketingChannelDataSourceParams),
            value: self.marketingChannelId,
            dataItem: self.marketingChannel,
            dataValueField: 'MarketingChannelID',
            dataTextField: 'MarketingChannel',
            height: 420,
            widget: ko.observable(),
            enabled: ko.observable(true),
            open: (e) => {
                $(self.marketingChannelId.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            close: (e) => {
                $(self.marketingChannelId.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            valuePrimitive: false,
            autoWidth: false,
            autoBind: true,
            optionLabel: ' ',
            filter: 'startswith'
        },
        clearFunction: function () {
            self.marketingChannelParams.dropDownListSettings.widget().value(null);
            self.marketingChannelId.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
            self.marketingChannelId.mdcSelect.label_.float(false);
            self.marketingChannelId(null);
        }
    };

    self.periodParams = {
        label: 'Period',
        observable: self.period,
        displayObservable: ko.observable(),
        dateTimePickerOptions: {
            localization: {
                locale: 'en-GB',
                format: 'yyyy - MMM'
            },
            display: {
                sideBySide: false,
                components: {
                    clock: false,
                    calendar: true,
                    date: false,
                    month: true,
                    year: true,
                    decades: false,
                    clock: false,
                    hours: false,
                    minutes: false,
                    seconds: false
                },
                viewMode: 'months',
                //cellSize: '4rem'
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
            self.period(undefined);
        },
        revertable: ko.observable(false),
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true
    };

    self.removeFiltersForField = (expression, field) => {
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


    self.gridSettings = {
        autoBind: true,
        widget: ko.observable(),
        columns: [{
            field: 'MarketingBudgetID',
            title: 'ID',
            width: 60,
            attributes: {
                'class': 'text-end'
            }
        }, {
            field: 'PriceListID',
            title: 'Price List',
            template: '#=PriceList ? PriceList.Name : ""#',
            editable: false
        }, {
            field: 'MarketingChannelID',
            title: 'Marketing Channel',
            template: '#=MarketingChannel ? MarketingChannel.MarketingChannel : ""#',
            editable: false
        }, {
            field: 'Period',
            title: 'Period',
            template: (record) => {
                let dt = new window.tempusDominus.DateTime(record.Period);
                let td = self.period.tempusDominus;
                return td.dates.formatInput(dt);
            },
            editable: false
        }, {
            field: 'Cost',
            title: 'Cost',
            width: 140,
            attributes: {
                'class': 'text-end'
            }
        }, {
            field: 'Target',
            title: 'Target',
            width: 140,
            attributes: {
                'class': 'text-end'
            }
        }, {
            field: 'ModifiedDT',
            title: 'Modified',
            template: (record) => {
                let dt = new window.tempusDominus.DateTime(record.ModifiedDT);
                let td = self.period.tempusDominus;
                return td.dates.formatInput(dt);
            },
            editable: false
        }, {
            field: 'ModifiedByMemberID',
            title: 'Modified by',
            template: '#=LastModifiedBy ? LastModifiedBy.FullName : ""#',
            editable: false
        }],
        editable: true,
        batch: true,
        toolbar: ["save", "cancel"],
        edit: function (e) {
            if (e.model.isNew()) {
                if (e.sender.options.editable != 'inline') {
                    e.sender.setOptions({ editable: 'inline' });
                    e.sender.one('dataBound', function (x) {
                        window.setTimeout(function () {
                            e.sender.addRow();
                            e.sender.one('dataBound', function (y) {
                                window.setTimeout(function () {
                                    e.sender.setOptions({ editable: 'incell' });
                                }, 0);
                            });
                        }, 0);
                    });
                }
            }
        },
        cancel: function (e) {
            if (e.sender.options.editable == 'inline') {
                e.sender.setOptions({ editable: 'incell' });
            }
        },
        data: new kendo.data.DataSource({
            type: 'odata-v4',
            content: 'json',
            transport: {
                read: {
                    url: function () {
                        return '/odata/MarketingBudgets/Default.Filter(priceListId=' + (self.priceListId() || "null") + ',marketingChannelId=' + (self.marketingChannelId() || "null")
                            + ',period=\'' + (self.period() ? self.period().toISOString().split('T')[0] : "null") + '\')?$expand=PriceList,MarketingChannel,LastModifiedBy'
                    }
                },
                update: {
                    url: function (data) {
                        return '/odata/MarketingBudgets(' + data.MarketingBudgetID + ')'
                    }
                },
                batch: {
                    url: function () {
                        return "/odata/$batch";
                    }
                },
                parameterMap: function (data, type) {
                    var result = kendo.data.transports["odata-v4"].parameterMap(data, type);

                    if (type === "update") {
                        console.log('updating');
                    }

                    return result;
                }
            },
            pageSize: 10,
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            autoSync: false,
            schema: {
                errors: 'error',
                model: {
                    id: 'MarketingBudgetID',
                    fields: {
                        MarketingBudgetID: {
                            type: 'number',
                            editable: false
                        },
                        PriceList: {
                            type: 'object',
                            validation: {
                                required: true
                            },
                            defaultValue: null,
                            editable: false
                        },
                        PriceListID: {
                            type: 'number',
                            editable: false
                        },
                        MarketingChannel: {
                            type: 'object',
                            validation: {
                                required: true
                            },
                            defaultValue: null,
                            editable: false
                        },
                        MarketingChannelID: {
                            type: 'number',
                            editable: false
                        },
                        Period: {
                            validation: {
                                required: true
                            },
                            editable: false
                        },
                        Cost: {
                            type: 'number',
                            valdiation: {
                                required: true
                            }
                        },
                        Target: {
                            type: 'number',
                            valdiation: {
                                required: true
                            }
                        },
                        LastModifiedBy: {
                            type: 'object',
                            validation: {
                                required: true
                            },
                            defaultValue: null,
                            editable: false
                        }
                    }
                }
            },
            requestStart: function (e) {
                console.log('requestStart', e);
            },
            requestEnd: function (e) {
                if (e.type == "create") {
                    this.read();
                }
            },
        }),
        sortable: true,
        filterable: false,
        reorderable: true,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 200]
        }
    }; 
    //#endregion


    //#region



    //#endregion


    //#region Computeds



    //#endregion


    //#region Methods

    self.createNew = () => {

    }

    //#endregion

    return self;
});