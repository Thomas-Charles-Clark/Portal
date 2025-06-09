using Portal.Areas.Customers.ViewModels;

using SharedEFClasses;
using SharedEFClasses.Models;
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

        public InvoiceBookingViewModel(int mailboxId, IEnumerable<short> lockedToDepartmentGroupIds, string lockedToBudgetHolderCode, RoleProperties properties, string applicationHeading, string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            MailboxID = mailboxId;
            LockedToDepartmentGroupIDs = lockedToDepartmentGroupIds;
            LockedToBudgetHolderCode = lockedToBudgetHolderCode;
        }

        public static async Task<InvoiceBookingViewModel> CreateAsync(
            int mailboxId,
            IEnumerable<short> lockedToDepartmentGroupIds,
            string lockedToBudgetHolderCode,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
        {
            var portalDb = new PortalDbContext();

            var result = new InvoiceBookingViewModel(mailboxId, lockedToDepartmentGroupIds, lockedToBudgetHolderCode, properties, applicationHeading, applicationSubHeading);

            return result;
        }
    }
}