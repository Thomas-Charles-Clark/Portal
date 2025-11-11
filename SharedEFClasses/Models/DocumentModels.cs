using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Documents
{

    public enum PortalPDFDocument
    {
        ProformaInvoice = 1,
        BasketRetailReceipt = 2,
        BasketQuote = 3,
        CustomerFurnitureSpecification = 4,
        FurniturePurchaseOrderForSupplier = 5,
        TradeQuote = 6,
        TradeAccountStatement = 7
    }

    public class DocumentSelectResult
    {
        public List<ResourceSelect> Resources { get; set; }

        public DocumentSelect Document { get; set; }

        public DocumentSelect ProformaInvoice { get; set; }

        public DocumentSelect BasketQuote { get; set; }

        public PortalPDFDocument DocumentType { get; set; }

		public DocumentSelectResult(PortalPDFDocument documentType)
        {
            DocumentType = documentType;

            Document = new DocumentSelect();

            Resources = new List<ResourceSelect>();
        }
    }

    public class DocumentPreHeader
    {
        public string HeaderDocumentType { get; set; } // Receipt / Invoice / etc.
        public string HeaderDateLabel { get; set; }
        public string HeaderDate { get; set; } // The date to render in the top-right.
        public string HeaderPageLabel { get; set; }
        public string HeaderOfLabel { get; set; } // The date to render in the top-right.
        public string HeaderOrderIdentifierLabel { get; set; }
    }

    public class DocumentOrderHeader
    {
        public string OrderIdentifier { get; set; }
        public short SortOrder { get; set; }
        public string OrderHeaderLabel1 { get; set; }
        public string OrderHeaderValue1 { get; set; }
        public string OrderHeaderLabel2 { get; set; }
        public string OrderHeaderValue2 { get; set; }
        public string OrderHeaderLabel3 { get; set; }
        public string OrderHeaderValue3 { get; set; }
        public string OrderHeaderLabel4 { get; set; }
        public string OrderHeaderValue4 { get; set; }

        public string OrderHeaderMemoLabel { get; set; }

        public string OrderHeaderParagraphsJSON { get; set; }
        public ICollection<JsonParagraph> OrderHeaderParagraphs
        {
            set
            {

            }
            get
            {
                return JsonConvert.DeserializeObject<List<JsonParagraph>>(OrderHeaderParagraphsJSON ?? "[]").ToList();
            }
        }
    }

    public class DocumentOrderLine
    {
        public string OrderIdentifier { get; set; }
        public string OrderLineIdentifier { get; set; }
        public string Column1 { get; set; }
        public string Column2 { get; set; }
        public string Column3 { get; set; }
        public string Column4 { get; set; }
        public string Column5 { get; set; }
        public string Column6 { get; set; }
        public string Column7 { get; set; }
        public string Column8 { get; set; }
        public string Column9 { get; set; }
        public string Column10 { get; set; }
        public short SortOrder { get; set; }
    }

    public class DocumentHeader
    {
        public string HeaderLabel1 { get; set; }
        public string HeaderValue1 { get; set; }
        public string HeaderLabel2 { get; set; }
        public string HeaderValue2 { get; set; }
        public string HeaderLabel3 { get; set; }
        public string HeaderValue3 { get; set; }
        public string HeaderLabel4 { get; set; }
        public string HeaderValue4 { get; set; }
        public string HeaderParagraphsJSON { get; set; }
        public ICollection<JsonParagraph> HeaderParagraphs
        {
            set
            {
                
            }
            get
            {
                return JsonConvert.DeserializeObject<List<JsonParagraph>>(HeaderParagraphsJSON ?? "[]").ToList();
            }
        }
    }

    public class JsonParagraph
    {
        public string text { get; set; }
        public string textAlign { get; set; }
        public decimal? leading { get; set; }
        public bool monospaced { get; set; }
    }

    public class FooterSelect
    {
        public string FooterLabel1 { get; set; }
        public string FooterValue1 { get; set; }
        public string FooterLabel2 { get; set; }
        public string FooterValue2 { get; set; }
        public string FooterLabel3 { get; set; }
        public string FooterValue3 { get; set; }
        public string FooterLabel4 { get; set; }
        public string FooterValue4 { get; set; }
    }

    public class DocumentOrderTotal
    {
        public string OrderIdentifier { get; set; }
        public string Label { get; set; }
        public string Value { get; set; }
        public bool BorderBottom { get; set; }
        public bool BorderTop { get; set; }
        //public string LineTotal { get; set; }
        //public string DeliveryTotal { get; set; }
        //public string GrandTotal { get; set; }
        //public string TaxRate { get; set; }
        //public string TotalExcludingTax { get; set; }
        //public string TaxAmount { get; set; }
        //public string TotalIncludingTax { get; set; }
    }

    public class DocumentOrderLineMemo
    {
        public string OrderIdentifier { get; set; }
        public string OrderLineIdentifier { get; set; }
        public string Memo { get; set; }
        public short SortOrder { get; set; }
        public string FormattedLineMemoJSON { get; set; }
        public ICollection<JsonParagraph> FormattedLineMemos
        {
            set
            {

            }
            get
            {
                var results = JsonConvert.DeserializeObject<List<JsonParagraph>>(FormattedLineMemoJSON ?? "[]").ToList();

                results.ForEach(m => m.text = $"{{si}}{m.text}{{/si}}");

                return results;
            }
        }
    }

    public class DocumentOrderMemo
    {
        public string OrderIdentifier { get; set; }
        public string Memo { get; set; }
        public short SortOrder { get; set; }
    }

    public class DocumentOrderFooter
    {
        public string OrderIdentifier { get; set; }
        public short SortOrder { get; set; }
        public string OrderFooterLabel1 { get; set; }
        public string OrderFooterValue1 { get; set; }
        public string OrderFooterLabel2 { get; set; }
        public string OrderFooterValue2 { get; set; }
        public string OrderFooterLabel3 { get; set; }
        public string OrderFooterValue3 { get; set; }
        public string OrderFooterLabel4 { get; set; }
        public string OrderFooterValue4 { get; set; }
        public string OrderFooterParagraphsJSON { get; set; }
        public string OrderFooterAnchorTag { get; set; }

        public ICollection<JsonParagraph> OrderFooterParagraphs
        {
            set
            {

            }
            get
            {
                return JsonConvert.DeserializeObject<List<JsonParagraph>>(OrderFooterParagraphsJSON ?? "[]").ToList();
            }
        }
    }

    public class DocumentFooter
    {
        public string DocumentFooterLabel1 { get; set; }
        public string DocumentFooterValue1 { get; set; }
        public string DocumentFooterLabel2 { get; set; }
        public string DocumentFooterValue2 { get; set; }
        public string DocumentFooterLabel3 { get; set; }
        public string DocumentFooterValue3 { get; set; }
        public string DocumentFooterLabel4 { get; set; }
        public string DocumentFooterValue4 { get; set; }
        public string DocumentFooterParagraphsJSON { get; set; }
        public ICollection<JsonParagraph> DocumentFooterParagraphs
        {
            set
            {

            }
            get
            {
                return JsonConvert.DeserializeObject<List<JsonParagraph>>(DocumentFooterParagraphsJSON ?? "[]").ToList();
            }
        }
    }

    public class PageFooter
    {
        public string PagePreFooterNote { get; set; }

        public string PageFooterLine1Label1 { get; set; }
        public string PageFooterLine1Value1 { get; set; }
        public string PageFooterLine1Label2 { get; set; }
        public string PageFooterLine1Value2 { get; set; }

        public string PageFooterLine2Label1 { get; set; }
        public string PageFooterLine2Value1 { get; set; }
        public string PageFooterLine2Label2 { get; set; }
        public string PageFooterLine2Value2 { get; set; }

        public string PageFooterLine3Label1 { get; set; }
        public string PageFooterLine3Value1 { get; set; }
        public string PageFooterLine3Label2 { get; set; }
        public string PageFooterLine3Value2 { get; set; }
    }

    public class DocumentSelect
    {
        public DocumentPreHeader DocumentPreHeader { get; set; }
        public DocumentHeader DocumentHeader { get; set; }
        public List<DocumentOrderHeader> OrderHeaders { get; set; }
        public List<DocumentColumnHeading> ColumnHeadings { get; set; }
        public List<DocumentOrderLine> OrderLines { get; set; }
        public List<DocumentOrderLineMemo> OrderLineMemos { get; set; }
        public List<DocumentOrderTotal> OrderTotals { get; set; }
        public List<DocumentOrderMemo> OrderMemos { get; set; }
        public List<DocumentOrderFooter> OrderFooters { get; set; }
        public DocumentFooter DocumentFooter { get; set; }
        public PageFooter PageFooter { get; set; }
        public DocumentEmail DocumentEmail { get; set; }
        public short DocumentID { get; set; }

        public DocumentSelect()
        {
            DocumentPreHeader = new DocumentPreHeader();
            DocumentHeader = new DocumentHeader();
            OrderHeaders = new List<DocumentOrderHeader>();
            ColumnHeadings = new List<DocumentColumnHeading>();
            OrderLines = new List<DocumentOrderLine>();
            OrderLineMemos = new List<DocumentOrderLineMemo>();
            OrderTotals = new List<DocumentOrderTotal>();
            OrderMemos = new List<DocumentOrderMemo>();
            OrderFooters = new List<DocumentOrderFooter>();
            DocumentFooter = new DocumentFooter();
            PageFooter = new PageFooter();
            DocumentEmail = new DocumentEmail();
            DocumentID = 0;
        }
    }

    public class DocumentEmail
    {
        public short EmailTemplateID { get; set; }
        public string EmailTo { get; set; }
        public string EmailSubject { get; set; }
        public string EmailBody { get; set; }
    }

    public class ProformaInvoice
    {
        public List<DocumentColumnHeading> ColumnHeadings { get; set; }

        public ProformaInvoice()
        {
            ColumnHeadings = new List<DocumentColumnHeading>();
        }
    }

    public class PassDocumentBase64Identifier
    {
        public string d { get; set; }
    }

    public class PassDocumentIdentifier
    {
        public PortalPDFDocument documentType { get; set; }
        public long? basketId { get; set; }
        public int? transactionId { get; set; }
        public int? orderHeadId { get; set; }
        public byte languageId { get; set; }
        public int? tradeAccountId { get; set; }
        public string email { get; set; }
        public string replyTo { get; set; }
        public string subject { get; set; }
        public string body { get; set; }
        public int? memberId { get; set; }
        public DateTime? date { get; set; }
        public string outputMode { get; set; }
    }

    public class DocumentColumnHeading
    {
        public string Name { get; set; }
        public string TextAlign { get; set; }
        public float? WidthPercentage { get; set; }
    }

    public class DocumentSendHistoryResult
    {
        public List<DocumentSend> Results { get; set; }
        public DocumentSendHistoryResult()
        {
            Results = new List<DocumentSend>();
        }
    }

    public class DocumentSend
    {
        public DateTime SentDT { get; set; }
        public string SentBy { get; set; }
        public string To { get; set; }
        public string ReplyTo { get; set; }
        public string CC { get; set; }
        public string BCC { get; set; }
    }

    public class PassDocumentSend
    {
        public short DocumentID { get; set; }
        public long? BasketID { get; set; }
        public int? TransactionID { get; set; }
        public int? OrderHeadID { get; set; }
        public int? TradeAccountID { get; set; }
        public string To { get; set; }
        public string ReplyTo { get; set; }
        public string CC { get; set; }
        public string BCC { get; set; }
        public string FileAttachments { get; set; }
        public string Subject { get; set; }
    }

    public class PassDocumentSendFetch
    {
        public short documentType { get; set; }
        public long? basketId { get; set; }
        public int? transactionId { get; set; }
        public int? orderHeadId { get; set; }
        public int? tradeAccountId { get; set; }
    }
}
