using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class PassInvoiceBookingDashboardParams
    {
        public int? MailboxID { get; set; }
        public int? GroupID { get; set; }
        public int? MemberID { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
    }
}
