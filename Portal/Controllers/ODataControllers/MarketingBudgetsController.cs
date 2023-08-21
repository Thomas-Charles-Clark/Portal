using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using SharedEFClasses.Models.Marketing;
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
    public class MarketingBudgetsController : BaseODataController
    {
        public MarketingBudgetsController(PortalDbContext portalDb) : base(portalDb)
        {

        }

        // GET: odata/MarketingBudgets
        [EnableQuery]
        public IQueryable<MarketingBudget> GetMarketingBudgets()
        {
            return PortalDb.MarketingBudgetRecords.Where(p => (p.Deleted == false)).AsQueryable();
        }

        [EnableQuery]
        [HttpGet]
        public IQueryable<MarketingBudget> Filter(byte? priceListId, short? marketingChannelId, string period)
        {
            DateTime? periodDt = null;

            if (DateTime.TryParseExact(
                period,
                "yyyy-MM-dd",
                System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.None,
                out DateTime dt)) 
            {
                periodDt = dt;
            }

            return PortalDb.MarketingBudgetRecords.Where(p =>
                (p.Deleted == false) &&
                (priceListId == null || p.PriceListID == priceListId) &&
                (marketingChannelId == null || p.MarketingChannelID == marketingChannelId) &&
                (periodDt == null || (p.Period.Month == periodDt.Value.Month && p.Period.Year == periodDt.Value.Year))).AsQueryable();
        }

        //[EnableQuery]
        //[HttpGet]
        //public IQueryable<MarketingBudget> Filter(byte? priceListId, short? marketingChannelId, int? year, int? month)
        //{
        //    return PortalDb.MarketingBudgetRecords.Where(p =>
        //        (p.Deleted == false) &&
        //        (priceListId == null || p.PriceListID == priceListId) &&
        //        (marketingChannelId == null || p.MarketingChannelID == marketingChannelId) &&
        //        (year == null || (p.Period.Year == year.Value)) &&
        //        (month == null || (p.Period.Month == month.Value))).AsQueryable();
        //}

        [EnableQuery]
        public async Task<IHttpActionResult> Put([FromODataUri] long key, [FromBody] MarketingBudget entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (key != entity.MarketingBudgetID)
            {
                return BadRequest("The key from the url must match the key of the entity in the body");
            }

            var original = await PortalDb.MarketingBudgetRecords.FindAsync(key);

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
        public async Task<IHttpActionResult> Patch([FromODataUri] long key, Delta<MarketingBudget> patch)
        {
            object id;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (patch.TryGetPropertyValue("MarketingBudgetID", out id) && (long)id != key)
            {
                return BadRequest("The key from the url must match the key of the entity in the body");
            }

            var originalEntity = await PortalDb.MarketingBudgetRecords.FindAsync(key);

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
