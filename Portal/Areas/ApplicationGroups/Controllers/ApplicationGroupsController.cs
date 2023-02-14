using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using Portal.Areas.ApplicationGroups.ViewModels;
using Portal.Controllers;
using Portal.Models;
using Portal.Utilities.Document;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Documents;
using System;
using System.Linq;
using System.Text;
using System.Web.Mvc;

namespace Portal.Areas.ApplicationGroups.Controllers
{
    [DynamicRoleAuthorize]
    [RouteArea("applicationgroups")]
    [RoutePrefix("manage")]
    [Route("{action=index}")]
    public class ApplicationGroupsController : BaseController
    {
        public ApplicationGroupsController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base (userManager, portalDbContext)
        {

        }

        // GET: Orders/Trade
        public ActionResult Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "manage" && p.AreaName == "applicationgroups" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = new ApplicationGroupsViewModel(
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("ManageApplicationGroups", model);
        }
    }
}