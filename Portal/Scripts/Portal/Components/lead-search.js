var leadSearch = function () {
    var self = this;

    self.searchBusy = ko.observable(false);

    self.searchTerm = ko.observable();//.extend({ notify: 'always' });

    self.elementToHighlight = ko.observable("#new-lead-panel");

    self.assignedToMemberSearch = ko.observable(new memberSearch(
        '.assigned-to-pagination',
        function (member) {
            self.assignedTo(member);
            if (member) {
                self.assignedToMemberSearch().searchTerm(member.FullName);
            }
        },
        '/Component/LeadOwnerSearch', 
        false
    ));

    self.assignedToName = ko.pureComputed({
        read: function () {
            if (self.assignedTo())
                return self.assignedTo().FullName || self.assignedTo().Email;
            else
                return 'Not set';
        }
    }, self);

    self.createdByMemberSearch = ko.observable(new memberSearch('.created-by-pagination', function (member) {
        self.createdBy(member);
        if (member) {
            self.createdByMemberSearch().searchTerm(member.FullName);
        }
    }));

    self.createdByName = ko.pureComputed({
        read: function () {
            if (self.createdBy())
                return self.createdBy().FullName || self.createdBy().Email;
            else
                return 'Not set';
        }
    }, self);

    self.availableCountries = ko.observable(getAvailableCountries());

    self.availableLanguages = ko.observable(getAvailableLanguages());

    self.availableLeadSources = ko.observable(getAvailableLeadSources());

    self.dashboardBusy = ko.observable(false);

    self.availableLeadStatuses = ko.observable(getLeadStatusOptions());

    self.availableLeadTypes = ko.observable(getLeadTypeOptions());

    self.assignedTo = ko.observable();
    self.assignedTo.subscribe(function (newValue) {
        self.performSearch();
    });

    self.availableDashboardMembers = ko.observable(getAvailableDashboardMembers());

    var preselectedMember = getPreselectedDashboardUser();
    if (preselectedMember) {
        var rec = Enumerable.From(self.availableDashboardMembers()).Where("$.MemberID == " + preselectedMember.MemberID).SingleOrDefault();
        if (rec) {
            self.dashboardCreatedByOrAssignedTo = ko.observable(rec);
        } else {
            self.dashboardCreatedByOrAssignedTo = ko.observable();
        }
    } else {
        self.dashboardCreatedByOrAssignedTo = ko.observable();
    }

    var preselectedCountry = getPreselectedDashboardCountry();
    var preselectedCountryId = undefined;

    if (preselectedCountry) {
        var rec = Enumerable.From(self.availableCountries()).Where("$.CountryID == " + preselectedCountry.CountryID).FirstOrDefault();
        if (rec) {
            preselectedCountryId = rec.CountryID;
        }
    }

    self.dashboardLeadStatus = ko.observable(undefined);

    self.dashboardWidget = ko.observable('NewLeads');

    self.dashboardPeriod = ko.observable();

    self.dashboardCreatedByOrAssignedTo.subscribe(function (newValue) {
        self.dashboardSelect();
    });

    self.dashboardCountryId = ko.observable(preselectedCountryId);
    self.dashboardCountryId.subscribe(function (newValue) {
        self.dashboardSelect();
    });

    self.dashboardLeadTypeId = ko.observable();
    self.dashboardLeadTypeId.subscribe(function (newValue) {
        self.dashboardSelect();
    })

    self.dashboardSearchDistributor = ko.observable();

    self.dashboardTradeRegistrationRedirects = ko.observable(0);
    self.dashboardNew = ko.observable(0);
    self.dashboardAwaiting = ko.observable(0);
    self.dashboardActive = ko.observable(0);
    self.dashboardStagnant = ko.observable(0);
    self.dashboardMisc = ko.observable(0);
    self.dashboardLost = ko.observable(0);
    self.dashboardJunk = ko.observable(0);
    self.dashboardCreated = ko.observable(0);
    self.dashboardUnassigned = ko.observable(0);
    self.dashboardOpen = ko.observable(0);
    self.dashboardDeclined = ko.observable(0);
    self.dashboardDistributor = ko.observable(0);
    self.dashboardReviewLead = ko.observable(0);
    self.dashboardCompleteApplication = ko.observable(0);
    self.dashboardSpecifyPaymentTerms = ko.observable(0);

    self.dashboardTradeRegistrationRedirects = ko.observable(0);
    self.dashboardNewWorth = ko.observable(0);
    self.dashboardAwaitingWorth = ko.observable(0);
    self.dashboardActiveWorth = ko.observable(0);
    self.dashboardStagnantWorth = ko.observable(0);
    self.dashboardMiscWorth = ko.observable(0);
    self.dashboardLostWorth = ko.observable(0);
    self.dashboardJunkWorth= ko.observable(0);
    self.dashboardCreatedWorth = ko.observable(0);
    self.dashboardUnassignedWorth = ko.observable(0);
    self.dashboardOpenWorth = ko.observable(0);
    self.dashboardDeclinedWorth = ko.observable(0);
    self.dashboardDistributorWorth = ko.observable(0);
    self.dashboardReviewLeadWorth = ko.observable(0);
    self.dashboardCompleteApplicationWorth = ko.observable(0);
    self.dashboardSpecifyPaymentTermsWorth = ko.observable(0);
    self.dashboardTradeRegistrationRedirectsWorth = ko.observable(0);

    self.dashboardPotentialCount = ko.pureComputed({
        read: function () {
            var result = 0;
            result += self.dashboardOpen();
            //result += self.dashboardActive();
            //result += self.dashboardStagnant();
            //result += self.dashboardUnassigned();
            return result;
        }
    }, self);
    self.dashboardPotentialWorth = ko.pureComputed({
        read: function () {
            var result = 0;
            result += self.dashboardOpenWorth();
            //result += self.dashboardActiveWorth();
            //result += self.dashboardStagnantWorth();
            //result += self.dashboardUnassignedWorth();
            return formatCurrency(result, 0, getGBPCurrency().FormattingCulture, getGBPCurrency().Code);
        }
    }, self);
     
    self.haveSearched = ko.observable(false);

    self.countryId = ko.observable(preselectedCountryId);
    self.countryId.subscribe(function (newValue) {
        self.performSearch();
    });

    self.fromDate = ko.observable();
    self.fromDate.subscribe(function (newValue) {
        self.performSearch();
    });

    self.toDate = ko.observable();
    self.toDate.subscribe(function (newValue) {
        self.performSearch();
    });

    self.period = ko.observable();
    self.period.subscribe(function (newValue) {
        if (newValue != 'custom')
        self.performSearch();
    });

    self.leadStatus = ko.observable();

    self.leadStatus.subscribe(function (newValue) {
        self.performSearch();
    });

    self.leadStatusOptions = ko.observable(getLeadStatusOptions());

    self.periodOptions = ko.observable(getPeriodOptions());

    self.createdBy = ko.observable();
    self.createdBy.subscribe(function (newValue) {
        self.performSearch();
    });

    self.leadSourceId = ko.observable();
    self.leadSourceId.subscribe(function (newValue) {
        self.performSearch();
    });

    self.dashboardSelect = function (skipSearch) {
        console.log('dashboardSelect called', skipSearch);
        self.dashboardBusy(true);
        var data = {
            countryId: self.dashboardCountryId(),
            leadTypeId: self.dashboardLeadTypeId()
        }
        if (self.dashboardCreatedByOrAssignedTo()) {
            if (self.dashboardCreatedByOrAssignedTo().MemberID != null) {
                data.member = self.dashboardCreatedByOrAssignedTo();
            }
        }
        $.ajax({
            url: '/api/LeadsAPI/DashboardSelect',
            type: "POST",
            dataType: "json",
            cache: false,
            data: data,
            success: function (data) {
                console.log('dashboardSelect returned', data);
                self.dashboardTradeRegistrationRedirects(data.TradeAccountFormRedirect);
                self.dashboardNew(data.New);
                self.dashboardAwaiting(data.Awaiting);
                self.dashboardActive(data.Active);
                self.dashboardStagnant(data.Stagnant);
                self.dashboardMisc(data.Misc);
                self.dashboardLost(data.Lost);
                self.dashboardJunk(data.Junk);
                self.dashboardCreated(data.Created);
                self.dashboardUnassigned(data.Unassigned);
                self.dashboardOpen(data.Won);
                self.dashboardDeclined(data.Declined);
                self.dashboardDistributor(data.Distributor);
                self.dashboardReviewLead(data.ReviewLead);
                self.dashboardCompleteApplication(data.CompleteApplication);
                self.dashboardSpecifyPaymentTerms(data.SpecifyPaymentTerms);

                self.dashboardTradeRegistrationRedirectsWorth(data.TradeRegistrationRedirectsWorth);
                self.dashboardNewWorth(data.NewWorth);
                self.dashboardAwaitingWorth(data.AwaitingWorth);
                self.dashboardActiveWorth(data.ActiveWorth);
                self.dashboardStagnantWorth(data.StagnantWorth);
                self.dashboardMiscWorth(data.MiscWorth);
                self.dashboardLostWorth(data.LostWorth);
                self.dashboardJunkWorth(data.JunkWorth);
                self.dashboardCreatedWorth(data.CreatedWorth);
                self.dashboardUnassignedWorth(data.UnassignedWorth);
                self.dashboardOpenWorth(data.WonWorth);
                self.dashboardDeclinedWorth(data.DeclinedWorth);
                self.dashboardDistributorWorth(data.DistributorWorth)
                self.dashboardReviewLeadWorth(data.ReviewLeadWorth);
                self.dashboardCompleteApplicationWorth(data.CompleteApplicationWorth);
                self.dashboardSpecifyPaymentTermsWorth(data.SpecifyPaymentTermsWorth);

                self.dashboardBusy(false);
                if (!skipSearch) {
                    self.clearAdvancedSearch();
                    self.performSearch('dashboardSearch');
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                self.dashboardBusy(false);
                ////$.showError(xhr, textStatus, errorThrown);
            }
        });
    }

    self.dashboardOverrideTradeRegistrationRedirects = function () {
        self.clearAdvancedSearch();
        self.dashboardWidget('PendingApplication');
        self.dashboardLeadStatus(undefined);
        self.elementToHighlight("#trade-registration-redirects-panel");
        self.performSearch('dashboardSearch');
    }

    self.dashboardOverrideNew = function () {
        self.clearAdvancedSearch();
        self.dashboardLeadStatus(undefined);
        self.dashboardWidget('NewLeads');
        self.elementToHighlight("#new-lead-panel");
        self.performSearch('dashboardSearch');
    }

    self.dashboardOverrideAwaiting = function () {
        self.clearAdvancedSearch();
        self.dashboardLeadStatus(undefined);
        self.dashboardWidget('AwaitingLeads');
        self.elementToHighlight("#awaiting-lead-panel");
        self.performSearch('dashboardSearch');
    }

    self.dashboardOverrideActive = function () {
        self.clearAdvancedSearch();
        self.dashboardLeadStatus(undefined);
        self.dashboardWidget('PendingApplication');
        self.elementToHighlight("#active-lead-panel");
        self.performSearch('dashboardSearch');
    }

    self.dashboardOverrideStagnant = function () {
        self.clearAdvancedSearch();
        self.dashboardLeadStatus(undefined);
        self.elementToHighlight("#stagnant-lead-panel");
        self.performSearch('dashboardSearch');
    }

    self.dashboardOverrideMisc = function () {
        self.clearAdvancedSearch();
        self.dashboardLeadStatus(undefined);
        self.dashboardWidget('MiscAccounts');
        //self.dashboardPeriod("last-6-months");
        self.elementToHighlight("#misc-accounts-panel");
        self.performSearch('dashboardSearch');
    }

    self.dashboardOverrideLost = function () {
        self.clearAdvancedSearch();
        self.dashboardLeadStatus(undefined);
        self.dashboardWidget('LostLeads');
        //self.dashboardPeriod("last-6-months");
        self.elementToHighlight("#lost-leads-panel");
        self.performSearch('dashboardSearch');
    }

    self.dashboardOverrideJunk = function () {
        self.clearAdvancedSearch();
        self.dashboardLeadStatus(undefined);
        self.dashboardWidget('JunkLeads');
        //self.dashboardPeriod("last-6-months");
        self.elementToHighlight("#junk-lead-panel");
        self.performSearch('dashboardSearch');
    }

    self.dashboardOverrideOpen = function () {
        self.clearAdvancedSearch();
        self.dashboardLeadStatus(undefined);
        self.dashboardWidget('OpenAccounts');
        self.elementToHighlight("#open-lead-panel");
        self.performSearch('dashboardSearch');
    }

    self.dashboardOverrideDeclined = function () {
        self.clearAdvancedSearch();
        self.dashboardLeadStatus(undefined);
        self.dashboardWidget('DeclinedAccounts');
        //self.dashboardPeriod("last-6-months");
        self.elementToHighlight("#accounts-declined-panel");
        self.performSearch('dashboardSearch');
    }

    self.dashboardOverrideDistributors = function () {
        self.clearAdvancedSearch();
        self.dashboardLeadStatus(undefined);
        self.dashboardWidget('Distributor');
        self.dashboardSearchDistributor(true);
        self.elementToHighlight("#distributor-assigned-panel");
        self.performSearch('dashboardSearch');
    }

    self.dashboardOverrideReviewLead = function () {
        self.clearAdvancedSearch();
        self.dashboardLeadStatus(undefined);
        self.elementToHighlight("#review-lead-panel");
        self.performSearch('dashboardSearch');
    }

    self.dashboardOverrideCompleteApplication = function () {
        self.clearAdvancedSearch();
        self.dashboardLeadStatus(undefined);
        self.dashboardWidget('ProcessApplication');
        self.elementToHighlight("#complete-application-panel");
        self.performSearch('dashboardSearch');
    }

    self.dashboardOverrideSpecifyPaymentTerms = function () {
        self.clearAdvancedSearch();
        self.dashboardLeadStatus(undefined);
        self.dashboardWidget('PaymentTerms');
        self.elementToHighlight("#specify-payment-terms-panel");
        self.performSearch('dashboardSearch');
    }

    self.clearAdvancedSearch = function () {
        self.searchTerm(undefined);
        self.leadStatus(undefined);
        self.period(undefined);
        self.fromDate(undefined);
        self.toDate(undefined);
        self.assignedTo(undefined);
        self.assignedToMemberSearch().searchTerm(undefined);
        self.createdBy(undefined);
        self.createdByMemberSearch().searchTerm(undefined);
        self.leadSourceId(undefined);
        self.dashboardSearchDistributor(undefined);
    }

    self.resultGridWidget = ko.observable();

    self.resultGridWidget.subscribe(function (newValue) {
        if (newValue) {
            self.dashboardSelect();
        }
    });

    self.potentialTemplate = function (rec) {
        if (rec.Potential) {
            return formatCurrency(rec.Potential, 0, getGBPCurrency().FormattingCulture, getGBPCurrency().Code);
        } else {
            return '';
        }
    }

    //self.statusFilter = function (element) {
    //    element.kendoDropDownList({
    //        dataSource: getAvailableStatuses(),
    //        dataTextField: 'Name',
    //        dataValueField: 'Name',
    //        optionLabel: 'Select'
    //    });
    //}

    self.immediateOrderHeaderTemplate = function () {
        return 'Order<br/>Requested';
    }

    self.immediateOrderTemplate = function (rec) {
        if (rec.ImmediateOrderRequested) {
            return 'Yes';
        } else {
            return 'No';
        }
    }

    self.resultGridColumns = [
        {
            field: 'LeadID',
            title: 'Lead #',
            width: 60,
            hidden: true
        },
        {
            field: 'Market',
            title: 'Market',
            width: 100,
            filterable: false
        },
        {
            field: 'County',
            title: 'County',
            width: 100,
            filterable: false
        },
        {
            field: 'CompanyName',
            title: 'Company',
            width: 120
        },
        {
            field: 'FullName',
            title: 'Name',
            width: 120
        },
        {
            field: 'ImmediateOrderRequested',
            width: 80,
            headerTemplate: self.immediateOrderHeaderTemplate,
            template: self.immediateOrderTemplate
        },
        //{
        //    field: 'AccountType',
        //    title: 'Account Type',
        //    width: 110
        //},
        {
            field: 'Potential',
            title: 'Potential',
            width: 90,
            type: 'number',
            template: self.potentialTemplate,
            hidden: true
        },
        {
            field: 'CreatedDT',
            title: 'Created',
            width: 110,
            template: '#: OpenSince #'
        },
        {
            field: 'Status',
            title: 'Status',
            width: 80,
            filterable: false
        },
        {
            field: 'SourcedBy',
            title: 'From',
            width: 80
        },
        {
            field: 'LeadSource',
            title: 'Source',
            width: 80
        },
        {
            field: 'OwnedBy',
            title: 'Assigned To',
            width: 70
        }
    ];

    self.resultGridDataSourceRead = function (options) {
        console.log('leadSearch resultGridDataSourceRead hit', options);
        //console.log(options);

        var webapi = new kendo.data.transports.webapi({ prefix: "" });
        var params = webapi.parameterMap(options.data);

        var data = {
            term: self.searchTerm(),
            countryId: self.countryId(),
            status: self.leadStatus(),
            period: self.period(),
            from: self.fromDate() ? self.fromDate().toISOString() : null,
            to: self.toDate() ? self.toDate().toISOString() : null,
            assignedTo: self.assignedTo(),
            createdBy: self.createdBy(),
            leadSourceId: self.leadSourceId(),
            widget: self.dashboardWidget()
        };

        var isDashboardSearch = false;

        if (options.hasOwnProperty('data')) {
            if (options.data.hasOwnProperty('searchType')) {
                switch (options.data.searchType) {
                    case 'pureSearchTerm':
                        data = {
                            term: self.searchTerm()
                        };
                        break;
                    case 'dashboardSearch':
                        isDashboardSearch = true;
                        data = {
                            countryId: self.dashboardCountryId(),
                            status: self.dashboardLeadStatus(),
                            period: self.dashboardPeriod(),
                            leadTypeId: self.dashboardLeadTypeId(),
                            distributor: self.dashboardSearchDistributor(),
                            widget: self.dashboardWidget(),
                            term: self.searchTerm()
                        }
                        if (self.dashboardCreatedByOrAssignedTo()) {
                            if (self.dashboardCreatedByOrAssignedTo().MemberID != null) {
                                data.assignedTo = self.dashboardCreatedByOrAssignedTo();
                            }
                        }
                        break;
                    default:
                        break;
                }
            } else if (self.lastSearchType()) {
                switch (self.lastSearchType()) {
                    case 'pureSearchTerm':
                        data = {
                            term: self.searchTerm()
                        };
                        break;
                    case 'dashboardSearch':
                        isDashboardSearch = true;
                        data = {
                            countryId: self.dashboardCountryId(),
                            assignedTo: self.dashboardCreatedByOrAssignedTo(),
                            status: self.dashboardLeadStatus(),
                            period: self.dashboardPeriod(),
                            widget: self.dashboardWidget(),
                            term: self.searchTerm()
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        for (var propertyName in params) {
            data[propertyName] = params[propertyName];
        }

        console.log('resultGridDataSourceRead called', data);

        $.ajax({
            url: '/api/leadsAPI/LeadSearch',
            type: "GET",
            data: data,
            success: function (data) {
                options.success(data);
                $("#lead-grid .k-grid-content tbody tr").each(function (idx, ele) {
                    ko.applyBindings(viewModel, ele);
                });
            },
            error: function (data) {
                console.log(data);
                options.error();
                //$.showError(data, 'Error', null);
            }
        });
    };

    self.resultGridDataSource = new kendo.data.DataSource({
        transport: {
            read: self.resultGridDataSourceRead
        },
        pageSize: 50,
        serverPaging: false,
        serverSorting: false,
        serverFiltering: false,
        schema: $.extend({}, kendo.data.schemas.webapi, {
            data: "Data",
            total: "Total",
            errors: "Errors",
            aggregates: "Aggregates",
            model: {
                fields: {
                    Market: { type: 'string' },
                    Company: { type: 'string' },
                    Name: { type: 'string' },
                    Potential: { type: 'number' },
                    OpenedSince: { type: 'string' },
                    Status: { type: 'string' },
                    SourcedBy: { type: 'string' },
                    AssignedTo: { type: 'string' },
                    LeadID: { type: 'number' }
                }
            }
        }),
        sort: { field: "LeadID", dir: "desc" },
        requestStart: function (e) {
            $("#grid-loading").show();
            //console.log('requestStart: elementToHighlight', self.elementToHighlight());
        },
        requestEnd: function (e) {
            //console.log('leadSearch resultGridDataSource.requestEnd hit');
            $("#my-leads .dash-panel").removeClass('panel-primary');
            if (self.elementToHighlight()) {
                $(self.elementToHighlight()).addClass('panel-primary');
            }
            self.elementToHighlight();
            $("#grid-loading").hide();
        }
    });

    self.resultGridSettings = {
        autoBind: false,
        widget: self.resultGridWidget,
        columns: self.resultGridColumns,
        data: self.resultGridDataSource,
        //height: 685,
        sortable: true,
        filterable: false,
        reorderable: true,
        pageable: {
            pageSize: 50,
            pageSizes: [10, 20, 50, 100, 200]
        },
        dataBound: function (e) {
            //console.log('leadSearch resultGridSettings.dataBound hit');
        },
        filterMenuInit: function (e) {
            //console.log(e);
            if (e.field == "Status") {
                e.container.find(".k-filter-help-text").hide();
                var firstValueDropDown = e.container.find("select:eq(0)").data("kendoDropDownList");
                setTimeout(function () {
                    firstValueDropDown.wrapper.hide();
                });
            }
        },
        selectable: "single, row",
        change: function (e) {
            if (self.resultGridWidget().select()) {
                var selectedItem = self.resultGridWidget().dataItem(self.resultGridWidget().select());
                if (selectedItem != null) {
                    if (viewModel.hasOwnProperty('leadEdit')) {
                        viewModel.leadEdit.loadLeadForEdit(selectedItem.LeadID, 'summary', true);
                    }
                }
            }
        }
    };

    self.clearDashboard = function () {
        self.dashboardWidget(undefined);
        self.dashboardLeadStatus(undefined);
        self.dashboardCreatedByOrAssignedTo(undefined);
        self.dashboardPeriod(undefined);
    }

    self.lastSearchType = ko.observable();

    self.performSearch = function (searchType) {

        self.lastSearchType(searchType);

        if (!self.elementToHighlight())
            $("#my-leads .dash-panel").removeClass('panel-primary');

        // right, so if... the lead advanced search panel is open, send any parameters in there
        // if it isn't just send the search term
        if (typeof searchType !== 'undefined') {
            if (self.resultGridWidget()) {
                // this misses if the grid isn't yet ready - on the first fire from dashboardSelect, for example.
                // why is the grid not yet ready then?
                self.resultGridWidget().dataSource.read({
                    searchType: searchType
                });
            }
        } else {
            if ($("#lead-search-advanced").hasClass('in')) {
                //self.clearDashboard();
                self.dashboardWidget(undefined);
                self.resultGridWidget().dataSource.read();
            } else {
                //self.clearDashboard();
                self.resultGridWidget().dataSource.read({
                    searchType: 'pureSearchTerm'
                });
            }
        }
    }
}