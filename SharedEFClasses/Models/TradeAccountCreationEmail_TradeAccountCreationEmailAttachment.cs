using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("TradeAccountCreationEmail_TradeAccountCreationEmailAttachment", Schema = "portal")]
    public class TradeAccountCreationEmail_TradeAccountCreationEmailAttachment
    {
        [Key]
        [Column(Order = 1)]
        public int TradeAccountCreationEmailID { get; set; }

        [Key]
        [Column(Order = 2)]
        public int TradeAccountCreationEmailAttachmentID { get; set; }

        public byte SortOrder { get; set; }

        [JsonIgnore]
        [ForeignKey("TradeAccountCreationEmailID")]
        public virtual TradeAccountCreationEmail Email { get; set; }

        [ForeignKey("TradeAccountCreationEmailAttachmentID")]
        public virtual TradeAccountCreationEmailAttachment Attachment { get; set; }
    }
}
