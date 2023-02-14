using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace Portal.Areas.Stock
{
    public class StockAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "stock";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "stock_default",
                "stock/{controller}/{action}/{id}",
                defaults: new { action = "index", id = UrlParameter.Optional }
            );
        }
    }
}