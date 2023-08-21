using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Keyless]
[Table("SyncReportSent", Schema = "Mertex")]
public partial class SyncReportSent
{
    [Column("SyncReportID")]
    public short SyncReportId { get; set; }

    [Column("SentDT")]
    [Precision(2)]
    public DateTime SentDt { get; set; }

    [ForeignKey("SyncReportId")]
    public virtual SyncReport SyncReport { get; set; } = null!;
}
