using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.ContractPricing
{
    public class ContractPricingImpactDto
    {
        public int TradeAccountID { get; set; }
        public string ContractListJSON { get; set; }
        public short? LaunchID { get; set; }
        public byte? BrandID { get; set; }
        public byte? ProductGroupID { get; set; }
        public short? ItemTypeID { get; set; }
        public short? CollectionID { get; set; }
        public string SearchTerm { get; set; }
    }
}
