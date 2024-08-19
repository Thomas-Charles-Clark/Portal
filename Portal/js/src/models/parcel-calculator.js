'use strict';

const yesNoOptions = [{
    Name: 'Yes',
    Value: 'true'
}, {
    Name: 'No',
    Value: 'false'
}];

const parcelCalculatorViewModel = (() => {
    let self = {};

    //#region Properties

    self.tradeAccountSelector = new tradeAccountSelector(getPreselectedTradeAccount());

    self.tradeAccount = self.tradeAccountSelector.selected;

    self.busy = ko.observable(false);

    self.destinationCountry = ko.observable();

    self.destinationCountryId = ko.observable(81);
    
    self.parcelType = ko.observable();

    self.parcelTypeId = ko.observable(1);

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

    self.parcelWeightKg = ko.observable(5).extend(self.lengthFormatting);

    self.parcelLengthCm = ko.observable(156).extend(self.lengthFormatting);

    self.parcelWidthCm = ko.observable(50).extend(self.lengthFormatting);

    self.parcelHeightCm = ko.observable(80).extend(self.lengthFormatting);

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

    self.countryParams = kendoMDCDropDownList({
        skipCascade: true,
        label: 'Destination Country',
        odata: true,
        endPoint: '/odata/Countries',
        textField: 'Name',
        valueField: 'CountryID',
        virtual: false,
        idObservable: self.destinationCountryId,
        objObservable: self.destinationCountry,
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
        endPoint: '/odata/DeliveryServices',
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

    self.overmaxAppliedParams = kendoMDCDropDownList({
        label: 'Overmax Applied?',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.overmaxApplied,
        objObservable: ko.observable(),
        enable: ko.observable(false),
        disable: ko.observable(true),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        popupSettings: {
            appendTo: document.getElementById('apply-overmax-prefilter')
        }
    });

    self.largePacketAppliedParams = kendoMDCDropDownList({
        label: 'Large Packet Applied?',
        data: yesNoOptions,
        textField: 'Name',
        valueField: 'Value',
        idObservable: self.largePacketApplied,
        objObservable: ko.observable(),
        enable: ko.observable(false),
        disable: ko.observable(true),
        clearable: ko.observable(true),
        revertible: ko.observable(false),
        readOnly: false,
        filter: 'contains',
        autoBind: true,
        height: 340,
        clearFunction: self.genericUnsavedChangesClear,
        template: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        valueTemplate: (e) => {
            return `<span title="${e.Name}">${e.Name}</span>`
        },
        popupSettings: {
            appendTo: document.getElementById('apply-overmax-prefilter')
        }
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

    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Computeds

    self.computed = ko.computed(() => {
        return self.destinationCountryId() &&
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

            return Math.round((l * w * h) / 5000);
        }

    }, self);

    self.largePacketApplied = ko.computed(() => {
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
            let l = self.parcelLengthCm();
            let w = self.parcelWidthCm();
            let h = self.parcelHeightCm();

            if (l >= 274) {
                return true;
            }

            if ((w + w * h + h) >= 300) {
                return true;
            }

            return false;
        }
    }, self);
    //#endregion


    //#region Methods

    self.ready = () => {
        self.busy(false);
    }

    //#endregion

    return self;
})