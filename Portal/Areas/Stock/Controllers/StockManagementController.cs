using Microsoft.AspNet.Identity;
using Portal.Areas.Stock.ViewModels;

using SharedEFClasses;
using SharedEFClasses.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Stock.Controllers
{
    [DynamicRoleAuthorise]
    [RouteArea("stock")]
    [RoutePrefix("management")]
    [Route("{action=index}")]
    public class ManagementController : BaseController
    {
        public ManagementController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        // GET: Stock/Management
        public ActionResult Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "management" && p.AreaName == "stock" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = new StockManagementViewModel(
                PortalDb.StockLocations.ToList(),
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("StockManagement", model);
        }
    }
}