const creditControlOutstandingInvoicesWithUnallocatedDepositsViewModel = ({
    busy,
    filters
} = {
    busy: ko.observable(false),
    filters: {}
}) => {

    let self = {
        busy,
        filters
    };

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = busy;

    self.busyMessage = ko.observable('Please Wait');

    self.gridWidget = ko.observable();

    self.selectedPod = ko.observable();

    self.dashboardPods = ko.observableArray([]);

    //#endregion



    //#region Components

    self.gridColumns = [{
        field: "UniVerseAccount",
        title: "UniVerse Account",
        width: 160,
        attributes: {
            "class": "",
        },
        headerAttributes: {
            "class": ""
        },
        filterable: {
            extra: false
        },
        locked: true,
        headerTemplate: `UniVerse Account<br/>`
    }, {
        field: "TradeAccountLabel",
        title: "Trade Account",
        width: 260,
        attributes: {
            "class": "",
        },
        headerAttributes: {
            "class": ""
        },
        filterable: {
            extra: false
        },
        locked: true,
        headerTemplate: `Trade Account<br/>`
    }, {
        field: "SalesLedgerKey",
        title: "Sales Ledger Key",
        width: 160,
        attributes: {
            "class": "",
        },
        headerAttributes: {
            "class": ""
        },
        filterable: {
            extra: false
        },
        locked: true,
        headerTemplate: `Sales Ledger Key<br/>`
    }, {
        field: "Age",
        title: "Age",
        width: 140,
        attributes: {
            "class": ""
        },
        headerAttributes: {
            "class": ""
        },
        filterable: {
            extra: false
        },
        locked: true,
        headerTemplate: `Age<br/>`
    }, {
        field: "OriginalValueInCurrency",
        title: "Original Value",
        width: 160,
        attributes: {
            "class": ""
        },
        headerAttributes: {
            "class": ""
        },
        filterable: {
            extra: false
        },
        template: `#: OriginalValueInCurrency ? formatCurrency(OriginalValueInCurrency, 2, FormattingCulture, CurrencyCode) : '' #`
    }, {
        field: "OutstandingAmountInCurrency",
        title: "Outstanding",
        width: 160,
        attributes: {
            "class": "relative",
        },
        headerAttributes: {
            "class": ""
        },
        filterable: {
            extra: false
        },
        template: `#: OutstandingAmountInCurrency ? formatCurrency(OutstandingAmountInCurrency, 2, FormattingCulture, CurrencyCode) : '' #`
    }, {
        field: "UnallocatedCashAssignedToThisOrderTotalInCurrency",
        title: "Unallocated Cash Assigned to this Order",
        width: 160,
        attributes: {
            "class": "relative",
        },
        headerAttributes: {
            "class": ""
        },
        filterable: {
            extra: false
        },
        template: (dataItem) => {
            if (dataItem.UnallocatedCashAssignedToThisOrderTotalInCurrency) {
                return `<a href="javascript:;" class="grid-btn stop-btn" data-bind="actualBootstrapPopover: { details: unallocatedCashAssignedToThisOrderTotalInCurrencyPopoverDetails }, click: () => { return true; }, clickBubble: false">${formatCurrency(dataItem.UnallocatedCashAssignedToThisOrderTotalInCurrency, 2, dataItem.FormattingCulture, dataItem.CurrencyCode)}</a>`
            } else {
                return '';
            }
        }
    },
        //{
        //field: "UnallocatedCashAssignedToThisOrderBreakdown",
        //title: "Unallocated Cash on Order - Breakdown",
        //width: 260,
        //attributes: {
        //    "class": ""
        //},
        //headerAttributes: {
        //    "class": ""
        //},
        //filterable: {
        //    extra: false
        //},
        //template: (dataItem) => {
        //    return dataItem.UnallocatedCashAssignedToThisOrderBreakdown ?? '';
        //}
        //},
    {
        field: "UnallocatedCashAssignedToThisAccountTotalInCurrency",
        title: "Unallocated Cash Assigned to this Account",
        width: 160,
        attributes: {
            "class": "relative"
        },
        headerAttributes: {
            "class": ""
        },
        filterable: {
            extra: false
        },
        template: (dataItem) => {
            if (dataItem.UnallocatedCashAssignedToThisAccountTotalInCurrency) {
                return `<a href="javascript:;" class="grid-btn stop-btn" data-bind="actualBootstrapPopover: { details: unallocatedCashAssignedToThisAccountTotalInCurrencyPopoverDetails }, click: () => { return true; }, clickBubble: false">${formatCurrency(dataItem.UnallocatedCashAssignedToThisAccountTotalInCurrency, 2, dataItem.FormattingCulture, dataItem.CurrencyCode)}</a>`
            } else {
                return '';
            }
        }
    },
        //{
        //field: "UnallocatedCashAssignedToThisAccountBreakdown",
        //title: "Unallocated Cash on Account - Breakdown",
        //width: 260,
        //attributes: {
        //    "class": ""
        //},
        //headerAttributes: {
        //    "class": ""
        //},
        //filterable: {
        //    extra: false
        //},
        //template: (dataItem) => {
        //    return dataItem.UnallocatedCashAssignedToThisAccountBreakdown ?? '';
        //}
        //},
    {
        field: "InvoiceID",
        title: "Invoice No.",
        width: 140,
        attributes: {
            "class": ""
        },
        headerAttributes: {
            "class": ""
        },
        filterable: {
            extra: false
        },
        template: (dataItem) => {
            return dataItem.InvoiceID ?? '';
        }
    }, {
        field: "InvoiceURI",
        title: " ",
        width: 64,
        attributes: {
            "class": "relative",
            "title": 'View Invoice'
        },
        headerAttributes: {
            "class": ""
        },
        filterable: false,
        template: `<a target="_blank" href="#: InvoiceURI #" class="stretched-link"><i class="bi bi-file-earmark-pdf"></i></a>`
    }, {
        field: 'NoField',
        title: ' ',
        width: 'auto',
        filterable: false
    }];

    self.gridDataSourceRead = (options) => {
        var webapi = new kendo.data.transports.webapi({ prefix: "" });

        var mapped = webapi.parameterMap(options.data);

        var additionalParameters = self.filters.outstandingInvoicesWithUnallocatedDepositsFilters();

        var params = new URLSearchParams();

        if (self.selectedPod()) {
            additionalParameters.selectedPod = self.selectedPod().PodHandle;
            additionalParameters.parameterJson = self.selectedPod().ParameterJSON
        }

        var data = Object.assign(mapped, additionalParameters);

        for (var propertyName in data) {
            if (Array.isArray(data[propertyName])) {
                data[propertyName].forEach(v => {
                    params.append(propertyName, v);
                });
            } else {
                params.append(propertyName, data[propertyName]);
            }
        }

        console.log('outstandingInvoices gridDataSourceRead calling with', data);

        self.busy(true);

        fetch('/api/creditcontrolapi/OutstandingInvoices?' + params, {
            method: 'GET',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin'
        })
            .then(window.handleFetchResponse)
            .then(data => {

                console.log('outstandingInvoices gridDataSourceRead returned', data);

                ko.ignoreDependencies(() => {

                    if (Object.hasOwn(data, 'errorMessage')) {

                        document.querySelector('#info-modal').addEventListener('hide.bs.modal', self.refresh);
                        options.success([]);
                        window.showInfo('Sorry', data.errorMessage);

                    } else {
                        document.querySelector('#info-modal')?.removeEventListener('hide.bs.modal', self.refresh);

                        //self.previouslySelectedDashboardPod = self.selectedPod()?.PodHandle;

                        //self.dashboardPods(data.dashboardPods.map(dp => creditControlDashboardPodViewModel({
                        //    rec: dp
                        //})));

                        //if (self.previouslySelectedDashboardPod) {
                        //    self.selectedPod(self.dashboardPods().find(dp => dp.PodHandle == self.previouslySelectedDashboardPod));
                        //}

                        options.success(data.gridData);
                    }

                    if (typeof callback == 'function') {
                        callback();
                    } else {
                        self.busy(false);
                    }
                });

            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
    }

    self.gridParams = {
        autoBind: false,
        widget: self.gridWidget,
        columns: self.gridColumns,
        data: new kendo.data.DataSource({
            transport: {
                read: self.gridDataSourceRead
            },
            batch: false,
            sortable: true,
            filterable: true,
            grouping: false,
            serverFiltering: false,
            serverGrouping: false,
            serverPaging: true,
            serverAggregates: false,
            serverSorting: true,
            pageSize: 20,
            pageable: {
                pageSize: 20,
                pageSizes: [10, 20, 50, 100, 250, 500, 'all']
            },
            schema: $.extend({}, kendo.data.schemas.webapi, {
                data: "Data",
                total: "Total",
                errors: "Errors",
                sorts: "Sorts",
                aggregates: "Aggregates",
                model: {
                    id: 'SalesLedgerKey',
                    fields: {
                        UniverseAccount: { type: 'string' },
                        TradeAccountLabel: { type: 'string' },
                        CurrencyCode: { type: 'string' },
                        FormattingCulture: { type: 'string' },
                        CurrencyCode: { type: 'string' },
                        SalesLedgerKey: { type: 'string' },
                        Age: { type: 'string' },
                        OriginalValueInCurrency: { type: 'number' },
                        OutstandingAmountInCurrency: { type: 'number' },
                        UnallocatedCashAssignedToThisOrderTotalInCurrency: { type: 'number' },
                        UnallocatedCashAssignedToThisOrderBreakdown: { type: 'string' },
                        UnallocatedCashAssignedToThisAccountTotalInCurrency: { type: 'number' },
                        UnallocatedCashAssignedToThisAccountBreakdown: { type: 'string' },
                        InvoiceID: { type: 'string' },
                        InvoiceDT: { type: 'date' },
                        InvoiceURI: { type: 'string' },
                        OrderID: { type: 'number' }
                    }
                }
            }),
            requestStart: (e) => {
                self.busy(true);
            },
            requestEnd: (e) => {
                self.busy(false);
            }
        }),
        //height: 1024,
        //useKOTemplates: false,
        //rowTemplate: 'credit-control-trade-account-row-template',
        noRecords: {
            template: () => `No Results. Please search using the filters to the left.`//: ${$("#grid").data("kendoGrid").dataSource.page()}`
        },
        sortable: true,
        scrollable: false,
        filterable: {
            extra: false,
            defaultOperation: 'contains'
        },
        reorderable: false,
        paging: true,
        pageSize: 20,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        excel: {
            allPages: true
        },
        selectable: false,
        change: function (event) {
            console.log('outstandingInvoices change', event, event.sender.select());
        },
        filterMenuInit: (e) => {
            if (e.field === "CreditStop") {
                // Find and replace specific elements in the filter menu
                e.container[0].setAttribute('title', 'Filter for Credit Stop Status')
                e.container.find(".k-filter-help-text").text("Credit Stopped?");
            }
        },
        dataBound: (e) => {
            console.log('creditControlViewModel dataBound', e);

            // <Thanks, Google AI>
            let grid = e.sender;

            // Use a timeout to ensure the grid has finished initial layout
            window.setTimeout(function() {
                let wrapper = grid.wrapper;
                let lockedContent = wrapper.children(".k-grid-content-locked");
                let content = wrapper.children(".k-grid-content");

                // Reset heights to let them auto-expand to content
                wrapper.height("");
                lockedContent.height("");
                content.height("");

                // Synchronize the locked and unlocked content heights
                let maxContentHeight = Math.max(content.height(), lockedContent.height());
                content.height(maxContentHeight);
                lockedContent.height(maxContentHeight);

                // Set the final wrapper height based on the new content size
                wrapper.height(wrapper.height());

                // Notify the grid to recalculate its internal layout
                grid.resize();
            }, 0);
            // </Thanks>

            ko.ignoreDependencies(() => {

                var pristine = e.sender.dataSource.data().toJSON();

                ko.utils.arrayForEach(e.sender.dataSource.data(), function (item, index) {

                    let rows = document.querySelectorAll('tr[data-uid="' + item.uid + '"]');

                    rows.forEach(row => {
                        ko.cleanNode(row);

                        pristine[index] = creditControlOutstandingInvoicesWithUnallocatedDepositsRecordViewModel({
                            rec: item
                        });

                        ko.applyBindings(pristine[index], row);
                    });
                });
            });
        }
    };

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds



    //#endregion



    //#region Subscriptions

    self.filters.outstandingInvoicesWithUnallocatedDepositsFilters.subscribe(nv => {
        self.refresh();
    });

    //#endregion



    //#region Methods

    self.refresh = () => {
        if (self.gridWidget()) {
            self.gridWidget().dataSource.query({
                page: self.gridWidget().dataSource.page(),
                pageSize: self.gridWidget().dataSource.pageSize(),
                group: self.gridWidget().dataSource.group(),
                filter: self.gridWidget().dataSource.filter(),
                aggregates: self.gridWidget().dataSource.aggregates()
            })
        }
    }

    //#endregion



    //#region Events



    //#endregion

    return self;
};