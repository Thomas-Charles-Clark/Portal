using Microsoft.AspNet.Identity;
using Portal.Areas.Orders.ViewModels;
using Portal.Controllers;
using Portal.Models;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using System.Linq;
using System.Web.Mvc;

namespace Portal.Areas.Orders.Controllers
{
    [DynamicRoleAuthorize]
    [RouteArea("orders")]
    [RoutePrefix("neiman-marcus")]
    [Route("{action=status}")]
    public class NeimanMarcusController : BaseController
    {
        public NeimanMarcusController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base (userManager, portalDbContext)
        {

        }

        // GET: Orders/Neiman-Marcus/Status
        public ActionResult Status()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "neimanmarcus" && p.AreaName == "orders" && p.ActionName == "status").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = new NeimanMarcusOrderStatusViewModel(
                user.GetActiveRoleProperties(), 
                application.Heading, 
                application.SubHeading);

            return View("NeimanMarcusOrderStatus", model);
        }
    }
}