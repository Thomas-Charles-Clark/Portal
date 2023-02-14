using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal
{
    public class SalesStatisticsAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "SalesStatistics";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "SalesStatistics_Default",
                "sales-statistics/{controller}/{action}/{id}",
                new { controller = "sales", action = "index", id = UrlParameter.Optional },
                new string[] { "SalesStatistics.Controllers" }
                );
        }
    }
}