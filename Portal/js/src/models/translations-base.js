var translationBaseViewModel = function () {
    var self = this;

    //#region Properties

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable('Please wait');

    self.unsavedChanges = ko.observable(false);

    //#endregion

    //#region Computeds


    //#endregion

    //#region Components

    self.languageId = ko.observable(getLanguageId());

    self.language = ko.observable();

    self.languageDropDownList = kendoMDCDropDownList({
        label: 'Target Language',
        odata: true,
        endPoint: '/odata/Languages/GetExcept(exceptLanguageId=1)',
        textField: 'Name',
        valueField: 'LanguageID',
        idObservable: self.languageId,
        objObservable: self.language,
        enable: ko.observable(true),
        disable: ko.observable(false),
        clearable: ko.observable(false),
        revertible: ko.observable(false),
        height: 300,
        requestStart: function (e) {
            ko.ignoreDependencies(() => {
                console.log('languageDropDownList requestStart', e);
                if (self.unsavedChanges()) {
                    e.preventDefault();
                    window.showInfo("Unsaved Changes Warning", "You have unsaved changes. Please either save or cancel them now.");
                } else {
                    self.busy(true);
                }
            })
        },
    });

    self.languageId.subscribe(function (newValue) {
        if (newValue) {
            self.resourceGridSettings.widget().dataSource.query({
                page: 1,
                pageSize: self.resourceGridSettings.widget().dataSource.pageSize(),
                filter: {
                    field: 'LanguageID',
                    operator: 'eq',
                    value: newValue
                }
            });
        }
    });

    self.translationEditor = function (container, options) {
        $(`<div class="grow-wrap" data-replicated-value="${options.model.Translation}"><textarea data-bind="value: ${options.field}" maxlength="4000" onInput="this.parentNode.dataset.replicatedValue = this.value"></textarea></div>`).appendTo(container);
    }

    self.checkboxEditor = function (container, options) {
        $(`<input type="checkbox" data-role="checkbox" class="k-checkbox k-checkbox-md k-rounded-md" checked="checked" />`).appendTo(container);
    }

    self.resourceGridColumns = (language) => {
        return [{
            field: 'ResourceID',
            title: 'ID',
            width: 60,
            template: '#= ResourceID == null ? "<i>NULL</i>" : ResourceID #',
            attributes: {
                'class': 'id-column',
                'title': '#= Resource.Name #'
            },
            sortable: language != null,
            filterable: language != null,
            nullable: true
        }, {
            field: 'Resource.Value',
            title: 'English',
            template: '#= Resource  ? Resource.Value : ""#', 
            editable: () => language == null ? true : false,
            sortable: language != null,
            filterable: language != null
        }, {
            field: 'Translation',
            title: (() => { return language ? language.Name : 'Translation' })(),
            template: '#= Translation == null translationEditor? "<i>NULL</i>" : Translation #',
            editable: () => language == null ? false : true,
            type: 'string',
            nullable: true,
            sortable: language != null,
            filterable: language != null
        }, {
            field: 'MemberID',
            title: 'Approved',
            width: 104,
            editor: self.checkboxEditor,
            template: '#= ModifiedBy ? `<i class="approval-check material-icons">check_box</i>` : `<i class="material-icons approval-check pending">check_box_outline_blank</i>` #',
            attributes: {
                'class': 'text-center valign-middle',
                'title': '#= ModifiedBy ? ModifiedBy.FullName + ": " + moment(ModifiedDT).format("DD/MM/YYYY HH:mm") : "AI Translated" + (ModifiedDT ? ": " + moment(ModifiedDT).format("DD/MM/YYYY HH:mm") : "") #'
            },
            editable: () => language == null ? false : true,
            sortable: true,
            filterable: language != null
        }]
    };

    self.resourceGridSettings = {
        autoBind: false,
        widget: ko.observable(),
        columns: self.resourceGridColumns(null),
        useKOTemplates: true,
        rowTemplate: 'translation-row-template',
        editable: "incell",
        toolbar: window.getToolbarOptions(), // "create"
        edit: function (e) {
            console.log('edit', e);
            //if (e.model.isNew()) {
            //    if (e.sender.options.editable != 'inline') {
            //        var currentOptions = e.sender.getOptions();
            //        currentOptions.editable = 'inline';
            //        currentOptions.dataSource.schema.model.fields.Translation.editable = false;
            //        e.sender.setOptions(currentOptions);
            //        e.sender.one('dataBound', function (x) {
            //            window.setTimeout(function () {
            //                e.sender.addRow();
            //                e.sender.one('dataBound', function (y) {
            //                    window.setTimeout(function () {
            //                        var currentOptions = e.sender.getOptions();
            //                        currentOptions.editable = 'incell';
            //                        currentOptions.dataSource.schema.model.fields.Translation.editable = true;
            //                        e.sender.setOptions(currentOptions);
            //                    }, 0);
            //                });
            //            }, 0);
            //        });
            //    }
            //}
        },
        page: (e) => {
            if (self.unsavedChanges()) {
                e.preventDefault();
                window.showInfo("Unsaved Changes Warning", "You have unsaved changes. Please either save or cancel them now.");
            } else {
                self.busy(true);
            }
        },
        cancel: (e) => {
            if (e.sender.options.editable == 'inline') {
                e.sender.setOptions({ editable: 'incell' });
            }
            self.unsavedChanges(false);
        },
        cellClose: (e) => {
            console.log('cellClose', e);
            if (e.model.dirty) {
                self.unsavedChanges(true);
            }
        },
        data: new kendo.data.DataSource({
            type: 'odata-v4',
            transport: {
                read: {
                    url: function () {
                        return '/odata/Resource_Languages?$expand=Resource,ModifiedBy'
                    },
                },
                update: {
                    url: function (data) {
                        return '/odata/Resource_Languages(resourceId=' + data.resourceId + ',languageId=' + data.languageId + ')?$expand=Resource,ModifiedBy'
                    },
                    data: function () { 
                        return {
                            memberId: getUserId()
                        }
                    }
                },
                batch: {
                    url: function () {
                        return "/odata/$batch?$expand=Resource,ModifiedBy";
                    }
                },
                create: {
                    url: function (dataItem) {
                        delete dataItem.resourceId;
                        delete dataItem.languageId;
                        return '/odata/Resource_Languages?$expand=Resource,ModifiedBy';
                    }
                },
                destroy: {
                    url: function (data) {
                        return '/odata/Resource_Languages(resourceId=' + data.resourceId + ',languageId=' + data.LanguageIdw + ')?$expand=Resource,ModifiedBy'
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
                        },
                        ModifiedBy: {
                            type: 'object',
                            editable: false,
                            fields: [{
                                MemberID: { type: 'number', editable: false },
                                FullName: { type: 'string', editable: false }
                            }]
                        }
                    }
                }
            },
            requestStart: function (e) {
                console.log('requestStart', e);
                self.busy(true);
            },
            requestEnd: (e) => {
                console.log('requestEnd', e);
                if (Object.hasOwn(e, 'response') && typeof e.response != 'undefined') {
                    e.response.value = e.response.value.map(r => translationRecord({
                        record: r
                    }))
                }
                self.busy(false);
                self.unsavedChanges(false);
            },
            filter: (() => {
                let languageId = self.languageId();
                let prefilter = window.getApproval();

                var filters = [];

                if (languageId) {
                    filters.push({
                        field: 'LanguageID',
                        operator: 'eq',
                        value: languageId
                    });
                }

                switch (prefilter) {
                    case true:
                    case false:
                        filters.push({
                            field: 'MemberID',
                            operator: prefilter ? 'neq' : 'eq',
                            value: 0
                        }, {
                            field: 'MemberID',
                            operator: 'isnotnull'
                        });
                        //[

                        //    {
                        //    field: 'MemberID',
                        //    operator: prefilter ? 'neq' : 'eq',
                        //    value: 0
                        //},
                        
                        //];
                    default:
                        break;
                }

                return filters;
            })(),
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
        reorderable: false,
        pageable: {
            pageSize: 20,
            pageSizes: [10, 20, 50, 100, 200]
        }
    };

    //#endregion

    //#region Subscriptions

    self.language.subscribe(nv => {
        self.resourceGridSettings.widget().setOptions({
            columns: self.resourceGridColumns(nv)
        });
    });

    self.unsavedChanges.subscribe(nv => {
        if (nv) {
            window.addEventListener('beforeunload', window.onBeforeUnloadPreventDefault);
        } else {
            window.removeEventListener('beforeunload', window.onBeforeUnloadPreventDefault);
        }
    });

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

const translationRecord = ({
    record
} = {
    record: {},
    dataItemFn: (i) => i
}) => {
    let self = Object.assign({

    }, record);

    //#region Properties

    self.element = ko.observable();

    self.approval = ko.observable(self.MemberID > 0);

    self.originalApproval = self.approval();

    self.translation = ko.observable(self.Value);

    self.originalTranslation = self.translation();

    self.dirty = ko.observable(false);

    //#endregion

    //#region Components

    self.approvalParams = {
        observable: self.approval,
        checkboxId: `resource-id-${self.ResourceID}-approval`,
        useNativeValidation: false,
        disable: ko.observable(ko.unwrap(self.approval)),
        enable: ko.observable(!ko.unwrap(self.approval)),
        busy: ko.observable(false)
    }

    self.translationParams = {
        label: 'Translation',
        originalValue: self.originalTranslation,
        observable: self.translation,
        useNativeValidation: false,
        decorateInputElement: false,
        insertValidationMessages: false,
        showClear: true,
        rows: 10,
        clearFunction: function () {
            self.body('');
            window.setTimeout(() => {
                //self.translationParams.editorParams.widget().value('');
                //self.translationParams.editorParams.widget().trigger('change');
                //self.translationParams.editorParams.widget().focus();
            }, 0);
        },
        permitRevert: true,
        revertFunction: function () {
            self.translation(self.originalTranslation);
            window.setTimeout(() => {
                //self.translationParams.editorParams.widget().value(self.originalBody());
                //self.translationParams.editorParams.widget().trigger('change');
                //self.translationParams.editorParams.widget().focus();
            }, 0);
        },
        charsRemainingOptions: {
            maxLength: 4000
        },
        enable: ko.observable(true),
        disable: ko.observable(false),
        busy: ko.observable(false),
        clearable: ko.observable(true),
        revertible: ko.observable(true),
        visible: ko.observable(true),
        editorParams: {
            value: self.translation,
            enabled: ko.observable(true),
            height: 450,
            stylesheets: [
                "/css/dist/lib/bootstrap-5.3.1/dist/css/bootstrap.css"
            ],
            tools: [
                "formatting",
                "bold",
                "italic",
                "underline",
                "justifyLeft",
                "justifyCenter",
                "justifyRight",
                "insertUnorderedList",
                "insertOrderedList",
                "indent",
                "outdent",
                "createLink",
                "unlink",
                "insertImage",
                "tableWizard",
                "createTable",
                "addColumnLeft",
                "addColumnRight",
                "addRowAbove",
                "addRowBelow",
                "deleteRow",
                "deleteColumn",
                "viewHtml"
            ]
        }
    }

    //#endregion

    //#region Computeds

    self.dirty = ko.computed(() => {
        return (self.approval() != self.originalApproval) ||
            (self.translation() != self.originalTranslation);
    })

    self.approvalTitle = ko.computed(() => {
        if (self.ModifiedBy?.MemberID != null) {
            return `${self.ModifiedBy.FullName} - ${moment(self.ModifiedDT).format('DD/MM/YYYY HH:mm')}`
        } else {
            return `Google Neural Machine Translation (NMT) - ${moment(self.ModifiedDT).format('DD/MM/YYYY HH:mm')}`
        }
    });

    //#endregion

    //#region Subscriptions

    //self.approval.subscribe(nv => {
    //    //window.setTimeout(() => {
    //    //    document.getElementById(`resource-id-${self.ResourceID}-approval`).blur();
    //    //}, 0);
    //});

    self.dirty.subscribe(nv => {

        let item = viewModel.resourceGridSettings.widget().dataItem(self.element.DOMElement);

        if (self.originalTranslation != self.translation()) {
            item.set('Translation', self.translation());
        } else {
            item.set('Translation', self.originalTranslation);
        }

        if (self.approval()) {
            item.set('MemberID', getUserId());
        } else {
            item.set('MemberID', undefined);
        }
    });

    self.toJSON = () => {
        return {
            resourceId: +self.ResourceID,
            languageId: +self.LanguageID,
            value: self.translation()
        }
    }

    //#endregion

    //#region Events

    self.translatorCellClick = (data, event) => {
        if (event.target.type === 'textarea')
            return;
        else if (event.target.querySelector('textarea'))
            event.target.querySelector('textarea').focus();
    }

    //#endregion

    return self;
}