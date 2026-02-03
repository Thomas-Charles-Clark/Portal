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
using SharedEFClasses.Models.Suppliers.Payments;
using SharedEFClasses.Models.Suppliers.PaymentApprovals;
using SharedEFClasses.Models.Suppliers.PaymentApproval;
using SharedEFClasses.Models.Payment;


namespace Portal.Areas.Suppliers.Controllers
{
	[System.Web.Http.Authorize]
	public class SupplierPaymentsController : ApiController
	{
		private PortalDbContext PortalDb { get; set; }
		private readonly ApplicationUserManager UserManager;

		public SupplierPaymentsController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
		{
			this.UserManager = userManager;
			this.PortalDb = portalDbContext;
		}

		/// <summary>
		/// REQUESTS
		/// </summary>
		/// 

		[HttpPost]
		public async Task<IHttpActionResult> DashboardSelect(SupplierPayments_Dashboard_SelectDTO dto)
		{
			var result = await PortalDb.SupplierPayments_Dashboard_Select(dto);

			return Ok(result);
		}












		/// <summary>
		/// APPROVALS
		/// </summary>
		/// 

		[HttpGet]
		public IHttpActionResult ApprovalsGridRead(
			[ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
			[FromUri]SupplierPaymentApproval_SelectDTO dto)
		{
			var result = PortalDb.SupplierPayment_Approval_Select(dto);

			return Ok(new
			{
				kendoGridResult = result.SupplierSummaryRecords.AsQueryable().ToDataSourceResult(request),
				detailResult = result.SupplierDetailRecords
			});
		}

		[HttpGet]
		public IHttpActionResult HistoryDetailGridRead(
			[ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
			[FromUri] SupplierPayments_History_Detail_SelectDTO dto)
		{
			var result = PortalDb.SupplierPayment_History_Detail_Select(dto);

			return Ok(new
			{
				kendoGridResult = result.Records.AsQueryable().ToDataSourceResult(request)
			});
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

		[HttpPost]
		public async Task<IHttpActionResult> RejectApprovalRequest([FromBody] SupplierPaymentApprovalBasketItemDTO dto)
		{
			var record = PortalDb.PaymentRequests.Single(pr => pr.PaymentRequestID == dto.PaymentRequestID);

			record.DeletedDT = DateTime.Now;

			await PortalDb.SaveChangesAsync();

			return Ok(new { });
		}
	}
}