using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class OrderBook_MainSummary_OrderGroupStockLocation
    {
        public byte OrderGroupID { get; set; }
        public string OrderGroupName { get; set; }
        public byte OrderGroupSortOrder { get; set; }
        public byte OrderGroupDefaultDisplayMode { get; set; }
        public byte? StockLocationGroupID { get; set; }
        public string StockLocationGroupName { get; set; }
        public byte StockLocationGroupSortOrder { get; set; }
    }
}
