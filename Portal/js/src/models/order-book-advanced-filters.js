const orderBookAdvancedFiltersViewModel = ({
    parent,
    params
} = {
    parent: {},
    params: {
        productStatusId: ''
    }
}) => {

    //#region Properties

    let self = {
        parent: parent
    };

    self.busy = self.parent.busy;

    self.productStatusId = ko.observable(params.productStatus ?? '');
    self.productStatus = ko.observable();

    self.orderGroupId = ko.observable(params.orderGroupId ?? '');
    self.orderGroup = ko.observable();

    self.stockLocationGroupId = ko.observable(params.stockLocationGroupId ?? '');
    self.stockLocationGroup = ko.observable();

    self.orderStatusId = ko.observable(params.orderStatusId ?? '');
    self.orderStatus = ko.observable();

    self.orderStatusGroupId = ko.observable(params.orderStatusGroupId ?? '');
    self.orderStatusGroup = ko.observable();

    self.orderLineDetailedStatusId = ko.observable(params.orderLineDetailedStatusId ?? '');
    self.orderLineDetailedStatus = ko.observable();

    self.hasLinkedPO = ko.observable(params.hasLinkedPO ?? false);

    self.linkedPODelayed = ko.observable(params.linkedPODelayed ?? false);

    //#endregion


    //#region Computeds



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

    self.orderLineDetailedStatusParams = kendoMDCDropDownList({
        label: 'Order Line Detailed Status',
        odata: true,
        endPoint: '/odata/OrderLineDetailedStatuses',
        textField: 'Name',
        valueField: 'OrderLineDetailedStatusID',
        idObservable: self.orderLineDetailedStatusId,
        objObservable: self.orderLineDetailedStatus,
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
            appendTo: document.getElementById('order-line-detailed-status-prefilter')
        }
    });

    self.orderGroupParams = kendoMDCDropDownList({
        label: 'Order Group',
        odata: true,
        endPoint: '/odata/OrderGroups',
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
        textField: 'Name',
        valueField: 'stockLocationOrderBookGroupID',
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
            field: 'stockLocationOrderBookGroupID'
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

    self.hasLinkedPOParams = {
        label: 'Has Linked PO?',
        checkboxId: `has-linked-po`,
        observable: self.hasLinkedPO,
        originalValue: false,
        useNativeValidation: false,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false)
    };

    self.linkedPODelayedParams = {
        label: 'Linked PO Delayed?',
        checkboxId: `linked-po-delayed`,
        observable: self.linkedPODelayed,
        originalValue: false,
        useNativeValidation: false,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false)
    }

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

        self.orderLineDetailedStatusId(EMPTY_STRING);
        self.orderLineDetailedStatus(undefined);

        self.orderGroupId(EMPTY_STRING);
        self.orderGroup(undefined);

        self.stockLocationGroupId(EMPTY_STRING);
        self.stockLocationGroup(undefined);

        self.orderStatusId(EMPTY_STRING);
        self.orderStatus(undefined);

        self.orderStatusGroupId(EMPTY_STRING);
        self.orderStatusGroup(undefined);

        self.hasLinkedPO(false);

        self.linkedPODelayed(false);
    }

    self.json = ko.computed(() => {
        let result = {
            productStatus: self.productStatusId() || null,
            orderLineDetailedStatusId: self.orderLineDetailedStatusId() || null,
            orderGroupId: self.orderGroupId() || null,
            stockLocationGroupId: self.stockLocationGroupId() || null,
            orderStatusId: self.orderStatusId() || null,
            orderStatusGroupId: self.orderStatusGroupId() || null,
            hasLinkedPO: self.hasLinkedPO(),
            linkedPODelayed: self.linkedPODelayed()
        };

        return JSON.stringify(result);
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