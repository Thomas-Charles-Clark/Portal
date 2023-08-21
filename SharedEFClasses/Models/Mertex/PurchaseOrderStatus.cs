using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("PurchaseOrderStatus", Schema = "Mertex")]
    public partial class PurchaseOrderStatus
    {
        [Key]
        [Column("PurchaseOrderStatusID")]
        public byte PurchaseOrderStatusID { get; set; }

        [StringLength(50)]
        public string Name { get; set; }
    }
}