using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("PriceListMap", Schema = "Mertex")]
public partial class PriceListMap
{
    [Key]
    [StringLength(10)]
    public string TradePriceListCode { get; set; } = null!;

    [Column("RRPPriceListCode")]
    [StringLength(10)]
    public string? RrppriceListCode { get; set; }
}
