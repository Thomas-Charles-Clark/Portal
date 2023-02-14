using Microsoft.AspNet.Identity;
using Portal.Areas.Orders.ViewModels;
using Portal.Controllers;
using Portal.Models;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses;
using SharedEFClasses.Models;
using System.Linq;
using System.Web.Mvc;

namespace Portal.Areas.Orders.Controllers
{
    [DynamicRoleAuthorize]
    [RouteArea("orders")]
    [RoutePrefix("tracking")]
    [Route("{action=index}")]
    public class TrackingController : BaseController
    {

        public TrackingController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base (userManager, portalDbContext)
        {

        }

        // GET: Orders/Trade
        public ActionResult Index(int? orderId)
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "tracking" && p.AreaName == "orders" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = new OrderTrackingViewModel(user.GetActiveRoleProperties(), application.Heading, application.SubHeading, orderId);

            return View("OrderTracking", model);
        }
    }
}