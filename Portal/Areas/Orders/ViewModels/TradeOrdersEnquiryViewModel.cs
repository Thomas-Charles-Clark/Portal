using Portal.Models;
using Portal.ViewModels;
using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Areas.Orders.ViewModels
{
    public class TradeOrdersEnquiryViewModel : BaseViewModel
    {
        public bool CanSearch { get; set; }

        public TradeOrdersEnquiryViewModel(RoleProperties properties, string applicationHeading, string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            CanSearch = properties?.AccountSelector_CanSearch ?? false;
            ApplicationHeading = applicationHeading;
            ApplicationSubHeading = applicationSubHeading;
        }
    }
}