using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.IncomingEmail
{
    [Table("MailboxFunction", Schema = "IncomingEmail")]
    public partial class MailboxFunction
    {
        [Key]
        public short MailboxFunctionID { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        [InverseProperty("MailboxFunction")]
        public virtual ICollection<Mailbox> Mailboxes { get; set; }
    }
}
