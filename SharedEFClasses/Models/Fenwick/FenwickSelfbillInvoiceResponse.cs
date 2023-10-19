using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Fenwick
{
    public class FenwickSelfbillInvoiceResponse
    {
        public IEnumerable<FenwickInvoiceReconciliationSummary> RecSummaries { get; set; }
        public IEnumerable<FenwickInvoiceResult> Invoices { get; set; }
        public IEnumerable<FenwickInvoiceNotice> Notifications { get; set; }
    }
}
