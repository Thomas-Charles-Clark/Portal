const stockCheckRequestViewModel = ({
    parent
} = {
    parent: {}
    }) => { 

        /*
        
        Stock_Select returns ExecuteStockCheckRequest_Select
        
        If this is TRUE you muste execute StockCheckRequest_Select and conditionally enable / disable the request button
        based on AllowStockCheckRequest in the response.
        
        Render the alert with the given class with the button inside the alert after the text!

        Also SORTING in the OrderBook BackOrdersWithoutPurchaseOrders (and probably all other detail grids) is not working 

        */

    //#region Properties

    let self = {
        parent: parent
    }

    self.validateNow = ko.observable(false);

    self.busy = ko.observable(false);

    self.modalElement = document.querySelector('#stock-check-request-modal');

    self.modal = $(self.modalElement).modal;

    self.quantity = ko.observable();

    self.quantityParams = {
        label: 'Quantity',
        observable: self.quantity,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: true,
        showClear: true,
        clearFunction: function () {
            self.quantity(undefined);
        },
        buttons: false,
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: self.busy,
        clearable: ko.observable(true),
        clearFunction: () => {
            self.quantity(undefined);
        },
        revertible: ko.observable(false),
        inputType: 'text',
        minValue: 1,
        maxValue: 9999,
        step: 1
    };

    self.quantityHasFocus = ko.observable(false);

    self.addingProductToBasket = ko.observable();

    self.productFilterOptions = ko.observable({

    });

    self.allowStockCheckRequest = ko.observable(false);

    self.message = ko.observable();

    self.cssClass = ko.observable();

    self.show = ko.observable(false);

    //#endregion

    //#region Components

    self.errors = ko.validation.group([
        self.productId,
        self.quantity
    ]);

    //#endregion

    //#region Computeds



    //#endregion

    //#region Subscriptions

    self.parent.searchResult.subscribe(nv => {

        if (nv) {

            let productFilterOptions = nv.productFilterOptions();

            if (productFilterOptions) {

                self.productFilterOptions(productFilterOptions)

                self.extendQuantity(productFilterOptions);

            } else {

                nv.productFilterOptions.subscribe(pfo => {

                    self.productFilterOptions(pfo);

                    self.extendQuantity(pfo);
                });
            }
        }
    });

    //#endregion

    //#region Methods

    self.extendQuantity = (pfo) => {

        self.quantity.extend({
            required: {
                params: true,
                onlyIf: self.validateNow,
                message: 'You must provide a quantity'
            },
            numberFormatted: {
                digits: pfo.QuantityPrecision,
                currency: {
                    FormattingCulture: 'en-GB'
                }
            },
            min: {
                params: 1, //pfo.QuantityMinimum,
                onlyIf: self.validateNow,
                message: `Minimum of 1`
            },
            max: {
                params: 99999,//pfo.QuantityMaximum,
                onlyIf: self.validateNow,
                message: `Maximum of 99,999`
            },
            notEqual: {
                params: "",
                onlyIf: self.validateNow,
                message: 'You must provide a quantity'
            },
            notEqual: {
                params: 0,
                onlyIf: self.validateNow,
                message: 'You must provide a positive value for quantity'
            }
        });

        window.setTimeout(() => {
            self.quantity.DOMElement && ko.cleanNode(self.quantity.DOMElement) && ko.applyBindings(self.quantityParams, self.quantity.DOMElement);
        }, 0);
    }

    self.showModal = () => {
        $('#stock-check-request-modal').modal('show');
    }

    self.hideModal = () => {
        $('#stock-check-request-modal').modal('hide');
    }

    self.submit = () => {

        self.validateNow(true);

        if (self.errors().length) {

            self.errors.showAllMessages(true);

            self.errors.filter(x => {
                x.isValid.notifySubscribers(x.isValid());
            });

        } else {
            //$.confirm("Are you sure?", "Please double check the quantity you're requesting.", () => {

                self.busy(true);

                let params = {
                    productId: self.parent.searchResult().record.ProductID,
                    quantity: self.quantity(),
                    tradeAccountId: self.parent.parent.orderFactory.tradeAccountId(),
                    basketId: self.parent.parent.orderFactory.basketId()
                }

                console.log("InsertStockCheckRequest calling with", params)

                fetch("/api/componentapi/InsertStockCheckRequest", {
                    method: 'POST',
                    headers: window.fetchHeaders,
                    cache: 'no-cache',
                    body: JSON.stringify(params)
                })
                    .then(window.handleFetchResponse)
                    .then(data => {
                        console.log("InsertStockCheckRequest returned", data);

                        self.busy(false);

                        // returns 0 for success, so it was in the beginning so shall it be in the end
                        $.info(data.Result === false ? "Success" : "Sorry", data.Response, null, () => {
                            self.hideModal();
                        });

                        if (self.parent.hasOwnProperty('addingProductToBasket') &&
                            self.parent.addingProductToBasket()) {
                            self.parent.fetchBasketItemAllocationStock();
                        } else {

                            if (self.parent.hasOwnProperty('fetchStockInfo')) {
                                self.parent.fetchStockInfo();
                            }

                            if (self.parent.hasOwnProperty('showStockInfo')) {
                                self.parent.showStockInfo(self.parent.stockInfoProducts()[0]);
                            }
                        }

                        console.warn('must re-call the parent context\'s portal.Stock_Select, whichever form that took, to reload the messaging');
                    })
                    .catch(err => {
                        self.busy(false);
                        window.catchFetchError(err);
                    });

            //}, null);
        }
    }

    self.reset = () => {
        self.validateNow(false);
        self.quantity(undefined);
        self.quantityHasFocus(false);
        self.addingProductToBasket(undefined);
        self.productFilterOptions({

        });
        self.allowStockCheckRequest(false);
        self.message(undefined);
        self.cssClass(undefined);
    }

    self.checkStock = (params, products, busyFn, beforeFn, afterFnSuccess, afterFnError, resolve, reject) => {

        busyFn && busyFn(true);

        beforeFn && beforeFn();

        let data = {
            enquiryType: 'P',
            basketId: params.basketId,
            basketItemId: params.basketItemId,
            productId: params.productId, // caters for singular usage
            productIds: params.productIds,
            tradeAccountId: params.tradeAccountId
        };

        console.log('stockCheckRequester.checkStock calling with', data);

        fetch('/api/componentapi/GetPieceLevelStockInfo', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            body: JSON.stringify(data)
        }).then(window.handleFetchResponse)
            .then(data => {

                console.log('stockCheckRequester.checkStock returned', data);

                let resultantData = self.processStockEnquiryResults(products, data);

                busyFn && busyFn(false);

                afterFnSuccess && afterFnSuccess(resultantData);

                resolve && resolve();

            })
            .catch(err => {

                busyFn && busyFn(false);

                afterFnError && afterFnError();

                reject && reject();

                window.catchFetchError(err);

            })
    }

    self.processStockEnquiryResults = (products, data) => {

        results = [];

        products.forEach((item) => {

            let productId = item.productId ?? (item.record && item.record.ProductID) ?? item.ProductID;

            let items = data.stockResults.filter((x) => {
                return x.ProductID == productId;
            });

            let grouped = Map.groupBy(items, (piece) => {
                return {
                    stockLocationId: piece.StockLocationID,
                    stockLocationCode: piece.StockLocationCode,
                    stockLocationName: piece.StockLocationName,
                    sortOrder: piece.StockLocationSortOrder,
                    stockLocationLabel: `${piece.StockLocationCode}~${piece.StockLocationName}`
                }
            });

            let processed = [];

            grouped.forEach((pieces, stockLocation) => {

                stockLocation = Object.assign(stockLocation, {
                    availableNowTotal: pieces.reduce((a, v) => a + v.AvailableNowQuantity, 0),
                    bulkTotal: pieces.reduce((a, v) => a + v.BulkQuantity, 0),
                    onReserveTotal: pieces.reduce((a, v) => a + v.OnReserveQuantity, 0),
                    waitingTotal: pieces.reduce((a, v) => a + v.WaitingToBePutAwayQuantity, 0),
                    ringFencedTotal: pieces.reduce((a, v) => a + v.OtherCustomerRingFencedQuantity, 0),
                    dueInTotal: pieces.reduce((a, v) => a + v.DueInQuantity, 0),
                    units: item.units ?? item.Units ?? (item.record && item.record.Units)
                });

                let batches = Map.groupBy(pieces, (batch) => {
                    return {
                        batchNo: batch.Batch,
                        sortOrder: batch.SortOrder,
                        batchTotalQuantity: batch.BatchTotalQuantity
                    }
                });

                let processedBatches = [];

                batches.forEach((pieces, batch) => {

                    pieces = pieces.map(x => {
                        let qp = products.length ? products[0].productFilterOptions().QuantityPrecision : 0;

                        return Object.assign(x, {
                            AvailableNowDisplay: ko.computed(function () {
                                if (this.AvailableNowQuantity) {
                                    return formatNumber(this.AvailableNowQuantity, qp, 'en-GB');
                                }
                            }, x),
                            BulkDisplay: ko.computed(function () {
                                if (this.BulkQuantity) {
                                    return formatNumber(this.BulkQuantity, qp, 'en-GB');
                                }
                            }, x),
                            WaitingDisplay: ko.computed(function () {
                                if (this.WaitingToBePutAwayQuantity) {
                                    return formatNumber(this.WaitingToBePutAwayQuantity, qp, 'en-GB');
                                }
                            }, x),
                            OnReserveDisplay: ko.computed(function () {
                                if (this.OnReserveQuantity) {
                                    return formatNumber(this.OnReserveQuantity, qp, 'en-GB');
                                }
                            }, x),
                            RingFencedDisplay: ko.computed(function () {
                                if (this.OtherCustomerRingFencedQuantity) {
                                    return formatNumber(this.OtherCustomerRingFencedQuantity, qp, 'en-GB');
                                }
                            }, x),
                            TotalDisplay: ko.computed(function () {
                                if (((this.AvailableNowQuantity + this.OnReserveQuantity + this.OtherCustomerRingFencedQuantity + this.BulkQuantity) > 0) && products) {
                                    return formatNumber(this.AvailableNowQuantity + this.OnReserveQuantity + this.OtherCustomerRingFencedQuantity + this.BulkQuantity, qp, 'en-GB');
                                }
                            }, x),
                            DueInDisplay: ko.computed(function () {
                                var result = '';

                                if (this.DueInQuantity && products.length) {
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
                            }, x),
                            POConfirmed: x.POCOnfirmed,
                            POOnCallOff: x.POOnCallOff
                        });
                    });

                    processedBatches.push({
                        batch: batch,
                        pieces: pieces
                    });
                });

                processed.push({
                    stockLocation,
                    batches: processedBatches
                });
            });

            processed.forEach(item => {

                // Purposefully does not include dueInTotal
                item.stockLocation.totalQuantity = ko.pureComputed(function () {
                    return (this.availableNowTotal + this.bulkTotal + this.onReserveTotal + this.waitingTotal);
                }, item.stockLocation);


                item.stockLocation.totalIncludingDue = ko.pureComputed(function () {
                    return (this.availableNowTotal + this.bulkTotal + this.dueInTotal + this.onReserveTotal + this.waitingTotal);
                }, item.stockLocation);

            });



            // The stock info routine can return extraneous products which did not previously
            // exist in the searchResult which was clicked to invoke the drilldown modal's products collection
            // anything which falls into that category has not been processed by our load method in here, so won't have
            // a supplierAvailabilityMessage observable attached
            let sam = data.availabilityMessages.find(a => a.ProductID == productId);
            //// The stock info routine can return extraneous products which did not previously
            //// exist in the searchResult which was clicked to invoke the drilldown modal's products collection
            //// anything which falls into that category has not been processed by our load method in here, so won't have
            //// a supplierAvailabilityMessage observable attached

            if (sam) {
                item.hasOwnProperty('supplierAvailabilityMessage') && item.supplierAvailabilityMessage(sam.SupplierAvailabilityMessage);
            }

            let sar = data.stockCheckRequest;
            // this property being non-null indicates that the portal.StockCheckRequest_Select call was made
            // and thus we should display the stockCheckRequester.

            if (sar) {
                item.hasOwnProperty('showStockCheckRequester') && item.showStockCheckRequester(true);
            }

            if (item.hasOwnProperty('showStockCheckRequester')) {
                if (data.stockCheckRequest) {
                    self.show(true);
                    self.allowStockCheckRequest(data.stockCheckRequest.AllowStockCheckRequest);
                    self.message(data.stockCheckRequest.Response);
                    self.cssClass(data.stockCheckRequest.Class);
                } else {
                    self.show(false);
                    self.allowStockCheckRequest(false)
                    self.message(undefined);
                    self.cssClass(undefined);
                }
            }

            if (ko.isObservable(item.stockInfo)) {
                item.stockInfo(processed);
            }
            else {
                item.stockInfo = ko.observable(processed);
            }

            results = results.concat(processed);
        });

        return results;
    }

    //#endregion

    //#region Events

    document.querySelector('#stock-check-request-modal').addEventListener('show.bs.modal', () => {

        window.setTimeout(() => {
            self.quantityParams.clearFunction();
            self.quantity.DOMElement && self.quantity.DOMElement.select();
        }, 0);
    });

    //#endregion

    return self;
}