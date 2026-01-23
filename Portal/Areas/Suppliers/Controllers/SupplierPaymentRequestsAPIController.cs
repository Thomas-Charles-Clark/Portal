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
using SharedEFClasses.Models.Suppliers.PaymentRequest;


namespace Portal.Areas.Suppliers.Controllers
{
	[System.Web.Http.Authorize]
	public class SupplierPaymentRequestsController : ApiController
	{
		private PortalDbContext PortalDb { get; set; }
		private readonly ApplicationUserManager UserManager;

		public SupplierPaymentRequestsController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
		{
			this.UserManager = userManager;
			this.PortalDb = portalDbContext;
		}

		//[HttpGet]
		//public IHttpActionResult GridRead([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request)
		//{
		//	var results = PortalDb.PaymentRequests.AsQueryable();

		//	return Ok(new {
		//		kendoResult = results.ToDataSourceResult(request) 
		//	});
		//}

		[HttpPost]
		public IHttpActionResult DashboardSelect(SupplierPaymentRequest_Dashboard_SelectDTO dto)
		{
			dto.MemberID = User.Identity.GetUserId<int>();

			var result = PortalDb.SupplierPaymentRequest_Dashboard_Select(dto);

			return Ok(result);
		}
	}
}