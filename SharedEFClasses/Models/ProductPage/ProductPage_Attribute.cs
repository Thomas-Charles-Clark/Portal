using Newtonsoft.Json;

using SharedEFClasses.Models.Attributes;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("ProductPage_Attribute", Schema = "dbo")]
    public class ProductPage_Attribute
    {
        [Key]
        [Column(Order = 1)]
        public int ProductPageID { get; set; }

        [Key]
        [Column(Order = 2)]
        public short AttributeID { get; set; }

        [JsonIgnore]
        [ForeignKey("ProductPageID")]
        public virtual ProductPage ProductPage { get; set; }

        [ForeignKey("AttributeID")]
        public virtual Attributes.Attribute Attribute { get; set; }
    }
}
