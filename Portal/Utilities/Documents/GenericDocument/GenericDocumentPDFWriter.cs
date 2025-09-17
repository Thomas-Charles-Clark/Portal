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
using SharedEFClasses.Models.Documents;
using SharedEFClasses.Models;

namespace Portal.Utilities.Document
{
    public static class GenericDocumentPDFWriter
    {
        private static System.Text.RegularExpressions.Regex AnchorTagsTextExtractor = new System.Text.RegularExpressions.Regex(@"<a href=\""[^\""]*\"">([^\""]*)<\/a>", System.Text.RegularExpressions.RegexOptions.Singleline | RegexOptions.Compiled);
        private static System.Text.RegularExpressions.Regex AnchorTagsURIExtractor = new System.Text.RegularExpressions.Regex(@"<a href=\""([^\""]*)\"">", System.Text.RegularExpressions.RegexOptions.Singleline | RegexOptions.Compiled);
        
        public static string GetResource(List<ResourceSelect> resources, string name)
        {
            return resources.Where(p => p.Name == name).Select(p => p.Value).SingleOrDefault();
        }

        public static MemoryStream GenerateDocument(string rootPath, DocumentSelectResult input)
        {
            return GenericDocumentPDFWriter.Create(rootPath, input.Resources, input.Document);
        }

        public static MemoryStream Create(string rootPath, List<ResourceSelect> resources, DocumentSelect input)
        {
            var stopWatch = new System.Diagnostics.Stopwatch();

            var finalStream = new MemoryStream();

            BaseFont gillSansMt = BaseFont.CreateFont(rootPath + "Content/fonts/Gill-Sans-MT.ttf", BaseFont.CP1252, BaseFont.EMBEDDED);

            stopWatch.Start();

            System.Globalization.NumberFormatInfo nfi = new System.Globalization.CultureInfo("en-GB").NumberFormat;

            var normalFont = new Font(gillSansMt, 10, Font.NORMAL, BaseColor.BLACK);
            var hyperlinkFont = new Font(gillSansMt, 10, Font.UNDERLINE, BaseColor.BLUE);
            var italicFont = new Font(gillSansMt, 10, Font.ITALIC, BaseColor.BLACK);
            var boldFont = FontFactory.GetFont("Arial", 10, Font.BOLD, BaseColor.BLACK);
            var underlined = new Font(gillSansMt, 10, Font.UNDERLINE, BaseColor.BLACK);


            var smallerFont = new Font(gillSansMt, 9, Font.NORMAL, BaseColor.BLACK);

            var smallerItalicFont = FontFactory.GetFont("Arial", 9, Font.ITALIC, BaseColor.BLACK);

            var italicBold = FontFactory.GetFont("Arial", 10, Font.BOLDITALIC, BaseColor.BLACK);

            var italicUnderlined = FontFactory.GetFont("Arial", 10, Font.ITALIC | Font.UNDERLINE, BaseColor.BLACK);

            var boldUnderlined = FontFactory.GetFont("Arial", 10, Font.BOLD | Font.UNDERLINE, BaseColor.BLACK);

            var italicBoldUnderlined = FontFactory.GetFont("Arial", 10, Font.UNDERLINE | Font.BOLDITALIC, BaseColor.BLACK);

            var footerNormalFont = FontFactory.GetFont("Arial", 8,Font.NORMAL, BaseColor.BLACK);

            var footerBoldFont = FontFactory.GetFont("Arial", 8, Font.BOLD, BaseColor.BLACK);

            System.Drawing.Image dgImage = System.Drawing.Image.FromFile(AppDomain.CurrentDomain.BaseDirectory + "/Content/Images/Logos/designers-guild.jpg");

            Image dgLogo = Image.GetInstance(dgImage, System.Drawing.Imaging.ImageFormat.Jpeg);
            dgLogo.ScaleAbsolute(280.0f, 21.0f);

            List<MemoryStream> streams = new List<MemoryStream>();

            var counter = 0;

            for (var orderHeadIndex = 0; orderHeadIndex < input.OrderHeaders.Count; orderHeadIndex++)
            {
                var orderHead = input.OrderHeaders[orderHeadIndex];

                var orderLines = input.OrderLines
                                      .Where(p => p.OrderIdentifier == orderHead.OrderIdentifier)
                                      .OrderBy(p => p.SortOrder)
                                      .ToList();

                var orderMemos = input.OrderMemos
                                      .Where(p => p.OrderIdentifier == orderHead.OrderIdentifier)
                                      .OrderBy(p => p.SortOrder)
                                      .ToList();

                var orderTotals = input.OrderTotals
                                       .Where(p => p.OrderIdentifier == orderHead.OrderIdentifier)
                                       .ToList();

                var orderFooter = input.OrderFooters
                                       .Where(p => p.OrderIdentifier == orderHead.OrderIdentifier)
                                       .Single();

                var output = new MemoryStream();

                var document = new iTextSharp.text.Document(PageSize.A4, 25, 25, 90, 125);

                var writer = PdfWriter.GetInstance(document, output);

                writer.CloseStream = false;

                document.Open();

                #region Document Header Table

                if (orderHeadIndex == 0)
                {
                    Paragraph documentHeadParagraph = new Paragraph();

                    documentHeadParagraph.SpacingBefore = 0.0f;

                    documentHeadParagraph.SpacingAfter = 20.0f;

                    var documentHeadPhrase1 = new Phrase();

                    var addDocumentHeadPhrase1Newline = false;

                    if (input.DocumentHeader.HeaderLabel1 != null)
                    {
                        documentHeadPhrase1.Add(new Chunk($"{input.DocumentHeader.HeaderLabel1}", boldFont));
                        addDocumentHeadPhrase1Newline = true;
                    }

                    if (input.DocumentHeader.HeaderValue1 != null)
                    {
                        documentHeadPhrase1.Add(new Chunk($"{input.DocumentHeader.HeaderValue1}", normalFont));
                        addDocumentHeadPhrase1Newline = true;
                    }

                    if (addDocumentHeadPhrase1Newline)
                    {
                        documentHeadPhrase1.Add(new Chunk($"\n", normalFont));
                        documentHeadParagraph.Add(documentHeadPhrase1);
                    }

                    var documentHeadPhrase2 = new Phrase();

                    var addDocumentHeadPhrase2Newline = false;

                    if (input.DocumentHeader.HeaderLabel2 != null)
                    {
                        documentHeadPhrase2.Add(new Chunk($"{input.DocumentHeader.HeaderLabel2}", boldFont));
                        addDocumentHeadPhrase2Newline = true;
                    }

                    if (input.DocumentHeader.HeaderValue2 != null)
                    {
                        documentHeadPhrase2.Add(new Chunk($"{input.DocumentHeader.HeaderValue2}", normalFont));
                        addDocumentHeadPhrase2Newline = true;
                    }

                    if (addDocumentHeadPhrase2Newline)
                    {
                        documentHeadPhrase2.Add(new Chunk($"\n", normalFont));
                        documentHeadParagraph.Add(documentHeadPhrase2);
                    }

                    var documentHeadPhrase3 = new Phrase();

                    var addDocumentHeadPhrase3Newline = false;

                    if (input.DocumentHeader.HeaderLabel3 != null)
                    {
                        documentHeadPhrase3.Add(new Chunk($"{input.DocumentHeader.HeaderLabel3}", boldFont));
                        addDocumentHeadPhrase3Newline = true;
                    }

                    if (input.DocumentHeader.HeaderValue3 != null)
                    {
                        documentHeadPhrase3.Add(new Chunk($"{input.DocumentHeader.HeaderValue3}", normalFont));
                        addDocumentHeadPhrase3Newline = true;
                    }

                    if (addDocumentHeadPhrase3Newline)
                    {
                        documentHeadPhrase3.Add(new Chunk($"\n", normalFont));
                        documentHeadParagraph.Add(documentHeadPhrase3);
                    }

                    var documentHeadPhrase4 = new Phrase();

                    var addDocumentHeadPhrase4Newline = false;

                    if (input.DocumentHeader.HeaderLabel4 != null)
                    {
                        documentHeadPhrase4.Add(new Chunk($"{input.DocumentHeader.HeaderLabel4}", boldFont));
                        addDocumentHeadPhrase4Newline = true;
                    }

                    if (input.DocumentHeader.HeaderValue4 != null)
                    {
                        documentHeadPhrase4.Add(new Chunk($"{input.DocumentHeader.HeaderValue4}", normalFont));
                        addDocumentHeadPhrase4Newline = true;
                    }

                    if (addDocumentHeadPhrase4Newline)
                    {
                        documentHeadPhrase4.Add(new Chunk($"\n", normalFont));
                        documentHeadParagraph.Add(documentHeadPhrase4);
                    }

                    var addDocumentHeadParagraphs = false;

                    List<Paragraph> documentHeadParagraphCollection = new List<Paragraph>();

                    if (input.DocumentHeader.HeaderParagraphs != null)
                    {
                        documentHeadParagraphCollection = ProcessJsonParagraphs(rootPath, input.DocumentHeader.HeaderParagraphs).ToList();
                    }

                    if (documentHeadParagraphCollection.Any())
                    {
                        addDocumentHeadParagraphs = true;
                    }

                    if (addDocumentHeadPhrase1Newline ||
                        addDocumentHeadPhrase2Newline ||
                        addDocumentHeadPhrase3Newline ||
                        addDocumentHeadPhrase4Newline ||
                        addDocumentHeadParagraphs)
                    {
                        var documentHeadCell = new PdfPCell();

                        documentHeadCell.Border = 0;

                        documentHeadCell.Padding = 0;

                        documentHeadCell.UseAscender = true;

                        documentHeadCell.AddElement(documentHeadParagraph);

                        if (addDocumentHeadParagraphs)
                        {
                            foreach (var dhp in documentHeadParagraphCollection)
                            {
                                documentHeadCell.AddElement(dhp);
                            }
                        }

                        PdfPTable documentHeadTable = new PdfPTable(1);

                        documentHeadTable.WidthPercentage = 100.0f;

                        documentHeadTable.SetWidths(new float[] { 100.0f });

                        documentHeadTable.AddCell(documentHeadCell);

                        documentHeadTable.SpacingAfter = 12.0f;

                        document.Add(documentHeadTable);
                    }

                    #endregion
                }

                #region Page Footer

                var pageFooterTable = new PdfPTable(1);

                pageFooterTable.TotalWidth = 545.0f;
                pageFooterTable.LockedWidth = true;
                pageFooterTable.DefaultCell.Border = 0;
                pageFooterTable.DefaultCell.Padding = 3;
                pageFooterTable.DefaultCell.BorderWidth = 0;
                pageFooterTable.DefaultCell.VerticalAlignment = Element.ALIGN_TOP;
                pageFooterTable.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;

                if (input.PageFooter.PagePreFooterNote != null)
                {
                    var pageFooterParagraphs = ProcessTextBlock(rootPath, input.PageFooter.PagePreFooterNote);

                    var footerParagraphWrapper = new Paragraph();

                    footerParagraphWrapper.SpacingAfter = 20.0f;

                    foreach (var p in pageFooterParagraphs)
                    {
                        footerParagraphWrapper.Add(p);
                    }

                    var pageFooterTopCell = new PdfPCell();

                    pageFooterTopCell.Border = 0;
                    pageFooterTopCell.Padding = 0;
                    pageFooterTopCell.PaddingBottom = 10.0f;

                    pageFooterTopCell.AddElement(footerParagraphWrapper);

                    pageFooterTable.AddCell(pageFooterTopCell);
                }

                var pageFooterLabelsTable = new PdfPTable(1);

                pageFooterLabelsTable.WidthPercentage = 100.0f;
                pageFooterLabelsTable.SetWidths(new float[] { 100.0f });// 70.0f, 30.0f });

                var pageFooterTableCell = new PdfPCell();

                pageFooterTableCell.Border = 0;
                pageFooterTableCell.Padding = 0;
                pageFooterTableCell.UseAscender = true;

                var pageFooterTableCellPhrase = new Phrase();

                var pageFooterTableCellParagraph = new Paragraph();

                var addFooterLine1Break = false;

                if (input.PageFooter.PageFooterLine1Label1 != null)
                {
                    pageFooterTableCellPhrase.Add(new Chunk($"{input.PageFooter.PageFooterLine1Label1}", boldFont));
                    addFooterLine1Break = true;
                }

                if (input.PageFooter.PageFooterLine1Value1 != null)
                {
                    pageFooterTableCellPhrase.Add(new Chunk($"{input.PageFooter.PageFooterLine1Value1}", normalFont));
                    addFooterLine1Break = true;
                }

                if (input.PageFooter.PageFooterLine1Label2 != null)
                {
                    pageFooterTableCellPhrase.Add(new Chunk($"{input.PageFooter.PageFooterLine1Label2}", boldFont));
                    addFooterLine1Break = true;
                }

                if (input.PageFooter.PageFooterLine1Value2 != null)
                {
                    pageFooterTableCellPhrase.Add(new Chunk($"{input.PageFooter.PageFooterLine1Value2}", normalFont));
                    addFooterLine1Break = true;
                }

                if (addFooterLine1Break)
                {
                    pageFooterTableCellPhrase.Add(new Chunk("\n", normalFont));
                }

                var addFooterLine2Break = false;

                if (input.PageFooter.PageFooterLine2Label1 != null)
                {
                    pageFooterTableCellPhrase.Add(new Chunk($"{input.PageFooter.PageFooterLine2Label1}", boldFont));
                    addFooterLine2Break = true;
                }

                if (input.PageFooter.PageFooterLine2Value1 != null)
                {
                    pageFooterTableCellPhrase.Add(new Chunk($"{input.PageFooter.PageFooterLine2Value1}", normalFont));
                    addFooterLine2Break = true;
                }

                if (input.PageFooter.PageFooterLine2Label2 != null)
                {
                    pageFooterTableCellPhrase.Add(new Chunk($"{input.PageFooter.PageFooterLine2Label2}", boldFont));
                    addFooterLine2Break = true;
                }

                if (input.PageFooter.PageFooterLine2Value2 != null)
                {
                    pageFooterTableCellPhrase.Add(new Chunk($"{input.PageFooter.PageFooterLine2Value2}", normalFont));
                    addFooterLine2Break = true;
                }

                if (addFooterLine2Break)
                {
                    pageFooterTableCellPhrase.Add(new Chunk("\n", normalFont));
                }

                var addFooterLine3Break = false;

                if (input.PageFooter.PageFooterLine3Label1 != null)
                {
                    pageFooterTableCellPhrase.Add(new Chunk($"{input.PageFooter.PageFooterLine3Label1}", boldFont));
                    addFooterLine2Break = true;
                }

                if (input.PageFooter.PageFooterLine3Value1 != null)
                {
                    pageFooterTableCellPhrase.Add(new Chunk($"{input.PageFooter.PageFooterLine3Value1}", normalFont));
                    addFooterLine2Break = true;
                }

                if (input.PageFooter.PageFooterLine3Label2 != null)
                {
                    pageFooterTableCellPhrase.Add(new Chunk($"{input.PageFooter.PageFooterLine3Label2}", boldFont));
                    addFooterLine2Break = true;
                }

                if (input.PageFooter.PageFooterLine3Value2 != null)
                {
                    pageFooterTableCellPhrase.Add(new Chunk($"{input.PageFooter.PageFooterLine3Value2}", normalFont));
                    addFooterLine2Break = true;
                }

                if (addFooterLine3Break)
                {
                    pageFooterTableCellPhrase.Add(new Chunk("\n", normalFont));
                }

                pageFooterTableCellParagraph.Add(pageFooterTableCellPhrase);

                pageFooterTableCell.AddElement(pageFooterTableCellParagraph);

                pageFooterLabelsTable.AddCell(pageFooterTableCell);

                var pageFooterBottomCell = new PdfPCell();

                pageFooterBottomCell.Padding = 0;
                pageFooterBottomCell.Border = 0;

                pageFooterBottomCell.AddElement(pageFooterLabelsTable);

                pageFooterTable.AddCell(pageFooterBottomCell);

                #endregion

                #region Order Header Paragraph

                Paragraph orderHeadParagraph = new Paragraph();

                orderHeadParagraph.SpacingBefore = 0.0f;
                orderHeadParagraph.SpacingAfter = 20.0f;

                var orderHeadPhrase1 = new Phrase();

                var addOrderHeadPhrase1Newline = false;

                if (orderHead.OrderHeaderLabel1 != null)
                {
                    orderHeadPhrase1.Add(new Chunk($"{orderHead.OrderHeaderLabel1}", boldFont));
                    addOrderHeadPhrase1Newline = true;
                }

                if (orderHead.OrderHeaderValue1 != null)
                {
                    orderHeadPhrase1.Add(new Chunk($"{orderHead.OrderHeaderValue1}", normalFont));
                    addOrderHeadPhrase1Newline = true;
                }

                if (addOrderHeadPhrase1Newline)
                {
                    orderHeadPhrase1.Add(new Chunk($"\n", normalFont));
                    orderHeadParagraph.Add(orderHeadPhrase1);
                }

                var orderHeadPhrase2 = new Phrase();

                var addOrderHeadPhrase2Newline = false;

                if (orderHead.OrderHeaderLabel2 != null)
                {
                    orderHeadPhrase2.Add(new Chunk($"{orderHead.OrderHeaderLabel2}", boldFont));
                    addOrderHeadPhrase2Newline = true;
                }

                if (orderHead.OrderHeaderValue2 != null)
                {
                    orderHeadPhrase2.Add(new Chunk($"{orderHead.OrderHeaderValue2}", normalFont));
                    addOrderHeadPhrase2Newline = true;
                }

                if (addOrderHeadPhrase2Newline)
                {
                    orderHeadPhrase2.Add(new Chunk($"\n", normalFont));
                    orderHeadParagraph.Add(orderHeadPhrase2);
                }

                var orderHeadPhrase3 = new Phrase();

                var addOrderHeadPhrase3Newline = false;

                if (orderHead.OrderHeaderLabel3 != null)
                {
                    orderHeadPhrase3.Add(new Chunk($"{orderHead.OrderHeaderLabel3}", boldFont));
                    addOrderHeadPhrase3Newline = true;
                }

                if (orderHead.OrderHeaderValue3 != null)
                {
                    orderHeadPhrase3.Add(new Chunk($"{orderHead.OrderHeaderValue3}", normalFont));
                    addOrderHeadPhrase3Newline = true;
                }

                if (addOrderHeadPhrase3Newline)
                {
                    orderHeadPhrase3.Add(new Chunk($"\n", normalFont));
                    orderHeadParagraph.Add(orderHeadPhrase3);
                }

                var orderHeadPhrase4 = new Phrase();

                var addOrderHeadPhrase4Newline = false;

                if (orderHead.OrderHeaderLabel4 != null)
                {
                    orderHeadPhrase4.Add(new Chunk($"{orderHead.OrderHeaderLabel4}", boldFont));
                    addOrderHeadPhrase4Newline = true;
                }

                if (orderHead.OrderHeaderValue4 != null)
                {
                    orderHeadPhrase4.Add(new Chunk($"{orderHead.OrderHeaderValue4}", normalFont));
                    addOrderHeadPhrase4Newline = true;
                }

                if (addOrderHeadPhrase4Newline)
                {
                    orderHeadPhrase4.Add(new Chunk($"\n", normalFont));
                    orderHeadParagraph.Add(orderHeadPhrase4);
                }

                var addOrderHeadParagraphs = false;

                List<Paragraph> orderHeadParagraphCollection = new List<Paragraph>();

                if (orderHead.OrderHeaderParagraphsJSON != null)
                {
                    orderHeadParagraphCollection = ProcessJsonParagraphs(rootPath, orderHead.OrderHeaderParagraphs).ToList();
                }

                if (orderHeadParagraphCollection.Any())
                {
                    addOrderHeadParagraphs = true;
                }

                #endregion

                // This is the point at which I would ideally precalculate the 'appears on each page' footer height, so as to set the
                // margin-bottom on the iTextSharp Document.

                if (addOrderHeadPhrase1Newline ||
                    addOrderHeadPhrase2Newline ||
                    addOrderHeadPhrase3Newline ||
                    addOrderHeadPhrase4Newline ||
                    addOrderHeadParagraphs)
                {
                    var orderHeadCell = new PdfPCell();

                    orderHeadCell.Border = 0;

                    orderHeadCell.Padding = 0;

                    orderHeadCell.UseAscender = true;

                    if (addOrderHeadParagraphs)
                    {
                        orderHeadParagraph.SpacingAfter = 12.0f;
                    }

                    orderHeadCell.AddElement(orderHeadParagraph);

                    foreach(var ohp in orderHeadParagraphCollection)
                    {
                        orderHeadCell.AddElement(ohp);
                    }

                    PdfPTable orderHeadTable = new PdfPTable(1);

                    orderHeadTable.WidthPercentage = 100.0f;

                    orderHeadTable.SetWidths(new float[] { 100.0f });

                    orderHeadTable.AddCell(orderHeadCell);

                    orderHeadTable.SpacingAfter = 20.0f;

                    document.Add(orderHeadTable);
                }

                var columnCount = input.ColumnHeadings.Count;

                if (columnCount > 0)
                {
                    var leftColumnSpan = input.ColumnHeadings.Count - 2;

                    var rightColumnSpan = 1;

                    var columnWidths = new List<float>();

                    foreach (var ch in input.ColumnHeadings)
                    {
                        columnWidths.Add(100);
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

                    bodyTable.SetWidths(input.ColumnHeadings.Select(p => p.WidthPercentage ?? 10.0f).ToArray());

                    bodyTable.SplitLate = false;

                    foreach (var c in input.ColumnHeadings)
                    {
                        bodyTable.AddCell(new PdfPCell(new Phrase($"{c.Name}", boldFont))
                        {
                            Border = 1,
                            BorderWidthTop = 1,
                            BorderWidthBottom = 1,
                            BorderWidthLeft = 0,
                            BorderWidthRight = 0,
                            VerticalAlignment = Element.ALIGN_TOP,
                            HorizontalAlignment = (c.TextAlign == "left" ? Element.ALIGN_LEFT : Element.ALIGN_RIGHT),
                            PaddingLeft = 3,
                            PaddingRight = 3,
                            PaddingTop = 3,
                            PaddingBottom = 6
                        });
                    }

                    bodyTable.HeaderRows = 1;

                    foreach (var line in orderLines)
                    {
                        var orderLineMemos = input.OrderLineMemos.Where(p => 
                            p.OrderIdentifier == orderHead.OrderIdentifier &&
                            p.OrderLineIdentifier == line.OrderLineIdentifier)
                            .OrderBy(p => p.SortOrder)
                            .ToList();

                        for (var i = 0; i < input.ColumnHeadings.Count; i++)
                        {
                            if (line == orderLines.Last() && !orderLineMemos.Any())
                            {
                                bodyTable.AddCell(new PdfPCell(new Phrase($"{CustomExtensions.GetPropertyValue(line, $"Column{i + 1}")}", smallerFont))
                                {
                                    Border = 1,
                                    BorderWidthTop = 0,
                                    BorderWidthLeft = 0,
                                    BorderWidthRight = 0,
                                    BorderWidthBottom = 1,
                                    HorizontalAlignment = (input.ColumnHeadings[i].TextAlign == "left" ? Element.ALIGN_LEFT : Element.ALIGN_RIGHT),
                                    VerticalAlignment = Element.ALIGN_TOP,
                                    PaddingLeft = 3,
                                    PaddingRight = 3,
                                    PaddingBottom = 6
                                });
                            }
                            else
                            {
                                bodyTable.AddCell(new PdfPCell(new Phrase($"{CustomExtensions.GetPropertyValue(line, $"Column{i + 1}")}", smallerFont))
                                {
                                    Border = 0,
                                    HorizontalAlignment = (input.ColumnHeadings[i].TextAlign == "left" ? Element.ALIGN_LEFT : Element.ALIGN_RIGHT),
                                    VerticalAlignment = Element.ALIGN_TOP,
                                    PaddingLeft = 3,
                                    PaddingRight = 3
                                });
                            }
                        }

                        if (orderLineMemos.Any())
                        {
                            foreach (var m in orderLineMemos)
                            {
                                if (m.Memo != null)
                                {
                                    if (line == orderLines.Last() && m == orderLineMemos.Last())
                                    {
                                        bodyTable.AddCell(new PdfPCell(new Phrase($"{m.Memo.Replace("&amp;", "&").Replace("|", "\n")}", smallerItalicFont))
                                        {
                                            Colspan = input.ColumnHeadings.Count,
                                            Border = 0,
                                            BorderWidthTop = 0,
                                            BorderWidthLeft = 0,
                                            BorderWidthRight = 0,
                                            BorderWidthBottom = 0,
                                            HorizontalAlignment = Element.ALIGN_LEFT,
                                            VerticalAlignment = Element.ALIGN_TOP,
                                            PaddingLeft = 18,
                                            PaddingRight = 3,
                                            PaddingTop = 3,
                                            PaddingBottom = 8
                                        });
                                    }
                                    else
                                    {
                                        bodyTable.AddCell(new PdfPCell(new Phrase($"{m.Memo.Replace("&amp;", "&").Replace("|", "\n")}", smallerItalicFont))
                                        {
                                            Colspan = input.ColumnHeadings.Count,
                                            Border = 0,
                                            BorderWidthTop = 0,
                                            BorderWidthLeft = 0,
                                            BorderWidthRight = 0,
                                            BorderWidthBottom = 0,
                                            HorizontalAlignment = Element.ALIGN_LEFT,
                                            VerticalAlignment = Element.ALIGN_TOP,
                                            PaddingLeft = 18,
                                            PaddingRight = 3,
                                            PaddingTop = 3,
                                            PaddingBottom = 18
                                        });
                                    }
                                }

                                if (m.FormattedLineMemos.Any())
                                {
                                    var memoCell = new PdfPCell()
                                    {
                                        Colspan = input.ColumnHeadings.Count,
                                        Border = 0,
                                        BorderWidthTop = 0,
                                        BorderWidthLeft = 0,
                                        BorderWidthRight = 0,
                                        BorderWidthBottom = 0,
                                        HorizontalAlignment = Element.ALIGN_LEFT,
                                        VerticalAlignment = Element.ALIGN_TOP,
                                        PaddingLeft = 18,
                                        PaddingRight = 3,
                                        PaddingTop = 3,
                                        PaddingBottom = line == orderLines.Last() ? 0 : 10
                                    };

                                    var memoParagraphs = ProcessJsonParagraphs(rootPath, m.FormattedLineMemos, 9, false, true);

                                    foreach (var flm in memoParagraphs)
                                    {
                                        memoCell.AddElement(flm);
                                    }

                                    bodyTable.AddCell(memoCell);
                                }
                            }
                        }
                    }

                    var summaryTable = new PdfPTable(columnCount);

                    summaryTable.WidthPercentage = 100.0f;

                    summaryTable.DefaultCell.Border = 0;
                    summaryTable.DefaultCell.PaddingLeft = 3;
                    summaryTable.DefaultCell.PaddingRight = 3;
                    summaryTable.DefaultCell.BorderWidth = 0;
                    summaryTable.DefaultCell.VerticalAlignment = Element.ALIGN_TOP;
                    summaryTable.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;

                    summaryTable.SetWidths(input.ColumnHeadings.Select(p => p.WidthPercentage ?? 10.0f).ToArray());

                    summaryTable.KeepTogether = true;

                    foreach (var t in orderTotals)
                    {
                        summaryTable.AddCell(new PdfPCell(new Phrase(" "))
                        {
                            Colspan = leftColumnSpan,
                            Border = 0
                        });

                        summaryTable.AddCell(new PdfPCell(new Phrase($"{t.Label}", boldFont))
                        {
                            Colspan = rightColumnSpan,
                            Border = (t.BorderTop || t.BorderBottom) ? 1 : 0,
                            BorderWidthTop = t.BorderTop ? 1 : 0,
                            BorderWidthBottom = t.BorderBottom ? 1 : 0,
                            BorderWidthLeft = 0,
                            BorderWidthRight = 0,
                            HorizontalAlignment = Element.ALIGN_RIGHT,
                            VerticalAlignment = Element.ALIGN_TOP,
                            PaddingLeft = 3,
                            PaddingRight = 3,
                            PaddingBottom = 5
                        });

                        summaryTable.AddCell(new PdfPCell(new Phrase($"{t.Value}", normalFont))
                        {
                            Border = (t.BorderTop || t.BorderBottom) ? 1 : 0,
                            BorderWidthTop = t.BorderTop ? 1 : 0,
                            BorderWidthBottom = t.BorderBottom ? 1 : 0,
                            HorizontalAlignment = Element.ALIGN_RIGHT,
                            VerticalAlignment = Element.ALIGN_TOP,
                            PaddingLeft = 3,
                            PaddingRight = 3,
                            PaddingBottom = 5
                        });
                    }

                    summaryTable.SpacingBefore = 6.0f;
                    summaryTable.SpacingAfter = 0.0f;

                    bodyTable.SpacingBefore = 0.0f;
                    bodyTable.SpacingAfter = 0.0f;

                    document.Add(bodyTable);

                    document.Add(summaryTable);

                }

                #region Order Memos & Footer

                if (orderMemos.Any())
                {
                    foreach (var m in orderMemos.Where(p => !String.IsNullOrEmpty(p.Memo)).OrderBy(p => p.SortOrder))
                    {
                        var orderMemoCell = new PdfPCell();

                        orderMemoCell.Border = 0;

                        orderMemoCell.Padding = 0;

                        orderMemoCell.UseAscender = true;

                        var memoParagraph = new Paragraph();

                        memoParagraph.SpacingBefore = 12.0f;

                        if (m == orderMemos.Where(p => !String.IsNullOrEmpty(p.Memo)).OrderBy(p => p.SortOrder).First())
                        {
                            memoParagraph.SpacingBefore = 0.0f;
                        }

                        memoParagraph.SpacingAfter = 0.0f;
                        memoParagraph.Leading = 12.0f;

                        var memoLabel = new Phrase(new Chunk($"{orderHead.OrderHeaderMemoLabel}\n", boldFont));
                        var memoPhrase = new Phrase(new Chunk($"{m.Memo.Replace("&amp;", "&").Replace("|", "\n")}", italicFont));

                        memoParagraph.Add(memoLabel);
                        memoParagraph.Add(memoPhrase);

                        orderMemoCell.AddElement(memoParagraph);

                        PdfPTable memoTable = new PdfPTable(1);

                        memoTable.SpacingBefore = 12.0f;

                        memoTable.SpacingAfter = 0.0f;

                        memoTable.WidthPercentage = 100.0f;

                        memoTable.SetWidths(new float[] { 100.0f });

                        memoTable.AddCell(orderMemoCell);

                        document.Add(memoTable);
                    }
                }

                Paragraph orderFooterParagraph = new Paragraph();

                orderFooterParagraph.SpacingBefore = 12.0f;

                orderFooterParagraph.SpacingAfter = 0.0f;

                var orderFooterPhrase1 = new Phrase();

                var addOrderFooterPhrase1Newline = false;

                if (orderFooter.OrderFooterLabel1 != null)
                {
                    orderFooterPhrase1.Add(new Chunk($"{orderFooter.OrderFooterLabel1}", boldFont));
                    addOrderFooterPhrase1Newline = true;
                }

                if (orderFooter.OrderFooterValue1 != null)
                {
                    orderFooterPhrase1.Add(new Chunk($"{orderFooter.OrderFooterValue1}", normalFont));
                    addOrderFooterPhrase1Newline = true;
                }

                if (addOrderFooterPhrase1Newline)
                {
                    orderFooterPhrase1.Add(new Chunk($"\n", normalFont));
                    orderFooterParagraph.Add(orderFooterPhrase1);
                }

                var orderFooterPhrase2 = new Phrase();

                var addOrderFooterPhrase2Newline = false;

                if (orderFooter.OrderFooterLabel2 != null)
                {
                    orderFooterPhrase2.Add(new Chunk($"{orderFooter.OrderFooterLabel2}", boldFont));
                    addOrderFooterPhrase2Newline = true;
                }

                if (orderFooter.OrderFooterValue2 != null)
                {
                    foreach(var ofvgp in ProcessTextBlock(rootPath, orderFooter.OrderFooterValue2))
                    {
                        orderFooterPhrase2.Add(ofvgp);
                    }

                    addOrderFooterPhrase2Newline = true;
                }

                if (addOrderFooterPhrase2Newline)
                {
                    orderFooterPhrase2.Add(new Chunk($"\n", normalFont));
                    orderFooterParagraph.Add(orderFooterPhrase2);
                }

                var orderFooterPhrase3 = new Phrase();

                var addOrderFooterPhrase3Newline = false;

                if (orderFooter.OrderFooterLabel3 != null)
                {
                    orderFooterPhrase3.Add(new Chunk($"{orderFooter.OrderFooterLabel3}", boldFont));
                    addOrderFooterPhrase3Newline = true;
                }

                if (orderFooter.OrderFooterValue3 != null)
                {
                    orderFooterPhrase3.Add(new Chunk($"{orderFooter.OrderFooterValue3}", normalFont));
                    addOrderFooterPhrase3Newline = true;
                }

                if (addOrderFooterPhrase3Newline)
                {
                    orderFooterPhrase3.Add(new Chunk($"\n", normalFont));
                    orderFooterParagraph.Add(orderFooterPhrase3);
                }

                var orderFooterPhrase4 = new Phrase();

                var addOrderFooterPhrase4Newline = false;

                if (orderFooter.OrderFooterLabel4 != null)
                {
                    orderFooterPhrase4.Add(new Chunk($"{orderFooter.OrderFooterLabel4}", boldFont));
                    addOrderFooterPhrase4Newline = true;
                }

                if (orderFooter.OrderFooterValue4 != null)
                {
                    orderFooterPhrase4.Add(new Chunk($"{orderFooter.OrderFooterValue4}", normalFont));
                    addOrderFooterPhrase4Newline = true;
                }

                if (addOrderFooterPhrase4Newline)
                {
                    orderFooterPhrase4.Add(new Chunk($"\n", normalFont));
                    orderFooterParagraph.Add(orderFooterPhrase4);
                }

                var orderFooterAnchorPhrase = new Phrase();

                var addOrderFooterAnchorNewLine = false;

                if (orderFooter.OrderFooterAnchorTag != null)
                {

                    // Fix for CS1002: ; expected  
                    // The issue occurs because the statement `var uri = PdfAction.CreateURI` is incomplete and missing a semicolon or method call.  
                    // Since `PdfAction` does not have a `CreateURI` method (as per the provided type signatures), this line needs to be corrected or removed.  

                    // Correcting the code by removing the incomplete line and replacing it with a valid statement.  
                    // If you intended to use a different method, please provide clarification.  

                    if (orderFooter.OrderFooterAnchorTag != null)
                    {
                        var anchorText = AnchorTagsTextExtractor.Replace(orderFooter.OrderFooterAnchorTag, (m) => {
                            return m.Groups[1].Value;
                        });

                        var uri = (string)null;
                        
                        AnchorTagsURIExtractor.Replace(orderFooter.OrderFooterAnchorTag, (m) => {

                            uri = m.Groups[1].Value;

                            return "";
                        });

                        var orderFooterAnchorTextChunk = new Chunk(anchorText, hyperlinkFont)
                            .SetAnchor(uri);

                        //orderFooterAnchorTextChunk.SetAnchor(orderFooter.OrderFooterAnchorTag);

                        addOrderFooterAnchorNewLine = true;

                        orderFooterAnchorPhrase = new Phrase(orderFooterAnchorTextChunk);

                        orderFooterParagraph.Add(orderFooterAnchorPhrase);
                    }
                }

                if (addOrderFooterAnchorNewLine)
                {
                    orderFooterAnchorPhrase.Add(new Chunk($"\n", normalFont));
                    orderFooterParagraph.Add(orderFooterPhrase4);
                }

                var addOrderFooterParagraphs = false;

                List<Paragraph> orderFooterParagraphCollection = new List<Paragraph>();

                if (orderFooter.OrderFooterParagraphsJSON != null)
                {
                    orderFooterParagraphCollection = ProcessJsonParagraphs(rootPath, orderFooter.OrderFooterParagraphs).ToList();
                }

                if (orderFooterParagraphCollection.Any())
                {
                    addOrderFooterParagraphs = true;
                }

                if (addOrderFooterPhrase1Newline ||
                    addOrderFooterPhrase2Newline ||
                    addOrderFooterPhrase3Newline ||
                    addOrderFooterPhrase4Newline ||
                    addOrderFooterAnchorNewLine ||
                    addOrderFooterParagraphs)
                {
                    var orderFooterCell = new PdfPCell();

                    orderFooterCell.Border = 0;

                    orderFooterCell.Padding = 0;

                    if (orderMemos.Any())
                    {
                        orderFooterCell.PaddingTop = 24.0f;
                    }

                    orderFooterCell.UseAscender = true;

                    orderFooterCell.AddElement(orderFooterParagraph);

                    foreach (var ofp in orderFooterParagraphCollection)
                    {
                        ofp.SpacingBefore = 12.0f;
                        ofp.SpacingAfter = 0.0f;
                        orderFooterCell.AddElement(ofp);
                    }

                    PdfPTable orderFooterTable = new PdfPTable(1);

                    orderFooterTable.WidthPercentage = 100.0f;

                    orderFooterTable.SetWidths(new float[] { 100.0f });

                    orderFooterTable.AddCell(orderFooterCell);

                    document.Add(orderFooterTable);
                }
                #endregion

                // If we have a document footer, it needs adding here.
                if (orderHeadIndex == input.OrderHeaders.Count - 1)
                {
                    #region Document Footer

                    Paragraph documentFooterParagraph = new Paragraph();

                    documentFooterParagraph.SpacingBefore = 12.0f;

                    documentFooterParagraph.SpacingAfter = 0.0f;

                    var documentFooterPhrase1 = new Phrase();

                    var addDocumentFooterPhrase1Newline = false;

                    if (input.DocumentFooter.DocumentFooterLabel1 != null)
                    {
                        documentFooterPhrase1.Add(new Chunk($"{input.DocumentFooter.DocumentFooterLabel1}", boldFont));
                        addDocumentFooterPhrase1Newline = true;
                    }

                    if (input.DocumentFooter.DocumentFooterValue1 != null)
                    {
                        documentFooterPhrase1.Add(new Chunk($"{input.DocumentFooter.DocumentFooterValue1}", normalFont));
                        addDocumentFooterPhrase1Newline = true;
                    }

                    if (addDocumentFooterPhrase1Newline)
                    {
                        documentFooterPhrase1.Add(new Chunk($"\n", normalFont));
                        documentFooterParagraph.Add(documentFooterPhrase1);
                    }

                    var documentFooterPhrase2 = new Phrase();

                    var addDocumentFooterPhrase2Newline = false;

                    if (input.DocumentFooter.DocumentFooterLabel2 != null)
                    {
                        documentFooterPhrase2.Add(new Chunk($"{input.DocumentFooter.DocumentFooterLabel2}", boldFont));
                        addDocumentFooterPhrase2Newline = true;
                    }

                    if (input.DocumentFooter.DocumentFooterValue2 != null)
                    {
                        documentFooterPhrase2.Add(new Chunk($"{input.DocumentFooter.DocumentFooterValue2}", normalFont));
                        addDocumentFooterPhrase2Newline = true;
                    }

                    if (addDocumentFooterPhrase2Newline)
                    {
                        documentFooterPhrase2.Add(new Chunk($"\n", normalFont));
                        documentFooterParagraph.Add(documentFooterPhrase2);
                    }

                    var documentFooterPhrase3 = new Phrase();

                    var addDocumentFooterPhrase3Newline = false;

                    if (input.DocumentFooter.DocumentFooterLabel3 != null)
                    {
                        documentFooterPhrase3.Add(new Chunk($"{input.DocumentFooter.DocumentFooterLabel3}", boldFont));
                        addDocumentFooterPhrase3Newline = true;
                    }

                    if (input.DocumentFooter.DocumentFooterValue3 != null)
                    {
                        documentFooterPhrase3.Add(new Chunk($"{input.DocumentFooter.DocumentFooterValue3}", normalFont));
                        addDocumentFooterPhrase3Newline = true;
                    }

                    if (addDocumentFooterPhrase3Newline)
                    {
                        documentFooterPhrase3.Add(new Chunk($"\n", normalFont));
                        documentFooterParagraph.Add(documentFooterPhrase3);
                    }

                    var documentFooterPhrase4 = new Phrase();

                    var addDocumentFooterPhrase4Newline = false;

                    if (input.DocumentFooter.DocumentFooterLabel4 != null)
                    {
                        documentFooterPhrase4.Add(new Chunk($"{input.DocumentFooter.DocumentFooterLabel4}", boldFont));
                        addDocumentFooterPhrase4Newline = true;
                    }

                    if (input.DocumentFooter.DocumentFooterValue4 != null)
                    {
                        documentFooterPhrase4.Add(new Chunk($"{input.DocumentFooter.DocumentFooterValue4}", normalFont));
                        addDocumentFooterPhrase4Newline = true;
                    }

                    if (addDocumentFooterPhrase4Newline)
                    {
                        documentFooterPhrase4.Add(new Chunk($"\n", normalFont));
                        documentFooterParagraph.Add(documentFooterPhrase4);
                    }

                    var addDocumentFooterParagraphs = false;

                    List<Paragraph> documentFooterParagraphCollection = new List<Paragraph>();

                    if (input.DocumentFooter.DocumentFooterParagraphsJSON != null)
                    {
                        documentFooterParagraphCollection = ProcessJsonParagraphs(rootPath, input.DocumentFooter.DocumentFooterParagraphs).ToList();
                    }

                    if (documentFooterParagraphCollection.Any())
                    {
                        addDocumentFooterParagraphs = true;
                    }

                    if (addDocumentFooterPhrase1Newline ||
                        addDocumentFooterPhrase2Newline ||
                        addDocumentFooterPhrase3Newline ||
                        addDocumentFooterPhrase4Newline ||
                        addDocumentFooterParagraphs)
                    {
                        var documentFooterCell = new PdfPCell();

                        documentFooterCell.Border = 0;

                        documentFooterCell.Padding = 0;
                        documentFooterCell.PaddingTop = 24.0f;

                        documentFooterCell.UseAscender = true;

                        documentFooterCell.AddElement(documentFooterParagraph);

                        foreach (var dfp in documentFooterParagraphCollection)
                        {
                            dfp.SpacingBefore = 12.0f;
                            dfp.SpacingAfter = 0.0f;
                            documentFooterCell.AddElement(dfp);
                        }

                        PdfPTable documentFooterTable = new PdfPTable(1);

                        documentFooterTable.WidthPercentage = 100.0f;

                        documentFooterTable.SetWidths(new float[] { 100.0f });

                        documentFooterTable.AddCell(documentFooterCell);

                        document.Add(documentFooterTable);
                    }

                    #endregion
                }

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

                    headerTable = GetDocumentHeaderTable( /// I want to be providing teh DocumentType from HERE. I need to know the index of the current orderHead.
                        dgLogo, 
                        input.DocumentPreHeader,
                        orderHead.OrderIdentifier,
                        i, 
                        orderHeadPages,                                                         
                        normalFont, 
                        boldFont,
                        orderHeadIndex + 1,
                        input.OrderHeaders.Count);

                    headerTable.WriteSelectedRows(0, -1, 25, 812, c); // write stuff to it

                    pageFooterTable.WriteSelectedRows(0, -1, 25, pageFooterTable.TotalHeight + 30.0f, c); // write more stuff to it
                }

                orderHeadStamper.Close(); // close the stamper

                orderHeadReader.Close(); // close the reader

                streams.Add(orderHeadStamperStream); // the stamper stream now has the combination of output and stamping
            }

            iTextSharp.text.Document finalDocument = new iTextSharp.text.Document();

            PdfCopy copy = new PdfCopy(finalDocument, finalStream);

            copy.CloseStream = false;

            finalDocument.Open();

            finalDocument.AddTitle($"{input.DocumentPreHeader.HeaderDocumentType}: {String.Join(" - ", input.OrderHeaders.Select(p => p.OrderIdentifier).ToArray())}");

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

            var count = input.OrderHeaders.Any() ? input.OrderHeaders.Count : reader.NumberOfPages; // for all the pages in the final document...

            for (var i = 1; i <= count; i++) // for each page found in reader
            {
                counter++;

                var c = stamper.GetOverContent(i); // get the page

                var headerTable = new PdfPTable(2);

                headerTable = GetPageNumberTable(dgLogo, i, count, input.DocumentPreHeader, normalFont, boldFont);
                //headerTable.WriteSelectedRows(0, -1, 25, 812, c); // write stuff to it
            }

            stamper.Close(); // close the stamper

            reader.Close(); // close the reader

            dgImage.Dispose();

            stopWatch.Stop();

            System.Diagnostics.Debug.WriteLine($"Processing Basket Receipt PDF took {stopWatch.Elapsed}");

            finalStream.Close();

            return stamperStream;
        }

        internal static ICollection<Paragraph> ProcessTextBlock(string rootPath, string textBlock)
        {
            BaseFont gillSansMt = BaseFont.CreateFont(rootPath + "Content/fonts/Gill-Sans-MT.ttf", BaseFont.CP1252, BaseFont.EMBEDDED);

            var normalFont = new Font(gillSansMt, 10, Font.NORMAL, BaseColor.BLACK);
            var italicFont = new Font(gillSansMt, 10, Font.ITALIC, BaseColor.BLACK);
            var boldFont = new Font(gillSansMt, 10, Font.BOLD, BaseColor.BLACK);
            var underlined = new Font(gillSansMt, 10, Font.UNDERLINE, BaseColor.BLACK);

            var smallerFont = new Font(gillSansMt, 9, Font.NORMAL, BaseColor.BLACK);

            var smallerItalicFont = FontFactory.GetFont("Arial", 9, Font.ITALIC, BaseColor.BLACK);

            var italicBold = FontFactory.GetFont("Arial", 10, Font.BOLDITALIC, BaseColor.BLACK);

            var italicUnderlined = FontFactory.GetFont("Arial", 10, Font.ITALIC | Font.UNDERLINE, BaseColor.BLACK);

            var boldUnderlined = FontFactory.GetFont("Arial", 10, Font.BOLD | Font.UNDERLINE, BaseColor.BLACK);

            var italicBoldUnderlined = FontFactory.GetFont("Arial", 10, Font.UNDERLINE | Font.BOLDITALIC, BaseColor.BLACK);

            var footerNormalFont = FontFactory.GetFont("Arial", 8, Font.NORMAL, BaseColor.BLACK);

            var footerBoldFont = FontFactory.GetFont("Arial", 8, Font.BOLD, BaseColor.BLACK);

            var boldTagOpen = "{b}";
            var boldTagClose = "{/b}";

            List<Paragraph> result = new List<Paragraph>();

            if (!String.IsNullOrEmpty(textBlock))
            {
                textBlock = textBlock.Replace("\t", "").Replace("&gt;", ">").Replace("&lt;", "<");

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

                                Chunk c = new Chunk(subString, normalFont);

                                chunks.Add(c);

                                boldTagEnd = line.IndexOf("{/b}");

                                var boldString = line.Substring(boldTagOpen.Length, boldTagEnd - boldTagClose.Length + 1);

                                Chunk b = new Chunk(boldString, boldFont);

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
                                Chunk c = new Chunk(line, normalFont);
                                chunks.Add(c);
                                line = "";
                            }
                        }
                        else
                        {
                            // we have no bold tag, turn this line directly into a chunk and add it to the list.
                            // remember to set the length to 0 so our while loop ends.
                            Chunk c = new Chunk(line, normalFont);
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

        internal static ICollection<Paragraph> ProcessJsonParagraphs(string rootPath, ICollection<JsonParagraph> paragraphs, float standardSize = 10, bool forceMonospaced = false, bool trimTrailingNewline = false)
        {
            BaseFont baseFont = BaseFont.CreateFont(rootPath + "Content/fonts/Gill-Sans-MT.ttf", BaseFont.CP1252, BaseFont.EMBEDDED);

            if (forceMonospaced)
            {
                baseFont = BaseFont.CreateFont(BaseFont.COURIER, BaseFont.CP1252, BaseFont.EMBEDDED);
            }

            var smallItalicFont = FontFactory.GetFont("Arial", standardSize - 1, Font.ITALIC, BaseColor.BLACK);

            var italicBold = FontFactory.GetFont("Arial", standardSize - 1, Font.BOLDITALIC, BaseColor.BLACK);

            var smallNormalFont = FontFactory.GetFont("Arial", standardSize - 2, Font.NORMAL, BaseColor.BLACK);

            var smallBoldFont = FontFactory.GetFont("Arial", standardSize - 2, Font.BOLD, BaseColor.BLACK);

            var normalFont = new Font(baseFont, standardSize, Font.NORMAL, BaseColor.BLACK);
            var italicFont = new Font(baseFont, standardSize, Font.ITALIC, BaseColor.BLACK);
            var underlined = new Font(baseFont, standardSize, Font.UNDERLINE, BaseColor.BLACK);
            var italicBoldUnderlined = FontFactory.GetFont("Arial", standardSize - 1, Font.UNDERLINE | Font.BOLDITALIC, BaseColor.BLACK);
            var boldFont = FontFactory.GetFont("Arial", standardSize - 1, Font.BOLD, BaseColor.BLACK);
            var italicUnderlined = new Font(baseFont, standardSize, Font.ITALIC | Font.UNDERLINE, BaseColor.BLACK);
            var boldUnderlined = FontFactory.GetFont("Arial", standardSize - 1, Font.BOLD | Font.UNDERLINE, BaseColor.BLACK);

            var smallerFont = new Font(baseFont, standardSize - 1, Font.NORMAL, BaseColor.BLACK);

            List<Paragraph> result = new List<Paragraph>();

            foreach (var jsonParagraph in paragraphs)
            {
                var paragraph = new Paragraph();

                if (jsonParagraph.monospaced)
                {
                    baseFont = BaseFont.CreateFont(BaseFont.COURIER, BaseFont.CP1252, BaseFont.EMBEDDED);
                }
                else
                {
                    baseFont = BaseFont.CreateFont(rootPath + "Content/fonts/Gill-Sans-MT.ttf", BaseFont.CP1252, BaseFont.EMBEDDED);
                }

                normalFont = new Font(baseFont, standardSize, Font.NORMAL, BaseColor.BLACK);
                italicFont = new Font(baseFont, standardSize, Font.ITALIC, BaseColor.BLACK);
                underlined = new Font(baseFont, standardSize, Font.UNDERLINE, BaseColor.BLACK);
                italicBoldUnderlined = FontFactory.GetFont("Arial", standardSize - 1, Font.UNDERLINE | Font.BOLDITALIC, BaseColor.BLACK);
                boldFont = FontFactory.GetFont("Arial", standardSize - 1, Font.BOLD, BaseColor.BLACK);
                italicUnderlined = new Font(baseFont, standardSize, Font.ITALIC | Font.UNDERLINE, BaseColor.BLACK);
                boldUnderlined = FontFactory.GetFont("Arial", standardSize - 1, Font.BOLD | Font.UNDERLINE, BaseColor.BLACK);
                smallerFont = new Font(baseFont, standardSize - 1, Font.NORMAL, BaseColor.BLACK);

                paragraph.SpacingBefore = 0.0f;
                paragraph.SpacingAfter = 10.0f;
                paragraph.Leading = Convert.ToSingle(jsonParagraph.leading ?? 14);

                switch (jsonParagraph.textAlign)
                {
                    case "left":
                        paragraph.Alignment = Element.ALIGN_LEFT;
                        break;
                    case "right":
                        paragraph.Alignment = Element.ALIGN_RIGHT;
                        break;
                }

                string textBlock = jsonParagraph.text.Replace("&gt;", ">").Replace("&lt;", "<");

                if (trimTrailingNewline)
                {
                    textBlock = textBlock.TrimEnd(new char[] { '\n' });
                }

                if (!String.IsNullOrEmpty(textBlock))
                {
                    //textBlock = textBlock.Replace("\t", "");

                    string[] lines = textBlock.Split(new string[] { Environment.NewLine }, StringSplitOptions.None);

                    for (var i = 0; i < lines.Length; i++)
                    {
                        var line = lines[i];

                        // right... how do we parse for smart tags then, smartguy?

                        // each line will be formed of one or more Chunks.

                        // REGEX to the rescue!

                        var openings = Regex.Matches(line, "{[bius]+}").Cast<Match>().Select(p => p.Value).ToList();

                        List<Chunk> chunks = new List<Chunk>();

                        while (line.Length > 0) // we'll have to loop to know when we've parsed the whole line; might as well parse it destructively
                        {
                            if (openings.Any())
                            {
                                foreach (var match in openings)
                                {
                                    var start = line.IndexOf(match);

                                    var ending = Regex.Matches(line, "{\\/[bius]+}").Cast<Match>().Select(p => p.Value).FirstOrDefault();

                                    if (start > -1 && ending != null)
                                    {
                                        var end = line.IndexOf(ending);

                                        if (ending.Replace("/", "").Replace("{", "").Replace("}", "") == match.Replace("{", "").Replace("}", ""))
                                        {
                                            // we have a tag in our line
                                            if (end > start)
                                            {
                                                // we have a tag end, further along in our line than the start: valid tag! parse it into a new chunk.
                                                var subString = line.Substring(0, start);

                                                line = line.Substring(start);

                                                Font font = null;

                                                switch (match)
                                                {
                                                    case "{s}":
                                                        font = smallNormalFont;
                                                        break;
                                                    case "{sb}":
                                                    case "{bs}":
                                                        font = smallBoldFont;
                                                        break;
                                                    case "{si}":
                                                    case "{is}":
                                                        font = smallItalicFont;
                                                        break;
                                                    case "{u}":
                                                        font = underlined;
                                                        break;
                                                    case "{b}":
                                                        font = boldFont;
                                                        break;
                                                    case "{bu}":
                                                    case "{ub}":
                                                        font = boldUnderlined;
                                                        break;
                                                    case "{bi}":
                                                    case "{ib}":
                                                        font = italicBold;
                                                        break;
                                                    case "{i}":
                                                        font = italicFont;
                                                        break;
                                                    case "{iu}":
                                                    case "{ui}":
                                                        font = italicUnderlined;
                                                        break;
                                                    case "{biu}":
                                                    case "{bui}":
                                                    case "{ibu}":
                                                    case "{iub}":
                                                    case "{uib}":
                                                    case "{ubi}":
                                                        font = italicBoldUnderlined;
                                                        break;
                                                }

                                                Chunk c = new Chunk(subString, normalFont);

                                                chunks.Add(c);

                                                var affectedString = line.Substring(match.Length, line.IndexOf(ending) - match.Length);

                                                if (affectedString.Trim() == "")
                                                {
                                                    affectedString = Regex.Replace(affectedString, " ", $"\u00a0");
                                                }

                                                Chunk b = new Chunk(affectedString, font);

                                                chunks.Add(b);

                                                line = line.Substring((affectedString.Length + match.Length + ending.Length));
                                            }
                                            else
                                            {
                                                // we have some positioning error with our bold start and end tags (at least the first ones). Ignore all of them and consume the line.
                                                Chunk c = new Chunk(line, normalFont);
                                                chunks.Add(c);
                                                line = "";
                                            }
                                        }
                                        else
                                        {
                                            // we have no bold tag, turn this line directly into a chunk and add it to the list.
                                            // remember to set the length to 0 so our while loop ends.
                                            Chunk c = new Chunk(line, normalFont);
                                            chunks.Add(c);
                                            line = "";
                                        }
                                    }
                                    else
                                    {
                                        // we have no bold tag, turn this line directly into a chunk and add it to the list.
                                        // remember to set the length to 0 so our while loop ends.
                                        Chunk c = new Chunk(line, normalFont);
                                        chunks.Add(c);
                                        line = "";
                                    }
                                }
                            }
                            else
                            {
                                // we have no bold tag, turn this line directly into a chunk and add it to the list.
                                // remember to set the length to 0 so our while loop ends.
                                Chunk c = new Chunk(line, normalFont);
                                chunks.Add(c);
                                line = "";
                            }
                        } // as long as we remember to actually destroy it as we go

                        var phrase = new Phrase();

                        foreach (var c in chunks)
                        {
                            if (c == chunks.Last())
                            {
                                if (c.Content == System.Environment.NewLine)
                                {
                                    continue;
                                }
                            }
                            phrase.Add(c);
                        }

                        phrase.Add(new Chunk(Environment.NewLine, normalFont));

                        paragraph.Add(phrase);
                    }
                }
                result.Add(paragraph);
            }
            return result;
        }

        internal static PdfPTable GetDocumentHeaderTable(
            Image logo, 
            DocumentPreHeader preHeader, 
            string orderIdentifier, 
            int x,
            int y,
            iTextSharp.text.Font normalFont, 
            iTextSharp.text.Font boldFont,
            int orderHeadIndex,
            int orderHeadCount) 
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

            var DocumentTypeLabelChunk = new Chunk($"{preHeader.HeaderDocumentType}: ", boldFont);
            var OrderHeadIndexChunk = new Chunk($"{orderHeadIndex} {preHeader.HeaderOfLabel} {orderHeadCount}", normalFont);
            var OrderHeadCountPhrase = new Phrase();
            OrderHeadCountPhrase.Add(DocumentTypeLabelChunk);
            OrderHeadCountPhrase.Add(OrderHeadIndexChunk);

            RightParagraph.Add(OrderHeadCountPhrase);

            var OrderLabelChunk = new Chunk($"{preHeader.HeaderOrderIdentifierLabel}: ", boldFont);
            //var orderIdSplitIntoThrees = String.Join(" ", CustomExtensions.Split(orderIdentifier.ToString(), 3).ToArray());
            var OrderIDChunk = new Chunk($"{orderIdentifier} ({Receipts.PageLabel} {x} {Receipts.Of} {y})", normalFont);
            //var OrderIDChunk = new Chunk($"{orderIdentifier} ({Receipts.PageLabel} {x} {Receipts.Of} {y})", normalFont);
            var OrderNumberPhrase = new Phrase();
            OrderNumberPhrase.Add(OrderLabelChunk);
            OrderNumberPhrase.Add(OrderIDChunk);

            var DateLabelChunk = new Chunk($"{preHeader.HeaderDateLabel}: ", boldFont);
            var DateChunk = new Chunk($"{preHeader.HeaderDate}\n", normalFont);
            var DatePhrase = new Phrase();
            DatePhrase.Add(new Chunk("\n", normalFont));
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

        internal static PdfPTable GetPageNumberTable(Image logo, int x, int y, DocumentPreHeader preHeader, iTextSharp.text.Font normal, iTextSharp.text.Font bold)
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

            //var PageLabelChunk = new Chunk($"{preHeader.HeaderDocumentType}: ", bold);
            //var PageNumberChunk = new Chunk($"{x} {preHeader.HeaderOfLabel} {y}\n", normal);
            //var PageNumberPhrase = new Phrase();
            //PageNumberPhrase.Add(PageLabelChunk);
            //PageNumberPhrase.Add(PageNumberChunk);

            //RightParagraph.Add(PageNumberPhrase);

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