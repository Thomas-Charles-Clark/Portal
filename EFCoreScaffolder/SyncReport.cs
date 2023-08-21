using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("SyncReport", Schema = "Mertex")]
public partial class SyncReport
{
    [Key]
    [Column("SyncReportID")]
    public short SyncReportId { get; set; }

    [StringLength(50)]
    public string Name { get; set; } = null!;

    public short SendFrequencyHours { get; set; }

    [StringLength(256)]
    public string StoredProcedure { get; set; } = null!;
}
