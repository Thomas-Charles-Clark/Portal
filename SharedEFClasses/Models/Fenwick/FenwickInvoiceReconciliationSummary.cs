using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Fenwick
{
    public class FenwickInvoiceReconciliationSummary
    {
        public int SortOrder { get; set; }
        public string Label { get; set; }
        public decimal SelfBillInvoice_Value { get; set; }
        public decimal Invoice_Value { get; set; }
        public decimal Variance_Value { get; set; }
    }
}
