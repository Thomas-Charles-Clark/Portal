using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.Mertex
{
    [Table("PurchaseOrderLine", Schema = "Mertex")]
    public partial class PurchaseOrderLine
    {
        [Key]
        [Column("PurchaseOrderLineID")]
        [StringLength(30)]
        public string PurchaseOrderLineID { get; set; }

        [Column("PurchaseOrderHeadID")]
        [StringLength(25)]
        public string PurchaseOrderHeadID { get; set; }

        public short? PurchaseOrderLineNumber { get; set; }

        [Column("OrderID")]
        [StringLength(25)]
        public string OrderID { get; set; }

        [StringLength(50)]
        public string ProductCode { get; set; }

        [Column()]
        public decimal? QuantityOrdered { get; set; }

        [Column()]
        public decimal? QuantityReceived { get; set; }

        [Column("PromisedDT", TypeName = "datetime")]
        public DateTime? PromisedDT { get; set; }

        [Column("ExpectedDT", TypeName = "datetime")]
        public DateTime? ExpectedDT { get; set; }

        public bool? DateConfirmed { get; set; }

        public bool? LineComplete { get; set; }

        [Column("LineUnitPriceSTG", TypeName = "money")]
        public decimal? LineUnitPriceStg { get; set; }

        [Column("LineUnitPriceCURR", TypeName = "money")]
        public decimal? LineUnitPriceCurr { get; set; }

        [StringLength(10)]
        public string StockUnitCode { get; set; }

        [StringLength(50)]
        public string SupplierProductCode { get; set; }

        public bool? SampleRequired { get; set; }

        [StringLength(255)]
        public string DetailedPurchaseOrderLineStatus { get; set; }

        [Column("CreatedDT")]
        public DateTime CreatedDT { get; set; }

        [Column("ModifiedDT")]
        public DateTime ModifiedDT { get; set; }

        [Column("DeletedDT")]
        public DateTime? DeletedDT { get; set; }

        public bool? Deleted { get; set; }

        [Column("CompletedDT")]
        public DateTime? CompletedDT { get; set; }

        public bool? Completed { get; set; }

        [StringLength(4000)]
        public string ErrorDetails { get; set; }

        public bool? Error { get; set; }
    }
}