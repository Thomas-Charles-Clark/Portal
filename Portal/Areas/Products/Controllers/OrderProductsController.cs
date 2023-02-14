using Microsoft.AspNet.Identity;
using Portal.Areas.Products.ViewModels;
using Portal.Models;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Products.Controllers
{
    [DynamicRoleAuthorize]
    [RouteArea("products")]
    [RoutePrefix("order")]
    [Route("{action=index}")]
    public class OrderController : BaseController
    {
        public OrderController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        // GET: Products/Order
        public ActionResult Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "order" && p.AreaName == "products" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = new OrderProductsViewModel(
                PortalDb.HoldReasons.Where(p => p.Deleted == false).ToList(),
                PortalDb.OrderImportSources.ToList(),
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("OrderProducts", model);
        }

        //[HttpPost]
        //public ActionResult VerifyQuickAddProductCode(string code)
        //{
        //    return Json(portalDb.Products.Where(p => p.Code == code && p.Deleted == false).Select(p => p.ProductID).SingleOrDefault(), JsonRequestBehavior.DenyGet);
        //}

        //[HttpPost]
        //public ActionResult LoadQuickAddExtraneousData(int tradeAccountId, int productId)
        //{
        //    var result = portalDb.OrderEntryProductSearch(new PassOrderEntryProductSearch() { TradeAccountID = tradeAccountId, ProductID = productId });

        //    return Json(result.FirstOrDefault() ?? (object)new { }, JsonRequestBehavior.DenyGet);
        //}
    }
}