using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.Attributes
{
    public class Attribute
    {
        [Key]
        public short AttributeID { get; set; }
        public byte AttributeGroupID { get; set; }
        public string Name { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public virtual AttributeGroup AttributeGroup { get; set; }
    }
}
