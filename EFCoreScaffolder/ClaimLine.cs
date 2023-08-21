using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("ClaimLine", Schema = "Mertex")]
public partial class ClaimLine
{
    [Key]
    [Column("ClaimLineID")]
    [StringLength(30)]
    public string ClaimLineId { get; set; } = null!;

    [Column("ClaimID")]
    [StringLength(25)]
    public string ClaimId { get; set; } = null!;

    [Column("OrderLineID")]
    [StringLength(30)]
    public string? OrderLineId { get; set; }

    [StringLength(50)]
    public string? ProductCode { get; set; }

    [StringLength(10)]
    public string? FaultCode { get; set; }

    [StringLength(50)]
    public string? InvoiceNumber { get; set; }

    [Column("InvoiceDT")]
    [Precision(2)]
    public DateTime? InvoiceDt { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ClaimQuantity { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? AcceptedQuantity { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ReturnedQuantity { get; set; }

    [Column(TypeName = "decimal(16, 4)")]
    public decimal? CreditAmount { get; set; }

    public bool? ReturnToStock { get; set; }

    [Column(TypeName = "decimal(16, 4)")]
    public decimal? OrderPriceSterlingEx { get; set; }

    [Column(TypeName = "decimal(8, 4)")]
    public decimal? DiscountPercentage { get; set; }

    [StringLength(500)]
    public string? Notes { get; set; }

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
