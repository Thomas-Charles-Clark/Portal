using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.StockManagement;

[Table("Product", Schema = "StockManagement")]
public partial class Product
{
    [Key]
    public int ProductID { get; set; }

    public byte? StatusGroupID { get; set; }

    [StringLength(1)]
    public string Status { get; set; } = null!;

    [Column(TypeName = "money")]
    public decimal? ClearanceDiscountPercentage { get; set; }

    public bool InStock { get; set; }

    [Column(TypeName = "decimal(18, 9)")]
    public decimal? AverageDailySales { get; set; }

    public int? AverageDailySalesDurationDays { get; set; }

    [Column("01_30DaySales", TypeName = "decimal(18, 2)")]
    public decimal? _01_30DaySales { get; set; }

    [Column("31_60DaySales", TypeName = "decimal(18, 2)")]
    public decimal? _31_60DaySales { get; set; }

    [Column("61_90DaySales", TypeName = "decimal(18, 2)")]
    public decimal? _61_90DaySales { get; set; }

    [Column("91_120DaySales", TypeName = "decimal(18, 2)")]
    public decimal? _91_120DaySales { get; set; }

    [Column("21_150DaySales", TypeName = "decimal(18, 2)")]
    public decimal? _21_150DaySales { get; set; }

    [Column("151_180DaySales", TypeName = "decimal(18, 2)")]
    public decimal? _151_180DaySales { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? LifetimeSales { get; set; }

    [Column(TypeName = "date")]
    public DateTime? FirstSaleDate { get; set; }

    [Column(TypeName = "date")]
    public DateTime? LastSaleDate { get; set; }

    [Precision(2)]
    public DateTime CreatedDT { get; set; }

    [Precision(2)]
    public DateTime ModifiedDT { get; set; }

    [Precision(2)]
    public DateTime? DeletedDT { get; set; }

    public bool? Deleted { get; set; }

    [ForeignKey("StatusGroupID")]
    [InverseProperty("Products")]
    public virtual StatusGroup? StatusGroup { get; set; }
}
