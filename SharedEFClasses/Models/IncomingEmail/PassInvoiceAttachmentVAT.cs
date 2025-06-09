using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class PassInvoiceAttachmentVAT
    {
        public string VATCode { get; set; }
        public decimal VATAbleAmount { get; set; }
        public decimal VAT { get; set; }
    }
}
