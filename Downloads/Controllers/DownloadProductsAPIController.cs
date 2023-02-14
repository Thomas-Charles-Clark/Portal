using Downloads.Utilities;
using Microsoft.AspNet.Identity;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
//using System.Web.Mvc;
using NLog;
using System.Net.Http.Headers;
using Renci.SshNet;
using System.Xml.Linq;
using Microsoft.Build.Evaluation;
using Microsoft.Build.Execution;
using Microsoft.Build.Logging;
using System.Text;
using SharedEFClasses.Models.Products;

namespace Downloads.Controllers
{
    [System.Web.Http.Authorize]
    public class DownloadProductsAPIController : ApiController
    {
        private Logger Logger = LogManager.GetCurrentClassLogger();

        private PortalDbContext portalDb { get; set; }

        private ApplicationUserManager userManager { get; set; }

        public DownloadProductsAPIController(ApplicationUserManager userManager, PortalDbContext portalDb)
        {
            this.userManager = userManager;
            this.portalDb = portalDb;
        }

        public IHttpActionResult DownloadSearch([FromBody]PassProductSearch objSearch)
        {
            var results = portalDb.DownloadSearch(objSearch);

            return Ok(results);
        }
        
        [HttpPost]
        public HttpResponseMessage ProductImagesDownloadExcelSpreadsheet([FromBody]PassDownloadBasket objBasket)
        {
            var user = userManager.FindById(User.Identity.GetUserId<int>());

            // well this won't bloody well work... we were previously taking the Market property off the 
            // mertex account check...
            //var market = portalportalDb.Markets.Where(p => p.Code == use Market).SingleOrDefault();

            //if (market != null)
            //    displayPrices = market.DisplayPrices;

            //if (user.CustomerType == "M")
            //    displayPrices = true;
            
            var displayPrices = false;

            var displayClearance = false;

            try
            {
                /* Right, we have problems...
                 * 
                 * displayPrices 
                 * displayClearance
                 * 
                 */

                var data = portalDb.ProductPageFeedExcelXML(user.Id, user.CountryID, user.LanguageID, displayPrices, displayClearance, objBasket);

                var unique = Guid.NewGuid().ToString();

                var dirPath = System.Web.Hosting.HostingEnvironment.MapPath("~/ExcelSpreadsheets/");

                if (!Directory.Exists(dirPath))
                {
                    Directory.CreateDirectory(dirPath);
                }

                var filePath = System.Web.Hosting.HostingEnvironment.MapPath("~/ExcelSpreadsheets/" + unique + ".xlsx");

                var products = data.Elements().Where(p => p.Name == "Products").Elements().Where(p => p.Name == "Product").ToList();

                SpreadsheetHelper.WriteSpreadsheet(displayClearance, filePath, products);

                var f = System.IO.File.OpenRead(filePath);
                
                var resultMessage = new HttpResponseMessage(HttpStatusCode.OK);

                resultMessage.Content = new StreamContent(f);

                resultMessage.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

                return resultMessage;
            }
            catch (Exception ex)
            {
                Logger.Fatal("Excel Spreadsheet Download Error", ex, user.Id, user.CountryID, user.LanguageID, displayPrices, objBasket);
                throw ex;
            }
        }
        
        //[HttpPost]
        //public HttpResponseMessage ProductImagesDownloadExcelSpreadsheetEarlyAccess([FromBody]PassDownloadBasket objBasket)
        //{
        //    var user = userManager.FindById(User.Identity.GetUserId<int>());

        //    var displayPrices = false;

        //    var displayClearance = false;

        //    //var market = portalDb.Mertex_Markets.Where(p => p.Code == user.Market).SingleOrDefault();

        //    //if (market != null)
        //    //    displayPrices = market.DisplayPrices;

        //    //if (user.CustomerType == "M")
        //    //    displayPrices = true;

        //    try
        //    {
        //        var data = portalDb.ProductFeedExcelXMLEarlyAccess(user.Id, user.CountryID, user.LanguageID, displayPrices, displayClearance, objBasket);

        //        var unique = Guid.NewGuid().ToString();

        //        var dirPath = System.Web.Hosting.HostingEnvironment.MapPath("~/ExcelSpreadsheets/");

        //        if (!Directory.Exists(dirPath))
        //        {
        //            Directory.CreateDirectory(dirPath);
        //        }

        //        var filePath = System.Web.Hosting.HostingEnvironment.MapPath("~/ExcelSpreadsheets/" + unique + ".xlsx");

        //        var products = data.Elements().Where(p => p.Name == "Products").Elements().Where(p => p.Name == "Product").ToList();

        //        SpreadsheetHelper.WriteEarlyAccessSpreadsheet(displayClearance, filePath, products);

        //        var f = System.IO.File.OpenRead(filePath);
                
        //        var resultMessage = new HttpResponseMessage(HttpStatusCode.OK);

        //        resultMessage.Content = new StreamContent(f);

        //        resultMessage.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

        //        return resultMessage;
        //    }
        //    catch (Exception ex)
        //    {
        //        Logger.Fatal("Excel Spreadsheet Download Error", ex, user.Id, user.CountryID, user.LanguageID, displayPrices, objBasket);
        //        throw ex;
        //    }
        //}
        
        [HttpPost]
        public HttpResponseMessage ProductImagesDownloadMagentoXML([FromBody]PassDownloadBasket objBasket)
        {
            var user = userManager.FindById(User.Identity.GetUserId<int>());
            
            var displayPrices = false;
            
            //var market = portalDb.Mertex_Markets.Where(p => p.Code == user.Market).SingleOrDefault();

            //if (market != null)
            //    displayPrices = market.DisplayPrices;

            var xDocMagento = portalDb.ProductPageFeedMagentoXML(user.Id, user.CountryID, user.LanguageID, displayPrices, objBasket);

            var unique = Guid.NewGuid().ToString();

            var dirPath = System.Web.Hosting.HostingEnvironment.MapPath("~/MagentoXML/");

            if (!Directory.Exists(dirPath))
            {
                Directory.CreateDirectory(dirPath);
            }

            var filePath = System.Web.Hosting.HostingEnvironment.MapPath("~/MagentoXML/" + unique + ".xml");

            xDocMagento.Save(filePath);

            var f = System.IO.File.OpenRead(filePath);
            
            var resultMessage = new HttpResponseMessage(HttpStatusCode.OK);

            resultMessage.Content = new StreamContent(f);

            resultMessage.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

            return resultMessage;
        }

        [HttpPost]
        public HttpResponseMessage ProductImagesDownloadWooCommerceXML([FromBody]PassDownloadBasket objBasket)
        {
            var user = userManager.FindById(User.Identity.GetUserId<int>());
            
            var displayPrices = false;
            
            //var market = portalDb.Mertex_Markets.Where(p => p.Code == user.Market).SingleOrDefault();

            //if (market != null)
            //    displayPrices = market.DisplayPrices;
            
            var xDocMagento = portalDb.ProductPageFeedWooCommerceXML(user.Id, user.CountryID, user.LanguageID, displayPrices, objBasket);

            var unique = Guid.NewGuid().ToString();

            var dirPath = System.Web.Hosting.HostingEnvironment.MapPath("~/WooCommerceXML/");

            if (!Directory.Exists(dirPath))
            {
                Directory.CreateDirectory(dirPath);
            }

            var filePath = System.Web.Hosting.HostingEnvironment.MapPath("~/WooCommerceXML/" + unique + ".xml");

            xDocMagento.Save(filePath);

            var f = System.IO.File.OpenRead(filePath);
            
            var resultMessage = new HttpResponseMessage(HttpStatusCode.OK);

            resultMessage.Content = new StreamContent(f);

            resultMessage.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

            return resultMessage;
        }
        
        [HttpPost]
        public HttpResponseMessage ProductImagesDownloadShopifyCSV([FromBody]PassDownloadBasket objBasket)
        {
            var user = userManager.FindById(User.Identity.GetUserId<int>());
            
            var displayPrices = false;
            
            var unique = Guid.NewGuid().ToString();

            var dirPath = System.Web.Hosting.HostingEnvironment.MapPath("~/ShopifyCSV/");

            if (!Directory.Exists(dirPath))
            {
                Directory.CreateDirectory(dirPath);
            }

            var filePath = System.Web.Hosting.HostingEnvironment.MapPath("~/ShopifyCSV/" + unique + ".csv");

            var shopifyCSV = portalDb.ProductPageFeedShopifyCSV(user.Id, user.CountryID, user.LanguageID, displayPrices, objBasket, filePath);

            var f = System.IO.File.OpenRead(filePath);
            
            var resultMessage = new HttpResponseMessage(HttpStatusCode.OK);

            resultMessage.Content = new StreamContent(f);

            resultMessage.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

            return resultMessage;
        }

        [HttpPost]
        public HttpResponseMessage ProductImagesDownloadForWindows([FromBody]PassDownloadBasket objBasket)
        {
            List<long> imageList = portalDb.Feed_Image_Select(objBasket);

            string unique = Guid.NewGuid().ToString();
            string uniqueDir = System.Web.Hosting.HostingEnvironment.MapPath("~/Programmatic/" + unique);

            System.IO.Directory.CreateDirectory(uniqueDir);

            new Microsoft.VisualBasic.Devices.Computer().FileSystem.CopyDirectory(System.Web.Hosting.HostingEnvironment.MapPath("~/Areas/Downloads/WindowsDownloaderBase"), uniqueDir);

            string projectPath = uniqueDir + "\\DG-Asset-Downloader.csproj";

            string basketContentsPath = uniqueDir + "\\Classes\\BasketContents.cs";

            // avg. 150kb 
            long diskSpaceRequired = 150 * 1024 * imageList.Count();

            string downloadList = String.Join(", ", imageList);

            string basketClass = @"using System;
using System.Collections.Generic;

namespace DG_Asset_Downloader.Classes
{
    static class BasketContents
    {
        public static long RequiredDiskSpaceInBytes
        {
            get
            {
                return " + diskSpaceRequired + @"L; // == 1MiB == 1024KiB
            }
        }

        public static List<long> DownloadList
        {
            get 
            {
                return new List<long>() 
                {
                    " + downloadList + @"
                };
            }
        }
    }
}";

            System.IO.File.WriteAllText(basketContentsPath, basketClass);

            FileStream f = null;

            int tryCount = 0;

            while (tryCount < 3)
            {
                try
                {
                    var globalProperty = new Dictionary<string, string> { { "Configuration", "Release" }, { "Platform", "AnyCPU" } };

                    var projectCollection = new ProjectCollection();

                    var buildParameters = new BuildParameters(new ProjectCollection()) { Loggers = new List<Microsoft.Build.Framework.ILogger> { new ConsoleLogger() }, EnableNodeReuse = false, MaxNodeCount = 1 };
                    var buildRequest = new BuildRequestData(projectPath, globalProperty, "4.0", new[] { "Build" }, null);
                    BuildResult buildResult = BuildManager.DefaultBuildManager.Build(buildParameters, buildRequest);

                    if (buildResult.OverallResult == BuildResultCode.Success)
                    {
                        var fullPath = buildResult.ResultsByTarget.Where(p => p.Key == "Build").Single().Value.Items[0].ItemSpec;

                        f = System.IO.File.OpenRead(fullPath);

                        var n = System.IO.Path.GetFileName(fullPath);
                    }

                    BuildManager.DefaultBuildManager.CancelAllSubmissions();
                    BuildManager.DefaultBuildManager.Dispose();

                    break;
                }
                catch (InvalidOperationException)
                {
                    tryCount++;
                    continue;
                }
                catch (Exception ex)
                {
                    var resultMessage = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                    resultMessage.Content = new StringContent(ex.ToString());
                    return resultMessage;
                }
            }

            if (f != null)
            {
                var resultMessage = new HttpResponseMessage(HttpStatusCode.OK);

                resultMessage.Content = new StreamContent(f);

                resultMessage.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

                return resultMessage;
            }
            else
            {
                // Rethinking this, it would be best to return the user to a page politely warning them that too many concurrent download requests had occurred.
                // Present them with the same download buttons directly and invite them to try again.
                // The chance that concurrent build requests will be made can also be reduced by disabling the button as soon as it is clicked...?
                // But polite handling is the way forward, disabling the button becomes unnecessary.

                var resultMessage = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                resultMessage.Content = new StringContent("Sorry, the Windows build system is busy. Please try again later.");
                return resultMessage;
            }
        }

        [HttpPost]
        public HttpResponseMessage ProductImagesDownloadForWindowsEarlyAccess([FromBody]PassDownloadBasket objBasket)
        {
            List<long> imageList = portalDb.Feed_Image_Select(objBasket);

            string unique = Guid.NewGuid().ToString();
            string uniqueDir = System.Web.Hosting.HostingEnvironment.MapPath("~/Programmatic/" + unique);

            System.IO.Directory.CreateDirectory(uniqueDir);

            new Microsoft.VisualBasic.Devices.Computer().FileSystem.CopyDirectory(System.Web.Hosting.HostingEnvironment.MapPath("~/Areas/Downloads/WindowsDownloaderBase"), uniqueDir);

            string projectPath = uniqueDir + "\\DG-Asset-Downloader.csproj";

            string basketContentsPath = uniqueDir + "\\Classes\\BasketContents.cs";

            // avg. 150kb 
            long diskSpaceRequired = 150 * 1024 * imageList.Count();

            string downloadList = String.Join(", ", imageList);

            string basketClass = @"using System;
using System.Collections.Generic;

namespace DG_Asset_Downloader.Classes
{
    static class BasketContents
    {
        public static long RequiredDiskSpaceInBytes
        {
            get
            {
                return " + diskSpaceRequired + @"L; // == 1MiB == 1024KiB
            }
        }

        public static List<long> DownloadList
        {
            get 
            {
                return new List<long>() 
                {
                    " + downloadList + @"
                };
            }
        }
    }
}";

            System.IO.File.WriteAllText(basketContentsPath, basketClass);

            FileStream f = null;

            int tryCount = 0;

            while (tryCount < 3)
            {
                try
                {
                    var globalProperty = new Dictionary<string, string> { { "Configuration", "Release" }, { "Platform", "AnyCPU" } };

                    var projectCollection = new ProjectCollection();

                    var buildParameters = new BuildParameters(new ProjectCollection()) { Loggers = new List<Microsoft.Build.Framework.ILogger> { new ConsoleLogger() }, EnableNodeReuse = false, MaxNodeCount = 1 };
                    var buildRequest = new BuildRequestData(projectPath, globalProperty, "4.0", new[] { "Build" }, null);
                    BuildResult buildResult = BuildManager.DefaultBuildManager.Build(buildParameters, buildRequest);

                    if (buildResult.OverallResult == BuildResultCode.Success)
                    {
                        var fullPath = buildResult.ResultsByTarget.Where(p => p.Key == "Build").Single().Value.Items[0].ItemSpec;

                        f = System.IO.File.OpenRead(fullPath);

                        var n = System.IO.Path.GetFileName(fullPath);
                    }

                    BuildManager.DefaultBuildManager.CancelAllSubmissions();
                    BuildManager.DefaultBuildManager.Dispose();
                }
                catch (InvalidOperationException)
                {
                    tryCount++;
                    continue;
                }
                catch (Exception ex)
                {
                    var resultMessage = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                    resultMessage.Content = new StringContent(ex.ToString());
                    return resultMessage;
                }
            }

            if (f != null)
            {
                var resultMessage = new HttpResponseMessage(HttpStatusCode.OK);

                resultMessage.Content = new StreamContent(f);

                resultMessage.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

                return resultMessage;
            }
            else
            {
                // Rethinking this, it would be best to return the user to a page politely warning them that too many concurrent download requests had occurred.
                // Present them with the same download buttons directly and invite them to try again.
                // The chance that concurrent build requests will be made can also be reduced by disabling the button as soon as it is clicked...?
                // But polite handling is the way forward, disabling the button becomes unnecessary.

                var resultMessage = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                resultMessage.Content = new StringContent("Sorry, the Windows build system is busy. Please try again later.");
                return resultMessage;
            }
        }

        [HttpPost]
        public HttpResponseMessage ProductImagesDownloadForMac([FromBody]PassDownloadBasket objBasket)
        {
            string unique = Guid.NewGuid().ToString();

            var user = userManager.FindById(User.Identity.GetUserId<int>());

            FileStream f = null;

            try
            {
                bool canProceed = false;
                
                List<long> imageList = portalDb.Feed_Image_Select(objBasket);
                string hdiResult = "";

                string uniqueDir = System.Web.Hosting.HostingEnvironment.MapPath("~/Programmatic/" + unique);
                Directory.CreateDirectory(uniqueDir);

                using (var ssh = new SshClient(CreateMacConnectionInfo()))
                {
                    ssh.Connect();

                    var stream = ssh.CreateShellStream("xterm", 80, 24, 800, 600, 1024);



                    var reader = new StreamReader(stream);
                    var writer = new StreamWriter(stream);
                    writer.AutoFlush = true;

                    var text = reader.ReadToEnd();

                    var buildDirectory = "/users/tclark/Build/";

                    long diskSpaceRequired = 150 * 1024 * imageList.Count();

                    string downloadList = String.Join(",", imageList);

                    string imagePList = @"
<?xml version=""1.0"" encoding=""UTF-8""?>
<!DOCTYPE plist PUBLIC ""-//Apple//DTD PLIST 1.0//EN"" ""http://www.apple.com/DTDs/PropertyList-1.0.dtd"">
<plist version=""1.0"">
<dict>
    <key>DiskSpaceRequiredBytes</key>
    <integer>" + diskSpaceRequired + @"</integer>
    <key>ImageIDs</key>
    <string>" + downloadList + @"</string>
</dict>
</plist>";

                    writer.WriteLine(String.Format("cd {0}", buildDirectory));
                    writer.WriteLine(String.Format("mkdir ./{0}", unique));
                    writer.WriteLine(String.Format("cp -R ./DGImageDownloader.app ./{0}", unique));
                    writer.WriteLine(String.Format("cd {0}/DGImageDownloader.app/Contents/Resources/", unique));
                    writer.WriteLine("rm -rf ImageList.plist");
                    writer.WriteLine("touch ImageList.plist");

                    using (var scp = new SftpClient(CreateMacConnectionInfo()))
                    {
                        scp.Connect();
                        scp.UploadFile(new MemoryStream(Encoding.UTF8.GetBytes(imagePList)), String.Format("/users/tclark/Build/{0}/DGImageDownloader.app/Contents/Resources/ImageList.plist", unique));

                        FileInfo fi = new FileInfo(uniqueDir + "/DGImageDownloader.dmg");

                        scp.Disconnect();
                    }

                    writer.WriteLine("security unlock-keychain");
                    System.Threading.Thread.Sleep(50);
                    writer.WriteLine("Theta9Trio");
                    System.Threading.Thread.Sleep(50);
                    writer.WriteLine(String.Format("codesign -s 'EDVME74Q3F' /users/tclark/Build/{0}/DGImageDownloader.app", unique));

                    var r = ssh.RunCommand(String.Format("hdiutil create /users/tclark/Build/{0}/DGImageDownloader.dmg -srcfolder /users/tclark/Build/{0}/DGImageDownloader.app", unique));
                    hdiResult = r.Result;

                    if (hdiResult.StartsWith("created"))
                    {
                        canProceed = true;
                    }

                    ssh.Disconnect();
                }

                if (canProceed)
                {
                    using (var scp = new ScpClient(CreateMacConnectionInfo()))
                    {
                        scp.Connect();
                        FileInfo fi = new FileInfo(uniqueDir + "/DGImageDownloader.dmg");
                        scp.Download(String.Format("/users/tclark/Build/{0}/DGImageDownloader.dmg", unique), fi);

                        scp.Disconnect();
                    }

                    f = System.IO.File.OpenRead(uniqueDir + "/DGImageDownloader.dmg");

                    var n = System.IO.Path.GetFileName(uniqueDir + "/DGImageDownloader.dmg");
                }
                else
                {
                    Logger.Fatal("Mac build failed for {0} with {1} - requested from {2}", unique, hdiResult, user.UserName);
                }

            }
            catch (Exception ex)
            {
                Logger.Fatal(ex, "Mac build EXCEPTION - requested from {0}", user.UserName);
                throw ex;
            }

            if (f != null)
            {
                var resultMessage = new HttpResponseMessage(HttpStatusCode.OK);

                resultMessage.Content = new StreamContent(f);

                resultMessage.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

                return resultMessage;
            }
            else
            {
                Logger.Fatal("Mac build system busy was displayed to {0}", user.UserName);

                var resultMessage = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                resultMessage.Content = new StringContent("Sorry, the Mac build system is busy. Please try again later.");
                return resultMessage;
            }
        }
        
        [HttpPost]
        public HttpResponseMessage ProductImagesDownloadForMacEarlyAccess([FromBody]PassDownloadBasket objBasket)
        {
            FileStream f = null;

            string unique = Guid.NewGuid().ToString();

            var user = userManager.FindById(User.Identity.GetUserId<int>());

            try
            {
                bool canProceed = false;
                
                List<long> imageList = portalDb.Feed_Image_Select(objBasket);
                string hdiResult = "";

                string uniqueDir = System.Web.Hosting.HostingEnvironment.MapPath("~/Programmatic/" + unique);
                Directory.CreateDirectory(uniqueDir);

                using (var ssh = new SshClient(CreateMacConnectionInfo()))
                {
                    ssh.Connect();

                    var stream = ssh.CreateShellStream("xterm", 80, 24, 800, 600, 1024);



                    var reader = new StreamReader(stream);
                    var writer = new StreamWriter(stream);
                    writer.AutoFlush = true;

                    var text = reader.ReadToEnd();

                    var buildDirectory = "/users/tclark/Build/";

                    long diskSpaceRequired = 150 * 1024 * imageList.Count();

                    string downloadList = String.Join(",", imageList);

                    string imagePList = @"
<?xml version=""1.0"" encoding=""UTF-8""?>
<!DOCTYPE plist PUBLIC ""-//Apple//DTD PLIST 1.0//EN"" ""http://www.apple.com/DTDs/PropertyList-1.0.dtd"">
<plist version=""1.0"">
<dict>
    <key>DiskSpaceRequiredBytes</key>
    <integer>" + diskSpaceRequired + @"</integer>
    <key>ImageIDs</key>
    <string>" + downloadList + @"</string>
</dict>
</plist>";

                    writer.WriteLine(String.Format("cd {0}", buildDirectory));
                    writer.WriteLine(String.Format("mkdir ./{0}", unique));
                    writer.WriteLine(String.Format("cp -R ./DGImageDownloader.app ./{0}", unique));
                    writer.WriteLine(String.Format("cd {0}/DGImageDownloader.app/Contents/Resources/", unique));
                    writer.WriteLine("rm -rf ImageList.plist");
                    writer.WriteLine("touch ImageList.plist");

                    using (var scp = new SftpClient(CreateMacConnectionInfo()))
                    {
                        scp.Connect();
                        scp.UploadFile(new MemoryStream(Encoding.UTF8.GetBytes(imagePList)), String.Format("/users/tclark/Build/{0}/DGImageDownloader.app/Contents/Resources/ImageList.plist", unique));

                        FileInfo fi = new FileInfo(uniqueDir + "/DGImageDownloader.dmg");

                        scp.Disconnect();
                    }

                    writer.WriteLine("security unlock-keychain");
                    System.Threading.Thread.Sleep(50);
                    writer.WriteLine("Beta8Duo");
                    System.Threading.Thread.Sleep(50);
                    writer.WriteLine(String.Format("codesign -s 'EDVME74Q3F' /users/tclark/Build/{0}/DGImageDownloader.app", unique));

                    var r = ssh.RunCommand(String.Format("hdiutil create /users/tclark/Build/{0}/DGImageDownloader.dmg -srcfolder /users/tclark/Build/{0}/DGImageDownloader.app", unique));
                    hdiResult = r.Result;

                    if (hdiResult.StartsWith("created"))
                    {
                        canProceed = true;
                    }

                    ssh.Disconnect();
                }

                if (canProceed)
                {
                    using (var scp = new ScpClient(CreateMacConnectionInfo()))
                    {
                        scp.Connect();
                        FileInfo fi = new FileInfo(uniqueDir + "/DGImageDownloader.dmg");
                        scp.Download(String.Format("/users/tclark/Build/{0}/DGImageDownloader.dmg", unique), fi);

                        scp.Disconnect();
                    }

                    f = System.IO.File.OpenRead(uniqueDir + "/DGImageDownloader.dmg");

                    var n = System.IO.Path.GetFileName(uniqueDir + "/DGImageDownloader.dmg");
                }
                else
                {
                    Logger.Fatal("Mac build failed for {0} with {1} - requested from {2}", unique, hdiResult, user.UserName);
                }
            }
            catch (Exception ex)
            {
                Logger.Fatal(ex, "Mac build EXCEPTION - requested from {0}", user.UserName);
                throw ex;
            }

            if (f != null)
            {
                var resultMessage = new HttpResponseMessage(HttpStatusCode.OK);

                resultMessage.Content = new StreamContent(f);

                resultMessage.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

                return resultMessage;
            }
            else
            {
                Logger.Fatal("Mac build system busy was displayed to {0}", user.UserName);

                var resultMessage = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                resultMessage.Content = new StringContent("Sorry, the Mac build system is busy. Please try again later.");
                return resultMessage;
            }
        }

        //public ActionResult MacBuildSystemBusy()
        //{
        //    var Model = new MacBuildSystemBusyViewModel();
        //    return View("~/Views/Home/MacBuildSystemBusy.cshtml", Model);
        //}

        //public ActionResult BasketEmpty()
        //{
        //    var Model = new BasketEmptyViewModel();
        //    return View("~/Views/Home/BasketEmpty.cshtml", Model);
        //}

        [HttpGet]
        public HttpResponseMessage AdvertisingDownloadWebQuality([FromUri]string fileName)
        {
            var user = userManager.FindById(User.Identity.GetUserId<int>());

            if (fileName == "invalid")// || user == null ? true : !user.Approved)
            {
                var resultMessage = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                resultMessage.Content = new StringContent("Sorry, that file name was invalid. Please try another file.");
                return resultMessage;
            }
            else
            {
                var item = portalDb.AdvertisingImages.Where(p => p.UniqueWebQualityFilename == fileName).SingleOrDefault();

                if (item == null) // we should log this and redirect the user to a not found page
                {
                    var resultMessage = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                    resultMessage.Content = new StringContent("Sorry, that file was not found. Please try another file.");
                    return resultMessage;
                }
                else
                {
                    var fullPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Areas/Downloads/Content/AdvertisingImages/vdir/WebQuality") + "\\" + fileName;

                    if (System.IO.File.Exists(fullPath))
                    {
                        portalDb.Member_AdvertisingImage_Insert(new PassAdvertisingImageUsage() {
                            MemberID = user.MemberID,
                            AdvertisingImageID = item.AdvertisingImageID,
                            AdvertisingImageTypeID = false,
                            CountryID = user.CountryID,
                            LanguageID = user.LanguageID
                        });

                        var f = System.IO.File.OpenRead(fullPath);

                        var resultMessage = new HttpResponseMessage(HttpStatusCode.OK);

                        resultMessage.Content = new StreamContent(f);

                        resultMessage.Content.Headers.ContentType = new MediaTypeHeaderValue(MimeMapping.GetMimeMapping(fileName));

                        return resultMessage;
                    }
                    else // we should log this and redirect the user to a not found page
                    {
                        var resultMessage = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                        resultMessage.Content = new StringContent("Internal server error. Please contact system administrator.");
                        return resultMessage;
                    }
                }
            }
        }

        [HttpGet]
        public HttpResponseMessage AdvertisingDownloadPrintQuality([FromUri]string fileName)
        {
            var user = userManager.FindById(User.Identity.GetUserId<int>());

            if (fileName == "invalid")// || user == null ? true : !user.Approved)
            {
                var resultMessage = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                resultMessage.Content = new StringContent("Sorry, that file name was invalid. Please try another file.");
                return resultMessage;
            }
            else
            {
                var item = portalDb.AdvertisingImages.Where(p => p.UniquePrintQualityFilename == fileName).SingleOrDefault();

                if (item == null) // we should log this and redirect the user to a not found page
                {
                    var resultMessage = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                    resultMessage.Content = new StringContent("Sorry, that file was not found. Please try another file.");
                    return resultMessage;
                }
                else
                {
                    var fullPath = System.Web.Hosting.HostingEnvironment.MapPath("~/Areas/Downloads/Content/AdvertisingImages/vdir/PrintQuality") + "\\" + fileName;

                    if (System.IO.File.Exists(fullPath))
                    {
                        portalDb.Member_AdvertisingImage_Insert(new PassAdvertisingImageUsage()
                        {
                            MemberID = user.MemberID,
                            AdvertisingImageID = item.AdvertisingImageID,
                            AdvertisingImageTypeID = true,
                            CountryID = user.CountryID,
                            LanguageID = user.LanguageID
                        });

                        var f = System.IO.File.OpenRead(fullPath);

                        var resultMessage = new HttpResponseMessage(HttpStatusCode.OK);

                        resultMessage.Content = new StreamContent(f);

                        resultMessage.Content.Headers.ContentType = new MediaTypeHeaderValue(MimeMapping.GetMimeMapping(fileName));

                        return resultMessage;
                    }
                    else // we should log this and redirect the user to a not found page
                    {
                        var resultMessage = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                        resultMessage.Content = new StringContent("Internal server error. Please contact system administrator.");
                        return resultMessage;
                    }
                }
            }
        }

        private ConnectionInfo CreateMacConnectionInfo()
        {
            // Accidentallied the whole authentication process. Can this be bad?
            AuthenticationMethod authMethod = new PasswordAuthenticationMethod("tclark", "Theta9Trio");
            ConnectionInfo connectionInfo = new ConnectionInfo("10.172.153.160", "tclark", authMethod);
            return connectionInfo;
        }

        [HttpPost]
        public IHttpActionResult AcceptTerms()
        {
            HttpContext.Current.Session["DownloadTermsAccepted"] = true;

            return Ok(new { });
        }

        [HttpPost]
        public IHttpActionResult BasketSummary([FromBody]PassDownloadBasket objBasket)
        {
            var result = new DownloadBasketSummaryResponse();

            var user = userManager.FindById(User.Identity.GetUserId<int>());

            try
            {
                result = portalDb.Download_BasketSummary(objBasket);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                // log ex...
            }

            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult AdvertisingImages([FromBody]PassAdvertisingGenerate objAdv)
        {
            var results = portalDb.AdvertisingImages_Generate(objAdv);

            return Ok(results);
        }
    }
}