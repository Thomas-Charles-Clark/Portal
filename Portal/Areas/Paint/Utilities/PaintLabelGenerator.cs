
using DocumentFormat.OpenXml.Drawing.Charts;

using HtmlAgilityPack;

using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.tool.xml;

using Org.BouncyCastle.Utilities.IO;

using Portal.Utilities.Basket;

using Resources;

using SharedEFClasses.Models;

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.UI;
using System.Web.UI.HtmlControls;

using Unity.Interception.Utilities;

namespace Portal.Areas.Paint.Utilities
{
    public static class PaintLabelGenerator
    {
        public static byte[] GenerateBoxLabelPDF(PaintGenerateBoxLabelResponse objInput)
        {
            iTextSharp.text.Font normalFont = FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.NORMAL, BaseColor.BLACK);
            iTextSharp.text.Font smallerFont = FontFactory.GetFont("Arial", 9, iTextSharp.text.Font.NORMAL, BaseColor.BLACK);
            iTextSharp.text.Font smallerItalicFont = FontFactory.GetFont("Arial", 9, iTextSharp.text.Font.ITALIC, BaseColor.BLACK);
            iTextSharp.text.Font boldFont = FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.BOLD, BaseColor.BLACK);
            iTextSharp.text.Font footerNormalFont = FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL, BaseColor.BLACK);
            iTextSharp.text.Font footerBoldFont = FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD, BaseColor.BLACK);

            System.Drawing.Image dgImage = System.Drawing.Image.FromFile(AppDomain.CurrentDomain.BaseDirectory + "Content\\Images\\Logos\\designers-guild.jpg");

            var dgLogo = Image.GetInstance(dgImage, System.Drawing.Imaging.ImageFormat.Jpeg);

            var finalStream = new MemoryStream();

            var pages = new List<(MemoryStream, string, string)>();

            foreach (var label in objInput.BoxLabels)
            {
                var html = ViewRenderer.RenderView("~/Areas/Paint/Views/Shared/_PaintLabelTemplate.cshtml", label);

                var inlined = PreMailer.Net.PreMailer.MoveCssInline(html, false).Html;

                pages.Add((ConvertHTMLToPDF(inlined, true), label.DespatchGroup, $"{label.BoxNumber} of {label.BoxCount}"));
            }

            ////Create our copy object
            //var copy = new PdfCopyFields(finalStream);

            ////Loop through each MemoryStream
            //foreach (var byteArray in pages)
            //{
            //    copy.AddDocument(new PdfReader(byteArray));
            //}

            dgLogo.ScaleAbsolute(280.0f, 21.0f);

            iTextSharp.text.Document finalDocument = new iTextSharp.text.Document(PageSize.A4, 15, 15, 80, 55);

            PdfCopy copy = new PdfCopy(finalDocument, finalStream);

            copy.CloseStream = false;

            finalDocument.Open();

            var pageErrataMap = new List<(int, string, string)>();

            foreach (var tuple in pages)
            {
                PdfReader thisReader = new PdfReader(tuple.Item1.ToArray());

                for (var i = 0; i < thisReader.NumberOfPages; i++)
                {
                    copy.AddPage(copy.GetImportedPage(thisReader, i + 1));
                    pageErrataMap.Add((i, tuple.Item2, tuple.Item3));
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

                headerTable = GetHeaderTable(dgLogo, i, count, normalFont, boldFont, false, new (string, string)[] { ("Despatch Group", pageErrataMap[i - 1].Item2), ("Box", pageErrataMap[i - 1].Item3) });
                headerTable.WriteSelectedRows(0, -1, 25, 812, c); // write stuff to it

                var footerTable = new PdfPTable(2);

                footerTable = GetFooterTable(i, count, normalFont, boldFont, true, null);
                footerTable.WriteSelectedRows(0, -1, 25, 32, c); // write stuff to it
            }

            ////Close the copy object
            //copy.Close();

            stamper.Close(); // close the stamper

            reader.Close(); // close the reader

            dgImage.Dispose();

            //Get the raw bytes
            return stamperStream.ToArray();

        }

        public static byte[] GenerateTransferManifestPDF(PaintTransferSaveResponse objInput)
        {
            iTextSharp.text.Font normalFont = FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.NORMAL, BaseColor.BLACK);
            iTextSharp.text.Font smallerFont = FontFactory.GetFont("Arial", 9, iTextSharp.text.Font.NORMAL, BaseColor.BLACK);
            iTextSharp.text.Font smallerItalicFont = FontFactory.GetFont("Arial", 9, iTextSharp.text.Font.ITALIC, BaseColor.BLACK);
            iTextSharp.text.Font boldFont = FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.BOLD, BaseColor.BLACK);
            iTextSharp.text.Font footerNormalFont = FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL, BaseColor.BLACK);
            iTextSharp.text.Font footerBoldFont = FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD, BaseColor.BLACK);

            System.Drawing.Image dgImage = System.Drawing.Image.FromFile(AppDomain.CurrentDomain.BaseDirectory + "Content\\Images\\Logos\\designers-guild.jpg");

            var dgLogo = Image.GetInstance(dgImage, System.Drawing.Imaging.ImageFormat.Jpeg);

            var finalStream = new MemoryStream();

            var pages = new List<MemoryStream>();

            var html = ViewRenderer.RenderView("~/Areas/Paint/Views/Shared/_PaintTransferManifest.cshtml", objInput);

            var inlined = PreMailer.Net.PreMailer.MoveCssInline(html, false).Html;

            var now = DateTime.Now.ToString("dd/MM/yyyy HH:mm");

            pages.Add(ConvertHTMLToPDF(inlined, false));

            dgLogo.ScaleAbsolute(280.0f, 21.0f);

            iTextSharp.text.Document finalDocument = new iTextSharp.text.Document(PageSize.A4, 15, 15, 80, 55);

            PdfCopy copy = new PdfCopy(finalDocument, finalStream);

            copy.CloseStream = false;

            finalDocument.Open();

            foreach (var stream in pages)
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

                headerTable = GetHeaderTable(dgLogo, i, count, normalFont, boldFont, true, new (string, string)[] { ("Generated", now) });
                headerTable.WriteSelectedRows(0, -1, 25, 812, c); // write stuff to it
            }

            ////Close the copy object
            //copy.Close();

            stamper.Close(); // close the stamper

            reader.Close(); // close the reader

            dgImage.Dispose();

            //Get the raw bytes
            return stamperStream.ToArray();




        }

        /// <summary>
        /// Cheers guys 
        /// https://stackoverflow.com/questions/25164257/how-to-convert-html-to-pdf-using-itextsharp
        /// https://stackoverflow.com/questions/8385690/merge-memorystreams-to-one-itext-document
        /// </summary>
        /// <param name="html"></param>
        /// <returns></returns>
        public static MemoryStream ConvertHTMLToPDF(string html, bool boxLabels)
        {
            iTextSharp.text.Font normalFont = FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.NORMAL, BaseColor.BLACK);
            iTextSharp.text.Font smallerFont = FontFactory.GetFont("Arial", 9, iTextSharp.text.Font.NORMAL, BaseColor.BLACK);
            iTextSharp.text.Font smallerItalicFont = FontFactory.GetFont("Arial", 9, iTextSharp.text.Font.ITALIC, BaseColor.BLACK);
            iTextSharp.text.Font boldFont = FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.BOLD, BaseColor.BLACK);
            iTextSharp.text.Font footerNormalFont = FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL, BaseColor.BLACK);
            iTextSharp.text.Font footerBoldFont = FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD, BaseColor.BLACK);

            var bytes = new byte[] { };

            //Boilerplate iTextSharp setup here
            //Create a stream that we can write to, in this case a MemoryStream
            using (var ms = new MemoryStream())
            {
                //Create an iTextSharp Document which is an abstraction of a PDF but **NOT** a PDF
                using (var doc = new iTextSharp.text.Document(PageSize.A4, 15, 15, 80, 55))
                {
                    var table = new PdfPTable(new float[] { PageSize.A4.Width });

                    var cell = new PdfPCell();

                    table.WidthPercentage = 100;

                    cell.Padding = 0;

                    cell.VerticalAlignment = Element.ALIGN_TOP;

                    cell.MinimumHeight = doc.PageSize.Height - 135;

                    cell.Border = 0;

                    cell.UseAscender = true;

                    //Create a writer that's bound to our PDF abstraction and our stream
                    using (var writer = PdfWriter.GetInstance(doc, ms))
                    {
                        if (boxLabels)
                            writer.PageEvent = new BoxLabelPDFEventHelper();

                        //Open the document for writing
                        doc.Open();

                        HtmlDocument h = new HtmlDocument()
                        {
                            OptionFixNestedTags = false,
                            OptionWriteEmptyNodes = true
                        };

                        h.LoadHtml(html);

                        var list = XMLWorkerHelper.ParseToElementList(h.DocumentNode.Descendants("html").Single().WriteTo(), "");

                        list.ForEach(l =>
                        {
                            if (boxLabels)
                            {
                                l.Chunks.ForEach(c =>
                                {
                                    c.Font = smallerFont;
                                });
                            }

                            if (l.IsContent())
                            {
                                cell.AddElement(l);
                            }
                        });

                        ////Our sample HTML and CSS
                        //var example_html = html;


                        //using (var htmlStream = new MemoryStream(Encoding.UTF8.GetBytes(h.DocumentNode.Descendants("html").Single().WriteTo())))
                        //{
                        //    using (var cssStream = new MemoryStream(Encoding.UTF8.GetBytes("")))
                        //    //using (var cssStream = new MemoryStream(System.IO.File.ReadAllBytes($"{AppDomain.CurrentDomain.BaseDirectory}css\\dist\\lib\\Bootstrap-3.3.7\\bootstrap-3.3.7.css")))
                        //    {

                        //        XMLWorkerHelper.GetInstance().ParseXHtml(writer, doc, htmlStream, cssStream, System.Text.Encoding.UTF8);
                        //    }
                        //}

                        table.AddCell(cell);

                        doc.Add(table);

                        /**************************************************
                            * Example #1                                     *
                            *                                                *
                            * Use the built-in HTMLWorker to parse the HTML. *
                            * Only inline CSS is supported.                  *
                            * ************************************************/

                        ////Create a new HTMLWorker bound to our document
                        //using (var htmlWorker = new iTextSharp.text.html.simpleparser.HTMLWorker(doc))
                        //{

                        //    //HTMLWorker doesn't read a string directly but instead needs a TextReader (which StringReader subclasses)
                        //    using (var sr = new StringReader(example_html))
                        //    {

                        //        //Parse the HTML
                        //        htmlWorker.Parse(sr);
                        //    }
                        //}

                        /**************************************************
                            * Example #2                                     *
                            *                                                *
                            * Use the XMLWorker to parse the HTML.           *
                            * Only inline CSS and absolutely linked          *
                            * CSS is supported                               *
                            * ************************************************/

                        ////XMLWorker also reads from a TextReader and not directly from a string
                        //using (var srHtml = new StringReader(example_html))
                        //{
                        //    //Parse the HTML
                        //    iTextSharp.tool.xml.XMLWorkerHelper.GetInstance().ParseXHtml(writer, doc, srHtml);
                        //}

                        /**************************************************
                            * Example #3                                     *
                            *                                                *
                            * Use the XMLWorker to parse HTML and CSS        *
                            * ************************************************/

                        ////In order to read CSS as a string we need to switch to a different constructor
                        ////that takes Streams instead of TextReaders.
                        ////Below we convert the strings into UTF8 byte array and wrap those in MemoryStreams
                        //using (var msCss = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(example_css)))
                        //{
                        //    using (var msHtml = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(example_html)))
                        //    {

                        //        //Parse the HTML
                        //        iTextSharp.tool.xml.XMLWorkerHelper.GetInstance().ParseXHtml(writer, doc, msHtml, msCss);
                        //    }
                        //}


                        doc.Close();
                    }
                }

                bytes = ms.ToArray();
            }

            return new MemoryStream(bytes);
        }

        internal static PdfPTable GetHeaderTable(Image logo, int x, int y, iTextSharp.text.Font normal, iTextSharp.text.Font bold, bool includePageNumber = true, IEnumerable<(string, string)> extraData = null)
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

            var TopRightPhrase = new Phrase();

            if (includePageNumber)
            {
                var PageLabelChunk = new Chunk($"Page: ", bold);
                var PageNumberChunk = new Chunk($"{x} {Receipts.Of} {y}\n", normal);
                TopRightPhrase.Add(PageLabelChunk);
                TopRightPhrase.Add(PageNumberChunk);
            }

            if (extraData != null && extraData.Any())
            {
                foreach (var ed in extraData)
                {
                    var label = new Chunk($"{ed.Item1}: ", bold);
                    TopRightPhrase.Add(label);

                    var value = new Chunk($"{ed.Item2}\n", normal);
                    TopRightPhrase.Add(value);
                }
            }

            RightParagraph.Add(TopRightPhrase);

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

        internal static PdfPTable GetFooterTable(int x, int y, iTextSharp.text.Font normal, iTextSharp.text.Font bold, bool includePageNumber = true, IEnumerable<(string, string)> extraData = null)
        {
            PdfPTable FooterTable = new PdfPTable(2);

            FooterTable.TotalWidth = 545.0f;

            // you add chunks to phrases and phrases to paragraphs.
            // you add new lines in chunks? and hope the paragraph can sort itself out?
            // if you don't use Cell.AddElement, the Paragraph that you're adding will take on the properties of the Cell and lose its own.
            // this is because it is "reduced to a phrase".

            var LeftFooterCell = new PdfPCell();
            LeftFooterCell.Border = 0;

            var RightFooterCell = new PdfPCell();

            RightFooterCell.Padding = 0;
            RightFooterCell.HorizontalAlignment = Element.ALIGN_RIGHT;
            RightFooterCell.Border = 0;

            FooterTable.AddCell(LeftFooterCell);

            PdfPTable RightTable = new PdfPTable(1);
            RightTable.WidthPercentage = 100.0f;
            RightTable.DefaultCell.HorizontalAlignment = Element.ALIGN_RIGHT;

            var RightParagraph = new Paragraph();
            RightParagraph.Alignment = Element.ALIGN_RIGHT;

            var TopRightPhrase = new Phrase();

            if (includePageNumber)
            {
                var PageLabelChunk = new Chunk($"Page: ", bold);
                var PageNumberChunk = new Chunk($"{x} {Receipts.Of} {y}\n", normal);
                TopRightPhrase.Add(PageLabelChunk);
                TopRightPhrase.Add(PageNumberChunk);
            }

            if (extraData != null && extraData.Any())
            {
                foreach (var ed in extraData)
                {
                    var label = new Chunk($"{ed.Item1}: ", bold);
                    TopRightPhrase.Add(label);

                    var value = new Chunk($"{ed.Item2}\n", normal);
                    TopRightPhrase.Add(value);
                }
            }

            RightParagraph.Add(TopRightPhrase);

            //RightParagraph.Add(new Phrase($"{Receipts.PageLabel} {x} {Receipts.Of} {y}", normal));

            PdfPCell RightCell = new PdfPCell();

            RightCell.Border = 0;
            RightCell.Padding = 0;

            RightCell.UseAscender = true;

            RightCell.AddElement(RightParagraph);

            RightTable.AddCell(RightCell);

            RightFooterCell.AddElement(RightTable);

            FooterTable.AddCell(RightFooterCell);

            return FooterTable;
        }
    }

    internal class BoxLabelPDFEventHelper : PdfPageEventHelper
    {
        // This is the contentbyte object of the writer
        //PdfContentByte cb;

        // we will put the final number of pages in a template
        //PdfTemplate headerTemplate, footerTemplate;

        // this is the BaseFont we are going to use for the header / footer
        //BaseFont bf = null;

        // This keeps track of the creation time
        DateTime PrintTime = DateTime.Now;

        #region Fields
        private string _header;
        #endregion

        #region Properties
        public string Header
        {
            get { return _header; }
            set { _header = value; }
        }
        #endregion

        public override void OnStartPage(iTextSharp.text.pdf.PdfWriter writer, iTextSharp.text.Document document)
        {
            base.OnEndPage(writer, document);
        }
    }
}