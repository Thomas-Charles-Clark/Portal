using System.Web.Mvc;

namespace Portal.Areas.Marylebone
{
    public class MaryleboneAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Marylebone";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Marylebone_default",
                "Marylebone/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}