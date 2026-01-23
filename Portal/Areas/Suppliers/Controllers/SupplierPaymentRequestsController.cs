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
	[RoutePrefix("payment-requests")]
	[Route("{action=index}")]
	public class PaymentRequestsController : BaseController
	{
		public PaymentRequestsController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
		{

		}

		// GET: Stock/Management
		public async Task<ActionResult> Index()
		{
			var application = PortalDb.Applications.Where(p => p.ControllerName == "paymentrequests" && p.AreaName == "suppliers" && p.ActionName == "index").Single();

			var user = UserManager.FindById(User.Identity.GetUserId<int>());

			var model = await SupplierPaymentRequestViewModel.CreateAsync(
				user.Id, 
				user.GetActiveRoleProperties(), 
				application.Heading,
				application.SubHeading);

			return View("PaymentRequests", model);
		}
	}
}