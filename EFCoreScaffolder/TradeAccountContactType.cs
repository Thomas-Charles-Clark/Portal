using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("TradeAccountContactType", Schema = "Mertex")]
public partial class TradeAccountContactType
{
    [Key]
    [StringLength(10)]
    public string TradeAccountContactTypeCode { get; set; } = null!;

    [StringLength(100)]
    public string? Name { get; set; }

    [Column("CreatedDT")]
    [Precision(2)]
    public DateTime CreatedDt { get; set; }

    [Column("DeletedDT")]
    [Precision(2)]
    public DateTime? DeletedDt { get; set; }

    public bool? Deleted { get; set; }

    [InverseProperty("TradeAccountContactTypeCodeNavigation")]
    public virtual ICollection<TradeAccountContact> TradeAccountContacts { get; set; } = new List<TradeAccountContact>();
}
