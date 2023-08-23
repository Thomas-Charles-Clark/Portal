using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.StockManagement
{
    public class StockManagementProductSearchRecord
    {
        public int ProductID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string ProductTypeName { get; set; }
        public string ProductGroupName { get; set; }
        public string ProductGroupCode { get; set; }
        public string ItemTypeName { get; set; }
        public string ItemTypeCode { get; set; }
    }

    public class StockManagementBranchGroupTotalRecord
    {
        public int BranchGroupID { get; set; }
        public string BranchGroup { get; set; }
        public int? BranchID { get; set; }
        public string Branch { get; set; }
        public int ProductID { get; set; }
        public decimal Quantity { get; set; }
    }

    public class StockManagementRangeRecord
    {
        public int ProductID { get; set; }
        public decimal Quantity { get; set; }
    }

    public class StockManagementContrastRecord
    {
        public int ProductID { get; set; }
        public int ContrastBranchA_ID { get; set; }
        public string ContrastBranchA_Name { get; set; }
        public decimal ContrastBranchA_Quantity { get; set; }
        public int ContrastBranchB_ID { get; set; }
        public string ContrastBranchB_Name { get; set; }
        public decimal ContrastBranchB_Quantity { get; set; }
    }

    public class StockManagementProductSearchResponse
    {
        public IEnumerable<StockManagementProductSearchRecord> Results { get; set; }

        public IEnumerable<StockManagementBranchGroupTotalRecord> BranchGroupTotals { get; set; }

        public IEnumerable<StockManagementRangeRecord> RangeRecords { get; set;}

        public IEnumerable<StockManagementContrastRecord> ContrastRecords { get; set; }
    }
}
