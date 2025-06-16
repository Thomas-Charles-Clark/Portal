using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class InvoiceDueDateResult
    {
        public DateTime InvoiceDueDate { get; set; }
        public DateTime InvoiceSettlementDate { get; set; }
    }
}
