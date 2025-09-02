using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;

namespace SharedEFClasses.Models.IncomingEmail
{
    [Table("AttachmentStatus", Schema = "IncomingEmail")]
    public class AttachmentStatus
    {
        [Key]
        public byte AttachmentStatusID { get; set; }

        public string Name { get; set; }
    
        [JsonIgnore]
        [InverseProperty("AttachmentStatus")]
        public virtual ICollection<Attachment> Attachments { get; set; }
    }
}
