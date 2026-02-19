var tradeOrderEnquiryViewModel = function () {
    var self = this;

    self.tradeAccountSelector = ko.observable(new tradeAccountSelector());
    self.orderSearch = ko.observable(new orderSearch());

    self.tradeAccountSelector().selected.subscribe(function (newValue) {
        if (newValue) {
            window.setTimeout(function () {
                $("#order-search").focus();
            }, 0);
            self.orderSearch().clearResults();
        }

        self.orderSearch().selectedTradeAccountId(newValue.TradeAccountID);
    });

    if (self.tradeAccountSelector().selected()) {
        self.orderSearch().selectedTradeAccountId(self.tradeAccountSelector().selected().TradeAccountID);
    }
}