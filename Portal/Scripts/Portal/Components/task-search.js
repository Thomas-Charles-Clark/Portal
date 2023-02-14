var taskSearch = function () {
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

    self.taskSearchStatus = ko.observable(0); // 0 = all, 1 = completed orders, 2 = outstanding orders, 3 = held orders

    self.taskSearchStatusOptions = ko.observable(getTaskSearchStatusOptions());

    self.periodOptions = ko.observable(getPeriodOptions());

    self.lastSearchTerm = ko.observable(null);
    self.lastSearchTradeAccountGroupId = ko.observable(getTradeAccountGroupId());
    self.lastSearchTradeAccountId = ko.observable(getTradeAccountId());
    self.lastSearchFromDate = ko.observable(null);
    self.lastSearchToDate = ko.observable(null);
    self.lastSearchPeriod = ko.observable(null);
    self.lastSearchTaskSearchStatus = ko.observable(0);
    self.lastSearchPageNumber = ko.observable(1);
    self.lastSearchPageSize = ko.observable(100);

    self.displayFilters = ko.observable(true);

    self.displayFilters.subscribe(function (newValue) {
        if (newValue === true) {
            $("#task-search-collapse").collapse('show');
        }
        if (newValue === false) {
            $("#task-search-collapse").collapse('hide');
        }
    });

    self.clearSearch = function () {
        self.searchTerm(null);
        $("#task-search").focus();
    }

    self.clearResults = function () {
        $("#task-search").val(null);
        $("#task-search").focus();
        self.pageCount(0);
        self.searchResultsTotalCount(0);
        self.searchResults([]);
        self.haveSearched(false);
        self.searchBusy(false);
        if ($('.task-search-pagination').data("twbs-pagination")) {
            $('.task-search-pagination').twbsPagination('destroy');
        }
    }

    self.performSearch = function (termOverride) {
        if (self.searchTermsChanged()) {
            self.pageNumber(1);
        }
        if (!self.searchBusy()) {
            self.searchBusy(true);
            self.setLastSearch();
            $("#task-search").addClass('ui-autocomplete-loading');

            window.setTimeout(function () {
                $("#task-search").removeClass('ui-autocomplete-loading');
                self.searchBusy(false);

                var data = {};

                data.TotalResultsCount = 3;

                var results = [1,2,3];

                self.pageCount(Math.ceil(data.TotalResultsCount / self.pageSize()));
                self.searchResultsTotalCount(data.TotalResultsCount);
                self.searchResults(results);

                if ($('.task-search-pagination').data("twbs-pagination")) {
                    $('.task-search-pagination').twbsPagination('destroy');
                }

                if (self.pageCount()) {
                    $('.task-search-pagination').twbsPagination({
                        startPage: self.pageNumber(),
                        totalPages: self.pageCount(),
                        visiblePages: (self.pageCount() > 6 ? 6 : self.pageCount()),
                        initiateStartPageClick: false,
                        onPageClick: function (event, page) {
                            self.page(page);
                        }
                    });
                } else {
                    $('.task-search-pagination').twbsPagination({
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

            }, 1500);
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
            (self.lastSearchTaskSearchStatus() != self.taskSearchStatus()) ||
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
        self.lastSearchTaskSearchStatus(self.taskSearchStatus());
        self.lastSearchPageSize(self.pageSize());
    };

    self.toggleFilters = function () {
        if (self.displayFilters()) {
            $("#task-search-collapse").collapse('hide');
        } else {
            $("#task-search-collapse").collapse('show');
        }
        self.displayFilters(!self.displayFilters());
    };
}