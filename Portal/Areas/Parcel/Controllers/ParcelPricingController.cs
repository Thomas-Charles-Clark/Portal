using Microsoft.AspNet.Identity;

using Portal.Areas.Parcel.ViewModels;

using SharedEFClasses;
using SharedEFClasses.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Parcel.Controllers
{
    [DynamicRoleAuthorise]
    [RouteArea("parcel")]
    [RoutePrefix("pricing")]
    [Route("{action=index}")]
    public class ParcelPricingController : BaseController
    {
        public ParcelPricingController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        public async Task<ActionResult> Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "pricing" && p.AreaName == "parcel" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = await ParcelPricingViewModel.CreateAsync(
                user.Id,
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("ParcelPricing", model);
        }
    }
}