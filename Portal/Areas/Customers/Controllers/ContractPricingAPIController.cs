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
        public async Task<IHttpActionResult> FetchDeals([FromUri]ContractPricingDealsDto dto)
        {
            var result = await PortalDb.ContractManagement_ContractList_Select(dto);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchImpact([FromBody]ContractPricingImpactDto dto)
        {
            var result = await PortalDb.ContractManagement_ContractImpact_Select(dto);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchSalesData([FromBody]ContractPricingSalesDataDto dto)
        {
            var result = await PortalDb.ContractManagement_SalesData_Select(dto);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IHttpActionResult> QualitySearch([FromBody]ContractPricingQualityProductSearchDto dto)
        {
            var result = await PortalDb.ContractManagement_Quality_Search(dto);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IHttpActionResult> ProductSearch([FromBody] ContractPricingQualityProductSearchDto dto)
        {
            var result = await PortalDb.ContractManagement_Product_Search(dto);

            return Ok(result);
        }

        [HttpPost] public async Task<IHttpActionResult> ContractPricingMerge([FromBody]ContractPricingMergeDto dto)
        {
            var result = await PortalDb.ContractManagement_Contract_Merge(dto);

            return Ok(result);
        }
    }
}
