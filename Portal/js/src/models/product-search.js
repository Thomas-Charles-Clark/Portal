var productSearch = function (autocompleteFunction, owner) {
    var self = this;

    if (typeof autocompleteFunction !== 'function') {
        console.error('productSearch demands autocompleteInitFn(context)');
    }

    self.searchTerm = ko.observable();

    self.searchBusy = ko.observable(false);

    self.haveSearched = ko.observable(false);

    self.searchResults = ko.observable([]);

    self.searchResultsGroupedThree = ko.pureComputed({
        read: function () {
            var data = self.searchResults();
            var times = Math.ceil(self.searchResults().length / 3);
            var result = [];
            for (var i = 0; i < times; i++) {
                result.push(data.slice(i * 3, i * 3 + 3));
            }
            return result;
        }
    }, self);

    self.showDiscontinued = ko.observable(getShowDiscontinued());

    self.clearSearch = function () {
        $("#product-search").val(null);
        $("#product-search").data("ui-autocomplete").term = null;
        $("#product-search").focus();
    }

    self.clearResults = function () {
        $("#product-search").val(null);
        $("#product-search").focus();
        //self.pageCount(0);
        //self.searchResultsTotalCount(0);
        self.searchResults([]);
        self.haveSearched(false);
        self.searchBusy(false);
        //ProductCode search results aren't paged
        //if ($('.product-code-pagination').data("twbs-pagination")) {
        //    $('.product-code-pagination').twbsPagination('destroy');
        //}
    }

    self.performSearch = function () {
        $("#product-search").autocomplete("search");
    }

    self.initAutocomplete = autocompleteFunction;

    self.initAutocomplete(self, owner);
}

var Product = function (product) {
    var self = this;

    // do these need to be observables? they aren't going to change. So no.
    self.ProductID = product.ProductID;
    self.ProductPageID = product.ProductPageID;
    self.Code = product.Code;
    self.ProductType = product.ProductType;
    self.Name = product.Name;
    self.ImageID = product.ImageID;
    self.Status = product.Status;
    self.FreeStock = product.FreeStock;
    self.StockStatus = product.StockStatus;
    self.RRP = product.RRP;

    if (self.FreeStock) {
        if (Number(self.FreeStock) < 10) {
            var unit = Number(self.FreeStock).toFixed(2) + 'm ';
            if (self.ProductType === "Wallpaper") {
                if (Number(self.FreeStock) == 1) {
                    unit = Number(self.FreeStock).toFixed(0) + ' roll ';
                } else {
                    unit = Number(self.FreeStock).toFixed(0) + ' rolls ';
                }
            }

            self.StockStatus = unit + self.StockStatus;
        }
    }

    self.StatusDisplay = function (status) {
        switch (status) {
            case 'C':
                return 'Current';
            case 'L':
                return 'Limited';
            case 'Y':
                return 'Limited';
            case 'D':
                return 'Discontinued';
            default:
                return null;
        }
    };

    self.buttonClass = function (status) {
        switch (status) {
            case 'C':
                return 'btn-success';
            case 'L':
                return 'btn-warning';
            case 'Y':
                return 'btn-warning';
            case 'D':
                return 'btn-danger';
            default:
                return null;
        }
    }

    self.toJSON = function () {
        var copy = ko.toJS(this); //easy way to get a clean copy

        delete copy.DisplayName;
        delete copy.StatusDisplay;
        delete copy.buttonClass;

        return copy;
    };
};