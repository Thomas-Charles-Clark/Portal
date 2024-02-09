using Kendo.Mvc.UI;

using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Kendo.Mvc.Extensions;

using System.Data.Entity;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Threading.Tasks;
using System.Linq.Expressions;
using System.IO;
using SharedEFClasses.Models.ContractPricing;
using Portal.Utilities.DynamicRoles;
using System.Collections;

namespace Portal.Areas.Customers.Controllers
{
    [DynamicRoleAuthorize]
    public class ContractPricingController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private ApplicationUserManager UserManager { get; set; }

        public ContractPricingController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.PortalDb = portalDbContext;
            this.UserManager = userManager;
        }

        [HttpGet]
        public async Task<IHttpActionResult> FetchDeals([FromUri]ContractPricingDealsDto objDto)
        {
            var result = await PortalDb.ContractManagement_ContractList_Select(objDto);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchImpact([FromBody]ContractPricingImpactDto objDto)
        {
            var result = await PortalDb.ContractManagement_ContractImpact_Select(objDto);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchSalesData([FromBody]ContractPricingSalesDataDto objDto)
        {
            var result = await PortalDb.ContractManagement_SalesData_Select(objDto);

            return Ok(result);

            //return Ok(new ContractManagement_SalesData_SelectResult() 
            //{ 
            //    ProductResults = objDto.productId.Select((p, i) => new ContractManagement_SalesData_ProductResult() 
            //    { 
            //        ProductID = p,
            //        SalesQuantity_180Days = (i * 1) * 10,
            //        SalesValue_180Days = (i + 1) * 1000
            //    }),
            //    QualityResults = objDto.qualityId.Select((q, i) => new ContractManagement_SalesData_QualityResult()
            //    {
            //        QualityID = q,
            //        SalesQuantity_180Days = (i * 1) * 50,
            //        SalesValue_180Days = (i + 1) * 5000
            //    })
            //});
        }

        //[System.Web.Http.HttpGet]
        //public DataSourceResult CreationEmailsGridView(
        //    [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request, [FromUri]CreationEmailsGridViewDto objDto)
        //{
        //    var salesMarketId = objDto?.salesMarketId;

        //    var results = PortalDb.TradeAccountCreationEmails
        //        .Where(p => (salesMarketId == null || p.SalesMarketID == salesMarketId.Value) && p.Deleted == false)
        //        .AsQueryable();

        //    return results
        //        .ToDataSourceResult(request);
        //}

        //[HttpPost]
        //public IHttpActionResult CheckCreationEmailAttachment([FromBody] TradeAccountCreationEmailAttachmentDto dto)
        //{
        //    var success = true;

        //    try
        //    {
        //        if (!System.IO.Directory.Exists($"{dto.PathRoot}\\{dto.SalesMarketFolderName}\\"))
        //        {
        //            System.IO.Directory.CreateDirectory($"{dto.PathRoot}\\{dto.SalesMarketFolderName}\\");
        //        }

        //        if (!System.IO.Directory.Exists($"{dto.PathRoot}\\{dto.SalesMarketFolderName}\\{dto.ParentFolderName}"))
        //        {
        //            System.IO.Directory.CreateDirectory($"{dto.PathRoot}\\{dto.SalesMarketFolderName}\\{dto.ParentFolderName}");
        //        }

        //        if (!System.IO.File.Exists(dto.FinalFilePath))
        //        {
        //            System.IO.File.Copy(dto.path, dto.FinalFilePath);
        //        }

        //        var fi = new FileInfo(dto.FinalFilePath);

        //        return Ok(new { success = true, fileSizeBytes = fi.Length });
        //    }
        //    catch (Exception e)
        //    {
        //        return InternalServerError(e);
        //    }
        //}
    }
}
