var tasksDashboardViewModel = function () {
    var self = this;

    self.notifyTest = function () {
        $.ajax({
            url: '/api/TasksDashboardAPI/NotifyTest',
            type: 'POST',
            dataType: 'json'
        });
    }

    self.taskDashboard = ko.observable();

    self.allTimeTaskCount = ko.pureComputed(function () {
        if (self.taskDashboard()) {
            var data = self.taskDashboard();
            var total = 0;
            for (var propertyName in data) {
                if (propertyName.indexOf('External') == -1)
                    total += data[propertyName];
            }
            return total;
        }
    }, self);

    self.allTimeExternalTaskCount = ko.pureComputed(function () {
        if (self.taskDashboard()) {
            var data = self.taskDashboard();
            var externalTotal = 0;
            for (var propertyName in data) {
                if (propertyName.indexOf('External') > -1)
                    externalTotal += data[propertyName];
            }
            return externalTotal;
        }
    }, self);

    self.taskGridWidget = ko.observable();

    self.loadingBusy = ko.observable(false);

    self.taskGridBusy = ko.observable(false);

    self.createEmployeeHierarchicalDataSource = function () {
        var result = new kendo.data.HierarchicalDataSource({
            data: getEmployeeHierarchyData(),
            schema: {
                model: {
                    id: 'DropDownTreeLocationID',
                    children: {
                        schema: {
                            data: "Departments",
                            id: 'DropDownTreeDepartmentID',
                            model: {
                                children: {
                                    schema: {
                                        data: "Members",
                                        id: 'MemberID',
                                        hasChildren: false
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        return result;
    }

    self.preFilters = new preFiltersViewModel(self);

    self.newTaskFactory = new newTaskFactoryViewModel(self);

    self.taskEdit = new taskEditViewModel(self);

    self.myTasks = function () {
        self.taskGridWidget().dataSource._filter = undefined;
        self.preFilters.setWidget('DueThisWeek', $('#due-this-week'));
        self.preFilters.createdBy(undefined);
        self.preFilters.createdBySlicer().value('');
        self.preFilters.assignedTo(getUserId());
        self.preFilters.assignedToSlicer().value(getUserId());
        self.preFilters.time(new Date().getTime());
    }

    self.toggleGridFilters = function () {
        $('.k-grid-header').slideToggle();
    }

    self.tasksICreated = function () {
        self.taskGridWidget().dataSource._filter = undefined;
        self.preFilters.setWidget('DueThisWeek', $('#due-this-week'));
        self.preFilters.createdBy(getUserId());
        self.preFilters.createdBySlicer().value(getUserId());
        self.preFilters.assignedTo(undefined);
        self.preFilters.assignedToSlicer().value('');
        self.preFilters.time(new Date().getTime());
    }

    self.allExternalTasks = function () {
        self.taskGridWidget().dataSource._filter = undefined;
        self.preFilters.setWidget('DueThisWeekExternal', $('#due-this-week-external'));
        self.preFilters.createdBy(getUserId());
        self.preFilters.createdBySlicer().value(getUserId());
        self.preFilters.assignedTo(undefined);
        self.preFilters.assignedToSlicer().value('');
        self.preFilters.time(new Date().getTime());
    }

    self.taskGridDataSourceRead = function (options) {

        var data = {};

        var webapi = new kendo.data.transports.webapi({ prefix: '' });
        var params = webapi.parameterMap(options.data);

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        data.showCompleted = self.preFilters.showCompleted();

        self.preFilters.slicerCollection.forEach(function (p) {
            if (p) {
                if (typeof p.widget === 'function') {
                    if (p.widget()) {
                        if (typeof p.value === 'function') {
                            data[p.controlName] = p.value();
                        } else {
                            data[p.controlName] = p.widget();
                        }
                    }
                }
            }
        });

        //console.log('calling TaskDashboard with', data);

        $.ajax({
            url: '/api/TasksDashboardAPI/TaskDashboard',
            type: "GET",
            data: data,
            success: function (data) {
                console.log('TaskDashboard returned', data);
                self.taskDashboard(data);
                if (self.preFilters.widget() == null) {
                    switch (data.Unread) {
                        case 0:
                            self.preFilters.setWidget('DueToday', $("#due-today"));
                            break;
                        default:
                            self.preFilters.setWidget('Unread', $("#unread"));
                            break;
                    }
                }
            }
        });

        console.log('calling TaskGrid with', data);

        $.ajax({
            url: '/api/TasksDashboardAPI/TaskGrid',
            type: "GET",
            data: data,
            success: function (data) {
                console.log('TaskGrid returned', data);
                options.success(data);
            },
            error: function (data) {
                console.log(data);
                options.error();
            }
        });
    }

    self.taskGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.taskGridDataSourceRead
        },
        pageSize: 10,
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            model: {
                id: 'TaskDueID',
                fields: {
                    Due: { type: 'date' },
                    ExpectedDeliveryDT: { type: 'date' },
                    AssignmentDT: { type: 'date' }
                }
            }
        }),
        //sort: { field: "", dir: "" },
        requestStart: function (e) {
            self.taskGridBusy(true);
        },
        requestEnd: function (e) {
            self.taskGridBusy(false);
        },
        //aggregate: [
        //    { field: "", aggregate: "" }
        //]
    });

    self.memberFilterDataSourceRead = function (options) {

        var data = {};

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        $.ajax({
            url: '/api/TasksDashboardAPI/MemberList',
            data: data,
            success: function (data) {
                console.log('TaskGrid returned', data);
                options.success(data);
            },
            error: function (data) {
                console.log(data);
                options.error();
            }
        });
    }

    self.memberFilter = function (element) {
        element.kendoDropDownList({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: self.memberFilterDataSourceRead
                },
                pageSize: 10,
                serverPaging: true,
                serverFiltering: true,
                schema: $.extend({}, kendo.data.schemas.webapi, {
                    data: "Data",
                    total: "Total",
                    errors: "Errors",
                    model: {
                        id: 'MemberID',
                        fields: {
                            MemberID: { type: 'number' },
                            FullName: { type: 'string' }
                        }
                    }
                })
            }),
            filter: "startswith",
            dataTextField: 'FullName',
            dataValueField: 'MemberID',
            optionLabel: 'Select'
        });
    }

    //console.log('memberFilter is not yet complete, this... will be a tricky one');

    self.statusFilter = function (element) {
        element.kendoDropDownList({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: '/api/TasksDashboardAPI/TaskStatusList',
                    dataType: 'json'
                }
            }),
            filter: "startswith",
            dataTextField: 'Name',
            dataValueField: 'TaskStatusID',
            optionLabel: 'Select'
        });
    }

    self.externalCompanyFilter = function (element) {
        element.kendoDropDownList({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: '/api/TasksDashboardAPI/ExternalCompanyList',
                    dataType: 'json'
                }
            }),
            filter: "startswith",
            dataTextField: 'Name',
            dataValueField: 'ExternalCompanyID',
            optionLabel: 'Select'
        });
    }

    self.projectFilter = function (element) {
        element.kendoDropDownList({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: '/api/TasksDashboardAPI/ProjectsList',
                    dataType: 'json'
                }
            }),
            filter: "startswith",
            dataTextField: 'Name',
            dataValueField: 'ProjectID',
            optionLabel: 'Select'
        });
    }

    self.coreFilter = function (element) {
        element.kendoDropDownList({
            dataSource: [{ text: 'Yes', value: true }, { text: 'No', value: false }],
            dataTextField: 'text',
            dataValueField: 'value',
            optionLabel: 'Select'
        });
    }

    self.urgentFilter = function (element) {
        element.kendoDropDownList({
            dataSource: [{ text: 'Yes', value: true }, { text: 'No', value: false }],
            dataTextField: 'text',
            dataValueField: 'value',
            optionLabel: 'Select'
        });
    }

    self.taskGridSettings = {
        autoBind: false,
        widget: self.taskGridWidget,
        data: self.taskGridDataSource,
        useKOTemplates: true,
        rowTemplate: 'grid-row-template',
        //selectable: "multiple, row",
        //sortable: {
        //    initialDirection: "desc"
        //},
        scrollable: true,
        columns: [{
            field: 'AuthorMemberID',
            title: 'Created By',
            filterable: {
                extra: false,
                ui: self.memberFilter
            }
        }, {
            field: 'AssignedByMemberID',
            title: 'Assigned By',
            filterable: {
                extra: false,
                ui: self.memberFilter
            }
        }, {
            field: 'AssignedToMemberID',
            title: 'Assigned To',
            filterable: {
                extra: false,
                ui: self.memberFilter
            }
        }, {
            field: 'TaskStatusID',
            title: 'Status',
            filterable: {
                extra: false,
                ui: self.statusFilter
            }
        }, {
            field: 'Due',
            title: 'Due Date',
            filterable: {
                extra: false
            }
        }, {
            field: 'ExpectedDeliveryDT',
            title: 'Expected Delivery',
            filterable: {
                extra: false
            }
        }, {
            field: 'ExternalCompanyID',
            title: 'External Company',
            filterable: {
                extra: false,
                ui: self.externalCompanyFilter
            }
        }, {
            field: 'AssignmentDT',
            title: 'Assigned',
            filterable: {
                extra: false
            }
        }, {
            field: 'ProjectID',
            title: 'Project',
            filterable: {
                extra: false,
                ui: self.projectFilter
            }
        }, {
            field: 'Core',
            title: 'Core',
            filterable: {
                extra: false,
                ui: self.coreFilter
            }
        }, {
            field: 'Urgent',
            title: 'Urgent',
            filterable: {
                extra: false,
                ui: self.urgentFilter
            }
        }],
        //rowTemplate: function (rec) {
        //    return '<tr data-uid="' + rec.uid + '"><td colspan="1">' + rec.Author.FullName + '</td></tr>'
        //},
        sortable: true,
        filterable: true,
        grouping: false,
        serverGrouping: false,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        change: function (e, args) {

        },
        dataBinding: function (e) {
            //for (var i = 0; i < e.sender.dataSource.view().length; i++) {
            //    var rec = e.sender.dataSource.view()[i];
            //    if ($("tr[data-uid='" + rec.uid + "']").length) {
            //        ko.cleanNode($("tr[data-uid='" + rec.uid + "']")[0]);
            //    }
            //}
        },
        dataBound: function (e) {

            // we need... to check the current page index, see if we're beyond the bounds of all pages, and if we are page to 1 
            console.log('taskGridDatabound', e);

            // this should probably be default behaviour in kendo, but it isn't.
            // so... I might have to put this to every grid's dataBound function. Great.
            if (e.sender.pager.page() > e.sender.pager.totalPages())
                e.sender.pager.page(1);

            $('.k-grid-subheader').remove();
            $("#faux-column-titles").remove();


            var subHeading = $('<h4 class="k-grid-subheader">' + self.preFilters.displayLine() + '</h4>' +
                '<div id="faux-column-titles">' +
                '<div class="row"><div class="col-xs-4"><label class="col-form-label">Description</label></div>' +
                '<div class="col-xs-8">' +
                '<div class="row">' +
                '<div class="col-xs-5">' +
                '<label class="col-form-label">Due</label>' +
                '</div>' +
                '<div class="col-xs-3">' +
                '<label class="col-form-label">From</label>' +
                '</div>' +
                '<div class="col-xs-3">' +
                '<label class="col-form-label">To</label>' +
                '</div>' +
                '</div>' +
                '</div></div></div>');

            $(subHeading).insertAfter($('.k-grid-header'));

        },
        filterMenuInit: function (e) {
            console.log(e);
            if (
                e.field == 'AuthorMemberID' ||
                e.field == 'AssignedByMemberID' ||
                e.field == 'AssignedToMemberID' ||
                e.field == 'TaskStatusID' ||
                e.field == 'Core' ||
                e.field == 'Urgent' ||
                e.field == 'ProjectID' ||
                e.field == 'ExternalCompanyID' ||
                e.field == 'TaskStatusID') {
                e.container.find(".k-filter-help-text").hide();
                var firstValueDropDown = e.container.find("select:eq(0)").data("kendoDropDownList");
                setTimeout(function () {
                    firstValueDropDown.wrapper.hide();
                });
            }
        }
    };

    self.preFiltersComputed = ko.computed(function () {
        var groupOne = self.preFilters.foo();

        console.log('preFiltersComputed', groupOne);

        if (typeof groupOne != 'undefined') {
            if (self.taskGridWidget()) {
                self.taskGridWidget().dataSource.read();
            }
        }
    }, self).extend({
        rateLimit: {
            timeout: 500,
            method: 'notifyWhenChangesStop'
        }
    });

    self.taskEdit.load();
}

var preFiltersViewModel = function (parent) {
    var self = this;

    // "All Tasks"
    // "Tasks I Created"
    // "Tasks Assigned to Me"

    // "{Unread} Tasks Created by Matthew"
    // "{Overdue} Tasks Assigned to Sarah"
    // "Tasks due {This Month} Assigned to {Matthew}"
    // "{Overdue} Tasks in {Project} Assigned to {Sarah}"
    // "{Urgent} Tasks in {Project} of type {Reports} Created by {Tom} and Assigned To {Matthew}";
    self.extraneousButtonClickText = ko.observable("Tasks I Created");

    self.time = ko.observable(new Date().getTime());
    self.timeSettings = {
        widget: self.time,
        controlName: 'timeNonce'
    };

    // without using string interpolation, thank you VERY much Internet Explorer...

    // so we start with Status.

    self.displayLine = function () {

        var widget = $('> span', $('.dash-selected')).first().text();

        if (widget == "Total") {
            widget = "All current";
        }

        widget = widget.replace("Week", "week");
        widget = widget.replace("Month", "month");
        widget = widget.replace("days", "day view of");

        var result = widget + " Tasks";

        if (self.status()) {
            result = widget + " " + self.statusSlicer().text().toLowerCase() + " Tasks";
        }

        if (self.project()) {
            result += " in " + self.projectSlicer().text();
        }

        if (self.type()) {
            result += " of type " + self.typeSlicer().text();
        }

        var assignedTo = "";

        if (self.assignedTo()) {
            assignedTo = self.assignedTo().FullName == getUserName() ? "me" : self.assignedTo().FullName || self.assignedTo().Name;
        }

        var createdBy = "";

        if (self.createdBy()) {
            createdBy = self.createdBy().FullName == getUserName() ? "I" : self.createdBy().FullName || self.createdBy().Name;
        }

        var assignedToCreatedByText = "";

        if (assignedTo && createdBy) {
            assignedToCreatedByText += (createdBy == "I" ? " which I created" : " created by " + createdBy) +
                " and assigned to " + assignedTo;


            //" assigned to " + assignedTo + (createdBy == "I" ? " which I created" : " and created by " + createdBy);
        } else if (assignedTo) {
            assignedToCreatedByText += " assigned to " + assignedTo;
        } else if (createdBy) {
            assignedToCreatedByText += (createdBy == "I" ? " I created" : " created by " + createdBy);
        }

        result += assignedToCreatedByText;

        return result;
    }

    self.clearFilters = function () {
        self.createdBySlicer().value('');
        self.assignedToSlicer().value('');
        self.statusSlicer().value('');
        self.projectSlicer().value('');
        self.typeSlicer().value('');
        self.parent.taskGridWidget().dataSource.filter("");
    }

    self.parent = parent;

    self.busy = ko.observable();
    self.nonce = ko.observable();

    self.createdBySlicer = ko.observable();
    self.assignedToSlicer = ko.observable();
    self.statusSlicer = ko.observable();
    self.projectSlicer = ko.observable();
    self.typeSlicer = ko.observable();

    self.createdByDataSource = self.parent.createEmployeeHierarchicalDataSource();
    self.assignedToDataSource = self.parent.createEmployeeHierarchicalDataSource();

    self.createdBy = ko.observable();
    self.assignedTo = ko.observable(getUserId());
    self.status = ko.observable();
    self.project = ko.observable();
    self.type = ko.observable();

    self.haveInitialised = false;
    self.bindCount = 0;

    self.createdBySettings = {
        controlName: 'CreatedByMemberID',
        dataTextField: 'Name',
        dataValueField: 'MemberID',
        leafDataField: 'MemberID',
        selectAnyNode: false,
        widget: self.createdBySlicer,
        value: self.createdBy,
        data: self.createdByDataSource,
        selectable: true,
        valuePrimitive: true,
        autoWidth: true,
        height: 400,
        placeholder: 'Anyone',
        autoClose: false,
        filter: 'contains',
        open: function (e) {
            e.sender.filterInput.val('');
            e.sender.dataSource.filter({});
            e.sender.treeview.dataSource.filter({});
            e.sender.treeview.dropdowntree._prev = '';
            e.sender.search('');
            e.sender.treeview.collapse('.k-item');
        },
        select: function (e) {
            if (e.sender.dropdowntree.value() != '') {
                var item = e.sender.dataSource.getByUid(e.node.dataset.uid);
                if (item.hasOwnProperty(e.sender.dropdowntree.options.leafDataField)) {
                    e.sender.dropdowntree.close();
                } else {
                    e.preventDefault();
                    e.sender.dropdowntree.treeview.toggle(e.node);
                }
            } else {
                self.createdBy(undefined);
            }
        }
    };

    self.assignedToSettings = {
        controlName: 'AssignedToMemberID',
        dataTextField: 'Name',
        dataValueField: 'MemberID',
        leafDataField: 'MemberID',
        selectAnyNode: false,
        widget: self.assignedToSlicer,
        value: self.assignedTo,
        data: self.assignedToDataSource,
        selectable: true,
        valuePrimitive: true,
        autoWidth: true,
        autoPopulate: true,
        height: 400,
        placeholder: 'Anyone',
        autoClose: false,
        filter: 'contains',
        open: function (e) {
            e.sender.filterInput.val('');
            e.sender.dataSource.filter({});
            e.sender.treeview.dataSource.filter({});
            e.sender.treeview.dropdowntree._prev = '';
            e.sender.search('');
            e.sender.treeview.collapse('.k-item');
        },
        select: function (e) {
            if (e.sender.dropdowntree.value() != '') {
                var item = e.sender.dataSource.getByUid(e.node.dataset.uid);
                if (item.hasOwnProperty(e.sender.dropdowntree.options.leafDataField)) {
                    e.sender.dropdowntree.close();
                } else {
                    e.preventDefault();
                    e.sender.dropdowntree.treeview.toggle(e.node);
                }
            } else {
                self.assignedTo(undefined);
            }
        }
    };

    self.assignedToParams = {
        observable: self.assignedTo,
        dropDownListSettings: self.assignedToSettings
    }

    self.statusSlicerSettings = {
        dataValueField: 'TaskStatusID',
        dataTextField: 'Name',
        widget: self.statusSlicer,
        data: new kendo.data.DataSource({
            serverFiltering: false,
            serverSorting: false,
            serverGrouping: false,
            transport: {
                read: function (options) {
                    var webapi = new kendo.data.transports.webapi({ prefix: "" });
                    var mapped = webapi.parameterMap(options.data);
                    var data = {};//self.dataSourceData();
                    for (var propertyName in mapped) {
                        data[propertyName] = mapped[propertyName];
                    }
                    $.ajax({
                        url: '/api/TasksDashboardAPI/GetTaskStatuses',
                        type: "POST",
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
        valuePrimitive: true,
        //select: self.onSelect,
        value: self.status,
        autoWidth: false,
        autoBind: false,
        optionLabel: 'Please select'
        //dataBound: self.dataBound
    };

    self.projectSlicerSettings = {
        dataValueField: 'ProjectID',
        dataTextField: 'Name',
        widget: self.projectSlicer,
        data: new kendo.data.DataSource({
            serverFiltering: false,
            serverSorting: false,
            serverGrouping: false,
            transport: {
                read: function (options) {
                    var webapi = new kendo.data.transports.webapi({ prefix: "" });
                    var mapped = webapi.parameterMap(options.data);
                    var data = {};//self.dataSourceData();
                    for (var propertyName in mapped) {
                        data[propertyName] = mapped[propertyName];
                    }
                    $.ajax({
                        url: '/api/TasksDashboardAPI/GetProjects',
                        type: "POST",
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
        valuePrimitive: true,
        //select: self.onSelect,
        value: self.project,
        autoWidth: true,
        autoBind: false,
        optionLabel: 'Please select',
        filter: 'contains'
        //dataBound: self.dataBound
    };

    self.typeSlicerSettings = {
        dataValueField: 'TaskTypeID',
        dataTextField: 'Name',
        widget: self.typeSlicer,
        data: new kendo.data.DataSource({
            serverFiltering: false,
            serverSorting: false,
            serverGrouping: false,
            transport: {
                read: function (options) {
                    var webapi = new kendo.data.transports.webapi({ prefix: "" });
                    var mapped = webapi.parameterMap(options.data);
                    var data = {};//self.dataSourceData();
                    for (var propertyName in mapped) {
                        data[propertyName] = mapped[propertyName];
                    }
                    $.ajax({
                        url: '/api/TasksDashboardAPI/GetTaskTypes',
                        type: "POST",
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
        valuePrimitive: true,
        //select: self.onSelect,
        value: self.type,
        autoWidth: true,
        autoBind: false,
        optionLabel: 'Please select',
        filter: 'contains'
        //dataBound: self.dataBound
    };

    var initialWidget = getInitialWidget();

    self.widget = ko.observable(initialWidget);

    self.showCompleted = ko.observable(false);

    self.setWidget = function (value, ele) {
        self.widget(value);
        if (value.toLowerCase().indexOf('complete') > -1) {
            self.showCompleted(true);
        } else {
            self.showCompleted(false);
        }
        $(".dash-btn").removeClass('dash-selected');
        $(ele).closest('.dash-btn').addClass('dash-selected');
    }

    var ele = null;

    switch (initialWidget) {
        case 'Unread':
            ele = $('#unread');
            break;
        case 'Chased':
            ele = $('#chased');
            break;
        case 'Urgent':
            ele = $('#urgent');
            break;
        case 'Overdue':
            ele = $('#overdue');
            break;
        default:
            initialWidget = 'DueToday';
            ele = $('#due-today');
            break;
    }

    self.setWidget(initialWidget, ele);

    self.slicerCollection = [
        self.timeSettings,
        self.createdBySettings,
        self.assignedToSettings,
        self.statusSlicerSettings,
        self.projectSlicerSettings,
        self.typeSlicerSettings,
        {
            controlName: 'Widget',
            widget: self.widget
        }
    ];

    self.foo = ko.computed(function () {
        var createdBy = self.createdBy();
        var assignedTo = self.assignedTo();
        //var widget = self.widget();
        return createdBy || assignedTo;
    }, self).extend({
        rateLimit: {
            timeout: 0,
            method: 'notifyWhenChangesStop'
        }
    });
}








































var newTaskFactoryViewModel = function (parent) {
    var self = this;
    self.parent = parent;

    self.busy = ko.observable(false);

    self.name = ko.observable().extend({
        required: {
            params: true,
            message: 'Please provide a description'
        },
        charsRemaining: {
            maxLength: 100,
            elementId: '#new-task-name'
        }
    });

    self.urgent = ko.observable(false);

    self.core = ko.observable(false);

    self.project = ko.observable();

    self.initProjectListAutocomplete = function () {
        $('#new-task-project').autocomplete({
            appendTo: 'body',
            source: function (request, response) {
                $.ajax({
                    url: '/api/TasksDashboardAPI/ProjectsAutocomplete',
                    type: "POST",
                    dataType: "json",
                    data: {
                        term: request.term
                    },
                    success: function (data) {
                        response($.map(data, function (item) {
                            return {
                                label: item.Name,
                                value: item
                            };
                        }));
                    }
                });
            },
            minLength: 1,
            select: function (event, ui) {
                event.preventDefault();
                $('#new-task-project').val(ui.item.label)
                self.project(ui.item.value.ProjectID);
            },
            focus: function (event, ui) {
                return false;
            },
            autoFocus: true,
            placeholder: 'Type to Search'
        });
    }

    self.initProjectListAutocomplete();

    self.clearProject = function () {
        self.project(undefined);
        $("#new-task-project").val(undefined);
    }

    self.taskType = ko.observable();
    self.taskTypeListWidget = ko.observable();
    self.availableTaskTypes = ko.observableArray(getAvailableTaskTypes());

    self.taskTypeListParams = {
        widget: self.taskTypeListWidget,
        name: 'taskTypeList',
        itemsList: self.availableTaskTypes,
        autocompleteMaxLength: 50,
        autocompleteElementId: 'new-task-type',
        target: self.taskType,
        additionalData: {},
        valueField: 'TaskTypeID',
        textField: 'Name',
        addItemEndpoint: '/api/TasksDashboardAPI/AddTaskType',
        autocompleteEndpoint: '/api/TasksDashboardAPI/TaskTypeAutocomplete',
        listPull: 'pull-right'
    };

    self.externalCompany = ko.observable();
    self.externalCompanyListWidget = ko.observable();
    self.availableExternalCompanies = ko.observableArray(getAvailableExternalCompanies());
    self.externalCompanyListParams = {
        widget: self.externalCompanyListWidget,
        name: 'externalCompanyList',
        itemsList: self.availableExternalCompanies,
        autocompleteMaxLength: 200,
        autocompleteElementId: 'new-task-external-company',
        target: self.externalCompany,
        additionalData: {},
        valueField: 'ExternalCompanyID',
        textField: 'Name',
        addItemEndpoint: '/api/TasksDashboardAPI/AddExternalCompany',
        autocompleteEndpoint: '/api/TasksDashboardAPI/ExternalCompanyAutocomplete',
        listPull: 'pull-right'
    };

    self.externalCompany.subscribe(function (newValue) {
        if (newValue) {
            self.externalStatus(undefined);
            self.externalStatusListWidget().autocomplete(undefined);
            self.availableExternalStatuses([]);
            $.ajax({
                url: '/api/TasksDashboardAPI/FetchExternalStatuses',
                type: 'POST',
                dataType: 'json',
                data: {
                    externalCompanyId: newValue.ExternalCompanyID
                },
                success: function (data) {
                    self.availableExternalStatuses(data);
                }
            });
        } else {
            self.externalStatus(undefined);
            self.externalStatusListWidget().autocomplete(undefined);
            self.availableExternalStatuses([]);
        }
    });

    self.availableExternalStatuses = ko.observableArray([]);

    self.externalStatusListWidget = ko.observable();
    self.availableExternalStatuses = ko.observableArray(getAvailableExternalCompanies());
    self.externalStatus = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.externalCompany()
            },
            message: 'Please provide a status'
        }
    });

    self.externalCompanyId = ko.pureComputed(function () {
        if (self.externalCompany()) {
            return self.externalCompany().ExternalCompanyID
        } else {
            return null;
        }
    }, self);

    self.externalStatusListParams = {
        widget: self.externalStatusListWidget,
        name: 'externalStatusList',
        itemsList: self.availableExternalStatuses,
        autocompleteMaxLength: 100,
        autocompleteElementId: 'new-task-external-status',
        target: self.externalStatus,
        additionalData: {
            'ExternalCompanyID': self.externalCompanyId
        },
        valueField: 'ExternalStatusID',
        textField: 'Name',
        addItemEndpoint: '/api/TasksDashboardAPI/AddExternalStatus',
        autocompleteEndpoint: '/api/TasksDashboardAPI/ExternalStatusAutocomplete',
        listPull: 'pull-right',
        enabled: self.externalCompany
    };

    self.externalContact = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.externalCompany()
            },
            message: 'Please provide a contact'
        },
        charsRemaining: {
            maxLength: 200,
            elementId: '#external-contact'
        }
    });

    self.externalReference = ko.observable().extend({
        charsRemaining: {
            maxLength: 50,
            elementId: '#external-reference'
        }
    });

    self.externalPhone = ko.observable().extend({
        charsRemaining: {
            maxLength: 20,
            elementId: '#external-phone'
        }
    });

    self.externalEmail = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.externalCompany()
            },
            message: 'Please provide an email'
        },
        email: {
            params: true,
            message: 'Invalid email format'
        },
        charsRemaining: {
            maxLength: 256,
            elementId: '#external-email'
        }
    });

    self.recurring = ko.observable(false);

    var day = new Date().getDate();
    var month = moment().format('MMMM');

    self.scheduleTypes = [{
        ScheduleTypeID: 1,
        Name: 'Daily'
    }, {
        ScheduleTypeID: 2,
        Name: 'Weekly'
    }, {
        ScheduleTypeID: 3,
        Name: 'Monthly'
    }];

    self.days = [{
        DayID: 1,
        Name: 'Monday',
        SortOrder: 1
    }, {
        DayID: 2,
        Name: 'Tuesday',
        SortOrder: 2
    }, {
        DayID: 3,
        Name: 'Wednesday',
        SortOrder: 3
    }, {
        DayID: 4,
        Name: 'Thursday',
        SortOrder: 4
    }, {
        DayID: 5,
        Name: 'Friday',
        SortOrder: 5
    }, {
        DayID: 6,
        Name: 'Saturday',
        SortOrder: 6
    }, {
        DayID: 7,
        Name: 'Sunday',
        SortOrder: 7
    }, {
        DayID: 101,
        Name: 'Day',
        SortOrder: 8
    }, {
        DayID: 102,
        Name: 'Working Day',
        SortOrder: 9
    }];

    self.frequencies = [{
        ScheduleFrequencyID: 1,
        Name: 'First'
    }, {
        ScheduleFrequencyID: 2,
        Name: 'Second'
    }, {
        ScheduleFrequencyID: 3,
        Name: 'Third'
    }, {
        ScheduleFrequencyID: 4,
        Name: 'Fourth'
    }, {
        ScheduleFrequencyID: 101,
        Name: 'Last'
    },];

    self.today = ko.computed(function () {
        return Enumerable.From(self.days).Where("$.Name == '" + moment().format("dddd") + "'").Single();
    }, self);

    self.schedule = {
        scheduleType: ko.observable(self.scheduleTypes[0]),
        interval: ko.observable(1).extend({
            required: {
                params: true,
                message: 'You must provide an interval'
            },
            numberFormatted: {
                digits: 0,
                currency: {
                    FormattingCulture: 'en-GB'
                },
                maxValue: 256,
                minValue: 1
            }
        }),
        days: ko.observableArray([]),
        monthlyRepeatType: ko.observable('day'),
        monthlyRepeatType_day: ko.observable(self.days[0]),
        frequency: ko.observable(self.frequencies[0])
    }

    self.toggleWorkingDays = function () {
        var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        var selected = ko.utils.arrayFilter(self.schedule.days(), function (x) {
            if (weekdays.indexOf(x.Name) > -1) {
                return true;
            }
        });

        var missing = ko.utils.arrayFilter(weekdays, function (x) {
            return Enumerable.From(selected).Select("$.Name").ToArray().indexOf(x) == -1;
        });

        if (missing.length) {
            // we're missing at least 1 weekday; add it and return
            for (var i = 0; i < missing.length; i++) {
                var addition = Enumerable.From(self.days).Where("$.Name == '" + missing[i] + "'").Single();
                self.schedule.days.push(addition);
            }
        } else {
            self.schedule.days.remove(function (x) {
                return weekdays.indexOf(x.Name) > -1;
            });
        }
    }

    self.toggleWeekendDays = function () {
        var weekdays = ['Saturday', 'Sunday'];

        var selected = ko.utils.arrayFilter(self.schedule.days(), function (x) {
            if (weekdays.indexOf(x.Name) > -1) {
                return true;
            }
        });

        var missing = ko.utils.arrayFilter(weekdays, function (x) {
            return Enumerable.From(selected).Select("$.Name").ToArray().indexOf(x) == -1;
        });

        if (missing.length) {
            for (var i = 0; i < missing.length; i++) {
                var addition = Enumerable.From(self.days).Where("$.Name == '" + missing[i] + "'").Single();
                self.schedule.days.push(addition);
            }
        } else {
            self.schedule.days.remove(function (x) {
                return weekdays.indexOf(x.Name) > -1;
            });
        }
    }

    self.schedule.days.extend({
        minLength: {
            params: 1,
            onlyIf: function () {
                return self.schedule.scheduleType().Name === 'Weekly'
            },
            message: 'You must select at least one day'
        }
    });

    self.dueDateWidget = ko.observable();
    self.dueDate = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () { return !self.recurring() },
            message: 'Please select a date'
        }
    });
    self.dueDateSettings = {
        widget: self.dueDateWidget,
        value: self.dueDate,
        min: new Date(),
        footer: false
    };
    self.clearDueDate = function () {
        self.dueDate(null);
        self.dueDateWidget().value(null);
    }

    self.fromDate = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () { return self.recurring() },
            message: 'Please select a date'
        }
    });
    self.fromDateWidget = ko.observable();

    self.fromDate.subscribe(function (newValue) {
        if (newValue) {
            self.untilDateWidget().min(newValue);
        } else {
            self.untilDateWidget().min(null);
        }
    });

    self.fromDateSettings = {
        widget: self.fromDateWidget,
        value: self.fromDate,
        footer: false,
        min: new Date()
    };

    self.untilDate = ko.observable();
    self.untilDateWidget = ko.observable();

    self.untilDate.subscribe(function (newValue) {
        if (newValue) {
            self.fromDateWidget().max(newValue);
        } else {
            self.fromDateWidget().max(null);
        }
    });

    self.untilDateSettings = {
        widget: self.untilDateWidget,
        value: self.untilDate,
        footer: false,
        min: new Date()
    };

    self.clearFromDate = function () {
        self.fromDate(null);
        self.fromDateWidget().value(null);
        self.untilDateWidget().min(new Date());
    }

    self.clearUntilDate = function () {
        self.untilDate(null);
        self.untilDateWidget().value(null);
        self.fromDateWidget().min(new Date());
        self.fromDateWidget().max(new Date(2099, 11, 31));
    }

    self.assignedTo = ko.observable(getUserId()).extend({
        required: {
            params: true,
            message: 'Please assign this task'
        }
    });
    self.assignedToWidget = ko.observable();
    self.assignedToWidget.subscribe(function (newValue) {
        if (newValue) {
            self.attachValidation();
        }
    });

    self.comment = ko.observable().extend({
        charsRemaining: {
            maxLength: 500,
            elementId: '.new-task-comment'
        }
    });
    self.sopInstructions = ko.observableArray([]);
    self.sopSearch = ko.observable();
    self.attachments = ko.observable([]);

    self.errors = ko.validation.group([
        //self.taskType,
        self.name,
        self.dueDate,
        self.assignedTo,
        self.comment,
        self.fromDate,
        self.schedule
    ], { deep: true });

    self.closeModal = function () {
        //var confirm = $.confirm('Are you sure?', 'You will lose any unsaved data.', function () {
        self.reset();
        $("#new-task-modal").modal('hide');
        //},
        //function() {

        //})
    }

    self.showExternalAssignmentModal = function () {
        $("#external-assignment-modal").modal('show');
    }

    self.externalCompany.extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.externalContact() ||
                    self.externalReference() ||
                    self.externalPhone() ||
                    self.externalEmail()
            },
            message: 'You must specify a Company'
        }
    });

    self.externalAssignmentErrors = ko.validation.group([
        self.externalCompany,
        self.externalStatus,
        self.externalContact,
        self.externalEmail
    ]);

    self.cancelExternalAssignmentModal = function () {
        self.resetExternalAssignmentModal();
        $("#external-assignment-modal").modal('hide');
    }

    self.closeExternalAssignmentModal = function (action) {
        if (action === 'save') {
            if (self.externalAssignmentErrors().length) {
                self.externalAssignmentErrors.showAllMessages(true);
            } else {
                self.externalAssignmentErrors.showAllMessages(false);
                //self.assignedToWidget().options.placeholder = self.externalCompany().Name;
                //$("#assign-ext-btn").addClass('btn-success');
                $("#external-assignment-modal").modal('hide');
            }
        } else {
            $("#external-assignment-modal").modal('hide');
        }
    }

    self.save = function () {
        self.errors.showAllMessages(false);
        self.externalAssignmentErrors.showAllMessages(false);

        var earlyFail = false;

        if (self.errors().length) {
            self.errors.showAllMessages(true);
            earlyFail = true;
        }

        if (self.externalAssignmentErrors().length) {
            self.externalAssignmentErrors.showAllMessages(true);
            earlyFail = true;
        }

        if (earlyFail) {
            return;
        }

        var data = {
            Recurring: self.recurring(),
            Urgent: self.urgent(),
            Core: self.core(),
            AuthorDescription: self.name(),
            DueDate: moment(self.dueDate()).format(),
            Comment: self.comment()
        };

        var schedule = ko.toJS(self.schedule);

        if (self.recurring()) {
            schedule.startDate = moment(self.fromDate()).format();
            schedule.endDate = self.untilDate() ? moment(self.untilDate()).format() : null;
            data.Schedule = schedule;
            if (self.schedule.monthlyRepeatType() == 'day') {
                delete data.Schedule.frequency;
            }
        }

        switch (self.schedule.scheduleType().Name) {
            case 'Daily':
                break;
            case 'Weekly':
                break;
            case 'Monthly':
                data.Schedule.days = [];

                if (self.schedule.monthlyRepeatType() == 'the') {
                    data.Schedule.days.push(self.schedule.monthlyRepeatType_day());
                }

                break;
            default: break;
        }

        if (self.assignedTo()) {
            data.AssignedToMemberID = self.assignedTo();
        }

        if (self.externalCompany()) {
            data.ExternalCompanyID = self.externalCompany().ExternalCompanyID;
        }

        if (self.externalStatus()) {
            data.ExternalStatusID = self.externalStatus().ExternalStatusID;
        }

        data.ExternalContact = self.externalContact();
        data.ExternalReference = self.externalReference();
        data.ExternalPhone = self.externalPhone();
        data.ExternalEmail = self.externalEmail();
        data.ProjectID = self.project();

        if (self.taskType()) {
            data.TaskTypeID = self.taskType().TaskTypeID;
        }

        self.busy(true);

        data.UploadGUID = self.uploadGuid();
        data.Attachments = self.uploadedFiles();

        $.ajax({
            url: '/api/TasksDashboardAPI/NewTask',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                self.busy(false);
                //$("#latest-task-id").html('Save successful: ' + data.TaskID);
                self.reset();

                // what is actually returned from here, because... projects might well need to consume it.
                // nothing useful was being returned; now I'm returning newTask.NextDue
                // if self.parent.hasOwnProperty... project... Something... 

                $("#new-task-modal").modal('hide');
                if (self.parent.hasOwnProperty('taskGridWidget')) {
                    self.parent.taskGridWidget().dataSource.read();
                }
                if (self.parent.hasOwnProperty('projectFactory')) {
                    self.parent.projectFactory.taskDues.push(data);
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                self.busy(false);
                $.showError(xhr, textStatus, errorThrown);
            }
        });
    }

    self.assignedToSettings = {
        controlName: 'AssignedTo',
        dataTextField: 'Name',
        dataValueField: 'MemberID',
        leafDataField: 'MemberID',
        selectAnyNode: false,
        widget: self.assignedToWidget,
        value: self.assignedTo,
        data: self.parent.createEmployeeHierarchicalDataSource(),
        selectable: true,
        valuePrimitive: true,
        autoWidth: true,
        height: 300,
        placeholder: 'Please select',
        autoClose: false,
        filter: 'contains',
        open: function (e) {
            e.sender.filterInput.val('');
            e.sender.dataSource.filter({});
            e.sender.treeview.dataSource.filter({});
            e.sender.treeview.dropdowntree._prev = '';
            e.sender.search('');
            e.sender.treeview.collapse('.k-item');
        },
        select: function (e) {
            if (e.sender.dropdowntree.value() != '') {
                var item = e.sender.dataSource.getByUid(e.node.dataset.uid);
                if (item.hasOwnProperty(e.sender.dropdowntree.options.leafDataField)) {
                    e.sender.dropdowntree.close();
                } else {
                    e.preventDefault();
                    e.sender.dropdowntree.treeview.toggle(e.node);
                }
            } else {
                self.assignedTo(undefined);
            }
        }
    };

    self.attachments = ko.observableArray([]);
    self.uploadWidget = ko.observable();
    self.uploadedFiles = ko.observableArray([]);
    self.uploadGuid = ko.observable(new Date().getTime());

    self.uploadSettings = {
        multiple: true, // because of how I'm handling isolation of temporary locations for attachments...
        // we can't allow anything except serial upload because I need the return value in order
        // to get the next upload into the correct place!
        widget: self.uploadWidget,
        async: {
            saveUrl: '/api/TasksDashboardAPI/UploadAttachments',
            removeUrl: '/api/TasksDashboardAPI/RemoveAttachments',
            autoUpload: true
        },
        upload: function (e) {
            var xhr = e.XMLHttpRequest;
            if (xhr) {
                xhr.addEventListener("readystatechange", function (e) {
                    if (xhr.readyState == 1 /* OPENED */) {
                        xhr.withCredentials = true;
                        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.BearerToken);
                        if (self.uploadGuid()) {
                            xhr.setRequestHeader("x-upload-guid", self.uploadGuid());
                        }
                    }
                });
            }
        },
        remove: function (e) {
            e.headers.withCredentials = true;
            e.headers["Authorization"] = "Bearer " + localStorage.BearerToken;
            if (self.uploadGuid()) {
                e.headers["x-upload-guid"] = self.uploadGuid();
            }
        },
        success: function (e) {
            for (var i in e.response.files) {
                self.uploadedFiles.push(e.response.files[i]);
            }
            console.log('upload success', e);
        },
        validation: {
            maxFileSize: 10485760
        }
    }

    self.removeFirmAttachment = function (data, target) {
        $.confirm('Are you sure?', 'This will remove ' + data.Name + ' from the task.', function () {
            $.ajax({
                url: '/api/TasksDashboardAPI/RemoveFirmAttachment',
                type: 'POST',
                dataType: 'json',
                data: {
                    TaskAttachmentID: data.TaskAttachmentID
                },
                success: function () {
                    self.attachments.remove(data);
                    $(target).closest('li.list-group-item').remove();
                }
            });
        }, function () {

        });
    }

    self.reset = function () {
        self.busy(false);
        self.attachments([]);
        self.uploadGuid(new Date().getTime());
        self.uploadedFiles([]);
        self.uploadWidget().clearAllFiles();

        self.name(undefined);
        self.recurring(false);
        self.urgent(false);
        self.core(false);
        self.project(undefined);
        $('#new-task-project').val(undefined);
        self.taskType(undefined);
        if (self.taskTypeListWidget()) {
            self.taskTypeListWidget().autocomplete(undefined);
        }
        self.dueDate(undefined);
        self.dueDateWidget().value(null);
        //self.assignedTo(getUserId());
        //self.assignedToWidget().options.placeholder = 'Please select';
        self.assignedToWidget().value(getUserId());
        self.assignedToWidget().dataSource.filter('');
        self.assignedToWidget().filterInput.val(null);
        self.comment(undefined);
        self.sopInstructions([]);
        self.sopSearch(undefined);
        self.attachments([]);

        self.fromDate(undefined);
        self.fromDateWidget().value(null);
        self.fromDateWidget().min(new Date());
        self.fromDateWidget().max(new Date(2099, 11, 31));
        self.untilDate(undefined);
        self.untilDateWidget().value(null);
        self.untilDateWidget().min(new Date());

        var day = new Date().getDate();
        var month = moment().format('MMMM');

        self.schedule.scheduleType(self.scheduleTypes[0]);
        self.schedule.interval(1);
        self.schedule.days([]);
        self.schedule.monthlyRepeatType('day');
        self.schedule.monthlyRepeatType_day(self.days[0]);
        self.schedule.frequency(self.frequencies[0]);

        self.resetExternalAssignmentModal();
    }

    self.resetExternalAssignmentModal = function () {

        self.externalContact(undefined);
        self.externalReference(undefined);
        self.externalPhone(undefined);
        self.externalEmail(undefined);

        self.externalCompany(undefined);
        if (self.externalCompanyListWidget()) {
            self.externalCompanyListWidget().autocomplete(undefined);
        }

        self.availableExternalStatuses([]);
        self.externalStatus(undefined);
        if (self.externalStatusListWidget()) {
            self.externalStatusListWidget().autocomplete(undefined);
        }

        self.errors.showAllMessages(false);
        self.externalAssignmentErrors.showAllMessages(false);
    }

    self.attachValidation = function () {
        console.log('newTaskFactory: attaching validation...');

        self.assignedToWidget().wrapper.children().first().attr('data-bind', 'validationCore: assignedTo');
        // calling cleanNode on this element has the unfortunate side effect of preventing some of kendo's
        // functionality: name .k-state-hover does not get applied to the .k-dropdown-wrap.k-state-default
        // span. Fortunately I don't actually need to call cleanNode on it; it's injected by kendo's library
        // and hasn't yet been tickled by knockout! woop!
        //ko.cleanNode(self.assignedToWidget().wrapper.children().first()[0]);
        ko.applyBindings(self, self.assignedToWidget().wrapper.children().first()[0]);
    }
}





























var taskEditViewModel = function (parent) {
    var self = this;
    self.parent = parent;
    self.perspective = ko.observable('disallow');
    self.busy = ko.observable(false);

    self.taskId = ko.observable();
    self.taskDueId = ko.observable();
    self.readDt = ko.observable();
    self.taskStatus = ko.observable();
    self.author = ko.observable();
    self.authorDescription = ko.observable();
    self.chases = ko.observable();
    self.allCommentsExpanded = ko.observable(false);
    self.newComment = ko.observable().extend({
        charsRemaining: {
            maxLength: 2000,
            elementId: '#new-task-comment'
        }
    });
    self.comments = ko.observable([]);
    self.completedComment = ko.observable().extend({
        charsRemaining: {
            maxLength: 500,
            elementId: '#completed-comment'
        }
    });
    self.core = ko.observable();
    self.createdDt = ko.observable();
    self.currentAssignment = ko.observable();
    self.expectedDeliveryWidget = ko.observable();
    self.expectedDelivery = ko.observable();
    self.expectedDeliverySettings = {
        widget: self.expectedDeliveryWidget,
        value: self.expectedDelivery,
        footer: false,
        //min: new Date() // not sure if we want to set a min; it will remove dates in the past...
        //and as this is the expected delivery date it isn't concrete and may be passed; so we might
        //not want to hide it
    };
    self.clearExpectedDeliveryDate = function () {
        self.expectedDelivery(undefined);
        self.expectedDeliveryWidget().value(null);
    }

    self.availableExternalCompanies = ko.observableArray(getAvailableExternalCompanies());
    self.externalCompany = ko.observable();
    self.externalCompanyListWidget = ko.observable();
    self.availableExternalCompanies = ko.observableArray(getAvailableExternalCompanies());
    self.externalCompanyListParams = {
        widget: self.externalCompanyListWidget,
        name: 'editExternalCompanyList',
        itemsList: self.availableExternalCompanies,
        autocompleteMaxLength: 200,
        autocompleteElementId: 'edit-task-external-company',
        target: self.externalCompany,
        additionalData: {},
        valueField: 'ExternalCompanyID',
        textField: 'Name',
        addItemEndpoint: '/api/TasksDashboardAPI/AddExternalCompany',
        autocompleteEndpoint: '/api/TasksDashboardAPI/ExternalCompanyAutocomplete',
        listPull: 'pull-right'
    };

    self.externalCompany.subscribe(function (newValue) {
        if (newValue) {
            self.externalStatus(undefined);
            self.externalStatusListWidget().autocomplete(undefined);
            self.availableExternalStatuses([]);
            $.ajax({
                url: '/api/TasksDashboardAPI/FetchExternalStatuses',
                type: 'POST',
                dataType: 'json',
                data: {
                    externalCompanyId: newValue.ExternalCompanyID
                },
                success: function (data) {
                    self.availableExternalStatuses(data);
                }
            });
        } else {
            self.externalStatus(undefined);
            self.externalStatusListWidget().autocomplete(undefined);
            self.availableExternalStatuses([]);
        }
    });

    self.availableExternalStatuses = ko.observableArray([]);

    self.externalStatusListWidget = ko.observable();
    self.availableExternalStatuses = ko.observableArray(getAvailableExternalCompanies());
    self.externalStatus = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.externalCompany()
            },
            message: 'Please provide a status'
        }
    });

    self.externalCompanyId = ko.pureComputed(function () {
        if (self.externalCompany()) {
            return self.externalCompany().ExternalCompanyID
        } else {
            return null;
        }
    }, self);

    self.externalStatusListParams = {
        widget: self.externalStatusListWidget,
        name: 'editExternalStatusList',
        itemsList: self.availableExternalStatuses,
        autocompleteMaxLength: 100,
        autocompleteElementId: 'edit-task-external-status',
        target: self.externalStatus,
        additionalData: {
            'ExternalCompanyID': self.externalCompanyId
        },
        valueField: 'ExternalStatusID',
        textField: 'Name',
        addItemEndpoint: '/api/TasksDashboardAPI/AddExternalStatus',
        autocompleteEndpoint: '/api/TasksDashboardAPI/ExternalStatusAutocomplete',
        listPull: 'pull-right',
        enabled: self.externalCompany
    };

    self.project = ko.observable();
    self.projectReadonly = ko.pureComputed(function () {
        if (self.taskDue()) {
            if (self.taskDue().Project) {
                if (self.taskDue().Project.hasOwnProperty('Readonly')) {
                    return true;
                }
            }
        }
        return false;
    }, self);

    self.clearProject = function () {
        self.project(undefined);
        $("#edit-task-project").val(undefined);
    }

    self.initProjectListAutocomplete = function () {
        $('#edit-task-project').autocomplete({
            appendTo: 'body',
            source: function (request, response) {
                $.ajax({
                    url: '/api/TasksDashboardAPI/ProjectsAutocomplete',
                    type: "POST",
                    dataType: "json",
                    data: {
                        term: request.term
                    },
                    success: function (data) {
                        response($.map(data, function (item) {
                            return {
                                label: item.Name,
                                value: item
                            };
                        }));
                    }
                });
            },
            minLength: 1,
            select: function (event, ui) {
                event.preventDefault();
                $('#edit-task-project').val(ui.item.label)
                self.project(ui.item.value.ProjectID);
            },
            focus: function (event, ui) {
                return false;
            },
            autoFocus: true,
            placeholder: 'Type to Search'
        });
    }

    self.taskType = ko.observable();
    self.taskTypeListWidget = ko.observable();
    self.availableTaskTypes = ko.observableArray(getAvailableTaskTypes());

    self.taskTypeListParams = {
        widget: self.taskTypeListWidget,
        name: 'taskTypeList',
        itemsList: self.availableTaskTypes,
        autocompleteMaxLength: 50,
        autocompleteElementId: 'edit-task-type',
        target: self.taskType,
        additionalData: {},
        valueField: 'TaskTypeID',
        textField: 'Name',
        addItemEndpoint: '/api/TasksDashboardAPI/AddTaskType',
        autocompleteEndpoint: '/api/TasksDashboardAPI/TaskTypeAutocomplete',
        listPull: 'pull-right'
    };

    self.externalContact = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.externalCompany()
            },
            message: 'Please provide a contact'
        },
        charsRemaining: {
            maxLength: 200,
            elementId: '#edit-external-contact'
        }
    });

    self.externalReference = ko.observable().extend({
        charsRemaining: {
            maxLength: 50,
            elementId: '#edit-external-reference'
        }
    });

    self.externalPhone = ko.observable().extend({
        charsRemaining: {
            maxLength: 20,
            elementId: '#edit-external-phone'
        }
    });

    self.externalEmail = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.externalCompany()
            },
            message: 'Please provide an email'
        },
        email: {
            params: true,
            message: 'Invalid email format'
        },
        charsRemaining: {
            maxLength: 256,
            elementId: '#edit-external-email'
        }
    });

    self.lastModifiedDt = ko.observable();
    self.taskDue = ko.observable();
    self.ownerDescription = ko.observable().extend({
        required: {
            params: true,
            onlyIf: function () { return self.perspective == 'owner' },
            message: 'Please specify a type'
        },
        charsRemaining: {
            maxLength: 100,
            elementId: '.owner-description'
        }
    });
    self.ownerExternalCompany = ko.observable();
    self.ownerMemberId = ko.observable().extend({
        required: {
            params: true,
            message: 'You must assign this task'
        }
    });
    self.ownerMember = ko.observable();
    self.schedule = ko.observable();
    self.assignmentHistory = ko.observable();
    self.taskDues = ko.observable();
    self.urgent = ko.observable();
    self.uid = null;
    self.ownerWidget = ko.observable();

    self.ownerSettings = {
        controlName: 'Owner',
        dataTextField: 'Name',
        dataValueField: 'MemberID',
        leafDataField: 'MemberID',
        selectAnyNode: false,
        widget: self.ownerWidget,
        value: self.ownerMemberId,
        data: self.parent.createEmployeeHierarchicalDataSource(),
        selectable: true,
        valuePrimitive: true,
        autoWidth: true,
        height: 'auto',
        placeholder: 'Please select',
        autoClose: false,
        filter: 'contains',
        open: function (e) {
            e.sender.filterInput.val('');
            e.sender.dataSource.filter({});
            e.sender.treeview.dataSource.filter({});
            e.sender.treeview.dropdowntree._prev = '';
            e.sender.search('');
            e.sender.treeview.collapse('.k-item');
        },
        select: function (e) {
            if (e.sender.dropdowntree.value() != '') {
                var item = e.sender.dataSource.getByUid(e.node.dataset.uid);
                if (item.hasOwnProperty(e.sender.dropdowntree.options.leafDataField)) {
                    e.sender.dropdowntree.close();
                } else {
                    e.preventDefault();
                    e.sender.dropdowntree.treeview.toggle(e.node);
                }
            } else {
                self.ownerMemberId(undefined);
            }
        }
    };

    self.errors = ko.validation.group([
        self.ownerDescription,
        self.owner
    ]);

    self.externalCompany.extend({
        required: {
            params: true,
            onlyIf: function () {
                return self.externalContact() ||
                    self.externalReference() ||
                    self.externalPhone() ||
                    self.externalEmail()
            },
            message: 'You must specify a Company'
        }
    });

    self.externalAssignmentErrors = ko.validation.group([
        self.externalCompany,
        self.externalStatus,
        self.externalContact,
        self.externalEmail
    ]);

    self.showExternalAssignmentModal = function () {
        $("#edit-external-assignment-modal").modal('show');
    }

    self.load = function (data, id) {
        var task = null;
        if (data) {
            task = data;
        } else if (getPreloaded()) {
            task = getPreloaded();
        } else if (id) {
            if (self.parent.hasOwnProperty('taskGridWidget')) {
                task = self.parent.taskGridWidget().dataSource.get(id);
            }
        }

        if (task) {
            self.fastLoad(task);
        }
    }

    self.fastLoad = function (data) {

        console.log('taskEdit load', data);

        var task = data.Task;

        self.taskDue(data);
        self.taskId(task.TaskID);
        self.taskDueId(data.TaskDueID);
        self.readDt(data.ReadDT);
        self.taskStatus(task.TaskStatus);
        self.author(task.Author);
        self.authorDescription(task.AuthorDescription);
        self.chases(task.Chases);
        self.comments(task.Comments);
        self.core(task.Core);
        self.createdDt(task.CreatedDT);
        self.currentAssignment(task.CurrentAssignment);
        self.expectedDelivery(data.ExpectedDeliveryDT);
        self.externalCompany(task.OwnerExternalCompany || undefined);
        self.externalContact(task.ExternalContact || undefined);
        self.externalEmail(task.ExternalEmail || undefined);
        self.externalPhone(task.ExternalPhone || undefined);
        self.externalReference(task.ExternalReference || undefined);
        self.externalStatus(task.ExternalStatus || undefined);
        self.lastModifiedDt(task.LastModifiedDT);
        self.ownerDescription(task.OwnerDescription);
        self.ownerMemberId(task.OwnerMemberID);
        self.ownerMember(task.OwnerMember);
        self.project(task.ProjectID);
        self.schedule(task.Schedule);
        self.assignmentHistory(task.TaskAssignmentHistory);
        self.taskDues(task.TaskDues);
        self.taskType(task.TaskType);

        self.attachments(task.Attachments);

        //if (self.taskType()) {
        //    window.setTimeout(function () {
        //        self.taskTypeListWidget().autocomplete(self.taskType().Name);
        //    }, 0);
        //}
        self.urgent(task.Urgent);
        self.uid = task.uid;

        var userId = getUserId();
        if (userId == task.OwnerMemberID) {
            self.perspective('owner');
        }
        if (userId == task.AuthorMemberID) {
            self.perspective('author');
        }

        if (self.project()) {
            window.setTimeout(function () {
                $("#edit-task-project").val(self.taskDue().Project.Name);
            }, 0);
        }

        window.setTimeout(function () {
            self.ownerWidget().value(self.ownerMemberId() || '');
        }, 0);

        // if you're the owner, or the owner and author, and the readDt is null
        // OR
        // if you're the newCommentTarget and the newCommentReadDT is null
        // then mark as read.
        if ((self.perspective() == 'owner' ||
            (userId == task.OwnerMemberID && userId == task.AuthorMemberID) && self.readDt() == null) ||
            (userId == data.NewCommentTargetMemberID && data.NewCommentReadDT == null) ||
            (userId == task.AuthorMemberID && data.ExpectedDeliveryChangedReadDT == null)) {
            self.markTaskAsRead();
        }
        if (self.externalCompany()) {
            self.externalCompanyListWidget().autocomplete(self.externalCompany().Name);
        }
        if (self.externalStatus()) {
            self.externalStatusListWidget().autocomplete(self.externalStatus().Name);
        }

        $("#edit-task-modal").modal('show');
    }

    self.markTaskAsRead = function () {
        $.ajax({
            url: '/api/TasksDashboardAPI/MarkTaskAsRead',
            type: 'POST',
            dataType: 'json',
            data: {
                TaskDueID: self.taskDueId()
            },
            success: function (data) {
                self.readDt(moment().format());
                if (self.parent.hasOwnProperty('taskGridWidget')) {
                    self.parent.taskGridWidget().dataSource.read();
                }
            }
        });
    }

    self.markTaskAsUnread = function () {
        $.ajax({
            url: '/api/TasksDashboardAPI/MarkTaskAsUnread',
            type: 'POST',
            dataType: 'json',
            data: {
                TaskDueID: self.taskDueId()
            },
            success: function (data) {
                self.readDt(undefined);
                if (self.parent.hasOwnProperty('taskGridWidget')) {
                    self.parent.taskGridWidget().dataSource.read();
                }
            }
        });
    }

    self.closeModal = function () {
        //if (self.perspective() === 'disallow') {
        //    self.reset();
        //    $("#edit-task-modal").modal('hide');
        //    return;
        //} else {
        //var confirm = $.confirm('Are you sure?', 'You will lose any unsaved data.', function () {
        //    self.reset();
        self.reset();
        $("#edit-task-modal").modal('hide');
        //},
        //function () {

        //});
        //}
    }

    self.closeExternalAssignmentModal = function (action) {
        if (action === 'save') {
            if (self.externalAssignmentErrors().length) {
                self.externalAssignmentErrors.showAllMessages(true);
            } else {
                self.externalAssignmentErrors.showAllMessages(false);
                $("#edit-external-assignment-modal").modal('hide');
            }
        } else {
            $("#edit-external-assignment-modal").modal('hide');
        }
    }

    self.chase = function () {
        console.log('chasing taskDueId', self.taskDueId());
        $.ajax({
            url: '/api/TasksDashboardAPI/ChaseTask',
            type: 'POST',
            dataType: 'json',
            data: {
                TaskDueID: self.taskDueId()
            },
            success: function () {
                console.log('taskDueId', self.taskDueId(), 'was chased');
                if (self.parent.hasOwnProperty('taskGridWidget')) {
                    self.parent.taskGridWidget().dataSource.read();
                }
            }
        })
        $.info('Task Chased', 'This task has been chased.', null, function () {
            self.closeModal();
        });
    }

    self.attachments = ko.observableArray([]);
    self.uploadWidget = ko.observable();
    self.uploadedFiles = ko.observableArray([]);
    self.uploadGuid = ko.observable(new Date().getTime());

    self.uploadSettings = {
        multiple: true, // because of how I'm handling isolation of temporary locations for attachments...
        // we can't allow anything except serial upload because I need the return value in order
        // to get the next upload into the correct place!
        widget: self.uploadWidget,
        async: {
            saveUrl: '/api/TasksDashboardAPI/UploadAttachments',
            removeUrl: '/api/TasksDashboardAPI/RemoveAttachments',
            autoUpload: true
        },
        upload: function (e) {
            var xhr = e.XMLHttpRequest;
            if (xhr) {
                xhr.addEventListener("readystatechange", function (e) {
                    if (xhr.readyState == 1 /* OPENED */) {
                        xhr.withCredentials = true;
                        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.BearerToken);
                        if (self.uploadGuid()) {
                            xhr.setRequestHeader("x-upload-guid", self.uploadGuid());
                        }
                    }
                });
            }
        },
        remove: function (e) {
            e.headers.withCredentials = true;
            e.headers["Authorization"] = "Bearer " + localStorage.BearerToken;
            if (self.uploadGuid()) {
                e.headers["x-upload-guid"] = self.uploadGuid();
            }
        },
        success: function (e) {
            for (var i in e.response.files) {
                self.uploadedFiles.push(e.response.files[i]);
            }
            console.log('upload success', e);
        },
        validation: {
            maxFileSize: 10485760
        }
    }

    self.removeFirmAttachment = function (data, target) {
        $.confirm('Are you sure?', 'This will remove ' + data.Name + ' from the task.', function () {
            $.ajax({
                url: '/api/TasksDashboardAPI/RemoveFirmAttachment',
                type: 'POST',
                dataType: 'json',
                data: {
                    TaskAttachmentID: data.TaskAttachmentID
                },
                success: function () {
                    self.attachments.remove(data);
                    $(target).closest('li.list-group-item').remove();
                }
            });
        }, function () {

        });
    }

    self.reset = function () {
        self.attachments([]);
        self.uploadGuid(new Date().getTime());
        self.uploadedFiles([]);
        self.uploadWidget().clearAllFiles();
        self.taskDue(undefined);
        self.taskId(undefined);
        self.taskDueId(undefined);
        self.readDt(undefined);
        self.taskStatus(undefined);
        self.author(undefined);
        self.authorDescription(undefined);
        self.chases(undefined);
        self.newComment(undefined);
        self.allCommentsExpanded(false);
        self.comments([]);
        self.completedComment(undefined);
        self.core(undefined);
        self.createdDt(undefined);
        self.currentAssignment(undefined);
        self.expectedDelivery(undefined);
        self.expectedDeliveryWidget().value(null);
        self.lastModifiedDt(undefined);
        self.ownerDescription(undefined);
        self.ownerExternalCompany(undefined);
        self.ownerMemberId(undefined);
        self.ownerMember(undefined);
        self.project(undefined);
        $("#edit-task-project").val(undefined);
        self.schedule(undefined);
        self.assignmentHistory(undefined);
        self.taskDues(undefined);
        self.taskType(undefined);
        if (self.taskTypeListWidget()) {
            self.taskTypeListWidget().autocomplete(undefined);
        }
        self.urgent(undefined);
        self.uid = null;
        self.perspective('disallow');

        self.ownerWidget().value('');
        self.ownerWidget().options.placeholder = 'Please select';

        self.errors.showAllMessages(false);

        self.resetExternalAssignmentModal();

        $("a[href='#tab-core']").tab('show');

        self.busy(false);
    }

    self.resetExternalAssignmentModal = function () {

        self.externalContact(undefined);
        self.externalReference(undefined);
        self.externalPhone(undefined);
        self.externalEmail(undefined);

        self.externalCompany(undefined);
        if (self.externalCompanyListWidget()) {
            self.externalCompanyListWidget().autocomplete(undefined);
        }

        self.availableExternalStatuses([]);
        self.externalStatus(undefined);
        if (self.externalStatusListWidget()) {
            self.externalStatusListWidget().autocomplete(undefined);
        }

        self.externalAssignmentErrors.showAllMessages(false);
    }

    self.save = function () {

        self.errors.showAllMessages(false);
        self.externalAssignmentErrors.showAllMessages(false);

        var earlyFail = false;

        if (self.errors().length) {
            self.errors.showAllMessages(true);
            earlyFail = true;
        }

        if (self.externalAssignmentErrors().length) {
            self.externalAssignmentErrors.showAllMessages(true);
            earlyFail = true;
        }

        if (earlyFail) {
            return;
        }

        var data = {
            TaskID: self.taskId(),
            TaskDueID: self.taskDueId()
        }

        var uri = '';

        switch (self.perspective()) {
            case 'owner':
            case 'author':
                data.OwnerDescription = self.ownerDescription();

                if (self.taskType()) {
                    data.TaskTypeID = self.taskType().TaskTypeID;
                }

                data.OwnerMemberID = self.ownerWidget().value();

                if (self.expectedDelivery()) {
                    data.ExpectedDelivery = moment(self.expectedDelivery()).format();
                }

                if (self.externalCompany()) {
                    data.ExternalCompanyID = self.externalCompany().ExternalCompanyID;
                }

                if (self.externalStatus()) {
                    data.ExternalStatusID = self.externalStatus().ExternalStatusID;
                }

                data.ExternalContact = self.externalContact();
                data.ExternalReference = self.externalReference();
                data.ExternalPhone = self.externalPhone();
                data.ExternalEmail = self.externalEmail();

                data.NewComment = self.newComment();

                uri = '/api/TasksDashboardAPI/UpdateTask';
                //uri = '/api/TasksDashboardAPI/OwnerUpdateTask';
                break;
            //case 'author':
            //    uri = '/api/TasksDashboardAPI/AuthorUpdateTask';
            //    break;
            default: break;
        }

        data.ProjectID = self.project();
        data.UploadGUID = self.uploadGuid();
        data.Attachments = self.uploadedFiles();
        //self.busy(true);

        $.ajax({
            url: uri,
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                //self.busy(false);
                //$("#latest-task-id").html('Save successful: ' + data.TaskID);
                self.reset();
                $("#edit-task-modal").modal('hide');
                if (self.parent.hasOwnProperty('taskGridWidget')) {
                    self.parent.taskGridWidget().dataSource.read();
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //self.busy(false);
                $.showError(xhr, textStatus, errorThrown);
            }
        });
    }

    self.completeTask = function () {
        $.confirm('Complete Task', 'The task creator will be notified that you have completed this task. Are you sure?', function () {

            self.busy(true);

            $.ajax({
                url: '/api/TasksDashboardAPI/CompleteTask',
                type: 'POST',
                dataType: 'json',
                data: {
                    TaskDueID: self.taskDue().TaskDueID
                },
                success: function (data) {
                    self.busy(false);
                    self.reset();
                    $("#edit-task-modal").modal('hide');
                    if (self.parent.hasOwnProperty('taskGridWidget')) {
                        self.parent.taskGridWidget().dataSource.read();
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    self.busy(false);
                }
            });
        }, function () {

        });
    }
}