using SharedEFClasses.Models;

using System.Web.Mvc;

namespace Portal.Areas.Paint
{
    public class PaintAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Paint";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "Paint_Mixing",
                "paint/mixing/{mixingLocation}",
                new { Area = "Paint", Controller = "Mixing", Action = "Index",  mixingLocation = UrlParameter.Optional }
            );
        }
    }
}