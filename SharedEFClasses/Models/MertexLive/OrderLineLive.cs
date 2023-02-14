using Newtonsoft.Json;
using SharedEFClasses.Models.Products;
using SharedEFClasses.Utilities;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("OrderLine", Schema = "Mertex")]
    public class OrderLineLive
    {
        [Key]
        public string OrderLineID { get; set; }

        public string OrderID { get; set; }

        public short LineNumber { get; set; }

        public string CustomerLineReference { get; set; }

        public string ProductCode { get; set; }

        public string ProductDescription { get; set; }

        public decimal QuantityOrdered { get; set; }

        public decimal? QuantityCancelled { get; set; }

        public bool BackOrderIndicator { get; set; }

        public byte? LineStatusID { get; set; }

        public string DetailedLineStatus { get; set; }

        public DateTime? LineStatusDT { get; set; }

        public string DespatchHeadID { get; set; }

        public string DespatchLineID { get; set; }

        public decimal? DiscountPercentage { get; set; }

        public decimal? UnitValueSterling { get; set; }

        public decimal? LineValueSterling { get; set; }

        public decimal? LineDiscountValueSterling { get; set; }

        public decimal? LineVATValueSterling { get; set; }

        public decimal? UnitValueCurrency { get; set; }

        public decimal? LineValueCurrency { get; set; }

        public decimal? LineDiscountValueCurrency { get; set; }

        public decimal? LineVATValueCurrency { get; set; }

        public string VATCode { get; set; }

        public decimal? VATRate { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public string ErrorDetails { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Error { get; set; }

        public DateTime? CompletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Completed { get; set; }

        public DateTime? EstimatedDespatchDT { get; set; }

        public string StockLocationCode { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Cancelled { get; set; }

        [JsonIgnore]
        public virtual DespatchHead DespatchHead { get; set; }

        [JsonIgnore]
        [ForeignKey("OrderID")]
        public virtual OrderHeadLive OrderHead { get; set; }

        [NotMapped]
        public decimal? Quantity
        {
            get
            {
                return QuantityOrdered - (QuantityCancelled ?? 0m);
            }
        }

        [NotMapped]
        public Product Product
        {
            get
            {
                return new PortalDbContext().Products.Where(p => p.Code == ProductCode).SingleOrDefault();
            }
        }

        [NotMapped]
        public string EstimatedDespatchedDate
        {
            get
            {
                if (EstimatedDespatchDT.HasValue)
                {
                    if (EstimatedDespatchDT?.Day.ToString("d").Length == 1)
                    {
                        return EstimatedDespatchDT?.ToString("d MMMM yyyy").Insert(1, PortalFramework.GetDaySuffix(EstimatedDespatchDT.Value.Day));
                    }
                    else
                    {
                        return EstimatedDespatchDT?.ToString("dd MMMM yyyy").Insert(2, PortalFramework.GetDaySuffix(EstimatedDespatchDT.Value.Day));
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

        [JsonIgnore]
        [NotMapped]
        public DespatchLine DespatchLine
        {
            get
            {
                return new PortalDbContext().DespatchLines.Where(p => p.DespatchLineID == DespatchLineID).SingleOrDefault();
            }
        }
    }
}
