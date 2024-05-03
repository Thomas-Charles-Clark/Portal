using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;

using Portal.Areas.Stock.ViewModels;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.RangeManagement;
using SharedEFClasses.SignalR.Hubs;

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Stock.Controllers
{
    [DynamicRoleAuthorise]
    [RouteArea("stock")]
    [RoutePrefix("range-management")]
    [Route("{action=index}")]
    public class RangeManagementController : BaseController
    {
        private ImageDownloadHub _imageDownloadHub;

        public ImageDownloadHub ImageDownloadHub
        {
            get
            {
                return _imageDownloadHub ?? HttpContext.GetOwinContext().Get<ImageDownloadHub>();
            }
            private set
            {
                _imageDownloadHub = value;
            }
        }

        public RangeManagementController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
        {

        }

        // GET: Stock/Management
        public ActionResult Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "RangeManagement" && p.AreaName == "stock" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var role = user.Roles.FirstOrDefault(r => r.Role.Id == 107);

            var model = new RangeManagementViewModel(
                sls: PortalDb.StockLocations.ToList(),
                readOnlyMode: role?.Role.Properties?.BranchIDs?.Any() == true,
                properties: user.GetActiveRoleProperties(),
                applicationHeading: application.Heading,
                applicationSubHeading: application.SubHeading);

            return View("RangeManagement", model);
        }

        [HttpPost]
        public async Task<ActionResult> ProductImagesDownload(RangeManagementXlsxDto dto)
        {
            foreach (var fileName in Directory.EnumerateFiles(Server.MapPath("~/Programmatic/ImageDownloads"), "*.zip"))
            {
                var fileInfo = new FileInfo(fileName);

                if (fileInfo.CreationTime < DateTime.Now.AddHours(-6))
                {
                    System.IO.File.Delete(fileName);
                }
            }

            var user = UserManager.FindById(Convert.ToInt32(User.Identity.GetUserId()));

            var archiveBaseName = $"{user.Id}_Export_{DateTime.Now.ToString("yyyy-MM-ddTHH_mm_ss")}";

            Response.Cookies.Add(new HttpCookie(dto.UserID, "done"));

            var imageList = PortalDb.ProductPage_Image_Select(dto);

            var tradeAccountCode = PortalDb.TradeAccounts.Single(ta => ta.TradeAccountID == dto.TradeAccountID).Code;

            _ = System.Threading.Tasks.Task.Run(() =>
            {
#pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
                ImageDownloadHub.StartTask(user, dto.TradeAccountCode, archiveBaseName, Server.MapPath("~/Programmatic/"), imageList);
#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
            });

            return Json(new { imageCount = imageList.Count }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult DownloadImageArchive(string archiveName)
        {
            var fullFilePath = $"{Server.MapPath("~/Programmatic/")}{archiveName}";

            Response.BufferOutput = false;

            return File(System.IO.File.OpenRead(fullFilePath), MimeMapping.GetMimeMapping(archiveName), archiveName);
        }
    }
}