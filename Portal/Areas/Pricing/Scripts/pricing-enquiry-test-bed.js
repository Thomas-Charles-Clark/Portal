var testBedViewModel = function () {
    var self = this;

    self.searchTerm = ko.observable();

    self.brandIds = ko.observableArray([]);
    self.launchIds = ko.observableArray([]);
    self.seasonIds = ko.observableArray([]);
    self.productTypeIds = ko.observableArray([]);
    self.productTypeGroupIds = ko.observableArray([]);
    self.itemTypeIds = ko.observableArray([]);

    self.brandSlicer = ko.observable();
    self.launchSlicer = ko.observable();
    self.seasonSlicer = ko.observable();
    self.productTypeSlicer = ko.observable();
    self.productTypeGroupSlicer = ko.observable();
    self.itemTypeSlicer = ko.observable();

    self.brandSlicerParams = {
        log: true,
        deepLog: false,
        autoBind: true,
        name: 'Brand',
        valueField: 'BrandID',
        parameterName: 'BrandIDs',
        textField: 'Name',
        boundTo: self.brandSlicer,
        selectedIds: self.brandIds,
        endPoint: '/api/pricing/BrandSlicerEndpoint',
        selectOnlyItem: true,
        clearValue: [],
        placeholder: 'All',
        initialBindSkipSiblingRead: false
    };

    self.launchSlicerParams = {
        log: false,
        deepLog: false,
        autoBind: true,
        name: 'Launch',
        valueField: 'LaunchID',
        parameterName: 'LaunchIDs',
        textField: 'Name',
        boundTo: self.launchSlicer,
        selectedIds: self.launchIds,
        endPoint: '/api/pricing/LaunchSlicerEndpoint',
        selectOnlyItem: true,
        clearValue: [],
        placeholder: 'All',
        initialBindSkipSiblingRead: false
    };

    self.seasonSlicerParams = {
        log: false,
        deepLog: false,
        autoBind: true,
        name: 'Season',
        valueField: 'SeasonID',
        parameterName: 'SeasonIDs',
        textField: 'Name',
        boundTo: self.seasonSlicer,
        selectedIds: self.seasonIds,
        endPoint: '/api/pricing/SeasonSlicerEndpoint',
        selectOnlyItem: true,
        clearValue: [],
        placeholder: 'All',
        initialBindSkipSiblingRead: false
    };

    self.itemTypeSlicerParams = {
        log: false,
        deepLog: false,
        autoBind: true,
        name: 'Item Type',
        valueField: 'ItemTypeID',
        parameterName: 'ItemTypeIDs',
        textField: 'Name',
        boundTo: self.itemTypeSlicer,
        selectedIds: self.itemTypeIds,
        endPoint: '/api/pricing/ItemTypeSlicerEndpoint',
        selectOnlyItem: true,
        clearValue: [],
        placeholder: 'All',
        initialBindSkipSiblingRead: false
    }

    self.productTypeGroupSlicerParams = {
        log: false,
        deepLog: false,
        autoBind: true,
        name: 'Product Type Group',
        valueField: 'ProductTypeGroupID',
        parameterName: 'ProductTypeGroupIDs',
        textField: 'Name',
        boundTo: self.productTypeGroupSlicer,
        selectedIds: self.productTypeGroupIds,
        endPoint: '/api/pricing/ProductTypeGroupSlicerEndpoint',
        selectOnlyItem: true,
        clearValue: [],
        placeholder: 'All',
        initialBindSkipSiblingRead: false
    }

    self.productTypeSlicerParams = {
        log: false,
        deepLog: false,
        autoBind: true,
        name: 'Product Type',
        valueField: 'ProductTypeID',
        parameterName: 'ProductTypeIDs',
        textField: 'Name',
        boundTo: self.productTypeSlicer,
        selectedIds: self.productTypeIds,
        endPoint: '/api/pricing/ProductTypeSlicerEndpoint',
        selectOnlyItem: true,
        clearValue: [],
        placeholder: 'All',
        initialBindSkipSiblingRead: false
    }

    self.slicerCollection = [
        self.brandSlicerParams,
        self.launchSlicerParams,
        self.seasonSlicerParams
    ]

    self.secondSlicerCollection = [
        self.itemTypeSlicerParams,
        self.productTypeSlicerParams,
        self.productTypeGroupSlicerParams
    ]

    self.siblings = self.slicerCollection.concat(self.secondSlicerCollection);

    self.clearFilters = function () {
        ko.utils.arrayForEach(self.siblings, function (item) {
            item.boundTo().clearSelection();
        });
        self.searchTerm(undefined);
    }

    ko.utils.arrayForEach(self.siblings, function (s) {
        s.siblings = self.siblings;
    });

    self.skipFirst = false;

    self.previousValues = null;

    self.nonce = ko.observable();

    self.foo = ko.computed({
        read: function () {
            console.log('priceChecker foo is evaluating');

            var f = self.nonce();

            if (self.brandSlicer() &&
                self.productTypeSlicer() &&
                self.productTypeGroupSlicer() &&
                self.itemTypeSlicer() &&
                self.launchSlicer() &&
                self.seasonSlicer()) {
                var ids = [];

                self.siblings.forEach(function (p) {
                    ids.push({
                        name: p.valueField,
                        value: p.selectedIds()
                    });
                });

                ids.push({
                    name: 'searchTerm',
                    value: self.searchTerm()
                });

                // also skip if the IDs haven't changed...

                var unchangedSkip = false;

                if (self.previousValues) {
                    for (var property in self.previousValues) {
                        var p = self.previousValues[property];

                        var q = Enumerable.From(ids).Where(function (x) {
                            return x.name == p.name
                        }).SingleOrDefault();

                        if (q) {
                            if (JSON.stringify(p.value) == JSON.stringify(q.value)) {
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

                // always set previous
                self.previousValues = ids;

                console.log('priceChecker foo skipFirst: ' + self.skipFirst + ', unchangedSkip: ' + unchangedSkip);

                if (self.skipFirst || unchangedSkip) {
                    self.skipFirst = false;
                } else {
                    console.log('priceChecker foo returns', ids);
                    return ids;
                }
            }
        }
    }, self).extend({
        rateLimit: {
            method: 'notifyWhenChangesStop',
            timeout: 2000
        }
    });
}