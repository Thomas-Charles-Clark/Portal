using Newtonsoft.Json;
using SharedEFClasses.Models.Products;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("DespatchLine", Schema = "Mertex")]
    public class DespatchLine
    {
        [Key]
        public string DespatchLineID { get; set; }

        public string DespatchHeadID { get; set; }

        public string Source { get; set; }

        public string ProductCode { get; set; }

        public decimal? QuantityDespatched { get; set; }

        public decimal? QuantityInvoiced { get; set; }

        public string ParcelJSON { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public object ErrorDetails { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Error { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Completed { get; set; }

        public DateTime? ParcelHeadUpdatedDT { get; set; }

        public DateTime? ParcelLineUpdatedDT { get; set; }

        [JsonIgnore]
        [ForeignKey("DespatchHeadID")]
        public virtual DespatchHead DespatchHead { get; set; }

        public virtual ICollection<ParcelLine> ParcelLines { get; set; }

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
