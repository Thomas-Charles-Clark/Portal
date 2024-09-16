using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Portal.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.Samples;
using SharedEFClasses.Models.General;
using System.Web;
using System.IO;
using SharedEFClasses;
using SharedEFClasses.Utilities;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using Portal.Areas.Products.Models;

namespace Portal.Areas.Products.Controllers
{
    [Authorize]
    public class PatternBooksApiController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public PatternBooksApiController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.PortalDb = portalDbContext;
            this.UserManager = userManager;
        }

        [HttpPost]
        public async Task<HttpResponseMessage> FetchXlsx([FromBody] PassPatternBookFetch objProduct)
        {
            var results = PortalDb.FetchPatternBookContents(new PassStockViewerLoad()
            {
                ProductID = objProduct.ProductID,
                TradeAccountID = objProduct.TradeAccountID
            });

            byte[] bytes = null;

            var now = DateTime.Now;

            var fileName = $"{objProduct.Code}-{objProduct.Type}-Products.xlsx";

            using (var client = new HttpClient())
            {
                var content = new StringContent(JsonConvert.SerializeObject(new
                {
                    FileName = fileName,
                    FileType = "xlsx",
                    Destination = (string)null,
                    Contents = JsonConvert.SerializeObject(results.Where(p => objProduct.ProductIDs.Contains(p.ProductID)).Select(r => new ProductSearchResultFlat(r))),
                    UppercaseHeadings = false,
                    AutoSizeColumns = true,
                    HeadingStyleID = 15,
                    StandardStyleID = (byte?)null
                }), System.Text.Encoding.UTF8, "application/json");

                // cheers: https://stackoverflow.com/questions/777607/the-remote-certificate-is-invalid-according-to-the-validation-procedure-using#answer-1386568
                ServicePointManager.ServerCertificateValidationCallback =
                    delegate (
                        object s,
                        X509Certificate certificate,
                        X509Chain chain,
                        SslPolicyErrors sslPolicyErrors
                    )
                    {
                        return true;
                    };

//#if DEBUG
//                var result = await client.PostAsync("https://localhost:44354/api/excel/GetFileStream", content);
//#else
//                var result = await client.PostAsync("https://excel.designersguild.com/api/excel/GetFileStream", content);
//#endif

                var result = await client.PostAsync("https://excel.designersguild.com/api/excel/GetFileStream", content);

                if (result.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    bytes = result.Content.ReadAsByteArrayAsync().Result;
                }
            }

            var httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK);

            httpResponseMessage.Content = new StreamContent(new MemoryStream(bytes));
            httpResponseMessage.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
            httpResponseMessage.Content.Headers.ContentDisposition.FileName = fileName;
            httpResponseMessage.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");

            return httpResponseMessage;
        }

        [HttpPost]
        public async Task<HttpResponseMessage> FetchPDF([FromBody] PassPatternBookFetch objPatternBook)
        {
            var results = PortalDb.FetchPatternBookContents(new PassStockViewerLoad()
            {
                ProductID = objPatternBook.ProductID,
                TradeAccountID = objPatternBook.TradeAccountID
            });

            var stream = Utilities.Documents.PatternBook.PatternBookPDFWriter.GenerateReceipt(System.Web.Hosting.HostingEnvironment.MapPath("~"),
                objPatternBook.Code, objPatternBook.Name, results.Select(r => new ProductSearchResultFlat(r)));

            HttpContext.Current.Response.ContentType = "application/pdf";
            HttpContext.Current.Response.Buffer = false;
            HttpContext.Current.Response.Clear();
            HttpContext.Current.Response.OutputStream.Write(stream.GetBuffer(), 0, stream.GetBuffer().Length);
            HttpContext.Current.Response.OutputStream.Flush();
            HttpContext.Current.Response.End();

            return null;
        }
    }
}
