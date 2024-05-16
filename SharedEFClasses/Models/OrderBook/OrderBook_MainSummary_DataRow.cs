using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class OrderBook_MainSummary_DataRow
    {
        public byte? OrderGroupID { get; set; }
        public byte? StockLocationGroupID { get; set; }
        public byte? OrderStatusGroupID { get; set; }
        public byte? OrderStatusID { get; set; }
        public string OrderValue { get; set; }
        public string OrderQuantity { get; set; }
        public string OrderCount { get; set; }
        public string LineCount { get; set; }
    }
}
