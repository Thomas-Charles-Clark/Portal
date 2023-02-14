const basketStatusViewModel = (({
    resources
} = {}) => {
    let self = {
        resources: resources
    };

    //#region Properties

    self.validateSearchNow = ko.observable(false);

    self.busy = ko.observable(false);

    self.data = ko.observableArray([]);

    self.orderDetail = ko.observable();

    self.orderImportDetail = ko.observable();

    self.tradeAccountSelector = new tradeAccountSelector()

    self.tradeAccount = self.tradeAccountSelector.selected;

    self.from = ko.observable().extend({

    });

    self.to = ko.observable().extend({

    });

    self.customerOrderReference = ko.observable().extend({
        rateLimit: {
            method: 'notifyWhenChangesStop',
            timeout: 300
        }
    });

    //#endregion


    //#region Components

    self.customerOrderReferenceParams = {
        label: 'Customer Order Reference',
        observable: self.customerOrderReference,
        charsRemainingOptions: {
            maxLength: 50
        },
        busy: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        clearFunction: () => {
            self.customerOrderReference(undefined);
        },
        revertable: ko.observable(false),
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true
    };

    self.fromParams = {
        label: 'From Date',
        observable: self.from,
        displayObservable: ko.observable(),
        dateTimePickerOptions: {
            localization: {
                locale: 'en-GB',
                format: 'ddd Do MMM yyyy'
            },
            display: {
                sideBySide: false,
                components: {
                    clock: false
                },
                //cellSize: '4rem'
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
                    self.to.tempusDominus.updateOptions({
                        restrictions: {
                            minDate: e.date,
                        },
                    });
                }
            }
        },
        clearable: ko.observable(true),
        clearFunction: () => {
            self.from(undefined);
        },
        revertable: ko.observable(false),
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true
    };

    self.toParams = {
        label: 'To Date',
        observable: self.to,
        displayObservable: ko.observable(),
        dateTimePickerOptions: {
            localization: {
                locale: 'en-GB',
                format: 'ddd Do MMM yyyy'
            },
            display: {
                sideBySide: false,
                components: {
                    clock: false
                },
                //cellSize: '4rem'
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
                    self.from.tempusDominus.updateOptions({
                        restrictions: {
                            maxDate: e.date,
                        },
                    });
                }
            }
        },
        clearable: ko.observable(true),
        clearFunction: () => {
            self.to(undefined);
        },
        revertable: ko.observable(false),
        useNativeValidation: false,
        insertValidationMessages: false,
        decorateInputElement: true
    };

    self.removeFiltersForField = (expression, field) => {
        if (expression.filters) {
            expression.filters = $.grep(expression.filters, function (filter) {
                self.removeFiltersForField(filter, field);
                if (filter.filters) {
                    return filter.filters.length;
                } else {
                    return filter.field != field;
                }
            });
        }
    }

    self.resultGridParams = {
        autoBind: true,
        widget: ko.observable(),
        columns: [{
            field: 'BasketID',
            title: 'Basket ID',
            filterable: {
                multi: false
            },
            hidden: true
        }, {
            field: 'CustomerOrderReference',
            title: 'Customer Order Reference',
            filterable: {
                extra: false
            }
        }, {
            field: 'Status',
            title: 'Status',
            width: 180,
            filterable: {
                extra: false
            }
        }, {
            field: 'OrderHeadID',
            title: 'Order Number',
            width: 120,
            filterable: {
                extra: false
            }
        }, {
            field: 'Owner',
            title: 'Owner',
            width: 180,
            filterable: {
                multi: false, // this is interesting - I could adapt the wossname to be an infinite scroll paging the dataSource? totally not necessary here
                dataSource: null // new kendo.data.DataSource
            }
        },{
            field: 'History',
            title: 'History',
            filterable: {
                extra: false
            }
        }, {
            field: 'TradeOrderImportFileID',
            title: 'Trade Order Import File ID',
            width: 90,
            filterable: {
                extra: false
            },
            hidden: true
        }, {
            field: 'OrderImportHeadID',
            title: 'Order Import Head ID',
            width: 90,
            filterable: {
                extra: false
            },
            hidden: true
        }, {
            field: 'BasketSplitName',
            title: 'Basket Split Name',
            filterable: {
                extra: false
            },
            width: 90,
            hidden: true
        }, {
            field: 'LineCount',
            title: 'Line Count',
            filterable: {
                extra: false
            },
            width: 90,
            hidden: true
        }, {
            field: 'CancelledLineCount',
            title: 'Cancelled Line Count',
            filterable: {
                extra: false
            },
            width: 90,
            hidden: true
        }, {
            field: 'LastModified',
            title: 'Last Modified',
            filterable: {
                extra: false
            },
            width: 90,
            hidden: true
        }, {
            field: 'Controls',
            title: ' ',
            width: 80,
            filterable: false
        }],
        data: self.data,
        dataSource: new kendo.data.DataSource({
            sortable: true,
            filterable: true,
            grouping: false,
            serverGrouping: false,
            serverFiltering: false,
            serverPaging: false,
            pageSize: 10,
            pageable: {
                pageSize: 10,
                pageSizes: [10, 20, 50, 100, 250, 500, 'all']
            },
            schema: $.extend({}, kendo.data.schemas.webapi, {
                data: "Data",
                total: "Total",
                errors: "Errors",
                aggregates: "Aggregates",
                model: {
                    id: 'BasketID',
                    fields: {
                        BasketID: { type: 'number' },
                        Owner: { type: 'string' },
                        CustomerOrderReference: { type: 'string' },
                        Status: { type: 'string' },
                        History: { type: 'string' },
                        OrderImportHeadID: { type: 'number' },
                        OrderHeadID: { type: 'number' },
                        BasketSplitName: { type: 'string' },
                        LineCount: { type: 'string' },
                        CancelledLineCount: { type: 'number' },
                        LastModified: { type: 'string' }
                    }
                }
            }),
            requestStart: (e) => {
                self.busy(true);
            },
            requestEnd: (e) => {
                self.busy(false);
            }
        }),
        useKOTemplates: true,
        rowTemplate: 'basket-status-row-template',
        scrollable: false,
        sortable: true,
        filterable: true,
        reorderable: false,
        paging: true,
        pageSize: 10,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        selectable: false,
        change: function (e) {
            //let dataItem = e.sender.dataItem(e.sender.select());
            //self.editBasket(dataItem);
        },
        dataBound: function (e) {

        },
        filterMenuInit: function (e) {

            var ds = [];
            var filterToggle = null;
            var operator = null;

            switch (e.field) {
                case 'Status':
                    ds = getMyHeldOrderImportStatuses();
                    operator = "contains";
                    filterToggle = self.customResultStatusFilterActive;
                    break;
                default: break;
            }

            if (filterToggle != null) {
                var popup = e.container.data("kendoPopup");
                var dataSource = this.dataSource;
                var field = e.field;
                var element = e.container.children(":first");

                var originalMultiCheck = e.container.children(":first");
                // helpTextElement.nextUntil(":has(.k-button)").remove();
                var element = $("<div class='custom-filter-checkbox-container'></div>").insertAfter(originalMultiCheck).kendoListView({
                    dataSource: ds,
                    template: "<label><input type='checkbox' value='#:" + field + "#'/>#:Name#</label>"
                });
                originalMultiCheck.remove();
                e.container.children('.k-filter-selected-items').remove();

                e.container.find("[type='submit']").click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var filter = dataSource.filter() || { logic: "and", filters: [] };
                    var fieldFilters = $.map(element.find('input[type="checkbox"]:checked'), function (input) {
                        return {
                            field: field,
                            operator: operator,
                            value: input.value
                        };
                    });
                    if (fieldFilters.length) {
                        self.removeFiltersForField(filter, field);
                        filter.filters.push({
                            logic: "or",
                            filters: fieldFilters
                        });
                        dataSource.filter(filter);
                        filterToggle(true);
                    }
                    popup.close();
                });

                e.container.find("[type='reset']").click(function (e) {
                    filterToggle(false);
                });
            }
        }
    };

    self.searchErrors = new ko.validation.group([
        self.customerOrderReference,
        self.from,
        self.to
    ]);

    //#endregion


    //#region Subscriptions

    self.from.subscribe(nv => {
        self.fetch();
    });

    self.to.subscribe(nv => {
        self.fetch();
    });

    self.customerOrderReference.subscribe(nv => {
        if (nv !== '') { // the forceNullOnEmpty binding causes this subscription to fire twice on clearing the input: once for '', once for null
            self.fetch();
        }
    });

    //#endregion


    //#region Computeds

    self.tradeAccountId = ko.computed(() => {
        self.data([]);
        
        if (self.tradeAccount())
            return self.tradeAccount().TradeAccountID;
        else
            return null;
    }, self);

    //#endregion


    //#region Methods

    self.ready = () => {
        self.busy(false);
    }

    self.fetch = () => {
        self.validateSearchNow(true);
        if (self.searchErrors().length) {
            self.searchErrors.filter(x => {
                x.isValid.notifySubscribers(x.isValid());
            });
        } else {
            self.busy(true);
            fetch('/api/BasketStatusAPI/FetchBasketStatuses', {
                method: 'POST',
                headers: window.fetchHeaders,
                cache: 'no-store',
                credentials: 'same-origin',
                body: self.toJSON()
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    self.validateSearchNow(false);
                    self.busy(false);
                    data = data.map(d => {
                        d.orderDetailPopover = ko.observable();
                        d.orderImportDetailPopover = ko.observable();
                        return d;
                    });
                    self.data(data);
                    console.log(data);
                })
                .catch(err => {
                    self.validateSearchNow(false);
                    self.busy(false);
                    window.catchFetchError(err);
                })
        }
    }

    self.popoverTemplate = function () {
        return `<div class="popover product-details-popover parcel-estimate-popover basket-status-order-detail-popover" role="tooltip">
            <div class="arrow"></div>
            <div class="modal-header grey-blue">
                <h4 class="modal-title popover-title"></h4>
            </div>
            <div class="popover-content"></div>
        </div>`
    }

    self.fetchOrderDetail = (dataItem) => {
        self.validateSearchNow(true);
        if (self.searchErrors().length) {
            self.searchErrors.filter(x => {
                x.isValid.notifySubscribers(x.isValid());
            });
        } else {
            self.busy(true);
            fetch('/api/BasketStatusAPI/OrderDetails', {
                method: 'POST',
                headers: window.fetchHeaders,
                cache: 'no-store',
                credentials: 'same-origin',
                body: JSON.stringify({
                    orderHeadId: dataItem.OrderHeadID
                })
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    self.busy(false);
                    console.log(data);
                    data.deliveryAddress = {
                        fullName: data.OrderHead.DeliveryName,
                        addressLine1: data.OrderHead.DeliveryAddressLine1,
                        addressLine2: data.OrderHead.DeliveryAddressLine2,
                        town: data.OrderHead.DeliveryTown,
                        county: data.OrderHead.DeliveryCounty,
                        postcode: data.OrderHead.DeliveryPostcode,
                        country: data.OrderHead.DeliveryCountryCode
                    }
                    dataItem.orderDetailPopover({
                        title: 'Order Details',
                        orderLinesGrid: {
                            data: data.OrderLines,
                            useKOTemplates: true,
                            rowTemplate: 'order-enquiry-order-line-row-template',
                            selectable: false,
                            scrollable: false,
                            columns: [{
                                field: 'LineNumber',
                                title: ' ',
                                width: 40
                            }, {
                                field: 'ImageID',
                                title: ' ',
                                width: 82
                            }, {
                                field: 'ProductCode',
                                title: 'Product',
                                width: 140
                            }, {
                                field: 'QuantityOrdered',
                                title: 'Quantity',
                                width: 140
                            }, {
                                field: 'LineValueCurrency',
                                title: 'Line Value',
                                width: 140
                            }, {
                                field: 'LineDiscountValueCurrency',
                                title: 'Line Discount',
                                width: 140
                            }, {
                                field: 'LineStatus',
                                title: 'Status',
                                width: 140
                            }, {
                                field: 'FormattingCulture',
                                title: ' ',
                                hidden: true
                            }, {
                                field: 'CurrencyCode',
                                title: ' ',
                                hidden: true
                            }]
                        },
                        data: data,
                        content: function () {
                            return `<div class="popover-details-wrapper" data-bind="with: data">
                                        <div class="grid-container">
                                            <div>
                                                <h4>Order</h4>
                                                <div class="sub-grid-container" data-bind="with: OrderHead">
                                                    <span>Order ID:</span>
                                                    <span data-bind="text: OrderID"></span>
                                                    <span>Date:</span>
                                                    <span data-bind="text: moment(OrderDT).format('dddd Do MMM YYYY HH:mm')"></span>
                                                    <span>Account:</span>
                                                    <span data-bind="html: TradeAccountCode + ' - ' + TradeAccountName"></span>
                                                    <span>Currency:</span>
                                                    <span data-bind="text: MertexCurrencyCode"></span>
                                                    <span>Order Reference:</span>
                                                    <span data-bind="text: CustomerOrderReference"></span>
                                                    <span>Order Taker:</span>
                                                    <span data-bind="text: OrderTaker"></span>
                                                </div>
                                            </div>
                                            <div>
                                                <h4>Delivery</h5>
                                                <div class="delivery-address-wrapper" data-bind="template: { name: 'popover-address-template', data: deliveryAddress }"></div>
                                                <div class="sub-grid-container" data-bind="with: OrderHead">
                                                    <span>Haulier Code:</span>
                                                    <span data-bind="text: HaulierCode"></span>
                                                    <span>Carriage Code:</span>
                                                    <span data-bind="text: CarriageCode"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div data-bind="kendoGrid: $parent.orderLinesGrid"></div>
                                    </div>`
                        },
                        placement: 'auto',
                        template: self.popoverTemplate()
                    });
                    window.setTimeout(() => {
                        $(dataItem.orderDetailPopover().popObject).popover('show');
                    }, 0);
                    self.orderDetail(dataItem);
                })
                .catch(err => {
                    self.validateSearchNow(false);
                    self.busy(false);
                    window.catchFetchError(err);
                })
        }
    }

    self.fetchImportDetail = (dataItem) => {
        if (dataItem.TradeOrderImportFileID) {
            self.busy(true);
            fetch('/api/BasketStatusAPI/ImportDetails', {
                method: 'POST',
                headers: window.fetchHeaders,
                cache: 'no-store',
                credentials: 'same-origin',
                body: JSON.stringify({
                    tradeOrderImportFileId: dataItem.TradeOrderImportFileID
                })
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    self.validateSearchNow(false);
                    self.busy(false);
                    dataItem.orderImportDetailPopover({
                        title: 'Order Import Details',
                        data: data,
                        content: function () {
                            return `<div class="popover-details-wrapper" data-bind="with: data">
                                        <div>
                                            <div class="order-import-grid-container" data-bind="with: FileInfo">
                                                <span>Import File ID:</span>
                                                <span data-bind="text: TradeOrderImportFileID"></span>
                                                <span>Date:</span>
                                                <span data-bind="text: moment(UploadedDT).format('dddd Do MMM YYYY HH:mm')"></span>
                                                <span>Account:</span>
                                                <span data-bind="html: TradeAccountCode + ' - ' + TradeAccountName"></span>
                                                <span>File Name:</span>
                                                <span data-bind="text: FileName"></span>
                                                <!-- ko if: ImportedByName -->
                                                <span>Imported by:</span>
                                                <span data-bind="text: ImportedByName"></span>
                                                <!-- /ko -->
                                                <!-- ko if: ImportedByEmail -->
                                                <span>Importer Email:</span
                                                <span>
                                                    <a data-bind="attr: { href: 'mailto:' + ImportedByEmail}, text: ImportedByEmail"></a>
                                                </span>
                                                <!-- /ko -->
                                            </div>
                                        </div>
                                        <button class="btn btn-default download-btn" type="button" data-bind="click: $parentContext.$parentContext.$parent.downloadFile">
                                            <span>
                                                Download
                                            </span>
                                            <i class="material-icons">
                                                download
                                            </i>
                                        </button>
                                    </div>`
                        },
                        placement: 'auto',
                        template: self.popoverTemplate()
                    });
                    window.setTimeout(() => {
                        $(dataItem.orderImportDetailPopover().popObject).popover('show');
                    }, 0);
                    self.orderImportDetail(data);
                    console.log(data);
                })
                .catch(err => {
                    self.validateSearchNow(false);
                    self.busy(false);
                    window.catchFetchError(err);
                })
        }
    }

    self.editBasket = (dataItem) => {
        if (dataItem.CanEditBasket) {
            self.busy(true);
            fetch('/api/ComponentAPI/RefreshTradeAccountVATNumbers', {
                method: 'POST',
                headers: window.fetchHeaders,
                cache: 'no-store',
                credentials: 'same-origin',
                body: JSON.stringify({
                    basketId: dataItem.BasketID
                })
                    .then(window.handleFetchResponse)
                    .then(data => {
                        dataItem.VATNumber = data.VATNumber;
                        dataItem.VATCountryCode = data.VATCountryCode;
                        dataItem.mertexVATLookupSuccessful = ko.observable(!data.Errored);
                        self.busy(false);

                        self.parent.orderFactory.loadBasket(dataItem, () => {
                            self.busy(false);
                        });
                    })
                    .catch(err => {
                        self.busy(false);
                        window.catchFetchError(err);
                    })
            })
        }
    }

    self.toJS = () => {
        return {
            tradeAccountId: ko.unwrap(self.tradeAccountId),
            customerReference: ko.unwrap(self.customerOrderReference),
            fromDt: ko.unwrap(self.from),
            toDt: ko.unwrap(self.to)
        };
    }

    self.toJSON = () => JSON.stringify(self.toJS());

    self.downloadFile = (dataItem) => {
        console.log(dataItem);

        let anchor = document.createElement('a');

        anchor.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataItem.FileInfo.Contents));
        anchor.setAttribute('download', dataItem.FileInfo.FileName);

        anchor.click();
    }

    //#endregion

    return self;
});