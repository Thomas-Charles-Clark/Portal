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
using Microsoft.Ajax.Utilities;

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
    public class SalesMarketsController : BaseODataController
    {
        public SalesMarketsController(PortalDbContext portalDb) : base(portalDb)
        {

        }

        // GET: odata/Products
        [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
        public IQueryable<SalesMarket> GetSalesMarkets()
        {
            return PortalDb.SalesMarkets.AsQueryable();
        }

        [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<SalesMarket> SalesMarketValueMapper(byte? salesMarketId)
        {
            return PortalDb.SalesMarkets.Where(p =>
                p.SalesMarketID == salesMarketId
            ).AsQueryable();
        }

        [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<SalesMarket> SalesMarketOrderBookFilter(
            int? tradeAccountId = null,
            short? tradeAccountTypeId = null,
            int? tradeAccountGroupId = null,
            short? salesRepresentativeId = null,
            short? salesAgentId = null,
            short? salesAreaId = null)
        {
            return PortalDb.SalesMarkets.Where(sm => 
                (tradeAccountId == null || sm.TradeAccounts.Any(ta => ta.TradeAccountID == tradeAccountId.Value)) &&
                (tradeAccountGroupId == null || sm.TradeAccounts.Any(ta => ta.TradeAccountGroupID == tradeAccountGroupId.Value)) &&
                (tradeAccountTypeId == null || sm.TradeAccounts.Any(ta => ta.TradeAccountTypeID == tradeAccountTypeId.Value)) &&
                (salesRepresentativeId == null || sm.SalesRepresentative_SalesMarkets.Select(srsm => srsm.SalesRepresentativeID).Contains(salesRepresentativeId.Value)) &&
                (salesAgentId == null || sm.SalesAgents.Select(sa => sa.SalesAgentID).Contains(salesAgentId.Value))
            ).AsQueryable();
        }
    }
}
