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
using Microsoft.AspNet.OData;
using SharedEFClasses.Models.Products;

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
    public class StockLocationOrderBookGroupsController : ODataController
    {
        public StockLocationOrderBookGroupsController()
        {

        }

        // GET: odata/StockLocations
        [EnableQuery]
        public IQueryable<StockLocationOrderBookGroup> GetStockLocationOrderBookGroups()
        {
            var PortalDb = new PortalDbContext();

            return PortalDb.StockLocationOrderBookGroups.AsQueryable();
        }

        [EnableQuery(MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<StockLocationOrderBookGroup> StockLocationOrderBookGroupValueMapper(byte? stockLocationOrderBookGroupId)
        {
            var PortalDb = new PortalDbContext();

            return PortalDb.StockLocationOrderBookGroups.Where(p => p.StockLocationOrderBookGroupID == stockLocationOrderBookGroupId).AsQueryable();
        }
    }
}
