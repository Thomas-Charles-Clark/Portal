using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.ContractPricing
{
    public class ContractManagement_ContractImpact_Result
    {
        public bool MarginWarning { get; set; }
        public decimal MarginVariance { get; set; }
        public char ProductOrQuality { get; set; }
        public string ProductOrQualityLabel { get; set; }
        public short? QualityID { get; set; }
        public int? ProductID { get; set; }
        public string DiscountLabel { get; set; }
        public decimal QuantityBreak { get; set; }
        public string StatusLabel { get; set; }
        public string ListPrice { get; set; }
        public string ContractPrice { get; set; }
        public string CostPrice { get; set; }
        public decimal FXRate { get; set; }
        public string Margin { get; set; }
        public int? ContractDiscountTradeAccountGroupID { get; set; }
        public int? ContractPriceTradeAccountGroupID { get; set; }
        public int? ContractDiscountTradeAccountID { get; set; }
        public int? ContractPriceTradeAccountID { get; set; }
        public char ContractType { get; set; }
        public char ContractAccountLevel { get; set; }
        public byte ContractLevel { get; set; }
        public DateTime? OnDate { get; set; }
        public DateTime? OffDate { get; set; }
    }

    public class ContractManagement_ContractImpact_SelectResult
    {
        public IEnumerable<ContractManagement_ContractImpact_Result> Results { get; set; }
    }
}
