using SharedEFClasses.Models;
using SharedEFClasses;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SharedEFClasses.Models.General;
using System.Threading.Tasks;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using System.Web.Http.ModelBinding;
using Portal.Areas.Stock.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Microsoft.AspNet.Identity;
using SharedEFClasses.Models.RangeManagement;

namespace Portal.Areas.Stock.Controllers
{
    [System.Web.Http.Authorize]
    public class RangeManagementAPIController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public RangeManagementAPIController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.UserManager = userManager;
            this.PortalDb = portalDbContext;
        }

        [HttpGet]
        public IHttpActionResult FetchProductFilters([FromUri]PassProductSearchFilter objDto)
        {
            var preResults = PortalDb.FetchProductSearchFilters(objDto);

            var productFilters = preResults.CurrentSet.Select(l => new ProductFilter()
            {
                ProductFilterID = l.ProductFilterID,
                Name = l.Name,
                ProductTypeID = l.ProductTypeID,
                ProductFilterGroupID = l.ProductFilterGroupID,
                IsProduct = l.IsProduct
            });

            var productFilterGroups = preResults.CurrentSet.GroupBy(pf => new
            {
                pf.ProductFilterGroupID,
                pf.ProductFilterGroup
            }).Select(g => new ProductFilterGroup()
            {
                ProductFilterGroupID = g.Key.ProductFilterGroupID,
                Name = g.Key.ProductFilterGroup,
                ProductFilters = g.Select(l => new ProductFilter() 
                { 
                    ProductFilterID = l.ProductFilterID,
                    Name = l.Name,
                    ProductTypeID = l.ProductTypeID,
                    ProductFilterGroupID = l.ProductFilterGroupID,
                    IsProduct = l.IsProduct
                })
            });

            var result = new ProductFilterGroupResponse(productFilterGroups, productFilters);

            return Ok(result);
        }

        /// <summary>
        /// The Launch check is BS
        /// </summary>
        /// <param name="objDto"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<DataSourceResult> FetchProducts(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request, 
            [FromUri]RangeManagementProductFetchDto objDto)
        {
            var results = await PortalDb.RangeManagementProductSearch(objDto);

            var queryableResults = results.Results.AsQueryable();

            return queryableResults.ToDataSourceResult(request);
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchData(
            [FromBody] RangeManagementDataFetchDto objDto)
        {
            var results = await PortalDb.RangeManagementDataFetch(objDto);

            return Ok(results);
        }

        [HttpPost]
        public async Task<IHttpActionResult> UpsertRange([FromBody]RangeManagementUpsertDto objDto)
        {
            var results = await PortalDb.RangeManagementUpsert(objDto);

            return Ok(results);
        }

        [HttpPost]
        public async Task<IHttpActionResult> SubmitTransfer([FromBody] RangeManagementTransferDto objDto)
        {
            var results = await PortalDb.RangeManagementTransfer(objDto);

            return Ok(results);
        }
    }
}
