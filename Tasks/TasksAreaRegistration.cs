using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal
{
    public class TasksAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Tasks";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "Tasks_Default",
                "tasks/{controller}/{action}/{id}",
                new { controller = "dashboard", action = "index", id = UrlParameter.Optional },
                new string[] { "Tasks.Controllers" }
                );
        }
    }
}