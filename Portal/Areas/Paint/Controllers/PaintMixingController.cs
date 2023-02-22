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

namespace Portal.Areas.Paint.Controllers
{
    [DynamicRoleAuthorise]
    [RouteArea("paint")]
    [RoutePrefix("mixing")]
    public class MixingController : BaseController
    {
        public MixingController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        [Route("{mixingLocation}")]
        public async Task<ActionResult> Index(string mixingLocation)
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "mixing" && p.AreaName == "paint").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var location = PortalDb.MixingLocations.FirstOrDefault(ml => ml.URLKeywords.ToLower() == mixingLocation);

            if (location == null)
            {
                location = PortalDb.MixingLocations.Single(ml => ml.MixingLocationID == 2);
            }

            var model = await PaintMixingViewModel.CreateAsync(
                location.MixingLocationID,
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("PaintMixing", model);
        }

        public async Task<ActionResult> ViewBoxLabel(int mixingSessionId)
        {
            var model = await PortalDb.PaintGenerateBoxLabels(new PassMixingSessionID() { MixingSessionID = mixingSessionId });

            return View("_PaintLabelTemplate", model.BoxLabels.First());
        }
    }
}