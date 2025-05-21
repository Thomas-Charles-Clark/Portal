using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using Newtonsoft.Json;

namespace SharedEFClasses.Models.IncomingEmail
{
    [Table("AttachmentType", Schema = "IncomingEmail")]
    public partial class AttachmentType
    {
        [Key]
        public short AttachmentTypeID { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        public bool ParsingRequired { get; set; }

        [JsonIgnore]
        [InverseProperty("AttachmentType")]
        public virtual ICollection<Attachment> Attachments { get; set; }
    }
}
