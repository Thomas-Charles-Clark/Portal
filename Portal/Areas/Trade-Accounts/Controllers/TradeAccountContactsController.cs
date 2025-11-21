using Microsoft.AspNet.Identity;
using Portal.Areas.Customers.ViewModels;
using Portal.Areas.TradeAccounts.ViewModels;
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
    [RouteArea("trade-accounts")]
    [RoutePrefix("contacts")]
    [Route("{action=index}")]
    public class TradeAccountContactsController : BaseController
    {
        public TradeAccountContactsController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        public ActionResult Index(string a)
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "contacts" && p.AreaName == "trade-accounts" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = new TradeAccountContactsViewModel(
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View(viewName: "TradeAccountContacts", model);
        }
    }
}