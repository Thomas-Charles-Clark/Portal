using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class OrderBookSummaryRecord
    {
        public byte? GroupID { get; set; }
        public string GroupName { get; set; }
        public byte RowID { get; set; }
        public string RowName { get; set; }
        public string OrderValue { get; set; }
        public string OrderQuantity { get; set; }
        public string OrderCount { get; set; }
        public string LineCount { get; set; }
    }
}
