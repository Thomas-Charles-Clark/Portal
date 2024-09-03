using Microsoft.AspNet.Identity;

using Org.BouncyCastle.Bcpg;

using Portal.Areas.Parcel.ViewModels;
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
    [RouteArea("parcel")]
    [RoutePrefix("calculator")]
    [Route("{action=index}")]
    public class ParcelCalculatorController : BaseController
    {
        public ParcelCalculatorController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        public async Task<ActionResult> Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "calculator" && p.AreaName == "parcel" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            TradeAccountNumber_AutocompleteResult preselected = null;

            if (user.Id == 8)
            {
                preselected = PortalDb.TradeAccountNumber_Autocomplete("", user.Id, 91412).FirstOrDefault();
            }

            var model = await ParcelCalculatorViewModel.CreateAsync(
                user.Id,
                preselected,
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("ParcelCalculator", model);
        }
    }
}