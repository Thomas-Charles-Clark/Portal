using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.IncomingEmail
{
    [Table("Attachment", Schema = "IncomingEmail")]
    public partial class Attachment
    {
        [Key]
        public long AttachmentID { get; set; }

        public long EmailID { get; set; }

        [StringLength(50)]
        public string FileName { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public int Deleted { get; set; }

        public short AttachementTypeID { get; set; }

        public DateTime? ParsedDT { get; set; }

        public int Parsed { get; set; }

        public int? ParsedMemberID { get; set; }

        public string ParsedContents { get; set; }

        [ForeignKey("AttachementTypeID")]
        [InverseProperty("Attachments")]
        public virtual AttachmentType AttachementType { get; set; }

        [ForeignKey("EmailID")]
        [InverseProperty("Attachments")]
        public virtual Email Email { get; set; }
    }
}
