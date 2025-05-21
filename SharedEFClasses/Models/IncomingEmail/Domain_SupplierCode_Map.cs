using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.IncomingEmail
{
    [Table("Domain_SupplierCode_Map", Schema = "IncomingEmail")]
    public partial class Domain_SupplierCode_Map
    {
        [Key]
        [Column(Order = 1)]
        [StringLength(256)]
        public string Domain { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(50)]
        public string SupplierCode { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }
    }
}
