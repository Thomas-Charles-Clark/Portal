// Do try to keep this from getting Lead specific, as it has to be reused in.. some other place.
// woop woop!

var businessPotential = function (_currency, _parent) {
    if (typeof _currency === 'undefined')
        console.error('businessPotential requires _currency observable parameter');

    if (typeof _parent === 'undefined')
        console.error('businessPotential requires _parent');

    var self = this;

    self.parent = _parent;

    self.currency = _currency;

    self.brandGroups = ko.observableArray([]);

    self.productTypeGroups = ko.observableArray([]);

    self.data = ko.observableArray([]);

    self.tradeAdvertiserSchemes = ko.observableArray([]);

    self.totalBusinessPotentialUnformatted = ko.pureComputed({
        read: function () {
            var total = 0;
            //if (typeof self.productTypeGroups === 'function') {
                for (var i in self.productTypeGroups()) {
                    for (var j in self.productTypeGroups()[i].data) {
                        var thisTuple = self.productTypeGroups()[i].data[j];
                        if (thisTuple.Available) {
                            if (thisTuple.Value())
                                total += Number(thisTuple.Value());
                        }
                    }
                }
            //}
            return total;
        }
    }, self);

    self.totalBusinessPotential = ko.pureComputed({
        read: function () {
            if (ko.unwrap(self.currency))
                return formatNumber(self.totalBusinessPotentialUnformatted(), 0, ko.unwrap(self.currency).FormattingCulture);
            else
                return self.totalBusinessPotentialUnformatted() || null;
        }
    }, self);

    self.totalBusinessPotentialCurrencyFormatted = ko.pureComputed({
        read: function () {

            if (ko.unwrap(self.currency))
                return formatCurrency(self.totalBusinessPotentialUnformatted(), 0, ko.unwrap(self.currency).FormattingCulture, ko.unwrap(self.currency).Code);
            else
                return self.totalBusinessPotentialUnformatted() || null;
        }
    }, self);

    self.totalBusinessPotentialGBP = ko.pureComputed({
        read: function () {
            if (ko.unwrap(self.currency)) {
                if (ko.unwrap(self.currency).Code != 'GBP') {
                    return fx.convert(self.totalBusinessPotentialUnformatted(), { from: ko.unwrap(self.currency).ISO_4217, to: 'GBP' }).toFixed(0);
                }
            }
            return null;
        }
    }, self).extend({
        currencyFormatted: {
            digits: 0,
            currency: self.parent.gbpCurrency
        }
    });
    
    self.init = function (_loadedData, _productGroupBrandMatrix, _actualSalesFigures) {

        _loadedData = _loadedData || [];

        _productGroupBrandMatrix = _productGroupBrandMatrix || [];

        _actualSalesFigures = _actualSalesFigures || [];

        var groupedByProductTypeGroup = Enumerable.From(Enumerable.From(_productGroupBrandMatrix).OrderBy("$.ProductTypeGroup.SortOrder").ToArray())
                                                        .GroupBy(
                                                            "$.ProductTypeGroup", // Group on ProductTypeGroup object
                                                            "", // Select everything
                                                            "key, e => e", // Standard result selector
                                                            "$.ProductTypeGroupID" // Compare just on ProductTypeGroupID property of ProductTypeGroup object
                                                        ).ToArray();

        //console.log(groupedByProductTypeGroup);
        //console.log(groupedByProductTypeGroup[0].Key());

        for (var i in groupedByProductTypeGroup) {

            var productTypeGroup = groupedByProductTypeGroup[i];
            
            //console.log(productTypeGroup)

            productTypeGroup.source = Enumerable.From(productTypeGroup.source).OrderBy("$.Brand.SortOrder").ToArray();

            for (var j in productTypeGroup.source) {

                var tuple = productTypeGroup.source[j];

                //console.log(tuple);
                
                var fieldName = tuple.Brand.Name.replace(/ /g, '') + tuple.ProductTypeGroup.Name.replace(/ /g, '');

                // so the base observable needs to hold the tuple object AND the observable for Value

                var loadedTuple = null;
                var actualTupleSaleValue = null;

                if (_loadedData.length) {
                    loadedTuple = Enumerable.From(_loadedData).Where('$.BrandID == ' + tuple.BrandID + ' && $.ProductTypeGroupID == ' + tuple.ProductTypeGroupID).SingleOrDefault();
                }

                if (_actualSalesFigures.length) {
                    actualTupleSaleValue = Enumerable.From(_actualSalesFigures).Where('$.BrandID == ' + tuple.BrandID + ' && $.ProductTypeGroupID == ' + tuple.ProductTypeGroupID).Select("$.Value").SingleOrDefault();
                }

                tuple.actualSaleValue = ko.observable(actualTupleSaleValue ? actualTupleSaleValue : undefined);

                if (tuple.Available) {

                    tuple.PotentialID = ko.observable(loadedTuple ? loadedTuple.PotentialID : undefined);

                    tuple.Value = ko.observable(loadedTuple ? loadedTuple.Value : undefined).extend({
                        numberFormatted: {
                            digits: 0,
                            currency: self.currency,
                            maxValue: 900000000000000,
                            minValue: -900000000000000
                        }
                    });

                    tuple.Note = ko.observable(loadedTuple ? loadedTuple.Note : undefined);

                    tuple.Name = tuple.Brand.Name + ' - ' + tuple.ProductTypeGroup.Name;

                    tuple.FinancialYear = ko.observable(loadedTuple ? loadedTuple.FinancialYear : undefined);
                    
                    tuple.Potential = ko.observable(loadedTuple ? loadedTuple.Potential : true);

                    tuple.NoPotentialSince = ko.observable(loadedTuple ? loadedTuple.NoPotentialSince : undefined);
                    
                    // trying to decouple as far as possible
                    if (self.parent.hasOwnProperty('leadId'))
                        tuple.LeadID = self.parent.leadId();

                    tuple.displayLine = ko.pureComputed({
                        read: function () {
                            if (this.Value()) {
                                return this.Value.formatted();
                            } else {
                                if (this.Potential()) {
                                    return null;
                                } else {
                                    return 'No Potential'
                                }
                            }
                        }
                    }, tuple);

                    self.data.push(ko.observable(tuple));
                }
            }

            self.productTypeGroups.push({ productTypeGroup: productTypeGroup.Key(), data: productTypeGroup.source });
        }

        var groupedByBrand = Enumerable.From(Enumerable.From(_productGroupBrandMatrix).OrderBy("$.Brand.SortOrder").ToArray())
                                       .GroupBy(
                                       "$.Brand",
                                       "$.Brand",
                                       "key, e => key", // need the totals from observbles...
                                       "$.BrandID"
                                       ).ToArray();

        //console.log(groupedByBrand);

        self.brandGroups(groupedByBrand);

        /*
         * So how am I to get hold of the total potential for this brand from all these productTypeGroups...
         * I'll need to loop through ALL of the productTypeGroup's sources and if brand == my brand... pull observable value.
         * 
         */
    }

    self.getBrandTotalPotential = function (data) {
        var total = Enumerable.From(Enumerable.From(self.productTypeGroups()).Select("$.data").ToArray()).
            Select(function (x) {
                return Enumerable.From(x).Where(function (y) {
                    return (y.BrandID == data.BrandID) && (y.Available == true)
                }).Select(function (y) {
                    //if (!isNaN(y.actualSaleValue()))
                    //    return Number(y.actualSaleValue())
                    if (!isNaN(y.Value()))
                        return Number(y.Value())
                    else
                        return 0;
                }).Sum()
            }).Sum();
        return total;
    }

    self.getBrandTotalPotentialFormatted = function (data) {
        var result = self.getBrandTotalPotential(data);

        if (ko.unwrap(self.currency))
            return formatCurrency(result, 0, ko.unwrap(self.currency).FormattingCulture, ko.unwrap(self.currency).Code);
        else
            return formatNumber(result, 0, ko.unwrap(self.parent.gbpCurrency).FormattingCulture);
    }

    self.getBrandTotalPotentialGBPFormatted = function (data) {
        if (ko.unwrap(self.currency))
            return formatCurrency(fx.convert(self.getBrandTotalPotential(data), { from: ko.unwrap(self.currency).ISO_4217, to: ko.unwrap(self.parent.gbpCurrency).Code }),
            0, ko.unwrap(self.parent.gbpCurrency).FormattingCulture, ko.unwrap(self.parent.gbpCurrency).Code);
    }
    
    self.load = function (data, productTypeGroupMatrix, extantSalesFigures) {
        self.reset();
        self.init(data, productTypeGroupMatrix, extantSalesFigures);
    }

    self.reset = function () {
        self.brandGroups([]);
        self.productTypeGroups([]);
        self.editingLeadId(undefined);
        self.editingTradeAccountId(undefined);
        self.editingBrandId(undefined);
        self.editingProductTypeGroupId(undefined);
        self.editingPotentialId(undefined);
        self.editingPotentialName(undefined);
        self.editingValue(undefined);
        self.editingPotential(undefined);
        self.editingNote(undefined);
        self.editingFinancialYear(undefined);
        self.tupleValueHolder(undefined);
        self.tupleNoteHolder(undefined);
        self.tupleFinancialYearHolder(undefined);
        self.tuplePotentialHolder(undefined);
        self.tupleNoPotentialSinceHolder(undefined);
        self.data([]);
        self.tradeAdvertiserSchemes([]);
    }

    //self.toJSON = function () {
    //    var copy = ko.toJS(this);
    //    delete copy.parent;
    //    delete copy.productGroupBrandMatrix;
    //    delete copy.brandGroups;
    //    delete copy.productTypeGroups;
    //    delete copy.data;
    //    delete copy.editingErrors;
    //    return copy;
    //}

    self.editingLeadId = ko.observable();

    self.editingTradeAccountId = ko.observable();

    self.editingBrandId = ko.observable();

    self.editingProductTypeGroupId = ko.observable();

    self.editingCurrencyId = ko.pureComputed({
        read: function () {
            if (ko.unwrap(self.currency))
                return ko.unwrap(self.currency).CurrencyID;
            else
                return null;
        }
    }, self);

    self.editingPotentialId = ko.observable();

    self.editingPotentialName = ko.observable();

    self.editingValue = ko.observable().extend({
        numberFormatted: {
            digits: 0,
            currency: self.currency,
            maxValue: 900000000000000,
            minValue: -900000000000000
        }
    });

    self.editingValueGBP = ko.pureComputed({
        read: function () {
            if (self.editingValue()) {
                if (ko.unwrap(self.currency)) {
                    if (ko.unwrap(self.currency).Code != 'GBP') {
                        return fx.convert(self.editingValue(), { from: ko.unwrap(self.currency).ISO_4217, to: 'GBP' }).toFixed(0);
                    }
                }
            }
            return null;
        }
    }, self).extend({
        currencyFormatted: {
            digits: 0,
            currency: self.parent.gbpCurrency
        }
    });

    self.editingPotential = ko.observable();
    self.editingPotential.subscribe(function (newValue) {
        if (!newValue) {
            self.editingValue(undefined);
        }
    }, self);

    self.editingNote = ko.observable();

    self.editingFinancialYear = ko.observable().extend({
        required: {
            onlyIf: function () {
                return ko.unwrap(self.editingValue()) != null
            },
            message: 'Please specify a financial year.'
        }
    });

    self.editingErrors = ko.validation.group([
        self.editingFinancialYear
    ]);

    self.tupleValueHolder = ko.observable();
    self.tupleNoteHolder = ko.observable();
    self.tupleFinancialYearHolder = ko.observable();
    self.tuplePotentialHolder = ko.observable();
    self.tupleNoPotentialSinceHolder = ko.observable();
    self.tuplePotentialIDHolder = ko.observable();

    //self.editingErrors.subscribe(function (newValues) {
    //    console.log('editingErrors subscribe hit');
    //});
    
    self.loadPotentialForEdit = function (potential) {
        if (typeof self.parent.companyCurrency == 'function') {
            if (!self.parent.companyCurrency()) {
                self.parent.businessPotentialErrors.showAllMessages();
                $("#edit-lead-modal").scrollTop(0);
                return;
            }
        }
        
        self.editingLeadId(potential.LeadID);
        self.editingTradeAccountId(potential.TradeAccountID);
        self.editingBrandId(potential.BrandID);
        self.editingProductTypeGroupId(potential.ProductTypeGroupID);
        self.editingPotentialId(potential.PotentialID());
        self.editingPotentialName(potential.Name);
        self.editingValue(potential.Value());
        self.editingPotential(potential.Potential());
        self.editingNote(potential.Note());
        self.editingFinancialYear(potential.FinancialYear());

        self.tupleValueHolder(potential.Value);
        self.tupleNoteHolder(potential.Note);
        self.tupleFinancialYearHolder(potential.FinancialYear);
        self.tuplePotentialHolder(potential.Potential);
        self.tupleNoPotentialSinceHolder(potential.NoPotentialSince);
        self.tuplePotentialIDHolder(potential.PotentialID);

        self.editingErrors.showAllMessages(true);

        $("#potential-form-modal").modal('show'); // fine
    }

    self.init();

    self.saveLeadPotential = function () { // bad
        if (self.editingErrors().length > 0) {
            self.editingErrors.showAllMessages();
        } else {
            self.parent.leadSaveBusy(true);

            $.ajax({
                url: '/api/LeadsAPI/UpsertLeadPotential',
                type: 'POST',
                dataType: 'json',
                cache: false,
                data: {
                    editingLeadId: self.editingLeadId(),
                    editingBrandId: self.editingBrandId(),
                    editingProductTypeGroupId: self.editingProductTypeGroupId(),
                    editingCurrencyId: self.editingCurrencyId(),
                    editingPotentialId: self.editingPotentialId(),
                    editingFinancialYear: self.editingFinancialYear(),
                    editingPotential: self.editingPotential(),
                    editingNote: self.editingNote(),
                    editingValue: self.editingValue()
                },
                success: function (data) {
                    self.tupleValueHolder()(self.editingValue());
                    self.tupleNoteHolder()(self.editingNote());
                    self.tupleFinancialYearHolder()(self.editingFinancialYear());
                    self.tuplePotentialHolder()(self.editingPotential());
                    self.tupleNoPotentialSinceHolder()(data.NoPotentialSince);
                    self.tuplePotentialIDHolder()(data.LeadPotentialID);
                    self.parent.leadSaveBusy(false);
                    $("#potential-form-modal").modal('hide');
                },
                error: function (xhr, e, s) {
                    self.parent.leadSaveBusy(false);
                    //$.showError(xhr, e, s);
                }
            });
        }
    }

    self.saveTradeAccountPotential = function () {
        if (self.editingErrors().length > 0) {
            self.editingErrors.showAllMessages();
        } else {
            self.parent.potentialBusy(true);

            $.ajax({
                url: '/customers/enquiry/upsertTradeAccountPotential',
                type: 'POST',
                dataType: 'json',
                cache: false,
                data: {
                    tradeAccountId: self.parent.tradeAccountId(),
                    editingBrandId: self.editingBrandId(),
                    editingProductTypeGroupId: self.editingProductTypeGroupId(),
                    editingCurrencyId: self.editingCurrencyId(),
                    editingPotentialId: self.editingPotentialId(),
                    editingFinancialYear: self.editingFinancialYear(),
                    editingPotential: self.editingPotential(),
                    editingNote: self.editingNote(),
                    editingValue: self.editingValue()
                },
                success: function (data) {
                    self.tupleValueHolder()(self.editingValue());
                    self.tupleNoteHolder()(self.editingNote());
                    self.tupleFinancialYearHolder()(self.editingFinancialYear());
                    self.tuplePotentialHolder()(self.editingPotential());
                    self.tupleNoPotentialSinceHolder()(data.NoPotentialSince);
                    self.tuplePotentialIDHolder()(data.PotentialID);
                    self.parent.potentialBusy(false);
                    $("#potential-form-modal").modal('hide');
                },
                error: function (xhr, e, s) {
                    self.parent.potentialBusy(false);
                    //$.showError(xhr, e, s);
                }
            });
        }
    }
}