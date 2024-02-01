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
    }
}
