var customerEnquiryViewModel = function () {
    var self = this;

    self.tradeAccountSelector = ko.observable(new tradeAccountSelector(getPreselectedTradeAccount()));
    self.tradeAccountPotential = ko.observable();

    self.tradeAccountId = ko.pureComputed({
        read: function () {
            if (self.tradeAccountSelector().selected()) {
                return self.tradeAccountSelector().selected().TradeAccountID
            } else {
                return null;
            }
        }
    }, self);

    //self.tradeAccountId = ko.observable();
    //self.tradeAccountSelector.selected.subscribe(function (newValue) {
    //    if (newValue) {
    //        self.tradeAccountId(newValue.TradeAccountID);
    //    } else {
    //        self.tradeAccountId(undefined);
    //    }
    //});


    self.customerDetails = ko.observable();

    self.loadBusy = ko.observable(false);
    self.competitorsBusy = ko.observable(false);
    self.summaryBusy = ko.observable(false);
    self.addCompetitorBusy = ko.observable(false);
    self.potentialBusy = ko.observable(false);

    self.priceChecker = ko.observable(new priceChecker(self.tradeAccountSelector().selected, self.customerDetails));

    self.tradeAccountSummary = ko.observable();
    self.competitorDetails = ko.observableArray([]);
    self.potentialDetails = ko.observable();

    self.addingCompetitor = ko.observable();
    self.availableCompetitors = ko.observableArray(getAvailableCompetitors());
    self.availableCompetitorProductTypeGroups = ko.observableArray([]);
    self.availableBrands = ko.observableArray(getAvailableBrands());
    self.availableProductTypeGroups = ko.observableArray(getAvailableProductTypeGroups());
    self.competitorAutocomplete = ko.observable();
    self.newCompetitor = ko.observable(false);

    self.gbpCurrency = ko.observable(getGBPCurrency());
    //.extend({
    //    pattern: '^([a-zA-Z0-9 .&\'-]+)$' 
    //});

    self.tradeAccountSelector().selected.subscribe(function (newValue) {
        if (newValue != null) {
            self.loadCustomerDetails();
            self.priceChecker().selectedMarketId(newValue.MarketID);
            self.priceChecker().selectedTradePriceListId(newValue.TradePriceListID);
            self.priceChecker().selectedCurrencyId(newValue.CurrencyID);
        } else {
            self.reset();
            self.priceChecker().selectedMarketId(undefined);
            self.priceChecker().selectedTradePriceListId(undefined);
            self.priceChecker().selectedCurrencyId(undefined);
            self.priceChecker().currentQuery('ListPrices');
        }
    });

    if (self.tradeAccountSelector().selected()) {
        self.priceChecker().selectedMarketId(self.tradeAccountSelector().selected().MarketID);
        self.priceChecker().selectedTradePriceListId(self.tradeAccountSelector().selected().TradePriceListID);
        self.priceChecker().selectedCurrencyId(self.tradeAccountSelector().selected().CurrencyID);
    }

    self.addingCompetitor.subscribe(function (newValue) {
        self.loadProductTypeGroups(newValue);
    });

    self.loadCustomerDetails = function () {
        if (!self.loadBusy()) {
            self.loadBusy(true);
            $.ajax({
                url: '/customers/enquiry/loadCustomerDetails',
                type: 'POST',
                dataType: 'json',
                data: {
                    tradeAccountId: self.tradeAccountId()
                },
                success: function (data) {
                    self.loadBusy(false);
                    self.customerDetails(new customerDetails(data));
                    self.initBrandsWorkedWithAutocomplete();
                    self.loadCompetitors();
                    self.loadSummary();
                    self.loadPotential();
                },
                error: function (xhr, textStatus, errorThrown) {
                    self.loadBusy(false);
                    //$.showError(xhr, textStatus, errorThrown);
                }
            });
        }
    }

    self.loadCompetitors = function () {
        self.competitorsBusy(true);

        $.ajax({
            url: '/customers/enquiry/loadCompetitors',
            type: 'POST',
            dataType: 'json',
            data: {
                tradeAccountId: self.tradeAccountId()
            },
            success: function (data) {
                self.competitorDetails(
                    Enumerable.From(data.Competitors)
                        .OrderBy('$.ProductTypeGroup.SortOrder')
                        .GroupBy('$.Competitor', '', 'key, e => e', '$.CompetitorID').ToArray());
                self.competitorsBusy(false);
            },
            error: function (xhr, e, s) {
                self.competitorsBusy(false);
                //$.showError(xhr, e, s);
            }
        });
    }

    self.loadSummary = function () {
        self.summaryBusy(true);
        $.ajax({
            url: '/customers/enquiry/loadSummary',
            type: 'POST',
            dataType: 'json',
            data: {
                tradeAccountId: self.tradeAccountId()
            },
            success: function (data) {
                self.tradeAccountSummary(new tradeAccountSummary(data, self.summaryBusy, self.tradeAccountId, self.customerDetails));
                self.summaryBusy(false);
            },
            error: function (xhr, e, s) {
                self.summaryBusy(false);
                //$.showError(xhr, e, s);
            }
        });
    }

    self.loadPotential = function () {
        self.potentialBusy(true);
        $.ajax({
            url: '/customers/enquiry/loadTradeAccountPotential',
            type: 'POST',
            dataType: 'json',
            data: {
                tradeAccountId: self.tradeAccountId()
            },
            success: function (data) {
                self.tradeAccountPotential(new businessPotential(self.customerDetails().currency, self));
                self.tradeAccountPotential().load(data.Potentials, data.ProductTypeGroups, data.ExistingSales);
                self.tradeAccountPotential().tradeAdvertiserSchemes(data.ExistingTradeAdvertisers);
                self.potentialBusy(false);
            },
            error: function (xhr, e, s) {
                self.potentialBusy(false);
                //$.showError(xhr, e, s);
            }
        });
    }

    self.loadProductTypeGroups = function (competitor) {
        console.log('loadProductTypeGroups hit');
        self.availableCompetitorProductTypeGroups([]);

        var productTypeGroups = getAvailableProductTypeGroups();

        if (competitor) {
            // we have competitor.CompetitorID
            var extantCompetitor = Enumerable.From(self.competitorDetails()).Where('$.Key().CompetitorID == ' + competitor.CompetitorID).SingleOrDefault();
            
            for (var i in productTypeGroups) {
                var thisGroup = productTypeGroups[i];

                var value = undefined;
                var oldNotes = [];

                if (extantCompetitor) {
                    var extantProductTypeGroup = Enumerable.From(extantCompetitor.source).Where('$.ProductTypeGroupID == ' + thisGroup.ProductTypeGroupID).SingleOrDefault();
                    if (extantProductTypeGroup) {
                        if (extantProductTypeGroup.Value) {
                            value = extantProductTypeGroup.Value;
                        }
                        oldNotes = Enumerable.From(extantProductTypeGroup.Notes).OrderByDescending('$.NoteID').ToArray();
                    }
                }

                for (var i in oldNotes) {
                    oldNotes[i].observable = ko.observable(oldNotes[i].Note);
                }
                // we have thisGroup.ProductTypeGroupID

                thisGroup.estimatedValue = ko.observable(value).extend({
                    currencyFormatted: {
                        digits: 0,
                        currency: self.customerDetails().currency,
                        maxValue: 9999999999,
                        minValue: -9999999999
                    }
                });

                thisGroup.note = ko.observable();

                thisGroup.oldNotes = ko.observableArray(oldNotes);

            }
            self.availableCompetitorProductTypeGroups(productTypeGroups);
            window.setTimeout(function () {
                for (var i in self.availableCompetitorProductTypeGroups()) {
                    self.availableCompetitorProductTypeGroups()[i].note.extend({
                        charsRemaining: {
                            maxLength: 500,
                            elementId: '#new-note-' + i
                        }
                    });
                    for (var j in self.availableCompetitorProductTypeGroups()[i].oldNotes()) {
                        if (self.availableCompetitorProductTypeGroups()[i].oldNotes()[j].Editable) {
                            self.availableCompetitorProductTypeGroups()[i].oldNotes()[j].observable.extend({
                                charsRemaining: {
                                    maxLength: 500,
                                    elementId: '#note-' + self.availableCompetitorProductTypeGroups()[i].oldNotes()[j].NoteID
                                }
                            });
                        }
                    }
                }
            }, 0);
        } else {
            self.availableCompetitorProductTypeGroups([]);
        }
    }

    self.initBrandsWorkedWithAutocomplete = function () {
        $("#competitor-autocomplete").autocomplete({
            appendTo: 'body',
            source: function (request, response) {
                $.ajax({
                    url: "/Component/CompetitorAutocomplete",
                    type: "POST",
                    dataType: "json",
                    data: {
                        term: request.term
                    },
                    success: function (data) {

                        if (data.length) {
                            self.newCompetitor(false);
                        } else {
                            self.newCompetitor(true);
                        }

                        response($.map(data, function (item) {
                            return {
                                label: item.Name,
                                value: item
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
                event.preventDefault();
                self.addingCompetitor(ui.item.value);
                $("#competitor-autocomplete").val(null);
                return false;
            },
            focus: function (event, ui) {
                return false;
            },
            autoFocus: true
        });

        return true;
    }

    self.addNewCompetitor = function (name) {
        self.addCompetitorBusy(true);
        $.ajax({
            url: '/Sales/LeadsAPI/AddCompetitor',
            type: 'POST',
            dataType: 'json',
            cache: false,
            data: {
                name: name
            },
            success: function (data) {
                self.addCompetitorBusy(false);
                self.availableCompetitors.push(data);
                self.addingCompetitor(data);
            },
            error: function (xhr, e, s) {
                self.addCompetitorBusy(false);
                //$.showError(xhr, e, s);
            }
        });
    }

    self.saveCompetitorProductTypeGroups = function () {
        self.addCompetitorBusy(true);
        $.ajax({
            url: '/customers/enquiry/saveCompetitorProductTypeGroups',
            type: 'POST',
            dataType: 'json',
            cache: false,
            data: {
                tradeAccountId: self.tradeAccountId(),
                competitor: ko.toJS(self.addingCompetitor()),
                productTypeGroups: ko.toJS(self.availableCompetitorProductTypeGroups())
            },
            success: function (data) {
                self.addingCompetitor(undefined);
                self.addCompetitorBusy(false);
                $("#add-competitor-modal").modal('hide');
                self.loadCompetitors();
            },
            error: function (xhr, e, s) {
                self.addCompetitorBusy(false);
                //$.showError(xhr, e, s);
            }
        });
    }

    self.openCompetitorAddModal = function (competitor) {
        if (competitor) {
            $("#competitor-search").hide();
        } else {
            $("#competitor-search").show();
        }
        self.addingCompetitor(competitor);
        $("#add-competitor-modal").modal('show');
    }


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

    // Reset
    self.reset = function () {
        self.loadBusy(false);
        self.competitorsBusy(false);
        self.summaryBusy(false);
        self.addCompetitorBusy(false);
        self.potentialBusy(false);
        self.pricingBusy(false);

        self.customerDetails(undefined);
        self.competitorDetails([]);
        self.tradeAccountSummary(undefined);
        self.competitorAutocomplete(undefined);
        self.addingCompetitor(undefined);
        self.priceChecker().reset();
    }

    // Init
    var details = getCustomerDetails();

    if (details != null) {
        self.customerDetails(new customerDetails(details));
        self.loadCompetitors();
        self.loadSummary();
        self.loadPotential();
        self.initBrandsWorkedWithAutocomplete();
    }
}

var customerDetails = function (details) {
    var self = this;

    //console.log(details);

    self.notSet = "<span class='text-muted'>Not set</span>";

    self.currency = ko.observable(details.CustomerDetails.Currency);
    self.accountCurrency = details.CustomerDetails.AccountCurrency;
    self.currencyCulture = details.CustomerDetails.CurrencyCulture;
    self.currencyName = details.CustomerDetails.CurrencyName;

    self.groupName = details.CustomerDetails.GroupName;
    self.groupCode = details.CustomerDetails.GroupCode;
    self.language = details.CustomerDetails.Language;
    self.area = details.CustomerDetails.Area || self.notSet;
    self.region = details.CustomerDetails.Region || self.notSet;
    self.priceList = details.CustomerDetails.PriceList;
    self.tradePriceListId = details.CustomerDetails.PriceListID;
    self.primaryContact = details.CustomerDetails.PrimaryContact || self.notSet;
    self.creditLimit = details.CustomerDetails.CreditLimit || self.notSet;
    self.creditStatus = details.CustomerDetails.CreditStatus || self.notSet;
    self.patternBookScheme = details.CustomerDetails.PatternBookScheme || self.notSet;
    self.type = details.CustomerDetails.Type;
    self.name = details.CustomerDetails.Name;
    self.code = details.CustomerDetails.Code;
    self.status = details.CustomerDetails.Status;
    self.openSince = details.CustomerDetails.OpenSince;
    self.segment = details.CustomerDetails.Segment;
    self.addressLine1 = details.CustomerDetails.AddressLine1;
    self.addressLine2 = details.CustomerDetails.AddressLine2;
    self.addressLine3 = details.CustomerDetails.AddressLine3;
    self.addressLine4 = details.CustomerDetails.AddressLine4;
    self.address = ko.observable(new address(details.CustomerDetails.Address));
    self.postcode = details.CustomerDetails.Postcode;
    self.country = details.CustomerDetails.Country;
    self.email = details.CustomerDetails.Email;
    self.website = details.CustomerDetails.Website;
    self.phoneNumber = details.CustomerDetails.PhoneNumber;
    self.lastVisitId = details.CustomerDetails.LastTradeAccountVisitID;
    self.lastVisitDate = details.CustomerDetails.LastVisitDate;
    self.lastVisit = details.CustomerDetails.LastVisit || self.notSet;
    self.nextVisitId = details.CustomerDetails.NextTradeAccountVisitID;
    self.nextVisitDate = details.CustomerDetails.NextVisitDate;
    self.nextVisit = details.CustomerDetails.NextVisit || self.notSet;

    self.openOrders = 0;//details.CustomerDetails.OpenOrders;
    self.lastOrderHeadId = null;//details.CustomerDetails.LastOrderHeadID;
    self.lastOrderDate = null;//details.CustomerDetails.LastOrderDate;
    self.lastOrderText = null;//details.CustomerDetails.LastOrderText;

    if (details.OrderStatus != null) {
        self.openOrders = details.OrderStatus.OpenOrderCount;
        self.lastOrderHeadId = details.OrderStatus.LastOrderHeadID;
        self.lastOrderDate = details.OrderStatus.LastOrderDate;
        self.lastOrderText = details.OrderStatus.LastOrderText;
    }

    self.openCustomerCareRecords = 0;//details.CustomerDetails.OpenCustomerCareRecords;
    self.lastCareId = null; //details.CustomerDetails.LastCareID;
    self.lastCareDate = null;
    self.lastCareText = null;

    if (details.CareStatus != null) {
        self.openCustomerCareRecords = details.CareStatus.OpenCareRecordCount;
        self.lastCareId = details.CareStatus.LastCareHeadID;
        self.lastCareDate = details.CareStatus.LastCareHeadDate;
        self.lastCareText = details.CareStatus.LastCareHeadText;
    }

    self.openTasks = 0;//details.CustomerDetails.OpenTasks;
    self.lastTaskId = null;//details.CustomerDetails.LastTaskID;
    self.lastTaskDate = null;
    self.lastTaskText = null;

    if (details.TaskStatus != null) {
        self.openTasks = details.TaskStatus.OpenTaskCount;
        self.lastTaskId = details.TaskStatus.LastTaskID;
        self.lastTaskDate = details.TaskStatus.LastTaskDate;
        self.lastTaskText = details.TaskStatus.LastTaskText;
    }

    self.marketId = details.CustomerDetails.MarketID;
    self.marketName = details.CustomerDetails.MarketName;
    self.marketRank = details.CustomerDetails.MarketRank;
    self.marketAccounts = details.CustomerDetails.MarketAccounts;
    self.salesRepId = details.CustomerDetails.SalesRepresentativeID;
    self.salesRepCode = details.CustomerDetails.SalesRepresentativeCode;
    self.salesRepName = details.CustomerDetails.SalesRepresentativeName;
    self.salesRepEmail = details.CustomerDetails.SalesRepresentativeEmail;
    self.salesRepRank = details.CustomerDetails.SalesRepresentativeRank;
    self.salesRepAccounts = details.CustomerDetails.SalesRepresentativeAccounts;
    self.globalRank = details.CustomerDetails.GlobalRank;
    self.globalAccounts = details.CustomerDetails.GlobalAccounts;

    self.salesRepEmailDisplay = ko.pureComputed({
        read: function () {
            if (self.salesRepEmail)
                return "<a class='break-all' href='mailto:" + self.salesRepEmail.toLowerCase() + "'>" + (self.salesRepName || self.salesRepEmail.toLowerCase()) + "</a>";
            else if (self.salesRepName)
                return self.salesRepName;
            else 
                return self.notSet;
        }
    }, self);

    self.emailDisplay = ko.pureComputed({
        read: function () {
            if (self.email)
                return "<a class='break-all' href='mailto:" + self.email.toLowerCase() + "'>" + self.email.toLowerCase() + "</a>";
            else
                return self.notSet;
        }
    }, self);

    self.websiteDisplay = ko.pureComputed({
        read: function () {
            if (self.website)
                return "<a class='break-all' href='" + self.website.toLowerCase() + "'>" + self.website.toLowerCase() + "</a>";
            else
                return self.notSet;
        }
    }, self);

    self.salesRepDisplay = ko.pureComputed({
        read: function () {
            return self.salesRepCode + ' - ' + self.salesRepName;
        }
    }, self);

    self.salesRepRankDisplay = ko.pureComputed({
        read: function () {
            return self.salesRepRank + '<span class="divisor">/</span>' + self.salesRepAccounts;
        }
    }, self);

    self.marketRankDisplay = ko.pureComputed({
        read: function () {
            return self.marketRank + '<span class="divisor">/</span>' + self.marketAccounts;
        }
    }, self);

    self.globalRankDisplay = ko.pureComputed({
        read: function () {
            return self.globalRank + '<span class="divisor">/</span>' + self.globalAccounts;
        }
    }, self);

    self.typeDisplay = ko.pureComputed({
        read: function () {
            if (self.salesRepEmail)
                return self.type
            else
                return self.notSet;
        }
    }, self);

    self.phoneNumberDisplay = ko.pureComputed({
        read: function () {
            if (self.phoneNumber) {
                return "<a href='tel:" + self.phoneNumber.replace(/\s/g, '') + "'>" + self.phoneNumber + "</a>";
            } else {
                return self.notSet;
            }
        }
    }, self);

    self.creditLimitDisplay = ko.pureComputed({
        read: function () {
            return formatCurrency(self.creditLimit, 0, self.currencyCulture, self.displayCurrency());
        }
    }, self);

    self.latestTaskDisplay = ko.pureComputed({
        read: function () {
            if (self.lastTaskId == null) {
                return 'No Tasks';
            } else {
                return self.lastTaskId;
            }
        }
    }, self);

    self.nextVisitDisplay = ko.pureComputed({
        read: function () {
            if (self.nextVisitId == null) {
                return '<button class="btn btn-primary btn-sm">Book Visit</button>';
            } else {
                return self.nextVisit;
            }
        }
    }, self);

    self.displayName = ko.pureComputed({
        read: function () {
            var displayLine = "";
            displayLine += self.code + ' - ' + self.name;
            return displayLine;
        }
    }, self);

    self.openingTimesDisplay = ko.pureComputed({
        read: function () {
            return self.notSet;
        }
    }, self);

    self.displayStatus = ko.pureComputed({
        read: function () {
            var displayLine = "";
            if (self.status == "Open")
                displayLine += self.status + " <span class='smaller text-muted'>(Opened " + self.openSince.replace('(', '').replace(')', '') + ")</span>";
            else
                displayLine += self.status;
            return displayLine;
        }
    }, self);

    self.displayLastOrder = ko.pureComputed({
        read: function () {
            if (self.lastOrderDate != null) {
                return self.lastOrderHeadId + ' <span class="smaller">(' + self.lastOrderText + ')</span>';// + renderFullDate(self.lastOrderDate);
            } else {
                return null;
            }
        }
    }, self);

    self.displayLastCareRecords = ko.pureComputed({
        read: function () {
            return self.lastCareId;
        }
    }, self);

    self.loadAddressModal = function (customer) {
        $('#address-container').empty();
        $('#address-title').text(customer.name);
        $('#address-sub-title').empty();

        $("#address-container").append(self.getAddress(customer));

        $("#address-modal").modal('show');
    }
}

var address = function (address) {
    var self = this;

    self.addressId = ko.observable(address.AddressID);

    self.tradeAccountId = ko.observable(address.TradeAccountID);

    self.country = ko.observable(address.Country);

    self.line1 = ko.observable(address.AddressLine1);

    self.line2 = ko.observable(address.AddressLine2);

    self.town = ko.observable(address.Town);

    self.county = ko.observable(address.County);

    self.postcode = ko.observable(address.PostCode);

    self.appleMapsButton = ko.pureComputed({
        read: function () {
            if (self.line1() && self.country()) {
                var appleMapsHref = 'https://www.google.com/maps?saddr=My+Location&daddr=' +
                    encodeURIComponent(self.line1().replace(/\,$/, '')) + ',' +
                    encodeURIComponent(self.postcode()) + ',' +
                    encodeURIComponent(self.country().Code);
                var appleButton = '<a class="btn btn-secondary-blue directions-link btn-sm" target="_blank" href="' + appleMapsHref + '">Google Maps</a>'

                return appleButton;
            }
        }
    }, self);

    self.wazeButton = ko.pureComputed({
        read: function () {
            if (self.line1() && self.country()) {
                var wazeHref = 'waze://?q=' +
                    encodeURIComponent(self.line1().replace(/\,$/, '')) + ',' +
                    encodeURIComponent(self.postcode()) + ',' +
                    encodeURIComponent(self.country().Code);
                var wazeButton = '<a class="btn btn-secondary-blue directions-link btn-sm" target="_blank" href="' + wazeHref + '">Waze</a>';

                return wazeButton;
            }
        }
    }, self);

    self.googleStreetViewBusy = ko.observable(false);

    self.googleStreetViewHref = ko.observable();

    self.latitude = ko.observable(address.Latitude);
    self.longitude = ko.observable(address.Longitude);
    self.latLngFailure = ko.observable(false);

    self.fetchGoogleStreetView = function () {

        //if (!self.latitude() || !self.longitude()) {

        // get lat / long for address
        // build streetmaps url using https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=lat,long
        // launch into new window

        self.googleStreetViewBusy(true);

        // get address 
        if (self.line1() || self.line2() || self.town() || self.county() || self.postcode()) {
            var addressLine = "";
            if (self.line1())
                addressLine += self.line1();
            if (self.line2())
                addressLine += ',' + self.line2();
            if (self.town())
                addressLine += ',' + self.town();
            if (self.county())
                addressLine += ',' + self.county();
            if (self.postcode())
                addressLine += ',' + self.postcode();
            if (self.country().Code)
                addressLine += ',' + self.country().Code;

            addressLine = encodeURIComponent(addressLine);

            var lat = null;
            var long = null;
            var failureResult = 'javascript:$.info("Sorry", "Google\'s StreetView API was unable to return a panorama for this address within a 500m radius");';
            if (addressLine == "") {
                self.googleStreetViewBusy = ko.observable(false);
                self.googleStreetViewHref(failureResult);
                return;
            }
            try {
                // cannot return value to function from an ajax operation; loadGoogleStreetView returns before this ajax function has
                // finished so result is not set.
                // hmm.
                // assigning to an observable would work but... we want to be able to do this for 
                // Address objects returned directly from the server, which are not modelled client side.


                //having changed primary address, the new address did lend a marker but the old marker still existed
                // and the old marker was centered upon

                var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + addressLine + '&key=AIzaSyCWJjgaoe44VzpTMbmI87tnTrdKQItgEEs'

                $.ajax({
                    dataType: "json",
                    url: url,
                    success: function (data) {
                        if (data.status == "OK") {
                            if (data.results.length > 0) {
                                // hopefully they order it by relevance. If not, oh well.
                                if (data.results[0].hasOwnProperty('geometry')) {
                                    if (data.results[0].geometry.hasOwnProperty('location')) {
                                        lat = data.results[0].geometry.location.lat;
                                        lng = data.results[0].geometry.location.lng;

                                        var panoRequest = {
                                            location: data.results[0].geometry.location,
                                            preference: google.maps.StreetViewPreference.NEAREST,
                                            radius: 50,
                                            source: google.maps.StreetViewSource.OUTDOOR
                                        };

                                        self.findPanorama(50, panoRequest);

                                        //self.googleStreetViewHref('https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=' + lat + ',' + lng);
                                        self.latitude(lat);
                                        self.longitude(lng);
                                        //self.googleStreetViewBusy(false);
                                        self.saveLatLng();
                                    }
                                }
                            } else {
                                self.googleStreetViewHref(failureResult);
                                //self.googleStreetViewBusy(false);
                                self.latLngFailure(true);
                            }
                        } else {
                            var secondAttempt = "";

                            if (self.line2())
                                secondAttempt += self.line2();
                            if (self.town())
                                secondAttempt += ',' + self.town();
                            if (self.county())
                                secondAttempt += ',' + self.county();
                            if (self.postcode())
                                secondAttempt += ',' + self.postcode();
                            if (self.country().Code)
                                secondAttempt += ',' + self.country().Code;

                            secondAttempt = encodeURIComponent(secondAttempt);

                            var url2 = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + secondAttempt + '&key=AIzaSyCWJjgaoe44VzpTMbmI87tnTrdKQItgEEs'

                            $.ajax({
                                dataType: "json",
                                url: url2,
                                success: function (data2) {
                                    if (data2.status == "OK") {
                                        if (data2.results.length > 0) {
                                            // hopefully they order it by relevance. If not, oh well.
                                            if (data2.results[0].hasOwnProperty('geometry')) {
                                                if (data2.results[0].geometry.hasOwnProperty('location')) {
                                                    lat = data2.results[0].geometry.location.lat;
                                                    lng = data2.results[0].geometry.location.lng;

                                                    var svService = new google.maps.StreetViewService();
                                                    var panoRequest = {
                                                        location: data2.results[0].geometry.location,
                                                        preference: google.maps.StreetViewPreference.NEAREST,
                                                        radius: 50,
                                                        source: google.maps.StreetViewSource.OUTDOOR
                                                    };

                                                    self.findPanorama(50, panoRequest);

                                                    //self.googleStreetViewHref('https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=' + lat + ',' + lng);
                                                    self.latitude(lat);
                                                    self.longitude(lng);
                                                    //self.googleStreetViewBusy(false);
                                                    self.saveLatLng();
                                                }
                                            }
                                        } else {
                                            self.googleStreetViewHref(failureResult);
                                            self.googleStreetViewBusy(false);
                                            self.latLngFailure(true);
                                        }
                                    } else {
                                        self.googleStreetViewHref(failureResult);
                                        //self.googleStreetViewBusy(false);
                                        self.latLngFailure(true);
                                    }
                                }
                            });
                        }
                    }
                });
            } catch (e) {
                self.googleStreetViewHref(failureResult);
                self.googleStreetViewBusy(false);
                self.latLngFailure(true);
            }
        } else {
            self.googleStreetViewHref(failureResult);
            self.googleStreetViewBusy(false);
            self.latLngFailure(true);
        }
        //} else {
        //    self.googleStreetViewHref('https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=' + self.latitude() + ',' + self.longitude());
        //    console.log('already had lat,lng: ' + self.latitude() + ', ' + self.longitude());
        //}
    }

    self.findPanorama = function (radius, panoRequest) {

        var svService = new google.maps.StreetViewService();

        console.log('findPanorama called radius: ' + radius);

        panoRequest.radius = radius;
        svService.getPanorama(panoRequest, function (panoData, status) {
            if (status === google.maps.StreetViewStatus.OK) {

                console.log(panoData);
                //self.googleStreetViewHref(panoData.links.pano);

                self.googleStreetViewHref('https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=' + self.latitude() + ',' + self.longitude() + '&pano=' + panoData.links[0].pano);
                self.googleStreetViewBusy(false);
                //links[0].pano

                //var panorama = new google.maps.StreetViewPanorama(
                //    document.getElementById('street-view'),
                //    {
                //        pano: panoData.location.pano,
                //    });
            } else {
                //Handle other statuses here
                if (radius > 500) {
                    console.log('tried radius up to 500m, street view pano not available.')
                    self.googleStreetViewHref(failureResult);
                    self.googleStreetViewBusy(false);
                    //alert("Street View is not available");
                } else {
                    self.findPanorama(radius + 10, panoRequest);
                }
            }
        });
    };

    $(document).ready(function () {
        self.fetchGoogleStreetView();
    })

    self.saveLatLng = function () {
        $.ajax({
            url: '/customers/enquiry/SaveTradeAccountAddressLatLng',
            type: 'POST',
            dataType: 'json',
            data: {
                tradeAccountId: self.tradeAccountId(),
                lat: self.latitude(),
                lng: self.longitude()
            }
        });
    }

    self.displayLine = ko.pureComputed({
        read: function () {
            var addressLine = "";
            if (self.line1())
                addressLine += self.line1();
            if (self.line2())
                addressLine += ',' + self.line2();
            if (self.town())
                addressLine += ',' + self.town();
            if (self.county())
                addressLine += ',' + self.county();
            if (self.postcode())
                addressLine += ',' + self.postcode();
            if (self.country().Code)
                addressLine += ',' + self.country().Code;
            return addressLine;
        }
    }, self);
}

var tradeAccountSummary = function (data, busy, tradeAccountId, customerDetails) {
    var self = this;

    self.netSales = ko.observable(data.netSales);
    self.busy = busy;
    self.tradeAccountId = tradeAccountId;

    self.brandId = ko.observable();

    self.brandId.subscribe(function (newValue) {
        self.refresh();
    });

    self.productTypeGroupId = ko.observable();

    self.productTypeGroupId.subscribe(function (newValue) {
        self.refresh();
    });

    self.customerDetails = customerDetails;

    self.formatCustomerCurrency = function (val) {
        if (self.customerDetails()) {
            if (self.customerDetails().currency()) {
                return formatCurrency(val, 0, self.customerDetails().currency().FormattingCulture, self.customerDetails().currency().Code);
            }
        }
        return val;
    }

    self.formatNumber = function (val) {
        return formatNumber(val, 0, 'en-GB');
    }

    self.refresh = function () {
        self.busy(true);

        $.ajax({
            url: '/customers/enquiry/loadSummary',
            type: 'POST',
            dataType: 'json',
            data: {
                tradeAccountId: self.tradeAccountId(),
                brandId: self.brandId(),
                productTypeGroupId: self.productTypeGroupId()
            },
            success: function (data) {
                console.log(data);
                self.netSales(data.netSales);
                self.busy(false);
            },
            error: function (xhr, e, s) {
                self.busy(false);
                //$.showError(xhr, e, s);
            }
        });
    }
}