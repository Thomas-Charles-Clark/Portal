using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Documents
{
    public class InvoicesAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Invoices";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "Invoices_Attachments",
                "invoices/{controller}/{action}/{placement}/{emailId}/{fileName}",
                new { action = "Index" }
            );

            context.MapRoute(
                "Invoices_default",
                "invoices/{controller}/{action}",
                new { action = "Index" }
            );
        }
    }
}