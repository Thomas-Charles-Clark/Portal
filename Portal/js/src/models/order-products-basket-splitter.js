
const basketSplitterViewModel = ((parent) => {

    //#region Properties

    let self = {
        basketId: parent.basketId,
        phase: parent.phase
    };

    self.busy = ko.observable(false);

    self.selectedBasketItems = ko.observableArray([]);

    self.fetchResults = ko.observableArray([]);

    //#endregion


    //#region Components



    //#endregion


    //#region Computeds


    //#endregion


    //#region Subscriptions


    //#endregion


    //#region Validation Groups



    //#endregion


    //#region Functions

    self.fetch = () => {

        self.busy(true);

        fetch('/api/componentapi/FetchBasketItemSplitSelect', {
            headers: window.fetchHeaders,
            method: 'POST',
            body: JSON.stringify({
                basketId: self.basketId()
            })
        })
            .then(window.handleFetchResponse)
            .then(data => {
                self.busy(false);
                console.log('FetchBasketItemSplitSelect returned', data);
                self.fetchResults(data.map(d => basketSplitSelectResult(d, data.length, self.selectedBasketItems)));
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
    }

    self.showModal = () => {
        self.reset();
        self.fetch();
        $("#basket-split-modal").modal('show');
    }

    self.closeModal = () => {
        $("#basket-split-modal").modal('hide');
    }

    self.splitBasket = () => {

        let selectedCount = self.selectedBasketItems().length;

        let selectedPlural = selectedCount == 1 ? '' : 's';

        let unselectedCount = self.fetchResults().length - self.selectedBasketItems().length;

        let unselectedPlural = unselectedCount == 1 ? '' : 's';

        window.showConfirm("Are you sure?", `<b>This will allow you to progress this basket with your ${selectedCount} selected product${selectedPlural}.</b><br/><br/>The ${unselectedCount} unselected product${unselectedPlural} will be moved into a new basket for later processing.<br/><br/>This action cannot be undone.`, () => {
            self.confirmedSplit();
        }, () => {

        })
    }

    self.confirmedSplit = () => {
        self.busy(true);

        fetch('/api/componentapi/SplitBasket', {
            headers: window.fetchHeaders,
            method: 'POST',
            body: JSON.stringify({
                basketId: self.basketId(),
                basketItemIds: self.selectedBasketItems()
            })
        })
            .then(window.handleFetchResponse)
            .then(data => {
                self.busy(false);
                console.log('SplitBasket returned', data);

                let count = self.fetchResults().length - self.selectedBasketItems().length;

                let plural = count == 1 ? '' : 's';

                self.phase.valueHasMutated();
                self.closeModal();

                $.info('Basket Split Successful', `<b>Please continue to process this order.</b><br/>The unselected product${plural} have been moved to a new basket, <b>Basket ID ${data}</b>, for later processing.`);
            })
            .catch(err => {
                self.busy(false);
                window.catchFetchError(err);
            })
    }

    self.reset = () => {
        self.busy(false);
        self.selectedBasketItems([]);
    }

    //#endregion


    //#region Events



    //#endregion

    return self;
});

const basketSplitSelectResult = ((data, totalCount, selectionArray) => {
    let self = Object.assign(data, {
        totalCount
    });

    self.checked = ko.observable(false);

    self.selectionArray = selectionArray;

    self.checked.subscribe(nv => {
        if (nv) {
            self.selectionArray.push(self.BasketItemID);
        } else {
            self.selectionArray.remove(self.BasketItemID);
        }
    });

    self.selectionArray.subscribe(nv => {

        if (nv.indexOf(self.BasketItemID) == -1) {

            if (nv.length == (self.totalCount - 1)) {
                self.checkedParams.disabled(true);
            } else {
                self.checkedParams.disabled(false);
            }

        }
    });

    self.checkedParams = {
        label: `${self.ProductName}<br/>${self.ProductCode}`,
        checkboxId: `split-check-${self.BasketItemID}`,
        observable: self.checked,
        originalValue: undefined,
        useNativeValidation: false,
        disabled: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false)
    }

    return self;
});