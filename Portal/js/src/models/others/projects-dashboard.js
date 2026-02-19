var projectsDashboardViewModel = function () {
    var self = this;

    self.projectDashboard = ko.observable();

    self.projectGridWidget = ko.observable();

    self.loadingBusy = ko.observable(false);

    self.projectGridBusy = ko.observable(false);

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

    self.projectFactory = new projectFactoryViewModel(self);

    self.newTaskFactory = new newTaskFactoryViewModel(self);

    self.newTaskFactory.project({
        Name: self.projectFactory.name(),
        Readonly: true
    });

    self.taskEdit = new taskEditViewModel(self);

    self.projectGridDataSourceRead = function (options) {

        var data = {};

        var webapi = new kendo.data.transports.webapi({ prefix: '' });
        var params = webapi.parameterMap(options.data);

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        //data.showCompleted = self.preFilters.showCompleted();

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

        //console.log('calling ProjectDashboard with', data);

        $.ajax({
            url: '/api/ProjectsDashboardAPI/ProjectDashboard',
            type: "GET",
            data: data,
            success: function (data) {
                console.log('ProjectDashboard returned', data);
                self.projectDashboard(data);
            }
        });

        console.log('calling ProjectGrid with', data);

        $.ajax({
            url: '/api/ProjectsDashboardAPI/ProjectGrid',
            type: "GET",
            data: data,
            success: function (data) {
                console.log('ProjectGrid returned', data);
                options.success(data);
            },
            error: function (data) {
                console.log(data);
                options.error();
            }
        });
    }

    self.projectGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.projectGridDataSourceRead
        },
        pageSize: 10,
        serverPaging: true,
        serverSorting: true,
        serverFiltering: false,
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
        requestStart: function (e) {
            self.projectGridBusy(true);
        },
        requestEnd: function (e) {
            self.projectGridBusy(false);
        }
    });

    self.projectGridSettings = {
        autoBind: true,
        widget: self.projectGridWidget,
        data: self.projectGridDataSource,
        useKOTemplates: true,
        rowTemplate: 'grid-row-template',
        scrollable: true,
        columns: [{
            field: 'OwnerMemberID',
            title: 'Assigned To',
            filterable: {
                extra: false,
                ui: self.memberFilter
            }
        }],
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

        },
        dataBound: function (e) {

        },
        filterMenuInit: function (e) {
            console.log(e);
            if (
                e.field == 'OwnerMemberID'
            ) {
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
            if (self.projectGridWidget()) {
                // why is it still... behaving as though it's tied to the preFilters if this
                // line is commented out?!
                //self.projectGridWidget().dataSource.read();
            }
        }
    }, self).extend({
        rateLimit: {
            timeout: 500,
            method: 'notifyWhenChangesStop'
        }
    });

    self.openModalCreate = function () {
        $('a[href="#tab-details"]').tab('show');
        $('#project-modal').modal('show');
    }
}


































var preFiltersViewModel = function (parent) {
    var self = this;

    self.clearFilters = function () {
        self.projectCategorySlicer().value('');
        self.tradeMarketSlicer().value('');
        self.countrySlicer().value('');
        self.ownerMemberSlicer().value('');
        self.parent.projectGridWidget().dataSource.filter("");
    }

    self.showCompleted = function () {
        return false;
    }

    self.parent = parent;

    self.busy = ko.observable();

    self.projectCategorySlicer = ko.observable();
    self.tradeMarketSlicer = ko.observable();
    self.countrySlicer = ko.observable();

    self.ownerMember = ko.observable(getUserId());
    self.ownerMemberSlicer = ko.observable();
    self.ownerMemberSlicerDataSource = self.parent.createEmployeeHierarchicalDataSource();

    self.projectCategory = ko.observable();
    self.tradeMarket = ko.observable();
    self.country = ko.observable();

    self.projectCategorySettings = {
        dataValueField: 'ProjectCategoryID',
        dataTextField: 'Name',
        widget: self.projectCategorySlicer,
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
                        url: '/api/ProjectsDashboardAPI/GetProjectCategories',
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
        value: self.projectCategory,
        autoWidth: false,
        autoBind: false,
        optionLabel: 'Please select'
    };

    self.tradeMarketSettings = {
        dataValueField: 'TradeMarketID',
        dataTextField: 'Name',
        widget: self.tradeMarketSlicer,
        data: new kendo.data.DataSource({
            serverFiltering: false,
            serverSorting: false,
            serverGrouping: false,
            transport: {
                read: function (options) {
                    var webapi = new kendo.data.transports.webapi({ prefix: "" });
                    var mapped = webapi.parameterMap(options.data);
                    var data = {};
                    for (var propertyName in mapped) {
                        data[propertyName] = mapped[propertyName];
                    }
                    $.ajax({
                        url: '/api/ProjectsDashboardAPI/GetTradeMarkets',
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
        value: self.tradeMarket,
        autoWidth: true,
        autoBind: false,
        optionLabel: 'Please select',
        filter: 'contains'
    };

    self.countrySettings = {
        dataValueField: 'CountryID',
        dataTextField: 'Name',
        widget: self.countrySlicer,
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
                        url: '/api/ProjectsDashboardAPI/GetCountries',
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
        value: self.country,
        autoWidth: true,
        autoBind: false,
        optionLabel: 'Please select',
        filter: 'contains'
    };

    self.ownerMemberSettings = {
        controlName: 'OwnerMemberID',
        dataTextField: 'Name',
        dataValueField: 'MemberID',
        leafDataField: 'MemberID',
        selectAnyNode: false,
        value: self.ownerMember,
        widget: self.ownerMemberSlicer,
        data: self.ownerMemberSlicerDataSource,
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
                self.ownerMember(undefined);
            }
        }
    };

    var initialWidget = getInitialWidget();

    self.widget = ko.observable(initialWidget);

    self.setWidget = function (value, ele) {
        self.widget(value);
        $(".dash-panel").removeClass('panel-primary');
        $(ele).closest('.dash-panel').addClass('panel-primary');
    }

    var ele = null;

    switch (initialWidget) {
        case 'Preparation':
            ele = $('#dash-preparation');
            break;
        case 'Specification':
            ele = $('#dash-specification');
            break;
        case 'Quote':
            ele = $('#dash-quote');
            break;
        case 'Order':
            ele = $('#dash-order');
            break;
        case 'Lost':
            ele = $('#dash-lost');
            break;
        default:
            initialWidget = 'All';
            ele = $('#dash-all');
            break;
    }

    self.setWidget(initialWidget, ele);

    self.slicerCollection = [
        self.projectCategorySettings,
        self.tradeMarketSettings,
        self.countrySettings,
        self.ownerMemberSettings,
        {
            controlName: 'Widget',
            widget: self.widget
        }
    ];

    self.firstTime = true;

    self.foo = ko.computed(function () {
        var projectCategory = self.projectCategory();
        var tradeMarket = self.tradeMarket();
        var country = self.country();
        var ownerMember = self.ownerMember();
        var widget = self.widget();

        var d = {
            projectCategory: projectCategory,
            tradeMarket: tradeMarket,
            country: country,
            ownerMember: ownerMember,
            widget: widget
        };

        if (self.firstTime) {
            self.firstTime = false;
        } else {
            return d;
        }
    }, self).extend({
        rateLimit: {
            timeout: 0,
            method: 'notifyWhenChangesStop'
        }
    });
}









































var projectFactoryViewModel = function (parent) {
    var self = this;

    self.stakeholderFactory = new projectStakeholderFactoryViewModel();

    self.projectId = ko.observable();

    self.parent = parent;

    self.busy = ko.observable(false);

    self.currentStage = ko.observable();

    self.initialStageInformation = {
        currentStage: self.currentStage,
        projectStages: [{
            StageID: 1,
            Description: 'Preparation'
        }, {
            StageID: 2,
            Description: 'Specification'
        }, {
            StageID: 3,
            Description: 'Quote'
        }, {
            StageID: 4,
            Description: 'Order'
        }]
    }

    self.stageInformation = ko.observable({
        currentStage: ko.observable(1),
        projectStages: [{
            StageID: 1,
            Description: 'Preparation'
        }, {
            StageID: 2,
            Description: 'Specification'
        }, {
            StageID: 3,
            Description: 'Quote'
        }, {
            StageID: 4,
            Description: 'Order'
        }]
    });

    self.name = ko.observable(null).extend({
        required: {
            params: true,
            message: 'Please provide a Project Name'
        },
        charsRemaining: {
            maxLength: 100,
            elementId: '#project-name'
        }
    });

    self.description = ko.observable(null).extend({
        charsRemaining: {
            maxLength: 2000,
            elementId: '#project-description'
        }
    });

    self.ownerMember = ko.observable(getUserId()).extend({
        required: {
            params: true,
            message: 'Please assign this Project'
        }
    });
    self.ownerMemberSlicer = ko.observable();
    self.ownerMemberSlicerDataSource = self.parent.createEmployeeHierarchicalDataSource();
    self.ownerMemberSettings = {
        controlName: 'AssignedToMemberID',
        dataTextField: 'Name',
        dataValueField: 'MemberID',
        leafDataField: 'MemberID',
        selectAnyNode: false,
        value: self.ownerMember,
        widget: self.ownerMemberSlicer,
        data: self.ownerMemberSlicerDataSource,
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
                self.ownerMember(undefined);
            }
        }
    };

    self.competitors = ko.observableArray([]);
    self.competitorListWidget = ko.observable();
    self.competitorGridWidget = ko.observable();

    var preList = getAvailableCompetitors();
    var actualList = [];
    for (var i in preList) {
        actualList.push(new competitor(preList[i], {
            parentList: self.competitors,
            parentGridWidget: self.competitorGridWidget
        }));
    }

    self.loadCompetitors = function (arr) {
        for (var i in arr) {
            self.competitors.push(new competitor(arr[i], {
                parentList: self.competitors,
                parentGridWidget: self.competitorGridWidget
            }));
        }
    }

    self.availableCompetitors = ko.observableArray(actualList);

    self.competitorListParams = {
        widget: self.competitorListWidget,
        name: 'competitorList',
        displayName: 'Competitors',
        labelClass: 'project-label',
        controlClass: 'project-control-wide',
        dataFieldName: 'CompetitorID',
        displayList: true,
        displayTagContainer: false,
        itemsList: self.availableCompetitors,
        autocompleteMaxLength: 100,
        autocompleteElementId: 'project-competitor',
        target: self.competitors,
        additionalData: {},
        valueField: 'CompetitorID',
        textField: 'Name',
        addItemEndpoint: '/api/ProjectsDashboardAPI/AddProjectCompetitor',
        autocompleteEndpoint: '/api/ProjectsDashboardAPI/ProjectCompetitorAutocomplete',
        listPull: 'pull-right',
        customSelectFunction: function (value, event) {
            var listItem = Enumerable.From(self.availableCompetitors()).Where(function (x) {
                return x.CompetitorID == value.CompetitorID;
            }).SingleOrDefault();

            // is this item already in the list of available competitors?
            if (listItem) {
                // yes? great.
            } else {
                // no? well, it needs to be.
                self.availableCompetitors.push(value);
            }

            var extantCompetitor = Enumerable.From(self.competitors()).Where(function (x) {
                return x.CompetitorID == value.CompetitorID;
            }).SingleOrDefault();

            if (extantCompetitor) {
                // already in our grid, noop.
            } else {
                // not yet added to grid, create and push.
                self.competitors.push(new competitor(value, {
                    parentList: self.competitors,
                    parentGridWidget: self.competitorGridWidget
                }));
            }

            this.autocomplete(undefined);
            this.newItem(false);
            return false;
        }
    };
    self.competitorGridSettings = {
        autoBind: true,
        widget: self.competitorGridWidget,
        data: self.competitors,
        useKOTemplates: true,
        rowTemplate: 'competitor-row-template',
        detailTemplate: 'competitor-detail-template',
        detailInit: function (e) {
            e.sender.options.dataBound(e);
        },
        columns: [{
            field: 'Name',
            title: 'Competitor',
        }],
        dataBound: function (e) {
            //e.sender.expandRow($('#competitor-grid').find('tr.k-master-row'));
        },
        sortable: true,
        scrollable: false,
        filterable: false,
        groupable: false,
        serverSorting: false,
        serverGrouping: false,
        pageable: false,
        selectable: false
    };

    self.tags = ko.observableArray([]);
    self.tagListWidget = ko.observable();
    self.availableTags = ko.observableArray(getAvailableTags());
    self.tagListParams = {
        widget: self.tagListWidget,
        name: 'tagList',
        displayName: 'Tags',
        labelClass: 'project-label',
        controlClass: 'project-control-wide',
        dataFieldName: 'TagID',
        itemsList: self.availableTags,
        autocompleteMaxLength: 50,
        autocompleteElementId: 'project-tag',
        target: self.tags,
        additionalData: {},
        valueField: 'TagID',
        textField: 'Name',
        addItemEndpoint: '/api/ComponentAPI/AddTag',
        autocompleteEndpoint: '/api/ComponentAPI/TagAutocomplete',
        listPull: 'pull-right'
    };

    self.tagListWidget.subscribe(function (newValue) {
        if (newValue) {
            self.attachValidation();
        }
    });

    self.availableProjectCategories = ko.observableArray(getAvailableProjectCategories());
    self.projectCategory = ko.observable();
    self.projectCategoryListWidget = ko.observable();
    self.projectCategoryListParams = {
        widget: self.projectCategoryListWidget,
        controlClass: 'project-control-wide',
        name: 'projectCategoryList',
        itemsList: self.availableProjectCategories,
        autocompleteMaxLength: 200,
        autocompleteElementId: 'project-categories',
        target: self.projectCategory,
        additionalData: {},
        valueField: 'ProjectCategoryID',
        textField: 'Name',
        addItemEndpoint: '/api/ProjectsDashboardAPI/AddProjectCategory',
        autocompleteEndpoint: '/api/ProjectsDashboardAPI/ProjectCategoryAutocomplete',
        listPull: 'pull-right'
    };

    self.country = ko.observable();
    self.countrySlicer = ko.observable();
    self.countrySettings = {
        dataValueField: 'CountryID',
        dataTextField: 'Name',
        widget: self.countrySlicer,
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
                        url: '/api/ProjectsDashboardAPI/GetCountries',
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
        value: self.country,
        autoWidth: true,
        autoBind: false,
        optionLabel: 'Please select',
        filter: 'contains'
    };

    self.tradeMarket = ko.observable();
    self.tradeMarketSlicer = ko.observable();
    self.tradeMarketSettings = {
        dataValueField: 'TradeMarketID',
        dataTextField: 'Name',
        widget: self.tradeMarketSlicer,
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
                        url: '/api/ProjectsDashboardAPI/GetTradeMarkets',
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
        value: self.tradeMarket,
        autoWidth: true,
        autoBind: false,
        optionLabel: 'Please select',
        filter: 'contains'
    };

    self.currency = ko.observable();
    self.estimatedValueWidget = ko.observable();
    self.estimatedValue = ko.observable();

    self.estimatedValueParams = {
        widget: self.estimatedValueWidget,
        value: self.estimatedValue,
        currency: self.currency,
        controlClass: 'short-control',
        placeholder: '\u2b9c  Select a Currency'
    };

    self.firstEnquiryDateWidget = ko.observable();
    self.firstEnquiryDate = ko.observable();
    self.firstEnquiryDateSettings = {
        widget: self.firstEnquiryDateWidget,
        value: self.firstEnquiryDate,
        //min: new Date(),
        footer: false
    };

    self.clearFirstEnquiryDate = function () {
        self.firstEnquiryDate(undefined);
        self.firstEnquiryDateWidget().value('');
    }

    self.expectedCompletionMonths = [
        { monthId: 1, name: 'January' },
        { monthId: 2, name: 'February' },
        { monthId: 3, name: 'March' },
        { monthId: 4, name: 'April' },
        { monthId: 5, name: 'May' },
        { monthId: 6, name: 'June' },
        { monthId: 7, name: 'July' },
        { monthId: 8, name: 'August' },
        { monthId: 9, name: 'September' },
        { monthId: 10, name: 'October' },
        { monthId: 11, name: 'November' },
        { monthId: 12, name: 'December' }
    ];

    self.expectedCompletionMonth = ko.observable();
    self.expectedCompletionYear = ko.observable().extend({
        minLength: 4
    });

    self.expectedCompletionDateWidget = ko.observable();
    self.expectedCompletionDate = ko.observable();
    self.expectedCompletionDateSettings = {
        widget: self.expectedCompletionDateWidget,
        value: self.expectedCompletionDate,
        //min: new Date(),
        footer: false
    };

    self.expectedCompletionYear.subscribe(function (newValue) {
        if (newValue) {
            self.expectedCompletionDate(undefined);
            self.expectedCompletionDateWidget().value('');
        }
    });

    self.expectedCompletionMonth.subscribe(function (newValue) {
        if (newValue) {
            self.expectedCompletionDate(undefined);
            self.expectedCompletionDateWidget().value('');
            window.setTimeout(function () {
                $(self.expectedCompletionYear.DOMElement).select();
            }, 0);
        }
    });

    self.expectedCompletionDate.subscribe(function (newValue) {
        if (newValue) {
            self.expectedCompletionYear(undefined);
            self.expectedCompletionMonth(undefined);
        }
    });

    self.clearExpectedCompletionDate = function () {
        self.expectedCompletionDate(undefined);
        self.expectedCompletionDateWidget().value('');
        self.expectedCompletionMonth(undefined);
        self.expectedCompletionYear(undefined);
    }

    self.notes = ko.observableArray([]);

    self.newNote = ko.observable();

    self.allNotesExpanded = ko.observable(false);

    self.allNotesExpanded.subscribe(function (newValue) {
        if (newValue) {
            $('.project-note .note-display .collapse').collapse('show');
        } else {
            $('.project-note .note-display .collapse').collapse('hide');
        }
    });

    self.attachments = ko.observableArray([]);
    self.uploadWidget = ko.observable();
    self.uploadedFiles = ko.observableArray([]);
    self.uploadGuid = ko.observable(new Date().getTime());

    self.uploadSettings = {
        multiple: true,
        widget: self.uploadWidget,
        async: {
            saveUrl: '/api/ProjectsDashboardAPI/UploadAttachments',
            removeUrl: '/api/ProjectsDashboardAPI/RemoveAttachments',
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
        $.confirm('Are you sure?', 'This will remove ' + data.Name + ' from the project.', function () {
            $.ajax({
                url: '/api/ProjectsDashboardAPI/RemoveFirmAttachment',
                type: 'POST',
                dataType: 'json',
                data: {
                    ProjectAttachmentID: data.ProjectAttachmentID
                },
                success: function () {
                    self.attachments.remove(data);
                    $(target).closest('li.list-group-item').remove();
                }
            });
        }, function () {

        });
    }

    self.taskDues = ko.observableArray([]);

    self.showAddTask = function () {
        if (self.projectId()) {
            $("#new-task-modal").modal('show');
        } else {
            $.info('Please save first', 'Please save before adding Tasks to Projects');
        }
    }

    self.detailsErrors = ko.validation.group([
        self.name,
        self.dueDate,
        self.ownerMember
    ]);

    self.classificationErrors = ko.validation.group([]);

    //self.stakeholdersErrors = ko.validation.group([]);

    self.competitorsErrors = ko.validation.group([
        self.competitors
    ], {
        deep: true,
        live: true,
        observable: true
    });

    self.notesErrors = ko.validation.group([]);

    self.attachmentsErrors = ko.validation.group([]);

    self.specificationErrors = ko.validation.group([]);

    self.quotesErrors = ko.validation.group([]);

    self.ordersErrors = ko.validation.group([]);

    self.errors = [
        self.detailsErrors,
        self.classificationErrors,
        //self.stakeholdersErrors,
        self.competitorsErrors,
        self.notesErrors,
        self.attachmentsErrors,
        self.specificationErrors,
        self.quotesErrors,
        self.ordersErrors
    ]

    self.anyErrorsShown = ko.pureComputed({
        read: function () {
            var result = false;
            for (var e in self.errors) {
                if (self.errors[e].isAnyMessageShown()) {
                    result = true;
                }
            }
            return result;
        }
    }, self);

    self.closeModal = function () {
        if (self.isDirty()) {
            $.confirm('You have unsaved changes', 'Any unsaved changes will be lost.', function () {
                self.reset();
                $('a[href="#tab-details"]').tab('show');
                $("#project-modal").modal('hide');
            }, function () {

            });
        } else {
            self.reset();
            $('a[href="#tab-details"]').tab('show');
            $("#project-modal").modal('hide');
        }
    }

    self.getCompetitors = function () {
        var competitors = [];

        var comp = self.competitors();

        for (var i in comp) {
            var quotes = comp[i].productQuotes();
            var quoteData = [];
            for (var j in quotes) {
                quoteData.push(ko.toJS(quotes[j].data));
            }
            var c = {
                CompetitorID: comp[i].CompetitorID,
                ProductQuotes: quoteData
            }
            competitors.push(c);
        }

        return competitors;
    }

    self.saveProject = function () {

        console.log('saveProject called');

        var earlyFail = false;

        for (var e in self.errors) {
            self.errors[e].showAllMessages(false);
            if (self.errors[e]().length) {
                self.errors[e].showAllMessages(true);
                earlyFail = true;
            }
        }

        if (earlyFail) {
            return;
        }

        var data = {
            ProjectID: self.projectId(),
            Name: self.name(),
            Description: self.description(),
            ProjectCategoryID: self.projectCategory() ? self.projectCategory().ProjectCategoryID : null,
            CountryID: self.country() ? self.country() : null,
            OwnerMemberID: self.ownerMember(),
            CurrencyID: self.currency() ? self.currency().CurrencyID : null,
            EstimatedValue: self.estimatedValue() ? self.estimatedValue() : null,
            FirstEnquiryDate: self.firstEnquiryDate() ? moment(self.firstEnquiryDate()).format() : null,
            ExpectedCompletionYear: self.expectedCompletionYear() ? self.expectedCompletionYear() : null,
            ExpectedCompletionMonth: self.expectedCompletionMonth() ? self.expectedCompletionMonth().monthId : null,
            ExpectedCompletionDate: self.expectedCompletionDate() ? moment(self.expectedCompletionDate()).format() : null,
            TradeMarketID: self.tradeMarket() ? self.tradeMarket() : null,
            Tags: self.tags(),
            Stakeholders: self.stakeholderFactory.stakeholders(),
            Competitors: self.getCompetitors() || [],
            Note: self.newNote(),
            Attachments: self.uploadedFiles() || [],
            UploadGUID: self.uploadGuid()
        };

        console.log('saveProject sending', data);

        // these are now html strings, not jquery objects...
        //for (var i in data.Stakeholders) {
        //    if (data.Stakeholders[i].Address) {
        //        if (data.Stakeholders[i].Address.hasOwnProperty('displayBlock'))
        //            delete data.Stakeholders[i].Address.displayBlock;
        //        if (data.Stakeholders[i].Address.hasOwnProperty('displayLine'))
        //            delete data.Stakeholders[i].Address.displayLine;
        //    }
        //}

        self.busy(true);

        $.ajax({
            url: '/api/ProjectsDashboardAPI/SaveProject',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                self.busy(false);
                self.reset();
                $("#project-modal").modal('hide');
                self.parent.projectGridWidget().dataSource.read();
            },
            error: function (xhr, textStatus, errorThrown) {
                self.busy(false);
                $.showError(xhr, textStatus, errorThrown);
            }
        });
    }

    self.loadProject = function (project) {
        console.log('loadProject called', project);

        $('a[href="#tab-details"]').tab('show');

        //self.stageInformation(undefined);
        self.projectId(project.ProjectID);
        self.name(project.Name);
        self.description(project.Description);
        self.ownerMember(project.OwnerMemberID);
        self.loadCompetitors(project.ProjectCompetitors);

        var tags = [];
        for (var i in project.Tags) {
            var t = Enumerable.From(self.availableTags()).Where(function (item) {
                return item.TagID == project.Tags[i].TagID;
            }).SingleOrDefault();
            if (t) {
                tags.push(t);
            }
        }
        self.tags(tags);

        self.taskDues(project.TaskDues);

        self.projectCategory(project.ProjectCategory);
        self.projectCategoryListWidget().autocomplete(project.ProjectCategory.Name);

        self.country(project.CountryID);
        self.countrySlicer().dataSource.filter('');
        self.estimatedValue(project.EstimatedValue);
        self.currency(project.Currency);
        self.tradeMarket(project.TradeMarketID);
        self.tradeMarketSlicer().dataSource.filter('');
        self.clearFirstEnquiryDate();
        self.clearExpectedCompletionDate();
        self.firstEnquiryDate(project.FirstEnquiryDate);
        self.expectedCompletionMonth(project.ExpectedCompletionMonth);
        self.expectedCompletionYear(project.ExpectedCompletionYear);
        self.expectedCompletionDate(project.ExpectedCompletionDate);
        self.notes(project.ProjectNotes);
        self.newNote(undefined);
        self.allNotesExpanded(false);
        self.attachments(project.Attachments);

        var stakeHolders = [];
        for (var i in project.ProjectStakeholders) {
            self.stakeholderFactory.loadStakeholder(project.ProjectStakeholders[i], false, false);
            var s = self.stakeholderFactory.save();
            stakeHolders.push(s);
            self.stakeholderFactory.reset();
        }
        self.stakeholderFactory.stakeholders(stakeHolders);

        self.uploadGuid(new Date().getTime());
        self.uploadedFiles([]);
        self.lostComment(project.LostComment);

        self.cleanDirty();

        $("#project-modal").modal('show');
    }

    self.showLostModal = function () {
        self.projectLostErrors.showAllMessages(false);
        $("#project-lost-modal").modal('show');
    }

    self.closeLostModal = function () {
        self.lostComment(undefined);
        self.projectLostErrors.showAllMessages(false);
        $("#project-lost-modal").modal('hide');
    }

    self.lostComment = ko.observable().extend({
        required: {
            params: true,
            message: 'Please provide a reason'
        },
        charsRemaining: {
            maxLength: 500,
            elementId: '#lost-comment'
        }
    });

    self.projectLostErrors = ko.validation.group([
        self.lostComment
    ]);

    self.markProjectAsLost = function () {
        self.projectLostErrors.showAllMessages(false);
        if (self.projectLostErrors().length) {
            self.projectLostErrors.showAllMessages(true);
            return;
        } else {
            $.ajax({
                url: '/api/ProjectsDashboardAPI/MarkProjectLost',
                type: 'POST',
                dataType: 'json',
                data: {
                    ProjectID: self.projectId(),
                    Comment: self.lostComment()
                },
                success: function () {
                    $("#project-lost-modal").modal('hide');
                    $("#project-modal").modal('hide');
                    self.reset();
                }
            });
        }
    }


    self.showCompletedModal = function () {
        self.projectCompletedErrors.showAllMessages(false);
        $("#project-completed-modal").modal('show');
    }

    self.closeCompletedModal = function () {
        self.completedComment(undefined);
        self.projectCompletedErrors.showAllMessages(false);
        $("#project-completed-modal").modal('hide');
    }

    self.completedComment = ko.observable().extend({
        required: {
            params: true,
            message: 'Please provide a comment'
        },
        charsRemaining: {
            maxLength: 500,
            elementId: '#completed-comment'
        }
    });

    self.projectCompletedErrors = ko.validation.group([
        self.completedComment
    ]);

    self.markProjectAsCompleted = function () {
        self.projectCompletedErrors.showAllMessages(false);
        if (self.projectCompletedErrors().length) {
            self.projectCompletedErrors.showAllMessages(true);
            return;
        } else {
            $.ajax({
                url: '/api/ProjectsDashboardAPI/MarkProjectCompleted',
                type: 'POST',
                dataType: 'json',
                data: {
                    ProjectID: self.projectId(),
                    Comment: self.completedComment()
                },
                success: function () {
                    $("#project-completed-modal").modal('hide');
                    $("#project-modal").modal('hide');
                    self.reset();
                }
            });
        }
    }

    self.reset = function () {
        console.log('projectFactory reset called');
        self.busy(false);
        //self.stageInformation(undefined);
        self.projectId(undefined);
        self.name(null);
        self.description(null);
        self.ownerMember(getUserId());
        self.competitors([]);
        //self.competitorQuotes([]);
        self.tags([]);
        //self.stakeholders([]);
        self.taskDues([]);
        self.projectCategory(undefined);
        self.projectCategoryListWidget().autocomplete(undefined);

        self.country(undefined);
        //self.countrySlicer().value('');
        self.countrySlicer().dataSource.filter('');
        self.estimatedValue(undefined);
        self.currency(undefined);
        self.tradeMarket(undefined);
        self.tradeMarketSlicer().value('');
        self.tradeMarketSlicer().dataSource.filter('');
        self.clearFirstEnquiryDate();
        self.clearExpectedCompletionDate();
        self.notes([]);
        self.newNote(undefined);
        self.allNotesExpanded(false);
        self.attachments([]);
        self.stakeholderFactory.stakeholders([]);
        self.stakeholderFactory.reset();
        self.uploadGuid(new Date().getTime());
        self.uploadedFiles([]);
        self.uploadWidget().clearAllFiles();
        self.lostComment(undefined);
        self.completedComment(undefined);

        for (var e in self.errors) {
            self.errors[e].showAllMessages(false);
        }
    }

    self.attachValidation = function () {
        console.log('projectFactory: attaching validation...');

        self.ownerMemberSlicer().wrapper.children().first().attr('data-bind', 'validationCore: ownerMember');
        //self.projectStatusSlicer().wrapper.children().first().attr('data-bind', 'validationCore: projectStatus');

        //self.assignedToWidget().wrapper.children().first().attr('data-bind', 'validationCore: assignedTo');
        //// calling cleanNode on this element has the unfortunate side effect of preventing some of kendo's
        //// functionality: name .k-state-hover does not get applied to the .k-dropdown-wrap.k-state-default
        //// span. Fortunately I don't actually need to call cleanNode on it; it's injected by kendo's library
        //// and hasn't yet been tickled by knockout! woop!
        ////ko.cleanNode(self.assignedToWidget().wrapper.children().first()[0]);
        ko.applyBindings(self, self.ownerMemberSlicer().wrapper.children().first()[0]);
        //ko.applyBindings(self, self.projectStatusSlicer().wrapper.children().first()[0]);

        self.newNote.extend({
            charsRemaining: {
                maxLength: 2000,
                elementId: '.project-note'
            }
        })
    }

    // Change tracking...


    self.projectDetailsData = {
        name: self.name,
        description: self.description,
        category: self.projectCategory,
        location: self.country,
        //owner: self.ownerMember,
        //estimatedValue: self.estimatedValue,
        firstEnquiry: self.firstEnquiryDate,
        expectedCompletion: self.expectedCompletionDate,
        expectedCompletionMonth: self.expectedCompletionMonth
    };

    self.classificationData = {
        market: self.tradeMarket,
        tags: self.tags
    };

    self.stakeholderDirt = ko.computed(function () {
        var result = {
            count: self.stakeholderFactory.stakeholders().length
        };
        return result;
    });

    self.competitorDirt = ko.computed(function () {
        var result = {
            count: self.competitors().length
        };
        ko.utils.arrayForEach(self.competitors(), function (item) {
            result[item.CompetitorID] = item.isDirty()
        });
        return result;
    }, self);

    self.noteDirt = ko.computed(function () {
        var result = {
            count: self.notes().length
        };
        return result;
    }, self);

    self.dirtyDetails = new ko.dirtyFlag(self.projectDetailsData);
    self.dirtyClassification = new ko.dirtyFlag(self.classificationData);
    self.dirtyStakeholders = new ko.dirtyFlag(self.stakeholderDirt);
    self.dirtyCompetitors = new ko.dirtyFlag(self.competitorDirt);
    self.dirtyNotes = new ko.dirtyFlag(self.noteDirt);

    self.cleanDirty = function () {
        self.dirtyDetails.reset();
        self.dirtyClassification.reset();
        self.dirtyStakeholders.reset();
        self.dirtyCompetitors.reset();
        self.dirtyNotes.reset();
    }

    self.isDirty = ko.computed(function () {
        return self.dirtyDetails.isDirty() ||
            self.dirtyClassification.isDirty() ||
            self.dirtyStakeholders.isDirty() ||
            self.dirtyCompetitors.isDirty() ||
            self.dirtyNotes.isDirty()
    });
}
































var competitor = function (data, params) {
    var self = this;

    self.parentList = params.parentList;
    self.parentGrid = params.parentGridWidget;

    self.CompetitorID = data.CompetitorID;
    self.Name = data.Name;
    self.productQuotes = ko.observableArray([]);

    self.loadQuotes = function (arr) {
        var quotes = [];
        for (var i in arr) {
            var quote = new competitorProductQuote(arr[i], self.productQuotes);
            quotes.push(quote);
        }
        self.productQuotes(quotes);
    }

    if (data.Quotes) {
        self.loadQuotes(data.Quotes);
    }

    self.gridWidget = ko.observable();

    self.errors = ko.validation.group([
        self.productQuotes
    ], {
        deep: true,
        live: true,
        observable: true
    });

    self.gridSettings = {
        autoBind: true,
        widget: self.gridWidget,
        data: self.productQuotes,
        useKOTemplates: true,
        rowTemplate: 'competitor-product-quote-row-template',
        columns: [{
            field: 'ProductName',
            title: 'Product Name'
        }, {
            field: 'ProductCode',
            title: 'Product Code'
        }, {
            field: 'Quantity',
            title: 'Quantity',
            width: 100
        }, {
            field: 'Price',
            title: 'Price'
        }, {
            field: 'Comment',
            title: 'Comments'
        }, {
            field: ' ',
            title: ' ',
        }],
        sortable: false,
        selectable: false,
        scrollable: false,
        filterable: false,
        groupable: false,
        serverSorting: false,
        serverGrouping: false,
        pageable: false
    };

    self.addRow = function (event) {
        var quote = new competitorProductQuote({}, self.productQuotes);
        self.productQuotes.push(quote);

        var row = self.parentGrid().tbody.find($(event.target.closest('tr')));

        self.parentGrid().expandRow(row);

        window.setTimeout(function () {
            self.gridWidget().tbody.find('tr:last').find('td:first').find('input').focus();
        }, 100);
    };

    self.removeRow = function (competitorId, event) {
        self.productQuotes.remove(function (item) {
            return item.CompetitorID == competitorId;
        });

        self.parentList.remove(self);
    }

    self.dirtyItems = ko.computed(function () {
        return ko.utils.arrayFilter(self.productQuotes(), function (item) {
            return item.isDirty();
        })
    }, self);

    self.isDirty = ko.computed(function () {
        return self.dirtyItems().length > 0;
    });
}







// Right, competitor product quotes can now be dirty / not dirty.

var competitorProductQuote = function (params, parentArray) {
    var self = this;
    self.parentArray = parentArray;
    self.priceWidget = ko.observable();

    self.data = {
        price: ko.observable(params.Price),
        productName: ko.observable(params.ProductName).extend({
            required: {
                params: true,
                message: 'Required'
            }
        }),
        productCode: ko.observable(params.ProductCode),
        quantity: ko.observable(params.Quantity).extend({
            numberFormatted: {
                digits: 2,
                currency: { Name: 'Sterling', Code: 'GBP', FormattingCulture: 'en-GB' }
            }
        }),
        comment: ko.observable(params.Comment),
        currency: ko.observable(params.Currency),
        projectCompetitorQuoteId: params.ProjectCompetitorQuoteID
    };

    self.priceParams = {
        widget: self.priceWidget,
        value: self.data.price,
        currency: self.data.currency,
        controlClass: 'short-control',
        placeholder: '\u2b9c  Select a Currency'
    };

    self.errors = ko.validation.group([
        self.data.productName,
        self.data.productCode,
        self.data.price,
        self.data.comment
    ]);

    self.remove = function () {
        self.parentArray.remove(self);
    }

    self.dirtyFlag = new ko.dirtyFlag(self.data);

    self.isDirty = ko.computed(function () {
        return self.dirtyFlag.isDirty();
    });
}






































var projectStakeholderFactoryViewModel = function () {
    var self = this;

    self.revealForm = ko.observable(false);

    self.dummyStakeholderId = 0;

    self.autocompleteSelection = ko.observable();

    self.projectStakeholderId = undefined;

    self.availableProjectStakeholderTypes = ko.observableArray(getAvailableProjectStakeholderTypes());

    self.projectStakeholderType = ko.observable().extend({
        required: {
            params: true,
            message: 'Please select'
        }
    });

    self.projectStakeholderType.subscribe(function (newValue) {
        if (newValue) {
            self.projectStakeholderTypeListParams.widget().autocomplete(newValue.Name);
        } else {
            self.projectStakeholderTypeListParams.widget().autocomplete(undefined);
        }
    });

    self.projectStakeholderTypeListWidget = ko.observable();

    self.projectStakeholderTypeListParams = {
        widget: self.projectStakeholderTypeListWidget,
        controlClass: 'project-control-wide',
        name: 'projectStakeholderTypeList',
        itemsList: self.availableProjectStakeholderTypes,
        autocompleteMaxLength: 200,
        autocompleteElementId: 'project-stakeholder-type',
        target: self.projectStakeholderType,
        additionalData: {},
        valueField: 'ProjectStakeholderTypeID',
        textField: 'Name',
        addItemEndpoint: '/api/ProjectsDashboardAPI/AddProjectStakeholderType',
        autocompleteEndpoint: '/api/ProjectsDashboardAPI/ProjectStakeholderTypeAutocomplete',
        listPull: 'pull-right'
    };

    self.stakeholders = ko.observableArray([]);

    self.initStakeholderAutocomplete = function () {
        $('#project-stakeholder-search').autocomplete({
            appendTo: 'body',
            source: function (request, response) {
                $.ajax({
                    url: '/api/ProjectsDashboardAPI/ProjectStakeholderAutocomplete',
                    type: "POST",
                    dataType: "json",
                    data: {
                        term: request.term
                    },
                    success: function (data) {
                        response($.map(data, function (item) {
                            return {
                                label: item['Name'] || item.Data.CompanyName,
                                value: item
                            };
                        }));
                    }
                });
            },
            minLength: 1,
            select: function (event, ui) {
                $.extend(ui.item.value, ui.item.value.Data);
                $.extend(ui.item.value, ui.item.value.Contact);
                self.reset();
                self.autocompleteSelection(ui.item.value);
                self.loadStakeholder(ui.item.value, true, true);
                event.preventDefault();
                self.projectStakeholderTypeListWidget().autocomplete(undefined);
                $('#project-stakeholder-search').val(undefined);
                return false;
            },
            focus: function (event, ui) {
                return false;
            },
            autoFocus: true,
            create: function () {
                $(this).data("ui-autocomplete")._renderItem = function (ul, item) {
                    var li = $("<li>");
                    var div = li.append("<div class='ui-menu-item-wrapper'><a href='#'>" +
                        item.label + "<span class='type'>" + (item.value['Type'] == 'TRADE ACCOUNT' ? 'CUSTOMER ' + item.value['Code'] : item.value['Type']) + "</span></a></div>");
                    li.addClass(item.value['Class']);
                    return li.appendTo(ul);
                };
            }
        });
    }

    self.removeStakeholderAssociation = function () {
        self.leadId(undefined);
        self.leadContactId(undefined);
        self.memberId(undefined);
        self.tradeAccountId(undefined);
        self.autocompleteSelection(undefined);
    }

    self.initStakeholderAutocomplete();

    self.stakeholderGridWidget = ko.observable();

    self.stakeholderGridSettings = {
        autoBind: true,
        widget: self.stakeholderGridWidget,
        data: self.stakeholders,
        useKOTemplates: true,
        rowTemplate: 'stakeholder-row-template',
        columns: [{
            field: 'ProjectStakeholderType.Name',
            title: 'Type'
        }, {
            field: 'CompanyName',
            title: 'Company'
        }, {
            field: 'Name',
            title: 'Name'
        }, {
            field: 'Phone',
            title: 'Phone'
        }, {
            field: 'Email',
            title: 'Email'
        }, {
            field: 'Address',
            title: 'Address'
        }, {
            field: 'DecisionMaker',
            title: 'Decision Maker'
        }, {
            field: 'LeadID',
            title: 'Reference'
        }, {
            field: 'Website',
            title: 'Website'
        }, {
            field: ' ',
            title: ' '
        }],
        sortable: true,
        scrollable: false,
        filterable: false,
        grouping: false,
        serverSorting: false,
        serverGrouping: false,
        pageable: {
            pageSize: 10,
            pageSizes: [10, 20, 50, 100, 250, 500, 'all']
        },
        selectable: "row",
        change: function (e) {
            var selectedRow = e.sender.select();
            if (selectedRow) {
                self.loadStakeholder(e.sender.dataItem(selectedRow), false, true);
            }
        }
    };

    self.stakeholders.subscribe(function (newValues) {
        window.setTimeout(function () {
            $(function () {
                $('[data-toggle="popover"]').popover();
            })
        }, 100);
    });

    self.saveStakeholder = function () {
        var stakeholder = self.save();
        if (stakeholder) {
            // avoid duplication if this is a re-save of a stakeholder...
            // how do we know if this IS a re-save, if there is no ProjectStakeholderID...
            // hmmm.
            // well, it'll have to be... a check based on ProjectStakeholderID!
            // so: for heretofore unsaved stakeholders, we'd like to lend them the next
            // negative integer available.
            // I'll nullify negative values server side.
            var extant = Enumerable.From(self.stakeholders()).Where(function (x) {
                return x.ProjectStakeholderID == stakeholder.ProjectStakeholderID
            }).SingleOrDefault();

            if (extant) {
                self.stakeholders.remove(extant);
            }

            self.stakeholders.push(stakeholder);
        }
    }

    self.removeStakeholder = function (stakeholder) {
        console.log('removeStakeholder called for', stakeholder);
        $.confirm('Are you sure?', 'This will remove the Stakeholder.', function () {
            self.stakeholders.remove(function (x) {
                return x.ProjectStakeholderID == stakeholder.ProjectStakeholderID
            });
        }, function () {

        })
    }

    self.name = ko.observable().extend({
        required: {
            params: true,
            message: 'Please provide a Name'
        }
    });

    self.code = ko.observable();

    self.phone = ko.observable();

    self.email = ko.observable().extend({
        email: {
            params: true,
            message: 'Invalid email format'
        }
    });

    self.website = ko.observable();

    self.companyName = ko.observable();

    //  really, REALLY need to nail this address thing down into a reusable component...
    self.address = new addressViewModel({
        labelClass: 'edit-project-label',
        controlClass: '',
        propertiesToValidate: [],
        defaultCountry: 81
        //    self.addressLine1,
        //    self.country
        //],
        //addressLine1Validation: {
        //    required: {
        //        params: true,
        //        message: 'Please provide Address Line 1'
        //    }
        //},
        //countryValidation: {
        //    required: {
        //        params: true,
        //        message: 'Please select a Country'
        //    }
        //}
    });

    self.decisionMaker = ko.observable(false);

    self.memberId = ko.observable(undefined);
    self.tradeAccountId = ko.observable(undefined);
    self.leadId = ko.observable(undefined);
    self.leadContactId = ko.observable(undefined);
    self.class = null;
    self.type = null;
    self.nameOverride = null;

    self.errors = ko.validation.group([
        self.name,
        self.projectStakeholderType,
        self.address
    ], {
        deep: true
    });

    self.loadStakeholder = function (stakeholder, fromAutocomplete, showModal) {

        console.log('loadStakeholder called for', stakeholder);

        self.projectStakeholderId = stakeholder.ProjectStakeholderID;
        self.memberId(stakeholder.MemberID);
        self.tradeAccountId(stakeholder.TradeAccountID);
        self.leadId(stakeholder.LeadID);
        self.class = stakeholder.Class;
        self.type = stakeholder.Type;
        self.code(stakeholder.Code);
        self.phone(stakeholder.Phone);
        self.email(stakeholder.Email);
        self.website(stakeholder.Website);
        self.companyName(stakeholder.CompanyName);
        self.decisionMaker(stakeholder.DecisionMaker);
        self.leadContactId(stakeholder.LeadContactID);
        self.nameOverride = stakeholder.NameOverride;

        if (stakeholder.ProjectStakeholderType) {
            self.projectStakeholderType(stakeholder.ProjectStakeholderType);
        }

        if (stakeholder.TradeAccount != null) {
            self.code(stakeholder.TradeAccount.Code);
            self.nameOverride = stakeholder.TradeAccount.Name;
        }

        if (fromAutocomplete) {
            if (stakeholder.Type != 'TRADE ACCOUNT') {
                self.name(stakeholder.Name);
            }
        } else {
            self.name(stakeholder.Name);
            if (self.memberId() || self.tradeAccountId() || self.leadId()) {
                var auto = {
                    Type: self.type,
                    Class: self.class,
                    Name: self.name(),
                    Code: self.code()
                };
                if (self.nameOverride) {
                    auto.Name = self.nameOverride;
                }
                self.autocompleteSelection(auto);
            }
        }

        if (stakeholder.Address)
            self.address.load(stakeholder.Address);

        self.errors.showAllMessages(false);

        if (showModal) {
            self.revealForm(true);
            $("#project-stakeholder-modal").modal('show');
        }

        if (showModal || fromAutocomplete) {
            window.setTimeout(function () {
                $(self.projectStakeholderTypeListParams.widget().autocomplete.DOMElement).focus();
            }, 500);
        }
    }

    self.reset = function () {
        //self.stakeholders([]);
        self.revealForm(false);
        self.projectStakeholderId = undefined;
        self.projectStakeholderType(undefined);
        $('#project-stakeholder-search').val(undefined);
        self.name(undefined);
        self.phone(undefined);
        self.email(undefined);
        self.code(undefined);
        self.website(undefined);
        self.companyName(undefined);
        self.address.reset();
        self.decisionMaker(false);
        self.memberId(undefined);
        self.tradeAccountId(undefined);
        self.leadId(undefined);
        self.leadContactId(undefined);
        self.autocompleteSelection(undefined);
        self.class = null;
        self.type = null;
        self.errors.showAllMessages(false);
    }

    self.openEmptyStakeholderModal = function () {
        self.reset();
        $("#project-stakeholder-modal").modal('show');
        window.setTimeout(function () {
            $('#project-stakeholder-search').focus();
        }, 500);
    }

    self.closeModal = function () {
        self.reset();
        $("#project-stakeholder-modal").modal('hide');
    }

    self.initLateExtenders = function () {

        self.name.extend({
            charsRemaining: {
                maxLength: 50,
                element: self.name.DOMElement
            }
        });

        self.phone.extend({
            charsRemaining: {
                maxLength: 50,
                element: self.phone.DOMElement
            }
        });

        self.email.extend({
            charsRemaining: {
                maxLength: 256,
                element: self.email.DOMElement
            }
        });

        self.website.extend({
            charsRemaining: {
                maxLength: 256,
                element: self.website.DOMElement
            }
        });

        self.companyName.extend({
            charsRemaining: {
                maxLength: 50,
                element: self.companyName.DOMElement
            }
        });
    }

    self.save = function () {
        self.errors.showAllMessages(false);
        if (self.errors().length) {
            self.errors.showAllMessages(true);
            return false;
        } else {
            var result = {
                ProjectStakeholderID: self.projectStakeholderId || (self.dummyStakeholderId -= 1),
                ProjectStakeholderType: self.projectStakeholderType(),
                Name: self.name(),
                Code: self.code(),
                Phone: self.phone(),
                Email: self.email(),
                Website: self.website(),
                CompanyName: self.companyName(),
                Address: self.address.toJS(),
                DecisionMaker: self.decisionMaker(),
                MemberID: self.memberId(),
                TradeAccountID: self.tradeAccountId(),
                LeadID: self.leadId(),
                LeadContactID: self.leadContactId(),
                Class: self.class,
                Type: self.type,
                NameOverride: self.nameOverride
            }
            self.reset();
            $("#project-stakeholder-modal").modal('hide');
            console.log(result);
            return result;
        }
    }

    self.attachValidation = function () {
        self.projectStakeholderTypeSlicer().wrapper.children().first().attr('data-bind', 'validationCore: projectStakeholderType');
        ko.applyBindings(self, self.projectStakeholderTypeSlicer().wrapper.children().first()[0]);
    }
}