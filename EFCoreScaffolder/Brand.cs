using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.ProductPage;

[Table("Brand")]
public partial class Brand
{
    [Key]
    [Column("BrandID")]
    public byte BrandId { get; set; }

    [Column("ParentID")]
    public byte? ParentId { get; set; }

    [StringLength(5)]
    public string Code { get; set; } = null!;

    [StringLength(50)]
    public string Name { get; set; } = null!;

    public byte SortOrder { get; set; }

    public byte? ParentSortOrder { get; set; }

    [Column("DeletedDT", TypeName = "datetime")]
    public DateTime? DeletedDt { get; set; }

    [Column("PageID")]
    public int? PageId { get; set; }

    [Column("LogoURL")]
    [StringLength(255)]
    public string LogoUrl { get; set; } = null!;

    [Column("AttributeID")]
    public short? AttributeId { get; set; }

    public bool? Deleted { get; set; }

    [Column("CompanyID")]
    public byte CompanyId { get; set; }

    [Column("URL")]
    [StringLength(100)]
    public string? Url { get; set; }

    [Required]
    public bool? SubmitToMertex { get; set; }

    [Column(TypeName = "date")]
    public DateTime? OnDate { get; set; }

    [Column(TypeName = "date")]
    public DateTime? OffDate { get; set; }

    [Column("HighResLogoURL")]
    [StringLength(200)]
    public string? HighResLogoUrl { get; set; }

    [InverseProperty("Brand")]
    public virtual ICollection<Collection> Collections { get; set; } = new List<Collection>();

    [InverseProperty("Parent")]
    public virtual ICollection<Brand> InverseParent { get; set; } = new List<Brand>();

    [ForeignKey("ParentId")]
    [InverseProperty("InverseParent")]
    public virtual Brand? Parent { get; set; }

    [InverseProperty("Brand")]
    public virtual ICollection<ProductPage> ProductPages { get; set; } = new List<ProductPage>();
}
