using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("ParcelHead", Schema = "Mertex")]
[Index("DespatchHeadId", Name = "IDX_ParcelHead_Mertex_DespatchLine_Merge_COVER")]
[Index("ParcelId", "DespatchHeadId", Name = "UQ_Mertex_ParcelHead_ParcelID_DespatchID", IsUnique = true)]
public partial class ParcelHead
{
    [Key]
    [Column("ParcelHeadID")]
    public long ParcelHeadId { get; set; }

    [Column("DespatchHeadID")]
    [StringLength(25)]
    public string DespatchHeadId { get; set; } = null!;

    [Column("ParcelID")]
    [StringLength(50)]
    public string ParcelId { get; set; } = null!;

    [StringLength(40)]
    public string ParcelNumber { get; set; } = null!;

    [StringLength(10)]
    public string HaulierCode { get; set; } = null!;

    [Column("TrackingURL")]
    [StringLength(500)]
    public string? TrackingUrl { get; set; }

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

    [Column("ParcelLineUpdatedDT")]
    [Precision(2)]
    public DateTime? ParcelLineUpdatedDt { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? NetWeight { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Width { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Height { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Depth { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? VolumetricWeight { get; set; }

    [StringLength(50)]
    public string? TrackingNumber { get; set; }

    [Column("PCLNo")]
    [StringLength(40)]
    public string? Pclno { get; set; }

    [ForeignKey("DespatchHeadId")]
    [InverseProperty("ParcelHeads")]
    public virtual DespatchHead DespatchHead { get; set; } = null!;

    [InverseProperty("ParcelHead")]
    public virtual ICollection<ParcelLine> ParcelLines { get; set; } = new List<ParcelLine>();
}
