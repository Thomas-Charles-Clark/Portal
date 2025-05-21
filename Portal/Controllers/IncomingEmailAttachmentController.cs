using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;

using Portal.Utilities.DynamicRoles;

using SimpleImpersonation;

namespace Portal.Controllers
{
    [RoutePrefix("incomingemail")]
    public class IncomingEmailAttachmentController : Controller
    {
        // GET: invoices/booking/attachments
        [Route("attachments/{placement}/{emailId}/{fileName}")]
        public FileResult Attachments(string placement, int? emailId, string fileName)
        {
            var fullPath = "";

            if (placement == "inline")
            {
                fullPath = $"\\\\files\\AppDataStore\\IncomingEmail\\{placement}Attachments\\{emailId}\\{fileName}";
            }
            else
            {
                fullPath = $"\\\\files\\AppDataStore\\IncomingEmail\\{placement}Attachments\\{fileName}";
            }

            // you *have* to use an Integrated Security connection to send emails with attachments
            var credentials = new UserCredentials("DESIGNERSGUILD\\SQLAgentFileAccess", "34949C02-4677-4711-999C-8E038E26B10F");

            var token = credentials.LogonUser(LogonType.Interactive);

            FileStreamResult fsResult = null;

            WindowsIdentity.RunImpersonated(token, () =>
            {
                var fileInfo = new System.IO.FileInfo(fullPath);

                var fileStream = System.IO.File.OpenRead(fullPath);

                fsResult = new FileStreamResult(fileStream, MimeMapping.GetMimeMapping(fileName));
            });

            return fsResult;
        }
    }
}