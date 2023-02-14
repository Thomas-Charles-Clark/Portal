using Portal.Models;
using Portal.ViewModels;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Orders;
using System.Collections.Generic;

namespace Portal.Areas.Products.ViewModels
{
    public class OrderProductsViewModel : BaseViewModel
    {
        public List<HoldReason> HoldReasons { get; set; }
        public List<OrderImportSource> OrderImportSources { get; set; }

        public OrderProductsViewModel(
            List<HoldReason> holdReasons,
            List<OrderImportSource> orderImportSources,
            RoleProperties properties, 
            string applicationHeading, 
            string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            HoldReasons = holdReasons;
            OrderImportSources = orderImportSources;
        }
    }
}