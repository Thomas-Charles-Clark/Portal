using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("PurchaseOrderLine", Schema = "Mertex")]
public partial class PurchaseOrderLine
{
    [Key]
    [Column("PurchaseOrderLineID")]
    [StringLength(30)]
    public string PurchaseOrderLineId { get; set; } = null!;

    [Column("PurchaseOrderHeadID")]
    [StringLength(25)]
    public string PurchaseOrderHeadId { get; set; } = null!;

    public short? PurchaseOrderLineNumber { get; set; }

    [Column("OrderID")]
    [StringLength(25)]
    public string? OrderId { get; set; }

    [StringLength(50)]
    public string? ProductCode { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? QuantityOrdered { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? QuantityReceived { get; set; }

    [Column("PromisedDT", TypeName = "datetime")]
    public DateTime? PromisedDt { get; set; }

    [Column("ExpectedDT", TypeName = "datetime")]
    public DateTime? ExpectedDt { get; set; }

    public bool? DateConfirmed { get; set; }

    public bool? LineComplete { get; set; }

    [Column("LineUnitPriceSTG", TypeName = "money")]
    public decimal? LineUnitPriceStg { get; set; }

    [Column("LineUnitPriceCURR", TypeName = "money")]
    public decimal? LineUnitPriceCurr { get; set; }

    [StringLength(10)]
    public string? StockUnitCode { get; set; }

    [StringLength(50)]
    public string? SupplierProductCode { get; set; }

    public bool? SampleRequired { get; set; }

    [StringLength(255)]
    public string? DetailedPurchaseOrderLineStatus { get; set; }

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
}
