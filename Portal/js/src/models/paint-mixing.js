const paintMixingViewModel = (() => {
    let self = {

    };

    // ELI5 it...

    //#region Properties

    // Is this view model busy
    self.busy = ko.observable(false);

    // The mixing location is given via the route parameter: /paint/mixing/{mixingLocation} is matched to [paint].[MixingLocation].[URLKeywords] and then serialized to JS
    self.mixingLocationId = ko.observable(getMixingLocationId());

    // How many outstanding orders are there? This appears in a little blue badge on the Outstanding Orders tab.
    self.outstandingOrderCount = ko.observable();

    // History count
    self.orderHistoryCount = ko.observable();

    // How many orders are there to invocie? This appears in a little blue badge on the Stock Orders to Invoice tab.
    self.ordersToInvoiceCount = ko.observable();

    // How many transfer orders are there?
    self.transfersCount = ko.observable();

    // Any transfer notice?
    self.transferNotice = ko.observable();

    // Selected transfer orders
    self.allTransferOrders = ko.observableArray([]);

    // Selected transfer orders
    self.selectedTransferMixingSessionIds = ko.observableArray([]);

    // Notice above label iframe in paint-labels-modal
    self.labelNotice = ko.observable();

    // Container for the response to [paint].[OrderLine_Select], called when a user selects a selectable Order from the Outstanding Orders Grid
    self.orderLinesResponse = ko.observable();

    self.orderLines = ko.observableArray([]);

    self.mixingSessions = ko.observableArray([]);

    self.checkedOrderLines = ko.observableArray([]);

    self.labelSource = ko.observable();

    self.boxCount = ko.observable(1).extend({
        numericWhole: {

        },
        required: {
            params: true,
            message: 'You must provide a box count'
        },
        //min: {
        //    params: 1,
        //    message: 'You must have packed at least one box'
        //},
        //max: {
        //    value: 99,
        //    message: 'We never honestly thought someone would pack that many lines at one time. Please consult itsupport@designersguild.com'
        //}
    });

    self.sessionNotificationWrapper = document.querySelector('#session-notification-wrapper');

    self.orderLinesModal = bootstrap.Modal.getOrCreateInstance(document.querySelector('#paint-order-lines-modal'));

    self.orderLinesModal._element.addEventListener('shown.bs.modal', () => {
        self.orderLinesModal._focustrap.deactivate();
    });

    self.boxCountModal = bootstrap.Modal.getOrCreateInstance(document.querySelector('#paint-box-count-modal'));

    self.labelsModal = bootstrap.Modal.getOrCreateInstance(document.querySelector('#paint-labels-modal'));

    self.labelsFrame = document.querySelector('#label-iframe');

    self.labelsFrame.addEventListener('load', (event) => {
        self.labelsFrame.focus();
        window.frames.labeliFrame.print();
    });


    //#endregion


    //#region Components

    self.outstandingOrdersGrid = {
        autoBind: true,
        widget: ko.observable(),
        data: new kendo.data.DataSource({
            transport: {
                read: (options) => {
                    var webapi = new kendo.data.transports.webapi({ prefix: "" });

                    var mapped = webapi.parameterMap(options.data);

                    var params = new URLSearchParams();

                    params.append('MixingLocationID', self.mixingLocationId());

                    for (var propertyName in mapped) {
                        params.append(propertyName, mapped[propertyName]);
                    }

                    fetch('/api/PaintMixingAPI/FetchOutstandingOrdersGrid?' + params, {
                        method: 'GET',
                        headers: window.fetchHeaders
                    })
                        .then(resp => resp.json())
                        .then(data => {
                            options.success(data);
                            self.outstandingOrderCount(data.Total);
                            console.log('FetchOutstandingOrdersGrid returned', data);
                        })
                        .catch(err => window.catchFetchError(err));
                }
            },
            pageSize: 10,
            pageable: {
                pageSize: 10,
                pageSizes: [10, 20, 50, 100, 250, 500, 'all']
            },
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            schema: $.extend({}, kendo.data.schemas.webapi, {
                data: "Data",
                total: "Total",
                errors: "Errors",
                aggregates: "Aggregates",
                model: {
                    ìd: 'OrderID',
                    fields: {
                        OrderID: {
                            type: 'number'
                        },
                        TradeAccountCode: {
                            type: 'string'
                        },
                        TradeAccountName: {
                            type: 'string'
                        },
                        OrderDT: {
                            type: 'date'
                        },
                        CustomerOrderReference: {
                            type: 'string'
                        },
                        HaulierCode: {
                            type: 'string'
                        },
                        CarriageCode: {
                            type: 'string'
                        },
                        Locked: {
                            type: 'boolean'
                        },
                        Status: {
                            type: 'string'
                        },
                        Priority: {
                            type: 'number'
                        },
                        DeliveryDescription: {
                            type: 'string'
                        }
                    }
                }
            }),
            sort: { field: "Priority", dir: "asc" },
            requestStart: function (e) {
                $("#grid-loading").show();
            },
            requestEnd: function (e) {
                $("#grid-loading").hide();
            }
        }),
        useKOTemplates: true,
        rowTemplate: 'outstanding-orders-row-template',
        selectable: 'single',
        scrollable: false,
        sortable: true,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        columns: [{
            field: 'Priority',
            title: 'Priority',
            width: 64
        }, {
            field: 'OrderID',
            title: 'Order ID',
            width: 100
        }, {
            field: 'OrderDT',
            title: 'Order Date',
            width: 128
        }, {
            field: 'TradeAccountCode',
            title: 'Trade Account'
        }, {
            field: 'CustomerOrderReference',
            title: 'Customer Order Reference'
        }, {
            field: 'Status',
            title: 'Status'
        }],
        change: (e) => {
            let items = e.sender.select();
            let grid = e.sender;

            items.each((i, e) => {
                let dataItem = grid.dataItem(e);
                if (dataItem.Locked === true) {
                    $(e).removeClass("k-state-selected");
                }
            });

            items = e.sender.select();

            if (items.length === 1) {
                let dataItem = grid.dataItem(items[0]);
                if (self.orderLinesResponse() && self.orderLinesResponse().OrderID == dataItem.OrderID) {
                    return;
                }
                self.fetchOrderLines(dataItem);
            }
        }
    }

    self.orderHistoryGrid = {
        autoBind: true,
        widget: ko.observable(),
        data: new kendo.data.DataSource({
            transport: {
                read: (options) => {
                    var webapi = new kendo.data.transports.webapi({ prefix: "" });

                    var mapped = webapi.parameterMap(options.data);

                    var params = new URLSearchParams();

                    params.append('MixingLocationID', self.mixingLocationId());

                    if (self.orderHistoryFrom())
                        params.append('FromDT', self.orderHistoryFrom().toISOString());

                    if (self.orderHistoryTo())
                        params.append('ToDT', self.orderHistoryTo().toISOString());

                    for (var propertyName in mapped) {
                        params.append(propertyName, mapped[propertyName]);
                    }

                    fetch('/api/PaintMixingAPI/FetchOrderHistoryGrid?' + params, {
                        method: 'GET',
                        headers: window.fetchHeaders
                    })
                        .then(resp => resp.json())
                        .then(data => {
                            options.success(data);
                            self.orderHistoryCount(data.Total);
                            console.log('FetchOrderHistoryGrid returned', data);
                        })
                        .catch(err => window.catchFetchError(err));
                }
            },
            pageSize: 10,
            pageable: {
                pageSize: 10,
                pageSizes: [10, 20, 50, 100, 250, 500, 'all']
            },
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            schema: $.extend({}, kendo.data.schemas.webapi, {
                data: "Data",
                total: "Total",
                errors: "Errors",
                aggregates: "Aggregates",
                model: {
                    ìd: 'OrderID',
                    fields: {
                        OrderID: {
                            type: 'number'
                        },
                        TradeAccountCode: {
                            type: 'string'
                        },
                        TradeAccountName: {
                            type: 'string'
                        },
                        OrderDT: {
                            type: 'date'
                        },
                        CustomerOrderReference: {
                            type: 'string'
                        },
                        HaulierCode: {
                            type: 'string'
                        },
                        CarriageCode: {
                            type: 'string'
                        },
                        Locked: {
                            type: 'boolean'
                        },
                        Status: {
                            type: 'string'
                        },
                        Priority: {
                            type: 'number'
                        }
                    }
                }
            }),
            sort: { field: "Status", dir: "desc" },
            //sort: { field: "Priority", dir: "asc" },
            requestStart: function (e) {
                $("#grid-loading").show();
            },
            requestEnd: function (e) {
                $("#grid-loading").hide();
            }
        }),
        useKOTemplates: true,
        rowTemplate: 'completed-orders-row-template',
        selectable: 'single',
        scrollable: false,
        sortable: true,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        columns: [{
            field: 'Priority',
            title: 'Priority',
            width: 64,
            hidden: true
        }, {
            field: 'OrderID',
            title: 'Order ID',
            width: 100
        }, {
            field: 'OrderDT',
            title: 'Order Date',
            width: 180
        }, {
            field: 'TradeAccountCode',
            title: 'Trade Account'
        }, {
            field: 'CustomerOrderReference',
            title: 'Customer Order Reference'
        }, {
            field: 'Status',
            title: 'Status'
        }],
        change: (e) => {
            let items = e.sender.select();
            let grid = e.sender;

            items.each((i, e) => {
                let dataItem = grid.dataItem(e);
                if (dataItem.Locked === true) {
                    $(e).removeClass("k-state-selected");
                }
            });

            items = e.sender.select();

            if (items.length === 1) {
                let dataItem = grid.dataItem(items[0]);
                if (self.orderLinesResponse() && self.orderLinesResponse().OrderID == dataItem.OrderID) {
                    return;
                }
                self.fetchOrderLines(dataItem);
            }
        }
    }

    self.orderLinesGrid = {
        autoBind: true,
        widget: ko.observable(),
        data: self.orderLines,
        useKOTemplates: true,
        rowTemplate: 'order-lines-row-template',
        selectable: false,
        scrollable: false,
        sortable: true,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        columns: [{
            field: 'LineNumber',
            title: '#',
            width: 40
        }, {
            field: 'Quantity Ordered',
            title: 'Quantity',
            width: 74,
            attributes: {
                class: 'text-end'
            },
            headerAttributes: {
                class: 'text-end'
            }
        }, {
            field: 'ProductCode',
            title: 'Product'
        }, {
            field: 'BaseProductCode',
            title: 'Base Product'
        }, {
            field: 'Status',
            title: 'Status'
        }, {
            field: 'Checkbox',
            title: ' ',
            width: 56
        }],
        change: (e) => {
            //let items = e.sender.select();
            //let grid = e.sender;

            //items.each((i, e) => {
            //    let dataItem = grid.dataItem(e);
            //    if (dataItem.Locked === true) {
            //        $(e).removeClass("k-state-selected");
            //    }
            //});
        }
    };

    self.ordersToInvoiceGrid = {
        autoBind: true,
        widget: ko.observable(),
        data: new kendo.data.DataSource({
            transport: {
                read: (options) => {
                    var webapi = new kendo.data.transports.webapi({ prefix: "" });

                    var mapped = webapi.parameterMap(options.data);

                    var params = new URLSearchParams();

                    params.append('MixingLocationID', self.mixingLocationId());

                    for (var propertyName in mapped) {
                        params.append(propertyName, mapped[propertyName]);
                    }

                    fetch('/api/PaintMixingAPI/FetchOrdersToInvoice?' + params, {
                        method: 'GET',
                        headers: window.fetchHeaders
                    })
                        .then(resp => resp.json())
                        .then(data => {
                            data.Data.map(d => {
                                d.busy = ko.observable(false);
                            })
                            options.success(data);
                            self.ordersToInvoiceCount(data.Total);
                            console.log('FetchOrdersToInvoice returned', data);
                        })
                        .catch(err => window.catchFetchError(err));
                }
            },
            pageSize: 10,
            pageable: {
                pageSize: 10,
                pageSizes: [10, 20, 50, 100, 250, 500, 'all']
            },
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            schema: $.extend({}, kendo.data.schemas.webapi, {
                data: "Data",
                total: "Total",
                errors: "Errors",
                aggregates: "Aggregates",
                model: {
                    ìd: 'BasePaintOrderID',
                    fields: {
                        BasePaintOrderID: {
                            type: 'string'
                        },
                        BasePaintOrderStatus: {
                            type: 'string'
                        },
                        OrderDT: {
                            type: 'date'
                        },
                        RequiresInvoicing: {
                            type: 'boolean'
                        },
                        MixingSessionID: {
                            type: 'number'
                        },
                        CustomerOrderID: {
                            type: 'string'
                        },
                        CustomerOrderReference: {
                            type: 'string'
                        }
                    }
                }
            }),
            sort: { field: "RequiresInvoicing", dir: "desc" },
            requestStart: function (e) {

            },
            requestEnd: function (e) {

            }
        }),
        useKOTemplates: true,
        rowTemplate: 'orders-to-invoice-row-template',
        selectable: false,
        scrollable: false,
        sortable: true,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        columns: [{
            field: 'BasePaintOrderID',
            title: 'Stock Order #',
            width: 140
        }, {
            field: 'BasePaintOrderStatus',
            title: 'Status'
        }, {
            field: 'OrderDT',
            title: 'Order Date'
        }, {
            field: '',
            title: ''
        }],
        change: (e) => {

        }
    }

    self.transfersFirstRun = true;

    self.transfersGrid = {
        autoBind: true,
        widget: ko.observable(),
        data: new kendo.data.DataSource({
            transport: {
                read: (options) => {
                    var webapi = new kendo.data.transports.webapi({ prefix: "" });

                    var mapped = webapi.parameterMap(options.data);

                    var params = new URLSearchParams();

                    params.append('MixingLocationID', self.mixingLocationId());

                    for (var propertyName in mapped) {
                        params.append(propertyName, mapped[propertyName]);
                    }

                    fetch('/api/PaintMixingAPI/FetchTranfers?' + params, {
                        method: 'GET',
                        headers: window.fetchHeaders
                    })
                        .then(resp => resp.json())
                        .then(data => {
                            console.log('FetchTranfers returned', data);
                            if (data.Notices.ErrorMessage !== null) {
                                window.showError(data.Notices.ErrorMessage);
                            } else {
                                data.dsResult.Data.map(o => {
                                    let object = Object.assign(o, {
                                        elementHolder: ko.observable(),
                                        checkboxParams: {
                                            checkboxId: `transfer-order-${o.OrderID}}-checkbox`,
                                            observable: ko.observable(),
                                            originalValue: false,
                                            useNativeValidation: false,
                                            disable: ko.observable(false),
                                            enable: ko.observable(true),
                                            busy: ko.observable(false)
                                        }
                                    });
                                    object.checkboxParams.observable.subscribe(nv => {
                                        console.log('order checkbox', nv);
                                        if (nv) {
                                            object.elementHolder.DOMElement.classList.add('k-state-selected');
                                            if (self.selectedTransferMixingSessionIds().indexOf(object.MixingSessionID) == -1)
                                                self.selectedTransferMixingSessionIds().push(object.MixingSessionID);
                                        } else {
                                            object.elementHolder.DOMElement.classList.remove('k-state-selected');
                                            self.selectedTransferMixingSessionIds.remove(object.MixingSessionID);
                                        }
                                    });
                                    return object;
                                });
                                options.success(data.dsResult);
                                self.allTransferOrders(data.AllResults);
                                if (self.transfersFirstRun) {
                                    self.selectedTransferMixingSessionIds(self.allTransferOrders().flatMap(o => o.MixingSessionID));
                                    self.transfersFirstRun = false;
                                }
                                self.transferNotice(data.Notices.Notification)
                                self.transfersCount(data.dsResult.Total);
                            }
                        })
                        .catch(err => window.catchFetchError(err));
                }
            },
            pageSize: 5,
            pageable: {
                pageSize: 5,
                pageSizes: [1, 2, 5, 10, 20, 50, 100, 250, 500, 'all']
            },
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            schema: $.extend({}, kendo.data.schemas.webapi, {
                data: "Data",
                total: "Total",
                errors: "Errors",
                aggregates: "Aggregates",
                model: {
                    ìd: 'MixingSessionID',
                    fields: {
                        OrderID: {
                            type: 'string'
                        },
                        BoxCount: {
                            type: 'number'
                        },
                        MixingSessionID: {
                            type: 'number'
                        },
                        LastPrintedDT: {
                            type: 'date'
                        }
                    }
                }
            }),
            sort: { field: "OrderID", dir: "desc" }
        }),
        useKOTemplates: true,
        rowTemplate: 'transfer-row-template',
        selectable: false,
        scrollable: false,
        sortable: true,
        pageable: {
            pageSize: 5,
            pageSizes: [1, 2, 5, 10, 20, 50, 100, 250, 500, 'all']
        },
        columns: [{
            field: 'OrderID',
            title: 'Order ID',
            width: 140
        }, {
            field: 'BoxCount',
            title: 'Box Count',
            headerAttributes: {
                class: 'text-center'
            }
        }, {
            field: 'LastPrintedDT',
            title: 'Last Printed',
        }, {
            field: 'MixingSessionID',
            title: 'Mixing Session ID',
            width: 140,
            headerAttributes: {
                class: 'text-center'
            },
            hidden: true
        }, {
            field: '',
            title: ' ',
            width: 56,
            headerAttributes: {
                class: 'text-center'
            },
            headerTemplate: `<div id="transfer-orders-select-all" data-bind="component: { name: 'mdc-checkbox-component', params: transferOrdersSelectAll }"></div>`
        }],
        change: function (e, args) {
            let grid = e.sender;
            let items = grid.items();

            items.each(function (idx, row) {
                var dataItem = grid.dataItem(row);
                if (row.className.indexOf("k-state-selected") >= 0) {
                    if (self.selectedTransferMixingSessionIds().indexOf(dataItem.MixingSessionID) == -1)
                        self.selectedTransferMixingSessionIds.push(dataItem.MixingSessionID);
                } else {
                    self.selectedTransferMixingSessionIds.remove(so => {
                        so == dataItem.MixingSessionID
                    })
                }
            });
        },
        dataBound: function (e) {
            if (ko.contextFor(document.querySelector('#transfer-orders-select-all')) == null) {
                ko.cleanNode(document.querySelector('#transfer-orders-select-all'));
                ko.applyBindings(self, document.querySelector('#transfer-orders-select-all'))
            }

            window.setTimeout(() => {
                let grid = e.sender;
                let items = grid.items();
                
                let itemsToSelect = [];

                items.each(function (idx, row) {
                    var dataItem = grid.dataItem(row);
                    let o = self.selectedTransferMixingSessionIds().find(so => so == dataItem['MixingSessionID']);
                    if (o) {
                        itemsToSelect.push({ dataItem: o, element: row });
                    }
                });

                e.sender.select(itemsToSelect.map(i => i.element));

                window.setTimeout(() => {
                    itemsToSelect.forEach(item => {
                        let o = grid.dataItem(item.element)
                        o.checkboxParams.observable(true);
                        o.checkboxParams.observable.mdcCheckbox.checked = true;
                    })
                }, 0);

            }, 0);
        }
    }

    self.boxCountParams = {
        inputType: 'number',
        minValue: 1,
        maxValue: 99,
        step: 1,
        large: true,
        observable: self.boxCount,
        busy: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(false),
        clearFunction: () => {
            self.boxCount(undefined);
        },
        revertable: ko.observable(false),
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true,
        increment: () => {
            if (self.boxCount() < 99)
                self.boxCount((+self.boxCount()) + 1);
        },
        decrement: () => {
            if (self.boxCount() > 1)
                self.boxCount((+self.boxCount()) - 1);
        },
        enterKey: () => {

        }
    };

    self.transferOrdersSelectAll = {
        checkboxId: `transfer-orders-select-all`,
        observable: ko.observable(true),
        originalValue: false,
        useNativeValidation: false,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false)
    }

    let from = new Date();

    from.setMonth(from.getMonth() - 1);

    let to = new Date();

    to.setDate(to.getDate() + 1);

    self.orderHistoryFrom = ko.observable(from);

    self.orderHistoryTo = ko.observable(to);

    self.orderHistoryFromParams = {
        label: 'From Date',
        observable: self.orderHistoryFrom,
        displayObservable: ko.observable(),
        dateTimePickerOptions: {
            localization: {
                locale: 'en-GB',
                format: 'ddd Do MMM yyyy'
            },
            display: {
                sideBySide: false,
                components: {
                    clock: false
                },
                //cellSize: '4rem'
            },
            restrictions: {
                disabledDates: []
            },
            allowInputToggle: true,
            useCurrent: false,
            keepInvalid: true,
            debug: false,
            eventHandlers: {
                onChange: (e) => {
                    self.orderHistoryTo.tempusDominus.updateOptions({
                        restrictions: {
                            minDate: e.date,
                        },
                    });
                }
            }
        },
        clearable: ko.observable(true),
        clearFunction: () => {
            self.orderHistoryFrom(undefined);
        },
        revertable: ko.observable(false),
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true
    };

    self.orderHistoryToParams = {
        label: 'To Date',
        observable: self.orderHistoryTo,
        displayObservable: ko.observable(),
        dateTimePickerOptions: {
            localization: {
                locale: 'en-GB',
                format: 'ddd Do MMM yyyy'
            },
            display: {
                sideBySide: false,
                components: {
                    clock: false
                },
                //cellSize: '4rem'
            },
            restrictions: {
                disabledDates: []
            },
            allowInputToggle: true,
            useCurrent: false,
            keepInvalid: true,
            debug: false,
            eventHandlers: {
                onChange: (e) => {
                    self.orderHistoryFrom.tempusDominus.updateOptions({
                        restrictions: {
                            maxDate: e.date,
                        },
                    });
                }
            }
        },
        clearable: ko.observable(true),
        clearFunction: () => {
            self.orderHistoryTo(undefined);
        },
        revertable: ko.observable(false),
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true
    };
    //#endregion


    //#region Subscriptions

    self.transferOrdersSelectAll.observable.subscribe(nv => {
        //let items = self.transfersGrid.widget().items();
        //let select = [];
        if (nv) {
            self.selectedTransferMixingSessionIds(self.allTransferOrders().flatMap(o => o.MixingSessionID));
            //items.each((i, item) => {
            //    let o = self.transfersGrid.widget().dataItem(item);
            //    o.checkboxParams.observable(true);
            //    o.checkboxParams.observable.mdcCheckbox.checked = true;
            //    select.push(item);
            //});
        } else {
            self.selectedTransferMixingSessionIds([]);
            self.transfersGrid.widget().dataSource.data().forEach(d => {
                d.checkboxParams.observable(false);
            });
            self.transfersGrid.widget().clearSelection();
        }
        //self.transfersGrid.widget().select(select);
    });

    self.checkedOrderLines.subscribe((nv) => {
        if (nv.length) {
            self.sessionNotificationWrapper.classList.add('open');
        } else {
            self.sessionNotificationWrapper.classList.remove('open');
        }
    });

    //#endregion


    //#region Computeds

    self.orderLineResponseComputer = ko.computed(() => {
        let response = self.orderLinesResponse();

        if (response) {
            self.orderLines(response.OrderLines.map(ol => {
                let orderLine = Object.assign(ol, {
                    elementHolder: ko.observable(),
                    checkboxParams: {
                        checkboxId: `order-line-${ol.OrderLineID}}-checkbox`,
                        observable: ko.observable(),
                        originalValue: false,
                        useNativeValidation: false,
                        disable: ko.observable(ol.Locked),
                        enable: ko.observable(!ol.Locked),
                        busy: ko.observable(false)
                    }
                });
                orderLine.checkboxParams.observable.subscribe(nv => {
                    if (nv) {
                        orderLine.elementHolder.DOMElement.classList.add('k-state-selected');
                    } else {
                        orderLine.elementHolder.DOMElement.classList.remove('k-state-selected');
                    }
                });
                return orderLine;
            }));
            self.mixingSessions(response.MixingSessions);
        } else {
            self.orderLines([]);
            self.mixingSessions([]);
        }
    }, self);

    self.checkedOrderLinesComputer = ko.computed(() => {
        if (self.orderLines()) {
            self.checkedOrderLines(self.orderLines().filter(ol => ol.checkboxParams.observable()))
        } else {
            self.checkedOrderLines([]);
        }
    });

    self.checkedOrdersCountDisplay = ko.computed(() => {
        let count = self.checkedOrderLines().length;
        if (count) {
            return `You have mixed ${count} line${(count > 1 ? 's' : '')} so far.`
        }
    }, self);

    //#endregion


    //#region Methods

    self.ready = () => {
        self.busy(false);
    }

    self.fetchOrderLines = (dataItem) => {
        self.busy(true);
        fetch('/api/PaintMixingAPI/FetchOrderLines', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-store',
            credentials: 'same-origin',
            body: JSON.stringify({
                orderId: dataItem.OrderID
            })
        })
        .then(window.handleFetchResponse)
        .then(response => {
            self.busy(false);
            response.OrderID = dataItem.OrderID;
            console.log(response);
            if (response.Notices.ErrorMessage) {
                window.showError(response.Notices.ErrorMessage);
            } else {
                self.orderLinesResponse(Object.assign(response, dataItem));
                self.showOrderLinesModal();
                self.outstandingOrdersGrid.widget().one("dataBound", function (e) {
                    e.sender.select(document.querySelector(`tr[data-order-id="${self.orderLinesResponse().OrderID}"]`));
                });
                self.outstandingOrdersGrid.widget().dataSource.read();
            }
        })
        .catch(err => {
            self.busy(false);
            window.catchFetchError(err);
        })
    }

    self.closeOrderLinesModal = () => {
        if (self.checkedOrderLines().length) {
            window.showConfirm('Are you sure?', `This will relinquish Order ${self.orderLinesResponse().OrderID}.`, () => {
                self.relinquishOrderLines(self.orderLinesResponse());
            });
        } else {
            self.relinquishOrderLines(self.orderLinesResponse());
        }
    }

    self.relinquishOrderLines = (dataItem, notify = true) => {
        if (!self.busy()) {
            self.busy(true);
            fetch('/api/PaintMixingAPI/RelinquishOrderLines', {
                method: 'POST',
                headers: window.fetchHeaders,
                cache: 'no-store',
                credentials: 'same-origin',
                body: JSON.stringify({
                    orderId: dataItem.OrderID
                })
            })
            .then(window.handleFetchResponse)
            .then(response => {
                console.log(response);
                self.busy(false);
                if (response.Notices.ErrorMessage) {
                    window.showError(response.Notices.ErrorMessage);
                } else {
                    self.orderLinesResponse(undefined);
                    self.checkedOrderLines([]);
                    if (notify) {
                        self.outstandingOrdersGrid.widget().dataSource.read();
                    }
                    self.hideOrderLinesModal();
                    self.hideBoxCountModal();
                    window.hideConfirm();
                    if (response.Notices.Notification) {
                        window.showInfo('Info', response.Notices.Notification);
                    }
                }
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
        }
    }

    self.saveMixedLines = () => {
        let lineCount = self.checkedOrderLines().length;
        let boxCount = self.boxCount();

        window.centerConfirmModal();

        window.showConfirm('<span class="fs-4">Please Confirm</span>', `<p class="mb-0 fs-5">Are you sure you've just processed <span class="bold d-inline-block">${lineCount} ${(lineCount > 1 ? 'lines' : 'line')}</span> into <span class="bold d-inline-block">${boxCount} ${(boxCount > 1 ? 'boxes' : 'box')}</span>?</p>`, () => {
            self.busy(true);
            fetch('/api/PaintMixingAPI/SaveOrderLines', {
                method: 'POST',
                headers: window.fetchHeaders,
                cache: 'no-store',
                credentials: 'same-origin',
                body: JSON.stringify({
                    orderId: self.orderLinesResponse().OrderID,
                    orderLineIds: self.checkedOrderLines().map(ol => ol.OrderLineID),
                    boxCount: boxCount
                })
            })
                .then(window.handleFetchResponse)
                .then(response => {
                    self.busy(false);
                    console.log('SaveOrderLines returned', response);
                    if (response.ErrorMessage) {
                        window.showError(response.ErrorMessage);
                    } else {
                        window.centerInfoModal();
                        //window.showInfo('<span class="fs-4 text-sucess">Success</span>', response.Notification);
                        self.labelNotice(response.Notification);
                        self.orderLinesResponse().MixingSessionID = response.MixingSessionID;
                        self.fetchBoxLabels(self.orderLinesResponse().MixingSessionID, () => {
                            self.fetchOrderLines(self.orderLinesResponse());
                        });
                    }
                })
                .catch(err => {
                    self.busy(false);
                    window.catchFetchError(err);
                })
        });
    }

    // cheers: https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
    self.b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });

        return blob;
    }

    self.fetchBoxLabels = (mixingSessionId, onSuccess) => {
        self.busy(true);
        fetch('/api/PaintMixingAPI/FetchBoxLabels', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-store',
            credentials: 'same-origin',
            body: JSON.stringify({
                mixingSessionId: mixingSessionId
            })
        })
        .then(window.handleFetchResponse)
        .then(response => {
            self.busy(false);
            console.log('FetchBoxLabels returned', response);
            if (response.Notices.ErrorMessage) {
                window.showError(response.Notices.ErrorMessage);
            } else {
                self.boxCount(1);

                if (response.DocumentBytes) {
                    let file = self.b64toBlob(response.DocumentBytes, 'application/pdf');
                    let fileURL = window.URL.createObjectURL(file);

                    self.labelSource(fileURL);
                    self.showLabelsModal();



                    //let tab = window.open();
                    //tab.location.href = fileURL;
                    //tab.focus();
                    //tab.print();
                }
                if (typeof onSuccess === 'function') {
                    onSuccess();
                }
            }
        })
        .catch(err => {
            self.busy(false);
            window.catchFetchError(err);
        })
    }

    self.produceTransferManifest = () => {
        if (self.selectedTransferMixingSessionIds().length) {
            self.busy(true);
            fetch('/api/PaintMixingAPI/FetchTransferManifest', {
                method: 'POST',
                headers: window.fetchHeaders,
                cache: 'no-store',
                credentials: 'same-origin',
                body: JSON.stringify({
                    mixingLocationId: getMixingLocationId(),
                    transferOrders : self.allTransferOrders().flatMap(t => self.selectedTransferMixingSessionIds().indexOf(t.MixingSessionID) > -1 ? [t] : [])
                })
            })
            .then(window.handleFetchResponse)
            .then(response => {
                self.busy(false);
                console.log('FetchTransferManifest returned', response);
                if (response.Notices.ErrorMessage) {
                    window.showError(response.Notices.ErrorMessage);
                } else {
                    if (response.DocumentBytes) {
                        let file = self.b64toBlob(response.DocumentBytes, 'application/pdf');
                        let fileURL = window.URL.createObjectURL(file);

                        self.labelSource(fileURL);
                        self.showLabelsModal();
                    }
                    if (typeof onSuccess === 'function') {
                        onSuccess();
                    }
                }
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
        } else {
            window.showError('You must selected at least one Transfer record');
        }
    }

    self.stockOrderUpdateStatus = (dataItem) => {
        dataItem.busy(true);
        fetch('/api/PaintMixingAPI/UpdateBasePaintOrderStatus', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-store',
            credentials: 'same-origin',
            body: JSON.stringify({
                mixingSessionId: dataItem.MixingSessionID
            })
        })
        .then(window.handleFetchResponse)
        .then(response => {
            dataItem.busy(false);
            console.log('UpdateBasePaintOrderStatus returned', response);
        })
        .catch(err => {
            dataItem.busy(false);
            window.catchFetchError(err);
        })
    }

    self.stockOrderUpdateAll = () => {
        self.busy(true);
        fetch('/api/PaintMixingAPI/UpdateBasePaintOrderStatusAll', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-store',
            credentials: 'same-origin'
        })
            .then(window.handleFetchResponse)
            .then(response => {
                self.busy(false);
                console.log('UpdateBasePaintOrderStatusAll returned', response);
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
    }

    self.showOrderLinesModal = () => {
        self.orderLinesModal.show();
    }

    self.hideOrderLinesModal = () => {
        self.orderLinesModal.hide();
    }

    self.showBoxCountModal = () => {
        self.boxCountModal.show();
    }

    self.hideBoxCountModal = () => {
        self.boxCountModal.hide();
    }

    self.showLabelsModal = () => {
        self.labelsModal.show();
    }

    self.hideLabelsModal = () => {
        self.hideModal.show();
    }

    //self.refresh = () => {
    //    self.mixingLocationId.valueHasMutated();
    //}

    self.toJS = () => {
        return {};
    }

    self.toJSON = () => JSON.stringify(self.toJS());

    //#endregion

    window.addEventListener('beforeunload', (event) => {
        if (self.orderLinesResponse()) {
            self.relinquishOrderLines(self.orderLinesResponse(), false);
        }
    });

    return self;
});