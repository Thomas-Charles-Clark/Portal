using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class OrderBook_OrdersSummary_SelectResult
    {
        public byte SortOrder { get; set; }
        public string Label { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public string LineCount_TY { get; set; }
        public string OrderCount_TY { get; set; }
        public string SalesTotal_TY { get; set; }
        public string CreditTotal_TY { get; set; }
        public string Budget_TY { get; set; }

        public string LineCount_LY { get; set; }
        public string OrderCount_LY { get; set; }
        public string SalesTotal_LY { get; set; }
        public string CreditTotal_LY { get; set; }

        public string LineCount_Variance { get; set; }
        public string OrderCount_Variance { get; set; }
        public string SalesTotal_Variance { get; set; }
        public string CreditTotal_Variance { get; set; }

        public string LineCount_Growth { get; set; }
        public string OrderCount_Growth { get; set; }
        public string SalesTotal_Growth { get; set; }
        public string CreditTotal_Growth { get; set; }
        public string Budget_Growth { get; set; }
    }
}
