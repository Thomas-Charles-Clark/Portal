using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class InvoiceBookingDocumentDashboard
    {
        public IEnumerable<InvoiceBookingDocumentDashboard_ActionResult> Actions { get; set; }
        public IEnumerable<InvoiceBookingDocumentDashboard_DocumentTypeResult> DocumentTypesSummary { get; set; }
        public IEnumerable<InvoiceBookingDocumentDashboard_DocumentStatusResult> DocumentStatuses { get; set; }
        public IEnumerable<InvoiceBookingDocumentDashboard_BudgetHolderResult> BudgetHolders { get; set; }
        public IEnumerable<Dashboard_NoticeResult> Notices { get; set; }
    }
}
