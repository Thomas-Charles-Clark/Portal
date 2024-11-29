const dateRanges = [{
    dateRangeId: 12,
    name: 'Last 12 Months'
}, {
    dateRangeId: 6,
    name: 'Last 6 Months'
}, {
    dateRangeId: 1,
    name: 'This Month'
}, {
    dateRangeId: -1,
    name: 'Custom'
}];

const orderStatuses = [{
    orderStatusId: 'C',
    name: 'Completed'
}, {
    orderStatusId: 'I',
    name: 'Incomplete'
}, {
    orderStatusId: 'O',
    name: 'Overdue'
}, {
    orderStatusId: 'E',
    name: 'Error'
}, {
    orderStatusId: 'X',
    name: 'Cancelled'
}];


const neimanMarcusOrderStatusViewModel = ({ } = {}) => {
    let self = {};

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(true);

    self.validateSearchNow = ko.observable(true);

    self.orderStatusId = ko.observable('');

    self.orderStatuses = orderStatuses;

    self.fromDate = ko.observable(new Date(moment(new Date()).add(-6, 'months')));

    self.toDate = ko.observable(new Date());

    self.dateRangeId = ko.observable(12);

    self.dateRangeType = ko.observable(1);

    self.dateRanges = dateRanges;

    self.fromDate.extend({
        date: {
            params: true,
            message: 'From must be a date'
        },
        required: {
            params: true,
            onlyIf: function () {
                return self.validateSearchNow() && self.dateRangeId() == -1 && self.toDate() != null
            },
            message: 'Please provide From Date'
        }
    });

    self.toDate.extend({
        date: {
            params: true,
            message: 'To must be a date'
        }
    });

    self.searchTerm = ko.observable();

    self.gridWidget = ko.observable();

    self.titleExplanations = ko.observable();

    //#endregion


    //#region Templates

    self.slantedHeaderTemplate = (heading) => {
        return `<label class="slanted-column-heading">${heading}</label>`;
    }

    self.gridColumns = [{
        field: "OrderDT",
        title: "Order Date",
        filterable: false,
        width: 120
    }, {
        field: "NeimanMarcus_OrderID",
        title: "NM Order Number"
    }, {
        field: "DG_OrderID",
        title: "DG Order Number"
    }, {
        field: "ProductCode",
        title: "Product Code"
    }, {
        field: "Quantity",
        title: "Quantity",
        width: 120
    }, {
        field: "ReceivedCell",
        title: "Received",
        filterable: false,
        headerTemplate: self.slantedHeaderTemplate("Received"),
        width: 47
    }, {
        field: "ExplodedCell",
        title: "Exploded",
        filterable: false,
        headerTemplate: self.slantedHeaderTemplate("Exploded"),
        width: 47
    }, {
        field: "ImportedCell",
        title: "Imported",
        filterable: false,
        headerTemplate: self.slantedHeaderTemplate("Imported"),
        width: 47
    }, {
        field: "VerifiedCell",
        title: "Verified",
        filterable: false,
        headerTemplate: self.slantedHeaderTemplate("Verified"),
        width: 47
    }, {
        field: "AcknowledgedCell",
        title: "Acknowledged",
        filterable: false,
        headerTemplate: self.slantedHeaderTemplate("Acknowledged"),
        width: 47
    }, {
        field: "DropShipCell",
        title: "Drop Shipped",
        filterable: false,
        headerTemplate: self.slantedHeaderTemplate("Drop Shipped"),
        width: 47
    }, {
        field: "ShippedCell",
        title: "Shipped",
        filterable: false,
        headerTemplate: self.slantedHeaderTemplate("Shipped"),
        width: 47
    }, {
        field: "InvoicedCell",
        title: "Invoiced",
        filterable: false,
        headerTemplate: self.slantedHeaderTemplate("Invoiced"),
        width: 47
    }, {
        field: "CancelledCell",
        title: "Cancelled",
        filterable: false,
        headerTemplate: self.slantedHeaderTemplate("Cancelled"),
        width: 47
    }];

    //#endregion


    //#region Methods

    self.performSearch = () => {
        self.gridWidget().dataSource.read();
    };

    self.gridDataSourceRead = (options) => {

        self.busy(true);

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {

        };

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        data = Object.assign({
            status: self.orderStatusId() ?? null,
            fromDate: typeof self.fromDate() == 'object' ? self.fromDate().toUTCString() : self.fromDate(),
            toDate: typeof self.toDate() == 'object' ? self.toDate().toUTCString() : self.toDate(),
            dateRangeId: self.dateRangeId() ?? null
        }, data);

        if (self.searchTerm() && self.searchTerm().length) {
            data.searchTerm = self.searchTerm()
        }

        console.log('gridDataSourceRead calling with', data);

        fetch('/api/NeimanMarcusOrderStatusApi/RefreshGrid?' + new URLSearchParams(data), {
            method: 'GET',
            headers: window.fetchHeaders
        })
            .then(window.handleFetchResponse)
            .then(data => {

                console.log('gridDataSourceRead returned', data);

                self.titleExplanations(data.titleExplanations);

                data.kendoResult.Data = data.kendoResult.Data.map(d => neimanMarcusOrderStatusResult({
                    rec: d
                }))

                options.success(data.kendoResult);

                self.busy(false);

            })
            .catch(err => {
                options.error();
                window.catchFetchError(err);
            })
    }

    //#endregion



    //#region Components

    self.statusParams = kendoMDCDropDownList({
        label: 'Order Status',
        data: self.orderStatuses,
        textField: 'name',
        valueField: 'orderStatusId',
        idObservable: self.orderStatusId,
        objObservable: ko.observable(),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        autoBind: true
    });

    self.dateRangeParams = kendoMDCDropDownList({
        label: 'Date Range',
        data: self.dateRanges,
        textField: 'name',
        valueField: 'dateRangeId',
        idObservable: self.dateRangeId,
        objObservable: ko.observable(),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        autoBind: true
    });

    self.fromDateParams = {
        label: "From Date",
        observable: self.fromDate,
        originalValue: self.fromDate(),
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
                viewMode: 'months',
                cellSize: '3rem'
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

                }
            },
            viewDate: new Date(self.fromDate())
        },
        clearable: ko.observable(false),
        clearFunction: () => {
            self.expiryDate(undefined);
        },
        revertible: ko.observable(true),
        revertFunction: () => {
            self.fromDate.observable(self.fromDateParams.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true
    };

    self.toDateParams = {
        label: "To Date",
        observable: self.toDate,
        originalValue: self.toDate(),
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
                viewMode: 'months',
                cellSize: '3rem'
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

                }
            },
            viewDate: new Date(self.toDate())
        },
        clearable: ko.observable(false),
        clearFunction: () => {
            self.toDate(undefined);
        },
        revertible: ko.observable(true),
        revertFunction: () => {
            self.toDate.observable(self.toDateParams.originalValue);
        },
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true
    };

    self.searchTermParams = {
        label: 'Order Number, Product Code, etc.',
        originalValue: ko.observable(),
        observable: self.searchTerm,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        enterKey: () => {
            if (self.searchTerm() && self.searchTerm().length) {
                self.performSearch();
            }
        },
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: false,
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false)
    };

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
        pageSize: 100,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "AggregateResults",
            model: {
                id: 'OrderID',
                fields: {
                    OrderID: { type: 'number', editable: false },
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
        noDataTemplate: 'Nothing to display',
        requestEnd: (e) => {
            window.setTimeout(() => {
                document.addEventListener("click", (e) => {
                    if (e.target.closest('.detail-popover') == null) {
                        document.querySelectorAll('[data-bind*="actualBootstrapPopover"]').forEach(e => {
                            let p = bootstrap.Popover.getInstance(e);
                            if (p) {
                                p.hide();
                            }
                        });
                    }
                });
            }, 0);
        }
    });

    self.orderStatusGridSettings = {
        autoBind: true,
        widget: self.gridWidget,
        columns: self.gridColumns,
        data: self.gridDataSource,
        useKOTemplates: true,
        rowTemplate: 'row-template',
        sortable: true,
        groupable: false,
        filterable: true,
        reorderable: false,
        editable: false,
        selectable: false,
        navigatable: true,
        scrollable: true,
        paging: true,
        pageSize: 100,
        change: (e) => {
            console.log(e);
        },
        pageable: {
            pageSize: 100,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        }
    };

    //#endregion



    //#region Computeds

    self.fromPreceedsTo = ko.pureComputed(() => {
        if (self.fromDate() && self.toDate()) {
            return self.fromDate().getTime() <= self.toDate().getTime();
        }
    }, self).extend({
        equal: {
            params: true,
            onlyIf: function () {
                return self.fromDate() && self.toDate()
            },
            message: 'From Date must preceed To Date'
        }
    }, self);

    //#endregion


    //#region Error Groups


    self.errors = new ko.validation.group([
        self.fromPreceedsTo
    ]);


    //#endregion



    //#region Subscriptions

    self.orderStatusId.subscribe(nv => {
        self.performSearch();
    });

    self.fromDate.subscribe(nv => {
        self.performSearch();
    });

    self.toDate.subscribe(nv => {
        self.performSearch();
    });

    self.dateRangeId.subscribe(nv => {
        if (nv != -1) {
            self.performSearch();
        }
    });

    //#endregion



    //#region Events



    //#endregion


    return self;
};

const neimanMarcusOrderStatusResult = ({
    rec
} = {
    rec: null,
    parent: null
}) => {
    let self = Object.assign(rec, {

    });

    //#region Properties

    self.ready = ko.observable(true);

    self.busy = ko.observable(false);

    //#endregion



    //#region Methods



    //#endregion



    //#region Components

    self.errors = new ko.validation.group([

    ]);

    self.bootstrapPopoverDetails = {
        title: "Details",
        html: true,
        sanitize: false,
        busy: ko.observable(false),
        data: ko.observable(),
        element: ko.observable(),
        container: 'div#order-status-grid',
        placement: 'left',
        fallbackPlacements: ['left'],
        customClass: 'detail-popover',
        content: (element) => {
            let e = ko.dataFor(element);

            if (element.classList.contains('received')) {
                return e.ReceivedDetails;
            } else if (element.classList.contains('exploded')) {
                return e.ExplodedDetails;
            } else if (element.classList.contains('imported')) {
                return e.ImportedDetails;
            } else if (element.classList.contains('verified')) {
                return e.VerifiedDetails;
            } else if (element.classList.contains('acknowledged')) {
                return e.AcknowledgedDetails;
            } else if (element.classList.contains('drop-shipped')) {
                return e.DropShipDetails;
            } else if (element.classList.contains('shipped')) {
                return e.ShippedDetails;
            } else if (element.classList.contains('invoiced')) {
                return e.InvoicedDetails;
            } else if (element.classList.contains('cancelled')) {
                return e.CancelledDetails;
            }

            return null;
        },
        trigger: 'click',
        //container: 'td',
        solo: true,
        show: null,
        shown: null,
        hide: null,
        hidden: null,
        inserted: async function (event) {

        },
        popperConfig: function (defaultBsPopperConfig) {
            return defaultBsPopperConfig;
        }
    }

    //#endregion



    //#region Computeds



    //#endregion





    //#region Subscriptions



    //#endregion



    //#region Events



    //#endregion

    return self;
}