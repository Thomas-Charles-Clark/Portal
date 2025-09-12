using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class InvoiceBookingDocumentDashboard_BudgetHolderResult : InvoiceBookingDocumentDashboard_SelectResult
    {
        public string BudgetHolderCode { get; set; }
    }
}
