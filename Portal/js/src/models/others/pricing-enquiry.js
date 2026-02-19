var pricingEnquiryViewModel = function () {
    var self = this;

    self.tradeAccountSelector = ko.observable(new tradeAccountSelector());

    self.tradeAccountSelector().selected.subscribe(function (newValue) {
        console.log(newValue);
        if (newValue) {
            self.priceChecker().selectedMarketId(newValue.MarketID);
            self.priceChecker().selectedTradePriceListId(newValue.TradePriceListID);
            self.priceChecker().selectedCurrencyId(newValue.CurrencyID);
            $("#market-collapse").collapse('hide');
        } else {
            self.priceChecker().selectedMarketId(undefined);
            self.priceChecker().selectedTradePriceListId(undefined);
            self.priceChecker().selectedCurrencyId(undefined);
            self.priceChecker().currentQuery('ListPrices');
        }
    });

    self.priceChecker = ko.observable(new priceChecker(self.tradeAccountSelector().selected));

    self.loadBusy = ko.observable(false);

    // ahem... why does the priceChecker not do this to itself when instantiating...?
    if (self.tradeAccountSelector().selected()) {
        //console.log(self.tradeAccountSelector().selected());
        //self.priceChecker().selectedMarketId(self.tradeAccountSelector().selected().MarketID);
        //self.priceChecker().selectedTradePriceListId(self.tradeAccountSelector().selected().TradePriceListID);
        //self.priceChecker().selectedCurrencyId(self.tradeAccountSelector().selected().CurrencyID);
        $("#market-collapse").collapse('hide');
    }
}