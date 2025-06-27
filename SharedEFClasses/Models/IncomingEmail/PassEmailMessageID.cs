using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SharedEFClasses.Models.IncomingEmail
{
    public class PassEmailMessageID
    {
        public long EmailID { get; set; }
        public int MailboxID { get; set; }
        public string EmailMessageID { get; set; }
    }
}