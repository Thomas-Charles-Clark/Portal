using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("ParcelHead", Schema = "Mertex")]
    public class ParcelHead
    {
        [Key]
        public long ParcelHeadID { get; set; }

        public string DespatchHeadID { get; set; }

        public string ParcelID { get; set; }

        public string ParcelNumber { get; set; }

        public string HaulierCode { get; set; }

        public string TrackingURL { get; set; }

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

        public DateTime? ParcelLineUpdatedDT { get; set; }

        public decimal? NetWeight { get; set; }

        public decimal? Width { get; set; }

        public decimal? Height { get; set; }

        public decimal? Depth { get; set; }

        public decimal? VolumetricWeight { get; set; }

        public string TrackingNumber { get; set; }

        public virtual ICollection<ParcelLine> ParcelLines { get; set; }

        [JsonIgnore]
        [NotMapped]
        public DespatchHead DespatchHead 
        { 
            get 
            {
                return new PortalDbContext().DespatchHeads.Where(p => p.DespatchHeadID == DespatchHeadID).FirstOrDefault();    
            } 
        }
    }
}