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
    public class Resource_LanguagesController : BaseODataController
    {
        public Resource_LanguagesController(PortalDbContext portalDb) : base(portalDb)
        {

        }

        // GET: odata/Resource_Languages
        [EnableQuery]
        public IQueryable<Resource_Language> GetResource_Languages()
        {
            return PortalDb.Resource_Languages.Where(p => p.LanguageID != 1).AsQueryable();
        }

        public IHttpActionResult Post([FromBody]Resource_Language entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Now. This one is a bit of a kludge, because I'm permitting creation of the parent entity
            // using a grid designed for the child. No matter:

            PortalDb.Resources.Add(new Resource()
            {
                CreatedDT = DateTime.Now,
                Name = entity.Resource.Name,
                Value = entity.Resource.Value
            });

            PortalDb.SaveChanges();

            PortalDb.Resource_Language_Initialise();

            // Rather leaves me wondering what to return here, I'm afraid... I haven't created a specific entity, because I haven't
            // demanded a language... I could default that language... but to what? there... hmm... isn't an answer yet.

            return Created(entity);
        }

        [EnableQuery]
        public async Task<IHttpActionResult> Put([FromODataUri]short keyResourceId, [FromODataUri]byte keyLanguageId, [FromBody]Resource_Language entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (keyResourceId != entity.ResourceID || keyLanguageId != entity.LanguageID)
            {
                return BadRequest("The key from the url must match the key of the entity in the body");
            }

            var original = await PortalDb.Resource_Languages.FindAsync(keyResourceId, keyLanguageId);

            if (original == null)
            {
                return NotFound();
            }
            else
            {
                if (String.IsNullOrWhiteSpace(entity.Value))
                    entity.Value = null;

                PortalDb.Entry(original).CurrentValues.SetValues(entity);
                await PortalDb.SaveChangesAsync();
            }

            return Updated(entity);
        }

        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri]short resourceId, [FromODataUri]byte languageId, Delta<Resource_Language> patch)
        {
            object id;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else if (patch.TryGetPropertyValue("ResourceID", out id) && (short)id != resourceId)
            {
                return BadRequest("The key from the url must match the key of the entity in the body");
            }
            else if (patch.TryGetPropertyValue("LanguageID", out id) && (byte)id != languageId)
            {
                return BadRequest("The key from the url must match the key of the entity in the body");
            }

            var originalEntity = await PortalDb.Resource_Languages.FindAsync(resourceId, languageId);

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
        public Task<IHttpActionResult> Delete([FromODataUri]short resourceId, [FromODataUri]byte languageId)
        {
            throw new NotImplementedException();

            //var entity = await PortalDb.Resource_Languages.FindAsync(resourceId, languageId);

            //if (entity == null)
            //{
            //    return NotFound();
            //}

            //entity.DeletedDT = DateTime.Now;

            //await PortalDb.SaveChangesAsync();

            //return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
