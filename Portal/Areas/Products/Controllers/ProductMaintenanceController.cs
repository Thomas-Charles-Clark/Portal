using Microsoft.AspNet.Identity;

using Org.BouncyCastle.Bcpg;

using Portal.Areas.Products.ViewModels;
using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Products.Controllers
{
    [DynamicRoleAuthorise]
    [RouteArea("products")]
    [RoutePrefix("maintenance")]
    [Route("{action=index}")]
    public class MaintenanceController : BaseController
    {
        public MaintenanceController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        public async Task<ActionResult> Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "maintenance" && p.AreaName == "products" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = await ProductMaintenanceViewModel.CreateAsync(
                user.Id,
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("ProductMaintenance", model);
        }

        public async Task<ActionResult> Treatments()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "maintenance" && p.AreaName == "products" && p.ActionName == "treatments").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = await TreatmentMaintenanceViewModel.CreateAsync(
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("TreatmentMaintenance", model);
        }

        public async Task<ActionResult> ProductTypes()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "maintenance" && p.AreaName == "products" && p.ActionName == "producttypes").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = await ProductTypeMaintenanceViewModel.CreateAsync(
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("ProductTypeMaintenance", model);
        }
    }
}