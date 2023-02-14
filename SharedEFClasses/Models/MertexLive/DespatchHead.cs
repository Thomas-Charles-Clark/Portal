using Newtonsoft.Json;
using SharedEFClasses.Utilities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("DespatchHead", Schema = "Mertex")]
    public class DespatchHead
    {
        [Key]
        public string DespatchHeadID { get; set; }

        public string Source { get; set; }

        public DateTime? DespatchedDT { get; set; }

        public string DeliveryName { get; set; }

        public string DeliveryAddressLine1 { get; set; }

        public string DeliveryAddressLine2 { get; set; }

        public string DeliveryTown { get; set; }

        public string DeliveryCounty { get; set; }

        public string DeliveryPostcode { get; set; }

        public string DeliveryCountryCode { get; set; }

        public string HaulierCode { get; set; }

        public string CarriageCode { get; set; }

        public string ParcelJSON { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public string ErrorDetails { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Error { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Completed { get; set; }

        public decimal? DeliveryChargeSterling { get; set; }

        public decimal? DeliveryChargeCurrency { get; set; }

        public virtual ICollection<DespatchLine> DespatchLines { get; set; }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        [JsonIgnore]
        [NotMapped]
        public List<OrderLineLive> OrderLines
        {
            get
            {
                return new PortalDbContext().OrderLines_Live.Where(p => p.DespatchHeadID == DespatchHeadID).ToList();
            }
        }


        [NotMapped]
        public List<ParcelHead> ParcelHeads
        {
            get
            {
                return new PortalDbContext().ParcelHeads.Where(p => p.DespatchHeadID == DespatchHeadID).ToList();
            }
        }

        [NotMapped]
        public object CoreParcelData
        { 
            get
            {
                return JsonConvert.DeserializeObject(ParcelJSON ?? "[]");
            }
            set
            {

            }
        }

        [NotMapped]
        public object ParcelTrackingData
        {
            get
            {
                return JsonConvert.DeserializeObject(DespatchLines.FirstOrDefault()?.ParcelJSON ?? "[]");
            }
            set
            {

            }
        }

        [NotMapped]
        public string DespatchedDate
        {
            get
            {
                if (DespatchedDT.HasValue)
                {
                    if (DespatchedDT?.Day.ToString("d").Length == 1)
                    {
                        return DespatchedDT?.ToString("d MMMM yyyy").Insert(1, PortalFramework.GetDaySuffix(DespatchedDT.Value.Day));
                    }
                    else
                    {
                        return DespatchedDT?.ToString("dd MMMM yyyy").Insert(2, PortalFramework.GetDaySuffix(DespatchedDT.Value.Day));
                    }
                }
                else
                {
                    return null;
                }
            }
            set
            {

            }
        }
    }
}
