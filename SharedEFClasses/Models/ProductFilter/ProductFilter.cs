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
    [Table("ProductFilter", Schema = "portal")]
    public class ProductFilter
    {
        [Key]
        public byte ProductFilterID { get; set; }

        public string Name { get; set; }

        public string Value { get; set; }

        public byte ProductFilterGroupID { get; set; }

        public bool IsProduct { get; set; }

        public byte SortOrder { get; set; }

        public byte? ProductTypeID { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [ForeignKey("ProductFilterGroupID")]
        public virtual ProductFilterGroup ProductFilterGroup { get; set; }

        [ForeignKey("ProductTypeID")]
        public virtual ProductType ProductType { get; set; }
    }
}
