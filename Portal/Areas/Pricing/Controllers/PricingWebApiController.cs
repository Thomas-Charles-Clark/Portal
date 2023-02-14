using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Validation;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Portal.Models;
using Portal.Utilities;
using Portal.Utilities.DynamicRoles;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Cache;
using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Pricing;
using SharedEFClasses.Models.TradeAccounts;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace Portal.Areas.Pricing.Controllers
{
    [DynamicRoleAuthorize]
    public class PricingController : ApiController
    {
        private PortalDbContext portalDb { get; set; }

        public PricingController(PortalDbContext portalDbContext)
        {
            this.portalDb = portalDbContext;
        }

        [HttpGet]
        public DataSourceResult CustomerPrices(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
            [FromUri]int? TradeAccountID,
            [FromUri]short? TradePriceListID,
            [FromUri]byte? MarketID,
            [FromUri]byte? CurrencyID,
            [FromUri]string SearchTerm,
            [FromUri]short? CollectionID,
            [FromUri]short? QualityID,
            [FromUri]int? ProductID,
            [FromUri]byte? BrandID,
            [FromUri]byte? ProductTypeID,
            [FromUri]bool IncludeClearance,
            [FromUri]bool IncludeSamples,
            [FromUri]byte[] BrandIDs,
            [FromUri]byte[] ProductTypeGroupIDs,
            [FromUri]byte[] ProductTypeIDs,
            [FromUri]short?[] ItemTypeIDs,
            [FromUri]short[] LaunchIDs,
            [FromUri]byte[] SeasonIDs,
            [FromUri]bool CacheBuster)
        {
            var zeroResult = new List<CustomerPrice_EnquiryResult>();
            
            PricingQueryFilter f1 = new PricingQueryFilter();
            f1.TradeAccountID = TradeAccountID;
            f1.TradePriceListID = TradePriceListID;
            f1.MarketID = MarketID;
            f1.CurrencyID = CurrencyID;
            f1.SearchTerm = SearchTerm;
            f1.CollectionID = CollectionID;
            f1.QualityID = QualityID;
            f1.ProductID = ProductID;
            f1.BrandID = BrandID;
            f1.ProductTypeID = ProductTypeID;
            f1.IncludeClearance = IncludeClearance;
            f1.IncludeSamples = IncludeSamples;
            f1.BrandIDs = BrandIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeGroupIDs = ProductTypeGroupIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeIDs = ProductTypeIDs?.ToList() ?? new List<byte>();
            f1.ItemTypeIDs = ItemTypeIDs?.ToList() ?? new List<short?>();
            f1.LaunchIDs = LaunchIDs?.ToList() ?? new List<short>();
            f1.SeasonIDs = SeasonIDs?.ToList() ?? new List<byte>();
            f1.CacheBuster = CacheBuster;

            if ((TradePriceListID == null && MarketID == null && CurrencyID == null) &&
                (SearchTerm == null &&
                CollectionID == null &&
                f1.QualityID == null &&
                f1.ProductID == null &&
                f1.BrandID == null &&
                f1.ProductTypeID == null &&
                f1.BrandIDs.Count == 0 &&
                f1.ProductTypeGroupIDs.Count == 0 &&
                f1.ProductTypeIDs.Count == 0 &&
                f1.ItemTypeIDs.Count == 0 &&
                f1.LaunchIDs.Count == 0 &&
                f1.SeasonIDs.Count == 0))
            {
                return zeroResult.AsQueryable().ToDataSourceResult(request);
            }

            if (request.Sorts != null)
            {
                foreach (var i in request.Sorts)
                {
                    if (i.Member == "MarginDisparity")
                    {
                        i.Member = "GrossMargin";
                    }
                }
            }

            var productIDs = GetFilteredProducts(f1);

            var cache = new PortalCache<CustomerPriceResult>(
                String.Format("CustomerPrices~{0}~{1}",
                    f1.GetHashCode().ToString(),
                    String.Join("~", productIDs.Select(p => p.ToString().ToArray()))
                )
            );

            if (f1.CacheBuster)
            {
                cache.Invalidate(DateTime.Now);
            }

            var result = cache.Get(DateTime.Now);

            if (result == null)
            {
                result = new CustomerPriceResult() { Results = portalDb.CustomerPriceCheck(f1, productIDs) };

                cache.Set(DateTime.Now, result, 60);
            }

            return result.Results.AsQueryable().ToDataSourceResult(request);
        }

        [HttpGet]
        public HttpResponseMessage CustomerPricesXLSX([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
           [FromUri]int? TradeAccountID,
           [FromUri]short? TradePriceListID,
           [FromUri]byte? MarketID,
           [FromUri]byte? CurrencyID,
           [FromUri]string SearchTerm,
           [FromUri]short? CollectionID,
           [FromUri]short? QualityID,
           [FromUri]int? ProductID,
           [FromUri]byte? BrandID,
           [FromUri]byte? ProductTypeID,
           [FromUri]bool IncludeClearance,
           [FromUri]bool IncludeSamples,
           [FromUri]byte[] BrandIDs,
           [FromUri]byte[] ProductTypeGroupIDs,
           [FromUri]byte[] ProductTypeIDs,
           [FromUri]short?[] ItemTypeIDs,
           [FromUri]short[] LaunchIDs,
           [FromUri]byte[] SeasonIDs,
           [FromUri]bool CacheBuster)
        {
            #region Data Fetch
            var zeroResult = new List<CustomerPrice_EnquiryResult>();

            PricingQueryFilter f1 = new PricingQueryFilter();
            f1.TradeAccountID = TradeAccountID;
            f1.TradePriceListID = TradePriceListID;
            f1.MarketID = MarketID;
            f1.CurrencyID = CurrencyID;
            f1.SearchTerm = SearchTerm;
            f1.CollectionID = CollectionID;
            f1.QualityID = QualityID;
            f1.ProductID = ProductID;
            f1.BrandID = BrandID;
            f1.ProductTypeID = ProductTypeID;
            f1.IncludeClearance = IncludeClearance;
            f1.IncludeSamples = IncludeSamples;
            f1.BrandIDs = BrandIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeGroupIDs = ProductTypeGroupIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeIDs = ProductTypeIDs?.ToList() ?? new List<byte>();
            f1.ItemTypeIDs = ItemTypeIDs?.ToList() ?? new List<short?>();
            f1.LaunchIDs = LaunchIDs?.ToList() ?? new List<short>();
            f1.SeasonIDs = SeasonIDs?.ToList() ?? new List<byte>();
            f1.CacheBuster = CacheBuster;

            if ((TradePriceListID == null && MarketID == null && CurrencyID == null) &&
                (SearchTerm == null &&
                CollectionID == null &&
                f1.QualityID == null &&
                f1.ProductID == null &&
                f1.BrandID == null &&
                f1.ProductTypeID == null &&
                f1.BrandIDs.Count == 0 &&
                f1.ProductTypeGroupIDs.Count == 0 &&
                f1.ProductTypeIDs.Count == 0 &&
                f1.ItemTypeIDs.Count == 0 &&
                f1.LaunchIDs.Count == 0 &&
                f1.SeasonIDs.Count == 0))
            {
                return new HttpResponseMessage(HttpStatusCode.ExpectationFailed);
            }

            if (request.Sorts != null)
            {
                foreach (var i in request.Sorts)
                {
                    if (i.Member == "MarginDisparity")
                    {
                        i.Member = "GrossMargin";
                    }
                }
            }

            var productIDs = GetFilteredProducts(f1);

            var cache = new PortalCache<CustomerPriceResult>(
                String.Format("CustomerPrices~{0}~{1}",
                    f1.GetHashCode().ToString(),
                    String.Join("~", productIDs.Select(p => p.ToString().ToArray()))
                )
            );
            
            if (f1.CacheBuster)
            {
                cache.Invalidate(DateTime.Now);
            }

            var result = cache.Get(DateTime.Now);

            if (result == null)
            {
                result = new CustomerPriceResult() { Results = portalDb.CustomerPriceCheck(f1, productIDs) };
                cache.Set(DateTime.Now, result, 60);
            }
            #endregion

            #region Write 
            MemoryStream output = new MemoryStream();

            string[] columnHeadings = new[] {
                "Code",
                "Name",
                "RRP",
                "List Price",
                "Customer Price",
                "Discount",
                "Clearance",
                "Qty Break",
                "Valid From",
                "Valid To",
                "Cost",
                "Target Margin",
                "Gross Margin",
                "Launch",
                "Brand",
                "Product Type",
                "Item Type",
                "Price List",
                "Price Level",
                "Agreement Type"
            };

            var doc = SpreadsheetDocument.Create(output, SpreadsheetDocumentType.Workbook);

            PrepareSpreadsheetDoc(ref doc);

            int boldIndex = 1;

            var headingRow = doc.WorkbookPart.WorksheetParts.First().Worksheet.GetFirstChild<SheetData>().AppendChild(new Row());

            foreach (string h in columnHeadings)
            {
                var cell = headingRow.AppendChild(new Cell());
                cell.StyleIndex = Convert.ToUInt32(boldIndex);
                cell.CellValue = new CellValue(h);
                cell.DataType = new EnumValue<CellValues>(CellValues.String);
            }

            var originalCulture = System.Threading.Thread.CurrentThread.CurrentCulture;
            var ukCulture = new System.Globalization.CultureInfo("en-GB");

            foreach (var r in result.Results.OrderBy(p => p.DefaultSortOrder))
            {
                if (r.CurrencyFormattingCulture != null)
                    System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(r.CurrencyFormattingCulture);

                var row = doc.WorkbookPart.WorksheetParts.First().Worksheet.GetFirstChild<SheetData>().AppendChild(new Row());

                var code = row.AppendChild(new Cell());
                code.CellValue = new CellValue(PortalFramework.ReplaceHexadecimalSymbols(r.Code) ?? "");
                code.DataType = new EnumValue<CellValues>(CellValues.String);

                var name = row.AppendChild(new Cell());
                name.CellValue = new CellValue(PortalFramework.ReplaceHexadecimalSymbols(r.Name) ?? "");
                name.DataType = new EnumValue<CellValues>(CellValues.String);

                var rrp = row.AppendChild(new Cell());
                rrp.CellValue = new CellValue(r.RRP?.ToString("C2", System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat) ?? "");
                rrp.DataType = new EnumValue<CellValues>(CellValues.String);

                var listPrice = row.AppendChild(new Cell());
                listPrice.CellValue = new CellValue(r.ListPrice?.ToString("C2", System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat) ?? "");
                listPrice.DataType = new EnumValue<CellValues>(CellValues.String);

                var customerPrice = row.AppendChild(new Cell());
                customerPrice.CellValue = new CellValue(r.CustomerPrice?.ToString("C2", System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat) ?? "");
                customerPrice.DataType = new EnumValue<CellValues>(CellValues.String);

                var discount = row.AppendChild(new Cell());
                if (r.AgreementType == "D")
                    discount.CellValue = new CellValue(r.Discount?.ToString("F2") + "% off");
                else if (r.AgreementType == "P")
                    discount.CellValue = new CellValue(r.Discount?.ToString("C2", System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat));
                else
                    discount.CellValue = new CellValue("");
                discount.DataType = new EnumValue<CellValues>(CellValues.String);

                var clearance = row.AppendChild(new Cell());
                clearance.CellValue = new CellValue(r.ClearanceString ?? "");
                clearance.DataType = new EnumValue<CellValues>(CellValues.String);

                var qtyBreak = row.AppendChild(new Cell());
                qtyBreak.CellValue = new CellValue(r.QtyBreak?.ToString() ?? "");
                qtyBreak.DataType = new EnumValue<CellValues>(CellValues.String);

                var validFrom = row.AppendChild(new Cell());
                validFrom.CellValue = new CellValue(r.ValidFrom?.ToString("dd/MM/yyyy"));
                validFrom.DataType = new EnumValue<CellValues>(CellValues.String);

                var validTo = row.AppendChild(new Cell());
                validTo.CellValue = new CellValue(r.ValidTo?.ToString("dd/MM/yyyy"));
                validTo.DataType = new EnumValue<CellValues>(CellValues.String);

                var cost = row.AppendChild(new Cell());
                cost.CellValue = new CellValue(r.Cost?.ToString("C2", ukCulture.NumberFormat) ?? "");
                cost.DataType = new EnumValue<CellValues>(CellValues.String);

                var targetMargin = row.AppendChild(new Cell());
                targetMargin.CellValue = new CellValue(r.TargetMargin?.ToString("P02", ukCulture.NumberFormat) ?? "");
                targetMargin.DataType = new EnumValue<CellValues>(CellValues.String);

                var grossMargin = row.AppendChild(new Cell());
                grossMargin.CellValue = new CellValue(r.GrossMargin?.ToString("P02", ukCulture.NumberFormat) ?? "");
                grossMargin.DataType = new EnumValue<CellValues>(CellValues.String);

                var launch = row.AppendChild(new Cell());
                launch.CellValue = new CellValue(r.Launch ?? "");
                launch.DataType = new EnumValue<CellValues>(CellValues.String);

                var brand = row.AppendChild(new Cell());
                brand.CellValue = new CellValue(r.Brand ?? "");
                brand.DataType = new EnumValue<CellValues>(CellValues.String);

                var productType = row.AppendChild(new Cell());
                productType.CellValue = new CellValue(r.ProductType ?? "");
                productType.DataType = new EnumValue<CellValues>(CellValues.String);

                var itemType = row.AppendChild(new Cell());
                itemType.CellValue = new CellValue(r.ItemType ?? "");
                itemType.DataType = new EnumValue<CellValues>(CellValues.String);

                var priceList = row.AppendChild(new Cell());
                priceList.CellValue = new CellValue(PortalFramework.ReplaceHexadecimalSymbols(r.TradePriceList) ?? "");
                priceList.DataType = new EnumValue<CellValues>(CellValues.String);

                var priceLevel = row.AppendChild(new Cell());
                priceLevel.CellValue = new CellValue(r.PricingLevel ?? "");
                priceLevel.DataType = new EnumValue<CellValues>(CellValues.String);

                var agreementType = row.AppendChild(new Cell());
                switch (r.AgreementType)
                {
                    case "P":
                        agreementType.CellValue = new CellValue("Special Price");
                        break;
                    case "D":
                        agreementType.CellValue = new CellValue("Special Discount");
                        break;
                    default:
                        agreementType.CellValue = new CellValue("");
                        break;
                }
                agreementType.DataType = new EnumValue<CellValues>(CellValues.String);

                System.Threading.Thread.CurrentThread.CurrentCulture = originalCulture;
            }
            
            // save worksheet
            doc.WorkbookPart.WorksheetParts.First().Worksheet.Save();

            // create the worksheet to workbook relation
            doc.WorkbookPart.Workbook.AppendChild(new Sheets());
            doc.WorkbookPart.Workbook.GetFirstChild<Sheets>().AppendChild(new Sheet()
            {
                Id = doc.WorkbookPart.GetIdOfPart(doc.WorkbookPart.WorksheetParts.First()),
                SheetId = 1,
                Name = "Price List"
            });

            doc.WorkbookPart.Workbook.Save();

            OpenXmlValidator val = new OpenXmlValidator();
            var errors = val.Validate(doc);
            if (errors.Count() > 0)
            {
                return new HttpResponseMessage(HttpStatusCode.ExpectationFailed);
            }

            doc.Close();
            doc.Dispose();

            var httpResult = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ByteArrayContent(output.ToArray())
            };

            httpResult.Content.Headers.ContentDisposition =
                new ContentDispositionHeaderValue("attachment")
                {
                    FileName = "Customer-Prices.xlsx"
                };

            httpResult.Content.Headers.ContentType =
                new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            #endregion

            return httpResult;
        }

        [HttpGet]
        public HttpResponseMessage CustomerPricesPDF([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
           [FromUri]int? TradeAccountID,
           [FromUri]short? TradePriceListID,
           [FromUri]byte? MarketID,
           [FromUri]byte? CurrencyID,
           [FromUri]string SearchTerm,
           [FromUri]short? CollectionID,
           [FromUri]short? QualityID,
           [FromUri]int? ProductID,
           [FromUri]byte? BrandID,
           [FromUri]byte? ProductTypeID,
           [FromUri]bool IncludeClearance,
           [FromUri]bool IncludeSamples,
           [FromUri]byte[] BrandIDs,
           [FromUri]byte[] ProductTypeGroupIDs,
           [FromUri]byte[] ProductTypeIDs,
           [FromUri]short?[] ItemTypeIDs,
           [FromUri]short[] LaunchIDs,
           [FromUri]byte[] SeasonIDs,
           [FromUri]bool CacheBuster)
        {
            #region Data Fetch
            var zeroResult = new List<CustomerPrice_EnquiryResult>();

            PricingQueryFilter f1 = new PricingQueryFilter();
            f1.TradeAccountID = TradeAccountID;
            f1.TradePriceListID = TradePriceListID;
            f1.MarketID = MarketID;
            f1.CurrencyID = CurrencyID;
            f1.SearchTerm = SearchTerm;
            f1.CollectionID = CollectionID;
            f1.QualityID = QualityID;
            f1.ProductID = ProductID;
            f1.BrandID = BrandID;
            f1.ProductTypeID = ProductTypeID;
            f1.IncludeClearance = IncludeClearance;
            f1.IncludeSamples = IncludeSamples;
            f1.BrandIDs = BrandIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeGroupIDs = ProductTypeGroupIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeIDs = ProductTypeIDs?.ToList() ?? new List<byte>();
            f1.ItemTypeIDs = ItemTypeIDs?.ToList() ?? new List<short?>();
            f1.LaunchIDs = LaunchIDs?.ToList() ?? new List<short>();
            f1.SeasonIDs = SeasonIDs?.ToList() ?? new List<byte>();
            f1.CacheBuster = CacheBuster;

            if ((TradePriceListID == null && MarketID == null && CurrencyID == null) &&
                (SearchTerm == null &&
                CollectionID == null &&
                f1.QualityID == null &&
                f1.ProductID == null &&
                f1.BrandID == null &&
                f1.ProductTypeID == null &&
                f1.BrandIDs.Count == 0 &&
                f1.ProductTypeGroupIDs.Count == 0 &&
                f1.ProductTypeIDs.Count == 0 &&
                f1.ItemTypeIDs.Count == 0 &&
                f1.LaunchIDs.Count == 0 &&
                f1.SeasonIDs.Count == 0))
            {
                return new HttpResponseMessage(HttpStatusCode.ExpectationFailed);
            }

            if (request.Sorts != null)
            {
                foreach (var i in request.Sorts)
                {
                    if (i.Member == "MarginDisparity")
                    {
                        i.Member = "GrossMargin";
                    }
                }
            }

            var productIDs = GetFilteredProducts(f1);

            var cache = new PortalCache<CustomerPriceResult>(
                String.Format("CustomerPrices~{0}~{1}",
                    f1.GetHashCode().ToString(),
                    String.Join("~", productIDs.Select(p => p.ToString().ToArray()))
                )
            );
            
            if (f1.CacheBuster)
            {
                cache.Invalidate(DateTime.Now);
            }

            var result = cache.Get(DateTime.Now);

            if (result == null)
            {
                result = new CustomerPriceResult() { Results = portalDb.CustomerPriceCheck(f1, productIDs) };
                cache.Set(DateTime.Now, result, 60);
            }
            else
            {
                cache.Set(DateTime.Now, result, 60);
            }
            #endregion

            // step 1: creation of a document-object
            var document = new iTextSharp.text.Document(PageSize.A4.Rotate(), 10, 10, 10, 10);

            //step 2: we create a memory stream that listens to the document
            var output = new MemoryStream();
            PdfWriter.GetInstance(document, output);

            //step 3: we open the document
            document.Open();

            //step 4: we add content to the document
            var numOfColumns = 5;
            var dataTable = new PdfPTable(numOfColumns);

            dataTable.WidthPercentage = 100.0f;
            dataTable.DefaultCell.Padding = 3;
            dataTable.DefaultCell.BorderWidth = 1;
            dataTable.DefaultCell.VerticalAlignment = Element.ALIGN_MIDDLE;
            dataTable.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;

            iTextSharp.text.Font tableFont = FontFactory.GetFont("Arial", 11, iTextSharp.text.Font.NORMAL, BaseColor.BLACK);
            
            iTextSharp.text.Font headerFont = FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD, BaseColor.BLACK);
            
            // Adding headers
            // dataTable.AddCell("Image");
            dataTable.AddCell(new Phrase("Code", headerFont));
            dataTable.AddCell(new Phrase("Name", headerFont));
            dataTable.AddCell(new Phrase("RRP", headerFont));
            dataTable.AddCell(new Phrase("List Price", headerFont));
            dataTable.AddCell(new Phrase("Customer Price", headerFont));

            int[] widths = {
                200, 400, 150, 150, 150
            };

            dataTable.SetWidths(widths);

            dataTable.HeaderRows = 1;

            dataTable.DefaultCell.BorderWidth = 1;

            var originalCulture = System.Threading.Thread.CurrentThread.CurrentCulture;
            var ukCulture = new System.Globalization.CultureInfo("en-GB");

            var groupedByLaunch = result.Results.GroupBy(p => p.Launch);

            foreach (var rec in result.Results.OrderBy(p => p.DefaultSortOrder))
            {
                if (rec.CurrencyFormattingCulture != null)
                    System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(rec.CurrencyFormattingCulture);

                var rrp = new Paragraph();
                rrp.Add(new Phrase(rec.RRP?.ToString("C2", System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat), tableFont));
                rrp.Alignment = Element.ALIGN_RIGHT;

                PdfPCell rrpCell = new PdfPCell();
                rrpCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                rrpCell.VerticalAlignment = Element.ALIGN_MIDDLE;
                rrpCell.AddElement(rrp);

                var listPrice = new Paragraph();
                listPrice.Add(new Phrase(rec.ListPrice?.ToString("C2", System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat), tableFont));
                listPrice.Alignment = Element.ALIGN_RIGHT;

                PdfPCell listPriceCell = new PdfPCell();
                listPriceCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                listPriceCell.VerticalAlignment = Element.ALIGN_MIDDLE;
                listPriceCell.AddElement(listPrice);
                
                var customerPrice = new Paragraph();
                customerPrice.Add(new Phrase(rec.CustomerPrice?.ToString("C2", System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat), tableFont));
                customerPrice.Alignment = Element.ALIGN_RIGHT;

                PdfPCell customerPriceCell = new PdfPCell();
                customerPriceCell.HorizontalAlignment = Element.ALIGN_RIGHT;
                customerPriceCell.VerticalAlignment = Element.ALIGN_MIDDLE;
                customerPriceCell.AddElement(customerPrice);

                dataTable.AddCell(new Phrase(rec.Code, tableFont));
                dataTable.AddCell(new Phrase(rec.Name, tableFont));
                dataTable.AddCell(rrpCell);
                dataTable.AddCell(listPriceCell);
                dataTable.AddCell(customerPriceCell);
                
                System.Threading.Thread.CurrentThread.CurrentCulture = originalCulture;
            }

            // Add table to the document
            document.Add(dataTable);

            //This is important don't forget to close the document
            document.Close();

            // send the memory stream as File

            var httpResult = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ByteArrayContent(output.ToArray())
            };

            httpResult.Content.Headers.ContentDisposition =
                new ContentDispositionHeaderValue("attachment")
                {
                    FileName = "Customer-Prices.pdf"
                };

            httpResult.Content.Headers.ContentType =
                new MediaTypeHeaderValue("application/octet-stream");

            return httpResult;
        }

        [HttpGet]
        public DataSourceResult ListPrices(
            [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
            [FromUri]int? TradeAccountID,
            [FromUri]short? TradePriceListID,
            [FromUri]byte? MarketID,
            [FromUri]byte? CurrencyID,
            [FromUri]string SearchTerm,
            [FromUri]short? CollectionID,
            [FromUri]short? QualityID,
            [FromUri]int? ProductID,
            [FromUri]byte? BrandID,
            [FromUri]byte? ProductTypeID,
            [FromUri]bool IncludeClearance,
            [FromUri]bool IncludeSamples,
            [FromUri]byte[] BrandIDs,
            [FromUri]byte[] ProductTypeGroupIDs,
            [FromUri]byte[] ProductTypeIDs,
            [FromUri]short?[] ItemTypeIDs,
            [FromUri]short[] LaunchIDs,
            [FromUri]byte[] SeasonIDs,
            [FromUri]bool CacheBuster)
        {
            var zeroResults = new List<ListPrice_EnquiryResult>();

            PricingQueryFilter f1 = new PricingQueryFilter();
            f1.TradeAccountID = TradeAccountID;
            f1.TradePriceListID = TradePriceListID;
            f1.MarketID = MarketID;
            f1.CurrencyID = CurrencyID;
            f1.SearchTerm = SearchTerm;
            f1.CollectionID = CollectionID;
            f1.QualityID = QualityID;
            f1.ProductID = ProductID;
            f1.BrandID = BrandID;
            f1.ProductTypeID = ProductTypeID;
            f1.IncludeClearance = IncludeClearance;
            f1.IncludeSamples = IncludeSamples;
            f1.BrandIDs = BrandIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeGroupIDs = ProductTypeGroupIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeIDs = ProductTypeIDs?.ToList() ?? new List<byte>();
            f1.ItemTypeIDs = ItemTypeIDs?.ToList() ?? new List<short?>();
            f1.LaunchIDs = LaunchIDs?.ToList() ?? new List<short>();
            f1.SeasonIDs = SeasonIDs?.ToList() ?? new List<byte>();
            f1.CacheBuster = CacheBuster;

            if ((TradePriceListID == null && MarketID == null && CurrencyID == null) &&
                (SearchTerm == null &&
                CollectionID == null &&
                f1.QualityID == null &&
                f1.ProductID == null &&
                f1.BrandID == null &&
                f1.ProductTypeID == null &&
                f1.BrandIDs.Count == 0 &&
                f1.ProductTypeGroupIDs.Count == 0 &&
                f1.ProductTypeIDs.Count == 0 &&
                f1.ItemTypeIDs.Count == 0 &&
                f1.LaunchIDs.Count == 0 &&
                f1.SeasonIDs.Count == 0))
            {
                return zeroResults.AsQueryable().ToDataSourceResult(request);
            }

            if (request.Sorts != null)
            {
                foreach (var i in request.Sorts)
                {
                    if (i.Member == "MarginDisparity")
                    {
                        i.Member = "GrossMargin";
                    }
                }
            }

            var productIDs = GetFilteredProducts(f1);
            
            var cache = new PortalCache<ListPriceResult>(
                String.Format("ListPrices~{0}~{1}", 
                    f1.GetHashCode().ToString(), 
                    String.Join("~", productIDs.Select(p => p.ToString()).ToArray())
                )
            );

            if (f1.CacheBuster)
            {
                cache.Invalidate(DateTime.Now);
            }

            var result = cache.Get(DateTime.Now);

            if (result == null)
            {
                result = new ListPriceResult() { Results = portalDb.PriceListCheck(f1, productIDs) };
                cache.Set(DateTime.Now, result, 60);
            }

            return result.Results.AsQueryable().ToDataSourceResult(request);
        }

        [HttpGet]
        public HttpResponseMessage ListPricesXLSX([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
           [FromUri]int? TradeAccountID,
           [FromUri]short? TradePriceListID,
           [FromUri]byte? MarketID,
           [FromUri]byte? CurrencyID,
           [FromUri]string SearchTerm,
           [FromUri]short? CollectionID,
           [FromUri]short? QualityID,
           [FromUri]int? ProductID,
           [FromUri]byte? BrandID,
           [FromUri]byte? ProductTypeID,
           [FromUri]bool IncludeClearance,
           [FromUri]bool IncludeSamples,
           [FromUri]byte[] BrandIDs,
           [FromUri]byte[] ProductTypeGroupIDs,
           [FromUri]byte[] ProductTypeIDs,
           [FromUri]short?[] ItemTypeIDs,
           [FromUri]short[] LaunchIDs,
           [FromUri]byte[] SeasonIDs,
           [FromUri]bool CacheBuster)
        {
            #region Data Fetch
            var zeroResults = new List<ListPrice_EnquiryResult>();

            PricingQueryFilter f1 = new PricingQueryFilter();
            f1.TradeAccountID = TradeAccountID;
            f1.TradePriceListID = TradePriceListID;
            f1.MarketID = MarketID;
            f1.CurrencyID = CurrencyID;
            f1.SearchTerm = SearchTerm;
            f1.CollectionID = CollectionID;
            f1.QualityID = QualityID;
            f1.ProductID = ProductID;
            f1.BrandID = BrandID;
            f1.ProductTypeID = ProductTypeID;
            f1.IncludeClearance = IncludeClearance;
            f1.IncludeSamples = IncludeSamples;
            f1.BrandIDs = BrandIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeGroupIDs = ProductTypeGroupIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeIDs = ProductTypeIDs?.ToList() ?? new List<byte>();
            f1.ItemTypeIDs = ItemTypeIDs?.ToList() ?? new List<short?>();
            f1.LaunchIDs = LaunchIDs?.ToList() ?? new List<short>();
            f1.SeasonIDs = SeasonIDs?.ToList() ?? new List<byte>();
            f1.CacheBuster = CacheBuster;

            if ((TradePriceListID == null && MarketID == null && CurrencyID == null) &&
                (SearchTerm == null &&
                CollectionID == null &&
                f1.QualityID == null &&
                f1.ProductID == null &&
                f1.BrandID == null &&
                f1.ProductTypeID == null &&
                f1.BrandIDs.Count == 0 &&
                f1.ProductTypeGroupIDs.Count == 0 &&
                f1.ProductTypeIDs.Count == 0 &&
                f1.ItemTypeIDs.Count == 0 &&
                f1.LaunchIDs.Count == 0 &&
                f1.SeasonIDs.Count == 0))
            {
                return new HttpResponseMessage(HttpStatusCode.ExpectationFailed);
            }

            if (request.Sorts != null)
            {
                foreach (var i in request.Sorts)
                {
                    if (i.Member == "MarginDisparity")
                    {
                        i.Member = "GrossMargin";
                    }
                }
            }

            var productIDs = GetFilteredProducts(f1);

            var cache = new PortalCache<ListPriceResult>(
                String.Format("ListPrices~{0}~{1}",
                    f1.GetHashCode().ToString(),
                    String.Join("~", productIDs.Select(p => p.ToString()).ToArray())
                )
            );

            if (f1.CacheBuster)
            {
                cache.Invalidate(DateTime.Now);
            }

            var result = cache.Get(DateTime.Now);

            if (result == null)
            {
                result = new ListPriceResult() { Results = portalDb.PriceListCheck(f1, productIDs) };
                cache.Set(DateTime.Now, result, 60);
            }
            #endregion

            #region Write 
            MemoryStream output = new MemoryStream();

            string[] columnHeadings = new[] {
                "Code",
                "Name",
                "RRP",
                "List Price",
                "Clearance",
                "Cost",
                "Target Margin",
                "Gross Margin",
                "Launch",
                "Brand",
                "Product Type",
                "Item Type",
                "Market",
                "Currency",
                "Price List",
                "Price Level"
            };
            
            var doc = SpreadsheetDocument.Create(output, SpreadsheetDocumentType.Workbook);
            
            PrepareSpreadsheetDoc(ref doc);
                
            int boldIndex = 1;
                
            var headingRow = doc.WorkbookPart.WorksheetParts.First().Worksheet.GetFirstChild<SheetData>().AppendChild(new Row());

            foreach (string h in columnHeadings)
            {
                var cell = headingRow.AppendChild(new Cell());
                cell.StyleIndex = Convert.ToUInt32(boldIndex);
                cell.CellValue = new CellValue(h);
                cell.DataType = new EnumValue<CellValues>(CellValues.String);
            }

            var originalCulture = System.Threading.Thread.CurrentThread.CurrentCulture;
            var ukCulture = new System.Globalization.CultureInfo("en-GB");

            foreach (var r in result.Results.OrderBy(p => p.DefaultSortOrder))
            {
                if (r.CurrencyFormattingCulture != null)
                    System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(r.CurrencyFormattingCulture);

                var row = doc.WorkbookPart.WorksheetParts.First().Worksheet.GetFirstChild<SheetData>().AppendChild(new Row());
                    
                var code = row.AppendChild(new Cell());
                code.CellValue = new CellValue(PortalFramework.ReplaceHexadecimalSymbols(r.Code) ?? "");
                code.DataType = new EnumValue<CellValues>(CellValues.String);

                var name = row.AppendChild(new Cell());
                name.CellValue = new CellValue(PortalFramework.ReplaceHexadecimalSymbols(r.Name) ?? "");
                name.DataType = new EnumValue<CellValues>(CellValues.String);

                var rrp = row.AppendChild(new Cell());
                rrp.CellValue = new CellValue(r.RRP?.ToString("C2", System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat) ?? "");
                rrp.DataType = new EnumValue<CellValues>(CellValues.String);

                var listPrice = row.AppendChild(new Cell());
                listPrice.CellValue = new CellValue(r.ListPrice?.ToString("C2", System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat) ?? "");
                listPrice.DataType = new EnumValue<CellValues>(CellValues.String);

                var clearance = row.AppendChild(new Cell());
                clearance.CellValue = new CellValue(r.ClearanceString ?? "");
                clearance.DataType = new EnumValue<CellValues>(CellValues.String);

                var cost = row.AppendChild(new Cell());
                cost.CellValue = new CellValue(r.Cost?.ToString("C2", ukCulture.NumberFormat) ?? "");
                cost.DataType = new EnumValue<CellValues>(CellValues.String);

                var targetMargin = row.AppendChild(new Cell());
                targetMargin.CellValue = new CellValue(r.TargetMargin?.ToString("P02", ukCulture.NumberFormat) ?? "");
                targetMargin.DataType = new EnumValue<CellValues>(CellValues.String);

                var grossMargin = row.AppendChild(new Cell());
                grossMargin.CellValue = new CellValue(r.GrossMargin?.ToString("P02", ukCulture.NumberFormat) ?? "");
                grossMargin.DataType = new EnumValue<CellValues>(CellValues.String);

                var launch = row.AppendChild(new Cell());
                launch.CellValue = new CellValue(r.Launch ?? "");
                launch.DataType = new EnumValue<CellValues>(CellValues.String);
                    
                var brand = row.AppendChild(new Cell());
                brand.CellValue = new CellValue(r.Brand ?? "");
                brand.DataType = new EnumValue<CellValues>(CellValues.String);

                var productType = row.AppendChild(new Cell());
                productType.CellValue = new CellValue(r.ProductType ?? "");
                productType.DataType = new EnumValue<CellValues>(CellValues.String);

                var itemType = row.AppendChild(new Cell());
                itemType.CellValue = new CellValue(r.ItemType ?? "");
                itemType.DataType = new EnumValue<CellValues>(CellValues.String);

                var market = row.AppendChild(new Cell());
                market.CellValue = new CellValue(r.Market ?? "");
                market.DataType = new EnumValue<CellValues>(CellValues.String);
                    
                var currency = row.AppendChild(new Cell());
                currency.CellValue = new CellValue(r.Currency ?? "");
                currency.DataType = new EnumValue<CellValues>(CellValues.String);
                    
                var priceList = row.AppendChild(new Cell());
                priceList.CellValue = new CellValue(PortalFramework.ReplaceHexadecimalSymbols(r.TradePriceList) ?? "");
                priceList.DataType = new EnumValue<CellValues>(CellValues.String);
                    
                var priceLevel = row.AppendChild(new Cell());
                priceLevel.CellValue = new CellValue(r.PricingLevel ?? "");
                priceLevel.DataType = new EnumValue<CellValues>(CellValues.String);

                System.Threading.Thread.CurrentThread.CurrentCulture = originalCulture;
            }

            // save worksheet
            doc.WorkbookPart.WorksheetParts.First().Worksheet.Save();

            // create the worksheet to workbook relation
            doc.WorkbookPart.Workbook.AppendChild(new Sheets());
            doc.WorkbookPart.Workbook.GetFirstChild<Sheets>().AppendChild(new Sheet()
            {
                Id = doc.WorkbookPart.GetIdOfPart(doc.WorkbookPart.WorksheetParts.First()),
                SheetId = 1,
                Name = "Price List"
            });

            doc.WorkbookPart.Workbook.Save();

            OpenXmlValidator val = new OpenXmlValidator();
            var errors = val.Validate(doc);
            if (errors.Count() > 0)
            {
                return new HttpResponseMessage(HttpStatusCode.ExpectationFailed);
            }

            doc.Close();
            doc.Dispose();

            var httpResult = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ByteArrayContent(output.ToArray())
            };

            httpResult.Content.Headers.ContentDisposition =
                new ContentDispositionHeaderValue("attachment")
                {
                    FileName = "List-Prices.xlsx"
                };

            httpResult.Content.Headers.ContentType =
                new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            #endregion

            return httpResult;
        }

        [HttpGet]
        public DataSourceResult ContractPrices(
           [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
           [FromUri]int? TradeAccountID,
           [FromUri]short? TradePriceListID,
           [FromUri]byte? MarketID,
           [FromUri]byte? CurrencyID,
           [FromUri]string SearchTerm,
           [FromUri]short? CollectionID,
           [FromUri]short? QualityID,
           [FromUri]int? ProductID,
           [FromUri]byte? BrandID,
           [FromUri]byte? ProductTypeID,
           [FromUri]bool IncludeClearance,
           [FromUri]bool IncludeSamples,
           [FromUri]byte[] BrandIDs,
           [FromUri]byte[] ProductTypeGroupIDs,
           [FromUri]byte[] ProductTypeIDs,
           [FromUri]short?[] ItemTypeIDs,
           [FromUri]short[] LaunchIDs,
           [FromUri]byte[] SeasonIDs,
           [FromUri]bool CacheBuster)
        {
            var zeroResults = new List<ContractPrice_EnquiryResult>();

            PricingQueryFilter f1 = new PricingQueryFilter();
            f1.TradeAccountID = TradeAccountID;
            f1.TradePriceListID = TradePriceListID;
            f1.MarketID = MarketID;
            f1.CurrencyID = CurrencyID;
            f1.SearchTerm = SearchTerm;
            f1.CollectionID = CollectionID;
            f1.QualityID = QualityID;
            f1.ProductID = ProductID;
            f1.BrandID = BrandID;
            f1.ProductTypeID = ProductTypeID;
            f1.IncludeClearance = IncludeClearance;
            f1.IncludeSamples = IncludeSamples;
            f1.BrandIDs = BrandIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeGroupIDs = ProductTypeGroupIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeIDs = ProductTypeIDs?.ToList() ?? new List<byte>();
            f1.ItemTypeIDs = ItemTypeIDs?.ToList() ?? new List<short?>();
            f1.LaunchIDs = LaunchIDs?.ToList() ?? new List<short>();
            f1.SeasonIDs = SeasonIDs?.ToList() ?? new List<byte>();
            f1.CacheBuster = CacheBuster;

            if ((TradePriceListID == null && MarketID == null && CurrencyID == null) &&
                (SearchTerm == null &&
                CollectionID == null &&
                f1.QualityID == null &&
                f1.ProductID == null &&
                f1.BrandID == null &&
                f1.ProductTypeID == null &&
                f1.BrandIDs.Count == 0 &&
                f1.ProductTypeGroupIDs.Count == 0 &&
                f1.ProductTypeIDs.Count == 0 &&
                f1.ItemTypeIDs.Count == 0 &&
                f1.LaunchIDs.Count == 0 &&
                f1.SeasonIDs.Count == 0))
            {
                return zeroResults.AsQueryable().ToDataSourceResult(request);
            }

            if (request.Sorts != null)
            {
                foreach (var i in request.Sorts)
                {
                    if (i.Member == "MarginDisparity")
                    {
                        i.Member = "GrossMargin";
                    }
                }
            }

            var productIDs = GetFilteredProducts(f1);

            var cache = new PortalCache<ContractPriceResult>(
                String.Format("ContractPrices~{0}~{1}",
                    f1.GetHashCode().ToString(),
                    String.Join("~", productIDs.Select(p => p.ToString()).ToArray())
                )
            );
            
            if (f1.CacheBuster)
            {
                cache.Invalidate(DateTime.Now);
            }

            var result = cache.Get(DateTime.Now);

            if (result == null)
            {
                result = new ContractPriceResult() { Results = portalDb.ContractPriceCheck(f1, productIDs) };
                cache.Set(DateTime.Now, result, 60);
            }

            return result.Results.AsQueryable().ToDataSourceResult(request);
        }

        [HttpGet]
        public HttpResponseMessage ContractPricesXLSX([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
           [FromUri]int? TradeAccountID,
           [FromUri]short? TradePriceListID,
           [FromUri]byte? MarketID,
           [FromUri]byte? CurrencyID,
           [FromUri]string SearchTerm,
           [FromUri]short? CollectionID,
           [FromUri]short? QualityID,
           [FromUri]int? ProductID,
           [FromUri]byte? BrandID,
           [FromUri]byte? ProductTypeID,
           [FromUri]bool IncludeClearance,
           [FromUri]bool IncludeSamples,
           [FromUri]byte[] BrandIDs,
           [FromUri]byte[] ProductTypeGroupIDs,
           [FromUri]byte[] ProductTypeIDs,
           [FromUri]short?[] ItemTypeIDs,
           [FromUri]short[] LaunchIDs,
           [FromUri]byte[] SeasonIDs,
           [FromUri]bool CacheBuster)
        {
            #region Data Fetch
            var zeroResults = new List<ContractPrice_EnquiryResult>();

            PricingQueryFilter f1 = new PricingQueryFilter();
            f1.TradeAccountID = TradeAccountID;
            f1.TradePriceListID = TradePriceListID;
            f1.MarketID = MarketID;
            f1.CurrencyID = CurrencyID;
            f1.SearchTerm = SearchTerm;
            f1.CollectionID = CollectionID;
            f1.QualityID = QualityID;
            f1.ProductID = ProductID;
            f1.BrandID = BrandID;
            f1.ProductTypeID = ProductTypeID;
            f1.IncludeClearance = IncludeClearance;
            f1.IncludeSamples = IncludeSamples;
            f1.BrandIDs = BrandIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeGroupIDs = ProductTypeGroupIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeIDs = ProductTypeIDs?.ToList() ?? new List<byte>();
            f1.ItemTypeIDs = ItemTypeIDs?.ToList() ?? new List<short?>();
            f1.LaunchIDs = LaunchIDs?.ToList() ?? new List<short>();
            f1.SeasonIDs = SeasonIDs?.ToList() ?? new List<byte>();
            f1.CacheBuster = CacheBuster;

            if ((TradePriceListID == null && MarketID == null && CurrencyID == null) &&
                (SearchTerm == null &&
                CollectionID == null &&
                f1.QualityID == null &&
                f1.ProductID == null &&
                f1.BrandID == null &&
                f1.ProductTypeID == null &&
                f1.BrandIDs.Count == 0 &&
                f1.ProductTypeGroupIDs.Count == 0 &&
                f1.ProductTypeIDs.Count == 0 &&
                f1.ItemTypeIDs.Count == 0 &&
                f1.LaunchIDs.Count == 0 &&
                f1.SeasonIDs.Count == 0))
            {
                return new HttpResponseMessage(HttpStatusCode.ExpectationFailed);
            }

            if (request.Sorts != null)
            {
                foreach (var i in request.Sorts)
                {
                    if (i.Member == "MarginDisparity")
                    {
                        i.Member = "GrossMargin";
                    }
                }
            }

            var productIDs = GetFilteredProducts(f1);

            var cache = new PortalCache<ContractPriceResult>(
                String.Format("ContractPrices~{0}~{1}",
                    f1.GetHashCode().ToString(),
                    String.Join("~", productIDs.Select(p => p.ToString()).ToArray())
                )
            );

            if (f1.CacheBuster)
            {
                cache.Invalidate(DateTime.Now);
            }
            
            var result = cache.Get(DateTime.Now);

            if (result == null)
            {
                result = new ContractPriceResult() { Results = portalDb.ContractPriceCheck(f1, productIDs) };
                cache.Set(DateTime.Now, result, 60);
            }
            #endregion

            #region Write 
            MemoryStream output = new MemoryStream();

            string[] columnHeadings = new[] {
                "Account",
                "Code",
                "Name",
                "RRP",
                "List Price",
                "Customer Price",
                "Discount",
                "Clearance",
                "Quantity Break",
                "Valid From",
                "Valid To",
                "Cost",
                "Target Margin",
                "Gross Margin",
                "Launch",
                "Brand",
                "Product Type",
                "Item Type",
                "Market",
                "Currency",
                "Price List",
                "Price Level",
                "Agreement Type"
            };

            var doc = SpreadsheetDocument.Create(output, SpreadsheetDocumentType.Workbook);

            PrepareSpreadsheetDoc(ref doc);

            int boldIndex = 1;

            var headingRow = doc.WorkbookPart.WorksheetParts.First().Worksheet.GetFirstChild<SheetData>().AppendChild(new Row());

            foreach (string h in columnHeadings)
            {
                var cell = headingRow.AppendChild(new Cell());
                cell.StyleIndex = Convert.ToUInt32(boldIndex);
                cell.CellValue = new CellValue(h);
                cell.DataType = new EnumValue<CellValues>(CellValues.String);
            }

            var originalCulture = System.Threading.Thread.CurrentThread.CurrentCulture;
            var ukCulture = new System.Globalization.CultureInfo("en-GB");

            foreach (var r in result.Results.OrderBy(p => p.DefaultSortOrder))
            {
                if (r.CurrencyFormattingCulture != null)
                    System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(r.CurrencyFormattingCulture);

                var row = doc.WorkbookPart.WorksheetParts.First().Worksheet.GetFirstChild<SheetData>().AppendChild(new Row());

                var account = row.AppendChild(new Cell());
                account.CellValue = new CellValue(PortalFramework.ReplaceHexadecimalSymbols(r.TradeAccountCode + " - " + r.TradeAccountName) ?? "");
                account.DataType = new EnumValue<CellValues>(CellValues.String);
                
                var code = row.AppendChild(new Cell());
                code.CellValue = new CellValue(PortalFramework.ReplaceHexadecimalSymbols(r.Code) ?? "");
                code.DataType = new EnumValue<CellValues>(CellValues.String);

                var name = row.AppendChild(new Cell());
                name.CellValue = new CellValue(PortalFramework.ReplaceHexadecimalSymbols(r.Name) ?? "");
                name.DataType = new EnumValue<CellValues>(CellValues.String);

                var rrp = row.AppendChild(new Cell());
                rrp.CellValue = new CellValue(r.RRP?.ToString("C2", System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat) ?? "");
                rrp.DataType = new EnumValue<CellValues>(CellValues.String);

                var listPrice = row.AppendChild(new Cell());
                listPrice.CellValue = new CellValue(r.ListPrice?.ToString("C2", System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat) ?? "");
                listPrice.DataType = new EnumValue<CellValues>(CellValues.String);

                var customerPrice = row.AppendChild(new Cell());
                customerPrice.CellValue = new CellValue(r.CustomerPrice?.ToString("C2", System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat) ?? "");
                customerPrice.DataType = new EnumValue<CellValues>(CellValues.String);

                var discount = row.AppendChild(new Cell());
                if (r.AgreementType == "D")
                    discount.CellValue = new CellValue(r.Discount?.ToString("F2") + "% off");
                else if (r.AgreementType == "P")
                    discount.CellValue = new CellValue(r.Discount?.ToString("C2", System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat));
                else
                    discount.CellValue = new CellValue("");
                discount.DataType = new EnumValue<CellValues>(CellValues.String);

                var clearance = row.AppendChild(new Cell());
                clearance.CellValue = new CellValue(r.ClearanceString ?? "");
                clearance.DataType = new EnumValue<CellValues>(CellValues.String);

                var qtyBreak = row.AppendChild(new Cell());
                qtyBreak.CellValue = new CellValue(r.QtyBreak?.ToString() ?? "");
                qtyBreak.DataType = new EnumValue<CellValues>(CellValues.String);

                var validFrom = row.AppendChild(new Cell());
                validFrom.CellValue = new CellValue(r.ValidFrom?.ToString("dd/MM/yyyy"));
                validFrom.DataType = new EnumValue<CellValues>(CellValues.String);

                var validTo = row.AppendChild(new Cell());
                validTo.CellValue = new CellValue(r.ValidTo?.ToString("dd/MM/yyyy"));
                validTo.DataType = new EnumValue<CellValues>(CellValues.String);
                
                var cost = row.AppendChild(new Cell());
                cost.CellValue = new CellValue(r.Cost?.ToString("C2", ukCulture.NumberFormat) ?? "");
                cost.DataType = new EnumValue<CellValues>(CellValues.String);

                var targetMargin = row.AppendChild(new Cell());
                targetMargin.CellValue = new CellValue(r.TargetMargin?.ToString("P02", ukCulture.NumberFormat) ?? "");
                targetMargin.DataType = new EnumValue<CellValues>(CellValues.String);

                var grossMargin = row.AppendChild(new Cell());
                grossMargin.CellValue = new CellValue(r.GrossMargin?.ToString("P02", ukCulture.NumberFormat) ?? "");
                grossMargin.DataType = new EnumValue<CellValues>(CellValues.String);

                var launch = row.AppendChild(new Cell());
                launch.CellValue = new CellValue(r.Launch ?? "");
                launch.DataType = new EnumValue<CellValues>(CellValues.String);

                var brand = row.AppendChild(new Cell());
                brand.CellValue = new CellValue(r.Brand ?? "");
                brand.DataType = new EnumValue<CellValues>(CellValues.String);

                var productType = row.AppendChild(new Cell());
                productType.CellValue = new CellValue(r.ProductType ?? "");
                productType.DataType = new EnumValue<CellValues>(CellValues.String);

                var itemType = row.AppendChild(new Cell());
                itemType.CellValue = new CellValue(r.ItemType ?? "");
                itemType.DataType = new EnumValue<CellValues>(CellValues.String);

                var market = row.AppendChild(new Cell());
                market.CellValue = new CellValue(r.Market ?? "");
                market.DataType = new EnumValue<CellValues>(CellValues.String);

                var currency = row.AppendChild(new Cell());
                currency.CellValue = new CellValue(r.Currency ?? "");
                currency.DataType = new EnumValue<CellValues>(CellValues.String);

                var priceList = row.AppendChild(new Cell());
                priceList.CellValue = new CellValue(PortalFramework.ReplaceHexadecimalSymbols(r.TradePriceList) ?? "");
                priceList.DataType = new EnumValue<CellValues>(CellValues.String);

                var priceLevel = row.AppendChild(new Cell());
                priceLevel.CellValue = new CellValue(r.PricingLevel ?? "");
                priceLevel.DataType = new EnumValue<CellValues>(CellValues.String);

                var agreementType = row.AppendChild(new Cell());
                switch (r.AgreementType)
                {
                    case "P":
                        agreementType.CellValue = new CellValue("Special Price");
                        break;
                    case "D":
                        agreementType.CellValue = new CellValue("Special Discount");
                        break;
                    default:
                        agreementType.CellValue = new CellValue("");
                        break;
                }
                agreementType.DataType = new EnumValue<CellValues>(CellValues.String);

                System.Threading.Thread.CurrentThread.CurrentCulture = originalCulture;
            }

            // save worksheet
            doc.WorkbookPart.WorksheetParts.First().Worksheet.Save();

            // create the worksheet to workbook relation
            doc.WorkbookPart.Workbook.AppendChild(new Sheets());
            doc.WorkbookPart.Workbook.GetFirstChild<Sheets>().AppendChild(new Sheet()
            {
                Id = doc.WorkbookPart.GetIdOfPart(doc.WorkbookPart.WorksheetParts.First()),
                SheetId = 1,
                Name = "Price List"
            });

            doc.WorkbookPart.Workbook.Save();

            OpenXmlValidator val = new OpenXmlValidator();
            var errors = val.Validate(doc);
            if (errors.Count() > 0)
            {
                return new HttpResponseMessage(HttpStatusCode.ExpectationFailed);
            }

            doc.Close();
            doc.Dispose();

            var httpResult = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ByteArrayContent(output.ToArray())
            };

            httpResult.Content.Headers.ContentDisposition =
                new ContentDispositionHeaderValue("attachment")
                {
                    FileName = "Special-Prices.xlsx"
                };

            httpResult.Content.Headers.ContentType =
                new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            #endregion

            return httpResult;
        }

        [HttpGet]
        public DataSourceResult ProductsNoPrices(
           [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
           [FromUri]int? TradeAccountID,
           [FromUri]short? TradePriceListID,
           [FromUri]byte? MarketID,
           [FromUri]byte? CurrencyID,
           [FromUri]string SearchTerm,
           [FromUri]short? CollectionID,
           [FromUri]short? QualityID,
           [FromUri]int? ProductID,
           [FromUri]byte? BrandID,
           [FromUri]byte? ProductTypeID,
           [FromUri]bool IncludeClearance,
           [FromUri]bool IncludeSamples,
           [FromUri]byte[] BrandIDs,
           [FromUri]byte[] ProductTypeGroupIDs,
           [FromUri]byte[] ProductTypeIDs,
           [FromUri]short?[] ItemTypeIDs,
           [FromUri]short[] LaunchIDs,
           [FromUri]byte[] SeasonIDs,
           [FromUri]bool CacheBuster)
        {
            var products = new List<ProductNoPrices_EnquiryResult>();

            PricingQueryFilter f1 = new PricingQueryFilter();
            f1.TradeAccountID = TradeAccountID;
            f1.TradePriceListID = TradePriceListID;
            f1.MarketID = MarketID;
            f1.CurrencyID = CurrencyID;
            f1.SearchTerm = SearchTerm;
            f1.CollectionID = CollectionID;
            f1.QualityID = QualityID;
            f1.ProductID = ProductID;
            f1.BrandID = BrandID;
            f1.ProductTypeID = ProductTypeID;
            f1.IncludeClearance = IncludeClearance;
            f1.IncludeSamples = IncludeSamples;
            f1.BrandIDs = BrandIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeGroupIDs = ProductTypeGroupIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeIDs = ProductTypeIDs?.ToList() ?? new List<byte>();
            f1.ItemTypeIDs = ItemTypeIDs?.ToList() ?? new List<short?>();
            f1.LaunchIDs = LaunchIDs?.ToList() ?? new List<short>();
            f1.SeasonIDs = SeasonIDs?.ToList() ?? new List<byte>();
            f1.CacheBuster = CacheBuster;

            if ((TradePriceListID == null && MarketID == null && CurrencyID == null) &&
                (SearchTerm == null &&
                CollectionID == null &&
                f1.QualityID == null &&
                f1.ProductID == null &&
                f1.BrandID == null &&
                f1.ProductTypeID == null &&
                f1.BrandIDs.Count == 0 &&
                f1.ProductTypeGroupIDs.Count == 0 &&
                f1.ProductTypeIDs.Count == 0 &&
                f1.ItemTypeIDs.Count == 0 &&
                f1.LaunchIDs.Count == 0 &&
                f1.SeasonIDs.Count == 0))
            {
                return products.AsQueryable().ToDataSourceResult(request);
            }
            
            if (request.Sorts != null)
            {
                foreach (var i in request.Sorts)
                {
                    if (i.Member == "MarginDisparity")
                    {
                        i.Member = "GrossMargin";
                    }
                }
            }

            var productIDs = GetFilteredProducts(f1);

            var cache = new PortalCache<ProductNoPricesResult>(
                String.Format("ProductsNoPrices~{0}~{1}",
                    f1.GetHashCode().ToString(),
                    String.Join("~", productIDs.Select(p => p.ToString()).ToArray())
                )
            );

            if (f1.CacheBuster)
            {
                cache.Invalidate(DateTime.Now);
            }

            var result = cache.Get(DateTime.Now);

            if (result == null)
            {
                result = new ProductNoPricesResult()
                {
                    Results = portalDb.ProductsNoPricesCheck
                    (f1, productIDs)
                };
                cache.Set(DateTime.Now, result, 60);
            }

            return result.Results.AsQueryable().ToDataSourceResult(request);
        }
        
        [HttpGet]
        public HttpResponseMessage ProductsNoPricesXLSX([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
           [FromUri]int? TradeAccountID,
           [FromUri]short? TradePriceListID,
           [FromUri]byte? MarketID,
           [FromUri]byte? CurrencyID,
           [FromUri]string SearchTerm,
           [FromUri]short? CollectionID,
           [FromUri]short? QualityID,
           [FromUri]int? ProductID,
           [FromUri]byte? BrandID,
           [FromUri]byte? ProductTypeID,
           [FromUri]bool IncludeClearance,
           [FromUri]bool IncludeSamples,
           [FromUri]byte[] BrandIDs,
           [FromUri]byte[] ProductTypeGroupIDs,
           [FromUri]byte[] ProductTypeIDs,
           [FromUri]short?[] ItemTypeIDs,
           [FromUri]short[] LaunchIDs,
           [FromUri]byte[] SeasonIDs,
           [FromUri]bool CacheBuster)
        {
            #region Data Fetch
            var products = new List<ProductNoPrices_EnquiryResult>();

            PricingQueryFilter f1 = new PricingQueryFilter();
            f1.TradeAccountID = TradeAccountID;
            f1.TradePriceListID = TradePriceListID;
            f1.MarketID = MarketID;
            f1.CurrencyID = CurrencyID;
            f1.SearchTerm = SearchTerm;
            f1.CollectionID = CollectionID;
            f1.QualityID = QualityID;
            f1.ProductID = ProductID;
            f1.BrandID = BrandID;
            f1.ProductTypeID = ProductTypeID;
            f1.IncludeClearance = IncludeClearance;
            f1.IncludeSamples = IncludeSamples;
            f1.BrandIDs = BrandIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeGroupIDs = ProductTypeGroupIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeIDs = ProductTypeIDs?.ToList() ?? new List<byte>();
            f1.ItemTypeIDs = ItemTypeIDs?.ToList() ?? new List<short?>();
            f1.LaunchIDs = LaunchIDs?.ToList() ?? new List<short>();
            f1.SeasonIDs = SeasonIDs?.ToList() ?? new List<byte>();
            f1.CacheBuster = CacheBuster;

            if ((TradePriceListID == null && MarketID == null && CurrencyID == null) &&
                (SearchTerm == null &&
                CollectionID == null &&
                f1.QualityID == null &&
                f1.ProductID == null &&
                f1.BrandID == null &&
                f1.ProductTypeID == null &&
                f1.BrandIDs.Count == 0 &&
                f1.ProductTypeGroupIDs.Count == 0 &&
                f1.ProductTypeIDs.Count == 0 &&
                f1.ItemTypeIDs.Count == 0 &&
                f1.LaunchIDs.Count == 0 &&
                f1.SeasonIDs.Count == 0))
            {
                return new HttpResponseMessage(HttpStatusCode.ExpectationFailed);
            }

            if (request.Sorts != null)
            {
                foreach (var i in request.Sorts)
                {
                    if (i.Member == "MarginDisparity")
                    {
                        i.Member = "GrossMargin";
                    }
                }
            }

            var productIDs = GetFilteredProducts(f1);

            var cache = new PortalCache<ProductNoPricesResult>(
                String.Format("ProductsNoPrices~{0}~{1}",
                    f1.GetHashCode().ToString(),
                    String.Join("~", productIDs.Select(p => p.ToString()).ToArray())
                )
            );

            if (f1.CacheBuster)
            {
                cache.Invalidate(DateTime.Now);
            }

            var result = cache.Get(DateTime.Now);

            if (result == null)
            {
                result = new ProductNoPricesResult()
                {
                    Results = portalDb.ProductsNoPricesCheck
                    (f1, productIDs)
                };
                cache.Set(DateTime.Now, result, 60);
            }
            #endregion

            #region Write 
            MemoryStream output = new MemoryStream();

            string[] columnHeadings = new[] {
                "Code",
                "Name",
                "RRP",
                "Clearance",
                "Cost",
                "Target Margin",
                "Launch",
                "Brand",
                "Product Type",
                "Item Type",
                "Market",
                "Currency",
                "Price List",
                "Price Level"
            };

            var doc = SpreadsheetDocument.Create(output, SpreadsheetDocumentType.Workbook);

            PrepareSpreadsheetDoc(ref doc);

            int boldIndex = 1;

            var headingRow = doc.WorkbookPart.WorksheetParts.First().Worksheet.GetFirstChild<SheetData>().AppendChild(new Row());

            foreach (string h in columnHeadings)
            {
                var cell = headingRow.AppendChild(new Cell());
                cell.StyleIndex = Convert.ToUInt32(boldIndex);
                cell.CellValue = new CellValue(h);
                cell.DataType = new EnumValue<CellValues>(CellValues.String);
            }

            var originalCulture = System.Threading.Thread.CurrentThread.CurrentCulture;
            var ukCulture = new System.Globalization.CultureInfo("en-GB");

            foreach (var r in result.Results.OrderBy(p => p.DefaultSortOrder))
            {
                if (r.CurrencyFormattingCulture != null)
                    System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(r.CurrencyFormattingCulture);

                var row = doc.WorkbookPart.WorksheetParts.First().Worksheet.GetFirstChild<SheetData>().AppendChild(new Row());
                
                var code = row.AppendChild(new Cell());
                code.CellValue = new CellValue(PortalFramework.ReplaceHexadecimalSymbols(r.Code) ?? "");
                code.DataType = new EnumValue<CellValues>(CellValues.String);

                var name = row.AppendChild(new Cell());
                name.CellValue = new CellValue(PortalFramework.ReplaceHexadecimalSymbols(r.Name) ?? "");
                name.DataType = new EnumValue<CellValues>(CellValues.String);

                var rrp = row.AppendChild(new Cell());
                rrp.CellValue = new CellValue(r.RRP?.ToString("C2", System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat) ?? "");
                rrp.DataType = new EnumValue<CellValues>(CellValues.String);

                var clearance = row.AppendChild(new Cell());
                clearance.CellValue = new CellValue(r.ClearanceString ?? "");
                clearance.DataType = new EnumValue<CellValues>(CellValues.String);
                
                var cost = row.AppendChild(new Cell());
                cost.CellValue = new CellValue(r.Cost?.ToString("C2", ukCulture.NumberFormat) ?? "");
                cost.DataType = new EnumValue<CellValues>(CellValues.String);

                var targetMargin = row.AppendChild(new Cell());
                targetMargin.CellValue = new CellValue(r.TargetMargin?.ToString("P02", ukCulture.NumberFormat) ?? "");
                targetMargin.DataType = new EnumValue<CellValues>(CellValues.String);

                var launch = row.AppendChild(new Cell());
                launch.CellValue = new CellValue(r.Launch ?? "");
                launch.DataType = new EnumValue<CellValues>(CellValues.String);

                var brand = row.AppendChild(new Cell());
                brand.CellValue = new CellValue(r.Brand ?? "");
                brand.DataType = new EnumValue<CellValues>(CellValues.String);

                var productType = row.AppendChild(new Cell());
                productType.CellValue = new CellValue(r.ProductType ?? "");
                productType.DataType = new EnumValue<CellValues>(CellValues.String);

                var itemType = row.AppendChild(new Cell());
                itemType.CellValue = new CellValue(r.ItemType ?? "");
                itemType.DataType = new EnumValue<CellValues>(CellValues.String);

                var market = row.AppendChild(new Cell());
                market.CellValue = new CellValue(r.Market ?? "");
                market.DataType = new EnumValue<CellValues>(CellValues.String);

                var currency = row.AppendChild(new Cell());
                currency.CellValue = new CellValue(r.Currency ?? "");
                currency.DataType = new EnumValue<CellValues>(CellValues.String);

                var priceList = row.AppendChild(new Cell());
                priceList.CellValue = new CellValue(PortalFramework.ReplaceHexadecimalSymbols(r.TradePriceList) ?? "");
                priceList.DataType = new EnumValue<CellValues>(CellValues.String);

                var priceLevel = row.AppendChild(new Cell());
                priceLevel.CellValue = new CellValue(r.PricingLevel ?? "");
                priceLevel.DataType = new EnumValue<CellValues>(CellValues.String);

                System.Threading.Thread.CurrentThread.CurrentCulture = originalCulture;
            }

            // save worksheet
            doc.WorkbookPart.WorksheetParts.First().Worksheet.Save();

            // create the worksheet to workbook relation
            doc.WorkbookPart.Workbook.AppendChild(new Sheets());
            doc.WorkbookPart.Workbook.GetFirstChild<Sheets>().AppendChild(new Sheet()
            {
                Id = doc.WorkbookPart.GetIdOfPart(doc.WorkbookPart.WorksheetParts.First()),
                SheetId = 1,
                Name = "Price List"
            });

            doc.WorkbookPart.Workbook.Save();

            OpenXmlValidator val = new OpenXmlValidator();
            var errors = val.Validate(doc);
            if (errors.Count() > 0)
            {
                return new HttpResponseMessage(HttpStatusCode.ExpectationFailed);
            }

            doc.Close();
            doc.Dispose();

            var httpResult = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ByteArrayContent(output.ToArray())
            };

            httpResult.Content.Headers.ContentDisposition =
                new ContentDispositionHeaderValue("attachment")
                {
                    FileName = "Products-without-Prices.xlsx"
                };

            httpResult.Content.Headers.ContentType =
                new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            #endregion

            return httpResult;
        }

        [HttpGet]
        public DataSourceResult LowMargin(
           [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
           [FromUri]int? TradeAccountID,
           [FromUri]short? TradePriceListID,
           [FromUri]byte? MarketID,
           [FromUri]byte? CurrencyID,
           [FromUri]string SearchTerm,
           [FromUri]short? CollectionID,
           [FromUri]short? QualityID,
           [FromUri]int? ProductID,
           [FromUri]byte? BrandID,
           [FromUri]byte? ProductTypeID,
           [FromUri]bool IncludeClearance,
           [FromUri]bool IncludeSamples,
           [FromUri]byte[] BrandIDs,
           [FromUri]byte[] ProductTypeGroupIDs,
           [FromUri]byte[] ProductTypeIDs,
           [FromUri]short?[] ItemTypeIDs,
           [FromUri]short[] LaunchIDs,
           [FromUri]byte[] SeasonIDs,
           [FromUri]bool CacheBuster)
        {
            var products = new List<LowMargin_EnquiryResult>();

            PricingQueryFilter f1 = new PricingQueryFilter();
            f1.TradeAccountID = TradeAccountID;
            f1.TradePriceListID = TradePriceListID;
            f1.MarketID = MarketID;
            f1.CurrencyID = CurrencyID;
            f1.SearchTerm = SearchTerm;
            f1.CollectionID = CollectionID;
            f1.QualityID = QualityID;
            f1.ProductID = ProductID;
            f1.BrandID = BrandID;
            f1.ProductTypeID = ProductTypeID;
            f1.IncludeClearance = IncludeClearance;
            f1.IncludeSamples = IncludeSamples;
            f1.BrandIDs = BrandIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeGroupIDs = ProductTypeGroupIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeIDs = ProductTypeIDs?.ToList() ?? new List<byte>();
            f1.ItemTypeIDs = ItemTypeIDs?.ToList() ?? new List<short?>();
            f1.LaunchIDs = LaunchIDs?.ToList() ?? new List<short>();
            f1.SeasonIDs = SeasonIDs?.ToList() ?? new List<byte>();
            f1.CacheBuster = CacheBuster;

            if ((TradePriceListID == null && MarketID == null && CurrencyID == null) &&
                (SearchTerm == null &&
                CollectionID == null &&
                f1.QualityID == null &&
                f1.ProductID == null &&
                f1.BrandID == null &&
                f1.ProductTypeID == null &&
                f1.BrandIDs.Count == 0 &&
                f1.ProductTypeGroupIDs.Count == 0 &&
                f1.ProductTypeIDs.Count == 0 &&
                f1.ItemTypeIDs.Count == 0 &&
                f1.LaunchIDs.Count == 0 &&
                f1.SeasonIDs.Count == 0))
            {
                return products.AsQueryable().ToDataSourceResult(request);
            }

            if (request.Sorts != null)
            {
                foreach (var i in request.Sorts)
                {
                    if (i.Member == "MarginDisparity")
                    {
                        i.Member = "GrossMargin";
                    }
                }
            }

            var productIDs = GetFilteredProducts(f1);

            var cache = new PortalCache<LowMarginResult>(
                String.Format("LowMargin~{0}~{1}",
                    f1.GetHashCode().ToString(),
                    String.Join("~", productIDs.Select(p => p.ToString()).ToArray())
                )
            );

            if (f1.CacheBuster)
            {
                cache.Invalidate(DateTime.Now);
            }

            var result = cache.Get(DateTime.Now);

            if (result == null)
            {
                result = new LowMarginResult()
                {
                    Results = portalDb.LowMarginCheck(f1, productIDs)
                };

                cache.Set(DateTime.Now, result, 60);
            }

            return result.Results.AsQueryable().ToDataSourceResult(request);
        }

        [HttpGet]
        public HttpResponseMessage LowMarginXLSX([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
           [FromUri]int? TradeAccountID,
           [FromUri]short? TradePriceListID,
           [FromUri]byte? MarketID,
           [FromUri]byte? CurrencyID,
           [FromUri]string SearchTerm,
           [FromUri]short? CollectionID,
           [FromUri]short? QualityID,
           [FromUri]int? ProductID,
           [FromUri]byte? BrandID,
           [FromUri]byte? ProductTypeID,
           [FromUri]bool IncludeClearance,
           [FromUri]bool IncludeSamples,
           [FromUri]byte[] BrandIDs,
           [FromUri]byte[] ProductTypeGroupIDs,
           [FromUri]byte[] ProductTypeIDs,
           [FromUri]short?[] ItemTypeIDs,
           [FromUri]short[] LaunchIDs,
           [FromUri]byte[] SeasonIDs,
           [FromUri]bool CacheBuster)
        {
            #region Data Fetch
            var products = new List<LowMargin_EnquiryResult>();

            PricingQueryFilter f1 = new PricingQueryFilter();
            f1.TradeAccountID = TradeAccountID;
            f1.TradePriceListID = TradePriceListID;
            f1.MarketID = MarketID;
            f1.CurrencyID = CurrencyID;
            f1.SearchTerm = SearchTerm;
            f1.CollectionID = CollectionID;
            f1.QualityID = QualityID;
            f1.ProductID = ProductID;
            f1.BrandID = BrandID;
            f1.ProductTypeID = ProductTypeID;
            f1.IncludeClearance = IncludeClearance;
            f1.IncludeSamples = IncludeSamples;
            f1.BrandIDs = BrandIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeGroupIDs = ProductTypeGroupIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeIDs = ProductTypeIDs?.ToList() ?? new List<byte>();
            f1.ItemTypeIDs = ItemTypeIDs?.ToList() ?? new List<short?>();
            f1.LaunchIDs = LaunchIDs?.ToList() ?? new List<short>();
            f1.SeasonIDs = SeasonIDs?.ToList() ?? new List<byte>();
            f1.CacheBuster = CacheBuster;

            if ((TradePriceListID == null && MarketID == null && CurrencyID == null) &&
                (SearchTerm == null &&
                CollectionID == null &&
                f1.QualityID == null &&
                f1.ProductID == null &&
                f1.BrandID == null &&
                f1.ProductTypeID == null &&
                f1.BrandIDs.Count == 0 &&
                f1.ProductTypeGroupIDs.Count == 0 &&
                f1.ProductTypeIDs.Count == 0 &&
                f1.ItemTypeIDs.Count == 0 &&
                f1.LaunchIDs.Count == 0 &&
                f1.SeasonIDs.Count == 0))
            {
                return new HttpResponseMessage(HttpStatusCode.ExpectationFailed);
            }

            if (request.Sorts != null)
            {
                foreach (var i in request.Sorts)
                {
                    if (i.Member == "MarginDisparity")
                    {
                        i.Member = "GrossMargin";
                    }
                }
            }

            var productIDs = GetFilteredProducts(f1);

            var cache = new PortalCache<LowMarginResult>(
                String.Format("LowMargin~{0}~{1}",
                    f1.GetHashCode().ToString(),
                    String.Join("~", productIDs.Select(p => p.ToString()).ToArray())
                )
            );

            if (f1.CacheBuster)
            {
                cache.Invalidate(DateTime.Now);
            }

            var result = cache.Get(DateTime.Now);

            if (result == null)
            {
                result = new LowMarginResult()
                {
                    Results = portalDb.LowMarginCheck(f1, productIDs)
                };

                cache.Set(DateTime.Now, result, 60);
            }
            #endregion

            #region Write 
            MemoryStream output = new MemoryStream();

            string[] columnHeadings = new[] {
                "Account",
                "Code",
                "Name",
                "RRP",
                "List Price",
                "Customer Price",
                "Discount",
                "Clearance",
                "Quantity Break",
                "Valid From",
                "Valid To",
                "Cost",
                "Target Margin",
                "Gross Margin",
                "Launch",
                "Brand",
                "Product Type",
                "Item Type",
                "Market",
                "Currency",
                "Price List",
                "Price Level",
                "Agreement Type"
            };

            var doc = SpreadsheetDocument.Create(output, SpreadsheetDocumentType.Workbook);

            PrepareSpreadsheetDoc(ref doc);

            int boldIndex = 1;

            var headingRow = doc.WorkbookPart.WorksheetParts.First().Worksheet.GetFirstChild<SheetData>().AppendChild(new Row());

            foreach (string h in columnHeadings)
            {
                var cell = headingRow.AppendChild(new Cell());
                cell.StyleIndex = Convert.ToUInt32(boldIndex);
                cell.CellValue = new CellValue(h);
                cell.DataType = new EnumValue<CellValues>(CellValues.String);
            }

            var originalCulture = System.Threading.Thread.CurrentThread.CurrentCulture;
            var ukCulture = new System.Globalization.CultureInfo("en-GB");

            foreach (var r in result.Results.OrderBy(p => p.DefaultSortOrder))
            {
                if (r.CurrencyFormattingCulture != null)
                    System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(r.CurrencyFormattingCulture);

                var row = doc.WorkbookPart.WorksheetParts.First().Worksheet.GetFirstChild<SheetData>().AppendChild(new Row());

                var account = row.AppendChild(new Cell());
                account.CellValue = new CellValue(PortalFramework.ReplaceHexadecimalSymbols(r.TradeAccountCode + " - " + r.TradeAccountName) ?? "");
                account.DataType = new EnumValue<CellValues>(CellValues.String);

                var code = row.AppendChild(new Cell());
                code.CellValue = new CellValue(PortalFramework.ReplaceHexadecimalSymbols(r.Code) ?? "");
                code.DataType = new EnumValue<CellValues>(CellValues.String);

                var name = row.AppendChild(new Cell());
                name.CellValue = new CellValue(PortalFramework.ReplaceHexadecimalSymbols(r.Name) ?? "");
                name.DataType = new EnumValue<CellValues>(CellValues.String);

                var rrp = row.AppendChild(new Cell());
                rrp.CellValue = new CellValue(r.RRP?.ToString("C2", System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat) ?? "");
                rrp.DataType = new EnumValue<CellValues>(CellValues.String);

                var listPrice = row.AppendChild(new Cell());
                listPrice.CellValue = new CellValue(r.ListPrice?.ToString("C2", System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat) ?? "");
                listPrice.DataType = new EnumValue<CellValues>(CellValues.String);

                var customerPrice = row.AppendChild(new Cell());
                customerPrice.CellValue = new CellValue(r.CustomerPrice?.ToString("C2", System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat) ?? "");
                customerPrice.DataType = new EnumValue<CellValues>(CellValues.String);

                var discount = row.AppendChild(new Cell());
                if (r.AgreementType == "D")
                    discount.CellValue = new CellValue(r.Discount?.ToString("F2") + "% off");
                else if (r.AgreementType == "P")
                    discount.CellValue = new CellValue(r.Discount?.ToString("C2", System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat));
                else
                    discount.CellValue = new CellValue("");
                discount.DataType = new EnumValue<CellValues>(CellValues.String);

                var clearance = row.AppendChild(new Cell());
                clearance.CellValue = new CellValue(r.ClearanceString ?? "");
                clearance.DataType = new EnumValue<CellValues>(CellValues.String);

                var qtyBreak = row.AppendChild(new Cell());
                qtyBreak.CellValue = new CellValue(r.QtyBreak?.ToString() ?? "");
                qtyBreak.DataType = new EnumValue<CellValues>(CellValues.String);

                var validFrom = row.AppendChild(new Cell());
                validFrom.CellValue = new CellValue(r.ValidFrom?.ToString("dd/MM/yyyy"));
                validFrom.DataType = new EnumValue<CellValues>(CellValues.String);

                var validTo = row.AppendChild(new Cell());
                validTo.CellValue = new CellValue(r.ValidTo?.ToString("dd/MM/yyyy"));
                validTo.DataType = new EnumValue<CellValues>(CellValues.String);

                var cost = row.AppendChild(new Cell());
                cost.CellValue = new CellValue(r.Cost?.ToString("C2", ukCulture.NumberFormat) ?? "");
                cost.DataType = new EnumValue<CellValues>(CellValues.String);

                var targetMargin = row.AppendChild(new Cell());
                targetMargin.CellValue = new CellValue(r.TargetMargin?.ToString("P02", ukCulture.NumberFormat) ?? "");
                targetMargin.DataType = new EnumValue<CellValues>(CellValues.String);

                var grossMargin = row.AppendChild(new Cell());
                grossMargin.CellValue = new CellValue(r.GrossMargin?.ToString("P02", ukCulture.NumberFormat) ?? "");
                grossMargin.DataType = new EnumValue<CellValues>(CellValues.String);

                var launch = row.AppendChild(new Cell());
                launch.CellValue = new CellValue(r.Launch ?? "");
                launch.DataType = new EnumValue<CellValues>(CellValues.String);

                var brand = row.AppendChild(new Cell());
                brand.CellValue = new CellValue(r.Brand ?? "");
                brand.DataType = new EnumValue<CellValues>(CellValues.String);

                var productType = row.AppendChild(new Cell());
                productType.CellValue = new CellValue(r.ProductType ?? "");
                productType.DataType = new EnumValue<CellValues>(CellValues.String);

                var itemType = row.AppendChild(new Cell());
                itemType.CellValue = new CellValue(r.ItemType ?? "");
                itemType.DataType = new EnumValue<CellValues>(CellValues.String);

                var market = row.AppendChild(new Cell());
                market.CellValue = new CellValue(r.Market ?? "");
                market.DataType = new EnumValue<CellValues>(CellValues.String);

                var currency = row.AppendChild(new Cell());
                currency.CellValue = new CellValue(r.Currency ?? "");
                currency.DataType = new EnumValue<CellValues>(CellValues.String);

                var priceList = row.AppendChild(new Cell());
                priceList.CellValue = new CellValue(PortalFramework.ReplaceHexadecimalSymbols(r.TradePriceList) ?? "");
                priceList.DataType = new EnumValue<CellValues>(CellValues.String);

                var priceLevel = row.AppendChild(new Cell());
                priceLevel.CellValue = new CellValue(r.PricingLevel ?? "");
                priceLevel.DataType = new EnumValue<CellValues>(CellValues.String);

                var agreementType = row.AppendChild(new Cell());
                switch (r.AgreementType)
                {
                    case "P":
                        agreementType.CellValue = new CellValue("Special Price");
                        break;
                    case "D":
                        agreementType.CellValue = new CellValue("Special Discount");
                        break;
                    default:
                        agreementType.CellValue = new CellValue("");
                        break;
                }
                agreementType.DataType = new EnumValue<CellValues>(CellValues.String);

                System.Threading.Thread.CurrentThread.CurrentCulture = originalCulture;
            }

            // save worksheet
            doc.WorkbookPart.WorksheetParts.First().Worksheet.Save();

            // create the worksheet to workbook relation
            doc.WorkbookPart.Workbook.AppendChild(new Sheets());
            doc.WorkbookPart.Workbook.GetFirstChild<Sheets>().AppendChild(new Sheet()
            {
                Id = doc.WorkbookPart.GetIdOfPart(doc.WorkbookPart.WorksheetParts.First()),
                SheetId = 1,
                Name = "Price List"
            });

            doc.WorkbookPart.Workbook.Save();

            OpenXmlValidator val = new OpenXmlValidator();
            var errors = val.Validate(doc);
            if (errors.Count() > 0)
            {
                return new HttpResponseMessage(HttpStatusCode.ExpectationFailed);
            }

            doc.Close();
            doc.Dispose();

            var httpResult = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ByteArrayContent(output.ToArray())
            };

            httpResult.Content.Headers.ContentDisposition =
                new ContentDispositionHeaderValue("attachment")
                {
                    FileName = "Low-Margin.xlsx"
                };

            httpResult.Content.Headers.ContentType =
                new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            #endregion

            return httpResult;
        }

        [HttpGet]
        public DataSourceResult ContractAgreements(
           [ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
           [FromUri]int? TradeAccountID,
           [FromUri]short? TradePriceListID,
           [FromUri]byte? MarketID,
           [FromUri]byte? CurrencyID,
           [FromUri]string SearchTerm,
           [FromUri]short? CollectionID,
           [FromUri]short? QualityID,
           [FromUri]int? ProductID,
           [FromUri]byte? BrandID,
           [FromUri]byte? ProductTypeID,
           [FromUri]bool IncludeClearance,
           [FromUri]bool IncludeSamples,
           [FromUri]byte[] BrandIDs,
           [FromUri]byte[] ProductTypeGroupIDs,
           [FromUri]byte[] ProductTypeIDs,
           [FromUri]short?[] ItemTypeIDs,
           [FromUri]short[] LaunchIDs,
           [FromUri]byte[] SeasonIDs,
           [FromUri]bool CacheBuster)
        {
            var products = new List<ContractAgreement_EnquiryResult>();

            PricingQueryFilter f1 = new PricingQueryFilter();
            f1.TradeAccountID = TradeAccountID;
            f1.TradePriceListID = TradePriceListID;
            f1.MarketID = MarketID;
            f1.CurrencyID = CurrencyID;
            f1.SearchTerm = SearchTerm;
            f1.CollectionID = CollectionID;
            f1.QualityID = QualityID;
            f1.ProductID = ProductID;
            f1.BrandID = BrandID;
            f1.ProductTypeID = ProductTypeID;
            f1.IncludeClearance = IncludeClearance;
            f1.IncludeSamples = IncludeSamples;
            f1.BrandIDs = BrandIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeGroupIDs = ProductTypeGroupIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeIDs = ProductTypeIDs?.ToList() ?? new List<byte>();
            f1.ItemTypeIDs = ItemTypeIDs?.ToList() ?? new List<short?>();
            f1.LaunchIDs = LaunchIDs?.ToList() ?? new List<short>();
            f1.SeasonIDs = SeasonIDs?.ToList() ?? new List<byte>();
            f1.CacheBuster = CacheBuster;

            if ((TradePriceListID == null && MarketID == null && CurrencyID == null) &&
                (SearchTerm == null &&
                CollectionID == null &&
                f1.QualityID == null &&
                f1.ProductID == null &&
                f1.BrandID == null &&
                f1.ProductTypeID == null &&
                f1.BrandIDs.Count == 0 &&
                f1.ProductTypeGroupIDs.Count == 0 &&
                f1.ProductTypeIDs.Count == 0 &&
                f1.ItemTypeIDs.Count == 0 &&
                f1.LaunchIDs.Count == 0 &&
                f1.SeasonIDs.Count == 0))
            {
                return products.AsQueryable().ToDataSourceResult(request);
            }

            if (request.Sorts != null)
            {
                foreach (var i in request.Sorts)
                {
                    if (i.Member == "MarginDisparity")
                    {
                        i.Member = "GrossMargin";
                    }
                }
            }

            var productIDs = GetFilteredProducts(f1);

            var cache = new PortalCache<ContractAgreementResult>(
                String.Format("SpecialPriceAgreements~{0}~{1}",
                    f1.GetHashCode().ToString(),
                    String.Join("~", productIDs.Select(p => p.ToString()).ToArray())
                )
            );

            if (f1.CacheBuster)
            {
                cache.Invalidate(DateTime.Now);
            }

            var result = cache.Get(DateTime.Now);

            if (result == null)
            {
                result = new ContractAgreementResult() { Results = portalDb.ContractAgreementCheck(f1, productIDs) };
                cache.Set(DateTime.Now, result, 60);
            }

            return result.Results.AsQueryable().ToDataSourceResult(request);
        }

        [HttpGet]
        public HttpResponseMessage ContractAgreementsXLSX([ModelBinder(typeof(WebApiDataSourceRequestModelBinder))]DataSourceRequest request,
           [FromUri]int? TradeAccountID,
           [FromUri]short? TradePriceListID,
           [FromUri]byte? MarketID,
           [FromUri]byte? CurrencyID,
           [FromUri]string SearchTerm,
           [FromUri]short? CollectionID,
           [FromUri]short? QualityID,
           [FromUri]int? ProductID,
           [FromUri]byte? BrandID,
           [FromUri]byte? ProductTypeID,
           [FromUri]bool IncludeClearance,
           [FromUri]bool IncludeSamples,
           [FromUri]byte[] BrandIDs,
           [FromUri]byte[] ProductTypeGroupIDs,
           [FromUri]byte[] ProductTypeIDs,
           [FromUri]short?[] ItemTypeIDs,
           [FromUri]short[] LaunchIDs,
           [FromUri]byte[] SeasonIDs,
           [FromUri]bool CacheBuster)
        {
            #region Data Fetch
            var products = new List<ContractAgreement_EnquiryResult>();

            PricingQueryFilter f1 = new PricingQueryFilter();
            f1.TradeAccountID = TradeAccountID;
            f1.TradePriceListID = TradePriceListID;
            f1.MarketID = MarketID;
            f1.CurrencyID = CurrencyID;
            f1.SearchTerm = SearchTerm;
            f1.CollectionID = CollectionID;
            f1.QualityID = QualityID;
            f1.ProductID = ProductID;
            f1.BrandID = BrandID;
            f1.ProductTypeID = ProductTypeID;
            f1.IncludeClearance = IncludeClearance;
            f1.IncludeSamples = IncludeSamples;
            f1.BrandIDs = BrandIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeGroupIDs = ProductTypeGroupIDs?.ToList() ?? new List<byte>();
            f1.ProductTypeIDs = ProductTypeIDs?.ToList() ?? new List<byte>();
            f1.ItemTypeIDs = ItemTypeIDs?.ToList() ?? new List<short?>();
            f1.LaunchIDs = LaunchIDs?.ToList() ?? new List<short>();
            f1.SeasonIDs = SeasonIDs?.ToList() ?? new List<byte>();
            f1.CacheBuster = CacheBuster;

            if ((TradePriceListID == null && MarketID == null && CurrencyID == null) &&
                (SearchTerm == null &&
                CollectionID == null &&
                f1.QualityID == null &&
                f1.ProductID == null &&
                f1.BrandID == null &&
                f1.ProductTypeID == null &&
                f1.BrandIDs.Count == 0 &&
                f1.ProductTypeGroupIDs.Count == 0 &&
                f1.ProductTypeIDs.Count == 0 &&
                f1.ItemTypeIDs.Count == 0 &&
                f1.LaunchIDs.Count == 0 &&
                f1.SeasonIDs.Count == 0))
            {
                return new HttpResponseMessage(HttpStatusCode.ExpectationFailed);
            }

            if (request.Sorts != null)
            {
                foreach (var i in request.Sorts)
                {
                    if (i.Member == "MarginDisparity")
                    {
                        i.Member = "GrossMargin";
                    }
                }
            }

            var productIDs = GetFilteredProducts(f1);

            var cache = new PortalCache<ContractAgreementResult>(
                String.Format("SpecialPriceAgreements~{0}~{1}",
                    f1.GetHashCode().ToString(),
                    String.Join("~", productIDs.Select(p => p.ToString()).ToArray())
                )
            );

            if (f1.CacheBuster)
            {
                cache.Invalidate(DateTime.Now);
            }

            var result = cache.Get(DateTime.Now);

            if (result == null)
            {
                result = new ContractAgreementResult() { Results = portalDb.ContractAgreementCheck(f1, productIDs) };
                cache.Set(DateTime.Now, result, 60);
            }
            #endregion

            #region Write 
            MemoryStream output = new MemoryStream();

            string[] columnHeadings = new[] {
                "Account",
                "Discount",
                "Quantity Break",
                "Valid From",
                "Valid To",
                "Status",
                "Brand",
                "Product Group",
                "Item Type",
                "Quality",
                "Product",
                "Market",
                "Currency",
                "Price List",
                "Price Level",
                "Agreement Type"
            };

            var doc = SpreadsheetDocument.Create(output, SpreadsheetDocumentType.Workbook);

            PrepareSpreadsheetDoc(ref doc);

            int boldIndex = 1;

            var headingRow = doc.WorkbookPart.WorksheetParts.First().Worksheet.GetFirstChild<SheetData>().AppendChild(new Row());

            foreach (string h in columnHeadings)
            {
                var cell = headingRow.AppendChild(new Cell());
                cell.StyleIndex = Convert.ToUInt32(boldIndex);
                cell.CellValue = new CellValue(h);
                cell.DataType = new EnumValue<CellValues>(CellValues.String);
            }

            var originalCulture = System.Threading.Thread.CurrentThread.CurrentCulture;
            var ukCulture = new System.Globalization.CultureInfo("en-GB");

            foreach (var r in result.Results.OrderBy(p => p.DefaultSortOrder))
            {
                if (r.CurrencyFormattingCulture != null)
                    System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(r.CurrencyFormattingCulture);

                var row = doc.WorkbookPart.WorksheetParts.First().Worksheet.GetFirstChild<SheetData>().AppendChild(new Row());

                var account = row.AppendChild(new Cell());
                account.CellValue = new CellValue(PortalFramework.ReplaceHexadecimalSymbols(r.TradeAccountCode + " - " + r.TradeAccountName) ?? "");
                account.DataType = new EnumValue<CellValues>(CellValues.String);

                var discount = row.AppendChild(new Cell());
                if (r.AgreementType == "D")
                    discount.CellValue = new CellValue(r.Discount?.ToString("F2") + "% off");
                else if (r.AgreementType == "P")
                    discount.CellValue = new CellValue(r.Discount?.ToString("C2", System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat));
                else
                    discount.CellValue = new CellValue("");
                discount.DataType = new EnumValue<CellValues>(CellValues.String);

                var qtyBreak = row.AppendChild(new Cell());
                qtyBreak.CellValue = new CellValue(r.QtyBreak.ToString() ?? "");
                qtyBreak.DataType = new EnumValue<CellValues>(CellValues.String);

                var validFrom = row.AppendChild(new Cell());
                validFrom.CellValue = new CellValue(r.ValidFrom?.ToString("dd/MM/yyyy"));
                validFrom.DataType = new EnumValue<CellValues>(CellValues.String);

                var validTo = row.AppendChild(new Cell());
                validTo.CellValue = new CellValue(r.ValidTo?.ToString("dd/MM/yyyy"));
                validTo.DataType = new EnumValue<CellValues>(CellValues.String);

                var status = row.AppendChild(new Cell());
                switch (r.Status)
                {
                    case "O":
                        status.CellValue = new CellValue("Old");
                        break;
                    case "F":
                        status.CellValue = new CellValue("Future");
                        break;
                    case "C":
                        status.CellValue = new CellValue("Current");
                        break;
                    default:
                        status.CellValue = new CellValue("");
                        break;
                }
                status.DataType = new EnumValue<CellValues>(CellValues.String);

                var brand = row.AppendChild(new Cell());
                brand.CellValue = new CellValue(r.Brand ?? "");
                brand.DataType = new EnumValue<CellValues>(CellValues.String);

                var productGroup = row.AppendChild(new Cell());
                productGroup.CellValue = new CellValue(r.ProductGroup ?? "");
                productGroup.DataType = new EnumValue<CellValues>(CellValues.String);

                var itemType = row.AppendChild(new Cell());
                itemType.CellValue = new CellValue(r.ItemType ?? "");
                itemType.DataType = new EnumValue<CellValues>(CellValues.String);

                var quality = row.AppendChild(new Cell());
                quality.CellValue = new CellValue(r.Quality ?? "");
                quality.DataType = new EnumValue<CellValues>(CellValues.String);

                var product = row.AppendChild(new Cell());
                product.CellValue = new CellValue(r.Product ?? "");
                product.DataType = new EnumValue<CellValues>(CellValues.String);

                var market = row.AppendChild(new Cell());
                market.CellValue = new CellValue(r.Market ?? "");
                market.DataType = new EnumValue<CellValues>(CellValues.String);

                var currency = row.AppendChild(new Cell());
                currency.CellValue = new CellValue(r.Currency ?? "");
                currency.DataType = new EnumValue<CellValues>(CellValues.String);

                var priceList = row.AppendChild(new Cell());
                priceList.CellValue = new CellValue(PortalFramework.ReplaceHexadecimalSymbols(r.TradePriceList) ?? "");
                priceList.DataType = new EnumValue<CellValues>(CellValues.String);

                var priceLevel = row.AppendChild(new Cell());
                priceLevel.CellValue = new CellValue(r.PricingLevel ?? "");
                priceLevel.DataType = new EnumValue<CellValues>(CellValues.String);

                var agreementType = row.AppendChild(new Cell());
                switch (r.AgreementType)
                {
                    case "P":
                        agreementType.CellValue = new CellValue("Special Price");
                        break;
                    case "D":
                        agreementType.CellValue = new CellValue("Special Discount");
                        break;
                    default:
                        agreementType.CellValue = new CellValue("");
                        break;
                }
                agreementType.DataType = new EnumValue<CellValues>(CellValues.String);

                System.Threading.Thread.CurrentThread.CurrentCulture = originalCulture;
            }

            // save worksheet
            doc.WorkbookPart.WorksheetParts.First().Worksheet.Save();

            // create the worksheet to workbook relation
            doc.WorkbookPart.Workbook.AppendChild(new Sheets());
            doc.WorkbookPart.Workbook.GetFirstChild<Sheets>().AppendChild(new Sheet()
            {
                Id = doc.WorkbookPart.GetIdOfPart(doc.WorkbookPart.WorksheetParts.First()),
                SheetId = 1,
                Name = "Price List"
            });

            doc.WorkbookPart.Workbook.Save();

            OpenXmlValidator val = new OpenXmlValidator();
            var errors = val.Validate(doc);
            if (errors.Count() > 0)
            {
                return new HttpResponseMessage(HttpStatusCode.ExpectationFailed);
            }

            doc.Close();
            doc.Dispose();

            var httpResult = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ByteArrayContent(output.ToArray())
            };

            httpResult.Content.Headers.ContentDisposition =
                new ContentDispositionHeaderValue("attachment")
                {
                    FileName = "Special-Prices.xlsx"
                };

            httpResult.Content.Headers.ContentType =
                new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            #endregion

            return httpResult;
        }

        private static List<int> GetFilteredProducts(PricingQueryFilter f1)
        {
            var products = PriceCheckerDataSource.GetProducts(
                    f1.SearchTerm,
                    f1.CollectionID,
                    f1.QualityID,
                    f1.ProductID,
                    f1.BrandID,
                    f1.ProductTypeID,
                    f1.IncludeClearance,
                    f1.IncludeSamples
                )
                .AsQueryable();
            
            if (f1.IncludeClearance == false)
                products = products.Where(p => p.Clearance == f1.IncludeClearance);

            if (f1.IncludeSamples == false)
                products = products.Where(p => p.Sample == f1.IncludeSamples);

            if (f1.BrandIDs.Any())
                products = products.Where(p => f1.BrandIDs.Contains(p.BrandID));

            if (f1.ProductTypeGroupIDs.Any())
                products = products.Where(p => f1.ProductTypeGroupIDs.Contains(p.ProductTypeGroupID));

            if (f1.ProductTypeIDs.Any())
                products = products.Where(p => f1.ProductTypeIDs.Contains(p.ProductTypeID));

            if (f1.ItemTypeIDs.Any())
                products = products.Where(p => f1.ItemTypeIDs.Contains(p.ItemTypeID));

            if (f1.LaunchIDs.Any())
                products = products.Where(p => f1.LaunchIDs.Contains(p.LaunchID));

            if (f1.SeasonIDs.Any())
                products = products.Where(p => f1.SeasonIDs.Contains(p.SeasonID));

            var productIDs = products.Select(p => p.ProductID).Distinct().ToList();

            return productIDs;
        }

        private void PrepareSpreadsheetDoc(ref SpreadsheetDocument doc)
        {
            doc.AddWorkbookPart();
            doc.WorkbookPart.Workbook = new Workbook();
            doc.WorkbookPart.AddNewPart<WorksheetPart>();
            doc.WorkbookPart.WorksheetParts.First().Worksheet = new Worksheet();

            doc.WorkbookPart.WorksheetParts.First().Worksheet.AppendChild(new SheetData());
            
            var stylesPart = doc.WorkbookPart.AddNewPart<WorkbookStylesPart>();
            stylesPart.Stylesheet = new Stylesheet();
            stylesPart.Stylesheet.Fonts = new Fonts();
            stylesPart.Stylesheet.Borders = new Borders();
            stylesPart.Stylesheet.Fills = new Fills();
            stylesPart.Stylesheet.CellFormats = new CellFormats();

            stylesPart.Stylesheet.Borders.Append(new Border());
            stylesPart.Stylesheet.Fills.Append(new Fill());

            var font = new DocumentFormat.OpenXml.Spreadsheet.Font(
                    new FontSize() { Val = 11 },
                    new Color() { Rgb = new HexBinaryValue() { Value = "00000000" } },
                    new FontName() { Val = "Calibri" });
            stylesPart.Stylesheet.Fonts.Append(font);

            var boldFont = new DocumentFormat.OpenXml.Spreadsheet.Font(
                    new Bold() { },
                    new FontSize() { Val = 11 },
                    new Color() { Rgb = new HexBinaryValue() { Value = "00000000" } },
                    new FontName() { Val = "Calibri" });
            stylesPart.Stylesheet.Fonts.Append(boldFont);
            stylesPart.Stylesheet.Save();

            UInt32Value plainFontId = Convert.ToUInt32(stylesPart.Stylesheet.Fonts.ChildElements.Count - 2);
            CellFormat plainCellFormat = new CellFormat() { FontId = plainFontId, FillId = 0, BorderId = 0, ApplyFont = true };

            UInt32Value boldFontId = Convert.ToUInt32(stylesPart.Stylesheet.Fonts.ChildElements.Count - 1);
            CellFormat boldCellFormat = new CellFormat() { FontId = boldFontId, FillId = 0, BorderId = 0, ApplyFont = true };

            stylesPart.Stylesheet.CellFormats.Append(plainCellFormat);
            stylesPart.Stylesheet.CellFormats.Append(boldCellFormat);

        }







        /* ~~~~~~~~~~~~~ New Stuff ~~~~~~~~~~~~~ */

        

        [HttpPost]
        public IHttpActionResult BrandSlicerEndpoint([FromBody]PricingQueryFilter f1)
        {
            var matrix = PriceCheckerDataSource.GetMatrix(
                f1.TradePriceListID,
                f1.MarketID,
                f1.CurrencyID,
                f1.SearchTerm,
                f1.CollectionID,
                f1.QualityID,
                f1.ProductID,
                f1.BrandID,
                f1.ProductTypeID,
                f1.IncludeSamples,
                f1.IncludeClearance)
                .AsQueryable()
                .Where(p => 
                    //f1.BrandIDs.Count() > 0 ? f1.BrandIDs.Contains(p.BrandID) : true &&
                    f1.ProductTypeIDs.Count() > 0 ? f1.ProductTypeIDs.Contains(p.ProductTypeID) : true &&
                    f1.ProductTypeGroupIDs.Count() > 0 ? f1.ProductTypeGroupIDs.Contains(p.ProductTypeGroupID) : true &&
                    f1.ItemTypeIDs.Count() > 0 ? f1.ItemTypeIDs.Contains(p.ItemTypeID) : true &&
                    f1.LaunchIDs.Count() > 0 ? f1.LaunchIDs.Contains(p.LaunchID) : true &&
                    f1.SeasonIDs.Count() > 0 ? f1.SeasonIDs.Contains(p.SeasonID) : true)
                .Select(p => p.BrandID)
                .Distinct();
            
            return Ok(PriceCheckerDataSource.GetBrands(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => matrix.Contains(p.BrandID)).OrderBy(p => p.Name));
        }
        
        [HttpPost]
        public IHttpActionResult ProductTypeSlicerEndpoint([FromBody]PricingQueryFilter f1)
        {
            var matrix = PriceCheckerDataSource.GetMatrix(
                f1.TradePriceListID,
                f1.MarketID,
                f1.CurrencyID,
                f1.SearchTerm,
                f1.CollectionID,
                f1.QualityID,
                f1.ProductID,
                f1.BrandID,
                f1.ProductTypeID,
                f1.IncludeSamples,
                f1.IncludeClearance)
                .AsQueryable()
                .Where(p => 
                    f1.BrandIDs.Count() > 0 ? f1.BrandIDs.Contains(p.BrandID) : true &&
                    //f1.ProductTypeIDs.Count() > 0 ? f1.ProductTypeIDs.Contains(p.ProductTypeID) : true &&
                    f1.ProductTypeGroupIDs.Count() > 0 ? f1.ProductTypeGroupIDs.Contains(p.ProductTypeGroupID) : true &&
                    f1.ItemTypeIDs.Count() > 0 ? f1.ItemTypeIDs.Contains(p.ItemTypeID) : true &&
                    f1.LaunchIDs.Count() > 0 ? f1.LaunchIDs.Contains(p.LaunchID) : true &&
                    f1.SeasonIDs.Count() > 0 ? f1.SeasonIDs.Contains(p.SeasonID) : true)
                .Select(p => p.ProductTypeID)
                .Distinct();

            return Ok(PriceCheckerDataSource.GetProductTypes(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => matrix.Contains(p.ProductTypeID)).OrderBy(p => p.Name));
        }

        [HttpPost]
        public IHttpActionResult ProductTypeGroupSlicerEndpoint([FromBody]PricingQueryFilter f1)
        {
            var matrix = PriceCheckerDataSource.GetMatrix(
                f1.TradePriceListID,
                f1.MarketID,
                f1.CurrencyID,
                f1.SearchTerm,
                f1.CollectionID,
                f1.QualityID,
                f1.ProductID,
                f1.BrandID,
                f1.ProductTypeID,
                f1.IncludeSamples,
                f1.IncludeClearance)
                .AsQueryable()
                .Where(p => 
                    f1.BrandIDs.Count() > 0 ? f1.BrandIDs.Contains(p.BrandID) : true &&
                    f1.ProductTypeIDs.Count() > 0 ? f1.ProductTypeIDs.Contains(p.ProductTypeID) : true &&
                    //f1.ProductTypeGroupIDs.Count() > 0 ? f1.ProductTypeGroupIDs.Contains(p.ProductTypeGroupID) : true &&
                    f1.ItemTypeIDs.Count() > 0 ? f1.ItemTypeIDs.Contains(p.ItemTypeID) : true &&
                    f1.LaunchIDs.Count() > 0 ? f1.LaunchIDs.Contains(p.LaunchID) : true &&
                    f1.SeasonIDs.Count() > 0 ? f1.SeasonIDs.Contains(p.SeasonID) : true)
                .Select(p => p.ProductTypeGroupID)
                .Distinct();

            return Ok(PriceCheckerDataSource.GetProductTypeGroups(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => matrix.Contains(p.ProductTypeGroupID)).OrderBy(p => p.Name));
        }

        [HttpPost]
        public IHttpActionResult ItemTypeSlicerEndpoint([FromBody]PricingQueryFilter f1)
        {
            var matrix = PriceCheckerDataSource.GetMatrix(
                f1.TradePriceListID,
                f1.MarketID,
                f1.CurrencyID,
                f1.SearchTerm,
                f1.CollectionID,
                f1.QualityID,
                f1.ProductID,
                f1.BrandID,
                f1.ProductTypeID,
                f1.IncludeSamples,
                f1.IncludeClearance)
                .AsQueryable()
                .Where(p => 
                    f1.BrandIDs.Count() > 0 ? f1.BrandIDs.Contains(p.BrandID) : true &&
                    f1.ProductTypeIDs.Count() > 0 ? f1.ProductTypeIDs.Contains(p.ProductTypeID) : true &&
                    f1.ProductTypeGroupIDs.Count() > 0 ? f1.ProductTypeGroupIDs.Contains(p.ProductTypeGroupID) : true &&
                    //f1.ItemTypeIDs.Count() > 0 ? f1.ItemTypeIDs.Contains(p.ItemTypeID) : true &&
                    f1.LaunchIDs.Count() > 0 ? f1.LaunchIDs.Contains(p.LaunchID) : true &&
                    f1.SeasonIDs.Count() > 0 ? f1.SeasonIDs.Contains(p.SeasonID) : true)
                .Select(p => p.ItemTypeID)
                .Distinct();

            return Ok(PriceCheckerDataSource.GetItemTypes(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => matrix.Contains(p.ItemTypeID)).OrderBy(p => p.Name));
        }

        [HttpPost]
        public IHttpActionResult LaunchSlicerEndpoint([FromBody]PricingQueryFilter f1)
        {
            var matrix = PriceCheckerDataSource.GetMatrix(
                f1.TradePriceListID,
                f1.MarketID,
                f1.CurrencyID,
                f1.SearchTerm,
                f1.CollectionID,
                f1.QualityID,
                f1.ProductID,
                f1.BrandID,
                f1.ProductTypeID,
                f1.IncludeSamples,
                f1.IncludeClearance)
                .AsQueryable()
                .Where(p => 
                    f1.BrandIDs.Count() > 0 ? f1.BrandIDs.Contains(p.BrandID) : true &&
                    f1.ProductTypeIDs.Count() > 0 ? f1.ProductTypeIDs.Contains(p.ProductTypeID) : true &&
                    f1.ProductTypeGroupIDs.Count() > 0 ? f1.ProductTypeGroupIDs.Contains(p.ProductTypeGroupID) : true &&
                    f1.ItemTypeIDs.Count() > 0 ? f1.ItemTypeIDs.Contains(p.ItemTypeID) : true &&
                    //f1.LaunchIDs.Count() > 0 ? f1.LaunchIDs.Contains(p.LaunchID) : true &&
                    f1.SeasonIDs.Count() > 0 ? f1.SeasonIDs.Contains(p.SeasonID) : true)
                .Select(p => p.LaunchID)
                .Distinct();

            return Ok(portalDb.Launches.Where(p => p.TradeLaunchDate != null && p.TradeLaunchDate.Value.Year <= DateTime.Now.Year)
                .OrderByDescending(l => l.LaunchID)
                .Select(l => new SlicerLaunch() { LaunchID = l.LaunchID, Name = l.Name }));

            //return Ok(PriceCheckerDataSource.GetLaunches(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => matrix.Contains(p.LaunchID)).OrderByDescending(p => p.LaunchID));
        }
        
        [HttpPost]
        public IHttpActionResult SeasonSlicerEndpoint([FromBody]PricingQueryFilter f1)
        {
            var matrix = PriceCheckerDataSource.GetMatrix(
                f1.TradePriceListID,
                f1.MarketID,
                f1.CurrencyID,
                f1.SearchTerm,
                f1.CollectionID,
                f1.QualityID,
                f1.ProductID,
                f1.BrandID,
                f1.ProductTypeID,
                f1.IncludeSamples,
                f1.IncludeClearance)
                .AsQueryable()
                .Where(p => 
                    f1.BrandIDs.Count() > 0 ? f1.BrandIDs.Contains(p.BrandID) : true &&
                    f1.ProductTypeIDs.Count() > 0 ? f1.ProductTypeIDs.Contains(p.ProductTypeID) : true &&
                    f1.ProductTypeGroupIDs.Count() > 0 ? f1.ProductTypeGroupIDs.Contains(p.ProductTypeGroupID) : true &&
                    f1.ItemTypeIDs.Count() > 0 ? f1.ItemTypeIDs.Contains(p.ItemTypeID) : true &&
                    f1.LaunchIDs.Count() > 0 ? f1.LaunchIDs.Contains(p.LaunchID) : true)
                    //f1.SeasonIDs.Count() > 0 ? f1.SeasonIDs.Contains(p.SeasonID) : true)
                .Select(p => p.SeasonID)
                .Distinct();

            return Ok(PriceCheckerDataSource.GetSeasons(f1.TradePriceListID, f1.MarketID, f1.CurrencyID).Where(p => matrix.Contains(p.SeasonID)).OrderBy(p => p.Name));
        }
    }
}