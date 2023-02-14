var furnitureMaintenanceViewModel = function () {
    var self = this;

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(getPreselectedModelId() != null);

    self.busyMessage = ko.observable(getPreselectedModelId() != null ? 'Fetching Model Information...' : undefined);

    self.modelId = ko.observable(getPreselectedModelId() || '');

    self.modelDetails = ko.observable();

    self.modelParams = kendoMDCDropDownList({
        autoBind: false,
        label: 'Furniture Model',
        template: '#: Label #',
        valueTemplate: '#: Label #',
        optionLabel: {
            Code: '',
            ModelID: null
        },
        optionLabelTemplate: ' ',
        textField: 'Code',
        valueField: 'ModelID',
        endPoint: '/api/furnitureapi/GetModels',
        idObservable: self.modelId,
        objObservable: self.modelDetails,
        showClear: true,
        permitRevert: false,
        height: 340,
        filterable: true,
        virtual: true,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                console.log('furnitureModelValueMapper calling with', options);
                $.ajax({
                    url: '/api/furnitureApi/FurnitureModelValueMapper',
                    type: 'POST',
                    data: {
                        modelId: options.value
                    },
                    success: function (data) {
                        if (typeof options.success === 'function') {
                            options.success(data[0]);
                        }
                    }
                });
            }
        },
        filter: 'startswith',
        filtering: function (ev) {
            if (ev.filter) {
                var filterValue = ev.filter.value;
                if (filterValue == '') {
                    ev.preventDefault();
                    this.dataSource.filter('');
                    return;
                }
                ev.preventDefault();
                this.dataSource.filter({
                    logic: "or",
                    filters: [
                        {
                            field: "Design.Name",
                            operator: "contains",
                            value: filterValue
                        },
                        {
                            field: "Code",
                            operator: "startswith",
                            value: filterValue
                        },
                        {
                            field: "SeatType.Name",
                            operator: "contains",
                            value: filterValue
                        }
                    ]
                })
            }
        },
        select: function (e) {
            console.log('changed', e);
        },
        disabled: false
    });

    self.suppliers = ko.observableArray(getSuppliers().map(function (s) {
        return supplier({
            record: s
        });
    }));

    self.showMergeSaved = ko.observable(false);

    self.cushionFillings = ko.observableArray(getCushionFillings());

    self.designSeatCushionFillings = ko.observableArray([]);
    self.designSeatCushionFillingIds = ko.observableArray([]);

    self.designSeatCushionFillingsParams = {
        observable: self.designSeatCushionFillings,
        validate: self.designSeatCushionFillingIds,
        showClear: true,
        width: 'auto',
        label: 'Seat Cushion Fillings',
        valuePrimitive: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        controlClass: 'form-control',
        multiSelectSettings: {
            value: self.designSeatCushionFillingIds,
            dataItems: self.designSeatCushionFillings,
            dataValueField: 'CushionFillingID',
            dataTextField: 'Name',
            height: 300,
            widget: ko.observable(),
            open: function (e) {
                var self = this;
                $(e.sender._widgetOptions.dataItems.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            close: function (e) {
                $(e.sender._widgetOptions.dataItems.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            data: self.cushionFillings,
            valuePrimitive: true,
            autoWidth: false,
            autoBind: true,
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
    };

    self.designBackCushionFillingIds = ko.observableArray([]);
    self.designBackCushionFillings = ko.observableArray([]);

    self.designBackCushionFillingsParams = {
        observable: self.designBackCushionFillings,
        validate: self.designBackCushionFillingIds,
        showClear: true,
        width: 'auto',
        label: 'Back Cushion Fillings',
        valuePrimitive: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        controlClass: 'form-control',
        multiSelectSettings: {
            value: self.designBackCushionFillingIds,
            dataItems: self.designBackCushionFillings,
            dataValueField: 'CushionFillingID',
            dataTextField: 'Name',
            height: 300,
            widget: ko.observable(),
            open: function (e) {
                var self = this;
                $(e.sender._widgetOptions.dataItems.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            close: function (e) {
                $(e.sender._widgetOptions.dataItems.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            data: self.cushionFillings,
            valuePrimitive: true,
            autoWidth: false,
            autoBind: true,
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
    };

    //self.coverTypes = ko.observableArray(getCoverTypes());

    //self.designCoverTypeIds = ko.observableArray([]);
    //self.designCoverTypes = ko.observableArray([]);

    //self.designCoverTypesParams = {
    //    observable: self.designCoverTypes,
    //    validate: self.designCoverTypeIds,
    //    showClear: true,
    //    width: 'auto',
    //    label: 'Cover Types',
    //    valuePrimitive: false,
    //    useNativeValidation: false,
    //    decorateInputElement: false,
    //    insertValidationMessages: false,
    //    controlClass: 'form-control',
    //    multiSelectSettings: {
    //        value: self.designCoverTypeIds,
    //        dataItems: self.designCoverTypes,
    //        dataValueField: 'CoverTypeID',
    //        dataTextField: 'Name',
    //        height: 300,
    //        widget: ko.observable(),
    //        open: function (e) {
    //            var self = this;
    //            $(e.sender._widgetOptions.dataItems.mdcSelect.root_).toggleClass('mdc-select--focused');
    //        },
    //        close: function (e) {
    //            $(e.sender._widgetOptions.dataItems.mdcSelect.root_).toggleClass('mdc-select--focused');
    //        },
    //        data: self.coverTypes,
    //        valuePrimitive: true,
    //        autoWidth: false,
    //        autoBind: true,
    //        autoClose: false,
    //        optionLabel: ' ',
    //        filter: 'startswith'
    //    },
    //    clearFunction: function () {
    //        var self = this
    //        self.multiSelectSettings.value([]);
    //        self.multiSelectSettings.widget().value([]);
    //        self.multiSelectSettings.widget().trigger('change');
    //    }
    //};

    self.permitMultipleFabrics = ko.observable(false);

    self.designPermitMixedFabric = {
        checkboxId: 'design-mixfab',
        label: 'Permit mixing of different Fabrics across Components',
        observable: ko.observable(false),
        useNativeValidation: false,
        disabled: false
    };

    self.designFabricRestrictions = ko.observableArray([]);

    self.designFabricSearch = ko.observable().extend({
        required: false
    });

    self.designFabricRestrictionAutocompleteResults = ko.observableArray([]);

    self.designFabricRestrictionAutocomplete = {
        label: 'Search for Fabric by Code or Name',
        observable: self.designFabricSearch,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        clearFunction: function () {
            self.designFabricSearch(undefined);
            self.designFabricRestrictionAutocomplete.observable(undefined);
            self.designFabricRestrictionAutocompleteResults([]);
            $(self.designFabricRestrictionAutocomplete.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        },
        autocompleteSettings: {
            value: self.designFabricSearch,
            appendTo: 'body',
            source: function (request, response) {
                var data = {
                    designId: self.modelDetails().DesignID,
                    searchTerm: request.term
                };
                $.ajax({
                    url: '/api/furnitureApi/DesignFabricRestrictionSearch',
                    type: "POST",
                    dataType: "json",
                    data: data,
                    success: function (data) {
                        console.log('designFabricRestrictionAutocomplete returned', data);
                        self.designFabricRestrictionAutocompleteResults([]);
                        ko.utils.arrayForEach(data, function (d) {
                            self.designFabricRestrictionAutocompleteResults.push(fabricRestriction({ record: d }));
                        });
                        response();
                    }
                });
            },
            minLength: 1,
            select: function (event, ui) {
                event.preventDefault();
            }
        }
    };

    self.designStitchColourRestrictions = ko.observableArray([]);

    self.designStitchColourSearch = ko.observable().extend({
        required: false
    });

    self.designStitchColourRestrictionAutocompleteResults = ko.observableArray([]);

    self.designStitchColourRestrictionAutocomplete = stitchColourAutocompleter({
        observable: self.designStitchColourSearch,
        results: self.designStitchColourRestrictionAutocompleteResults,
        additionalParams: {
            designId: self.designId
        }
    });

    self.legTypes = ko.observableArray(getLegTypes());

    self.designLegTypeIds = ko.observableArray([]);
    self.designLegTypes = ko.observableArray([]);

    self.designLegTypesParams = {
        observable: self.designLegTypes,
        validate: self.designLegTypeIds,
        showClear: true,
        width: 'auto',
        label: 'Leg Types',
        valuePrimitive: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        controlClass: 'form-control',
        multiSelectSettings: {
            value: self.designLegTypeIds,
            dataItems: self.designLegTypes,
            dataValueField: 'LegTypeID',
            dataTextField: 'Name',
            height: 300,
            widget: ko.observable(),
            open: function (e) {
                var self = this;
                $(e.sender._widgetOptions.dataItems.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            close: function (e) {
                $(e.sender._widgetOptions.dataItems.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            data: self.legTypes,
            valuePrimitive: true,
            autoWidth: false,
            autoBind: true,
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
    };

    self.originalModelWidth = ko.observable();

    self.modelWidth = {
        label: 'Width (cm)',
        observable: ko.observable().extend({
            numberFormatted: {
                digits: 0,
                currency: {
                    FormattingCulture: 'en-GB'
                },
                skipExtraNotify: true
            },
            min: {
                params: 1,
                message: ' '
            },
            max: {
                params: 9999,
                message: ' '
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: true,
        showClear: false,
        disabled: ko.observable(false),
        permitRevert: true,
        originalValue: self.originalModelWidth,
        revertFunction: function () {
            var self = this;
            self.observable(ko.unwrap(self.originalValue));
        }
    }

    self.originalModelHeight = ko.observable();

    self.modelHeight = {
        label: 'Height (cm)',
        observable: ko.observable().extend({
            numberFormatted: {
                digits: 0,
                currency: {
                    FormattingCulture: 'en-GB'
                },
                skipExtraNotify: true
            },
            min: {
                params: 1,
                message: ' '
            },
            max: {
                params: 9999,
                message: ' '
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: true,
        showClear: false,
        disabled: ko.observable(false),
        permitRevert: true,
        originalValue: self.originalModelHeight,
        revertFunction: function () {
            var self = this;
            self.observable(ko.unwrap(self.originalValue));
        }
    }

    self.originalModelDepth = ko.observable();

    self.modelDepth = {
        label: 'Depth (cm)',
        observable: ko.observable().extend({
            numberFormatted: {
                digits: 0,
                currency: {
                    FormattingCulture: 'en-GB'
                },
                skipExtraNotify: true
            },
            min: {
                params: 1,
                message: ' '
            },
            max: {
                params: 9999,
                message: ' '
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: true,
        showClear: false,
        disabled: ko.observable(false),
        permitRevert: true,
        originalValue: self.originalModelDepth,
        revertFunction: function () {
            var self = this;
            self.observable(ko.unwrap(self.originalValue));
        }
    }

    self.originalModelSeatHeight = ko.observable();

    self.modelSeatHeight = {
        label: 'Seat Height (cm)',
        observable: ko.observable().extend({
            numberFormatted: {
                digits: 0,
                currency: {
                    FormattingCulture: 'en-GB'
                },
                skipExtraNotify: true
            },
            min: {
                params: 1,
                message: ' '
            },
            max: {
                params: 9999,
                message: ' '
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: true,
        showClear: false,
        disabled: ko.observable(false),
        permitRevert: true,
        originalValue: self.originalModelSeatHeight,
        revertFunction: function () {
            var self = this;
            self.observable(ko.unwrap(self.originalValue));
        }
    }

    self.originalModelSeatDepth = ko.observable();

    self.modelSeatDepth = {
        label: 'Seat Depth (cm)',
        observable: ko.observable().extend({
            numberFormatted: {
                digits: 0,
                currency: {
                    FormattingCulture: 'en-GB'
                },
                skipExtraNotify: true
            },
            min: {
                params: 1,
                message: ' '
            },
            max: {
                params: 9999,
                message: ' '
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: true,
        showClear: false,
        disabled: ko.observable(false),
        permitRevert: true,
        originalValue: self.originalModelSeatDepth,
        revertFunction: function () {
            var self = this;
            self.observable(ko.unwrap(self.originalValue));
        }
    }

    self.originalModelSeatCount = ko.observable();

    self.modelSeatCount = {
        label: 'Seat Count',
        observable: ko.observable().extend({
            numberFormatted: {
                digits: 0,
                currency: {
                    FormattingCulture: 'en-GB'
                },
                skipExtraNotify: true
            },
            min: {
                params: 0,
                message: ' '
            },
            max: {
                params: 20,
                message: ' '
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: true,
        showClear: false,
        disabled: ko.observable(false),
        permitRevert: true,
        originalValue: self.originalModelSeatCount,
        revertFunction: function () {
            var self = this;
            self.observable(ko.unwrap(self.originalValue));
        }
    }

    self.originalModelSeatCushionCount = ko.observable();

    self.modelSeatCushionCount = {
        label: 'Seat Cushion Count',
        observable: ko.observable().extend({
            numberFormatted: {
                digits: 0,
                currency: {
                    FormattingCulture: 'en-GB'
                },
                skipExtraNotify: true
            },
            min: {
                params: 0,
                message: ' '
            },
            max: {
                params: 20,
                message: ' '
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: true,
        showClear: false,
        disabled: ko.observable(false),
        permitRevert: true,
        originalValue: self.originalModelSeatCushionCount,
        revertFunction: function () {
            var self = this;
            self.observable(ko.unwrap(self.originalValue));
        }
    }

    self.originalModelBackCushionCount = ko.observable();

    self.modelBackCushionCount = {
        label: 'Back Cushion Count',
        observable: ko.observable().extend({
            numberFormatted: {
                digits: 0,
                currency: {
                    FormattingCulture: 'en-GB'
                },
                skipExtraNotify: true
            },
            min: {
                params: 0,
                message: ' '
            },
            max: {
                params: 20,
                message: ' '
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: true,
        showClear: false,
        disabled: ko.observable(false),
        permitRevert: true,
        originalValue: self.originalModelBackCushionCount,
        revertFunction: function () {
            var self = this;
            self.observable(ko.unwrap(self.originalValue));
        }
    }

    self.modelInterline = {
        checkboxId: 'model-interline',
        label: 'Interlining',
        observable: ko.observable(),
        useNativeValidation: false,
        disabled: false
    };

    self.modelButton = {
        checkboxId: 'model-button',
        label: 'Buttons',
        observable: ko.observable(),
        useNativeValidation: false,
        disabled: false
    };

    self.modelTrim = {
        checkboxId: 'model-trim',
        label: 'Trim',
        observable: ko.observable(),
        useNativeValidation: false,
        disabled: false
    };

    self.modelPermitAdditionalCover = {
        checkboxId: 'model-addntl-cover',
        label: 'Permit Ordering Additional Cover',
        observable: ko.observable(),
        useNativeValidation: false,
        disabled: false
    };

    self.modelStitching = {
        checkboxId: 'model-stitching',
        label: 'Stitching',
        observable: ko.observable(),
        useNativeValidation: false,
        disabled: false
    };

    self.modelLeatherAvailable = {
        checkboxId: 'model-leather-available',
        label: 'Leather Available',
        observable: ko.observable(),
        useNativeValidation: false,
        disabled: false
    };

    self.modelLegsRemovable = {
        checkboxId: 'model-legs-removable',
        label: 'Legs Removable',
        observable: ko.observable(),
        useNativeValidation: false,
        disabled: false
    };

    self.modelWoodenArms = {
        checkboxId: 'model-wooden-arms',
        label: 'Wooden Arm(s)',
        observable: ko.observable(),
        useNativeValidation: false,
        disabled: false
    };

    self.modelDiscontinued = {
        checkboxId: 'model-discontinued',
        label: 'Discontinued',
        observable: ko.observable(),
        useNativeValidation: false,
        disabled: false
    };

    self.modelComments = {
        label: 'Other Comments',
        observable: ko.observable(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        readOnly: false,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        rows: 3,
        charsRemainingOptions: {
            maxLength: 1000
        }
    }

    self.modelLegNotes = {
        label: 'Leg Notes',
        observable: ko.observable().extend(),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        readOnly: false,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        rows: 3,
        charsRemainingOptions: {
            maxLength: 255
        }
    }

    self.modelImageId = ko.observable();

    self.modelImageDetails = ko.observable();

    self.modelImageParams = kendoMDCDropDownList({
        autoBind: false,
        label: 'Image',
        template: '<img class="thumb" src="https://www.designersguild.com/image/32/#:ImageID#" /> #: Name.replace("(default)", "") #',
        valueTemplate: '#: Name.replace("(default)", "") #',
        optionLabelTemplate: null,
        optionLabel: null,
        textField: 'Name',
        valueField: 'ImageID',
        endPoint: '/api/componentapi/GetDefaultImages',
        idObservable: self.modelImageId,
        objObservable: self.modelImageDetails,
        showClear: false,
        permitRevert: false,
        height: 340,
        virtual: true,
        virtualOptions: {
            itemHeight: 34,
            mapValueTo: 'dataItem',
            valueMapper: function (options) {
                $.ajax({
                    url: '/api/componentapi/DefaultImageModelValueMapper',
                    type: 'POST',
                    data: {
                        imageId: options.value
                    },
                    success: function (data) {
                        if (typeof options.success === 'function') {
                            options.success(data[0]);
                        }
                    }
                });
            }
        },
        filtering: function (ev) {
            if (ev.filter) {
                var filterValue = ev.filter.value;
                ev.preventDefault();
                this.dataSource.filter({
                    filters: [
                        {
                            field: "Name",
                            operator: "contains",
                            value: filterValue
                        }
                    ]
                })
            }
        },
        disabled: false,
        readOnly: true
    });

    self.recommendedStitchBusy = ko.observable(false);

    self.savingRecommendedStitchColour = ko.observable();

    self.recommendedStitchRecord = ko.observable();

    self.recommendedStitchColourSearch = ko.observable().extend({
        required: false
    });

    self.recommendedStitchColourRestrictionAutocompleteResults = ko.observableArray([]);

    self.recommendedStitchColourRestrictionAutocomplete = stitchColourAutocompleter({
        observable: self.recommendedStitchColourSearch,
        results: self.recommendedStitchColourRestrictionAutocompleteResults
    });

    //#endregion

    //#region Subscriptions

    self.modelDetails.subscribe(function (newValue) {
        console.log('modelDetails subscribe hit', newValue);
        if (newValue) {
            self.originalModelWidth(newValue.Width);
            self.modelWidth.observable(newValue.Width);
            self.originalModelHeight(newValue.Height);
            self.modelHeight.observable(newValue.Height);
            self.originalModelDepth(newValue.Depth);
            self.modelDepth.observable(newValue.Depth);
            self.originalModelSeatHeight(newValue.SeatHeight);
            self.modelSeatHeight.observable(newValue.SeatHeight);
            self.originalModelSeatDepth(newValue.SeatDepth);
            self.modelSeatDepth.observable(newValue.SeatDepth);
            self.originalModelSeatCount(newValue.SeatCount);
            self.modelSeatCount.observable(newValue.SeatCount);
            self.originalModelSeatCushionCount(newValue.SeatCushionCount);
            self.modelSeatCushionCount.observable(newValue.SeatCushionCount);
            self.originalModelBackCushionCount(newValue.BackCushionCount);
            self.modelBackCushionCount.observable(newValue.BackCushionCount);
            self.modelInterline.observable(newValue.Interline);
            self.modelButton.observable(newValue.Button);
            self.modelTrim.observable(newValue.Trim);
            self.modelPermitAdditionalCover.observable(newValue.PermitAdditionalCover);
            self.modelStitching.observable(newValue.Stiching);
            self.modelLeatherAvailable.observable(newValue.LeatherAvailable);
            self.modelLegsRemovable.observable(newValue.LegsRemovable);
            self.modelWoodenArms.observable(newValue.WoodenArms);
            self.modelDiscontinued.observable(newValue.Discontinued);
            self.modelLegNotes.observable(newValue.LegNotes);
            self.modelComments.observable(newValue.Comments);
            self.modelImageId(newValue.ImageID || 117989);
            self.designSeatCushionFillingIds(Enumerable.From(newValue.Design.SeatCushionFillings).Select('$.CushionFillingID').ToArray());
            self.designBackCushionFillingIds(Enumerable.From(newValue.Design.BackCushionFillings).Select('$.CushionFillingID').ToArray());
            self.designPermitMixedFabric.observable(newValue.Design.PermitMixedFabric);

            self.designFabricRestrictions([]);
            self.designStitchColourRestrictions([]);

            ko.utils.arrayForEach(newValue.Design.FabricRestrictions, function (fr) {
                self.designFabricRestrictions.push(fabricRestriction({ record: fr }));
            });

            ko.utils.arrayForEach(newValue.Design.StitchColourRestrictions, function (fr) {
                self.designStitchColourRestrictions.push(stitchColourRestriction({ record: fr }));
            });

            ko.utils.arrayForEach(self.suppliers(), function (s) {
                s.designCoverTypeIds([]);
            });

            for (var i = 0; i < newValue.Design.CoverTypes.length; i++) {
                var ct = newValue.Design.CoverTypes[i];
                var supplier = Enumerable.From(self.suppliers()).Where(function (x) {
                    return x.SupplierID == ct.SupplierID;
                }).SingleOrDefault();
                if (supplier)
                    supplier.designCoverTypeIds.push(ct.CoverTypeID);
            }

            //self.designCoverTypeIds(Enumerable.From(newValue.Design.CoverTypes).Select('$.CoverTypeID').ToArray());

            self.designLegTypeIds(Enumerable.From(newValue.Design.LegTypes).Select('$.LegTypeID').ToArray());


            ko.utils.arrayForEach(self.suppliers(), function (s) {
                ko.utils.arrayForEach(s.components(), function (c) {

                    if (ko.utils.arrayFirst(newValue.MaterialBreakdowns, function (x) {
                        return x.SupplierID == s.SupplierID && x.ComponentID == c.ComponentID
                    })) {
                        c.componentInvolvedInSelectedModel(true);

                        var plain = Enumerable.From(c.materialGroups()).Where(function (x) {
                            return x.MaterialGroupID == 1
                        }).Single();

                        // set subscriptions
                        ko.utils.arrayForEach(c.materialGroups(), function (mg) {
                            if (mg.MaterialGroupID == 1)
                                mg.disabled(false);
                            else {
                                mg.disabled(true);
                                plain.quantity.observable.subscribe(function (newValue) {
                                    if (!self.modelLeatherAvailable.observable() && mg.MaterialGroupID == 5)
                                        return;
                                    mg.quantity.observable(Math.ceil((newValue * mg.PlainMultiplier) * 100) / 100);
                                    mg.originalQuantity(mg.quantity.observable());
                                })
                            }
                        });

                        var plainBreakdown = Enumerable.From(newValue.MaterialBreakdowns).Where(function (x) {
                            return x.SupplierID == s.SupplierID &&
                                x.ComponentID == c.ComponentID &&
                                x.MaterialGroupID == plain.MaterialGroupID
                        }).Single();

                        plain.originalQuantity(plainBreakdown.Quantity);
                        plain.quantity.observable(plain.originalQuantity());

                    } else {
                        c.componentInvolvedInSelectedModel(false);

                        var plain = Enumerable.From(c.materialGroups()).Where(function (x) {
                            return x.MaterialGroupID == 1
                        }).Single();

                        ko.utils.arrayForEach(c.materialGroups(), function (mg) {
                            if (mg.MaterialGroupID != 1) {
                                plain.quantity.observable.subscribe(function (newValue) {
                                    if (!self.modelLeatherAvailable.observable() && mg.MaterialGroupID == 5)
                                        return;
                                    mg.quantity.observable(Math.ceil((newValue * mg.PlainMultiplier) * 100) / 100);
                                    mg.originalQuantity(mg.quantity.observable());
                                })
                            }
                            mg.quantity.observable(undefined);
                            mg.originalQuantity(undefined);
                        });
                    }
                });
            });

            // no longer necessary
            //window.setTimeout(function () {
            //    if (!newValue.LeatherAvailable) {
            //        if (ko.utils.arrayFirst(self.suppliers(), function (s) {
            //            return ko.utils.arrayFirst(s.components(), function (c) {
            //                if (c.componentInvolvedInSelectedModel()) {
            //                    return ko.utils.arrayFirst(c.materialGroups(), function (mg) {
            //                        if (mg.MaterialGroupID == 5) {
            //                            return mg.quantity.observable() != null;
            //                        }
            //                    });
            //                } else {
            //                    return false;
            //                }
            //            })
            //        })) {
            //            self.modelLeatherAvailable.observable(true);
            //        }
            //    }
            //}, 0);

            self.busy(false);
        } else {
            ko.utils.arrayForEach(self.suppliers(), function (s) {
                ko.utils.arrayForEach(s.components(), function (c) {
                    c.componentInvolvedInSelectedModel(false);
                });
            });
        }
    });

    self.modelLeatherAvailable.observable.subscribe(function (newValue) {
        if (newValue) {
            ko.utils.arrayForEach(self.suppliers(), function (s) {
                ko.utils.arrayForEach(s.components(), function (c) {
                    if (c.componentInvolvedInSelectedModel()) {
                        var plain = Enumerable.From(c.materialGroups()).Where(function (x) {
                            return x.MaterialGroupID == 1;
                        }).Single();
                        ko.utils.arrayForEach(c.materialGroups(), function (mg) {
                            if (mg.MaterialGroupID == 5) {
                                if (plain.quantity.observable()) {
                                    mg.quantity.observable(Math.ceil(plain.quantity.observable() * mg.PlainMultiplier * 100) / 100);
                                    mg.originalQuantity(mg.quantity.observable());
                                } else {
                                    mg.quantity.observable(undefined);
                                    mg.originalQuantity(undefined);
                                }
                            }
                        });
                    }
                })
            });
        } else {
            ko.utils.arrayForEach(self.suppliers(), function (s) {
                ko.utils.arrayForEach(s.components(), function (c) {
                    if (c.componentInvolvedInSelectedModel()) {
                        ko.utils.arrayForEach(c.materialGroups(), function (mg) {
                            if (mg.MaterialGroupID == 5) {
                                mg.quantity.observable(undefined);
                                mg.disabled(true);
                            }
                        });
                    }
                })
            });
        }
    });

    //#endregion

    //#region Computeds

    self.designId = ko.computed(function () {
        if (self.modelDetails()) {
            return self.modelDetails().DesignID
        }
    }, self);

    self.savingRecommendedStitchColourId = ko.pureComputed(function () {
        if (self.savingRecommendedStitchColour()) {
            return self.savingRecommendedStitchColour().StitchColourID
        }
    }, self);

    //#endregion

    //#region Functions

    self.chooseRecommendedStitchColour = function (data) {
        self.savingRecommendedStitchColour(data);
    }

    self.saveRecommendedStitch = function () {
        self.recommendedStitchBusy(true);
        var data = {
            productId: self.recommendedStitchRecord().ProductID,
            designId: self.designId(),
            stitchColourId: self.savingRecommendedStitchColour().StitchColourID
        };
        console.log('calling saveRecommendedStitchColour with', data);
        $.ajax({
            url: '/api/furnitureapi/saveRecommendedStitchColour',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function () {
                self.recommendedStitchRecord().stitchColourId(self.savingRecommendedStitchColour().StitchColourID);
                self.recommendedStitchRecord().stitchColour(self.savingRecommendedStitchColour());
                self.recommendedStitchBusy(false);
                self.hideRecommendedStitchModal();
            },
            error: function (xhr, s, a) {
                self.recommendedStitchBusy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    self.setRecommendedStitchColour = function (data) {
        self.savingRecommendedStitchColour(data);
    }

    self.loadRecommendedStitch = function (data) {
        console.log('loadRecommendedStitch called with', data);
        self.recommendedStitchRecord(data);
        $(self.recommendedStitchColourRestrictionAutocomplete.observable.DOMElement).autocomplete('search');
        self.showRecommendedStitchModal();
    }

    self.showRecommendedStitchModal = function () {
        $('#recommended-stitch-modal').modal('show');
    }

    self.hideRecommendedStitchModal = function () {
        $('#recommended-stitch-modal').modal('hide');
    }

    self.clearFabricRestrictionSearchResults = function () {
        self.designFabricRestrictionAutocompleteResults([]);
    }

    self.addAllFabricRestrictions = function () {
        $.confirm('Are you sure?', 'This will include all current search results into this Design\'s fabric restrictions.', function () {
            ko.utils.arrayForEach(self.designFabricRestrictionAutocompleteResults(), function (x) {
                if (!Enumerable.From(self.designFabricRestrictions()).Where(function (y) {
                    return y.ProductID == x.ProductID
                }).Any()) {
                    self.designFabricRestrictions.push(x);
                }
            });
        });
    }

    self.removeAllFabricRestrictions = function () {
        $.confirm('Are you sure?', 'This will remove all fabric restrictions.', function () {
            self.designFabricRestrictions([]);
        });
    }

    self.isRestrictionInSelection = function (data) {
        var result = ko.utils.arrayFirst(self.designFabricRestrictions(), function (item) {
            return item.ProductID == data.ProductID
        });

        if (result == null) {
            return false
        } else {
            return true;
        }
    }

    self.removeFabricRestriction = function (data) {
        self.designFabricRestrictions.remove(function (x) {
            return x.ProductID == data.ProductID
        });
    }

    self.clearStitchColourSearchResults = function () {
        self.designStitchColourRestrictionAutocompleteResults([]);
    }

    self.addAllStitchColourRestrictions = function () {
        $.confirm('Are you sure?', 'This will include all current search results into this Design\'s stitch colour restrictions.', function () {
            ko.utils.arrayForEach(self.designStitchColourRestrictionAutocompleteResults(), function (x) {
                if (!Enumerable.From(self.designStitchColourRestrictions()).Where(function (y) {
                    return y.StitchColourID == x.StitchColourID
                }).Any()) {
                    self.designStitchColourRestrictions.push(x);
                }
            });
        });
    }

    self.removeAllStitchColourRestrictions = function () {
        $.confirm('Are you sure?', 'This will remove all stitch colour restrictions.', function () {
            self.designStitchColourRestrictions([]);
        });
    }

    self.isStitchColourInSelection = function (data) {
        var result = ko.utils.arrayFirst(self.designStitchColourRestrictions(), function (item) {
            return item.StitchColourID == data.StitchColourID
        });

        if (result == null) {
            return false
        } else {
            return true;
        }
    }

    self.removeStitchColourRestriction = function (data) {
        self.designStitchColourRestrictions.remove(function (x) {
            return x.StitchColourID == data.StitchColourID
        });
    }

    self.reset = function () {
        self.modelParams.clearFunction();
        self.showMergeSaved(false);

        self.originalModelWidth(undefined);
        self.modelWidth.observable(undefined);
        self.originalModelHeight(undefined);
        self.modelHeight.observable(undefined);
        self.originalModelDepth(undefined);
        self.modelDepth.observable(undefined);
        self.originalModelSeatHeight(undefined);
        self.modelSeatHeight.observable(undefined);
        self.originalModelSeatCount(undefined);
        self.modelSeatCount.observable(undefined);
        self.originalModelSeatCushionCount(undefined);
        self.modelSeatCushionCount.observable(undefined);
        self.originalModelBackCushionCount(undefined);
        self.modelBackCushionCount.observable(undefined);
        self.modelInterline.observable(false);
        self.modelButton.observable(false);
        self.modelTrim.observable(false);
        self.modelPermitAdditionalCover.observable(false);
        self.modelStitching.observable(false);
        self.modelLeatherAvailable.observable(false);
        self.modelLegsRemovable.observable(false);
        self.modelWoodenArms.observable(false);
        self.modelDiscontinued.observable(false);
        self.modelLegNotes.observable(undefined);
        self.modelComments.observable(undefined);
        self.modelImageId(undefined);
        self.designSeatCushionFillingIds([]);
        self.designBackCushionFillingIds([]);
        //self.designCoverTypeIds([]);
        self.designLegTypeIds([]);
        self.designPermitMixedFabric.observable(false);
        self.designFabricRestrictions([]);
        self.designStitchColourRestrictions([]);
        self.recommendedStitchRecord(undefined);
    }

    self.toJS = function () {
        return self.suppliers().map(function (s) {
            return s.toJS();
        });
    }

    self.saveBreakdown = function () {
        self.busy(true);
        self.busyMessage('Saving Material Breakdown Info...');

        var merge = Enumerable.From(self.toJS()).SelectMany(function (s) {
            return Enumerable.From(s.Components).SelectMany(function (c) {
                return Enumerable.From(c.MaterialGroups).Select(function (mg) {
                    return mg
                }).ToArray();
            }).ToArray();
        }).ToArray();

        var designSupplierCoverTypes = Enumerable.From(self.toJS()).SelectMany(function (s) {
            return Enumerable.From(s.DesignCoverTypes).Select(function (dct) {
                return {
                    CoverTypeID: dct,
                    SupplierID: s.SupplierID
                }
            }).ToArray();
        }).ToArray();

        var data = {
            modelId: self.modelDetails().ModelID,
            designId: self.modelDetails().DesignID,
            width: self.modelWidth.observable(),
            height: self.modelHeight.observable(),
            depth: self.modelDepth.observable(),
            seatHeight: self.modelSeatHeight.observable(),
            seatDepth: self.modelSeatDepth.observable(),
            seatCount: self.modelSeatCount.observable(),
            seatCushionCount: self.modelSeatCushionCount.observable(),
            backCushionCount: self.modelBackCushionCount.observable(),
            interline: self.modelInterline.observable(),
            button: self.modelButton.observable(),
            trim: self.modelTrim.observable(),
            permitAdditionalCover: self.modelPermitAdditionalCover.observable(),
            stitching: self.modelStitching.observable(),
            leatherAvailable: self.modelLeatherAvailable.observable() || false,
            legsRemovable: self.modelLegsRemovable.observable(),
            discontinued: self.modelDiscontinued.observable(),
            legNotes: self.modelLegNotes.observable(),
            comments: self.modelComments.observable(),
            woodenArms: self.modelWoodenArms.observable(),
            designSupplierCoverTypeIds: designSupplierCoverTypes,
            designSeatCushionFillingIds: Enumerable.From(self.designSeatCushionFillingIds()).Select(function (x) {
                return {
                    cushionFillingId: x
                }
            }).ToArray(),
            designBackCushionFillingIds: Enumerable.From(self.designBackCushionFillingIds()).Select(function (x) {
                return {
                    cushionFillingId: x
                }
            }).ToArray(),
            designLegTypeIds: Enumerable.From(self.designLegTypeIds()).Select(function (x) {
                return {
                    legTypeId: x
                }
            }).ToArray(),
            designPermitMixedFabric: self.designPermitMixedFabric.observable(),
            designFabricRestrictions: Enumerable.From(self.designFabricRestrictions()).Select(function (x) {
                return {
                    productId: x.ProductID
                }
            }).ToArray(),
            designStitchColourRestrictions: self.designStitchColourRestrictions(),
            imageId: self.modelImageId(),
            records: merge
        };

        console.log('calling saveBreakdown with', data);

        $.ajax({
            url: '/api/furnitureApi/SaveFurnitureMaterialBreakdown',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                self.busy(false);
                console.log('saveBreakdown returned', data);
                self.showMergeSaved(true);

                ko.utils.arrayForEach(self.suppliers(), function (s) {
                    ko.utils.arrayForEach(s.components(), function (c) {
                        ko.utils.arrayForEach(c.materialGroups(), function (mg) {
                            if (mg.quantity.observable()) {
                                mg.originalQuantity(+mg.quantity.observable());
                            } else {
                                mg.originalQuantity(undefined);
                            }
                        });
                    })
                });

                //self.modelParams.dropDownListSettings.virtual.valueMapper({
                //    value: self.modelDetails().ModelID,
                //    success: function () {
                //        //self.modelDetails(undefined);
                //    }
                //});

                // necessary because otherwise the previous state of the current model
                // being edited is still there on the dropdown list.
                self.modelParams.dropDownListSettings.widget().dataSource.read();

                window.setTimeout(function () {
                    self.showMergeSaved(false);
                }, 5000);
            },
            error: function (xhr, s, a) {
                self.busy(false);
                $.showError(xhr, s, a);
            }
        });
    }

    //#endregion
}

function supplier ({
    record
} = {}) {
    var self = $.extend(record, {});

    self.components = ko.observableArray(getComponents().map(function (c) {
        return component({
            record: $.extend(c, {
                SupplierID: self.SupplierID
            })
        });
    }));

    self.coverTypes = ko.observableArray(getCoverTypes());

    self.designCoverTypeIds = ko.observableArray([]);
    self.designCoverTypes = ko.observableArray([]);

    self.designCoverTypesParams = {
        observable: self.designCoverTypes,
        validate: self.designCoverTypeIds,
        showClear: true,
        width: 'auto',
        label: 'Cover Types',
        valuePrimitive: false,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        controlClass: 'form-control',
        multiSelectSettings: {
            value: self.designCoverTypeIds,
            dataItems: self.designCoverTypes,
            dataValueField: 'CoverTypeID',
            dataTextField: 'Name',
            height: 300,
            widget: ko.observable(),
            open: function (e) {
                var self = this;
                $(e.sender._widgetOptions.dataItems.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            close: function (e) {
                $(e.sender._widgetOptions.dataItems.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            data: self.coverTypes,
            valuePrimitive: true,
            autoWidth: false,
            autoBind: true,
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
    };

    self.nudge = function () {
        window.setTimeout(function () {
            ko.utils.arrayForEach(self.components(), function (c) {
                ko.utils.arrayForEach(c.materialGroups(), function (mg) {
                    mg.disabled.notifySubscribers(mg.disabled());
                });
            });
        }, 0);
    }

    self.toJS = function () {
        return {
            SupplierID: self.SupplierID,
            DesignCoverTypes: self.designCoverTypeIds(),
            Components: Enumerable.From(self.components()).Where(function (x) {
                return  x.componentInvolvedInSelectedModel() &&
                        Enumerable.From(x.materialGroups()).Where(function (y) {
                            return y.quantity.observable() != null;
                        }).Any();
            }).Select(function (x) {
                return x.toJS();
            }).ToArray()
        }
    }

    return self;
};

function component ({
    record
} = {}) {
    var self = $.extend(record, {});

    // this wants setting based on modelDetails
    self.componentInvolvedInSelectedModel = ko.observable();

    self.componentInvolvedInSelectedModelParams = {
        checkboxId: 'component-involved-' + self.SupplierID + '-' + self.ComponentID,
        label: self.Name,
        observable: self.componentInvolvedInSelectedModel,
        useNativeValidation: false,
        disabled: false
    };

    self.componentInvolvedInSelectedModel.subscribe(function (newValue) {
        ko.utils.arrayForEach(self.materialGroups(), function (mg) {
            if (mg.MaterialGroupID == 1 && newValue)
                mg.disabled(false);
            else
                mg.disabled(true);
            mg.quantity.observable(undefined);
        });
    });

    self.materialGroups = ko.observableArray(getMaterialGroups().map(function (mg) {
        return materialGroup({
            record: $.extend(mg, {
                SupplierID: self.SupplierID,
                ComponentID: self.ComponentID
            })
        });
    }));

    self.toJS = function () {
        return {
            ComponentID: self.ComponentID,
            MaterialGroups: Enumerable.From(self.materialGroups()).Where(function (x) {
                return x.quantity.observable() != null
            }).Select(function (x) {
                return x.toJS()
            }).ToArray()
        }
    }

    return self;
};


function materialGroup ({
    record
} = {}) {

    var self = $.extend(record, {});

    self.disabled = ko.observable(undefined);

    self.originalQuantity = ko.observable();
    
    self.quantity = {
        label: 'Length (m)',
        observable: ko.observable().extend({
            numberFormatted: {
                digits: 2,
                currency: {
                    FormattingCulture: 'en-GB'
                },
                skipExtraNotify: true
            },
            min: {
                params: 0.5,
                message: ' '
            },
            max: {
                params: 9999,
                message: ' '
            }
        }),
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: true,
        showClear: false,
        disabled: self.disabled,
        permitRevert: self.MaterialGroupID == 1 ? true : false,
        originalValue: self.originalQuantity,
        revertFunction: self.MaterialGroupID == 1 ? function() {
            var self = this;
            self.observable(ko.unwrap(self.originalValue));
        } : null
    }

    //self.quantitySubscription = null;

    self.quantity.observable.subscribe(function (newValue) {
        //console.log('Quantity subscribe hit', newValue);
    });

    //self.watchingQuantity.subscribe(function (newValue) {
    //    if (newValue) {
    //        console.log('Creating Quantity Subscription');
    //        self.quantitySubscription = self.quantity.observable.subscribe(function (newValue) {
    //            console.log('Quantity subscribe hit', newValue, self);
    //        });
    //    } else {
    //        if (self.quantitySubscription.hasOwnProperty('dispose'))
    //            if (typeof self.quantitySubscription.dispose === 'function')
    //                self.quantitySubscription.dispose();
    //    }
    //});

    self.toJS = function () {
        return {
            SupplierID: self.SupplierID,
            ComponentID: self.ComponentID,
            MaterialGroupID: self.MaterialGroupID,
            Quantity: self.quantity.observable()
        }
    }

    return self;
};

function fabricRestriction ({
    record
} = {}) {

    var self = $.extend(record, {});

    self.stitchColourId = ko.observable(self.StitchColourID);

    self.stitchColour = ko.observable(self.StitchColour);

    self.toJS = function () {
        return {
            ProductID: self.ProductID
        }
    }

    return self;
 };


function stitchColourRestriction ({
    record
} = {}) {

    var self = $.extend(record, {});

    self.toJS = function () {
        return {
            StitchColourID: self.StitchColourID
        }
    }

    return self;
}

function stitchColourAutocompleter({
    observable,
    results,
    additionalParams,
    label
} = {
    observable: ko.observable(),
    results: ko.observableArray([]),
    additionalParams: {},
    label: 'Search for Stitch Colour by ID or Name'
}) {
    var self = {};

    self.observable = observable;
    self.results = results;
    self.label = label;
    self.additionalParams = additionalParams;

    self.autocompleter = {
        label: self.label,
        observable: self.observable,
        results: self.results,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        additionalParams: self.additionalParams,
        clearFunction: function () {
            //self.designStitchColourSearch(undefined);
            //self.designStitchColourRestrictionAutocomplete.observable(undefined);
            //self.designStitchColourRestrictionAutocompleteResults([]);
            //$(self.designStitchColourRestrictionAutocomplete.observable.DOMElement).focus();
            self.observable(undefined);
            self.results([]);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        },
        autocompleteSettings: {
            value: observable,
            appendTo: 'body',
            source: function (request, response) {
                var data = $.extend(self.additionalParams, {
                    searchTerm: request.term
                });
                $.ajax({
                    url: '/api/furnitureApi/DesignStitchColourRestrictionSearch',
                    type: "POST",
                    dataType: "json",
                    data: data,
                    success: function (data) {
                        console.log('designStitchColourRestrictionAutocomplete returned', data);
                        self.results([]);
                        ko.utils.arrayForEach(data, function (d) {
                            self.results.push(stitchColourRestriction({
                                record: d
                            }));
                        });
                        response();
                    }
                });
            },
            minLength: 0,
            select: function (event, ui) {
                event.preventDefault();
            }
        },
        enterKeyFunction: function () {
            $(self.observable.DOMElement).autocomplete('search');
        }
    };

    return self;
}