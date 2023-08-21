using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("ParcelLine", Schema = "Mertex")]
    public partial class ParcelLine
    {
        [Key]
        [Column("ParcelLineID")]
        public long ParcelLineID { get; set; }

        [Column("ParcelHeadID")]
        public long ParcelHeadID { get; set; }

        public int ParcelLineNumber { get; set; }

        [Column("DespatchLineID")]
        [StringLength(30)]
        public string DespatchLineID { get; set; }

        [StringLength(50)]
        public string ProductCode { get; set; }

        [Column()]
        public decimal? QuantityDespatched { get; set; }

        [Column()]
        public decimal? QuantityInvoiced { get; set; }

        [StringLength(50)]
        public string Batch { get; set; }

        [StringLength(50)]
        public string Piece { get; set; }

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

        [ForeignKey("DespatchLineID")]
        [InverseProperty("ParcelLines")]
        public virtual DespatchLine DespatchLine { get; set; }

        [ForeignKey("ParcelHeadID")]
        [InverseProperty("ParcelLines")]
        public virtual ParcelHead ParcelHead { get; set; }

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
