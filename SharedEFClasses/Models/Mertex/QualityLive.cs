using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.Mertex
{
    [Table("Quality", Schema = "Mertex")]
    public partial class QualityLive
    {
        [Key]
        [StringLength(50)]
        public string Code { get; set; }

        [StringLength(100)]
        public string Name { get; set; }

        [Column("GSM")]
        public decimal? Gsm { get; set; }

        [Column("GLM")]
        public decimal? Glm { get; set; }

        [StringLength(15)]
        public string CompositionCode { get; set; }

        [Column()]
        public decimal? Width { get; set; }
    }
}