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
            return PortalDb.PaymentRequests.AsQueryable();
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

            var original = await PortalDb.PaymentRequests.FindAsync(key);

            if (original == null)
            {
                return NotFound();
            }
            else
            {

                PortalDb.Entry(original).CurrentValues.SetValues(entity);
                await PortalDb.SaveChangesAsync();
            }

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

            var creationResult = PortalDb.PaymentRequests.Add(entity);

			await PortalDb.SaveChangesAsync();

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

            if (originalEntity == null)
            {
                return NotFound();
            }
            else
            {
                patch.Patch(originalEntity);
                await PortalDb.SaveChangesAsync();
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

            PortalDb.PaymentRequests.Remove(entry);

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
