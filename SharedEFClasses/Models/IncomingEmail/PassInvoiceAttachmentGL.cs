using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class PassInvoiceAttachmentGL
    {
        public string GeneralLedgerCode { get; set; }

        public decimal AmountEXVAT { get; set; }
    }
}
