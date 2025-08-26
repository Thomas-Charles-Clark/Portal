using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SharedEFClasses.Models.TradeAccounts;

namespace SharedEFClasses.Models.Advertisers
{
    [Table("AdvertiserClass_TradeAccount_Audit", Schema = "dbo")]
    public class AdvertiserClass_TradeAccount_Audit
    {
        [Key]
        public long AdvertiserClass_TradeAccount_AuditID { get; set; }

        public short AdvertiserClassID { get; set; }

        public int TradeAccountID { get; set; }

        public string Action { get; set; }

        public int MemberID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        [ForeignKey("TradeAccountID")]
        public virtual TradeAccount TradeAccount { get; set; }
    }
}
