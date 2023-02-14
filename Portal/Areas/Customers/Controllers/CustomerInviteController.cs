using Microsoft.AspNet.Identity;
using Portal.Areas.Customers.ViewModels;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Customers.Controllers
{
    [DynamicRoleAuthorize]
    [RouteArea("customers")]
    [RoutePrefix("invite")]
    [Route("{action=index}")]
    public class InviteController : BaseController
    {
        public InviteController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        public ActionResult Index(string a)
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "invite" && p.AreaName == "customers" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            if (Session["selectedTradeAccountId"] == null)
            {
                Session["selectedTradeAccountId"] = user.TradeAccountID;
            }

            TradeAccountNumber_AutocompleteResult preselected = null;

            if (!String.IsNullOrEmpty(a))
            {
                preselected = PortalDb.TradeAccountNumber_Autocomplete(a, user.Id, null).FirstOrDefault();
            }

            var model = new CustomerInviteViewModel(
                preselected,
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("CustomerInvite", model);
        }
    }
}