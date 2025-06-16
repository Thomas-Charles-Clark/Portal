using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class PassInvoiceDateParams
    {
        public DateTime InvoiceDate { get; set; }

        public string SupplierPaymentTermsCode { get; set; }
    }
}
