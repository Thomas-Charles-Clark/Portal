using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("Composition", Schema = "Mertex")]
public partial class Composition
{
    [Key]
    [StringLength(15)]
    public string Code { get; set; } = null!;

    [StringLength(50)]
    public string? Description1 { get; set; }

    [StringLength(50)]
    public string? Description2 { get; set; }

    [StringLength(50)]
    public string? Description3 { get; set; }

    [StringLength(50)]
    public string? Description4 { get; set; }

    [StringLength(50)]
    public string? Description5 { get; set; }

    [StringLength(250)]
    public string? Description { get; set; }
}
