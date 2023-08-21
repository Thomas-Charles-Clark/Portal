using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[Table("Currency", Schema = "Mertex")]
public partial class Currency
{
    [Key]
    [StringLength(3)]
    public string MertexCurrencyCode { get; set; } = null!;

    [StringLength(3)]
    public string? CurrencyCode { get; set; }
}
