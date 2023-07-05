using SharedEFClasses.Models.Leads;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("CreditControlRegion_SalesMarket", Schema = "portal")]
    public class CreditControlRegion_SalesMarket
    {
        [Key]
        [Column(Order = 1)]
        public byte CreditControlRegionID { get; set; }

        [Key]
        [Column(Order = 2)]
        public byte SalesMarketID { get; set; }

        [ForeignKey("CreditControlRegionID")]
        public virtual CreditControlRegion CreditControlRegion { get; set; }

        [ForeignKey("SalesMarketID")]
        public virtual SalesMarket SalesMarket { get; set; }
    }
}
