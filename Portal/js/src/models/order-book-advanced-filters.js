const yesNoOptions = [{
    Name: 'Yes',
    Value: true
}, {
    Name: 'No',
    Value: false
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

    self.productStatusId = ko.observable(params.productStatus ?? '');
    self.productStatus = ko.observable();
    self.productStatusAwaitingBinding = ko.observable(params.productStatus != null && params.productStatus != '');

    self.orderGroupId = ko.observable(params.orderGroupId ?? '');
    self.orderGroup = ko.observable();
    self.orderGroupAwaitingBinding = ko.observable(params.orderGroupId != null && params.orderGroupId != '');

    self.stockLocationGroupId = ko.observable(params.stockLocationGroupId ?? '');
    self.stockLocationGroup = ko.observable();
    self.stockLocationGroupAwaitingBinding = ko.observable(params.stockLocationGroupId != null && params.stockLocationGroupId != '');

    // THIS is the one, get rid of
    // and orderLineDetailedStatusId will be named orderStatusId 
    self.orderStatusId = ko.observable(params.orderStatusId ?? '');
    self.orderStatus = ko.observable();
    self.orderStatusAwaitingBinding = ko.observable(params.orderStatusId != null && params.orderStatusId != '');

    self.orderStatusGroupId = ko.observable(params.orderStatusGroupId ?? '');
    self.orderStatusGroup = ko.observable();
    self.orderStatusGroupAwaitingBinding = ko.observable(params.orderStatusGroupId != null && params.orderStatusGroupId != '');

    self.hasLinkedPOId = ko.observable(params.hasLinkedPO == "1" ? true : params.hasLinkedPO == "0" ? false : '');
    self.hasLinkedPO = ko.observable();

    self.linkedPODelayedId = ko.observable(params.linkedPODelayed == "1" ? true : params.linkedPODelayed == "0" ? false : '');
    self.linkedPODelayed = ko.observable();

    self.loadedWithTitle = ko.observable(params.title);

    //#endregion


    //#region Computeds

    self.allBound = ko.computed(() => {
        return (self.productStatusAwaitingBinding() == false &&
            self.orderGroupAwaitingBinding() == false &&
            self.stockLocationGroupAwaitingBinding() == false &&
            self.orderStatusAwaitingBinding() == false &&
            self.orderStatusGroupAwaitingBinding() == false)
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
            field: 'OrderGroupID'
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
            field: 'StockLocationOrderBookGroupID'
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
        label: 'Has Linked PO',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.linkedPODelayedId,
        objObservable: ko.linkedPODelayed,
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
    }

    self.json = ko.computed(() => {
        if (self.allBound()) {
            let result = {
                productStatus: self.productStatusId() || null,
                orderGroupId: self.orderGroupId() || null,
                stockLocationGroupId: self.stockLocationGroupId() || null,
                orderStatusId: self.orderStatusId() || null,
                orderStatusGroupId: self.orderStatusGroupId() || null,
                hasLinkedPO: self.hasLinkedPOId() == '' ? null : self.hasLinkedPOId(),
                linkedPODelayed: self.linkedPODelayedId() == '' ? null : self.linkedPODelayedId()
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

            return JSON.stringify(result);
        } else {
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