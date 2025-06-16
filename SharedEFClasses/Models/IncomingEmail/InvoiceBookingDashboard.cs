using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class InvoiceBookingDashboard
    {
        public string Label { get; set; }
        public int RecordCount { get; set; }
        public byte SortOrder { get; set; }
        public byte EmailStatusID { get; set; }
    }
}
