using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Translations
{
    public class TranslationsAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "translations";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "translations_default",
                "translations/{controller}/{action}/{id}",
                defaults: new { action = "index", id = UrlParameter.Optional }
            );
        }
    }
}