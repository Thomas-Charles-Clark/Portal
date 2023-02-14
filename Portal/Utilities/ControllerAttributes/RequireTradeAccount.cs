using Microsoft.AspNet.Identity;
using SharedEFClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Unity;
using Unity.Attributes;

namespace Portal.Utilities.ControllerAttributes
{
    public class RequireTradeAccount : ActionFilterAttribute
    {
        [Dependency]
        public ApplicationUserManager userManager { get; set; }

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var user = userManager.FindById(filterContext.HttpContext.User.Identity.GetUserId<int>());

            if (user.DefaultTradeAccount == null)
            {
                filterContext.Result = new RedirectToRouteResult(new System.Web.Routing.RouteValueDictionary(new
                {
                    controller = "Home",
                    action = "AccountConfigurationIssue",
                    area = String.Empty,
                    issue = HelperEnums.AccountConfigurationIssue.NoTradeAccount
                }));
            }
        }
    }
}