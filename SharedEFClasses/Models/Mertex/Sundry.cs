using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("Sundry", Schema = "Mertex")]
    public partial class Sundry
    {
        [Key]
        [StringLength(50)]
        public string Code { get; set; }

        [StringLength(255)]
        public string Description { get; set; }

        [StringLength(10)]
        public string ProductGroup { get; set; }

        [StringLength(10)]
        public string ItemType { get; set; }

        [StringLength(20)]
        public string CollectionCode { get; set; }

        [Column()]
        public decimal? Amount { get; set; }

        [Column()]
        public decimal? PriceEx { get; set; }

        [Column("VATCode")]
        [StringLength(2)]
        public string Vatcode { get; set; }
    }
}