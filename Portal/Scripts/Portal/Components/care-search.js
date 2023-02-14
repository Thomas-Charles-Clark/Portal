var careSearch = function () {
    var self = this;

    self.searchBusy = ko.observable(false);

    self.searchTerm = ko.observable(null).extend({ notify: 'always' });

    self.searchTerm.subscribe(function (newValue) {
        self.performSearch();
    });

    self.selectedTradeAccountGroupId = ko.observable(getTradeAccountGroupId());

    self.selectedTradeAccountId = ko.observable(getTradeAccountId());

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

    self.pageNumber = ko.observable(1);

    self.pageSize = ko.observable(100);

    self.pageCount = ko.observable(0);

    self.fromDate = ko.observable(null);//ko.observable((Date.now() - 604800000).toString());

    self.toDate = ko.observable(null);//ko.observable(Date.now().toString());

    self.period = ko.observable("last-3-months");

    self.careRecordStatus = ko.observable(0); // 0 = all, 1 = completed orders, 2 = outstanding orders, 3 = held orders

    self.careRecordStatusOptions = ko.observable(getCareRecordStatusOptions());

    self.periodOptions = ko.observable(getPeriodOptions());
    
    self.productType = ko.observable(null);

    self.availableProductTypes = ko.observable(getProductTypes());

    self.lastSearchTerm = ko.observable(null);
    self.lastSearchTradeAccountGroupId = ko.observable(getTradeAccountGroupId());
    self.lastSearchTradeAccountId = ko.observable(getTradeAccountId());
    self.lastSearchFromDate = ko.observable(null);
    self.lastSearchToDate = ko.observable(null);
    self.lastSearchPeriod = ko.observable(null);
    self.lastSearchCareRecordStatus = ko.observable(0);
    self.lastSearchPageNumber = ko.observable(1);
    self.lastSearchPageSize = ko.observable(100);
    self.lastSearchProductType = ko.observable(null);

    self.displayFilters = ko.observable(true);

    self.displayFilters.subscribe(function (newValue) {
        if (newValue === true) {
            $("#care-search-collapse").collapse('show');
        }
        if (newValue === false) {
            $("#care-search-collapse").collapse('hide');
        }
    });

    self.clearSearch = function () {
        self.searchTerm(null);
        $("#care-search").focus();
    }

    self.clearResults = function () {
        $("#care-search").val(null);
        $("#care-search").focus();
        self.pageCount(0);
        self.searchResultsTotalCount(0);
        self.searchResults([]);
        self.haveSearched(false);
        self.searchBusy(false);
        if ($('.care-search-pagination').data("twbs-pagination")) {
            $('.care-search-pagination').twbsPagination('destroy');
        }
    }

    self.performSearch = function (termOverride) {
        if (self.searchTermsChanged()) {
            self.pageNumber(1);
        }
        if (!self.searchBusy()) {
            self.searchBusy(true);
            self.setLastSearch();
            $("#care-search").addClass('ui-autocomplete-loading');

            var data = {
                term: termOverride || self.searchTerm(),
                tradeAccountId: self.selectedTradeAccountId(),
                tradeAccountGroupId: self.selectedTradeAccountGroupId(),
                languageId: 1,
                careStatusId: self.careRecordStatus(),
                pageNumber: self.pageNumber(),
                pageSize: self.pageSize(),
                period: self.period(),
                from: self.fromDate() ? self.fromDate().toISOString() : null,
                to: self.toDate() ? self.toDate().toISOString() : null,
                productTypeId: self.productType()
            };

            console.log('careSearch calling with', data);

            $.ajax({
                url: '/Component/CareSearch',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {

                    var results = [];

                    var grouped = Enumerable.From(data.Results).GroupBy(function (x) {
                        return x.CareHeadID;
                    }).ToArray();

                    for (var care in grouped) {
                        results.push(new careHead(grouped[care]));
                    }

                    self.pageCount(Math.ceil(data.TotalResultsCount / self.pageSize()));
                    self.searchResultsTotalCount(data.TotalResultsCount);
                    self.searchResults(results);

                    if ($('.care-search-pagination').data("twbs-pagination")) {
                        $('.care-search-pagination').twbsPagination('destroy');
                    }

                    if (self.pageCount()) {
                        $('.care-search-pagination').twbsPagination({
                            startPage: self.pageNumber(),
                            totalPages: self.pageCount(),
                            visiblePages: (self.pageCount() > 6 ? 6 : self.pageCount()),
                            initiateStartPageClick: false,
                            onPageClick: function (event, page) {
                                self.page(page);
                            }
                        });
                    } else {
                        $('.care-search-pagination').twbsPagination({
                            startPage: self.pageNumber(),
                            totalPages: 1,
                            visiblePages: 1,
                            initiateStartPageClick: false,
                            onPageClick: function (event, page) {
                                self.page(page);
                            }
                        });
                    }

                    self.haveSearched(true);

                    self.searchBusy(false);

                    $("#care-search").removeClass('ui-autocomplete-loading');
                },
                error: function (xhr, textStatus, errorThrown) {
                    $("#care-search").removeClass('ui-autocomplete-loading');
                    self.searchBusy(false);
                    //$.showError(xhr, textStatus, errorThrown);
                }
            });
        }
    }

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
            (self.lastSearchCareRecordStatus() != self.careRecordStatus()) ||
            (self.lastSearchPageSize() != self.pageSize()) ||
            (self.lastSearchProductType() != self.productType());

        return result;
    };

    self.setLastSearch = function () {
        self.lastSearchTerm(self.searchTerm());
        self.lastSearchTradeAccountGroupId(self.selectedTradeAccountGroupId());
        self.lastSearchTradeAccountId(self.selectedTradeAccountId());
        self.lastSearchFromDate(self.fromDate());
        self.lastSearchToDate(self.toDate());
        self.lastSearchPeriod(self.period());
        self.lastSearchCareRecordStatus(self.careRecordStatus());
        self.lastSearchPageSize(self.pageSize());
        self.lastSearchProductType(self.productType());
    };

    self.toggleFilters = function () {
        if (self.displayFilters()) {
            $("#care-search-collapse").collapse('hide');
        } else {
            $("#care-search-collapse").collapse('show');
        }
        self.displayFilters(!self.displayFilters());
    };
}

var careHead = function (details) {
    var self = this;

    self.careHeadId = details.Key();

    self.careLines = [];

    self.orderHeadId = null;
    self.orderHeadId = null;
    self.createdDt = null;
    self.careStatusGroupId = null;
    self.creditNumber = null;
    self.creditDate = null;
    self.creditValue = null;
    self.invoiceNumber = null;
    self.productCodes = null;

    var productCodes = [];

    for (var l in details.source) {
        productCodes.push(details.source[l].ProductCode);
        self.careLines.push(new careLine(details.source[l]));
    }

    self.productCodes = productCodes.join(' ');

    var headDetails = self.careLines[0];


    // because you pull head details from any line; they are shared by lines.
    if (headDetails) {
        self.orderHeadId = headDetails.orderHeadId;
        self.createdDt = headDetails.createdDt;
        self.careStatusGroupId = headDetails.careStatusGroupId;
        self.creditNumber = headDetails.creditNumber;
        self.invoiceNumber = headDetails.invoiceNumber;
        self.creditDate = headDetails.creditDate;
        self.creditValue = headDetails.creditValue;
    }

    self.careHeading = ko.pureComputed({
        read: function () {
            var result = "CCR No. " + self.careHeadId;
            if (self.orderHeadId) {
                result += "<br/>Order No. " + self.orderHeadId;
            }
            return result;
        }
    }, self);

    self.createdDtText = ko.pureComputed({
        read: function () {
            if (self.createdDt) {
                return renderDate(self.createdDt);
            } else {
                return "<span class='text-muted'>Not found</span>";
            }
        }
    });

    self.completedDisplay = ko.pureComputed({
        read: function () {
            if (self.completed == true) {
                return "Yes";
            } else if (self.completed == false) {
                return "No";
            } else {
                return "No";
            }
        }
    }, self);

    self.resultCareCodeDisplay = ko.pureComputed({
        read: function () {
            if (self.resultCareCode) {
                return self.resultCareCode;
            } else {
                return "<span class='text-muted'>N/A</span>";
            }
        }
    }, self);


    self.loadLargeImage = function (result) {
        if (result.imageId != null) {
            $('#large-image-container').empty();
            var url = 'https://www.designersguild.com/image/488/' + result.imageId;
            $('#large-image-container').html('<img src="' + url + '"/>');
            if (result.productCode != null) {
                $('#large-image-title').text(result.productCode);
            } else {
                $('#large-image-title').text('Product Code not found');
            }
            $("#image-modal").modal('show');
        } else {
            $('#large-image-container').html('');
            $('#large-image-container').html('<img src="/Areas/Products/content/images/not-found-large.png"/>');
            $('#large-image-title').text(result.Code);
            $("#image-modal").modal('show');
        }
    };
}

var careLine = function (details) {
    var self = this;

    self.careHeadId = details.CareHeadID;
    self.careLineNo = details.CareLineNo;
    self.careStatusGroupId = details.CareStatusGroupID;
    self.careStatusGroupName = details.CareStatusGroupName;
    self.claimQuantity = details.ClaimQuantity;
    self.createdDt = details.CreatedDT;
    self.creditDate = details.CreditDate;
    self.creditNumber = details.CreditNumber;
    self.creditValue = details.CreditValue;
    self.imageId = details.ImageID;
    self.invoiceNumber = details.InvoiceNumber;
    self.notes = details.Notes;
    self.orderHeadId = details.OrderHeadID;
    self.productCode = details.ProductCode;
    self.productName = details.ProductName;

    self.claimQuantityDisplay = ko.pureComputed({
        read: function () {
            if (self.claimQuantity) {
                if (self.productTypeId) {
                    switch (self.productTypeId) {
                        case 15:
                            return Number(self.claimQuantity).toFixed(2) + "m";
                        case 18:
                            return Number(self.claimQuantity).toFixed(0) + " roll" + (self.claimQuantity > 1 ? 's' : '');
                        default:
                            return Number(self.claimQuantity).toFixed(0);
                    }
                } else {
                    return Number(self.claimQuantity).toFixed(0);
                }
            } else {
                return "<span class='text-muted'>N/A</span>";
            }
        }
    });

    self.returnedQuantityDisplay = ko.pureComputed({
        read: function () {
            if (self.returnedQuantity) {
                if (self.productTypeId) {
                    switch (self.productTypeId) {
                        case 15:
                            return Number(self.returnedQuantity).toFixed(2) + "m";
                        case 18:
                            return Number(self.returnedQuantity).toFixed(0) + " roll" + (self.returnedQuantity > 1 ? 's' : '');
                        default:
                            return Number(self.returnedQuantity).toFixed(0);
                    }
                } else {
                    return Number(self.returnedQuantity).toFixed(0);
                }
            } else {
                return "<span class='text-muted'>N/A</span>";
            }
        }
    });

    self.acceptedQuantityDisplay = ko.pureComputed({
        read: function () {
            if (self.acceptedQuantity) {
                if (self.productTypeId) {
                    switch (self.productTypeId) {
                        case 15:
                            return Number(self.acceptedQuantity).toFixed(2) + "m";
                        case 18:
                            return Number(self.acceptedQuantity).toFixed(0) + " roll" + (self.acceptedQuantity > 1 ? 's' : '');
                        default:
                            return Number(self.acceptedQuantity).toFixed(0);
                    }
                } else {
                    return Number(self.acceptedQuantity).toFixed(0);
                }
            } else {
                return "<span class='text-muted'>N/A</span>";
            }
        }
    });

    self.returnedToStockDisplay = ko.pureComputed({
        read: function () {
            if (self.returnedToStock == true) {
                return "Yes";
            } else if (self.returnedToStock == false) {
                return "No";
            } else {
                return "No";
            }
        }
    }, self);

    self.faultCodeDisplay = ko.pureComputed({
        read: function () {
            if (self.faultCode) {
                return self.faultCode;
            } else {
                return "<span class='text-muted'>N/A</span>";
            }
        }
    }, self);
}