using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json;

using Portal.Areas.Invoices.Models;
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
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace Portal.Areas.Invoices.Controllers
{
    public class InvoiceBookingAPIController : ApiController
    {
        private System.Text.RegularExpressions.Regex InlineImageSourceReplacer = new System.Text.RegularExpressions.Regex("src=\"(cid:([^\"]+))\"", System.Text.RegularExpressions.RegexOptions.Compiled);
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public InvoiceBookingAPIController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.UserManager = userManager;
            this.PortalDb = portalDbContext;
        }

        [HttpPost]
        public IHttpActionResult InvoiceMailboxFolders(
            [DataSourceRequest] PassMailboxFolderParams request)
        {
            var folders = PortalDb.MailboxFolders.Where(p => 
                p.MailboxID == request.MailboxID && 
                p.ParentMailboxFolderID == request.MailboxFolderID &&
                p.Deleted == false)
            .OrderBy(p => p.Name);

            return Ok(folders.AsQueryable().ToDataSourceResult(request));
        }

        [HttpPost]
        public IHttpActionResult MailboxGrid(
            [DataSourceRequest] PassMailboxFolderParams request)
        {
            var stubs = PortalDb.EmailStubs
                .Where(p =>
                    p.MailboxID == request.MailboxID &&
                    p.Deleted == false).AsQueryable();

            return Ok(stubs.ToDataSourceResult(request));
        }

        [HttpPost]
        public async Task<IHttpActionResult> LoadEmailMessage(
            [FromBody] PassEmailMessageID dto)
        {
            var userId = PortalDb.Mailboxes.Single(m => m.MailboxID == dto.MailboxID).UserID;

            var message = await PortalDb.EmailDigester_GetMessage(userId, dto.EmailMessageID);

            message.EmailID = dto.EmailID;

            var attachments = PortalDb.Attachments.Where(a => a.EmailID == dto.EmailID).ToList();

            message.Body = InlineImageSourceReplacer.Replace(message.Body, m => 
            {
                var f = m.Groups[2].Value;

                var a = attachments.FirstOrDefault(al => System.IO.Path.GetFileName(al.ContentID) == f);

                if (a != null)
                {
                    return $"src=\"/incomingemail/attachments/{(a.IsInline ? "inline" : "regular")}/{dto.EmailID}/{a.FileName}.{a.FileExtension}\"";
                }
                else
                {
                    return m.Value;
                }
            });

            return Ok(new { 
                message,
                attachments
            });
        }
    }
}
