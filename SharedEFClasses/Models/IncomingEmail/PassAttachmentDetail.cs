using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class PassAttachmentDetail
    {
        public long AttachmentID { get; set; }

        public short AttachmentTypeID { get; set; }

        public int MemberID { get; set; }

        public string FormDataJSON { get; set; }
    }
}
