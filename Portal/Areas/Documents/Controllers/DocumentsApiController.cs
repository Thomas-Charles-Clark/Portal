using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using Portal.Models;
using Portal.Utilities.Document;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Documents;
using SharedEFClasses.Models.IncomingEmail;
using SharedEFClasses.Utilities;
using SimpleImpersonation;

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Management.Automation.Language;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.Results;

namespace Portal.Areas.Documents.Controllers
{
    public class DocumentsAPIController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public DocumentsAPIController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.UserManager = userManager;
            this.PortalDb = portalDbContext;
        }

        [HttpGet]
        [AllowAnonymous]
#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
        public async Task<IHttpActionResult> GetDocument([FromUri] PassDocumentBase64Identifier objDoc64)
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
        {
            byte[] byteArray = Convert.FromBase64String(objDoc64.d);

            string jsonBack = null;

            PassDocumentIdentifier objDoc = null;

            try
            {
                jsonBack = Encoding.UTF8.GetString(byteArray);

                objDoc = JsonConvert.DeserializeObject<PassDocumentIdentifier>(jsonBack);
            }
            catch (Exception)
            {
                jsonBack = Encoding.Unicode.GetString(byteArray);

                objDoc = JsonConvert.DeserializeObject<PassDocumentIdentifier>(jsonBack);
            }

            objDoc.memberId = 0;

            var result = PortalDb.SelectDocument(objDoc);

            var stream = GenericDocumentPDFWriter.GenerateDocument(System.Web.Hosting.HostingEnvironment.MapPath("~"),
                result);

            var content = new MultipartContent();

			content.Add(new StreamContent(new MemoryStream(stream.GetBuffer())));
			content.Add(new StreamContent(new MemoryStream(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(result.Document.DocumentEmail)))));

			HttpContext.Current.Response.ContentType = "application/pdf";
			HttpContext.Current.Response.Buffer = true;
			HttpContext.Current.Response.Clear();
			HttpContext.Current.Response.OutputStream.Write(stream.GetBuffer(), 0, stream.GetBuffer().Length);
			HttpContext.Current.Response.OutputStream.Flush();
			HttpContext.Current.Response.End();

			return null;
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchDocumentList([FromBody] PassDocumentListDto dto)
        {
            var results = await PortalDb.FetchDocumentList(dto);

			return Ok(results);
        }

        [HttpPost]
#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
        public async Task<IHttpActionResult> FetchDocument([FromBody] PassDocumentBase64Identifier objDoc64)
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
        {
            byte[] byteArray = Convert.FromBase64String(objDoc64.d);

            string jsonBack = Encoding.UTF8.GetString(byteArray);

            var memberId = User.Identity.GetUserId<int>();

            var objDoc = JsonConvert.DeserializeObject<PassDocumentIdentifier>(jsonBack);

            objDoc.memberId = memberId;

			var result = PortalDb.SelectDocument(objDoc);

			var stream = GenericDocumentPDFWriter.GenerateDocument(System.Web.Hosting.HostingEnvironment.MapPath("~"),
				result);

            HttpContext.Current.Response.ContentType = "application/pdf";
			HttpContext.Current.Response.Buffer = true;
			HttpContext.Current.Response.Clear();
            HttpContext.Current.Response.OutputStream.Write(stream.GetBuffer(), 0, stream.GetBuffer().Length);
            HttpContext.Current.Response.OutputStream.Flush();
			HttpContext.Current.Response.End();

			return null;
		}

        [HttpPost]
        public IHttpActionResult GetDocumentEmailerProperties([FromBody] PassDocumentBase64Identifier objDoc64)
		{
			byte[] byteArray = Convert.FromBase64String(objDoc64.d);

			string jsonBack = Encoding.UTF8.GetString(byteArray);

			var memberId = User.Identity.GetUserId<int>();

			var objDoc = JsonConvert.DeserializeObject<PassDocumentIdentifier>(jsonBack);

			objDoc.memberId = memberId;

			var result = PortalDb.SelectDocument(objDoc);

            return Ok(result.Document.DocumentEmail);
		}

        [HttpPost]
        public async Task<IHttpActionResult> EmailDocument([FromBody] PassDocumentBase64Identifier objDoc64)
        {
            byte[] byteArray = Convert.FromBase64String(objDoc64.d);

            string jsonBack = Encoding.Unicode.GetString(byteArray);

            var memberId = User.Identity.GetUserId<int>();

            var objDoc = JsonConvert.DeserializeObject<PassDocumentIdentifier>(jsonBack);

            objDoc.memberId = memberId;

            var result = PortalDb.SelectDocument(objDoc);

            var stream = GenericDocumentPDFWriter.GenerateDocument(System.Web.Hosting.HostingEnvironment.MapPath("~"),
                result);

            var documentTypeHeader = result.Document.DocumentPreHeader.HeaderDocumentType;

            var inkyMarkup = $@"
            <style type=""text/css"">
                {PortalFramework.FoundationEmailCSS}
            </style>
            <meta name=""x-apple-disable-message-reformatting""/>
            <container>
	            <row>
		            <columns>
			            <p class=""text-left"" style=""margin-top: 0"">
				            {System.Text.RegularExpressions.Regex.Replace(objDoc.body, "\n", "<br/><br/>")}
			            </p>
		            </columns>
	            </row>
                <spacer size=""15""></spacer>
            </container>";

            /*
             <row>
		        <columns>
			        <p>
				        {emailSecondLine}
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
				        {emailThirdLine}
			        </p>
		        </columns>
	        </row>
             */

            var emailTo = objDoc.email;

            var replyTo = objDoc.replyTo;

            using (var client = new HttpClient())
            {
                var content = new StringContent(inkyMarkup);

                ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };

                var header = System.Web.HttpUtility.UrlEncode(PortalFramework.PlainEmailHeaderImage);

				var inkyResult = await client.PostAsync($"{PortalFramework.InkyEndpoint}?header={header}", content);

                inkyMarkup = await inkyResult.Content.ReadAsStringAsync();
            }

            var body = inkyMarkup;

            var attachments = new Dictionary<string, MemoryStream>();

            var attachmentStream = new MemoryStream();
            attachmentStream.Write(stream.GetBuffer(), 0, stream.GetBuffer().Length);
            attachmentStream.Position = 0;

            attachments.Add($"Designers Guild {documentTypeHeader}.pdf", attachmentStream);

            PortalDb.SaveDocumentSend(new PassDocumentSend()
            {
                BasketID = objDoc.basketId,
                OrderHeadID = objDoc.orderHeadId,
                TransactionID = objDoc.transactionId,
                DocumentID = (short)objDoc.documentType,
                TradeAccountID = objDoc.tradeAccountId,
                To = emailTo,
                ReplyTo = replyTo,
                CC = null,
#if DEBUG
                BCC = "tclark@designersguild.com",
#endif
            }, memberId);


#pragma warning disable 4014
            System.Threading.Tasks.Task.Factory.StartNew(() =>
            {
                ((EmailService)UserManager.EmailService).SendFoundationEmailWithAttachmentsAsync(new IdentityMessage()
                {
                    Body = body,
                    Subject = objDoc.subject,
                    Destination = emailTo
                },
                attachments,
                replyTo);
            });
#pragma warning restore 4014

            return Ok(PortalDb.FetchDocumentSendHistory(new PassDocumentSendFetch()
            {
                basketId = objDoc.basketId,
                documentType = (short)objDoc.documentType,
                orderHeadId = objDoc.orderHeadId,
                transactionId = objDoc.transactionId,
                tradeAccountId = objDoc.tradeAccountId
            }));
        }

        [HttpPost]
        public async Task<IHttpActionResult> EmailDocumentFromPath([FromBody] PassEmailDocumentFromFilePathDto dto)
        {
            var memberId = User.Identity.GetUserId<int>();

            var inkyMarkup = $@"
            <style type=""text/css"">
                {PortalFramework.FoundationEmailCSS}
            </style>
            <meta name=""x-apple-disable-message-reformatting""/>
            <container>
	            <row>
		            <columns>
			            <p class=""text-left"" style=""margin-top: 0"">
				            {System.Text.RegularExpressions.Regex.Replace(dto.Body, "\n", "<br/>")}
			            </p>
		            </columns>
	            </row>
                <spacer size=""15""></spacer>
            </container>";

            using (var client = new HttpClient())
            {
                var content = new StringContent(inkyMarkup);

                ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };

                var inkyResult = await client.PostAsync(PortalFramework.InkyEndpoint, content);

                inkyMarkup = await inkyResult.Content.ReadAsStringAsync();
            }

            var body = inkyMarkup;

            var attachments = new Dictionary<string, MemoryStream>();

            var fileBytes = new byte[] { };

            var credentials = new UserCredentials("DESIGNERSGUILD\\SQLAgentFileAccess", "34949C02-4677-4711-999C-8E038E26B10F");

            var token = credentials.LogonUser(LogonType.Interactive);

            WindowsIdentity.RunImpersonated(token, () =>
            {
                fileBytes = System.IO.File.ReadAllBytes(dto.FilePath);
            });

            var attachmentStream = new MemoryStream();

            attachmentStream.Write(fileBytes, 0, fileBytes.Length);

            attachmentStream.Position = 0;

            attachments.Add($"Designers Guild {dto.DocumentTypeHeader}.pdf", attachmentStream);

            PortalDb.SaveDocumentSend(new PassDocumentSend()
            {
                To = dto.Recipient,
                ReplyTo = dto.ReplyTo,
                CC = null,
#if DEBUG
                BCC = "tclark@designersguild.com",
#endif
                Subject = dto.Subject,         
                BasketID = dto.BasketID,
                OrderHeadID = dto.OrderHeadID,
                TransactionID = dto.TransactionID,
                DocumentID = dto.DocumentID,
                TradeAccountID = dto.TradeAccountID,
                FileAttachments = dto.FilePath,
            }, memberId);


#pragma warning disable 4014
            System.Threading.Tasks.Task.Factory.StartNew(() =>
            {
                ((EmailService)UserManager.EmailService).SendFoundationEmailWithAttachmentsAsync(new IdentityMessage()
                {
                    Body = body,
                    Subject = dto.Subject,
                    Destination = dto.Recipient
                },
                attachments,
                dto.ReplyTo);
            });
#pragma warning restore 4014

            return Ok(new {});
        }

        public IHttpActionResult FetchDocumentSendHistory([FromBody] PassDocumentSendFetch objFetch)
        {
            return Ok(PortalDb.FetchDocumentSendHistory(new PassDocumentSendFetch()
            {
                basketId = objFetch.basketId,
                documentType = objFetch.documentType,
                orderHeadId = objFetch.orderHeadId,
                transactionId = objFetch.transactionId,
                tradeAccountId = objFetch.tradeAccountId
            }));
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetDocumentSendHistory(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
            [FromUri] PassDocumentSentReportDto dto)
        {
            DateTime? toDt = DateTime.Now;

            DateTime? fromDt = null;

            switch (dto.DateRangeID)
            {
                case 12: /* Last 12 Months */
                    fromDt = DateTime.Now.AddYears(-1);
                    break;
                case 6: /* Last 6 Months */
                    fromDt = DateTime.Now.AddMonths(-6);
                    break;
                case 3: /* This Month */
                    fromDt = DateTime.Now.AddMonths(-3);
                    break;
                case 1: /* This Month */
                    fromDt = DateTime.Now.AddDays(-DateTime.Now.Day).AddDays(1);
                    break;
                case 30: /* Last 30 Days */
                    fromDt = DateTime.Now.AddDays(-30);
                    break;
                case -1: /* "Custom" */
                    toDt = dto.ToDate;
                    fromDt = dto.FromDate;
                    break;
                case -2: /* "All Time" noop */
                    break;
                case -3:
                    switch (DateTime.Now.DayOfWeek)
                    {
                        case DayOfWeek.Monday:
                            toDt = DateTime.Now.Date.AddDays(-4);
                            break;
                        case DayOfWeek.Tuesday:
                            toDt = DateTime.Now.Date.AddDays(-4);
                            break;
                        case DayOfWeek.Wednesday:
                            toDt = DateTime.Now.Date.AddDays(-4);
                            break;
                        case DayOfWeek.Thursday:
                            toDt = DateTime.Now.Date.AddDays(-2);
                            break;
                        case DayOfWeek.Friday:
                            toDt = DateTime.Now.Date.AddDays(-2);
                            break;
                        case DayOfWeek.Saturday:
                            toDt = DateTime.Now.Date.AddDays(-2);
                            break;
                        case DayOfWeek.Sunday:
                            toDt = DateTime.Now.Date.AddDays(-3);
                            break;
                    }
                    break;
            }

            dto.ToDate = toDt;

            dto.FromDate = fromDt;

            var model = await PortalDb.FetchDocumentSentReport(dto);

            request.Page = 1; // This is a super weird and stupid hack but...

            var gridData = model.Records.ToDataSourceResult(request);

            gridData.Total = model.Records?.FirstOrDefault()?.TotalRowCount ?? 0;

            return Ok(new {
                gridData = gridData,
                podData = model.DashboardPods
            });
        }

        [HttpGet]
        public IHttpActionResult LoadDocumentFromFile([FromUri] PassDocumentFilePath dto)
        {
            var resultantBytes = new byte[] {};

            var credentials = new UserCredentials("DESIGNERSGUILD\\SQLAgentFileAccess", "34949C02-4677-4711-999C-8E038E26B10F");

            var token = credentials.LogonUser(LogonType.Interactive);

            WindowsIdentity.RunImpersonated(token, () =>
            {
                resultantBytes = System.IO.File.ReadAllBytes(dto.FilePath);
            });

            HttpContext.Current.Response.ContentType = "application/pdf";
            HttpContext.Current.Response.Buffer = false;
            HttpContext.Current.Response.Clear();
            HttpContext.Current.Response.OutputStream.Write(resultantBytes, 0, resultantBytes.Length);
            HttpContext.Current.Response.OutputStream.Flush();
            HttpContext.Current.Response.End();

            return null;
        }
    }
}
