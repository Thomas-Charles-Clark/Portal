using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("Haulier", Schema = "Mertex")]
public partial class Haulier
{
    [Key]
    [StringLength(10)]
    public string Code { get; set; } = null!;

    [StringLength(100)]
    public string Name { get; set; } = null!;

    public TimeSpan? CutOffTime { get; set; }

    public bool ExpectParcelData { get; set; }

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
}
