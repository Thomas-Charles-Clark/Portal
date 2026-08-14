using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;

using Portal.Utilities.DynamicRoles;

using SharedEFClasses.Models;

using SimpleImpersonation;

namespace Portal.Controllers
{
    [RoutePrefix("incomingemail")]
    public class IncomingEmailAttachmentController : Controller
    {
        private PortalDbContext PortalDb { get; set; }

        public IncomingEmailAttachmentController(PortalDbContext dbContext)
        {
            PortalDb = dbContext;
        }

        // GET: invoices/booking/attachments
        [AllowAnonymous]
        [Route("attachments/{placement}/{emailId}/{emailAttachmentId}")]
        public ActionResult Attachments(string placement, int? emailId, string emailAttachmentId)
        {
            var fullPath = "";

            var attachment = PortalDb.Attachments.Single(a => a.EmailAttachmentID == emailAttachmentId);

            var fileName = $"{attachment.FileName}.{attachment.FileExtension}";

            if (placement == "inline")
            {
                fullPath = $"\\\\files\\AppDataStore\\IncomingEmail\\{placement}Attachments\\{emailId}\\{fileName}";
            }
            else
            {
                fullPath = $"\\\\files\\AppDataStore\\IncomingEmail\\{placement}Attachments\\{attachment.AttachmentID}.{attachment.FileExtension}";
            }

            // you *have* to use an Integrated Security connection to send emails with attachments
            var credentials = new UserCredentials("DESIGNERSGUILD\\SQLAgentFileAccess", "34949C02-4677-4711-999C-8E038E26B10F");

            FileStreamResult fsResult = null;

            Impersonation.RunAsUser(credentials, LogonType.Interactive, () =>
            {
                var fileInfo = new System.IO.FileInfo(fullPath);

                var fileStream = System.IO.File.OpenRead(fullPath);

                fsResult = new FileStreamResult(fileStream, MimeMapping.GetMimeMapping(fileName));
            });

            return fsResult;
        }
    }
}