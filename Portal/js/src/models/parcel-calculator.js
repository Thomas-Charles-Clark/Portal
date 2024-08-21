'use strict';

const yesNoOptions = [{
    Name: 'Yes',
    Value: true
}, {
    Name: 'No',
    Value: false
}];

const parcelCalculatorViewModel = (() => {
    let self = {};

    //#region Properties

    self.tradeAccountSelector = new tradeAccountSelector(getPreselectedTradeAccount());

    self.tradeAccount = self.tradeAccountSelector.selected;

    self.busy = ko.observable(false);

    self.destination = ko.observable();

    self.destinationId = ko.observable();
    
    self.parcelType = ko.observable();

    self.parcelTypeId = ko.observable();

    self.deliveryService = ko.observable();

    self.deliveryServiceId = ko.observable(1);

    self.weightFormatting = {
        numberFormatted: {
            digits: 2,
            currency: {
                FormattingCulture: 'en-GB'
            },
            skipExtraNotify: true
        }
    };

    self.lengthFormatting = {
        numberFormatted: {
            digits: 0,
            currency: {
                FormattingCulture: 'en-GB'
            },
            skipExtraNotify: true
        }
    };

    self.parcelWeightKg = ko.observable().extend(self.lengthFormatting);

    self.parcelLengthCm = ko.observable().extend(self.lengthFormatting);

    self.parcelWidthCm = ko.observable().extend(self.lengthFormatting);

    self.parcelHeightCm = ko.observable().extend(self.lengthFormatting);

    self.residential = ko.observable(true);

    self.addressCorrection = ko.observable(true);

    self.surcharges = window.getSurcharges();

    self.parcelRate = ko.observable();

    self.parcelRateCurrency = ko.observable();

    self.exchangeRate = ko.observable();

    self.exchangeRateToCustomerCurrency = ko.observable();

    self.destinationCurrencyCode = ko.observable();

    self.parcelRateCurrencyCode = ko.observable();

    //#endregion


    //#region Components

    self.genericUnsavedChangesClear = (e) => {
        self.checkUnsavedChangesThenClear(e);
    }

    self.checkUnsavedChangesThenClear = async (options) => {
        await self.unsavedChanges().then(() => {
            var self = options; // self is now the params of the control the user just interacted with

            if (ko.isObservableArray(self.observable)) {
                self.observable([]);
            } else {
                self.observable('');
            }
            if (self.dropDownListSettings.widget()) {
                if (ko.isObservableArray(self.observable)) {
                    self.dropDownListSettings.widget().value([]);
                } else {
                    self.dropDownListSettings.widget().value('');
                }
                self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                if (self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.label_ != null)
                    self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.label_.float(false);
            }
            if (typeof self.afterClear === 'function') {
                self.afterClear();
            }
        }).catch((e) => {
            console.error(e);
        });
    }

    self.unsavedChanges = () => {
        return new Promise((resolve, reject) => {

            let array = [{
                unsavedChanges: () => false
            }];

            //switch (self.view()) {
            //    case VIEW_MANAGE:
            //        array = self.filledRecords.peek();
            //        break;
            //    case VIEW_ADD:
            //        array = self.addFilledRecords.peek();
            //        break;
            //    default: break;
            //}

            let unsaved = false;// array.find(p => p.unsavedChanges());

            if (unsaved) {
                window.showConfirm('Unsaved changes', 'You have unsaved changes. If you proceed your changes will be lost. Proceed?', () => {
                    resolve();
                }, () => {
                    reject();
                });
            } else {
                resolve();
            }
        });
    }

    self.destinationParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Destination',
        odata: true,
        endPoint: '/odata/ParcelDestinations',
        textField: 'Name',
        valueField: 'DestinationID',
        virtual: false,
        idObservable: self.destinationId,
        objObservable: self.destination,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'Name'
        },
        select: function (e) {
            console.log('countryParams select', e);
        },
        clearFunction: self.genericUnsavedChangesClear
    });

    self.parcelTypeParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Parcel Type',
        odata: true,
        endPoint: '/odata/ParcelTypes',
        textField: 'Name',
        valueField: 'ParcelTypeID',
        virtual: false,
        idObservable: self.parcelTypeId,
        objObservable: self.parcelType,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'Name'
        },
        select: function (e) {
            console.log('parcelType select', e);
        },
        clearFunction: self.genericUnsavedChangesClear
    });

    self.deliveryServiceParams = kendoMDCDropDownList({
        label: 'Delivery Service',
        odata: true,
        endPoint: '/odata/ParcelDeliveryServices',
        textField: 'Name',
        valueField: 'DeliveryServiceID',
        virtual: false,
        idObservable: self.deliveryServiceId,
        objObservable: self.deliveryService,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(false),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        sort: {
            dir: 'asc',
            field: 'Name'
        },
        select: function (e) {
            console.log('deliveryService select', e);
        },
        clearFunction: self.genericUnsavedChangesClear
    });

    self.parcelWeightParams = {
        label: 'Parcel Weight (kg)',
        observable: self.parcelWeightKg,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: true,
        showClear: false,
        busy: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        revertible: false,
        clearable: true,
        buttons: false,
        inputType: 'text',
        minValue: 0.5,
        maxValue: 999999,
        step: 1,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            self.observable.DOMElement.focus();
        },
    }

    self.parcelLengthParams = {
        label: 'Parcel Length (cm)',
        observable: self.parcelLengthCm,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: true,
        showClear: false,
        busy: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        revertible: false,
        clearable: true,
        buttons: false,
        inputType: 'text',
        minValue: 0.5,
        maxValue: 999999,
        step: 1,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            self.observable.DOMElement.focus();
        },
    }

    self.parcelWidthParams = {
        label: 'Parcel Width (cm)',
        observable: self.parcelWidthCm,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: true,
        showClear: false,
        busy: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        revertible: false,
        clearable: true,
        buttons: false,
        inputType: 'text',
        minValue: 0.5,
        maxValue: 999999,
        step: 1,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            self.observable.DOMElement.focus();
        },
    }

    self.parcelHeightParams = {
        label: 'Parcel Height (cm)',
        observable: self.parcelHeightCm,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: true,
        showClear: false,
        busy: ko.observable(false),
        enable: ko.observable(true),
        disable: ko.observable(false),
        revertible: false,
        clearable: true,
        buttons: false,
        inputType: 'text',
        minValue: 0.5,
        maxValue: 999999,
        step: 1,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            self.observable.DOMElement.focus();
        },
    }

    self.residentialParams = kendoMDCDropDownList({
        label: 'Residential?',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.residential,
        objObservable: ko.observable(),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        }
    });

    self.addressCorrectionParams = kendoMDCDropDownList({
        label: 'Address Correction?',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.addressCorrection,
        objObservable: ko.observable(),
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        }
    });

    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Computeds

    self.computed = ko.computed(() => {
        return self.destinationId() &&
            self.parcelTypeId() && 
            self.deliveryServiceId() && 
            self.parcelWeightKg() &&
            self.parcelWidthCm() &&
            self.parcelLengthCm() &&
            self.parcelHeightCm();
    }, self);

    self.volumetricWeightKg = ko.computed(() => {

        if (self.computed()) {
            let l = self.parcelLengthCm();
            let w = self.parcelWidthCm();
            let h = self.parcelHeightCm();

            return Math.ceil((l * w * h) / 5000);
        }

    }, self);

    self.largePacketApplied = ko.computed(() => {
        
        if (self.computed()) {
            let l = self.parcelLengthCm();
            let w = self.parcelWidthCm();
            let h = self.parcelHeightCm();

            let threshold = 335;

            if (l + (w + w * h + h) > threshold) {
                return true;
            }
        }

        return false;

    }, self);

    self.deliveryServiceParcelWeightKg = ko.computed(() => {

        if (self.computed()) {

            let thresholdWeightKg = 40;

            let parcelWeightKg = self.parcelWeightKg();

            let volumetricWeightKg = self.volumetricWeightKg();

            let heavierWeightKg = null;

            if (parcelWeightKg >= volumetricWeightKg) {
                heavierWeightKg = parcelWeightKg;
            } else {
                heavierWeightKg = volumetricWeightKg;
            }

            if (self.largePacketApplied()) {
                if (heavierWeightKg > thresholdWeightKg)
                    return heavierWeightKg;
                else
                    return thresholdWeightKg;
            } else {
                return heavierWeightKg;
            }
        }

    }, self);

    self.parcelChargesCount = ko.computed(() => {

    }, self);

    self.overmaxApplied = ko.computed(() => {
        if (self.computed()) {
            let k = self.parcelWeightKg();
            let l = self.parcelLengthCm();
            let w = self.parcelWidthCm();
            let h = self.parcelHeightCm();

            if (l > 274) { // maximum parcel length is 274cm
                return true;
            }

            if ((w + w * h + h) >= 400) { // maximum parcel size is 400cm in length and girth combined
                return true;
            }

            if (k > 70) { // maximum parcel weight is 70kg
                return true;
            }

            return false;
        }
    }, self);

    self.additionalHandlingCharge = ko.computed(() => {
        if (self.deliveryServiceId()) {
            return self.surcharges.find(s => s.DeliveryServiceID == self.deliveryServiceId() && s.SurchargeID == 1).DGRate;
        } else {
            return 0;
        }
    }, self);

    self.overmaxCharge = ko.computed(() => {
        if (self.deliveryServiceId() && self.overmaxApplied()) {
            return self.surcharges.find(s => s.DeliveryServiceID == self.deliveryServiceId() && s.SurchargeID == 2).DGRate;
        } else {
            return 0;
        }
    }, self);

    self.largePacketCharge = ko.computed(() => {
        if (self.deliveryServiceId() && self.largePacketApplied()) {
            return self.surcharges.find(s => s.DeliveryServiceID == self.deliveryServiceId() && s.SurchargeID == 3).DGRate;
        } else {
            return 0;
        }
    }, self);

    self.residentialCharge = ko.computed(() => {
        if (self.deliveryServiceId() && self.residential()) {
            return self.surcharges.find(s => s.DeliveryServiceID == self.deliveryServiceId() && s.SurchargeID == 4).DGRate;
        } else {
            return 0;
        }
    }, self);

    self.addressCorrectionCharge = ko.computed(() => {
        if (self.deliveryServiceId() && self.addressCorrection()) {
            return self.surcharges.find(s => s.DeliveryServiceID == self.deliveryServiceId() && s.SurchargeID == 5).DGRate;
        } else {
            return 0;
        }
    }, self);

    self.chargeLimitParcelCount = ko.computed(() => {
        if (self.deliveryServiceParcelWeightKg() && self.deliveryService()) {
            return Math.ceil(self.deliveryServiceParcelWeightKg() / self.deliveryService().ParcelWeightChargeLimit);
        }
    }, self);

    self.finalCharge = ko.computed(() => {
        if (self.computed()) {
            let parcelRate = self.parcelRate();
            let parcelCount = self.chargeLimitParcelCount();
            let overmaxCharge = self.overmaxCharge();
            let largePacketCharge = self.largePacketCharge();
            let residentialCharge = self.residentialCharge();
            let addressCorrectionCharge = self.addressCorrectionCharge();

            return formatNumber(
                    (
                        (parcelRate * parcelCount) +
                        overmaxCharge +
                        largePacketCharge + 
                        residentialCharge + 
                        addressCorrectionCharge
                    )
                    * self.exchangeRateToCustomerCurrency(), 2, 'en-GB');
        }
    }, self);

    //#endregion


    //#region Methods

    self.ready = () => {
        self.busy(false);
    }

    self.fetchExchangeRateToCustomerCurrency = ko.computed(() => {

        if (self.tradeAccount()) {

        let params = {
            mertexCurrencyCode: self.tradeAccount().MertexCurrencyCode
        }

        fetch('/api/parcelCalculatorApi/FetchExchangeRateToCustomerCurrency', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            body: JSON.stringify(params)
        })
            .then(window.handleFetchResponse)
            .then(data => {
                if (data != null) {
                    //self.exchangeRate(data.SterlingExchangeRate);
                    self.exchangeRateToCustomerCurrency(data.SterlingExchangeRate);
                } else {
                    window.showError(`No exchange rate was found from GBP to ${params.currencyCode}.`);
                }
            })
            .catch(window.catchFetchError)
        }
    }, self);

    self.fetchParcelRate = ko.computed(() => {

        if (self.tradeAccount() &&
            self.destinationId() &&
            self.parcelTypeId()) {

            let params = {
                destinationId: self.destinationId(),
                tradeAccountCurrencyCode: self.tradeAccount().MertexCurrencyCode,
                parcelTypeId: self.parcelTypeId()
            };

            fetch('/api/parcelCalculatorApi/FetchRate', {
                method: 'POST',
                headers: window.fetchHeaders,
                cache: 'no-cache',
                body: JSON.stringify(params)
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    if (data != null) {
                        self.parcelRateCurrencyCode(data.ExchangeRate.MertexCurrencyCode);

                        self.exchangeRate(data.ExchangeRate.SterlingExchangeRate);

                        self.parcelRateCurrency(data.PriceCurrency);

                        self.parcelRate(Math.round((data.PriceCurrency / self.exchangeRate()) * 100) / 100);
                    } else {
                        window.showInfo("No Parcel Rate", "No rate exists for this combination of Destination, Currency and Parcel Type.");
                    }
                })
                .catch(window.catchFetchError)
        }

    }, self);

    //self.rateComputer = ko.computed(() => {
    //    let rate = self.parcelRateCurrency();
    //    let exchangeRate = self.exchangeRate();
    //    if (rate && exchangeRate) {
    //        self.parcelRate(Math.round((rate / exchangeRate) * 100) / 100);
    //    }
    //}, self);

    self.setTest = () => {
        self.destinationId(16);
        self.parcelTypeId(1);
        self.parcelWeightKg(6);
        self.parcelLengthCm(80);
        self.parcelWidthCm(30);
        self.parcelHeightCm(40);
    }

    //#endregion

    return self;
})