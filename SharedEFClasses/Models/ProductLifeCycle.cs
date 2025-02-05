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
    [Table("ProductLifeCycle", Schema = "portal")]
    public class ProductLifeCycle
    {
        [Key]
        public byte ProductLifeCycleID { get; set; }

        public string Name { get; set; }
        
        [JsonIgnore]
        [InverseProperty("ProductLifeCycle")]
        public virtual ICollection<MertexProductClassificationSuperSet> MertexProductClassificationSuperSetRecords { get; set; }
    
        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }
    }
}
