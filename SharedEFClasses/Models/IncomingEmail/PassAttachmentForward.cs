using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class PassAttachmentForward
    {
        public long AttachmentID { get; set; }
        public int ForwardedByMemberID { get; set; }
        public int ForwardedToMemberID { get; set; }
        public string ForwardedToBudgetHolderCode { get; set; }
    }
}
