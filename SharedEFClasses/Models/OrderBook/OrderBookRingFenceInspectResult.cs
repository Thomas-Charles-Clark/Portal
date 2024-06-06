using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class OrderBookRingFenceInspectResult
    {
        public OrderBookRingFenceInspectTotal Totals { get; set; }
        public IEnumerable<OrderBookRingFenceInspectData> Data { get; set; }
    }
}
