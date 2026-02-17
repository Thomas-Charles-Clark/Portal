using AngleSharp.Dom;

using Microsoft.AspNet.Identity;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Batch;
using Microsoft.AspNet.OData.Query;
using Microsoft.AspNet.OData.Routing;

using Newtonsoft.Json;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Payment;
using SharedEFClasses.Models.Suppliers.PaymentApproval;
using SharedEFClasses.Models.Suppliers.PaymentApprovals;
using SharedEFClasses.Models.Suppliers.PaymentRequests;
using SharedEFClasses.Models.Suppliers.Payments;

using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Core.Metadata.Edm;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Portal.Areas.Suppliers.Controllers
{
	[EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
	public class SupplierPaymentApproval_Basket_SelectRecordsController : BaseODataController
	{
		public SupplierPaymentApproval_Basket_SelectRecordsController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
		{

		}

		[HttpGet]
		[EnableQuery]
		public async Task<IQueryable<SupplierPaymentApproval_Basket_SelectRecord>> GetSupplierPaymentApproval_Basket_SelectRecords([FromODataUri] SupplierPaymentApproval_Basket_SelectDTO dto)
		{
			var userId = User.Identity.GetUserId<int>();

			var results = await PortalDb.SupplierPayment_Approval_Basket_Select(dto);

			return results.Records.AsQueryable();
		}
		
		[HttpGet]
		[EnableQuery]
		public async Task<IQueryable<SupplierPaymentApproval_Basket_SelectRecord>> SupplierPaymentsBasketGridRead([FromODataUri] SupplierPaymentApproval_Basket_SelectDTO dto)
		{
			var userId = User.Identity.GetUserId<int>();

			var results = await PortalDb.SupplierPayment_Approval_Basket_Select(dto);

			return results.Records.AsQueryable();
		}

		[HttpPut]
		[EnableQuery]
		public async Task<IHttpActionResult> Put([FromODataUri] int keyPaymentDecisionID, [FromODataUri] string keyCurrencyCode, SupplierPaymentApproval_Basket_SelectRecord entity)
		{
			var original = await PortalDb.PaymentDecisions.SingleOrDefaultAsync(pd => pd.PaymentDecisionID == keyPaymentDecisionID);

			if (original == null || original.Deleted)
			{
				return NotFound();
			}
			else
			{
				original.AmountInCurrency = entity.Decision_Amount_CUR;
				original.PayOnDate = entity.PayOnDate;

				await PortalDb.SaveChangesAsync();
			}

			return Updated(entity);
		}

		[HttpPost]
		[EnableQuery]
		public async Task<IHttpActionResult> Post(SupplierPaymentApproval_Basket_SelectRecord entity)
		{
			var batchId = Request.GetODataBatchId();

			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			var creationResult = PortalDb.PaymentDecisions.Add(new PaymentDecision()
			{
				AmountInCurrency = entity.Decision_Amount_CUR,
				CreatedDT = DateTime.Now,
				PayOnDate = entity.PayOnDate,
				PaymentRequestID = entity.PaymentRequestID
			});

			await PortalDb.SaveChangesAsync();

			entity.PaymentDecisionID = creationResult.PaymentDecisionID;

			return Created(entity);
		}

		[AcceptVerbs("PATCH", "MERGE")]
		public async Task<IHttpActionResult> Patch([FromODataUri] int keyPaymentDecisionID, [FromODataUri] string keyCurrencyCode, Delta<SupplierPaymentApproval_Basket_SelectRecord> patch)
		{
			object id;
			object cc;

			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}
			else if ((patch.TryGetPropertyValue("PaymentDecisionId", out id) && (int)id != keyPaymentDecisionID))
			{
				return BadRequest("The PaymentDecisionID from the url must match that of the entity in the body");
			}
			else if ((patch.TryGetPropertyValue("CurrencyCode", out cc) && (string)cc != keyCurrencyCode))
			{
				return BadRequest("The CurrencyCode from the url must match that of the entity in the body");
			}

			var originalEntity = await PortalDb.PaymentDecisions.SingleOrDefaultAsync(pd => pd.PaymentDecisionID == keyPaymentDecisionID);

			if (originalEntity == null || originalEntity.Deleted)
			{
				return NotFound();
			}
			else
			{
				if (patch.TryGetPropertyValue("PayOnDate", out object payOnDate))
				{
					originalEntity.PayOnDate = (DateTime)payOnDate;
				}

				if (patch.TryGetPropertyValue("Decision_Amount_CUR", out object amountInCurrency))
				{
					originalEntity.AmountInCurrency = (decimal)amountInCurrency;
				}

				await PortalDb.SaveChangesAsync();
			}

			return Updated(originalEntity);
		}

		[HttpDelete]
		[EnableQuery]
		public async Task<IHttpActionResult> Delete([FromODataUri] int keyPaymentDecisionID, [FromODataUri] string keyCurrencyCode)
		{
			var entry = await PortalDb.PaymentDecisions.SingleOrDefaultAsync(pd => pd.PaymentDecisionID == keyPaymentDecisionID);

			if (entry == null)
			{
				return NotFound();
			}

			entry.DeletedDT = DateTime.Now;

			await PortalDb.SaveChangesAsync();

			return StatusCode(HttpStatusCode.NoContent);
		}

		protected override void Dispose(bool disposing)
		{
			if (disposing)
			{
				PortalDb.Dispose();
			}

			base.Dispose(disposing);
		}
	}
}