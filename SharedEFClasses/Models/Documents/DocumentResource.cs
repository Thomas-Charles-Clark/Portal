using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;

namespace SharedEFClasses.Models.Documents
{
    [Table("Document_Resource", Schema = "portal")]
    public class DocumentResource
    {
        [Key]
        [Column(Order = 1)]
        public short DocumentID { get; set; }

        [Key]
        [Column(Order = 2)]
        public short ResourceID { get; set; }

        [JsonIgnore]
        [ForeignKey("DocumentID")]
        public virtual Document Document { get; set; }

        [ForeignKey("ResourceID")]
        public virtual Resource Resource { get; set; }
    }
}
