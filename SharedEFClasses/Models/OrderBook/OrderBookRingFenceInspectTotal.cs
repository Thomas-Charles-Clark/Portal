using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class OrderBookRingFenceInspectTotal
    {
        public decimal OrderValue { get; set; }
        public decimal OrderQuantity { get; set; }
        public int OrderCount { get; set; }
        public int LineCount { get; set; }
    }
}
