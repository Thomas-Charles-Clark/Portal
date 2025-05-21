using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;

namespace SharedEFClasses.Models.IncomingEmail
{
    [Table("Invoice", Schema = "IncomingEmail")]
    public class EmailInvoice
    {
        /*
         [InvoiceID] [int] NOT NULL IDENTITY(1, 1),
        [SupplierReference] [nvarchar] (50) COLLATE Latin1_General_CI_AS NOT NULL,
        [InvoiceDate] [date] NOT NULL,
        [PaymentTermsID] [tinyint] NOT NULL,
        [TotalIncVATCurrency] [money] NOT NULL,
        [VAT] [money] NOT NULL,
        [Dispute] [bit] NOT NULL,
        [MertexInvoiceID] [nvarchar] (30) COLLATE Latin1_General_CI_AS NULL,
        [CreatedDT] [datetime2] (2) NOT NULL CONSTRAINT [DF_IncomingEmail_Invoice_CreatedDT] DEFAULT (sysdatetime()),
        [ModifiedDT] [datetime2] (2) NOT NULL CONSTRAINT [DF_IncomingEmail_Invoice_ModifiedDT] DEFAULT (sysdatetime()),
        [ModifiedMemberID] [int] NOT NULL,
        [DeletedDT] [datetime2] (2) NULL,
        [Deleted] AS (CONVERT([bit],case when [DeletedDT] IS NULL then (0) else (1) end)) PERSISTED,
        [AcceptedByMertexDT] [datetime2] (2) NULL,
        [AcceptedByMertex] AS (CONVERT([bit],case 
         */

        [Key]
        public int InvoiceID { get; set; }

        public string SupplierReference { get; set; }

        public DateTime InvoiceDate { get; set; }

        public byte? PaymentTermsID { get; set; }

        public decimal TotalIncVATCurrency { get; set; }

        public decimal VAT { get; set; }

        public bool Dispute { get; set; }

        public string MertexInvoiceID { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public int ModifiedMemberID { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public DateTime? AcceptedByMertexDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool AcceptedByMertex { get; set; }

        [ForeignKey("PaymentTermsID")]
        public virtual PaymentTerms PaymentTerms { get; set; }

        [ForeignKey("ModifiedMemberID")]
        public virtual Member LastModifiedByMember { get; set; }

        [JsonIgnore]
        [InverseProperty("Invoice")]
        public virtual ICollection<Attachment> Attachments { get; set; }
    }
}
