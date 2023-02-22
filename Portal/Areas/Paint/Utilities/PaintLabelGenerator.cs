using HtmlAgilityPack;
using iTextSharp.text.pdf;
using iTextSharp.tool.xml;

using Org.BouncyCastle.Utilities.IO;

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

namespace Portal.Areas.Paint.Utilities
{
    public static class PaintLabelGenerator
    {
        public static byte[] GenerateBoxLabelPDF(PaintGenerateBoxLabelResponse objInput)
        {
            var finalStream = new MemoryStream();

            var pages = new List<byte[]>();

            foreach(var label in objInput.BoxLabels)
            {
                var inlined = PreMailer.Net.PreMailer.MoveCssInline(ViewRenderer.RenderView("~/Areas/Paint/Views/_PaintLabelTemplate.cshtml", label), false).Html;

                pages.Add(ConvertHTMLToPDFBytes(inlined));
            }

            //Create our copy object
            var copy = new PdfCopyFields(finalStream);

            //Loop through each MemoryStream
            foreach (var byteArray in pages)
            {
                copy.AddDocument(new PdfReader(byteArray));
            }

            //Close the copy object
            copy.Close();

            //Get the raw bytes
            return finalStream.ToArray();
        }

        public static byte[] GenerateTransferManifestPDF(PaintTransferSaveResponse objInput)
        {
            var finalStream = new MemoryStream();

            var pages = new List<byte[]>();

            var inlined = PreMailer.Net.PreMailer.MoveCssInline(ViewRenderer.RenderView("~/Areas/Paint/Views/_PaintTransferManifest.cshtml", objInput), false).Html;

            pages.Add(ConvertHTMLToPDFBytes(inlined));

            //Create our copy object
            var copy = new PdfCopyFields(finalStream);

            //Loop through each MemoryStream
            foreach (var byteArray in pages)
            {
                copy.AddDocument(new PdfReader(byteArray));
            }

            //Close the copy object
            copy.Close();

            //Get the raw bytes
            return finalStream.ToArray();
        }

        /// <summary>
        /// Cheers guys 
        /// https://stackoverflow.com/questions/25164257/how-to-convert-html-to-pdf-using-itextsharp
        /// https://stackoverflow.com/questions/8385690/merge-memorystreams-to-one-itext-document
        /// </summary>
        /// <param name="html"></param>
        /// <returns></returns>
        public static byte[] ConvertHTMLToPDFBytes(string html)
        {
            var bytes = new byte[] { };

            //Boilerplate iTextSharp setup here
            //Create a stream that we can write to, in this case a MemoryStream
            using (var ms = new MemoryStream())
            {
                //Create an iTextSharp Document which is an abstraction of a PDF but **NOT** a PDF
                using (var doc = new iTextSharp.text.Document())
                {
                    //Create a writer that's bound to our PDF abstraction and our stream
                    using (var writer = PdfWriter.GetInstance(doc, ms))
                    {
                        //Open the document for writing
                        doc.Open();

                        //Our sample HTML and CSS
                        var example_html = html;

                        HtmlDocument h = new HtmlDocument()
                        {
                            OptionFixNestedTags = true,
                            OptionWriteEmptyNodes = true
                        };
                        h.LoadHtml(html);

                        using (var htmlStream = new MemoryStream(Encoding.UTF8.GetBytes(h.DocumentNode.Descendants("body").Single().WriteTo())))
                        {
                            using (var cssStream = new MemoryStream(Encoding.UTF8.GetBytes("")))
                            {
                                XMLWorkerHelper.GetInstance().ParseXHtml(writer, doc, htmlStream, System.Text.Encoding.UTF8);
                            }
                        }

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

            return bytes;
        }
    }
}