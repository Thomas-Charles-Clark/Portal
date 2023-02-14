using Portal.Models;
using SharedEFClasses.Models.Applications;
using SharedEFClasses.Models.TradeAccounts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.ViewModels
{
    public class HomeViewModel
    {
        public List<Application> AvailableApplications { get; set; }
        public List<ApplicationGroup> ApplicationGroups { get; set; }
        public TradeAccount TradeAccount { get; set; }
        public string ApplicationButtonClass { get; set; }
        public HomeViewModel(
            List<Application> applications,
            List<ApplicationGroup> applicationGroups,
            string applicationButtonClass)
        {
            this.ApplicationButtonClass = applicationButtonClass;

            AvailableApplications = applications;

            ApplicationGroups = applicationGroups;

            AvailableApplications?.ForEach(c => 
            {
                c.ApplicationGroup = ApplicationGroups?.Where(p => p.ApplicationGroupID == c.ApplicationGroupID).SingleOrDefault();
            });
        }
    }
}