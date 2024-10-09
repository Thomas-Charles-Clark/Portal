using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("SourceGroup", Schema = "mbr")]
    public class SourceGroup
    {
        [Key]
        public byte SourceGroupID { get; set; }

        public string Name { get; set; }

        [JsonIgnore]
        [InverseProperty("SourceGroup")]
        public virtual ICollection<Source> Sources { get; set; }
    }
}
