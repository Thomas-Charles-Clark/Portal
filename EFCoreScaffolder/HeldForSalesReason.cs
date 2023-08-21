using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("HeldForSalesReason", Schema = "Mertex")]
public partial class HeldForSalesReason
{
    [Key]
    [StringLength(20)]
    public string Code { get; set; } = null!;

    [StringLength(200)]
    public string Name { get; set; } = null!;
}
