using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("ParcelLine", Schema = "Mertex")]
[Index("ParcelLineId", Name = "UQ_Mertex_ParcelLine_ParcelLineID", IsUnique = true)]
[Index("DespatchLineId", Name = "idx_Mertex_ParcelLine_DespatchLineID_Plus3")]
[Index("ParcelHeadId", "ParcelLineNumber", Name = "idx_Mertex_ParcelLine_ParcelHeadID_ParcelLineNumber")]
public partial class ParcelLine
{
    [Key]
    [Column("ParcelLineID")]
    public long ParcelLineId { get; set; }

    [Column("ParcelHeadID")]
    public long ParcelHeadId { get; set; }

    public int ParcelLineNumber { get; set; }

    [Column("DespatchLineID")]
    [StringLength(30)]
    public string DespatchLineId { get; set; } = null!;

    [StringLength(50)]
    public string ProductCode { get; set; } = null!;

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? QuantityDespatched { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? QuantityInvoiced { get; set; }

    [StringLength(50)]
    public string? Batch { get; set; }

    [StringLength(50)]
    public string? Piece { get; set; }

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

    [StringLength(4000)]
    public string? ErrorDetails { get; set; }

    public bool? Error { get; set; }

    [Column("CompletedDT")]
    [Precision(2)]
    public DateTime? CompletedDt { get; set; }

    public bool? Completed { get; set; }

    [ForeignKey("DespatchLineId")]
    [InverseProperty("ParcelLines")]
    public virtual DespatchLine DespatchLine { get; set; } = null!;

    [ForeignKey("ParcelHeadId")]
    [InverseProperty("ParcelLines")]
    public virtual ParcelHead ParcelHead { get; set; } = null!;
}
