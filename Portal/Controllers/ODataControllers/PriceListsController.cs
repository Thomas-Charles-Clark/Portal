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
using SharedEFClasses.Models.General;

namespace Portal.Controllers
{
    [System.Web.Http.Authorize]
    public class PriceListsController : BaseODataController
    {
        public PriceListsController(PortalDbContext portalDb) : base(portalDb)
        {

        }

        // GET: odata/Products
        [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
        public IQueryable<PriceList> GetPriceLists()
        {
            return PortalDb.PriceLists.AsQueryable();
        }

        [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.All, MaxNodeCount = 200)]
        [HttpGet]
        public IQueryable<PriceList> PriceListValueMapper(byte? priceListId)
        {
            return PortalDb.PriceLists.Where(p =>
                p.PriceListID == priceListId
            ).AsQueryable();
        }
    }
}
