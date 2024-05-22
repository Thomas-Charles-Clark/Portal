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
    [Table("ProductFilterGroup", Schema = "portal")]
    public class ProductFilterGroup
    {
        [Key]
        public byte ProductFilterGroupID { get; set; }
    
        public string Name { get; set; }

        public byte SortOrder { get; set; }

        [JsonIgnore]
        [InverseProperty("ProductFilterGroup")]
        public virtual ICollection<ProductFilter> ProductFilters { get; set; }

        [JsonIgnore]
        [InverseProperty("ProductFilterGroup")]
        public virtual ICollection<Treatment> Treatments { get; set; }

        [NotMapped]
        public string ProductTypeIDs
        {
            get
            {
                return String.Join(",", ProductFilters?.Select(pf => pf.ProductTypeID).Distinct() ?? new byte?[] { } );
            }
        }
    }
}
