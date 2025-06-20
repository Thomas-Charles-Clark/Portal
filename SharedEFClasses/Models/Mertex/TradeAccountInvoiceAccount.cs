using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.Mertex
{
    [Table("TradeAccount_InvoiceAccount", Schema = "Mertex")]
    public partial class TradeAccountInvoiceAccount
    {
        [Key]
        [Column(Order = 1)]
        [StringLength(50)]
        public string ParentTradeAccountCode { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(50)]
        public string TradeAccountCode { get; set; }
    }
}