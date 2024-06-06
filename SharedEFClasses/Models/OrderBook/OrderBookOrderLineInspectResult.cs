using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class OrderBookOrderLineInspectResult
    {
        public OrderBookOrderLineInspectTotal Totals { get; set; }
        public IEnumerable<OrderBookOrderLineInspectData> Data { get; set; }
    }
}
