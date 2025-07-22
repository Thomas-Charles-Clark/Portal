using DocumentFormat.OpenXml.Spreadsheet;

using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.text.html.simpleparser;
using iTextSharp.tool.xml;

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
using SharedEFClasses.Models.Fenwick;
using SharedEFClasses.Models.IncomingEmail;
using SharedEFClasses.Utilities;
using SimpleImpersonation;

using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Management.Automation.Language;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Security.Principal;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;

using Attachment = SharedEFClasses.Models.IncomingEmail.Attachment;
using System.Web.UI;
using HtmlAgilityPack;

namespace Portal.Areas.Invoices.Controllers
{
    public class InvoiceBookingAPIController : ApiController
    {
        private System.Text.RegularExpressions.Regex InlineImageSourceReplacer = new System.Text.RegularExpressions.Regex("src=\"(cid:([^\"]+))\"", System.Text.RegularExpressions.RegexOptions.Compiled);
        private System.Text.RegularExpressions.Regex StyleTagsReplacer = new System.Text.RegularExpressions.Regex(@"<style(.*?)<\/\s*style>", System.Text.RegularExpressions.RegexOptions.Singleline | RegexOptions.Compiled);
        private System.Text.RegularExpressions.Regex BaseTagsReplacer = new System.Text.RegularExpressions.Regex(@"<base(.*?)>", System.Text.RegularExpressions.RegexOptions.Singleline | RegexOptions.Compiled);
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
            [FromBody] PassInvoiceBookingDashboardParams dto)
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
                case 1: /* This Month */
                    fromDt = DateTime.Now.AddDays(-DateTime.Now.Day).AddDays(1);
                    break;
                case 30: /* Last 30 Days */
                    fromDt = DateTime.Now.AddDays(-30);
                    break;
                case -1: /* "Custom" */
                    toDt = dto.To;
                    fromDt = dto.From;
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

            dto.To = toDt;

            dto.From = fromDt;

            var results = await PortalDb.GetInvoiceBookingDashboard(dto);

            return Ok(results);
        }

        [HttpGet]
        public DataSourceResult MailboxGrid(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
            [FromUri] PassMailboxFolderParams dto)
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
                case 1: /* This Month */
                    fromDt = DateTime.Now.AddDays(-DateTime.Now.Day).AddDays(1);
                    break;
                case 30: /* Last 30 Days */
                    fromDt = DateTime.Now.AddDays(-30);
                    break;
                case -1: /* "Custom" */
                    toDt = dto.ToDT;
                    fromDt = dto.FromDT;
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

            dto.ToDT = toDt;

            dto.FromDT = fromDt;

            var budgetHolderEmails = PortalDb.BudgetHolders.Select(bh => bh.Email).ToList();
            
            var adUserIds = PortalDb.ActiveDirectoryUsers.Where(u => budgetHolderEmails.Contains(u.Email)).Select(u => u.UserID).ToList();

            var adUserGroups = PortalDb.ActiveDirectory_Users_Groups.Where(ug => adUserIds.Contains(ug.UserID)).ToList();

            IQueryable<SharedEFClasses.Models.IncomingEmail.Email> stubs = null;

            if (dto.ActiveDirectoryGroupIDs?.Any() == true)
            {
                adUserGroups = adUserGroups.Where(adug => dto.ActiveDirectoryGroupIDs.Contains(adug.GroupID)).ToList();

                var userIds =  adUserGroups.Select(g => g.UserID).ToList();

                stubs = PortalDb.EmailStubs
                    .Include("Supplier")
                    .Where(p =>
                        p.Deleted == false &&
                        userIds.Contains((int)p.Supplier.BudgetHolder.UserID) &&
                        p.MailboxID == dto.MailboxID && 
                        p.EmailStatusID == dto.EmailStatusID &&
                        (String.IsNullOrEmpty(dto.BudgetHolderCode) || p.Supplier != null && p.Supplier.BudgetHolderCode == dto.BudgetHolderCode) &&
                        (String.IsNullOrEmpty(dto.SupplierTypeCode) || p.Supplier != null && p.Supplier.SupplierTypeCode == dto.SupplierTypeCode) &&
                        (String.IsNullOrEmpty(dto.SupplierCode) || p.SupplierCode == dto.SupplierCode) &&
                        (String.IsNullOrEmpty(dto.FreeTextSearch) || ((p.SearchKeywords != null) && (p.SearchKeywords.Contains(dto.FreeTextSearch))) == true)
                    ).AsQueryable();
            }
            else
            {
                stubs = PortalDb.EmailStubs
                    .Include("Supplier")
                    .Where(p =>
                        p.Deleted == false &&
                        p.MailboxID == dto.MailboxID &&
                        p.EmailStatusID == dto.EmailStatusID &&
                        (String.IsNullOrEmpty(dto.BudgetHolderCode) || p.Supplier != null && p.Supplier.BudgetHolderCode == dto.BudgetHolderCode) &&
                        (String.IsNullOrEmpty(dto.SupplierTypeCode) || p.Supplier != null && p.Supplier.SupplierTypeCode == dto.SupplierTypeCode) &&
                        (String.IsNullOrEmpty(dto.SupplierCode) || p.SupplierCode == dto.SupplierCode) &&
                        (String.IsNullOrEmpty(dto.FreeTextSearch) || ((p.SearchKeywords != null) && (p.SearchKeywords.Contains(dto.FreeTextSearch))) == true)
                ).AsQueryable();
            }
            //var groups = PortalDb.ActiveDirectoryGroups.Where(g => ){
            //    var adUser = PortalDb.ActiveDirectoryUsers.SingleOrDefault(ad => ad.Email == bh.Email);
            //    var groups = PortalDb.ActiveDirectory_Users_Groups.Where(ug => ug.UserID == adUser.UserID);
            //    return groups;
            //});

            if (fromDt.HasValue)
            {
                request.Filters.Add(new Kendo.Mvc.FilterDescriptor("ReceivedDT", Kendo.Mvc.FilterOperator.IsGreaterThanOrEqualTo, fromDt.Value));
            }

            if (toDt.HasValue)
            {
                request.Filters.Add(new Kendo.Mvc.FilterDescriptor("ReceivedDT", Kendo.Mvc.FilterOperator.IsLessThanOrEqualTo, toDt.Value));
            }

            return stubs.ToDataSourceResult(request);
        }

        [HttpPost]
        public async Task<IHttpActionResult> LoadEmailMessage(
            [FromBody] PassEmailMessageID dto)
        {
            PortalDb.Configuration.ProxyCreationEnabled = false;

            var userId = PortalDb.Mailboxes.Single(m => m.MailboxID == dto.MailboxID).UserID;

            var email = PortalDb.EmailStubs.Include("EmailStatus").Single(m => m.EmailID == dto.EmailID);

            var supplier = PortalDb.Suppliers_Live.Include("Currency").Where(s => s.Code == email.SupplierCode).SingleOrDefault();

            var attachments = PortalDb.Attachments.Include("AttachmentType").Where(a => a.EmailID == dto.EmailID && a.Deleted == false).ToList();

            var additionalInfo = await PortalDb.Email_Select(dto);

            try
            {
                var message = await PortalDb.EmailDigester_GetMessage(userId, dto.EmailMessageID);

                message.EmailID = dto.EmailID;

                message.SupplierCode = email.SupplierCode;

                message.Supplier = supplier;

                message.Junk = email.Junk;

                message.Processed = email.Processed;

                message.ProcessedDT = email.ProcessedDT;

                message.Body = InlineImageSourceReplacer.Replace(message.Body, m =>
                {
                    var f = m.Groups[2].Value;

                    var a = attachments.FirstOrDefault(al => al.ContentID == f);

                    if (a != null)
                    {
                        return $"src=\"/incomingemail/attachments/{(a.IsInline ? "inline" : "regular")}/{dto.EmailID}/{a.EmailAttachmentID}\"";
                    }
                    else
                    {
                        return m.Value;
                    }
                });

                message.Body = StyleTagsReplacer.Replace(message.Body, "");
                message.Body = BaseTagsReplacer.Replace(message.Body, "");

                return Ok(new
                {
                    message,
                    emailStatus = email.EmailStatus,
                    attachments,
                    additionalInfo
                });
            }
            catch (SqlException)
            {
                return Ok(new
                {
                    message = email,
                    emailStatus = email.EmailStatus,
                    attachments,
                    additionalInfo
                });
            } 
        }

        [HttpPost]
        public async Task<IHttpActionResult> Flag(
            [FromBody] PassInvoiceBookingFlagParams dto)
        {
            var email = PortalDb.EmailStubs.Single(e => e.EmailID == dto.EmailID);

            var now = DateTime.Now;

            switch (dto.State)
            {
                case "Processed":
                    email.ProcessedDT = now;
                    email.ProcessedMemberID = User.Identity.GetUserId<int>();
                    break;
                case "Unprocessed":
                    email.ProcessedDT = null;
                    email.ProcessedMemberID = null;
                    break;
                case "Junk":
                    email.JunkDT = now;
                    email.JunkMemberID = User.Identity.GetUserId<int>();

                    foreach(var a in email.Attachments)
                    {
                        a.AttachmentTypeID = 1000;
                    }

                    break;
                case "not junk":
                    email.JunkDT = null;
                    email.JunkMemberID = null;

                    foreach (var a in email.Attachments)
                    {
                        a.AttachmentTypeID = 1;
                    }

                    break;
            }

            email.ProcessedType = "M";

            PortalDb.SaveChanges();

            return Ok(new { });
        }

        [HttpPost]
        public async Task<IHttpActionResult> LoadAttachment([FromBody] PassAttachmentDetail dto)
        {
            var attachment = PortalDb.Attachments.Single(a => a.AttachmentID == dto.AttachmentID);

            attachment.SelectResult = await PortalDb.IncomingEmail_Attachment_ParsedData_Select(new PassAttachmentDetail()
            {
                AttachmentID = dto.AttachmentID
            });

            return Ok(attachment);
        }

        [HttpPost]
        public async Task<object> AttachmentUpsert()
        {
            // Check if the request contains multipart/form-data.
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            try
            {

                var now = DateTime.Now;

                var credentials = new UserCredentials("DESIGNERSGUILD\\SQLAgentFileAccess", "34949C02-4677-4711-999C-8E038E26B10F");

                var token = credentials.LogonUser(LogonType.Interactive);

                var baseFolder = $"\\\\files\\AppDataStore\\IncomingEmail\\RegularAttachments\\";

                var root = HttpContext.Current.Server.MapPath("~/Uploads");

                var provider = new MultipartFormDataStreamProvider(root);

                var result = await Request.Content.ReadAsMultipartAsync(provider);

                var files = new List<InvoiceAttachmentNugget>();

                PassEmailMessageID dto = null;

                // Show all the key-value pairs.
                foreach (var key in provider.FormData.AllKeys)
                {
                    if (key == "obj")
                    {
                        dto = JsonConvert.DeserializeObject<PassEmailMessageID>(provider.FormData.GetValues(key)[0]);
                    }
                }

                foreach (var f in provider.FileData)
                {
                    var bytes = File.ReadAllBytes(f.LocalFileName);

                    files.Add(new InvoiceAttachmentNugget(f.LocalFileName, f.Headers.ContentDisposition.FileName.Replace("\"", ""), bytes, -1L));
                }

                for (var i = 0; i < files.Count(); i++)
                {
                    var f = files[i];

                    var size = f.Contents.Count();

                    if (size > 20971520) // 20mb max per file
                    {
                        return Request.CreateResponse(HttpStatusCode.ExpectationFailed, "File too large");
                    }

                    var identifier = $"Uploaded-{Guid.NewGuid().ToString()}";

                    var a = new Attachment()
                    {
                        EmailID = dto.EmailID,
                        EmailAttachmentID = identifier,
                        AttachmentTypeID = 1,
                        FileName = f.FileName,
                        FileExtension = System.IO.Path.GetExtension(f.FileName).Replace(".", ""),
                        ProcessedByMemberID = null,
                        Size = size,
                        IsInline = false,
                        ContentID = identifier,
                        CreatedDT = now,
                        ModifiedDT = now,
                        DeletedDT = null
                    };

                    PortalDb.Attachments.Add(a);

                    await PortalDb.SaveChangesAsync();

                    f.AttachmentID = a.AttachmentID;
                }

                WindowsIdentity.RunImpersonated(token, () =>
                {
                    foreach (var f in files)
                    {
                        var destination = $"{baseFolder}\\{f.AttachmentID}{f.FileExtension}";

                        var bytes = System.IO.File.ReadAllBytes(f.LocalFileName);

                        System.IO.File.WriteAllBytes(destination, bytes);
                    }
                });

                foreach (var f in files)
                {
                    System.IO.File.Delete(f.LocalFileName);
                }

                var email = PortalDb.EmailStubs.Single(e => e.EmailID == dto.EmailID);

                email.RegularAttachmentCount = PortalDb.Attachments.Where(a => a.EmailID == dto.EmailID && a.Deleted == false).Count();

                PortalDb.SaveChanges();

                return Ok(new { });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.ToString());
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> SaveSupplierDetail([FromBody] PassSupplierDetail dto)
        {
            dto.MemberID = User.Identity.GetUserId<int>();

            var result = await PortalDb.IncomingEmail_Supplier_Save(dto);

            return Ok(new { });
        }


        [HttpPost]
        public async Task<IHttpActionResult> InvoiceDuplicateCheck([FromBody] PassAttachmentDetail dto)
        {
            dto.MemberID = User.Identity.GetUserId<int>();

            var result = await PortalDb.IncomingEmail_Invoice_DuplicateCheck(dto);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IHttpActionResult> SaveAttachmentDetail([FromBody] PassAttachmentDetail dto)
        {
            dto.MemberID = User.Identity.GetUserId<int>();

            var result = await PortalDb.IncomingEmail_Attachment_Save(dto);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchInvoiceDates([FromBody] PassInvoiceDateParams dto)
        {
            var result = await PortalDb.IncomingEmail_InvoiceDates_Select(dto);

            return Ok(result);
        }

        [HttpGet]
        public DataSourceResult GetGeneralLedgerCodes([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request)
        {
            var results = PortalDb.GeneralLedgerCodes.Include("Type").Where(glc => glc.Deleted == false && ((glc.AccountType == "P" || glc.AccountType == "A" || glc.AccountType == "S" || glc.AccountType == "C") || glc.Code == "9999999999")) .AsQueryable();

            return results.ToDataSourceResult(request);
        }

        [HttpGet]
        public DataSourceResult GetGeneralLedgerCodeValueMapper([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request, [FromUri] string code)
        {
            var results = PortalDb.GeneralLedgerCodes.Include("Type").Where(glc => glc.Deleted == false && ((glc.AccountType == "P" || glc.AccountType == "A" || glc.AccountType == "S" || glc.AccountType == "C") || glc.Code == "9999999999") && glc.Code == code).AsQueryable();

            return results.ToDataSourceResult(request);
        }

        [HttpPost]
        public HttpResponseMessage ConvertEmailToPDF([FromBody] PassEmailToPDF dto)
        {
            var pdf = new PdfDocument();

            var fileName = dto.FileName;

            HtmlNode.ElementsFlags["p"] = HtmlElementFlag.Closed;
            HtmlNode.ElementsFlags["br"] = HtmlElementFlag.Closed;
            HtmlNode.ElementsFlags["img"] = HtmlElementFlag.Closed;
            HtmlDocument doc = new HtmlDocument();
            doc.OptionFixNestedTags = true;
            doc.OptionAutoCloseOnEnd = true;
            doc.OptionWriteEmptyNodes = true;
            doc.LoadHtml(dto.Body);

            var stream = new MemoryStream();

            using (StringWriter sw = new StringWriter())
            {
                using (HtmlTextWriter hw = new HtmlTextWriter(sw))
                {
                    hw.Write(doc.DocumentNode.OuterHtml);
                    StringReader sr = new StringReader(sw.ToString());
                    Document pdfDoc = new Document(PageSize.A4, 10f, 10f, 10f, 0f);
                    PdfWriter writer = PdfWriter.GetInstance(pdfDoc, stream);
                    pdfDoc.Open();
                    XMLWorkerHelper.GetInstance().ParseXHtml(writer, pdfDoc, sr);
                    pdfDoc.Close();
                }
            }

            var httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK);

            httpResponseMessage.Content = new StreamContent(new MemoryStream(stream.GetBuffer()));
            httpResponseMessage.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
            httpResponseMessage.Content.Headers.ContentDisposition.FileName = fileName;
            httpResponseMessage.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/pdf");

            return httpResponseMessage;


            //// Exact same damned result... EmailID 11462 gets truncated!!!

            //using (Document document = new Document(PageSize.A4))
            //{
            //    PdfWriter writer = PdfWriter.GetInstance(document, HttpContext.Current.Response.OutputStream);
            //    document.Open();

            //    StringReader sr = new StringReader(doc.DocumentNode.OuterHtml);
            //    XMLWorkerHelper.GetInstance().ParseXHtml(writer, document, sr);
            //    document.Close();
            //    HttpContext.Current.Response.ContentType = "application/pdf";
            //    HttpContext.Current.Response.AddHeader("content-disposition", "attachment; filename=" + DateTime.Now.ToString("yyyyMMdd") + ".pdf");
            //    System.Web.HttpContext.Current.Response.Write(document);
            //    HttpContext.Current.Response.Flush();
            //    HttpContext.Current.Response.End();

            //}

            //return null;
        }
    }
}
