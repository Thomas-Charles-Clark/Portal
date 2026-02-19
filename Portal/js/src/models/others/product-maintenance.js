'use strict';

const PRODUCT_MAINTENANCE_MODE_PRODUCTS = 1,
    PRODUCT_MAINTENANCE_MODE_TREATMENTS = 2

const productMaintenanceBaseViewModel = ((formJson, dataJson) => {
    let self = {
        formJson: formJson,
        dataJson: dataJson
    };

    //#region Properties

    self.mode = ko.observable(PRODUCT_MAINTENANCE_MODE_PRODUCTS);

    self.product = ko.observable();

    //#endregion


    //#region Computeds



    //#endregion


    //#region Components

    self.forms = self.formJson.map(fj => formFactory.createForm(fj, self.dataJson));// formFactory.createForm(self.formJson);

    //self.fabricTreatmentFactory = new fabricTreatmentFactory(self);

    // product autocompleter
    self.productAutocomplete = {
        label: 'Product - Search by Code or Name',
        observable: ko.observable(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        enterKeyFunction: function () {
            $(self.productAutocomplete.observable.DOMElement).autocomplete('search');
        },
        clearFunction: function () {
            self.product(undefined);
            self.productAutocomplete.observable(undefined);
            $(self.productAutocomplete.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        },
        autocompleteSettings: {
            value: self.product,
            appendTo: 'body',
            mapFunction: function (i) {
                return {
                    label: i.Name,
                    value: i.Key,
                    obj: i
                }
            },
            source: function (request, response) {
                var data = {
                    searchTerm: request.term
                };
                console.trace(data);
                $.ajax({
                    url: '/api/ProductMaintenanceAPI/ProductAutocomplete',
                    type: "POST",
                    dataType: "json",
                    data: data,
                    success: function (data) {
                        console.trace(data);
                        response($.map(data, function (item) {
                            return {
                                label: `${item.Key} - ${item.BasketName}`,
                                value: item.Key,
                                obj: item
                            };
                        }));
                    }
                });
            },
            minLength: 1,
            select: function (event, ui) {
                event.preventDefault();
                self.product(productViewModel(ui.item.obj, self));
                $(self.productAutocomplete.observable.DOMElement).val(ui.item.label);
            },
            autoFocus: true
        }
    };

    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Validation Groups



    //#endregion


    //#region Functions

    self.productsMode = () => {
        self.mode(PRODUCT_MAINTENANCE_MODE_PRODUCTS);
    }

    self.treatmentsMode = () => {
        self.mode(PRODUCT_MAINTENANCE_MODE_TREATMENTS);
    }

    self.ready = () => {
        self.forms.forEach(f => f.init());
    }

    self.reset = () => {
        console.log('productMaintenanceBaseViewModel reset called', self);
        self.mode(PRODUCT_MAINTENANCE_MODE_PRODUCTS);
        self.treatmentFactory.reset();
    }

    //#endregion

    //#region Events


    //#endregion

    return self;
});

const productViewModel = ((data, parent) => {
    let self = Object.assign(data, {
        parent: parent
    });

    //#region Properties



    //#endregion


    //#region Computeds



    //#endregion


    //#region Components



    //#endregion


    //#region Subscriptions



    //#endregion


    //#region Validation Groups



    //#endregion


    //#region Functions



    //#endregion


    //#region Events



    //#endregion

    return self;
});