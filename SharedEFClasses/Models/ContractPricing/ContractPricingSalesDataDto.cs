using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.ContractPricing
{
    public class ContractPricingSalesDataDto
    {
        public int tradeAccountId { get; set; }
        public IEnumerable<int?> productId { get; set; }
        public IEnumerable<short?> qualityId { get; set; }
    }
}
