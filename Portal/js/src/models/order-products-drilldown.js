'use strict';

const WIDE_WIDTH_RESTRICTIONS_ACTIVE = true

// see order-products.js for consts which may be used in this file

var orderProductsDrilldownViewModel = function (parent, name) {
    // #region Sanity Checks

    if (parent == null) {
        console.error('orderProductsDrilldownViewModel demands parent');
        return;
    }

    // #endregion

    var self = this;

    self.parent = parent;

    self.name = name;

    // #region Properties (observables, observableArrays, other)

    // this... now sort of wants to live... not directly on here
    // we might need more of these... to exist... where?`
    // definitely... needs to... different... potato...

    // it sounds as though... it should belong... to 

    // The search result the user clicked on to invoke the drilldown modal.
    self.searchResult = ko.observable();

    self.stageInformation = ko.observable({
        stages: ko.observableArray([{
            StepID: 0,
            SortOrder: 1,
            Name: 'Loading',
            Mandatory: false,
            ToolTip: null
        }]),
        currentStage: ko.observable({ StepID: 0 })
    });

    self.addingProductToBasket = ko.observable();

    self.addingProductAllocationData = ko.observable();

    self.addingProductAllocationStockData = ko.observable();

    self.allocationRegionBusy = ko.observable(false);

    self.allocationStockRegionBusy = ko.observable(false);

    self.stockTableRegionBusy = ko.observable(false);

    self.availableStockLocations = ko.observableArray([]);

    self.availableStockLocations.subscribe(function (newValues) {
        console.log('availableStockLocations subscribe hit', newValues);
    });

    self.allocationStockLocation = {
        observable: ko.observable().extend({
            required: {
                params: true,
                message: 'Stock Location is required'
            },
            notEqual: {
                params: '',
                message: 'Stock Location is required'
            }
        }),
        widget: ko.observable(),
        skipSubscription: ko.observable(false),
        label: 'Stock Location',
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        options: self.availableStockLocations,
        optionsText: 'StockLocationName',
        optionsValue: 'StockLocationID',
        optionsCaption: ' ',
        width: 'auto',
        //selectedIndex: function () {
        //    return Enumerable.From(self.allocationStockLocation.options()).Where(function (x) {
        //        return x.StockLocationID == self.allocationStockLocation.observable();
        //    }).Select(function (x, i) { return i }).SingleOrDefault();
        //},
        optionsAfterRender: function (option, item) {
            // what on earth am I doing this for...?
            //ko.applyBindingsToNode(option, { attr: { 'aria-selected': (item.StockLocationID == self.allocationStockLocation.observable()) } }, item);
        }
    };

    self.allocationStockLocation.skipSubscription.subscribe(function (newValue) {
        console.log('orderProductsDrilldown ' + self.name + ' allocationStockLocation skipSubscription hit', newValue)
    });

    self.allocationWarningMessage = ko.observable();

    /* Matt's allocation validation:
     *  Attempt auto-allocation
     *  User can manually alter the result
     *  
     *  Under Allocated? 
*      Yes!
*         Sufficient Stock?
*              Yes!
*                  (A) Operator warning! You have under allocated by x. What would you like to do?
*                  - Go back and increase allocation
*                  - Order y and place a back order for x
*                  - Reduce the order quantity to y
*                  - Cancel this Order Line
*                  
*              No!
*                  Is product Limited, Disco or Clearance (L/Y/D)?
*                  Yes!
*                      Zero stock available?
*                      Yes!
*                          (B) Operator warning! This is a limited / disco / clearance product, and
*                          there is no stock available and no option to order any more.
*                          - Cancel this Order Line.
*                     
*                      No!
*                           (C) Operator warning! This is a limited / disco / clearance product, and
*                           there is insufficient stock available to satisfy the demand.
*                           - Go back and ammend allocation
*                           - Reduce the order to y
*                           - Cancel the Order Line
*                  
*                  No!
*                      Zero stock available?
*                      Yes!
*                          (D) Operator warning! There is no stock available now, but more is on the way.
*                          - Back order this line
*                          - Cancel the Order Line
*                      
*                      No!
*                          (E) Operator warning! There is insufficient stock to satisfy this demand. 
*                          - Go back and ammend allocation
*                          - Order y and place a back order for x
*                          - Reduce order quantity to y
*                          - Cancel this Order Line
*                      
*      No!             
*          Over Allocated?
*          Yes!
*              Is reserve?
*              Yes!
*                  (Accept a 3m/piece over allocation)
*                  Over allocated even after 3m reserve per piece allowance?
*                  Yes!
*                      (F) Operator warning! You have over allocated by x.
*                      - Increase order quantity to y
*                      - Go back and reduce allocation
*                      - Cancel this Order Line
*                  
*                  No!
*                      HURRAH! Continue unimpeded!
*              No!
*                      (G) Operator warning! You have over allocated by x.
*                      - Increase order quantity to y
*                      - Go back and reduce allocation
*                      - Cancel this Order Line
*          
*          
*          No!
*              HURRAH! Continue unimpeded.
* 
     * 
     * Phew.
     * 
     */

    self.displayAllocationTotals = ko.pureComputed(function () {
        var i = 0;
        if (self.addingProductAllocationData()) {
            if (self.addingProductAllocationData().Allocations.length == 0) {
                return false;
            }
            ko.utils.arrayForEach(self.addingProductAllocationData().Allocations, function (item) {
                if (item.batchGrouping.message != null)
                    i++;
            });
            if (i == self.addingProductAllocationData().length)
                return false;
        }
        return true;
    }, self);

    self.allocationWarningActionButtons = [{
        btnclass: 'btn-green',
        visible: ko.observable(false),
        html: ko.observable('Go back and amend the allocation'),
        click: function () {
            $("#allocation-warning-modal").modal('hide');
        }
    }, {
        btnclass: 'btn-blue',
        visible: ko.observable(false),
        html: ko.pureComputed(function () {
            if (self.addingProductToBasket())
                return 'Order ' + self.totalAllocatedStockInSelectedLocation() + ' ' + self.addingProductToBasket().record.Units +
                    ' and place a back order for ' + self.remainingToAllocate() + ' ' + self.addingProductToBasket().record.Units
        }, self),
        click: function () {
            self.partBackOrderBasketLine(self.totalAllocatedStockInSelectedLocation(), self.remainingToAllocate());
        }
    }, {
        btnclass: 'btn-blue',
        visible: ko.observable(false),
        html: ko.pureComputed(function () {
            if (self.addingProductToBasket())
                return 'Allow the system to reduce the order quantity to ' + self.totalAllocatedStockInSelectedLocation() + ' ' +
                    self.addingProductToBasket().record.Units;
        }, self),
        click: function () {
            self.addingProductToBasket().quantity(self.totalAllocatedStockInSelectedLocation());

            self.updateBasketItem(self.allocationValidation);

            $("#allocation-warning-modal").modal('hide');
        }
    }, {
        btnclass: 'btn-blue',
        visible: ko.observable(false),
        html: 'Back Order this line',
        click: function () {
            $("#allocation-warning-modal").modal('hide');
            $('#back-order-modal').modal('show');
        }
    }, {
        btnclass: 'btn-blue',
        visible: ko.observable(false),
        html: ko.pureComputed(function () {
            if (self.addingProductToBasket())
                return 'Allow the system to increase the order quantity to ' + self.totalAllocatedStockInSelectedLocation() + ' ' +
                    self.addingProductToBasket().record.Units;
        }, self),
        click: function () {
            self.addingProductToBasket().quantity(
                +self.addingProductToBasket().quantity() + -(+self.remainingToAllocate())
            );

            self.updateBasketItem(self.allocationValidation);

            $("#allocation-warning-modal").modal('hide');
        }
    }, {
        btnclass: 'btn-red',
        visible: ko.observable(false),
        html: 'Delete this order line',
        click: function () {
            self.cancelAddingProductToBasket();
        }
    }];

    self.cutPieceBreakdown = ko.observable();

    self.stockInfoBusy = ko.observable(false);

    self.busy = ko.observable(false);

    self.processingBusy = ko.observable(false);

    self.documentTypes = ko.observableArray([]);

    self.discounts = ko.observableArray([]);

    self.carouselBusy = ko.observable(false);


    self.bespokeOptionsBusy = ko.observable(false);
    self.patternBookContentsBusy = ko.observable(false);
    self.samplingOptionsBusy = ko.observable(false);
    self.alternateProductsBusy = ko.observable(false);
    self.alternateColourwaysBusy = ko.observable(false);
    self.alsoLookAtsBusy = ko.observable(false);
    self.fetchCoordinatingProductsBusy = ko.observable(false);
    self.USPsBusy = ko.observable(false);
    self.stockInfoBusy = ko.observable(false);
    self.techInfoBusy = ko.observable(false);
    self.treatmentOptionsBusy = ko.observable(false);
    self.showAllocationStockRefreshButton = ko.observable(false);
    self.linkedDocumentsBusy = ko.observable(false);
    self.supplierBusy = ko.observable(false);

    self.productPageImages = ko.observableArray([]);

    self.products = ko.observableArray([]);

    self.stockInfo = ko.observableArray([]);

    self.visibleImages = ko.observable(4);

    self.alternateProducts = ko.observable({ products: [] });

    self.alternateColourways = ko.observable({ products: [] });

    self.alsoLookAts = ko.observable({ products: [] });

    self.coordinatingProducts = ko.observable({ products: [] });

    self.samplingOptions = ko.observable({ products: [] });

    self.patternBookView = ko.observable(PATTERNBOOK_DISPLAY_CURRENT);

    self.patternBookView.subscribe(function (newValue) {
        self.patternBookEmailInputVisible(false);
    });

    self.patternBookContents = ko.observable({ products: [] });

    self.bespokeOptions = ko.observable({ products: [] });

    self.USPs = ko.observableArray([]);

    self.techInfo = ko.observable();

    self.existingQualityTreatments = ko.observable();

    self.treatmentNotes = ko.observableArray([]);

    self.linkedDocuments = ko.observableArray([]);

    self.viewingLinkedDocument = ko.observable();

    self.linkedDocumentEmailer = linkedDocumentEmailer({ parent: self });

    self.supplierInfo = ko.observableArray([]);

    self.treatmentOptions = ko.pureComputed(function () {
        if (self.existingQualityTreatments()) {
            return Enumerable.From(self.existingQualityTreatments().Treatments)
                .GroupBy(function (x) {
                    var provider = {
                        treatmentProviderId: x.TreatmentProviderID,
                        name: x.TreatmentProviderName,
                        sortOrder: x.TreatmentProviderSortOrder
                    };
                    return provider;
                }, function (treatmentProviderGrouping) {
                    return treatmentProviderGrouping;
                }, function (treatmentProviderGroup, treatmentProviderData) {
                    var treatmentTypeGroup = {
                        provider: treatmentProviderGroup,
                        treatmentTypes: Enumerable.From(treatmentProviderData.source)
                            .GroupBy(
                                function (item) { // by treatment type
                                    var treatmentType = {
                                        treatmentTypeId: item.TreatmentTypeID,
                                        name: item.TreatmentTypeName,
                                        sortOrder: item.TreatmentTypeSortOrder
                                    }
                                    return treatmentType;
                                },
                                function (treatmentTypeGrouping) {
                                    return treatmentTypeGrouping;
                                },
                                function (treatmentType, treatments) {
                                    var result = {
                                        type: treatmentType,
                                        treatments: treatments.source
                                    }
                                    return result;
                                },
                                function (treatmentType) {
                                    return treatmentType.treatmentTypeId
                                }).OrderBy(function (grouping) {
                                    return grouping.type.sortOrder
                                }).ToArray()
                    };
                    return treatmentTypeGroup;
                }, function (provider) {
                    return provider.treatmentProviderId
                }).ToArray();
        } else {
            return [];
        }
    }, self);

    self.sendEmailBusy = ko.observable(false);

    self.tradeAccount = null;

    self.largeImageId = ko.observable();

    self.drilldownCarouselTranslating = ko.observable(false);

    self.largeImageProduct = ko.observable();

    self.validateNow = ko.observable(false);

    self.validatePatternBookNow = ko.observable(false);

    self.emailInputVisible = ko.observable(false);

    self.generalAllocationMessage = ko.observable();

    self.ringFenceWarning = ko.observable();

    self.freeStockWarning = ko.observable();

    self.allocationRequest = ko.observable();

    self.preventBackOrdersWarning = ko.observable();

    self.reserveBuffer = ko.observable();

    self.supplierAvailabilityMessage = ko.observable();

    self.emailInputVisible.subscribe(function (newValue) {
        window.setTimeout(function () {
            $('#large-image-email').focus();
        }, 0);
    });

    self.patternBookEmail = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validatePatternBookNow()
            },
            message: 'Please provide a valid email address'
        },
        maxLength: 256,
        email: {
            params: true,
            onlyIf: function () {
                return self.validatePatternBookNow()
            },
            message: 'Invalid email format'
        },
        charsRemaining: {
            maxLength: 256,
            elementId: '#pattern-book-email-input'
        }
    });

    self.patternBookEmailInputVisible = ko.observable(false);

    self.patternBookEmailInputVisible.subscribe(function (newValue) {
        window.setTimeout(function () {
            $('#pattern-book-email-input').focus();
        }, 0);
    });

    self.email = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'Please provide a valid email address'
        },
        maxLength: 256,
        email: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'Invalid email format'
        },
        charsRemaining: {
            elementId: '#large-image-email',
            maxLength: 256
        }
    });

    self.lastSentTo = ko.observable();

    self.showLastSentTo = ko.observable(false);

    // Holds the line memo(s)
    self.lineMemos = ko.observableArray([]);

    // Holds all the available treatments
    self.availableTreatments = ko.observableArray([]);

    // Express treatment option selected?
    self.expressTreatment = ko.observable(false);

    self.expressTreatmentParams = {
        checkboxId: 'basket-treatments-express-check',
        label: 'Would you like to express this treatment?',
        observable: self.expressTreatment,
        useNativeValidation: false
    }

    // Selected treatment[s]
    self.selectedTreatments = ko.observableArray([]);

    // Are any treatments mandated?
    self.treatmentMandates = ko.observableArray([]);

    // Do we want to validate treatment-note-acknowledgements currently?
    self.treatmentNoteValidateNow = ko.observable(false);

    // Are there any must-acknowledge treatment notices?
    self.treatmentNoteErrors = ko.validation.group([self.treatmentNotes], {
        live: true,
        deep: true,
        observable: true
    });

    // Treatment Mandate Violations
    self.treatmentMandateViolations = ko.observableArray([]);

    // Has manual bypass of treatment mandates been requested?
    self.treatmentMandateBypass = ko.observable(false);

    self.treatmentMandateBypassParams = {
        checkboxId: 'mandate-bypass',
        label: 'Acknowledge that this fabric already meets the FR regulations and does not require further treatment.',
        observable: self.treatmentMandateBypass,
        useNativeValidation: false,
        disabled: false
    }

    // Holds the various standards tests which addingProductToBasket has already passed, if any
    self.productTestsPassed = ko.observableArray([]);

    // #endregion

    // #region Subscriptions

    //self.allocationStockLocation.observable.subscribe(function (previousValue) {
    //    console.log('orderProductsDrilldown ' + self.name + ' allocationStockLocation subscribe hit beforeChange ', previousValue);
    //}, self, 'beforeChange');

    self.allocationStockLocation.observable.subscribe(function (newValue) {
        if (self.allocationStockLocation.skipSubscription()) {
            console.log('orderProductsDrilldown ' + self.name + ' allocationStockLocation subscribe SKIPPED', newValue);
            self.allocationStockLocation.skipSubscription(false);
        } else {
            console.log('orderProductsDrilldown ' + self.name + ' allocationStockLocation subscribe hit', newValue);
            if (newValue != null) {
                $.confirm('Are you sure?', 'Changing Stock Location will clear all currently allocated stock.', function () {
                    self.changeStockLocation();
                }, function () {
                    self.allocationStockLocation.skipSubscription(true);
                    self.allocationStockLocation.observable(self.addingProductToBasket().fulfilmentOption().StockLocationID);
                })
            }
        }
    });

    self.addingProductToBasket.subscribe(function (newValue) {
        if (newValue) {
            self.stageInformation().currentStage().loadingMethod();
            //newValue.backOrder.subscribe(function (newValue) {
            //    if (newValue) {
            //        self.allocationStockLocation.skipSubscription(true);
            //        self.allocationStockLocation.observable(107);
            //        self.allocationStockLocation.observable.mdcSelect.disabled = true;
            //    } else {
            //        self.allocationStockLocation.observable.mdcSelect.disabled = false;
            //    }
            //});
        }
    });

    // #endregion

    // #region Computeds


    // don't want you being a computed: don't trust you and can't get validation without infinite recursion.
    // fix.
    // ... 
    // load these details out; they aren't conjured up out of thin air.
    // if they aren't there for the loading, fine, create the most base version.
    // validation throughout.
    self.allocationCutPieceJson = ko.observable();

    // Whenever allocation changes, so too must this change.
    // this is why a dependency on... addingProductAllocationData is useful.
    self.allocationCutPieceBreakdown = ko.pureComputed({
        read: function () {
            if (self.addingProductAllocationData() && self.addingProductToBasket()) {
                return Enumerable.From(self.addingProductAllocationData().Allocations).Select(function (x) {
                    return Enumerable.From(x.batches).Select(function (y) {
                        var batch = {
                            batch: y.batch,
                            pieces: Enumerable.From(y.pieces).Where(function (z) {
                                return z.confirmed()
                            }).Select(function (k) {
                                return k;
                            }).ToArray()
                        } // we do want all the pieces which have a confirmed value#
                        return batch;
                    }).Where(function (i) {
                        return i.pieces.length
                    }).ToArray(); // but there may be multiple batches having pieces... but we want to return
                    // only those batches which DO have a piece...
                }).Where(function (j) {
                    return j.length
                }).SingleOrDefault();
            }
        },
        write: function (value) {

        }
    }, self);

    self.allocationCutPieceBreakdown.extend({
        validation: {
            validator: function (val, otherVal) {
                if (self.addingProductToBasket()) {
                    if (self.addingProductToBasket().record.WideWidth) {
                        if (self.packingMethodId() == null)
                            return true; // you've not picked a shipping choice: we can't categorically state that you must cut length this line

                        if (self.packingMethodId() == 1) {
                            // if the user has begun cut length breakdown, they must finish it.
                            // if not, fine.
                            let mustComplete = false;

                            ko.utils.arrayForEach(self.allocatedLengths(), function (length) {
                                if (length.cuts().length) {
                                    mustComplete = true;
                                }
                            });


                            if (self.addingProductToBasket()) {
                                if (self.addingProductToBasket().backOrder()) {
                                    if (self.addingProductToBasket().record.MaxLengthPerPole) {
                                        if (+self.addingProductToBasket().quantity() > self.addingProductToBasket().record.MaxLengthPerPole) {
                                            mustComplete = true;
                                        }
                                    }
                                }
                            }


                            if (mustComplete) {
                                if (Enumerable.From(self.allocatedLengths()).Where(function (x) {
                                    return !x.cuts.isValid()
                                }).Any()) {
                                    return false
                                }
                            }

                            return true;
                        }
                        if (self.packingMethodId() == 2) {
                            // only mandatory now if any allocated lengths are greater than the 10m box maximum...
                            // or less than the quantityMinimum for this productFilterOptions set
                            // must always complete if started; must start if quantity > 10

                            var actualMaxFoldLength = self.maxFoldLength();
                            if (actualMaxFoldLength == 0) {
                                if (self.shipInABoxOverride()) {
                                    actualMaxFoldLength = 10;
                                }
                            }

                            if (+self.addingProductToBasket().quantity() > actualMaxFoldLength) {
                                if (Enumerable.From(self.allocatedLengths()).Where(function (x) {
                                    return !x.cuts.isValid()
                                }).Any()) {
                                    return false
                                }
                            } else {
                                let mustComplete = false;

                                ko.utils.arrayForEach(self.allocatedLengths(), function (length) {
                                    if (length.cuts().length) {
                                        mustComplete = true;
                                    }
                                });

                                if (mustComplete) {
                                    if (Enumerable.From(self.allocatedLengths()).Where(function (x) {
                                        if (x.cuts().length)
                                            return !x.cuts.isValid()
                                    }).Any()) {
                                        return false
                                    }
                                } else {
                                    return true;
                                }
                            }
                        }
                    }

                    // if we're over the max length per pole... on back order standard or wide width, regardless...
                    if (self.addingProductToBasket().backOrder()) {
                        if (self.addingProductToBasket().record.MaxLengthPerPole) {
                            if (+self.addingProductToBasket().quantity() > self.addingProductToBasket().record.MaxLengthPerPole) {
                                // we MUST have a valid cut length breakdown.
                                // we can't just say "Oh, you haven't begun a cut length breakdown therefore you're fine".

                                if (Enumerable.From(self.allocatedLengths()).Where(function (x) {
                                    return !x.cuts.isValid()
                                }).Any()) {
                                    return false
                                }
                            }
                        }
                    }

                    if (self.allocationCutPieceBreakdown()) {

                        // if the user has begun cut length breakdown, they must finish it.
                        // if not, fine.
                        let mustComplete = false;
                        ko.utils.arrayForEach(self.allocatedLengths(), function (length) {
                            if (length.cuts().length) {
                                mustComplete = true;
                            }
                        });

                        if (mustComplete) {
                            if (Enumerable.From(self.allocatedLengths()).Where(function (x) {
                                return !x.cuts.isValid()
                            }).Any()) {
                                return false
                            }
                        }

                        return true;

                        //var total = Enumerable.From(self.allocationCutPieceBreakdown()).Select(function (x) {
                        //    return Enumerable.From(x.pieces).Select(function (y) {
                        //        return Enumerable.From(y.cuts()).Select(function (z) {
                        //            return +z.cutLength()
                        //        }).Sum();
                        //    }).Sum();
                        //}).Sum();
                        //return total == +self.addingProductToBasket().quantity()
                    }

                    // If we still haven't returned true by this point, we have not passed validation.
                    return false

                } else {
                    return false;
                }
            },
            message: function () {
                if (self.addingProductToBasket()) {
                    if (self.addingProductToBasket().backOrder()) {
                        return `When back ordering this fabric the maximum piece length you can specify is ${self.addingProductToBasket().record.MaxLengthPerPole}m. You may
continue to back order ${self.addingProductToBasket().quantity()}m but please provide a cut length breakdown.`
                    }
                }
                return 'You must fully assign your pieces to a Cut Length Breakdown'
            },
            params: 0
        },
        required: {
            params: true,
            onlyIf: function () {
                if (self.addingProductToBasket().backOrder()) {
                    if (self.addingProductToBasket().record.MaxLengthPerPole) {
                        if ((+self.addingProductToBasket().quantity() > self.addingProductToBasket().record.MaxLengthPerPole)) {
                            return true; // wide width or not, if you've demanded more than we can ship on a pole we want A SHRUBBERY
                        }
                    }
                }
                if (WIDE_WIDTH_RESTRICTIONS_ACTIVE) {
                    if (self.addingProductToBasket()) {
                        return self.addingProductToBasket().record.WideWidth && self.addingProductToBasket().quantity() > 10;
                    }
                } else {
                    return false;
                }
            },
            message: function () {
                if (self.addingProductToBasket()) {
                    if (self.addingProductToBasket().backOrder()) {
                        return `When back ordering this fabric the maximum piece length you can specify is ${self.addingProductToBasket().record.MaxLengthPerPole}m. You may
continue to back order ${self.addingProductToBasket().quantity()}m but please provide a cut length breakdown.`
                    }
                }
                return 'You must provide a cut length breakdown.'
            }
        }
    });

    self.reserveBatchCuttingIndicator = ko.observable(false);

    self.treatmentDisplayGroups = ko.pureComputed(function () {
        if (self.availableTreatments()) {
            var returnValue = Enumerable.From(self.availableTreatments())
                .GroupBy(function (x) {
                    return {
                        treatmentDisplayGroupId: x.TreatmentDisplayGroupID,
                        name: x.TreatmentDisplayGroupName
                    }
                }, function (treatmentDisplayGroup) {
                    return treatmentDisplayGroup
                }, function (treatmentDisplayGroup, treatmentDisplayGroupData) {
                    return {
                        treatmentDisplayGroupId: treatmentDisplayGroup.treatmentDisplayGroupId,
                        name: treatmentDisplayGroup.name,
                        availableOptions: treatmentDisplayGroupData.source
                    }
                }, function (treatmentDisplayGroup) {
                    return treatmentDisplayGroup.treatmentDisplayGroupId
                }).ToArray();

            returnValue.push({
                treatmentDisplayGroupId: '-1',
                name: 'All',
                availableOptions: self.availableTreatments()
            })

            return returnValue;
        }
    }, self);

    self.treatmentDisplayGroupParams = {
        observable: ko.observable(1),
        widget: ko.observable(),
        label: 'Treatment Group',
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        options: self.treatmentDisplayGroups,
        optionsText: 'name',
        optionsValue: 'treatmentDisplayGroupId',
        width: 'auto'
    };

    self.availableTreatmentProvidersForGroup = ko.pureComputed(function () {
        return Enumerable.From(self.treatmentDisplayGroups()).Where(function (x) {
            return x.treatmentDisplayGroupId == self.treatmentDisplayGroupParams.observable()
        }).Select(function (x) {
            return x.availableOptions
        }).SingleOrDefault(false);
    }, self);

    self.treatmentDisplayGroups.subscribe(function (newValues) {
        window.setTimeout(function () {
            self.treatmentDisplayGroupParams.observable(1);
        }, 0);
    });

    self.treatmentDisplayGroupParams.observable.subscribe(function (newValue) {
        console.log('orderProductsDrilldown treatmentDisplayGroupParams.observable subscribe hit', newValue);
    });

    self.treatmentProviders = ko.pureComputed(function () {
        if (self.availableTreatmentProvidersForGroup()) {
            return Enumerable.From(self.availableTreatmentProvidersForGroup())
                .GroupBy(function (x) {
                    var provider = {
                        treatmentProviderId: x.TreatmentProviderID,
                        name: x.TreatmentProviderName,
                        sortOrder: x.TreatmentProviderSortOrder
                    };
                    return provider;
                }, function (treatmentProviderGrouping) {
                    return treatmentProviderGrouping;
                }, function (treatmentProviderGroup, treatmentProviderData) {
                    var treatmentTypeGroup = {
                        provider: treatmentProviderGroup,
                        treatmentTypes: Enumerable.From(treatmentProviderData.source)
                            .GroupBy(
                                function (item) { // by treatment type
                                    var treatmentType = {
                                        treatmentTypeId: item.TreatmentTypeID,
                                        name: item.TreatmentTypeName,
                                        sortOrder: item.TreatmentTypeSortOrder
                                    }
                                    return treatmentType;
                                },
                                function (treatmentTypeGrouping) {
                                    return treatmentTypeGrouping;
                                },
                                function (treatmentType, treatments) {
                                    var result = {
                                        type: treatmentType,
                                        treatments: treatments.source
                                    }
                                    return result;
                                },
                                function (treatmentType) {
                                    return treatmentType.treatmentTypeId
                                }).OrderBy(function (grouping) {
                                    return grouping.type.sortOrder
                                }).ToArray()
                    };
                    return treatmentTypeGroup;
                }, function (provider) {
                    return provider.treatmentProviderId
                }).ToArray();
        } else {
            return [];
        }
    }, self);

    self.allocatedLengths = ko.pureComputed(function () {
        var result = [];
        if (self.addingProductAllocationData()) {
            ko.utils.arrayForEach(self.addingProductAllocationData().Allocations, function (x) {
                ko.utils.arrayForEach(x.batches, function (y) {
                    ko.utils.arrayForEach(y.pieces, function (z) {
                        if (z.confirmedAmount()) {
                            result.push(z);
                        }
                    });
                });
            });
        }
        return result;
    }, self);

    self.totalAvailableStockInSelectedLocation = ko.pureComputed({
        read: function () {
            if (self.addingProductAllocationData()) {
                return Enumerable.From(self.addingProductAllocationData().Allocations).Select(function (x) {
                    return Enumerable.From(x.batches).Select(function (y) {
                        return Enumerable.From(y.pieces).Select(function (z) {
                            return z.QuantityAvailable;
                        }).Sum();
                    }).Sum();
                }).Sum().toFixed(1);
            } else {
                return 0;
            }
        }
    }, self);

    self.totalAllocatedStockInSelectedLocation = ko.pureComputed({
        read: function () {
            if (self.addingProductAllocationData()) {
                return Enumerable.From(self.addingProductAllocationData().Allocations).Select(function (x) {
                    return Enumerable.From(x.batches).Select(function (y) {
                        return Enumerable.From(y.pieces).Select(function (z) {
                            if (z.confirmed()) {
                                return z.confirmedAmount() == null ? 0 : +z.confirmedAmount();
                            } else {
                                return 0;
                            }
                        }).Sum();
                    }).Sum();
                }).Sum().toFixed(1);
            } else {
                return 0;
            }
        }
    }, self);

    self.remainingToAllocate = ko.pureComputed({
        read: function () {
            if (self.addingProductToBasket()) {
                if (self.addingProductToBasket().backOrder()) {
                    return 0;
                }
                return (self.addingProductToBasket().quantity() - self.totalAllocatedStockInSelectedLocation()).toFixed(1);
            } else {
                return 0;
            }
        }
    }, self).extend({
        validation: {
            validator: function (val, otherVal) {
                if (self.addingProductToBasket()) {
                    if (self.addingProductToBasket().OrderTypeID == ORDERFACTORY_ADD_MODE_RESERVE) {
                        return val == (otherVal - 3)
                    }
                }
                return val == otherVal
            },
            message: 'You must either fully allocate (without over-allocating) or permit auto-allocation',
            params: 0
        }
    });

    self.allocationErrorHeading = ko.observable('Warning');

    // Pole Length Constraint Stuff
    self.wideWidthFabricControls = ko.observableArray([]);

    self.activeWideWidthFabricControls = ko.pureComputed(function () {
        if (self.wideWidthFabricControls().length) {
            if (self.anyWideWidthPoleAllocations()) {
                return Enumerable.From(self.wideWidthFabricControls()).Where(function (x) {
                    return x.PoleWidth == 'W'
                }).SingleOrDefault();
            } else if (self.anyStandardPoleAllocations()) {
                return Enumerable.From(self.wideWidthFabricControls()).Where(function (x) {
                    return x.PoleWidth == 'S'
                }).SingleOrDefault();
            }
        }
    }, self);

    self.activeWideWidthFabricControls.subscribe(function (newValue) {

        console.log('orderProductsDrilldown activeWideWidthFabricControls subscribe hit', newValue);

        if (newValue) {

            self.packingMethodId(newValue.PackingMethodID);

            self.shipInABoxOverride(newValue.AllowWideWidthFabricToShipInABox);

            self.shipOnAWideWidthPoleOverride(newValue.AllowWideWidthFabricToShipOnAWideWidthPole);

            self.shipOnAStandardWidthPoleOverride(newValue.AllowWideWidthFabricToShipOnAStandardWidthPole);

            self.wideWidthMessage(newValue.WideWidthMessage);
        }
    });

    self.maxFoldLength = ko.observable();

    // Used for when user is ordering a wide width fabric on back order - we do not know the width of the pole
    // because we get that data from allocations, which do not exist when back ordering,
    // but we DO have a default pole width on the record which Mr. Christie is going to return to me in the 4th result set
    self.wideWidthFabricDefaultPoleWidth = ko.observable();

    // Used for when a user is ordering a wide width fabric which is not a permitted to be shipped in a box
    //
    // 30/01/2020
    // This is now poorly named - the parameter is now acting as an override to the ability to ship in a box.
    // Where, ordinarily, you might be unable to ship in a box because of whatever preconditions (type of fabric, etc)
    // you might actually have this inability overridden by some other criteria (particular trade account, destination country, etc.)
    self.shipInABoxOverride = ko.observable();

    self.shipInABoxOverride.subscribe(function (newValue) {
        console.log('orderProductsDrilldown shipInABoxOverride subscribe hit', newValue);
    });

    self.wideWidthFabric = ko.observable(false);

    self.wideWidthFabric.subscribe(function (newValue) {
        console.log('orderProductsDrilldown wideWidthFabric subscribe hit', newValue);
    });

    self.shipOnAWideWidthPoleOverride = ko.observable();

    self.shipOnAWideWidthPoleOverride.subscribe(function (newValue) {
        console.log('orderProductsDrilldown shipOnAWideWidthPoleOverride subscribe hit', newValue);
    });

    self.shipOnAStandardWidthPoleOverride = ko.observable();

    self.shipOnAStandardWidthPoleOverride.subscribe(function (newValue) {
        console.log('orderProductsDrilldown shipOnAStandardWidthPoleOverride subscribe hit', newValue);
    });

    self.wideWidthMessage = ko.observable();

    // packingMethodId (1:'wide pole' / 2:'box', 3:'std pole')
    self.packingMethodId = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                if (WIDE_WIDTH_RESTRICTIONS_ACTIVE) {
                    if (self.addingProductToBasket() && self.anyWideWidthPoleAllocations()) {
                        return self.addingProductToBasket().record.WideWidth;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            },
            message: 'You need to specify whether this line should be shipped in a box or on a pole.'
        }
    });

    self.packingMethodId.subscribe(function (newValue) {
        console.log('orderProductsDrilldown packingMethodId subscribe hit', newValue);
        ko.utils.arrayForEach(self.allocatedLengths(), function (length) {
            length.cuts([]);
        });
    });

    self.totalReserveBuffer = ko.pureComputed(function () {
        if (self.addingProductToBasket() && self.addingProductAllocationData()) {
            if (self.addingProductToBasket().orderTypeId === ORDERFACTORY_ADD_MODE_RESERVE) {
                var reserveBuffer = 0;
                ko.utils.arrayForEach(self.addingProductAllocationData().Allocations, function (x) {
                    ko.utils.arrayForEach(x.batches, function (y) {
                        ko.utils.arrayForEach(y.pieces, function (z) {
                            if (z.confirmed()) {
                                reserveBuffer += +z.reserveBuffer()
                            }
                        });
                    });
                });
                return reserveBuffer;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    });

    self.totalOverAllocationAllowance = ko.pureComputed(function () {
        return 0;

        //if (self.addingProductToBasket()) {
        //    if (self.addingProductToBasket().orderTypeId === ORDERFACTORY_ADD_MODE_RESERVE) {
        //        var pieceCount = 0;
        //        ko.utils.arrayForEach(self.addingProductAllocationData().Allocations, function (x) {
        //            ko.utils.arrayForEach(x.batches, function (y) {
        //                ko.utils.arrayForEach(y.pieces, function (z) {
        //                    if (z.confirmed()) {
        //                        pieceCount++;
        //                    }
        //                });
        //            });
        //        });
        //        var totalOverAllocationAllowance = -(pieceCount * self.addingProductToBasket().productFilterOptions().ReserveOrderOverAllocationAllowance);
        //        return totalOverAllocationAllowance;
        //    } else {
        //        return 0;
        //    }
        //} else {
        //    return 0;
        //}
    }, self);

    self.underAllocated = ko.pureComputed(function () {
        return self.remainingToAllocate() > 0
    }, self);

    self.overAllocated = ko.pureComputed(function () {
        return self.remainingToAllocate() < 0;
    }, self);

    self.underAllocated.subscribe(function (newValue) {
        console.log('underAllocated subscribe hit', newValue);
    });

    self.overAllocated.subscribe(function (newValue) {
        console.log('overAllocated subscribe hit', newValue);
    });

    // #endregion

    // #region Components / Slicers

    // #endregion

    // #region Validation Groups

    self.basketItemLineMemoErrors = ko.validation.group([
        self.lineMemos
    ], {
        deep: true,
        observable: true,
        live: true
    });

    self.errors = ko.validation.group([
        self.email
    ]);

    self.patternBookErrors = ko.validation.group([
        self.patternBookEmail
    ]);

    self.addingProductToBasketAllocationErrors = ko.validation.group([
        self.packingMethodId,
        self.allocationCutPieceBreakdown,
        self.allocationStockLocation.observable
    ]);

    self.reviewPricingErrors = ko.validation.group([
        self.discounts
    ], {
        deep: true,
        live: true,
        observable: true
    });

    // #endregion

    // #region Functions

    self.cutLengthBreakdownEnabled = ko.pureComputed(function () {
        return ((!self.overAllocated() && !self.underAllocated()) && self.packingMethodId() == 2);
        //(
        //(self.anyWideWidthPoleAllocations() && self.packingMethodId.isValid()) ||
        //    self.anyStandardPoleAllocations()
        //)) ||
        //(self.addingProductToBasket() &&
        //(
        //    (self.addingProductToBasket().backOrder() &&
        //    (self.addingProductToBasket().record.MaxLengthPerPole) &&
        //    (+self.addingProductToBasket().quantity() > self.addingProductToBasket().record.MaxLengthPerPole))
        //))
    }, self);

    self.showCutLengthBreakdown = function () {
        $('#cut-breakdown-modal').modal('show');
    }

    self.nextStage = function (skipValidation) {
        window.setTimeout(function () {
            if (skipValidation) {
                self.processingBusy(true);
                self.stageInformation().currentStage().savingMethod(function () {
                    self.stageInformation().currentStage(self.stageInformation().currentStage().nextStage);
                    self.processingBusy(false);
                    self.stageInformation().currentStage().loadingMethod();
                });
            } else {
                self.stageInformation().currentStage().performValidation().then(function (result) {
                    self.processingBusy(true);
                    self.stageInformation().currentStage().savingMethod(function () {
                        self.stageInformation().currentStage(self.stageInformation().currentStage().nextStage);
                        self.processingBusy(false);
                        self.stageInformation().currentStage().loadingMethod();
                    });
                }).catch(function (error) {
                    self.processingBusy(false);
                });
            }
        }, 0);
    }

    self.previousStage = function (skipValidation) {
        window.setTimeout(function () {
            if (skipValidation) {
                self.processingBusy(true);
                self.stageInformation().currentStage().savingMethod(function () {
                    self.stageInformation().currentStage(self.stageInformation().currentStage().prevStage);
                    self.processingBusy(false);
                    self.stageInformation().currentStage().loadingMethod();
                });
            } else {
                self.stageInformation().currentStage().performValidation().then(function (result) {
                    self.processingBusy(true);
                    self.stageInformation().currentStage().savingMethod(function () {
                        self.stageInformation().currentStage(self.stageInformation().currentStage().prevStage);
                        self.processingBusy(false);
                        self.stageInformation().currentStage().loadingMethod();
                    });
                }).catch(function (error) {
                    self.processingBusy(false);
                });
            }
        }, 0);
    }

    self.loadAllocation = function () {
        console.log('orderProductsDrilldown loadAllocation called');

        let promises = [self.fetchBasketItemAllocation(), self.fetchBasketItemAllocationStock()];

        self.processingBusy(true);

        Promise.allSettled(promises).then(function () {
            self.processingBusy(false);
        });
    }

    self.saveAllocation = function (complete) {
        //noop; allocations save on-the-fly... 

        // except now they don't
        Promise.allSettled([self.saveBasketItemAllocationDetails()]).then(function () {
            if (typeof complete === 'function')
                complete();
        });
    }

    self.saveBasketItemAllocationDetails = function () {
        return new Promise(function (resolve, reject) {
            var cutData = [];

            ko.utils.arrayForEach(self.allocatedLengths(), function (length) {
                ko.utils.arrayForEach(length.cuts(), function (cut) {
                    cutData.push({
                        batch: length.Batch,
                        piece: length.Piece,
                        cut: cut.cutLength()
                    })
                });
            });

            var data = {
                basketItemId: self.addingProductToBasket().basketItemId,
                cutLengthJson: JSON.stringify(cutData),
                packingMethodId: self.packingMethodId() || (self.anyStandardPoleAllocations() ? 3 : null),
                batchCuttingIndicator: self.reserveBatchCuttingIndicator()
            }
            console.log('orderProductsDrilldown saveBasketItemAllocationDetails calling with', data);
            $.ajax({
                url: '/api/componentapi/SaveBasketItemAllocationDetails',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('orderProductsDrilldown saveBasketItemAllocationDetails returned', data);
                    resolve();
                },
                error: function (xhr, s, a) {
                    reject(new Error(xhr.responseJSON));
                    $.ajaxSettings.error(xhr, s, a);
                }
            });
        });
    }

    self.loadTreatments = function () {
        self.processingBusy(true);
        var data = {
            basketItemId: self.addingProductToBasket().basketItemId
        }
        console.log('orderProductsDrilldown loadTreatments calling with', data);
        $.ajax({
            url: '/api/componentapi/FetchBasketItemTreatments',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                self.processingBusy(false);
                console.log('orderProductsDrilldown loadTreatments returned', data);

                self.availableTreatments(data.Treatments);
                self.treatmentNotes(data.TreatmentNotes.map(function (x, i) {
                    if (x.AcknowledgementRequired) {
                        x.acknowledged = ko.observable(false).extend({
                            equal: {
                                params: true,
                                onlyIf: function () {
                                    return self.treatmentNoteValidateNow() &&
                                        ((x.TreatmentTypeID == null) || Enumerable.From(self.selectedTreatments()).Where(function (y) {
                                            return y.TreatmentTypeID == x.TreatmentTypeID
                                        }).Any())
                                },
                                message: 'You must acknowledge TreatmentNote ' + x.TreatmentNote
                            }
                        });
                        x.acknowledgementParams = {
                            checkboxId: 'treatment-note-check-' + i,
                            label: 'Tick this box to acknowledge this warning before proceeding',
                            observable: x.acknowledged,
                            useNativeValidation: false
                        };
                    }
                    x.visible = ko.pureComputed(function () {
                        return (x.TreatmentTypeID == null) || (Enumerable.From(self.selectedTreatments()).Where(function (y) {
                            return y.TreatmentTypeID == x.TreatmentTypeID
                        }).Any());
                    }, x);
                    return x;
                }));
                //self.treatmentNoteErrors = ko.validation.group([self.treatmentNotes], {
                //    live: true,
                //    deep: true,
                //    observable: true
                //});
                self.treatmentMandateBypass(false);
                self.treatmentMandates(data.TreatmentTypeMandates || []);

                self.selectedTreatments(Enumerable.From(self.availableTreatments()).Where(function (x) {
                    return x.Selected == true
                }).ToArray());

                self.expressTreatment(data.Express.Selected);
            },
            error: function (xhr, s, a) {
                self.processingBusy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    }

    self.addTreatment = function (treatment) {
        var warnProviders = false;

        if (Enumerable.From(self.selectedTreatments()).Where(function (x) {
            return x.TreatmentProviderID != treatment.TreatmentProviderID
        }).Any()) {
            warnProviders = true;
        } else {
            // if you're within the same provider
            if (Enumerable.From(self.selectedTreatments()).Where(function (x) {
                return x.TreatmentTypeID == treatment.TreatmentTypeID
            }).Any()) {
                // It'#
                // and you're changing treatments within a type
                //self.selectedTreatments.remove(function (x) {
                //    // we should remove any existing treatments of that type and replace with ^ treatment
                //    return x.TreatmentTypeID == treatment.TreatmentTypeID;
                //});
                self.selectedTreatments.push(treatment);
                return;
            }
        }

        if (warnProviders) {
            $.confirm('Are you sure?', 'You may not select treatments from different providers. ' +
                'If you continue, all existing treatments for this line will be replaced.', function () {
                    self.selectedTreatments([]);
                    self.expressTreatment(false);
                    self.selectedTreatments.push(treatment);
                }, function () {

                });
        } else {
            self.selectedTreatments.push(treatment);
        }
    }

    self.saveTreatments = function (complete) {
        self.processingBusy(true);

        var treatments = Enumerable.From(self.selectedTreatments()).Select(function (x) {
            return x.TreatmentID
        }).ToArray();

        var treatmentProviderId = null;

        var data = {
            basketItemId: self.addingProductToBasket().basketItemId,
            basketItemTreatments: treatments,
            expressTreatment: self.expressTreatment()
        }

        if (treatments.length) {
            data.treatmentProviderID = Enumerable.From(self.selectedTreatments()).Select(function (x) {
                return x.TreatmentProviderID
            }).FirstOrDefault();
        }

        console.log('orderProductsDrilldown saveTreatments calling with', data);

        $.ajax({
            url: '/api/componentapi/saveTreatments',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('orderProductsDrilldown saveTreatments returned', data);
                self.availableTreatments([]);
                self.selectedTreatments([]);
                self.expressTreatment(false);
                self.treatmentNotes([]);
                self.processingBusy(false);
                if (typeof complete === 'function')
                    complete();
            },
            error: function (xhr, s, a) {
                self.processingBusy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    }

    self.loadPricing = function () {
        self.fetchBasketItemReviewPrices();
    }

    self.savePricing = function (complete) {
        self.saveBasketReviewPrices(complete);
    }

    self.loadMemos = function () {
        self.fetchBasketItemMemos();
    }

    self.saveMemos = function (complete) {
        self.saveBasketItemMemos(complete);
    }

    self.addLineMemo = function () {
        if (Enumerable.From(self.lineMemos()).Where(function (x) {
            return x.readOnly == false
        }).Count() >= 99) {
            $.info('Sorry', 'You are only allowed a maximum of 99 custom memos per line.');
        } else {
            var memo = {
                label: 'Line Memo',
                basketItemLineMemoId: null,
                lineMemoTypeId: 1,
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
                rows: 10,
                charsRemainingOptions: {
                    maxLength: 1000
                },
                selectedDocumentTypes: ko.observableArray([])
            }
            memo.observable.extend({
                required: {
                    params: true,
                    onlyIf: function () {
                        return memo.selectedDocumentTypes().length
                    },
                    message: 'This memo is empty.'
                }
            });
            memo.selectedDocumentTypes.extend({
                required: {
                    params: true,
                    onlyIf: function () {
                        return memo.observable()
                    },
                    message: 'Please select at least one document type'
                }
            });
            memo.selectedDocumentTypes.subscribe(function (changes) {

                if (changes[0].status == 'added') {
                    if (changes[0].value == 'A') {
                        memo.selectedDocumentTypes(['A']);
                    } else {
                        if (memo.selectedDocumentTypes().indexOf('A') > -1) {
                            memo.selectedDocumentTypes.remove('A');
                        }
                    }
                }
            }, memo, 'arrayChange');
            self.lineMemos.push(memo);
        }
    }

    self.closeProcessingModal = function () {

        // right, now we need to do something.... different... if we're the bespokeFurniture
        // orderProcessingModal instance.

        // We want to... perform the validation, and the saving method, 

        self.stageInformation().currentStage().performValidation().then(function () {
            //self.stageInformation().currentStage().savingMethod(self.parent.orderFactory.fetchBasket); // phase subscribe calls fetchBasket; duplicating causes deadlocks!
            self.stageInformation().currentStage().savingMethod(function () {

                if (self.name === 'main') {
                    if (self.parent.orderFactory.phase() == ORDERFACTORY_PHASE_BLANK) {
                        window.setTimeout(function () {
                            self.parent.orderFactory.phase(ORDERFACTORY_PHASE_BASKET);
                        }, 0);
                    }
                    self.resetProcessingModal();
                    $('#order-processing-modal').modal('hide');
                    $('#order-products-drilldown-modal').modal('hide');
                } else {
                    self.parent.orderFactory.bespokeFurnitureFactory.progressComponentAllocation();
                }
            });
        }).catch(function () {

            if (self.name === 'main') {

                if (self.stageInformation().currentStage().StepID == ADVANCED_STAGE_REVIEW_ALLOCATION) {
                    // user will have been presented with a modal... 

                    // what exactly was the beneath intended to achieve...? overwriting the click function...
                    // in order to close the modals?
                    self.allocationWarningActionButtons.forEach(function (item) {
                        var click = item.click;

                        item.click = function () {
                            click();
                            $('#order-processing-modal').modal('hide');
                            $('#order-products-drilldown-modal').modal('hide');

                            if (self.parent.orderFactory.phase() == ORDERFACTORY_PHASE_BLANK) {
                                window.setTimeout(function () {
                                    self.parent.orderFactory.phase(ORDERFACTORY_PHASE_BASKET);
                                }, 0);
                            }

                        }
                    })
                }
            } else {
                // noop
            }
        });
    }

    self.cancelAddingProductToBasket = function () {
        $.confirm('Are you sure?', 'All existing allocations for this line will be removed.', function () {
            self.cancelBasketItem();
        }, null)
    }

    self.skipAllocationAndBackOrder = function (confirm) {
        if (typeof confirm === 'undefined')
            confirm = true;

        if (+self.remainingToAllocate() === +self.addingProductToBasket().quantity())
            confirm = false;

        if (confirm) {
            $.confirm('Are you sure?', 'All existing allocations for this line will be removed, and ' + self.addingProductToBasket().quantity() + ' ' + self.addingProductToBasket().record.Units +
                ' will be placed on back order.', function () {

                    var data = self.getBasketItem();

                    $('#allocation-warning-modal').modal('hide');

                    console.log('orderProductsDrilldown skipAllocationAndBackOrder calling with', data);

                    self.processingBusy(true);

                    $.ajax({
                        url: '/api/componentapi/BackOrderEntireBasketLine',
                        type: 'POST',
                        dataType: 'json',
                        data: data,
                        success: function (data) {
                            $('#back-order-modal').modal('hide');
                            console.log('orderProductsDrilldown skipAllocationAndBackOrder returned', data);
                            self.processingBusy(false);
                            //self.nextStage(true);
                            self.fetchBasketItemAllocation();
                            self.addingProductToBasket().backOrder(true);
                        },
                        error: function (xhr, s, a) {
                            self.processingBusy(false);
                            $.ajaxSettings.error(xhr, s, a);
                        }
                    });
                }, null);
        } else {
            var data = self.getBasketItem();
            $('#allocation-warning-modal').modal('hide');
            console.log('orderProductsDrilldown skipAllocationAndBackOrder calling with', data);
            self.processingBusy(true);
            $.ajax({
                url: '/api/componentapi/BackOrderEntireBasketLine',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    $('#back-order-modal').modal('hide');
                    console.log('orderProductsDrilldown skipAllocationAndBackOrder returned', data);
                    self.processingBusy(false);
                    //self.nextStage(true);
                    self.fetchBasketItemAllocation();
                    self.addingProductToBasket().backOrder(true);
                },
                error: function (xhr, s, a) {
                    self.processingBusy(false);
                    $.ajaxSettings.error(xhr, s, a);
                }
            });
        }
    }

    self.cancelBackOrdering = function () {
        self.processingBusy(true);
        var data = self.getBasketItem();
        $.ajax({
            url: '/api/componentapi/CancelBackOrdering',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function () {
                self.processingBusy(false);
                self.addingProductToBasket().backOrder(false);
                // this was necessary because coming off of back order and immediately calling allocation select
                // was still returning the "this item is backordered" message, and not returning ring fence stuff

                self.fetchBasketItemAllocation();
            },
            error: function (xhr, s, a) {
                self.processingBusy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    }

    self.partBackOrderBasketLine = function (x, y) {
        //$.confirm('Are you sure?', 'All existing allocations for this line will be removed, and ' + self.addingProductToBasket().quantity() + ' ' + self.addingProductToBasket().record.Units +
        //    ' will be placed on back order.', function () {
        //        //Hmmm.
        var data = self.getBasketItem();

        $.extend(data, {
            quantity: x,
            backOrderQuantity: y
        });

        console.log('orderProductsDrilldown partBackOrderBasketLine calling with', data);

        self.processingBusy(true);

        $.ajax({
            url: '/api/componentapi/PartBackOrderBasketLine',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('orderProductsDrilldown partBackOrderBasketLine returned', data);
                self.processingBusy(false);
                self.allocationValidation();
            },
            error: function (xhr, s, a) {
                self.processingBusy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
        //}, null);
    }

    self.invokeAllocationWarningModal = function () {

        if (!self.remainingToAllocate.isValid()) {
            if (self.remainingToAllocate() > 0) {
                // under allocated

                ko.utils.arrayForEach(self.allocationWarningActionButtons, function (item) {
                    item.visible(false);
                });

                self.allocationWarningMessage('You have under allocated by ' + self.remainingToAllocate() + ' ' + self.addingProductToBasket().record.Units +
                    '. What would you like to do?');

                self.allocationWarningActionButtons[0].html('Go back and increase allocation');

                self.allocationWarningActionButtons[0].visible(true);

                //self.allocationWarningActionButtons[1].visible(true);

                if (self.addingProductToBasket().record.AllowQuantityChange)
                    self.allocationWarningActionButtons[2].visible(true);

                self.allocationWarningActionButtons[3].visible(true);

                $("#allocation-warning-modal").modal('show');

            } else {
                // over allocated

                self.allocationWarningMessage('You over allocated by ' + self.remainingToAllocate() + ' ' + self.addingProductToBasket().record.Units +
                    '. What would you like to do?');

                self.allocationWarningActionButtons[0].html('Go back and reduce allocation');

                self.allocationWarningActionButtons[0].visible(true);

                //self.allocationWarningActionButtons[1].visible(true);

                if (self.addingProductToBasket().record.AllowQuantityChange)
                    self.allocationWarningActionButtons[2].visible(true);

                self.allocationWarningActionButtons[3].visible(true);

                $("#allocation-warning-modal").modal('show');
            }
        }
    }

    self.allocationValidation = function (skipValidation) {
        self.addingProductToBasketAllocationErrors.showAllMessages(false);

        if (skipValidation)
            return true;

        var showAllocationWarningModal = true;

        var productStatus = '';

        switch (self.addingProductToBasket().record.Status) {
            case 'C':
                productStatus = 'Current';
                break;
            case 'D':
                productStatus = 'Discontinued';
                break;
            case 'L':
            case 'Y':
                productStatus = 'Limited';
                break;
            default:
                break;
        }

        ko.utils.arrayForEach(self.allocationWarningActionButtons, function (item) {
            item.visible(false);
        });

        if (self.underAllocated()) {
            if (+self.totalAvailableStockInSelectedLocation() >= +self.addingProductToBasket().quantity()) {
                // (A) Operator warning! You have under allocated by x.What would you like to do?
                // - Go back and amend allocation
                // - Order y and place a back order for x
                // - Reduce the order quantity to y
                // - Cancel this Order Line
                console.log('allocationValidation (A)');

                self.allocationWarningMessage('You have not allocated enough stock to satisfy the customer\'s request. What would you like to do?')

                //self.allocationWarningMessage('You have under allocated by '
                //    + self.remainingToAllocate() + ' '
                //    + self.addingProductToBasket().record.Units
                //    + '. What would you like to do?')

                self.allocationWarningActionButtons[0].html('Go back and increase allocation');

                if (+self.totalAvailableStockInSelectedLocation() >= +self.addingProductToBasket().quantity())
                    self.allocationWarningActionButtons[0].visible(true);

                //self.allocationWarningActionButtons[1].visible(true);
                if (+self.totalAllocatedStockInSelectedLocation() > 0 && self.addingProductToBasket().record.AllowQuantityChange) // don't want to allow reduction to 0...
                    self.allocationWarningActionButtons[2].visible(true);

                if (self.name == 'main')
                    self.allocationWarningActionButtons[5].visible(true);

                $("#allocation-warning-modal").modal('show');
            } else {
                if (['Y', 'L', 'D'].indexOf(self.addingProductToBasket().record.Status) > -1) {
                    if (+self.totalAvailableStockInSelectedLocation() == 0) {
                        // (B) Operator warning! This is a limited / disco / clearance product, and
                        // there is no stock available and no option to order any more.
                        // - Cancel this Order Line.

                        if (Enumerable.From(self.addingProductAllocationStockData()).Where(function (x) {
                            return x.stockLocation.stockLocationId == self.allocationStockLocation.observable()
                        }).Select('+$.stockLocation.totalIncludingDue()').Sum() >= +self.addingProductToBasket().quantity()) {
                            console.log('allocationValidation (Bi)');

                            self.allocationWarningMessage('This is a ' + productStatus + ' product. There appears to be sufficient stock to satisfy your customers\'s demand. A replenishment task will be raised if you back order this line. This will instruct the warehouse to move stock to a pickable location to satisfy your order.');

                            self.allocationWarningActionButtons[3].visible(true);
                        }
                        else {
                            console.log('allocationValidation (B)');

                            self.allocationWarningMessage('This is a ' + productStatus + ' product, and there is no stock available and no option to order any more.');

                            if (self.name == 'main')
                                self.allocationWarningActionButtons[5].visible(true);
                        }
                    } else {
                        // (C) Operator warning! This is a limited / disco / clearance product, and
                        // there is insufficient stock available to satisfy the demand.
                        // - Go back and ammend allocation
                        // - Reduce the order to y
                        // - Cancel the Order Line
                        console.log('allocationValidation (C)');

                        self.allocationWarningMessage('This is a ' + productStatus + ' product, and there is insufficient stock available to satisfy the demand.');

                        if (+self.totalAvailableStockInSelectedLocation() >= +self.addingProductToBasket().quantity())
                            self.allocationWarningActionButtons[0].visible(true);

                        if (+self.totalAllocatedStockInSelectedLocation() > 0 && self.addingProductToBasket().record.AllowQuantityChange)
                            self.allocationWarningActionButtons[2].visible(true);

                        if (self.name == 'main')
                            self.allocationWarningActionButtons[5].visible(true);
                    }
                } else {
                    if (+self.totalAvailableStockInSelectedLocation() == 0) {
                        // (D) Operator warning! There is no stock available now, but more is on the way.
                        // - Back order this line
                        // - Cancel the Order Line
                        console.log('allocationValidation (D)');

                        self.allocationWarningMessage('There is no stock available now, but more is on the way.');

                        if (self.addingProductToBasket().record.Status == 'C')
                            self.allocationWarningActionButtons[3].visible(true);
                        else
                            self.allocationWarningMessage('This is a limited / discontinued / clearance product and cannot be back ordered.');

                        if (self.name == 'main')
                            self.allocationWarningActionButtons[5].visible(true);

                    } else {
                        // (E) Operator warning! There is insufficient stock to satisfy this demand. 
                        // - Go back and amend allocation
                        // - Order y and place a back order for x
                        // - Reduce order quantity to y
                        // - Cancel this Order Line
                        console.log('allocationValidation (E)');

                        self.allocationWarningMessage('There is insufficient stock to satisfy this demand.');

                        if (+self.totalAvailableStockInSelectedLocation() >= +self.addingProductToBasket().quantity())
                            self.allocationWarningActionButtons[0].visible(true);

                        if (self.preventBackOrdersWarning() == null) {
                            if (Number(self.totalAllocatedStockInSelectedLocation())) {
                                self.allocationWarningActionButtons[1].visible(true);
                            }
                            self.allocationWarningActionButtons[3].visible(true);

                            if (+self.totalAllocatedStockInSelectedLocation() > 0 && self.addingProductToBasket().record.AllowQuantityChange)
                                self.allocationWarningActionButtons[2].visible(true);
                        }

                        //self.allocationWarningActionButtons[1].visible(true);

                        if (self.name == 'main')
                            self.allocationWarningActionButtons[5].visible(true);
                    }
                }
            }
        } else {
            if (self.overAllocated()) {
                if (self.addingProductToBasket().orderTypeId == ORDERFACTORY_ADD_MODE_RESERVE) {
                    if (self.remainingToAllocate() < self.totalOverAllocationAllowance()) {
                        // (F) Operator warning! You have over allocated by x.
                        // - Increase order quantity to y
                        // - Go back and amend allocation
                        // - Cancel this Order Line
                        console.log('allocationValidation (F)');

                        self.allocationWarningMessage('You have allocated more stock than the customer requested. What would you like to do?');

                        //self.allocationWarningMessage('You have over allocated by '
                        //    + Math.abs((self.remainingToAllocate() - self.totalOverAllocationAllowance()).toFixed(self.addingProductToBasket().productFilterOptions().QuantityPrecision))
                        //    + ' '
                        //    + self.addingProductToBasket().record.Units);

                        self.allocationWarningActionButtons[0].html('Go back and reduce allocation');

                        if (self.totalAvailableStockInSelectedLocation() >= self.addingProductToBasket().quantity())
                            self.allocationWarningActionButtons[0].visible(true);

                        if (self.addingProductToBasket().record.AllowQuantityChange)
                            self.allocationWarningActionButtons[4].visible(true);

                        if (self.name == 'main')
                            self.allocationWarningActionButtons[5].visible(true);

                    } else {
                        // HURRAH!
                        showAllocationWarningModal = false;
                    }
                } else {
                    // (G) Operator warning! You have over allocated by x.
                    // - Increase order quantity to y
                    // - Go back and reduce allocation
                    // - Cancel thi
                    console.log('allocationValidation (G)');

                    self.allocationWarningMessage('You have allocated more stock than the customer requested. What would you like to do?');

                    //self.allocationWarningMessage('You have over allocated by '
                    //    + Math.abs((self.remainingToAllocate() - self.totalOverAllocationAllowance()).toFixed(self.addingProductToBasket().productFilterOptions().QuantityPrecision))
                    //    + ' '
                    //    + self.addingProductToBasket().record.Units);

                    self.allocationWarningActionButtons[0].html('Go back and reduce allocation');

                    if (self.totalAvailableStockInSelectedLocation() >= self.addingProductToBasket().quantity())
                        self.allocationWarningActionButtons[0].visible(true);

                    if (self.addingProductToBasket().record.AllowQuantityChange)
                        self.allocationWarningActionButtons[4].visible(true);

                    if (self.name == 'main')
                        self.allocationWarningActionButtons[5].visible(true);
                }
            } else {
                // HURRAH!
                showAllocationWarningModal = false;
            }
        }

        if (showAllocationWarningModal) {
            $('#allocation-warning-modal').modal('show');
            return false;
        } else {

            if (self.addingProductToBasketAllocationErrors().length > 0) {

                self.allocationErrorHeading('Warning');

                self.addingProductToBasketAllocationErrors.showAllMessages(true);

                self.addingProductToBasketAllocationErrors.filter(function (x) {
                    if (x.hasOwnProperty('isValid')) {
                        x.isValid.notifySubscribers(x.isValid());
                    }
                })

                if (!self.packingMethodId.isValid()) {
                    self.allocationErrorHeading('Please select a Packaging Option');
                }

                $('#allocation-errors-modal').modal('show');
                return false;
            }

            if (pd.allocatedLengths().length) {
                if (Enumerable.From(pd.allocatedLengths()).Select(function (x) {
                    return x.Batch
                }).Distinct().ToArray().length > 1) {
                    $.confirm('Please Note', '<p>You have allocated stock from more than one batch.</p><p>Are you sure you wish to proceed?</p>', function () {
                        self.nextStage(true);
                    });
                    return false;
                }
            }

            return true;
        }
    }

    self.treatmentValidation = function () {
        return new Promise(function (resolve, reject) {
            if (self.treatmentNoteErrors().length) {
                self.treatmentNoteErrors.filter(function (x) {
                    if (x.hasOwnProperty('isValid'))
                        x.isValid.notifySubscribers(x.isValid());
                });
                reject();
                //return false;
            } else {
                if (self.treatmentMandates().length == 0 || self.treatmentMandateBypass()) {
                    resolve();
                    //return true;
                } else {
                    var valid = true;
                    var failures = [];

                    ko.utils.arrayForEach(self.treatmentMandates(), function (x) {
                        if (!Enumerable.From(self.selectedTreatments()).Where(function (y) {
                            return x.TreatmentTypeID == y.TreatmentTypeID
                        }).Any()) {
                            valid = false;
                            failures.push(x);
                        }
                    });

                    if (!valid) {
                        self.treatmentMandateViolations(failures);
                        $('#treatment-mandates-modal').modal('show');
                    }

                    if (valid) {
                        resolve();
                    } else {
                        reject();
                    }
                    //return valid;
                }
                resolve();
                //return true;
            }
            //}, 0);


            //if (drillDown.treatmentValidation()) {
            //    resolve();
            //} else {
            //    reject();
            //}
        });

    }

    self.pricingValidation = function () {
        self.reviewPricingErrors.showAllMessages(false);
        if (self.reviewPricingErrors().length > 0) {
            self.reviewPricingErrors.showAllMessages(true);
            ko.utils.arrayForEach(self.discounts(), function (item) {
                item.discounter.notifySubscribers();
            });
            return false;
        } else {
            return true;
        }
    }

    self.memoValidation = function () {
        self.basketItemLineMemoErrors.showAllMessages(false);
        if (self.basketItemLineMemoErrors().length > 0) {
            self.basketItemLineMemoErrors.showAllMessages(true);
            return false;
        } else {
            return true;
        }
    }

    self.saveBasketReviewPrices = function (complete) {
        var data = {
            basketId: self.parent.orderFactory.basketId(),
            discounts: []
        };
        ko.utils.arrayForEach(self.discounts(), function (item) {
            data.discounts.push(item.toJS())
        });

        self.processingBusy(true);
        //{
        //    basketItemId: self.addingProductToBasket().basketItemId,
        //    operatorDiscountPercentage: self.discretionaryDiscount(),
        //    discountReasonId: self.discountReason.observable(),
        //    discountReasonComment: self.customDiscountReason.observable(),
        //    budgetManagerCode: self.budgetManager.observable(),
        //    tradePromotionCodeId: self.focPromoCode.observable()
        //};
        console.log('orderProductsDrilldown saveBasketReviewPrices calling with', data);
        $.ajax({
            url: '/api/componentapi/SaveBasketItemReviewPrices',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function () {
                self.processingBusy(false);
                if (typeof complete === 'function')
                    complete();
            },
            error: function (xhr, s, a) {
                self.processingBusy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    }

    self.cancelBasketItem = function () {
        self.processingBusy(true);
        var data = {
            basketItemId: self.addingProductToBasket().basketItemId
        };
        console.log('orderProductsDrilldown cancelBasketItem calling with', data);
        $.ajax({
            url: '/api/componentapi/CancelBasketItem',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {

                self.processingBusy(false);
                $("#allocation-warning-modal").modal('hide');
                $("#back-order-modal").modal('hide');
                $("#order-processing-modal").modal('hide');

                console.log('orderProductsDrilldown cancelBasketItem returned', data);
                if (self.addingProductToBasket())
                    self.addingProductToBasket().reset();
                self.resetProcessingModal();
                //self.addingProductToBasket().validateNow(false);
                //self.addingProductToBasket().quantity((1).toFixed(self.addingProductToBasket().productFilterOptions().QuantityPrecision));

                if (self.parent.orderFactory.phase() == ORDERFACTORY_PHASE_BLANK)
                    self.parent.orderFactory.phase(ORDERFACTORY_PHASE_BASKET);
                //self.reset();

            },
            error: function (xhr, s, a) {
                self.processingBusy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    }

    self.changeStockLocation = function () {
        self.allocationRegionBusy(true);

        var forwardOrderDate = null;

        if (self.addingProductToBasket().dateRequired.observable())
            forwardOrderDate = moment(self.addingProductToBasket().dateRequired.observable()).toISOString();

        var data = {
            basketItemId: self.addingProductToBasket().basketItemId,
            quantity: self.addingProductToBasket().quantity(),
            stockLocationId: self.allocationStockLocation.observable(),
            fulfilmentTypeId: self.addingProductToBasket().fulfilmentOption().FulfilmentTypeID,
            lineReference: self.addingProductToBasket().lineReference.observable(),
            //forwardOrderDate: forwardOrderDate
        };

        console.log('orderProductsDrilldown changeBasketStockLocation calling with', data);

        $.ajax({
            url: '/api/componentapi/ChangeBasketItemStockLocation',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('orderProductsDrillDown changeBasketStockLocation returned', data);
                self.allocationRegionBusy(false);
                if (data.PreAllocationErrorIDs.length == 0) {
                    self.loadAllocation();
                } else {

                    $.showError('Sorry, errored PreAllocationErrorIDs happened. Please email itsupport@designersguild.com quoting PreAllocationErrorIDs: ' + PreAllocationErrorIDs.join(', '));
                    // need to indicate the errored preallocationids
                }
            },
            error: function (xhr, s, a) {
                self.allocationRegionBusy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    }

    self.getBasketItem = function () {

        var forwardOrderDate = null;

        if (self.addingProductToBasket().dateRequired.observable())
            forwardOrderDate = moment(self.addingProductToBasket().dateRequired.observable()).toISOString();

        var data = {
            basketItemId: self.addingProductToBasket().basketItemId,
            quantity: self.addingProductToBasket().quantity(),
            stockLocationId: self.allocationStockLocation.observable(),
            fulfilmentTypeId: self.addingProductToBasket().fulfilmentOption().FulfilmentTypeID,
            lineReference: self.addingProductToBasket().lineReference.observable(),
            forwardOrderDate: forwardOrderDate
        };

        return data;
    }

    self.updateBasketItem = function (onComplete) {
        self.processingBusy(true);

        console.log('orderProductsDrilldown updateBasketItem calling with', data);

        var data = self.getBasketItem();

        $.ajax({
            url: '/api/componentapi/UpdateBasketItem',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('orderProductsDrillDown updateBasketItem returned', data);
                self.processingBusy(false);
                if (typeof onComplete === 'function')
                    onComplete();
            },
            error: function (xhr, s, a) {
                self.processingBusy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    }

    self.areAnyAllocationsBusy = ko.pureComputed(function () {
        var result = false;
        if (self.addingProductAllocationData()) {
            ko.utils.arrayFirst(self.addingProductAllocationData().Allocations, function (x) {
                ko.utils.arrayFirst(x.batches, function (y) {
                    ko.utils.arrayFirst(y.pieces, function (z) {
                        if ((z.hasFocus() == true) || (z.busy() == true)) {
                            result = true;
                        }
                    });
                });
            });
        }
        return result;
    }, self);

    self.anyStandardPoleAllocations = ko.pureComputed(function () {
        if (self.addingProductAllocationData()) {
            return ko.utils.arrayFirst(self.addingProductAllocationData().Allocations, function (x) {
                return ko.utils.arrayFirst(x.batches, function (y) {
                    return ko.utils.arrayFirst(y.pieces, function (z) {
                        if (z.allocationAmount() && z.FabricPoleWidth == 'S') {
                            return true;
                        }
                    });
                });
            });
        }
        return false;
    }, self);

    self.anyStandardPoleAllocations.subscribe(function (newValue) {
        console.log('orderProductsDrilldown anyStandardPoleAllocations subscribe hit', newValue);
        if (newValue) {
            self.packingMethodId(3);
        }
    });

    self.packingMethodId.subscribe(function (newValue) {
        console.log('orderProductsDrilldown packingMethodId subscribe hit', newValue);
    });

    self.anyWideWidthPoleAllocations = ko.pureComputed(function () {
        if (self.addingProductAllocationData()) {
            var result = ko.utils.arrayFirst(self.addingProductAllocationData().Allocations, function (x) {
                return ko.utils.arrayFirst(x.batches, function (y) {
                    return ko.utils.arrayFirst(y.pieces, function (z) {
                        if (z.allocationAmount() && z.FabricPoleWidth == 'W') {
                            return true;
                        }
                    });
                });
            });

            if (self.addingProductToBasket()) {
                if (self.addingProductToBasket().backOrder()) {
                    result = self.wideWidthFabricDefaultPoleWidth() == 'W';
                }
            }

            return result;
        }
        return false;
    }, self);

    self.anyPoleAllocations = ko.pureComputed(function () {
        if (self.anyStandardPoleAllocations() || self.anyWideWidthPoleAllocations())
            return true;
        else
            return false;
    }, self);

    self.anyPoleAllocations.subscribe(function (newValue) {
        if (!newValue) {
            self.packingMethodId(undefined);
        }
    });

    self.areAnyAllocationsBusy.subscribe(function (newValue) {
        console.log('orderProductsDrilldown areAnyAllocationsBusy subscribe hit', newValue);
    });

    self.currentStageId = ko.pureComputed(function () {
        if (self.stageInformation()) {
            return self.stageInformation().currentStage().StepID
        }
    })

    self.minStageId = ko.pureComputed(function () {
        if (self.stageInformation()) {
            return Enumerable.From(self.stageInformation().stages()).Select('$.StepID').Min();
        }
    }, self);

    self.maxStageId = ko.pureComputed(function () {
        if (self.stageInformation()) {
            return Enumerable.From(self.stageInformation().stages()).Select('$.StepID').Max();
        }
    });

    self.generateBatchPieces = function (batch, pieces, loadedCuts) {
        return {
            batch: {
                batchNo: batch,
                sortOrder: Enumerable.From(pieces).Select(function (x) {
                    return x.SortOrder;
                }).Min()
            },
            pieces: Enumerable.From(pieces).Select(function (x) {
                var x = $.extend(x, {
                    basketPreAllocationId: x.BasketPreAllocationID,
                    allocationAmount: ko.observable(x.QuantityAllocated == 0 ? undefined : x.QuantityAllocated).extend({
                        max: {
                            params: x.QuantityAvailable,
                            message: 'Available stock exceeded'
                        }
                    }),
                    reserveBuffer: ko.observable(x.ReserveBuffer),
                    confirmed: ko.observable(x.QuantityAllocated == 0 ? false : true),
                    confirmedAmount: ko.observable(x.QuantityAllocated == 0 ? 0 : x.QuantityAllocated),
                    parent: self
                });

                x.previousAllocationAmount = ko.observable(x.QuantityAllocated == 0 ? undefined : x.QuantityAllocated);

                x.allocationAmount.subscribe(function (oldValue) {
                    console.log('allocationAmount beforeChange subscribe hit. OldValue: ', oldValue);
                    x.previousAllocationAmount(oldValue);
                    x.confirmed(false);
                }, null, 'beforeChange');

                x.allocationAmount.subscribe(function (newValue) {

                    if ($(x.allocationAmount.DOMElement).data('bs.popover')) {
                        $(x.allocationAmount.DOMElement).popover('destroy');
                    }

                    if (newValue == '') {
                        console.log('allocationAmount subscribe SKIPPED; NewValue was empty string and will be reset to undefined');

                        x.readOnlyCut(0);
                    }
                    else {
                        console.log('allocationAmount subscribe hit. NewValue: ', newValue);

                        x.readOnlyCut(+newValue);

                        window.setTimeout(function () {

                            ko.utils.arrayForEach(self.allocatedLengths(), function (length) {
                                length.cuts([]);
                            });

                            x.attemptAllocation();
                        }, 0);
                    }
                });

                x.hasFocus = ko.observable(false);

                x.hasFocus.subscribe(function (newValue) {
                    console.log('orderProductsDrilldown x hasFocus subscribe hit', newValue);
                });

                x.busy = ko.observable(false);

                x.attemptAllocation = function (skipReserveBufferWarning, skipExactMatchWarning) {
                    x.busy(true);

                    if (!x.allocationAmount.isValid()) {

                        $(x.allocationAmount.DOMElement).popover({
                            placement: 'right',
                            title: 'Error',
                            content: 'Insufficient Stock',
                            html: true,
                            trigger: 'manual',
                            template: `<div class="popover popover-error alert-danger" role="tooltip">
                                                                <div class="arrow"></div>
                                                                <div class="popover-inner">
                                                                    <button type="button" class="close" aria-label="Close">
                                                                        <span aria-hidden="true">
                                                                            &times;
                                                                        </span>
                                                                    </button>
                                                                    <div class="popover-content"></div>
                                                                </div>
                                                            </div>`
                        })

                        $(x.allocationAmount.DOMElement).on('shown.bs.popover', function () {
                            var $popover = $(this);
                            $(this).parent().find('.close').click(function (e) {
                                $popover.popover('hide');
                            })
                        });

                        $(x.allocationAmount.DOMElement).popover('show');

                        x.busy(false);

                        return;
                    }

                    skipReserveBufferWarning = typeof skipReserveBufferWarning === 'undefined' ? false : skipReserveBufferWarning;

                    skipExactMatchWarning = typeof skipExactMatchWarning === 'undefined' ? false : skipExactMatchWarning;

                    if (!skipReserveBufferWarning) {
                        if (self.addingProductToBasket().orderTypeId == 3) { // only if this is a reserve...
                            if (+x.allocationAmount() > (+x.QuantityAvailable - 3)) { // where does QuantityAvailable live...

                                if ($(x.allocationAmount.DOMElement).data('bs.popover')) {
                                    $(x.allocationAmount.DOMElement).popover('destroy');
                                }
                                window.setTimeout(function () {
                                    $(x.allocationAmount.DOMElement).popover({
                                        placement: 'right',
                                        title: 'Error',
                                        content: `<h4>Reserve Buffer Warning</h4>
<p>There is insufficient stock to add the optimal 3.0m reserve buffer.</p>
<button class="btn btn-blue" data-bind="click: function() { allocationAmount(undefined); $(allocationAmount.DOMElement).popover('hide'); }">Cancel this allocation and go back and select a larger piece</button>
<button class="btn btn-green" data-bind="click: function() { attemptAllocation(true); $(allocationAmount.DOMElement).popover('hide'); }">Continue with a ${(+x.QuantityAvailable - +x.allocationAmount()).toFixed(self.addingProductToBasket().productFilterOptions().QuantityPrecision)} m buffer (this will trigger a remeasure task)</button>`,
                                        html: true,
                                        trigger: 'manual',
                                        template: `<div class="popover popover-error alert-warning" role="tooltip">
                                                                        <div class="arrow"></div>
                                                                        <div class="popover-inner">
                                                                            <div class="popover-content"></div>
                                                                        </div>
                                                                    </div>`
                                    });

                                    $(x.allocationAmount.DOMElement).popover('show');

                                    ko.cleanNode($('.popover', $(x.allocationAmount.DOMElement).parent()));

                                    ko.applyBindings(ko.contextFor(x.allocationAmount.DOMElement), $('.popover', $(x.allocationAmount.DOMElement).parent())[0]);

                                    x.busy(false);
                                }, 300);

                                return;
                            }
                        }
                    }

                    var data = {
                        basketItemId: self.addingProductToBasket().basketItemId
                    };

                    // how do I know whether I want an insert, update or delete?
                    // weeeell... if... there's no... existing value, then... insert!
                    // if there IS an existing value, then update or delete depending on whether or not you're NULL.
                    // how do I get the existing value...?!

                    // Right... I might now have a previous value to compare to.
                    var action = '';

                    if (x.previousAllocationAmount() == null && x.allocationAmount() != null) {
                        // insert
                        action = 'CreateBasketItemAllocation';
                        data = $.extend(data, {
                            batch: x.Batch,
                            piece: x.Piece,
                            quantity: x.allocationAmount(),
                            ringFencePreAllocationId: x.RingFencePreAllocationID
                        });
                    } else if (x.previousAllocationAmount() != null && x.allocationAmount() == null) {
                        // delete
                        action = 'DeleteBasketItemAllocation';
                        if (x.basketPreAllocationId == null) {
                            x.busy(false);
                            return;
                        }
                        data = $.extend(data, {
                            basketPreAllocationId: x.basketPreAllocationId
                        });
                    } else if (x.previousAllocationAmount() !== x.allocationAmount()) {
                        // update

                        // cannot update if we're missing a confirmation flag.
                        // however, if we're changing an extant allocation then... yeah we need an update.
                        if (!x.confirmed() && x.previousAllocationAmount() == null) {
                            // attempt an insert.
                            action = 'CreateBasketItemAllocation';
                            data = $.extend(data, {
                                batch: x.Batch,
                                piece: x.Piece,
                                quantity: x.allocationAmount(),
                                ringFencePreAllocationId: x.RingFencePreAllocationID
                            });
                        } else {
                            action = 'UpdateBasketItemAllocation';
                            data = $.extend(data, {
                                basketPreAllocationId: x.basketPreAllocationId,
                                quantity: x.allocationAmount()
                            });
                        }
                    } else if (x.previousAllocationAmount() == x.allocationAmount()) {
                        // nothing to do!
                    }

                    // new requirement: for FABRIC - for normal and for forward orders, we need an "Exact Match" warning stating that we cannot
                    // guarantee the accuracy of our stock.  Fabric will have PIECES. Can we rely on this?

                    if (!skipExactMatchWarning) {
                        if (action == 'CreateBasketItemAllocation' || action == 'UpdateBasketItemAllocation') {
                            if (x.Piece != null && x.Piece != "") { // we're fabric
                                if (x.QuantityAvailable == x.allocationAmount()) {
                                    // warn!
                                    if ($(x.allocationAmount.DOMElement).data('bs.popover')) {
                                        $(x.allocationAmount.DOMElement).popover('destroy');
                                    }
                                    window.setTimeout(function () {
                                        $(x.allocationAmount.DOMElement).popover({
                                            placement: 'right',
                                            title: 'Warning',
                                            content: `<h4>Exact Match Warning</h4>
<p>The quantity you have requested exactly matches the quantity we believe to be in stock.</p>
<p>This will require the warehouse to remeasure the piece before cutting and despatching.</p>
<button class="btn btn-blue" data-bind="click: function() { allocationAmount(undefined); $(allocationAmount.DOMElement).popover('hide'); }">Cancel and select a larger piece, if available.</button>
<button class="btn btn-green" data-bind="click: function() { attemptAllocation(true, true); $(allocationAmount.DOMElement).popover('hide'); }">Continue. The warehouse will notify you if the roll is shorter than the quantity shown.</button>`,
                                            html: true,
                                            trigger: 'manual',
                                            template: `<div class="popover popover-error alert-warning" role="tooltip">
                                                                        <div class="arrow"></div>
                                                                        <div class="popover-inner">
                                                                            <div class="popover-content"></div>
                                                                        </div>
                                                                    </div>`
                                        });

                                        $(x.allocationAmount.DOMElement).popover('show');

                                        ko.cleanNode($('.popover', $(x.allocationAmount.DOMElement).parent()));

                                        ko.applyBindings(ko.contextFor(x.allocationAmount.DOMElement), $('.popover', $(x.allocationAmount.DOMElement).parent())[0]);

                                        x.busy(false);
                                    }, 300);

                                    return;
                                }
                            }
                        }
                    }

                    console.log('orderProductsDrilldown calling ' + action + ' with', data);

                    $.ajax({
                        url: '/api/componentapi/' + action,
                        type: 'POST',
                        dataType: 'json',
                        data: data,
                        success: function (data) {

                            console.log('orderProductsDrilldown ' + action + ' returned', data);

                            if (data.PreAllocationErrorID != null) {
                                console.error('PreAllocation ERROR', data.PreAllocationErrorID);
                                x.confirmed(false);
                                $.showError('Sorry', 'PreAllocationErrorID', data.PreAllocationErrorID);
                            } else {
                                switch (action) {
                                    case 'CreateBasketItemAllocation':
                                    case 'UpdateBasketItemAllocation':
                                        x.basketPreAllocationId = data.BasketPreAllocationID;
                                        x.reserveBuffer(data.ReserveBuffer);
                                        x.confirmed(true);
                                        x.confirmedAmount(x.allocationAmount());
                                        break;
                                    case 'DeleteBasketItemAllocation':
                                        x.basketPreAllocationId = undefined;
                                        x.confirmed(false);
                                        x.confirmedAmount(0);
                                        break;
                                    default:
                                        break;
                                }
                            }

                            x.busy(false);
                        },
                        error: function (xhr, s, a) {
                            x.busy(false);
                            x.confirmed(false);
                            console.log(action + ' errored', xhr, s, a);

                            var regexp = /(?:^|\s)System.Exception: "(.*?)"(?:\s|$)/g;

                            var message = xhr.responseJSON.ExceptionMessage;

                            var match = regexp.exec(xhr.responseJSON.ExceptionMessage);

                            if (match != null) {
                                if (match.length == 2) {
                                    message = match[1];
                                }
                            }

                            // Because of what the Ring-Fenced Split is doing in the database,
                            // we can be left in a condition of still holding a now-deleted basketPreAllocationId.
                            // This state must be detected and the deleted basketPreAllocationId cleared.

                            // At the moment the only way to catch that is by string parsing... Not ideal. Not by a long chalk.
                            // What about translations?!

                            // so... if it's an Update that failed... no, no, no.

                            // this failure needs to return useful information, as opposed to just throwing an exception.
                            // it needs to tell me "delete the basketPreAllocationId".

                            // Or... I need to prevent the user from exceeding a ring fence's total available stock.
                            // But we want to permit over allocation of stock. And then warn on it later. Or something.
                            // Bloody hell.

                            // Wait, it looks exactly as though they can't over-allocate.

                            if ($(x.allocationAmount.DOMElement).data('bs.popover')) {
                                $(x.allocationAmount.DOMElement).popover('destroy');
                            }
                            window.setTimeout(function () {
                                $(x.allocationAmount.DOMElement).popover({
                                    placement: 'right',
                                    title: 'Error',
                                    content: message,
                                    html: true,
                                    trigger: 'manual',
                                    template: `<div class="popover popover-error alert-danger" role="tooltip">
                                                                        <div class="arrow"></div>
                                                                        <div class="popover-inner">
                                                                            <button type="button" class="close" aria-label="Close">
                                                                                <span aria-hidden="true">
                                                                                    &times;
                                                                                </span>
                                                                            </button>
                                                                            <div class="popover-content"></div>
                                                                        </div>
                                                                    </div>`
                                });

                                $(x.allocationAmount.DOMElement).on('shown.bs.popover', function () {
                                    var $popover = $(this);
                                    $(this).parent().find('.close').click(function (e) {
                                        $popover.popover('hide');
                                    })
                                });

                                //x.allocationAmount(x.previousAllocationAmount());

                                $(x.allocationAmount.DOMElement).popover('show');

                                window.setTimeout(function () {
                                    self.fetchBasketItemAllocation();
                                    self.fetchBasketItemAllocationStock();
                                }, 3000);

                            }, 300);
                        }
                    });
                }

                // we need... the NEXT CUT's maximum value to always change?
                // what's the ideal scenario here?

                x.readOnlyCut = ko.observable(+x.QuantityAllocated);

                x.readOnlyCut.subscribe(function (oldValue) {
                    console.log('readOnlyCut beforeChange subscribe hit', oldValue);
                }, 'beforeChange');

                x.readOnlyCut.subscribe(function (newValue) {
                    console.log('readOnlyCut subscribe hit', newValue, x);
                    if (newValue < 0)
                        x.readOnlyCut(0);
                });

                x.cutMaxValue = self.maxFoldLength();

                if (x.cutMaxValue == 0 && self.shipInABoxOverride())
                    x.cutMaxValue = 10;

                if (self.addingProductToBasket().backOrder()) {
                    if (self.addingProductToBasket().record.MaxLengthPerPole) {
                        if (+self.addingProductToBasket().quantity() > self.addingProductToBasket().record.MaxLengthPerPole) {
                            x.cutMaxValue = self.addingProductToBasket().record.MaxLengthPerPole;
                        }
                    }
                }

                var theseCuts = Enumerable.From(loadedCuts).Where(function (q) {
                    return (q.batch == x.Batch) && (q.piece == x.Piece)
                }).ToArray();

                x.remainingToCut = ko.pureComputed(function () {
                    return +x.confirmedAmount() - (Math.round(Enumerable.From(x.cuts()).Select(function (c) {
                        if (c.confirmed())
                            return +c.cutLength();
                        else
                            return 0;
                    }).Sum() * 10) / 10);
                }, x);

                x.cuts = ko.observableArray([]).extend({
                    validation: {
                        validator: function (arr, otherVal) {

                            if (self.addingProductToBasket()) {
                                if (self.addingProductToBasket().backOrder()) {
                                    if (self.addingProductToBasket().record.MaxLengthPerPole) {
                                        if (+self.addingProductToBasket().quantity() > self.addingProductToBasket().record.MaxLengthPerPole) {
                                            return x.remainingToCut() == 0;
                                        }
                                    }
                                }
                            }

                            if (self.packingMethodId() == 1) { //pole

                                if (self.addingProductToBasket()) {
                                    if (self.addingProductToBasket().backOrder()) {
                                        if (self.addingProductToBasket().record.MaxLengthPerPole) {
                                            if (+self.addingProductToBasket().quantity() > self.addingProductToBasket().record.MaxLengthPerPole) {
                                                return x.remainingToCut() == 0;
                                            }
                                        }
                                    }
                                }

                                if (arr.length == 0)
                                    return true;
                            }

                            if (self.packingMethodId() == 2) { //box
                                var maxFold = 0;
                                if (self.addingProductToBasket())
                                    maxFold = self.maxFoldLength();
                                if (maxFold == 0)
                                    maxFold = 10
                                if ((arr.length == 0) && (+x.confirmedAmount() <= maxFold))
                                    return true;
                            }

                            if (x.confirmedAmount()) {
                                return (Math.round(Enumerable.From(arr).Select(function (le) {
                                    return +le.cutLength()
                                }).Sum() * 10) / 10) == +x.confirmedAmount();
                            }

                            return false;
                        },
                        params: false,
                        message: 'Incomplete'
                    }
                });

                x.cuts.subscribe(function (newValues) {
                    console.log('cuts changed', newValues);
                }, self, 'arrayChange');

                x.addCut = function (val, confirmed) {
                    confirmed = typeof confirmed === 'undefined' ? false : confirmed;
                    var newCut = {
                        cutLength: ko.observable(val).extend({
                            numberFormatted: {
                                digits: self.addingProductToBasket().productFilterOptions().QuantityPrecision,
                                currency: {
                                    FormattingCulture: 'en-GB'
                                },
                                minValue: 0,
                                maxValue: x.cutMaxValue
                            }
                        }),
                        confirmed: ko.observable(confirmed),
                        cutNumber: x.cuts().length + 1
                    }
                    newCut.cutLengthParams = {
                        label: 'Cut',
                        observable: newCut.cutLength,
                        useNativeValidation: false,
                        decorateInputElement: true,
                        insertValidationMessages: false,
                        showClear: false
                    };

                    newCut.cutLength.beforeChangeValue = 0;

                    newCut.cutLength.subscribe(function (newValue) {
                        if (newValue) {
                            newValue = +newValue;

                            if (self.addingProductToBasket().record.WideWidth && self.packingMethodId() == 2) {
                                var maxFold = self.maxFoldLength();
                                if (maxFold == 0)
                                    maxFold = 10
                                if (newValue > maxFold) {
                                    newCut.cutLength(maxFold);
                                    newCut.cutLength.beforeChangeValue = maxFold;
                                    return;
                                }
                            }

                            if (newValue < self.addingProductToBasket().productFilterOptions().QuantityMinimum) {
                                newCut.cutLength(self.addingProductToBasket().productFilterOptions().QuantityMinimum);
                                newCut.cutLength.beforeChangeValue = self.addingProductToBasket().productFilterOptions().QuantityMinimum;
                                return;
                            }

                            if (newValue > x.remainingToCut()) {
                                newCut.cutLength(x.remainingToCut());
                                return;
                            }

                            if (newValue <= x.readOnlyCut()) {
                                newCut.confirmed(true);

                                //x.readOnlyCut(x.readOnlyCut() + (+newCut.cutLength.beforeChangeValue - +newValue));
                            } else {
                                newCut.cutLength(x.readOnlyCut())
                            }
                        } else {
                            x.readOnlyCut(Math.round(Number(x.readOnlyCut()) + Number(newCut.cutLength.beforeChangeValue) / 10) * 10);
                        }
                    });

                    newCut.cutLength.subscribe(function (oldValue) {
                        newCut.confirmed(false);
                        newCut.cutLength.beforeChangeValue = oldValue || 0;
                    }, x, "beforeChange");

                    console.log('adding cut', newCut);

                    x.cuts.push(newCut);
                };

                x.removeCut = function (cut) {
                    if (x.readOnlyCut() && cut.cutLength()) {
                        x.readOnlyCut(Math.round(Number(x.readOnlyCut()) + Number(cut.cutLength()) / 10) * 10);
                    }
                    x.cuts.remove(cut);
                };

                // because the observable array was apparently not cooked complete by the time
                // I need to add loaded cuts... strange but apparently true.
                window.setTimeout(function () {
                    for (var i = 0; i < theseCuts.length; i++) {
                        x.addCut(theseCuts[i].cut, true);
                    }
                }, 0);

                return x;

            }).OrderBy(function (x) {
                return x.SortOrder
            }).ToArray()
        };
    }

    self.deleteCutPieceBreakdown = function () {
        ko.utils.arrayForEach(self.allocationCutPieceBreakdown(), function (acpb) {
            ko.utils.arrayForEach(acpb.pieces, function (p) {
                p.cuts.removeAll();
            })
        });
        $('#cut-breakdown-modal').modal('hide');
    }

    self.fetchBasketItemAllocation = function () {
        return new Promise(function (resolve, reject) {
            var data = {
                tradeAccountId: self.parent.orderFactory.tradeAccount().TradeAccountID,
                basketItemId: self.addingProductToBasket().basketItemId
            };

            console.log('orderProductsDrilldown fetchBasketItemAllocation calling with', data);

            self.allocationRegionBusy(true);

            $.ajax({
                url: '/api/componentapi/FetchBasketItemAllocation',
                type: 'POST',
                dataType: 'json',
                data: data,
                cache: false,
                success: function (data) {
                    console.log('orderProductsDrilldown fetchBasketItemAllocation returned', data);

                    /*  data is:
                     * 
                     *  Allocations (m)ultiple
                     *      
                     *  Stock Locations (m)
                     *  
                     *  Allocation Notices (s)ingle
                     *  
                     *  Basket Item Details (s)
                     *  
                     *  Wide Width Fabric Controls (m)
                     * 
                     */

                    //#region Allocation Notices

                    self.generalAllocationMessage(data.AllocationNotices.GeneralAllocationsMessage);

                    self.ringFenceWarning(data.AllocationNotices.DisableRingFenceAllocationsMessage);

                    self.freeStockWarning(data.AllocationNotices.DisableFreeStockAllocationsMessage);

                    self.allocationRequest(data.AllocationNotices.AllocationRequest);

                    self.reserveBuffer(data.AllocationNotices.ReserveBuffer);

                    self.preventBackOrdersWarning(data.AllocationNotices.PreventBackOrdersMessage);

                    //#endregion

                    //#region Allocations

                    var loadedCuts = JSON.parse(data.BasketItemDetails.CutLengthJSON);

                    data.Allocations = Enumerable.From(data.Allocations).GroupBy(
                        function (result) {
                            var data = {
                                source: result.Source
                            }

                            switch (data.source) {
                                case 'Ring Fenced':
                                    data.message = self.ringFenceWarning()
                                    break;
                                case 'Available Now':
                                    data.message = self.freeStockWarning()
                                    break;
                            }

                            data.sortOrder = result.SortOrder;

                            return data
                        },
                        function (batchGrouping) {
                            return batchGrouping
                        },
                        function (batchGrouping, batches) {
                            return {
                                batchGrouping: batchGrouping,
                                batches: Enumerable.From(batches).GroupBy(
                                    function (result) {
                                        return result.Batch
                                    },
                                    function (piece) {
                                        return piece
                                    },
                                    function (batch, pieces) {
                                        return self.generateBatchPieces(batch, pieces, loadedCuts);
                                    }, function (batch) {
                                        return batch;
                                    }).OrderBy(function (batchGrouping) {
                                        return batchGrouping.sortOrder
                                    }).ToArray()
                            }
                        },
                        function (batchGrouping) {
                            return batchGrouping.source
                        }).ToArray();

                    self.addingProductAllocationData(data);

                    //#endregion

                    //#region Stock Locations

                    self.availableStockLocations(data.StockLocations);

                    if (self.allocationStockLocation.observable()) {
                        // noop - if we already have a value in here, it's because it has been manually set by actively selecting to change
                        // the stock location.
                    } else {
                        window.setTimeout(function () {
                            // I know, yuck, but... the MDCSelect to which the availableStockLocations are the options
                            // is instantiated before the options are actually present...
                            self.allocationStockLocation.skipSubscription(true);
                            window.setTimeout(function () {
                                self.allocationStockLocation.observable(self.addingProductToBasket().fulfilmentOption().StockLocationID);
                            }, 0);
                        }, 0);
                    }

                    //#endregion

                    //#region BasketItemDetails Details

                    // data.BasketItemDetails.CutLengthJSON already utilised above in Allocations region

                    self.maxFoldLength(data.BasketItemDetails.MaxFoldLength);

                    self.reserveBatchCuttingIndicator(data.BasketItemDetails.BatchCuttingIndicator);

                    self.supplierAvailabilityMessage(data.BasketItemDetails.SupplierAvailabilityMessage);

                    self.wideWidthFabric(data.BasketItemDetails.WideWidthFabric);

                    self.wideWidthFabricDefaultPoleWidth(data.BasketItemDetails.DefaultPoleWidth);

                    //#endregion

                    //#region Pole Length Constraints

                    self.wideWidthFabricControls(data.WideWidthFabricControls);

                    //#endregion


                    // need to load the packingMethodId from the appropriate WideWidthControls record
                    // which means I need to determine the activeWideWidthControl before I can load the PackingMethodID from it

                    // which probably means I need to let the event loop chug through

                    self.allocationRegionBusy(false);

                    resolve();
                },
                error: function (xhr, s, a) {
                    self.allocationRegionBusy(false);
                    $.ajaxSettings.error(xhr, s, a);
                    reject();
                }
            });

            /*
             }).GroupBy(function(result) {
                    return {
                        stockLocationId: result.StockLocationID,
                        code: result.StockLocationCode,
                        name: result.StockLocationName,
                        isDefault: result.Default
                    }
                }, function (stockLocation) {
                    return stockLocation
                }, function(key, stockLocationGrouping) {
                    return {
                         key,
                        fulfilmentOptions: stockLocationGrouping.source
                    }
                }, function (stockLocation) {
                    return stockLocation.stockLocationId
                }).ToArray();
        
                Right... we want to group these records by Batch,
                sorted within their grouping by quantity available descending
        
                We also want to display the batches descending by total available stock...
            
             */
        });
    }

    self.fetchBasketItemReviewPrices = function () {
        self.processingBusy(true);
        window.setTimeout(function () {
            var data = {
                basketItemId: self.addingProductToBasket().basketItemId
            }
            data = $.extend(data, {
                discounts: $.map(self.discounts(), function (d) {
                    return d.toJS()
                })
            });
            console.log('orderProductsDrilldown fetchBasketItemReviewPrices calling with', data);
            $.ajax({
                url: '/api/componentapi/BasketItemReviewPrices',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('orderProductsDrilldown fetchBasketItemReviewPrices returned', data);

                    var discoData = [];

                    ko.utils.arrayForEach(data.SystemDiscounts, function (item) {
                        var thisDisco = $.extend(item, {});

                        thisDisco.discounter = new discounterFactory({
                            currentDiscountPercentage: thisDisco.OperatorDiscountPercentage,
                            currentDiscountMonetary: thisDisco.OperatorEnteredChargeEx,
                            discountReasonId: thisDisco.DiscountReasonID,
                            discountReasonComment: thisDisco.DiscountReasonComment,
                            tradePromotionCodeId: thisDisco.TradePromotionCodeID,
                            currency: self.addingProductToBasket().record.Currency,
                            originalPriceEx: thisDisco.PreOperator_Value,
                            discountReasons: ko.observableArray(data.DiscountReasons),
                            focPromoCodes: data.FOCPromotionCodes,
                            budgetManagers: ko.observableArray(Enumerable.From(data.FOCPromotionCodes).GroupBy(
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
                            afterLoad: function () {
                                thisDisco.finalPriceComputer = ko.pureComputed(function () {
                                    return {
                                        p: thisDisco.discounter.percentage.observable(),
                                        m: thisDisco.discounter.monetary.observable()
                                    }
                                });

                                thisDisco.finalPriceComputer.subscribe(function (newValue) {
                                    self.processingBusy(true);
                                    var data = {
                                        discounts: [thisDisco.toJS()]
                                    }
                                    console.log('thisDisco finalPriceComputer calling with', data);
                                    $.ajax({
                                        url: '/api/componentapi/BasketItemReviewPricesCalculateFinalPrice',
                                        type: 'POST',
                                        dataType: 'json',
                                        data: data,
                                        success: function (data) {
                                            console.log('thisDisco finalPriceComputer returned', data);
                                            $.extend(thisDisco, data);
                                            thisDisco.finalPriceExplanation(thisDisco.FinalPrice_Explanation);
                                            thisDisco.finalPrice(thisDisco.FinalPrice_Value);
                                            thisDisco.listPriceStrike(thisDisco.ListPrice_Strikethrough);
                                            thisDisco.contractPriceStrike(thisDisco.ContractPrice_Strikethrough);
                                            thisDisco.contractDiscountStrike(thisDisco.ContractDiscount_Strikethrough);
                                            thisDisco.promotionalDiscountStrike(thisDisco.PromotionalDiscount_Strikethrough);
                                            thisDisco.clearanceDiscoStrike(thisDisco.ClearanceDiscount_Strikethrough);

                                            self.processingBusy(false);
                                        },
                                        error: function (xhr, s, a) {
                                            $.ajaxSettings.error(xhr, s, a);
                                            self.processingBusy(false);
                                        }
                                    })
                                });
                            },
                            appendTo: '#order-processing-modal'
                        });

                        thisDisco.finalPrice = ko.observable(thisDisco.FinalPrice_Value);

                        thisDisco.finalPriceExplanation = ko.observable(thisDisco.FinalPrice_Explanation);

                        thisDisco.listPriceStrike = ko.observable(thisDisco.ListPrice_Strikethrough);
                        thisDisco.contractPriceStrike = ko.observable(thisDisco.ContractPrice_Strikethrough);
                        thisDisco.contractDiscountStrike = ko.observable(thisDisco.ContractDiscount_Strikethrough);
                        thisDisco.promotionalDiscountStrike = ko.observable(thisDisco.PromotionalDiscount_Strikethrough);
                        thisDisco.clearanceDiscoStrike = ko.observable(thisDisco.ClearanceDiscount_Strikethrough);

                        thisDisco.basketItemFinalPricePreDisco = ko.pureComputed(function () {
                            return thisDisco.OriginalPriceEx - (
                                (thisDisco.ContractDiscountAmountEx || 0) +
                                (thisDisco.PromotionalDiscountAmountEx || 0) +
                                (thisDisco.ClearanceDiscountAmountEx || 0)
                            )
                        }, thisDisco);

                        thisDisco.discretionaryDiscountAmount = ko.pureComputed({
                            read: function () {
                                if (thisDisco.discretionaryDiscount.observable()) {
                                    return thisDisco.basketItemFinalPricePreDisco() * (thisDisco.discounter.percentage.observable() / 100);
                                } else {
                                    return 0;
                                }
                            }
                        }, self);

                        thisDisco.totalDiscountPercentage = ko.pureComputed(function () {
                            return formatPercentage(
                                (thisDisco.ContractDiscountPercentage || 0) +
                                (thisDisco.PromotionalDiscountPercentage || 0) +
                                (thisDisco.ClearanceDiscountPercentage || 0) +
                                (thisDisco.discounter.percentage.observable() ? (+thisDisco.discounter.percentage.observable() / 100) : 0)
                                , 0, 'en-GB');
                        }, thisDisco);

                        thisDisco.totalDiscountValue = ko.pureComputed(function () {
                            return (thisDisco.ContractDiscountAmountEx || 0) +
                                (thisDisco.PromotionalDiscountAmountEx || 0) +
                                (thisDisco.ClearanceDiscountAmountEx || 0) +
                                (thisDisco.discounter.discountAmount() || 0);
                        }, thisDisco);

                        thisDisco.basketItemFinalPrice = ko.pureComputed(function () {
                            return thisDisco.OriginalPriceEx - (
                                (thisDisco.ContractDiscountAmountEx || 0) +
                                (thisDisco.PromotionalDiscountAmountEx || 0) +
                                (thisDisco.ClearanceDiscountAmountEx || 0)
                            ) - thisDisco.discounter.discountAmount()
                        }, thisDisco);

                        thisDisco.toJS = function () {
                            return $.extend({
                                basketItemId: thisDisco.BasketItemID
                            }, thisDisco.discounter.toJS());
                        }

                        discoData.push(thisDisco);
                    });

                    self.discounts(discoData);

                    window.setTimeout(function () {
                        ko.utils.arrayForEach(self.discounts(), function (item) {
                            item.discounter.load();
                        });
                    }, 0);

                    self.processingBusy(false);
                },
                error: function (xhr, s, a) {
                    self.processingBusy(false);
                    $.ajaxSettings.error(xhr, s, a);
                }
            });
        }, 300);
    }

    self.fetchBasketItemAllocationStock = function () {
        return new Promise(function (resolve, reject) {

            self.showAllocationStockRefreshButton(false);

            self.allocationStockRegionBusy(true);

            var data = {
                tradeAccountId: self.parent.orderFactory.tradeAccount().TradeAccountID,
                basketItemId: self.addingProductToBasket().basketItemId,
                productId: self.addingProductToBasket().record.ProductID
            };

            console.log('orderProductsDrilldown fetchBasketItemAllocationStock calling with', data);

            var deferred = $.ajax({
                url: '/api/componentapi/FetchBasketItemAllocationStock',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {

                    console.log('orderProductsDrilldown fetchBasketItemAllocationStock returned', data);

                    data = Enumerable.From(data).GroupBy(function (piece) {
                        return {
                            stockLocationId: piece.StockLocationID,
                            stockLocationCode: piece.StockLocationCode,
                            stockLocationName: piece.StockLocationName,
                            sortOrder: piece.StockLocationSortOrder,
                            stockLocationLabel: `${piece.StockLocationCode}~${piece.StockLocationName}`
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
                                    units: self.addingProductToBasket().record.Units
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
                                                return $.extend(x, {
                                                    AvailableNowDisplay: ko.pureComputed(function () {
                                                        if (this.AvailableNowQuantity) {
                                                            return formatNumber(this.AvailableNowQuantity, self.addingProductToBasket().productFilterOptions().QuantityPrecision, 'en-GB');
                                                        }
                                                    }, x),
                                                    BulkDisplay: ko.pureComputed(function () {
                                                        if (this.BulkQuantity) {
                                                            return formatNumber(this.BulkQuantity, self.addingProductToBasket().productFilterOptions().QuantityPrecision, 'en-GB');
                                                        }
                                                    }, x),
                                                    WaitingDisplay: ko.pureComputed(function () {
                                                        if (this.WaitingToBePutAwayQuantity) {
                                                            return formatNumber(this.WaitingToBePutAwayQuantity, self.addingProductToBasket().productFilterOptions().QuantityPrecision, 'en-GB');
                                                        }
                                                    }, x),
                                                    OnReserveDisplay: ko.pureComputed(function () {
                                                        if (this.OnReserveQuantity) {
                                                            return formatNumber(this.OnReserveQuantity, self.addingProductToBasket().productFilterOptions().QuantityPrecision, 'en-GB');
                                                        }
                                                    }, x),
                                                    RingFencedDisplay: ko.pureComputed(function () {
                                                        if (this.OtherCustomerRingFencedQuantity) {
                                                            return formatNumber(this.OtherCustomerRingFencedQuantity, self.addingProductToBasket().productFilterOptions().QuantityPrecision, 'en-GB');
                                                        }
                                                    }, x),
                                                    TotalDisplay: ko.pureComputed(function () {
                                                        if ((this.AvailableNowQuantity + this.OnReserveQuantity + this.ThisCustomerRingFencedQuantity + this.BulkQuantity) > 0) {
                                                            return formatNumber(this.AvailableNowQuantity + this.OnReserveQuantity + this.ThisCustomerRingFencedQuantity + this.BulkQuantity, self.addingProductToBasket().productFilterOptions().QuantityPrecision, 'en-GB');
                                                        }
                                                    }, x),
                                                    DueInDisplay: ko.pureComputed(function () {
                                                        var result = '';
                                                        if (this.DueInQuantity) {
                                                            result = formatNumber(this.DueInQuantity, self.addingProductToBasket().productFilterOptions().QuantityPrecision, 'en-GB');
                                                        }
                                                        if (this.DueInMessage) {
                                                            if (result == '')
                                                                result = this.DueInMessage
                                                            else
                                                                result = result + ' ' + this.DueInMessage
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
                            return stockLocation.stockLocationLabel
                        }).OrderBy(function (grouping) {
                            return grouping.stockLocation.sortOrder;
                        }).ToArray();

                    ko.utils.arrayForEach(data, function (item) {

                        item.stockLocation.totalQuantity = ko.pureComputed(function () {
                            return (this.availableNowTotal + this.bulkTotal + this.onReserveTotal + this.waitingTotal);
                        }, item.stockLocation);

                        item.stockLocation.totalIncludingDue = ko.pureComputed(function () {
                            return (this.availableNowTotal + this.bulkTotal + this.dueInTotal + this.onReserveTotal + this.waitingTotal);
                        }, item.stockLocation);

                        //item.stockLocation.totalQuantity = Enumerable.From(item.batches).Select(function (x) {
                        //    return Enumerable.From(x.pieces).Select(function (y) {
                        //        return y.AvailableNowQuantity + y.OnReserveQuantity + y.ThisCustomerRingFencedQuantity
                        //    }).Sum()
                        //}).Sum().toFixed(self.addingProductToBasket().productFilterOptions().QuantityPrecision);
                        //item.stockLocation.totalIncludingDue = Enumerable.From(item.batches).Select(function (x) {
                        //    return Enumerable.From(x.pieces).Select(function (y) {
                        //        return y.AvailableNowQuantity + y.OnReserveQuantity + y.ThisCustomerRingFencedQuantity + y.DueInQuantity
                        //    }).Sum()
                        //}).Sum()

                    });

                    self.addingProductAllocationStockData(data);

                    self.allocationStockRegionBusy(false);

                    resolve();
                },
                error: function (xhr, s, a) {
                    //$.showError(xhr, s, a);
                    $.info('Sorry', 'There was a temporary problem retrieving stock information for this product. Please wait a moment and click the "Refresh Stock" button.');
                    self.showAllocationStockRefreshButton(true);
                    self.allocationStockRegionBusy(false);
                    reject();
                }
            });
        });
    }

    self.fetchBasketItemMemos = function () {

        self.processingBusy(true);

        var data = {
            basketItemId: self.addingProductToBasket().basketItemId
        };

        console.log('orderProductsDrilldown fetchBasketItemMemos calling with', data);

        $.ajax({
            url: '/api/componentapi/fetchBasketItemMemos',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('orderProductsDrilldown fetchBasketItemMemos returned', data);
                self.documentTypes(data.DocumentTypes);
                self.lineMemos([]);
                if (data.LineMemos.length == 0) {
                    self.addLineMemo();
                }
                data.LineMemos.forEach(function (item) {

                    var m = item.LineMemo.replace(/\\n /g, '\n');
                    m = m.replace(/\\n/g, '\n');

                    var memo = {
                        label: 'Line Memos',
                        basketItemLineMemoId: item.BasketItemLineMemoID,
                        lineMemoTypeId: item.LineMemoTypeID,
                        observable: ko.observable(m),
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
                        rows: item.ReadOnly ? item.LineMemoTypeID == 13 ? 20 : 6 : item.LineMemoTypeID == 13 ? 20 : 10,
                        selectedDocumentTypes: ko.observableArray(Enumerable.From(data.DocumentTypeCodes).Where(function (x) {
                            return (x.BasketItemLineMemoID == item.BasketItemLineMemoID) &&
                                (x.LineMemoTypeID == item.LineMemoTypeID)
                        }).Select(function (x) {
                            return x.DocumentTypeCode
                        }).ToArray())
                    }
                    memo.observable.extend({
                        required: {
                            params: true,
                            onlyIf: function () {
                                return memo.selectedDocumentTypes().length
                            },
                            message: 'This memo is empty.'
                        }
                    })
                    memo.selectedDocumentTypes.extend({
                        required: {
                            params: true,
                            onlyIf: function () {
                                return memo.observable()
                            },
                            message: 'Please select at least one document type'
                        }
                    })
                    memo.selectedDocumentTypes.subscribe(function (changes) {

                        if (changes[0].status == 'added') {
                            if (changes[0].value == 'A') {
                                memo.selectedDocumentTypes(['A']);
                            } else {
                                if (memo.selectedDocumentTypes().indexOf('A') > -1) {
                                    memo.selectedDocumentTypes.remove('A');
                                }
                            }
                        }

                        //console.log(changes)
                        //if (newValues.indexOf('A') > -1) {
                        //    if (newValues.length > 1) {
                        //        memo.selectedDocumentTypes(['A']);
                        //    }
                        //}
                    }, memo, 'arrayChange');
                    self.lineMemos.push(memo);
                });
                self.processingBusy(false);
                //self.addingProductToBasket().lineMemo.observable(data.LineMemo);
            },
            error: function (xhr, s, a) {
                self.processingBusy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    }

    self.saveBasketItemMemos = function (onComplete) {
        self.busy(true);

        // how the hell do I handle the having or not having of IDs?!?

        var lineMemos = [];

        if (self.lineMemos().length) {

            var nextBasketItemLineMemoId = null;

            if (Enumerable.From(self.lineMemos()).Where(function (x) {
                return x.readOnly == false
            }).Count() > 0) {
                nextBasketItemLineMemoId = Enumerable.From(self.lineMemos()).Where(function (x) {
                    return x.readOnly == false
                }).Select(function (x) {
                    return x.basketItemLineMemoId || 0
                }).Max() || 1;
            }

            self.lineMemos().forEach(function (item) {
                if (item.readOnly)
                    return;
                // we want to ignore empty memos with no document types selected
                if (item.observable() !== null && item.observable() !== '' && item.selectedDocumentTypes().length > 0) {
                    if (item.basketItemLineMemoId == null) {
                        item.basketItemLineMemoId = ++nextBasketItemLineMemoId;
                    }
                    lineMemos.push({
                        basketItemLineMemoId: item.basketItemLineMemoId,
                        lineMemo: item.observable(),
                        selectedDocumentTypes: item.selectedDocumentTypes()
                    })
                }
            });
        }

        var data = {
            basketItemId: self.addingProductToBasket().basketItemId,
            lineMemos: lineMemos
        };

        console.log('orderProductsDrilldown saveBasketItemMemos calling with', data);

        $.ajax({
            url: '/api/componentapi/saveBasketItemMemos',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                self.busy(false);
                if (typeof onComplete === 'function') {
                    onComplete();
                }
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.ajaxSettings.error(xhr, s, a);
            }
        });
    }

    self.emailPatternBookDiscoInfo = function () {
        self.validatePatternBookNow(true);
        if (self.patternBookErrors().length) {
            self.patternBookErrors.showAllMessages(true);
            return;
        } else {
            self.sendEmailBusy(true);

            var discoItems = Enumerable.From(self.patternBookContents().products).Where(function (x) {
                return x.record.Status == 'L' || x.record.Status == 'D'
            }).Select(function (x) {
                var result = $.extend({}, x.record);
                delete result.StockData;
                delete result.Currency;
                return result;
            }).ToArray();

            var data = {
                recipient: self.patternBookEmail(),
                patternBookCode: self.parent.orderFactory.drilldownData().record.Code,
                patternBookName: self.parent.orderFactory.drilldownData().record.BasketName,
                limitedDiscoItems: discoItems
            };

            console.log('emailPatternBookDiscoInfo calling with', data);

            $.ajax({
                url: '/api/componentapi/sendPatternBookDiscoEmail',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('emailPatternBookInfo returned', data);
                    self.validateNow(false);
                    window.setTimeout(function () {
                        self.lastSentTo(self.patternBookEmail());
                        self.showLastSentTo(true);
                        self.sendEmailBusy(false);
                        window.setTimeout(function () {
                            self.patternBookErrors.showAllMessages(false);
                        }, 0);
                        window.setTimeout(function () {
                            self.showLastSentTo(false);
                        }, 5000);
                    }, 400);
                },
                error: function (xhr, s, a) {
                    self.validatePatternBookNow(false);
                    self.sendEmailBusy(false);
                    $.ajaxSettings.error(xhr, s, a);
                }
            });
        }
    }

    self.emailCurrentPatternBookInfo = function (statusArray) {
        self.validatePatternBookNow(true);
        if (self.patternBookErrors().length) {
            self.patternBookErrors.showAllMessages(true);
            return;
        } else {
            self.sendEmailBusy(true);

            var currentItems = Enumerable.From(self.patternBookContents().products).Where(function (x) {
                return x.record.Status == 'C'
            }).Select(function (x) {
                var result = $.extend({}, x.record);
                delete result.StockData;
                delete result.Currency;
                return result;
            }).ToArray();

            var data = {
                recipient: self.patternBookEmail(),
                patternBookCode: self.parent.orderFactory.drilldownData().record.Code,
                patternBookName: self.parent.orderFactory.drilldownData().record.BasketName,
                currentItems: currentItems
            };

            console.log('emailPatternBookCurrentInfo calling with', data);

            $.ajax({
                url: '/api/componentapi/sendPatternBookCurrentEmail',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('emailPatternBookCurrentInfo returned', data);
                    self.validateNow(false);
                    window.setTimeout(function () {
                        self.lastSentTo(self.patternBookEmail());
                        self.showLastSentTo(true);
                        self.sendEmailBusy(false);
                        window.setTimeout(function () {
                            self.patternBookErrors.showAllMessages(false);
                        }, 0);
                        window.setTimeout(function () {
                            self.showLastSentTo(false);
                        }, 5000);
                    }, 400);
                },
                error: function (xhr, s, a) {
                    self.validatePatternBookNow(false);
                    self.sendEmailBusy(false);
                    $.ajaxSettings.error(xhr, s, a);
                }
            });
        }
    }

    self.emailImage = function () {
        //$.info('Sorry', 'Temporarily deprecated');
        self.validateNow(true);
        if (self.errors().length) {
            self.errors.showAllMessages(true);
            return;
        } else {
            self.sendEmailBusy(true);

            var product = $.extend({}, self.largeImageProduct().record);

            product.ImageID = self.largeImageId();

            switch (product.Status) {
                case 'C':
                    product.StockStatus = 'Current';
                    break;
                case 'D':
                    product.StockStatus = 'Discontinued';
                    break;
                case 'L':
                case 'Y':
                    product.StockStatus = 'Limited';
                    break;
                default:
                    product.StockStatus = 'Unknown';
                    break;
            }
            delete product.StockData;
            delete product.Currency;

            var data = {
                tradeAccountId: self.parent.orderFactory.tradeAccount().TradeAccountID,
                recipient: self.email(),
                product: product
            };

            console.log('calling sendProductInfoEmail with', data);

            $.ajax({
                url: '/api/componentapi/sendProductInfoEmail',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    self.validateNow(false);
                    window.setTimeout(function () {
                        self.lastSentTo(self.email());
                        self.showLastSentTo(true);
                        self.sendEmailBusy(false);
                        window.setTimeout(function () {
                            self.errors.showAllMessages(false);
                        }, 0);
                        window.setTimeout(function () {
                            self.showLastSentTo(false);
                        }, 5000);
                    }, 400);
                },
                error: function (xhr, s, a) {
                    self.validateNow(false);
                    self.sendEmailBusy(false);
                    $.ajaxSettings.error(xhr, s, a);
                }
            });
        }
    }

    self.resetProcessingModal = function () {
        console.log('orderProductsDrilldown resetProcessingModal called');
        self.availableTreatments([]);
        self.productTestsPassed([]);

        self.treatmentNotes([]);
        self.treatmentNoteValidateNow(false);
        self.existingQualityTreatments(undefined);
        self.expressTreatment(undefined);
        self.selectedTreatments([]);

        self.treatmentMandates([]);
        self.treatmentMandateBypass(false);
        self.treatmentMandateViolations([]);

        //self.discretionaryDiscount(undefined);
        //self.discountReason.observable(undefined); // important that this comes before discountReasons([]) -- see self.customDiscountReasonRequired 
        //self.discountReasons([]);
        self.discounts([]);
        self.lineMemos([]);
        self.stageInformation().currentStage({ StepID: 0 });
        self.stageInformation().stages([{
            StepID: 0,
            SortOrder: 1,
            Name: 'Loading',
            Mandatory: false,
            ToolTip: null
        }]);
        if (self.addingProductToBasket())
            self.addingProductToBasket().backOrder(false);
        self.addingProductToBasket(undefined);
        self.addingProductAllocationData(undefined);
        self.addingProductAllocationStockData(undefined);
        self.allocationRegionBusy(false);
        self.allocationStockRegionBusy(false);
        self.stockTableRegionBusy(false);
        self.allocationStockLocation.skipSubscription(true);
        self.allocationStockLocation.observable(undefined);
        self.availableStockLocations([]);
        self.processingBusy(false);

        self.allocationWarningActionButtons[0].html('Go back and amend the allocation');
        self.allocationWarningActionButtons[0].click = function () {
            $("#allocation-warning-modal").modal('hide');
        }
        self.allocationWarningActionButtons[1].click = function () {
            self.partBackOrderBasketLine(self.totalAllocatedStockInSelectedLocation(), self.remainingToAllocate());
        }
        self.allocationWarningActionButtons[2].click = function () {
            self.addingProductToBasket().quantity(self.totalAllocatedStockInSelectedLocation());

            self.updateBasketItem(self.allocationValidation);

            $("#allocation-warning-modal").modal('hide');
        }
        self.allocationWarningActionButtons[3].click = function () {
            self.skipAllocationAndBackOrder(false);
        }
        self.allocationWarningActionButtons[4].click = function () {
            self.addingProductToBasket().quantity(
                +self.addingProductToBasket().quantity() + -(+self.remainingToAllocate())
            );

            self.updateBasketItem(self.allocationValidation);

            $("#allocation-warning-modal").modal('hide');
        }
        self.allocationWarningActionButtons[5].click = function () {
            self.cancelAddingProductToBasket();
        }
    }

    self.reset = function () {
        console.log('orderProductsDrilldown reset called');

        if (self.searchResult())
            self.searchResult().reset();

        self.searchResult(undefined);

        self.visibleImages(4);

        self.wideWidthFabricControls([]);
        self.maxFoldLength(undefined);
        self.wideWidthFabricDefaultPoleWidth(undefined);
        self.shipInABoxOverride(undefined);
        self.wideWidthFabric(false);
        self.shipOnAWideWidthPoleOverride(undefined);
        self.shipOnAStandardWidthPoleOverride(undefined);
        self.wideWidthMessage(undefined);
        self.packingMethodId(undefined);
        self.cutPieceBreakdown(undefined);
        self.reserveBatchCuttingIndicator(false);
        self.allocationCutPieceJson(undefined);

        self.generalAllocationMessage(undefined);
        self.supplierAvailabilityMessage(undefined);
        self.ringFenceWarning(undefined);
        self.freeStockWarning(undefined);
        self.allocationRequest(undefined);
        self.preventBackOrdersWarning(undefined);
        self.reserveBuffer(undefined);

        self.treatmentNotes([]);
        self.treatmentNoteValidateNow(false);
        self.existingQualityTreatments(undefined);
        self.expressTreatment(undefined);
        self.selectedTreatments([]);

        self.treatmentMandates([]);
        self.treatmentMandateBypass(false);
        self.treatmentMandateViolations([]);

        self.showAllocationStockRefreshButton(false);

        ko.utils.arrayForEach(self.products(), function (searchResult) {
            searchResult.reset();
        });

        ko.utils.arrayForEach(self.alternateColourways().products, function (searchResult) {
            searchResult.reset();
        });

        ko.utils.arrayForEach(self.alternateProducts().products, function (searchResult) {
            searchResult.reset();
        });

        ko.utils.arrayForEach(self.alsoLookAts().products, function (searchResult) {
            searchResult.reset();
        });

        ko.utils.arrayForEach(self.patternBookContents().products, function (searchResult) {
            searchResult.reset();
        });
        ko.utils.arrayForEach(self.samplingOptions().products, function (searchResult) {
            searchResult.reset();
        });

        ko.utils.arrayForEach(self.bespokeOptions().products, function (searchResult) {
            searchResult.reset();
        });

        self.treatmentDisplayGroupParams.observable(1);

        self.products([]);
        self.alternateProducts({ products: [] });
        self.alternateColourways({ products: [] });
        self.alsoLookAts({ products: [] });
        self.patternBookContents({ products: [] });
        self.samplingOptions({ products: [] });
        self.bespokeOptions({ products: [] });
        self.USPs([]);
        self.stockInfo([]);
        self.patternBookView(PATTERNBOOK_DISPLAY_CURRENT);
        self.techInfo(undefined);
        self.largeImageId(undefined);
        self.largeImageProduct(undefined);
        self.email(undefined);
        self.patternBookEmail(undefined);
        self.linkedDocuments([]);
        self.viewingLinkedDocument(undefined);
        self.supplierInfo([]);
        self.errors.showAllMessages(false);
        self.patternBookErrors.showAllMessages(false);
        self.validateNow(false);
        self.validatePatternBookNow(false);
        self.sendEmailBusy(false);
        self.busy(false);

        self.bespokeOptionsBusy(false);
        self.patternBookContentsBusy(false);
        self.alternateProductsBusy(false);
        self.samplingOptionsBusy(false);
        self.alternateColourwaysBusy(false);
        self.alsoLookAtsBusy(false);
        self.fetchCoordinatingProductsBusy(false);
        self.USPsBusy(false);
        self.stockInfoBusy(false);
        self.techInfoBusy(false);
        self.linkedDocumentsBusy(false);
        self.supplierBusy(false);

        self.addingProductToBasket(undefined);
        self.stageInformation().stages([{
            StepID: 0,
            SortOrder: 1,
            Name: 'Loading',
            Mandatory: false,
            ToolTip: null
        }]);
        self.stageInformation().currentStage({ StepID: 0 });
    }

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

    self.load = function (searchResult, tradeAccount) {

        self.reset();

        self.searchResult(searchResult);

        self.products(searchResult.products);

        for (var i in searchResult.products) {
            searchResult.products[i].stockInfo = ko.observable();
            searchResult.products[i].supplierAvailabilityMessage = ko.observable();
        }

        self.busy(true);

        self.tradeAccount = ko.unwrap(tradeAccount);

        let promises = [];

        if (searchResult.products[0].record.ProductFilterID == 13) {
            promises.push(self.fetchPatternBookImages());
        } else {
            promises.push(self.fetchImages());
        }

        promises.push(self.fetchAdditionalProducts());

        var results = Promise.allSettled(promises).then(function (results) {

            results.forEach((result) => console.log(result.status, result.reason));
        });

        self.busy(false);

        console.log('orderProductsDrilldown load completed', results);
    }

    self.embedLinkedDocument = function (record) {
        self.linkedDocumentsBusy(true);
        $('#linked-document-iframe').remove();
        var frame = $('<iframe class="linked-document-iframe" id="linked-document-iframe"></iframe>');
        $.ajax({
            url: '/api/FilesAPI/GetPDFForEmbed',
            type: 'GET',
            headers: {
                'Content-Type': 'application/pdf'
            },
            data: {
                path: record.Path, // '\\\\files\\00 - everyone\\TECHNICAL info for LP FR Certificate COPIES\\FRC 29362 VARESE F1190.pdf',
                name: encodeURI(record.Description)//'FRC 29362 VARESE F1190.pdf')
            },
            success: function (data) {
                self.linkedDocumentsBusy(false);
                $('#linked-document-tab').append(frame);
                $(frame).attr('src', 'data:application/pdf;base64,' + data);
            },
            error: function (xhr, s, a) {
                self.linkedDocumentsBusy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    self.downloadLinkedDocument = function (record) {
        $.ajax({
            url: '/api/FilesAPI/DownloadPDF',
            type: 'POST',
            xhrFields: {
                responseType: 'blob',
            },
            data: {
                path: record.Path, // '\\\\files\\00 - everyone\\TECHNICAL info for LP FR Certificate COPIES\\FRC 29362 VARESE F1190.pdf',
                name: encodeURI(record.Description)//'FRC 29362 VARESE F1190.pdf')
            },
            success: function (data) {
                var a = document.createElement('a');
                var url = window.URL.createObjectURL(data);
                a.href = url;
                a.download = record.Description;
                document.body.append(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            }
        });
    }

    self.fetchSupplierInfo = function () {
        return new Promise(function (resolve, reject) {
            var data = {
                productId: self.products()[0].record.ProductID
            }
            self.supplierBusy(true);
            console.log('orderProductsDrilldown fetchSupplierInfo calling with', data);
            $.ajax({
                url: '/api/componentapi/FetchSupplierInfo',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('orderProductsDrilldown fetchSupplierInfo returned', data.json);
                    self.supplierBusy(false);
                    self.supplierInfo(data.json);
                    resolve();
                },
                error: function (xhr, s, a) {
                    self.supplierBusy(false);
                    $.ajaxSettings.error(xhr, s, a);
                    reject();
                }
            });
        });
    }

    self.fetchLinkedDocuments = function () {
        return new Promise(function (resolve, reject) {
            var data = {
                code: self.products()[0].record.Code
            }
            self.linkedDocumentsBusy(true);
            console.log('orderProductsDrilldown fetchLinkedDocuments calling with', data);
            $.ajax({
                url: '/api/componentapi/FetchLinkedDocuments',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('orderProductsDrilldown fetchLinkedDocuments returned', data);
                    self.linkedDocumentsBusy(false);
                    self.linkedDocuments([]);
                    window.setTimeout(function () {
                        if (data.LinkedDocuments.length) {
                            ko.utils.arrayForEach(data.LinkedDocuments, function (ld, i) {

                            });
                            self.linkedDocuments(data.LinkedDocuments);
                            self.viewingLinkedDocument(self.linkedDocuments()[0]);
                        } else {
                            self.viewingLinkedDocument(undefined);
                        }
                        resolve();
                    }, 0);
                },
                error: function (xhr, s, a) {
                    self.linkedDocumentsBusy(false);
                    $.ajaxSettings.error(xhr, s, a);
                    reject();
                }
            });
        });
    }

    self.fetchAdditionalProducts = function (sr) {
        return new Promise(function (resolve, reject) {
            self.busy(true);

            var data = {
                tradeAccountId: self.parent.orderFactory.tradeAccount().TradeAccountID,
                productId: self.searchResult().record.ProductID
            }

            console.log('orderFactory fetchAdditionalProducts calling with', data);

            $.ajax({
                url: '/api/componentapi/FetchAdditionalProducts',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('orderFactory fetchAdditionalProducts returned', data);

                    for (var i in data) {
                        self.products.push(new searchResult(data[i], self.parent.orderFactory, null));
                    }

                    self.busy(false);

                    resolve();
                },
                error: function (xhr, s, a) {
                    self.busy(false);
                    reject(new Error(xhr.responseJSON));
                    $.ajaxSettings.error(xhr, s, a);
                }
            });
        })
    }

    self.fetchTreatmentOptions = function () {
        return new Promise(function (resolve, reject) {
            self.treatmentOptionsBusy(true);

            var data = {
                productId: self.products()[0].record.ProductID
            }

            console.log('orderProductsDrilldown fetchTreatmentOptions calling with', data);

            $.ajax({
                url: '/api/componentapi/FetchTreatmentOptions',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('orderProductsDrilldown fetchTreatmentOptions returned', data);
                    self.treatmentNotes(data.TreatmentNotes);
                    self.existingQualityTreatments(data);
                    self.treatmentOptionsBusy(false);
                    resolve();
                },
                error: function (xhr, s, a) {
                    self.treatmentOptionsBusy(false);
                    reject(new Error(xhr.responseJSON));
                    $.ajaxSettings.error(xhr, s, a);
                }
            });
        });
    }

    self.fetchBespokeOptions = function () {
        return new Promise(function (resolve, reject) {
            self.bespokeOptionsBusy(true);

            self.bespokeOptions({ products: [] });

            var data = {
                tradeAccountId: self.tradeAccount.TradeAccountID,
                productId: self.products()[0].record.ProductID
            }

            console.log('orderProductsDrilldown calling fetchBespokeOptions with', data);

            $.ajax({
                url: '/api/componentapi/FetchBespokeOptions',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {

                    console.log('orderProductsDrilldown fetchBespokeOptions returned', data);

                    var results = [];

                    for (var i in data) {
                        results.push(new searchResult(data[i], self.parent.orderFactory, null));
                    }

                    self.bespokeOptions({
                        products: results
                    })

                    self.bespokeOptionsBusy(false);

                    resolve();
                },
                error: function (xhr, s, a) {
                    self.bespokeOptionsBusy(false);
                    reject(new Error(xhr.responseJSON));
                    $.ajaxSettings.error(xhr, s, a);
                }
            });
        });
    }

    self.fetchPatternBookContents = function () {
        return new Promise(function (resolve, reject) {
            self.patternBookContentsBusy(true);

            self.patternBookContents({ products: [] });

            var data = {
                tradeAccountId: self.tradeAccount.TradeAccountID,
                productId: self.products()[0].record.ProductID
            }

            console.log('orderProductsDrilldown calling fetchPatternBookContents with', data);

            $.ajax({
                url: '/api/componentapi/FetchPatternBookContents',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('orderProductsDrilldown fetchPatternBookContents returned', data);

                    var results = [];

                    for (var i in data) {
                        results.push(new searchResult(data[i], self.parent.orderFactory, null));
                    }

                    self.patternBookContents({
                        products: results
                    });

                    self.patternBookContentsBusy(false);

                    resolve();
                },
                error: function (xhr, s, a) {
                    self.patternBookContentsBusy(false);
                    reject(new Error(xhr.responseJSON));
                    $.ajaxSettings.error(xhr, s, a);
                }
            });
        });
    }

    self.fetchSamplingOptions = function () {
        return new Promise(function (resolve, reject) {
            self.samplingOptionsBusy(true);

            self.samplingOptions({ products: [] });

            var data = {
                tradeAccountId: self.tradeAccount.TradeAccountID,
                productId: self.products()[0].record.ProductID
            }

            console.log('orderProductsDrilldown calling fetchSamplingOptions with', data);

            $.ajax({
                url: '/api/componentapi/FetchSamplingOptions',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('orderProductsDrilldown fetchSamplingOptions returned', data);

                    var results = [];

                    for (var i in data) {
                        results.push(new searchResult(data[i], self.parent.orderFactory, null));
                    }

                    self.samplingOptions({
                        products: results
                    });

                    self.samplingOptionsBusy(false);

                    resolve();
                },
                error: function (xhr, s, a) {
                    self.samplingOptionsBusy(false);
                    $.ajaxSettings.error(xhr, s, a);
                    reject(new Error(xhr.responseJSON));
                }
            });
        });
    }

    self.fetchAlternates = function () {
        return new Promise(function (resolve, reject) {
            self.alternateProductsBusy(true);

            self.alternateProducts({ products: [] });

            var data = {
                tradeAccountId: self.tradeAccount.TradeAccountID
            }

            data.productId = self.products()[0].record.ProductID;

            console.log('orderProductsDrilldown fetchAlternates calling with', data);

            $.ajax({
                url: '/api/componentapi/FetchAlternateProducts',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('orderProductsDrilldown fetchAlternates returned', data);

                    var results = [];

                    for (var i in data) {
                        results.push(new searchResult(data[i], self.parent.orderFactory, null));
                    }

                    self.alternateProducts({
                        products: results
                    });

                    self.alternateProductsBusy(false);

                    resolve();
                },
                error: function (xhr, s, a) {
                    $.ajaxSettings.error(xhr, s, a);
                    self.alternateProductsBusy(false);
                    reject(new Error(xhr.responseJSON));
                }
            });
        });
    }

    self.fetchColourways = function () {
        return new Promise(function (resolve, reject) {
            self.alternateColourwaysBusy(true);

            self.alternateColourways({ products: [] });

            var data = {
                tradeAccountId: self.tradeAccount.TradeAccountID
            }

            data.productId = self.products()[0].record.ProductID;

            console.log('orderProductsDrilldown fetchColourways calling with', data);

            $.ajax({
                url: '/api/componentapi/FetchAlternateColourways',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('orderProductsDrilldown fetchColourways returned', data);

                    var results = [];

                    for (var i in data) {
                        results.push(new searchResult(data[i], self.parent.orderFactory, null));
                    }

                    self.alternateColourways({
                        products: results
                    });

                    self.alternateColourwaysBusy(false);

                    resolve();
                },
                error: function (xhr, s, a) {
                    $.ajaxSettings.error(xhr, s, a);
                    self.alternateColourwaysBusy(false);
                    reject(new Error(xhr.responseJSON));
                }
            });
        });
    }

    self.fetchAlsoLookAts = function () {

        return new Promise(function (resolve, reject) {
            self.alsoLookAtsBusy(true);

            self.alsoLookAts({ products: [] });

            var productPageId = self.products()[0].record.ProductPageID;

            var data = {
                tradeAccountId: self.tradeAccount.TradeAccountID
            }

            if (productPageId)
                data.productPageId = productPageId;
            else
                data.productId = self.products()[0].record.ProductID;

            console.log('orderProductsDrilldown fetchAlsoLookAts calling with', data);

            $.ajax({
                url: '/api/componentapi/FetchAlsoLookAts',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('orderProductsDrilldown fetchAlsoLookAts returned', data);

                    var results = [];

                    for (var i in data) {
                        results.push(new searchResult(data[i], self.parent.orderFactory, null));
                    }

                    self.alsoLookAts({
                        products: results
                    });

                    self.alsoLookAtsBusy(false);

                    resolve();
                },
                error: function (xhr, s, a) {
                    $.ajaxSettings.error(xhr, s, a);
                    self.alsoLookAtsBusy(false);
                    reject(new Error(xhr.responseJSON));
                }
            });
        });
    }

    self.fetchCoordinatingProducts = function () {
        return new Promise(function (resolve, reject) {

            self.fetchCoordinatingProductsBusy(true);

            self.coordinatingProducts({ products: [] });

            var productPageId = self.products()[0].record.ProductPageID;

            var data = {
                tradeAccountId: self.tradeAccount.TradeAccountID
            }

            if (productPageId)
                data.productPageId = productPageId;
            else
                data.productId = self.products()[0].record.ProductID;

            console.log('orderProductsDrilldown fetchCoordinatingProducts calling with', data);

            $.ajax({
                url: '/api/componentapi/FetchCoordinatingProducts',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('orderProductsDrilldown fetchCoordinatingProducts returned', data);

                    var results = [];

                    for (var i in data) {
                        results.push(new searchResult(data[i], self.parent.orderFactory, null));
                    }

                    self.coordinatingProducts({
                        products: results
                    });

                    self.fetchCoordinatingProductsBusy(false);

                    resolve();
                },
                error: function (xhr, s, a) {
                    $.ajaxSettings.error(xhr, s, a);
                    self.fetchCoordinatingProductsBusy(false);
                    reject(new Error(xhr.responseJSON));
                }
            });
        });
    }

    self.fetchUSPs = function () {
        return new Promise(function (resolve, reject) {

            self.USPsBusy(true);

            self.USPs([]);

            var productPageId = self.products()[0].record.ProductPageID;

            var data = {
                tradeAccountId: self.tradeAccount.TradeAccountID
            }

            if (productPageId)
                data.productPageId = productPageId;
            else
                data.productId = self.products()[0].record.ProductID;

            console.log('orderProductsDrilldown fetchUSPs calling with', data);

            $.ajax({
                url: '/api/componentapi/FetchUSPs',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('orderProductsDrilldown fetchUSPs returned', data);
                    self.USPs(data);
                    self.USPsBusy(false);
                    resolve();
                },
                error: function (xhr, s, a) {
                    $.ajaxSettings.error(xhr, s, a);
                    self.USPsBusy(false);
                    reject(new Error(xhr.responseJSON));
                }
            });
        });
    }

    self.fetchStockInfo = function () {
        // hmmm... under what condition should we call outerReject here? if NO stock info is returned?
        return new Promise(function (resolve, reject) {
            self.stockInfoBusy(true);

            self.stockInfo([]);

            let productIds = [];

            ko.utils.arrayForEach(self.products(), function (item, index) {
                if ([12, 46, 84, 85].indexOf(item.record.ProductFilterID) > -1) {
                    // skip paint...
                    //item.stockInfo({
                    //    TotalPurchaseOrderLength: null,
                    //    TotalStock: null,
                    //    Batches: [],
                    //    Code: item.record.Code
                    //});
                } else {
                    productIds.push(item.record.ProductID);
                }
            });

            if (productIds.length) {
                var data = {
                    tradeAccountId: self.tradeAccount.TradeAccountID,
                    productIds: productIds
                }
                console.log('orderProductsDrilldown fetchStockInfo calling with', data);
                $.ajax({
                    url: '/api/componentapi/GetPieceLevelStockInfo',
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    success: function (data) {
                        console.log('orderProductsDrilldown fetchStockInfo returned', data);

                        ko.utils.arrayForEach(self.products(), function (item, index) {
                            var items = Enumerable.From(data.stockResults).Where(function (x) {
                                return x.ProductID == item.record.ProductID;
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
                                            units: item.record.Units
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
                                                        var qp = self.products().length ? self.products()[0].productFilterOptions().QuantityPrecision : 0;

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
                                                                if (((this.AvailableNowQuantity + this.OnReserveQuantity + this.OtherCustomerRingFencedQuantity + this.BulkQuantity) > 0) && self.products().length) {
                                                                    return formatNumber(this.AvailableNowQuantity + this.OnReserveQuantity + this.OtherCustomerRingFencedQuantity + this.BulkQuantity, qp, 'en-GB');
                                                                }
                                                            }, x),
                                                            DueInDisplay: ko.pureComputed(function () {
                                                                var result = '';
                                                                if (this.DueInQuantity && self.products().length) {
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

                                //    Enumerable.From(item.batches).Select(function (x) {
                                //    return Enumerable.From(x.pieces).Select(function (y) {
                                //        return y.AvailableNowQuantity + y.OnReserveQuantity + y.ThisCustomerRingFencedQuantity
                                //    }).Sum()
                                //}).Sum().toFixed(self.products()[0].productFilterOptions().QuantityPrecision);

                                //item.stockLocation.totalIncludingDue = Enumerable.From(item.batches).Select(function (x) {
                                //    return Enumerable.From(x.pieces).Select(function (y) {
                                //        return y.AvailableNowQuantity + y.OnReserveQuantity + y.ThisCustomerRingFencedQuantity + y.DueInQuantity
                                //    }).Sum()
                                //}).Sum()
                            });

                            // The stock info routine can return extraneous products which did not previously
                            // exist in the searchResult which was clicked to invoke the drilldown modal's products collection
                            // anything which falls into that category has not been processed by our load method in here, so won't have
                            // a supplierAvailabilityMessage observable attached
                            if (item.hasOwnProperty('supplierAvailabilityMessage')) {
                                item.supplierAvailabilityMessage(Enumerable.From(data.availabilityMessages).Where(function (y) {
                                    return y.ProductID == item.record.ProductID
                                }).Select(function (y) {
                                    return y.SupplierAvailabilityMessage;
                                }).SingleOrDefault());

                                item.stockInfo(processed);
                            }
                        });

                        //if (data.hasOwnProperty('Code')) {
                        //    item.stockInfo(data);
                        //} else {
                        //    //kaput!
                        //}

                        self.stockInfoBusy(false);

                        resolve();
                    },
                    error: function (xhr, s, a) {
                        $.ajaxSettings.error(xhr, s, a);
                        self.stockInfoBusy(false);
                        reject(new Error(xhr.responseJSON));
                    }
                });
            } else {
                self.stockInfoBusy(false);
                resolve();
            }
        });
    }

    self.fetchTechInfo = function () {

        return new Promise(function (resolve, reject) {
            self.techInfoBusy(true);

            self.techInfo(undefined);

            var productId = self.products()[0].record.ProductID;

            var data = {
                ProductID: productId
            };

            console.log('orderProductsDrilldown calling fetchTechInfo with', data);

            $.ajax({
                url: '/api/componentapi/FetchTechInfo',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('orderProductsDrilldown fetchTechInfo returned', data);
                    self.techInfo(data);
                    self.techInfoBusy(false);
                    resolve();
                },
                error: function (xhr, s, a) {
                    $.ajaxSettings.error(xhr, s, a);
                    self.techInfoBusy(false);
                    reject(new Error(xhr.responseJSON))
                }
            });
        });
    }

    self.fetchImages = function () {

        return new Promise(function (resolve, reject) {

            self.carouselBusy(true);

            $(self.productPageImages.DOMElement).parent().hide();

            self.productPageImages([]);

            if ($(self.productPageImages.DOMElement).data('owl.carousel')) {
                $(self.productPageImages.DOMElement).data('owl.carousel').destroy();
            }

            //self.productPageImages([]);

            var productPageId = self.products()[0].record.ProductPageID;

            var visibleImageCount = 4;

            if (self.products()[0].record.Code.indexOf('Q') == 0) {
                visibleImageCount = 3;
            }

            var data = {
                tradeAccountId: self.tradeAccount.TradeAccountID
            }

            if (productPageId)
                data.productPageId = productPageId;
            else
                data.productId = self.products()[0].record.ProductID;

            console.log('orderProductsDrilldown fetchProductPageImages calling with', data);

            $.ajax({
                url: '/api/componentapi/FetchProductPageImages',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {

                    console.log('orderProductsDrilldown fetchProductPageImages returned', data);

                    self.visibleImages(4);

                    if (data.length > 0) {
                        for (var i in data) {
                            data[i].Code = self.products()[0].record.Code;
                            data[i].OrderFormName = self.products()[0].record.OrderFormName;
                            data[i].BasketName = self.products()[0].record.BasketName;
                            data[i].Name = self.products()[0].record.Name;
                        }
                        self.productPageImages(data);
                    } else {
                        self.productPageImages([{
                            ImageID: self.products()[0].record.ImageID,
                            Code: self.products()[0].record.Code,
                            Name: self.products()[0].record.OrderFormName,
                            TitleText: null,
                            AltText: null
                        }])
                    }

                    resolve();
                },
                error: function (xhr, s, a) {
                    $.ajaxSettings.error(xhr, s, a);
                    reject(new Error(xhr.responseJSON));
                }
            });
        });
    }

    self.productPageImages.subscribe(function (newValues) {
        window.setTimeout(function () {
            self.rebuildCarousel(self.visibleImages());
        }, 10);
    }, self, 'arrayChange');

    self.fetchPatternBookImages = function () {

        return new Promise(function (resolve, reject) {

            self.carouselBusy(true);

            self.productPageImages([]);

            var productId = self.products()[0].record.ProductID;

            var visibleImageCount = 3;

            var data = {
                productId: productId
            };

            if (productId) {
                $.ajax({
                    url: '/api/componentapi/FetchCollectionImages',
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    success: function (data) {

                        console.log('orderProductsDrilldown fetchPatternBookImages returned', data);

                        for (var i in data) {
                            data[i].Code = self.products()[0].record.Code;
                            data[i].OrderFormName = self.products()[0].record.OrderFormName;
                            data[i].BasketName = self.products()[0].record.BasketName;
                            data[i].Name = self.products()[0].record.Name;
                        }

                        self.visibleImages(3);

                        self.productPageImages(data);

                        //window.setTimeout(function () {
                        //    self.rebuildCarousel(visibleImageCount);
                        //}, 0);

                        resolve();
                    },
                    error: function (xhr, s, a) {
                        $.ajaxSettings.error(xhr, s, a);
                        reject(new Error(xhr.responseJSON));
                    }
                });
            } else {
                // no product page? fine, use product 0's ImageID...

                self.productPageImages([{ ImageID: self.products()[0].record.ImageID, TitleText: null, AltText: null }])

                //self.rebuildCarousel(visibleImageCount);

                resolve();
            }
        });
    }

    self.rebuildCarousel = function (visibleImageCount) {
        if ($('#order-products-drilldown-modal').is(':visible')) {

            $(self.productPageImages.DOMElement).show();

            if (self.productPageImages.tinySlider) {
                self.productPageImages.tinySlider.destroy();
                delete self.productPageImages.tinySlider;
            }

            self.productPageImages.tinySlider = tns({
                container: $(self.productPageImages.DOMElement).children('.order-products-carousel')[0], //'#large-image-carousel',
                controlsText: ['<i class="material-icons">keyboard_arrow_left</i>', '<i class="material-icons">keyboard_arrow_right</i>'],
                gutter: 10,
                loop: false,
                nav: false,
                mouseDrag: true,
                items: visibleImageCount
            });

            if (self.productPageImages().length > visibleImageCount) {
                $(self.productPageImages.DOMElement).find('.tns-outer').addClass('controls-padded');
            }

            window.setTimeout(function () {
                self.carouselBusy(false);
            }, 100);
        } else {

            $('#order-products-drilldown-modal').off('shown.bs.modal');

            $('#order-products-drilldown-modal').on('shown.bs.modal', function () {

                $(self.productPageImages.DOMElement).show();

                if (self.productPageImages.tinySlider) {
                    self.productPageImages.tinySlider.destroy();
                    delete self.productPageImages.tinySlider;
                }

                self.productPageImages.tinySlider = tns({
                    container: $(self.productPageImages.DOMElement).children('.order-products-carousel')[0], //'#large-image-carousel',
                    controlsText: ['<i class="material-icons">keyboard_arrow_left</i>', '<i class="material-icons">keyboard_arrow_right</i>'],
                    gutter: 10,
                    loop: false,
                    nav: false,
                    mouseDrag: true,
                    items: visibleImageCount
                });

                if (self.productPageImages().length > visibleImageCount) {
                    $(self.productPageImages.DOMElement).find('.tns-outer').addClass('controls-padded');
                }

                window.setTimeout(function () {
                    self.carouselBusy(false);
                }, 100);
            });
        }
    }

    self.loadPatternBookContents = function (result, emailObservable) {
        if ($('#order-products-drilldown-leading').length) {
            if (self.drilldownCarouselTranslating() == true) {
                return;
            }
        }

        if (ko.isObservable(emailObservable)) {
            self.email(emailObservable());
            self.email.subscribe(function (newValue) {
                emailObservable(newValue);
            });
        }

        // this needs to change when you swipe...
        self.largeImageId(result.ImageID);

        $('#pattern-book-contents-image-container').html('');

        var startIndex = 0;

        var imagesHtml = '';// '<img data-product-id="' + result.ProductID + '" data-image-id="' + result.ImageID + '" src="https://www.designersguild.com/image/1024/' + result.ImageID + '" />';

        ko.utils.arrayForEach(self.patternBookContents().products, function (item, index) {
            if (item.record.ImageID == result.ImageID) {
                startIndex = index;
            }

            imagesHtml += '<img data-product-id="' + item.record.ProductID + '" data-image-id="' + item.record.ImageID + '" src="https://www.designersguild.com/image/1024/' + item.record.ImageID + '" />';
        });

        $('#pattern-book-contents-image-container').html('<div id="pattern-book-contents-image-carousel">' + imagesHtml + '</div>');

        $('#pattern-book-contents-title').text(result.Code + ' - ' + (result.OrderFormName || result.BasketName || result.Name));

        $('.pattern-book-contents-nav').empty();

        if ($('#pattern-book-contents-image-carousel').data('owl.carousel')) {
            $('#pattern-book-contents-image-carousel').data('owl.carousel').destroy();
        }

        var slider = tns({
            container: '#pattern-book-contents-image-carousel', //'#large-image-carousel',
            navContainer: '.pattern-book-contents-nav',
            controlsText: ['<i class="material-icons">keyboard_arrow_left</i>', '<i class="material-icons">keyboard_arrow_right</i>'],
            gutter: 10,
            items: 1,
            loop: false,
            nav: false,
            mouseDrag: true,
            startIndex: startIndex
        });

        $('#pattern-book-contents-image-carousel').closest('.tns-outer').addClass('controls-padded');

        slider.events.on('indexChanged', function (value) {
            console.log('ooowl', value);
            window.setTimeout(function () {
                self.largeImageId($('#pattern-book-contents-image-carousel  img.tns-item.tns-slide-active').data('image-id'));

                self.largeImageProduct(Enumerable.From(self.patternBookContents().products).Where(function (x) {
                    return x.record.ProductID == $('#pattern-book-contents-image-carousel img.tns-item.tns-slide-active').data('product-id')
                }).FirstOrDefault());

                if (self.largeImageProduct())
                    $('#pattern-book-contents-title').text(self.largeImageProduct().record.Code + ' - ' + (self.largeImageProduct().record.OrderFormName || self.largeImageProduct().record.BasketName || self.largeImageProduct().record.Name));
            }, 100);
        });

        //$('#pattern-book-contents-image-carousel').owlCarousel({
        //    nav: true,
        //    navText: ['<i class="material-icons">keyboard_arrow_left</i>', '<i class="material-icons">keyboard_arrow_right</i>'],
        //    navContainer: '.pattern-book-contents-nav',
        //    margin: 10,
        //    items: 1,
        //    dots: false,
        //    slideBy: 1,//'page',
        //    loop: true,
        //    rewind: false,
        //    startPosition: startIndex,
        //    onChanged: function (value) {
        //        console.log('ooowl', value);
        //        window.setTimeout(function () {
        //            self.largeImageId($('#pattern-book-contents-image-carousel .owl-item.active img').data('image-id'));

        //            self.largeImageProduct(Enumerable.From(self.patternBookContents().products).Where(function (x) {
        //                return x.record.ProductID == $('#pattern-book-contents-image-carousel .owl-item.active img').data('product-id')
        //            }).FirstOrDefault());

        //            if (self.largeImageProduct())
        //                $('#pattern-book-contents-title').text(self.largeImageProduct().record.Code + ' - ' + (self.largeImageProduct().record.OrderFormName || self.largeImageProduct().record.BasketName || self.largeImageProduct().record.Name));
        //        }, 100);
        //    }
        //});

        $("#pattern-book-contents-modal").modal('show');
    }

    // result now needs to be the searchResult... but can't be because bespoke builders don't carry full searchResult objects...
    // so... what are we supposed to do about THAT little problem.
    // have a loadFromBespoke function which does as little as possible in order to get a large image up there
    // don't offer the extra functionality such as sending emails
    self.bespokeLoadLargeImage = function (result) {

        $('#large-image-container').html('');

        var imagesHtml = '<img data-image-id="' + result.ImageID + '" src="https://www.designersguild.com/image/1024/' + result.ImageID + '" />';

        $('#large-image-container').html('<div id="large-image-carousel">' + imagesHtml + '</div>');

        $('#large-image-title').text(result.Code + ' - ' + (result.Name || result.OrderFormName));//

        $('.largeimage-nav').empty();

        $("#image-modal").modal('show');

        $('#large-image-wrapper').show(); // ?

        $('#large-image-container').show();
    }

    self.loadLargeImage = function (result, emailObservable) {

        if ($('#order-products-drilldown-leading').length) {
            if (self.drilldownCarouselTranslating() == true) {
                return;
            }
        }

        if (ko.isObservable(emailObservable)) {
            self.email(emailObservable());
            self.email.subscribe(function (newValue) {
                emailObservable(newValue);
            });
        }

        self.largeImageProduct(self.products()[0]);

        // this needs to change when you swipe...
        self.largeImageId(result.ImageID);

        $('#large-image-container').html('');

        var imagesHtml = '';//'<img data-product-id="' + result.ProductID + '" data-image-id="' + result.ImageID + '" src="https://www.designersguild.com/image/1024/' + result.ImageID + '" />';

        var startIndex = 0;

        ko.utils.arrayForEach(self.productPageImages(), function (item, index) {
            if (item.ImageID == result.ImageID) {
                startIndex = index;
            }
            imagesHtml += '<img data-image-id="' + item.ImageID + '" src="https://www.designersguild.com/image/1024/' + item.ImageID + '" />';
        });


        $('#large-image-container').html('<div id="large-image-carousel">' + imagesHtml + '</div>');

        $('#large-image-title').text(result.Code + ' - ' + (result.OrderFormName || result.BasketName || result.Name));

        $('.largeimage-nav').empty();

        $('#large-image-wrapper').hide();

        if ($('#large-image-carousel').data('owl.carousel')) {
            $('#large-image-carousel').data('owl.carousel').destroy();
            $('#large-image-carousel .owl-stage').empty();
        }

        window.setTimeout(function () {
            //console.log('startI', startIndex);
            //console.log('owl items found', $('#large-image-carousel .owl-stage .owl-item').length);

            tns({
                container: '#large-image-carousel',
                navContainer: '.largeimage-nav',
                controlsText: ['<i class="material-icons">keyboard_arrow_left</i>', '<i class="material-icons">keyboard_arrow_right</i>'],
                gutter: 10,
                loop: false,
                nav: false,
                mouseDrag: true,
                startIndex: startIndex
                //,
                // onChanged: function (value) {
                //    console.log('ooowl', value);
                //    window.setTimeout(function () {
                //        self.largeImageId($('#pattern-book-contents-image-carousel .tns-item.tns-slide-active img').data('image-id'));

                //        if (self.patternBookContents().products.length > 0) {
                //            self.largeImageProduct(Enumerable.From(self.patternBookContents().products).Where(function (x) {
                //                return x.record.ProductID == $('#large-image-carousel .owl-item.active img').data('product-id')
                //            }).FirstOrDefault());

                //            self.largeImageProduct(Enumerable.From(self.patternBookContents().products).Where(function (x) {
                //                return x.record.ProductID == $('#pattern-book-contents-image-carousel .tns-item.tns-slide-active img').data('product-id')
                //            }).FirstOrDefault());

                //            if (self.largeImageProduct())
                //                $('#pattern-book-contents-title').text(self.largeImageProduct().record.Code + ' - ' + (self.largeImageProduct().record.OrderFormName || self.largeImageProduct().record.BasketName || self.largeImageProduct().record.Name));
                //        }

                //    }, 100);
                //}
            });

            $('#large-image-carousel').closest('.tns-outer').addClass('controls-padded');
            //$('#large-image-carousel').closest('.owl-carousel').addClass('controls-padded');

            $("#image-modal").modal('show');

            $('#large-image-wrapper').show();

            //$('#large-image-carousel').owlCarousel({
            //    nav: true,
            //    navText: ['<i class="material-icons">keyboard_arrow_left</i>', '<i class="material-icons">keyboard_arrow_right</i>'],
            //    navContainer: '.largeimage-nav',
            //    margin: 10,
            //    items: 1,
            //    dots: false,
            //    slideBy: 1,//'page',
            //    loop: false,
            //    rewind: false,
            //    startPosition: startPosition,
            //    onInitialized: function () {
            //        //window.setTimeout(function () {
            //            $("#image-modal").modal('show');

            //            $('#large-image-wrapper').show();
            //        //}, 400);
            //    },
            //    onChanged: function (value) {
            //        console.log('ooowl', value);
            //        window.setTimeout(function () {
            //            self.largeImageId($('#large-image-carousel .owl-item.active img').data('image-id'));

            //            //if (self.patternBookContents().products.length > 0) {
            //            // it is no longer pattern book o'clock...
            //            // we have come from a product... page... to get here...?
            //            // so rather than storing largeImageProduct
            //            // store... largeImageProductPage...?
            //            //self.largeImageProduct(Enumerable.From(self.patternBookContents().products).Where(function (x) {
            //            //    return x.record.ProductID == $('#large-image-carousel .owl-item.active img').data('product-id')
            //            //}).FirstOrDefault());

            //            self.largeImageProduct(self.parent.orderFactory.drilldownData().products[0]);

            //            if (self.largeImageProduct())
            //                $('#large-image-title').text(self.largeImageProduct().record.Code + ' - ' + (self.largeImageProduct().record.OrderFormName || self.largeImageProduct().record.BasketName || self.largeImageProduct().record.Name));
            //            //}
            //        }, 100);

            //    }
            //});
        }, 0);

        $('#large-image-container').show();

    }

    self.showStockTabHook = function () {
        console.log('attaching event listener to drilldown modal...');
        self.openStock = self.busy.subscribe(function (newValue) {
            if (newValue == false) {
                $('a[href="#tab-drilldown-stock-info"]').tab('show');
                if (self.openStock) {
                    self.openStock.dispose();
                }
            }
        });
        //$('#order-products-drilldown-modal').on('shown.bs.modal', self.showStockTab);
    }

    //self.showStockTab = function () {
    //    window.setTimeout(function () {

    //        $('#order-products-drilldown-modal').off('shown.bs.modal', self.showStockTab);
    //    }, 100);
    //}

    $("#image-modal").on('shown.bs.modal', function () {
        if (self.email.hasOwnProperty('mdcTextField'))
            self.email.mdcTextField.layout();
    });

    $("#image-modal").on('hide.bs.modal', function () {
        self.emailInputVisible(false); // ???
    });

    self.jumpToProductSampling = function () {

        var data = ko.dataFor($('.btn-secondary-blue[data-product-filter-id="' + self.largeImageProduct().record.ProductFilterID + '"]')[0]);

        console.log('orderProductsDrilldown setting orderFactory.searchWidget to', data);

        self.parent.orderFactory.searchWidget(data);

        window.setTimeout(function () {
            $('a[href="#tab-drilldown-sampling"]').tab('show');
        }, 100);

        self.parent.orderFactory.searchResultDrilldown(self.largeImageProduct());

        //$('#order-products-drilldown-modal').modal('hide');

        $('#image-modal').modal('hide');
    }

    // #endregion
}


const linkedDocumentEmailer = ({
    parent
} = {}) => (function () {
    var self = {};

    self.parent = parent;

    self.validateLinkedDocumentsEmailNow = ko.observable(false);

    self.linkedDocumentsEmailAttachments = ko.observableArray([]);

    self.parent.viewingLinkedDocument.subscribe(function (newValue) {
        if (newValue)
            self.linkedDocumentsEmailAttachments([newValue.FileName]);
    });

    self.linkedDocumentsEmail = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateLinkedDocumentsEmailNow();
            },
            message: 'Recipient Email Required'
        },
        email: {
            params: true,
            onlyIf: function () {
                return self.validateLinkedDocumentsEmailNow();
            },
            message: 'Invalid Email'
        }
    });

    self.linkedDocumentsSentTo = ko.observable();

    self.showLinkedDocumentsLastSentTo = ko.observable(false);

    self.linkedDocumentsEmailParams = {
        label: 'Email Document to',
        originalValue: self.linkedDocumentsSentTo,
        observable: self.linkedDocumentsEmail,
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
            self.linkedDocumentsEmail(self.linkedDocumentsSentTo());
            $(self.linkedDocumentsEmail.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 254
        }
    }

    self.linkedDocumentsEmailSubject = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateLinkedDocumentsEmailNow();
            },
            message: 'Subject Required'
        },
    });

    self.linkedDocumentsEmailSubjectParams = {
        label: 'Email Subject',
        originalValue: ko.observable(),
        observable: self.linkedDocumentsEmailSubject,
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
            self.linkedDocumentsEmailSubject(undefined);
            $(self.linkedDocumentsEmailSubject.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 1000
        }
    };

    self.linkedDocumentsEmailBody = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateLinkedDocumentsEmailNow()
            },
            message: 'Body is Required'
        }
    });

    self.linkedDocumentsEmailBodyParams = {
        label: 'Email Body',
        originalValue: ko.observable(),
        observable: self.linkedDocumentsEmailBody,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        rows: 10,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        permitRevert: true,
        revertFunction: function () {
            self.linkedDocumentsEmailBody(undefined);
            $(self.linkedDocumentsEmailBody.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 4000
        }
    };

    self.linkedDocumentEmailErrors = ko.validation.group([
        self.linkedDocumentsEmail,
        self.linkedDocumentsEmailSubject,
        self.linkedDocumentsEmailBody
    ]);

    self.emailLinkedDocument = function () {
        var doc = self.parent.viewingLinkedDocument();
        self.validateLinkedDocumentsEmailNow(true);
        window.setTimeout(function () {
            if (self.linkedDocumentEmailErrors().length) {
                self.linkedDocumentEmailErrors.filter(function (x) {
                    x.isValid.notifySubscribers(x.isValid())
                });
            } else {
                self.parent.linkedDocumentsBusy(true);
                var data = {
                    attachments: Enumerable.From(self.parent.linkedDocuments()).Where(function (x) {
                        return self.linkedDocumentsEmailAttachments().indexOf(x.FileName) > -1;
                    }).ToArray(),
                    recipient: self.linkedDocumentsEmail(),
                    subject: self.linkedDocumentsEmailSubject(),
                    body: self.linkedDocumentsEmailBody()
                };
                console.log('emailLinkedDocument called with', data);
                $.ajax({
                    url: '/api/orderproducts/EmailLinkedDocument',
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    success: function (data) {
                        self.parent.linkedDocumentsBusy(false);
                        self.validateLinkedDocumentsEmailNow(false);
                        self.linkedDocumentsSentTo(self.linkedDocumentsEmail());
                        self.showLinkedDocumentsLastSentTo(true);
                        window.setTimeout(function () {
                            self.showLinkedDocumentsLastSentTo(false);
                        }, 5000);
                    },
                    error: function (xhr, s, a) {
                        self.parent.linkedDocumentsBusy(false);
                        $.showError(xhr, s, a);
                    }
                })
            }
        }, 0);
    }

    return self;
})()