using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.Mertex
{
    [Table("ParcelHead", Schema = "Mertex")]
    public partial class ParcelHead
    {
        [Key]
        [Column("ParcelHeadID")]
        public long ParcelHeadID { get; set; }

        [Column("DespatchHeadID")]
        [StringLength(25)]
        public string DespatchHeadID { get; set; }

        [Column("ParcelID")]
        [StringLength(50)]
        public string ParcelID { get; set; }

        [StringLength(40)]
        public string ParcelNumber { get; set; }

        [StringLength(10)]
        public string HaulierCode { get; set; }

        [Column("TrackingURL")]
        [StringLength(500)]
        public string TrackingURL { get; set; }

        [Column("CreatedDT")]
        public DateTime CreatedDT { get; set; }

        [Column("ModifiedDT")]
        public DateTime ModifiedDT { get; set; }

        [Column("DeletedDT")]
        public DateTime? DeletedDT { get; set; }

        public bool? Deleted { get; set; }

        [StringLength(4000)]
        public string ErrorDetails { get; set; }

        public bool? Error { get; set; }

        [Column("CompletedDT")]
        public DateTime? CompletedDT { get; set; }

        public bool? Completed { get; set; }

        [Column("ParcelLineUpdatedDT")]
        public DateTime? ParcelLineUpdatedDT { get; set; }

        [Column()]
        public decimal? NetWeight { get; set; }

        [Column()]
        public decimal? Width { get; set; }

        [Column()]
        public decimal? Height { get; set; }

        [Column()]
        public decimal? Depth { get; set; }

        [Column()]
        public decimal? VolumetricWeight { get; set; }

        [StringLength(50)]
        public string TrackingNumber { get; set; }

        [Column("PCLNo")]
        [StringLength(40)]
        public string Pclno { get; set; }

        [JsonIgnore]
        [ForeignKey("DespatchHeadID")]
        [InverseProperty("ParcelHeads")]
        public virtual DespatchHead DespatchHead { get; set; }

        [InverseProperty("ParcelHead")]
        public virtual ICollection<ParcelLine> ParcelLines { get; set; } = new List<ParcelLine>();
    }
}