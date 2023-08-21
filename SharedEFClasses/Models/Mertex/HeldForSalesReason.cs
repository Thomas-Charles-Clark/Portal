using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("HeldForSalesReason", Schema = "Mertex")]
    public partial class HeldForSalesReason
    {
        [Key]
        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(200)]
        public string Name { get; set; }
    }
}