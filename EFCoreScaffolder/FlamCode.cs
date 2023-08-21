using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("FlamCode", Schema = "Mertex")]
public partial class FlamCode
{
    [Key]
    [StringLength(10)]
    public string Code { get; set; } = null!;

    [StringLength(300)]
    public string? Value { get; set; }

    [StringLength(50)]
    public string? Abbreviation { get; set; }
}
