using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("DespatchHead", Schema = "Mertex")]
[Index("HaulierCode", Name = "IDX_DespatchHead_HaulierCode_DespatchLine_Merge_COVER")]
public partial class DespatchHead
{
    [Key]
    [Column("DespatchHeadID")]
    [StringLength(25)]
    public string DespatchHeadId { get; set; } = null!;

    [StringLength(20)]
    public string? Source { get; set; }

    [Column("DespatchedDT")]
    [Precision(2)]
    public DateTime? DespatchedDt { get; set; }

    [StringLength(50)]
    public string? DeliveryName { get; set; }

    [StringLength(60)]
    public string? DeliveryAddressLine1 { get; set; }

    [StringLength(60)]
    public string? DeliveryAddressLine2 { get; set; }

    [StringLength(50)]
    public string? DeliveryTown { get; set; }

    [StringLength(40)]
    public string? DeliveryCounty { get; set; }

    [StringLength(20)]
    public string? DeliveryPostcode { get; set; }

    [StringLength(3)]
    public string? DeliveryCountryCode { get; set; }

    [StringLength(10)]
    public string? HaulierCode { get; set; }

    [StringLength(10)]
    public string? CarriageCode { get; set; }

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

    [Column(TypeName = "money")]
    public decimal? DeliveryChargeSterling { get; set; }

    [Column(TypeName = "money")]
    public decimal? DeliveryChargeCurrency { get; set; }

    [StringLength(20)]
    public string? DespatchedBy { get; set; }

    [InverseProperty("DespatchHead")]
    public virtual ICollection<DespatchLine> DespatchLines { get; set; } = new List<DespatchLine>();

    [InverseProperty("DespatchHead")]
    public virtual ICollection<ParcelHead> ParcelHeads { get; set; } = new List<ParcelHead>();
}
