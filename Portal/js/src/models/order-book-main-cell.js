

const orderBookMainCell = ({ parent, data, grouping } = {

}) => {

    //#region Properties

    let self = Object.assign({
        parent: parent,
        grouping: grouping
    }, data);

    //#endregion


    //#region Components



    //#endregion


    //#region Computeds

    self.display = ko.computed(() => {

        let displayModes = self.parent.displayModes();

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

    self.buildGroup = (groupName) => {
        self[`${groupName}_Display`] = ko.computed(() => {
            let orderValuePropertyName = `${groupName}_OrderValue`;
            let orderQuantityPropertyName = `${groupName}_OrderQuantity`;
            let lineCountPropertyName = `${groupName}_LineCount`;
            let orderCountPropertyName = `${groupName}_OrderCount`;
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
                return `<span title="${groupName}: ${self[groupName]}">${self[groupName]}</span>`
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

            return result.join('<br/>');
        }, self);

        self[`${groupName}_PopoverDetails`] = {
            html: true,
            sanitize: false,
            busy: ko.observable(true),
            data: ko.observable(),
            element: ko.observable(),
            container: 'div.relative',
            placement: 'bottom',
            fallbackPlacements: ['top'],
            customClass: 'group-cell-popover',
            content: self.popoverContent,
            trigger: 'click',
            //container: 'td',
            show: null,
            shown: null,
            hide: null,
            hidden: null,
            inserted: async function (event) {
                let mainCell = ko.contextFor(event.target).$parent;
                let data = {

                }
                let fn = null;
                if (groupName.indexOf("Ring") == -1) {
                    data = { OrderLineIDs: mainCell[`${groupName}_OrderLineIDs`] }
                    fn = self.parent.fetchOrderLinePopoverContents;
                } else {
                    data = { RingFenceIDs: mainCell[`${groupName}_OrderLineIDs`] }
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

                            dat.data(data);
                            dat.busy(false);
                        }
                    });
            },
            popperConfig: function (defaultBsPopperConfig) {
                return defaultBsPopperConfig;
            }
        };
    }

    self.popoverContent = `<div class="blocker" style="display: flex; opacity: 1.0" data-bind="flexFadeVisible: busy, click: (data, event) => { event.preventDefault(); }">
            <div class="loading-spinner"></div>
            <h4 class="mt-3">
                Please wait...
            </h4>
        </div>
        <div class="table-container" style="display: none;" data-bind="fadeVisible: !busy()">
            <div class="d-inline-flex gap-5 mb-3 justify-content-center align-items-center">
                <table class="totals-table table table-bordered table-condensed mb-0" data-bind="with: data">
                    <colgroup>
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
            <table class="lines-table table table-bordered table-condensed" data-bind="with: data">
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
        </div>`

    //self.bootstrapPopoverParams = {
    //    title: 'Order Line Details',
    //    content: (e, data) => {
    //        self.fetchPopover(self.grouping.groupedColumnName, [`${columnName}_OrderLineIDs`]);

    //        return '<h3>POTATO!</h3>';
    //    },
    //    placement: 'auto',
    //    trigger: 'click',
    //    template: `<div class="popover product-details-popover" role="tooltip">
    //            <div class="arrow"></div>
    //            <div class="modal-header grey-blue">
    //                <button class="close pull-right" data-bind="click: function () { $(popObject).popover('hide'); }">
    //                    <span aria-hidden="true">&times;</span>
    //                </button>
    //                <h4 class="modal-title popover-title"></h4>
    //            </div>
    //            <div class="blocker" data-bind="flexFadeVisible: true"></div>
    //            <div class="popover-content"></div>
    //        </div>`
    //}

    self.fetchPopover = (columnName, data) => {
        if (columnName.indexOf('RingFence') == -1) {
            self.parent.fetchOrderLinePopoverContents(data[`${columnName}_OrderLineIDs`]);
        } else {
            self.parent.fetchRingFencePopoverContents(data[`${columnName}_RingFenceIDs`]);
        }
    }

    //#endregion


    //#region Events

    if (self.grouping) {

        self.columnNameGroupingRegex = /^(\w*_)?/gm;

        let columnNames = Object.keys(self).filter(k => {
            return ["parent",
                "display",
                "buildGroup",
                "columnNameGroupingRegex",
                "grouping",
                "offsetY",
                "originalOffsetY",
                "runningHeight"].indexOf(k) == -1;
        });

        let groups = Object.groupBy(columnNames, cn => {
            let match = cn.match(self.columnNameGroupingRegex);
            if (match != '') {
                return match[0].replace('_', '');
            } else {
                return cn;
            }
        });

        groupedColumns = Object.keys(groups).map(g => {
            return {
                groupedColumnName: g, columns: groups[g]
            }
        });

        groupedColumns.forEach(gc => {
            self.buildGroup(gc.groupedColumnName);
        });
    }


    //#endregion

    return self;
};

