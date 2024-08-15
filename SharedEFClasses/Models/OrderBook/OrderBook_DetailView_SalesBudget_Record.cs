using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class OrderBook_DetailView_SalesBudget_Record
    {
        public string Market { get; set; }
        public string TradeAccountType { get; set; }
        public string TradeAccountGroup { get; set; }
        public short FinancialYear { get; set; }
        public int FinancialPeriod { get; set; }
        public decimal Budget { get; set; }

        public string Label
        {
            get
            {
                var strings = new List<string>();

                if (!String.IsNullOrEmpty(Market))
                {
                    strings.Add(Market);
                }

                if (!String.IsNullOrEmpty(TradeAccountType))
                {
                    strings.Add(TradeAccountType);
                }

                if (!String.IsNullOrEmpty(TradeAccountGroup))
                {
                    strings.Add(TradeAccountGroup);
                } 
                return String.Join(" - ", strings);
            }
        }
    }
}
