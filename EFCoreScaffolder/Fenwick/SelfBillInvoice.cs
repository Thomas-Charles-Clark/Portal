using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.Fenwicks;

[Table("SelfBillInvoice", Schema = "Fenwicks")]
[Index("Document", Name = "UQ_Fenwicks_SelfBillInvoice_Document", IsUnique = true)]
[Index("InvoiceDate", "BranchID", Name = "UQ_Fenwicks_SelfBillInvoice_InvoiceDate_BranchID", IsUnique = true)]
public partial class SelfBillInvoice
{
    [Key]
    public int SelfBillInvoiceID { get; set; }

    [Column(TypeName = "date")]
    public DateTime InvoiceDate { get; set; }

    public int BranchID { get; set; }

    [StringLength(500)]
    public string Document { get; set; } = null!;

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? TotalGrossSales { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? TotalVAT { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? TotalCommission { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? FenwicksVariance { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? MertexRoundingVariance { get; set; }

    [Precision(2)]
    public DateTime CreatedDT { get; set; }

    [Precision(2)]
    public DateTime? SignedOffDT { get; set; }

    public bool? SignedOff { get; set; }

    public int? SignedOffMemberID { get; set; }

    [StringLength(2000)]
    public string? Notes { get; set; }

    [Precision(2)]
    public DateTime? DeletedDT { get; set; }

    public bool? Deleted { get; set; }

    [ForeignKey("BranchID")]
    [InverseProperty("SelfBillInvoices")]
    public virtual Branch Branch { get; set; } = null!;

    [ForeignKey("SignedOffMemberID")]
    [InverseProperty("SelfBillInvoices")]
    public virtual Member? SignedOffMember { get; set; }
}
