using Newtonsoft.Json;

using SharedEFClasses.Models.Products;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models
{
    [Table("Supplier", Schema = "dbo")]
    public class Supplier
    {
        [Key]
        public int SupplierID { get; set; }

        public string Code { get; set; }

        public string Name { get; set; }

        [JsonIgnore]
        [InverseProperty("DefaultSupplier")]
        public virtual ICollection<Product> DefaultSupplierForProducts { get; set; }
    }
}
