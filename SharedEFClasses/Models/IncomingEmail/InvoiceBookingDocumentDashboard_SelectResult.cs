using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class InvoiceBookingDocumentDashboard_SelectResult
    {
        public string Title { get; set; }
        public string HTMLDetails { get; set; }
        public string CSSClasses { get; set; }
        public byte SortOrder { get; set; }
    }

    /*
     
     
        public string SearchKeywords { get; set; }
        public short? AttachmentTypeID { get; set; }
        public byte? AttachmentStatusID { get; set; }


     */
}
