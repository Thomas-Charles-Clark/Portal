using Microsoft.AspNet.Identity;
using Portal.Areas.Orders.ViewModels;
using Portal.Areas.Press.ViewModels;
using Portal.Controllers;
using Portal.Models;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses;
using SharedEFClasses.Models;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Portal.Areas.Orders.Controllers
{
    [DynamicRoleAuthorize]
    [RouteArea("orderbook")]
    [RoutePrefix("summary")]
    [Route("{action=index}")]
    public class OrderBookSummaryController : BaseController
    {
        public OrderBookSummaryController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base (userManager, portalDbContext)
        {

        }

        // GET: OrderBook/Summary
        public async Task<ActionResult> Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "summary" && p.AreaName == "orderbook" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = await OrderBookSummaryViewModel.CreateAsync(
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("OrderBookSummary", model);
        }
    }
}