using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SharedEFClasses.Models.MertexLive;

[PrimaryKey("ParentTradeAccountCode", "TradeAccountCode")]
[Table("TradeAccount_InvoiceAccount", Schema = "Mertex")]
public partial class TradeAccountInvoiceAccount
{
    [Key]
    [StringLength(50)]
    public string ParentTradeAccountCode { get; set; } = null!;

    [Key]
    [StringLength(50)]
    public string TradeAccountCode { get; set; } = null!;
}
