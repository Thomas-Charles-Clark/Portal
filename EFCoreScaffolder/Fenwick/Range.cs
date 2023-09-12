using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.Fenwicks;

[Table("Range", Schema = "Fenwicks")]
public partial class Range
{
    [Key]
    public long RangeID { get; set; }

    public int BranchID { get; set; }

    public int ProductID { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Quantity { get; set; }

    [Column(TypeName = "date")]
    public DateTime? StartDate { get; set; }

    [Column(TypeName = "date")]
    public DateTime? EndDate { get; set; }

    [Precision(2)]
    public DateTime CreatedDT { get; set; }

    [Precision(2)]
    public DateTime ModifiedDT { get; set; }

    public int ModifiedMemberID { get; set; }

    [Precision(2)]
    public DateTime? DeletedDT { get; set; }

    public bool? Deleted { get; set; }

    [ForeignKey("ModifiedMemberID")]
    [InverseProperty("Ranges")]
    public virtual Member ModifiedMember { get; set; } = null!;

    [ForeignKey("ProductID")]
    [InverseProperty("Ranges")]
    public virtual Product Product { get; set; } = null!;
}
