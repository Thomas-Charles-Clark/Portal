using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.StockManagement;

[Table("StatusGroup", Schema = "StockManagement")]
[Index("Name", Name = "UQ_StockManagement_StatusGroup_Name", IsUnique = true)]
[Index("SortOrder", Name = "UQ_StockManagement_StatusGroup_SortOrder", IsUnique = true)]
public partial class StatusGroup
{
    [Key]
    public byte StatusGroupID { get; set; }

    [StringLength(50)]
    public string Name { get; set; } = null!;

    public byte SortOrder { get; set; }

    [StringLength(255)]
    public string? Description { get; set; }

    [Precision(2)]
    public DateTime CreatedDT { get; set; }

    [Precision(2)]
    public DateTime ModifiedDT { get; set; }

    [Precision(2)]
    public DateTime? DeletedDT { get; set; }

    public bool? Deleted { get; set; }

    [InverseProperty("StatusGroup")]
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
