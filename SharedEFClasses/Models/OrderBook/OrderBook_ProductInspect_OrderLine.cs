using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class OrderBook_ProductInspect_OrderLine
    {
        public string DataSource { get; set; }
        public string TradeAccount { get; set; }
        public string TradeAccountStatus { get; set; }
        public string OrderLine { get; set; }
        public string OrderLineStatus { get; set; }
        public decimal QuantityOrdered { get; set; }
    }
}
