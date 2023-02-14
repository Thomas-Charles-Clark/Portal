using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.TradeOrders;
using System.Collections.Generic;

namespace Portal.Areas.Invoices.ViewModels
{
    public class FurnitureInvoiceApprovalViewModel : BaseViewModel
    {
        public List<TreatmentProvider> TreatmentProviders { get; set; }
        public List<OrderStatus> OrderStatuses { get; set; }
        public List<SharedEFClasses.Models.FurnitureSupplier> FurnitureSuppliers { get; set; }

        public FurnitureInvoiceApprovalViewModel(
            List<TreatmentProvider> tps,
            List<OrderStatus> os,
            List<SharedEFClasses.Models.FurnitureSupplier> fs,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            TreatmentProviders = tps;
            OrderStatuses = os;
            FurnitureSuppliers = fs;
        }
    }
}