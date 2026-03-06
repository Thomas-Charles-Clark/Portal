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
	public class SupplierPayments_SupplierRecordsController : BaseODataController
	{
		public SupplierPayments_SupplierRecordsController(ApplicationUserManager userManager, PortalDbContext portalDbContext) : base(userManager, portalDbContext)
		{

		}

		[HttpGet]
		[EnableQuery]
		public async Task<IQueryable<SupplierPayments_SupplierRecord>> GetSupplierPayments_SupplierRecords([FromODataUri] SupplierPayments_Supplier_SelectDTO dto)
		{
			var userId = User.Identity.GetUserId<int>();

			var results = await PortalDb.SupplierPayment_Supplier_Select(dto);

			return results.Records.AsQueryable();
		}
		
		[HttpGet]
		[EnableQuery]
		public async Task<IQueryable<SupplierPayments_SupplierRecord>> SuppliersGridRead([FromODataUri] SupplierPayments_Supplier_SelectDTO dto)
		{
			var userId = User.Identity.GetUserId<int>();
			// don't need to be pulling this here: it's valid to call the following with a null memberId

			var results = await PortalDb.SupplierPayment_Supplier_Select(dto);

			return results.Records.AsQueryable();
		}

		[HttpPut]
		[EnableQuery]
		public async Task<IHttpActionResult> Put([FromODataUri] string key, [FromBody] SupplierPayments_SupplierRecord entity)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}
			else if (key != entity.SupplierCode)
			{
				return BadRequest("The key from the url must match the key of the entity in the body");
			}

			var original = await PortalDb.Suppliers_Live.FindAsync(key);

			if (original == null || (original.Deleted == true))
			{
				return NotFound();
			}
			else
			{
				original.ProductionStopped = entity.ProductionStopped;

				original.ShippingStopped = entity.ShippingStopped;

				await PortalDb.SaveChangesAsync();
			}

			return Updated(entity);
		}

		[AcceptVerbs("PATCH", "MERGE")]
		public async Task<IHttpActionResult> Patch([FromODataUri] string key, Delta<SupplierPayments_SupplierRecord> patch)
		{
			object id;

			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}
			else if (patch.TryGetPropertyValue("SupplierCode", out id))
			{
				return BadRequest("The key from the url must match the key of the entity in the body");
			}

			var originalEntity = await PortalDb.Suppliers_Live.FindAsync(key);

			if (originalEntity == null || (originalEntity.Deleted  == true))
			{
				return NotFound();
			}
			else
			{
				if (patch.TryGetPropertyValue("ProductionStopped", out object productionStopped)) 
				{
					originalEntity.ProductionStopped = (bool)productionStopped;
				}

				if (patch.TryGetPropertyValue("ShippingStopped", out object shippingStopped))
				{
					originalEntity.ShippingStopped = (bool)shippingStopped;
				}

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