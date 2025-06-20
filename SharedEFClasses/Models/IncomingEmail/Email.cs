using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using Newtonsoft.Json;

using SharedEFClasses.Models.Mertex;

namespace SharedEFClasses.Models.IncomingEmail
{
    [Table("Email", Schema = "IncomingEmail")]
    public partial class Email
    {
        [Key]
        public long EmailID { get; set; }

        [StringLength(200)]
        public string EmailMessageID { get; set; }

        public int MailboxID { get; set; }

        [NotMapped]
        public string Body
        {
            get
            {
                return "<p class=\"mb-0\">This email has either been archived or has been permanently deleted from the source inbox</p>";
            }
            set
            {

            }
        }

        [StringLength(254)]
        public string FromEmail { get; set; }

        [StringLength(100)]
        public string FromName { get; set; }

        [StringLength(200)]
        public string Subject { get; set; }

        public DateTime ReceivedDT { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public DateTime? ProcessedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Processed { get; set; }

        public DateTime? JunkDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Junk { get; set; }

        public int? ProcessedMemberID { get; set; }

        public int? JunkMemberID { get; set; }

        [StringLength(50)]
        public string SupplierCode { get; set; }

        public int? InlineAttachmentCount { get; set; }

        public int? RegularAttachmentCount { get; set; }

        public byte? EmailStatusID { get; set; }

        public string ProcessedType { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool SupplierIdentified { get; set; }

        [JsonIgnore]
        [ForeignKey("MailboxID")]
        [InverseProperty("Emails")]
        public virtual Mailbox Mailbox { get; set; }

        [InverseProperty("Email")]
        public virtual ICollection<Attachment> Attachments { get; set; }

        [ForeignKey("EmailStatusID")]
        public virtual EmailStatus EmailStatus { get; set; }

        [ForeignKey("SupplierCode")]
        public virtual SupplierLive Supplier { get; set; }
    }
}
