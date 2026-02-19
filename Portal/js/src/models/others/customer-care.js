var customerCareViewModel = function () {
    var self = this;

    self.tradeAccountSelector = ko.observable(new tradeAccountSelector());

    self.careSearch = ko.observable(new careSearch());

    if (self.tradeAccountSelector().selected()) {
        self.careSearch().selectedTradeAccountGroupId(self.tradeAccountSelector().selected().TradeAccountGroupID);
        self.careSearch().selectedTradeAccountId(self.tradeAccountSelector().selected().TradeAccountID);
        self.careSearch().performSearch();
    }

    self.tradeAccountSelector().selected.subscribe(function (newValue) {
        console.log('tradeAccountSelector subscribe hit')
        if (newValue != null) {
            self.careSearch().selectedTradeAccountGroupId(self.tradeAccountSelector().selected().TradeAccountGroupID);
            self.careSearch().selectedTradeAccountId(self.tradeAccountSelector().selected().TradeAccountID);
            self.careSearch().clearResults();
            self.careSearch().performSearch();
        } else {
            self.careSearch().selectedTradeAccountGroupId(null);
            self.careSearch().selectedTradeAccountId(null);
            self.careSearch().clearResults();
            self.careSearch().performSearch();
        }
    });

    self.loadBusy = ko.observable(false);
}