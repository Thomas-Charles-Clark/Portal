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
    [Table("TradeAccountCreationEmailAttachment", Schema = "portal")]
    public class TradeAccountCreationEmailAttachment
    {
        [Key]
        public int TradeAccountCreationEmailAttachmentID { get; set; }
        public string Name { get;set; }
        public string FilePath { get; set; }
        public int FileSizeBytes { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        [InverseProperty("Attachment")]
        public virtual ICollection<TradeAccountCreationEmail_TradeAccountCreationEmailAttachment> EmailAttachments { get; set; }
    }
}
