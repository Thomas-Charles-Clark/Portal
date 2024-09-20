using Microsoft.AspNet.Identity;
using Portal.Areas.Customers.ViewModels;
using Portal.Areas.Products.Models;
using Portal.Models;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;

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

        public async Task<ActionResult> PDF(short id)
        {
            var gv = await PortalDb.GiftVouchers.Include(p => p.PriceList).SingleAsync(p => p.GiftVoucherID == id);

            var ms = Utilities.Documents.GiftVoucher.GiftVoucherPDFWriter.Generate(System.Web.Hosting.HostingEnvironment.MapPath("~"), gv);

            return File(ms.ToArray(), "application/pdf");
        }
    }
}