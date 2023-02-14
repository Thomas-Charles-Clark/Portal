using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.TradeOrders;
using System.Collections.Generic;

namespace Portal.Areas.Invoices.ViewModels
{
    public class PaintInvoiceApprovalViewModel : BaseViewModel
    {
        public List<TreatmentProvider> TreatmentProviders { get; set; }
        public List<OrderStatus> OrderStatuses { get; set; }

        public PaintInvoiceApprovalViewModel(
            List<TreatmentProvider> tps,
            List<OrderStatus> os,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            TreatmentProviders = tps;
            OrderStatuses = os;
        }
    }
}