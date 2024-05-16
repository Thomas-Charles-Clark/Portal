using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class OrderBook_PreDefinedSummary_SelectResult
    {
        public string Period { get; set; }
        public string AlertClass { get; set; }
        public string Label { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string OrderValue { get; set; }
        public string OrderQuantity { get; set; }
        public string OrderCount { get; set; }
        public string LineCount { get; set; }
    }
}
