using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class OrderBook_MainSummary_OrderStatusOrderStatusGroup
    {
        public byte OrderStatusID { get; set; }
        public string OrderStatusName { get; set; }
        public byte OrderStatusSortOrder { get; set; }
        public byte OrderStatusGroupID { get; set; }
        public string OrderStatusGroupName { get; set; }
        public byte OrderStatusGroupSortOrder { get; set; }
        public string View { get; set; }
        public string Procedure { get; set; }
    }
}
