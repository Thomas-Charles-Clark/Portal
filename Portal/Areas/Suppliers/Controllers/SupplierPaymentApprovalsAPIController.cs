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
using SharedEFClasses.Models.Suppliers.PaymentApprovals;
using Unity.Interception.Utilities;


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
		public DataSourceResult GridRead([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request, SupplierPaymentApproval_Dashboard_SelectDTO dto)
		{
			dto.MemberID = User.Identity.GetUserId<int>();

			var result = PortalDb.SupplierPaymentApproval_Dashboard_Select(dto);

			result.SupplierSummaryRecords.ForEach(r =>
			{
				r.Details = result.SupplierDetailRecords.Where(d => d.SupplierCode == r.SupplierCode);
			});

			return result.SupplierSummaryRecords.ToDataSourceResult(request);
		}

		[HttpPost]
		public async Task<IHttpActionResult> AddBasketItem([FromBody] SupplierPaymentApprovalBasketItemDTO dto)
		{
			var now = DateTime.Now;

			var result = PortalDb.PaymentDecisions.Add(new SharedEFClasses.Models.Payment.PaymentDecision()
			{
				PaymentRequestID = dto.PaymentRequestID,
				DecidedByMemberID = User.Identity.GetUserId<int>(),
				AmountInCurrency = dto.AmountApprovedInCurrency,
				AmountInSterling = dto.AmountApprovedInSterling,
				ExchangeRate = dto.ExchangeRate,
				FinalisedDT = null,
				CreatedDT = now,
				ModifiedDT = now,
				DeletedDT = null
			});

			await PortalDb.SaveChangesAsync();

			return Ok(result);
		}

		[HttpPost]
		public async Task<IHttpActionResult> UpdateBasketItem([FromBody] SupplierPaymentApprovalBasketItemDTO dto)
		{
			var now = DateTime.Now;

			var result = PortalDb.PaymentDecisions.Single(p => p.PaymentDecisionID == dto.PaymentDecisionID);

			result.AmountInCurrency = dto.AmountApprovedInCurrency;
			result.AmountInSterling = dto.AmountApprovedInSterling;
			result.ExchangeRate = dto.ExchangeRate;
			result.ModifiedDT = now;

			await PortalDb.SaveChangesAsync();

			return Ok(new { });
		}

		[HttpPost]
		public async Task<IHttpActionResult> RemoveBasketItem([FromBody] SupplierPaymentApprovalBasketItemDTO dto)
		{
			var record = PortalDb.PaymentDecisions.Single(pd => pd.PaymentDecisionID == dto.PaymentDecisionID);

			record.DeletedDT = DateTime.Now;

			await PortalDb.SaveChangesAsync();

			return Ok(new { });
		}

		[HttpPost]
		public async Task<IHttpActionResult> FinaliseApprovalBasket([FromBody] SupplierPaymentApprovalBasketDTO dto)
		{
			var decisionIds = dto.BasketItems.Select(q => q.PaymentDecisionID);

			var records = PortalDb.PaymentDecisions.Where(p => decisionIds.Contains(p.PaymentDecisionID)).ToList();

			var now = DateTime.Now;

			records.ForEach(p =>
			{
				var r = dto.BasketItems.Single(bi => bi.PaymentDecisionID == p.PaymentDecisionID);

				p.FinalisedDT = DateTime.Now;
				p.AmountInCurrency = r.AmountApprovedInCurrency;
				p.AmountInSterling = r.AmountApprovedInSterling;
				p.ExchangeRate = r.ExchangeRate;
				p.ModifiedDT = DateTime.Now;
			});

			await PortalDb.SaveChangesAsync();

			return Ok(new { });
		}
	}
}