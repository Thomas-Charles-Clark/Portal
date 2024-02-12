using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.ContractPricing
{
    public class ContractPricingQualityProductSearchDto
    {
        public int tradeAccountId { get; set; }
        public short? launchId { get; set; }
        public byte? brandId { get; set; }
        public byte? productGroupId { get; set; }
        public short? itemTypeId { get; set; }
        public short? collectionId { get; set; }
        public string searchTerm { get; set; }
    }
}
