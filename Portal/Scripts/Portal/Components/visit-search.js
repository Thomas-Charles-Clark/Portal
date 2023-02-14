var visitSearch = function (parent) {
    var self = this;

    self.parent = parent;

    self.searchBusy = ko.observable(false);

    self.searchTerm = ko.observable(null).extend({ notify: 'always' });

    self.searchTerm.subscribe(function (newValue) {
        self.performSearch();
    });

    self.selectedTradeAccountId = ko.observable(getTradeAccountId());

    self.onSearchKeyUp = function (parent, event) {
        var key = event.which ? event.which : event.keyCode;
        switch (key) {
            case 13:
                self.performSearch();
                break;
        }
    }

    self.searchResults = ko.observable([]);

    self.clearResults = function () {
        self.resultGridWidget().dataSource.data([]);
        self.searchResults([]);
    }

    self.fromDate = ko.observable(null);//ko.observable((Date.now() - 604800000).toString());

    self.toDate = ko.observable(null);//ko.observable(Date.now().toString());

    self.period = ko.observable("last-3-months");

    self.periodOptions = ko.observable(getPeriodOptions());

    self.resultGridWidget = ko.observable();

    self.getRow = function(uid) {
        console.log(uid);
        return Enumerable.From(self.searchResults()).Where(`$.uid == '${uid}'`).Single();
    }

    self.resultGridColumns = [
        {
            field: 'TradeAccountVisitID',
            title: 'Search Results',
            template: $("#visit-search-result-template").html()
        }
    ];

    self.getSearchURL = function () {
        return '/api/componentApi/VisitSearch'
    }

    self.resultGridDataSourceRead = function (options) {
        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);
        var data = {
            Term: self.searchTerm(),
            TradeAccountID: self.selectedTradeAccountId(),
            Period: self.period(),
            From: self.fromDate() ? self.fromDate().toISOString() : null,
            To: self.toDate() ? self.toDate().toISOString() : null,
            LanguageID: 1
        }
        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        self.parent.busy(true);

        $.ajax({
            url: self.getSearchURL(),
            type: "POST",
            data: data,
            success: function (data) {
                self.parent.busy(false);
                options.success(data);
                $("#visit-search-grid .k-grid-content tbody tr").each(function (idx, ele) {
                    ko.applyBindings(viewModel, ele);
                });
            },
            error: function (data) {
                self.parent.busy(false);
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
        serverPaging: false,
        serverSorting: true,
        serverFiltering: false,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "Aggregates"
        }),
        sort: { field: "TradeAccountVisitID", dir: "asc" },
        requestStart: function (e) {
            if (self.selectedTradeAccountId())
                $("#grid-loading").stop().show();
            else
                e.preventDefault();
        }, 
        requestEnd: function (e) {
            window.setTimeout(function () {
                $("#grid-loading").stop().hide();
            }, 300);
        }
    });

    self.resultGridSettings = {
        autoBind: true,
        widget: self.resultGridWidget,
        columns: self.resultGridColumns,
        data: self.resultGridDataSource,
        sortable: true,
        filterable: false,
        grouping: false,
        serverGrouping: false,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 200]
        },
        dataBound: function (e) {
            console.log(e);
            self.searchResults(e.sender.dataSource.view());
        }
    };

    self.performSearch = function () {
        if ($("#visit-search-collapse").hasClass('in')) {
            $("#visit-search-collapse").collapse('hide');
        }
        if (self.resultGridWidget()) {
            self.resultGridWidget().dataSource.read();
        }
    }
}

var visitDetails = function (details, attendees) {
    var self = this;

    self.tradeAccountVisitId = details.TradeAccountVisitID;
    self.createdDt = details.CreatedDT;
    self.notes = details.Notes;
    self.visitDt = details.VisitDT;

    self.attendees = ko.observable(attendees);
}

var visitAttendee = function (details) {
    var self = this;

    self.tradeAccountVisitId = ko.observable(details.TradeAccountVisitID);
    self.memberId = ko.observable(details.MemberID);
    self.name = ko.observable(details.FullName);
    self.email = ko.observable(details.Email);
}