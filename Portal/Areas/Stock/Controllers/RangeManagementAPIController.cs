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
using SharedEFClasses.Models.Orders;

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

        [HttpPost]
        public async Task<IHttpActionResult> CheckBranch([FromBody]RangeManagementBranchCheckDto objDto)
        {
            var result = await PortalDb.RangeManagementCheckBranch(objDto);

            return Ok(new { Notification = result });
        }

        [HttpGet]
        public IHttpActionResult FetchProductFilters([FromUri]PassProductSearchFilter objDto)
        {
            var preResults = PortalDb.FetchProductSearchFilters(objDto);

            var productFilters = preResults.CurrentSet
                .OrderBy(pf => pf.ProductFilterGroupSortOrder)
                .ThenBy(pf => pf.SortOrder)
                .Select(l => new ProductFilter()
            {
                ProductFilterID = l.ProductFilterID,
                Name = l.Name,
                ProductTypeID = l.ProductTypeID,
                ProductFilterGroupID = l.ProductFilterGroupID,
                IsProduct = l.IsProduct,
                SortOrder = l.SortOrder
            }).OrderBy(pf => pf.Name);

            var productFilterGroups = preResults.CurrentSet.GroupBy(pf => new
            {
                pf.ProductFilterGroupID,
                pf.ProductFilterGroup,
                pf.ProductFilterGroupSortOrder
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
                    }).OrderBy(pf => pf.Name),
                SortOrder = g.Key.ProductFilterGroupSortOrder
            })
            .OrderBy(pfg => pfg.Name);

            var result = new ProductFilterGroupResponse(productFilterGroups, productFilters);

            return Ok(result);
        }

        [HttpGet]
        public async Task<IHttpActionResult> FetchProducts([FromUri]RangeManagementProductFetchDto objDto)
        {
            var results = await PortalDb.RangeManagementProductSearch(objDto);

            return Ok(results);
        }

        [HttpPost]
        public async Task<IHttpActionResult> RefreshProductFilterTotal([FromBody] RangeManagementProductFilterTotalDto objDto) 
        {
            var results = await PortalDb.RangeManagementProductFilterTotal(objDto);

            return Ok(results);
        }

        [HttpGet]
        public async Task<DataSourceResult> FetchProductsAddToRange(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
            [FromUri] RangeManagementProductFetchDto objDto)
        {
            var results = await PortalDb.RangeManagementProductSearchAddToRange(objDto);

            var queryableResults = results.Results.AsQueryable();

            return queryableResults.ToDataSourceResult(request);
        }

        [HttpGet]
        public async Task<DataSourceResult> FetchTransferOrders(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
            [FromUri] RangeManagementTransferOrdersDto objDto)
        {
            var results = await PortalDb.RangeManagementTransferOrders(objDto);

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
        public async Task<IHttpActionResult> UpsertRange([FromBody] RangeManagementUpsertDto objDto)
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

        [HttpPost]
        public async Task<IHttpActionResult> RemoveTransferBasketItem([FromBody] RangeManagementBasketItemRemovalDto objDto)
        {
            objDto.MemberID = User.Identity.GetUserId<int>();

            var results = await PortalDb.RangeManagementRemoveBasketItem(objDto);

            return Ok(results);
        }

        [HttpGet]
        public async Task<IHttpActionResult> FetchBranchBaskets([FromUri] RangeManagementBranchCheckDto objDto) 
        {    
            var results = await PortalDb.RangeManagementBasketSelect(objDto);

            return Ok(results);
        }

        [HttpPost]
        public async Task<IHttpActionResult> ReleaseBranchBaskets([FromBody] RangeManagementBranchCheckDto objDto)
        {
            var results = await PortalDb.RangeManagementBasketRelease(objDto);

            return Ok(results);
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchNotes([FromBody] RangeManagementNotesDto objDto)
        {
            var results = await PortalDb.RangeManagementFetchNotes(objDto);

            return Ok(results);
        }

        [HttpPost]
        public async Task<IHttpActionResult> SaveNote([FromBody] RangeManagementNotesDto objDto)
        {
            objDto.MemberID = User.Identity.GetUserId<int>();

            var results = await PortalDb.RangeManagementSaveNote(objDto);

            return Ok(results);
        }
    }
}
