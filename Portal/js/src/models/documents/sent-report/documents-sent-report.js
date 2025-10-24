const documentsSentReportViewModel = (() => {
    let self = {};

    //#region Properties

    self.busy = ko.observable(true);

    self.busyMessage = ko.observable('Please wait...');

    self.validateNow = ko.observable(false);

    self.filters = documentsSentReportFiltersViewModel({
        parent: self
    });

    self.dashboard = documentsSentReportDashboardViewModel({
        parent: self
    })

    self.viewingDocument = ko.observable();

    self.viewingDocumentLoaded = ko.observable(false);

    //#endregion

    //#region Lifted Methods

    self.genericUnsavedChangesClear = (e) => {
        self.checkUnsavedChangesThenClear(e);
    }

    self.checkUnsavedChangesThenClear = async (options) => {
        await self.unsavedChanges().then(() => {
            var self = options; // self is now the params of the control the user just interacted with

            if (ko.isObservableArray(self.observable)) {
                self.observable([]);
            } else {
                self.observable(EMPTY_STRING);
            }

            if (self.dropDownListSettings.widget()) {

                if (ko.isObservableArray(self.observable)) {
                    self.dropDownListSettings.widget().value([]);
                } else {
                    self.dropDownListSettings.widget().value(EMPTY_STRING);
                }

                self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.getDefaultFoundation().adapter_.closeOutline();

                if (self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.label_ != null)
                    self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.label_.float(false);
            }

            if (typeof self.afterClear === 'function') {
                self.afterClear();
            }

        }).catch((e) => { });
    }

    self.unsavedChanges = () => {
        return new Promise((resolve, reject) => {

            let array = [];

            let unsaved = false; // array.find(p => p.unsavedChanges());

            if (unsaved) {
                window.showConfirm('Unsaved changes', 'You have unsaved changes. If you proceed your changes will be lost. Proceed?', () => {
                    resolve();
                }, () => {
                    reject();
                });
            } else {
                resolve();
            }
        });
    }

    //#endregion


    //#region Components

    self.gridWidget = ko.observable();

    self.gridColumns = [{
        field: 'DocumentSentID',
        title: 'ID',
        hidden: true
    }, {
        field: 'Document',
        title: 'Document',
        width: 180,
        sortable: false
    }, {
        field: 'TradeAccount',
        title: 'Trade Account',
        width: 200,
        sortable: false
    }, {
        field: 'SentRegarding',
        title: 'Details',
        sortable: false
    }, {
        field: 'SentDT',
        title: 'Sent',
        width: 140,
        sortable: true
    }, {
        field: 'SentTo',
        title: 'Sent To',
        sortable: false
    }, {
        field: 'SentBy',
        title: 'Sent By',
        sortable: false
    }, {
        field: 'ReplyTo',
        title: 'Reply To',
        sortable: false
    }];

    self.gridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });

        var mapped = webapi.parameterMap(options.data);

        var additionalParameters = self.getParameters();

        var params = new URLSearchParams();

        var data = Object.assign(mapped, additionalParameters);

        for (var propertyName in data) {
            params.append(propertyName, data[propertyName]);
        }

        console.log('calling GetDocumentSendHistory with', data);

        self.busy(true);

        fetch('/api/documentsapi/GetDocumentSendHistory?' + params, {
            method: "GET",
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin'
        })
            .then(window.handleFetchResponse)
            .then(data => {
                console.log('GetDocumentSendHistory returned', data);
                options.success(data.gridData);
                self.dashboard.previouslySelectedDocumentId = self.filters.documentId();
                self.dashboard.pods(data.podData);
                self.busy(false);
            })
            .catch(err => {
                console.error(err);
                window.catchFetchError(err);
            });
    }

    self.gridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.gridDataSourceRead,
        },
        batch: false,
        sortable: false,
        filterable: true,
        grouping: false,
        serverFiltering: false,
        serverGrouping: false,
        serverPaging: true,
        serverAggregates: false,
        serverSorting: false,
        pageSize: 50,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "AggregateResults",
            model: {
                id: 'DocumentSentID',
                fields: {
                    DocumentSentID: { type: 'number', editable: false },
                    TradeAccount: { type: 'string', editable: false },
                    SentRegarding: { type: 'string', editable: false },
                    Document: { type: 'string', editable: false },
                    DocumentLink: { type: 'string', editable: false },
                    SentDT: { type: 'datetime', editable: false },
                    SentTo: { type: 'string', editable: false },
                    SentBy: { type: 'string', editable: false },
                    ReplyTo: { type: 'string', editable: false },
                    Status: { type: 'string', editable: false },
                    FilePath: { type: 'string', editable: false },
                    TotalRowCount: { type: 'number', editable: false },
                    Subject: { type: 'string', editable: false },
                    RecipientEmailAddress: { type: 'string', editable: false },
                    DocumentID: { type: 'number', editable: false },
                    BasketID: { type: 'number', editable: false },
                    OrderHeadID: { type: 'number', editable: false },
                    TransactionID: { type: 'number', editable: false },
                    TradeAccountID: { type: 'number', editable: false },
                }
            }
        }),
        aggregate: [],
        sort: {
            field: 'SentDT',
            dir: 'desc'
        },
        //sort: { field: "BasketID", dir: "desc" },
        requestStart: function (e) {
            self.busy(true);
        },
        requestEnd: function (e) {
            if (e.type == "update") {
                if (e.response) {
                    if (!e.response.Errors) {
                        e.sender.read();
                    } else {
                        self.busy(false);
                    }
                } else {
                    self.busy(false);
                }
            } else {
                self.busy(false);
            }
        },
        noDataTemplate: 'Nothing to display'
    });

    self.gridParams = {
        autoBind: true,
        widget: self.gridWidget,
        columns: self.gridColumns,
        data: self.gridDataSource,
        useKOTemplates: true,
        rowTemplate: 'document-sent-row-template',
        sortable: true,
        groupable: false,
        filterable: false,
        reorderable: true,
        editable: false,
        selectable: 'single',
        navigatable: true,
        paging: true,
        pageSize: 50,
        pageable: {
            pageSize: 50,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        select: (e) => {
            console.log('gridParams select', e);
        },
        //change: (e) => {
        //    console.log('gridParams change', e);

        //    let dataItem = e.sender.dataItem(e.sender.select());

        //    self.openDocument(dataItem);
        //}
    }

    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Computeds



    //#endregion


    //#region Methods

    self.init = () => {

    }

    self.selectRow = (data, event) => {
        self.gridParams.widget().select(event.currentTarget.closest('tr'));
    }

    self.getParameters = () => {
        let data = {
            dateRangeId: self.filters.documentDateRangeId(),
            fromDate: typeof self.filters.documentFromDate() == 'object' ? self.filters.documentFromDate().toUTCString() : self.filters.documentFromDate(),
            toDate: typeof self.filters.documentToDate() == 'object' ? self.filters.documentToDate().toUTCString() : self.filters.documentToDate(),
            documentId: self.filters.documentId(),
            tradeAccountId: self.filters.tradeAccountId(),
            page: (self.gridParams.widget() && self.gridParams.widget().dataSource.page()) ?? 1,
            pageSize: (self.gridParams.widget() && self.gridParams.widget().dataSource.pageSize()) ?? 0,
        }

        if (self.filters.sentDtSortDirection) {
            data.sentDtSortDirection = self.filters.sentDtSortDirection;
        }

        if (self.filters.freeTextSearch()) {
            data.searchString = self.filters.freeTextSearch();
        }

        return data;
    }

    self.refresh = () => {
        let pageSize = self.gridParams.widget().dataSource.pageSize();

        self.gridParams.widget().dataSource.query({
            page: 1,
            pageSize: pageSize
        });
    }

    self.openDocument = (data, event) => {
        console.log('openDocument', data, event);

        self.viewingDocument(documentsSentReportViewingDocumentViewModel({
            rec: data,
            parent: self
        }));
    }

    //#endregion

    //#region Events



    //#endregion

    return self;
});