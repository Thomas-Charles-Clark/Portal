
using iTextSharp.text;
using iTextSharp.text.pdf;

using Microsoft.Ajax.Utilities;
using Microsoft.PowerShell.Commands;

using Org.BouncyCastle.Crypto;

using QRCoder;

using Resources;

using SharedEFClasses.Models;

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Remoting.Metadata;
using System.Text.RegularExpressions;
using System.Web;

using Unity.Interception.Utilities;

namespace Portal.Utilities.Documents.GiftVoucher
{
    public static class GiftVoucherPDFWriter
    {
        public static MemoryStream Generate(string rootPath, SharedEFClasses.Models.GiftVoucher giftVoucher)
        {
            var stopWatch = new System.Diagnostics.Stopwatch();

            var finalStream = new MemoryStream();

            BaseFont gillSansMt = BaseFont.CreateFont(rootPath + "Content/fonts/Gill-Sans-MT.ttf", BaseFont.CP1252, BaseFont.EMBEDDED);

            BaseFont cascadiaCodeMonoSemiLight = BaseFont.CreateFont(rootPath + "Content/fonts/CascadiaCode.ttf", BaseFont.CP1252, BaseFont.EMBEDDED);

            BaseFont kunstler = BaseFont.CreateFont(rootPath + "Content/fonts/kunstler.ttf", BaseFont.CP1252, BaseFont.EMBEDDED);

            stopWatch.Start();

            System.Globalization.NumberFormatInfo nfi = new System.Globalization.CultureInfo("en-GB").NumberFormat;

            var normalFont = new Font(gillSansMt, 11, Font.NORMAL, BaseColor.BLACK);
            var smallerFont = new Font(gillSansMt, 10, Font.NORMAL, BaseColor.BLACK);
            var hugeFont = new Font(gillSansMt, 42, Font.NORMAL, BaseColor.BLACK);
            var valueFont = new Font(gillSansMt, 64, Font.NORMAL, BaseColor.WHITE);
            var hugeFontWhiteCascadia = new Font(cascadiaCodeMonoSemiLight, 32, Font.NORMAL, BaseColor.WHITE);
            var normalFontWhiteCascadia = new Font(cascadiaCodeMonoSemiLight, 12, Font.NORMAL, BaseColor.WHITE);
            var hugeFontWhiteKunstler = new Font(kunstler, 52, Font.NORMAL, BaseColor.WHITE);
            var smallerItalicFont = FontFactory.GetFont("Arial", 9, iTextSharp.text.Font.ITALIC, BaseColor.BLACK);
            var boldFont = FontFactory.GetFont("Arial", 11, iTextSharp.text.Font.BOLD, BaseColor.BLACK);
            var footerNormalFont = FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL, BaseColor.BLACK);
            var footerBoldFont = FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD, BaseColor.BLACK);
            var codeFont = FontFactory.GetFont("Consolas", 32, iTextSharp.text.Font.BOLD, BaseColor.BLACK);

            System.Drawing.Image dgImage = System.Drawing.Image.FromFile(AppDomain.CurrentDomain.BaseDirectory + "/Content/Images/Logos/designers-guild-transparent-inversion.png");

            Image dgLogo = Image.GetInstance(dgImage, System.Drawing.Imaging.ImageFormat.Png);

            dgLogo.ScaleAbsolute(280.0f, 26.0f);

            var streams = new List<MemoryStream>();

            var documentDate = DateTime.Now;

            var columnCount = 4;

            var output = new MemoryStream();

            var table = new PdfPTable(columnCount);

            table.TotalWidth = 545.0f;
            table.LockedWidth = true;
            table.DefaultCell.Border = 0;
            table.DefaultCell.Padding = 3;
            table.DefaultCell.BorderWidth = 0;
            table.DefaultCell.VerticalAlignment = Element.ALIGN_TOP;
            table.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;

            var document = new iTextSharp.text.Document(new Rectangle(420f, 297f), 0, 0, 0, 0);// footerTable.TotalHeight + 30.0f);

            var writer = PdfWriter.GetInstance(document, output);

            writer.CloseStream = false;

            document.Open();

            var shading = PdfShading.SimpleAxial(writer, 0, 0, 400, -50.0f, new BaseColor(29, 79, 138, 1), BaseColor.WHITE, true, false);

            //Create a pattern from our shading object
            var pattern = new PdfShadingPattern(shading);

            //Create a color from our patter
            var color = new ShadingColor(pattern);

            //Create a standard two column table
            var outerTable = new PdfPTable(1);

            outerTable.WidthPercentage = 100.0f;

            outerTable.DefaultCell.Border = 0;

            var outerCell = new PdfPCell() { BackgroundColor = color };

            outerCell.FixedHeight = 297.0f;




            var innerTable = new PdfPTable(1);

            innerTable.WidthPercentage = 100.0f;

            innerTable.DefaultCell.Padding = 0;
            innerTable.DefaultCell.Border = 0;

            var logoCell = new PdfPCell();

            logoCell.AddElement(dgLogo);

            logoCell.Padding = 10;
            logoCell.PaddingLeft = 8;

            logoCell.Border = 0;

            innerTable.AddCell(logoCell);


            var giftVoucherTextChunk = new Chunk("Gift Voucher", hugeFontWhiteKunstler);

            var giftVoucherTextPhrase = new Phrase();

            giftVoucherTextPhrase.Add(giftVoucherTextChunk);

            var giftVoucherTextParagraph = new Paragraph();

            giftVoucherTextParagraph.Leading = 24;

            giftVoucherTextParagraph.Add(giftVoucherTextPhrase);

            giftVoucherTextParagraph.Alignment = Element.ALIGN_LEFT;

            var giftVoucherTextCell = new PdfPCell();

            giftVoucherTextCell.AddElement(giftVoucherTextParagraph);

            giftVoucherTextCell.Padding = 0;

            giftVoucherTextCell.PaddingTop = 12;

            giftVoucherTextCell.Border = 0;

            innerTable.AddCell(giftVoucherTextCell);



            var symbolChunk = new Chunk(giftVoucher.PriceList.Currency.Symbol, valueFont);

            var valueChunk = new Chunk(giftVoucher.ValueInc.ToString("N0"), valueFont);

            var valuePhrase = new Phrase();

            valuePhrase.Add(symbolChunk);

            valuePhrase.Add(valueChunk);

            var valueParagraph = new Paragraph();

            valueParagraph.IndentationLeft = -34;

            valueParagraph.Alignment = Element.ALIGN_CENTER;

            valueParagraph.Add(valuePhrase);

            valueParagraph.Leading = 52;

            valueParagraph.SpacingAfter = 12;

            var valueCell = new PdfPCell();

            valueCell.AddElement(valueParagraph);

            valueCell.Padding = 0;

            valueCell.PaddingTop = 24;

            valueCell.Border = 0;

            innerTable.AddCell(valueCell);



            var codeChunk = new Chunk(giftVoucher.Code, hugeFontWhiteCascadia);

            var codePhrase = new Phrase();

            codePhrase.Add(codeChunk);

            var codeParagraph = new Paragraph();

            codeParagraph.Leading = 24;

            codeParagraph.Add(codePhrase);

            codeParagraph.Alignment = Element.ALIGN_CENTER;

            var codeCell = new PdfPCell();

            codeCell.AddElement(codeParagraph);

            codeCell.Padding = 0;

            codeCell.Border = 0;

            var expiryParagraph = new Paragraph($"Valid Until {giftVoucher.ExpiryDT:yyyy-MM-dd}", normalFontWhiteCascadia);

            expiryParagraph.IndentationLeft = 32;

            codeCell.AddElement(expiryParagraph);

            innerTable.AddCell(codeCell);


            var qrCodeBytes = PngByteQRCodeHelper.GetQRCode(giftVoucher.Code, 64, new byte[] { 29, 79, 138, 255 }, new byte[] { 255, 255, 255, 0 }, QRCodeGenerator.ECCLevel.L);

            using (var image = System.Drawing.Image.FromStream(new MemoryStream(qrCodeBytes)))
            {
                var qrCodeImg = Image.GetInstance(image, System.Drawing.Imaging.ImageFormat.Png);

                qrCodeImg.ScaleAbsolute(64.0f, 64.0f);

                qrCodeImg.Alignment = Element.ALIGN_RIGHT;

                var qrCodeCell = new PdfPCell();

                qrCodeCell.Padding = 0;

                qrCodeCell.PaddingTop = 22;

                qrCodeCell.Border = 0;

                qrCodeCell.HorizontalAlignment = Element.ALIGN_RIGHT;

                qrCodeCell.AddElement(qrCodeImg);

                innerTable.AddCell(qrCodeCell);
            }

            outerCell.AddElement(innerTable);

            outerTable.AddCell(outerCell);

            document.Add(outerTable);

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

            Dictionary<String, String> info = reader.Info;
            
            info["Title"] = "Designers Guild Gift Voucher";

            stamper.MoreInfo = info;

            var count = reader.NumberOfPages; // for all the pages in the final document...

            stamper.Close(); // close the stamper

            reader.Close(); // close the reader

            dgImage.Dispose();

            System.Diagnostics.Debug.WriteLine($"Generatiung Gift Voucher PDF took {stopWatch.Elapsed}");

            finalStream.Close();

            return stamperStream;
        }
    }
}