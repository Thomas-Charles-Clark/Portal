using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Mertexer
{
    [Table("CreditController_SalesMarket", Schema = "Maintenance")]
    public class CreditController_SalesMarket
    {
        [Key]
        [Column(Order = 1)]
        public string CreditControllerCode { get; set; }

        [Key]
        [Column(Order = 2)]
        public byte SalesMarketID { get; set; }
    }
}
