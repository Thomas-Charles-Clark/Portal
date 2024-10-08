using System.Web.Mvc;

namespace Portal.Areas.Email
{
    public class EmailAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "email";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "email_default",
                "email/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}