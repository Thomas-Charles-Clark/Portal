using Microsoft.AspNet.Identity;
using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Portal.Areas.Orders.Controllers
{
    [Authorize]
    public class OrderImportController : ApiController
    {
        private PortalDbContext PortalDB { get; set; }
        private readonly ApplicationUserManager UserManager;

        public OrderImportController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.PortalDB = portalDbContext;
            this.UserManager = userManager;
        }
        
        [HttpPost]
        public async Task<IHttpActionResult> UploadOrderFile()
        {
            if (!Request.Content.IsMimeMultipartContent())
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

            var provider = new MultipartMemoryStreamProvider();

            await Request.Content.ReadAsMultipartAsync(provider);

            var tradeAccountType = "INTERNAL";

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var email = user?.Email ?? "itsupport@designersguild.com";

            var now = DateTime.Now;

            foreach (var file in provider.Contents.Where(p => !String.IsNullOrEmpty(p.Headers.ContentDisposition.FileName)))
            {
                var fn = file.Headers.ContentDisposition.FileName.Trim('\"');

                var fileName = $"PORTALIMPORT_{DateTime.Now:dd-MM-yyyy}_{tradeAccountType}_{System.IO.Path.GetFileNameWithoutExtension(fn)}_{Guid.NewGuid()}";

                var buffer = await file.ReadAsByteArrayAsync();

                var tradeAccountNumber = "PORTALIMPORT";

                var contents = await file.ReadAsStringAsync();// File.ReadAllText(file);

                if (String.IsNullOrEmpty(contents))
                {
                    throw new Exception("Bad Contents - Empty File.");
                }

                var lines = contents.Split(new string[] { System.Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries);

                if (lines[0].Count(c => c == ',') != 27)
                {
                    throw new Exception("Not Enough Columns: 28 Expected.");
                } 

                PortalDB.ImportInternalOrderFile(user.Id, fileName, tradeAccountNumber, email, contents, now);

                System.IO.File.WriteAllBytes($"{System.Web.Hosting.HostingEnvironment.MapPath("~/FileUploads")}\\{fileName}.csv", buffer);
            }

            return Ok(new { });
        }
    }
}