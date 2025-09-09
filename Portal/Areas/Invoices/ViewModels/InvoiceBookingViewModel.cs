using Portal.Areas.Customers.ViewModels;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.IncomingEmail;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.TradeOrders;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Portal.Areas.Invoices.ViewModels
{
    public class InvoiceBookingViewModel : BaseViewModel
    {
        public int MailboxID { get; set; }

        public IEnumerable<short> LockedToDepartmentGroupIDs { get; set; }

        public string LockedToBudgetHolderCode { get; set; }

        public InvoiceBookingDashboard Dashboard { get; set; }

        public InvoiceBookingDocumentDashboard DocumentsDashboard { get; set; }

        public int? LoadingEmailStatusID { get; set; }

        public int? LoadingAttachmentStatusID { get; set; }

        public IEnumerable<AttachmentType> AttachmentTypes { get; set; }

        public IEnumerable<AttachmentStatus> AttachmentStatuses { get; set; }

        public string DefaultFreeTextSearchString { get; set; }

        public bool InvoiceRegistrationSuspended { get; set; }

        public long? LoadingAttachmentID { get; set; }

        public long? LoadingEmailID { get; set; }

        public InvoiceBookingViewModel(
            int mailboxId, 
            IEnumerable<short> lockedToDepartmentGroupIds,
            string lockedToBudgetHolderCode,
            int? loadingEmailStatusId,
            int? loadingAttachmentStatusId,
            long? loadingAttachmentId,
            bool invoiceRegistrationSuspended,
            RoleProperties properties, 
            string applicationHeading, 
            string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            MailboxID = mailboxId;
            LockedToDepartmentGroupIDs = lockedToDepartmentGroupIds;
            LockedToBudgetHolderCode = lockedToBudgetHolderCode;
            LoadingEmailStatusID = loadingEmailStatusId;
            LoadingAttachmentStatusID = loadingAttachmentStatusId;
            LoadingAttachmentID = loadingAttachmentId;
            InvoiceRegistrationSuspended = invoiceRegistrationSuspended;

#if DEBUG
            //DefaultFreeTextSearchString = "Various";
#else
            DefaultFreeTextSearchString = null;
#endif
        }

        public static async Task<InvoiceBookingViewModel> CreateAsync(
            int mailboxId,
            IEnumerable<short> lockedToDepartmentGroupIds,
            string lockedToBudgetHolderCode,
            int? loadingEmailStatusId,
            int? loadingAttachmentStatusId,
            long? loadingAttachmentId,
            bool invoiceRegistrationSuspended,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
        {

            var portalDb = new PortalDbContext();

            var result = new InvoiceBookingViewModel(
                mailboxId, 
                lockedToDepartmentGroupIds, 
                lockedToBudgetHolderCode, 
                loadingEmailStatusId,
                loadingAttachmentStatusId,
                loadingAttachmentId,
                invoiceRegistrationSuspended,
                properties, 
                applicationHeading, 
                applicationSubHeading);

            result.Dashboard = await portalDb.GetInvoiceBookingDashboard(new PassInvoiceBookingDashboardParams()
            {
                MailboxID = 1,
                BudgetHolderCode = lockedToBudgetHolderCode,
                ActiveDirectoryGroupIDs = lockedToDepartmentGroupIds
            });

            result.DocumentsDashboard = await portalDb.GetInvoiceBookingDocumentDashboard(new PassInvoiceBookingDocumentDashboardParams()
            {
                MailboxID = 1,
                BudgetHolderCode = lockedToBudgetHolderCode,
                ActiveDirectoryGroupIDs = lockedToDepartmentGroupIds
            });

            result.AttachmentTypes = portalDb.AttachmentTypes.ToList();

            result.AttachmentStatuses = portalDb.AttachmentStatuses.ToList();

            if (result.LoadingAttachmentID.HasValue)
            {
                result.LoadingEmailID = portalDb.Attachments.Single(a => a.AttachmentID == result.LoadingAttachmentID).EmailID;
            }

            return result;
        }
    }
}