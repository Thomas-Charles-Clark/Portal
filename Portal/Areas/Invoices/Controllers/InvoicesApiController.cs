using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using Portal.Models;
using Portal.Utilities.Document;
using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Documents;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace Portal.Areas.Invoices.Controllers
{
    public class InvoicesAPIController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public InvoicesAPIController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.UserManager = userManager;
            this.PortalDb = portalDbContext;
        }

        [HttpGet]
        public DataSourceResult FetchTreatmentLinesPending(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
            [FromUri]PassInvoiceSearch objEnquiry)
        {
            var results = PortalDb.FetchTreatmentInvoiceLines(objEnquiry, completed: false);

            return results.Results.AsQueryable().ToDataSourceResult(request);
        }

        [HttpGet]
        public DataSourceResult FetchTreatmentLinesApproved(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
            [FromUri]PassInvoiceSearch objEnquiry)
        {
            var results = PortalDb.FetchTreatmentInvoiceLines(objEnquiry, completed: true);

            return results.Results.AsQueryable().ToDataSourceResult(request);
        }

        [HttpPost]
        public IHttpActionResult UpdateTreatmentSupplierInvoiceInfo([FromBody]PassTreatmentInvoiceInfo objUpdate)
        {
            var approvedDt = DateTime.Now;

            objUpdate.models.ForEach(m =>
            {
                var ol = PortalDb.OrderLines.Where(p => p.OrderLineID == m.TreatmentOrderLineID).Single();

                ol.SupplierInvoiceNumber = m.SupplierInvoiceNumber;
                ol.SupplierInvoiceCharge = m.SupplierInvoiceCharge;
                ol.SupplierInvoiceComments = m.SupplierInvoiceComments;
                ol.SupplierInvoiceDate = m.SupplierInvoiceDate;
                ol.SupplierInvoiceApproved = m.SupplierInvoiceApproved;
                ol.SupplierInvoiceApprovedDT = m.SupplierInvoiceApproved ? DateTime.Now : (DateTime?)null;
            });

            PortalDb.SaveChanges();

            return Ok(new { });
        }

        [HttpGet]
        public DataSourceResult FetchPaintLinesPending(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
            [FromUri]PassInvoiceSearch objEnquiry)
        {
            var results = PortalDb.FetchPaintInvoiceLines(objEnquiry, completed: false);

            return results.Results.AsQueryable().ToDataSourceResult(request);
        }

        [HttpGet]
        public DataSourceResult FetchPaintLinesApproved(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
            [FromUri]PassInvoiceSearch objEnquiry)
        {
            var results = PortalDb.FetchPaintInvoiceLines(objEnquiry, completed: true);

            return results.Results.AsQueryable().ToDataSourceResult(request);
        }

        [HttpPost]
        public IHttpActionResult UpdatePaintSupplierInvoiceInfo([FromBody]PassPaintInvoiceInfo objUpdate)
        {
            var approvedDt = DateTime.Now;

            objUpdate.models.ForEach(m =>
            {
                var ol = PortalDb.OrderLines.Where(p => p.OrderLineID == m.PaintOrderLineID).Single();

                ol.SupplierInvoiceNumber = m.SupplierInvoiceNumber;
                ol.SupplierInvoiceCharge = m.SupplierInvoiceCharge;
                ol.SupplierInvoiceComments = m.SupplierInvoiceComments;
                ol.SupplierInvoiceDate = m.SupplierInvoiceDate;
                ol.SupplierInvoiceApproved = m.SupplierInvoiceApproved;
                ol.SupplierInvoiceApprovedDT = m.SupplierInvoiceApproved ? DateTime.Now : (DateTime?)null;
            });

            PortalDb.SaveChanges();

            return Ok(new { });
        }
        
        [HttpGet]
        public DataSourceResult FetchFurnitureLinesPending(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
            [FromUri]PassInvoiceSearch objEnquiry)
        {
            var results = PortalDb.FetchFurnitureInvoiceLines(objEnquiry, completed: false);

            return results.Results.AsQueryable().ToDataSourceResult(request);
        }

        [HttpGet]
        public DataSourceResult FetchFurnitureLinesApproved(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
            [FromUri]PassInvoiceSearch objEnquiry)
        {
            var results = PortalDb.FetchFurnitureInvoiceLines(objEnquiry, completed: true);

            return results.Results.AsQueryable().ToDataSourceResult(request);
        }

        [HttpPost]
        public IHttpActionResult UpdateFurnitureSupplierInvoiceInfo([FromBody]PassFurnitureInvoiceInfo objUpdate)
        {
            var approvedDt = DateTime.Now;

            objUpdate.models.ForEach(m =>
            {
                var ol = PortalDb.OrderLines.Where(p => p.OrderLineID == m.FurnitureOrderLineID).Single();

                ol.SupplierInvoiceNumber = m.SupplierInvoiceNumber;
                ol.SupplierInvoiceCharge = m.SupplierInvoiceCharge;
                ol.SupplierInvoiceComments = m.SupplierInvoiceComments;
                ol.SupplierInvoiceDate = m.SupplierInvoiceDate;
                ol.SupplierInvoiceApproved = m.SupplierInvoiceApproved;
                ol.SupplierInvoiceApprovedDT = m.SupplierInvoiceApproved ? DateTime.Now : (DateTime?)null;
            });

            PortalDb.SaveChanges();

            return Ok(new { });
        }
    }
}
