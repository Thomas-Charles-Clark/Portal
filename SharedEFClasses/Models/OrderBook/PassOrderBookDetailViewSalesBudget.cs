using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class PassOrderBookDetailViewSalesBudget
    {
        public IEnumerable<byte> MarketIDs { get; set; }
        public short? TradeAccountGroupID { get; set; }
        public int? TradeAccountTypeID { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
