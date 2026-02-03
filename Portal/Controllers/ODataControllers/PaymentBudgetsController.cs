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
using SharedEFClasses.Models;
using SharedEFClasses.Models.General;
using Microsoft.AspNet.OData;
using SharedEFClasses;
using Microsoft.AspNet.OData.Query;
using SharedEFClasses.Models.Payment;
using Microsoft.AspNet.OData.Batch;

namespace Portal.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using SharedEFClasses.Models.TradeAccounts;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<TradeAccount>("TradeAccounts");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [System.Web.Http.Authorize]
    public class PaymentBudgetsController : BaseODataController
    {
        public PaymentBudgetsController(PortalDbContext portalDb) : base(portalDb)
        {

        }

        [EnableQuery]
        [HttpGet]
        public IQueryable<PaymentBudget> GetPaymentBudgets()
        {
            return PortalDb.PaymentBudgets.Where(p => p.Deleted == false).AsQueryable();
		}

		[EnableQuery]
		[HttpGet]
		public IQueryable<PaymentBudget> PaymentBudgetValueMapper(int? budgetId)
		{
			return PortalDb.PaymentBudgets.Where(c => c.Deleted == false && c.BudgetID == budgetId).AsQueryable();
		}

		[HttpPut]
		[EnableQuery]
		public async Task<IHttpActionResult> Put([FromODataUri] int key, [FromBody] PaymentBudget entity)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}
			else if (key != entity.BudgetID)
			{
				return BadRequest("The key from the url must match the key of the entity in the body");
			}

			var original = await PortalDb.PaymentBudgets.FindAsync(key);

			if (original == null || original.Deleted)
			{
				return NotFound();
			}
			else
			{
				PortalDb.Entry(original).CurrentValues.SetValues(entity);

				await PortalDb.SaveChangesAsync();

				original.Currency = PortalDb.Currencies.Single(c => c.CurrencyID == original.CurrencyID);

				original.PaymentPeriod = PortalDb.PaymentPeriods.Single(p => p.PeriodID == original.PeriodID);
			}

			return Updated(entity);
		}

		[HttpPost]
		[EnableQuery]
		public async Task<IHttpActionResult> Post([FromBody] PaymentBudget entity)
		{
			var batchId = Request.GetODataBatchId();

			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			var creationResult = PortalDb.PaymentBudgets.Add(entity);

			await PortalDb.SaveChangesAsync();

			creationResult.Currency = PortalDb.Currencies.Single(c => c.CurrencyID == creationResult.CurrencyID);

			creationResult.PaymentPeriod = PortalDb.PaymentPeriods.Single(p => p.PeriodID == creationResult.PeriodID);

			return Created(creationResult);
		}

		[AcceptVerbs("PATCH", "MERGE")]
		public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<PaymentBudget> patch)
		{
			object id;

			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}
			else if ((patch.TryGetPropertyValue("PaymentBudgetId", out id) && (int)id != key))
			{
				return BadRequest("The key from the url must match the key of the entity in the body");
			}

			var originalEntity = await PortalDb.PaymentBudgets.FindAsync(key);

			if (originalEntity == null || originalEntity.Deleted)
			{
				return NotFound();
			}
			else
			{
				patch.Patch(originalEntity);

				await PortalDb.SaveChangesAsync();

				originalEntity.Currency = PortalDb.Currencies.Single(c => c.CurrencyID == originalEntity.CurrencyID);

				originalEntity.PaymentPeriod = PortalDb.PaymentPeriods.Single(p => p.PeriodID == originalEntity.PeriodID);
			}


			return Updated(originalEntity);
		}

		[HttpDelete]
		[EnableQuery]
		public async Task<IHttpActionResult> Delete([FromODataUri] int key)
		{
			var entry = await PortalDb.PaymentBudgets.FindAsync(key);

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
