using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Fenwick
{
    public class SelfBillInvoiceDocumentUpsertDto
    {
        public int SelfBillInvoiceID { get; set; }
        public byte[] Bytes { get; set; }
    }
}
