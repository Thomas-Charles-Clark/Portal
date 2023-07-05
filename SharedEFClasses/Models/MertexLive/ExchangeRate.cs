using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("ExchangeRate", Schema = "Mertex")]
    public class ExchangeRate
    {
        [Key]
        public string MertexCurrencyCode { get; set; }
        public decimal SterlingExchangeRate { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime ModifiedDT { get; set; }
    }
}
