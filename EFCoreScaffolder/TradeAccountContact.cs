using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("TradeAccountContact", Schema = "Mertex")]
public partial class TradeAccountContact
{
    [Key]
    [Column("TradeAccountContactID")]
    public int TradeAccountContactId { get; set; }

    [StringLength(10)]
    public string TradeAccountContactTypeCode { get; set; } = null!;

    [StringLength(50)]
    public string TradeAccountCode { get; set; } = null!;

    [StringLength(100)]
    public string Name { get; set; } = null!;

    [StringLength(254)]
    public string? Email { get; set; }

    [StringLength(20)]
    public string? Phone { get; set; }

    [StringLength(20)]
    public string? Mobile { get; set; }

    [Column("CreatedDT")]
    [Precision(2)]
    public DateTime CreatedDt { get; set; }

    [Column("DeletedDT")]
    [Precision(2)]
    public DateTime? DeletedDt { get; set; }

    public bool? Deleted { get; set; }

    [ForeignKey("TradeAccountContactTypeCode")]
    [InverseProperty("TradeAccountContacts")]
    public virtual TradeAccountContactType TradeAccountContactTypeCodeNavigation { get; set; } = null!;
}
