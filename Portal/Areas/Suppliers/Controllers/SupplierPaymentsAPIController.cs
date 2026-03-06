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
using SharedEFClasses.Models.Suppliers.PaymentRequests;
using System.Data.SqlClient;
using SharedEFClasses.Utilities;
using Unity.Interception.Utilities;
using System.Data.Entity.Infrastructure;


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

		[HttpPost]
		public async Task<IHttpActionResult> CreatePaymentRequest([FromBody] SupplierPaymentRequest_CreationDTO dto)
		{
			dto.RequestedByMemberID = User.Identity.GetUserId<int>();

			var request = new PaymentRequest()
			{
				PaymentRequestStatusID = dto.PaymentRequestStatusID,
				RequestedByMemberID = dto.RequestedByMemberID.Value,
				PeriodID = dto.PeriodID,
				SupplierCode = dto.SupplierCode,
				AmountInCurrency = dto.AmountInCurrency,
				ProformaNumber = dto.ProformaNumber,
				RequesterComments = dto.RequesterComments,
				PaymentDueDT = dto.PaymentDueDT,
				CreatedDT = DateTime.Now
			};

			try
			{
				PortalDb.PaymentRequests.Add(request);

				await PortalDb.SaveChangesAsync();
			}
			catch (DbUpdateException e)
			{
				if (e.InnerException != null)
				{
					if (e.InnerException.InnerException != null)
					{
						if (e.InnerException.InnerException.Message.Contains("FK_payment_PaymentRequest_PeriodID"))
						{
							PortalDb.SupplierPayment_Period_Initialise(new SupplierPayments_Period_InitialiseDTO(dto.PaymentDueDT, 1));

							PortalDb.PaymentRequests.Add(request);

							await PortalDb.SaveChangesAsync();
						}
					}
				}
			}

			if (dto.PurchaseOrderIDs != null && dto.PurchaseOrderIDs.Any())
			{
				PortalDb.PaymentRequest_PurchaseOrderHeads.AddRange(dto.PurchaseOrderIDs.Select(p => new PaymentRequest_PurchaseOrderHead()
				{
					PurchaseOrderHeadID = p,
					PaymentRequestID = request.PaymentRequestID
				}));

				await PortalDb.SaveChangesAsync();
			}

			return Ok(new { });
		}

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










		/// <summary>
		/// APPROVALS
		/// </summary>
		/// 

		[HttpGet]
		public IHttpActionResult ApprovalsGridRead(
			[ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
			[FromUri]SupplierPaymentApproval_SelectDTO dto)
		{
			dto.MemberID = User.Identity.GetUserId<int>();

			var result = PortalDb.SupplierPayment_Approval_Select(dto);

			var now = DateTime.Now;

			var periodStart = now.StartOfWeek(DayOfWeek.Monday);

			result.SupplierDetailRecords.ForEach(d => {
				if (d.PayOnDate == null)
				{
					d.PayOnDate = periodStart;
				}
			});

			return Ok(new
			{
				kendoGridResult = result.SupplierSummaryRecords.AsQueryable().ToDataSourceResult(request),
				detailResult = result.SupplierDetailRecords,
				newCollectionProductHeadings = result.NewCollectionProductHeadings
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

		[HttpGet]
		public IHttpActionResult HistorySummaryGridRead(
			[ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
			[FromUri] SupplierPayments_History_Summary_SelectDTO dto)
		{
			var result = PortalDb.SupplierPayment_History_Summary_Select(dto);

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
				AmountInCurrency = dto.AmountInCurrency,
				PayOnDate = dto.PayOnDate,
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

			result.AmountInCurrency = dto.AmountInCurrency;
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
		public async Task<IHttpActionResult> FinaliseApprovalBasket([FromBody] SupplierPaymentApproval_Payment_Decision_FinaliseDTO dto)
		{
			// there is a procedure which must be mapped - potentially returning error codes
			// payment.Basket_

			var decisionIds = dto.BasketItems.Select(q => q.PaymentDecisionID);

			var records = PortalDb.PaymentDecisions.Where(p => decisionIds.Contains(p.PaymentDecisionID)).ToList();

			var now = DateTime.Now;

			records.ForEach(p =>
			{
				var r = dto.BasketItems.Single(bi => bi.PaymentDecisionID == p.PaymentDecisionID);

				if (r.AmountInCurrency != p.AmountInCurrency)
				{
					p.AmountInCurrency = r.AmountInCurrency;
					p.ModifiedDT = DateTime.Now;
				}
			});

			await PortalDb.SaveChangesAsync();

			var approvalResult = await PortalDb.SupplierPayment_Payment_Decision_Finalise(dto);

			return Ok(approvalResult);
		}

		[HttpPost]
		public async Task<IHttpActionResult> RemoveAllBasketItemsForPeriod([FromBody] SupplierPayments_BasketItemsDTO dto)
		{
			var records = PortalDb.PaymentDecisions.Where(pr => dto.PaymentDecisionIDs.Contains(pr.PaymentDecisionID));

			var now = DateTime.Now;

			foreach(var r in records)
			{
				if (r.DeletedDT == null)
				{
					r.DeletedDT = now;
				}
			}

			await PortalDb.SaveChangesAsync();

			return Ok(new { });
		}

		[HttpGet]
		public async Task<IHttpActionResult> SuppliersGridRead(
			[ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
			[FromUri] SupplierPayments_Supplier_SelectDTO dto)
		{
			var result = await PortalDb.SupplierPayment_Supplier_Select(dto);

			return Ok(new
			{
				kendoGridResult = result.Records.AsQueryable().ToDataSourceResult(request)
			});
		}
	}
}