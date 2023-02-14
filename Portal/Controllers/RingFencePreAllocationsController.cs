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
    //[System.Web.Http.Authorize]
    public class RingFencePreAllocationsController : ODataController
    {
        public RingFencePreAllocationsController()
        {

        }

        // GET: odata/RingFencePreAllocations
        [EnableQuery]
        public IQueryable<RingFencePreAllocation> GetRingFencePreAllocations()
        {
            var PortalDb = new PortalDbContext();
            var results = PortalDb.RingFencePreAllocations.Where(p => p.Deleted == false).AsQueryable();
            return results;
        }

        [EnableQuery]
        [HttpGet]
        public IQueryable<RingFencePreAllocation> FilterRingFencePreAllocations(int? tradeAccountGroupId, int? tradeAccountId, int? productId)
        {
            var PortalDb = new PortalDbContext();

            var results = PortalDb.RingFencePreAllocations.Where(p => 
                p.Deleted == false &&
                (tradeAccountGroupId.HasValue ? tradeAccountGroupId.Value == p.TradeAccountGroupID : true)
                 && 
                (tradeAccountId.HasValue ? tradeAccountId.Value == p.TradeAccountID : true)
                && 
                (productId.HasValue ? productId.Value == p.ProductID : true)
            ).AsQueryable();

            return results;
        }
    }
}
