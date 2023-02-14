const productCategoriesViewModel = ({} = {}) => (
function () {
    var self = {};

    self.busy = ko.observable(false);

    self.itemTypeFilter = ko.observable();

    self.itemTypeParams = {
        label: 'Search by Code or Description',
        observable: self.itemTypeFilter,
        showClear: true,
        permitRevert: false,
        clearFunction: function () {
            var self = this;
            this.observable(undefined);
        }
    }

    self.productGroupFilter = ko.observable();

    self.productGroupParams = {
        label: 'Search by Code or Description',
        observable: self.productGroupFilter,
        showClear: true,
        permitRevert: false,
        clearFunction: function () {
            this.observable(undefined);
        }
    }

    self.productTypeFilter = ko.observable();

    self.productTypeParams = {
        label: 'Search by Item Type Code, Product Group Code or Product Type Name',
        observable: self.productTypeFilter,
        showClear: true,
        permitRevert: false,
        clearFunction: function () {
            this.observable(undefined);
        }
    }

    self.itemTypes = ko.observableArray(getItemTypes());

    self.productGroups = ko.observableArray(getProductGroups());

    self.productTypeMappings = ko.observableArray(getProductTypeMappings());

    self.itemTypeDisplay = ko.pureComputed(function () {
        if (self.itemTypeFilter()) {
            return Enumerable.From(self.itemTypes()).Where(function (x) {
                return x.Code != '' && ((x.Code.indexOf(self.itemTypeFilter()) == 0) || (x.Description.indexOf(self.itemTypeFilter()) > -1))
            }).OrderBy(function (x) {
                return x.Code
            }).ToArray();
        } else {
            return Enumerable.From(self.itemTypes()).Where(function (x) {
                return x.Code != ''
            }).OrderBy(function (x) {
                return x.Code
            }).ToArray();
        }
    }, self);

    self.productGroupDisplay = ko.pureComputed(function () {
        if (self.productGroupFilter()) {
            return Enumerable.From(self.productGroups()).Where(function (x) {
                return x.Code != '' && ((x.Code.indexOf(self.productGroupFilter()) == 0) || (x.Description.indexOf(self.productGroupFilter()) > -1))
            }).OrderBy(function (x) {
                return x.Code
            }).ToArray();
        } else {
            return Enumerable.From(self.productGroups()).Where(function (x) {
                return x.Code != ''
            }).OrderBy(function (x) {
                return x.Code
            }).ToArray();
        }
    }, self);

    self.productTypeDisplay = ko.pureComputed(function () {
        if (self.productTypeFilter()) {
            return Enumerable.From(self.productTypeMappings()).Where(function (x) {
                return (x.ProductGroup != null) && ((x.ItemTypeCode.indexOf(self.productTypeFilter()) == 0) || (x.ProductGroupCode.indexOf(self.productTypeFilter()) == 0) || (x.ProductType.Name.indexOf(self.productTypeFilter()) > -1))
            }).OrderBy(function (x) {
                return x.Code
            }).ToArray();
        } else {
            return Enumerable.From(self.productTypeMappings()).Where(function (x) {
                return x.ProductGroup != null 
            }).OrderBy(function (x) {
                return x.ProductGroupCode
            }).ThenBy(function (x) {
                return x.ItemTypeCode
            }).ToArray();
        }
    }, self);

    return self;
})
();