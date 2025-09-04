using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class InvoiceBookingDocumentDashboard
    {
        public IEnumerable<InvoiceBookingDocumentDashboard_SelectResult> Actions { get; set; }
        public IEnumerable<InvoiceBookingDocumentDashboard_SelectResult> DocumentTypesSummary { get; set; }
        public IEnumerable<InvoiceBookingDocumentDashboard_SelectResult> DocumentStatuses { get; set; }
        public IEnumerable<Dashboard_NoticeResult> Notices { get; set; }
    }
}
