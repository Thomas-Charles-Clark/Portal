using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Kendo.Mvc.UI;

namespace Portal.Areas.Invoices.Models
{
    public class PassMailboxFolderParams : DataSourceRequest
    {
        public int MailboxID { get; set; }
        public string MailboxFolderID { get; set; }
    }
}