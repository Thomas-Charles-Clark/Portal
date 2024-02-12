using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.ContractPricing
{
    public class ContractManagement_QualitySearch_Result
    {
        public short QualityID { get; set; }
        public string QualityCode { get; set; }
        public string QualityName { get; set; }
    }

    public class ContractManagement_QualitySearch_SelectResult
    {
        public IEnumerable<ContractManagement_QualitySearch_Result> Results { get; set; }
    }
}
