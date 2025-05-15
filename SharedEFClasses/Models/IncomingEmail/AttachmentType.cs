using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        public string ParsingDataRequrements { get; set; }

        [InverseProperty("AttachementType")]
        public virtual ICollection<Attachment> Attachments { get; set; }
    }
}
