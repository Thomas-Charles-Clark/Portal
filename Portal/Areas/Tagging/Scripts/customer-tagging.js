var slicerGroupZeroViewModel = function (parent) {
    var self = this;

    self.parent = parent;

    self.repSlicer = ko.observable();
    self.currencySlicer = ko.observable();
    self.marketSlicer = ko.observable();
    self.repOrAgentSlicer = ko.observable();

    self.repId = ko.observable();
    self.currencyId = ko.observable();
    self.marketId = ko.observable();
    self.repOrAgentId = ko.observable();

    self.busy = ko.observable();
    self.nonce = ko.observable();

    self.currencyDisplay = ko.observable('currency');

    self.currencyDisplay.subscribe(function (newValue) {
        switch (newValue) {
            case 'currency':
                self.parent.showCurrencyColumns();
                self.parent.hideGBPColumns();
                break;
            case 'sterling':
                self.parent.hideCurrencyColumns();
                self.parent.showGBPColumns();
                break;
            case 'both':
                self.parent.showCurrencyColumns();
                self.parent.showGBPColumns();
                break;
        }
    });

    self.repSlicerParams = {
        name: 'Sales Representative',
        valueField: 'SalesRepresentativeID',
        textField: 'Name',
        boundTo: self.repSlicer,
        selectedId: self.repId,
        endPoint: '/api/salesstatisticsapi/SalesRepresentativeSlicerEndpoint'
    };

    self.currencySlicerParams = {
        name: 'Currency',
        valueField: 'CurrencyID',
        textField: 'Name',
        boundTo: self.currencySlicer,
        selectedId: self.currencyId,
        endPoint: '/api/salesstatisticsapi/CurrencySlicerEndpoint',
        selectOnlyItem: true
    };

    self.marketSlicerParams = {
        name: 'Sales Market',
        valueField: 'SalesMarketID',
        textField: 'Name',
        boundTo: self.marketSlicer,
        selectedId: self.marketId,
        endPoint: '/api/salesstatisticsapi/SalesMarketSlicerEndpoint',
        selectOnlyItem: true
    };

    self.repOrAgentSlicerParams = {
        name: 'Sales Representative or Agent',
        valueField: 'SalesRepOrAgent',
        textField: 'Name',
        boundTo: self.repOrAgentSlicer,
        selectedId: self.repOrAgentId,
        endPoint: '/api/salesstatisticsapi/SalesRepOrAgentSlicerEndpoint',
        showClear: false
    };

    self.slicerCollection = [
        self.repSlicerParams,
        self.repOrAgentSlicerParams,
        self.currencySlicerParams,
        self.marketSlicerParams
    ];

    self.clearSlicers = function () {

        self.slicerCollection.forEach(function (s) {
            s.boundTo().widget().select('');
            s.selectedId(undefined);
        });

        self.busy(false);

        self.nonce.valueHasMutated();
    }

    self.marketSlicerParams.slicerCollection = self.slicerCollection;
    self.currencySlicerParams.slicerCollection = self.slicerCollection;
    self.repSlicerParams.slicerCollection = self.slicerCollection;
    self.repOrAgentSlicerParams.slicerCollection = self.slicerCollection;

    self.repSlicerParams.boundTo.subscribe(function (newValue) {
        if (newValue) {
            window.setTimeout(function () {
                newValue.selectedId.subscribe(function (newValue) {
                    console.log('groupZero repSlicer.selectedId subscribe hit', newValue);
                    if (newValue) {
                        self.parent.slicerGroupOne.repSlicer().selectedId(newValue);
                        self.parent.slicerGroupOne.repSlicer().widget().value(newValue);
                        self.parent.slicerGroupOne.repSlicer().widget().dataSource.read();
                    } else {
                        self.parent.slicerGroupOne.repSlicer().selectedId(newValue);
                        self.parent.slicerGroupOne.repSlicer().widget().value('');
                        self.parent.slicerGroupOne.repSlicer().widget().dataSource.read();
                    }
                })
            }, 0);
        }
    });

    self.marketSlicerParams.boundTo.subscribe(function (newValue) {
        if (newValue) {
            window.setTimeout(function () {
                newValue.selectedId.subscribe(function (newValue) {
                    console.log('groupZero marketSlicer.selectedId subscribe hit', newValue);
                    if (newValue) {
                        self.parent.slicerGroupOne.marketSlicer().selectedId(newValue);
                        self.parent.slicerGroupOne.marketSlicer().widget().value(newValue);
                        self.parent.slicerGroupOne.marketSlicer().widget().dataSource.read();
                    } else {
                        self.parent.slicerGroupOne.marketSlicer().selectedId(newValue);
                        self.parent.slicerGroupOne.marketSlicer().widget().value('');
                        self.parent.slicerGroupOne.marketSlicer().widget().dataSource.read();
                    }
                })
            }, 0);
        }
    });

    self.repOrAgentSlicerParams.boundTo.subscribe(function (newValue) {
        if (newValue) {
            window.setTimeout(function () {
                newValue.selectedId.subscribe(function (newValue) {
                    console.log('groupZero repOrAgentSlicer.selectedId subscribe hit', newValue);
                    self.parent.taggingWidget().dataSource.read();
                })
            }, 0);
        }
    });

    self.foo = ko.computed({
        read: function () {

            var f = self.nonce();

            if (self.repSlicer() &&
                self.marketSlicer() &&
                self.currencySlicer() &&
                self.repOrAgentSlicer()) {
                var ids = [];

                self.slicerCollection.forEach(function (p) {
                    ids.push({
                        name: p.name,
                        selectedId: p.selectedId()
                    });
                });

                if (self.currencySlicer().selectedId() == 1) {
                    self.parent.hideCurrencyColumns();
                    self.parent.showGBPColumns();
                } else {
                    self.parent.showCurrencyColumns();
                    self.parent.hideGBPColumns();
                }

                console.log('group zero was evaluated and found', ids);

                if (self.parent) {

                    var data = {};

                    self.slicerCollection.forEach(function (s) {
                        var value = s.boundTo().selectedId();
                        if (value) {
                            data[s.valueField] = value;
                        }
                    });

                    //self.parent.taggingWidget().dataSource.read();
                }
            }
            else {
                //console.log('foo was evaluated but the slicers were not ready');
            }
        }
    }, self).extend({
        rateLimit: {
            method: 'notifyWhenChangesStop',
            timeout: 500
        }
    });
}

var customerTaggingViewModel = function () {
    var self = this;

    self.idField = "TradeAccountID";

    self.slicerGroupZero = new slicerGroupZeroViewModel(self);
    self.slicerGroupOne = new slicerGroupOneViewModel(self);
    self.slicerGroupTwo = new slicerGroupTwoViewModel(self);
    self.slicerGroupThree = new slicerGroupThreeViewModel(self);

    var preselectedRep = getPreselectedSalesRep();

    if (preselectedRep != null) {
        self.slicerGroupZero.repSlicerParams.boundTo.subscribe(function (newValue) {
            window.setTimeout(function () {
                console.log('slicerGroupZero repSlicer boundTo subscribe hit', newValue, preselectedRep);
                self.slicerGroupZero.repSlicer().selectedId(preselectedRep.SalesRepresentativeID);
                self.slicerGroupZero.repSlicer().widget().value(preselectedRep.SalesRepresentativeID);

                self.slicerGroupOne.repSlicer().selectedId(preselectedRep.SalesRepresentativeID);
                self.slicerGroupOne.repSlicer().widget().value(preselectedRep.SalesRepresentativeID);

                if (preselectedRep.SalesMarketID) {
                    self.slicerGroupZero.marketSlicer().selectedId(preselectedRep.SalesMarketID);
                    self.slicerGroupZero.marketSlicer().widget().value(preselectedRep.SalesMarketID);
                    self.slicerGroupZero.marketSlicer().widget().dataSource.read();

                    self.slicerGroupOne.marketSlicer().selectedId(preselectedRep.SalesMarketID);
                    self.slicerGroupOne.marketSlicer().widget().value(preselectedRep.SalesMarketID);
                }

                self.slicerGroupZero.currencySlicer().widget().dataSource.read();
                self.slicerGroupZero.repOrAgentSlicer().widget().dataSource.read();
            }, 0);
        });
    }

    self.hideCurrencyColumns = function () {
        $(".dashboard-currency").hide();
        self.taggingWidget().hideColumn(4);
    }

    self.showCurrencyColumns = function () {
        $(".dashboard-currency").show();
        self.taggingWidget().showColumn(4);
    }

    self.hideGBPColumns = function () {
        $(".dashboard-gbp").hide();
        self.taggingWidget().hideColumn(5);
    }

    self.showGBPColumns = function () {
        $(".dashboard-gbp").show();
        self.taggingWidget().showColumn(5);
    }

    self.loadingBusy = ko.observable(false);
    self.taggingGridBusy = ko.observable(false);
    self.customersToTag = [];

    self.taggingWidget = ko.observable();
    self.newTag = ko.observable(false);
    self.tagsAutocomplete = ko.observable();
    self.searchString = ko.observable();

    self.selectedTags = ko.observableArray([]);
    self.availableTags = ko.observableArray(getAvailableTags());
    self.allCustomerResults = ko.observableArray([]);

    //self.taggingWidget.subscribe(function (newValue) {
    //    self.taggingWidget().dataSource.sort({
    //        field: 'TY_FinancialYearToDate',
    //        dir: 'desc'
    //    });
    //});

    self.tagsAutocomplete.subscribe(function (newValue) {
        if (newValue) {
            if (newValue.length == 0) {
                self.newTag(false);
            }
        } else {
            self.newTag(false);
        }
    });

    self.clearSelection = function () {
        self.customersToTag = [];
        self.taggingWidget().refresh();
    }

    self.removeTagFromCustomer = function (tradeAccountId, tagId) {
        self.taggingGridBusy(true);
        var data = {
            tradeAccountIds: [tradeAccountId],
            tagIds: [tagId]
        }
        //console.log('removeTagFromCustomer', data);
        $.ajax({
            url: '/api/CustomerTaggingAPI/RemoveTagsFromCustomers',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function () {
                self.taggingGridBusy(false);
                self.taggingWidget().dataSource.read();
            },
            error: function (xhr, textStatus, errorThrown) {
                self.taggingGridBusy(false);
                self.showError(xhr, textStatus, errorThrown);
            }
        });
    }

    self.addTag = function (name) {
        $.ajax({
            url: '/api/ComponentAPI/AddTag',
            type: 'POST',
            dataType: 'json',
            cache: false,
            data: {
                name: name
            },
            success: function (data) {

                var obj = { TagID: data.TagID, Name: data.Name };

                var ext = Enumerable.From(self.availableTags()).Where("$.TagID == " + data.TagID).SingleOrDefault();
                if (ext) {

                } else {
                    self.availableTags.push(obj);
                }

                var extBra = Enumerable.From(self.selectedTags()).Where("$.TagID == " + data.TagID).SingleOrDefault();

                if (extBra) {

                } else {
                    self.selectedTags.push(obj);
                }

                self.newTag(false);

                self.tagsAutocomplete(undefined);
            },
            error: function (xhr, e, s) {
                self.leadSaveBusy(false);
                //$.showError(xhr, e, s);
            }
        });
    }

    self.addTagsToSelection = function () {
        self.taggingGridBusy(true);
        var data = {
            tradeAccountIds: Enumerable.From(self.customersToTag).Select("value, index => {index:index, value:value}").Where("$.value == true").Select("$.index").ToArray(),
            tagIds: Enumerable.From(self.selectedTags()).Select("$.TagID").ToArray()
        }
        if (data.tradeAccountIds.length == 0) {
            $.info('No Customers Selected', 'Please select customers to apply tags to.');
            return;
        }
        if (data.tagIds.length == 0) {
            $.info('No Tags Specified', 'Please select tags to apply to customers.');
            return;
        }
        //console.log('addTagsToSelection', data);
        $.ajax({
            url: '/api/CustomerTaggingAPI/TagCustomers',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function () {
                self.taggingGridBusy(false);
                self.taggingWidget().dataSource.read();
                self.selectedTags([]);
                $("#add-tag-modal").modal('hide');
            },
            error: function (xhr, textStatus, errorThrown) {
                self.taggingGridBusy(false);
                self.showError(xhr, textStatus, errorThrown);
            }
        });
    }

    self.removeTagsFromSelection = function () {
        self.taggingGridBusy(true);
        var data = {
            tradeAccountIds: Enumerable.From(self.customersToTag).Select("value, index => {index:index, value:value}").Where("$.value == true").Select("$.index").ToArray(),
            tagIds: Enumerable.From(self.selectedTags()).Select("$.TagID").ToArray()
        }
        if (data.tradeAccountIds.length == 0) {
            $.info('No Customers Selected', 'Please select customers to remove tags from.');
            return;
        }
        if (data.tagIds.length == 0) {
            $.info('No Tags Specified', 'Please select tags to remove from customers.');
            return;
        }
        //console.log('removeTagsFromSelection', data);
        $.ajax({
            url: '/api/CustomerTaggingAPI/RemoveTagsFromCustomers',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function () {
                self.taggingGridBusy(false);
                self.taggingWidget().dataSource.read();
                $("#remove-tag-modal").modal('hide');
            },
            error: function (xhr, textStatus, errorThrown) {
                self.taggingGridBusy(false);
                self.showError(xhr, textStatus, errorThrown);
            }
        });
    }


    self.statusColumnTemplate = function (rec) {
        if (rec.Status == 'Open') {
            return '<span title="Open">O</span>';
        }
        if (rec.Status == 'Closed') {
            return '<span title="Closed">C</span>';
        }
    }


    self.selectAllCustomers = function () {
        var toSelect = [];
        self.allCustomerResults().forEach(function (r) {
            toSelect[r.TradeAccountID] = true;
        });
        console.log(toSelect);
        self.customersToTag = toSelect;
        self.taggingWidget().refresh();
    }

    self.initTagsAutocomplete = function () {
        $(".tags").autocomplete({
            appendTo: 'body',
            source: function (request, response) {
                $.ajax({
                    url: "/api/ComponentAPI/TagAutocomplete",
                    type: "POST",
                    dataType: "json",
                    data: {
                        term: request.term
                    },
                    success: function (data) {

                        self.newTag(true);

                        data.forEach(function (item) {
                            if (item.Name.toLowerCase() == request.term.toLowerCase()) {
                                self.newTag(false);
                            }
                        });

                        response($.map(data, function (item) {
                            return {
                                label: item.Name,
                                value: item
                            };
                        }));
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        //$.showError(xhr, textStatus, errorThrown);
                    }
                });
            },
            minLength: 1,
            select: function (event, ui) {
                event.preventDefault();
                var obj = Enumerable.From(self.availableTags()).Where("$.TagID == " + ui.item.value.TagID).Single();
                self.selectedTags.remove(obj);
                self.selectedTags.push(obj);
                $(".tags").val(null);
                self.newTag(false);
                return false;
            },
            focus: function (event, ui) {
                return false;
            },
            autoFocus: true
        });

        return true;
    }

    self.showAddTagModal = function () {
        self.selectedTags([]);
        if (self.customersToTag.length == 0) {
            $.info('No Customers Selected', 'Please select customers to apply tags to.');
            return;
        } else {
            $("#add-tag-modal").modal('show');
        }
    }

    self.showRemoveTagModal = function () {
        self.selectedTags([]);
        if (self.customersToTag.length == 0) {
            $.info('No Customers Selected', 'Please select customers to remove tags from.');
            return;
        } else {
            $("#remove-tag-modal").modal('show');
        }
    }

    self.init = function () {
        self.initTagsAutocomplete();
    }


    // #region tag customers grid

    self.getTaggingGridRecord = function (uid) {
        return Enumerable.From(self.taggingWidget().dataSource.view()).Where("$.uid == '" + uid + "'").Single();
    }

    self.tagGridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {};

        self.slicerGroupZero.slicerCollection.forEach(function (p) {
            if (typeof p.boundTo === 'function')
                if (p.boundTo().widget().value())
                    data[p.valueField] = p.boundTo().widget().value();
        });

        self.slicerGroupOne.slicerCollection.forEach(function (p) {
            if (typeof p.boundTo === 'function')
                if (p.boundTo().widget().value())
                    data[p.valueField] = p.boundTo().widget().value();
        });

        self.slicerGroupTwo.slicerCollection.forEach(function (p) {
            if (typeof p.boundTo === 'function')
                if (p.boundTo().widget().value())
                    data[p.valueField] = p.boundTo().widget().value();
        });

        self.slicerGroupThree.slicerCollection.forEach(function (p) {
            if (typeof p.boundTo === 'function')
                if (p.boundTo().widget().value())
                    data[p.valueField] = p.boundTo().widget().value();
        });

        console.log('calling tagCustomersSearch with', data);

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        if (self.searchString()) {
            data.SearchString = self.searchString();
        }

        $.ajax({
            url: '/api/CustomerTaggingAPI/TagCustomersSearch',
            type: "GET",
            data: data,
            success: function (data) {
                console.log('TagCustomersSearch returned', data);
                options.success(data);
                self.allCustomerResults(data.Data);
            },
            error: function (data) {
                console.log(data);
                options.error();
            }
        });
    };

    self.tagGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.tagGridDataSourceRead
        },
        pageSize: 250,
        serverPaging: true,
        serverSorting: true,
        serverFiltering: false,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            model: {
                id: 'TradeAccountID',
                fields: {
                    TradeAccountID: { type: 'int' },
                    Code: { type: 'string' },
                    Name: { type: 'string' },
                    Status: { type: 'string' },
                    SalesMarketCode: { type: 'string' },
                    SalesAreaCode: { type: 'string' },
                    SalesAreaName: { type: 'string' },
                    Email: { type: 'string' },
                    PhoneNumber: { type: 'string' },
                    AddressLine1: { type: 'string' },
                    AddressLine1: { type: 'string' },
                    AddressLine1: { type: 'string' },
                    AddressLine1: { type: 'string' },
                    CountryCode: { type: 'string' },
                    LY_MonthToDate: { type: 'number' },
                    TY_MonthToDate: { type: 'number' },
                    MonthToDateGrowth: { type: 'number' },
                    LY_FinancialYearToDate: { type: 'number' },
                    TY_FinancialYearToDate: { type: 'number' },
                    FinancialYearToDateGrowth: { type: 'number' },
                    LY_CalendarYearToDate: { type: 'number' },
                    TY_CalendarYearToDate: { type: 'number' },
                    CalendarYearToDateGrowth: { type: 'number' },
                    LY_MonthToDateCurr: { type: 'number' },
                    TY_MonthToDateCurr: { type: 'number' },
                    MonthToDateGrowthCurr: { type: 'number' },
                    LY_FinancialYearToDateCurr: { type: 'number' },
                    TY_FinancialYearToDateCurr: { type: 'number' },
                    FinancialYearToDateGrowthCurr: { type: 'number' },
                    LY_CalendarYearToDateCurr: { type: 'number' },
                    TY_CalendarYearToDateCurr: { type: 'number' },
                    CalendarYearToDateGrowthCurr: { type: 'number' },
                    Tags: { type: 'object' }
                }
            }
        }),
        sort: { field: "TY_FinancialYearToDate", dir: "desc" },
        requestStart: function (e) {
            self.taggingGridBusy(true);
        },
        requestEnd: function (e) {
            $(".dash-panel").removeClass('panel-primary');
            self.taggingGridBusy(false);
        },
        aggregate: [
            { field: "TY_CalendarYearToDate", aggregate: "sum" },
            { field: "LY_CalendarYearToDate", aggregate: "sum" },
            { field: "CalendarYearToDateGrowth", aggregate: "average" },
            { field: "TY_FinancialYearToDate", aggregate: "sum" },
            { field: "LY_FinancialYearToDate", aggregate: "sum" },
            { field: "FinancialYearToDateGrowth", aggregate: "average" },
            { field: "TY_MonthToDate", aggregate: "sum" },
            { field: "LY_MonthToDate", aggregate: "sum" },
            { field: "MonthToDateGrowth", aggregate: "average" },
            { field: "TY_CalendarYearToDateCurr", aggregate: "sum" },
            { field: "LY_CalendarYearToDateCurr", aggregate: "sum" },
            { field: "CalendarYearToDateGrowthCurr", aggregate: "average" },
            { field: "TY_FinancialYearToDateCurr", aggregate: "sum" },
            { field: "LY_FinancialYearToDateCurr", aggregate: "sum" },
            { field: "FinancialYearToDateGrowthCurr", aggregate: "average" },
            { field: "TY_MonthToDateCurr", aggregate: "sum" },
            { field: "LY_MonthToDateCurr", aggregate: "sum" },
            { field: "MonthToDateGrowthCurr", aggregate: "average" }
        ]
    });

    self.tagColumnTemplate = function (rec) {
        var results = '';
        rec.Tags.forEach(function (t) {
            results += '<span class="label label-primary tag" data-tag-id="' + t.TagID + '">' + t.Tag + ' <span onclick="event.stopPropagation(); event.preventDefault(); viewModel.removeTagFromCustomer(' + rec.TradeAccountID + ', ' + t.TagID + '); return false;" class="remove">[&times;]</span></span>';
        });
        return results;
    }

    self.tagGridSettings = {
        autoBind: false,
        widget: self.taggingWidget,
        data: self.tagGridDataSource,
        selectable: "multiple, row",
        sortable: {
            initialDirection: "desc"
        },
        height: 730,
        scrollable: true,
        columns: [
        {
            field: '',
            title: '',
            attributes: {
                'class': 'ranking text-center left-border'
            },
            headerAttributes: {
                'class': 'bottom-border'
            },
            footerAttributes: {
                'class': 'right-border'
            },
            width: 50
        },
            {
                field: '',
                title: '',
                columns: [{
                    field: '',
                    title: '',
                    headerAttributes: {
                        'class': 'second-heading'
                    },
                    columns: [{
                        field: 'SalesMarketCode',
                        title: 'M',
                        headerAttributes: {
                            "class": "third-heading left-border"
                        },
                        attributes: {
                            'class': 'text-left left-border'
                        },
                        width: 30
                    }]
                }]
            }, {
                field: '',
                title: '',
                columns: [{
                    field: '',
                    title: '',
                    headerAttributes: {
                        'class': 'second-heading'
                    },
                    columns: [{
                        field: '',
                        title: 'Area',
                        encoded: false,
                        template: '<span title="#: SalesAreaCode # - #: SalesAreaName #">#: SalesAreaCode #<br/><span class="bold">#: SalesAreaName #</span></span>',
                        headerAttributes: {
                            "class": "third-heading left-border"
                        },
                        attributes: {
                            'class': 'text-left nowrap'
                        },
                        width: 140
                    }]
                }]
            }, {
                field: '',
                title: '',
                columns: [{
                    field: '',
                    title: '',
                    headerAttributes: {
                        'class': 'second-heading'
                    },
                    columns: [{
                        field: 'Name',
                        title: 'Customer',
                        encoded: false,
                        headerAttributes: {
                            "class": "third-heading left-border"
                        },
                        attributes: {
                            'class': 'text-left nowrap'
                        },
                        template: '#: Code # (#: Status #)<br/><a href="javascript:;" class="bold" title="#: Code # - #: Name #" onclick="event.preventDefault();event.stopPropagation();viewModel.showContactModal(\'tagging\', \'#: uid #\');return false;">#: Name #</span>',
                        width: 180
                    }]
                }]
            },
            //{
            //    field: '',
            //    title: '',
            //    columns: [{
            //        field: '',
            //        title: '',
            //        headerAttributes: {
            //            'class': 'second-heading'
            //        },
            //        columns: [{
            //            field: 'Status',
            //            title: ' ',
            //            headerAttributes: {
            //                "class": "third-heading"
            //            },
            //            attributes: {
            //                'class': 'text-center'
            //            },
            //            template: self.statusColumnTemplate,
            //            width: 30
            //        }]
            //    }]
            //},
            //{
            //    field: '',
            //    title: '',
            //    columns: [{
            //        field: '',
            //        title: '',
            //        headerAttributes: {
            //            'class': 'second-heading'
            //        },
            //        columns: [{
            //            field: '',
            //            title: 'Contact',
            //            headerAttributes: {
            //                "class": "third-heading left-border"
            //            },
            //            attributes: {
            //                'class': 'text-center'
            //            },
            //            template: function (rec) {
            //                return '<i class="contact-icon material-icons" >contact_mail</i>'
            //            },
            //            footerAttributes: {
            //                'class': 'add-right'
            //            },
            //            width: 84
            //        }]
            //    }]
            //},
            {
                field: '',
                title: 'Currency',
                headerAttributes: {
                    'class': 'first-heading'
                },
                width: 420,
                columns: [{
                    field: '',
                    title: 'Financial',
                    headerAttributes: {
                        'class': 'second-heading'
                    },
                    width: 140,
                    columns: [{
                        field: 'TY_FinancialYearToDateCurr',
                        title: 'YTD',
                        template: function (rec) {
                            if (rec.TY_FinancialYearToDateCurr >= 0)
                                return formatSelectedCurrency(rec.TY_FinancialYearToDateCurr);
                            else
                                return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_FinancialYearToDateCurr) + '</span>';
                        },
                        headerAttributes: {
                            'class': 'third-heading text-right left-border'
                        },
                        attributes: {
                            'class': 'left-border'
                        },
                        footerTemplate: function (data) {
                            var value = data.TY_FinancialYearToDateCurr ? data.TY_FinancialYearToDateCurr.sum : 0;
                            if (value >= 0)
                                return formatSelectedCurrency(value);
                            else
                                return '<span class="text-danger">' + formatSelectedCurrency(value) + '</span>';
                        },
                        footerTemplate: '#: formatSelectedCurrency(data.TY_FinancialYearToDateCurr ? data.TY_FinancialYearToDateCurr.sum: 0) #',
                        footerAttributes: {
                            'class': 'left-border'
                        },
                        width: 80
                    },
                    //{
                    //    field: 'LY_FinancialYearToDateCurr',
                    //    title: 'LYTD',
                    //    template: function (rec) {
                    //        if (rec.LY_FinancialYearToDateCurr >= 0)
                    //            return formatSelectedCurrency(rec.LY_FinancialYearToDateCurr);
                    //        else
                    //            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_FinancialYearToDateCurr) + '</span>';
                    //    },
                    //    headerAttributes: {
                    //        'class': 'third-heading text-right'
                    //    },
                    //    footerTemplate: function (data) {
                    //        var value = data.LY_FinancialYearToDateCurr ? data.LY_FinancialYearToDateCurr.sum : 0;
                    //        if (value >= 0)
                    //            return formatSelectedCurrency(value);
                    //        else
                    //            return '<span class="text-danger">' + formatSelectedCurrency(value) + '</span>';
                    //    },
                    //    footerTemplate: '#: formatSelectedCurrency(data.LY_FinancialYearToDateCurr ? data.LY_FinancialYearToDateCurr.sum: 0) #',
                    //    width: 100
                    //},
                    {
                        field: 'FinancialYearToDateGrowthCurr',
                        title: 'GRTH',
                        template: function (rec) {
                            if (rec.FinancialYearToDateGrowthCurr >= 0)
                                return formatPercentage(rec.FinancialYearToDateGrowthCurr);
                            else
                                return '<span class="text-danger">' + formatPercentage(rec.FinancialYearToDateGrowthCurr) + '</span>';
                        },
                        headerAttributes: {
                            'class': 'third-heading text-right'
                        },
                        footerTemplate: function (data) {
                            var value = ((data.TY_FinancialYearToDateCurr ? data.TY_FinancialYearToDateCurr.sum : 0) -
                                         (data.LY_FinancialYearToDateCurr ? data.LY_FinancialYearToDateCurr.sum : 0)) /
                                         (data.LY_FinancialYearToDateCurr ? Math.abs(data.LY_FinancialYearToDateCurr.sum) : 1);
                            if (value >= 0)
                                return formatPercentage(value);
                            else
                                return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                        },
                        //footerTemplate: '#: formatPercentage() #',
                        width: 60
                    }]
                }, {
                    field: '',
                    title: 'Calendar',
                    headerAttributes: {
                        'class': 'second-heading'
                    },
                    width: 140,
                    columns: [{
                        field: 'TY_CalendarYearToDateCurr',
                        title: 'YTD',
                        template: function (rec) {
                            if (rec.TY_FinancialYearToDateCurr >= 0)
                                return formatSelectedCurrency(rec.TY_FinancialYearToDateCurr);
                            else
                                return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_FinancialYearToDateCurr) + '</span>';
                        },
                        headerAttributes: {
                            'class': 'third-heading left-border'
                        },
                        attributes: {
                            'class': 'left-border'
                        },
                        footerTemplate: function (data) {
                            var value = data.TY_CalendarYearToDateCurr ? data.TY_CalendarYearToDateCurr.sum : 0;
                            if (value >= 0)
                                return formatSelectedCurrency(value);
                            else
                                return '<span class="text-danger">' + formatSelectedCurrency(value) + '</span>';
                        },
                        footerAttributes: {
                            'class': 'left-border'
                        },
                        width: 80
                    },
                    //{
                    //    field: 'LY_CalendarYearToDateCurr',
                    //    title: 'LYTD',
                    //    template: function (rec) {
                    //        if (rec.LY_CalendarYearToDateCurr >= 0)
                    //            return formatSelectedCurrency(rec.LY_CalendarYearToDateCurr);
                    //        else
                    //            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_CalendarYearToDateCurr) + '</span>';
                    //    },
                    //    headerAttributes: {
                    //        'class': 'third-heading text-right'
                    //    },
                    //    footerTemplate: function (data) {
                    //        var value = data.LY_CalendarYearToDateCurr ? data.LY_CalendarYearToDateCurr.sum : 0;
                    //        if (value >= 0)
                    //            return formatSelectedCurrency(value);
                    //        else
                    //            return '<span class="text-danger">' + formatSelectedCurrency(value) + '</span>';
                    //    },
                    //    width: 100
                    //},
                    {
                        field: 'CalendarYearToDateGrowthCurr',
                        title: 'GRTH',
                        template: function (rec) {
                            if (rec.CalendarYearToDateGrowthCurr >= 0)
                                return formatPercentage(rec.CalendarYearToDateGrowthCurr);
                            else
                                return '<span class="text-danger">' + formatPercentage(rec.CalendarYearToDateGrowthCurr) + '</span>';
                        },
                        headerAttributes: {
                            'class': 'third-heading text-right'
                        },
                        footerTemplate: function (data) {
                            var value = ((data.TY_CalendarYearToDateCurr ? data.TY_CalendarYearToDateCurr.sum : 0) -
                                         (data.LY_CalendarYearToDateCurr ? data.LY_CalendarYearToDateCurr.sum : 0)) /
                                         (data.LY_CalendarYearToDateCurr ? Math.abs(data.LY_CalendarYearToDateCurr.sum) : 1);
                            if (value >= 0)
                                return formatPercentage(value);
                            else
                                return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                        },
                        width: 60
                    }]
                },
                //{
                //    field: '',
                //    title: 'Month',
                //    headerAttributes: {
                //        'class': 'second-heading'
                //    },
                //    width: 140,
                //    columns: [{
                //        field: 'TY_MonthToDateCurr',
                //        title: 'MTD',
                //        template: function (rec) {
                //            if (rec.TY_MonthToDateCurr >= 0)
                //                return formatSelectedCurrency(rec.TY_MonthToDateCurr);
                //            else
                //                return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_MonthToDateCurr) + '</span>';
                //        },
                //        headerAttributes: {
                //            'class': 'third-heading text-right left-border'
                //        },
                //        attributes: {
                //            'class': 'left-border'
                //        },
                //        footerTemplate: function (data) {
                //            var value = data.TY_MonthToDateCurr ? data.TY_MonthToDateCurr.sum : 0;
                //            if (value >= 0)
                //                return formatSelectedCurrency(value);
                //            else
                //                return '<span class="text-danger">' + formatSelectedCurrency(value) + '</span>';
                //        },
                //        footerTemplate: '#: formatSelectedCurrency(data.TY_MonthToDateCurr ? data.TY_MonthToDateCurr.sum: 0) #',
                //        footerAttributes: {
                //            'class': 'left-border'
                //        },
                //        width: 80
                //    },
                //    //{
                //    //    field: 'LY_MonthToDateCurr',
                //    //    title: 'LMTD',
                //    //    template: function (rec) {
                //    //        if (rec.LY_MonthToDateCurr >= 0)
                //    //            return formatSelectedCurrency(rec.LY_MonthToDateCurr);
                //    //        else
                //    //            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_MonthToDateCurr) + '</span>';
                //    //    },
                //    //    headerAttributes: {
                //    //        'class': 'third-heading text-right'
                //    //    },
                //    //    footerTemplate: function (data) {
                //    //        var value = data.LY_MonthToDateCurr ? data.LY_MonthToDateCurr.sum : 0;
                //    //        if (value >= 0)
                //    //            return formatSelectedCurrency(value);
                //    //        else
                //    //            return '<span class="text-danger">' + formatSelectedCurrency(value) + '</span>';
                //    //    },
                //    //    footerTemplate: '#: formatSelectedCurrency(data.LY_MonthToDateCurr ? data.LY_MonthToDateCurr.sum: 0) #',
                //    //    width: 100
                //    //},
                //    {
                //        field: 'MonthToDateGrowthCurr',
                //        title: 'GRTH',
                //        template: function (rec) {
                //            if (rec.MonthToDateGrowthCurr >= 0)
                //                return formatPercentage(rec.MonthToDateGrowthCurr);
                //            else
                //                return '<span class="text-danger">' + formatPercentage(rec.MonthToDateGrowthCurr) + '</span>';
                //        },
                //        headerAttributes: {
                //            'class': 'third-heading text-right'
                //        },
                //        footerAttributes: {
                //            'class': 'third-heading text-right right-border'
                //        },
                //        footerTemplate: function (data) {
                //            var value = ((data.TY_MonthToDateCurr ? data.TY_MonthToDateCurr.sum : 0) -
                //                         (data.LY_MonthToDateCurr ? data.LY_MonthToDateCurr.sum : 0)) /
                //                         (data.LY_MonthToDateCurr ? Math.abs(data.LY_MonthToDateCurr.sum) : 1);
                //            if (value >= 0)
                //                return formatPercentage(value);
                //            else
                //                return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                //        },
                //        //footerTemplate: '#: formatPercentage(((data.TY_MonthToDateCurr ? \
                //        //                                       data.TY_MonthToDateCurr.sum : 0) - \
                //        //                                      (data.LY_MonthToDateCurr ? \
                //        //                                       data.LY_MonthToDateCurr.sum : 0)) / \
                //        //                                      (data.LY_MonthToDateCurr ? \
                //        //                                       Math.abs(data.LY_MonthToDateCurr.sum) : 1)) #',
                //        width: 60
                //    }]
                //}
                ]
            },
        //{
        //    field: '',
        //    title: '',
        //    columns: [{
        //        field: '',
        //        title: '',
        //        columns: [{
        //            attributes: {
        //                'class': 'spacer-column left-border'
        //            },
        //            headerAttributes: {
        //                'class': 'spacer-column left-border'
        //            },
        //            template: '&nbsp;',
        //            width: 10,
        //            footerAttributes: {
        //                'class': 'right-border add-left'
        //            }
        //        }]
        //    }]
        //},
        {
            field: '',
            title: 'Sales in Sterling',
            headerAttributes: {
                'class': 'first-heading'
            },
            width: 420,
            columns: [{
                field: '',
                title: 'Financial',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 140,
                columns: [{
                    field: 'TY_FinancialYearToDate',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_FinancialYearToDate >= 0)
                            return formatSelectedCurrency(rec.TY_FinancialYearToDate);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_FinancialYearToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    footerTemplate: function (data) {
                        var value = data.TY_FinancialYearToDate ? data.TY_FinancialYearToDate.sum : 0;
                        if (value >= 0)
                            return formatGBP(value);
                        else
                            return '<span class="text-danger">' + formatGBP(value) + '</span>';
                    },
                    width: 80
                },
                //{
                //    field: 'LY_FinancialYearToDate',
                //    title: 'LYTD',
                //    template: function (rec) {
                //        if (rec.LY_FinancialYearToDate >= 0)
                //            return formatSelectedCurrency(rec.LY_FinancialYearToDate);
                //        else
                //            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_FinancialYearToDate) + '</span>';
                //    },
                //    headerAttributes: {
                //        'class': 'third-heading text-right'
                //    },
                //    footerTemplate: function (data) {
                //        var value = data.LY_FinancialYearToDate ? data.LY_FinancialYearToDate.sum : 0;
                //        if (value >= 0)
                //            return formatGBP(value);
                //        else
                //            return '<span class="text-danger">' + formatGBP(value) + '</span>';
                //    },
                //    width: 100
                //},
                {
                    field: 'FinancialYearToDateGrowth',
                    title: 'GRTH',
                    template: function (rec) {
                        if (rec.FinancialYearToDateGrowth >= 0)
                            return formatPercentage(rec.FinancialYearToDateGrowth);
                        else
                            return '<span class="text-danger">' + formatPercentage(rec.FinancialYearToDateGrowth) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    footerTemplate: function (data) {
                        var value = ((data.TY_FinancialYearToDate ? data.TY_FinancialYearToDate.sum : 0) -
                                     (data.LY_FinancialYearToDate ? data.LY_FinancialYearToDate.sum : 0)) /
                                     (data.LY_FinancialYearToDate ? Math.abs(data.LY_FinancialYearToDate.sum) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    //footerTemplate: '#: formatPercentage(((data.TY_FinancialYearToDate ? \
                    //                                       data.TY_FinancialYearToDate.sum : 0) - \
                    //                                      (data.LY_FinancialYearToDate ? \
                    //                                       data.LY_FinancialYearToDate.sum : 0)) / \
                    //                                      (data.LY_FinancialYearToDate ? \
                    //                                       Math.abs(data.LY_FinancialYearToDate.sum) : 1)) #',
                    width: 60
                }]
            }, {
                field: '',
                title: 'Calendar',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 140,
                columns: [{
                    field: 'TY_CalendarYearToDate',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_CalendarYearToDate >= 0)
                            return formatSelectedCurrency(rec.TY_CalendarYearToDate);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_CalendarYearToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading left-border'
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    footerTemplate: function (data) {
                        var value = data.TY_CalendarYearToDate ? data.TY_CalendarYearToDate.sum : 0;
                        if (value >= 0)
                            return formatGBP(value);
                        else
                            return '<span class="text-danger">' + formatGBP(value) + '</span>';
                    },
                    footerAttributes: {
                        'class': 'left-border'
                    },
                    width: 80
                },
                //{
                //    field: 'LY_CalendarYearToDate',
                //    title: 'LYTD',
                //    template: function (rec) {
                //        if (rec.LY_CalendarYearToDate >= 0)
                //            return formatSelectedCurrency(rec.LY_CalendarYearToDate);
                //        else
                //            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_CalendarYearToDate) + '</span>';
                //    },
                //    headerAttributes: {
                //        'class': 'third-heading text-right'
                //    },
                //    footerTemplate: function (data) {
                //        var value = data.LY_CalendarYearToDate ? data.LY_CalendarYearToDate.sum : 0;
                //        if (value >= 0)
                //            return formatGBP(value);
                //        else
                //            return '<span class="text-danger">' + formatGBP(value) + '</span>';
                //    },
                //    width: 100
                //},
                {
                    field: 'CalendarYearToDateGrowth',
                    title: 'GRTH',
                    template: function (rec) {
                        if (rec.CalendarYearToDateGrowth >= 0)
                            return formatPercentage(rec.CalendarYearToDateGrowth);
                        else
                            return '<span class="text-danger">' + formatPercentage(rec.CalendarYearToDateGrowth) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    footerTemplate: function (data) {
                        var value = ((data.TY_CalendarYearToDate ? data.TY_CalendarYearToDate.sum : 0) -
                                     (data.LY_CalendarYearToDate ? data.LY_CalendarYearToDate.sum : 0)) /
                                     (data.LY_CalendarYearToDate ? Math.abs(data.LY_CalendarYearToDate.sum) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>';
                    },
                    //footerTemplate: '#: formatPercentage(((data.TY_CalendarYearToDate ? \
                    //                                       data.TY_CalendarYearToDate.sum : 0) - \
                    //                                      (data.LY_CalendarYearToDate ? \
                    //                                       data.LY_CalendarYearToDate.sum : 0)) / \
                    //                                      (data.LY_CalendarYearToDate ? \
                    //                                       Math.abs(data.LY_CalendarYearToDate.sum) : 1)) #',
                    width: 60
                }]
            },
            //{
            //    field: '',
            //    title: 'Month',
            //    headerAttributes: {
            //        'class': 'second-heading'
            //    },
            //    width: 140,
            //    columns: [{
            //        field: 'TY_MonthToDate',
            //        title: 'MTD',
            //        template: function (rec) {
            //            if (rec.TY_MonthToDate >= 0)
            //                return formatSelectedCurrency(rec.TY_MonthToDate);
            //            else
            //                return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_MonthToDate) + '</span>';
            //        },
            //        headerAttributes: {
            //            'class': 'third-heading text-right left-border'
            //        },
            //        attributes: {
            //            'class': 'left-border'
            //        },
            //        footerTemplate: function (data) {
            //            var value = data.TY_MonthToDate ? data.TY_MonthToDate.sum : 0;
            //            if (value >= 0)
            //                return formatGBP(value);
            //            else
            //                return '<span class="text-danger">' + formatGBP(value) + '</span>';
            //        },
            //        footerAttributes: {
            //            'class': 'left-border'
            //        },
            //        width: 80
            //    },
            //    //{
            //    //    field: 'LY_MonthToDate',
            //    //    title: 'LMTD',
            //    //    template: function (rec) {
            //    //        if (rec.LY_MonthToDate >= 0)
            //    //            return formatSelectedCurrency(rec.LY_MonthToDate);
            //    //        else
            //    //            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_MonthToDate) + '</span>';
            //    //    },
            //    //    headerAttributes: {
            //    //        'class': 'third-heading text-right'
            //    //    },
            //    //    footerTemplate: function (data) {
            //    //        var value = data.LY_MonthToDate ? data.LY_MonthToDate.sum : 0;
            //    //        if (value >= 0)
            //    //            return formatGBP(value);
            //    //        else
            //    //            return '<span class="text-danger">' + formatGBP(value) + '</span>';
            //    //    },
            //    //    width: 100
            //    //},
            //    {
            //        field: 'MonthToDateGrowth',
            //        title: 'GRTH',
            //        template: function (rec) {
            //            if (rec.MonthToDateGrowth >= 0)
            //                return formatPercentage(rec.MonthToDateGrowth);
            //            else
            //                return '<span class="text-danger">' + formatPercentage(rec.MonthToDateGrowth) + '</span>';
            //        },
            //        headerAttributes: {
            //            'class': 'third-heading text-right'
            //        },
            //        footerTemplate: function (data) {
            //            var value = ((data.TY_MonthToDate ? data.TY_MonthToDate.sum : 0) -
            //                         (data.LY_MonthToDate ? data.LY_MonthToDate.sum : 0)) /
            //                         (data.LY_MonthToDate ? Math.abs(data.LY_MonthToDate.sum) : 1);
            //            if (value >= 0)
            //                return formatPercentage(value);
            //            else
            //                return '<span class="text-danger">' + formatPercentage(value) + '</span>';
            //        },
            //        //footerTemplate: '#: formatPercentage(((data.TY_MonthToDate ? \
            //        //                                       data.TY_MonthToDate.sum : 0) - \
            //        //                                      (data.LY_MonthToDate ? \
            //        //                                       data.LY_MonthToDate.sum : 0)) / \
            //        //                                      (data.LY_MonthToDate ? \
            //        //                                       Math.abs(data.LY_MonthToDate.sum) : 1)) #',
            //        width: 60
            //    }]
            //}
            ]
        }, {
            field: '',
            title: '',
            columns: [{
                field: '',
                title: '',
                headerAttributes: {
                    'class': 'second-heading'
                },
                columns: [{
                    field: '',
                    title: 'Tags',
                    headerAttributes: {
                        'class': 'third-heading left-border right-border text-left',
                        'style': 'padding-left: 38px;'
                    },
                    attributes: {
                        'class': 'text-left left-border right-border tags-column'
                    },
                    footerAttributes: {
                        'class': 'left-border right-border'
                    },
                    template: self.tagColumnTemplate,
                    width: 540
                }]
            }]
        }],
        sortable: true,
        filterable: false,
        grouping: false,
        serverGrouping: false,
        pageable: {
            pageSize: 250,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        change: function (e, args) {
            var grid = e.sender;
            var items = grid.items();
            items.each(function (idx, row) {
                var idValue = grid.dataItem(row).get(self.idField);
                if (row.className.indexOf("k-state-selected") >= 0) {
                    self.customersToTag[idValue] = true;
                } else if (self.customersToTag[idValue]) {
                    delete self.customersToTag[idValue];
                }
            });
        },
        dataBound: function (e) {
            var grid = e.sender;
            var items = grid.items();
            var itemsToSelect = [];
            items.each(function (idx, row) {
                var index = $(this).index() + 1
                    + (self.taggingWidget().dataSource.pageSize() * (self.taggingWidget().dataSource.page() - 1));
                var rowLabel = $(this).find(".ranking");
                $(rowLabel).html(index);

                var dataItem = grid.dataItem(row);
                if (self.customersToTag[dataItem[self.idField]]) {
                    itemsToSelect.push(row);
                }
            });
            e.sender.select(itemsToSelect);

            var sorting = self.taggingWidget().dataSource.sort();

            $('#tag-customer-collapse th').removeClass('sorting-desc').removeClass('sorting-asc').removeClass('sorting-desc');

            for (var i in sorting) {
                var p = sorting[i];
                if (p.dir == 'asc') {
                    $('#tag-customer-collapse th[data-field="' + p.field + '"]').addClass('sorting-asc');
                } else {
                    $('#tag-customer-collapse th[data-field="' + p.field + '"]').addClass('sorting-desc');
                }
            }
        }
    }

    // #endregion

    // quite an important call!
    self.init();

    self.contactDataToDisplay = ko.observable();

    self.showContactModal = function (from, uid) {
        switch (from) {
            case 'customer':
                var data = self.getCustomersGridRecord(uid);
                self.contactDataToDisplay(data);
                break;
            case 'tagging':
                var data = self.getTaggingGridRecord(uid);
                self.contactDataToDisplay(data);
                break;
        }
        //ko.cleanNode($('#contact-modal')[0]);
        //ko.applyBindings(data, $("#contact-modal")[0]);
        $("#contact-modal").modal('show');
    }

    self.lowerSlicerGroupsComputed = ko.computed(function () {
        var groupOne = self.slicerGroupOne.foo();
        var groupTwo = self.slicerGroupTwo.foo();
        var groupThree = self.slicerGroupThree.foo();
        console.log('lowerSlicerGroups computed', groupOne, groupTwo, groupThree);
        if (groupOne && groupTwo && groupThree) {
            self.taggingWidget().dataSource.read();
        }
    }, self).extend({
        rateLimit: {
            timeout: 1000,
            method: 'notifyWhenChangesStop'
        }
    });

    self.contactDataToDisplay = ko.observable();

    self.showContactModal = function (from, uid) {
        switch (from) {
            case 'customer':
                var data = self.getCustomersGridRecord(uid);
                self.contactDataToDisplay(data);
                break;
            case 'tagging':
                var data = self.getTaggingGridRecord(uid);
                self.contactDataToDisplay(data);
                break;
        }
        //ko.cleanNode($('#contact-modal')[0]);
        //ko.applyBindings(data, $("#contact-modal")[0]);
        $("#contact-modal").modal('show');
    }
}

var slicerGroupOneViewModel = function (parent) {
    var self = this;

    self.parent = parent;

    self.marketSlicer = ko.observable();
    self.areaSlicer = ko.observable();
    self.agentSlicer = ko.observable();
    self.repSlicer = ko.observable();

    self.marketId = ko.observable();
    self.areaId = ko.observable();
    self.agentId = ko.observable();
    self.repId = ko.observable();

    self.busy = ko.observable();
    self.nonce = ko.observable();

    self.marketSlicerParams = {
        name: 'Market',
        valueField: 'SalesMarketID',
        textField: 'Name',
        boundTo: self.marketSlicer,
        selectedId: self.marketId,
        endPoint: '/api/CustomerTaggingAPI/SalesMarketSlicerEndpoint'
    };

    self.areaSlicerParams = {
        name: 'Sales Area',
        valueField: 'SalesAreaID',
        textField: 'Name',
        boundTo: self.areaSlicer,
        selectedId: self.areaId,
        endPoint: '/api/CustomerTaggingAPI/SalesAreaSlicerEndpoint'
    };

    self.agentSlicerParams = {
        name: 'Sales Agent',
        valueField: 'SalesAgentID',
        textField: 'Name',
        boundTo: self.agentSlicer,
        selectedId: self.agentId,
        endPoint: '/api/CustomerTaggingAPI/SalesAgentSlicerEndpoint'
    };

    self.repSlicerParams = {
        name: 'Sales Rep',
        valueField: 'SalesRepresentativeID',
        textField: 'Name',
        boundTo: self.repSlicer,
        selectedId: self.repId,
        endPoint: '/api/CustomerTaggingAPI/SalesRepresentativeSlicerEndpoint'
    };

    self.slicerCollection = [
        self.marketSlicerParams,
        self.areaSlicerParams,
        self.agentSlicerParams,
        self.repSlicerParams
    ];

    self.clearSlicers = function () {

        self.slicerCollection.forEach(function (s) {
            s.boundTo().widget().select('');
            s.selectedId(undefined);
        });

        self.busy(false);

        self.nonce.valueHasMutated();
    }

    self.marketSlicerParams.slicerCollection = self.slicerCollection;
    self.areaSlicerParams.slicerCollection = self.slicerCollection;
    self.agentSlicerParams.slicerCollection = self.slicerCollection;
    self.repSlicerParams.slicerCollection = self.slicerCollection;

    self.foo = ko.computed({
        read: function () {

            var f = self.nonce();

            if (self.marketSlicer() &&
                self.areaSlicer() &&
                self.agentSlicer() &&
                self.repSlicer()) {
                var ids = [];

                self.slicerCollection.forEach(function (p) {
                    ids.push({
                        name: p.name,
                        selectedId: p.selectedId()
                    });
                });

                console.log('group one was evaluated and found', ids);

                if (self.parent) {
                    if (ids.length)
                        return ids;
                    else
                        return false;
                }
            }

            return false;
        }
    }, self).extend({
        rateLimit: {
            method: 'notifyWhenChangesStop',
            timeout: 100
        }
    });
}

var slicerGroupTwoViewModel = function (parent) {
    var self = this;

    self.parent = parent;

    self.brandSlicer = ko.observable();
    self.productGroupSlicer = ko.observable();
    self.itemTypeSlicer = ko.observable();
    self.launchSlicer = ko.observable();

    self.brandId = ko.observable();
    self.productGroupId = ko.observable();
    self.itemTypeId = ko.observable();
    self.launchId = ko.observable();

    self.busy = ko.observable();
    self.nonce = ko.observable();

    self.brandSlicerParams = {
        name: 'Brand',
        valueField: 'BrandID',
        textField: 'Name',
        boundTo: self.brandSlicer,
        selectedId: self.brandId,
        endPoint: '/api/CustomerTaggingAPI/BrandSlicerEndpoint'
    };

    self.productGroupSlicerParams = {
        name: 'Product Group',
        valueField: 'ProductGroupID',
        textField: 'Name',
        boundTo: self.productGroupSlicer,
        selectedId: self.productGroupId,
        endPoint: '/api/CustomerTaggingAPI/ProductGroupSlicerEndpoint'
    };

    self.itemTypeSlicerParams = {
        name: 'Item Type',
        valueField: 'ItemTypeID',
        textField: 'Name',
        boundTo: self.itemTypeSlicer,
        selectedId: self.itemTypeId,
        endPoint: '/api/CustomerTaggingAPI/ItemTypeSlicerEndpoint'
    };

    self.launchSlicerParams = {
        name: 'Launch',
        valueField: 'LaunchID',
        textField: 'Name',
        boundTo: self.launchSlicer,
        selectedId: self.launchId,
        endPoint: '/api/CustomerTaggingAPI/LaunchSlicerEndpoint'
    };

    self.slicerCollection = [
        self.brandSlicerParams,
        self.productGroupSlicerParams,
        self.itemTypeSlicerParams,
        self.launchSlicerParams
    ];

    self.clearSlicers = function () {

        self.slicerCollection.forEach(function (s) {
            s.boundTo().widget().select('');
            s.selectedId(undefined);
        });

        self.busy(false);

        self.nonce.valueHasMutated();
    }

    self.brandSlicerParams.slicerCollection = self.slicerCollection;
    self.productGroupSlicerParams.slicerCollection = self.slicerCollection;
    self.itemTypeSlicerParams.slicerCollection = self.slicerCollection;
    self.launchSlicerParams.slicerCollection = self.slicerCollection;

    self.foo = ko.computed({
        read: function () {

            var f = self.nonce();

            if (self.brandSlicer() &&
                self.productGroupSlicer() &&
                self.itemTypeSlicer() &&
                self.launchSlicer()) {
                var ids = [];

                self.slicerCollection.forEach(function (p) {
                    ids.push({
                        name: p.name,
                        selectedId: p.selectedId()
                    });
                });

                console.log('group two was evaluated and found', ids);

                if (self.parent) {
                    if (ids.length)
                        return ids;
                    else
                        return false;
                }
            }
            return false;
        }
    }, self).extend({
        rateLimit: {
            method: 'notifyWhenChangesStop',
            timeout: 100
        }
    });
}

var slicerGroupThreeViewModel = function (parent) {
    var self = this;

    self.parent = parent;

    self.accountGroupSlicer = ko.observable();
    self.partnerSlicer = ko.observable();
    self.customerTypeSlicer = ko.observable();
    self.tagSlicer = ko.observable();
    self.statusSlicer = ko.observable();
    self.displaySlicer = ko.observable();
    self.advertisingSlicer = ko.observable();

    self.accountGroupId = ko.observable();
    self.partnerId = ko.observable();
    self.customerTypeId = ko.observable();
    self.tagId = ko.observable();
    self.statusId = ko.observable();
    self.displayId = ko.observable();
    self.advertisingId = ko.observable();

    self.busy = ko.observable();
    self.nonce = ko.observable();

    self.accountGroupSlicerParams = {
        name: 'Account Group',
        valueField: 'AccountGroupID',
        textField: 'Name',
        boundTo: self.accountGroupSlicer,
        selectedId: self.accountGroupId,
        slicerCollection: [],
        endPoint: '/api/CustomerTaggingAPI/AccountGroupSlicerEndpoint'
    };

    self.partnerSlicerParams = {
        name: 'Partner',
        valueField: 'PartnerID',
        textField: 'Name',
        boundTo: self.partnerSlicer,
        selectedId: self.partnerId,
        slicerCollection: [],
        endPoint: '/api/CustomerTaggingAPI/PartnerSlicerEndpoint'
    };

    self.customerTypeSlicerParams = {
        name: 'Customer Type',
        valueField: 'CustomerTypeID',
        textField: 'Name',
        boundTo: self.customerTypeSlicer,
        selectedId: self.customerTypeId,
        slicerCollection: [],
        endPoint: '/api/CustomerTaggingAPI/CustomerTypeSlicerEndpoint'
    };

    self.tagSlicerParams = {
        name: 'Tag',
        valueField: 'TagID',
        textField: 'Name',
        boundTo: self.tagSlicer,
        selectedId: self.tagId,
        slicerCollection: [],
        endPoint: '/api/CustomerTaggingAPI/TagSlicerEndpoint'
    };

    self.statusSlicerParams = {
        name: 'Status',
        valueField: 'StatusID',
        textField: 'Name',
        boundTo: self.statusSlicer,
        selectedId: self.statusId,
        slicerCollection: [],
        endPoint: '/api/CustomerTaggingAPI/StatusSlicerEndpoint'
    };

    self.displaySlicerParams = {
        name: 'Display',
        valueField: 'IncludeDisplay',
        textField: 'Name',
        boundTo: self.displaySlicer,
        selectedId: self.displayId,
        slicerCollection: [],
        endPoint: '/api/CustomerTaggingAPI/DisplaySlicerEndpoint'
    };

    self.advertisingSlicerParams = {
        name: 'Advertising',
        valueField: 'IncludeAdvertising',
        textField: 'Name',
        boundTo: self.advertisingSlicer,
        selectedId: self.advertisingId,
        slicerCollection: [],
        endPoint: '/api/CustomerTaggingAPI/AdvertisingSlicerEndpoint'
    };

    self.slicerCollection = [
        self.accountGroupSlicerParams,
        self.partnerSlicerParams,
        self.customerTypeSlicerParams,
        self.tagSlicerParams,
        self.statusSlicerParams,
        self.displaySlicerParams,
        self.advertisingSlicerParams
    ];

    self.clearSlicers = function () {

        self.slicerCollection.forEach(function (s) {
            s.boundTo().widget().select('');
            s.selectedId(undefined);
        });

        self.busy(false);

        self.nonce.valueHasMutated();
    }

    self.foo = ko.computed({
        read: function () {

            var f = self.nonce();

            if (self.accountGroupSlicer() &&
                self.partnerSlicer() &&
                self.customerTypeSlicer() &&
                self.tagSlicer() &&
                self.statusSlicer() &&
                self.displaySlicer() &&
                self.advertisingSlicer()) {
                var ids = [];

                self.slicerCollection.forEach(function (p) {
                    ids.push({
                        name: p.name,
                        selectedId: p.selectedId()
                    });
                });

                console.log('group three was evaluated and found', ids);

                if (self.parent) {
                    if (ids.length)
                        return ids;
                    else
                        return false;
                }
            }
            return false;
        }
    }, self).extend({
        rateLimit: {
            method: 'notifyWhenChangesStop',
            timeout: 100
        }
    });
}