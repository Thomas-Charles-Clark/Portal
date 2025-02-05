using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderEntry
{
    public class PassStockCheckRequest
    {
        public int MemberID { get; set; }
        public int ProductID { get; set; }
        public int TradeAccountID { get; set; }
        public int BasketID { get; set; }
    }
}
