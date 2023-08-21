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
    public class TradeDeliveryContractPricesController : BaseODataController
    {
        public TradeDeliveryContractPricesController(PortalDbContext portalDb) : base(portalDb)
        {

        }

        // GET: odata/TradeAccounts
        [EnableQuery]
        public IQueryable<TradeDeliveryContractPrice> GetTradeDeliveryContractPrices()
        {
            return PortalDb.TradeDeliveryContractPrices.Where(p => (p.Deleted == false)).AsQueryable();
        }

        [EnableQuery]
        [HttpGet]
        public IQueryable<TradeDeliveryContractPrice> Filter(int? tradeAccountId, short? destinationCountryId, byte? deliveryGroupId)
        {
            return PortalDb.TradeDeliveryContractPrices.Where(p =>
                (p.Deleted == false) &&
                (tradeAccountId == null || p.TradeAccountID == tradeAccountId) &&
                (destinationCountryId == null || p.DestinationCountryID == destinationCountryId) &&
                (deliveryGroupId == null || p.DeliveryGroupID == deliveryGroupId)).AsQueryable();
        }

        public async Task<IHttpActionResult> Post([FromBody]TradeDeliveryContractPrice entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            PortalDb.TradeDeliveryContractPrices.Add(entity);

            await PortalDb.SaveChangesAsync();

            return Created(entity);
        }

        [EnableQuery]
        public async Task<IHttpActionResult> Put([FromODataUri] long key, [FromBody] TradeDeliveryContractPrice entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (key != entity.TradeDeliveryContractPriceID)
            {
                return BadRequest("The key from the url must match the key of the entity in the body");
            }

            var original = await PortalDb.TradeDeliveryContractPrices.FindAsync(key);

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

        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] long key, Delta<TradeDeliveryContractPrice> patch)
        {
            object id;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (patch.TryGetPropertyValue("TradeDeliveryContractPriceID", out id) && (long)id != key)
            {
                return BadRequest("The key from the url must match the key of the entity in the body");
            }

            var originalEntity = await PortalDb.TradeDeliveryContractPrices.FindAsync(key);

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


        [EnableQuery]
        public async Task<IHttpActionResult> Delete([FromODataUri] long key)
        {
            var price = await PortalDb.TradeDeliveryContractPrices.FindAsync(key);
            if (price == null)
            {
                return NotFound();
            }

            price.DeletedDT = DateTime.Now;

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
