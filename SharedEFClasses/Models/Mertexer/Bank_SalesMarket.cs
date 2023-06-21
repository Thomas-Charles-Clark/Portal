using SharedEFClasses.Models.Leads;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.Mertexer
{
    [Table("Bank_SalesMarket", Schema = "Maintenance")]
    public class Bank_SalesMarket
    {
        [Key]
        [Column(Order = 1)]
        public string BankCode { get; set; }

        [Key]
        [Column(Order = 2)]
        public byte SalesMarketID { get; set; }

        public string MertexLanguageCode { get; set; }

        [ForeignKey("SalesMarketID")]
        public virtual SalesMarket SalesMarket {get;set;}
    }
}
