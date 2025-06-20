using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.Mertex
{
    [Table("InvoiceHead", Schema = "Mertex")]
    public partial class InvoiceHead
    {
        [Key]
        [Column("InvoiceID")]
        [StringLength(25)]
        public string InvoiceID { get; set; }

        [Column("InvoiceDT")]
        public DateTime? InvoiceDT { get; set; }

        [StringLength(50)]
        public string TradeAccountCode { get; set; }

        [Column("OrderID")]
        [StringLength(25)]
        public string OrderID { get; set; }

        public byte? InvoiceOrCredit { get; set; }

        [Column()]
        public decimal? CarriageValue { get; set; }

        [Column()]
        public decimal? CarriageValueCurrency { get; set; }

        [StringLength(10)]
        public string MertexCurrencyCode { get; set; }

        [Column("CreatedDT")]
        public DateTime CreatedDT { get; set; }

        [Column("ModifiedDT")]
        public DateTime ModifiedDT { get; set; }

        [Column("CompletedDT")]
        public DateTime? CompletedDT { get; set; }

        public bool? Completed { get; set; }

        [StringLength(4000)]
        public string ErrorDetails { get; set; }

        public bool? Error { get; set; }

        [Column("InvoiceLineFirstCheckedDT")]
        public DateTime? InvoiceLineFirstCheckedDT { get; set; }

        [Column("InvoiceLineLastCheckedDT")]
        public DateTime? InvoiceLineLastCheckedDT { get; set; }

        [Column("DeletedDT")]
        public DateTime? DeletedDT { get; set; }

        public bool? Deleted { get; set; }

        [InverseProperty("Invoice")]
        public virtual ICollection<InvoiceLine> InvoiceLines { get; set; } = new List<InvoiceLine>();
    }
}