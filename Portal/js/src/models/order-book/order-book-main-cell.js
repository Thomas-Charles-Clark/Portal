

const orderBookMainCell = ({ parent, data, grouping, array } = {

}) => {

    //#region Properties

    let self = Object.assign({
        parent: parent,
        grouping: grouping,
        array: array,
        displayModes: parent.displayModes
    }, data);

    //#endregion


    //#region Components



    //#endregion


    //#region Computeds

    self.display = ko.computed(() => {

        let displayModes = self.displayModes();

        let result = [];

        if (displayModes.indexOf(DISPLAY_MODE_VALUE_SUM) > -1) {
            result.push(`<span class="order-value" title="Order Value: ${self.OrderValue}">${self.OrderValue}</span>`);
        }

        if (displayModes.indexOf(DISPLAY_MODE_QUANTITY_SUM) > -1) {
            result.push(`<span class="order-quantity" title="Order Quantity: ${self.OrderQuantity}">${self.OrderQuantity}</span>`);
        }

        if (displayModes.indexOf(DISPLAY_MODE_LINE_COUNT) > -1) {
            result.push(`<span class="line-count" title="Line Count: ${self.LineCount}">${self.LineCount}</span>`);
        }

        if (displayModes.indexOf(DISPLAY_MODE_ORDER_COUNT) > -1) {
            result.push(`<span class="order-count" title="Order Count: ${self.OrderCount}">${self.OrderCount}</span>`);
        }

        if (displayModes.indexOf(DISPLAY_MODE_PERCENTAGE_FULL) > -1) {
            result.push(`<span class="percentage-of-full" title="Percentage of Full Order Book: ${self.PercentageOfFullOrderBook}">${self.PercentageOfFullOrderBook}</span>`);
        }

        if (displayModes.indexOf(DISPLAY_MODE_PERCENTAGE_FILTER) > -1) {
            result.push(`<span class="percentage-of-filtered" title="Percentage of Filtered Order Book: ${self.PercentageOfFilteredOrderBook}">${self.PercentageOfFilteredOrderBook}</span>`);
        }

        return result.join('\n');
    }, self);

    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Validation Groups



    //#endregion


    //#region Functions


    self.showProductDetailModal = () => {

        (async () => {
            let data = {
                productId: self.ProductID,
                productCode: self.Array_ProductCode,
                tradeAccountId: null
            }
            self.parent.stockCheckRequester.busy(true);

            await self.parent.fetchProductCodeModalContents(data)
                .then(data => {
                    let am = data.availabilityMessages.length ? data.availabilityMessages[0] : {};

                    self.parent.productDetail(Object.assign(data, {
                        busy: ko.observable(false),
                        supplierAvailabilityMessage: ko.observable(am.SupplierAvailabilityMessage),
                        showStockCheckRequester: ko.observable(am.ExecuteStockCheckRequest),
                        record: {
                            ImageID: null
                        },
                        stockStatus: ko.observable(),
                        backOrder: ko.observable(false),
                        stockInfo: ko.observable(self.parent.stockCheckRequester.processStockEnquiryResults([{
                            productId: self.ProductID,
                            units: self.Units
                        }], data)),
                        availabilityMessage: am,
                        productFilterOptions: () => {
                            return {
                                QuantityPrecision: 1,
                                Units: self.Units
                            }
                        },
                        showThumb: false
                    }));

                    self.parent.stockCheckRequester.busy(false);
                });
        })();

        document.querySelector('#product-detail-modal') &&
        bootstrap.Modal.getOrCreateInstance(document.querySelector('#product-detail-modal')).show();
    };

    self.buildGroup = (groupName) => {

        self[`${groupName}_popoverContent`] = `<div class="blocker" style="display: flex; opacity: 1.0" data-bind="flexFadeVisible: busy, click: (data, event) => { event.preventDefault(); }">
            <div class="loading-spinner"></div>
            <h4 class="mt-3">
                Please wait...
            </h4>
        </div>
        <h4 class="popover-title" style="display: none;" data-bind="fadeVisible: !busy()">
            <span data-bind="html: title"></span>
            <button class="btn-close btn-close-white" data-bind="click: (data, event) => { data.popover.hide(); }"></button>
        </h4>
        <div class="table-container" style="display: none;" data-bind="fadeVisible: !busy()">
            <!-- ko if: contentData() && contentData().hasOwnProperty('Totals') -->
            <div class="d-inline-flex gap-5 mb-3 justify-content-start align-items-center">
                <table class="totals-table table table-bordered table-condensed mb-0" data-bind="with: contentData">
                    <colgroup>
                        <col />
                        <!-- ko foreach: Object.keys(Totals) -->
                        <col />
                        <!-- /ko -->
                    </colgroup>
                    <thead>
                        <tr>
                            <th></th>
                            <!-- ko foreach: Object.keys(Totals) -->
                            <th data-bind="attr: { title: $data.replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, '$1$4 $2$3$5') }">
                                <span data-bind="text: $data.replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, '$1$4 $2$3$5');"></span>
                            </th>
                            <!-- /ko -->
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="subtotal-row">
                        <th>
                        Totals
                        </th>
                        <!-- ko foreach: Object.keys(Totals) -->
                        <td>
                            <span data-bind="text: ($parent.Totals)[$data]"></span>
                        </td>
                        <!-- /ko -->
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- ko if: contentData() && contentData().Data.length -->
            <div class="horizontal-scrolling-table-container">
                <table class="lines-table table table-bordered table-condensed" data-bind="with: contentData">
                    <colgroup>
                        <!-- ko foreach: Object.keys(Data[0]) -->
                        <col />
                        <!-- /ko -->
                    </colgroup>
                    <thead>
                        <tr>
                            <!-- ko foreach: Object.keys(Data[0]) -->
                            <th data-bind="attr: { title: $data.replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, '$1$4 $2$3$5') }">
                                <span data-bind="text: $data.replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, '$1$4 $2$3$5');"></span>
                            </th>
                            <!-- /ko -->
                        </tr>
                    </thead>
                    <tbody>
                        <!-- ko foreach: Data -->
                        <tr>
                            <!-- ko foreach: Object.keys($data) -->
                            <td  data-bind="attr: { title: $parent[$data] }">
                                <span data-bind="text: $parent[$data]"></span>
                            </td>
                            <!-- /ko -->
                        </tr>
                        <!-- /ko -->
                    </tbody>
                </table>
            </div>
            <!-- /ko -->
            <!-- /ko -->
            <!-- ko if: contentData() && contentData().hasOwnProperty('ringFences') && contentData().ringFences.Data.length -->
            <div class="d-inline-flex gap-5 mb-3 justify-content-start align-items-center mt-5">
                <table class="totals-table table table-bordered table-condensed mb-0" data-bind="with: contentData().ringFences">
                    <colgroup>
                        <col />
                        <!-- ko foreach: Object.keys(Totals) -->
                        <col />
                        <!-- /ko -->
                    </colgroup>
                    <thead>
                        <tr>
                            <th></th>
                            <!-- ko foreach: Object.keys(Totals) -->
                            <th data-bind="attr: { title: $data.replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, '$1$4 $2$3$5') }">
                                <span data-bind="text: $data.replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, '$1$4 $2$3$5');"></span>
                            </th>
                            <!-- /ko -->
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="subtotal-row">
                        <th>
                        Totals
                        </th>
                        <!-- ko foreach: Object.keys(Totals) -->
                        <td>
                            <span data-bind="text: $parent.Totals[$data]"></span>
                        </td>
                        <!-- /ko -->
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="horizontal-scrolling-table-container">
                <table class="lines-table table table-bordered table-condensed" data-bind="with: contentData">
                    <colgroup>
                        <!-- ko foreach: Object.keys(Data[0]) -->
                        <col />
                        <!-- /ko -->
                    </colgroup>
                    <thead>
                        <tr>
                            <!-- ko foreach: Object.keys(Data[0]) -->
                            <th data-bind="attr: { title: $data.replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, '$1$4 $2$3$5') }">
                                <span data-bind="text: $data.replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, '$1$4 $2$3$5');"></span>
                            </th>
                            <!-- /ko -->
                        </tr>
                    </thead>
                    <tbody>
                        <!-- ko foreach: Data -->
                        <tr>
                            <!-- ko foreach: Object.keys($data) -->
                            <td  data-bind="attr: { title: $parent[$data] }">
                                <span data-bind="text: $parent[$data]"></span>
                            </td>
                            <!-- /ko -->
                        </tr>
                        <!-- /ko -->
                    </tbody>
                </table>
            </div>
            <!-- /ko -->
        </div>`

        self[`${groupName}_Display`] = ko.computed(() => {
            let orderValuePropertyName = `${groupName}OrderValue`;
            let orderQuantityPropertyName = `${groupName}OrderQuantity`;
            let lineCountPropertyName = `${groupName}LineCount`;
            let orderCountPropertyName = `${groupName}OrderCount`;
            //let percentageFullPropertyName = `${groupName}_PercentageOfFullOrderBook`;
            //let percentageFilteredPropertyName = `${groupName}_PercentageOfFilteredOrderBook`;

            let displayModes = self.parent.displayModes();

            let result = [];

            if (self[orderValuePropertyName] === undefined &&
                self[orderQuantityPropertyName] === undefined &&
                self[lineCountPropertyName] === undefined &&
                self[orderCountPropertyName] === undefined// &&
                //self[percentageFullPropertyName] === undefined &&
                //self[percentageFilteredPropertyName] === undefined
            ) {
                if (groupName.indexOf('Array') == 0) {

                    if (!Array.isArray(self[groupName])) {
                        try {
                            self[groupName] = JSON.parse(self[groupName]);
                            return `<span title="${groupName}: ${self[groupName]}">${self[groupName][0]}</span>`
                        } catch {
                            // ah well
                            return `<span title="${groupName}: ${self[groupName]}">${self[groupName]}</span>`
                        }
                    }

                } else {
                    if (self[groupName] != null) {
                        return `<span title="${groupName}: ${self[groupName]}">${self[groupName]}</span>`
                    } else {
                        return '';
                    }
                }
            }

            if (displayModes.indexOf(DISPLAY_MODE_VALUE_SUM) > -1 && self[orderValuePropertyName] != null) {
                result.push(`<span class="order-value" title="Order Value: ${formatCurrency(self[orderValuePropertyName], 2, 'en-GB', 'GBP') }">${formatCurrency(self[orderValuePropertyName], 2, 'en-GB', 'GBP')}</span>`);
            }

            if (displayModes.indexOf(DISPLAY_MODE_QUANTITY_SUM) > -1 && self[orderQuantityPropertyName] != null) {
                result.push(`<span class="order-quantity"  title="Order Quantity: ${formatNumber(self[orderQuantityPropertyName], 2) }">${formatNumber(self[orderQuantityPropertyName], 2)}</span>`);
            }

            if (displayModes.indexOf(DISPLAY_MODE_LINE_COUNT) > -1 && self[lineCountPropertyName] != null) {
                result.push(`<span class="line-count" title="Line Count: ${formatNumber(self[lineCountPropertyName], 0) }">${formatNumber(self[lineCountPropertyName], 0)}</span>`);
            }

            if (displayModes.indexOf(DISPLAY_MODE_ORDER_COUNT) > -1 && self[orderCountPropertyName] != null) {
                result.push(`<span class="order-count" title="Order Count: ${formatNumber(self[orderCountPropertyName], 0)}">${formatNumber(self[orderCountPropertyName], 0)}</span>`);
            }

            //if (displayModes.indexOf(DISPLAY_MODE_PERCENTAGE_FULL) > -1) {
            //    result.push(`<span class="percentage-of-full" title="Percentage of Full Order Book: ${self[percentageFullPropertyName]}">${self[percentageFullPropertyName]}</span>`);
            //}

            //if (displayModes.indexOf(DISPLAY_MODE_PERCENTAGE_FILTER) > -1) {
            //    result.push(`<span class="percentage-of-filtered" title = "Percentage of Filtered Order Book: ${self[percentageFilteredPropertyName]}" > ${self[percentageFilteredPropertyName]}</span>`);
            //}

            return result.join('\n');
        }, self);

        if (groupName.indexOf('Array_') == 0) {
            self[`${groupName}_popoverContent`] = `<div class="blocker" style="display: flex; opacity: 1.0" data-bind="flexFadeVisible: busy, click: (data, event) => { event.preventDefault(); }">
                <h4 class="mt-3">
                    Please wait...
                </h4>
            </div>
            <h4 class="popover-title" style="display: none;" data-bind="fadeVisible: !busy()">
                <span data-bind="html: title"></span>
                <button class="btn-close btn-close-white" data-bind="click: (data, event) => { data.popover.hide(); }"></button>
            </h4>
            <div class="info-container" style="display: none;" data-bind="fadeVisible: !busy()">
                <!-- ko foreach: contentData -->
                <!-- ko if: $data -->
                <div class="card info-card">
                    <div class="card-body">
                        <div data-bind="html: $data"></div>
                    </div>
                </div>
                <!-- /ko -->
                <!-- /ko -->
            </div>`;

            if (groupName == "Array_ProductCode") {
                self[`${groupName}_popoverContent`] = document.querySelector('#product-code-info-popover-template').innerHTML
            }
        }

        if (groupName == "Array_ProductCode") {

            //ko.bindingHandlers.bootstrapModal = {
            //    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            //        var params = ko.utils.unwrapObservable(valueAccessor());

            //        var options = params.details;

            //        if (!options.modalElementId)
            //            console.error('boostrapModal demands options.modalElementId');

            //        var props = {
            //            element: element,
            //            modalElement: document.querySelector(options.modalElementId),
            //            modal: bootstrap.Modal.getOrCreateInstance(options.modalElementId, {
            //                backdrop: true,
            //                focus: true,
            //                keyboard: true
            //            }),
            //            model: options.model,
            //            customClass: options.customClass,
            //            content: options.content || `<div class="blocker" style="display: flex; opacity: 1">
            //            <div class="loading-spinner"></div>
            //            <h4 class="mt-3">
            //                Please wait...
            //            </h4>
            //        </div>`,
            //        };

            //        params.details = props;

            //        props.modalElement.addEventListener('show.bs.modal', () => {

            //            ko.cleanNode(props.modalElement);

            //            ko.applyBindings(props.model, props.modalElement);

            //            options.show && options.show();
            //        });

            //        props.modalElement.addEventListener('shown.bs.modal', options.shown);
            //        props.modalElement.addEventListener('hide.bs.modal', options.hide);
            //        props.modalElement.addEventListener('hidden.bs.modal', options.hidden);
            //    }
            //}

            self[`${groupName}_ModalDetails`] = {};
            self[`${groupName}_Display`] = self[groupName];


        } else {
            self[`${groupName}_PopoverDetails`] = {
                html: true,
                sanitize: false,
                busy: ko.observable(true),
                title: groupName.replace('Array', '').replace('Grouped', '').replace(/_/g, '').replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, '$1$4 $2$3$5'),
                contentData: ko.observable(),
                element: ko.observable(),
                container: 'div.relative',
                placement: 'bottom',
                fallbackPlacements: ['top'],
                customClass: groupName == 'Array_ProductCode' ? 'info-cell-popover' : 'group-cell-popover', // (groupName.indexOf('Array_') == -1) ? 
                content: self[`${groupName}_popoverContent`],
                trigger: 'click',
                //container: 'td',
                show: (event, data) => {

                    let popoverCells = [...document.querySelectorAll('.popover-cell')];

                    popoverCells.forEach((c, i) => {
                        c._zIndexOriginal = +c.style.zIndex;
                    });

                    popoverCells.forEach((c, i) => {
                        c.style.zIndex = `${popoverCells.length - i}`;
                    });

                    self.parent.virtualScroller.maxY.valueHasMutated();
                },
                shown: null,
                hide: (event, data) => {

                    let popoverCells = [...document.querySelectorAll('.popover-cell')];

                    popoverCells.forEach((c, i) => {
                        c.style.zIndex = `${c._zIndexOriginal}`;
                    });

                    self.parent.virtualScroller.maxY.valueHasMutated();
                },
                hidden: null,
                inserted: async function (event) {
                    let mainCell = ko.contextFor(event.target).$parent;
                    let data = {

                    }
                    let fn = null;

                    if (groupName.indexOf('Array_') == 0) {
                        data = self[groupName];
                        fn = (data) => {
                            return new Promise((resolve, reject) => {
                                resolve(data);
                            });
                        }
                    } else if (groupName.indexOf('Total_') > -1) {

                        if (mainCell[`${groupName}OrderLineIDs`]) {
                            data.OrderLineIDs = mainCell[`${groupName}OrderLineIDs`];
                        }

                        if (mainCell[`RingFenced_OrderLineIDs`]) {
                            data.RingFenceIDs = mainCell[`RingFenced_OrderLineIDs`];
                        }

                        fn = self.parent.fetchTotalPopoverContents;

                    } else if (groupName.indexOf("Ring") == -1) {
                        data = { OrderLineIDs: mainCell[`${groupName}OrderLineIDs`] }
                        fn = self.parent.fetchOrderLinePopoverContents;
                    } else {
                        data = { RingFenceIDs: mainCell[`${groupName}OrderLineIDs`] }
                        fn = self.parent.fetchRingFencePopoverContents;
                    }
                    await fn(data)
                        .then(data => {
                            let popEl = self[`${groupName}_PopoverDetails`].popover.tip;
                            if (popEl) {
                                ko.cleanNode(popEl);
                                let vm = self[`${groupName}_PopoverDetails`];
                                ko.applyBindings(vm, popEl);

                                let dat = ko.dataFor(popEl);

                                dat.contentData(data);
                                dat.busy(false);
                            }
                        });
                },
                popperConfig: (defaultBsPopperConfig) => defaultBsPopperConfig
            };
        }
    }

    //self.fetchPopover = (columnName, data) => {
    //    if (columnName == "Total") {
    //        if (data[`${columnName}_OrderLineIDs`])
    //            self.parent.fetchOrderLinePopoverContents(data[`${columnName}_OrderLineIDs`]);
    //        if (data[`${columnName}_RingFenceIDs`])
    //            self.parent.fetchRingFencePopoverContents(data[`${columnName}_RingFenceIDs`]);
    //    } else if (columnName.indexOf('RingFence') == -1) {
    //        if (data[`${columnName}_OrderLineIDs`])
    //            self.parent.fetchOrderLinePopoverContents(data[`${columnName}_OrderLineIDs`]);
    //    } else if (columnName.indexOf('RingFence') > -1) {
    //        if (data[`${columnName}_RingFenceIDs`])
    //            self.parent.fetchRingFencePopoverContents(data[`${columnName}_RingFenceIDs`]);
    //    } else if (columnName == 'Array_ProductCode') {
    //        self.parent.fetchProductCodePopoverContents(data[`Array_${columnName}`]);
    //    }
    //}

    //#endregion


    //#region Events

    if (self.grouping) {

        self.columnNameGroupingRegex = /^(Grouped_|Array_)[^_]+_?/gm;

        let columnNames = Object.keys(self).filter(k => {
            return ["parent",
                "display",
                "buildGroup",
                "columnNameGroupingRegex",
                "grouping",
                "offsetY",
                "originalOffsetY",
                "runningHeight",
                "_OrderValue",
                "_OrderQuantity",
                "_OrderLineIDs"].indexOf(k) == -1;
        });

        let groups = Object.groupBy(columnNames, cn => {
            let match = cn.match(self.columnNameGroupingRegex);
            if (match != null) {
                return match[0];
            } else {
                return cn;
            }
        });

        groupedColumns = Object.keys(groups).map(g => {
            return {
                groupedColumnName: g,
                columns: groups[g]
            }
        });

        groupedColumns.forEach(gc => {
            self.buildGroup(gc.groupedColumnName);
        });
    }

    //#endregion

    return self;
};

