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
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;

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
        public IHttpActionResult GetDocument([FromUri] PassDocumentBase64Identifier objDoc64)
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

            HttpContext.Current.Response.ContentType = "application/pdf";
            HttpContext.Current.Response.Buffer = false;
            HttpContext.Current.Response.Clear();
            HttpContext.Current.Response.OutputStream.Write(stream.GetBuffer(), 0, stream.GetBuffer().Length);
            HttpContext.Current.Response.OutputStream.Flush();
            HttpContext.Current.Response.End();

            return null;
        }

        [HttpPost]
        public IHttpActionResult FetchDocument([FromBody]PassDocumentBase64Identifier objDoc64)
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
            HttpContext.Current.Response.Buffer = false;
            HttpContext.Current.Response.Clear();
            HttpContext.Current.Response.OutputStream.Write(stream.GetBuffer(), 0, stream.GetBuffer().Length);
            HttpContext.Current.Response.OutputStream.Flush();
            HttpContext.Current.Response.End();

            return null;
        }

        [HttpPost]
        public async Task<IHttpActionResult> EmailDocument([FromBody]PassDocumentBase64Identifier objDoc64)
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
				            {System.Text.RegularExpressions.Regex.Replace(objDoc.body, "\n", "<br/>")}
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

                var inkyResult = await client.PostAsync(PortalFramework.InkyEndpoint, content);

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
                transactionId = objDoc.transactionId
            }));
        }

        public IHttpActionResult FetchDocumentSendHistory([FromBody]PassDocumentSendFetch objFetch)
        {
            return Ok(PortalDb.FetchDocumentSendHistory(new PassDocumentSendFetch()
            {
                basketId = objFetch.basketId,
                documentType = objFetch.documentType,
                orderHeadId = objFetch.orderHeadId,
                transactionId = objFetch.transactionId
            }));
        }
    }
}
