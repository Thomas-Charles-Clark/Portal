using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[PrimaryKey("SupplierCode", "ProductCode", "RowNumber")]
[Table("PurchasePrice", Schema = "Mertex")]
public partial class PurchasePrice
{
    [Key]
    [StringLength(50)]
    public string SupplierCode { get; set; } = null!;

    [Key]
    [StringLength(50)]
    public string ProductCode { get; set; } = null!;

    [Key]
    public int RowNumber { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal QuantityBreak { get; set; }

    [Column("PurchasePrice", TypeName = "money")]
    public decimal PurchasePrice1 { get; set; }

    [Column("CreatedDT")]
    [Precision(2)]
    public DateTime CreatedDt { get; set; }

    [Column("ModifiedDT")]
    [Precision(2)]
    public DateTime ModifiedDt { get; set; }

    [StringLength(5)]
    public string? MertexCurrencyCode { get; set; }

    [ForeignKey("SupplierCode")]
    [InverseProperty("PurchasePrices")]
    public virtual Supplier SupplierCodeNavigation { get; set; } = null!;
}
