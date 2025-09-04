using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class InvoiceBookingDocumentDashboard_DocumentTypeResult : InvoiceBookingDocumentDashboard_SelectResult
    {
        public short? AttachmentTypeID { get; set; }
    }
}
