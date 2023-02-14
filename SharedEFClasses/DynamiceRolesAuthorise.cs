using SharedEFClasses.Models;
using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Unity.Attributes;

namespace SharedEFClasses
{
    public class DynamicRoleAuthoriseAttribute : AuthorizeAttribute
    {
        [Dependency]
        public PortalDbContext appDbContext { get; set; }

        [Dependency]
        public ApplicationUserManager userManager { get; set; }

        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            var controller = httpContext.Request.RequestContext.RouteData.GetRequiredString("controller");

            var action = httpContext.Request.RequestContext.RouteData.GetRequiredString("action");

            var area = httpContext.Request.RequestContext.RouteData.DataTokens["area"] as string;

            if (area == null)
            {
                Roles = String.Join(",", appDbContext.Applications
                    .Where(p => p.ControllerName == controller.ToLower() &&
                                p.ActionName == action.ToLower())
                    .SelectMany(p => p.Application_Roles)
                    .Select(p => p.Role.Name).ToList().ToArray());
            }
            else
            {
                Roles = String.Join(",", appDbContext.Applications
                    .Where(p => p.ControllerName == controller.ToLower() &&
                                p.ActionName == action.ToLower() &&
                                p.AreaName == area.ToLower())
                    .SelectMany(p => p.Application_Roles)
                    .Select(p => p.Role.Name).ToList().ToArray());
            }

            // So this causes an issue if you're not Super Admin - the controller's actions being blanket-decorated
            // means that ALL the actions therein are put through the above check.
            // Potential solutions: 
            // add all actions to the applications table (no!)
            // do not decorate at the controller level, instead per-action (not ideal - have to remember to decorate each action)
            // find some other solution...?
            // like... inspect the method of the request (post / get) and bypass this application permissions check for POSTs?
            // no, because then any bugger could POST anything they liked?
            // what would you do instead...? Just ensure that they're logged in? How likely is it that some bugger will try to circumvent
            // the intended restrictions? it's not impossible. Therefore do NOT permit it.

            // With that in mind, are we now at the point of needing Applications to have Actions?

            if (Roles == "")
            {
                Roles = "Super Admin";
            }
            else
            {
                Roles += ",Super Admin";
            }

            // NOT IDEAL
            if (httpContext.Request.HttpMethod == "POST")
            {
                Roles = "";
            }

            return base.AuthorizeCore(httpContext);
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            if (!filterContext.HttpContext.User.Identity.IsAuthenticated)
            {
                // The user is not authenticated
                base.HandleUnauthorizedRequest(filterContext);
            }
            else if (!this.Roles.Split(',').Any(filterContext.HttpContext.User.IsInRole))
            {
                // The user is not in any of the listed roles => 
                // show the unauthorized view
                filterContext.Result = new ViewResult
                {
                    ViewName = "~/Views/Shared/Unauthorized.cshtml"
                };
            }
            else
            {
                base.HandleUnauthorizedRequest(filterContext);
            }
        }
    }
}
