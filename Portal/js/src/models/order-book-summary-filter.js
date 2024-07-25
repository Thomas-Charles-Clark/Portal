

const orderBookSummaryFilter = ({ parent, data } = {

}) => {

    //#region Properties

    let self = Object.assign({
        parent: parent
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
            result.push(`<span title="No. of Lines: ${self.LineCount}">${self.LineCount}</span>`);
        }

        if (displayModes.indexOf(DISPLAY_MODE_ORDER_COUNT) > -1) {
            result.push(`<span title="No. of Orders: ${self.OrderCount}">${self.OrderCount}</span>`);
        }

        if (displayModes.indexOf(DISPLAY_MODE_PERCENTAGE_FULL) > -1) {
            result.push(`<span title="% of Full Order Book: ${self.PercentageOfFullOrderBook}">${self.PercentageOfFullOrderBook}</span>`);
        }

        if (displayModes.indexOf(DISPLAY_MODE_PERCENTAGE_FILTER) > -1) {
            result.push(`<span title="% of Filtered Order Book: ${self.PercentageOfFilteredOrderBook}">${self.PercentageOfFilteredOrderBook}</span>`);
        }

        return result.join('\n');
    }, self);

    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Validation Groups



    //#endregion


    //#region Functions



    //#endregion


    //#region Events



    //#endregion

    return self;
};

