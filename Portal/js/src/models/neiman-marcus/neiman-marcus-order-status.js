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
    dateRangeId: 30,
    name: 'Last 30 Days'
}, {
    dateRangeId: -1,
    name: 'Custom'
}, {
    dateRangeId: -2,
    name: 'All Time'
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

    self.orderStatusId = ko.observable('I');

    self.orderStatuses = orderStatuses;

    self.fromDate = ko.observable();

    self.toDate = ko.observable();

    self.dateRangeId = ko.observable(-2);

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

    self.titleExplanations = ko.observableArray([]);

    self.summaryPods = ko.observableArray([]);

    self.quietPrefilters = ko.observable(false);

    self.activePodId = ko.observable();

    //#endregion


    //#region Templates

    self.slantedHeaderTemplate = (heading, fieldName) => {
        return `<label class="slanted-column-heading" data-field-name="${(fieldName ?? heading)}Explanation" data-bind="attr: { title: title }">${heading}</label>`;
    }

    self.groupHeaderTemplate = (item) => {
        //console.log(item);
        let first = item.items[0];
        return `<span>DSCO Order ID: <span class="font-normal">${first.DSCO_OrderID}</span><span class="ms-5">NM Order ID: <span class="font-normal">${(first.NeimanMarcus_OrderID ?? 'pending')}</span></span><span class="ms-5">Order Date: <span class="font-normal">${moment(first.OrderDT).format('DD/MM/YYYY HH:mm:ss')}</span></span>`;
    }

    self.gridColumns = [{
        field: "OrderDT",
        title: "Order Date",
        hidden: true
    }, {
        field: "DSCO_OrderID",
        title: "DSCO Order ID",
        hidden: true,
        groupHeaderTemplate: self.groupHeaderTemplate
    }, {
        field: "NeimanMarcus_OrderID",
        title: "NM Order ID",
        hidden: true,
        groupHeaderTemplate: self.groupHeaderTemplate
    }, {
        field: "DG_OrderID",
        title: "DG Order ID"
    }, {
        field: "ProductCode",
        title: "Product Code"
    }, {
        field: "Quantity",
        title: "Quantity",
        width: 120
    }, {
        field: "SummaryStatus",
        title: "Summary"
    }, {
        field: "ReceivedCell",
        title: "Received",
        filterable: false,
        headerTemplate: self.slantedHeaderTemplate("Received"),
        width: 57
    }, {
        field: "ExplodedCell",
        title: "Exploded",
        filterable: false,
        headerTemplate: self.slantedHeaderTemplate("Exploded"),
        width: 57
    }, {
        field: "ImportedCell",
        title: "Imported",
        filterable: false,
        headerTemplate: self.slantedHeaderTemplate("Imported"),
        width: 57
    }, {
        field: "VerifiedCell",
        title: "Verified",
        filterable: false,
        headerTemplate: self.slantedHeaderTemplate("Verified"),
        width: 57
    }, {
        field: "AcknowledgedCell",
        title: "Acknowledged",
        filterable: false,
        headerTemplate: self.slantedHeaderTemplate("Acknowledged"),
        width: 57
    }, {
        field: "PackedCell",
        title: "Packed",
        filterable: false,
        headerTemplate: self.slantedHeaderTemplate("Packed"),
        width: 57
    }, {
        field: "DropShipCell",
        title: "Drop Shipped",
        filterable: false,
        headerTemplate: self.slantedHeaderTemplate("Drop Shipped", "DropShip"),
        width: 57
    }, {
        field: "ShippedCell",
        title: "Shipped",
        filterable: false,
        headerTemplate: self.slantedHeaderTemplate("Shipped"),
        width: 57
    }, {
        field: "InvoicedCell",
        title: "Invoiced",
        filterable: false,
        headerTemplate: self.slantedHeaderTemplate("Invoiced"),
        width: 57
    }, {
        field: "CancelledCell",
        title: "Cancelled",
        filterable: false,
        headerTemplate: self.slantedHeaderTemplate("Cancelled"),
        width: 57
    }];

    //#endregion


    //#region Methods

    self.summaryPodClick = (data) => {
        self.quietPrefilters(true);
        self.activePodId(data.PodID);
        self.dateRangeId(-1);
        self.fromDate(new Date(data.StartDate));
        self.toDate(new Date(data.EndDate));
        self.gridRequestEndOnComplete = () => {
            self.quietPrefilters(false);
        }
        self.performSearch();
    }

    self.performSearch = (onComplete) => {
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

                self.titleExplanations(Object.keys(data.titleExplanations).map(k => neimanMarcusColumnTitleViewModel({
                    rec: {
                        heading: k,
                        title: `${data.titleExplanations[k]}`
                    },
                    parent: self
                })));

                self.summaryPods(data.summaryPods.map(sp => neimanMarcusSummaryPodViewModel({
                    rec: sp,
                    parent: self
                })));

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
        autoBind: true,
        afterClear: () => {
            self.activePodId(undefined);
        }
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
        autoBind: true,
        afterClear: () => {
            self.activePodId(undefined);
        }
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
            self.activePodId(undefined);
            self.fromDate(undefined);
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
            self.activePodId(undefined);
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
            self.activePodId(undefined);
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
        grouping: true,
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
                    ExpiryDT: { type: 'date', editable: false }
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

                document.querySelectorAll('.slanted-column-heading').forEach(e => {
                    ko.cleanNode(e);
                    let d = self.titleExplanations().find(t => t.heading == `${e.dataset.fieldName}`);
                    ko.applyBindings(d, e);
                });

                if (typeof self.gridRequestEndOnComplete === 'function') {
                    self.gridRequestEndOnComplete();
                }
            }, 0);
        },
        group: {
            field: 'DSCO_OrderID'
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
            message: 'From Date must precede To Date'
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
        if (!self.quietPrefilters())
            self.performSearch();
    });

    self.fromDate.subscribe(nv => {
        if (!self.quietPrefilters())
            self.performSearch();
    });

    self.toDate.subscribe(nv => {
        if (!self.quietPrefilters())
            self.performSearch();
    });

    self.dateRangeId.subscribe(nv => {
        if (nv != -1 && !self.quietPrefilters()) {
            self.performSearch();
        }
    });

    //#endregion



    //#region Events



    //#endregion


    return self;
};

const neimanMarcusSummaryPodViewModel = ({
    rec,
    parent
} = {
        rec: null,
        parent: null
    }) => {

    let self = Object.assign(rec, {
        activePodId: parent.activePodId
    });

    //#region Properties



    //#endregion



    //#region Methods



    //#endregion



    //#region Components


    //#endregion



    //#region Computeds

    self.orderCountDisplay = ko.computed(() => {
        let count = self.OrderCount;
        return `${count} Order${(count == 1 ? '' : 's')}`;
    }, self);

    self.salesTitle = ko.computed(() => {
        let count = self.OrderCount;
        return `${count} Order${(count == 1 ? '' : 's')}`;
    }, self);

    self.salesTotalDisplay = ko.computed(() => {
        return formatCurrency(self.SalesTotal, 0, 'en-us', 'USD');
    }, self);

    self.active = ko.computed(() => {
        return self.PodID == self.activePodId();
    }, self);

    //#endregion





    //#region Subscriptions



    //#endregion



    //#region Events



    //#endregion

    return self;
}

const neimanMarcusColumnTitleViewModel = ({
    rec
} = {
        rec: null,
        parent: null
    }) => {
    let self = Object.assign(rec, {
        titleExplanations: parent.titleExplanations
    });

    //#region Properties



    //#endregion



    //#region Methods



    //#endregion



    //#region Components


    //#endregion



    //#region Computeds



    //#endregion





    //#region Subscriptions



    //#endregion



    //#region Events



    //#endregion

    return self;
}

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

            let markup = null;

            if (element.classList.contains('received')) {
                markup = e.ReceivedDetails;
            } else if (element.classList.contains('exploded')) {
                markup = e.ExplodedDetails;
            } else if (element.classList.contains('imported')) {
                markup = e.ImportedDetails;
            } else if (element.classList.contains('verified')) {
                markup = e.VerifiedDetails;
            } else if (element.classList.contains('acknowledged')) {
                markup = e.AcknowledgedDetails;
            } else if (element.classList.contains('packed')) {
                markup = e.PackedDetails;
            } else if (element.classList.contains('drop-shipped')) {
                markup = e.DropShipDetails;
            } else if (element.classList.contains('shipped')) {
                markup = e.ShippedDetails;
            } else if (element.classList.contains('invoiced')) {
                markup = e.InvoicedDetails;
            } else if (element.classList.contains('cancelled')) {
                markup = e.CancelledDetails;
            }

            if (markup) {

                let parser = new DOMParser();
                
                let content = parser.parseFromString(markup, 'text/html');

                console.log('content', content);

                let body = content.body;

                console.log('body', body);

                markup = [...body.childNodes].reduce((a, n) => {
                    if (n && n.attributes) {
                        let type = n.attributes['type']?.value;

                        if (type == 'json') {
                            a += `<pre>${PR.prettyPrintOne(n.innerHTML, 'json', true)}</pre>`
                        } else {
                            a += n.outerHTML ?? n.innerHTML ?? n.innerText ?? n.textContent;
                        }
                    } else {
                        a += n.outerHTML ?? n.innerHTML ?? n.innerText ?? n.textContent;
                    }

                    return a;
                }, '');

                return markup;

            } else {
                return null;
            }
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



    //#region Events / Event Handlers

    self.keydown = (data, event) => {
        if (event.originalEvent && event.originalEvent.keyCode) {
            switch (event.originalEvent.keyCode) {
                case 13:
                case 32:
                    event.target.click();
                    return false;
                default: break;
            }
        }

        return true;
    }

    //#endregion

    return self;
}