var orderSearch = function (variant, successFunction) {
    var self = this;

    self.searchBusy = ko.observable(false);

    self.searchTerm = ko.observable(undefined).extend({ notify: 'always' });

    self.searchTerm.subscribe(function (newValue) {
        self.performSearch();
    });

    self.haveSearched = ko.observable(false);

    self.onSearchKeyUp = function (parent, event) {
        var key = event.which ? event.which : event.keyCode;
        switch (key) {
            case 13:
                self.performSearch();
                break;
        }
    }

    self.searchResults = ko.observable([]);

    self.searchResultsTotalCount = ko.observable(0);

    self.selectedTradeAccountGroupId = ko.observable(getTradeAccountGroupId());

    self.selectedTradeAccountId = ko.observable(getTradeAccountId());

    self.pageNumber = ko.observable(1);

    self.pageSize = ko.observable(100);

    self.pageCount = ko.observable(0);

    self.fromDate = ko.observable(null);//ko.observable((Date.now() - 604800000).toString());

    self.toDate = ko.observable(null);//ko.observable(Date.now().toString());

    self.period = ko.observable("last-3-months");

    self.period.subscribe(function (newValue) {
        self.performSearch();
    });

    self.periodOptions = ko.observable(getPeriodOptions());

    self.productType = ko.observable();

    self.productType.subscribe(function (newValue) {
        self.performSearch();
    });

    self.availableProductTypes = ko.observable(getProductTypes());

    self.orderStatus = ko.observable(0); // 0 = all, 1 = completed orders, 2 = outstanding orders, 3 = held orders

    self.orderStatus.subscribe(function (newValue) {
        self.performSearch();
    });

    self.orderStatusOptions = ko.observable(getOrderStatusOptions());

    self.clearSearch = function () {
        self.searchTerm(undefined);
        $("#order-search").focus();
    }

    self.clearResults = function () {
        $("#order-search").val(null);
        $("#order-search").focus();
        self.pageCount(0);
        self.searchResultsTotalCount(0);
        self.searchResults([]);
        self.haveSearched(false);
        self.searchBusy(false);
        if ($('.order-search-pagination').data("twbs-pagination")) {
            $('.order-search-pagination').twbsPagination('destroy');
        }
    }

    // if you've changed the parameters of the search we need to drop you to page 1 (or no results)
    // if you've changed nothing but the page number we need to fetch that page

    self.lastSearchTerm = ko.observable(null);
    self.lastSearchTradeAccountGroupId = ko.observable(getTradeAccountGroupId());
    self.lastSearchTradeAccountId = ko.observable(getTradeAccountId());
    self.lastSearchFromDate = ko.observable(null);
    self.lastSearchToDate = ko.observable(null);
    self.lastSearchPeriod = ko.observable(null);
    self.lastSearchProductType = ko.observable(null);
    self.lastSearchOrderStatus = ko.observable(0);
    self.lastSearchPageNumber = ko.observable(1);
    self.lastSearchPageSize = ko.observable(100);

    self.displayFilters = ko.observable(true);

    self.displayFilters.subscribe(function (newValue) {
        if (newValue === true) {
            $("#order-search-collapse").collapse('show');
        }
        if (newValue === false) {
            $("#order-search-collapse").collapse('hide');
        }
    });

    //self.performSearch = function (termOverride) {
    //    if (self.searchTermsChanged()) {
    //        self.pageNumber(1);
    //    }
    //    if (!self.searchBusy()) {
    //        self.searchBusy(true);
    //        self.setLastSearch();
    //        $("#order-search").addClass('ui-autocomplete-loading');
    //        $.ajax({
    //            url: self.postURL(),
    //            type: "POST",
    //            dataType: "json",
    //            cache: false,
    //            data: {
    //                term: termOverride || self.searchTerm(),
    //                tradeAccountGroupId: self.selectedTradeAccountGroupId(),
    //                tradeAccountId: self.selectedTradeAccountId(),
    //                period: self.period(),
    //                from: self.fromDate() ? self.fromDate().toISOString() : null,
    //                to: self.toDate() ? self.toDate().toISOString() : null,
    //                productTypeId: self.productType(),
    //                languageId: 1,
    //                orderStatus: self.orderStatus(),
    //                pageNumber: self.pageNumber(),
    //                pageSize: self.pageSize()
    //            },
    //            success: function (data) {
    //                // necessary because we've overridden the select function to noop
    //                $("#order-search").removeClass('ui-autocomplete-loading');

    //                self.searchBusy(false);

    //                var results = [];

    //                if (typeof successFunction === "function") {
    //                    successFunction(data, results);
    //                } else {
    //                    if (data.SearchResults != null) {
    //                        var groupedOrders = Enumerable.From(data.SearchResults).GroupBy(function (x) { return x.OrderHeadID }).ToArray();
    //                        groupedOrders.forEach(function (o) {
    //                            results.push(new OrderHead(o));
    //                        });
    //                    }
    //                }

    //                self.pageCount(Math.ceil(data.TotalResultsCount / self.pageSize()));
    //                self.searchResultsTotalCount(data.TotalResultsCount);
    //                self.searchResults(results);

    //                if ($('.order-search-pagination').data("twbs-pagination")) {
    //                    $('.order-search-pagination').twbsPagination('destroy');
    //                }

    //                if (self.pageCount()) {
    //                    $('.order-search-pagination').twbsPagination({
    //                        startPage: self.pageNumber(),
    //                        totalPages: self.pageCount(),
    //                        visiblePages: (self.pageCount() > 6 ? 6 : self.pageCount()),
    //                        initiateStartPageClick: false,
    //                        onPageClick: function (event, page) {
    //                            self.page(page);
    //                        }
    //                    });
    //                } else {
    //                    $('.order-search-pagination').twbsPagination({
    //                        startPage: self.pageNumber(),
    //                        totalPages: 1,
    //                        visiblePages: 1,
    //                        initiateStartPageClick: false,
    //                        onPageClick: function (event, page) {
    //                            self.page(page);
    //                        }
    //                    });
    //                }

    //                self.haveSearched(true);
    //            },
    //            error: function (xhr, textStatus, errorThrown) {
    //                self.searchBusy(false);
    //                $("#order-search").removeClass('ui-autocomplete-loading');
    ////                $.showError(xhr, textStatus, errorThrown);
    //            }
    //        });
    //    }
    //}

    self.postURL = ko.pureComputed({
        read: function () {
            return "/Component/OrderEnquirySearch" + (variant || "")
        }
    }, self);

    self.getSearchURL = ko.pureComputed({
        read: function () {
            return "/api/OrderEnquiry/OrderSearch" + (variant || "")
        }
    }, self);

    self.page = function (page) {
        self.pageNumber(page);
        self.performSearch();
    }

    self.searchTermsChanged = function () {
        var result =
            (self.lastSearchTerm() != self.searchTerm()) ||
            (self.lastSearchTradeAccountGroupId() != self.selectedTradeAccountGroupId()) ||
            (self.lastSearchTradeAccountId() != self.selectedTradeAccountId()) ||
            (self.lastSearchFromDate() != self.fromDate()) ||
            (self.lastSearchToDate() != self.toDate()) ||
            (self.lastSearchPeriod() != self.period()) ||
            (self.lastSearchProductType() != self.productType()) ||
            (self.lastSearchOrderStatus() != self.orderStatus()) ||
            (self.lastSearchPageSize() != self.pageSize());

        return result;
    };

    self.setLastSearch = function () {
        self.lastSearchTerm(self.searchTerm());
        self.lastSearchTradeAccountGroupId(self.selectedTradeAccountGroupId());
        self.lastSearchTradeAccountId(self.selectedTradeAccountId());
        self.lastSearchFromDate(self.fromDate());
        self.lastSearchToDate(self.toDate());
        self.lastSearchPeriod(self.period());
        self.lastSearchProductType(self.productType());
        self.lastSearchOrderStatus(self.orderStatus());
        self.lastSearchPageSize(self.pageSize());
    };

    self.toggleFilters = function () {
        if (self.displayFilters()) {
            $("#order-search-collapse").collapse('hide');
        } else {
            $("#order-search-collapse").collapse('show');
        }
        self.displayFilters(!self.displayFilters());
    };

    self.resultGridWidget = ko.observable();

    self.orderHeadTemplate = function (rec) {
        console.log(rec);

        var orderLines = '<ul class="list-group list-group-flush">';

        for (var i = 0; i < rec.OrderLines.length; i++) {

            var line = rec.OrderLines[i];

            // this should display metres or rolls for fabric / wallpaper.
            var qty = Number(line.Quantity);

            switch (line.ProductType) {
                case 'Fabric':
                    qty = qty.toFixed(2) + 'm ' + line.ProductCode;
                case 'Wallpaper':
                    qty = qty.toFixed(0) + ' roll' + (qty == 1 ? '' : 's') + ' ' + line.ProductCode;
                default:
                    qty = line.ProductCode + '&nbsp;&times;&nbsp;' + line.Quantity;
            }

            var img = '<img class="thumb" src="/Areas/Products/content/images/not-found.png" />';

            if (line.ImageID) {
                img = '<img class="thumb" src="https://www.designersguild.com/image/32/' + line.ImageID + '" onclick="viewModel.orderSearch().loadLargeImage(\'' + line.ImageID + '\', \'' + line.ProductCode + '\')"/>';
            }

            orderLines += '<li class="list-group-item">' +
                img +
                '<span class="desc">' + line.Description + '</span>' +

                '<span class="code">' + qty + '</span>' +
                '<span class="clearfix"></span>' +
                '<a class="break-all tracking-url" target="_blank" href="javascript:;">Delivery Tracking</a>' +

                '<span class="status" data-bind="text: $data.OrderStatus">' + line.OrderStatus + '</span>' +

                '<span class="clearfix"></span>' +
                '</li>';
        }

        orderLines += '</ul>';

        return '<div class="order-result card">' +
            '<div class="panel panel-default">' +
            '<div class="panel-heading">' +
            '<h4>Order: ' + rec.OrderHeadID + '</h4>' +
            '<span>' + moment(new Date(rec.OrderDate)).format("DD/MM/YYYY") + '</span>' +
            '</div>' +
            '<div class="panel-body">' +
            '<div class="row">' +
            '<div class="col-xs-12">' +
            '<label class="col-form-label">Name</label>' +
            '<span class="value-display">' + rec.FullName + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-xs-12">' +
            '<label class="col-form-label">Address</label>' +
            '<a class="break-all value-display" onclick="viewModel.orderSearch().loadAddress(' + rec.OrderHeadID + ', \'' + rec.OrderDate + '\', \'' + rec.FullName + '\', \'' + rec.AddressLine1 + '\', \'' + rec.AddressLine2 + '\', \'' + rec.Town + '\', \'' + rec.County + '\', \'' + rec.Postcode + '\', \'' + rec.Country + '\')" href="javascript:;">' + rec.Postcode + '</a>' +
            '</div>' +
            '</div>' +
            (rec.CustomerOrderReference ?
                '<!-- ko if: $data.orderLines[0].CustomerOrderReference -->' +
                '<div class="row">' +
                '<div class="col-xs-12">' +
                '<label class="col-form-label">Reference</label>' +
                '<span class="value-display">' + rec.CustomerOrderReference + '</span>' +
                '</div>' +
                '</div>'
                : '') +
            (rec.PhoneNumber ?
                '<div class="row">' +
                '<div class="col-xs-12">' +
                '<label class="col-form-label">Telephone</label>' +
                '<a class="break-all value-display" href=\'tel:' + rec.PhoneNumber + '\'>' + rec.PhoneNumber + '</a>' +
                '</div>' +
                '</div>'
                : '') +
            '<div class="row">' +
            '<div class="col-xs-12">' +
            '<label class="hidden-xs col-form-label">Email</label>' +
            '<a class="break-all value-display email" href="mailto:' + rec.Email + '">' + rec.Email + '</a>' +
            '</div>' +
            '</div>' +
            orderLines +
            '</div>' +
            '</div>' +
            '</div>';
    }

    self.resultGridColumns = [
        {
            field: 'OrderHeadID',
            title: 'Order ID',
            template: self.orderHeadTemplate
        }
    ];

    self.resultGridDataSourceData = function () {
        return {
            //TradeAccountID: self.tradeAccountSelector.selected().TradeAccountID,
            //ProductTypeGroupID: self.productSearchProductTypeGroupID() || null,
            //SearchTerm: self.productSearchFreeTextSearch() || null,
            //ProductTypeID: self.productSearchProductTypeID() || null,
            //BrandID: self.productSearchBrandID() || null,
            //CollectionID: self.productSearchCollectionID() || null,
            //QualityID: self.productSearchQualityID() || null,
            //ProductID: self.productSearchProductID() || null,
            //CodeLike: self.productSearchCodeLike() || null,
            //CodeNotLike: self.productSearchCodeNotLike() || null,
            //ProductRangeFilter: self.productRangeSearchMode() || null,
            //Seasonal: self.productSearchSeasonal() || null
        };
    };

    self.resultGridDataSourceRead = function (options) {
        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);
        var data = {
            term: self.searchTerm(),
            tradeAccountGroupId: self.selectedTradeAccountGroupId(),
            tradeAccountId: self.selectedTradeAccountId(),
            period: self.period(),
            from: self.fromDate() ? self.fromDate().toISOString() : null,
            to: self.toDate() ? self.toDate().toISOString() : null,
            productTypeId: self.productType(),
            languageId: 1,
            orderStatus: self.orderStatus(),
            pageNumber: self.pageNumber(),
            pageSize: self.pageSize()
        }
        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        $.ajax({
            url: self.getSearchURL(),
            type: "GET",
            data: data,
            success: function (data) {
                options.success(data);
                $("#order-search-grid .k-grid-content tbody tr").each(function (idx, ele) {
                    //ko.applyBindings(viewModel, ele);
                });
            },
            error: function (data) {
                console.log(data);
                options.error();
                //$.showError(data, 'Error', null);
            }
        });
    };

    self.resultGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.resultGridDataSourceRead
        },
        pageSize: 20,
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "Aggregates"
        }),
        sort: { field: "OrderHeadID", dir: "desc" },
        requestStart: function (e) {
            $("#grid-loading").show();
        },
        requestEnd: function (e) {
            console.log(e);
            $("#grid-loading").hide();
        }
    });

    self.resultGridSettings = {
        autoBind: false,
        widget: self.resultGridWidget,
        columns: self.resultGridColumns,
        data: self.resultGridDataSource,
        sortable: true,
        filterable: true,
        reorderable: true,
        grouping: false,
        serverGrouping: false,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 200]
        },
        dataBound: function (e) {

        },
        filterMenuInit: function (e) {
            console.log(e);
            if (e.field == "Status") {
                e.container.find(".k-filter-help-text").hide();
                var firstValueDropDown = e.container.find("select:eq(0)").data("kendoDropDownList");
                setTimeout(function () {
                    firstValueDropDown.wrapper.hide();
                });
            }
        }
    };

    // this turns out to be necessary to prevent the search firing on first evaluation of the computed
    self.searchBlocker = true;

    self.performSearch = function () {
        self.resultGridWidget().dataSource.read();
    }

    self.loadAddress = function (orderHeadId, orderDate, fullName, addressLine1, addressLine2, town, county, postcode, country) {
        $('#address-container').empty();
        $('#address-title').text('Order: ' + orderHeadId);
        $('#address-sub-title').empty();
        $('#address-sub-title').text(moment(new Date(orderDate)).format("DD/MM/YYYY"));
        var address = $("<p></p>");
        if (fullName)
            address.append("<span>" + fullName + "</span><br/>");
        if (addressLine1)
            address.append("<span>" + addressLine1 + "</span><br/>");
        if (addressLine2)
            address.append("<span>" + addressLine2 + "</span><br/>");
        if (town)
            address.append("<span>" + town + "</span><br/>");
        if (county)
            address.append("<span>" + county + "</span><br/>");
        if (postcode)
            address.append("<span>" + postcode + "</span><br/>");
        if (country)
            address.append("<span>" + country + "</span>");
        $('#address-container').append(address);
        $("#address-modal").modal('show');
    }

    self.loadLargeImage = function (imageId, productCode) {
        if (imageId != null) {
            $('#large-image-container').empty();
            var url = 'https://www.designersguild.com/image/488/' + imageId;
            $('#large-image-container').html('<img src="' + url + '"/>');

            $('#large-image-title').text(productCode);

            $("#image-modal").modal('show');
        } else {
            $('#large-image-container').html('');
            $('#large-image-container').html('<img src="/Areas/Products/content/images/not-found-large.png"/>');
            $('#large-image-title').text(productCode);
            $("#image-modal").modal('show');
        }
    }
}

var OrderHead = function (o) {
    var self = this;

    self.orderHeadId = o.Key();

    self.orderLines = o.source;

    self.orderHeading = ko.computed({
        read: function () {
            var orderRef = null;
            if (self.orderLines.length) {
                orderRef = self.orderLines[0].CustomerOrderReference ? self.orderLines[0].CustomerOrderReference.trim() : null;
            }
            return 'Order: ' + self.orderHeadId
        }
    }, self);

    self.orderDate = ko.computed({
        read: function () {
            var orderDate = "";
            if (self.orderLines.length) {
                orderDate = self.orderLines[0].OrderDate ? moment(new Date(parseFloat(self.orderLines[0].OrderDate.replace(/[^0-9]/g, '')))).format("DD/MM/YYYY") : null;
            }
            return orderDate;
        }
    }, self);

    self.loadAddress = function (line) {
        $('#address-container').empty();
        $('#address-title').text(self.orderHeading());
        $('#address-sub-title').empty();
        $('#address-sub-title').text(self.orderDate());
        var address = $("<p></p>");
        if (line.FullName)
            address.append("<span>" + line.FullName + "</span><br/>");
        if (line.AddressLine1)
            address.append("<span>" + line.AddressLine1 + "</span><br/>");
        if (line.AddressLine2)
            address.append("<span>" + line.AddressLine2 + "</span><br/>");
        if (line.Town)
            address.append("<span>" + line.Town + "</span><br/>");
        if (line.County)
            address.append("<span>" + line.County + "</span><br/>");
        if (line.Postcode)
            address.append("<span>" + line.Postcode + "</span><br/>");
        if (line.Country)
            address.append("<span>" + line.Country + "</span>");
        $('#address-container').append(address);
        $("#address-modal").modal('show');
    }

    self.loadLargeImage = function (line) {
        if (line.ImageID != null) {
            $('#large-image-container').empty();
            var url = 'https://www.designersguild.com/image/488/' + line.ImageID;
            $('#large-image-container').html('<img src="' + url + '"/>');

            $('#large-image-title').text(line.ProductCode);

            $("#image-modal").modal('show');
        } else {
            $('#large-image-container').html('');
            $('#large-image-container').html('<img src="/Areas/Products/content/images/not-found-large.png"/>');
            $('#large-image-title').text(line.ProductCode);
            $("#image-modal").modal('show');
        }
    }

    self.quantityDisplay = function (line) {
        // this should display metres or rolls for fabric / wallpaper.
        var qty = Number(line.Quantity);
        switch (line.ProductType) {
            case 'Fabric':
                return qty.toFixed(2) + 'm ' + line.ProductCode;
            case 'Wallpaper':
                return qty.toFixed(0) + ' roll' + (qty == 1 ? '' : 's') + ' ' + line.ProductCode;
            default:
                return line.ProductCode + '&times; ' + line.Quantity;
        }
    }
}