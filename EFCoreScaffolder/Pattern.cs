using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.ProductPage;

[Table("Pattern")]
public partial class Pattern
{
    [Key]
    [Column("PatternID")]
    public byte PatternId { get; set; }

    [StringLength(50)]
    public string Name { get; set; } = null!;

    [Column("AttributeID")]
    public short? AttributeId { get; set; }

    [Column("MertexID")]
    public short? MertexId { get; set; }

    [Column("DeletedDT")]
    public DateTime? DeletedDt { get; set; }

    public bool? Deleted { get; set; }

    [InverseProperty("Pattern")]
    public virtual ICollection<ProductPage> ProductPages { get; set; } = new List<ProductPage>();
}
