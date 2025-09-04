using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class InvoiceBookingDocumentDashboard_ActionResult : InvoiceBookingDocumentDashboard_SelectResult
    {
        public string SearchKeywords { get; set; }
    }
}
