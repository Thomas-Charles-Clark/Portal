var marketingMessagesViewModel = function () {
    var self = this;

    // #region Declarations

    self.busy = ko.observable(false);

    self.marketingMessage = ko.observable(marketingMessage({}));

    // #endregion

    // #region Grid Things

    self.resultGridWidget = ko.observable();

    self.resultGridColumns = [
        {
            field: 'MarketingMessageID',
            title: 'Message ID',
            width: 140
        },
        {
            field: 'Name',
            title: 'Name'
        },
        {
            field: 'CreatedDT',
            title: 'Created',
            template: '#: renderDate(CreatedDT)#'
        }
    ];

    self.resultGridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {

        };

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        $.ajax({
            url: '/api/MarketingMessagesAPI/MarketingMessagesSearch',
            type: "GET",
            data: data,
            success: function (data) {
                options.success(data);
                //$("#result-grid .k-grid-content tbody tr").each(function (idx, ele) {
                //    ko.applyBindings(viewModel, ele);
                //});
            },
            error: function (data) {
                console.log(data);
                options.error();
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
            aggregates: "Aggregates",
            model: {
                fields: {
                    MarketingMessageID: { type: 'number' },
                    Name: { type: 'string' }
                }
            }
        }),
        sort: { field: "MarketingMessageID", dir: "desc" },
        requestStart: function (e) {
            $("#grid-loading").show();
        },
        requestEnd: function (e) {
            $("#grid-loading").hide();
        }
    });

    self.resultGridSettings = {
        autoBind: true,
        widget: self.resultGridWidget,
        columns: self.resultGridColumns,
        data: self.resultGridDataSource,
        //height: 685,
        sortable: true,
        filterable: false,
        reorderable: true,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 200]
        },
        dataBound: function (e) {
            //console.log('leadSearch resultGridSettings.dataBound hit');
        },
        filterMenuInit: function (e) {
            //console.log(e);
            //if (e.field == "Status") {
            //    e.container.find(".k-filter-help-text").hide();
            //    var firstValueDropDown = e.container.find("select:eq(0)").data("kendoDropDownList");
            //    setTimeout(function () {
            //        firstValueDropDown.wrapper.hide();
            //    });
            //}
        },
        selectable: "single, row",
        change: function (e) {
            if (self.resultGridWidget().select()) {
                var selectedItem = self.resultGridWidget().dataItem(self.resultGridWidget().select());
                if (selectedItem != null) {
                    viewModel.loadMessageForEdit(selectedItem.MarketingMessageID, 'summary', true);
                }
            }
        }
    };

    // #endregion

    // #region Functions

    self.startNewMessage = function () {
        self.marketingMessage(marketingMessage({}));

        $("#marketing-message-modal").modal('show');
    }

    self.loadMessageForEdit = function (marketingMessageId) {
        console.log('loadMessageForEdit', marketingMessageId);
        if (marketingMessageId == null) { // permit creation of new
            self.resetEditor();
        } else {
            self.busy(true);
            $.ajax({
                url: '/api/MarketingMessagesAPI/LoadMarketingMessage',
                type: 'GET',
                dataType: 'json',
                data: {
                    MarketingMessageID: marketingMessageId
                },
                success: function (data) {
                    self.busy(false);
                    if (data) {
                        self.marketingMessage(marketingMessage(data));
                        self.showMarketingMessageModal();
                    } else {
                        $.info('Message Not Found', 'Sorry, could not find marketing message with ID ' + marketingMessageId + '.\n\nIt may have been flagged as deleted.', null, null);
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    self.busy(false);
                    $.showError(xhr, textStatus, errorThrown);
                }
            });
        }
    }

    self.showMarketingMessageModal = function () {
        $("#marketing-message-modal").modal('show');
    }

    self.saveMessage = function () {
        if (self.marketingMessage().Errors().length > 0) {
            self.marketingMessage().Errors.showAllMessages(true);
            return;
        } else {
            self.marketingMessage().Errors.showAllMessages(false);
        }
        self.busy(true);
        $.ajax({
            url: '/api/MarketingMessagesAPI/SaveMarketingMessage',
            type: 'POST',
            dataType: 'json',
            data: {
                MarketingMessageID: self.marketingMessage().MarketingMessageID,
                Name: self.marketingMessage().Name(),
                Message: self.marketingMessage().Message()
            },
            success: function () {
                self.busy(false);
                self.resultGridWidget().dataSource.read();
                self.resetEditor();
            },
            error: function (xhr, textStatus, errorThrown) {
                self.busy(false);
                $.showError(xhr, textStatus, errorThrown);
            }
        });
    }

    // #endregion

    // #region Reset

    self.reset = function () {
        self.busy(false);
        self.resetEditor();
    }

    self.resetEditor = function () {
        self.marketingMessage(undefined);
        $("#marketing-message-modal").modal('hide');
    }

    // #endregion

    // #region Initialization



    // #endregion
}

var marketingMessage = function (record) {
    var self = this;

    self.MarketingMessageID = record.MarketingMessageID;

    self.Name = ko.observable(record.Name).extend({
        required: {
            params: true,
            message: 'You must provide a name'
        },
        charsRemaining: {
            maxLength: 50,
            elementId: '#message-name'
        }
    });

    self.Message = ko.observable(record.Message).extend({
        required: {
            params: true,
            message: 'You must provide a message'
        }
    });

    self.Errors = ko.validation.group([
        self.Name,
        self.Message
    ]);

    return self;
}