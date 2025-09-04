using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class PassInvoiceBookingDocumentDashboardParams
    {
        public int? MailboxID { get; set; }
        public IEnumerable<short> ActiveDirectoryGroupIDs { get; set; } = new List<short>();
        public string BudgetHolderCode { get; set; }
        public string SupplierCode { get; set; }
        public sbyte? DateRangeID { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
        public string SupplierTypeCode { get; set; }
        public string FreeTextSearch { get; set; }
        public string DateAffector { get; set; }
        public byte? AttachmentTypeID { get; set; }
        public byte? AttachmentStatusID { get; set; }
    }
}
