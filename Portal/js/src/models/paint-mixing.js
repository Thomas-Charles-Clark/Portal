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

    // Container for the response to [paint].[OrderLine_Select], called when a user selects a selectable Order from the Outstanding Orders Grid
    self.orderLinesResponse = ko.observable();

    self.orderLines = ko.observableArray([]);

    self.mixingSessions = ko.observableArray([]);

    self.orderLinesModal = bootstrap.Modal.getOrCreateInstance(document.querySelector('#paint-order-lines-modal'));

    self.orderLinesModal._element.addEventListener('shown.bs.modal', () => {
        self.orderLinesModal._focustrap.deactivate();
    });

    self.boxCountModal = bootstrap.Modal.getOrCreateInstance(document.querySelector('#paint-box-count-modal'));

    self.checkedOrderLines = ko.observableArray([]);

    self.sessionNotificationWrapper = document.querySelector('#session-notification-wrapper');

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
            title: 'Locked',
            width: 64
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
            field: 'Locked',
            title: 'Locked',
            width: 64,
            headerAttributes: {
                class: 'text-center'
            }
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

    //#endregion


    //#region Subscriptions

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
            if (response.Notices.ErrorMessage) {
                window.showError(response.Notices.ErrorMessage);
            } else {
                self.orderLinesResponse(response);
                self.showOrderLinesModal();
                self.outstandingOrdersGrid.widget().one("dataBound", function (e) {
                    e.sender.select(document.querySelector(`tr[data-order-id="${self.orderLinesResponse().OrderID}"]`));
                });
                self.outstandingOrdersGrid.widget().dataSource.read();
            }
        })
        .catch(err => {
            window.catchFetchError(err);
        })
    }

    self.closeOrderLinesModal = () => {
        window.showConfirm('Are you sure?', `This will relinquish Order ${self.orderLinesResponse().OrderID}.`, () => {
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
                self.checkedOrderLines([]);
                if (notify) {
                    self.orderLinesModal._element.addEventListener('hidden.bs.modal', () => {
                        window.showInfo('Okay', `Order ${dataItem.OrderID} was relinquished successfully.`);
                        self.outstandingOrdersGrid.widget().dataSource.read();
                    }, {
                        once: true
                    });
                }
                self.hideOrderLinesModal();
                self.hideBoxCountModal();
                window.hideConfirm();
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
                        window.showInfo('<span class="fs-4 text-sucess">Success</span>', response.Notification);
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
                    let tab = window.open();
                    tab.location.href = fileURL;
                    tab.focus();
                    tab.print();
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