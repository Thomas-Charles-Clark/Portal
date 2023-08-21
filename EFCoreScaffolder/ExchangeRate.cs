using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("ExchangeRate", Schema = "Mertex")]
public partial class ExchangeRate
{
    [Key]
    [StringLength(5)]
    public string MertexCurrencyCode { get; set; } = null!;

    [Column(TypeName = "money")]
    public decimal SterlingExchangeRate { get; set; }

    [Column("CreatedDT")]
    [Precision(2)]
    public DateTime CreatedDt { get; set; }

    [Column("ModifiedDT")]
    [Precision(2)]
    public DateTime ModifiedDt { get; set; }

    [InverseProperty("MertexCurrencyCodeNavigation")]
    public virtual ICollection<Supplier> Suppliers { get; set; } = new List<Supplier>();
}
