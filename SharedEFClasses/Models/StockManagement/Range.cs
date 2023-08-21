using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SharedEFClasses.Models.Products;

namespace SharedEFClasses.Models.StockManagement
{
    [Table("Range", Schema = "StockManagement")]
    public class Range
    {
        [Key]
        public long RangeID { get; set; }
        public int BranchID { get; set; }
        public int ProductID { get; set; }
        public decimal Quantity { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime ModifiedDT { get; set; }
        public int ModifiedMemberID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [ForeignKey("BranchID")]
        public virtual Branch Branch { get; set; }

        [ForeignKey("ProductID")]
        public virtual Product Product { get; set; }

        [ForeignKey("ModifiedMemberID")]
        public virtual Member LastModifiedBy { get; set; }
    }
}
