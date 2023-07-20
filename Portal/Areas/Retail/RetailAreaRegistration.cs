using System.Web.Mvc;

namespace Portal.Areas.Retail
{
    public class RetailAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "retail";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "retail_default",
                "retail/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}