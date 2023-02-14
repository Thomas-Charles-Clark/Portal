function testBedViewModel() {
    var self = this;

    self.rrpSlicer = ko.observable();
    self.stockStatusSlicer = ko.observable();
    self.itemTypeSlicer = ko.observable();
    self.productGroupSlicer = ko.observable();
    self.brandSlicer = ko.observable();
    self.colourSlicer = ko.observable();
    self.patternSlicer = ko.observable();

    self.rrpSlicerParams = {
        name: 'RRP Price',
        valueField: 'PricePointID',
        nameField: 'Name',
        boundTo: self.rrpSlicer,
        multiplicity: 'single',
        endPoint: '/api/samplerequestapi/RRPSlicerEndpoint'
    };

    self.stockStatusSlicerParams = {
        name: 'Stock',
        valueField: 'StockStatusID',
        nameField: 'Name',
        boundTo: self.stockStatusSlicer,
        multiplicity: 'multiple',
        endPoint: '/api/samplerequestapi/StockStatusSlicerEndpoint'
    };

    self.itemTypeSlicerParams = {
        name: 'Item Type',
        valueField: 'ItemTypeID',
        nameField: 'Name',
        boundTo: self.itemTypeSlicer,
        multiplicity: 'multiple',
        endPoint: '/api/samplerequestapi/ItemTypeSlicerEndpoint'
    };

    self.productGroupSlicerParams = {
        name: 'Product Group',
        valueField: 'ProductGroupID',
        nameField: 'Code',
        boundTo: self.productGroupSlicer,
        multiplicity: 'multiple',
        endPoint: '/api/samplerequestapi/ProductGroupSlicerEndpoint'
    };

    self.brandSlicerParams = {
        name: 'Brand',
        valueField: 'BrandID',
        nameField: 'Name',
        boundTo: self.brandSlicer,
        multiplicity: 'multiple',
        endPoint: '/api/samplerequestapi/BrandSlicerEndpoint'
    };

    self.colourSlicerParams = {
        name: 'Colour',
        valueField: 'ColourID',
        nameField: 'Name',
        boundTo: self.colourSlicer,
        multiplicity: 'multiple',
        endPoint: '/api/samplerequestapi/ColourSlicerEndpoint'
    };

    self.patternSlicerParams = {
        name: 'Pattern',
        valueField: 'PatternID',
        nameField: 'Name',
        boundTo: self.patternSlicer,
        multiplicity: 'multiple',
        endPoint: '/api/samplerequestapi/PatternSlicerEndpoint'
    };

    self.slicerCollection = [
        self.rrpSlicerParams,
        self.stockStatusSlicerParams,
        self.itemTypeSlicerParams,
        self.productGroupSlicerParams,
        self.brandSlicerParams,
        self.colourSlicerParams,
        self.patternSlicerParams
    ];

    self.rrpSlicerParams.slicerCollection = self.slicerCollection;
    self.stockStatusSlicerParams.slicerCollection = self.slicerCollection;
    self.itemTypeSlicerParams.slicerCollection = self.slicerCollection;
    self.productGroupSlicerParams.slicerCollection = self.slicerCollection;
    self.brandSlicerParams.slicerCollection = self.slicerCollection;
    self.colourSlicerParams.slicerCollection = self.slicerCollection;
    self.patternSlicerParams.slicerCollection = self.slicerCollection;

    self.foo = ko.computed({
        read: function () {
            if (self.rrpSlicer() &&
                self.stockStatusSlicer() &&
                self.itemTypeSlicer() &&
                self.productGroupSlicer() &&
                self.brandSlicer() &&
                self.colourSlicer() &&
                self.patternSlicer())
            {
                var ids = [];
                self.slicerCollection.forEach(function (p) {
                    ids.push({
                        name: p.boundTo().name,
                        selectedIds: p.boundTo().selectedIds()
                    });
                });

                console.log('foo was evaluated and found', ids);
            }
            else {
                console.log('foo was evaluated but the slicers were not ready');
            }
        }
    }, self).extend({
        rateLimit: {
            method: 'notifyWhenChangesStop',
            timeout: 500
        }
    });
}