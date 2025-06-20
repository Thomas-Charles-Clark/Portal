using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.Mertex
{
    [Table("Product_Aftercare", Schema = "Mertex")]
    public partial class ProductAftercare
    {
        [Key]
        [Column(Order = 1)]
        [StringLength(50)]
        public string ProductCode { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(5)]
        public string AftercareCode { get; set; }

        public byte SortOrder { get; set; }

        [ForeignKey("ProductCode")]
        public virtual ProductLive Product { get; set; }
    }
}