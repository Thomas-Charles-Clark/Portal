using Microsoft.AspNet.Identity;
using Portal.Areas.Invoices.ViewModels;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses;
using SharedEFClasses.Models;
using SimpleImpersonation;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
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
    }
}