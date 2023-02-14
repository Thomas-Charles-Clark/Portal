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
    [RoutePrefix("ringfence")]
    [Route("{action=index}")]
    public class RingFenceController : BaseController
    {
        public RingFenceController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        // GET: Products/Delivery
        public ActionResult Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "ringfence" && p.AreaName == "stock" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = new RingFenceViewModel(
                PortalDb.StockLocations.ToList(),
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("RingFence", model);
        }
    }
}