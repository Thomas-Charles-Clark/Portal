var tradeAccountSelector = function (preselectedTradeAccount, selectFunction, parent) {
    var self = this;

    self.parent = parent;

    self.selectFunction = selectFunction;

    self.name = ko.pureComputed({
        read: function() { 
            if (self.selected()) {
                return self.selected().Label
            } else {
                return null;
            }
        }
    }, self);

    self.title = ko.pureComputed({
        read: function () {
            if (self.name()) {
                return "Account: " + self.name();
            }
            return "Select an Account";
        }
    }, self);

    self.tradeMarketParams = {
        observable: ko.observable(-1),
        label: 'Market',
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        options: getTradeMarkets(),
        optionsText: 'Name',
        optionsValue: 'TradeMarketID',
        optionsCaption: null,
        width: 'auto',

        // new, modern, shiny properties for use in layout-new.cshtml...
        clearable: ko.observable(true),
        revertable: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false)
    };

    self.tradeMarketParams.observable.subscribe(function (newValue) {
        console.log('tradeMarketParams observable subscribe hit', newValue);
        self.clearSearch();
    });

    self.canSearch = ko.observable(getCanSearchTradeAccounts());

    self.preselected = preselectedTradeAccount;

    self.selected = ko.observable(self.preselected || getSelectedTradeAccount());

    if (self.selected())
        self.selected().paymentTerms = ko.observable(self.selected() ? self.selected().PaymentTerms : undefined);

    self.selected.subscribe(function (newValue) {
        console.log('selected subscribe hit', newValue);
    });

    self.selected.subscribe(function (newValue) {
        if (newValue) {
            newValue.paymentTerms = ko.observable(newValue.PaymentTerms);
            $.ajax({
                url: "/Component/SetSelectedTradeAccount",
                type: "POST",
                dataType: "json",
                data: {
                    tradeAccountId: self.selected().TradeAccountID,
                }
            });
        } else {
            $.ajax({
                url: "/Component/SetSelectedTradeAccount",
                type: "POST",
                dataType: "json",
                data: {
                    tradeAccountId: null
                }
            });
        }
    });

    self.clearSearch = function () {
        if (self.tradeAccountAutocomplete.observable.DOMElement) {
            self.tradeAccountAutocomplete.clearFunction();
        } else {
            $("#account-number").val(null);
            $("#account-number").data("ui-autocomplete").term = null;
            $("#account-number").focus();
            self.selected(null);
        }
    }

    self.performSearch = function () {
        $("#account-number").autocomplete("search");
    }

    self.tradeAccountAutocomplete = {
        label: 'Search by Name or Account Number',
        observable: ko.observable(preselectedTradeAccount ? preselectedTradeAccount.Label : undefined),
        focusObservable: ko.observable(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,

        // new, modern, shiny properties for use in layout-new.cshtml...
        clearable: ko.observable(true),
        revertable: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false),

        // other old crap
        showClear: true,
        clearFunction: function () {
            self.selected(undefined);
            self.tradeAccountAutocomplete.autocompleteSettings.observable(undefined);
            self.tradeAccountAutocomplete.observable(undefined);
            $(self.tradeAccountAutocomplete.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        },
        disabled: ko.observable(false),
        readOnly: ko.observable(false),
        autocompleteSettings: {
            value: self.selected,
            observable: ko.observable(),
            appendTo: 'body',
            source: function (request, response) {
                var data = {
                    term: request.term
                }
                if (self.tradeMarketParams.observable()) {
                    data.marketId = self.tradeMarketParams.observable()
                }
                self.tradeAccountAutocomplete.busy(true);
                $.ajax({
                    url: "/api/componentapi/AccountNumberAutocomplete",
                    type: "POST",
                    dataType: "json",
                    data: data,
                    success: function (data) {
                        if (data.length) {
                            response($.map(data, function (item) {
                                return {
                                    label: item.Label,
                                    value: item
                                }
                            }));
                            self.tradeAccountAutocomplete.busy(false);
                        } else {
                            response([{
                                label: 'No results found, try "All Markets"',
                                value: 'No results'
                            }])
                            self.tradeAccountAutocomplete.busy(false);
                        }
                    }
                });
            },
            minLength: 2,
            select: function (event, ui) {

                if (ui.item.value.RetailTill == 0 && ui.item.value.TradePriceListType == 'Inc' && viewModel.hasOwnProperty('orderProductsDrilldown')) {
                    $.error('Retail Price List Detected', ui.item.value.Code + ' is associated to a Retail Price List (' + ui.item.value.PriceList + '), but is not marked as being able to to utilise Retail Till functionality. As such, this account cannot place orders here');

                    self.selected(undefined);
                    $(self.tradeAccountAutocomplete.observable.DOMElement).val('');

                    event.preventDefault();
                } else {
                    if (ui.item.value != 'No results') {
                        event.preventDefault();
                        self.selected(ui.item.value);
                        $(self.tradeAccountAutocomplete.observable.DOMElement).val(ui.item.label);
                        if (self.selectFunction) {
                            self.selectFunction(ui.item.value);
                        }
                    }

                    //event.preventDefault();
                    //if (ui.item.value != 'No results') {
                    //    $("#account-number").val(ui.item.value.Label);
                    //    $("#trade-account-collapse").collapse('hide');
                    //    if (self.selected() == null)
                    //        self.selected(ui.item.value);
                    //    else if (self.selected().TradeAccountID != ui.item.value.TradeAccountID) {
                    //        self.selected(ui.item.value);
                    //    }
                    //    if (self.selectFunction) {
                    //        self.selectFunction(ui.item.value);
                    //    }
                    //}
                }

            },
            focus: function (event, ui) {
                $(self.selected.DOMElement).val(ui.item.label);
                return false;
            },
            readOnly: false,
            autoFocus: false
        }
    };

    self.initAutocomplete = function (observable) {
        $("#account-number").autocomplete({
            classes: {
                'account-no': 'account-no'
            },
            appendTo: '#account-selector',
            source: function (request, response) {
                var data = {
                    term: request.term
                }
                if (self.tradeMarketParams.observable()) {
                    data.marketId = self.tradeMarketParams.observable() 
                }
                $.ajax({
                    url: "/api/componentapi/AccountNumberAutocomplete",
                    type: "POST",
                    dataType: "json",
                    data: data,
                    success: function (data) {
                        if (data.length) {
                            response($.map(data, function (item) {
                                return {
                                    label: item.Label,
                                    value: item
                                }
                            }));
                        } else {
                            response([{
                                label: 'No results found, try "All Markets"',
                                value: 'No results'
                            }])
                        }
                    }
                });
            },
            minLength: 2,
            open: function (event, ui) {
                $('.ui-autocomplete').off('menufocus hover mouseover');
            },
            select: function (event, ui) {
                event.preventDefault();
                if (ui.item.value != 'No results') {
                    $("#account-number").val(ui.item.value.Label);
                    $("#trade-account-collapse").collapse('hide');
                    if (observable() == null)
                        observable(ui.item.value);
                    else if (observable().TradeAccountID != ui.item.value.TradeAccountID) {
                        observable(ui.item.value);
                    }
                    if (self.selectFunction) {
                        self.selectFunction(ui.item.value);
                    }
                }
            },
            focus: function (event, ui) {
                $("#account-number").val(ui.item.label);
                return false;
            },
            delay: 800,
            autoFocus: false
            //,open: function (event, ui) {
            //    if (navigator.userAgent.match(/iP/)) {
            //        $('.ui-autocomplete').off('menufocus hover mouseover');
            //    }
            //}
        });
    }

    if (self.canSearch()) {
        self.initAutocomplete(self.selected);
    }

    self.reset = function () {
        self.selected(undefined);
        self.selected(self.preselected || getSelectedTradeAccount())
        if (self.selected()) {
            self.tradeAccountAutocomplete.autocompleteSettings.observable(self.selected().Label);
        }
    }

    if (self.selected()) {
        self.tradeAccountAutocomplete.autocompleteSettings.observable(self.selected().Label);
    }
}