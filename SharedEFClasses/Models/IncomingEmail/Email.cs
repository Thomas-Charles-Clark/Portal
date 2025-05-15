using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.IncomingEmail
{
    [Table("Email", Schema = "IncomingEmail")]
    public partial class Email
    {
        [Key]
        public long EmailID { get; set; }

        [StringLength(998)]
        public string MessageUUID { get; set; }

        public int MailboxID { get; set; }

        [StringLength(256)]
        public string From { get; set; }

        public string Header { get; set; }

        public string Contents { get; set; }

        public DateTime RecievedDT { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public int Deleted { get; set; }

        public DateTime? ProcessedDT { get; set; }

        public int Processed { get; set; }

        public int? ProcessedMemberID { get; set; }

        [StringLength(50)]
        public string SupplierCode { get; set; }

        [ForeignKey("MailboxID")]
        [InverseProperty("Emails")]
        public virtual Mailbox Mailbox { get; set; }

        [InverseProperty("Email")]
        public virtual ICollection<Attachment> Attachments { get; set; }
    }
}
