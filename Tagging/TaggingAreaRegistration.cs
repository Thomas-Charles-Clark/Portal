using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal
{
    public class TaggingAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Tagging";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "Tagging_Default",
                "tagging/{controller}/{action}/{id}",
                new { controller = "tagging", action = "index", id = UrlParameter.Optional },
                new string[] { "Tagging.Controllers" }
                );
        }
    }
}