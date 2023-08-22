using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.ProductPage;

[Table("Collection")]
[Index("Deleted", Name = "idx_Collection_Deleted")]
public partial class Collection
{
    [Key]
    [Column("CollectionID")]
    public short CollectionId { get; set; }

    [StringLength(20)]
    public string? Code { get; set; }

    [Column("PBCode")]
    [StringLength(20)]
    public string? Pbcode { get; set; }

    [StringLength(100)]
    public string Name { get; set; } = null!;

    [StringLength(70)]
    public string? Heading { get; set; }

    [StringLength(70)]
    public string? SubHeading { get; set; }

    [StringLength(2000)]
    public string? Description { get; set; }

    [Column("URLKeywords")]
    [StringLength(100)]
    public string Urlkeywords { get; set; } = null!;

    [StringLength(100)]
    public string? TitleTag { get; set; }

    [StringLength(155)]
    public string? MetaDescription { get; set; }

    [Column("BrandID")]
    public byte BrandId { get; set; }

    [Column("ProductTypeID")]
    public byte ProductTypeId { get; set; }

    [Column("LaunchID")]
    public short LaunchId { get; set; }

    [Column("BrochureID")]
    public short? BrochureId { get; set; }

    [Column("VideoID")]
    public short? VideoId { get; set; }

    [Column("CreatedDT")]
    [Precision(2)]
    public DateTime CreatedDt { get; set; }

    [Column("ModifiedDT")]
    [Precision(2)]
    public DateTime ModifiedDt { get; set; }

    [Column("DeletedDT")]
    [Precision(2)]
    public DateTime? DeletedDt { get; set; }

    [Column(TypeName = "date")]
    public DateTime? OnDate { get; set; }

    [Column(TypeName = "date")]
    public DateTime? OffDate { get; set; }

    public bool New { get; set; }

    public bool? Deleted { get; set; }

    public bool PreviewColourways { get; set; }

    [ForeignKey("BrandId")]
    [InverseProperty("Collections")]
    public virtual Brand Brand { get; set; } = null!;

    [ForeignKey("LaunchId")]
    [InverseProperty("Collections")]
    public virtual Launch Launch { get; set; } = null!;

    [InverseProperty("CanonicalCollection")]
    public virtual ICollection<ProductPage> ProductPages { get; set; } = new List<ProductPage>();

    [ForeignKey("ProductTypeId")]
    [InverseProperty("Collections")]
    public virtual ProductType ProductType { get; set; } = null!;
}
