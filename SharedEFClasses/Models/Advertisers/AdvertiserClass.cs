using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;

using SharedEFClasses.Models.TradeAccounts;

namespace SharedEFClasses.Models.Advertisers
{
    [Table("AdvertiserClass", Schema = "dbo")]
    public class AdvertiserClass
    {
        [Key]
        public short AdvertiserClassID { get; set; }

        public string Name { get; set; }

        [ForeignKey("AdvertiserClassID")]
        public virtual ICollection<TradeAccount> TradeAccounts { get; set; }
    }
}
