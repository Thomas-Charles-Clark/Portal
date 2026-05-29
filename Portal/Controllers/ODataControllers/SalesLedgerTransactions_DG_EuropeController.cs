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
    public class SalesLedgerTransactions_DG_EuropeController : BaseODataController
    {
        public SalesLedgerTransactions_DG_EuropeController(PortalDbContext portalDb) : base(portalDb)
        {

        }

        // GET: odata/Products
        [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
        public IQueryable<SalesLedgerTransaction_DG_Europe> GetSalesLedgerTransactions_DG_Europe()
        {
            return PortalDb.SalesLedgerTransactions_DG_Europe.AsQueryable();
		}

		[EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
		[HttpGet]
		public IQueryable<SalesLedgerTransaction_DG_Europe> GetSalesLedgerTransactions_DG_Europe_ForBankingDailyStatistics()
		{
			return PortalDb.SalesLedgerTransactions_DG_Europe.Where(p =>
				p.TransactionType == "INV" &&
                p.OutstandingAmountInCurrency > 0
			).AsQueryable();
		}

		[EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<SalesLedgerTransaction_DG_Europe> GetSalesLedgerTransactions_DG_Europe_ValueMapper(string key)
        {
            return PortalDb.SalesLedgerTransactions_DG_Europe.Where(p =>
                p.Key == key
            ).AsQueryable();
        }
    }
}
