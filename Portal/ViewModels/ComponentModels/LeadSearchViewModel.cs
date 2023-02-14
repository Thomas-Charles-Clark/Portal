using Portal.Models;
using Portal.Utilities;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.ViewModels.ComponentModels
{
    public class LeadSearchViewModel : BaseViewModel
    {
        public int? TradeAccountGroupID { get; set; }
        public int? TradeAccountID { get; set; }
        public List<LeadStatus> LeadStatusOptions { get; set; }
        public List<LeadSource> LeadSourceOptions { get; set; }
        public List<StringSelectOption> PeriodOptions { get; set; }
        public List<ClientSideCountry> Countries { get; set; }
        public List<ClientSideLanguage> Languages { get; set; }
        public List<ClientSideMember> DashboardMembers { get; set; }
        public ClientSideMember PreselectedDashboardUser { get; set; }
        public ClientSideCountry PreselectedDashboardCountry { get; set; }
        public List<LeadType> LeadTypes { get; set; }

        public LeadSearchViewModel(int? tradeAccountGroupId,
                                    int? tradeAccountId,
                                    List<ClientSideCountry> countries,
                                    List<ClientSideLanguage> languages,
                                    List<LeadStatus> leadStatuses,
                                    List<LeadSource> leadSources,
                                    List<ClientSideMember> dashboardMembers,
                                    ClientSideMember preselectedDashboardUser,
                                    ClientSideCountry preselectedDashboardCountry,
                                    List<LeadType> leadTypes,
                                    RoleProperties properties) 
            : base(properties)
        {
            TradeAccountGroupID = tradeAccountGroupId;
            TradeAccountID = tradeAccountId;
            Countries = countries;
            Languages = languages;
            LeadStatusOptions = leadStatuses;
            LeadSourceOptions = leadSources;
            DashboardMembers = dashboardMembers;
            PeriodOptions = PortalFramework.GeneratePeriodOptions();
            PreselectedDashboardUser = preselectedDashboardUser;
            PreselectedDashboardCountry = preselectedDashboardCountry;
            LeadTypes = leadTypes;
        }
    }
}