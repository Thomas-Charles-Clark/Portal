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
    [RoutePrefix("enquiry")]
    [Route("{action=index}")]
    public class EnquiryController : BaseController
    {

        public EnquiryController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base (userManager, portalDbContext)
        {

        }

        // GET: Orders/Trade
        public ActionResult Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "enquiry" && p.AreaName == "orders" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            if (Session["selectedTradeAccountId"] == null)
            {
                Session["selectedTradeAccountId"] = user.TradeAccountID;
            }
            else
            {

            }

            var model = new TradeOrdersEnquiryViewModel(user.GetActiveRoleProperties(), application.Heading, application.SubHeading);

            return View("TradeOrderEnquiry", model);
        }
    }
}