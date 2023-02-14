using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal
{
    public class GDPRAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "GDPR";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "GDPR_Default",
                "GDPR/{controller}/{action}/{id}",
                new { controller = "Survey", action = "Index", id = UrlParameter.Optional },
                new string[] { "GDPR.Controllers" }
                );
        }
    }
}