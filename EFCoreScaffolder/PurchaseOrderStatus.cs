using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("PurchaseOrderStatus", Schema = "Mertex")]
[Index("Name", Name = "UQ__Purchase__737584F682370286", IsUnique = true)]
public partial class PurchaseOrderStatus
{
    [Key]
    [Column("PurchaseOrderStatusID")]
    public byte PurchaseOrderStatusId { get; set; }

    [StringLength(50)]
    public string Name { get; set; } = null!;
}
