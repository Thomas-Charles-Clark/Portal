var applicationGroupsViewModel = function () {

    var self = this;

    //#region Properties

    self.busy = ko.observable(false);

    self.busyMessage = ko.observable();

    //#endregion

    //#region Computeds


    //#endregion

    //#region Components

    self.nameEditor = function (container, options) {
        $('<input data-bind="value: ' + options.field + '" maxlength="255"/>').appendTo(container);
    }

    self.descriptionEditor = function (container, options) {
        $('<textarea data-bind="value: ' + options.field + '" rows="2" maxlength="500"></textarea>').appendTo(container);
    }

    self.colourEditor = function (container, options) {
        $('<input type="color" data-binding-target="' + options.field[0].toLowerCase() + options.field.substring(1) + '" data-bind="value: ' + options.field + '" />').appendTo(container);
    }

    self.applicationEditor = function (container, options) {
        $('<input name="' + options.field + '"/>')
            .appendTo(container)
            .kendoMultiSelect({
                autoBind: false,
                autoClose: false,
                dataTextField: "Name",
                dataValueField: "ApplicationID",
                height: 500,
                dataSource: {
                    type: "odata-v4",
                    transport: {
                        read: "/odata/Applications",
                        //dataType: "json"
                    }
                }
            });
    }

    self.gridSettings = {
        autoBind: true,
        widget: ko.observable(),
        columns: [{
            field: 'ApplicationGroupID',
            title: 'ID',
            width: 80,
            attributes: {
                'class': 'text-right'
            },
            template: '#= ApplicationGroupID ? ApplicationGroupID : "" #'
        }, {
            field: 'Name',
            title: 'Name',
            template: '#= Name #',
            editor: self.nameEditor,
        }, {
            field: 'Description',
            title: 'Description',
            template: '#= Description #',
            editor: self.descriptionEditor
        }, {
            field: 'Applications',
            title: 'Applications',
            sortable: false,
            template: function (e) {
                if (e.Applications)
                    return e.Applications.map(function (x) { return x.Name }).join('<br/>')
                else
                    return '';
            },
            editor: self.applicationEditor
        }, {
            title: 'Theme',
            columns: [{
                field: 'ButtonFadeColourTop',
                title: 'Top Colour',
                template: function (e) {
                    if (e.ButtonFadeColourTop) {
                        return '<div class="colour-preview" style="background-color: ' + e.ButtonFadeColourTop + '" data-bind="style: { \'background-color\': buttonFadeColourTop }">&nbsp;</div>';
                    } else {
                        return ''
                    }
                },
                editor: self.colourEditor,
                type: 'string',
                nullable: true,
                width: 100
            }, {
                field: 'ButtonFadeColourBottom',
                title: 'Bottom Colour',
                template: function (e) {
                    if (e.ButtonFadeColourTop) {
                        return '<div class="colour-preview" style="background-color: ' + e.ButtonFadeColourBottom + '" data-bind="style: { \'background-color\': buttonFadeColourBottom }">&nbsp;</div>';
                    } else {
                        return ''
                    }
                },
                editor: self.colourEditor,
                type: 'string',
                nullable: true,
                width: 100
            }, {
                field: 'ButtonBorderColour',
                title: 'Border Colour',
                template: function (e) {
                    if (e.ButtonFadeColourTop) {
                        return '<div class="colour-preview" style="background-color: ' + e.ButtonBorderColour + '" data-bind="style: { \'background-color\': buttonBorderColour }">&nbsp;</div>';
                    } else {
                        return ''
                    }
                },
                editor: self.colourEditor,
                type: 'string',
                nullable: true,
                width: 100
            }, {
                field: 'Preview',
                title: 'Preview',
                template: function (e) {
                    return `<style type="text/css" data-bind="html: buttonClass"></style><div class="btn btn-preview" data-bind="class: buttonClassName">Example Application Button</div>`;
                },
                editable: false
            }]
        }, {
            field: 'SortOrder',
            title: 'Sort',
            sortable: true,
            width: 75,
            attributes: {
                'class': 'text-right'
            }
        }],
        editable: true,
        toolbar: ["create", "save", "cancel"],
        save: function (e) {

        },
        edit: function (e) {
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
        cancel: function (e) {
            //if (e.sender.options.editable == 'inline') {
            //    e.sender.setOptions({ editable: 'incell' });
            //}
        },
        data: new kendo.data.DataSource({
            type: 'odata-v4',
            transport: {
                read: {
                    url: function () {
                        return '/odata/ApplicationGroups?$expand=Applications'
                    },
                },
                update: {
                    url: function (data) {
                        return '/odata/ApplicationGroups(applicationGroupId=' + data.ApplicationGroupID + ')?$expand=Applications'
                    }
                },
                batch: {
                    url: function () {
                        return "/odata/$batch";
                    }
                },
                create: {
                    url: function (dataItem) {
                        delete dataItem.ApplicationGroupID;
                        return '/odata/ApplicationGroups?$expand=Applications';
                    }
                },
                destroy: {
                    url: function (data) {
                        return '/odata/ApplicationGroups(resourceId=' + data.ApplicationGroupID + ')?$expand=Applications'
                    }
                },
                parameterMap: function (data, type) {
                    var result = kendo.data.transports["odata-v4"].parameterMap(data, type);

                    if (type === "update") {
                        if (data.Value == "")
                            data.Value = null;
                        console.log('updating', data);
                        self.gridSettings.widget().one("dataBound", function (e) {
                            self.gridSettings.widget().dataSource.read();
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
                    id: 'ApplicationGroupID',
                    fields: {
                        ApplicationGroupID: {
                            type: 'number',
                            editable: false
                        },
                        Applications: { },
                        Name: {
                            type: 'string',
                            editable: true
                        },
                        Description: {
                            type: 'string',
                            editable: true
                        },
                        SortOrder: {
                            type: 'number',
                            validation: {
                                required: true
                            },
                            editable: true
                        },
                        Preview: {
                            type: 'object',
                            editable: false
                        }
                    }
                }
            },
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
        },
        dataBound: function (e) {
            var pristine = e.sender.dataSource.data().toJSON();
            ko.utils.arrayForEach(e.sender.dataSource.data(), function (item, index) {

                ko.cleanNode($('tr[data-uid="' + item.uid + '"]')[0]);

                pristine[index].buttonFadeColourTop = ko.observable(pristine[index].ButtonFadeColourTop);
                pristine[index].buttonFadeColourBottom = ko.observable(pristine[index].ButtonFadeColourBottom);
                pristine[index].buttonBorderColour = ko.observable(pristine[index].ButtonBorderColour);
                pristine[index].buttonClassName = `button-class-${pristine[index].ApplicationGroupID}`;
                pristine[index].buttonClass = ko.pureComputed(function () {
                    let self = this;
                    return `.${self.buttonClassName} {
                                color: white;
                                background-image: linear-gradient(to bottom, ${self.buttonFadeColourTop()} 0%, ${self.buttonFadeColourBottom()} 100%);
                                border-color: ${self.buttonBorderColour()};
                                background-color: ${self.buttonFadeColourBottom()};
                                box-shadow: inset 0 1px 0 rgb(255 255 255 / 15%), 0 1px 1px rgb(0 0 0 / 8%);
                            }
                            .${self.buttonClassName}:hover {
                                background-color: ${self.buttonFadeColourBottom()};
                            }
                            .${self.buttonClassName}:active {
                                background-color: ${self.buttonFadeColourBottom()};
                            }
                            .${self.buttonClassName}:active:hover {
                                background-color: ${self.buttonFadeColourBottom()};
                            }
                            .${self.buttonClassName}:visited {
                                background-color: ${self.buttonFadeColourBottom()};
                                border-color: ${self.buttonBorderColour()};
                            }`;
                }, pristine[index]);

                ko.applyBindings(pristine[index], $('tr[data-uid="' + item.uid + '"]')[0]);
            });
        },
        cellClose: function (e) {
            console.log('cellClose', e);
            window.setTimeout(function () {
                var ctx = ko.contextFor(e.container[0]).$data;
                ko.cleanNode(e.container[0]);
                ko.applyBindings(ctx, e.container[0]);
            }, 0);
        },
        edit: function (e) {
            console.log('edit', e);
            var ctx = ko.contextFor(e.container[0]).$data;
            //ko.cleanNode(e.container[0]);
            //ko.applyBindings(ctx, e.container[0]);
            if ($('input[type="color"]', e.container[0]).length == 1) {
                let fieldName = $('input[type="color"]', e.container[0]).data('binding-target');
                ko.applyBindingsToNode($('input[type="color"]', e.container[0])[0], { textInput: ctx[fieldName] });
                $('input[type="color"]', e.container[0]).trigger('click');
            }
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
        console.log('applicationGroupsViewModel reset called', self);
        self.errors.showAllMessages(false);
        self.busy(false);
    }

    //#endregion

    //#region Events


    //#endregion
}