using System.Web.Mvc;

namespace Portal.Areas.Accounts
{
    public class AccountsAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "accounts";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "accounts_default",
				"accounts/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}