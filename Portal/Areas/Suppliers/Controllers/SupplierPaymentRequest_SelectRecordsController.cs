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
	public class SupplierPaymentRequest_SelectRecordsController : BaseODataController
	{
		public SupplierPaymentRequest_SelectRecordsController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
		{

		}

		[HttpGet]
		[EnableQuery]
		public async Task<IQueryable<SupplierPaymentRequest_SelectRecord>> GetSupplierPaymentRequest_SelectRecords([FromODataUri] SupplierPaymentRequest_SelectDTO dto)
		{
			var userId = User.Identity.GetUserId<int>();

			var results = await PortalDb.SupplierPayment_Request_Select(dto);

			return results.Records.AsQueryable();
		}
		
		[HttpGet]
		[EnableQuery]
		public async Task<IQueryable<SupplierPaymentRequest_SelectRecord>> SupplierPaymentsGridRead([FromODataUri] SupplierPaymentRequest_SelectDTO dto)
		{
			var userId = User.Identity.GetUserId<int>();

			var results = await PortalDb.SupplierPayment_Request_Select(dto);

			return results.Records.AsQueryable();
		}

		[HttpPut]
		[EnableQuery]
		public async Task<IHttpActionResult> Put([FromODataUri] int key, [FromBody] SupplierPaymentRequest_SelectRecord entity)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}
			else if (key != entity.PaymentRequestID)
			{
				return BadRequest("The key from the url must match the key of the entity in the body");
			}

			var period = await PortalDb.PaymentPeriods.FirstOrDefaultAsync(p => p.PeriodID == entity.PeriodID);

			if (period == null)
			{
				var periodCreationDTO = new SupplierPayments_Period_InitialiseDTO(entity.PaymentDueDate, 1);

				PortalDb.SupplierPayment_Period_Initialise(periodCreationDTO);

				await PortalDb.SaveChangesAsync();
			}

			var original = await PortalDb.PaymentRequests.FindAsync(key);

			if (original == null || original.Deleted)
			{
				return NotFound();
			}
			else
			{
				// This won't work because entity is not == <T> original!
				// Strangely it doesn't actually throw: internally SetValues may be using reflection to map property names.
				// Dunno. Anyway, we're only allowed to alter the amount (and even that has a constraint on it).

				//PortalDb.Entry(original).CurrentValues.SetValues(entity);

				original.AmountInCurrency = entity.RequestAmount;

				await PortalDb.SaveChangesAsync();

				var extantPOHeads = PortalDb.PaymentRequest_PurchaseOrderHeads.Where(p => p.PaymentRequestID == key).ToList();

				if (extantPOHeads.Any())
				{
					PortalDb.PaymentRequest_PurchaseOrderHeads.RemoveRange(extantPOHeads);

					await PortalDb.SaveChangesAsync();
				}

				if (entity.PurchaseOrders != null && entity.PurchaseOrders.Split(',').Any())
				{
					var poLinks = entity.PurchaseOrders.Split(',')
						.Select(p => new PaymentRequest_PurchaseOrderHead()
						{
							PaymentRequestID = key,
							PurchaseOrderHeadID = p
						}).ToList();


					PortalDb.PaymentRequest_PurchaseOrderHeads.AddRange(poLinks);

					await PortalDb.SaveChangesAsync();
				}
			}

			//entity.PaymentRequestPurchaseOrderHeads = PortalDb.PaymentRequest_PurchaseOrderHeads.Where(p => p.PaymentRequestID == entity.PaymentRequestID).ToList();

			//entity.PaymentRequestStatus = PortalDb.PaymentRequestStatuses.SingleOrDefault(prs => prs.PaymentRequestStatusID == entity.PaymentRequestStatusID);

			//entity.RequestedByMember = PortalDb.Users.SingleOrDefault(u => u.Id == entity.RequestedByMemberID);

			//entity.Supplier = PortalDb.Suppliers_Live.SingleOrDefault(s => s.Code == entity.SupplierCode);

			//entity.Currency = PortalDb.Currencies.Single(c => c.CurrencyID == entity.Supplier.CurrencyID);

			return Updated(entity);
		}

		[HttpPost]
		[EnableQuery]
		public async Task<IHttpActionResult> Post([FromBody] SupplierPaymentRequest_SelectRecord entity)
		{
			var batchId = Request.GetODataBatchId();

			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			var period = await PortalDb.PaymentPeriods.FirstOrDefaultAsync(p => p.PeriodID == entity.PeriodID);

			if (period == null)
			{
				var periodCreationDTO = new SupplierPayments_Period_InitialiseDTO(entity.PaymentDueDate, 1);

				PortalDb.SupplierPayment_Period_Initialise(periodCreationDTO);

				await PortalDb.SaveChangesAsync();
			}

			var currency = PortalDb.Currencies.First(c => c.Code == entity.CurrencyCode);

			var creationResult = PortalDb.PaymentRequests.Add(new PaymentRequest()
			{
				AmountInCurrency = entity.RequestAmount,
				CreatedDT = DateTime.Now,
				DeletedDT = null,
				PaymentDueDT = entity.PaymentDueDate,
				PeriodID = entity.PeriodID,
				ProformaNumber = entity.ProformaNumber,
				PaymentRequestStatusID = entity.PaymentRequestStatusID,
				RequestedByMemberID = entity.RequestedByMemberID,
				RequesterComments = entity.RequesterComments,
				SupplierCode = entity.SupplierCode
			});

			await PortalDb.SaveChangesAsync();

			entity.PaymentRequestID = creationResult.PaymentRequestID;

			if (!String.IsNullOrEmpty(entity.PurchaseOrders))
			{
				var purchaseOrders = JsonConvert.DeserializeObject<List<SupplierPaymentRequest_PurchaseOrderRecord>>(entity.PurchaseOrders);

				creationResult.PaymentRequestPurchaseOrderHeads = purchaseOrders.Select(p => new PaymentRequest_PurchaseOrderHead()
				{
					PaymentRequestID = creationResult.PaymentRequestID,
					PurchaseOrderHeadID = p.PurchaseOrderHeadID
				}).ToList();

				await PortalDb.SaveChangesAsync();
			}

			return Created(entity);
		}

		[AcceptVerbs("PATCH", "MERGE")]
		public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<SupplierPaymentRequest_SelectRecord> patch)
		{
			object id;

			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}
			else if ((patch.TryGetPropertyValue("PaymentRequestId", out id) && (int)id != key))
			{
				return BadRequest("The key from the url must match the key of the entity in the body");
			}

			var originalEntity = await PortalDb.PaymentRequests.FindAsync(key);

			if (originalEntity == null || originalEntity.Deleted)
			{
				return NotFound();
			}
			else
			{
				if (patch.TryGetPropertyValue("PaymentDueDate", out object paymentDueDt)) 
				{
					originalEntity.PaymentDueDT = (DateTime)paymentDueDt;
				}

				if (patch.TryGetPropertyValue("SupplierCode", out object supplierCode))
				{
					originalEntity.SupplierCode = (string)supplierCode;
				}

				if (patch.TryGetPropertyValue("RequestAmount", out object requestAmount))
				{
					originalEntity.AmountInCurrency = (decimal)requestAmount;
				}

				var extantPOHeads = PortalDb.PaymentRequest_PurchaseOrderHeads.Where(p => p.PaymentRequestID == key).ToList();

				if (extantPOHeads.Any())
				{
					PortalDb.PaymentRequest_PurchaseOrderHeads.RemoveRange(extantPOHeads);

					await PortalDb.SaveChangesAsync();
				}

				if (patch.TryGetPropertyValue("PurchaseOrders", out object pos))
				{
					var purchaseOrders = JsonConvert.DeserializeObject<List<SupplierPaymentRequest_PurchaseOrderRecord>>((string)pos);

					originalEntity.PaymentRequestPurchaseOrderHeads = purchaseOrders.Select(p => new PaymentRequest_PurchaseOrderHead()
					{
						PaymentRequestID = key,
						PurchaseOrderHeadID = p.PurchaseOrderHeadID
					}).ToList();

					await PortalDb.SaveChangesAsync();
				}

				await PortalDb.SaveChangesAsync();

				originalEntity.PaymentRequestPurchaseOrderHeads = PortalDb.PaymentRequest_PurchaseOrderHeads.Where(p => p.PaymentRequestID == originalEntity.PaymentRequestID).ToList();

				originalEntity.PaymentRequestStatus = PortalDb.PaymentRequestStatuses.SingleOrDefault(prs => prs.PaymentRequestStatusID == originalEntity.PaymentRequestStatusID);

				originalEntity.RequestedByMember = PortalDb.Users.SingleOrDefault(u => u.Id == originalEntity.RequestedByMemberID);

				originalEntity.Supplier = PortalDb.Suppliers_Live.SingleOrDefault(s => s.Code == originalEntity.SupplierCode);

				originalEntity.Currency = PortalDb.Currencies.Single(c => c.CurrencyID == originalEntity.Supplier.CurrencyID);
			}

			return Updated(originalEntity);
		}

		[HttpDelete]
		[EnableQuery]
		public async Task<IHttpActionResult> Delete([FromODataUri] int key)
		{
			var entry = await PortalDb.PaymentRequests.FindAsync(key);

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