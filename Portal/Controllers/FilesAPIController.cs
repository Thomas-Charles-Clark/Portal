using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;

namespace Portal.Controllers
{
    [System.Web.Http.Authorize]
    public class FilesApiController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public FilesApiController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.UserManager = userManager;
            this.PortalDb = portalDbContext;
        }

        [HttpPost]
        public IHttpActionResult DownloadPDF([FromBody]FileFetch objFetch)
        {
            var stream = System.IO.File.OpenRead(objFetch.Path);

            var result = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StreamContent(stream)
            };

            result.Content.Headers.ContentDisposition =
                new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment")
                {
                    FileName = System.Web.HttpUtility.UrlEncode($"{objFetch.Name}.pdf")
                };

            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");

            return ResponseMessage(result);
        }

        [HttpGet]
        public IHttpActionResult GetPDFForEmbed([FromUri]FileFetch objFetch)
        {

#if DEBUG
            var bytes = System.IO.File.ReadAllBytes(objFetch.Path);
#else
            var bytes = System.IO.File.ReadAllBytes(objFetch.Path);
#endif
            var result = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(Convert.ToBase64String(bytes)) //new ByteArrayContent(stream.ToArray())
            };

            result.Content.Headers.ContentDisposition =
                new System.Net.Http.Headers.ContentDispositionHeaderValue("inline")
                {
                    FileName = objFetch.Name
                };

            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");

            return ResponseMessage(result);
        }
    }

    public class FileFetch
    {
        public string Path { get; set; }
        public string Name { get; set; }
    }
}
