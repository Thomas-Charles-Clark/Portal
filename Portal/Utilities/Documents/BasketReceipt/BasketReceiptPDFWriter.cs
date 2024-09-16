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
using SharedEFClasses.Models.Orders;
using System.Text.RegularExpressions;
using Resources;

namespace Portal.Utilities.Basket
{
    public static class BasketReceiptPDFWriter
    {
        public static MemoryStream GenerateReceipt(string rootPath, BasketReceipt basket)
        {
            var stopWatch = new System.Diagnostics.Stopwatch();

            var finalStream = new MemoryStream();

            BaseFont gillSansMt = BaseFont.CreateFont(rootPath + "Content/fonts/Gill-Sans-MT.ttf", BaseFont.CP1252, BaseFont.EMBEDDED);

            stopWatch.Start();

            System.Globalization.NumberFormatInfo nfi = new System.Globalization.CultureInfo("en-GB").NumberFormat;

            var orderHeads = basket.OrderHeads;

            iTextSharp.text.Font normalFont = new Font(gillSansMt, 10, Font.NORMAL, BaseColor.BLACK);
            //FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.NORMAL, BaseColor.BLACK);
            iTextSharp.text.Font smallerFont = new Font(gillSansMt, 9, Font.NORMAL, BaseColor.BLACK);
            //FontFactory.GetFont("Arial", 9, iTextSharp.text.Font.NORMAL, BaseColor.BLACK);
            iTextSharp.text.Font smallerItalicFont = FontFactory.GetFont("Arial", 9, iTextSharp.text.Font.ITALIC, BaseColor.BLACK);
            iTextSharp.text.Font boldFont = FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.BOLD, BaseColor.BLACK);
            iTextSharp.text.Font footerNormalFont = FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL, BaseColor.BLACK);
            iTextSharp.text.Font footerBoldFont = FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD, BaseColor.BLACK);

            System.Drawing.Image dgImage = System.Drawing.Image.FromFile(AppDomain.CurrentDomain.BaseDirectory + "/Content/Images/Logos/designers-guild.jpg");

            Image dgLogo = Image.GetInstance(dgImage, System.Drawing.Imaging.ImageFormat.Jpeg);
            dgLogo.ScaleAbsolute(280.0f, 21.0f);

            List<MemoryStream> streams = new List<MemoryStream>();

            var payments = basket.Payments;

            var counter = 0;

            foreach (var orderHead in orderHeads.OrderBy(p => p.OrderHeadID))
            {
                var output = new MemoryStream();

                var footerTable = new PdfPTable(1);

                footerTable.TotalWidth = 545.0f;
                footerTable.LockedWidth = true;
                footerTable.DefaultCell.Border = 0;
                footerTable.DefaultCell.Padding = 3;
                footerTable.DefaultCell.BorderWidth = 0;
                footerTable.DefaultCell.VerticalAlignment = Element.ALIGN_TOP;
                footerTable.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;

                if (!String.IsNullOrEmpty(orderHead.FooterText))
                {
                    var footerParagraphs = ProcessTextBlock(orderHead.FooterText, normalFont, boldFont);

                    var footerParagraphWrapper = new Paragraph();

                    footerParagraphWrapper.SpacingAfter = 10.0f;

                    foreach (var p in footerParagraphs)
                    {
                        footerParagraphWrapper.Add(p);
                    }

                    var footerCell = new PdfPCell();

                    footerCell.Border = 0;
                    footerCell.Padding = 0;
                    footerCell.PaddingBottom = 10.0f;

                    footerCell.AddElement(footerParagraphWrapper);

                    footerTable.AddCell(footerCell);
                }

                var secondaryFooterTable = new PdfPTable(1);

                secondaryFooterTable.WidthPercentage = 100.0f;
                secondaryFooterTable.SetWidths(new float[] { 100.0f });// 70.0f, 30.0f });

                var secondaryFooterTableLeftCell = new PdfPCell();

                secondaryFooterTableLeftCell.Border = 0;
                secondaryFooterTableLeftCell.Padding = 0;
                secondaryFooterTableLeftCell.UseAscender = true;

                var openingTimesLabel = new Chunk($"Opening Times: ", boldFont);
                var openingTimes = new Chunk($"[Closed - COVID]\n", normalFont);
                var footerAddressLabel = new Chunk($"Address: ", boldFont);
                var footerAddress = new Chunk($"{orderHead.FooterAddress} - ", normalFont);
                var emailLabel = new Chunk($"{Receipts.EmailLabel} ", boldFont);
                var email = new Chunk($"{orderHead.FooterEmail}", normalFont);
                var phoneLabel = new Chunk($"  {Receipts.PhoneLabel} ", boldFont);
                var phone = new Chunk($"{orderHead.FooterPhone}", normalFont);
                var vatLabel = new Chunk($"{Receipts.VATLabel} ", boldFont);
                var vat = new Chunk($"{orderHead.FooterVATCode}\n", normalFont);

                var secondaryFooterTableLeftCellPhrase = new Phrase();
                var secondaryFooterTableLeftCellParagraph = new Paragraph();

                secondaryFooterTableLeftCellPhrase.Add(footerAddressLabel);
                secondaryFooterTableLeftCellPhrase.Add(footerAddress);
                secondaryFooterTableLeftCellPhrase.Add(vatLabel);
                secondaryFooterTableLeftCellPhrase.Add(vat);
                secondaryFooterTableLeftCellPhrase.Add(openingTimesLabel);
                secondaryFooterTableLeftCellPhrase.Add(openingTimes);
                secondaryFooterTableLeftCellPhrase.Add(emailLabel);
                secondaryFooterTableLeftCellPhrase.Add(email);
                secondaryFooterTableLeftCellPhrase.Add(phoneLabel);
                secondaryFooterTableLeftCellPhrase.Add(phone);

                secondaryFooterTableLeftCellParagraph.Add(secondaryFooterTableLeftCellPhrase);

                secondaryFooterTableLeftCell.AddElement(secondaryFooterTableLeftCellParagraph);

                secondaryFooterTable.AddCell(secondaryFooterTableLeftCell);

                //var secondaryFooterTableRightCell = new PdfPCell();
                //secondaryFooterTableRightCell.Border = 0;
                //secondaryFooterTableRightCell.Padding = 0;
                //secondaryFooterTableRightCell.UseAscender = true;

                //var secondaryFooterTableRightCellPhrase = new Phrase();
                //var secondaryFooterTableRightCellParagraph = new Paragraph();

                //secondaryFooterTableRightCellPhrase.Add(phoneLabel);
                //secondaryFooterTableRightCellPhrase.Add(phone);

                //secondaryFooterTableRightCellParagraph.Add(secondaryFooterTableRightCellPhrase);

                //secondaryFooterTableRightCell.AddElement(secondaryFooterTableRightCellParagraph);

                //secondaryFooterTable.AddCell(secondaryFooterTableRightCell);

                var footerTableBottom = new PdfPCell();

                footerTableBottom.Padding = 0;
                footerTableBottom.Border = 0;

                footerTableBottom.AddElement(secondaryFooterTable);

                footerTable.AddCell(footerTableBottom);

                // right so.
                // we have a top margin which is 25.0

                // we have the header table height which is 40.0

                // we may or may not have some header text = X

                // we may or may not have some marketing text = Y

                // we have spacing between them


                // we then have lines!

                // lines which can be of a certain height... we could do with making the font size just a piece lower so they all fit on one row?

                var headingParagraphs = ProcessTextBlock(orderHead.HeaderText, normalFont, boldFont);

                var marketingParagraphs = ProcessTextBlock(orderHead.MarketingText, normalFont, boldFont);

                var headingParagraphWrapper = new Paragraph();

                headingParagraphWrapper.SpacingAfter = 10.0f;

                var marketingParagraphWrapper = new Paragraph();

                marketingParagraphWrapper.SpacingAfter = 0.0f;
                marketingParagraphWrapper.SpacingBefore = 10.0f;

                foreach (var p in headingParagraphs)
                {
                    headingParagraphWrapper.Add(p);
                }

                Paragraph referenceParagraph = null;

                if (!String.IsNullOrEmpty(orderHead.CustomerOrderReference))
                {
                    referenceParagraph = new Paragraph();
                    referenceParagraph.SpacingBefore = 0.0f;
                    referenceParagraph.SpacingAfter = 10.0f;
                    var referencePhrase = new Phrase();
                    var referenceChunk = new Chunk($"{Receipts.ReferenceLabel} ", boldFont);
                    var orderRefChunk = new Chunk($"{orderHead.CustomerOrderReference}", normalFont);
                    referencePhrase.Add(referenceChunk);
                    referencePhrase.Add(orderRefChunk);
                    referenceParagraph.Add(referencePhrase);
                }

                var paymentParagraph = new Paragraph();
                paymentParagraph.SpacingBefore = 0.0f;
                paymentParagraph.SpacingAfter = 10.0f;

                var paymentsString = String.Join(", ", payments.Select(p => $"{p.PaymentTypeName}: {p.PaymentAmount.ToString("C2", nfi)}").ToArray());

                var orderNumbersString = String.Join(", ", orderHeads.Select(p => $"{p.OrderHeadID}").ToArray());

                var paymentPhrase = new Phrase();
                var orderHeadCount = orderHeads.Count;

                var ordersPlacedString = "";

                if (orderHeadCount > 1)
                {
                    ordersPlacedString = $"{Receipts.YouPlaced} {orderHeadCount} {Receipts.Orders} {Receipts.Today} ";
                }
                else
                {
                    ordersPlacedString = $"{Receipts.YouPlaced} {orderHeadCount} {Receipts.Order} {Receipts.Today} ";
                }

                var youPlacedChunk = new Chunk(ordersPlacedString, boldFont);

                var orderNumbersChunk = new Chunk($"({orderNumbersString}).\r\n", normalFont);

                var paidWithChunk = new Chunk($"{Receipts.YouPaidWith} ", boldFont);
                var paymentMethodsChunk = new Chunk($"{paymentsString}", normalFont);

                paymentPhrase.Add(youPlacedChunk);
                paymentPhrase.Add(orderNumbersChunk);
                paymentPhrase.Add(paidWithChunk);
                paymentPhrase.Add(paymentMethodsChunk);

                paymentParagraph.Add(paymentPhrase);

                foreach (var m in marketingParagraphs)
                {
                    marketingParagraphWrapper.Add(m);
                }

                var document = new iTextSharp.text.Document(PageSize.A4, 25, 25, 80, 25);// footerTable.TotalHeight + 30.0f);

                var writer = PdfWriter.GetInstance(document, output);

                PdfPTable headingTable = new PdfPTable(1);
                headingTable.WidthPercentage = 100.0f;
                headingTable.SetWidths(new float[] { 100.0f });
                PdfPCell headingCell = new PdfPCell();
                headingCell.Border = 0;
                headingCell.Padding = 0;
                headingCell.UseAscender = true;



                writer.CloseStream = false;

                document.Open();

                //writer.PageEvent = null;
                //writer.PageEvent = new PDFOrderReceiptFooterWriter(orderHead, footerNormalFont, footerBoldFont);

                var orderLines = basket.OrderLines.Where(p => p.OrderHeadID == orderHead.OrderHeadID).ToList();

                // Right, so we have...  HeadingText thing, which is in my printouts:
                // "Thank you for shopping with Designers Guild.\nThis is your receipt so blah blah blah."

                headingCell.AddElement(headingParagraphWrapper);
                //document.Add(headingParagraphWrapper);

                if (referenceParagraph != null)
                {
                    headingCell.AddElement(referenceParagraph);
                    //document.Add(referenceParagraph);
                }

                headingCell.AddElement(paymentParagraph);
                //document.Add(paymentParagraph);

                if (!orderHead.TradeAccountRetailTill)
                {
                    var accountParagraph = new Paragraph();

                    accountParagraph.SpacingBefore = -5.0f;

                    var orderPlacedOnAccountLabel = new Chunk($"{Receipts.OrderPlacedOnAccountLabel} ", boldFont);
                    var account = new Chunk($"{orderHead.TradeAccountCode} - {orderHead.TradeAccountName}", normalFont);

                    var accountPhrase = new Phrase();

                    accountPhrase.Add(orderPlacedOnAccountLabel);
                    accountPhrase.Add(account);

                    accountParagraph.Add(accountPhrase);

                    headingCell.AddElement(accountParagraph);
                    //document.Add(accountParagraph);
                }

                var displayDeliveryInfo = orderHead.DeliveryAddressRequired;
                var displayDiscountColumn = orderLines.Where(p => p.OrderHeadID == orderHead.OrderHeadID && !String.IsNullOrEmpty(p.DiscountMessage)).Any();

                if (displayDeliveryInfo)
                {
                    var deliveryParagraph = new Paragraph();

                    var addressString =
                                String.Format("{0}{1}{2}{3}{4}{5}{6}",
                                orderHead.FullName + ", ",
                                orderHead.AddressLine1 + ", ",
                                !String.IsNullOrEmpty(orderHead.AddressLine2) ? orderHead.AddressLine2 + ", " : "",
                                !String.IsNullOrEmpty(orderHead.Town) ? orderHead.Town + ", " : "",
                                !String.IsNullOrEmpty(orderHead.County) ? orderHead.County + ", " : "",
                                !String.IsNullOrEmpty(orderHead.Postcode) ? orderHead.Postcode + ", " : "",
                                !String.IsNullOrEmpty(orderHead.CountryCode) ? orderHead.CountryCode : ""
                            );

                    var deliveredToLabel = new Chunk($"{Receipts.DeliveredToLabel} ", boldFont);
                    var deliveredTo = new Chunk($"{addressString}\n", normalFont);
                    var deliveredByLabel = new Chunk($"{Receipts.DeliveredByLabel} ", boldFont);
                    var deliveredBy = new Chunk($"{orderHead.DeliveryService}", normalFont);

                    var deliveryPhrase = new Phrase();

                    deliveryPhrase.Add(deliveredToLabel);
                    deliveryPhrase.Add(deliveredTo);
                    deliveryPhrase.Add(deliveredByLabel);
                    deliveryPhrase.Add(deliveredBy);

                    deliveryParagraph.Add(deliveryPhrase);

                    headingCell.AddElement(deliveryParagraph);
                    //document.Add(deliveryParagraph);
                }

                var displayInvoiceAddress = !orderHead.TradeAccountRetailTill;

                if (displayInvoiceAddress)
                {
                    var invoiceAddressParagraph = new Paragraph();

                    var invoiceAddressString =
                                String.Format("{0}{1}{2}{3}{4}{5}{6}",
                                orderHead.InvoiceAddressFullName + ", ",
                                orderHead.InvoiceAddressLine1 + ", ",
                                !String.IsNullOrEmpty(orderHead.InvoiceAddressLine2) ? orderHead.InvoiceAddressLine2 + ", " : "",
                                !String.IsNullOrEmpty(orderHead.InvoiceAddressTown) ? orderHead.InvoiceAddressTown + ", " : "",
                                !String.IsNullOrEmpty(orderHead.InvoiceAddressCounty) ? orderHead.InvoiceAddressCounty + ", " : "",
                                !String.IsNullOrEmpty(orderHead.InvoiceAddressPostcode) ? orderHead.InvoiceAddressPostcode + ", " : "",
                                !String.IsNullOrEmpty(orderHead.InvoiceAddressCountryCode) ? orderHead.InvoiceAddressCountryCode : ""
                            );

                    var yourInvoiceAddressLabel = new Chunk($"{Receipts.YourInvoiceAddress} ", boldFont);
                    var yourInvoiceAddress = new Chunk($"{invoiceAddressString}", normalFont);

                    var invoiceAddressPhrase = new Phrase();

                    invoiceAddressPhrase.Add(yourInvoiceAddressLabel);
                    invoiceAddressPhrase.Add(yourInvoiceAddress);

                    invoiceAddressParagraph.Add(invoiceAddressPhrase);

                    headingCell.AddElement(invoiceAddressParagraph);
                }

                if (!String.IsNullOrEmpty(orderHead.OrderType))
                {
                    var orderTypeParagraph = new Paragraph();

                    var orderTypeLabel = new Chunk($"{Receipts.OrderTypeLabel} ", boldFont);
                    var orderType = new Chunk($"{orderHead.OrderType}", normalFont);

                    var orderTypePhrase = new Phrase();
                    orderTypePhrase.Add(orderTypeLabel);
                    orderTypePhrase.Add(orderType);

                    orderTypeParagraph.Add(orderTypePhrase);

                    headingCell.AddElement(orderTypeParagraph);
                    //document.Add(orderTypeParagraph);
                }

                headingCell.AddElement(marketingParagraphWrapper);
                //document.Add(marketingParagraphWrapper);

                headingTable.AddCell(headingCell);

                document.Add(headingTable);

                var columnCount = 6;

                var leftColumnSpan = 3;

                var rightColumnSpan = 3;

                var columnWidths = new List<int>();

                if (displayDiscountColumn && displayDeliveryInfo)
                {
                    columnWidths = new List<int>() { 100, 140, 100, 70, 60, 75 }; // 545
                }

                if (!displayDiscountColumn && displayDeliveryInfo)
                {
                    columnCount--;
                    leftColumnSpan = 3;
                    rightColumnSpan = 2;
                    columnWidths = new List<int>() { 100, 185, 100, 70, 90 };
                }

                if (displayDiscountColumn && !displayDeliveryInfo)
                {
                    columnCount--;
                    leftColumnSpan = 3;
                    rightColumnSpan = 2;
                    columnWidths = new List<int>() { 110, 200, 60, 80, 95 };
                }

                if (!displayDiscountColumn && !displayDeliveryInfo)
                {
                    columnCount -= 2;
                    leftColumnSpan = 2;
                    rightColumnSpan = 2;
                    columnWidths = new List<int>() { 100, 275, 70, 90 };
                }

                var bodyTable = new PdfPTable(columnCount);

                bodyTable.WidthPercentage = 100.0f;

                bodyTable.DefaultCell.Border = 0;
                bodyTable.DefaultCell.PaddingLeft = 3;
                bodyTable.DefaultCell.PaddingRight = 3;
                bodyTable.DefaultCell.PaddingTop = 8;
                bodyTable.DefaultCell.PaddingBottom = 8;
                bodyTable.DefaultCell.BorderWidth = 0;
                bodyTable.DefaultCell.VerticalAlignment = Element.ALIGN_TOP;
                bodyTable.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;

                bodyTable.SetWidths(columnWidths.ToArray());

                bodyTable.AddCell(new PdfPCell(new Phrase($"{Receipts.ProductCodeHeading}", boldFont))
                { Border = 0, BorderWidthTop = 1, BorderWidthBottom = 1, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 3, PaddingBottom = 6 });

                bodyTable.AddCell(new PdfPCell(new Phrase($"{Receipts.NameHeading}", boldFont))
                { Border = 0, BorderWidthTop = 1, BorderWidthBottom = 1, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 3, PaddingBottom = 6 });

                if (displayDeliveryInfo)
                {
                    bodyTable.AddCell(new PdfPCell(new Phrase($"{Receipts.EstimatedDispatchDateHeading}", boldFont))
                    { Border = 0, BorderWidthTop = 1, BorderWidthBottom = 1, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 3, PaddingBottom = 6 });
                }

                bodyTable.AddCell(new PdfPCell(new Phrase($"{Receipts.QuantityHeading}", boldFont))
                { Border = 0, BorderWidthTop = 1, BorderWidthBottom = 1, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 3, PaddingBottom = 6 });

                if (displayDiscountColumn)
                {
                    bodyTable.AddCell(new PdfPCell(new Phrase($"{Receipts.DiscountHeading}", boldFont))
                    { Border = 0, BorderWidthTop = 1, BorderWidthBottom = 1, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 3, PaddingBottom = 6 });
                }

                bodyTable.AddCell(new PdfPCell(new Phrase($"{Receipts.PriceIncVATHeading}", boldFont))
                { Border = 0, BorderWidthTop = 1, BorderWidthBottom = 1, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 3, PaddingBottom = 6 });

                bodyTable.HeaderRows = 1;

                foreach (var line in orderLines)
                {
                    var paddingBottom = 5.0f;

                    //if (line == orderLines.Last())
                    //    paddingBottom = 15.0f;

                    bodyTable.AddCell(new PdfPCell(new Phrase($"{line.Code}", smallerFont))
                    { Border = 0, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });

                    bodyTable.AddCell(new PdfPCell(new Phrase($"{line.Name}", smallerFont))
                    { Border = 0, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 8, PaddingTop = 5, PaddingBottom = paddingBottom });

                    if (displayDeliveryInfo)
                    {
                        bodyTable.AddCell(new PdfPCell(new Phrase($"{line.EstimatedDispatchDate?.ToString("ddd dd/MM/yyyy")}", smallerFont))
                        { Border = 0, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 8, PaddingTop = 5, PaddingBottom = paddingBottom });
                    }

                    bodyTable.AddCell(new PdfPCell(new Phrase($"{line.Quantity}", smallerFont))
                    { Border = 0, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });

                    if (displayDiscountColumn)
                    {
                        bodyTable.AddCell(new PdfPCell(new Phrase($"{line.DiscountMessage}", smallerFont))
                        { Border = 0, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });
                    }

                    bodyTable.AddCell(new PdfPCell(new Phrase($"{((line.FinalPriceEx + line.FinalVAT) * line.Quantity).ToString("C2", nfi)}", smallerFont))
                    { Border = 0, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = paddingBottom });
                }

                // We have a discount, we'd like it in slightly smaller font, italic, reading "Includes a promotional discount of X €"....
                //if (orderLines.Select(p => p.TotalDiscountInc).Sum() != 0)
                //{
                //    var promoDisco = Math.Abs(orderLines.Select(p => (p.TotalDiscountInc) * p.Quantity).Sum()).ToString("C2", nfi);

                //    bodyTable.AddCell(new PdfPCell(new Phrase($"Includes a promotional discount of {promoDisco}", smallerItalicFont))
                //    {
                //        Border = 0,
                //        HorizontalAlignment = Element.ALIGN_RIGHT,
                //        VerticalAlignment = Element.ALIGN_MIDDLE,
                //        PaddingLeft = 3,
                //        PaddingRight = 3,
                //        PaddingTop = 5,
                //        PaddingBottom = 8,
                //        Colspan = 5
                //    });
                //}

                var summaryTable = new PdfPTable(columnCount);

                summaryTable.WidthPercentage = 100.0f;

                summaryTable.DefaultCell.Border = 0;
                summaryTable.DefaultCell.PaddingLeft = 3;
                summaryTable.DefaultCell.PaddingRight = 3;
                summaryTable.DefaultCell.PaddingTop = 8;
                summaryTable.DefaultCell.PaddingBottom = 8;
                summaryTable.DefaultCell.BorderWidth = 0;
                summaryTable.DefaultCell.VerticalAlignment = Element.ALIGN_TOP;
                summaryTable.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;

                summaryTable.SetWidths(columnWidths.ToArray());

                summaryTable.KeepTogether = true;

                summaryTable.AddCell(new PdfPCell(new Phrase(" "))
                { Colspan = leftColumnSpan, Border = 0 });

                summaryTable.AddCell(new PdfPCell(new Phrase($"{Receipts.TotalLabel}", boldFont))
                { Colspan = rightColumnSpan - 1, Border = 1, BorderWidthLeft = 0, BorderWidthRight = 0, BorderWidthTop = 1, BorderWidthBottom = 0, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = 0 });

                summaryTable.AddCell(new PdfPCell(new Phrase($"{(orderLines.Select(p => (p.FinalVAT + p.FinalPriceEx) * p.Quantity).Sum()).ToString("C2", nfi)}", normalFont))
                { Border = 1, BorderWidthLeft = 0, BorderWidthRight = 0, BorderWidthTop = 1, BorderWidthBottom = 0, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = 0 });

                if (orderHead.CarriagePriceInc != 0)
                {
                    summaryTable.AddCell(new PdfPCell(new Phrase(" "))
                    { Colspan = leftColumnSpan, Border = 0 });

                    summaryTable.AddCell(new PdfPCell(new Phrase($"{Receipts.DeliveryLabel}", boldFont))
                    { Colspan = rightColumnSpan - 1, Border = 1, BorderWidthLeft = 0, BorderWidthRight = 0, BorderWidthTop = 0, BorderWidthBottom = 0, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = 0 });

                    summaryTable.AddCell(new PdfPCell(new Phrase($"{orderHead.CarriagePriceInc.ToString("C2", nfi)}", normalFont))
                    { Border = 1, BorderWidthLeft = 0, BorderWidthRight = 0, BorderWidthTop = 0, BorderWidthBottom = 0, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = 0 });
                }

                summaryTable.AddCell(new PdfPCell(new Phrase(" "))
                { Colspan = leftColumnSpan, Border = 0 });

                summaryTable.AddCell(new PdfPCell(new Phrase($"{Receipts.GrandTotalLabel}", boldFont))
                { Colspan = rightColumnSpan - 1, Border = 1, BorderWidthLeft = 0, BorderWidthRight = 0, BorderWidthTop = 0, BorderWidthBottom = 1, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = 5 });

                summaryTable.AddCell(new PdfPCell(new Phrase($"{(orderLines.Select(p => (p.FinalVAT + p.FinalPriceEx) * p.Quantity).Sum() + orderHead.CarriagePriceInc).ToString("C2", nfi)}", normalFont))
                { Border = 1, BorderWidthLeft = 0, BorderWidthRight = 0, BorderWidthTop = 0, BorderWidthBottom = 1, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = 5 });

                //summaryTable.AddCell(new PdfPCell(new Phrase(" "))
                //{ Colspan = rightColumnSpan + leftColumnSpan, Border = 0, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = 5 });

                //summaryTable.AddCell(new PdfPCell(new Phrase(""))
                //{ Colspan = leftColumnSpan, Border = 0, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = 5 });

                //summaryTable.AddCell(new PdfPCell(new Phrase(""))
                //{ Colspan = rightColumnSpan, Border = 1, BorderWidthLeft = 0, BorderWidthRight = 0, BorderWidthTop = 0, BorderWidthBottom = 1, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = 5 });

                summaryTable.AddCell(new PdfPCell(new Phrase(" "))
                { Colspan = leftColumnSpan, Border = 0 });

                summaryTable.AddCell(new PdfPCell(new Phrase($"{Receipts.VATSummaryHeading}", boldFont))
                { Colspan = rightColumnSpan, Border = 1, BorderWidthLeft = 0, BorderWidthRight = 0, BorderWidthTop = 0, BorderWidthBottom = 0, HorizontalAlignment = Element.ALIGN_LEFT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 16, PaddingBottom = 5 });

                //summaryTable.AddCell(new PdfPCell(new Phrase(" "))
                //{ Colspan = leftColumnSpan + rightColumnSpan, Border = 0, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 0, PaddingBottom = 0 });

                var vatSummaryTable = new PdfPTable(2);
                vatSummaryTable.WidthPercentage = 100.0f;
                vatSummaryTable.SetWidths(new float[] { 65.0f, 35.0f });

                var vatSummaryLabelCell = new PdfPCell();
                vatSummaryLabelCell.UseAscender = true;
                vatSummaryLabelCell.Padding = 0;
                vatSummaryLabelCell.Border = 0;

                var vatSummaryLabelParagraph = new Paragraph();
                vatSummaryLabelParagraph.Add(new Phrase($"{Receipts.VATRate}\n", boldFont));
                vatSummaryLabelParagraph.Add(new Phrase($"{Receipts.TotalExcludingVAT}\n", boldFont));
                vatSummaryLabelParagraph.Add(new Phrase($"{Receipts.VAT}\n", boldFont));
                vatSummaryLabelParagraph.Add(new Phrase($"{Receipts.TotalIncludingVAT}", boldFont));

                vatSummaryLabelCell.AddElement(vatSummaryLabelParagraph);

                var vatSummaryValuesCell = new PdfPCell();
                vatSummaryValuesCell.UseAscender = true;
                vatSummaryValuesCell.Padding = 0;
                vatSummaryValuesCell.Border = 0;
                vatSummaryValuesCell.HorizontalAlignment = Element.ALIGN_RIGHT;

                var vatSummaryValueParagraph = new Paragraph();
                vatSummaryValueParagraph.Alignment = Element.ALIGN_RIGHT;
                vatSummaryValueParagraph.Add(new Phrase($"{orderLines.First().VATRate.ToString("F2", nfi)} %\n", normalFont));
                vatSummaryValueParagraph.Add(new Phrase($"{(orderLines.Select(p => p.FinalPriceEx * p.Quantity).Sum() + orderHead.CarriagePriceEx).ToString("C2", nfi)}\n", normalFont));
                vatSummaryValueParagraph.Add(new Phrase($"{(orderLines.Select(p => p.FinalVAT * p.Quantity).Sum() + orderHead.CarriageVAT).ToString("C2", nfi)}\n", normalFont));
                vatSummaryValueParagraph.Add(new Phrase($"{(orderLines.Select(p => p.FinalPriceInc * p.Quantity).Sum() + orderHead.CarriagePriceInc).ToString("C2", nfi)}", normalFont));

                vatSummaryValuesCell.AddElement(vatSummaryValueParagraph);

                vatSummaryTable.AddCell(vatSummaryLabelCell);

                vatSummaryTable.AddCell(vatSummaryValuesCell);

                var summaryTableVATCell = new PdfPCell();
                summaryTableVATCell.Colspan = displayDiscountColumn ? 3 : 2;
                summaryTableVATCell.Padding = 0;
                summaryTableVATCell.Border = 0;

                summaryTableVATCell.AddElement(vatSummaryTable);

                //summaryTable.AddCell("Potato");
                //summaryTable.AddCell("Biscuit");

                summaryTable.AddCell(new PdfPCell(new Phrase(""))
                { Colspan = leftColumnSpan, Border = 0, BorderWidthLeft = 0, BorderWidthRight = 0, BorderWidthTop = 0, BorderWidthBottom = 0, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = 5 });
                summaryTable.AddCell(new PdfPCell(vatSummaryTable)
                { Colspan = rightColumnSpan, Border = 1, BorderWidthLeft = 1, BorderWidthRight = 1, BorderWidthTop = 1, BorderWidthBottom = 1, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = 5 });

                //bodyTable.AddCell(new PdfPCell(new Phrase(""))
                //{ Colspan = 3, Border = 0, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = 5 });

                //bodyTable.AddCell(new PdfPCell(vatSummaryTable)
                //{ Colspan = 3, Border = 1, BorderWidthLeft = 1, BorderWidthRight = 1, BorderWidthTop = 1, BorderWidthBottom = 1, HorizontalAlignment = Element.ALIGN_RIGHT, VerticalAlignment = Element.ALIGN_TOP, PaddingLeft = 3, PaddingRight = 3, PaddingTop = 5, PaddingBottom = 5 });

                summaryTable.SpacingBefore = 12.0f;

                bodyTable.SpacingBefore = 12.0f;
                bodyTable.SpacingAfter = 6.0f;

                document.Add(bodyTable);

                document.Add(summaryTable);

                //document.Add(vatSummaryTable); // this displays my vatSummaryTable, so there's no problem with it not containing data... so why does it not display in my summaryTable.

                document.Close();

                output.Position = 0; // reset the current orderHead stream to position 0

                PdfReader orderHeadReader = new PdfReader(output); // create a reader on this orderHead stream

                var orderHeadStamperStream = new MemoryStream(); // create a stream for the stamping

                PdfStamper orderHeadStamper = new PdfStamper(orderHeadReader, orderHeadStamperStream); // create a stamper reading output using stamperStream

                var orderHeadPages = orderHeadReader.NumberOfPages;

                for (var i = 1; i <= orderHeadPages; i++) // for each page found in reader
                {
                    counter++;

                    var c = orderHeadStamper.GetOverContent(i); // get the page

                    var headerTable = new PdfPTable(2);

                    headerTable = GetReceiptHeaderTable(dgLogo, orderHead.OrderHeadID, orderHead.CreatedDT, i, orderHeadPages, normalFont, boldFont);
                    headerTable.WriteSelectedRows(0, -1, 25, 812, c); // write stuff to it

                    if (i == orderHeadPages) // last page
                    {
                        footerTable.WriteSelectedRows(0, -1, 25, footerTable.TotalHeight + 30.0f, c); // write more stuff to it
                    }
                }

                orderHeadStamper.Close(); // close the stamper

                orderHeadReader.Close(); // close the reader

                streams.Add(orderHeadStamperStream); // the stamper stream now has the combination of output and stamping
            }

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

            finalStream.Position = 0; // reset the finalStream to position 0

            PdfReader reader = new PdfReader(finalStream); // create a reader on this finalStream

            var stamperStream = new MemoryStream(); // create a stream for the stamping

            PdfStamper stamper = new PdfStamper(reader, stamperStream); // create a stamper reading output using stamperStream

            var count = reader.NumberOfPages; // for all the pages in the final document...

            for (var i = 1; i <= count; i++) // for each page found in reader
            {
                counter++;

                var c = stamper.GetOverContent(i); // get the page

                var headerTable = new PdfPTable(2);

                headerTable = GetPageNumberTable(dgLogo, i, count, normalFont, boldFont);
                headerTable.WriteSelectedRows(0, -1, 25, 812, c); // write stuff to it
            }

            stamper.Close(); // close the stamper

            reader.Close(); // close the reader

            dgImage.Dispose();

            stopWatch.Stop();

            System.Diagnostics.Debug.WriteLine($"Processing Basket Receipt PDF took {stopWatch.Elapsed}");

            finalStream.Close();

            return stamperStream;
        }

        internal static ICollection<Paragraph> ProcessTextBlock(string textBlock, iTextSharp.text.Font normal, iTextSharp.text.Font bold)
        {
            var boldTagOpen = "{b}";
            var boldTagClose = "{/b}";

            List<Paragraph> result = new List<Paragraph>();

            if (!String.IsNullOrEmpty(textBlock))
            {
                textBlock = textBlock.Replace("\t", "");

                string[] lines = textBlock.Split(new string[] { Environment.NewLine }, StringSplitOptions.None);

                for (var i = 0; i < lines.Length; i++)
                {
                    var line = lines[i];

                    // right... how do we parse for smart tags then, smartguy?

                    // each line will be formed of one or more Chunks.

                    // REGEX to the rescue!

                    var boldOpenings = Regex.Matches(line, "{b}").Count;

                    List<Chunk> chunks = new List<Chunk>();

                    while (line.Length > 0) // we'll have to loop to know when we've parsed the whole line; might as well parse it destructively
                    {
                        var boldTagStart = line.IndexOf(boldTagOpen);
                        var boldTagEnd = line.IndexOf(boldTagClose);

                        if (boldTagStart > -1)
                        {
                            // we have a bold tag in our line
                            if (boldTagEnd > boldTagStart)
                            {
                                // we have a bold tag end, further along in our line than the start. valid bold tag. parse it into a new, bold chunk.

                                // does our bold tag start at the start of the line? if not, we'll have some normal text to put into a chunk first.

                                //if (boldTagStart > 0)
                                //{
                                var subString = line.Substring(0, boldTagStart);

                                line = line.Substring(boldTagStart);

                                Chunk c = new Chunk(subString, normal);

                                chunks.Add(c);

                                boldTagEnd = line.IndexOf("{/b}");

                                var boldString = line.Substring(boldTagOpen.Length, boldTagEnd - boldTagClose.Length + 1);

                                Chunk b = new Chunk(boldString, bold);

                                chunks.Add(b);

                                line = line.Substring(boldString.Length + boldTagOpen.Length + boldTagClose.Length);
                                //}
                                //else
                                //{
                                //    // our bold tag starts right at the start of the line, begin consumption into a bold chunk.

                                //}
                            }
                            else
                            {
                                // we have some positioning error with our bold start and end tags (at least the first ones). Ignore all of them and consume the line.
                                Chunk c = new Chunk(line, normal);
                                chunks.Add(c);
                                line = "";
                            }
                        }
                        else
                        {
                            // we have no bold tag, turn this line directly into a chunk and add it to the list.
                            // remember to set the length to 0 so our while loop ends.
                            Chunk c = new Chunk(line, normal);
                            chunks.Add(c);
                            line = "";
                        }

                    } // as long as we remember to actually destroy it as we go

                    var phrase = new Phrase();

                    foreach (var c in chunks)
                    {
                        phrase.Add(c);
                    }

                    var paragraph = new Paragraph();

                    paragraph.SpacingBefore = 0.0f;
                    paragraph.SpacingAfter = 10.0f;

                    paragraph.Add(phrase);

                    result.Add(paragraph);
                }
            }

            return result;
        }

        internal static PdfPTable GetReceiptHeaderTable(Image logo, int orderId, DateTime date, int x, int y, iTextSharp.text.Font normal, iTextSharp.text.Font bold)
        {
            PdfPTable HeaderTable = new PdfPTable(2);
            HeaderTable.SetWidths(new float[] { logo.ScaledWidth, 545 - logo.ScaledWidth });
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

            RightHeaderCell.Padding = 0;
            RightHeaderCell.HorizontalAlignment = Element.ALIGN_RIGHT;
            RightHeaderCell.Border = 0;

            HeaderTable.AddCell(LeftHeaderCell);

            PdfPTable RightTable = new PdfPTable(1);
            RightTable.WidthPercentage = 100.0f;
            RightTable.DefaultCell.HorizontalAlignment = Element.ALIGN_RIGHT;

            var RightParagraph = new Paragraph();
            RightParagraph.SpacingBefore = 10.0f;
            RightParagraph.Alignment = Element.ALIGN_RIGHT;

            var OrderLabelChunk = new Chunk($"{Receipts.OrderNumberLabel} ", bold);
            //var orderIdSplitIntoThrees = String.Join(" ", CustomExtensions.Split(orderId.ToString(), 3).ToArray());
            var OrderIDChunk = new Chunk($"{orderId} ({Receipts.PageLabel} {x} {Receipts.Of} {y})", normal);
            var OrderNumberPhrase = new Phrase();
            OrderNumberPhrase.Add(OrderLabelChunk);
            OrderNumberPhrase.Add(OrderIDChunk);

            var DateLabelChunk = new Chunk($"{Receipts.OrderDateLabel} ", bold);
            var DateChunk = new Chunk($"{date.ToString("dd/MM/yyyy")}\n", normal);
            var DatePhrase = new Phrase();
            DatePhrase.Add(new Chunk("\n", normal));
            DatePhrase.Add(DateLabelChunk);
            DatePhrase.Add(DateChunk);

            RightParagraph.Add(DatePhrase);

            RightParagraph.Add(OrderNumberPhrase);

            //RightParagraph.Add(new Phrase($"{Receipts.PageLabel} {x} {Receipts.Of} {y}", normal));

            PdfPCell RightCell = new PdfPCell();

            RightCell.Border = 0;
            RightCell.Padding = 0;

            RightCell.UseAscender = true;

            RightCell.AddElement(RightParagraph);

            RightTable.AddCell(RightCell);

            RightHeaderCell.AddElement(RightTable);

            HeaderTable.AddCell(RightHeaderCell);

            return HeaderTable;
        }

        internal static PdfPTable GetPageNumberTable(Image logo, int x, int y, iTextSharp.text.Font normal, iTextSharp.text.Font bold)
        {
            PdfPTable HeaderTable = new PdfPTable(2);
            HeaderTable.SetWidths(new float[] { logo.ScaledWidth, 545 - logo.ScaledWidth });
            HeaderTable.TotalWidth = 545.0f;

            // you add chunks to phrases and phrases to paragraphs.
            // you add new lines in chunks? and hope the paragraph can sort itself out?
            // if you don't use Cell.AddElement, the Paragraph that you're adding will take on the properties of the Cell and lose its own.
            // this is because it is "reduced to a phrase".

            var LeftHeaderCell = new PdfPCell();
            var RightHeaderCell = new PdfPCell();

            LeftHeaderCell.Padding = 0;
            LeftHeaderCell.Border = 0;
            //LeftHeaderCell.AddElement(logo);

            RightHeaderCell.Padding = 0;
            RightHeaderCell.HorizontalAlignment = Element.ALIGN_RIGHT;
            RightHeaderCell.Border = 0;

            HeaderTable.AddCell(LeftHeaderCell);

            PdfPTable RightTable = new PdfPTable(1);
            RightTable.WidthPercentage = 100.0f;
            RightTable.DefaultCell.HorizontalAlignment = Element.ALIGN_RIGHT;

            var RightParagraph = new Paragraph();
            RightParagraph.Alignment = Element.ALIGN_RIGHT;

            var PageLabelChunk = new Chunk($"{Receipts.ReceiptLabel}: ", bold);
            var PageNumberChunk = new Chunk($"{x} {Receipts.Of} {y}\n", normal);
            var PageNumberPhrase = new Phrase();
            PageNumberPhrase.Add(PageLabelChunk);
            PageNumberPhrase.Add(PageNumberChunk);

            RightParagraph.Add(PageNumberPhrase);

            //RightParagraph.Add(new Phrase($"{Receipts.PageLabel} {x} {Receipts.Of} {y}", normal));

            PdfPCell RightCell = new PdfPCell();

            RightCell.Border = 0;
            RightCell.Padding = 0;

            RightCell.UseAscender = true;

            RightCell.AddElement(RightParagraph);

            RightTable.AddCell(RightCell);

            RightHeaderCell.AddElement(RightTable);

            HeaderTable.AddCell(RightHeaderCell);

            return HeaderTable;
        }
    }
}