using Portal.Models;
using Portal.Utilities;
using Portal.ViewModels;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Customers;
using SharedEFClasses.Models.General;
using SharedEFClasses.Utilities;

using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;

namespace Portal.Areas.Customers.ViewModels
{
    public class AdvertiserMaintenanceViewModel : BaseViewModel
    {
        public byte? FixedSalesMarketID { get; set; }

        public AdvertiserMaintenanceViewModel(
            byte? fixedSalesMarketId,
            RoleProperties properties, string applicationHeading, string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            FixedSalesMarketID = fixedSalesMarketId;
        }

#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
        public static async Task<AdvertiserMaintenanceViewModel> CreateAsync(
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
            byte? fixedSalesMarketId,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
        {
            var portalDb = new PortalDbContext();

            var result = new AdvertiserMaintenanceViewModel(fixedSalesMarketId, properties, applicationHeading, applicationSubHeading);

            return result;
        }
    }
}