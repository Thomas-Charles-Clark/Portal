using DocumentFormat.OpenXml.Spreadsheet;

using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;

using Microsoft.AspNet.Identity;

using Newtonsoft.Json;

using Portal.Areas.Paint.Utilities;

using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Components;
using SharedEFClasses.Models.Fenwick;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Models.Orders;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Models.StockManagement;
using SharedEFClasses.ReturnModels;

using System;
using System.Collections;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.ServiceModel.Configuration;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.Results;

using Unity.Interception.Utilities;

namespace Portal.Areas.Fenwick.Controllers
{
    [System.Web.Http.Authorize]
    public partial class FenwickInvoicingAPIController : ApiController
    {
        private PortalDbContext PortalDb { get; set; }
        private readonly ApplicationUserManager UserManager;

        public FenwickInvoicingAPIController(PortalDbContext portalDbContext, ApplicationUserManager userManager)
        {
            this.UserManager = userManager;
            this.PortalDb = portalDbContext;
        }

        public async Task<IHttpActionResult> GetSelfBillInvoices([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))] DataSourceRequest request)
        {
            PortalDb.Configuration.LazyLoadingEnabled = true;

            //var prelist = PortalDb.FenwickSelfBillInvoices
            //    .Where(sbi => sbi.Deleted == false)
            //    .ToList();

            //var list = prelist
            //    .Select(sbi => new SelfBillInvoiceDto(
            //        sbi.SelfBillInvoiceID,
            //        sbi.InvoiceDate,
            //        sbi.BranchID,
            //        sbi.TotalGrossSales,
            //        sbi.TotalVAT,
            //        sbi.TotalCommission,
            //        sbi.FenwicksVariance,
            //        sbi.MertexRoundingVariance,
            //        sbi.CreatedDT,
            //        sbi.SignedOffDT,
            //        sbi.SignedOff,
            //        sbi.SignedOffMemberID,
            //        sbi.Notes,
            //        sbi.DeletedDT,
            //        sbi.Deleted,
            //        sbi.InvoicePDF,
            //        sbi.Branch,
            //        sbi.SignedOffByMember == null ? null : sbi.SignedOffByMember.FullName)
            //    ).ToList();

            var list = await PortalDb.FetchSelfBillInvoices();

            var grouped = list
                .GroupBy(p => p.InvoiceDate)
                .ToList();

            var groupedResult = grouped
                .Select(p => new
                {
                    InvoiceDate = p.Key,
                    Label = $"{p.Key.ToString("dd/MM/yyyy")} - Incomplete: {p.Select(q => q.SignedOff == true ? 0 : 1).Sum()}"
                }).ToList();

            return Ok(
                groupedResult
                .OrderBy(p => p.InvoiceDate)
                .AsQueryable()
                .ToDataSourceResult(request));
        }

        [HttpPost]
        public async Task<IHttpActionResult> FetchSelfBillInvoicesForDate([FromBody] PassFencwickSelfBillInvoiceDate objDto)
        {
            var results = PortalDb.FenwickSelfBillInvoices.Where(sbi => sbi.Deleted == false && sbi.InvoiceDate == objDto.InvoiceDate).Select(sbi => new 
            {
                sbi.BranchID,
                sbi.CreatedDT,
                BranchName = sbi.Branch.Name,
                sbi.FenwicksVariance,
                sbi.MertexRoundingVariance,
                sbi.Notes,
                sbi.SelfBillInvoiceID,
                sbi.SignedOff,
                sbi.SignedOffDT,
                sbi.SignedOffMemberID,
                SignedOffByMemberFullName = sbi.SignedOffByMember == null ? null : sbi.SignedOffByMember.FullName,
                sbi.TotalCommission,
                sbi.TotalGrossSales,
                sbi.TotalVAT,
                sbi.Processed,
                sbi.ProcessedDT
            });

            return Ok(results);
        }

        [HttpGet]
        public async Task<IHttpActionResult> BranchSelfBillInvoiceSelect([FromUri] PassFenwickSelfBillInvoiceFetchDto objDto)
        {
            var date = DateTime.ParseExact(objDto.Date, "yyyy-MM-dd", new CultureInfo("en-GB"));

            var sbi = PortalDb.FenwickSelfBillInvoices.Single(p => p.BranchID == objDto.BranchID && p.InvoiceDate == date);

            var selectResults = await PortalDb.FetchFenwickSelfBillInvoiceEntries(sbi.SelfBillInvoiceID);

            return Ok(
                new
                {
                    TotalGrossSales = sbi.TotalGrossSales,
                    TotalVAT = sbi.TotalVAT,
                    TotalCommission = sbi.TotalCommission,
                    FenwicksVariance = sbi.FenwicksVariance,
                    InvoiceDocumentBase64 = sbi.InvoicePDFBase64,
                    Reconciliations = selectResults.RecSummaries,
                    Invoices = selectResults.Invoices
                }
            );
        }

        [HttpPost]
        public async Task<object> InvoiceDocumentUpsert()
        {
            // Check if the request contains multipart/form-data.
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            var root = HttpContext.Current.Server.MapPath("~/Uploads");

            var provider = new MultipartFormDataStreamProvider(root);

            var result = await Request.Content.ReadAsMultipartAsync(provider);

            byte[] bytes = null;

            string fileExtension = null;

            if (provider.FileData.Any())
            {
                bytes = File.ReadAllBytes(result.FileData[0].LocalFileName);

                if (bytes.Count() > 2097152)
                {
                    return Request.CreateResponse(HttpStatusCode.ExpectationFailed, "File too large");
                }

                switch (provider.FileData[0].Headers.ContentType.MediaType)
                {
                    case "application/pdf":
                        fileExtension = "pdf";
                        break;
                }

                File.Delete(result.FileData[0].LocalFileName);
            }

            SelfBillInvoiceDocumentUpsertDto objUpsert = null;

            // Show all the key-value pairs.
            foreach (var key in provider.FormData.AllKeys)
            {
                if (key == "obj")
                {
                    objUpsert = JsonConvert.DeserializeObject<SelfBillInvoiceDocumentUpsertDto>(provider.FormData.GetValues(key)[0]);

                    objUpsert.Bytes = bytes;
                }
            }

            var sbi = PortalDb.FenwickSelfBillInvoices.Single(p => p.SelfBillInvoiceID == objUpsert.SelfBillInvoiceID);

            sbi.InvoicePDF = objUpsert.Bytes;

            PortalDb.SaveChanges();

            return Ok(new { InvoiceDocumentBase64 = sbi.InvoicePDFBase64 });
        }

        [HttpPost]
        public IHttpActionResult SaveSelfBillInvoice([FromBody]PassFenwickSelfBillInvoiceSaveDto objSave)
        {
            var sbi = PortalDb.FenwickSelfBillInvoices.Single(p => p.SelfBillInvoiceID == objSave.SelfBillInvoiceID);

            sbi.TotalGrossSales = objSave.GrossSales;

            sbi.TotalVAT = objSave.VAT;

            sbi.TotalCommission = objSave.Commission;

            sbi.Notes = objSave.Notes;

            if (objSave.SignedOff)
            {
                sbi.SignedOffDT = DateTime.Now;
                sbi.SignedOffMemberID = User.Identity.GetUserId<int>();
            }

            PortalDb.SaveChanges();
                
            return Ok(new { });
        }

        [HttpPost]
        public async Task<IHttpActionResult> SubmitSignedOffInvoices()
        {
            await PortalDb.FenwickInvoiceProcess();

            return Ok(new { });
        }

        [HttpPost]
        public async Task<IHttpActionResult> DeleteACLSales()
        {
            await PortalDb.DeleteACLSales();

            return Ok(new { });
        }
    }
}

