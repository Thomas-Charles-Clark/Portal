using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("PurchasePrice", Schema = "Mertex")]
    public partial class PurchasePrice
    {
        [Key]
        [Column(Order = 1)]
        [StringLength(50)]
        public string SupplierCode { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(50)]
        public string ProductCode { get; set; }

        [Key]
        [Column(Order = 3)]
        public int RowNumber { get; set; }

        [Column()]
        public decimal QuantityBreak { get; set; }

        [Column("PurchasePrice", TypeName = "money")]
        public decimal PurchasePrice1 { get; set; }

        [Column("CreatedDT")]
        public DateTime CreatedDT { get; set; }

        [Column("ModifiedDT")]
        public DateTime ModifiedDT { get; set; }

        [StringLength(5)]
        public string MertexCurrencyCode { get; set; }

        [ForeignKey("SupplierCode")]
        [InverseProperty("PurchasePrices")]
        public virtual Supplier SupplierCodeNavigation { get; set; }
    }
}