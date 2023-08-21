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
    public class ColoursController : ODataController
    {
        private static PortalDbContext PortalDb { get; set; }

        public ColoursController(PortalDbContext portalDb)
        {
            PortalDb = portalDb;
        }

        // GET: odata/Colours
        [EnableQuery]
        public IQueryable<Colour> GetColours()
        {
            return PortalDb.Colours.Where(p => p.Deleted == false).AsQueryable();
        }

        [EnableQuery(MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<Colour> ColourValueMapper(byte? colourId)
        {
            return PortalDb.Colours.Where(p => p.ColourID == colourId).AsQueryable();
        }
    }
}
