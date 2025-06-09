using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.OrderEntry
{
    public class PassInsertStockCheckRequest
    {
        public int ProductID { get; set; }
        public int MemberID { get; set; }
        public int TradeAccountID { get; set; }
        public long BasketID { get; set; }
        public decimal Quantity { get; set; }
        public string Notes { get; set; }
    }
}
