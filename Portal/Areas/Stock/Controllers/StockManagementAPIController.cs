using SharedEFClasses.Models;
using SharedEFClasses;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.StockManagement;
using System.Threading.Tasks;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using System.Web.Http.ModelBinding;
using Portal.Areas.Stock.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Portal.Areas.Stock.Controllers
{
    [System.Web.Http.Authorize]
    public class StockManagementController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public StockManagementController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.UserManager = userManager;
            this.PortalDb = portalDbContext;
        }

        /// <summary>
        /// The Launch check is BS
        /// </summary>
        /// <param name="objDto"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<DataSourceResult> FetchProducts(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request, 
            [FromUri]StockManagementProductFetchDto objDto)
        {
            var results = await PortalDb.StockManagementProductSearch(objDto);

            var queryableResults = results.Results.AsQueryable();

            return queryableResults.ToDataSourceResult(request);
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchProductDetail([FromBody]StockManagementProductDetailFetchDto objDto)
        {
            var results = await PortalDb.StockManagementProductDetail(objDto);

            return Ok(results);

            //return Ok(new { });
        }

        [HttpGet]
        public async Task<SalesHistoryDataSourceResult> FetchSalesHistorySummaryGrid(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request, 
            [FromUri] StockManagementProductDetailFetchDto objDto)
        {
            var r = await PortalDb.StockManagementProductSalesHistorySummary(objDto);

            var queryableResults = JsonConvert.DeserializeObject<IEnumerable<object>>(r.Data ?? "[]").AsQueryable();

            return new SalesHistoryDataSourceResult(
                queryableResults.ToDataSourceResult(request),
                r.Schema, 
                r.Columns);
        }

        [HttpGet]
        public async Task<SalesHistoryDataSourceResult> FetchSalesHistoryDetailGrid(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
            [FromUri] StockManagementProductDetailFetchDto objDto)
        {
            var r = await PortalDb.StockManagementProductSalesHistoryDetail(objDto);

            var queryableResults = JsonConvert.DeserializeObject<IEnumerable<object>>(r.Data ?? "[]").AsQueryable();

            return new SalesHistoryDataSourceResult(
                queryableResults.ToDataSourceResult(request),
                r.Schema,
                r.Columns);
        }

        [HttpGet]
        public async Task<SalesHistoryDataSourceResult> FetchOrderBook(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
            [FromUri] StockManagementProductDetailFetchDto objDto)
        {
            var r = await PortalDb.StockManagementProductOrderBook(objDto);

            var queryableResults = JsonConvert.DeserializeObject<IEnumerable<object>>(r.Data ?? "[]").AsQueryable();

            return new SalesHistoryDataSourceResult(
                queryableResults.ToDataSourceResult(request),
                r.Schema,
                r.Columns);
        }

        [HttpPost]
        public async Task<IHttpActionResult> SaveStockManagementChanges([FromBody]StockManagementSaveDto objDto)
        {
            //var results = await PortalDb.StockManagementBranchRangeSave(objDto);

            return Ok(new { });
        }

        [HttpPost]
        public async Task<IHttpActionResult> SaveBranchRangeChanges([FromBody]StockManagementBranchRangeSaveDto objDto)
        {
            var results = await PortalDb.StockManagementBranchRangeSave(objDto);

            return Ok(new { });
        }
    }
}
