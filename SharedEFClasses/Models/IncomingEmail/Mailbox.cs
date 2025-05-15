using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.IncomingEmail
{
    [Table("Mailbox", Schema = "IncomingEmail")]
    public partial class Mailbox
    {
        [Key]
        public int MailboxID { get; set; }

        [StringLength(36)]
        public string UserID { get; set; }

        [StringLength(256)]
        public string Email { get; set; }

        [StringLength(256)]
        public string Username { get; set; }

        [StringLength(50)]
        public string Password { get; set; }

        public short MailboxFunctionID { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [ForeignKey("MailboxFunctionID")]
        [InverseProperty("Mailboxes")]
        public virtual MailboxFunction MailboxFunction { get; set; }

        [InverseProperty("Mailbox")]
        public virtual ICollection<Email> Emails { get; set; }
    }
}
