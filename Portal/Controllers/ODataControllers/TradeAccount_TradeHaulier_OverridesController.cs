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
    [System.Web.Http.Authorize]
    public class TradeAccount_TradeHaulier_OverridesController : BaseODataController
    {
        public TradeAccount_TradeHaulier_OverridesController(PortalDbContext portalDb) : base(portalDb) { }

        // GET: odata/TradeAccounts
        [EnableQuery]
        public IQueryable<TradeAccount_TradeHaulier_Override> Get()
        {
            return PortalDb.TradeAccountTradeHaulierOverrides.AsQueryable();
        }

        public async Task<IHttpActionResult> Post([FromBody]TradeAccount_TradeHaulier_Override entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            PortalDb.TradeAccountTradeHaulierOverrides.Add(entity);

            await PortalDb.SaveChangesAsync();

            return Created(entity);
        }

        [EnableQuery]
        public async Task<IHttpActionResult> Put([FromODataUri] int key, [FromBody]TradeAccount_TradeHaulier_Override entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (key != entity.TradeAccountTradeHaulierOverrideID)
            {
                return BadRequest("The key from the url must match the key of the entity in the body");
            }

            var original = await PortalDb.TradeAccountTradeHaulierOverrides.FindAsync(key);

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
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<TradeAccount_TradeHaulier_Override> patch)
        {
            object id;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if ((patch.TryGetPropertyValue("TradeAccountId", out id) && (int)id != key))
            {
                return BadRequest("The key from the url must match the key of the entity in the body");
            }

            var originalEntity = await PortalDb.TradeAccountTradeHaulierOverrides.FindAsync(key);

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
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            var price = await PortalDb.TradeAccountTradeHaulierOverrides.FindAsync(key);

            if (price == null)
            {
                return NotFound();
            }

            PortalDb.TradeAccountTradeHaulierOverrides.Remove(price);

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
