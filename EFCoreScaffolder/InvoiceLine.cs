using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("InvoiceLine", Schema = "Mertex")]
public partial class InvoiceLine
{
    [Key]
    [Column("InvoiceLineID")]
    [StringLength(25)]
    public string InvoiceLineId { get; set; } = null!;

    [Column("InvoiceID")]
    [StringLength(25)]
    public string? InvoiceId { get; set; }

    [StringLength(50)]
    public string? ProductCode { get; set; }

    [Column(TypeName = "decimal(16, 2)")]
    public decimal? QuantityOrdered { get; set; }

    [Column(TypeName = "decimal(16, 2)")]
    public decimal? QuantityDespatched { get; set; }

    [Column(TypeName = "decimal(16, 2)")]
    public decimal? QuantityInvoiced { get; set; }

    [Column("UnitPriceExVAT", TypeName = "decimal(16, 4)")]
    public decimal? UnitPriceExVat { get; set; }

    [Column("LinePriceExVAT", TypeName = "decimal(16, 4)")]
    public decimal? LinePriceExVat { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? DiscountPercentage { get; set; }

    [Column("VATCode")]
    [StringLength(2)]
    public string? Vatcode { get; set; }

    [Column("VATRate", TypeName = "decimal(5, 2)")]
    public decimal? Vatrate { get; set; }

    [Column(TypeName = "decimal(16, 4)")]
    public decimal? DiscountValue { get; set; }

    [Column("VATValue", TypeName = "decimal(16, 4)")]
    public decimal? Vatvalue { get; set; }

    [StringLength(10)]
    public string? StockUnit { get; set; }

    [Column(TypeName = "decimal(16, 4)")]
    public decimal? UnitCost { get; set; }

    [Column(TypeName = "decimal(16, 4)")]
    public decimal? UnitCostCurrency { get; set; }

    [Column(TypeName = "decimal(16, 4)")]
    public decimal? LineCost { get; set; }

    [Column(TypeName = "decimal(16, 4)")]
    public decimal? LineCostCurrency { get; set; }

    [Column("UnitPriceExVATCurrency", TypeName = "decimal(16, 4)")]
    public decimal? UnitPriceExVatcurrency { get; set; }

    [Column("LineValueExVATCurrency", TypeName = "decimal(16, 4)")]
    public decimal? LineValueExVatcurrency { get; set; }

    [Column("VATValueCurrency", TypeName = "decimal(16, 4)")]
    public decimal? VatvalueCurrency { get; set; }

    [StringLength(20)]
    public string? GeneralLedgerCode { get; set; }

    [Column("CreatedDT")]
    [Precision(2)]
    public DateTime CreatedDt { get; set; }

    [Column("ModifiedDT")]
    [Precision(2)]
    public DateTime ModifiedDt { get; set; }

    [Column("DeletedDT")]
    [Precision(2)]
    public DateTime? DeletedDt { get; set; }

    public bool? Deleted { get; set; }

    [Column("CompletedDT")]
    [Precision(2)]
    public DateTime? CompletedDt { get; set; }

    public bool? Completed { get; set; }

    [StringLength(4000)]
    public string? ErrorDetails { get; set; }

    public bool? Error { get; set; }

    [Column("OrderLineID")]
    [StringLength(30)]
    public string? OrderLineId { get; set; }

    [ForeignKey("InvoiceId")]
    [InverseProperty("InvoiceLines")]
    public virtual InvoiceHead? Invoice { get; set; }
}
