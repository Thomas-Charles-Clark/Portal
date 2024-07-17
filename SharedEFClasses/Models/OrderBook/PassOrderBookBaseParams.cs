using Microsoft.Owin.Security;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class PassOrderBookBaseParams
    {
        // Hmmm.
        public string DataSource { get; set; }

        // Trade Account Filters
        public byte? MarketID { get; set; }
        public IEnumerable<byte> MarketIDs { get; set; }
        public int? TradeAccountID { get; set; }
        public short? TradeAccountGroupID { get; set; }
        public byte? PaymentTermsID { get; set; }
        public byte? PaymentTermsTypeID { get; set; }
        public short? TradeAccountTypeID { get; set; }
        public short? SalesRepresentativeID { get; set; }
        public short? SalesAgentID { get; set; }
        public short? SalesAreaID { get; set; }
        public short? CountryID { get; set; }

        // Product Filters
        public byte? ProductGroupID { get; set; }
        public short? ItemTypeID { get; set; }
        public byte? BrandID { get; set; }
        public short? CollectionID { get; set; }
        public short? QualityID { get; set; }
        public int? DesignID { get; set; }
        public int? ProductID { get; set; }
        public string ProductStatus { get; set; }
        public short? LaunchID { get; set; }
        public string SupplierCode { get; set; }

        // Order Filters
        public string OrderID { get; set; }
        public string HaulierCode { get; set; }
        public DateTime? StartDate { get; set; } 
        public DateTime? EndDate { get; set; }
        public bool? Allocated { get; set; }
        public byte? TransactionTypeID { get; set; }
        public string OrderTakerCode { get; set; }
        public string DeliveryType { get; set; }
    }
}
