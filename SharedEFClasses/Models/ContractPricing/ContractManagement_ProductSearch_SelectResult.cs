using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.ContractPricing
{
    public class ContractManagement_ProductSearch_Result
    {
        public int ProductID { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
    }

    public class ContractManagement_ProductSearch_SelectResult
    {
        public IEnumerable<ContractManagement_ProductSearch_Result> Results { get; set; }
    }
}
