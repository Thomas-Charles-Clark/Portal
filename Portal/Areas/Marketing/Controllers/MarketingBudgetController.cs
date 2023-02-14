using Microsoft.AspNet.Identity;
using Portal.Areas.Marketing.ViewModels;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses.Models;
using SharedEFClasses;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Marketing.Controllers
{
    [DynamicRoleAuthorize(Roles = "Super Admin")]
    [RouteArea("marketing")]
    [RoutePrefix("budget")]
    [Route("{action=index}")]
    public class MarketingBudgetController : BaseController
    {
        public MarketingBudgetController(ApplicationUserManager userManager, PortalDbContext portalDbContext)
            : base(userManager, portalDbContext)
        {

        }

        // GET: Marketing/MarketingBudget
        [ActionName("index")]
        public ActionResult Index()
        {
            var action = System.Web.HttpContext.Current.Request.RequestContext.RouteData.GetRequiredString("action");
            var controller = System.Web.HttpContext.Current.Request.RequestContext.RouteData.GetRequiredString("controller");

            var application = PortalDb.Applications.Where(p =>
                p.AreaName == "marketing" &&
                p.ControllerName == controller &&
                p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = new MarketingBudgetViewModel(user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("MarketingBudget", model);
        }
    }
}