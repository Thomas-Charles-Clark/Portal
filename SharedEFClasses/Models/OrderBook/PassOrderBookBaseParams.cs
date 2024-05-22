using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class PassOrderBookBaseParams
    {
        // Trade Account Filters
        public byte? MarketID { get; set; }
        public int? TradeAccountID { get; set; }
        public short? TradeAccountGroupID { get; set; }
        public short? TradeAccountTypeID { get; set; }
        // Product Filters
        public byte? ProductGroupID { get; set; }
        public short? ItemTypeID { get; set; }
        public byte? BrandID { get; set; }
        public short? CollectionID { get; set; }
        public short? QualityID { get; set; }
        public int? ProductID { get; set; }
        public string ProductStatus { get; set; }
        public short? LaunchID { get; set; }
        // Order Filters
        public string OrderID { get; set; }
        public string HaulierCode { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string DateBasis { get; set; }
    }
}
