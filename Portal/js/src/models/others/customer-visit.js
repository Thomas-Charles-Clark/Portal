var customerVisitViewModel = function () {
    var self = this;

    self.tradeAccountSelector = ko.observable(new tradeAccountSelector());
    self.visitSearch = ko.observable(new visitSearch(self));
    self.visitBooker = ko.observable(new visitBooker(self.tradeAccountSelector().selected, self));

    self.busy = ko.observable(false);

    self.tradeAccountSelector().selected.subscribe(function (newValue) {
        if (newValue == null) {
            self.visitSearch().selectedTradeAccountId(undefined);
            self.visitSearch().clearResults();
        }
        else {
            self.visitSearch().clearResults();
            self.visitSearch().selectedTradeAccountId(newValue.TradeAccountID);
            self.visitSearch().performSearch();
        }
    });

    if (self.tradeAccountSelector().selected()) {
        self.visitSearch().selectedTradeAccountId(self.tradeAccountSelector().selected().TradeAccountID);
        //self.visitSearch().performSearch();
    }
}