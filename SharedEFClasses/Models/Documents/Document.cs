using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SharedEFClasses.Models.General;
using Newtonsoft.Json;

namespace SharedEFClasses.Models.Documents
{
    [Table("Document", Schema = "portal")]
    public class Document
    {
        [Key]
        public short DocumentID { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime? ModifiedDT { get; set; }
        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [InverseProperty("Document")]
        public virtual ICollection<DocumentResource> Resources { get; set; }

        [InverseProperty("Document")]
        public virtual ICollection<DocumentOutputMode> OutputModes { get; set; }
    }

}
