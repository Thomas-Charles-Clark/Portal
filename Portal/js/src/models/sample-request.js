function sampleRequestViewModel() {
    var self = this;

    self.orderFactory = {
        searchWidget: function () {
            return {
                Value: null
            }
        },
        searchWidgetShowSamplingOptionsButton: () => false
    }

    //#region Observables
    self.orderReturnables = ko.observable(getOrderReturnables());

    self.tradeAccountSelector = ko.observable(new tradeAccountSelector());

    self.tradeAccountSelector().selected.subscribe(function (newValue) {
        if (newValue) {
            window.setTimeout(function () {
                self.selectedHaulier(newValue.SampleHAULCODE);
                self.selectedCarriage(newValue.SampleCARRCODE);
                $("#product-search").focus();
            }, 0);

            if (typeof FetchAddresses === 'function')
                FetchAddresses(newValue.Code);

        } else {
            self.selectedHaulier(null);
            self.selectedCarriage(null);

            self.primaryAddress(BlankAddress());
            self.secondaryAddresses([]);
        }
    });

    self.productSearchAutocompleteFunction = function (context) {
        $("#product-search").autocomplete({
            source: function (request, response) {
                if (!context.searchBusy()) {
                    context.searchBusy(true);
                    var tradePriceListId = null;

                    if (typeof viewModel === "object") {
                        if (viewModel.hasOwnProperty("tradeAccountSelector")) {
                            tradePriceListId = viewModel.tradeAccountSelector().selected().TradePriceListID;
                        }
                    }

                    $.ajax({
                        url: '/api/ComponentAPI/ProductCodeAutocompleteSamples',
                        type: "POST",
                        dataType: "json",
                        cache: false,
                        data: {
                            tradePriceListId: tradePriceListId,
                            term: request.term
                        },
                        success: function (data) {
                            // necessary because we've overridden the select function to noop
                            $("#product-search").removeClass('ui-autocomplete-loading');

                            var results = [];

                            context.haveSearched(true);

                            if (data != null) {
                                data.forEach(function (product) {
                                    if (context.showDiscontinued()) {
                                        // you may view discontinued base part numbers in the search results
                                        results.push(new SampleProduct(product));
                                    } else {
                                        if (product.Status === 'D') {
                                            // you may not view discontinued base part numbers in the search results; this base part number is discontinued so you will not see it.
                                        } else {
                                            // this base part number is NOT discontinued. However, both the cutting and returnable part numbers within it may be discontinued.
                                            if (typeof context.orderReturnables === 'function') {
                                                if (context.orderReturnables() == false) {
                                                    // we're not allowing you to see returnables
                                                    if (product.CuttingStatus === 'D' || product.CuttingStatus == null) {
                                                        // cutting is discontinued: do not show the product in the search results (cannot order from it anyway)
                                                    } else {
                                                        // cutting is not discontinued, show it in search results.
                                                        results.push(new SampleProduct(product));
                                                    }
                                                } else {
                                                    // we are allowing you to order both returnables and samples, but not discontinued products
                                                    if ((product.CuttingStatus === 'D' || product.CuttingStatus == null) && (product.ReturnableStatus === 'D' || product.ReturnableStatus == null)) {
                                                        // you're not allowed to view discontinued items, but both cutting and returnable codes for this base part number are discontinued
                                                        // do not display the result.
                                                    } else {
                                                        // either the cutting or returnable or both are non-discontinued, add the product to the search results.
                                                        results.push(new SampleProduct(product));
                                                    }
                                                }
                                            } else {
                                                // we are allowing you to order both returnables and samples, but not discontinued products
                                                if ((product.CuttingStatus === 'D' || product.CuttingStatus == null) && (product.ReturnableStatus === 'D' || product.ReturnableStatus == null)) {
                                                    // you're not allowed to view discontinued items, but both cutting and returnable codes for this base part number are discontinued
                                                    // do not display the result.
                                                } else {
                                                    // either the cutting or returnable or both are non-discontinued, add the product to the search results.
                                                    results.push(new SampleProduct(product));
                                                }
                                            }
                                        }
                                    }
                                });
                            }

                            context.searchResults(results);

                            context.searchBusy(false);
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            context.searchBusy(false);
                            //$.showError(xhr, textStatus, errorThrown);
                        }
                    });
                }
            },
            delay: 750,
            minLength: 3,
            select: function (event, ui) {
                // noop
            }
        });

        $("#product-search").on("keydown", function (e) {
            if (e.which === 13) {
                $("#product-search").autocomplete("search");
            }
        });
    }

    self.productSearch = ko.observable(new productSearch(self.productSearchAutocompleteFunction));

    self.selectedHaulier = ko.observable().extend({
        required: {
            params: true,
            message: 'Please select a haulier'
        }
    });

    self.selectedCarriage = ko.observable().extend({
        required: {
            params: true,
            message: 'Please select a service',
            onlyIf: function () {
                return self.selectedHaulier()
            }
        }
    });

    self.customerPayingForDespatch = ko.observable(false);

    self.primaryAddress = ko.observable(BlankAddress());

    self.secondaryAddresses = ko.observable([]);

    self.maxOrderQuantity = ko.observable(getMaxOrderQuantity());

    self.maxSKUQuantity = ko.observable(getMaxSKUQuantity());

    self.customerWantsOrderConfirmation = ko.observable(false);

    self.ContactPreference = ko.observable(getContactPreference()); // Mandatory, 0 = email, 1 = phone, 2 = do not contact

    self.Email = ko.observable().extend({
        required: {
            params: true,
            message: 'Please provide an email address',
            onlyIf: function () {
                return (self.customerWantsOrderConfirmation()) || (self.ContactPreference() == 0);
            }
        },
        charsRemaining: {
            maxLength: 256,
            elementId: '#email'
        }
    });

    self.Phone = ko.observable().extend({
        required: {
            params: true,
            message: 'Please provide a phone number',
            onlyIf: function () {
                return self.ContactPreference() === 1;
            }
        },
        charsRemaining: {
            maxLength: 30,
            elementId: '#phone'
        }
    });

    self.customerOrderReference = ko.observable().extend({
        charsRemaining: {
            maxLength: 100,
            elementId: '#order-ref'
        }
    });

    self.availableCountries = ko.observable(getAllCountries());

    self.address = ko.observable(BlankAddress(self.availableCountries(), true));

    self.selectedStoredAddress = ko.observable();
    self.selectedStoredAddress.subscribe(function (newValue) {
        if (newValue != null) {
            self.setAddress(newValue);
            self.showAllAddressFields(true);
        }
    });

    self.showAllAddressFields = ko.observable(false);

    self.basket = ko.observableArray([]).extend({
        minLength: {
            params: 1,
            message: 'You must have at least one item in your basket'
        }
    });

    self.availableHauliers = ko.observable(getAllHauliers());

    self.allCarriages = ko.observable(getAllCarriages());

    self.availableLanguages = ko.observable(getAllLanguages());

    self.selectedOrderConfirmationLanguage = ko.observable(1);

    self.productInfoBusy = ko.observable(false);

    self.productStockBusy = ko.observable(false);

    self.alternativeProducts = ko.observable([]);

    self.alternativeProductsBusy = ko.observable(false);

    self.orderTaker = ko.observable(getDefaultOrderTaker());

    self.currentBasketSummary = ko.observable();

    self.placeOrderBusy = ko.observable(false);

    // #endregion

    // #region Computeds

    self.emailRemainingChars = ko.pureComputed({
        read: function () {
            return '(' + (256 - (self.Email() ? self.Email().length : 0)) + ')';
        },
        owner: self
    }, self);

    self.phoneRemainingChars = ko.pureComputed({
        read: function () {
            return '(' + (30 - (self.Phone() ? self.Phone().length : 0)) + ')';
        },
        owner: self
    }, self);

    self.nameRemainingChars = ko.pureComputed({
        read: function () {
            return '(' + (50 - (self.address().Name() ? self.address().Name().length : 0)) + ')';
        },
        owner: self
    }, self);

    self.customerOrderReferenceRemainingChars = ko.pureComputed({
        read: function () {
            return '(' + (100 - (self.customerOrderReference() ? self.customerOrderReference().length : 0)) + ')';
        },
        owner: self
    }, self);

    self.orderTakerLabel = ko.computed({
        read: function () {
            if (self.orderTaker()) {
                return self.orderTaker().Code + (self.orderTaker().Name ? " - " + self.orderTaker().Name : "")
            } else {
                return "Not Set";
            }
        }
    }, self);

    self.address1RemainingChars = ko.pureComputed({
        read: function () {
            return '(' + (60 - (self.address().AddressLine1() ? self.address().AddressLine1().length : 0)) + ')';
        }
    }, self);

    self.address2RemainingChars = ko.pureComputed({
        read: function () {
            return '(' + (60 - (self.address().AddressLine2() ? self.address().AddressLine2().length : 0)) + ')';
        }
    }, self);

    self.address3RemainingChars = ko.pureComputed({
        read: function () {
            return '(' + (50 - (self.address().AddressLine3() ? self.address().AddressLine3().length : 0)) + ')';
        }
    }, self);

    self.address4RemainingChars = ko.pureComputed({
        read: function () {
            return '(' + (40 - (self.address().AddressLine4() ? self.address().AddressLine4().length : 0)) + ')';
        }
    }, self);

    self.postcodeRemainingChars = ko.pureComputed({
        read: function () {
            return '(' + (20 - (self.address().Postcode() ? self.address().Postcode().length : 0)) + ')';
        }
    }, self);

    self.availableCarriages = ko.pureComputed(function () {
        if (self.selectedHaulier()) {
            return Enumerable.From(self.allCarriages()).Where(function (x) {
                if (x.HAULCODE === self.selectedHaulier())
                    return x;
            }).ToArray();
        } else {
            return [];
        }
    }, self);

    self.basketLength = ko.pureComputed(function () {
        return self.basket().length;
    }, self);

    self.basketSummary = ko.computed({
        read: function () {

            var summary = Enumerable.From(self.basket())
                .GroupBy(function (item) { return item.Code; })
                .Select(function (item) {

                    var lineRef = self.customerOrderReference();

                    var existing = Enumerable.From(self.currentBasketSummary())
                        .Where(function (x) {
                            if (x.Code === item.source[0].Code)
                                return x;
                        }).FirstOrDefault(null);

                    var price = 0;

                    if (existing != null) {
                        lineRef = existing.LineRef();
                    }

                    if (item.source.length) {
                        price = Number(item.source[0].Price());
                    }

                    //for (var i = 0; i < item.source.length; i++) {
                    //    price += Number(item.source[i].Price());
                    //}

                    return new BasketSummaryItem(item.source[0].Name, item.source[0].ProductType, item.source[0].ImageID, item.source[0].Code, item.source.length, lineRef, item.source[0].Status, price.toFixed(2));
                })
                .OrderBy(function (item) { return item.Code; })
                .ToArray();

            self.currentBasketSummary(summary);

            return summary;
        },
        owner: self
    }, self);

    self.cuttingTotalQuantity = ko.computed({
        read: function () {
            return Enumerable.From(self.basket()).Where(function (x) {
                if (x.Type === 'C')
                    return x;
            }).ToArray().length;
        },
        owner: self
    }, self);

    self.cuttingTotalPrice = ko.computed({
        read: function () {
            return Enumerable.From(self.basket()).Where(function (x) {
                if (x.Type === 'C')
                    return x;
            }).Select("Number($.Price())").Sum().toFixed(2);
        },
        owner: self
    }, self);

    self.returnableTotalQuantity = ko.computed({
        read: function () {
            return Enumerable.From(self.basket()).Where(function (x) {
                if (x.Type === 'R')
                    return x;
            }).ToArray().length;
        },
        owner: self
    }, self);

    self.returnableTotalPrice = ko.computed({
        read: function () {
            return Enumerable.From(self.basket()).Where(function (x) {
                if (x.Type === 'R')
                    return x;
            }).Select("Number($.Price())").Sum().toFixed(2);
        },
        owner: self
    }, self);

    self.totalQuantity = ko.pureComputed({
        read: function () {
            return Number(self.cuttingTotalQuantity()) + Number(self.returnableTotalQuantity());
        },
        owner: self
    }, self);

    self.totalPrice = ko.pureComputed({
        read: function () {
            return Enumerable.From(self.currentBasketSummary()).Where(function (x) { return x; }).Select("Number($.Price())").Sum().toFixed(2);
        },
        owner: self
    }, self);

    // #endregion

    // #region Submit Function

    self.placeOrder = function () {
        if (self.errors().length > 0) {
            self.errors.showAllMessages();
            window.scrollTo(0, 0);
        }
        else {
            self.placeOrderBusy(true);
            if (self.selectedHaulier() && self.selectedCarriage()) {
                self.selectedDespatchMethod = new DespatchMethod({
                    'HAULCODE': self.selectedHaulier(),
                    'CARRCODE': self.selectedCarriage()
                });
            }

            var objOrder = {
                TradeAccountCode: self.tradeAccountSelector().selected().Code,
                Email: self.Email(),
                Phone: self.Phone(),
                ContactPreference: self.ContactPreference(),
                DespatchPrice: 0,
                FreeDespatchReason: 'JOHN LEWIS SAMPLES',
                SendConfirmationEmail: self.customerWantsOrderConfirmation(),
                Address: {
                    Name: self.address().Name,
                    AddressLine1: self.address().AddressLine1(),
                    AddressLine2: self.address().AddressLine2(),
                    AddressLine3: self.address().AddressLine3(),
                    AddressLine4: self.address().AddressLine4(),
                    Postcode: self.address().Postcode(),
                    Country: {
                        CountryID: self.address().Country().CountryID,
                        Name: self.address().Country().Name
                    }
                },
                SelectedDespatchMethod: {
                    HAULCODE: 'RM',
                    CARRCODE: 'FC'
                },
                CustomerOrderReference: self.customerOrderReference(),
                CustomerPayingForDespatch: false,
                SelectedOrderConfirmationLanguage: 1,
                Basket: self.basketSummary()
            };

            $.ajax({
                url: '/api/SampleRequestAPI/PlaceTradeAccountSampleOrder',
                type: 'POST',
                dataType: 'json',
                cache: false,
                data: objOrder,
                success: function (data) {

                    self.placeOrderBusy(false);

                    if (data.hasOwnProperty("state")) {
                        if (data.state === "success") {
                            self.reset();

                            window.setTimeout(function () {
                                $("#account-name-label").trigger("click");
                                window.setTimeout(function () {
                                    $("#account-number").focus();
                                    $("#new-order-number").text(data.message);
                                    $("#summary-modal").modal('hide');
                                    $("#success-modal").modal('show');
                                    window.setTimeout(function () {
                                        $("#success-close").focus();
                                    }, 200);
                                }, 0);
                            }, 0);
                        }

                        if (data.state === "needLogin") {
                            $("#failure-title").text('Warning');
                            $("#failure-status").text('Missing WebTex Login');
                            $("#failure-modal-error-text").html(data.message);
                            $("#failure-modal-iframe-wrapper").empty();
                            $("#failure-modal").modal('show');
                        }
                    } else {
                        if (data.length > 0) {
                            $.each(data, function (i, fieldItem) {
                                var thisFieldErrors = "";
                                $.each(fieldItem.Value, function (j, errItem) {
                                    thisFieldErrors += errItem + "\n";
                                });
                                $("#" + fieldItem.Key.toLowerCase()).addClass("alert-danger");
                                $("div.field-error[data-field-name='" + fieldItem.Key.toLowerCase() + "']").html(thisFieldErrors);
                            });
                        }
                    }
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
    };



    // #endregion

    // #region Reset Function

    self.reset = function () {

        hideAllModals();

        self.productSearch().clearResults();

        if (!$("#product-collapse").hasClass("in")) {
            $("#product-display-label").trigger("click");
        }

        if ($("#mobile-basket").hasClass("in")) {
            $(".basket-toggle-btn").first().trigger("click");
        }

        $("#product-search").val(null);
        $("#product-search").data("ui-autocomplete").term = null;

        self.customerOrderReference(null);

        self.address(BlankAddress(self.availableCountries(), true));

        //self.address().AddressLine1(null);
        //self.address().AddressLine2(null);
        //self.address().AddressLine3(null);
        //self.address().AddressLine4(null);
        //self.address().Name(null);

        //var countries = Enumerable.From(availableCountries).Where(function (x) {
        //    if (x.Code === "GB")
        //        return x;
        //}).ToArray();

        //if (countries.length > 0) {
        //    self.address().Country(countries[0])
        //}

        if (typeof clearTradeAccountSelectorOnReset != 'undefined') {
            self.tradeAccountSelector().selected(null);
            self.primaryAddress(BlankAddress());
            self.secondaryAddresses([]);
        }
        self.selectedStoredAddress(null);

        self.customerPayingForDespatch(false);
        self.basket([]);
        self.availableLanguages(getAllLanguages());
        self.selectedOrderConfirmationLanguage(null);
        self.alternativeProducts([]);
        self.Email(null);
        self.Phone(null);
        self.ContactPreference(2);

        self.showAllAddressFields(false);

        self.productInfoBusy(false);
        self.productStockBusy(false);
        self.alternativeProductsBusy(false);

        self.currentBasketSummary(null);

        self.customerWantsOrderConfirmation(false);

        if (!$("#account-collapse").hasClass("in")) {
            $("#account-name-label").trigger("click");
        }

        window.setTimeout(function () {
            self.errors.showAllMessages(false);
        }, 0);
    };

    // #endregion

    // #region toJSON Function

    self.toJSON = function () {
        var copy = ko.toJS(this);
        delete copy.availableLanguages;
        delete copy.availableCountries;
        delete copy.availableHauliers;
        delete copy.allCarriages;
        delete copy.availableCarriages;
        delete copy.searchResults;
        delete copy.productSearch;

        if (copy.tradeAccountSelector.selected) {
            copy.account = copy.tradeAccountSelector.selected;
            delete copy.tradeAccountSelector;
        }

        delete copy.setStoreAddressOptionsAfterRender;
        delete copy.basketLength;
        delete copy.removeCodeFromBasket;
        delete copy.increaseCodeInBasket;
        delete copy.decreaseCodeInBasket;
        delete copy.addAllCuttingsToBasket;
        delete copy.removeAllCuttingsFromBasket;
        delete copy.addAllReturnablesToBasket;
        delete copy.removeAllReturnablesFromBasket;
        delete copy.basket;
        delete copy.statusTitle;
        delete copy.currentBasketSummary;
        delete copy.cuttingTotalPrice;
        delete copy.returnableTotalPrice;
        delete copy.totalQuantity;
        delete copy.totalPrice;
        delete copy.placeOrderBusy;
        delete copy.showAllAddressFields;
        delete copy.customerPayingForDespatch;
        delete copy.selectedOrderConfirmationLanguage;
        delete copy.productInfoBusy;
        delete copy.productStockBusy;
        delete copy.nameRemainingChars;
        delete copy.emailRemainingChars;
        delete copy.phoneRemainingChars;
        delete copy.customerOrderReferenceRemainingChars;
        delete copy.primaryAddress;
        delete copy.setAddress;
        delete copy.address1RemainingChars;
        delete copy.address2RemainingChars;
        delete copy.address3RemainingChars;
        delete copy.address4RemainingChars;
        delete copy.postcodeRemainingChars;
        delete copy.orderTakerLabel;
        delete copy.storeAddressPlaceholder;
        delete copy.addressSearchResultsPlaceholder;
        delete copy.cuttingTotalQuantity;
        delete copy.returnableTotalQuantity;
        delete copy.placeOrder;

        copy.basket = copy.basketSummary;
        delete copy.basketSummary;

        return copy;
    };

    // #endregion

    // #region Functions 

    self.initPCAAutocomplete = function () {
        $("#pca-find").autocomplete({
            appendTo: '#pca-find-wrapper',
            source: function (request, response) {
                $("#pca-find").parent().find('.pca-failure').remove();
                $.ajax({
                    url: "/Products/Enquiry/PCAPredictFind",
                    type: "POST",
                    dataType: "json",
                    data: {
                        id: self.address().PCASearchId(),
                        text: self.address().PCASearchTerm(),
                        container: self.address().PCAContainer(),
                        origin: null,
                        countries: self.address().Country().Code,
                    },
                    success: function (data) {
                        $("#pca-find").removeClass('ui-autocomplete-loading');
                        if (self.address().PCASearchId() != null) {
                            if (data.length == 1) {
                                var county = data[0].Province || data[0].ProvinceName || data[0].ProvinceCode || data[0].AdminAreaName || data[0].AdminAreaCode;
                                if (data[0].City === "London" && self.address().Country().Code == "GB")
                                    county = "London";
                                var line1 = data[0].Line1;
                                if (data[0].Company != "") {
                                    line1 = data[0].Company + ", " + line1;
                                }
                                self.setAddress(new Address({
                                    Name: self.address().Name(),
                                    AddressLine1: line1,
                                    AddressLine2: data[0].Line2,
                                    AddressLine3: data[0].City,
                                    AddressLine4: county,
                                    Postcode: data[0].PostalCode,
                                    Country: self.address().Country()
                                }));
                                $("#pca-find").autocomplete("close");
                                self.showAllAddressFields(true);
                                self.address().PCASearchId(null);
                                self.address().PCAContainer(null);
                                self.address().PCASearchTerm(null);
                                return false;
                            } else {
                                response($.map(data, function (item) {
                                    var county = item.Province || item.ProvinceName || item.ProvinceCode || item.AdminAreaName || item.AdminAreaCode;
                                    if (item.City === "London" && self.address().Country().Code == "GB")
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

                        self.address().PCASearchId(null);
                        self.address().PCAContainer(null);

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
                        $("#pca-find").removeClass('ui-autocomplete-loading');
                        $("#pca-find").parent().find('.pca-failure').remove();
                        $("#pca-find").parent().append('<span class="pca-failure alert alert-danger">Lookup Failure. Please try again.</span>');
                        //$.showError(xhr, textStatus, errorThrown);
                    }
                });
            },
            minLength: 1,
            select: function (event, ui) {
                if (ui.item.hasOwnProperty('type')) {
                    switch (ui.item.type) {
                        case 'Address':
                        case 'Residential':
                            jQuery.extend(event.originalEvent, { keepOpen: true });
                            self.address().PCASearchId(ui.item.id);
                            self.address().PCAContainer(null);
                            //$("#pca-find").autocomplete('search');
                            break;
                        default:
                            jQuery.extend(event.originalEvent, { keepOpen: true });
                            //modify value as required
                            self.address().PCASearchId(null);
                            self.address().PCAContainer(ui.item.id);
                            //$("#pca-find").autocomplete('search');
                            return false;
                    }
                } else if (ui.item.hasOwnProperty('customCatch')) {

                    self.setAddress(new Address({
                        Name: self.address().Name(),
                        AddressLine1: ui.item.addressLine1,
                        AddressLine2: ui.item.addressLine2,
                        AddressLine3: ui.item.addressLine3,
                        AddressLine4: ui.item.addressLine4,
                        Postcode: ui.item.Postcode,
                        Country: self.address().Country()
                    }));
                    $("#pca-find").autocomplete("close");
                    self.showAllAddressFields(true);
                    self.address().PCASearchId(null);
                    self.address().PCAContainer(null);
                    self.address().PCASearchTerm(null);
                }

                return false;
            },
            focus: function (event, ui) {
                event.preventDefault();
            },
            autoFocus: true
        });
    }

    self.initPCAAutocomplete();

    self.initOrderTakerAutocomplete = function () {

        $("#order-taker").autocomplete({
            classes: {
                'account-no': 'account-no'
            },
            appendTo: '#order-taker-selector',
            source: function (request, response) {
                $.ajax({
                    url: "/Products/Enquiry/OperatorAutocomplete",
                    type: "POST",
                    dataType: "json",
                    data: {
                        term: request.term
                    },
                    success: function (data) {
                        response($.map(data, function (item) {
                            return {
                                label: item.Code + (item.Name ? " - " + item.Name : ""),
                                value: item.Code,
                                name: item.Name
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
                $("#order-taker").val(ui.item.label);
                self.orderTaker({ Code: ui.item.value, Name: ui.item.name });
                return false;
            },
            autoFocus: true
        });
    }

    self.initOrderTakerAutocomplete();

    self.setStoreAddressOptionsAfterRender = function (option, item) {
        if (item != null) {
            option.title = item.DisplayLine();
        }
    };

    self.statusTitle = function (status) {
        switch (status) {
            case "C":
                return null;
            case "L":
                return "Limited";
            case "Y":
                return null;
            case "D":
                return "Discontinued";
            default:
                return "Unrecognised!";
        }
    };

    self.loadLargeImage = function (result) {
        if (result.ImageID != null) {
            $('#large-image-container').empty();
            var url = 'https://www.designersguild.com/image/488/' + result.ImageID;
            $('#large-image-container').html('<img src="' + url + '"/>');
            if (result.Name != null) {
                $('#large-image-title').text(result.Name + ' - ' + result.Code);
            } else {
                $('#large-image-title').text(result.Code);
            }
            $("#image-modal").modal('show');
        } else {
            $('#large-image-container').html('');
            $('#large-image-container').html('<img src="/Areas/Products/content/images/not-found-large.png"/>');
            $('#large-image-title').text(result.Code);
            $("#image-modal").modal('show');
        }
    };

    self.loadStockInfo = function (result) {
        if (result.Code != null) {
            $('#product-stock-container').empty();
            $('#product-stock-title').html(result.Name + '<br/>' + result.Code);
            self.productStockBusy(true);
            $.ajax({
                url: '/Products/Enquiry/loadStockInfo',
                type: 'POST',
                dataType: 'json',
                cache: false,
                data: {
                    productCode: result.Code,
                    tradeAccountId: self.tradeAccountSelector().selected().TradeAccountID
                },
                success: function (data) {
                    self.productStockBusy(false);
                    if (data != null) {
                        var stockTotal = $("<table class='stock-table stock-total-table table table-bordered'></table>");
                        var stockCore = $("<table class='stock-table table table-bordered'></table>");
                        if (data.TotalStock != null) {
                            stockTotal.append("<thead><tr><th colspan='3'>Available Stock</th><th class='stock-total total-heading'>" + data.TotalStock + "</th></tr></thead>");
                        }
                        if (data.Batches != null) {
                            if (data.Batches.length) {
                                var batches = "";

                                stockCore.append("<tbody><tr><th>Batch No.</th><th>Quantity</th><th>Length</th><th class='total-heading'>Total</th></tr></tbody>");

                                for (var i in data.Batches) {
                                    var b = data.Batches[i];
                                    //batches += "<dt>Batch " + b.BatchNumber + "</dt><dd>Pieces: " + b.ItemCount + "<br/>Total: " + b.Length + "</dd>";
                                    if (b.Pieces != null) {
                                        if (b.Pieces.length) {
                                            //batches += "<dt>Pieces</dt>"
                                            var pieceQuantityTotal = 0;
                                            var pieceLengthTotal = 0;
                                            for (var j in b.Pieces) {
                                                var p = b.Pieces[j];

                                                pieceQuantityTotal += Number(p.Quantity);
                                                pieceLengthTotal += Number(p.Length);

                                                if (j == 0) {
                                                    stockCore.append("<tr><th  class='batch-no' rowspan='" + (Number(b.Pieces.length) + Number(1)) + "'>" + b.BatchNumber + "</th><td>" + p.Quantity + "</td><td>" + Number(p.Length).toFixed(2) + "</td><td>" + Number(Number(p.Quantity) * Number(p.Length)).toFixed(2) + "</td></tr>");
                                                } else {
                                                    stockCore.append("<tr><td>" + p.Quantity + "</td><td>" + p.Length + "</td><td>" + Number(Number(p.Quantity) * Number(p.Length)).toFixed(2) + "</td></tr>");
                                                }
                                                //batches += "<dd>Length: " + p.Length + " &times; " + p.Quantity + "</dd>";
                                            }

                                            stockCore.append("<tr><th class='total'>" + pieceQuantityTotal + "</th><th class='total'></th><th class='total'>" + Number(pieceLengthTotal).toFixed(2) + "</th></tr>")

                                        } else {
                                            stockCore.append("<tbody><tr><th colspan='4'>No piece information available</th></tr></tbody>");
                                        }
                                    } else {
                                        stockCore.append("<tbody><tr><th colspan='4'>No piece information available</th></tr></tbody>");
                                    }
                                }
                                stockCore.append(batches);
                            } else {
                                stockCore.append("<tbody><tr><th colspan='4'>No batches</th></tr></tbody>");
                            }
                        } else {
                            stockCore.append("<tbody><tr><th colspan='4'>No batch</th></tr></tbody>");
                        }

                        var poTotal = $("<table class='stock-table po-total-table table table-bordered'></table>");
                        var poCore = $("<table class='stock-table table table-bordered'></table>");

                        if (data.PurchaseOrders != null) {
                            if (data.PurchaseOrders.length) {
                                poTotal.append("<thead><tr><th colspan='3'>Incoming Stock</th><th class='stock-total total-heading'>" + data.TotalPurchaseOrderLength + "</th></tr></thead>");
                                if (data.PurchaseOrders.length) {
                                    poCore.append("<tbody><tr><th class='due-date-heading'>Due Date</th><th class='length-heading'>Length</th></tr></tbody>");
                                    var totalIncomingLength = 0;
                                    for (var i in data.PurchaseOrders) {
                                        var po = data.PurchaseOrders[i];
                                        poCore.append("<tr><td class='due-date-heading'>" + po.DueDate + "</td><td>" + Number(po.Length).toFixed(2) + "</td></tr>");
                                        totalIncomingLength += Number(po.Length);
                                    }
                                    poCore.append("<tr><th class='total'>Total</th><th class='total'>" + Number(totalIncomingLength).toFixed(2) + "</th></tr>")
                                    $('#product-stock-container').append(poCore);
                                } else {
                                    //poCore.append("<tr><td colspan='4'>None</td></tr>");
                                }
                            }
                        }

                        $('#product-stock-container').append(stockTotal);
                        $('#product-stock-container').append(stockCore);
                        $('#product-stock-container').append(poTotal);
                        $('#product-stock-container').append(poCore);
                        $('#product-stock-modal').modal('handleUpdate');
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    self.productStockBusy(false);
                    //$.showError(xhr, textStatus, errorThrown);
                }
            });
            $('#product-stock-modal').modal('show');
        }
    }

    self.loadAlternativeProducts = function (result) {
        $("#alternative-products-title").html(result.Name + "<br/>" + result.Code);
        if (result.ProductPageID != null) {
            self.alternativeProductsBusy(true);
            self.alternativeProducts([]);
            $.ajax({
                url: '/api/ComponentAPI/ProductCodeAutocompleteAlternatives',
                type: 'POST',
                dataType: 'json',
                cache: false,
                data: {
                    term: result.Code,
                    tradePriceListId: self.tradeAccountSelector().selected().TradePriceListID
                },
                success: function (data) {
                    self.alternativeProductsBusy(false);

                    if (data.hasOwnProperty("Alternatives")) {
                        if (data.Alternatives.length) {
                            var results = [];
                            data.Alternatives.forEach(function (alt) {
                                results.push(new SampleProduct(alt));
                            });

                            self.alternativeProducts(results);
                        }
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    self.alternativeProductsBusy(false);
                    //$.showError(xhr, textStatus, errorThrown);
                }
            });
        }
        $('#alternative-products-modal').modal('show');
    }

    self.loadProductInfo = function (result) {
        if (result.ProductPageID != null) {
            $('#product-info-container').empty();
            $('#product-info-title').html(result.Name + '<br/>' + result.Code);
            self.productInfoBusy(true);
            $.ajax({
                url: '/Products/Enquiry/loadProductInfo',
                type: 'POST',
                dataType: 'json',
                cache: false,
                data: {
                    productPageId: result.ProductPageID
                },
                success: function (data) {
                    self.productInfoBusy(false);
                    if (data != null) {

                        var description = $("<p class='info-description'>" + data.Description + "</p>");

                        var collections = $("<dl class='info-collections'></dl>");

                        collections.append("<dt>Collections</dt>");

                        for (var i in data.Collections) {
                            var collection = data.Collections[i];
                            collections.append("<dd><a target='_blank' href='" + collection.URLKeywords + "'>" + collection.Heading + "</a></dd>");
                        }

                        var composition = null;
                        var width = null;
                        var weight = null;
                        var hpr = null;
                        var vpr = null;
                        var ptn = null;
                        var flm = null;
                        var cntrFR = null;
                        var cntrFRID = null;
                        var domFR = null;
                        var domFRID = null;
                        var typ = null;
                        var addInf = null;
                        var mrt = null;

                        if (data.TechInfoCore != null) {
                            composition = data.TechInfoCore.CompositionName;
                            width = data.TechInfoCore.Width.toString();
                            weight = data.TechInfoCore.Weight.toString();
                            hpr = data.TechInfoCore.HorizontalPatternRepeat;
                            vpr = data.TechInfoCore.VerticalPatternRepeat;
                            mrt = data.TechInfoCore.Martindale;
                            ptn = data.TechInfoCore.PatternMatchName;
                            flm = data.TechInfoCore.FlamcodeName;
                            cntrFR = data.TechInfoCore.ContractFRName;
                            cntrFRID = data.TechInfoCore.ContractFRID;
                            domFR = data.TechInfoCore.DomesticFRName;
                            domFRID = data.TechInfoCore.DomesticFRID;
                            typ = data.TechInfoCore.TypeName;
                            addInf = data.TechInfoCore.AdditionalInfo;
                        }

                        var techInfoCore = $("<dl class='techinfo-core'></dl>");

                        if (composition != null) {
                            techInfoCore.append("<dt>Composition</dt><dd>" + composition + "</dd>");
                        }

                        if (width != null) {
                            techInfoCore.append("<dt>Width</dt><dd>" + width + "cm</dd>");
                        }

                        if (weight != null) {
                            techInfoCore.append("<dt>Weight</dt><dd>" + weight + "g/m<sup>2</sup></dd>");
                        }

                        if (hpr != null) {
                            techInfoCore.append("<dt>Horizontal Pattern Repeat</dt><dd>" + hpr.toString() + "cm</dd>");
                        }

                        if (vpr != null) {
                            techInfoCore.append("<dt>Vertical Pattern Repeat</dt><dd>" + vpr.toString() + "cm</dd>");
                        }

                        if (mrt != null) {
                            techInfoCore.append("<dt>Martindale</dt><dd>" + formatNumber(mrt, 0, 'en-GB') + "</dd>");
                        }

                        if (ptn != null) {
                            techInfoCore.append("<dt>Pattern Match</dt><dd>" + ptn + "</dd>");
                        }

                        if (flm != null) {
                            techInfoCore.append("<dt>Flamcode</dt><dd>" + flm + "</dd>");
                        }

                        if (cntrFR != null) {
                            techInfoCore.append("<dt>Contract FR</dt><dd><img class='fr-img' src='/content/images/product-tests/fire-resistance/contract/" + cntrFRID + ".gif' alt='" + cntrFR + "' title='" + cntrFR + "'>" + cntrFR + "</dd>");
                        }

                        if (domFR != null) {
                            techInfoCore.append("<dt>Domestic FR</dt><dd><img class='fr-img' src='/content/images/product-tests/fire-resistance/domestic/" + domFRID + ".gif' alt='" + domFR + "' title='" + domFR + "'>" + domFR + "</dd>");
                        }

                        if (typ != null) {
                            techInfoCore.append("<dt>Type</dt><dd>" + typ + "</dd>");
                        }

                        if (addInf != null) {
                            techInfoCore.append("<dt>Additional Info</dt><dd>" + addInf + "</dd>");
                        }

                        if (data.TechInfoTests.length) {
                            techInfoCore.append("<dt>Tests</dt>");
                            for (var i in data.TechInfoTests) {
                                techInfoCore.append("<dd>" + data.TechInfoTests[i].TestName + "</dd>");
                            }
                        }

                        if (data.TechInfoAftercares.length) {
                            techInfoCore.append("<dt>Aftercare Info</dt>");
                            for (var i in data.TechInfoAftercares) {
                                techInfoCore.append("<dd><img class='test-thumb' src='/content/images/product-tests/aftercare/" + data.TechInfoAftercares[i].AftercareID + ".gif'/>" + data.TechInfoAftercares[i].AftercareName + "</dd>");
                            }
                        }

                        if (data.TechInfoUsages.length) {
                            techInfoCore.append("<dt>Usages</dt>");
                            for (var i in data.TechInfoUsages) {
                                techInfoCore.append("<dd><img class='test-thumb' src='/content/images/product-tests/aftercare/" + data.TechInfoUsages[i].UsageID + ".gif'/>" + data.TechInfoUsages[i].UsageName + "</dd>");
                            }
                        }


                        $('#product-info-container').append(description);
                        if (data.Collections.length)
                            $('#product-info-container').append(collections);
                        $('#product-info-container').append(techInfoCore);
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    self.productInfoBusy(false);
                    //$.showError(xhr, textStatus, errorThrown);
                }
            });
            $('#product-info-modal').modal('show');
        }
    }

    self.buttonClass = function (status) {
        switch (status) {
            case 'C':
                return 'btn-success';
            case 'L':
                return 'btn-warning';
            case 'Y':
                return 'btn-warning';
            case 'D':
                return 'btn-danger';
            default:
                return null;
        }
    }

    self.sampleButtonEnabled = function (product) {

        // fudge necessary to permit button functionality from basketSummary - differing properties.
        if (product.hasOwnProperty('CuttingStatus')) {

        } else {
            product.CuttingStatus = product.Status;
            product.CuttingCode = product.Code;
        }

        var result = true;

        if (product.CuttingStatus === 'D') {
            result = false
            return result;
        }

        if (self.maxSKUQuantity()) {

            var extantCount = Enumerable.From(self.basket()).Where(function (x) {
                if (x.Type === 'C') {
                    if (x.Code === product.CuttingCode)
                        return x;
                }
            }).ToArray().length;

            if (extantCount >= self.maxSKUQuantity())
                result = false;

        }
        if (self.maxOrderQuantity()) {
            if (self.basketLength() >= self.maxOrderQuantity())
                result = false;
        }

        return result;
    }

    self.returnableButtonEnabled = function (product) {

        // fudge necessary to permit button functionality from basketSummary - differing properties.
        if (product.hasOwnProperty('ReturnableStatus')) {

        } else {
            product.ReturnableStatus = product.Status;
            product.ReturnableCode = product.Code;
        }

        var result = true;

        if (product.ReturnableStatus === 'D') {
            result = false
            return result;
        }

        if (self.maxSKUQuantity()) {

            var extantCount = Enumerable.From(self.basket()).Where(function (x) {
                if (x.Type === 'R') {
                    if (x.Code === product.ReturnableCode)
                        return x;
                }
            }).ToArray().length;

            if (extantCount >= self.maxSKUQuantity())
                result = false;

        }
        if (self.maxOrderQuantity()) {
            if (self.basketLength() >= self.maxOrderQuantity())
                result = false;
        }

        return result;
    }

    self.buttonTitle = function (product, type, _default) {

        var result = _default;

        switch (type) {
            case 'C':
                if (product.CuttingStatus == "D") {
                    result = "You cannot order Discontinued products.";
                    return result;
                }

                if (self.maxSKUQuantity()) {

                    var extantCount = Enumerable.From(self.basket()).Where(function (x) {
                        if (x.Type === 'C') {
                            if (x.Code === product.CuttingCode)
                                return x;
                        }
                    }).ToArray().length;

                    if (extantCount >= self.maxSKUQuantity())
                        result = "You may only order " + self.maxSKUQuantity() + " of each SKU.";

                }
                if (self.maxOrderQuantity()) {
                    if (self.basketLength() >= self.maxOrderQuantity())
                        result = "You may only order a maximum of " + self.maxOrderQuantity() + " items per order.";
                }

                break;

            case 'R':
                if (product.ReturnableStatus === 'D') {
                    result = "You cannot order Discontinued products.";
                    return result;
                }

                if (self.maxSKUQuantity()) {

                    var extantCount = Enumerable.From(self.basket()).Where(function (x) {
                        if (x.Type === 'R') {
                            if (x.Code === product.ReturnableCode)
                                return x;
                        }
                    }).ToArray().length;

                    if (extantCount >= self.maxSKUQuantity())
                        result = "You may only order " + self.maxSKUQuantity() + " of each SKU.";

                }
                if (self.maxOrderQuantity()) {
                    if (self.basketLength() >= self.maxOrderQuantity())
                        result = "You may only order a maximum of " + self.maxOrderQuantity() + " items per order.";
                }
                break;
            default:
                break;
        }


        return result;
    }

    self.removeCodeFromBasket = function (code) {
        if (code) {
            self.basket.remove(function (item) {
                return item.Code === code;
            });
        }
    };

    self.increaseCodeInBasket = function (name, productType, code, status, price, imageId) {
        if (code) {
            if (self.maxOrderQuantity()) {
                if (self.basketLength() < self.maxOrderQuantity()) {
                    var extant = Enumerable.From(self.basket()).Where(function (x) {
                        if (x.Code === code)
                            return x;
                    }).FirstOrDefault(null);

                    if (extant === null) {
                        if (self.maxSKUQuantity()) {
                            var count = Enumerable.From(self.basket()).Where(function (x) {
                                if (x.Code === code)
                                    return x;
                            }).ToArray().length;

                            if (count < self.maxSKUQuantity()) {
                                self.basket.push(new BasketItem(name, productType, imageId, code, code.slice(-1), status, price));
                            }
                        } else {
                            self.basket.push(new BasketItem(name, productType, imageId, code, code.slice(-1), status, price));
                        }
                    }
                    else {
                        if (self.maxSKUQuantity()) {
                            var count = Enumerable.From(self.basket()).Where(function (x) {
                                if (x.Code === code)
                                    return x;
                            }).ToArray().length;

                            if (count < self.maxSKUQuantity()) {
                                self.basket.push(new BasketItem(name, productType, imageId, code, code.slice(-1), status, price));
                            }
                        } else {
                            self.basket.push(new BasketItem(name, productType, imageId, code, code.slice(-1), status, price));
                        }
                    }
                }
            } else {
                var extant = Enumerable.From(self.basket()).Where(function (x) {
                    if (x.Code === code)
                        return x;
                }).FirstOrDefault(null);

                if (extant === null) {
                    if (self.maxSKUQuantity()) {
                        var count = Enumerable.From(self.basket()).Where(function (x) {
                            if (x.Code === code)
                                return x;
                        }).ToArray().length;

                        if (count < self.maxSKUQuantity()) {
                            self.basket.push(new BasketItem(name, productType, imageId, code, code.slice(-1), status, price));
                        }
                    } else {
                        self.basket.push(new BasketItem(name, productType, imageId, code, code.slice(-1), status, price));
                    }
                }
                else {
                    if (self.maxSKUQuantity()) {
                        var count = Enumerable.From(self.basket()).Where(function (x) {
                            if (x.Code === code)
                                return x;
                        }).ToArray().length;

                        if (count < self.maxSKUQuantity()) {
                            self.basket.push(new BasketItem(name, productType, imageId, code, code.slice(-1), status, price));
                        }
                    } else {
                        self.basket.push(new BasketItem(name, productType, imageId, code, code.slice(-1), status, price));
                    }
                }
            }
        }
    };

    self.decreaseCodeInBasket = function (code) {
        if (code) {
            var toRemove = Enumerable.From(self.basket()).Where(function (x) {
                if (x.Code === code)
                    return x;
            }).FirstOrDefault(null);
            if (toRemove)
                self.basket.remove(toRemove);
        }
    };

    self.setAddress = function (otherAddress) {
        self.address().Name(otherAddress.Name());
        self.address().AddressLine1(otherAddress.AddressLine1());
        self.address().AddressLine2(otherAddress.AddressLine2());
        self.address().AddressLine3(otherAddress.AddressLine3());
        self.address().AddressLine4(otherAddress.AddressLine4());
        self.address().Postcode(otherAddress.Postcode());
        self.address().Country(otherAddress.Country());

        //$("#delivery-address-section").get(0).scrollIntoView();
    }

    self.useDefaultDespatch = function () {
        if (self.tradeAccountSelector().selected()) {
            self.selectedHaulier(self.tradeAccountSelector().selected().SampleHAULCODE);
            self.selectedCarriage(self.tradeAccountSelector().selected().SampleCARRCODE);
        }
    }

    // #endregion

    if (self.tradeAccountSelector().selected()) {
        window.setTimeout(function () {
            $("#product-search").focus();
        }, 0);

        if (typeof FetchAddresses === 'function')
            FetchAddresses(self.tradeAccountSelector().selected().Code);

        self.selectedHaulier(self.tradeAccountSelector().selected().SampleHAULCODE);
        self.selectedCarriage(self.tradeAccountSelector().selected().SampleCARRCODE);
    }

    self.errors = ko.validation.group([
        self.tradeAccountSelector,
        self.address,
        self.Email,
        self.Phone,
        self.basket,
        self.selectedHaulier,
        self.selectedCarriage
    ], { deep: true });
}

var Address = function (address, createCharsRemainingExtension) {
    var self = this;

    self.PCASearchTerm = ko.observable(null);
    self.PCASearchId = ko.observable(null);
    self.PCAContainer = ko.observable(null);

    self.Name = ko.observable(address.Name).extend({
        required: {
            params: true,
            message: 'Please provide a name'
        }
    });

    self.DeliveryReference = ko.observable(address.DeliveryReference);

    // 60
    self.AddressLine1 = ko.observable(address.AddressLine1).extend({
        required: {
            params: true,
            message: 'Please provide a house number or building name'
        }
    });

    // 60
    self.AddressLine2 = ko.observable(address.AddressLine2);

    // 50
    self.AddressLine3 = ko.observable(address.AddressLine3);

    // 40
    self.AddressLine4 = ko.observable(address.AddressLine4);

    // 20
    self.Postcode = ko.observable(address.Postcode).extend({
        required: {
            params: true,
            message: 'Please provide a postcode'
        }
    });

    // String or Object?
    self.Country = ko.observable(address.Country);

    self.DisplayLine = ko.pureComputed(function () {

        var lineArray = [];

        if (self.AddressLine1()) {
            lineArray.push(self.AddressLine1());
        }
        if (self.AddressLine2()) {
            lineArray.push(self.AddressLine2());
        }
        if (self.Postcode()) {
            lineArray.push(self.Postcode());
        }
        if (self.Country()) {
            lineArray.push(self.Country().Name);
        }

        return lineArray.join(', ');

    }, self);

    if (createCharsRemainingExtension) {
        self.Name.extend({
            charsRemaining: {
                maxLength: 50,
                elementId: '#name'
            }
        });
        self.AddressLine1.extend({
            charsRemaining: {
                maxLength: 60,
                elementId: '#custom-line-1'
            }
        });
        self.AddressLine2.extend({
            charsRemaining: {
                maxLength: 60,
                elementId: '#custom-line-2'
            }
        });
        self.AddressLine3.extend({
            charsRemaining: {
                maxLength: 50,
                elementId: '#custom-line-3'
            }
        });
        self.AddressLine4.extend({
            charsRemaining: {
                maxLength: 40,
                elementId: '#custom-line-4'
            }
        });
        self.Postcode.extend({
            charsRemaining: {
                maxLength: 20,
                elementId: '#custom-postcode'
            }
        });
    }

    self.toJSON = function () {
        var copy = ko.toJS(this); //easy way to get a clean copy

        delete copy.DisplayLine; //remove an extra property
        delete copy.PCASearchTerm;
        delete copy.PCASearchId;
        delete copy.PCAContainer;
        return copy;
    };
};

function BlankAddress(availableCountries, createCharsRemainingExtension) {
    var b = new Address({
        Name: null,
        AddressLine1: null,
        AddressLine2: null,
        AddressLine3: null,
        AddressLine4: null,
        Postcode: null,
        Country: null
    }, createCharsRemainingExtension);

    var countries = Enumerable.From(availableCountries).Where(function (x) {
        if (x.Code === "GB")
            return x;
    }).ToArray();

    if (countries.length > 0) {
        b.Country(countries[0])
    }

    return b;
}

var DespatchMethod = function (despatchMethod) {
    var self = this;
    self.Name = ko.observable(despatchMethod.Name);
    self.HAULCODE = ko.observable(despatchMethod.HAULCODE);
    self.CARRCODE = ko.observable(despatchMethod.CARRCODE);
};

var BasketItem = function (name, productType, imageId, code, type, status, price) {
    var self = this;
    self.Name = name;
    self.ProductType = productType;
    self.ImageID = imageId;
    self.Code = code;
    self.Type = type;
    self.Status = status;
    self.OriginalPrice = price;
    self.Price = ko.observable(price);
};

var BasketSummaryItem = function (name, productType, imageId, code, quantityTotal, ref, status, price) {
    var self = this;
    self.Name = name;
    self.ProductType = productType;
    self.ImageID = imageId;
    self.Code = code;
    self.QuantityTotal = quantityTotal;
    self.LineRef = ko.observable(ref);
    self.Status = status;

    self.UnitPrice = Number(price);

    self.Price = ko.pureComputed({
        read: function () {
            return Number(self.QuantityTotal * self.UnitPrice).toFixed(2);
        }
    }, self);

    self.PriceDisplay = ko.pureComputed({
        read: function () {
            return formatCurrency(self.Price(), 2, 'en-GB', 'GBP');
        }
    }, self);
};

var SampleProduct = function (product) {
    var self = this;

    self.ProductID = product.ProductID;
    self.Name = product.Name;
    self.Code = product.Code;
    self.Status = product.Status;
    self.CuttingProductID = product.CuttingProductID;
    self.CuttingCode = product.CuttingCode;
    self.CSSID = product.CuttingSSID;
    self.CStock = product.CuttingStock;
    self.CuttingStatus = product.CuttingStatus;
    self.CuttingPrice = product.CuttingPrice === null ? null : product.CuttingPrice.toFixed(2);
    self.CuttingPriceDisplay = ko.pureComputed({
        read: function () {
            if (self.CuttingPrice == null) {
                return null;
            } else {
                return formatCurrency(self.CuttingPrice, 2, 'en-GB', 'GBP');
            }
        }
    }, self);

    self.ReturnableProductID = product.ReturnableProductID;
    self.ReturnableCode = product.ReturnableCode;
    self.RSSID = product.ReturnableSSID;
    self.RStock = product.ReturnableStock;
    self.ReturnableStatus = product.ReturnableStatus;
    self.ReturnablePrice = product.ReturnablePrice === null ? null : product.ReturnablePrice.toFixed(2);
    self.ReturnablePriceDisplay = ko.pureComputed({
        read: function () {
            if (self.ReturnablePrice == null) {
                return null;
            } else {
                return formatCurrency(self.ReturnablePrice, 2, 'en-GB', 'GBP');
            }
        }
    }, self);

    self.ImageID = product.ImageID;
    self.ProductPageID = product.ProductPageID;

    self.RRP = product.RRP;

    self.ProductType = product.ProductType;

    self.StockStatus = product.StockStatus;

    self.FreeStock = product.FreeStock;

    if (self.FreeStock) {
        if (Number(self.FreeStock) < 10) {
            var unit = Number(self.FreeStock).toFixed(2) + 'm ';
            if (self.ProductType === "Wallpaper") {
                if (Number(self.FreeStock) == 1) {
                    unit = Number(self.FreeStock).toFixed(0) + ' roll ';
                } else {
                    unit = Number(self.FreeStock).toFixed(0) + ' rolls ';
                }
            }

            self.StockStatus = unit + self.StockStatus;
        }
    }

    self.CuttingStatusDisplay = ko.pureComputed({
        read: function () {
            return self.StatusDisplay(self.CuttingStatus);
        }
    }, self);

    self.CuttingStockDisplay = ko.pureComputed(function () {
        switch (self.CSSID) {
            case 1:
                return self.CStock + " in stock";
            case 255:
                return "Out of stock";
            default:
                return self.CuttingCode === null ? "No cutting part number" : "No stock info";
        }
    }, self);

    self.ReturnableStatusDisplay = ko.pureComputed({
        read: function () {
            return self.StatusDisplay(self.ReturnableStatus);
        }
    }, self);

    self.ReturnableStockDisplay = ko.pureComputed(function () {
        switch (self.RSSID) {
            case 1:
                return self.RStock + " in stock";
            case 255:
                return "Out of stock";
            default:
                return self.ReturnableCode === null ? "No returnable part number" : "No stock info";
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

    self.StatusDisplay = function (status) {
        switch (status) {
            case 'C':
                return 'Current';
            case 'L':
                return 'Limited';
            case 'Y':
                return 'Limited';
            case 'D':
                return 'Discontinued';
            default:
                return null;
        }
    };

    self.buttonClass = function (status) {
        switch (status) {
            case 'C':
                return 'btn-success';
            case 'L':
                return 'btn-warning';
            case 'Y':
                return 'btn-warning';
            case 'D':
                return 'btn-danger';
            default:
                return null;
        }
    }

    self.cuttingQuantityInBasket = ko.pureComputed({
        read: function () {
            return Enumerable.From(viewModel.basket()).Where(function (x) {
                var xCode = x.Code;
                var sCode = self.CuttingCode;
                if (xCode === sCode)
                    return x;
            }).ToArray().length || "";
        },
        owner: self
    }, self);

    self.returnableQuantityInBasket = ko.pureComputed({
        read: function () {
            return Enumerable.From(viewModel.basket()).Where(function (x) {
                var xCode = x.Code;
                var sCode = self.ReturnableCode;
                if (xCode === sCode)
                    return x;
            }).ToArray().length || "";
        },
        owner: self
    }, self);

    self.cuttingButtonQuantityDisplay = ko.computed({
        read: function () {
            var q = self.cuttingQuantityInBasket();
            if (q !== null) {
                if (q !== undefined) {
                    if (q > 0) {
                        return '(' + q + ')';
                    }
                }
            }
        }
    });

    self.returnableButtonQuantityDisplay = ko.computed({
        read: function () {
            var q = self.returnableQuantityInBasket();
            if (q !== null) {
                if (q !== undefined) {
                    if (q > 0) {
                        return '(' + q + ')';
                    }
                }
            }
        }
    });

    self.toJSON = function () {
        var copy = ko.toJS(this); //easy way to get a clean copy

        delete copy.CuttingStockLine; //remove an extra property
        delete copy.ReturnableStockLine;
        delete copy.DisplayName;
        delete copy.cuttingQuantityInBasket;
        delete copy.returnableQuantityInBasket;
        delete copy.cuttingButtonQuantityDisplay;
        delete copy.returnableButtonQuantityDisplay;

        return copy;
    };
};