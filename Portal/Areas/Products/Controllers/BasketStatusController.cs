using Microsoft.AspNet.Identity;
using Portal.Areas.Products.ViewModels;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Products.Controllers
{
    [DynamicRoleAuthorise]
    [RouteArea("products")]
    [RoutePrefix("basketstatus")]
    [Route("{action=index}")]
    public class BasketStatusController : BaseController
    {
        public BasketStatusController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        public async Task<ActionResult> Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "basketstatus" && p.AreaName == "products" && p.ActionName == "index").Single();

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
                preselected = PortalDb.TradeAccountNumber_Autocomplete("", user.Id, 36691).FirstOrDefault();
            }

            var model = await BasketStatusViewModel.CreateAsync(
                //preselected,
                null,
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("BasketStatus", model);
        }

        public async Task<ActionResult> IndexPartial()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "basketstatus" && p.AreaName == "products" && p.ActionName == "index").Single();

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
                preselected = PortalDb.TradeAccountNumber_Autocomplete("", user.Id, 36691).FirstOrDefault();
            }

            var model = await BasketStatusViewModel.CreateAsync(
                //preselected,
                null,
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            ViewBag.Partial = true;

            return View("BasketStatus", model);
        }
    }
}