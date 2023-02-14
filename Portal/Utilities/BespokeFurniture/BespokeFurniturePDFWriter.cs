using System;
using System.Collections.Generic;
using System.Linq;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System.Web;
using System.IO;
using System.Xml;
using Newtonsoft.Json;
using System.Xml.Linq;
using System.Net;

namespace Portal.Utilities.BespokeFurniture
{
    public static class BespokeFurniturePDFWriter
    {
        public static XDocument ToXDocument(this XmlDocument xmlDocument)
        {
            using (var reader = new XmlNodeReader(xmlDocument))
            {
                reader.MoveToContent();
                return XDocument.Load(reader);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="rootPath">System.Web.Hosting.HostingEnvironment.MapPath("~")</param>
        public static void GenerateQuote(string rootPath, string json, HttpResponse response)
        {
            var xDoc = (XmlDocument)JsonConvert.DeserializeXmlNode(json, "root");

            var productInfo = ToXDocument(xDoc);

            var stopWatch = new System.Diagnostics.Stopwatch();

            stopWatch.Start();

            int[] columnWidths = new int[] { 100, 100, 130, 100, 70, 100, 100, 80, 100 };

            try
            {
                var now = DateTime.Now;

                var finalStream = new MemoryStream();
                //PdfCopyFields copy = new PdfCopyFields(finalStream);

                BaseFont gillSansMt = BaseFont.CreateFont(rootPath + "Content/fonts/Gill-Sans-MT.ttf", BaseFont.CP1252, BaseFont.EMBEDDED);

                var normalFont = new Font(gillSansMt, 10, Font.NORMAL, BaseColor.BLACK);//FontFactory.GetFont("Arial", 10, Font.NORMAL, BaseColor.BLACK);
                var normalBoldFont = FontFactory.GetFont("Arial", 10, Font.BOLD, BaseColor.BLACK);//FontFactory.GetFont("Arial", 10, Font.NORMAL, BaseColor.BLACK);
                var subtitleFont = new Font(gillSansMt, 12, Font.NORMAL, BaseColor.BLACK);// FontFactory.GetFont("", 12, Font.BOLD, BaseColor.BLACK);

                var smallerFont = new Font(gillSansMt, 9, Font.NORMAL, BaseColor.BLACK);//FontFactory.GetFont("Arial", 9, Font.NORMAL, BaseColor.BLACK);
                var smallerAnchorFont = new Font(gillSansMt, 9, Font.NORMAL, BaseColor.BLUE);//FontFactory.GetFont("Arial", 9, Font.NORMAL, BaseColor.BLACK);
                var smallerBoldFont = new Font(gillSansMt, 9, Font.BOLD, BaseColor.BLACK);//FontFactory.GetFont("Arial", 9, Font.BOLD, BaseColor.BLACK);
                var smallerItalicFont = new Font(gillSansMt, 9, Font.ITALIC, BaseColor.BLACK);//FontFactory.GetFont("Arial", 9, Font.ITALIC, BaseColor.BLACK);
                var boldFont = FontFactory.GetFont("Arial", 9, Font.BOLD, BaseColor.BLACK);
                var boldUnderlinedFont = new Font(gillSansMt, 10, Font.BOLD | Font.UNDERLINE, BaseColor.BLACK);//FontFactory.GetFont("Arial", 10, Font.BOLD | Font.UNDERLINE, BaseColor.BLACK);
                var footerNormalFont = new Font(gillSansMt, 8, Font.NORMAL, BaseColor.BLACK);//FontFactory.GetFont("Arial", 8, Font.NORMAL, BaseColor.BLACK);
                var footerBoldFont = FontFactory.GetFont("Arial", 8, Font.BOLD, BaseColor.BLACK);

                System.Drawing.Image dgImage = System.Drawing.Image.FromFile(AppDomain.CurrentDomain.BaseDirectory + "Content/Images/Logos/designers-guild-clearance.png");

                Image dgLogo = Image.GetInstance(dgImage, System.Drawing.Imaging.ImageFormat.Png);

                dgLogo.ScaleAbsolute(280.0f, 21.0f);

                List<MemoryStream> streams = new List<MemoryStream>();

                var output = new MemoryStream();

                var subFooterTable = new PdfPTable(1);

                subFooterTable.TotalWidth = 595.0f;
                subFooterTable.LockedWidth = true;
                subFooterTable.DefaultCell.Border = 0;
                subFooterTable.DefaultCell.Padding = 3;
                subFooterTable.DefaultCell.BorderWidth = 0;
                subFooterTable.DefaultCell.VerticalAlignment = Element.ALIGN_TOP;
                subFooterTable.DefaultCell.HorizontalAlignment = Element.ALIGN_CENTER;

                var subFooterParagraph = new Paragraph();
                var subFooterPhrase = new Phrase();
                var subFooterPreChunk = new Chunk("Registered Office: ", footerBoldFont);
                var subFooterChunk = new Chunk($"Designers Guild Ltd. Unit 3, Latimer Place, London, W10 6QT   ", footerNormalFont);
                var subFooterChunk2 = new Chunk("Company Reg. No.: ", footerBoldFont);
                var subFooterChunk3 = new Chunk("991848   ", footerNormalFont);
                var subFooterChunk4 = new Chunk("Company VAT No.: ", footerBoldFont);
                var subFooterChunk5 = new Chunk("480653733", footerNormalFont);
                subFooterPhrase.Add(subFooterPreChunk);
                subFooterPhrase.Add(subFooterChunk);
                subFooterPhrase.Add(subFooterChunk2);
                subFooterPhrase.Add(subFooterChunk3);
                subFooterPhrase.Add(subFooterChunk4);
                subFooterPhrase.Add(subFooterChunk5);
                subFooterParagraph.Add(subFooterPhrase);

                var subFooterCell = new PdfPCell();

                subFooterCell.Border = 0;
                subFooterCell.Padding = 0;
                subFooterCell.PaddingBottom = 10.0f;

                subFooterCell.AddElement(subFooterParagraph);

                subFooterTable.AddCell(subFooterCell);

                var footerTable = new PdfPTable(1);

                footerTable.TotalWidth = 400.0f;
                footerTable.LockedWidth = true;
                footerTable.DefaultCell.Border = 0;
                footerTable.DefaultCell.Padding = 3;
                footerTable.DefaultCell.BorderWidth = 0;
                footerTable.DefaultCell.VerticalAlignment = Element.ALIGN_TOP;
                footerTable.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;

                var footerTableBottom = new PdfPCell();

                footerTableBottom.Padding = 0;
                footerTableBottom.Border = 0;

                footerTable.AddCell(footerTableBottom);

                var paymentParagraph = new Paragraph();

                iTextSharp.text.Document document = new iTextSharp.text.Document(PageSize.A4, 25, 25, 25, 25);// footerTable.TotalHeight + 30.0f);

                var writer = PdfWriter.GetInstance(document, output);

                writer.CloseStream = false;

                document.Open();

                var nfi = new System.Globalization.CultureInfo("en-GB").NumberFormat;

                document.SetMargins(25.0f, 25.0f, 110.0f, 25.0f);

                document.NewPage();

                WebClient wc = new WebClient();
                byte[] bytes = wc.DownloadData($"https://www.designersguild.com/image/488/{productInfo.Root.Element("modelDetails").Element("imageId").Value}");
                MemoryStream ms = new MemoryStream(bytes);
                System.Drawing.Image modelImage = System.Drawing.Image.FromStream(ms);

                Image modelImg = Image.GetInstance(modelImage, System.Drawing.Imaging.ImageFormat.Jpeg);

                modelImg.WidthPercentage = 100.0f;// (180.0f, 180.0f);
                modelImg.ScaleToFitHeight = true;

                var modelDetailTable = new PdfPTable(2);

                modelDetailTable.WidthPercentage = 100.0f;

                modelDetailTable.SetWidths(new float[] { 65.0f, 35.0f });

                modelDetailTable.DefaultCell.Border = 0;
                modelDetailTable.DefaultCell.PaddingLeft = 0;
                modelDetailTable.DefaultCell.PaddingRight = 0;
                modelDetailTable.DefaultCell.PaddingTop = 0;
                modelDetailTable.DefaultCell.PaddingBottom = 0;
                modelDetailTable.DefaultCell.BorderWidth = 0;
                modelDetailTable.DefaultCell.VerticalAlignment = Element.ALIGN_TOP;
                modelDetailTable.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;

                var modelDetailCell = new PdfPCell()
                {
                    Border = 0,
                    HorizontalAlignment = Element.ALIGN_LEFT,
                    VerticalAlignment = Element.ALIGN_TOP,
                    PaddingLeft = 0,
                    PaddingRight = 15.0f,
                    PaddingTop = 0,
                    PaddingBottom = 0
                };

                var modelDetailCellTable = new PdfPTable(2);
                modelDetailCellTable.SetWidths(new float[] { 50.0f, 50.0f });
                modelDetailCellTable.DefaultCell.Border = 0;
                modelDetailCellTable.DefaultCell.PaddingLeft = 0;
                modelDetailCellTable.DefaultCell.PaddingRight = 0;
                modelDetailCellTable.DefaultCell.PaddingTop = 0;
                modelDetailCellTable.DefaultCell.PaddingBottom = 0;
                modelDetailCellTable.DefaultCell.BorderWidth = 0;
                modelDetailCellTable.DefaultCell.VerticalAlignment = Element.ALIGN_TOP;
                modelDetailCellTable.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;

                var designPhrase = new Phrase();
                designPhrase.Add(new Chunk("Design: ", normalBoldFont));
                designPhrase.Add(new Chunk($"{productInfo.Root.Element("design").Value}", normalFont));

                var modelPhrase = new Phrase();
                modelPhrase.Add(new Chunk("Model: ", normalBoldFont));
                modelPhrase.Add(new Chunk($"{productInfo.Root.Element("model").Value}", normalFont));

                var purposeParagraph = new Paragraph()
                {
                    SpacingBefore = 15.0f
                };

                var purposePhrase = new Phrase();
                purposePhrase.Add(new Chunk("Purpose: ", normalBoldFont));
                purposePhrase.Add(new Chunk($"{(productInfo.Root.Element("domesticOrCommercialId").Value == "D" ? "Domestic" : "Commercial")}", normalFont));

                purposeParagraph.Add(purposePhrase);

                modelDetailCell.AddElement(designPhrase);
                modelDetailCell.AddElement(modelPhrase);
                modelDetailCell.AddElement(purposeParagraph);


                var modelDetailsLeftCell = new PdfPCell()
                {
                    Border = 0,
                    HorizontalAlignment = Element.ALIGN_LEFT,
                    VerticalAlignment = Element.ALIGN_TOP,
                    PaddingLeft = 0,
                    PaddingRight = 15.0f,
                    PaddingTop = 0,
                    PaddingBottom = 0
                };
                
                modelDetailCell.AddElement(modelDetailCellTable);

                modelDetailTable.AddCell(modelDetailCell);

                modelDetailTable.AddCell(new PdfPCell(modelImg, true)
                {
                    Border = 1,
                    BorderWidthTop = 2.0f,
                    BorderWidthRight = 2.0f,
                    BorderWidthBottom = 2.0f,
                    BorderWidthLeft = 2.0f,
                    BorderWidth = 2.0f,
                    BorderColor = BaseColor.BLACK
                });

                document.Add(modelDetailTable);

                //var groupedProducts = productInfo.Document.Element("result").Element("Products").Elements("Product").GroupBy(q => q.Element("ProductType").Value);

                //string salesRepEmail = "";
                //string salesRepName = "";
                //string customerServicesPhone = "";
                //string currencyCode = "GBP";
                //string formattingCulture = "en-GB";

                //salesRepName = productInfo.Document.Element("result").Element("Info").Elements("CustomerServices").FirstOrDefault().Element("SalesRepresentativeName")?.Value;
                //salesRepEmail = productInfo.Document.Element("result").Element("Info").Elements("CustomerServices").FirstOrDefault().Element("SalesRepresentativeEmail")?.Value;
                //customerServicesPhone = productInfo.Document.Element("result").Element("Info").Elements("CustomerServices").FirstOrDefault().Element("Phone")?.Value;
                //currencyCode = productInfo.Document.Element("result").Element("Info").Elements("CustomerServices").FirstOrDefault().Element("CurrencyCode")?.Value;
                //formattingCulture = productInfo.Document.Element("result").Element("Info").Elements("CustomerServices").FirstOrDefault().Element("FormattingCulture")?.Value;

                //foreach (var group in groupedProducts)
                //{
                //    //group.Key;

                //    /*
                //     Ideally, this would mean a removal of the ProductType column and placing of group.Key beneath "CLEARANCE LIST" and above the column headings... 
                //     hmm.    
                //     */

                //    var bodyTable = new PdfPTable(columnWidths.Count());

                //    bodyTable.WidthPercentage = 100.0f;

                //    bodyTable.DefaultCell.Border = 0;
                //    bodyTable.DefaultCell.PaddingLeft = 3;
                //    bodyTable.DefaultCell.PaddingRight = 3;
                //    bodyTable.DefaultCell.PaddingTop = 8;
                //    bodyTable.DefaultCell.PaddingBottom = 8;
                //    bodyTable.DefaultCell.BorderWidth = 0;
                //    bodyTable.DefaultCell.VerticalAlignment = Element.ALIGN_TOP;
                //    bodyTable.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;

                //    bodyTable.SetWidths(columnWidths);

                //    //var contentByte = writer.DirectContent;

                //    //contentByte.BeginText();

                //    //contentByte.SetFontAndSize(subtitleFont.BaseFont, 10.0f);

                //    //contentByte.ShowTextAligned(PdfContentByte.ALIGN_LEFT, group.Key, 25, 756, 0);

                //    //contentByte.EndText();

                //    foreach (var product in group)
                //    {
                //        var paddingBottom = 4.0f;

                //        if (product.Element("Code").Value.StartsWith("F") || product.Element("Code").Value.StartsWith("P"))
                //        {
                //            paddingBottom = 1.0f;
                //        }

                //        long imageId = -1;

                //        if (Int64.TryParse(product.Element("ImageID").Value, out imageId))
                //        {
                //            var filePath = $"\\\\vm-web1\\d$\\wwwroot\\flock\\imagelibrary\\239\\{imageId}.jpeg";

                //            var jpg = Image.GetInstance(filePath);// (new Uri(imageUrl));

                //            bodyTable.AddCell(new PdfPCell(jpg, true)
                //            { Border = 0, BorderWidthTop = 0.5f, BorderColorTop = BaseColor.LIGHT_GRAY, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });
                //        }
                //        else
                //        {
                //            bodyTable.AddCell(new PdfPCell()
                //            { Border = 0, BorderWidthTop = 0.5f, BorderColorTop = BaseColor.LIGHT_GRAY, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });
                //        }

                //        //bodyTable.AddCell(new PdfPCell(new Phrase($"{product.Element("ProductType").Value}", smallerFont))
                //        //{ Border = 0, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });

                //        bodyTable.AddCell(new PdfPCell(new Phrase($"{product.Element("Brand").Value}", smallerFont))
                //        { Border = 0, BorderWidthTop = 0.5f, BorderColorTop = BaseColor.LIGHT_GRAY, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });

                //        //bodyTable.AddCell(new PdfPCell(new Phrase($"{product.Element("Collection").Value}", smallerFont))
                //        //{ Border = 0, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });

                //        var a = new Anchor($"{product.Element("Code").Value}", smallerAnchorFont);
                //        a.Reference = $"{product.Element("URL").Value}";

                //        if (a.Reference != "")
                //        {
                //            bodyTable.AddCell(new PdfPCell(a)
                //            { Border = 0, BorderWidthTop = 0.5f, BorderColorTop = BaseColor.LIGHT_GRAY, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 8, PaddingTop = 5, PaddingBottom = paddingBottom });
                //        }
                //        else
                //        {
                //            bodyTable.AddCell(new PdfPCell(new Phrase($"{product.Element("Code").Value}", smallerFont))
                //            { Border = 0, BorderWidthTop = 0.5f, BorderColorTop = BaseColor.LIGHT_GRAY, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 8, PaddingTop = 5, PaddingBottom = paddingBottom });
                //        }

                //        var ti = System.Threading.Thread.CurrentThread.CurrentCulture.TextInfo;

                //        bodyTable.AddCell(new PdfPCell(new Phrase($"{ti.ToTitleCase(product.Element("Name").Value.ToLower()).Replace("Of", "of")}", smallerFont))
                //        { Border = 0, BorderWidthTop = 0.5f, BorderColorTop = BaseColor.LIGHT_GRAY, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });

                //        //bodyTable.AddCell(new PdfPCell(new Phrase($"{product.Element("URL").Value}", smallerFont))
                //        //{ Border = 0, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });
                //        var listPrice = Convert.ToDecimal(product.Element("ListPrice").Value).ToString("C2", nfi);
                //        bodyTable.AddCell(new PdfPCell(new Phrase($"{listPrice}", smallerFont))
                //        { Border = 0, BorderWidthTop = 0.5f, BorderColorTop = BaseColor.LIGHT_GRAY, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });

                //        bodyTable.AddCell(new PdfPCell(new Phrase($"{product.Element("ClearanceDiscountPercentage").Value}", smallerFont))
                //        { Border = 0, BorderWidthTop = 0.5f, BorderColorTop = BaseColor.LIGHT_GRAY, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });

                //        var clearancePrice = Convert.ToDecimal(product.Element("ClearancePrice").Value).ToString("C2", nfi);
                //        bodyTable.AddCell(new PdfPCell(new Phrase($"{clearancePrice}", smallerFont))
                //        { Border = 0, BorderWidthTop = 0.5f, BorderColorTop = BaseColor.LIGHT_GRAY, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });

                //        //if (product.Element("URL").Value != "")
                //        //{
                //        //    var s = new Anchor($"{product.Element("Stock").Value}", smallerAnchorFont);
                //        //    s.Reference = $"{product.Element("URL").Value}?countryId={countryId}&stock={HttpUtility.UrlEncode(product.Element("Code").Value)}";

                //        //    var stockChunk = new Chunk($"{product.Element("Stock").Value}", smallerAnchorFont);
                //        //    stockChunk.SetAnchor($"{product.Element("URL").Value}?countryId={countryId}&stock={HttpUtility.UrlEncode(product.Element("Code").Value)}");

                //        //    bodyTable.AddCell(new PdfPCell(s)
                //        //    { Border = 0, BorderWidthTop = 0.5f, BorderColorTop = BaseColor.LIGHT_GRAY, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });
                //        //}
                //        //else
                //        //{
                //        //    bodyTable.AddCell(new PdfPCell(new Phrase($"{product.Element("Stock").Value}", smallerFont))
                //        //    { Border = 0, BorderWidthTop = 0.5f, BorderColorTop = BaseColor.LIGHT_GRAY, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });
                //        //}

                //        //bodyTable.AddCell(new PdfPCell(new Phrase($"{product.Element("StockLastChecked").Value}", smallerFont))
                //        //{ Border = 0, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });

                //        var quantityTable = new PdfPTable(1);

                //        quantityTable.WidthPercentage = 100.0f;

                //        quantityTable.DefaultCell.Border = 1;
                //        quantityTable.DefaultCell.BorderWidth = 1;

                //        quantityTable.SetWidths(new float[] { 100.0f });

                //        var bodyCell = new PdfPCell()
                //        {
                //            Border = 0,
                //            BorderWidthTop = 0.5f,
                //            BorderColorTop = BaseColor.LIGHT_GRAY,
                //            HorizontalAlignment = Element.ALIGN_RIGHT,
                //            VerticalAlignment = Element.ALIGN_TOP,
                //            PaddingLeft = 6,
                //            PaddingRight = 0,
                //            PaddingTop = 5,
                //            FixedHeight = 10.0f
                //        };

                //        bodyCell.AddElement(quantityTable);

                //        bodyTable.AddCell(bodyCell);
                //    }

                //    bodyTable.SpacingBefore = 12.0f;
                //    bodyTable.SpacingAfter = 6.0f;

                //    document.Add(bodyTable);

                //    groupTitles.Add(writer.PageNumber, group.Key);

                //    document.NewPage();
                //}

                //document.Add(new Paragraph(new Phrase("Delivery Address", normalFont)));

                //var delAddrTable = new PdfPTable(1);
                //delAddrTable.HorizontalAlignment = Element.ALIGN_LEFT;
                //delAddrTable.SpacingBefore = 6.0f;
                //delAddrTable.SpacingAfter = 12.0f;
                //delAddrTable.WidthPercentage = 65.0f;
                //delAddrTable.DefaultCell.Border = 1;
                //delAddrTable.DefaultCell.BorderWidth = 1;

                //delAddrTable.SetWidths(new float[] { 100.0f });

                //var delAddrCell = new PdfPCell();
                //delAddrCell.FixedHeight = 150.0f;
                //delAddrCell.CellEvent = new EditableCellEvent("deliveryAddress", multiline: true);
                //delAddrTable.AddCell(delAddrCell);

                //document.Add(delAddrTable);

                //document.Add(new Paragraph(new Phrase("Memo", normalFont)));

                //var memoTable = new PdfPTable(1);
                //memoTable.HorizontalAlignment = Element.ALIGN_LEFT;
                //memoTable.SpacingBefore = 6.0f;
                //memoTable.SpacingAfter = 12.0f;
                //memoTable.WidthPercentage = 100.0f;
                //memoTable.DefaultCell.Border = 1;
                //memoTable.DefaultCell.BorderWidth = 1;

                //memoTable.SetWidths(new float[] { 100.0f });

                //var memoCell = new PdfPCell();
                //memoCell.FixedHeight = 512.0f;
                //memoCell.CellEvent = new EditableCellEvent("memo", multiline: true);
                //memoTable.AddCell(memoCell);

                //document.Add(memoTable);


                //foreach (var product in products.Document.Element("Products").Elements("Product"))
                //{
                //    var paddingBottom = 5.0f;

                //    long imageId = -1;

                //    if (Int64.TryParse(product.Element("ImageURL").Value.Replace("https://downloads.designersguild.com/images/", "").Replace(".jpeg", ""), out imageId))
                //    {
                //        var imagePath = urlHelper.RouteUrl("ImageRoutine", new { width = dgFramework.getImageWidth(dgImageSize.marker), imageid = imageId });

                //        var filePath = String.Format($"{System.Web.Configuration.WebConfigurationManager.AppSettings["imagePath"]}\\{156}\\{imageId}.jpeg");

                //        var imageUrl = $"{context.HttpContext.Request.Url.Scheme}://{context.HttpContext.Request.Url.Authority}{imagePath}";
                //        // right great but now that needs calling against our current server base address to get served the image
                //        var jpg = Image.GetInstance(filePath);// (new Uri(imageUrl));

                //        bodyTable.AddCell(new PdfPCell(jpg, true)
                //        { Border = 0, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });
                //    }
                //    else
                //    {
                //        bodyTable.AddCell(new PdfPCell()
                //        { Border = 0, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });
                //    }

                //    //bodyTable.AddCell(new PdfPCell(new Phrase($"{product.Element("ProductType").Value}", smallerFont))
                //    //{ Border = 0, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });

                //    bodyTable.AddCell(new PdfPCell(new Phrase($"{product.Element("Brand").Value}", smallerFont))
                //    { Border = 0, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });

                //    bodyTable.AddCell(new PdfPCell(new Phrase($"{product.Element("Collection").Value}", smallerFont))
                //    { Border = 0, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });

                //    var codeChunk = new Chunk($"{product.Element("Code").Value}", smallerAnchorFont);

                //    codeChunk.SetAnchor(product.Element("URL").Value);

                //    bodyTable.AddCell(new PdfPCell(new Phrase(codeChunk))
                //    { Border = 0, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 8, PaddingTop = 5, PaddingBottom = paddingBottom });

                //    bodyTable.AddCell(new PdfPCell(new Phrase($"{product.Element("Name").Value}", smallerFont))
                //    { Border = 0, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });

                //    //bodyTable.AddCell(new PdfPCell(new Phrase($"{product.Element("URL").Value}", smallerFont))
                //    //{ Border = 0, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });

                //    bodyTable.AddCell(new PdfPCell(new Phrase($"{Convert.ToDecimal(product.Element("ListPrice").Value).ToString("N2")}", smallerFont))
                //    { Border = 0, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });

                //    bodyTable.AddCell(new PdfPCell(new Phrase($"{Convert.ToDecimal(product.Element("ClearancePrice").Value).ToString("N2")}", smallerFont))
                //    { Border = 0, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });

                //    bodyTable.AddCell(new PdfPCell(new Phrase($"{product.Element("ClearanceDiscountPercentage").Value}", smallerFont))
                //    { Border = 0, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });

                //    bodyTable.AddCell(new PdfPCell(new Phrase($"{product.Element("Stock").Value}", smallerFont))
                //    { Border = 0, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });

                //    bodyTable.AddCell(new PdfPCell(new Phrase($"{product.Element("StockLastChecked").Value}", smallerFont))
                //    { Border = 0, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });
                //}

                document.Close();

                output.Position = 0;

                PdfReader reader = new PdfReader(output);

                var stamperStream = new MemoryStream();

                PdfStamper stamper = new PdfStamper(reader, stamperStream);

                var count = reader.NumberOfPages;

                for (var i = 1; i <= count; i++)
                {
                    var c = stamper.GetOverContent(i);

                    var headerTable = new PdfPTable(2);

                    // need to know from groupTitles which subtitle to write.
                    // if we're at page 1, write the 

                    //if (i != count)
                    //{
                    //    var productType = "";

                    //    if (i == 1)
                    //    {
                    //        productType = groupTitles[groupTitles.Min(q => q.Key)];
                    //    }
                    //    else
                    //    {
                    //        // what we want is to discard all those keys who are less than our value, 
                    //        // then take the min from the resultant set.
                    //        productType = groupTitles.Where(q => q.Key == groupTitles.Where(p => p.Key >= i).Min(p => p.Key)).Single().Value;
                    //    }

                        headerTable = GetHeader(
                            dgLogo, 
                            productInfo.Root.Element("tradeAccountCode")?.Value,
                            productInfo.Root.Element("tradeAccountName")?.Value,
                            now, 
                            i, 
                            count,
                            normalFont, 
                            boldFont, 
                            smallerFont, 
                            smallerAnchorFont, 
                            subtitleFont, 
                            "Testing", 
                            "test@ing.com", 
                            "0208 123 4567");
                        headerTable.WriteSelectedRows(0, -1, 25, 812, c);
                    //}

                    footerTable.WriteSelectedRows(0, -1, 25, footerTable.TotalHeight + 30.0f, c);
                    subFooterTable.WriteSelectedRows(0, -1, 40, 24.0f, c);
                }

                stamper.Close();

                reader.Close();

                streams.Add(stamperStream);

                iTextSharp.text.Document finalDocument = new iTextSharp.text.Document();

                PdfCopy copy = new PdfCopy(finalDocument, finalStream);

                copy.CloseStream = false;

                finalDocument.Open();

                foreach (var stream in streams)
                {
                    PdfReader thisReader = new PdfReader(stream.ToArray());

                    for (var i = 0; i < thisReader.NumberOfPages; i++)
                    {
                        copy.AddPage(copy.GetImportedPage(thisReader, i + 1));
                    }

                    copy.FreeReader(thisReader);
                    thisReader.Close();
                }

                copy.Close();

                finalDocument.Close();

                dgImage.Dispose();

                stopWatch.Stop();

                System.Diagnostics.Debug.WriteLine($"Processing Bespoke Furniture PDF took {stopWatch.Elapsed}");

                response.ContentType = "application/pdf";
                response.Buffer = false;
                response.Clear();
                response.OutputStream.Write(finalStream.GetBuffer(), 0, finalStream.GetBuffer().Length);
                response.OutputStream.Flush();
                response.End();
                finalStream.Close();
            }
            catch (Exception)
            {
                throw;
            }
        }

        internal static PdfPTable GetHeader(Image logo, string tradeAccountCode, string tradeAccountName, DateTime date, int x, int y, Font normal, Font bold, Font smaller, Font smallerAnchorFont, Font subtitle,
            string salesRepName, string salesRepEmail, string customerServicesPhone)
        {
            int[] columnWidths = new int[] { 100, 100, 130, 100, 70, 100, 100, 80, 100 };

            PdfPTable HeaderTable = new PdfPTable(2);
            //HeaderTable.SetWidths(new float[] { logo.ScaledWidth, 545 - logo.ScaledWidth });
            HeaderTable.SetWidths(new float[] { 360, 185 });
            HeaderTable.TotalWidth = 545.0f;

            // you add chunks to phrases and phrases to paragraphs.
            // you add new lines in chunks? and hope the paragraph can sort itself out?
            // if you don't use Cell.AddElement, the Paragraph that you're adding will take on the properties of the Cell and lose its own.
            // this is because it is "reduced to a phrase".

            var LeftHeaderCell = new PdfPCell();
            var RightHeaderCell = new PdfPCell();

            LeftHeaderCell.Padding = 0;
            LeftHeaderCell.Border = 0;
            LeftHeaderCell.AddElement(logo);

            // must display the words PROFORMA INVOICE nice and big at the top.
            // paragraphs have phrases which have chunks
            var clearancePara = new Paragraph();
            var clearancePhrase = new Phrase();
            var clearanceChunk = new Chunk($"FURNITURE QUOTE", subtitle);
            clearancePara.SpacingBefore = 8.0f;
            clearancePara.SpacingAfter = 0.0f;
            clearancePhrase.Add(clearanceChunk);
            clearancePara.Add(clearancePhrase);
            LeftHeaderCell.AddElement(clearancePara);


            // must display the words PROFORMA INVOICE nice and big at the top.
            // paragraphs have phrases which have chunks
            var tradeAccountPara = new Paragraph();
            var tradeAccountPhrase = new Phrase();
            var tradeAccountChunk = new Chunk($"Your Account: {tradeAccountCode} - {tradeAccountName}", normal);
            tradeAccountPara.SpacingBefore = 2.0f;
            tradeAccountPara.SpacingAfter = 0.0f;
            tradeAccountPhrase.Add(tradeAccountChunk);
            tradeAccountPara.Add(tradeAccountPhrase);
            LeftHeaderCell.AddElement(tradeAccountPara);




            RightHeaderCell.Padding = 0;
            RightHeaderCell.HorizontalAlignment = Element.ALIGN_RIGHT;
            RightHeaderCell.Border = 0;

            HeaderTable.AddCell(LeftHeaderCell);

            PdfPTable RightTable = new PdfPTable(1);
            RightTable.WidthPercentage = 100.0f;
            RightTable.DefaultCell.HorizontalAlignment = Element.ALIGN_RIGHT;

            var RightParagraph = new Paragraph();
            RightParagraph.Alignment = Element.ALIGN_RIGHT;

            var DateChunk = new Chunk($"Quotation Generated: {date.ToString("dd/MM/yyyy")}\n", normal);
            var DatePhrase = new Phrase();
            DatePhrase.Add(DateChunk);
            RightParagraph.Add(DatePhrase);

            RightParagraph.Add(new Phrase($"Page {x} of {y}\n", normal));

            if (salesRepEmail != null)
            {
                var csChunk = new Chunk($"Order Line & Customer Service: {customerServicesPhone}\n", smaller);
                var csPhrase = new Phrase();
                csPhrase.Add(csChunk);
                RightParagraph.Add(csPhrase);

                RightParagraph.Add(new Phrase($"Sales Representative: {salesRepName}\n", smaller));

                var a = new Anchor($"{salesRepEmail}\n", smallerAnchorFont);
                a.Reference = $"mailto:{salesRepEmail}";
                RightParagraph.Add(a);
            }

            PdfPCell RightCell = new PdfPCell();

            RightCell.Border = 0;
            RightCell.Padding = 0;

            RightCell.UseAscender = true;

            RightCell.AddElement(RightParagraph);

            RightTable.AddCell(RightCell);

            RightHeaderCell.AddElement(RightTable);

            HeaderTable.AddCell(RightHeaderCell);

            //var bodyTableHeaderCell = new PdfPCell() { Colspan = 2 };

            //bodyTableHeaderCell.Border = 0;
            //bodyTableHeaderCell.Padding = 0;
            //bodyTableHeaderCell.PaddingTop = 12.0f;

            //var bodyTableHeader = new PdfPTable(columnWidths.Count());

            //bodyTableHeader.WidthPercentage = 100.0f;

            //bodyTableHeader.SetWidths(columnWidths);

            //bodyTableHeader.AddCell(new PdfPCell()
            //{ Border = 0, BorderWidthTop = 1, BorderWidthBottom = 1, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 3, PaddingBottom = 6 });

            ////bodyTableHeader.AddCell(new PdfPCell(new Phrase($"Product Type", bold))
            ////{ Border = 0, BorderWidthTop = 1, BorderWidthBottom = 1, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 3, PaddingBottom = 6 });

            //bodyTableHeader.AddCell(new PdfPCell(new Phrase($"Brand", bold))
            //{ Border = 0, BorderWidthTop = 1, BorderWidthBottom = 1, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 3, PaddingBottom = 6 });

            ////bodyTableHeader.AddCell(new PdfPCell(new Phrase($"Collection", bold))
            ////{ Border = 0, BorderWidthTop = 1, BorderWidthBottom = 1, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 3, PaddingBottom = 6 });

            //bodyTableHeader.AddCell(new PdfPCell(new Phrase($"Code", bold))
            //{ Border = 0, BorderWidthTop = 1, BorderWidthBottom = 1, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 3, PaddingBottom = 6 });

            //bodyTableHeader.AddCell(new PdfPCell(new Phrase($"Name", bold))
            //{ Border = 0, BorderWidthTop = 1, BorderWidthBottom = 1, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 3, PaddingBottom = 6 });

            //bodyTableHeader.AddCell(new PdfPCell(new Phrase($"Trade Price Ex. VAT", bold))
            //{ Border = 0, BorderWidthTop = 1, BorderWidthBottom = 1, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 3, PaddingBottom = 6 });

            //bodyTableHeader.AddCell(new PdfPCell(new Phrase($"Clearance Discount", bold))
            //{ Border = 0, BorderWidthTop = 1, BorderWidthBottom = 1, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 3, PaddingBottom = 6 });

            //bodyTableHeader.AddCell(new PdfPCell(new Phrase($"Trade Clearance Price Ex. VAT", bold))
            //{ Border = 0, BorderWidthTop = 1, BorderWidthBottom = 1, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 3, PaddingBottom = 6 });

            //bodyTableHeader.AddCell(new PdfPCell(new Phrase($"Stock Available", bold))
            //{ Border = 0, BorderWidthTop = 1, BorderWidthBottom = 1, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 3, PaddingBottom = 6 });

            ////bodyTableHeader.AddCell(new PdfPCell(new Phrase($"Stock Checked", bold))
            ////{ Border = 0, BorderWidthTop = 1, BorderWidthBottom = 1, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 3, PaddingBottom = 6 });

            //bodyTableHeader.AddCell(new PdfPCell(new Phrase($"Order Quantity", bold))
            //{ Border = 0, BorderWidthTop = 1, BorderWidthBottom = 1, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 3, PaddingBottom = 6 });

            //bodyTableHeaderCell.AddElement(bodyTableHeader);

            //HeaderTable.AddCell(bodyTableHeaderCell);

            return HeaderTable;
        }
    }
}