using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.StockManagement
{
    [Table("StatusGroup", Schema = "StockManagement")]
    public partial class StatusGroup
    {
        [Key]
        public byte StatusGroupID { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        public byte SortOrder { get; set; }

        [StringLength(255)]
        public string Description { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        [InverseProperty("StatusGroup")]
        public virtual ICollection<StockManagementProduct> Products { get; set; } = new List<StockManagementProduct>();
    }
}
