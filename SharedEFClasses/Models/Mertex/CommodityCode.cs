using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.Mertex
{
    [Table("CommodityCode", Schema = "Mertex")]
    public partial class CommodityCode
    {
        [Key]
        [Column("CommodityCode")]
        public long CommodityCode1 { get; set; }

        [StringLength(100)]
        public string CommodityDescription { get; set; }

        public long? CommodityGroupCode { get; set; }

        [ForeignKey("CommodityGroupCode")]
        [InverseProperty("CommodityCodes")]
        public virtual CommodityGroupCode CommodityGroupCodeNavigation { get; set; }
    }
}