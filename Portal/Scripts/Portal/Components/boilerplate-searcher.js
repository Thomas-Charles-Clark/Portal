
self.resultGridWidget = ko.observable();

self.performSearch = function () {
    self.resultGridWidget().dataSource.read();
}

self.resultGridColumns = [
    {
        field: 'TradeAccountVisitID',
        title: 'Search Results',
        template: $("#visit-search-result-template").html()
    }
];

self.getSearchURL = function () {
    return '/Component/VisitSearch'
}

self.resultGridDataSourceRead = function (options) {
    //var webapi = new kendo.data.transports.webapi({ prefix: "" });
    //var params = webapi.parameterMap(options.data);
    var data = {
        term: self.searchTerm(),
        tradeAccountId: self.selectedTradeAccountId(),
        period: self.period(),
        from: self.fromDate() ? self.fromDate().toISOString() : null,
        to: self.toDate() ? self.toDate().toISOString() : null,
        languageId: 1,
        pageNumber: self.pageNumber(),
        pageSize: self.pageSize()
    }
    //for (var propertyName in params) {
    //    data[propertyName] = params[propertyName];
    //}

    $.ajax({
        url: self.getSearchURL(),
        type: "POST",
        data: data,
        success: function (data) {
            options.success(data);
            $("#result-grid .k-grid-content tbody tr").each(function (idx, ele) {
                ko.applyBindings(viewModel, ele);
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
    serverPaging: false,
    serverSorting: false,
    serverFiltering: false,
    schema: $.extend({}, kendo.data.schemas.webapi, {
        data: "Data",
        total: "Total",
        errors: "Errors",
        aggregates: "Aggregates"
    }),
    sort: { field: "TradeAccountVisitID", dir: "desc" },
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
    filterable: false,
    grouping: false,
    serverGrouping: false,
    pageable: {
        pageSize: 20,
        pageSizes: [10, 20, 50, 100, 200]
    },
    dataBound: function (e) {

    }
};