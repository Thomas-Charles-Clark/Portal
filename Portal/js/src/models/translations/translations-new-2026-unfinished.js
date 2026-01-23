const translationsViewModel = ({

} = {}) => {
    var self = {};

    //#region Properties

    self.ready = ko.observable(false);

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable('Please wait');

    self.unsavedChanges = ko.observable(false);

    self.data = ko.observableArray([]);

    self.dashboardPods = ko.observableArray(window.getDashboardPods().map(d => translationsDashboardPodViewModel({
        rec: d
    })));

    self.selectedPod = ko.observable(self.dashboardPods().length == 1 ? self.dashboardPods()[0] : undefined);

    self.clearSelectedPod = () => {
        self.selectedPod(undefined);
        self.refresh();
    }

    self.testParams = {
        observable: ko.observable(false),
        checkboxId: `test-checkbox`,
        useNativeValidation: false,
        disable: ko.observable(false),
        enable: ko.observable(true),
        busy: ko.observable(false)
    }

    //#endregion

    //#region Lifted methods

    self.preventDashboardAnchorTagClickPropagation = () => {
        document.querySelectorAll('.dashboard-pod a').forEach(a => {
            a.addEventListener('click', (e) => {
                e.stopPropagation();
            })
        });
    }

    self.refreshDashboard = () => {
        fetch('/api/translateResources/refreshDashboard', {
            method: 'POST',
            headers: window.fetchHeaders,
            cache: 'no-cache',
            credentials: 'same-origin',
            body: JSON.stringify({
                languageId: self.languageId()
            })
        })
            .then(window.handleFetchResponse)
            .then(data => {
                self.dashboardPods(data);
                if (self.selectedPod()) {
                    self.selectedPod(self.dashboardPods().find(dp => dp.LanguageID == self.selectedPod().LanguageID));
                }
                //window.setTimeout(() => {
                //    self.preventDashboardAnchorTagClickPropagation();
                //}, 0);
            })
            .catch(window.catchFetchError)
    }

    //#endregion

    //#region Computeds

    self.dirty = ko.computed(() => {
        let dirt = [];
        let records = self.data();
        records.forEach(r => {
            dirt.push(r.dirty());
        });
        if (dirt.find(r => r === true)) {
            self.unsavedChanges(true);
        } else {
            self.unsavedChanges(false);
        }
    }, self);

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
            if (self.selectedPod()) {
                self.resourceGridSettings.widget().dataSource.query({
                    page: 1,
                    pageSize: self.resourceGridSettings.widget().dataSource.pageSize(),
                    filter: {
                        operator: 'and',
                        filters: [{
                            field: 'LanguageID',
                            operator: 'eq',
                            value: newValue
                        }, {
                            field: 'ApprovedByHuman',
                            operator: 'eq',
                            value: false
                        }]
                    }
                });
                self.resourceGridSettings.widget().setOptions({
                    columns: self.resourceGridColumns(newValue)
                });
            } else {
                self.resourceGridSettings.widget().dataSource.query({
                    page: 1,
                    pageSize: self.resourceGridSettings.widget().dataSource.pageSize(),
                    filter: {
                        field: 'LanguageID',
                        operator: 'eq',
                        value: newValue
                    }
                });
                self.resourceGridSettings.widget().setOptions({
                    columns: self.resourceGridColumns(null)
                });
            }
        }
    });

    self.translationEditor = function (container, options) {
        $(`<div class="grow-wrap" data-replicated-value="${dataItem.Translation}"><textarea data-bind="value: Translation" maxlength="4000" onInput="this.parentNode.dataset.replicatedValue = this.value"></textarea></div>`).appendTo($(`tr[data-uid="${dataItem.uid}"] td:nth-of-type(3)`));
    }

    self.checkboxTemplate = function (dataItem) {

        window.setTimeout(() => {
            var mdcCheckbox = new mdc.checkbox.MDCCheckbox(document.querySelector(`#resource-${dataItem.ResourceID}-checkbox-wrapper`));
        }, 100);

        return $(`<div class="mdc-form-field">
            <div id="resource-${dataItem.ResourceID}-checkbox-wrapper" class="mdc-checkbox">
                <input class="mdc-checkbox__native-control" data-role="checkbox" class="mdc-checkbox__native-control" name="MemberID" checked="${dataItem.ApprovedByHuman ? 'checked' : ''}" />
                <div class="mdc-checkbox__background">
				    <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
					    <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
				    </svg>
				    <div class="mdc-checkbox__mixedmark"></div>
			    </div>
			    <div class="mdc-checkbox__ripple"></div>
            </div>
        </div>`).html();

    }

    self.checkboxEditor = (container, options) => {
        $(`<div class="mdc-form-field">
                <div id="resource-${options.model.ResourceID}-checkbox-wrapper" class="mdc-checkbox">
                    <input class="mdc-checkbox__native-control" data-role="checkbox" class="mdc-checkbox__native-control" name="MemberID" checked="${options.model.ApprovedByHuman ? 'checked' : ''}" />
                    <div class="mdc-checkbox__background">
				        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
					        <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
				        </svg>
				        <div class="mdc-checkbox__mixedmark"></div>
			        </div>
			        <div class="mdc-checkbox__ripple"></div>
                </div>
            </div>`).appendTo(container);
        window.setTimeout(() => {
            var mdcCheckbox = new mdc.checkbox.MDCCheckbox(document.querySelector(`#resource-${options.model.ResourceID}-checkbox-wrapper`));
        }, 1);
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
            template: (e) => {
                if (e.Resource) {
                    return e.Resource.Value ?? '';
                } else {
                    return '';
                }
            },
            editable: () => false,
            sortable: language != null,
            filterable: language != null
        }, {
            field: 'Translation',
            title: (() => { return language ? language.Name : 'Translation' })(),
            template: (e) => {
                if (e.Translation) {
                    return e.Translation;
                } else {
                    return '';
                }
            },
            editor: (container, options) => {

            },
            nullable: true,
            sortable: language != null,
            filterable: language != null
        }, {
            field: 'ApprovedByHuman',
            title: ' ',
            width: 56,
            editor: self.checkboxEditor,
            template: self.checkboxTemplate,
            headerAttributes: {
                'class': 'approved-filter'
            },
            attributes: {
                'class': 'text-center valign-middle',
                'title': '#= ModifiedBy ? ModifiedBy.FullName + ": " + moment(ModifiedDT).format("DD/MM/YYYY HH:mm") : "AI Translated" + (ModifiedDT ? ": " + moment(ModifiedDT).format("DD/MM/YYYY HH:mm") : "") #'
            },
            editable: () => language == null ? false : true,
            sortable: true,
            filterable: language == null ? false : {
                extra: false,
                messages: {
                    isTrue: '✔: Approved',
                    isFalse: '✖: Not Yet Approved'
                }
            }
        }]
    };

    //self.readRequestBarrier = false; 

    self.resourceGridSettings = {
        autoBind: false,
        widget: ko.observable(),
        columns: self.resourceGridColumns(null),
        //useKOTemplates: true,
        //rowTemplate: 'translation-row-template',
        editable: "incell",
        toolbar: window.getToolbarOptions(), // "create"
        edit: function (e) {
            console.log('edit', e);
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
            self.data().filter(d => d.dirty()).forEach(d => {
                d.translation(d.originalTranslation);
                d.approval(d.originalApproval);
            })
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
                        return '/odata/Resource_Languages(resourceId=' + data.resourceId + ',languageId=' + data.languageId + ')?$expand=Resource,ModifiedBy'
                    }
                },
                parameterMap: function (data, type) {

                    var result = kendo.data.transports["odata-v4"].parameterMap(data, type);

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
                            editable: false,
                            fields: {
                                Value: { type: 'string', editable: false }
                            }
                        },
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
                        MemberID: {
                            type: 'boolean',
                            editable: null,
                            defaultValue: null
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
                        },
                        ApprovedByHuman: {
                            type: 'boolean'
                        }
                    }
                }
            },
            requestStart: function (e) {
                console.log('requestStart', e);

                //if (e.type == "read") {

                //    if (self.readRequestBarrier) {
                //        self.readRequestBarrier = false;
                //        return;
                //    }

                //    e.preventDefault();

                //    var queryOptions = {
                //        aggregate: e.sender.aggregate(),
                //        group: e.sender.group(),
                //        sort: e.sender.sort(),
                //        filter: e.sender.filter(),
                //        page: e.sender.page(),
                //        pageSize: e.sender.pageSize(),
                //    };

                //    if (self.selectedPod()) {
                //        if (queryOptions.filter.filters) {
                            
                //        }
                //        queryOptions.filter.filters.push({
                //            logic: 'or',
                //            filters: [{
                //                field: 'MemberID',
                //                operator: 'eq',
                //                value: null
                //            }, {
                //                field: 'MemberID',
                //                operator: 'eq',
                //                value: 0
                //            }]
                //        })
                //    }

                //    self.readRequestBarrier = true;

                //    e.sender.query(queryOptions);

                //}

                self.busy(true);
            },
            requestEnd: (e) => {
                console.log('requestEnd', e);

                //if (Object.hasOwn(e, 'response') && typeof e.response != 'undefined') {
                //    self.data(e.response.value.map(r => translationRecord({
                //        record: r
                //    })));

                //    e.response.value = self.data();
                //}
                self.busy(false);
                self.unsavedChanges(false);
            },
            filter: (() => {
                let languageId = self.languageId();
                let prefilter = window.getApproval();

                var filter = {
                    operator: 'and',
                    filters: []
                };

                if (languageId) {
                    filter.filters.push({
                        field: 'LanguageID',
                        operator: 'eq',
                        value: languageId
                    });
                }

                if (prefilter != null) {
                    filter.filters.push({
                        field: 'ApprovedByHuman',
                        operator: 'eq',
                        value: prefilter
                    })
                }
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
        },
        filterMenuInit: (e) => {
            if (e.field === "ApprovedByHuman") {
                // Find and replace specific elements in the filter menu
                e.container[0].setAttribute('title', 'Filter for Approval Status');
                e.container.find(".k-filter-help-text").text("Approval Status:");
            }
        },
        dataBinding: (e) => {
            console.log('dataBinding', e);
        },
        dataBound: (e) => {
            console.log('dataBound', e);

            //e.sender.dataSource.data().forEach(dataItem => {
            //    let item = self.data().find(da => da.ResourceID == dataItem.ResourceID);
            //    item.dataItem = dataItem;
            //});

            if (self.ready()) {
                self.refreshDashboard();
            }
        },
        saveChanges: (e) => {
            console.log('saveChanges', e);

            let models = self.data();

            let data = e.sender.dataSource.data();

            models.forEach(tr => {
                let dataItem = data.find(d => d.ResourceID == tr.ResourceID);

                if (tr.translation() == '') {
                    tr.translation(null);
                }

                if (tr.dirty()) {
                    dataItem.dirty = true;
                    dataItem.set('Approval', tr.approval());
                    dataItem.set('Translation', tr.translation());
                }
            });
        },
    };

    //#endregion

    //#region Subscriptions

    self.language.subscribe(nv => {
        //self.resourceGridSettings.widget().setOptions({
        //    columns: self.resourceGridColumns(nv)
        //});
    });

    self.unsavedChanges.subscribe(nv => {
        if (nv) {
            window.addEventListener('beforeunload', window.onBeforeUnloadPreventDefault);
        } else {
            window.removeEventListener('beforeunload', window.onBeforeUnloadPreventDefault);
        }
    });

    //self.ready.subscribe(() => {
    //    self.preventDashboardAnchorTagClickPropagation();
    //});

    //#endregion

    //#region Validation Groups

    self.errors = ko.validation.group([

    ]);

    //#endregion

    //#region Functions

    self.reset = function () {
        console.log('translationsViewModel reset called', self);
        self.errors.showAllMessages(false);
        self.busy(false);
    }

    self.dashboardClick = (data, event) => {
        console.log('dashboardClick', data);

        if (self.selectedPod() == null || (self.selectedPod().LanguageID != data.LanguageID)) {

            self.selectedPod(data);

            self.languageId(data.LanguageID);

        } else {

            self.selectedPod(undefined);

            self.languageId(null);

            self.resourceGridSettings.widget().dataSource.query({
                page: 1,
                pageSize: self.resourceGridSettings.widget().dataSource.pageSize(),
                filter: {
                    operator: 'and',
                    filters: [{
                        field: 'LanguageID',
                        operator: 'eq',
                        value: -1
                    }]
                }
            });
        }

    };

    //#endregion

    //#region Events


    //#endregion

    return self;
}

const translationRecord = ({
    record
} = {
    record: {}
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
            self.translation('');
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
        let dtSuffix = '';
        if (self.ModifiedDT) {
            dtSuffix = ` - ${moment(self.ModifiedDT).format('DD/MM/YYYY HH:mm')}`;
        }
        if (self.ModifiedBy?.Id != null) {
            return `${self.ModifiedBy.FullName}${dtSuffix}`
        } else {
            return `Google Neural Machine Translation (NMT)${dtSuffix}`
        }
    });

    //#endregion

    //#region Subscriptions

    //self.approval.subscribe(nv => {
    //    //window.setTimeout(() => {
    //    //    document.getElementById(`resource-id-${self.ResourceID}-approval`).blur();
    //    //}, 0);
    //});

    //self.dirty.subscribe(nv => {
    //    let item = self.dataItem;

    //    if (self.originalTranslation != self.translation()) {
    //        item.set('Translation', self.translation());
    //    } else {
    //        item.set('Translation', self.originalTranslation);
    //    }

    //    if (self.approval()) {
    //        item.set('MemberID', getUserId());
    //    } else {
    //        item.set('MemberID', undefined);
    //    }
    //});

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

        console.log('translatorCellClick', data, event);

        if (event.target.type === 'textarea')
            return;
        else if (event.target.querySelector('textarea'))
            event.target.querySelector('textarea').focus();
    }

    //#endregion

    return self;
}