using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("Carriage", Schema = "Mertex")]
public partial class Carriage
{
    [Key]
    [StringLength(40)]
    public string Key { get; set; } = null!;

    [StringLength(20)]
    public string? Code { get; set; }

    [StringLength(20)]
    public string? HaulierCode { get; set; }

    [StringLength(100)]
    public string? Description { get; set; }

    public bool? PriorityOrder { get; set; }

    [StringLength(100)]
    public string? DespatchPathway { get; set; }

    [Column("GBIndicator")]
    public bool Gbindicator { get; set; }
}
