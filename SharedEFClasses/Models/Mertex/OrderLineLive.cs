using Newtonsoft.Json;

using SharedEFClasses.Utilities;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("OrderLine", Schema = "Mertex")]
    public partial class OrderLineLive
    {
        [Key]
        [Column("OrderLineID")]
        [StringLength(30)]
        public string OrderLineID { get; set; }

        [Column("OrderID")]
        [StringLength(25)]
        public string OrderID { get; set; }

        public short LineNumber { get; set; }

        [StringLength(500)]
        public string CustomerLineReference { get; set; }

        [StringLength(50)]
        public string ProductCode { get; set; }

        [StringLength(255)]
        public string ProductDescription { get; set; }

        [Column()]
        public decimal QuantityOrdered { get; set; }

        [Column()]
        public decimal? QuantityCancelled { get; set; }

        public bool BackOrderIndicator { get; set; }

        [Column("LineStatusID")]
        public byte? LineStatusID { get; set; }

        [StringLength(255)]
        public string DetailedLineStatus { get; set; }

        [Column("LineStatusDT")]
        public DateTime? LineStatusDT { get; set; }

        [Column("DespatchHeadID")]
        [StringLength(25)]
        public string DespatchHeadID { get; set; }

        [Column("DespatchLineID")]
        [StringLength(30)]
        public string DespatchLineID { get; set; }

        [Column(TypeName = "money")]
        public decimal? DiscountPercentage { get; set; }

        [Column(TypeName = "money")]
        public decimal? UnitValueSterling { get; set; }

        [Column(TypeName = "money")]
        public decimal? LineValueSterling { get; set; }

        [Column(TypeName = "money")]
        public decimal? LineDiscountValueSterling { get; set; }

        [Column("LineVATValueSterling", TypeName = "money")]
        public decimal? LineVatvalueSterling { get; set; }

        [Column(TypeName = "money")]
        public decimal? UnitValueCurrency { get; set; }

        [Column(TypeName = "money")]
        public decimal? LineValueCurrency { get; set; }

        [Column(TypeName = "money")]
        public decimal? LineDiscountValueCurrency { get; set; }

        [Column("LineVATValueCurrency", TypeName = "money")]
        public decimal? LineVatvalueCurrency { get; set; }

        [Column("VATCode")]
        [StringLength(2)]
        public string Vatcode { get; set; }

        [Column("VATRate", TypeName = "money")]
        public decimal? Vatrate { get; set; }

        [Column("ModifiedDT")]
        public DateTime ModifiedDT { get; set; }

        [Column("CreatedDT")]
        public DateTime CreatedDT { get; set; }

        [Column("DeletedDT")]
        public DateTime? DeletedDT { get; set; }

        [StringLength(4000)]
        public string ErrorDetails { get; set; }

        public bool? Deleted { get; set; }

        public bool? Error { get; set; }

        [Column("CompletedDT")]
        public DateTime? CompletedDT { get; set; }

        public bool? Cancelled { get; set; }

        public bool? Completed { get; set; }

        [Column("EstimatedDespatchDT")]
        public DateTime? EstimatedDespatchDT { get; set; }

        [StringLength(10)]
        public string StockLocationCode { get; set; }

        [Column("PurchaseOrderLineID")]
        [StringLength(30)]
        public string PurchaseOrderLineID { get; set; }

        [StringLength(50)]
        public string PartnerProductCode { get; set; }

        [StringLength(1)]
        public string ReserveFlag { get; set; }

        [Column(TypeName = "date")]
        public DateTime? SuggestedDeliveryDate { get; set; }

        [ForeignKey("OrderID")]
        [InverseProperty("OrderLines")]
        public virtual OrderHeadLive Order { get; set; }




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
        public SharedEFClasses.Models.Products.Product Product
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