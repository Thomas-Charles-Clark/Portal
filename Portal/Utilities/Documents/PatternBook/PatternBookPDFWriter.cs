
using iTextSharp.text;
using iTextSharp.text.pdf;

using Microsoft.PowerShell.Commands;

using Org.BouncyCastle.Crypto;

using Resources;

using SharedEFClasses.Models.Products;

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

using Unity.Interception.Utilities;

namespace Portal.Utilities.Documents.PatternBook
{
    public static class PatternBookPDFWriter
    {
        public static MemoryStream GenerateReceipt(string rootPath, string patternBookCode, string patternBookName, IEnumerable<ProductSearchResultFlat> products)
        {
            var stopWatch = new System.Diagnostics.Stopwatch();

            var finalStream = new MemoryStream();

            BaseFont gillSansMt = BaseFont.CreateFont(rootPath + "Content/fonts/Gill-Sans-MT.ttf", BaseFont.CP1252, BaseFont.EMBEDDED);

            stopWatch.Start();

            System.Globalization.NumberFormatInfo nfi = new System.Globalization.CultureInfo("en-GB").NumberFormat;

            var current = products.Where(p => p.Status == "Current").ToList();

            var limited = products.Where(p => p.Status == "Limited").ToList();

            var discontinued = products.Where(p => p.Status == "Discontinued").ToList();

            iTextSharp.text.Font normalFont = new Font(gillSansMt, 11, Font.NORMAL, BaseColor.BLACK);
            //FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.NORMAL, BaseColor.BLACK);
            iTextSharp.text.Font smallerFont = new Font(gillSansMt, 10, Font.NORMAL, BaseColor.BLACK);
            //FontFactory.GetFont("Arial", 9, iTextSharp.text.Font.NORMAL, BaseColor.BLACK);
            iTextSharp.text.Font smallerItalicFont = FontFactory.GetFont("Arial", 9, iTextSharp.text.Font.ITALIC, BaseColor.BLACK);
            iTextSharp.text.Font boldFont = FontFactory.GetFont("Arial", 11, iTextSharp.text.Font.BOLD, BaseColor.BLACK);
            iTextSharp.text.Font footerNormalFont = FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL, BaseColor.BLACK);
            iTextSharp.text.Font footerBoldFont = FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD, BaseColor.BLACK);

            System.Drawing.Image dgImage = System.Drawing.Image.FromFile(AppDomain.CurrentDomain.BaseDirectory + "/Content/Images/Logos/designers-guild.jpg");

            Image dgLogo = Image.GetInstance(dgImage, System.Drawing.Imaging.ImageFormat.Jpeg);

            dgLogo.ScaleAbsolute(280.0f, 21.0f);

            var streams = new List<MemoryStream>();

            var documentDate = DateTime.Now;

            var columnCount = 4;

            var output = new MemoryStream();

            var footerTable = new PdfPTable(1);

            footerTable.TotalWidth = 545.0f;
            footerTable.LockedWidth = true;
            footerTable.DefaultCell.Border = 0;
            footerTable.DefaultCell.Padding = 3;
            footerTable.DefaultCell.BorderWidth = 0;
            footerTable.DefaultCell.VerticalAlignment = Element.ALIGN_TOP;
            footerTable.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;

            var footerParagraphWrapper = new Paragraph();

            footerParagraphWrapper.SpacingAfter = 10.0f;

            var footerChunk = new Chunk("Thank you for your interest in Designers Guild.");

            var footerPhrase = new Phrase(footerChunk);

            footerParagraphWrapper.Add(footerPhrase);

            var footerCell = new PdfPCell();

            footerCell.Border = 0;
            footerCell.Padding = 0;
            footerCell.PaddingBottom = 10.0f;

            footerCell.AddElement(footerParagraphWrapper);

            footerTable.AddCell(footerCell);
            
            var headingParagraphs = ProcessTextBlock($@"Dear Customer,
Please find below information on products in Pattern Book {patternBookCode}, ""{patternBookName}"".
Stock levels stated were accurate as at {documentDate:dd/MM/yyyy}", normalFont, boldFont);

            var headingParagraphWrapper = new Paragraph();

            headingParagraphWrapper.SpacingAfter = 10.0f;

            foreach (var p in headingParagraphs)
            {
                headingParagraphWrapper.Add(p);
            }

            var document = new iTextSharp.text.Document(PageSize.A4, 25, 25, 80, 25);// footerTable.TotalHeight + 30.0f);

            var writer = PdfWriter.GetInstance(document, output);

            PdfPTable headingTable = new PdfPTable(1);
            headingTable.WidthPercentage = 100.0f;
            headingTable.SetWidths(new float[] { 100.0f });
            headingTable.SpacingAfter = 10.0f;

            PdfPCell headingCell = new PdfPCell();
            headingCell.Border = 0;
            headingCell.Padding = 0;
            headingCell.UseAscender = true;

            writer.CloseStream = false;

            document.Open();

            headingCell.AddElement(headingParagraphWrapper);

            headingTable.AddCell(headingCell);

            document.Add(headingTable);

            var columnWidths = new List<int>() { 100 };

            if (current.Any())
            {
                var currentTable = new PdfPTable(columnCount);

                currentTable.WidthPercentage = 100.0f;
                currentTable.DefaultCell.Border = 0;
                currentTable.DefaultCell.Padding = 0;
                currentTable.DefaultCell.BorderWidth = 0;
                currentTable.DefaultCell.VerticalAlignment = Element.ALIGN_TOP;
                currentTable.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;
                currentTable.SpacingAfter = 10.0f;

                var currentParagraphs = ProcessTextBlock("The following products are {b}Current{/b}:", normalFont, boldFont);

                var currentTextCell = new PdfPCell();

                currentTextCell.Colspan = 4;
                currentTextCell.Border = 0;
                currentTextCell.Padding = 0;
                currentTextCell.PaddingBottom = 8;
                currentTextCell.BorderWidth = 0;
                currentTextCell.UseAscender = true;
                currentTextCell.VerticalAlignment = Element.ALIGN_TOP;
                currentTextCell.HorizontalAlignment = Element.ALIGN_LEFT;

                foreach (var p in currentParagraphs)
                {
                    currentTextCell.AddElement(p);
                }

                currentTable.AddCell(currentTextCell);

                foreach(var c in current)
                {
                    var cell = new PdfPCell();

                    cell.Border = 0;
                    cell.Padding = 3;
                    cell.PaddingBottom = 12;
                    cell.BorderWidth = 0;
                    cell.VerticalAlignment = Element.ALIGN_TOP;
                    cell.HorizontalAlignment = Element.ALIGN_LEFT;

                    var thumb = Image.GetInstance(new Uri($"https://www.designersguild.com/image-nonwebp/239/{c.ImageID}"));

                    cell.AddElement(thumb);

                    var cellParagraphs = ProcessTextBlock($@"{c.BasketName}
{c.Code}
{c.Available}{c.Units}
{(c.RRP.HasValue ? @"RRP: " + c.RRP.Value.ToString("C") : "")}", normalFont, boldFont);

                    foreach (var p in cellParagraphs)
                    {
                        cell.AddElement(p);
                    }

                    currentTable.AddCell(cell);
                }

                currentTable.CompleteRow();

                document.Add(currentTable);
            }

            if (limited.Any())
            {
                if (current.Any())
                {
                    document.Add(Chunk.NEXTPAGE);
                }

                var limitedTable = new PdfPTable(columnCount);

                limitedTable.TotalWidth = 545.0f;
                limitedTable.LockedWidth = true;
                limitedTable.DefaultCell.Border = 0;
                limitedTable.DefaultCell.Padding = 3;
                limitedTable.DefaultCell.BorderWidth = 0;
                limitedTable.DefaultCell.VerticalAlignment = Element.ALIGN_TOP;
                limitedTable.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;
                limitedTable.SpacingAfter = 10.0f;

                var limitedParagraphs = ProcessTextBlock("The following products are {b}Limited{/b}:", normalFont, boldFont);

                var limitedTextCell = new PdfPCell();

                limitedTextCell.Colspan = 4;
                limitedTextCell.Border = 0;
                limitedTextCell.Padding = 0;
                limitedTextCell.PaddingBottom = 8;
                limitedTextCell.BorderWidth = 0;
                limitedTextCell.UseAscender = true;
                limitedTextCell.VerticalAlignment = Element.ALIGN_TOP;
                limitedTextCell.HorizontalAlignment = Element.ALIGN_LEFT;

                foreach (var p in limitedParagraphs)
                {
                    limitedTextCell.AddElement(p);
                }

                limitedTable.AddCell(limitedTextCell);

                foreach (var l in limited)
                {
                    var cell = new PdfPCell();

                    cell.Border = 0;
                    cell.Padding = 3;
                    cell.PaddingBottom = 12;
                    cell.BorderWidth = 0;
                    cell.VerticalAlignment = Element.ALIGN_TOP;
                    cell.HorizontalAlignment = Element.ALIGN_LEFT;

                    var thumb = Image.GetInstance(new Uri($"https://www.designersguild.com/image-nonwebp/239/{l.ImageID}"));

                    cell.AddElement(thumb);

                    var cellParagraphs = ProcessTextBlock($@"{l.BasketName}
{l.Code}
{l.Available}{l.Units}
{(l.RRP.HasValue ? @"RRP: " + l.RRP.Value.ToString("C") : "")}", normalFont, boldFont);

                    foreach (var p in cellParagraphs)
                    {
                        cell.AddElement(p);
                    }

                    limitedTable.AddCell(cell);
                }

                limitedTable.CompleteRow();

                document.Add(limitedTable);
            }

            if (discontinued.Any())
            {
                if (limited.Any())
                {
                    document.Add(Chunk.NEXTPAGE);
                }

                var discoTable = new PdfPTable(columnCount);

                discoTable.TotalWidth = 545.0f;
                discoTable.LockedWidth = true;
                discoTable.DefaultCell.Border = 0;
                discoTable.DefaultCell.Padding = 3;
                discoTable.DefaultCell.BorderWidth = 0;
                discoTable.DefaultCell.VerticalAlignment = Element.ALIGN_TOP;
                discoTable.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;
                discoTable.SpacingAfter = 10.0f;

                var discoParagraphs = ProcessTextBlock("The following products are {b}Discontinued{/b} and cannot be ordered:", normalFont, boldFont);

                var discoTextCell = new PdfPCell();

                discoTextCell.Colspan = 4;
                discoTextCell.Border = 0;
                discoTextCell.Padding = 0;
                discoTextCell.PaddingBottom = 8;
                discoTextCell.BorderWidth = 0;
                discoTextCell.UseAscender = true;
                discoTextCell.VerticalAlignment = Element.ALIGN_TOP;
                discoTextCell.HorizontalAlignment = Element.ALIGN_LEFT;

                foreach (var p in discoParagraphs)
                {
                    discoTextCell.AddElement(p);
                }

                discoTable.AddCell(discoTextCell);

                foreach (var d in discontinued)
                {
                    var cell = new PdfPCell();

                    cell.Border = 0;
                    cell.Padding = 3;
                    cell.PaddingBottom = 12;
                    cell.BorderWidth = 0;
                    cell.VerticalAlignment = Element.ALIGN_TOP;
                    cell.HorizontalAlignment = Element.ALIGN_LEFT;

                    var thumb = Image.GetInstance(new Uri($"https://www.designersguild.com/image-nonwebp/239/{d.ImageID}"));

                    cell.AddElement(thumb);

                    var cellParagraphs = ProcessTextBlock($@"{d.BasketName}
{d.Code}", normalFont, boldFont);

                    foreach (var p in cellParagraphs)
                    {
                        cell.AddElement(p);
                    }

                    discoTable.AddCell(cell);
                }

                discoTable.CompleteRow();

                document.Add(discoTable);
            }

            document.Close();

            iTextSharp.text.Document finalDocument = new iTextSharp.text.Document();

            PdfCopy copy = new PdfCopy(finalDocument, finalStream);

            copy.CloseStream = false;

            finalDocument.Open();

            streams.Add(output);

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

            var counter = 0;

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

            System.Diagnostics.Debug.WriteLine($"Processing Pattern Book PDF took {stopWatch.Elapsed}");

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
                    paragraph.SpacingAfter = 0.0f;

                    paragraph.Add(phrase);

                    result.Add(paragraph);
                }
            }

            return result;
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
            LeftHeaderCell.AddElement(logo);

            RightHeaderCell.Padding = 0;
            RightHeaderCell.HorizontalAlignment = Element.ALIGN_RIGHT;
            RightHeaderCell.Border = 0;

            HeaderTable.AddCell(LeftHeaderCell);

            PdfPTable RightTable = new PdfPTable(1);
            RightTable.WidthPercentage = 100.0f;
            RightTable.DefaultCell.HorizontalAlignment = Element.ALIGN_RIGHT;

            var RightParagraph = new Paragraph();
            RightParagraph.Alignment = Element.ALIGN_RIGHT;

            var PageLabelChunk = new Chunk($"Page: ", bold);
            var PageNumberChunk = new Chunk($"{x} of {y}\n", normal);
            var PageNumberPhrase = new Phrase();
            PageNumberPhrase.Add(PageLabelChunk);
            PageNumberPhrase.Add(PageNumberChunk);

            RightParagraph.Add(PageNumberPhrase);

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