const oneToFiveOptions = [{
    Name: "1",
    Value: 1
}, {
    Name: "2",
    Value: 2
}, {
    Name: "3",
    Value: 3
}, {
    Name: "4",
    Value: 4
}, {
    Name: "5",
    Value: 5
}]

const orderBookAdvancedFiltersViewModel = ({
    parent,
    params
} = {
    parent: {},
    params: {}
}) => {

    //#region Properties

    let self = {
        parent: parent
    };

    self.busy = self.parent.busy;

    self.loadedWithTitle = ko.observable(params.title);

    self.productStatusId = ko.observable(params.productStatus ?? '');
    self.productStatus = ko.observable();
    self.productStatusAwaitingBinding = ko.observable(params.productStatus != null && params.productStatus != '');

    self.orderGroupId = ko.observable(params.orderGroupId ?? '');
    self.orderGroup = ko.observable();
    self.orderGroupAwaitingBinding = ko.observable(params.orderGroupId != null && params.orderGroupId != '');

    self.stockLocationGroupId = ko.observable(params.stockLocationGroupId ?? '');
    self.stockLocationGroup = ko.observable();
    self.stockLocationGroupAwaitingBinding = ko.observable(params.stockLocationGroupId != null && params.stockLocationGroupId !== '');

    // THIS is the one, get rid of
    // and orderLineDetailedStatusId will be named orderStatusId 
    self.orderStatusId = ko.observable(params.orderStatusId ?? '');
    self.orderStatus = ko.observable();
    self.orderStatusAwaitingBinding = ko.observable(params.orderStatusId != null && params.orderStatusId != '');

    self.orderStatusGroupId = ko.observable(params.orderStatusGroupId ?? '');
    self.orderStatusGroup = ko.observable();
    self.orderStatusGroupAwaitingBinding = ko.observable(params.orderStatusGroupId != null && params.orderStatusGroupId != '');

    self.hasLinkedPOId = ko.observable(["1", "true", true].indexOf(params.hasLinkedPO) > -1 ? "true" : ["0", "false", false].indexOf(params.hasLinkedPO) > -1 ? "false" : '');
    self.hasLinkedPO = ko.observable();

    self.linkedPODelayedId = ko.observable(["1", "true", true].indexOf(params.linkedPODelayed) > -1 ? "true" : ["0", "false", false].indexOf(params.linkedPODelayed) > -1 ? "false" : '');
    self.linkedPODelayed = ko.observable();





    self.couldBeFulfilledFromFreeStockId = ko.observable(["1", "true", true].indexOf(params.couldBeFulfilledFromFreeStock) > -1 ? "true" : ["0", "false", false].indexOf(params.couldBeFulfilledFromFreeStock) > -1 ? "false" : '');
    self.couldBeFulfilledFromFreeStock = ko.observable();

    self.couldBeFulfilledFromStockAllocatedToAnotherOrderId = ko.observable(["1", "true", true].indexOf(params.couldBeFulfilledFromStockAllocatedToAnotherOrder) > -1 ? "true" : ["0", "false", false].indexOf(params.couldBeFulfilledFromStockAllocatedToAnotherOrder) > -1 ? "false" : '');
    self.couldBeFulfilledFromStockAllocatedToAnotherOrder = ko.observable();

    self.lineStatusIdGreaterThanId = ko.observable(params.lineStatusIdGreaterThan ?? '');
    self.lineStatusIdGreaterThan = ko.observable();
    self.lineStatusIdGreaterThanAwaitingBinding = ko.observable(params.lineStatusIdGreaterThan != null && params.lineStatusIdGreaterThan != '');

    self.lineStatusIdLessThanId = ko.observable(params.lineStatusIdLessThan ?? '');
    self.lineStatusIdLessThan = ko.observable();
    self.lineStatusIdLessThanAwaitingBinding = ko.observable(params.lineStatusIdLessThan != null && params.lineStatusIdLessThan != '');

    self.lineStatusChangedTodayId = ko.observable(["1", "true", true].indexOf(params.lineStatusChangedToday) > -1 ? "true" : ["0", "false", false].indexOf(params.lineStatusChangedToday) > -1 ? "false" : '');
    self.lineStatusChangedToday = ko.observable();

    self.detailedLineStatusIsNullId = ko.observable(["1", "true", true].indexOf(params.detailedLineStatusIsNull) > -1 ? "true" : ["0", "false", false].indexOf(params.detailedLineStatusIsNull) > -1 ? "false" : '');
    self.detailedLineStatusIsNull = ko.observable();

    self.expressDeliveryId = ko.observable(["1", "true", true].indexOf(params.expressDelivery) > -1 ? "true" : ["0", "false", false].indexOf(params.expressDelivery) > -1 ? "false" : '');
    self.expressDelivery = ko.observable();

    self.freeDeliveryId = ko.observable(["1", "true", true].indexOf(params.freeDelivery) > -1 ? "true" : ["0", "false", false].indexOf(params.freeDelivery) > -1 ? "false" : '');
    self.freeDelivery = ko.observable();

    self.reservedId = ko.observable(["1", "true", true].indexOf(params.reserved) > -1 ? "true" : ["0", "false", false].indexOf(params.reserved) > -1 ? "false" : '');
    self.reserved = ko.observable();

    self.customerHeldForFullDespatchId = ko.observable(["1", "true", true].indexOf(params.customerHeldForFullDespatch) > -1 ? "true" : ["0", "false", false].indexOf(params.customerHeldForFullDespatch) > -1 ? "false" : '');
    self.customerHeldForFullDespatch = ko.observable();

    self.unpaidProformaId = ko.observable(["1", "true", true].indexOf(params.unpaidProforma) > -1 ? "true" : ["0", "false", false].indexOf(params.unpaidProforma) > -1 ? "false" : '');
    self.unpaidProforma = ko.observable();

    //#endregion


    //#region Computeds

    self.allBound = ko.computed(() => {
        return true;
        //(self.productStatusAwaitingBinding() == false &&
        //    self.orderGroupAwaitingBinding() == false &&
        //    self.stockLocationGroupAwaitingBinding() == false &&
        //    self.orderStatusAwaitingBinding() == false &&
        //    self.orderStatusGroupAwaitingBinding() == false)
    }, self);

    //#endregion


    //#region Lifted Methods

    self.genericUnsavedChangesSelect = (e) => {
        e.preventDefault(); // this prevents the Kendo control from actively selecting the thing the user selected
        self.checkUnsavedChangesThenSelect(e); // this does our check; async promise, confirm dialog, la la la...
    }

    self.checkUnsavedChangesThenSelect = async (event) => {
        await self.unsavedChanges().then((d) => {
            //console.log('go', event.sender.options.dataValueField, event.dataItem[event.sender.options.dataValueField]);
            event.sender._widgetOptions.value(event.dataItem[event.sender.options.dataValueField]);

        }).catch((e) => { });
    }

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

            //switch (self.view()) {
            //    case VIEW_MANAGE:
            //        array = self.filledRecords();
            //        break;
            //    case VIEW_ADD:
            //        array = self.addFilledRecords();
            //        break;
            //    default: break;
            //}

            let unsaved = false;// array.find(p => p.unsavedChanges());

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

    self.productStatusParams = kendoMDCDropDownList({
        label: 'Product Status',
        data: [{
            Name: "C - Current",
            Value: "C"
        }, {
            Name: "L - Limited, Customer Informed",
            Value: "L"
        }, {
            Name: "Y - Limited, Customer Not Informed",
            Value: "Y"
        }, {
            Name: "S - Clearance",
            Value: "S"
        }, {
            Name: "P - PreLaunch",
            Value: "P"
        }, {
            Name: "O - In Development",
            Value: "O"
        }, {
            Name: "D - Discontinued",
            Value: "D"
        }, {
            Name: "X - Dropped",
            Value: "X"
        }],
        dataBound: (e) => self.productStatusAwaitingBinding(false),
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.productStatusId,
        objObservable: self.productStatus,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        popupSettings: {
            appendTo: document.getElementById('product-status-prefilter')
        }
    });

    self.orderGroupParams = kendoMDCDropDownList({
        label: 'Order Group',
        odata: true,
        endPoint: '/odata/OrderGroups',
        dataBound: (e) => self.orderGroupAwaitingBinding(false),
        textField: 'Name',
        valueField: 'OrderGroupID',
        idObservable: self.orderGroupId,
        objObservable: self.orderGroup,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'Name'
        },
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('order-group-prefilter')
        }
    });

    self.stockLocationGroupParams = kendoMDCDropDownList({
        label: 'Stock Location Group',
        odata: true,
        endPoint: '/odata/stockLocationOrderBookGroups',
        dataBound: (e) => self.stockLocationGroupAwaitingBinding(false),
        textField: 'Name',
        valueField: 'StockLocationOrderBookGroupID',
        idObservable: self.stockLocationGroupId,
        objObservable: self.stockLocationGroup,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'Name'
        },
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('stock-location-group-prefilter')
        }
    });

    self.orderStatusParams = kendoMDCDropDownList({
        label: 'Order Status',
        odata: true,
        endPoint: '/odata/OrderLineDetailedStatuses',
        dataBound: (e) => self.orderStatusAwaitingBinding(false),
        textField: 'Name',
        valueField: 'OrderLineDetailedStatusID',
        idObservable: self.orderStatusId,
        objObservable: self.orderStatus,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'OrderLineDetailedStatusID'
        },
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('order-status-prefilter')
        }
    });

    self.orderStatusGroupParams = kendoMDCDropDownList({
        label: 'Order Status Group',
        odata: true,
        endPoint: '/odata/OrderLineDetailedStatusGroups',
        dataBound: (e) => self.orderStatusGroupAwaitingBinding(false),
        textField: 'Name',
        valueField: 'OrderLineDetailedStatusGroupID',
        idObservable: self.orderStatusGroupId,
        objObservable: self.orderStatusGroup,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'OrderLineDetailedStatusGroupID'
        },
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('order-status-group-prefilter')
        }
    });

    self.hasLinkedPOParams = kendoMDCDropDownList({
        label: 'Has Linked PO',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.hasLinkedPOId,
        objObservable: ko.hasLinkedPO,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        popupSettings: {
            appendTo: document.getElementById('has-linked-po-prefilter')
        }
    });

    self.linkedPODelayedParams = kendoMDCDropDownList({
        label: 'Linked PO Delayed',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.linkedPODelayedId,
        objObservable: self.linkedPODelayed,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        popupSettings: {
            appendTo: document.getElementById('linked-po-delayed-prefilter')
        }
    });



    self.couldBeFulfilledFromFreeStockParams = kendoMDCDropDownList({
        label: 'Fulfillable from Free Stock',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.couldBeFulfilledFromFreeStockId,
        objObservable: self.couldBeFulfilledFromFreeStock,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        popupSettings: {
            appendTo: document.getElementById('fulfilled-from-free-stock-prefilter')
        }
    });

    self.couldBeFulfilledFromStockAllocatedToAnotherOrderParams = kendoMDCDropDownList({
        label: 'Fulfillable from another Order',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.couldBeFulfilledFromStockAllocatedToAnotherOrderId,
        objObservable: self.couldBeFulfilledFromStockAllocatedToAnotherOrder,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        popupSettings: {
            appendTo: document.getElementById('fulfilled-from-another-order-prefilter')
        }
    });


    self.lineStatusIdGreaterThanParams = kendoMDCDropDownList({
        label: 'Line Status ID >',
        data: oneToFiveOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.lineStatusIdGreaterThanId,
        objObservable: self.lineStatusIdGreaterThan,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        popupSettings: {
            appendTo: document.getElementById('line-status-greater-than-prefilter')
        }
    });


    self.lineStatusIdLessThanParams = kendoMDCDropDownList({
        label: 'Line Status ID <',
        data: oneToFiveOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.lineStatusIdLessThanId,
        objObservable: self.lineStatusIdLessThan,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        popupSettings: {
            appendTo: document.getElementById('line-status-less-than-prefilter')
        }
    });


    self.lineStatusChangedTodayParams = kendoMDCDropDownList({
        label: 'Line Status Changed Today',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.lineStatusChangedTodayId,
        objObservable: self.lineStatusChangedToday,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        popupSettings: {
            appendTo: document.getElementById('line-status-changed-today-prefilter')
        }
    });


    self.detailedLineStatusIsNullParams = kendoMDCDropDownList({
        label: 'Detailed Line Status is NULL',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.detailedLineStatusIsNullId,
        objObservable: self.detailedLineStatusIsNull,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        popupSettings: {
            appendTo: document.getElementById('detailed-line-status-is-null-prefilter')
        }
    });


    self.expressDeliveryParams = kendoMDCDropDownList({
        label: 'Express Delivery',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.expressDeliveryId,
        objObservable: self.expressDelivery,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        popupSettings: {
            appendTo: document.getElementById('express-delivery-prefilter')
        }
    });


    self.freeDeliveryParams = kendoMDCDropDownList({
        label: 'Free Delivery',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.freeDeliveryId,
        objObservable: self.freeDelivery,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        popupSettings: {
            appendTo: document.getElementById('free-delivery-prefilter')
        }
    });


    self.reservedParams = kendoMDCDropDownList({
        label: 'Reserved',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.reservedId,
        objObservable: self.reserved,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        popupSettings: {
            appendTo: document.getElementById('reserved-prefilter')
        }
    });


    self.customerHeldForFullDespatchParams = kendoMDCDropDownList({
        label: 'Customer Held for Full Despatch',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.customerHeldForFullDespatchId,
        objObservable: self.customerHeldForFullDespatch,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        popupSettings: {
            appendTo: document.getElementById('customer-held-for-full-despatch-prefilter')
        }
    });


    self.unpaidProformaParams = kendoMDCDropDownList({
        label: 'Unpaid Proforma',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.unpaidProformaId,
        objObservable: self.unpaidProforma,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        popupSettings: {
            appendTo: document.getElementById('unpaid-proforma-prefilter')
        }
    });







































    //#endregion


    //#region Subscriptions


    //#endregion


    //#region Validation Groups


    //#endregion


    //#region Functions

    // these id observables start as and reset to the empty string value intentionally
    // should probably set that as a constant
    self.reset = () => {
        self.productStatusId(EMPTY_STRING);
        self.productStatus(undefined);

        self.orderGroupId(EMPTY_STRING);
        self.orderGroup(undefined);

        self.stockLocationGroupId(EMPTY_STRING);
        self.stockLocationGroup(undefined);

        self.orderStatusId(EMPTY_STRING);
        self.orderStatus(undefined);

        self.orderStatusGroupId(EMPTY_STRING);
        self.orderStatusGroup(undefined);

        self.hasLinkedPOId(EMPTY_STRING);
        self.hasLinkedPO(undefined);

        self.linkedPODelayedId(EMPTY_STRING);
        self.linkedPODelayed(undefined);


        self.couldBeFulfilledFromFreeStockId(EMPTY_STRING);
        self.couldBeFulfilledFromFreeStock(undefined);

        self.couldBeFulfilledFromStockAllocatedToAnotherOrderId(EMPTY_STRING);
        self.couldBeFulfilledFromStockAllocatedToAnotherOrder(undefined);

        self.lineStatusIdGreaterThanId(EMPTY_STRING);
        self.lineStatusIdGreaterThan(undefined);

        self.lineStatusIdLessThanId(EMPTY_STRING);
        self.lineStatusIdLessThan(undefined);

        self.lineStatusChangedTodayId(EMPTY_STRING);
        self.lineStatusChangedToday(undefined);

        self.detailedLineStatusIsNullId(EMPTY_STRING);
        self.detailedLineStatusIsNull(undefined);

        self.expressDeliveryId(EMPTY_STRING);
        self.expressDelivery(undefined);

        self.freeDeliveryId(EMPTY_STRING);
        self.freeDelivery(undefined);

        self.reservedId(EMPTY_STRING);
        self.reserved(undefined);

        self.customerHeldForFullDespatchId(EMPTY_STRING);
        self.customerHeldForFullDespatch(undefined);

        self.unpaidProformaId(EMPTY_STRING);
        self.unpaidProforma(undefined);
    }

    self.json = ko.computed(() => {
        if (self.allBound()) {
            let result = {
                productStatus: self.productStatusId() === '' ? null : self.productStatusId(),
                orderGroupId: self.orderGroupId() === '' ? null : self.orderGroupId(),
                stockLocationGroupId: self.stockLocationGroupId() === '' ? null : self.stockLocationGroupId(),
                orderStatusId: self.orderStatusId() === '' ? null : self.orderStatusId(),
                orderStatusGroupId: self.orderStatusGroupId() === '' ? null : self.orderStatusGroupId(),
                hasLinkedPO: self.hasLinkedPOId() === '' ? null : self.hasLinkedPOId(),
                linkedPODelayed: self.linkedPODelayedId() === '' ? null : self.linkedPODelayedId(),
                couldBeFulfilledFromFreeStock: self.couldBeFulfilledFromFreeStockId() === '' ? null : self.couldBeFulfilledFromFreeStockId(),
                couldBeFulfilledFromStockAllocatedToAnotherOrder: self.couldBeFulfilledFromStockAllocatedToAnotherOrderId() === '' ? null : self.couldBeFulfilledFromStockAllocatedToAnotherOrderId(),
                lineStatusIdGreaterThan: self.lineStatusIdGreaterThanId() === '' ? null : self.lineStatusIdGreaterThanId(),
                lineStatusIdLessThan: self.lineStatusIdLessThanId() === '' ? null : self.lineStatusIdLessThanId(),
                lineStatusChangedToday: self.lineStatusChangedTodayId() === '' ? null : self.lineStatusChangedTodayId(),
                detailedLineStatusIsNull: self.detailedLineStatusIsNullId() === '' ? null : self.detailedLineStatusIsNullId(),
                expressDelivery: self.expressDeliveryId() === '' ? null : self.expressDeliveryId(),
                freeDelivery: self.freeDeliveryId() === '' ? null : self.freeDeliveryId(),
                reserved: self.reservedId() === '' ? null : self.reservedId(),
                customerHeldForFullDespatch: self.customerHeldForFullDespatchId() === '' ? null : self.customerHeldForFullDespatchId(),
                unpaidProforma: self.unpaidProformaId() === '' ? null : self.unpaidProformaId()
            };

            let title = []

            if (self.orderStatusGroup())
                title.push(`<span data-bind="OrderStatusGroupID: ${self.orderStatusGroupId()} - ${self.orderStatusGroup().Name}">Order Status Group: ${self.orderStatusGroup().Name}</span>`);

            if (self.orderStatus())
                title.push(`<span data-bind="OrderStatusID: ${self.orderStatusId()} - ${self.orderStatus().Name}">Order Status: ${self.orderStatus().Name}</span>`);

            if (self.orderGroup())
                title.push(`<span data-bind="OrderGroupID: ${self.orderGroupId()} - ${self.orderGroup().Name}">Order Group: ${self.orderGroup().Name}</span>`);

            if (self.stockLocationGroup())
                title.push(`<span data-bind="StockLocationGroupID: ${self.stockLocationGroupId()} - ${self.stockLocationGroup().Name}">Stock Location Group: ${self.stockLocationGroup().Name}</span>`);

            // this because predefinedfilter pods land you here with a particular title
            // which we want to hold onto through the first bind
            // any subsequent filter changes should update the title
            if (self.loadedWithTitle()) {
                self.loadedWithTitle(false);
            } else {

                let event = new CustomEvent('setDetailModalTitle', {
                    detail: title
                });

                window.parent.document.dispatchEvent(event)
            }

            console.log("advancedFilters.json returning", result);
            return JSON.stringify(result);
        } else {
            console.log("advancedfilters.json returning", undefined);
            return undefined;
        }
    }).extend({
        rateLimit: {
            timeout: 100,
            method: 'notifyWhenChangesStop'
        }
    });

    //#endregion


    //#region Events



    //#endregion

    return self;
};