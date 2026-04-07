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
using SharedEFClasses.Models.Accounts;

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
    public class DGPaymentDetailsController : BaseODataController
    {
        public DGPaymentDetailsController(PortalDbContext portalDb) : base(portalDb)
        {

        }

        // GET: odata/MarketingBudgets
        [EnableQuery]
        public IQueryable<DGPaymentDetails> GetDGPaymentDetails()
        {
            // Ever any notion of these being deleted from Mertex and carrying a DeletedDT and thence an Deleted bit?
            return PortalDb.DGPaymentDetails.AsQueryable();
        }
        
        [EnableQuery]
        public async Task<IHttpActionResult> Put([FromODataUri] string key, [FromBody] DGPaymentDetails entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (key != entity.Code)
            {
                return BadRequest("The key from the url must match the key of the entity in the body");
            }

            var original = await PortalDb.DGPaymentDetails.FindAsync(key);

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

        [HttpPatch]
        public async Task<IHttpActionResult> Patch([FromODataUri] string key, Delta<DGPaymentDetails> patch)
        {
            object id;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (patch.TryGetPropertyValue("Code", out id) && (string)id != key)
            {
                return BadRequest("The key from the url must match the key of the entity in the body");
            }

            var originalEntity = await PortalDb.DGPaymentDetails.FindAsync(key);

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
