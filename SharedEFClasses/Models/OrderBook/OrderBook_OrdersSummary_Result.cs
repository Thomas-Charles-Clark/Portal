using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class OrderBook_OrdersSummary_Result
    {
        public object OrdersResult { get; set; }

        public OrderBook_OrdersSummary_BlockerResult BlockerResult { get; set; }
    }
}
