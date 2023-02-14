//using Tagging.Models;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Leads;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Webtex.ViewModels
{
    public class WebtexAdminViewModel : BaseViewModel
    {
        //public List<Tag> Tags { get; set; }
        //public List<SalesMarket> Markets { get; set; }
        //public SalesRepresentative PreselectedSalesRep { get; set; }

        public WebtexAdminViewModel(
            string applicationHeading, 
            string applicationSubHeading,
            //List<Tag> tags,
            //List<SalesMarket> markets,
            //SalesRepresentative preselectedSalesRep,
            RoleProperties roleProperties) 
            : base (roleProperties, applicationHeading, applicationSubHeading)
        {
            //this.Tags = tags;
            //this.Markets = markets;
            //this.PreselectedSalesRep = preselectedSalesRep;
        }
    }
}