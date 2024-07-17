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
using SharedEFClasses;
using Microsoft.AspNet.OData.Query;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Models.General;

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
    public class SalesAreasController : BaseODataController
    {
        public SalesAreasController(PortalDbContext portalDb) : base(portalDb)
        {

        }

        // GET: odata/Products
        [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
        public IQueryable<SalesArea> GetSalesAreas()
        {
            return PortalDb.SalesAreas.AsQueryable();
        }

        [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<SalesArea> SalesAgentValueMapper(short? salesAreaId)
        {
            return PortalDb.SalesAreas.Where(p =>
                p.SalesAreaID == salesAreaId
            ).AsQueryable();
        }

        [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<SalesArea> SalesAreasOrderBookFilter(
            [FromODataUri] IEnumerable<byte> salesMarketIds = null,
            int? tradeAccountId = null,
            short? tradeAccountTypeId = null,
            int? tradeAccountGroupId = null,
            short? salesRepresentativeId = null,
            short? salesAgentId = null)
        {
            salesMarketIds = salesMarketIds ?? new List<byte>();

            return PortalDb.SalesAreas.Where(sa =>
                (tradeAccountId == null || (sa.SalesMarketID != null && sa.SalesMarket.TradeAccounts.Any(ta => ta.TradeAccountID == tradeAccountId.Value))) &&
                (tradeAccountGroupId == null || (sa.SalesMarketID != null && sa.SalesMarket.TradeAccounts.Any(ta => ta.TradeAccountGroupID == tradeAccountGroupId.Value))) &&
                (tradeAccountTypeId == null || (sa.SalesMarketID != null && sa.SalesMarket.TradeAccounts.Any(ta => ta.TradeAccountTypeID == tradeAccountTypeId.Value))) &&
                (!salesMarketIds.Any() || (sa.SalesMarketID != null && sa.SalesMarket.TradeAccounts.Any(ta => ta.SalesMarketID.HasValue && salesMarketIds.Contains(ta.SalesMarketID.Value))))
            ).AsQueryable();
        }
    }
}
