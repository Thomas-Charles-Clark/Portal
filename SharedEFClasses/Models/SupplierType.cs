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
    [Table("SupplierType", Schema = "dbo")]
    public class SupplierType
    {
        [Key]
        public byte SupplierTypeID { get; set; }

        public string Name { get; set; }

        [JsonIgnore]
        [InverseProperty("SupplierType")]
        public virtual ICollection<MertexProductClassificationSuperSet> MertexProductClassificationSuperSetRecords { get; set; }

        [JsonIgnore]
        [InverseProperty("SupplierType")]
        public virtual ICollection<Supplier> Suppliers { get; set; }
    }
}
