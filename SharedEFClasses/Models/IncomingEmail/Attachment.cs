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
    [Table("Attachment", Schema = "IncomingEmail")]
    public class Attachment
    {
        [Key]
        public long AttachmentID { get; set; }

        public long EmailID { get; set; }

        public string EmailAttachmentID { get; set; }

        public short AttachmentTypeID { get; set; }

        public string FileName { get; set; }

        public string FileExtension { get; set; }

        public int? ParsedMemberID { get; set; }

        public int Size { get; set; }

        public int? InvoiceID { get; set; }

        public bool IsInline { get; set; }

        // This is the important one for inline attachments.
        public string ContentID { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public DateTime? ParsedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Parsed { get; set; }

        [JsonIgnore]
        [ForeignKey("EmailID")]
        public virtual Email Email { get; set; }

        [ForeignKey("AttachmentTypeID")]
        public virtual AttachmentType AttachmentType { get; set; }

        [ForeignKey("ParsedMemberID")]
        public virtual Member ParsedBy { get; set; }

        [ForeignKey("InvoiceID")]
        public virtual EmailInvoice Invoice { get; set; }

        [NotMapped]
        public string FileSizeDisplay
        {
            get
            {
                return $"{((decimal)Size / (decimal)1024 / (decimal)1024):0.00} MB";
            }
        }
    }
}
