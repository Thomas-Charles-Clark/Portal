using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class OrderBook_DetailView_DataRow
    {
        public string MarketCode { get; set; }
        public string TradeAccountCode { get; set; }
        public string TradeAccountName { get; set; }
        public string TradeAccountGroupCode { get; set; }
        public short? TradeAccountTypeID { get; set; }
        public string OrderID { get; set; }
        public string CustomerOrderReference { get; set; }
        public DateTime? OrderDate { get; set; }
        public byte? OrderGroupID { get; set; }
        public string OrderGroupName { get; set; }
        public string OrderLineID { get; set; }
        public decimal? QuantityOrdered { get; set; }
        public string LineValueSterling { get; set; }
        public string OrderLineDetailedStatusName { get; set; }
        public byte? OrderLineDetailedStatusID { get; set; }
        public string HaulierCode { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public string ProductStatus { get; set; }
        public string QualityCode { get; set; }
        public string ProductGroupCode { get; set; }
        public string ItemTypeCode { get; set; }
        public string BrandCode { get; set; }
        public string CollectionCode { get; set; }
        public DateTime? LaunchDate { get; set; }
        public string StockLocationCode { get; set; }
        public string StockLocationName { get; set; }
        public byte? StockLocationGroupID { get; set; }
        public string StockLocationGroupName { get; set; }
        public string PurchaseOrderHeadID { get; set; }
        public string PurchaseOrderLineID { get; set; }
        public decimal? PurchaseOrderQuantityOrdered { get; set; }
        public string SupplierCode { get; set; }
        public DateTime? PurchaseOrderDate { get; set; }
        public DateTime? PurchaseOrderPromisedDate { get; set; }
        public DateTime? PurchaseOrderExpectedDate { get; set; }
        public bool? PurchaseOrderDateConfirmed { get; set; }
    }
}
