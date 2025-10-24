using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.CreditControl
{
    public class PassSendStatementsDto
    {
        public int MemberID { get; set; }
        public int? TradeAccountID { get; set; }
        public DateTime? Date { get; set; }
    }
}
