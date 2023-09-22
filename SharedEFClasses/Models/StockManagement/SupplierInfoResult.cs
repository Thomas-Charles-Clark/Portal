using SharedEFClasses.Models.Orders;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.StockManagement
{
    public class SupplierPurchasePriceHistoryRecord
    {
        public string Code { get; set; }
        public string PurchaseUnit { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? Price { get; set; }
        public DateTime? LastAmendedDT { get; set; }
        public decimal? OpenOrderPrice { get; set; }
        public decimal? FutureOrderPrice { get; set; }
    }

    public class SupplierInfoResult : DatabaseJSONResult
    {
        public IEnumerable<SupplierPurchasePriceHistoryRecord> PurchasePriceHistory { get; set; }
    }
}
