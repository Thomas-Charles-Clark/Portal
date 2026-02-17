const supplierPaymentsHistorySummaryViewModel = ({
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
            dir: 'asc'
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

                fetch(`/api/SupplierPayments/HistorySummaryGridRead?${qs}`, {
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
                id: 'ID',
                fields: {
                    ID: {
                        type: 'string'
                    },
                    SortOrder: {
                        type: 'number'
                    },
                    IsTotalRow: {
                        type: 'boolean',
                    },
                    Label: {
                        type: 'string'
                    },
                    Status: {
                        type: 'string'
                    },
                    CurrencyCode: {
                        type: 'string'
                    },
                    GBPExchangeRate: {
                        type: 'decimal',
                        nullable: true
                    },
                    FormattingCulture: {
                        type: 'string'
                    },
                    Budget: {
                        type: 'number',
                        nullable: true
                    },
                    RequestCount_All: {
                        type: 'number',
                        nullable: true
                    },
                    RequestCount_New: {
                        type: 'number',
                        nullable: true
                    },
                    RequestCount_PartApproved: {
                        type: 'number',
                        nullable: true
                    },
                    RequestCount_FullyApproved: {
                        type: 'number',
                        nullable: true
                    },
                    SupplierInvoices_Total: {
                        type: 'number',
                        nullable: true
                    },
                    SupplierInvoices_NotDue: {
                        type: 'number',
                        nullable: true
                    },
                    SupplierInvoices_Overdue: {
                        type: 'number',
                        nullable: true
                    },
                    SupplierInvoices_Overdue_30Day: {
                        type: 'number',
                        nullable: true
                    },
                    SupplierInvoices_Overdue_60Day: {
                        type: 'number',
                        nullable: true
                    },
                    SupplierInvoices_Overdue_90Day: {
                        type: 'number',
                        nullable: true
                    },
                    SupplierInvoices_Overdue_120DayPlus: {
                        type: 'number',
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
        field: 'Label',
        title: 'Label',
        template: (e) => {
            return e.Label;
        }
    }, {
        field: 'Status',
        title: 'Status',
        template: (e) => {
            return e.Status;
        }
    }, {
        field: 'CurrencyCode',
        title: 'Currency'
    }, {
        field: 'GBPExchangeRate',
        title: 'GBP Exchange Rate',
        width: 140,
        attributes: {
            "class": "text-end"
        },
        template: (e) => {
            if (e.GBPExchangeRate) {
                return formatNumber(e.GBPExchangeRate, 4, 'en-GB')
            } else {
                return '';
            }
        }
    }, {
        field: 'Budget',
        title: 'Budget',
        attributes: {
            "class": "text-end"
        },
        template: (e) => {
            if (e.Budget && e.CurrencyCode && e.FormattingCulture) {
                return formatCurrency(e.Budget, 2, e.FormattingCulture, e.CurrencyCode);
            } else {
                return '';
            }
        }
    }, {
        title: 'Request Counts',
        columns: [{
            field: 'RequestCount_All',
            title: 'All',
            attributes: {
                "class": "text-end"
            },
            template: (e) => {
                if (e.RequestCount_All != null) {
                    return formatNumber(e.RequestCount_All, 0, 'en-GB');
                } else {
                    return '';
                }
            }
        }, {
            field: 'RequestCount_New',
            title: 'New',
            attributes: {
                "class": "text-end"
            },
            template: (e) => {
                if (e.RequestCount_New != null) {
                    return formatNumber(e.RequestCount_New, 0, 'en-GB');
                } else {
                    return '';
                }
            }
        }, {
            field: 'RequestCount_PartApproved',
            title: 'Part Approved',
            attributes: {
                "class": "text-end"
            },
            template: (e) => {
                if (e.RequestCount_PartApproved != null) {
                    return formatNumber(e.RequestCount_PartApproved, 0, 'en-GB');
                } else {
                    return '';
                }
            }
        }, {
            field: 'RequestCount_FullyApproved',
            title: 'Fully Approved',
            attributes: {
                "class": "text-end"
            },
            template: (e) => {
                if (e.RequestCount_FullyApproved != null) {
                    return formatNumber(e.RequestCount_FullyApproved, 0, 'en-GB');
                } else {
                    return '';
                }
            }
        }]
    }, {
        title: 'Supplier Invoices',
        columns: [{
            field: 'SupplierInvoices_Total',
            title: 'Total',
            attributes: {
                "class": "text-end"
            },
            template: (e) => {
                if (e.SupplierInvoices_Total != null) {
                    return formatCurrency(e.SupplierInvoices_Total, 0, e.FormattingCulture, e.CurrencyCode);
                } else {
                    return '';
                }
            }
        }, {
            field: 'SupplierInvoices_NotDue',
            title: 'Not Due',
            attributes: {
                "class": "text-end"
            },
            template: (e) => {
                if (e.SupplierInvoices_NotDue != null) {
                    return formatCurrency(e.SupplierInvoices_NotDue, 0, e.FormattingCulture, e.CurrencyCode);
                } else {
                    return '';
                }
            }
        }, {
            field: 'SupplierInvoices_Overdue',
            title: 'Overdue',
            attributes: {
                "class": "text-end"
            },
            template: (e) => {
                if (e.SupplierInvoices_Overdue != null) {
                    return formatCurrency(e.SupplierInvoices_Overdue, 0, e.FormattingCulture, e.CurrencyCode);
                } else {
                    return '';
                }
            }
        }, {
            field: 'SupplierInvoices_Overdue_30Day',
            title: '30 Days',
            attributes: {
                "class": "text-end"
            },
            template: (e) => {
                if (e.SupplierInvoices_Overdue_30Day != null) {
                    return formatCurrency(e.SupplierInvoices_Overdue_30Day, 0, e.FormattingCulture, e.CurrencyCode);
                } else {
                    return '';
                }
            }
        }, {
            field: 'SupplierInvoices_Overdue_60Day',
            title: '60 Days',
            attributes: {
                "class": "text-end"
            },
            template: (e) => {
                if (e.SupplierInvoices_Overdue_60Day != null) {
                    return formatCurrency(e.SupplierInvoices_Overdue_60Day, 0, e.FormattingCulture, e.CurrencyCode);
                } else {
                    return '';
                }
            }
        }, {
            field: 'SupplierInvoices_Overdue_90Day',
            title: '90 Days',
            attributes: {
                "class": "text-end"
            },
            template: (e) => {
                if (e.SupplierInvoices_Overdue_90Day != null) {
                    return formatCurrency(e.SupplierInvoices_Overdue_90Day, 0, e.FormattingCulture, e.CurrencyCode);
                } else {
                    return '';
                }
            }
        }, {
            field: 'SupplierInvoices_Overdue_120DayPlus',
            title: '120+ days',
            attributes: {
                "class": "text-end"
            },
            template: (e) => {
                if (e.SupplierInvoices_Overdue_120DayPlus != null) {
                    return formatCurrency(e.SupplierInvoices_Overdue_120DayPlus, 0, e.FormattingCulture, e.CurrencyCode);
                } else {
                    return '';
                }
            }
        }]
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
            console.log(`historySummary dataBound`, e);

            let columnIndex = 0;

            let rows = e.sender.tbody.children();

            for (let i = 0; i < rows.length; i++) {

                let row = $(rows[i]);

                let dataItem = e.sender.dataItem(row);

                if (dataItem.get("Label").indexOf('Total') > -1) {
                    row.addClass("total-row");
                };
            }
        },
        save: (data) => {
            console.log(`saveChanges`, e);
        },
        saveChanges: (e) => {
            console.log(`saveChanges`, e);
        },
        excelExport: (e) => {
            let now = new Date();

            e.workbook.fileName = `Payment-History-Summary_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.xlsx`;

            self.busy(false);
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
        self.busy(true);
        self.gridWidget().saveAsExcel();
    }

    //#endregion



    //#region Events



    //#endregion


    return self;
};