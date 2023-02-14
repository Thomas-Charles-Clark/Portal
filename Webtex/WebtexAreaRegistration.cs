using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal
{
    public class WebtexAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Webtex";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "Webtex_Default",
                "webtex/{controller}/{action}/{id}",
                new { controller = "admin", action = "index", id = UrlParameter.Optional },
                new string[] { "Webtex.Controllers" }
                );
        }
    }
}