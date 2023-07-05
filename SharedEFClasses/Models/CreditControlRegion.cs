using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("CreditControlRegion", Schema = "portal")]
    public class CreditControlRegion
    {
        [Key]
        public byte CreditControlRegionID { get; set; }

        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string BankName { get; set; }
        public string BankSortCode { get; set; }
        public string BankAccountNumber { get; set; }
        public string IBAN { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [InverseProperty("CreditControlRegion")]
        public virtual ICollection<CreditControlRegion_SalesMarket> SalesMarkets { get; set; }
    }
}
