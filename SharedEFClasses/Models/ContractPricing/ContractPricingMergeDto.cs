using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.ContractPricing
{
    public class ContractPricingMergeDto
    {
        public int? TradeAccountID { get; set; }
        public short? TradeAccountGroupID { get; set; }
        public DateTime OnDate { get; set; }
        public DateTime OffDate { get; set; }
        public int MemberID { get; set; }
        public IEnumerable<ContractPricingMerge_ContractDiscount> ContractDiscounts { get; set; }
        public IEnumerable<ContractPricingMerge_ContractPrice> ContractPrices { get; set; }
    }

    public class ContractPricingMerge_ContractDiscount
    {
        public int? ProductID { get; set; }
        public short? QualityID { get; set; }
        public byte? BrandID { get; set; }
        public short? ItemTypeID { get; set; }
        public byte? ProductGroupID { get; set; }
        public short QuantityBreak { get; set; }
        public decimal Discount { get; set; }
    }

    public class ContractPricingMerge_ContractPrice
    {
        public int? ProductID { get; set; }
        public short? QualityID { get; set; }
        //public byte? BrandID { get; set; }
        //public short? ItemTypeID { get; set; }
        //public byte? ProductGroupID { get; set; }
        public short QuantityBreak { get; set; }
        public decimal Price { get; set; }
    }
}
