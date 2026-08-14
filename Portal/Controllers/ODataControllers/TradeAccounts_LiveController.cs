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
using SharedEFClasses.Models.Mertex;

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
    public class TradeAccounts_LiveController : BaseODataController
    {
        public TradeAccounts_LiveController(PortalDbContext portalDb) : base(portalDb)
        {

        }

        // GET: odata/Products
        [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
        public IQueryable<TradeAccountLive> GetTradeAccountLives()
        {
            return PortalDb.TradeAccounts_Live.Where(h => h.Deleted == false).AsQueryable();
        }

        [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<TradeAccountLive> TradeAccountLiveValueMapper(string tradeAccountCode)
        {
            return PortalDb.TradeAccounts_Live.Where(h =>
                h.Deleted == false &&
                h.Code == tradeAccountCode
            ).AsQueryable();
		}

		[EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
		[HttpGet]
		public IQueryable<TradeAccountLive> GetTradeAccountsForCreditControl(bool? showOpenClosedOrBoth = false, bool includeDeletedAccounts = false)
		{
			// Include deleted and closed accounts: we might want to check what we sent a previously closed account?
			return PortalDb.TradeAccounts_Live.Where(ta =>
				((includeDeletedAccounts == true) || (includeDeletedAccounts == false && ta.Deleted == false)) &&
				(
                    (showOpenClosedOrBoth == null) 
                    || ((showOpenClosedOrBoth == true) && (ta.Status == "O"))
                    || ((showOpenClosedOrBoth == false) && (ta.Status == "C"))    
                )
			).AsQueryable();
		}
	}
}
