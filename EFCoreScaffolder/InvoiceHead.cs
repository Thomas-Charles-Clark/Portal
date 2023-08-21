using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("InvoiceHead", Schema = "Mertex")]
public partial class InvoiceHead
{
    [Key]
    [Column("InvoiceID")]
    [StringLength(25)]
    public string InvoiceId { get; set; } = null!;

    [Column("InvoiceDT")]
    [Precision(2)]
    public DateTime? InvoiceDt { get; set; }

    [StringLength(50)]
    public string? TradeAccountCode { get; set; }

    [Column("OrderID")]
    [StringLength(25)]
    public string? OrderId { get; set; }

    public byte? InvoiceOrCredit { get; set; }

    [Column(TypeName = "decimal(16, 4)")]
    public decimal? CarriageValue { get; set; }

    [Column(TypeName = "decimal(16, 3)")]
    public decimal? CarriageValueCurrency { get; set; }

    [StringLength(10)]
    public string? MertexCurrencyCode { get; set; }

    [Column("CreatedDT")]
    [Precision(2)]
    public DateTime CreatedDt { get; set; }

    [Column("ModifiedDT")]
    [Precision(2)]
    public DateTime ModifiedDt { get; set; }

    [Column("CompletedDT")]
    [Precision(2)]
    public DateTime? CompletedDt { get; set; }

    public bool? Completed { get; set; }

    [StringLength(4000)]
    public string? ErrorDetails { get; set; }

    public bool? Error { get; set; }

    [Column("InvoiceLineFirstCheckedDT")]
    [Precision(2)]
    public DateTime? InvoiceLineFirstCheckedDt { get; set; }

    [Column("InvoiceLineLastCheckedDT")]
    [Precision(2)]
    public DateTime? InvoiceLineLastCheckedDt { get; set; }

    [Column("DeletedDT")]
    [Precision(2)]
    public DateTime? DeletedDt { get; set; }

    public bool? Deleted { get; set; }

    [InverseProperty("Invoice")]
    public virtual ICollection<InvoiceLine> InvoiceLines { get; set; } = new List<InvoiceLine>();
}
