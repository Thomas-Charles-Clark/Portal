using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.ContractPricing
{
    public class ContractManagement_ContractImpact_Result
    {
        public int ProductID { get; set; }
        public string ContractHash { get; set; }
    }

    public class ContractManagement_ContractImpact_SelectResult
    {
        public IEnumerable<ContractManagement_ContractImpact_Result> Results { get; set; }
    }
}
