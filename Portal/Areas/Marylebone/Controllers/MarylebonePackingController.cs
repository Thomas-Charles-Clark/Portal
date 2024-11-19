using Microsoft.AspNet.Identity;
using Portal.Areas.Fenwick.ViewModels;
using SharedEFClasses.Models;
using SharedEFClasses;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Portal.Areas.Marylebone.ViewModels;

namespace Portal.Areas.Marylebone.Controllers
{
    [DynamicRoleAuthorise(actionNameAgnostic: true)]
    [RouteArea("marylebone")]
    [RoutePrefix("packing")]
    public class PackingController : BaseController
    {
        public PackingController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        public ActionResult Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "packing" && p.AreaName == "marylebone" && p.ActionName == "index").FirstOrDefault();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = MarylebonePackingViewModel.Create(
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("MarylebonePacking", model);
        }
    }
}