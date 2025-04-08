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
        public OrderBook_ProductInspect_ProductInfo productInfo { get; set;  }

        public IEnumerable<OrderBook_ProductInspect_OrderLine> orderLines { get; set; }

        public IEnumerable<OrderBook_ProductInspect_StockInfo> stockResults { get; set; }

        public IEnumerable<StockInfoAvailabilityMessage> availabilityMessages { get; set; }

        public StockCheckRequestSelectResult stockCheckRequestSelectResult { get; set; }
    }
}
