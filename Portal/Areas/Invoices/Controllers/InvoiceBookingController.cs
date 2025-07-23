using Microsoft.AspNet.Identity;

using Newtonsoft.Json;

using Portal.Areas.Invoices.Models;
using Portal.Areas.Invoices.ViewModels;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses;
using SharedEFClasses.Models;
using SimpleImpersonation;

using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Principal;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Portal.Areas.Invoices.Controllers
{
    [DynamicRoleAuthorize]
    [RouteArea("invoices")]
    [RoutePrefix("booking")]
    [Route("{action=index}")]
    public class BookingController : BaseController
    {
        private System.Text.RegularExpressions.Regex InlineImageSourceReplacer = new System.Text.RegularExpressions.Regex("src=\"(cid:([^\"]+))\"", System.Text.RegularExpressions.RegexOptions.Compiled);
        private System.Text.RegularExpressions.Regex StyleTagsReplacer = new System.Text.RegularExpressions.Regex(@"<style(.*?)<\/\s*style>", System.Text.RegularExpressions.RegexOptions.Singleline | RegexOptions.Compiled);
        private System.Text.RegularExpressions.Regex BaseTagsReplacer = new System.Text.RegularExpressions.Regex(@"<base(.*?)>", System.Text.RegularExpressions.RegexOptions.Singleline | RegexOptions.Compiled);

        public BookingController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base (userManager, portalDbContext)
        {

        }

        // GET: invoices/booking/index
        public async Task<ActionResult> Index(string pod)
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "booking" && p.AreaName == "invoices" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            IEnumerable<short> lockedToDepartmentGroupIds = new List<short>();

            string lockedToBudgetHolderCode = null;

            var adUser = PortalDb.ActiveDirectoryUsers.SingleOrDefault(f => f.Email == user.Email);

            if (UserManager.IsInRole(user.Id, "Invoice Registration - Department Restricted") ||
                UserManager.IsInRole(user.Id, "Invoice Registration - Single User"))
            {
                var superSetRecords = PortalDb.BudgetHolderSuperSet.Where(b => b.BudgetHolder.MemberID == user.Id);

                lockedToDepartmentGroupIds = superSetRecords.Select(s => s.GroupID).ToList().Distinct().ToList();
            }

            if (UserManager.IsInRole(user.Id, "Invoice Registration - Single User"))
            {
                lockedToBudgetHolderCode = PortalDb.BudgetHolders.Single(b => b.MemberID == user.Id).Code;
            }

            if (UserManager.IsInRole(user.Id, "Super Admin") ||
                UserManager.IsInRole(user.Id, "Invoice Registration - Full Access"))
            {
                lockedToDepartmentGroupIds = new List<short>();
                lockedToBudgetHolderCode = null;
            }

            var loadingEmailStatusId = (int?)null;

            if (!String.IsNullOrEmpty(pod))
            {
                var es = PortalDb.EmailStatuses.ToList().SingleOrDefault(p => p.Name.ToLowerInvariant() == pod);

                if (es != null)
                {
                    loadingEmailStatusId = es.EmailStatusID;
                }
            }

            var model = await InvoiceBookingViewModel.CreateAsync(
                1,
                lockedToDepartmentGroupIds,
                lockedToBudgetHolderCode,
                loadingEmailStatusId,
                user.GetActiveRoleProperties(), 
                application.Heading, 
                application.SubHeading);

            return View("InvoiceBooking", model);
        }

        public async Task<ActionResult> EmailViewer(string dto)
        {
            var emailViewer = JsonConvert.DeserializeObject<PassEmailViewer>(System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(dto)));

            var userId = PortalDb.Mailboxes.Single(m => m.MailboxID == emailViewer.MailboxID).UserID;

            var email = PortalDb.EmailStubs.Include("EmailStatus").Single(m => m.EmailID == emailViewer.EmailID);

            var supplier = PortalDb.Suppliers_Live.Include("Currency").Where(s => s.Code == email.SupplierCode).SingleOrDefault();

            var attachments = PortalDb.Attachments.Include("AttachmentType").Where(a => a.EmailID == emailViewer.EmailID && a.Deleted == false).ToList();

            var message = await PortalDb.EmailDigester_GetMessage(userId, emailViewer.EmailMessageID);

            message.EmailID = emailViewer.EmailID;

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
                    return $"src=\"/incomingemail/attachments/{(a.IsInline ? "inline" : "regular")}/{emailViewer.EmailID}/{a.EmailAttachmentID}\"";
                }
                else
                {
                    return m.Value;
                }
            });

            message.Body = StyleTagsReplacer.Replace(message.Body, "");
            message.Body = BaseTagsReplacer.Replace(message.Body, "");

            var model = new EmailViewerViewModel(message);

            return View("EmailViewer", model);
        }
    }
}