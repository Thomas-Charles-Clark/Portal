using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace SharedEFClasses.Models.Attributes
{
    public class Attribute
    {
        [Key]
        public short AttributeID { get; set; }
        public byte AttributeGroupID { get; set; }
        public string Name { get; set; }
        public byte SortOrder { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public virtual AttributeGroup AttributeGroup { get; set; }

        [JsonIgnore]
        [InverseProperty("Attribute")]
        public virtual ICollection<ProductPage_Attribute> ProductPages { get; set; }
    }
}
