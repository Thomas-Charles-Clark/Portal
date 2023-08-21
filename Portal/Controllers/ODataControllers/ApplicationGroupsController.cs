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
using SharedEFClasses.Models.Applications;

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
    public class ApplicationGroupsController : BaseODataController
    {
        public ApplicationGroupsController(PortalDbContext portalDb) : base (portalDb)
        {

        }

        [EnableQuery]
        public IQueryable<ApplicationGroup> GetApplicationGroups()
        {
            return PortalDb.ApplicationGroups.Where(p => p.DeletedDT == null).AsQueryable();
        }

        [EnableQuery]
        public async Task<IHttpActionResult> Post([FromBody]ApplicationGroup entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var toSave = entity.Applications.Select(p => p.ApplicationID).ToList();

            toSave.ForEach(s =>
            {
                var a = PortalDb.Applications.Where(p => p.ApplicationID == s).Single();

                a.ApplicationGroupID = entity.ApplicationGroupID;
            });

            entity.ButtonBackgroundColour = entity.ButtonFadeColourBottom;
            entity.ButtonHoverBackgroundColour = entity.ButtonFadeColourBottom;

            entity.Applications.Clear();

            PortalDb.ApplicationGroups.Add(entity);

            await PortalDb.SaveChangesAsync();

            return Created(PortalDb.ApplicationGroups.Include("Applications").Where(p => p.ApplicationGroupID == entity.ApplicationGroupID).Single());
        }

        [HttpPost]
        [EnableQuery]
        public async Task<IHttpActionResult> Create(IEnumerable<ApplicationGroup> applicationGroups)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            List<Tuple<byte, short>> groupsApplications = new List<Tuple<byte, short>>();

            PortalDb.ApplicationGroups.AddRange(applicationGroups);

            await PortalDb.SaveChangesAsync();

            applicationGroups.ToList().ForEach(entity =>
            {
                var toSave = entity.Applications.Select(p => p.ApplicationID).ToList();

                toSave.ForEach(s =>
                {
                    var a = PortalDb.Applications.Where(p => p.ApplicationID == s).Single();

                    a.ApplicationGroupID = entity.ApplicationGroupID;
                });

                entity.Applications.Clear();
            });

            return Created(applicationGroups);
        }

        [EnableQuery]
        public async Task<IHttpActionResult> Put([FromODataUri]byte key, [FromBody]ApplicationGroup entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (key != entity.ApplicationGroupID)
            {
                return BadRequest("The key from the url must match the key of the entity in the body");
            }

            var original = await PortalDb.ApplicationGroups.FindAsync(key);

            if (original == null)
            {
                return NotFound();
            }
            else
            {
                // Empty the group

                var toClear = PortalDb.Applications.Where(p => p.ApplicationGroupID == key).ToList();

                for (var i = 0; i < toClear.Count; i++)
                {
                    toClear[i].ApplicationGroupID = null;
                }

                var toSave = entity.Applications.Select(p => p.ApplicationID).ToList();

                toSave.ForEach(s => 
                {
                    var a = PortalDb.Applications.Where(p => p.ApplicationID == s).Single();

                    a.ApplicationGroupID = key;
                });

                entity.ButtonBackgroundColour = entity.ButtonFadeColourBottom;
                entity.ButtonHoverBackgroundColour = entity.ButtonFadeColourBottom;

                PortalDb.Entry(original).CurrentValues.SetValues(entity);

                await PortalDb.SaveChangesAsync();
            }

            return Updated(entity);
        }

        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri]byte key, Delta<ApplicationGroup> patch)
        {
            object id;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (patch.TryGetPropertyValue("ApplicationGroupID", out id) && (byte)id != key)
            {
                return BadRequest("The key from the url must match the key of the entity in the body");
            }

            var originalEntity = await PortalDb.ApplicationGroups.FindAsync(key);

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
        public async Task<IHttpActionResult> Delete([FromODataUri]byte key)
        {
            var entity = await PortalDb.ApplicationGroups.FindAsync(key);

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
