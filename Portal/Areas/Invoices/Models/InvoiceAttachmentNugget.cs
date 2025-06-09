using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Areas.Invoices.Models
{
    public class InvoiceAttachmentNugget
    {
        public long? AttachmentID { get; set; }

        public string LocalFileName { get; set; }

        public string FileName { get; set; }

        public byte[] Contents { get; set; }

        public string FileExtension
        {
            get
            {
                return System.IO.Path.GetExtension(FileName);
            }
        }

        public InvoiceAttachmentNugget(string localFileName, string fileName, byte[] contents, long? attachmentId)
        {
            LocalFileName = localFileName;
            FileName = fileName;
            Contents = contents;
            AttachmentID = attachmentId;
        }
    }
}