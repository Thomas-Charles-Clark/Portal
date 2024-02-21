using System.Web.Mvc;

namespace Portal.Areas.Press
{
    public class PressAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "press";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "press_default",
                "press/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}