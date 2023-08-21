using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("DespatchLine", Schema = "Mertex")]
[Index("DespatchHeadId", Name = "idx_Mertex_DespatchLine_DespatchHeadID_Plus2")]
public partial class DespatchLine
{
    [Key]
    [Column("DespatchLineID")]
    [StringLength(30)]
    public string DespatchLineId { get; set; } = null!;

    [Column("DespatchHeadID")]
    [StringLength(25)]
    public string? DespatchHeadId { get; set; }

    [StringLength(20)]
    public string? Source { get; set; }

    [StringLength(50)]
    public string? ProductCode { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? QuantityDespatched { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? QuantityInvoiced { get; set; }

    [Column("ParcelJSON")]
    public string? ParcelJson { get; set; }

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

    public bool? Completed { get; set; }

    [Column("ParcelHeadUpdatedDT")]
    [Precision(2)]
    public DateTime? ParcelHeadUpdatedDt { get; set; }

    [Column("ParcelLineUpdatedDT")]
    [Precision(2)]
    public DateTime? ParcelLineUpdatedDt { get; set; }

    [ForeignKey("DespatchHeadId")]
    [InverseProperty("DespatchLines")]
    public virtual DespatchHead? DespatchHead { get; set; }

    [InverseProperty("DespatchLine")]
    public virtual ICollection<ParcelLine> ParcelLines { get; set; } = new List<ParcelLine>();
}
