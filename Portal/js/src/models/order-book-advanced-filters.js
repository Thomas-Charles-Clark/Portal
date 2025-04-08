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
        parent: parent,
        params: params
    };

    self.busy = self.parent.busy;

    self.loadedWithTitle = ko.observable(params.title);

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

    self.hasLinkedPOId = ko.observable(["1", 1, "true", true].indexOf(params.hasLinkedPO) > -1 ? "true" : ["0", 0, "false", false].indexOf(params.hasLinkedPO) > -1 ? "false" : '');
    self.hasLinkedPO = ko.observable();

    self.linkedPODelayedId = ko.observable(["1", 1, "true", true].indexOf(params.linkedPODelayed) > -1 ? "true" : ["0", 0, "false", false].indexOf(params.linkedPODelayed) > -1 ? "false" : '');
    self.linkedPODelayed = ko.observable();





    self.couldBeFulfilledFromFreeStockId = ko.observable(["1", 1, "true", true].indexOf(params.couldBeFulfilledFromFreeStock) > -1 ? "true" : ["0", 0, "false", false].indexOf(params.couldBeFulfilledFromFreeStock) > -1 ? "false" : '');
    self.couldBeFulfilledFromFreeStock = ko.observable();

    self.couldBeFulfilledFromStockAllocatedToAnotherOrderId = ko.observable(["1", 1, "true", true].indexOf(params.couldBeFulfilledFromStockAllocatedToAnotherOrder) > -1 ? "true" : ["0", 0, "false", false].indexOf(params.couldBeFulfilledFromStockAllocatedToAnotherOrder) > -1 ? "false" : '');
    self.couldBeFulfilledFromStockAllocatedToAnotherOrder = ko.observable();

    self.couldBeFulfilledFromPurchaseOrderStockId = ko.observable(["1", 1, "true", true].indexOf(params.couldBeFulfilledFromPurchaseOrderStock) > -1 ? "true" : ["0", 0, "false", false].indexOf(params.couldBeFulfilledFromPurchaseOrderStock) > -1 ? "false" : '');
    self.couldBeFulfilledFromPurchaseOrderStock = ko.observable();

    self.lineStatusIdGreaterThanId = ko.observable(params.lineStatusIdGreaterThan ?? '');
    self.lineStatusIdGreaterThan = ko.observable();
    self.lineStatusIdGreaterThanAwaitingBinding = ko.observable(params.lineStatusIdGreaterThan != null && params.lineStatusIdGreaterThan != '');

    self.lineStatusIdLessThanId = ko.observable(params.lineStatusIdLessThan ?? '');
    self.lineStatusIdLessThan = ko.observable();
    self.lineStatusIdLessThanAwaitingBinding = ko.observable(params.lineStatusIdLessThan != null && params.lineStatusIdLessThan != '');

    self.lineStatusChangedTodayId = ko.observable(["1", 1, "true", true].indexOf(params.lineStatusChangedToday) > -1 ? "true" : ["0", 0, "false", false].indexOf(params.lineStatusChangedToday) > -1 ? "false" : '');
    self.lineStatusChangedToday = ko.observable();

    self.detailedLineStatusIsNullId = ko.observable(["1", 1, "true", true].indexOf(params.detailedLineStatusIsNull) > -1 ? "true" : ["0", 0, "false", false].indexOf(params.detailedLineStatusIsNull) > -1 ? "false" : '');
    self.detailedLineStatusIsNull = ko.observable();

    self.expressDeliveryId = ko.observable(["1", 1, "true", true].indexOf(params.expressDelivery) > -1 ? "true" : ["0", 0, "false", false].indexOf(params.expressDelivery) > -1 ? "false" : '');
    self.expressDelivery = ko.observable();

    self.freeDeliveryId = ko.observable(["1", 1, "true", true].indexOf(params.freeDelivery) > -1 ? "true" : ["0", 0, "false", false].indexOf(params.freeDelivery) > -1 ? "false" : '');
    self.freeDelivery = ko.observable();

    self.reservedId = ko.observable(["1", 1, "true", true].indexOf(params.reserved) > -1 ? "true" : ["0", 0, "false", false].indexOf(params.reserved) > -1 ? "false" : '');
    self.reserved = ko.observable();

    self.customerHeldForFullDespatchId = ko.observable(["1", 1, "true", true].indexOf(params.customerHeldForFullDespatch) > -1 ? "true" : ["0", 0, "false", false].indexOf(params.customerHeldForFullDespatch) > -1 ? "false" : '');
    self.customerHeldForFullDespatch = ko.observable();

    self.unpaidProformaId = ko.observable(["1", 1, "true", true].indexOf(params.unpaidProforma) > -1 ? "true" : ["0", 0, "false", false].indexOf(params.unpaidProforma) > -1 ? "false" : '');
    self.unpaidProforma = ko.observable();

    self.purchasingRecommendationId = ko.observable(params.purchasingRecommendationId ?? '');
    self.purchasingRecommendation = ko.observable();
    self.purchasingRecommendationsAwaitingBinding = ko.observable(params.purchasingRecommendationId != null && params.purchasingRecommendationId != '');

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

    self.orderGroupParams = kendoMDCDropDownList({
        label: 'Order Group',
        odata: true,
        endPoint: '/odata/OrderGroups',
        dataBound: (e) => self.orderGroupAwaitingBinding(false),
        textField: 'Name',
        valueField: 'OrderGroupID',
        idObservable: self.orderGroupId,
        objObservable: self.orderGroup,
        locked: ko.observable(self.orderGroupId() != ''),
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
        },
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            if ((e.Name != '') && (e.OrderGroupID != null)) {
                return `<span title="${e.Name}">Order Group: ${e.Name}</span>`
            } else {
                return '';
            }
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
        locked: ko.observable(self.stockLocationGroupId() != ''),
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
        },
        valueTemplate: (e) => {
            if ((e.Name != '') && (e.StockLocationOrderBookGroupID != null)) {
                return `<span title="${e.Name}">Stock Location Group: ${e.Name}</span>`
            } else {
                return '';
            }
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
        locked: ko.observable(self.orderStatusId() != ''),
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
        },
        valueTemplate: (e) => {
            if ((e.Name != '') && (e.OrderLineDetailedStatusID != null)) {
                return `<span title="${e.Name}">Order Status: ${e.Name}</span>`
            } else {
                return '';
            }
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
        locked: ko.observable(self.orderStatusGroupId() != ''),
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
        },
        valueTemplate: (e) => {
            if ((e.Name != '') && (e.OrderLineDetailedStatusGroupID != null)) {
                return `<span title="${e.Name}">Order Status Group: ${e.Name}</span>`
            } else {
                return '';
            }
        }
    });

    self.hasLinkedPOParams = kendoMDCDropDownList({
        label: 'Has Linked PO',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.hasLinkedPOId,
        objObservable: ko.hasLinkedPO,
        locked: ko.observable(self.hasLinkedPOId()),
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
        },
        valueTemplate: (e) => {
            if ((e.Name != '') && (e.Value != null)) {
                return `<span title="${e.Name}">Has Linked PO: ${e.Name}</span>`
            } else {
                return '';
            }
        }
    });

    self.linkedPODelayedParams = kendoMDCDropDownList({
        label: 'Linked PO Delayed',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.linkedPODelayedId,
        objObservable: self.linkedPODelayed,
        locked: ko.observable(self.linkedPODelayedId()),
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
        },
        valueTemplate: (e) => {
            if ((e.Name != '') && (e.Value != null)) {
                return `<span title="${e.Name}">Linked PO Delayed: ${e.Name}</span>`
            } else {
                return '';
            }
        }
    });



    self.couldBeFulfilledFromFreeStockParams = kendoMDCDropDownList({
        label: 'Fulfillable from Free Stock',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.couldBeFulfilledFromFreeStockId,
        objObservable: self.couldBeFulfilledFromFreeStock,
        locked: ko.observable(self.couldBeFulfilledFromFreeStockId()),
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
        popupSettings: {
            appendTo: document.getElementById('fulfilled-from-free-stock-prefilter')
        },
        valueTemplate: (e) => {
            if ((e.Name != '') && (e.Value != null)) {
                return `<span title="${e.Name}">Fulfillable from Stock: ${e.Name}</span>`
            } else {
                return '';
            }
        }
    });

    self.couldBeFulfilledFromStockAllocatedToAnotherOrderParams = kendoMDCDropDownList({
        label: 'Fulfillable from another Order',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.couldBeFulfilledFromStockAllocatedToAnotherOrderId,
        objObservable: self.couldBeFulfilledFromStockAllocatedToAnotherOrder,
        locked: ko.observable(self.couldBeFulfilledFromStockAllocatedToAnotherOrderId()),
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
        },
        valueTemplate: (e) => {
            if ((e.Name != '') && (e.Value != null)) {
                return `<span title="${e.Name}">Fulfillable from another Order: ${e.Name}</span>`
            } else {
                return '';
            }
        }
    });

    self.couldBeFulfilledFromPurchaseOrderStockParams = kendoMDCDropDownList({
        label: 'Fulfillable from PO Stock',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.couldBeFulfilledFromPurchaseOrderStockId,
        objObservable: self.couldBeFulfilledFromPurchaseOrderStock,
        locked: ko.observable(self.couldBeFulfilledFromPurchaseOrderStockId()),
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
            appendTo: document.getElementById('fulfilled-from-po-stock-prefilter')
        },
        valueTemplate: (e) => {
            if ((e.Name != '') && (e.Value != null)) {
                return `<span title="${e.Name}">Fulfillable from PO Stock: ${e.Name}</span>`
            } else {
                return '';
            }
        }
    });

    self.lineStatusIdGreaterThanParams = kendoMDCDropDownList({
        label: 'Line Status ID >',
        data: oneToFiveOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.lineStatusIdGreaterThanId,
        objObservable: self.lineStatusIdGreaterThan,
        locked: ko.observable(self.lineStatusIdGreaterThanId() != ''),
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
        },
        valueTemplate: (e) => {
            if ((e.Name != '') && (e.Value != null)) {
                return `<span title="${e.Name}">Line Status ID > ${e.Name}</span>`
            } else {
                return '';
            }
        }
    });


    self.lineStatusIdLessThanParams = kendoMDCDropDownList({
        label: 'Line Status ID <',
        data: oneToFiveOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.lineStatusIdLessThanId,
        objObservable: self.lineStatusIdLessThan,
        locked: ko.observable(self.lineStatusIdLessThanId() != ''),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('line-status-less-than-prefilter')
        },
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            if ((e.Name != '') && (e.Value != null)) {
                return `<span title="${e.Name}">Line Status ID < ${e.Name}</span>`
            } else {
                return '';
            }
        }
    });


    self.lineStatusChangedTodayParams = kendoMDCDropDownList({
        label: 'Line Status Changed Today',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.lineStatusChangedTodayId,
        objObservable: self.lineStatusChangedToday,
        locked: ko.observable(self.lineStatusChangedTodayId()),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('line-status-changed-today-prefilter')
        },
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            if ((e.Name != '') && (e.Value != null)) {
                return `<span title="${e.Name}">Line Status Changed Today: ${e.Name}</span>`
            } else {
                return '';
            }
        }
    });


    self.detailedLineStatusIsNullParams = kendoMDCDropDownList({
        label: 'Detailed Line Status is NULL',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.detailedLineStatusIsNullId,
        objObservable: self.detailedLineStatusIsNull,
        locked: ko.observable(self.detailedLineStatusIsNullId()),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('detailed-line-status-is-null-prefilter')
        },
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            if ((e.Name != '') && (e.Value != null)) {
                return `<span title="${e.Name}">Detailed Line Status is NULL: ${e.Name}</span>`
            } else {
                return '';
            }
        }
    });


    self.expressDeliveryParams = kendoMDCDropDownList({
        label: 'Express Delivery',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.expressDeliveryId,
        objObservable: self.expressDelivery,
        locked: ko.observable(self.expressDeliveryId()),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('express-delivery-prefilter')
        },
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            if ((e.Name != '') && (e.Value != null)) {
                return `<span title="${e.Name}">Express Delivery: ${e.Name}</span>`
            } else {
                return '';
            }
        }
    });


    self.freeDeliveryParams = kendoMDCDropDownList({
        label: 'Free Delivery',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.freeDeliveryId,
        objObservable: self.freeDelivery,
        locked: ko.observable(self.freeDeliveryId()),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('free-delivery-prefilter')
        },
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            if ((e.Name != '') && (e.Value != null)) {
                return `<span title="${e.Name}">Free Delivery: ${e.Name}</span>`
            } else {
                return '';
            }
        }
    });


    self.reservedParams = kendoMDCDropDownList({
        label: 'Reserved',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.reservedId,
        objObservable: self.reserved,
        locked: ko.observable(self.reservedId()),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('reserved-prefilter')
        },
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            if ((e.Name != '') && (e.Value != null)) {
                return `<span title="${e.Name}">Reserved: ${e.Name}</span>`
            } else {
                return '';
            }
        }
    });


    self.customerHeldForFullDespatchParams = kendoMDCDropDownList({
        label: 'Customer Held for Full Despatch',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.customerHeldForFullDespatchId,
        objObservable: self.customerHeldForFullDespatch,
        locked: ko.observable(self.customerHeldForFullDespatchId()),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('customer-held-for-full-despatch-prefilter')
        },
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            if ((e.Name != '') && (e.Value != null)) {
                return `<span title="${e.Name}">Customer Held for Full Despatch: ${e.Name}</span>`
            } else {
                return '';
            }
        }
    });


    self.unpaidProformaParams = kendoMDCDropDownList({
        label: 'Unpaid Proforma',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.unpaidProformaId,
        objObservable: self.unpaidProforma,
        locked: ko.observable(self.unpaidProformaId()),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        popupSettings: {
            appendTo: document.getElementById('unpaid-proforma-prefilter')
        },
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            if ((e.Name != '') && (e.Value != null)) {
                return `<span title="${e.Name}">Unpaid Proforma: ${e.Name}</span>`
            } else {
                return '';
            }
        }
    });


    self.purchasingRecommendationParams = kendoMDCDropDownList({
        label: 'Purchasing Recommendations',
        odata: true,
        endPoint: '/odata/PurchasingRecommendations',
        dataBound: (e) => self.purchasingRecommendationsAwaitingBinding(false),
        textField: 'Name',
        valueField: 'PurchasingRecommendationID',
        idObservable: self.purchasingRecommendationId,
        objObservable: self.purchasingRecommendation,
        locked: ko.observable(self.purchasingRecommendationId() != ''),
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
            appendTo: document.getElementById('purchasing-recommendation-prefilter')
        },
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            if ((e.Name != '') && (e.PurchasingRecommendationID != null)) {
                return `<span title="${e.Name}">Purchasing Recommendation: ${e.Name}</span>`
            } else {
                return '';
            }
        }
    });


    //#region Dropped Computeds

    self.passThroughFilters = ko.computed(() => {
        let result = [];

        Object.keys(self.params).forEach(p => {

            let properCaseLabel = p.replace(/([A-Z])/g, ' $1')
                .replace(/^./, function (str) {
                    return str.toUpperCase();
                });

            let label = `${p.replace('Id', '')}Params`;

            let exceptions = ['displayModes', 'accurateAsOfDateTime', 'title', 'procedure', 'view', 'filterable'];

            // if this property is not mapped as a filter either here or in userDefinedFilters...
            if (self[label] == null && self.parent.userDefinedFilters[label] == null) {

                if (self.params[p] === 0) {
                    self.params[p] = 'No';
                }

                if (self.params[p] != null && exceptions.indexOf(p) == -1) {
                    result.push(kendoMDCDropDownList({
                        label: properCaseLabel,
                        odata: false,
                        textField: 'Name',
                        valueField: 'Value',
                        data: [{
                            Name: properCaseLabel,
                            Value: self.params[p],
                        }],
                        idObservable: ko.observable(self.params[p]),
                        objObservable: ko.observable(),
                        locked: ko.observable(true),
                        enable: ko.observable(true),
                        disable: ko.observable(false),
                        clearable: ko.observable(true),
                        revertible: ko.observable(false),
                        readOnly: false,
                        autoBind: true,
                        height: 340,
                        sort: {
                            dir: 'asc',
                            field: 'Name'
                        },
                        clearFunction: self.genericUnsavedChangesClear,
                        template: (e) => {
                            return `<span title="${self.params[p]}">${self.params[p]}</span>`
                        },
                        valueTemplate: (e) => {
                            if ((e.Name != '') && (e.Value != null)) {
                                return `<span title="${self.params[p]}">${properCaseLabel}: ${self.params[p]}</span>`
                            } else {
                                return '';
                            }
                        }
                    }));
                }
            }
        });

        console.log('passThroughFilters', result);

        return result;
    });

    //#endregion

































    //#endregion


    //#region Subscriptions


    //#endregion


    //#region Validation Groups


    //#endregion


    //#region Functions

    // these id observables start as and reset to the empty string value intentionally
    // should probably set that as a constant
    self.reset = () => {
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

        self.couldBeFulfilledFromPurchaseOrderStockId(EMPTY_STRING);
        self.couldBeFulfilledFromPurchaseOrderStock(undefined);

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

        self.purchasingRecommendationId(EMPTY_STRING);
        self.purchasingRecommendation(undefined);
    }

    self.json = ko.computed(() => {
        if (self.allBound()) {
            let result = {
                orderGroupId: self.orderGroupId() === '' ? null : self.orderGroupId(),
                stockLocationGroupId: self.stockLocationGroupId() === '' ? null : self.stockLocationGroupId(),
                orderStatusId: self.orderStatusId() === '' ? null : self.orderStatusId(),
                orderStatusGroupId: self.orderStatusGroupId() === '' ? null : self.orderStatusGroupId(),
                hasLinkedPO: self.hasLinkedPOId() === '' ? null : self.hasLinkedPOId(),
                linkedPODelayed: self.linkedPODelayedId() === '' ? null : self.linkedPODelayedId(),
                couldBeFulfilledFromFreeStock: self.couldBeFulfilledFromFreeStockId() === '' ? null : self.couldBeFulfilledFromFreeStockId(),
                couldBeFulfilledFromPurchaseOrderStock: self.couldBeFulfilledFromPurchaseOrderStockId() === '' ? null : self.couldBeFulfilledFromPurchaseOrderStockId(),
                couldBeFulfilledFromStockAllocatedToAnotherOrder: self.couldBeFulfilledFromStockAllocatedToAnotherOrderId() === '' ? null : self.couldBeFulfilledFromStockAllocatedToAnotherOrderId(),
                lineStatusIdGreaterThan: self.lineStatusIdGreaterThanId() === '' ? null : self.lineStatusIdGreaterThanId(),
                lineStatusIdLessThan: self.lineStatusIdLessThanId() === '' ? null : self.lineStatusIdLessThanId(),
                lineStatusChangedToday: self.lineStatusChangedTodayId() === '' ? null : self.lineStatusChangedTodayId(),
                detailedLineStatusIsNull: self.detailedLineStatusIsNullId() === '' ? null : self.detailedLineStatusIsNullId(),
                expressDelivery: self.expressDeliveryId() === '' ? null : self.expressDeliveryId(),
                freeDelivery: self.freeDeliveryId() === '' ? null : self.freeDeliveryId(),
                reserved: self.reservedId() === '' ? null : self.reservedId(),
                customerHeldForFullDespatch: self.customerHeldForFullDespatchId() === '' ? null : self.customerHeldForFullDespatchId(),
                unpaidProforma: self.unpaidProformaId() === '' ? null : self.unpaidProformaId(),
                purchasingRecommendationId: self.purchasingRecommendationId() == '' ? null : self.purchasingRecommendationId()
            };

            let title = []

            // if your thingie is a stringie then do this dance...
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