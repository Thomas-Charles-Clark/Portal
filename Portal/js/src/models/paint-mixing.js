const paintMixingViewModel = (() => {
    let self = {

    };

    // ELI5 it...

    //#region Properties

    // Is this view model busy
    self.busy = ko.observable(false);

    // Do we want to "hold" busy: sometimes we're doing two or more fetch calls at once,
    // and we don't want busy being cleared by the first call returning.
    // Set holdBusy to some number, make sure the involved fetch calls decrement holdBusy on return.
    self.holdBusy = ko.observable(0);

    self.holdBusy.subscribe(nv => {
        if (nv <= 0) {
            self.busy(false);
            self.holdBusy(0);
        }
        else
            self.busy(true);
    });

    // The mixing location is given via the route parameter: /paint/mixing/{mixingLocation} is matched to [paint].[MixingLocation].[URLKeywords] and then serialized to JS
    self.mixingLocationId = ko.observable(getMixingLocationId());

    // How many outstanding orders are there? This appears in a little blue badge on the Outstanding Orders tab.
    self.outstandingOrderCount = ko.observable();

    // History count
    self.orderHistoryCount = ko.observable();

    // How many orders are there to invocie? This appears in a little blue badge on the Stock Orders to Invoice tab.
    self.ordersToInvoiceCount = ko.observable();

    // How many orders are there to invocie? This appears in a little blue badge on the Stock Orders to Invoice tab.
    self.ordersToInvoiceExceptionCount = ko.observable();

    // How many transfer orders are there?
    self.transfersCount = ko.observable();

    // How many transfer orders are there?
    self.historicalTransfersCount = ko.observable();

    // Any orders to invoice notice?
    self.ordersToInvoiceNotice = ko.observable();

    // Any orders to invoice exception notice?
    self.ordersToInvoiceExceptionNotice = ko.observable();

    // Any transfer notice?
    self.transferNotice = ko.observable();

    // Selected transfer orders
    self.allTransferOrders = ko.observableArray([]);

    // Selected transfer orders
    self.allHistoricalTransferOrders = ko.observableArray([]);

    // Selected transfer orders
    self.selectedTransferMixingSessionIds = ko.observableArray([]);

    // Selected transfer orders
    self.selectedHistoricalTransferMixingSessionIds = ko.observableArray([]);

    // Notice above label iframe in paint-labels-modal
    self.labelNotice = ko.observable();

    self.selectedOrderId = ko.observable();

    self.orderLinesGridMode = ko.observable('M');

    // Container for the response to [paint].[OrderLine_Select], called when a user selects a selectable Order from the Outstanding Orders Grid
    self.dataItem = ko.observable();

    self.orderLinesResponse = ko.observable();

    self.orderLines = ko.observableArray([]);

    self.orderLines.subscribe(nv => {
        //console.log('orderLines change', nv)
    }, self, 'arrayChange');

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
        //window.frames.labelsFrame.print();
    });

    self.transferDates = ko.observableArray([]);

    self.transferHistoricalDates = ko.observableArray([]);

    document.querySelector('#outstanding-orders-tab-btn').addEventListener('click', () => {
        self.outstandingOrdersGrid.widget().dataSource.read();
    });

    document.querySelector('#completed-orders-tab-btn').addEventListener('click', () => {
        self.orderHistoryGrid.widget().dataSource.read();
    });

    document.querySelector('#stock-orders-tab-btn').addEventListener('click', () => {
        self.ordersToInvoiceGrid.widget().dataSource.read();
    });

    document.querySelector('#stock-orders-exception-tab-btn').addEventListener('click', () => {
        self.ordersToInvoiceExceptionsGrid.widget().dataSource.read();
    });

    document.querySelector('#transfers-tab-btn').addEventListener('click', () => {
        self.transfersGrid.widget().one('dataBound', (ev) => {
            window.setTimeout(() => {
                self.transferOrdersSelectAll.observable(false);
                window.setTimeout(() => {
                    self.transferOrdersSelectAll.observable(true);
                }, 0);
            }, 0);
        });
        self.transfersGrid.widget().dataSource.read();
    });

    document.querySelector('#transfers-history-tab-btn').addEventListener('click', () => {
        self.transfersHistoryGrid.widget().dataSource.read();
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
                            //console.log('FetchOutstandingOrdersGrid returned', data);
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
                        Delivery: {
                            type: 'boolean'
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
                        },
                        GenerateBoxLabel: {
                            type: 'boolean'
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
            field: 'Delivery',
            title: ' ',
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

                    if (self.orderHistorySearch()) 
                        params.append('SearchTerm', self.orderHistorySearch())

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
                            //console.log('FetchOrderHistoryGrid returned', data);
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
                        Delivery: {
                            type: 'boolean'
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
                        GenerateBoxLabel: {
                            type: 'boolean'
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
            field: 'Delivery',
            title: ' ',
            width: 64
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
                self.fetchOrderLines(dataItem, 'H');
            }
        }
    }

    self.orderLinesGrid = {
        autoBind: false,
        widget: ko.observable(),
        data: new kendo.data.DataSource({
            transport: {
                read: (options) => {
                    var webapi = new kendo.data.transports.webapi({ prefix: "" });

                    var mapped = webapi.parameterMap(options.data);

                    var params = new URLSearchParams();

                    params.append('MixingLocationID', self.mixingLocationId());

                    params.append('OrderID', self.selectedOrderId());

                    params.append('Mode', self.orderLinesGridMode());

                    for (var propertyName in mapped) {
                        params.append(propertyName, mapped[propertyName]);
                    }

                    fetch('/api/PaintMixingAPI/FetchOrderLinesGrid?' + params, {
                        method: 'GET',
                        headers: window.fetchHeaders
                    })
                        .then(resp => resp.json())
                        .then(data => {
                            if (data.dsResult) {
                                data.dsResult.Data.map(ol => {
                                    let orderLine = Object.assign(ol, {
                                        elementHolder: ko.observable(),
                                        checkboxParams: {
                                            checkboxId: `order-line-${ol.OrderLineID}-checkbox`,
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
                                });
                                self.orderLines(data.dsResult.Data);
                                options.success(data.dsResult);
                                self.mixingSessions(data.MixingSessions.map(ms => {
                                    ms.boxCount = ko.observable(ms.BoxCount);
                                    ms.fetchBoxLabels = () => {
                                        self.fetchBoxLabels(ms.MixingSessionID);
                                    }
                                    ms.boxCountSavedSuccessfully = ko.observable(false);
                                    ms = Object.assign({
                                        boxCountParams: {
                                            inputType: 'number',
                                            minValue: 1,
                                            maxValue: 99,
                                            step: 1,
                                            large: false,
                                            observable: ms.boxCount,
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
                                                if (ms.boxCount() < 99)
                                                    ms.boxCount((+ms.boxCount()) + 1);
                                            },
                                            decrement: () => {
                                                if (ms.boxCount() > 1)
                                                    ms.boxCount((+ms.boxCount()) - 1);
                                            },
                                            enterKey: () => {

                                            }
                                        }
                                    }, ms);

                                    ms.savedTimer = null;

                                    ms.saveBoxCount = () => {
                                        ms.boxCountParams.busy(true);
                                        fetch('/api/PaintMixingAPI/SaveBoxCount', {
                                            method: 'POST',
                                            headers: window.fetchHeaders,
                                            cache: 'no-store',
                                            credentials: 'same-origin',
                                            body: JSON.stringify({
                                                mixingSessionId: ms.MixingSessionID,
                                                boxCount: ms.boxCount()
                                            })
                                        })
                                            .then(window.handleFetchResponse)
                                            .then(response => {
                                                ms.boxCountParams.busy(false);
                                                //console.log('SaveBoxCount returned', response);
                                                if (response.ErrorMessage) {
                                                    window.showError(response.ErrorMessage);
                                                } else {
                                                    if (ms.savedTimer)
                                                        window.clearTimeout(ms.savedTimer);
                                                    ms.boxCountSavedSuccessfully(true);
                                                    document.querySelector(`#mixing-session-${ms.MixingSessionID}-collapse-btn`).click();
                                                    ms.savedTimer = window.setTimeout(() => {
                                                        ms.boxCountSavedSuccessfully(false);
                                                        self.orderLinesGrid.widget().dataSource.read();
                                                    }, 500);
                                                }
                                            })
                                            .catch(err => {
                                                ms.boxCountParams.busy(false);
                                                window.catchFetchError(err);
                                            })
                                    }

                                    return ms;
                                }));
                                data.OrderID = self.selectedOrderId();
                                self.orderLinesResponse(Object.assign(self.dataItem(), data));
                            } else {
                                options.success({});
                                console.error('FetchOrderLinesGrid returned a NULL dsResult');
                                window.showError();
                            }
                            //console.log('FetchOrderLinesGrid returned', data);
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
                    ìd: 'OrderLineID',
                    fields: {
                        OrderLineID: {
                            type: 'string'
                        },
                        LineNumber: {
                            type: 'number'
                        },
                        ImageID: {
                            type: 'number'
                        },
                        QuantityOrdered: {
                            type: 'number'
                        },
                        ProductCode: {
                            type: 'string'
                        },
                        ProductName: {
                            type: 'string'
                        },
                        BaseProductQuantity: {
                            type: 'number'
                        },
                        BaseProductCode: {
                            type: 'string'
                        },
                        BaseProductName: {
                            type: 'string'
                        },
                        Locked: {
                            type: 'boolean'
                        },
                        Status: {
                            type: 'string'
                        },
                        MixingSessionID: {
                            type: 'number'
                        },
                        MixedDT: {
                            type: 'date'
                        },
                        MixedBy: {
                            type: 'string'
                        },
                        BoxCount: {
                            type: 'number'
                        },
                        MixingSessionLabel: {
                            type: 'string'
                        }
                    }
                }
            }),
            group: [{
                field: 'MixingSessionLabel',
                sort: {
                    dir: 'asc'
                }
            }]
        }),
        useKOTemplates: true,
        rowTemplate: 'order-lines-row-template',
        selectable: false,
        scrollable: false,
        sortable: true,
        groupable: false,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        columns: [{
            field: 'LineNumber',
            title: '#',
            width: 40,
            headerAttributes: {
                class: 'text-end'
            }
        }, {
            field: 'ImageID',
            title: ' ',
            width: 64
        }, {
            field: 'QuantityOrdered',
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
            field: 'BaseProductQuantity',
            title: 'Base Quantity',
            width: 110,
            attributes: {
                class: 'text-end'
            },
            headerAttributes: {
                class: 'text-end'
            }
        }, {
            field: 'BaseProductCode',
            title: 'Base Product'
        }, {
            field: 'Status',
            title: 'Status'
        }, {
            field: 'MixingSessionLabel',
            title: 'Mixing Session Label',
            groupHeaderTemplate: (row, aggregates) => {
                return row.value ?? "<strong>Not Yet Mixed</strong>";
            },
            hidden: true
        }, {
            field: 'Checkbox',
            title: ' ',
            width: 56
        }],
        dataBound: (e) => {
            window.setTimeout(() => {
                document.querySelectorAll('#paint-order-lines-modal .k-grouping-row').forEach(r => {
                    let mixingSession = self.mixingSessions().find(ms => {
                        if (r.querySelector('.d-inline-flex'))
                            return r.querySelector('.d-inline-flex').dataset.mixingSessionId == ms.MixingSessionID;
                    });
                    ko.cleanNode(r);
                    ko.applyBindings(mixingSession, r);
                })
            }, 0);

            let dataView = e.sender.dataSource.view();

            for (var i = 0; i < dataView.length; i++) {
                for (var j = 0; j < dataView[i].items.length; j++) {
                    if (dataView[i].items[j].MixingSessionID != null) {

                        let prevEleSub = dataView[i].items[j].elementHolder.DOMElement.previousElementSibling;

                        while (prevEleSub != null && !prevEleSub.classList.contains('k-grouping-row')) {
                            prevEleSub = prevEleSub.previousElementSibling;
                        }

                        e.sender.collapseGroup(prevEleSub);
                    }
                }
            }
        },
        change: (e) => {

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
                            if (data.dsResult) {
                                data.dsResult.Data.map(d => {
                                    d.busy = ko.observable(false);
                                })
                                options.success(data.dsResult);
                                self.ordersToInvoiceCount(data.dsResult.Total);
                                self.ordersToInvoiceNotice(data.Notices.Notification);
                            } else {
                                options.success({});
                                console.error('FetchOrdersToInvoice returned a NULL dsResult');
                                window.showError();
                            }
                            //console.log('FetchOrdersToInvoice returned', data);
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

    self.ordersToInvoiceExceptionsGrid = {
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

                    params.append('Mode', 'E');

                    fetch('/api/PaintMixingAPI/FetchOrdersToInvoiceExceptions?' + params, {
                        method: 'GET',
                        headers: window.fetchHeaders
                    })
                        .then(resp => resp.json())
                        .then(data => {
                            console.log('FetchOrdersToInvoiceExceptions returned', data);
                            if (data.dsResult) {
                                data.dsResult.Data.map(d => {
                                    d.busy = ko.observable(false);
                                })
                                options.success(data.dsResult);
                                self.ordersToInvoiceExceptionCount(data.dsResult.Total);
                                self.ordersToInvoiceExceptionNotice(data.Notices.Notification);
                            } else {
                                options.success({});
                            }
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

    self.getTransferGridFilteredItems = () => {
        let ds = self.transfersGrid.widget().dataSource;

        let filters = ds.filter();

        let allData = ds.data();

        let query = new kendo.data.Query(allData);

        let results = query.filter(filters).data.slice();

        self.transfersCount(results.length);

        return results;
    }

    self.historicalTransfersFirstRun = true;

    self.getHistoricalTransferGridFilteredItems = () => {
        let ds = self.transfersHistoryGrid.widget().dataSource;

        let filters = ds.filter();

        let allData = ds.data();

        let query = new kendo.data.Query(allData);

        let results = query.filter(filters).data.slice();

        self.historicalTransfersCount(results.length);

        return results;
    }

    self.clearSelectedTransferMixingSessionIds = () => {
        self.selectedTransferMixingSessionIds([]);
        self.transfersGrid.widget().dataSource.data().forEach(d => {
            d.checkboxParams.observable(false);
        });
        self.transfersGrid.widget().clearSelection();
    }

    self.clearSelectedHistoricalTransferMixingSessionIds = () => {
        self.selectedHistoricalTransferMixingSessionIds([]);
        self.transfersHistoryGrid.widget().dataSource.data().forEach(d => {
            d.checkboxParams.observable(false);
        });
        self.transfersHistoryGrid.widget().clearSelection();
    }

    self.getTransferDate = (date) => {
        return self.transferDates().find(d => d.date == date);
    }

    self.transferGridColumns = () => {
        return [{
            field: 'OrderID',
            title: 'Order ID',
            width: 140,
            hidden: true,
            filterable: {
                extra: false
            }
        }, {
            field: 'DespatchGroup',
            title: 'Despatch Group',
            width: 160,
            hidden: false,
            filterable: {
                extra: false
            }
        }, {
            field: 'Time',
            title: 'Time'
        }, {
            field: 'BoxCount',
            title: 'Box Count',
            hidden: false,
            headerAttributes: {
                class: 'text-center'
            },
            filterable: false
        }, {
            field: 'LastPrintedDT',
            title: 'Last Printed',
            filterable: {

            },
            hidden: true
        }, {
            field: 'Date',
            title: 'Date',
            hidden: true,
            groupHeaderTemplate: (row, aggregates) => {
                return `<div class="d-inline" data-bind="stopBinding"><div class='d-inline-flex justify-content-center align-items-center gap-3' data-date='${moment(row.value).format('DD/MM/YYYY')}'>
                    <span>${moment(row.value).format('dddd DD/MM/YYYY')}</span>
                    <div data-bind="component: { name: 'mdc-checkbox-component', params: checkboxParams }"></div>
                </div></div>`;
            }
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
            hidden: false,
            headerAttributes: {
                class: 'text-center'
            },
            headerTemplate: `<div id="transfer-orders-select-all" data-bind="component: { name: 'mdc-checkbox-component', params: transferOrdersSelectAll }"></div>`
        }]
    }

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
                            //console.log('FetchTransfers returned', data);
                            if (data.dsResult) {
                                if (data.Notices.ErrorMessage !== null) {
                                    window.showError(data.Notices.ErrorMessage);
                                } else {
                                    data.dsResult.Data = data.dsResult.Data.map(o => {
                                        let object = Object.assign(o, {
                                            elementHolder: ko.observable(),
                                            date: moment(o.Date).format('DD/MM/YYYY'),
                                            checkboxParams: {
                                                checkboxId: `transfer-order-${o.OrderID}}-checkbox`,
                                                observable: ko.observable(false),
                                                originalValue: false,
                                                useNativeValidation: false,
                                                disable: ko.observable(false),
                                                enable: ko.observable(true),
                                                busy: ko.observable(false)
                                            }
                                        });
                                        object.checkboxParams.observable.subscribe(nv => {
                                            //console.log('order checkbox', nv);
                                            if (nv) {
                                                if (object.elementHolder.DOMElement)
                                                    object.elementHolder.DOMElement.classList.add('k-state-selected');
                                                if (self.selectedTransferMixingSessionIds().indexOf(object.MixingSessionID) == -1)
                                                    self.selectedTransferMixingSessionIds().push(object.MixingSessionID);
                                            } else {
                                                if (object.elementHolder.DOMElement)
                                                    object.elementHolder.DOMElement.classList.remove('k-state-selected');
                                                self.selectedTransferMixingSessionIds.remove(object.MixingSessionID);
                                            }
                                        });
                                        return object;
                                    });

                                    let counter = 0;

                                    self.transferDates(data.Dates.map(d => {
                                        let object = {
                                            date: moment(d).format('DD/MM/YYYY'),
                                            elementHolder: ko.observable(),
                                            checkboxParams: {
                                                checkboxId: `transfer-date-${++counter}-checkbox`,
                                                observable: ko.observable(true),
                                                originalValue: false,
                                                useNativeValidation: false,
                                                disable: ko.observable(false),
                                                enable: ko.observable(true),
                                                busy: ko.observable(false)
                                            }
                                        }
                                        object.checkboxParams.observable.subscribe(nv => {
                                            //console.log('transferDate checkbox', nv, object);
                                            if (nv) {
                                                let filteredItems = self.getTransferGridFilteredItems();

                                                let currentSelection = self.selectedTransferMixingSessionIds();

                                                filteredItems = filteredItems.flatMap(o => o.date == object.date ? [o] : []);

                                                let filteredItemsMixingSessionIds = filteredItems.map(o => o.MixingSessionID);

                                                let distinct = [...new Set(currentSelection.concat(filteredItemsMixingSessionIds))];

                                                self.selectedTransferMixingSessionIds(distinct);

                                                filteredItems.forEach(item => {
                                                    item.checkboxParams.observable(true);
                                                    if (item.checkboxParams.observable.hasOwnProperty('mdcCheckbox'))
                                                        item.checkboxParams.observable.mdcCheckbox.checked = true;
                                                });

                                                let selectedRows = self.transfersGrid.widget().select();

                                                filteredItemsMixingSessionIds.forEach(fimsi => {
                                                    let row = self.transfersGrid.widget().dataSource.get(fimsi);
                                                    selectedRows.push(row);
                                                });

                                                self.transfersGrid.widget().select(selectedRows);

                                            } else {

                                                let filteredItems = self.getTransferGridFilteredItems();

                                                let currentSelection = self.selectedTransferMixingSessionIds();

                                                filteredItems = filteredItems.flatMap(o => o.date == object.date ? [o] : []);

                                                let filteredItemsMixingSessionIds = filteredItems.map(o => o.MixingSessionID);

                                                let distinct = currentSelection.filter(cs => filteredItemsMixingSessionIds.indexOf(cs) == -1);

                                                self.selectedTransferMixingSessionIds(distinct);

                                                filteredItems.forEach(item => {
                                                    item.checkboxParams.observable(false);
                                                    if (item.checkboxParams.observable.hasOwnProperty('mdcCheckbox'))
                                                        item.checkboxParams.observable.mdcCheckbox.checked = false;
                                                });

                                                let selectedRows = self.transfersGrid.widget().select();

                                                filteredItemsMixingSessionIds.forEach(fimsi => {
                                                    let row = self.transfersGrid.widget().dataSource.get(fimsi);
                                                    selectedRows = selectedRows.filter(r => r != row);
                                                });

                                                self.transfersGrid.widget().select(selectedRows);

                                                //self.clearSelectedTransferMixingSessionIds();

                                            }
                                        });
                                        return object;
                                    }));

                                    self.allTransferOrders(data.AllResults);

                                    self.transferNotice(data.Notices.Notification)

                                    options.success(data.dsResult);
                                }
                            } else {
                                console.error('FetchTranfers returned a NULL dsResult')
                                options.success({});
                                window.showError();
                            }
                        })
                        .catch(err => window.catchFetchError(err));
                }
            },
            pageSize: 500,
            serverPaging: false,
            serverSorting: false,
            serverFiltering: false,
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
                        },
                        Date: {
                            type: 'date'
                        },
                        Time: {
                            type: 'string'
                        }
                    }
                }
            }),
            sort: { field: 'OrderID', dir: 'desc' },
            filter: { field: 'LastPrintedDT', operator: 'isnull' },
            group: [{
                field: 'Date',
                sort: {
                    dir: 'asc'
                }
            }]
        }),
        useKOTemplates: true,
        rowTemplate: 'transfer-row-template',
        filterable: true,
        selectable: false,
        scrollable: false,
        sortable: true,
        groupable: false,
        pageable: {
            pageSize: 500,
            pageSizes: [1, 2, 5, 10, 20, 50, 100, 250, 500, 'all']
        },
        columns: self.transferGridColumns(),
        change: (e, args) => {
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
        filter: (e) => {
            self.clearSelectedTransferMixingSessionIds();
        },
        dataBound: (e) => {

            window.setTimeout(() => {
                document.querySelectorAll('#transfers-tab .k-grouping-row').forEach(r => {
                    let date = self.transferDates().find(d => {
                        if (r.querySelector('.d-inline-flex'))
                            return r.querySelector('.d-inline-flex').dataset.date == d.date;
                    });
                    // for whatever reason the kendo grid wants to render a header group in its own directly beneath the k-grid-header thead element, this is totally separate and was driving me spare for a while
                    // essentially that means we aren't guaranteed to be dealing with a grouping row we actuall yw
                    if (date) {
                        let bindingElement = r.querySelector('.d-inline-flex');
                        ko.cleanNode(bindingElement);
                        ko.applyBindings(date, bindingElement);
                    } 
                })
            }, 0);

            let dataView = e.sender.dataSource.view();

            for (var i = 0; i < dataView.length; i++) {
                for (var j = 0; j < dataView[i].items.length; j++) {
                    if (dataView[i].items[j].MixingSessionID != null) {

                        let prevEleSub = dataView[i].items[j].elementHolder.DOMElement.previousElementSibling;

                        while (prevEleSub != null && !prevEleSub.classList.contains('k-grouping-row')) {
                            prevEleSub = prevEleSub.previousElementSibling;
                        }

                        e.sender.collapseGroup(prevEleSub);
                    }
                }
            }

            if (ko.contextFor(document.querySelector('#transfer-orders-select-all')) == null) {
                ko.cleanNode(document.querySelector('#transfer-orders-select-all'));
                ko.applyBindings(self, document.querySelector('#transfer-orders-select-all'))
            }

            window.setTimeout(() => {
                // this because we set self.transfersCount in the function
                let filteredItems = self.getTransferGridFilteredItems();

                if (document.querySelector('#transfers-tab').classList.contains('active')) {
                    let grid = e.sender;

                    let items = grid.items();

                    let itemsToSelect = [];

                    if (self.transfersFirstRun) {
                        self.selectedTransferMixingSessionIds(filteredItems.flatMap(o => o.MixingSessionID));
                        self.transfersFirstRun = false;
                    }

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

                    if (self.selectedTransferMixingSessionIds().length === 0) {
                        self.transferOrdersSelectAll.observable(false);
                    }
                }
            }, 0);
        }
    }

    let historyColumns = self.transferGridColumns();

    historyColumns[2].hidden = false;
    historyColumns[2].filterable = false;

    historyColumns[7].headerTemplate = `<div id="historical-transfer-orders-select-all" data-bind="component: { name: 'mdc-checkbox-component', params: historicalTransferOrdersSelectAll }"></div>`

    self.transfersHistoryGrid = {
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

                    params.append('Mode', 'D');

                    fetch('/api/PaintMixingAPI/FetchTranfers?' + params, {
                        method: 'GET',
                        headers: window.fetchHeaders
                    })
                        .then(resp => resp.json())
                        .then(data => {
                            //console.log('FetchHistoricalTranfers returned', data);
                            if (data.dsResult) {
                                if (data.Notices.ErrorMessage !== null) {
                                    window.showError(data.Notices.ErrorMessage);
                                } else {
                                    data.dsResult.Data = data.dsResult.Data.map(o => {
                                        let object = Object.assign(o, {
                                            elementHolder: ko.observable(),
                                            date: moment(o.Date).format('DD/MM/YYYY'),
                                            checkboxParams: {
                                                checkboxId: `transfer-order-${o.OrderID}}-checkbox`,
                                                observable: ko.observable(false),
                                                originalValue: false,
                                                useNativeValidation: false,
                                                disable: ko.observable(false),
                                                enable: ko.observable(true),
                                                busy: ko.observable(false)
                                            }
                                        });
                                        object.checkboxParams.observable.subscribe(nv => {
                                            //console.log('order checkbox', nv);
                                            if (nv) {
                                                if (object.elementHolder.DOMElement)
                                                    object.elementHolder.DOMElement.classList.add('k-state-selected');
                                                if (self.selectedHistoricalTransferMixingSessionIds().indexOf(object.MixingSessionID) == -1)
                                                    self.selectedHistoricalTransferMixingSessionIds().push(object.MixingSessionID);
                                            } else {
                                                if (object.elementHolder.DOMElement)
                                                    object.elementHolder.DOMElement.classList.remove('k-state-selected');
                                                self.selectedHistoricalTransferMixingSessionIds.remove(object.MixingSessionID);
                                            }
                                        });
                                        return object;
                                    });

                                    let counter = 0;

                                    self.transferHistoricalDates(data.Dates.map(d => {
                                        let object = {
                                            date: moment(d).format('DD/MM/YYYY'),
                                            elementHolder: ko.observable(),
                                            checkboxParams: {
                                                checkboxId: `transfer-date-${++counter}}-checkbox`,
                                                observable: ko.observable(false),
                                                originalValue: false,
                                                useNativeValidation: false,
                                                disable: ko.observable(false),
                                                enable: ko.observable(true),
                                                busy: ko.observable(false)
                                            }
                                        }
                                        object.checkboxParams.observable.subscribe(nv => {
                                            //console.log('transferHistoricalDate checkbox', nv);
                                            if (nv) {
                                                let filteredItems = self.getHistoricalTransferGridFilteredItems();

                                                let currentSelection = self.selectedHistoricalTransferMixingSessionIds();

                                                filteredItems = filteredItems.flatMap(o => o.date == object.date ? [o] : []);

                                                let filteredItemsMixingSessionIds = filteredItems.map(o => o.MixingSessionID);

                                                let distinct = [...new Set(currentSelection.concat(filteredItemsMixingSessionIds))];

                                                self.selectedHistoricalTransferMixingSessionIds(distinct);

                                                filteredItems.forEach(item => {
                                                    item.checkboxParams.observable(true);
                                                    if (item.checkboxParams.observable.hasOwnProperty('mdcCheckbox'))
                                                        item.checkboxParams.observable.mdcCheckbox.checked = true;
                                                });

                                                let selectedRows = self.transfersHistoryGrid.widget().select();

                                                filteredItemsMixingSessionIds.forEach(fimsi => {
                                                    let row = self.transfersHistoryGrid.widget().dataSource.get(fimsi);
                                                    selectedRows.push(row);
                                                });

                                                self.transfersHistoryGrid.widget().select(selectedRows);

                                            } else {

                                                let filteredItems = self.getHistoricalTransferGridFilteredItems();

                                                let currentSelection = self.selectedHistoricalTransferMixingSessionIds();

                                                filteredItems = filteredItems.flatMap(o => o.date == object.date ? [o] : []);

                                                let filteredItemsMixingSessionIds = filteredItems.map(o => o.MixingSessionID);

                                                let distinct = currentSelection.filter(cs => filteredItemsMixingSessionIds.indexOf(cs) == -1);

                                                self.selectedHistoricalTransferMixingSessionIds(distinct);

                                                filteredItems.forEach(item => {
                                                    item.checkboxParams.observable(false);
                                                    if (item.checkboxParams.observable.hasOwnProperty('mdcCheckbox'))
                                                        item.checkboxParams.observable.mdcCheckbox.checked = false;
                                                });

                                                let selectedRows = self.transfersHistoryGrid.widget().select();

                                                filteredItemsMixingSessionIds.forEach(fimsi => {
                                                    let row = self.transfersHistoryGrid.widget().dataSource.get(fimsi);
                                                    selectedRows = selectedRows.filter(r => r != row);
                                                });

                                                self.transfersHistoryGrid.widget().select(selectedRows);

                                                //self.clearSelectedTransferMixingSessionIds();

                                            }
                                        });
                                        return object;
                                    }));

                                    self.allHistoricalTransferOrders(data.AllResults);

                                    self.transferNotice(data.Notices.Notification)

                                    options.success(data.dsResult);
                                }
                            } else {
                                options.success({});
                                console.error('FetchTranfers returned a NULL dsResult');
                                window.showError();
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
            serverPaging: false,
            serverSorting: false,
            serverFiltering: false,
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
                        },
                        Date: {
                            type: 'date'
                        },
                        Time: {
                            type: 'string'
                        }
                    }
                }
            }),
            sort: { field: 'OrderID', dir: 'desc' },
            group: [{
                field: 'Date',
                sort: {
                    dir: 'asc'
                }
            }]
        }),
        useKOTemplates: true,
        rowTemplate: 'transfer-history-row-template',
        filterable: true,
        selectable: false,
        scrollable: false,
        sortable: true,
        pageable: {
            pageSize: 5,
            pageSizes: [1, 2, 5, 10, 20, 50, 100, 250, 500, 'all']
        },
        columns: historyColumns,
        change: (e, args) => {
            let grid = e.sender;
            let items = grid.items();

            items.each(function (idx, row) {
                var dataItem = grid.dataItem(row);
                if (row.className.indexOf("k-state-selected") >= 0) {
                    if (self.selectedHistoricalTransferMixingSessionIds().indexOf(dataItem.MixingSessionID) == -1)
                        self.selectedHistoricalTransferMixingSessionIds.push(dataItem.MixingSessionID);
                } else {
                    self.selectedHistoricalTransferMixingSessionIds.remove(so => {
                        so == dataItem.MixingSessionID
                    })
                }
            });
        },
        filter: (e) => {
            self.clearSelectedHistoricalTransferMixingSessionIds();
        },
        dataBound: (e) => {

            window.setTimeout(() => {
                document.querySelectorAll('#transfers-history-tab .k-grouping-row').forEach(r => {
                    let date = self.transferHistoricalDates().find(d => {
                        if (r.querySelector('.d-inline-flex'))
                            return r.querySelector('.d-inline-flex').dataset.date == d.date;
                    });
                    // for whatever reason the kendo grid wants to render a header group in its own directly beneath the k-grid-header thead element, this is totally separate and was driving me spare for a while
                    // essentially that means we aren't guaranteed to be dealing with a grouping row we actuall yw
                    if (date) {
                        let bindingElement = r.querySelector('.d-inline-flex');
                        ko.cleanNode(bindingElement);
                        ko.applyBindings(date, bindingElement);
                    }
                })
            }, 0);

            let dataView = e.sender.dataSource.view();

            for (var i = 0; i < dataView.length; i++) {
                for (var j = 0; j < dataView[i].items.length; j++) {
                    if (dataView[i].items[j].MixingSessionID != null) {

                        let prevEleSub = dataView[i].items[j].elementHolder.DOMElement.previousElementSibling;

                        while (prevEleSub != null && !prevEleSub.classList.contains('k-grouping-row')) {
                            prevEleSub = prevEleSub.previousElementSibling;
                        }

                        e.sender.collapseGroup(prevEleSub);
                    }
                }
            }

            if (ko.contextFor(document.querySelector('#historical-transfer-orders-select-all')) == null) {
                ko.cleanNode(document.querySelector('#historical-transfer-orders-select-all'));
                ko.applyBindings(self, document.querySelector('#historical-transfer-orders-select-all'))
            }

            window.setTimeout(() => {
                // this because we set self.transfersCount in the function
                let filteredItems = self.getHistoricalTransferGridFilteredItems();


                // Commented out because we don't want to be selecting all on the history grid
                //if (document.querySelector('#transfers-history-tab').classList.contains('active')) {
                //    let grid = e.sender;

                //    let items = grid.items();

                //    let itemsToSelect = [];

                //    if (self.historicalTransfersFirstRun) {
                //        self.selectedHistoricalTransferMixingSessionIds(filteredItems.flatMap(o => o.MixingSessionID));
                //        self.historicalTransfersFirstRun = false;
                //    }

                //    items.each(function (idx, row) {
                //        var dataItem = grid.dataItem(row);
                //        let o = self.selectedHistoricalTransferMixingSessionIds().find(so => so == dataItem['MixingSessionID']);
                //        if (o) {
                //            itemsToSelect.push({ dataItem: o, element: row });
                //        }
                //    });

                //    e.sender.select(itemsToSelect.map(i => i.element));

                //    window.setTimeout(() => {
                //        itemsToSelect.forEach(item => {
                //            let o = grid.dataItem(item.element)
                //            o.checkboxParams.observable(true);
                //            o.checkboxParams.observable.mdcCheckbox.checked = true;
                //        })
                //    }, 0);

                //    if (self.selectedHistoricalTransferMixingSessionIds().length === 0) {
                //        self.historicalTransferOrdersSelectAll.observable(false);
                //    }
                //}
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

    self.historicalTransferOrdersSelectAll = {
        checkboxId: `historical-transfer-orders-select-all`,
        observable: ko.observable(false),
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

    self.orderHistorySearch = ko.observable().extend({
        rateLimit: {
            timeout: 300,
            method: 'notifyWhenChangesStop'
        }
    });

    self.originalOrderHistorySearch = ko.observable();

    self.orderHistorySearchParams = {
        label: 'Search by Order Number, Customer Order Reference or Trade Account Code',
        observable: self.orderHistorySearch,
        busy: self.busy,
        permitRevert: true,
        originalValue: ko.observable(),
        enable: ko.observable(true),
        disable: ko.observable(false),
        revertable: true,
        revertFunction: () => {
            self.orderHistorySearch(self.originalOrderHistorySearch())
        },
        clearable: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        },
        enterFunction: (e) => {
            console.log('enter');
        },
        useNativeValidation: false, // this feeds through to mdc objects and affects them
        decorateInputElement: true,
        insertValidationMessages: false
    }

    //#endregion


    //#region 

    self.transferOrdersSelectAll.observable.subscribe(nv => {
        if (nv) {
            let filteredItems = self.getTransferGridFilteredItems();

            self.selectedTransferMixingSessionIds(filteredItems.flatMap(o => o.MixingSessionID));

            filteredItems.forEach(item => {
                item.checkboxParams.observable(true);
                if (item.checkboxParams.observable.hasOwnProperty('mdcCheckbox'))
                    item.checkboxParams.observable.mdcCheckbox.checked = true;
            });

            self.transfersGrid.widget().select(self.transfersGrid.widget().items());

            self.transferDates().forEach(td => {
                td.checkboxParams.observable(true);
            });

        } else {
            self.clearSelectedTransferMixingSessionIds();

            self.transferDates().forEach(td => {
                td.checkboxParams.observable(false);
            });
        }
    });

    self.historicalTransferOrdersSelectAll.observable.subscribe(nv => {
        if (nv) {
            let filteredItems = self.getHistoricalTransferGridFilteredItems();

            self.selectedHistoricalTransferMixingSessionIds(filteredItems.flatMap(o => o.MixingSessionID));

            filteredItems.forEach(item => {
                item.checkboxParams.observable(true);
                if (item.checkboxParams.observable.hasOwnProperty('mdcCheckbox'))
                    item.checkboxParams.observable.mdcCheckbox.checked = true;
            });

            self.transfersHistoryGrid.widget().select(self.transfersHistoryGrid.widget().items());

            self.transferHistoricalDates().forEach(td => {
                td.checkboxParams.observable(true);
            });

        } else {
            self.clearSelectedHistoricalTransferMixingSessionIds();

            self.transferHistoricalDates().forEach(td => {
                td.checkboxParams.observable(false);
            });
        }
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

    self.fetchOrderLines = (dataItem, mode = 'M') => {
        self.busy(true);

        self.selectedOrderId(dataItem.OrderID);

        self.orderLinesGridMode(mode);

        self.dataItem(dataItem);

        self.orderLinesGrid.widget().one('dataBound', (event) => {
            self.showOrderLinesModal();
            if (self.holdBusy()) {
                self.holdBusy(self.holdBusy() - 1);
            } else {
                self.busy(false);
            }
        });

        self.orderLinesGrid.widget().dataSource.read();
    }

    self.closeOrderLinesModal = () => {
        if (self.checkedOrderLines().length) {
            window.showConfirm('Are you sure?', `This will relinquish Order ${self.orderLinesResponse().OrderID}.`, () => {
                self.relinquishOrderLines(self.orderLinesResponse());
                self.orderLinesResponse(undefined);
                self.orderLines([]);
                self.mixingSessions([]);
            });
        } else {
            self.relinquishOrderLines(self.orderLinesResponse());
            self.orderHistoryGrid.widget().dataSource.read();
            self.orderLinesResponse(undefined);
            self.orderLines([]);
            self.mixingSessions([]);
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
                //console.log(response);
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

        window.showConfirm('<span class="fs-5">Please Confirm</span>', `<p class="mb-0">Are you sure you've just processed <span class="bold d-inline-block">${lineCount} ${(lineCount > 1 ? 'lines' : 'line')}</span> into <span class="bold d-inline-block">${boxCount} ${(boxCount > 1 ? 'boxes' : 'box')}</span>?</p>`, () => {
            self.busy(true);
            fetch('/api/PaintMixingAPI/SaveOrderLines', {
                method: 'POST',
                headers: window.fetchHeaders,
                cache: 'no-store',
                credentials: 'same-origin',
                body: JSON.stringify({
                    orderId: self.selectedOrderId(),
                    orderLineIds: self.checkedOrderLines().map(ol => ol.OrderLineID),
                    boxCount: boxCount
                })
            })
                .then(window.handleFetchResponse)
                .then(response => {
                    //console.log('SaveOrderLines returned', response);
                    if (response.ErrorMessage) {
                        self.busy(false);
                        window.showError(response.ErrorMessage);
                    } else {
                        window.centerInfoModal();
                        //window.showInfo('<span class="fs-4 text-sucess">Success</span>', response.Notification);
                        self.labelNotice(response.Notification);
                        self.orderLinesResponse().MixingSessionID = response.MixingSessionID;
                        if (self.orderLinesResponse().GenerateBoxLabel) {
                            self.holdBusy(2);
                            self.fetchBoxLabels(self.orderLinesResponse().MixingSessionID);
                        }
                        self.fetchOrderLines(self.orderLinesResponse(), 'M');
                        self.transfersGrid.widget().dataSource.read();
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
            self.holdBusy(self.holdBusy() - 1);
            //console.log('FetchBoxLabels returned', response);
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

    self.produceTransferManifest = (from) => {
        var keys = [];
        var orders = [];

        if (from == 'current') {
            keys = self.selectedTransferMixingSessionIds();
            orders = self.allTransferOrders().flatMap(t => keys.indexOf(t.MixingSessionID) > -1 ? [t] : []);
        } else {
            keys = self.selectedHistoricalTransferMixingSessionIds();
            orders = self.allHistoricalTransferOrders().flatMap(t => keys.indexOf(t.MixingSessionID) > -1 ? [t] : []);
        }

        if (keys.length && orders.length) {
            self.busy(true);
            fetch('/api/PaintMixingAPI/FetchTransferManifest', {
                method: 'POST',
                headers: window.fetchHeaders,
                cache: 'no-store',
                credentials: 'same-origin',
                body: JSON.stringify({
                    mixingLocationId: getMixingLocationId(),
                    transferOrders: orders
                })
            })
            .then(window.handleFetchResponse)
            .then(response => {
                self.busy(false);
                //console.log('FetchTransferManifest returned', response);
                if (response.Notices.ErrorMessage) {
                    window.showError(response.Notices.ErrorMessage);
                } else {

                    self.clearSelectedTransferMixingSessionIds();

                    if (from == 'current')
                        self.transfersGrid.widget().dataSource.read();

                    // don't want to refresh the history grid widget here
                    //self.transfersHistoryGrid.widget().dataSource.read();

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
            window.showError('You must selected at least one Despatch Group');
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
            //console.log('UpdateBasePaintOrderStatus returned', response);
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
            credentials: 'same-origin',
            timeout: 60000
        })
            .then(window.handleFetchResponse)
            .then(response => {
                self.busy(false);
                self.ordersToInvoiceGrid.widget().dataSource.read();
                if (self.ordersToInvoiceExceptionsGrid.widget())
                    self.ordersToInvoiceExceptionsGrid.widget().dataSource.read();
                //console.log('UpdateBasePaintOrderStatusAll returned', response);
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
        self.labelsModal.hide();
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