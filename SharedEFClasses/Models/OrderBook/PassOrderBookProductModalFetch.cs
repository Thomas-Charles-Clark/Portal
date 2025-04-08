using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderBook
{
    public class PassOrderBookProductModalFetch
    {
        public string ProductCode { get; set; }
        public int MemberID { get; set; }
        public long? BasketID { get; set; }
        public int ProductID { get; set; }
        public int TradeAccountID { get; set; }
    }
}
