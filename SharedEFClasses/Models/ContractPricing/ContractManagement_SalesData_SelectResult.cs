using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.ContractPricing
{
    public class ContractManagement_SalesData_ProductResult
    {
        public int ProductID { get; set; }
        public string SalesQuantity_180Days { get; set; }
        public string SalesValue_180Days { get; set; }
    }

    public class ContractManagement_SalesData_QualityResult
    {
        public short QualityID { get; set; }
        public string SalesQuantity_180Days { get; set; }
        public string SalesValue_180Days { get; set; }
    }

    public class ContractManagement_SalesData_SelectResult
    {
        public IEnumerable<ContractManagement_SalesData_ProductResult> ProductResults { get; set; }
        public IEnumerable<ContractManagement_SalesData_QualityResult> QualityResults { get; set; }
    }
}
