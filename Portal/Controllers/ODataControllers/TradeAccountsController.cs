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

        [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<TradeAccount> tradeAccountOrderBookFilter(
            byte? salesMarketId = null,
            short? tradeAccountTypeId = null,
            int? tradeAccountGroupId = null)
        {
            return PortalDb.TradeAccounts.Where(ta =>
                ta.Deleted == false &&
                ta.Status == "O" &&
                (salesMarketId == null || ta.SalesMarketID == salesMarketId.Value) &&
                (tradeAccountGroupId == null || ta.TradeAccountGroupID == tradeAccountGroupId.Value) &&
                (tradeAccountTypeId == null || ta.TradeAccountTypeID == tradeAccountTypeId.Value)
            ).AsQueryable();
        }
    }
}
