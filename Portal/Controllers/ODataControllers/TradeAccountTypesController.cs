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
    public class TradeAccountTypesController : BaseODataController
    {
        public TradeAccountTypesController(PortalDbContext portalDb) : base(portalDb)
        {

        }

        // GET: odata/TradeAccounts
        [EnableQuery]
        public IQueryable<TradeAccountType> GetTradeAccountTypes()
        {
            var PortalDb = new PortalDbContext();

            return PortalDb.TradeAccountTypes.AsQueryable();
        }

        [EnableQuery(MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<TradeAccountType> TradeAccountTypeValueMapper(short? tradeAccountTypeId)
        {
            var PortalDb = new PortalDbContext();

            return PortalDb.TradeAccountTypes.Where(p => p.TradeAccountTypeID == tradeAccountTypeId).AsQueryable();
        }

        [EnableQuery(MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<TradeAccountType> TradeAccountTypeOrderBookFilter(
            [FromODataUri] IEnumerable<byte> salesMarketIds = null,
            int? tradeAccountGroupId = null,
            int? tradeAccountId = null,
            short? salesRepresentativeId = null,
            short? salesAgentId = null)
        {
            salesMarketIds = salesMarketIds ?? new List<byte>();

            if (tradeAccountId.HasValue)
            {
                var tradeAccount = PortalDb.TradeAccounts.Single(ta => ta.TradeAccountID == tradeAccountId.Value);
                   
                if (tradeAccount.TradeAccountTypeID.HasValue)
                {
                    return new[] { tradeAccount.TradeAccountType }.AsQueryable();
                }
                else
                {
                    return new TradeAccountType[] { }.AsQueryable();
                }
            }
            else
            {
                return PortalDb.TradeAccountTypes.Where(p =>
                    (!salesMarketIds.Any() || (p.TradeAccounts.Any(ta => ta.SalesMarketID.HasValue && salesMarketIds.Contains(ta.SalesMarketID.Value)))) &&
                    (tradeAccountGroupId == null || p.TradeAccounts.Any(ta => ta.TradeAccountGroupID == tradeAccountGroupId.Value)) &&
                    (salesRepresentativeId == null || p.TradeAccounts.Any(ta => ta.SalesRepresentativeID == salesRepresentativeId.Value)) &&
                    (salesAgentId == null || p.TradeAccounts.Any(ta => ta.SalesAgentID == salesAgentId.Value))
                ).AsQueryable();
            }
        }
    }
}
