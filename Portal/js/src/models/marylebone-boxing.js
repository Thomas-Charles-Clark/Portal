'use strict';

const maryleboneBoxingViewModel = (() => {
    let self = {

    };

    //#region Properties

    self.busy = ko.observable(false);

    self.successMp3 = new Audio("/content/sounds/scan-successful.mp3");

    self.failedMp3 = new Audio("/content/sounds/scan-failed_1.mp3");

    self.currentBox = ko.observable();

    self.newBoxModalElement = document.querySelector("#new-box-modal");

    self.newBoxModal = bootstrap.Modal.getOrCreateInstance(self.newBoxModalElement);

    self.validateNewBoxNow = ko.observable(false);

    self.newBoxCode = ko.observable().extend({
        required: {
            params: true,
            onlyIf: self.validateNewBoxNow,
            message: "Please scan or type in the Box Code"
        }
    });

    self.newBoxCode.subscribe(nv => {
        self.validateNewBoxNow(false);
        self.newBoxStockLocationCodeValid('unknown');
    });

    self.newBoxCodeParams = {
        label: 'Box Code (scan or type)',
        originalValue: ko.observable(),
        observable: self.newBoxCode,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: false,
        rows: 1,
        maxNewLines: 2,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: false,
        enable: ko.observable(true),
        disable: ko.observable(false),
        readonly: ko.observable(true),
        busy: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        visible: ko.observable(true)
    };

    self.newBoxStockLocationCodeValid = ko.observable('unknown');

    self.newBoxStockLocationCode = ko.observable().extend({
        required: {
            params: true,
            onlyIf: self.validateNewBoxNow,
            message: "Please scan or type in a Stock Location"
        },
        validation: {
            validator: () => {
                if (self.validateNewBoxNow()) {
                    return self.newBoxStockLocationCodeValid();
                } else {
                    return true;
                }
            },
            message: 'Please provide a valid Stock Location'
        }
    });

    self.newBoxStockLocationCode.subscribe(nv => {
        self.validateNewBoxNow(false);
        self.newBoxStockLocationCodeValid('unknown');
    });

    self.newBoxStockLocationCodeParams = {
        label: 'Stock Location Code (scan or type)',
        originalValue: ko.observable(),
        observable: self.newBoxStockLocationCode,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: false,
        rows: 1,
        maxNewLines: 2,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: false,
        enable: ko.observable(true),
        disable: ko.observable(false),
        readonly: ko.observable(true),
        busy: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        visible: ko.observable(true)
    };

    self.boxCreatedMp3 = new Audio("/content/sounds/box-created.mp3");

    self.gridWidget = ko.observable();

    self.gridColumns = [{
        field: "BoxID",
        title: "Box ID",
        hidden: true
    }, {
        field: "BoxCode",
        title: "Box Code"
    }, {
        field: "DestinationStockLocation",
        title: "Destination"
    }, {
        field: "ProductCount",
        title: "No. Products",
    }, {
        field: "CreatedDT",
        title: "Created"
    }, {
        field: "Controls",
        title: "",
        sortable: false,
        filterable: false,
        width: 90
    }];

    self.gridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {

        };

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        $.ajax({
            url: '/api/MarylebonePackingAPI/FetchBoxes',
            type: "GET",
            dataType: 'json',
            data: data,
            success: function (data) {

                data.Data = data.Data.map(d => boxViewModel({ record: d, parent: self }));

                options.success(data);
            },
            error: function (xhr, s, a) {
                $.ajaxSettings.error(xhr, s, a);
                options.error();
            }
        });
    }


    self.gridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.gridDataSourceRead
        },
        batch: false,
        sortable: true,
        filterable: true,
        grouping: false,
        serverFiltering: false,
        serverGrouping: false,
        serverPaging: false,
        serverAggregates: false,
        serverSorting: false,
        pageSize: 20,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "AggregateResults",
            model: {
                id: 'BoxID',
                fields: {
                    BoxID: { type: 'number', editable: false },
                    DestinationStockLocationID: { type: 'number', editable: true },
                    ProductCount: { type: 'number', editable: false },
                    CreatedDT: { type: 'date', editable: false },
                    ModifiedDT: { type: 'date', editable: false },
                    ExpiryDT: { type: 'date', editable: false },
                    DestinationStockLocation: { type: 'object', editable: false },
                    BoxedItems: { type: 'object' }
                }
            }
        }),
        aggregate: [],
        sort: {
            field: 'CreatedDT',
            dir: 'desc'
        },
        //sort: { field: "BasketID", dir: "desc" },
        //requestStart: function (e) {
        //    self.busy(true);
        //},
        //requestEnd: function (e) {
        //    self.busy(false);
        //},
        noDataTemplate: 'Nothing to display'
    })

    //#endregion


    //#region Components

    self.boxGridSettings = {
        autoBind: true,
        widget: self.gridWidget,
        columns: self.gridColumns,
        data: self.gridDataSource,
        useKOTemplates: true,
        rowTemplate: 'row-template',
        sortable: true,
        groupable: false,
        filterable: true,
        reorderable: true,
        editable: false,
        selectable: true,
        navigatable: true,
        paging: true,
        pageSize: 20,
        change: (e) => {
            console.log(e);
            self.currentBox(e.sender.dataItem(e.sender.select()));
            document.querySelector('#boxing-tab-btn').click();
            window.setTimeout(() => {
                self.currentBox().inputSearchTerm.mdcTextField.root_.querySelector('textarea').focus();
            }, 150);
            //self.currentBox(e.sender.dataItem);
        },
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        }
    };

    //self.billingPeriodParams = kendoMDCDropDownList({
    //    label: 'Billing Period',
    //    odata: false,
    //    endPoint: '/api/FenwickInvoicingAPI/GetSelfBillInvoices',
    //    textField: 'Label',
    //    valueField: 'InvoiceDate',
    //    virtual: false,
    //    pageSize: 20,
    //    virtualOptions: {
    //        itemHeight: 34,
    //        mapValueTo: 'dataItem',
    //        valueMapper: function (options) {
    //            $.ajax({
    //                url: `/odata/SelfBillInvoices/Default.SelfBillInvoiceValueMapper(selfBillInvoiceId=${options.value || "null"})`,
    //                type: 'GET',
    //                success: function (data) {
    //                    options.success(data.value);
    //                    if (data.value.length == 1) {
    //                        self.billingPeriod(data.value[0]);
    //                    }
    //                }
    //            });
    //        }
    //    },
    //    idObservable: self.billingPeriodDate,
    //    objObservable: self.billingPeriod,
    //    enable: ko.observable(true),
    //    disable: ko.observable(false),
    //    clearable: ko.observable(true),
    //    revertible: ko.observable(false),
    //    readOnly: false,
    //    filter: 'contains',
    //    autoBind: true,
    //    height: 340,
    //    select: (e) => {

    //    },
    //    clearFunction: () => {

    //    },
    //    sort: {
    //        field: 'InvoiceDate',
    //        dir: 'desc'
    //    }
    //});

    //#endregion


    //#region Computeds


    //#endregion


    //#region Subscriptions

    self.newBoxCode.subscribe(nv => {
        console.log('newBoxCode', nv);

        if (nv && nv.indexOf('\n') == 0) {
            self.newBoxCode(nv.substring(1, nv.length));
        }

        if (nv && nv.indexOf('\n') == nv.length - 1) {
            console.log('ended with newline');
            self.newBoxCode(nv.substring(0, nv.length - 1));
            self.newBoxStockLocationCode.mdcTextField.root_.querySelector("textarea").focus();
        }
    });

    self.newBoxStockLocationCode.subscribe(nv => {
        console.log('newBoxStockLocationCode', nv);

        if (nv && nv.indexOf('\n') == nv.length - 1) {
            self.newBoxStockLocationCode(nv.substring(0, nv.length - 1));
            console.log('ended with newline');
            self.saveNewBox();
        }
    });

    //#endregion


    //#region Validation Groups

    self.newBoxErrors = new ko.validation.group([
        self.newBoxCode,
        self.newBoxStockLocationCode
    ]);

    //#endregion


    //#region Functions
    
    self.ready = () => {
        self.busy(false);
    }

    self.showNewBoxModal = () => {
        self.newBoxModal.show();
        window.setTimeout(() => {
            self.newBoxCode.mdcTextField.focus();
        }, 300);
    }

    self.hideNewBoxModal = () => {
        self.resetNewBox();
        self.newBoxModal.hide();
    }

    self.saveNewBox = () => {

        self.validateNewBoxNow(true);

        if (self.newBoxErrors().length) {
            self.newBoxErrors.showAllMessages(true);
            self.newBoxErrors.filter(x => x.isValid.notifySubscribers(x.isValid()));
        } else {
            //window.showConfirm("Are you sure?", "This will create a new, empty box record.", () => {

                let data = {
                    boxCode: self.newBoxCode(),
                    stockLocationCode: self.newBoxStockLocationCode()
                };

                console.log("createNewBox calling with", data);

                fetch("/api/MarylebonePackingAPI/createNewBox", {
                    method: "POST",
                    headers: window.fetchHeaders,
                    body: JSON.stringify(data)
                })
                    .then(window.handleFetchResponse)
                    .then(data => {
                        console.log("createNewBox returned", data);
                        self.gridWidget().dataSource.read();
                        self.currentBox(boxViewModel({ record: data, parent: self }));
                        self.hideNewBoxModal();
                    })
                    .catch(err => {
                        console.log(err);
                        if (err.exception == "stockLocation") {
                            self.newBoxStockLocationCodeValid(false);
                        } else {
                            window.catchFetchError(err);
                        }
                    });

            //});
        }
    }

    self.deleteBox = (box) => {

        window.showConfirm("Are you sure?", `This will delete box ${box.BoxCode}`, () => {

        let data = {
            boxId: box.BoxID
        };

            console.log("deleteBox calling with", data);

            fetch("/api/MarylebonePackingAPI/deleteBox", {
                method: "POST",
                headers: window.fetchHeaders,
                body: JSON.stringify(data)
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    console.log("deleteBox returned", data);
                    self.gridWidget().dataSource.read();
                })
                .catch(window.catchFetchError);
         });
    }

    self.resetNewBox = () => {
        self.validateNewBoxNow(false);
        self.newBoxCodeParams.clearFunction();
        self.newBoxStockLocationCodeParams.clearFunction();
        self.newBoxStockLocationCodeValid('unknown');
    }

    self.closeCurrentBox = () => {
        self.currentBox().save(() => {
            self.currentBox(undefined);
        });
    }

    //#endregion

    //#region Events

    document.querySelector('#reviewing-tab-btn').addEventListener('show.bs.tab', (e) => {
        self.gridWidget().dataSource.read();
    });

    //#endregion

    return self;
});


const boxViewModel = ({ record, parent } = { record: {}, parent: {} }) => {
    let self = Object.assign({
        currentBox: parent.currentBox
    }, record);

    //#region Properties

    self.busy = ko.observable(false);

    self.successMp3 = parent.successMp3;

    self.failedMp3 = parent.failedMp3;

    self.inputSearchTerm = ko.observable();

    self.boxedItems = ko.observableArray(record.BoxedItems.map(b => boxedItemViewModel({ record: b, parent: self })));

    self.stockLocationCodeValid = ko.observable(true);

    self.scannedText = ko.observable('<i id="activity-history-placeholder" class="text-italic">Activity History</i>');

    self.validateNow = ko.observable(false);

    self.stockLocationCode = ko.observable(record.DestinationStockLocation.Code).extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: "Please scan or type in a Stock Location"
        },
        validation: {
            validator: () => {
                if (self.validateNow()) {
                    return self.stockLocationCodeValid();
                } else {
                    return true;
                }
            },
            message: 'Please provide a valid Stock Location'
        }
    });

    self.stockLocationCode.subscribe(nv => {
        self.stockLocationCodeValid('unknown');
    });

    self.stockLocationCodeParams = {
        label: 'Stock Location Code',
        originalValue: ko.observable(record.DestinationStockLocation.Code),
        observable: self.stockLocationCode,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: false,
        rows: 1,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: true,
        enable: ko.observable(true),
        disable: ko.observable(false),
        readonly: ko.observable(true),
        busy: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(true),
        revertFunction: () => {
            self.stockLocationCode(self.stockLocationCodeParams.originalValue());
        },
        visible: ko.observable(true)
    };

    self.inputSearchTermParams = {
        label: 'Product Code or EAN (scan barcode or type)',
        originalValue: ko.observable(record.DestinationStockLocation.Code),
        observable: self.inputSearchTerm,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: false,
        rows: 1,
        maxNewLines: 2,
        //enterKey: (e) => {
        //    if (self.inputSearchTerm())
        //        self.addItem();
        //},
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: false,
        enable: ko.observable(true),
        disable: self.busy,
        readonly: ko.observable(true),
        busy: self.busy,
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        visible: ko.observable(true)
    };


    //#endregion


    //#region Components

    //#endregion


    //#region Computeds

    self.undeletedBoxedItems = ko.computed(() => {
        return self.boxedItems().filter(bi => bi.Deleted == false).sort((a, b) => a.BoxedItemID < b.BoxedItemID ? 1 : -1);
    }, self);

    self.totalItemsDisplay = ko.computed(() => {
        let count = self.undeletedBoxedItems().reduce((a, i) => a += i.quantity(), 0);

        if (count == 1) {
            return "(1 item)";
        } else if (count == 0) {
            return "(empty)";
        } else {
            return `(${count} items)`;
        }
    });

    //#endregion


    //#region Subscriptions

    self.inputSearchTerm.subscribe(nv => {
        console.log('inputSearchTerm', nv);

        if (nv && nv.indexOf('\n') == 0) {
            self.inputSearchTerm(nv.substring(1, nv.length));
        }

        if (nv && nv.indexOf('\n') == nv.length - 1) {
            console.log('ended with newline');
            self.inputSearchTerm(nv.substring(0, nv.length - 1));
            self.addItem(() => {
                window.setTimeout(() => {
                    self.inputSearchTerm.mdcTextField.root_.querySelector("textarea").focus();
                }, 0);
            });
        }
    });


    //#endregion


    //#region Validation Groups

    self.errors = new ko.validation.group([
        self.stockLocationCode
    ]);

    //#endregion


    //#region Functions

    self.addItem = (onComplete) => {

        let term = self.inputSearchTerm();

        if (term) {

            let data = {
                boxId: self.BoxID,
                input: term
            }

            let callStart = new Date();

            self.busy(true);

            console.log("verifyPartNumber calling with", data);

            fetch(`/api/MarylebonePackingAPI/AddItem`, {
                method: "POST",
                headers: window.fetchHeaders,
                body: JSON.stringify(data)
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    let callReturn = new Date();
                    console.log(`verifyPartNumber returned in ${callReturn - callStart}ms`, data);

                    let resultType = "scan-result-success";

                    if (data.valid) {
                        self.successMp3.play();
                    } else {
                        self.failedMp3.play();
                        resultType = "scan-result-failure";
                    }

                    let comment = ``;

                    if (data.valid) {
                        if (data.record.Quantity == 1) {
                            comment = " was added"

                            self.boxedItems.push(boxedItemViewModel({
                                record: data.record,
                                parent: self
                            }));

                        } else {
                            comment = ` quantity increased to ${data.record.Quantity}`;

                            let boxedItem = self.boxedItems().find(bi => bi.BoxedItemID == data.record.BoxedItemID);
                            boxedItem.quantity(data.record.Quantity);
                        }
                    } else {
                        comment = ` was not found`;
                    }

                    self.scannedText(`<span class="d-block scan-result ${resultType}">${term}${comment}</span>${self.scannedText()}`);
                    
                    self.inputSearchTermParams.clearFunction();

                    self.busy(false);

                    self.inputSearchTerm.mdcTextField.root_.querySelector("textarea").focus();

                    if (typeof onComplete === 'function') {
                        onComplete();
                    }
                })
                .catch(err => {
                    self.failedMp3.play();
                    self.failedMp3.play();
                    self.failedMp3.play();
                    window.catchFetchError(err);
                    self.busy(false);

                })
        }
    }

    self.save = () => {
        self.validateNow(true);

        if (self.errors().length) {
            self.errors.showAllMessages(true);
            self.errors.filter(x => {
                x.isValid.notifySubscribers(x.isValid());
            });
            self.failedMp3.play();
        } else {

            let data = {
                boxId: self.BoxID,
                stockLocationCode: self.stockLocationCode()
            }
            self.busy(true);


            fetch("/api/MarylebonePackingAPI/SaveBox", {
                method: "POST",
                headers: window.fetchHeaders,
                body: JSON.stringify(data)
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    self.currentBox(undefined);
                    self.busy(false);
                })
                .catch(err => {
                    self.busy(false);

                    if (err.exception && err.exception == "stockLocation") {
                        self.stockLocationCodeValid(false);
                    } else {
                        window.catchFetchError(err);
                    }
                })
        }
    }

    self.reduceQuantity = (boxedItem) => {

        let data = {
            boxedItemId: boxedItem.BoxedItemID
        }

        console.log(`reduceItemQuantity calling with`, data);

        fetch(`/api/MarylebonePackingAPI/ReduceItemQuantity`, {
            method: "POST",
            headers: window.fetchHeaders,
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {

                console.log(`reduceItemQuantity returned`, data);

                if (data) {
                    boxedItem.quantity(data);
                    self.successMp3.play();

                    self.scannedText(`<span class="d-block scan-result scan-result-warning">${boxedItem.Product.Code} quantity reduced to ${data}</span>${self.scannedText()}`);
                } else {
                    self.boxedItems.remove(boxedItem);
                    self.successMp3.play();

                    self.scannedText(`<span class="d-block scan-result scan-result-removal">${boxedItem.Product.Code} was removed</span>${self.scannedText()}`);
                }

                window.setTimeout(() => {
                    self.inputSearchTerm.mdcTextField.root_.querySelector("textarea").focus();
                }, 0);

            })
            .catch(err => {
                self.failedMp3.play();
                self.failedMp3.play();
                self.failedMp3.play();
                window.catchFetchError(err);
            })
    }

    self.increaseQuantity = (boxedItem) => {

        let data = {
            boxedItemId: boxedItem.BoxedItemID
        }

        console.log(`increaseItemQuantity calling with`, data);

        fetch(`/api/MarylebonePackingAPI/IncreaseItemQuantity`, {
            method: "POST",
            headers: window.fetchHeaders,
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {

                console.log(`increaseItemQuantity returned`, data);

                if (data) {
                    boxedItem.quantity(data);
                    self.successMp3.play();

                    self.scannedText(`<span class="d-block scan-result scan-result-success">${boxedItem.Product.Code} quantity increased to ${data}</span>${self.scannedText()}`);
                } 

                window.setTimeout(() => {
                    self.inputSearchTerm.mdcTextField.root_.querySelector("textarea").focus();
                }, 0);

            })
            .catch(err => {
                self.failedMp3.play();
                self.failedMp3.play();
                self.failedMp3.play();
                window.catchFetchError(err);
            })
    }


    //#endregion

    //#region Events


    //#endregion

    return self;
};


const boxedItemViewModel = ({ record, parent } = { record: {}, parent: {} }) => {
    let self = Object.assign({

    }, record);

    //#region Properties

    self.quantity = ko.observable(record.Quantity);

    //#endregion


    //#region Components



    //#endregion


    //#region Computeds



    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Validation Groups



    //#endregion


    //#region Functions


    //#endregion

    //#region Events



    //#endregion

    return self;
};