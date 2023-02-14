using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("PurchaseOrderLine", Schema = "Mertex")]
    public class PurchaseOrderLine
    {
        [Key]
        public string PurchaseOrderLineID { get; set; }

        public string PurchaseOrderHeadID { get; set; }

        public short? PurchaseOrderLineNumber { get; set; }

        public string OrderID { get; set; }

        public string ProductCode { get; set; }

        public decimal? QuantityOrdered { get; set; }

        public decimal? QuantityReceived { get; set; }

        public DateTime? PromisedDT { get; set; }

        public DateTime? ExpectedDT { get; set; }

        public bool? DateConfirmed { get; set; }

        public bool? LineComplete { get; set; }

        public decimal? LineUnitPriceSTG { get; set; }

        public decimal? LineUnitPriceCURR { get; set; }

        public string StockUnitCode { get; set; }

        public string SupplierProductCode { get; set; }

        public bool? SampleRequired { get; set; }

        public string DetailedPurchaseOrderLineStatus { get; set; }

        public DateTime CreatedDT { get; set; }

        public DateTime ModifiedDT { get; set; }

        public DateTime? DeletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Deleted { get; set; }

        public object CompletedDT { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Completed { get; set; }

        public object ErrorDetails { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Error { get; set; }

        [JsonIgnore]
        [ForeignKey("PurchaseOrderHeadID")]
        public virtual PurchaseOrderHead PurchaseOrderHead { get; set; }
    }
}
