using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("Supplier", Schema = "Mertex")]
public partial class Supplier
{
    [Key]
    [StringLength(50)]
    public string Code { get; set; } = null!;

    [StringLength(50)]
    public string? Name { get; set; }

    [StringLength(60)]
    public string? AddressLine1 { get; set; }

    [StringLength(60)]
    public string? AddressLine2 { get; set; }

    [StringLength(50)]
    public string? Town { get; set; }

    [StringLength(40)]
    public string? County { get; set; }

    [StringLength(20)]
    public string? Postcode { get; set; }

    [StringLength(3)]
    public string? CountryCode { get; set; }

    [Column("CreatedDT")]
    [Precision(2)]
    public DateTime CreatedDt { get; set; }

    [Column("ModifiedDT")]
    [Precision(2)]
    public DateTime ModifiedDt { get; set; }

    [Column("DeletedDT")]
    [Precision(2)]
    public DateTime? DeletedDt { get; set; }

    public bool? Deleted { get; set; }

    [StringLength(5)]
    public string? MertexCurrencyCode { get; set; }

    [ForeignKey("MertexCurrencyCode")]
    [InverseProperty("Suppliers")]
    public virtual ExchangeRate? MertexCurrencyCodeNavigation { get; set; }

    [InverseProperty("DefaultSupplierCodeNavigation")]
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();

    [InverseProperty("SupplierCodeNavigation")]
    public virtual ICollection<PurchasePrice> PurchasePrices { get; set; } = new List<PurchasePrice>();
}
