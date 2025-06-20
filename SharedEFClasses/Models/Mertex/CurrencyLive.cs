using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.Mertex
{
    [Table("Currency", Schema = "Mertex")]
    public partial class CurrencyLive
    {
        [Key]
        [StringLength(3)]
        public string MertexCurrencyCode { get; set; }

        [StringLength(3)]
        public string CurrencyCode { get; set; }
    }
}
