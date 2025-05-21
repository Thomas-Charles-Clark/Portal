using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Areas.Invoices.Models
{
    public class PassEmailMessageID
    {
        public long EmailID { get; set; }
        public int MailboxID { get; set; }
        public string EmailMessageID { get; set; }
    }
}