using Microsoft.AspNet.Identity;
using Portal.Areas.Products.ViewModels;
using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Products.Controllers
{
    [DynamicRoleAuthorise]
    [RouteArea("products")]
    [RoutePrefix("delivery")]
    [Route("{action=index}")]
    public class DeliveryController : BaseController
    {
        public DeliveryController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        // GET: Products/Delivery
        public ActionResult Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "delivery" && p.AreaName == "products" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = new ProductDeliveryViewModel(
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("ProductDelivery", model);
        }
    }
}