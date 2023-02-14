using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Documents
{
    public class ApplicationGroupsAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "ApplicationGroups";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "ApplicationGroups_default",
                "applicationgroups/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}