using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal
{
    public class ProjectsAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Projects";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "Projects_Default",
                "projects/{controller}/{action}/{id}",
                new { controller = "dashboard", action = "index", id = UrlParameter.Optional },
                new string[] { "Projects.Controllers" }
                );
        }
    }
}