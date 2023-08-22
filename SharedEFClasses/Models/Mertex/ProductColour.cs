using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("ProductColour", Schema = "Mertex")]
    public class ProductColour
    {
        [Key]
        public int ProductColourID { get; set; }

        public string Name { get; set; }

        //[JsonIgnore]
        //[InverseProperty("ProductColour")]
        //public virtual ICollection<ProductLive> Products { get; set; }
    }
}
