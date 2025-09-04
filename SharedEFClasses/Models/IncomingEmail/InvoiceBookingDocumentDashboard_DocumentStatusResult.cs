using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class InvoiceBookingDocumentDashboard_DocumentStatusResult : InvoiceBookingDocumentDashboard_SelectResult
    {
        public byte? AttachmentStatusID { get; set; }
    }
}
