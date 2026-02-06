const supplierPaymentsHistoryDetailViewModel = ({
    ready,
    busy,
    busyMessage,
    filters,
    refreshDashboard
} = {
        ready: ko.observable(false),
        busy: ko.observable(false),
        busyMessage: ko.observable('Please Wait'),
        filters: {},
        refreshDashboard: () => { }
    }) => {

    let self = {
        ready,
        busy: ko.observable(false),
        parentBusy: busy,
        busyMessage,
        filters,
        refreshDashboard
    };

    //#region Properties

    self.gridWidget = ko.observable();

    //#endregion



    //#region Components

    self.gridDataSource = new kendo.data.DataSource({
        sortable: true,
        filterable: true,
        grouping: true,
        serverGrouping: true,
        serverFiltering: true,
        serverPaging: true,
        pageSize: 20,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        sort: {
            field: 'SortOrder',
            dir: 'desc'
        },
        batch: true,
        transport: {
            read: (options) => {

                let webapi = new kendo.data.transports.webapi({ prefix: "" });

                let mapped = webapi.parameterMap(options.data);

                let data = {};

                for (var propertyName in mapped) {
                    data[propertyName] = mapped[propertyName];
                }

                let qs = new URLSearchParams(data);

                fetch(`/api/SupplierPayments/HistoryDetailGridRead?${qs}`, {
                    method: 'GET',
                    headers: window.fetchHeaders,
                    cache: 'no-cache',
                    credentials: 'same-origin'
                })
                    .then(window.handleFetchResponse)
                    .then(data => {
                        options.success(data.kendoGridResult);
                    })
                    .catch(window.catchFetchError);
            }
        },
        error: (e) => {
            console.error(`error`, e);
        },
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            filters: "Filters",
            aggregates: "Aggregates",
            errors: "Errors",
            model: {
                id: 'PaymentDecisionID',
                fields: {
                    PaymentDecisionID: {
                        type: 'number'
                    },
                    PeriodID: {
                        type: 'number'
                    },
                    Label: {
                        type: 'string',
                    },
                    SupplierCode: {
                        type: 'string'
                    },
                    SupplierName: {
                        type: 'string'
                    },
                    CurrencyCode: {
                        type: 'string'
                    },
                    FormattingCulture: {
                        type: 'string'
                    },
                    AmountInCurrency: {
                        type: 'number',
                        nullable: false
                    },
                    FinalisedDT: {
                        type: 'date',
                        nullable: true
                    },
                    RequestedBy: {
                        type: 'string',
                        nullable: true
                    },
                    ApprovedBy: {
                        type: 'string',
                        nullable: true
                    }
                }
            }
        }),
        errors: function (e) {
            console.error(`errors`, e);

            // e.xhr contains the full response from the server
            var response = JSON.parse(e.xhr.responseText);

            var message = JSON.stringify(response.error, null, '\t');

            self.busy(false);

            window.showInfo('Errors', PR.prettyPrintOne(message));

            // Revert changes in the grid if necessary
            self.gridWidget().cancelChanges();
        },
        requestStart: (e) => {
            self.busy(true);

            console.log(`requestStart`, e);

            if (self.ready()) {
                self.refreshDashboard();
            }
        },
        noDataTemplate: 'Nothing to display',
        requestEnd: (e) => {

            console.log(`requestEnd`, e);

            self.busy(false);
        }
    });

    self.gridColumns = [{
        field: 'Period',
        title: 'Period',
        attributes: {
            title: (e) => `PaymentDecisionID: ${e.PaymentDecisionID}`
        }
    }, {
        field: 'SupplierCode',
        title: 'Supplier',
        template: (e) => {
            return `${e.SupplierName} (${e.SupplierCode})`
        }
    }, {
        field: 'CurrencyCode',
        title: 'Currency',
        template: (e) => {
            return e.CurrencyCode;
        }
    }, {
        field: 'AmountInCurrency',
        title: 'Amount in Currency',
        width: 180,
        template: (e) => {
            return formatCurrency(e.AmountInCurrency, 2, e.FormattingCulture, e.CurrencyCode);
        }
    }, {
        field: 'FinalisedDT',
        title: 'Finalised',
        width: 180,
        template: (e) => {
            if (e.FinalisedDT) {
                return moment(e.FinalisedDT).format('dddd DD/MM/YYYY');
            } else {
                return '';
            }
        }
    }, {
        field: 'RequestedBy',
        title: 'Requested By'
    }, {
        field: 'ApprovedBy',
        title: 'Approved By'
    }];

    self.gridParams = {
        autoBind: true,
        widget: self.gridWidget,
        columns: self.gridColumns,
        data: self.gridDataSource,
        scrollable: false,
        sortable: true,
        filterable: true,
        reorderable: false,
        paging: true,
        pageSize: 20,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        selectable: false,
        editable: false,
        edit: function (e) {
            console.log(`edit`, e);
        },
        change: (e) => {
            console.log(`change`, e);
        },
        dataBound: (e) => {
            console.log(`dataBound`, e);
        },
        save: (data) => {
            console.log(`saveChanges`, e);
        },
        saveChanges: (e) => {
            console.log(`saveChanges`, e);
        },
        excelExport: (e) => {
            let data = e.data;
            let gridColumns = e.sender.columns;
            let sheet = e.workbook.sheets[0];
            let visibleGridColumns = [];
            let columnTemplates = [];
            let dataItem;
            // Create element to generate templates in.
            let elem = document.createElement('div');

            // Get a list of visible columns
            for (let i = 0; i < gridColumns.length; i++) {
                if (gridColumns[i].exportable !== false) {
                    visibleGridColumns.push(gridColumns[i]);
                }
            }

            // Create a collection of the column templates, together with the current column index
            for (let i = 0; i < visibleGridColumns.length; i++) {
                if (visibleGridColumns[i].template) {
                    columnTemplates.push({
                        cellIndex: i,
                        template: kendo.template(visibleGridColumns[i].template)
                    });
                }
            }

            //let header = sheet.rows.find(r => r.type == 'header');

            //header.cells.splice(2, 0, {
            //    background: "#7a7a7a",
            //    colSpan: 1,
            //    color: "#fff",
            //    rowSpan: 1,
            //    value: "Supplier Name"
            //});

            //header.cells.splice(4, 0, {
            //    background: "#7a7a7a",
            //    colSpan: 1,
            //    color: "#fff",
            //    rowSpan: 1,
            //    value: "Budget Holder Name"
            //});

            // Traverse all exported rows.
            for (let i = 1; i < sheet.rows.length; i++) {
                let row = sheet.rows[i];
                // Traverse the column templates and apply them for each row at the stored column position.

                //// Splice back in the hidden columns, because of annoying reasons. Shush. 
                //row.cells.splice(2, 0, { value: null });
                //row.cells.splice(4, 0, { value: null });

                // Get the data item corresponding to the current row.
                let dataItem = data[i - 1];
                for (let j = 0; j < columnTemplates.length; j++) {
                    let columnTemplate = columnTemplates[j];
                    // Generate the template content for the current cell.
                    if (dataItem) {
                        elem.innerHTML = columnTemplate.template(dataItem);
                        if (row.cells[columnTemplate.cellIndex] != undefined)
                            row.cells[columnTemplate.cellIndex].type = "string";
                        // Output the text content of the templated cell into the exported cell.
                        row.cells[columnTemplate.cellIndex].value = elem.textContent || elem.innerText || "";
                    }
                }
            }

            let now = new Date();

            e.workbook.fileName = `Payment-History-Details_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.xlsx`;
        }
    }

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds



    //#endregion



    //#region Subscriptions



    //#endregion



    //#region Methods

    self.refresh = () => {
        self.gridWidget().dataSource.query({
            page: self.gridWidget().dataSource.page(),
            pageSize: self.gridWidget().dataSource.pageSize(),
            filter: self.gridWidget().dataSource.filter(),
            sort: self.gridWidget().dataSource.sort()
        });
    }

    self.exportToExcel = () => {
        self.gridWidget().saveAsExcel();
    }

    //#endregion



    //#region Events



    //#endregion


    return self;
};