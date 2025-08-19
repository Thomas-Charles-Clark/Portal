using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Portal.Areas.Customers.Models
{
    public class PassAdvertiserMaintenanceSend
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public string ReplyTo { get; set; }
        public string Body { get; set; }
    }
}