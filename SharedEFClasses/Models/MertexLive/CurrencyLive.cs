using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("Currency", Schema = "Mertex")]
    public class CurrencyLive
    {
        [Key]
        public string MertexCurrencyCode { get; set; }
        public string CurrencyCode { get; set; }
    }
}
