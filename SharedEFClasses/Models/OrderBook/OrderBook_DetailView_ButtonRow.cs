using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class OrderBook_DetailView_ButtonRow
    {
        public string Label { get; set; }
        public byte? ProductLifeCycleID { get; set; }
        public byte? SortOrder { get; set; }
        public byte? ActiveButtonID { get; set; }
        public string Criteria { get; set; }
        public string OrderValue { get; set; }
        public string OrderQuantity { get; set; }
        public string OrderCount { get; set; }
        public string LineCount { get; set; }
    }
}
