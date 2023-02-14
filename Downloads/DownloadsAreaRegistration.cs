using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal
{
    public class DownloadsAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Downloads";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "AdvertisingDownloadWebRoute",
                "advertising/downloadweb/{fileName}",
                new { controller = "Products", action = "AdvertisingDownloadWebQuality", filename = "invalid" },
                new string[] { "Downloads.Controllers" }
            );

            context.MapRoute(
                "AdvertisingDownloadPrintRoute",
                "advertising/downloadprint/{fileName}",
                new { controller = "Products", action = "AdvertisingDownloadPrintQuality", filename = "invalid" },
                new string[] { "Downloads.Controllers" }
            );

            context.MapRoute(
                "Downloads_Default",
                "downloads/{controller}/{action}/{id}",
                new { controller = "products", action = "index", id = UrlParameter.Optional },
                new string[] { "Downloads.Controllers" }
                );
        }
    }
}