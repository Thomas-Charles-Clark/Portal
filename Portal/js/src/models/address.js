var addressViewModel = function (options) {
    var self = this;

    options = options || {};

    self.forbiddenDestinationCountries = options.forbiddenDestinationCountries || ko.observableArray([]);

    self.watchingCountryIdForRestrictions = ko.observable(false);

    self.manual = ko.observable(false); // when ELSE should I set  this to true,
    // besides "Enter Address Manually" click?
    // useful to know?

    self.manual.subscribe(function (newValue) {
        console.log('address manual subscribe hit', newValue);
        if (newValue) {
            self.detectChanges();
        }
    });

    self.isDefaultDeliveryAddress = ko.observable(false);

    self.tradeAccountAddressId = ko.observable();

    self.cleansedAddress = ko.observable(false);

    self.defaultCountry = options.defaultCountry;

    self.labelClass = options.labelClass;

    self.controlClass = options.controlClass;

    self.deliveryReference = ko.observable();

    self.promptForOverwrite = ko.observable(false);

    self.havePerformedLoqateSearch = ko.observable(false);

    self.deliveryReference.subscribe(function (newValue) {
        console.log('addressViewModel deliveryReference subscribe hit', newValue);
    });

    self.validateNow = options.validateNow || ko.observable(false);

    self.includeEU = typeof options.includeEU === 'undefined' ? true : options.includeEU;

    self.subscriptions = [];

    self.clearCleanseSubscriptions = [];

    self.cleanseResultAccepted = ko.observable(false);

    self.cleanseResultAccepted.subscribe(function (newValue) {
        console.log('addressViewModel cleansedResultAccepted subscribe hit', newValue);
    });

    self.loqateAddress = ko.observable(false);

    self.loqateAddress.subscribe(function (newValue) {
        console.log('loqateAddress subscribe hit', newValue);
        if (!newValue) {
            self.manual(true);
        }
    });

    self.changed = ko.observable(false);

    self.changesHappened = function (loqateRelated) {
        //console.log('address changesHappened');

        if (JSON.stringify(self.getState()) === JSON.stringify(self.initialState())) {
            self.changed(false);
            self.promptForOverwrite(false);
        } else {
            self.changed(true);
            self.promptForOverwrite(true);
        }

        //if (!self.promptForOverwrite())
        //    self.promptForOverwrite(true);

        if (loqateRelated)
            self.loqateAddress(false);
    }

    self.removeDeliveryReferenceSubscriptions = function () {
        for (var i = 0; i < self.subscriptions.length; i++) {
            self.subscriptions[i].dispose();
        }
    }

    self.removeCleanseSubscriptions = function () {
        for (var i = 0; i < self.clearCleanseSubscriptions.length; i++) {
            self.clearCleanseSubscriptions[i].dispose();
        }
    }

    if (options.companyNameValidation == null)
        options.companyNameValidation = {
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow() && (self.name.observable() == null)
                },
                message: 'Please provide a Company Name',
            }
        };

    if (options.nameValidation == null)
        options.nameValidation = {
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow() && (self.companyName.observable() == null)
                },
                message: 'Please provide a Name'
            }
        };

    if (options.addressLine1Validation == null)
        options.addressLine1Validation = {
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow();
                },
                message: 'Please provide Address Line 1'
            }
        };

    if (options.townValidation == null)
        options.townValidation = {
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow();
                },
                message: 'Please provide a Town'
            }
        };

    if (options.postcodeValidation == null)
        options.postcodeValidation = {
            required: {
                params: true,
                onlyIf: function () {
                    if (self.validateNow()) {
                        if (self.country()) {
                            // No postcode? No problem!
                            if (!self.country().Postcode) {
                                return false;
                            } else {
                                return true;
                            }
                        } else {
                            return true;
                        }
                    } else {
                        return false;
                    }
                },
                message: 'Please provide a Postcode'
            }
        };

    if (options.countryValidation == null)
        options.countryValidation = {
            required: {
                params: true,
                onlyIf: function () {
                    return self.validateNow();
                },
                message: 'Please select a Country'
            }
        };

    if (options.emailValidation == null)
        options.emailValidation = {
            emailList: {
                params: true,
                message: 'Invalid Email(s)'
            }
        }

    self.companyName = {
        label: ko.observable('Company Name'),
        observable: ko.observable().extend(options.companyNameValidation),
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
        },
        readOnly: ko.observable(false),
        disabled: ko.observable(false)
    };

    self.name = {
        label: ko.observable('Name'),
        observable: ko.observable().extend(options.nameValidation),
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
        },
        readOnly: ko.observable(false),
        disabled: ko.observable(false)
    };

    self.addressLine1 = {
        label: ko.observable('Address Line 1'),
        observable: ko.observable().extend(options.addressLine1Validation),
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
            maxLength: 60
        },
        readOnly: ko.observable(false),
        disabled: ko.observable(false)
    };

    self.addressLine2 = {
        label: ko.observable('Address Line 2'),
        observable: ko.observable().extend(options.addressLine2Validation),
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
            maxLength: 60
        },
        readOnly: ko.observable(false),
        disabled: ko.observable(false)
    };

    self.town = {
        label: ko.observable('Town'),
        observable: ko.observable().extend(options.townValidation),
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
        },
        readOnly: ko.observable(false),
        disabled: ko.observable(false)
    };

    self.county = {
        label: ko.observable('County'),
        observable: ko.observable().extend(options.countyValidation),
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
            maxLength: 40
        },
        readOnly: ko.observable(false),
        disabled: ko.observable(false)
    };

    self.postcode = {
        label: ko.observable('Postcode'),
        observable: ko.observable().extend(options.postcodeValidation),
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
        },
        readOnly: ko.observable(false),
        disabled: ko.observable(false)
    };

    self.addressSearchCountry = ko.observable();

    self.addressSearch = ko.observable().extend();

    self.country = ko.observable().extend(options.countryValidation);

    self.phone = {
        label: ko.observable('Phone Number'),
        observable: ko.observable().extend(options.phoneValidation),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        visible: ko.observable(options.phoneIntlMobile),
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
            self.observable.isValid.notifySubscribers(true);
        },
        charsRemainingOptions: {
            maxLength: 20
        },
        intlMobile: options.phoneIntlMobile,
        validateNow: self.validateNow,
        numberType: intlTelInputUtils.numberType.FIXED_LINE,
        placeholderNumberType: 'FIXED_LINE',
        readOnly: ko.observable(false),
        disabled: ko.observable(false)
    };

    self.email = {
        label: ko.observable('Email'),
        observable: ko.observable().extend(options.emailValidation),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        visible: ko.observable(typeof options.email === 'undefined' ? false : options.email),
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
            self.observable.isValid.notifySubscribers(true);
        },
        readOnly: ko.observable(false),
        disabled: ko.observable(false)
    };

    if (options.phoneIntlMobile) {
        self.phone.intlMobile = options.phoneIntlMobile;
        self.phone.countryObservable = self.country;
        self.phone.preferredCountries = options.phoneIntlPreferredCountries || ['gb'];

        self.country.subscribe(function (newValue) {
            if (newValue) {
                window.setTimeout(function () {
                    if (self.phone.observable.hasOwnProperty('intlTel')) {
                        if (newValue.Code != null) {
                            self.phone.observable.intlTel.setCountry(newValue.Code.toLowerCase());
                        }
                        if (self.phone.observable.hasOwnProperty('mdcTextField')) {
                            self.phone.observable.mdcTextField.label_.float(true);
                            self.phone.observable.mdcTextField.getDefaultFoundation().adapter_.notchOutline(
                                self.phone.observable.mdcTextField.getDefaultFoundation().adapter_.getLabelWidth() * 0.75
                            );
                        }
                    }
                }, 100);
            } else {
                window.setTimeout(function () {
                    if (self.phone.observable.hasOwnProperty('intlTel')) {
                        self.phone.observable.intlTel.setCountry('gb');
                    }
                    if (self.phone.observable.hasOwnProperty('mdcTextField')) {
                        self.phone.observable.mdcTextField.label_.float(true);
                        self.phone.observable.mdcTextField.getDefaultFoundation().adapter_.notchOutline(
                            self.phone.observable.mdcTextField.getDefaultFoundation().adapter_.getLabelWidth() * 0.75
                        );
                    }
                }, 100);
            }
        });
    }

    self.pcaLookup = {
        label: 'Search for an Address',
        observable: self.addressSearch,
        mapFunction: function (line1, line2, line3, line4, postcode) {
            self.name.observable(undefined);
            self.addressLine1.observable(undefined);
            self.addressLine2.observable(undefined);
            self.town.observable(undefined);
            self.county.observable(undefined);
            self.postcode.observable(undefined);

            if (line1) {
                self.addressLine1.observable(line1);
            }

            if (line2) {
                self.addressLine2.observable(line2);
            }

            if (line3) {
                self.town.observable(line3);
            }

            if (line4) {
                self.county.observable(line4);
            }

            if (postcode) {
                self.postcode.observable(postcode);
            }

            self.countryWidget().value(self.addressSearchCountryId());
            window.setTimeout(function () {
                self.countryWidget().trigger('change');
            }, 0);

            if (ko.isObservable(self.validateNow)) {
                self.validateNow(true);
            }
        },
        country: self.addressSearchCountry,
        position: { my: "right top", at: "right bottom", collision: "none" },
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        }
    };

    self.validateNow.subscribe(function (newValue) {
        if (newValue) {
            self.notifySubscribers();
        }
    });

    self.isValid = function () {

        let hasPhoneErrored = false;

        if (self.phone.intlMobile) {
            if (self.phone.observable.hasOwnProperty('intlTel')) {
                if (self.phone.observable.intlTel.getNumber()) {
                    if (!self.phone.observable.intlTel.isValidNumber()) {
                        hasPhoneErrored = true;
                        self.phone.observable.isValid.notifySubscribers(false);
                    }
                }
            }
        }

        if ((self.errors().length == 0) && (hasPhoneErrored == false)) {
            return true;
        } else {
            self.notifySubscribers();
            return false;
        }
    }

    self.countryId = ko.observable(options.defaultCountry).extend(options.countryValidation);

    self.countryId.subscribe(function (newValue) {

        if (newValue && self.watchingCountryIdForRestrictions()) {
            var forbid = Enumerable.From(self.forbiddenDestinationCountries()).Where(function (x) {
                return x.CountryID == newValue;
            }).FirstOrDefault();

            if (forbid != null) {
                $.error('Destination Country Not Permitted', forbid.Reason, null, function () {
                    self.countryId(undefined);
                    self.countryDropDownList.clearFunction();
                });
                return;
            }
        }

        console.log('address countryId subscribe hit', newValue);
        if (self.countryWidget()) {
            if (newValue) {
                if (!$(self.countryWidget()._widgetOptions.dataItem.mdcSelect.label_.root_).hasClass('mdc-floating-label--float-above')) {
                    self.countryWidget()._widgetOptions.dataItem.mdcSelect.label_.float(true);
                    self.countryWidget()._widgetOptions.dataItem.mdcSelect.getDefaultFoundation().adapter_.notchOutline(self.countryWidget()._widgetOptions.dataItem.mdcSelect.getDefaultFoundation().adapter_.getLabelWidth() * 0.75);
                }
            } else {
                self.countryWidget()._widgetOptions.dataItem.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                self.countryWidget()._widgetOptions.dataItem.mdcSelect.label_.float(false);
            }
        }
    });

    self.addressSearchCountryId = ko.observable(options.defaultCountry);

    self.addressSearchCountryId.subscribe(function (newValue) {
        if (newValue) {
            if (self.addressSearchCountryWidget()) {
                if (!$(self.addressSearchCountryWidget()._widgetOptions.dataItem.mdcSelect.label_.root_).hasClass('mdc-floating-label--float-above')) {
                    self.addressSearchCountryWidget()._widgetOptions.dataItem.mdcSelect.label_.float(true);
                    self.addressSearchCountryWidget()._widgetOptions.dataItem.mdcSelect.getDefaultFoundation().adapter_.notchOutline(self.addressSearchCountryWidget()._widgetOptions.dataItem.mdcSelect.getDefaultFoundation().adapter_.getLabelWidth() * 0.75);
                }
            }
        } else {
            if (self.addressSearchCountryWidget()) {
                self.addressSearchCountryWidget()._widgetOptions.dataItem.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                self.addressSearchCountryWidget()._widgetOptions.dataItem.mdcSelect.label_.float(false);
            }
        }
    });

    self.addressSearchCountryWidget = ko.observable();

    self.addressSearchCountryDropDownList = {
        observable: self.addressSearchCountry,
        showClear: false,
        width: '180px',
        label: 'Country',
        valuePrimitive: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        controlClass: 'form-control',
        disabled: ko.observable(false),
        dropDownListSettings: {
            value: self.addressSearchCountryId,
            dataItem: self.addressSearchCountry,
            dataValueField: 'CountryID',
            dataTextField: 'Name',
            widget: self.addressSearchCountryWidget,
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
                        data.includeEU = self.includeEU;
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
            filter: 'startswith'
        },
        clearFunction: function () {
            var self = this;
            self.observable('');
            self.dropDownListSettings.value(undefined);
            if (self.dropDownListSettings.widget()) {
                self.dropDownListSettings.widget().value('');
                self.dropDownListSettings.widget()._widgetOptions.dataItem.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                self.dropDownListSettings.widget()._widgetOptions.dataItem.mdcSelect.label_.float(false);
            }
        }
    }

    self.countryWidget = ko.observable();

    self.countryDropDownList = {
        observable: self.country,
        showClear: false,
        width: '180px',
        label: 'Country',
        valuePrimitive: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        controlClass: 'form-control',
        disabled: ko.observable(false),
        dropDownListSettings: {
            value: self.countryId,
            dataItem: self.country,
            dataValueField: 'CountryID',
            dataTextField: 'Name',
            widget: self.countryWidget,
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
                        data.includeEU = self.includeEU;
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
            filter: 'startswith'
        },
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            if (self.dropDownListSettings.widget()) {
                self.dropDownListSettings.widget().value('');
                self.dropDownListSettings.widget()._widgetOptions.dataItem.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                self.dropDownListSettings.widget()._widgetOptions.dataItem.mdcSelect.label_.float(false);
            }
        }
    }

    self.clearCleanseFields = function () {
        if (self.hasOwnProperty('cleanseResult'))
            self.cleanseResult(undefined);

        if (self.hasOwnProperty('cleansedAddress'))
            self.cleansedAddress(false);

        if (self.hasOwnProperty('cleanseResultAccepted'))
            self.cleanseResultAccepted(false);

        if (self.hasOwnProperty('showManualCleanse')) {
            self.showManualCleanse(true);
            self.havePerformedLoqateSearch(false);
        }
    }

    // when Accept clicked, flag status as Accepted
    // if Accepted, then... no checking again until edit!
    self.detectChangesCleanse = function () {
        self.clearCleanseSubscriptions.push(
            self.addressLine1.observable.subscribe(function (newValue) {
                self.clearCleanseFields();
            })
        );
        self.clearCleanseSubscriptions.push(
            self.addressLine2.observable.subscribe(function (newValue) {
                self.clearCleanseFields();
            })
        );
        self.clearCleanseSubscriptions.push(
            self.town.observable.subscribe(function (newValue) {
                self.clearCleanseFields();
            })
        );
        self.clearCleanseSubscriptions.push(
            self.county.observable.subscribe(function (newValue) {
                self.clearCleanseFields();
            })
        );
        self.clearCleanseSubscriptions.push(
            self.postcode.observable.subscribe(function (newValue) {
                self.clearCleanseFields();
            })
        );
        self.clearCleanseSubscriptions.push(
            self.countryId.subscribe(function (newValue) {
                self.clearCleanseFields();
            })
        );

        self.changed(false);
    }

    self.detectChanges = function () {

        console.log('address detectChanges called');

        self.detectChangesCleanse();

        self.subscriptions.push(
            self.companyName.observable.subscribe(function (newValue) {
                self.changesHappened(false);
            })
        );

        self.subscriptions.push(
            self.phone.observable.subscribe(function (newValue) {
                self.changesHappened(false);
            })
        );

        self.subscriptions.push(
            self.email.observable.subscribe(function (newValue) {
                self.changesHappened(false);
            })
        );

        self.subscriptions.push(
            self.name.observable.subscribe(function (newValue) {
                self.changesHappened(false);
            })
        );

        self.subscriptions.push(
            self.addressLine1.observable.subscribe(function (newValue) {
                self.changesHappened();
            })
        );

        self.subscriptions.push(
            self.addressLine2.observable.subscribe(function (newValue) {
                self.changesHappened();
            })
        );

        self.subscriptions.push(
            self.town.observable.subscribe(function (newValue) {
                self.changesHappened();
            })
        );

        self.subscriptions.push(
            self.county.observable.subscribe(function (newValue) {
                self.changesHappened();
            })
        );

        self.subscriptions.push(
            self.postcode.observable.subscribe(function (newValue) {
                self.changesHappened();
            })
        );

        self.subscriptions.push(
            self.countryId.subscribe(function (newValue) {
                self.changesHappened();
            })
        );

        self.watchingCountryIdForRestrictions(true);

        if (!self.initialState().hasOwnProperty('DeliveryName'))
            self.recordInitialState();
    }

    self.initialState = ko.observable({});

    self.getState = () => {
        return {
            DeliveryName: self.name.observable(),
            DeliveryCompanyName: self.companyName.observable(),
            AddressLine1: self.addressLine1.observable(),
            AddressLine2: self.addressLine2.observable(),
            Town: self.town.observable(),
            County: self.county.observable(),
            Postcode: self.postcode.observable(),
            Country: self.country()
        }
    }

    self.recordInitialState = function () {
        self.initialState(self.getState());
    }

    self.load = function (address) {
        self.reset();

        self.deliveryReference(address.deliveryReference);

        if (self.deliveryReference() == 'C') {
            self.companyName.readOnly(true);
            self.companyName.disabled(true);
            self.name.readOnly(true);
            self.name.disabled(true);
            self.addressLine1.readOnly(true);
            self.addressLine1.disabled(true);
            self.addressLine2.readOnly(true);
            self.addressLine2.disabled(true);
            self.town.readOnly(true);
            self.town.disabled(true);
            self.county.readOnly(true);
            self.county.disabled(true);
            self.postcode.readOnly(true);
            self.postcode.disabled(true);
            self.phone.readOnly(true);
            self.phone.disabled(true);
            self.email.readOnly(true);
            self.email.disabled(true);
            self.addressSearchCountryDropDownList.disabled(true);
            self.countryDropDownList.disabled(true);
        } else {
            self.companyName.readOnly(false);
            self.companyName.disabled(false);
            self.name.readOnly(false);
            self.name.disabled(false);
            self.addressLine1.readOnly(false);
            self.addressLine1.disabled(false);
            self.addressLine2.readOnly(false);
            self.addressLine2.disabled(false);
            self.town.readOnly(false);
            self.town.disabled(false);
            self.county.readOnly(false);
            self.county.disabled(false);
            self.postcode.readOnly(false);
            self.postcode.disabled(false);
            self.phone.readOnly(false);
            self.phone.disabled(false);
            self.email.readOnly(false);
            self.email.disabled(false);
            self.addressSearchCountryDropDownList.disabled(false);
            self.countryDropDownList.disabled(false);
        }

        self.name.observable(address.name);
        self.addressLine1.observable(address.addressLine1);
        self.addressLine2.observable(address.addressLine2);
        self.town.observable(address.town);
        self.county.observable(address.county);
        self.postcode.observable(address.postcode);

        window.setTimeout(function () {
            if (self.countryWidget()) {
                self.countryWidget().bind('dataBound', function () {
                    self.countryWidget().value(address.countryId);
                    self.countryWidget().trigger('change');
                    self.countryWidget().unbind('dataBound');
                    self.detectChanges();
                });
                self.countryWidget().dataSource.read();
            } else {
                self.countryId(address.countryId);
                self.country({
                    Name: address.CountryName || address.countryName,
                    Code: address.CountryCode || address.countryCode,
                    EU: address.EU || address.eu,
                    CountryID: address.CountryID || address.countryId
                });
                self.detectChanges();
            }
        }, 300);

        //if (self.countryWidget() && address.countryId)
        //    self.countryWidget().value(address.countryId);
        //else
        //    self.country(address.country);

        var tags = [];

        if (address.tags != null) {
            for (var i = 0; i < address.tags.length; i++) {
                tags.push(address.tags[i].Tag);
            }
            self.tags(tags);
        }
    }

    self.hide = function () {
        $('#address-edit-modal').modal('hide');
    }

    self.deletable = ko.observable(true);

    self.loadBasketMiscAddress = function (address) {
        return new Promise(function (resolve, reject) {

            self.reset();

            self.deletable(false);

            self.deliveryReference(address.DeliveryReference);

            if (self.deliveryReference() == 'C') {
                self.companyName.readOnly(true);
                self.companyName.disabled(true);
                self.name.readOnly(true);
                self.name.disabled(true);
                self.addressLine1.readOnly(true);
                self.addressLine1.disabled(true);
                self.addressLine2.readOnly(true);
                self.addressLine2.disabled(true);
                self.town.readOnly(true);
                self.town.disabled(true);
                self.county.readOnly(true);
                self.county.disabled(true);
                self.postcode.readOnly(true);
                self.postcode.disabled(true);
                self.phone.readOnly(true);
                self.phone.disabled(true);
                self.email.readOnly(true);
                self.email.disabled(true);
                self.addressSearchCountryDropDownList.disabled(true);
                self.countryDropDownList.disabled(true);
            } else {
                self.companyName.readOnly(false);
                self.companyName.disabled(false);
                self.name.readOnly(false);
                self.name.disabled(false);
                self.addressLine1.readOnly(false);
                self.addressLine1.disabled(false);
                self.addressLine2.readOnly(false);
                self.addressLine2.disabled(false);
                self.town.readOnly(false);
                self.town.disabled(false);
                self.county.readOnly(false);
                self.county.disabled(false);
                self.postcode.readOnly(false);
                self.postcode.disabled(false);
                self.phone.readOnly(false);
                self.phone.disabled(false);
                self.email.readOnly(false);
                self.email.disabled(false);
                self.addressSearchCountryDropDownList.disabled(false);
                self.countryDropDownList.disabled(false);
            }

            self.name.observable(address.FullName);
            self.companyName.observable(address.CompanyName);
            self.companyName.label = 'Company Name';
            self.addressLine1.observable(address.AddressLine1);
            self.addressLine2.observable(address.AddressLine2);
            self.town.observable(address.Town);
            self.county.observable(address.County);
            self.postcode.observable(address.Postcode);
            self.phone.observable(address.PhoneNumber);
            self.phone.visible(true);
            self.email.observable(address.Email);

            if (self.countryWidget()) {
                self.countryWidget().bind('dataBound', function () {
                    self.countryWidget().value(address.CountryID);
                    self.countryWidget().trigger('change');
                    self.countryWidget().unbind('dataBound');
                    self.detectChanges();
                });
                self.countryWidget().dataSource.read();
            } else {
                self.countryId(address.CountryID);

                self.country({
                    Name: address.CountryName,
                    Code: address.CountryCode,
                    EU: address.EU,
                    CountryID: address.CountryID
                });

                self.detectChanges();
            }

            resolve();
        });
    }

    self.loadBasketAddress = function (address) {
        return new Promise(function (resolve, reject) {

            self.reset();

            self.deletable(false);

            self.deliveryReference(address.DeliveryReference);

            if (self.deliveryReference() == 'C') {
                self.companyName.readOnly(true);
                self.companyName.disabled(true);
                self.name.readOnly(true);
                self.name.disabled(true);
                self.addressLine1.readOnly(true);
                self.addressLine1.disabled(true);
                self.addressLine2.readOnly(true);
                self.addressLine2.disabled(true);
                self.town.readOnly(true);
                self.town.disabled(true);
                self.county.readOnly(true);
                self.county.disabled(true);
                self.postcode.readOnly(true);
                self.postcode.disabled(true);
                self.phone.readOnly(true);
                self.phone.disabled(true);
                self.email.readOnly(true);
                self.email.disabled(true);
                self.addressSearchCountryDropDownList.disabled(true);
                self.countryDropDownList.disabled(true);
            } else {
                self.companyName.readOnly(false);
                self.companyName.disabled(false);
                self.name.readOnly(false);
                self.name.disabled(false);
                self.addressLine1.readOnly(false);
                self.addressLine1.disabled(false);
                self.addressLine2.readOnly(false);
                self.addressLine2.disabled(false);
                self.town.readOnly(false);
                self.town.disabled(false);
                self.county.readOnly(false);
                self.county.disabled(false);
                self.postcode.readOnly(false);
                self.postcode.disabled(false);
                self.phone.readOnly(false);
                self.phone.disabled(false);
                self.email.readOnly(false);
                self.email.disabled(false);
                self.addressSearchCountryDropDownList.disabled(false);
                self.countryDropDownList.disabled(false);
            }

            self.name.observable(address.DeliveryName);
            self.companyName.observable(address.DeliveryCompanyName);
            self.companyName.label = 'Company Name';
            self.addressLine1.observable(address.DeliveryAddressLine1);
            self.addressLine2.observable(address.DeliveryAddressLine2);
            self.town.observable(address.DeliveryTown);
            self.county.observable(address.DeliveryCounty);
            self.postcode.observable(address.DeliveryPostcode);
            self.phone.observable(address.DeliveryPhoneNumber);
            self.phone.visible(true);
            self.email.observable(address.OrderConfirmationsEmail);
            self.email.visible(true);

            self.endCustomerTradeAccountName = address.EndCustomerTradeAccountName;

            if (self.countryWidget()) {
                self.countryWidget().bind('dataBound', function () {
                    self.countryWidget().value(address.DeliveryCountryID);
                    self.countryWidget().trigger('change');
                    self.countryWidget().unbind('dataBound');
                    //self.detectChanges();
                });
                self.countryWidget().dataSource.read();
            } else {
                self.countryId(address.DeliveryCountryID);
                if (address.DeliveryCountry) {
                    self.country({
                        Name: address.DeliveryCountry.Name,
                        Code: address.DeliveryCountry.Code,
                        EU: address.DeliveryCountry.EU,
                        CountryID: address.DeliveryCountryID
                    });
                }
                //self.detectChanges();
            }

            self.havePerformedLoqateSearch(address.CleansePerformed);

            self.cleanseResultAccepted(!address.UserRefusedAddressRecommendation);

            resolve();
        });
    }

    self.loadInvoiceAddress = function (address) {

        self.reset();

        self.deletable(false);

        self.deliveryReference('C');

        self.companyName.readOnly(true);
        self.companyName.disabled(true);
        self.name.readOnly(true);
        self.name.disabled(true);
        self.addressLine1.readOnly(true);
        self.addressLine1.disabled(true);
        self.addressLine2.readOnly(true);
        self.addressLine2.disabled(true);
        self.town.readOnly(true);
        self.town.disabled(true);
        self.county.readOnly(true);
        self.county.disabled(true);
        self.postcode.readOnly(true);
        self.postcode.disabled(true);
        self.phone.readOnly(true);
        self.phone.disabled(true);
        self.email.readOnly(true);
        self.email.disabled(true);
        self.addressSearchCountryDropDownList.disabled(true);
        self.countryDropDownList.disabled(true);


        self.name.observable(address.Name);
        self.companyName.observable(address.CompanyName);
        self.companyName.label = 'Company Name';
        self.addressLine1.observable(address.AddressLine1);
        self.addressLine2.observable(address.AddressLine2);
        self.town.observable(address.Town);
        self.county.observable(address.County);
        self.postcode.observable(address.Postcode);
        //self.phone.observable(address.PhoneNumber);
        //self.phone.visible(true);
        self.email.observable(address.Email);
        //self.email.visible(true);

        self.endCustomerTradeAccountName = address.EndCustomerTradeAccountName;

        if (self.countryWidget()) {
            self.countryWidget().bind('dataBound', function () {
                self.countryWidget().value(address.CountryID);
                self.countryWidget().trigger('change');
                self.countryWidget().unbind('dataBound');
                //self.detectChanges();
            });
            self.countryWidget().dataSource.read();
        } else {
            self.countryId(address.CountryID);
            //self.detectChanges();
        }

        if (address.CountryName) {
            self.country({
                Name: address.CountryName,
                Code: address.CountryCode,
                EU: address.EU,
                CountryID: address.CountryID
            });
        }

        self.havePerformedLoqateSearch(address.CleansePerformed);
    }

    self.loadTradeAccountAddressForDelivery = function (address) {
        self.reset();

        self.deletable(false);

        self.tradeAccountAddressId(address.TradeAccountAddressID);
        self.deliveryReference(address.DeliveryReference);

        if (self.deliveryReference() == 'C') {
            self.companyName.readOnly(true);
            self.companyName.disabled(true);
            self.name.readOnly(true);
            self.name.disabled(true);
            self.addressLine1.readOnly(true);
            self.addressLine1.disabled(true);
            self.addressLine2.readOnly(true);
            self.addressLine2.disabled(true);
            self.town.readOnly(true);
            self.town.disabled(true);
            self.county.readOnly(true);
            self.county.disabled(true);
            self.postcode.readOnly(true);
            self.postcode.disabled(true);
            self.phone.readOnly(true);
            self.phone.disabled(true);
            self.email.readOnly(true);
            self.email.disabled(true);
            self.addressSearchCountryDropDownList.disabled(true);
            self.countryDropDownList.disabled(true);
        } else {
            self.companyName.readOnly(false);
            self.companyName.disabled(false);
            self.name.readOnly(false);
            self.name.disabled(false);
            self.addressLine1.readOnly(false);
            self.addressLine1.disabled(false);
            self.addressLine2.readOnly(false);
            self.addressLine2.disabled(false);
            self.town.readOnly(false);
            self.town.disabled(false);
            self.county.readOnly(false);
            self.county.disabled(false);
            self.postcode.readOnly(false);
            self.postcode.disabled(false);
            self.phone.readOnly(false);
            self.phone.disabled(false);
            self.email.readOnly(false);
            self.email.disabled(false);
            self.addressSearchCountryDropDownList.disabled(false);
            self.countryDropDownList.disabled(false);
        }

        self.name.observable(address.Name);
        self.companyName.observable(address.CompanyName);
        self.addressLine1.observable(address.AddressLine1);
        self.addressLine2.observable(address.AddressLine2);
        self.town.observable(address.AddressLine3 || address.Town);
        self.county.observable(address.AddressLine4 || address.County);
        self.postcode.observable(address.Postcode);
        self.phone.observable(address.Phone);
        self.email.observable(address.Email);

        if (self.countryWidget()) {
            self.countryWidget().bind('dataBound', function () {
                self.countryWidget().value(address.CountryID);
                self.countryWidget().trigger('change');
                self.countryWidget().unbind('dataBound');
                self.detectChanges();
            });
            self.countryWidget().dataSource.read();
        } else {
            self.countryId(address.CountryID);
            self.detectChanges();
        }

        if (address.CountryName) {
            self.country({
                Name: address.CountryName,
                Code: address.CountryCode,
                EU: address.EU,
                CountryID: address.CountryID
            });
        }

        var tags = [];

        if (address.Tags != null) {
            for (var i = 0; i < address.Tags.length; i++) {
                tags.push(address.Tags[i].Tag);
            }
            self.tags(tags);
        }
    }

    self.loadTradeAccountAddress = function (address, deletable) {

        self.reset();

        self.deletable(deletable);

        if ($('#address-edit-modal').length) {
            $('#address-edit-modal').modal('show');
        }

        window.setTimeout(function () {
            self.tradeAccountAddressId(address.TradeAccountAddressID);
            self.deliveryReference(address.DeliveryReference);

            if (self.deliveryReference() == 'C') {
                self.companyName.readOnly(true);
                self.companyName.disabled(true);
                self.name.readOnly(true);
                self.name.disabled(true);
                self.addressLine1.readOnly(true);
                self.addressLine1.disabled(true);
                self.addressLine2.readOnly(true);
                self.addressLine2.disabled(true);
                self.town.readOnly(true);
                self.town.disabled(true);
                self.county.readOnly(true);
                self.county.disabled(true);
                self.postcode.readOnly(true);
                self.postcode.disabled(true);
                self.phone.readOnly(true);
                self.phone.disabled(true);
                self.email.readOnly(true);
                self.email.disabled(true);
                self.addressSearchCountryDropDownList.disabled(true);
                self.countryDropDownList.disabled(true);
            } else {
                self.companyName.readOnly(false);
                self.companyName.disabled(false);
                self.name.readOnly(false);
                self.name.disabled(false);
                self.addressLine1.readOnly(false);
                self.addressLine1.disabled(false);
                self.addressLine2.readOnly(false);
                self.addressLine2.disabled(false);
                self.town.readOnly(false);
                self.town.disabled(false);
                self.county.readOnly(false);
                self.county.disabled(false);
                self.postcode.readOnly(false);
                self.postcode.disabled(false);
                self.phone.readOnly(false);
                self.phone.disabled(false);
                self.email.readOnly(false);
                self.email.disabled(false);
                self.addressSearchCountryDropDownList.disabled(false);
                self.countryDropDownList.disabled(false);
            }

            self.name.observable(address.Name);
            self.companyName.observable(address.CompanyName);
            self.addressLine1.observable(address.AddressLine1);
            self.addressLine2.observable(address.AddressLine2);
            self.town.observable(address.Town);
            self.county.observable(address.County);
            self.postcode.observable(address.Postcode);

            // Why was this omitted before... ?
            self.phone.observable(address.Phone);
            self.email.observable(address.Email);


            if (self.countryWidget()) {
                self.countryWidget().bind('dataBound', function () {
                    self.countryWidget().value(address.CountryID);
                    self.countryWidget().trigger('change');
                    self.countryWidget().unbind('dataBound');
                    self.detectChanges();
                });
                self.countryWidget().dataSource.read();
            } else {
                self.countryId(address.CountryID);
                self.country({
                    Name: address.CountryName,
                    Code: address.CountryCode,
                    EU: address.EU,
                    CountryID: address.CountryID
                });
                self.detectChanges();
            }

            var tags = [];

            if (address.Tags != null) {
                for (var i = 0; i < address.Tags.length; i++) {
                    tags.push(address.Tags[i].Tag);
                }
                self.tags(tags);
            }

            //self.tags(address.Tags);
        }, 300);

        // need to call .layout() on each of these - but when... 
        // the subscription is trying to call it effective immediately,
        // when the elements do not yet exist...

        // also, is DeliveryReference now obsolete?
    }

    self.loadFromOtherAddressObject = function (other, isDefault) {
        self.reset();

        self.deletable(other.deletable);

        self.deliveryReference(other.deliveryReference());

        if (self.deliveryReference() == 'C') {
            self.companyName.readOnly(true);
            self.companyName.disabled(true);
            self.name.readOnly(true);
            self.name.disabled(true);
            self.addressLine1.readOnly(true);
            self.addressLine1.disabled(true);
            self.addressLine2.readOnly(true);
            self.addressLine2.disabled(true);
            self.town.readOnly(true);
            self.town.disabled(true);
            self.county.readOnly(true);
            self.county.disabled(true);
            self.postcode.readOnly(true);
            self.postcode.disabled(true);
            self.phone.readOnly(true);
            self.phone.disabled(true);
            self.email.readOnly(true);
            self.email.disabled(true);
            self.addressSearchCountryDropDownList.disabled(true);
            self.countryDropDownList.disabled(true);
        } else {
            self.companyName.readOnly(false);
            self.companyName.disabled(false);
            self.name.readOnly(false);
            self.name.disabled(false);
            self.addressLine1.readOnly(false);
            self.addressLine1.disabled(false);
            self.addressLine2.readOnly(false);
            self.addressLine2.disabled(false);
            self.town.readOnly(false);
            self.town.disabled(false);
            self.county.readOnly(false);
            self.county.disabled(false);
            self.postcode.readOnly(false);
            self.postcode.disabled(false);
            self.phone.readOnly(false);
            self.phone.disabled(false);
            self.email.readOnly(false);
            self.email.disabled(false);
            self.addressSearchCountryDropDownList.disabled(false);
            self.countryDropDownList.disabled(false);
        }

        self.companyName.observable(other.companyName.observable());
        self.name.observable(other.name.observable());
        self.addressLine1.observable(other.addressLine1.observable());
        self.addressLine2.observable(other.addressLine2.observable());
        self.town.observable(other.town.observable());
        self.county.observable(other.county.observable());
        self.postcode.observable(other.postcode.observable());
        self.phone.observable(other.phone.observable());
        self.email.observable(other.email.observable());

        if (other.phone.intlMobile == false) {
            self.phone.intlMobile = false
        } else {
            self.phone.intlMobile = true;
        }

        if (self.countryWidget()) {
            self.countryWidget().bind('dataBound', function () {
                self.countryWidget().value(other.countryId());
                self.countryWidget().trigger('change');
                self.countryWidget().unbind('dataBound');
                self.detectChanges();
            });
            self.countryWidget().dataSource.read();
        } else {
            self.countryId(other.countryId());
            self.country({
                Name: other.country() ? other.country().Name : undefined,
                Code: other.country() ? other.country().hasOwnProperty('Code') ? other.country().Code : other.country() : undefined,
                CountryID: other.countryId(),
                EU: other.country() ? other.country().EU : undefined
            });
            self.detectChanges();
        }

        var tags = [];

        if (other.tags().length) {
            for (var i = 0; i < other.tags().length; i++) {
                tags.push(other.tags()[i].Tag);
            }
            self.tags(tags);
        }

        self.isDefaultDeliveryAddress(isDefault);
    }

    self.reflowLabels = function () {
        console.log('addressViewModel reflow labels was called - this call is defunct and should be removed - see functions.js assignVisibilityCallback.');
        //if (self.companyName.observable.hasOwnProperty('mdcTextField'))
        //    self.companyName.observable.mdcTextField.layout();
        //if (self.name.observable.hasOwnProperty('mdcTextField'))
        //    self.name.observable.mdcTextField.layout();
        //if (self.addressLine1.observable.hasOwnProperty('mdcTextField'))
        //    self.addressLine1.observable.mdcTextField.layout();
        //if (self.addressLine2.observable.hasOwnProperty('mdcTextField'))
        //    self.addressLine2.observable.mdcTextField.layout();
        //if (self.town.observable.hasOwnProperty('mdcTextField'))
        //    self.town.observable.mdcTextField.layout();
        //if (self.county.observable.hasOwnProperty('mdcTextField'))
        //    self.county.observable.mdcTextField.layout();
        //if (self.country.hasOwnProperty('mdcSelect')) {
        //    self.country.mdcSelect.layout();
        //    self.country.mdcSelect.foundation_.notchOutline(self.country.mdcSelect.label_.getWidth());
        //}
        //if (self.postcode.observable.hasOwnProperty('mdcTextField'))
        //    self.postcode.observable.mdcTextField.layout();
        //if (self.phone.observable.hasOwnProperty('mdcTextField'))
        //    self.phone.observable.mdcTextField.layout();
    }

    self.taggingWidget = ko.observable();

    self.availableTags = ko.observableArray(getAvailableTags());

    self.tags = ko.observableArray([]);

    self.taggingParams = {
        label: 'Address Tagging - Type to Search',
        widget: self.taggingWidget,
        addItemEndpoint: '/api/ComponentAPI/AddTag',
        autocompleteEndpoint: '/api/ComponentAPI/TagAutocomplete',
        itemsList: self.availableTags,
        target: self.tags,
        valueField: 'TagID',
        textField: 'Name',
        listPull: 'pull-right'
    };

    //// Apparently now addresses can be tagged.
    //self.tags = ko.observableArray([]);
    //self.tagListWidget = ko.observable();
    //self.availableTags = ko.observableArray(getAvailableTags());
    //self.tagListParams = {
    //    widget: self.tagListWidget,
    //    name: 'tagList',
    //    displayName: 'Tags',
    //    labelClass: 'project-label',
    //    controlClass: 'project-control-wide',
    //    dataFieldName: 'TagID',
    //    itemsList: self.availableTags,
    //    autocompleteMaxLength: 50,
    //    autocompleteElementId: 'address-tag',
    //    target: self.tags,
    //    additionalData: {},
    //    valueField: 'TagID',
    //    textField: 'Name',
    //    addItemEndpoint: '/api/ComponentAPI/AddTag',
    //    autocompleteEndpoint: '/api/ComponentAPI/TagAutocomplete',
    //    listPull: 'pull-right'
    //};

    self.errors = ko.validation.group([
        self.name.observable,
        self.companyName.observable,
        self.addressLine1.observable,
        self.addressLine2.observable,
        self.town.observable,
        self.county.observable,
        self.postcode.observable,
        self.country,
        self.countryId,
        self.email.observable,
        self.phone.observable
    ]);

    self.reset = function (keepCountry) {

        keepCountry = typeof keepCountry === 'undefined' ? false : keepCountry;

        self.deletable(true);

        if (ko.isObservable(self.validateNow)) {
            self.validateNow(false);
        }

        self.initialState({});

        self.removeCleanseSubscriptions();
        self.removeDeliveryReferenceSubscriptions();

        self.manual(false);
        self.tradeAccountAddressId(undefined);
        //self.addressSearch(undefined);
        self.companyName.observable(undefined);
        self.name.observable(undefined);
        self.addressLine1.observable(undefined);
        self.addressLine2.observable(undefined);
        self.town.observable(undefined);
        self.county.observable(undefined);
        self.postcode.observable(undefined);
        self.phone.observable(undefined);
        self.email.observable(undefined);

        self.deliveryReference(undefined);

        if (!keepCountry) {
            if (self.countryWidget()) {
                if (self.defaultCountry) {
                    self.countryWidget().value(self.defaultCountry);
                }
                else {
                    self.countryWidget().value('');
                }
                window.setTimeout(function () {
                    self.countryWidget().trigger('change');
                }, 0);
            }
        }

        self.companyName.readOnly(false);
        self.companyName.disabled(false);
        self.name.readOnly(false);
        self.name.disabled(false);
        self.addressLine1.readOnly(false);
        self.addressLine1.disabled(false);
        self.addressLine2.readOnly(false);
        self.addressLine2.disabled(false);
        self.town.readOnly(false);
        self.town.disabled(false);
        self.county.readOnly(false);
        self.county.disabled(false);
        self.postcode.readOnly(false);
        self.postcode.disabled(false);
        self.phone.readOnly(false);
        self.phone.disabled(false);
        self.email.readOnly(false);
        self.email.disabled(false);
        self.addressSearchCountryDropDownList.disabled(false);
        self.countryDropDownList.disabled(false);

        //if (self.addressSearchCountryWidget()) {
        //    if (self.defaultCountry) {
        //        self.addressSearchCountryWidget().value(self.defaultCountry);
        //    }
        //    else {
        //        self.addressSearchCountryWidget().value('');
        //    }
        //    window.setTimeout(function () {
        //        self.addressSearchCountryWidget().trigger('change');
        //    }, 0);
        //}

        self.isDefaultDeliveryAddress(false);

        self.changed(false);

        self.promptForOverwrite(false);

        self.tags([]);

        self.errors.showAllMessages(false);
    }

    self.toBasketAddressJS = function () {
        var data = {
            isLoqateAddress: typeof self.cleanseResultAccepted === 'function' ? self.cleanseResultAccepted() : false,
            manual: self.manual(),
            deliveryReference: self.deliveryReference(),
            deliveryName: self.name.observable(),
            deliveryCompanyName: self.companyName.observable(),
            deliveryAddressLine1: self.addressLine1.observable(),
            deliveryAddressLine2: self.addressLine2.observable(),
            deliveryTown: self.town.observable(),
            deliveryCounty: self.county.observable(),
            deliveryPostcode: self.postcode.observable(),
            deliveryCountryId: self.country() ? self.country().CountryID : self.countryId(),
            deliveryCountryCode: self.country() ? self.country().Code : null,
            email: self.email.observable()
        }
        if (self.phone.observable.hasOwnProperty('intlTel')) {
            data.deliveryPhoneNumber = self.phone.observable.intlTel.getNumber();
        } else {
            data.deliveryPhoneNumber = self.phone.observable();
        }

        return data;
    }

    self.toSupplierAddressJS = function () {
        var data = {
            supplierFullName: self.name.observable(),
            supplierCompanyName: self.companyName.observable(),
            supplierAddressLine1: self.addressLine1.observable(),
            supplierAddressLine2: self.addressLine2.observable(),
            supplierTown: self.town.observable(),
            supplierCounty: self.county.observable(),
            supplierPostcode: self.postcode.observable(),
            supplierCountryId: self.countryId(),
            supplierCountryCode: self.country() ? self.country().hasOwnProperty('Code') ? self.country().Code : self.country() : null
        }
        if (self.phone.observable.hasOwnProperty('intlTel')) {
            data.supplierPhoneNumber = self.phone.observable.intlTel.getNumber();
        } else {
            data.supplierPhoneNumber = self.phone.observable();
        }
        return data;
    }

    self.toJS = function () {
        return {
            tradeAccountAddressId: self.tradeAccountAddressId(),
            label: self.companyName.observable(),
            name: self.name.observable(),
            addressLine1: self.addressLine1.observable(),
            addressLine2: self.addressLine2.observable(),
            town: self.town.observable(),
            county: self.county.observable(),
            postcode: self.postcode.observable(),
            countryId: self.country() ? self.country().CountryID : self.countryId(),
            countryName: self.countryWidget() ? self.countryWidget().dataItem().Name : self.country() ? self.country().Name : null,
            displayLine: self.displayLine(),
            displayBlock: self.displayBlock(),
            tags: self.tags()
        };
    }

    self.displayLine = ko.pureComputed({
        read: function () {

            var result = $('<div class="address-line">');

            if (self.hasOwnProperty('endCustomerTradeAccountName'))
                if (self.endCustomerTradeAccountName != null)
                    result.append($("<label class='address-block-span'>" + self.endCustomerTradeAccountName + (self.deliveryReference() ? ' <span class="text-transparent">' + self.deliveryReference() + '</span>' : '') + "</label>"))

            if (self.companyName.observable()) {
                result.append($("<label class='address-block-span'>" + self.companyName.observable() + (self.deliveryReference() ? ' <span class="text-transparent">' + self.deliveryReference() + '</span>' : '') + "</label>"));
            }
            if (self.name.observable()) {
                result.append($("<span class='address-line-span'>" + self.name.observable() + "</span>"));
            }
            if (self.addressLine1.observable()) {
                result.append($("<span class='address-line-span'>" + self.addressLine1.observable() + "</span>"));
            }
            if (self.addressLine2.observable()) {
                result.append($("<span class='address-line-span'>" + self.addressLine2.observable() + "</span>"));
            }
            if (self.town.observable()) {
                result.append($("<span class='address-line-span'>" + self.town.observable() + "</span>"));
            }
            if (self.county.observable()) {
                result.append($("<span class='address-line-span'>" + self.county.observable() + "</span>"));
            }
            if (self.postcode.observable()) {
                result.append($("<span class='address-line-span'>" + self.postcode.observable() + "</span>"));
            }
            if (self.country()) {
                result.append($("<span class='address-line-span'>" + self.country().Name + "</span>"));
            }

            return result.prop('outerHTML');
        }
    }, self);

    self.singleLineDisplay = ko.pureComputed({
        read: function () {
            var result = $('<div class="address-single-line"></div>');
            if (self.name.observable())
                result.append('<span class="name">' + self.name.observable() + '</span>');
            if (self.addressLine1.observable())
                result.append('<span class="address">' + self.addressLine1.observable() + '</span>');
            if (self.postcode.observable())
                result.append('<span class="postcode">' + self.postcode.observable() + '</span>');
            if (self.country())
                result.append('<span class="countrycode">' + self.country().Name + '</span>');
            return result.prop('outerHTML');
        }
    }, self);

    self.displayBlock = ko.pureComputed({
        read: function () {

            var result = $('<div class="address-block">');

            if (self.companyName.observable()) {
                result.append($("<label>" + self.companyName.observable() + "</label>"));
            }
            if (self.hasOwnProperty('endCustomerTradeAccountName'))
                if (self.endCustomerTradeAccountName != null)
                    result.append($("<span class='address-block-span'>" + self.endCustomerTradeAccountName + "</span>"))

            if (self.name.observable()) {
                result.append($("<span class='address-block-span'>" + self.name.observable() + "</span>"));
            }
            if (self.addressLine1.observable()) {
                result.append($("<span class='address-block-span'>" + self.addressLine1.observable() + "</span>"));
            }
            if (self.addressLine2.observable()) {
                result.append($("<span class='address-block-span'>" + self.addressLine2.observable() + "</span>"));
            }
            if (self.town.observable()) {
                result.append($("<span class='address-block-span'>" + self.town.observable() + "</span>"));
            }
            if (self.county.observable()) {
                result.append($("<span class='address-block-span'>" + self.county.observable() + "</span>"));
            }
            if (self.postcode.observable()) {
                result.append($("<span class='address-block-span'>" + self.postcode.observable() + "</span>"));
            }
            if (self.country()) {
                if (self.country().hasOwnProperty('Name'))
                    result.append($("<span class='address-block-span no-comma'>" + self.country().Name + "</span>"));
                else
                    result.append($("<span class='address-block-span no-comma'>" + self.country() + "</span>"));
            }

            result.append($('<span class="address-block-spacer"></span>'));

            if (self.phone.observable()) {
                result.append($("<span class='address-block-span no-comma'>" + self.phone.observable() + "</span>"));
                result.append($('<span class="address-block-spacer"></span>'));
            }

            if (self.email.observable()) {
                result.append($("<a class='address-block-span no-comma' href='mailto:" + self.email.observable() + "'>" + self.email.observable() + "</span>"));
            } else {
                result.append($("<span class='address-block-span no-comma red-text'>No delivery email address provided</span>"));
            }

            if (self.deliveryReference( ) && self.deliveryReference() != 'C') {
                result.append($('<span class="address-block-spacer"></span>'));

                if (self.cleanseResultAccepted()) {
                    result.append($('<span class="address-status no-comma text-success">Loqate-Verified Address &#x2714;</span>'));
                } else {
                    result.append($('<span class="address-status no-comma alert alert-danger">Address not Verified by Loqate</span>'));
                }
            }

            return result.prop('outerHTML');
        }
    }, self);

    self.displayText = ko.pureComputed({
        read: function () {
            var result = '';
            if (self.name.observable())
                result += self.name.observable() + ' ';
            if (self.addressLine1.observable())
                result += self.addressLine1.observable() + ' ';
            if (self.postcode.observable())
                result += self.postcode.observable() + ' ';
            if (self.country())
                result += self.country().Code
            return result;
        }
    }, self);

    self.displayTags = ko.pureComputed({
        read: function () {

            var result = $('<div class="tag-container">');

            ko.utils.arrayForEach(self.tags(), function (tag) {

                var t = $('<span class="attendee tag pointer">');

                if (tag.hasOwnProperty('Title')) {
                    t.append($("<span>" + tag.Title + "</span>"));
                    t.append($("<span>" + tag.FullName + "</span>"))
                } else {
                    t.append($("<span>" + tag.Name + "</span>"))
                }

                result.append(t);
            });

            return result.prop('outerHTML');
        }
    }, self);

    self.notifySubscribers = function () {

        //if (self.name.observable.hasOwnProperty('isValid'))
        //    self.name.observable.isValid.notifySubscribers(self.name.observable.isValid());

        //if (self.companyName.observable.hasOwnProperty('isValid'))
        //    self.companyName.observable.isValid.notifySubscribers(self.companyName.observable.isValid());

        //if (self.addressLine1.observable.hasOwnProperty('isValid'))
        //    self.addressLine1.observable.isValid.notifySubscribers(self.addressLine1.observable.isValid());

        //if (self.addressLine2.observable.hasOwnProperty('isValid'))
        //    self.addressLine2.observable.isValid.notifySubscribers(self.addressLine2.observable.isValid());

        //if (self.town.observable.hasOwnProperty('isValid'))
        //    self.town.observable.isValid.notifySubscribers(self.town.observable.isValid());

        //if (self.county.observable.hasOwnProperty('isValid'))
        //    self.county.observable.isValid.notifySubscribers(self.county.observable.isValid());

        ////if (self.country()) {
        //if (self.countryDropDownList.observable.hasOwnProperty('isValid'))
        //    self.countryDropDownList.observable.isValid.notifySubscribers(self.countryDropDownList.observable.isValid());
        ////}

        //if (self.postcode.observable.hasOwnProperty('isValid'))
        //    self.postcode.observable.isValid.notifySubscribers(self.postcode.observable.isValid());

        //if (self.phone.observable.hasOwnProperty('isValid'))
        //    self.phone.observable.isValid.notifySubscribers(self.phone.observable.isValid());

        //if (self.phone.observable.hasOwnProperty('intlTel')) {
        //    if (self.phone.observable.intlTel.getNumber()) {
        //        if (!self.phone.observable.intlTel.isValidNumber()) {
        //            if (self.phone.observable.hasOwnProperty('isValid'))
        //                self.phone.observable.isValid.notifySubscribers(false);
        //        }
        //    }
        //}

        ////if (self.addressSearchCountry.hasOwnProperty('isValid'))
        ////    self.addressSearchCountry.isValid.notifySubscribers(self.addressSearchCountry.isValid());

        if (self.phone.observable.hasOwnProperty('intlTel')) {
            if (self.phone.observable.intlTel.getNumber()) {
                if (!self.phone.observable.intlTel.isValidNumber()) {
                    hasPhoneErrored = true;
                    self.phone.observable.isValid.notifySubscribers(false);
                }
            }
        }

        self.errors.filter(function (x) {
            if (x.hasOwnProperty('isValid')) {
                if (!x.isValid())
                    x.isValid.notifySubscribers(x.isValid());
            } else if (x.hasOwnProperty('observable')) {
                if (x.observable.hasOwnProperty('isValid')) {
                    if (!x.observable.isValid())
                        x.observable.isValid.notifySubscribers(x.observable.isValid());
                }
            }
        });
    }
}

// New, improved, wonderful. Rip up the horrid stuff above, keep the bare bones view model and validation notifications.
var addressSearchFactory = function (
    tradeAccount,
    endCustomerTradeAccount,
    title,
    verb,
    addressObject,
    busy,
    busyMessage,
    saveFunction,
    isMiscTradeAccount,
    basketId,
    forbiddenDestinationCountries,
    parent) {
    var self = this;

    self.parent = parent;

    self.basketId = basketId;

    self.tradeAccount = tradeAccount;

    self.endCustomerTradeAccount = endCustomerTradeAccount;

    self.isMiscTradeAccount = isMiscTradeAccount;

    //self.isMiscTradeAccount.subscribe(function (newValue) {
    //    if (newValue) {
    //        self.pcaLookup.searchEndpoint(self.pcaEndpoint);
    //    }
    //});

    self.forbiddenDestinationCountries = forbiddenDestinationCountries || ko.observableArray([]);

    self.mertexEndpoint = '/api/componentapi/mertexAddressSearch',

    self.pcaEndpoint = '/Products/Enquiry/PCAPredictFind'

    self.title = ko.observable(title || '');

    self.verb = ko.observable(verb);

    self.saveFunction = saveFunction;

    self.addressObject = addressObject || new addressViewModel(); // an instance of AddressViewModel.

    self.addressObject.tradeAccount = self.tradeAccount;

    self.includeEU = ko.observable(true); // by default, permit searching for countries within the EU.

    self.tradeAccount.subscribe(function (newValue) {
        console.log('addressSearcher tradeAccount subscribe hit', newValue);
        if (newValue)
            self.countryId(newValue.CountryID);
        else
            self.countryId(undefined);
    });

    self.countryId = ko.observable(self.tradeAccount() ? self.tradeAccount().CountryID : undefined); // why store both...? because the list needs to bind to a single value, not an object.

    self.country = ko.observable(); // the full Country object.

    self.widget = ko.observable(); // the Kendo widget for the list.

    self.addressSearchString = ko.observable(); // the string provided for the autocompleter to search on

    self.addressSearchStringHasFocus = ko.observable(false); // whether or not the autocompleter has focus

    self.pcaInputGroup = ko.observable(); // the input group itself, to provide class switching

    self.editModal = ko.observable(); // this searcher's edit modal

    self.busy = busy || ko.observable(false); // parent's busy, or own

    self.busyMessage = busyMessage || ko.observable(''); // parent's busy message, or own

    self.cleanseBusy = ko.observable(false);

    self.cleanseResult = ko.observable();

    self.cleanseResultAccepted = ko.observable(false);

    self.showManualCleanse = ko.observable(false);

    self.addressObject.showManualCleanse = self.showManualCleanse;
    self.addressObject.cleanseResult = self.cleanseResult;
    self.addressObject.cleanseResultAccepted = self.cleanseResultAccepted;

    self.loadFromLoqateCleanse = function (lq) {
        console.log('address loadFromLoqateCleanse called');

        self.addressObject.removeDeliveryReferenceSubscriptions();
        self.addressObject.removeCleanseSubscriptions();

        self.cleanseResultAccepted(true);
        self.addressObject.loqateAddress(true);
        self.addressObject.cleansedAddress(true);
        self.addressObject.addressLine1.observable(lq.Address1);
        self.addressObject.addressLine2.observable(lq.Address2);
        self.addressObject.town.observable(lq.Locality);
        self.addressObject.county.observable(lq.AdministrativeArea);
        self.addressObject.postcode.observable(lq.PostalCode);

        self.addressObject.detectChanges();

        self.addressObject.manual(false);

        if (self.addressObject.deliveryReference() != 'C')
            self.addressObject.promptForOverwrite(true);
    }

    self.country.subscribe(function (newValue) {
        if (newValue) {
            var forbid = Enumerable.From(self.forbiddenDestinationCountries()).Where(function (x) {
                return x.CountryID == newValue.CountryID;
            }).FirstOrDefault();

            if (forbid != null) {
                $.error('Destination Country Not Permitted', forbid.Reason, null, function () {
                    self.countryDropDownList.clearFunction();
                });
                return;
            }
        }

        if (newValue && self.addressSearchString()) {
            $(self.addressSearchString.DOMElement).autocomplete('search');
        } else {
            self.pcaLookup.clearFunction();
        }
    });

    self.countryDropDownList = {
        observable: self.country,
        showClear: false,
        width: '180px',
        label: 'Country',
        valuePrimitive: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        height: 300,
        controlClass: 'form-control',
        dropDownListSettings: {
            value: self.countryId,
            dataItem: self.country,
            dataValueField: 'CountryID',
            dataTextField: 'Name',
            widget: self.widget,
            height: 300,
            open: function (e) {
                $(e.sender._widgetOptions.dataItem.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            close: function (e) {
                $(e.sender._widgetOptions.dataItem.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            dataBound: function (e) {
                self.country.mdcSelect.layout();
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
                        data.includeEU = self.includeEU;
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
            filter: 'startswith'
        },
        clearFunction: function () {
            var self = this;
            self.observable('');
            self.dropDownListSettings.value(undefined);
            if (self.dropDownListSettings.widget()) {
                self.dropDownListSettings.widget().value('');
                self.dropDownListSettings.widget()._widgetOptions.dataItem.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                self.dropDownListSettings.widget()._widgetOptions.dataItem.mdcSelect.label_.float(false);
            }
        }
    };

    self.pcaLookup = {
        label: 'Search for an Address',
        busy: self.busy,
        inputGroup: self.pcaInputGroup,
        searchResultsList: ko.observableArray([]),
        searchEndpoint: ko.observable(self.mertexEndpoint), // current endpoint to search against; default to Mertex. Only Misc accounts should default to pca.
        delay: 86|400000,
        tradeAccount: self.tradeAccount,
        endCustomerTradeAccount: self.endCustomerTradeAccount,
        miscTradeAccount: self.isMiscTradeAccount,
        observable: self.addressSearchString,
        focusObservable: self.addressSearchStringHasFocus,
        mapFunction: function (companyName, name, line1, line2, line3, line4, postcode, phone, email, deliveryReference, loqateAddress, countryId) {

            //self.addressObject.removeCleanseSubscriptions();
            //self.addressObject.removeDeliveryReferenceSubscriptions();

            //self.addressObject.deliveryReference(undefined);
            //self.addressObject.companyName.observable(undefined);
            //self.addressObject.name.observable(undefined);
            //self.addressObject.addressLine1.observable(undefined);
            //self.addressObject.addressLine2.observable(undefined);
            //self.addressObject.town.observable(undefined);
            //self.addressObject.county.observable(undefined);
            //self.addressObject.postcode.observable(undefined);
            //self.addressObject.phone.observable(undefined);
            //self.addressObject.email.observable(undefined);
            //self.addressObject.loqateAddress(false);

            self.addressObject.reset();
            self.addressObject.removeCleanseSubscriptions();
            self.addressObject.removeDeliveryReferenceSubscriptions();

            if (loqateAddress)
                self.addressObject.loqateAddress(true);

            if (deliveryReference)
                self.addressObject.deliveryReference(deliveryReference);

            if (companyName)
                self.addressObject.companyName.observable(companyName);

            if (name)
                self.addressObject.name.observable(name);

            if (line1) {
                self.addressObject.addressLine1.observable(line1);
            }

            if (line2) {
                self.addressObject.addressLine2.observable(line2);
            }

            if (line3) {
                self.addressObject.town.observable(line3);
            }

            if (line4) {
                self.addressObject.county.observable(line4);
            }

            if (postcode) {
                self.addressObject.postcode.observable(postcode);
            }

            if (phone) {
                self.addressObject.phone.observable(phone);
            }

            self.addressObject.phone.intlMobile = true;

            if (email) {
                self.addressObject.email.observable(email);
            }

            if (self.addressObject.countryWidget()) {

                self.addressObject.countryWidget().bind('dataBound', function () {
                    self.addressObject.countryWidget().value(countryId);
                    self.addressObject.countryWidget().trigger('change');
                    self.addressObject.countryWidget().unbind('dataBound');
                    self.addressObject.detectChanges();
                });

                self.addressObject.countryWidget().dataSource.read();

                //self.addressObject.countryWidget().value(self.countryId());
                //window.setTimeout(function () {
                //    self.addressObject.countryWidget().trigger('change');
                //}, 0);
            }

            self.showEditModal();
        },
        country: self.country,
        position: { my: "right top", at: "right bottom", collision: "none" },
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        minLength: 0,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            self.observable.PCASearchId(null);
            self.observable.PCAContainer(null);
            $(self.observable.DOMElement).focus();
            self.searchResultsList([]);
            //if (self.searchEndpoint().indexOf('mertex') > -1 && $(self.observable.DOMElement).is(':visible')) {
            //    $(self.observable.DOMElement).autocomplete('search', ' ');
            //}
        },
        itemSelect: function (item) {
            console.log('addressSearcher itemSelect hit', item);

            if (item.hasOwnProperty('type')) {
                switch (item.type) {
                    case 'Mertex':
                    case 'Commercial':
                    case 'Residential':
                    case 'Unknown': // yeah I know, I know...
                        self.pcaLookup.mapFunction(
                            item.companyName,
                            item.name,
                            item.addressLine1,
                            item.addressLine2,
                            item.addressLine3,
                            item.addressLine4,
                            item.postcode,
                            item.phone,
                            item.email,
                            item.deliveryReference,
                            item.loqateAddress,
                            item.countryId);

                        self.addressObject.promptForOverwrite(false);

                        self.addressSearchString.PCASearchId(null);
                        self.addressSearchString.PCAContainer(null);

                        if (self.addressSearchString.hasOwnProperty('PCASearchTerm'))
                            self.addressSearchString.PCASearchTerm(null);

                        break;
                    case 'Address':
                        self.addressSearchString.PCASearchId(item.id);
                        self.addressSearchString.PCAContainer(null);
                        // at this point we KNOW we're drilling down for the minutae of a particular address ID in Loqate
                        self.addressSearchString.performSearch(function () {

                        });
                        break;
                    case 'Postcode':
                    // 'Postcode' may well not be the only "container" type object which we need to open when clicked...
                    default:
                        self.addressSearchString.PCASearchId(null);
                        self.addressSearchString.PCAContainer(item.id);
                        $(self.addressSearchString.DOMElement).autocomplete('search');
                        return false;
                }
            }
        }
    };

    //self.pcaLookup.label = ko.pureComputed(function () {
    //    if (this.searchEndpoint().indexOf('mertex') > -1)
    //        return 'Search Mertex Address Book'
    //    else
    //        return 'Search Global Address Database'
    //}, self.pcaLookup),

    self.addressSearchString.subscribe(function (newValue) {
        //console.log('addressSearchString subscribe hit', self.title(), newValue);
        //if (newValue == null || newValue == '') {
        //    if (self.pcaLookup.searchEndpoint().indexOf('mertex') > -1) {
        //        $(self.pcaLookup.observable.DOMElement).autocomplete('search', ' ');
        //    }
        //}

        //if (self.pcaLookup.searchEndpoint().indexOf('mertex') == -1) {
        self.pcaLookup.observable.PCASearchId(undefined);
        //}
    });

    self.pcaLookup.searchResultsList.subscribe(function (newValues) {
        if (newValues.length) {
            $(self.pcaInputGroup.DOMElement).addClass('has-results')
        } else {
            $(self.pcaInputGroup.DOMElement).removeClass('has-results')
        }
    });

    //self.pcaLookup.searchEndpoint.subscribe(function (newValue) {
    //    console.log('addressSearcher switched endpoints:', self.title(), newValue)
    //    self.pcaLookup.searchResultsList([]);
    //    //self.addressSearchString(undefined);

    //    if (newValue.indexOf('mertex') > -1) {
    //        $(self.addressSearchString.DOMElement).autocomplete('option', 'minLength', 0);
    //    } else {
    //        $(self.addressSearchString.DOMElement).autocomplete('option', 'minLength', 1);
    //    }

    //    if (self.addressSearchString()) 
    //        $(self.addressSearchString.DOMElement).autocomplete('search');
    //});

    self.showEditModal = function (forceCleanseCheck) {
        // if you're not dealing with the Invoice Address...
        // be aware, you might well have a NULL deliveryReference at the moment
        // we still want to try and throw up a cleansed address result, though

        self.addressObject.clearCleanseFields();

        if (forceCleanseCheck) {
            self.attemptAddressCleanse();
        } else if (self.addressObject.deliveryReference() != 'C') {
            if (self.addressObject.countryWidget()) {
                self.addressObject.countryWidget().dataSource.read();
                self.addressObject.countryWidget().bind('dataBound', function () {
                    self.attemptAddressCleanse();
                    self.addressObject.detectChanges();
                    self.addressObject.countryWidget().unbind('dataBound');
                });
            }
        } else {
            self.showManualCleanse(false);
            if (self.addressObject.countryWidget()) {
                self.addressObject.countryWidget().dataSource.read();
                self.addressObject.countryWidget().bind('dataBound', function () {
                    self.attemptAddressCleanse();
                    self.addressObject.countryWidget().unbind('dataBound');
                });
            }
        }

        self.addressObject.watchingCountryIdForRestrictions(true);

        $(self.editModal.DOMElement).appendTo("body").modal('show');
    }

    self.attemptAddressCleanse = function (forceCleanse, onComplete) {

        var data = self.addressObject.toBasketAddressJS();

        if (data.deliveryCountryCode) {

            forceCleanse = typeof forceCleanse === 'undefined' ? false : true;

            data.forceCleanse = forceCleanse;

            data.basketId = self.basketId();

            if (ko.isObservable(self.parent?.tradeAccount)) {
                data.tradeAccountCode = self.parent.tradeAccount().Code;
                data.tradeAccountId = self.parent.tradeAccount().TradeAccountID;
            }

            if (ko.isObservable(self.parent?.parent?.tradeAccount)) {
                data.tradeAccountCode = self.parent.parent.tradeAccount().Code;
                data.tradeAccountId = self.parent.parent.tradeAccount().TradeAccountID;
            }

            console.log('address calling attemptAddressCleanse with', data);


            //self.showManualCleanse(false);
            self.cleanseResult(undefined);

            self.cleanseBusy(true);

            $.ajax({
                url: '/api/componentapi/CleanseAddress',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {

                    console.log('address attemptAddressCleanse returned', data);

                    self.addressObject.havePerformedLoqateSearch(true);

                    if (data.hasOwnProperty('cleanseResult')) {
                        self.cleanseResult(data.cleanseResult);
                    }

                    if (data.cleansedAddress === true) {
                        self.addressObject.cleansedAddress(true);
                    } else {
                        self.addressObject.cleansedAddress(false);
                    }

                    self.cleanseResultAccepted(false);

                    self.showManualCleanse(false);

                    self.cleanseBusy(false);

                    if (typeof onComplete === 'function') {
                        onComplete.call(self);
                    }
                },
                error: function (xhr, s, a) {
                    self.cleanseBusy(false);
                    $.showError(xhr, s, a);
                }
            });
        }
    }

    self.restoreInitialState = function () {
        // self.parent == deliveryAddressFactory
        // deliveryAddressFactory.parent == orderFactory
        // self.parent.parent.deliveryAddress == deliveryAddress which was loaded through TestBasketValidity
        if (self.parent?.parent?.deliveryAddress)
            self.addressObject.loadFromOtherAddressObject(self.parent.parent.deliveryAddress);
    }

    self.closeEditModal = function () {

        self.restoreInitialState();

        $(self.editModal.DOMElement).off('hide.bs.modal');

        $(self.editModal.DOMElement).on('hide.bs.modal', function (event) {
            self.showManualCleanse(false);
            window.setTimeout(function () {
                // self.addressObject.reset(); // why would we want to reset the address object upon closing the modal...
                // this is actually bad; it's clearing out my country before I can copy it to some other address object.
                // so trust that the modal will be opened with the correct data in, or reset before opening... or something. Something else.
            }, 0);
        });

        $(self.editModal.DOMElement).modal('hide');
    }

    self.validateAddress = function () {
        self.addressObject.validateNow(true);
        if (self.addressObject.isValid()) {
            if (typeof self.saveFunction === 'function') {
                self.saveFunction(function () {
                    $(self.editModal.DOMElement).modal('hide');
                });
            }
            else {
                $(self.editModal.DOMElement).modal('hide');
            }
        }
    }

    self.deleteTradeAccountAddressCleanseRecord = function (rec) {
        $.confirm('Are you sure?', 'This will mark the address as deleted.', function () {
            var data = {
                deliveryReference: rec.obj.DeliveryReference,
                tradeAccountCode: rec.obj.TradeAccountCode
            }
            console.log('addressSearcher calling deleteTradeAccountAddressCleanseRecord with', data)
            $.ajax({
                url: '/api/componentapi/DeleteTradeAccountAddressCleanseRecord',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (data) {
                    console.log('addressSearcher DeleteTradeAccountAddressCleanseRecord returned', data);
                    self.pcaLookup.searchResultsList.remove(rec);
                },
                error: function (xhr, s, a) {
                    $.showError(xhr, s, a);
                }
            });
        }, null);
    }

    self.reset = function (keepCountry) {
        self.cleanseResult(undefined);
        self.addressObject.reset(keepCountry);
        self.countryId(undefined); // this one action should cause the country observable to be nullified...?
        self.addressSearchString(undefined);
        //self.pcaLookup.searchEndpoint(self.mertexEndpoint);
        self.pcaLookup.searchResultsList([]);
        self.cleanseResult(undefined);
        //self.havePerformedLoqateSearch(false);
        self.cleanseResultAccepted(false);
        self.showManualCleanse(false);
        self.cleanseBusy(false);
    }

    // when should the addressObject be reset.
    // upon RESET... duh... but... how many problems will THAT cause.
}