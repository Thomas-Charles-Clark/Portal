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
using SharedEFClasses;
using Microsoft.AspNet.OData.Query;
using SharedEFClasses.Models.Leads;

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
    public class TradeAccountGroupsController : BaseODataController
    {
        public TradeAccountGroupsController(PortalDbContext portalDb) : base(portalDb)
        {

        }

        // GET: odata/TradeAccounts
        [EnableQuery]
        public IQueryable<TradeAccountGroup> GetTradeAccountGroups()
        {
            var PortalDb = new PortalDbContext();

            return PortalDb.TradeAccountGroups.AsQueryable();
        }

        [EnableQuery(MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<TradeAccountGroup> TradeAccountGroupValueMapper(int? tradeAccountGroupId)
        {
            var PortalDb = new PortalDbContext();

            return PortalDb.TradeAccountGroups.Where(p => p.TradeAccountGroupID == tradeAccountGroupId).AsQueryable();
        }

        [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<TradeAccountGroup> TradeAccountGroupOrderBookFilter(
            [FromODataUri] IEnumerable<byte> salesMarketIds = null,
            int? tradeAccountId = null,
            short? tradeAccountTypeId = null,
            short? salesRepresentativeId = null,
            short? salesAgentId = null,
            short? salesAreaId = null)
        {
            salesMarketIds = salesMarketIds ?? new List<byte>();

            var tradeAccountGroupIds = PortalDb.TradeAccounts.Where(ta =>
                (!salesMarketIds.Any() || ta.SalesMarketID.HasValue && salesMarketIds.Contains(ta.SalesMarketID.Value)) &&
                (tradeAccountId == null || ta.TradeAccountID == tradeAccountId.Value) &&
                (tradeAccountTypeId == null || ta.TradeAccountTypeID == tradeAccountTypeId.Value) &&
                (salesRepresentativeId == null || ta.SalesRepresentativeID == salesRepresentativeId.Value) &&
                (salesAgentId == null || ta.SalesAgentID == salesAgentId.Value)
            )
                .Select(ta => ta.TradeAccountGroupID)
                .Distinct()
                .ToList();

            return PortalDb.TradeAccountGroups.Where(tag =>
                (!tradeAccountGroupIds.Any() || tradeAccountGroupIds.Contains(tag.TradeAccountGroupID))
            ).AsQueryable();
        }
    }
}
