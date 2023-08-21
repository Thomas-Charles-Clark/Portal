using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("CommodityGroupCode", Schema = "Mertex")]
[Index("CommodityGroupDescription", Name = "UQ_Mertex_CommodityGroupCode_CommodityGroupDescription", IsUnique = true)]
public partial class CommodityGroupCode
{
    [Key]
    [Column("CommodityGroupCode")]
    public long CommodityGroupCode1 { get; set; }

    [StringLength(100)]
    public string? CommodityGroupDescription { get; set; }

    [InverseProperty("CommodityGroupCodeNavigation")]
    public virtual ICollection<CommodityCode> CommodityCodes { get; set; } = new List<CommodityCode>();
}
