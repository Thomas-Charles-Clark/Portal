using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("OrderSyncReport", Schema = "Mertex")]
[Index("Sent", Name = "UQ_Mertex_OrderSyncReport_Sent", IsUnique = true)]
public partial class OrderSyncReport
{
    [Key]
    [Column("OrderSyncReportID")]
    public long OrderSyncReportId { get; set; }

    [Column(TypeName = "date")]
    public DateTime Sent { get; set; }
}
