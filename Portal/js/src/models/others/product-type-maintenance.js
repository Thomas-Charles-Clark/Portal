'use strict';

const productTypeMaintenanceViewModel = (() => {
    let self = {};

    //#region Properties

    self.productTypes = ko.observableArray(getProductTypes());

    self.tables = ko.observableArray(getTables());

    self.busy = ko.observable(false);

    self.validateCoreNow = ko.observable(false);

    self.validateJSONNow = ko.observable(false);

    self.productTypeId = ko.observable();

    self.productType = ko.observable();

    self.originalProductTypeName = ko.observable();

    self.productTypeName = ko.observable().extend({
        required: {
            params: true,
            onlyIf: () => {
                return self.validateCoreNow();
            }
        }
    });

    self.originalProductTypeFormJson = ko.observable();

    self.productTypeFormJson = ko.observable().extend({
        required: {
            params: true,
            onlyIf: () => {
                return self.validateJSONNow();
            }
        },
        // bogus:
        validJson: {
            params: true,
            onlyIf: () => {
                return self.validateJSONNow();
            }
        }
    });

    self.productTypeFormJsonErrors = ko.observableArray([]).extend({
        mustBeEmptyArray: {
            onlyIf: () => {
                return self.validateJSONNow();
            }
        }
    });

    self.cheatsheetPinned = ko.observable(false);

    self.exampleForm = {
        formName: "Form Name",
        layoutClass: "grid",
        displayClass: "bg-light",
        heading: "Form Heading",
        subHeading: "Form SubHeading",
        intro: "&lt;p&gt;Form Introduction&lt;/p&gt;",
        submittable: true,
        panels: []
    };

    self.examplePanel = {
        panelName: "Panel Name",
        heading: "Panel Heading",
        subHeading: "Panel SubHeading",
        intro: "&lt;p&gt;Panel Introduction&lt;/p&gt;",
        schemaName: "DatabaseSchema",
        tableName: "DatabaseTable",
        layoutClass: "g-col-6 grid",
        submittable: true,
        fields: []
    };

    self.exampleField = {
        fieldName: "FieldName",
        label: "Field Label",
        note: "Field Note",
        tooltip: "Field Tooltip",
        layoutClass: "g-col-12",
        required: true,
        disabled: false
    };

    //#endregion


    //#region Components

    self.productTypeNameParams = {
        label: 'Name',
        observable: self.productTypeName,
        busy: self.busy,
        permitRevert: true,
        originalValue: self.originalProductTypeName,
        enable: ko.observable(true),
        disable: ko.observable(false),
        revertible: true,
        revertFunction: () => {
            self.productTypeName(self.originalProductTypeName())
        },
        clearable: true,
        clearFunction: function () {
            var self = this;
            self.observable(undefined);
            $(self.observable.DOMElement).focus();
        },
        charsRemainingOptions: {
            maxLength: 50
        },
        useNativeValidation: false, // this feeds through to mdc objects and affects them
        decorateInputElement: true,
        insertValidationMessages: false
    }

    self.productTypeParams = {
        label: 'Product Type',
        observable: self.productTypeId,
        busy: self.busy,
        revertible: false,
        clearable: true,
        useNativeValidation: false, // this feeds through to mdc objects and affects them
        decorateInputElement: true,
        insertValidationMessages: false,
        controlClass: 'form-control',
        disable: ko.observable(false),
        enable: ko.observable(true),
        dropDownListSettings: {
            value: self.productTypeId,
            dataItem: self.productType,
            dataValueField: 'ProductTypeID',
            dataTextField: 'Name',
            height: 420,
            widget: ko.observable(),
            enabled: true,
            open: (e) => {
                $(self.productTypeId.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            close: (e) => {
                $(self.productTypeId.mdcSelect.root_).toggleClass('mdc-select--focused');
            },
            dataSource: new kendo.data.DataSource({
                data: self.productTypes,
                schema: $.extend({}, kendo.data.schemas.webapi, {
                    model: {
                        id: 'ProductTypeID',
                        fields: {
                            ProductTypeID: {
                                editable: false,
                                nullable: false
                            },
                            Name: {
                                type: 'string',
                                validation: {
                                    required: true,
                                    nullable: false
                                }
                            },
                            FormJSON: {
                                type: 'string',
                                validation: {
                                    required: true,
                                    nullable: false
                                }
                            },
                        }
                    }
                }),
            }),
            data: self.productTypes, //
            valuePrimitive: false,
            autoWidth: false,
            autoBind: true,
            optionLabel: ' ',
            filter: 'startswith'
        },
        clearFunction: function () {
            self.productTypeParams.dropDownListSettings.widget().value(null);
            self.productTypeId.mdcSelect.getDefaultFoundation().adapter_.closeOutline();
            self.productTypeId.mdcSelect.label_.float(false);
            self.productTypeId(null);
        }
    };

    self.productTypeFormJsonParams = {
        observable: self.productTypeFormJson,
        codeMirrorSettings: {
            theme: 'basicDark',
            json: true,
            updateListener: (event) => {
                self.productTypeFormJson(event.view.state.doc.toString());
                self.productTypeFormJsonErrors([]);
                let errors = [];
                self.productTypeFormJson.codeMirror.linterDiagnostic(self.productTypeFormJson.codeMirror.state, (e) => {
                    errors.push(e);
                });
                self.productTypeFormJsonErrors(errors);
            },
            dropListener: (event, view) => {
                window.setTimeout(() => {
                    self.reformat();
                }, 0);
            }
        }
    }

    self.coreErrors = new ko.validation.group([
        self.productTypeName
    ]);

    self.jsonErrors = new ko.validation.group([
        self.productTypeFormJson,
        self.productTypeFormJsonErrors
    ]);

    //#endregion


    //#region Subscriptions

    self.productType.subscribe(nv => {
        if (nv) {
            self.productTypeName(nv.Name);
            self.originalProductTypeName(nv.Name);
            self.productTypeFormJson(nv.EditFormJSON);
            self.originalProductTypeFormJson(nv.EditFormJSON);
            self.productTypeFormJson.codeMirror.clearTo(nv.EditFormJSON);
        } else {
            self.productTypeName(undefined);
            self.originalProductTypeName(undefined);
            self.productTypeFormJson(undefined);
            self.originalProductTypeFormJson(undefined);
            self.productTypeFormJson.codeMirror.clearTo(undefined);
        }
    });

    //#endregion


    //#region Computeds

    self.cheatsheetPinClass = ko.computed(() => self.cheatsheetPinned() ? 'pinned' : '', self);

    self.cheatsheetPinIconClass = ko.computed(() => self.cheatsheetPinned() ? 'fa-lock' : 'fa-lock-open', self);

    self.cheatsheetChevronIconClass = ko.computed(() => self.cheatsheetPinned() ? 'fa-chevron-right ' : 'fa-chevron-left', self);

    //#endregion


    //#region Methods

    self.reformat = () => {
        let cm = self.productTypeFormJson.codeMirror;
        let obj = JSON.parse(cm.state.doc.toString());
        cm.dispatch({
            changes: {
                from: 0,
                to: cm.state.doc.length,
                insert: JSON.stringify(obj, null, '\t')
            }
        });
    }

    self.dragStart = (data, event) => {
        console.trace(data, event);
        let json = self.buildFieldJson(data)
        event.originalEvent.dataTransfer.setData("Text", json);
        return true;
    };

    self.buildFieldJson = (data) => {
        //let definition = JSON.parse(JSON.stringify(self.exampleField));
        //definition.fieldName = data.FieldName;
        //definition.label = data.FieldLabel ?? definition.FieldLabel;
        //definition.required = !data.IsNullable;
        return '\n' + JSON.stringify({ fieldName: data.ColumnName }, null, '\t');
    }

    self.toggleCheatsheetPinning = () => {
        self.cheatsheetPinned(!self.cheatsheetPinned());
    }

    self.saveCore = () => {
        self.validateCoreNow(true);
        if (self.coreErrors().length) {
            self.coreErrors.filter(x => {
                x.isValid.notifySubscribers(x.isValid());
            });
        } else {
            self.busy(true);
            fetch('/api/productMaintenanceApi/saveProductTypeCore', {
                method: 'POST',
                headers: window.fetchHeaders,
                cache: 'no-store',
                credentials: 'same-origin',
                body: JSON.stringify({
                    productTypeId: self.productTypeId(),
                    name: self.productTypeName()
                })
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    self.validateCoreNow(false);
                    self.productTypes(data.productTypes);
                    self.busy(false);
                    window.showInfo('Success', `Core details saved successfully`, () => { });
                    console.trace(data);
                })
                .catch((err) => {
                    self.busy(false);
                    self.validateCoreNow(false);
                    window.catchFetchError(err);
                });
        }
    }

    self.saveJson = () => {
        self.validateJSONNow(true);
        if (self.jsonErrors().length) {
            self.jsonErrors.filter(x => {
                x.isValid.notifySubscribers(x.isValid());
            });
            let errors = self.productTypeFormJsonErrors().flatMap(e => `<li>${e.message}</li>`);
            let errorList = `<pre class="prettyprint lang-js prettyprinted"><ul>${errors.join('')}</ul></pre>`
            window.showInfo('Sorry', `<p>Please correct all JSON errors before saving.</p>${errorList}`, () => {

            });
        } else {
            self.busy(true);
            fetch('/api/productMaintenanceApi/saveProductTypeJson', {
                method: 'POST',
                headers: window.fetchHeaders,
                cache: 'no-store',
                credentials: 'same-origin',
                body: JSON.stringify({
                    productTypeId: self.productTypeId(),
                    json: self.productTypeFormJson()
                })
            })
                .then(window.handleFetchResponse)
                .then(data => {
                    self.validateJSONNow(false);
                    self.productTypes(data.productTypes);
                    self.busy(false);
                    window.showInfo('Success', `JSON saved successfully`, () => { });
                    console.trace(data);
                })
                .catch((err) => {
                    self.busy(false);
                    self.validateJSONNow(false);
                    window.catchFetchError(err);
                });
        }
    }

    self.ready = () => {
        self.busy(false);
    }

    //#endregion

    return self;
})