class fieldFactory {
    static createField = (data, parent) => {
        let result = fieldViewModel(data, parent);
        result.init();
        return result;
    }
}
const fieldViewModel = ((data, parent) => {

    let self = Object.assign(data, {
        parent: parent
    });

    //#region Properties

    self.templateName = null;

    let initFn = self.multiple ? ko.observableArray : ko.observable;

    if (self.multiple) {
        let f = 0;
    }

    self.value = initFn().extend({ // after binding this holds self.value.DOMElement
        required: {
            params: self.required,
            onlyIf: () => {
                return self.parent.validateNow();
            }
        }
    });

    self.focusObservable = ko.observable(false);

    self.data = JSON.parse(self.options ?? "[]");

    self.dataItem = ko.observable();

    self.dataItems = ko.observableArray([]);

    self.searchTerm = ko.observable();

    self.popperOptions = {
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, -25],
                },
            },
            //{
            //    name: 'preventOverflow',
            //    options: {

            //    }
            //}
        ],
    };

    if (self.creationForm) {
        self.creationModel = ko.observable(formFactory.createForm(JSON.parse(JSON.stringify(self.creationForm)), []));
        self.hideCreation = () => {
            document.querySelector(`#${self.fieldId}-creation-form`).removeAttribute('data-show');
            document.body.removeEventListener('click', self.creationClickHandler);
        }
        self.showCreation = () => {
            let nameContainingPanel = self.creationForm.panels.find(p => p.fields.find(f => f.fieldName === 'Name'));

            let data = [];

            if (nameContainingPanel) {
                data.push({
                    schema: nameContainingPanel.schemaName,
                    table: nameContainingPanel.tableName,
                    row: [{
                        name: self.searchTerm()
                    }]
                })
            }

            self.creationModel(formFactory.createForm(JSON.parse(JSON.stringify(self.creationForm)), data));

            if (document.querySelector(`#${self.fieldId}-creation-form`)) {
                self.params.dropDownListSettings.widget().close();
                document.querySelector(`#${self.fieldId}-creation-form`).setAttribute('data-show', '');
                if (self.popperInstance == null) {
                    self.popperInstance = Popper.createPopper(
                        document.querySelector(`#${self.fieldId}-creation-form`).parentNode,
                        document.querySelector(`#${self.fieldId}-creation-form`),
                        self.popperOptions);
                } else {
                    self.popperInstance.update();
                }

                document.querySelector(`#${self.fieldId}-creation-form`).addEventListener('click', (ev) => {
                    ev.stopPropagation();
                });

                self.creationClickHandler = (ev) => {
                    let infoModal = document.getElementById('info-modal');
                    if (ev.target != infoModal && !infoModal.contains(ev.target))
                        self.hideCreation();
                };

                window.setTimeout(() => {
                    document.body.addEventListener('click', self.creationClickHandler);
                }, 0);
            }
        }
    }

    self.originalValue = ko.observable();

    self.busy = ko.observable(false);

    self.enableOverride = ko.observable(self.enabled || true);

    self.disableOverride = ko.observable(self.disabled || false);

    self.busyMessage = ko.observable(self.busyMessage ?? 'Please Wait');

    self.params = {
        label: self.label,
        observable: self.value,
        focusObservable: self.focusObservable,
        busy: self.busy,
        permitRevert: true,
        originalValue: self.originalValue,
        revertible: true,
        revertFunction: () => {
            if (self.params.hasOwnProperty('dropDownListSettings')) {
                self.params.dropDownListSettings.widget().value(self.originalValue());
            }
            self.value(self.originalValue());
        },
        clearable: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: self.maximumCharacterLength
        },
        useNativeValidation: false, // this feeds through to mdc objects and affects them
        decorateInputElement: true,
        insertValidationMessages: false
    };

    self.params.disable = ko.computed(() => {
        let override = self.disableOverride();

        if (self.disabledUntilField && self.parent.parent.ready()) { // are we doing this dance, and is the form ready?
            let f = self.parent.parent.getField(self.disabledUntilField);
            let fieldValue = f.value();
            let operator = self.disabledUntilOperator;
            let value = self.disabledUntilValue;

            if (override) {
                return override;
            } else {
                //console.log(`${fieldValue} ${operator} ${value}`, !eval(`${fieldValue} ${operator} ${value}`));
                return !eval(`'${fieldValue}' ${operator} ${value}`); // disable this field until the value of that other field is [operator] some value
            }
        } else {
            return override;
        }
    }, self);

    if (self.clearOnDisabled) {
        self.params.disable.subscribe(nv => {
            if (nv === true) {
                self.value(null);
            }
        })
    }

    self.params.enable = ko.computed(() => {
        let override = self.enableOverride();

        if (self.enabledUntilField && self.parent.parent.ready()) { // are we doing this dance, and is the form ready?
            if (self.params.disable()) {
                return false;
            } else {
                let f = self.parent.parent.getField(self.enabledUntilField);
                let fieldValue = f.value();
                let operator = self.enabledUntilOperator;
                let value = self.enabledUntilValue;

                if (override === false) {
                    return override;
                } else {
                    //console.log(`${fieldValue} ${operator} ${value}`, !eval(`${fieldValue} ${operator} ${value}`));
                    return !eval(`'${fieldValue}' ${operator} ${value}`); // enable this field until the value of that other field is [operator] some value
                }
            }
        } else {
            return override;
        }
    });

    if (self.clearOnEnabled) {
        self.params.enable.subscribe(nv => {
            if (nv === true) {
                self.value(null);
            }
        })
    }

    //#endregion


    //#region Computeds

    self.dataSourceComputer = ko.computed(() => {
        if (self.parent.parent.ready()) {
            if (self.filterByField) {
                let f = self.parent.parent.getField(self.filterByField);
                let di = f.dataItem();
                if (di) {
                    let fieldValue = di[self.filterByOptionPropertyName];
                    let newSet = self.data.filter(d => d[self.filterByOptionPropertyName] == fieldValue);

                    // remove any incompatible values from selection
                    let selection = self.value.peek();

                    let viableSelectionValues = newSet.flatMap(ns => ns[self.optionValuePropertyName]);

                    let newSelection = selection.filter(s => viableSelectionValues.includes(s));

                    window.setTimeout(() => {
                        self.value(newSelection);
                    }, 0);

                    return newSet;
                } else {
                    let fieldValue = f.value();
                    let di = self.data.find(d => d[self.optionValuePropertyName] == fieldValue);
                    if (di) {
                        let fieldValue = di[self.filterByOptionPropertyName];
                        let newSet = self.data.filter(d => d[self.filterByOptionPropertyName] == fieldValue);

                        // remove any incompatible values from selection
                        let selection = self.value.peek();


                        let viableSelectionValues = newSet.flatMap(ns => ns[self.optionValuePropertyName]);

                        let newSelection = selection.filter(s => viableSelectionValues.includes(s));

                        window.setTimeout(() => {
                            self.value(newSelection);
                        }, 0);

                        return newSet;
                    } else {
                        return self.data;
                    }
                }
            } else {
                return self.data;
            }
        } else {
            return [];
        }
    }, self);

    self.unsavedChanges = ko.computed(() => {
        return self.value() != self.originalValue();
    }, self);

    //#endregion


    //#region Components



    //#endregion


    //#region Subscriptions

    self.busy.subscribe(nv => {

        if (nv) {
            self.disableOverride(true);
        } else {
            self.disableOverride(false);
        }
    });

    //#endregion


    //#region Validation Groups



    //#endregion


    //#region Functions

    self.buildKendoDropDownProperties = () => {
        let dataSourceParams = {
            serverFiltering: true,
            serverSorting: true,
            serverGrouping: true,
            schema: $.extend({}, kendo.data.schemas.webapi, {
                model: {
                    id: self.fieldName,
                },
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

                    //var data = {};

                    //for (var propertyName in mapped) {
                    //    data[propertyName] = mapped[propertyName];
                    //}

                    //data['FieldName'] = self.fieldName;
                    //data['ReferenceDataSet'] = self.ReferenceDataSet;

                    //$.ajax({
                    //    url: '/api/GeneralAPI/FetchDataList',
                    //    type: "GET",
                    //    data: data,
                    //    success: function (data) {
                    //        console.log('FetchDataList returned', data);
                    //        options.success(data);
                    //    },
                    //    error: function (data) {
                    //        options.error();
                    //    }
                    //});

                    var params = new URLSearchParams();

                    for (var propertyName in mapped) {
                        params.append(propertyName, mapped[propertyName]);
                    }

                    params.append('FieldName', self.fieldName);
                    params.append('ReferenceDataSet', self.ReferenceDataSet);

                    fetch('/api/GeneralAPI/FetchDataList?' + params, {
                        method: 'GET',
                        headers: window.fetchHeaders
                    })
                        .then(resp => resp.json())
                        .then(data => {
                            console.log('FetchDataList returned', data);
                            options.success(data);
                        })
                        .catch(err => window.catchFetchError(err));
                }
            }
        };
        if (self.optionGroupByPropertyName) {
            dataSourceParams.group = {
                field: self.optionGroupByPropertyName
            }
        }
        if (true) {
            dataSourceParams.requestEnd = (e) => {
                //console.log('requestEnd', e);
            }
            dataSourceParams.batch = true;
            dataSourceParams.transport.create = (options) => {
                //console.log('create', options);

                var webapi = new kendo.data.transports.webapi({ prefix: "" });
                var mapped = webapi.parameterMap(options.data);

                var params = new URLSearchParams();

                for (var propertyName in mapped) {
                    params.append(propertyName, mapped[propertyName]);
                }

                params.append('FieldName', self.fieldName);
                params.append('ReferenceDataSet', self.ReferenceDataSet);

                fetch('/api/GeneralAPI/CreateDataItem?' + params, {
                    method: 'POST',
                    headers: window.fetchHeaders
                })
                    .then(resp => resp.json())
                    .then(data => {
                        //options.success(data);
                        //console.log('CreateDataItem returned', data);
                    })
                    .catch(err => window.catchFetchError(err));
            }
        }

        let dataSource = new kendo.data.DataSource(dataSourceParams);

        Object.assign(self.params, {
            controlClass: 'form-control',
            dropDownListSettings: {
                value: self.value,
                dataItem: self.dataItem,
                dataItems: self.dataItems,
                dataValueField: self.fieldName,
                dataTextField: 'Name',
                height: 420,
                widget: ko.observable(),
                enabled: self.params.enable,
                open: function (e) {
                    $(self.value.mdcSelect.root_).toggleClass('mdc-select--focused');
                },
                close: function (e) {
                    $(self.value.mdcSelect.root_).toggleClass('mdc-select--focused');
                },
                data: dataSource,
                valuePrimitive: false,
                autoWidth: false,
                autoBind: true,
                optionLabel: ' ',
                filter: 'startswith',
                virtual: {
                    itemHeight: 34,
                    mapValueTo: 'dataItem',
                    valueMapper: (options) => {

                        var params = new URLSearchParams();

                        params.append('FieldName', self.fieldName);

                        if (Array.isArray(options.value)) {
                            options.value.forEach(v => {
                                params.append('Values', v);
                            })
                        } else {
                            params.append('Values', options.value);
                        }

                        params.append('ReferenceDataSet', self.ReferenceDataSet);

                        fetch('/api/GeneralAPI/FetchDataItems?' + params, {
                            method: 'GET',
                            headers: window.fetchHeaders
                        })
                            .then(resp => resp.json())
                            .then(data => {
                                console.log('valueMapper FetchDataItems returned', data);
                                try {
                                    if (self.multiple) {
                                        options.success(data);
                                    } else {
                                        options.success(data[0]);
                                    }
                                } catch (e) {

                                }
                            })
                            .catch(err => window.catchFetchError(err));
                    }
                }
            },
            clearFunction: function () {
                self.params.dropDownListSettings.widget().value(null);
                self.value.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
                self.value.mdcSelect.label_.float(false);
                self.value(self.multiple ? [] : null);
            }
        });
    }

    self.buildKendoMultiSelectProperties = () => {

        self.multiple = true;

        self.buildKendoDropDownProperties();

        delete self.params.dropDownListSettings.filter;

        self.params.dropDownListSettings.filtering = (e) => {

        }

        self.params.dropDownListSettings.noDataTemplate = (e) => {

            if (e.instance.hasOwnProperty('input')) {
                if (e.instance.input.val()) {
                    self.searchTerm(e.instance.input.val());
                }
            }

            window.setTimeout(() => {
                ko.applyBindings(self, document.querySelector(`#${self.fieldId}-creation-btn`))
            }, 0)

            return `<span class="d-block fs-5 mb-3">"${self.searchTerm()}" not found</span><button id="${self.fieldId}-creation-btn" class="btn btn-secondary" type="button" data-bind="click: showCreation">Create New</button>`;
        };

        self.params.dropDownListSettings.autoClose = false;
    }

    self.buildMDCAutocompleteProperties = () => {
        Object.assign(self.params, {
            enterKeyFunction: () => {
                $(self.value.DOMElement).autocomplete('search');
            },
            autocompleteSettings: {
                value: self.value,
                observable: ko.observable(),
                appendTo: 'body',
                classes: {
                    "ui-autocomplete": "busy",
                    "ui-autocomplete-loading": "busy",
                },
                mapFunction: function (i) {
                    return {
                        label: i,
                        value: i,
                        obj: i
                    }
                },
                source: function (request, response) {
                    //if (self.tradeAccount()) {
                    var data = {
                        term: request.term
                    };
                    $.ajax({
                        url: self.autocompleteEndpoint,
                        type: "POST",
                        dataType: "json",
                        data: data,
                        success: function (data) {
                            response($.map(data, function (item) {
                                return {
                                    label: item.Item2,
                                    value: item.Item1,
                                    obj: item
                                };
                            }));
                        }
                    });
                    //} else {
                    //    response([]);
                    //}
                },
                minLength: self.autocompleteMinLength,
                autoFocus: true,
                search: (ev, ui) => {
                    self.busy(true);
                },
                open: (ev, ui) => {
                    self.busy(false);
                },
                select: function (event, ui) {
                    self.busy(false);
                    event.preventDefault();
                    self.value(ui.item.value);
                    self.params.autocompleteSettings.observable(ui.item.label);

                },
                response: (ev, ui) => {
                    self.busy(false);
                },
                create: function () {
                    $(this).data("ui-autocomplete")._renderItem = function (ul, item) {
                        var li = $("<li>");
                        var div = li.append("<div class='ui-menu-item-wrapper'>" + item.label + "</div>");
                        return li.appendTo(ul);
                    };
                }
            }
        })
    }

    self.buildDatePickerOptions = () => {
        //let today = new Date();
        Object.assign(self.params, {
            displayObservable: ko.observable(),
            dateTimePickerOptions: {
                localization: {
                    locale: 'en-GB',
                    format: 'dddd Do MMM yyyy'
                },
                display: {
                    sideBySide: false,
                    components: {
                        clock: false
                    },
                    //cellSize: '4rem'
                },
                restrictions: {
                    //minDate: new Date(today.getDate() - 1),
                    disabledDates: []
                },
                allowInputToggle: true,
                useCurrent: false,
                keepInvalid: false,
                debug: false
            }
        });
    }

    self.buildDateTimePickerOptions = () => {
        //let today = new Date();
        //self.value(new Date(today.setDate(today.getDate() + 1)));
        Object.assign(self.params, {
            displayObservable: ko.observable(),
            dateTimePickerOptions: {
                localization: {
                    locale: 'en-GB',
                    format: 'dddd Do MMM yyyy HH:mm T'
                },
                display: {
                    sideBySide: true
                },
                restrictions: {
                    //minDate: undefined,
                    disabledDates: []
                },
                allowInputToggle: true,
                useCurrent: false,
                keepInvalid: false,
                debug: false
            }
        });
    }

    self.buildNumericOptions = () => {

        self.numericStep = self.numericStep ? self.numericStep : self.numericScale > 0 ? 1 / Math.pow(10, self.numericScale) : 1;

        Object.assign(self.params, {
            inputType: 'number',
            buttons: data.buttons,
            minValue: -self.numericMax,
            maxValue: self.numericMax,
            step: self.numericStep,
            increment: () => {
                let v = +self.value() || 0;

                let factor = Math.pow(10, self.numericScale);

                if (self.numericStep) {
                    self.value(Math.round((v + self.numericStep) * factor) / factor);
                } else {
                    self.value(v++);
                }
            },
            decrement: () => {
                let v = +self.value() || 0;

                let factor = Math.pow(10, self.numericScale);

                if (self.numericStep) {
                    self.value(Math.round((v - self.numericStep) * factor) / factor);
                } else {
                    self.value(v--);
                }
            }
        });
        self.value.extend({
            numberUnformatted: {
                minValue: -self.numericMax,
                maxValue: self.numericMax,
                digits: self.numericScale,
                currency: {
                    FormattingCulture: 'en-GB'
                }
            },
            numeric: {
                params: {
                    required: self.required,
                    numericMin: self.numericMin,
                    numericMax: self.numericMax
                },
                onlyIf: () => {
                    return self.parent.validateNow();
                }
            }
        });
    }

    self.buildNumericCurrencyFormattedOptions = () => {

        self.numericStep = self.numericStep ? self.numericStep : self.numericScale > 0 ? 1 / Math.pow(10, self.numericScale) : 1;

        Object.assign(self.params, {
            inputType: 'text',
            buttons: data.buttons,
            minValue: -self.numericMax,
            maxValue: self.numericMax,
            step: self.numericStep,
            increment: () => {
                let v = +self.value() || 0;

                let factor = Math.pow(10, self.numericScale);

                if (self.numericStep) {
                    self.value(Math.round((v + self.numericStep) * factor) / factor);
                } else {
                    self.value(v++);
                }
            },
            decrement: () => {
                let v = +self.value() || 0;

                let factor = Math.pow(10, self.numericScale);

                if (self.numericStep) {
                    self.value(Math.round((v - self.numericStep) * factor) / factor);
                } else {
                    self.value(v--);
                }
            }
        });
        self.value.extend({
            currencyFormatted: {
                minValue: -self.numericMax,
                maxValue: self.numericMax,
                digits: self.numericScale,
                currency: {
                    FormattingCulture: data.formattingCulture,
                    Code: data.currencyCode
                }
            },
            numeric: {
                params: {
                    required: self.required,
                    numericMin: self.numericMin,
                    numericMax: self.numericMax
                },
                onlyIf: () => {
                    return self.parent.validateNow();
                }
            }
        });
    }

    self.buildFileUploadOptions = () => {
        // so I'm thinking for this one we definitely want to permit the user to select from the Flock image library
        // via a simplified search (name, product code...? is that it?)
        // as well as allowing them to upload a image (of what file format? to a destination specified with the field?)
        Object.assign(self.params, {
            fieldId: self.fieldId,
            observable: self.value,
            validateNow: ko.observable(false),
            fileName: ko.observable(self.fileName),
            fileFullPath: ko.observable(self.fileFullPath), // || 'https://via.placeholder.com/640?text=No+Image+Specified' // 'https://picsum.photos/640'
            accept: 'jpg, .jpeg, .png, .bmp, .tga, .gif',
            destination: '\\\\vm-web2\\d$\\wwwroot\\dg\\_assets\\product-maintenance\\files\\',
            clearFile: () => {
                //self.params.fileFullPath('https://picsum.photos/640');
                self.params.fileFullPath(undefined);// 'https://via.placeholder.com/640?text=No+Image+Specified');
                self.params.observable(undefined);
            },
            upload: () => {
                self.params.validateNow(true);

                if (self.params.fileName.isValid()) {

                    self.busy(true);

                    let headers = Object.assign({}, window.fetchHeaders);

                    headers['content-type'] = 'multipart/form-data';

                    let formData = new FormData(self.params.observable.DOMElement);

                    fetch('/api/generalApi/PostFileForm', {
                        method: 'POST',
                        headers: window.headers,
                        cache: 'no-store',
                        credentials: 'same-origin',
                        body: formData
                    })
                        .then(window.handleFetchResponse)
                        .then(data => {
                            console.trace(data);
                            let success = data.Success;
                            if (success) {
                                self.value(data.Result);
                                self.params.fileFullPath(data.Result);
                                self.params.fileName.DOMElement.classList.remove('form-control-error');
                                self.params.validateNow(false);
                                self.busy(false);
                                //window.showInfo('Success', `Image uploaded successfully`);
                            } else {
                                window.showInfo('Sorry', data.ErrorMessage);
                            }
                        })
                        .catch(err => window.catchFetchError)

                } else {
                    self.params.fileName.DOMElement.classList.remove('form-control-error');
                    window.setTimeout(() => {
                        self.params.fileName.DOMElement.classList.add('form-control-error');
                    }, 0);
                }
            }
        });

        self.params.fileName.extend({
            required: {
                params: self.required,
                onlyIf: () => {
                    return self.params.validateNow();
                }
            }
        });

        self.params.fileFullPath.extend({
            required: {
                params: self.required,
                onlyIf: () => {
                    return self.parent.validateNow();
                }
            }
        });

        self.value.isValid.subscribe(nv => {
            if (self.params.fileFullPath.DOMElement) {
                self.params.fileFullPath.DOMElement.classList.remove('form-control-error');
            }
            window.setTimeout(() => {
                if (!nv) {
                    self.params.fileFullPath.DOMElement.classList.add('form-control-error');
                }
            }, 0);
        });
    }

    self.buildCheckboxParams = () => {
        Object.assign(self.params, {
            checkboxId: `${self.fieldId}-chkbx`,
            checkedValue: true
        });
    }

    self.buildImageDisplayParams = () => {
        Object.assign(self.params, {
            elementId: `${self.fieldId}-img`
        });
    }

    self.init = () => {
        switch (self.fieldTypeId) {
            case 0: // hidden-field
                self.templateName = 'hidden-field-component';
                break;
            case 1: // text field
                self.templateName = 'mdc-text-field-component';
                break;
            case 2:
                self.templateName = 'mdc-text-area-component';
                Object.assign(self.params, {
                    rows: Math.round(self.maxLength / 78),
                });
                break;
            case 3:
                self.templateName = 'mdc-select-component';
                Object.assign(self.params, {
                    options: JSON.parse(self.options),
                    optionsText: self.optionsTextPropertyName,
                    optionsValue: self.optionsValuePropertyName,
                    optionsCaption: self.optionsCaption
                });
                break;
            case 4:
                self.templateName = 'mdc-kendo-dropdown-component';
                self.buildKendoDropDownProperties();
                break;
            case 5:
                self.templateName = 'mdc-kendo-multiselect-component';
                self.buildKendoMultiSelectProperties();
                break;
            case 6:
                self.templateName = 'mdc-text-field-autocomplete-component';
                self.buildMDCAutocompleteProperties();
                break;
            case 7:
                self.templateName = 'mdc-list-component';
                break;
            case 8:
                self.templateName = 'tempus-dominus-date-picker-component';
                self.buildDatePickerOptions();
                break;
            case 9:
                self.templateName = 'file-upload-component';
                self.buildFileUploadOptions();
                break;
            case 10:
                self.templateName = 'mdc-checkbox-component';
                self.buildCheckboxParams();
                break;
            case 11:
                self.templateName = 'mdc-text-field-numeric-component';
                self.buildNumericOptions();
                break;
            case 11.1:
                self.templateName = 'mdc-text-field-numeric-component';
                self.buildNumericCurrencyFormattedOptions();
                break;
            case 12:
                self.templateName = 'tempus-dominus-date-picker-component';
                self.buildDateTimePickerOptions();
                break;
            case 13:
                self.templateName = 'image-display-component';
                self.buildImageDisplayParams();
                break;
            default:
                self.templateName = 'hidden-field-component';
                console.log('unhandled fieldTypeId', self.fieldTypeId);
                break;
        }
    }

    //#endregion


    //#region Events



    //#endregion

    return self;
});