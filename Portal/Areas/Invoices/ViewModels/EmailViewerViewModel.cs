using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using SharedEFClasses.Models.IncomingEmail;

namespace Portal.Areas.Invoices.ViewModels
{
    public class EmailViewerViewModel
    {
        public FullEmail Email { get; set; }

        public EmailViewerViewModel(FullEmail em)
        {
            Email = em;
        }
    }
}