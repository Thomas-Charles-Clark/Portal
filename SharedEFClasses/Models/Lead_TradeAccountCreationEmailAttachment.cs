using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using SharedEFClasses.Models.Leads;

namespace SharedEFClasses.Models
{
    [Table("Lead_TradeAccountCreationEmailAttachment", Schema = "portal")]
    public class Lead_TradeAccountCreationEmailAttachment
    {
        [Key]
        [Column(Order = 1)]
        public long LeadID { get; set; }

        [Key]
        [Column(Order = 2)]
        public int TradeAccountCreationEmailAttachmentID { get; set; }

        public byte SortOrder { get; set; }

        [JsonIgnore]
        [ForeignKey("LeadID")]
        public virtual Lead Lead { get; set; }

        [ForeignKey("TradeAccountCreationEmailAttachmentID")]
        public virtual TradeAccountCreationEmailAttachment Attachment { get; set; }
    }
}
