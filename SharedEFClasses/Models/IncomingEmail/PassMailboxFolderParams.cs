using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Kendo.Mvc.UI;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class PassMailboxFolderParams
    {
        public int MailboxID { get; set; }
        public string MailboxFolderID { get; set; }
        public IEnumerable<short> ActiveDirectoryGroupIDs { get; set; }
        public string BudgetHolderCode { get; set; }
        public sbyte? DateRangeID { get; set; }
        public DateTime? FromDT { get; set; }
        public DateTime? ToDT { get; set; }
        public bool? HasAttachments { get; set; }
        public byte EmailStatusID { get; set; }
        public bool? SupplierIdentified { get; set; }
        public string SupplierTypeCode { get; set; }
        public string SupplierCode { get; set; }
        public string FreeTextSearch { get; set; }

    }
}
