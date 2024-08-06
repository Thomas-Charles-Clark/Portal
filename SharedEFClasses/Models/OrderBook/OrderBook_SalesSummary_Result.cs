using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class OrderBook_SalesSummary_Result
    {
        public object SalesResult { get; set; }

        public OrderBook_SalesSummary_BlockerResult BlockerResult { get; set; }
    }
}
