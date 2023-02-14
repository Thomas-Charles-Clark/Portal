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
    public class OrderTrackingViewModel : BaseViewModel
    {
        public bool CanSearch { get; set; }

        public int? OrderID { get; set; }

        public OrderTrackingViewModel(RoleProperties properties, string applicationHeading, string applicationSubHeading, int? orderId)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            CanSearch = properties?.AccountSelector_CanSearch ?? false;
            ApplicationHeading = applicationHeading;
            ApplicationSubHeading = applicationSubHeading;
            OrderID = orderId;
        }
    }
}