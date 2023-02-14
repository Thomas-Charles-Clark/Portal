using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Documents
{
    public class DocumentsAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Documents";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "Documents_default",
                "documents/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}