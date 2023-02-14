using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("PurchasePrice", Schema = "Mertex")]
    public class PurchasePriceObj
    {
        [Key]
        [Column(Order = 1)]
        public string SupplierCode { get; set; }

        [Key]
        [Column(Order = 2)]
        public string ProductCode { get; set; }

        [Key]
        [Column(Order = 3)]
        public int RowNumber { get; set; }

        public decimal? QuantityBreak { get; set; }

        public decimal? PurchasePrice { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public virtual Supplier Supplier { get; set; }

        public virtual ProductLive Product { get; set; }
    }
}
