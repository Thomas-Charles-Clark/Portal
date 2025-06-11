using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class OrderBook_OrdersSummary_BlockerResult
    {
        public bool DisableBudgetPanel { get; set; }
        public string DisableBudgetPanelMessage { get; set; }
    }
}
