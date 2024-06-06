using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class OrderBookOrderLineInspectData
    {
        public string DataSource { get; set; }
        public string OrderLineID { get; set; }
        public string MarketCode { get; set; }
        public string TradeAccountCode { get; set; }
        public string TradeAccountName { get; set; }
        public string OrderID { get; set; }
        public string OrderLineDetailedStatusName { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public decimal? QuantityOrdered { get; set; }
    }
}
