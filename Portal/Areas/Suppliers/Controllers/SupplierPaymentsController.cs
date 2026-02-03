using Kendo.Mvc.UI;

using Microsoft.AspNet.Identity;

using Newtonsoft.Json;

using Portal.Areas.Documents.ViewModels;
using Portal.Areas.Orders.ViewModels;
using Portal.Areas.Suppliers.ViewModels;
using Portal.Controllers;
using Portal.Models;
using Portal.Utilities.Document;
using Portal.Utilities.DynamicRoles;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Documents;

using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;


namespace Portal.Areas.Suppliers.Controllers
{
	[DynamicRoleAuthorise]
	[RouteArea("suppliers")]
	[RoutePrefix("payments")]
	[Route("{action=index}")]
	public class PaymentsController : BaseController
	{
		public PaymentsController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
		{

		}

		// GET: suppliers/payments
		public async Task<ActionResult> Index()
		{
			var application = PortalDb.Applications.Where(p => p.ControllerName == "payments" && p.AreaName == "suppliers" && p.ActionName == "index").Single();

			var user = UserManager.FindById(User.Identity.GetUserId<int>());

			var userMayAdministrate = User.IsInRole("Super Admin") || User.IsInRole("Supplier Payment Decider");

			var model = await SupplierPaymentsViewModel.CreateAsync(
				user.Id, 
				userMayAdministrate,
				user.GetActiveRoleProperties(), 
				application.Heading,
				application.SubHeading);

			return View("Payments", model);
		}
	}
}