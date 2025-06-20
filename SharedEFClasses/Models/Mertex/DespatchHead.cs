using Newtonsoft.Json;
using SharedEFClasses.Utilities;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace SharedEFClasses.Models.Mertex
{

    [Table("DespatchHead", Schema = "Mertex")]
    public partial class DespatchHead
    {
        [Key]
        [Column("DespatchHeadID")]
        [StringLength(25)]
        public string DespatchHeadID { get; set; }

        [StringLength(20)]
        public string Source { get; set; }

        [Column("DespatchedDT")]
        public DateTime? DespatchedDT { get; set; }

        [StringLength(50)]
        public string DeliveryName { get; set; }

        [StringLength(60)]
        public string DeliveryAddressLine1 { get; set; }

        [StringLength(60)]
        public string DeliveryAddressLine2 { get; set; }

        [StringLength(50)]
        public string DeliveryTown { get; set; }

        [StringLength(40)]
        public string DeliveryCounty { get; set; }

        [StringLength(20)]
        public string DeliveryPostcode { get; set; }

        [StringLength(3)]
        public string DeliveryCountryCode { get; set; }

        [StringLength(10)]
        public string HaulierCode { get; set; }

        [StringLength(10)]
        public string CarriageCode { get; set; }

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

        [Column(TypeName = "money")]
        public decimal? DeliveryChargeSterling { get; set; }

        [Column(TypeName = "money")]
        public decimal? DeliveryChargeCurrency { get; set; }

        [StringLength(20)]
        public string DespatchedBy { get; set; }

        [InverseProperty("DespatchHead")]
        public virtual ICollection<DespatchLine> DespatchLines { get; set; } = new List<DespatchLine>();

        [InverseProperty("DespatchHead")]
        public virtual ICollection<ParcelHead> ParcelHeads { get; set; } = new List<ParcelHead>();


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