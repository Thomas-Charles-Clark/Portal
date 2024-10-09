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
    [Table("LawfulBasis", Schema = "gdpr")]
    public class LawfulBasis
    {
        [Key]
        public byte LawfulBasisID { get; set; }

        public string Name { get; set; }

        [JsonIgnore]
        [InverseProperty("LawfulBasis")]
        public virtual ICollection<Source> Sources { get; set; }
    }
}
