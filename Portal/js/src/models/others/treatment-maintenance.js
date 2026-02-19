'use strict';

const
    /* These follow portal.TreatmentStatus, with the exception of NOT_SET */
    TREATMENT_STATUS_NOT_SET = null,
    TREATMENT_STATUS_NOT_REQUIRED = 1,
    TREATMENT_STATUS_YES = 2,
    TREATMENT_STATUS_UNDER_TRIAL = 3,
    TREATMENT_STATUS_SUBJECT_TO_TRIAL = 4,
    TREATMENT_STATUS_NO = 5,
    TREATMENT_VIEW_MODE = 0,
    TREATMENT_EDIT_MODE = 1

const treatmentMaintenanceViewModel = (() => {
    let self = {

    };

    //#region Properties

    self.product = ko.observable();

    //#endregion


    //#region Computeds



    //#endregion


    //#region Components

    self.fabricTreatmentFactory = fabricTreatmentFactory({
        parent: self
    });

    // product autocompleter
    self.productAutocomplete = {
        label: 'Product - Search by Code or Name',
        enable: ko.observable(true),
        disable: ko.observable(false),
        observable: ko.observable(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        clearable: true,
        revertible: false,
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

    self.ready = () => {

    }

    self.reset = () => {
        console.log('treatmentMaintenanceViewModel reset called', self);
        self.treatmentFactory.reset();
    }

    //#endregion

    //#region Events


    //#endregion

    return self;
});

const fabricTreatmentFactory = ({ parent = null } = {}) => {
    let self = {
        parent: parent
    };

    //#region Properties

    // parent
    self.parent = parent;

    // busy?
    self.busy = ko.observable(false);

    // busy message
    self.busyMessage = ko.observable('Loading...');

    // current mode (view / edit)
    self.mode = ko.observable(TREATMENT_VIEW_MODE);

    // fabric treatments, from server on page load.
    self.treatments = ko.observableArray(getTreatments());

    // treatment statuses (feeds the availibility select lists in edit mode)
    self.treatmentStatuses = ko.observableArray(getTreatmentStatuses());

    // treatmentTypes...
    self.treatmentTypes = ko.observableArray($.map(getTreatmentTypes(), function (x) {
        var treatmentType = $.extend(x, {
            treatments: ko.observableArray([])
        });
        treatmentType.treatments.subscribe(function (newValues) {
            console.log('treatmentType.treatments subscribe hit', newValues);
        }, treatmentType, 'arrayChange');
        treatmentType.sortEnabled = ko.pureComputed(function () {
            return Enumerable.From(this.treatments()).Where(function (y) {
                return y.editing();
            }).ToArray().length == 0;
        }, treatmentType);
        treatmentType.busy = ko.observable(false);
        treatmentType.busyMessage = ko.observable('Saving...');
        treatmentType.showSaveSuccess = ko.observable(false);
        return treatmentType;
    }));

    // selected fabric quality
    self.quality = ko.observable();

    // select fabric quality's existing treatment data
    self.existingQualityTreatments = ko.observable();

    // tracks unsaved changes
    self.unsavedChanges = ko.observable(false);

    //#region Properties belonging to the Treatment Edit thing

    self.editTreatmentRecord = ko.observable();

    self.treatmentProviderId = ko.observable();

    self.treatmentProvider = ko.observable();

    self.treatmentProviderParams = {
        observable: self.treatmentProvider,
        clearable: true,
        revertible: false,
        enable: ko.observable(true),
        disable: ko.observable(false),
        width: 'auto',
        label: 'Treatment Provider',
        valuePrimitive: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        controlClass: 'form-control',
        dropDownListSettings: {
            value: self.treatmentProviderId,
            dataItem: self.treatmentProvider,
            dataValueField: 'TreatmentProviderID',
            dataTextField: 'Name',
            widget: ko.observable(),
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
                        $.ajax({
                            url: '/api/ProductMaintenanceAPI/GetTreatmentProviders',
                            type: "GET",
                            data: data,
                            success: function (data) {
                                console.log('fabricTreatmentFactory getTreatmentProviders returned', data);
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
            optionLabel: ' '
        },
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            self.dropDownListSettings.widget().value('');
            self.dropDownListSettings.widget()._widgetOptions.dataItem.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
            self.dropDownListSettings.widget()._widgetOptions.dataItem.mdcSelect.label_.float(false);
        }
    }

    //#endregion

    // quality autocompleter
    self.qualityAutocompleteObservable = ko.observable();

    self.qualityAutocomplete = {
        label: 'Fabric Quality - Search by Code or Name',
        enable: true,
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false),
        observable: self.qualityAutocompleteObservable,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        clearable: true,
        revertible: false,
        enterKeyFunction: function () {
            $(self.qualityAutocomplete.observable.DOMElement).autocomplete('search');
        },
        clearFunction: function () {
            self.quality(undefined);
            self.qualityAutocomplete.observable(undefined);
            $(self.qualityAutocomplete.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        },
        autocompleteSettings: {
            value: self.quality,
            observable: self.qualityAutocompleteObservable,
            enable: ko.observable(true),
            disable: ko.observable(false),
            appendTo: 'body',
            mapFunction: function (i) {
                return {
                    label: i.Name,
                    value: i.QualityID,
                    obj: i
                }
            },
            source: function (request, response) {
                var data = {
                    searchTerm: request.term
                };
                console.log('fabricTreatmentFactory qualityAutocomplete calling with', data);
                $.ajax({
                    url: '/api/ProductMaintenanceAPI/FabricQualityAutocomplete',
                    type: "POST",
                    dataType: "json",
                    data: data,
                    success: function (data) {
                        console.log('fabricTreatmentFactory qualityAutocomplete returned', data);
                        response($.map(data.Results, function (item) {
                            return {
                                label: `${item.Code} - ${item.Name || '[Unnamed]'}`,
                                value: item.QualityID,
                                obj: item
                            };
                        }));
                    }
                });
            },
            minLength: 1,
            select: function (event, ui) {
                event.preventDefault();
                self.quality(ui.item.obj);
                self.mode(TREATMENT_VIEW_MODE);
                $(self.qualityAutocomplete.observable.DOMElement).val(ui.item.label);
            },
            autoFocus: true
        }
    };

    //#endregion

    //#region Computeds

    self.treatmentRecords = ko.observableArray([]).extend({
        rateLimit: 50
    });

    self.treatmentProviders = ko.pureComputed(function () {
        if (self.existingQualityTreatments()) {
            return Enumerable.From(self.existingQualityTreatments().ExistingTreatments)
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
                                        type: treatmentType
                                    }

                                    var treatmentResults = $.map(treatments.source, function (item) {
                                        var extantTreatmentRecord = Enumerable.From(self.existingQualityTreatments().ExistingTreatments).Where(function (x) {
                                            return x.TreatmentID == item.TreatmentID
                                        }).SingleOrDefault();

                                        extantTreatmentRecord = extantTreatmentRecord || {};

                                        item.treatmentRecord = self.buildTreatmentObject(extantTreatmentRecord);

                                        self.treatmentRecords.push(item);

                                        return item;
                                    });

                                    result.treatments = treatmentResults;

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

    self.nonce = ko.observable();

    self.rebuildTreatmentTypes = ko.computed(function () {
        console.log('fabricTreatmentFactory rebuildTreatmentTypes hit');

        var p = self.treatmentProvider();

        var n = self.nonce();

        if (p) {
            ko.utils.arrayForEach(self.treatmentTypes(), function (type) {
                type.treatments(Enumerable.From(self.treatmentProvider().Treatments).Where(function (x) {
                    return x.TreatmentTypeID == type.TreatmentTypeID
                }).Select(function (x) {
                    return treatmentRecord(self, x);
                }).OrderBy(function (x) {
                    return x.sortOrder()
                }).ToArray());
            });
        }
    }, self);

    //#endregion

    //#region Components


    //#endregion

    //#region Subscriptions

    self.quality.subscribe(function (newValue) {
        if (newValue) {
            self.fetchExistingQualityTreatments();
        }
    });

    self.treatmentProvider.subscribe(function (newValue) {
        console.log('fabricTreatmentFactory treatmentProvider subscribe hit', newValue);
    });

    //#endregion

    //#region Validation Groups

    //#endregion

    //#region Functions

    self.updateTreatmentSortOrders = function (obj, treatmentType) {
        var data = {
            treatmentSortOrders: []
        };

        ko.utils.arrayForEach(obj.targetParent(), function (x, i) {
            x.sortOrder(i + 1);
            data.treatmentSortOrders.push({
                treatmentId: x.treatmentId(),
                sortOrder: x.sortOrder()
            })
        });

        console.log('updateTreatmentSortOrders called', data);
        treatmentType.busy(true);
        $.ajax({
            url: '/api/ProductMaintenanceAPI/SortTreatmentsWithinType',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                treatmentType.busy(false);
                treatmentType.showSaveSuccess(true);
                window.setTimeout(function () {
                    treatmentType.showSaveSuccess(false);
                }, 3000);
            },
            error: function (xhr, s, a) {
                treatmentType.busy(false);
            }
        });
    }

    self.addTreatment = function (treatmentType) {
        console.log('addTreatment called', treatmentType);
        var t = treatmentRecord(self, {
            TreatmentTypeID: treatmentType.TreatmentTypeID,
            TreatmentProviderID: self.treatmentProvider().TreatmentProviderID
        });
        t.unsavedChanges(true);
        t.editing(true);
        t.sortOrder(treatmentType.treatments().length + 1);
        treatmentType.treatments.push(t);
        window.setTimeout(function () {
            $(t.name.DOMElement).focus();
        }, 0);
    }

    self.cancel = function () {
        if (self.unsavedChanges()) {
            $.confirm('Warning', 'You have unsaved changes. Are you sure you want to cancel?', function () {
                self.fetchExistingQualityTreatments(function () {
                    self.mode(TREATMENT_VIEW_MODE);
                });
            }, function () {

            });
        } else {
            self.mode(TREATMENT_VIEW_MODE);
        }
    }

    self.saveOrEdit = function () {
        switch (self.mode()) {
            case TREATMENT_VIEW_MODE:
                self.mode(TREATMENT_EDIT_MODE);
                break;
            case TREATMENT_EDIT_MODE:
                self.saveQualityTreatmentRecord()
                break;
        }
    }

    self.buildTreatmentObject = function (extantRecord) { // existingData is an object with potentially many providers.
        var result = $.extend(extantRecord, {
            status: ko.observable(extantRecord.TreatmentStatusID)
        });

        result.statusDisplay = ko.pureComputed(function () {
            if (result.status()) {
                return Enumerable.From(getTreatmentProvisionStatuses()).Where(function (x) {
                    return x.TreatmentStatusID == result.status();
                }).Select(function (x) {
                    return x.Name
                }).SingleOrDefault();
            }
        }, result);

        result.treatmentProvisionStatus = {
            enable: ko.observable(true),
            disable: ko.observable(false),
            observable: result.status,
            label: 'Treatment Available?', // do we want a label, or an options caption... or both...?
            useNativeValidation: false,
            decorateInputElement: false,
            insertValidationMessages: false,
            options: getTreatmentProvisionStatuses(),
            optionsText: function (item) {
                return item.Name
            },
            optionsValue: 'TreatmentStatusID',
            optionsCaption: ''
        };

        result.note = ko.observable(result.Note);

        result.noteParams = {
            label: 'Note',
            enable: true,
            observable: result.note,
            rows: 3,
            useNativeValidation: false,
            decorateInputElement: true,
            insertValidationMessages: false,
            clearable: true,
            revertible: false,
            clearFunction: function () {
                var self = this;
                self.observable(undefined);
                $(self.observable.DOMElement).focus();
            },
            charsRemainingOptions: {
                maxLength: 255
            }
        };

        result.status.subscribe(function (newValue) {
            self.unsavedChanges(true);
        }, result);

        result.note.subscribe(function (newValue) {
            self.unsavedChanges(true);
        }, result);

        result.toJS = function () {
            return {
                qualityId: self.quality().QualityID,
                treatmentId: result.TreatmentID,
                treatmentStatusId: result.status(),
                note: result.note() == '' ? null : result.note()
            }
        }

        return result;
    }

    self.fetchExistingQualityTreatments = function (onComplete) {
        self.busy(true);
        var data = {
            qualityId: self.quality().QualityID
        };
        console.log('fabricTreatmentFactory fetchExistingQualityTreatments calling with', data);
        $.ajax({
            url: '/api/ProductMaintenanceAPI/FetchExistingQualityTreatments',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('fabricTreatmentFactory fetchExistingQualityTreatments returned', data);
                self.busy(false);
                self.treatmentRecords([]);
                self.existingQualityTreatments(data);
                //self.treatmentTypes(self.buildTreatmentTypes());

                self.unsavedChanges(false);

                if (typeof onComplete == 'function') {
                    onComplete();
                }
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    self.saveQualityTreatmentRecord = function (record) {
        var treatments = Enumerable.From(self.treatmentRecords()).Where(function (x) {
            return x.treatmentRecord.TreatmentStatusID != null
        }).Select(function (x) {
            return x.toJS();
        }).ToArray();

        var data = {
            qualityId: self.quality().QualityID,
            qualityTreatments: treatments
        };

        self.busyMessage('Saving...');

        self.busy(true);

        console.log('fabricTreatmentFactory saveQualityTreatmentRecord calling with', data);

        /* Testing */
        //self.busy(false);
        //self.mode(TREATMENT_VIEW_MODE);
        //self.busyMessage('fabricTreatmentFactory saveQualityTreatmentRecord returned early for testing.');
        //return;
        /* End of Testing */

        $.ajax({
            url: '/api/productMaintenanceAPI/SaveQualityTreatmentProviders',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log('fabricTreatmentFactory saveQualityTreatmentRecord returned', data);
                self.busy(false);
                self.fetchExistingQualityTreatments(function () {
                    self.mode(TREATMENT_VIEW_MODE)
                });
            },
            error: function (xhr, s, a) {
                $.showError(xhr, s, a);
                self.busy(false);
            }
        });
    }

    self.reset = function () {
        console.log('fabricTreatmentFactory reset called', self);
        self.busy(false);
        self.busyMessage('Loading...');
        self.unsavedChanges(false);
        self.quality(undefined);
        self.qualityAutocomplete.observable(undefined);
        self.existingQualityTreatments(undefined);
        self.mode(TREATMENT_VIEW_MODE);
        self.treatmentRecords([]);
        self.treatmentTypes([]);
    }

    //#endregion

    //#region Events

    //#endregion

    return self;
};

const treatmentRecord = ((parent, data) => {
    let self = {};

    //#region Properties

    self.originalData = data;

    self.parent = parent;

    self.editing = ko.observable(false);

    self.treatmentId = ko.observable(data.TreatmentID);

    self.autocompleteLabel = ko.observable(data.AutocompleteLabel);

    self.treatmentProviderId = ko.observable(data.TreatmentProviderID).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateTreatmentEditNow()
            },
            message: 'Treatment Provider ID'
        }
    });

    self.name = ko.observable(data.Name).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateTreatmentEditNow()
            },
            message: 'Treatment Name'
        }
    });

    self.description = ko.observable(data.Description);

    self.countries = ko.observableArray([]);

    self.countryIds = ko.observableArray(Enumerable.From(data.Countries).Select(function (x) {
        return x.CountryID;
    }).ToArray());

    self.sortOrder = ko.observable(data.SortOrder).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateTreatmentEditNow()
            },
            message: 'Treatment Sort Order'
        }
    }); // how are we going to present this, in context (of this treatment's siblings), in an easily editable way?

    self.treatmentTypeId = ko.observable(data.TreatmentTypeID).extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateTreatmentEditNow()
            },
            message: 'Treatment Type'
        }
    });

    self.productFilterGroupId = ko.observable(data.ProductFilterGroupID)

    self.productFilterGroup = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateTreatmentEditNow()
            },
            message: 'Treatment Product Filter Group'
        }
    }); // this fills when the product filter group list has bound

    self.productId = ko.observable(data.ProductID);

    self.product = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.validateTreatmentEditNow()
            },
            message: 'Treatment Product'
        }
    }); // this fills when the product list has bound

    self.supplierProductCode = ko.observable(data.SupplierProductCode);

    self.validateTreatmentEditNow = ko.observable(false);

    // tracks unsaved changes
    self.unsavedChanges = ko.observable(false);

    // busy?
    self.busy = ko.observable(false);

    // busy message
    self.busyMessage = ko.observable('Saving...');

    // Right, now we need all the pretty gubbins which lets you edit these fields...

    self.nameParams = {
        label: 'Treatment Name',
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: true,
        revertible: false,
        observable: self.name,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 255
        }
    };

    self.descriptionParams = {
        label: 'Description',
        enable: true,
        observable: self.description,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        clearable: true,
        revertible: false,
        rows: 3,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 255
        }
    };

    self.treatmentProviderParams = {
        label: 'Treatment Provider',
        enable: ko.observable(true),
        disable: ko.observable(false),
        observable: self.treatmentProviderId,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        options: ko.observableArray(getTreatmentProviders()),
        optionsText: 'Name',
        optionsValue: 'TreatmentProviderID',
        optionsCaption: ' ',
        width: 'auto',
        clearable: true,
        revertible: false,
        onSelect: function () {

        },
        clearFunction: function () {
            var self = this;
            self.treatmentProvider(undefined);
        }
    };

    self.treatmentTypeParams = {
        label: 'Treatment Type',
        enable: ko.observable(true),
        disable: ko.observable(false),
        observable: self.treatmentTypeId,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        options: ko.observableArray(getTreatmentTypes()),
        optionsText: 'Name',
        optionsValue: 'TreatmentTypeID',
        optionsCaption: ' ',
        width: 'auto',
        clearable: true,
        revertible: false,
        onSelect: function () {

        },
        clearFunction: function () {
            var self = this;
            self.treatmentType(undefined);
        }
    }


    self.countryParams = {
        enable: true,
        enable: ko.observable(true),
        disable: ko.observable(false),
        observable: self.countries, // for a multi-select list, this is a one-way street.
        // this is utilised by the mdcSelect component.
        validate: self.countryIds,
        clearable: true,
        revertible: false,
        width: 'auto',
        label: 'Countries',
        valuePrimitive: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        controlClass: 'form-control',
        multiSelectSettings: {
            value: self.countryIds, // for a multi-select list, this is NOT a one-way street.
            dataItems: self.countries,
            dataValueField: 'CountryID',
            dataTextField: 'Name',
            height: 300,
            widget: ko.observable(),
            groupClick: function (e, sender) {
                var self = this;
                console.log('groupClick', e);
                e.preventDefault();
                e.stopPropagation();
                var data = sender.dataSource.data();
                var countries = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].value == e.target.textContent) {
                        countries = Enumerable.From(data[i].items).Select(function (x) {
                            return x.CountryID
                        }).ToArray();
                    }
                }
                sender.value(countries);
                sender.trigger('change');
            },
            open: function (e) {
                var self = this;
                $(e.sender._widgetOptions.dataItems.mdcSelect.root_).toggleClass('mdc-select--focused');
                console.log(self);
                $('.k-group', self.listView.content).on('click', function (event) {
                    self._widgetOptions.groupClick(event, e.sender);
                });
                $(self.listView.header).on('click', function (event) {
                    self._widgetOptions.groupClick(event, e.sender);
                });
            },
            close: function (e) {
                $(e.sender._widgetOptions.dataItems.mdcSelect.root_).toggleClass('mdc-select--focused');
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
                },
                group: { field: 'ContinentName' }
            }),
            valuePrimitive: true,
            autoWidth: false,
            autoBind: true, // this should be left true for multiselects so they don't go a bit skewiff -
            // if you don't permit autoBinding, and provide preselected values 
            // and rely on knockout-kendo to perform the updating... it *almost* works
            // however it does not clear the widget()._initialValues array,
            // which - when you then go to clear the widget - reloads selection
            // upon open. Which is pants.
            autoClose: false,
            optionLabel: ' ',
            filter: 'startswith'
        },
        clearFunction: function () {
            var self = this
            self.multiSelectSettings.value([]);
            self.multiSelectSettings.widget().value([]);
            self.multiSelectSettings.widget().trigger('change');
        }
    }

    self.productFilterGroupParams = {
        observable: self.productFilterGroup,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: true,
        revertible: false,
        width: 'auto',
        label: 'Product Filter Group',
        valuePrimitive: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        controlClass: 'form-control',
        dropDownListSettings: {
            value: self.productFilterGroupId,
            dataItem: self.productFilterGroup,
            dataValueField: 'ProductFilterGroupID',
            dataTextField: 'Name',
            widget: ko.observable(),
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
                            url: '/api/ComponentAPI/GetProductFilterGroups',
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
            self.dropDownListSettings.widget().value('');
            self.dropDownListSettings.widget()._widgetOptions.dataItem.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
            self.dropDownListSettings.widget()._widgetOptions.dataItem.mdcSelect.label_.float(false);
        }
    }

    self.productParams = {
        observable: self.product,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: true,
        revertible: false,
        width: 'auto',
        label: 'Treatment Product Record',
        valuePrimitive: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        controlClass: 'form-control',
        dropDownListSettings: {
            height: 400,
            value: self.productId,
            dataItem: self.product,
            dataValueField: 'ProductID',
            dataTextField: 'AutocompleteLabel',
            widget: ko.observable(),
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
                            url: '/api/ComponentAPI/GetTreatmentProducts',
                            type: "GET",
                            data: data,
                            success: function (data) {
                                data.Data = $.map(data.Data, function (p) {
                                    return $.extend(p, {
                                        AutocompleteLabel: p.Code + ' - ' + p.Name
                                    });
                                });
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
            self.dropDownListSettings.widget().value('');
            self.dropDownListSettings.widget()._widgetOptions.dataItem.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
            self.dropDownListSettings.widget()._widgetOptions.dataItem.mdcSelect.label_.float(false);
        }
    }

    //#endregion

    //#region Computeds

    self.editOrSaveClass = ko.pureComputed(function () {
        if (self.editing()) {
            return 'btn-green';
        } else {
            return 'btn-blue';
        }
    }, self);

    //#endregion

    //#region Components


    //#endregion

    //#region Subscriptions

    self.name.subscribe(function (newValue) { self.changeDetected(); });
    self.countryIds.subscribe(function (newValue) { self.changeDetected(); }, self, 'arrayChange');
    self.productFilterGroupId.subscribe(function (newValue) { self.changeDetected(); });
    self.productId.subscribe(function (newValue) { self.changeDetected(); });
    self.description.subscribe(function (newValue) { self.changeDetected(); });

    //#endregion

    //#region Validation Groups

    self.errors = ko.validation.group([
        self.name,
        self.productFilterGroup,
        self.product
    ]);

    //#endregion

    //#region Functions

    self.changeDetected = function () {
        self.unsavedChanges(true);
    }

    self.cancelOrEdit = function () {
        if (!self.editing()) {
            self.editing(true);
        } else {
            self.cancelEdit();
        }
    }

    self.saveTreatment = function () {
        self.errors.showAllMessages(false);
        self.validateTreatmentEditNow(true);
        window.setTimeout(function () {
            if (self.errors().length) {
                self.errors.showAllMessages(true);
                self.errors.filter(function (x) {
                    if (!x.isValid()) {
                        x.isValid.notifySubscribers(x.isValid());
                    }
                })
            } else {
                self.busy(true);
                self.busyMessage('Saving...');
                var data = {
                    treatmentId: self.treatmentId(),
                    treatmentTypeId: self.treatmentTypeId(),
                    treatmentProviderId: self.treatmentProviderId(),
                    sortOrder: self.sortOrder(),
                    name: self.name(),
                    description: self.description(),
                    productFilterGroupId: self.productFilterGroupId(),
                    productId: self.productId(),
                    countryIds: self.countryIds()
                };
                console.log('SaveTreatment calling with', data);
                $.ajax({
                    url: '/api/ProductMaintenanceAPI/SaveTreatment',
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    success: function (data) {
                        self.busy(false);
                        self.treatmentId(data.treatmentId);
                        self.editing(!self.editing());

                        self.parent.treatments.remove(function (x) {
                            return x.TreatmentID == data.TreatmentID;
                        });
                        self.parent.treatments.push(data);

                        self.parent.busy(true);
                        self.parent.busyMessage('Refreshing...');
                        self.parent.treatmentProviderParams.dropDownListSettings.widget().dataSource.read().then(function () {
                            //console.log('after treatmentProviderParams.dropDownListSettings.widget().dataSource.read()');
                            // treatmentProvider is not altered by the read... this is super frustrating.
                            // it's a different bloody object... but this is bound on the ID, not the object!
                            self.parent.treatmentProvider(Enumerable.From(self.parent.treatmentProviderParams.dropDownListSettings.widget().dataSource.data()).Where(function (x) {
                                return x.TreatmentProviderID == self.parent.treatmentProviderId()
                            }).Single());
                            self.parent.busy(false);
                        });
                    },
                    error: function (xhr, s, a) {
                        self.busy(false);
                        $.showError(xhr, s, a);
                    }
                });

            }
        }, 0);
    };

    self.deleteTreatment = function () {
        $.confirm('Are you sure?', 'This will flag the Treatment record as Deleted. This can be undone by an administrator.',
            function () {
                self.busy(true);
                self.busyMessage('Deleting...');
                var data = {
                    treatmentId: self.treatmentId()
                };
                console.log('deleteTreatment calling with', data);
                $.ajax({
                    url: '/api/ProductMaintenanceAPI/DeleteTreatment',
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    success: function (xhr, s, a) {
                        self.busy(false);
                        self.editing(!self.editing());

                        //var treatmentType = Enumerable.From(self.parent.treatmentTypes()).Where(function (x) {
                        //    return x.TreatmentTypeID == self.treatmentTypeId()
                        //}).Single();
                        //treatmentType.treatments.remove(self);
                        self.parent.busy(true);
                        self.parent.busyMessage('Refreshing...');
                        self.parent.treatmentProviderParams.dropDownListSettings.widget().dataSource.read().then(function () {
                            //console.log('after treatmentProviderParams.dropDownListSettings.widget().dataSource.read()');
                            self.parent.treatmentProvider(Enumerable.From(self.parent.treatmentProviderParams.dropDownListSettings.widget().dataSource.data()).Where(function (x) {
                                return x.TreatmentProviderID == self.parent.treatmentProviderId()
                            }).Single());
                            //self.parent.nonce.valueHasMutated();
                            self.parent.busy(false);
                        });

                        // Oh, dear... we need to remove from parent treatments - this will have an impact on the Fabric Quality Treatments thing...
                        self.parent.treatments.remove(function (x) {
                            return x.TreamtentID == self.treatmentId()
                        });
                        delete this;
                    },
                    error: function (xhr, s, a) {
                        self.busy(false);
                        $.showError(xhr, s, a);
                    }
                });
            },
            function () {

            });
    }

    self.cancelEdit = function () {
        if (self.unsavedChanges()) {
            $.confirm('Warning', 'You have unsaved changes. Are you sure you want to cancel?', function () {
                self.editing(false);
                self.parent.treatmentProvider.valueHasMutated();
            }, function () {

            });
        } else {
            self.editing(false);
        }
    }

    self.reset = function () {
        console.log('treatmentRecord reset called', self);
        self.validateTreatmentEditNow(false);
        self.unsavedChanges(false);
        self.editing(false);
        self.errors.showAllMessages(false);
    }

    //#endregion

    //#region Events


    //#endregion

    return self;
});


/*
 

    self.countries = ko.observableArray([]);

    self.countryIds = ko.observableArray([81]).extend({
        minLength: {
            params: 1,
            message: 'Must have one or more countries selected'
        }
    });

    self.countryParams = {
        observable: self.countries, // for a multi-select list, this is a one-way street.
        // this is utilised by the mdcSelect component.
        validate: self.countryIds,
        showClear: true,
        width: 'auto',
        label: 'Countries',
        valuePrimitive: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        controlClass: 'form-control',
        multiSelectSettings: {
            value: self.countryIds, // for a multi-select list, this is NOT a one-way street.
            dataItems: self.countries,
            dataValueField: 'CountryID',
            dataTextField: 'Name',
            height: 300,
            widget: ko.observable(),
            groupClick: function (e, sender) {
                var self = this;
                console.log('groupClick', e);
                e.preventDefault();
                e.stopPropagation();
                var data = sender.dataSource.data();
                var countries = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].value == e.target.textContent) {
                        countries = Enumerable.From(data[i].items).Select(function (x) {
                            return x.CountryID
                        }).ToArray();
                    }
                }
                sender.value(countries);
                sender.trigger('change');
            },
            open: function (e) {
                var self = this;
                $(e.sender._widgetOptions.dataItems.mdcSelect.root_).toggleClass('mdc-select--focused');
                console.log(self);
                $('.k-group', self.listView.content).on('click', function (event) {
                    self._widgetOptions.groupClick(event, e.sender);
                });
                $(self.listView.header).on('click', function (event) {
                    self._widgetOptions.groupClick(event, e.sender);
                });
            },
            close: function (e) {
                $(e.sender._widgetOptions.dataItems.mdcSelect.root_).toggleClass('mdc-select--focused');
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
                },
                group: { field: 'ContinentName' }
            }),
            valuePrimitive: true,
            autoWidth: false,
            autoBind: true, // this should be left true for multiselects so they don't go a bit skewiff -
            // if you don't permit autoBinding, and provide preselected values
            // and rely on knockout-kendo to perform the updating... it *almost* works
            // however it does not clear the widget()._initialValues array,
            // which - when you then go to clear the widget - reloads selection
            // upon open. Which is pants.
            autoClose: false,
            optionLabel: ' ',
            filter: 'startswith'
        },
        clearFunction: function () {
            var self = this
            self.multiSelectSettings.value([]);
            self.multiSelectSettings.widget().value([]);
            self.multiSelectSettings.widget().trigger('change');
        }
    }


 */