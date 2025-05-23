using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json;

using Portal.Areas.Customers.Controllers;
using Portal.Areas.Invoices.Models;
using Portal.Models;
using Portal.Utilities.Document;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Documents;
using SharedEFClasses.Models.IncomingEmail;
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

        [HttpGet]
        public IHttpActionResult InvoiceMailboxFolders(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
            [DataSourceRequest] PassMailboxFolderParams dto)
        {
            var folders = PortalDb.MailboxFolders.Where(p => 
                p.MailboxID == dto.MailboxID && 
                p.ParentMailboxFolderID == dto.MailboxFolderID &&
                p.Deleted == false)
            .OrderBy(p => p.Name);

            return Ok(folders.AsQueryable().ToDataSourceResult(request));
        }

        [HttpPost]
        public async Task<IHttpActionResult> Dashboard(
            [FromBody] PassInvoiceBookingDashboardParams request)
        {
            var results = await PortalDb.GetInvoiceBookingDashboard(request);

            return Ok(results);
        }

        [HttpGet]
        public DataSourceResult MailboxGrid(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
            [FromUri] PassMailboxFolderParams dto)
        {
            var stubs = PortalDb.EmailStubs
                .Include("Supplier")
                .Where(p =>
                    p.MailboxID == dto.MailboxID &&
                    p.Deleted == false).AsQueryable();

            return stubs.ToDataSourceResult(request);
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

        [HttpPost]
        public async Task<IHttpActionResult> Flag(
            [FromBody] PassInvoiceBookingFlagParams dto)
        {
            var email = PortalDb.EmailStubs.Single(e => e.EmailID == dto.EmailID);

            switch (dto.State)
            {
                case "Processed":
                    email.ProcessedDT = DateTime.Now;
                    email.ProcessedMemberID = User.Identity.GetUserId<int>();
                    break;
                case "Junk":
                    //email.EmailStatusID = 3;
                    break;
            }

            PortalDb.SaveChanges();

            return Ok(new { });
        }
    }
}
