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
using System;
using System.Linq;
using System.Text;
using System.Web.Mvc;

namespace Portal.Areas.Orders.Controllers
{
    [DynamicRoleAuthorize]
    [RouteArea("documents")]
    [RoutePrefix("preview")]
    [Route("{action=index}")]
    public class PreviewController : BaseController
    {
        public PreviewController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base (userManager, portalDbContext)
        {

        }

        // GET: Orders/Trade
        public ActionResult Index(PassDocumentBase64Identifier objDoc64)
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "preview" && p.AreaName == "documents" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            ViewDocumentViewModel model = null;

            if (objDoc64.d != null)
            {
                byte[] byteArray = Convert.FromBase64String(objDoc64.d);

                string jsonBack = Encoding.UTF8.GetString(byteArray);

                var objDoc = JsonConvert.DeserializeObject<PassDocumentIdentifier>(jsonBack);

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

                model = new ViewDocumentViewModel(
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

                return View("DocumentsPreview", model);
            }

            model = new ViewDocumentViewModel(
                null,
                null,
                null,
                null,
                user.Email,
                null,
                null,
                user.GetActiveRoleProperties(),
                application.Heading,
                application.SubHeading);

            return View("DocumentsPreview", model);
        }
    }
}