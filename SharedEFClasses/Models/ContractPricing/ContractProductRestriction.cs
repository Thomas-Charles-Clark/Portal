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
    [Table("ContractProductRestrictions", Schema = "portal")]
    public class ContractProductRestriction
    {
        [Key]
        public short ContractProductRestrictionID { get; set; }

        public byte ProductGroupID { get; set; }    

        public short? ItemTypeID { get; set; }

        public decimal MinimumAcceptableGrossMargin { get; set; }
        
        public DateTime CreatedDT { get; set; }

        public DateTime? ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [ForeignKey("ProductGroupID")]
        public virtual ProductGroup ProductGroup { get; set; }

        [ForeignKey("ItemTypeID")]
        public virtual ItemType ItemType { get; set; }
    }
}
