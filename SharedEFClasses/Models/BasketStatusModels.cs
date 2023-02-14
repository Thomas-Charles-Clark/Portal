using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    public class FetchOrderDetail
    {
        public int OrderHeadID { get; set; }
    }

    public class FetchImportDetail
    {
        public long TradeOrderImportFileID { get; set; }
    }

    public class BasketStatusOrderDetail
    {
        public BasketStatusOrderHeadInfo OrderHead { get; set; }

        public IEnumerable<BasketStatusOrderLineInfo> OrderLines { get; set; }
    }

    public class BasketStatusOrderHeadInfo
    {
        public string TradeAccountCode { get; set; }
        public string TradeAccountName { get; set; }
        public string MertexCurrencyCode { get; set; }
        public string OrderID { get; set; }
        public DateTime OrderDT { get; set; }
        public string CustomerOrderReference { get; set; }
        public string OrderDescription { get; set; }
        public string OrderTaker { get; set; }
        public string HaulierCode { get; set; }
        public string CarriageCode { get; set; }
        public string DeliveryName { get; set; }
        public string DeliveryAddressLine1 { get; set; }
        public string DeliveryAddressLine2 { get; set; }
        public string DeliveryTown { get; set; }
        public string DeliveryCounty { get; set; }
        public string DeliveryPostcode { get; set; }
        public string DeliveryCountryCode { get; set; }
        public string FormattingCulture { get; set; }
        public string CurrencyCode { get; set; }
    }

    public class BasketStatusOrderLineInfo
    {
        public long ImageID { get; set; }
        public int LineNumber { get; set; }
        public string CustomerLineReference { get; set; }
        public string ProductCode { get; set; }
        public string ProductDescription { get; set; }
        public decimal QuantityOrdered { get; set; }
        public decimal LineValueCurrency { get; set; }
        public decimal LineDiscountValueCurrency { get; set; }
        public string LineStatus { get; set; }
        public string CurrencyCode { get; set; }
        public string FormattingCulture { get; set; }
    }

    public class BasketStatusImportDetail
    {
        public BasketStatusImportFileInfo FileInfo { get; set; }
    }

    public class BasketStatusImportFileInfo
    {
        public long TradeOrderImportFileID { get; set; }
        public string TradeAccountCode { get; set; }
        public string TradeAccountName { get; set; }
        public string FileName { get; set; }
        public string Contents { get; set; }
        public DateTime UploadedDT { get; set; }
        public string ImportedByName { get; set; }
        public string ImportedByEmail { get; set; }
    }
}