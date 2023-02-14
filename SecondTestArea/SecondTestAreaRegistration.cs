using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal
{
    public class SecondTestAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "SecondTestArea";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "SecondTest_Default",
                "SecondTest/{controller}/{action}/{id}",
                new { controller = "SecondTest", action = "Index", id = UrlParameter.Optional },
                new string[] { "SecondTestArea.Controllers" }
                );
        }
    }
}