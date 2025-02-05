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
using NLog.LayoutRenderers;

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
        public async Task<ActionResult> Index(string code)
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "giftvouchers" && p.AreaName == "customers" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            if (!String.IsNullOrEmpty(code))
            {
                var voucher = PortalDb.GiftVouchers.SingleOrDefault(gv => gv.Code == code);

                if (voucher == null)
                {
                    code = null;
                }
            }

            var model = await GiftVouchersViewModel.CreateAsync(
                code,
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("GiftVouchers", model);
        }

        public async Task<ActionResult> PDF(string code)
        {
            var gv = await PortalDb.GiftVoucher_Select(new PassGiftVoucher() { Code = code });

            var ms = Utilities.Documents.GiftVoucher.GiftVoucherPDFWriter.Generate(System.Web.Hosting.HostingEnvironment.MapPath("~"), gv);

            return File(ms.ToArray(), "application/pdf");
        }
    }
}