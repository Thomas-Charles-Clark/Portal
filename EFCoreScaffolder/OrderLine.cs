using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("OrderLine", Schema = "Mertex")]
[Index("DespatchHeadId", "Deleted", "Cancelled", "LineStatusId", "DespatchLineId", Name = "IDX_DespatchHead_DespatchLine_Merge_COVER")]
[Index("Deleted", "Cancelled", "LineStatusId", "DespatchLineId", Name = "IDX_Mertex_OrderLine_DespatchLine_Merge_COVER")]
[Index("Cancelled", Name = "idx_Mertex_OrderLine_Cancelled_Plus5")]
[Index("Deleted", "LineStatusId", "DespatchHeadId", Name = "idx_Mertex_OrderLine_Deleted_LineStatusID_DespatchID")]
[Index("OrderId", "QuantityCancelled", Name = "idx_Mertex_OrderLine_OrderID_QuantityCancelled_Plus4")]
[Index("QuantityCancelled", Name = "idx_Mertex_OrderLine_QuantityCancelled_Plus5")]
public partial class OrderLine
{
    [Key]
    [Column("OrderLineID")]
    [StringLength(30)]
    public string OrderLineId { get; set; } = null!;

    [Column("OrderID")]
    [StringLength(25)]
    public string OrderId { get; set; } = null!;

    public short LineNumber { get; set; }

    [StringLength(500)]
    public string? CustomerLineReference { get; set; }

    [StringLength(50)]
    public string ProductCode { get; set; } = null!;

    [StringLength(255)]
    public string? ProductDescription { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal QuantityOrdered { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? QuantityCancelled { get; set; }

    public bool BackOrderIndicator { get; set; }

    [Column("LineStatusID")]
    public byte? LineStatusId { get; set; }

    [StringLength(255)]
    public string? DetailedLineStatus { get; set; }

    [Column("LineStatusDT")]
    [Precision(2)]
    public DateTime? LineStatusDt { get; set; }

    [Column("DespatchHeadID")]
    [StringLength(25)]
    public string? DespatchHeadId { get; set; }

    [Column("DespatchLineID")]
    [StringLength(30)]
    public string? DespatchLineId { get; set; }

    [Column(TypeName = "money")]
    public decimal? DiscountPercentage { get; set; }

    [Column(TypeName = "money")]
    public decimal? UnitValueSterling { get; set; }

    [Column(TypeName = "money")]
    public decimal? LineValueSterling { get; set; }

    [Column(TypeName = "money")]
    public decimal? LineDiscountValueSterling { get; set; }

    [Column("LineVATValueSterling", TypeName = "money")]
    public decimal? LineVatvalueSterling { get; set; }

    [Column(TypeName = "money")]
    public decimal? UnitValueCurrency { get; set; }

    [Column(TypeName = "money")]
    public decimal? LineValueCurrency { get; set; }

    [Column(TypeName = "money")]
    public decimal? LineDiscountValueCurrency { get; set; }

    [Column("LineVATValueCurrency", TypeName = "money")]
    public decimal? LineVatvalueCurrency { get; set; }

    [Column("VATCode")]
    [StringLength(2)]
    public string? Vatcode { get; set; }

    [Column("VATRate", TypeName = "money")]
    public decimal? Vatrate { get; set; }

    [Column("ModifiedDT")]
    [Precision(2)]
    public DateTime ModifiedDt { get; set; }

    [Column("CreatedDT")]
    [Precision(2)]
    public DateTime CreatedDt { get; set; }

    [Column("DeletedDT")]
    [Precision(2)]
    public DateTime? DeletedDt { get; set; }

    [StringLength(4000)]
    public string? ErrorDetails { get; set; }

    public bool? Deleted { get; set; }

    public bool? Error { get; set; }

    [Column("CompletedDT")]
    [Precision(2)]
    public DateTime? CompletedDt { get; set; }

    public bool? Cancelled { get; set; }

    public bool? Completed { get; set; }

    [Column("EstimatedDespatchDT")]
    [Precision(2)]
    public DateTime? EstimatedDespatchDt { get; set; }

    [StringLength(10)]
    public string? StockLocationCode { get; set; }

    [Column("PurchaseOrderLineID")]
    [StringLength(30)]
    public string? PurchaseOrderLineId { get; set; }

    [StringLength(50)]
    public string? PartnerProductCode { get; set; }

    [StringLength(1)]
    public string? ReserveFlag { get; set; }

    [Column(TypeName = "date")]
    public DateTime? SuggestedDeliveryDate { get; set; }

    [ForeignKey("OrderId")]
    [InverseProperty("OrderLines")]
    public virtual OrderHead Order { get; set; } = null!;
}
