using Microsoft.AspNet.Identity;
using Portal.Areas.Translations.ViewModels;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Translations.Controllers
{
    [DynamicRoleAuthorize]
    [RouteArea("translations")]
    [RoutePrefix("resources")]
    [Route("{action=index}")]
    public class ResourcesController : BaseController
    {
        public ResourcesController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        public ActionResult Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "resources" && p.AreaName == "translations" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = new TranslateResourcesViewModel(user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("TranslateResources", model);
        }
    }
}