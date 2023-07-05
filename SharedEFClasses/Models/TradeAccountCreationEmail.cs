using SharedEFClasses.Models.General;
using SharedEFClasses.Models.Leads;
using SharedEFClasses.Models.Mertexer;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("TradeAccountCreationEmail", Schema = "portal")]
    public class TradeAccountCreationEmail
    {
        [Key]
        public int TradeAccountCreationEmailID { get; set; }
        public byte SalesMarketID { get; set; }
        public string MertexLanguageCode { get; set; }
        public byte? LanguageID { get; set; }
        public bool DisplayContactDetails_AccountManager { get; set; }
        public bool DisplayContactDetails_CustomerService { get; set; }
        public bool DisplayContactDetails_CreditControl { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [ForeignKey("SalesMarketID")]
        public virtual SalesMarket SalesMarket { get; set; }

        [ForeignKey("MertexLanguageCode")]
        public virtual MertexLanguage MertexLanguage { get; set; }

        [ForeignKey("LanguageID")]
        public virtual Language Language { get; set; }

        [InverseProperty("TradeAccountCreationEmail")]
        public virtual ICollection<TradeAccountCreationEmail_TradeAccountCreationEmailAttachment> EmailAttachments { get; set; }
    }
}
