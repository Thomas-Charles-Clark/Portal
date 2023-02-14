using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Portal.Models;
using Portal.ViewModels;
using SharedEFClasses.Models;
using SharedEFClasses;

namespace Portal.Areas.Pricing.ViewModels
{
    public class PricingEnquiryViewModel : BaseViewModel
    {
        public PricingEnquiryViewModel(RoleProperties properties, string applicationHeading, string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {

        }
    }
}