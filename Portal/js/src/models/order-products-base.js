
var orderProductsBaseViewModel = function () {
    var self = this;

    //self.getWindowWidth = function () {
    //    var windowWidth = 0;
    //    if (typeof (window.innerWidth) == 'number') {
    //        windowWidth = window.innerWidth;
    //    } else {
    //        if (document.documentElement && document.documentElement.clientWidth) {
    //            windowWidth = document.documentElement.clientWidth;
    //        } else {
    //            if (document.body && document.body.clientWidth) {
    //                windowHeight = document.body.clientWidth;
    //            }
    //        }
    //    }
    //    return windowWidth;
    //}

    //self.widthWatch = ko.observable(self.getWindowWidth());

    //window.addEventListener('resize', function () {
    //    self.widthWatch(self.getWindowWidth());
    //});

    self.ready = ko.observable(false);

    self.tradeAccountSelector = new tradeAccountSelector(undefined, function (selectedValue) {
        console.log('tradeAccountSelector select function hit', selectedValue)
    }, self);

    self.tradeAccount = self.tradeAccountSelector.selected;

    self.orderProductsDrilldown = new orderProductsDrilldownViewModel(self, 'main');

    self.orderProductsDrilldownFurnitureComponents = new orderProductsDrilldownViewModel(self, 'bespokeFurniture');

    self.currentlyActiveDrilldown = ko.observable(self.orderProductsDrilldown);

    self.orderFactory = new orderProductsViewModel(self);

    self.memberBasketFetcher = memberBasketFetcher(self);
}