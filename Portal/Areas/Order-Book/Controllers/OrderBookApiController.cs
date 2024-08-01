using AngleSharp.Io;

using DocumentFormat.OpenXml.Spreadsheet;

using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using Portal.Models;
using Portal.Utilities;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.OrderBook;
using SharedEFClasses.Models.Products;

using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;

using Unity.Interception.Utilities;

namespace Portal.Areas.Sales.Controllers
{
    [DynamicRoleAuthorise]
    public class OrderBookController : ApiController
    {
        private PortalDbContext PortalDB { get; set; }

        public OrderBookController(PortalDbContext portalDbContext)
        {
            this.PortalDB = portalDbContext;
        }

        public async Task<IHttpActionResult> Refresh([FromBody] PassOrderBookBaseParams dto)
        {
            var dateFiltersTask = PortalDB.FetchOrderBookDateSummaries(dto);

            var preDefinedFiltersTask = PortalDB.FetchOrderBookPreDefinedSummaries(dto);

            var mainResultTask = PortalDB.FetchOrderBookMainSummary(dto);

            await Task.WhenAll(dateFiltersTask, preDefinedFiltersTask, mainResultTask);

            var dateFilters = await dateFiltersTask;

            var preDefinedFilters = JArray.Parse(await preDefinedFiltersTask);

            var mainResult = await mainResultTask;

            var result = new
            {
                dateFilters,
                preDefinedFilters,
                mainResult
            };

            return Ok(result);
        }

        public async Task<IHttpActionResult> RefreshSales([FromBody] PassOrderBookBaseParams dto)
        {
            var salesResult = JArray.Parse(await PortalDB.FetchOrderBookSalesSummaries(dto));

            var result = new
            {
                salesResult
            };

            return Ok(result);
        }

        public async Task<IHttpActionResult> FetchOrderBookSummary()
        {
            var summaryResult = await PortalDB.FetchOrderBookOveriew();

            return Ok(new { 
                summaryResult 
            });
        }

        public async Task<IHttpActionResult> AccuracyCheck()
        {
            var accuracyResult = await PortalDB.FetchOrderBookAccurateAsAtDT();

            return Ok(accuracyResult);
        }

        public async Task<IHttpActionResult> DetailRefresh([FromBody]ExpandoObject dto)
        {
            var detailResult = await PortalDB.FetchOrderBookDetail((string)dto.FirstOrDefault(kvp => kvp.Key == "procedure").Value, dto);

            return Ok(detailResult);
        }

        [HttpPost]
        public async Task<HttpResponseMessage> ExportToExcel([FromBody] ExpandoObject dto)
        {
            byte[] bytes = null;

            var detailResult = await PortalDB.FetchOrderBookDetail((string)dto.FirstOrDefault(kvp => kvp.Key == "procedure").Value, dto);

            var now = DateTime.Now;

            var fileName = $"OrderBook-Export-{now:g}";

            using (var client = new HttpClient())
            {
                var content = new StringContent(JsonConvert.SerializeObject(new
                {
                    FileName = fileName,
                    FileType = "xlsx",
                    Destination = (string)null,
                    Contents = JsonConvert.SerializeObject(detailResult.Data),
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

                //using (var fs = new System.IO.MemoryStream())
                //{
                //    using (var ts = new System.IO.MemoryStream(Framework.StringToByteArray(Framework.XlsxTemplateHex)))
                //    {
                //        using (var fastExcel = new FastExcel.FastExcel(ts, fs))
                //        {
                //            fastExcel.Write(
                //                rows: ((JArray)detailResult.Data).ToArray<object>().Select(o => o.ToExpandoObject()),
                //                sheetName: "Sheet1",
                //                uppercaseHeadings: false,
                //                autoWidthColumns: true,
                //                headingStyleId: (byte?)15,
                //                standardStyleId: (byte?)null,
                //                indentedHeadingStyleId: (byte?)null,
                //                indentedStyleId: (byte?)null);
                //        }
                //    }

                //    bytes = fs.GetBuffer();// result.Content.ReadAsByteArrayAsync().Result;
                //}

//#if DEBUG
                //var result = await client.PostAsync("https://localhost:44354/api/excel/GetFileStream", content);
//#else
                var result = await client.PostAsync("https://excel.designersguild.com/api/excel/GetFileStream", content);
//#endif

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
        public async Task<IHttpActionResult> FetchOrderLinePopoverContents([FromBody]PassOrderBookOrderLinePopoverFetch dto)
        {
            return Ok(await PortalDB.FetchOrderBookOrderLineInspect(dto));
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchRingFencePopoverContents([FromBody]PassOrderBookRingFencePopoverFetch dto)
        {
            return Ok(await PortalDB.FetchOrderBookRingFenceInspect(dto));
        }
    }
}
