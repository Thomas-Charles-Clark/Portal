using Microsoft.AspNet.Identity;
using Portal.Areas.Marketing.ViewModels;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses;
using SharedEFClasses.Models;
using System.Linq;
using System.Web.Mvc;

namespace Portal.Areas.Marketing.Controllers
{
    [DynamicRoleAuthorize]
    [RouteArea("marketing")]
    [RoutePrefix("messages")]
    [Route("{action=index}")]
    public class MarketingMessagesController : BaseController
    {
        public MarketingMessagesController(ApplicationUserManager userManager, PortalDbContext portalDbContext)
            : base(userManager, portalDbContext)
        {

        }

        [ActionName("index")]
        public ActionResult Index()
        {
            var action = System.Web.HttpContext.Current.Request.RequestContext.RouteData.GetRequiredString("action");
            var controller = System.Web.HttpContext.Current.Request.RequestContext.RouteData.GetRequiredString("controller");


            var application = PortalDb.Applications.Where(p =>
                p.AreaName == "marketing" &&
                p.ControllerName == controller && 
                p.ActionName == action).Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = new MarketingMessagesViewModel(user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("MarketingMessages", model);
        }
    }
}