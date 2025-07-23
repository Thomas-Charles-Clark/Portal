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

        public int? LoadingEmailStatusID { get; set; }

        public IEnumerable<AttachmentType> AttachmentTypes { get; set; }

        public string DefaultFreeTextSearchString { get; set; }

        public InvoiceBookingViewModel(
            int mailboxId, 
            IEnumerable<short> lockedToDepartmentGroupIds,
            string lockedToBudgetHolderCode,
            int? loadingEmailStatusId,
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

#if DEBUG
            DefaultFreeTextSearchString = "Various";
#else
            DefaultFreeTextSearchString = null;
#endif
        }

        public static async Task<InvoiceBookingViewModel> CreateAsync(
            int mailboxId,
            IEnumerable<short> lockedToDepartmentGroupIds,
            string lockedToBudgetHolderCode,
            int? loadingEmailStatusId,
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
                properties, 
                applicationHeading, 
                applicationSubHeading);

            result.Dashboard = await portalDb.GetInvoiceBookingDashboard(new PassInvoiceBookingDashboardParams()
            {
                MailboxID = 1,
                BudgetHolderCode = lockedToBudgetHolderCode,
                ActiveDirectoryGroupIDs = lockedToDepartmentGroupIds
            });

            result.AttachmentTypes = portalDb.AttachmentTypes.ToList();

            return result;
        }
    }
}