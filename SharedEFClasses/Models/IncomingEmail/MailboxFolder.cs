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
    [Table("MailboxFolder", Schema = "IncomingEmail")]
    public class MailboxFolder
    {
        [Key]
        [StringLength(200)]
        public string MailboxFolderID { get; set; }

        [StringLength(200)]
        public string ParentMailboxFolderID { get; set; }

        public int MailboxID { get; set; }

        [StringLength(200)]
        public string Name { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool? Deleted { get; set; }

        [JsonIgnore]
        [ForeignKey("MailboxID")]
        [InverseProperty("MailboxFolders")]
        public virtual Mailbox Mailbox { get; set; }

        [JsonIgnore]
        [ForeignKey("ParentMailboxFolderID")]
        [InverseProperty("Children")]
        public virtual MailboxFolder ParentMailboxFolder { get; set; }

        [JsonIgnore]
        [InverseProperty("ParentMailboxFolder")]
        public virtual ICollection<MailboxFolder> Children { get; set; }

        [NotMapped]
        public bool HasChildren
        {
            get
            {
                return Children?.Any() == true;
            }
        }
    }
}
