

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
            result.push(`<span title="Order Value: ${self.OrderValue}">${self.OrderValue}</span>`);
        }

        if (displayModes.indexOf(DISPLAY_MODE_QUANTITY_SUM) > -1) {
            result.push(`<span title="Order Quantity: ${self.OrderQuantity}">${self.OrderQuantity}</span>`);
        }

        if (displayModes.indexOf(DISPLAY_MODE_LINE_COUNT) > -1) {
            result.push(`<span title="Line Count: ${self.LineCount}">${self.LineCount}</span>`);
        }

        if (displayModes.indexOf(DISPLAY_MODE_ORDER_COUNT) > -1) {
            result.push(`<span title="Order Count: ${self.OrderCount}">${self.OrderCount}</span>`);
        }

        if (displayModes.indexOf(DISPLAY_MODE_PERCENTAGE_FULL) > -1) {
            result.push(`<span title="Percentage of Full Order Book: ${self.PercentageOfFullOrderBook}">${self.PercentageOfFullOrderBook}</span>`);
        }

        if (displayModes.indexOf(DISPLAY_MODE_PERCENTAGE_FILTER) > -1) {
            result.push(`<span title="Percentage of Filtered Order Book: ${self.PercentageOfFilteredOrderBook}">${self.PercentageOfFilteredOrderBook}</span>`);
        }

        return result.join('\n');
    }, self);

    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Validation Groups



    //#endregion


    //#region Functions

    self.buildGroupDisplay = (groupName) => {
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
                result.push(`<span title="Order Value: ${self[orderValuePropertyName]}">${self[orderValuePropertyName]}</span>`);
            }

            if (displayModes.indexOf(DISPLAY_MODE_QUANTITY_SUM) > -1 && self[orderQuantityPropertyName] != null) {
                result.push(`<span title="Order Quantity: ${self[orderQuantityPropertyName]}">${self[orderQuantityPropertyName]}</span>`);
            }

            if (displayModes.indexOf(DISPLAY_MODE_LINE_COUNT) > -1 && self[lineCountPropertyName] != null) {
                result.push(`<span title="Line Count: ${self[lineCountPropertyName]}">${self[lineCountPropertyName]}</span>`);
            }

            if (displayModes.indexOf(DISPLAY_MODE_ORDER_COUNT) > -1 && self[orderCountPropertyName] != null) {
                result.push(`<span title="Order Count: ${self[orderCountPropertyName]}">${self[orderCountPropertyName]}</span>`);
            }

            //if (displayModes.indexOf(DISPLAY_MODE_PERCENTAGE_FULL) > -1) {
            //    result.push(`<span title="Percentage of Full Order Book: ${self[percentageFullPropertyName]}">${self[percentageFullPropertyName]}</span>`);
            //}

            //if (displayModes.indexOf(DISPLAY_MODE_PERCENTAGE_FILTER) > -1) {
            //    result.push(`< span title = "Percentage of Filtered Order Book: ${self[percentageFilteredPropertyName]}" > ${self[percentageFilteredPropertyName]}</span>`);
            //}

            return result.join('\n');
        }, self);
    }

    self.popoverDetails = {
        html: true,
        content: `<div class="blocker" style="display: flex; opacity: 1">
                        <div class="loading-spinner"></div>
                        <h4 class="mt-3">
                            Please wait...
                        </h4>
                    </div>`,
        trigger: 'click focus',
        container: 'td',
        show: null,
        shown: null,
        hide: null,
        hidden: null,
        inserted: async(event) => {
            await self.parent.fetchOrderLinePopoverContents(self.BackOrder_OrderLineIDs)
            .then(data => {
                self.popoverDetails.popover._config.contents = 'Potato!';
            });
        }
    };

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
            self.parent.fetchRingFencedPopoverContents(data[`${columnName}_OrderLineIDs`]);
        }
    }

    //#endregion


    //#region Events

    if (self.grouping) {

        self.columnNameGroupingRegex = /^(\w*_)?/gm;

        let columnNames = Object.keys(self).filter(k => {
            return ["parent",
                "display",
                "buildGroupDisplay",
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
            self.buildGroupDisplay(gc.groupedColumnName);
        });
    }


    //#endregion

    return self;
};

