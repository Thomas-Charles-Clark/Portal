const paintMixingViewModel = (() => {
    let self = {

    };

    //#region Properties

    self.busy = ko.observable(false);

    self.mixingLocationId = ko.observable(getMixingLocationId());

    self.outstandingOrderCount = ko.observable();

    self.skipFetch = ko.observable(true);

    self.orderLinesResponse = ko.observable();

    self.orderLinesModal = bootstrap.Modal.getOrCreateInstance(document.querySelector('#paint-order-lines-modal'));

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
            field: 'TradeAccountCode',
            title: 'Trade Account'
        }, {
            field: 'OrderID',
            title: 'Order ID',
            width: 100
        }, {
            field: 'OrderDT',
            title: 'Order Date',
            width: 128
        }, {
            field: 'CustomerOrderReference',
            title: 'Customer Order Reference',
            width: 140
        }, {
            field: 'HaulierCode',
            title: 'Haulier Code',
            width: 80
        }, {
            field: 'CarriageCode',
            title: 'Carriage Code',
            width: 80
        }, {
            field: 'Locked',
            title: 'Locked'
        }, {
            field: 'Status',
            title: 'Status'
        }, {
            field: 'Priority',
            title: 'Priority'
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
    };

    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Computeds

    //self.fetch = ko.computed(() => {

    //    let data = {
    //        mixingLocationId: self.mixingLocationId()
    //    }

    //    if (self.skipFetch.peek()) {
    //        self.skipFetch(false);
    //    } else {
    //        if (!self.busy.peek()) {
    //            self.busy(true);
    //            fetch('/api/PaintMixingAPI/FetchOutstandingOrders', {
    //                method: 'POST',
    //                headers: window.fetchHeaders,
    //                cache: 'no-store',
    //                credentials: 'same-origin',
    //                body: JSON.stringify(data)
    //            })
    //                .then(window.handleFetchResponse)
    //                .then(response => {
    //                    console.log(response);
    //                    self.busy(false);
    //                    self.outstandingOrders(response.Orders);
    //                })
    //                .catch(err => {
    //                    self.busy(false);
    //                    window.catchFetchError(err);
    //                })
    //        }
    //    }
        
    //}, self).extend({
    //    rateLimit: {
    //        timeout: 50,
    //        method: 'notifyWhenChangesStop'
    //    }
    //});

    //#endregion


    //#region Methods

    self.ready = () => {
        self.busy(false);
    }

    self.fetchOrderLines = (dataItem) => {
        if (!self.busy()) {
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
                    response.OrderID = dataItem.OrderID;
                    console.log(response);
                    self.busy(false);
                    self.orderLinesResponse(response);
                    self.orderLinesModal.show();
                    self.outstandingOrdersGrid.widget().one("dataBound", function (e) {
                        e.sender.select(document.querySelector(`tr[data-order-id="${self.orderLinesResponse().OrderID}"]`));
                    });
                    self.outstandingOrdersGrid.widget().dataSource.read();
                })
                .catch(err => {
                    self.busy(false);
                    window.catchFetchError(err);
                })
        }
    }

    self.closeOrderLinesModal = () => {
        window.showConfirm('Are you sure?', `This will relinquish Order ${self.orderLinesResponse().OrderID}. Any changes you have made will not be saved.`, () => {
            self.relinquishOrderLines(self.orderLinesResponse());
        });
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
                    self.orderLinesResponse(undefined);
                    self.orderLinesModal.hide();
                    if (notify) {
                        window.showInfo('Okay', `Order ${dataItem.OrderID} was relinquished successfully. No changes were saved.`);
                        self.outstandingOrdersGrid.widget().dataSource.read();
                    }
                })
                .catch(err => {
                    self.busy(false);
                    window.catchFetchError(err);
                })
        }
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