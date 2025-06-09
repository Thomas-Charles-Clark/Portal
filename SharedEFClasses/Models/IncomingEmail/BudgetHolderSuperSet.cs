using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SharedEFClasses.Models.ActiveDirectory;
using SharedEFClasses.Models.MertexLive;

namespace SharedEFClasses.Models.IncomingEmail
{
    [Table("BudgetHolderSuperSet", Schema = "IncomingEmail")]
    public class BudgetHolderSuperSet
    {
        [Key]
        [Column(Order = 1)]
        public short GroupID { get; set; }

        [Key]
        [Column(Order = 2)]
        public string BudgetHolderCode { get; set; }

        [Key]
        [Column(Order = 3)]
        public string SupplierCode { get; set; }

        [Key]
        [Column(Order = 4)]
        public string SupplierTypeCode { get; set; }

        [ForeignKey("GroupID")]
        public virtual ActiveDirectoryGroup Department { get; set; }

        [ForeignKey("BudgetHolderCode")]
        public virtual BudgetHolder BudgetHolder { get; set; }

        [ForeignKey("SupplierCode")]
        public virtual SupplierLive Supplier { get; set; }

        [ForeignKey("SupplierTypeCode")]
        public virtual SupplierTypeLive SupplierType { get; set; }
    }
}
