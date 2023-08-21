using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("ExchangeRate", Schema = "Mertex")]
    public partial class ExchangeRate
    {
        [Key]
        [StringLength(5)]
        public string MertexCurrencyCode { get; set; }

        [Column(TypeName = "money")]
        public decimal SterlingExchangeRate { get; set; }

        [Column("CreatedDT")]
        public DateTime CreatedDT { get; set; }

        [Column("ModifiedDT")]
        public DateTime ModifiedDT { get; set; }

        [InverseProperty("MertexCurrencyCodeNavigation")]
        public virtual ICollection<Supplier> Suppliers { get; set; } = new List<Supplier>();
    }
}