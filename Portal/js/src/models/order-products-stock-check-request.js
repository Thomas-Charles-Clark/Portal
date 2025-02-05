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
        }
    };

    self.quantityHasFocus = ko.observable(false);

    self.addingProductToBasket = ko.observable();

    self.productFilterOptions = ko.observable({

    });

    self.allowStockCheckRequest = ko.observable(false);

    self.message = ko.observable();

    self.cssClass = ko.observable();

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
            ko.cleanNode(self.quantity.DOMElement);

            ko.applyBindings(self.quantityParams, self.quantity.DOMElement);
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