using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Keyless]
[Table("EUExportCommodityGroupCodeMap", Schema = "Mertex")]
[Index("Description", Name = "UQ_Mertex_EUExportCommodityGroupCodeMap_Description", IsUnique = true)]
public partial class EuexportCommodityGroupCodeMap
{
    [StringLength(255)]
    public string Description { get; set; } = null!;

    public long GroupCode { get; set; }
}
