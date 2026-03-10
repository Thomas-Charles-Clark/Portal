const supplierPaymentsSuppliersViewModel = ({
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
        busy,
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
        serverPaging: false,
        serverSorting: true,
        pageSize: 20,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        sort: {
            field: 'SupplierCode',
            dir: 'asc'
        },
        batch: true,
        type: "odata-v4",
        transport: {
            read: {
                url: function(item) {
                    //return `/supplier-payments-odata/SupplierPayments_SupplierRecords`

                    let filters = self.filters.supplierFilters();

                    console.log('SupplierPayments.SuppliersGridRead calling with', filters);

                    return `/supplier-payments-odata/SupplierPayments_SupplierRecords/SupplierPayments.SuppliersGridRead(dto=@d)?@d={"MemberID":${filters.memberId},"PeriodID":${filters.periodId},"OnlyShowSuppliersWhereProductionHasStopped":${filters.onlyShowSuppliersWhereProductionHasStopped},"OnlyShowSuppliersWhereShippingHasStopped":${filters.onlyShowSuppliersWhereShippingHasStopped},"OnlyShowSuppliersWhereGoodsAreHeld":${filters.onlyShowSuppliersWhereGoodsAreHeld}}`;
                }
            },
            //read: (options) => {

            //    self.busy(true);

            //    let webapi = new kendo.data.transports.webapi({ prefix: "" });

            //    let mapped = webapi.parameterMap(options.data);

            //    let data = self.filters.supplierFilters();

            //    for (var propertyName in mapped) {
            //        data[propertyName] = mapped[propertyName];
            //    }

            //    let qs = new URLSearchParams(data);

            //    fetch(`/api/SupplierPayments/SuppliersGridRead?${qs}`, {
            //        method: 'GET',
            //        headers: window.fetchHeaders,
            //        cache: 'no-cache',
            //        credentials: 'same-origin'
            //    })
            //        .then(window.handleFetchResponse)
            //        .then(data => {
            //            options.success(data.kendoGridResult);
            //            self.busy(false);
            //        })
            //        .catch(err => {
            //            self.busy(false);
            //            window.catchFetchError(err);
            //        });
            //},
            update: {
                url: function (item) {
                    return `/supplier-payments-odata/SupplierPayments_SupplierRecords('${item.SupplierCode}')`
                }
            },
            batch: {
                url: '/supplier-payments-odata/$batch'
            },
        },
        error: (e) => {
            console.error(`error`, e);
        },
        schema: {
            model: {
                id: 'SupplierCode',
                fields: {
                    SupplierCode: {
                        type: 'string',
                        editable: false
                    },
                    SupplierName: {
                        type: 'string',
                        editable: false
                    },
                    SupplierType: {
                        type: 'string',
                        editable: false
                    },
                    BudgetHolder: {
                        type: 'string',
                        editable: false
                    },
                    ProductionStopped: {
                        type: 'boolean',
                        editable: true
                    },
                    ShippingStopped: {
                        type: 'boolean',
                        editable: true
                    },
                    SupplierCurrencyCode: {
                        type: 'string',
                        editable: false
                    },
                    SupplierCurrencyFormattingCulture: {
                        type: 'string',
                        nullable: false,
                        editable: false
                    },
                    TotalValue: {
                        type: 'number',
                        nullable: false,
                        editable: false
                    },
                    NotDueTotalValue: {
                        type: 'number',
                        nullable: false,
                        editable: false
                    },
                    OverdueTotalValue: {
                        type: 'number',
                        nullable: false,
                        editable: false
                    },
                    Debt30DayValue: {
                        type: 'number',
                        nullable: false,
                        editable: false
                    },
                    Debt60DayValue: {
                        type: 'number',
                        nullable: false,
                        editable: false
                    },
                    Debt90DayValue: {
                        type: 'number',
                        nullable: false,
                        editable: false
                    },
                    Debt120DayValue: {
                        type: 'number',
                        nullable: false,
                        editable: false
                    },
                    TotalValueGBP: {
                        type: 'number',
                        nullable: false,
                        editable: false
                    },
                    NotDueTotalValueGBP: {
                        type: 'number',
                        nullable: false,
                        editable: false
                    },
                    OverdueTotalValueGBP: {
                        type: 'number',
                        nullable: false,
                        editable: false
                    },
                    Debt30DayValueGBP: {
                        type: 'number',
                        nullable: false,
                        editable: false
                    },
                    Debt60DayValueGBP: {
                        type: 'number',
                        nullable: false,
                        editable: false
                    },
                    Debt90DayValueGBP: {
                        type: 'number',
                        nullable: false,
                        editable: false
                    },
                    Debt120DayValueGBP: {
                        type: 'number',
                        nullable: false,
                        editable: false
                    }
                }
            },
            parse: function (data) {
                if (Array.isArray(data)) {
                    data.forEach(d => {
                        delete d['@odata.context'];
                    });
                } else {
                    for (let i = 0; i < data.value.length; i++) {
                        data.value[i] = supplierRecord({
                            rec: data.value[i],
                            parentGridWidget: self.gridWidget
                        });
                    }
                }

                console.log(`suppliers schema.parse called with`, data);

                return data;
            },
        },
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
        },
        noDataTemplate: 'Nothing to display',
        requestEnd: (e) => {

            console.log(`requestEnd`, e);

            self.busy(false);
        },
        change: (e) => {
            console.log(`suppliers dataSource change`, e);

            if (e.action === "itemchange") {
                $(`.suppliers-grid .k-button.k-grid-save-changes`).show();
                $(`.suppliers-grid .k-button.k-grid-cancel-changes`).show();
            }
        }
    });

    self.gridColumns = [{
        field: 'SupplierCode',
        title: 'Supplier Code',
        editable: false
    }, {
        field: 'SupplierName',
        title: 'Supplier Name',
        editable: false
    }, {
        field: 'SupplierType',
        title: 'Supplier Type',
        editable: false
    }, {
        field: 'BudgetHolder',
        title: 'Budget Holder',
        editable: false
    }, {
        field: 'ProductionStopped',
        title: 'Production Stopped',
        editable: true,
        attributes: (dataItem) => {
            if (dataItem.ProductionStopped) {
                return {
                    "class": "text-center"
                };
            } else {
                return {
                    "class": "text-center"
                }
            }
        },
        width: 126,
        template: (dataItem) => {
            return `<div data-bind="component: { name: 'mdc-checkbox-component', params: productionStoppedParams }"></div>`
        },
        valueTemplate: (dataItem) => {
            return `<div data-bind="component: { name: 'mdc-checkbox-component', params: productionStoppedParams }"></div>`
        },
        editor: (options, container) => {
            $(`<div data-bind="component: { name: 'mdc-checkbox-component', params: productionStoppedParams }"></div>`)
                .appendTo(container);
        }
    }, {
        field: 'ShippingStopped',
        title: 'Shipping Stopped',
        editable: true,
        attributes: (dataItem) => {
            if (dataItem.ShippingStopped) {
                return {
                    "class": "text-center"
                };
            } else {
                return {
                    "class": "text-center"
                }
            }
        },
        width: 126,
        template: (dataItem) => {
            return `<div data-bind="component: { name: 'mdc-checkbox-component', params: shippingStoppedParams }"></div>`
        },
        editor: (options, container) => {
            $(`<div data-bind="component: { name: 'mdc-checkbox-component', params: shippingStoppedParams }"></div>`)
                .appendTo(container);
    }
    }, {
        field: 'GoodsHeld',
        title: 'Goods Held',
        editable: true,
        attributes: (dataItem) => {
            if (dataItem.GoodsHeld) {
                return {
                    "class": "text-center"
                };
            } else {
                return {
                    "class": "text-center"
                }
            }
        },
        width: 126,
        template: (dataItem) => {
            return `<div data-bind="component: { name: 'mdc-checkbox-component', params: goodsHeldParams }"></div>`
        },
        editor: (options, container) => {
            $(`<div data-bind="component: { name: 'mdc-checkbox-component', params: goodsHeldParams }"></div>`)
                .appendTo(container);
        }
    }, {
        field: 'FinalisedDT',
        title: 'Finalised',
        width: 180,
        editable: false,
        template: (e) => {
            if (e.FinalisedDT) {
                return moment(e.FinalisedDT).format('dddd DD/MM/YYYY');
            } else {
                return '';
            }
        }
    }, {
        field: 'SupplierCurrencyCode',
        title: 'Currency',
        editable: false,
    }, {
        field: 'TotalValue',
        title: 'Total',
        width: 120,
        editable: false,
        template: (e) => {
            if (e.TotalValue != null) {
                return formatCurrency(e.TotalValue, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
            } else {
                return '';
            }
        }
    }, {
        field: 'NotDueTotalValue',
        title: 'Not Due',
        width: 120,
        editable: false,
        template: (e) => {
            if (e.TotalValue != null) {
                return formatCurrency(e.NotDueTotalValue, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
            } else {
                return '';
            }
        }
    }, {
        field: 'OverdueTotalValue',
        title: 'Overdue',
        width: 120,
        editable: false,
        template: (e) => {
            if (e.OverdueTotalValue != null) {
                return formatCurrency(e.OverdueTotalValue, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
            } else {
                return '';
            }
        }
    }, {
        field: 'Debt30DayValue',
        title: '30 day',
        width: 120,
        editable: false,
        template: (e) => {
            if (e.Debt30DayValue != null) {
                return formatCurrency(e.Debt30DayValue, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
            } else {
                return '';
            }
        }
    }, {
        field: 'Debt60DayValue',
        title: '60 day',
        width: 120,
        editable: false,
        template: (e) => {
            if (e.Debt60DayValue != null) {
                return formatCurrency(e.Debt60DayValue, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
            } else {
                return '';
            }
        }
    }, {
        field: 'Debt90DayValue',
        title: '90 day',
        width: 120,
        editable: false,
        template: (e) => {
            if (e.Debt90DayValue != null) {
                return formatCurrency(e.Debt90DayValue, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
            } else {
                return '';
            }
        }
    }, {
        field: 'Debt120DayValue',
        title: '120 day',
        width: 120,
        editable: false,
        template: (e) => {
            if (e.Debt120DayValue != null) {
                return formatCurrency(e.Debt120DayValue, 2, e.SupplierCurrencyFormattingCulture, e.SupplierCurrencyCode);
            } else {
                return '';
            }
        }
    }];

    self.gridParams = {
        autoBind: false,
        widget: self.gridWidget,
        columns: self.gridColumns,
        data: self.gridDataSource,
        scrollable: false,
        sortable: true,
        filterable: {
            extra: false,
        },
        reorderable: false,
        paging: true,
        pageSize: 20,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        selectable: false,
        editable: true,
        toolbar: [ 'save', 'cancel'],
        edit: function (e) {
            console.log(`edit`, e);
        },
        change: (e) => {
            console.log(`change`, e);
        },
        dataBound: (e) => {
            console.log(`dataBound`, e);

            var pristine = e.sender.dataSource.data().toJSON();

            ko.utils.arrayForEach(e.sender.dataSource.data(), function (item, index) {

                let rows = document.querySelectorAll('tr[data-uid="' + item.uid + '"]');

                rows.forEach(row => {
                    ko.cleanNode(row);

                    pristine[index] = supplierRecord({
                        rec: item,
                        parentGridWidget: self.gridWidget
                    });

                    ko.applyBindings(pristine[index], row);
                });
            });

            self.refreshDashboard();
        },
        save: (data) => {
            console.log(`saveChanges`, e);
        },
        saveChanges: (e) => {
            console.log('suppliers saveChanges', e);

            let data = e.sender.dataSource.data();

            for (let i = 0; i < data.length; i++) {

                let item = data[i];

                if (item.isNew() || item.dirty) {

                    delete item.productionStoppedParams;
                    delete item.shippingStoppedParams;
                    delete item.goodsHeldParams;

                }
            }
        },
        filterMenuInit: function (e) {
            // Find the first operator dropdown in the filter container
            var firstOperatorDropDown = e.container.find("[data-role='dropdownlist']").first()?.data("kendoDropDownList");

            if (firstOperatorDropDown) {
                firstOperatorDropDown.value("contains");
                firstOperatorDropDown.trigger("change");
            }
        },
        excel: {
            allPages: true
        },
        excelExport: (e) => {
            let now = new Date();

            e.workbook.fileName = `Payment-Supplier-Details_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.xlsx`;

            self.busy(false);
        }
    }

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds



    //#endregion



    //#region Subscriptions

    self.filters.supplierFilters.subscribe(nv => {
        self.refresh();
    });

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