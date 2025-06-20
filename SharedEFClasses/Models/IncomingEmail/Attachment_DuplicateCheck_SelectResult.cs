using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class Attachment_DuplicateCheck_SelectResult
    {
        public string MertexCode { get; set; }

        public string SupplierCode { get; set; }

        [JsonProperty("SupplierInvoiceCode")]
        public string SupplierInvoiceReference { get; set; }

        public DateTime InvoiceDate { get; set; }

        public decimal InvoiceTotalInCurrencyIncVAT { get; set; }
    }
}
