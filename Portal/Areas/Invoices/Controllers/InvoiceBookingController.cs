using Microsoft.AspNet.Identity;
using Portal.Areas.Invoices.ViewModels;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses;
using SharedEFClasses.Models;
using SimpleImpersonation;

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
    public class InvoiceBookingController : BaseController
    {
        public InvoiceBookingController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base (userManager, portalDbContext)
        {

        }

        // GET: invoices/booking/index
        public async Task<ActionResult> Index()
        {
            var application = PortalDb.Applications.Where(p => p.ControllerName == "booking" && p.AreaName == "invoices" && p.ActionName == "index").Single();

            var user = UserManager.FindById(User.Identity.GetUserId<int>());

            var model = await InvoiceBookingViewModel.CreateAsync(
                1,
                user.GetActiveRoleProperties(), 
                application.Heading, 
                application.SubHeading);

            return View("InvoiceBooking", model);
        }
    }
}