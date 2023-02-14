using Microsoft.AspNet.Identity;
using Portal.Areas.Products.ViewModels;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Products.Controllers
{
    [DynamicRoleAuthorize]
    [RouteArea("products")]
    [RoutePrefix("furniture")]
    [Route("{action=index}")]
    public class FurnitureController : BaseController
    {
        public FurnitureController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        // GET: Products/Order
        public ActionResult Index(string model)
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "furniture" && p.AreaName == "products" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            int? preselectedModelId = null;

            if (!String.IsNullOrEmpty(model))
            {
                preselectedModelId = PortalDb.FurnitureModels.Where(p => p.Code == model).SingleOrDefault()?.ModelID;
            }

            var viewModel = new FurnitureMaintenanceViewModel(
                preselectedModelId,
                PortalDb.FurnitureSuppliers.Where(p => p.Deleted == false).OrderBy(p => p.Name).ToList(),
                PortalDb.FurnitureComponents.Where(p => p.Deleted == false).OrderBy(p => p.SortOrder).ToList(),
                PortalDb.FurnitureMaterialGroups.Where(p => p.Deleted == false).OrderBy(p => p.SortOrder).ToList(),
                PortalDb.FurnitureCushionFillings.Where(p => p.Deleted == false).OrderBy(p => p.CushionFillingID).ToList(),
                PortalDb.FurnitureCoverTypes.Where(p => p.Deleted == false).OrderBy(p => p.CoverTypeID).ToList(),
                PortalDb.FurnitureLegTypes.Where(p => p.Deleted == false).OrderBy(p => p.LegTypeID).ToList(),
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("FurnitureMaintenance", viewModel);
        }
    }
}