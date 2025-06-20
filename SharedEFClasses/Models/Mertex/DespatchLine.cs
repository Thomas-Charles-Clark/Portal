using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace SharedEFClasses.Models.Mertex
{
    [Table("DespatchLine", Schema = "Mertex")]
    public partial class DespatchLine
    {
        [Key]
        [Column("DespatchLineID")]
        [StringLength(30)]
        public string DespatchLineID { get; set; }

        [Column("DespatchHeadID")]
        [StringLength(25)]
        public string DespatchHeadID { get; set; }

        [StringLength(20)]
        public string Source { get; set; }

        [StringLength(50)]
        public string ProductCode { get; set; }

        [Column()]
        public decimal? QuantityDespatched { get; set; }

        [Column()]
        public decimal? QuantityInvoiced { get; set; }

        [Column("ParcelJSON")]
        public string ParcelJSON { get; set; }

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

        public bool? Completed { get; set; }

        [Column("ParcelHeadUpdatedDT")]
        public DateTime? ParcelHeadUpdatedDT { get; set; }

        [Column("ParcelLineUpdatedDT")]
        public DateTime? ParcelLineUpdatedDT { get; set; }

        [JsonIgnore]
        [ForeignKey("DespatchHeadID")]
        [InverseProperty("DespatchLines")]
        public virtual DespatchHead DespatchHead { get; set; }

        [InverseProperty("DespatchLine")]
        public virtual ICollection<ParcelLine> ParcelLines { get; set; } = new List<ParcelLine>();

        [NotMapped]
        public SharedEFClasses.Models.Products.Product Product
        {
            get
            {
                return new PortalDbContext().Products.Where(p => p.Code == ProductCode).SingleOrDefault();
            }
        }
    }
}

