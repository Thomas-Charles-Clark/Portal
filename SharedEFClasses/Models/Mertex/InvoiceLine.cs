using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.Mertex
{

    [Table("InvoiceLine", Schema = "Mertex")]
    public partial class InvoiceLine
    {
        [Key]
        [Column("InvoiceLineID")]
        [StringLength(25)]
        public string InvoiceLineID { get; set; }

        [Column("InvoiceID")]
        [StringLength(25)]
        public string InvoiceID { get; set; }

        [StringLength(50)]
        public string ProductCode { get; set; }

        [Column()]
        public decimal? QuantityOrdered { get; set; }

        [Column()]
        public decimal? QuantityDespatched { get; set; }

        [Column()]
        public decimal? QuantityInvoiced { get; set; }

        [Column("UnitPriceExVAT")]
        public decimal? UnitPriceExVat { get; set; }

        [Column("LinePriceExVAT")]
        public decimal? LinePriceExVat { get; set; }

        [Column()]
        public decimal? DiscountPercentage { get; set; }

        [Column("VATCode")]
        [StringLength(2)]
        public string Vatcode { get; set; }

        [Column("VATRate")]
        public decimal? Vatrate { get; set; }

        [Column()]
        public decimal? DiscountValue { get; set; }

        [Column("VATValue")]
        public decimal? Vatvalue { get; set; }

        [StringLength(10)]
        public string StockUnit { get; set; }

        [Column()]
        public decimal? UnitCost { get; set; }

        [Column()]
        public decimal? UnitCostCurrency { get; set; }

        [Column()]
        public decimal? LineCost { get; set; }

        [Column()]
        public decimal? LineCostCurrency { get; set; }

        [Column("UnitPriceExVATCurrency")]
        public decimal? UnitPriceExVatcurrency { get; set; }

        [Column("LineValueExVATCurrency")]
        public decimal? LineValueExVatcurrency { get; set; }

        [Column("VATValueCurrency")]
        public decimal? VatvalueCurrency { get; set; }

        [StringLength(20)]
        public string GeneralLedgerCode { get; set; }

        [Column("CreatedDT")]
        public DateTime CreatedDT { get; set; }

        [Column("ModifiedDT")]
        public DateTime ModifiedDT { get; set; }

        [Column("DeletedDT")]
        public DateTime? DeletedDT { get; set; }

        public bool? Deleted { get; set; }

        [Column("CompletedDT")]
        public DateTime? CompletedDT { get; set; }

        public bool? Completed { get; set; }

        [StringLength(4000)]
        public string ErrorDetails { get; set; }

        public bool? Error { get; set; }

        [Column("OrderLineID")]
        [StringLength(30)]
        public string OrderLineID { get; set; }

        [ForeignKey("InvoiceID")]
        [InverseProperty("InvoiceLines")]
        public virtual InvoiceHead Invoice { get; set; }
    }
}
