var slicerGroupViewModel = function (parent) {
    var self = this;

    self.parent = parent;

    self.skipFirst = false;

    self.repSlicer = ko.observable();
    self.marketSlicer = ko.observable();
    self.repOrAgentSlicer = ko.observable();

    var preselectedRep = getPreselectedSalesRep();

    var repOrAgent = null;
    var repId = null;
    var marketId = null;
    var currencyId = null;

    if (preselectedRep != null) {
        repId = preselectedRep.SalesRepresentativeID;
        marketId = preselectedRep.SalesMarketID;
    }
    self.preselectedRep = preselectedRep;

    self.repId = ko.observable(repId);
    self.marketId = ko.observable(marketId);
    self.repOrAgentId = ko.observable(repOrAgent);
    self.selectedCurrency = ko.observable();
    self.selectedCurrencyId = ko.observable();

    // false == "Sterling" 
    // true == "Currency"
    self.currencyDisplay = ko.observable(false);

    self.currencyDisplay.subscribe(function (newValue) {
        window.setTimeout(function () {
            self.clearSlicers();
            self.marketSlicer().dataSource.read();
            switch (newValue) {
                case true:
                    //$('.panel-collapse').not('#rep-search-collapse').collapse('hide');
                    self.parent.hideGBPColumns();
                    self.parent.showCurrencyColumns();
                    break;
                case false:
                    self.selectedCurrency(undefined);
                    self.selectedCurrencyId(undefined);
                    self.parent.hideCurrencyColumns();
                    self.parent.showGBPColumns();
                    break;
                default: break;
            }
        }, 400);
    });

    self.repSlicerParams = {
        log: true,
        autoBind: true,
        name: 'Sales Person',
        valueField: 'SalesRepresentativeID',
        textField: 'Name',
        boundTo: self.repSlicer,
        selectedId: self.repId,
        endPoint: '/api/salesstatisticsapi/SalesRepresentativeSlicerEndpoint',
        clearValue: null,
        readOnly: lockedToRep,
        clearSiblings: false
    };

    self.repOrAgentSlicerParams = {
        //log: true,
        autoBind: true,
        name: 'Acting as',
        valueField: 'SalesRepOrAgent',
        textField: 'Name',
        boundTo: self.repOrAgentSlicer,
        selectedId: self.repOrAgentId,
        endPoint: '/api/salesstatisticsapi/SalesRepOrAgentSlicerEndpoint',
        //noOptionLabel: true,
        selectOnlyItem: true,
        clearValue: null,
        optionLabelText: "Either Representative or Agent"
    };

    self.marketSlicerParams = {
        //log: true,
        autoBind: true,
        name: 'Sales Market',
        valueField: 'SalesMarketID',
        textField: 'Name',
        boundTo: self.marketSlicer,
        selectedId: self.marketId,
        endPoint: '/api/salesstatisticsapi/SalesMarketSlicerEndpoint',
        selectOnlyItem: true,
        clearValue: null,
        optionLabelText: 'All',
        additionalParams: [{
            name: 'CurrencyDisplay',
            value: self.currencyDisplay
        }, {
            name: 'CurrencyID',
            value: self.selectedCurrencyId
        }],
        selectionAffects: [{
            names: ['CurrencyCode', 'FormattingCulture'],
            value: self.selectedCurrency
        }, {
            name: 'CurrencyID',
            value: self.selectedCurrencyId
        }],
        compositeKey: {
            names: ['SalesMarketID', 'CurrencyID'],
            onlyIf: self.currencyDisplay
        }
    };

    self.slicerCollection = [
        self.repSlicerParams,
        self.repOrAgentSlicerParams,
        self.marketSlicerParams
    ];

    self.clearSlicers = function () {

        if (self.preselectedRep) {
            self.slicerCollection.forEach(function (s) {
                if (s.boundTo().name != 'Sales Person') {
                    if (s.boundTo().hasOwnProperty('clearValue')) {
                        s.boundTo().widget().value(s.boundTo().clearValue);
                        s.boundTo().widget().trigger('change');
                    } else {
                        s.boundTo().widget().value(null);
                        s.boundTo().widget().trigger('change');
                    }
                }
            });
        } else {
            self.slicerCollection.forEach(function (s) {
                if (s.boundTo().hasOwnProperty('clearValue')) {
                    s.boundTo().widget().value(s.boundTo().clearValue);
                    s.boundTo().widget().trigger('change');
                } else {
                    s.boundTo().widget().value(null);
                    s.boundTo().widget().trigger('change');
                }
            });
        }


        // If there are values to clear, the slicers will cause
        // the evaluation of foo() when their values are cleared.
        // If there were no changes - everything was already cleared,
        // then 
    }

    self.marketSlicerParams.slicerCollection = self.slicerCollection;
    self.repSlicerParams.slicerCollection = self.slicerCollection;
    self.repOrAgentSlicerParams.slicerCollection = self.slicerCollection;

    self.previousValues = null;

    self.nonce = ko.observable();

    self.foo = ko.computed({
        read: function () {

            var f = self.nonce();

            if (self.repSlicer() &&
                self.marketSlicer() &&
                self.repOrAgentSlicer()) {
                var ids = [];

                self.slicerCollection.forEach(function (p) {
                    ids.push({
                        name: p.name,
                        selectedId: p.selectedId(),
                        selectionAffects: ko.toJS(p.boundTo().selectionAffects)
                    });

                    for (var i = 0; i < p.boundTo().selectionAffects.length; i++) {
                        var q = p.boundTo().selectionAffects[i].value();
                    }
                });
                 
                // also skip if the IDs haven't changed...

                var unchangedSkip = false;

                if (self.previousValues) {
                    for (var pr = 0; pr < self.previousValues.length; pr++) {
                        var p = self.previousValues[pr];

                        var q = Enumerable.From(ids).Where(function (x) {
                            return x.name == p.name
                        }).SingleOrDefault();

                        if (q) {
                            if (p.selectedId == q.selectedId) {
                                // this is no longer the only condition for an unchanged skip
                                // ... we have other dependencies... such as currency.

                                unchangedSkip = true; // our primary selectedId matches

                                // but we have selectionAffects which we care about
                                for (var i = 0; i < p.selectionAffects.length; i++) {
                                    var affected = p.selectionAffects[i];
                                    // q must have the same list of additional params...
                                    var previousAffected = Enumerable.From(q.selectionAffects).Where(function (x) {
                                        return x.name == affected.name;
                                    }).SingleOrDefault();

                                    if (previousAffected == null) {
                                        unchangedSkip = false;
                                        break;
                                    } else {
                                        // because {} != {}... and I don't care about the object maintaned for currency display purposes,
                                        // just about the currency ID...
                                        if (typeof affected.value === 'object') {
                                            continue;
                                        }
                                        if (affected.value != previousAffected.value) {
                                            unchangedSkip = false;
                                            break;
                                        }
                                    }
                                }
                            } else {
                                unchangedSkip = false;
                                break;
                            }
                        } else {
                            unchangedSkip = false;
                            break;
                        }
                    }
                }

                if (self.skipFirst || unchangedSkip) {
                    self.skipFirst = false;

                    // because parameters have not changed I cannot now see the Quarterly Sales
                    // which is just a result of it not having bound yet - so...
                    // even if we skip, we can safely bind the Total and Quarterlies.

                    // but... we can't say the same for Area or Customer Dashboard.

                    // so... set a flag to tell us if it has been bound at least once.
                    // if we are skipping, and we have not yet bound either of these, and... they're going to be...
                    // viewed... then bind them?

                    // this, for the first three grids (Total, Calendar, Financial) is performed already
                    // by dint of us having called FetchTotalsQuarterlies.

                    // however, for the Area grid and the Customer Dashboard and Grid...
                    // we still face the same problem.

                    if (self.currencyDisplay() && !self.marketId()) {

                    } else {
                        if (!self.parent.salesAreaBound.peek()) {
                            if ($('#sales-area-collapse').hasClass('in')) {
                                self.parent.salesByAreaWidget().dataSource.read();
                            }
                        }

                        if ($('#sales-customer-collapse').hasClass('in')) {
                            if (!self.parent.customerDashboardBound.peek()) {
                                self.parent.fetchCustomerDashboard();
                            }
                        }
                    }
                } else {
                    if (self.currencyDisplay() && !self.marketId()) {

                    } else {
                        if (self.parent) {
                            self.parent.fetchStatistics(ids);
                        }
                    }
                }

                self.previousValues = ids;

                if (!unchangedSkip) {
                    // there WERE changes made to the parameters, 
                    // rather than just a valueHasMutated call on the nonce,
                    // but we might not have been displaying grids.
                    // therefore when they're reopened following an actual parameter change
                    // they don't know that they must rebind 

                    self.parent.salesAreaBound(false);
                    self.parent.customerDashboardBound(false);
                    // unless we tell them
                }
            }
        }
    }, self).extend({
        rateLimit: {
            method: 'notifyWhenChangesStop',
            timeout: 100
        }
    });

    self.gridsVisible = ko.computed(function () {
        if (self.currencyDisplay() && ! self.marketId()) { 
            return false;
        } else { 
            return true;
        }
    }, self);
}

var salesStatisticsViewModel = function () {
    var self = this;

    // #region properties

    self.thisYear = new Date().getYear() - 100;
    self.lastYear = self.thisYear - 1;
    self.nextYear = self.thisYear + 1;
    self.financialQ1to3 = 0;
    self.financialQ4 = 0;

    self.thisMonth = new Date().getMonth() + 1;
    if (self.thisMonth >= 4) {
        self.financialQ1to3 = self.thisYear;
        self.financialQ4 = self.nextYear;
    } else {
        self.financialQ1to3 = self.lastYear;
        self.financialQ4 = self.thisYear;
    }

    self.slicerGroup = new slicerGroupViewModel(self);

    //var preselectedRep = getPreselectedSalesRep();

    //if (preselectedRep != null) {
    //    self.slicerGroup.repSlicerParams.boundTo.subscribe(function (newValue) {
    //        window.setTimeout(function () {
    //            //console.log('slicerGroup repSlicer boundTo subscribe hit', newValue, preselectedRep);

    //            // This... is all not necessary
    //            //self.slicerGroup.repSlicer().selectedId(preselectedRep.SalesRepresentativeID);
    //            //self.slicerGroup.repSlicer().widget().value(preselectedRep.SalesRepresentativeID);

    //            //self.slicerGroupOne.repSlicer().selectedId(preselectedRep.SalesRepresentativeID);
    //            //self.slicerGroupOne.repSlicer().widget().value(preselectedRep.SalesRepresentativeID);

    //            //if (preselectedRep.SalesMarketID) {
    //            //    self.slicerGroup.marketSlicer().selectedId(preselectedRep.SalesMarketID);
    //            //    self.slicerGroup.marketSlicer().widget().value(preselectedRep.SalesMarketID);
    //            //    self.slicerGroup.marketSlicer().widget().dataSource.read();

    //            //    self.slicerGroupOne.marketSlicer().selectedId(preselectedRep.SalesMarketID);
    //            //    self.slicerGroupOne.marketSlicer().widget().value(preselectedRep.SalesMarketID);
    //            //}

    //            self.slicerGroup.currencySlicer().widget().dataSource.read();
    //            self.slicerGroup.marketSlicer().widget().dataSource.read();

    //            // we have a preselectedrep; don't know if they're a rep or an agent... but 
    //            // we DO want to set repOrAgent to a sensible value, but we CAN'T BECAUSE IT RESETS.
    //            // it does hold this provided value for a fraction of a second, so what changes it?

    //            //self.slicerGroup.repOrAgentSlicer().selectedId(0);
    //            //self.slicerGroup.repOrAgentSlicer().widget().select(0);
    //            //self.slicerGroup.repOrAgentSlicer().widget().value(0);
    //            //self.slicerGroup.repOrAgentSlicer().widget().dataSource.read();
    //        }, 0);
    //    });
    //}

    self.idField = 'TradeAccountID';

    // #endregion

    // #region observables

    self.salesMonthRangeBusy = ko.observable(false);
    self.loadingBusy = ko.observable(false);
    self.selectedMarket = ko.observable();
    self.accountCount = ko.observable();
    self.openClosedBothState = ko.observable('All');
    self.customerDashboard = ko.observable();
    self.totalSalesWidget = ko.observable();
    self.salesByAreaWidget = ko.observable();
    self.salesByCustomerWidget = ko.observable();
    self.salesByQuarterFinancialWidget = ko.observable();
    self.salesByQuarterCalendarWidget = ko.observable();
    self.monthRangeWidget = ko.observable();

    self.availableMarkets = ko.observableArray(getAvailableMarkets());
    self.totalSales = ko.observableArray([]);
    self.salesByQuarterFinancial = ko.observableArray([]);
    self.salesByQuarterCalendar = ko.observableArray([]);

    self.salesAreaBound = ko.observable(false);
    self.customerDashboardBound = ko.observable(false);
    self.customerGridBound = ko.observable(false);
    self.customerAnalysisBound = ko.observable(false);

    self.salesAreaGridBusy = ko.observable(true); // we want this one to start busy. Trust me.
    self.salesCustomerGridBusy = ko.observable(true); // this one too.
    // Oh, go on then - it's because they initially
    // start unbound and so have an ugly looking layout
    // so previously I had it setting the busy flag every time the panel was expanded
    // and then added the 'skip if parameters haven't changed' feature
    // and kept it setting busy on expansion, which not only was unncessary but also made it look like
    // the query was potentially being re-executed, which it wasn't. 
    // So there's the need for these guys to begin with their loading panels showing, but only the once.
    
    // these are altered on the very first calls to show or hide.
    // the notion being that you start by showing NO columns. Roughly.
    self.showingGBPColumns = ko.observable(false);
    self.showingCurrencyColumns = ko.observable(false);

    // when we need to change the columns... i.e. on... data binding... shit, will that work?
    // we need to call getOptions() and then modify columns on the result, then call setOptions with
    // the modified options object.


    // #endregion

    // #region subscriptions

    // these two subscribe-to-sort hooks both cause initial binding... ugh.
    // should be able to have the initial data set sorted and... not have to cause binding here

    //self.salesByAreaWidget.subscribe(function (newValue) {
    //    self.salesByAreaWidget().dataSource.sort({
    //        field: 'TY_FinancialYearToDate',
    //        dir: 'desc'
    //    });
    //});

    //self.salesAreaGridBusy.subscribe(function (newValue) {
    //    console.log('salesAreaGridBusy', newValue);
    //});

    //self.salesByCustomerWidget.subscribe(function (newValue) {
    //    self.salesByCustomerWidget().dataSource.sort({
    //        field: 'TY_FinancialYearToDate',
    //        dir: 'desc'
    //    });
    //});

    // #endregion

    // #region computeds

    // #endregion

    // #region functions

    self.hideCurrencyColumns = function () {
        console.log('hideCurrencyColumns called');

        $(".dashboard-currency").hide();

        if (self.totalSalesWidget())
            self.totalSalesWidget().hideColumn(1);
        if (self.salesByQuarterCalendarWidget())
            self.salesByQuarterCalendarWidget().hideColumn(0);
        if (self.salesByQuarterFinancialWidget())
            self.salesByQuarterFinancialWidget().hideColumn(0);
        //if (self.salesByAreaWidget())
        //    self.salesByAreaWidget().hideColumn('currency');
        //if (self.salesByCustomerWidget())
        //    self.salesByCustomerWidget().hideColumn(7);
        if (self.customerAnalysisWidget())
            self.customerAnalysisWidget().hideColumn('currency');

        self.showingCurrencyColumns(false);
    }

    self.showCurrencyColumns = function () {
        console.log('showCurrencyColumns called');

        $(".dashboard-currency").show();

        if (self.totalSalesWidget()) {
            self.totalSalesWidget().showColumn(0); // to show "Accounts", which begins hidden
            self.totalSalesWidget().showColumn(1);
        }

        if (self.salesByQuarterCalendarWidget())
            self.salesByQuarterCalendarWidget().showColumn(0);
        if (self.salesByQuarterFinancialWidget())
            self.salesByQuarterFinancialWidget().showColumn(0);
        //if (self.salesByAreaWidget())
        //    self.salesByAreaWidget().showColumn('sterling');
        //if (self.salesByCustomerWidget())
        //    self.salesByCustomerWidget().showColumn(7);
        if (self.customerAnalysisWidget())
            self.customerAnalysisWidget().showColumn('currency');

        self.showingCurrencyColumns(true);
    }

    self.hideGBPColumns = function () {
        console.log('hideGBPColumns called');

        $(".dashboard-gbp").hide();
        
        if (self.totalSalesWidget())
            self.totalSalesWidget().hideColumn(2);
        if (self.salesByQuarterCalendarWidget())
            self.salesByQuarterCalendarWidget().hideColumn(1);
        if (self.salesByQuarterFinancialWidget())
            self.salesByQuarterFinancialWidget().hideColumn(1);
        //if (self.salesByAreaWidget())
        //    self.salesByAreaWidget().hideColumn(4);
        //if (self.salesByCustomerWidget())
        //    self.salesByCustomerWidget().hideColumn(8);
        if (self.customerAnalysisWidget())
            self.customerAnalysisWidget().hideColumn('sterling');

        self.showingGBPColumns(false);
    }

    self.showGBPColumns = function () {
        console.log('showGBPColumns called');

        $(".dashboard-gbp").show();
        
        if (self.totalSalesWidget()) {
            self.totalSalesWidget().showColumn(0); // to show "Accounts", which begins hidden
            self.totalSalesWidget().showColumn(2);
        }

        if (self.salesByQuarterCalendarWidget())
            self.salesByQuarterCalendarWidget().showColumn(1);
        if (self.salesByQuarterFinancialWidget())
            self.salesByQuarterFinancialWidget().showColumn(1);
        //if (self.salesByAreaWidget())
        //    self.salesByAreaWidget().showColumn(4);
        //if (self.salesByCustomerWidget())
        //    self.salesByCustomerWidget().showColumn(8);
        if (self.customerAnalysisWidget())
            self.customerAnalysisWidget().showColumn('sterling');

        self.showingGBPColumns(true);
    }

    self.contactDataToDisplay = ko.observable();

    self.showContactModal = function (from, uid) {
        switch (from) {
            case 'customer':
                var data = self.getCustomersGridRecord(uid);
                self.contactDataToDisplay(data);
                break;
            case 'customerAnalysis':
                var data = self.getCustomerAnalysisGridRecord(uid);
                self.contactDataToDisplay(data);
                break;
        }
        //ko.cleanNode($('#contact-modal')[0]);
        //ko.applyBindings(data, $("#contact-modal")[0]);
        $("#contact-modal").modal('show');
    }

    self.fetchCustomerDashboard = function () {
        var data = {};

        self.slicerGroup.slicerCollection.forEach(function (p) {
            if (typeof p.boundTo === 'function')
                if (p.boundTo().selectedId())
                    data[p.valueField] = p.boundTo().selectedId();
        });

        console.log('calling FetchCustomerDashboard with', data);

        $.ajax({
            url: '/api/salesStatisticsAPI/FetchCustomerDashboard',
            type: 'GET',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('FetchCustomerDashboard returned', data);
                self.customerDashboardBound(true);
                self.customerDashboard(data[0]);
                self.allAccounts();
            },
            error: function (xhr, textStatus, errorThrown) {
                if (xhr.status != 401)
                    $.showError(xhr, textStatus, errorThrown);
            }
        });
    }

    self.fetchStatistics = function () {
        window.setTimeout(function () {
            console.log('fetchStatistics called');

            self.fetchTotalsAndQuarterlies();

            if ($("#sales-area-collapse").hasClass('in')) {
                self.salesByAreaWidget().dataSource.read();
            }

            if ($("#sales-customer-collapse").hasClass('in')) {
                self.fetchCustomerDashboard();
            }

        }, 0);
    }

    self.fetchTotalsAndQuarterlies = function () {
        
        var data = {};

        self.slicerGroup.slicerCollection.forEach(function (p) {
            if (typeof p.boundTo === 'function')
                if (p.boundTo().widget().value())
                    data[p.valueField] = p.boundTo().selectedId();
        });

        data.CurrencyID = self.slicerGroup.selectedCurrencyId();

        //console.log('FetchTotalsAndQuarterlies called with', data);

        var setSterling = true;

        if (data.hasOwnProperty('SalesRepresentativeID')) {
            setSterling = false;
        }

        if (data.hasOwnProperty('SalesMarketID')) {
            setSterling = false;
        }

        if (data.hasOwnProperty('CurrencyID')) {
            setSterling = false;
        }

        if (setSterling) {
            if (!self.showingGBPColumns()) {
                self.slicerGroup.currencyDisplay('sterling');
                self.slicerGroup.currencyDisplay.valueHasMutated();
            }
        }

        self.totalsGridBusy(true);
        self.quarterlyGridBusy(true);

        $.ajax({
            url: '/api/SalesStatisticsAPI/FetchTotalsAndQuarterlies',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                //console.log('FetchTotalsAndQuarterlies returned', data);
                self.totalSales(data.TotalSales);
                self.salesByQuarterFinancial(data.SalesByQuarterFinancial);
                self.salesByQuarterCalendar(data.SalesByQuarterCalendar);

                self.totalSalesWidget().dataSource.read();
                self.salesByQuarterCalendarWidget().dataSource.read();
                self.salesByQuarterFinancialWidget().dataSource.read();

                self.totalsGridBusy(false);
                self.quarterlyGridBusy(false);
            },
            error: function (xhr, textStatus, errorThrown) {
                if (xhr.status != 401)
                    $.showError(xhr, textStatus, errorThrown);
            }
        });
    }

    self.allAccounts = function () {
        $(".dash-panel", $("#sales-customer-collapse")).removeClass('panel-primary');
        $("#all-accounts-panel").addClass('panel-primary');
        self.salesByCustomerWidget().dataSource.query({
            page: 1,
            pageSize: self.salesByCustomerWidget().dataSource.pageSize(),
            filter: self.salesByCustomerWidget().dataSource.filter(),
            sort: self.salesByCustomerWidget().dataSource.sort(),
            widget: 'All',
            aggregate: self.salesByCustomerWidgetAggregates()
        });
    }

    self.newAccounts = function () {
        $(".dash-panel", $("#sales-customer-collapse")).removeClass('panel-primary');
        $("#new-accounts-panel").addClass('panel-primary');
        self.salesByCustomerWidget().dataSource.query({
            page: 1,
            pageSize: self.salesByCustomerWidget().dataSource.pageSize(),
            filter: self.salesByCustomerWidget().dataSource.filter(),
            sort: self.salesByCustomerWidget().dataSource.sort(),
            widget: 'New',
            aggregate: self.salesByCustomerWidgetAggregates()
        });
    }

    self.topCustomers = function () {
        $(".dash-panel", $("#sales-customer-collapse")).removeClass('panel-primary');
        $("#top-customers-panel").addClass('panel-primary');
        self.salesByCustomerWidget().dataSource.query({
            page: 1,
            pageSize: self.salesByCustomerWidget().dataSource.pageSize(),
            filter: self.salesByCustomerWidget().dataSource.filter(),
            sort: self.salesByCustomerWidget().dataSource.sort(),
            widget: 'Top',
            aggregate: self.salesByCustomerWidgetAggregates()
        });
    }

    self.activeAccounts = function () {
        $(".dash-panel", $("#sales-customer-collapse")).removeClass('panel-primary');
        $("#active-accounts-panel").addClass('panel-primary');
        self.salesByCustomerWidget().dataSource.query({
            page: 1,
            pageSize: self.salesByCustomerWidget().dataSource.pageSize(),
            filter: self.salesByCustomerWidget().dataSource.filter(),
            sort: self.salesByCustomerWidget().dataSource.sort(),
            widget: 'Active',
            aggregate: self.salesByCustomerWidgetAggregates()
        });
    }

    self.lapsingAccounts = function () {
        $(".dash-panel", $("#sales-customer-collapse")).removeClass('panel-primary');
        $("#lapsing-accounts-panel").addClass('panel-primary');
        self.salesByCustomerWidget().dataSource.query({
            page: 1,
            pageSize: self.salesByCustomerWidget().dataSource.pageSize(),
            filter: self.salesByCustomerWidget().dataSource.filter(),
            sort: self.salesByCustomerWidget().dataSource.sort(),
            widget: 'Lapsing',
            aggregate: self.salesByCustomerWidgetAggregates()
        });
    }

    self.lapsedAccounts = function () {
        $(".dash-panel", $("#sales-customer-collapse")).removeClass('panel-primary');
        $("#lapsed-accounts-panel").addClass('panel-primary');
        self.salesByCustomerWidget().dataSource.query({
            page: 1,
            pageSize: self.salesByCustomerWidget().dataSource.pageSize(),
            filter: self.salesByCustomerWidget().dataSource.filter(),
            sort: self.salesByCustomerWidget().dataSource.sort(),
            widget: 'Lapsed',
            aggregate: self.salesByCustomerWidgetAggregates()
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

    self.setGridWidth = function (e) {
        var cols = e.sender.columns;
        var currentColWidth = cols.reduce(function (prev, cur) {
            if (!cur.hidden) {
                return prev += cur.width;
            } else {
                return prev;
            }
        }, 0);

        e.sender.wrapper.width(currentColWidth + kendo.support.scrollbar() + 1);
    }

    self.init = function () {
        //self.hideCurrencyColumns();

        self.salesByAreaWidget().hideColumn('currency');
        self.salesByCustomerWidget().hideColumn('currency');
        //self.slicerGroup.currencyDisplay(false);
    }

    // #endregion

    // #region Summary Grid

    self.totalsGridBusy = ko.observable(false);
    self.quarterlyGridBusy = ko.observable(false);

    self.summaryGridSettings = {
        autoBind: false,
        widget: self.totalSalesWidget,
        data: self.totalSales,
        scrollable: false,
        //width: 1000,
        columns: [
        {
            field: '',
            title: '',
            hidden: false,
            columns: [{
                field: '',
                title: '',
                columns: [{
                    field: 'AccountsCount',
                    title: 'Accounts',
                    headerAttributes: {
                        'class': 'fourth-heading'
                    },
                    attributes: {
                        'class': 'text-right left-border'
                    },
                    width: 70
                }]
            }]
        }, {
            field: '',
            title: 'Total Sales in Currency',
            hidden: true,
            headerAttributes: {
                'class': 'first-heading'
            },
            //width: 1000,
            columns: [{
                field: '',
                title: 'Financial',
                headerAttributes: {
                    'class': 'second-heading'
                },
                //width: 250,
                columns: [{
                    field: 'TY_FinancialYearToDateCurr',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_FinancialYearToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_FinancialYearToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_FinancialYearToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    //width: 100,
                }, {
                    field: 'LY_FinancialYearToDateCurr',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_FinancialYearToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_FinancialYearToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_FinancialYearToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 100,
                }, {
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
                    //width: 50
                }]
            }, {
                field: '',
                title: 'Calendar',
                headerAttributes: {
                    'class': 'second-heading'
                },
                //width: 250,
                columns: [{
                    field: 'TY_CalendarYearToDateCurr',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_CalendarYearToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_CalendarYearToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_CalendarYearToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    //width: 100,
                }, {
                    field: 'LY_CalendarYearToDateCurr',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_CalendarYearToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_CalendarYearToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_CalendarYearToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 100,
                }, {
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
                    //width: 50
                }]
            }, {
                field: '',
                title: 'Month',
                headerAttributes: {
                    'class': 'second-heading'
                },
                //width: 250,
                columns: [{
                    field: 'TY_MonthToDateCurr',
                    title: 'MTD',
                    template: function (rec) {
                        if (rec.TY_MonthToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_MonthToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_MonthToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    //width: 100,
                }, {
                    field: 'LY_MonthToDateCurr text-right',
                    title: 'LMTD',
                    template: function (rec) {
                        if (rec.LY_MonthToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_MonthToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_MonthToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 100,
                }, {
                    field: 'MonthToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        if (rec.MonthToDateGrowthCurr >= 0)
                            return formatPercentage(rec.MonthToDateGrowthCurr);
                        else
                            return '<span class="text-danger">' + formatPercentage(rec.MonthToDateGrowthCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'right-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right right-border'
                    },
                    //width: 50
                }]
            }]
        },
        {
            field: '',
            title: 'Total Sales in Sterling',
            hidden: false,
            headerAttributes: {
                'class': 'first-heading'
            },
            //width: 1000,
            columns: [{
                field: '',
                title: 'Financial',
                headerAttributes: {
                    'class': 'second-heading'
                },
                //width: 250,
                columns: [{
                    field: 'TY_FinancialYearToDate',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_FinancialYearToDate >= 0)
                            return formatGBP(rec.TY_FinancialYearToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_FinancialYearToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    //width: 100
                }, {
                    field: 'LY_FinancialYearToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_FinancialYearToDate >= 0)
                            return formatGBP(rec.LY_FinancialYearToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_FinancialYearToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 100
                }, {
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
                    //width: 50
                }]
            }, {
                field: '',
                title: 'Calendar',
                headerAttributes: {
                    'class': 'second-heading'
                },
                //width: 250,
                columns: [{
                    field: 'TY_CalendarYearToDate',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_CalendarYearToDate >= 0)
                            return formatGBP(rec.TY_CalendarYearToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_CalendarYearToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    //width: 100
                }, {
                    field: 'LY_CalendarYearToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_CalendarYearToDate >= 0)
                            return formatGBP(rec.LY_CalendarYearToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_CalendarYearToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 100
                }, {
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
                    //width: 50
                }]
            }, {
                field: '',
                title: 'Month',
                headerAttributes: {
                    'class': 'second-heading'
                },
                //width: 250,
                columns: [{
                    field: 'TY_MonthToDate',
                    title: 'MTD',
                    template: function (rec) {
                        if (rec.TY_MonthToDate >= 0)
                            return formatGBP(rec.TY_MonthToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_MonthToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    //width: 100
                }, {
                    field: 'LY_MonthToDate',
                    title: 'LMTD',
                    template: function (rec) {
                        if (rec.LY_MonthToDate >= 0)
                            return formatGBP(rec.LY_MonthToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_MonthToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 100
                }, {
                    field: 'MonthToDateGrowth',
                    title: 'GRTH',
                    template: function (rec) {
                        if (rec.MonthToDateGrowth >= 0)
                            return formatPercentage(rec.MonthToDateGrowth);
                        else
                            return '<span class="text-danger">' + formatPercentage(rec.MonthToDateGrowth) + '</span>';
                    },
                    attributes: {
                        'class': 'right-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right right-border'
                    },
                    //width: 50
                }]
            }]
        }],
        sortable: false,
        filterable: false,
        grouping: false,
        serverGrouping: false,
        pageable: false,
        columnShow: function (e) {
            self.totalsGridBusy(false);
        },
        columnHide: function (e) {
            self.totalsGridBusy(false);
        }
    }

    // #endregion

    // #region Sales by Quarter Grid (Calendar)

    self.quarterGridsBusy = ko.observable(true);

    self.quarterCalendarGridSettings = {
        autoBind: false,
        height: 127,
        widget: self.salesByQuarterCalendarWidget,
        data: self.salesByQuarterCalendar,
        scrollable: false,
        columns: [{
            field: '',
            title: 'Calendar Year in Currency',
            hidden: true,
            headerAttributes: {
                'class': 'first-heading'
            },
            width: 1100,
            columns: [{
                field: '',
                headerTemplate: '<span class="larger">Q1</span> (Jan ' + self.thisYear + ' - Mar ' + self.thisYear + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_CalendarQ1ToDateCurr',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_CalendarQ1ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_CalendarQ1ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_CalendarQ1ToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_CalendarQ1ToDateCurr',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_CalendarQ1ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_CalendarQ1ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_CalendarQ1ToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'CalendarQ1ToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_CalendarQ1ToDateCurr ? rec.TY_CalendarQ1ToDateCurr : 0) -
                                     (rec.LY_CalendarQ1ToDateCurr ? rec.LY_CalendarQ1ToDateCurr : 0)) /
                                     (rec.LY_CalendarQ1ToDateCurr ? Math.abs(rec.LY_CalendarQ1ToDateCurr) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 75
                }]
            }, {
                field: '',
                headerTemplate: '<span class="larger">Q2</span> (Apr ' + self.thisYear + ' - Jun ' + self.thisYear + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_CalendarQ2ToDateCurr',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_CalendarQ2ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_CalendarQ2ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_CalendarQ2ToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_CalendarQ2ToDateCurr',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_CalendarQ2ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_CalendarQ2ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_CalendarQ2ToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'CalendarQ2ToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_CalendarQ2ToDateCurr ? rec.TY_CalendarQ2ToDateCurr : 0) -
                                     (rec.LY_CalendarQ2ToDateCurr ? rec.LY_CalendarQ2ToDateCurr : 0)) /
                                     (rec.LY_CalendarQ2ToDateCurr ? Math.abs(rec.LY_CalendarQ2ToDateCurr) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 75
                }]
            }, {
                field: '',
                headerTemplate: '<span class="larger">Q3</span> (Jul ' + self.thisYear + ' - Sep ' + self.thisYear + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_CalendarQ3ToDateCurr',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_CalendarQ3ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_CalendarQ3ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_CalendarQ3ToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_CalendarQ3ToDateCurr',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_CalendarQ3ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_CalendarQ3ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_CalendarQ3ToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'CalendarQ3ToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_CalendarQ3ToDateCurr ? rec.TY_CalendarQ3ToDateCurr : 0) -
                                     (rec.LY_CalendarQ3ToDateCurr ? rec.LY_CalendarQ3ToDateCurr : 0)) /
                                     (rec.LY_CalendarQ3ToDateCurr ? Math.abs(rec.LY_CalendarQ3ToDateCurr) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 75
                }]
            }, {
                field: '',
                headerTemplate: '<span class="larger">Q4</span> (Oct ' + self.thisYear + ' - Dec ' + self.thisYear + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_CalendarQ4ToDateCurr',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_CalendarQ4ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_CalendarQ4ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_CalendarQ4ToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_CalendarQ4ToDateCurr',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_CalendarQ4ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_CalendarQ4ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_CalendarQ4ToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'CalendarQ4ToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_CalendarQ4ToDateCurr ? rec.TY_CalendarQ4ToDateCurr : 0) -
                                     (rec.LY_CalendarQ4ToDateCurr ? rec.LY_CalendarQ4ToDateCurr : 0)) /
                                     (rec.LY_CalendarQ4ToDateCurr ? Math.abs(rec.LY_CalendarQ4ToDateCurr) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    attributes: {
                        'class': 'right-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right right-border'
                    },
                    width: 75
                }]
            }]
        },
        {
            field: '',
            title: 'Calendar Year in Sterling',
            hidden: false,
            headerAttributes: {
                'class': 'first-heading'
            },
            width: 1100,
            columns: [{
                field: '',
                headerTemplate: '<span class="larger">Q1</span> (Jan ' + self.thisYear + ' - Mar ' + self.thisYear + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_CalendarQ1ToDate',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_CalendarQ1ToDate >= 0)
                            return formatGBP(rec.TY_CalendarQ1ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_CalendarQ1ToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_CalendarQ1ToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_CalendarQ1ToDate >= 0)
                            return formatGBP(rec.LY_CalendarQ1ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_CalendarQ1ToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'CalendarQ1ToDateGrowth',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_CalendarQ1ToDate ? rec.TY_CalendarQ1ToDate : 0) -
                                     (rec.LY_CalendarQ1ToDate ? rec.LY_CalendarQ1ToDate : 0)) /
                                     (rec.LY_CalendarQ1ToDate ? Math.abs(rec.LY_CalendarQ1ToDate) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 75
                }]
            }, {
                field: '',
                headerTemplate: '<span class="larger">Q2</span> (Apr ' + self.thisYear + ' - Jun ' + self.thisYear + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_CalendarQ2ToDate',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_CalendarQ2ToDate >= 0)
                            return formatGBP(rec.TY_CalendarQ2ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_CalendarQ2ToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_CalendarQ2ToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_CalendarQ2ToDate >= 0)
                            return formatGBP(rec.LY_CalendarQ2ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_CalendarQ2ToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'CalendarQ2ToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_CalendarQ2ToDate ? rec.TY_CalendarQ2ToDate : 0) -
                                     (rec.LY_CalendarQ2ToDate ? rec.LY_CalendarQ2ToDate : 0)) /
                                     (rec.LY_CalendarQ2ToDateC? Math.abs(rec.LY_CalendarQ2ToDate) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 75
                }]
            }, {
                field: '',
                headerTemplate: '<span class="larger">Q3</span> (Jul ' + self.thisYear + ' - Sep ' + self.thisYear + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_CalendarQ3ToDate',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_CalendarQ3ToDate >= 0)
                            return formatGBP(rec.TY_CalendarQ3ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_CalendarQ3ToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_CalendarQ3ToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_CalendarQ3ToDate >= 0)
                            return formatGBP(rec.LY_CalendarQ3ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_CalendarQ3ToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'CalendarQ3ToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_CalendarQ3ToDate ? rec.TY_CalendarQ3ToDate : 0) -
                                     (rec.LY_CalendarQ3ToDate ? rec.LY_CalendarQ3ToDate : 0)) /
                                     (rec.LY_CalendarQ3ToDate ? Math.abs(rec.LY_CalendarQ3ToDate) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 75
                }]
            }, {
                field: '',
                headerTemplate: '<span class="larger">Q4</span> (Oct ' + self.thisYear + ' - Dec ' + self.thisYear + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_CalendarQ4ToDate',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_CalendarQ4ToDate >= 0)
                            return formatGBP(rec.TY_CalendarQ4ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_CalendarQ4ToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_CalendarQ4ToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_CalendarQ4ToDate >= 0)
                            return formatGBP(rec.LY_CalendarQ4ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_CalendarQ4ToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'CalendarQ4ToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_CalendarQ4ToDate ? rec.TY_CalendarQ4ToDate : 0) -
                                     (rec.LY_CalendarQ4ToDate ? rec.LY_CalendarQ4ToDate : 0)) /
                                     (rec.LY_CalendarQ4ToDate ? Math.abs(rec.LY_CalendarQ4ToDate) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    attributes: {
                        'class': 'right-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right right-border'
                    },
                    width: 75
                }]
            }]
        }],
        sortable: true,
        filterable: false,
        grouping: false,
        serverGrouping: false,
        pageable: false,
        columnShow: function (e) {
            self.quarterlyGridBusy(false);
        },
        columnHide: function (e) {
            self.quarterlyGridBusy(false);
        }
    }

    // #endregion

    // #region Sales by Quarter Grid (Financial)

    self.quarterFinancialGridSettings = {
        autoBind: false,
        height: 127,
        widget: self.salesByQuarterFinancialWidget,
        data: self.salesByQuarterFinancial,
        sortable: false,
        scrollable: false,
        columns: [{
            field: '',
            title: 'Financial Year in Currency',
            hidden: true,
            headerAttributes: {
                'class': 'first-heading'
            },
            width: 1100,
            columns: [{
                field: '',
                headerTemplate: '<span class="larger">Q1</span> (Apr ' + self.financialQ1to3 + ' - Jun ' + self.financialQ1to3 + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_FinancialQ1ToDateCurr',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_FinancialQ1ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_FinancialQ1ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_FinancialQ1ToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_FinancialQ1ToDateCurr',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_FinancialQ1ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_FinancialQ1ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_FinancialQ1ToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'FinancialQ1ToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_FinancialQ1ToDateCurr ? rec.TY_FinancialQ1ToDateCurr : 0) -
                                     (rec.LY_FinancialQ1ToDateCurr ? rec.LY_FinancialQ1ToDateCurr : 0)) /
                                     (rec.LY_FinancialQ1ToDateCurr ? Math.abs(rec.LY_FinancialQ1ToDateCurr) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 75
                }]
            }, {
                field: '',
                headerTemplate: '<span class="larger">Q2</span> (Jul ' + self.financialQ1to3 + ' - Sep ' + self.financialQ1to3 + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_FinancialQ2ToDateCurr',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_FinancialQ2ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_FinancialQ2ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_FinancialQ2ToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_FinancialQ2ToDateCurr',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_FinancialQ2ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_FinancialQ2ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_FinancialQ2ToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'FinancialQ2ToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_FinancialQ2ToDateCurr ? rec.TY_FinancialQ2ToDateCurr : 0) -
                                     (rec.LY_FinancialQ2ToDateCurr ? rec.LY_FinancialQ2ToDateCurr : 0)) /
                                     (rec.LY_FinancialQ2ToDateCurr ? Math.abs(rec.LY_FinancialQ2ToDateCurr) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 75
                }]
            }, {
                field: '',
                headerTemplate: '<span class="larger">Q3</span> (Oct ' + self.financialQ1to3 + ' - Dec ' + self.financialQ1to3 + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_FinancialQ3ToDateCurr',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_FinancialQ3ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_FinancialQ3ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_FinancialQ3ToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_FinancialQ3ToDateCurr',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_FinancialQ3ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_FinancialQ3ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_FinancialQ3ToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'FinancialQ3ToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_FinancialQ3ToDateCurr ? rec.TY_FinancialQ3ToDateCurr : 0) -
                                     (rec.LY_FinancialQ3ToDateCurr ? rec.LY_FinancialQ3ToDateCurr : 0)) /
                                     (rec.LY_FinancialQ3ToDateCurr ? Math.abs(rec.LY_FinancialQ3ToDateCurr) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 75
                }]
            }, {
                field: '',
                headerTemplate: '<span class="larger">Q4</span> (Jan ' + self.financialQ4 + ' - Mar ' + self.financialQ4 + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_FinancialQ4ToDateCurr',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_FinancialQ4ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_FinancialQ4ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_FinancialQ4ToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_FinancialQ4ToDateCurr',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_FinancialQ4ToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_FinancialQ4ToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_FinancialQ4ToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'FinancialQ4ToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_FinancialQ4ToDateCurr ? rec.TY_FinancialQ4ToDateCurr : 0) -
                                     (rec.LY_FinancialQ4ToDateCurr ? rec.LY_FinancialQ4ToDateCurr : 0)) /
                                     (rec.LY_FinancialQ4ToDateCurr ? Math.abs(rec.LY_FinancialQ4ToDateCurr) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    attributes: {
                        'class': 'right-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right right-border'
                    },
                    width: 75
                }]
            }]
        },
        {
            field: '',
            title: 'Financial Year in Sterling',
            hidden: false,
            headerAttributes: {
                'class': 'first-heading'
            },
            width: 1100,
            columns: [{
                field: '',
                headerTemplate: '<span class="larger">Q1</span> (Apr ' + self.financialQ1to3 + ' - Jun ' + self.financialQ1to3 + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_FinancialQ1ToDate',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_FinancialQ1ToDate >= 0)
                            return formatGBP(rec.TY_FinancialQ1ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_FinancialQ1ToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_FinancialQ1ToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_FinancialQ1ToDate >= 0)
                            return formatGBP(rec.LY_FinancialQ1ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_FinancialQ1ToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'FinancialQ1ToDateGrowth',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_FinancialQ1ToDate ? rec.TY_FinancialQ1ToDate : 0) -
                                     (rec.LY_FinancialQ1ToDate ? rec.LY_FinancialQ1ToDate : 0)) /
                                     (rec.LY_FinancialQ1ToDate ? Math.abs(rec.LY_FinancialQ1ToDate) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 75
                }]
            }, {
                field: '',
                headerTemplate: '<span class="larger">Q2</span> (Jul ' + self.financialQ1to3 + ' - Sep ' + self.financialQ1to3 + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_FinancialQ2ToDate',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_FinancialQ2ToDate >= 0)
                            return formatGBP(rec.TY_FinancialQ2ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_FinancialQ2ToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_FinancialQ2ToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_FinancialQ2ToDate >= 0)
                            return formatGBP(rec.LY_FinancialQ2ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_FinancialQ2ToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'FinancialQ2ToDateGrowth',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_FinancialQ2ToDate ? rec.TY_FinancialQ2ToDate : 0) -
                                     (rec.LY_FinancialQ2ToDate ? rec.LY_FinancialQ2ToDate : 0)) /
                                     (rec.LY_FinancialQ2ToDate ? Math.abs(rec.LY_FinancialQ2ToDate) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 75
                }]
            }, {
                field: '',
                headerTemplate: '<span class="larger">Q3</span> (Oct ' + self.financialQ1to3 + ' - Dec ' + self.financialQ1to3 + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_FinancialQ3ToDate',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_FinancialQ3ToDate >= 0)
                            return formatGBP(rec.TY_FinancialQ3ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_FinancialQ3ToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_FinancialQ3ToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_FinancialQ3ToDate >= 0)
                            return formatGBP(rec.LY_FinancialQ3ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_FinancialQ3ToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'FinancialQ3ToDateGrowth',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_FinancialQ3ToDate ? rec.TY_FinancialQ3ToDate : 0) -
                                     (rec.LY_FinancialQ3ToDate ? rec.LY_FinancialQ3ToDate : 0)) /
                                     (rec.LY_FinancialQ3ToDate ? Math.abs(rec.LY_FinancialQ3ToDate) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 75
                }]
            }, {
                field: '',
                headerTemplate: '<span class="larger">Q4</span> (Jan ' + self.financialQ4 + ' - Mar ' + self.financialQ4 + ')',
                headerAttributes: {
                    'class': 'second-heading'
                },
                width: 275,
                columns: [{
                    field: 'TY_FinancialQ4ToDate',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_FinancialQ4ToDate >= 0)
                            return formatGBP(rec.TY_FinancialQ4ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_FinancialQ4ToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    width: 100,
                }, {
                    field: 'LY_FinancialQ4ToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_FinancialQ4ToDate >= 0)
                            return formatGBP(rec.LY_FinancialQ4ToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_FinancialQ4ToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    width: 100,
                }, {
                    field: 'FinancialQ4ToDateGrowth',
                    title: 'GRTH',
                    template: function (rec) {
                        var value = ((rec.TY_FinancialQ4ToDate ? rec.TY_FinancialQ4ToDate : 0) -
                                     (rec.LY_FinancialQ4ToDate ? rec.LY_FinancialQ4ToDate : 0)) /
                                     (rec.LY_FinancialQ4ToDate ? Math.abs(rec.LY_FinancialQ4ToDate) : 1);
                        if (value >= 0)
                            return formatPercentage(value);
                        else
                            return '<span class="text-danger">' + formatPercentage(value) + '</span>'
                    },
                    attributes: {
                        'class': 'right-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right right-border'
                    },
                    width: 75
                }]
            }]
        }],
        filterable: false,
        grouping: false,
        serverGrouping: false,
        pageable: false,
        columnShow: function (e) {
            self.quarterGridsBusy(false);
        },
        columnHide: function (e) {
            self.quarterGridsBusy(false);
        }
    }

    // #endregion

    // #region Sales by Area Grid

    self.salesAreaGridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {};

        self.slicerGroup.slicerCollection.forEach(function (p) {
            if (typeof p.boundTo === 'function')
                if (p.boundTo().widget().value())
                    data[p.valueField] = p.boundTo().selectedId();
        });

        data.CurrencyID = self.slicerGroup.selectedCurrencyId();

        console.log('calling FetchSalesByArea with', data);

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        var setSterling = true;

        if (data.hasOwnProperty('SalesRepresentativeID')) {
            setSterling = false;
        }

        if (data.hasOwnProperty('SalesMarketID')) {
            setSterling = false;
        }

        if (data.hasOwnProperty('CurrencyID')) {
            setSterling = false;
        }

        if (setSterling) {
            if (!self.showingGBPColumns()) {
                self.slicerGroup.currencyDisplay('sterling');
                self.slicerGroup.currenctDisplay.valueHasMutated();
            }
        }

        $.ajax({
            url: '/api/SalesStatisticsAPI/FetchSalesByArea',
            type: "GET",
            data: data,
            success: function (data) {
                console.log('FetchSalesByArea returned', data);
                options.success(data);
            },
            error: function (data) {
                console.log(data);
                options.error();
            }
        });
    }

    self.salesAreaGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.salesAreaGridDataSourceRead
        },
        requestStart: function (e) {
            self.salesAreaGridBusy(true);
        },
        pageSize: 50,
        serverAggregates: true,
        serverPaging: true,
        serverSorting: true,
        serverFiltering: false,
        sort: [{
            field: 'TY_FinancialYearToDate',
            dir: 'desc'
        }, {
            field: 'TY_FinancialYearToDateCurr',
            dir: 'desc'
        }],
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            // do NOT provide the aggregates object here,
            // it is defined in kendo.data.schemas.webapi and 
            // that's where the appropriate conversion functions are found!
            model: {
                id: 'TradeAccountID',
                fields: {
                    TradeAccountID: { type: 'Number' }
                }
            }
        }),
        aggregate: [{
            field: 'AccountCount',
            aggregate: 'sum'
        }, {
            field: 'TY_FinancialYearToDateCurr',
            aggregate: 'sum'
        }, {
            field: 'LY_FinancialYearToDateCurr',
            aggregate: 'sum'
        }, {
            field: 'TY_CalendarYearToDateCurr',
            aggregate: 'sum'
        }, {
            field: 'LY_CalendarYearToDateCurr',
            aggregate: 'sum'
        }, {
            field: 'TY_MonthToDateCurr',
            aggregate: 'sum'
        }, {
            field: 'LY_MonthToDateCurr',
            aggregate: 'sum'
        }, {
            field: 'TY_FinancialYearToDate',
            aggregate: 'sum'
        }, {
            field: 'LY_FinancialYearToDate',
            aggregate: 'sum'
        }, {
            field: 'TY_CalendarYearToDate',
            aggregate: 'sum'
        }, {
            field: 'LY_CalendarYearToDate',
            aggregate: 'sum'
        }, {
            field: 'TY_MonthToDate',
            aggregate: 'sum'
        }, {
            field: 'LY_MonthToDate',
            aggregate: 'sum'
        }]
    });
    
    self.salesAreaGridSettings = {
        autoBind: false,
        widget: self.salesByAreaWidget,
        data: self.salesAreaGridDataSource,
        scrollable: true,
        //height: 724,
        //width: 1050,
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
            width: 60
        },
        {
            field: '',
            title: '',
            columns: [{
                field: '',
                title: '',
                columns: [{
                    field: 'SalesAreaCode',
                    title: 'Area',
                    encoded: false,
                    template: '<span title="#: SalesAreaCode # - #: SalesAreaName #">#: SalesAreaCode #<br/><span class="bold">#: SalesAreaName #</span></span>',
                    attributes: {
                        'class': 'text-left nowrap left-border'
                    },
                    headerAttributes: {
                        'class': 'fourth-heading'
                    },
                    footerAttributes: {
                        'class': 'right-border'
                    },
                    width: 180
                }],
                width: 180
            }],
            width: 180
        }, {
            field: '',
            title: '',
            columns: [{
                field: '',
                title: '',
                columns: [{
                    field: 'AccountCount',
                    title: 'Accounts',
                    headerAttributes: {
                        'class': 'fourth-heading'
                    },
                    attributes: {
                        'class': 'text-right left-border'
                    },
                    template: '#:formatNumber(AccountCount)#',
                    footerTemplate: '#: data.AccountCount ? formatNumber(data.AccountCount.sum) : "" #',
                    footerAttributes: {
                        'class': 'text-right right-border'
                    },
                    width: 70
                }],
                width: 70
            }],
            width: 70
        }, {
            field: 'currency',
            title: 'Sales in Currency',
            //hidden: true,
            headerAttributes: {
                'class': 'first-heading'
            },
            //width: 750,
            columns: [{
                field: '',
                title: 'Financial',
                headerAttributes: {
                    'class': 'second-heading'
                },
                //width: 250,
                columns: [{
                    field: 'TY_FinancialYearToDateCurr',
                    title: 'YTD',
                    template: function (rec) { 
                        if (rec.TY_FinancialYearToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_FinancialYearToDateCurr);
                        else 
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_FinancialYearToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    footerTemplate: function (data) {
                        var value = data.TY_FinancialYearToDateCurr ? data.TY_FinancialYearToDateCurr.sum : 0;
                        var formatted = formatSelectedCurrency(value);

                        if (value >= 0)
                            return '<span title="' + formatted + '">' + formatted + '</span>';
                        else
                            return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
                    },
                    footerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 100
                }, {
                    field: 'LY_FinancialYearToDateCurr',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_FinancialYearToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_FinancialYearToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_FinancialYearToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    footerTemplate: function (data) {
                        var value = data.LY_FinancialYearToDateCurr ? data.LY_FinancialYearToDateCurr.sum : 0;
                        var formatted = formatSelectedCurrency(value);
                        if (value >= 0)
                            return '<span title="' + formatted + '">' + formatted + '</span>';
                        else
                            return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
                    },
                    footerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 100
                }, {
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
                        var thisYear = data.TY_FinancialYearToDateCurr ? data.TY_FinancialYearToDateCurr.sum : 0;
                        var lastYear = data.LY_FinancialYearToDateCurr ? data.LY_FinancialYearToDateCurr.sum : 0;
                        var growth = (thisYear - lastYear) / (lastYear ? Math.abs(lastYear) : 1);
                        if (growth >= 0)
                            return formatPercentage(growth);
                        else
                            return '<span class="text-danger">' + formatPercentage(growth) + '</span>';
                    },
                    footerAttributes: {
                        'class': 'third-heading text-right right-border'
                    },
                    //width: 50
                }]
            }, {
                field: '',
                title: 'Calendar',
                headerAttributes: {
                    'class': 'second-heading'
                },
                //width: 250,
                columns: [{
                    field: 'TY_CalendarYearToDateCurr',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_CalendarYearToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_CalendarYearToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_CalendarYearToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    footerTemplate: function (data) {
                        var value = data.TY_CalendarYearToDateCurr ? data.TY_CalendarYearToDateCurr.sum : 0;
                        var formatted = formatSelectedCurrency(value);
                        if (value >= 0)
                            return '<span title="' + formatted + '">' + formatted + '</span>';
                        else
                            return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
                    },
                    footerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 100
                }, {
                    field: 'LY_CalendarYearToDateCurr',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_CalendarYearToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_CalendarYearToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_CalendarYearToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    footerTemplate: function (data) {
                        var value = data.LY_CalendarYearToDateCurr ? data.LY_CalendarYearToDateCurr.sum : 0;
                        var formatted = formatSelectedCurrency(value);
                        if (value >= 0)
                            return '<span title="' + formatted + '">' + formatted + '</span>';
                        else
                            return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
                    },
                    footerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 100
                }, {
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
                        var thisYear = data.TY_CalendarYearToDateCurr ? data.TY_CalendarYearToDateCurr.sum : 0;
                        var lastYear = data.LY_CalendarYearToDateCurr ? data.LY_CalendarYearToDateCurr.sum : 0;
                        var growth = (thisYear - lastYear) / (lastYear ? Math.abs(lastYear) : 1);
                        if (growth >= 0)
                            return formatPercentage(growth);
                        else
                            return '<span class="text-danger">' + formatPercentage(growth) + '</span>';
                    },
                    footerAttributes: {
                        'class': 'third-heading text-right right-border'
                    },
                    //width: 50
                }]
            }, {
                field: '',
                title: 'Month',
                headerAttributes: {
                    'class': 'second-heading'
                },
                //width: 250,
                columns: [{
                    field: 'TY_MonthToDateCurr',
                    title: 'MTD',
                    template: function (rec) {
                        if (rec.TY_MonthToDateCurr >= 0)
                            return formatSelectedCurrency(rec.TY_MonthToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.TY_MonthToDateCurr) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    footerTemplate: function (data) {
                        var value = data.TY_MonthToDateCurr ? data.TY_MonthToDateCurr.sum : 0;
                        var formatted = formatSelectedCurrency(value);
                        if (value >= 0)
                            return '<span title="' + formatted + '">' + formatted + '</span>';
                        else
                            return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
                    },
                    footerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 100
                }, {
                    field: 'LY_MonthToDateCurr',
                    title: 'LMTD',
                    template: function (rec) {
                        if (rec.LY_MonthToDateCurr >= 0)
                            return formatSelectedCurrency(rec.LY_MonthToDateCurr);
                        else
                            return '<span class="text-danger">' + formatSelectedCurrency(rec.LY_MonthToDateCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    footerTemplate: function (data) {
                        var value = data.LY_MonthToDateCurr ? data.LY_MonthToDateCurr.sum : 0;
                        var formatted = formatSelectedCurrency(value);
                        if (value >= 0)
                            return '<span title="' + formatted + '">' + formatted + '</span>';
                        else
                            return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
                    },
                    footerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 100
                }, {
                    field: 'MonthToDateGrowthCurr',
                    title: 'GRTH',
                    template: function (rec) {
                        if (rec.MonthToDateGrowthCurr >= 0)
                            return formatPercentage(rec.MonthToDateGrowthCurr);
                        else
                            return '<span class="text-danger">' + formatPercentage(rec.MonthToDateGrowthCurr) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    footerTemplate: function (data) {
                        var thisYear = data.TY_MonthToDateCurr ? data.TY_MonthToDateCurr.sum : 0;
                        var lastYear = data.LY_MonthToDateCurr ? data.LY_MonthToDateCurr.sum : 0;
                        var growth = (thisYear - lastYear) / (lastYear ? Math.abs(lastYear) : 1);
                        if (growth >= 0)
                            return formatPercentage(growth);
                        else
                            return '<span class="text-danger">' + formatPercentage(growth) + '</span>';
                    },
                    footerAttributes: {
                        'class': 'third-heading text-right right-border'
                    },
                    //width: 50
                }]
            }]
        }, {
            field: 'sterling',
            title: 'Sales in Sterling',
            //hidden: false,
            headerAttributes: {
                'class': 'first-heading'
            },
            //width: 750,
            columns: [{
                field: '',
                title: 'Financial',
                headerAttributes: {
                    'class': 'second-heading'
                },
                //width: 250,
                columns: [{
                    field: 'TY_FinancialYearToDate',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_FinancialYearToDate >= 0)
                            return formatGBP(rec.TY_FinancialYearToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_FinancialYearToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    footerTemplate: function (data) {
                        var value = data.TY_FinancialYearToDate ? data.TY_FinancialYearToDate.sum : 0;
                        var formatted = formatGBP(value);
                        if (value >= 0)
                            return '<span title="' + formatted + '">' + formatted + '</span>';
                        else
                            return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
                    },
                    footerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 100
                }, {
                    field: 'LY_FinancialYearToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_FinancialYearToDate >= 0)
                            return formatGBP(rec.LY_FinancialYearToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_FinancialYearToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    footerTemplate: function (data) {
                        var value = data.LY_FinancialYearToDate ? data.LY_FinancialYearToDate.sum : 0;
                        var formatted = formatGBP(value);
                        if (value >= 0)
                            return '<span title="' + formatted + '">' + formatted + '</span>';
                        else
                            return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
                    },
                    footerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 100
                }, {
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
                        var thisYear = data.TY_FinancialYearToDate ? data.TY_FinancialYearToDate.sum : 0;
                        var lastYear = data.LY_FinancialYearToDate ? data.LY_FinancialYearToDate.sum : 0;
                        var growth = (thisYear - lastYear) / (lastYear ? Math.abs(lastYear) : 1);
                        if (growth >= 0)
                            return formatPercentage(growth);
                        else
                            return '<span class="text-danger">' + formatPercentage(growth) + '</span>';
                    },
                    footerAttributes: {
                        'class': 'third-heading text-right right-border'
                    },
                    //width: 50
                }]
            }, {
                field: '',
                title: 'Calendar',
                headerAttributes: {
                    'class': 'second-heading'
                },
                //width: 250,
                columns: [{
                    field: 'TY_CalendarYearToDate',
                    title: 'YTD',
                    template: function (rec) {
                        if (rec.TY_CalendarYearToDate >= 0)
                            return formatGBP(rec.TY_CalendarYearToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_CalendarYearToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    footerTemplate: function (data) {
                        var value = data.TY_CalendarYearToDate ? data.TY_CalendarYearToDate.sum : 0;
                        var formatted = formatGBP(value);
                        if (value >= 0)
                            return '<span title="' + formatted + '">' + formatted + '</span>';
                        else
                            return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
                    },
                    footerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 100
                }, {
                    field: 'LY_CalendarYearToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        if (rec.LY_CalendarYearToDate >= 0)
                            return formatGBP(rec.LY_CalendarYearToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_CalendarYearToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    footerTemplate: function (data) {
                        var value = data.LY_CalendarYearToDate ? data.LY_CalendarYearToDate.sum : 0;
                        var formatted = formatGBP(value);
                        if (value >= 0)
                            return '<span title="' + formatted + '">' + formatted + '</span>';
                        else
                            return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
                    },
                    footerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 100
                }, {
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
                        var thisYear = data.TY_CalendarYearToDate ? data.TY_CalendarYearToDate.sum : 0;
                        var lastYear = data.LY_CalendarYearToDate ? data.LY_CalendarYearToDate.sum : 0;
                        var growth = (thisYear - lastYear) / (lastYear ? Math.abs(lastYear) : 1);
                        if (growth >= 0)
                            return formatPercentage(growth);
                        else
                            return '<span class="text-danger">' + formatPercentage(growth) + '</span>';
                    },
                    footerAttributes: {
                        'class': 'third-heading text-right right-border'
                    },
                    //width: 50
                }]
            }, {
                field: '',
                title: 'Month',
                headerAttributes: {
                    'class': 'second-heading'
                },
                //width: 250,
                columns: [{
                    field: 'TY_MonthToDate',
                    title: 'MTD',
                    template: function (rec) {
                        if (rec.TY_MonthToDate >= 0)
                            return formatGBP(rec.TY_MonthToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.TY_MonthToDate) + '</span>';
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    footerTemplate: function (data) {
                        var value = data.TY_MonthToDate ? data.TY_MonthToDate.sum : 0;
                        var formatted = formatGBP(value);
                        if (value >= 0)
                            return '<span title="' + formatted + '">' + formatted + '</span>';
                        else
                            return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
                    },
                    footerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 100
                }, {
                    field: 'LY_MonthToDate',
                    title: 'LMTD',
                    template: function (rec) {
                        if (rec.LY_MonthToDate >= 0)
                            return formatGBP(rec.LY_MonthToDate);
                        else
                            return '<span class="text-danger">' + formatGBP(rec.LY_MonthToDate) + '</span>';
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    footerTemplate: function (data) {
                        var value = data.LY_MonthToDate ? data.LY_MonthToDate.sum : 0;
                        var formatted = formatGBP(value);
                        if (value >= 0)
                            return '<span title="' + formatted + '">' + formatted + '</span>';
                        else
                            return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
                    },
                    footerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 100
                }, {
                    field: 'MonthToDateGrowth',
                    title: 'GRTH',
                    template: function (rec) {
                        if (rec.MonthToDateGrowth >= 0)
                            return formatPercentage(rec.MonthToDateGrowth);
                        else
                            return '<span class="text-danger">' + formatPercentage(rec.MonthToDateGrowth) + '</span>';
                    },
                    attributes: {
                        'class': 'right-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right right-border'
                    },
                    footerTemplate: function (data) {
                        var thisYear = data.TY_MonthToDate ? data.TY_MonthToDate.sum : 0;
                        var lastYear = data.LY_MonthToDate ? data.LY_MonthToDate.sum : 0;
                        var growth = (thisYear - lastYear) / (lastYear ? Math.abs(lastYear) : 1);
                        if (growth >= 0)
                            return formatPercentage(growth);
                        else
                            return '<span class="text-danger">' + formatPercentage(growth) + '</span>';
                    },
                    footerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    //width: 50
                }]
            }]
        }],
        sortable: true,
        filterable: false,
        grouping: false,
        serverGrouping: false,
        pageable: {
            pageSize: 50,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        dataBound: function (e) {
            console.log('salesAreaGrid dataBound');
            self.salesAreaBound(true);
            //self.setGridWidth(e);
            var rows = this.items();
            var pageSize = self.salesByAreaWidget().dataSource.pageSize();
            if (pageSize == null)
                pageSize = 1;
            var page = self.salesByAreaWidget().dataSource.page();

            $(rows).each(function () {
                var index = $(this).index() + 1
                + (pageSize * (page - 1));
                var rowLabel = $(this).find(".ranking");
                $(rowLabel).html(index);
            });

            var sorting = self.salesByAreaWidget().dataSource.sort();

            $('#sales-area-collapse th').removeClass('sorting-desc').removeClass('sorting-asc').removeClass('sorting-desc');
            
            for (var i in sorting) {
                var p = sorting[i];
                if (p.dir == 'asc') {
                    $('#sales-area-collapse th[data-field="' + p.field + '"]').addClass('sorting-asc');
                } else {
                    $('#sales-area-collapse th[data-field="' + p.field + '"]').addClass('sorting-desc');
                }
            }

            window.setTimeout(function () {

                if (self.slicerGroup.currencyDisplay()) {
                    self.salesByAreaWidget().hideColumn('sterling');
                    self.salesByAreaWidget().hideColumn('currency');
                    self.salesByAreaWidget().showColumn('currency');
                } else {
                    self.salesByAreaWidget().hideColumn('currency');
                    self.salesByAreaWidget().hideColumn('sterling');
                    self.salesByAreaWidget().showColumn('sterling');
                }

                self.salesAreaGridBusy(false);
            }, 100)
        }
    }

    // #endregion

    // #region Sales by Customer Grid

    self.getCustomersGridRecord = function (uid) {
        return Enumerable.From(self.salesByCustomerWidget().dataSource.view()).Where("$.uid == '" + uid + "'").Single();
    }

    self.moment = moment();

    self.salesByCustomerLast12MonthsGBP = [];

    self.salesByCustomerLast12MonthsCurr = [];

    var last12Months = [
        { valueField: 'M1Value', growthField: 'M1Growth' },
        { valueField: 'M2Value', growthField: 'M2Growth' },
        { valueField: 'M3Value', growthField: 'M3Growth' },
        { valueField: 'M4Value', growthField: 'M4Growth' },
        { valueField: 'M5Value', growthField: 'M5Growth' },
        { valueField: 'M6Value', growthField: 'M6Growth' },
        { valueField: 'M7Value', growthField: 'M7Growth' },
        { valueField: 'M8Value', growthField: 'M8Growth' },
        { valueField: 'M9Value', growthField: 'M9Growth' },
        { valueField: 'M10Value', growthField: 'M10Growth' },
        { valueField: 'M11Value', growthField: 'M11Growth' },
        { valueField: 'M12Value', growthField: 'M12Growth' }
    ]

    $.each(last12Months, function (idx, item) {
        self.salesByCustomerLast12MonthsGBP.push({
            field: item.valueField,
            title: '',
            headerAttributes: {
                'class': 'third-heading text-right left-border'
            },
            headerTemplate: function (rec) {
                return self.salesByCustomerLast12MonthsHeaderTemplate(rec, idx + 1);
            },
            attributes: {
                'class': 'left-border'
            },
            template: function (rec) {
                return self.salesByCustomerLast12MonthsTemplate(rec, item);
            },
            footerTemplate: function (data) {
                return self.salesByCustomerLast12MonthsFooterTemplate(data, item);
            },
            width: 100
        })
    });

    $.each(last12Months, function (idx, item) {

        item.valueField += 'Curr';
        item.growthField += 'Curr';

        self.salesByCustomerLast12MonthsCurr.push({
            field: item.valueField,
            title: '',
            headerAttributes: {
                'class': 'third-heading text-right left-border'
            },
            headerTemplate: function (rec) {
                return self.salesByCustomerLast12MonthsHeaderTemplate(rec, idx + 1);
            },
            attributes: {
                'class': 'left-border'
            },
            template: function (rec) {
                return self.salesByCustomerLast12MonthsTemplateCurr(rec, item);
            },
            footerTemplate: function (data) {
                return self.salesByCustomerLast12MonthsFooterTemplateCurr(data, item);
            },
            width: 100
        })
    });

    self.salesByCustomerLast12MonthsHeaderTemplate = function (rec, idx) {
        return moment().subtract(idx, "month").format("MMM YY");
    }

    self.salesByCustomerLast12MonthsTemplate = function (rec, item) {
        var value = '';
        if (rec[item.valueField] >= 0)
            value = formatGBP(rec[item.valueField])
        else
            value = '<span class="text-danger">' + formatGBP(rec[item.valueField]) + '</span>';
        value += '<br/>';
        var growth = '';
        if (rec[item.growthField] >= 0)
            growth = formatPercentage(rec[item.growthField])
        else
            growth = '<span class="text-danger">' + formatPercentage(rec[item.growthField]) + '</span>';
        return value + growth;
    }

    self.salesByCustomerLast12MonthsFooterTemplate = function (data, item) {
        var value = data[item.valueField] ? data[item.valueField].sum : 0;
        var formatted = formatGBP(value);
        if (value >= 0)
            return '<span title="' + formatted + '">' + formatted + '</span>';
        else
            return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
    }

    self.salesByCustomerLast12MonthsTemplateCurr = function (rec, item) {
        var value = '';
        if (rec[item.valueField] >= 0)
            value = formatSelectedCurrency(rec[item.valueField])
        else
            value = '<span class="text-danger">' + formatSelectedCurrency(rec[item.valueField]) + '</span>';
        value += '<br/>';
        var growth = '';
        if (rec[item.growthField] >= 0)
            growth = formatPercentage(rec[item.growthField])
        else
            growth = '<span class="text-danger">' + formatPercentage(rec[item.growthField]) + '</span>';
        return value + growth;
    }

    self.salesByCustomerLast12MonthsFooterTemplateCurr = function (data, item) {
        var value = data[item.valueField] ? data[item.valueField].sum : 0;
        var formatted = formatSelectedCurrency(value);
        if (value >= 0)
            return '<span title="' + formatted + '">' + formatted + '</span>';
        else
            return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
    }

    self.salesCustomerGridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {};

        self.slicerGroup.slicerCollection.forEach(function (p) {
            if (typeof p.boundTo === 'function')
                if (p.boundTo().widget().value())
                    data[p.valueField] = p.boundTo().selectedId();
        });

        if (params.widget) {
            data.Widget = params.widget;
        }

        data.CurrencyID = self.slicerGroup.selectedCurrencyId();

        console.log('calling FetchSalesByCustomer with', data);

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        var setSterling = true;

        if (data.hasOwnProperty('SalesRepresentativeID')) {
            setSterling = false;
        }

        if (data.hasOwnProperty('SalesMarketID')) {
            setSterling = false;
        }

        if (data.hasOwnProperty('CurrencyID')) {
            setSterling = false;
        }

        if (setSterling) {
            if (!self.showingGBPColumns()) {
                self.slicerGroup.currencyDisplay('sterling');
                self.slicerGroup.currenctDisplay.valueHasMutated();
            }
        }

        $.ajax({
            url: '/api/SalesStatisticsAPI/FetchSalesByCustomer',
            type: "GET",
            data: data,
            success: function (data) {
                console.log('FetchSalesByCustomer returned', data);
                options.success(data); // for some reason this call is performing a second read!!! ARGH
            },
            error: function (data) {
                console.log(data);
                options.error();
            }
        });
    }
    
    self.salesByCustomerWidgetAggregates = function () {
        return [{
            field: 'TY_FinancialYearToDate',
            aggregate: 'sum'
        }, {
            field: 'TY_FinancialYearToDateGrowth',
            aggregate: 'sum'
        }, {
            field: 'LY_FinancialYearToDate',
            aggregate: 'sum'
        }, {
            field: 'LY_FinancialYearToDateGrowth',
            aggregate: 'sum'
        }, {
            field: 'TY_CalendarYearToDate',
            aggregate: 'sum'
        }, {
            field: 'TY_CalendarYearToDateGrowth',
            aggregate: 'sum'
        }, {
            field: 'LY_CalendarYearToDate',
            aggregate: 'sum'
        }, {
            field: 'LY_CalendarYearToDateGrowth',
            aggregate: 'sum'
        }, {
            field: 'M0Value',
            aggregate: 'sum'
        }, {
            field: 'M0Growth',
            aggregate: 'sum'
        }, {
            field: 'M1Value',
            aggregate: 'sum'
        }, {
            field: 'M1Growth',
            aggregate: 'sum'
        }, {
            field: 'M2Value',
            aggregate: 'sum'
        }, {
            field: 'M2Growth',
            aggregate: 'sum'
        }, {
            field: 'M3Value',
            aggregate: 'sum'
        }, {
            field: 'M3Growth',
            aggregate: 'sum'
        }, {
            field: 'M4Value',
            aggregate: 'sum'
        }, {
            field: 'M4Growth',
            aggregate: 'sum'
        }, {
            field: 'M5Value',
            aggregate: 'sum'
        }, {
            field: 'M5Growth',
            aggregate: 'sum'
        }, {
            field: 'M6Value',
            aggregate: 'sum'
        }, {
            field: 'M6Growth',
            aggregate: 'sum'
        }, {
            field: 'M7Value',
            aggregate: 'sum'
        }, {
            field: 'M7Growth',
            aggregate: 'sum'
        }, {
            field: 'M8Value',
            aggregate: 'sum'
        }, {
            field: 'M8Growth',
            aggregate: 'sum'
        }, {
            field: 'M9Value',
            aggregate: 'sum'
        }, {
            field: 'M9Growth',
            aggregate: 'sum'
        }, {
            field: 'M10Value',
            aggregate: 'sum'
        }, {
            field: 'M10Growth',
            aggregate: 'sum'
        }, {
            field: 'M11Value',
            aggregate: 'sum'
        }, {
            field: 'M11Growth',
            aggregate: 'sum'
        }, {
            field: 'M12Value',
            aggregate: 'sum'
        }, {
            field: 'M12Growth',
            aggregate: 'sum'
        },

        // Curr

        {
            field: 'TY_FinancialYearToDateCurr',
            aggregate: 'sum'
        }, {
            field: 'TY_FinancialYearToDateGrowthCurr',
            aggregate: 'sum'
        }, {
            field: 'LY_FinancialYearToDateCurr',
            aggregate: 'sum'
        }, {
            field: 'LY_FinancialYearToDateGrowthCurr',
            aggregate: 'sum'
        }, {
            field: 'TY_CalendarYearToDateCurr',
            aggregate: 'sum'
        }, {
            field: 'TY_CalendarYearToDateGrowthCurr',
            aggregate: 'sum'
        }, {
            field: 'LY_CalendarYearToDateCurr',
            aggregate: 'sum'
        }, {
            field: 'LY_CalendarYearToDateGrowthCurr',
            aggregate: 'sum'
        }, {
            field: 'M0ValueCurr',
            aggregate: 'sum'
        }, {
            field: 'M0GrowthCurr',
            aggregate: 'sum'
        }, {
            field: 'M1ValueCurr',
            aggregate: 'sum'
        }, {
            field: 'M1GrowthCurr',
            aggregate: 'sum'
        }, {
            field: 'M2ValueCurr',
            aggregate: 'sum'
        }, {
            field: 'M2GrowthCurr',
            aggregate: 'sum'
        }, {
            field: 'M3ValueCurr',
            aggregate: 'sum'
        }, {
            field: 'M3GrowthCurr',
            aggregate: 'sum'
        }, {
            field: 'M4ValueCurr',
            aggregate: 'sum'
        }, {
            field: 'M4GrowthCurr',
            aggregate: 'sum'
        }, {
            field: 'M5ValueCurr',
            aggregate: 'sum'
        }, {
            field: 'M5GrowthCurr',
            aggregate: 'sum'
        }, {
            field: 'M6ValueCurr',
            aggregate: 'sum'
        }, {
            field: 'M6GrowthCurr',
            aggregate: 'sum'
        }, {
            field: 'M7ValueCurr',
            aggregate: 'sum'
        }, {
            field: 'M7GrowthCurr',
            aggregate: 'sum'
        }, {
            field: 'M8ValueCurr',
            aggregate: 'sum'
        }, {
            field: 'M8GrowthCurr',
            aggregate: 'sum'
        }, {
            field: 'M9ValueCurr',
            aggregate: 'sum'
        }, {
            field: 'M9GrowthCurr',
            aggregate: 'sum'
        }, {
            field: 'M10ValueCurr',
            aggregate: 'sum'
        }, {
            field: 'M10GrowthCurr',
            aggregate: 'sum'
        }, {
            field: 'M11ValueCurr',
            aggregate: 'sum'
        }, {
            field: 'M11GrowthCurr',
            aggregate: 'sum'
        }, {
            field: 'M12ValueCurr',
            aggregate: 'sum'
        }, {
            field: 'M12GrowthCurr',
            aggregate: 'sum'
        }];
    }

    self.salesCustomerGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.salesCustomerGridDataSourceRead
        },
        requestStart: function (e) {
            self.salesCustomerGridBusy(true);
        },
        pageSize: 50,
        serverAggregates: true,
        serverPaging: true,
        serverSorting: true,
        serverFiltering: false,
        sort: [{
            field: 'TY_FinancialYearToDate',
            dir: 'desc'
        }, {
            field: 'TY_FinancialYearToDateCurr',
            dir: 'desc'
        }],
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            model: {
                id: 'TradeAccountID',
                fields: {
                    TradeAccountID: { type: 'Number' },
                    PeriodTotalValue: { type: 'Number' }
                }
            }
        }),
        aggregate: self.salesByCustomerWidgetAggregates()
    });

    self.salesCustomerGridSettings = {
        autoBind: false,
        widget: self.salesByCustomerWidget,
        data: self.salesCustomerGridDataSource,
        //dataSource: {
        //    pageSize: 50
        //},
        scrollable: true,
        //{
        //    endless: true
        //},
        //height: 724,
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
            width: 60
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
                    title: 'MKT',
                    headerAttributes: {
                        "class": "third-heading left-border"
                    },
                    attributes: {
                        'class': 'text-left left-border'
                    },
                    width: 50
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
                    field: 'SalesAreaCode',
                    title: 'Area',
                    encoded: false,
                    template: '<span title="#: SalesAreaCode # - #: SalesAreaName #">#: SalesAreaCode #<br/><span class="bold">#: SalesAreaName #</span></span>',
                    headerAttributes: {
                        "class": "third-heading left-border"
                    },
                    attributes: {
                        'class': 'text-left nowrap'
                    },
                    width: 160
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
                    template: '<span title="#: Code # - #: Name #">#: Code #<br/><span class="bold">#: Name #</span></span>',
                    width: 220
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
                    field: 'Status',
                    title: ' ',
                    headerAttributes: {
                        "class": "third-heading"
                    },
                    attributes: {
                        'class': 'text-center'
                    },
                    template: self.statusColumnTemplate,
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
                    title: 'Contact',
                    headerAttributes: {
                        "class": "third-heading"
                    },
                    attributes: {
                        'class': 'text-center'
                    },
                    template: function (rec) {
                        return '<i class="contact-icon material-icons" onclick="viewModel.showContactModal(\'customer\', \''+rec.uid+'\')">contact_mail</i>'
                    },
                    width: 84
                }]
            }]
        }, {
            field: '',
            title: '',
            columns: [{
                field: '',
                title: '',
                columns: [{
                    attributes: {
                        'class': 'spacer-column left-border'
                    },
                    headerAttributes: {
                        'class': 'spacer-column left-border'
                    },
                    template: '&nbsp;',
                    width: 10,
                    footerAttributes: {
                        'class': 'right-border'
                    }
                }]
            }]
        }, {
            field: 'currency',
            //hidden: true,
            title: 'Currency',
            headerAttributes: {
                'class': 'first-heading text-left',
                'style': 'padding-left: 118px;'
            },
            columns: [{
                field: '',
                title: 'Financial',
                headerAttributes: {
                    'class': 'second-heading'
                },
                columns: [{
                    field: 'TY_FinancialYearToDateCurr',
                    title: 'YTD',
                    template: function (rec) {
                        var value = '';
                        if (rec.TY_FinancialYearToDateCurr >= 0)
                            value = formatSelectedCurrency(rec.TY_FinancialYearToDateCurr)
                        else
                            value = '<span class="text-danger">' + formatSelectedCurrency(rec.TY_FinancialYearToDateCurr) + '</span>';
                        value += '<br/>';
                        var growth = '';
                        if (rec.TY_FinancialYearToDateGrowthCurr >= 0)
                            growth = formatPercentage(rec.TY_FinancialYearToDateGrowthCurr)
                        else
                            growth = '<span class="text-danger">' + formatPercentage(rec.TY_FinancialYearToDateGrowthCurr) + '</span>';
                        return value + growth;
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    footerTemplate: function (data) {
                        var value = data.TY_FinancialYearToDateCurr ? data.TY_FinancialYearToDateCurr.sum : 0;
                        var formatted = formatSelectedCurrency(value);
                        if (value >= 0)
                            return '<span title="' + formatted + '">' + formatted + '</span>';
                        else
                            return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
                    },
                    width: 100
                }, {
                    field: 'LY_FinancialYearToDateCurr',
                    title: 'LYTD',
                    template: function (rec) {
                        var value = '';
                        if (rec.LY_FinancialYearToDateCurr >= 0)
                            value = formatSelectedCurrency(rec.LY_FinancialYearToDateCurr)
                        else
                            value = '<span class="text-danger">' + formatSelectedCurrency(rec.LY_FinancialYearToDateCurr) + '</span>';
                        value += '<br/>';
                        var growth = '';
                        if (rec.LY_FinancialYearToDateGrowthCurr >= 0)
                            growth = formatPercentage(rec.LY_FinancialYearToDateGrowthCurr)
                        else
                            growth = '<span class="text-danger">' + formatPercentage(rec.LY_FinancialYearToDateGrowthCurr) + '</span>';
                        return value + growth;
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    footerTemplate: function (data) { 
                        var value = data.LY_FinancialYearToDateCurr ? data.LY_FinancialYearToDateCurr.sum : 0;
                        var formatted = formatSelectedCurrency(value);
                        if (value >= 0)
                            return '<span title="' + formatted + '">' + formatted + '</span>';
                        else
                            return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
                    },
                    width: 100
                }]
            }, {
                field: '',
                title: '',
                columns: [{
                    attributes: {
                        'class': 'spacer-column left-border'
                    },
                    headerAttributes: {
                        'class': 'spacer-column left-border'
                    },
                    template: '&nbsp;',
                    width: 10,
                    footerAttributes: {
                        'class': 'right-border'
                    }
                }]
            }, {
                field: '',
                title: 'Calendar',
                headerAttributes: {
                    'class': 'second-heading'
                },
                columns: [{
                    field: 'TY_CalendarYearToDate',
                    title: 'YTD',
                    template: function (rec) {
                        var value = '';
                        if (rec.TY_CalendarYearToDate >= 0)
                            value = formatSelectedCurrency(rec.TY_CalendarYearToDate)
                        else
                            value = '<span class="text-danger">' + formatSelectedCurrency(rec.TY_CalendarYearToDate) + '</span>';
                        value += '<br/>';
                        var growth = '';
                        if (rec.TY_CalendarYearToDateGrowth >= 0)
                            growth = formatPercentage(rec.TY_CalendarYearToDateGrowth)
                        else
                            growth = '<span class="text-danger">' + formatPercentage(rec.TY_CalendarYearToDateGrowth) + '</span>';
                        return value + growth;
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    footerTemplate: function (data) {
                        var value = data.TY_CalendarYearToDate ? data.TY_CalendarYearToDate.sum : 0;
                        var formatted = formatSelectedCurrency(value);
                        if (value >= 0)
                            return '<span title="' + formatted + '">' + formatted + '</span>';
                        else
                            return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
                    },
                    width: 100
                }, {
                    field: 'LY_CalendarYearToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        var value = '';
                        if (rec.LY_CalendarYearToDate >= 0)
                            value = formatSelectedCurrency(rec.LY_CalendarYearToDate)
                        else
                            value = '<span class="text-danger">' + formatSelectedCurrency(rec.LY_CalendarYearToDate) + '</span>';
                        value += '<br/>';
                        var growth = '';
                        if (rec.LY_CalendarYearToDateGrowth >= 0)
                            growth = formatPercentage(rec.LY_CalendarYearToDateGrowth)
                        else
                            growth = '<span class="text-danger">' + formatPercentage(rec.LY_CalendarYearToDateGrowth) + '</span>';
                        return value + growth;
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    footerTemplate: function (data) {
                        var value = data.LY_CalendarYearToDate ? data.LY_CalendarYearToDate.sum : 0;
                        var formatted = formatSelectedCurrency(value);
                        if (value >= 0)
                            return '<span title="' + formatted + '">' + formatted + '</span>';
                        else
                            return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
                    },
                    width: 100
                }]
            }, {
                field: '',
                title: '',
                columns: [{
                    attributes: {
                        'class': 'spacer-column left-border'
                    },
                    headerAttributes: {
                        'class': 'spacer-column left-border'
                    },
                    template: '&nbsp;',
                    width: 10,
                    footerAttributes: {
                        'class': 'right-border'
                    }
                }]
            }, {
                field: '',
                title: 'This Month',
                headerAttributes: {
                    'class': 'second-heading'
                },
                columns: [{
                    field: '',
                    field: '',
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    headerTemplate: function (rec) {
                        return self.moment.format("MMM YY");
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    template: function (rec) {
                        var value = '';
                        if (rec.M0Value >= 0)
                            value = formatSelectedCurrency(rec.M0ValueCurr)
                        else
                            value = '<span class="text-danger">' + formatSelectedCurrency(rec.M0ValueCurr) + '</span>';
                        value += '<br/>';
                        var growth = '';
                        if (rec.M0Growth >= 0)
                            growth = formatPercentage(rec.M0GrowthCurr)
                        else
                            growth = '<span class="text-danger">' + formatPercentage(rec.M0GrowthCurr) + '</span>';
                        return value + growth;
                    },
                    footerTemplate: function (data) {
                        var value = data.M0Value ? data.M0Value.sum : 0;
                        var formatted = formatSelectedCurrency(value);
                        if (value >= 0)
                            return '<span title="' + formatted + '">' + formatted + '</span>';
                        else
                            return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
                    },
                    width: 100
                }]
            }, {
                field: '',
                title: '',
                columns: [{
                    attributes: {
                        'class': 'spacer-column left-border'
                    },
                    headerAttributes: {
                        'class': 'spacer-column left-border'
                    },
                    template: '&nbsp;',
                    width: 10,
                    footerAttributes: {
                        'class': 'right-border'
                    }
                }]
            }, {
                field: '',
                title: 'Last 12 Months',
                headerAttributes: {
                    'class': 'second-heading'
                },
                columns: self.salesByCustomerLast12MonthsCurr
            }]
        }, {
            field: 'sterling',
            title: 'Sales in Sterling',
            headerAttributes: {
                'class': 'first-heading text-left',
                'style': 'padding-left: 94px;'
            },
            columns: [{
                field: '',
                title: 'Financial',
                headerAttributes: {
                    'class': 'second-heading'
                },
                columns: [{
                    field: 'TY_FinancialYearToDate',
                    title: 'YTD',
                    template: function (rec) {
                        var value = '';
                        if (rec.TY_FinancialYearToDate >= 0)
                            value = formatGBP(rec.TY_FinancialYearToDate)
                        else
                            value = '<span class="text-danger">' + formatGBP(rec.TY_FinancialYearToDate) + '</span>';
                        value += '<br/>';
                        var growth = '';
                        if (rec.TY_FinancialYearToDateGrowth >= 0)
                            growth = formatPercentage(rec.TY_FinancialYearToDateGrowth)
                        else
                            growth = '<span class="text-danger">' + formatPercentage(rec.TY_FinancialYearToDateGrowth) + '</span>';
                        return value + growth;
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    footerTemplate: function (data) { 
                        var value = data.TY_FinancialYearToDate ? data.TY_FinancialYearToDate.sum : 0;
                        var formatted = formatGBP(value);
                        if (value >= 0)
                            return '<span title="' + formatted + '">' + formatted + '</span>';
                        else
                            return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
                    },
                    width: 100
                }, {
                    field: 'LY_FinancialYearToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        var value = '';
                        if (rec.LY_FinancialYearToDate >= 0)
                            value = formatGBP(rec.LY_FinancialYearToDate)
                        else
                            value = '<span class="text-danger">' + formatGBP(rec.LY_FinancialYearToDate) + '</span>';
                        value += '<br/>';
                        var growth = '';
                        if (rec.LY_FinancialYearToDateGrowth >= 0)
                            growth = formatPercentage(rec.LY_FinancialYearToDateGrowth)
                        else
                            growth = '<span class="text-danger">' + formatPercentage(rec.LY_FinancialYearToDateGrowth) + '</span>';
                        return value + growth;
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    footerTemplate: function (data) {
                        var value = data.LY_FinancialYearToDate ? data.LY_FinancialYearToDate.sum : 0;
                        var formatted = formatGBP(value);
                        if (value >= 0)
                            return '<span title="' + formatted + '">' + formatted + '</span>';
                        else
                            return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
                    },
                    width: 100
                }]
            }, {
                field: '',
                title: '',
                columns: [{
                    attributes: {
                        'class': 'spacer-column left-border'
                    },
                    headerAttributes: {
                        'class': 'spacer-column left-border'
                    },
                    template: '&nbsp;',
                    width: 10,
                    footerAttributes: {
                        'class': 'right-border'
                    }
                }]
            }, {
                field: '',
                title: 'Calendar',
                headerAttributes: {
                    'class': 'second-heading'
                },
                columns: [{
                    field: 'TY_CalendarYearToDate',
                    title: 'YTD',
                    template: function (rec) {
                        var value = '';
                        if (rec.TY_CalendarYearToDate >= 0)
                            value = formatGBP(rec.TY_CalendarYearToDate)
                        else
                            value = '<span class="text-danger">' + formatGBP(rec.TY_CalendarYearToDate) + '</span>';
                        value += '<br/>';
                        var growth = '';
                        if (rec.TY_CalendarYearToDateGrowth >= 0)
                            growth = formatPercentage(rec.TY_CalendarYearToDateGrowth)
                        else
                            growth = '<span class="text-danger">' + formatPercentage(rec.TY_CalendarYearToDateGrowth) + '</span>';
                        return value + growth;
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    footerTemplate: function (data) {
                        var value = data.TY_CalendarYearToDate ? data.TY_CalendarYearToDate.sum : 0;
                        var formatted = formatGBP(value);
                        if (value >= 0)
                            return '<span title="' + formatted + '">' + formatted + '</span>';
                        else
                            return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
                    },
                    width: 100
                }, {
                    field: 'LY_CalendarYearToDate',
                    title: 'LYTD',
                    template: function (rec) {
                        var value = '';
                        if (rec.LY_CalendarYearToDate >= 0)
                            value = formatGBP(rec.LY_CalendarYearToDate)
                        else
                            value = '<span class="text-danger">' + formatGBP(rec.LY_CalendarYearToDate) + '</span>';
                        value += '<br/>';
                        var growth = '';
                        if (rec.LY_CalendarYearToDateGrowth >= 0)
                            growth = formatPercentage(rec.LY_CalendarYearToDateGrowth)
                        else
                            growth = '<span class="text-danger">' + formatPercentage(rec.LY_CalendarYearToDateGrowth) + '</span>';
                        return value + growth;
                    },
                    headerAttributes: {
                        'class': 'third-heading text-right'
                    },
                    footerTemplate: function (data) {
                        var value = data.LY_CalendarYearToDate ? data.LY_CalendarYearToDate.sum : 0;
                        var formatted = formatGBP(value);
                        if (value >= 0)
                            return '<span title="' + formatted + '">' + formatted + '</span>';
                        else
                            return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
                    },
                    width: 100
                }]
            }, {
                field: '',
                title: '',
                columns: [{
                    attributes: {
                        'class': 'spacer-column left-border'
                    },
                    headerAttributes: {
                        'class': 'spacer-column left-border'
                    },
                    template: '&nbsp;',
                    width: 10,
                    footerAttributes: {
                        'class': 'right-border'
                    }
                }]
            }, {
                field: '',
                title: 'This Month',
                headerAttributes: {
                    'class': 'second-heading'
                },
                columns: [{
                    field: '',
                    field: '',
                    headerAttributes: {
                        'class': 'third-heading text-right left-border'
                    },
                    headerTemplate: function (rec) {
                        return self.moment.format("MMM YY");
                    },
                    attributes: {
                        'class': 'left-border'
                    },
                    template: function (rec) {
                        var value = '';
                        if (rec.M0Value >= 0)
                            value = formatGBP(rec.M0Value)
                        else
                            value = '<span class="text-danger">' + formatGBP(rec.M0Value) + '</span>';
                        value += '<br/>';
                        var growth = '';
                        if (rec.M0Growth >= 0)
                            growth = formatPercentage(rec.M0Growth)
                        else
                            growth = '<span class="text-danger">' + formatPercentage(rec.M0Growth) + '</span>';
                        return value + growth;
                    },
                    footerTemplate: function (data) {
                        var value = data.M0Value ? data.M0Value.sum : 0;
                        var formatted = formatGBP(value);
                        if (value >= 0)
                            return '<span title="' + formatted + '">' + formatted + '</span>';
                        else
                            return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
                    },
                    width: 100
                }]
            }, {
                field: '',
                title: '',
                columns: [{
                    attributes: {
                        'class': 'spacer-column left-border'
                    },
                    headerAttributes: {
                        'class': 'spacer-column left-border'
                    },
                    template: '&nbsp;',
                    width: 10,
                    footerAttributes: {
                        'class': 'right-border'
                    }
                }]
            }, {
                field: '',
                title: 'Last 12 Months',
                headerAttributes: {
                    'class': 'second-heading'
                },
                columns: self.salesByCustomerLast12MonthsGBP
            }]
        }], /* .setMonth(.getMonth() - ) */
        sortable: false,
        filterable: false,
        grouping: false,
        serverGrouping: false,
        pageable: {
            pageSize: 50,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        dataBound: function (e) {
            console.log('customerGrid dataBound');
            self.customerGridBound(true);
            var rows = this.items();
            var pageSize = self.salesByCustomerWidget().dataSource.pageSize();
            if (pageSize == null)
                pageSize = 1;
            var page = self.salesByCustomerWidget().dataSource.page();

            $(rows).each(function () {
                var index = $(this).index() + 1
                + (pageSize * (page - 1));
                var rowLabel = $(this).find(".ranking");
                $(rowLabel).html(index);
            });

            var sorting = e.sender.dataSource.sort();

            $('#sales-customer-collapse th').removeClass('sorting-desc').removeClass('sorting-asc').removeClass('sorting-desc');

            for (var i in sorting) {
                var p = sorting[i];
                if (p.dir == 'asc') {
                    $('#sales-customer-collapse th[data-field="' + p.field + '"]').addClass('sorting-asc');
                } else {
                    $('#sales-customer-collapse th[data-field="' + p.field + '"]').addClass('sorting-desc');
                }
            }

            window.setTimeout(function () {

                if (self.slicerGroup.currencyDisplay()) {
                    self.salesByCustomerWidget().hideColumn('sterling');
                    self.salesByCustomerWidget().hideColumn('currency');
                    self.salesByCustomerWidget().showColumn('currency');
                } else {
                    self.salesByCustomerWidget().hideColumn('currency');
                    self.salesByCustomerWidget().hideColumn('sterling');
                    self.salesByCustomerWidget().showColumn('sterling');
                }

                self.salesCustomerGridBusy(false);
            }, 0)
        }
    }
    // #endregion

    // #region Customer Analysis Grid

    self.customerAnalysisWidget = ko.observable();

    self.customerAnalysisBusy = ko.observable(false);

    self.customerAnalysisRangeSelector = ko.observable();

    self.customerAnalysisRangeSelectorSettings = {
        elementId: 'customer-analysis-range',
        boundTo: self.customerAnalysisRangeSelector,
        'default': 'last-12-months'
    };

    self.getCustomerAnalysisGridRecord = function (uid) {
        return Enumerable.From(self.customerAnalysisWidget().dataSource.view()).Where("$.uid == '" + uid + "'").Single();
    }

    // showing and hiding gbp and currency columns here requires special consideration:
    // we do not know what columns exist... and so cannot hide them by index
    // so perhaps give classes to both values, render both and... on databound... 
    // show what we're wanting to see at that point? 
    // what dictates what we want to see at that point?
    // that'd be slicerGroup.currencyDisplay

    self.getCustomerAnalysisColumns = function () {
        var stdColumns = [
        {
            field: '',
            title: '',
            attributes: {
                'class': 'ranking text-center left-border'
            },
            headerAttributes: {
                'class': 'bottom-border'
            },
            width: 60
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
                    title: 'MKT',
                    headerAttributes: {
                        "class": "third-heading left-border"
                    },
                    attributes: {
                        'class': 'text-left left-border'
                    },
                    width: 50
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
                    field: 'SalesAreaCode',
                    title: 'Area',
                    encoded: false,
                    template: '<span title="#: SalesAreaCode # - #: SalesAreaName #">#: SalesAreaCode #<br/><span class="bold">#: SalesAreaName #</span></span>',
                    headerAttributes: {
                        "class": "third-heading left-border"
                    },
                    attributes: {
                        'class': 'text-left nowrap'
                    },
                    width: 160
                }]
            }]
        }, {
            field: 'code',
            title: '',
            hidden: true,
            columns: [{
                field: '',
                title: '',
                headerAttributes: {
                    'class': 'second-heading'
                },
                columns: [{
                    field: 'Code',
                    title: 'Account Number',
                    encoded: false,
                    headerAttributes: {
                        "class": "third-heading left-border"
                    },
                    attributes: {
                        'class': 'text-left nowrap'
                    },
                    template: '#: Code #',
                    width: 220
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
                    template: '<span title="#: Code # - #: Name #">#: Code #<br/><span class="bold">#: Name #</span></span>',
                    width: 220
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
                    field: 'Status',
                    title: ' ',
                    headerAttributes: {
                        "class": "third-heading"
                    },
                    attributes: {
                        'class': 'text-center'
                    },
                    template: self.statusColumnTemplate,
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
                    title: 'Contact',
                    headerAttributes: {
                        "class": "third-heading"
                    },
                    attributes: {
                        'class': 'text-center'
                    },
                    footerAttributes: {
                        'class': 'right-border'
                    },
                    template: function (rec) {
                        return '<i class="contact-icon material-icons" onclick="viewModel.showContactModal(\'customerAnalysis\', \'' + rec.uid + '\')">contact_mail</i>'
                    },
                    width: 84
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
                    attributes: {
                        'class': 'spacer-column left-border'
                    },
                    headerAttributes: {
                        'class': 'spacer-column left-border'
                    },
                    template: '&nbsp;',
                    width: 10,
                    footerAttributes: {
                        'class': 'right-border'
                    }
                }]
            }]
        }];

        var dynamicGBPColumns = [];
        var dynamicCurrColumns = [];
        if (self.customerAnalysisWidget()) {
            dynamicGBPColumns.push({
                field: '',
                title: '',
                headerAttributes: {
                    'class': 'second-heading'
                },
                columns: [{
                    field: 'PeriodTotalValue',
                    title: 'Period Total',
                    headerAttributes: {
                        'class': 'third-heading left-border'
                    },
                    attributes: {
                        'class': 'text-right left-border'
                    },
                    footerAttributes: {
                        'class': 'right-border'
                    },
                    template: function (rec) {
                        var value = rec.PeriodTotalValue;

                        if (self.customerAnalysisExportFlag) {
                            return value;
                        } else {
                        if (value >= 0)
                            return '<span>' + formatGBP(value) + '</span>';
                        else
                            return '<span class="text-danger">' + formatGBP(value) + '</span>'
                        }
                    },
                    //footerTemplate: '#: data.PeriodTotalValue ? data.PeriodTotalValue.sum : 0 #',
                    footerTemplate: function (data) {
                        //var record = Enumerable.From(data).Where("$.Member == 'PeriodTotalValue'").SingleOrDefault();
                        var value =  data.PeriodTotalValue ? data.PeriodTotalValue.sum : 0;//record ? record.Value : 0;
                        var formatted = formatGBP(value);

                        if (self.customerAnalysisExportFlag) {
                            return value;
                        } else {
                            if (value >= 0)
                                return '<span title="' + formatted + '">' + formatted + '</span>';
                            else
                                return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>'
                        }
                    },
                    width: 100
                }]
            }, {
                field: 'sterling-period-spacer',
                title: ' ',
                headerAttributes: {
                    'class': 'second-heading'
                },
                columns: [{
                    attributes: {
                        'class': 'spacer-column left-border'
                    },
                    headerAttributes: {
                        'class': 'spacer-column left-border'
                    },
                    footerAttributes: {
                        'class': 'right-border'
                    },
                    template: '&nbsp;',
                    width: 10
                }]
            });

            dynamicCurrColumns.push({
                field: '',
                title: '',
                headerAttributes: {
                    'class': 'second-heading'
                },
                columns: [{
                    field: 'PeriodTotalCurr',
                    title: 'Period Total',
                    headerAttributes: {
                        'class': 'third-heading left-border'
                    },
                    attributes: {
                        'class': 'text-right left-border'
                    },
                    footerAttributes: {
                        'class': 'right-border'
                    },
                    template: function (rec) {
                        var value = rec.PeriodTotalCurr;
                        var formatted = formatAnalysisSelectedCurrency(value);
                        
                        if (self.customerAnalysisExportFlag) {
                            return value;
                        } else {
                            if (value >= 0)
                                return '<span title="' + formatted + '">' + formatted + '</span>';
                            else
                                return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
                        }
                    },
                    footerTemplate: function (data) {
                        //var record = Enumerable.From(data).Where("$.Member == 'PeriodTotalValue'").SingleOrDefault();
                        var value = data.PeriodTotalCurr ? data.PeriodTotalCurr.sum : 0;// record ? record.Value : 0;
                        var formatted = formatAnalysisSelectedCurrency(value);

                        if (self.customerAnalysisExportFlag) {
                            return value;
                        } else {
                            if (value >= 0)
                                return '<span title="' + formatted + '">' + formatted + '</span>';
                            else
                                return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
                        }
                    },
                    width: 100
                }]
            }, {
                field: 'currency-period-spacer',
                title: ' ',
                headerAttributes: {
                    'class': 'second-heading'
                },
                columns: [{
                    attributes: {
                        'class': 'spacer-column left-border'
                    },
                    headerAttributes: {
                        'class': 'spacer-column left-border'
                    },
                    template: '&nbsp;',
                    width: 10,
                    footerAttributes: {
                        'class': 'right-border'
                    }
                }]
            });

            self.customerAnalysisRangeSelector().selection().forEach(function (monthId) {
                dynamicGBPColumns.push({
                    field: '',
                    title: '',
                    headerAttributes: {
                        'class': 'second-heading'
                    },
                    columns: [{
                        field: 'Period_' + monthId + '_Value',
                        title: moment(monthId.toString(), 'YYYYMM').format('MMM YY'),
                        headerAttributes: {
                            "class": "third-heading left-border"
                        },
                        attributes: {
                            'class': 'text-right left-border'
                        },
                        footerAttributes: {
                            'class': 'right-border'
                        },
                        template: function (rec) {
                            return self.customerAnalysisDynamicGBPColumnTemplate(rec, monthId);
                        },
                        footerTemplate: function (data) {
                            return self.customerAnalysisDynamicGBPFooterTemplate(data, monthId);
                        },
                        width: 100
                    }]
                });

                dynamicCurrColumns.push({
                    field: '',
                    title: '',
                    headerAttributes: {
                        'class': 'second-heading'
                    },
                    columns: [{
                        field: '',
                        title: moment(monthId.toString(), 'YYYYMM').format('MMM YY'),
                        headerAttributes: {
                            "class": "third-heading left-border"
                        },
                        attributes: {
                            'class': 'text-right left-border'
                        },
                        footerAttributes: {
                            'class': 'right-border'
                        },
                        template: function (rec) {
                            return self.customerAnalysisDynamicCurrColumnTemplate(rec, monthId);
                        },
                        footerTemplate: function (data) {
                            return self.customerAnalysisDynamicCurrFooterTemplate(data, monthId);
                        },
                        width: 100
                    }]
                });
            });
        }

        var gbpColumn = [{
            field: 'sterling',
            title: 'Sales in Sterling',
            headerAttributes: {
                'class': 'first-heading text-left',
                'style': 'padding-left: 94px;'
            },
            columns: dynamicGBPColumns
        }];

        var currColumn = [{
            field: 'currency',
            title: 'Sales in Currency',
            hidden: true,
            headerAttributes: {
                'class': 'first-heading text-left',
                'style': 'padding-left: 94px'
            },
            columns: dynamicCurrColumns
        }];

        if (dynamicGBPColumns.length && dynamicCurrColumns.length) {
            return stdColumns.concat(gbpColumn).concat(currColumn);
        } else {
            return stdColumns;
        }
    }

    self.customerAnalysisDynamicGBPColumnTemplate = function (rec, monthId) {
        var value = rec['Period_' + monthId + '_Value'];
        //var growth = rec['Period_' + monthId + '_Growth'];
        var valueFormatted = formatGBP(value);
        var gbpDisplay = '';
        //var growthDisplay = '';
        //var growthFormatted = formatPercentage(growth);
        if (value >= 0)
            gbpDisplay = '<span class="" title="' + valueFormatted + '">' + valueFormatted + '</span>';
        else
            gbpDisplay = '<span class="text-danger" title="' + valueFormatted + '">' + valueFormatted + '</span>';
        //if (growth >= 0)
        //    growthDisplay = '<span class="" title="' + growthFormatted + '">' + growthFormatted + '</span>';
        //else
        //    growthDisplay = '<span class="text-danger" title="' + growthFormatted + '">' + growthFormatted + '</span>';
        return gbpDisplay;// + '<br/>' + growthDisplay;
    }

    self.customerAnalysisDynamicGBPFooterTemplate = function (data, monthId) {
        var value = data['Period_' + monthId + '_Value'] ? data['Period_' + monthId + '_Value'].sum : 0;
        var formatted = formatGBP(value);

        if (self.customerAnalysisExportFlag) {
            return value;
        } else {
            if (value >= 0)
                return '<span title="' + formatted + '">' + formatted + '</span>';
            else
                return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
        }
    }

    self.customerAnalysisDynamicCurrColumnTemplate = function (rec, monthId) {
        var value = rec['Period_' + monthId + '_ValueCurr'];
        //var growth = rec['Period_' + monthId + '_Growth'];
        var valueFormatted = formatAnalysisSelectedCurrency(value);
        var currDisplay = '';
        //var growthDisplay = '';
        //var growthFormatted = formatPercentage(growth);
        if (value >= 0)
            currDisplay = '<span class="" title="' + valueFormatted + '">' + valueFormatted + '</span>';
        else
            currDisplay = '<span class="text-danger" title="' + valueFormatted + '">' + valueFormatted + '</span>';
        //if (growth >= 0)
        //    growthDisplay = '<span class="" title="' + growthFormatted + '">' + growthFormatted + '</span>';
        //else
        //    growthDisplay = '<span class="text-danger" title="' + growthFormatted + '">' + growthFormatted + '</span>';
        return currDisplay; //+ '<br/>' + growthDisplay;
    }

    self.customerAnalysisDynamicCurrFooterTemplate = function (data, monthId) {
        var value = data['Period_' + monthId + '_Value'] ? data['Period_' + monthId + '_Value'].sum : 0;
        var formatted = formatAnalysisSelectedCurrency(value);

        if (self.customerAnalysisExportFlag) {
            return value;
        } else {
            if (value >= 0)
                return '<span title="' + formatted + '">' + formatted + '</span>';
            else
                return '<span class="text-danger" title="' + formatted + '">' + formatted + '</span>';
        }
    }

    self.customerAnalysisGridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {};

        data.StartMonthID = self.customerAnalysisRangeSelector().startMonthId();
        data.EndMonthID = self.customerAnalysisRangeSelector().endMonthId();

        if (self.searchString()) {
            data.SearchString = self.searchString();
        }

        //self.slicerGroup.slicerCollection.forEach(function (p) {
        //    if (typeof p.boundTo === 'function')
        //        if (p.boundTo().widget().value())
        //            data[p.valueField] = p.boundTo().widget().value();
        //});

        self.slicerGroupOne.slicerCollection.forEach(function (p) {
            if (typeof p.boundTo === 'function')
                if (p.boundTo().widget().value())
                    data[p.valueField] = p.boundTo().selectedId();
        });

        self.slicerGroupTwo.slicerCollection.forEach(function (p) {
            if (typeof p.boundTo === 'function')
                if (p.boundTo().widget().value())
                    data[p.valueField] = p.boundTo().selectedId();
        });

        self.slicerGroupThree.slicerCollection.forEach(function (p) {
            if (typeof p.boundTo === 'function')
                if (p.boundTo().widget().value())
                    data[p.valueField] = p.boundTo().selectedId();
        });

        data.CurrencyID = self.slicerGroupOne.selectedCurrencyId();

        console.log('calling FetchCustomerAnalysis with', data);

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        $.ajax({
            url: '/api/SalesStatisticsAPI/FetchCustomerAnalysis',
            type: "GET",
            data: data,
            success: function (data) {
                console.log('FetchCustomerAnalysis returned', data);
                self.processCustomerAnalysisChartData(data.AggregateResults);
                options.success(data);
            },
            error: function (data) {
                console.log(data);
                options.error();
            }
        });
    }

    self.customerAnalysisGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.customerAnalysisGridDataSourceRead
        },
        pageSize: 50,
        serverAggregates: true,
        serverPaging: true,
        serverSorting: true,
        serverFiltering: false,
        sort: [{
            field: 'PeriodTotalValue',
            dir: 'desc'
        }],
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            model: {
                id: 'TradeAccountID',
                fields: {
                    TradeAccountID: { type: 'Number' },
                    PeriodTotalValue: { type: 'Number' }
                }
            }
        }),
        requestStart: function (e) {
            self.customerAnalysisBusy(true);
        }
    });

    self.customerAnalysisExportFlag = false;

    self.customerAnalysisGridSettings = {
        autoBind: false,
        //height: 724,
        excel: {
            allPages: false,
            fileName: 'CustomerAnalysis.xlsx',
            filterable: true,
            collapsbile: true,
            forceProxy: true,
            proxyURL: '/Sales/Excel_Export_Save'
        },
        excelExport: function (e) {
            if (!self.customerAnalysisExportFlag) {
                if (self.slicerGroupOne.currencyDisplay()) {
                    e.sender.hideColumn('currency-period-spacer');
                } else {
                    e.sender.hideColumn('sterling-period-spacer');
                }
                e.preventDefault();
                self.customerAnalysisExportFlag = true;
                e.sender.showColumn('code');
                window.setTimeout(function () {
                    e.sender.saveAsExcel();
                }, 0);
            } else {
                if (self.slicerGroupOne.currencyDisplay()) {
                    e.sender.showColumn('currency-period-spacer');
                } else {
                    e.sender.showColumn('sterling-period-spacer');
                }
                e.sender.hideColumn('code');
                self.customerAnalysisExportFlag = false;

                //var rows = e.workbook.sheets[0].rows;

                //for (var ri = 0; ri < rows.length; ri++) {
                //    var row = rows[ri];

                //    for (var ci = 0; ci < row.cells.length; ci++) {
                //        var cell = row.cells[ci];
                //        if (cell.value) {
                //            // Use jQuery.fn.text to remove the HTML and get only the text
                //            cell.value = $(cell.value).text();
                //            // Set the alignment
                //            cell.hAlign = "right";
                //        }
                //    }
                //}

                //console.log('stripping HTML from customerAnalysis export');

                //var rows = e.workbook.sheets[0].rows;

                //for (var ri = 0; ri < rows.length; ri++) {
                //    var row = rows[ri];

                //    for (var ci = 0; ci < row.cells.length; ci++) {
                //        var cell = row.cells[ci];
                //        if (cell.value) {
                //            // Use jQuery.fn.text to remove the HTML and get only the text
                //            cell.value = $(cell.value).text();
                //            // Set the alignment
                //            cell.hAlign = "right";
                //        }
                //    }
                //}

                //console.log('done stripping HTML from customerAnalysis export');

                self.customerAnalysisBusy(false);
            }
        },
        widget: self.customerAnalysisWidget,
        data: self.customerAnalysisGridDataSource,
        scrollable: true,
        columns: self.getCustomerAnalysisColumns(),
        sortable: false,
        filterable: false,
        grouping: false,
        serverGrouping: false,
        pageable: {
            pageSize: 50,
            pageSizes: [10, 20, 50, 100, 250, 500 ]
        },
        dataBound: function (e) {
            self.customerAnalysisBound(true);
            console.log('customerAnalysis dataBound');
            var rows = this.items();
            var pageSize = self.customerAnalysisWidget().dataSource.pageSize();
            if (pageSize == null)
                pageSize = 1;
            var page = self.customerAnalysisWidget().dataSource.page();

            $(rows).each(function () {
                var index = $(this).index() + 1
                + (pageSize * (page - 1));
                var rowLabel = $(this).find(".ranking");
                $(rowLabel).html(index);
            });

            var sorting = self.customerAnalysisWidget().dataSource.sort();

            $('#customer-analysis-collapse th').removeClass('sorting-desc').removeClass('sorting-asc').removeClass('sorting-desc');

            for (var i in sorting) {
                var p = sorting[i];
                if (p.dir == 'asc') {
                    $('#customer-analysis-collapse th[data-field="' + p.field + '"]').addClass('sorting-asc');
                } else {
                    $('#customer-analysis-collapse th[data-field="' + p.field + '"]').addClass('sorting-desc');
                }
            }


            window.setTimeout(function () {

                if (self.slicerGroupOne.currencyDisplay()) {
                    self.customerAnalysisWidget().hideColumn('sterling');
                    self.customerAnalysisWidget().hideColumn('currency');
                    self.customerAnalysisWidget().showColumn('currency');
                } else {
                    self.customerAnalysisWidget().hideColumn('currency');
                    self.customerAnalysisWidget().hideColumn('sterling');
                    self.customerAnalysisWidget().showColumn('sterling');
                }

                $("#line-chart-blocker").css('display', 'none');
                
                self.customerAnalysisBusy(false);

            }, 100);
        }
    }

    self.setCustomerAnalysisMonthRangeColumns = function () {
        //console.log('customerAnalysis is changing columns');
        if (self.customerAnalysisWidget()) {

            var options = self.customerAnalysisWidget().getOptions();

            options.columns = self.getCustomerAnalysisColumns();

            self.customerAnalysisWidget().setOptions(options);

            //need to set the aggregate option on the datasource... does setting this cause a read...?

            var fieldsToAggregate = [];

            if (self.slicerGroupOne.currencyDisplay()) {
                fieldsToAggregate.push({
                    field: 'PeriodTotalCurr',
                    aggregate: 'sum'
                });
                fieldsToAggregate.push({
                    field: 'PeriodTotalTargetCurr',
                    aggregate: 'sum'
                });
            } else {
                fieldsToAggregate.push({
                    field: 'PeriodTotalValue',
                    aggregate: 'sum'
                });
                fieldsToAggregate.push({
                    field: 'PeriodTotalTargetValue',
                    aggregate: 'sum'
                });
            }

            self.customerAnalysisRangeSelector().selection().forEach(function (item) {
                // this should be appending _Curr if we're viewing CURR!
                if (self.slicerGroupOne.currencyDisplay()) {
                    fieldsToAggregate.push({
                        field: 'Period_' + item + '_Curr',
                        aggregate: 'sum'
                    });
                    fieldsToAggregate.push({
                        field: 'Period_' + item + '_TargetCurr',
                        aggregate: 'sum'
                    });
                } else {
                    fieldsToAggregate.push({
                        field: 'Period_' + item + '_Value',
                        aggregate: 'sum'
                    });
                    fieldsToAggregate.push({
                        field: 'Period_' + item + '_TargetValue',
                        aggregate: 'sum'
                    });
                }
            });

            //console.log('fieldsToAggregate', fieldsToAggregate);

            self.customerAnalysisWidget().dataSource.query({
                page: 1,
                pageSize: self.customerAnalysisWidget().dataSource.pageSize(),
                filter: self.customerAnalysisWidget().dataSource.filter(),
                sort: self.customerAnalysisWidget().dataSource.sort(),
                aggregate: fieldsToAggregate
            });

            //self.customerAnalysisWidget().dataSource.read();

            //switch (self.slicerGroupOne.currencyDisplay()) {
            //    case 'currency':
            //        self.hideGBPColumns();
            //        break;
            //    case 'sterling':
            //        self.hideCurrencyColumns();
            //        break;
            //    default: break;
            //}
            //console.log('customerAnalysis finished changing columns');
        } else {
            //console.log('customerAnalysis failed to change columns; customerAnalysisWidget was not ready');
        }
    }

    self.searchString = ko.observable();

    self.slicerGroupOne = new slicerGroupOneViewModel(self);
    self.slicerGroupTwo = new slicerGroupTwoViewModel(self);
    self.slicerGroupThree = new slicerGroupThreeViewModel(self);

    self.previousValues = null;

    self.customerAnalysisSkipFirst = true;

    self.customerAnalysisNonce = ko.observable();

    self.lowerSlicerGroupsComputed = ko.computed(function () {

        var f = self.customerAnalysisNonce();

        var period = undefined;
        if (self.customerAnalysisRangeSelector())
            period = self.customerAnalysisRangeSelector().selection();

        var groupOne = self.slicerGroupOne.foo();
        var groupTwo = self.slicerGroupTwo.foo();
        var groupThree = self.slicerGroupThree.foo();

        //console.log('lowerSlicerGroups computed', groupOne, groupTwo, groupThree, period);

        if ((groupOne || groupTwo || groupThree) && period) {

            var ids = []; //$.extend({}, groupOne, groupTwo, groupThree);//, period)

            if (groupOne) {
                $.merge(ids, groupOne);
            }
            if (groupTwo) {
                $.merge(ids, groupTwo);
            }
            if (groupThree) {
                $.merge(ids, groupThree);
            }
            if (period.length) {
                $.merge(ids, [{ name: 'periods', selectedId: period }]);
            }

            var unchangedSkip = false;

            if (self.previousValues) {

                // if we have a differing number of properties now as last time, definitely don't want an unchangedSkip!
                if (ids.length == self.previousValues.length) {

                    // if we have the same number of properties now as last time, are they the same values?
                    for (var property in self.previousValues) {

                        var p = self.previousValues[property];

                        var q = Enumerable.From(ids).Where(function (x) {
                            if (x.hasOwnProperty('name')) {
                                return x.name == p.name
                            } else {
                                // this handles 'Periods' being an array of integers
                                return x.Value == p
                            }
                        }).SingleOrDefault();

                        if (q) {
                            if (typeof p.selectedId == 'object') {
                                if (p.selectedId == null && q.selectedId != null) {
                                    unchangedSkip = false; // change detected, 
                                    break;                 // break for (var property in self.previousValues)
                                } else if (p.selectedId != null && q.selectedId == null) {
                                    unchangedSkip = false; // change detected, 
                                    break;                 // break for (var property in self.previousValues)
                                } else if (p.selectedId == null && q.selectedId == null) {
                                                           // noop
                                } else {
                                    if (p.selectedId.length != q.selectedId.length) {
                                        unchangedSkip = false; // change detected, 
                                        break;                 // break for (var property in self.previousValues)
                                    } else {
                                        for (var i in p.selectedId) {
                                            if (q.selectedId.indexOf(p.selectedId[i]) === -1) {
                                                unchangedSkip = false; // change detected, 
                                                break;                 // break for (var property in self.previousValues)
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (p.selectedId == q.selectedId) {

                                    // This equality is no longer the only condition for an unchanged skip
                                    // our current property may carry other values which we care about... such as currency.

                                    unchangedSkip = true; // our primary selectedId matches

                                    // but we have selectionAffects which we care about
                                    for (var i = 0; i < p.selectionAffects.length; i++) {
                                        var affected = p.selectionAffects[i];
                                        // q must have the same list of additional params...
                                        var previousAffected = Enumerable.From(q.selectionAffects).Where(function (x) {
                                            return x.name == affected.name;
                                        }).SingleOrDefault();

                                        if (previousAffected == null) {
                                            unchangedSkip = false;
                                            break;
                                        } else {
                                            // because {} != {}... and I don't care about the object maintaned for currency display purposes,
                                            // just about the currency ID...
                                            if (typeof affected.value === 'object') {
                                                continue;
                                            }
                                            if (affected.value != previousAffected.value) {
                                                unchangedSkip = false;
                                                break;
                                            }
                                        }
                                    }
                                } else {
                                    unchangedSkip = false;
                                    break;
                                }
                            }
                        } else { // previousValue.name was not found in IDs... usually a glitch in the Matrix. It happens when they change something.
                            unchangedSkip = false;
                            break;
                        }
                    }
                }
            }

            console.log('customer analysis unchangedSkip?', unchangedSkip);
            console.log('customer analysis skipFirst?', self.customerAnalysisSkipFirst);

            if (self.customerAnalysisSkipFirst || unchangedSkip) {
                self.customerAnalysisSkipFirst = false;

                if (!self.customerAnalysisBound.peek()) {
                    if ($('#customer-analysis-collapse').hasClass('in')) {
                        self.setCustomerAnalysisMonthRangeColumns();
                    }
                }
            } else {
                self.setCustomerAnalysisMonthRangeColumns();
            }

            self.previousValues = ids;

            if (!unchangedSkip) {
                // there WERE changes made to the parameters, 
                // rather than just a valueHasMutated call on the nonce,
                // but we might not have been displaying grids.
                // therefore when they're reopened following an actual parameter change
                // they don't know that they must rebind 
                self.customerAnalysisBound(false);
                // unless we tell them
            }
        }
    }, self).extend({
        rateLimit: {
            timeout: 500,
            method: 'notifyWhenChangesStop'
        }
    });

    self.clearLowerSlicers = function () {

        self.searchString(undefined);

        self.slicerGroupOne.slicerCollection.forEach(function (s) {
            s.boundTo().clearSelection();
        });
        self.slicerGroupTwo.slicerCollection.forEach(function (s) {
            s.boundTo().clearSelection();
        });
        self.slicerGroupThree.slicerCollection.forEach(function (s) {
            s.boundTo().clearSelection();
        });
    }

    // #endregion


    // #region Customer Analysis Line Chart

    self.thisPeriodSeriesLabel = '';
    self.lastPeriodSeriesLabel = '';
    
    self.processCustomerAnalysisChartData = function (input) {
        var data = Enumerable.From(input).Where(function (x) {
            return x.Member.indexOf('_Target') == -1
        }).ToArray();

        var targets = Enumerable.From(input).Where(function (x) {
            return x.Member.indexOf('_Target') > -1;
        }).ToArray()

        for (var i in targets) {
            targets[i].Member = targets[i].Member.replace(/Period|Value|Curr|Target|_/g, '')
        }

        var dataResults = [];

        for(var i in data) {
            var aggr = data[i];

            switch (aggr.Member) {
                case 'PeriodTotalValue':
                    self.thisPeriodSeriesLabel = formatGBP(aggr.Value);
                    continue;
                case 'PeriodTotalTargetValue':
                    self.lastPeriodSeriesLabel = formatGBP(aggr.Value);
                    continue;
                case 'PeriodTotalCurr':
                    self.thisPeriodSeriesLabel = formatCurrency(aggr.Value);
                    continue;
                case 'PeriodTotalTargetCurr':
                    self.lastPeriodSeriesLabel = formatCurrency(aggr.Value);
                    continue;
                default:
                    var dataPoint = {};
                    
                    dataPoint.period = aggr.Member.replace(/Period|Value|Curr|_/g, '');
                    dataPoint.target = Enumerable.From(targets).Where(function (x) {
                        return x.Member == dataPoint.period;
                    }).Select('$.Value').Single();
                    dataPoint.value = aggr.Value;
                    dataResults.push(dataPoint);
                    break;
            }
        }

        self.customerAnalysisChartData(dataResults);

        self.customerAnalysisChart().redraw();
    }

    self.customerAnalysisChartDataSource = ko.observable();

    self.customerAnalysisChartData = ko.observable([]);

    self.customerAnalysisChart = ko.observable();

    self.customerAnalysisChartParams = {
        autoBind: true,
        widget: self.customerAnalysisChart,
        dataSource: {
            requestStart: function (e) {
                console.log('chart databinding')
                $("#line-chart-blocker").css('display', 'flex');
            }
        },
        data: self.customerAnalysisChartData,
        series: [{
            name: 'Selected Period',
            field: 'value',
            //categoryAxis: 'Period',
            tooltip: {
                visible: true,
                template: function (d) {
                    var label = d.value;
                    var category = d.dataItem.period;
                    var result = "";

                    if (self.slicerGroupOne.currencyDisplay()) {
                        result = formatAnalysisSelectedCurrency(label);
                    } else {
                        if (label.length < 2) {
                            result = formatGBPDec(label);
                        } else {
                            result = formatGBP(label);
                        }
                    }

                    result = moment(d.dataItem.period, 'YYYYMM').format('MMM YYYY') + ' : ' + result;

                    return result;
                }
            },
            zIndex: 2
        }, {
            name: 'Selected Period Last Year',
            field: 'target',
            color: 'grey',
            width: 1,
            markers: {
                visible: false
            },
            tooltip: {
                visible: true,
                template: function (d) {
                    var label = d.value;
                    var category = d.dataItem.period;
                    var result = "";

                    if (self.slicerGroupOne.currencyDisplay()) {
                        result = formatAnalysisSelectedCurrency(label);
                    } else {
                        result = formatGBP(label);
                    }

                    result = moment(d.dataItem.period, 'YYYYMM').subtract('years', 1).format('MMM YYYY') + ' : ' + result;

                    return result;
                }
            },
            zIndex: 1
        }],
        legend: {
            visible: true,
            position: 'bottom',
            labels: {
                template: function (d) {
                    return d.text + ' ' + (d.series.name == 'Selected Period' ? self.thisPeriodSeriesLabel :
                                                                                 self.lastPeriodSeriesLabel);
                }
            }
        },
        seriesDefaults: {
            type: 'line'
        },
        legendItemHover: function(e) {
            if (e.series.name == 'Selected Period Last Year') {
                e.preventDefault();
            }
        },
        valueAxis: {
            name: 'Sales',
            field: 'value',
            labels: {
                template: function (d) {
                    var label = d.value;
                    if (self.slicerGroupOne.currencyDisplay()) {
                        return formatAnalysisSelectedCurrency(label);
                    } else {
                        return formatGBP(label);
                    }
                }
            }
        },
        categoryAxis: {
            name: 'Period',
            field: 'period',
            majorGridLines: {
                visible: false
            }, 
            labels: {
                template: function (d) {
                    return moment(d.value, 'YYYYMM').format('MMM-YY');
                },
                rotation: -45
            }
        }
    };

    // #endregion
}

var slicerGroupOneViewModel = function (parent) {
    var self = this;

    self.parent = parent;

    self.skipFirst = false;

    self.repSlicer = ko.observable();
    self.marketSlicer = ko.observable();
    self.areaSlicer = ko.observable();
    self.repOrAgentSlicer = ko.observable();

    var preselectedRep = getPreselectedSalesRep();

    var repOrAgent = null;
    var repId = null;
    var marketId = null;
    var areaId = null;
    var currencyId = null;

    if (preselectedRep != null) {
        repId = preselectedRep.SalesRepresentativeID;
        marketId = preselectedRep.SalesMarketID;
    }

    self.preselectedRep = preselectedRep;

    self.repId = ko.observable(repId);
    self.marketId = ko.observable(marketId);
    self.areaId = ko.observable(areaId);
    self.repOrAgentId = ko.observable(repOrAgent);
    self.selectedCurrency = ko.observable();
    self.selectedCurrencyId = ko.observable();

    // false == "Sterling" 
    // true == "Currency"
    self.currencyDisplay = ko.observable(false);

    self.currencyDisplay.subscribe(function (newValue) {
        window.setTimeout(function () {
            self.clearSlicers();
            self.marketSlicer().dataSource.read();
            switch (newValue) {
                case true:
                    //$('.panel-collapse').not('#rep-search-collapse').collapse('hide');
                    self.parent.hideGBPColumns();
                    self.parent.showCurrencyColumns();
                    break;
                case false:
                    self.selectedCurrency(undefined);
                    self.selectedCurrencyId(undefined);
                    self.parent.hideCurrencyColumns();
                    self.parent.showGBPColumns();
                    break;
                default: break;
            }
        }, 400);
    });

    self.areaSlicerParams = {
        name: 'Sales Area',
        valueField: 'SalesAreaID',
        textField: 'Name',
        boundTo: self.areaSlicer,
        selectedId: self.areaId,
        endPoint: '/api/salesstatisticsapi/SalesAreaSlicerEndpoint',
        clearValue: null
    };

    self.repSlicerParams = {
        //log: true,
        autoBind: true,
        name: 'Sales Person',
        valueField: 'SalesRepresentativeID',
        textField: 'Name',
        boundTo: self.repSlicer,
        selectedId: self.repId,
        endPoint: '/api/salesstatisticsapi/SalesRepresentativeSlicerEndpoint',
        clearValue: null,
        readOnly: lockedToRep,
        clearSiblings: false
    };

    self.repOrAgentSlicerParams = {
        //log: true,
        autoBind: true,
        name: 'Acting as',
        valueField: 'SalesRepOrAgent',
        textField: 'Name',
        boundTo: self.repOrAgentSlicer,
        selectedId: self.repOrAgentId,
        endPoint: '/api/salesstatisticsapi/SalesRepOrAgentSlicerEndpoint',
        //noOptionLabel: true,
        clearValue: null,
        optionLabelText: "Either Representative or Agent"
    };

    self.marketSlicerParams = {
        //log: true,
        autoBind: true,
        name: 'Sales Market',
        valueField: 'SalesMarketID',
        textField: 'Name',
        boundTo: self.marketSlicer,
        selectedId: self.marketId,
        endPoint: '/api/salesstatisticsapi/SalesMarketSlicerEndpoint',
        selectOnlyItem: true,
        clearValue: null,
        optionLabelText: 'All',
        additionalParams: [{
            name: 'CurrencyDisplay',
            value: self.currencyDisplay
        }, {
            name: 'CurrencyID',
            value: self.selectedCurrencyId
        }],
        selectionAffects: [{
            names: ['CurrencyCode', 'FormattingCulture'],
            value: self.selectedCurrency
        }, {
            name: 'CurrencyID',
            value: self.selectedCurrencyId
        }],
        compositeKey: {
            names: ['SalesMarketID', 'CurrencyID'],
            onlyIf: self.currencyDisplay
        }
    };

    self.slicerCollection = [
        self.repSlicerParams,
        self.repOrAgentSlicerParams,
        self.marketSlicerParams,
        self.areaSlicerParams
    ];

    self.clearSlicers = function () {

        if (self.preselectedRep) {
            self.slicerCollection.forEach(function (s) {
                if (s.boundTo().name != 'Sales Person') {
                    if (s.boundTo().hasOwnProperty('clearValue')) {
                        s.boundTo().widget().value(s.boundTo().clearValue);
                        s.boundTo().widget().trigger('change');
                    } else {
                        s.boundTo().widget().value(null);
                        s.boundTo().widget().trigger('change');
                    }
                }
            });
        } else {
            self.slicerCollection.forEach(function (s) {
                if (s.boundTo().hasOwnProperty('clearValue')) {
                    s.boundTo().widget().value(s.boundTo().clearValue);
                    s.boundTo().widget().trigger('change');
                } else {
                    s.boundTo().widget().value(null);
                    s.boundTo().widget().trigger('change');
                }
            });
        }

        // If there are values to clear, the slicers will cause
        // the evaluation of foo() when their values are cleared.
        // If there were no changes - everything was already cleared,
        // then 
    }

    self.marketSlicerParams.slicerCollection = self.slicerCollection;
    self.areaSlicerParams.slicerCollection = self.slicerCollection;
    self.repSlicerParams.slicerCollection = self.slicerCollection;
    self.repOrAgentSlicerParams.slicerCollection = self.slicerCollection;

    self.previousValues = null;

    self.nonce = ko.observable();

    self.foo = ko.computed({
        read: function () {

            console.log('group one is evaluating');

            var f = self.nonce();

            if (self.repSlicer() &&
                self.marketSlicer() &&
                self.areaSlicer() &&
                self.repOrAgentSlicer()) {
                var ids = [];

                self.slicerCollection.forEach(function (p) {
                    ids.push({
                        name: p.name,
                        selectedId: p.selectedId(),
                        selectionAffects: ko.toJS(p.boundTo().selectionAffects)
                    });

                    for (var i = 0; i < p.boundTo().selectionAffects.length; i++) {
                        var q = p.boundTo().selectionAffects[i].value();
                    }
                });

                console.log('group one was evaluated and found', ids);

                if (self.parent) {
                    if (ids.length)
                        return ids;
                    else
                        return false;
                }

                //// also skip if the IDs haven't changed...

                ////var unchangedSkip = false;

                //if (self.previousValues) {
                //    for (var pr = 0; pr < self.previousValues.length; pr++) {
                //        var p = self.previousValues[pr];

                //        var q = Enumerable.From(ids).Where(function (x) {
                //            return x.name == p.name
                //        }).SingleOrDefault();

                //        if (q) {
                //            if (p.selectedId == q.selectedId) {
                //                // this is no longer the only condition for an unchanged skip
                //                // ... we have other dependencies... such as currency.

                //                unchangedSkip = true; // our primary selectedId matches

                //                // but we have selectionAffects which we care about
                //                for (var i = 0; i < p.selectionAffects.length; i++) {
                //                    var affected = p.selectionAffects[i];
                //                    // q must have the same list of additional params...
                //                    var previousAffected = Enumerable.From(q.selectionAffects).Where(function (x) {
                //                        return x.name == affected.name;
                //                    }).SingleOrDefault();

                //                    if (previousAffected == null) {
                //                        unchangedSkip = false;
                //                        break;
                //                    } else {
                //                        // because {} != {}... and I don't care about the object maintaned for currency display purposes,
                //                        // just about the currency ID...
                //                        if (typeof affected.value === 'object') {
                //                            continue;
                //                        }
                //                        if (affected.value != previousAffected.value) {
                //                            unchangedSkip = false;
                //                            break;
                //                        }
                //                    }
                //                }
                //            } else {
                //                unchangedSkip = false;
                //                break;
                //            }
                //        } else {
                //            unchangedSkip = false;
                //            break;
                //        }
                //    }
                //}

                //if (self.skipFirst || unchangedSkip) {
                //    self.skipFirst = false;

                //    // because parameters have not changed I cannot now see the Quarterly Sales
                //    // which is just a result of it not having bound yet - so...
                //    // even if we skip, we can safely bind the Total and Quarterlies.

                //    // but... we can't say the same for Area or Customer Dashboard.

                //    // so... set a flag to tell us if it has been bound at least once.
                //    // if we are skipping, and we have not yet bound either of these, and... they're going to be...
                //    // viewed... then bind them?

                //    // this, for the first three grids (Total, Calendar, Financial) is performed already
                //    // by dint of us having called FetchTotalsQuarterlies.

                //    // however, for the Area grid and the Customer Dashboard and Grid...
                //    // we still face the same problem.

                //    if (self.currencyDisplay() && !self.marketId()) {

                //    } else {


                //        if (!self.parent.salesAreaBound.peek()) {
                //            if ($('#sales-area-collapse').hasClass('in')) {
                //                self.parent.salesByAreaWidget().dataSource.read();
                //            }
                //        }

                //        if ($('#sales-customer-collapse').hasClass('in')) {
                //            if (!self.parent.customerDashboardBound.peek()) {
                //                self.parent.fetchCustomerDashboard();
                //            }
                //        }
                //    }
                //} else {
                //    if (self.currencyDisplay() && !self.marketId()) {

                //    } else {
                //        if (self.parent) {
                //            self.parent.fetchStatistics(ids);
                //        }
                //    }
                //}

                //self.previousValues = ids;

                //if (!unchangedSkip) {
                //    // there WERE changes made to the parameters, 
                //    // rather than just a valueHasMutated call on the nonce,
                //    // but we might not have been displaying grids.
                //    // therefore when they're reopened following an actual parameter change
                //    // they don't know that they must rebind 

                //    self.parent.salesAreaBound(false);
                //    self.parent.customerDashboardBound(false);
                //    // unless we tell them
                //}
            }
        }
    }, self).extend({
        rateLimit: {
            method: 'notifyWhenChangesStop',
            timeout: 100
        }
    });

    self.gridVisible = ko.computed(function () {
        if (self.currencyDisplay() && !self.marketId()) {
            return false;
        } else {
            return true;
        }
    }, self);
}

var slicerGroupTwoViewModel = function (parent) {
    var self = this;

    self.parent = parent;

    self.accountGroupSlicer = ko.observable();
    self.brandSlicer = ko.observable();
    self.productGroupSlicer = ko.observable();
    self.itemTypeSlicer = ko.observable();
    self.launchSlicer = ko.observable();

    self.accountGroupId = ko.observable();
    self.brandId = ko.observable();
    self.productGroupId = ko.observable();
    self.itemTypeId = ko.observable();
    self.launchId = ko.observable();

    self.busy = ko.observable();
    self.nonce = ko.observable();

    self.accountGroupSlicerParams = {
        autoBind: true,
        name: 'Account Group',
        valueField: 'TradeAccountGroupID',
        textField: 'Name',
        boundTo: self.accountGroupSlicer,
        selectedId: self.accountGroupId,
        slicerCollection: [],
        endPoint: '/api/salesstatisticsapi/AccountGroupSlicerEndpoint',
        clearValue: null
    };

    self.brandSlicerParams = {
        name: 'Brand',
        valueField: 'BrandID',
        textField: 'Name',
        boundTo: self.brandSlicer,
        selectedId: self.brandId,
        endPoint: '/api/salesstatisticsapi/BrandSlicerEndpoint',
        clearValue: null
    };

    self.productGroupSlicerParams = {
        name: 'Product Group',
        valueField: 'ProductGroupID',
        textField: 'Name',
        boundTo: self.productGroupSlicer,
        selectedId: self.productGroupId,
        endPoint: '/api/salesstatisticsapi/ProductGroupSlicerEndpoint',
        clearValue: null
    };

    self.itemTypeSlicerParams = {
        name: 'Item Type',
        valueField: 'ItemTypeID',
        textField: 'Name',
        boundTo: self.itemTypeSlicer,
        selectedId: self.itemTypeId,
        endPoint: '/api/salesstatisticsapi/ItemTypeSlicerEndpoint',
        clearValue: null
    };

    self.launchSlicerParams = {
        name: 'Launch',
        valueField: 'LaunchID',
        textField: 'Name',
        boundTo: self.launchSlicer,
        selectedId: self.launchId,
        endPoint: '/api/salesstatisticsapi/LaunchSlicerEndpoint',
        clearValue: null
    };

    self.slicerCollection = [
        self.accountGroupSlicerParams,
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

            console.log('group two is evaluating');

            var f = self.nonce();

            if (self.accountGroupSlicer() &&
                self.brandSlicer() &&
                self.productGroupSlicer() &&
                self.itemTypeSlicer() &&
                self.launchSlicer()) {
                var ids = [];

                self.slicerCollection.forEach(function (p) {
                    if (p.selectedId() != null && p.selectedId() != '') {
                        ids.push({
                            name: p.name,
                            selectedId: p.selectedId(),
                            selectionAffects: ko.toJS(p.boundTo().selectionAffects)
                        });
                    }
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

    self.partnerSlicer = ko.observable();
    self.customerTypeSlicer = ko.observable();
    self.tagSlicer = ko.observable();
    self.statusSlicer = ko.observable();
    self.advertisingSlicer = ko.observable();

    self.partnerId = ko.observable();
    self.customerTypeId = ko.observable();
    self.tagId = ko.observable();
    self.statusId = ko.observable();
    self.advertisingId = ko.observable(true);

    self.busy = ko.observable();
    self.nonce = ko.observable();

    self.partnerSlicerParams = {
        autoBind: true,
        name: 'Partner',
        valueField: 'PartnerID',
        textField: 'Name',
        boundTo: self.partnerSlicer,
        selectedId: self.partnerId,
        slicerCollection: [],
        endPoint: '/api/salesstatisticsapi/PartnerSlicerEndpoint',
        clearValue: null
    };

    self.customerTypeSlicerParams = {
        autoBind: true,
        name: 'Customer Type',
        valueField: 'CustomerTypeID',
        textField: 'Name',
        boundTo: self.customerTypeSlicer,
        selectedId: self.customerTypeId,
        slicerCollection: [],
        endPoint: '/api/salesstatisticsapi/CustomerTypeSlicerEndpoint',
        clearValue: null
    };

    self.tagSlicerParams = {
        autoBind: true,
        name: 'Tag',
        valueField: 'TagID',
        textField: 'Name',
        boundTo: self.tagSlicer,
        selectedId: self.tagId,
        slicerCollection: [],
        endPoint: '/api/salesstatisticsapi/TagSlicerEndpoint',
        clearValue: null
    };

    self.statusSlicerParams = {
        autoBind: true,
        name: 'Status',
        valueField: 'StatusID',
        textField: 'Name',
        boundTo: self.statusSlicer,
        selectedId: self.statusId,
        slicerCollection: [],
        endPoint: '/api/salesstatisticsapi/StatusSlicerEndpoint',
        clearValue: null
    };

    self.advertisingSlicerParams = {
        log: true,
        autoBind: true,
        name: 'Advertising',
        valueField: 'IncludeAdvertising',
        textField: 'Name',
        boundTo: self.advertisingSlicer,
        selectedId: self.advertisingId,
        slicerCollection: [],
        endPoint: '/api/salesstatisticsapi/AdvertisingSlicerEndpoint',
        clearValue: true,
        optionLabelText: 'Include'
    };

    /*
     * //log: true,
        autoBind: true,
        name: 'Acting as',
        valueField: 'SalesRepOrAgent',
        textField: 'Name',
        boundTo: self.repOrAgentSlicer,
        selectedId: self.repOrAgentId,
        endPoint: '/api/salesstatisticsapi/SalesRepOrAgentSlicerEndpoint',
        //noOptionLabel: true,
        clearValue: 2,
        optionLabelText: "Either Representative or Agent"
     * 
     */

    self.slicerCollection = [
        self.partnerSlicerParams,
        self.customerTypeSlicerParams,
        self.tagSlicerParams,
        self.statusSlicerParams,
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

            console.log('group three is evaluating');

            var f = self.nonce();

            if (self.partnerSlicer() &&
                self.customerTypeSlicer() &&
                self.tagSlicer() &&
                self.statusSlicer() &&
                self.advertisingSlicer()) {
                var ids = [];

                self.slicerCollection.forEach(function (p) {

                    if (p.selectedId() != null && p.selectedId() != '') {
                        ids.push({
                            name: p.name,
                            selectedId: p.selectedId(),
                            selectionAffects: ko.toJS(p.boundTo().selectionAffects)
                        });
                    }

                    //ids.push({
                    //    name: p.name,
                    //    selectedId: p.selectedId()
                    //});
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

    // Just
    // A few more...

} // Lines! YES!!!