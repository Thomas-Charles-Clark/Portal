
using iTextSharp.text;
using iTextSharp.text.pdf;

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
        public static MemoryStream Generate(string rootPath, SharedEFClasses.Models.GiftVoucher_SelectResult giftVoucher)
        {
            var border = Rectangle.LEFT_BORDER | Rectangle.TOP_BORDER | Rectangle.RIGHT_BORDER | Rectangle.BOTTOM_BORDER;

            border = 0;

            var darkMode = giftVoucher.Expired || giftVoucher.Used || giftVoucher.Cancelled;

#if DEBUG
            //darkMode = true;
#endif

            var stopWatch = new System.Diagnostics.Stopwatch();

            var finalStream = new MemoryStream();

            var gillSansMt = BaseFont.CreateFont(rootPath + "Content/fonts/Gill-Sans-MT.ttf", BaseFont.CP1252, BaseFont.EMBEDDED);

            var cascadiaCodeMonoSemiLight = BaseFont.CreateFont(rootPath + "Content/fonts/CascadiaCode.ttf", BaseFont.CP1252, BaseFont.EMBEDDED);

            var kunstler = BaseFont.CreateFont(rootPath + "Content/fonts/kunstler.ttf", BaseFont.CP1252, BaseFont.EMBEDDED);

            var trixieRoughHeavy = BaseFont.CreateFont(rootPath + "Content/fonts/trixie/5353122/TrixieRoughOTW05-Heavy.ttf", BaseFont.CP1252, BaseFont.EMBEDDED);

            var backgroundImage = Image.GetInstance(AppDomain.CurrentDomain.BaseDirectory + $"/content/images/backgrounds/gift-voucher-background{(darkMode ? "-greyscale" : "")}.jpg");

            backgroundImage.ScaleAbsoluteWidth(360.0f);
            backgroundImage.ScaleAbsoluteHeight(255.0f);

            stopWatch.Start();

            System.Globalization.NumberFormatInfo nfi = new System.Globalization.CultureInfo(giftVoucher.VisitorCulture ?? "en-GB").NumberFormat;

            var notVeryBlack = new BaseColor(95, 90, 89);
            var mildlyBrown = new BaseColor(186, 173, 142);
            var notWhite = new BaseColor(188, 188, 188);

            var normalFont = new Font(gillSansMt, 12, Font.NORMAL, darkMode ? notWhite : notVeryBlack);
            var normalNotVeryBlackFont = new Font(gillSansMt, 12, Font.NORMAL, darkMode ? notWhite : notVeryBlack);
            var normalNotVeryBlackItalicFont = new Font(gillSansMt, 12, Font.ITALIC, darkMode ? notWhite : notVeryBlack);
            var normalMildlyBrownFont = new Font(gillSansMt, 12, Font.NORMAL, darkMode ? notWhite : mildlyBrown);
            var messageFontWhite = new Font(gillSansMt, 14, Font.NORMAL, darkMode ? notWhite : notVeryBlack);
            var eCardHeading = new Font(gillSansMt, 16, Font.NORMAL, darkMode ? notWhite : notVeryBlack);
            var eCardSubHeading = new Font(gillSansMt, 12, Font.NORMAL, darkMode ? notWhite : notVeryBlack);
            var aGiftForYouFont = new Font(trixieRoughHeavy, 34, Font.NORMAL, darkMode ? notWhite : notVeryBlack);
            var validityFontWhite = new Font(gillSansMt, 22, Font.NORMAL, darkMode ? notWhite : BaseColor.WHITE);
            var smallerFont = new Font(gillSansMt, 10, Font.NORMAL, BaseColor.BLACK);
            var hugeFont = new Font(gillSansMt, 42, Font.NORMAL, BaseColor.BLACK);
            var hugeFontWhite = new Font(gillSansMt, 32, Font.NORMAL, darkMode ? notWhite : BaseColor.WHITE);
            var valueFont = new Font(gillSansMt, 64, Font.NORMAL, darkMode ? notWhite : BaseColor.WHITE);
            var valueFontBrown = new Font(gillSansMt, 42, Font.NORMAL, darkMode ? notWhite : mildlyBrown);
            var hugeFontWhiteCascadia = new Font(cascadiaCodeMonoSemiLight, 32, Font.NORMAL, darkMode ? notWhite : notVeryBlack);
            var normalFontWhiteCascadia = new Font(cascadiaCodeMonoSemiLight, 12, Font.NORMAL, darkMode ? notWhite : notVeryBlack);
            var smallerFontWhiteCascadia = new Font(cascadiaCodeMonoSemiLight, 10, Font.NORMAL, darkMode ? notWhite : notVeryBlack);
            var hugeFontWhiteKunstler = new Font(kunstler, 52, Font.NORMAL, darkMode ? notWhite : notVeryBlack);
            var hugeFontTrixieRoughHeavy = new Font(trixieRoughHeavy, 28, Font.NORMAL, darkMode ? notWhite : BaseColor.WHITE);
            var hugeFontTrixieRoughHugeRed = new Font(trixieRoughHeavy, 144, Font.NORMAL, BaseColor.RED);
            var smallerItalicFont = FontFactory.GetFont("Arial", 9, iTextSharp.text.Font.ITALIC, BaseColor.BLACK);
            var boldFont = FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD, darkMode ? notWhite : BaseColor.BLACK);
            var footerNormalFont = FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL, BaseColor.BLACK);
            var footerBoldFont = FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD, BaseColor.BLACK);
            var codeFont = FontFactory.GetFont("Consolas", 36, iTextSharp.text.Font.BOLD, BaseColor.BLACK);

            System.Drawing.Image dgLogoWhiteImage = System.Drawing.Image.FromFile(AppDomain.CurrentDomain.BaseDirectory + $"/Content/Images/Logo/designers-guild-transparent{(darkMode ? "-grey" : "-inversion")}-lg.png");
            System.Drawing.Image dgLogoBeigeImage = System.Drawing.Image.FromFile(AppDomain.CurrentDomain.BaseDirectory + "/Content/Images/Logo/designers-guild-transparent-beige-lg.png");

            var dgLogoImageWhite = Image.GetInstance(dgLogoWhiteImage, System.Drawing.Imaging.ImageFormat.Png);
            var dgLogoImageBeige = Image.GetInstance(dgLogoBeigeImage, System.Drawing.Imaging.ImageFormat.Png);

            dgLogoImageWhite.ScaleAbsoluteWidth(240);
            dgLogoImageWhite.ScaleAbsoluteHeight(17);
            dgLogoImageWhite.Alignment = Element.ALIGN_CENTER;


            //#if DEBUG
            //  message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam molestie fringilla vulputate. Duis sagittis dapibus lobortis. Donec eget finibus magna, ac viverra nunc. Mauris imperdiet dapibus neque, eget porta ligula euismod a. Integer augue risus, consectetur vitae tempor sit amet, vulputate at elit.";
            //#endif

            var streams = new List<MemoryStream>();

            var documentDate = DateTime.Now;

            var output = new MemoryStream();

            var document = new iTextSharp.text.Document(PageSize.A4, 0, 0, 0, 0);

            var writer = PdfWriter.GetInstance(document, output);

            writer.CloseStream = false;

            document.Open();

            /*
             
            Right, you need to re-parse this shit and make sense of it

            outerTable [Full-Width]

                outerCell [Full-Width, Full-Height]

                    topLogoTable [50% Width]
                        topLogoCell
                            topLogoImageBlack

                    topLogoUnderlineTable [92% Width]
                        topLogoUnderlineCell [1px tall grey border bottom]

                    aGiftForYouTable [100% Width, 42pt Leading]
                        aGiftCell
                        forYouCell
                    
                    innerTable
                        
                        

                    topTable
                
            */

            var outerTable = new PdfPTable(1);

            outerTable.WidthPercentage = 100.0f;
            outerTable.DefaultCell.Border = border;
            outerTable.DefaultCell.BorderColor = BaseColor.BLUE;

            var outerCell = new PdfPCell();

            outerCell.FixedHeight = PageSize.A4.Height;
            outerCell.Border = border;
            outerCell.BorderColor = BaseColor.CYAN;
            outerCell.VerticalAlignment = Element.ALIGN_TOP;

            #region Top Logo

            var topLogoTable = new PdfPTable(1);

            topLogoTable.WidthPercentage = 65.0f;
            topLogoTable.DefaultCell.Padding = 0;
            topLogoTable.DefaultCell.BorderColor = BaseColor.RED;
            topLogoTable.DefaultCell.Border = border;

            var topLogoCell = new PdfPCell();
            topLogoCell.Padding = 30;
            topLogoCell.BorderColor = BaseColor.RED;
            topLogoCell.Border = border;

            topLogoCell.AddElement(dgLogoImageBeige);

            topLogoTable.AddCell(topLogoCell);

            outerCell.AddElement(topLogoTable);

            #endregion

            #region Top Logo Underline

            var topLogoUnderlineTable = new PdfPTable(1);
            topLogoUnderlineTable.WidthPercentage = 92.0f;

            var topLogoUnderlineCell = new PdfPCell();
            topLogoUnderlineCell.Padding = 0;
            topLogoUnderlineCell.Border = Rectangle.BOTTOM_BORDER;
            topLogoUnderlineCell.BorderWidth = 1.0f;
            topLogoUnderlineCell.BorderColor = mildlyBrown;

            topLogoUnderlineTable.AddCell(topLogoUnderlineCell);

            outerCell.AddElement(topLogoUnderlineTable);

            #endregion

            #region A Gift For You

            var aGiftChunk = new Chunk(giftVoucher.GiftForYouText, aGiftForYouFont);

            var aGiftPhrase = new Phrase();
            aGiftPhrase.Add(aGiftChunk);

            var aGiftParagraph = new Paragraph();
            aGiftParagraph.Leading = 42;
            aGiftParagraph.Alignment = Element.ALIGN_CENTER;
            aGiftParagraph.Add(aGiftPhrase);

            var giftForYouTable = new PdfPTable(1);
            giftForYouTable.SpacingBefore = 10.0f;
            giftForYouTable.WidthPercentage = 100.0f;

            var aGiftCell = new PdfPCell();
            aGiftCell.HorizontalAlignment = Element.ALIGN_CENTER;
            aGiftCell.PaddingRight = 15.0f;
            aGiftCell.Border = border;

            aGiftCell.AddElement(aGiftParagraph);

            giftForYouTable.AddCell(aGiftCell);

            outerCell.AddElement(giftForYouTable);

            #endregion

            #region



            #endregion

            var innerTable = new PdfPTable(1);

            innerTable.WidthPercentage = 100.0f;
            innerTable.DefaultCell.Padding = 0;
            innerTable.DefaultCell.BorderColor = BaseColor.RED;
            innerTable.DefaultCell.Border = border;

            var topCell = new PdfPCell();

            topCell.FixedHeight = 54;
            topCell.Border = border;
            topCell.BorderColor = BaseColor.RED;
            topCell.Padding = 0;
            topCell.VerticalAlignment = Element.ALIGN_MIDDLE;

            innerTable.AddCell(topCell);

            #region Middle Table

            var middleCell = new PdfPCell();

            middleCell.FixedHeight = 320.0f;
            middleCell.Border = border;
            middleCell.BorderColor = BaseColor.GREEN;
            middleCell.PaddingTop = 8.0f;
            middleCell.PaddingLeft = 15.0f;
            middleCell.PaddingRight = 15.0f;
            middleCell.HorizontalAlignment = Element.ALIGN_LEFT;
            middleCell.VerticalAlignment = Element.ALIGN_TOP;

            middleCell.CellEvent = new ImageEvent(backgroundImage);


            var symbolChunk = new Chunk(giftVoucher.CurrencySymbol, valueFont);

#if DEBUG

            giftVoucher.ValueInc = 500;

#endif

            var valueChunk = new Chunk(giftVoucher.ValueInc.ToString("N0"), valueFont);

            var valuePhrase = new Phrase();

            valuePhrase.Add(symbolChunk);
            valuePhrase.Add(valueChunk);

            var valueParagraph = new Paragraph();

            valueParagraph.Leading = 44;
            valueParagraph.Alignment = Element.ALIGN_RIGHT;
            valueParagraph.Add(valuePhrase);

            var valueCell = new PdfPCell();
            valueCell.Border = border;
            valueCell.BorderColor = BaseColor.ORANGE;
            valueCell.Padding = 0;

            valueCell.AddElement(valueParagraph);

            var giftVoucherValueCell = new PdfPCell();

            giftVoucherValueCell.Padding = 0;
            giftVoucherValueCell.Border = border;
            giftVoucherValueCell.BorderColor = BaseColor.WHITE;

            giftVoucherValueCell.AddElement(valueParagraph);

            var giftVoucherTextCell = new PdfPCell();

            giftVoucherTextCell.HorizontalAlignment = Element.ALIGN_LEFT;

            dgLogoImageWhite.Alignment = Element.ALIGN_LEFT;

            dgLogoImageWhite.SpacingBefore = 2;
            dgLogoImageWhite.SpacingAfter = 8;

            giftVoucherTextCell.AddElement(dgLogoImageWhite);

            var giftVoucherTextChunk = new Chunk(giftVoucher.GiftVoucherLabelText, hugeFontTrixieRoughHeavy);

            giftVoucherTextChunk.SetCharacterSpacing(5.2f);

            var giftVoucherTextPhrase = new Phrase();

            giftVoucherTextPhrase.Add(giftVoucherTextChunk);

            var giftVoucherTextParagraph = new Paragraph();

            giftVoucherTextParagraph.Add(giftVoucherTextPhrase);
            giftVoucherTextParagraph.Alignment = Element.ALIGN_LEFT;

            giftVoucherTextCell.HorizontalAlignment = Element.ALIGN_CENTER;
            giftVoucherTextCell.Padding = 0;
            giftVoucherTextCell.PaddingLeft = 32.0f;
            giftVoucherTextCell.Border = border;
            giftVoucherTextCell.BorderColor = BaseColor.WHITE;

            giftVoucherTextCell.AddElement(giftVoucherTextParagraph);

            var giftVoucherTextTable = new PdfPTable(2);
            giftVoucherTextTable.SpacingBefore = 12.0f;
            giftVoucherTextTable.WidthPercentage = 80.0f;
            giftVoucherTextTable.SetWidths(new float[] { 32, 68 });

            giftVoucherTextTable.AddCell(giftVoucherValueCell);

            giftVoucherTextTable.AddCell(giftVoucherTextCell);

            middleCell.AddElement(giftVoucherTextTable);

            Paragraph messageParagraph = null;

            var messageTable = new PdfPTable(1);

            messageTable.WidthPercentage = 75.0f;
            messageTable.DefaultCell.Border = border;
            messageTable.DefaultCell.BorderColor = BaseColor.CYAN;
            messageTable.SpacingBefore = 16.0f;

            var messageCell = new PdfPCell();

            messageCell.FixedHeight = 120.0f;
            messageCell.Padding = 0;
            messageCell.Border = border;
            messageCell.BorderColor = BaseColor.PINK;

            var messageTablePresent = false;

            if (giftVoucher.Expired) // darkMode)
            {
                messageParagraph = new Paragraph(giftVoucher.ExpiredMessage, messageFontWhite);

                messageTablePresent = true;
            }
            else if (giftVoucher.Cancelled)
            {
                messageParagraph = new Paragraph(giftVoucher.CancelledMessage, messageFontWhite);

                messageTablePresent = true;
            }
            else if (giftVoucher.Used)
            {
                messageParagraph = new Paragraph(giftVoucher.UsedMessage, messageFontWhite);

                messageTablePresent = true;
            }
            else if (!String.IsNullOrEmpty(giftVoucher.Message))
            {
                messageParagraph = new Paragraph(giftVoucher.Message, messageFontWhite);

                messageTablePresent = true;
            }

            if (messageTablePresent)
            {
                messageCell.AddElement(messageParagraph);

                messageTable.AddCell(messageCell);

                middleCell.AddElement(messageTable);
            }

            #endregion

            var qrCodeCell = new PdfPCell();

            qrCodeCell.Border = border;
            qrCodeCell.BorderColor = BaseColor.BLUE;
            qrCodeCell.Padding = 0;

            var qrCodeBytes = PngByteQRCodeHelper.GetQRCode(giftVoucher.Code, 32, darkMode ? new byte[] { 188, 188, 188, 255 } : new byte[] { 255, 255, 255, 255 }, new byte[] { 255, 255, 255, 0 }, QRCodeGenerator.ECCLevel.L, false, false, QRCodeGenerator.EciMode.Default, 2, false);
            var qrImage = System.Drawing.Image.FromStream(new MemoryStream(qrCodeBytes));
            var qrCodeImg = Image.GetInstance(qrImage, System.Drawing.Imaging.ImageFormat.Png);

            qrCodeImg.ScaleAbsolute(64.0f, 64.0f);
            qrCodeImg.Alignment = Element.ALIGN_RIGHT;
            qrCodeImg.SpacingBefore = 0.0f;

            qrCodeCell.PaddingRight = 0.0f;
            qrCodeCell.PaddingLeft = 0.0f;
            qrCodeCell.VerticalAlignment = Element.ALIGN_TOP;
            qrCodeCell.AddElement(qrCodeImg);

            var codeAndExpiryTable = new PdfPTable(2);

            codeAndExpiryTable.WidthPercentage = 80.0f;
            codeAndExpiryTable.SetWidths(new float[] { 18.5f, 81.5f });
            codeAndExpiryTable.SpacingBefore = messageTablePresent ? 36.0f : 172.0f;
            codeAndExpiryTable.DefaultCell.Padding = 0;
            codeAndExpiryTable.DefaultCell.Border = 0;
            codeAndExpiryTable.DefaultCell.PaddingRight = 55.0f;
            codeAndExpiryTable.HorizontalAlignment = Element.ALIGN_CENTER;

            codeAndExpiryTable.AddCell(qrCodeCell);

            var codeChunk = new Chunk(giftVoucher.Code, hugeFontWhite);

            var codePhrase = new Phrase();

            codePhrase.Add(codeChunk);

            var codeParagraph = new Paragraph();

            codeParagraph.Leading = 26;
            codeParagraph.Add(codePhrase);
            codeParagraph.Alignment = Element.ALIGN_RIGHT;
            codeParagraph.SpacingAfter = 0;

            var codeCell = new PdfPCell();

            codeCell.Padding = 0;
            codeCell.PaddingRight = 24.0f;
            codeCell.Border = border;
            codeCell.HorizontalAlignment = Element.ALIGN_RIGHT;
            codeCell.AddElement(codeParagraph);

            System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(giftVoucher.VisitorCulture ?? "en-GB");

            var expiryParagraph = new Paragraph($"{giftVoucher.GiftVoucherValidUntilText} {giftVoucher.ExpiryDT:dddd} {giftVoucher.ExpiryDT.Value.Date.Day}{Framework.GetDaySuffix(giftVoucher.ExpiryDT.Value.Date.Day)} {giftVoucher.ExpiryDT:MMM yyyy}", validityFontWhite);
            expiryParagraph.SpacingBefore = 0;
            //expiryParagraph.Leading = 20;
            expiryParagraph.Alignment = Element.ALIGN_RIGHT;

            codeCell.AddElement(expiryParagraph);

            codeAndExpiryTable.AddCell(codeCell);

            middleCell.AddElement(codeAndExpiryTable);


            var inStoreOrOnlineTable = new PdfPTable(1);

            inStoreOrOnlineTable.WidthPercentage = 65.0f;
            inStoreOrOnlineTable.SetWidths(new float[] { 65.0f });
            inStoreOrOnlineTable.DefaultCell.Border = border;
            inStoreOrOnlineTable.DefaultCell.BorderColor = BaseColor.DARK_GRAY;

            var inStoreOrOnlineHeadingParagraph = new Paragraph();

            inStoreOrOnlineHeadingParagraph.Leading = 52.0f;

            var inStoreOrOnlineParagraph = new Paragraph();
            inStoreOrOnlineParagraph.Leading = 16.0f;

            var brownSymbolChunk = new Chunk(giftVoucher.CurrencySymbol, valueFontBrown);

            var brownValueChunk = new Chunk(giftVoucher.ValueInc.ToString("N0"), valueFontBrown);

            var brownValuePhrase = new Phrase();

            brownValuePhrase.Add(brownSymbolChunk);
            brownValuePhrase.Add(brownValueChunk);

            var useInStoreChunk = new Chunk(giftVoucher.UseInStoreOrOnlineText, normalFont);

            var useInStorePhrase = new Phrase(useInStoreChunk);

            inStoreOrOnlineHeadingParagraph.Add(brownValuePhrase);

            inStoreOrOnlineHeadingParagraph.Add("\n");

            inStoreOrOnlineParagraph.Add(useInStorePhrase);

            inStoreOrOnlineParagraph.Add("\n");

            var beforeChunk = new Chunk(giftVoucher.BeforeText, normalFont);

            var beforeExpiryChunk = new Chunk($"{giftVoucher.ExpiryDT:dddd} {giftVoucher.ExpiryDT.Value.Date.Day}{Framework.GetDaySuffix(giftVoucher.ExpiryDT.Value.Date.Day)} {giftVoucher.ExpiryDT:MMM yyyy}", normalFont);

            var beforeCodeChunk = new Chunk($"{giftVoucher.Code}", boldFont);

            var beforePhrase = new Phrase();

            beforePhrase.Add(beforeChunk);
            beforePhrase.Add(" ");
            beforePhrase.Add(beforeExpiryChunk);
            beforePhrase.Add("\n");
            beforePhrase.Add(beforeCodeChunk);

            inStoreOrOnlineParagraph.Add(beforePhrase);

            var inStoreOrOnlineCell = new PdfPCell();

            inStoreOrOnlineCell.Border = border;
            inStoreOrOnlineCell.Padding = 0;
            inStoreOrOnlineCell.PaddingLeft = 85.0f;
            inStoreOrOnlineCell.PaddingRight = 85.0f;
            inStoreOrOnlineCell.BorderColor = BaseColor.BLACK;

            inStoreOrOnlineCell.AddElement(inStoreOrOnlineHeadingParagraph);
            inStoreOrOnlineCell.AddElement(inStoreOrOnlineParagraph);

            inStoreOrOnlineTable.AddCell(inStoreOrOnlineCell);

            //middleCell.AddElement(qrCodeImg);

            innerTable.AddCell(middleCell);

            innerTable.AddCell(inStoreOrOnlineTable);

            var bottomUnderlineTable = new PdfPTable(1);
            bottomUnderlineTable.WidthPercentage = 92.0f;
            bottomUnderlineTable.SpacingBefore = 22.0f;
            bottomUnderlineTable.SpacingAfter = 22.0f;

            var bottomUnderlineCell = new PdfPCell();
            bottomUnderlineCell.Padding = 0;
            bottomUnderlineCell.Border = Rectangle.BOTTOM_BORDER;
            bottomUnderlineCell.BorderWidth = 1.0f;
            bottomUnderlineCell.BorderColor = mildlyBrown;

            bottomUnderlineTable.AddCell(bottomUnderlineCell);

            var bottomTable = new PdfPTable(2);

            bottomTable.WidthPercentage = 90.0f;
            bottomTable.SetWidths(new float[] { 50.0f, 50.0f });
            bottomTable.DefaultCell.Border = border;
            bottomTable.DefaultCell.BorderColor = BaseColor.BLUE;

            var bottomTableLeftCell = new PdfPCell();
            bottomTableLeftCell.Border = border;
            bottomTableLeftCell.BorderColor = BaseColor.RED;

            var howToUseHeadingChunk = new Chunk(giftVoucher.eGiftCardHeading, eCardHeading);

            var howToUseHeadingPhrase = new Phrase(howToUseHeadingChunk);

            var eCardParagraph = new Paragraph();

            eCardParagraph.Add(howToUseHeadingPhrase);

            var inStorePhrase = new Phrase();

            var inStoreSubHeadingChunk = new Chunk(giftVoucher.eGiftCardInStoreSubHeading, eCardSubHeading);

            inStorePhrase.Add(inStoreSubHeadingChunk);

            inStorePhrase.Add(" ");

            inStorePhrase.Add(new Chunk(giftVoucher.eGiftCardInStoreText, normalNotVeryBlackFont));

            eCardParagraph.Add("\n");

            eCardParagraph.Add(inStorePhrase);

            eCardParagraph.Add("\n");

            eCardParagraph.Add("\n");

            var onlinePhrase = new Phrase();

            var onlineSubheadingChunk = new Chunk(giftVoucher.eGiftCardOnlineHeading, eCardSubHeading);

            onlinePhrase.Add(onlineSubheadingChunk);

            onlinePhrase.Add(" ");

            onlinePhrase.Add(new Chunk(giftVoucher.eGiftCardOnlineText1, normalNotVeryBlackFont));

            onlinePhrase.Add(" ");

            onlinePhrase.Add(new Chunk(giftVoucher.eGiftCardOnlineText2, normalNotVeryBlackItalicFont));

            onlinePhrase.Add(" ");

            onlinePhrase.Add(new Chunk(giftVoucher.eGiftCardOnlineText3, normalNotVeryBlackFont));

            eCardParagraph.Add(onlinePhrase);

            bottomTableLeftCell.AddElement(eCardParagraph);

            var bottomTableRightCell = new PdfPCell();
            bottomTableRightCell.Border = border;
            bottomTableRightCell.BorderColor = BaseColor.PINK;

            var termsHeading = new Chunk(giftVoucher.TermsAndConditionsHeading, eCardHeading);

            var termsPhrase = new Phrase(termsHeading);

            var termsParagraph = new Paragraph();

            termsParagraph.Add(termsPhrase);

            termsParagraph.Add("\n");

            var termsAndConditionsPhrase = new Phrase();

            termsAndConditionsPhrase.Add(new Chunk(giftVoucher.TermsAndConditionsText1, normalNotVeryBlackFont));

            termsAndConditionsPhrase.Add("\n");

            termsAndConditionsPhrase.Add(new Chunk(giftVoucher.TermsAndConditionsText2, normalNotVeryBlackFont));

            termsAndConditionsPhrase.Add("\n");

            termsAndConditionsPhrase.Add(new Chunk(giftVoucher.TermsAndConditionsText3, normalNotVeryBlackFont));

            termsAndConditionsPhrase.Add("\n");

            termsAndConditionsPhrase.Add(new Chunk(giftVoucher.TermsAndConditionsText4, normalNotVeryBlackFont));

            termsParagraph.Add(termsAndConditionsPhrase);

            bottomTableRightCell.AddElement(termsParagraph);

            bottomTable.AddCell(bottomTableLeftCell);
            bottomTable.AddCell(bottomTableRightCell);

            //innerTable.AddCell(bottomUnderlineTable);

            outerCell.AddElement(innerTable);

            outerCell.AddElement(bottomUnderlineTable);

            outerCell.AddElement(bottomTable);

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

            // hehehe

            //if (darkMode)
            //{
            //    var over = stamper.GetOverContent(1);

            //    var para = new Paragraph();

            //    var chunk = new Chunk(giftVoucher.ExpiredMessage ?? giftVoucher.UsedMessage ?? giftVoucher.CancelledMessage ?? "VOID", hugeFontTrixieRoughHugeRed);

            //    var phrase = new Phrase(chunk);

            //    para.Add(phrase);

            //    var transform = new AffineTransform();

            //    transform.Rotate(0);

            //    over.Transform(transform);

            //    var state = new PdfGState();

            //    state.BlendMode = PdfGState.BM_OVERLAY;

            //    over.SetGState(state);

            //    over.BeginText();

            //    over.SetFontAndSize(trixieRoughHeavy, 144);

            //    over.SetColorFill(new BaseColor(System.Drawing.Color.FromArgb(180, 248, 48, 90)));


            //    over.ShowTextAligned(Element.ALIGN_CENTER, "VOID", 290, 450, 0);

            //    over.EndText();
            //}

            Dictionary<String, String> info = reader.Info;

            info["Title"] = "Designers Guild Gift Voucher";

            stamper.MoreInfo = info;

            var count = reader.NumberOfPages; // for all the pages in the final document...

            stamper.Close(); // close the stamper

            reader.Close(); // close the reader

            dgLogoWhiteImage.Dispose();

            System.Diagnostics.Debug.WriteLine($"Generating Gift Voucher PDF took {stopWatch.Elapsed}");

            finalStream.Close();

            return stamperStream;
        }


        public static MemoryStream GenerateOld(string rootPath, SharedEFClasses.Models.GiftVoucher giftVoucher)
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
            catch (DocumentException)
            {
                // do nothing
            }
        }
    }
}