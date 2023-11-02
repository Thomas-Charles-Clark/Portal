using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.RangeManagement
{
    public class RangeManagementTransferBasketRecord
    {
        public long BasketID { get; set; }
        public DateTime BasketCreatedDT { get; set; }
        public string TradeAccountCode { get; set; }
        public string TradeAccountName { get; set; }
        public int LineCount { get; set; }
    }
}
