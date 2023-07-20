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
using System.Linq.Expressions;
using System.IO;

namespace Portal.Areas.Customers.Controllers
{
    public class CreationEmailsGridViewDto
    {
        public byte? salesMarketId { get; set; }
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
        public IHttpActionResult CheckCreationEmailAttachment([FromBody] TradeAccountCreationEmailAttachmentDto dto)
        {
            var success = true;

            try
            {
                if (!System.IO.Directory.Exists($"{dto.PathRoot}\\{dto.SalesMarketFolderName}\\"))
                {
                    System.IO.Directory.CreateDirectory($"{dto.PathRoot}\\{dto.SalesMarketFolderName}\\");
                }

                if (!System.IO.File.Exists(dto.FinalFilePath))
                {
                    System.IO.File.Copy(dto.path, dto.FinalFilePath);
                }

                var fi = new FileInfo(dto.FinalFilePath);

                return Ok(new { success = true, fileSizeBytes = fi.Length });
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> SendTestCreationEmail([FromBody] SendTradeAccountCreationEmailTestDto dto) 
        {
            var result = await PortalDb.SendTradeAccountCreationEmailTest(dto);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IHttpActionResult> SaveTradeAccountCreationEmail([FromBody] SaveTradeAccountCreationEmailDto dto)
        {
            var result = await PortalDb.SaveTradeAccountCreationEmailTest(dto);

            return Ok(result);
        }

        [HttpGet]
        public IHttpActionResult GetTradeAccountCreationEmailAttachments([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request, byte? salesMarketId)
        {
            if (salesMarketId == null)
            {
                return Ok(PortalDb.TradeAccountCreationEmailAttachments
                            .Where(p => p.Deleted == false)
                            .OrderBy(p => p.Name)
                            .AsQueryable()
                            .ToDataSourceResult(request));
            }
            else
            {
                return Ok(PortalDb.TradeAccountCreationEmails_TradeAccountCreationEmailAttachments
                            .Where(p => p.Attachment.Deleted == false &&
                                        p.Email.SalesMarketID == salesMarketId)
                            .Select(p => p.Attachment)
                            .OrderBy(p => p.Name)
                            .AsQueryable()
                            .ToDataSourceResult(request));
            }

        }

        [HttpGet]
        public IHttpActionResult GetTradeAccountCreationEmailDefaults([FromUri]byte SalesMarketID)
        {
            return Ok(PortalDb.TradeAccountCreationEmails.Single(tace => tace.Deleted == false && tace.SalesMarketID == SalesMarketID));
        }
    }
}
