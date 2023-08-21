using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedEFClasses.Models.MertexLive
{
    [Table("ClaimLine", Schema = "Mertex")]
    public class ClaimLine
    {
        [Key]
        [Column("ClaimLineID")]
        [StringLength(30)]
        public string ClaimLineID { get; set; }

        [Column("ClaimID")]
        [StringLength(25)]
        public string ClaimID { get; set; }

        [Column("OrderLineID")]
        [StringLength(30)]
        public string OrderLineID { get; set; }

        [StringLength(50)]
        public string ProductCode { get; set; }

        [StringLength(10)]
        public string FaultCode { get; set; }

        [StringLength(50)]
        public string InvoiceNumber { get; set; }

        [Column("InvoiceDT")]
        public DateTime? InvoiceDT { get; set; }

        [Column()]
        public decimal? ClaimQuantity { get; set; }

        [Column()]
        public decimal? AcceptedQuantity { get; set; }

        [Column()]
        public decimal? ReturnedQuantity { get; set; }

        [Column()]
        public decimal? CreditAmount { get; set; }

        public bool? ReturnToStock { get; set; }

        [Column()]
        public decimal? OrderPriceSterlingEx { get; set; }

        [Column()]
        public decimal? DiscountPercentage { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }

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