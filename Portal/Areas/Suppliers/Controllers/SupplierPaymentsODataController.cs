using Microsoft.AspNet.Identity;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Query;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Suppliers.PaymentRequests;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Portal.Areas.Suppliers.Controllers
{
	[System.Web.Http.Authorize]
	[EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
	public class SupplierPaymentsODataController : BaseODataController
	{
		public SupplierPaymentsODataController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
		{

		}

		[HttpGet]
		[EnableQuery]
		public IQueryable<SupplierPaymentRequest_SelectRecord> SupplierPaymentsGridRead([FromODataUri] SupplierPaymentRequest_SelectDTO dto)
		{
			var userId = User.Identity.GetUserId<int>();

			var results = PortalDb.SupplierPayment_Request_Select(dto).Result;

			return results.Records.AsQueryable();
		}
	}
}