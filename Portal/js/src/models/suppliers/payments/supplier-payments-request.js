const supplierPaymentsRequestViewModel = ({

} = {

}) => {
    let self = {};

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.readOnly = ko.observable(false);

    self.validateNow = ko.observable(false);

    self.paymentDueDate = ko.observable(new Date()).extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'You must provide a Payment Due Date'
        }
    });

    self.supplierCode = ko.observable('').extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'You must provide a SupplierCode'
        },
        notEqual: {
            params: '',
            onlyIf: self.validateNow,
            message: 'SupplierCode must not equal ""'
        }
    });

    self.supplier = ko.observable();

    self.supplierCurrency = ko.observable();

    self.paymentRequestStatusId = ko.observable('').extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'You must provide a Status'
        },
        notEqual: {
            params: '',
            onlyIf: self.validateNow,
            message: 'Status must not equal ""'
        }
    });

    self.paymentRequestStatus = ko.observable();

    self.requestedByMemberId = ko.observable(getUserId());
    self.requestedByMemberName = ko.observable(getUserName());

    self.purchaseOrderIds = ko.observableArray([])

    self.amountInCurrency = ko.observable().extend({
        required: {
            params: true,
            onlyIf: self.validateNow,
            message: 'You must provide an Amount'
        },
        greaterThan: {
            params: {
                value: 0,
            },
            onlyIf: self.validateNow,
            message: 'Amount must be positive and greater than zero'
        },
        numberFormatted: {
            digits: 2,
            currency: self.supplierCurrency
        }
    });

    self.proformaNumber = ko.observable();

    self.requesterComments = ko.observable();

    self.emptyArray = [];

    //#endregion



    //#region Components

    self.paymentDueDateParams = {
        label: "Payment Due",
        observable: self.paymentDueDate,
        originalValue: self.paymentDueDate(),
        displayObservable: ko.observable(),
        dateTimePickerOptions: {
            localization: {
                locale: 'en-GB',
                format: 'dd/MM/yyyy'
            },
            display: {
                sideBySide: false,
                components: {
                    clock: false,
                    calendar: true,
                    date: true,
                    month: true,
                    year: true,
                    decades: false,
                    clock: false,
                    hours: false,
                    minutes: false,
                    seconds: false
                },
                viewMode: 'calendar',
                cellSize: '3rem'
            },
            restrictions: {
                disabledDates: []
            },
            allowInputToggle: true,
            useCurrent: false,
            keepInvalid: true,
            debug: false
        },
        clearable: ko.observable(false),
        revertible: ko.observable(true),
        revertFunction: () => {
            self.paymentDueDate.observable(self.paymentDueDateParams.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true,
    };

    self.supplierTemplate = (e) => {
        if (e.Code && e.Name) {
            return `<span title="${e.Code} - ${e.Name}">${e.Code} - ${e.Name}</span>`;
        } else {
            return '';
        }
    }

    self.supplierParams = kendoMDCDropDownList({
        widget: ko.observable(),
        label: 'Supplier',
        odata: true,
        endPoint: '/odata/MertexLiveSuppliers?$expand=Currency',
        textField: 'Name',
        valueField: 'Code',
        template: self.supplierTemplate,
        valueTemplate: self.supplierTemplate,
        idObservable: self.supplierCode,
        objObservable: self.supplier,
        virtual: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                if (options.value) {
                    $.ajax({
                        url: `/odata/MertexLiveSuppliers/Default.MertexLiveSupplierValueMapper(supplierCode='${options.value || "null"}')?$expand=Currency`,
                        type: 'GET',
                        success: function (data) {
                            options.success(data.value);
                        }
                    });
                } else {
                    options.success();
                }
            }
        },
        locked: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(false),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: [{
            field: "Code", dir: "asc"
        }, {
            field: "Name", dir: "asc"
        }],
        ignoreCase: false,
        select: (e) => {
            console.log('supplierParams.select', e);
            self.supplierCurrency(e.dataItem.Currency);
        },
        clearFunction: (e) => {
            self.supplierCode('');
            self.supplierCurrency(undefined);
            self.supplierParams.widget().trigger('change');
        },
        parameterMap: (data) => {
            //Generate parameters in odata v4 format
            let d = kendo.data.transports['odata-v4'].parameterMap(data);

            delete d.$inlinecount; // <-- remove inlinecount
            delete d.$format; // <-- remove format
            delete d.$callback; // <-- remove callback

            let filters = [];

            if (data.filter && data.filter.filters.length) {
                let f = data.filter.filters.find(f => f.field === "Name");
                filters.push(`(contains(tolower(Name), '${f.value.toLowerCase()}') or contains(tolower(SortName), '${f.value.toLowerCase()}') or startswith(tolower(Code), '${f.value.toLowerCase()}') or startswith(tolower(Postcode), '${f.value.toLowerCase()}'))`);

                if (d.$filter) {
                    delete d.$filter;
                }
            }

            if (filters.length) {
                let filterString = filters.join(' and ');
                d.$apply = `filter(${filterString})`;
            }

            d.$count = true;

            return d;
        },
        popupSettings: {
            appendTo: '#new-request-modal'
        }
    });

    self.paymentRequestStatusTemplate = (e) => {
        if (e.PaymentRequestStatusID && e.Name) {
            return `<span title="${e.Name}">${e.Name}</span>`;
        } else {
            return '';
        }
    }

    self.paymentRequestStatusParams = kendoMDCDropDownList({
        label: 'Payment Request Status',
        odata: true,
        endPoint: '/odata/PaymentRequestStatuses',
        textField: 'Name',
        valueField: 'PaymentRequestStatusID',
        template: self.paymentRequestStatusTemplate,
        valueTemplate: self.paymentRequestStatusTemplate,
        idObservable: self.paymentRequestStatusId,
        objObservable: self.paymentRequestStatus,
        locked: ko.observable(false),
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
            field: 'SortOrder'
        },
        ignoreCase: false,
        select: (e) => {
            console.log('paymentRequestStatus.select', e);
        },
        clearFunction: (e) => {
            self.paymentRequestStatusId('');
            self.paymentRequestStatusParams.widget().trigger('change');
        },
        popupSettings: {
            appendTo: '#new-request-modal'
        }
    });

    self.amountInCurrencyParams = {
        label: 'Amount in Currency',
        buttons: false,
        observable: self.amountInCurrency,
        originalValue: self.amountInCurrency(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        busy: ko.observable(false),
        inputType: 'text',
        minValue: 0,
        maxValue: null,
        step: null,
        clearFunction: () => {
            self.amountCurrency(undefined);
        },
        revertFunction: () => {
            self.amountCurrency(self.vatableAmountInCurrencyParams.originalValue);
        }
    }

    self.purchaseOrderIdsParams = {
        observable: self.purchaseOrderIds,
        validate: self.purchaseOrderIds,
        emptyArray: self.emptyArray,
        width: 'auto',
        label: 'Purchase Orders',
        valuePrimitive: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        controlClass: 'form-control',
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        clearFunction: function () {
            var self = this;
            self.observable(self.emptyArray);
            self.multiSelectSettings.widget().value(self.emptyArray);
            $(self.observable.DOMElement).focus();
        },
        multiSelectSettings: {
            widget: ko.observable(),
            autoBind: true,
            autoWidth: true,
            valuePrimitive: false,
            value: self.purchaseOrderIds,
            dataItems: self.purchaseOrderIds,
            dataTextField: 'PurchaseOrderHeadID',
            dataValueField: 'PurchaseOrderHeadID',
            filter: 'startswith',
            height: 340,
            virtual: {
                itemHeight: 34,
                mapValueTo: 'dataItem',
                valueMapper: (options) => {
                    if (options.value && options.value.length && options.value[0] != '') {
                        $.ajax({
                            url: `/odata/PurchaseOrderHeads/Default.PurchaseOrderHeadValueMapper(purchaseOrderHeadIds='${options.value.join(',') || "null"}')`,
                            type: 'GET',
                            success: function (data) {
                                options.success(data.value);
                            }
                        });
                    } else {
                        options.success();
                    }
                }
            },
            data: new kendo.data.DataSource({
                type: 'odata-v4',
                serverFiltering: true,
                serverSorting: true,
                serverPaging: true,
                page: 1,
                pageSize: 40,
                sort: {
                    field: 'CreatedDT',
                    dir: 'desc'
                },
                dataTextField: 'PurchaseOrderHeadID',
                dataValueField: 'PurchaseOrderHeadID',
                schema: {
                    parse: (response) => {
                        let items = [];
                        for (var i = 0; i < response.value.length; i++) {
                            var item = {
                                PaymentRequestID: 0,
                                PurchaseOrderHeadID: response.value[i].PurchaseOrderHeadID
                            };
                            items.push(item);
                        }
                        response.value = items;
                        return response;
                    }
                },
                transport: {
                    read: {
                        url: '/odata/PurchaseOrderHeads',
                    },
                    parameterMap: (data, operation) => {

                        //Generate parameters in odata v4 format
                        let d = kendo.data.transports['odata-v4'].parameterMap(data);

                        delete d.$inlinecount; // <-- remove inlinecount
                        delete d.$format; // <-- remove format
                        delete d.$callback; // <-- remove callback

                        d.$count = true;

                        let filters = [];

                        return d;

                    }
                },
            }),
            change: function (e) {
                console.log('change', e);
            },
            template: (e) => {
                if (e.PurchaseOrderHeadID) {
                    return e.PurchaseOrderHeadID;
                } else {
                    return '';
                }
            },
            valueTemplate: (e) => {
                if (e.PurchaseOrderHeadID) {
                    return e.PurchaseOrderHeadID;
                } else {
                    return '';
                }
            },
            popup: {
                appendTo: '#new-request-modal'
            }
        }
    }

    self.proformaNumberParams = {
        label: 'Proforma Number',
        originalValue: ko.observable(),
        observable: self.proformaNumber,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: false,
        rows: 10,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: false,
        enable: ko.observable(true),
        disable: ko.observable(false),
        readonly: ko.observable(false),
        busy: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        visible: ko.observable(true)
    }

    self.requesterCommentsParams = {
        label: 'Requester Comments',
        originalValue: ko.observable(),
        observable: self.requesterComments,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        rows: 5,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: true,
        revertFunction: function () {
            self.notes(self.originalNotes());
            $(self.notes.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 2000
        },
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(true),
        visible: ko.observable(true)
    }

    self.errors = new ko.validation.group([
        self.paymentRequestStatusId,
        self.supplierCode,
        self.amountInCurrency
    ]);

    //#endregion



    //#region Computeds



    //#endregion



    //#region Subscriptions



    //#endregion



    //#region Methods

    self.toJS = () => {
        return {
            paymentRequestStatusId: self.paymentRequestStatusId(),
            supplierCode: self.supplierCode(),
            paymentDueDt: self.paymentDueDate(),
            amountInCurrency: self.amountInCurrency(),
            purchaseOrderIds: self.purchaseOrderIds(),
            proformaNumber: self.proformaNumber() == '' ? null : self.proformaNumber(),
            requesterComments: self.requesterComments() == '' ? null : self.requesterComments()
        }
    }

    //#endregion



    //#region Events



    //#endregion


    return self;
};