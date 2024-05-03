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
using System.IO;
using System.Web;
using System.Xml.Linq;
using Portal.Utilities;
using System.Net.Http.Headers;
using SharedEFClasses.SignalR.Hubs;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.SignalR;

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

        [HttpGet]
        public async Task<IHttpActionResult> RefreshTransferOrders(
            [FromUri] RangeManagementTransferOrdersDto objDto)
        {
            var result = await PortalDb.RangeManagementTransferOrdersRefresh(objDto);
            
            return Ok(new { result });
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

        [HttpPost]
        public async Task<IHttpActionResult> SendNewSeasonNotification([FromBody] RangeManagementNotesDto objDto)
        {
            objDto.MemberID = User.Identity.GetUserId<int>();

            var results = await PortalDb.RangeManagementSendNewSeasonNotification(objDto);

            return Ok(results);
        }

        [HttpPost]
        public async Task<IHttpActionResult> SendExitingProductsNotification([FromBody] RangeManagementNotesDto objDto)
        {
            objDto.MemberID = User.Identity.GetUserId<int>();

            var results = await PortalDb.RangeManagementSendExitingProductsNotification(objDto);

            return Ok(results);
        }

        [HttpPost]
        public async Task<IHttpActionResult> CarryForwardProductsNotification([FromBody] RangeManagementNotesDto objDto)
        {
            objDto.MemberID = User.Identity.GetUserId<int>();

            var results = await PortalDb.RangeManagementSendCarryForwardsProductsNotification(objDto);

            return Ok(results);
        }

        [HttpPost]
        public async Task<IHttpActionResult> DownloadProductDataXlsx([FromBody]RangeManagementXlsxDto objDto)
        {
            objDto.UserID = $"736faa9e-05a8-46ae-816e-fc658358732b";

            objDto.TradeAccountCode = PortalDb.TradeAccounts.Single(ta => ta.TradeAccountID == objDto.TradeAccountID).Code;

            var data = await PortalDb.RangeManagementProductPageFeedExcelXML(objDto);

            var unique = Guid.NewGuid().ToString();

            var dirPath = HttpContext.Current.Server.MapPath("~/ExcelSpreadsheets/");

            if (!Directory.Exists(dirPath))
            {
                Directory.CreateDirectory(dirPath);
            }

            var filePath = HttpContext.Current.Server.MapPath("~/ExcelSpreadsheets/" + unique + ".xlsx");

            var products = data.Elements().Where(p => p.Name == "Products").Elements().Where(p => p.Name == "Product").ToList();

            //SpreadsheetHelper.WriteSpreadsheet(user.DisplayClearance, filePath, products);

            //var f = System.IO.File.OpenRead(filePath);

            using (var fs = new System.IO.FileStream(filePath, System.IO.FileMode.OpenOrCreate))
            {
                using (var ts = new System.IO.MemoryStream(Framework.StringToByteArray(Framework.XlsxTemplateHex)))
                {
                    using (var fastExcel = new FastExcel.FastExcel(ts, fs))
                    {
                        fastExcel.Write(
                            rows: products,
                            sheetName: "Sheet1",
                            uppercaseHeadings: true,
                            autoWidthColumns: true,
                            headingStyleId: (byte?)null,
                            standardStyleId: (byte?)null,
                            indentedHeadingStyleId: (byte?)null,
                            indentedStyleId: (byte?)null);
                    }
                }
            }

            var f = System.IO.File.OpenRead(filePath);

            var resultMessage = new HttpResponseMessage(HttpStatusCode.OK);

            resultMessage.Content = new StreamContent(f);

            resultMessage.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

            return ResponseMessage(resultMessage);
        }
    }
}
