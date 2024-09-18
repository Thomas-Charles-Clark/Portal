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
    [RoutePrefix("gift-vouchers")]
    [Route("{action=index}")]
    public class GiftVouchersController : BaseController
    {
        public GiftVouchersController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        // GET: Customers/Pricing
        public async Task<ActionResult> Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "gift-vouchers" && p.AreaName == "customers" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = await GiftVouchersViewModel.CreateAsync(
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("GiftVouchers", model);
        }
    }
}