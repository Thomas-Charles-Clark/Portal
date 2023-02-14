using Downloads.ViewModels;
using SharedEFClasses;
using SharedEFClasses.Models;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SharedEFClasses.Models.General;

namespace Downloads.Controllers
{
    [DynamicRoleAuthorise]
    public class ProductsController : BaseController
    {
        public ProductsController(ApplicationUserManager UserManager, PortalDbContext PortalDb) : base(UserManager, PortalDb)
        {

        }

        // GET: Downloads
        public ActionResult Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "products" && p.AreaName == "downloads" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var selected = user.DefaultTradeAccount;

            var model = new DownloadProductsViewModel(
                PortalDb,
                selected,
                application.Heading, 
                application.SubHeading, 
                user.GetActiveRoleProperties());

            return View("downloadproducts", model);
        }

        public ActionResult AdvertisingDownloadWebQuality(string fileName)
        {
            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            if (fileName == "invalid")// || user == null ? true : !user.Approved)
            {
                Response.StatusCode = 500;
                return Content("Invalid filename");
            }
            else
            {
                var item = PortalDb.AdvertisingImages.Where(p => p.UniqueWebQualityFilename == fileName).SingleOrDefault();

                if (item == null) // we should log this and redirect the user to a not found page
                {
                    Response.StatusCode = 404;
                    return Content("File not found");
                }
                else
                {
                    var fullPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Areas/Downloads/Content/AdvertisingImages/vdir/WebQuality") + "\\" + fileName;

                    if (System.IO.File.Exists(fullPath))
                    {
                        PortalDb.Member_AdvertisingImage_Insert(new PassAdvertisingImageUsage()
                        {
                            MemberID = user.MemberID,
                            AdvertisingImageID = item.AdvertisingImageID,
                            AdvertisingImageTypeID = false,
                            CountryID = user.CountryID,
                            LanguageID = user.LanguageID
                        });

                        var f = System.IO.File.OpenRead(fullPath);

                        return File(f, MimeMapping.GetMimeMapping(fileName), item.WebQualityFilename);
                    }
                    else // we should log this and redirect the user to a not found page
                    {
                        Response.StatusCode = 404;
                        return Content("File not found");
                    }
                }
            }
        }

        public ActionResult AdvertisingDownloadPrintQuality(string fileName)
        {
            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            if (fileName == "invalid")// || user == null ? true : !user.Approved)
            {
                Response.StatusCode = 500;
                return Content("Invalid filename");
            }
            else
            {
                var item = PortalDb.AdvertisingImages.Where(p => p.UniquePrintQualityFilename == fileName).SingleOrDefault();

                if (item == null) // we should log this and redirect the user to a not found page
                {
                    Response.StatusCode = 404;
                    return Content("File not found");
                }
                else
                {
                    var fullPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Areas/Downloads/Content/AdvertisingImages/vdir/PrintQuality") + "\\" + fileName;

                    if (System.IO.File.Exists(fullPath))
                    {
                        PortalDb.Member_AdvertisingImage_Insert(new PassAdvertisingImageUsage()
                        {
                            MemberID = user.MemberID,
                            AdvertisingImageID = item.AdvertisingImageID,
                            AdvertisingImageTypeID = true,
                            CountryID = user.CountryID,
                            LanguageID = user.LanguageID
                        });

                        var f = System.IO.File.OpenRead(fullPath);

                        return File(f, MimeMapping.GetMimeMapping(fileName), item.PrintQualityFilename);
                    }
                    else // we should log this and redirect the user to a not found page
                    {
                        Response.StatusCode = 404;
                        return Content("File not found");
                    }
                }
            }
        }

    }
}