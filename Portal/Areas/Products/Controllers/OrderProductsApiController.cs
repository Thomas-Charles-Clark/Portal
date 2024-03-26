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

namespace Portal.Areas.Products.Controllers
{
    [Authorize]
    public class OrderProductsController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager userManager;

        public OrderProductsController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.PortalDb = portalDbContext;
            this.userManager = userManager;
        }

        //[HttpGet]
        //public DataSourceResult ProductSearch(
        //    [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
        //    [FromUri]PassOrderEntryProductSearch objSearch)
        //{
        //    var results = portalDb.OrderEntryProductSearch(objSearch);

        //    return results.AsQueryable().ToDataSourceResult(request);
        //}

        //[HttpGet]
        //public IEnumerable<StockStatus> StockStatuses()
        //{
        //    return portalDb.StockStatuses;
        //}

        [HttpGet]
        public IHttpActionResult GetSpecialPriceInfo([FromUri] PassLoadSPA objLoad)
        {
            var result = PortalDb.ContractAgreementCheck(objLoad);

            return Json(result);
        }

        [HttpPost]
        public IHttpActionResult FetchBespokeFurnitureQuotePDF(PassFurnitureJSON objSave)
        {
            Utilities.BespokeFurniture.BespokeFurniturePDFWriter.GenerateQuote(System.Web.Hosting.HostingEnvironment.MapPath("~"),
                objSave.json, HttpContext.Current.Response);

            return null;
        }

        [HttpPost]
        public IHttpActionResult SaveBasketRetailParameters([FromBody]PassBasketRetailParameters objRetail)
        {
            return Ok(PortalDb.SaveBasketRetailParameters(objRetail));
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchRetailTills([FromBody]PassBasketID objBasketId)
        {
            return Ok(new
            {
                tills = await PortalDb.FetchRetailTills(),
                basketGroupPaymentInfo = PortalDb.FetchRetailTillPhase(objBasketId).results
            });
        }

        [HttpPost]
        public async Task<IHttpActionResult> fetchRetailTillSessions([FromBody]PassRetailTillNumber objTill)
        {
            var preresults = await PortalDb.FetchRetailTillSessions();

            return Ok(new { sessions = preresults.Where(ts => ts.TillNumber == objTill.RetailTillNumber) });
        }

        [HttpPost]
        public IHttpActionResult fetchBasketReceipt([FromBody]PassBasketID objBasketId)
        {
            var receiptData = PortalDb.Basket_FetchReceipt(objBasketId.BasketID);

            var stream = Utilities.Basket.BasketReceiptPDFWriter.GenerateReceipt(System.Web.Hosting.HostingEnvironment.MapPath("~"),
                receiptData);

            HttpContext.Current.Response.ContentType = "application/pdf";
            HttpContext.Current.Response.Buffer = false;
            HttpContext.Current.Response.Clear();
            HttpContext.Current.Response.OutputStream.Write(stream.GetBuffer(), 0, stream.GetBuffer().Length);
            HttpContext.Current.Response.OutputStream.Flush();
            HttpContext.Current.Response.End();

            return null;
        }

        [HttpPost]
        public async Task<IHttpActionResult> emailBasketReceipt([FromBody]PassBasketIDEmail objBasketEmail)
        {
            var receiptData = PortalDb.Basket_FetchReceipt(objBasketEmail.basketId);

            var stream = Utilities.Basket.BasketReceiptPDFWriter.GenerateReceipt(System.Web.Hosting.HostingEnvironment.MapPath("~"),
                receiptData);

            var inkyMarkup = $@"
            <style type=""text/css"">
                {PortalFramework.FoundationEmailCSS}
            </style>
            <meta name=""x-apple-disable-message-reformatting""/>
            <container>
	            <row>
		            <columns>
			            <img width=""640"" height=""54"" style=""margin: 15px 0 0 0"" alt='Designers Guild' src='https://www.designersguild.com/_assets/email_images/logos/header-logo.jpg' title='Designers Guild' />
		            </columns>
	            </row>
	            <row>
		            <columns>
			            <p class=""text-left"" style=""margin-top: 0"">
				            Dear Customer,
			            </p>
		            </columns>
	            </row>
	            <row>
		            <columns>
			            <p>
				            Please find attached your receipt for order(s): {String.Join(", ", receiptData.OrderHeads.Select(p => p.OrderHeadID).ToList())}
			            </p>
		            </columns>
	            </row>
	            <row>
		            <columns small=""12"">
			            <spacer size=""30""></spacer>
		            </columns>
	            </row>
	            <row>
		            <columns small=""12"">
			            <p class=""text-left smaller"">
				            Thank you for shopping with Designers Guild.
			            </p>
		            </columns>
	            </row>
            </container>";

            using (var client = new HttpClient())
            {
                var content = new StringContent(inkyMarkup);

                var result = await client.PostAsync(PortalFramework.InkyEndpoint, content);

                inkyMarkup = await result.Content.ReadAsStringAsync();
            }

            var subject = "";

            if (receiptData.OrderHeads.Count > 1)
            {
                subject = $"Receipt for Orders: {String.Join(", ", receiptData.OrderHeads.Select(p => p.OrderHeadID).ToList())} - Designers Guild";
            }
            else
            {
                subject = $"Receipt for Order {String.Join("; ", receiptData.OrderHeads.Select(p => p.OrderHeadID).ToList())} - Designers Guild";
            }
            var body = inkyMarkup;

            var attachments = new Dictionary<string, MemoryStream>();

            var attachmentStream = new MemoryStream();
            attachmentStream.Write(stream.GetBuffer(), 0, stream.GetBuffer().Length);
            attachmentStream.Position = 0;

            attachments.Add("Designers-Guild-Receipt.pdf", attachmentStream);

#pragma warning disable 4014
            System.Threading.Tasks.Task.Factory.StartNew(() =>
            {
                ((EmailService)userManager.EmailService).SendFoundationEmailWithAttachmentsAsync(new IdentityMessage()
                {
                    Body = body,
                    Subject = subject,
                    Destination = objBasketEmail.email
                },
                attachments);
            });
#pragma warning restore 4014

            return Ok(new { });
        }

        [HttpGet]
        public IHttpActionResult TransactionSearch([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]
        DataSourceRequest request,
            [FromUri]PassTransactionSearch objSearch)
        {
            var results = PortalDb.FetchTransactions(objSearch);

            return Ok(results.AsQueryable().ToDataSourceResult(request));
        }

        [HttpPost]
        public IHttpActionResult TransactionFetchSingle([FromBody]PassTransactionSearch objSearch)
        {
            return Ok(PortalDb.FetchTransactions(objSearch).FirstOrDefault());
        }

        [HttpPost]
        public IHttpActionResult FetchTransactionView([FromBody]PassTransactionID objTransactionId)
        {
            return Ok(PortalDb.FetchTransactionView(objTransactionId));
        }

        [HttpPost]
        public IHttpActionResult FetchBasketView([FromBody]PassBasketID objBasketId)
        {
            return Ok(PortalDb.FetchBasketView(objBasketId));
        }

        [HttpPost]
        public IHttpActionResult DeleteTransaction([FromBody]PassTransactionID objTransactionId)
        {
            return Ok(PortalDb.DeleteTransaction(objTransactionId));
        }

        [HttpPost]
        public async Task<IHttpActionResult> EmailLinkedDocument([FromBody]PassLinkedDocumentSend objDoc)
        {
            var attachments = new Dictionary<string, MemoryStream>();

            foreach(var a in objDoc.attachments)
            {
                var bytes = System.IO.File.ReadAllBytes(a.path);

                var attachmentStream = new MemoryStream();

                attachmentStream.Write(bytes, 0, bytes.Length);
                attachmentStream.Position = 0;

                attachments.Add($"Designers-Guild-{a.fileName}.pdf", attachmentStream);
            }

            var inkyMarkup = $@"
            <style type=""text/css"">
                {PortalFramework.FoundationEmailCSS}
            </style>
            <meta name=""x-apple-disable-message-reformatting""/>
            <container>
	            <row>
		            <columns>
			            <img width=""640"" height=""54"" style=""margin: 15px 0 0 0"" alt='Designers Guild' src='https://www.designersguild.com/_assets/email_images/logos/header-logo.jpg' title='Designers Guild' />
		            </columns>
	            </row>
	            <row>
		            <columns>
			            <p class=""text-left"" style=""margin-top: 0"">
				            {System.Text.RegularExpressions.Regex.Replace(objDoc.body, "\n", "<br/>")}
			            </p>
		            </columns>
	            </row>
            </container>";

            var emailTo = objDoc.recipient;

            using (var client = new HttpClient())
            {
                var content = new StringContent(inkyMarkup);

                var inkyResult = await client.PostAsync(PortalFramework.InkyEndpoint, content);

                inkyMarkup = await inkyResult.Content.ReadAsStringAsync();
            }

            var body = inkyMarkup;

            var memberId = User.Identity.GetUserId<int>();

#pragma warning disable 4014
            System.Threading.Tasks.Task.Factory.StartNew(() =>
            {
                ((EmailService)userManager.EmailService).SendFoundationEmailWithAttachmentsAsync(new IdentityMessage()
                {
                    Body = body,
                    Subject = objDoc.subject,
                    Destination = emailTo
                },
                attachments);
            });
#pragma warning restore 4014

            return Ok(new { });
        }
    }
}
