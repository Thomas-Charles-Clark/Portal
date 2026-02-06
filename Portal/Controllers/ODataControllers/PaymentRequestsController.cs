using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using SharedEFClasses.Models.TradeAccounts;
//using Microsoft.AspNet.OData;
//using Microsoft.AspNet.OData.Query;
using SharedEFClasses.Models;
//using Microsoft.AspNet.OData.Routing;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using Newtonsoft.Json;
using Microsoft.AspNet.OData;
using SharedEFClasses;
using SharedEFClasses.Models.Payment;
using Microsoft.AspNet.OData.Batch;
using Unity.Interception.Utilities;
using System.Web.Http.Results;
using System.Web.DynamicData;
using AngleSharp.Dom;
using System.Data.Entity.Core.Metadata.Edm;
using System.Web.UI;
using SharedEFClasses.Models.Suppliers.Payments;
using Microsoft.Data.OData;
using SharedEFClasses.Models.Suppliers.PaymentRequests;
using Microsoft.AspNet.Identity;

namespace Portal.Controllers
{
    [System.Web.Http.Authorize]
    public class PaymentRequestsController : BaseODataController
    {
        public PaymentRequestsController(PortalDbContext portalDb) : base(portalDb) { }

		// GET: odata/PaymentRequests
		[EnableQuery]
        public IQueryable<PaymentRequest> Get()
        {
            return PortalDb.PaymentRequests.Where(pr => pr.Deleted == false).AsQueryable();
        }

        [HttpPut]
        [EnableQuery]
        public async Task<IHttpActionResult> Put([FromODataUri] int key, [FromBody]PaymentRequest entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (key != entity.PaymentRequestID)
            {
                return BadRequest("The key from the url must match the key of the entity in the body");
            }

            var period = await PortalDb.PaymentPeriods.FirstOrDefaultAsync(p => p.PeriodID == key);

            if (period == null)
            {
                var periodCreationDTO = new SupplierPayments_Period_InitialiseDTO(entity.PaymentDueDT, 1);

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
                PortalDb.Entry(original).CurrentValues.SetValues(entity);

				await PortalDb.SaveChangesAsync();

				var extantPOHeads = PortalDb.PaymentRequest_PurchaseOrderHeads.Where(p => p.PaymentRequestID == key).ToList();

                if (extantPOHeads.Any())
				{
					PortalDb.PaymentRequest_PurchaseOrderHeads.RemoveRange(extantPOHeads);

                    await PortalDb.SaveChangesAsync();
				}

				if (entity.PaymentRequestPurchaseOrderHeads != null && entity.PaymentRequestPurchaseOrderHeads.Any())
				{
                    var poLinks = entity.PaymentRequestPurchaseOrderHeads
                        .Select(p => new PaymentRequest_PurchaseOrderHead()
                        {
                            PaymentRequestID = key,
                            PurchaseOrderHeadID = p.PurchaseOrderHeadID
                        }).ToList();


					PortalDb.PaymentRequest_PurchaseOrderHeads.AddRange(poLinks);

					await PortalDb.SaveChangesAsync();
				}
			}

			entity.PaymentRequestPurchaseOrderHeads = PortalDb.PaymentRequest_PurchaseOrderHeads.Where(p => p.PaymentRequestID == entity.PaymentRequestID).ToList();

			entity.PaymentRequestStatus = PortalDb.PaymentRequestStatuses.SingleOrDefault(prs => prs.PaymentRequestStatusID == entity.PaymentRequestStatusID);

            entity.RequestedByMember = PortalDb.Users.SingleOrDefault(u => u.Id == entity.RequestedByMemberID);

            entity.Currency = PortalDb.Currencies.Single(c => c.CurrencyID == entity.CurrencyID);

            entity.Supplier = PortalDb.Suppliers_Live.SingleOrDefault(s => s.Code == entity.SupplierCode);

            return Updated(entity);
        }

		[HttpPost]
		[EnableQuery]
		public async Task<IHttpActionResult> Post([FromBody]PaymentRequest entity)
		{
			var batchId = Request.GetODataBatchId();

			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

            var period = await PortalDb.PaymentPeriods.FirstOrDefaultAsync(p => p.PeriodID == entity.PeriodID);

            if (period == null)
            {
                var periodCreationDTO = new SupplierPayments_Period_InitialiseDTO(entity.PaymentDueDT, 1);

                PortalDb.SupplierPayment_Period_Initialise(periodCreationDTO);

                await PortalDb.SaveChangesAsync();
            }

            var creationResult = PortalDb.PaymentRequests.Add(entity);

			await PortalDb.SaveChangesAsync();

			creationResult.PaymentRequestPurchaseOrderHeads = PortalDb.PaymentRequest_PurchaseOrderHeads.Where(p => p.PaymentRequestID == entity.PaymentRequestID).ToList();

			creationResult.PaymentRequestStatus = PortalDb.PaymentRequestStatuses.SingleOrDefault(prs => prs.PaymentRequestStatusID == entity.PaymentRequestStatusID);

			creationResult.RequestedByMember = PortalDb.Users.SingleOrDefault(u => u.Id == entity.RequestedByMemberID);

			creationResult.Currency = PortalDb.Currencies.Single(c => c.CurrencyID == entity.CurrencyID);

			creationResult.Supplier = PortalDb.Suppliers_Live.SingleOrDefault(s => s.Code == entity.SupplierCode);

			return Created(creationResult);
		}

		[AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<PaymentRequest> patch)
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
				patch.Patch(originalEntity);

				var extantPOHeads = PortalDb.PaymentRequest_PurchaseOrderHeads.Where(p => p.PaymentRequestID == key).ToList();

				if (extantPOHeads.Any())
				{
					PortalDb.PaymentRequest_PurchaseOrderHeads.RemoveRange(extantPOHeads);

					await PortalDb.SaveChangesAsync();
				}

				if (patch.TryGetPropertyValue("PaymentRequestPurchaseOrderHeads", out object purchaseOrderHeads))
				{
					PortalDb.PaymentRequest_PurchaseOrderHeads.AddRange(patch.GetInstance().PaymentRequestPurchaseOrderHeads
						.Select(p => new PaymentRequest_PurchaseOrderHead()
						{
							PaymentRequestID = key,
							PurchaseOrderHeadID = p.PurchaseOrderHeadID
						}));
				}

                await PortalDb.SaveChangesAsync();

				originalEntity.PaymentRequestPurchaseOrderHeads = PortalDb.PaymentRequest_PurchaseOrderHeads.Where(p => p.PaymentRequestID == originalEntity.PaymentRequestID).ToList();

				originalEntity.PaymentRequestStatus = PortalDb.PaymentRequestStatuses.SingleOrDefault(prs => prs.PaymentRequestStatusID == originalEntity.PaymentRequestStatusID);

				originalEntity.RequestedByMember = PortalDb.Users.SingleOrDefault(u => u.Id == originalEntity.RequestedByMemberID);

				originalEntity.Currency = PortalDb.Currencies.Single(c => c.CurrencyID == originalEntity.CurrencyID);

				originalEntity.Supplier = PortalDb.Suppliers_Live.SingleOrDefault(s => s.Code == originalEntity.SupplierCode);

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
