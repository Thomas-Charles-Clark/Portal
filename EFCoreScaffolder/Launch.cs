using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.ProductPage;

[Table("Launch")]
public partial class Launch
{
    [Key]
    [Column("LaunchID")]
    public short LaunchId { get; set; }

    [Column(TypeName = "date")]
    public DateTime LaunchDate { get; set; }

    [StringLength(50)]
    public string Name { get; set; } = null!;

    [Column("SeasonID")]
    public byte SeasonId { get; set; }

    public short? Year { get; set; }

    [Column(TypeName = "date")]
    public DateTime? TradeLaunchDate { get; set; }

    [Column(TypeName = "date")]
    public DateTime? SalesBriefingDate { get; set; }

    [InverseProperty("Launch")]
    public virtual ICollection<Collection> Collections { get; set; } = new List<Collection>();

    [InverseProperty("Launch")]
    public virtual ICollection<ProductPage> ProductPages { get; set; } = new List<ProductPage>();
}
