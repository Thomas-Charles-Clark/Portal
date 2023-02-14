using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Portal
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.IgnoreRoute("{*apple}", new { apple = @"(.*/)?apple-touch-icon.*\.png(/.*)?" });

            routes.MapMvcAttributeRoutes();
            
            AreaRegistration.RegisterAllAreas();

            routes.MapRoute(
                name: "TradeDownloadsExampleCSV",
                url: "downloads/trade-order-import-example",
                defaults: new { controller = "import", action = "DownloadExampleCSV", area = "orders" }
            );

            routes.MapRoute(
                name: "TradeDownloadsCSVSpecification",
                url: "downloads/trade-order-import-specification",
                defaults: new { controller = "import", action = "DownloadCSVSpecification", area = "orders" }
            );

            //routes.MapRoute(
            //    name: "AdvertisingDownloadWebRoute",
            //    url: "advertising/downloadweb/{fileName}",
            //    defaults: new { Area = "Downloads", controller = "Products", action = "AdvertisingDownloadWebQuality", filename = "invalid" }
            //);

            //routes.MapRoute(
            //    name: "AdvertisingDownloadPrintRoute",
            //    url: "advertising/downloadprint/{fileName}",
            //    defaults: new { Area = "Downloads", controller = "Products", action = "AdvertisingDownloadPrintQuality", filename = "invalid" }
            //);

            routes.MapRoute(
                name: "MajorError",
                url: "major-error",
                defaults: new { controller = "Home", action = "major-error" }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
