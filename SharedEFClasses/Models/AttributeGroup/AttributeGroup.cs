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
    public class AttributeGroup
    {
        [Key]
        public byte AttributeGroupID { get; set; }
        public string Name { get; set; }

        public bool TradeOnly { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [JsonIgnore]
        public virtual ICollection<Attribute> Attributes { get; set; }
    }
}
