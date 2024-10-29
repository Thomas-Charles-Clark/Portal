
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
            var border = 0;

            var stopWatch = new System.Diagnostics.Stopwatch();

            var finalStream = new MemoryStream();

            var gillSansMt = BaseFont.CreateFont(rootPath + "Content/fonts/Gill-Sans-MT.ttf", BaseFont.CP1252, BaseFont.EMBEDDED);

            var cascadiaCodeMonoSemiLight = BaseFont.CreateFont(rootPath + "Content/fonts/CascadiaCode.ttf", BaseFont.CP1252, BaseFont.EMBEDDED);

            var kunstler = BaseFont.CreateFont(rootPath + "Content/fonts/kunstler.ttf", BaseFont.CP1252, BaseFont.EMBEDDED);

            var trixieRoughHeavy = BaseFont.CreateFont(rootPath + "css\\src\\fonts\\src\\5353122\\TrixieRoughOTW05-Heavy.ttf", BaseFont.CP1252, BaseFont.EMBEDDED);

            var backgroundImage = Image.GetInstance(AppDomain.CurrentDomain.BaseDirectory + "/content/images/backgrounds/gift-voucher-background.jpg");

            stopWatch.Start();

            System.Globalization.NumberFormatInfo nfi = new System.Globalization.CultureInfo("en-GB").NumberFormat;

            var normalFont = new Font(gillSansMt, 11, Font.NORMAL, BaseColor.BLACK);
            var messageFontWhite = new Font(gillSansMt, 14, Font.NORMAL, BaseColor.WHITE);
            var validityFontWhite = new Font(gillSansMt, 20, Font.NORMAL, BaseColor.WHITE);
            var smallerFont = new Font(gillSansMt, 10, Font.NORMAL, BaseColor.BLACK);
            var hugeFont = new Font(gillSansMt, 42, Font.NORMAL, BaseColor.BLACK);
            var hugeFontWhite = new Font(gillSansMt, 30, Font.NORMAL, BaseColor.WHITE);
            var valueFont = new Font(gillSansMt, 56, Font.NORMAL, BaseColor.WHITE);
            var hugeFontWhiteCascadia = new Font(cascadiaCodeMonoSemiLight, 32, Font.NORMAL, BaseColor.WHITE);
            var normalFontWhiteCascadia = new Font(cascadiaCodeMonoSemiLight, 12, Font.NORMAL, BaseColor.WHITE);
            var smallerFontWhiteCascadia = new Font(cascadiaCodeMonoSemiLight, 10, Font.NORMAL, BaseColor.WHITE);
            var hugeFontWhiteKunstler = new Font(kunstler, 52, Font.NORMAL, BaseColor.WHITE);
            var hugeFontTrixieRoughHeavy = new Font(trixieRoughHeavy, 28, Font.NORMAL, BaseColor.WHITE);
            var smallerItalicFont = FontFactory.GetFont("Arial", 9, iTextSharp.text.Font.ITALIC, BaseColor.BLACK);
            var boldFont = FontFactory.GetFont("Arial", 11, iTextSharp.text.Font.BOLD, BaseColor.BLACK);
            var footerNormalFont = FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL, BaseColor.BLACK);
            var footerBoldFont = FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD, BaseColor.BLACK);
            var codeFont = FontFactory.GetFont("Consolas", 36, iTextSharp.text.Font.BOLD, BaseColor.BLACK);

            System.Drawing.Image dgImage = System.Drawing.Image.FromFile(AppDomain.CurrentDomain.BaseDirectory + "/Content/Images/Logos/designers-guild-transparent-inversion-lg.png");

            var dgLogo = Image.GetInstance(dgImage, System.Drawing.Imaging.ImageFormat.Png);

            string message = null;

            if (giftVoucher.OrderLines?.Any() == true)
            {
                message = giftVoucher.OrderLines.First().GiftVoucherMessage;
            }
            else
            {
                message = giftVoucher.Message;
            }

//#if DEBUG
//            message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam molestie fringilla vulputate. Duis sagittis dapibus lobortis. Donec eget finibus magna, ac viverra nunc. Mauris imperdiet dapibus neque, eget porta ligula euismod a. Integer augue risus, consectetur vitae tempor sit amet, vulputate at elit.";
//#endif

            var streams = new List<MemoryStream>();

            var documentDate = DateTime.Now;

            var output = new MemoryStream();

            var document = new iTextSharp.text.Document(new Rectangle(420f, 297f), 0, 0, 0, 0);

            var writer = PdfWriter.GetInstance(document, output);

            writer.CloseStream = false;

            document.Open();

            /*
             
            Outer Table holds Outer Cell which holds the background image (drawn via ImageEvent)

            Inner Table holds the other tables

            Top Table 
                Top Table Left Cell 
                    Value Paragraph
                Top Table Right Cell
                    Top Table Right Cell Table
                        Logo Cell
                        "Gift Voucher" Paragraph Cell
            Middle Table
                Message Cell

            Bottom Table
                Bottom Table Left Cell
                Bottom Table Right Cell
                    Bottom Table Right Cell Table
                        Code Paragraph Cell
                        Expiry Paragraph Cell

            */

            var outerTable = new PdfPTable(1);

            outerTable.WidthPercentage = 100.0f;
            outerTable.DefaultCell.Border = 0;

            var outerCell = new PdfPCell();

            outerCell.CellEvent = new ImageEvent(backgroundImage);
            outerCell.FixedHeight = 297.0f;

            var innerTable = new PdfPTable(1);

            innerTable.WidthPercentage = 100.0f;
            innerTable.DefaultCell.Padding = 0;
            innerTable.DefaultCell.Border = 0;

            var topTable = new PdfPTable(2);

            topTable.WidthPercentage = 100.0f;
            topTable.SetWidths(new[] { 140.0f, 280.0f });
            topTable.DefaultCell.Padding = 0;
            topTable.DefaultCell.Border = 0;

            #region Top Table

            var topTableLeftCell = new PdfPCell();

            topTableLeftCell.Padding = 0;
            topTableLeftCell.PaddingLeft = 15.0f;
            topTableLeftCell.Border = 0;
            topTableLeftCell.BorderColor = BaseColor.WHITE;
            topTableLeftCell.VerticalAlignment = Element.ALIGN_MIDDLE;

            var topTableRightCellTable = new PdfPTable(1);

            topTableRightCellTable.WidthPercentage = 100.0f;
            topTableRightCellTable.DefaultCell.Padding = 0;
            topTableRightCellTable.DefaultCell.Border = 0;

            var topTableRightCell = new PdfPCell();

            topTableRightCell.Padding = 0;
            topTableRightCell.PaddingRight = 15.0f;
            topTableRightCell.Border = 0;
            topTableRightCell.BorderColor = BaseColor.WHITE;
            topTableRightCell.VerticalAlignment = Element.ALIGN_MIDDLE;

            var logoCell = new PdfPCell();

            logoCell.AddElement(dgLogo);

            logoCell.PaddingTop = 10;
            logoCell.PaddingLeft = 12;
            logoCell.PaddingRight = 12;
            logoCell.PaddingBottom = 2;

            logoCell.Border = 0;
            logoCell.BorderColor = BaseColor.WHITE;

            logoCell.HorizontalAlignment = Element.ALIGN_CENTER;
            logoCell.VerticalAlignment = Element.ALIGN_BOTTOM;

            topTableRightCellTable.AddCell(logoCell);

            var giftVoucherTextChunk = new Chunk("GIFT VOUCHER", hugeFontTrixieRoughHeavy);

            giftVoucherTextChunk.SetCharacterSpacing(5.2f);

            var giftVoucherTextPhrase = new Phrase();

            giftVoucherTextPhrase.Add(giftVoucherTextChunk);

            var giftVoucherTextParagraph = new Paragraph();

            giftVoucherTextParagraph.Add(giftVoucherTextPhrase);

            giftVoucherTextParagraph.Alignment = Element.ALIGN_LEFT;

            var giftVoucherTextCell = new PdfPCell();

            giftVoucherTextCell.AddElement(giftVoucherTextParagraph);

            giftVoucherTextCell.Padding = 0;
            giftVoucherTextCell.PaddingTop = 5;
            giftVoucherTextCell.PaddingLeft = 12;
            giftVoucherTextCell.PaddingRight = 0;
            giftVoucherTextCell.Border = 0;
            giftVoucherTextCell.BorderColor = BaseColor.WHITE;

            topTableRightCellTable.AddCell(giftVoucherTextCell);

//#if DEBUG
//            giftVoucher.ValueInc = 5;
//            giftVoucher.Code = "0000-0000-0000-0000";
//            giftVoucher.ExpiryDT = DateTime.Parse("2525/01/01");           
//#endif

            var symbolChunk = new Chunk(giftVoucher.PriceList.Currency.Symbol, valueFont);

            var valueChunk = new Chunk(giftVoucher.ValueInc.ToString("N0"), valueFont);

            var valuePhrase = new Phrase();

            valuePhrase.Add(symbolChunk);
            valuePhrase.Add(valueChunk);

            var valueParagraph = new Paragraph();

            valueParagraph.Leading = 48;
            valueParagraph.Alignment = Element.ALIGN_CENTER;
            valueParagraph.Add(valuePhrase);

            topTableLeftCell.VerticalAlignment = Element.ALIGN_CENTER;
            topTableLeftCell.AddElement(valueParagraph);

            topTable.AddCell(topTableLeftCell);

            topTableRightCell.AddElement(topTableRightCellTable);

            topTable.AddCell(topTableRightCell);

            var topCell = new PdfPCell();

            topCell.FixedHeight = 54;
            topCell.Border = border;
            topCell.BorderColor = BaseColor.WHITE;
            topCell.Padding = 0;
            topCell.VerticalAlignment = Element.ALIGN_MIDDLE;

            topCell.AddElement(topTable);
            
            innerTable.AddCell(topCell);

            #endregion

            #region Middle Table

            var middleTable = new PdfPTable(1);

            var middleCell = new PdfPCell();

            middleCell.FixedHeight = 175.0f;
            middleCell.Border = border;
            middleCell.BorderColor = BaseColor.WHITE;
            middleCell.PaddingTop = 15.0f;
            middleCell.PaddingLeft = 15.0f;
            middleCell.PaddingRight = 15.0f;
            middleCell.HorizontalAlignment = Element.ALIGN_LEFT;
            middleCell.VerticalAlignment = Element.ALIGN_TOP;

            Paragraph messageParagraph = null;

            if (!String.IsNullOrEmpty(message))
            {
                messageParagraph = new Paragraph(message, messageFontWhite);
                
                middleCell.AddElement(messageParagraph);
            }

            #endregion

            var codeChunk = new Chunk(giftVoucher.Code, hugeFontWhite);

            var codePhrase = new Phrase();

            codePhrase.Add(codeChunk);

            var codeParagraph = new Paragraph();

            codeParagraph.Leading = 24;
            codeParagraph.Add(codePhrase);
            codeParagraph.Alignment = Element.ALIGN_RIGHT;
            codeParagraph.SpacingAfter = 0;

            //innerTable.AddCell(codeCell);

            //if (messageParagraph != null)
            //{
            //    middleCell.AddElement(messageParagraph);
            //}

            innerTable.AddCell(middleCell);

            var bottomCell = new PdfPCell();

            bottomCell.FixedHeight = 64.0f;
            bottomCell.Border = border;
            bottomCell.BorderColor = BaseColor.WHITE;
            bottomCell.Padding = 0;
            bottomCell.HorizontalAlignment = Element.ALIGN_CENTER;
            bottomCell.VerticalAlignment = Element.ALIGN_TOP;

            var bottomCellTable = new PdfPTable(2);

            bottomCellTable.WidthPercentage = 100.0f;
            bottomCellTable.SetWidths(new[] { 80.0f, 340.0f });
            bottomCellTable.DefaultCell.Padding = 0;

            var qrCodeCell = new PdfPCell();

            qrCodeCell.Border = border;
            qrCodeCell.BorderColor = BaseColor.BLUE;
            qrCodeCell.Padding = 0;

            var qrCodeBytes = PngByteQRCodeHelper.GetQRCode(giftVoucher.Code, 32, new byte[] { 255, 255, 255, 255 }, new byte[] { 255, 255, 255, 0 }, QRCodeGenerator.ECCLevel.L, false, false, QRCodeGenerator.EciMode.Default, 2, false);
            var qrImage = System.Drawing.Image.FromStream(new MemoryStream(qrCodeBytes));
            var qrCodeImg = Image.GetInstance(qrImage, System.Drawing.Imaging.ImageFormat.Png);

            qrCodeImg.ScaleAbsolute(54.0f, 54.0f);
            qrCodeImg.Alignment = Element.ALIGN_LEFT;
            qrCodeImg.PaddingTop = 0;
            qrCodeImg.SpacingBefore = 0;

            qrCodeCell.PaddingTop = 3;
            qrCodeCell.PaddingRight = 0;
            qrCodeCell.PaddingLeft = 15;
            qrCodeCell.AddElement(qrCodeImg);
            qrCodeCell.VerticalAlignment = Element.ALIGN_TOP;
            
            bottomCellTable.AddCell(qrCodeCell);

            var codeAndExpiryCell = new PdfPCell();

            codeAndExpiryCell.Border = border;
            codeAndExpiryCell.BorderColor = BaseColor.WHITE;
            codeAndExpiryCell.Padding = 0;
            codeAndExpiryCell.PaddingRight = 15.0f;
            codeAndExpiryCell.HorizontalAlignment = Element.ALIGN_CENTER;
            codeAndExpiryCell.VerticalAlignment = Element.ALIGN_CENTER;

            var codeAndExpiryTable = new PdfPTable(1);

            codeAndExpiryTable.WidthPercentage = 100.0f;
            codeAndExpiryTable.DefaultCell.Padding = 0;
            codeAndExpiryTable.DefaultCell.Border = 0;

            var codeCell = new PdfPCell();

            codeCell.Padding = 0;
            codeCell.Border = 0;
            codeCell.AddElement(codeParagraph);

            var expiryCell = new PdfPCell();

            expiryCell.Padding = 0;
            expiryCell.Border = 0;

            var expiryParagraph = new Paragraph($"Valid Until: {giftVoucher.ExpiryDT:dddd} {giftVoucher.ExpiryDT.Value.Date.Day}{SharedEFClasses.Utilities.Framework.GetDaySuffix(giftVoucher.ExpiryDT.Value.Date.Day)} {giftVoucher.ExpiryDT:MMM yyyy}", validityFontWhite);
            expiryParagraph.SpacingBefore = 0;
            //expiryParagraph.Leading = 20;
            expiryParagraph.Alignment = Element.ALIGN_RIGHT;
            expiryCell.AddElement(expiryParagraph);

            codeAndExpiryTable.AddCell(codeCell);
            codeAndExpiryTable.AddCell(expiryCell);

            codeAndExpiryCell.AddElement(codeAndExpiryTable);

            bottomCellTable.AddCell(codeAndExpiryCell);

            bottomCell.AddElement(bottomCellTable);

            innerTable.AddCell(bottomCell);

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

            System.Diagnostics.Debug.WriteLine($"Generating Gift Voucher PDF took {stopWatch.Elapsed}");

            finalStream.Close();

            return stamperStream;
        }
    }

    class ImageEvent : IPdfPCellEvent
    {
        protected Image img;
        public ImageEvent(Image img)
        {
            this.img = img;
        }

        public void CellLayout(PdfPCell cell, Rectangle position, PdfContentByte[] canvases)
        {
            img.ScaleToFit(position.Width, position.Height);
            img.SetAbsolutePosition(position.Left + (position.Width - img.ScaledWidth) / 2,
                    position.Bottom + (position.Height - img.ScaledHeight) / 2);
            PdfContentByte canvas = canvases[PdfPTable.BACKGROUNDCANVAS];
            try
            {
                canvas.AddImage(img);
            }
            catch (DocumentException ex)
            {
                // do nothing
            }
        }
    }
}