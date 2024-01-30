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

namespace Portal.Areas.Customers.Controllers
{
    public class CustomerPricingController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private ApplicationUserManager UserManager { get; set; }

        public CustomerPricingController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.PortalDb = portalDbContext;
            this.UserManager = userManager;
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
