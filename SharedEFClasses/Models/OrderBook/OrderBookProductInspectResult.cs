using SharedEFClasses.Models.OrderEntry;
using SharedEFClasses.Models.Orders;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class OrderBookProductInspectResult
    {
        public OrderBook_ProductInspect_ProductInfo ProductInfo { get; set;  }

        public IEnumerable<OrderBook_ProductInspect_OrderLine> OrderLines { get; set; }

        public IEnumerable<OrderBook_ProductInspect_StockInfo> StockInfo { get; set; }

        public StockInfoAvailabilityMessage AvailabilityMessage { get; set; }

        public StockCheckRequestSelectResult StockCheckRequestSelectResult { get; set; }
    }
}
