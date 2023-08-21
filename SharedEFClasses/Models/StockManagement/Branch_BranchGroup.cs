using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedEFClasses.Models.StockManagement
{
    [Table("Branch_BranchGroup", Schema = "StockManagement")]
    public class Branch_BranchGroup
    {
        [Key]
        [Column(Order = 1)]
        public int BranchID { get; set; }

        [Key]
        [Column(Order = 2)]
        public int BranchGroupID { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public int ModifiedMemberID { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [ForeignKey("BranchID")]
        public virtual Branch Branch { get; set; }

        [ForeignKey("BranchGroupID")]
        public virtual BranchGroup BranchGroup {get;set;}
        
        [ForeignKey("ModifiedMemberID")]
        public virtual Member LastModifiedBy { get; set; }
    }
}
