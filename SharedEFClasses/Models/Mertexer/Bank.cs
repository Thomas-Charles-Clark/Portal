using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.Mertexer
{
    [Table("Bank", Schema = "Maintenance")]
    public class Bank
    {
        [Key]
        public string BankCode { get; set; }
        public string Name { get; set; }
        public bool CreditControlVisible { get; set; }
    }
}
