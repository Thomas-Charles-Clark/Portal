using SalesStatistics.Models;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Leads;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SalesStatistics.ViewModels
{
    public class SalesStatsViewModel : BaseViewModel
    {
        public List<Tag> Tags { get; set; }

        public List<SalesMarket> Markets { get; set; }

        public SalesRepresentative PreselectedSalesRep { get; set; }

        public bool LockedToRep { get; set; }

        public SalesStatsViewModel(
            string applicationHeading,
            string applicationSubHeading,
            List<Tag> tags,
            List<SalesMarket> markets,
            SalesRepresentative preselectedSalesRep,
            bool lockedToRep,
            RoleProperties roleProperties) 
            : base (roleProperties, applicationHeading, applicationSubHeading)
        {
            this.Tags = tags;
            this.Markets = markets;
            this.PreselectedSalesRep = preselectedSalesRep;
            this.LockedToRep = lockedToRep;
        }
    }
}