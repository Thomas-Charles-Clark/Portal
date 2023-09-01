using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.StockManagement
{
    public class StockManagementBranchRangeSaveDto
    {
        public int BranchID { get; set; }
        public IEnumerable<StockManagementBranchProduct> Products { get; set; }
    }
}
