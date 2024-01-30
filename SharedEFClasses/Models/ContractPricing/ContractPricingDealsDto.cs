using Org.BouncyCastle.Asn1.Mozilla;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.ContractPricing
{
    public class ContractPricingDealsDto
    {
        public short? SalesMarketID { get; set; }
        public short? SalesRepresentativeID { get; set; }
        public string ExistingContractsCode { get; set; }
        public int? TradeAccountID { get; set; }
        public short? LaunchID { get; set; }
        public byte? BrandID { get; set; }
        public short? ProductGroupID { get; set; }
        public short? ItemTypeID { get; set; }
        public short? CollectionID { get; set; }
    }
}
