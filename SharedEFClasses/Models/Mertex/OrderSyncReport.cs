using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("OrderSyncReport", Schema = "Mertex")]
    public partial class OrderSyncReport
    {
        [Key]
        [Column("OrderSyncReportID")]
        public long OrderSyncReportID { get; set; }

        public DateTime Sent { get; set; }
    }
}