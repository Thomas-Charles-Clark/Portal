using SharedEFClasses;
using SharedEFClasses.Models;
using SharedEFClasses.Models.Documents;
using System;

namespace Portal.Areas.Documents.ViewModels
{
    public class ViewDocumentViewModel : BaseViewModel
    {
        public PassDocumentIdentifier DocumentDetails { get; set; }
        public DocumentSendHistoryResult DocumentSendHistory { get; set; }

        private byte[] PDFData { get; set; }

        public string PDFBase64
        {
            get
            {
                if (PDFData != null)
                {
                    return Convert.ToBase64String(PDFData);
                }
                else
                {
                    return null;
                }
            }
        }

        public string To { get; set; }
        public string ReplyTo { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }

        public ViewDocumentViewModel(
            PassDocumentIdentifier objDoc,
            DocumentSendHistoryResult docSendHist,
            byte[] pdfData,
            string to,
            string replyTo,
            string subject,
            string body,
            RoleProperties properties,
            string applicationHeading,
            string applicationSubHeading)
            : base(properties,
                   applicationHeading,
                   applicationSubHeading)
        {
            DocumentDetails = objDoc;
            DocumentSendHistory = docSendHist;
            PDFData = pdfData;
            To = to;
            ReplyTo = replyTo;
            Subject = subject;
            Body = body;
            DocumentSendHistory = new DocumentSendHistoryResult();
        }
    }
}