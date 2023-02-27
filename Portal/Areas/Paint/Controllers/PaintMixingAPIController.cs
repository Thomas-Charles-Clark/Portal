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
using SharedEFClasses.ReturnModels;

using System;
using System.Collections;
using System.Linq;

using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.Results;

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

        [HttpGet]
        public async Task<IHttpActionResult> FetchOrderHistoryGrid(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
            [FromUri] PassPaintOrderHistorySelect objEnquiry)
        {
            objEnquiry.MemberID = User.Identity.GetUserId<int>();

            var result = await PortalDb.PaintOrderHistorySelect(objEnquiry);

            return Ok(result.Orders.AsQueryable().ToDataSourceResult(request));
        }

        [HttpGet]
        public async Task<IHttpActionResult> FetchOrdersToInvoice(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
            [FromUri] PassPaintOrdersToInvoice objEnquiry)
        {
            objEnquiry.MemberID = User.Identity.GetUserId<int>();

            var result = await PortalDb.PaintOrdersToInvoice(objEnquiry);

            return Ok(result.Orders.AsQueryable().ToDataSourceResult(request));
        }

        [HttpGet]
        public async Task<IHttpActionResult> FetchTranfers(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
            [FromUri] PassTransferGridSelect objEnquiry
            )
        {
            objEnquiry.MemberID = User.Identity.GetUserId<int>();

            var result = await PortalDb.PaintTransferOrders(objEnquiry);

            return Ok(new
            {
                dsResult = result.Orders.AsQueryable().ToDataSourceResult(request),
                AllResults = result.Orders.ToList(),
                Notices = result.Notices
            });
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

            var results = await PortalDb.PaintOrderLineSelect(objEnquiry);

            var withMixingSession = results.OrderLines.Where(ol => ol.MixingSessionID != null).ToList();

            return Ok(results);
        }

        [HttpGet]
        public async Task<IHttpActionResult> FetchOrderLinesGrid([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request,
            [FromUri] PassPaintOrderLineSelect objEnquiry)
        {
            objEnquiry.MemberID = User.Identity.GetUserId<int>();

            var result = await PortalDb.PaintOrderLineSelect(objEnquiry);

            return Ok(new
            {
                dsResult = result.OrderLines.AsQueryable().ToDataSourceResult(request),
                MixingSessions = result.MixingSessions.ToList(),
                Notices = result.Notices
            });
        }
        
        [HttpPost]
        public async Task<IHttpActionResult> SaveBoxCount([FromBody] PassMixingSessionBoxCount objSave)
        {
            var mixingSession = PortalDb.MixingSessions.Single(ms => ms.MixingSessionID == objSave.MixingSessionID);

            mixingSession.BoxCount = objSave.BoxCount;

            await PortalDb.SaveChangesAsync();

            return Ok(new { });
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
        public async Task<IHttpActionResult> FetchBoxLabels([FromBody]PassMixingSessionID objEnquiry)
        {
            var response = await PortalDb.PaintGenerateBoxLabels(objEnquiry);

            response.DocumentBytes = PaintLabelGenerator.GenerateBoxLabelPDF(response);

            return Ok(response);
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchTransferManifest([FromBody]PassPaintTransferSave objSave)
        {
            var response = await PortalDb.PaintTransferSave(objSave);

            var mixingLocation = PortalDb.MixingLocations.Single(ml => ml.MixingLocationID == objSave.MixingLocationID);

            response.TransferDescription = mixingLocation.TransferDescription;

            response.TransferOrders = objSave.TransferOrders;

            response.DocumentBytes = PaintLabelGenerator.GenerateTransferManifestPDF(response);

            return Ok(response);
        }

        [HttpPost] 
        public async Task<IHttpActionResult> UpdateBasePaintOrderStatus([FromBody]PassMixingSessionID objEnquiry)
        {
            return Ok(await PortalDb.PaintUpdateOrderStatus(objEnquiry));
        }

        [HttpPost]
        public async Task<IHttpActionResult> UpdateBasePaintOrderStatusAll()
        {
            return Ok(await PortalDb.PaintStockOrdersToInvoiceUpdateAll());
        }
    }
}
