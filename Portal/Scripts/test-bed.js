var testBedViewModel = function () {
    var self = this;

    self.validateNow = ko.observable(false);

    self.customAddress = new addressViewModel({
        labelClass: 'delivery-address-label',
        controlClass: 'form-control mdc-text-field__input',
        defaultCountry: undefined,
        validateNow: self.validateNow,
        labelValidation: {
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Please provide a Label'
            }
        },
        nameValidation: {
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Please provide a Name'
            }
        },
        addressLine1Validation: {
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Please provide Address Line 1'
            }
        },
        townValidation: {
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Please provide a Town'
            }
        },
        postcodeValidation: {
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Please provide a Postcode'
            }
        },
        countryValidation: {
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                message: 'Please select a Country'
            }
        }
    });

    self.mdcTextField = {
        label: 'MDC TextField Debugging',
        observable: ko.observable().extend({
            required: {
                params: true,
                onlyIf: function() {
                    return self.validateNow()
                },
                message: 'This field is required.'
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

    self.mdcSelectField = {
        observable: ko.observable().extend({
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow()
                },
                messages: 'This field is required too.'
            }
        }),
        label: 'Vegetables', // do we want a label, or an options caption... or both...?
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        options: [{
            name: 'Apples',
            value: 1
        }, {
            name: 'Oranges',
            value: 2
        }, {
            name: 'Pears',
            value: 3
        }],
        optionsText: 'name',
        optionsValue: 'value',
        optionsCaption: ' '
    }

    self.mdcKendoDropDownListWidget = ko.observable();

    self.mdcKendoDropDownDataItem = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateNow()
            },
            message: 'Please select a Country.'
        }
    });

    self.mdcKendoDropDownList = {
        observable: self.mdcKendoDropDownDataItem,
        showClear: false,
        width: '200px',
        label: 'Country',
        valuePrimitive: true,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        controlClass: 'form-control',
        dropDownListSettings: {
            value: self.mdcKendoDropDownDataItem,
            dataValueField: 'CountryID',
            dataTextField: 'Name',
            widget: self.mdcKendoDropDownListWidget,
            open: function (e) {
                console.log(e);
                $(e.sender._widgetOptions.value.mdcSelect.root_).toggleClass('mdc-select--focused');
                e.sender._widgetOptions.value.mdcSelect.label_.float(true);
                e.sender._widgetOptions.value.mdcSelect.getDefaultFoundation().adapter_.notchOutline(e.sender._widgetOptions.value.mdcSelect.getDefaultFoundation().adapter_.getLabelWidth() * 0.75);
            },
            close: function (e) {
                if (e.sender.value()) {

                } else {
                    e.sender._widgetOptions.value.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                    e.sender._widgetOptions.value.mdcSelect.label_.float(false);
                }
                $(e.sender._widgetOptions.value.mdcSelect.root_).toggleClass('mdc-select--focused');
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
            autoBind: false,
            optionLabel: ' ',
            filter: 'startswith'
        },
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            self.dropDownListSettings.widget().value('');
            self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
            self.dropDownListSettings.widget()._widgetOptions.value.mdcSelect.label_.float(false);
        }
    }

    self.errors = ko.validation.group([
        //self.mdcTextField.observable,
        //self.mdcSelectField.observable,
        //self.mdcKendoDropDownList.observable,
        self.customAddress
    ], {
        deep: true
    });

    self.foo = function () {
        self.validateNow(true);
        self.errors.showAllMessages(false);
        if (self.errors().length) {
            self.errors.showAllMessages(true);
            console.log('failure');
            return;
        } else {
            console.log('success');
        }
    }
}