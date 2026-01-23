using SharedEFClasses.Models;
using SharedEFClasses;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SharedEFClasses.Models.General;
using System.Threading.Tasks;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using System.Web.Http.ModelBinding;
using Portal.Areas.Stock.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Microsoft.AspNet.Identity;
using SharedEFClasses.Models.RangeManagement;
using SharedEFClasses.Models.Orders;
using System.IO;
using System.Web;
using System.Xml.Linq;
using Portal.Utilities;
using System.Net.Http.Headers;
using SharedEFClasses.SignalR.Hubs;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.SignalR;
using SharedEFClasses.Models.Suppliers.PaymentApproval;


namespace Portal.Areas.Suppliers.Controllers
{
	[System.Web.Http.Authorize]
	public class SupplierPaymentApprovalsController : ApiController
	{
		private PortalDbContext PortalDb { get; set; }
		private readonly ApplicationUserManager UserManager;

		public SupplierPaymentApprovalsController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
		{
			this.UserManager = userManager;
			this.PortalDb = portalDbContext;
		}

		[HttpPost]
		public IHttpActionResult DashboardSelect(SupplierPaymentApproval_Dashboard_SelectDTO dto)
		{
			dto.MemberID = User.Identity.GetUserId<int>();

			var result = PortalDb.SupplierPaymentApproval_Dashboard_Select(dto);

			return Ok(result);
		}
	}
}