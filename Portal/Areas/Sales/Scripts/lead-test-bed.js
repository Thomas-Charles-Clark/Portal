var testBedViewModel = function () {
    var self = this;

    self.getWindowWidth = function () {
        var windowWidth = 0;
        if (typeof (window.innerWidth) == 'number') {
            windowWidth = window.innerWidth;
        } else {
            if (document.documentElement && document.documentElement.clientWidth) {
                windowWidth = document.documentElement.clientWidth;
            } else {
                if (document.body && document.body.clientWidth) {
                    windowHeight = document.body.clientWidth;
                }
            }
        }
        return windowWidth;
    }

    self.widthWatch = ko.observable(self.getWindowWidth());

    window.addEventListener('resize', function () {
        self.widthWatch(self.getWindowWidth());
    });

    self.tradeAccountSelector = new tradeAccountSelector();

    self.tradeAccount = self.tradeAccountSelector.selected;

    self.stockViewer = new orderProductsDrilldownViewModel(self);

    self.orderFactory = new orderProductsViewModel(self);

    self.memberBasketFetcher = new memberBasketFetcher(self);
}