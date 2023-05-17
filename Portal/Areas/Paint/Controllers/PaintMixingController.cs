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
    [DynamicRoleAuthorise(actionNameAgnostic: true)]
    [RouteArea("paint")]
    [RoutePrefix("mixing")]
    public class MixingController : BaseController
    {
        public MixingController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        [Route("{mixingLocation}")]
        public ActionResult Index(string mixingLocation)
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "mixing" && p.AreaName == "paint" && p.ActionName == mixingLocation).FirstOrDefault();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var location = PortalDb.MixingLocations.FirstOrDefault(ml => ml.URLKeywords.ToLower() == mixingLocation);

            if (location == null)
            {
                throw new Exception("Sorry, could not determine mixing location.");
            }

            var model = PaintMixingViewModel.Create(
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

        public async Task<ActionResult> TransferManifestDemo()
        {
            var select = new PassTransferGridSelect() 
            { 
                MemberID = User.Identity.GetUserId<int>(),
                MixingLocationID = 1
            };

            var orders = await PortalDb.PaintTransferOrders(select);

            var model = new PaintTransferSaveResponse()
            {
                Notices = new PaintNotice(),
                TransferDescription = "Transfer Demonstration",
                TransferOrders = orders.Orders.Skip(0).Take(20)
            };

            return View("_PaintTransferManifest", model);
        }
    }
}