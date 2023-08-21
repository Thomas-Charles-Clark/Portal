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
    public class ResourcesController : BaseODataController
    {
        public ResourcesController(PortalDbContext portalDb) : base (portalDb)
        {

        }

        // GET: odata/Resources
        [EnableQuery]
        public IQueryable<Resource> GetResources()
        {
            return PortalDb.Resources.Where(p => p.DeletedDT == null).AsQueryable();
        }

        public async Task<IHttpActionResult> Post([FromBody]Resource entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            PortalDb.Resources.Add(entity);

            await PortalDb.SaveChangesAsync();

            PortalDb.Resource_Language_Initialise();

            return Created(entity);
        }

        [HttpPost]
        public async Task<IHttpActionResult> Create(IEnumerable<Resource> resources)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            PortalDb.Resources.AddRange(resources);

            await PortalDb.SaveChangesAsync();

            PortalDb.Resource_Language_Initialise();

            return Created(resources);
        }

        [EnableQuery]
        public async Task<IHttpActionResult> Put([FromODataUri]short key, [FromBody]Resource entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (key != entity.ResourceID)
            {
                return BadRequest("The key from the url must match the key of the entity in the body");
            }

            var original = await PortalDb.Resources.FindAsync(key);

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
        public async Task<IHttpActionResult> Patch([FromODataUri]short key, Delta<Resource> patch)
        {
            object id;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (patch.TryGetPropertyValue("ResourceID", out id) && (short)id != key)
            {
                return BadRequest("The key from the url must match the key of the entity in the body");
            }

            var originalEntity = await PortalDb.Resources.FindAsync(key);

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
        public async Task<IHttpActionResult> Delete([FromODataUri]short key)
        {
            var entity = await PortalDb.Resources.FindAsync(key);

            if (entity == null)
            {
                return NotFound();
            }

            entity.DeletedDT = DateTime.Now;

            await PortalDb.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
