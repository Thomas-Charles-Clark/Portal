using Newtonsoft.Json;
using SharedEFClasses.Models.Products;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("ParcelLine", Schema = "Mertex")]
    public class ParcelLine
    {
        [Key]
        public long ParcelLineID { get; set; }

        public long ParcelHeadID { get; set; }

        public int ParcelLineNumber { get; set; }

        public string DespatchLineID { get; set; }

        public string ProductCode { get; set; }

        public decimal? QuantityDespatched { get; set; }

        public decimal? QuantityInvoiced { get; set; }

        public string Batch { get; set; }

        public string Piece { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public string ErrorDetails { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Error { get; set; }

        public DateTime? CompletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Completed { get; set; }

        [JsonIgnore]
        [ForeignKey("ParcelHeadID")]
        public virtual ParcelHead ParcelHead { get; set; }

        [JsonIgnore]
        [ForeignKey("DespatchLineID")]
        public virtual DespatchLine DespatchLine { get; set; }

        [NotMapped]
        public Product Product
        {
            get
            {
                return new PortalDbContext().Products.Where(p => p.Code == ProductCode).SingleOrDefault();
            }
        }
    }
}
