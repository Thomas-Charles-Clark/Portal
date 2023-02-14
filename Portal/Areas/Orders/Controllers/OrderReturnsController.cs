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
    [RoutePrefix("returns")]
    [Route("{action=index}")]
    public class ReturnsController : BaseController
    {

        public ReturnsController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base (userManager, portalDbContext)
        {

        }

        // GET: Orders/Trade
        public ActionResult Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "returns" && p.AreaName == "orders" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            if (Session["selectedTradeAccountId"] == null)
            {
                Session["selectedTradeAccountId"] = user.TradeAccountID;
            }
            else
            {

            }

            TradeAccountNumber_AutocompleteResult preselected = null;

            if (user.Id == 8)
            {
                preselected = PortalDb.TradeAccountNumber_Autocomplete("", user.Id, 1644).FirstOrDefault();
            }

            var model = new TradeOrdersReturnsViewModel(
                preselected,
                PortalDb.UPSAccounts.Where(p => p.Deleted == false).OrderBy(p => p.AccountID).ToList(),
                user.GetActiveRoleProperties(), 
                application.Heading, 
                application.SubHeading);

            return View("Returns", model);
        }
    }
}