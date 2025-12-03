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
    [System.Web.Http.Authorize]
    public class TradeAccountTypeGroupsController : BaseODataController
    {
        public TradeAccountTypeGroupsController(PortalDbContext portalDb) : base(portalDb)
        {

        }

		// GET: odata/TradeAccountTypeGroups
		[EnableQuery]
        public IQueryable<TradeAccountTypeGroup> GetTradeAccountTypeGroups()
        {
            var PortalDb = new PortalDbContext();

            return PortalDb.TradeAccountTypeGroups.AsQueryable();
        }

        [EnableQuery(MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<TradeAccountTypeGroup> TradeAccountTypeGroupValueMapper(byte? tradeAccountTypeGroupId)
        {
            var PortalDb = new PortalDbContext();

            return PortalDb.TradeAccountTypeGroups.Where(p => p.TradeAccountTypeGroupID == tradeAccountTypeGroupId).AsQueryable();
        }

        //[EnableQuery(MaxNodeCount = 200)]
        //[HttpGet]
        //public IQueryable<TradeAccountTypeGroup> TradeAccountTypeOrderBookFilter(
        //    [FromODataUri] IEnumerable<byte> salesMarketIds = null,
        //    int? tradeAccountGroupId = null,
        //    int? tradeAccountId = null,
        //    short? salesRepresentativeId = null,
        //    short? salesAgentId = null,
        //    short? salesAreaId = null,
        //    byte? tradeAccountTypeId = null)
        //{
        //    salesMarketIds = salesMarketIds ?? new List<byte>();

        //    if (tradeAccountId.HasValue)
        //    {
        //        var tradeAccount = PortalDb.TradeAccounts.Single(ta => ta.TradeAccountID == tradeAccountId.Value);
                   
        //        if (tradeAccount.TradeAccountTypeID.HasValue)
        //        {
        //            return new[] { tradeAccount.TradeAccountType }.AsQueryable();
        //        }
        //        else
        //        {
        //            return new TradeAccountType[] { }.AsQueryable();
        //        }
        //    }
        //    else
        //    {
        //        return PortalDb.TradeAccountTypes.Where(p =>
        //            (!salesMarketIds.Any() || (p.TradeAccounts.Any(ta => ta.SalesMarketID.HasValue && salesMarketIds.Contains(ta.SalesMarketID.Value)))) &&
        //            (tradeAccountGroupId == null || p.TradeAccounts.Any(ta => ta.TradeAccountGroupID == tradeAccountGroupId.Value)) &&
        //            (salesRepresentativeId == null || p.TradeAccounts.Any(ta => ta.SalesRepresentativeID == salesRepresentativeId.Value)) &&
        //            (salesAgentId == null || p.TradeAccounts.Any(ta => ta.SalesAgentID == salesAgentId.Value))
        //        ).AsQueryable();
        //    }
        //}
    }
}
