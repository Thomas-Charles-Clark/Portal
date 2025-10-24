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
    public class TradeAccountsController : BaseODataController
    {
        public TradeAccountsController(PortalDbContext portalDb) : base(portalDb)
        {

        }

        // GET: odata/TradeAccounts
        [EnableQuery(MaxNodeCount = 200)]
        public IQueryable<TradeAccount> GetTradeAccounts()
        {
            return PortalDb.TradeAccounts.Where(p => p.Open).AsQueryable();
        }

        [EnableQuery(MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<TradeAccount> TradeAccountGroupFilter(int? tradeAccountGroupId)
        {
            if (tradeAccountGroupId.HasValue)
            {
                return PortalDb.TradeAccounts.Where(p => p.Open && (p.TradeAccountGroupID == tradeAccountGroupId.Value)).AsQueryable();
            }
            else
            {
                return PortalDb.TradeAccounts.Where(p => p.Open).AsQueryable();
            }
        }

        [EnableQuery(MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<TradeAccount> TradeAccountTypeFilter(short? tradeAccountTypeId)
        {
            if (tradeAccountTypeId.HasValue)
            {
                return PortalDb.TradeAccounts.Where(p => p.Open && (p.TradeAccountTypeID == tradeAccountTypeId.Value)).AsQueryable();
            }
            else
            {
                return PortalDb.TradeAccounts.Where(p => p.Open).AsQueryable();
            }
        }

        [EnableQuery(MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<TradeAccount> TradeAccountValueMapper (int? tradeAccountId)
        {
            return PortalDb.TradeAccounts.Where(p => p.TradeAccountID == tradeAccountId).AsQueryable();
        }

        [EnableQuery(MaxNodeCount = 200)]
        public IQueryable<TradeAccount> GetTradeAccountsForOrderBookSummary()
        {
            // Who cares about samples anyway?
            return PortalDb.TradeAccounts.Where(ta =>
                ta.Deleted == false &&
                ta.Status == "O"
            ).AsQueryable();
        }

        [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<TradeAccount> GetTradeAccountsForDocumentsSentReport(bool includeClosedAccounts = false, bool includeDeletedAccounts = false)
        {
            // Include deleted and closed accounts: we might want to check what we sent a previously closed account?
            return PortalDb.TradeAccounts.Where(ta =>
                ((includeDeletedAccounts == true) || (includeDeletedAccounts == false && ta.Deleted == false)) &&
                ((includeClosedAccounts == true) || (includeClosedAccounts == false) && (ta.Status == "O"))
            ).AsQueryable();
        }

        [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<TradeAccount> GetTradeAccountsForStatements(bool includeClosedAccounts = false, bool includeDeletedAccounts = false)
        {
            // Include deleted and closed accounts: we might want to check what we sent a previously closed account?
            return PortalDb.TradeAccounts.Where(ta =>
                ((includeDeletedAccounts == true) || (includeDeletedAccounts == false && ta.Deleted == false)) &&
                ((includeClosedAccounts == true) || (includeClosedAccounts == false) && (ta.Status == "O"))
            ).AsQueryable();
        }

        [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<TradeAccount> TradeAccountOrderBookFilter(
            [FromODataUri] IEnumerable<byte> salesMarketIds = null,
            short? tradeAccountTypeId = null,
            int? tradeAccountGroupId = null,
            short? salesRepresentativeId = null,
            short? salesAgentId = null,
            short? salesAreaId = null)
        {
            salesMarketIds = salesMarketIds ?? new List<byte>();

            return PortalDb.TradeAccounts.Where(ta =>
                ta.Deleted == false &&
                ta.Status == "O" &&
                (!salesMarketIds.Any() || ta.SalesMarketID.HasValue && salesMarketIds.Contains(ta.SalesMarketID.Value)) &&
                (tradeAccountGroupId == null || ta.TradeAccountGroupID == tradeAccountGroupId.Value) &&
                (tradeAccountTypeId == null || ta.TradeAccountTypeID == tradeAccountTypeId.Value) &&
                (salesRepresentativeId == null || ta.SalesRepresentativeID == salesRepresentativeId.Value) &&
                (salesAgentId == null || ta.SalesAgentID == salesAgentId.Value)
            ).AsQueryable();
        }

        [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<TradeAccount> TradeAccountAdvertisers(
            short? advertiserClassId = null)
        {
            return PortalDb.TradeAccounts.Where(ta =>
                ta.Deleted == false &&
                ta.Status == "O" &&
                (
                    (advertiserClassId == null && ta.AdvertiserClassID != null) || 
                    (advertiserClassId != null && ta.AdvertiserClassID == advertiserClassId)
                )
            ).AsQueryable();
        }
    }
}
