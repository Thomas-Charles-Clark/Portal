using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class InvoiceBookingDashboard_SelectResult
    {
        public string Label { get; set; }
        public byte SortOrder { get; set; }
        public byte? EmailStatusID { get; set; }
        public string EmailStats { get; set; }
        public string AttachmentStats { get; set; }
        public string Stats { get; set; }
        public int RecordCount { get; set; }
        public string BudgetHolderCode { get; set; }
    }
}
