using Microsoft.AspNet.Identity;
using Portal.Areas.Customers.ViewModels;
using Portal.Models;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Customers.Controllers
{
    [DynamicRoleAuthorize]
    [RouteArea("customers")]
    [RoutePrefix("maintenance")]
    [Route("{action=index}")]
    public class MaintenanceController : BaseController
    {
        public MaintenanceController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        // GET: Customers/Maintenance
        public ActionResult Index(string a)
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "maintenance" && p.AreaName == "customers" && p.ActionName == "index").Single();

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

            var model = new CustomerMaintenanceViewModel(
                preselected,
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("CustomerMaintenance", model);
        }

        // GET: customers/maintenance/creation-email
        [Route("creation-email")]
        public ActionResult CreationEmail(string a)
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "maintenance" && p.AreaName == "customers" && p.ActionName == "CreationEmail").Single();

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

            var model = new TradeAccountCreationEmailMaintenanceViewModel(
                preselected,
                PortalDb.SalesMarkets.Where(p => p.Code != "I" && p.Code != "M" && p.Code != "R").OrderBy(p => p.Name).ToList(),
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("CreationEmail/TradeAccountCreationEmail", model);
        }
    }
}