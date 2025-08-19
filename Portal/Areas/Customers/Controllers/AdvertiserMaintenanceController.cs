using Microsoft.AspNet.Identity;
using Portal.Areas.Customers.ViewModels;
using Portal.Models;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Customers.Controllers
{
    [DynamicRoleAuthorize]
    [RouteArea("customers")]
    [RoutePrefix("advertisers")]
    [Route("{action=index}")]
    public class AdvertiserMaintenanceController : BaseController
    {
        public AdvertiserMaintenanceController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        // GET: Customers/Pricing
        public async Task<ActionResult> Index(string a)
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "advertisers" && p.AreaName == "customers" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var fixedSalesMarketId = (byte?)null;

            if (user.Id == 8 ||
                UserManager.IsInRole(user.Id, "Advertiser Maintenance - FRANCE"))
            {
                fixedSalesMarketId = PortalDb.SalesMarkets.SingleOrDefault(s => s.Name == "France")?.SalesMarketID;
            }

            var model = await AdvertiserMaintenanceViewModel.CreateAsync(
                fixedSalesMarketId,
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("AdvertiserMaintenance", model);
        }
    }
}