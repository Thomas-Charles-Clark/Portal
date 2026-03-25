using DocumentFormat.OpenXml.EMMA;

using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using Portal.Areas.Documents.ViewModels;
using Portal.Areas.Orders.ViewModels;
using Portal.Controllers;
using Portal.Models;
using Portal.Utilities.Document;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Documents;
using SimpleImpersonation;

using System;
using System.IO;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Web.Mvc;

namespace Portal.Areas.Orders.Controllers
{
    [DynamicRoleAuthorize]
    [RouteArea("documents")]
    [RoutePrefix("view")]
    [Route("{action=index}")]
    public class ViewDocumentController : BaseController
    {
        public ViewDocumentController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base (userManager, portalDbContext)
        {

        }

        public ActionResult Index(PassDocumentBase64Identifier objDoc64)
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "viewdocument" && p.AreaName == "documents" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            byte[] byteArray = Convert.FromBase64String(objDoc64.d);

            string jsonBack = Encoding.UTF8.GetString(byteArray);

            var objDoc = JsonConvert.DeserializeObject<PassDocumentIdentifier>(jsonBack);

            objDoc.memberId = user.MemberID;

            var result = PortalDb.SelectDocument(objDoc);

            var stream = GenericDocumentPDFWriter.GenerateDocument(System.Web.Hosting.HostingEnvironment.MapPath("~"),
                result);

            var to = result.Document.DocumentEmail.EmailTo;
            var subject = result.Document.DocumentEmail.EmailSubject;
            var body = result.Document.DocumentEmail.EmailBody;

            var docSendHist = PortalDb.FetchDocumentSendHistory(new PassDocumentSendFetch() 
            { 
                 basketId = objDoc.basketId,
                 documentType = (short)objDoc.documentType,
                 orderHeadId = objDoc.orderHeadId,
                 transactionId = objDoc.transactionId
            });

            var model = new ViewDocumentViewModel(
                objDoc, 
                docSendHist, 
                stream.GetBuffer(), 
                to,
                user.Email,
                subject, 
                body,
                user.GetActiveRoleProperties(),
                application.Heading, 
                application.SubHeading);

            return View("Document", model);
        }

        public FileResult Statement(string filePath)
		{
			var credentials = new UserCredentials("DESIGNERSGUILD\\SQLAgentFileAccess", "34949C02-4677-4711-999C-8E038E26B10F");

			var token = credentials.LogonUser(LogonType.Interactive);

            byte[] fileBytes = null;

			WindowsIdentity.RunImpersonated(token, () =>
			{
				fileBytes = System.IO.File.ReadAllBytes(filePath);
			});

			return File(fileBytes, "application/pdf", Path.GetFileName(filePath));
		}

        [AllowAnonymous]
		public FileResult Download(PassDocumentBase64Identifier objDoc64)
		{
			var user = UserManager.FindById(User.Identity.GetUserId<int>());

			byte[] byteArray = Convert.FromBase64String(objDoc64.d);

			string jsonBack = Encoding.UTF8.GetString(byteArray);

			var objDoc = JsonConvert.DeserializeObject<PassDocumentIdentifier>(jsonBack);

			objDoc.memberId = user.MemberID;

			var result = PortalDb.SelectDocument(objDoc);

			var stream = GenericDocumentPDFWriter.GenerateDocument(System.Web.Hosting.HostingEnvironment.MapPath("~"), result);

			var to = result.Document.DocumentEmail.EmailTo;
			var subject = result.Document.DocumentEmail.EmailSubject;
			var body = result.Document.DocumentEmail.EmailBody;

			var docSendHist = PortalDb.FetchDocumentSendHistory(new PassDocumentSendFetch()
			{
				basketId = objDoc.basketId,
				documentType = (short)objDoc.documentType,
				orderHeadId = objDoc.orderHeadId,
				transactionId = objDoc.transactionId
			});

            var code = PortalDb.TradeAccounts.SingleOrDefault(t => t.TradeAccountID == objDoc.tradeAccountId)?.Code;

            return File(stream.ToArray(), "application/pdf", $"{(String.IsNullOrEmpty(code) ? "" : $"{code}_")}{(Path.GetFileName(result.Document.DocumentPreHeader?.HeaderDocumentType?.Replace(" ", "_")))}.pdf");
		}

		[AllowAnonymous]
		public ActionResult Render(PassDocumentBase64Identifier objDoc64)
		{
			var user = UserManager.FindById(User.Identity.GetUserId<int>());

			byte[] byteArray = Convert.FromBase64String(objDoc64.d);

			string jsonBack = Encoding.UTF8.GetString(byteArray);

			var objDoc = JsonConvert.DeserializeObject<PassDocumentIdentifier>(jsonBack);

			objDoc.memberId = user.MemberID;

			var result = PortalDb.SelectDocument(objDoc);

			var stream = GenericDocumentPDFWriter.GenerateDocument(System.Web.Hosting.HostingEnvironment.MapPath("~"), result);

			var to = result.Document.DocumentEmail.EmailTo;
			var subject = result.Document.DocumentEmail.EmailSubject;
			var body = result.Document.DocumentEmail.EmailBody;

			var docSendHist = PortalDb.FetchDocumentSendHistory(new PassDocumentSendFetch()
			{
				basketId = objDoc.basketId,
				documentType = (short)objDoc.documentType,
				orderHeadId = objDoc.orderHeadId,
				transactionId = objDoc.transactionId
			});

			var code = PortalDb.TradeAccounts.SingleOrDefault(t => t.TradeAccountID == objDoc.tradeAccountId)?.Code;

			return File(stream.ToArray(), "application/pdf");
		}
	}
}