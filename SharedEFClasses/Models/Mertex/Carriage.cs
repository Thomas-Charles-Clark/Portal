using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("Carriage", Schema = "Mertex")]
    public class Carriage
    {
        [Key]
        [StringLength(40)]
        public string Key { get; set; }

        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(20)]
        public string HaulierCode { get; set; }

        [StringLength(100)]
        public string Description { get; set; }

        public bool? PriorityOrder { get; set; }

        [StringLength(100)]
        public string DespatchPathway { get; set; }

        [Column("GBIndicator")]
        public bool Gbindicator { get; set; }
    }
}