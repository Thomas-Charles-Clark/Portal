using DocumentFormat.OpenXml.Spreadsheet;

using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;

using MertexerV2SQL.Models.Misc;

using Microsoft.AspNet.Identity;

using Portal.Areas.Paint.Utilities;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.Products;

using System;
using System.Collections;
using System.Linq;

using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;

using Unity.Interception.Utilities;

namespace Portal.Areas.Products.Controllers
{
    [System.Web.Http.Authorize]
    public partial class PaintMixingAPIController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public PaintMixingAPIController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.UserManager = userManager;
            this.PortalDb = portalDbContext;
        }

        [HttpGet]
        public async Task<IHttpActionResult> FetchOutstandingOrdersGrid(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
            [FromUri]PassPaintOrderHeadSelect objEnquiry)
        {
            objEnquiry.MemberID = User.Identity.GetUserId<int>();

            var result = await PortalDb.PaintOrderHeadSelect(objEnquiry);

            return Ok(result.Orders.AsQueryable().ToDataSourceResult(request));
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchOutstandingOrders([FromBody]PassPaintOrderHeadSelect objEnquiry)
        {
            objEnquiry.MemberID = User.Identity.GetUserId<int>();

            return Ok(await PortalDb.PaintOrderHeadSelect(objEnquiry));
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchOrderLines([FromBody]PassPaintOrderLineSelect objEnquiry)
        {
            objEnquiry.MemberID = User.Identity.GetUserId<int>();

            return Ok(await PortalDb.PaintOrderLineSelect(objEnquiry));
        }

        [HttpPost]
        public async Task<IHttpActionResult> SaveOrderLines([FromBody]PassPaintOrderLineSave objSave)
        {
            objSave.MemberID = User.Identity.GetUserId<int>();

            return Ok(await PortalDb.PaintOrderLineSave(objSave));
        }

        [HttpPost]
        public async Task<IHttpActionResult> RelinquishOrderLines([FromBody]PassPaintOrderLineCancel objCancel)
        {
            objCancel.MemberID = User.Identity.GetUserId<int>();

            return Ok(await PortalDb.PaintOrderLineCancel(objCancel));
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchBoxLabels([FromBody]PassPaintBoxLabelSelect objEnquiry)
        {
            var response = await PortalDb.PaintGenerateBoxLabels(objEnquiry);

            response.DocumentBytes = PaintLabelGenerator.GeneratePDF(response);

            return Ok(response);
        }
    }
}
