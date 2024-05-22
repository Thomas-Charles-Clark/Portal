using Microsoft.Owin.Security;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class OrderBook_MainSummary_SelectResult
    {
        public DateTime AccurateAsOfDT { get; set; }

        public IEnumerable<OrderBook_MainSummary_OrderGroupStockLocation> RowHeadings { get; set; }

        public IEnumerable<OrderBook_MainSummary_OrderStatusOrderStatusGroup> ColumnHeadings { get; set; }

        public IEnumerable<OrderBook_MainSummary_DataRow> Data { get; set; }
    }
}
