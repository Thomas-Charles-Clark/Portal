// Here's a custom Knockout binding that makes elements shown/hidden via jQuery's fadeIn()/fadeOut() methods
// Could be stored in a separate utility library
ko.bindingHandlers.fadeVisible = {
    init: function (element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function (element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
    }
};

// Thanks to http://stackoverflow.com/questions/17048468/make-an-input-only-numeric-type-on-knockout
ko.bindingHandlers.numeric = {
    init: function (element, valueAccessor) {
        $(element).on("keydown", function (event) {

            // Allow: backspace, delete, tab, escape, and enter
            if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
                // Allow: Ctrl+A
                (event.keyCode == 65 && event.ctrlKey === true) ||
                // Allow: both . keys (comma is event.keyCode == 188) if the Europeans complain about formatting... 
                (event.keyCode == 190 || event.keyCode == 110) ||
                // Allow: home, end, left, right
                (event.keyCode >= 35 && event.keyCode <= 39)) {

                // let the keypress occur
                return;
            }
            else {
                // Ensure that it is a number and stop the keypress
                if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                    event.preventDefault();
                }
            }
        });

        //$(element).on("keyup", function (event) {
        //    if (isNaN($(element).val())) {
        //        RedFade($(this));
        //    } else {
        //        $(this).css("background-color", "white");
        //    }
        //});
    }
};

//http://knockoutjs.com/documentation/extenders.html
ko.extenders.roundedNumeric = function (target, precision) {
    //create a writable computed observable to intercept writes to our observable
    var result = ko.pureComputed({
        read: target,  //always return the original observables value
        write: function (newValue) {


            if (newValue === "")
                newValue = null;

            var current = target(),
                roundingMultiplier = Math.pow(10, precision),
                newValueAsNum = isNaN(newValue) ? 0 : +newValue,
                valueToWrite = Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;

            valueToWrite = Number(valueToWrite).toFixed(precision);

            // only write if it has changed

            if (newValue === null && current === null)
                return;

            if (newValue === null)
                valueToWrite = null;

            if (isNaN(newValue) && newValue !== null) {
                return;
            }

            // and if both new and current are not null
            //if (newValue !== null && current !== null) {
            if (valueToWrite !== current) {
                target(valueToWrite);
            } else {
                //if the rounded value is the same, but a different value was written, force a notification for the current field
                if (newValue !== current) {
                    target.notifySubscribers(valueToWrite);
                }
            }
            //}
        }
    }).extend({ notify: 'always' });

    //initialize with current value to make sure it is rounded appropriately
    result(target());

    //return the new computed observable
    return result;
};

function RedFade(ele) {
    var col = $(ele).css("background-color");
    $(ele).animate({ 'background-color': 'rgba(255, 0, 0, 0.2)' }, 200, 'linear', function () {
        //$(ele).animate({ 'background-color': col }, 400, 'linear', function () {

        //});
    });
}

var Address = function (address, elementPrefix) {
    var self = this;

    self.PCASearchTerm = ko.observable(null);

    self.PCASearchTerm.subscribe(function (newValue) {
        $(".pca-failure").remove();
    });

    self.PCASearchId = ko.observable(null);
    self.PCAContainer = ko.observable(null);

    self.Name = ko.observable(ko.unwrap(address.Name)).extend({
        required: {
            params: true,
            message: 'Required'
        }
    });

    self.DeliveryReference = ko.observable(ko.unwrap(address.DeliveryReference));

    self.AddressLine1 = ko.observable(ko.unwrap(address.AddressLine1)).extend({
        required: {
            params: true,
            message: 'Required'
        }
    });

    self.AddressLine2 = ko.observable(ko.unwrap(address.AddressLine2));

    self.AddressLine3 = ko.observable(ko.unwrap(address.AddressLine3));

    self.AddressLine4 = ko.observable(ko.unwrap(address.AddressLine4));

    self.Postcode = ko.observable(ko.unwrap(address.Postcode));

    self.Country = ko.observable(ko.unwrap(address.Country)).extend({
        required: {
            params: true,
            message: 'Required'
        }
    });

    self.Postcode.extend({
        required: {
            params: true,
            onlyIf: function () {
                if (self.Country()) {
                    return self.Country().CountryID == 81;
                } else {
                    return self.CountryID == 81;
                }
            },
            message: 'Required'
        }
    });

    self.Default = address.Default || false; // this will only be present for SecondaryAddresses

    self.elementPrefix = elementPrefix;

    self.errorGroup = ko.validation.group([
        self.Name,
        self.AddressLine1,
        self.AddressLine2,
        self.Postcode,
        self.Country
    ]);

    self.setupCharsRemaining = function () {
        //console.log('setupCharsRemaining hit', self.elementPrefix);
        if (self.elementPrefix) {
            self.Name.extend({
                charsRemaining: {
                    maxLength: 50,
                    elementId: '#' + self.elementPrefix + '-name'
                },
                maxLength: 50
            });
            self.AddressLine1.extend({
                charsRemaining: {
                    maxLength: 60,
                    elementId: '#' + self.elementPrefix + '-line-1'
                },
                maxLength: 60
            });
            self.AddressLine2.extend({
                charsRemaining: {
                    maxLength: 60,
                    elementId: '#' + self.elementPrefix + '-line-2'
                },
                maxLength: 60
            });
            self.AddressLine3.extend({
                charsRemaining: {
                    maxLength: 50,
                    elementId: '#' + self.elementPrefix + '-line-3'
                },
                maxLength: 50
            });
            self.AddressLine4.extend({
                charsRemaining: {
                    maxLength: 40,
                    elementId: '#' + self.elementPrefix + '-line-4'
                },
                maxLength: 40
            });
            self.Postcode.extend({
                charsRemaining: {
                    maxLength: 20,
                    elementId: '#' + self.elementPrefix + '-postcode'
                },
                maxLength: 20
            });
        }
    }

    self.Country.subscribe(function (newValue) {
        //console.log('address.Country changed', newValue);
    });

    self.CountryCode = ko.observable(ko.unwrap(address.CountryCode));
    self.CountryID = ko.observable(ko.unwrap(address.CountryID));

    self.SelectListDisplayLine = ko.pureComputed(function () {

        var lineArray = [];
        // if last character is ',', remove it

        //if (self.DeliveryReference()) {
        //    var d = self.DeliveryReference();
        //    if (d)
        //      lineArray.push(d);
        //}

        if (self.AddressLine1()) {
            var a1 = self.AddressLine1();
            if (a1) {
                lineArray.push(a1);
            }
        }
        if (self.AddressLine2()) {
            var a2 = self.AddressLine2();
            if (a2) {
                lineArray.push(a2);
            }
        }
        //if (self.AddressLine3()) {
        //    var a3 = self.AddressLine3();
        //    if (a3)
        //         lineArray.push(a3);
        //}
        //if (self.AddressLine4()) {
        //    var a4 = self.AddressLine4();
        //    if (a4)
        //      lineArray.push(a4);
        //}
        if (self.Postcode()) {
            var p = self.Postcode();
            if (p) {
                lineArray.push(p);
            }
        }
        if (self.Country()) {
            var c = self.Country();
            if (typeof c === 'object') {
                lineArray.push(c.Name)
            } else if (c) {
                lineArray.push(c);
            }
        }

        return lineArray.join(', ');//self.DeliveryReference() + "\xa0\xa0\xa0\xa0\xa0" + lineArray.join(', ');
    }, self);

    self.DisplayLine = ko.pureComputed(function () {

        var lineArray = [];
        // if last character is ',', remove it

        if (self.Name()) {
            var n = self.Name();
            if (n)
                lineArray.push(n);
        }

        if (self.AddressLine1()) {
            var a1 = self.AddressLine1();
            if (a1)
                lineArray.push(a1);
        }
        if (self.AddressLine2()) {
            var a2 = self.AddressLine2();
            if (a2)
                lineArray.push(a2);
        }
        if (self.AddressLine3()) {
            var a3 = self.AddressLine3();
            if (a3)
                lineArray.push(a3);
        }
        if (self.AddressLine4()) {
            var a4 = self.AddressLine4();
            if (a4)
                lineArray.push(a4);
        }
        if (self.Postcode()) {
            var p = self.Postcode();
            if (p)
                lineArray.push(p);
        }
        if (self.Country()) {
            var c = self.Country();
            if (c)
                lineArray.push(c.Name);
        }

        return lineArray.join(', ');
    }, self);


    self.SummaryDisplayLines = ko.pureComputed(function () {

        var lineArray = [];
        // if last character is ',', remove it

        if (self.Name()) {
            var n = self.Name();
            if (n)
                lineArray.push(n);
        }

        if (self.AddressLine1()) {
            var a1 = self.AddressLine1();
            if (a1)
                lineArray.push(a1);
        }
        if (self.AddressLine2()) {
            var a2 = self.AddressLine2();
            if (a2)
                lineArray.push(a2);
        }
        if (self.AddressLine3()) {
            var a3 = self.AddressLine3();
            if (a3)
                lineArray.push(a3);
        }
        if (self.AddressLine4()) {
            var a4 = self.AddressLine4();
            if (a4)
                lineArray.push(a4);
        }
        if (self.Postcode()) {
            var p = self.Postcode();
            if (p)
                lineArray.push(p);
        }
        if (self.Country()) {
            var c = self.Country();
            if (c)
                lineArray.push(c.Name);
        }

        return lineArray; // returned as array; used via foreach
    }, self);

    self.toJSON = function () {
        var copy = ko.toJS(this); //easy way to get a clean copy

        delete copy.SelectListDisplayLine; //remove an extra property
        delete copy.DisplayLine;
        delete copy.SummaryDisplayLines;

        return copy;
    };
}

function BlankAddress(elementPrefix) {
    return new Address({
        Name: null,
        AddressLine1: null,
        AddressLine2: null,
        AddressLine3: null,
        AddressLine4: null,
        Country: null,
        Postcode: null,
        CountryCode: null,
        CountryID: null
    },
        elementPrefix)
}

var Product = function (product) {
    var self = this;

    //console.log('creating Product from', product);

    // do these need to be observables? they aren't going to change. So no.
    self.ProductID = product.ProductID;
    self.ProductGroupID = product.ProductGroupID;
    self.ItemTypeID = product.ItemTypeID;
    self.BrandID = product.BrandID;
    self.ColourID = product.ColourID;
    self.PatternID = product.PatternID;
    self.StockStatusID = product.StockStatusID;
    self.LaunchID = product.LaunchID;

    self.Name = product.Name;
    self.Code = product.Code;
    self.Status = product.Status;
    self.RRP = product.RRP;
    self.RRPValue = product.RRPValue;
    self.ListPrice = product.ListPrice;
    self.ListPriceValue = product.ListPriceValue;
    self.Units = product.Units;

    self.FreeStock = product.FreeStock;
    self.FreeStockValue = product.FreeStockValue;
    self.StockStatus = product.StockStatus;

    self.CuttingProductID = product.CuttingProductID;
    self.CuttingCode = product.CuttingCode;
    self.CSSID = product.CuttingSSID;
    self.CStock = product.CuttingStock;
    self.CuttingStatus = product.CuttingStatus;
    self.CuttingPrice = product.CuttingPrice == null ? null : product.CuttingPrice.toFixed(2);

    self.ReturnableProductID = product.ReturnableProductID;
    self.ReturnableCode = product.ReturnableCode;
    self.RSSID = product.ReturnableSSID;
    self.RStock = product.ReturnableStock;
    self.ReturnableStatus = product.ReturnableStatus;
    self.ReturnablePrice = product.ReturnablePrice == null ? null : product.ReturnablePrice.toFixed(2);

    if (viewModel.cuttingPriceOverride() != null) {
        self.CuttingPrice = viewModel.cuttingPriceOverride();
    }

    if (viewModel.returnablePriceOverride() != null) {
        self.ReturnablePrice = viewModel.returnablePriceOverride();
    }

    self.ImageID = product.ImageID;
    self.ProductPageID = product.ProductPageID;

    self.CuttingStockLine = ko.pureComputed(function () {
        switch (self.CSSID) {
            case 1:
                return self.CStock + " in stock";
            case 255:
                return "Out of stock";
            default:
                return self.CuttingCode == null ? "No cutting part number" : "No stock info";
        }
    }, self);

    self.ReturnableStockLine = ko.pureComputed(function () {
        switch (self.RSSID) {
            case 1:
                return self.RStock + " in stock";
            case 255:
                return "Out of stock";
            default:
                return self.ReturnableCode == null ? "No returnable part number" : "No stock info";
        }
    }, self);

    self.DisplayName = ko.pureComputed(function () {

        var lineArray = [];
        // if last character is ',', remove it

        if (self.Code) {
            var c = self.Code;
            lineArray.push(c);
        }
        if (self.Name) {
            var n = self.Name;
            lineArray.push(n);
        }

        return self.Code + "\xa0\xa0\xa0\xa0\xa0" + lineArray.join(', ');
    }, self);

    self.cuttingQuantityInBasket = ko.pureComputed({
        read: function () {
            return Enumerable.From(viewModel.basket()).Where(function (x) {
                var xCode = x.Code;
                var sCode = self.CuttingCode;
                if (xCode == sCode)
                    return x;
            }).Select("$.Quantity()").Sum();
        },
        write: function (value) {

        },
        owner: self
    }, self);

    self.returnableQuantityInBasket = ko.pureComputed({
        read: function () {
            return Enumerable.From(viewModel.basket()).Where(function (x) {
                var xCode = x.Code;
                var sCode = self.ReturnableCode;
                if (xCode == sCode)
                    return x;
            }).Select("$.Quantity()").Sum();
        },
        write: function (value) {

        },
        owner: self
    }, self);

    self.toJSON = function () {
        var copy = ko.toJS(this); //easy way to get a clean copy

        delete copy.CuttingStockLine; //remove an extra property
        delete copy.ReturnableStockLine;
        delete copy.DisplayName;
        delete copy.cuttingQuantityInBasket;
        delete copy.returnableQuantityInBasket;

        return copy;
    }
}

//var BasketItem = function (item, code, price, stock) {
//    var self = this;

//    self.ProductID = item.ProductID;
//    self.Code = code;
//    self.Status = item.Status;
//    self.ImageID = item.ImageID;
//    self.Name = item.Name;
//    self.Price = ko.observable(price).extend({
//        roundedNumeric: 2
//    });
//    self.Quantity = ko.observable(1);
//    self.LineRef = ko.observable(item.LineRef);
//    self.Stock = stock;

//    return self;
//}

const sampleBasketItem = ({
    item,
    code,
    price,
    stock
} = {}) => (function () {
    var self = {};

    self.record = item;

    self.ProductID = item.ProductID;
    self.Code = code;
    self.Status = item.Status;
    self.ImageID = item.ImageID;
    self.Name = item.Name;
    self.Price = ko.observable(price).extend({
        roundedNumeric: 2
    });
    self.Quantity = ko.observable(1);
    self.LineRef = ko.observable(item.LineRef);
    self.Stock = stock;

    return self;
})()


var Account = function (account) {
    var self = this;

    //account.SampleOrderConfirmationTopText
    //account.SampleOrderConfirmationTopTextReadOnly

    self.SampleOrderConfirmationTopText = ko.observable();
    self.SampleOrderConfirmationTopTextReadOnly = ko.observable();

    self.TradeAccountID = account.TradeAccountID;
    self.Label = account.Label;
    self.Name = account.Name;
    self.Code = account.Code;
    self.AccountNumber = account.value;
    self.CountryCode = account.CountryCode;
    self.Email = ko.observable(account.Email).extend({
        email: true
    }).extend({
        required: {
            params: true,
            onlyIf: function () {
                if (viewModel) {
                    return viewModel.customerWantsOrderConfirmation()
                } else {
                    return false;
                }
            },
            message: 'You must provide an email'
        }
    });
    self.tradeAccountVATNumber = ko.observable(account.VATNumber);
    self.PriceList = account.PriceList;
    self.TradePriceListID = account.TradePriceListID;
    self.DefaultOrderConfirmationLanguage = account.OrderConfirmationLanguageID;
    self.CurrencySymbol = account.CurrencySymbol;
    self.CurrencyCulture = account.CurrencyCulture;
    self.CurrencyCode = account.CurrencyCode;
    self.CurrencyID = account.CurrencyID;
    self.MertexCurrencyCode = account.MertexCurrencyCode;
    self.SalesMarketID = account.MarketID;

    self.SampleHAULCODE = account.SampleHAULCODE;
    self.SampleCARRCODE = account.SampleCARRCODE;

    self.UPSAccountNumber = account.UPSAccountNumber;
    self.DefaultDeliveryType = account.DeliveryType;
}

var SamplesViewModel = function () {
    var self = this;

    self.reset = function () {

        $("#product-code").val(null);
        if ($("#account-number").length) {
            $("#account-number").val(null);
            $("#account-number").data("ui-autocomplete").term = null;
        }
        self.customAddress(BlankAddress('custom')); // has to be up before tradeaccountSelector changes, the change sets this address's country
        $("#product-code").data("ui-autocomplete").term = null; //.data()["ui-autocomplete"].term = null;
        self.tradeAccountSelector.reset();
        if (self.tradeAccountSelector.selected()) {
            self.account(self.tradeAccountSelector.selected());
            self.accountNumber(self.account().Code);
        } else {
            self.account(undefined);
            self.accountNumber(undefined);
        }
        self.customerOrderReference('SAMPLE ORDER');
        self.address(null);
        self.selectedSecondaryAddress(null);
        self.primaryAddress(BlankAddress('primary'));
        self.secondaryAddressList([]);
        self.productResultsList([]);

        //self.availableCountries(getAllCountries());
        //self.availableCountriesWithout3D = ko.observable(getAllCountriesWithout3D());
        self.availableLanguages(getAllLanguages());
        self.selectedOrderConfirmationLanguage(null);
        self.stockInfoBusy(false);
        self.spaInfoBusy(false);
        self.exactlyRRP(undefined);
        self.lessThanRRP(undefined);

        self.basket([]);

        //self.orderTakerLabel(null);
        self.orderTaker(getDefaultOrderTaker()); // hmmmmmm. if one taker is placing order after order the default should be that taker? or retain whatever was set across to the next order placed... ugh.

        self.cuttingPriceOverride(null);
        self.returnablePriceOverride(null);

        self.productSearchBusy(false);

        self.customerWantsOrderConfirmation(true);
        self.sendExtraText(false);
        self.extraConfirmationText(undefined);

        self.secondaryAddresses([]);

        if (self.deliverySelector()) {
            self.deliverySelector().reset();
        }

        self.errorGroup.showAllMessages(false);

        if (self.tradeAccountSelector.selected()) {
            $("#account-collapse").collapse('show');
        } else {
            $("#trade-account-collapse").collapse('show');
        }
    };

    self.currentlyUsingBasket = ko.observable();

    self.storeBasket = function () {
        self.placeOrderBusy(true);

        var b = {
            tradeAccountLabel: self.account().Label,
            basketItems: ko.observableArray(),
            visible: ko.observable(false),
            basketId: new Date().getTime()
        }

        ko.utils.arrayForEach(self.basket(), function (bi) {
            b.basketItems.push(sampleBasketItem({
                item: $.extend(bi.record, {
                    LineRef: ko.unwrap(bi.LineRef)
                }),
                code: bi.Code,
                price: ko.unwrap(bi.Price),
                stock: bi.Stock
            }));
        });

        self.previousBaskets.push(b);

        self.placeOrderBusy(false);
        $.info('Information', 'Basket Stored Successfully');
    }

    self.takeBasket = function (i) {
        $.confirm('Are you sure?', 'Your current basket contents will be overwritten.', function () {
            self.basket(self.previousBaskets()[i].basketItems());
            self.currentlyUsingBasket(self.previousBaskets()[i].basketId);
        }, null)
    }

    self.account = ko.observable();

    self.accountNumber = ko.observable(null);

    if (getSelectedTradeAccount()) {
        self.account(new Account(getSelectedTradeAccount()))
        self.tradeAccountSelector = new tradeAccountSelector(self.account());
    } else {
        self.tradeAccountSelector = new tradeAccountSelector();
    }

    self.deliverySelector = ko.observable();

    self.exactlyRRP = ko.observable().extend({ roundedNumeric: 2 });

    self.lessThanRRP = ko.observable().extend({ roundedNumeric: 2 });

    self.fetchSampleOrderConfirmationText = (tradeAccountId) => {
        $.ajax({
            url: "/api/ComponentAPI/FetchTradeAccountSampleOrderConfirmationText",
            type: "POST",
            dataType: "json",
            data: {
                tradeAccountId: tradeAccountId
            },
            success: function (data) {
                self.account().SampleOrderConfirmationTopText(data.SampleOrderConfirmationTopText);
                self.account().SampleOrderConfirmationTopTextReadOnly(data.SampleOrderConfirmationTopTextReadOnly);

            },
            error: function (xhr, textStatus, errorThrown) {
                //$.showError(xhr, textStatus, errorThrown);
            }
        });
    }
    self.fetchTradeAccountAddresses = function () {
        $.ajax({
            url: "/Component/FetchAddresses",
            type: "POST",
            dataType: "json",
            data: {
                accountNumber: self.account().Code
            },
            success: function (data) {
                if (data) {
                    if (data.PrimaryAddresses) {
                        if (data.PrimaryAddresses.length > 0) {
                            self.primaryAddress(new Address(data.PrimaryAddresses[0], 'primary'));

                            var countries = Enumerable.From(self.availableCountries()).Where(function (x) {
                                if (x.Code == data.PrimaryAddresses[0].CountryCode)
                                    return x;
                            }).ToArray();

                            //console.log('found primary address countries', countries);

                            if (countries.length > 0) {
                                self.primaryAddress().Country(countries[0]);
                            } else {

                            }
                        } else {
                            self.primaryAddress(null);
                        }
                    }

                    if (data.SecondaryAddresses) {
                        if (data.SecondaryAddresses.length > 0) {
                            self.secondaryAddresses(data.SecondaryAddresses);

                            self.selectedSecondaryAddress(self.defaultSecondaryAddress());
                        } else {
                            self.secondaryAddresses([]);
                        }
                    }
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //$.showError(xhr, textStatus, errorThrown);
            }
        });
    }

    self.customerOrderReference = ko.observable('SAMPLE ORDER').extend({
        required: {
            params: true,
            message: 'You must provide an order reference'
        },
        charsRemaining: {
            maxLength: 50,
            elementId: '#order-ref'
        }
    });

    self.cuttingPriceOverride = ko.observable(null).extend({ roundedNumeric: 2 });
    self.returnablePriceOverride = ko.observable(null).extend({ roundedNumeric: 2 });

    self.cuttingPriceOverride.subscribe(function (newValue) {
        $("#product-code").autocomplete("search");
    });

    self.returnablePriceOverride.subscribe(function (newValue) {
        $("#product-code").autocomplete("search");
    });

    self.email = ko.computed(function () {
        if (self.account()) {
            return self.account().Email();
        } else {
            return null;
        }
    }, self);

    self.address = ko.observable(null);
    self.selectedSecondaryAddress = ko.observable();
    self.availableCountries = ko.observable(getAllCountries());
    self.defaultSecondaryAddress = ko.pureComputed({
        read: function () {
            if (self.secondaryAddressList()) {
                return Enumerable.From(self.secondaryAddressList()).Where("$.Default").SingleOrDefault();
            } else {
                return null;
            }
        }
    });
    self.customAddress = ko.observable(BlankAddress('custom'));

    if (getPrimaryAddresses().length > 0) {
        self.primaryAddress = ko.observable(new Address(getPrimaryAddresses()[0], 'primary'));

        var countries = Enumerable.From(self.availableCountries()).Where(function (x) {
            if (x.Code == getPrimaryAddresses()[0].CountryCode)
                return x;
        }).ToArray();

        //console.log('found primary address countries', countries);

        if (countries.length > 0) {
            self.primaryAddress().Country(countries[0]);
        } else {

        }
    } else {
        self.primaryAddress = ko.observable(BlankAddress('primary'));
    }

    self.warehouseAddress = ko.observable(new Address({
        DeliveryReference: null,
        CompanyName: 'Designers Guild',
        Name: 'Sample Order Collection',
        AddressLine1: 'Unit 10 Segro Park',
        AddressLine2: '900 Coronation Road',
        AddressLine3: null,
        AddressLine4: 'London',
        Postcode: 'NW10 7PH',
        Country: {
            Name: 'United Kingdom',
            Code: 'GB',
            ThreeDigitCode: 'GBR',
            CountryID: 81
        },
        CountryCode: 'GB',
        CountryID: 81,
        EU: false,
        Phone: '0207 893 7505',
        Email: 'outletshop@designersguild.com'
    }, 'warehouse'));

    self.secondaryAddressList = ko.observable([]);

    self.secondaryAddresses = ko.pureComputed({
        read: function () {
            return self.secondaryAddressList()
        },
        write: function (secondaryAddresses) {

            var addressItems = [];

            if (secondaryAddresses != null) {
                secondaryAddresses.forEach(function (address) {
                    addressItems.push(new Address(address));
                });
            }
            self.secondaryAddressList(addressItems);
        },
        owner: self
    }, self);

    if (getSecondaryAddresses().length > 0) {
        self.secondaryAddresses(getSecondaryAddresses());
        self.selectedSecondaryAddress(self.defaultSecondaryAddress());
    }

    //self.customAddress().Name.extend({
    //    charsRemaining: {
    //        maxLength: 50,
    //        elementId: '#custom-name'
    //    }
    //});
    //self.customAddress().AddressLine1.extend({
    //    charsRemaining: {
    //        maxLength: 60,
    //        elementId: '#custom-line-1'
    //    },
    //    maxLength: 60
    //});
    //self.customAddress().AddressLine2.extend({
    //    charsRemaining: {
    //        maxLength: 60,
    //        elementId: '#custom-line-2'
    //    },
    //    maxLength: 60
    //});
    //self.customAddress().AddressLine3.extend({
    //    charsRemaining: {
    //        maxLength: 50,
    //        elementId: '#custom-line-3'
    //    },
    //    maxLength: 50
    //});
    //self.customAddress().AddressLine4.extend({
    //    charsRemaining: {
    //        maxLength: 40,
    //        elementId: '#custom-line-4'
    //    },
    //    maxLength: 40
    //});
    //self.customAddress().Postcode.extend({
    //    charsRemaining: {
    //        maxLength: 20,
    //        elementId: '#custom-postcode'
    //    },
    //    maxLength: 20
    //});
    self.productSearchBusy = ko.observable(false);
    self.productResultsList = ko.observable([]);
    self.basket = ko.observableArray([]);
    self.previousBaskets = ko.observableArray([]);

    self.basket.subscribe(function (newValues) {
        self.currentlyUsingBasket(undefined);
    });

    //self.availableCountriesWithout3D = ko.observable(getAllCountriesWithout3D());
    self.availableLanguages = ko.observable(getAllLanguages());
    self.selectedOrderConfirmationLanguage = ko.observable(null);
    self.stockInfoBusy = ko.observable(false);
    self.spaInfoBusy = ko.observable(false);
    self.sendExtraText = ko.observable(false);

    self.customerWantsOrderConfirmation = ko.observable(true);
    self.customerWantsOrderConfirmation.subscribe(function (newValue) {
        if (newValue == false) {
            $("#potato").css("background-color", "white");
            self.sendExtraText(false);
        }
    });

    self.extraConfirmationText = ko.observable().extend({
        charsRemaining: {
            maxLength: 500,
            elementId: '#extra-confirmation-text'
        }
    });

    self.sendExtraText.subscribe(function (newValue) {
        if (newValue) {
            $("#extra-text-modal").modal('show');
        } else {
            if (self.account()) {
                self.extraConfirmationText(self.account().SampleOrderConfirmationTopText);
            } else {
                self.extraConfirmationText(undefined);
            }
        }
    });

    self.orderTaker = ko.observable(getDefaultOrderTaker()).extend({
        required: {
            params: true,
            onlyIf: function () {
                return !orderTakerHidden();
            },
            message: 'You must provide an order taker'
        }
    });
    self.orderTaker.subscribe(function (newValue) {
        //$("#order-taker").val(null);
    });

    //self.orderTakerLabel = ko.observable(null);

    self.orderTakerLabel = ko.computed({
        write: function () {

        },
        read: function () {
            if (self.orderTaker()) {
                return self.orderTaker().Code + ' - ' + self.orderTaker().Name;// + (self.orderTaker().Name ? " - " + self.orderTaker().Name : "")
            } else {
                return "Not Set";
            }
        }
    }, self);

    self.errorGroup = ko.validation.group([
        self.customerOrderReference,
        self.tradeAccountSelector.selected,
        self.orderTaker
    ], { deep: true });

    self.tradeAccountSelector.selected.subscribe(function (newValue) {

        if (newValue != null) {

            self.account(new Account(newValue));

            if (self.deliverySelector()) {
                self.deliverySelector().reset();
                self.deliverySelector().defaultDespatch({
                    HAULCODE: 'RM',//newValue.SampleHAULCODE,
                    CARRCODE: 'PO182'//newValue.SampleCARRCODE
                });
            }

            self.fetchSampleOrderConfirmationText(newValue.TradeAccountID);

            self.fetchTradeAccountAddresses();

            self.accountNumber(newValue.AccountNumber);
            self.selectedOrderConfirmationLanguage(newValue.DefaultOrderConfirmationLanguage);

            var countries = Enumerable.From(self.availableCountries()).Where(function (x) {
                if (x.Code == newValue.CountryCode)
                    return x;
            }).ToArray();

            if (countries.length > 0) {
                self.customAddress().Country(countries[0]);
            } else {

            }

            window.setTimeout(function () {

                if ($("#account-collapse").hasClass("in")) { }
                else {
                    $("#account-name-label").trigger("click");
                }

                $("#account-continue").focus();

                //self.primaryAddress().setupCharsRemaining();
                self.initOrderTakerAutocomplete();
                self.initPCAAutocomplete();
                self.account().Email.extend({
                    email: true,
                    charsRemaining: {
                        maxLength: 256,
                        elementId: '#potato'
                    }
                });
                self.account().tradeAccountVATNumber.extend({
                    minLength: {
                        params: 7,
                        onlyIf: function () {
                            if (self.account())
                                return self.account().tradeAccountVATNumber() != null;
                            else
                                return false;
                        },
                        message: 'VAT Number must be between 7 and 20 characters.'
                    },
                    maxLength: {
                        params: 20,
                        onlyIf: function () {
                            if (self.account())
                                return self.account().tradeAccountVATNumber() != null;
                            else
                                return false;
                        },
                        message: 'VAT Number must be between 7 and 20 characters.'
                    },
                    charsRemaining: {
                        maxLength: 256,
                        elementId: '#potato'
                    }
                });
                self.account().tradeAccountVATNumber.extend({
                    charsRemaining: {
                        maxLength: 20,
                        elementId: '#vat-number'
                    }
                });

                self.customAddress().setupCharsRemaining();
            }, 0);
        }

        // jquery's tooltip has taken precedence. Bollocks.
        //window.setTimeout(function () {
        //    if ($("#pca-find").data('bs.tooltip')) {

        //    } else {
        //        $("#pca-find").tooltip({
        //            trigger: 'manual',
        //            html: true,
        //            title: 'Address Search Error<br/>Please try again',
        //            placement: 'bottom'
        //        });
        //    }
        //}, 0);
    })

    self.blankAddress = function (createCharsRemaining, elementPrefix) {
        return new Address({
            Name: null,
            AddressLine1: null,
            AddressLine2: null,
            AddressLine3: null,
            AddressLine4: null,
            Country: null,
            Postcode: null,
            CountryID: null,
            Country: undefined
        },
            elementPrefix)
    }

    self.setSelectedAddress = function (address) {
        if (address != null) {
            self.address(address);
            window.setTimeout(function () {
                self.deliverySelector().defaultDespatch({
                    HAULCODE: 'RM',//self.account().SampleHAULCODE,
                    CARRCODE: 'PO182'//self.account().SampleCARRCODE
                });

                self.deliverySelector().selectDefaultDespatch();
            }, 0);

            if (!$("#product-collapse").hasClass("in")) {
                $("#product-display-label").trigger('click');
            }
        }
    };

    self.setSelectedSecondaryAddress = function (address) {
        console.log(address);
        // if address.CountryID() is in availableCountries, great, set the Country to the OBJECT.
        // if NOT: fill in the Custom Address with this address, info the user that Country could not be determined.
        // tell them to please select the country.
        self.address(undefined);
        var countries = Enumerable.From(viewModel.availableCountries()).Where(function (x) {
            if (x.CountryID == address.CountryID())
                return x;
        }).ToArray();

        if (countries.length > 0) {
            address.Country(countries[0]);
            self.setSelectedAddress(address);
        } else {
            $.info('Sorry', 'Could not verify the country on this stored address. Please correct data in Mertex.');
            self.customAddress(new Address(address));
            self.customAddress().Country(undefined);
        }
    }

    self.setSecondaryAddressOptionsAfterRender = function (option, item) {
        option.title = item.DisplayLine();
    };

    // right, so... if we have a trade account preselected, we NEED the call to fetch addresses... to... ideally be pre-done on the server.

    var defaultDespatch = {
        HAULCODE: 'RM',
        CARRCODE: 'PO182'
    };

    //if (self.account()) {
    //    defaultDespatch.HAULCODE = self.account().SampleHAULCODE,
    //    defaultDespatch.CARRCODE = self.account().SampleCARRCODE
    //}

    if (getSelectedTradeAccount()) {

        //self.deliverySelector().reset();

        self.accountNumber(getSelectedTradeAccount().AccountNumber);
        self.selectedOrderConfirmationLanguage(getSelectedTradeAccount().DefaultOrderConfirmationLanguage);

        var countries = Enumerable.From(self.availableCountries()).Where(function (x) {
            if (x.Code == getSelectedTradeAccount().CountryCode)
                return x;
        }).ToArray();

        if (countries.length > 0) {
            self.customAddress().Country(countries[0]);
        } else {

        }

        self.errorGroup = ko.validation.group([
            self.customerOrderReference,
            self.tradeAccountSelector.selected,
            self.orderTaker,
            self.account().tradeAccountVATNumber
        ], { deep: true });

        window.setTimeout(function () {
            $("#account-continue").focus();

            //self.primaryAddress().setupCharsRemaining();
            self.initOrderTakerAutocomplete();
            self.initPCAAutocomplete();
            self.account().Email.extend({
                email: true,
                charsRemaining: {
                    maxLength: 256,
                    elementId: '#potato'
                }
            });
            self.account().tradeAccountVATNumber.extend({
                minLength: {
                    params: 7,
                    onlyIf: function () {
                        return self.account().tradeAccountVATNumber() != null;
                    },
                    message: 'VAT Number must be between 7 and 20 characters.'
                },
                maxLength: {
                    params: 20,
                    onlyIf: function () {
                        return self.account().tradeAccountVATNumber() != null;
                    },
                    message: 'VAT Number must be between 7 and 20 characters.'
                },
                charsRemaining: {
                    maxLength: 20,
                    elementId: '#vat-number'
                }
            });

            self.customAddress().setupCharsRemaining();
        }, 0);
    }

    self.initOrderTakerAutocomplete = function () {

        $("#order-taker").autocomplete({
            classes: {
                'account-no': 'account-no'
            },
            appendTo: '#order-taker-selector',
            source: function (request, response) {
                $.ajax({
                    url: "/api/ComponentAPI/OperatorAutocomplete",
                    type: "POST",
                    dataType: "json",
                    data: {
                        term: request.term
                    },
                    success: function (data) {
                        response($.map(data, function (item) {
                            return {
                                label: item.Code + " - " + item.Name,
                                value: item.Code,
                                obj: item
                            };
                        }));
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        //$.showError(xhr, textStatus, errorThrown);
                    }
                });
            },
            minLength: 1,
            select: function (event, ui) {
                $("#order-taker").val(null);
                viewModel.orderTaker(ui.item.obj);
                return false;
            },
            autoFocus: true,
        });

        viewModel.orderTaker(getDefaultOrderTaker());
    }

    self.initPCAAutocomplete = function () {
        $("#pca-find").autocomplete({
            appendTo: '#pca-find-wrapper',
            source: function (request, response) {
                $("#pca-find").parent().find('.pca-failure').remove();

                if (self.customAddress().Country()) {

                    $.ajax({
                        url: "/Products/Enquiry/PCAPredictFind",
                        type: "POST",
                        dataType: "json",
                        data: {
                            id: self.customAddress().PCASearchId(),
                            text: self.customAddress().PCASearchTerm(),
                            container: self.customAddress().PCAContainer(),
                            origin: null,
                            countries: self.customAddress().Country().Code,
                        },
                        success: function (data) {
                            $("#pca-find").removeClass('ui-autocomplete-loading');
                            if (self.customAddress().PCASearchId() != null) {
                                if (data.length == 1) {
                                    var county = data[0].Province || data[0].ProvinceName || data[0].ProvinceCode || data[0].AdminAreaName || data[0].AdminAreaCode;
                                    if (data[0].City === "London" && self.customAddress().Country().Code == "GB")
                                        county = "London";
                                    var line1 = data[0].Line1;
                                    if (data[0].Company != "") {
                                        line1 = data[0].Company + ", " + line1;
                                    }

                                    self.customAddress().AddressLine1(line1);
                                    self.customAddress().AddressLine2(data[0].Line2);
                                    self.customAddress().AddressLine3(data[0].City);
                                    self.customAddress().AddressLine4(county);
                                    self.customAddress().Postcode(data[0].PostalCode);

                                    //self.customAddress(new Address({
                                    //    Name: self.customAddress().Name(),
                                    //    AddressLine1: line1,
                                    //    AddressLine2: data[0].Line2,
                                    //    AddressLine3: data[0].City,
                                    //    AddressLine4: county,
                                    //    Postcode: data[0].PostalCode,
                                    //    Country: self.customAddress().Country()
                                    //}));
                                    $("#pca-find").autocomplete("close");

                                    self.customAddress().PCASearchId(null);
                                    self.customAddress().PCAContainer(null);
                                    return false;
                                } else {
                                    response($.map(data, function (item) {
                                        var county = item.Province || item.ProvinceName || item.ProvinceCode || item.AdminAreaName || item.AdminAreaCode;
                                        if (item.City === "London" && self.customAddress().Country().Code == "GB")
                                            county = "London";
                                        var line1 = data[0].Line1;
                                        if (item.Company != "") {
                                            line1 = data[0].Company + ", " + line1;
                                        }
                                        return {
                                            customCatch: true,
                                            label: item.Label,
                                            value: item.Id,
                                            addressLine1: line1,
                                            addressLine2: item.Line2,
                                            addressLine3: item.City,
                                            addressLine4: county,
                                            Postcode: item.PostalCode
                                        }
                                    }));
                                    return false;
                                }
                            }

                            self.customAddress().PCASearchId(null);
                            self.customAddress().PCAContainer(null);

                            response($.map(data, function (item) {
                                if (item.hasOwnProperty('Type')) {
                                    if ((item.Type === "Address") || (item.Type === "Residential")) {
                                        return {
                                            id: item.Id,
                                            label: item.Text + ", " + item.Description,
                                            value: item.Id,
                                            type: item.Type,
                                            text: item.Text
                                            // highlight: item.Highlight
                                        };
                                    } else {
                                        return {
                                            id: item.Id,
                                            label: item.Description,
                                            value: item.Id,
                                            type: item.Type,
                                            text: item.Text
                                            // highlight: item.Highlight
                                        };
                                    }
                                } else {
                                    return {
                                        label: item.Label,
                                        value: item.Id
                                    }
                                }
                            }));
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            console.log('pcaPredict failure', errorThrown);
                            $("#pca-find").autocomplete('close');
                            $("#pca-find").removeClass('ui-autocomplete-loading');
                            $("#pca-find").parent().find('.pca-failure').remove();
                            $("#pca-find").parent().append('<span class="pca-failure alert alert-danger" style="padding-top: 4px;">Lookup Failure. Please try again.</span>');
                            //$.showError(xhr, textStatus, errorThrown);
                        }
                    });
                } else {
                    $("#pca-find").removeClass('ui-autocomplete-loading');
                    response($.map([{
                        id: '',
                        label: 'Please select a Country before searching',
                        value: null,
                        type: null,
                        text: 'Please select a Country before searching'
                    }], function (item) {
                        return {
                            id: item.id,
                            label: item.label,
                            value: item.value,
                            type: item.type,
                            text: item.text
                        }
                    }));
                }
            },
            minLength: 1,
            select: function (event, ui) {
                if (ui.item.hasOwnProperty('type')) {
                    switch (ui.item.type) {
                        case 'Address':
                        case 'Residential':
                            jQuery.extend(event.originalEvent, { keepOpen: true });
                            self.customAddress().PCASearchId(ui.item.id);
                            self.customAddress().PCAContainer(null);
                            //$("#pca-find").autocomplete('search');
                            break;
                        default:
                            jQuery.extend(event.originalEvent, { keepOpen: true });
                            //modify value as required
                            self.customAddress().PCASearchId(null);
                            self.customAddress().PCAContainer(ui.item.id);
                            //$("#pca-find").autocomplete('search');
                            return false;
                    }
                } else if (ui.item.hasOwnProperty('customCatch')) {

                    self.customAddress().AddressLine1(ui.item.addressLine1);
                    self.customAddress().AddressLine2(ui.item.addressLine2);
                    self.customAddress().AddressLine3(ui.item.addressLine3);
                    self.customAddress().AddressLine4(ui.item.addressLine4);
                    self.customAddress().Postcode(ui.item.Postcode);

                    //self.customAddress(new Address({
                    //    Name: self.customAddress().Name(),
                    //    AddressLine1: ui.item.addressLine1,
                    //    AddressLine2: ui.item.addressLine2,
                    //    AddressLine3: ui.item.addressLine3,
                    //    AddressLine4: ui.item.addressLine4,
                    //    Postcode: ui.item.Postcode,
                    //    Country: self.customAddress().Country()
                    //}));
                    $("#pca-find").autocomplete("close");
                    self.customAddress().PCASearchId(null);
                    self.customAddress().PCAContainer(null);
                }

                return false;
            },
            focus: function (event, ui) {
                event.preventDefault();
            },
            autoFocus: true
        });
    }

    self.verifyPrimaryAddress = ko.observable(function () {
        var valid = true;

        if (self.primaryAddress().Country()) {

        } else {
            $.error('Sorry', 'Failed to identify Country from invoice address. Please check data in Mertex.');
            valid = false;
        }

        //if (self.primaryAddress().errorGroup().length > 0) {
        //    valid = false;
        //    self.primaryAddress().errorGroup.showAllMessages(true);
        //} else {
        //    valid = true;
        //}

        if (valid) {
            self.setSelectedAddress(new Address({
                Name: viewModel.primaryAddress().Name() || '',
                AddressLine1: viewModel.primaryAddress().AddressLine1() || '',
                AddressLine2: viewModel.primaryAddress().AddressLine2() || '',
                AddressLine3: viewModel.primaryAddress().AddressLine3() || '',
                AddressLine4: viewModel.primaryAddress().AddressLine4() || '',
                Country: viewModel.primaryAddress().Country(),
                Postcode: viewModel.primaryAddress().Postcode() || '',
                CountryCode: viewModel.primaryAddress().Country().Code,
                CountryID: viewModel.primaryAddress().Country().CountryID,
                DeliveryReference: viewModel.primaryAddress().DeliveryReference
            }));
        }
    });

    self.selectWarehouseAddress = function () {
        self.address(self.warehouseAddress());
        if (!$("#product-collapse").hasClass("in")) {
            $("#product-display-label").trigger('click');
        }
        window.setTimeout(function () {
            self.deliverySelector().selectedHaulier(ko.utils.arrayFirst(self.deliverySelector().availableHauliers(), function (h) {
                return h.HAULCODE = 'CC'
            }));
            window.setTimeout(function () {
                self.deliverySelector().selectedCarriageService(self.deliverySelector().availableCarriages()[0]);
            }, 0);
        }, 300);
    }

    self.verifyCustomAddress = ko.observable(function () {

        var valid = true;

        if (self.customAddress().errorGroup().length > 0) {
            valid = false;
            self.customAddress().errorGroup.showAllMessages(true);
        } else {
            valid = true;
        }

        if (valid) {
            self.setSelectedAddress(new Address({
                Name: viewModel.customAddress().Name(),
                AddressLine1: viewModel.customAddress().AddressLine1(),
                AddressLine2: viewModel.customAddress().AddressLine2(),
                AddressLine3: viewModel.customAddress().AddressLine3(),
                AddressLine4: viewModel.customAddress().AddressLine4(),
                Country: viewModel.customAddress().Country(),
                Postcode: viewModel.customAddress().Postcode(),
                CountryCode: viewModel.customAddress().Country().Code,
                CountryID: viewModel.customAddress().Country().CountryID
            }));
        }
    });

    self.productResults = ko.pureComputed({
        read: function () {
            return self.productResultsList()
        },
        write: function (productResults) {

            var productItems = [];

            if (productResults != null) {
                productResults.forEach(function (product) {
                    productItems.push(new Product(product));
                });
            }
            self.productResultsList(productItems);
        },
        owner: self
    }, self);

    self.statusTitle = function (status) {
        switch (status) {
            case "C":
                return "Current";
                break;
            case "L":
                return "Limited";
                break;
            case "Y":
                return "Pre-Limited";
                break;
            case "D":
                return "Discontinued";
                break;
            default:
                return "Unrecognised!";
        }
    }

    self.stockInfoProducts = ko.observableArray([]);

    self.showStockInfo = function (product) {

        self.stockInfoProducts([$.extend(product, {
            stockInfo: ko.observable(),
            supplierAvailabilityMessage: ko.observable()
        })]);

        //$.info('Sorry', 'Disabled, please contact IT Support');

        $("#stock-title").text(product.Name + ' - Detailed Stock Info');
        //$("#stock-container").empty();
        $("#stock-modal").modal('show');
        self.stockInfoBusy(true);
        $.ajax({
            url: '/api/componentapi/GetPieceLevelStockInfo',
            type: 'POST',
            dataType: 'json',
            data: {
                tradeAccountId: self.tradeAccountSelector.selected().TradeAccountID,
                productIds: [product.ProductID]
            },
            success: function (data) {
                self.stockInfoBusy(false);
                console.log('getPieceLevelStockInfo returned: ', data);

                ko.utils.arrayForEach(self.stockInfoProducts(), function (item, index) {
                    var items = Enumerable.From(data.stockResults).Where(function (x) {
                        return x.ProductID == item.ProductID;
                    }).ToArray();

                    var processed = Enumerable.From(items).GroupBy(function (piece) {
                        return {
                            stockLocationCode: piece.StockLocationCode,
                            stockLocationName: piece.StockLocationName,
                            sortOrder: piece.StockLocationSortOrder
                        }
                    },
                        function (grouping) {
                            return grouping
                        },
                        function (stockLocation, pieces) {
                            return {
                                stockLocation: $.extend(stockLocation, {
                                    availableNowTotal: Enumerable.From(pieces).Select(function (x) {
                                        return x.AvailableNowQuantity;
                                    }).Sum(),
                                    bulkTotal: Enumerable.From(pieces).Select(function (x) {
                                        return x.BulkQuantity
                                    }).Sum(),
                                    onReserveTotal: Enumerable.From(pieces).Select(function (x) {
                                        return x.OnReserveQuantity;
                                    }).Sum(),
                                    waitingTotal: Enumerable.From(pieces).Select(function (x) {
                                        return x.WaitingToBePutAwayQuantity;
                                    }).Sum(),
                                    ringFencedTotal: Enumerable.From(pieces).Select(function (x) {
                                        return x.OtherCustomerRingFencedQuantity;
                                    }).Sum(),
                                    dueInTotal: Enumerable.From(pieces).Select(function (x) {
                                        return x.DueInQuantity;
                                    }).Sum(),
                                    units: item.Units
                                }),
                                batches: Enumerable.From(pieces).GroupBy(function (batch) {
                                    return {
                                        batchNo: batch.Batch,
                                        sortOrder: batch.SortOrder,
                                        batchTotalQuantity: batch.BatchTotalQuantity
                                    }
                                },
                                    function (piece) {
                                        return piece
                                    },
                                    function (batch, pieces) {
                                        return {
                                            batch: batch,
                                            pieces: Enumerable.From(pieces.source).Select(function (x) {
                                                var qp = 1;

                                                return $.extend(x, {
                                                    AvailableNowDisplay: ko.pureComputed(function () {
                                                        if (this.AvailableNowQuantity) {
                                                            return formatNumber(this.AvailableNowQuantity, qp, 'en-GB');
                                                        }
                                                    }, x),
                                                    BulkDisplay: ko.pureComputed(function () {
                                                        if (this.BulkQuantity) {
                                                            return formatNumber(this.BulkQuantity, qp, 'en-GB');
                                                        }
                                                    }, x),
                                                    WaitingDisplay: ko.pureComputed(function () {
                                                        if (this.WaitingToBePutAwayQuantity) {
                                                            return formatNumber(this.WaitingToBePutAwayQuantity, qp, 'en-GB');
                                                        }
                                                    }, x),
                                                    OnReserveDisplay: ko.pureComputed(function () {
                                                        if (this.OnReserveQuantity) {
                                                            return formatNumber(this.OnReserveQuantity, qp, 'en-GB');
                                                        }
                                                    }, x),
                                                    RingFencedDisplay: ko.pureComputed(function () {
                                                        if (this.OtherCustomerRingFencedQuantity) {
                                                            return formatNumber(this.OtherCustomerRingFencedQuantity, qp, 'en-GB');
                                                        }
                                                    }, x),
                                                    TotalDisplay: ko.pureComputed(function () {
                                                        if (((this.AvailableNowQuantity + this.OnReserveQuantity + this.OtherCustomerRingFencedQuantity + this.BulkQuantity) > 0) && self.stockInfoProducts().length) {
                                                            return formatNumber(this.AvailableNowQuantity + this.OnReserveQuantity + this.OtherCustomerRingFencedQuantity + this.BulkQuantity, qp, 'en-GB');
                                                        }
                                                    }, x),
                                                    DueInDisplay: ko.pureComputed(function () {
                                                        var result = '';
                                                        if (this.DueInQuantity && self.stockInfoProducts().length) {
                                                            result = formatNumber(this.DueInQuantity, qp, 'en-GB');
                                                        }
                                                        if (this.DueInMessage) {
                                                            if (result == '')
                                                                result = this.DueInMessage
                                                            else
                                                                result = result + ' - ' + this.DueInMessage
                                                        }
                                                        if (this.DueInDate) {
                                                            if (result == '')
                                                                result = moment(this.DueInDate).format('DD/MM/YYYY');
                                                            else
                                                                result = result + ' due ' + moment(this.DueInDate).format('DD/MM/YYYY');
                                                        }
                                                        return result;
                                                    }, x)
                                                });
                                            }).OrderBy(function (x) {
                                                return x.SortOrder;
                                            }).ToArray()
                                        }
                                    }, function (batch) {
                                        return batch.batchNo
                                    }).OrderBy(function (batch) {
                                        return batch.sortOrder
                                    }).ToArray()
                            }
                        },
                        function (stockLocation) {
                            return stockLocation.stockLocationCode
                        }).OrderBy(function (grouping) {
                            return grouping.stockLocation.sortOrder;
                        }).ToArray();

                    ko.utils.arrayForEach(processed, function (item) {
                        item.stockLocation.totalQuantity = ko.pureComputed(function () {
                            return (this.availableNowTotal + this.bulkTotal + this.onReserveTotal + this.waitingTotal);
                        }, item.stockLocation);

                        item.stockLocation.totalIncludingDue = ko.pureComputed(function () {
                            return (this.availableNowTotal + this.bulkTotal + this.dueInTotal + this.onReserveTotal + this.waitingTotal);
                        }, item.stockLocation);

                    });

                    item.supplierAvailabilityMessage(Enumerable.From(data.availabilityMessages).Where(function (y) {
                        return y.ProductID == item.ProductID
                    }).Select(function (y) {
                        return y.SupplierAvailabilityMessage;
                    }).SingleOrDefault());

                    item.stockInfo(processed);
                });

                self.stockInfoBusy(false);

            },
            error: function (xhr, textStatus, errorThrown) {
                self.stockInfoBusy(false);
            }
        })
    }

    self.loadLargeImage = function (result) {
        if (result.ImageID != null) {
            $('#large-image-container').html('');
            var url = 'https://www.designersguild.com/image/488/' + result.ImageID;
            $('#large-image-container').html('<img src="' + url + '"/>');
            $('#large-image-title').text(result.Code);
            $("#image-modal").modal('show');
        } else {
            $('#large-image-container').html('');
            $('#large-image-container').html('<img src="/content/images/not-found-large.png"/>');
            $('#large-image-title').text(result.Code);
            $("#image-modal").modal('show');
        }
    }

    //self.basketAfterRender = ko.pureComputed({
    //    write: function () {
    //        console.log('basketAfterRender write called', self.basket().length);
    //        if ($("#basket-table").children('tbody').length == self.basket().length) {
    //            $("button[data-tooltip='tooltip']").tooltip();
    //            self.basket().forEach(function (item) {
    //                item.LineRef.extend({
    //                    charsRemaining: {
    //                        maxLength: 25,
    //                        elementId: '#' + item.Code.replace(/\//g, '-') + '-line-ref-input'
    //                    }
    //                });
    //            });
    //        }
    //    },
    //     read: function () {
    //         console.log('basketAfterRender read called', self.basket().length);
    //         if ($("#basket-table").children('tbody').length == self.basket().length) {
    //             $("button[data-tooltip='tooltip']").tooltip();
    //             self.basket().forEach(function (item) {
    //                 item.LineRef.extend({
    //                     charsRemaining: {
    //                         maxLength: 25,
    //                         elementId: '#' + item.Code.replace(/\//g, '-') + '-line-ref-input'
    //                     }
    //                 });
    //             });
    //         }
    //     }
    //}, self).extend({
    //    rateLimit: {
    //        timeout: 100,
    //        method: 'notifyWhenChangesStop'
    //    }
    //});

    self.removeCodeFromBasket = function (code) {
        if (code) {
            self.basket.remove(function (item) {
                return item.Code == code;
            });
        }
    };

    self.increaseCuttingCodeInBasket = function (item) {
        //console.log('increaseCuttingCodeInBasket called', item)
        if (item) {
            var extant = Enumerable.From(self.basket()).Where(function (x) {
                if (x.Code == item.CuttingCode)
                    return x;
            }).FirstOrDefault(null)

            if (extant == null) {
                self.basket.push(sampleBasketItem({
                    item: item,
                    code: item.CuttingCode,
                    price: item.CuttingPrice,
                    stock: item.CStock
                }));
            } else {
                extant.Quantity(extant.Quantity() + 1);
            }
        }
    };

    self.decreaseCuttingCodeInBasket = function (item) {
        if (item) {
            var toDecrease = Enumerable.From(self.basket()).Where(function (x) {
                if (x.Code == item.CuttingCode)
                    return x;
            }).FirstOrDefault(null)
            if (toDecrease) {
                if (toDecrease.Quantity() > 1) {
                    toDecrease.Quantity(toDecrease.Quantity() - 1);
                } else {
                    self.basket.remove(toDecrease);
                }
            }
        }
    };

    self.increaseReturnableCodeInBasket = function (item) {
        //console.log('increaseReturnableCodeInBasket called', item)
        if (item) {
            var extant = Enumerable.From(self.basket()).Where(function (x) {
                if (x.Code == item.ReturnableCode)
                    return x;
            }).FirstOrDefault(null)

            if (extant == null) {
                self.basket.push(sampleBasketItem({
                    item: item,
                    code: item.ReturnableCode,
                    price: item.ReturnablePrice,
                    stock: item.RStock
                }));
            } else {
                extant.Quantity(extant.Quantity() + 1);
            }
        }
    };

    self.decreaseReturnableCodeInBasket = function (item) {
        if (item) {
            var toDecrease = Enumerable.From(self.basket()).Where(function (x) {
                if (x.Code == item.ReturnableCode)
                    return x;
            }).FirstOrDefault(null)
            if (toDecrease) {
                if (toDecrease.Quantity() > 1) {
                    toDecrease.Quantity(toDecrease.Quantity() - 1);
                } else {
                    self.basket.remove(toDecrease);
                }
            }
        }
    };

    self.addAllCuttingsToBasket = function () {
        self.productResultsList().forEach(function (item) {
            if (item.CuttingCode != null && item.CuttingPrice != null)
                self.increaseCuttingCodeInBasket(item);
        });
    };

    self.removeAllCuttingsFromBasket = function () {
        self.productResultsList().forEach(function (item) {
            self.decreaseCuttingCodeInBasket(item);
        });
    };

    self.addAllReturnablesToBasket = function () {
        self.productResultsList().forEach(function (item) {
            if (item.ReturnableCode != null && item.ReturnablePrice != null)
                self.increaseReturnableCodeInBasket(item);
        });
    };

    self.removeAllReturnablesFromBasket = function () {
        self.productResultsList().forEach(function (item) {
            self.decreaseReturnableCodeInBasket(item);
        });
    };

    self.cuttingTotalQuantity = ko.computed({
        read: function () {
            return Enumerable.From(self.basket()).Where(function (x) {
                if (x.Type == 'C')
                    return x;
            }).ToArray().length;
        },
        write: function () {

        },
        owner: self
    }, self)

    self.cuttingTotalPrice = ko.computed({
        read: function () {
            var result = Enumerable.From(self.basket()).Where(function (x) {
                if (x.Type == 'C')
                    return x;
            }).Select("Number($.Price())").Sum();

            return result;
        },
        write: function () {

        },
        owner: self
    }, self);

    self.returnableTotalQuantity = ko.computed({
        read: function () {
            return Enumerable.From(self.basket()).Where(function (x) {
                if (x.Type == 'R')
                    return x;
            }).ToArray().length;
        },
        write: function () {

        },
        owner: self
    }, self)

    self.returnableTotalPrice = ko.computed({
        read: function () {
            return Enumerable.From(self.basket()).Where(function (x) {
                if (x.Type == 'R')
                    return x;
            }).Select("Number($.Price())").Sum().toFixed(2);
        },
        write: function () {

        },
        owner: self
    }, self);

    self.totalQuantity = ko.pureComputed({
        read: function () {
            return Number(self.cuttingTotalQuantity()) + Number(self.returnableTotalQuantity());
        },
        write: function () {

        },
        owner: self
    }, self);

    self.totalPrice = ko.pureComputed({
        read: function () {
            var result = Enumerable.From(self.basket()).Select("Number($.Price() * $.Quantity())").Sum();
            if (self.deliverySelector().despatchPrice())
                result += self.deliverySelector().despatchPrice();
            return result;
        },
        write: function () {

        },
        owner: self
    }, self);

    self.deliverySelectorParams = {
        boundTo: self.deliverySelector,
        account: self.account,
        address: self.address,
        addressBook: self.secondaryAddresses,
        orderValue: self.totalPrice,
        defaultDespatch: defaultDespatch
    };

    self.placeOrderBusy = ko.observable(false);

    self.placeOrder = function () {

        if (self.deliverySelector().errors().length) {
            self.deliverySelector().errors.showAllMessages(true);
            if (!$("#despatch-collapse").hasClass('in'))
                $("#despatch-display-label").trigger('click');
            return;
        }

        //if (!self.orderTaker.isValid()) {
        //    if ($("#account-collapse").hasClass("in")) { }
        //    else {
        //        $("#account-name-label").trigger("click");
        //    }
        //    ko.validation.validateObservable(self.orderTaker);
        //}

        //if (!self.customerOrderReference.isValid()) {
        //    if ($("#account-collapse").hasClass("in")) { }
        //    else {
        //        $("#account-name-label").trigger("click");
        //    }
        //    ko.validation.validateObservable(self.customerOrderReference);
        //    return;
        //}

        if (self.errorGroup().length > 0) {
            if ($("#account-collapse").hasClass("in")) { }
            else {
                $("#account-name-label").trigger("click");
            }
            self.errorGroup.showAllMessages(true);
            return;
        }

        if (self.customerWantsOrderConfirmation() && (self.account().Email() == "" || self.account().Email() == null)) {
            $("#basket-modal").modal("hide");
            if ($("#account-collapse").hasClass("in")) { }
            else {
                $("#account-collapse").collapse("show");
            }
            ko.validation.validateObservable(self.account().Email);
            return;
        }

        var orderValueConfirmationRequired = false;

        if (self.totalPrice() > 0) {
            orderValueConfirmationRequired = true;
        }

        var basket = [];

        self.basket().forEach(function (item) {
            basket.push({
                Code: item.Code,
                QuantityTotal: item.Quantity(),
                LineRef: item.LineRef(),
                Status: item.Status,// "D" ? true : false
                UnitPrice: item.Price()
            });
        });

        var customerPayingForDespatch = null;
        switch (self.deliverySelector().standardOrExpress()) {
            case 'standard':
                customerPayingForDespatch = self.deliverySelector().payingForStandard()
                break;
            case 'express':
                customerPayingForDespatch = self.deliverySelector().payingForExpress()
                break;
            default:
                break;
        }

        var objOrder = {
            TradeAccountCode: self.account().Code,
            Email: self.email(),
            //Phone: self.phone(), // not for this version
            //ContactPreference: , // not for this version
            DespatchPrice: self.deliverySelector().despatchPrice(),
            CustomerPayingForDespatch: customerPayingForDespatch,
            FreeDespatchReason: self.deliverySelector().freeDeliveryReason(),
            SendConfirmationEmail: self.customerWantsOrderConfirmation(),
            Address: {
                Name: self.address().Name,
                AddressLine1: self.address().AddressLine1(),
                AddressLine2: self.address().AddressLine2(),
                AddressLine3: self.address().AddressLine3(),
                AddressLine4: self.address().AddressLine4(),
                Postcode: self.address().Postcode(),
                Country: {
                    CountryID: self.address().CountryID(),
                    Name: self.address().Country().Name
                }
            },
            SelectedDespatchMethod: {
                HAULCODE: self.deliverySelector().selectedHaulier().HAULCODE,
                CARRCODE: self.deliverySelector().selectedCarriageService().CARRCODE
            },
            CustomerOrderReference: self.customerOrderReference(),
            SelectedOrderConfirmationLanguage: self.account().DefaultOrderConfirmationLanguage,
            Basket: basket,
            OrderTaker: {
                Code: self.orderTaker() ? self.orderTaker().Code : null
            },
            ExtraConfirmationText: self.extraConfirmationText(),
            OrderValue: self.totalPrice(),
            UPSAccountNumber: self.deliverySelector().upsAccountNumber(),
            DHLAccountNumber: self.deliverySelector().dhlAccountNumber(),
            DeliveryType: self.deliverySelector().deliveryType().Code,
            ChargeTaxesToCustomerHaulier: self.deliverySelector().chargeTaxesToCustomerHaulierAccount(),
            TradeAccountVATNumber: self.account().tradeAccountVATNumber()
        };

        if (self.address().DeliveryReference()) {
            objOrder.Address.DeliveryReference = self.address().DeliveryReference();
        }

        if (orderValueConfirmationRequired == false) {

            self.placeOrderBusy(true);

            if (self.currentlyUsingBasket() == null) {
                $.confirm('Would you like to store this basket for reuse?', 'You can reused stored baskets from the Previous Baskets tab.', function () {
                    self.storeBasket();
                    self.performPlaceOrder(objOrder);
                }, function () {
                    self.performPlaceOrder(objOrder);
                });
            } else {
                self.performPlaceOrder(objOrder);
            }
        }
        else {

            $.confirm(
                'Non-Zero Order Value',
                'This order will be charged to <b>' + self.account().Code + '</b> at <b>' + formatCurrency(self.totalPrice(), 2, self.account().CurrencyCulture, self.account().CurrencyCode) + ' (ex. VAT)</b>.<br/>Are you sure you want to place this order?',
                function () {
                    window.setTimeout(function () {
                        if (self.currentlyUsingBasket() == null) {
                            $.confirm('Would you like to store this basket for reuse?', 'You can reused stored baskets from the Previous Baskets tab.', function () {
                                self.storeBasket();
                                self.performPlaceOrder(objOrder);
                            }, function () {
                                self.performPlaceOrder(objOrder);
                            });
                        } else {
                            self.performPlaceOrder(objOrder);
                        }
                    }, 500);
                },
                null);
        }
    }

    self.performPlaceOrder = function (objOrder) {
        if (objOrder == null) {
            $.error('Whoops!');
        } else {
            $.ajax({
                url: '/api/SampleRequestAPI/PlaceTradeAccountSampleOrder',
                type: 'POST',
                dataType: 'json',
                cache: false,
                data: objOrder,
                success: function (data) {

                    self.placeOrderBusy(false);

                    $("#success-modal").modal('show');

                    self.reset();

                    if ($("#account-collapse").hasClass("in")) { }
                    else {
                        $("#account-name-label").trigger("click");
                    }

                    $("#basket-modal").modal('hide');

                    window.setTimeout(function () {
                        $("#new-order-number").text(data.message);
                    }, 0);
                },
                error: function (xhr, e, s) {

                    self.placeOrderBusy(false);

                    $("#failure-status").text('Order Not Placed');
                    $("#failure-modal-error-text").text(s);
                    $("#failure-title").text('Error');
                    var $frame = $('<iframe>');
                    $("#failure-modal-iframe-wrapper").html($frame);
                    setTimeout(function () {
                        var doc = $frame[0].contentWindow.document;
                        var $body = $('body', doc);
                        $body.html(xhr.responseText);
                    }, 1);

                    $("#failure-modal").modal('show');
                }
            });
        }
    }

    self.resultGridWidget = ko.observable();

    self.imageColumnTemplate = function (rec) {
        if (rec.ImageID)
            return '<img class="thumb" data-bind="click: viewModel.loadLargeImage, attr: { src: \'https://www.designersguild.com/image/32/\' + ImageID, title: Code + \' - Product ID: \' + ProductID + \' Sample Product ID: \' + CuttingProductID + \' Returnable Product ID: \' + ReturnableProductID }">';
        else
            return '';
    }

    self.findSimilarTemplate = function (rec) {
        return '<i class="material-icons" title="Find Similar" style="cursor: pointer;" data-bind="click: function() { viewModel.slicers.findSimilar($data) }">&#xE14D;</i>';
    }

    self.codeTemplate = function (rec) {
        if (rec.ProductPageID)
            return '<a class="code-display" data-bind="text: Code, attr: { href: \'https://www.designersguild.com/uk/p\' + ProductPageID, target: \'_blank\'}"></a>';
        else
            return '<span class="code-display" data-bind="text: Code"></span>';
    }

    self.statusTemplate = function (rec) {
        return '<span data-bind="text: Status, attr: { title: viewModel.statusTitle(Status)}"></span>';
    }

    self.stockTemplate = function (rec) {
        if (rec.Status != 'D') {
            return '<span data-bind="text: FreeStock"></span><a href="javascript:;" class="stock-link" data-bind="text: StockStatus, click: function() { viewModel.showStockInfo($data); }"></a>'
        } else {
            return '';
        }
    }

    self.listPriceTemplate = function (rec) {
        return '<a href="javascript:;" data-bind="text: ListPrice, click: function() { viewModel.loadSpecialPriceAgreements($data); }"></a>'
    }

    self.cuttingQuantityTemplate = function (rec) {
        if (rec.CuttingCode != null && rec.CuttingPrice != null)
            return '<span class="quantity" data-bind="text: cuttingQuantityInBasket"></span>';
        else
            return '';
    }

    self.returnableQuantityTemplate = function (rec) {
        if (rec.ReturnableCode != null && rec.ReturnablePrice != null)
            return '<span class="quantity" data-bind="text: returnableQuantityInBasket"></span>';
        else
            return '';
    }

    self.cuttingAddHeaderTemplate = function (rec) {
        return '<button class="btn btn-default btn-sm" data-bind="click: function() { viewModel.addAllCuttingsToBasket() }">\
                    <span class="glyphicon glyphicon-plus"></span>\
                </button>';
    }

    self.cuttingSubtractHeaderTemplate = function (rec) {
        return '<button class="btn btn-default btn-sm" data-bind="click: function() { viewModel.removeAllCuttingsFromBasket() }">\
                    <span class="glyphicon glyphicon-minus"></span>\
                </button>';
    }

    self.cuttingAddTemplate = function (rec) {
        if (rec.CuttingCode != null && rec.CuttingPrice != null)
            return '<button class="btn btn-default btn-sm" data-bind="click: function() { viewModel.increaseCuttingCodeInBasket($data) }" title="Add">\
                        <span class="glyphicon glyphicon-plus"></span>\
                    </button>';
        else
            return '';
    }

    self.cuttingSubtractTemplate = function (rec) {
        if (rec.CuttingCode != null && rec.CuttingPrice != null)
            return '<button class="btn btn-default btn-sm" data-bind="click: function() { viewModel.decreaseCuttingCodeInBasket($data) }" title="Remove">\
                        <span class="glyphicon glyphicon-minus"></span>\
                    </button>';
        else
            return '';
    }

    self.returnableAddHeaderTemplate = function (rec) {
        return '<button class="btn btn-default btn-sm" data-bind="click: function() { viewModel.addAllReturnablesToBasket() }">\
                    <span class="glyphicon glyphicon-plus"></span>\
                </button>';
    }

    self.returnableSubtractHeaderTemplate = function (rec) {
        return '<button class="btn btn-default btn-sm" data-bind="click: function() { viewModel.removeAllReturnablesFromBasket() }">\
                    <span class="glyphicon glyphicon-minus"></span>\
                </button>';
    }

    self.returnableAddTemplate = function (rec) {
        if (rec.ReturnableCode != null && rec.ReturnablePrice != null)
            return '<button class="btn btn-default btn-sm" data-bind="click: function() { viewModel.increaseReturnableCodeInBasket($data) }" title="Add">\
                        <span class="glyphicon glyphicon-plus"></span>\
                    </button>';
        else
            return '';
    }

    self.returnableSubtractTemplate = function (rec) {
        if (rec.ReturnableCode != null && rec.ReturnablePrice != null)
            return '<button class="btn btn-default btn-sm" data-bind="click: function() { viewModel.decreaseReturnableCodeInBasket($data) }" title="Remove">\
                        <span class="glyphicon glyphicon-minus"></span>\
                    </button>';
        else
            return '';
    }

    self.resultGridColumns = [
        {
            field: 'ImageID',
            title: ' ',
            width: 42,
            filterable: false,
            sortable: false,
            template: self.imageColumnTemplate,
            attributes: {
                "class": "image-cell"
            }
        },
        {
            field: 'FindSimilar',
            title: ' ',
            width: 35,
            filterable: false,
            sortable: false,
            template: self.findSimilarTemplate
        },
        {
            field: 'Code',
            title: 'Code',
            width: 92,
            filterable: false,
            template: self.codeTemplate
        },
        {
            field: 'Status',
            title: 'Status',
            width: 46,
            filterable: false,
            template: self.statusTemplate
        },
        {
            field: 'FreeStockValue',
            title: 'Stock',
            width: 45,
            filterable: false,
            template: self.stockTemplate,
            attributes: {
                "class": "text-center"
            }
        },
        {
            field: 'Name',
            title: 'Name',
            width: 64,
            filterable: false
        },
        {
            field: 'RRPValue',
            title: 'RRP',
            width: 55,
            template: '#: RRP ? RRP : \'\' #',
            filterable: false
        },
        {
            field: 'ListPriceValue',
            title: 'List Price',
            width: 49,
            filterable: false,
            template: self.listPriceTemplate
        },
        {
            title: 'Cutting',
            columns: [
                {
                    field: 'CuttingStatus',
                    title: 'Status',
                    width: 46,
                    filterable: false
                },
                {
                    field: 'CStock',
                    title: 'Stock',
                    width: 42,
                    filterable: false,
                    sortable: true
                },
                {
                    field: 'CuttingPrice',
                    title: 'Price',
                    width: 39,
                    filterable: false,
                    sortable: true
                },
                {
                    field: 'cuttingQuantityInBasket',
                    title: 'Qty',
                    width: 31,
                    filterable: false,
                    template: self.cuttingQuantityTemplate
                }
            ]
        },
        {
            title: ' ',
            template: self.cuttingAddTemplate,
            headerAttributes: {
                class: 'text-center'
            },
            headerTemplate: self.cuttingAddHeaderTemplate,
            width: 45
        },
        {
            title: ' ',
            template: self.cuttingSubtractTemplate,
            headerAttributes: {
                class: 'text-center'
            },
            headerTemplate: self.cuttingSubtractHeaderTemplate,
            width: 45
        },
        {
            title: 'Returnable',
            columns: [
                {
                    field: 'ReturnableStatus',
                    title: 'Status',
                    width: 46,
                    filterable: false
                },
                {
                    field: 'RStock',
                    title: 'Stock',
                    width: 42,
                    filterable: false
                },
                {
                    field: 'ReturnablePrice',
                    title: 'Price',
                    width: 39,
                    filterable: false
                },
                {
                    field: 'returnableQuantityInBasket',
                    title: 'Qty',
                    width: 31,
                    filterable: false,
                    template: self.returnableQuantityTemplate
                }
            ]
        },
        {
            title: ' ',
            template: self.returnableAddTemplate,
            headerAttributes: {
                class: 'text-center'
            },
            headerTemplate: self.returnableAddHeaderTemplate,
            width: 45
        },
        {
            title: ' ',
            template: self.returnableSubtractTemplate,
            headerAttributes: {
                class: 'text-center'
            },
            headerTemplate: self.returnableSubtractHeaderTemplate,
            width: 45
        }
    ];

    self.resultGridSettings = {
        autoBind: false,
        widget: self.resultGridWidget,
        columns: self.resultGridColumns,
        data: self.productResults,
        useKOTemplates: true,
        rowTemplate: 'search-result-template',
        sortable: true,
        filterable: true,
        reorderable: true,
        grouping: false,
        //scrollable: false,
        serverGrouping: false,
        pageable: false,
        dataBound: function (e) {
            var header = e.sender.thead[0];
            ko.cleanNode(header);
            ko.applyBindings(self, header);
        },
        //dataBinding: function (e) {
        //    // necessary to call the ko.cleanNode function, as we have called ko.applyBindings to a 
        //    // collection of rows which are about to be removed.
        //    // ko.cleanNode is intended to be internal and is not documented. Ugh.
        //    $("#result-grid tbody tr").each(function (idx, ele) {
        //        ko.cleanNode(ele);
        //    });
        //},
        //dataBound: function (e) {
        //    for (var i = 0; i < self.resultGridWidget().dataSource.view().length; i++) {
        //        var rec = self.resultGridWidget().dataSource.view()[i];

        //        var bindTo = Enumerable.From(self.productResults()).Where("$.Code == '" + rec.Code + "'").Single();

        //        ko.applyBindings(bindTo, $("#result-grid tbody tr")[i]);
        //    }
        //},
        filterMenuInit: function (e) {
            //console.log(e);
            //if (e.field == "Status") {
            //    e.container.find(".k-filter-help-text").hide();
            //    var firstValueDropDown = e.container.find("select:eq(0)").data("kendoDropDownList");
            //    setTimeout(function () {
            //        firstValueDropDown.wrapper.hide();
            //    });
            //}
        }
    };

    self.slicers = new sampleSlicersViewModel(self);

    self.loadSpecialPriceAgreements = function (product) {
        $("#spa-title").text(product.Name + ' - Special Price Agreements');
        $("#spa-container").empty();
        $("#spa-modal").modal('show');
        self.spaInfoBusy(true);
        var data = {
            ProductID: product.ProductID,
            TradeAccountID: self.account().TradeAccountID,
            Quantity: null
        };
        //console.log('loadSpecialPriceAgreements called with', data);
        $.ajax({
            url: '/api/OrderProducts/GetSpecialPriceInfo',
            type: 'GET',
            dataType: 'json',
            data: data,
            success: function (data) {
                self.spaInfoBusy(false);
                //console.log('loadSpecialPriceAgreements returned', data);
                //$("#spa-container").text(ko.toJSON(data));

                if (data) {

                    var headingTable = $("<table class='stock-table table table-bordered table-striped'></table>");
                    headingTable.append("<thead><tr><th>Account: <span style='font-weight: normal'>" + self.account().Code + "</span></th></tr><tr><th>Product: <span style='font-weight: normal'>" + product.Code + ' - ' + product.Name + "</span></th></tr></thead>");

                    var contractPricesCore = $("<table class='stock-table table table-bordered'></table>");

                    if (data.TradeContractPrices != null) {
                        if (data.TradeContractPrices.length) {

                            contractPricesCore.append("<thead><tr><th colspan='4'>Trade Contract Prices</th></tr></thead><tbody><tr><th>Quantity Break</th><th>On Date</th><th>Off Date</th><th class='total-heading'>Price</th></tr></tbody>");

                            for (var i in data.TradeContractPrices) {
                                var tcp = data.TradeContractPrices[i];

                                contractPricesCore.append("<tr><td>" + tcp.QuantityBreak + "</td>" +
                                    "<td>" + renderDate(tcp.OnDate) + "</td>" +
                                    "<td>" + renderDate(tcp.OffDate) + "</td>" +
                                    "<td>" + formatCurrency(tcp.Price, 2, 'en-GB', 'GBP') + "</td>" +
                                    "</tr>");
                            }
                        } else {
                            contractPricesCore.append("<tbody><tr><th colspan='4'>No Trade Contract Prices</th></tr></tbody>");
                        }
                    } else {
                        contractPricesCore.append("<tbody><tr><th colspan='4'>No Trade Contract Prices</th></tr></tbody>");
                    }

                    var contractDiscountsCore = $("<table class='stock-table table table-bordered'></table>");

                    if (data.TradeContractDiscounts != null) {
                        if (data.TradeContractDiscounts.length) {

                            contractDiscountsCore.append("<thead><tr><th colspan='4'>Trade Contract Discounts</th></tr></thead><tbody><tr><th>Quantity Break</th><th>On Date</th><th>Off Date</th><th class='total-heading'>Discount</th></tr></tbody>");

                            for (var i in data.TradeContractDiscounts) {
                                var tcd = data.TradeContractDiscounts[i];

                                contractDiscountsCore.append("<tr><td>" + tcd.QuantityBreak + "</td>" +
                                    "<td>" + renderDate(tcd.OnDate) + "</td>" +
                                    "<td>" + renderDate(tcd.OffDate) + "</td>" +
                                    "<td>" + formatPercentage(tcd.Discount / 100, 2) + "</td>" +
                                    "</tr>");
                            }
                        } else {
                            contractDiscountsCore.append("<tbody><tr><th colspan='4'>No Trade Contract Discounts</th></tr></tbody>");
                        }
                    } else {
                        contractDiscountsCore.append("<tbody><tr><th colspan='4'>No Trade Contract Discounts</th></tr></tbody>");
                    }

                    $('#spa-container').append(headingTable);
                    $('#spa-container').append(contractPricesCore);
                    $('#spa-container').append(contractDiscountsCore);
                    $('#spa-modal').modal('handleUpdate');
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                self.spaInfoBusy(false);
            }
        });
    }

    initProductCodeAutocomplete();
}

var viewModel = null;

$("#despatch-collapse").on('shown.bs.collapse', function () {
    if ($("#despatch-select-button").length)
        window.setTimeout(function () {
            $("#despatch-select-button").focus();
        }, 0);
    else window.setTimeout(function () {
        $("#despatch-code").focus();
    }, 0);
});

$("#product-collapse").on('shown.bs.collapse', function () {
    window.setTimeout(function () {
        $("#product-code").focus();
    }, 0);
});

function selectFoundAddress(data) {

    var unlabelled = Enumerable.From(data).Where(function (x) {
        if (x.label == "")
            return x;
    }).ToArray();

    if (unlabelled.length > 0) {
        viewModel.customAddress().AddressLine1(data[0].data);
    }
    if (unlabelled.length > 1) {
        viewModel.customAddress().AddressLine2(data[1].data);
    }

    var town = Enumerable.From(data).Where(function (x) {
        if (x.label == "Town" || x.label == "City name")
            return x
    }).Select(function (x) {
        return x.data;
    }).FirstOrDefault()

    if (town) {
        viewModel.customAddress().AddressLine3(town);
    }

    var county = Enumerable.From(data).Where(function (x) {
        if (x.label == "County" || x.label == "State code")
            return x;
    }).Select(function (x) {
        return x.data;
    }).FirstOrDefault();

    if (county)
        viewModel.customAddress().AddressLine4(county);

    var postcode = Enumerable.From(data).Where(function (x) {
        if (x.label == "Postcode")
            return x;
    }).Select(function (x) {
        return x.data;
    }).FirstOrDefault();

    if (postcode) {
        viewModel.customAddress().Postcode(postcode);
    } else {
        viewModel.customAddress().Postcode(data[5].data)
    }
}

function fireTestConfiguration() {

    $("#account-number").val('K0099');

    var downKeyEvent = $.Event("keydown");
    downKeyEvent.keyCode = $.ui.keyCode.DOWN;  // event for pressing "down" key

    var enterKeyEvent = $.Event("keydown");
    enterKeyEvent.keyCode = $.ui.keyCode.ENTER;  // event for pressing "enter" key

    $("#account-number").trigger(downKeyEvent);  // First downkey invokes search

    window.setTimeout(function () {
        //$("#account-number").trigger(downKeyEvent);  // Second downkey highlights first item
        $("#account-number").trigger(enterKeyEvent); // Enter key selects highlighted item

        window.setTimeout(function () {

            viewModel.customerOrderReference('ref');

            $("#account-continue").trigger("click");

            //window.setTimeout(function () {

            //    $("#select-primary-address-btn").trigger("click");

            //    window.setTimeout(function () {
            //        $("#despatch-display-label").trigger("click");

            //        //viewModel.selectDespatchMethod(viewModel.account().defaultDespatch());

            //        window.setTimeout(function () {
            //            $("#product-code").focus();
            //            $("#product-code").val('FDG2345');
            //            $("#product-code").autocomplete('search');
            //        }, 0);

            //    }, 0);

            //}, 1000);

        }, 500);

    }, 500);

}

function initProductCodeAutocomplete() {
    $("#product-code").autocomplete({
        source: function (request, response) {
            if (!viewModel.productSearchBusy()) {
                viewModel.productSearchBusy(true);
                $.ajax({
                    url: "/api/ComponentAPI/ProductCodeAutocompleteSamples",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: {
                        tradePriceListId: viewModel.account().TradePriceListID,
                        term: request.term
                    },
                    success: function (data) {
                        console.log('productCodeAutocomplete returned', data);
                        $("#product-code").removeClass('ui-autocomplete-loading');
                        viewModel.productResults(data);
                        //viewModel.slicerReductionByResults(data);
                        viewModel.productSearchBusy(false);
                        //response(data);
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        viewModel.productSearchBusy(false);
                        $("#product-code").removeClass('ui-autocomplete-loading');
                        //$.showError(xhr, textStatus, errorThrown);
                    }
                });
            }
        },
        delay: 500,
        minLength: 4,
        select: function (event, ui) {
            //console.log(ui.item);
        }
    });


    $("#product-code").keypress(function (e) {
        if (e.which == 13) {
            $("#product-code").autocomplete("search");
        }
    });
    //$("#product-code").on("focusout", function () { $("#product-code").autocomplete("search"); });
}

var sampleSlicersViewModel = function (parent) {
    var self = this;

    self.findSimilar = function (product) {
        console.log('findSimilar called from', product);
        $('a[href="#product-search-advanced"]').tab('show');

        self.slicerCollection.forEach(function (s) {
            if (s.boundTo().valueField != 'LaunchID') {
                // find similar is not to select launch - 04/05/2018
                s.boundTo().widget().select(function (di) {
                    return di[s.valueField] == product[s.valueField];
                });
                s.selectedId(product[s.valueField]);
            }
        });

        self.rrpA(product.RRPValue);
    }

    self.parent = parent;

    self.stockStatusSlicer = ko.observable();
    self.itemTypeSlicer = ko.observable();
    self.productGroupSlicer = ko.observable();
    self.brandSlicer = ko.observable();
    self.colourSlicer = ko.observable();
    self.patternSlicer = ko.observable();
    self.launchSlicer = ko.observable();

    self.availableRRPOperators = [{
        title: 'Less than or Equal to',
        display: '<span class="operator">&le;</span>',
        value: 1
    }, {
        title: 'Equal to',
        display: '<span class="operator">=</span>',
        value: 2
    }, {
        title: 'Between',
        display: '<span class="operator">&#8812;</span>',//'<i>a</i> &le; <i>x</i> &le; <i>b</i>',
        value: 3
    }];

    self.selectedRRPOperator = ko.observable(self.availableRRPOperators[0]);

    self.rrpA = ko.observable().extend({ roundedNumeric: 0 });
    self.rrpB = ko.observable().extend({ roundedNumeric: 0 });

    self.busy = ko.observable();

    self.selectedRRPOperator.subscribe(function (newValue) {
        self.rrpB(undefined);
    });

    self.stockStatusSlicerParams = {
        name: 'Main Product Stock',
        valueField: 'StockStatusID',
        textField: 'Name',
        boundTo: self.stockStatusSlicer,
        selectedId: ko.observable(1),
        endPoint: '/api/samplerequestapi/StockStatusSlicerEndpoint'
    };

    self.itemTypeSlicerParams = {
        name: 'Item Type',
        valueField: 'ItemTypeID',
        textField: 'Name',
        boundTo: self.itemTypeSlicer,
        selectedId: ko.observable(),
        endPoint: '/api/samplerequestapi/ItemTypeSlicerEndpoint'
    };

    self.productGroupSlicerParams = {
        name: 'Product Group',
        valueField: 'ProductGroupID',
        textField: 'Name',
        boundTo: self.productGroupSlicer,
        selectedId: ko.observable(),
        endPoint: '/api/samplerequestapi/ProductGroupSlicerEndpoint'
    };

    self.brandSlicerParams = {
        name: 'Brand',
        valueField: 'BrandID',
        textField: 'Name',
        boundTo: self.brandSlicer,
        selectedId: ko.observable(),
        endPoint: '/api/samplerequestapi/BrandSlicerEndpoint'
    };

    self.colourSlicerParams = {
        name: 'Colour',
        valueField: 'ColourID',
        textField: 'Name',
        boundTo: self.colourSlicer,
        selectedId: ko.observable(),
        endPoint: '/api/samplerequestapi/ColourSlicerEndpoint'
    };

    self.patternSlicerParams = {
        name: 'Pattern',
        valueField: 'PatternID',
        textField: 'Name',
        boundTo: self.patternSlicer,
        selectedId: ko.observable(),
        endPoint: '/api/samplerequestapi/PatternSlicerEndpoint'
    };

    self.launchSlicerParams = {
        name: 'Launch',
        valueField: 'LaunchID',
        textField: 'Name',
        boundTo: self.launchSlicer,
        selectedId: ko.observable(),
        endPoint: '/api/samplerequestapi/LaunchSlicerEndpoint'
    };

    self.slicerCollection = [
        self.productGroupSlicerParams,
        self.itemTypeSlicerParams,
        self.brandSlicerParams,
        self.colourSlicerParams,
        self.patternSlicerParams,
        self.launchSlicerParams,
        self.stockStatusSlicerParams
    ];

    self.clearSlicers = function () {
        $("#product-code").val(undefined);

        self.parent.productResults([]);

        self.rrpA(null);

        self.rrpB(null);

        self.slicerCollection.forEach(function (s) {
            s.boundTo().widget().select('');
            s.selectedId(undefined);
        });

        self.busy(false);

        self.nonce.valueHasMutated();

        self.selectedRRPOperator(self.availableRRPOperators[0]);

        self.stockStatusSlicer().widget().select(function (di) {
            if (di.StockStatusID == 1)
                return di;
        });

        self.stockStatusSlicer().selectedId(1);
        //widget().trigger('change');

        //self.slicerCollection.forEach(function (s) {
        //    s.boundTo().widget().select(function (di) {
        //        return di[s.valueField] == product[s.valueField];
        //    });
        //    s.selectedId(product[s.valueField]);
        //});

    }

    self.stockStatusSlicerParams.slicerCollection = self.slicerCollection;
    self.itemTypeSlicerParams.slicerCollection = self.slicerCollection;
    self.productGroupSlicerParams.slicerCollection = self.slicerCollection;
    self.brandSlicerParams.slicerCollection = self.slicerCollection;
    self.colourSlicerParams.slicerCollection = self.slicerCollection;
    self.patternSlicerParams.slicerCollection = self.slicerCollection;
    self.launchSlicerParams.slicerCollection = self.slicerCollection;

    self.nonce = ko.observable();

    self.foo = ko.computed({
        read: function () {

            var f = self.nonce();

            if (self.stockStatusSlicer() &&
                self.itemTypeSlicer() &&
                self.productGroupSlicer() &&
                self.brandSlicer() &&
                self.colourSlicer() &&
                self.patternSlicer() &&
                self.launchSlicer()) {
                var ids = [];

                self.slicerCollection.forEach(function (p) {
                    ids.push({
                        name: p.name,
                        selectedId: p.selectedId()
                    });
                });

                //console.log('foo was evaluated and found', ids);

                if (self.parent) {

                    //self.parent.productResults([]);

                    var data = {};

                    self.slicerCollection.forEach(function (s) {
                        var value = s.boundTo().selectedId();
                        if (value) {
                            data[s.valueField] = value;
                        }
                    });

                    if ($.isEmptyObject(data)) {
                        $("#product-code").val(null);
                        $("#product-code").removeClass('ui-autocomplete-loading');
                        return;
                    }

                    if (self.parent.account.peek()) {
                        data.tradePriceListId = self.parent.account.peek().TradePriceListID;
                        //data.term = $("#product-code").val();

                        data.rrpA = self.rrpA.peek();
                        data.rrpB = self.rrpB.peek();
                        data.rrpOperatorId = self.selectedRRPOperator.peek().value;

                        //console.log('Fetch ProductIDs was called with', data);

                        $("#product-code").addClass('ui-autocomplete-loading');

                        self.busy(true);

                        $.ajax({
                            url: '/api/samplerequestapi/FetchProductIds',
                            type: 'POST',
                            data: data,
                            success: function (data) {
                                $("#product-code").removeClass('ui-autocomplete-loading');
                                if (data) {
                                    //console.log('Fetch ProductIDs returned', data);
                                    self.parent.productResults(data);
                                }
                                self.busy(false);
                            },
                            error: function (xhr, textStatus, errorThrown) {
                                self.busy(false);
                                $("#product-code").removeClass('ui-autocomplete-loading');
                            }
                        });
                    } else {
                        //console.log('foo evaluated, but account() was not ready');
                    }
                }
            }
            else {
                $("#product-code").removeClass('ui-autocomplete-loading');
                //console.log('foo was evaluated but the slicers were not ready');
            }
        }
    }, self).extend({
        rateLimit: {
            method: 'notifyWhenChangesStop',
            timeout: 50
        }
    });
}