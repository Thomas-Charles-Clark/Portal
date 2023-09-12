using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Fenwick
{
    public class PassFenwickSelfBillInvoiceSaveDto
    {
        public int SelfBillInvoiceID { get; set; }
        public decimal? GrossSales { get; set; }
        public decimal? VAT { get; set; }
        public decimal? Commission { get; set; }
        public string Notes { get; set; }
        public bool SignedOff { get; set; }
    }
}
