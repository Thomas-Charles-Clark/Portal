using Portal.Areas.Customers.ViewModels;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.TradeOrders;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Portal.Areas.Invoices.ViewModels
{
    public class InvoiceBookingViewModel : BaseViewModel
    {

        public InvoiceBookingViewModel(RoleProperties properties, string applicationHeading, string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {

        }

        public static async Task<InvoiceBookingViewModel> CreateAsync(
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
        {
            var portalDb = new PortalDbContext();

            var result = new InvoiceBookingViewModel(properties, applicationHeading, applicationSubHeading);

            return result;
        }
    }
}