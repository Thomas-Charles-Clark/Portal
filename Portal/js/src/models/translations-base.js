var translationBaseViewModel = function () {
    var self = this;

    //#region Properties

    self.busy = ko.observable(false);

    //#endregion

    //#region Computeds


    //#endregion

    //#region Components

    self.languageId = ko.observable();

    self.languageDropDownList = kendoMDCDropDownList({
        label: 'Target Language',
        odata: true,
        endPoint: '/odata/Languages/GetExcept(exceptLanguageId=1)',
        textField: 'Name',
        valueField: 'LanguageID',
        idObservable: self.languageId,
        height: 300,
        permitRevert: true
    });

    self.languageId.subscribe(function (newValue) {
        if (newValue) {
            self.resourceGridSettings.widget().dataSource.filter({
                field: 'LanguageID',
                operator: 'eq',
                value: newValue
            });
        } else {
            self.resourceGridSettings.widget().dataSource.filter({});
        }
    });

    self.resourceNameEditor = function (container, options) {
        $('<input data-bind="value: ' + options.field + '" maxlength="255"/>').appendTo(container);
    }

    self.resourceEditor = function (container, options) {
        $('<textarea data-bind="value: ' + options.field + '" rows="4" maxlength="4000"></textarea>').appendTo(container);
    }

    self.translationEditor = function (container, options) {
        $('<textarea data-bind="value: ' + options.field + '" rows="4" maxlength="4000"></textarea>').appendTo(container);
    }

    self.resourceGridSettings = {
        autoBind: true,
        widget: ko.observable(),
        columns: [{
            field: 'ResourceID',
            title: 'ID',
            width: 60,
            attributes: {
                'class': 'text-right'
            }
        }, {
            field: 'Resource.Name',
            title: 'Resource',
            template: '#= Resource  ? Resource.Name : ""#',
            readOnly: false
        }, {
            field: 'Resource.Value',
            title: 'Resource',
            template: '#= Resource  ? Resource.Value : ""#',
            readOnly: true
        }, {
            field: 'Language',
            title: 'Language',
            template: '#= Language ? Language.Name : ""#'
        }, {
            field: 'Translation',
            title: 'Translation',
            template: '#= Translation == null ? "<i>NULL</i>" : Translation #',
            editor: self.translationEditor,
            type: 'string',
            nullable: true
        }],
        editable: true,
        toolbar: ["create", "save", "cancel"],
        save: function (e) {

        },
        edit: function (e) {
            if (e.model.isNew()) {
                if (e.sender.options.editable != 'inline') {
                    var currentOptions = e.sender.getOptions();
                    currentOptions.editable = 'inline';
                    currentOptions.dataSource.schema.model.fields.Translation.editable = false;
                    e.sender.setOptions(currentOptions);
                    e.sender.one('dataBound', function (x) {
                        window.setTimeout(function () {
                            e.sender.addRow();
                            e.sender.one('dataBound', function (y) {
                                window.setTimeout(function () {
                                    var currentOptions = e.sender.getOptions();
                                    currentOptions.editable = 'incell';
                                    currentOptions.dataSource.schema.model.fields.Translation.editable = true;
                                    e.sender.setOptions(currentOptions);
                                }, 0);
                            });
                        }, 0);
                    });
                }
            }
        },
        cancel: function (e) {
            if (e.sender.options.editable == 'inline') {
                e.sender.setOptions({ editable: 'incell' });
            }
        },
        data: new kendo.data.DataSource({
            type: 'odata-v4',
            transport: {
                read: {
                    url: function () {
                        return '/odata/Resource_Languages'
                    },
                },
                update: {
                    url: function (data) {
                        return '/odata/Resource_Languages(resourceId=' + data.ResourceID + ',languageId=' + data.LanguageID + ')'
                    }
                },
                batch: {
                    url: function () {
                        return "/odata/$batch";
                    }
                },
                create: {
                    url: function (dataItem) {
                        delete dataItem.ResourceID;
                        delete dataItem.LanguageID;
                        return '/odata/Resource_Languages';
                    }
                },
                destroy: {
                    url: function (data) {
                        return '/odata/Resource_Languages(resourceId=' + data.ResourceID + ',languageId=' + data.LanguageID + ')'
                    }
                },
                parameterMap: function (data, type) {
                    var result = kendo.data.transports["odata-v4"].parameterMap(data, type);

                    if (type === "update") {
                        if (data.Value == "")
                            data.Value = null;
                        console.log('updating', data);
                        self.resourceGridSettings.widget().one("dataBound", function (e) {
                            self.resourceGridSettings.widget().dataSource.read();
                        });
                    }

                    //if (result.$filter) {
                    //    result.$filter = result.$filter.replace('datetime', 'datetimeoffset');
                    //}


                    return result;
                }
            },
            pageSize: 20,
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            autoSync: false,
            schema: {
                errors: 'error',
                model: {
                    id: 'ResourceID',
                    fields: {
                        ResourceID: {
                            type: 'number',
                            editable: false
                        },
                        Resource: {
                            type: 'object',
                            editable: true,
                            validation: {
                                required: true,
                                nullable: false
                            },
                            defaultValue: {
                                ResourceID: 0,
                                Name: '',
                                Value: ''
                            }
                        },
                        //Resource: {
                        //    type: 'object',
                        //    validation: {
                        //        required: true
                        //    },
                        //    editable: false
                        //},
                        Language: {
                            type: 'object',
                            validation: {
                                required: true
                            },
                            defaultValue: null,
                            editable: false
                        },
                        LanguageID: {
                            type: 'number',
                            editable: false
                        },
                        Translation: {
                            from: 'Value',
                            type: 'string',
                            editable: true,
                            validation: {
                                nullable: true
                            },
                            defaultValue: null
                        }
                    }
                }
            },
            //requestEnd: function (e) {
            //    if (e.type == "create") {
            //        // Make a read request to expand Category. By default the OData controller doesn't expand on create.
            //        this.read();
            //        // is this necessary?
            //    }
            //},
            error: function (e) {
                $.showError(e.xhr, e.errorThrown, e.status);
            }
        }),
        sortable: true,
        filterable: {
            extra: false,
            operators: {
                string: {
                    contains: "Contains",
                    eq: "Equal to",
                    neq: "Not equal to"
                }
            }
        },
        reorderable: true,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 200]
        }
    };

    //#endregion

    //#region Subscriptions


    //#endregion

    //#region Validation Groups

    self.errors = ko.validation.group([

    ]);

    //#endregion

    //#region Functions

    self.reset = function () {
        console.log('translationBaseViewModel reset called', self);
        self.errors.showAllMessages(false);
        self.busy(false);
    }

    //#endregion

    //#region Events


    //#endregion
}