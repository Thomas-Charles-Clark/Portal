using Kendo.Mvc.UI;

using SharedEFClasses;
using SharedEFClasses.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;

using System.Data.Entity;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Threading.Tasks;

namespace Portal.Areas.Customers.Controllers
{
    public class CreationEmailsGridViewDto
    {
        public byte? salesMarketId { get; set; }
    }

    public class CheckEmailAttachmentDto
    {
        public string path { get; set; }
    }

    public class CustomerMaintenanceController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private ApplicationUserManager UserManager { get; set; }

        public CustomerMaintenanceController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.PortalDb = portalDbContext;
            this.UserManager = userManager;
        }

        [System.Web.Http.HttpGet]
        public DataSourceResult CreationEmailsGridView(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request, [FromUri]CreationEmailsGridViewDto objDto)
        {
            var salesMarketId = objDto?.salesMarketId;

            var results = PortalDb.TradeAccountCreationEmails
                .Where(p => (salesMarketId == null || p.SalesMarketID == salesMarketId.Value) && p.Deleted == false)
                .AsQueryable();

            return results
                .ToDataSourceResult(request);
        }

        [HttpPost]
        public IHttpActionResult CheckCreationEmailAttachment([FromBody] CheckEmailAttachmentDto dto)
        {
            return Ok(new { success = System.IO.File.Exists(dto.path) });
        }

        [HttpPost]
        public async Task<IHttpActionResult> SendTestCreationEmail([FromBody] SendTestCreationEmailDto dto) 
        {
            var result = await PortalDb.SendTradeAccountCreationEmailTest(dto);

            return Ok(result);
        }
    }
}
