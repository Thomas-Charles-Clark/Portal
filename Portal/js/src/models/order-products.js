const
    TRANSACTION_TYPE_ORDER = 1,
    TRANSACTION_TYPE_REPLACEMENT = 2,
    TRANSACTION_TYPE_CONTRACT = 3,
    ORDERFACTORY_SEARCH_TYPE_ALL = 'all',
    ORDERFACTORY_SEARCH_TYPE_CLEARANCE = 'clearance',
    ORDERFACTORY_SEARCH_TYPE_CURRENT = 'current',
    ORDERFACTORY_SEARCH_TYPE_PRELAUNCH = 'prelaunch',
    ORDERFACTORY_FILTER_MODE_STANDARD = 0,
    ORDERFACTORY_FILTER_MODE_ADVANCED = 1,
    ORDERFACTORY_MODE_STANDARD = 0,
    ORDERFACTORY_MODE_BESPOKE_FABRIC_HANGERS = 1,
    ORDERFACTORY_MODE_BESPOKE_FABRIC_SHOWLENGTHS = 2,
    ORDERFACTORY_MODE_BESPOKE_WALLPAPER_SHOWLENGTHS = 3,
    ORDERFACTORY_MODE_BESPOKE_RUGS = 4,
    ORDERFACTORY_MODE_BESPOKE_FURNITURE = 5,
    ORDERFACTORY_MODE_BESPOKE_ARCHITECT = 6,
    ORDERFACTORY_MODE_QUICKDISPLAYS = 6,
    ORDERFACTORY_PHASE_BLANK = -1,
    ORDERFACTORY_PHASE_MISC = 0,
    ORDERFACTORY_PHASE_ADDRESS = 1,
    ORDERFACTORY_PHASE_PREAMBLE = 2,
    ORDERFACTORY_PHASE_SEARCH = 3,
    ORDERFACTORY_PHASE_BASKET = 4,
    ORDERFACTORY_PHASE_SHIPPINGCHECK = 5,
    ORDERFACTORY_PHASE_DISPATCH = 6,
    ORDERFACTORY_PHASE_DELIVERY_ALERT = 7,
    ORDERFACTORY_PHASE_COMMENTS = 8,
    ORDERFACTORY_PHASE_REVIEW_VATNUMBER = 9,
    ORDERFACTORY_PHASE_REVIEW_MANAGER_DISCO = 10,
    ORDERFACTORY_PHASE_REVIEW_DUPLICATES = 11,
    ORDERFACTORY_PHASE_REVIEW_FOC = 12,
    ORDERFACTORY_PHASE_REVIEW_FOC_ERROR = 12.1,
    ORDERFACTORY_PHASE_REVIEW_HOLD = 13,
    ORDERFACTORY_PHASE_RETAIL = 14,
    ORDERFACTORY_PHASES = [{
        ORDERFACTORY_PHASE_BLANK: -1,
        ORDERFACTORY_PHASE_MISC: 0,
        ORDERFACTORY_PHASE_ADDRESS: 1,
        ORDERFACTORY_PHASE_PREAMBLE: 2,
        ORDERFACTORY_PHASE_SEARCH: 3,
        ORDERFACTORY_PHASE_BASKET: 4,
        ORDERFACTORY_PHASE_SHIPPINGCHECK: 5,
        ORDERFACTORY_PHASE_DISPATCH: 6,
        ORDERFACTORY_PHASE_DELIVERY_ALERT: 7,
        ORDERFACTORY_PHASE_COMMENTS: 8,
        ORDERFACTORY_PHASE_REVIEW_VATNUMBER: 9,
        ORDERFACTORY_PHASE_REVIEW_MANAGER_DISCO: 10,
        ORDERFACTORY_PHASE_REVIEW_DUPLICATES: 11,
        ORDERFACTORY_PHASE_REVIEW_FOC: 12,
        ORDERFACTORY_PHASE_REVIEW_FOC_ERROR: 12.1,
        ORDERFACTORY_PHASE_REVIEW_HOLD: 13,
        ORDERFACTORY_PHASE_RETAIL: 14
    }],
    ORDERFACTORY_ADD_MODE_STOCK = 1, // 0 is missed because this has to tie to portal.OrderType
    ORDERFACTORY_ADD_MODE_DISPLAY = 2,
    ORDERFACTORY_ADD_MODE_RESERVE = 3,
    BASKETITEM_TYPE_STANDARD = 1, // 0 is missed because this has to tie to portal.BasketItemType
    BASKETITEM_TYPE_BESPOKEHANGER = 2,
    BASKETITEM_TYPE_BESPOKESHOWLENGTH = 3,
    BASKETITEM_TYPE_BESPOKEWALLPAPERSHOWLENGTH = 4,
    BASKETITEM_TYPE_BESPOKERUG = 5,
    BASKETITEM_TYPE_BESPOKEFURNITURE = 6,
    BASKETITEM_TYPE_BESPOKEARCHITECTRING = 7,
    BASKETITEM_TYPE_BESPOKESHELFSAMPLE = 8,
    RUG_TYPE_RECTANGULAR = 'Rectangular',
    RUG_TYPE_ROUND = 'Round',
    ORDERFACTORY_SEARCH_DISPLAY_GRID = 0,
    ORDERFACTORY_SEARCH_DISPLAY_LIST = 1,
    ORDERFACTORY_VIEWING_MODE_ORDER = 0,
    ORDERFACTORY_VIEWING_MODE_BROWSE = 1,
    PATTERNBOOK_DISPLAY_CURRENT = 1,
    PATTERNBOOK_DISPLAY_LIMITED_DISCO = 2,
    ADVANCED_STAGE_BESPOKE_FABRIC_HANGER = 1,
    ADVANCED_STAGE_BESPOKE_FABRIC_SHOWLENGTH = 2,
    ADVANCED_STAGE_BESPOKE_FABRIC_SHELFSAMPLE = 3,
    ADVANCED_STAGE_BESPOKE_WALLPAPER_SHOWLENGTH = 4,
    ADVANCED_STAGE_BESPOKE_RUG = 5,
    ADVANCED_STAGE_BESPOKE_FURNITURE = 6,
    ADVANCED_STAGE_BESPOKE_FURNITURE_FABRIC = 6.1,
    ADVANCED_STAGE_BESPOKE_FURNITURE_FABRIC_ALLOCATION = 6.2,
    ADVANCED_STAGE_BESPOKE_ARCHITECT_RING = 7,
    ADVANCED_STAGE_REVIEW_ALLOCATION = 8,
    ADVANCED_STAGE_APPLY_TREATMENT = 9,
    ADVANCED_STAGE_REVIEW_PRICING = 10,
    ADVANCED_STAGE_REVIEW_MEMOS = 11,
    ALLOCATION_WARNING_BUTTON_AMEND = 0,
    ALLOCATION_WARNING_BUTTON_ORDER_X_BACKORDER_Y = 1,
    ALLOCATION_WARNING_BUTTON_REDUCE_QUANTITY = 2,
    ALLOCATION_WARNING_BUTTON_CANCEL_LINE = 3,
    ALLOCATION_WARNING_BUTTON_BACKORDER = 4,
    PAYEE_DESIGNERSGUILD = 1,
    PAYEE_CUSTOMER = 2,
    NONCONSOLIDATED_SHIPMENT = 0,
    CONSOLIDATED_SHIPMENT = 1,
    DISCOUNT_STATE_MONETARY = 0,
    DISCOUNT_STATE_PERCENTAGE = 1,
    HALLOWEEN_RANDOM_MESSAGES = [
        '<span class="shake shake-constant">WooooOOOoooooOOoooOooooo!</span>',
        '<span class="shake shake-constant">BOO!!!</span>',
        'While I nodded, nearly napping, suddenly there came a tapping,\n\
         As of someone gently rapping, rapping at my chamber door...<br/><br/><span class="attribution">Edgar Allen Poe</span>',
        'Quoth the Raven “Nevermore.”<br/><br/><span class="attribution">Edgar Allen Poe</span>',
        'By the pricking of my thumbs,\n\
Something wicked this way comes...<br/><br/><span class="attribution">William Shakespeare</span>',
        '<span class="shake shake-constant">Eeeeeeek!</span>',
        'Yesterday, upon the stair,\n\
I saw a man who wasn\'t there!\n\
He wasn\'t there again today,\n\
Oh how I wish he\'d go away!<br/><br/><span class="attribution">William Hughes Mearns</span>',
        '<span class="shake shake-constant">AaaaAAaAAAIEeeeeeee!!!</span>',
        'Listen to them, the children of the night.\n\
What music they make!<br/><br/><span class="attribution">Bram Stoker</span>',
        'I dwell in a lonely house I know\n\
That vanished many a summer ago<br/><br/><span class="attribution">Robert Frost</span>',
        'We ask only to be reassured about the noises in the cellar\n\
and the window that should not have been open...<br/><br/><span class="attribution">T.S. Eliot</span>',
        '<span class="shining">All work and no play makes Jack a dull boy</span>\
<span class="shining">All work and no play makes Jack a dull boy</span>\
<span class="shining">All work and no play makes Jack a dull boy</span>\
<span class="shining">All work and no play makes Jack a dull boy</span>\
<span class="shining">All work and no play makes Jack a dull boy</span>\
<span class="shining">All work and no play makes Jack a dull boy</span>\
<span class="shining">All work and no play makes Jack a dull boy</span>\
<span class="shining">All work and no play makes Jack a dull boy</span>\
<span class="shining">All work and no play makes Jack a dull boy</span>\
<span class="shining">All work and no play makes Jack a dull boy</span>\
<span class="shining">All work and no play makes Jack a dull boy</span>\
<span class="shining">All work and no play makes Jack a dull boy</span>\
<br/><br/><span class="attribution">Stephen King</span>',
        'Double, double, toil and trouble;\n\
Fire burn and cauldron bubble!<br/><br/><span class="attribution">William Shakespeare</span>'
    ]

// this must be referred to by the parent as "orderFactory".
var orderProductsViewModel = function (parent, tradeAccountObservable) {

    // #region Sanity Checks

    if (parent == null) {
        console.error('orderProductsViewModel demands parent');
        return;
    }

    if (!parent.hasOwnProperty('tradeAccount') && typeof tradeAccountObservable === 'undefined') {
        console.error('orderProductsViewModel demands either that parent.tradeAccount be an observable, or that a tradeAccountObservable is passed as the second parameter to the ctor');
        return;
    }

    if (!ko.isObservable(parent.tradeAccount) && !ko.isObservable(tradeAccountObservable)) {
        console.error('orderProductsViewModel demands either that parent.tradeAccount be an observable, or that a tradeAccountObservable is passed as the second parameter to the ctor');
        return;
    }

    if (!parent.hasOwnProperty('orderProductsDrilldown')) {
        console.error('orderProductsViewModel demands parent.orderProductsDrilldown be an instance of orderProductsDrilldownViewModel');
        return;
    }

    if (!window.hasOwnProperty('formatSelectedCurrency')) {
        console.error('orderProductsViewModel demands window.formatSelectedCurrency, which should pick up on a currency from a selected trade account or their price list.');
        return;
    }

    // #endregion

    var self = this;

    self.parent = parent;

    // #region Properties (observables, observableArrays, other)

    // are we busy resetting? disable the Start Order and Browse buttons if we are
    self.isResetting = ko.observable(false);
    self.isResetting.subscribe(function (newValue) {
        console.log('isResetting', newValue);
    });

    // has the user actively refused a Loqate recommendation for the delivery address on this basket
    self.userRefusedAddressRecommendation = ko.observable(false);

    // holds the results of submission
    self.basketSubmissionResults = ko.observableArray([]);

    // holds the result of parsing submissionResultJson for messages.
    self.submissionResultText = ko.observable();

    self.isViewingRetailPaymentModal = ko.observable(false);

    self.validateBasketPhaseNow = ko.observable(false);

    self.lastPhaseVisited = ko.observable();

    self.lastPhaseVisited.subscribe(function (newValue) {
        console.log('orderFactory lastPhaseVisited subscribe hit', newValue);
    });

    self.phaseButtons = [{
        phases: [ORDERFACTORY_PHASE_MISC],
        name: 'Invoice Address',
        visible: ko.pureComputed(function () {
            return self.miscTradeAccount();
        }, self),
        enabled: ko.pureComputed(function () {
            return !self.busy() && (self.miscTradeAccount());
        }),
        click: function () {
            self.phase(ORDERFACTORY_PHASE_MISC);
        }
    }, {
        phases: [ORDERFACTORY_PHASE_ADDRESS],
        name: 'Delivery Address',
        visible: true,
        enabled: ko.pureComputed(function () {
            if (self.miscTradeAccount()) {
                return !self.busy() && (self.miscInvoiceAddress.errors().length == 0) && (self.lastPhaseVisited() >= ORDERFACTORY_PHASE_MISC);
            } else {
                return !self.busy() && (true);
            }
        }, self),
        click: function () {
            self.phase(ORDERFACTORY_PHASE_ADDRESS);
        }
    }, {
        phases: [ORDERFACTORY_PHASE_PREAMBLE],
        name: 'Order Details',
        visible: true,
        enabled: ko.pureComputed(function () {
            return !self.busy() &&
                (self.basketServerObject()) &&
                //(self.basketServerObject().CustomerRequestDeliveryAddress == null) && // commented out 07/09/2021, can't see why this should be here 
                (self.deliveryAddress.errors().length == 0) &&
                (self.lastPhaseVisited() >= ORDERFACTORY_PHASE_ADDRESS) &&
                (self.deliveryAddress.deliveryReference());
        }, self),
        click: function () {
            self.phase(ORDERFACTORY_PHASE_PREAMBLE);
        }
    }, {
        phases: [ORDERFACTORY_PHASE_SEARCH],
        name: 'Product Search',
        visible: true,
        enabled: ko.pureComputed(function () {
            // we need some concept of the maximum stage visited by this basket.
            // why...?
            if (!self.busy()) {
                if (self.basketServerObject()) {
                    if (typeof self.basketServerObject().mertexVATLookupSuccessful === 'function')
                        return (self.basketServerObject().mertexVATLookupSuccessful()) &&
                            (self.deliveryAddress.errors().length == 0) &&
                            (self.lastPhaseVisited() >= ORDERFACTORY_PHASE_PREAMBLE)
                    else {
                        return false;
                    }
                } else {
                    return true;
                }
            }
            return false;
        }, self),
        click: function () {
            self.saveBasketDetails(function () {
                self.phase(ORDERFACTORY_PHASE_SEARCH);
            });
        }
    }, {
        phases: [ORDERFACTORY_PHASE_BASKET],
        name: 'Basket',
        visible: true,
        enabled: ko.pureComputed(function () {
            return !self.busy() && (self.lastPhaseVisited() >= ORDERFACTORY_PHASE_SEARCH);
        }, self),
        click: function () {
            if (self.phase() != ORDERFACTORY_PHASE_BASKET) {
                self.busy(true);
                self.busyMessage('Loading Basket');
                self.phase(ORDERFACTORY_PHASE_BASKET);
            }
        }
    }, {
        phases: [ORDERFACTORY_PHASE_DISPATCH,
            ORDERFACTORY_PHASE_SHIPPINGCHECK],
        name: 'Despatch',
        visible: true,
        enabled: ko.pureComputed(function () {
            return !self.busy() && (self.basket().length > 0) && ([
                ORDERFACTORY_PHASE_BASKET,
                ORDERFACTORY_PHASE_COMMENTS,
                ORDERFACTORY_PHASE_REVIEW_VATNUMBER,
                ORDERFACTORY_PHASE_REVIEW_MANAGER_DISCO,
                ORDERFACTORY_PHASE_REVIEW_DUPLICATES,
                ORDERFACTORY_PHASE_REVIEW_FOC,
                ORDERFACTORY_PHASE_REVIEW_HOLD].indexOf(self.lastPhaseVisited()) > -1);
        }, self),
        click: function () {
            self.validateBasketPhase(function () {
                self.busy(true);
                self.phase(ORDERFACTORY_PHASE_DISPATCH);
            });
        }
    }, {
        phases: [ORDERFACTORY_PHASE_COMMENTS],
        name: 'Comments',
        visible: true,
        enabled: ko.pureComputed(function () {
            return !self.busy() &&
                (self.dispatchFactory.deliveryGroups().length > 0) &&
                (self.dispatchFactory.basketDeliveryErrors().length == 0) &&
                ([
                    ORDERFACTORY_PHASE_DISPATCH,
                    ORDERFACTORY_PHASE_REVIEW_VATNUMBER,
                    ORDERFACTORY_PHASE_REVIEW_MANAGER_DISCO,
                    ORDERFACTORY_PHASE_REVIEW_DUPLICATES,
                    ORDERFACTORY_PHASE_REVIEW_FOC,
                    ORDERFACTORY_PHASE_REVIEW_HOLD].indexOf(self.lastPhaseVisited()) > -1)
        }, self),
        click: function () {
            self.dispatchFactory.saveDeliveryOptions(function () {
                self.phase(ORDERFACTORY_PHASE_DELIVERY_ALERT);
            });
        }
    }, {
        phases: [ORDERFACTORY_PHASE_REVIEW_VATNUMBER,
            ORDERFACTORY_PHASE_REVIEW_MANAGER_DISCO,
            ORDERFACTORY_PHASE_REVIEW_DUPLICATES,
            ORDERFACTORY_PHASE_REVIEW_FOC,
            ORDERFACTORY_PHASE_REVIEW_HOLD],
        name: 'Review Order',
        visible: true,
        enabled: ko.pureComputed(function () {
            return !self.busy() && (self.lastPhaseVisited() == ORDERFACTORY_PHASE_COMMENTS || self.lastPhaseVisited() == ORDERFACTORY_PHASE_RETAIL);
        }, self),
        click: function () {
            self.saveClauses(function () {
                self.saveBasketComments(function () {
                    self.saveBasketNotes(function () {
                        self.phase(ORDERFACTORY_PHASE_REVIEW_VATNUMBER);
                    }, function () {
                        self.busy(false);
                        self.phase(ORDERFACTORY_PHASE_COMMENTS)
                    });
                }, function () {
                    self.busy(false);
                    self.phase(ORDERFACTORY_PHASE_COMMENTS)
                });
            }, function () {
                self.busy(false);
                self.phase(ORDERFACTORY_PHASE_COMMENTS)
            });
        }
    }, {
        phases: [ORDERFACTORY_PHASE_RETAIL],
        name: 'Retail Till',
        visible: ko.pureComputed(function () {
            return self.retailTradeAccount();
        }, self),
        enabled: ko.pureComputed(function () {
            return !self.busy() && (self.phase() == ORDERFACTORY_PHASE_REVIEW_HOLD && self.retailTradeAccount())
        }, self),
        click: function () {
            self.busyMessage('Fetching Retail Till Information...');
            self.fetchRetailTills(function () {
                self.phase(ORDERFACTORY_PHASE_RETAIL);
            });
        }
    },
    {
        phases: [],
        name: 'Submit Order',
        visible: true,
        enabled: ko.pureComputed(function () {
            return !self.busy() && ((self.phase() == ORDERFACTORY_PHASE_REVIEW_HOLD && !self.retailTradeAccount()) ||
                (self.phase() == ORDERFACTORY_PHASE_RETAIL && self.retailTradeAccount()));
        }, self),
        click: function () {
            if (!self.retailTradeAccount()) {
                self.submitOrder()
            } else {
                self.validateRetailPayment();
            }
        }
    }];

    // holds the data from the final review select stage
    self.basketReview = ko.observable();

    self.basketReviewStageZeroNotices = ko.pureComputed(function () {
        if (self.basketReview()) {
            return Enumerable.From(self.basketReview().SummaryNotices).Where('$.CheckStageID == 0').ToArray()
        } else {
            return [];
        }
    });

    self.basketReviewStageOneNotices = ko.pureComputed(function () {
        if (self.basketReview()) {
            return Enumerable.From(self.basketReview().SummaryNotices).Where('$.CheckStageID == 1').ToArray()
        } else {
            return [];
        }
    }, self);

    self.basketReviewStageOneProducts = ko.pureComputed(function () {
        if (self.basketReview()) {
            var products = Enumerable.From(self.basket()).Where(function (z) {
                return Enumerable.From(self.basketReview().BasketItemNotices).Where(function (y) {
                    return (y.CheckStageID == 1) &&
                        (y.BasketItemID == z.record.BasketItemID)
                }).Select('$.RowNumber').ToArray().indexOf(z.record.RowNumber) > -1;
            }).ToArray();

            products = $.map(products, function (product) {
                product.stageOneBasketItemNotices = Enumerable.From(self.basketReview().BasketItemNotices).Where(function (x) {
                    return (x.CheckStageID == 1) &&
                        (x.BasketItemID == product.record.BasketItemID)
                }).ToArray();
                return product;
            });

            products = Enumerable.From(products).GroupBy(function (x) {
                return x.BasketSplitName
            }).ToArray();

            return products;
        } else {
            return [];
        }
    });

    self.basketReviewStageTwoNotices = ko.pureComputed(function () {
        if (self.basketReview()) {
            return Enumerable.From(self.basketReview().SummaryNotices).Where('$.CheckStageID == 2').ToArray();
        } else {
            return [];
        }
    }, self);

    self.basketReviewStageTwoProducts = ko.pureComputed(function () {
        if (self.basketReview()) {
            var products = Enumerable.From(self.basket()).Where(function (z) {
                return Enumerable.From(self.basketReview().BasketItemNotices).Where(function (y) {
                    return y.CheckStageID == 2 &&
                        y.BasketItemID == z.record.BasketItemID
                }).Select('$.RowNumber').ToArray().indexOf(z.record.RowNumber) > -1;
            }).ToArray();

            products = $.map(products, function (product) {
                product.stageTwoBasketItemNotices = Enumerable.From(self.basketReview().BasketItemNotices).Where(function (x) {
                    return x.CheckStageID == 2 &&
                        x.BasketItemID == product.record.BasketItemID
                }).ToArray();
                return product;
            });

            products = Enumerable.From(products).GroupBy(function (x) {
                return x.BasketSplitName
            }).ToArray();

            return products;
        } else {
            return [];
        }
    });

    self.basketReviewStageThreeNotices = ko.pureComputed(function () {
        if (self.basketReview()) {
            return Enumerable.From(self.basketReview().SummaryNotices).Where('$.CheckStageID == 3').ToArray();
        } else {
            return [];
        }
    }, self);

    self.basketReviewStageThreeProducts = ko.pureComputed(function () {
        if (self.basketReview()) {
            var products = Enumerable.From(self.basket()).Where(function (z) {
                return Enumerable.From(self.basketReview().BasketItemNotices).Where(function (y) {
                    return y.CheckStageID == 3 &&
                        y.BasketItemID == z.record.BasketItemID
                }).Select('$.RowNumber').ToArray().indexOf(z.record.RowNumber) > -1;
            }).ToArray();

            products = $.map(products, function (product) {
                product.stageThreeBasketItemNotices = Enumerable.From(self.basketReview().BasketItemNotices).Where(function (x) {
                    return x.CheckStageID == 3 &&
                        x.BasketItemID == product.record.BasketItemID
                }).ToArray();

                ko.ignoreDependencies(function () {
                    this.tradePromotionCodeId = ko.observable(Enumerable.From(product.stageThreeBasketItemNotices).Select('$.TradePromotionCodeID').FirstOrDefault()).extend({
                        required: {
                            params: true,
                            onlyIf: function () {
                                return self.validateBasketReviewStageThreeNow()
                            },
                            message: 'All free products must provide a Trade Promotion Code ID'
                        }
                    });

                    this.tradePromotionCode = kendoMDCDropDownList({
                        width: 300,
                        label: 'Promotion Code',
                        groupTemplate: '<strong>#:data#</strong>',
                        template: null,
                        valueTemplate: null,
                        optionLabelTemplate: null,
                        optionLabel: null,
                        textField: 'TradePromotionName',
                        valueField: 'TradePromotionCodeID',
                        data: getFOCPromotionCodes(),
                        grouping: [{
                            field: 'BudgetManagerName'
                        }],
                        idObservable: this.tradePromotionCodeId,
                        showClear: true,
                        clearFunction: function () {
                            this.tradePromotionCodeId(undefined);
                        },
                        permitRevert: false,
                        height: 300,
                        filtering: function (ev) {
                            if (ev.filter) {
                                var filterValue = ev.filter.value;
                                ev.preventDefault();
                                this.dataSource.filter({
                                    logic: "or",
                                    filters: [
                                        {
                                            field: "TradePromotionName",
                                            operator: "contains",
                                            value: filterValue
                                        },
                                        {
                                            field: "Code",
                                            operator: "contains",
                                            value: filterValue
                                        },
                                        {
                                            field: "BudgetManagerName",
                                            operator: "contains",
                                            value: filterValue
                                        }
                                    ]
                                })
                            }
                        }
                    });
                }, product);

                return product;
            });

            products = Enumerable.From(products).GroupBy(function (x) {
                var group = {
                    basketSplitName: x.BasketSplitName
                }

                ko.ignoreDependencies(function () {
                    this.tradePromotionCodeId = ko.observable();
                }, group);

                return group;
            }, function (x) {
                return x
            }, function (group, source) {

                ko.ignoreDependencies(function () {
                    group.tradePromotionCode = kendoMDCDropDownList({
                        width: 300,
                        label: 'Promotion Code',
                        template: null,
                        valueTemplate: null,
                        optionLabelTemplate: null,
                        optionLabel: null,
                        groupTemplate: '<strong>#:data#</strong>',
                        textField: 'TradePromotionName',
                        valueField: 'TradePromotionCodeID',
                        data: getFOCPromotionCodes(),
                        idObservable: group.tradePromotionCodeId,
                        showClear: true,
                        permitRevert: false,
                        height: 300,
                        grouping: [{
                            field: 'BudgetManagerName'
                        }],
                        filtering: function (ev) {
                            if (ev.filter) {
                                var filterValue = ev.filter.value;
                                ev.preventDefault();
                                this.dataSource.filter({
                                    logic: "or",
                                    filters: [
                                        {
                                            field: "TradePromotionName",
                                            operator: "contains",
                                            value: filterValue
                                        },
                                        {
                                            field: "Code",
                                            operator: "contains",
                                            value: filterValue
                                        },
                                        {
                                            field: "BudgetManagerName",
                                            operator: "contains",
                                            value: filterValue
                                        }
                                    ]
                                })
                            }
                        }
                    });

                    group.tradePromotionCodeId.subscribe(function (newValue) {
                        if (newValue) {
                            ko.utils.arrayForEach(source.source, function (x) {
                                x.tradePromotionCodeId(newValue);
                            });
                        } else {
                            ko.utils.arrayForEach(source.source, function (x) {
                                x.tradePromotionCode.clearFunction();
                            });
                        }
                    });
                }, group);
                var result = {
                    Key: group,
                    source: source.source
                };
                return result;
            },
                function (group) {
                    return group.basketSplitName
                }).ToArray();

            return products;
        } else {
            return [];
        }
    }, self);

    self.basketReviewStageThreeProducts.subscribe(function (newValue) {
        if (newValue.length) {
            self.basketReviewStageThreeErrors = ko.validation.group(Enumerable.From(Enumerable.From(newValue).SelectMany('$.source').ToArray()).Select('$.tradePromotionCodeId').ToArray());
        } else {
            self.basketReviewStageThreeErrors = ko.validation.group([]);
        }
    });

    self.basketReviewStageFourNotices = ko.pureComputed(function () {
        if (self.basketReview()) {
            return Enumerable.From(self.basketReview().SummaryNotices).Where('$.CheckStageID == 4').ToArray();
        } else {
            return [];
        }
    }, self);

    self.basketReviewStageFourProducts = ko.pureComputed(function () {
        if (self.basketReview()) {
            var products = Enumerable.From(self.basket()).Where(function (z) {
                return Enumerable.From(self.basketReview().BasketItemNotices).Where(function (y) {
                    return y.CheckStageID == 4 &&
                        y.BasketItemID == z.record.BasketItemID
                }).Select('$.RowNumber').ToArray().indexOf(z.record.RowNumber) > -1;
            }).ToArray();

            products = $.map(products, function (product) {
                product.stageFourBasketItemNotices = Enumerable.From(self.basketReview().BasketItemNotices).Where(function (x) {
                    return x.CheckStageID == 4 &&
                        x.BasketItemID == product.record.BasketItemID
                }).ToArray();
                return product;
            });

            products = Enumerable.From(products).GroupBy(function (x) {
                return x.BasketSplitName
            }).ToArray();

            return products;
        } else {
            return [];
        }
    });

    self.validateBasketReviewStageOneNow = ko.observable(false);

    // the user-indicated manager of approval
    self.basketReviewManager = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateBasketReviewStageOneNow() && self.basketReviewStageOneNotices().length
            },
            message: 'You must select a Manager'
        }
    });

    self.basketReviewManagers = ko.pureComputed(function () {
        if (self.basketReview()) {
            return self.basketReview().SalesManagers
        } else {
            return [];
        }
    }, self);

    self.basketReviewManagersParams = {
        label: 'Select the manager that gave permission for these discount(s)',
        observable: self.basketReviewManager,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        options: self.basketReviewManagers, // ko.observableArray(self.basketReviewManagers),
        optionsText: 'Label',
        optionsValue: 'MemberID',
        optionsCaption: ' ',
        width: 'auto',
        showClear: true,
        onSelect: function () {

        },
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
        }
    }

    self.basketReviewManagerMessage = {
        label: 'Any additional information you think the manager might need',
        observable: ko.observable(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        readOnly: false,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        rows: 3,
        charsRemainingOptions: {
            maxLength: 2000
        }
    }

    self.basketReviewStageOneErrors = ko.validation.group([
        self.basketReviewManager
    ]);

    self.validateBasketReviewStageTwoNow = ko.observable(false);

    self.basketReviewStageTwoDuplicatesConfirmed = ko.observable(false).extend({
        equal: {
            params: true,
            onlyIf: function () {
                return self.validateBasketReviewStageTwoNow() &&
                    self.basketReviewStageTwoNotices().length;
            },
            message: 'You must confirm duplicate lines'
        }
    });

    self.basketReviewStageTwoDuplicatesParams = {
        checkboxId: 'basket-review-duplicates-check',
        label: 'I acknowledge the duplicates and I still want to submit this order',
        observable: self.basketReviewStageTwoDuplicatesConfirmed,
        useNativeValidation: false
    }

    self.basketReviewStageTwoErrors = ko.validation.group([
        self.basketReviewStageTwoDuplicatesConfirmed
    ]);

    self.progressToBasketReviewStageTwo = function () {
        self.validateBasketReviewStageOneNow(true);
        if (self.basketReviewStageOneErrors().length) {
            self.basketReviewStageOneErrors.filter(function (x) {
                if (!x.isValid()) {
                    x.isValid.notifySubscribers(false);
                }
            })
        } else {
            if (self.basketReviewStageTwoNotices().length) {
                self.phase(ORDERFACTORY_PHASE_REVIEW_DUPLICATES);
            } else {
                self.progressToBasketReviewStageThree();
            }
        }
    }

    self.validateBasketReviewStageThreeNow = ko.observable(false);

    self.progressToBasketReviewStageThree = function () {
        self.validateBasketReviewStageTwoNow(true);
        if (self.basketReviewStageTwoErrors().length) {
            self.basketReviewStageTwoErrors.filter(function (x) {
                if (!x.isValid()) {
                    x.isValid.notifySubscribers(false);
                }
            });
        } else {
            if (self.basketReviewStageThreeNotices().length) {
                self.phase(ORDERFACTORY_PHASE_REVIEW_FOC);
            } else {
                self.phase(ORDERFACTORY_PHASE_REVIEW_HOLD);
            }
        }
    }

    self.progressToBasketReviewStageFour = function () {
        self.validateBasketReviewStageThreeNow(true);
        window.setTimeout(function () {
            if (self.basketReviewStageThreeErrors().length) {
                self.basketReviewStageThreeErrors.filter(function (x) {
                    if (!x.isValid()) {
                        x.isValid.notifySubscribers(false);
                    }
                });
            } else {
                if (self.basketReviewStageFourNotices().length) {
                    self.phase(ORDERFACTORY_PHASE_REVIEW_FOC_ERROR);
                } else {
                    self.busy(true);
                    var data = {
                        basketId: self.basketId(),
                        discounts: Enumerable.From(Enumerable.From(self.basketReviewStageThreeProducts()).SelectMany('$.source').ToArray()).Select(function (x) {
                            return {
                                basketItemId: x.record.BasketItemID,
                                OperatorDiscountPercentage: null,
                                OperatorEnteredChargeEx: null,
                                DiscountReasonID: null,
                                DiscountReasonComment: null,
                                TradePromotionCodeID: x.tradePromotionCodeId()
                            }
                        }).ToArray()
                    };
                    console.log('orderFactory basket review FoC stage calling SaveBasketItemReviewPrices calling with', data);
                    self.busy(true);
                    $.ajax({
                        url: '/api/componentapi/SaveBasketItemReviewPrices',
                        type: 'POST',
                        dataType: 'json',
                        data: data,
                        success: function (data) {
                            console.log('orderFactory basket review FoC stage calling SaveBasketItemReviewPrices calling with', data);
                            self.busy(false);
                            self.phase(ORDERFACTORY_PHASE_REVIEW_HOLD);
                        },
                        error: function (xhr, s, a) {
                            self.busy(false);
                            $.ajaxSettings.error(xhr, s, a);
                        }
                    });
                }
            }
        }, 0);
    }

    // whether or not we want to validate the "preamble" stage now
    self.validateBasketDetailsNow = ko.observable(false);

    // preamble stage - transaction type
    self.transactionType = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateBasketDetailsNow();
            },
            message: 'Transaction Type required'
        }
    });

    self.transactionTypeOptions = {
        label: 'Transaction Type',
        observable: self.transactionType,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        options: ko.observableArray(getTransactionTypes()),
        optionsText: 'Name',
        optionsValue: 'TransactionTypeID',
        optionsCaption: ' ',
        width: 'auto',
        showClear: true,
        onSelect: function () {

        },
        clearFunction: function () {
            var self = this;
            self.transactionType.observable(undefined);
        }
    };

    // Call Type
    self.callType = ko.observable().extend({
        //required: {
        //    params: true,
        //    onlyIf: function () {
        //        return self.validateBasketDetailsNow()
        //    },
        //    message: 'Call Type'
        //}
    });

    self.callTypeParams = {
        label: 'Call Type',
        observable: self.callType,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        options: ko.observableArray(getCallTypes()),
        optionsText: 'Name',
        optionsValue: 'CallTypeID',
        optionsCaption: ' ',
        width: 'auto',
        showClear: true,
        onSelect: function () {

        },
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
        }
    };

    // caller - to pair with Call Type
    self.callerParams = {
        label: 'Caller',
        observable: ko.observable().extend({
            //required: {
            //    params: true,
            //    onlyIf: function () {
            //        return self.validateBasketDetailsNow()
            //    },
            //    message: 'Caller Name Required'
            //}
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        }
    };

    // Reasons for saving the basket, to be presented to the user upon save & close being hit.
    self.savedBasketReasonValidateNow = ko.observable(false);

    self.savedBasketReason = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.savedBasketReasonValidateNow()
            },
            message: 'You must provide a reason'
        }
    });

    self.savedBasketReasons = {
        label: 'Reason for Saving Basket',
        observable: self.savedBasketReason,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        options: ko.observableArray(getSaveReasons()),
        optionsText: 'Name',
        optionsValue: 'SavedBasketReasonID',
        optionsCaption: ' ',
        width: 'auto',
        showClear: true,
        onSelect: function () {

        },
        clearFunction: function () {
            self.savedBasketReason(undefined);
        }
    }

    // which mode the factory is in - ORDER for placing order, BROWSE for browsing without placing an order.
    self.viewingMode = ko.observable(ORDERFACTORY_VIEWING_MODE_ORDER);

    // Whether or not to validate the eu exit final destination address now
    self.validateEUExitDestinationNow = ko.observable(false);

    // EU Exit code - for crazy orders where people are evading tax
    self.euExitCode = {
        label: 'E.U. Exit Code',
        observable: ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateEUExitDestinationNow();
                },
                message: ' '
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        }
    };

    // Whether or not EU Exit Code entry is permitted
    // 0 = Hide EU Exit Details, 1 = Allow Exit Code, 2 = Delivering into EU but Exit Code forbidden on account
    self.allowEUExitCode = ko.observable(0);

    self.euExitingConfirmed = ko.observable(null); // important that this starts NULL, as it can be set NULL
    // by basket detail load, and we don't want to cause the subscriptions to fire
    // if that happens

    self.euExitingDenied = ko.observable(null);

    self.euExitingConfirmed.extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.allowEUExitCode() == 1 && !self.euExitingDenied() && self.validateBasketDetailsNow();
            },
            message: 'EU Exiting Confirmed'
        }
    });

    self.euExitingDenied.extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.allowEUExitCode() == 1 && !self.euExitingConfirmed() && self.validateBasketDetailsNow();
            },
            message: 'EU Exiting Denied'
        }
    });

    self.euExitingConfirmed.subscribe(function (newValue) {
        self.euExitingDenied(!newValue);


        //if (self.euExitingDenied.skipSubscription) {
        //    self.euExitingDenied.skipSubscription = false;
        //} else {
        //    self.euExitingDenied.skipSubscription = true;
        //    self.euExitingConfirmed.skipSubscription = true;
        //    self.euExitingDenied(null);
        //    self.euExitingDenied.valueHasMutated();
        //    //self.euExitingDenied(!newValue);
        //}
    });

    self.euExitingDenied.subscribe(function (newValue) {
        self.euExitingConfirmed(!newValue);

        if (newValue) {
            self.euExitFinalDestinationAddress.reset();
            self.validateEUExitDestinationNow(false);
        }

        //if (self.euExitingConfirmed.skipSubscription) {
        //    self.euExitingConfirmed.skipSubscription = false;
        //} else {
        //    self.euExitingConfirmed.skipSubscription = true
        //    self.euExitingDenied.skipSubscription = true;
        //    self.euExitingConfirmed(null);
        //    self.euExitingConfirmed.valueHasMutated();
        //    //self.euExitingConfirmed(!newValue);
        //}
    });

    self.euExitingConfirmedParams = {
        checkboxId: 'eu-exiting-confirmed',
        label: 'This Order\'s final destination is outside of the EU',
        observable: self.euExitingConfirmed,
        useNativeValidation: false,
        disabled: false
    }

    self.euExitingDeniedParams = {
        checkboxId: 'eu-exiting-denied',
        label: 'This Order\'s final destination is inside of the EU',
        observable: self.euExitingDenied,
        useNativeValidation: false,
        disabled: false
    }

    // EU Exit final destination delivery address - for crazy orders where people are evading tax
    self.euExitFinalDestinationAddress = new addressViewModel({
        includeEU: false,
        labelClass: 'delivery-address-label',
        controlClass: 'form-control mdc-text-field__input',
        validateNow: self.validateEUExitDestinationNow,
        nameValidation: {
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateEUExitDestinationNow();
                },
                message: 'Please provide a Name'
            }
        },
        addressLine1Validation: {
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateEUExitDestinationNow();
                },
                message: 'Please provide Address Line 1'
            }
        },
        townValidation: {
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateEUExitDestinationNow();
                },
                message: 'Please provide a Town'
            }
        },
        postcodeValidation: {
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateEUExitDestinationNow();
                },
                message: 'Please provide a Postcode'
            }
        },
        countryValidation: {
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateEUExitDestinationNow();
                },
                message: 'Please select a Country'
            }
        },
        phoneIntlMobile: true,
        forbiddenDestinationCountries: self.forbiddenDestinationCountries
    });

    // Whether or not the user has actually entered a basket - NO LONGER used by the order-commencement-modal
    // DEFUNCT
    self.basketEntered = ko.observable(false);

    // Holds document types
    self.documentTypes = ko.observableArray([]);

    // Holds the filter buttons on the left (now named Categories)
    self.productFilterButtons = ko.observable(getProductFilterButtons());

    self.completeProductFilterSet = ko.observable(getCompleteProductFilterButtonSet());

    // Permits firing of the search computed on demand, via .valueHasMutated
    self.searchNonce = ko.observable();

    // Holds the stock and fulfilment options which are fetched alongside basketPricesStock
    self.allFulfilmentOptions = ko.observableArray([]);

    // Available sort orders.
    self.searchSortOrders = getSortOptions();

    // Holds the available page sizes
    self.availablePageSizes = [10, 20, 50, 100, 150, 200, 250, 2000];

    // Holds the current page size
    self.searchPageSize = ko.observable(50);

    // Holds the current search price (min)
    self.searchPriceMin = ko.observable();

    // Holds the current search price (max)
    self.searchPriceMax = ko.observable();

    // Holds the current search price operator (Default: <)
    self.searchPriceOperator = ko.observable('<');

    // Holds the available search price operators
    self.searchPriceOperators = [{
        name: '=',
        value: '='
    }, {
        name: '<=',
        value: '<='
    }, {
        name: 'between',
        value: 'Between'
    }]

    // Holds the current stock search operator (Default: null)
    self.searchStockOperator = ko.observable(null);

    // Holds the search stock options 
    self.searchStockOptions = [{
        name: 'All',
        value: null
    }, {
        name: 'In Stock',
        value: 'InStock'
    }, {
        name: 'Due In',
        value: 'DueIn'
    }, {
        name: 'Out of Stock',
        value: 'OutOfStock'
    }];

    // holds the current search stock value
    self.searchStock = ko.observable();

    // Holds the currently applied sort order.
    self.searchSortOrder = ko.observable();

    // Filter Properties:
    self.selectedColour = ko.observable();
    self.selectedBrand = ko.observable();
    self.selectedLaunch = ko.observable();
    self.selectedPattern = ko.observable();
    self.selectedItemType = ko.observable();
    self.selectedStock = ko.observable();
    self.selectedMartindale = ko.observable();
    self.selectedWidth = ko.observable();
    self.selectedSize = ko.observable();
    self.searchNew = ko.observable(false);

    self.selectedProductTypeGroup = ko.observable();
    self.selectedProductGroup = ko.observable();

    self.brandFilterButtons = ko.observable(getBrandFilterButtons());
    self.launchFilterButtons = ko.observable(getLaunchFilterButtons());
    self.patternFilterButtons = ko.observable(getPatternFilterButtons());
    self.itemTypeFilterButtons = ko.observable(getItemTypeFilterButtons());
    self.stockFilterButtons = ko.observable(getStockFilterButtons());
    self.martindaleFilterButtons = ko.observable(getMartindaleFilterButtons());
    self.widthFilterButtons = ko.observable(getWidthFilterButtons());
    self.sizeFilterButtons = ko.observable(getSizeFilterButtons());
    // End of Filter Properties

    // whether or not the customer requests full dispatch of their items
    self.customerRequestsFullDispatch = ko.observable(false);

    // customer's haulier account to charge shipping to
    self.customerHaulierAccountShipping = {
        label: 'Haulier Account Number - Shipping',
        observable: ko.observable(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 20
        }
    };

    // customer's haulier account to charge duty & taxes to
    self.customerHaulierAccountDuty = {
        label: 'Haulier Account Number - Duty & Taxes',
        observable: ko.observable(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 20
        }
    };

    // is this a contract order
    self.contractOrder = ko.observable(false);

    // is this to be held for sales
    self.holdForSales = ko.observable(true);

    self.holdForSalesParams = {
        checkboxId: 'hold-for-sales-check',
        label: 'Tick to hold order',
        observable: self.holdForSales,
        useNativeValidation: false
    }

    // if the payment terms are proforma, are we permitting allocation?
    self.allocateProforma = ko.observable(false);

    // Holds various basket properties necessary for the initiation of a basket
    self.basketServerObject = ko.observable();

    // The basketId
    self.basketId = ko.observable();

    window.basketId = self.basketId;

    // Reference to the BasketLockerComponent
    self.basketLocker = null;

    // When this order was last saved.
    self.lastSaved = ko.observable();

    // Holds the preferred email to send to - currently only used from LargeImageModal
    self.preferredEmail = ko.observable();

    // Holds the pattern book schemes a trade account may belong to filled by fetchBasketParameters
    self.patternBookSchemes = ko.observableArray([]);

    // Whether or not a US Sales Tax Exemption Certificate is required
    self.usSalesTaxExemptionCertificateRequired = ko.observable(false);

    // Whether or not a Purchase Order Number is required
    self.purchaseOrderNumberRequired = ko.observable(false);

    // Holds the basket email (differs from the preferred email to send to...)
    // They want multiple email address recipients for order confirmations...
    // so... we'd like... multiple inputs all validated as emails
    // so... we need... a shrubbery!

    self.emailManager = {
        emails: ko.observableArray([]),
        addEmail: function () {
            var label = 'Email Address for Order Confirmations';
            if (self.emailManager.emails().length >= 1) {
                label = 'Additional Email for Order Confirmations';
            }
            self.emailManager.emails.push({
                label: label,
                observable: ko.observable().extend({
                    email: {
                        params: true
                    },
                    required: {
                        params: true,
                        onlyIf: function () {
                            return self.validateBasketDetailsNow();
                        },
                        message: 'Email is required'
                    }
                }),
                useNativeValidation: false,
                decorateInputElement: false,
                insertValidationMessages: false,
                showClear: true,
                clearFunction: function () {
                    var self = this;
                    self.observable(undefined);
                    $(self.observable.DOMElement).focus();
                },
                charsRemainingOptions: {
                    maxLength: 256
                }
            });
        }
    }

    //self.email = {
    //    label: 'Email Address for Order Confirmations',
    //    observable: ko.observable(),
    //    useNativeValidation: false,
    //    decorateInputElement: false,
    //    insertValidationMessages: false,
    //    showClear: true,
    //    clearFunction: function () {
    //        var self = this;
    //        self.observable(undefined);
    //        $(self.observable.DOMElement).focus();
    //    },
    //    charsRemainingOptions: {
    //        maxLength: 256
    //    }
    //};

    //self.email.observable.extend({
    //    email: {
    //        params: true
    //    },
    //    required: {
    //        params: true,
    //        onlyIf: function () {
    //            return self.validateBasketDetailsNow();
    //        },
    //        message: 'Email is required'
    //    }
    //});

    // Controls whether or not we should be displaying validation for order reference.
    self.validateBasketSaveNow = ko.observable(false);

    // Holds this order's reference, as provided by the user. Mandatory if saving.
    self.orderReference = {
        label: ko.computed(function () {
            if (!self.purchaseOrderNumberRequired()) {
                return 'Order Reference'
            } else {
                return 'Purchase Order Number'
            }
        }, self),
        observable: ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateBasketDetailsNow();
                },
                message: 'Order Reference error'
            },
            validation: {
                async: true,
                //onlyIf: function () {
                //    return self.validateBasketDetailsNow();
                //},
                validator: function (val, parms, callback) {
                    //if (self.validateBasketDetailsNow()) {
                    if (self.tradeAccount() && val) {
                        var data = {
                            tradeAccountCode: self.tradeAccount().Code,
                            orderReference: val
                        };

                        console.log('orderFactory uniqueOrderReferenceCheck calling with', data);

                        $.ajax({
                            url: '/api/componentapi/UniqueOrderReferenceCheck',
                            type: 'POST',
                            data: data,
                            success: function (data) {
                                console.log('orderFactory uniqueOrderReferenceCheck returned', data);
                                if (data.length) {
                                    self.duplicateOrderReferenceMessage('An order with this reference already exists for this customer: ' + data[0] +
                                        '. You may proceed, but please be sure that you aren\'t creating a duplicate.');
                                    callback(true);
                                } else {
                                    self.duplicateOrderReferenceMessage(undefined);
                                    callback(true);
                                }
                            },
                            error: function (xhr, s, a) {
                                callback(false);
                                $.ajaxSettings.error(xhr, s, a);
                            }
                        });
                    } else {
                        callback(false);
                    }
                    //} else {
                    //    callback(true);
                    //}
                },
                message: 'Order Reference Duplicate Check error'
                //,
                //message: function (params, observable) {
                //    // observable is this observable: self.orderReference.observable
                //    // what might params be... 
                //    return observable.duplicateMessage();
                //}
            },
            rateLimit: {
                timeout: 300,
                method: 'notifyWhenChangesStop'
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        }
    };

    self.orderReference.observable.subscribe(function (newValue) {
        if (newValue) {

        } else {
            self.duplicateOrderReferenceMessage(undefined);
        }
    });


    // Holds this order's US tax exemption certificate, if applicable
    self.usTaxExemptionCertificate = {
        label: 'US Tax Exemption Certificate',
        observable: ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.usSalesTaxExemptionCertificateRequired() && self.validateBasketDetailsNow();

                    //if (self.deliveryAddress) {
                    //    if (self.deliveryAddress.country()) {
                    //        if (self.deliveryAddress.country().CountryID == 238) {
                    //            return self.validateBasketDetailsNow();
                    //        }
                    //    }
                    //}
                    //return false;
                },
                message: 'US Tax Exemption Certificate Error'
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        }
    };

    self.duplicateOrderReferenceMessage = ko.observable();

    // Holds whether or not the save basket area is visible
    self.saveBasketVisible = ko.observable(false);

    // Holds the basket's stock product discount override
    self.stockProductsDiscountOverride = ko.observable().extend({
        minValue: {
            params: 0,
            message: ' '
        },
        maxValue: {
            params: 100,
            message: ' '
        }
    });

    // Holds the basket's display product discount override
    self.displayProductsDiscountOverride = ko.observable().extend({
        minValue: {
            params: 0,
            message: ' '
        },
        maxValue: {
            params: 100,
            message: ' '
        }
    });

    // Holds the basket's reserve product discount override
    self.reserveProductsDiscountOverride = ko.observable().extend({
        minValue: {
            params: 0,
            message: ' '
        },
        maxValue: {
            params: 100,
            message: ' '
        }
    });

    // if you have any reserves, with any batch cuttings on them,
    // do you want to send those batch cuttings express?
    // if so, this will trigger a save which subsequently calls a Basket_SelectList
    // a child product will have to be added to the first batch-cutting-having reserve line
    // what a palaver
    self.reserveBatchCuttingExpressIndicator = ko.observable(false);

    self.reserveBatchCuttingExpressIndicatorParams = {
        checkboxId: 'batch-cutting-express-indicator',
        label: 'Send Batch Cuttings express?',
        observable: self.reserveBatchCuttingExpressIndicator,
        useNativeValidation: false,
        visible: ko.pureComputed(function () {
            return (self.phase() == ORDERFACTORY_PHASE_BASKET) && Enumerable.From(self.basket()).Where(function (x) {
                return x.record.BatchCuttingIndicator
            }).Any();
        }, self)
    }

    self.reserveBatchCuttingExpressIndicator.subscribe(function (newValue) {
        if (self.reserveBatchCuttingExpressIndicator.skipSubscription) {
            self.reserveBatchCuttingExpressIndicator.skipSubscription = false;
        } else {
            self.busy(true);
            var data = {
                basketId: self.basketId(),
                sendBatchCuttingsExpress: newValue
            };
            console.log('calling toggleBatchCuttingExpress calling with', data);
            $.ajax({
                url: '/api/componentapi/ToggleBatchCuttingExpress',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    self.fetchBasket(null, true);
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    $.showError(xhr, s, a);
                }
            });
        }
    });
    // Holds the basket's stock product promoCode override
    self.stockProductsPromoCodeOverride = ko.observable();

    // Holds whether or not the basket's stock product promoCode override has focus
    self.stockProductsPromoCodeHasFocus = ko.observable(false);

    // Holds the basket's display product promoCode override
    self.displayProductsPromoCodeOverride = ko.observable();

    // Holds whether or not the basket's display product promoCode override has focus
    self.displayProductsPromoCodeHasFocus = ko.observable(false);

    // Holds the basket's reserve product promoCode override
    self.reserveProductsPromoCodeOverride = ko.observable();

    // Holds whether or not the basket's reserve product promoCode override has focus
    self.reserveProductsPromoCodeHasFocus = ko.observable(false);

    // To hold the viewing state of the left-hand filter / category display. Defaults to ProductFilterID buttons.
    self.filterViewMode = ko.observable(ORDERFACTORY_FILTER_MODE_STANDARD);

    // To hold what word to display in the PatternBooksHeld toggle thing: View or Viewing.
    self.patternBookSaturationViewAll = ko.observable(true);

    // Because the search function is a computed which can be throttled,
    // and because computeds are initially assessed to determine their dependency hierarchy
    // and because we want the order form modal to begin unsearched...
    // we want a skipFirst whose only purpose is to skip the first search AJAX call
    self.skipFirst = ko.observable(true); // SHOULD BEGIN TRUE

    // Holds whether or not we're looking at a "Seasonal" product type / filter.
    self.seasonalProducts = ko.observable(false);


    // Holds the type of result we're looking at, affects the thead of the search results table.
    // Also important for bespoke builders
    self.mode = ko.observable(ORDERFACTORY_MODE_STANDARD); // SHOULD BEGIN ORDERFACTORY_MODE_STANDARD

    // Shortcuts a reference to our parent's Trade Account. Must be present, must be an observable.
    self.tradeAccount = self.parent.tradeAccount || tradeAccountObservable;

    self.tradeAccountId = ko.computed(function () {
        if (self.tradeAccount()) {
            return self.tradeAccount().TradeAccountID;
        }
    }, self);

    // ordering notices - potentially prevent the user from using the selected trade account to order with
    self.tradeAccountOrderingNotifications = ko.observableArray([]);
    self.mayStartOrder = ko.observable(false);
    self.mayBrowse = ko.observable(false);

    // review stage notices - inform the user if they need to go back and amend anything
    self.reviewNotifications = ko.observableArray([]);

    // The current "phase".
    self.phase = ko.observable(ORDERFACTORY_PHASE_BLANK);

    // Whether or not the basket is busy
    self.busy = ko.observable(false);

    // Busy message
    self.busyMessage = ko.observable();

    self.busyMessage.skipSubscription = false;

    // Halloween spectacular
    //self.busyMessage.subscribe(function (newValue) {
    //    if (newValue && self.useMatrixLoader()) {
    //        if (self.busyMessage.skipSubscription) {
    //            self.busyMessage.skipSubscription = false;
    //            return;
    //        }
    //        if (Math.random() < 0.5) {
    //            self.busyMessage.skipSubscription = true;
    //            self.busyMessage('<div class="halloween-message">' + HALLOWEEN_RANDOM_MESSAGES[Math.floor(Math.random() * HALLOWEEN_RANDOM_MESSAGES.length)] + '</div>')
    //        }
    //    }
    //});

    self.useMatrixLoader = ko.pureComputed(function () {
        return [ORDERFACTORY_PHASE_DISPATCH,
            ORDERFACTORY_PHASE_COMMENTS,
            ORDERFACTORY_PHASE_REVIEW_VATNUMBER,
            ORDERFACTORY_PHASE_REVIEW_MANAGER_DISCO,
            ORDERFACTORY_PHASE_REVIEW_DUPLICATES,
            ORDERFACTORY_PHASE_REVIEW_FOC,
            ORDERFACTORY_PHASE_REVIEW_HOLD,
            ORDERFACTORY_PHASE_RETAIL].indexOf(self.phase()) > -1
    }, self);

    self.matrixLoader = {
        visible: self.busy,
        busyMessage: self.busyMessage,
        matrixLoaderParams: {
            visible: ko.computed(function () {
                return self.busy() &&
                    self.useMatrixLoader()
            }),
            obj: {}
        }
    }

    self.busy.subscribe(function (newValue) {
        console.log('orderFactory busy subscribe hit', newValue);
        window.setTimeout(function () {
            self.matrixLoader.matrixLoaderParams.resize();
        }, 0);
    });

    self.busy.subscribe(function (newValue) {
        //console.log('a) orderFactory busy subscribe hit', newValue);
    });

    // Whether or not the add to basket action should add a product as "Display".
    self.display = ko.observable(ORDERFACTORY_ADD_MODE_STOCK);

    // Maintains appearance of the search type...
    // This should be renamed "Lifecycle" throughout, but... a rose by any other name 
    // would smell as sweet.
    self.clearance = ko.observable(ORDERFACTORY_SEARCH_TYPE_ALL);

    // Maintains the search result display state: Grid or Table.
    self.searchDisplay = ko.observable(ORDERFACTORY_SEARCH_DISPLAY_LIST);

    // Holds which search result has been "focused".
    // for display switching.
    // Might not be necessary, can the same thing not be achieved just by using drilldownData ?
    self.focus = ko.observable();

    // Maintains appearance of button and is passed to portal.Product_Search
    self.searchWidgetBlank = null;
    //{
    //    Value: null,
    //    ProductFilterID: null,
    //    ProductFilterGroupID: null,
    //    Seasonal: null
    //};

    self.searchWidget = ko.observable(self.searchWidgetBlank);//({ Name: 'Bespoke Hangers', Value: 'FabricBespokeHanger', ProductFilterID: 2, ProductTypeID: 15 });

    self.searchWidgetValue = ko.pureComputed(function () {
        if (self.searchWidget())
            return self.searchWidget().Value
    }, self);

    self.searchWidgetProductFilterId = ko.pureComputed(function () {
        if (self.searchWidget())
            return self.searchWidget().ProductFilterID
    }, self);

    self.searchWidgetProductFilterGroupId = ko.pureComputed(function () {
        if (self.searchWidget())
            return self.searchWidget().ProductFilterGroupID
    }, self);

    self.searchWidgetSeasonal = ko.pureComputed(function () {
        if (self.searchWidget())
            return self.searchWidget().Seasonal
    }, self);

    self.searchWidgetShowStockFilter = ko.pureComputed(function () {
        if (self.searchWidget())
            return self.searchWidget().ShowStockFilter
    }, self);

    self.searchWidgetShowColourFilter = ko.pureComputed(function () {
        if (self.searchWidget())
            return self.searchWidget().ShowColourFilter
    }, self);

    self.searchWidgetShowBrandFilter = ko.pureComputed(function () {
        if (self.searchWidget())
            return self.searchWidget().ShowBrandFilter
    }, self);

    self.searchWidgetShowNewFilter = ko.pureComputed(function () {
        if (self.searchWidget())
            return self.searchWidget().ShowNewFilter
    }, self);

    self.searchWidgetShowLaunchFilter = ko.pureComputed(function () {
        if (self.searchWidget())
            return self.searchWidget().ShowLaunchFilter
    }, self);

    self.searchWidgetShowPatternFilter = ko.pureComputed(function () {
        if (self.searchWidget())
            return self.searchWidget().ShowPatternFilter
    }, self);

    self.searchWidgetShowProductTypeFilter = ko.pureComputed(function () {
        if (self.searchWidget())
            return self.searchWidget().ShowProductTypeFilter
    }, self);

    self.searchWidgetShowMartindaleFilter = ko.pureComputed(function () {
        if (self.searchWidget())
            return self.searchWidget().ShowMartindaleFilter
    }, self);

    self.searchWidgetShowSizeFilter = ko.pureComputed(function () {
        if (self.searchWidget())
            return self.searchWidget().ShowSizeFilter
    }, self);

    self.searchWidgetAddAll = ko.pureComputed(function () {
        if (self.searchWidget())
            return self.searchWidget().AddAll
    }, self);

    self.searchWidgetShowSamplingOptionsButton = ko.pureComputed(function () {
        if (self.searchWidget())
            return self.searchWidget().ShowSamplingOptionsButton
    }, self);

    self.searchWidgetQuantityPrecision = ko.pureComputed(function () {
        if (self.searchWidget())
            return self.searchWidget().QuantityPrecision;
    }, self);

    self.searchWidgetShowWidthFilter = ko.pureComputed(function () {
        if (self.searchWidget())
            return self.searchWidget().ShowWidthFilter;
    }, self)

    // Maintains the notion of the widget group selected
    self.searchWidgetGroup = ko.observable();

    // Maintains the previously selected productTypeId.
    // This permits presevation of search parameters when changing category.
    // Only fabric, wallpaper and their variants provide their product type IDs. Other categories are null.
    self.previousProductType = ko.observable(); // SHOULD BEGIN EMPTY

    // Maintains the selected productType, lent by the selected category.
    self.selectedProductType = ko.observable(); // SHOULD BEGIN EMPTY

    // Holds the user-provided search term.
    self.searchTerm = ko.observable();

    // Holds the searchTerm's hasFocus state. Subscribed to below.
    self.searchTermHasFocus = ko.observable(false);

    // Holds the collectionId... for when the user selects one from keyword hints.
    // When this happens, Matt doesn't want me to pass searchTerm... hmm.
    self.collectionId = ko.observable();

    // When a searchResult is DirectDespatch and added to basket, I need to know which one in order to maintain bindings correctly
    // on the supplier-modal.
    self.searchResultRequestingSupplier = ko.observable();

    // When a tradeAccount requires PurchaseOrderLineNumbers, I need to gather one upon adding anything to basket.
    self.searchResultRequestingPOLineNumber = ko.observable();

    // When a searchResult is BespokeFurniture, I need to know quantity up-front before adding to basket
    // but without going through the Drilldown modal.
    self.searchResultRequestingQuantity = ko.observable();

    // An out of place computed! Oh no!
    self.tradeAccountSalesMarket = ko.pureComputed(function () {
        if (self.tradeAccount()) {
            return self.tradeAccount().SalesMarketID
        }
    }, self);

    // holds the credit terms
    self.creditTerms = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateBasketDetailsNow();
            },
            message: 'Credit Terms are required',
        }
    });

    self.vatRefreshBusy = ko.observable(false);

    self.vatCheckBusy = ko.observable(false);

    self.vatCheckBusy.subscribe(function (newValue) {
        if (newValue) {
            window.setTimeout(function () {
                self.vatCheckBusy(false);
            }, 5000);
        }
    });

    self.vatNumberMessage = ko.observable();

    self.vatNumberError = ko.observable(false);

    self.vatNumberValid = ko.observable();

    self.vatNumber = ko.observable();

    self.vatCountryCode = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                if (self.deliveryAddress) {
                    if (self.deliveryAddress.country()) {
                        if (self.deliveryAddress.country().EU)
                            return self.vatNumber() != null;
                    }
                }
                return false;
            },
            message: 'VAT Country Code'
        }
    });

    self.vatNumberRequestIdentifier = ko.observable();

    self.vatCountryCodeParams = {
        label: 'VAT Country',
        observable: self.vatCountryCode,
        options: getCountries(),
        optionsText: function (item) {
            return `${item.Code} - ${item.Name}`
        },
        optionsValue: 'Code',
        optionsCaption: ' ',
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            this.observable(undefined);
            $(this.observable.DOMElement).focus();
        },
        readOnly: ko.computed(function () {
            return self.vatRefreshBusy() == true;
        }),
        busy: self.vatRefreshBusy
    };

    self.forceVATNumberValidation = function () {
        ko.validation.validateObservable(self.vatNumber);
    }

    self.vatNumberCheckPerformed = ko.observable(false).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateBasketDetailsNow() && (self.vatCountryCode() && self.vatNumber());
            },
            message: 'VAT Number Check not performed'
        },
        mustEqual: {
            params: true,
            onlyIf: function () {
                return self.validateBasketDetailsNow() && (self.vatCountryCode() && self.vatNumber());
            },
            message: 'VAT Number Check not performed'
        }
    });

    self.vatNumberCheckPerformed.subscribe(function (newValue) {
        console.log('orderFactory vatNumberCheckPerformed subscribe hit', newValue);
    });

    self.refreshCreditTermsBusy = ko.observable(false);

    self.refreshCreditTermsBusy.subscribe(function (newValue) {
        if (newValue) {
            $(self.creditTermsAutocomplete.observable.DOMElement).addClass('ui-autocomplete-loading');
        } else {
            $(self.creditTermsAutocomplete.observable.DOMElement).removeClass('ui-autocomplete-loading');
        }
    });

    self.refreshCreditTerms = function () {
        self.refreshCreditTermsBusy(true);
        var data = {
            accountNumber: self.tradeAccount().Code
        }
        console.log('orderFactory calling refreshCreditTerms with', data);
        $.ajax({
            url: '/api/componentapi/RefreshTradeAccountInvoiceTerms',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                self.refreshCreditTermsBusy(false);
                self.creditTerms(data);
                self.creditTermsAutocomplete.observable(data.Label);
            },
            error: function (xhr, s, a) {
                self.refreshCreditTermsBusy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    }

    self.refreshVATDetails = function () {
        self.vatRefreshBusy(true);
        var data = {
            basketId: self.basketId()
        };
        console.log('orderFactory calling refreshVATDetails with', data);
        $.ajax({
            url: '/api/componentapi/RefreshTradeAccountVATNumbers',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('orderFactory refreshVATDetails returned', data);
                self.vatRefreshBusy(false);
                if (data.VATNumber) {
                    self.vatCountryCode(data.CountryCode);
                    self.vatNumberParams.observable(data.VATNumber);
                    //ko.validation.validateObservable(self.vatNumberParams.observable);
                }
                if (!data.Errored) {
                    if (self.basketServerObject()) {
                        window.setTimeout(function () {
                            if (typeof self.basketServerObject().mertexVATLookupSuccessful === 'function') {
                                self.basketServerObject().mertexVATLookupSuccessful(true);
                            }
                        }, 0);
                    }
                }
            },
            error: function (xhr, s, a) {
                self.vatRefreshBusy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    }

    self.eoriRefreshBusy = ko.observable(false);

    // Holds the delivery address
    self.deliveryAddress = new addressViewModel({
        labelClass: 'order-products-label',
        controlClass: 'form-control mdc-text-field__input',
        validateNow: ko.observable(false)
    });

    self.refreshEORINumber = function () {
        if (self.tradeAccount()) {
            self.eoriRefreshBusy(true);
            var data = {
                accountNumber: self.tradeAccount().Code
            };
            console.log('orderFactory calling refreshEORINumber with', data);
            $.ajax({
                url: '/api/componentapi/RefreshTradeAccountEORINumber',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('orderFactory refreshEORINumber returned', data);
                    self.eoriRefreshBusy(false);

                    self.eoriNumberParams.observable(data.EORINumber);

                    if (!data.Errored) {
                        if (self.basketServerObject()) {
                            window.setTimeout(function () {
                                if (typeof self.basketServerObject().mertexEORILookupSuccessful === 'function') {
                                    self.basketServerObject().mertexEORILookupSuccessful(true);
                                }
                            }, 0);
                        }
                    }
                },
                error: function (xhr, s, a) {
                    self.eoriRefreshBusy(false);
                    $.ajaxSettings.error(xhr, s, a);
                }
            });
        }
    }

    self.vatCountryCode.subscribe(function (newValue) {
        self.vatNumberMessage(undefined);
        self.vatNumberCheckPerformed(false);
        self.vatCheckBusy(true);
        //ko.validation.validateObservable(self.vatNumberParams.observable);
    });

    self.vatNumber.extend({
        required: {
            params: true,
            onlyIf: function () {
                if (self.deliveryAddress) {
                    if (self.deliveryAddress.country()) {
                        if (self.deliveryAddress.country().EU)
                            return self.vatCountryCode() != null;
                    }
                }
                return false;
            },
            message: ' '
        },
        validation: {
            async: true,
            validator: function (val, parms, callback) {
                if (val && self.vatCountryCode()) {

                    var data = {
                        vatNumber: val,
                        countryCode: self.vatCountryCode()
                    }
                    console.log('orderFactory calling validateVATNumber with', data);
                    $.ajax({
                        url: '/api/componentapi/ValidateVATNumber',
                        type: 'POST',
                        data: data,
                        success: function (data) {
                            if (data.Body.valid) {
                                self.vatNumberValid(true);
                                self.vatNumberError(false);
                                self.vatNumberMessage('Confirmed valid VAT Number for: ' + data.Body.traderName);

                                //callback(true);
                            } else {
                                self.vatNumberValid(false);
                                self.vatNumberError(true);
                                self.vatNumberMessage(data.countryName + ': Incorrect or expired VAT number. Please refer to <a href="http://ec.europa.eu/taxation_customs/vies/faq.html#item_7" target="_blank">The European Union\'s V.I.E.S. FAQ</a> for assistance.<br/>You will not be able to submit this order until Credit Control have corrected the VAT number.');

                                //callback(false);
                            }

                            if (data.Body && data.Body.requestIdentifier) {
                                self.vatNumberRequestIdentifier(data.Body.requestIdentifier);
                            }

                            self.vatNumberCheckPerformed(true);
                            self.vatCheckBusy(false);
                        },
                        error: function (xhr, s, a) {
                            self.vatNumberValid(undefined);
                            self.vatNumberError(false);
                            self.vatNumberMessage('The EU VAT Number checking service cannot currently validate this VAT number. We will assume the number is valid and notify Credit Control.')

                            self.vatNumberCheckPerformed(true);
                            self.vatCheckBusy(false);
                            //callback(false);
                        }
                    });
                }

                callback(true);
            }
            //,
            //message: function (params, observable) {
            //    // observable is this observable: self.orderReference.observable
            //    // what might params be... 
            //    return observable.duplicateMessage();
            //}
        },
        rateLimit: {
            timeout: 200,
            method: 'notifyWhenChangesStop'
        }
    });

    self.vatNumberParams = {
        label: 'VAT Number',
        observable: self.vatNumber,
        readOnly: ko.computed(function () {
            return self.vatRefreshBusy() == true;
        }),
        busy: self.vatRefreshBusy,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            self.vatNumberMessage(undefined);
            self.vatNumberError(false);
            this.observable(undefined);
            $(this.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 12
        }
    };

    self.vatNumberParams.observable.subscribe(function (newValue) {
        self.vatNumberValid(undefined);
        self.vatNumberCheckPerformed(false);
        self.vatCheckBusy(true);
        if (newValue == null) {
            self.vatNumberError(false);
            self.vatNumberMessage(undefined);
        }
    });

    // holds whether or not the allocation permitted checkbox is enabled,
    // follows the disabled state of creditTerms.mdcSelect
    self.permitAllocationEnabled = ko.observable(true);

    // Holds the credit terms autocomplete params
    self.creditTermsAutocomplete = {
        label: 'Payment Terms',
        observable: ko.observable(),
        focusObservable: ko.observable(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            self.creditTerms(undefined);
            self.creditTermsAutocomplete.observable(undefined);
            $(self.creditTermsAutocomplete.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        },
        disabled: ko.observable(false),
        readOnly: ko.observable(false),
        autocompleteSettings: {
            value: self.creditTerms,
            appendTo: 'body',
            mapFunction: function (i) {
                return {
                    label: i.Label,
                    value: i.PaymentTermsID,
                    obj: i
                }
            },
            source: function (request, response) {
                var data = {
                    searchTerm: request.term,
                    basketId: self.basketId(),
                    tradeAccountId: self.tradeAccountId()
                };
                $.ajax({
                    url: '/api/ComponentAPI/CreditTermsAutocomplete',
                    type: "POST",
                    dataType: "json",
                    data: data,
                    success: function (data) {
                        response($.map(data, function (item) {
                            return {
                                label: item.Label,
                                value: item.PaymentTermsID,
                                obj: item
                            };
                        }));
                    }
                });
            },
            minLength: 0,
            select: function (event, ui) {
                event.preventDefault();
                self.creditTerms(ui.item.obj);
                $(self.creditTermsAutocomplete.observable.DOMElement).val(ui.item.label);
            },
            readOnly: false,
            autoFocus: true,
            create: function () {
                if (self.classField != null) {
                    $(this).data("ui-autocomplete")._renderItem = function (ul, item) {
                        var li = $("<li>");
                        var div = li.append("<div class='ui-menu-item-wrapper'><a href='#'>" + item.label + "<span class='type'>" + item.value[self.typeField] + "</span></a></div>");

                        li.addClass(item.value[self.classField]);

                        return li.appendTo(ul);
                    };
                }
            }
        }
    };

    self.creditTermsAutocomplete.focusObservable.subscribe(function (newValue) {
        if (newValue) {
            $(self.creditTermsAutocomplete.observable.DOMElement).autocomplete('search', '');
        }
    });

    // holds the order taker observable...
    self.orderTaker = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateBasketDetailsNow();
            },
            message: 'Order Taker is required'
        }
    });

    self.currency = ko.pureComputed(function () {
        if (self.tradeAccount()) {
            if (self.tradeAccount().hasOwnProperty('Currency'))
                if (self.tradeAccount().Currency != null)
                    return self.tradeAccount().Currency
        }
        return {
            FormattingCulture: 'en-GB',
            ISO_4217: 'GBP'
        }
    });

    // Holds the rep search term autocomplete params
    self.orderTakerAutocomplete = {
        label: 'Order Taker',
        observable: ko.observable(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        disabled: false,
        clearFunction: function () {
            self.orderTaker(undefined);
            self.orderTakerAutocomplete.observable(undefined);
            $(self.orderTakerAutocomplete.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        },
        autocompleteSettings: {
            value: self.orderTaker,
            appendTo: 'body',
            mapFunction: function (i) {
                return {
                    label: i.Name,
                    value: i.Code,
                    obj: i
                }
            },
            source: function (request, response) {
                var data = {
                    term: request.term
                };
                $.ajax({
                    url: '/api/ComponentAPI/OperatorAutocomplete',
                    type: "POST",
                    dataType: "json",
                    data: data,
                    success: function (data) {
                        response($.map(data, function (item) {
                            return {
                                label: item.Name,
                                value: item.Code,
                                obj: item
                            };
                        }));
                    }
                });
            },
            minLength: 1,
            select: function (event, ui) {
                event.preventDefault();
                self.orderTaker(ui.item.obj);
                $(self.orderTakerAutocomplete.observable.DOMElement).val(ui.item.label);
            },
            autoFocus: true,
            create: function () {
                if (self.classField != null) {
                    $(this).data("ui-autocomplete")._renderItem = function (ul, item) {
                        var li = $("<li>");
                        var div = li.append("<div class='ui-menu-item-wrapper'><a href='#'>" + item.label + "<span class='type'>" + item.value[self.typeField] + "</span></a></div>");

                        li.addClass(item.value[self.classField]);

                        return li.appendTo(ul);
                    };
                }
            }
        }
    };

    self.salesAgent = ko.observable().extend({
        //required: {
        //    params: true,
        //    onlyIf: function () {
        //        return self.validateBasketDetailsNow();
        //    },
        //    message: 'Sales Agent is required'
        //}
    });

    self.salesAgentAutocomplete = {
        label: 'Sales Agent',
        observable: ko.observable(),
        focusObservable: ko.observable(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        disabled: false,
        clearFunction: function () {
            self.salesAgent(undefined);
            self.salesAgentAutocomplete.observable(undefined);
            $(self.salesAgentAutocomplete.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        },
        autocompleteSettings: {
            value: self.salesAgent,
            appendTo: 'body',
            mapFunction: function (i) {
                return {
                    label: i.Name,
                    value: i.SalesAgentID,
                    obj: i
                }
            },
            source: function (request, response) {
                var data = {
                    term: request.term,
                    salesMarket: {
                        salesMarketId: self.tradeAccountSalesMarket
                    }
                };
                $.ajax({
                    url: '/api/ComponentAPI/SalesAgentAutocomplete',
                    type: "POST",
                    dataType: "json",
                    data: data,
                    success: function (data) {
                        response($.map(data, function (item) {
                            return {
                                label: item.Name,
                                value: item.SalesAgentID,
                                obj: item
                            };
                        }));
                    }
                });
            },
            minLength: 0,
            select: function (event, ui) {
                event.preventDefault();
                self.salesAgent(ui.item.obj);
                $(self.salesAgentAutocomplete.observable.DOMElement).val(ui.item.label);
            },
            autoFocus: true,
            create: function () {
                if (self.classField != null) {
                    $(this).data("ui-autocomplete")._renderItem = function (ul, item) {
                        var li = $("<li>");
                        var div = li.append("<div class='ui-menu-item-wrapper'><a href='#'>" + item.label + "<span class='type'>" + item.value[self.typeField] + "</span></a></div>");

                        li.addClass(item.value[self.classField]);

                        return li.appendTo(ul);
                    };
                }
            }
        }
    };

    self.salesAgentAutocomplete.focusObservable.subscribe(function (newValue) {
        if (newValue) {
            $(self.salesAgentAutocomplete.observable.DOMElement).autocomplete('search', '');
        }
    });

    // holds the rep search observable!
    self.salesRepresentative = ko.observable().extend({
        //required: {
        //    params: true,
        //    onlyIf: function () {
        //        return self.validateBasketDetailsNow();
        //    },
        //    message: 'Sales Representative is required'
        //}
    });

    // Holds the rep search term autocomplete params
    self.salesRepresentativeAutocomplete = {
        label: 'Sales Representative',
        observable: ko.observable(),
        focusObservable: ko.observable(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        disabled: false,
        clearFunction: function () {
            self.salesRepresentative(undefined);
            self.salesRepresentativeAutocomplete.observable(undefined);
            $(self.salesRepresentativeAutocomplete.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        },
        autocompleteSettings: {
            value: self.salesRepresentative,
            appendTo: 'body',
            mapFunction: function (i) {
                return {
                    label: i.Name,
                    value: i.SalesRepresentativeID,
                    obj: i
                }
            },
            source: function (request, response) {
                var data = {
                    term: request.term,
                    salesMarket: {
                        salesMarketId: self.tradeAccountSalesMarket
                    }
                };
                $.ajax({
                    url: '/api/ComponentAPI/SalesRepresentativeAutocomplete',
                    type: "POST",
                    dataType: "json",
                    data: data,
                    success: function (data) {
                        response($.map(data, function (item) {
                            return {
                                label: item.Name,
                                value: item.SalesRepresentativeID,
                                obj: item
                            };
                        }));
                    }
                });
            },
            minLength: 0,
            select: function (event, ui) {
                event.preventDefault();
                self.salesRepresentative(ui.item.obj);
                $(self.salesRepresentativeAutocomplete.observable.DOMElement).val(ui.item.label);
            },
            autoFocus: true,
            create: function () {
                if (self.classField != null) {
                    $(this).data("ui-autocomplete")._renderItem = function (ul, item) {
                        var li = $("<li>");
                        var div = li.append("<div class='ui-menu-item-wrapper'><a href='#'>" + item.label + "<span class='type'>" + item.value[self.typeField] + "</span></a></div>");

                        li.addClass(item.value[self.classField]);

                        return li.appendTo(ul);
                    };
                }
            }
        }
    };

    self.salesRepresentativeAutocomplete.focusObservable.subscribe(function (newValue) {
        if (newValue) {
            $(self.salesRepresentativeAutocomplete.observable.DOMElement).autocomplete('search', '');
        }
    });

    self.customerCareRecord = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateBasketDetailsNow() && (self.transactionType() == TRANSACTION_TYPE_REPLACEMENT);
            },
            message: 'Replacement Order must specify CCR'
        }
    });

    self.customerCareRecordAutocompleteHasFocus = ko.observable(false);

    self.customerCareRecordAutocompleteHasFocus.subscribe(function (newValue) {
        if (newValue == false) {
            if (self.customerCareRecord() == null) {
                self.customerCareRecordAutocomplete.observable(undefined);
            }
        }
    });

    // Holds the rep search term autocomplete params
    self.customerCareRecordAutocomplete = {
        label: 'Raised as a Result of Claim',
        observable: ko.observable(),
        focusObservable: self.customerCareRecordAutocompleteHasFocus,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        disabled: false,
        clearFunction: function () {
            self.customerCareRecord(undefined);
            self.customerCareRecordAutocomplete.observable(undefined);
            $(self.customerCareRecordAutocomplete.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        },
        autocompleteSettings: {
            value: self.customerCareRecord,
            appendTo: 'body',
            mapFunction: function (i) {
                return {
                    label: i,
                    value: i,
                    obj: i
                }
            },
            source: function (request, response) {
                var data = {
                    term: request.term,
                    tradeAccountCode: self.tradeAccount().Code
                };
                $.ajax({
                    url: '/api/ComponentAPI/CustomerCareRecordAutocomplete',
                    type: "POST",
                    dataType: "json",
                    data: data,
                    success: function (data) {
                        response($.map(data, function (item) {
                            return {
                                label: item.Item2,
                                value: item.Item1,
                                obj: item
                            };
                        }));
                    }
                });
            },
            minLength: 1,
            select: function (event, ui) {
                event.preventDefault();
                self.customerCareRecord(ui.item.value);
                $(self.customerCareRecordAutocomplete.observable.DOMElement).val(ui.item.label);
            },
            autoFocus: true,
            classField: 'ccr-result',
            create: function () {
                $(this).data("ui-autocomplete")._renderItem = function (ul, item) {
                    var li = $("<li>");
                    var div = li.append("<div class='ui-menu-item-wrapper'>" + item.label + "</div>");
                    return li.appendTo(ul);
                };
            }
        }
    };

    self.replacementOrderMemo = {
        label: 'Please briefly explain the problem to the Warehouse',
        observable: ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateBasketDetailsNow() && (self.transactionType() == TRANSACTION_TYPE_REPLACEMENT)
                },
                message: 'Warehouse memo required'
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        readOnly: false,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        rows: 3,
        charsRemainingOptions: {
            maxLength: 200
        }
    }

    self.heldForSalesAdditionalInformation = {
        label: 'Additional Information',
        observable: ko.observable(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        readOnly: false,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        rows: 4,
        charsRemainingOptions: {
            maxLength: 1000
        }
    }

    self.heldForSalesRecord = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.holdForSales()
            },
            message: 'Held for Sales Reason Required'
        }
    });

    self.heldForSalesRecordAutocompleteHasFocus = ko.observable(false);

    // Holds the rep search term autocomplete params
    self.heldForSalesRecordAutocomplete = {
        label: 'Held for Sales Reason Code',
        observable: ko.observable(),
        focusObservable: self.heldForSalesRecordAutocompleteHasFocus,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        disabled: false,
        clearFunction: function () {
            self.heldForSalesRecord(undefined);
            $(self.heldForSalesRecordAutocomplete.observable.DOMElement).val(undefined);
            self.heldForSalesRecordAutocomplete.observable(undefined);
            $(self.heldForSalesRecordAutocomplete.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        },
        autocompleteSettings: {
            value: self.heldForSalesRecord,
            appendTo: 'body',
            mapFunction: function (i) {
                return {
                    label: i,
                    value: i,
                    obj: i
                }
            },
            source: function (request, response) {
                var data = {
                    term: request.term,
                    tradeAccountCode: self.tradeAccount().Code
                };
                $.ajax({
                    url: '/api/ComponentAPI/HeldForSalesAutocomplete',
                    type: "POST",
                    dataType: "json",
                    data: data,
                    success: function (data) {
                        response($.map(data, function (item) {
                            return {
                                label: `${item.Code} - ${item.Name}`,
                                value: item.Code,
                                obj: item
                            };
                        }));
                    }
                });
            },
            minLength: 0,
            select: function (event, ui) {
                event.preventDefault();
                self.heldForSalesRecordAutocomplete.observable(ui.item.label);
                self.heldForSalesRecord(ui.item.value);
            },
            autoFocus: true,
            classField: 'ccr-result',
            create: function () {
                $(this).data("ui-autocomplete")._renderItem = function (ul, item) {
                    var li = $("<li>");
                    var div = li.append("<div class='ui-menu-item-wrapper'>" + item.label + "</div>");
                    return li.appendTo(ul);
                };
            }
        }
    };

    self.heldForSalesRecordAutocomplete.observable.subscribe(function (newValue) {
        // If you change any part of what's displayed, you are nullifying your held for sales record. Fact.
        // The only way to get one back is to select it using the drop down list.
        self.heldForSalesRecord(undefined);

    });

    self.heldForSalesRecordAutocompleteHasFocus.subscribe(function (newValue) {
        if (newValue == false) {
            if (self.heldForSalesRecord() == null) {
                self.heldForSalesRecordAutocomplete.observable(undefined);
            } else {
                // how... do we know the user hasn't just filled the field with junk and defocused it without selecting a record.
                // we don't; only selecting a record is a valid action so... the... autocompleter SHOULD clear out the stored record when it is changed...
            }
        } else {
            $(self.heldForSalesRecordAutocomplete.observable.DOMElement).autocomplete('search', '');
        }
    });

    // Holds the keyword-suggesting search term hinter params.
    self.searchTermKeywordAutocompleteParams = {
        mapFunction: function (i) {
            return {
                label: i.Suggestion,
                value: i,
                extraLabel: i.Label
            }
        },
        additionalParams: {
            searchTerm: self.searchTerm,
            widget: self.searchWidget,
            productTypeId: self.selectedProductType,
            brandId: self.selectedBrand,
            launchId: self.selectedLaunch,
            seasonal: self.seasonalProducts,
            tradeAccountId: self.tradeAccountId
        },
        minLength: 1,
        autoFocus: false,
        autocompleteEndpoint: '/api/componentapi/ProductSearchKeywordAutocomplete',
        select: function (ev, ui) {
            console.log('searchTermKeywordAutocomplete select', ui.item.value);
            ev.preventDefault();
            if (ui.item.value.Type === 'Standard') {
                self.searchTerm(ui.item.label);
                self.searchNonce.valueHasMutated();
            } else {
                self.collectionId(ui.item.value.CollectionID);
                $(self.searchTerm.DOMElement).val(ui.item.label);
                self.searchTerm.silentUpdate(ui.item.label);
                //self.searchTerm(ui.item.label);
                //self.search();
            }
        },
        open: function (event, ui) {
            $('.ui-autocomplete').off('menufocus hover mouseover');
        },
        close: function (ev, ui) {
            $(self.searchTerm.DOMElement).autocomplete('option', 'minLength', 1);
        },
        create: function () {
            $(self.searchTerm.DOMElement).data("ui-autocomplete")._renderItem = function (ul, item) {

                var li = null;
                var div = null;

                switch (item.value.Type) {

                    case 'Standard':
                        li = $("<li>");
                        div = li.append("<div class='ui-menu-item-wrapper'>" + item.label + "</div>");
                        li.addClass('li-search');
                        break;

                    case 'Collection':
                        li = $("<li>");
                        div = li.append(`<div class='ui-menu-item-wrapper'>${item.label}<span class='type'>${item.extraLabel}</span></div>`);
                        li.addClass('list-group-item-success li-search');
                        break;

                    case 'Disallowed':
                        li = $("<li style='pointer-events: none;'>");
                        div = li.append(`<div class='ui-menu-item-wrapper'>${item.label}<span class='type'>${item.extraLabel}</span></div>`);
                        li.addClass('list-group-item-danger li-search');
                        break;

                    default:
                        li = $("<li>");
                        div = li.append("<div class='ui-menu-item-wrapper'>" + item.label + "</div>");
                        li.addClass('li-search');
                        break;
                }

                return li.appendTo(ul);
            };
        }
    };

    // Holds direct reference to the slicer widget
    self.launchWidget = ko.observable();

    // Holds search results, takes searchResult
    self.searchResults = ko.observableArray([]);

    // Holds basket contents, takes basketProduct
    self.basket = ko.observableArray([]);

    //Holds the currently focused promoCodeInput's PARENT (searchResult or basketRecord)
    self.currentlyFocusedPromoCodeObject = null;

    //The notional promoCode observable, used for and necessary to the autocompleter
    self.promoCode = ko.observable();

    //Holds the parameters necessary to construct a trade promo autocomplete
    self.promoCodeAutocompleteParams = {
        mapFunction: function (i) {
            return {
                label: i.Code + ' - ' + i.Description,
                value: i.TradePromotionCodeID,
                obj: i
            }
        },
        minLength: 0,
        autocompleteEndpoint: '/api/componentapi/TradePromoCodeAutocomplete',
        search: function (ev, ui) {

        },
        select: function (ev, ui) {
            ev.preventDefault();
            $(ev.target).val(ui.item.obj.Code);

            // we can no longer guarantee that currentlyFocusedPromoCodeObject has property 'record';
            // this is because we are introducing an overarching promoCode override per display type.
            // when detected as being in play, this should instead affect ALL... so... we could... try... 

            if (self.currentlyFocusedPromoCodeObject == self.stockProductsPromoCodeOverride) {

                self.currentlyFocusedPromoCodeObject(ui.item.obj);

                Enumerable.From(self.basket()).Where(function (x) {
                    return x.display == ORDERFACTORY_ADD_MODE_STOCK;
                }).ForEach(function (basketProduct) {
                    basketProduct.promoCode(ui.item.obj);
                });

            }
            else if (self.currentlyFocusedPromoCodeObject == self.displayProductsPromoCodeOverride) {

                self.currentlyFocusedPromoCodeObject(ui.item.obj);

                Enumerable.From(self.basket()).Where(function (x) {
                    return x.display == ORDERFACTORY_ADD_MODE_DISPLAY;
                }).ForEach(function (basketProduct) {
                    basketProduct.promoCode(ui.item.obj);
                });

            } else if (self.currentlyFocusedPromoCodeObject == self.reserveProductsPromoCodeOverride) {

                self.currentlyFocusedPromoCodeObject(ui.item.obj);

                Enumerable.From(self.basket()).Where(function (x) {
                    return x.display == ORDERFACTORY_ADD_MODE_RESERVE;
                }).ForEach(function (basketProduct) {
                    basketProduct.promoCode(ui.item.obj);
                });

            } else {
                var extant = Enumerable.From(self.basket())
                    .Where(function (x) {
                        return (x.record.ProductID == self.currentlyFocusedPromoCodeObject.record.ProductID) &&
                            (x.display == self.currentlyFocusedPromoCodeObject.display);
                    })
                    .SingleOrDefault()
                if (extant) {
                    extant.promoCode(ui.item.obj);
                } else {
                    self.addToBasket(
                        self.currentlyFocusedPromoCodeObject.record,
                        self.currentlyFocusedPromoCodeObject.quantity(),
                        self.currentlyFocusedPromoCodeObject.discount(),
                        ui.item.obj
                    );
                }
            }
        },
        classes: {
            'ui-autocomplete': 'ui-autocomplete promo-code-ul'
        },
        open: function (ev, ui) {
            // necessary because the ul is originally attached to body,
            // and we want it attached to whichever promo code input you've intereacted with
            $('.ui-autocomplete').off('menufocus hover mouseover');
            $('ul.promo-code-ul').css({ 'left': 0, 'top': 33 });
        },
        close: function (ev, ui) {
            $('#promo-code-autocomplete').autocomplete('option', 'appendTo', $('body'));
        }
    };

    self.holdForSales.subscribe(function (newValue) {
        self.heldForSalesRecord(undefined);
        self.heldForSalesRecordAutocomplete.observable(undefined);
    });

    self.deliveryAddress.countryId.subscribe(function (newValue) {
        console.log('orderFactory deliveryAddress countryId subscribe hit', newValue);
    });

    // Holds the misc account invoice address (misc trade accounts only)
    self.miscInvoiceAddress = new addressViewModel({
        labelClass: 'order-products-label',
        controlClass: 'form-control mdc-text-field__input',
        validateNow: ko.observable(false)
    });

    // Holds the basket result which the user might be drilling down into.
    self.basketItemDrilldown = ko.observable();

    // Holds the search result which the user might be drilling down into.
    self.searchResultDrilldown = ko.observable();

    // Holds the end result of drilldown pre-processing
    self.drilldownData = ko.observable();

    // A nonce with which we can trigger the selectedFilterCount computed from the reset function.
    // We have silentUpdated the filters, so that the search isn't fired, but we need the count to be
    // updated.
    self.selectedFilterCountNonce = ko.observable();

    // Holds the available discount reasons.
    self.discountReasons = ko.observable(getDiscountReasons());

    // Can hold a customerVisitId, if necessary: if this modal was invoked from a customer visit 
    // context, self.show function must be called providing a customerVisitId.
    self.customerVisitId = ko.observable();

    // Clauses available to orders
    self.availableClauses = ko.observableArray([]);

    // Orders... about... clauses?
    self.orders = ko.observableArray([]);

    // Add all modal data.
    self.addAll = new addAllViewModel(self);

    // Retail Properties

    self.retailBusy = ko.observable(false);

    self.validateRetailNow = ko.observable(false);

    self.availableRetailTills = ko.observableArray([]);

    self.retailTillNumber = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateRetailNow()
            },
            message: 'Retail Till Number is required'
        }
    });

    self.retailTillNumberParams = {
        name: 'Retail Till Number',
        label: 'Till',
        observable: self.retailTillNumber,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        options: self.availableRetailTills,
        optionsText: 'Description',
        optionsValue: 'Code',
        optionsCaption: ' ',
        width: 'auto',
        showClear: true,
        onSelect: function () {

        },
        clearFunction: function () {
            self.retailTillNumber(undefined);
            self.availableRetailTillSessions([]);
        }
    }

    self.availableRetailTillSessions = ko.observableArray([]);

    self.retailSessionNumber = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateRetailNow()
            },
            message: 'Session Number is Required'
        },
        numberFormatted: {
            digits: 0,
            currency: {
                FormattingCulture: 'en-GB'
            }
        }
    });

    self.retailTillNumber.subscribe(function (newValue) {
        if (newValue) {
            self.retailSessionNumber(undefined);
            self.fetchRetailTillSessions(newValue);
        }
    });

    self.retailSessionNumberParams = {
        label: 'Session Number',
        observable: self.retailSessionNumber,
        options: self.availableRetailTillSessions,
        optionsText: 'Label',
        optionsValue: 'Code',
        optionsCaption: ' ',
        width: 'auto',
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            self.retailSessionNumber(undefined);
        }
    }

    // End of Retail Properties

    // #endregion

    // #region Subscriptions

    self.basket.subscribe(function (newValues) {

        console.log('orderFactory basket.subscribe hit', newValues.length);

        self.creditTerms.mdcTextField.disabled = !(newValues.length == 0);

        if (newValues.length == 0)
            self.permitAllocationEnabled(true);
        else
            self.permitAllocationEnabled(false);
    }, self);


    self.stockProductsPromoCodeOverride.subscribe(function (newValue) {
        if (newValue) {
            self.stockProductsDiscountOverride(100);
            // need to propagate through all the display() == stock products in the basket. both the discount and the promo code.
        } else {

            Enumerable.From(self.basket()).Where(function (x) {
                return x.display == ORDERFACTORY_ADD_MODE_STOCK;
            }).ForEach(function (basketProduct) {
                basketProduct.promoCode(undefined);
                basketProduct.discount(undefined);
            });

            self.stockProductsDiscountOverride.skipSubscribe = true;
            self.stockProductsDiscountOverride(undefined);
        }
    });

    self.stockProductsPromoCodeHasFocus.subscribe(function (value) {

        console.log('orderFactory stockProductsPromoCodeOverride subscribe hit');

        if (focus) {

            $('#promo-code-autocomplete').autocomplete('option', 'appendTo', $(self.stockProductsPromoCodeOverride.DOMElement).parent());

            self.currentlyFocusedPromoCodeObject = self.stockProductsPromoCodeOverride;

        } else {
            if (self.stockProductsPromoCodeOverride()) {
                if ($(self.stockProductsPromoCodeOverride.DOMElement).val() == '') {
                    self.stockProductsPromoCodeOverride(undefined);
                }
            } else {
                $(self.stockProductsPromoCodeOverride.DOMElement).val(undefined);
            }
        }
    });

    self.displayProductsPromoCodeOverride.subscribe(function (newValue) {
        if (newValue) {
            self.displayProductsDiscountOverride(100);
            // need to propagate through all the display() == display products in the basket. both the discount and the promo code.
        } else {

            Enumerable.From(self.basket()).Where(function (x) {
                return x.display == ORDERFACTORY_ADD_MODE_DISPLAY;
            }).ForEach(function (basketProduct) {
                basketProduct.promoCode(undefined);
                basketProduct.discount(undefined);
            });

            self.displayProductsDiscountOverride.skipSubscribe = true;
            self.displayProductsDiscountOverride(undefined);
        }
    });

    self.displayProductsPromoCodeHasFocus.subscribe(function (value) {

        console.log('orderFactory displayProductsPromoCodeOverride subscribe hit');

        if (focus) {

            $('#promo-code-autocomplete').autocomplete('option', 'appendTo', $(self.displayProductsPromoCodeOverride.DOMElement).parent());

            self.currentlyFocusedPromoCodeObject = self.displayProductsPromoCodeOverride;

        } else {
            if (self.displayProductsPromoCodeOverride()) {
                if ($(self.displayProductsPromoCodeOverride.DOMElement).val() == '') {
                    self.displayProductsPromoCodeOverride(undefined);
                }
            } else {
                $(self.displayProductsPromoCodeOverride.DOMElement).val(undefined);
            }
        }
    });

    self.reserveProductsPromoCodeOverride.subscribe(function (newValue) {
        if (newValue) {
            self.reserveProductsDiscountOverride(100);
            // need to propagate through all the display() == display products in the basket. both the discount and the promo code.
        } else {

            Enumerable.From(self.basket()).Where(function (x) {
                return x.display == ORDERFACTORY_ADD_MODE_RESERVE;
            }).ForEach(function (basketProduct) {
                basketProduct.promoCode(undefined);
                basketProduct.discount(undefined);
            });

            self.reserveProductsDiscountOverride.skipSubscribe = true;
            self.reserveProductsDiscountOverride(undefined);
        }
    });

    self.reserveProductsPromoCodeHasFocus.subscribe(function (value) {

        console.log('orderFactory reserveProductsPromoCodeOverride subscribe hit');

        if (focus) {

            $('#promo-code-autocomplete').autocomplete('option', 'appendTo', $(self.reserveProductsPromoCodeOverride.DOMElement).parent());

            self.currentlyFocusedPromoCodeObject = self.reserveProductsPromoCodeOverride;

        } else {
            if (self.reserveProductsPromoCodeOverride()) {
                if ($(self.reserveProductsPromoCodeOverride.DOMElement).val() == '') {
                    self.reserveProductsPromoCodeOverride(undefined);
                }
            } else {
                $(self.reserveProductsPromoCodeOverride.DOMElement).val(undefined);
            }
        }
    });

    self.filterViewMode.subscribe(function (newValue) {
        console.log('orderFactory filterViewMode subscribe hit', newValue);
    });

    self.searchDisplay.subscribe(function (newValue) {
        console.log('orderFactory searchDisplay subscribe hit', newValue);
    });

    self.availableSortOrders = ko.computed(function () {
        if (self.searchWidget()) {
            return Enumerable.From(self.searchSortOrders).Where(function (x) {
                return (x.ProductFilterGroupID == self.searchWidget().ProductFilterGroupID) &&
                    (x.Lifecycle == self.clearance());
            }).OrderBy('$.SortOrder').ToArray();
        }
        return [];
    });

    self.searchTerm.subscribe(function (newValue) {
        // hello, clearing out collectionId when searchTerm is being set...
        // perhaps avoid setting searchTerm when collectionId is getting set!
        if (self.collectionId()) {
            self.collectionId(undefined);
        }
    });

    self.saveBasketVisible.subscribe(function (newValue) {
        if (newValue) {
            if (self.orderReference.observable() != null) {
                window.setTimeout(function () {
                    $('.order-modal-save-basket-wrapper .mdc-text-field').each(function (i, ele) {
                        ele.MDCTextField.label_.float(true);
                        ele.MDCTextField.layout();
                    });
                }, 100);
            }
        }
    });

    self.tradeAccount.subscribe(function (newValue) {
        console.log('orderFactory tradeAccount subscribe hit', newValue);
        try {
            self.reset();
            if (newValue) {
                $.ajax({
                    url: '/api/componentapi/tradeAccountPreBasketNotifications',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        tradeAccountId: newValue.TradeAccountID
                    },
                    success: function (data) {
                        let result = JSON.parse(data.JSON);

                        if (result.hasOwnProperty('Notifications') && result.Notifications != null) {
                            ko.utils.arrayForEach(result.Notifications, function (n) {
                                self.tradeAccountOrderingNotifications.push(tradeAccountOrderNotification({ record: n, result: result, parent: self }));
                            });
                        }

                        for (var i = 0; i < self.tradeAccountOrderingNotifications().length; i++) {
                            if (i < self.tradeAccountOrderingNotifications().length)
                                self.tradeAccountOrderingNotifications()[i].nextNotice = self.tradeAccountOrderingNotifications()[i + 1];
                        }

                        if (self.tradeAccountOrderingNotifications().length) {
                            self.tradeAccountOrderingNotifications()[0].show();
                        } else {
                            self.mayStartOrder(result.CanStartOrder);
                            self.mayBrowse(result.CanBrowse);
                        }

                        //$.info('Notification', self.tradeAccountOrderingNotifications().join('<br/><br/>'));
                    },
                    error: function (xhr, s, a) {
                        $.showError(xhr, s, a);
                    }
                });
            }
        }
        catch (error) {
            $.showError({ responseText: error.stack }, 'That\'s an error');
            self.isResetting(false);
            throw (error);
        }
    });

    self.displayProductsDiscountOverride.subscribe(function (newValue) {

        if (self.displayProductsDiscountOverride.skipSubscribe) {
            self.displayProductsDiscountOverride.skipSubscribe = false;
            return;
        } else {
            self.displayProductsDiscountOverride.skipSubscribe = false;
        }

        var shouldWarn = false;

        ko.utils.arrayFirst(self.basket(), function (item) {
            if (item.display == ORDERFACTORY_ADD_MODE_DISPLAY && (item.price().list != item.price().final)) {
                shouldWarn = true;
                return shouldWarn;
            }
        });

        if (shouldWarn) {
            $.confirm(
                'Are you sure?',
                'This will override one or more other discounts you have already set',
                function () {
                    ko.utils.arrayForEach(self.basket(), function (item) {
                        if (item.display == ORDERFACTORY_ADD_MODE_DISPLAY) {
                            item.discount(+newValue);
                        }
                    });
                }, function () {
                    self.displayProductsDiscountOverride.skipSubscribe = true;
                    self.displayProductsDiscountOverride(undefined);
                }
            );
        } else {
            ko.utils.arrayForEach(self.basket(), function (item) {
                if (item.display == ORDERFACTORY_ADD_MODE_DISPLAY) {
                    item.discount(+newValue);
                }
            });
        }
    });

    self.stockProductsDiscountOverride.subscribe(function (newValue) {

        if (self.stockProductsDiscountOverride.skipSubscribe) {
            self.stockProductsDiscountOverride.skipSubscribe = false;
            return;
        } else {
            self.stockProductsDiscountOverride.skipSubscribe = false;
        }

        var shouldWarn = false;

        ko.utils.arrayFirst(self.basket(), function (item) {
            if (item.display == ORDERFACTORY_ADD_MODE_STOCK && (item.price().list != item.price().final)) {
                shouldWarn = true;
                return shouldWarn;
            }
        });

        if (shouldWarn) {
            $.confirm(
                'Are you sure?',
                'This will override one or more other discounts you have already set',
                function () {
                    ko.utils.arrayForEach(self.basket(), function (item) {
                        if (item.display == ORDERFACTORY_ADD_MODE_STOCK) {
                            item.discount(+newValue);
                        }
                    });
                }, function () {
                    self.stockProductsDiscountOverride.skipSubscribe = true;
                    self.stockProductsDiscountOverride(undefined);
                }
            );
        } else {
            ko.utils.arrayForEach(self.basket(), function (item) {
                if (item.display == ORDERFACTORY_ADD_MODE_STOCK) {
                    item.discount(+newValue);
                }
            });
        }
    });

    self.reserveProductsDiscountOverride.subscribe(function (newValue) {

        if (self.reserveProductsDiscountOverride.skipSubscribe) {
            self.reserveProductsDiscountOverride.skipSubscribe = false;
            return;
        } else {
            self.reserveProductsDiscountOverride.skipSubscribe = false;
        }

        var shouldWarn = false;

        ko.utils.arrayFirst(self.basket(), function (item) {
            if (item.display == ORDERFACTORY_ADD_MODE_RESERVE && (item.price().list != item.price().final)) {
                shouldWarn = true;
                return shouldWarn;
            }
        });

        if (shouldWarn) {
            $.confirm(
                'Are you sure?',
                'This will override one or more other discounts you have already set',
                function () {
                    ko.utils.arrayForEach(self.basket(), function (item) {
                        if (item.display == ORDERFACTORY_ADD_MODE_RESERVE) {
                            item.discount(+newValue);
                        }
                    });
                }, function () {
                    self.reserveProductsDiscountOverride.skipSubscribe = true;
                    self.reserveProductsDiscountOverride(undefined);
                }
            );
        } else {
            ko.utils.arrayForEach(self.basket(), function (item) {
                if (item.display == ORDERFACTORY_ADD_MODE_RESERVE) {
                    item.discount(+newValue);
                }
            });
        }
    });

    // This can handle NON-GROUPED searchResult objects... but it... creates a new searchresult... hm.
    // Why? If it's just taking in searchResults initially. Is it just taking in searchResults initially?
    self.searchResultDrilldown.subscribe(function (newValue) {
        console.log('searchResultDrilldown subscribe hit', newValue);
        if (newValue.searchResult) {
            var sr = new searchResult(newValue.record, self, newValue.patternBookSaturation);
            sr.products = [newValue];
            sr.productPage = {
                ProductPageName: newValue.record.Code + ' - ' + newValue.record.OrderFormName,
                ProductPageDescription: newValue.record.ProductPageDescription,
                ProductPageImageID: newValue.record.ImageID
            };
            //let promises = [self.fetchAdditionalProducts(sr)]
            //Promise.all(promises).then(function () {
            //    self.drilldownData(sr);
            //});
            self.drilldownData(sr);
        } else {
            // it's a grouping!
            var sr = new searchResult(newValue.products[0].record, self, newValue.products[0].patternBookSaturation);
            sr.products = newValue.products;
            sr.productPage = newValue.productPage;
            //{
            //    ProductPageName: newValue.record.Code + ' - ' + newValue.record.OrderFormName,
            //    ProductPageDescription: newValue.record.ProductPageDescription,
            //    ProductPageImageID: newValue.record.ImageID
            //};
            self.drilldownData(sr);
        }
    });

    // Remarkably, this is identical but for name to the above... and it just worked first time. Wonderful.
    self.basketItemDrilldown.subscribe(function (newValue) {

        // It seems we once more need to set searchWidget...

        var data = ko.dataFor($('.btn-secondary-blue[data-product-filter-id="' + newValue.record.ProductFilterID + '"]')[0]);

        console.log('basketItemDrilldown subscribe setting orderFactory.searchWidget to', data);

        self.searchWidget(data);

        console.log('basketItemDrilldown subscribe hit', newValue);
        var sr = new searchResult(newValue.record, self, newValue.patternBookSaturation);
        sr.products = [newValue];
        sr.productPage = {
            ProductPageName: newValue.record.Code + ' - ' + newValue.record.BasketName,
            ProductPageDescription: newValue.record.ProductPageDescription,
            ProductPageImageID: newValue.record.ImageID
        };

        //let promises = [self.fetchAdditionalProducts(sr)]

        //Promise.all(promises).then(function () {
        //    self.drilldownData(sr);
        //});

        self.drilldownData(sr);
    });

    self.drilldownData.subscribe(function (newValue) {
        console.log('drilldownData subscribe hit', newValue);

        if ($('#tab-drilldown-order').length) {
            ko.cleanNode($('#tab-drilldown-order')[0]);
        }

        self.parent.orderProductsDrilldown.load(newValue, self.tradeAccount);

        //if ($('#tab-drilldown-order').length) {
        //    ko.applyBindings(viewModel, $('#tab-drilldown-order')[0]);
        //}

        $('#promo-code-autocomplete').autocomplete('option', 'appendTo', $('body'));

        $($('#order-products-drilldown ul li a').first()).tab('show');

        if (!$('#order-products-drilldown-modal').is(':visible')) {
            $('#order-products-drilldown-modal').modal('show');
        }

        window.setTimeout(function () {
            $('#order-products-drilldown-modal .mdc-text-field').each(function (i, ele) {
                ele.MDCTextField.layout();
            });
        }, 300);
    });

    self.searchTermHasFocus.subscribe(function (newValue) {
        if (newValue) {
            if (self.selectedLaunch()) {
                // fire the autocomplete immediately,
                // excluding keyword suggestions...
                if (self.searchTerm() == null) {
                    $(self.searchTerm.DOMElement).autocomplete('option', 'minLength', 0);
                    $(self.searchTerm.DOMElement).autocomplete('search');
                }
            }
        } else {
            // do we really want to fire the search on blur...
            //self.searchNonce.valueHasMutated();
            // I don't want to, no.
        }
    });

    self.selectedBrand.subscribe(function (newValue) {
        self.searchTerm.valueHasMutated();
    });

    self.selectedLaunch.subscribe(function (newValue) {
        self.searchTerm.valueHasMutated();
    });

    self.clearance.subscribe(function (newValue) {
        console.log('orderFactory clearance subscribe hit', newValue);
        self.refreshProductFilterButtons();
    });

    self.searchNew.subscribe(function (newValue) {
        self.refreshProductFilterButtons();
    });

    self.fetchItemTypes = function (productFilterId, productFilterGroupId) {
        if (productFilterId || productFilterGroupId) {
            var data = {
                productFilterId: productFilterId,
                productFilterGroupId: productFilterGroupId
            }
            console.log('calling fetchItemTypes with', data);
            $.ajax({
                url: '/api/componentapi/fetchItemTypes',
                type: 'POST',
                data: data,
                success: function (data) {
                    console.log('fetchItemTypes returned', data);
                    self.itemTypeFilterButtons(data);
                }
            });
        }
    }

    self.fetchSizes = function (productFilterId, productFilterGroupId) {
        var data = {
            productFilterId: productFilterId,
            productFilterGroupId: productFilterGroupId
        }
        console.log('calling fetchSizes with', data);
        $.ajax({
            url: '/api/componentapi/fetchSizes',
            type: 'POST',
            data: data,
            success: function (data) {
                console.log('fetchSizes returned', data);
                self.sizeFilterButtons(data);
            }
        });
    }

    self.searchWidgetGroup.subscribe(function (newValue) {
        console.log('searchWidgetGroup subscribe hit', newValue);

        if (newValue) {
            var def = Enumerable.From(self.availableSortOrders()).Where(function (x) {
                return x.ProductFilterGroupID == newValue &&
                    x.Lifecycle == self.clearance() &&
                    x.Default == true
            }).SingleOrDefault();

            if (def)
                self.searchSortOrder(def.Code);
            else
                self.searchSortOrder(Enumerable.From(self.availableSortOrders()).First());
        } else {
            // ... don't know?
            self.searchSortOrder('Newness');
        }
    });

    self.searchWidget.subscribe(function (newValue) {

        if (newValue) {
            self.searchWidgetGroup(self.searchWidgetProductFilterGroupId());

            // if what?

            self.searchPageSize(newValue.DefaultPageSize || 50);

            switch (newValue.DefaultLayout) {
                case 'G':
                    self.searchDisplay(ORDERFACTORY_SEARCH_DISPLAY_GRID);
                    break;
                case 'L':
                    self.searchDisplay(ORDERFACTORY_SEARCH_DISPLAY_LIST);
                    break;
                default:
                    self.searchDisplay(ORDERFACTORY_SEARCH_DISPLAY_GRID);
            }

            self.patternBookSaturationViewAll(true);

            var clearSearchTerm = true;

            /*
             * 
             * If you're looking at the same productType, we want to retain the collectionId you might have
             * searched for.
             * 
             * Fine; we have previousProductType and selectedProductType. Selected is set when you click on a Category.
             * Previous is set (when?).
             * 
             * CollectionID... 
             * 
             * 
            */


            // If we have a previousProductType
            if (self.previousProductType()) {
                // and that previous product type id is not the same as the currently selected one
                if (self.previousProductType() != self.selectedProductType()) {
                    self.collectionId.silentUpdate(undefined); // clear the collectionId
                    // then set previous to current
                    self.previousProductType(self.selectedProductType());
                    // and clear filters.
                    self.resetFilters();
                } else {
                    // if the previous is the same as the current, avoid clearing search term.
                    clearSearchTerm = false;
                }
            } else {
                // If previousProductType is null, set it - and reset the filters.
                self.previousProductType(self.selectedProductType());
                self.resetFilters();
            }

            self.fetchItemTypes(newValue.ProductFilterID, newValue.ProductFilterGroupID);

            self.fetchSizes(newValue.ProductFilterID, newValue.ProductFilterGroupID);

            self.display(ORDERFACTORY_ADD_MODE_STOCK);

            $("#order-products-modal").scrollTop(0);

            $('#promo-code-autocomplete').autocomplete('option', 'appendTo', $('body'));

            // The switching of modes before the searchresults have been cleared
            // causes undesirable display of results in the wrong mode - briefly - 
            // before the search ajax call returns. What's the solution?
            // Either clear searchResults here, which I was doing earlier... but which
            // is now causing an error from fastForEach,
            // or... move the switching of modes until after we've got the next result set?
            // That might well face us with the same problem but reversed; new set being
            // put in previous mode for an instant.

            // So... clear the search results here and find out what fastForEach is complaining about?

            console.log('orderFactory searchWidget subscribe hit', newValue);

            // should we force busy... probably not from here, eh?
            // leave that up to the search function
            //if (Object.keys(newValue).length > 1) {
            //    self.busy(true);
            //}
            self.searchResults([]);

            // On a hunch, I decided to let the DOM update and clear up the search results
            // before doing stuff... and voila! No error.

            if (clearSearchTerm) {
                self.searchTerm.silentUpdate(undefined);
            }

            window.setTimeout(function () {
                switch (newValue.Value) {
                    case 'FabricBespokeHanger':
                    //self.bespokeFabricHangerFactory.reset();
                    //self.mode(ORDERFACTORY_MODE_BESPOKE_FABRIC_HANGERS);
                    //self.searchTerm.valueHasMutated();
                    //break;
                    case 'FabricBespokeShowlength':
                        self.bespokeFabricShowlengthFactory.reset();
                        self.mode(ORDERFACTORY_MODE_BESPOKE_FABRIC_SHOWLENGTHS);
                        self.searchTerm.valueHasMutated();
                        break;
                    case 'BespokeRug':
                        self.bespokeRugFactory.reset();
                        self.mode(ORDERFACTORY_MODE_BESPOKE_RUGS);
                        self.searchTerm.valueHasMutated();
                        break;
                    case 'BespokeRunner':
                        self.bespokeRugFactory.reset();
                        self.mode(ORDERFACTORY_MODE_BESPOKE_RUGS);
                        self.searchTerm.valueHasMutated();
                        break;
                    case 'WallpaperBespokeShowlength':
                        self.bespokeWallpaperShowlengthFactory.reset();
                        self.mode(ORDERFACTORY_MODE_BESPOKE_WALLPAPER_SHOWLENGTHS);
                        self.searchTerm.valueHasMutated();
                        break;
                    case 'BespokeFurniture':
                        self.bespokeFurnitureFactory.reset();
                        self.mode(ORDERFACTORY_MODE_BESPOKE_FURNITURE);
                        self.searchTerm.valueHasMutated();
                        break;
                    case 'ArchitectRing':
                        self.bespokeArchitectRingFactory.reset();
                        self.mode(ORDERFACTORY_MODE_BESPOKE_ARCHITECT);
                        self.searchTerm.valueHasMutated();
                        break;
                    case 'QuickDisplay':
                        $('#quickdisplay-list').empty();
                        self.mode(ORDERFACTORY_MODE_QUICKDISPLAYS);
                        self.quickDisplayFactory.fetch();
                        self.busy(false);
                        break;
                    default:
                        self.mode(ORDERFACTORY_MODE_STANDARD);
                        self.searchTerm.valueHasMutated();
                        break;
                }
            }, 20);
        }

    });

    self.promoCode.subscribe(function (newValue) {
        console.log('promoCode subscribe hit', newValue);
        window.setTimeout(function () {
            $(self.promoCode.DOMElement).autocomplete('search');
        }, 0);
    });

    self.phase.subscribe(function (newValue) {
        console.log('orderFactory phase subscribe hit', newValue);

        if (self.basketId()) {

            var data = {
                basketId: self.basketId(),
                phaseId: newValue
            }
            console.log('calling basketStatusCheck with', data);
            $.ajax({
                url: '/api/componentapi/BasketStatusCheck',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('basketStatusCheck returned', data);
                    if (!data.Active) {
                        $.info('Sorry', data.OperatorMessage, null, function () {
                            $('#order-products-modal').modal('hide');
                            self.reset();
                            self.parent.memberBasketFetcher.resultGridWidget().dataSource.read();
                            self.parent.memberBasketFetcher.importResultGridWidget().dataSource.read();
                        })
                    } else {

                        if (newValue != -1 && newValue != null) {
                            self.updateLatestPhase(newValue);
                        }

                        switch (newValue) {
                            case ORDERFACTORY_PHASE_ADDRESS:
                                if (self.basketId())
                                    self.deliveryAddressFactory.loadAddresses(function () {
                                    });
                                break;
                            case ORDERFACTORY_PHASE_MISC:
                                break;
                            case ORDERFACTORY_PHASE_PREAMBLE:
                                self.fetchBasketParameters();
                                break;
                            case ORDERFACTORY_PHASE_SEARCH:
                                self.filterViewMode.valueHasMutated();
                                break;
                            case ORDERFACTORY_PHASE_BASKET:
                                self.fetchBasket();
                                break;
                            case ORDERFACTORY_PHASE_SHIPPINGCHECK:
                                self.deliveryAddressFactory.performShippingCheck();
                                break;
                            case ORDERFACTORY_PHASE_DISPATCH:
                                self.dispatchFactory.reset();
                                self.dispatchFactory.fetchDispatchInfo(null, function () {
                                    self.fetchBasket(null, false, false);
                                });
                                break;
                            case ORDERFACTORY_PHASE_DELIVERY_ALERT:
                                self.busy(false);
                                self.dispatchFactory.showLastChanceModal();
                                break;
                            case ORDERFACTORY_PHASE_COMMENTS:
                                self.busyMessage('Fetching Comments, Notes and Clauses...');
                                self.busy(true);
                                self.fetchBasket(function () {
                                    self.fetchClauses().then(function () {
                                        let promises = [self.fetchBasketComments(), self.fetchBasketNotes()];

                                        Promise.allSettled(promises).then(function () {
                                            self.busy(false);
                                            self.busyMessage(undefined);
                                        });
                                    });
                                }, false, false);

                                break;
                            case ORDERFACTORY_PHASE_REVIEW_VATNUMBER:
                                self.fetchBasket(function () {
                                    self.fetchBasketReview();
                                }, false, false);
                                break;
                        }
                    }
                }
            });
        } else {

            if (newValue != -1 && newValue != null) {
                self.updateLatestPhase(newValue);
            }

            switch (newValue) {
                case ORDERFACTORY_PHASE_ADDRESS:
                    if (self.basketId())
                        self.deliveryAddressFactory.loadAddresses(function () {
                        });
                    break;
                case ORDERFACTORY_PHASE_MISC:
                    break;
                case ORDERFACTORY_PHASE_PREAMBLE:
                    self.fetchBasketParameters();
                    break;
                case ORDERFACTORY_PHASE_SEARCH:
                    self.filterViewMode.valueHasMutated();
                    break;
                case ORDERFACTORY_PHASE_BASKET:
                    self.fetchBasket();
                    break;
                case ORDERFACTORY_PHASE_SHIPPINGCHECK:
                    self.deliveryAddressFactory.performShippingCheck();
                    break;
                case ORDERFACTORY_PHASE_DISPATCH:
                    self.dispatchFactory.fetchDispatchInfo();
                    break;
                case ORDERFACTORY_PHASE_COMMENTS:

                    self.busyMessage('Fetching Comments, Notes and Clauses...');
                    self.busy(true);

                    self.fetchClauses().then(function () {
                        let promises = [self.fetchBasketComments(), self.fetchBasketNotes()];

                        Promise.allSettled(promises).then(function () {
                            self.busy(false);
                            self.busyMessage(undefined);
                        });
                    });
                    break;
                case ORDERFACTORY_PHASE_REVIEW_VATNUMBER:
                    self.fetchBasket(function () {
                        self.fetchBasketReview();
                    }, false, false);
                    break;
            }
        }
    });

    self.regressThroughReviewStages = function () {
        switch (self.phase()) {
            case ORDERFACTORY_PHASE_REVIEW_MANAGER_DISCO:
                if (Enumerable.From(self.basketReview().SummaryNotices).Where(function (x) {
                    return x.CheckStageID == 0
                }).Any()) {
                    self.phase(ORDERFACTORY_PHASE_REVIEW_VATNUMBER);
                } else {
                    self.phase(ORDERFACTORY_PHASE_COMMENTS);
                }
                break;
            case ORDERFACTORY_PHASE_REVIEW_DUPLICATES:
                if (Enumerable.From(self.basketReview().SummaryNotices).Where(function (x) {
                    return x.CheckStageID == 1
                }).Any()) {
                    self.phase(ORDERFACTORY_PHASE_REVIEW_MANAGER_DISCO);
                } else if (Enumerable.From(self.basketReview().SummaryNotices).Where(function (x) {
                    return x.CheckStageID == 0
                }).Any()) {
                    self.phase(ORDERFACTORY_PHASE_REVIEW_VATNUMBER);
                } else {
                    self.phase(ORDERFACTORY_PHASE_COMMENTS);
                }
                break;
            case ORDERFACTORY_PHASE_REVIEW_FOC:
                if (Enumerable.From(self.basketReview().SummaryNotices).Where(function (x) {
                    return x.CheckStageID == 2
                }).Any()) {
                    self.phase(ORDERFACTORY_PHASE_REVIEW_DUPLICATES);
                } else if (Enumerable.From(self.basketReview().SummaryNotices).Where(function (x) {
                    return x.CheckStageID == 1
                }).Any()) {
                    self.phase(ORDERFACTORY_PHASE_REVIEW_MANAGER_DISCO);
                } else if (Enumerable.From(self.basketReview().SummaryNotices).Where(function (x) {
                    return x.CheckStageID == 0
                }).Any()) {
                    self.phase(ORDERFACTORY_PHASE_REVIEW_VATNUMBER);
                } else {
                    self.phase(ORDERFACTORY_PHASE_COMMENTS);
                }
                break;
            case ORDERFACTORY_PHASE_REVIEW_HOLD:
                if (Enumerable.From(self.basketReview().SummaryNotices).Where(function (x) {
                    return x.CheckStageID == 3
                }).Any()) {
                    self.phase(ORDERFACTORY_PHASE_REVIEW_FOC);
                } else if (Enumerable.From(self.basketReview().SummaryNotices).Where(function (x) {
                    return x.CheckStageID == 2
                }).Any()) {
                    self.phase(ORDERFACTORY_PHASE_REVIEW_DUPLICATES);
                } else if (Enumerable.From(self.basketReview().SummaryNotices).Where(function (x) {
                    return x.CheckStageID == 1
                }).Any()) {
                    self.phase(ORDERFACTORY_PHASE_REVIEW_MANAGER_DISCO);
                } else if (Enumerable.From(self.basketReview().SummaryNotices).Where(function (x) {
                    return x.CheckStageID == 0
                }).Any()) {
                    self.phase(ORDERFACTORY_PHASE_REVIEW_VATNUMBER);
                } else {
                    self.phase(ORDERFACTORY_PHASE_COMMENTS);
                }
                break;
        }
    }

    // #endregion

    // #region Computeds

    self.displayOrderFeatures = ko.pureComputed(function () {
        return self.viewingMode() == ORDERFACTORY_VIEWING_MODE_ORDER;
    }, self);

    self.miscTradeAccount = ko.pureComputed(function () {
        if (self.tradeAccount()) {
            return self.tradeAccount().MiscellaneousAccount || false;
        }
    }, self);

    self.retailTradeAccount = ko.pureComputed(function () {
        if (self.tradeAccount()) {
            return self.tradeAccount().RetailTill || false
        }
    }, self);

    self.basketLineCount = ko.pureComputed(function () {
        if (self.basket().length) {
            return Enumerable.From(self.basket()).Where(function (x) {
                return x.IncludeInQuantityTotal == false
            }).Count();
        }
    }, self);

    self.basketLineQuantity = ko.pureComputed(function () {
        if (self.basket().length) {
            return Enumerable.From(self.basket()).Where(function (x) {
                return x.IncludeInQuantityTotal == false
            }).Select(function (x) {
                return +x.Quantity;
            }).Sum().toFixed(1);
        }
    }, self);

    self.basketLineTotal = ko.pureComputed(function () {
        if (self.basket().length) {
            return formatCurrency(Enumerable.From(self.basket()).Where(function (x) {
                return x.IncludeInPriceTotal == true
            }).Select(function (x) {
                return +x.FinalPrice;
            }).Sum(), 2, self.currency().FormattingCulture, self.currency().ISO_4217);
        }
    }, self);

    self.stockProductsPromoCodeComputed = ko.pureComputed({
        read: function () {
            if (self.stockProductsPromoCodeOverride()) {
                return self.stockProductsPromoCodeOverride().Code;
            }
        },
        write: function (value) {
            self.promoCode(value);
            if (value == null || value == "") {
                self.stockProductsDiscountOverride(undefined);
            }
        }
    }, self);

    self.displayProductsPromoCodeComputed = ko.pureComputed({
        read: function () {
            if (self.displayProductsPromoCodeOverride()) {
                return self.displayProductsPromoCodeOverride().Code;
            }
        },
        write: function (value) {
            self.promoCode(value);
            if (value == null || value == "") {
                self.displayProductsDiscountOverride(undefined);
            }
        }
    }, self);

    self.reserveProductsPromoCodeComputed = ko.pureComputed({
        read: function () {
            if (self.reserveProductsPromoCodeOverride()) {
                return self.reserveProductsPromoCodeOverride().Code;
            }
        },
        write: function (value) {
            self.promoCode(value);
            if (value == null || value == "") {
                self.reserveProductsDiscountOverride(undefined);
            }
        }
    }, self);

    // With thanks to MDN!
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
    self.createBinaryString = function (nMask) {
        // nMask must be between -2147483648 and 2147483647
        for (var nFlag = 0, nShifted = nMask, sMask = ''; nFlag < 32;
            nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1);
        return sMask;
    }

    //    self.serializeViewSettings = ko.computed(function () {

    //        var clearance = 0;

    //        switch (self.clearance()) {
    //            case ORDERFACTORY_SEARCH_TYPE_ALL:
    //                clearance = 2;
    //                break;
    //            case ORDERFACTORY_SEARCH_TYPE_CLEARANCE:
    //                clearance = 1;
    //                break;
    //            case ORDERFACTORY_SEARCH_TYPE_CURRENT:
    //                clearance = 0;
    //                break;
    //        }
    //        // 2 1
    //        /* 5 2 6 3 1
    //         * 6 8 4 2 6 8 4 2 1
    //         * 
    //         *             F E D C B A 9 8 7 6 5 4 3 2 1
    //         *       
    //         * // No; let's chunk it into... say... 32 bit chunks. Why the hell not.
    //         * Name them:
    //         * 
    //         * x
    //             * Clearance             [2]
    //             * selectedWidth         [2]
    //             * searchNew             [1]
    //             * filterViewMode        [1]
    //             * searchDisplay         [1]
    //         * 
    //         * k
    //             * selectedPattern       [8] (max 12 on display, but a byte for a key)
    //             * selectedStock         [8]
    //             * selectedMartindale    [8]
    //             * selectedSize          [8]
    //         * 
    //         * c
    //             * selectedLaunch       [16] (maximum 4 on display any time, but I have to work with IDs)
    //             * selectedItemType     [16] (we have a ridiculous number of potential itemTypes and I must be able to represent any of them)
    //         *
    //         * d
    //             * ProductFilterID       [8]
    //             * selectedColour        [8] (maximum 14 colours)
    //             * selectedBrand         [8] (maximum 6 brands, but... easier to have nice round numbers of bits?)
    //         *
    //         * 
    //         * 
    //         * 
    //         * 
    //self.selectedColour = ko.observable();
    //self.selectedBrand = ko.observable();
    //self.selectedLaunch = ko.observable();
    //self.selectedPattern = ko.observable();
    //self.selectedItemType = ko.observable();
    //self.selectedStock = ko.observable();
    //self.selectedMartindale = ko.observable();
    //self.selectedWidth = ko.observable();
    //self.selectedSize = ko.observable();
    //self.searchNew = ko.observable(false);
    //         */

    //        // we might get away with treating them ALL as bytes... maybe except New, as that's clearly boolean.

    //        // you first want to shift left by however many bits you're going to consume.

    //        // you can't << 0x5E, because Number.MAX_SAFE_INTEGER.toString(2); - Whoops. Find another way.

    //        // Hmmmm. So... To stay inside of the wossname, we can feasibly just split this into two different potatoes...
    //        // Or rather split this one potato into two halves!

    //        var width = 0;

    //        switch (self.selectedWidth()) {
    //            case null:
    //                //noop;
    //                break;
    //            case 0:
    //                width = 1;
    //                break;
    //            case 1:
    //                width = 2;
    //                break;
    //            default:
    //                break;
    //        }

    //        var xBase10 = clearance << 5;
    //        xBase10 = xBase10 | (width << 3);
    //        xBase10 = xBase10 | (+self.searchNew() << 2);
    //        xBase10 = xBase10 | (+self.filterViewMode() << 1);
    //        xBase10 = xBase10 | (+self.searchDisplay());

    //        var xHex = xBase10.toString(16);
    //        var xBin = self.createBinaryString(xBase10);

    //        //console.log('xHex', xHex);
    //        //console.log('xBin', xBin);


    //        var kBase10 = +self.selectedPattern() << 0x18;
    //        kBase10 = kBase10 | (+self.selectedStock() << 0x10);
    //        kBase10 = kBase10 | (+self.selectedMartindale() << 0x08);
    //        kBase10 = kBase10 | +self.selectedSize();

    //        var kHex = kBase10.toString(16);
    //        var kBin = self.createBinaryString(kBase10);

    //        //console.log('kHex', kHex);
    //        //console.log('kBin', kBin);


    //        var cBase10 = +self.selectedLaunch() << 0x10;
    //        cBase10 = cBase10 | +self.selectedItemType();

    //        var cHex = cBase10.toString(16);
    //        var cBin = self.createBinaryString(cBase10);

    //        //console.log('cHex', cHex);
    //        //console.log('cBin', cBin);


    //        var dBase10 = +self.searchWidgetProductFilterId() << 0x10;
    //        dBase10 = dBase10 | (+self.selectedColour() << 0x08);
    //        dBase10 = dBase10 | +self.selectedBrand();

    //        var dHex = dBase10.toString(16);
    //        var dBin = self.createBinaryString(dBase10);

    //        //console.log('dHex', dHex);
    //        //console.log('dBin', dBin);


    //        //console.log('orderFactory serializeViewSettings x', xBase10, xBin, xHex);
    //        //console.log('orderFactory serializeViewSettings k', kBase10, kBin, kHex);
    //        //console.log('orderFactory serializeViewSettings c', cBase10, cBin, cHex);
    //        //console.log('orderFactory serializeViewSettings d', dBase10, dBin, dHex);

    //        var paramBuilder = new URLSearchParams();

    //        if (xHex != 0)
    //            paramBuilder.append('x', xHex)
    //        if (kHex != 0)
    //            paramBuilder.append('k', kHex);
    //        if (cHex != 0)
    //            paramBuilder.append('c', cHex);
    //        if (dHex != 0)
    //            paramBuilder.append('d', dHex);

    //        return '?' + paramBuilder.toString();
    //    }, self);

    self.shareUrl = ko.pureComputed(function () {
        return '<a href="' + window.location.href.replace(window.location.search, '') + self.serializeViewSettings() + '" target="_blank">'
            + window.location.href.replace(window.location.search, '') + self.serializeViewSettings()
            + '</a>';
    }, self);

    self.modeHeader = ko.pureComputed(function () {
        var result = '';

        if (self.searchWidgetValue() == null &&
            self.busy() == false &&
            self.brandGroupedSearchResults().length == 0) {
            return '<div class="no-items">Please Select a Category</div>';
        }

        if (self.searchResults().length == 0 &&
            self.busy() == false) {
            return '<div class="no-items">There are no products in this category matching your search criteria or the product you are searching for has been discontinued.</div>';
        }

        switch (self.mode()) {
            case ORDERFACTORY_MODE_BESPOKE_FABRIC_HANGERS:
                result = '<h4>Bespoke Fabric Hangers</h4>';
                break;
            case ORDERFACTORY_MODE_BESPOKE_FABRIC_SHOWLENGTHS:
                result = '<h4>Bespoke Fabric Showlengths</h4>';
                break;
            case ORDERFACTORY_MODE_BESPOKE_WALLPAPER_SHOWLENGTHS:
                result = '<h4>Bespoke Wallpaper Showlengths</h4>';
                break;
            case ORDERFACTORY_MODE_BESPOKE_RUGS:
                result = '<h4>Bespoke Rugs</h4>';
                break;
            case ORDERFACTORY_MODE_BESPOKE_FURNITURE:
                result = '<h4>Bespoke Furniture</h4>';
                break;
            case ORDERFACTORY_MODE_QUICKDISPLAYS:
                result = '';//<h4>Quick Displays</h4>';
                break;
            default: break;
        }
        return result;
    });

    /* 
     So the filterButtons on each of the productFilterGroups have a large set of properties
     determining what to display in filters and elsewhere... 
     the appropriate set for the parent PFG is a logical OR across all of the child properties.
     */

    self.groupedProductFilterButtons = ko.computed(function () {
        return Enumerable.From(self.productFilterButtons()).GroupBy(function (pfg) {
            return {
                productFilterGroup: pfg.ProductFilterGroup,
                productFilterGroupId: pfg.ProductFilterGroupID,
                sortOrder: pfg.ProductFilterGroupSortOrder
            }
        },
            function (result) {
                return result;
            },
            function (key, pfg) {

                var parentProperties = {};

                Object.keys(pfg.source[0]).forEach(function (k) {
                    parentProperties[k] = null;
                });

                pfg.source.forEach(function (button) {
                    Object.keys(button).forEach(function (k) {
                        parentProperties[k] = parentProperties[k] || button[k];
                    });
                });

                parentProperties.AddAll = false;
                parentProperties.Value = -1;
                parentProperties.ProductFilterID = null;
                //console.log(parentProperties);
                // I would not be in the least surprised if this was insufficient...


                return $.extend(parentProperties, {
                    key: key,
                    filterButtons: pfg.source
                })
            },
            function (pfg) {
                return pfg.productFilterGroupId
            })
            .OrderBy('$.key.sortOrder')
            .ToArray()
    });

    self.groupedProductFilterButtons.subscribe(function (newValues) {
        window.setTimeout(function () {
            $('#category-accordion .panel-collapse').on('show.bs.collapse', function (e) { $('a:first-child', e.target).click(); });
        }, 100);
    });

    // DEFUNCT
    self.discountReviewItems = ko.computed(function () {
        return [];
        //return ko.utils.arrayFilter(self.basket(), function (item) {
        //    return item.discount() > 0
        //});
    });

    // DEFUNCT
    self.discountReviewNecessary = ko.computed(function () {
        return false;
        //return ko.utils.arrayFirst(self.basket(), function (item) {
        //    return item.discount() > 0
        //});
    });

    self.selectedFilterCount = ko.computed(function () {
        var ctr = 0;

        var t = self.selectedFilterCountNonce();

        if (self.selectedColour()) ctr++;
        if (self.selectedBrand()) ctr++;
        if (self.selectedLaunch()) ctr++;
        if (self.selectedPattern()) ctr++;
        if (self.selectedItemType()) ctr++;
        if (self.selectedStock()) ctr++;
        if (self.selectedMartindale()) ctr++;
        if (self.selectedWidth()) ctr++;
        if (self.selectedSize()) ctr++;

        return ctr;
    });

    self.modeTitle = ko.pureComputed(function () {
        switch (self.mode()) {
            case ORDERFACTORY_MODE_STANDARD:
                break;
            case ORDERFACTORY_MODE_BESPOKE_FABRIC_HANGERS:
                return 'Bespoke Fabric Hangers';
                break;
            case ORDERFACTORY_MODE_BESPOKE_RUGS:
                return 'Bespoke Rugs';
                break;
            case ORDERFACTORY_MODE_BESPOKE_FABRIC_SHOWLENGTHS:
                return 'Bespoke Fabric Showlengths';
                break;
            case ORDERFACTORY_MODE_BESPOKE_WALLPAPER_SHOWLENGTHS:
                return 'Bespoke Wallpaper Showlengths';
                break;
            case ORDERFACTORY_MODE_BESPOKE_FURNITURE:
                return 'Furniture';
                break;
            case ORDERFACTORY_MODE_QUICKDISPLAYS:
                return 'Quick Displays';
                break;
            default: break;
        }
    }, self);

    self.orderTypeGroupings = ko.computed(function () {
        return Enumerable.From(self.basket()).GroupBy(function (x) {
            var group = {
                orderTypeId: x.record.OrderTypeID,
                name: x.record.OrderTypeName
            }
            return group
        },
            function (grouping) {
                return grouping;
            },
            function (key, basketItems) {

                key.tradePriceTotal = ko.pureComputed(function () {
                    return Enumerable.From(basketItems.source).Where(function (x) {
                        return x.record.IncludeInPriceTotal
                    }).Select(function (x) {
                        return x.record.TradePrice * x.record.Quantity;
                    }).Sum()
                }, self);

                key.tradePriceDisplay = ko.pureComputed(function () {
                    return `${formatCurrency(key.tradePriceTotal(), 2, self.currency().FormattingCulture, self.currency().ISO_4217)} <sub>Ex. VAT</sub>`
                }, self);

                key.specialPriceTotal = ko.pureComputed(function () {
                    return Enumerable.From(basketItems.source).Where(function (x) {
                        return x.record.IncludeInPriceTotal
                    }).Select(function (x) {
                        return x.record.SpecialPrice
                    }).Sum()
                }, self);

                key.specialPriceDisplay = ko.pureComputed(function () {
                    return `${formatCurrency(key.specialPriceTotal(), 2, self.currency().FormattingCulture, self.currency().ISO_4217)} <sub>Ex. VAT</sub>`
                }, self);

                key.totalQuantity = ko.pureComputed(function () {
                    return Enumerable.From(basketItems.source).Where(function (x) {
                        return x.record.IncludeInQuantityTotal
                    }).Select(function (x) {
                        return +x.quantity()
                    }).Sum()
                });

                key.quantityDisplay = ko.pureComputed(function () {
                    return key.totalQuantity().toFixed(2);
                });

                key.totalExVat = ko.pureComputed(function () {
                    return Enumerable.From(basketItems.source).Where(function (x) {
                        return x.record.IncludeInPriceTotal
                    }).Select(function (x) {
                        return x.record.FinalPrice * x.record.Quantity;
                    }).Sum()
                }, self);

                key.totalExVatDisplay = ko.pureComputed(function () {
                    return `${formatCurrency(key.totalExVat(), 2, self.currency().FormattingCulture, self.currency().ISO_4217)} <sub>Ex. VAT</sub>`;
                }, self);

                key.totalVat = ko.pureComputed(function () {
                    return Enumerable.From(basketItems.source).Where(function (x) {
                        return x.record.IncludeInPriceTotal
                    }).Select(function (x) {
                        return x.record.VATSubTotal
                    }).Sum()
                }, self);

                key.totalVatDisplay = ko.pureComputed(function () {
                    return `${formatCurrency(key.totalVat(), 2, self.currency().FormattingCulture, self.currency().ISO_4217)}`
                }, self);

                key.totalIncVat = ko.pureComputed(function () {
                    return key.totalExVat() + key.totalVat()
                }, self);

                key.totalIncVatDisplay = ko.pureComputed(function () {
                    return `${formatCurrency(key.totalIncVat(), 2, self.currency().FormattingCulture, self.currency().ISO_4217)} <sub>Inc. VAT</sub>`;
                }, self);

                var basketGroupings = Enumerable.From(basketItems.source).Where(function (x) {
                    return (x.record.ParentRowNumber == null)
                })
                    .GroupBy(function (x) {
                        var grouping = {
                            basketGroup: x.record.BasketGroup,
                            deliveryGroupId: x.record.DeliveryGroupID, // this... doesn't actually exist until you enter Despatch. Bugger.
                            deliveryGroup: ko.pureComputed(function () {
                                return Enumerable.From(self.dispatchFactory.deliveryGroups()).Where(function (y) {
                                    return y.deliveryGroup.deliveryGroupId == x.record.DeliveryGroupID &&
                                        y.deliveryGroup.basketSplitId == x.record.BasketSplitID
                                }).SingleOrDefault()
                            }, self)
                        }
                        return grouping
                    },
                        function (grouping) {
                            return grouping;
                        },
                        function (orderTypeKey, products) {
                            let theseRows = Enumerable.From(products.source).Select(function (x) {
                                return x.record.RowNumber
                            }).ToArray();

                            var childProducts = Enumerable.From(self.basket()).Where(function (x) {
                                return (theseRows.indexOf(x.record.ParentRowNumber) > -1) &&
                                    (x.record.ParentRowNumber != null)
                            }).ToArray();

                            childProducts.forEach(function (child) {
                                let theseGrandChildren = Enumerable.From(basketItems.source).Where(function (x) {
                                    return x.record.ParentRowNumber == child.record.RowNumber;
                                }).ToArray();

                                products.source.splice(products.source.findIndex(function (parent) {
                                    if (parent.record.RowNumber == child.record.ParentRowNumber)
                                        parent.HasChildren = true;
                                    return parent.record.RowNumber == child.record.ParentRowNumber;
                                }) + 1, 0, child);

                                if (theseGrandChildren.length) {
                                    child.HasChildren = true;
                                    ko.utils.arrayForEach(theseGrandChildren, function (gc) {
                                        gc.isGrandChild = true;
                                        products.source.push(gc);
                                    });
                                }
                            });

                            var result = {
                                basketGrouping: orderTypeKey,
                                products: products.source
                            };
                            return result;
                        },
                        function (grouping) {
                            return grouping.basketGroup
                        }).OrderBy(function (bdg) {
                            if (bdg.basketGrouping.deliveryGroup()) {
                                return bdg.basketGrouping.deliveryGroup().deliveryGroup.sortOrder
                            }
                        }).ToArray();

                var orderTypeGrouping = {
                    orderType: key,
                    basketGroupings: basketGroupings//basketItems.source
                }

                return orderTypeGrouping;
            },
            function (grouping) {
                return grouping.orderTypeId
            }).ToArray();
    });

    self.tradePriceTotal = ko.pureComputed(function () {
        return Enumerable.From(self.orderTypeGroupings()).Select(function (x) {
            return x.orderType.tradePriceTotal()
        }).Sum();
    }, self);

    self.tradePriceTotalDisplay = ko.pureComputed(function () {
        return `${formatCurrency(self.tradePriceTotal(), 2, self.currency().FormattingCulture, self.currency().ISO_4217)} <sub>Ex. VAT</sub>`
    }, self);

    self.specialPriceTotal = ko.pureComputed(function () {
        return Enumerable.From(self.orderTypeGroupings()).Select(function (x) {
            return x.orderType.specialPriceTotal()
        }).Sum();
    }, self);

    self.specialPriceTotalDisplay = ko.pureComputed(function () {
        return `${formatCurrency(self.specialPriceTotal(), 2, self.currency().FormattingCulture, self.currency().ISO_4217)} <sub>Ex. VAT</sub>`
    }, self);

    self.totalQuantity = ko.pureComputed(function () {
        return Enumerable.From(self.orderTypeGroupings()).Select(function (x) {
            return x.orderType.totalQuantity()
        }).Sum();
    }, self);

    self.totalQuantityDisplay = ko.pureComputed(function () {
        return self.totalQuantity().toFixed(2);
    }, self);

    self.totalExVat = ko.pureComputed(function () {
        return Enumerable.From(self.orderTypeGroupings()).Select(function (x) {
            return x.orderType.totalExVat()
        }).Sum();
    }, self);

    self.totalExVatDisplay = ko.pureComputed(function () {
        return `${formatCurrency(self.totalExVat(), 2, self.currency().FormattingCulture, self.currency().ISO_4217)} <sub>Ex. VAT</sub>`
    }, self);

    self.totalVat = ko.pureComputed(function () {
        return Enumerable.From(self.orderTypeGroupings()).Select(function (x) {
            return x.orderType.totalVat()
        }).Sum();
    }, self);

    self.totalVatDisplay = ko.pureComputed(function () {
        return `${formatCurrency(self.totalVat(), 2, self.currency().FormattingCulture, self.currency().ISO_4217)}`
    }, self);

    self.totalIncVat = ko.pureComputed(function () {
        return self.totalExVat() + self.totalVat()
    }, self);

    self.totalIncVatDisplay = ko.pureComputed(function () {
        return `${formatCurrency(self.totalIncVat(), 2, self.currency().FormattingCulture, self.currency().ISO_4217)} <sub>Inc. VAT</sub>`
    }, self);


    // how on earth... will I make an exception of the treatments (or other products) which have a ParentRowNumber
    self.groupedProducts = ko.computed(function () {
        return Enumerable.From(self.basket())
            .Where(function (x) {
                return (x.record.ParentRowNumber == null) && (x.record.OrderTypeID == ORDERFACTORY_ADD_MODE_STOCK)
            })
            .GroupBy(function (x) {
                var grouping = {
                    basketGroup: x.record.BasketGroup,
                    orderType: x.record.OrderTypeID
                }
                return grouping
            },
                function (grouping) {
                    return grouping;
                },
                function (key, products) {
                    let theseRows = Enumerable.From(products.source).Select(function (x) {
                        return x.record.RowNumber
                    }).ToArray();

                    var childProducts = Enumerable.From(self.basket()).Where(function (x) {
                        return (theseRows.indexOf(x.record.ParentRowNumber) > -1) &&
                            (x.record.ParentRowNumber != null) &&
                            (x.record.OrderTypeID == ORDERFACTORY_ADD_MODE_STOCK)
                    }).ToArray();

                    childProducts.forEach(function (child) {
                        products.source.splice(products.source.findIndex(function (parent) {
                            if (parent.record.RowNumber == child.record.ParentRowNumber)
                                parent.HasChildren = true;
                            return parent.record.RowNumber == child.record.ParentRowNumber;
                        }) + 1, 0, child);
                    });

                    var result = {
                        basketGrouping: key,
                        products: products.source
                    };
                    return result;
                },
                function (grouping) {
                    return grouping.basketGroup
                })
            .OrderBy('$.basketGrouping')
            .ToArray()
    }, self);

    self.groupedDisplayProducts = ko.computed(function () {
        return Enumerable.From(self.basket())
            .Where(function (x) {
                return (x.ParentRowNumber == null) && (x.OrderTypeID == ORDERFACTORY_ADD_MODE_DISPLAY)
            })
            .GroupBy(function (x) {
                return x.BasketGroup
            },
                function (grouping) {
                    return grouping;
                },
                function (key, products) {
                    let theseRows = Enumerable.From(products.source).Select(function (x) {
                        return x.RowNumber
                    }).ToArray();

                    var childProducts = Enumerable.From(self.basket()).Where(function (x) {
                        return (theseRows.indexOf(x.ParentRowNumber) > -1) &&
                            (x.ParentRowNumber != null) &&
                            (x.OrderTypeID == ORDERFACTORY_ADD_MODE_DISPLAY)
                    }).ToArray();

                    childProducts.forEach(function (child) {
                        products.source.splice(products.source.findIndex(function (parent) {
                            if (parent.RowNumber == child.ParentRowNumber)
                                parent.HasChildren = true;
                            return parent.RowNumber == child.ParentRowNumber;
                        }) + 1, 0, child);
                    });

                    var result = {
                        basketGrouping: key,
                        products: products.source
                    };
                    return result;
                },
                function (grouping) {
                    return grouping
                })
            .OrderBy('$.basketGrouping')
            .ToArray()
    }, self);

    self.groupedReserveProducts = ko.computed(function () {
        return Enumerable.From(self.basket())
            .Where(function (x) {
                return (x.ParentRowNumber == null) && (x.OrderTypeID == ORDERFACTORY_ADD_MODE_RESERVE)
            })
            .GroupBy(function (x) {
                return x.BasketGroup
            },
                function (grouping) {
                    return grouping;
                },
                function (key, products) {
                    let theseRows = Enumerable.From(products.source).Select(function (x) {
                        return x.RowNumber
                    }).ToArray();

                    var childProducts = Enumerable.From(self.basket()).Where(function (x) {
                        return (theseRows.indexOf(x.ParentRowNumber) > -1) &&
                            (x.ParentRowNumber != null) &&
                            (x.OrderTypeID == ORDERFACTORY_ADD_MODE_RESERVE)
                    }).ToArray();

                    childProducts.forEach(function (child) {
                        products.source.splice(products.source.findIndex(function (parent) {
                            if (parent.RowNumber == child.ParentRowNumber)
                                parent.HasChildren = true;
                            return parent.RowNumber == child.ParentRowNumber;
                        }) + 1, 0, child);
                    });

                    var result = {
                        basketGrouping: key,
                        products: products.source
                    };
                    return result;
                },
                function (grouping) {
                    return grouping
                })
            .OrderBy('$.basketGrouping')
            .ToArray()
    }, self);

    self.brandGroupedSearchResults = ko.computed(function () {
        return Enumerable.From(self.searchResults())
            .GroupBy(function (result) {
                var result = {
                    Brand: result.record.Brand,
                    BrandID: result.record.BrandID,
                    LogoSrc: self.brandLogoSrc(result.record.BrandID)
                }
                result.Header = ko.pureComputed(function () {
                    if (this.LogoSrc) {
                        return `<div class="search-result-brand-row">
                                    <img class="brand-logo" src="${this.LogoSrc}" />
                                </div>`
                    } else {
                        return `<span>${this.Brand}</span>`
                    }
                }, result);
                return result;
            },
                function (result) {
                    return result
                },
                function (key, brandGrouping) {
                    return {
                        brand: key,
                        productTypes: Enumerable.From(brandGrouping.source).GroupBy(
                            function (productPage) {
                                return {
                                    ProductType: productPage.record.ProductType.replace('<br/>', ' ')
                                }
                            },
                            function (productPage) {
                                return productPage
                            },
                            function (key, products) {
                                return {
                                    productType: key,
                                    productPages: ko.observableArray(Enumerable.From(products.source).GroupBy(
                                        function (productPage) {
                                            return {
                                                Grouped: productPage.record.Grouped,
                                                ProductPageID: productPage.productPageId,
                                                ProductPageName: productPage.record.ProductPageName,
                                                ProductPageDescription: productPage.record.ProductPageDescription,
                                                ProductPageImageID: productPage.record.ProductPageImageID,
                                                SortOrder: productPage.record.SortOrder
                                            }
                                        },
                                        function (productPage) {
                                            return productPage
                                        },
                                        function (key, products) {
                                            return {
                                                productPage: key,
                                                products: products.source
                                            }
                                        },
                                        function (productPage) {
                                            return productPage.ProductPageID
                                        }
                                    ).OrderBy(
                                        function (productPage) {
                                            return productPage.SortOrder;
                                        }
                                    ).ToArray())
                                    //.extend({
                                    //    infiniteScroll: {
                                    //        numColsPerPage: 3,
                                    //        numRowsPerPage: 2
                                    //    }
                                    //})
                                }
                            },
                            function (productType) {
                                return productType.ProductType
                            }
                        ).ToArray()
                    }
                },
                function (brandGrouping) {
                    return brandGrouping.BrandID;
                }
            ).ToArray();
    });

    self.groupedSearchResults = ko.computed(function () {
        return Enumerable.From(self.searchResults())
            .GroupBy('{ Brand: $.record.Brand, ProductPageID: $.productPageId, ProductPageName: $.record.ProductPageName, ProductPageImageID: $.record.ProductPageImageID, SortOrder: $.record.SortOrder }',
                '',
                function (key, groups) {
                    var result = {
                        productPage: key,
                        products: groups.source
                    }
                    return result;
                },
                function (x) { return x.ProductPageID })
            .OrderBy('$.productPage.SortOrder')
            .ToArray()
    }, self);

    // detect resize
    //$(window).resize(function () {
    //    self.updateViewportDimensions();
    //});

    // tell infinte-scroll about the current scroll position
    // (debounce is important for ie11 smooth scroll problems! and also generally nicer in all browsers)
    //$('.search-result-flex-wrapper').scroll(function () {
    //    self.items.infinitescroll.scrollY($('#itemsUL').scrollTop());
    //    //// add more items if scroll reaches the last 100 items
    //    //if (self.items.peek().length - self.items.infinitescroll.lastVisibleIndex.peek() <= 100) {
    //    //    populateItems(100);
    //    //}
    //});

    // update dimensions of infinite-scroll viewport and item
    //self.updateViewportDimensions = function () {

    //    let itemRef = $('.search-result').first()

    //    if (itemRef) {
    //        ko.utils.arrayForEach(self.brandGroupedSearchResults(), function (brand) {
    //            ko.utils.arrayForEach(brand.productTypes, function (productType) {
    //                productType.productPages.infiniteScroll.viewportWidth($(productType.productPages.DOMElement).width());
    //                productType.productPages.infiniteScroll.viewportHeight($(productType.productPages.DOMElement).height());
    //                productType.productPages.infiniteScroll.itemWidth(itemRef.outerWidth());
    //                productType.productPages.infiniteScroll.itemHeight(itemRef.outerHeight());
    //            });
    //        });
    //    }


    //    //var itemsRef = $('#itemsUL'),
    //    //    itemRef = $('.item').first(),
    //    //    itemsWidth = 240,
    //    //    itemsHeight = 300,
    //    //    itemWidth = 220,
    //    //    itemHeight = 20;

    //    //self.infinitescroll.viewportWidth(itemsWidth);
    //    //self.items.infinitescroll.viewportHeight(itemsHeight);
    //    //self.items.infinitescroll.itemWidth(itemWidth);
    //    //self.items.infinitescroll.itemHeight(itemHeight);

    //}
    //self.updateViewportDimensions();


    // #endregion

    // #region Components / Slicers

    // manages bulk discounting from the basket phase
    self.bulkDiscounter = new deliveryGroupDiscounterViewModel(self);

    // Manages the bespoke hanger form
    //self.bespokeFabricHangerFactory = new bespokeFabricHangerFactory(self);

    // Manages the bespoke fabric showlength form
    self.bespokeFabricShowlengthFactory = new bespokeFabricShowlengthFactory(self);

    // Manages the bespoke wallpaper showlength form
    self.bespokeWallpaperShowlengthFactory = new bespokeWallpaperShowlengthFactory(self);

    // Manages the bespoke rug form
    self.bespokeRugFactory = new bespokeRugFactory(self);

    // Manages the bespoke furniture form
    self.bespokeFurnitureFactory = new bespokeFurnitureFactory(self);

    // Manages the bespoke architect ring form
    self.bespokeArchitectRingFactory = new bespokeArchitectRingFactory(self);

    // Manages the QuickDisplay stuff
    self.quickDisplayFactory = new quickDisplayFactory(self);

    // Manages the Delivery Address... Stuff.
    self.deliveryAddressFactory = new deliveryAddressFactory(self);

    // This MUST exist before the dispatchFactory
    self.eoriNumber = ko.observable();

    // Manages the dispatch phase of the process
    self.dispatchFactory = new dispatchFactory(self);

    // Do we even bother requesting an EORI number?
    self.basketRequestsEORI = ko.observable(true);

    // This needs to reside here: deliveryAddress must exist, and dispatchFactory must exist...
    // however, EORINumber above does need to evaluate this computed... might cause problems.
    // Paint going out on Pallets must mandate EORI and ContactName (see )
    self.basketRequiresEORI = ko.observable(false);

    //    ko.pureComputed(function () {

    //    if (self.euExitCode.observable()) {
    //        return false; // we have an EU Exit Code - EORI etc are not mandatory
    //    }
    //    if (self.deliveryAddress.country()) {
    //        if (self.deliveryAddress.country().EU) {

    //            if (Enumerable.From(self.dispatchFactory.deliveryGroups()).Where(function (x) {

    //                if (x.deliveryService()
    //                    && x.deliveryService().HaulierCode == 'FL'
    //                    && [6, 13, 14, 15].indexOf(x.deliveryGroup.deliveryGroupId) > -1) {
    //                    return true
    //                }

    //                return false;
    //            }).Any()) {
    //                return true; // We're delivering Bespoke Rugs, Rug - Large, Rug - Extra Large, or 3m Wide Pole 
    //                // into Germany via Flight Logistics.EORI mandated.
    //            }

    //            if (Enumerable.From(self.dispatchFactory.deliveryGroups()).Where(function (x) {
    //                if (x.deliveryService())
    //                    return x.deliveryService().HaulierCode == 'TUF'
    //                else
    //                    return false;
    //            }).Any()) {
    //                return true; // We're via Tuffnells. EORI mandated.
    //            }

    //            if (Enumerable.From(self.dispatchFactory.deliveryGroups()).Where(function (x) {
    //                if (x.deliveryService())
    //                    return x.deliveryService().HaulierCode == 'PT'
    //                else
    //                    return false;
    //            }).Any()) {
    //                return true; // We're delivering into the EU and the order contains some paint to be despatched on a pallet.
    //            }

    //            return false;
    //        }
    //        if (self.deliveryAddress.countryId() == 81 && self.deliveryAddress.postcode.observable()?.toUpperCase()?.indexOf('BT') == 0) {

    //            if (Enumerable.From(self.dispatchFactory.deliveryGroups()).Where(function (x) {
    //                if (x.deliveryService())
    //                    return x.deliveryService().HaulierCode == 'TUF'
    //                else
    //                    return false;
    //            }).Any()) {
    //                return true; // We're delivering into Northern Ireland via Tuffnells. EORI mandated.
    //            }
    //        }
    //    }
    //}, self);

    self.anyTuffnellsDespatches = ko.pureComputed(function () {
        if (Enumerable.From(self.dispatchFactory.deliveryGroups()).Where(function (x) {
            if (x.deliveryService())
                return x.deliveryService().HaulierCode == 'TUF'
            else
                return false;
        }).Any()) {
            return true; // We're delivering at least one group via Tuffnells. Delivery Contact Name mandated.
        }

        return false;
    }, self);

    self.eoriNumberValid = ko.observable(false);
    self.eoriNumberError = ko.observable(false);
    self.eoriNumberMessage = ko.observable();

    self.forceEORINumberValidation = function () {
        ko.validation.validateObservable(self.eoriNumber);
        self.eoriNumber.isValid.notifySubscribers(self.eoriNumber.isValid());
    }

    self.eoriNumberCheckPerformed = ko.observable(false).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.dispatchFactory.validateLastChanceNow() && (self.basketRequiresEORI());
            },
            message: 'EORI Number Check not performed'
        },
        mustEqual: {
            params: true,
            onlyIf: function () {
                return self.dispatchFactory.validateLastChanceNow() && (self.basketRequiresEORI());
            },
            message: 'EORI Number Check not performed'
        }
    });

    self.eoriNumberCheckPerformed.subscribe(function (newValue) {
        console.log('orderFactory eoriNumberCheckPerformed subscribe hit', newValue);
    });

    // need these here, as the computed has to exist before the eoriNumber observable validation can be processed.
    // Messy, I'll grant you, but that's life sometimes.
    self.eoriNumber.extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.dispatchFactory.validateLastChanceNow() && self.basketRequiresEORI()
            },
            message: 'This Order must have an EORI number'
        },
        validation: {
            async: true,
            message: 'This Order must have an EORI number',
            validator: function (val, parms, callback) {
                if (val) {
                    val = val.replace(/EORI/g, '');
                    let endpoint = '/api/componentapi/ValidateEORINumberEU';
                    if (val.toLowerCase().indexOf('gb') == 0) {
                        endpoint = '/api/componentapi/ValidateEORINumberGB';
                    }
                    var data = {
                        eoriNumber: val
                    }
                    console.log(`orderFactory calling "${endpoint}" with`, data);
                    self.eoriRefreshBusy(true);
                    $.ajax({
                        url: endpoint,
                        type: 'POST',
                        data: data,
                        async: false,
                        success: function (data) {
                            console.log(`orderFactory "${endpoint}" returned`, data);
                            if (data.valid) {
                                self.eoriNumberValid(true);
                                self.eoriNumberError(false);
                                self.eoriNumberMessage('Confirmed, valid EORI Number for: ' + (data.name ?? self.tradeAccount().Code));
                                callback(true);
                            } else {
                                self.eoriNumberValid(false);
                                self.eoriNumberError(true);
                                if (val.toLowerCase().indexOf('gb') == 0) {
                                    self.eoriNumberMessage('Incorrect or expired EORI Number. Please refer to <a href="https://www.gov.uk/check-eori-number" target="_blank">The UK\'s EORI pages</a> for assistance.');
                                } else {
                                    self.eoriNumberMessage('Incorrect or expired EORI Number. Please refer to <a href="https://ec.europa.eu/taxation_customs/dds2/eos/eori_home.jsp?Lang=en" target="_blank">The European Union\'s EORI pages</a> for assistance.');
                                }

                                self.eoriNumberMessage(self.eoriNumberMessage() + '<br/>You will not be able to submit this order until Credit Control have corrected the EORI Number on this account.');

                                callback(false);
                            }
                            self.eoriNumberCheckPerformed(true);
                            self.eoriRefreshBusy(false);
                        },
                        error: function (xhr, s, a) {
                            self.eoriNumberValid(undefined);
                            self.eoriNumberCheckPerformed(false);
                            self.eoriNumberError(true);
                            self.eoriNumberMessage('The EORI Number checking service cannot currently validate this EORI Number.')
                            self.eoriRefreshBusy(false);
                            self.vatCheckBusy(false);
                            callback(false);
                        }
                    });
                } else {
                    if (self.dispatchFactory.validateLastChanceNow() && self.basketRequiresEORI()) {
                        callback(false);
                    }
                }

            }
        },
        rateLimit: {
            timeout: 500,
            method: 'notifyWhenChangesStop'
        }
    });

    self.eoriNumberParams = {
        label: 'EORI Number',
        observable: self.eoriNumber,
        readOnly: true,
        busy: self.eoriRefreshBusy,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: false,
        charsRemainingOptions: {
            maxLength: 20
        },
        readOnly: ko.pureComputed(() => !self.miscTradeAccount(), self)
    };


    // This kept for posterity, because it's a useful way to prevent validation crawling touching a particular object.
    //// This... Is an attempt at magic. It *might* prevent this object from being traveresed by the ko.validation deep 
    //// scan... However, it could be bad. 
    //// HOWEVER! IT JUST WORKED BECAUSE AWESOMENESS.
    //// The problem being caused was the recursive scan from basketItem to basketItem.parent (which is this object).
    //// Therefore the discountReviewErrors validation group was validating all other validatable observables such as
    //// addresses, which was nothing to do with it. The discountReviewErrors group HAS to be live, deep and observable
    //// because it wants to validate discounts on basket items...
    //self._destroy = true; 

    // #endregion

    // #region Validation Groups

    self.retailPaymentErrors = ko.validation.group([
        self.retailTillNumber,
        self.retailSessionNumber
    ]);

    self.euExitErrors = ko.validation.group([
        //self.euExitCode,
        self.euExitingConfirmed,
        self.euExitFinalDestinationAddress
    ], {
        deep: true
    });

    self.newBasketErrors = ko.validation.group([
        self.transactionType,
        self.callType,
        self.callerParams.observable,
        self.orderReference.observable,
        self.emailManager.emails,
        self.orderTaker,
        self.creditTerms,
        self.salesRepresentative,
        self.salesAgent,
        self.replacementOrderMemo.observable,
        self.customerCareRecord,
        self.usTaxExemptionCertificate,
        self.vatNumber,
        self.vatCountryCode,
        self.vatNumberCheckPerformed,
        self.euExitingConfirmed,
        self.euExitingDenied
    ], {
        deep: true,
        live: true
    });

    self.basketCommentErrors = ko.validation.group([
        self.orders
    ], {
        deep: true,
        observable: true,
        live: true
    });

    self.saveBasketErrors = ko.validation.group([
        self.orderReference.observable,
        self.emailManager.emails,
        self.orderTaker,
        self.creditTerms,
        self.salesRepresentative,
        self.salesAgent,
        self.customerCareRecord
    ], {
        deep: true,
        live: true
    });

    // #endregion

    // #region Functions

    self.fetchDocument = function (document, parent) {
        let objJsonStr = JSON.stringify({
            documentType: document.documentType,
            basketId: parent.BasketID,
            transactionId: parent.TransactionID,
            languageId: parent.LanguageID
        });
        let objJsonB64 = btoa(objJsonStr);

        window.open('/documents/view?' + new URLSearchParams({
            d: objJsonB64
        }).toString(), '_blank');
    }

    self.showSupplierInfoTab = function () {
        $('#order-products-drilldown-modal').on('show.bs.modal', function () {
            window.setTimeout(function () {
                $('a[href="#tab-drilldown-supplier"]').trigger('click');
                $('#order-products-drilldown-modal').off('show.bs.modal');
            }, 0);
        });
    }

    self.validateBasketPhase = function (onComplete) {

        //if (typeof onComplete === 'function')
        //    onComplete();

        //return;

        self.validateBasketPhaseNow(true);

        window.setTimeout(function () {
            if (Enumerable.From(self.basket()).Where(function (x) {
                return x.record.basketItemErrors.length > 0;
            }).Any()) {
                $.error('Please fix the problems in your basket before continuing', 'One or more of the items in your basket needs your attention.<br/><br/>Please edit all rows currently highlighted in red in order to resolve the problems. You cannot continue to Despatch until all issues have been resolved.');
            } else {
                if (typeof onComplete === 'function')
                    onComplete();
            }
        }, 100);
    }

    self.jumpToDeliveryFromDispatch = function () {
        self.dispatchFactory.closeDeliveryOption();
        self.phase(ORDERFACTORY_PHASE_ADDRESS);
    }

    self.updateLatestPhase = function (phase) {
        if (self.basketId()) {
            $.ajax({
                url: '/api/componentapi/UpdateBasketPhase',
                type: 'POST',
                dataType: 'json',
                data: {
                    basketId: self.basketId(),
                    phase: phase
                },
                success: function (data) {
                    self.lastPhaseVisited(phase);
                }
            });
        }
    }

    self.fetchBasketReview = function () {
        self.busy(true);
        self.busyMessage('Loading Basket Review...');
        var data = {
            basketId: self.basketId()
        }
        console.log('orderFactory calling fetchBasketReview with', data);
        $.ajax({
            url: '/api/componentapi/FetchBasketReview',
            type: 'POST',
            data: data,
            success: function (data) {
                self.busy(false);
                console.log('orderFactory fetchBasketReview returned', data);
                self.basketReview(data);

                ko.utils.arrayForEach(data.DeliveryServiceUpdates, function (dsu) {
                    var ds = Enumerable.From(self.dispatchFactory.deliveryGroups()).Where(function (dg) {
                        return dg.deliveryGroup.basketSplitId == dsu.BasketSplitID
                    }).Single();

                    ds.deliveryService().finalDeliveryVAT(dsu.FinalDeliveryVAT);
                });

                if (Enumerable.From(data.SummaryNotices).Where(function (x) {
                    return x.CheckStageID == 0
                }).Any()) {
                    return;
                } else if (Enumerable.From(data.SummaryNotices).Where(function (x) {
                    return x.CheckStageID == 1
                }).Any()) {
                    self.phase(ORDERFACTORY_PHASE_REVIEW_MANAGER_DISCO);
                } else if (Enumerable.From(data.SummaryNotices).Where(function (x) {
                    return x.CheckStageID == 2
                }).Any()) {
                    self.phase(ORDERFACTORY_PHASE_REVIEW_DUPLICATES);
                } else if (Enumerable.From(data.SummaryNotices).Where(function (x) {
                    return x.CheckStageID == 3
                }).Any()) {
                    self.phase(ORDERFACTORY_PHASE_REVIEW_FOC);
                } else if (Enumerable.From(data.SummaryNotices).Where(function (x) {
                    return x.CheckStageID == 4
                }).Any()) {
                    self.phase(ORDERFACTORY_PHASE_REVIEW_FOC_ERROR);
                } else {
                    self.phase(ORDERFACTORY_PHASE_REVIEW_HOLD);
                }

                self.reviewNotifications([]);

                if (data.hasOwnProperty('Notifications') && data.Notifications != null) {
                    let result = data.Notifications.json;

                    ko.utils.arrayForEach(result.Notifications, function (n) {
                        self.reviewNotifications.push(tradeAccountOrderNotification({ record: n, result: result, parent: self }));
                    });

                    for (var i = 0; i < self.reviewNotifications().length; i++) {
                        if (i < self.reviewNotifications().length)
                            self.reviewNotifications()[i].nextNotice = self.reviewNotifications()[i + 1];
                    }

                    if (self.reviewNotifications().length) {
                        self.reviewNotifications()[0].show();
                    }
                }
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        })
    };

    self.saveBasketReview = function (onComplete) {
        // no validation to perform...? what about held order reason code being valid...
        if (!self.heldForSalesRecord.isValid()) {
            self.heldForSalesRecord.isValid.notifySubscribers(self.heldForSalesRecord.isValid());
        } else {
            self.busy(true);
            self.busyMessage('Saving Basket Review...');
            var data = {
                basketId: self.basketId(),
                discountApprovedByManagerMemberId: self.basketReviewManager() ? self.basketReviewManager() : null,
                discountManagerMessage: self.basketReviewManagerMessage.observable(),
                duplicateLineAcknowledgement: self.basketReviewStageTwoDuplicatesConfirmed(),
                heldForSalesReasonCode: self.heldForSalesRecord(),
                heldForSalesAdditionalInformation: self.heldForSalesAdditionalInformation.observable()
            }
            console.log('orderFactory calling saveBasketReview with', data);
            $.ajax({
                url: '/api/componentapi/SaveBasketReview',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('orderFactory saveBasketReview returned', data);
                    self.busy(false);
                    if (typeof onComplete === 'function')
                        onComplete();
                }
            });
        }
    };

    self.fetchBasketParameters = function (data) {
        self.validateBasketDetailsNow(false);

        var data = {
            basketId: self.basketId()
        }

        console.log('orderFactory calling fetchBasketParameters with', data);

        self.busy(true);

        $.ajax({
            url: '/api/componentapi/fetchBasketParameters',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('orderFactory fetchBasketParameters returned', data);
                self.patternBookSchemes(data.PatternBookSchemes);
                self.usSalesTaxExemptionCertificateRequired(data.BasketDetails.USTaxExemptionCertificateRequired);
                self.purchaseOrderNumberRequired(data.BasketDetails.PurchaseOrderNumberRequired);
                self.allowEUExitCode(data.BasketDetails.AllowEUExitCode);
                self.euExitingConfirmed(data.BasketDetails.EUExitingConfirmed);
                self.vatNumber(data.BasketDetails.VATNumber);
                self.vatCountryCode(data.BasketDetails.VATCountryCode);
                self.busy(false);
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    };

    // will be filled by call to closeOrderModal; needs to vary based on where you are in case you haven't saved dispatch options yet.
    self.saveAndCloseFunction = undefined;

    self.closeOrderModal = function () {

        self.savedBasketReasonValidateNow(false);
        // interrogate for save reason, save that reason, then perform necessary following actions.

        if (self.phase() == ORDERFACTORY_PHASE_DISPATCH) {
            self.saveAndCloseFunction = function (onComplete) {
                self.dispatchFactory.saveDeliveryOptions(function () {
                    self.basketLocker.unlockBasket(onComplete);
                });
            }
        } else {
            self.saveAndCloseFunction = function (onComplete) {
                self.basketLocker.unlockBasket(onComplete);
            }
        }

        ; self.showSavedBasketReasonModal();
    };

    self.showSavedBasketReasonModal = function () {
        $('#saved-basket-reason-modal').modal('show');
    };

    self.hideSavedBasketReasonModal = function () {
        self.savedBasketReason.clearError();
        $('#saved-basket-reason-modal').modal('hide');
    };

    self.saveAndCloseBasket = function () {
        self.savedBasketReasonValidateNow(true);
        if (self.savedBasketReason.isValid()) {
            var data = {
                basketId: self.basketId(),
                savedBasketReasonId: self.savedBasketReason()
            }
            console.log('orderFactory saveAndCloseBasket calling with', data);
            self.busy(true);
            self.busyMessage('Saving...');
            $.ajax({
                url: '/api/componentapi/saveBasketReason',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    self.hideSavedBasketReasonModal();
                    if (typeof self.saveAndCloseFunction === 'function') {
                        self.saveAndCloseFunction(function () {
                            self.parent.tradeAccountSelector.clearSearch();
                            self.parent.memberBasketFetcher.resultGridWidget().dataSource.read();
                            self.parent.memberBasketFetcher.importResultGridWidget().dataSource.read();
                            $('#order-products-modal').modal('hide');
                        });
                    }
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    $.ajaxSettings.error(xhr, s, a);
                }
            });
        } else {
            self.savedBasketReason.isValid.notifySubscribers(self.savedBasketReason.isValid());
        }
    };

    self.saveAndRelinquishBasket = function () {
        self.saveAndCloseFunction = function (onComplete) {
            self.basketLocker.unlockAndRelinquishBasket(onComplete);
        }
        self.hideSavedBasketReasonModal();
        if (typeof self.saveAndCloseFunction === 'function') {
            self.saveAndCloseFunction(function () {
                self.parent.tradeAccountSelector.clearSearch();
                self.parent.memberBasketFetcher.resultGridWidget().dataSource.read();
                self.parent.memberBasketFetcher.importResultGridWidget().dataSource.read();
                $('#order-products-modal').modal('hide');
            });
        }
    };

    self.fetchBasketComments = function () {

        return new Promise(function (resolve, reject) {

            self.busy(true);

            var data = {
                basketId: self.basketId()
            };

            console.log('orderProductsDrilldown fetchBasketComments calling with', data);

            $.ajax({
                url: '/api/componentapi/fetchBasketComments',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('orderFactory fetchBasketComments returned', data);

                    self.documentTypes(data.DocumentTypes);

                    ko.utils.arrayForEach(self.orders(), function (order) {

                        var theseComments = Enumerable.From(data.Comments).Where(function (x) {
                            return x.BasketSplitID == order.BasketSplitID;
                        }).ToArray();

                        if (theseComments.length == 0) {
                            self.addBasketComment(order);
                        } else {
                            theseComments.forEach(function (item) {

                                var selectedClause = ko.observable();
                                var selectedClauseId = ko.observable();
                                var widget = ko.observable();
                                var observable = ko.observable(item.Comment);

                                var comment = {
                                    label: 'Comment',
                                    basketCommentId: item.BasketCommentID,
                                    basketSplitId: item.BasketSplitID,
                                    basketCommentTypeId: item.BasketCommentTypeID,
                                    observable: observable,
                                    useNativeValidation: false,
                                    decorateInputElement: false,
                                    insertValidationMessages: false,
                                    showClear: !item.ReadOnly,
                                    readOnly: item.ReadOnly,
                                    clearFunction: function () {
                                        var self = this;
                                        self.observable(undefined);
                                        $(self.observable.DOMElement).focus();
                                    },
                                    rows: 6,
                                    selectedDocumentTypes: ko.observableArray(Enumerable.From(data.DocumentTypeCodes).Where(function (x) {
                                        return x.BasketCommentID == item.BasketCommentID &&
                                            x.BasketSplitID == item.BasketSplitID &&
                                            x.BasketCommentTypeID == item.BasketCommentTypeID
                                    }).Select(function (x) {
                                        return x.DocumentTypeCode
                                    }).ToArray()),
                                    selectedClause: selectedClause,
                                    selectedClauseId: selectedClauseId,
                                }

                                comment.availableClausesDropDownList = {
                                    observable: selectedClause,
                                    showClear: true,
                                    width: '100%',
                                    label: 'Comments',
                                    valuePrimitive: false,
                                    useNativeValidation: false,
                                    decorateInputElement: false,
                                    insertValidationMessages: false,
                                    controlClass: 'form-control',
                                    dropDownListSettings: {
                                        value: selectedClauseId,
                                        dataItem: selectedClause,
                                        dataValueField: 'ClauseID',
                                        dataTextField: 'Name',
                                        widget: widget,
                                        height: 300,
                                        open: function (e) {
                                            $(e.sender._widgetOptions.dataItem.mdcSelect.root_).toggleClass('mdc-select--focused');
                                        },
                                        close: function (e) {
                                            $(e.sender._widgetOptions.dataItem.mdcSelect.root_).toggleClass('mdc-select--focused');
                                        },
                                        change: function (e) {
                                            if (e.sender.value()) {
                                                observable(e.sender.dataItem().Clause);
                                            } else {
                                                observable(undefined);
                                            }
                                        },
                                        data: self.availableClauses,
                                        valuePrimitive: false,
                                        autoWidth: false,
                                        autoBind: true,
                                        optionLabel: ' ',
                                        filter: 'startswith'
                                    },
                                    clearFunction: function () {
                                        var self = this;
                                        observable(undefined);
                                        self.observable(undefined);
                                        self.dropDownListSettings.widget().value('');
                                        self.dropDownListSettings.widget()._widgetOptions.dataItem.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                                        self.dropDownListSettings.widget()._widgetOptions.dataItem.mdcSelect.label_.float(false);
                                    }
                                }
                                comment.observable.extend({
                                    required: {
                                        params: true,
                                        onlyIf: function () {
                                            return comment.selectedDocumentTypes().length
                                        },
                                        message: 'This comment is empty.'
                                    }
                                })
                                comment.selectedDocumentTypes.extend({
                                    required: {
                                        params: true,
                                        onlyIf: function () {
                                            return comment.observable()
                                        },
                                        message: 'Please select at least one document type'
                                    }
                                })
                                comment.selectedDocumentTypes.subscribe(function (changes) {
                                    if (changes[0].status == 'added') {
                                        if (changes[0].value == 'A') {
                                            comment.selectedDocumentTypes(['A']);
                                        } else {
                                            if (comment.selectedDocumentTypes().indexOf('A') > -1) {
                                                comment.selectedDocumentTypes.remove('A');
                                            }
                                        }
                                    }
                                }, comment, 'arrayChange');

                                order.comments.push(comment);

                            });
                        }

                    });

                    self.busy(false);

                    resolve();
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    self.busyMessage(undefined);
                    reject(new Error(xhr.responseText));
                    $.ajaxSettings.error(xhr, s, a);
                }
            });
        });
    };

    self.allComments = ko.pureComputed(function () {
        var results = [];
        if (self.orders()) {
            ko.utils.arrayForEach(self.orders(), function (x) {
                ko.utils.arrayForEach(x.comments(), function (y) {
                    results.push(y);
                });
            });
        }
        return results;
    }, self);

    self.saveBasketComments = function (onComplete, onError) {

        self.basketCommentErrors.showAllMessages(false);

        if (self.basketCommentErrors().length) {
            self.basketCommentErrors.showAllMessages(true);
            if (typeof onError === 'function')
                onError();
            return;
        } else {

            self.busy(true);

            var comments = [];

            if (self.allComments().length) {

                var nextBasketCommentId = Enumerable.From(self.allComments()).Select(function (x) {
                    return x.basketCommentId || 0
                }).Max() || 1;
            }

            self.allComments().forEach(function (item) {
                // we want to ignore empty comments with no document types selected
                if (item.readOnly == false) {
                    if (item.observable() != null && item.observable() !== '' && item.selectedDocumentTypes().length > 0) {
                        if (item.basketCommentId == null) {
                            item.basketCommentId = ++nextBasketCommentId;
                        }
                        comments.push({
                            basketSplitId: item.basketSplitId,
                            basketCommentTypeId: item.basketCommentTypeId,
                            basketCommentId: item.basketCommentId,
                            comment: item.observable(),
                            selectedDocumentTypes: item.selectedDocumentTypes()
                        })
                    }
                }
            });

            var data = {
                basketId: self.basketId(),
                comments: comments
            };

            console.log('orderFactory saveBasketComments calling with', data);

            $.ajax({
                url: '/api/componentapi/saveBasketComments',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (result) {
                    if (result == -1 && data.comments.length) {
                        if (typeof onError === 'function')
                            onError();
                    } else {
                        if (typeof onComplete === 'function')
                            onComplete();
                    }
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    $.ajaxSettings.error(xhr, s, a);
                    if (typeof onError === 'function')
                        onError();
                }
            });
        }
    };

    self.addBasketComment = function (order) {
        if (Enumerable.From(order.comments()).Where(function (x) {
            return x.readOnly == false
        }).Count() >= 99) {
            $.info('Sorry', 'You are only allowed a maximum of 99 comments per orer.');
        } else {
            var selectedClause = ko.observable();
            var selectedClauseId = ko.observable();
            var widget = ko.observable();
            var observable = ko.observable();

            var comment = {
                label: 'Comment',
                basketCommentId: null,
                basketCommentTypeId: 1, // this is the "operator" or "manual" basketCommentTypeId
                basketSplitId: order.BasketSplitID,
                observable: observable,
                useNativeValidation: false,
                decorateInputElement: false,
                insertValidationMessages: false,
                showClear: true,
                clearFunction: function () {
                    var self = this;
                    self.observable(undefined);
                    $(self.observable.DOMElement).focus();
                },
                readOnly: false,
                rows: 6,
                charsRemainingOptions: {
                    maxLength: 1000
                },
                selectedDocumentTypes: ko.observableArray([]),
                selectedClause: selectedClause,
                selectedClauseId: selectedClauseId
            };

            comment.availableClausesDropDownList = {
                observable: selectedClause,
                showClear: true,
                width: '100%',
                label: 'Comments',
                valuePrimitive: false,
                useNativeValidation: false,
                decorateInputElement: false,
                insertValidationMessages: false,
                controlClass: 'form-control',
                dropDownListSettings: {
                    value: selectedClauseId,
                    dataItem: selectedClause,
                    dataValueField: 'ClauseID',
                    dataTextField: 'Name',
                    widget: widget,
                    height: 300,
                    open: function (e) {
                        $(e.sender._widgetOptions.dataItem.mdcSelect.root_).toggleClass('mdc-select--focused');
                    },
                    close: function (e) {
                        $(e.sender._widgetOptions.dataItem.mdcSelect.root_).toggleClass('mdc-select--focused');
                    },
                    change: function (e) {
                        if (e.sender.value()) {
                            observable(e.sender.dataItem().Clause);
                        } else {
                            observable(undefined);
                        }
                    },
                    data: self.availableClauses,
                    valuePrimitive: false,
                    autoWidth: false,
                    autoBind: true,
                    optionLabel: ' ',
                    filter: 'startswith'
                },
                clearFunction: function () {
                    var self = this;
                    observable(undefined);
                    self.observable(undefined);
                    self.dropDownListSettings.widget().value('');
                    self.dropDownListSettings.widget()._widgetOptions.dataItem.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                    self.dropDownListSettings.widget()._widgetOptions.dataItem.mdcSelect.label_.float(false);
                }
            }

            comment.observable.extend({
                required: {
                    params: true,
                    onlyIf: function () {
                        return comment.selectedDocumentTypes().length
                    },
                    message: 'This memo is empty.'
                }
            });

            comment.selectedDocumentTypes.extend({
                required: {
                    params: true,
                    onlyIf: function () {
                        return comment.observable()
                    },
                    message: 'Please select at least one document type'
                }
            });

            comment.selectedDocumentTypes.subscribe(function (changes) {

                if (changes[0].status == 'added') {
                    if (changes[0].value == 'A') {
                        comment.selectedDocumentTypes(['A']);
                    } else {
                        if (comment.selectedDocumentTypes().indexOf('A') > -1) {
                            comment.selectedDocumentTypes.remove('A');
                        }
                    }
                }
            }, comment, 'arrayChange');

            order.comments.push(comment);
        }
    };

    self.basketCommentsValidation = function () {
        self.basketCommentErrors.showAllMessages(false);
        if (self.basketCommentErrors().length > 0) {
            self.basketCommentErrors.showAllMessages(true);
            return false;
        } else {
            return true;
        }
    };

    self.fetchBasketNotes = function (onComplete) {

        return new Promise(function (resolve, reject) {

            var data = {
                basketId: self.basketId()
            };

            console.log('orderProductsDrilldown fetchBasketNotes calling with', data);

            $.ajax({
                url: '/api/componentapi/fetchBasketNotes',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('orderFactory fetchBasketNotes returned', data);

                    ko.utils.arrayForEach(self.orders(), function (order) {

                        var theseNotes = Enumerable.From(data.Notes).Where(function (x) {
                            return x.BasketSplitID == order.BasketSplitID;
                        }).ToArray();

                        if (theseNotes.length == 0) {
                            self.addBasketNote(order);
                        } else {
                            theseNotes.forEach(function (item) {
                                var note = {
                                    label: 'Order Note',
                                    basketSplitId: order.BasketSplitID,
                                    basketNoteTypeId: item.BasketNoteTypeID,
                                    basketNoteId: item.BasketNoteID,
                                    observable: ko.observable(item.Note),
                                    useNativeValidation: false,
                                    decorateInputElement: false,
                                    insertValidationMessages: false,
                                    showClear: true,
                                    readOnly: item.ReadOnly,
                                    rows: 6,
                                    clearFunction: function () {
                                        var self = this;
                                        self.observable(undefined);
                                        $(self.observable.DOMElement).focus();
                                    },
                                    charsRemainingOptions: {
                                        maxLength: 1000
                                    },
                                }
                                order.notes.push(note);
                            });
                        }

                    });

                    resolve();
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    self.busyMessage(undefined);
                    $.ajaxSettings.error(xhr, s, a);
                    reject(new Error(xhr.responseText));
                }
            });
        });
    };

    self.allNotes = ko.pureComputed(function () {
        var results = [];
        if (self.orders()) {
            ko.utils.arrayForEach(self.orders(), function (x) {
                ko.utils.arrayForEach(x.notes(), function (y) {
                    results.push(y);
                });
            });
        }
        return results;
    }, self);

    self.saveBasketNotes = function (onComplete) {

        self.busy(true);

        var notes = [];

        if (self.allNotes().length) {
            var nextBasketNoteId = Enumerable.From(self.allNotes()).Select(function (x) {
                return x.basketNoteId || 0
            }).Max() || 1;
        }

        self.allNotes().forEach(function (item) {
            // we want to ignore empty notes
            if (item.readOnly == false && item.basketNoteTypeId == 1) {
                if (item.observable() != null) {
                    if (item.observable() != '') {
                        if (item.basketNoteId == null) {
                            item.basketNoteId = ++nextBasketNoteId;
                        }
                        notes.push({
                            basketSplitId: item.basketSplitId,
                            basketNoteId: item.basketNoteId,
                            basketNoteTypeId: item.basketNoteTypeId,
                            note: item.observable()
                        })
                    }
                }
            }
        });

        var data = {
            basketId: self.basketId(),
            notes: notes
        };

        console.log('orderFactory saveBasketNotes calling with', data);

        $.ajax({
            url: '/api/componentapi/saveBasketNotes',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (result) {
                self.busy(false);
                if (result == -1 && data.notes.length) {
                    if (typeof onError === 'function')
                        onError();
                } else {
                    if (typeof onComplete === 'function')
                        onComplete();
                }
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.ajaxSettings.error(xhr, s, a);
                if (typeof onError === 'function')
                    onError();
            }
        });
    };

    self.addBasketNote = function (order) {
        if (Enumerable.From(order.notes()).Where(function (x) {
            return x.readOnly == false
        }).Count() >= 99) {
            $.info('Sorry', 'You are only allowed a maximum of 99 notes per orer.');
        } else {
            var note = {
                label: 'Order Note',
                basketNoteId: null,
                basketSplitId: order.BasketSplitID,
                basketNoteTypeId: 1,
                observable: ko.observable(),
                useNativeValidation: false,
                decorateInputElement: false,
                insertValidationMessages: false,
                showClear: true,
                clearFunction: function () {
                    var self = this;
                    self.observable(undefined);
                    $(self.observable.DOMElement).focus();
                },
                readOnly: false,
                rows: 6,
                charsRemainingOptions: {
                    maxLength: 1000
                }
            };
            order.notes.push(note);
        }
    };

    self.quickAddBasketItem = function (searchResult) {

        Promise.allSettled([
            self.addBasketItem(searchResult, ORDERFACTORY_ADD_MODE_STOCK, true, false)
        ])
            .then((results) => results.forEach((result) => {
                if (result.status == 'fulfilled') {
                    var $pop = $(searchResult.quantity.DOMElement).popover({
                        content: function () {
                            return 'Added to Basket'
                        },
                        placement: 'bottom',
                        trigger: 'hover click focus',
                        template: `<div class="popover alert-success" role="tooltip">
                                <div class="arrow"></div>
                                <div class="popover-content"></div>
                            </div>`
                    });
                    //$pop.popover('destroy');
                    $pop.popover('show');
                    window.setTimeout(function () {
                        $pop.popover('destroy');
                    }, 1000);
                }
            }));

        /*

                //    item.bootstrapPopoverDetails = {
                //        title: 'Products Details',
                //        content: function () {
                //            var result = $('<dl class="dl-horizontal"></dl>');
                //            ko.utils.arrayForEach(Object.keys(item), function (property) {
                //                if (item[property] != null) {
                //                    result.add($(`<dt>${property}</dt>`));
                //                    result.add($(`<dd>${item[property]}</dd>`));
                //                }
                //            })
                //            return result;
                //        },
                //        placement: 'right',
                //        trigger: 'hover click focus'
                //    }

         */
    };

    self.reserveBasketItem = function (searchResult) {
        // must prompt for inclusive or exclusive of batch cutting.
        // must remove batch cutting checkbox from allocation screen.
        // must indicate inc/ex. batch cutting on allocation screen.

        if (searchResult.productFilterOptions().AllowBatchCutting) {
            $.confirm('Include Batch Cutting?', 'Does your customer want a batch cutting for this reserve item?',
                function () {
                    self.addBasketItem(searchResult, ORDERFACTORY_ADD_MODE_RESERVE, null, null, null, null, null, true);
                },
                function () {
                    self.addBasketItem(searchResult, ORDERFACTORY_ADD_MODE_RESERVE, null, null, null, null, null, false);
                });
        } else {
            self.addBasketItem(searchResult, ORDERFACTORY_ADD_MODE_RESERVE, null, null, null, null, null, false);
        }
    };

    // mechanism to trap double adds
    self.addingBasketItem = ko.observable(false);

    self.addBasketItem = function (
        searchResult,
        orderTypeId,
        quickAdd,
        fetchBasket,
        onComplete,
        onError,
        basketItemTypeIdOverride,
        withBatchCutting,
        skipDuplicateCheck,
        skipAddingBasketItemCheck,
        defer) {

        if (self.basketId() == null) {
            $.showError('Sorry', 'You cannot add a basket item without a basketId', '');
            self.addingBasketItem(false);
            return;
        }

        skipAddingBasketItemCheck = typeof skipAddingBasketItemCheck === 'undefined' ? false : skipAddingBasketItemCheck;

        orderTypeId = typeof orderTypeId === 'number' ? orderTypeId : ORDERFACTORY_ADD_MODE_STOCK;

        quickAdd = typeof quickAdd === 'undefined' ? false : quickAdd;

        fetchBasket = typeof fetchBasket === 'undefined' ? true : fetchBasket;

        withBatchCutting = typeof withBatchCutting === 'undefined' ? false : withBatchCutting;

        skipDuplicateCheck = typeof skipDuplicateCheck === 'undefined' ? false : skipDuplicateCheck;

        if (searchResult.productFilterOptions().ExcludeFromDuplicateLineCheck) {
            skipDuplicateCheck = true;
            defer = true;
        }

        defer = typeof defer === 'undefined' ? false : defer;

        if (self.addingBasketItem() == false || skipAddingBasketItemCheck) {

            self.addingBasketItem(true);

            searchResult.validateNow(true);

            // if searchResult.record.Status === 'L'
            // && searchResult.stock... 

            if (searchResult.record.Status === 'L') {
                if (searchResult.stockData.StockLocationA.Name != null) {
                    if (searchResult.stockData.StockLocationA.Available == 0 &&
                        searchResult.stockData.StockLocationA.Incoming == 0) {
                        if (!skipAddingBasketItemCheck) {
                            $.error('Sorry', 'You cannot add a Limited product with no stock to your basket.');
                            self.addingBasketItem(false);
                            if (typeof onError === 'function')
                                onError();
                            return new Promise(function (resolve, reject) {
                                reject('limited no stock');
                            });
                        } else {
                            if (typeof onError === 'function')
                                onError('stock');
                            return;
                        }
                    }
                }
                if (searchResult.stockData.StockLocationB.Name != null) {

                }
            }


            if (searchResult.errors().length > 0) {
                searchResult.errors.showAllMessages(true);
                self.addingBasketItem(false);
                return;
            }

            if (self.tradeAccount().PurchaseOrderLineNumberRequired && searchResult.purchaseOrderLineNumber.observable() == null) {
                //If your trade account demands purchase order line numbers, we've got to for one now.

                searchResult.addBasketPromise = function () {
                    self.addingBasketItem(false);
                    return new Promise(function (resolve, reject) {
                        self.addBasketItem(searchResult,
                            orderTypeId,
                            quickAdd,
                            fetchBasket,
                            onComplete,
                            onError,
                            basketItemTypeIdOverride,
                            withBatchCutting,
                            skipDuplicateCheck,
                            skipAddingBasketItemCheck,
                            defer);
                        resolve();
                    });
                }

                self.searchResultRequestingPOLineNumber(searchResult);

                self.searchResultRequestingPOLineNumber().requestPOLineNumber();

                return;
            }

            var addFunction = function () {
                return new Promise(function (resolve, reject) {

                    self.parent.orderProductsDrilldown.busy(true);

                    var forwardOrderDate = null;

                    if (searchResult.dateRequired.observable())
                        forwardOrderDate = moment(searchResult.dateRequired.observable()).toISOString();

                    var data = {
                        tradeAccountId: self.tradeAccount().TradeAccountID,
                        basketId: self.basketId(),
                        basketItemTypeId: basketItemTypeIdOverride || searchResult.basketItemTypeId,
                        productId: searchResult.record.ProductID,
                        quantity: searchResult.quantity(),
                        stockLocationId: searchResult.fulfilmentOption().StockLocationID,
                        fulfilmentTypeId: searchResult.fulfilmentOption().FulfilmentTypeID,
                        lineReference: searchResult.lineReference.observable(),
                        forwardOrderDate: forwardOrderDate,
                        orderTypeId: orderTypeId,
                        withBatchCutting: withBatchCutting,
                        purchaseOrderLineNumber: searchResult.purchaseOrderLineNumber.observable()
                    };



                    if (searchResult.selectedSupplier()) {
                        $.extend(data, { supplierAccountCode: searchResult.selectedSupplier().code });
                        $.extend(data, searchResult.selectedSupplier().address.toSupplierAddressJS());
                    }

                    console.log('orderFactory addBasketItem calling with', data);

                    $.ajax({
                        url: '/api/componentapi/AddBasketItem',
                        type: 'POST',
                        dataType: 'json',
                        data: data,
                        success: function (data) {

                            self.parent.orderProductsDrilldown.resetProcessingModal();
                            self.parent.orderProductsDrilldownFurnitureComponents.resetProcessingModal();

                            console.log('orderFactory addBasketItem returned', data);

                            if (data.addResult.BasketItemID != null) {

                                var sr = $.extend({}, searchResult);

                                sr.basketItemId = data.addResult.BasketItemID;
                                sr.basketItemTypeId = basketItemTypeIdOverride || sr.basketItemTypeId;
                                sr.orderTypeId = orderTypeId;
                                sr.backOrder(data.addResult.BackOrder);

                                if (!quickAdd) {
                                    self.configureDataStages(data, sr);

                                    self.parent.orderProductsDrilldown.stageInformation().stages(data.stages);

                                    var firstStage = Enumerable.From(data.stages).MinBy(function (x) {
                                        return x.StepID
                                    });

                                    self.parent.orderProductsDrilldown.stageInformation().currentStage(firstStage);

                                    self.bespokeFabricShowlengthFactory.reset();
                                    self.bespokeWallpaperShowlengthFactory.reset();
                                    self.bespokeRugFactory.reset();
                                    self.bespokeArchitectRingFactory.reset();
                                    self.bespokeFurnitureFactory.reset();

                                    self.parent.orderProductsDrilldown.addingProductToBasket(sr);

                                    //switch (stepId) {
                                    //    case PRODUCT_PROGRESSION_STAGE_TREAT:
                                    //        self.parent.orderProductsDrillDown.progressToApplyTreatment(true);
                                    //        break;
                                    //    case PRODUCT_PROGRESSION_STAGE_PRICING:
                                    //        self.parent.orderProductsDrilldown.progressToReviewPricing();
                                    //        break;
                                    //    case PRODUCT_PROGRESSION_STAGE_MEMOS:
                                    //        self.parent.orderProductsDrilldown.self.progressToMemos();
                                    //        break;
                                    //    default: break;
                                    //}
                                    self.mode(ORDERFACTORY_PHASE_BLANK);
                                    $('#order-processing-modal').modal('show');
                                } else {
                                    if (fetchBasket) {
                                        self.fetchBasket();
                                    }
                                }
                            } else {
                                $.showError(data.addResult, null, null);
                                if (typeof onError === 'function')
                                    onError();
                            }
                            self.parent.orderProductsDrilldown.busy(false);

                            if (typeof onComplete === 'function')
                                onComplete(data.addResult);

                            $('#order-processing-modal').off('shown.bs.modal');
                            $('#order-processing-modal').on('shown.bs.modal', function () {
                                self.addingBasketItem(false);
                            });

                            if (quickAdd)
                                self.addingBasketItem(false);

                            resolve();
                        },
                        error: function (xhr, s, a) {
                            self.parent.orderProductsDrilldown.busy(false);
                            $.ajaxSettings.error(xhr, s, a);
                            if (typeof onError === 'function')
                                onError();
                            self.addingBasketItem(false);
                            reject();
                        }
                    });
                });
            }

            // if your fulfilment type id == 5, we now need to demand supplier data.
            if (searchResult.fulfilmentOption().FulfilmentTypeID == 5) {
                defer = true;
                searchResult.addBasketPromise = addFunction;
                self.searchResultRequestingSupplier(searchResult);
                self.searchResultRequestingSupplier().supplierDetailFetch();
            } else if (searchResult.basketItemTypeId == 6) {
                // you're adding bespoke furniture, you maniac! we want a quantity up front.
                defer = true;
                searchResult.addBasketPromise = addFunction;
                self.searchResultRequestingQuantity(searchResult);
                self.searchResultRequestingQuantity().requestQuantity();
            } else {
                if (skipDuplicateCheck) {
                    if (defer) {
                        return addFunction()
                    } else {
                        Promise.resolve(addFunction())
                    }
                } else {
                    var duplicateCheckPromise =
                        self.duplicateBasketItemCheck(
                            searchResult.record.ProductID,
                            searchResult.record.Code,
                            searchResult.quantity(),
                            searchResult.lineReference.observable(),
                            searchResult.productFilterOptions().QuantityPrecision,
                            searchResult.record.Units
                        );
                    Promise.allSettled([
                        duplicateCheckPromise
                    ]).then((results) => results.forEach((result) => {
                        if (result.status == 'fulfilled') {
                            //if (typeof promise === 'function')
                            Promise.resolve(addFunction())
                            //else
                            //    Promise.resolve(promise);
                        }
                    }));

                    return duplicateCheckPromise;
                }
            }
            if (defer) {
                return addFunction
            } else {
                return addFunction();
            }
        } else {
            console.warn('orderFactory addBasketItem was skipped - addingBasketItem() == true');
            return;
        }
    };

    self.duplicateBasketItemCheck = function (productId, productCode, quantity, lineRef, qp, units) {
        return new Promise(function (resolve, reject) {
            var data = {
                basketId: self.basketId(),
                tradeAccountCode: self.tradeAccount().Code,
                lineReference: lineRef,
                productId: productId,
                productCode: productCode,
                quantity: quantity
            };
            console.log('orderFactory duplicateBasketItemCheck calling with', data);
            $.ajax({
                url: '/api/componentapi/LineDuplicateCheck',
                type: 'POST',
                dataType: 'json',
                data: data,
                async: false
            }).done(function (result) {
                if (result.isDuplicate) {
                    var confirmText = '';

                    if (result.orderNumbers.length) {
                        confirmText = `<p>This may be a duplicate: ${productCode} &times; ${(+quantity).toFixed(qp)} ${units} has been previously ordered by the same customer within the past three months.</p><p>Please check order number(s):</p><label class='bold display-block margin-bottom-10'>${result.orderNumbers.join("</label><label class='bold display-block margin-bottom-10'>")}</label>`
                    }

                    if (result.isCurrentBasketDuplicate) {
                        confirmText = `${confirmText}<p class="bold">${productCode} &times; ${(+quantity).toFixed(qp)} ${units} is already in your current basket.</p>`
                    }

                    confirmText = `${confirmText}<p>Would you still like to add this item to your basket?</p>`;

                    $.redConfirm('Potential Duplicate Identified',
                        confirmText,
                        function () {
                            resolve();
                        }, function () {
                            reject();
                            self.addingBasketItem(false);
                        });

                } else {
                    resolve();
                }
            }).fail(function (xhr, s, a) {
                $.showError(xhr, s, a);
                reject();
            });
        });
    };

    // powerful naming convention #35: if something is configuring some other things,
    // be as vague as possible about what the other things are, and what the parameters are.
    self.configureDataStages = function (data, sr, alt) {
        // alt: use alternative orderProcessing instance; Bespoke Furniture Factory has sub-stages inside of Material Allocation...
        alt = typeof alt === 'undefined' ? false : true;
        if (alt) {
            self.parent.currentlyActiveDrilldown(self.parent.orderProductsDrilldownFurnitureComponents);
        } else {
            self.parent.currentlyActiveDrilldown(self.parent.orderProductsDrilldown);
        }
        data.stages.forEach(function (item) {
            switch (item.StepID) {
                case ADVANCED_STAGE_BESPOKE_FABRIC_HANGER:
                    item.loadingMethod = function () {
                        self.bespokeFabricShowlengthFactory.load(sr, null, 'Hanger');
                    };
                    item.savingMethod = self.bespokeFabricShowlengthFactory.save;
                    item.performValidation = function () {
                        return new Promise(function (resolve, reject) {
                            if (self.bespokeFabricShowlengthFactory.validate()) {
                                resolve();
                            } else {
                                reject();
                            }
                        });
                    }
                    break;
                case ADVANCED_STAGE_BESPOKE_FABRIC_SHOWLENGTH:
                    item.loadingMethod = function () {
                        self.bespokeFabricShowlengthFactory.load(sr, null, 'Showlength');
                    };
                    item.savingMethod = self.bespokeFabricShowlengthFactory.save;
                    item.performValidation = function () {
                        return new Promise(function (resolve, reject) {
                            if (self.bespokeFabricShowlengthFactory.validate()) {
                                resolve();
                            } else {
                                resolve();
                            }
                        });
                    }
                    break;
                case ADVANCED_STAGE_BESPOKE_FABRIC_SHELFSAMPLE:
                    item.loadingMethod = function () {
                        self.bespokeFabricShowlengthFactory.load(sr, null, 'Shelf Sample');
                    };
                    item.savingMethod = self.bespokeFabricShowlengthFactory.save;
                    item.performValidation = function () {
                        return new Promise(function (resolve, reject) {
                            if (self.bespokeFabricShowlengthFactory.validate()) {
                                resolve();
                            } else {
                                reject();
                            }
                        });
                    }
                    break;
                case ADVANCED_STAGE_BESPOKE_WALLPAPER_SHOWLENGTH:
                    item.loadingMethod = function () {
                        self.bespokeWallpaperShowlengthFactory.load(sr, null);
                    };
                    item.savingMethod = self.bespokeWallpaperShowlengthFactory.save;
                    item.performValidation = function () {
                        return new Promise(function (resolve, reject) {
                            if (self.bespokeWallpaperShowlengthFactory.validate()) {
                                resolve();
                            } else {
                                reject();
                            }
                        });
                    }
                    break;
                case ADVANCED_STAGE_BESPOKE_RUG:
                    item.loadingMethod = function () {
                        self.bespokeRugFactory.load(sr, null);
                    };
                    item.savingMethod = self.bespokeRugFactory.save;
                    item.performValidation = function () {
                        return new Promise(function (resolve, reject) {
                            if (self.bespokeRugFactory.validate()) {
                                resolve();
                            } else {
                                reject();
                            }
                        });
                    }
                    break;
                case ADVANCED_STAGE_BESPOKE_FURNITURE:
                    item.loadingMethod = function () {
                        self.bespokeFurnitureFactory.load(sr, null);
                    };
                    item.savingMethod = self.bespokeFurnitureFactory.save;
                    item.performValidation = function () {
                        return new Promise(function (resolve, reject) {
                            if (self.bespokeFurnitureFactory.validate()) {
                                resolve();
                            } else {
                                reject();
                            }
                        });
                    }
                    break;
                case ADVANCED_STAGE_BESPOKE_FURNITURE_FABRIC:
                    item.loadingMethod = function () {
                        self.bespokeFurnitureFactory.loadFabric(sr, null);
                    };
                    item.savingMethod = self.bespokeFurnitureFactory.save;
                    // this was the only one which needed to return a promise.
                    // this was the cause of me having to go through ALL OF THEM AND TURN THEM INTO PROMISES ARGH
                    item.performValidation = self.bespokeFurnitureFactory.validateFabric;
                    break;
                case ADVANCED_STAGE_BESPOKE_FURNITURE_FABRIC_ALLOCATION:
                    item.loadingMethod = function () {
                        self.bespokeFurnitureFactory.loadAllocationStage(sr, null);
                    };
                    item.savingMethod = self.bespokeFurnitureFactory.proceedToFurniturePricing;
                    // this was the only one which needed to return a promise.
                    // this was the cause of me having to go through ALL OF THEM AND TURN THEM INTO PROMISES ARGH
                    item.performValidation = self.bespokeFurnitureFactory.validateAllocation;
                    break;
                case ADVANCED_STAGE_BESPOKE_ARCHITECT_RING:
                    item.loadingMethod = function () {
                        self.bespokeArchitectRingFactory.load(sr, null);
                    };
                    item.savingMethod = self.bespokeArchitectRingFactory.save;
                    item.performValidation = function () {
                        return new Promise(function (resolve, reject) {
                            if (self.bespokeArchitectRingFactory.validate()) {
                                resolve();
                            } else {
                                reject();
                            }
                        });
                    }
                    break;
                case ADVANCED_STAGE_REVIEW_ALLOCATION:
                    var drillDown = alt ? self.parent.orderProductsDrilldownFurnitureComponents : self.parent.orderProductsDrilldown;

                    item.loadingMethod = drillDown.loadAllocation;
                    item.savingMethod = drillDown.saveAllocation;
                    item.performValidation = function () {
                        return new Promise(function (resolve, reject) {
                            if (drillDown.allocationValidation()) {
                                resolve();
                            } else {
                                reject();
                            }
                        });
                    }
                    break;
                case ADVANCED_STAGE_APPLY_TREATMENT:
                    var drillDown = alt ? self.parent.orderProductsDrilldownFurnitureComponents : self.parent.orderProductsDrilldown;

                    item.loadingMethod = drillDown.loadTreatments;
                    item.savingMethod = drillDown.saveTreatments;
                    item.performValidation = function () {
                        return new Promise(function (resolve, reject) {
                            drillDown.treatmentNoteValidateNow(true);
                            window.setTimeout(function () {
                                drillDown.treatmentValidation().then(function () {
                                    resolve();
                                }, function () {
                                    reject();
                                });
                            }, 0);
                            //if (drillDown.treatmentValidation()) {
                            //    resolve();
                            //} else {
                            //    reject();
                            //}
                        });
                    }
                    break;
                case ADVANCED_STAGE_REVIEW_PRICING:
                    var drillDown = alt ? self.parent.orderProductsDrilldownFurnitureComponents : self.parent.orderProductsDrilldown;

                    item.loadingMethod = drillDown.loadPricing;
                    item.savingMethod = drillDown.savePricing;
                    item.performValidation = function () {
                        return new Promise(function (resolve, reject) {
                            if (drillDown.pricingValidation()) {
                                resolve();
                            } else {
                                reject();
                            }
                        });
                    }
                    break;
                case ADVANCED_STAGE_REVIEW_MEMOS:
                    var drillDown = alt ? self.parent.orderProductsDrilldownFurnitureComponents : self.parent.orderProductsDrilldown;

                    item.loadingMethod = drillDown.loadMemos;
                    item.savingMethod = drillDown.saveMemos;
                    item.performValidation = function () {
                        return new Promise(function (resolve, reject) {
                            if (drillDown.memoValidation()) {
                                resolve();
                            } else {
                                reject();
                            }
                        });
                    }
                    break;
            }

            var prevStages = Enumerable.From(data.stages).Where(function (x) {
                return x.StepID < item.StepID
            }).ToArray();

            var prevStage = null;

            if (prevStages.length) {
                prevStage = Enumerable.From(prevStages).MaxBy(function (x) {
                    return x.StepID
                });
            }

            var nextStages = Enumerable.From(data.stages).Where(function (x) {
                return x.StepID > item.StepID
            }).ToArray();

            var nextStage = null;

            if (nextStages.length) {
                nextStage = Enumerable.From(nextStages).MinBy(function (x) {
                    return x.StepID
                });
            }

            item = $.extend(item, {
                prevStage: prevStage,
                nextStage: nextStage
            });
        });
    }

    self.loadBasketItemForEdit = function (basketItem, bespokeFurnitureFactory) {
        self.busy(true);
        var data = {
            tradeAccountId: self.tradeAccount().TradeAccountID,
            basketItemId: basketItem.BasketItemID,
            basketId: self.basketId()
        };
        console.log('loadBasketItemForEdit calling with', data);
        $.ajax({
            url: '/api/componentapi/fetchBasketItemForEdit',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                if (!bespokeFurnitureFactory) {

                    self.parent.orderProductsDrilldown.resetProcessingModal();
                    self.parent.orderProductsDrilldownFurnitureComponents.resetProcessingModal();

                    self.busy(false);
                    console.log('loadBasketItemForEdit returned', data);
                    var sr = new searchResult(data.searchResults.SearchResult, self, null);
                    sr.basketItemId = basketItem.BasketItemID;
                    sr.record.BasketItemLineMemos = basketItem.BasketItemLineMemos;
                    sr.fulfilmentOption({
                        StockLocationID: data.searchResults.ExtensionFields.StockLocationID,
                        FulfilmentTypeID: data.searchResults.ExtensionFields.FulfilmentTypeID,
                        FulfilmentOptionID: data.searchResults.ExtensionFields.FulfilmentTypeID
                    });
                    sr.record.Currency = self.currency();
                    sr.quantity(data.searchResults.ExtensionFields.Quantity);
                    sr.lineReference.observable(data.searchResults.ExtensionFields.LineReference);
                    sr.dateRequired.observable(data.searchResults.ExtensionFields.ForwardOrderDate);
                    sr.estimatedDispatchDate(moment(data.searchResults.ExtensionFields.ForwardOrderDate));
                    sr.orderTypeId = data.searchResults.ExtensionFields.OrderTypeID;
                    sr.backOrder(data.searchResults.ExtensionFields.BackOrder);
                    sr.record.BespokeFurnitureJSON = data.searchResults.ExtensionFields.BespokeFurnitureJSON;

                    self.configureDataStages(data, sr);

                    self.bespokeFabricShowlengthFactory.reset();
                    self.bespokeWallpaperShowlengthFactory.reset();
                    self.bespokeRugFactory.reset();
                    self.bespokeFurnitureFactory.reset();
                    self.bespokeArchitectRingFactory.reset();

                    self.parent.orderProductsDrilldown.stageInformation().stages(data.stages);

                    var firstStage = Enumerable.From(self.parent.orderProductsDrilldown.stageInformation().stages()).MinBy(function (x) {
                        return x.StepID
                    });

                    self.parent.orderProductsDrilldown.stageInformation().currentStage(firstStage);

                    self.parent.orderProductsDrilldown.addingProductToBasket(sr);

                    self.phase(ORDERFACTORY_PHASE_BLANK);
                    $('#order-processing-modal').modal('show');
                } else {
                    console.log('loadBasketItemForEdit - bespokeFurnitureFactory - returned', data);

                    self.parent.orderProductsDrilldownFurnitureComponents.processingBusy(false);
                    self.parent.orderProductsDrilldownFurnitureComponents.resetProcessingModal();

                    self.busy(false);

                    var sr = new searchResult(data.searchResults.SearchResult, self, null);
                    sr.basketItemId = basketItem.BasketItemID;
                    sr.fulfilmentOption({
                        StockLocationID: data.searchResults.ExtensionFields.StockLocationID,
                        FulfilmentTypeID: data.searchResults.ExtensionFields.FulfilmentTypeID,
                        FulfilmentOptionID: data.searchResults.ExtensionFields.FulfilmentTypeID
                    });
                    sr.record.Currency = self.currency();
                    sr.quantity(data.searchResults.ExtensionFields.Quantity);
                    sr.lineReference.observable(data.searchResults.ExtensionFields.LineReference);
                    sr.dateRequired.observable(data.searchResults.ExtensionFields.ForwardOrderDate);
                    sr.estimatedDispatchDate(moment(data.searchResults.ExtensionFields.ForwardOrderDate));
                    sr.orderTypeId = data.searchResults.ExtensionFields.OrderTypeID;
                    sr.backOrder(data.searchResults.ExtensionFields.BackOrder);

                    self.bespokeFabricShowlengthFactory.reset();
                    self.bespokeWallpaperShowlengthFactory.reset();
                    self.bespokeRugFactory.reset();
                    self.bespokeArchitectRingFactory.reset();

                    self.configureDataStages(data, sr, true);

                    self.parent.orderProductsDrilldownFurnitureComponents.stageInformation().stages(data.stages);

                    var firstStage = Enumerable.From(self.parent.orderProductsDrilldownFurnitureComponents.stageInformation().stages()).MinBy(function (x) {
                        return x.StepID
                    });

                    self.parent.orderProductsDrilldownFurnitureComponents.stageInformation().currentStage(firstStage);

                    self.parent.orderProductsDrilldownFurnitureComponents.allocationStockLocation.skipSubscription(true);

                    self.parent.orderProductsDrilldownFurnitureComponents.addingProductToBasket(sr);

                    self.phase(ORDERFACTORY_PHASE_BLANK);
                }
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    };

    self.productFilterButtonClick = function (data) {
        self.selectedProductType(Enumerable.From(self.completeProductFilterSet()).Where(function (x) {
            return x.ProductFilterID == data.ProductFilterID
        }).Select('$.ProductTypeID').SingleOrDefault());
        self.searchWidget(data);
        self.seasonalProducts(data.Seasonal);
    };

    self.productFilterGroupButtonClick = function (data) {

        // how... should we handle the un-click?
        // now that we're permitting searching by PFG, you'd want to clear
        // when you're collapsing a PFG... not re-select the same thing...

        if (data.ProductFilterGroupID == self.searchWidgetProductFilterGroupId() &&
            data.ProductFilterID != null || (
                data.ProductFilterGroupID == null &&
                data.ProductFilterID == null &&
                data.Seasonal == null &&
                data.Value == null // this dumb null checking is because we introduced an "All Products" button and I'm having to smash around stuff... sorry...
            )) {
            // this is necessarily a de-click. Clear stuff.
            self.skipFirst(true);
            self.searchWidget({
                Value: null,
                ProductFilterID: null,
                ProductFilterGroupID: null,
                Seasonal: null
            });
            //window.setTimeout(function () {
            //    self.busy(false);
            //}, 0);
        } else {
            self.selectedProductType(Enumerable.From(self.completeProductFilterSet()).Where(function (x) {
                return x.ProductFilterGroupID == data.ProductFilterGroupID
            }).Select('$.ProductTypeID').FirstOrDefault());
            self.searchWidget(data);
            self.seasonalProducts(data.Seasonal);
        }
    };

    self.loadSingleProductPage = function (productPageId) {

    };

    //self.deserializeViewSettings = function () {
    //    var params = new URLSearchParams(window.location.search);

    //    /*
    //         * x
    //             * Clearance             [2]
    //             * searchDisplay         [1]
    //             * filterViewMode        [1]
    //             * selectedWidth         [1]
    //             * searchNew             [1]
    //         *
    //         * k
    //             * selectedPattern       [8] (max 12 on display, but a byte for a key)
    //             * selectedStock         [8]
    //             * selectedMartindale    [8]
    //             * selectedSize          [8]
    //         *
    //         * c
    //             * selectedLaunch       [16] (maximum 4 on display any time, but I have to work with IDs)
    //             * selectedItemType     [16] (we have a ridiculous number of potential itemTypes and I must be able to represent any of them)
    //         *
    //         * d
    //             * ProductFilterID       [8]
    //             * selectedColour        [8] (maximum 14 colours)
    //             * selectedBrand         [8] (maximum 6 brands, but... easier to have nice round numbers of bits?)

    //     */

    //    if (params.has('d')) {
    //        var dVal = parseInt(params.get('d'), 16);

    //        console.log('deserialising d: parseInt(d, 16)', dVal);

    //        console.log('deserialising d: binaryString', self.createBinaryString(dVal));

    //        var productFilterId = dVal >>> 0x10; // but what if... we did not pad by 16, given that we | 0 | 0 the end of this. Hmph.

    //                        // left shift first to clear out unused and ProductFilterID
    //                        // then zero-fill right shift by 24 to clear out brandId
    //                        // you should just be left with colourId.
    //        var colourId = (dVal << 0x10) >>> 0x18;

    //                        // same approach, but left shift 24 to clear 3/4 of the 32 bits away,
    //                        // then zero-fill 24 to shift our 8 salient bits to their appropriate position again.
    //        var brandId = (dVal << 0x18) >>> 0x18;

    //        var productFilter = Enumerable.From(self.productFilterButtons()).Where(function (x) {
    //            return x.ProductFilterID == productFilterId;
    //        }).SingleOrDefault();

    //        if (productFilter) {
    //            self.searchWidget(productFilter);
    //            $('#category-accordion a.category-heading[data-product-filter-group-id="' + productFilter.ProductFilterGroupID + '"] + .collapse').collapse('show');
    //        } else {
    //            return;
    //        }

    //        if (colourId != 0)
    //            self.selectedColour(colourId);

    //        if (brandId != 0)
    //            self.selectedBrand(brandId);
    //    }

    //    if (params.has('c')) {
    //        var cVal = parseInt(params.get('c'), 16);

    //        var selectedLaunch = cVal >> 0x10;

    //        if (selectedLaunch != 0)
    //            self.selectedLaunch(selectedLaunch);

    //        var selectedItemType = (cVal << 0x10) >>> 0x10;

    //        if (selectedItemType != 0)
    //            self.selectedItemType(selectedItemType);
    //    }

    //    if (params.has('k')) {
    //        var kVal = parseInt(params.get('k'), 16);

    //        var selectedPattern = kVal >> 0x18;

    //        var selectedStock = (kVal << 0x08) >>> 0x18;

    //        var selectedMartindale = (kVal << 0x10) >>> 0x18;

    //        var selectedSize = (kVal << 0x18) >>> 0x18;

    //        if (selectedPattern != 0)
    //            self.selectedPattern(selectedPattern);

    //        if (selectedStock != 0)
    //            self.selectedStock(selectedStock);

    //        if (selectedMartindale != 0)
    //            self.selectedMartindale(selectedMartindale);

    //        if (selectedSize != 0)
    //            self.selectedSize(selectedSize);
    //    }

    //    if (params.has('x')) {

    //        var xVal = parseInt(params.get('x'), 16);

    //        var clearance = xVal >> 0x05;

    //        var width = (xVal << 0x1b) >>> 0x1f; 

    //        var searchNew = (xVal << 0x1d) >>> 0x1f;

    //        var filterViewMode = (xVal << 0x1e) >>> 0x1f;

    //        var searchDisplay = (xVal << 0x1f) >>> 0x1f;

    //        var clearanceToSet = null;

    //        switch (clearance) {
    //            case 2:
    //                // noop
    //                break;
    //            case 1:
    //            case 0:
    //                clearanceToSet = clearance;
    //                break;
    //            default:
    //                break;
    //        }

    //        var widthToSet = undefined;

    //        switch (width) {
    //            case 0:
    //                break;
    //            case 1:
    //                widthToSet = 0;
    //                break;
    //            case 2:
    //                widthToSet = 1;
    //                break;
    //            default: break;
    //        }

    //        self.clearance(clearanceToSet);

    //        self.searchNew(searchNew);

    //        self.selectedWidth(widthToSet);

    //        self.filterViewMode(filterViewMode);

    //        self.searchDisplay(searchDisplay);
    //    }

    //    self.show();
    //}

    self.fetchBasket = function (complete, setMessage, recalculatePrices) {
        setMessage = typeof setMessage === 'undefined' ? true : setMessage;
        recalculatePrices = typeof recalculatePrices === 'undefined' ? true : recalculatePrices;
        if (setMessage)
            self.busyMessage('Loading Basket');
        self.busy(true);

        var data = {
            basketId: self.basketId(),
            recalculatePrices: recalculatePrices
        }

        console.log('orderFactory fetchBasket calling with', data);

        $.ajax({
            url: '/api/componentapi/FetchBasket',
            type: 'POST',
            dataType: 'json',
            responseType: 'text',
            data: data,
            success: function (data) {
                console.log('orderFactory fetchBasket returned', data);

                if (data.PopupNotices.length > 0) {
                    var noticeMarkup = $.map(data.PopupNotices, function (notice) {
                        return '<tr>\
<td>' + (notice.ImageID != null ? '<img class="thumb" src="https://www.designersguild.com/image/156/' + notice.ImageID + '" title=' + notice.Code + '/>' : notice.Code) + '\
</td>\
<td class="text-right">' + notice.Quantity + '\
</td>\
<td>' + notice.OperatorMessage + '\
</td>\
</tr>'}).join('\n');

                    $.info('Notice', '<div class="alert alert-warning">The following products have been automatically added to your basket:</div>\
<table class="table table-condensed table-borderd">\
<thead>\
<tr>\
<th>\
    Product\
</th>\
<th>\
    Quantity\
</th>\
<th>\
    Note\
</th>\
</tr>\
</thead>\
<tbody>' + noticeMarkup + '</tbody></table>');
                }

                self.processBasketItems(data.BasketItems);

                //ko.utils.arrayForEach(data.BasketItems, function (item) {
                //    item.processAnswers = JSON.parse(item.ProcessAnswersJSON);
                //    item.bootstrapPopoverDetails = {
                //        title: 'Products Details',
                //        content: function () {
                //            var result = $('<dl class="dl-horizontal"></dl>');
                //            ko.utils.arrayForEach(Object.keys(item), function (property) {
                //                if (item[property] != null) {
                //                    result.add($(`<dt>${property}</dt>`));
                //                    result.add($(`<dd>${item[property]}</dd>`));
                //                }
                //            })
                //            return result;
                //        },
                //        placement: 'right',
                //        trigger: 'hover click focus'
                //    }

                //    if (item.processAnswers) {
                //        if (item.processAnswers.waterfallProducts) {
                //            item.bespokeWaterfallBootstrapPopover = {
                //                title: 'Waterfall Products',
                //                content: Enumerable.From(item.processAnswers.waterfallProducts).Select(function (x) {
                //                    return `<div class="bespoke-waterfall-tooltip-item" title="${x.label}">
                //                                <img class="thumb" src="https://www.designersguild.com/image/90/${x.value.ImageID}", title: "${x.value.Code}" }\">
                //                                <span>
                //                                    ${x.label}
                //                                </span>
                //                            </div>`;
                //                }).ToArray().join(""),
                //                placement: 'right',
                //                trigger: 'hover click focus'
                //            }
                //        }
                //    }
                //    item.HasChildren = false; // this is determined by the various basket grouping computeds
                //});

                //self.basket(data.BasketItems);

                if (typeof complete === 'function') {
                    complete();
                } else {
                    self.busy(false);
                    self.busyMessage(undefined);
                }
            },
            error: function (xhr, s, a) {
                self.busy(false);
                self.busyMessage(undefined);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    };

    self.fetchFulfilmentOptions = function (complete) {
        if (self.tradeAccount()) {
            var data = {
                basketId: self.basketId(),
                tradeAccountId: self.tradeAccount().TradeAccountID
            };

            console.log('orderFactory fetchFulfilmentOptions calling with', data);

            $.ajax({
                url: '/api/componentapi/fetchFulfilmentOptions',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    //self.busy(false);
                    console.log('orderFactory fetchFulfilmentOptions returned', data);
                    self.allFulfilmentOptions(data);
                    if (typeof complete === 'function') {
                        complete();
                    }
                }
            });
        }
    };

    self.loadBasket = function (basket, onComplete) {

        console.log('loadBasket', basket);

        self.show(basket, null, onComplete);
    };

    self.loadBasketForRetailPayment = function (basket, onComplete) {
        console.log('loadBasketForRetailPayment', basket);

        self.show(basket, null, function () {
            onComplete();
            self.dispatchFactory.fetchDispatchInfo(null, function () {
                self.fetchRetailTills(function () {
                    self.phase(ORDERFACTORY_PHASE_RETAIL);
                });
            });
        }, true);
    }

    //self.loadBasketForReceipt = function (basket, onComplete) {
    //    console.log('loadBasketForReceipt', basket);
    //    self.basketForReceipt(basket);
    //    $('#submitted-basket-modal').modal('show');
    //    if (typeof onComplete === 'function')
    //        onComplete();
    //}

    self.validateBasketReceiptEmailNow = ko.observable(false);

    self.basketReceiptEmail = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateBasketReceiptEmailNow();
            },
            message: 'Recipient Email Required'
        },
        email: {
            params: true,
            onlyIf: function () {
                return self.validateBasketReceiptEmailNow();
            },
            message: 'Invalid Email'
        }
    });

    self.basketReceiptSentTo = ko.observable();

    self.showBasketReceiptLastSentTo = ko.observable(false);

    self.basketReceiptEmailParams = {
        label: 'Send Receipt to Email',
        originalValue: self.basketReceiptSentTo,
        observable: self.basketReceiptEmail,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: true,
        revertFunction: function () {
            self.basketReceiptEmail(self.basketReceiptSentTo());
            $(self.basketReceiptEmail.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 254
        }
    }

    //self.closeBasketReceiptModal = function () {
    //    self.showBasketReceiptLastSentTo(false);
    //    self.basketReceiptSentTo(undefined);
    //    self.validateBasketReceiptEmailNow(false);
    //    self.basketReceiptEmail(undefined);
    //    //self.basketForReceipt(undefined);
    //    $('#submitted-basket-modal').modal('hide');
    //}

    //self.fetchBasketReceipt = function (view) {
    //    var basketId = self.basketForReceipt().BasketID;
    //    var data = {
    //        basketId: basketId
    //    };
    //    let url = '/api/orderproducts/fetchBasketReceipt';
    //    if (window.fetch) {
    //        fetch(url, {
    //            method: 'POST',
    //            body: JSON.stringify(data),
    //            headers: {
    //                'Content-Type': 'application/json',
    //                'Authorization': 'Bearer ' + localStorage.BearerToken
    //            }
    //        }).then(function (response) {
    //            return response.blob();
    //        }).then(function (blob) {
    //            if (!view) {
    //                var link = document.createElement('a');
    //                link.href = window.URL.createObjectURL(blob);
    //                link.download = 'Designers-Guild-Basket-Receipt-' + basketId  + '.pdf';
    //                link.click();
    //            } else {
    //                const newWindow = window.open('', 'Print')
    //                newWindow.document.title = 'Designers-Guild-Basket-Receipt-' + basketId + '.pdf'
    //                newWindow.document.write('<html><head><title>Designers-Guild-Basket-Receipt-' + basketId + '.pdf</title><link rel="shortcut icon" type="image/x-icon" href="https://www.designersguild.com/favicon.ico" /></head><body style="margin: 0">')
    //                newWindow.document.write(`<iframe src="${window.URL.createObjectURL(blob)}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
    //                newWindow.document.write('</body></html');
    //            }
    //        });
    //    } else {
    //        var xhr = new XMLHttpRequest();
    //        xhr.open("POST", url, true);
    //        xhr.setRequestHeader('Content-Type', 'application/json');
    //        //Now set response type
    //        xhr.responseType = 'arraybuffer';
    //        xhr.addEventListener('load', function () {
    //            if (xhr.status === 200) {
    //                //console.log(xhr.response) // ArrayBuffer
    //                var blob = new Blob([xhr.response]); // Blob
    //                var link = document.createElement('a');
    //                link.href = window.URL.createObjectURL(blob);
    //                link.target = '_blank';
    //                //link.download = 'Designers-Guild-Basket-Receipt-' + basketId + '.pdf';
    //                link.click();
    //            } else {
    //                console.error(xhr.response);
    //            }
    //        })
    //        xhr.send(data);
    //    }
    //}

    self.deleteBasket = function (BasketID, confirm, onComplete) {
        if (confirm) {
            $.confirm('Are you sure?', 'This basket will be deleted and any allocations removed.', function () {
                var data = {
                    basketId: BasketID || self.basketId()
                }
                console.log('orderFactory deleteBasket calling with', data);
                self.busy(true);
                self.busyMessage('Please wait, deleting basket...');
                $.ajax({
                    url: '/api/componentapi/DeleteBasket',
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    success: function (data) {
                        console.log('orderFactory deleteBasket returned', data);
                        self.parent.memberBasketFetcher.resultGridWidget().dataSource.read();
                        self.parent.memberBasketFetcher.importResultGridWidget().dataSource.read();
                        if (typeof onComplete === 'function')
                            onComplete();
                    }
                });
            }, null);
        } else {
            var data = {
                basketId: BasketID || self.basketId()
            }
            console.log('orderFactory deleteBasket calling with', data);
            $.ajax({
                url: '/api/componentapi/DeleteBasket',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('orderFactory deleteBasket returned', data);
                    self.parent.memberBasketFetcher.resultGridWidget().dataSource.read();
                    if (typeof onComplete === 'function')
                        onComplete();
                }
            });
        }
    };

    self.saveHaltedBasket = function () {
        self.busy(true);

        var data = {
            basketId: self.basketId(),
            halt: true
        }

        console.log('orderFactory calling saveHaltedBasket with', data);
        $.ajax({
            url: '/api/componentapi/SaveBasketReview',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('orderFactory saveHaltedBasket returned', data);
                self.basketLocker.unlockBasket();
                self.busy(false);
                console.log('sendBasketToServer returned', data);
                self.saveBasketVisible(false);
                self.parent.tradeAccountSelector.clearSearch();
                self.parent.memberBasketFetcher.resultGridWidget().dataSource.read();
                self.parent.memberBasketFetcher.importResultGridWidget().dataSource.read();
                $("#order-products-modal").modal('hide');
            }
        });

    }

    self.saveBasket = function () {

        self.validateBasketSaveNow(true);

        if (self.saveBasketErrors().length) {
            self.saveBasketErrors.showAllMessages(true);
        } else {
            self.saveBasketErrors.showAllMessages(false);

            self.busy(true);

            var data = {
                basketId: self.basketId(),
                orderReference: self.orderReference.observable()
            }

            $.ajax({
                url: '/api/componentapi/SaveBasket',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    self.basketLocker.unlockBasket();
                    self.busy(false);
                    console.log('sendBasketToServer returned', data);
                    self.saveBasketVisible(false);
                    self.parent.tradeAccountSelector.clearSearch();
                    self.parent.memberBasketFetcher.resultGridWidget().dataSource.read();
                    self.parent.memberBasketFetcher.importResultGridWidget().dataSource.read();
                    $("#order-products-modal").modal('hide');
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    $.ajaxSettings.error(xhr, s, a);
                }
            });
        }
    };

    self.openBespokeFactoryModal = function (data, bespokeType) {
        switch (self.mode()) {
            case ORDERFACTORY_MODE_BESPOKE_FABRIC_HANGERS:
            case ORDERFACTORY_MODE_BESPOKE_FABRIC_SHOWLENGTHS:
                self.bespokeFabricShowlengthFactory.open(data, bespokeType);
                break;
            case ORDERFACTORY_MODE_BESPOKE_WALLPAPER_SHOWLENGTHS:
                self.bespokeWallpaperShowlengthFactory.open(data);
                break;
            case ORDERFACTORY_MODE_BESPOKE_RUGS:
                self.bespokeRugFactory.open(data);
                break;
            case ORDERFACTORY_MODE_BESPOKE_FURNITURE:
                self.bespokeFurnitureFactory.open(data);
                break;
            case ORDERFACTORY_MODE_BESPOKE_ARCHITECT:
                self.bespokeArchitectRingFactory.open(data);
                break;
        }
    };

    self.openBespokeFactoryModalFromDrilldown = function (data) {
        switch (data.record.ProductFilterID) {
            case 2:
                //self.bespokeFabricHangerFactory.fabricAutocomplete(self.drilldownData().products[0].record.Code + ' - ' + self.drilldownData().products[0].record.OrderFormName);
                //self.bespokeFabricHangerFactory.fabric(self.drilldownData().products[0].record);
                //self.bespokeFabricHangerFactory.suppressFabricLabelFloat = true;
                //self.bespokeFabricHangerFactory.open(data);

                //$('#bespoke-fabric-hanger-modal').on('shown.bs.modal', function () {
                //    self.bespokeFabricHangerFactory.fabric.mdcTextField.label_.float(true);
                //});
                break;
            case 4:
                self.bespokeFabricShowlengthFactory.fabricAutocomplete(self.drilldownData().products[0].record.Code + ' - ' + self.drilldownData().products[0].record.OrderFormName);
                self.bespokeFabricShowlengthFactory.fabric(self.drilldownData().products[0].record);
                self.bespokeFabricShowlengthFactory.suppressFabricLabelFloat = true;
                self.bespokeFabricShowlengthFactory.open(data);
                //$('#bespoke-fabric-showlength-modal').on('shown.bs.modal', function () {
                //    self.bespokeFabricShowlengthFactory.fabric.mdcTextField.label_.float(true);
                //    self.bespokeFabricShowlengthFactory.fabric.mdcTextField.layout();//.label_.float(true);
                //});
                break;
            case 50:
                self.bespokeWallpaperShowlengthFactory.wallpaperAutocomplete(self.drilldownData().products[0].record.Code + ' - ' + self.drilldownData().products[0].record.OrderFormName);
                self.bespokeWallpaperShowlengthFactory.wallpaper(self.drilldownData().products[0].record);
                self.bespokeWallpaperShowlengthFactory.suppressWallpaperLabelFloat = true;
                self.bespokeWallpaperShowlengthFactory.open(data);
                //$('#bespoke-wallpaper-showlength-modal').on('shown.bs.modal', function () {
                //    self.bespokeWallpaperShowlengthFactory.wallpaper.mdcTextField.label_.float(true);
                //});
                break;
            case 3:
                self.bespokeRugFactory.open(data);
                break;
            case 9:
                self.bespokeFurnitureFactory.open(data);
                break;
            case 54:
                self.bespokeArchitectRingFactory.open(data);
                break;
        }
    };

    self.openModalFromQuickDisplay = function (data) {
        switch (data.record.ProductFilterID) {
            case 2:
                //self.bespokeFabricHangerFactory.open(data);
                break;
            case 4:
                self.bespokeFabricShowlengthFactory.open(data);
                break;
            case 50:
                self.bespokeWallpaperShowlengthFactory.open(data);
                break;
            case 3:
                self.bespokeRugFactory.open(data);
                break;
            case 9:
                self.bespokeFurnitureFactory.open(data);
                break;
            case 54:
                self.bespokeArchitectRingFactory.open(data);
                break;
            default:
                if (data.hasOwnProperty('searchResult'))
                    self.searchResultDrilldown(data);
                else
                    self.drilldownData(data);
                break;
        }
    };

    // Resets the filters seen in the advanced-filters div
    self.resetFilters = function () {
        self.selectedColour(undefined);
        self.selectedBrand(undefined);
        self.selectedLaunch(undefined);
        self.selectedPattern(undefined);
        self.selectedItemType(undefined);
        self.selectedStock(undefined);
        self.selectedMartindale(undefined);
        self.selectedWidth(undefined);
        self.selectedSize(undefined);
        //self.selectedProductType(undefined);
        //self.previousProductType(undefined);
    };

    self.refreshProductFilterButtons = function (causeSelect) {

        //self.busy(true);

        var tradeAccountId = self.tradeAccount.peek() ? self.tradeAccount.peek().TradeAccountID : undefined;

        if (tradeAccountId) {

            var ticksNow = new Date().getTime();

            var data = {
                tradeAccountId: tradeAccountId,
                launchId: null,
                clearance: self.clearance(),
                searchNew: self.searchNew(),
                applicationId: 61
            };

            console.log('orderFactory refreshProductFilterButtons calling with', data);

            $.ajax({
                url: '/api/componentapi/productSearchFilters',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('orderFactory refreshProductFilterButtons returned in ' + (new Date().getTime() - ticksNow) + 'ms', data);

                    // $currentCat.data('product-filter-group');

                    var productFilterGroup = $('.group.product-filter-button-group a.btn-primary').closest('.panel').find('.category-heading').data('product-filter-group');

                    self.productFilterButtons(data.CurrentSet);

                    self.completeProductFilterSet(data.CompleteSet);

                    // what we want is to retain the selection if it's present in the set. 
                    // if it's not... then :P please select a category

                    // so... this is close, however.
                    // it is misleading in that it simply opens the accordion panel which was opened when the buttons refreshed
                    // not that which actually contains the selected button, which is what we want.

                    // so the correct approach would be to find the accordion panel which is parent to the selected button,
                    // and .click() that one open. To do so we'll need to pull the productFilterGroup from the category-heading 

                    window.setTimeout(function () {

                        var $currentCat = $('a.category-heading[data-product-filter-group="' + productFilterGroup + '"]');

                        if ($currentCat.length) {
                            //$('#category-accordion .collapse').collapse({
                            //    toggle: false,
                            //    parent: '#category-accordion'
                            //});
                            window.setTimeout(function () {
                                $currentCat.click();
                                //$currentBut.click();
                                //if ($('#category-accordion a.category-heading[data-product-filter-group="' + productFilterGroup + '"] + .collapse').length) {
                                //    if (!$('#category-accordion a.category-heading[data-product-filter-group="' + productFilterGroup + '"] + .collapse').hasClass('in'))
                                //        $('#category-accordion a.category-heading[data-product-filter-group="' + productFilterGroup + '"]').click();
                                //        //$('#category-accordion a.category-heading[data-product-filter-group="' + productFilterGroup + '"] + .collapse').collapse('show');
                                //}
                            }, 150);
                        }
                    }, 0);

                    if (self.searchWidgetValue()) {
                        window.setTimeout(function () {

                            if (self.searchWidgetValue() != -1) {

                                var found = Enumerable.From(self.groupedProductFilterButtons()).Where(function (x) {
                                    return x.Value == self.searchWidgetValue()
                                }).SingleOrDefault();


                                if (found != null) {
                                    self.searchNonce.valueHasMutated();
                                } else {
                                    // no button was found, but we DID previously have a button selected. Please select a category.
                                    self.searchWidget({});
                                }
                            } else {

                                var found = Enumerable.From(self.groupedProductFilterButtons()).Where(function (x) {
                                    return x.ProductFilterGroupID == self.searchWidgetProductFilterGroupId() &&
                                        x.ProductFilterID == self.searchWidgetProductFilterId()
                                }).SingleOrDefault();

                                if (found != null) {
                                    self.searchNonce.valueHasMutated();
                                } else {
                                    self.searchWidget({});
                                }
                            }
                        }, 0);
                    }

                    //self.busy(false);
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    $.ajaxSettings.error(xhr, s, a);
                }
            });
        }
    };

    self.newOrder = function (customerVisitId) {
        console.log('showing orderFactory - new order');
        if (!self.tradeAccount()) {
            $.info('Please Select a Trade Account', 'You must select a Trade Account before adding products to your basket.');
        } else {
            self.showNewBasket();//(customerVisitId);
        }
    };

    self.processBasketItems = function (array) {
        var results = [];
        ko.utils.arrayForEach(array, function (item) {

            item.basketItemErrors = item.basketItemErrors || [];

            //item.mustAllocateOrBackOrder = ko.observable(item.MustAllocateOrBackOrder).extend({
            //    equal: {
            //        params: false,
            //        onlyIf: function () {
            //            return self.validateBasketPhaseNow();
            //        },
            //        message: 'Basket Item Must Allocate or Back Order'
            //    }
            //});

            //item.mustProvidePackingMethod = ko.observable(item.MustProvidePackingMethod).extend({
            //    equal: {
            //        params: false,
            //        onlyIf: function () {
            //            return self.validateBasketPhaseNow();
            //        },
            //        message: 'Basket Item Must Provide Packing Method'
            //    }
            //});

            item.processAnswers = JSON.parse(item.ProcessAnswersJSON);

            if (item.processAnswers) {
                if (item.processAnswers.waterfallProducts) {
                    item.bespokeWaterfallBootstrapPopover = {
                        title: 'Waterfall Products',
                        content: Enumerable.From(item.processAnswers.waterfallProducts).Select(function (x) {
                            return `<div class="bespoke-waterfall-tooltip-item" title="${x.label}">
                                                <img class="thumb" src="https://www.designersguild.com/image/90/${x.value.ImageID}", title: "${x.value.Code}" }\">
                                                <span>
                                                    <span data-bind="text: '${x.value.Code}'"></span>
                                                    <span data-bind="text: '${x.value.Name}'"></span>
                                                </span>
                                            </div>`;
                        }).ToArray().join(""),
                        placement: 'right',
                        trigger: 'click',
                        template: `<div class="popover product-details-popover" role="tooltip">
                                <div class="arrow"></div>
                                <div class="modal-header grey-blue">
                                    <button class="close pull-right" data-bind="click: function () { $(popObject).popover('hide'); }">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    <h4 class="modal-title popover-title"></h4>
                                </div>
                                <div class="popover-content"></div>
                            </div>`
                    }
                }
            }
            item.bootstrapPopoverDetails = {
                title: 'Products Details',
                content: function () {
                    var result = $('<dl class="dl-horizontal"></dl>');
                    ko.utils.arrayForEach(Object.keys(item.record).sort(function (a, b) {
                        return a == b ? 0
                            : a < b ? -1 : 1
                    }), function (property) {
                        if (item.record[property] != null) {
                            if (
                                ['BasketItemTypeID',
                                    'ProductFilterID',
                                    'ProductImageID',
                                    'BasketVisible',
                                    'HasChildren',
                                    'bootstrapPopoverDetails',
                                    'basketSplitId',
                                    'readOnly',
                                    'bespokeWaterfallBootstrapPopover',
                                    'BasketItemCustomerLineMemoDisplay',
                                    'BasketItemLineMemos'
                                ].indexOf(property) == -1) {
                                if (property == 'processAnswers') {

                                    result.append($(`<hr/>`));

                                    ko.utils.arrayForEach(Object.keys(item.record[property]).sort(function (a, b) {
                                        return a == b ? 0
                                            : a < b ? -1 : 1
                                    }), function (processAnswer) {
                                        var valueToWrite = item.record[property][processAnswer];

                                        if (typeof valueToWrite === 'function')
                                            return;

                                        processAnswer = processAnswer.charAt(0).toUpperCase() + processAnswer.slice(1);

                                        var matchedArray = processAnswer.match(/[A-Z]+[a-z]+/g);

                                        if (matchedArray != null)
                                            processAnswer = matchedArray.join(' ')

                                        if ((processAnswer.indexOf('Total') > -1) || (processAnswer.indexOf('Price') > -1))
                                            valueToWrite = formatCurrency(valueToWrite, 2, item.record.Currency.FormattingCulture, item.record.Currency.ISO_4217);

                                        if (typeof valueToWrite === 'string' && moment(valueToWrite).isValid())
                                            valueToWrite = moment(valueToWrite).format('dddd Do MMM YY')

                                        if (typeof valueToWrite === 'number' && processAnswer != 'Waterfall Type Id')
                                            valueToWrite += ' m';

                                        if (typeof valueToWrite === 'string')
                                            valueToWrite = valueToWrite.replace(/(?:\r\n|\r|\n)/g, '<br/>');

                                        var newValueToWrite = null;
                                        var arrayPropertiesToWrite = [];

                                        if (Array.isArray(valueToWrite) === true) {
                                            for (var i in valueToWrite) {
                                                if (valueToWrite[i].hasOwnProperty('label')) {
                                                    arrayPropertiesToWrite.push(valueToWrite[i].label);
                                                }
                                            }

                                            newValueToWrite = arrayPropertiesToWrite.join('<br/>');
                                            valueToWrite = newValueToWrite;
                                        }

                                        if (processAnswer == 'Waterfall Products') {
                                            result.append($(`<dt data-bind="text: '${processAnswer}'"></dt>`));
                                            result.append($(`<dd><div data-bind="html: '${valueToWrite}'"></div>
                                                <a href="javascript:;" data-bind="bootstrapPopover: $parent.bespokeWaterfallBootstrapPopover">
                                                View Details
                                            </a></dd>`));
                                        } else {
                                            result.append($(`<dt data-bind="text: '${processAnswer}'"></dt>`));
                                            result.append($(`<dd data-bind="html: '${valueToWrite}'"></dd>`));
                                        }
                                    })
                                } else {
                                    var valueToWrite = item.record[property];

                                    if (typeof valueToWrite === 'function')
                                        return;

                                    if (property === 'preAllocationPopoverDetails' ||
                                        property === 'BasketItemCustomerLineMemoDisplay' ||
                                        property === 'BasketItemLineMemos')
                                        return;

                                    if (property === 'BespokeFurnitureJSON' ||
                                        property === 'ProcessAnswersJSON') {
                                        result.append($(`<dt data-bind="text: '${property}'"></dt>`));
                                        result.append($(`<dd><pre>${PR.prettyPrintOne(JSON.stringify(JSON.parse(valueToWrite), null, 4))}</pre></dd>`));
                                        return;
                                    }

                                    property = property.charAt(0).toUpperCase() + property.slice(1);

                                    var matchedArray = property.match(/[A-Z]+[a-z]+/g);

                                    if (matchedArray != null)
                                        property = matchedArray.join(' ')

                                    if (((property.indexOf('Total') > -1) && (property.indexOf('Include') != 0)) || ((property.indexOf('Price') > -1) && (property.indexOf('Include') != 0)))
                                        valueToWrite = formatCurrency(valueToWrite, 2, item.record.Currency.FormattingCulture, item.record.Currency.ISO_4217);

                                    if (typeof valueToWrite === 'string' && moment(valueToWrite).isValid())
                                        valueToWrite = moment(valueToWrite).format('dddd Do MMM YY')

                                    if (typeof valueToWrite === 'boolean')
                                        valueToWrite = valueToWrite ? 'Yes' : 'No';

                                    if (typeof valueToWrite === 'string')
                                        valueToWrite = valueToWrite.replace(/(?:\r\n|\r|\n)/g, '<br/>');

                                    if (property === 'Currency') {
                                        valueToWrite = `${valueToWrite.Symbol} (${valueToWrite.Name})`;
                                    }

                                    result.append($(`<dt data-bind="text: '${property}'"></dt>`));
                                    result.append($(`<dd data-bind="html: '${valueToWrite}'"></dd>`));
                                }
                            }
                        }
                    });
                    if (item.record.BasketItemCustomerLineMemoDisplay != null) {
                        result = $(item.record.BasketItemCustomerLineMemoDisplay + $(result).prop('outerHTML'));
                    }
                    return result;
                },
                placement: 'right',
                trigger: 'click',
                template: `<div class="popover product-details-popover" role="tooltip">
                                <div class="arrow"></div>
                                <div class="modal-header grey-blue">
                                    <button class="close pull-right" data-bind="click: function () { $(popObject).popover('hide'); }">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    <h4 class="modal-title popover-title"></h4>
                                </div>
                                <div class="popover-content"></div>
                            </div>`
            }
            item.fetchAllocationPopupDetails = function () {
                $.ajax({
                    url: '/api/componentapi/FetchBasketItemPreAllocations',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        basketItemId: item.record.BasketItemID
                    },
                    success: function (data) {
                        if (data.PreAllocations.length) {
                            var div = $('<div></div>');
                            var dl = $('<dl class="dl-horizontal"></dl>');
                            $.map(data.PreAllocations, function (preAlloc) {
                                $(dl).append(`<dt>PreAllocationID</dt>`);
                                $(dl).append(`<dd>${preAlloc.BasketPreAllocationID}</dd>`);
                                $(dl).append(`<dt>Code</dt>`);
                                $(dl).append(`<dd>${preAlloc.PreAllocationCode}</dd>`);
                                $(dl).append(`<dt>Quantity</dt>`);
                                $(dl).append(`<dd>${preAlloc.Quantity.toFixed(item.productFilterOptions().QuantityPrecision)} ${item.record.Units}</dd>`);
                                if (preAlloc.Batch) {
                                    $(dl).append(`<dt>Batch</dt>`);
                                    $(dl).append(`<dd>${preAlloc.Batch}</dd>`);
                                }
                                if (preAlloc.Piece) {
                                    $(dl).append(`<dt>Piece</dt>`);
                                    $(dl).append(`<dd>${preAlloc.Piece}</dd>`);
                                }
                            });
                            div.append(dl);
                            item.record.preAllocationPopoverDetails.contentObservable(div.html());
                        } else {
                            item.record.preAllocationPopoverDetails.contentObservable('No allocations exist for this item');
                        }
                    }
                });
            }
            item.preAllocationPopoverDetails = {
                title: 'Allocation Details',
                placement: 'bottom',
                html: true,
                content: function () {
                    item.record.fetchAllocationPopupDetails();
                    return 'Loading...';
                },
                trigger: 'click',
                contentObservable: ko.observable('Loading...'),
                template: `<div class="popover product-details-popover pre-allocations-popover" role="tooltip">
                                <div class="arrow"></div>
                                <div class="modal-header grey-blue">
                                    <h4 class="modal-title popover-title"></h4>
                                    <button class="close" data-bind="click: function () { $(popObject).popover('hide'); }">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="popover-content" data-bind="html: contentObservable"></div>
                            </div>`
            };
            item.HasChildren = false; // this is determined by the various basket grouping computeds

            item.Currency = self.currency();

            item = new searchResult(item, self, null); // don't care about parameter 3, "pattern book saturation".

            results.push(item);
        });

        self.basket(results);
    };

    self.show = function (basket, customerVisitId, onComplete, retailPaymentMode) {

        retailPaymentMode = retailPaymentMode || false;

        console.log('orderFactory show called', basket, customerVisitId);

        if (basket != null) {
            self.tradeAccount(basket.TradeAccount);
        }

        if (!self.tradeAccount()) {
            $.info('Please Select a Trade Account', 'You must select a Trade Account before adding products to your basket.');
        } else {

            if (basket == null) {

                self.showNewBasket();//(customerVisitId);

                if (typeof onComplete == 'function')
                    onComplete();
            } else {

                console.log('testing basketId for validity...', basket.BasketID);

                $.ajax({
                    url: '/api/componentapi/TestBasketValidity',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        basketId: basket.BasketID
                    },
                    success: function (data) {
                        console.log('orderFactory testBasketValidity returned', data);
                        if (data.success) {
                            //self.currency(data.basket.Currency);
                            self.basketEntered(true);
                            self.basketId(data.basket.BasketID);
                            self.customerVisitId(customerVisitId);
                            self.savedBasketReason(data.basket.SavedBasketReasonID);
                            self.transactionType(data.basket.TransactionTypeID);
                            self.fetchFulfilmentOptions();

                            self.userRefusedAddressRecommendation(basket.UserRefusedAddressRecommendation);

                            self.reserveBatchCuttingExpressIndicator.skipSubscription = true;
                            self.reserveBatchCuttingExpressIndicator(basket.SendReserveBatchCuttingsExpress);

                            self.orderReference.observable(basket.OrderReference);

                            if (data.basket.BasketLines != null) {
                                if (data.basket.BasketLines.length) {
                                    self.permitAllocationEnabled(false);
                                }
                            }

                            //self.processBasketItems(data.BasketItems);

                            // do not load these values - Matt
                            //self.basketReviewManager(data.basket.DiscountApprovedByManagerMemberID);
                            //self.basketReviewManagerMessage.observable(data.basket.DiscountManagerMessage);
                            //self.basketReviewStageTwoDuplicatesConfirmed(data.basket.DuplicateLineAcknowledgement);

                            // would it not be better to directly load into the deliveryAddress object, in case we can skip
                            // loading the address phase entirely?
                            self.deliveryAddress.loadBasketAddress(data.basket);

                            self.euExitCode.observable(data.basket.EUExitCode);

                            self.euExitingConfirmed(data.basket.EUExitingConfirmed);

                            self.euExitFinalDestinationAddress.loadBasketAddress({
                                DeliveryName: data.basket.EUExitFullName,
                                DeliveryCompanyName: data.basket.EUExitCompanyName,
                                DeliveryAddressLine1: data.basket.EUExitAddressLine1,
                                DeliveryAddressLine2: data.basket.EUExitAddressLine2,
                                DeliveryTown: data.basket.EUExitTown,
                                DeliveryCounty: data.basket.EUExitCounty,
                                DeliveryPostcode: data.basket.EUExitPostcode,
                                DeliveryPhoneNumber: data.basket.EUExitPhoneNumber,
                                DeliveryCountryID: data.basket.EUExitCountryID,
                                DeliveryCountryCode: data.basket.EUExitCountryCode
                            });

                            self.orderReference.observable(data.basket.OrderReference);
                            self.usTaxExemptionCertificate.observable(data.basket.USTaxExemptionCertificate);

                            if (data.basket.Email) {
                                var emails = data.basket.Email.split('; ');

                                for (var i = 0; i < emails.length; i++) {
                                    self.emailManager.addEmail();
                                    self.emailManager.emails()[i].observable(emails[i]);
                                }
                            }

                            basket.mertexVATLookupSuccessful = ko.observable(basket.MertexVATLookupSuccessful);

                            self.basketServerObject(basket);

                            self.allocateProforma(data.basket.AllocateProforma);

                            self.creditTermsAutocomplete.observable(data.basket.PaymentTerms.Label);
                            self.creditTerms(data.basket.PaymentTerms);

                            if (data.basket.MertexOperator) {
                                self.orderTakerAutocomplete.observable(data.basket.MertexOperator.Name);
                                self.orderTaker(data.basket.MertexOperator);
                            }

                            self.salesRepresentativeAutocomplete.observable(data.basket.SalesRepresentative.Name);
                            self.salesRepresentative(data.basket.SalesRepresentative);

                            self.salesAgentAutocomplete.observable(data.basket.SalesAgent.Name);
                            self.salesAgent(data.basket.SalesAgent);

                            self.customerCareRecord(data.basket.RaisedAsResultOfClaim);
                            self.customerCareRecordAutocomplete.observable(data.basket.RaisedAsResultOfClaim);

                            self.callType(data.basket.CallTypeID || undefined);
                            self.callerParams.observable(data.basket.CallerName);

                            self.customerRequestsFullDispatch(data.basket.CustomerRequestsFullDespatch);
                            self.contractOrder(data.basket.IsContractOrder);

                            self.basketLocker.basket(basket);

                            if (data.basket.DeliveryCountry) {
                                if (data.basket.DeliveryCountry.EU) {
                                    if (data.basket.VATNumber) {
                                        self.vatNumberParams.observable(data.basket.VATNumber);
                                        self.vatCountryCode(data.basket.VATCountryCode);
                                        self.vatNumberRequestIdentifier(data.basket.VIESConsultationNumber);
                                    }
                                    if (data.basket.EORI) {
                                        self.eoriNumberParams.observable(data.basket.EORI);
                                    }
                                }
                            }

                            if (data.basket.LastPhaseVisited == null) {
                                if (self.miscTradeAccount()) {
                                    data.basket.LastPhaseVisited = ORDERFACTORY_PHASE_MISC;
                                } else {
                                    data.basket.LastPhaseVisited = ORDERFACTORY_PHASE_ADDRESS;
                                }
                            }

                            if (data.basket.LastPhaseVisited > ORDERFACTORY_PHASE_BASKET)
                                data.basket.LastPhaseVisited = ORDERFACTORY_PHASE_BASKET;

                            //self.retailTillNumber(data.basket.RetailTillNumber);
                            //self.retailSessionNumber(data.basket.RetailSessionNumber);

                            self.phase(data.basket.LastPhaseVisited);

                            let reshowInfo = false;

                            if ($('#info-modal').is(':visible')) {
                                reshowInfo = true;
                            }

                            if (!retailPaymentMode) {
                                self.isViewingRetailPaymentModal(false);
                                if (reshowInfo) {
                                    //$('#info-modal').modal('hide');
                                    //window.setTimeout(function () {
                                    $('#order-products-modal').modal('show');
                                    //window.setTimeout(function () {
                                    $('#info-modal').css('z-index', $('#order-products-modal').css('z-index') + 10);
                                    //}, 150);
                                    //}, 301);
                                } else {
                                    $('#order-products-modal').modal('show');
                                }
                            } else {
                                self.isViewingRetailPaymentModal(true);
                                if (reshowInfo) {
                                    $('#info-modal').modal('hide');
                                    window.setTimeout(function () {
                                        $('#retail-payment-modal').modal('show');
                                        window.setTimeout(function () {
                                            $('#info-modal').modal('show');
                                        }, 150);
                                    }, 301);
                                } else {
                                    $('#retail-payment-modal').modal('show');
                                }
                            }

                        } else {

                            if (data.hasOwnProperty('locked')) {

                                if (data.hasOwnProperty('mutiny')) {
                                    self.basketLocker.mode('mutiny');
                                } else {
                                    self.basketLocker.mode('sendingTakeover');
                                }

                                self.basketLocker.basket(basket);
                                self.basketLocker.message(data.message);

                                self.basketLocker.showOrderFactoryArguments = [customerVisitId, onComplete, retailPaymentMode]

                                if (self.tradeAccountOrderingNotifications().length) {
                                    window.setTimeout(() => {
                                        self.basketLocker.show();
                                    }, 300);
                                } else {
                                    self.basketLocker.show();
                                }

                                return;
                            }

                            $.confirm('Sorry, there\'s a problem with your basket.', data.message, function () {
                                self.showNewBasket();
                            }, function () {

                            });
                        }

                        if (typeof onComplete == 'function')
                            onComplete();
                    }
                });
            }
        }
    };

    self.showNewBasket = function () {

        self.viewingMode(ORDERFACTORY_VIEWING_MODE_ORDER);

        self.busyMessage('Loading...');
        self.busy(true);
        self.basketEntered(false);
        self.orderReference.observable.mdcTextField.valid = true;
        self.orderTaker.mdcTextField.valid = true;
        self.creditTerms.mdcTextField.valid = true;
        self.salesRepresentative.mdcTextField.valid = true;
        self.salesAgent.mdcTextField.valid = true;
        self.creditTerms.mdcTextField.disabled = false;

        $('#order-products-modal').modal('show');
        $('#basket-lock-modal').modal('hide');

        Promise.resolve(self.insertNewBasket());
    };

    self.showNewBrowse = function () {

        self.phase(ORDERFACTORY_PHASE_SEARCH);

        self.viewingMode(ORDERFACTORY_VIEWING_MODE_BROWSE);

        self.busyMessage('Loading...');
        self.busy(true);
        self.basketEntered(false);
        self.orderReference.observable.mdcTextField.valid = true;
        self.orderTaker.mdcTextField.valid = true;
        self.creditTerms.mdcTextField.valid = true;
        self.salesRepresentative.mdcTextField.valid = true;
        self.salesAgent.mdcTextField.valid = true;
        self.creditTerms.mdcTextField.disabled = false;

        $('#order-products-modal').modal('show');

        self.busy(false);

        //Promise.resolve(self.insertNewBasket());
    };

    self.insertNewBasket = function () {
        return new Promise(function (resolve, reject) {

            var data = {
                tradeAccountId: self.tradeAccount().TradeAccountID,
                tradeAccountCode: self.tradeAccount().Code
            };

            console.log('orderFactory insertNewBasket calling with', data);

            $.ajax({
                url: '/api/componentapi/CreateBasket',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('orderFactory insertNewBasket returned', data);
                    //self.tradeAccount(data.TradeAccount);
                    //self.basketId(data.BasketID);

                    // needs to be a neat double field with VATCountryCode on the left and VATNumber on the right.
                    // with the exception of miscellaneous trade accounts, where it's down to the operator to
                    // enter the VATCountryCode and VATNumber. These accounts should be presented with blanks to start with.

                    // we need to be saving these values back to the basket, whether or not it's valid.
                    // when it's NOT a misc account, we want a 'Refresh' button to pull again from Mertex.

                    data.mertexVATLookupSuccessful = ko.observable(data.MertexVATLookupSuccessful);

                    self.basketServerObject(data);

                    self.basketId(self.basketServerObject().BasketID);

                    self.userRefusedAddressRecommendation(data.UserRefusedAddressRecommendation); // always false at this point but what the hey

                    self.miscInvoiceAddress.validateNow(true);

                    self.deliveryAddress.validateNow(true);

                    self.deliveryAddressFactory.loadAddresses(function () {
                        window.setTimeout(function () {
                            if (data.VATNumber) {
                                self.vatNumberParams.observable(data.VATNumber);
                                self.vatCountryCode(data.VATCountryCode);
                            }
                            if (data.EORI) {
                                self.eoriNumberParams.observable(data.EORI);
                            }
                        }, 500)
                    });

                    self.basketLocker.basket = self.basketServerObject;

                    self.fetchFulfilmentOptions();

                    if (data.Email) {
                        var emails = data.Email.split('; ');

                        for (var i = 0; i < emails.length; i++) {
                            self.emailManager.addEmail();
                            self.emailManager.emails()[i].observable(emails[i]);
                        }
                    } else {
                        self.emailManager.addEmail();
                    }

                    self.allocateProforma(data.AllocateProforma);

                    self.creditTermsAutocomplete.observable(data.PaymentTerms.Label);
                    self.creditTerms(data.PaymentTerms);

                    if (data.MertexOperator) {
                        self.orderTakerAutocomplete.observable(data.MertexOperator.Name);
                        self.orderTaker(data.MertexOperator);
                    }

                    self.salesRepresentativeAutocomplete.observable(data.SalesRepresentative.Name);
                    self.salesRepresentative(data.SalesRepresentative);

                    self.salesAgentAutocomplete.observable(data.SalesAgent.Name);
                    self.salesAgent(data.SalesAgent);

                    self.parent.memberBasketFetcher.resultGridWidget().dataSource.read();
                    self.parent.memberBasketFetcher.importResultGridWidget().dataSource.read();

                    if (self.viewingMode() == ORDERFACTORY_VIEWING_MODE_ORDER) {
                        if (self.miscTradeAccount())
                            self.phase(ORDERFACTORY_PHASE_MISC);
                        else
                            self.phase(ORDERFACTORY_PHASE_ADDRESS);
                    } else {
                        self.phase(ORDERFACTORY_PHASE_SEARCH);
                    }

                    resolve();
                },
                error: function (xhr, s, a) {
                    $.ajaxSettings.error(xhr, s, a);
                    reject();
                }
            });
        });
    };

    self.showEUExitDetailsModal = function () {
        $('#eu-exit-details-modal').modal('show');
    };

    self.cancelEUExitDetailsModal = function () {
        $.confirm('Are you sure?', 'Any previously saved E.U. Exit Details will be cleared', function () {
            var data = {
                basketId: self.basketId(),
                euExitCode: self.euExitCode.observable()
            };

            $.extend(data, {
                address: self.euExitFinalDestinationAddress.toBasketAddressJS()
            });

            console.log('orderFactory calling cancelEUExitDetailsModal with', data);

            $.ajax({
                url: '/api/componentapi/SaveBasketEUExitDetails',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    self.validateEUExitDestinationNow(false);
                    self.euExitCode.observable(undefined);
                    self.euExitFinalDestinationAddress.reset();

                    console.log('orderFactory cancelEUExitDetailsModal returned');
                    self.busy(false);
                    $('#eu-exit-details-modal').modal('hide');
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    $.ajaxSettings.error(xhr, s, a);
                }
            });
        })
    };

    self.saveEUExitDetails = function (onComplete) {

        let performSave = true;

        if (self.euExitingConfirmed()) {
            self.validateEUExitDestinationNow(true);

            self.euExitErrors.showAllMessages(false);

            if (self.euExitErrors().length) {
                self.euExitErrors.showAllMessages(true);
                self.euExitFinalDestinationAddress.notifySubscribers();
                performSave = false;
            }
        }

        if (performSave) {

            self.busy(true);

            var data = {
                basketId: self.basketId(),
                euExitingConfirmed: self.euExitingConfirmed()
                //euExitCode: self.euExitCode.observable()
            };

            $.extend(data, {
                address: self.euExitFinalDestinationAddress.toBasketAddressJS()
            });

            console.log('orderFactory calling saveBasketEUExitDetails with', data);

            $.ajax({
                url: '/api/componentapi/SaveBasketEUExitDetails',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('orderFactory saveBasketEUExitDetails returned');
                    self.busy(false);
                    $('#eu-exit-details-modal').modal('hide');
                    if (typeof onComplete === 'function')
                        onComplete();
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    $.ajaxSettings.error(xhr, s, a);
                }
            });
        }
    };

    self.saveBasketDetails = function (onComplete, skipEUExitSave) {

        skipEUExitSave = typeof skipEUExitSave == 'undefined' ? false : skipEUExitSave;

        self.validateBasketDetailsNow(true);

        self.newBasketErrors.showAllMessages(false);

        if (self.newBasketErrors().length) {
            self.newBasketErrors.showAllMessages(true);
            self.newBasketErrors.filter(function (x) {
                if (!x.isValid()) {
                    x.isValid.notifySubscribers(false);
                }
            });
            if (self.euExitingConfirmed()) {
                self.validateEUExitDestinationNow(true);
                self.euExitErrors.showAllMessages(false);
                if (self.euExitErrors().length) {
                    self.euExitErrors.showAllMessages(true);
                    self.euExitFinalDestinationAddress.notifySubscribers();
                    //self.euExitCode.observable.isValid.notifySubscribers(self.euExitCode.observable.isValid());
                }
            }
        } else {

            if ((self.euExitingConfirmed() || self.euExitingDenied()) && skipEUExitSave == false) {
                self.saveEUExitDetails(function () {
                    self.saveBasketDetails(function () {
                        self.phase(ORDERFACTORY_PHASE_SEARCH);
                    }, true)
                });
            } else {

                self.busy(true);
                self.busyMessage('Saving...');

                var data = {
                    basketId: self.basketServerObject().BasketID,
                    transactionTypeId: self.transactionType(),
                    orderReference: self.orderReference.observable(),
                    email: $.map(self.emailManager.emails(), function (email) {
                        return email.observable()
                    }).join('; '),
                    orderTaker: self.orderTaker().Code,
                    paymentTermsId: self.creditTerms().PaymentTermsID,
                    salesRepresentativeId: self.salesRepresentative().SalesRepresentativeID,
                    salesAgentId: self.salesAgent() ? self.salesAgent().SalesAgentID : null,
                    raisedAsResultOfClaim: self.customerCareRecord(),
                    replacementOrderComment: self.replacementOrderMemo.observable(),
                    haulierAccountShipping: self.customerHaulierAccountShipping.observable(),
                    haulierAccountDuty: self.customerHaulierAccountDuty.observable(),
                    allocateProforma: self.allocateProforma(),
                    fullDespatch: self.customerRequestsFullDispatch(),
                    heldForSales: self.holdForSales(),
                    heldForSalesReasonCode: self.heldForSalesRecord(),
                    contractOrder: self.contractOrder(),
                    usTaxExemptionCertificate: self.usTaxExemptionCertificate.observable(),
                    vatNumber: self.vatNumberParams.observable(),
                    vatCountryCode: self.vatCountryCode(),
                    validVATNumber: self.vatNumberValid(),
                    viesConsultationNumber: self.vatNumberRequestIdentifier(),
                    eoriNumber: self.eoriNumberParams.observable(),
                    callTypeId: self.callType(),
                    callerName: self.callerParams.observable()
                };

                if (self.deliveryAddress) {
                    if (self.deliveryAddress.country()) {
                        if (!self.deliveryAddress.country().EU) {
                            data.vatNumber = null;
                            data.vatCountryCode = null;
                            data.eoriNumber = null;
                        }
                    }
                }

                console.log('orderFactory saveBasketDetails calling with', data)

                $.ajax({
                    url: '/api/componentapi/saveBasketDetails',
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    success: function (data) {
                        console.log('orderFactory saveBasketDetails returned', data)
                        self.busy(false);
                        self.busyMessage(undefined);
                        if (self.basketServerObject().DeliveryAlertEmail == null &&
                            self.emailManager.emails().length >= 1) {
                            self.basketServerObject().DeliveryAlertEmail = self.emailManager.emails()[0].observable();
                        }

                        self.fetchFulfilmentOptions();

                        //self.creditTerms.mdcTextField.disabled = true;
                        if (typeof onComplete === 'function')
                            onComplete();
                    },
                    error: function (xhr, s, a) {
                        self.busy(false);
                        $.ajaxSettings.error(xhr, s, a);
                    }
                });

            }
        }
    };

    // Set the BasketLockerComponent's createNewBasket function.
    // self.basketLocker.createNewBasket = self.createNewBasket;

    // Not sure that I'm ever calling Reset on this... when is it appropriate to do so?
    // When the user closes the modal...? 
    self.reset = function () {

        self.isResetting(true);

        self.tradeAccountOrderingNotifications([]);
        self.reviewNotifications([]);
        self.mayStartOrder(false);
        self.mayBrowse(false);

        console.log('orderFactory reset called');

        self.refreshProductFilterButtons();

        $('#saved-basket-reason-modal').modal('hide');

        // cannot reset this; must trust that it's always overwritten when necessary
        // this is because the loading process necessarily calls reset...
        //self.basketServerObject(undefined);
        self.basketEntered(false);

        self.addingBasketItem(false);

        self.validateBasketDetailsNow(false);
        self.validateBasketPhaseNow(false);
        self.validateBasketReviewStageOneNow(false);
        self.validateBasketReviewStageTwoNow(false);
        self.basketReviewStageTwoDuplicatesConfirmed(false);

        //self.euExitingConfirmed.skipSubscription = true;
        //self.euExitingDenied.skipSubscription = true;
        self.euExitingConfirmed(null);
        self.euExitingDenied(null);
        //self.euExitingConfirmed.skipSubscription = false;
        //self.euExitingDenied.skipSubscription = false;

        self.newBasketErrors.showAllMessages(false);

        self.busy(false);

        self.searchTerm(undefined);

        self.basketReviewManager(undefined);
        self.basketReviewManagerMessage.observable(undefined);

        self.patternBookSchemes([]);

        self.usSalesTaxExemptionCertificateRequired(false);
        self.purchaseOrderNumberRequired(false);
        self.allowEUExitCode(0);

        self.savedBasketReasonValidateNow(false);

        self.validateEUExitDestinationNow(false);
        self.euExitCode.observable(undefined);
        self.euExitFinalDestinationAddress.reset();

        self.viewingMode(ORDERFACTORY_VIEWING_MODE_ORDER);

        self.busyMessage(undefined);

        self.basketId(undefined);

        self.focus(undefined);

        self.searchResultRequestingSupplier(undefined);

        self.searchResultRequestingPOLineNumber(undefined);

        self.searchResultRequestingPOLineNumber(undefined);

        self.searchResultRequestingQuantity(undefined);

        self.customerHaulierAccountShipping.observable(undefined);

        self.customerHaulierAccountDuty.observable(undefined);

        self.refreshCreditTermsBusy(false);
        self.creditTerms(undefined);
        self.creditTermsAutocomplete.observable(undefined);

        self.customerCareRecord(undefined);
        self.customerCareRecordAutocomplete.observable(undefined);

        self.heldForSalesAdditionalInformation.observable(undefined);
        self.heldForSalesRecordAutocomplete.observable(undefined);
        self.heldForSalesRecord(undefined);

        self.salesRepresentative(undefined);
        self.salesRepresentativeAutocomplete.observable(undefined);

        self.salesAgent(undefined);
        self.salesAgentAutocomplete.observable(undefined);

        self.orderTaker(undefined);
        self.orderTakerAutocomplete.observable(undefined);

        self.vatRefreshBusy(false);
        self.vatNumberValid(undefined);
        self.vatNumberParams.observable(undefined);
        self.vatCountryCode(undefined);
        self.vatNumberCheckPerformed(false);
        self.vatCheckBusy(false);
        self.vatNumberRequestIdentifier(undefined);

        self.eoriRefreshBusy(false);
        self.eoriNumberParams.observable(undefined);
        self.eoriNumberMessage(undefined);

        self.replacementOrderMemo.observable(undefined);

        self.customerRequestsFullDispatch(false);
        self.contractOrder(false);
        self.holdForSales(false);
        self.allocateProforma(false);
        self.customerVisitId(undefined);
        self.saveBasketVisible(false);
        self.validateBasketSaveNow(false);
        self.transactionType(undefined);
        self.callType(undefined);
        self.callerParams.observable(undefined);
        self.savedBasketReason(undefined);

        self.searchPriceMin(undefined);
        self.searchPriceMax(undefined);
        self.searchPriceOperator('<');
        self.searchStockOperator(null)
        self.searchStock(undefined);

        self.emailManager.emails([]);
        self.orderReference.observable(undefined);
        self.duplicateOrderReferenceMessage(undefined);
        self.vatNumberMessage(undefined);
        self.vatNumberError(false);
        self.usTaxExemptionCertificate.observable(undefined);

        self.lastSaved(undefined);
        self.display(ORDERFACTORY_ADD_MODE_STOCK);
        self.clearance(ORDERFACTORY_SEARCH_TYPE_ALL); // why was this calling silentUpdate? because it would call the search?
        self.clearance.valueHasMutated();
        self.searchNew(false); // why was this calling silentUpdate?
        self.skipFirst(true);
        self.searchWidget(self.searchWidgetBlank);
        self.basket([]);

        self.selectedColour.silentUpdate(undefined);
        self.selectedBrand.silentUpdate(undefined);
        self.selectedLaunch.silentUpdate(undefined);
        self.selectedPattern.silentUpdate(undefined);
        self.selectedItemType.silentUpdate(undefined);
        self.selectedStock.silentUpdate(undefined);
        self.selectedMartindale.silentUpdate(undefined);
        self.selectedWidth.silentUpdate(undefined);
        self.selectedSize.silentUpdate(undefined);

        self.filterViewMode(ORDERFACTORY_FILTER_MODE_STANDARD);
        self.phase(ORDERFACTORY_PHASE_BLANK);
        self.mode(ORDERFACTORY_MODE_STANDARD);

        self.selectedFilterCountNonce.valueHasMutated();

        //self.bespokeFabricHangerFactory.reset();
        self.bespokeFabricShowlengthFactory.reset();
        self.bespokeWallpaperShowlengthFactory.reset();
        self.bespokeRugFactory.reset();
        self.bespokeFurnitureFactory.reset();

        self.parent.orderProductsDrilldownFurnitureComponents.resetProcessingModal();
        self.parent.orderProductsDrilldownFurnitureComponents.reset();

        self.parent.orderProductsDrilldown.resetProcessingModal();
        self.parent.orderProductsDrilldown.reset();

        self.deliveryAddress.reset();
        self.miscInvoiceAddress.reset();
        self.deliveryAddressFactory.reset();
        self.dispatchFactory.reset();

        self.availableClauses([]);
        self.orders([]);

        self.validateRetailNow(false);
        self.retailTillNumber(undefined);
        self.retailSessionNumber(undefined);
        self.availableRetailTills([]);
        self.availableRetailTillSessions([]);
        self.retailBusy(false);

        self.validateBasketReceiptEmailNow(false);
        self.basketReceiptEmail(undefined);
        self.basketReceiptSentTo(undefined);
        self.showBasketReceiptLastSentTo(false);
        self.basketSubmissionResults([]);
        self.submissionResultText(undefined);

        self.userRefusedAddressRecommendation(false);

        self.isViewingRetailPaymentModal(false);

        $('.category .colour-container .colour').removeClass('selected-colour');
        $('.category .filter-container .btn').removeClass('btn-primary');

        $('.filter-phases .group .btn').removeClass('btn-primary');

        // Total WTF about these two lines.
        //
        //$('.search-type-btns .btn').removeClass('btn-primary');
        //$('.search-type-btns .btn').last().addClass('btn-primary');

        $('#category-accordion .collapse').collapse('hide');

        self.isResetting(false);
    };

    self.productSearchInProgress = false;

    self.search = ko.computed(function () {

        var nonce = self.searchNonce();

        if (!self.searchWidget()) { // .hasOwnProperty('Value')) {
            console.log('orderFactory search WAS SKIPPED searchWidget had no property "Value"');
            self.skipFirst(false);
            return;
        }

        var tradeAccountId = null;

        if (self.tradeAccount.peek())
            tradeAccountId = self.tradeAccount.peek().TradeAccountID

        var data = {
            widget: self.searchWidget(),
            launchId: self.selectedLaunch(),
            searchTerm: self.searchTerm.peek(),
            brandId: self.selectedBrand(),
            productTypeId: self.selectedProductType(),
            productTypeGroupId: self.selectedProductTypeGroup(),
            productGroupId: self.selectedProductGroup(),
            itemTypeId: self.selectedItemType(),
            stockFilterId: self.selectedStock(),
            clearance: self.clearance.peek(),
            searchNew: self.searchNew.peek(),
            tradeAccountId: tradeAccountId,
            collectionId: self.collectionId(),
            metric: true,
            colourId: self.selectedColour(),
            patternId: self.selectedPattern(),
            martindaleId: self.selectedMartindale(),
            wideWidth: self.selectedWidth(),
            sortOrder: self.searchSortOrder(),
            sizeId: self.selectedSize(),
            pageSize: self.searchPageSize(),
            priceOperator: self.searchPriceOperator.peek(),
            priceMin: self.searchPriceMin(),
            priceMax: self.searchPriceMax(),
            stockOperator: self.searchStockOperator.peek(),
            stock: self.searchStock()
        };

        /*
         
        public string priceOperator { get; set; }
        public decimal? priceMin { get; set; }
        public decimal? priceMax { get; set; }
        public string stockOperator { get; set; }
        public decimal? stock { get; set; }
         
         */

        if (self.skipFirst()) {
            self.skipFirst(false);
            console.log('orderFactory search WAS SKIPPED skipFirst was true');
            return;
        } else {

            if (self.searchWidgetValue() == 'QuickDisplay') {
                self.busy(false);
                return;
            }

            // Well, now we CAN have a null value and still search...
            // because we're permitting searching by ProductFilterGroup. Hmph.
            // Is... is the "Value" actually used in the search? If not I can dummy one. We'll find out.
            // Yes, it's passed as @Widget... and we need that to be NULL so that the search proc doesn't
            // go and try to fill in @ProductFilterID (which is necessarily also null...)
            //if (self.searchWidgetValue() == null) {
            //    // abort abort abort!
            //    self.busy(false);
            //    // no longer necessary to inform the user: it's obvious, there's even a thing that reads "Please select a category".
            //    //$.info('Please Select a Category', 'Please select a category before searching for products.');
            //    return;
            //}

            self.productSearchInProgress = true;
            self.busy(true);
            self.busyMessage('Searching...');
            console.log('productSearch calling with', data);

            var ticksNow = new Date().getTime();

            $.ajax({
                url: '/api/componentapi/productSearch',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    // How to suppress this...
                    if (self.previousProductType() == self.selectedProductType()) {

                    } else {
                        self.collectionId.silentUpdate(undefined); // where do I want to clear this... probably here.
                    }

                    console.log('productSearch returned in ' + (new Date().getTime() - ticksNow) + 'ms', data);

                    ticksNow = new Date().getTime();

                    var results = [];

                    for (var i in data.Results) {
                        var pbs = Enumerable.From(data.PatternBookSaturation).Where(function (x) {
                            return x.ProductID == data.Results[i].ProductID;
                        }).SingleOrDefault();
                        results.push(new searchResult(data.Results[i], self, pbs));
                    }

                    // With 250 results this is... three seconds or so, which is terrible?
                    self.searchResults(results);

                    self.busy(false);
                    self.busyMessage(undefined);
                    self.productSearchInProgress = false;

                    self.allFulfilmentOptions.valueHasMutated();

                    console.log('productSearch processed result data in ' + (new Date().getTime() - ticksNow) + 'ms');

                    //self.updateViewportDimensions();
                    // For testing the order drilldown while developing
                    //window.setTimeout(function () {
                    //    $("#search-result-grid-layout > div > div.search-result-flex-wrapper > div:first-of-type > div.search-result-inner > img").trigger('click');
                    //}, 400);

                    //window.setTimeout(function () {
                    //    self.updateViewportDimensions();
                    //}, 100);

                    //window.setTimeout(function () {
                    //    self.matrixLoader.matrixLoaderParams.resize();
                    //}, 0);
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    self.productSearchInProgress = true;
                    $.ajaxSettings.error(xhr, s, a);
                }
            });
        }
    }).extend({
        rateLimit: {
            timeout: 300,
            method: 'notifyWhenChangesStop'
        }
    });

    self.addToBasket = function (data, quantity, discount) {
        var extant = Enumerable.From(self.basket()).Where(function (x) {
            return (x.record.ProductID == data.ProductID) &&
                (x.display == self.display());
        }).SingleOrDefault();

        if (extant == null) {
            self.basket.push(new basketProduct(BASKETITEM_TYPE_STANDARD, self, data, self.display(), quantity, discount/*, promoCode*/));
        } else {

            if (extant.record.ClearanceDiscountPercentage) {
                if (((+extant.quantity()) + quantity) > extant.record.FreeStock) {
                    // noop
                } else {
                    extant.quantity.skipSubscribe = true;
                    extant.quantity((+extant.quantity()) + quantity);
                }
            } else {
                extant.quantity((+extant.quantity()) + quantity);
            }

            extant.discount(discount);
            //extant.promoCode(promoCode);
        }
    };

    self.removeFromBasket = function (basketItem, confirm, onComplete, extraMessage) {
        confirm = typeof confirm === 'undefined' ? true : confirm;
        if (confirm) {
            extraMessage = typeof extraMessage === 'undefined' ? '' : extraMessage;
            $.confirm('Are you sure?', `This will delete this line from your basket.${extraMessage}`, function () {

                var data = {
                    basketItemId: basketItem.record.BasketItemID
                }

                console.log('orderFactory removeFromBasket calling with', data);

                self.busy(true);

                $.ajax({
                    url: '/api/componentapi/CancelBasketItem',
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    success: function (data) {
                        console.log('orderFactory removeFromBasket returned', data);
                        self.basket.remove(basketItem);
                        self.busy(false);
                        if (typeof onComplete === 'function')
                            onComplete();
                    },
                    error: function (xhr, s, a) {
                        self.busy(false);
                        $.ajaxSettings.error(xhr, s, a);
                    }
                });
            });
        } else {
            var data = {
                basketItemId: basketItem.record.BasketItemID
            }

            console.log('orderFactory removeFromBasket calling with', data);

            $.ajax({
                url: '/api/componentapi/CancelBasketItem',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('orderFactory removeFromBasket returned', data);
                    self.basket.remove(basketItem);
                }
            });
        }
    };

    self.removeUnshippableItems = function () {
        var unshippable = self.deliveryAddressFactory.offensiveShipping();

        for (var i = 0; i < unshippable.length; i++) {
            self.basket.remove(function (item) {
                return item.rowNumber == unshippable[i].RowNumber;
            });
        }

        self.deliveryAddressFactory.offensiveShipping([]);

        // right, what should we do now...? pop ourselves through the shipping check again?

        if (self.basket().length) {
            self.phase.valueHasMutated();
        } else {
            self.phase(ORDERFACTORY_PHASE_BASKET);
        }

        // but what if we have no... basket products left...
    };

    self.brandLogoSrc = function (brandId) {
        switch (brandId) {
            case 1:
                return '/Content/images/logos/christian-lacroix.png';
                break;
            case 2:
                return '/Content/images/logos/designers-guild.png';
                break;
            case 3:
                return '/Content/images/logos/designers-guild-essentials.png';
                break;
            case 4:
                return '/Content/images/logos/designers-guild-kids.png';
                break;
            case 5:
                return '/Content/images/logos/designers-guild-unlimited.png';
                break;
            case 6:
                return '/Content/images/logos/the-royal-collection.png';
                break;
            case 8:
                return '/Content/images/logos/william-yeoward.png';
                break;
            case 9:
                return '/Content/images/logos/ralph-lauren.png';
                break;
            case 14:
                return '/Content/images/logos/john-derian.png';
                break;
            default:
                break;
        }
    };

    self.showAddAllModal = function () {
        self.addAll.reset();
        self.addAll.show(self.searchResults()[0]);
    }

    self.addAllSearchResultsToBasket = function () {
        if (self.allFulfilmentOptions().length == 0) {
            self.fetchFulfilmentOptions(function () {
                window.setTimeout(function () {
                    self.addAllSearchResults();
                }, 100);
            });
        } else {
            self.addAllSearchResults();
        }
    };

    self.addAllSearchResults = function () {
        self.busy(true);

        var warnBespoke = false;

        let promises = [];

        ko.utils.arrayForEach(self.searchResults(), function (item) {
            // this warns if any items in the current search results are 'bespoke':
            // these cannot be auto-added because questions about them must be answered.
            // adding products one by one is a bit... yuck?
            // can we not... add them all at once? 
            // why was Matt able to observe the basket totals being updated immediate
            // while this was obviously still loo
            if ([2, 3, 4, 9, 50].indexOf(item.record.ProductFilterID) == -1) {
                promises.push(new Promise(function (resolve, reject) {
                    self.addBasketItem(item, ORDERFACTORY_ADD_MODE_DISPLAY, true, false, function () {
                        resolve();
                    }, function () {
                        reject();
                    });
                }));
            } else {
                warnBespoke = true;
            }
        });

        Promise.allSettled(promises).then(function () {
            if (warnBespoke) {
                $.info('Information', 'There were one or more Bespoke products in the set which you added to your basket. Bespoke products must be added to your basket manually.');
            }

            self.fetchBasket();
        });
    };

    self.viewUnheldPatternBooks = function () {
        self.busy(true);
        self.patternBookSaturationViewAll(false);

        window.setTimeout(function () {
            self.viewUnheldPatternBooksAsync();
            self.busy(false);
        }, 300);
    };

    self.viewUnheldPatternBooksAsync = function () {
        self.searchResults(Enumerable.From(self.searchResults()).Where(function (x) {
            return x.patternBookSaturation == null;
        }).ToArray());
    };

    self.viewAllPatternBooks = function () {
        self.patternBookSaturationViewAll(true);
        self.searchWidget.valueHasMutated();
    };

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
    };

    self.proceedToDispatch = function () {
        // if address is valid (define "is valid"), then phase(ORDERFACTORY_PHASE_DISPATCH)
        var permitted = true;
        if (self.deliveryAddress.country().CountryID == "") {
            permitted = false;
            self.deliveryAddress.country.setError('Please select a Country');
        }
        if (self.deliveryAddress.errors().length) {
            permitted = false;
            self.deliveryAddress.errors.showAllMessages(true);
            // This workaround is necessary because we're not providing an onlyIf to these observables' "required" extenders
            // When provided, it forms a dependency chain and when we change the value of validateNow the onlyIf evaluates
            // and then notifies any subscribers if it has changed.
            self.deliveryAddress.name.isValid.notifySubscribers(self.deliveryAddress.name.isValid());
            self.deliveryAddress.country.isValid.notifySubscribers(self.deliveryAddress.country.isValid());
            self.deliveryAddress.addressLine1.isValid.notifySubscribers(self.deliveryAddress.addressLine1.isValid());
            self.deliveryAddress.town.isValid.notifySubscribers(self.deliveryAddress.town.isValid());
            self.deliveryAddress.postcode.isValid.notifySubscribers(self.deliveryAddress.postcode.isValid());
        } else {
            if (permitted) {
                self.deliveryAddress.errors.showAllMessages(false);
                self.phase(ORDERFACTORY_PHASE_DISPATCH);
            }
        }
    };

    self.addOrderClause = function (order) {
        var selectedClause = ko.observable();
        var selectedClauseId = ko.observable();
        var widget = ko.observable();
        var observable = ko.observable();
        //var selectedDocumentTypes = ko.observableArray([]);
        var clause = {
            label: 'Invoice Clause',
            basketClauseId: order.BasketClauseID,
            basketSplitId: order.BasketSplitID,
            observable: observable,
            useNativeValidation: false,
            decorateInputElement: false,
            insertValidationMessages: false,
            showClear: true,
            readOnly: false,
            clearFunction: function () {
                var self = this;
                self.observable(undefined);
                $(self.observable.DOMElement).focus();
            },
            rows: 6,
            charsRemainingOptions: {
                maxLength: 1000
            },
            //selectedDocumentTypes: selectedDocumentTypes,
            selectedClause: selectedClause,
            selectedClauseId: selectedClauseId,
            widget: ko.observable(),
            availableClausesDropDownList: {
                observable: selectedClause,
                showClear: true,
                width: '100%',
                label: 'Clauses',
                valuePrimitive: false,
                useNativeValidation: false,
                decorateInputElement: false,
                insertValidationMessages: false,
                controlClass: 'form-control',
                dropDownListSettings: {
                    value: selectedClauseId,
                    dataItem: selectedClause,
                    dataValueField: 'ClauseID',
                    dataTextField: 'Name',
                    widget: widget,
                    height: 300,
                    open: function (e) {
                        $(e.sender._widgetOptions.dataItem.mdcSelect.root_).toggleClass('mdc-select--focused');
                    },
                    close: function (e) {
                        $(e.sender._widgetOptions.dataItem.mdcSelect.root_).toggleClass('mdc-select--focused');
                    },
                    change: function (e) {
                        if (e.sender.value()) {
                            observable(e.sender.dataItem().Clause);
                        } else {
                            observable(undefined);
                        }
                    },
                    data: self.availableClauses,
                    valuePrimitive: false,
                    autoWidth: false,
                    autoBind: true,
                    optionLabel: ' ',
                    filter: 'startswith'
                },
                clearFunction: function () {
                    var self = this;
                    observable(undefined);
                    self.observable(undefined);
                    self.dropDownListSettings.widget().value('');
                    self.dropDownListSettings.widget()._widgetOptions.dataItem.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                    self.dropDownListSettings.widget()._widgetOptions.dataItem.mdcSelect.label_.float(false);
                }
            }
        }
        order.clauses.push(clause);
    };

    self.fetchClauses = function () {

        return new Promise(function (resolve, reject) {

            var data = {
                basketId: self.basketId()
            };
            console.log('orderFactory fetchClauses calling with', data);
            $.ajax({
                url: '/api/componentapi/fetchOrderClauses',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('orderFactory fetchClauses returned', data);
                    self.availableClauses(data.Clauses);

                    // orders need to carry their own collections of clauses.

                    var orders = [];

                    data.Orders = Enumerable.From(data.Orders).Where(function (x) {
                        return x.BasketSplitID != null
                    }).OrderBy('$.SortOrder').ToArray();

                    data.Orders.forEach(function (item) {
                        item.clauses = ko.observableArray([]);
                        item.comments = ko.observableArray([]);
                        item.notes = ko.observableArray([]);
                    });

                    self.orders(data.Orders);

                    data.ExistingClauses.forEach(function (item) {
                        var clause = {
                            label: 'Order Clause',
                            basketClauseId: item.BasketClauseID,
                            basketSplitId: item.BasketSplitID,
                            observable: ko.observable(item.Clause),
                            useNativeValidation: false,
                            decorateInputElement: false,
                            insertValidationMessages: false,
                            showClear: !item.ReadOnly,
                            readOnly: item.ReadOnly,
                            clearFunction: function () {
                                var self = this;
                                self.observable(undefined);
                                $(self.observable.DOMElement).focus();
                            },
                            rows: 6,
                        }
                        var addClauseToThese = Enumerable.From(self.orders()).Where(function (x) {
                            return x.BasketSplitID == item.BasketSplitID
                        }).ToArray();
                        for (var i in addClauseToThese) {
                            addClauseToThese[i].clauses.push(clause);
                        }
                    });

                    self.orders().forEach(function (item) {
                        if (item.clauses().length == 0) {
                            self.addOrderClause(item);
                        }
                        item.clauses().forEach(function (clause) {
                            clause.selectedClause = ko.observable();
                            clause.selectedClauseId = ko.observable();
                            clause.widget = ko.observable();
                            clause.availableClausesDropDownList = {
                                observable: clause.selectedClause,
                                showClear: true,
                                width: '100%',
                                label: 'Clauses',
                                valuePrimitive: false,
                                useNativeValidation: false,
                                decorateInputElement: false,
                                insertValidationMessages: false,
                                controlClass: 'form-control',
                                dropDownListSettings: {
                                    value: clause.selectedClauseId,
                                    dataItem: clause.selectedClause,
                                    dataValueField: 'ClauseID',
                                    dataTextField: 'Name',
                                    widget: clause.widget,
                                    enable: !clause.readOnly,
                                    height: 300,
                                    open: function (e) {
                                        $(e.sender._widgetOptions.dataItem.mdcSelect.root_).toggleClass('mdc-select--focused');
                                    },
                                    close: function (e) {
                                        $(e.sender._widgetOptions.dataItem.mdcSelect.root_).toggleClass('mdc-select--focused');
                                    },
                                    change: function (e) {
                                        if (e.sender.value()) {
                                            clause.observable(e.sender.dataItem().Clause);
                                        } else {
                                            clause.observable(undefined);
                                        }
                                    },
                                    data: self.availableClauses,
                                    valuePrimitive: false,
                                    autoWidth: false,
                                    autoBind: true,
                                    optionLabel: ' ',
                                    filter: 'startswith'
                                },
                                clearFunction: function () {
                                    var self = this;
                                    clause.observable(undefined);
                                    self.observable(undefined);
                                    self.dropDownListSettings.widget().value('');
                                    self.dropDownListSettings.widget()._widgetOptions.dataItem.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                                    self.dropDownListSettings.widget()._widgetOptions.dataItem.mdcSelect.label_.float(false);
                                }
                            }
                        });
                    });

                    resolve();
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    self.busyMessage(undefined);
                    $.ajaxSettings.error(xhr, s, a);
                    reject(new Error(xhr.responseText));
                }
            });
        });
    };

    self.saveClauses = function (onComplete, onError) {

        self.busy(true);
        self.busyMessage('Saving Comments, Notes & Clauses...');

        var nextBasketClauseId = 1;

        if (self.orders().length) {
            var nextBasketClauseId = Enumerable.From(self.orders()).Select(function (x) {
                if (x.clauses().length) {
                    return Enumerable.From(x.clauses()).Select(function (y) {
                        return y.basketClauseId || 0
                    }).Max()
                } else {
                    return 0;
                }
            }).Max() || 1;
        }

        var basketClauses = [];

        self.orders().forEach(function (order) {
            order.clauses().forEach(function (item) {
                if (item.readOnly == false) {
                    if (item.observable() != null) {
                        if (item.observable() != '') {
                            if (item.basketClauseId == null) {
                                item.basketClauseId = ++nextBasketClauseId;
                            }
                            basketClauses.push({
                                basketClauseId: item.basketClauseId,
                                basketSplitId: item.basketSplitId,
                                clause: item.observable()
                            });
                        }
                    }
                }
            });
        });

        var data = {
            basketId: self.basketId(),
            clauses: basketClauses || []
        };

        console.log('orderFactory saveClauses calling with', data);

        $.ajax({
            url: '/api/componentapi/saveOrderClauses',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (result) {
                if (result == -1 && data.clauses.length) {
                    if (typeof onError === 'function')
                        onError();
                } else {
                    if (typeof onComplete === 'function')
                        onComplete();
                }
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.ajaxSettings.error(xhr, s, a);
                if (typeof onError === 'function')
                    onError();
            }
        });
    };

    self.updateBasketItem = function (basketItem, onComplete, onError) {
        // console.log should be performed by caller
        $.ajax({
            url: '/api/componentapi/updateBasketItem',
            type: 'POST',
            dataType: 'json',
            data: basketItem,
            success: function (data) {
                if (typeof onComplete === 'function')
                    onComplete();
            },
            error: function (xhr, s, a) {
                if (typeof onError === 'function')
                    onError();
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    };

    self.allRetailPaymentEntries = ko.computed(function () {
        return Enumerable.From(self.dispatchFactory.deliveryGroups()).Select(function (x) {
            return x.retailPaymentEntries();
        }).ToArray();
    }, self);

    self.allRetailPaymentEntries.subscribe(function (newValues) {
        console.log('allRetailPaymentEntries subscribe hit', newValues);
        var all = [
            self.retailTillNumber,
            self.retailSessionNumber
        ];
        ko.utils.arrayForEach(newValues, function (newValue) {
            ko.utils.arrayForEach(newValue, function (paymentEntry) {
                all.push(paymentEntry.retailPaymentType);
                all.push(paymentEntry.retailPaymentAmount);
                all.push(paymentEntry.retailPaymentReference);
            });
        });
        self.retailPaymentErrors = ko.validation.group(all);
    });

    self.validateRetailPayment = function () {
        self.validateRetailNow(true);
        self.retailPaymentErrors.showAllMessages(false);
        if (self.retailPaymentErrors().length) {
            console.log('orderFactory validateRetailPayment failure');
            self.retailPaymentErrors.showAllMessages(true);
            self.retailPaymentErrors.filter(function (x) {
                x.isValid.notifySubscribers(x.isValid());
            });
        } else {
            console.log('orderFactory validateRetailPayment success');
            self.saveRetail(function () {
                self.submitOrder();
            });
        }
    }

    self.retailPayments = function () {
        return Enumerable.From(self.dispatchFactory.deliveryGroups()).Select(function (x) {
            return {
                basketSplitId: x.deliveryGroup.basketSplitId,
                payments: Enumerable.From(x.retailPaymentEntries()).Select(function (y) {
                    return y.toJS()
                }).ToArray()
            }
        }).ToArray();
    }

    self.saveRetailFromPaymentModal = function () {
        self.validateRetailNow(true);
        self.retailPaymentErrors.showAllMessages(false);
        if (self.retailPaymentErrors().length) {
            console.log('orderFactory validateRetailPayment failure');
            self.retailPaymentErrors.showAllMessages(true);
            self.retailPaymentErrors.filter(function (x) {
                x.isValid.notifySubscribers(x.isValid());
            });
        } else {
            console.log('orderFactory validateRetailPayment success');
            self.saveRetail(function () {
                $.info('Thank you', 'Payment details were successfully saved.');
                self.parent.memberBasketFetcher.cancelRetailPaymentModal();
            });
        }
    }

    self.saveRetail = function (onComplete) {
        var data = {
            basketId: self.basketId(),
            retailTillNumber: self.retailTillNumber(),
            retailSessionNumber: self.retailSessionNumber(),
            retailPayments: self.retailPayments()
        };
        self.busy(true);
        self.busyMessage('Saving Retail Payment Information...');
        console.log('orderFactory saveRetail calling with', data);
        $.ajax({
            url: '/api/orderproducts/saveBasketRetailParameters',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                self.busy(false);
                if (data === true) {
                    if (typeof onComplete === 'function')
                        onComplete();
                }
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    self.submitOrder = function () {

        self.saveBasketReview(function () {

            $.confirm('Are you sure?', 'This will submit your basket to a queue where it will await submission to Mertex.', function () {

                self.busy(true);

                self.busyMessage('Submitting Order...');

                var data = {
                    basketId: self.basketId()
                }

                console.log('orderFactory submitOrder calling with', data);

                $.ajax({
                    url: '/api/componentapi/SubmitBasket',
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    success: function (data) {
                        // what do we want to do here... well, reset... then hide the component?
                        console.log('orderFactory submitBasket returned', data);

                        // This feeds the grid in submitted-basket-modal
                        self.basketSubmissionResults(data.SubmissionResults);

                        self.submissionResultText(
                            '<ul>' + data.processingResults.map(function (val) {
                                let result = '';
                                let keys = Object.keys(val);
                                for (var i = 0; i < keys.length; i++) {
                                    if (val[keys[i]] != null) {
                                        if (keys[i] === 'WarningMessage') {
                                            result += '<li><span class="text-danger">' + val[keys[i]] + '</span></li>';
                                        } else {
                                            result += '<li>' + val[keys[i]] + '</li>';
                                        }
                                    }
                                }
                                return result
                            }).join('') + '</ul>');

                        $('#submitted-basket-modal').modal('show');

                    },
                    error: function (xhr, s, a) {
                        self.busy(false);
                        $.ajaxSettings.error(xhr, s, a);
                    }
                });
            }, null);
        });
    };
    // Retail Functions

    self.fetchRetailTillSessions = function (tillNumber) {
        self.retailBusy(true);
        var data = {
            retailTillNumber: tillNumber
        };
        console.log('orderFactory calling fetchRetailTillSessions with', data);
        $.ajax({
            url: '/api/orderproducts/FetchRetailTillSessions',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('orderFactory fetchRetailTillSessions returned', data);
                self.retailBusy(false);
                self.availableRetailTillSessions(data.sessions);
                if (data.sessions.length == 1) {
                    window.setTimeout(function () {
                        self.retailSessionNumber(data.sessions[0].SessionNumber);
                    }, 0);
                }
            },
            function(xhr, s, a) {
                self.busy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    self.fetchRetailTills = function (onComplete) {
        self.busy(true);
        var data = {
            basketId: self.basketId()
        };
        console.log('orderFactory calling fetchRetailTillwith', data);
        $.ajax({
            url: '/api/orderproducts/FetchRetailTills',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('orderFactory fetchRetailTills returned', data);
                self.busy(false);

                var tillNo = self.retailTillNumber();

                self.availableRetailTills(data.tills);

                window.setTimeout(function () {
                    self.retailTillNumber(tillNo);
                }, 10);

                ko.utils.arrayForEach(data.basketGroupPaymentInfo, function (payInfo) {
                    var deliveryGroup = Enumerable.From(self.dispatchFactory.deliveryGroups()).Where(function (x) {
                        return x.deliveryGroup.basketSplitId == payInfo.BasketSplitID
                    }).Single();

                    deliveryGroup.retailTotalPayable(payInfo.TotalPayableIncVAT);

                    var payments = [];

                    if (payInfo.retailPayments) {
                        ko.utils.arrayForEach(payInfo.retailPayments, function (p) {
                            payments.push(retailPaymentEntry({
                                record: {
                                    basketSplitId: payInfo.basketSplitId,
                                    retailPaymentMax: deliveryGroup.retailRemainingPayable
                                },
                                loadedValue: {
                                    paymentTypeId: p.paymentTypeId,
                                    paymentAmount: p.paymentAmount,
                                    paymentReference: p.paymentReference
                                },
                                parent: self
                            }));
                        });
                    }

                    deliveryGroup.retailPaymentEntries(payments);
                });

                if (typeof onComplete === 'function')
                    onComplete();
            },
            function(xhr, s, a) {
                self.busy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    // End of Retail Functions

    // #endregion

    $('#order-products-modal').on('shown.bs.modal', function () {
        self.basketLocker.hide();
        window.setTimeout(function () {
            self.basketLocker.hide();
            if (self.parent.hasOwnProperty('memberBasketFetcher')) {
                self.parent.memberBasketFetcher.busy(false);
            }
        }, 300);
    });
    $('#order-products-modal').on('hide.bs.modal', function () {
        window.setTimeout(function () {
            if (self.parent.hasOwnProperty('memberBasketFetcher')) {
                self.parent.memberBasketFetcher.busy(false);
            }
        }, 300);
    });
    $('#retail-payment-modal').on('shown.bs.modal', function () {
        self.basketLocker.hide();
        window.setTimeout(function () {
            self.basketLocker.hide();
            if (self.parent.hasOwnProperty('memberBasketFetcher')) {
                self.parent.memberBasketFetcher.busy(false);
            }
        }, 300);
    });
};

var searchResult = function (data, parent, patternBookSaturation) {
    var self = this;

    self.searchResult = true;

    self.basketItemTypeId = BASKETITEM_TYPE_STANDARD;

    switch (data.ProductFilterID) {
        case 2: //Bespoke Fabric Hangers
            self.basketItemTypeId = BASKETITEM_TYPE_BESPOKEHANGER;
            // or is it BASKETITEM_TYPE_BESPOKESHELFSAMPLE ? we'll only ever know that by clicking the button
            // therefore clicking the button MUST overwrite this value... Ugh. Horrible.
            break;
        case 3: //Bespoke Rugs
        case 68: //Bespoke Runners
            self.basketItemTypeId = BASKETITEM_TYPE_BESPOKERUG;
            break;
        case 4: //Bespoke Fabric Showlengths
            self.basketItemTypeId = BASKETITEM_TYPE_BESPOKESHOWLENGTH;
            break;
        case 9: //Bespoke Furniture Headers
            self.basketItemTypeId = BASKETITEM_TYPE_BESPOKEFURNITURE;
            break;
        case 50: //Bespoke Wallpaper Showlengths
            self.basketItemTypeId = BASKETITEM_TYPE_BESPOKEWALLPAPERSHOWLENGTH;
            break;
        case 117:
            self.basketItemTypeId = BASKETITEM_TYPE_BESPOKEARCHITECTRING;
            break;
    }

    self.originalBasketItemTypeId = self.basketItemTypeId;

    self.patternBookSaturation = patternBookSaturation;

    self.parent = parent;

    self.record = data;

    if (self.record.Currency) {
        //noop
    } else {
        self.record.Currency = self.parent.tradeAccount().Currency;
    }

    self.backOrder = ko.observable(false);

    self.productPageId = data.ProductPageID;

    self.bespokeProduct = data.BespokeProduct;

    self.stockData = data.StockData;

    self.purchaseOrderLineNumber = {
        label: 'Purchase Order Line Reference',
        observable: ko.observable().extend({
            required: {
                params: true,
                message: 'You must provide a Purchase Order Line Identifier'
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        }
    };

    self.ean = ko.pureComputed(function () {
        if (self.record.EAN) {
            return `<span class="pull-right">
                    EAN: ${self.record.EAN}
                </div>`
        } else {
            return ``
        }
    }, self);

    self.productFilterOptions = ko.computed({
        read: function () {
            var result = Enumerable.From(self.parent.completeProductFilterSet()).Where(function (x) {
                return x.ProductFilterID == self.record.ProductFilterID;
            }).SingleOrDefault();
            if (result == null) {
                return {};
                //if (!$('#info-modal').is(':visible')) {
                //    $.info('Sorry', 'There was a problem fetching Product Filter data. Closing this box will retry the operation.', function () { }, function () {
                //        self.parent.refreshProductFilterButtons();
                //    });
                //}
            } else {
                return result;
            }
        }
    }, self);

    self.validateNow = ko.observable(false);

    self.estimatedPackageWeight = ko.pureComputed(function () {
        if (self.record.NetWeight != null)
            return (self.record.NetWeight * self.quantity()).toFixed(1) + 'KG';
        else
            return 'Unknown';
    }, self);

    self.forwardOrderDate = ko.observable();

    self.forwardOrderDateOptions = {
        locale: 'en-gb',
        format: 'DD/MM/YYYY',
        ignoreReadonly: true,
        showClear: true,
        allowInputToggle: true,
        sideBySide: true,
        useCurrent: true,
        minDate: new moment().add(2, 'day').toDate(),
        showClose: true,
        keepInvalid: true
    };

    self.dateRequired = {
        label: 'Forward Order',
        observable: ko.observable(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        readOnly: true,
        clearFunction: function () {
            this.observable(undefined);
        },
        disabled: self.productFilterOptions() ? !self.productFilterOptions().AllowForwardOrders : false,
        dateTimePickerOptions: {
            locale: 'en-gb',
            format: 'DD/MM/YYYY',
            ignoreReadonly: true,
            showClear: true,
            allowInputToggle: true,
            sideBySide: true,
            useCurrent: false,
            minDate: new moment().add(1, 'day').toDate(),
            disabledDates: [0, 6],
            showClose: true,
            keepInvalid: true,
            debug: false
        }
    };


    self.lineReference = {
        label: 'Line Reference',
        observable: ko.observable(self.parent.orderReference.observable()),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 24
        }
    };

    self.allFulfilmentOptions = ko.observableArray([]);

    self.fetchFulfilmentOptions = function () {
        if (self.parent.tradeAccount()) {
            var data = {
                basketId: self.parent.basketId(),
                productId: self.record.ProductID,
                tradeAccountId: self.parent.tradeAccount().TradeAccountID
            };

            console.log('searchResult fetchFulfilmentOptions calling with', data);

            $.ajax({
                url: '/api/componentapi/FetchFulfilmentOptions',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('searchResult fetchFulfilmentOptions returned', data);
                    self.allFulfilmentOptions(data);
                },
                error: function (xhr, s, a) {
                    $.showError(xhr, s, a);
                }
            });
        }
    }

    self.availableFulfilmentOptions = ko.pureComputed({
        read: function () {
            if (self.allFulfilmentOptions().length) {
                return Enumerable.From(self.allFulfilmentOptions()).Where(function (x) {
                    return x.ProductFilterFulfilmentGroupID == self.record.ProductFilterFulfilmentGroupID &&
                        x.Preference == 1
                }).ToArray();
            } else {
                return Enumerable.From(self.parent.allFulfilmentOptions()).Where(function (x) {
                    return x.ProductFilterFulfilmentGroupID == self.record.ProductFilterFulfilmentGroupID &&
                        x.Preference == 1
                }).ToArray();
            }
        }
    }, self);

    self.availableFulfilmentOptions.subscribe(function (newValues) {
        //console.log('availableFulfilmentOptions subscribe hit', newValues);

        //if (self.fulfilmentOption() == undefined) {
        // this works nicely, it sets the default stockLocation if there is none selected...
        if (newValues.length) {
            window.setTimeout(function () {
                self.fulfilmentOption(Enumerable.From(newValues).Where(function (x) {
                    return x.ProductFilterFulfilmentGroupID == self.record.ProductFilterFulfilmentGroupID &&
                        x.SortOrder == 1
                }).Single());
            }, 0);
        } else {
            self.fulfilmentOption(undefined);
        }
        //} else {
        //    // it's possible that the previously selected stockLocation may no longer be valid for this product
        //    // this can happen at any time
        //    // so if the selected location is no longer in the list of availables... select the default.

        //    // this doesn't work so nicely: it UNSETS if there was previously one set!

        //    var toSet = Enumerable.From(newValues).Where(function (x) {
        //        return x.Preference == self.fulfilmentOption().Preference
        //    }).FirstOrDefault();

        //    if (toSet) {
        //        window.setTimeout(function () {
        //            self.fulfilmentOption(toSet);
        //        }, 0);
        //        // noop
        //    } else {
        //        // this is never being hit, which means it's always finding the appropriate stockLocationId
        //        // . . . ...
        //        if (newValues.length) {
        //            window.setTimeout(function () {
        //                var fo = Enumerable.From(newValues).Where(function (x) {
        //                    return x.ProductFilterFulfilmentGroupID == self.record.ProductFilterFulfilmentGroupID &&
        //                        x.Preference == 1
        //                }).ToArray();

        //                if (fo.length > 1) {
        //                    console.error('failed to set default fulfilmentOption: too many', self, fo);
        //                } else if (fo.length == 1) {
        //                    self.fulfilmentOption(fo);
        //                } else {
        //                    console.error('failed to set default fulfilmentOption: too few', self, fo);
        //                }
        //                if (fo == null)
        //                    console.error('orderFactory searchResult failed to find any fulfilmentOption', self);
        //            }, 0);
        //        }
        //    }
        //}
        //if (self.defaultStockLocation()) {
        //    self.stockLocation(self.defaultStockLocation());
        //} else {
        //    self.stockLocation(undefined);
        //}
    });

    self.fulfilmentOption = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'Required'
        }
    });

    self.quantity = ko.observable((data.Quantity || 1).toFixed(self.productFilterOptions() ? self.productFilterOptions().QuantityPrecision : 1)).extend({
        roundedNumeric: self.productFilterOptions() ? self.productFilterOptions().QuantityPrecision : 1
    }).extend({
        validation: {
            validator: function (val, params) {
                if (self.validateNow())
                    return +val > +params;
                else
                    return true;
            },
            message: ' ',
            params: 0
        }
    });

    self.errors = ko.validation.group([
        self.fulfilmentOption,
        self.quantity
    ]);

    self.requestPOLineNumber = function () {
        $('#purchase-order-line-number-modal').modal('show');
    }

    self.closeRequestingPOLineNumber = function () {
        if (self.hasOwnProperty('addBasketPromise')) {
            delete self.addBasketPromise;
            self.parent.addingBasketItem(false);
        }
        $('#purchase-order-line-number-modal').modal('hide');
    }

    self.progressFromRequestingPOLineNumber = function () {
        self.validateNow(true);
        window.setTimeout(function () {
            if (self.purchaseOrderLineNumber.observable.isValid()) {
                $('#purchase-order-line-number-modal').modal('hide');
                Promise.resolve(self.addBasketPromise()).then(function () {
                    self.parent.searchResultRequestingPOLineNumber(undefined);
                });
            } else {
                self.purchaseOrderLineNumber.observable.isValid.notifySubscribers(false);
            }
        }, 0)
    }

    self.supplierBusy = ko.observable(false);

    self.validateSupplierNow = ko.observable(false);

    self.availableSuppliers = ko.observableArray([]);

    self.selectedSupplierCode = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateSupplierNow();
            },
            message: ' '
        }
    });

    self.supplierCountry = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateSupplierNow();
            },
            message: ' '
        }
    });

    // tell me again, why do I need a separate variable to hold just the ID? 
    // what's the freaking point of that? what?!
    self.supplierCountryId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateSupplierNow();
            },
            message: ' '
        }
    });

    self.availableSuppliersList = {
        label: 'Select Supplier',
        observable: self.selectedSupplierCode,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        options: self.availableSuppliers,
        optionsText: 'label',
        optionsValue: 'code',
        optionsCaption: ' ',
        width: 'auto',
        showClear: true,
        onSelect: function () {

        },
        clearFunction: function () {
            self.selectedSupplier(undefined);
        }
    };

    self.selectedSupplier = ko.pureComputed(function () {
        if (self.selectedSupplierCode()) {
            return Enumerable.From(self.availableSuppliers()).Where(function (x) {
                return x.code == self.selectedSupplierCode()
            }).Single();
        }
    }, self)

    self.supplierErrors = ko.validation.group([
        self.selectedSupplierCode
    ]);

    //self.fulfilmentOption.subscribe(function (newValue) {
    self.supplierDetailFetch = function () {
        //if (newValue) {
        //if (newValue.FulfilmentTypeID == 5) { // Direct Dispatch

        // This can no longer occur here. This must occur only when the user has clicked Order [addBasketItem]

        // stop! supplier time!
        $('#supplier-modal').modal('show');
        self.supplierBusy(true);
        var data = {
            code: self.record.Code
        };
        console.log('searchResult calling fetchSuppliers with', data);
        $.ajax({
            url: '/api/componentapi/FetchSupplierDetails',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('searchResult fetchSuppliers returned', data);

                self.availableSuppliers($.map(data, function (supplier) {
                    var item = {
                        code: supplier.Code,
                        label: supplier.Code + ' - ' + supplier.Name,
                        address: new addressViewModel({
                            labelClass: 'delivery-address-label',
                            controlClass: 'form-control mdc-text-field__input',
                            validateNow: self.validateSupplierNow,
                            emailValidation: true,
                            phoneIntlMobile: true
                        }),
                        value: supplier.Code
                    };
                    item.address.phone.visible(true);
                    item.address.email.visible(true);
                    item.addressToLoad = supplier;

                    return item;
                }));

                self.supplierBusy(false);
            },
            error: function (xhr, s, a) {
                self.supplierBusy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        })
        //}
        //}
    };

    self.selectedSupplier.subscribe(function (newValue) {
        //set the country
        if (newValue) {
            self.selectedSupplier().address.loadBasketMiscAddress(newValue.addressToLoad);
            window.setTimeout(function () { // give it some time to get the address sorted out...
                self.supplierErrors = ko.validation.group([
                    self.selectedSupplierCode,
                    self.selectedSupplier().address
                ], {
                    deep: true
                });
            }, 0);
        } else {
        }
    });

    self.requestQuantity = function () {
        $('#quantity-modal').modal('show');
    }

    self.closeRequestingQuantity = function () {
        self.quantity(1);
        if (self.hasOwnProperty('addBasketPromise')) {
            delete self.addBasketPromise;
            self.parent.addingBasketItem(false);
        }
        $('#quantity-modal').modal('hide');
    }

    self.progressFromRequestingQuantity = function () {
        self.validateNow(true);
        window.setTimeout(function () {
            if (self.quantity.isValid()) {
                $('#quantity-modal').modal('hide');
                Promise.resolve(self.addBasketPromise()).then(function () {
                    self.parent.searchResultRequestingQuantity(undefined);
                    delete self.addBasketPromise;
                });
            } else {
                self.quantity.isValid.notifySubscribers(false);
            }
        }, 0)
    }

    self.progressFromSupplier = function () {
        self.validateSupplierNow(true);
        window.setTimeout(function () { // maybe give it a bit of time to think about life...
            if (self.supplierErrors().length > 0) {
                self.supplierErrors.showAllMessages(true);
                self.selectedSupplierCode.isValid.notifySubscribers(self.selectedSupplierCode.isValid());
                if (self.selectedSupplier()) {
                    self.selectedSupplier().address.notifySubscribers();
                    if (self.selectedSupplier().address.phone.observable.hasOwnProperty('intlTel')) {
                        if (self.selectedSupplier().address.phone.observable.intlTel.getNumber()) {
                            if (!self.selectedSupplier().address.phone.observable.intlTel.isValidNumber()) {
                                self.selectedSupplier().address.phone.observable.isValid.notifySubscribers(false);
                            }
                        }
                    }
                }
            } else {
                if (self.selectedSupplier().address.phone.observable.hasOwnProperty('intlTel')) {
                    if (self.selectedSupplier().address.phone.observable.intlTel.getNumber()) {
                        if (!self.selectedSupplier().address.phone.observable.intlTel.isValidNumber()) {
                            self.selectedSupplier().address.phone.observable.isValid.notifySubscribers(false);
                            return false;
                        }
                    }
                }
                // disco!
                $('#supplier-modal').modal('hide');

                Promise.resolve(self.addBasketPromise()).then(function () {
                    self.supplierErrors = ko.validation.group([
                        self.selectedSupplierCode
                    ]);
                    if (self.selectedSupplier())
                        self.selectedSupplier().address.reset();
                    self.selectedSupplierCode(undefined);
                    self.parent.searchResultRequestingSupplier(undefined);

                    delete self.addBasketPromise;
                });
                // probably... tell the user what supplier and supplier country they selected
                // do some other stuff.
            }
        }, 0);
    }

    self.closeSupplier = function () {
        self.supplierErrors = ko.validation.group([
            self.selectedSupplierCode
        ]);
        if (self.selectedSupplier())
            self.selectedSupplier().address.reset();
        self.selectedSupplierCode(undefined);
        if (self.hasOwnProperty('addBasketPromise')) {
            delete self.addBasketPromise;
            self.parent.addingBasketItem(false);
        }
        $('#supplier-modal').modal('hide');
    }
    self.sufficientStockAvailable = ko.pureComputed(function () {
        var totalAvailable = 0;
        if (self.stockData.StockLocationA.Available != null)
            totalAvailable += self.stockData.StockLocationA.Available;
        if (self.stockData.StockLocationB.Available != null)
            totalAvailable += self.stockData.StockLocationB.Available;
        if (self.quantity()) {
            return totalAvailable >= self.quantity();
        } else {
            return false;
        }
    }, self);

    self.estimatedDispatchDate = ko.observable(new moment().add(1, 'day'));

    self.timeSensitiveDispatchDate = ko.pureComputed(function () {
        if (self.dateRequired.observable()) {
            return self.dateRequired.observable().format('DD/MM/YYYY');
        }
        if (self.sufficientStockAvailable()) {
            if (new Date().getHours() >= 12) {
                return new moment().add(1, 'day').format('DD/MM/YYYY');
            } else {
                return new moment().format('DD/MM/YYYY')
            }
        } else {
            return 'TBC';
        }
    }, self);

    self.stockStatus = ko.pureComputed(function () {

        //if (self.parent.searchWidgetValue() == 'Paint' || self.parent.searchWidgetValue() == 'PaintSamplePot') {
        //    if (self.record.FreeStock == 999) {
        //        return 'Mixed to Order';
        //    }
        //}

        if (self.productFilterOptions().StockMessageOverride) {
            return self.productFilterOptions().StockMessageOverride;
        }

        var prefix = "";

        if (self.parent.searchWidgetValue() == 'FabricCutting' || self.parent.searchWidgetValue() == 'FabricReturnable') {

            var type = "Cuttings";

            if (self.parent.searchWidgetValue() == 'FabricReturnable') {
                type = "Returnables";
            }

            if (self.record.ParentStockStatus) {
                if (self.record.ParentStockStatus.indexOf('Due') > -1) {
                    if (self.record.ParentFreeStock == 0) {
                        prefix = type + ' Out of Stock (' + self.record.ParentPOFreeStock + self.record.Units + ' ' + self.record.ParentStockStatus + ')' + ', ';
                    } else {
                        prefix = self.record.ParentFreeStock + self.record.Units + ' (' + self.record.ParentPOFreeStock + self.record.Units + ' ' + self.record.ParentStockStatus + ')' + ', ';
                    }
                } else {
                    prefix = self.record.ParentFreeStock + ' ' + type + ' ' + self.record.ParentStockStatus + '<br/>Main Product: ';
                }
            }
        }

        if (self.record.StockStatus) {
            if (self.record.StockStatus.indexOf('Due') > -1) {
                if (self.record.FreeStock == 0) {
                    return prefix + 'Out of Stock (' + self.record.POFreeStock + self.record.Units + ' ' + self.record.StockStatus + ')';
                } else {
                    return prefix + self.record.FreeStock + self.record.Units + ' (' + self.record.POFreeStock + self.record.Units + ' ' + self.record.StockStatus + ')';
                }
            } else {
                return prefix + self.record.FreeStock + self.record.Units + '  ' + self.record.StockStatus;
            }
        }
    });

    self.basketQuantity = ko.pureComputed({
        read: function () {
            var value = Enumerable.From(self.parent.basket())
                .Where(function (x) {
                    return (x.ProductID == self.record.ProductID);// &&
                    //(x.OrderOrderTypeID == self.parent.display());
                })
                .Select(function (x) {
                    return Number(x.Quantity);
                })
                .Sum();
            return formatNumber(value, self.productFilterOptions() ? self.productFilterOptions().QuantityPrecision : 1, 'en-GB');;
        }
    }, self);

    self.quantityDisplay = ko.pureComputed(function () {
        if (self.basketQuantity()) {
            return '(' + self.basketQuantity() + ' ' + self.record.Units + ' in your basket)'
        }
    }, self);

    self.quantity.subscribe(function (newValue) {
        console.log('quantity', newValue);
    });

    self.quantityHasFocus = ko.observable(false);

    self.quantityHasFocus.subscribe(function (focus) {
        if (focus) {
            //if (self.quantity() == 0) {
            self.quantity(undefined);
            //}
            $(self.quantity.DOMElement).select();
        } else {
            if (self.quantity() == null) {
                self.quantity((self.record.Quantity || 1).toFixed(self.productFilterOptions() ? self.productFilterOptions().QuantityPrecision : 1))
            }
        }
    });

    self.discount = ko.pureComputed({
        read: function () {
            return 0;
        },
        write: function (value) {
        }
    }, self);

    self.price = ko.pureComputed({
        read: function () {
            var listPrice = self.record.ListPrice;
            var price = self.record.FinalPrice;

            if (self.discount()) {
                price *= (1 - (self.discount() / 100));
            }

            var result = {
                list: listPrice,
                original: self.record.FinalPrice,
                final: price,
                rrp: self.record.RRP
            }

            result.rrpDisplay = ko.pureComputed(function () {
                if (result.rrp) {
                    if (self.productFilterOptions()) {
                        if (self.productFilterOptions().ProductFilterID == 3 && self.productFilterOptions().ProductFilterID == 3) {
                            return 'Unit Price per SQM ' + formatCurrency(result.rrp, 2, self.record.Currency.FormattingCulture, self.record.Currency.ISO_4217)
                        }
                    }
                    // this needs, for bespoke rugs, to read "Unit Price per Square Metre"
                    return 'RRP: ' + formatCurrency(result.rrp, 2, self.record.Currency.FormattingCulture, self.record.Currency.ISO_4217)
                }
            }, result)

            return result
        }
    }, self);

    self.priceDisplay = ko.pureComputed({
        read: function () {
            var result = '';

            var price = self.price();

            if (price.list != price.original) {
                result += '<span class="price-strike">' + formatCurrency(price.list, 2, self.record.Currency.FormattingCulture, self.record.Currency.ISO_4217) + '</span>';
            }

            if (price.original > 0) {
                if (price.original == price.final) {
                    result += '<span>' + formatCurrency(price.original, 2, self.record.Currency.FormattingCulture, self.record.Currency.ISO_4217) + '</span>';
                } else {
                    if (price.final > 0) {
                        result += '<span>' + formatCurrency(price.final, 2, self.record.Currency.FormattingCulture, self.record.Currency.ISO_4217) + '</span>';
                    } else {
                        result += '<span>FREE</span>';
                    }
                }
            } else {
                result = '<span>FREE</span>';
            }

            if (self.record.Code == 'BESPOKE/FURNITURE/PLACEHOLDER')
                result = '<span>TBC</span>';

            return result;
        }
    });

    self.rrpDisplay = ko.pureComputed(function () {
        if (self.productFilterOptions())
            if (self.productFilterOptions().DisplayRRP) {
                return formatCurrency(self.price().rrp, 2, self.record.Currency.FormattingCulture, self.record.Currency.ISO_4217);
            }
    }, self);

    self.tagDisplay = ko.pureComputed(function () {
        var result = '';
        if (self.record.Tag) {
            result = `<span class="product-tag">${self.record.Tag}</span>`;
        }
        return result;
    }, self);

    self.patternBookSaturationDisplay = function () {
        if (self.patternBookSaturation) {
            var dl = $('<dl class="dl-horizontal margin-bottom-0"></dl>');

            $('<dt>Last Purchased</dt><dd>' + moment(self.patternBookSaturation.LastPurchasedDT).format('DD/MM/YYYY') + '</dd>').appendTo(dl);

            $('<dt>Last Order No.</dt><dd>' + self.patternBookSaturation.LatestOrderHeadID + '</dd>').appendTo(dl);

            $('<dt>Quantity</dt><dd>' + self.patternBookSaturation.Quantity + '</dd>').appendTo(dl);

            return $(dl).prop('outerHTML');
        }
    }

    self.buildBespokeWaterfallDisplayLine = function (x) {
        return `<img class='thumb' src="https://www.designersguild.com/image/239/${x.value.ImageID}" title="${x.value.Code}" /><span class="margin-left-15">${x.label}</span>`;
    }

    self.reset = function () {
        self.quantity(1);
        self.dateRequired.observable(undefined);
        self.fulfilmentOption(Enumerable.From(self.availableFulfilmentOptions()).Where(function (x) {
            return x.ProductFilterFulfilmentGroupID == self.record.ProductFilterFulfilmentGroupID &&
                x.SortOrder == 1
        }).SingleOrDefault());
        self.lineReference.observable(self.parent.orderReference.observable());
        self.backOrder(false);
        self.basketItemTypeId = self.originalBasketItemTypeId;
        self.validateSupplierNow(false);
        self.supplierBusy(false);
        self.supplierErrors = ko.validation.group([
            self.selectedSupplierCode
        ]);
        if (self.selectedSupplier()) {
            self.selectedSupplier().address.reset();
        }
        self.selectedSupplierCode(undefined);
        self.availableSuppliers([]);
        self.supplierCountry(undefined);
        self.supplierCountryId(undefined);
        self.record.BespokeFurnitureJSON = undefined;
        self.purchaseOrderLineNumber.observable(undefined);
    }

    self.fetchQuote = function () {
        let url = '/api/orderproducts/FetchBespokeFurnitureQuotePDF';
        var data = {
            basketItemId: self.record.BasketItemID,
            json: self.record.BespokeFurnitureJSON
        }
        console.log('bespokeFurnitureFactory calling fetchQuote with', data);
        if (window.fetch) {
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.BearerToken
                }
            }).then(function (response) {
                return response.blob();
            }).then(function (blob) {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'Designers-Guild-Furniture-Quote.pdf';
                link.click();
            });
        } else {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            //Now set response type
            xhr.responseType = 'arraybuffer';
            xhr.addEventListener('load', function () {
                if (xhr.status === 200) {
                    //console.log(xhr.response) // ArrayBuffer
                    var blob = new Blob([xhr.response]); // Blob
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = 'Designers-Guild-Furniture-Quote.pdf';
                    link.click();
                } else {
                    console.error(xhr.response);
                }
            })
            xhr.send(data);
        }
    }
}

// DEFUNCT 16/10/2019 - please remove all uses of basketProduct
var basketProduct = function (type, parent, source, display, quantity, discount, quantityPrecision) {
    var self = this;

    self.validateNow = ko.observable(true);

    self.type = type;

    self.parent = parent;

    self.record = source;

    self.productFilterId = self.record.ProductFilterID;

    self.availableStockLocationFulfilmentOptions = ko.pureComputed({
        read: function () {
            return Enumerable.From(self.parent.allStockFulfilmentOptions()).Where(function (x) {
                return x.ProductFilterID == self.productFilterId
            }).GroupBy(function (result) {
                return {
                    stockLocationId: result.StockLocationID,
                    code: result.StockLocationCode,
                    name: result.StockLocationName,
                    isDefault: result.Default
                }
            }, function (stockLocation) {
                return stockLocation
            }, function (key, stockLocationGrouping) {
                return {
                    key,
                    fulfilmentOptions: stockLocationGrouping.source
                }
            }, function (stockLocation) {
                return stockLocation.stockLocationId
            }).ToArray();
        }
    }, self);

    self.availableFulfilmentOptions = ko.pureComputed({
        read: function () {

            var stockLocation = self.stockLocation();

            if (stockLocation != null) {
                console.log('availableFulfilmentOptions subscribe hit', stockLocation.fulfilmentOptions)
                return stockLocation.fulfilmentOptions;
            }
            else
                return [];
        }
    }, self);

    self.availableStockLocationFulfilmentOptions.subscribe(function (newValues) {
        console.log('availableStockLocationFulfilmentOptions subscribe hit', newValues);

        if (self.stockLocation() == undefined) {
            // this works nicely, it sets the default stockLocation if there is none selected...
            if (newValues.length) {
                window.setTimeout(function () {
                    self.stockLocation(Enumerable.From(newValues).Where(function (x) {
                        return x.key.isDefault == true
                    }).Single());
                }, 0);
            }
        } else {
            // it's possible that the previously selected stockLocation may no longer be valid for this product
            // this can happen at any time
            // so if the selected location is no longer in the list of availables... select the default.

            // this doesn't work so nicely: it UNSETS if there was previously one set!

            var toSet = Enumerable.From(newValues).Where(function (x) {
                return x.key.stockLocationId == self.stockLocation().key.stockLocationId
            }).SingleOrDefault();

            if (toSet) {
                window.setTimeout(function () {
                    self.stockLocation(toSet);
                }, 0);
                // noop
            } else {
                // this is never being hit, which means it's always finding the appropriate stockLocationId
                // . . . ...
                if (newValues.length) {
                    window.setTimeout(function () {
                        self.stockLocation(Enumerable.From(newValues).Where(function (x) {
                            return x.key.isDefault == true
                        }).Single());
                    }, 0);
                }
            }
        }
        //if (self.defaultStockLocation()) {
        //    self.stockLocation(self.defaultStockLocation());
        //} else {
        //    self.stockLocation(undefined);
        //}
    });

    self.stockLocation = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'Stock Location and Fulfilment Option are required'
        }
    });

    self.stockLocation.subscribe(function (newValue) {
        console.log('stockLocation subscribe hit', newValue);
        if (newValue) {
            var fo = Enumerable.From(newValue.fulfilmentOptions).Where(function (x) {
                return x.Priority == 1
            }).SingleOrDefault();
            if (fo) {
                window.setTimeout(function () {
                    self.fulfilmentOption(fo);
                }, 0);
            }
        } else {
            self.fulfilmentOption(undefined);
        }
    });

    self.fulfilmentOption = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: ' '
        }
    });

    self.errors = ko.validation.group([
        self.stockLocation,
        self.fulfilmentOption
    ]);

    //self.stockLocationParams = {
    //    observable: self.stockLocation,
    //    label: '', // do we want a label, or an options caption... or both...?
    //    useNativeValidation: false,
    //    decorateInputElement: false,
    //    insertValidationMessages: false,
    //    options: self.availableStockLocations,
    //    optionsText: 'code',
    //    optionsValue: 'stockLocationId',
    //    optionsCaption: ''
    //};

    self.productFilterOptions = ko.computed({
        read: function () {
            var result = Enumerable.From(self.parent.completeProductFilterSet()).Where(function (x) {
                return x.ProductFilterID == self.record.ProductFilterID;
            }).SingleOrDefault();

            if (result == null) {
                return {};
                //if (!$('#info-modal').is(':visible')) {
                //    $.info('Sorry', 'There was a problem fetching Product Filter data. Closing this box will re-try the operation.', function () { }, function () {
                //        self.parent.refreshProductFilterButtons();
                //    });
                //}
            } else {
                return result;
            }
        }
    }, self);

    self.listPrice = ko.observable(self.record.ListPrice);
    self.finalPrice = ko.observable(self.record.FinalPrice);
    self.rrp = ko.observable(self.record.RRP);
    self.freeStock = ko.observable(self.record.FreeStock);
    self.poFreeStock = ko.observable(self.record.POFreeStock);
    self.poDueDate = ko.observable(self.record.PODueDate);
    self.stockStatusId = ko.observable(self.record.StockStatusID);
    self.stockStatus = ko.observable(self.record.StockStatus);

    self.parentStockStatus = ko.observable(self.record.ParentStockStatus);
    self.parentFreeStock = ko.observable(self.record.ParentFreeStock);
    self.parentPOFreeStock = ko.observable(self.record.ParentPOFreeStock);

    self.stockStatusDisplay = ko.pureComputed(function () {
        if (self.productFilterOptions())
            if (self.productFilterOptions().StockMessageOverride) {
                return self.productFilterOptions().StockMessageOverride;
            }

        var freeStock = self.freeStock();

        //if (self.parent.searchWidgetValue() == 'Paint' || self.parent.searchWidgetValue() == 'PaintSamplePot') {
        //    if (freeStock == 999) {
        //        return 'Mixed to Order';
        //    }
        //}

        var prefix = "";

        if (self.parent.searchWidgetValue() == 'FabricCutting' || self.parent.searchWidgetValue() == 'FabricReturnable') {

            var type = "Cuttings";

            if (self.parent.searchWidgetValue() == 'FabricReturnable') {
                type = "Returnables";
            }

            // TBC: what are we going to do about parentStockStatus from fetchBasket

            if (self.parentStockStatus()) {
                if (self.parentStockStatus().indexOf('Due') > -1) {
                    if (self.parentFreeStock() == 0) {
                        prefix = type + ' Out of Stock (' + self.parentPOFreeStock() + self.record.Units + ' ' + self.parentStockStatus() + ')' + ', ';
                    } else {
                        prefix = self.parentFreeStock() + self.record.Units + ' (' + self.parentPOFreeStock() + self.record.Units + ' ' + self.parentStockStatus() + ')' + ', ';
                    }
                } else {
                    prefix = self.parentFreeStock() + ' ' + type + ' ' + self.parentStockStatus() + '<br/>Main Product: ';
                }
            }
        }

        if (self.stockStatus()) {
            if (self.stockStatus().indexOf('Due') > -1) {
                if (self.freeStock() == 0) {
                    return prefix + 'Out of Stock (' + self.poFreeStock() + self.record.Units + ' ' + self.stockStatus() + ')';
                } else {
                    return prefix + self.freeStock() + self.record.Units + ' (' + self.poFreeStock() + self.record.Units + ' ' + self.stockStatus() + ')';
                }
            } else {
                return prefix + self.freeStock() + self.record.Units + '  ' + self.stockStatus();
            }
        }
    });

    self.display = display;

    self.discount = ko.observable(discount).extend({
        minValue: {
            params: 0,
            message: ' '
        },
        maxValue: {
            params: 100,
            message: ' '
        }
    });

    self.discountReason = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.discount() > 0
            },
            message: 'Please specify a reason for this discount'
        }
    });

    self.discountCommentRequired = ko.computed(function () {
        if (self.discountReason()) {
            return Enumerable.From(self.parent.discountReasons()).Where(function (x) {
                return x.DiscountReasonID == self.discountReason()
            }).Select('$.CommentRequired').Single();
        }
    }, self);

    self.discountComment = ko.observable().extend({
        required: {
            params: true,
            onlyIf: self.discountCommentRequired,
            message: 'Please specify a reason for this discount'
        }
    });

    self.quantityPrecision = typeof quantityPrecision === 'undefined' ? self.parent.searchWidgetQuantityPrecision() : quantityPrecision;

    self.quantity = ko.observable(quantity || self.record.QuantityMinimum).extend({
        required: {
            params: true,
            message: ' '
        },
        minValue: {
            params: 1,
            message: ' '
        },
        maxValue: {
            params: 99,
            message: ' '
        },
        roundedNumeric: self.quantityPrecision
    });

    self.increaseQuantity = function () {
        if (self.record.ClearanceDiscountPercentage && ((+self.quantity() + 1) > self.record.FreeStock)) {
            $.info('Insufficient Stock', 'Sorry, there is insufficient stock to meet your demand.');
            return;
        } else {
            self.quantity(+self.quantity() + 1);
        }
    }

    self.quantity.subscribe(function (newValue) {
        if (self.record.ClearanceDiscountPercentage && (+newValue > self.record.FreeStock)) {
            self.quantity(self.record.FreeStock);
        }
    });

    self.discount.subscribe(function (newValue) {
        //self.parent.basket.valueHasMutated();
    });

    self.quantity.subscribe(function (newValue) {
        //if (newValue == null) {
        //    self.quantity(1);
        //} 
        //if (self.quantity.skipSubscribe) {
        //    self.quantity.skipSubscribe = false;
        //} else {
        //    self.quantity.skipSubscribe = false;
        //    self.parent.basket.valueHasMutated();
        //    self.parent.fetchBasket();
        //}
    });

    self.quantityHasFocus = ko.observable(false); // required ?

    self.price = ko.pureComputed({
        read: function () {
            var listPrice = self.listPrice();
            var price = self.finalPrice();

            if (self.discount()) {
                price *= (1 - (self.discount() / 100));
            }

            return {
                list: listPrice,
                original: self.finalPrice(),
                final: price,
                rrp: self.rrp()
            }
        }
    }, self);

    self.promoCode = ko.observable();

    self.promoCode.subscribe(function (newValue) {
        if (newValue) {
            self.discount(100);
        } else {
            self.discount(undefined);
        }
    });

    self.promoCodeComputed = ko.pureComputed({
        read: function () {
            if (self.promoCode()) {
                return self.promoCode().Code;
            }
        },
        write: function (value) {
            self.parent.promoCode(value);
            if (value == null || value == "") {
                self.discount(undefined);
            }
        }
    }, self);

    self.promoCodeHasFocus = ko.observable(false); // required ?

    self.promoCodeHasFocus.subscribe(function (focus) {

        console.log('basketProduct promoCodeHasFocus subscribe hit');

        if (focus) {

            $('#promo-code-autocomplete').autocomplete('option', 'appendTo', $(self.promoCode.DOMElement).parent());

            self.parent.currentlyFocusedPromoCodeObject = self;

        } else {
            if (self.promoCode()) {
                if ($(self.promoCode.DOMElement).val() == '') {
                    self.promoCode(undefined);
                }
            } else {
                $(self.promoCode.DOMElement).val(undefined);
            }
        }
    });

    self.storable = function () {
        return {
            type: self.type,
            source: ko.toJS(self.record),
            display: self.display,
            discount: self.discount(),
            quantity: self.quantity(),
            quantityPrecision: self.quantityPrecision
            // those were sufficient to cater for the standard products.
            // these following are to cater for bespoke products, starting with bespoke fabric hangers.

        }
    }
}

var quickDisplayFactory = function (parent) {
    var self = this;

    self.parent = parent;

    self.quickDisplayResults = ko.observableArray([]);

    self.selectedQuickDisplay = ko.observable();

    self.selectedQuickDisplay.subscribe(function (newValue) {
        self.detailFetch();
    });

    self.selectedQuickDisplayProductQuantities = ko.observableArray([]);

    self.busy = ko.observable(false);

    self.fetch = function () {
        self.parent.busy(true);
        var data = {
            LaunchID: null,
            clearance: self.parent.clearance(),
            searchNew: self.parent.searchNew()
        };
        console.log('quickDisplayFactory fetch called with', data);
        $.ajax({
            url: '/api/componentapi/productsearch_quickdisplay',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                self.parent.busy(false);
                console.log('quickDisplayFactory returned', data);
                // grab the owlCarousel by data, call destroy on it? then rebuild...
                if ($(self.quickDisplayResults.DOMElement).data('owl.carousel')) {
                    $(self.quickDisplayResults.DOMElement).data('owl.carousel').destroy();
                    $('<div class="quickdisplay-nav"></div>').insertAfter($(self.quickDisplayResults.DOMElement));
                }
                self.quickDisplayResults(data);
            },
            error: function (xhr, s, a) {
                self.parent.busy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    }

    self.quickDisplayResults.subscribe(function (newValues) {
        console.log('quickDisplayResults subscribe hit');
        window.setTimeout(function () {
            $(self.quickDisplayResults.DOMElement).owlCarousel({
                nav: true,
                navContainer: '.quickdisplay-nav',
                navText: ['<i class="material-icons">keyboard_arrow_left</i>', '<i class="material-icons">keyboard_arrow_right</i>'],
                margin: 10,
                items: 5,
                dots: false,
                slideBy: 1,
                loop: false,
                rewind: false,
            });
        }, 100);
    });

    self.detailFetch = function () {
        self.busy(true);
        var data = {
            QuickDisplayID: self.selectedQuickDisplay().QuickDisplayID
        };
        console.log('quickDisplayFactory detailFetch called with', data);
        $.ajax({
            url: '/api/componentapi/productsearch_quickdisplay_select',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                self.busy(false);

                console.log('quickDisplayFactory detailFetch returned', data);

                self.selectedQuickDisplayProductQuantities(data.Quantities);

                var results = [];

                for (var i in data.Products) {
                    var item = new searchResult(data.Products[i], self.parent);

                    var quantity = Enumerable.From(self.selectedQuickDisplayProductQuantities()).Where(function (x) {
                        return x.ProductID == item.record.ProductID
                    }).Single();

                    item.quantity(quantity);

                    results.push(item);
                }

                $('#promo-code-autocomplete').autocomplete('option', 'appendTo', $('body'));

                self.parent.searchResults(results);
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    }

    self.addToBasket = function () {
        self.fetchFulfilmentOptions(function () {
            ko.utils.arrayForEach(self.parent.searchResults(), function (item) {
                var quantity = Enumerable.From(self.selectedQuickDisplayProductQuantities()).Where(function (x) {
                    return x.ProductID == item.record.ProductID
                }).Single();

                item.quantity(quantity);

                self.parent.addBasketItem(item, ORDERFACTORY_ADD_MODE_STOCK, true);
            });
        });
    }

    self.removeFromBasket = function () {

        self.parent.fetchBasket(function () {

            ko.utils.arrayForEach(self.parent.searchResults(), function (item) {

                var basketItem = Enumerable.From(self.parent.basket()).Where(function (x) {
                    return x.ProductID == item.record.ProductID
                }).Single();
                // don't have a handle on basketItem or basketItemIds... therefore cannot remove.
                // how to fix this... hmm... will have to have called fetchbasket to ensure that we have the basket 
                // there to interrogate...
                // then have to match back to search results based oooon... ProductID... what else can you base it on now...?
                // productId and display mode? argh.

                self.parent.removeFromBasket(basketItem, true);
            });
        });
    }
}

var bespokeFabricShowlengthFactory = function (parent) {

    var self = this;

    // #region Properties

    self.parent = parent;

    self.record = ko.observable();

    self.loaded = ko.observable(false);

    self.basketItemId = ko.observable();

    self.productId = ko.observable();

    self.busy = ko.observable(false);

    self.validateNow = ko.observable(false);

    self.bespokeType = ko.observable('Showlength');

    self.stockedHanger = ko.observable({ products: [] });

    self.selectedFeelerLength = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow();
            },
            message: ' '
        }
    });

    self.feelerLengths = [{
        Value: 1,
        Name: '1.0m'
    }, {
        Value: 1.2,
        Name: '1.2m'
    }, {
        Value: -1,
        Name: 'Custom'
    }];

    self.feelerLength = {
        observable: self.selectedFeelerLength,
        label: 'Select Feeler Length',
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        options: self.feelerLengths,
        optionsText: 'Name',
        optionsValue: 'Value',
        optionsCaption: ' ',
        width: 'auto',
        showClear: true,
        clearFunction: function () {
            self.selectedFeelerLength(undefined);
        }
    };

    self.customFeelerLength = {
        label: 'Custom Feeler Length (m)',
        observable: ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return (self.selectedFeelerLength() == -1) && self.validateNow()
                },
                message: ' '
            },
            notEqual: {
                params: 0,
                onlyIf: function () {
                    return (self.selectedFeelerLength() == -1) && self.validateNow()
                },
                message: ' '
            },
            numberFormatted: {
                digits: 1,
                currency: {
                    FormattingCulture: 'en-GB'
                }
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            self.customFeelerLength.observable(undefined);
            self.selectedFeelerLength(undefined);
        }
    };

    self.selectedHeaderWidth = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return (self.validateNow()) && (self.bespokeType() == 'Hanger');
            },
            message: ' '
        }
    });

    self.headerWidths = [{
        Value: 21,
        Name: '21cm'
    }, {
        Value: 30,
        Name: '30cm'
    }];

    self.headerWidth = {
        observable: self.selectedHeaderWidth,
        label: 'Select Header Width',
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        options: self.headerWidths,
        optionsText: 'Name',
        optionsValue: 'Value',
        optionsCaption: ' ',
        width: 'auto',
        showClear: true,
        clearFunction: function () {
            self.selectedHeaderWidth(undefined);
        }
    };

    self.fullDispatch = ko.observable(false);

    // null: no waterfall
    // 1: standard waterfall
    // 2: bespoke waterfall
    self.waterfallRequired = ko.observable(0);

    self.standardWaterfallPermitted = ko.observable(true);

    self.halfWidth = ko.observable(false);

    // do shelf samples always have headers attached...? at the moment the toJSON method just uses bespokeType
    // this is left here because it may become important at some point.
    self.headerRequired = ko.observable(false);

    self.waterfallPosition = ko.observable('DEFAULT');

    self.memo = {
        label: 'Memo',
        observable: ko.observable(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        rows: 5,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 2000
        }
    };

    // because the checked & checkedValue combo CAN support objects,
    // but does not support comparison of properties of those objects to determine
    // presence in array, and because objects are compared by reference and my array
    // is rebuild as a result of ajax...
    // I can currently search for something, include it, search again for the same thing,
    // the search result is a new object and is not in the list - not by reference, at least.
    // so... hold the IDs, and when the IDs change you can whisk a COPY of the searchResult
    // with that ID to the bespokeWaterfallProducts. When either removal from bespokeWaterfallProducts
    // occurs, or when removal from search results occurs, must be kept in sync.
    self.bespokeWaterfallProductIds = ko.observableArray([]);

    self.bespokeWaterfallProducts = ko.observableArray([]).extend({
        minLength: {
            params: 1,
            onlyIf: function () {
                return self.validateNow() && (self.waterfallRequired() == 2)
            },
            message: 'You must select at least one product for your Bespoke Waterfall'
        }
    });

    self.quantity = {
        label: 'Quantity',
        observable: ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: ' '
            },
            numberFormatted: {
                digits: 0,
                currency: {
                    FormattingCulture: 'en-GB'
                }
            },
            min: {
                params: 1,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Minimum 1 Item'
            },
            max: {
                params: 99,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Maximum 99 Items'
            },
            notEqual: {
                params: "",
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Quantity == ""'
            },
            //notEqual: {
            //    params: 0,
            //    onlyIf: function () {
            //        return self.validateNow()
            //    },
            //    message: 'Quantity == 0'
            //}
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: false
    };

    // THERE IS A STANDARD LEAD TIME - DEFAULT THIS INTO THE DISPATCH DELAY BOX.
    // THE STANDARD IS FOUR WEEKS FROM TODAY

    self.showDefaultLeadTimeMessage = ko.observable(true);

    self.designProducts = ko.observableArray([]);

    self.price = ko.observable();

    self.design = {
        label: 'Design',
        observable: ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Please specify a Design'
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: false,
        readOnly: true
    };

    self.feeler = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'Please select a Fabric'
        }
    });

    self.feelerHasFocus = ko.observable();

    // #endregion

    // #region Computeds

    self.bespokeSize = ko.computed(function () {
        if (self.selectedFeelerLength() == -1) {
            return self.customFeelerLength.observable();
        } else {
            return self.selectedFeelerLength();
        }
    });

    self.fetchPrice = ko.computed(function () {
        var data = {
            productId: self.productId(),
            bespokeSize: self.bespokeSize()
        };

        if (self.parent.tradeAccount()) {
            data.tradeAccountId = self.parent.tradeAccount().TradeAccountID;
        }

        if (data.productId && data.bespokeSize && data.tradeAccountId) {
            $.ajax({
                url: '/api/componentapi/fetchBespokeProductPrice',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('bespokeFabricShowlengthFactory fetchBespokeProductPrice returned', data);
                    self.price(data);
                }
            });
        } else {

        }
    });

    self.bespokeVisible = ko.pureComputed(function () {
        return (self.waterfallRequired() == 2) && self.feeler();
    }, self);

    // #endregion

    // #region Components

    self.dateRequired = {
        label: 'Date Required*',
        observable: ko.observable(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        readOnly: true,
        clearFunction: function () {
            this.observable(undefined);
        },
        dateTimePickerOptions: {
            locale: 'en-gb',
            format: 'DD/MM/YYYY',
            ignoreReadonly: true,
            showClear: true,
            allowInputToggle: true,
            sideBySide: true,
            useCurrent: true,
            minDate: new moment().add(4, 'week').toDate(),
            showClose: true,
            keepInvalid: false
        }
    };

    self.feelerAutocomplete = {
        label: 'Select Feeler Fabric',
        observable: ko.observable(),
        focusObservable: self.feelerHasFocus,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            self.feeler(undefined);
            self.feelerAutocomplete.observable(undefined);
            $(self.feelerAutocomplete.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        },
        readOnly: true,
        autocompleteSettings: {
            value: self.feeler,
            localData: self.designProducts,
            minLength: 0,
            focus: function (ev, ui) {
                ev.preventDefault();
            },
            select: function (ev, ui) {
                ev.preventDefault();
                self.feelerAutocomplete.observable(ui.item.label);
                self.feeler(ui.item);
            },
            create: function () {
                $(self.feelerAutocomplete.observable.DOMElement).data("ui-autocomplete")._renderItem = function (ul, item) {

                    var li = $("<li>"),
                        div = null,
                        img = null;

                    if (item.value.ImageID) {
                        img = '<img class="tiny-thumb" src="https://www.designersguild.com/image/32/' + item.value.ImageID + '" />'
                    }

                    div = li.append("<div class='ui-menu-item-wrapper'>" + (img || '<span class="tiny-thumb"></span>') + item.label + "</div>");

                    return li.appendTo(ul);
                };
            }
        }
    };

    self.bespokeFabricSearch = ko.observable();

    self.bespokeFabricAutocompleteResults = ko.observableArray([]);

    self.bespokeFabricAutocomplete = {
        label: 'Search for Fabric by Code or Name',
        observable: self.bespokeFabricSearch,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            self.bespokeFabricSearch(undefined);
            self.bespokeFabricAutocomplete.observable(undefined);
            self.bespokeFabricAutocompleteResults([]);
            $(self.bespokeFabricAutocomplete.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        },
        autocompleteSettings: {
            value: self.bespokeFabricSearch,
            appendTo: 'body',
            source: function (request, response) {
                var data = {
                    term: request.term,
                    productGroupId: 8,
                    tradeAccountId: self.parent.tradeAccount().TradeAccountID
                };
                $.ajax({
                    url: '/api/ComponentAPI/ProductCodeAutocompleteBespoke',
                    type: "POST",
                    dataType: "json",
                    data: data,
                    success: function (data) {
                        console.log('bespokeFabricAutocomplete returned', data);
                        self.bespokeFabricAutocompleteResults($.map(data, function (p) {
                            return {
                                productId: p.ProductID,
                                label: p.Code + ' - ' + p.Name,
                                value: p
                            };
                        }));
                        response();
                    }
                });
            },
            minLength: 1,
            select: function (event, ui) {
                event.preventDefault();
                self.bespokeFabricAutocomplete.observable(ui.item.label);
                self.bespokeFabricSearch(ui.item.value);
            },
            autoFocus: true,
            create: function () {
                if (self.classField != null) {
                    $(this).data("ui-autocomplete")._renderItem = function (ul, item) {
                        var li = $("<li>");
                        var div = li.append("<div class='ui-menu-item-wrapper'><a href='#'>" + item.label + "<span class='type'>" + item.value[self.typeField] + "</span></a></div>");

                        li.addClass(item.value[self.classField]);

                        return li.appendTo(ul);
                    };
                }
            }
        }
    };

    self.bespokeWaterfallSortable = {
        data: self.bespokeWaterfallProducts,
        helper: function (element) {
            return element.clone().addClass('bespoke-waterfall-helper');
        }
    };

    // #endregion

    // #region Subscriptions

    self.bespokeWaterfallProducts.subscribe(function (newValues) {
        console.log('bespokeFabricShowlengthFactory bespokeWaterfallProducts subscribe hit', newValues);
    }, self, 'arrayChange');

    self.selectedFeelerLength.subscribe(function (newValue) {
        if (newValue == -1) {
            window.setTimeout(function () {
                self.customFeelerLength.observable.mdcTextField.layout();
                $(self.customFeelerLength.observable.DOMElement).focus();
            }, 0);
        }
    });

    self.feelerHasFocus.subscribe(function (newValue) {
        console.log('bespokeFabricShowlengthFactory feelerHasFocus subscribe hit', newValue);
        if (newValue) {
            $(self.feelerAutocomplete.observable.DOMElement).autocomplete('search', '');
        }
    });

    self.bespokeVisible.subscribe(function (newValue) {
        window.setTimeout(function () {
            self.bespokeFabricSearch.mdcTextField.layout();
        }, 0);
    });

    self.bespokeWaterfallProductIds.subscribe(function (newValues) {
        ko.utils.arrayForEach(newValues, function (item) {
            if (item.status == 'added') {
                var addition = Enumerable.From(self.bespokeFabricAutocompleteResults()).Where(function (x) {
                    return x.productId == item.value;
                }).SingleOrDefault();
                if (addition != null) { // can be null in case of loading: no autocompleteResults exist
                    self.bespokeWaterfallProducts.push(addition);
                }
            } else if (item.status == 'deleted') {
                self.bespokeWaterfallProducts.remove(function (x) {
                    return x.productId == item.value;
                });
            }
        });
    }, self, 'arrayChange');

    self.dateRequired.observable.subscribe(function (newValue) {
        self.showDefaultLeadTimeMessage(false);
    });

    self.waterfallRequired.subscribe(function (newValue) {
        self.bespokeWaterfallProductIds.removeAll();
    });

    self.loaded.subscribe(function (newValue) {
        if (newValue) {
            window.setTimeout(function () {
                self.design.observable.mdcTextField.layout();
                self.quantity.observable.mdcTextField.layout();
                self.customFeelerLength.observable.mdcTextField.layout();
                self.feelerLength.observable.mdcSelect.layout();
                if (self.headerWidth.observable.hasOwnProperty('mdcSelect'))
                    self.headerWidth.observable.mdcSelect.layout();
                self.dateRequired.observable.mdcTextField.layout();
                self.memo.observable.mdcTextField.layout();
            }, 300);
        }
    });

    // #endregion

    // #region Validation Groups

    self.errors = ko.validation.group([
        self.design,
        self.feeler,
        self.selectedFeelerLength,
        self.selectedHeaderWidth,
        self.customFeelerLength.observable,
        self.quantity.observable,
        self.bespokeWaterfallProducts
    ]);

    // #endregion

    // #region Functions

    self.isProductInSelection = function (data) {

        var result = ko.utils.arrayFirst(self.bespokeWaterfallProducts(), function (item) {
            return item.productId == data.productId
        });

        if (result == null) {
            return false
        } else {
            return true;
        }
    }

    self.removeBespokeWaterfallProduct = function (data) {
        self.bespokeWaterfallProductIds.remove(data.productId);
    }

    self.validate = function () {
        if (self.errors().length) {
            self.errors.showAllMessages(true);
            self.feeler.isValid.notifySubscribers(self.feeler.isValid());
            self.selectedFeelerLength.isValid.notifySubscribers(self.selectedFeelerLength.isValid());
            self.selectedHeaderWidth.isValid.notifySubscribers(self.selectedHeaderWidth.isValid());
            self.customFeelerLength.observable.isValid.notifySubscribers(self.customFeelerLength.observable.isValid());
            self.quantity.observable.isValid.notifySubscribers(self.quantity.observable.isValid());
            return false;
        } else {
            self.errors.showAllMessages(false);
            return true;
        }
    }

    self.addToBasket = function () {

        self.validateNow(true);

        if (self.errors().length) {
            self.errors.showAllMessages(true);

            self.feeler.isValid.notifySubscribers(self.feeler.isValid());

            self.selectedFeelerLength.isValid.notifySubscribers(self.selectedFeelerLength.isValid());

            self.selectedHeaderWidth.isValid.notifySubscribers(self.selectedHeaderWidth.isValid());

            self.customFeelerLength.observable.isValid.notifySubscribers(self.customFeelerLength.observable.isValid());

            self.quantity.observable.isValid.notifySubscribers(self.quantity.observable.isValid());
        } else {
            self.errors.showAllMessages(false);

            var data = {
                tradeAccountId: self.parent.tradeAccount().TradeAccountID,
                basketId: self.parent.basketId(),
                basketItemTypeId: self.bespokeType() == 'Hanger' ? BASKETITEM_TYPE_BESPOKEHANGER : BASKETITEM_TYPE_BESPOKESHOWLENGTH,
                productId: self.productId(),
                quantity: self.quantity.observable(),
                stockLocationId: 107,  // ??? searchResult.fulfilmentOption().StockLocationID,
                fulfilmentTypeId: 1,  // ??? searchResult.fulfilmentOption().FulfilmentTypeID,
                lineReference: null,  // ??? searchResult.lineReference.observable(),
                orderTypeId: ORDERFACTORY_ADD_MODE_STOCK,
                feelerProductId: self.feeler().value.ProductID,
                feelerLength: self.selectedFeelerLength() == -1 ? self.customFeelerLength.observable() : self.selectedFeelerLength(),
                headerWidth: self.selectedHeaderWidth(),
                processAnswersJSON: self.toJSON()
            };

            console.log('bespokeFabricShowlengthFactory addBasketItem calling with', data);

            self.busy(true);

            $.ajax({
                url: '/api/componentapi/AddBasketItem',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('bespokeFabricShowlengthFactory addBasketItem returned', data);

                    self.busy(false);

                    if (data.addResult.BasketItemID != null) {

                        self.hide();
                        self.parent.fetchBasket();

                    } else {
                        $.showError(data.addResult, null, null);
                    }
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    $.showError('Sorry', 'There was an error attempting to add this item to your basket.');
                }
            });

            self.hide();
        }
    }

    self.open = function (data, bespokeType) {
        self.busy(true);
        self.record(data);
        console.log('bespokeFabricShowlengthFactory open', data);
        self.productId(data.record.ProductID);
        self.design.observable(data.record.Code + ' - ' + data.record.Design);
        self.bespokeFabricSearch(self.design.observable());
        self.bespokeType(bespokeType);
        self.halfWidth(bespokeType === 'Shelf Sample' ? true : false);
        if (bespokeType === 'Hanger') {
            self.loadStockedHanger();
            self.selectedHeaderWidth(21);
        }
        self.show();
        self.fetchProductsByQuality(data.record.Code);
    }

    self.fetchProductsByQuality = function (code, onComplete) {

        var data = {
            productTypeId: 15,
            code: code,
            tradeAccountId: self.parent.tradeAccount().TradeAccountID,
            status: 'C'
        }

        console.log('bespokeFabricShowlengthFactory calling fetchProductsByQuality with', data);

        $.ajax({
            url: '/api/componentapi/fetchProductsByQuality',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('fetchProductsByQuality returned', data);
                self.designProducts($.map(data.results, function (p) {
                    return {
                        productId: p.ProductID,
                        label: p.Code + ' - ' + p.Name,
                        value: p
                    };
                }));

                self.bespokeFabricAutocompleteResults($.map(data.results, function (p) {
                    return {
                        productId: p.ProductID,
                        label: p.Code + ' - ' + p.Name,
                        value: p
                    };
                }));

                if (data.waterfallPermitted == false) {
                    self.standardWaterfallPermitted(false);
                    self.waterfallRequired(0);
                    $.info('Notice', 'We do not stock premade waterfalls for this design.');
                } else {
                    if (self.designProducts().length == 1) {
                        self.feeler(self.designProducts()[0]);
                        self.feelerAutocomplete.observable(self.designProducts()[0].label);
                        self.standardWaterfallPermitted(false);
                        $.info('Notice', 'This design has only one "current" colourway available. Stocked waterfalls are no longer permitted.');
                    }
                }
                // check the /W part number for this design see if it exists in HD and IS in stock or IS on PO
                // 

                self.busy(false);

                if (typeof onComplete === 'function')
                    onComplete();
            }
        });
    }

    self.loadStockedHanger = function () {
        self.parent.parent.orderProductsDrilldown.processingBusy(true);
        var data = {
            productId: self.productId(),
            tradeAccountId: self.parent.tradeAccount().TradeAccountID
        };
        console.log('bespokeFabricShowlengthFactory loadStockedHanger calling with', data);
        $.ajax({
            url: '/api/componentapi/fetchBespokeStockedHanger',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('bespokeFabricShowlengthFactory loadStockedHanger returned', data);
                if (data.length) {
                    self.stockedHanger({
                        products: data.map(function (item) {
                            return new searchResult(item, self.parent);
                        })
                    });
                }
                self.parent.parent.orderProductsDrilldown.processingBusy(false);
            }
        });
    }

    self.load = function (data, bespokeJsonData, bespokeType) {

        self.record(data);

        var jsonData = JSON.parse(bespokeJsonData);

        console.log('bespokeFabricShowlengthFactory load', data, jsonData);

        if (jsonData == null) {
            self.basketItemId(data.basketItemId);
            self.productId(data.record.ProductID);
            self.design.observable(data.record.Code + ' - ' + data.record.Design);
            self.bespokeFabricSearch(self.design.observable());
            self.bespokeType(bespokeType);
            self.halfWidth(bespokeType === 'Shelf Sample' ? true : false);
            if (bespokeType === 'Hanger') {
                self.loadStockedHanger();
                self.selectedHeaderWidth(21);
            }
            self.fetchProductsByQuality(data.record.Code);
            self.waterfallRequired((bespokeType == 'Hanger' || bespokeType == 'Showlength') ? 1 : 0);
        } else {
            self.basketItemId(data.basketItemId);
            self.productId(data.record.ProductID);
            self.quantity.observable(data.quantity());
            self.design.observable(data.record.Code + ' - ' + data.record.Design);
            self.bespokeFabricSearch(self.design.observable());

            var forwardOrderDate = null;

            if (jsonData.dateRequired && jsonData.dateRequired != 'N/A')
                forwardOrderDate = moment(jsonData.dateRequired, 'DD/MM/YY');

            if (forwardOrderDate) {
                self.dateRequired.observable(forwardOrderDate);
            }

            self.fetchProductsByQuality(data.record.Code, function () {
                self.feeler(Enumerable.From(self.designProducts()).Where(function (x) {
                    return x.productId == +jsonData.feeler.productId
                }).Single());
                self.feelerAutocomplete.observable(self.feeler().value.Code + ' - ' + self.feeler().value.Name);
            });

            self.selectedFeelerLength(+jsonData.selectedFeelerLength);
            self.selectedHeaderWidth(jsonData.selectedHeaderWidth);
            self.customFeelerLength.observable(+jsonData.customFeelerLength);
            self.bespokeType(jsonData.bespokeType);
            self.fullDispatch(jsonData.fullDespatch == 'Y' ? true : false);
            self.headerRequired(jsonData.headerRequired == 'Y' ? true : false);
            self.waterfallRequired(+jsonData.waterfallTypeId);
            self.waterfallPosition(jsonData.waterfallPosition);
            self.bespokeWaterfallProductIds(Enumerable.From(jsonData.waterfallProducts).Select(function (x) {
                return x.productId
            }).ToArray());
            self.bespokeWaterfallProducts(jsonData.waterfallProducts);
            self.halfWidth(jsonData.halfWidth == 'Y' ? true : false);
            self.memo.observable(jsonData.memo);
        }

        self.loaded(true);

        //self.show();
    }

    self.validate = function () {
        self.validateNow(true);
        if (self.errors().length) {
            self.errors.showAllMessages(true);
            self.feeler.isValid.notifySubscribers(self.feeler.isValid());
            self.selectedFeelerLength.isValid.notifySubscribers(self.selectedFeelerLength.isValid());
            self.selectedHeaderWidth.isValid.notifySubscribers(self.selectedHeaderWidth.isValid());
            self.customFeelerLength.observable.isValid.notifySubscribers(self.customFeelerLength.observable.isValid());
            self.quantity.observable.isValid.notifySubscribers(self.quantity.observable.isValid());
            return false;
        } else {
            self.errors.showAllMessages(false);
            return true;
        }
    }

    self.save = function (onComplete) {

        //self.validateNow(true);

        //if (self.errors().length) {
        //    self.errors.showAllMessages(true);

        //    self.feeler.isValid.notifySubscribers(self.feeler.isValid());
        //    self.selectedFeelerLength.isValid.notifySubscribers(self.selectedFeelerLength.isValid());
        //    self.selectedHeaderWidth.isValid.notifySubscribers(self.selectedHeaderWidth.isValid());
        //    self.customFeelerLength.observable.isValid.notifySubscribers(self.customFeelerLength.observable.isValid());
        //    self.quantity.observable.isValid.notifySubscribers(self.quantity.observable.isValid());
        //} else {
        //    self.errors.showAllMessages(false);

        var data = {
            tradeAccountId: self.parent.tradeAccount().TradeAccountID,
            basketId: self.parent.basketId(),
            basketItemId: self.basketItemId(),
            productId: self.productId(),
            quantity: self.quantity.observable(),
            stockLocationId: 107,
            fulfilmentTypeId: 1,
            lineReference: null,
            memo: self.memo.observable(),
            orderTypeId: ORDERFACTORY_ADD_MODE_STOCK,
            feelerProductId: self.feeler().value.ProductID,
            feelerLength: self.selectedFeelerLength() == -1 ? self.customFeelerLength.observable() : self.selectedFeelerLength(),
            headerWidth: self.selectedHeaderWidth(),
            processAnswersJSON: self.toJSON(),
            backOrder: self.parent.parent.orderProductsDrilldown.addingProductToBasket().backOrder(),
            bespokeSize: self.bespokeSize()
        };

        console.log('bespokeFabricShowlengthFactory updateBasketItem calling with', data);

        self.busy(true);

        self.parent.updateBasketItem(data, onComplete);

        //function () {
        //        self.busy(false);
        //        self.hide();
        //        self.parent.fetchBasket();
        //    }, function () {
        //        self.busy(false);
        //        console.log('bespokeFabricShowlengthFactory updateBasketItem failed');
        //    });
        ////}
    }

    self.show = function () {
        //$('#bespoke-fabric-showlength-modal').modal('show');
    }

    self.hide = function () {
        //$('#bespoke-fabric-showlength-modal').modal('hide');
    }

    self.reset = function () {
        console.log('bespokeFabricShowlengthFactory reset called');
        self.busy(false);
        self.loaded(false);
        self.record(undefined);
        self.basketItemId(undefined);
        self.productId(undefined);
        self.stockedHanger({ products: [] });
        self.bespokeType('Showlength');
        self.selectedFeelerLength(undefined);
        self.selectedHeaderWidth(21);
        self.customFeelerLength.observable(undefined);
        self.fullDispatch(false);
        self.waterfallRequired(0);
        self.halfWidth(false);
        self.headerRequired(false);
        self.waterfallPosition('DEFAULT');
        self.bespokeWaterfallProductIds([]);
        self.bespokeWaterfallProducts([]);
        self.quantity.observable(1);
        self.feeler(undefined);
        self.feelerAutocomplete.observable(undefined);
        self.feelerHasFocus(false);
        self.bespokeFabricSearch(undefined);
        self.bespokeFabricAutocomplete.observable(undefined);
        self.bespokeFabricAutocompleteResults([]);
        self.validateNow(false);
        self.standardWaterfallPermitted(true);
        self.design.observable(undefined);
        self.designProducts([]);
        self.dateRequired.observable(undefined);
        self.showDefaultLeadTimeMessage(true);
        self.errors.showAllMessages(false);
        self.price(undefined);
        self.memo.observable(undefined);
    }

    self.toJSON = function () {
        var forwardOrderDate = null;

        if (self.dateRequired.observable())
            forwardOrderDate = moment(self.dateRequired.observable()).format('DD/MM/YY');

        return JSON.stringify({
            feeler: self.feeler(),
            selectedFeelerLength: self.selectedFeelerLength(),
            selectedHeaderWidth: self.selectedHeaderWidth(),
            customFeelerLength: self.customFeelerLength.observable(),
            shelfSample: self.bespokeType() == 'Shelf Sample' ? 'Y' : 'N',
            bespokeType: self.bespokeType(),
            dateRequired: forwardOrderDate || 'N/A',
            fullDespatch: self.fullDispatch() ? 'Y' : 'N',
            waterfallRequired: self.waterfallRequired() == 1 ? 'Y' : 'N',
            waterfallTypeId: self.waterfallRequired(),
            halfWidth: self.halfWidth() ? 'Y' : 'N',
            headerRequired: self.bespokeType() == 'Shelf Sample' ? 'Y' : 'N',
            waterfallPosition: self.waterfallPosition(),
            memo: self.memo.observable(),
            waterfallProducts: self.bespokeWaterfallProducts(),
        });
    }

    // #endregion

    // #region Events

    //$('#bespoke-fabric-showlength-modal').on('shown.bs.modal', function () {
    //});

    $('#bespoke-fabric-showlength-modal').on('hidden.bs.modal', function () {
        self.reset();
    });

    // #endregion
}

var bespokeWallpaperShowlengthFactory = function (parent) {
    var self = this;

    //#region Properties

    self.parent = parent;

    self.loaded = ko.observable(false);

    self.basketItemId = ko.observable();

    self.productId = ko.observable();

    self.busy = ko.observable(false);

    self.validateNow = ko.observable(false);

    self.bespokeType = ko.observable('Showlength');

    self.selectedFeelerLength = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow();
            },
            message: ' '
        }
    });

    self.feelerLengths = [{
        Value: 1,
        Name: '1.0m'
    }, {
        Value: 1.2,
        Name: '1.2m'
    }, {
        Value: -1,
        Name: 'Custom'
    }];

    self.feelerLength = {
        observable: self.selectedFeelerLength,
        label: 'Select Feeler Length',
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        options: self.feelerLengths,
        optionsText: 'Name',
        optionsValue: 'Value',
        optionsCaption: ' ',
        width: 'auto',
        showClear: true,
        clearFunction: function () {
            self.selectedFeelerLength(undefined);
        }
    };

    self.memo = {
        label: 'Memo',
        observable: ko.observable(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 200
        }
    };

    self.customFeelerLength = {
        label: 'Custom Feeler Length (m)',
        observable: ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return (self.selectedFeelerLength() == -1) && self.validateNow()
                },
                message: ' '
            },
            notEqual: {
                params: 0,
                onlyIf: function () {
                    return (self.selectedFeelerLength() == -1) && self.validateNow()
                },
                message: ' '
            },
            numberFormatted: {
                digits: 1,
                currency: {
                    FormattingCulture: 'en-GB'
                }
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            self.customFeelerLength.observable(undefined);
            self.selectedFeelerLength(undefined);
        }
    };

    self.fullDispatch = ko.observable(false);

    self.quantity = {
        label: 'Quantity',
        observable: ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: ' '
            },
            numberFormatted: {
                digits: 0,
                currency: {
                    FormattingCulture: 'en-GB'
                }
            },
            min: {
                params: 1,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Minimum 1 Item'
            },
            max: {
                params: 99,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Maximum 99 Items'
            },
            notEqual: {
                params: "",
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Quantity == ""'
            },
            //notEqual: {
            //    params: 0,
            //    onlyIf: function () {
            //        return self.validateNow()
            //    },
            //    message: 'Quantity == 0'
            //}
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: false
    };

    self.showDefaultLeadTimeMessage = ko.observable(true);

    self.designProducts = ko.observableArray([]);

    self.price = ko.observable();

    self.design = {
        label: 'Design',
        observable: ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Please specify a Design'
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: false,
        readOnly: true
    };

    self.feeler = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'Please select a Wallpaper'
        }
    });

    self.feelerHasFocus = ko.observable();

    //#endregion

    //#region Computeds

    self.bespokeSize = ko.computed(function () {
        if (self.feeler()) {
            if (self.selectedFeelerLength()) {
                if (self.selectedFeelerLength() == -1) {
                    if (self.customFeelerLength.observable()) {
                        return self.customFeelerLength.observable() / self.feeler().value.RollLength;
                    }
                } else {
                    return self.selectedFeelerLength() / self.feeler().value.RollLength;
                }
            }
        }
    });

    self.fetchPrice = ko.computed(function () {
        var data = {
            productId: self.productId(),
            bespokeSize: self.bespokeSize()
        };

        if (self.parent.tradeAccount()) {
            data.tradeAccountId = self.parent.tradeAccount().TradeAccountID;
        }

        if (data.productId && data.bespokeSize && data.tradeAccountId) {
            $.ajax({
                url: '/api/componentapi/fetchBespokeProductPrice',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('bespokeFabricShowlengthFactory fetchBespokeProductPrice returned', data);
                    self.price(data);
                }
            });
        } else {

        }
    });

    //#endregion

    //#region Components

    self.dateRequired = {
        label: 'Date Required*',
        observable: ko.observable(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        readOnly: true,
        clearFunction: function () {
            this.observable(undefined);
        },
        dateTimePickerOptions: {
            locale: 'en-gb',
            format: 'DD/MM/YYYY',
            ignoreReadonly: true,
            showClear: true,
            allowInputToggle: true,
            sideBySide: true,
            useCurrent: true,
            minDate: new moment().add(4, 'week').toDate(),
            showClose: true,
            keepInvalid: false
        }
    };

    self.feelerAutocomplete = {
        label: 'Select Feeler Wallpaper',
        observable: ko.observable(),
        focusObservable: self.feelerHasFocus,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            self.feeler(undefined);
            self.feelerAutocomplete.observable(undefined);
            $(self.feelerAutocomplete.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        },
        readOnly: true,
        autocompleteSettings: {
            value: self.feeler,
            localData: self.designProducts,
            minLength: 0,
            focus: function (ev, ui) {
                ev.preventDefault();
            },
            select: function (ev, ui) {
                ev.preventDefault();
                self.feelerAutocomplete.observable(ui.item.label);
                self.feeler(ui.item);
            },
            create: function () {
                $(self.feelerAutocomplete.observable.DOMElement).data("ui-autocomplete")._renderItem = function (ul, item) {

                    var li = $("<li>"),
                        div = null,
                        img = null;

                    if (item.value.ImageID) {
                        img = '<img class="tiny-thumb" src="https://www.designersguild.com/image/32/' + item.value.ImageID + '" />'
                    }

                    div = li.append("<div class='ui-menu-item-wrapper'>" + (img || '<span class="tiny-thumb"></span>') + item.label + "</div>");

                    return li.appendTo(ul);
                };
            }
        }
    };

    //#endregion

    //#region Subscriptions


    self.selectedFeelerLength.subscribe(function (newValue) {
        if (newValue == -1) {
            window.setTimeout(function () {
                self.customFeelerLength.observable.mdcTextField.layout();
                $(self.customFeelerLength.observable.DOMElement).focus();
            }, 0);
        }
    });

    self.feelerHasFocus.subscribe(function (newValue) {
        console.log('bespokeWallpaperShowlengthFactory feelerHasFocus subscribe hit', newValue);
        if (newValue) {
            $(self.feelerAutocomplete.observable.DOMElement).autocomplete('search', '');
        }
    });

    self.dateRequired.observable.subscribe(function (newValue) {
        self.showDefaultLeadTimeMessage(false);
    });

    self.loaded.subscribe(function (newValue) {
        if (newValue) {
            window.setTimeout(function () {
                self.design.observable.mdcTextField.layout();
                self.quantity.observable.mdcTextField.layout();
                self.feelerLength.observable.mdcSelect.layout();
                self.customFeelerLength.observable.mdcTextField.layout();
                self.dateRequired.observable.mdcTextField.layout();
                self.memo.observable.mdcTextField.layout();
            }, 300);
        }
    });

    //#endregion

    //#region Validation Groups

    self.errors = ko.validation.group([
        self.design,
        self.feeler,
        self.selectedFeelerLength,
        self.customFeelerLength.observable,
        self.quantity.observable,
        self.selectedHeaderWidth
    ]);

    //#endregion

    //#region Functions

    self.addToBasket = function () {

        self.validateNow(true);

        if (self.errors().length) {
            self.errors.showAllMessages(true);

            self.feeler.isValid.notifySubscribers(self.feeler.isValid());
            self.selectedFeelerLength.isValid.notifySubscribers(self.selectedFeelerLength.isValid());
            self.customFeelerLength.observable.isValid.notifySubscribers(self.customFeelerLength.observable.isValid());
            self.quantity.observable.isValid.notifySubscribers(self.quantity.observable.isValid());
        } else {
            self.errors.showAllMessages(false);

            var data = {
                tradeAccountId: self.parent.tradeAccount().TradeAccountID,
                basketId: self.parent.basketId(),
                basketItemTypeId: BASKETITEM_TYPE_BESPOKEWALLPAPERSHOWLENGTH,
                productId: self.productId(),
                quantity: self.quantity.observable(),
                stockLocationId: 110,  // ??? searchResult.fulfilmentOption().StockLocationID,
                fulfilmentTypeId: 1,  // ??? searchResult.fulfilmentOption().FulfilmentTypeID,
                lineReference: null,  // ??? searchResult.lineReference.observable(),
                orderTypeId: ORDERFACTORY_ADD_MODE_STOCK,
                feelerProductId: self.feeler().value.ProductID,
                feelerLength: self.selectedFeelerLength() == -1 ? self.customFeelerLength.observable() : self.selectedFeelerLength(),
                processAnswersJSON: self.toJSON()
            };

            console.log('bespokeWallpaperShowlengthFactory addBasketItem calling with', data);

            self.busy(true);

            $.ajax({
                url: '/api/componentapi/AddBasketItem',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('bespokeWallpaperShowlengthFactory addBasketItem returned', data);

                    self.busy(false);

                    if (data.addResult.BasketItemID != null) {

                        self.hide();
                        self.parent.fetchBasket();

                    } else {
                        $.showError(data.addResult, null, null);
                    }
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    $.showError('Sorry', 'There was an error attempting to add this item to your basket.');
                }
            });

            self.hide();
        }
    }

    self.open = function (data, bespokeType) {
        self.busy(true);
        console.log('bespokeWallpaperShowlengthFactory open', data);
        self.productId(data.record.ProductID);
        self.design.observable(data.record.Code + ' - ' + data.record.Design);
        self.show();
        self.fetchProductsByQuality(data.record.Code);
    }

    self.fetchProductsByQuality = function (code, onComplete) {

        var data = {
            productTypeId: 18,
            code: code,
            tradeAccountId: self.parent.tradeAccount().TradeAccountID,
            status: 'C'
        }

        console.log('bespokeWallpaperShowlengthFactory calling fetchProductsByQuality with', data);

        $.ajax({
            url: '/api/componentapi/fetchProductsByQuality',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('fetchProductsByQuality returned', data);
                self.designProducts($.map(data.results, function (p) {
                    return {
                        productId: p.ProductID,
                        label: p.Code + ' - ' + p.Name,
                        value: p
                    };
                }));

                if (self.designProducts().length == 1) {
                    self.feeler(self.designProducts()[0]);
                    self.feelerAutocomplete.observable(self.designProducts()[0].label);
                }

                self.busy(false);

                if (typeof onComplete === 'function')
                    onComplete();
            }
        });
    }

    self.load = function (data, bespokeJsonData) {
        var jsonData = JSON.parse(bespokeJsonData);

        console.log('bespokeWallpaperShowlengthFactory load', data, jsonData);

        self.basketItemId(data.basketItemId);
        self.productId(data.record.ProductID);
        self.quantity.observable(data.quantity());
        self.design.observable(data.record.Code + ' - ' + data.record.Design);

        if (jsonData) {
            var forwardOrderDate = null;

            if (jsonData.dateRequired && jsonData.dateRequired != 'N/A')
                forwardOrderDate = moment(jsonData.dateRequired, 'DD/MM/YY');

            if (forwardOrderDate) {
                self.dateRequired.observable(forwardOrderDate);
            }

            self.fetchProductsByQuality(data.record.Code, function () {
                self.feeler(Enumerable.From(self.designProducts()).Where(function (x) {
                    return x.productId == +jsonData.feeler.productId
                }).Single());
                self.feelerAutocomplete.observable(self.feeler().value.Code + ' - ' + self.feeler().value.Name);
            });

            self.selectedFeelerLength(+jsonData.selectedFeelerLength);
            if (jsonData.customFeelerLength)
                self.customFeelerLength.observable(+jsonData.customFeelerLength);
            self.fullDispatch(jsonData.fullDespatch == 'Y' ? true : false);
            self.memo.observable(jsonData.memo);
        } else {
            self.fetchProductsByQuality(data.record.Code);
        }
        self.loaded(true);

        //self.show();
    }

    self.validate = function () {
        self.validateNow(true);
        if (self.errors().length) {
            self.errors.showAllMessages(true);
            self.feeler.isValid.notifySubscribers(self.feeler.isValid());
            self.selectedFeelerLength.isValid.notifySubscribers(self.selectedFeelerLength.isValid());
            self.customFeelerLength.observable.isValid.notifySubscribers(self.customFeelerLength.observable.isValid());
            self.quantity.observable.isValid.notifySubscribers(self.quantity.observable.isValid());
            return false;
        } else {
            self.errors.showAllMessages(false);
            return true;
        }
    }

    self.save = function (onComplete) {

        var data = {
            tradeAccountId: self.parent.tradeAccount().TradeAccountID,
            basketId: self.parent.basketId(),
            basketItemId: self.basketItemId(),
            productId: self.productId(),
            quantity: self.quantity.observable(),
            stockLocationId: 110,
            fulfilmentTypeId: 1,
            lineReference: null,
            orderTypeId: ORDERFACTORY_ADD_MODE_STOCK,
            feelerProductId: self.feeler().value.ProductID,
            feelerLength: self.selectedFeelerLength() == -1 ? self.customFeelerLength.observable() : self.selectedFeelerLength(),
            processAnswersJSON: self.toJSON(),
            backOrder: self.parent.parent.orderProductsDrilldown.addingProductToBasket().backOrder(),
            bespokeSize: self.bespokeSize()
        };

        console.log('bespokeFabricHangerFactory updateBasketItem calling with', data);

        self.busy(true);

        self.parent.updateBasketItem(data, onComplete);
        //    , function () {
        //    self.busy(false);
        //    self.hide();
        //    self.parent.fetchBasket();
        //}, function () {
        //    self.busy(false);
        //    console.log('bespokeFabricHangerFactory updateBasketItem failed');
        //});
        //}
    }

    self.show = function () {
        //$('#bespoke-wallpaper-showlength-modal').modal('show');
    }

    self.hide = function () {
        //$('#bespoke-wallpaper-showlength-modal').modal('hide');
    }

    self.reset = function () {
        console.log('bespokeWallpaperShowlengthFactory reset called');
        self.busy(false);
        self.loaded(false);
        self.basketItemId(undefined);
        self.productId(undefined);
        self.selectedFeelerLength(undefined);
        self.customFeelerLength.observable(undefined);
        self.fullDispatch(false);
        self.quantity.observable(1);
        self.feeler(undefined);
        self.feelerAutocomplete.observable(undefined);
        self.feelerHasFocus(false);
        self.validateNow(false);
        self.design.observable(undefined);
        self.designProducts([]);
        self.dateRequired.observable(undefined);
        self.showDefaultLeadTimeMessage(true);
        self.errors.showAllMessages(false);
        self.memo.observable(undefined);
        self.price(undefined);
    }

    self.toJSON = function () {
        var forwardOrderDate = null;

        if (self.dateRequired.observable())
            forwardOrderDate = moment(self.dateRequired.observable()).format('DD/MM/YY');

        return JSON.stringify({
            feeler: self.feeler(),
            selectedFeelerLength: self.selectedFeelerLength(),
            customFeelerLength: self.customFeelerLength.observable(),
            dateRequired: forwardOrderDate || 'N/A',
            fullDespatch: self.fullDispatch() ? 'Y' : 'N',
            memo: self.memo.observable()
        });
    }

    //#endregion

    //#region Events

    $('#bespoke-wallpaper-showlength-modal').on('shown.bs.modal', function () {

    });

    $('#bespoke-wallpaper-showlength-modal').on('hidden.bs.modal', function () {
        self.reset();
    });

    //#endregion

}

var bespokeRugFactory = function (parent) {
    var self = this;

    self.parent = parent;

    self.busy = ko.observable(false);

    self.loaded = ko.observable(false);

    self.roundRug = ko.observable(false);

    self.validateNow = ko.observable(false);

    self.directDispatch = ko.observable(false);

    self.productId = ko.observable();

    self.basketItemId = ko.observable();

    self.showDefaultLeadTimeMessage = ko.observable(true);

    self.bespokeType = ko.observable('Rug');

    self.dateRequired = {
        label: 'Date Required*',
        observable: ko.observable(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        readOnly: true,
        clearFunction: function () {
            this.observable(undefined);
        },
        dateTimePickerOptions: {
            locale: 'en-gb',
            format: 'DD/MM/YYYY',
            ignoreReadonly: true,
            showClear: true,
            allowInputToggle: true,
            sideBySide: true,
            useCurrent: true,
            minDate: new moment().add(4, 'week').toDate(),
            showClose: true,
            keepInvalid: false
        }
    };

    self.price = ko.observable();

    self.cadEmail = {
        label: 'Email for C.A.D. Approval',
        observable: ko.observable().extend({
            email: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                }
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: false
    };

    self.design = {
        label: 'Design',
        observable: ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Please specify a Design'
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: false,
        readOnly: true
    };

    self.designObj = ko.observable();

    self.length = {
        label: 'Length (m)',
        observable: ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Please specify a Length'
            },
            numberFormatted: {
                digits: 2,
                currency: {
                    FormattingCulture: 'en-GB'
                },
                minValue: 0.5,
                maxValue: 20
            },
            min: {
                params: 0.5,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: ' '
            },
            max: {
                params: 20,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: ' '
            },
            notEqual: {
                params: "",
                onlyIf: function () {
                    return self.validateNow()
                },
                message: ' '
            },
            //notEqual: {
            //    params: 0,
            //    onlyIf: function () {
            //        return self.validateNow()
            //    },
            //    message: ' '
            //}
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: false
    }

    self.width = {
        label: 'Width (m)',
        observable: ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: ' '
            },
            numberFormatted: {
                digits: 2,
                currency: {
                    FormattingCulture: 'en-GB'
                },
                minValue: 0.5,
                maxValue: 20
            },
            min: {
                params: 0.5,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: ' '
            },
            max: {
                params: 20,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: ' '
            },
            notEqual: {
                params: "",
                onlyIf: function () {
                    return self.validateNow()
                },
                message: ' '
            },
            //notEqual: {
            //    params: 0,
            //    onlyIf: function () {
            //        return self.validateNow()
            //    },
            //    message: ' '
            //}
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: false
    }

    self.quantity = {
        label: 'Quantity',
        observable: ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: ' '
            },
            numberFormatted: {
                digits: 0,
                currency: {
                    FormattingCulture: 'en-GB'
                }
            },
            min: {
                params: 1,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Minimum 1 Item'
            },
            max: {
                params: 99,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Maximum 99 Items'
            },
            notEqual: {
                params: "",
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Quantity == ""'
            },
            //notEqual: {
            //    params: 0,
            //    onlyIf: function () {
            //        return self.validateNow()
            //    },
            //    message: 'Quantity == 0'
            //}
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: false
    };

    // Fudged to present a 3sqm minimum
    self.bespokeSize = ko.computed(function () {
        var result = +self.length.observable() * +self.width.observable();
        if (result >= 3)
            return result
        else
            return 3;
    });

    self.fetchPrice = ko.computed(function () {
        var data = {
            productId: self.productId(),
            bespokeSize: self.bespokeSize()
        };

        if (self.parent.tradeAccount()) {
            data.tradeAccountId = self.parent.tradeAccount().TradeAccountID;
        }

        if (data.productId && data.bespokeSize && data.tradeAccountId) {

            self.busy(true);

            $.ajax({
                url: '/api/componentapi/fetchBespokeProductPrice',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('bespokeRugFactory fetchBespokeProductPrice returned', data);
                    self.price(data);

                    self.busy(false);
                }
            });
        } else {

        }
    });

    self.loaded.subscribe(function (newValue) {
        if (newValue) {
            window.setTimeout(function () {
                self.design.observable.mdcTextField.layout();
                self.length.observable.mdcTextField.layout();
                self.width.observable.mdcTextField.layout();
                self.cadEmail.observable.mdcTextField.layout();
                self.quantity.observable.mdcTextField.layout();
                self.dateRequired.observable.mdcTextField.layout();
            }, 300);
        }
    });

    self.dateRequired.observable.subscribe(function (newValue) {
        self.showDefaultLeadTimeMessage(false);
    });

    self.errors = ko.validation.group([
        self.design.observable,
        self.length.observable,
        self.width.observable,
        self.quantity.observable,
        self.cadEmail.observable
    ]);

    self.validate = function () {
        self.validateNow(true);
        if (self.errors().length) {
            self.errors.showAllMessages(true);
            self.design.observable.isValid.notifySubscribers(self.design.observable.isValid());
            self.length.observable.isValid.notifySubscribers(self.length.observable.isValid());
            self.width.observable.isValid.notifySubscribers(self.width.observable.isValid());
            self.quantity.observable.isValid.notifySubscribers(self.quantity.observable.isValid());
            self.cadEmail.observable.isValid.notifySubscribers(self.cadEmail.observable.isValid());
            return false;
        } else {
            self.errors.showAllMessages(false);
            return true;
        }
    }

    self.addToBasket = function () {

        self.validateNow(true);

        if (self.errors().length) {
            self.errors.showAllMessages(true);

            self.design.observable.isValid.notifySubscribers(self.design.observable.isValid());
            self.length.observable.isValid.notifySubscribers(self.length.observable.isValid());
            self.width.observable.isValid.notifySubscribers(self.width.observable.isValid());
            self.quantity.observable.isValid.notifySubscribers(self.quantity.observable.isValid());
            self.cadEmail.observable.isValid.notifySubscribers(self.cadEmail.observable.isValid());

        } else {
            self.errors.showAllMessages(false);

            var data = {
                tradeAccountId: self.parent.tradeAccount().TradeAccountID,
                basketId: self.parent.basketId(),
                basketItemTypeId: BASKETITEM_TYPE_BESPOKERUG,
                productId: self.productId(),
                quantity: self.quantity.observable(),
                stockLocationId: 107,  // ??? searchResult.fulfilmentOption().StockLocationID,
                fulfilmentTypeId: 1,  // ??? searchResult.fulfilmentOption().FulfilmentTypeID,
                lineReference: null,  // ??? searchResult.lineReference.observable(),
                orderTypeId: ORDERFACTORY_ADD_MODE_STOCK,
                bespokeModelProductId: self.designObj().value.ProductID,
                CADEmail: self.cadEmail.observable(),
                bespokeSize: self.bespokeSize(),
                bespokeTreatmentId: self.treatment.observable(),
                processAnswersJSON: self.toJSON()
            };

            console.log('bespokeRugFactory addBasketItem calling with', data);

            self.busy(true);

            $.ajax({
                url: '/api/componentapi/AddBasketItem',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('bespokeRugFactory addBasketItem returned', data);

                    self.busy(false);

                    if (data.addResult.BasketItemID != null) {

                        self.hide();
                        self.parent.fetchBasket();

                    } else {
                        $.showError(data.addResult, null, null);
                    }
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    $.showError('Sorry', 'There was an error attempting to add this item to your basket.');
                }
            });


            self.hide();
        }
    }

    self.open = function (data) {
        console.log('bespokeRugFactory open', data);
        self.busy(true);
        self.productId(data.record.ProductID);
        self.design.observable(data.record.Code + ' - ' + data.record.Design);
        self.designObj({
            value: data.record
        });
        self.determineDimensionality();
        self.show();
        self.busy(false);
    }

    self.determineDimensionality = function () {
        self.busy(true);
        $.ajax({
            url: '/api/componentapi/FetchRugShape',
            type: 'POST',
            dataType: 'json',
            data: {
                productId: self.productId()
            },
            success: function (data) {
                self.busy(false);
                if (data == 'Oval' || data == 'Round') {
                    self.roundRug(true);
                }
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    }

    self.load = function (data, bespokeJsonData) {
        var jsonData = JSON.parse(bespokeJsonData);

        console.log('bespokeRugFactory load', data, jsonData);

        self.basketItemId(data.basketItemId);
        self.productId(data.record.ProductID);
        self.design.observable(data.record.Code + ' - ' + data.record.Design);
        self.designObj({
            value: data.record
        });
        self.quantity.observable(data.quantity());

        if (jsonData) {
            self.length.observable(jsonData.length);
            self.width.observable(jsonData.width);
            self.cadEmail.observable(jsonData.cadEmail);
            self.roundRug(jsonData.roundRug == 'Y' ? true : false);

            self.directDispatch(jsonData.directDespatch == 'Y' ? true : false);

            var forwardOrderDate = null;

            if (jsonData.dateRequired && jsonData.dateRequired != 'N/A')
                forwardOrderDate = moment(jsonData.dateRequired, 'DD/MM/YY');

            if (forwardOrderDate) {
                self.dateRequired.observable(forwardOrderDate);
            }
        } else {

        }

        self.loaded(true);
    }

    self.save = function (onComplete) {
        //self.validateNow(true);
        //if (self.errors().length) {
        //    self.errors.showAllMessages(true);

        //    self.design.observable.isValid.notifySubscribers(self.design.observable.isValid());
        //    self.length.observable.isValid.notifySubscribers(self.length.observable.isValid());
        //    self.width.observable.isValid.notifySubscribers(self.width.observable.isValid());
        //    self.quantity.observable.isValid.notifySubscribers(self.quantity.observable.isValid());
        //    self.cadEmail.observable.isValid.notifySubscribers(self.cadEmail.observable.isValid());

        //} else {
        //    self.errors.showAllMessages(false);

        var data = {
            tradeAccountId: self.parent.tradeAccount().TradeAccountID,
            basketId: self.parent.basketId(),
            basketItemId: self.basketItemId(),
            basketItemTypeId: BASKETITEM_TYPE_BESPOKERUG,
            productId: self.productId(),
            quantity: self.quantity.observable(),
            stockLocationId: null,
            fulfilmentTypeId: null,
            lineReference: null,
            orderTypeId: ORDERFACTORY_ADD_MODE_STOCK,
            bespokeModelProductId: self.designObj().value.ProductID,
            CADEmail: self.cadEmail.observable(),
            bespokeSize: self.bespokeSize(),
            processAnswersJSON: self.toJSON(),
            backOrder: self.parent.parent.orderProductsDrilldown.addingProductToBasket().backOrder()
        };

        console.log('bespokeRugFactory updateBasketItem calling with', data);

        self.busy(true);

        self.parent.updateBasketItem(data, onComplete);
        //function () {
        //        self.busy(false);
        //        self.hide();
        //        self.parent.fetchBasket();
        //    }, function () {
        //        self.busy(false);
        //        console.log('bespokeRugFactory updateBasketItem failed');
        //    });
        //}
    }

    self.show = function () {
        //$('#bespoke-rug-modal').modal('show');
    }

    self.hide = function () {
        //$('#bespoke-rug-modal').modal('hide');
    }

    self.reset = function () {
        console.log('bespokeRugFactory reset called');
        self.busy(false);
        self.productId(undefined);
        self.basketItemId(undefined);
        self.design.observable(undefined);
        self.designObj(undefined);
        self.dateRequired.observable(undefined);
        self.showDefaultLeadTimeMessage(true);
        self.directDispatch(false);
        self.loaded(false);
        self.length.observable(undefined);
        self.width.observable(undefined);
        self.cadEmail.observable(undefined);
        self.roundRug(false);
        self.quantity.observable(1);
        self.validateNow(false);
        self.price(undefined);
    }

    self.toJSON = function () {
        var forwardOrderDate = null;

        if (self.dateRequired.observable())
            forwardOrderDate = moment(self.dateRequired.observable()).format('DD/MM/YY');

        return JSON.stringify({
            width: self.width.observable(),
            length: self.length.observable(),
            quantity: self.quantity.observable(),
            dateRequired: forwardOrderDate || 'N/A',
            directDespatch: self.directDispatch() ? 'Y' : 'N',
            cadEmail: self.cadEmail.observable(),
            roundRug: self.roundRug() ? 'Y' : 'N'
        });
    }

    //$('#bespoke-rug-modal').on('shown.bs.modal', function () {
    //    window.setTimeout(function () {

    //        self.design.observable.mdcTextField.layout();

    //        self.length.observable.mdcTextField.layout();

    //        self.width.observable.mdcTextField.layout();

    //        self.cadEmail.observable.mdcTextField.layout();

    //        self.quantity.observable.mdcTextField.layout();

    //        $('#bespoke-rugs-order-tab').tab('show');
    //    }, 100);
    //});

    //$('#bespoke-rug-modal').on('hide.bs.modal', function () {
    //    self.reset();
    //});
}

var bespokeFurnitureFactory = function (parent) {
    var self = this;

    //#region Properties

    self.parent = parent;

    self.busy = ko.observable(false);

    // is this used?
    self.productId = ko.observable();

    // is this used?
    self.display = ko.observable();

    // is this used?
    self.forwardOrderDate = ko.observable();

    // is this used?
    self.bespokeType = ko.observable('Furniture Header');

    // this is used to store the to-be-loaded data, when load is called
    self.record = ko.observable();

    self.bespokeFurnitureJson = ko.observable();

    self.validateNow = ko.observable(false);

    self.validateFabricNow = ko.observable(false);

    self.quantity = {
        label: 'Quantity',
        observable: ko.observable(1).extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: ' '
            },
            numberFormatted: {
                digits: 0,
                currency: {
                    FormattingCulture: 'en-GB'
                }
            },
            min: {
                params: 1,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Minimum 1 Item'
            },
            max: {
                params: 99,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Maximum 99 Items'
            },
            notEqual: {
                params: "",
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Quantity == ""'
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: false
    };

    self.design = ko.observable();
    self.model = ko.observable();
    self.supplier = ko.observable();

    self.modelDetails = ko.observable();

    self.leg = ko.observable();
    self.backFilling = ko.observable();
    self.coverType = ko.observable();
    self.seatFilling = ko.observable();
    self.domesticOrCommercial = ko.observable();
    self.upholsteryType = ko.observable();
    self.destination = ko.observable();
    self.country = ko.observable();
    self.headboardFixing = ko.observable();

    self.madeToUKFRStandardsVisible = ko.observable(false);

    self.madeToUKFRStandards = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.madeToUKFRStandardsVisible() && self.validateNow();
            },
            message: 'Made to UK FR Standards must be answered'
        }
    });

    self.buttonsVisible = ko.observable(false);
    self.buttons = ko.observable(false);

    self.trimVisible = ko.observable(false);
    self.trim = ko.observable();
    self.shipper = ko.observable();

    self.availableDesigns = ko.observableArray([]);
    self.availableModels = ko.observableArray([]);
    self.availableSuppliers = ko.observableArray([]);
    self.availableLegs = ko.observableArray([]);
    self.availableBackFillings = ko.observableArray([]);
    self.availableCoverTypes = ko.observableArray([]);
    self.availableSeatFillings = ko.observableArray([]);
    self.availableStitchColours = ko.observableArray([]);
    self.availableShippers = ko.observableArray([]);
    self.availableHeadboardFixings = ko.observableArray([]);

    self.materialsBreakdown = ko.observableArray([]);

    self.availableComponents = ko.observableArray([]);

    self.materialRequirements = ko.observableArray([]);

    self.basketItemsToProcess = ko.observableArray([]);

    self.currentlyProcessingBasketItem = ko.observable();

    self.destinationOptions = [{
        name: 'Customer\'s Delivery Address',
        value: 'CDA'
    }, {
        name: 'Designers Guild Warehouse',
        value: 'DGW'
    }];

    self.domesticOrCommercialOptions = [{
        name: 'Domestic',
        value: 'D'
    }, {
        name: 'Commercial',
        value: 'C'
    }];

    self.upholsteryTypeOptions = [{
        name: 'Single Fabric',
        value: 'S'
    }, {
        name: 'Mixed Fabrics',
        value: 'M'
    }];

    self.madeToUKFRStandardsOptions = [{
        name: 'Yes',
        value: true
    }, {
        name: 'No',
        value: false
    }]

    self.designId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow() && self.availableDesigns().length;
            },
            message: 'Design is required'
        }
    });

    self.modelId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow() && self.availableModels().length;
            },
            message: 'Model is required'
        }
    });

    self.supplierId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow() && self.availableSuppliers().length;
            },
            message: 'Supplier is required'
        }
    });

    self.legId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow() && self.availableLegs().length;
            },
            message: 'Leg Type is required'
        }
    });

    self.backFillingId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow() && self.availableBackFillings().length;
            },
            message: 'Back Filling is required'
        }
    });

    self.coverTypeId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow() && self.availableCoverTypes().length;
            },
            message: 'Cover Type  is required'
        }
    });

    self.seatFillingId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow() && self.availableSeatFillings().length;
            },
            message: 'Seat Filling is required'
        }
    });

    self.seatFillingId.subscribe(function (newValue) {
        console.log('seatFillingId subscribe hit', newValue);
    });

    self.domesticOrCommercialId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow();
            },
            message: 'Domestic or Commercial is Required'
        }
    });

    self.upholsteryTypeId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow();
            },
            message: 'Single or Mixed Fabric is Required'
        }
    });

    self.headboardFixingId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow() && self.availableHeadboardFixings().length
            },
            message: 'Headboard Fixing is Required'
        }
    });

    // Annoyingly it became necessary to proxy the loaded upholsteryTypeId value through here.
    // This is because under certain circumstances, the dropdownlist presenting the option is a) hidden and b) only carrying a single option.
    // This has meant that the subscription fired when upholsteryTypeId is changed started to fire too early, causing the call to
    // determineAvailableComponents to find materialBreakdown().length equal to 0.
    self.upholsteryTypeIdToLoad = ko.observable();

    self.destinationId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow();
            },
            message: 'Destination is Required'
        }
    });

    self.materialRequirementId = ko.observable();

    self.materialRequirement = ko.observable();

    self.forwardOrderDateOptions = {
        locale: 'en-gb',
        format: 'DD/MM/YYYY',
        ignoreReadonly: true,
        showClear: true,
        allowInputToggle: true,
        sideBySide: true,
        useCurrent: true,
        minDate: new moment().add(2, 'day').toDate(),
        showClose: true,
        keepInvalid: true
    };

    self.estimatedDispatchDate = ko.observable(new moment().add(1, 'day'));

    self.destinationCountry = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'Country is Required'
        }
    });

    self.destinationCountryId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'Country is Required'
        }
    });

    self.shipperId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow();
            },
            message: 'Shipper is Required'
        }
    })

    // Whether or not the cascade of subscription to data fetch is active
    self.cascadeActive = ko.observable(true);

    //#endregion

    //#region Computeds

    self.modelOptionsAvailable = ko.pureComputed(function () {
        return self.availableSeatFillings().length ||
            self.availableBackFillings().length ||
            self.availableCoverTypes().length ||
            self.availableLegs().length ||
            self.availableHeadboardFixings().length
    }, self);

    self.componentAllocationComplete = ko.computed(function () {
        return !Enumerable.From(self.basketItemsToProcess()).Where(function (x) {
            return !x.complete()
        }).Any();
    });

    self.mixedFabricPermitted = ko.pureComputed(function () {
        var result = false;
        if (self.design()) {
            result = self.design().permitMixedFabric;
        }
        if (!result) {
            self.upholsteryType(Enumerable.From(self.upholsteryTypeOptions).Where(function (x) {
                return x.value == 'S'
            }).Single());
            self.upholsteryTypeId('S');
        }
        return result;
    }, self);

    //#endregion

    //#region Components

    self.designParams = kendoMDCDropDownList({
        label: 'Design',
        textField: 'name',
        valueField: 'designId',
        data: self.availableDesigns,
        idObservable: self.designId,
        objObservable: self.design,
        showClear: true,
        afterClear: function () {
            //self.clearModelOptions('all');
        },
        permitRevert: false,
        height: 300,
        filter: 'startswith'
    });

    self.modelParams = kendoMDCDropDownList({
        label: 'Model',
        textField: 'name',
        valueField: 'modelId',
        data: self.availableModels,
        idObservable: self.modelId,
        objObservable: self.model,
        optionLabel: ' ',
        //optionLabelTemplate: {
        //    modelId: null,
        //    name: null
        //},
        showClear: true,
        permitRevert: false,
        afterClear: function () {
            //self.clearModelOptions('model');
        },
        height: 300,
        filter: null
    });

    self.supplierParams = kendoMDCDropDownList({
        label: 'Supplier',
        textField: 'name',
        valueField: 'supplierId',
        data: self.availableSuppliers,
        idObservable: self.supplierId,
        objObservable: self.supplier,
        showClear: true,
        afterClear: function () {
            //self.clearModelOptions();
        },
        permitRevert: false,
        height: 300,
        filter: null
    });

    self.legParams = kendoMDCDropDownList({
        label: 'Leg Type',
        textField: 'name',
        valueField: 'legId',
        data: self.availableLegs,
        idObservable: self.legId,
        objObservable: self.leg,
        showClear: true,
        //clearFunction: function () {
        //    self.legId(undefined);
        //},
        permitRevert: false,
        height: 300,
        filter: null
    });

    self.backFillingParams = kendoMDCDropDownList({
        label: 'Back Cushion Filling',
        textField: 'name',
        valueField: 'cushionFillingId',
        data: self.availableBackFillings,
        idObservable: self.backFillingId,
        objObservable: self.backFilling,
        showClear: true,
        //clearFunction: function () {
        //    self.backFillingId(undefined);
        //},
        permitRevert: false,
        height: 300,
        filter: null
    });

    self.coverTypeParams = kendoMDCDropDownList({
        label: 'Cover Type',
        textField: 'name',
        valueField: 'coverTypeId',
        data: self.availableCoverTypes,
        idObservable: self.coverTypeId,
        objObservable: self.coverType,
        showClear: true,
        //clearFunction: function () {
        //    self.coverTypeId(undefined);
        //},
        permitRevert: false,
        height: 300,
        filter: null
    });

    self.seatFillingParams = kendoMDCDropDownList({
        label: 'Seat Cushion Filling',
        textField: 'name',
        valueField: 'cushionFillingId',
        data: self.availableSeatFillings,
        idObservable: self.seatFillingId,
        objObservable: self.seatFilling,
        showClear: true,
        //clearFunction: function () {
        //    self.seatFillingId(undefined);
        //},
        permitRevert: false,
        height: 300,
        filter: null
    });

    self.domesticOrCommercialParams = kendoMDCDropDownList({
        label: 'Will this furniture be used in a Domestic or Commercial setting?',
        textField: 'name',
        valueField: 'value',
        data: self.domesticOrCommercialOptions,
        idObservable: self.domesticOrCommercialId,
        objObservable: self.domesticOrCommerical,
        showClear: true,
        //clearFunction: function () {
        //    self.domesticOrCommercialId(undefined);
        //},
        permitRevert: false,
        height: 300,
        filter: null
    });

    self.upholsteryTypeParams = kendoMDCDropDownList({
        label: 'Single or Mixed Fabric',
        textField: 'name',
        valueField: 'value',
        data: self.upholsteryTypeOptions,
        idObservable: self.upholsteryTypeId,
        objObservable: self.upholsteryType,
        showClear: true,
        //clearFunction: function () {
        //    self.upholsteryTypeId(undefined);
        //},
        permitRevert: false,
        height: 300,
        filter: null
    });

    self.destinationParams = kendoMDCDropDownList({
        label: 'Destination',
        textField: 'name',
        valueField: 'value',
        data: self.destinationOptions,
        idObservable: self.destinationId,
        objObservable: self.destination,
        showClear: true,
        permitRevert: false,
        height: 300,
        filter: null
    });

    self.headboardFixingParams = kendoMDCDropDownList({
        label: 'Headboard Fixing',
        textField: 'name',
        valueField: 'headboardFixingId',
        data: self.availableHeadboardFixings,
        idObservable: self.headboardFixingId,
        objObservable: self.headboardFixing,
        showClear: true,
        permitRevert: false,
        height: 300,
        filter: null,
        cascade: false,
        optionLabel: ''
    });

    self.madeToUKFRStandardsParams = kendoMDCDropDownList({
        //checkboxId: 'made-to-uk-fr-standards',
        //label:
        //observable: self.madeToUKFRStandards,
        //useNativeValidation: false,
        //disabled: false
        label: 'Does this piece need to be made to UK FR Standards?',
        textField: 'name',
        valueField: 'value',
        data: self.madeToUKFRStandardsOptions,
        idObservable: self.madeToUKFRStandards,
        //objObservable: ko.observable,
        showClear: true,
        permitRevert: false,
        filter: null
    });

    self.buttonParams = {
        checkboxId: 'model-buttons',
        label: 'Buttons are available on this model.<br/>I acknowledge that if my customer wants buttons, <span style="text-decoration: underline">I must place a separate order for the required fabric and mention the order number and purpose in this item&apos;s Line Memo.</span>',
        observable: self.buttons,
        useNativeValidation: false,
        disabled: false
    }

    self.trimParams = {
        checkboxId: 'model-trim',
        label: 'Trim is available on this model.<br/>I acknowledge that if my customer wants trim on this piece, <span style="text-decoration: underline">I must place a separate order for the required fabric and mention the order number and purpose in this item&apos;s Line Memo.</span>',
        observable: self.trim,
        useNativeValidation: false,
        disabled: false
    }

    self.materialRequirementParams = kendoMDCDropDownList({
        label: 'Material Group',
        textField: 'name',
        valueField: 'materialGroupId',
        data: self.materialRequirements,
        idObservable: self.materialRequirementId,
        objObservable: self.materialRequirement,
        showClear: true,
        permitRevert: false,
        height: 300,
        filter: null
    });

    self.destinationCountryDropDownList = {
        observable: self.destinationCountry,
        idObservable: self.destinationCountryId,
        showClear: true,
        label: 'Which country will this furniture be used in?',
        valuePrimitive: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        controlClass: 'form-control',
        disabled: ko.observable(false),
        dropDownListSettings: {
            value: self.destinationCountryId,
            dataItem: self.destinationCountry,
            dataValueField: 'CountryID',
            dataTextField: 'Name',
            widget: ko.observable(),
            height: 300,
            open: function (e) {
                $(e.sender._widgetOptions.dataItem.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            close: function (e) {
                $(e.sender._widgetOptions.dataItem.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            data: new kendo.data.DataSource({
                serverFiltering: true,
                serverSorting: true,
                serverGrouping: true,
                schema: $.extend({}, kendo.data.schemas.webapi, {
                    data: "Data",
                    total: "Total",
                    filters: "Filters",
                    aggregates: "Aggregates",
                    errors: "Errors"
                }),
                transport: {
                    read: function (options) {
                        var webapi = new kendo.data.transports.webapi({ prefix: "" });
                        var mapped = webapi.parameterMap(options.data);
                        var data = {};
                        for (var propertyName in mapped) {
                            data[propertyName] = mapped[propertyName];
                        }
                        data.includeEU = true;
                        $.ajax({
                            url: '/api/ComponentAPI/GetCountries',
                            type: "GET",
                            data: data,
                            success: function (data) {
                                options.success(data);
                            },
                            error: function (data) {
                                options.error();
                            }
                        });
                    }
                }
            }),
            valuePrimitive: false,
            autoWidth: false,
            autoBind: true,
            optionLabel: ' ',
            filter: 'startswith',
            popup: {
                appendTo: 'body'
            }
        },
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            self.idObservable(undefined);
            if (self.dropDownListSettings.widget()) {
                self.dropDownListSettings.widget().value('');
                self.dropDownListSettings.widget()._widgetOptions.dataItem.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                self.dropDownListSettings.widget()._widgetOptions.dataItem.mdcSelect.label_.float(false);
            }
        }
    }

    self.shipperParams = kendoMDCDropDownList({
        label: 'Which company will ship this furniture on from the Supplier?',
        textField: 'name',
        valueField: 'shipperId',
        data: self.availableShippers,
        idObservable: self.shipperId,
        objObservable: self.shipper,
        showClear: true,
        permitRevert: false,
        height: 300,
        filter: null
    });

    //#endregion

    //#region Subscriptions

    //self.materialsBreakdown.subscribe(function (newValues) {
    //    console.log('bespokeFurnitureFactory materialsBreakdown subscribe hit', newValues);
    //    self.availableComponents(self.determineAvailableComponents());
    //});

    self.upholsteryTypeId.subscribe(function (newValue) {

        if (self.cascadeActive()) {

            self.availableComponents(self.determineAvailableComponents());

        }

    });

    self.designId.subscribe(function (newValue) {
        console.log('bespokeFurnitureFactory designId subscribe hit', newValue);

        if (self.cascadeActive()) {

            self.validateNow(false);

            self.modelId(undefined);

            if (newValue)
                self.fetchModels();

        }
    });

    self.modelId.subscribe(function (newValue) {
        console.log('bespokeFurnitureFactory modelId subscribe hit', newValue);

        if (self.cascadeActive()) {

            self.validateNow(false);

            self.supplierParams.clearFunction();

            if (newValue)
                self.fetchSuppliers(function () {
                    window.setTimeout(function () {
                        if (self.availableSuppliers().length == 1) {
                            self.supplierParams.dropDownListSettings.widget().value(self.availableSuppliers()[0].supplierId);
                        }
                    }, 10);
                });
        }
    });

    self.supplierId.subscribe(function (newValue) {
        console.log('bespokeFurnitureFactory supplierId subscribe hit', newValue);

        if (newValue == 1) {
            self.madeToUKFRStandardsVisible(true);
        }
    });

    self.destinationId.subscribe(function (newValue) {
        console.log('bespokeFurnitureFactory destinationId subscribe hit', newValue);

        if (self.cascadeActive()) {

            self.clearModelOptions();

            if (newValue) {
                self.fetchModelOptions(function () {
                    self.fetchMaterialBreakdown(function () {
                        if (self.upholsteryTypeIdToLoad()) {
                            self.upholsteryTypeId(self.upholsteryTypeIdToLoad());
                        } else if (self.upholsteryTypeId()) {
                            self.availableComponents(self.determineAvailableComponents());
                        }
                    });
                });
            }
        }
    });

    self.modelDetails.subscribe(function (newValue) {
        console.log('bespokeFurnitureFactory modelDetails subscribe hit', newValue);

        if (newValue == null)
            return;

        if (newValue) {
            if (newValue.hasOwnProperty('options')) {
                if (newValue.options.hasOwnProperty('backFillings')) {
                    self.availableBackFillings(newValue.options.backFillings);
                }

                if (newValue.options.hasOwnProperty('coverTypes')) {
                    self.availableCoverTypes(newValue.options.coverTypes);
                }

                if (newValue.options.hasOwnProperty('legs')) {
                    self.availableLegs(newValue.options.legs);
                }

                if (newValue.options.hasOwnProperty('seatFillings')) {
                    self.availableSeatFillings(newValue.options.seatFillings);
                }

                if (newValue.options.hasOwnProperty('stitchColours')) {
                    self.availableStitchColours(newValue.options.stitchColours);
                }

                if (newValue.options.hasOwnProperty('shippers')) {
                    self.availableShippers(newValue.options.shippers);
                }

                if (newValue.options.hasOwnProperty('headboardFixings')) {
                    self.availableHeadboardFixings(newValue.options.headboardFixings);
                }
            }

            if (newValue.hasOwnProperty('button')) {
                self.buttonsVisible(newValue.button);
            }

            if (newValue.hasOwnProperty('trim')) {
                self.trimVisible(newValue.trim);
            }
        }

        //do the "do I only have one option?" dance
        window.setTimeout(function () {
            if (newValue) {
                if (newValue.hasOwnProperty('options')) {
                    if (newValue.options.hasOwnProperty('backFillings')) {
                        if (newValue.options.backFillings.length == 1 && self.backFillingId() == null) {
                            self.backFillingParams.dropDownListSettings.widget().value(self.availableBackFillings()[0].cushionFillingId);
                        }
                    }
                    if (newValue.options.hasOwnProperty('coverTypes')) {
                        if (newValue.options.coverTypes.length == 1 && self.coverTypeId() == null) {
                            self.coverTypeParams.dropDownListSettings.widget().value(self.availableCoverTypes()[0].coverTypeId);
                        }
                    }
                    if (newValue.options.hasOwnProperty('legs')) {
                        if (newValue.options.legs.length == 1 && self.legId() == null) {
                            self.legParams.dropDownListSettings.widget().value(self.availableLegs()[0].legId);
                        }
                    }
                    if (newValue.options.hasOwnProperty('seatFillings')) {
                        if (newValue.options.seatFillings.length == 1 && self.seatFillingId() == null) {
                            self.seatFillingParams.dropDownListSettings.widget().value(self.availableSeatFillings()[0].cushionFillingId);
                        }
                    }
                    if (newValue.options.hasOwnProperty('shippers')) {
                        if (newValue.options.shippers.length == 1 && self.shipperId() == null) {
                            self.shipperParams.dropDownListSettings.widget().value(self.availableShippers()[0].shipperId);
                        }
                    }
                    if (newValue.options.hasOwnProperty('headboardFixings')) {
                        if (newValue.options.headboardFixings.length == 1 && self.headboardFixingId() == null) {
                            self.headboardFixingParams.dropDownListSettings.widget().value(self.availableHeadboardFixings()[0].headboardFixingId);
                        }
                    }
                }
                if (newValue.hasOwnProperty('button')) {
                    self.buttonsVisible(newValue.button);
                }
                if (newValue.hasOwnProperty('trim')) {
                    self.trimVisible(newValue.trim);
                }
            }
        }, 0);
    });

    self.currentlyProcessingBasketItem.subscribe(function (newValue) {
        if (newValue) {
            self.beginProcessingBasketItem(newValue);
        }
    });

    //#endregion

    //#region Validation Groups

    self.errors = ko.validation.group([
        self.designId,
        self.modelId,
        self.supplierId,
        self.legId,
        self.seatFillingId,
        self.backFillingId,
        self.coverTypeId,
        self.shipperId,
        self.domesticOrCommercialId,
        self.upholsteryTypeId,
        self.destinationId,
        self.destinationCountryId,
        self.destinationCountry,
        self.madeToUKFRStandards,
        self.headboardFixingId,
        self.headboardFixing
    ]);

    self.fabricErrors = ko.validation.group([
        self.availableComponents
    ], {
        deep: true,
        live: true
    });

    //#endregion

    //#region Functions

    self.clearModelOptions = function () {
        console.log('bespokeFurnitureFactory clearModelOptions');

        self.modelDetails(undefined);
        self.materialRequirements([]);
        self.materialRequirementId(undefined);

        self.seatFillingParams.clearFunction();
        self.backFillingParams.clearFunction();
        self.coverTypeParams.clearFunction();
        self.shipperParams.clearFunction();

        self.legParams.clearFunction();
        self.upholsteryTypeParams.clearFunction();

        self.buttonsVisible(false);
        self.buttons(false);

        self.trimVisible(false);
        self.trim(false);

        self.domesticOrCommercialParams.clearFunction();

        self.availableSeatFillings.removeAll();
        self.availableBackFillings.removeAll();
        self.availableCoverTypes.removeAll();
        self.availableShippers.removeAll();
        self.availableLegs.removeAll();
        self.materialsBreakdown.removeAll();
        self.availableHeadboardFixings.removeAll();

        self.availableComponents([]);

        self.destinationCountryDropDownList.clearFunction();

        // What?! WHY??
        //self.bespokeFurnitureJson().specification = {};
    }

    self.determineMaterialRequirements = function () {
        console.log('bespokeFurnitureFactory determineMaterialRequirements');

        return Enumerable.From(self.materialsBreakdown()).GroupBy(function (x) {
            return {
                materialGroupId: x.MaterialGroupID,
                name: x.MaterialGroup
            }
        }, function (x) {
            return x
        }, function (key, group) {
            return {
                materialGroupId: key.materialGroupId,
                name: key.name,
                componentRequirements: Enumerable.From(group.source).GroupBy(function (y) {
                    return {
                        componentGroup: y.ComponentGroup,
                        componentGroupId: y.ComponentGroupID
                    }
                }, function (y) {
                    return y;
                }, function (groupKey, componentRequirementGroup) {
                    return {
                        componentGroupId: groupKey.componentGroupId,
                        name: groupKey.componentGroup,
                        componentRequirements: componentRequirementGroup.source
                    }
                }, function (y) {
                    return y.componentGroupId;
                }).ToArray()
            }
        }, function (x) {
            return x.materialGroupId;
        }).ToArray()
    }

    self.determineAvailableComponents = function () {
        console.log('bespokeFurnitureFactory determineAvailableComponents');
        switch (self.upholsteryTypeId()) {
            case 'S':
                return Enumerable.From(self.materialsBreakdown()).Where(function (x) {
                    return x.ComponentID == null;
                }).GroupBy(function (result) {
                    return {
                        componentId: result.ComponentID,
                        name: result.Component,
                        group: result.ComponentGroup,
                        groupId: result.ComponentGroupID
                    }
                }, function (component) {
                    return component
                }, function (key, componentGrouping) {
                    var fc = furnitureComponent({
                        key,
                        materialGroups: componentGrouping.source,
                        basketItemId: self.record().basketItemId,
                        modelId: self.modelId(),
                        supplierId: self.supplierId(),
                        validateNow: self.validateFabricNow,
                        leatherAvailable: self.modelDetails().leather,
                        stitchColours: self.availableStitchColours(),
                        parent: self
                    });
                    return fc;
                }, function (component) {
                    return JSON.stringify(component);
                }).ToArray()
                break;
            case 'M':
                return Enumerable.From(self.materialsBreakdown()).Where(function (x) {
                    return x.ComponentID != null;
                }).GroupBy(function (result) {
                    return {
                        componentId: result.ComponentID,
                        name: result.Component,
                        group: result.ComponentGroup,
                        groupId: result.ComponentGroupID
                    }
                }, function (component) {
                    return component
                }, function (key, componentGrouping) {
                    var fc = furnitureComponent({
                        key,
                        materialGroups: componentGrouping.source,
                        basketItemId: self.record().basketItemId,
                        modelId: self.modelId(),
                        supplierId: self.supplierId(),
                        validateNow: self.validateFabricNow,
                        leatherAvailable: self.modelDetails().leather,
                        stitchColours: self.availableStitchColours(),
                        parent: self
                    });
                    return fc;
                }, function (component) {
                    return JSON.stringify(component);
                }).ToArray()
                break;
            default:
                return [];
                break;
        }
    }

    self.fetchDesigns = function (onComplete) {
        var data = {
            basketItemId: self.record().basketItemId
        }
        console.log('bespokeFurnitureFactory fetchDesigns', data);
        self.busy(true);
        $.ajax({
            url: '/api/componentapi/FetchFurnitureDesigns',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('bespokeFurnitureFactory fetchDesigns returned', data);
                self.availableDesigns(data.designs);
                //self.designParams.dataSource.read();
                self.busy(false);
                if (typeof onComplete === 'function')
                    onComplete();
            }
        });
    }

    self.fetchModels = function (onComplete) {
        var data = {
            basketItemId: self.record().basketItemId,
            designId: self.designId()
        }
        console.log('bespokeFurnitureFactory fetchModels', data);
        $.ajax({
            url: '/api/componentapi/FetchFurnitureModels',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('fetchModels returned', data);
                self.availableModels(data.models);
                if (typeof onComplete === 'function')
                    onComplete();

                window.setTimeout(function () {
                    if (self.bespokeFurnitureJson()) {
                        self.modelId(self.bespokeFurnitureJson().modelId);
                        delete self.bespokeFurnitureJson().modelId;
                    } else {
                        //self.clearModelOptions('all');
                    }
                }, 0);
            }
        });
    }

    self.fetchSuppliers = function (onComplete) {
        var data = {
            basketItemId: self.record().basketItemId,
            modelId: self.modelId()
        }
        console.log('bespokeFurnitureFactory fetchSuppliers', data);
        $.ajax({
            url: '/api/componentapi/FetchFurnitureSuppliers',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('fetchSuppliers returned', data);
                self.availableSuppliers(data.suppliers);

                if (typeof onComplete === 'function')
                    onComplete();

                window.setTimeout(function () {
                    if (self.bespokeFurnitureJson()) {
                        self.supplierParams.dropDownListSettings.widget().value(self.bespokeFurnitureJson().supplierId);
                    } else {
                        //self.clearModelOptions('model');
                    }
                }, 0);
            }
        });
    }

    self.fetchModelOptions = function (onComplete) {
        self.busy(true);
        var data = {
            basketItemId: self.record().basketItemId,
            modelId: self.modelId(),
            supplierId: self.supplierId(),
            furnitureDeliveryTo: self.destinationId()
        }
        console.log('bespokeFurnitureFactory fetchModelOptions', data);
        $.ajax({
            url: '/api/componentapi/FetchFurnitureModelOptions',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('fetchModelOptions returned', data);
                self.modelDetails(data.json);
                if (typeof onComplete === 'function')
                    onComplete();
            }
        });
    }

    self.fetchMaterialBreakdown = function (onComplete) {
        var data = {
            basketItemId: self.record().basketItemId,
            modelId: self.modelId(),
            supplierId: self.supplierId()
        }
        console.log('fetchMaterialBreakdown', data);
        self.busy(true);
        $.ajax({
            url: '/api/componentapi/FetchFurnitureMaterialBreakdown',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('bespokeFurnitureFactory fetchMaterialBreakdown returned', data);
                self.materialsBreakdown(data.results);
                self.materialRequirements(self.determineMaterialRequirements());
                window.setTimeout(function () {
                    self.materialRequirementId(Enumerable.From(self.materialRequirements()).Select(function (x) {
                        return x.materialGroupId
                    }).FirstOrDefault());
                }, 0);
                self.busy(false);
                if (typeof onComplete === 'function')
                    onComplete();
            }
        });
    }

    self.addToBasket = function () {

        self.validateNow(true);

        // not sure why this timeout should be required: this
        // validateNow pattern functions perfectly well elsewhere
        // without the need for a timeout 0.
        window.setTimeout(function () {
            if (self.errors().length) {
                self.errors.showAllMessages(true);
            } else {
                self.errors.showAllMessages(false);

                var forwardOrderDate = null;

                if (self.forwardOrderDate())
                    forwardOrderDate = moment(self.forwardOrderDate()).toISOString();

                var data = {
                    tradeAccountId: self.parent.tradeAccount().TradeAccountID,
                    basketId: self.parent.basketId(),
                    basketItemTypeId: BASKETITEM_TYPE_BESPOKEFURNITURE,
                    productId: self.productId(),
                    quantity: self.quantity(),
                    stockLocationId: 107,  // ??? searchResult.fulfilmentOption().StockLocationID,
                    fulfilmentTypeId: 1,  // ??? searchResult.fulfilmentOption().FulfilmentTypeID,
                    lineReference: null,  // ??? searchResult.lineReference.observable(),
                    orderTypeId: ORDERFACTORY_ADD_MODE_STOCK,
                    //bespokeModelProductId: self.model().record.ProductID,
                    feelerLength: self.length()
                };

                console.log('bespokeFurnitureFactory addBasketItem', data);

                self.busy(true);

                $.ajax({
                    url: '/api/componentapi/AddBasketItem',
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    success: function (data) {
                        console.log('bespokeFurnitureFactory addBasketItem returned', data);

                        self.busy(false);

                        if (data.addResult.BasketItemID != null) {

                            self.hide();
                            self.parent.fetchBasket();

                        } else {
                            $.showError(data.addResult, null, null);
                        }
                    },
                    error: function (xhr, s, a) {
                        self.busy(false);
                        $.showError('Sorry', 'There was an error attempting to add this item to your basket.');
                    }
                });

                self.hide();
            }
        }, 0);
    }

    self.open = function (data) {
        console.log('bespokeFurnitureFactory open', data);
        self.productId(data.record.ProductID);
        self.show();
    }

    self.load = function (data) {
        console.log('bespokeFurnitureFactory load', data);

        self.quantity.observable(+data.quantity());

        self.productId(data.record.ProductID);
        self.record(data);

        if (data.record.BespokeFurnitureJSON) {
            self.cascadeActive(false);

            var j = JSON.parse(data.record.BespokeFurnitureJSON);

            self.availableDesigns(j.availableDesigns);
            self.designId(j.designId);

            self.availableModels(j.availableModels);
            self.modelId(j.modelId);

            self.availableSuppliers(j.availableSuppliers);
            self.supplierId(j.supplierId);

            self.modelDetails(j.modelDetails);

            window.setTimeout(function () {
                self.backFillingId(j.specification.backFillingId);
                self.seatFillingId(j.specification.seatFillingId);
                self.coverTypeId(j.specification.coverTypeId);
                self.legId(j.specification.legId);
                self.shipperId(j.specification.shipperId);
                self.destinationCountryId(j.specification.destinationCountryId);
                self.domesticOrCommercialId(j.specification.domesticOrCommercialId);
                self.buttons(j.specification.buttons);
                self.trim(j.specification.trim);
                self.madeToUKFRStandards(j.specification.madeToUKFRStandards);
                self.destinationId(j.specification.destinationId);
                self.headboardFixingId(j.specification.headboardFixingId);
                self.fetchMaterialBreakdown(function () {
                    self.availableComponents(self.determineAvailableComponents());
                    window.setTimeout(function () {
                        if (j.specification.hasOwnProperty('materialBreakdown')) {
                            ko.utils.arrayForEach(self.availableComponents(), function (ac) {
                                var loadedData = Enumerable.From(j.specification.materialBreakdown).Where(function (x) {
                                    return x.key.componentId == ac.key.componentId && x.key.groupId == ac.key.groupId
                                }).SingleOrDefault();
                                if (loadedData != null) {
                                    window.setTimeout(function () {
                                        ac.load(loadedData);
                                    }, 0);
                                }
                            });
                        }
                    }, 0);
                });
                self.cascadeActive(true);
            }, 0);

            self.bespokeFurnitureJson(j);
        }
        else {
            self.cascadeActive(true);
            self.fetchDesigns();
        }
    }

    self.validate = function () {
        console.log('bespokeFurnitureFactory validate');

        self.validateNow(true);
        if (self.errors().length) {
            self.errors.showAllMessages(true);
            self.errors.filter(function (x) {
                x.isValid.notifySubscribers(x.isValid());
            })
            return false;
        } else {
            self.errors.showAllMessages(false);
            return true;
        }
    }

    self.save = function (onComplete) {
        var data = self.toJS();
        console.log('bespokeFurnitureFactory save', data);
        //self.busy(true);
        $.ajax({
            url: '/api/componentapi/SaveBespokeFurnitureJson',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('bespokeFurnitureFactory save returned', data);
                //self.busy(false);
                self.record().record.BespokeFurnitureJSON = data.json;
                if (typeof onComplete === 'function')
                    onComplete();
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    self.validateFabric = function () {
        return new Promise(function (resolve, reject) {

            console.log('bespokeFurnitureFactory validateFabric');

            self.validateFabricNow(true);

            window.setTimeout(function () {
                if (self.fabricErrors().length) {
                    self.fabricErrors.showAllMessages(true);
                    self.fabricErrors.filter(function (x) {
                        x.isValid.notifySubscribers(x.isValid());
                    })
                    reject('Invalid: components not material-complete');
                } else {
                    self.errors.showAllMessages(false);
                    resolve();
                }
            }, 0);

        });
    }

    self.loadFabric = function (data) {
        console.log('bespokeFurnitureFactory loadFabric', data);
        self.validateFabricNow(false);
    }

    self.loadAllocationStage = function (data) {

        var passData = {
            basketItemId: self.record().basketItemId
        };

        console.log('bespokeFurnitureFactory loadAllocationStage', passData);

        self.parent.parent.orderProductsDrilldownFurnitureComponents.reset();
        self.parent.parent.orderProductsDrilldownFurnitureComponents.allocationStockLocation.skipSubscription(true);

        self.busy(true);

        $.ajax({
            url: '/api/componentapi/BespokeFurnitureBasketItemSelect',
            type: 'POST',
            dataType: 'json',
            data: passData,
            success: function (basketItemIds) {
                console.log('loadAllocationStage returned', basketItemIds);
                self.busy(false);
                if (basketItemIds.length) {
                    var results = $.map(basketItemIds, function (id, ind) {
                        return {
                            basketItemId: id,
                            sortOrder: ind + 1,
                            complete: ko.observable(false)
                        }
                    });

                    self.basketItemsToProcess(results); // Noooooooow. How... am I to know... what to do with these?
                    // Erm... well th... they all need to be allocated. And price reviewd, and... whatever other steps.
                    self.currentlyProcessingBasketItem(Enumerable.From(self.basketItemsToProcess()).OrderBy('$.ind').First());
                } else {
                    self.parent.parent.orderProductsDrilldown.nextStage();
                }
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    self.progressComponentAllocation = function (onComplete) {
        console.log('bespokeFurnitureFactory progressComponentAllocation');
        //if (typeof onComplete === 'function')
        //    onComplete();
        var current = Enumerable.From(self.basketItemsToProcess()).Where(function (x) {
            return x.basketItemId == self.currentlyProcessingBasketItem().basketItemId;
        }).Single();
        current.complete(true);
        var next = Enumerable.From(self.basketItemsToProcess()).Where(function (x) {
            return x.complete() == false;
        }).OrderBy('$.ind').FirstOrDefault();
        if (next) {
            self.currentlyProcessingBasketItem(next);
        } else {
            // are we done with allocating our component fabrics now?
            console.log('progressComponentAllocation completed');

            self.save(function () {
                window.setTimeout(function () {
                    self.parent.parent.orderProductsDrilldown.nextStage();
                }, 0);
            });
        }
    }

    self.proceedToFurniturePricing = function (onComplete) {
        console.log('bespokeFurnitureFactory proceedToFurniturePricing');
        if (typeof onComplete === 'function')
            onComplete();
        return true;
    }

    self.validateAllocation = function (data) {
        return new Promise(function (resolve, reject) {

            if (Enumerable.From(self.availableComponents()).Where(function (x) {
                return x.materialTypeId() == 'O'
            }).Count() == self.availableComponents().length) {
                console.log('bespokeFurnitureFactory validateAllocation ~ all Customers Own ~ COMPLETE', data);
                resolve();
                return;
            }

            if (self.basketItemsToProcess().length == 0) {
                $.info('Information', 'Hurry up and wait.');
                reject();
                return;
            }
            if (self.componentAllocationComplete()) {
                console.log('validateAllocation ~ COMPLETE', data);
                resolve();
                return;
            } else {
                console.log('validateAllocation ~ INCOMPLETE', data);
                $.info('Information', 'You have not finished allocating material for the components of this piece of furniture.');
                self.parent.parent.orderProductsDrilldown.processingBusy(false);
                reject();
                return;
            }
        });
    }

    self.beginProcessingBasketItem = function (bi) {
        console.log('bespokeFurnitureFactory beginProcessingBasketItem', bi);
        self.parent.parent.orderProductsDrilldownFurnitureComponents.processingBusy(true);
        self.parent.loadBasketItemForEdit({ BasketItemID: bi.basketItemId }, true);
    }

    self.show = function () {
        console.log('bespokeFurnitureFactory show');
        //$('#bespoke-furniture-modal').modal('show');
    }

    self.hide = function () {
        console.log('bespokeFurnitureFactory hide');
        //$('#bespoke-furniture-modal').modal('hide');
    }

    self.reset = function () {
        console.log('bespokeFurnitureFactory reset');

        if (self.record())
            self.record().reset();

        self.estimatedDispatchDate(new moment().add(1, 'day'));

        self.materialRequirement(undefined);

        self.materialRequirementId(undefined);

        self.destinationId(undefined);

        self.destinationCountryId(undefined);

        self.upholsteryTypeId(undefined);
        self.upholsteryTypeIdToLoad(undefined);

        self.domesticOrCommercialId(undefined);

        self.seatFillingId(undefined);

        self.coverTypeId(undefined);

        self.shipperId(undefined);

        self.backFillingId(undefined);

        self.legId(undefined);

        self.supplierId(undefined);

        self.modelId(undefined);

        self.headboardFixingId(undefined);

        self.currentlyProcessingBasketItem(undefined);

        self.basketItemsToProcess([]);

        self.materialRequirements([]);

        self.availableComponents([]);

        self.materialsBreakdown([]);

        self.availableSeatFillings([]);
        self.availableCoverTypes([]);
        self.availableBackFillings([]);
        self.availableLegs([]);
        self.availableSuppliers([]);
        self.availableModels([]);
        self.availableDesigns([]);
        self.availableStitchColours([]);
        self.availableHeadboardFixings([]);

        self.trim(false);
        self.trimVisible(false);

        self.buttons(false);
        self.buttonsVisible(false);

        self.madeToUKFRStandards(undefined);
        self.madeToUKFRStandardsVisible(false);

        self.upholsteryType(undefined);

        self.domesticOrCommercial(undefined);

        self.seatFilling(undefined);

        self.coverType(undefined);

        self.backFilling(undefined);

        self.leg(undefined);

        self.modelDetails(undefined);

        self.supplier(undefined);

        self.model(undefined);

        self.headboardFixing(undefined);

        self.designParams.clearFunction();

        self.quantity.observable(undefined);

        self.validateFabricNow(false);

        self.validateNow(false);

        self.bespokeFurnitureJson(undefined);

        self.record(undefined);

        self.bespokeType('Furniture Header');

        self.forwardOrderDate(undefined);

        self.display(undefined);

        self.productId(undefined);

        self.busy(false);
    }

    self.toJS = function () {
        console.log('bespokeFurnitureFactory toJS')
        return {
            basketItemId: self.record().basketItemId,
            advancedOrderStepId: self.parent.parent.orderProductsDrilldown.stageInformation().currentStage().StepID,
            supplierId: self.supplierId(),
            destinationId: self.destinationId(),
            json: JSON.stringify({
                tradeAccountCode: self.parent.tradeAccount()?.Code,
                tradeAccountName: self.parent.tradeAccount()?.Name,
                quantity: self.quantity.observable(),
                availableDesigns: self.availableDesigns(),
                designId: self.designId(),
                design: self.design()?.name,
                availableModels: self.availableModels(),
                modelId: self.modelId(),
                model: self.model()?.name,
                modelDetails: self.modelDetails(),
                availableSuppliers: self.availableSuppliers(),
                supplierId: self.supplierId(),
                supplier: self.supplier()?.name,
                domesticOrCommercialId: self.domesticOrCommercialId(),
                specification: {
                    availableLegs: self.availableLegs(),
                    legId: self.legId(),
                    leg: self.leg()?.name,
                    availableBackFillings: self.availableBackFillings(),
                    backFillingId: self.backFillingId(),
                    backFilling: self.backFilling()?.name,
                    availableSeatFillings: self.availableSeatFillings(),
                    seatFillingId: self.seatFillingId(),
                    seatFilling: self.seatFilling()?.name,
                    availableCoverTypes: self.availableCoverTypes(),
                    coverTypeId: self.coverTypeId(),
                    coverType: self.coverType()?.name,
                    availableShippers: self.availableShippers(),
                    shipperId: self.shipperId(),
                    shipper: self.shipper()?.name,
                    availableUpholsteryTypes: self.upholsteryTypeOptions,
                    upholsteryTypeId: self.upholsteryTypeId(),
                    materialBreakdown: self.materialBreakdownJS(),
                    buttonsVisible: self.buttonsVisible(),
                    buttons: self.buttons(),
                    trimVisible: self.trimVisible(),
                    trim: self.trim(),
                    madeToUKFRStandards: self.madeToUKFRStandards(),
                    destinationId: self.destinationId(),
                    destinationCountryId: self.destinationCountryId(),
                    domesticOrCommercialId: self.domesticOrCommercialId(),
                    availableHeadboardFixings: self.availableHeadboardFixings(),
                    headboardFixingId: self.headboardFixingId(),
                    headboardFixing: self.headboardFixing()?.name
                }
            })
        }
    }

    self.materialBreakdownJS = function () {
        console.log('bespokeFurnitureFactory materialBreakdownJS');

        var result = [];

        ko.utils.arrayForEach(self.availableComponents(), function (com) {
            var componentJs = com.toJS();
            if (componentJs) {
                if (componentJs.product)
                    delete componentJs.product.copyToBootstrapPopoverDetails;
                result.push(componentJs);
            }
        });

        return result;
    }

    //#endregion

    //#region Events

    //#endregion

}

const furnitureComponent = ({
    key = {},
    basketItemId = null,
    modelId = null,
    supplierId = null,
    validateNow = ko.observable(false),
    leatherAvailable = false,
    stitchColours = [],
    parent = {}
} = {}) => (function () {
    var self = {};

    self.materialTypes = [];

    if (leatherAvailable) {
        self.materialTypes = [{
            name: 'Fabric',
            value: 'F'
        }, {
            name: 'Leather',
            value: 'L'
        }, {
            name: 'Customer\'s Own',
            value: 'O'
        }];
    } else {
        self.materialTypes = [{
            name: 'Fabric',
            value: 'F'
        }, {
            name: 'Customer\'s Own',
            value: 'O'
        }];
    }

    self.key = key;

    self.parent = parent;

    self.parent.__kv_traversed = true; // prevent knockout validation group deep from recursing infinitely because parent -> child -> parent

    self.basketItemId = basketItemId;

    self.modelId = modelId;

    self.supplierId = supplierId;

    self.validateNow = validateNow;

    self.materialType = ko.observable();

    self.materialTypeId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow() && self.materialTypeId() != 'O'
            },
            message: 'materialTypeId is required'
        }
    });

    self.materialTypeParams = kendoMDCDropDownList({
        label: 'Material Type',
        textField: 'name',
        valueField: 'value',
        data: self.materialTypes,
        idObservable: self.materialTypeId,
        objObservable: self.materialType,
        showClear: true,
        clearFunction: function () {
            self.materialTypeId(undefined);
        },
        permitRevert: false,
        filter: null
    });

    self.materialTypeId.subscribe(function (newValue) {
        self.clearMaterial(undefined);
    });

    self.stitchColour = ko.observable();

    self.availableStitchColours = ko.observableArray(stitchColours);

    let stitchColourId = undefined;

    if (self.availableStitchColours().length == 1) {
        stitchColourId = self.availableStitchColours()[0].stitchColourId;
    }

    self.stitchColourId = ko.observable(stitchColourId).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow() && self.availableStitchColours().length;
            },
            message: 'Stitch Colour is required'
        }
    });

    self.defaultStitchColourId = ko.observable()

    self.stitchColourParams = kendoMDCDropDownList({
        label: 'Stitch Colour',
        textField: 'name',
        valueField: 'stitchColourId',
        data: self.availableStitchColours,
        idObservable: self.stitchColourId,
        objObservable: self.stitchColour,
        showClear: true,
        permitRevert: true,
        height: 300,
        filter: null,
        revertFunction: function () {
            self.stitchColourId(self.defaultStitchColourId());
        },
        useKOTemplates: true,
        template: 'stitch-colour-template',
        valueTemplate: 'stitch-colour-template'
    });

    self.interliningVisible = ko.observable(true);

    self.interlining = ko.observable();

    self.interliningOptions = [{
        name: 'Interlined',
        value: 'Y'
    }, {
        name: 'Not Interlined',
        value: 'N'
    }];

    self.interliningId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow() && self.interliningVisible();
            },
            message: 'Interlining (Y/N) is Required'
        }
    });

    self.interliningParams = kendoMDCDropDownList({
        label: 'Do you want this fabric to be interlined?',
        textField: 'name',
        valueField: 'value',
        data: self.interliningOptions,
        idObservable: self.interliningId,
        objObservable: self.interlining,
        showClear: true,
        permitRevert: false,
        height: 300,
        filter: null
    });

    self.materialTypeId.subscribe(function (newValue) {
        switch (newValue) {
            case 'O': {
                //self.interliningVisible(false);
                //self.interliningId(undefined);
                break;
            }
            case 'F':
            case 'L': {
                self.interliningVisible(true);
                break;
            }
            default: {
                self.interliningVisible(false);
                break;
            }
        }
    });

    self.customersProductCode = {
        label: 'Product Code',
        observable: ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow() && self.materialTypeId() == 'O'
                },
                message: 'Customer Product Code is required'
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 100
        }
    };

    self.customersDescription = {
        label: 'Description',
        observable: ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow() && self.materialTypeId() == 'O'
                },
                message: 'Customer Description is required'
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 500
        }
    };

    self.customersSupplier = {
        label: 'Supplier',
        observable: ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow() && self.materialTypeId() == 'O'
                },
                message: 'Customer Supplier is required'
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 500
        }
    };

    self.customersWidth = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow() && self.materialTypeId() == 'O'
            },
            message: 'Width is required'
        },
        numberFormatted: {
            digits: 1,
            currency: {
                FormattingCulture: 'en-GB'
            },
            minValue: 0,
            maxValue: 99999
        }
    });

    self.customersWidthParams = {
        label: 'Material Width (cm)',
        observable: self.customersWidth,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        showClear: false
    };

    self.customersVerticalPatternRepeat = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow() && self.materialTypeId() == 'O'
            },
            message: 'Vertical Pattern Repeat is required'
        },
        numberFormatted: {
            digits: 1,
            currency: {
                FormattingCulture: 'en-GB'
            },
            minValue: 0,
            maxValue: 99999
        }
    });

    self.customersVerticalPatternRepeatParams = {
        label: 'Pattern Repeat - Vertical (cm)',
        observable: self.customersVerticalPatternRepeat,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        showClear: false
    };

    self.customersQuantityRequired = ko.observable();

    self.bespokeMaterialSearch = ko.observable().extend({
        required: false
    });

    self.bespokeMaterialAutocompleteResults = ko.observableArray([]);

    self.bespokeFurnitureMaterialAutocomplete = {
        label: 'Search for Material by Code or Name',
        observable: self.bespokeMaterialSearch,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            self.bespokeMaterialSearch(undefined);
            self.bespokeFurnitureMaterialAutocomplete.observable(undefined);
            self.bespokeMaterialAutocompleteResults([]);
            $(self.bespokeFurnitureMaterialAutocomplete.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        },
        autocompleteSettings: {
            value: self.bespokeMaterialSearch,
            appendTo: 'body',
            source: function (request, response) {
                var data = {
                    basketItemId: self.basketItemId,
                    modelId: self.modelId,
                    supplierId: self.supplierId,
                    componentId: self.key.componentId,
                    materialTypeId: self.materialTypeId(),
                    searchString: request.term,
                    customersOwnWidth: self.customersWidth(),
                    customersOwnPatternRepeat: self.customersVerticalPatternRepeat()
                };
                $.ajax({
                    url: '/api/ComponentAPI/BespokeFurnitureMaterialSearch',
                    type: "POST",
                    dataType: "json",
                    data: data,
                    success: function (data) {
                        console.log('bespokeFurnitureMaterialAutocomplete returned', data);
                        self.bespokeMaterialAutocompleteResults($.map(data.results, function (p) {
                            return {
                                productId: p.ProductID,
                                label: p.Code + ' - ' + p.Name,
                                value: p,
                                available: p.Available,
                                unavailableMessage: p.UnavailableMessage,
                                copyToBootstrapPopoverDetails: {
                                    componentId: self.key.componentId,
                                    title: 'Copy To',
                                    content: function () {
                                        var result = $('<ul class="copy-list"></ul>');
                                        ko.utils.arrayForEach(Enumerable.From(self.parent.availableComponents()).Where(function (x) {
                                            return (x.key.componentId != self.key.componentId)
                                        }).OrderBy('$.key.group').ThenBy('$.key.name').ToArray(), function (c) {
                                            if (c.selectedMaterial()) {
                                                result.append($(`<li><img class="thumb" data-bind="attr: { src: 'https://www.designersguild.com/image/32/${c.selectedMaterial().value.ImageID}' }" /><a data-bind="click: function(data) { copyToComponent(data, ${c.key.componentId}, ${c.key.groupId}) }">${c.key.group}: ${c.key.name}</a></li>`));
                                            } else {
                                                result.append($(`<li><div class="thumb"></div><a data-bind="click: function(data) { copyToComponent(data, ${c.key.componentId}, ${c.key.groupId}) }">${c.key.group}: ${c.key.name}</a></li>`));
                                            }
                                        })
                                        return result;
                                    },
                                    placement: 'right',
                                    trigger: 'click',
                                    copyToComponent: function (data, targetComponentId, targetGroupId) {
                                        console.log('copyToComponent calling with', data, targetComponentId, targetGroupId);
                                        var target = Enumerable.From(self.parent.availableComponents()).Where(function (c) {
                                            return c.key.groupId == targetGroupId &&
                                                c.key.componentId == targetComponentId;
                                        }).Single();
                                        target.clearMaterial();
                                        target.materialTypeId(self.materialTypeId());
                                        target.bespokeFurnitureMaterialAutocomplete.observable(self.selectedMaterial().value.Code);
                                        window.setTimeout(function () {
                                            $(target.bespokeFurnitureMaterialAutocomplete.observable.DOMElement).one("autocompleteresponse", function (event, ui) {
                                                if (target.bespokeMaterialAutocompleteResults().length == 1) {
                                                    target.selectMaterial(target.bespokeMaterialAutocompleteResults()[0]);
                                                    window.setTimeout(function () {
                                                        $(data.popObject).popover('hide');
                                                        $(data.popObject).popover('show');
                                                    }, 0);
                                                }
                                                target.stitchColourId(self.stitchColourId());
                                                target.interliningId(self.interliningId());
                                            });
                                            $(target.bespokeFurnitureMaterialAutocomplete.observable.DOMElement).autocomplete('search');
                                        }, 0);
                                    }
                                }
                            };
                        }));
                        response();
                    }
                });
            },
            minLength: 1,
            select: function (event, ui) {
                event.preventDefault();
                self.bespokeFurnitureMaterialAutocomplete.observable(ui.item.label);
                self.bespokeMaterialSearch(ui.item.value);
            }
        }
    };

    self.selectedMaterial = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow() && self.materialTypeId() != 'O'
            },
            message: 'selectedMaterial is required'
        }
    });

    self.selectedMaterial.isValid.subscribe(function (newValue) {
        if (newValue == false) {
            self.bespokeMaterialSearch.setError('selectedMaterial is required [by proxy]', self);
        } else {
            self.bespokeMaterialSearch.clearError();
        }
    });

    self.selectMaterial = function (result) {
        if (result.available) {
            self.selectedMaterial(result);
            self.stitchColourId(result.value.RecommendedStitchColourID);
            self.defaultStitchColourId(result.value.RecommendedStitchColourID);
            self.bespokeFurnitureMaterialAutocomplete.clearFunction();
        }
    }

    self.clearMaterial = function () {
        self.selectedMaterial(undefined);
    }

    self.load = function (data) {
        console.log('furnitureComponent load called', data);

        self.key = data.key;
        self.basketItemId = data.basketItemId;
        self.modelId = data.modelId;
        self.supplierId = data.supplierId;
        self.materialTypeId(data.materialTypeId);
        self.componentId = data.key.ComponentID;
        self.productId = data.productId;
        self.VerticalPatternRepeatCM = data.VerticalPatternRepeatCM;
        self.WidthCM = data.widthCM;
        self.UpholsteryGrade = data.upholsteryGrade;
        self.requirementM = data.requirementM;
        self.customersProductCode.observable(data.customersProductCode);
        self.customersDescription.observable(data.customersDescription);
        self.customersSupplier.observable(data.customersSupplier);
        self.customersWidth(data.customersWidth);
        self.customersVerticalPatternRepeat(data.customersVerticalPatternRepeat);
        self.customersQuantityRequired(data.customersQuantityRequired);
        self.stitchColourId(data.stitchColourId);
        self.interliningId(data.interline);

        window.setTimeout(function () {
            if (data.product) {
                if (!data.product.hasOwnProperty('copyToBootstrapPopoverDetails')) {
                    data.product.copyToBootstrapPopoverDetails = {
                        componentId: self.key.componentId,
                        title: 'Copy To',
                        content: function () {
                            var result = $('<ul class="copy-list"></ul>');
                            ko.utils.arrayForEach(Enumerable.From(self.parent.availableComponents()).Where(function (x) {
                                return (x.key.componentId != self.key.componentId)
                            }).OrderBy('$.key.group').ThenBy('$.key.name').ToArray(), function (c) {
                                if (c.selectedMaterial()) {
                                    result.append($(`<li><img class="thumb" data-bind="attr: { src: 'https://www.designersguild.com/image/32/${c.selectedMaterial().value.ImageID}' }" /><a data-bind="click: function(data) { copyToComponent(data, ${c.key.componentId}, ${c.key.groupId}) }">${c.key.group}: ${c.key.name}</a></li>`));
                                } else {
                                    result.append($(`<li><div class="thumb"></div><a data-bind="click: function(data) { copyToComponent(data, ${c.key.componentId}, ${c.key.groupId}) }">${c.key.group}: ${c.key.name}</a></li>`));
                                }
                            })
                            return result;
                        },
                        placement: 'right',
                        trigger: 'click focus',
                        copyToComponent: function (data, targetComponentId, targetGroupId) {
                            console.log('copyToComponent calling with', data, targetComponentId, targetGroupId);
                            var target = Enumerable.From(self.parent.availableComponents()).Where(function (c) {
                                return c.key.componentId == targetComponentId &&
                                    c.key.groupId == targetGroupId;
                            }).Single();
                            target.clearMaterial();
                            target.materialTypeId(self.materialTypeId());
                            target.bespokeFurnitureMaterialAutocomplete.observable(self.selectedMaterial().value.Code);
                            window.setTimeout(function () {
                                $(target.bespokeFurnitureMaterialAutocomplete.observable.DOMElement).one("autocompleteresponse", function (event, ui) {
                                    if (target.bespokeMaterialAutocompleteResults().length == 1) {
                                        target.selectMaterial(target.bespokeMaterialAutocompleteResults()[0]);
                                    }
                                    target.stitchColourId(self.stitchColourId());
                                    target.interliningId(self.interliningId());
                                });
                                $(target.bespokeFurnitureMaterialAutocomplete.observable.DOMElement).autocomplete('search');
                            }, 0);
                        }
                    }
                }
                self.selectedMaterial(data.product);
            }
        }, 0);
    }

    self.toJS = function () {
        if (self.materialTypeId()) {
            if (self.materialTypeId() != 'O') {
                if (self.selectedMaterial()) {
                    return {
                        key: self.key,
                        basketItemId: self.basketItemId,
                        modelId: self.modelId,
                        supplierId: self.supplierId,
                        materialTypeId: self.materialTypeId(),
                        componentId: self.key.ComponentID,
                        productId: self.selectedMaterial().productId,
                        product: self.selectedMaterial(),
                        verticalPatternRepeatCM: self.selectedMaterial().value.VerticalPatternRepeatCM,
                        upholsteryGrade: self.selectedMaterial().value.UpholsteryGrade,
                        requirementM: self.selectedMaterial().value.QuantityRequired,
                        stitchColourId: self.stitchColourId(),
                        stitchColour: self.stitchColour() ? self.stitchColour().name : null,
                        interline: self.interliningId() || null,
                        customersProductCode: null,
                        customersDescription: null,
                        customersSupplier: null,
                        customersWidth: null,
                        customersVerticalPatternRepeat: null,
                        customersQuantityRequired: null,
                    };
                }
            } else {
                return {
                    key: self.key,
                    basketItemId: self.basketItemId,
                    modelId: self.modelId,
                    supplierId: self.supplierId,
                    materialTypeId: self.materialTypeId(),
                    componentId: self.key.ComponentID,
                    productId: null,
                    product: null,
                    verticalPatternRepeatCM: null,
                    upholsteryGrade: 'O',
                    requirementM: self.customersQuantityRequired(),
                    customersProductCode: self.customersProductCode.observable(),
                    customersDescription: self.customersDescription.observable(),
                    customersSupplier: self.customersSupplier.observable(),
                    customersWidth: self.customersWidth(),
                    customersVerticalPatternRepeat: self.customersVerticalPatternRepeat(),
                    customersQuantityRequired: self.customersQuantityRequired(),
                    stitchColourId: self.stitchColourId(),
                    stitchColour: self.stitchColour() ? self.stitchColour().name : null,
                };
            }
        }
    }

    return self;
})();


var bespokeArchitectRingFactory = function (parent) {
    var self = this;

    self.parent = parent;

    self.busy = ko.observable(false);

    self.loaded = ko.observable(false);

    self.validateNow = ko.observable(false);

    self.basketItemId = ko.observable();

    self.productId = ko.observable();

    self.fullDispatch = ko.observable(false);

    self.dateRequired = {
        label: 'Date Required*',
        observable: ko.observable(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        readOnly: true,
        clearFunction: function () {
            this.observable(undefined);
        },
        dateTimePickerOptions: {
            locale: 'en-gb',
            format: 'DD/MM/YYYY',
            ignoreReadonly: true,
            showClear: true,
            allowInputToggle: true,
            sideBySide: true,
            useCurrent: true,
            minDate: new moment().add(4, 'week').toDate(),
            showClose: true,
            keepInvalid: false
        }
    };

    self.quantity = {
        label: 'Quantity',
        observable: ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: ' '
            },
            numberFormatted: {
                digits: 0,
                currency: {
                    FormattingCulture: 'en-GB'
                }
            },
            min: {
                params: 1,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Minimum 1 Item'
            },
            max: {
                params: 99,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Maximum 99 Items'
            },
            notEqual: {
                params: "",
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Quantity == ""'
            },
            //notEqual: {
            //    params: 0,
            //    onlyIf: function () {
            //        return self.validateNow()
            //    },
            //    message: 'Quantity == 0'
            //}
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: false
    };

    self.showDefaultLeadTimeMessage = ko.observable(true);

    // the desired size: cutting: "RING/H" / returnable: "RING/H/A4"
    self.ringSize = {
        observable: ko.observable(' ').extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: ''
            },
            notify: 'always'
        }),
        label: 'Ring Size',
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        options: [{
            name: 'Standard (Cutting)',
            code: 'RING/H',
            productId: 66561
        }, {
            name: 'Large (Returnable)',
            code: 'RING/H/A4',
            productId: 68623
        }],
        //, {
        //    name: 'Custom',
        //    code: 'RING/CUSTOM'
        //}],
        optionsText: 'name',
        optionsValue: 'productId',
        optionsCaption: ' ',
        width: 'auto'
    }

    self.selectedFabrics = ko.observableArray([]).extend({
        maxLength: {
            params: 20,
            onlyIf: function () {
                return self.validateNow();
            },
            message: 'Please select no more than 20 samples.'
        },
        minLength: {
            params: 1,
            onlyIf: function () {
                return self.validateNow();
            },
            message: 'You must select at least one sample to add to this Architect Ring.'
        }
    });

    self.selectedFabricProductIds = ko.observableArray([]);

    self.fabricAutocompleteResults = ko.observableArray([]);

    self.fabricSearch = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.selectedFabrics().length == 0;
            },
            message: ' '
        }
    });

    self.fabricSearchAutocomplete = {
        label: 'Search for Fabric by Code or Name',
        observable: ko.observable(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            self.fabricSearch(undefined);
            self.fabricSearchAutocomplete.observable(undefined);
            $(self.fabricSearchAutocomplete.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        },
        autocompleteSettings: {
            value: self.fabricSearch,
            appendTo: 'body',
            delay: 600,
            source: function (request, response) {
                var data = {
                    term: request.term,
                    tradePriceListId: self.parent.tradeAccount().TradePriceListID,
                    productTypeId: 15
                };
                $.ajax({
                    url: '/api/ComponentAPI/ProductCodeAutocompleteSamples',
                    type: "POST",
                    dataType: "json",
                    data: data,
                    success: function (data) {
                        self.fabricAutocompleteResults($.map(data, function (p) {
                            return {
                                productId: p.ProductID,
                                label: p.Code + ' - ' + p.Name,
                                value: p
                            };
                        }));
                        response();
                        //response($.map(data, function (item) {
                        //    return {
                        //        label: item.Name,
                        //        value: item.ProductID,
                        //        obj: item
                        //    };
                        //}));
                    }
                });
            },
            minLength: 1,
            select: function (event, ui) {
                event.preventDefault();
                console.log('fabricSearchAutocomplete select', ui);
            },
            autoFocus: true,
            create: function () {
                if (self.classField != null) {
                    $(this).data("ui-autocomplete")._renderItem = function (ul, item) {
                        var li = $("<li>");
                        var div = li.append("<div class='ui-menu-item-wrapper'><a href='#'>" + item.label + "<span class='type'>" + item.value[self.typeField] + "</span></a></div>");

                        li.addClass(item.value[self.classField]);

                        return li.appendTo(ul);
                    };
                }
            }
        }
    };

    self.fabricSortable = {
        data: self.selectedFabrics,
        helper: function (element) {
            return element.clone().addClass('bespoke-waterfall-helper');
        }
    };

    self.errors = ko.validation.group([
        self.ringSize.observable,
        self.quantity,
        self.selectedFabrics,
        self.fabricSearch
    ]);

    self.addAllResults = function () {
        ko.utils.arrayForEach(self.fabricAutocompleteResults(), function (item) {
            if (item.value.CuttingProductID != null) {
                if (self.selectedFabricProductIds().length < 20) {
                    self.selectedFabricProductIds.push(item.productId);
                }
            }
        });
    }

    self.removeAllResults = function () {
        ko.utils.arrayForEach(self.fabricAutocompleteResults(), function (item) {
            self.selectedFabricProductIds.remove(item.productId);
        });
    }

    self.clearRing = function () {
        self.selectedFabricProductIds([]);
    }

    self.isProductInRing = function (data) {
        var result = ko.utils.arrayFirst(self.selectedFabrics(), function (item) {
            return item.productId == data.productId
        });
        if (result == null) {
            return false
        } else {
            return true;
        }
    }

    self.removeFabric = function (data) {
        self.selectedFabricProductIds.remove(data.productId);
    }

    self.selectedFabricProductIds.subscribe(function (newValues) {
        self.busy(true);
        ko.utils.arrayForEach(newValues, function (item) {
            if (item.status == 'added') {
                var addition = Enumerable.From(self.fabricAutocompleteResults()).Where(function (x) {
                    return x.productId == item.value;
                }).SingleOrDefault();
                if (addition != null) { // can be null in case of loading: no autocompleteResults exist
                    self.selectedFabrics.push(addition);
                }
            } else if (item.status == 'deleted') {
                self.selectedFabrics.remove(function (x) {
                    return x.productId == item.value;
                });
            }
        });
        self.busy(false);
    }, self, 'arrayChange');

    self.dateRequired.observable.subscribe(function (newValue) {
        self.showDefaultLeadTimeMessage(false);
    });

    self.loaded.subscribe(function (newValue) {
        window.setTimeout(function () {
            self.ringSize.observable.mdcSelect.layout();
            self.quantity.observable.mdcTextField.layout();
            self.dateRequired.observable.mdcTextField.layout();
        }, 300);
    })

    self.open = function (data) {

        self.ringSize.observable(data.record.ProductID);

        self.show();
    }

    self.close = function () {
        self.reset();
        self.hide();
    }

    self.load = function (data, bespokeJsonData) {

        var jsonData = JSON.parse(bespokeJsonData);

        console.log('bespokeArchitectRingFactory load called', data, jsonData);

        self.basketItemId(data.basketItemId);

        self.productId(data.record.ProductID);

        self.ringSize.observable(data.record.ProductID);

        self.ringSize.observable.mdcSelect.disabled = true;

        self.quantity.observable(data.quantity());

        if (jsonData) {
            var forwardOrderDate = null;

            if (jsonData.dateRequired && jsonData.dateRequired != 'N/A')
                forwardOrderDate = moment(jsonData.dateRequired, 'DD/MM/YY');

            if (forwardOrderDate) {
                self.dateRequired.observable(forwardOrderDate);
            }

            self.fullDispatch(jsonData.fullDespatch == 'Y' ? true : false);

            self.selectedFabricProductIds(Enumerable.From(jsonData.architectRingProducts).Select(function (x) {
                return x.productId
            }).ToArray());

            self.selectedFabrics(jsonData.architectRingProducts);
        }

        self.loaded(true);
    }

    self.validate = function () {
        self.validateNow(true);
        self.errors.showAllMessages(false);
        if (self.errors().length) {
            self.errors.showAllMessages(true);
            self.ringSize.observable.isValid.notifySubscribers(self.ringSize.observable.isValid());
            self.quantity.observable.isValid.notifySubscribers(self.quantity.observable.isValid());
            self.fabricSearch.isValid.notifySubscribers(self.fabricSearch.isValid());
            return false;
        } else {
            return true;
        }
    }

    self.addToBasket = function () {
        self.validateNow(true);
        self.errors.showAllMessages(false);

        if (self.errors().length) {
            self.errors.showAllMessages(true);
            self.ringSize.observable.isValid.notifySubscribers(self.ringSize.observable.isValid());
            self.quantity.observable.isValid.notifySubscribers(self.quantity.observable.isValid());
            self.fabricSearch.isValid.notifySubscribers(self.fabricSearch.isValid());
        } else {

            self.busy(true);

            var data = {
                tradeAccountId: self.parent.tradeAccount().TradeAccountID,
                basketId: self.parent.basketId(),
                basketItemTypeId: BASKETITEM_TYPE_BESPOKEARCHITECTRING,
                productId: self.ringSize.observable(),
                quantity: self.quantity.observable(),
                stockLocationId: 91,
                fulfilmentTypeId: 1,
                lineReference: null,
                orderTypeId: ORDERFACTORY_ADD_MODE_STOCK,
                processAnswersJSON: self.toJSON()
            };

            console.log('bespokeArchitectRingFactory addBasketItem calling with', data);

            self.busy(true);

            $.ajax({
                url: '/api/componentapi/AddBasketItem',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('bespokeArchitectRingFactory addBasketItem returned', data);

                    self.busy(false);

                    if (data.addResult.BasketItemID != null) {
                        self.reset();
                        self.hide();
                        self.parent.fetchBasket();

                    } else {
                        $.showError(data.addResult, null, null);
                    }
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    $.showError('Sorry', 'There was an error attempting to add this item to your basket.');
                }
            });

            self.hide();
        }
    }

    self.save = function (onComplete) {
        //self.validateNow(true);
        //self.errors.showAllMessages(false);

        //if (self.errors().length) {
        //    self.errors.showAllMessages(true);
        //    self.ringSize.observable.isValid.notifySubscribers(self.ringSize.observable.isValid());
        //    self.quantity.isValid.notifySubscribers(self.quantity.isValid());
        //} else {

        var data = {
            tradeAccountId: self.parent.tradeAccount().TradeAccountID,
            basketId: self.parent.basketId(),
            basketItemId: self.basketItemId(),
            productId: self.productId(),
            quantity: self.quantity.observable(),
            stockLocationId: 91,
            fulfilmentTypeId: 1,
            lineReference: null,
            orderTypeId: ORDERFACTORY_ADD_MODE_STOCK,
            architectRingProductIds: self.selectedFabricProductIds(),
            processAnswersJSON: self.toJSON(),
            backOrder: self.parent.parent.orderProductsDrilldown.addingProductToBasket().backOrder()
        };

        console.log('bespokeArchitectRingFactory updateBasketItem calling with', data);

        self.busy(true);

        self.parent.updateBasketItem(data, onComplete);
        //function () {
        //        self.busy(false);
        //        self.hide();
        //        self.parent.fetchBasket();
        //    }, function () {
        //        self.busy(false);
        //            console.log('bespokeArchitectRingFactory updateBasketItem failed');
        //    });
        ////}
    }

    self.show = function () {
        //$('#bespoke-fabric-architect-ring-modal').modal('show');
    }

    self.hide = function () {
        //$('#bespoke-fabric-architect-ring-modal').modal('hide');
    }

    self.reset = function () {
        console.log('bespokeArchitectRingFactory reset called');
        self.busy(false);
        self.validateNow(false);
        self.basketItemId(undefined);
        self.productId(undefined);
        self.quantity.observable(1);
        self.ringSize.observable('RING/H');
        self.ringSize.observable.mdcSelect.disabled = false;
        self.fabricSearchAutocomplete.clearFunction();
        self.selectedFabrics([]);
        self.fullDispatch(false);
        self.selectedFabricProductIds([]);
        self.fabricAutocompleteResults([]);
        self.dateRequired.observable(undefined);
        self.showDefaultLeadTimeMessage(true);
        self.loaded(false);
    }

    $('#bespoke-fabric-architect-ring-modal').on('shown.bs.modal', function () {
        window.setTimeout(function () {
            self.ringSize.observable.mdcSelect.layout();
            self.quantity.observable.mdcTextField.layout();
        }, 0);
    });

    $('#bespoke-fabric-architect-ring-modal').on('hide.bs.modal', function () {
        self.reset();
    });

    self.toJSON = function () {
        var forwardOrderDate = null;

        if (self.dateRequired.observable())
            forwardOrderDate = moment(self.dateRequired.observable()).format('DD/MM/YY');

        return JSON.stringify({
            architectRingProducts: self.selectedFabrics(),
            dateRequired: forwardOrderDate || 'N/A',
            fullDespatch: self.fullDispatch() ? 'Y' : 'N',
            memo: ''
        });
    }
}

var memberBasketFetcher = function (parent) {
    var self = this;

    self.popoverTemplate = function () {
        return `<div class="popover basket-details-popover" role="tooltip">
            <div class="arrow"></div>
            <h4 class="popover-title"></h4>
            <div class="popover-wrapper">
                <div class="popover-content"></div>
            </div>
        </div>`
    }

    self.botErrorPopoverTemplate = function () {
        return `<div class="popover basket-details-popover bot-errors" role="tooltip">
            <div class="arrow"></div>
            <h4 class="popover-title"></h4>
            <div class="popover-wrapper">
                <div class="popover-content"></div>
            </div>
        </div>`
    }

    self.basketStatus = basketStatusViewModel({
        parent: self
    })

    self.jsonViewer = ko.observable();

    self.parent = parent;

    self.busy = ko.observable(false);

    self.basketCount = ko.observable();

    self.importBasketCount = ko.observable();

    self.submittedBasketCount = ko.observable();

    self.focDeliveryBasketCount = ko.observable();

    self.fetch = function () {
        self.busy(true);
        $.ajax({
            url: '/api/componentapi/FetchMemberBaskets',
            type: 'GET',
            dataType: 'json',
            data: {},
            success: function (data) {

                // Necessary because this loads out a full TradeAccount entity associated to the Basket;
                // Whereas generally we are going to be dealing with the results of the TradeAccount Autocomplete
                //for (var i in data) {
                //    data[i].TradeAccount.PaymentTerms = data[i].TradeAccount.PaymentTerms.Name;
                //    data[i].TradeAccount.TradePriceList = data[i].TradeAccount.TradePriceList.Name;
                //}

                self.baskets(data);
                self.busy(false);
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    }

    self.fetchTransactionView = function (transaction) {
        self.busy(true);
        $.ajax({
            url: '/api/orderproducts/FetchTransactionView',
            type: 'POST',
            dataType: 'json',
            data: {
                transactionId: transaction.TransactionID
            },
            success: function (data) {
                self.jsonViewer(JSON.stringify(data.json, null, '\t'));
                //self.jsonViewer(data.JSON);
                self.busy(false);
                window.setTimeout(function () {
                    PR.prettyPrint();
                    $([document.documentElement, document.body]).animate({
                        scrollTop: $("#json-viewer").offset().top - 60
                    }, 500);
                }, 0);
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    }

    self.fetchBasketView = function (basket) {
        self.busy(true);
        $.ajax({
            url: '/api/orderproducts/FetchBasketView',
            type: 'POST',
            dataType: 'json',
            data: {
                basketId: basket.BasketID
            },
            success: function (data) {
                self.jsonViewer(JSON.stringify(data.json, null, '\t'));
                //self.jsonViewer(data.JSON);
                self.busy(false);
                window.setTimeout(function () {
                    PR.prettyPrint();
                    $([document.documentElement, document.body]).animate({
                        scrollTop: $("#json-viewer").offset().top - 60
                    }, 500);
                }, 0);
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    }

    self.resultGridWidget = ko.observable();

    self.importResultGridWidget = ko.observable();

    self.submittedGridWidget = ko.observable();

    self.focDeliveryGridWidget = ko.observable();

    self.statusFilter = function (element) {

        var container = $(element).parent().empty();

        var sampleButton = $('<button class="basket-status-filter-btn">Sample Orders</button>');

        sampleButton.kendoButton({
            text: 'Sample Orders',
            click: function (e) {
                self.resultGridWidget().dataSource.filter(
                    { field: 'Status', operator: 'contains', value: 'Sample Order' }
                );
            }
        });

        sampleButton.appendTo(container);

        var allButton = $('<button class="basket-status-filter-btn">All Orders</button>');

        allButton.kendoButton({
            text: 'Sample Orders',
            click: function (e) {
                self.resultGridWidget().dataSource.filter({});
            }
        });

        allButton.appendTo(container);
    }

    self.basketSubmissionResults = self.parent.orderFactory.basketSubmissionResults;
    self.submissionResultText = self.parent.orderFactory.submissionResultText;

    self.closeSubmissionModal = function () {
        self.parent.tradeAccountSelector.clearSearch();
        $("#order-products-modal").modal('hide');

        self.requeryAllGrids();

        $('#submitted-basket-modal').modal('hide');
    }

    self.requeryAllGrids = function () {

        if (self.resultGridWidget()) {
            self.resultGridWidget().dataSource.query({
                page: 1,
                pageSize: self.resultGridWidget().dataSource.pageSize()
            });
        }

        if (self.importResultGridWidget()) {
            self.importResultGridWidget().dataSource.query({
                page: 1,
                pageSize: self.importResultGridWidget().dataSource.pageSize()
            });
        }

        if (self.submittedGridWidget()) {
            self.submittedGridWidget().dataSource.query({
                page: 1,
                pageSize: self.submittedGridWidget().dataSource.pageSize()
            });
        }

        if (self.heldOrdersGridWidget()) {
            self.heldOrdersGridWidget().dataSource.query({
                page: 1,
                pageSize: self.heldOrdersGridWidget().dataSource.pageSize()
            });
        }

        if (self.myHeldOrdersGridWidget()) {
            self.myHeldOrdersGridWidget().dataSource.query({
                page: 1,
                pageSize: self.myHeldOrdersGridWidget().dataSource.pageSize()
            });
        }

        if (self.focDeliveryGridWidget()) {
            self.focDeliveryGridWidget().dataSource.query({
                page: 1,
                pageSize: self.focDeliveryGridWidget().dataSource.pageSize()
            });
        }

    }

    self.cancelRetailPaymentModal = function () {
        $("#retail-payment-modal").modal('hide');
        if (self.basketLocker) {
            self.basketLocker.unlockBasket();
        }
        self.parent.orderFactory.reset();
    }

    self.basketSubmissionResultGrid = {
        autoBind: true,
        widget: ko.observable(),
        columns: [{
            field: 'Reference',
            title: 'Reference',
            width: 160
        }, {
            field: 'Market',
            title: 'Market',
            width: 95
        }, {
            field: 'Label',
            title: 'Trade Account',
        }, {
            field: 'CustomerReference',
            title: 'Order Reference',
            width: 130
        }, {
            field: 'Value',
            title: 'Value',
            width: 100
        }, {
            field: 'HasAllocations',
            title: ' ',
            width: 45,
            attributes: {
                class: 'text-center'
            }
        }, {
            field: 'HeldReasons',
            title: 'Held Reasons',
            width: 200
        }, {
            field: 'Controls',
            title: 'Controls',
            width: 180,
            filterable: false
        }],
        data: self.basketSubmissionResults,
        useKOTemplates: true,
        rowTemplate: 'held-order-row-template',
        sortable: false,
        filterable: false,
        reorderable: false,
        paging: false,
        selectable: false
    };

    self.resultGridColumns = [{
        field: 'Status',
        title: 'Status',
        width: 80,
        filterable: {
            multi: true,
            dataSource: getMyHeldOrderImportStatuses()
        }
    }, {
        field: 'HeldReason',
        title: 'Held Reason',
        width: 140,
        filterable: false
    }, {
        field: 'Market',
        title: 'Market',
        width: 95,
        filterable: {
            extra: false
        }
    }, {
        field: 'CustomerCode',
        title: 'Customer Code',
        width: 100,
        filterable: {
            extra: false
        }
    }, {
        field: 'Customer',
        title: 'Customer',
        width: 200,
        filterable: {
            extra: false
        }
    }, {
        field: 'OrderReference',
        title: 'Order Reference',
        filterable: {
            extra: false
        }
    }, {
        field: 'BasketValue',
        title: 'Basket Value',
        filterable: false
    }, {
        field: 'HasAllocations',
        title: 'Has Allocations',
        filterable: false,
        attributes: {
            class: 'text-center'
        }
    }, {
        field: 'Modified',
        title: 'Modified',
        filterable: false
    }, {
        field: 'Expires',
        title: 'Expires',
        filterable: false
    }, {
        title: ' ',
        width: 38
    }, {
        field: 'CustomerRequestDeliveryServiceName',
        hidden: true
    }, {
        field: 'CustomerRequestHaulierCode',
        hidden: true
    }, {
        field: 'CustomerRequestServiceCode',
        hidden: true
    }, {
        field: 'CustomerRequestHaulierAccountNumberForShippingCharge',
        hidden: true
    }, {
        field: 'CustomerRequestHaulierAccountNumberForDuty',
        hidden: true
    }, {
        field: 'CustomerRequestDeliveryTerms',
        hidden: true
    }, {
        field: 'CustomerRequestDeliveryType',
        hidden: true
    }, {
        field: 'CustomerRequestsFullDespatch',
        hidden: true
    }, {
        field: 'Imported',
        hidden: true
    }, {
        field: 'DeletePermitted',
        hidden: true
    }];

    self.resultGridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {
            memberId: self.memberId(),
        };

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        $.ajax({
            url: '/api/componentapi/FetchMemberBaskets',
            type: "GET",
            dataType: 'json',
            data: data,
            success: function (data) {
                self.basketCount(data.Total);
                ko.utils.arrayForEach(data.Data, function (d) {
                    d.bootstrapPopoverDetails = {
                        title: 'Status',
                        label: d.Status,
                        content: d.BasketItemCustomerLineMemoDisplay,
                        placement: 'right',
                        template: self.popoverTemplate()
                    }
                });
                options.success(data);
            },
            error: function (xhr, s, a) {
                $.ajaxSettings.error(xhr, s, a);
                options.error();
            }
        });
    };

    self.importResultGridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var mapped = webapi.parameterMap(options.data);
        var data = {
            memberId: self.memberId()
        };
        for (var propertyName in mapped) {
            data[propertyName] = mapped[propertyName];
        }

        $.ajax({
            url: '/api/componentapi/FetchImportedBaskets',
            type: "GET",
            dataType: 'json',
            data: data,
            success: function (data) {
                self.importBasketCount(data.Total);
                ko.utils.arrayForEach(data.Data, function (d) {
                    d.bootstrapPopoverDetails = {
                        title: 'Status',
                        label: d.Status,
                        content: d.BasketItemCustomerLineMemoDisplay,
                        placement: 'right',
                        template: self.popoverTemplate()
                    };
                    if (d.BasketBOTError != null) {
                        d.botErrorPopoverDetails = {
                            title: 'BOT Error',
                            label: d.BasketBOTError,
                            content: '<pre>' + PR.prettyPrintOne(JSON.stringify($.extend({ error: d.BasketBOTError }, d.basketBotErrorDetails), null, 4)) + '</pre>',
                            placement: 'left',
                            template: self.botErrorPopoverTemplate()
                        }
                    }
                });
                options.success(data);
            },
            error: function (xhr, s, a) {
                $.ajaxSettings.error(xhr, s, a);
                options.error();
            }
        });
    }

    self.justMyOrders = ko.observable(typeof getMemberId === 'function' ? true : false);

    self.justMyOrderParams = {
        checkboxId: 'just-my-orders',
        label: 'Display just my orders',
        observable: self.justMyOrders,
        useNativeValidation: false
    }

    self.submittedOrderHeadId = ko.observable();

    self.submittedOrderSearch = function () {
        self.submittedGridWidget().dataSource.query({
            page: 1,
            pageSize: self.submittedGridWidget().dataSource.pageSize()
        });
    }

    self.submittedOrderHeadParams = {
        label: 'Search by Order Number or Order Reference',
        observable: self.submittedOrderHeadId,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            self.submittedOrderHeadParams.observable(undefined);
            self.submittedOrderSearch();
        },
        enterKey: function () {
            self.submittedOrderSearch();
        }
    };

    self.memberId = ko.observable(typeof getMemberId === 'function' ? getMemberId() : null);

    self.memberId.subscribe(function (newValue) {
        if (newValue == null) {
            self.justMyOrders(false);
        }
        self.requeryAllGrids();
    });

    self.submittedGridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {
            memberId: self.justMyOrders() ? self.memberId() : null,
            marketCode: null,
            tradeAccountCode: null,
            searchTerm: self.submittedOrderHeadId.peek()
        };

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        $.ajax({
            url: '/api/orderproducts/TransactionSearch',
            type: "GET",
            dataType: 'json',
            data: data,
            success: function (data) {
                self.submittedBasketCount(data.Total);
                ko.utils.arrayForEach(data.Data, function (d) {
                    ko.utils.arrayForEach(d.orderDetails, function (od) {
                        var dataCarry = JSON.parse(JSON.stringify(od)); // poor man's clone!
                        od.bootstrapPopoverDetails = {
                            title: 'Order Details',
                            label: od.label,
                            orderLinesGrid: {
                                data: od.orderLines,
                                useKOTemplates: true,
                                rowTemplate: 'order-line-row-template',
                                selectable: false,
                                scrollable: false,
                                columns: [{
                                    field: 'code',
                                    title: 'Product Code',
                                    width: 140
                                }, {
                                    field: 'quantity',
                                    title: 'Quantity',
                                    width: 140
                                }, {
                                    field: 'priceEx',
                                    title: 'Price Ex. VAT',
                                    width: 140
                                }, {
                                    field: 'priceInc',
                                    title: 'Price Inc. VAT',
                                    width: 140
                                }, {
                                    field: 'status',
                                    title: 'Status',
                                    width: 140
                                }]
                            },
                            data: dataCarry,
                            content: function () {
                                console.log(od);
                                return `<div class="popover-details-wrapper" data-bind="with: data">
                                            <div class="grid-container">
                                                <div>
                                                    <h4 data-bind="text: 'Order: ' + orderHeadId"></h4>
                                                    <p data-bind="html: orderDescription"></p>
                                                    <h5>
                                                        Order Total Inc. VAT: <span data-bind="text: formatCurrency(orderTotalIncVAT, 2, formattingCulture, currencyCode)"></span>
                                                    </h5>
                                                </div>
                                                <div>
                                                    <h4>Delivery Address</h5>
                                                    <div data-bind="template: { name: 'popover-address-template', data: delivery }"></div>
                                                </div>
                                                <div>
                                                    <h4>Documents</h4>
                                                    <!-- ko if: documents == null -->
                                                        N/A
                                                    <!-- /ko -->
                                                    <!-- ko if: documents != null -->
                                                        <!-- ko foreach: documents -->
                                                        <button class="btn btn-green" data-bind="click: function () { $parentContext.$parentContext.$parentContext.$parentContext.$parent.fetchDocument($data, $parent); }">
                                                            <span data-bind="text: label"></span>
                                                        </button>
                                                        <!-- /ko -->
                                                    <!-- /ko -->
                                                </div>
                                            </div>
                                            <div data-bind="kendoGrid: $parent.orderLinesGrid"></div>
                                        </div>
                                        <div class="basket-line-memo-footer" data-bind="text: label"></div>`
                            },
                            placement: 'right',
                            template: self.popoverTemplate()
                        }
                    });
                    d.bootstrapPopoverDetails = {
                        title: 'Status',
                        label: d.Status,
                        content: d.BasketItemCustomerLineMemoDisplay,
                        placement: 'right',
                        template: self.popoverTemplate()
                    }
                });
                options.success(data);
            },
            error: function (xhr, s, a) {
                $.ajaxSettings.error(xhr, s, a);
                options.error();
            }
        });
    }

    self.resultGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.resultGridDataSourceRead
        },
        //pageSize: 0,
        sortable: true,
        filterable: true,
        grouping: false,
        serverGrouping: false,
        serverFiltering: false,
        serverPaging: true,
        pageSize: 10,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "Aggregates",
            model: {
                id: 'BasketID',
                fields: {
                    BasketID: { type: 'number' },
                    Status: { type: 'string' },
                    HeldReason: { type: 'string' },
                    Market: { type: 'string' },
                    CustomerCode: { type: 'string' },
                    Customer: { type: 'string' },
                    OrderReference: { type: 'string' },
                    BasketValue: { type: 'string' },
                    HasAllocations: { type: 'string' },
                    Modified: { type: 'string' },
                    Expires: { type: 'string' },
                    DeleteColumn: { type: 'string' },
                    DeletePermitted: { type: 'string' },
                    CustomerRequestDeliveryServiceName: { type: 'string' },
                    CustomerRequestHaulierCode: { type: 'string' },
                    CustomerRequestServiceCode: { type: 'string' },
                    CustomerRequestHaulierAccountNumberForShippingCharge: { type: 'string' },
                    CustomerRequestHaulierAccountNumberForDuty: { type: 'string' },
                    CustomerRequestDeliveryTerms: { type: 'string' },
                    CustomerRequestDeliveryType: { type: 'string' },
                    CustomerRequestsFullDespatch: { type: 'bool' },
                    Imported: { type: 'bool' },
                    MertexVATLookupSuccessful: { type: 'bool' },
                    CreatedDT: { type: 'date' }
                }
            }
        }),
        sort: {
            field: 'Expires',
            dir: 'desc'
        },
        //sort: { field: "BasketID", dir: "desc" },
        requestStart: function (e) {
            $("#grid-loading").show();
        },
        requestEnd: function (e) {
            $("#grid-loading").hide();
        }
    });


    self.submittedGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.submittedGridDataSourceRead
        },
        sortable: true,
        filterable: true,
        grouping: false,
        serverGrouping: false,
        serverFiltering: false,
        serverPaging: true,
        pageSize: 10,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "Aggregates",
            model: {
                id: 'BasketID',
                fields: {
                    BasketID: { type: 'number' },
                    Status: { type: 'string' },
                    HeldReason: { type: 'string' },
                    Market: { type: 'string' },
                    CustomerCode: { type: 'string' },
                    Customer: { type: 'string' },
                    OrderReference: { type: 'string' },
                    BasketValue: { type: 'string' },
                    HasAllocations: { type: 'string' },
                    Modified: { type: 'string' },
                    Expires: { type: 'string' },
                    DeleteColumn: { type: 'string' },
                    DeletePermitted: { type: 'string' },
                    CustomerRequestDeliveryServiceName: { type: 'string' },
                    CustomerRequestHaulierCode: { type: 'string' },
                    CustomerRequestServiceCode: { type: 'string' },
                    CustomerRequestHaulierAccountNumberForShippingCharge: { type: 'string' },
                    CustomerRequestHaulierAccountNumberForDuty: { type: 'string' },
                    CustomerRequestDeliveryTerms: { type: 'string' },
                    CustomerRequestDeliveryType: { type: 'string' },
                    CustomerRequestsFullDespatch: { type: 'bool' },
                    OfferReceipt: { type: 'bool' },
                    Imported: { type: 'bool' }
                }
            }
        }),
        sort: {
            field: 'Expires',
            dir: 'desc'
        },
        //sort: { field: "BasketID", dir: "desc" },
        requestStart: function (e) {
            $("#grid-loading").show();
        },
        requestEnd: function (e) {
            $("#grid-loading").hide();
        }
    });

    self.importResultGridColumns = [{
        field: 'Status',
        title: 'Order Type',
        filterable: {
            multi: true,
            dataSource: getOrderImportStatuses()
        }
    }, {
        field: 'OrderImportSourceID',
        title: 'Source',
        filterable: {
            multi: true,
            dataSource: getOrderImportSources()
        }
    }, {
        field: 'CreatedDT',
        title: 'Created',
        width: 140,
        filterable: {
            extra: false
        }
    }, {
        field: 'Market',
        title: 'Market',
        width: 90,
        filterable: {
            extra: false
        }
    }, {
        field: 'CustomerCode',
        title: 'Customer Code',
        width: 100,
        filterable: {
            extra: false
        }
    }, {
        field: 'Customer',
        title: 'Customer',
        width: 200,
        filterable: {
            extra: false
        }
    }, {
        field: 'OrderReference',
        title: 'Order Reference',
        filterable: {
            extra: false
        }
    }, {
        field: 'BasketValue',
        title: 'Basket Value',
        filterable: false,
        width: 90
    }, {
        field: 'HasAllocations',
        title: 'Has Allocations',
        filterable: false,
        attributes: {
            class: 'text-center'
        }
    }, {
        field: 'Modified',
        title: 'Modified',
        filterable: false
    }, {
        field: 'Expires',
        title: 'Expires',
        filterable: false
    }, {
        title: ' ',
        width: 38
    }, {
        field: 'CustomerRequestDeliveryServiceName',
        hidden: true
    }, {
        field: 'CustomerRequestHaulierCode',
        hidden: true
    }, {
        field: 'CustomerRequestServiceCode',
        hidden: true
    }, {
        field: 'CustomerRequestHaulierAccountNumberForShippingCharge',
        hidden: true
    }, {
        field: 'CustomerRequestHaulierAccountNumberForDuty',
        hidden: true
    }, {
        field: 'CustomerRequestDeliveryTerms',
        hidden: true
    }, {
        field: 'CustomerRequestDeliveryType',
        hidden: true
    }, {
        field: 'CustomerRequestsFullDespatch',
        hidden: true
    }, {
        field: 'DeletePermitted',
        hidden: true
    }, {
        field: 'BasketBOTError',
        hidden: true
    }];

    self.importResultGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.importResultGridDataSourceRead
        },
        sortable: true,
        filterable: true,
        grouping: false,
        serverFiltering: true,
        serverGrouping: false,
        serverPaging: true,
        pageSize: 10,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "Aggregates",
            filters: "Filters",
            model: {
                id: 'BasketID',
                fields: {
                    BasketID: { type: 'number' },
                    Status: { type: 'string' },
                    HeldReason: { type: 'string' },
                    Market: { type: 'string' },
                    CustomerCode: { type: 'string' },
                    Customer: { type: 'string' },
                    OrderReference: { type: 'string' },
                    BasketValue: { type: 'string' },
                    HasAllocations: { type: 'string' },
                    Modified: { type: 'string' },
                    Expires: { type: 'string' },
                    DeleteColumn: { type: 'string' },
                    DeletePermitted: { type: 'string' },
                    CustomerRequestDeliveryServiceName: { type: 'string' },
                    CustomerRequestHaulierCode: { type: 'string' },
                    CustomerRequestServiceCode: { type: 'string' },
                    CustomerRequestHaulierAccountNumberForShippingCharge: { type: 'string' },
                    CustomerRequestHaulierAccountNumberForDuty: { type: 'string' },
                    CustomerRequestDeliveryTerms: { type: 'string' },
                    CustomerRequestDeliveryType: { type: 'string' },
                    CustomerRequestsFullDespatch: { type: 'bool' },
                    Imported: { type: 'bool' },
                    OrderImportSourceID: { type: 'number' },
                    OrderImportSource: { type: 'string' },
                    CreatedDT: { type: 'date' }
                }
            }
        }),
        sort: {
            field: 'Expires',
            dir: 'desc'
        },
        //sort: { field: "BasketID", dir: "desc" },
        requestStart: function (e) {
            $("#grid-loading").show();
        },
        requestEnd: function (e) {
            $("#grid-loading").hide();
        }
    });

    self.customResultStatusFilterActive = ko.observable();

    self.resultGridSettings = {
        autoBind: true,
        widget: self.resultGridWidget,
        columns: self.resultGridColumns,
        data: self.resultGridDataSource,
        useKOTemplates: true,
        rowTemplate: 'basket-row-template',
        scrollable: false,
        sortable: true,
        filterable: true,
        reorderable: false,
        paging: true,
        pageSize: 10,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        selectable: "single, row",
        change: function (e) {
            if (self.resultGridWidget().select()) {
                self.busy(true);
                var selectedItem = self.resultGridWidget().dataItem(self.resultGridWidget().select());
                if (selectedItem != null) {
                    self.parent.orderFactory.loadBasket(selectedItem, function () {
                        self.busy(false);
                    });
                } else {
                    self.busy(false);
                }
            }
        },
        dataBound: function (e) {
            if (self.customResultStatusFilterActive()) {
                window.setTimeout(function () {
                    $('th[data-field="Status"]', e.sender.element).find('a.k-grid-filter').addClass('k-state-active');
                }, 0);
            } else {
                $('th[data-field="Status"]', e.sender.element).find('a.k-grid-filter').removeClass('k-state-active');
            }
        },
        filterMenuInit: function (e) {

            var ds = [];
            var filterToggle = null;
            var operator = null;

            switch (e.field) {
                case 'Status':
                    ds = getMyHeldOrderImportStatuses();
                    operator = "contains";
                    filterToggle = self.customResultStatusFilterActive;
                    break;
                default: break;
            }

            if (filterToggle != null) {
                var popup = e.container.data("kendoPopup");
                var dataSource = this.dataSource;
                var field = e.field;
                var element = e.container.children(":first");

                var originalMultiCheck = e.container.children(":first");
                // helpTextElement.nextUntil(":has(.k-button)").remove();
                var element = $("<div class='custom-filter-checkbox-container'></div>").insertAfter(originalMultiCheck).kendoListView({
                    dataSource: ds,
                    template: "<label><input type='checkbox' value='#:" + field + "#'/>#:Name#</label>"
                });
                originalMultiCheck.remove();
                e.container.children('.k-filter-selected-items').remove();

                e.container.find("[type='submit']").click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var filter = dataSource.filter() || { logic: "and", filters: [] };
                    var fieldFilters = $.map(element.find('input[type="checkbox"]:checked'), function (input) {
                        return {
                            field: field,
                            operator: operator,
                            value: input.value
                        };
                    });
                    if (fieldFilters.length) {
                        self.removeFiltersForField(filter, field);
                        filter.filters.push({
                            logic: "or",
                            filters: fieldFilters
                        });
                        dataSource.filter(filter);
                        filterToggle(true);
                    }
                    popup.close();
                });

                e.container.find("[type='reset']").click(function (e) {
                    filterToggle(false);
                });
            }
        }
    };

    self.focDeliveryGridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {
            memberId: self.memberId(),
        };

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        $.ajax({
            url: '/api/componentapi/FetchFoCDeliveryBaskets',
            type: "GET",
            dataType: 'json',
            data: data,
            success: function (data) {
                self.focDeliveryBasketCount(data.Total);
                ko.utils.arrayForEach(data.Data, function (d) {
                    d.bootstrapPopoverDetails = {
                        title: 'Status',
                        label: d.Status,
                        content: d.BasketItemCustomerLineMemoDisplay,
                        placement: 'right',
                        template: self.popoverTemplate()
                    }
                });
                options.success(data);
            },
            error: function (xhr, s, a) {
                $.ajaxSettings.error(xhr, s, a);
                options.error();
            }
        });
    };

    self.focDeliveryGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.focDeliveryGridDataSourceRead
        },
        //pageSize: 0,
        sortable: true,
        filterable: true,
        grouping: false,
        serverGrouping: false,
        serverFiltering: false,
        serverPaging: true,
        pageSize: 10,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "Aggregates",
            model: {
                id: 'BasketID',
                fields: {
                    BasketID: { type: 'number' },
                    Status: { type: 'string' },
                    HeldReason: { type: 'string' },
                    Market: { type: 'string' },
                    CustomerCode: { type: 'string' },
                    Customer: { type: 'string' },
                    OrderReference: { type: 'string' },
                    BasketValue: { type: 'string' },
                    HasAllocations: { type: 'string' },
                    Modified: { type: 'string' },
                    Expires: { type: 'string' },
                    DeleteColumn: { type: 'string' },
                    DeletePermitted: { type: 'string' },
                    CustomerRequestDeliveryServiceName: { type: 'string' },
                    CustomerRequestHaulierCode: { type: 'string' },
                    CustomerRequestServiceCode: { type: 'string' },
                    CustomerRequestHaulierAccountNumberForShippingCharge: { type: 'string' },
                    CustomerRequestHaulierAccountNumberForDuty: { type: 'string' },
                    CustomerRequestDeliveryTerms: { type: 'string' },
                    CustomerRequestDeliveryType: { type: 'string' },
                    CustomerRequestsFullDespatch: { type: 'bool' },
                    Imported: { type: 'bool' },
                    CreatedDT: { type: 'date' }
                }
            }
        }),
        sort: {
            field: 'Expires',
            dir: 'desc'
        },
        //sort: { field: "BasketID", dir: "desc" },
        requestStart: function (e) {
            $("#grid-loading").show();
        },
        requestEnd: function (e) {
            $("#grid-loading").hide();
        }
    });


    self.focDeliveryGridSettings = {
        autoBind: true,
        widget: self.focDeliveryGridWidget,
        columns: self.resultGridColumns,
        data: self.focDeliveryGridDataSource,
        useKOTemplates: true,
        rowTemplate: 'basket-row-template',
        scrollable: false,
        sortable: true,
        filterable: true,
        reorderable: false,
        paging: true,
        pageSize: 10,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        selectable: "single, row",
        change: function (e) {
            if (self.focDeliveryGridWidget().select()) {
                self.busy(true);
                var selectedItem = self.focDeliveryGridWidget().dataItem(self.focDeliveryGridWidget().select());
                if (selectedItem != null) {
                    self.parent.orderFactory.loadBasket(selectedItem, function () {
                        self.busy(false);
                    });
                } else {
                    self.busy(false);
                }
            }
        }
    };

    self.submittedGridColumns = [{
        field: 'BasketID',
        title: 'Basket ID',
        width: 90
    }, {
        field: 'OrderDetails',
        title: 'Order(s)',
        width: 320
    }, {
        field: 'TradeAccountCode',
        title: 'Trade Account',
        width: 300
    }, {
        field: 'OrderReference',
        title: 'Order Reference'
    }, {
        field: 'MemberName',
        title: 'Order Taker',
        width: 240
    }, {
        field: 'CreatedDT',
        title: 'Submitted',
        width: 180
    }];

    self.submittedGridSettings = {
        autoBind: true,
        widget: self.submittedGridWidget,
        columns: self.submittedGridColumns,
        data: self.submittedGridDataSource,
        useKOTemplates: true,
        scrollable: false,
        rowTemplate: 'transaction-row-template',
        //height: 685,
        sortable: true,
        filterable: true,
        reorderable: false,
        paging: true,
        pageSize: 10,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        selectable: "single, row",
        //change: function (e) {
        //    if (self.submittedGridWidget().select()) {
        //        self.busy(true);
        //        var selectedItem = self.submittedGridWidget().dataItem(self.submittedGridWidget().select());
        //        if (selectedItem != null) {
        //            self.parent.orderFactory.loadBasketForReceipt(selectedItem, function () {
        //                self.busy(false);
        //            });
        //        } else {
        //            self.busy(false);
        //        }
        //    }
        //}
    };

    self.customImportStatusFilterActive = ko.observable(false);
    self.customImportSourceFilterActive = ko.observable(false);

    self.importResultGridSettings = {
        autoBind: true,
        widget: self.importResultGridWidget,
        columns: self.importResultGridColumns,
        data: self.importResultGridDataSource,
        useKOTemplates: true,
        rowTemplate: 'imported-basket-row-template',
        scrollable: false,
        sortable: true,
        filterable: true,
        filter: function (e) {
            console.log('importResultGrid filter', e);
        },
        reorderable: false,
        paging: true,
        pageSize: 10,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        selectable: "single, row",
        change: function (e) {
            if (self.importResultGridWidget().select()) {
                self.busy(true);
                var selectedItem = self.importResultGridWidget().dataItem(self.importResultGridWidget().select());
                if (selectedItem != null) {
                    self.parent.orderFactory.loadBasket(selectedItem, function () {
                        self.busy(false);
                    });
                } else {
                    self.busy(false);
                }
            }
        },
        dataBound: function (e) {
            if (self.customImportStatusFilterActive()) {
                window.setTimeout(function () {
                    $('th[data-field="Status"]', e.sender.element).find('a.k-grid-filter').addClass('k-state-active');
                }, 0);
            } else {
                $('th[data-field="Status"]', e.sender.element).find('a.k-grid-filter').removeClass('k-state-active');
            }
            if (self.customImportSourceFilterActive()) {
                window.setTimeout(function () {
                    $('th[data-field="OrderImportSourceID"]', e.sender.element).find('a.k-grid-filter').addClass('k-state-active');
                }, 0);
            } else {
                $('th[data-field="OrderImportSourceID"]', e.sender.element).find('a.k-grid-filter').removeClass('k-state-active');
            }
        },
        filterMenuInit: function (e) {

            var ds = [];
            var filterToggle = null;
            var operator = null;

            switch (e.field) {
                case 'Status':
                    ds = getOrderImportStatuses();
                    operator = "contains";
                    filterToggle = self.customImportStatusFilterActive;
                    break;
                case 'OrderImportSourceID':
                    ds = getOrderImportSources();
                    operator = "eq";
                    filterToggle = self.customImportStatusFilterActive;
                    break;
                default: break;
            }

            if (filterToggle != null) {
                var popup = e.container.data("kendoPopup");
                var dataSource = this.dataSource;
                var field = e.field;
                var element = e.container.children(":first");

                var originalMultiCheck = e.container.children(":first");
                // helpTextElement.nextUntil(":has(.k-button)").remove();
                var element = $("<div class='custom-filter-checkbox-container'></div>").insertAfter(originalMultiCheck).kendoListView({
                    dataSource: ds,
                    template: "<label><input type='checkbox' value='#:" + field + "#'/>#:Name#</label>"
                });
                originalMultiCheck.remove();
                e.container.children('.k-filter-selected-items').remove();

                e.container.find("[type='submit']").click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var filter = dataSource.filter() || { logic: "and", filters: [] };
                    var fieldFilters = $.map(element.find('input[type="checkbox"]:checked'), function (input) {
                        return {
                            field: field,
                            operator: operator,
                            value: input.value
                        };
                    });
                    if (fieldFilters.length) {
                        self.removeFiltersForField(filter, field);
                        filter.filters.push({
                            logic: "or",
                            filters: fieldFilters
                        });
                        dataSource.filter(filter);
                        filterToggle(true);
                    }
                    popup.close();
                });

                e.container.find("[type='reset']").click(function (e) {
                    filterToggle(false);
                });
            }
        }
    };

    self.heldOrdersCount = ko.observable();

    self.heldOrdersGridWidget = ko.observable();

    self.heldOrdersGridColumns = [{
        field: 'Reference',
        title: 'Reference',
        width: 240
    }, {
        field: 'Market',
        title: 'Market',
        width: 95
    }, {
        field: 'Label',
        title: 'Trade Account',
    }, {
        field: 'CustomerReference',
        title: 'Order Reference',
        width: 130
    }, {
        field: 'Value',
        title: 'Value',
        width: 100
    }, {
        field: 'HasAllocations',
        title: ' ',
        filterable: false,
        width: 45,
        attributes: {
            class: 'text-center'
        }
    }, {
        field: 'HeldReasons',
        title: 'Held Reasons',
        width: 200,
        filterable: {
            multi: true,
            dataSource: getHoldReasons()
        }
    }, {
        field: 'Controls',
        title: 'Controls',
        width: 180,
        filterable: false
    }
    ];

    self.heldOrdersGridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {
            memberId: self.memberId(),
        };

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        $.ajax({
            url: '/api/componentapi/FetchHeldOrdersManagement',
            type: "GET",
            dataType: 'json',
            data: data,
            success: function (data) {
                self.heldOrdersCount(data.Total);
                ko.utils.arrayForEach(data.Data, function (d) {
                    d.bootstrapPopoverDetails = {
                        title: 'Status',
                        label: d.Status,
                        content: d.BasketItemCustomerLineMemoDisplay,
                        placement: 'right',
                        template: self.popoverTemplate()
                    }
                });
                //// testing...
                //ko.utils.arrayForEach(data.Data, function (d) {
                //    ko.utils.arrayForEach(Object.keys(d), function (k) {
                //        if (k.indexOf('Allo') === 0) {
                //            d[k] = true;
                //        }
                //    })
                //});
                options.success(data);
            },
            error: function (xhr, s, a) {
                $.ajaxSettings.error(xhr, s, a);
                options.error();
            }
        });
    }

    self.heldOrdersGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.heldOrdersGridDataSourceRead,
        },
        sortable: true,
        filterable: true,
        grouping: false,
        serverFiltering: true,
        serverGrouping: false,
        serverPaging: true,
        pageSize: 20,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "Aggregates",
            model: {
                id: 'Reference',
                fields: {
                    Reference: { type: 'string' },
                    HeldReasons: { type: 'string' },
                    heldReaons: { type: 'object' },
                    Market: { type: 'string' },
                    MertexMarket: { type: 'object' },
                    CustomerCode: { type: 'string' },
                    CustomerName: { type: 'string' },
                    CustomerReference: { type: 'string' },
                    Value: { type: 'string' },
                    HasAllocations: { type: 'bool' },
                    ModifiedDT: { type: 'string' },
                    Expires: { type: 'string' },
                    AllowBasketView: { type: 'bool' },
                    AllowBasketEdit: { type: 'bool' },
                    AllowBasketRelease: { type: 'bool' },
                    AllowBasketDelete: { type: 'bool' },
                    AllowTransactionView: { type: 'bool' },
                    AllowTransactionEdit: { type: 'bool' },
                    AllowTransactionRelease: { type: 'bool' },
                    Documents: { type: 'string' },
                    documents: { type: 'object' },
                    BasketID: { type: 'number' },
                    LanguageID: { type: 'number' },
                    TransactionID: { type: 'number' },
                    Imported: { type: 'bool' }
                }
            }
        }),
        sort: {
            field: 'Expires',
            dir: 'desc'
        },
        //sort: { field: "BasketID", dir: "desc" },
        requestStart: function (e) {
            $("#grid-loading").show();
        },
        requestEnd: function (e) {
            $("#grid-loading").hide();
        },
        noDataTemplate: 'There are no Held Orders for your consideration.'
    });

    self.fetchDocument = function (document, parent) {
        let objJsonStr = JSON.stringify({
            documentType: document.documentType,
            basketId: parent.BasketID,
            transactionId: parent.TransactionID,
            orderHeadId: document.orderHeadId,
            languageId: parent.LanguageID || parent.languageId
        });
        let objJsonB64 = btoa(objJsonStr);

        window.open('/documents/view?' + new URLSearchParams({
            d: objJsonB64
        }).toString(), '_blank');
    }

    self.customHeldReasonFilterActive = ko.observable(false);

    self.heldOrdersResultGridSettings = {
        autoBind: true,
        widget: self.heldOrdersGridWidget,
        columns: self.heldOrdersGridColumns,
        data: self.heldOrdersGridDataSource,
        useKOTemplates: true,
        rowTemplate: 'held-order-row-template',
        sortable: true,
        filterable: {
            operators: {
                string: {
                    contains: "Contains",
                    eq: "Equal to",
                    neq: "Not equal to"
                }
            }
        },
        reorderable: false,
        paging: true,
        pageSize: 20,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        selectable: false,
        dataBound: function (e) {
            if (self.customHeldReasonFilterActive()) {
                window.setTimeout(function () {
                    $('th[data-field="HeldReasons"]', e.sender.element).find('a.k-grid-filter').addClass('k-state-active');
                }, 0);
            } else {
                $('th[data-field="HeldReasons"]', e.sender.element).find('a.k-grid-filter').removeClass('k-state-active');
            }
        },
        filterMenuInit: function (e) {
            if (e.field === 'HeldReasons') {
                var popup = e.container.data("kendoPopup");
                var dataSource = this.dataSource;
                var field = e.field;
                var element = e.container.children(":first");

                var originalMultiCheck = e.container.children(":first");
                // helpTextElement.nextUntil(":has(.k-button)").remove();
                var element = $("<div class='custom-filter-checkbox-container'></div>").insertAfter(originalMultiCheck).kendoListView({
                    dataSource: getHoldReasons(),
                    template: "<label><input type='checkbox' value='#:" + field + "#'/>#:" + field + "#</label>"
                });
                originalMultiCheck.remove();
                e.container.children('.k-filter-selected-items').remove();

                e.container.find("[type='submit']").click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var filter = dataSource.filter() || { logic: "and", filters: [] };
                    var fieldFilters = $.map(element.find('input[type="checkbox"]:checked'), function (input) {
                        return {
                            field: field,
                            operator: "contains",
                            value: input.value
                        };
                    });
                    if (fieldFilters.length) {
                        self.removeFiltersForField(filter, field);
                        filter.filters.push({
                            logic: "or",
                            filters: fieldFilters
                        });
                        dataSource.filter(filter);
                        self.customHeldReasonFilterActive(true);
                    }
                    popup.close();
                });

                e.container.find("[type='reset']").click(function (e) {
                    self.customHeldReasonFilterActive(false);
                });
            }
        }
    }

    self.clearHeldOrdersGridFilters = function () {
        self.customHeldReasonFilterActive(false);
        self.heldOrdersGridWidget().dataSource.filter({});
    }

    self.uniqueForField = function (data, field) {
        var map = {};
        var result = [];
        var item;
        for (var i = 0; i < data.length; i++) {
            item = data[i];
            if (!map[item[field]]) {
                result.push(item.toJSON());
                map[item[field]] = true;
            }
        }
        return result;
    }

    self.removeFiltersForField = function (expression, field) {
        if (expression.filters) {
            expression.filters = $.grep(expression.filters, function (filter) {
                self.removeFiltersForField(filter, field);
                if (filter.filters) {
                    return filter.filters.length;
                } else {
                    return filter.field != field;
                }
            });
        }
    }

    self.editBasket = function (heldOrder) {
        self.busy(true);
        self.parent.orderFactory.loadBasket(heldOrder, function () {
            self.busy(false);
        });
    }

    self.provideRetailPaymentDetails = function (heldOrder) {
        self.busy(true);
        self.parent.orderFactory.loadBasketForRetailPayment(heldOrder, function () {
            self.busy(false);
        });
    }

    self.releaseBasket = function (heldOrder) {
        $.confirm('Are you sure?', 'This will release Basket ' + heldOrder.BasketID, function () {
            self.busy(true);
            $.ajax({
                url: '/api/componentapi/ReleaseBasket',
                type: 'POST',
                dataType: 'json',
                data: {
                    basketId: heldOrder.BasketID
                },
                success: function (data) {
                    self.busy(false);
                    self.heldOrdersGridWidget().dataSource.read();
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    $.showError(xhr, s, a);
                }
            });
        }, null);
    }

    self.editTransaction = function (heldOrder) {
        $.confirm('Are you sure?', 'This will remove Transaction records for ' + heldOrder.TransactionID + ' and enable Basket Editing.', function () {
            self.busy(true);
            $.ajax({
                url: '/api/componentapi/EditTransaction',
                type: 'POST',
                dataType: 'json',
                data: {
                    transactionId: heldOrder.TransactionID
                },
                success: function (data) {
                    self.busy(false);
                    $.info('Result', data);
                    self.heldOrdersGridWidget().dataSource.read();
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    $.showError(xhr, s, a);
                }
            });
        }, null);
    }

    self.releaseTransaction = function (heldOrder) {
        $.confirm('Are you sure?', 'This will release Transaction ' + heldOrder.TransactionID, function () {
            self.busy(true);
            $.ajax({
                url: '/api/componentapi/ReleaseTransaction',
                type: 'POST',
                dataType: 'json',
                data: {
                    transactionId: heldOrder.TransactionID
                },
                success: function (data) {
                    self.busy(false);
                    if (self.heldOrdersGridWidget()) {
                        self.heldOrdersGridWidget().dataSource.query({
                            page: 1,
                            pageSize: self.heldOrdersGridWidget().dataSource.pageSize()
                        });
                    }
                    if (self.myHeldOrdersGridWidget()) {
                        self.myHeldOrdersGridWidget().dataSource.query({
                            page: 1,
                            pageSize: self.myHeldOrdersGridWidget().dataSource.pageSize()
                        });
                    }
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    $.showError(xhr, s, a);
                }
            });
        }, null);
    }

    self.deleteTransaction = function (heldOrder) {
        $.confirm('Are you sure?', 'This will <span class="text-danger bold">DELETE</span> Transaction ' + heldOrder.TransactionID, function () {
            self.busy(true);
            $.ajax({
                url: '/api/orderproducts/DeleteTransaction',
                type: 'POST',
                dataType: 'json',
                data: {
                    transactionId: heldOrder.TransactionID
                },
                success: function (data) {
                    self.busy(false);
                    self.closeSubmissionModal();
                    if (self.heldOrdersGridWidget()) {
                        self.heldOrdersGridWidget().dataSource.query({
                            page: 1,
                            pageSize: self.heldOrdersGridWidget().dataSource.pageSize()
                        });
                    }
                    if (self.myHeldOrdersGridWidget()) {
                        self.myHeldOrdersGridWidget().dataSource.query({
                            page: 1,
                            pageSize: self.myHeldOrdersGridWidget().dataSource.pageSize()
                        });
                    }
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    $.showError(xhr, s, a);
                }
            });
        }, null);
    }

    self.myHeldOrdersCount = ko.observable();

    self.myHeldOrdersGridWidget = ko.observable();

    self.myHeldOrdersGridColumns = [{
        field: 'Reference',
        title: 'Reference',
        width: 160
    }, {
        field: 'Market',
        title: 'Market',
        width: 95
    }, {
        field: 'Label',
        title: 'Trade Account',
    }, {
        field: 'CustomerReference',
        title: 'Order Reference',
        width: 130
    }, {
        field: 'Value',
        title: 'Basket Value',
        width: 100
    }, {
        field: 'HasAllocations',
        title: ' ',
        filterable: false,
        width: 45,
        attributes: {
            class: 'text-center'
        }
    }, {
        field: 'HeldReasons',
        title: 'Held Reasons',
        width: 240,
        filterable: {
            multi: true,
            dataSource: getHoldReasons(),
            operators: {
                contains: "Contains"
            }
        }
    }, {
        field: 'Controls',
        title: 'Controls',
        width: 180,
        filterable: false
    }
    ];

    self.myHeldOrdersGridDataSourceRead = function (options) {

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {
            memberId: self.memberId(),
        };

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        $.ajax({
            url: '/api/componentapi/FetchHeldOrdersOperator',
            type: "GET",
            dataType: 'json',
            data: data,
            success: function (data) {
                self.myHeldOrdersCount(data.Total);
                ko.utils.arrayForEach(data.Data, function (d) {
                    d.bootstrapPopoverDetails = {
                        title: 'Status',
                        label: d.Status,
                        content: d.BasketItemCustomerLineMemoDisplay,
                        placement: 'right',
                        template: self.popoverTemplate()
                    }
                });
                //// testing...
                //ko.utils.arrayForEach(data.Data, function (d) {
                //    ko.utils.arrayForEach(Object.keys(d), function (k) {
                //        if (k.indexOf('Allo') === 0) {
                //            d[k] = true;
                //        }
                //    })
                //});
                options.success(data);
            },
            error: function (xhr, s, a) {
                $.ajaxSettings.error(xhr, s, a);
                options.error();
            }
        });
    }

    self.myHeldOrdersGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.myHeldOrdersGridDataSourceRead,
        },
        sortable: true,
        filterable: true,
        grouping: false,
        serverFiltering: true,
        serverGrouping: false,
        serverPaging: true,
        pageSize: 20,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "Aggregates",
            model: {
                id: 'Reference',
                fields: {
                    Reference: { type: 'string' },
                    HeldReasons: { type: 'string' },
                    heldReaons: { type: 'object' },
                    Market: { type: 'string' },
                    MertexMarket: { type: 'object' },
                    CustomerCode: { type: 'string' },
                    CustomerName: { type: 'string' },
                    CustomerReference: { type: 'string' },
                    Value: { type: 'string' },
                    HasAllocations: { type: 'bool' },
                    ModifiedDT: { type: 'string' },
                    Expires: { type: 'string' },
                    AllowBasketView: { type: 'bool' },
                    AllowBasketEdit: { type: 'bool' },
                    AllowBasketRelease: { type: 'bool' },
                    AllowBasketDelete: { type: 'bool' },
                    AllowRetailPaymentDetails: { type: 'bool' },
                    AllowTransactionView: { type: 'bool' },
                    AllowTransactionEdit: { type: 'bool' },
                    AllowTransactionRelease: { type: 'bool' },
                    AllowTransactionDelete: { type: 'bool' },
                    Documents: { type: 'string' },
                    documents: { type: 'object' },
                    HeldSince: { type: 'string' },
                    BasketID: { type: 'number' },
                    LanguageID: { type: 'number' },
                    TransactionID: { type: 'number' },
                    Imported: { type: 'bool' }
                }
            }
        }),
        sort: {
            field: 'Expires',
            dir: 'desc'
        },
        //sort: { field: "BasketID", dir: "desc" },
        requestStart: function (e) {
            $("#grid-loading").show();
        },
        requestEnd: function (e) {
            $("#grid-loading").hide();
        },
        noDataTemplate: 'There are no Held Orders for your consideration.'
    });

    self.customMyHeldReasonFilterActive = ko.observable(false);

    self.myHeldOrdersResultGridSettings = {
        autoBind: true,
        widget: self.myHeldOrdersGridWidget,
        columns: self.myHeldOrdersGridColumns,
        data: self.myHeldOrdersGridDataSource,
        useKOTemplates: true,
        rowTemplate: 'held-order-row-template',
        sortable: true,
        filterable: {
            operators: {
                string: {
                    contains: "Contains",
                    eq: "Equal to",
                    neq: "Not equal to"
                }
            }
        },
        reorderable: false,
        paging: true,
        pageSize: 20,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        selectable: false,
        dataBound: function (e) {
            if (self.customMyHeldReasonFilterActive()) {
                $('th[data-field="HeldReasons"]').find('a.k-grid-filter').addClass('k-state-active');
            } else {
                $('th[data-field="HeldReasons"]').find('a.k-grid-filter').removeClass('k-state-active');
            }
        },
        filterMenuInit: function (e) {
            if (e.field === 'HeldReasons') {
                var popup = e.container.data("kendoPopup");
                var dataSource = this.dataSource;
                var field = e.field;
                var element = e.container.children(":first");

                var originalMultiCheck = e.container.children(":first");
                // helpTextElement.nextUntil(":has(.k-button)").remove();
                var element = $("<div class='custom-filter-checkbox-container'></div>").insertAfter(originalMultiCheck).kendoListView({
                    dataSource: getHoldReasons(),
                    template: "<label><input type='checkbox' value='#:" + field + "#'/>#:" + field + "#</label>"
                });
                originalMultiCheck.remove();
                e.container.children('.k-filter-selected-items').remove();

                e.container.find("[type='submit']").click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var filter = dataSource.filter() || { logic: "and", filters: [] };
                    var fieldFilters = $.map(element.find('input[type="checkbox"]:checked'), function (input) {
                        return {
                            field: field,
                            operator: "contains",
                            value: input.value
                        };
                    });
                    if (fieldFilters.length) {
                        self.removeFiltersForField(filter, field);
                        filter.filters.push({
                            logic: "or",
                            filters: fieldFilters
                        });
                        dataSource.filter(filter);
                        self.customMyHeldReasonFilterActive(true);
                    }
                    popup.close();
                });

                e.container.find("[type='reset']").click(function (e) {
                    self.customMyHeldReasonFilterActive(false);
                });
            }
        },
        noDataTemplate: 'There are no Held Orders for your consideration.'
    }

    self.clearMyHeldOrdersGridFilters = function () {
        self.customHeldReasonFilterActive(false);
        self.heldOrdersGridWidget().dataSource.filter({});
    }

    self.initBasketStatus = () => {
        //window.addEventListener('message', (event) => {
        //    if (event.origin != window.origin) {
        //        return;
        //    } else {
        //        switch (event.data.message) {
        //            case 'basketId event':
        //                self.busy(true);
        //                self.parent.orderFactory.loadBasket(Object.assign({
        //                    mertexVATLookupSuccessful: ko.observable(event.data.dataItem.MertexVATLookupSuccessful)
        //                }, event.data.dataItem), () => {
        //                    self.busy(false);
        //                });
        //                break;
        //            case 'requestAnimationFrame event':
        //                document.getElementById('basket-status-iframe').height = event.data.height;
        //                break;
        //            default:
        //                break;
        //        }
        //    }
        //})
    };
}

var dispatchFactory = function (parent) {
    var self = this;

    self.parent = parent;

    self.busy = parent.busy;

    self.currency = parent.currency;

    self.busyMessage = self.parent.busyMessage;

    self.allSubscriptions = [];

    self.deliveryTypeWarningSubscriptions = [];

    self.deliveryGroups = ko.observableArray([]);

    self.customerRequests = ko.observable();

    self.despatchNotifications = ko.observableArray([]);

    self.popoverTemplate = function () {
        return `<div class="popover product-details-popover parcel-estimate-popover" role="tooltip">
            <div class="arrow"></div>
            <div class="modal-header grey-blue">
                <h4 class="modal-title popover-title"></h4>
            </div>
            <div class="popover-content"></div>
        </div>`
    }

    // This is only applicable to very particular 'Retail' mode(s)
    self.retailTotalPayable = ko.pureComputed(function () {
        return Enumerable.From(self.deliveryGroups()).Select(function (x) {
            return x.retailTotalPayable()
        }).Sum()
    }, self);

    self.retailTotalRemaining = ko.pureComputed(function () {
        return Enumerable.From(self.deliveryGroups()).Select(function (x) {
            return x.retailRemainingPayable()
        }).Sum()
    }, self);

    self.showUPSWarning = ko.pureComputed(function () {
        //var arr = Enumerable.From(self.deliveryGroups()).Where(function (dg) {
        //    if (dg.deliveryService().FulfilmentTypeID == 1 || dg.deliveryService().FulfilmentTypeID == 3) {
        //        var ups = Enumerable.From(dg.hauliers).Where(function (h) {
        //            return h.haulier.haulierCodeGroup == 'UPS'
        //        }).ToArray()
        //        return ups.length > 0
        //    } else {
        //        return true;
        //    }
        //}).ToArray();
        //return arr.length == 0 // if we DON'T have any UPS haulCodeGroup, warn
        return false;
    }, self);

    self.selectedOrder = ko.observable();

    self.busy.subscribe(function (newValue) {
        console.log('a) dispatchFactory busy subscribe hit', newValue);
    });

    self.selectedService = ko.pureComputed(function () {
        if (self.selectedOrder()) {
            return self.selectedOrder().deliveryService()
        }
    });

    self.rebuildServicesList = function (haulierCode, data) {
        console.log('a) rebuildServicesList', haulierCode, data);
        //var alreadyFoundService = null;

        ko.utils.arrayForEach(self.selectedOrder().hauliers, function (h) {

            var serviceObjects = [];

            $.map(data.DeliveryServices, function (item) {

                if (item.HaulierCode == h.haulier.haulierCode) {

                    var currentDeliveryService = null;

                    if (self.selectedService()) {
                        if (self.selectedService().haulier.haulierCode == h.haulier.haulierCode) {
                            var loadedDeliveryServices = Enumerable.From(h.services()).Where(function (x) {
                                return x.ServiceCode == self.selectedService().ServiceCode;
                            }).ToArray();

                            if (loadedDeliveryServices.length == 1) {
                                currentDeliveryService = self.selectedService();
                                console.log('a) currentDeliveryService was detected as being equal to self.selectedService');
                            } else {
                                currentDeliveryService = Enumerable.From(loadedDeliveryServices).Where(function (x) {
                                    return x.ServiceDataOriginID == self.selectedService().ServiceDataOriginID;
                                }).FirstOrDefault();
                                console.log('a) firstOrDefault was selected');
                            }
                        }
                    }

                    var selectMinByPreference = false;

                    if (currentDeliveryService != null) {
                        console.log('a) found currentDeliveryService');
                    } else {
                        console.log('a) did not find currentDeliveryService');
                        selectMinByPreference = true;
                    }

                    var result = self.createServiceObject(h, item, currentDeliveryService); // sorry, we need the loadedItem to be passed in. It should be the previously selected delivery item if available.

                    serviceObjects.push(result);
                }
            });

            if (serviceObjects.length) // we do not want to rebuild the services list for ALL hauliers; just the one we are concerned with.
                h.services(serviceObjects);
        });

        var haulierRecord = Enumerable.From(self.selectedOrder().hauliers).Where(function (x) {
            return x.haulier.haulierCode == self.selectedService().haulier.haulierCode
        }).Single();

        haulierRecord.validationGroup = ko.validation.group(Enumerable.From(haulierRecord.services()).SelectMany('$.errorables').ToArray());

        //if (alreadyFoundService == null) {

        var deliveryService = Enumerable.From(haulierRecord.services()).MinBy('$.Preference');
        self.selectedOrder().deliveryService(deliveryService);

        //console.log('rebuildServicesList MinBy just fooled you - are you sure you even need to set the service here...?')

        //}
    }

    self.showServiceDetails = function (data) {
        self.selectedOrder(data);
        $('#service-details-modal').modal('show');
    }

    self.allSubscriptions.push(self.selectedOrder.subscribe(function (data) {
        console.log('a) dispatchFactory selectedOrder subscribe hit', data);
    }));

    self.discountReasons = ko.observableArray([]);

    self.customerAccountNumbers = ko.observableArray([]);

    self.customerDeliveryDefaults = ko.observableArray([]);

    self.basketDeliveryErrors = ko.observableArray([]);

    self.validateNow = ko.observable(true);

    self.refreshServicesList = function (haulierCode, onComplete) {
        var data = {
            basketId: self.parent.basketId(),
            basketSplitId: self.selectedOrder().deliveryGroup.basketSplitId,
            haulierCode: haulierCode
        };
        console.log('a) dispatchFactory refreshServicesList calling with', data);
        $.ajax({
            url: '/api/componentapi/RefreshDeliveryServicesList',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('a) dispatchFactory refreshServicesList returned', data);
                if (typeof onComplete === 'function')
                    onComplete(data);
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    }

    self.saveCustomerTransportAccountNumber = function (data, onComplete) {
        if (self.selectedOrder()) {
            var data = {
                basketId: self.parent.basketId(),
                basketSplitId: self.selectedOrder().deliveryGroup.basketSplitId,
                customerTransportAccountNumber: data
            };
            console.log('a) dispatchFactory calling saveCustomerTransportAccountNumber with', data);
            $.ajax({
                url: '/api/componentapi/SaveCustomerTransportAccountNumber',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('a) dispatchFactory saveCustomerTransportAccountNumber returned', data);
                    if (typeof onComplete === 'function')
                        onComplete(data);
                }
            });
        } else {
            console.log('deliveryFactory saveCustomerTransportAccountNumber was SKIPPED; self.selectedOrder() was null', data);
        }
    }

    self.deliveryTerms = ko.observableArray([]);

    self.createServiceObject = function (group, incoming, loadedItem) {

        var result = incoming;

        result.haulier = group.haulier;

        loadedItem = loadedItem == null ? {} : loadedItem;



        result.calculateDeliveryChargeAtDespatch = ko.observable(loadedItem.hasOwnProperty('CalculateDeliveryChargeAtDespatch') ? (loadedItem.CalculateDeliveryChargeAtDespatch != null ? loadedItem.CalculateDeliveryChargeAtDespatch : false) : incoming.CalculateDeliveryChargeAtDespatch)

        self.allSubscriptions.push(result.calculateDeliveryChargeAtDespatch.subscribe(function (newValue) {
            if (newValue && $('#discounter-collapse').hasClass('in')) {
                $('#delivery-service-discounter-btn').click();
            }
        }));

        result.calculateDeliveryChargeAtDespatchParams = {
            checkboxId: 'calculate-delivery-charge-later',
            label: 'Calculate Delivery Charge at Point of Despatch?',
            useNativeValidation: false,
            observable: result.calculateDeliveryChargeAtDespatch,
            disabled: ko.pureComputed(function () {
                return !result.allowDeliveryChargeCalculationAtDespatch;
            }, result)
        }

        result.calculateDeliveryChargeAtDespatch.subscribe(function (newValue) {
            if (newValue) {
                result.discounter.monetary.observable(undefined);
                result.operatorEnteredCharge.observable(undefined);
                result.discounter.currentState().readOnly(true);
                result.discounter.bypassValidation(true);
            } else {
                result.discounter.currentState().readOnly(false);
                result.discounter.bypassValidation(false);
            }
        });

        if (result.haulier.haulierCode != "DD") {
            result.discounter = new discounterFactory({
                delivery: true,
                currentDiscountMonetary: loadedItem.OperatorEnteredChargeEx,
                currentDiscountPercentage: loadedItem.OperatorDiscountPercentage,
                discountReasonId: loadedItem.DiscountReasonID,
                discountReasonComment: loadedItem.DiscountReasonComment,
                tradePromotionCodeId: loadedItem.TradePromotionCodeID,
                currency: self.parent.currency(),
                originalPriceEx: result.UnitDeliveryChargeEx,
                discountReasons: self.discountReasons,
                focPromoCodes: ko.observableArray([]),
                budgetManagers: ko.observableArray([]),
                tradePromoCodeIdRequired: false,
                haulierCode: result.haulier.haulierCode,
                fulfilmentTypeId: loadedItem.FulfilmentTypeID || result.FulfilmentTypeID,
                appendTo: '#delivery-services-modal',
                UnitDeliveryChargeEx: loadedItem.hasOwnProperty('UnitDeliveryChargeEx') ? loadedItem.UnitDeliveryChargeEx : incoming.UnitDeliveryChargeEx,
                calculateDeliveryChargeAtDespatch: result.calculateDeliveryChargeAtDespatch()
            });
            if (loadedItem.UnitDeliveryChargeEx == null) {
                result.discounter.selector.observable(DISCOUNT_STATE_MONETARY);
            }
        }
        else {  //if DD and OperatorEnteredChargeEx == 0, hide Discount? and Discounter Input, 
            //force selection of FoC PromoCode. 
            result.discounter = new discounterFactory({
                delivery: true,
                currentDiscountMonetary: null, // Direct Despatch scenario never permits "monetary" discount, and only needs to account
                // for 100% free.
                currentDiscountPercentage: loadedItem.OperatorDiscountPercentage,
                discountReasonId: loadedItem.DiscountReasonID,
                discountReasonComment: loadedItem.DiscountReasonComment,
                tradePromotionCodeId: loadedItem.TradePromotionCodeID,
                currency: self.parent.currency(),
                originalPriceEx: loadedItem.OperatorDiscountPercentage == 100 ? 0 : loadedItem.OperatorEnteredChargeEx,
                discountReasons: self.discountReasons,
                focPromoCodes: ko.observableArray([]),
                budgetManagers: ko.observableArray([]),
                tradePromoCodeIdRequired: false,
                discountEntryVisible: false,
                haulierCode: result.haulier.haulierCode,
                fulfilmentTypeId: loadedItem.FulfilmentTypeID || result.FulfilmentTypeID,
                appendTo: '#delivery-services-modal',
                calculateDeliveryChargeAtDespatch: result.calculateDeliveryChargeAtDespatch()
            });
        }

        self.allSubscriptions.push(result.discounter.subscriptions);

        result.operatorEnteredCharge = {
            label: ko.pureComputed(function () {
                if (self.parent.currency()) {
                    return `Delivery Charge Ex. VAT (${self.parent.currency().Symbol})`;
                }
            }, self),
            observable: ko.observable(loadedItem.OperatorEnteredChargeEx == null ? undefined : loadedItem.OperatorEnteredChargeEx).extend({
                required: {
                    params: true,
                    onlyIf: function () {
                        return result.FulfilmentTypeID == 5
                    },
                    message: 'You must enter an Operator Charge for Delivery'
                },
                numberFormatted: {
                    digits: 0,
                    currency: {
                        FormattingCulture: 'en-GB'
                    }
                }
            }),
            useNativeValidation: false,
            decorateInputElement: true,
            insertValidationMessages: false,
            showClear: false
        }

        self.allSubscriptions.push(result.operatorEnteredCharge.observable.subscribe(function (newValue) {
            console.log('operatorEnteredChargeEx subscribe hit', newValue);
            if (newValue == 0) {
                if (result.HaulierCode === 'DD') {
                    result.discounter.selector.observable(DISCOUNT_STATE_PERCENTAGE);
                    result.discounter.discountEntryVisible(true);
                    result.discounter.discounterBeginsHidden(false);
                    window.setTimeout(function () {
                        result.discounter.percentage.observable(100);
                        if (result.discounter.currentState().observable.hasOwnProperty('mdcTextField')) {
                            result.discounter.currentState().observable.mdcTextField.disabled = true;
                            result.discounter.currentState().observable.mdcTextField.layout();
                            result.discounter.selector.observable.mdcSelect.disabled = true;
                            result.discounter.selector.observable.mdcSelect.layout();
                        }
                    });
                } else {
                    result.discounter.percentage.observable(100);
                    if (result.discounter.currentState().observable.hasOwnProperty('mdcTextField')) {
                        result.discounter.currentState().observable.mdcTextField.disabled = true;
                        result.discounter.currentState().observable.mdcTextField.layout();
                        result.discounter.selector.observable.mdcSelect.disabled = true;
                        result.discounter.selector.observable.mdcSelect.layout();
                    }
                }
            } else {
                result.discounter.percentage.observable(undefined);
                result.discounter.discountEntryVisible(false);
                result.discounter.discounterBeginsHidden(true);
                if (result.discounter.currentState().observable.hasOwnProperty('mdcTextField')) {
                    result.discounter.currentState().observable.mdcTextField.disabled = false;
                    result.discounter.selector.observable.mdcSelect.disabled = false; 1
                }
            }
        }));

        result.availableChargingLogics = {
            label: 'Charging Logic',
            observable: ko.observable(loadedItem.DeliveryChargingLogicID ? loadedItem.DeliveryChargingLogicID : incoming.DeliveryChargingLogicID).extend({
                required: {
                    params: true,
                    onlyIf: function () {
                        return result.FulfilmentTypeID == 5
                    },
                    message: 'Charging Logic'
                }
            }),
            useNativeValidation: false,
            decorateInputElement: false,
            insertValidationMessages: false,
            //options: [{
            //    DeliveryChargingLogicID: 1,
            //    DeliveryChargingLogicName: 'Per Order'
            //}, {
            //    DeliveryChargingLogicID: 2,
            //    DeliveryChargingLogicName: 'Per Item'
            //}, {
            //    DeliveryChargingLogicID: 3,
            //    DeliveryChargingLogicName: 'Per Parcel'
            //    }],
            options: [{
                DeliveryChargingLogicID: 1,
                DeliveryChargingLogicName: 'Per Order'
            }],
            optionsText: 'DeliveryChargingLogicName',
            optionsValue: 'DeliveryChargingLogicID',
            optionsCaption: ' ',
            width: 'auto',
            showClear: true,
            onSelect: function () {

            }
        };

        result.showServiceDetails = function (data) {
            self.selectedOrder(data);
            $('#service-details-modal').modal('show');
        }

        result.OperatorEnteredChargingLogicID = loadedItem ? loadedItem.OperatorEnteredChargingLogicID : incoming.OperatorEnteredChargingLogicID;

        result.finalPrice = ko.pureComputed(function () {
            var result = (loadedItem.FinalDeliveryChargeEx != null ? loadedItem.FinalDeliveryChargeEx : incoming.FinalDeliveryChargeEx);
            if (result != null)
                return +result;
            else
                return null;
        }, result);

        result.finalPriceFormatted = ko.pureComputed(function () {
            return formatCurrency(result.finalPrice(), 2, self.parent.currency().FormattingCulture, self.parent.currency().ISO_4217);
        }, result);

        result.finalPriceFormattedForDisplay = ko.pureComputed(function () {
            if (result.finalPrice() === 0) {
                return 'FREE';
            }
            if (result.finalPrice() != null)
                return result.finalPriceFormatted() + ' Ex. VAT ' + (loadedItem.FinalDeliveryChargingLogicName ? loadedItem.FinalDeliveryChargingLogicName : incoming.FinalDeliveryChargingLogicName);
            else {
                if (result.calculateDeliveryChargeAtDespatch()) {
                    return `<span class="display-block bold text-info margin-bottom-5">Calculated at Point of Despatch</span>`;
                } else {
                    return `<span class="display-block bold text-danger margin-bottom-5">Please enter a Charge</span>`;
                }
            }
        }, result);

        result.finalDeliveryVAT = ko.observable(loadedItem.FinalDeliveryVAT != null ? loadedItem.FinalDeliveryVAT : incoming.FinalDeliveryVAT);

        result.vat = ko.pureComputed(function () {
            return +(result.finalDeliveryVAT());
        }, result);

        result.vatFormatted = ko.pureComputed(function () {
            return formatCurrency(result.vat(), 2, self.parent.currency().FormattingCulture, self.parent.currency().ISO_4217);
        }, result);

        result.finalTotalFormattedForDisplayIncludingVAT = ko.pureComputed(function () {
            return formatCurrency(result.finalPrice() + result.vat(), 2, self.parent.currency().FormattingCulture, self.parent.currency().ISO_4217) + ' Inc. VAT ' + (loadedItem.FinalDeliveryChargingLogicName ? loadedItem.FinalDeliveryChargingLogicName : incoming.FinalDeliveryChargingLogicName);
        }, result);

        result.customerRequestsFullDespatch = ko.observable(loadedItem.hasOwnProperty('CustomerRequestsFullDespatch') ? (loadedItem.CustomerRequestsFullDespatch != null ? loadedItem.CustomerRequestsFullDespatch : false) : incoming.CustomerRequestsFullDespatch);

        if (loadedItem.hasOwnProperty('CustomerRequestsFullDespatch')) {
            result.CustomerRequestsFullDespatch = loadedItem.CustomerRequestsFullDespatch;
        }

        result.customerRequestsFullDespatchParams = {
            checkboxId: 'full-despatch-' + result.BasketSplitID,
            label: 'Despatch only when all items are in stock?',
            observable: result.customerRequestsFullDespatch,
            useNativeValidation: false,
            disabled: ko.pureComputed(function () {
                return result.haulier.deliveryType() != 'N'
            }, result)
        };

        result.errorables = [
            group.haulier.customersAccountNumberTransport.observable,
            group.haulier.customersAccountNumberDutyTaxes.observable,
            group.haulier.availableDeliveryTerms.observable,
            result.operatorEnteredCharge.observable,
            result.availableChargingLogics.observable
        ];

        result.removeDiscount = function (data) {

            console.log(data);

            $.confirm('Are you sure?', 'This will remove the currently applied discount from this delivery group.', function () {

                self.selectedOrder(data);

                self.selectedService().discounter.load(function () {

                    self.selectedService().discounter.monetary.observable(undefined);
                    self.selectedService().discounter.percentage.observable(undefined);
                    self.selectedService().discounter.discountReason.observable(undefined);
                    self.selectedService().discounter.customDiscountReason.observable(undefined);
                    self.selectedService().operatorEnteredCharge.observable(undefined);
                    self.selectedService().discounter.bypassValidation(true);

                    self.saveDeliveryOptions(function () {

                        console.log('a) dispatchFactory save returned');

                        self.fetchDispatchInfo(result.BasketSplitID);

                    }, result.BasketSplitID);

                });

            }, function () {

            });
        }

        //if (result.haulier.haulierCode != "DD") // Direct Dispatch does not offer a discounter
        result.errors = ko.validation.group(result.errorables.concat(result.discounter.errorables));
        //else
        //    result.errors = ko.validation.group(result.errorables);

        result.notifySubscribers = function () {
            group.haulier.notifySubscribers();
            result.discounter.notifySubscribers();
            result.operatorEnteredCharge.observable.isValid.notifySubscribers(result.operatorEnteredCharge.observable.isValid());
            result.availableChargingLogics.observable.isValid.notifySubscribers(result.availableChargingLogics.observable.isValid());
        }

        result.allowDeliveryChargeCalculationAtDespatch = loadedItem.hasOwnProperty('AllowDeliveryChargeCalculationAtDespatch') ? (loadedItem.AllowDeliveryChargeCalculationAtDespatch != null ? loadedItem.AllowDeliveryChargeCalculationAtDespatch : false) : incoming.AllowDeliveryChargeCalculationAtDespatch;

        window.setTimeout(function () {
            result.discounter.load();

            if (result.calculateDeliveryChargeAtDespatch()) {
                result.discounter.monetary.observable(undefined);
                result.operatorEnteredCharge.observable(undefined);
                result.discounter.currentState().readOnly(true);
                result.discounter.bypassValidation(true);
            }
        }, 0);

        //console.log('a) dispatchFactory finished createServiceObject', result);

        return result;
    }

    self.fetchDispatchInfo = function (basketSplitId, onComplete) {
        self.busy(true);
        self.busyMessage('Loading Despatch Options...');

        var data = {
            basketId: self.parent.basketId(),
            basketSplitId: basketSplitId
        }

        console.log('a) dispatchFactory fetchDispatchInfo called', data);

        $.ajax({
            url: '/api/componentapi/FetchDispatchInfo',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('a) dispatchFactory fetchDispatchInfo returned', data);

                self.customerRequests(data.CustomerRequests);

                let parcelEstimateBreakdowns = JSON.parse(data.ParcelEstimateBreakdowns);

                if (!self.lastChancePhone.observable()) {
                    if (self.parent.basketServerObject().DeliveryAlertLandlinePhoneNumber ??
                        self.parent.basketServerObject().TradeAccount.PhoneNumber) {
                        self.lastChancePhone.observable(self.parent.basketServerObject().DeliveryAlertLandlinePhoneNumber ??
                            self.parent.basketServerObject().TradeAccount.PhoneNumber);
                        self.lastChancePhone.countryObservable(self.parent.basketServerObject().DeliveryAlertLandlinePhoneCountryCode ??
                            (self.parent.basketServerObject().TradeAccount.CountryCode == "IC" ? "ES" : self.parent.basketServerObject().TradeAccount.CountryCode));
                        if (self.lastChancePhone.observable.hasOwnProperty('intlTel') &&
                            self.lastChancePhone.observable.intlTel != null)
                            self.lastChancePhone.observable.intlTel.setCountry(self.lastChancePhone.countryObservable());
                        if (self.lastChancePhone.observable()) {
                            if (self.lastChancePhone.observable().indexOf('00') == 0) {
                                self.lastChancePhone.observable(self.lastChancePhone.observable().replace('00', ''));
                            }
                        }
                    }
                }

                //if (self.parent.basketServerObject().DeliveryAlertMobilePhoneNumber) {
                if (!self.lastChanceMobilePhone.observable()) {
                    self.lastChanceMobilePhone.observable(self.parent.basketServerObject().DeliveryAlertMobilePhoneNumber);
                    self.lastChanceMobilePhone.countryObservable(self.parent.basketServerObject().DeliveryAlertMobilePhoneCountryCode ??
                        (self.parent.basketServerObject().TradeAccount.CountryCode == "IC" ? "ES" : self.parent.basketServerObject().TradeAccount.CountryCode));
                    if (self.lastChanceMobilePhone.observable.hasOwnProperty('intlTel') &&
                        self.lastChanceMobilePhone.observable.intlTel != null)
                        self.lastChanceMobilePhone.observable.intlTel.setCountry(self.lastChanceMobilePhone.countryObservable());
                    if (self.lastChanceMobilePhone.observable()) {
                        if (self.lastChanceMobilePhone.observable().indexOf('00') == 0) {
                            self.lastChanceMobilePhone.observable(self.lastChanceMobilePhone.observable().replace('00', ''));
                        }
                    }
                }
                //}

                if (!self.lastChanceDeliveryEmail()) {
                    self.lastChanceDeliveryEmail(self.parent.basketServerObject().DeliveryAlertEmail);
                }

                if (self.lastChanceDeliveryEmail() == null) {
                    if (self.parent.emailManager.emails().length >= 1) {
                        self.lastChanceDeliveryEmail(self.parent.emailManager.emails()[0].observable());
                    }
                }

                if (self.lastChanceContactName.observable() == null) {
                    if (self.parent.deliveryAddress.name.observable()) {
                        self.lastChanceContactName.observable(self.parent.deliveryAddress.name.observable());
                    } else if (self.parent.deliveryAddress.companyName.observable()) {
                        self.lastChanceContactName.observable(self.parent.deliveryAddress.companyName.observable());
                    }
                }

                // if we've just saved an individual... we'll be loading an individual, not wanting to clear out all the other gubbins.
                // detect by basket split id which group was altered, and set the delivery service appropriately.

                self.basketDeliveryErrors(data.DeliveryErrors);

                if (data.BasketSplitResults == null) {
                    if (self.basketDeliveryErrors() == null) {
                        self.basketDeliveryErrors([]);
                    }
                    self.basketDeliveryErrors.push({
                        Error: 'An unexpected exception occurred. This has been logged to a database. Please contact itsupport mentioning the date and time of this error.'
                    });
                }

                ko.utils.arrayForEach(self.deliveryTypeWarningSubscriptions, function (sub) {
                    if (sub.hasOwnProperty('dispose'))
                        if (typeof sub.dispose === 'function')
                            sub.dispose();
                });

                if (basketSplitId) {

                    var group = Enumerable.From(self.deliveryGroups()).Where(function (x) {
                        return x.deliveryGroup.basketSplitId == basketSplitId
                    }).SingleOrDefault();

                    if (group == null) {
                        console.error(`just saved basketSplitId ${basketSplitId} but failed to find the same in self.deliveryGroups!`);
                    } else {
                        $.extend(data.SelectedDeliveryServices[0], {
                            haulier: group.deliveryService().haulier
                        });
                        group.deliveryService(self.createServiceObject({
                            haulier: group.deliveryService().haulier
                        },
                            group.deliveryService(),
                            data.SelectedDeliveryServices[0]
                        ));
                        self.parent.basketServerObject.valueHasMutated();
                    }

                    if (group.deliveryService().haulier.deliveryType() == 'W' || group.deliveryService().haulier.deliveryType() == 'T') {
                        self.deliveryTypeWarningSubscriptions.push(group.deliveryService.subscribe(function (newValue) {
                            $.error('Shipment Warning', 'This customer is set up to receive their orders via consolidated shipment.<br/><br/>' +
                                'You have manually changed the delivery service for this order, indicating that this order should not go into their regular shipment.<br/><br/>' +
                                'If this is correct, please remember to change the Delivery Type to "N"');
                        }));
                    }

                } else {
                    // we've loaded the whole gubbins, go for it.

                    self.customerDeliveryDefaults(data.CustomerDeliveryDefaults);
                    self.customerAccountNumbers(data.CustomerAccountNumbers); // this needs joining into the main list of results, on haulier.
                    self.discountReasons(data.DiscountReasons);
                    self.deliveryTerms(data.DeliveryTerms);

                    var grouped = Enumerable.From(data.DeliveryServices).GroupBy(function (x) { // group the delivery services, by... quite a lot of things, I'm afraid.

                        var basketSplit = Enumerable.From(data.BasketSplitResults).Where(function (y) {
                            return y.BasketSplitID == x.BasketSplitID
                        }).FirstOrDefault(); // each group has exactly one basket split id, otherwise bad things.

                        // this works nicely, hopefully it's never to be used.
                        if (basketSplit == null) {
                            $.error('Whoops', 'An error occurred building delivery services.<br/><br/>Please <a href="mailto:itsupport@designersguild.com?subject=Portal Order Entry Error&body=DispatchFactory.fetchDispatchInfo failed to identify a BasketSplitID. BasketID: ' + self.parent.basketId() + '">click here to notify itsupport@designersguild.com</a>', function () {
                                self.parent.phase(ORDERFACTORY_PHASE_BASKET);
                            });
                        }

                        var group = {
                            basketSplitId: x.BasketSplitID,
                            deliveryGroupId: x.DeliveryGroupID,
                            sortOrder: basketSplit.SortOrder,
                            name: basketSplit.BasketSplitName,
                            products: ko.pureComputed({
                                read: function () {
                                    // We must match basket records to this basket split by RowNumber
                                    //var products = Enumerable.From(self.parent.basket()).Where(function (z) {
                                    //    if (Enumerable.From(data.BasketSplitResults).Where(function (y) {
                                    //            return y.BasketSplitID == x.BasketSplitID;
                                    //        }).Select('$.RowNumber').ToArray().indexOf(z.record.RowNumber) > -1)
                                    //        return z;
                                    //}).ToArray();

                                    // Apparently the above was false.
                                    // The above was not false; it was correct.

                                    // Basket Split ID does not exist on BasketItem prior to Despatch being built.
                                    // The above is saying "Give me all of the RowNumbers involved in this particular basket split 

                                    var products = Enumerable.From(self.parent.basket()).Where(function (z) {
                                        return z.record.BasketSplitID == x.BasketSplitID;
                                    }).ToArray();

                                    // child products must be identified from this basket split's group of products
                                    var childProducts = Enumerable.From(products).Where(function (w) {
                                        return (w.record.ParentRowNumber != null)
                                    }).ToArray();

                                    // the child products must then be removed from this group of products
                                    var filteredProducts = products.filter(function (x) {
                                        return Enumerable.From(childProducts).Select('$.record.RowNumber').ToArray().indexOf(x.record.RowNumber) == -1;
                                    });

                                    // and then inserted in their appropriate positions in the resultant array.
                                    childProducts.forEach(function (child) {
                                        filteredProducts.splice(filteredProducts.findIndex(function (parent) {
                                            if (parent.record.RowNumber == child.record.ParentRowNumber)
                                                parent.HasChildren = true;
                                            return parent.record.RowNumber == child.record.ParentRowNumber;
                                        }) + 1, 0, child);
                                    });

                                    filteredProducts.forEach(function (product) {
                                        product.BasketSplitName = basketSplit.BasketSplitName;
                                        // each product here needs to pick up its despatch estimate from the relevant row number...
                                        product.DespatchEstimate = Enumerable.From(data.BasketSplitResults).Where(function (y) {
                                            return (y.RowNumber == product.record.RowNumber)
                                        }).Select('$.DespatchEstimate').SingleOrDefault();
                                    });

                                    return filteredProducts;
                                }
                            }, self),
                            visible: true,
                            revealAllProducts: ko.observable(false),
                            warnDeliveryServiceChanged: ko.observable(false)
                        }
                        group.quantity = ko.pureComputed(function () {
                            return Enumerable.From(this.products()).Where('$.record.BasketVisible').Select('+$.record.Quantity').Sum().toFixed(1);
                        }, group);
                        group.totalEx = ko.pureComputed(function () {
                            return Enumerable.From(this.products()).Select('+$.record.SubTotal').Sum()
                        }, group);
                        group.vat = ko.pureComputed(function () {
                            return Enumerable.From(this.products()).Select('+$.record.VATSubTotal').Sum()
                        }, group); 6
                        group.totalWithoutDelivery = ko.pureComputed(function () {
                            return this.totalEx() + this.vat()
                        }, group);
                        group.parcelEstimateBreakdown = ko.pureComputed(function () {
                            var breakdowns = Enumerable.From(parcelEstimateBreakdowns).Where(function (x) {
                                return x.BasketSplitID == group.basketSplitId
                            }).ToArray();

                            let heading = breakdowns[0];

                            var wrapper = $("<div></div>");

                            var dl = $('<dl class="dl-horizontal heading-dl"></dl>');


                            $(dl).append(`<dt>Basket ID</dt>`);
                            $(dl).append(`<dd>${self.parent.basketId()}</dd>`);
                            $(dl).append(`<dt>Basket Split ID</dt>`);
                            $(dl).append(`<dd>${heading.BasketSplitID}</dd>`);
                            $(dl).append(`<dt>Delivery Group</dt>`);
                            $(dl).append(`<dd>${group.name}</dd>`);

                            wrapper.append(dl);

                            $.map(breakdowns, function (breakdown) {

                                var bdWrapper = $('<div class="estimated-parcel-grid"></div>');

                                var dlExp = $('<dl class="dl-horizontal"></dl>');

                                $(dlExp).append(`<dt style="width: 210px">Estimated Number of Parcels</dt>`);
                                $(dlExp).append(`<dd style="margin-left: 220px">${breakdown.EstimatedParcelCount}</dd>`);
                                $(dlExp).append(`<dd style="margin-left: 0;">${breakdown.Explanation}</dd>`);

                                var productsContainer = $('<div></div>');

                                $.map(breakdown.Products, function (p) {

                                    var product = $('<div class="product"></div>');
                                    var dlProduct = $('<dl class="dl-horizontal"></dl>');

                                    $(dlProduct).append(`<dt>Code</dt>`);
                                    $(dlProduct).append(`<dd>${p.Code}</dd>`);
                                    $(dlProduct).append(`<dt>Quantity</dt>`);
                                    $(dlProduct).append(`<dd>${p.Quantity}</dd>`);
                                    $(dlProduct).append(`<dt>Unit Net Weight</dt>`);
                                    $(dlProduct).append(`<dd>${p.UnitNetWeight}</dd>`);
                                    $(dlProduct).append(`<dt>Basket Item ID</dt>`);
                                    $(dlProduct).append(`<dd>${p.BasketItemID}</dd>`);
                                    $(dlProduct).append(`<dt>Product ID</dt>`);
                                    $(dlProduct).append(`<dd>${p.ProductID}</dd>`);

                                    product.append(dlProduct);

                                    productsContainer.append(product);

                                });

                                bdWrapper.append(productsContainer);

                                bdWrapper.append(dlExp);

                                wrapper.append(bdWrapper);
                            });

                            return wrapper[0].outerHTML;
                        }, group);
                        group.parcelEstimatePopoverDetails = {
                            title: 'Parcel Estimate Breakdown',
                            label: null,
                            content: group.parcelEstimateBreakdown,
                            placement: 'left',
                            trigger: 'click',
                            template: self.popoverTemplate()
                        }
                        // Right, so we've grouped data.DeliveryServices by their BasketSplitIDs and have a handful of properties for each group, including the group's list of products.

                        return group;
                    },
                        '',
                        function (deliveryGroup, groupServices) {

                            //1) Do we have a SelectedDeliveryService for this DeliveryGroup ? (Match on BasketSplitID)
                            //    Y: "thisGroupsSelectedServiceFromDatabase" is set to this SelectedDeliveryService record - Goto 2
                            //    N: Nothing had been saved about this DeliveryGroup before. The desired DeliveryService must be selected by.MinBy(Preference) - this should be unique across all services from all hauliers.

                            var thisGroupsSelectedServiceFromDatabase = Enumerable.From(data.SelectedDeliveryServices).Where(function (x) {
                                return x.BasketSplitID == deliveryGroup.basketSplitId
                            }).SingleOrDefault();

                            if (thisGroupsSelectedServiceFromDatabase != null) {
                                console.log('a) thisGroupsSelectedServiceFromDatabase was', thisGroupsSelectedServiceFromDatabase)
                            }

                            var hauliers = Enumerable.From(groupServices.source).GroupBy(function (service) {
                                var accNoDefaults = Enumerable.From(self.customerAccountNumbers()).Where(function (an) {
                                    return an.HaulierCode == service.HaulierCode
                                }).SingleOrDefault()

                                var haulier = {
                                    haulierCodeGroup: service.HaulierCodeGroup,
                                    haulierCode: service.HaulierCode,
                                    haulierName: service.HaulierName,
                                    sortOrder: service.HaulierSortOrder,
                                    allowCustomerHaulierAccountForTransportCharges: service.AllowCustomerHaulierAccountForTransportCharges,
                                    allowCustomerHaulierAccountForDutyAndTax: service.AllowCustomerHaulierAccountForDutyAndTax,
                                    servicesBusy: ko.observable(false),
                                    defaultCustomerTransportAccountNumber: accNoDefaults ? accNoDefaults.HaulierTransportAccountCode : null,
                                    defaultCustomerDutyTaxesAccountNumber: accNoDefaults ? accNoDefaults.HaulierDutyTaxAccountCode : null
                                }

                                haulier.consolidatedShipmentButtons = {
                                    justified: true,
                                    observable: ko.observable(CONSOLIDATED_SHIPMENT),
                                    buttons: [{
                                        enable: true,
                                        btnClass: 'btn-white-blue border-thick',
                                        btnActiveClass: 'btn-blue-active border-thick',
                                        value: NONCONSOLIDATED_SHIPMENT,
                                        text: 'Designers Guild'
                                    }, {
                                        enable: true,
                                        btnClass: 'btn-white-blue border-thick',
                                        btnActiveClass: 'btn-blue-active border-thick',
                                        value: CONSOLIDATED_SHIPMENT,
                                        text: 'Customer'
                                    }]
                                };

                                //var deliveryTermsDefault = thisGroupsSelectedServiceFromDatabase ? thisGroupsSelectedServiceFromDatabase.DeliveryTerms : Enumerable.From(self.customerDeliveryDefaults()).Where(function (cdd) {
                                //    return cdd.BasketSplitID == deliveryGroup.basketSplitId
                                //}).Select(function (cdd) {
                                //    return cdd.DeliveryTerms
                                //}).SingleOrDefault();

                                var deliveryTermsDefault = thisGroupsSelectedServiceFromDatabase ? thisGroupsSelectedServiceFromDatabase.DeliveryTerms : undefined

                                haulier.deliveryTerms = ko.observable(deliveryTermsDefault).extend({
                                    required: {
                                        params: true,
                                        onlyIf: function () {
                                            return self.validateNow();
                                        },
                                        message: 'Delivery Terms'
                                    }
                                });

                                haulier.deliveryTerms.subscribe((newValue) => { console.log('deliveryTerms', newValue) });

                                haulier.availableDeliveryTermOptions = ko.pureComputed(function () {
                                    return Enumerable.From(self.deliveryTerms()).Where(function (x) {
                                        if (self.selectedService())
                                            return x.HAULCODE == self.selectedService().haulier.haulierCode
                                        else
                                            return false;
                                    }).ToArray();
                                }, self);

                                haulier.availableDeliveryTermOptions.subscribe(function (newValues) {
                                    if (newValues.length == 1) {
                                        haulier.deliveryTerms(haulier.availableDeliveryTermOptions()[0].Code);
                                    }
                                });

                                haulier.availableDeliveryTerms = {
                                    label: 'Delivery Terms',
                                    widget: ko.observable(),
                                    observable: haulier.deliveryTerms,
                                    useNativeValidation: false,
                                    decorateInputElement: false,
                                    insertValidationMessages: false,
                                    // this options list wants to be reduced by the selected service's haulier code.
                                    options: haulier.availableDeliveryTermOptions, // like that.
                                    optionsText: 'Name',
                                    optionsValue: 'Code',
                                    optionsCaption: ' ',
                                    width: 'auto',
                                    showClear: true,
                                    onSelect: function () {

                                    }
                                };

                                /* If <> N then the operator should be offered the option to change it to N i.e. 
                                 * You can offer an account the option to turn off consolidation if they had it, 
                                 * but you can't offer them the ability to consolidate if they don't already have it.
                                 */

                                var customerDefaultsForSplit = Enumerable.From(self.customerDeliveryDefaults()).Where(function (cdd) {
                                    return cdd.BasketSplitID == deliveryGroup.basketSplitId
                                }).SingleOrDefault();

                                if (customerDefaultsForSplit == null) {
                                    $.showError({ responseText: 'Customer Defaults for this BasketSplit was NULL, order-products.js:12108' }, JSON.stringify(haulier));
                                    console.error('Customer Defaults for Split was NULL.', haulier);
                                }

                                haulier.defaultDeliveryType = customerDefaultsForSplit.DeliveryType;
                                haulier.defaultDeliveryTerms = customerDefaultsForSplit.DeliveryTerms;

                                haulier.deliveryType = ko.observable(thisGroupsSelectedServiceFromDatabase ? thisGroupsSelectedServiceFromDatabase.DeliveryType : haulier.defaultDeliveryType);

                                haulier.availableDeliveryTypes = {
                                    label: 'Delivery Type',
                                    widget: ko.observable(),
                                    observable: haulier.deliveryType,
                                    useNativeValidation: false,
                                    decorateInputElement: false,
                                    insertValidationMessages: false,
                                    options: [{
                                        Name: 'N - Not Consolidated',
                                        Code: 'N'
                                    }, {
                                        Name: 'T - Consolidated [Customer Address on Parcel]',
                                        Code: 'T'
                                    }, {
                                        Name: 'W - Consolidated [End Customer Address on Parcel]',
                                        Code: 'W'
                                    }],
                                    optionsText: 'Name',
                                    optionsValue: 'Code',
                                    optionsCaption: ' ',
                                    width: 'auto',
                                    showClear: true,
                                    enable: true,
                                    onSelect: function () {

                                    }
                                };

                                haulier.customersAccountNumberTransport = {
                                    label: 'Customer\'s ' + haulier.haulierName + ' Account Number',
                                    focusObservable: ko.observable(),
                                    originalValue: thisGroupsSelectedServiceFromDatabase ? thisGroupsSelectedServiceFromDatabase.TransportBilledToCode : haulier.defaultCustomerTransportAccountNumber,
                                    observable: ko.observable(thisGroupsSelectedServiceFromDatabase ? thisGroupsSelectedServiceFromDatabase.TransportBilledToCode : haulier.defaultCustomerTransportAccountNumber).extend({
                                        required: {
                                            params: true,
                                            onlyIf: function () {
                                                return self.validateNow() &&
                                                    (
                                                        // validateNow is actually always true for dispatchFactory.
                                                        // however it is important to not be forcing validation on properties belonging to hauliers which are not selected, thus:
                                                        Enumerable.From(self.deliveryGroups()).Where(function (x) {
                                                            return x.deliveryService().HaulierCode == haulier.haulierCode
                                                        }).Any() &&
                                                        haulier.allowCustomerHaulierAccountForTransportCharges != false &&
                                                        haulier.transportShipperButtons.observable() == PAYEE_CUSTOMER
                                                    );
                                            },
                                            message: haulier.haulierName + ' - Transport Account Number Required'
                                        }
                                    }),
                                    useNativeValidation: false,
                                    decorateInputElement: false,
                                    insertValidationMessages: false,
                                    showClear: true,
                                    clearFunction: function () {
                                        var self = this;
                                        self.observable(undefined);
                                        $(self.observable.DOMElement).focus();
                                    },
                                    revertFunction: function () {
                                        var self = this;
                                        self.observable(haulier.defaultCustomerTransportAccountNumber);
                                        $(self.observable.DOMElement).focus();
                                    },
                                    charsRemainingOptions: {
                                        maxLength: 20
                                    }
                                };

                                if (haulier.allowCustomerHaulierAccountForTransportCharges === false) {
                                    haulier.customersAccountNumberTransport.observable(undefined);
                                }

                                //var originalDutyTaxAccountCode = Enumerable.From(data.CustomerAccountNumbers).Where(function(x) {
                                //    return x.HaulierCode == haulier.haulierCode
                                //}).Select('$.HaulierDutyTaxAccountCode').SingleOrDefault();

                                haulier.customersAccountNumberDutyTaxes = {
                                    label: 'Customer\'s ' + haulier.haulierName + ' Account Number',
                                    originalValue: thisGroupsSelectedServiceFromDatabase ? thisGroupsSelectedServiceFromDatabase.DutyTaxBilledToCode : haulier.defaultCustomerDutyTaxesAccountNumber,
                                    observable: ko.observable(thisGroupsSelectedServiceFromDatabase ? thisGroupsSelectedServiceFromDatabase.DutyTaxBilledToCode : haulier.defaultCustomerDutyTaxesAccountNumber).extend({
                                        required: {
                                            params: true,
                                            onlyIf: function () {
                                                return self.validateNow() &&
                                                    (
                                                        Enumerable.From(self.deliveryGroups()).Where(function (x) {
                                                            return x.deliveryService().HaulierCode == haulier.haulierCode
                                                        }).Any() &&
                                                        haulier.allowCustomerHaulierAccountForDutyAndTax != false &&
                                                        haulier.dutyTaxesShipperButtons.observable() == PAYEE_CUSTOMER
                                                    )
                                            },
                                            message: haulier.haulierName + ' - Taxes & Duty Account Number Required'
                                        }
                                    }),
                                    useNativeValidation: false,
                                    decorateInputElement: false,
                                    insertValidationMessages: false,
                                    showClear: true,
                                    clearFunction: function () {
                                        var self = this;
                                        self.observable(undefined);
                                        $(self.observable.DOMElement).focus();
                                    },
                                    revertFunction: function () {
                                        var self = this;
                                        self.observable(haulier.defaultCustomerDutyTaxesAccountNumber);
                                        $(self.observable.DOMElement).focus();
                                    },
                                    charsRemainingOptions: {
                                        maxLength: 20
                                    }
                                };

                                if (haulier.allowCustomerHaulierAccountForDutyAndTax === false) {
                                    haulier.customersAccountNumberDutyTaxes.observable(undefined);
                                }

                                // PAYEE_CUSTOMER or PAYEE_DESIGNERSGUILD ?
                                var transportShipperButtonsInitialState = PAYEE_DESIGNERSGUILD; // default to DG.

                                if (haulier.allowCustomerHaulierAccountForTransportCharges == 1)
                                    transportShipperButtonsInitialState = PAYEE_CUSTOMER; // if we're forced to Customer paying, set it.

                                if (haulier.allowCustomerHaulierAccountForTransportCharges == null) { // if we've got the option DG or Customer paying...
                                    if (haulier.defaultCustomerTransportAccountNumber != null) // if we have a default customer transport account number...
                                        transportShipperButtonsInitialState = PAYEE_CUSTOMER // set Customer paying...

                                    if (thisGroupsSelectedServiceFromDatabase) { // unless we've already saved
                                        if (thisGroupsSelectedServiceFromDatabase.TransportBilledToName == 'Designers Guild') { // with DG paying.
                                            transportShipperButtonsInitialState = PAYEE_DESIGNERSGUILD;
                                        }
                                    }
                                }

                                var transportShipperButtonsVisible = (haulier.allowCustomerHaulierAccountForTransportCharges == null);

                                // PAYEE_CUSTOMER or PAYEE_DESIGNERSGUILD ?
                                var dutyTaxesShipperButtonsInitialState = PAYEE_DESIGNERSGUILD; // default to DG.

                                var dutyTaxesShipperButtonsVisible = (haulier.allowCustomerHaulierAccountForDutyAndTax == null ||
                                    haulier.allowCustomerHaulierAccountForDutyAndTax == 1);

                                if (haulier.allowCustomerHaulierAccountForDutyAndTax == 1)
                                    dutyTaxesShipperButtonsInitialState = PAYEE_CUSTOMER;

                                if (haulier.allowCustomerHaulierAccountForDutyAndTax == null) {
                                    if (haulier.defaultCustomerDutyTaxesAccountNumber != null)
                                        dutyTaxesShipperButtonsInitialState = PAYEE_CUSTOMER

                                    if (thisGroupsSelectedServiceFromDatabase) {
                                        if (thisGroupsSelectedServiceFromDatabase.DutyTaxBilledToName == 'Designers Guild') {
                                            dutyTaxesShipperButtonsInitialState = PAYEE_DESIGNERSGUILD;
                                        }
                                    }
                                }

                                haulier.transportShipperButtons = {
                                    justified: true,
                                    observable: ko.observable(transportShipperButtonsInitialState),
                                    visible: transportShipperButtonsVisible,
                                    buttons: [{
                                        visible: (haulier.allowCustomerHaulierAccountForTransportCharges == null),
                                        btnClass: 'btn-white-blue border-thick',
                                        btnActiveClass: 'btn-blue-active border-thick',
                                        value: PAYEE_DESIGNERSGUILD,
                                        text: 'Designers Guild'
                                    }, {
                                        visible: (haulier.allowCustomerHaulierAccountForTransportCharges == null),
                                        btnClass: 'btn-white-blue border-thick',
                                        btnActiveClass: 'btn-blue-active border-thick',
                                        value: PAYEE_CUSTOMER,
                                        text: 'Customer'
                                    }]
                                };

                                haulier.dutyTaxesShipperButtons = {
                                    justified: true,
                                    observable: ko.observable(dutyTaxesShipperButtonsInitialState),
                                    visible: dutyTaxesShipperButtonsVisible,
                                    buttons: [{
                                        visible: (haulier.allowCustomerHaulierAccountForDutyAndTax == null),
                                        btnClass: 'btn-white-blue border-thick',
                                        btnActiveClass: 'btn-blue-active border-thick',
                                        value: PAYEE_DESIGNERSGUILD,
                                        text: 'Designers Guild'
                                    }, {
                                        visible: (haulier.allowCustomerHaulierAccountForDutyAndTax == null),
                                        btnClass: 'btn-white-blue border-thick',
                                        btnActiveClass: 'btn-blue-active border-thick',
                                        value: PAYEE_CUSTOMER,
                                        text: 'Customer'
                                    }]
                                };

                                self.allSubscriptions.push(haulier.transportShipperButtons.observable.subscribe(function (newValue) {
                                    console.log('dispatchFactory haulier transportShipperButtons observable subscribe hit', newValue);
                                    if (self.selectedOrder()) {
                                        switch (newValue) {
                                            case PAYEE_DESIGNERSGUILD:
                                                //console.log('haulier transportShipperButtons observable subscribe hit : PAYEE_DESIGNERSGUILD - TransportBilledToCode was: ', haulier.customersAccountNumberTransport.observable());
                                                if (haulier.customersAccountNumberTransport.observable()) {
                                                    haulier.customersAccountNumberTransport.observable(undefined);
                                                }

                                                haulier.servicesBusy(true);

                                                self.saveDeliveryOptions(function () {
                                                    self.refreshServicesList(haulier.haulierCode, function (data) {
                                                        self.rebuildServicesList(haulier.haulierCode, data);
                                                        haulier.servicesBusy(false);
                                                    });
                                                }, self.selectedOrder().deliveryGroup.basketSplitId);

                                                //console.log('haulier transportShipperButtons observable subscribe hit : PAYEE_DESIGNERSGUILD - TransportBilledToCode is now NULL');
                                                break;
                                            case PAYEE_CUSTOMER:
                                                //console.log('haulier transportShipperButtons observable subscribe hit : PAYEE_CUSTOMER - TransportBilledToCode was: ', haulier.customersAccountNumberTransport.observable());
                                                haulier.customersAccountNumberTransport.observable(haulier.customersAccountNumberTransport.originalValue);
                                                break;
                                        }
                                    }
                                }));

                                self.allSubscriptions.push(haulier.dutyTaxesShipperButtons.observable.subscribe(function (newValue) {
                                    console.log('dispatchFactory haulier dutyTaxesShipperButtons observable subscribe hit', newValue);
                                    switch (newValue) {
                                        case PAYEE_DESIGNERSGUILD:
                                            //console.log('haulier dutyTaxesShipperButtons observable subscribe hit : PAYEE_DESIGNERSGUILD - DutyTaxBilledToCode was: ', haulier.customersAccountNumberDutyTaxes.observable());
                                            haulier.customersAccountNumberDutyTaxes.observable(null);
                                            //console.log('haulier dutyTaxesShipperButtons observable subscribe hit : PAYEE_DESIGNERSGUILD - DutyTaxBilledToCode is now NULL');
                                            break;
                                        case PAYEE_CUSTOMER:
                                            //console.log('haulier dutyTaxesShipperButtons observable subscribe hit : PAYEE_CUSTOMER - DutyTaxBilledToCode was: ', haulier.customersAccountNumberDutyTaxes.observable());
                                            haulier.customersAccountNumberDutyTaxes.observable(haulier.customersAccountNumberDutyTaxes.originalValue);
                                            break;
                                    }
                                }));

                                self.allSubscriptions.push(haulier.customersAccountNumberTransport.observable.subscribe(function (newValue) {
                                    if (newValue) {
                                        console.log('customersAccountNumberTransport.observable subscribe hit', newValue);
                                        // to ensure they're carried over through the service refresh...
                                        if (self.selectedService()) {
                                            self.selectedService().TransportBilledToCode = newValue;
                                            self.selectedService().DutyTaxBilledToCode = self.selectedService().haulier.customersAccountNumberDutyTaxes.observable();
                                        }

                                        haulier.servicesBusy(true);

                                        // this will not have a value if these subscriptions are fired when not viewing the delivery services modal 
                                        // but... why is it firing at all in this case when simply loading out the value? it should be the INITIAL value
                                        if (self.selectedOrder()) {

                                            $.error('Warning', 'You have changed the Transport Charge Account Number.<br/><br/>Delivery Services are being refreshed.<br/><br/><strong>YOU MUST RE-SELECT YOUR REQUIRED DELIVERY SERVICE.</strong>');

                                            self.saveDeliveryOptions(function () {
                                                self.refreshServicesList(self.selectedService().haulier.haulierCode, function (data) {
                                                    console.log('a) dispatchFactory save singular successful, refreshed basketSplitId', self.selectedOrder().deliveryGroup.basketSplitId);
                                                    self.rebuildServicesList(self.selectedService().haulier.haulierCode, data);
                                                    haulier.servicesBusy(false);
                                                });
                                            }, self.selectedOrder().deliveryGroup.basketSplitId);
                                        }
                                    }
                                }));

                                self.allSubscriptions.push(haulier.customersAccountNumberDutyTaxes.observable.subscribe(function (newValue) {
                                    if (self.selectedService()) {
                                        self.selectedService().DutyTaxBilledToCode = newValue;
                                    }
                                }));

                                haulier.notifySubscribers = function () {
                                    haulier.customersAccountNumberTransport.observable.isValid.notifySubscribers(haulier.customersAccountNumberTransport.observable.isValid());
                                    haulier.customersAccountNumberDutyTaxes.observable.isValid.notifySubscribers(haulier.customersAccountNumberDutyTaxes.observable.isValid());
                                }

                                return haulier;

                            }, function (grouping) {
                                return grouping;
                            }, function (key, services) {

                                var group = {
                                    haulier: key,
                                }

                                //2) Do we have a matching haulier for {item} (based on HaulierCode)?
                                //	Y: Goto 3
                                //	N: ALERT ABOUT SERVICE CHANGES (c. line 11776)
                                let haulierMatch = false;

                                var firstPass = $.map(services.source, function (result) {
                                    if (thisGroupsSelectedServiceFromDatabase != null) {
                                        if (Enumerable.From(data.DeliveryServices).Where(function (x) {
                                            return x.HaulierCode == thisGroupsSelectedServiceFromDatabase.HaulierCode
                                        }).Any) {
                                            haulierMatch = true;
                                            //3) Does this haulier's list of services include {item.ServiceCode}?
                                            //    Y: Gather a list of the services which match on serviceCode, goto 4
                                            //    N: Alert about service changes
                                            if (result.ServiceCode == thisGroupsSelectedServiceFromDatabase.ServiceCode) {
                                                result.matchesLoadedItemOnServiceCode = true;
                                            }
                                        }
                                    }
                                    return result;
                                });

                                var matchingServicesByCode = Enumerable.From(firstPass).Where(function (x) {
                                    return x.matchesLoadedItemOnServiceCode == true;
                                }).ToArray();

                                //4) Do we have exactly one match on serviceCode?
                                //    Y: Goto 5a
                                //    N: Goto 5b
                                if (matchingServicesByCode.length == 1) {
                                    //5a) Y: Great, instruct the singular matched service record from this haulier to attempt to load { item }, Goto 7
                                    //    N: Goto 5b
                                    matchingServicesByCode[0].toLoad = thisGroupsSelectedServiceFromDatabase;
                                }

                                //5b) Do we have > 1 match on ServiceCode ?
                                //  Y: Goto 6a
                                //  N: Goto 6b
                                if (matchingServicesByCode.length > 1) {
                                    // we now need to match on ServiceDataOriginID.
                                    var matchedOnDataOriginId = Enumerable.From(matchingServicesByCode).Where(function (x) {
                                        return x.ServiceDataOriginID == thisGroupsSelectedServiceFromDatabase.ServiceDataOriginID;
                                    }).FirstOrDefault();

                                    //6a) FirstOrDefault the matching DeliveryServices list by ServiceDataOriginID. Got something ?
                                    //  Y: Great, instruct the FirstOrDefault service record to attempt to load { item }, Goto 7
                                    //  N: Alert about service changes

                                    if (matchedOnDataOriginId != null) {
                                        matchedOnDataOriginId.toLoad = thisGroupsSelectedServiceFromDatabase;
                                    } else {
                                        // ALERT ABOUT SERVICE CHANGES
                                        deliveryGroup.warnDeliveryServiceChanged(true);
                                    }
                                }

                                // 7) So you think you can load this SelectedDeliveryService into this DeliveryService result. Great. Does the price match ?
                                //   Y: Great, go ahead and load. All user-entered values (Discounts, reasons etc.) should be loaded from thisGroupsSelectedServiceFromDatabase.
                                //   N: Scrap the load, alert about delivery service changes.
                                if (thisGroupsSelectedServiceFromDatabase != null) {
                                    if (haulierMatch == true) {
                                        // if there WAS a delivery service on this basketSplitId

                                        // 6b) We have no matches on ServiceCode.
                                        // Alert about service changes.
                                        if (matchingServicesByCode.length == 0) {
                                            // ALERT ABOUT SERVICE CHANGES
                                            deliveryGroup.warnDeliveryServiceChanged(true);
                                        }
                                    } else {
                                        // ALERT ABOUT SERVICE CHANGES
                                        // So. Here, unfortunately, we are flagging to warn for all hauliers which do not have a basketSplitId saved for one of their services.
                                        // This is wrong; some other haulier may have the service.
                                        deliveryGroup.warnDeliveryServiceChanged(true);
                                    }
                                }

                                var serviceObjects = $.map(firstPass, function (result) {
                                    if (result.toLoad != null) {
                                        if (result.toLoad.TotalDeliveryChargeEx != result.TotalDeliveryChargeEx) {
                                            //||
                                            //result.toLoad.DeliveryPostcode != self.parent.deliveryAddress.postcode.observable() ||
                                            //result.toLoad.DeliveryCountryID != self.parent.deliveryAddress.countryId()) {
                                            // N: Scrap the load, alert about delivery service changes.
                                            result.toLoad = null;
                                            deliveryGroup.warnDeliveryServiceChanged(true);
                                        }
                                    }
                                    return self.createServiceObject(group, result, result.toLoad);
                                });

                                group.services = ko.observableArray(serviceObjects);

                                group.validationGroup = ko.validation.group(Enumerable.From(group.services()).SelectMany('$.errorables').ToArray());

                                return group;

                            }, function (haulier) {
                                return haulier.haulierCodeGroup
                            }).OrderBy(function (x) {
                                return x.haulier.sortOrder
                            }).ToArray();

                            // the saved return might not be present in my list: item will not be null, but cannot be matched.
                            // if it cannot be matched we must go for Preference == 1.
                            var deliveryService = Enumerable.From(hauliers).SelectMany('$.services()').MinBy('$.Preference');
                            // by default, we want to select the minByPreference.

                            // however, a haulier might have one of its services with a .toLoad object on it now. This was determined to be a valid load.

                            if (thisGroupsSelectedServiceFromDatabase != null) { // this just matches on basketSplitId

                                var loadedHaulier = Enumerable.From(hauliers).Where(function (x) {
                                    return x.haulier.haulierCodeGroup == thisGroupsSelectedServiceFromDatabase.HaulierCodeGroup
                                }).SingleOrDefault();

                                if (loadedHaulier != null) {
                                    var loadedDeliveryService = Enumerable.From(loadedHaulier.services()).Where(function (x) {
                                        return x.toLoad != null
                                    }).SingleOrDefault();

                                    if (loadedDeliveryService != null) {
                                        deliveryService = loadedDeliveryService;
                                        deliveryGroup.warnDeliveryServiceChanged(false);
                                        console.log('a) deliveryService WAS LOADED from the SelectedDeliveryServices');
                                    } else {
                                        console.log('a) deliveryService was NOT loaded from SelectedDeliveryServices')
                                    }
                                } else {
                                    console.log('a) deliveryService was NOT loaded from SelectedDeliveryServices')
                                }
                            } else {
                                console.log('a) deliveryService was NOT loaded from SelectedDeliveryServices');
                            }

                            console.log('a) deliveryService is', deliveryService);

                            // if the loaded service was not viable, we *must* have the given deliveryGroup's deliveryService object 
                            // changed... which it should be by the above MinBy...

                            //if (deliveryService != null) { // on initial load, this WILL be missed.
                            //    //console.log(`a) setting transportShipperButtons and dutyTaxesShipperButtons, 
                            //    //        TransportBilledToName: ${deliveryService.TransportBilledToName}, 
                            //    //        TransportBilledToCode: ${deliveryService.TransportBilledToCode}, 
                            //    //        DutyTaxBilledToName: ${deliveryService.DutyTaxBilledToName}, 
                            //    //        DutyTaxBilledToCode: ${deliveryService.DutyTaxBilledToCode}, 
                            //    //        Haulier: ${deliveryService.haulier.haulierName}`);

                            //    //deliveryService.haulier.transportShipperButtons.observable(deliveryService.TransportBilledToCode ? PAYEE_CUSTOMER : PAYEE_DESIGNERSGUILD);

                            //    //deliveryService.haulier.dutyTaxesShipperButtons.observable(deliveryService.DutyTaxBilledToCode ? PAYEE_CUSTOMER : PAYEE_DESIGNERSGUILD);

                            //    window.setTimeout(function () { // let those two observables fire their subscriptions, which intentionally clear the below observables.
                            //        if (deliveryService.TransportBilledToCode)
                            //            deliveryService.haulier.customersAccountNumberTransport.observable(deliveryService.TransportBilledToCode);

                            //        if (deliveryService.DutyTaxBilledToCode)
                            //            deliveryService.haulier.customersAccountNumberDutyTaxes.observable(deliveryService.DutyTaxBilledToCode);
                            //    }, 0);
                            //}

                            // no, retard!

                            hauliers.forEach(function (h) {
                                if (h.haulier.deliveryTerms() == null) {
                                    h.haulier.deliveryTerms(deliveryService.DeliveryTerms);
                                }
                            });

                            let result = {
                                deliveryGroup: deliveryGroup,
                                services: ko.observableArray(groupServices.source),
                                hauliers: hauliers,
                                deliveryService: ko.observable(deliveryService),
                                afterNavTabsRender: function () {
                                    $('a[data-toggle="tab"]', $('#delivery-services-modal')).on('shown.bs.tab', function (e) {
                                        // as the user switches around the tabs, we must select the first preferred service on the visible haulier by preference, if none is already selected.
                                        var ctext = ko.contextFor(e.currentTarget).$data;
                                        if (ctext.services().indexOf(self.selectedOrder().deliveryService()) == -1) {
                                            self.selectedOrder().deliveryService(Enumerable.From(ctext.services()).MinBy('$.Preference'));
                                            self.selectedOrder().deliveryService().operatorEnteredCharge.observable.valueHasMutated(true);
                                        }
                                    });
                                },
                                isValid: ko.observable(true)
                            }

                            if (result.deliveryService().haulier.deliveryType() == 'W' || result.deliveryService().haulier.deliveryType() == 'T') {
                                self.deliveryTypeWarningSubscriptions.push(result.deliveryService.subscribe(function (newValue) {
                                    $.error('Shipment Warning', 'This customer is set up to receive their orders via consolidated shipment.<br/><br/>' +
                                        'You have manually changed the delivery service for this order, indicating that this order should not go into their regular shipment.<br/><br/>' +
                                        'If this is correct, please remember to change the Delivery Type to "N"');
                                }));
                            }

                            result.customerRequestNotMet = ko.computed(function () {

                                if (self.customerRequests() != null) {

                                    let customerRequests = self.customerRequests();

                                    if (customerRequests.CustomerRequestHaulierCode != null) {
                                        if (customerRequests.CustomerRequestHaulierCode != result.deliveryService().HaulierCode) {
                                            return true;
                                        }
                                    }
                                    if (customerRequests.CustomerRequestServiceCode != null) {
                                        if (customerRequests.CustomerRequestServiceCode != result.deliveryService().ServiceCode) {
                                            return true;
                                        }
                                    }
                                    if (customerRequests.CustomerRequestHaulierAccountNumberForShippingCharge != null) {
                                        if (customerRequests.CustomerRequestHaulierAccountNumberForShippingCharge != result.deliveryService().TransportBilledToCode) {
                                            return true;
                                        }
                                    }
                                    if (customerRequests.CustomerRequestHaulierAccountNumberForDuty != null) {
                                        if (customerRequests.CustomerRequestHaulierAccountNumberForDuty != result.deliveryService().DutyTaxBilledToCode) {
                                            return true;
                                        }
                                    }
                                    if (customerRequests.CustomerRequestDeliveryTerms != null) {
                                        if (customerRequests.CustomerRequestDeliveryTerms != result.deliveryService().DeliveryTerms) {
                                            return true;
                                        }
                                    }
                                    if (customerRequests.CustomerRequestDeliveryType != null) {
                                        if (customerRequests.CustomerRequestDeliveryType != result.deliveryService().DeliveryType) {
                                            return true;
                                        }
                                    }

                                    if (customerRequests.CustomerRequestsFullDespatch != null) {
                                        if (customerRequests.CustomerRequestsFullDespatch != result.deliveryService().customerRequestsFullDespatch()) {
                                            return true;
                                        }
                                    }
                                }

                                return false; // customer request was absent or met
                            }, self);

                            result.retailPaymentEntries = ko.observableArray([]);

                            result.retailTotalPayable = ko.observable();

                            result.retailRemainingPayable = ko.pureComputed(function () {
                                var totalRemaining = this.retailTotalPayable();
                                if (totalRemaining) {
                                    ko.utils.arrayForEach(this.retailPaymentEntries(), function (paymentEntry) {
                                        totalRemaining = Math.round((totalRemaining - +(paymentEntry.retailPaymentAmount() || 0)) * 100) / 100;
                                    });
                                }
                                return Math.round(totalRemaining * 100) / 100;
                            }, result);

                            result.addRetailPaymentEntry = function () {
                                result.retailPaymentEntries.push(retailPaymentEntry({
                                    record: {
                                        basketSplitId: result.deliveryGroup.basketSplitId,
                                        loadedValue: {},
                                        retailPaymentMax: result.retailRemainingPayable
                                    },
                                    loadedValue: {},
                                    parent: self.parent
                                }));
                            }

                            result.removeRetailPaymentEntry = function (entry) {
                                $.confirm('Are you sure?', 'This will remove this payment entry.', function () {
                                    result.retailPaymentEntries.remove(entry);
                                });
                            }

                            self.allSubscriptions.push(result.deliveryService.subscribe(function (newValue) {
                                console.log('despatchFactory deliveryService subscribe hit', newValue, result);
                            }));

                            return result;
                        }, function (deliveryGroup) { // comparison function for the deliveryGroup groupBy 
                            return deliveryGroup.basketSplitId
                        }).OrderBy(function (x) {
                            return x.deliveryGroup.sortOrder
                        }).ToArray();

                    //console.log(grouped);

                    ko.utils.arrayForEach(self.parent.basket(), function (item) {
                        item.basketSplitId = Enumerable.From(data.BasketSplitResults).Where(function (x) {
                            return x.RowNumber == item.RowNumber;
                        }).Select('$.BasketSplitID').SingleOrDefault();
                    });

                    if (Enumerable.From(grouped).Where(function (x) {
                        return x.deliveryGroup.warnDeliveryServiceChanged() == true
                    }).Any()) {
                        $.info('Warning', 'One or more of your delivery services has changed. Please review your delivery services.');
                    }

                    self.deliveryGroups(grouped);

                    // when do we want to show this thing...
                    //if (self.lastChanceDeliveryEmail() == null ||
                    //    self.lastChancePhone.observable() == null ||
                    //    self.lastChanceMobilePhone.observable() == null) {
                    //}

                    // if the above then we'll never see it again after the first successful save

                    // if below... no, below is defunct

                    //if (Enumerable.From(self.deliveryGroups()).Where(function (dg) {
                    //    return dg.deliveryService().DemandMobilePhoneNumber === true
                    //}).Any() && self.parent.deliveryAddress.phone.observable() == null) {
                    //    self.showLastChanceModal();
                    //}

                    self.save = function () {
                        console.log('a) dispatchFactory save called with', self.selectedOrder().deliveryService());

                        self.validateNow(true);

                        window.setTimeout(function () {
                            self.selectedOrder().deliveryService().errors.showAllMessages(false);
                            if (self.selectedOrder().deliveryService().errors().length > 0) {
                                self.selectedOrder().deliveryService().errors.showAllMessages(true);
                                self.selectedOrder().deliveryService().errors.filter(function (x) {
                                    if (!x.isValid()) {
                                        x.isValid.notifySubscribers(x.isValid());
                                    }
                                });
                                //self.selectedOrder().deliveryService().notifySubscribers();
                                if (!self.selectedOrder().deliveryService().discounter.monetary.observable.isValid()) {
                                    if (!$('#discounter-collapse').hasClass('in')) {
                                        $('#delivery-service-discounter-btn').click();
                                    }
                                }
                                console.log('a) dispatchFactory save rejected', self.selectedOrder().deliveryService().errors());
                            } else {
                                console.log('a) dispatchFactory save permissible');
                                self.busy(true);
                                self.busyMessage('Saving Despatch Options...');
                                self.saveDeliveryOptions(function () {

                                    console.log('a) dispatchFactory save returned');

                                    self.fetchDispatchInfo(self.selectedOrder().deliveryGroup.basketSplitId); // do I need to fetch here...? why? yes I do because... without reloading following the change,
                                    // we're still seeing what was PREVIOUSLY the state of play, not what might have just been updated.
                                    // this should be considered to be an inefficiency...

                                    //self.refreshServicesList(self.selectedService().haulier.haulierCode, function (data) {
                                    //    console.log('a) dispatchFactory save singular successful, refreshed basketSplitId', self.selectedOrder().deliveryGroup.basketSplitId);
                                    //    self.rebuildServicesList(self.selectedService().haulier.haulierCode, data);
                                    //});
                                    $('#delivery-services-modal').modal('hide');
                                }, self.selectedOrder().deliveryGroup.basketSplitId);
                                // save just this basket split... then... reload the delivery services... 
                                // saveThisBasketSplitDelivery(onComplete () { reloadThisHaulierServiceList })

                            }
                        }, 0);
                    }
                }

                if (typeof onComplete === 'function') {
                    onComplete();
                }

                self.despatchNotifications([]);

                if (data.hasOwnProperty('Notifications') && data.Notifications != null) {
                    let result = data.Notifications.json;

                    ko.utils.arrayForEach(result.Notifications, function (n) {
                        self.despatchNotifications.push(tradeAccountOrderNotification({ record: n, result: result, parent: self }));
                    });

                    for (var i = 0; i < self.despatchNotifications().length; i++) {
                        if (i < self.despatchNotifications().length)
                            self.despatchNotifications()[i].nextNotice = self.despatchNotifications()[i + 1];
                    }

                    if (self.despatchNotifications().length) {
                        self.despatchNotifications()[0].show();
                    }
                }

                self.busy(false);
                self.busyMessage(undefined);
            },
            error: function (xhr, s, a) {
                self.busy(false);
                self.busyMessage(undefined);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    }

    self.validateLastChanceNow = ko.observable(false);

    self.lastChancePhoneCountry = ko.observable();

    self.lastChancePhoneObservable = ko.observable();
    self.lastChanceMobilePhoneObservable = ko.observable();

    self.lastChancePhoneAtLeastOneProvided = ko.pureComputed(function () {
        if (self.lastChancePhoneObservable() ||
            self.lastChanceMobilePhoneObservable())
            return true;
        else
            return false;
    }, self);

    self.lastChanceMobilePhoneObservable.extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateLastChanceNow() && !self.lastChancePhoneAtLeastOneProvided();
            },
            message: 'Last Chance Mobile Phone Number'
        },
        numberTypeValid: ko.observable()
    });

    self.lastChancePhoneObservable.extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateLastChanceNow() && !self.lastChancePhoneAtLeastOneProvided();
            },
            message: 'Last Chance Landline Phone Number'
        },
        numberTypeValid: ko.observable()
    });

    self.lastChancePhone = {
        label: ko.observable('Landline Phone for Customs Queries'),
        observable: self.lastChancePhoneObservable,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        visible: ko.observable(true),
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
            self.observable.isValid.notifySubscribers(true);
        },
        charsRemainingOptions: {
            maxLength: 20
        },
        intlMobile: true,
        numberType: intlTelInputUtils.numberType.FIXED_LINE,
        placeholderNumberType: 'FIXED_LINE',
        validateNow: self.validateLastChanceNow,
        countryObservable: self.lastChancePhoneCountry,
        readOnly: ko.observable(false),
        disabled: ko.observable(false),
    };

    self.lastChancePhoneCountry.subscribe(nv => {
        console.log('lastChancePhoneCountry', nv);
    });

    self.lastChancePhone.autoPlaceholder = 'polite';
    self.lastChancePhone.preferredCountries = ['gb'];

    self.lastChancePhoneCountry.subscribe(function (newValue) {
        if (newValue) {
            window.setTimeout(function () {
                if (self.lastChancePhone.observable.hasOwnProperty('intlTel')) {
                    if (newValue.Code != null) {
                        self.lastChancePhone.observable.intlTel.setCountry(newValue.Code.toLowerCase());
                    }
                    if (self.lastChancePhone.observable.hasOwnProperty('mdcTextField')) {
                        self.lastChancePhone.observable.mdcTextField.label_.float(true);
                        self.lastChancePhone.observable.mdcTextField.getDefaultFoundation().adapter_.notchOutline(
                            self.lastChancePhone.observable.mdcTextField.getDefaultFoundation().adapter_.getLabelWidth() * 0.75
                        );
                    }
                }
            }, 100);
        } else {
            window.setTimeout(function () {
                if (self.lastChancePhone.observable.hasOwnProperty('intlTel')) {
                    self.lastChancePhone.observable.intlTel.setCountry('gb');
                }
                if (self.lastChancePhone.observable.hasOwnProperty('mdcTextField')) {
                    self.lastChancePhone.observable.mdcTextField.label_.float(true);
                    self.lastChancePhone.observable.mdcTextField.getDefaultFoundation().adapter_.notchOutline(
                        self.lastChancePhone.observable.mdcTextField.getDefaultFoundation().adapter_.getLabelWidth() * 0.75
                    );
                }
            }, 100);
        }
    });

    self.lastChanceMobilePhoneCountry = ko.observable();

    self.lastChanceMobilePhone = {
        label: ko.observable('Mobile Phone for Delivery Alerts'),
        observable: self.lastChanceMobilePhoneObservable,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        visible: ko.observable(true),
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
            self.observable.isValid.notifySubscribers(true);
        },
        charsRemainingOptions: {
            maxLength: 20
        },
        intlMobile: true,
        numberType: intlTelInputUtils.numberType.MOBILE,
        validateNow: self.validateLastChanceNow,
        countryObservable: self.lastChanceMobilePhoneCountry,
        readOnly: ko.observable(false),
        disabled: ko.observable(false)
    };

    self.lastChanceMobilePhone.autoPlaceholder = 'polite';
    self.lastChanceMobilePhone.preferredCountries = ['gb'];

    self.lastChanceMobilePhoneCountry.subscribe(function (newValue) {
        if (newValue) {
            window.setTimeout(function () {
                if (self.lastChanceMobilePhone.observable.hasOwnProperty('intlTel')) {
                    if (newValue.Code != null) {
                        self.lastChanceMobilePhone.observable.intlTel.setCountry(newValue.Code.toLowerCase());
                    }
                    if (self.lastChanceMobilePhone.observable.hasOwnProperty('mdcTextField')) {
                        self.lastChanceMobilePhone.observable.mdcTextField.label_.float(true);
                        self.lastChanceMobilePhone.observable.mdcTextField.getDefaultFoundation().adapter_.notchOutline(
                            self.lastChanceMobilePhone.observable.mdcTextField.getDefaultFoundation().adapter_.getLabelWidth() * 0.75
                        );
                    }
                }
            }, 100);
        } else {
            window.setTimeout(function () {
                if (self.lastChanceMobilePhone.observable.hasOwnProperty('intlTel')) {
                    self.lastChanceMobilePhone.observable.intlTel.setCountry('gb');
                }
                if (self.lastChanceMobilePhone.observable.hasOwnProperty('mdcTextField')) {
                    self.lastChanceMobilePhone.observable.mdcTextField.label_.float(true);
                    self.lastChanceMobilePhone.observable.mdcTextField.getDefaultFoundation().adapter_.notchOutline(
                        self.lastChanceMobilePhone.observable.mdcTextField.getDefaultFoundation().adapter_.getLabelWidth() * 0.75
                    );
                }
            }, 100);
        }
    });

    self.lastChanceDeliveryEmail = ko.observable().extend({
        emailList: {
            params: true,
            message: 'Last Chance Delivery Email'
        },
        required: {
            params: true,
            onlyIf: function () {
                return self.validateLastChanceNow()
            },
            message: 'Last Chance Email'
        }
    });

    self.lastChanceContactName = {
        label: 'Delivery Contact Name',
        originalValue: ko.observable(),
        observable: ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateLastChanceNow() && (self.parent.basketRequiresEORI() || self.parent.anyTuffnellsDespatches())
                },
                message: 'Last Chance Delivery Contact Name'
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: false
    }

    self.lastChanceErrors = new ko.validation.group([
        self.lastChanceDeliveryEmail.observable,
        self.lastChanceContactName.observable,
        self.parent.eoriNumber
    ]);

    self.lastChanceDeliveryEmailParams = {
        label: 'Email Address for Delivery Alerts',
        originalValue: ko.observable(),
        observable: self.lastChanceDeliveryEmail,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: false
    };

    //self.isLastChancePhoneValid = function () {
    //    let isValid = true;
    //    if (self.lastChancePhone.observable.hasOwnProperty('intlTel')) {
    //        if (self.lastChancePhone.observable.intlTel.getNumber()) {
    //            if (!self.lastChancePhone.observable.intlTel.isValidNumber() ||
    //                !(self.lastChancePhone.observable.intlTel.getNumberType() == 0)) {
    //                hasPhoneErrored = true;
    //                self.lastChancePhone.observable.isValid.notifySubscribers(false);
    //                isValid = false;
    //            }
    //        }
    //        //else {
    //        //    if (!self.lastChancePhone.observable.isValid()) {
    //        //        isValid = false;
    //        //        self.lastChancePhone.observable.isValid.notifySubscribers(false);
    //        //    }
    //        //}
    //    }
    //    return isValid;
    //}

    //self.isLastChanceMobilePhoneValid = function () {
    //    let isValid = true;
    //    if (self.lastChanceMobilePhone.observable.hasOwnProperty('intlTel')) {
    //        if (self.lastChanceMobilePhone.observable.intlTel.getNumber()) {
    //            if (!self.lastChanceMobilePhone.observable.intlTel.isValidNumber() ||
    //                !(self.lastChanceMobilePhone.observable.intlTel.getNumberType() == 1)) {
    //                hasPhoneErrored = true;
    //                self.lastChanceMobilePhone.observable.isValid.notifySubscribers(false);
    //                isValid = false;
    //            }
    //        }
    //        //else {
    //        //    if (!self.lastChanceMobilePhone.observable.isValid()) {
    //        //        isValid = false;
    //        //        self.lastChanceMobilePhone.observable.isValid.notifySubscribers(false);
    //        //    }
    //        //}
    //    }
    //    return isValid;
    //}

    //self.parent.deliveryAddressFactory.deliveryAddress.country.subscribe(function (newValue) {
    //    if (newValue) {
    //        self.lastChancePhoneCountry(newValue);
    //        self.lastChanceMobilePhoneCountry(newValue);
    //    }
    //});

    self.showLastChanceModal = function () {
        self.parent.deliveryAddressFactory.deliveryAddress.loadFromOtherAddressObject(self.parent.deliveryAddress);
        $('#last-chance-modal').modal('show');
    }

    self.cancelLastChanceModal = function () {
        self.parent.phase(ORDERFACTORY_PHASE_DISPATCH);
        self.closeLastChanceModal();
    }

    self.closeLastChanceModal = function () {
        $('#last-chance-modal').modal('hide');
    }

    self.validateLastChancePhones = function () {

        if (self.lastChancePhone.observable.isValid()) {
            self.lastChancePhone.observable.numberTypeValid.notifySubscribers(self.lastChancePhone.observable.numberTypeValid());
        } else {
            self.lastChancePhone.observable.isValid.notifySubscribers(self.lastChancePhone.observable.isValid());
        }

        if (self.lastChanceMobilePhone.observable.isValid()) {
            self.lastChanceMobilePhone.observable.numberTypeValid.notifySubscribers(self.lastChanceMobilePhone.observable.numberTypeValid());
        } else {
            self.lastChanceMobilePhone.observable.isValid.notifySubscribers(false);
        }

        return self.lastChancePhone.observable.isValid() &&
            self.lastChancePhone.observable.numberTypeValid() &&
            self.lastChanceMobilePhone.observable.isValid() &&
            self.lastChanceMobilePhone.observable.numberTypeValid.isValid()
    }

    self.saveLastChanceModal = function () {
        // eee
        //self.validateLastChanceNow(false);
        // ooo

        if (self.validateLastChanceNow()) {
            self.validateLastChanceNow.valueHasMutated();
        } else {
            self.validateLastChanceNow(true);
        }

        //let lastChanceLandline = self.isLastChancePhoneValid();
        //let lastChanceMobile = self.isLastChanceMobilePhoneValid();

        window.setTimeout(function () {
            if (self.lastChanceErrors().length) {
                self.lastChanceErrors.filter(function (x) {
                    x.isValid.notifySubscribers(x.isValid());
                });

                var lastChancePhonesValid = self.validateLastChancePhones();
            } else {

                var lastChancePhonesValid = self.validateLastChancePhones();

                if (lastChancePhonesValid) {
                    self.busy(true);
                    $.ajax({
                        url: '/api/componentapi/SaveBasketLastChanceModal',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            basketId: self.parent.basketId(),
                            landline: self.lastChancePhone.observable(),
                            landlineCountryCode: self.lastChancePhone.countryObservable(),
                            mobile: self.lastChanceMobilePhone.observable(),
                            mobileCountryCode: self.lastChanceMobilePhone.countryObservable(),
                            email: self.lastChanceDeliveryEmail(),
                            eori: self.parent.eoriNumber(),
                            contactName: self.lastChanceContactName.observable(),
                            isDeliveryAddressTrade: false
                        },
                        success: function (data) {
                            self.busy(false);
                            if (self.lastChanceContactName.observable()) {
                                self.parent.deliveryAddress.name.observable(self.lastChanceContactName.observable())
                            }
                            if (self.lastChanceMobilePhone.observable()) {
                                self.parent.basketServerObject().DeliveryAlertMobilePhoneNumber = self.lastChanceMobilePhone.observable();
                                self.parent.basketServerObject().DeliveryAlertMobilePhoneCountryCode = self.lastChanceMobilePhoneCountry();
                                self.parent.deliveryAddress.phone.observable(self.lastChanceMobilePhone.observable());
                            }
                            if (self.lastChancePhone.observable()) {
                                self.parent.basketServerObject().DeliveryAlertLandlinePhoneNumber = self.lastChancePhone.observable();
                                self.parent.basketServerObject().DeliveryAlertLandlinePhoneCountryCode = self.lastChancePhoneCountry();
                            }
                            if (self.lastChanceDeliveryEmail()) {
                                self.parent.deliveryAddress.email.observable(self.lastChanceDeliveryEmail());
                            }
                            self.closeLastChanceModal();
                            self.parent.phase(ORDERFACTORY_PHASE_COMMENTS);
                        },
                        error: function (xhr, s, a) {
                            self.busy(false);
                            $.showError(xhr, s, a);
                        }
                    });
                }
            }
        }, 0);
    };

    self.UPSDeliveryEstimatesUnavailable = ko.pureComputed(function () {
        var upsHauliers = Enumerable.From(self.deliveryGroups()).Where(function (x) {
            return x.deliveryService().FulfilmentTypeID == 1
        }).SelectMany(function (x) {
            return Enumerable.From(x.hauliers).SelectMany(function (y) {
                return y.services();
            }).ToArray();
        }).Where(function (x) {
            return x.HaulierCode == "UPS"
        }).ToArray();

        if (upsHauliers.length) {
            return Enumerable.From(upsHauliers).Where(function (x) {
                return x.DeliveryEstimateMin == null
            }).Any();
        } else {
            return false;
        }
    }, self);

    self.fetchTimeInTransit = function () {
        $.ajax({
            url: '/api/componentapi/FetchUPSTimeInTransit',
            type: 'POST',
            dataType: 'json',
            data: {},
            success: function (data) {
                console.log(data);
            }
        });
    }

    self.showDeliveryOptions = function (data) {
        self.selectedOrder(data);
        window.setTimeout(function () {
            self.selectedService().discounter.load();
        }, 300);
        $('#delivery-services-modal').modal('show');
    }

    self.closeDeliveryOption = function () {
        self.reset();
        $('#delivery-services-modal').modal('hide');
    }

    self.saveDeliveryOptions = function (onComplete, basketSplitId) {

        self.validateNow(true);

        basketSplitId = typeof basketSplitId === 'undefined' ? null : basketSplitId;

        if (basketSplitId == null) {
            self.busy(true);
            self.busyMessage('Saving despatch options...');
        }

        var deliveryServices = [];

        // unfortunately we need a first-pass to ensure that all groups have the necessary validations going on...
        // they are instantiated with an empty array of validation. 
        // this function CAN be used to save an individual basketSplitId's deliveryService; so validation should
        // not fail the individual group if some other group happens to be in an erroneous state...

        var permitSave = true;

        // Totally bunk (relic?) - see service.CustomerRequestsFullDespatch beneath
        //if (basketSplitId == undefined) {
        //    $.ajax({
        //        url: '/api/componentapi/saveBasketDispatchHold',
        //        type: 'POST',
        //        dataType: 'json',
        //        data: {
        //            basketId: self.parent.basketId()
        //        }
        //    });
        //}

        if (self.deliveryGroups().length == 0) {
            permitSave = false;
            self.busy(false);
            return;
        }

        // if you've set both Transport and Duty/Taxes to be billable to a 3rd party account number,
        // but not provided either number,
        // then provide the Transport number, 
        // the auto-save functionality will force the save which will fail the validation because the Duty/Taxes 3rd party account number is missing.
        ko.utils.arrayForEach(self.deliveryGroups(), function (item) {
            if (item.deliveryService().haulier.dutyTaxesShipperButtons.observable() == 2 &&
                item.deliveryService().haulier.customersAccountNumberDutyTaxes.observable() == null) {
                item.deliveryService().haulier.dutyTaxesShipperButtons.observable(1);
            }
        });

        window.setTimeout(function () { // this because clicking Revert on Customer's Account Number for Transport / Taxes 
            // fires the save before updating the observable

            ko.utils.arrayForEach(self.deliveryGroups(), function (item) {
                if (item.deliveryService().errors().length) {
                    var haulier = Enumerable.From(item.hauliers).Where(function (x) {
                        return x.haulier.haulierCode == item.deliveryService().haulier.haulierCode
                    }).Single();

                    $('#delivery-services-modal').off('shown.bs.modal');
                    $('#delivery-services-modal').on('shown.bs.modal', function () {

                        haulier.validationGroup.showAllMessages(true);
                        haulier.validationGroup.filter(function (x) {
                            if (!x.isValid()) {
                                x.isValid.notifySubscribers(false);
                            }
                        });

                    });

                    item.isValid(false);
                    permitSave = false;
                }
            });

            if (basketSplitId != null)
                permitSave = true;

            // this is being a bit clever, ko.utils.arrayFirst will stop iterating when it hits its first return true statement. 
            // if we've not got a basketSplitId we're saving individually, the beneath will build all of the deliveryServices for save.
            //if we have a basketSplitId, it will validate the target deliveryGroup and return from the arrayFirst loop before touching any other deliveryGroups.
            ko.utils.arrayFirst(self.deliveryGroups(), function (item) {

                var service = $.extend({}, item.deliveryService());

                service.OperatorEnteredChargeEx = item.deliveryService().operatorEnteredCharge.observable();

                if (item.deliveryService().availableChargingLogics.observable.DOMElement)
                    service.OperatorEnteredChargingLogicID = item.deliveryService().availableChargingLogics.observable();

                service.DutyTaxBilledToName = item.deliveryService().haulier.customersAccountNumberDutyTaxes.observable() ? 'Customer' : 'Designers Guild';
                service.DutyTaxBilledToCode = item.deliveryService().haulier.customersAccountNumberDutyTaxes.observable();
                service.TransportBilledToName = item.deliveryService().haulier.customersAccountNumberTransport.observable() ? 'Customer' : 'Designers Guild';
                service.TransportBilledToCode = item.deliveryService().haulier.customersAccountNumberTransport.observable();
                service.CustomerRequestsFullDespatch = item.deliveryService().customerRequestsFullDespatch();
                service.DeliveryTerms = item.deliveryService().haulier.deliveryTerms();
                service.DeliveryType = item.deliveryService().haulier.deliveryType();
                service.DeliveryEstimateMin = null;
                service.CalculateDeliveryChargeAtDespatch = item.deliveryService().calculateDeliveryChargeAtDespatch();

                //service.OperatorDiscountPercentage = item.deliveryService().discretionaryDiscount.observable();
                //service.DiscountReasonID = item.deliveryService().discountReason.observable();
                //service.DiscountReasonComment = item.deliveryService().customDiscountReason.observable();
                //service.TradePromotionCodeID = null; // item.deliveryService().focPromoCode.observable();

                ko.utils.arrayForEach(Object.keys(service), function (property) {
                    if (((typeof service[property] === 'object') && (service[property] != null)) ||
                        (typeof service[property] === 'function'))
                        delete service[property];
                });

                //if (service.HaulierCode != "DD") // Direct Dispatch does not use Discounter 
                $.extend(service, item.deliveryService().discounter.toJS());

                if (basketSplitId) {
                    if (item.deliveryGroup.basketSplitId == basketSplitId) {
                        item.isValid(item.deliveryService().errors().length == 0);
                        if (!item.isValid()) {
                            permitSave = false;
                            return false;
                        }
                        deliveryServices.push(service);
                        return true;
                    }
                } else {
                    deliveryServices.push(service);
                    return false;
                }
            });

            if (permitSave) {

                var data = {
                    basketId: self.parent.basketId(),
                    basketSplitId: basketSplitId,
                    deliveryServices: deliveryServices
                }

                console.log('deliveryAddressFactory saveDeliveryOption calling with', data);

                $.ajax({
                    url: '/api/componentapi/SaveBasketSplitDeliveryOptions',
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    success: function (data) {
                        if (basketSplitId == null) {
                            //self.busy(false);
                            self.busyMessage(undefined);
                        }

                        self.parent.basketRequestsEORI(data.RequestEORI);
                        self.parent.basketRequiresEORI(data.RequireEORI);

                        if (typeof onComplete === 'function') {
                            onComplete();
                        }
                    },
                    errors: function (xhr, s, a) {
                        self.busy(false);
                        self.parent.busy(false);
                        self.busyMessage(undefined);
                        $.showError(xhr, s, a);
                    }
                });
            } else {
                console.log('deliveryAddressFactory saveDeliveryOption was REFUSED');
                $.info('Delivery Error', 'One or more of your Delivery Groups contains configuration errors. Please correct these to continue.');
                self.busy(false);
            }
        }, 0);
    }

    self.reset = function () {
        console.log('dispatchFactory reset called');
        ko.utils.arrayForEach(self.allSubscriptions, function (sub) {
            if (sub.hasOwnProperty('dispose'))
                if (typeof sub.dispose === 'function')
                    sub.dispose();
        });
        ko.utils.arrayForEach(self.deliveryTypeWarningSubscriptions, function (sub) {
            if (sub.hasOwnProperty('dispose'))
                if (typeof sub.dispose === 'function')
                    sub.dispose();
        });
        self.deliveryTerms([]);
        self.discountReasons([]);
        self.customerAccountNumbers([]);
        self.customerDeliveryDefaults([]);
        if (self.selectedOrder()) {
            ko.utils.arrayForEach(self.selectedOrder().hauliers, function (haulier) {
                haulier.validationGroup.isAnyMessageShown(false);
            })
        }
        self.validateNow(true);
        self.selectedOrder(undefined);
        self.basketDeliveryErrors([]);
        self.deliveryGroups([]);
        self.validateLastChanceNow(false);
        self.lastChancePhone.observable(undefined);
        self.lastChancePhone.countryObservable('gb');
        self.lastChanceMobilePhone.observable(undefined);
        self.lastChanceMobilePhone.countryObservable('gb');
        self.lastChanceDeliveryEmailParams.observable(undefined);

        self.lastChanceContactName.observable(undefined);

        self.customerRequests(undefined);
        self.despatchNotifications([]);
        self.busy(false);
    }

    self.storable = function () {
        var toStorage = [];

        ko.utils.arrayForEach(self.deliveryGroups(), function (item) {
            toStorage.push({
                deliveryGroupId: item.deliveryGroup.deliveryGroupId,
                deliveryServiceId: item.deliveryService().DeliveryServiceID
            });
        });

        return toStorage;
    }
}

var deliveryAddressFactory = function (parent) {
    var self = this;

    self.parent = parent;

    self.busyMessage = parent.busyMessage;

    self.busy = parent.busy;

    self.isParentAccount = ko.observable(false);

    self.loadedAddresses = ko.observable(false);

    self.shippingCheckBusy = ko.observable(false);

    self.deliveryAddressConfirmed = ko.observable(false);

    self.miscInvoiceAddressConfirmed = ko.observable(false);

    self.deliverToEndCustomer = ko.observable(undefined);

    self.displayDefaultDeliveryAddress = ko.observable(false);

    self.forbiddenDestinationCountries = ko.observableArray([]);

    self.defaultDeliveryAddress = new addressViewModel({
        labelClass: 'delivery-address-label',
        controlClass: 'form-control mdc-text-field__input',
        phoneIntlMobile: true,
        email: true,
        forbiddenDestinationCountries: self.forbiddenDestinationCountries
    });

    self.invoiceAddress = new addressViewModel({
        labelClass: 'delivery-address-label',
        controlClass: 'form-control mdc-text-field__input',
        phoneIntlMobile: false,
        email: true,
        forbiddenDestinationCountries: self.forbiddenDestinationCountries
    });

    self.validateCustomNow = ko.observable(false);

    self.offensiveShipping = ko.observableArray([]);

    self.selectDefaultDeliveryAddressForDelivery = function () {

        var forbid = Enumerable.From(self.forbiddenDestinationCountries()).Where(function (x) {
            return x.CountryID == self.defaultDeliveryAddress.countryId()
        }).FirstOrDefault();

        if (forbid != null) {
            $.error('Destination Country Not Permitted', forbid.Reason);
            return;
        }

        // if the default delivery address is valid, great, select it. if not, populate the deliverySearcer's address edit modal thing and show it.
        self.defaultDeliveryAddress.validateNow(true);
        window.setTimeout(function () {
            if (self.defaultDeliveryAddress.isValid()) {
                //self.busy(true);

                console.log('default delivery address was found to be valid');

                self.deliveryAddress.loadFromOtherAddressObject(self.defaultDeliveryAddress);
                self.deliveryAddressSearch.showEditModal();

                //window.setTimeout(function () {
                //    self.confirmDelivery();
                //}, 500);
            } else {
                console.log('default delivery address was NOT valid');

                self.deliveryAddress.loadFromOtherAddressObject(self.defaultDeliveryAddress);
                self.deliveryAddressSearch.showEditModal();
            }
        }, 0);
    }

    // 15/05/2023 - Defunct?
    //self.refreshInvoiceAddress = function () {
    //    self.busy(true);
    //    var data = {
    //        accountNumber: self.parent.tradeAccount().Code
    //    };
    //    console.log('refresh invoice address calling with', data);
    //    $.ajax({
    //        url: '/api/componentApi/RefreshTradeAccountInvoiceAddress',
    //        type: 'POST',
    //        dataType: 'json',
    //        data: data,
    //        success: function (data) {
    //            self.busy(false);
    //            console.log('refresh invoice address returned', data);
    //            self.invoiceAddress.loadInvoiceAddress(data);
    //        },
    //        error: function (xhr, s, a) {
    //            self.busy(false);
    //            $.ajaxSettings.error(xhr, s, a);
    //        }
    //    });
    //}

    self.selectInvoiceAddressForDelivery = function () {


        var forbid = Enumerable.From(self.forbiddenDestinationCountries()).Where(function (x) {
            return x.CountryID == self.invoiceAddress.countryId()
        }).FirstOrDefault();

        if (forbid != null) {
            $.error('Destination Country Not Permitted', forbid.Reason);
            return;
        }


        self.invoiceAddress.validateNow(true);
        window.setTimeout(function () {
            if (self.invoiceAddress.isValid()) {
                console.log('invoice address was found to be valid');

                self.deliveryAddress.loadFromOtherAddressObject(self.invoiceAddress);
                self.deliveryAddressSearch.showEditModal();
            } else {
                console.log('invoice address was NOT valid');
                self.deliveryAddress.loadFromOtherAddressObject(self.invoiceAddress);
                self.deliveryAddressSearch.showEditModal();

                self.deliveryAddress.validateNow(true);
                self.deliveryAddress.errors.filter(function (e) {
                    e.notifySubscribers(e.isValid());
                });
            }
        }, 0);
    }

    self.endCustomers = ko.observableArray([]);

    self.endCustomer = ko.observable();

    self.selectedEndCustomerAddress = ko.observable();

    self.endCustomerHasFocus = ko.observable(false);

    self.endCustomerHasFocus.subscribe(function (newValue) {
        if (newValue) {
            if ($(self.endCustomerAutocomplete.observable.DOMElement).hasClass('ui-autocomplete-input')) {
                $(self.endCustomerAutocomplete.observable.DOMElement).autocomplete('search', '');
            }
        }
    });

    //self.endCustomer.subscribe(function (newValue) {
    //    console.log('endCustomer subscribe hit', newValue);
    //    if (newValue) {
    //        self.deliveryAddressSearch.reset();
    //        self.deliveryAddressSearch.tradeAccount(self.endCustomer());
    //    }
    //});

    self.endCustomerBusy = ko.observable(false);

    self.endCustomer.subscribe(function (newValue) {
        if (newValue) {
            //self.deliveryAddressSearch.tradeAccount(newValue);
            if (!self.deliveryAddressConfirmed())
                self.loadAddresses(null, true);
        } else {
            if (self.parent.tradeAccount()) {
                //self.deliveryAddressSearch.tradeAccount(self.parent.tradeAccount());
                self.loadAddresses(null, true);
            }
        }
    });

    self.refreshAddresses = function () {
        $(self.deliveryAddressSearch.editModal.DOMElement).modal('hide');
        self.loadAddresses(null, true, true);
    }

    //self.endCustomer.subscribe(function(newValue) {
    //    self.endCustomerBusy(true);
    //    var data = {
    //        tradeAccountCode: newValue.code
    //    }
    //    console.log('deliveryAddressFactory calling fetchEndCustomerAddressBook with', data);
    //    $.ajax({
    //        url: '/api/componentapi/FetchTradeAccountAddressBook',
    //        type: 'POST',
    //        dataType: 'json',
    //        data: data,
    //        success: function (data) {

    //            var addressObjects = [];

    //            ko.utils.arrayForEach(data, function (item) {
    //                try {
    //                    var endCustAddr = new addressViewModel();
    //                    endCustAddr.loadTradeAccountAddressForDelivery(item);
    //                    endCustAddr.tradeAccountId = item.TradeAccountID;
    //                    endCustAddr.tradeAccountCode = item.TradeAccountCode;
    //                    addressObjects.push(endCustAddr);
    //                }
    //                catch {
    //                    // discard item; unusable address.
    //                }
    //            });

    //            self.endCustomerAddress(addressObjects);

    //            console.log('deliveryAddressFactory fetchEndCustomerAddressBook returned', data);
    //        }, 
    //        error: function (xhr, s, a) {
    //            self.endCustomerBusy(false);
    //              $.ajaxSettings.error(xhr, s, a);
    //        }
    //    });
    //});

    // we need... to know if we need to present an End Customer selector.
    self.endCustomerAutocomplete = {
        label: 'Select End Customer',
        observable: ko.observable(),
        focusObservable: self.endCustomerHasFocus,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        enterKeyFunction: function () {
            $(self.endCustomerAutocomplete.observable.DOMElement).autocomplete('search');
        },
        clearFunction: function () {
            self.endCustomer(undefined);
            self.endCustomerAutocomplete.observable(undefined);
            $(self.endCustomerAutocomplete.observable.DOMElement).focus();
        },
        readOnly: false,
        autocompleteSettings: {
            value: self.endCustomer,
            //localData: self.endCustomers,
            source: function (request, response) {
                var data = {
                    term: request.term,
                    tradeAccountCode: self.parent.tradeAccount().Code
                };
                console.log('deliveryAddressFactory endCustomerAutocomplete calling with', data);
                $.ajax({
                    url: '/api/ComponentAPI/EndCustomerAutocomplete',
                    type: "POST",
                    dataType: "json",
                    data: data,
                    success: function (data) {
                        console.log('deliveryAddressFactory endCustomerAutocomplete returned', data);
                        self.endCustomers(data);
                        response(data);
                    }
                });
            },
            minLength: 0,
            focus: function (ev, ui) {
                ev.preventDefault();
            },
            select: function (ev, ui) {
                ev.preventDefault();
                self.endCustomerAutocomplete.observable(`${ui.item.Code} - ${ui.item.Name}`);
                self.endCustomer(ui.item);
            },
            create: function () {
                $(self.endCustomerAutocomplete.observable.DOMElement).data("ui-autocomplete")._renderItem = function (ul, item) {

                    var li = $("<li>"),
                        div = null,
                        img = null;

                    div = li.append(`<div class='ui-menu-item-wrapper'>${item.Code} - ${item.Name}</div>`);

                    return li.appendTo(ul);
                };
            }
        }
    };

    self.loadAddresses = function (onComplete, force, clearBusy) {

        force = typeof force === 'undefined' ? false : force;

        clearBusy = typeof clearBusy === 'undefined' ? true : clearBusy;

        if (!force) {
            if (self.loadedAddresses() == true) {

                if (typeof onComplete === 'function')
                    onComplete();

                console.log('deliveryAddressFactory loadAddresses was SKIPPED: loadedAddresses() was true');
                return;
            }
        }

        self.busy(true);

        self.busyMessage('Loading Addresses...');

        var data = {
            basketId: self.parent.basketId(),
            tradeAccountId: self.endCustomer() ? self.endCustomer().TradeAccountID : self.parent.tradeAccount().TradeAccountID,
            tradeAccountNumber: self.endCustomer() ? self.endCustomer().Code : self.parent.tradeAccount().Code,
            endCustomer: self.deliverToEndCustomer() == true
        }

        console.log('deliveryAddressFactory fetchBasketDeliveryAddress calling with', data);

        $.ajax({
            url: '/api/componentapi/FetchBasketDeliveryAddresses',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {

                console.log('deliveryAddressFactory fetchBasketDeliveryAddress returned', data);

                self.forbiddenDestinationCountries(data.ForbiddenDestinationCountries);

                if (data.basketAddress != null) {

                    self.deliveryAddress.loadBasketAddress(data.basketAddress).then(function () {
                        self.deliveryAddressConfirmed(true);
                        if (!data.basketAddress.CleansePerformed && data.basketAddress.DeliveryReference != 'C') {
                            window.setTimeout(function () {
                                self.editSelectedDeliveryAddress();
                            }, 0);
                        }
                    });

                    self.parent.deliveryAddress.loadBasketAddress(data.basketAddress);

                    if (data.endCustomer) {
                        self.deliverToEndCustomer(true);
                        self.endCustomer(data.endCustomer);
                        self.endCustomerAutocomplete.observable(`${data.endCustomer.Code} - ${data.endCustomer.Name}`);
                    }
                }

                if (data.DefaultDeliveryAddress != null) {
                    self.displayDefaultDeliveryAddress(true);
                    self.defaultDeliveryAddress.loadTradeAccountAddressForDelivery(data.DefaultDeliveryAddress);
                } else {
                    self.displayDefaultDeliveryAddress(false);
                }

                if (data.InvoiceAddress != null) {
                    self.invoiceAddress.loadInvoiceAddress(data.InvoiceAddress);
                }

                if (data.miscInvoiceAddress != null) {

                    self.miscInvoiceAddress.loadBasketMiscAddress(data.miscInvoiceAddress).then(function () {
                        self.miscInvoiceAddressConfirmed(true);
                    });
                    self.parent.miscInvoiceAddress.loadBasketMiscAddress(data.miscInvoiceAddress);
                }

                self.isParentAccount(data.IsParentAccount);

                if (self.isParentAccount()) {
                    if (self.deliverToEndCustomer() == undefined) {
                        clearBusy = false;
                        $('#end-customer-or-parent-modal').modal('show');
                    }
                }

                self.loadedAddresses(true);

                if (clearBusy) {
                    window.setTimeout(function () { // give a chance for the addresses to render before seeming 'unbusy'
                        self.busy(false);
                        self.busyMessage(undefined);
                    }, 100);
                }

                if (typeof onComplete == 'function') {
                    onComplete();
                }
            }
        });
    }

    self.confirmDelivery = function (onComplete, skipDeliveryRestrictions) {

        skipDeliveryRestrictions = skipDeliveryRestrictions || false;

        // right... confirmDelivery is hit when someone clicks Deliver to this Address.
        // if we've picked up a deliveryReference of 'C', this is NEVER TO BE AMENDED.
        // this is an instruction to refer back to the customer's invoice address.
        // so.
        // if we HAVE a delivery reference at all...
        if (self.deliveryAddress.deliveryReference()) {
            // check if the user has changed something about the address
            if (self.deliveryAddress.promptForOverwrite()) {
                // if we have changed something
                if (self.deliveryAddress.deliveryReference() == 'C') {
                    // but we're looking at a 'C' reference
                    self.deliveryAddress.deliveryReference(undefined);
                    // clear the reference and save the address as a new address.
                    self.saveDelivery(onComplete, false, skipDeliveryRestrictions);
                } else {
                    // if we're not looking at a 'C' reference, we need to prompt for overwrite or create new
                    self.saveCompleteFn = onComplete;
                    $('#address-overwrite').modal('show');
                }
            } else {
                // if the user hasn't changed the address we don't need to prompt
                self.saveDelivery(onComplete, false, skipDeliveryRestrictions);
            }
        } else {
            // and if we don't have a delivery reference we don't need to prompt.
            self.saveDelivery(onComplete, false, skipDeliveryRestrictions);
        }
    }

    self.overwriteMertexDeliveryAddress = function () {
        self.saveDelivery(function () {
            self.parent.phase(ORDERFACTORY_PHASE_PREAMBLE);
            if (typeof self.saveCompleteFn === 'function')
                self.saveCompleteFn();
        });
    }

    self.createNewMertexDeliveryAddress = function () {
        self.deliveryAddress.deliveryReference(undefined);
        self.saveDelivery(function (onComplete) {
            self.parent.phase(ORDERFACTORY_PHASE_PREAMBLE);
            if (typeof self.saveCompleteFn === 'function')
                self.saveCompleteFn();
        });
    }

    self.saveDelivery = function (onComplete, skipDedupe, skipDeliveryRestrictions) {

        skipDedupe = skipDedupe || false;

        skipDeliveryRestrictions = skipDeliveryRestrictions || false;

        self.busy(true);

        self.busyMessage('Saving Delivery Address...');

        var data = {
            skipDeliveryRestrictions: skipDeliveryRestrictions,
            skipDedupe: skipDedupe,
            basketId: self.parent.basketId(),
            tradeAccountCode: self.parent.tradeAccount().Code,
            tradeAccountId: self.parent.tradeAccount().TradeAccountID,
            endCustomerCode: self.endCustomer() ? self.endCustomer().Code : null,
            endCustomerName: self.endCustomer() ? self.endCustomer().Name : null
        };

        $.extend(data, self.deliveryAddress.toBasketAddressJS());

        if (self.deliveryAddress.havePerformedLoqateSearch()) {
            data.loqateLookupPerformed = true;
            data.status = self.deliveryAddress.cleansedAddress() ? 'Accepted' : 'Declined';
        }

        if (self.deliveryAddress.manual()) {
            data.loqateLookupPerformed = false;
            data.status = null;
        }

        if (self.invoiceAddress.country()) {
            data.invoiceAddressCountryCode = self.invoiceAddress.country().Code;
            data.invoiceAddressPostcode = self.invoiceAddress.postcode.observable();
        }

        console.log('deliveryAddressFactory confirmDelivery calling with', data);

        $(self.deliveryAddressSearch.editModal.DOMElement).modal('hide');

        $.ajax({
            url: '/api/componentapi/SaveBasketDeliveryAddress',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {

                if (data.hasOwnProperty('forbid')) {
                    self.deliveryAddressConfirmed(false);
                    self.parent.busy(false);
                    $.error('Destination Country Not Permitted', data.forbid.Reason);
                    return;
                }

                if (self.deliveryAddress.havePerformedLoqateSearch() &&
                    self.deliveryAddress.cleansedAddress()) {
                    self.deliveryAddress.cleanseResultAccepted(true);
                } else {
                    self.deliveryAddress.cleanseResultAccepted(false);
                }

                self.deliveryAddress.recordInitialState();

                console.log('deliveryAddressFactory confirmDelivery returned', data);

                self.deliveryAddress.deliveryReference(data.deliveryReference);

                //var cdata = $.extend(data, self.deliveryAddress.toBasketAddressJS());

                //cdata.basketId = self.parent.basketId();

                //if (self.deliveryAddress.loqateAddress())
                //    cdata.status = self.deliveryAddressSearch.cleanseResultAccepted() ? 'Accepted' : 'Declined';

                //if (self.deliveryAddress.manual())
                //    cdata.status = null;

                //cdata.deliveryReference = data.deliveryReference;

                //console.log('deliveryAddressFactory calling recordUserInteractionAddressCleanseResult with', cdata);

                //$.ajax({
                //    url: '/api/componentapi/RecordUserInteractionAddressCleanseResult',
                //    type: 'POST',
                //    dataType: 'json',
                //    data: cdata,
                //    success: function (cresult) {
                //        console.log('deliveryAddressFactory recordUserInteractionAddressCleanseResult return', cresult);
                //    }
                //});

                self.deliveryAddress.promptForOverwrite(false);

                self.parent.deliveryAddress.loadFromOtherAddressObject(self.deliveryAddress);

                self.deliveryAddressConfirmed(true);

                self.busy(false);

                if (typeof onComplete === 'function')
                    onComplete();

            },
            error: function (xhr, s, a) {
                self.busy(false);
                $(self.deliveryAddressSearch.editModal.DOMElement).modal('show');
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    }

    self.confirmMisc = function (onComplete) {

        self.busy(true);

        self.busyMessage('Saving');

        var data = {
            basketId: self.parent.basketId()
        };

        $.extend(data, self.miscInvoiceAddress.toBasketAddressJS())

        console.log('deliveryAddressFactory saveBasketMiscInvoiceAddress calling with', data);

        $.ajax({
            url: '/api/componentapi/SaveBasketMiscInvoiceAddress',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {

                self.miscInvoiceAddressConfirmed(true);

                self.invoiceAddress.loadFromOtherAddressObject(self.miscInvoiceAddress);

                self.parent.miscInvoiceAddress.loadFromOtherAddressObject(self.miscInvoiceAddress);

                self.busy(false);

                if (typeof onComplete === 'function')
                    onComplete();
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    }

    self.validateMiscNow = ko.observable(false);

    self.miscInvoiceAddress = new addressViewModel({
        labelClass: 'delivery-address-label',
        controlClass: 'form-control mdc-text-field__input',
        phoneIntlMobile: true,
        email: true,
        forbiddenDestinationCountries: self.forbiddenDestinationCountries,
        validateNow: self.validateMiscNow,
        emailValidation: {
            emailList: {
                params: true,
                message: 'Invalid Email(s)'
            },
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateMiscNow();
                },
                message: 'Email required'
            }
        },
        phoneValidation: {
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateMiscNow();
                },
                message: 'Phone Required'
            }
        }
    });

    self.miscInvoiceAddressSearch = new addressSearchFactory(
        self.parent.tradeAccount,
        self.endCustomer,
        'Invoice',
        'Invoice',
        self.miscInvoiceAddress,
        null, // needs its own busy observable
        null, // message probably not required
        self.confirmMisc,
        self.parent.miscTradeAccount,
        self.parent.basketId,
        self.forbiddenDestinationCountries,
        self);

    self.clearMiscInvoiceAddress = function () {
        self.miscInvoiceAddress.reset(true);
        self.miscInvoiceAddressConfirmed(false);
        self.parent.miscInvoiceAddress.reset();
        self.parent.miscInvoiceAddress.validateNow(true);
    }

    self.editMiscInvoiceAddress = function () {
        self.miscInvoiceAddressSearch.showEditModal();
    }

    self.editSelectedDeliveryAddress = function () {
        self.deliveryAddressSearch.showEditModal();
        //if (self.deliveryAddress.havePerformedLoqateSearch() == false)
        //    self.deliveryAddressSearch.attemptAddressCleanse(true);
    }

    self.clearSelectedDeliveryAddress = function () {
        self.deliveryAddress.reset(true);
        self.deliveryAddressConfirmed(false);
        self.deliveryAddressSearch.pcaLookup.clearFunction();
        self.parent.deliveryAddress.reset();
        self.parent.deliveryAddress.validateNow(true);
    }

    self.deliveryToParent = function () {
        $('#end-customer-or-parent-modal').modal('hide');
        //why on earth were we doing this...?
        self.busy(false);
        self.endCustomer(undefined);
        self.deliverToEndCustomer(false);
        self.deliveryAddressSearch.reset();
        self.refreshAddresses();
    }

    self.deliveryToEndCustomer = function () {
        $('#end-customer-or-parent-modal').modal('hide');
        self.busy(false);
        self.deliverToEndCustomer(true);
    }

    self.deliveryAddress = new addressViewModel({
        labelClass: 'delivery-address-label',
        controlClass: 'form-control mdc-text-field__input',
        phoneIntlMobile: true,
        email: true,
        forbiddenDestinationCountries: self.forbiddenDestinationCountries
    });

    self.deliveryAddressSearch = new addressSearchFactory(
        self.parent.tradeAccount,
        self.endCustomer,
        'Delivery',
        'Deliver to',
        self.deliveryAddress,
        null, // needs its own busy observable
        null, // message probably not required
        function (onComplete) { // complete function
            self.confirmDelivery(function () {
                $('#address-overwrite').modal('hide');
                self.parent.phase(ORDERFACTORY_PHASE_PREAMBLE);
                if (typeof onComplete === 'function')
                    onComplete();
            })
        },
        self.parent.miscTradeAccount,
        self.parent.basketId,
        self.forbiddenDestinationCountries,
        self
    );

    //self.parent.tradeAccount.subscribe(function (newValue) {
    //    if (newValue) {
    //        self.miscInvoiceAddressSearch.tradeAccount(newValue);
    //        self.deliveryAddressSearch.tradeAccount(newValue);
    //    }
    //});

    if (!self.parent.miscTradeAccount())
        self.deliveryAddressSearch.pcaLookup.searchEndpoint(self.deliveryAddressSearch.mertexEndpoint);

    self.confirmEndCustomer = function (address) {
        self.busyMessage('Saving');
        self.busy(true);
        var data = {
            basketId: self.parent.basketId(),
            tradeAccountId: address.tradeAccountId
        };
        $.extend(data, address.toBasketAddressJS())
        console.log('deliveryAddressFactory saveBasketDeliveryAddress calling with', data);
        $.ajax({
            url: '/api/componentapi/SaveBasketDeliveryAddressEndCustomer',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {

                // if data.noYouCantExpletiveDeleted 
                // then
                //   undo all of the happy "successful" delivery states
                //   and warn the user about pipe bombs

                self.parent.deliveryAddress.loadFromOtherAddressObject(address);
                self.busy(false);
                if (self.parent.miscTradeAccount()) {
                    self.parent.phase(ORDERFACTORY_PHASE_MISC);
                } else {
                    self.parent.phase(ORDERFACTORY_PHASE_PREAMBLE);
                }
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    }

    self.performShippingCheck = function () {

        var data = {
            basketId: self.parent.basketId()
        }

        self.shippingCheckBusy(true);

        $.ajax({
            url: '/api/componentapi/basketShippingRestrictionCheck',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('basketShippingRestrictionCheck returned', data);
                if (data.length == 0) {
                    window.setTimeout(function () {
                        self.shippingCheckBusy(false);
                        self.parent.phase(ORDERFACTORY_PHASE_DISPATCH);
                    }, 1500);
                } else {
                    window.setTimeout(function () {
                        self.shippingCheckBusy(false);
                        self.offensiveShipping(data);
                    }, 1500);
                }
                // right, data is an array of offending rowNumbers.
                // we must display to the user a warning... indicating that they
                // may either remove the offending basketProducts or alter 
                // their destination country.
            }
        });
    }

    self.reset = function () {
        console.log('deliveryAddressFactory reset called');
        self.busy(false);
        self.deliverToEndCustomer(undefined);
        self.busyMessage(undefined);
        self.loadedAddresses(false);
        self.isParentAccount(false);
        self.endCustomerHasFocus(false);
        self.endCustomer(undefined);
        self.endCustomerAutocomplete.observable(undefined);
        self.selectedEndCustomerAddress(undefined);
        self.endCustomers([]);
        self.shippingCheckBusy(false);
        self.offensiveShipping([]);
        self.defaultDeliveryAddress.reset();
        self.displayDefaultDeliveryAddress(false);
        self.invoiceAddress.reset();
        self.miscInvoiceAddress.reset();
        self.deliveryAddressSearch.reset();
        //self.deliveryAddressSearch.tradeAccount(self.parent.tradeAccount);
        self.miscInvoiceAddressSearch.reset();
        self.deliveryAddressConfirmed(false);
        self.miscInvoiceAddressConfirmed(false);
        self.forbiddenDestinationCountries([]);
    }
}

var basicFactory = function (parent) {
    var self = this;

    //#region Properties

    self.parent = parent;

    //#endregion

    //#region Computeds


    //#endregion

    //#region Components


    //#endregion

    //#region Subscriptions


    //#endregion

    //#region Validation Groups

    self.errors = ko.validation.group([

    ]);

    //#endregion

    //#region Functions

    self.reset = function () {
        console.log('basicFactory reset called', self);
        self.errors.showAllMessages(false);
    }

    //#endregion

    //#region Events

    //#endregion

}

/*
 *{
    currentDiscountPercentage = null,
    discountReasonId = null,
    discountReasonComment = null,
    tradePromotionCodeId = null,
    currency = {
        Symbol: '£',
        FormattingCulture: 'en-GB',
        ISO_4217: 'GBP'
    },
    originalPriceEx = 1, // to avoid divide by zero error if undefined
    discountReasons = ko.observableArray([]),
    budgetManagers = ko.observableArray([]),
    tradePromoCodeIdRequired = true,
    permitPercentage = true,
    permitMonetary = true,
    debug = false
} = {}
 * */

var discounterFactory = function (args) {

    if (typeof args.currentDiscountMonetary == 'undefined')
        args.currentDiscountMonetary = null;

    if (typeof args.currentDiscountPercentage == 'undefined')
        args.currentDiscountPercentage = null;

    if (typeof args.discountReasonId === 'undefined')
        args.discountReasonId = null;

    if (typeof args.discountReasonComment === 'undefined')
        args.discountReasonComment = null;

    if (typeof args.tradePromotionCodeId === 'undefined')
        args.tradePromotionCodeId = null;

    if (typeof args.currency === 'undefined')
        args.currency = {
            Symbol: '£',
            FormattingCulture: 'en-GB',
            ISO_4217: 'GBP'
        };

    if (typeof args.appendTo === 'undefined') {
        console.error('discounterFactory demands appendTo "#some-element"');
        return;
    }

    if (typeof args.originalPriceEx === 'undefined')
        args.originalPriceEx = null; // to avoid divide by zero error if undefined

    if (typeof args.discountReasons === 'undefined')
        args.discountReasons = ko.observableArray([]);

    if (typeof args.focPromoCodes === 'undefined')
        args.focPromoCodes = ko.observableArray([]);

    if (typeof args.budgetManagers === 'undefined')
        args.budgetManagers = ko.observableArray([]);

    if (typeof args.tradePromoCodeIdRequired === 'undefined')
        args.tradePromoCodeIdRequired = true;

    if (typeof args.permitPercentage === 'undefined')
        args.permitPercentage = true;

    if (typeof args.permitMonetary === 'undefined')
        args.permitMonetary = true;

    if (typeof args.debug === 'undefined')
        args.debug = false;

    if (typeof args.delivery === 'undefined')
        args.delivery = false;

    if (typeof args.discountEntryVisible === 'undefined')
        args.discountEntryVisible = true;

    var self = this;

    self.bypassValidation = ko.observable(false);

    $.extend(self, {
        delivery: args.delivery, // this almost got retired, but the delivery flag is still necessary
        // the delivery discounter needs to set DeliveryChargingLogicID on the resultant object
        afterLoad: args.afterLoad,
        debug: args.debug,
        currentDiscountMonetary: args.currentDiscountMonetary,
        currentDiscountPercentage: args.currentDiscountPercentage,
        discountReasonId: args.discountReasonId,
        discountReasonComment: args.discountReasonComment,
        tradePromotionCodeId: args.tradePromotionCodeId,
        originalPriceEx: +ko.unwrap(args.originalPriceEx),
        tradePromotionCodeIdRequired: args.tradePromoCodeIdRequired,
        permitPercentage: args.permitPercentage,
        permitMonetary: args.permitMonetary,
        //permitMoneyToChangePercentage: false,
        //permitPercentageToChangeMoney: true,
        currency: args.currency,
        discountEntryVisible: ko.observable(args.discountEntryVisible),
        selector: {
            observable: ko.observable(DISCOUNT_STATE_PERCENTAGE),
            options: [{
                symbol: args.currency.Symbol,
                discountState: DISCOUNT_STATE_MONETARY
            }, {
                symbol: '%',
                discountState: DISCOUNT_STATE_PERCENTAGE
            }],
            optionsText: 'symbol',
            optionsValue: 'discountState',
            optionsCaption: undefined,
            useNativeValidation: false,
            insertValidationMessages: false,
            decorateInputElement: false
        },
        percentage: {
            name: 'Percentage',
            label: 'Discount %',
            observable: ko.observable().extend({
                numberFormatted: {
                    digits: 1,
                    currency: {
                        FormattingCulture: 'en-GB'
                    },
                    minValue: 0,
                    maxValue: 100
                }
            }),
            focusObservable: ko.observable(false),
            useNativeValidation: false,
            decorateInputElement: true,
            insertValidationMessages: false,
            showClear: false,
            readOnly: ko.observable(false)
        },
        monetary: {
            name: 'Monetary',
            label: `Final Price ${args.currency.Symbol}`,
            observable: ko.observable().extend({
                numberFormatted: {
                    digits: 2,
                    currency: {
                        FormattingCulture: args.currency.FormattingCulture
                    },
                    minValue: 0,
                    maxValue: +ko.unwrap((args.originalPriceEx == null || args.originalPriceEx  == 0) ? (Number.MAX_VALUE * 0.01) : args.originalPriceEx) * 100
                },
                required: {
                    params: true,
                    onlyIf: function () {
                        if (self.bypassValidation())
                            return false;
                        else
                            return args.originalPriceEx == null && args.fulfilmentTypeId != 5 // not applicable to Direct Despatch
                    },
                    message: 'You must provide a Final Price'
                },
                // no longer valid to refuse Monetary == 0; there are instances where 
                //notEqual: {
                //    params: 0,
                //    onlyIf: function () {
                //        if (self.bypassValidation())
                //            return false;
                //        else
                //            return args.originalPriceEx == null && args.fulfilmentTypeId != 5 // not applicable to Direct Despatch
                //    },
                //    message: 'Final Price cannot be 0'
                //}
            }),
            focusObservable: ko.observable(false),
            useNativeValidation: false,
            decorateInputElement: true,
            insertValidationMessages: false,
            showClear: false,
            readOnly: ko.observable(false)
        },
        discountReasons: args.discountReasons,
        budgetManagers: args.budgetManagers,
        subscriptions: [],
        haulierCode: args.haulierCode
    });

    self.discounterBeginsHidden = ko.observable(args.originalPriceEx == null || args.originalPriceEx == 0 ? false : true);

    if (args.calculateDeliveryChargeAtDespatch)
        self.discounterBeginsHidden(true);

    self.discounterTitle = ko.computed(function () {
        if (args.originalPriceEx == null || args.originalPriceEx == 0) {
            return '<span class="faux-label">Please enter a Price</span>';
        }

        switch (self.selector.observable()) {
            case 0:
                return 'Request Price Override'
                break;
            case 1:
                return 'Request Discount';
                break;
            default:
                break;
        }
    }, self);

    // the button might not want to be visible: in some instances, we are not using this as a discounter
    // instead we're using it as a price input facility
    self.discounterButtonVisible = ko.observable(args.originalPriceEx == null || args.originalPriceEx == 0 ? false : true);

    self.selector.disabled = ko.pureComputed(function () {
        return (self.monetary.readOnly() || self.percentage.readOnly()) || (args.hasOwnProperty('UnitDeliveryChargeEx') && args.UnitDeliveryChargeEx == null);
    }, self);

    self.subscriptions.push(self.selector.observable.subscribe(function (newValue) {
        //console.log('selector observable subscribe hit', newValue);
        // do I need to clean and rebind at this point...?
        switch (newValue) {
            case DISCOUNT_STATE_MONETARY:
                self.currentState(self.monetary);
                //self.permitMoneyToChangePercentage = true;
                //self.permitPercentageToChangeMoney = false;
                //if (self.delivery)
                self.monetary.observable(undefined);
                break;
            case DISCOUNT_STATE_PERCENTAGE:
                self.currentState(self.percentage);
                //self.permitMoneyToChangePercentage = false;
                //self.permitPercentageToChangeMoney = true;
                //if (self.delivery)
                self.percentage.observable(undefined);
                break;
        }
    }));

    self.discountReasonRequired = ko.pureComputed(function () {

        if ((self.originalPriceEx == null || self.originalPriceEx == 0) && +self.monetary.observable() > 0) {
            return false;
        }

        return (self.percentage.observable() != null) || (self.monetary.observable() != null)
    }, self);

    self.discountReasonsAvailable = ko.pureComputed(function () {
        console.log('discountReasonsAvailable computed hit');
        if (self.percentage.observable() > 0) {
            return Enumerable.From(self.discountReasons()).Where(function (x) {
                return x.PriceIncrease == 0
            }).OrderBy(function (x) {
                return x.DiscountReasonID;
            }).ToArray();
        } else {
            if (self.monetary.observable() > self.originalPriceEx) {
                return Enumerable.From(self.discountReasons()).Where(function (x) {
                    return x.PriceIncrease == 1
                }).OrderBy(function (x) {
                    return x.DiscountReasonID;
                }).ToArray();
            } else if ((+self.monetary.observable() == 0 && self.originalPriceEx == 0) ||
                (self.monetary.observable() < self.originalPriceEx)) {
                return Enumerable.From(self.discountReasons()).Where(function (x) {
                    return x.PriceIncrease == 0
                }).OrderBy(function (x) {
                    return x.DiscountReasonID;
                }).ToArray();
            }
        }
    });

    self.discountReason = {
        observable: ko.observable(args.discountReasonId).extend({
            required: {
                params: true,
                onlyIf: function () {
                    if (self.percentage.observable()) {
                        if (self.percentage.observable() != 100)
                            return true;
                        else {
                            if (self.tradePromotionCodeIdRequired) {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    } else {
                        if ((self.originalPriceEx == null || self.originalPriceEx == 0) && +self.monetary.observable() === 0) {
                            return true;
                        } else if ((self.originalPriceEx == null || self.originalPriceEx == 0) && +self.monetary.observable() > 0) {
                            return false;
                        }

                        if (self.monetary.observable() && self.discountEntryVisible()) {
                            // This "self.discountEntryVisible()" is an awful hack, made to facilitate Direct Despatch
                            // changing monetary values without seeming to be providing a discount...
                            // If you're reading this, good luck to you. Whrargdflgllkmlktrlkm.
                            if (self.monetary.observable() != self.originalPriceEx) {
                                return true;
                            }
                        } else {
                            return false;
                        }
                    }
                },
                message: 'You must provide a reason for this discount'
            },
            notify: 'always'
        }),
        label: 'Please select a reason',
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        options: self.discountReasonsAvailable,
        optionsText: 'Name',
        optionsValue: 'DiscountReasonID',
        optionsCaption: ' ',
        width: 'auto'
    };

    self.discountReason.observable.subscribe(function (newValue) {
        console.log('discountReason observable subscribe hit', newValue);
    });



    self.discountReasonText = ko.pureComputed(function () {
        if (self.discountReason.observable() && self.discountReasons().length) {
            return Enumerable.From(self.discountReasons()).Where(function (x) {
                return x.DiscountReasonID == self.discountReason.observable()
            }).Select(function (x) {
                return x.Name
            }).Single();
        }
    }, self);

    self.discountReasonText.subscribe(function (newValue) {
        console.log('discountReasonText computed subscribe hit', newValue);
    });

    //self.discountReason.observable.subscribe(function (newValue) {
    //    console.log('discountReason observable hit', newValue);
    //});

    self.customDiscountReasonRequired = ko.pureComputed({
        read: function () {
            //if (self.percentage.observable() != null) {
            //    if (self.percentage.observable() != 100) {
            if (self.discountReason.observable()) {
                return Enumerable.From(self.discountReasons()).Where(function (x) {
                    return x.DiscountReasonID == self.discountReason.observable();
                }).Select(function (x) {
                    return x.CommentRequired
                }).SingleOrDefault();
            } else {
                return false;
            }
            //    } else {
            //        if (self.tradePromotionCodeIdRequired) {
            //            return false;
            //        } else {
            //            return Enumerable.From(self.discountReasons()).Where(function (x) {
            //                return x.DiscountReasonID == self.discountReason.observable();
            //            }).Select(function (x) {
            //                return x.CommentRequired
            //            }).SingleOrDefault();
            //        }
            //    }
            //} else {
            //    if (self.monetary.observable() != null) {
            //        if ((self.monetary.observable() > self.originalPriceEx) || (self.monetary.observable() < self.originalPriceEx)) {
            //            return Enumerable.From(self.discountReasons()).Where(function (x) {
            //                return x.DiscountReasonID == self.discountReason.observable();
            //            }).Select(function (x) {
            //                return x.CommentRequired
            //            }).SingleOrDefault();
            //        } else {
            //            return false;
            //        }
            //    }
            //}
        }
    }, self);

    self.customDiscountReason = {
        label: ko.pureComputed(function () {
            if (self.discountReason.observable()) {
                var reason = Enumerable.From(self.discountReasons()).Where(function (x) {
                    return x.DiscountReasonID == self.discountReason.observable()
                }).Single();
                if (reason.PriceIncrease)
                    return 'Reason'
            }
            return 'Discount Reason'
        }),
        observable: ko.observable(args.discountReasonComment).extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.customDiscountReasonRequired()
                },
                message: 'You must provide a custom discount reason'
            },
            notify: 'always'
        }),
        rows: 3,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 255
        }
    }

    self.subscriptions.push(self.customDiscountReasonRequired.subscribe(function (newValue) {
        if (newValue) {
            window.setTimeout(function () {
                self.customDiscountReason.observable.isValid.notifySubscribers(self.customDiscountReason.observable.isValid());
            }, 10);
        }
    }));

    self.currentState = ko.observable(self.percentage);

    self.currentState.readOnly = ko.observable(false);

    if (args.currentDiscountPercentage != null) {
        //self.permitPercentageToChangeMoney = true;
        //self.permitMoneyToChangePercentage = false;
        if (args.currentDiscountPercentage > 0) {
            self.selector.observable(DISCOUNT_STATE_PERCENTAGE);
            self.currentState(self.percentage);
        } else {
            self.selector.observable(DISCOUNT_STATE_MONETARY);
            self.currentState(self.monetary);
        }
    }

    if (args.currentDiscountMonetary != null) {
        //self.permitPercentageToChangeMoney = false;
        //self.permitMoneyToChangePercentage = true;
        self.selector.observable(DISCOUNT_STATE_MONETARY);
        self.currentState(self.monetary);
    }

    self.discountAmount = ko.pureComputed({
        read: function () {
            if (self.percentage.observable()) {
                return self.originalPriceEx * (self.percentage.observable() / 100);
            } else {
                return 0;
            }
        }
    }, self);

    self.subscriptions.push(self.monetary.focusObservable.subscribe(function (newValue) {
        if (newValue) {
            $(self.monetary.observable.DOMElement).select();
        } else {
            $(self.discountReason.observable.mdcSelect).focus();
        }
    }));

    self.subscriptions.push(self.monetary.observable.subscribe(function (newValue) {
        console.log('discounter monetary observable', newValue);
        if (newValue) {

        } else {
            self.focPromoCodeParams.clearFunction();
        }
        //if (newValue != null) {
        //    if (self.permitMoneyToChangePercentage) {
        //        var decrease = +self.originalPriceEx - +newValue;
        //        if (self.originalPriceEx == 0) {
        //            self.percentage.observable(100);
        //        } else {
        //            //self.percentage.observable(((decrease / (+self.originalPriceEx == 0 ? 1 : +self.originalPriceEx)) * 100).toFixed(6) || undefined);
        //            self.percentage.observable(((decrease / (+self.originalPriceEx == 0 ? 1 : +self.originalPriceEx)) * 100).toFixed(3) || undefined);
        //        }
        //    }
        //} else {
        //    if (self.delivery) {
        //        if (self.permitMoneyToChangePercentage) {
        self.percentage.observable(undefined);
        //        }
        //    }
        //}
    }));

    self.subscriptions.push(self.percentage.focusObservable.subscribe(function (newValue) {
        if (newValue) {
            $(self.percentage.observable.DOMElement).select();
        }
    }));

    self.subscriptions.push(self.percentage.observable.subscribe(function (newValue) {
        console.log('discounter percentage observable', newValue);
        if (newValue) {

        } else {
            self.focPromoCodeParams.clearFunction();
        }
        //if (newValue != null) {
        //    if (+newValue == 100) {
        //        self.discountReason.observable(undefined);
        //    }
        //} else {
        //    self.discountReason.observable(undefined);
        //}
        //if (self.permitPercentageToChangeMoney) {
        //    if (newValue == 100) {
        //        self.monetary.observable(0);
        //    } else {
        //        self.monetary.observable((+self.originalPriceEx - +self.discountAmount()) || undefined);
        //    }
        //}
    }));

    self.focAvailable = ko.pureComputed(function () {

        if ((self.percentage.observable() == 100) && self.tradePromotionCodeIdRequired) {
            return true;
        } else if ((+self.monetary.observable() == 0) && self.tradePromotionCodeIdRequired) {
            return true;
        }

        return false;
    }, self);

    self.budgetManager = {
        observable: ko.observable().extend({
            //required: {
            //    params: true,
            //    onlyIf: function () {
            //        return self.focAvailable()
            //    },
            //    message: 'Budget Manager'
            //},
            ////notify: 'always'
        }),
        label: 'Please select a Budget Manager',
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        options: self.budgetManagers,
        optionsText: 'budgetManagerName',
        optionsValue: 'budgetManagerCode',
        optionsCaption: ' ',
        width: 'auto'
    }

    self.focPromoCodes = ko.pureComputed(function () {
        if (self.budgetManager.observable()) {
            return Enumerable.From(self.budgetManagers()).Where(function (x) {
                return x.budgetManagerCode == self.budgetManager.observable()
            }).Select(function (x) {
                return x.promoCodes
            }).Single();
        } else {
            return [];
        }
    }, self);

    self.focPromoCodeEnabled = ko.pureComputed(function () {
        return self.focPromoCodes().length > 0
    }, self);

    //self.focPromoCode = {
    //    observable: ko.observable().extend({
    //        required: {
    //            params: true,
    //            onlyIf: function () {
    //                return self.focAvailable()
    //            },
    //            message: ' '
    //        },
    //        notify: 'always'
    //    }),
    //    label: 'Please select a Promotion Code',
    //    useNativeValidation: false,
    //    decorateInputElement: false,
    //    insertValidationMessages: false,
    //    options: self.focPromoCodes,
    //    optionsText: function (x) {
    //        return x.Code + ' - ' + x.TradePromotionName
    //    },
    //    optionsValue: 'TradePromotionCodeID',
    //    optionsCaption: ' ',
    //    width: 'auto',
    //    enable: self.focPromoCodeEnabled
    //}

    self.focPromoCode = {
        observable: ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.focAvailable()
                },
                message: 'FOC Promo Code'
            },
            notify: 'always'
        })
    }

    self.focPromoCodeParams = kendoMDCDropDownList({
        label: 'Promotion Code',
        groupTemplate: '<strong>#:data#</strong>',
        template: null,
        valueTemplate: null,
        optionLabelTemplate: null,
        optionLabel: null,
        textField: 'TradePromotionName',
        valueField: 'TradePromotionCodeID',
        data: args.focPromoCodes,
        idObservable: self.focPromoCode.observable,
        showClear: true,
        clearFunction: function () {
            self.focPromoCode.observable(undefined);
        },
        permitRevert: false,
        height: 300,
        grouping: [{
            field: 'BudgetManagerName'
        }],
        filtering: function (ev) {
            if (ev.filter) {
                var filterValue = ev.filter.value;
                ev.preventDefault();
                this.dataSource.filter({
                    logic: "or",
                    filters: [
                        {
                            field: "TradePromotionName",
                            operator: "contains",
                            value: filterValue
                        },
                        {
                            field: "Code",
                            operator: "contains",
                            value: filterValue
                        },
                        {
                            field: "BudgetManagerName",
                            operator: "contains",
                            value: filterValue
                        }
                    ]
                })
            }
        },
        popupSettings: {
            appendTo: $(args.appendTo)[0]
        }
    });

    self.increasedValueWarning = ko.pureComputed(function () {
        if ((self.percentage.observable() > 100) || (+self.monetary.observable() > self.originalPriceEx)) {
            return true;
        } else {
            return false;
        }
    });

    self.errors = ko.validation.group([
        self.discountReason.observable,
        self.customDiscountReason.observable,
        //self.budgetManager.observable,
        self.focPromoCode.observable
    ]);

    self.errorables = [
        self.discountReason.observable,
        self.customDiscountReason.observable,
        //self.budgetManager.observable,
        self.focPromoCode.observable,
        self.monetary.observable
    ];

    self.load = function (afterLoad) {
        if (self.currentDiscountPercentage != null) {
            //self.permitMoneyToChangePercentage = false;
            //self.permitPercentageToChangeMoney = true;
            self.percentage.observable(self.currentDiscountPercentage);
            //self.monetary.observable((+self.originalPriceEx - +self.discountAmount()).toFixed(2));

            window.setTimeout(function () {
                self.discountReason.observable(self.discountReasonId);
                self.customDiscountReason.observable(self.discountReasonComment);
                if (self.tradePromotionCodeId) {
                    self.budgetManager.observable(Enumerable.From(self.budgetManagers()).Where(function (x) {
                        return Enumerable.From(x.promoCodes).Where(function (y) {
                            return y.TradePromotionCodeID == self.tradePromotionCodeId;
                        }).FirstOrDefault()
                    }).Select('$.budgetManagerCode').SingleOrDefault());
                    self.focPromoCode.observable(self.tradePromotionCodeId);
                }
                if (self.monetary.observable.hasOwnProperty('mdcTextField'))
                    self.monetary.observable.mdcTextField.layout();
                if (self.percentage.observable.hasOwnProperty('mdcTextField'))
                    self.percentage.observable.mdcTextField.layout();
            }, 0);
        }

        self.subscriptions.push(self.discountReason.observable.subscribe(function (newValue) {
            if (newValue != self.discountReasonId)
                self.customDiscountReason.observable(undefined);
        }));

        if (self.currentDiscountMonetary != null) {
            //self.permitMoneyToChangePercentage = true;
            //self.permitPercentageToChangeMoney = false;
            self.monetary.observable(self.currentDiscountMonetary);

            window.setTimeout(function () {
                self.discountReason.observable(self.discountReasonId);
                self.customDiscountReason.observable(self.discountReasonComment);
                if (self.tradePromotionCodeId) {
                    self.budgetManager.observable(Enumerable.From(self.budgetManagers()).Where(function (x) {
                        return Enumerable.From(x.promoCodes).Where(function (y) {
                            return y.TradePromotionCodeID == self.tradePromotionCodeId;
                        }).FirstOrDefault()
                    }).Select('$.budgetManagerCode').SingleOrDefault());
                    self.focPromoCode.observable(self.tradePromotionCodeId);
                }
                if (self.monetary.observable.hasOwnProperty('mdcTextField'))
                    self.monetary.observable.mdcTextField.layout();
                if (self.percentage.observable.hasOwnProperty('mdcTextField'))
                    self.percentage.observable.mdcTextField.layout();
            }, 0);
        }

        // should this only be the case for particular uses of discounters?
        // previously this was only necessary for delivery...
        self.currentState.subscribe(function (newValue) {
            self.monetary.observable(undefined);
            self.percentage.observable(undefined);
        });

        if (self.monetary.observable() != null || self.percentage.observable() != null) {
            self.discounterBeginsHidden(false);
        }

        if (typeof afterLoad !== 'undefined') {
            self.afterLoad = afterLoad;
        }

        if (typeof self.afterLoad === 'function') {
            self.afterLoad();

            self.afterLoad = null;
        }
    }

    self.toJS = function () {
        var result = { // Pascal cased to match the properties already on the deliveryService object being $.extend()ed using this fn.
            TradePromotionCodeID: self.focPromoCode.observable() || null,
            DiscountReasonID: self.discountReason.observable() || null,
            DiscountReasonComment: self.customDiscountReason.observable() || null
        }

        if (self.delivery) {
            switch (self.selector.observable()) {
                case DISCOUNT_STATE_MONETARY:
                    if (self.monetary.observable() != null) {
                        //result.OperatorEnteredChargingLogicID = 1; // commented out at Sarah's behest, 03/09/2021
                        result.OperatorEnteredChargeEx = self.monetary.observable();
                    } else {
                        result.OperatorEnteredChargingLogicID = null;
                        result.OperatorEnteredChargeEx = self.monetary.observable();
                    }
                    break;

                case DISCOUNT_STATE_PERCENTAGE:
                    // direct dispatch can actually hold 100% discount (which necessarily IS a £0 charge)
                    // and doesn't want to wipe out the OperatorEnteredChargeEX
                    // HOWEVER!!! We do NOT want to wipe out these values if you're in Percentage and you've not got a percentage... value...
                    // oh, bloody Nora..
                    if (self.haulierCode == 'DD') {
                        if (self.percentage.observable()) {
                            result.OperatorDiscountPercentage = self.percentage.observable();
                            result.OperatorEnteredChargeEx = 0;
                        }
                    } else {
                        result.OperatorEnteredChargeEx = null;
                        result.OperatorEnteredChargingLogicID = null;
                        result.OperatorDiscountPercentage = self.percentage.observable();
                    }
                    break;
            }
        } else {
            switch (self.selector.observable()) {
                case DISCOUNT_STATE_MONETARY:
                    result.OperatorEnteredChargeEx = self.monetary.observable();
                    result.OperatorDiscountPercentage = null;
                    break;

                case DISCOUNT_STATE_PERCENTAGE:
                    result.OperatorEnteredChargeEx = null;
                    result.OperatorDiscountPercentage = self.percentage.observable();
                    break;
            }
            result.CurrentDiscounterState = self.selector.observable() ? true : false;
        }
        return result;
    }

    self.notifySubscribers = function () {
        self.discountReason.observable.isValid.notifySubscribers(self.discountReason.observable.isValid());
        self.customDiscountReason.observable.isValid.notifySubscribers(self.customDiscountReason.observable.isValid());
        //self.budgetManager.observable.isValid.notifySubscribers(self.budgetManager.observable.isValid());
        self.focPromoCode.observable.isValid.notifySubscribers(self.focPromoCode.observable.isValid());
    }

    self.reset = function () {
        self.discountReason.observable(undefined);
        self.customDiscountReason.observable(undefined);
        self.budgetManager.observable(undefined);
        self.focPromoCode.observable(undefined);
        self.selector.observable(DISCOUNT_STATE_PERCENTAGE);
        //self.permitPercentageToChangeMoney = true;
        //self.permitMoneyToChangePercentage = false;
        self.percentage.observable(undefined);
        self.monetary.observable(undefined);
    }
}

var addAllViewModel = function (parent) {
    var self = this;

    self.parent = parent;

    self.busy = ko.observable(false);

    self.busyMessage = ko.computed(function () {
        return 'Working...'
    }, self);

    self.percentComplete = ko.observable(0);

    self.additionList = ko.observableArray([]);

    self.searchResult = ko.observable();

    self.progressBarParams = {
        widget: ko.observable(),
        value: self.percentComplete,
        showStatus: true,
        animation: {
            duration: 100
        },
        change: function (e) {
            //if (self.progressBarParams.widget())
            //    self.progressBarParams.widget().showStatus = true;
            e.sender.progressStatus.text(`Added ${self.addedCount()} / ${self.searchResultCount()} Search Results`);
        }
    };

    self.progressBarParams.widget.subscribe(function (newValue) {
        if (newValue) {
            newValue.progressStatus.text(`Added 0 / ${self.searchResultCount()} Search Results`);
        }
    });

    self.searchResultCount = ko.pureComputed(function () {
        return Enumerable.From(self.parent.searchResults()).Where(function (x) {
            return x.productFilterOptions().BespokeProduct == false;
        }).ToArray().length;
    }, self);

    self.addedCount = ko.observable();

    self.displayPercentage = ko.observable(false);

    //self.displayPercentage.subscribe(function (newValue) {
    //    if (newValue) {
    //        window.setTimeout(function () {
    //            if (self.progressBarParams.widget()) {
    //                self.progressBarParams.widget().progressStatus.text(`Adding ${self.searchResultCount()} Search Results...`);
    //            }
    //        }, 0);
    //    }
    //});

    self.incrementPercentage = function () {
        if (self.addedCount()) {
            self.addedCount(self.addedCount() + 1)
        } else {
            self.addedCount(1);
        }
        if (self.percentComplete() == 0) {
            self.percentComplete(100 / self.searchResultCount());
        } else {
            self.percentComplete(self.percentComplete() + (100 / self.searchResultCount()));
        }
    }

    self.decrementAddedCount = function () {
        if (self.addedCount()) {
            self.addedCount(self.addedCount() - 1)
        } else {
            self.addedCount(0);
        }
    }

    self.discounter = new discounterFactory({
        currentDiscountMonetary: undefined,
        currentDiscountPercentage: undefined,
        discountReasonId: undefined,
        discountReasonComment: undefined,
        tradePromotionCodeId: undefined,
        currency: self.parent.currency(),
        originalPriceEx: undefined,
        discountReasons: ko.observableArray(getDiscountReasons()),
        focPromoCodes: getFOCPromotionCodes(),
        budgetManagers: ko.observableArray(Enumerable.From(getFOCPromotionCodes()).GroupBy(
            function (manager) {
                return {
                    name: manager.BudgetManagerName,
                    code: manager.BudgetManagerCode
                }
            },
            function (grouping) {
                return grouping;
            },
            function (manager, promoCodes) {
                return {
                    budgetManagerName: manager.name,
                    budgetManagerCode: manager.code,
                    promoCodes: Enumerable.From(promoCodes.source).OrderBy(function (z) {
                        return z.Code + ' - ' + z.TradePromotionName
                    }).ToArray()
                }
            },
            function (manager) {
                return manager.code
            }
        ).OrderBy(function (x) {
            return x.budgetManagerName
        }).ToArray()),
        tradePromoCodeIdRequired: true,
        permitPercentage: true,
        permitMonetary: false,
        appendTo: '#add-all-modal'
    });

    self.rejectedAdditions = [];
    self.rejectedAdditionsStock = [];
    self.rejectedDiscounts = [];

    self.addAll = function () {
        // hmpf.
        // sooo... percent.
        // how many are there in total: searchResultCount.
        // so... searchResultCount / 100 = value for 1%.
        // searchResultCount == 100%.
        // each individual result is... therefore... 100 / 250

        if (self.discounter.errors().length) {
            self.discounter.errors.filter(function (x) {
                if (!x.isValid()) {
                    x.isValid.notifySubscribers(false);
                }
            });
        } else {
            self.displayPercentage(true);

            self.busy(true);

            var warnBespoke = false;

            self.additionList([]);

            self.addedBasketItemIDs = [];

            ko.utils.arrayForEach(self.parent.searchResults(), function (item) {
                if (!item.productFilterOptions().BespokeProduct) {

                    // this function body is executed immediately, but .then waits for resolution or rejection results.
                    // so go figure it's executed twice... what you want is to defer the call.
                    item.quantity(self.searchResult().quantity());
                    item.fulfilmentOption(self.searchResult().fulfilmentOption());
                    item.lineReference.observable(self.searchResult().lineReference.observable());

                    // this call to addBasketItem is NOT DEFERRED. 
                    // ... STILL not deferred.
                    self.additionList.push(item);

                } else {
                    warnBespoke = true;
                }
            });

            console.log('allAdd additionList', self.additionList());

            var currentIndex = 0;

            const executor = new Promise(function (resolve, reject) {

                function addBasketItem(index) {
                    self.parent.addBasketItem(
                        self.additionList()[index],
                        ORDERFACTORY_ADD_MODE_STOCK,
                        true,
                        false,
                        function (addResult) {
                            self.addedBasketItemIDs.push(addResult.BasketItemID);
                            self.incrementPercentage();
                            index++;
                            if (index < (self.additionList().length)) {
                                addBasketItem(index);
                            } else {
                                resolve();
                            }
                        },
                        function (reason) { // basketAdd error
                            //self.incrementPercentage();
                            if (reason == 'stock') {
                                self.rejectedAdditionsStock.push(self.additionList()[index].record.Code);
                            } else {
                                self.rejectedAdditions.push(self.additionList()[index].record.Code);
                            }
                            self.decrementAddedCount();
                            index++;
                            if (index == self.additionList().length) {
                                resolve();
                            }
                        },
                        null,
                        null,
                        true,
                        true,
                        true
                    );
                }

                addBasketItem(currentIndex);
            });

            // promises is now a list of functions, each of which when called will invoke the promise therein...
            // what we want now is to connect each entry of the list of promises to the invocation of the next promise.

            Promise.allSettled([executor]).then(function () {

                self.parent.addingBasketItem(false);

                if (warnBespoke) {
                    $.info('Information', 'There were one or more Bespoke products in the set which you added to your basket. Bespoke products must be added to your basket manually.');
                }

                var errorString = '';

                if (self.rejectedAdditions.length) {
                    errorString = `Sorry, ${self.rejectedAdditions.length} item(s) failed to add to your basket.<br/><br/>These were:<br/>${self.rejectedAdditions.join('<br/>')}<br/><br/>Please attempt to add these manually.<br/><br/>`;
                }

                if (self.rejectedAdditionsStock.length) {
                    if (errorString == '') {
                        errorString = `Sorry, ${self.rejectedAdditionsStock.length} item(s) could not be added because they were Limited products and had no stock:<br/><br/>${self.rejectedAdditionsStock.join('<br/>')}`;
                    } else {
                        errorString = errorString + `The following ${self.rejectedAdditionsStock.length} item(s) could not be added because they were Limited products and had no stock:<br/><br/>${self.rejectedAdditionsStock.join('<br/>')}`;
                    }
                }

                if (self.discounter.percentage.observable()) {
                    var discounts = $.map(self.addedBasketItemIDs, function (bid) {
                        return $.extend(self.discounter.toJS(), {
                            basketItemId: bid
                        });
                    });

                    var data = {
                        basketId: self.parent.basketId(),
                        discounts: discounts,
                        addAll: true
                    }
                    console.log('orderFactory addAll calling saveBasketReviewPrices with', data);

                    $.ajax({
                        url: '/api/componentapi/SaveBasketItemReviewPrices',
                        type: 'POST',
                        dataType: 'json',
                        data: data,
                        success: function (data) {
                            console.log('orderFactory addAll saveBasketReviewPrices returned', data);
                            self.percentComplete(100);
                            self.busy(false);
                        },
                        error: function (xhr, s, a) {
                            errorString = errorString + `Sorry, discounts failed to apply to the added basket items.`;
                            self.percentComplete(100);
                            self.busy(false);
                        }
                    });
                } else {
                    self.percentComplete(100);
                    self.busy(false);
                }

                if (errorString != '') {
                    $.error('Warning', errorString);
                }
            });
        }
    }

    self.show = function (searchResult) {
        self.searchResult(searchResult);
        $('#add-all-modal').modal('show');
    }

    self.hide = function () {
        $('#add-all-modal').modal('hide');
        window.setTimeout(function () {
            self.reset();
        }, 300);
    }

    self.reset = function () {
        self.busy(false);
        self.searchResult(undefined);
        self.percentComplete(0);
        self.addedCount(undefined);
        self.displayPercentage(false);
        self.discounter.reset();
        self.rejectedAdditionsStock = [];
        self.rejectedAdditions = [];
    }
}

var deliveryGroupDiscounterViewModel = function (parent) {
    var self = this;

    self.parent = parent;

    self.busy = ko.observable(false);

    self.finished = ko.observable(false);

    self.discountReasons = ko.observable(getDiscountReasons());

    // list of basketItems excluded from bulk discount, via bulk discount fetch
    self.bulkDiscountResults = ko.observableArray([]);

    self.bulkDiscountGroupName = ko.observable();

    self.discounter = new discounterFactory({
        delivery: false,
        currentDiscountMonetary: null,
        currentDiscountPercentage: null,
        discountReasonId: null,
        discountReasonComment: null,
        tradePromotionCodeId: null,
        currency: self.parent.currency(),
        originalPriceEx: 0,
        discountReasons: self.discountReasons,
        focPromoCodes: getFOCPromotionCodes(),
        budgetManagers: ko.observableArray([]),
        tradePromoCodeIdRequired: true,
        permitMonetary: false,
        appendTo: '#delivery-group-bulk-discounter-modal'
    });

    self.fetchBulkDiscounts = function (deliveryGroupId) {
        self.busy(true);
        var data = {
            basketId: self.parent.basketId(),
            deliveryGroupId: deliveryGroupId
        }
        console.log('bulkDiscounter fetchBulkDiscounts calling with', data);
        $.ajax({
            url: '/api/componentapi/FetchDeliveryGroup_BulkDiscount',
            type: 'POST',
            data: data,
            success: function (data) {
                self.busy(false);
                console.log('bulkDiscounter fetchBulkDiscounts returned', data);
                self.bulkDiscountResults(data.Products);
            },
            error: function (xhr, s, a) {
                $.ajaxSettings.error(xhr, s, a);
                self.busy(false);
            }
        });
    }

    self.permittedBasketItems = ko.pureComputed(function () {
        if (self.bulkDiscountResults()) {
            return Enumerable.From(self.bulkDiscountResults()).Where(function (x) {
                return x.BulkDiscountDenied == false;
            }).ToArray();
        }
    }, self);

    self.deniedBasketItems = ko.pureComputed(function () {
        if (self.bulkDiscountResults()) {
            return Enumerable.From(self.bulkDiscountResults()).Where(function (x) {
                return x.BulkDiscountDenied == true;
            }).ToArray();
        }
    }, self);

    self.apply = function () {
        if (self.discounter.percentage.observable()) {
            if (self.discounter.errors().length) {
                self.discounter.errors.filter(function (x) {
                    if (!x.isValid()) {
                        x.isValid.notifySubscribers(false);
                    }
                });
            } else {
                // boom
                self.busy(true);
                var data = {
                    basketId: self.parent.basketId(),
                    addAll: true,
                    discounts: $.map(self.permittedBasketItems(), function (bi) {
                        return $.extend({
                            basketItemId: bi.BasketItemID
                        }, self.discounter.toJS())
                    })
                };
                console.log('bulkDiscounter calling saveBasketItemReviewPrices with', data);
                $.ajax({
                    url: '/api/componentapi/SaveBasketItemReviewPrices',
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    success: function (data) {
                        console.log('bulkDiscounter saveBasketItemReviewPrices returned', data);
                        self.bulkDiscountResults([]);
                        self.finished(true);
                        self.busy(false);
                    },
                    error: function (xhr, s, a) {
                        $.ajaxSettings.error(xhr, s, a);
                        self.busy(false);
                    }
                });
            }
        } else {
            self.discounter.percentage.observable.mdcTextField.label_.shake(true);
        }
    }

    self.show = function (basketSplit) {
        $('#delivery-group-bulk-discounter-modal').modal('show');
        self.fetchBulkDiscounts(basketSplit.deliveryGroupId);
        self.bulkDiscountGroupName(basketSplit.basketGroup);
    }

    self.hide = function () {
        self.reset();
        $('#delivery-group-bulk-discounter-modal').modal('hide');
    }

    self.hideRefresh = function () {
        $('#delivery-group-bulk-discounter-modal').modal('hide');
        if (self.finished())
            self.parent.fetchBasket();
        self.reset();
    }

    self.reset = function () {
        self.busy(false);
        self.finished(false);
        self.bulkDiscountResults([]);
        self.bulkDiscountGroupName(undefined);
        self.discounter.reset();
    }
}

const retailPaymentEntry = ({
    record,
    loadedValue,
    parent
} = {}) => (function () {
    var self = {};

    self.record = record;

    self.parent = parent;

    self.validateNow = self.parent.validateRetailNow;

    self.availableRetailPaymentTypes = [{
        name: 'Debit Card',
        value: 'DC',
        referenceRequired: false
    }, {
        name: 'Debit Card (DEPOSIT)',
        value: 'DC-DEP',
        referenceRequired: false
    }, {
        name: 'Credit Card',
        value: 'CC',
        referenceRequired: false
    }, {
        name: 'Credit Card (DESPOSIT)',
        value: 'CC-DEP',
        referenceRequired: false
    }, {
        name: 'MasterCard',
        value: 'MC',
        referenceRequired: false
    }, {
        name: 'Amex',
        value: 'AM',
        referenceRequired: false
    }, {
        name: 'Mastro',
        value: 'MA',
        referenceRequired: false
    }, {
        name: 'Bank Transfer',
        value: 'IN',
        referenceRequired: false
    }, {
        name: 'Online Retail Payment',
        value: 'IF',
        referenceRequired: true
    }];

    self.retailPaymentType = ko.observable(loadedValue.paymentTypeId).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'Payment Type is Required'
        }
    });

    self.retailPaymentTypeObj = ko.observable();

    self.retailPaymentReferenceRequired = ko.pureComputed(function () {
        if (self.retailPaymentTypeObj()) {
            return self.retailPaymentTypeObj().referenceRequired;
        } else {
            return false;
        }
    }, self);

    self.retailPaymentReference = ko.observable(loadedValue.paymentReference).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow() && self.retailPaymentReferenceRequired();
            },
            message: 'Payment Reference is Required'
        }
    });

    self.retailPaymentReferenceParams = {
        label: 'Payment Reference',
        observable: self.retailPaymentReference,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        }
    };

    self.retailPaymentTypeParams = kendoMDCDropDownList({
        name: 'Retail Payment Type',
        label: 'Payment Type',
        objObservable: self.retailPaymentTypeObj,
        idObservable: self.retailPaymentType,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        data: self.availableRetailPaymentTypes,
        textField: 'name',
        valueField: 'value',
        optionsCaption: ' ',
        width: 'auto',
        showClear: true,
        filter: false,
        readOnly: loadedValue.paymentReference != null,
        clearFunction: function () {
            self.retailPaymentType(undefined);
        }
    });

    self.retailPaymentAmount = ko.observable(loadedValue.paymentAmount);

    self.max = ko.computed(function () {
        var val = Math.round((self.record.retailPaymentMax() + +(self.retailPaymentAmount() || 0)) * 100) / 100;
        console.log('max computed', val);
        return val;
    })

    self.retailPaymentAmount.extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'Payment Type is Required'
        },
        numberFormatted: {
            digits: 2,
            currency: {
                FormattingCulture: 'en-GB'
            }
        },
        min: {
            params: 0,
            message: 'Retail Payment undermin: ' + self.record.basketSplitId
        },
        max: {
            params: self.max,
            message: 'Retail Payment overmax: ' + self.record.basketSplitId
        }
    });

    self.retailPaymentAmountParams = {
        label: 'Payment Amount',
        observable: self.retailPaymentAmount,
        useNativeValidation: false,
        decorateInputElement: true,
        insertValidationMessages: false,
        showClear: true
    };

    self.toJS = function () {
        return {
            paymentTypeId: self.retailPaymentType(),
            paymentTypeName: self.retailPaymentTypeObj() == null ? null : self.retailPaymentTypeObj().name,
            paymentAmount: self.retailPaymentAmount(),
            paymentReference: self.retailPaymentReference()
        }
    }

    return self;
})()


const tradeAccountOrderNotification = ({
    record,
    result,
    parent
} = {}) =>
    (function () {

        var self = $.extend(record, {
            accepted: ko.observable(false)
        });

        self.noticeResult = result;

        self.parent = parent;

        self.nextNotice = null;

        self.acknowledgementRequired = record.AcknowledgementRequired;

        // adding AcknowledgementType
        //  'T' for Tick,  
        //  'Y/N' for Yes / No,
        //  'O' for 'Okay'
        //
        self.show = function () {
            if (self.acknowledgementRequired) {

                switch (self.AcknowledgementType) {
                    case 'T':
                        $.tickToDismiss({
                            title: self.Heading ?? 'Notifications',
                            message: `<div class="alert ${self.AlertClass} margin-bottom-15">${self.Notification}</div>`,
                            acknowledgeParams: {
                                checkboxId: 'tickbox-bypass',
                                label: self.TickBoxLabel,
                                observable: ko.observable(false),
                                useNativeValidation: false,
                                disabled: false
                            }
                        });
                        break;
                    case 'O':
                        $.info(self.Heading ?? 'Notifications', `<div class="alert ${self.AlertClass} margin-bottom-0">${self.Notification}</div>`, null, function () {
                            self.accepted(true);
                            if (self.nextNotice) {
                                window.setTimeout(function () {
                                    self.nextNotice.show();
                                }, 400);
                            } else {
                                self.accepted(true);
                                if (self.parent.hasOwnProperty('mayStartOrder')) {
                                    self.parent.mayStartOrder(self.noticeResult.CanStartOrder);
                                }
                                if (self.parent.hasOwnProperty('mayBrowse')) {
                                    self.parent.mayBrowse(self.noticeResult.CanBrowse);
                                }
                            }
                        });
                        break;
                    case 'Y/N':
                    default:
                        $.confirm(self.Heading ?? 'Notifications', `<div class="alert ${self.AlertClass} margin-bottom-0 margin-top-15">${self.Notification}</div>`, function () {
                            self.accepted(true);
                            if (self.nextNotice) {
                                window.setTimeout(function () {
                                    self.nextNotice.show();
                                }, 400);
                            } else {
                                if (self.parent.hasOwnProperty('mayStartOrder')) {
                                    self.parent.mayStartOrder(self.noticeResult.CanStartOrder);
                                }
                                if (self.parent.hasOwnProperty('mayBrowse')) {
                                    self.parent.mayBrowse(self.noticeResult.CanBrowse);
                                }
                            }
                        }, function () {
                            self.parent.mayStartOrder(false);
                            self.parent.mayBrowse(false);
                        });
                        break;
                }

            } else {
                $.info(self.Heading ?? 'Notifications', `<div class="alert ${self.AlertClass} margin-bottom-0">${self.Notification}</div>`, null, function () {
                    self.accepted(true);
                    if (self.nextNotice) {
                        window.setTimeout(function () {
                            self.nextNotice.show();
                        }, 400);
                    } else {
                        self.accepted(true);
                        if (self.parent.hasOwnProperty('mayStartOrder')) {
                            self.parent.mayStartOrder(self.noticeResult.CanStartOrder);
                        }
                        if (self.parent.hasOwnProperty('mayBrowse')) {
                            self.parent.mayBrowse(self.noticeResult.CanBrowse);
                        }
                    }
                });
            }
        }

        return self;
    })();