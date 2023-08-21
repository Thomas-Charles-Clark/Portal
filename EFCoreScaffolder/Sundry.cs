using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("Sundry", Schema = "Mertex")]
public partial class Sundry
{
    [Key]
    [StringLength(50)]
    public string Code { get; set; } = null!;

    [StringLength(255)]
    public string? Description { get; set; }

    [StringLength(10)]
    public string? ProductGroup { get; set; }

    [StringLength(10)]
    public string? ItemType { get; set; }

    [StringLength(20)]
    public string? CollectionCode { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Amount { get; set; }

    [Column(TypeName = "decimal(16, 4)")]
    public decimal? PriceEx { get; set; }

    [Column("VATCode")]
    [StringLength(2)]
    public string? Vatcode { get; set; }
}
