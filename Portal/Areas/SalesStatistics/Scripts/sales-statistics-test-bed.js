var testBedViewModel = function () {
    var self = this;

    self.slicerGroupOne = new slicerGroupOneViewModel(self);

    self.callsToFetchStatistics = ko.observableArray([]);

    self.fetchStatistics = function (ids) {
        self.callsToFetchStatistics.push('Called: ' + new Date().toGMTString() + ' ' + JSON.stringify(ids));
    }
}

var slicerGroupOneViewModel = function (parent) {
    var self = this;

    self.parent = parent;

    self.skipFirst = false;

    self.repSlicer = ko.observable();
    //self.currencySlicer = ko.observable();
    self.marketSlicer = ko.observable();
    self.repOrAgentSlicer = ko.observable();

    var preselectedRep = getPreselectedSalesRep();

    var repOrAgent = 2; // initially, 2: 'both'.
    var repId = null;
    var marketId = null;
    var currencyId = null;

    if (preselectedRep != null) {
        repOrAgent = 0; // if there's a preselectedRep, set 'Sales Rep' (0);
        repId = preselectedRep.SalesRepresentativeID;
        marketId = preselectedRep.SalesMarketID;
    }

    self.repId = ko.observable(repId);
    self.currencyId = ko.observable(currencyId);
    self.marketId = ko.observable(marketId);
    self.repOrAgentId = ko.observable(repOrAgent);
    self.selectedCurrency = ko.observable();
    self.selectedCurrencyId = ko.observable();

    // false == "Sterling" 
    // true == "Currency"
    self.currencyDisplay = ko.observable(false);

    self.currencyDisplay.subscribe(function (newValue) {
        $('.panel-collapse').not('#rep-search-collapse').collapse('hide');
        window.setTimeout(function () {
            self.clearSlicers();
            self.marketSlicer().dataSource.read();
            switch (newValue) {
                case true:
                    self.parent.showCurrencyColumns();
                    self.parent.hideGBPColumns();
                    break;
                case false:
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
        clearValue: 2,
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
        }]
    };



    self.productGroupSlicer = ko.observable();

    self.productGroupId = ko.observable(null);

    self.productGroupSlicerParams = {
        log: true,
        name: 'Product Group',
        valueField: 'ProductGroupID',
        textField: 'Name',
        boundTo: self.productGroupSlicer,
        selectedId: self.productGroupId,
        endPoint: '/api/leadsapi/ProductGroupSlicerEndpoint',
        clearValue: null,
        selectOnlyItem: true
    };

    self.itemTypeSlicer = ko.observable();

    self.itemTypeId = ko.observable(null);

    self.itemTypeSlicerParams = {
        log: true,
        name: 'Item Type',
        valueField: 'ItemTypeID',
        textField: 'Name',
        boundTo: self.itemTypeSlicer,
        selectedId: self.itemTypeId,
        endPoint: '/api/leadsapi/ItemTypeSlicerEndpoint',
        clearValue: null,
        selectOnlyItem: false
    };

    self.slicerCollection = [
        self.productGroupSlicerParams,
        self.itemTypeSlicerParams
    ];

    //self.currencySlicerParams = {
    //    autoBind: true,
    //    name: 'Account Currency',
    //    valueField: 'CurrencyID',
    //    textField: 'Name',
    //    boundTo: self.currencySlicer,
    //    selectedId: self.currencyId,
    //    endPoint: '/api/salesstatisticsapi/CurrencySlicerEndpoint',
    //    selectOnlyItem: true,
    //    clearValue: null
    //};

    //self.slicerCollection = [
    //    self.repSlicerParams,
    //    self.repOrAgentSlicerParams,
    //    self.marketSlicerParams
    //    //,
    //    //self.currencySlicerParams,
    //];

    self.clearSlicers = function () {

        self.slicerCollection.forEach(function (s) {
            if (s.boundTo().hasOwnProperty('clearValue')) {
                s.boundTo().widget().value(s.boundTo().clearValue);
                s.boundTo().widget().trigger('change');
            } else {
                s.boundTo().widget().value(null);
                s.boundTo().widget().trigger('change');
            }
        });
        // If there are values to clear, the slicers will cause
        // the evaluation of foo() when their values are cleared.
        // If there were no changes - everything was already cleared,
        // then 
    }
    

    self.productGroupSlicerParams.slicerCollection = self.slicerCollection;
    self.itemTypeSlicerParams.slicerCollection = self.slicerCollection;

    //self.marketSlicerParams.slicerCollection = self.slicerCollection;
    ////self.currencySlicerParams.slicerCollection = self.slicerCollection;
    //self.repSlicerParams.slicerCollection = self.slicerCollection;
    //self.repOrAgentSlicerParams.slicerCollection = self.slicerCollection;

    self.previousValues = null;

    self.nonce = ko.observable();

    self.foo = ko.computed({
        read: function () {

            var f = self.nonce();

            if (self.repSlicer() &&
                self.marketSlicer() &&
                //self.currencySlicer() &&
                self.repOrAgentSlicer()) {
                var ids = [];

                self.slicerCollection.forEach(function (p) {
                    ids.push({
                        name: p.name,
                        selectedId: p.selectedId()
                    });
                });
                 
                // if no currency is selected... show Sterling
                // Nope.
                //if (self.currencySlicer().selectedId() == 1 || self.currencySlicer().selectedId() == '') {
                //    if (!self.parent.showingGBPColumns()) {
                //        self.currencyDisplay('sterling');
                //    }
                //} else {
                //    if (!self.parent.showingCurrencyColumns()) {
                //        self.currencyDisplay('currency');
                //    }
                //}

                // also skip if the IDs haven't changed...

                var unchangedSkip = false;

                if (self.previousValues) {
                    for (var property in self.previousValues) {
                        var p = self.previousValues[property];

                        var q = Enumerable.From(ids).Where(function (x) {
                            return x.name == p.name
                        }).SingleOrDefault();

                        if (q) {
                            if (p.selectedId == q.selectedId) {
                                unchangedSkip = true;
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

                    // if we're skipping then we need to make sure what we're trying to show
                    // is actually bound! TOMORROW

                    // e.g. great, I can see the TotalSales without doing anything - it has already fetched
                    // and the data source is local to the results of that fetch
                    
                    // however, because parameters have not changed I cannot now see the Quarterly Sales
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

                    //if (!self.parent.salesAreaBound.peek()) {
                    //    if ($('#sales-area-collapse').hasClass('in')) {
                    //        self.parent.salesByAreaWidget().dataSource.read();
                    //    }
                    //}
                    
                    //if ($('#sales-customer-collapse').hasClass('in')) {
                    //    if (!self.parent.customerDashboardBound.peek()) {
                    //        self.parent.fetchCustomerDashboard();
                    //    }
                    //}
                } else {
                    if (self.parent) {
                        self.parent.fetchStatistics(ids);
                    }
                }

                self.previousValues = ids;

                if (!unchangedSkip) {
                    // there WERE changes made to the parameters, 
                    // rather than just a valueHasMutated call on the nonce,
                    // but we might not have been displaying grids.
                    // therefore when they're reopened following an actual parameter change
                    // they don't know that they must rebind 
                    //self.parent.salesAreaBound(false);
                    //self.parent.customerDashboardBound(false);
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
}