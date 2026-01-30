const supplierPaymentsApprovalsBasketViewModel = ({
    ready,
    busy,
    busyMessage
} = {
    ready: ko.observable(false),
    busy: ko.observable(false),
    busyMessage: ko.observable('Please Wait')
}) => {

    let self = {};

    //#region Properties

    self.ready = ready;

    self.busy = busy;

    self.busyMessage = busyMessage;

    self.basketElement = document.querySelector('#basket-sidebar');

    self.items = ko.observableArray([]);

    //#endregion



    //#region Components

    self.errors = new ko.validation.group([

    ]);

    //#endregion



    //#region Computeds

    self.paymentPlans = ko.computed(() => {
        return self.items().filter(i => ko.unwrap(i.paymentRequestStatusId) == 7);
    }, self);

    self.otherPayments = ko.computed(() => {
        return self.items().filter(i => ko.unwrap(i.paymentRequestStatusId) != 7);
    }, self);

    self.countDisplay = ko.computed(() => {

        let count = self.items().length;

        if (count == 0)
            return '(empty)';

        if (count == 1)
            return '(1 item)'

        if (count > 1) {
            return `(${count} items)`
        }

    }, self);

    self.canClearBasket = ko.computed(() => {
        return self.items().length != 0;
    }, self);

    //#endregion



    //#region Subscriptions



    //#endregion



    //#region Methods

    self.clear = () => {
        window.showConfirm('Are you sure?', 'This will clear all the items from your basket.', () => {
            self.items([]);
        }, null)
    }

    self.togglePinning = (data, event) => {
        self.basketElement.classList.toggle('pinned');
        event && event.target.closest('button') && event.target.closest('button').blur();
    }

    self.addBasketItem = (item) => {
        item.busy(true);

        let data = {
            paymentRequestId: item.PaymentRequestID,
            amountApprovedInCurrency: item.amountApprovedInCurrency(),
            exchangeRate: item.exchangeRate(),
            amountApprovedInSterling: item.amountApprovedInSterling()
        }

        console.log('addBasketItem', data);

        fetch('/api/SupplierPayments/AddBasketItem', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                item.busy(false);
                item.PaymentDecisionID = data.PaymentDecisionID;
            })
            .catch(err => {
                item.busy(false);
                window.catchFetchError(err);
            })
    }

    self.updateBasketItem = (item) => {
        item.busy(true);

        let data = {
            paymentDecisionId: item.PaymentDecisionID,
            paymentRequestId: item.PaymentRequestID,
            amountApprovedInCurrency: item.amountApprovedInCurrency(),
            exchangeRate: item.exchangeRate(),
            amountApprovedInSterling: item.amountApprovedInSterling()
        }

        console.log('updateBasketItem', data);

        fetch('/api/SupplierPayments/UpdateBasketItem', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                item.busy(false);
            })
            .catch(err => {
                item.busy(false);
                window.catchFetchError(err);
            })
    }

    self.removeBasketItem = (item) => {
        item.busy(true);

        let data = {
            paymentDecisionId: item.PaymentDecisionID,
            paymentRequestId: item.PaymentRequestID,
            amountApprovedInCurrency: item.amountApprovedInCurrency(),
            exchangeRate: item.exchangeRate(),
            amountApprovedInSterling: item.amountApprovedInSterling()
        }

        console.log('removeBasketItem', data);

        fetch('/api/SupplierPayments/RemoveBasketItem', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                item.busy(false)
                self.items.remove(item);
            })
            .catch(err => {
                item.busy(false);
                window.catchFetchError(err);
            })
    }

    //#endregion



    //#region Events



    //#endregion


    return self;
};