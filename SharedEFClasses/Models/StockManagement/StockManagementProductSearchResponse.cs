using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.StockManagement
{
    public class StockManagementProductSearchRecord : StockManagementProduct
    {
        public string Code { get; set; }
        public string BasketName { get; set; }
        public int? ProductPageID { get; set; }
        public string ProductPageHeading { get; set; }
        public string OrderFormGroupName { get; set; }
        public byte? OrderFormGroupSortOrder { get; set; }
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
